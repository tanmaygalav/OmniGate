'use client'

import { useState } from 'react'
import { Play, Clock, Activity, Terminal } from 'lucide-react'

export default function ApiPlayground({ projectId }: { projectId: string }) {
  const [method, setMethod] = useState('GET')
  const [path, setPath] = useState('/users')
  const [apiKey, setApiKey] = useState('')
  const [requestBody, setRequestBody] = useState('{\n  "query": "hello"\n}')
  
  const [response, setResponse] = useState<{
    status: number;
    statusText: string;
    body: string;
    headers: Record<string, string>;
    latency: number;
  } | null>(null)
  
  const [isLoading, setIsLoading] = useState(false)

  const handleSendRequest = async () => {
    if (!apiKey) {
      alert("Please paste an API key first!")
      return
    }

    setIsLoading(true)
    const startTime = Date.now()

    try {
      // Build the exact proxy URL
      const fullUrl = `https://omnigatev1.vercel.app/v1/${projectId}${path.startsWith('/') ? path : `/${path}`}`

      const fetchOptions: RequestInit = {
        method,
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
      }

      // Only attach body if it's not a GET request
      if (method !== 'GET') {
        fetchOptions.body = requestBody
      }

      const res = await fetch(fullUrl, fetchOptions)
      const latency = Date.now() - startTime

      // Try to format the response as pretty JSON, otherwise fall back to raw text
      const rawText = await res.text()
      let formattedBody = rawText
      try {
        formattedBody = JSON.stringify(JSON.parse(rawText), null, 2)
      } catch (e) {
        // Not JSON, leave as raw string
      }

      // Extract only the headers developers actually care about for OmniGate
      const relevantHeaders: Record<string, string> = {}
      res.headers.forEach((value, key) => {
        if (key.startsWith('x-ratelimit') || key.startsWith('x-cache') || key === 'content-type') {
          relevantHeaders[key] = value
        }
      })

      setResponse({
        status: res.status,
        statusText: res.statusText,
        body: formattedBody,
        headers: relevantHeaders,
        latency,
      })
    } catch (error) {
      setResponse({
        status: 0,
        statusText: 'Network Error',
        body: String(error),
        headers: {},
        latency: Date.now() - startTime,
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-xl border shadow-sm overflow-hidden mt-8">
      {/* Header */}
      <div className="border-b bg-gray-50/50 p-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Activity className="w-5 h-5 text-blue-600" />
          API Sandbox
        </h2>
        <span className="text-xs text-gray-500 font-medium px-2 py-1 bg-gray-100 rounded-md">
          Live Environment
        </span>
      </div>

      <div className="flex flex-col lg:flex-row divide-y lg:divide-y-0 lg:divide-x">
        
        {/* Left Side: Request Builder */}
        <div className="p-4 sm:p-6 lg:w-1/2 space-y-4">
          
          <div className="flex gap-2">
            <select 
              value={method} 
              onChange={(e) => setMethod(e.target.value)}
              className="bg-gray-100 border border-gray-200 text-sm font-bold rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-black"
            >
              <option>GET</option>
              <option>POST</option>
              <option>PUT</option>
              <option>DELETE</option>
            </select>
            <div className="flex-1 flex items-center bg-gray-50 border rounded-lg px-3 overflow-hidden">
              <span className="text-gray-400 text-sm truncate mr-1">/v1/{projectId}</span>
              <input 
                type="text" 
                value={path}
                onChange={(e) => setPath(e.target.value)}
                placeholder="/users"
                className="bg-transparent w-full outline-none text-sm font-mono py-2"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Authorization</label>
            <input 
              type="text"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Paste your generated API Key here..."
              className="w-full bg-white border rounded-lg px-3 py-2 text-sm font-mono outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
            />
          </div>

          {method !== 'GET' && (
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Request Body (JSON)</label>
              <textarea
                value={requestBody}
                onChange={(e) => setRequestBody(e.target.value)}
                rows={4}
                spellCheck={false}
                className="w-full bg-gray-900 text-green-400 border rounded-lg px-3 py-2 text-sm font-mono outline-none focus:ring-2 focus:ring-black"
              />
            </div>
          )}

          <button 
            onClick={handleSendRequest}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 bg-black hover:bg-gray-800 text-white font-medium py-2.5 rounded-lg transition-colors disabled:opacity-50"
          >
            {isLoading ? 'Sending...' : <><Play className="w-4 h-4 fill-current" /> Send Request</>}
          </button>
        </div>

        {/* Right Side: Response Viewer */}
        <div className="p-0 lg:w-1/2 bg-[#0d1117] flex flex-col">
          {response ? (
            <div className="flex-1 flex flex-col h-full">
              {/* Response Status Bar */}
              <div className="flex items-center justify-between bg-[#161b22] px-4 py-2 border-b border-gray-800">
                <div className="flex items-center gap-3">
                  <span className={`px-2 py-0.5 rounded text-xs font-bold ${response.status >= 200 && response.status < 300 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                    {response.status} {response.statusText}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-gray-400 font-mono">
                    <Clock className="w-3 h-3" /> {response.latency}ms
                  </span>
                </div>
              </div>

              {/* Response Headers */}
              <div className="px-4 py-3 border-b border-gray-800 bg-[#0d1117]">
                <h3 className="text-xs text-gray-500 font-semibold mb-2 uppercase tracking-wider">OmniGate Headers</h3>
                {Object.entries(response.headers).map(([k, v]) => (
                  <div key={k} className="flex text-xs font-mono mb-1">
                    <span className="text-blue-400 w-1/3 truncate pr-2">{k}:</span>
                    <span className="text-gray-300 truncate">{v}</span>
                  </div>
                ))}
              </div>

              {/* Response Body */}
              <div className="p-4 overflow-auto flex-1">
                <pre className="text-sm font-mono text-gray-300 whitespace-pre-wrap break-all">
                  {response.body}
                </pre>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-600 min-h-[250px] p-6 text-center">
              <Terminal className="w-8 h-8 mb-3 opacity-50" />
              <p className="text-sm">Configure your request and hit Send.<br/>The live response will appear here.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}