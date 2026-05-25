import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { Redis } from '@upstash/redis'
import { Ratelimit } from '@upstash/ratelimit'

export const runtime = 'edge'

// 1. Initialize Upstash Redis
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

// FIX 1: Reverted to exactly 2 arguments to satisfy Next.js RouteHandler types
async function handleProxy(
  request: NextRequest, 
  props: { params: Promise<{ projectId: string; path?: string[] }> }
) {
  const params = await props.params
  const projectId = params.projectId
  
  const pathArray = params.path || []
  const subPath = pathArray.length > 0 ? `/${pathArray.join('/')}` : ''

  // Auth Check
  const authHeader = request.headers.get('authorization')
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Unauthorized: Missing or invalid Bearer token' }, { status: 401 })
  }
  
  const rawKey = authHeader.split(' ')[1]
  const keyHash = await hashKeyEdge(rawKey)

  // Database Verification
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  // 2. Fetch the Key AND the Rate Limit configs from the Project
  const { data: keyData, error: keyError } = await supabase
    .from('api_keys')
    .select('is_active, projects(target_url, rate_limit, rate_limit_window)')
    .eq('project_id', projectId)
    .eq('key_hash', keyHash)
    .single()

  if (keyError || !keyData || !keyData.is_active) {
    return NextResponse.json({ error: 'Unauthorized: Invalid or revoked API key' }, { status: 401 })
  }

  // Typecast the relational data
  const projectInfo = keyData.projects as unknown as { target_url: string, rate_limit: number, rate_limit_window: string }

  // 3. Execute Rate Limiting
  const identifier = `limit_${projectId}_${keyHash}`
  
  const ratelimit = new Ratelimit({
    redis: redis,
    limiter: Ratelimit.slidingWindow(
      projectInfo.rate_limit, 
      projectInfo.rate_limit_window as any
    ),
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

  // 5. Forward Request
  const proxyHeaders = new Headers(request.headers)
  proxyHeaders.delete('host') 

  try {
    const fetchOptions: RequestInit = {
      method: request.method,
      headers: proxyHeaders,
      redirect: 'manual',
    }

    if (request.method !== 'GET' && request.method !== 'HEAD') {
      fetchOptions.body = await request.arrayBuffer()
    }

    const startTime = Date.now()
    const targetResponse = await fetch(targetUrl, fetchOptions)
    const latency_ms = Date.now() - startTime

    const logData = {
      timestamp: new Date().toISOString(),
      project_id: projectId,
      key_hash: keyHash,
      method: request.method,
      url: targetUrl,
      status: targetResponse.status,
      latency_ms: latency_ms,
      user_agent: request.headers.get('user-agent') || 'unknown'
    }

    // FIX 2: Create the telemetry promise
    const telemetryPromise = fetch(`https://api.europe-west2.gcp.tinybird.co/v0/events?name=gateway_logs`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.TINYBIRD_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(logData)
    })
    .then(res => { if (!res.ok) console.error("Tinybird ingestion error:", res.status) })
    .catch(err => console.error("Tinybird background logging failed:", err));

    // FIX 3: Safely cast props to access Vercel's edge context without breaking TypeScript
    const edgeContext = props as any;
    if (typeof edgeContext.waitUntil === 'function') {
      edgeContext.waitUntil(telemetryPromise);
    }

    // 5. Return Response WITH Rate Limit Headers
    const responseHeaders = new Headers(targetResponse.headers)
    Object.entries(rateLimitHeaders).forEach(([key, value]) => {
      responseHeaders.set(key, value)
    })

    return new NextResponse(targetResponse.body, {
      status: targetResponse.status,
      statusText: targetResponse.statusText,
      headers: responseHeaders,
    })

  } catch (error) {
    console.error('Proxy Error:', error)
    return NextResponse.json({ error: 'Bad Gateway: Could not reach target server' }, { status: 502 })
  }
}

// 6. Export all standard HTTP methods AND OPTIONS
export { 
  handleProxy as GET, 
  handleProxy as POST, 
  handleProxy as PUT, 
  handleProxy as DELETE, 
  handleProxy as PATCH,
  handleProxy as OPTIONS 
}