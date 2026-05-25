'use client'

import { useState } from 'react'
import Link from 'next/link'
import { generateApiKey, revokeApiKey } from './actions'
import { Key, Copy, Check, ShieldAlert, Trash2, Activity } from 'lucide-react'

type APIKey = {
  id: string
  key_prefix: string
  is_active: boolean
  created_at: string
}

export default function KeyManager({ projectId, existingKeys }: { projectId: string, existingKeys: APIKey[] }) {
  const [newKey, setNewKey] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleGenerate = async () => {
    setIsGenerating(true)
    try {
      const key = await generateApiKey(projectId)
      setNewKey(key) // Store raw key in UI state temporarily
      setCopied(false)
    } catch (error) {
      console.error(error)
    }
    setIsGenerating(false)
  }

  const copyToClipboard = () => {
    if (newKey) {
      navigator.clipboard.writeText(newKey)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="space-y-8">
      {/* Show Once Alert Box */}
      {newKey && (
        <div className="p-6 bg-green-50 border border-green-200 rounded-xl">
          <div className="flex items-center gap-2 text-green-800 font-semibold mb-2">
            <ShieldAlert className="w-5 h-5" />
            Please copy this key now. You will not be able to see it again!
          </div>
          <div className="flex items-center gap-2 mt-4">
            <code className="flex-1 p-3 bg-white border border-green-200 rounded-lg text-lg font-mono text-gray-800">
              {newKey}
            </code>
            <button
              onClick={copyToClipboard}
              className="flex items-center gap-2 px-4 py-3 text-white bg-green-700 rounded-lg hover:bg-green-800 transition-colors"
            >
              {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
        </div>
      )}

      {/* Generation & List Section */}
      <div className="bg-white p-6 rounded-xl border shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Key className="w-5 h-5" /> API Keys
          </h2>
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="px-4 py-2 text-sm font-medium text-white bg-black rounded-lg hover:bg-gray-800 disabled:opacity-50 transition-colors"
          >
            {isGenerating ? 'Generating...' : '+ Generate New Key'}
          </button>
        </div>

        <div className="space-y-3">
          {existingKeys.length === 0 ? (
            <p className="text-gray-500 text-sm text-center py-4">No API keys generated yet.</p>
          ) : (
            existingKeys.map((key) => (
              <div key={key.id} className={`flex items-center justify-between p-4 border rounded-lg ${key.is_active ? 'bg-gray-50' : 'bg-red-50 opacity-60'}`}>
                
                {/* Left Side: Key Info */}
                <div className="flex flex-col">
                  <code className="font-mono text-sm font-semibold">{key.key_prefix}••••••••••••••••</code>
                  <span className="text-xs text-gray-500 mt-1">
                    Created: {new Date(key.created_at).toLocaleDateString()}
                    {!key.is_active && ' (Revoked)'}
                  </span>
                </div>
                
                {/* Right Side: Actions */}
                {key.is_active && (
                  <div className="flex items-center gap-3">
                    {/* View Usage Button */}
                    <Link 
                      href={`/dashboard/${projectId}/key/${key.id}`}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-100 rounded-md transition-colors"
                    >
                      <Activity className="w-4 h-4" />
                      View Usage
                    </Link>

                    {/* Revoke Button */}
                    <button
                      onClick={() => revokeApiKey(key.id, projectId)}
                      className="p-2 text-red-600 hover:bg-red-100 rounded-md transition-colors"
                      title="Revoke Key"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
                
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}