import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { Server } from 'lucide-react'

export default async function Login(props: { searchParams: Promise<{ message?: string }> }) {
  // Await searchParams in Next.js 15
  const searchParams = await props.searchParams
  const message = searchParams?.message

  const signIn = async (formData: FormData) => {
    'use server'
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const supabase = await createClient()

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      return redirect('/login?message=Invalid email or password')
    }
    return redirect('/dashboard')
  }

  const signUp = async (formData: FormData) => {
    'use server'
    const headersList = await headers()
    const origin = headersList.get('origin')
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const supabase = await createClient()

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${origin}/auth/callback`,
      },
    })

    if (error) {
      return redirect(`/login?message=${error.message}`)
    }
    return redirect('/login?message=Success! Check your email to confirm your account.')
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="w-full max-w-md p-8 space-y-6 bg-white border border-gray-200 rounded-2xl shadow-sm">
        
        {/* Header */}
        <div className="flex flex-col items-center text-center space-y-2">
          <div className="p-3 bg-black rounded-xl">
            <Server className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Welcome to OmniGate</h1>
          <p className="text-sm text-gray-500">Sign in or create an account to manage your API gateways.</p>
        </div>

        {/* Message Banner */}
        {message && (
          <div className="p-4 text-sm font-medium text-center text-blue-800 bg-blue-50 rounded-lg border border-blue-100">
            {message}
          </div>
        )}
        
        {/* Form */}
        <form className="flex flex-col space-y-4">
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700" htmlFor="email">
              Email Address
            </label>
            <input
              className="w-full px-4 py-2 text-gray-900 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent placeholder-gray-400"
              name="email"
              type="email"
              placeholder="you@example.com"
              required
            />
          </div>
          
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700" htmlFor="password">
              Password
            </label>
            <input
              className="w-full px-4 py-2 text-gray-900 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent placeholder-gray-400"
              type="password"
              name="password"
              placeholder="••••••••"
              required
              minLength={6}
            />
          </div>
          
          <div className="flex flex-col gap-3 pt-4">
            <button
              formAction={signIn}
              className="w-full px-4 py-2.5 text-sm font-semibold text-white bg-black rounded-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition-colors"
            >
              Sign In
            </button>
            
            <div className="relative flex items-center py-2">
              <div className="flex-grow border-t border-gray-200"></div>
              <span className="flex-shrink-0 mx-4 text-xs text-gray-400 uppercase">Or</span>
              <div className="flex-grow border-t border-gray-200"></div>
            </div>

            <button
              formAction={signUp}
              className="w-full px-4 py-2.5 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200 transition-colors"
            >
              Create Account
            </button>
          </div>
        </form>

      </div>
    </div>
  )
}