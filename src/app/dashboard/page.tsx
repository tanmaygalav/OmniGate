import Link from 'next/link'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { Server, Plus, LogOut, ArrowRight } from 'lucide-react'
import DeleteProjectButton from './DeleteProjectButton'

export default async function Dashboard() {
  // 1. Authenticate user server-side
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return redirect('/login')
  }

  // 2. Fetch user's projects
  const { data: projects } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false })

  // 3. Server Action: Create Project
  const createProject = async (formData: FormData) => {
    'use server'
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) return

    const name = formData.get('name') as string
    const target_url = formData.get('target_url') as string

    const { error } = await supabase.from('projects').insert({
      user_id: user.id,
      name,
      target_url,
    })

    if (!error) {
      // Refresh the page data
      revalidatePath('/dashboard')
    }
  }

  // 4. Server Action: Sign Out
  const signOut = async () => {
    'use server'
    const supabase = await createClient()
    await supabase.auth.signOut()
    return redirect('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* Navbar */}
      <header className="bg-white border-b px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Server className="w-6 h-6 text-black" />
          <h1 className="text-xl font-bold">OmniGate</h1>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500">{user.email}</span>
          <form action={signOut}>
            <button className="flex items-center gap-2 text-sm text-gray-600 hover:text-black">
              <LogOut className="w-4 h-4" /> Sign Out
            </button>
          </form>
        </div>
      </header>

      <main className="max-w-5xl mx-auto p-6 mt-8 space-y-12">
        
        {/* Create Project Section */}
        <section className="bg-white p-6 rounded-xl border shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Create New Gateway Project</h2>
          <form action={createProject} className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1 w-full">
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="name">
                Project Name
              </label>
              <input
                name="name"
                placeholder="e.g., Production API"
                required
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>
            <div className="flex-1 w-full">
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="target_url">
                Target URL (Your Backend)
              </label>
              <input
                name="target_url"
                type="url"
                placeholder="https://api.your-startup.com"
                required
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-2 h-[42px] text-white bg-black rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black"
            >
              <Plus className="w-4 h-4" /> Create
            </button>
          </form>
        </section>

        {/* Project List Section */}
        <section>
          <h2 className="text-lg font-semibold mb-4">Active Projects</h2>
          {projects?.length === 0 ? (
            <div className="text-center py-12 bg-white border rounded-xl border-dashed">
              <p className="text-gray-500">No projects found. Create one above to get started.</p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {projects?.map((project) => (
                <div key={project.id} className="bg-white p-5 rounded-xl border shadow-sm hover:shadow-md transition-shadow">
                  {/* Card Header with Name and Delete Button */}
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold">{project.name}</h3>
                    
                    {/* NEW: Drop the delete button right here! */}
                    <DeleteProjectButton projectId={project.id} projectName={project.name} />
                </div>
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 p-2 rounded border">
                      <span className="font-medium shrink-0">Target:</span>
                      <span className="truncate">{project.target_url}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-blue-700 bg-blue-50 p-2 rounded border border-blue-100">
                      <span className="font-medium shrink-0">Proxy:</span>
                      <span className="truncate font-mono">gateway.omnigate.live/v1/{project.id}</span>
                    </div>
                  </div>
                  <div className="mt-6 flex justify-end">
                    <Link 
                    href={`/dashboard/${project.id}`} 
                    className="flex items-center gap-1 text-sm font-medium hover:text-gray-600 transition-colors"
                    >
                    Manage Keys <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

      </main>
    </div>
  )
}