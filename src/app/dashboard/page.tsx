import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Server, LogOut } from 'lucide-react'
import DashboardClient from './DashboardClient'
import DashboardShell from './[id]/DashboardShell' // Adjust import path if needed

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return redirect('/login')

  // Fetch all projects for this user
  const { data: projects } = await supabase
    .from('projects')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <DashboardShell>
      {/* Ghost Navbar */}
      <header className="mb-12 flex items-center justify-between border-b border-white/5 pb-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-md bg-amber-glow/10 border border-amber-glow/20 flex items-center justify-center">
            <Server className="w-4 h-4 text-amber-glow" />
          </div>
          <h1 className="text-[18px] font-bold tracking-[0.14px] text-cloud-white">OmniGate</h1>
        </div>
        
        <div className="flex items-center gap-4">
          <span className="text-[12px] font-mono text-warm-mist hidden sm:block">
            {user.email}
          </span>
          <form action="/auth/signout" method="post">
            <button className="flex items-center gap-2 text-[12px] font-semibold text-silver-whisper hover:text-cloud-white transition-colors px-3 py-1.5 rounded-buttons hover:bg-white/5">
              <LogOut className="w-3.5 h-3.5" /> Sign Out
            </button>
          </form>
        </div>
      </header>

      <main className="max-w-5xl mx-auto">
        <div className="mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <h2 className="text-[48px] font-black text-cloud-white leading-[1] tracking-[0.67px] uppercase font-mono">
            Gateways
          </h2>
          <p className="text-[16px] text-warm-mist mt-4 max-w-xl leading-[1.69]">
            Deploy new edge proxy nodes, configure target backends, and monitor your active infrastructure.
          </p>
        </div>

        {/* Pass data to the interactive client component */}
        <DashboardClient initialProjects={projects || []} userId={user.id} />
      </main>
    </DashboardShell>
  )
}

