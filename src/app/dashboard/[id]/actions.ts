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