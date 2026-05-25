import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Force this route to run on the Edge Network for low latency
export const runtime = 'edge'

// Edge-compatible SHA-256 Hashing (Standard Node 'crypto' is not available on the Edge)
async function hashKeyEdge(key: string) {
  const msgBuffer = new TextEncoder().encode(key)
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

async function handleProxy(request: NextRequest, props: { params: Promise<{ projectId: string; path?: string[] }> }) {
  const params = await props.params
  const projectId = params.projectId
  
  // Reconstruct any additional URL paths (e.g., /api/users)
  const pathArray = params.path || []
  const subPath = pathArray.length > 0 ? `/${pathArray.join('/')}` : ''

  // 1. Auth Check: Extract Bearer Token
  const authHeader = request.headers.get('authorization')
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Unauthorized: Missing or invalid Bearer token' }, { status: 401 })
  }
  
  const rawKey = authHeader.split(' ')[1]

  // 2. Hash the incoming key
  const keyHash = await hashKeyEdge(rawKey)

  // 3. Database Verification (Using Service Role to bypass RLS)
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  // Query the key and join the associated project target_url in one fast trip
  const { data: keyData, error: keyError } = await supabase
    .from('api_keys')
    .select('is_active, projects(target_url)')
    .eq('project_id', projectId)
    .eq('key_hash', keyHash)
    .single()

  // 4. Reject if invalid or inactive
  if (keyError || !keyData || !keyData.is_active) {
    return NextResponse.json({ error: 'Unauthorized: Invalid or revoked API key' }, { status: 401 })
  }

  // 5. Construct the final Target URL
  // We typecast projects because Supabase joins return a relational object
  const projectInfo = keyData.projects as unknown as { target_url: string }
  const targetBaseUrl = projectInfo.target_url.replace(/\/$/, '') // Remove trailing slash if user added one
  
  // Combine base URL + dynamic path + any URL queries (?limit=10)
  const targetUrl = `${targetBaseUrl}${subPath}${request.nextUrl.search}`

  // 6. Forward the Request
  const proxyHeaders = new Headers(request.headers)
  proxyHeaders.delete('host') // Remove the gateway host so the fetch API uses the target's host

  try {
    const fetchOptions: RequestInit = {
      method: request.method,
      headers: proxyHeaders,
      redirect: 'manual',
    }

    // Only attach a body for methods that allow it
    if (request.method !== 'GET' && request.method !== 'HEAD') {
      fetchOptions.body = await request.arrayBuffer()
    }

    // Execute the proxy request
    const targetResponse = await fetch(targetUrl, fetchOptions)

    // 7. Return the response back to the client
    const responseHeaders = new Headers(targetResponse.headers)

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

// Map all standard HTTP methods to our proxy handler
export { handleProxy as GET, handleProxy as POST, handleProxy as PUT, handleProxy as DELETE, handleProxy as PATCH }