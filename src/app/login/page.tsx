import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export default function Login() {
  const signIn = async (formData: FormData) => {
    'use server'
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    
    // Await the createClient function
    const supabase = await createClient()

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      return redirect('/login?message=Could not authenticate user')
    }
    return redirect('/dashboard')
  }

  const signUp = async (formData: FormData) => {
    'use server'
    
    // Await the headers promise
    const headersList = await headers()
    const origin = headersList.get('origin')
    
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    
    // Await the createClient function
    const supabase = await createClient()

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${origin}/auth/callback`,
      },
    })

    if (error) {
      return redirect('/login?message=Could not authenticate user')
    }
    return redirect('/login?message=Check email to continue sign in process')
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-md">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">OmniGate</h1>
          <p className="text-sm text-gray-500">Sign in to your control plane</p>
        </div>
        
        <form className="flex flex-col space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700" htmlFor="email">Email</label>
            <input
              className="w-full px-3 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-black"
              name="email"
              placeholder="you@example.com"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700" htmlFor="password">Password</label>
            <input
              className="w-full px-3 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-black"
              type="password"
              name="password"
              placeholder="••••••••"
              required
            />
          </div>
          
          <div className="flex gap-4 pt-4">
            <button
              formAction={signIn}
              className="w-full px-4 py-2 text-white bg-black rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
            >
              Sign In
            </button>
            <button
              formAction={signUp}
              className="w-full px-4 py-2 text-black bg-gray-100 border rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200"
            >
              Sign Up
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}