import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Server } from 'lucide-react'
import KeyManager from './KeyManager'

export default async function ProjectPage(props: { params: Promise<{ id: string }> }) {
  // Await params in Next.js 15
  const params = await props.params
  const projectId = params.id
  
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return redirect('/login')

  // Fetch Project Details
  const { data: project } = await supabase
    .from('projects')
    .select('*')
    .eq('id', projectId)
    .single()

  if (!project) return redirect('/dashboard')

  // Fetch API Keys associated with this project
  const { data: apiKeys } = await supabase
    .from('api_keys')
    .select('*')
    .eq('project_id', projectId)
    .order('created_at', { ascending: false })

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 pb-12">
      {/* Navbar */}
      <header className="bg-white border-b px-6 py-4 flex items-center justify-between">
        <Link href="/dashboard" className="flex items-center gap-2 hover:opacity-80">
          <Server className="w-6 h-6 text-black" />
          <h1 className="text-xl font-bold">OmniGate</h1>
        </Link>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500">{user.email}</span>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-6 mt-8 space-y-8">
        
        {/* Navigation & Header */}
        <div>
          <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-black mb-4">
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold">{project.name}</h1>
        </div>

        {/* Project Details */}
        <div className="bg-white p-6 rounded-xl border shadow-sm space-y-4">
          <div>
            <span className="text-sm font-medium text-gray-500 block mb-1">Target URL (Backend)</span>
            <div className="px-3 py-2 bg-gray-50 border rounded-md font-mono text-sm">
              {project.target_url}
            </div>
          </div>
          <div>
            <span className="text-sm font-medium text-gray-500 block mb-1">OmniGate Proxy URL</span>
            <div className="px-3 py-2 bg-blue-50 border border-blue-100 text-blue-800 rounded-md font-mono text-sm">
              https://gateway.omnigate.live/v1/{project.id}
            </div>
          </div>
        </div>

        {/* Interactive Key Manager */}
        <KeyManager projectId={project.id} existingKeys={apiKeys || []} />

      </main>
    </div>
  )
}