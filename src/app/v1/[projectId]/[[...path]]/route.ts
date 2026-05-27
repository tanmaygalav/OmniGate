import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { Redis } from '@upstash/redis'
import { Ratelimit } from '@upstash/ratelimit'

export const runtime = 'edge'

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})

async function hashKeyEdge(key: string) {
  const msgBuffer = new TextEncoder().encode(key)
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

async function handleProxy(
  request: NextRequest, 
  props: { params: Promise<{ projectId: string; path?: string[] }> }
) {
  const params = await props.params
  const projectId = params.projectId
  const pathArray = params.path || []
  const subPath = pathArray.length > 0 ? `/${pathArray.join('/')}` : ''

  // 1. Auth Check
  const authHeader = request.headers.get('authorization')
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Unauthorized: Missing or invalid Bearer token' }, { status: 401 })
  }
  const rawKey = authHeader.split(' ')[1]
  const keyHash = await hashKeyEdge(rawKey)

  // 2. Database Verification
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { data: keyData, error: keyError } = await supabase
    .from('api_keys')
    .select('is_active, projects(target_url, rate_limit, rate_limit_window)')
    .eq('project_id', projectId)
    .eq('key_hash', keyHash)
    .single()

  if (keyError || !keyData || !keyData.is_active) {
    return NextResponse.json({ error: 'Unauthorized: Invalid or revoked API key' }, { status: 401 })
  }
  const projectInfo = keyData.projects as unknown as { target_url: string, rate_limit: number, rate_limit_window: string }

  // 3. Rate Limiting
  const identifier = `limit_${projectId}_${keyHash}`
  const ratelimit = new Ratelimit({
    redis: redis,
    limiter: Ratelimit.slidingWindow(projectInfo.rate_limit, projectInfo.rate_limit_window as any),
    analytics: true, 
  })

  const { success, limit, remaining, reset } = await ratelimit.limit(identifier)
  const rateLimitHeaders = {
    'X-RateLimit-Limit': limit.toString(),
    'X-RateLimit-Remaining': remaining.toString(),
    'X-RateLimit-Reset': reset.toString(),
  }

  if (!success) {
    return NextResponse.json(
      { error: 'Too Many Requests: Rate limit exceeded for this API Key' },
      { status: 429, headers: rateLimitHeaders }
    )
  }

  // 4. Construct Target URL
  const targetBaseUrl = projectInfo.target_url.replace(/\/$/, '') 
  const searchParams = new URLSearchParams(request.nextUrl.search)
  searchParams.delete('projectId')
  searchParams.delete('path')
  const cleanQuery = searchParams.toString() ? `?${searchParams.toString()}` : ''
  const targetUrl = `${targetBaseUrl}${subPath}${cleanQuery}`

  // Proxy Preparation
  const proxyHeaders = new Headers(request.headers)
  proxyHeaders.delete('host') 

  try {
    const startTime = Date.now()
    
    let responseBody: string | ReadableStream<Uint8Array> | null = null
    let finalStatus = 200
    let finalStatusText = 'OK'
    let finalHeaders = new Headers()
    let isCacheHit = false
    
    const cacheKey = `omnigate_cache:${projectId}:${btoa(encodeURIComponent(targetUrl))}`

    // --- CACHE READ (GET only) ---
    if (request.method === 'GET') {
      const cachedData = await redis.get(cacheKey)
      if (cachedData) {
        isCacheHit = true
        responseBody = typeof cachedData === 'object' ? JSON.stringify(cachedData) : String(cachedData)
        finalHeaders.set('Content-Type', 'application/json')
        finalHeaders.set('X-Cache', 'HIT')
      }
    }

    // --- CACHE MISS & BACKEND RETRY LOGIC ---
    if (!isCacheHit) {
      const fetchOptions: RequestInit = {
        method: request.method,
        headers: proxyHeaders,
        redirect: 'manual',
      }

      if (request.method !== 'GET' && request.method !== 'HEAD') {
        fetchOptions.body = await request.arrayBuffer()
      }

      // 5. ZERO-DOWNTIME AUTO-RETRIES 
      const MAX_RETRIES = 3;
      let attempt = 0;
      let targetResponse!: Response;

      while (attempt < MAX_RETRIES) {
        targetResponse = await fetch(targetUrl, fetchOptions)
        
        // If the backend returns a successful code OR a client error (4xx), do NOT retry.
        // We only retry on 500, 502, 503, and 504 (Server Errors).
        if (![500, 502, 503, 504].includes(targetResponse.status)) {
          break; 
        }
        
        attempt++;
        if (attempt < MAX_RETRIES) {
          // Wait 500ms before trying again
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      }

      finalStatus = targetResponse.status
      finalStatusText = targetResponse.statusText
      
      targetResponse.headers.forEach((value, key) => {
        finalHeaders.set(key, value)
      })
      finalHeaders.set('X-Cache', 'MISS')

      if (request.method === 'GET' && targetResponse.ok) {
        const responseText = await targetResponse.text()
        responseBody = responseText
        await redis.setex(cacheKey, 60, responseText)
      } else {
        responseBody = targetResponse.body
      }
    }

    const latency_ms = Date.now() - startTime

    // 6. Telemetry (Logs total latency, including the retry delays!)
    const logData = {
      timestamp: new Date().toISOString(),
      project_id: projectId,
      key_hash: keyHash,
      method: request.method,
      url: targetUrl,
      status: finalStatus,
      latency_ms: latency_ms,
      user_agent: request.headers.get('user-agent') || 'unknown'
    }

    try {
      await fetch(`https://api.europe-west2.gcp.tinybird.co/v0/events?name=gateway_logs`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.TINYBIRD_TOKEN}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(logData)
      });
    } catch (err) {
      console.error("Tinybird logging failed:", err);
    }

    // 7. Return Final Response
    Object.entries(rateLimitHeaders).forEach(([key, value]) => {
      finalHeaders.set(key, value)
    })
    finalHeaders.set('Access-Control-Allow-Origin', '*')

    return new NextResponse(responseBody, {
      status: finalStatus,
      statusText: finalStatusText,
      headers: finalHeaders,
    })

  } catch (error) {
    console.error('Proxy Error:', error)
    return NextResponse.json({ error: 'Bad Gateway: Could not reach target server' }, { status: 502 })
  }
}

export { 
  handleProxy as GET, 
  handleProxy as POST, 
  handleProxy as PUT, 
  handleProxy as DELETE, 
  handleProxy as PATCH,
  handleProxy as OPTIONS 
}