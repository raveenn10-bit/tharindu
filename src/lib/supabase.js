import { createClient } from '@supabase/supabase-js'

const STORAGE_KEY_URL = 'tilnogz_supabase_url'
const STORAGE_KEY_KEY = 'tilnogz_supabase_anon_key'

// Read from env or local storage config
export const getSupabaseConfig = () => {
  const envUrl = import.meta.env.VITE_SUPABASE_URL || ''
  const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''
  const localUrl = localStorage.getItem(STORAGE_KEY_URL) || ''
  const localKey = localStorage.getItem(STORAGE_KEY_KEY) || ''

  return {
    url: localUrl || envUrl,
    anonKey: localKey || envKey,
  }
}

export const saveSupabaseConfig = (url, anonKey) => {
  if (url && anonKey) {
    localStorage.setItem(STORAGE_KEY_URL, url)
    localStorage.setItem(STORAGE_KEY_KEY, anonKey)
  } else {
    localStorage.removeItem(STORAGE_KEY_URL)
    localStorage.removeItem(STORAGE_KEY_KEY)
  }
}

const { url, anonKey } = getSupabaseConfig()

export const supabase = url && anonKey ? createClient(url, anonKey) : null

export const isSupabaseConfigured = () => {
  const conf = getSupabaseConfig()
  return Boolean(conf.url && conf.anonKey)
}

/**
 * Uploads a local file (Image or Video) to Supabase Storage bucket
 * Returns { publicUrl, error }
 */
export async function uploadMediaToSupabase(file, bucket = 'tilnogz-media') {
  try {
    const config = getSupabaseConfig()
    if (!config.url || !config.anonKey) {
      throw new Error('Supabase is not configured yet. Set your URL and Anon Key in Settings.')
    }

    const client = createClient(config.url, config.anonKey)
    const fileExt = file.name.split('.').pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`
    const filePath = `uploads/${fileName}`

    const { data, error: uploadError } = await client.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      })

    if (uploadError) {
      throw uploadError
    }

    const { data: publicData } = client.storage.from(bucket).getPublicUrl(filePath)
    return { publicUrl: publicData.publicUrl, filePath, error: null }
  } catch (err) {
    console.error('Supabase upload error:', err)
    return { publicUrl: null, filePath: null, error: err.message }
  }
}

/**
 * Deletes a file from Supabase Storage
 */
export async function deleteMediaFromSupabase(filePath, bucket = 'tilnogz-media') {
  try {
    const config = getSupabaseConfig()
    if (!config.url || !config.anonKey || !filePath) return

    const client = createClient(config.url, config.anonKey)
    await client.storage.from(bucket).remove([filePath])
  } catch (err) {
    console.error('Supabase delete error:', err)
  }
}
