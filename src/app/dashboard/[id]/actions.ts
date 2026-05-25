'use server'

import { createClient } from '@/utils/supabase/server'
import crypto from 'crypto'
import { revalidatePath } from 'next/cache'

export async function generateApiKey(projectId: string) {
  const supabase = await createClient()

  // 1. Generate a cryptographically secure random string
  const rawSecret = crypto.randomBytes(24).toString('hex')
  const rawKey = `omni_live_${rawSecret}`

  // 2. Hash the key using SHA-256 for secure database storage
  const keyHash = crypto.createHash('sha256').update(rawKey).digest('hex')
  
  // 3. Create a safe prefix to display in the UI later
  const keyPrefix = rawKey.substring(0, 14) // e.g., omni_live_abcd

  // 4. Insert into Supabase
  const { error } = await supabase.from('api_keys').insert({
    project_id: projectId,
    key_hash: keyHash,
    key_prefix: keyPrefix,
  })

  if (error) {
    throw new Error('Failed to generate API Key')
  }

  // Refresh the page data
  revalidatePath(`/dashboard/${projectId}`)

  // 5. Return the RAW key to the client (This is the ONLY time it is exposed)
  return rawKey
}

export async function revokeApiKey(keyId: string, projectId: string) {
  const supabase = await createClient()
  await supabase.from('api_keys').update({ is_active: false }).eq('id', keyId)
  revalidatePath(`/dashboard/${projectId}`)
}

export async function updateRateLimit(projectId: string, newLimit: number) {
  const supabase = await createClient()

  // 1. Verify the user is logged in for security
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  // 2. Update the rate_limit column in the projects table
  const { error } = await supabase
    .from('projects')
    .update({ rate_limit: newLimit })
    .eq('id', projectId)

  if (error) {
    console.error('Failed to update rate limit:', error)
    return { success: false, error: error.message }
  }

  // 3. Clear the Next.js cache so the UI updates instantly
  revalidatePath(`/dashboard/${projectId}`)
  revalidatePath(`/dashboard/${projectId}/key/[keyId]`, 'page')
  
  return { success: true }
}

export async function deleteProject(projectId: string) {
  const supabase = await createClient()

  // 1. Verify user
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  // 2. Delete the project (Supabase will auto-delete connected API keys if cascading is set up in your DB)
  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', projectId)

  if (error) {
    console.error('Failed to delete project:', error)
    return { success: false, error: error.message }
  }

  // 3. Refresh the main dashboard page
  revalidatePath('/dashboard')
  return { success: true }
}

// Add this to the bottom of actions.ts
export async function getKeyAndProjectDetails(keyId: string, projectId: string) {
  const supabase = await createClient()
  
  // Fetch the secure hash for Tinybird
  const { data: keyData } = await supabase
    .from('api_keys')
    .select('key_hash')
    .eq('id', keyId)
    .single()

  // Fetch the real rate limit for the UI
  const { data: projectData } = await supabase
    .from('projects')
    .select('rate_limit')
    .eq('id', projectId)
    .single()

  return {
    keyHash: keyData?.key_hash,
    rateLimit: projectData?.rate_limit || 100
  }
}