'use client'

import { useState } from 'react'
import Link from 'next/link'
import { generateApiKey, revokeApiKey } from './actions'
import { Key, Copy, Check, ShieldAlert, Trash2, Activity } from 'lucide-react'
import { toast } from 'sonner'
import ApiPlayground from './ApiPlayground'

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
    toast.promise(
      generateApiKey(projectId).then((key) => {
        setNewKey(key)
        setCopied(false)
        return key
      }),
      {
        loading: 'Generating secure API key...',
        success: 'New API key generated successfully!',
        error: 'Failed to generate API key. Please try again.',
        finally: () => setIsGenerating(false)
      }
    )
  }

  const handleRevoke = async (keyId: string) => {
    toast.error(
      <div className="flex flex-col gap-3">
        <span className="font-semibold text-gray-900">Revoke API Key?</span>
        <span className="text-sm text-gray-600">
          Are you sure? Any applications using this key will instantly fail. This action cannot be undone.
        </span>
        <div className="flex justify-end gap-2 mt-2">
          <button 
            className="px-3 py-1.5 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
            onClick={() => toast.dismiss()}
          >
            Cancel
          </button>
          <button 
            className="px-3 py-1.5 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors"
            onClick={() => {
              toast.dismiss()
              toast.promise(
                revokeApiKey(keyId, projectId),
                {
                  loading: 'Revoking API key...',
                  success: 'API key revoked permanently.',
                  error: 'Failed to revoke API key.'
                }
              )
            }}
          >
            Yes, Revoke
          </button>
        </div>
      </div>,
      { duration: Infinity, position: 'bottom-right' }
    )
  }

  const copyToClipboard = () => {
    if (newKey) {
      navigator.clipboard.writeText(newKey)
      setCopied(true)
      toast.success('API key copied to clipboard!')
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Show Once Alert Box */}
      {newKey && (
        <div className="p-4 sm:p-6 bg-green-50 border border-green-200 rounded-xl animate-in fade-in slide-in-from-top-4">
          <div className="flex items-start sm:items-center gap-2 text-green-800 font-semibold mb-2">
            <ShieldAlert className="w-5 h-5 shrink-0 mt-0.5 sm:mt-0" />
            <span>Please copy this key now. You will not be able to see it again!</span>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 mt-4">
            <code className="flex-1 p-3 bg-white border border-green-200 rounded-lg text-sm sm:text-lg font-mono text-gray-800 break-all">
              {newKey}
            </code>
            <button
              onClick={copyToClipboard}
              className="flex items-center justify-center gap-2 px-4 py-3 text-white bg-green-700 rounded-lg hover:bg-green-800 transition-colors w-full sm:w-auto shrink-0"
            >
              {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
        </div>
      )}

      {/* Generation & List Section */}
      <div className="bg-white p-4 sm:p-6 rounded-xl border shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Key className="w-5 h-5" /> API Keys
          </h2>
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full sm:w-auto px-4 py-2.5 sm:py-2 text-sm font-medium text-white bg-black rounded-lg hover:bg-gray-800 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
          >
            {isGenerating ? 'Generating...' : '+ Generate New Key'}
          </button>
        </div>

        <div className="space-y-3">
          {existingKeys.length === 0 ? (
            <p className="text-gray-500 text-sm text-center py-4">No API keys generated yet.</p>
          ) : (
            existingKeys.map((key) => (
              <div key={key.id} className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg gap-4 ${key.is_active ? 'bg-gray-50' : 'bg-red-50 opacity-60'}`}>
                
                {/* Left Side: Key Info */}
                <div className="flex flex-col min-w-0 w-full">
                  <code className="font-mono text-sm font-semibold truncate break-all">
                    {key.key_prefix}••••••••••••••••
                  </code>
                  <span className="text-xs text-gray-500 mt-1">
                    Created: {new Date(key.created_at).toLocaleDateString()}
                    {!key.is_active && ' (Revoked)'}
                  </span>
                </div>
                
                {/* Right Side: Actions */}
                {key.is_active && (
                  <div className="flex items-center gap-2 w-full sm:w-auto justify-end border-t sm:border-t-0 pt-3 sm:pt-0 mt-1 sm:mt-0">
                    {/* View Usage Button */}
                    <Link 
                      href={`/dashboard/${projectId}/key/${key.id}`}
                      prefetch={true}
                      className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-2 sm:py-1.5 text-sm font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-100 rounded-md transition-colors"
                    >
                      <Activity className="w-4 h-4" />
                      View Usage
                    </Link>

                    {/* Revoke Button */}
                    <button
                      onClick={() => handleRevoke(key.id)}
                      className="p-2 text-red-600 hover:bg-red-100 border border-transparent hover:border-red-200 rounded-md transition-colors shrink-0"
                      title="Revoke Key"
                    >
                      <Trash2 className="w-5 h-5 sm:w-4 sm:h-4" />
                    </button>
                  </div>
                )}
                
              </div>
            ))
          )}
        </div>
      </div>

      {/* API Sandbox Integration */}
      <ApiPlayground projectId={projectId} />

    </div>
  )
}