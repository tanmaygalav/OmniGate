'use client'

import { useState } from 'react'
import { Play, Clock, Terminal } from 'lucide-react'

export default function ApiPlayground({ projectId }: { projectId: string }) {
  const [method, setMethod] = useState('GET')
  const [path, setPath] = useState('/users')
  const [apiKey, setApiKey] = useState('')
  const [requestBody, setRequestBody] = useState('{\n  "query": "hello"\n}')
  
  const [response, setResponse] = useState<{ status: number; statusText: string; body: string; headers: Record<string, string>; latency: number } | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleSendRequest = async () => {
    if (!apiKey) return alert("Please paste an API key first!")
    setIsLoading(true)
    const startTime = Date.now()

    try {
      const fullUrl = `${window.location.origin}/v1/${projectId}${path.startsWith('/') ? path : `/${path}`}`
      const fetchOptions: RequestInit = {
        method,
        headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      }
      if (method !== 'GET') fetchOptions.body = requestBody

      const res = await fetch(fullUrl, fetchOptions)
      const latency = Date.now() - startTime
      const rawText = await res.text()
      
      let formattedBody = rawText
      try { formattedBody = JSON.stringify(JSON.parse(rawText), null, 2) } catch (e) {}

      const relevantHeaders: Record<string, string> = {}
      res.headers.forEach((value, key) => {
        if (key.startsWith('x-') || key === 'content-type') relevantHeaders[key] = value
      })

      setResponse({ status: res.status, statusText: res.statusText, body: formattedBody, headers: relevantHeaders, latency })
    } catch (error) {
      setResponse({ status: 0, statusText: 'Network Error', body: String(error), headers: {}, latency: Date.now() - startTime })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-white/[0.02] backdrop-blur-xl rounded-cards shadow-floating overflow-hidden border border-white/5">
      <div className="border-b border-white/5 bg-deep-night/40 p-5 flex items-center justify-between">
        <h2 className="text-[18px] text-cloud-white font-bold tracking-[0.14px] flex items-center gap-2">
          <Terminal className="w-5 h-5 text-amber-glow" /> API Sandbox
        </h2>
        <span className="text-[10px] tracking-[1px] text-silver-whisper uppercase font-semibold px-3 py-1.5 bg-white/5 rounded-badges border border-white/5">
          Live Environment
        </span>
      </div>

      <div className="flex flex-col lg:flex-row divide-y lg:divide-y-0 lg:divide-x divide-white/5">
        <div className="p-6 lg:w-1/2 space-y-6">
          <div className="flex gap-2">
            <select value={method} onChange={(e) => setMethod(e.target.value)} className="bg-deep-night border border-white/10 text-cloud-white text-[14px] rounded-md px-3 py-2 outline-none focus:border-amber-glow transition-colors">
              <option>GET</option><option>POST</option><option>PUT</option><option>DELETE</option>
            </select>
            <div className="flex-1 flex items-center bg-deep-night border border-white/10 rounded-md px-3 overflow-hidden focus-within:border-amber-glow transition-colors">
              <span className="text-ash-gray text-[14px] truncate mr-1">/v1/{projectId}</span>
              <input type="text" value={path} onChange={(e) => setPath(e.target.value)} className="bg-transparent w-full outline-none text-cloud-white text-[14px] py-2" />
            </div>
          </div>

          <div>
            <label className="block text-[10px] tracking-[1px] text-warm-mist uppercase font-semibold mb-2">Authorization</label>
            <input type="text" value={apiKey} onChange={(e) => setApiKey(e.target.value)} placeholder="Paste your generated API Key here..." className="w-full bg-deep-night border border-white/10 rounded-md px-3 py-2 text-[14px] font-mono text-cloud-white outline-none focus:border-amber-glow transition-all placeholder:text-ash-gray/50" />
          </div>

          {method !== 'GET' && (
            <div>
              <label className="block text-[10px] tracking-[1px] text-warm-mist uppercase font-semibold mb-2">Request Body (JSON)</label>
              <textarea value={requestBody} onChange={(e) => setRequestBody(e.target.value)} rows={4} spellCheck={false} className="w-full bg-deep-night text-silver-whisper border border-white/10 rounded-md px-3 py-2 text-[14px] font-mono outline-none focus:border-amber-glow transition-colors" />
            </div>
          )}

          <button onClick={handleSendRequest} disabled={isLoading} className="w-full flex items-center justify-center gap-2 bg-transparent border border-amber-glow text-cloud-white font-semibold text-[14px] py-2.5 rounded-buttons hover:bg-amber-glow/10 transition-colors disabled:opacity-50">
            {isLoading ? 'Sending...' : <><Play className="w-4 h-4 fill-amber-glow text-amber-glow" /> Send Request</>}
          </button>
        </div>

        <div className="p-0 lg:w-1/2 bg-deep-night/50 flex flex-col">
          {response ? (
            <div className="flex-1 flex flex-col h-full">
              <div className="flex items-center justify-between bg-black/20 px-6 py-3 border-b border-white/5">
                <div className="flex items-center gap-4">
                  <span className={`px-3 py-1 rounded-badges text-[12px] font-bold ${response.status >= 200 && response.status < 300 ? 'bg-green-900/20 text-green-400 border border-green-500/20' : 'bg-red-900/20 text-red-400 border border-red-500/20'}`}>
                    {response.status} {response.statusText}
                  </span>
                  <span className="flex items-center gap-1.5 text-[12px] text-pale-stone font-mono">
                    <Clock className="w-3.5 h-3.5" /> {response.latency}ms
                  </span>
                </div>
              </div>
              <div className="p-6 overflow-auto flex-1">
                <pre className="text-[13px] leading-[1.69] font-mono text-silver-whisper whitespace-pre-wrap break-all">{response.body}</pre>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-ash-gray min-h-[250px] p-6 text-center">
              <Terminal className="w-8 h-8 mb-4 opacity-30" />
              <p className="text-[14px] leading-[1.50]">Awaiting edge request...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}