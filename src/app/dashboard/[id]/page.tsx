import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Server, Link2 } from 'lucide-react'
import KeyManager from './KeyManager'
import DashboardShell from './DashboardShell'

export default async function ProjectPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params
  const projectId = params.id
  
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return redirect('/login')

  const { data: project } = await supabase
    .from('projects')
    .select('*')
    .eq('id', projectId)
    .single()

  if (!project) return redirect('/dashboard')

  const { data: apiKeys } = await supabase
    .from('api_keys')
    .select('*')
    .eq('project_id', projectId)
    .order('created_at', { ascending: false })

  return (
    <DashboardShell>
      {/* Ghost Navbar */}
      <header className="mb-12 flex items-center justify-between border-b border-white/5 pb-6">
        <Link href="/dashboard" className="flex items-center gap-2 text-silver-whisper hover:text-cloud-white transition-colors">
          <Server className="w-5 h-5 text-amber-glow" />
          <h1 className="text-[18px] font-bold tracking-[0.14px] text-cloud-white">OmniGate</h1>
        </Link>
        <div className="text-[14px] text-warm-mist font-mono bg-white/5 px-3 py-1.5 rounded-badges">
          {user.email}
        </div>
      </header>

      <main className="max-w-5xl mx-auto space-y-12">
        
        {/* Navigation & Header (Animated) */}
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
          <Link href="/dashboard" className="inline-flex items-center gap-2 text-[12px] uppercase tracking-[1px] font-semibold text-warm-mist hover:text-amber-glow mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Command Center
          </Link>
          <h1 className="text-[48px] md:text-[64px] font-black text-cloud-white leading-[1] tracking-[0.67px] uppercase font-mono">
            {project.name}
          </h1>
        </div>

        {/* Project Details - Glass Cards */}
        <div className="grid md:grid-cols-2 gap-4 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100 fill-mode-both">
          <div className="bg-white/[0.02] backdrop-blur-xl p-6 rounded-cards border border-white/5 shadow-floating">
            <span className="text-[10px] uppercase tracking-[1px] font-semibold text-warm-mist block mb-3 flex items-center gap-2">
              <Link2 className="w-3.5 h-3.5" /> Target URL (Backend)
            </span>
            <div className="px-4 py-3 bg-deep-night/50 border border-white/5 rounded-md font-mono text-[14px] text-silver-whisper truncate">
              {project.target_url}
            </div>
          </div>
          
          <div className="bg-white/[0.02] backdrop-blur-xl p-6 rounded-cards border border-amber-glow/20 shadow-[0_0_20px_rgba(242,185,139,0.05)]">
            <span className="text-[10px] uppercase tracking-[1px] font-semibold text-amber-glow block mb-3 flex items-center gap-2">
              <Server className="w-3.5 h-3.5" /> OmniGate Proxy URL
            </span>
            <div className="px-4 py-3 bg-amber-glow/5 border border-amber-glow/20 text-cloud-white rounded-md font-mono text-[14px] truncate selection:bg-amber-glow/30">
              omnigatev1.vercel.app/v1/{project.id}
            </div>
          </div>
        </div>

        {/* Interactive Key Manager */}
        <KeyManager projectId={project.id} existingKeys={apiKeys || []} />

      </main>
    </DashboardShell>
  )
}