'use client'

import { useState } from 'react'
import Link from 'next/link'
import { generateApiKey, revokeApiKey } from './actions'
import { Key, Copy, Check, ShieldAlert, Trash2, Plus } from 'lucide-react'
import { toast } from 'sonner'
import { motion } from 'framer-motion'
import ApiPlayground from './ApiPlayground'

type APIKey = { id: string, key_prefix: string, is_active: boolean, created_at: string }

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
        error: 'Failed to generate API key.',
        finally: () => setIsGenerating(false)
      }
    )
  }

  const handleRevoke = async (keyId: string) => {
    toast.error(
      <div className="flex flex-col gap-3 text-silver-whisper">
        <span className="text-[14px] font-semibold text-cloud-white">Revoke API Key?</span>
        <span className="text-[12px]">
          Any applications using this key will instantly fail. This action cannot be undone.
        </span>
        <div className="flex justify-end gap-2 mt-2">
          <button 
            className="px-3 py-1.5 text-[12px] font-medium text-silver-whisper hover:text-cloud-white bg-white/5 hover:bg-white/10 rounded-buttons transition-colors"
            onClick={() => toast.dismiss()}
          >
            Cancel
          </button>
          <button 
            className="px-3 py-1.5 text-[12px] font-medium text-cloud-white bg-red-900/50 border border-red-500/50 hover:bg-red-900/80 rounded-buttons transition-colors"
            onClick={() => {
              toast.dismiss()
              toast.promise(revokeApiKey(keyId, projectId), {
                loading: 'Revoking...',
                success: 'Key revoked permanently.',
                error: 'Failed to revoke key.'
              })
            }}
          >
            Revoke
          </button>
        </div>
      </div>,
      { duration: Infinity, style: { background: '#1d1d1f', border: '1px solid rgba(255,255,255,0.1)' } }
    )
  }

  const copyToClipboard = () => {
    if (newKey) {
      navigator.clipboard.writeText(newKey)
      setCopied(true)
      toast.success('API key copied to clipboard!', { style: { background: '#1d1d1f', color: '#fefef7', border: '1px solid rgba(255,255,255,0.1)' } })
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="space-y-12"
    >
      {/* The One-Time Reveal */}
      {newKey && (
        <div className="p-1 bg-gradient-to-r from-amber-glow/40 to-transparent rounded-[18px] animate-in fade-in zoom-in duration-300">
          <div className="bg-graphite p-6 rounded-cards shadow-floating flex flex-col md:flex-row items-center gap-6">
            <div className="flex items-center gap-4 flex-1">
              <div className="w-10 h-10 rounded-full bg-amber-glow/10 flex items-center justify-center shrink-0">
                <ShieldAlert className="w-5 h-5 text-amber-glow" />
              </div>
              <div>
                <h3 className="text-cloud-white text-[16px] font-semibold mb-1">Secret Key Generated</h3>
                <p className="text-[12px] text-warm-mist">Copy this immediately. It will permanently vanish from the archive once you leave.</p>
              </div>
            </div>
            <div className="flex items-center gap-2 w-full md:w-auto">
              <code className="px-4 py-2 bg-deep-night border border-white/5 rounded-md text-[14px] font-mono text-amber-glow w-full md:w-64 text-center">
                {newKey}
              </code>
              <button onClick={copyToClipboard} className="p-2.5 text-cloud-white bg-white/5 hover:bg-white/10 rounded-buttons transition-colors">
                {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* The Command Center Glass Pane */}
      <div className="bg-white/[0.02] backdrop-blur-3xl border border-white/5 rounded-cards shadow-floating overflow-hidden">
        {/* Header Bar */}
        <div className="flex items-center justify-between p-6 border-b border-white/5">
          <div>
            <h2 className="text-[20px] text-cloud-white font-bold tracking-[0.14px]">Authentication</h2>
            <p className="text-[14px] text-warm-mist mt-1">Manage active tokens and gateway access.</p>
          </div>
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="px-5 py-2.5 text-[14px] font-semibold text-cloud-white bg-transparent border border-amber-glow rounded-buttons hover:bg-amber-glow/10 disabled:opacity-50 transition-all flex items-center gap-2 shadow-[0_0_15px_rgba(242,185,139,0.15)] hover:shadow-[0_0_25px_rgba(242,185,139,0.25)]"
          >
            {isGenerating ? 'Generating...' : <><Plus className="w-4 h-4 text-amber-glow" /> New Token</>}
          </button>
        </div>

        {/* Dense Data Grid */}
        <div className="divide-y divide-white/5">
          {existingKeys.length === 0 ? (
            <div className="p-12 text-center text-[14px] text-warm-mist">No active tokens found.</div>
          ) : (
            existingKeys.map((key, index) => (
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                key={key.id} 
                className="flex items-center justify-between p-4 px-6 hover:bg-white/[0.02] transition-colors group"
              >
                <div className="flex items-center gap-6">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white/5">
                    <Key className="w-3.5 h-3.5 text-silver-whisper" />
                  </div>
                  <div>
                    <code className={`text-[14px] font-mono font-medium ${key.is_active ? 'text-cloud-white' : 'text-ash-gray line-through'}`}>
                      {key.key_prefix}••••••••••••••••
                    </code>
                    <div className="text-[10px] uppercase tracking-[1px] text-warm-mist mt-1">
                      {new Date(key.created_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                {key.is_active ? (
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Link href={`/dashboard/${projectId}/key/${key.id}`} className="px-4 py-2 text-[12px] font-semibold text-silver-whisper hover:text-cloud-white rounded-buttons transition-colors">
                      Metrics
                    </Link>
                    <button onClick={() => handleRevoke(key.id)} className="p-2 text-ash-gray hover:text-red-400 hover:bg-red-900/20 rounded-buttons transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <span className="px-3 py-1 text-[10px] uppercase tracking-[1px] bg-red-900/10 text-red-400 border border-red-500/20 rounded-badges">Revoked</span>
                )}
              </motion.div>
            ))
          )}
        </div>
      </div>

      <ApiPlayground projectId={projectId} />
    </motion.div>
  )
}