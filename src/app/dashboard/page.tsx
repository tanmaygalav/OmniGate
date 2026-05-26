import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { Server, LogOut } from 'lucide-react'
import DashboardClient from './DashboardClient'

export default async function Dashboard() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return redirect('/login')
  }

  // Fetch user's projects
  const { data: projects } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false })

  // Server Action: Create Project
  const createProject = async (formData: FormData) => {
    'use server'
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) throw new Error("Unauthorized")

    const name = formData.get('name') as string
    const target_url = formData.get('target_url') as string

    const { error } = await supabase.from('projects').insert({
      user_id: user.id,
      name,
      target_url,
    })

    if (error) throw error
    revalidatePath('/dashboard')
  }

  // Server Action: Sign Out
  const signOut = async () => {
    'use server'
    const supabase = await createClient()
    await supabase.auth.signOut()
    return redirect('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* Navbar stays server-side for speed */}
      <header className="bg-white border-b px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <Server className="w-6 h-6 text-black" />
          <h1 className="text-xl font-bold">OmniGate</h1>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500 hidden md:inline">{user.email}</span>
          <form action={signOut}>
            <button className="flex items-center gap-2 text-sm text-gray-600 hover:text-black transition-colors">
              <LogOut className="w-4 h-4" /> Sign Out
            </button>
          </form>
        </div>
      </header>

      {/* The beautiful animated client component */}
      <DashboardClient projects={projects || []} createProjectAction={createProject} />
    </div>
  )
}