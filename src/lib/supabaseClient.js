import { createClient } from '@supabase/supabase-js'

export const SUPABASE_URL =
  import.meta.env.VITE_SUPABASE_URL ||
  import.meta.env.NEXT_PUBLIC_SUPABASE_URL ||
  'https://ooyeyswduirjfovbxgzo.supabase.co'

export const SUPABASE_ANON_KEY =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  'sb_publishable_NdxiUjzy-QZOJxhcbZL9Fw_94coKcNR'

export const BUCKET_NAME = import.meta.env.VITE_SUPABASE_BUCKET || 'portfolio-images'
export const TABLE_ALBUMS = import.meta.env.VITE_SUPABASE_ALBUMS_TABLE || 'photos'
export const TABLE_PHOTOS = TABLE_ALBUMS

export const isSupabaseConfigured = () => Boolean(SUPABASE_URL && SUPABASE_ANON_KEY)

// createClient throws on an empty URL/key, which would take the whole site down
// when env is missing. Fall back to an unreachable placeholder so every call
// resolves to an error result instead and the site renders its local defaults.
const PLACEHOLDER_URL = 'https://unconfigured.supabase.co'
const PLACEHOLDER_KEY = 'unconfigured-anon-key'

if (!isSupabaseConfigured()) {
  console.warn(
    'Supabase is not configured: set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file.'
  )
}

// Initialize Supabase Client
export const supabase = createClient(
  SUPABASE_URL || PLACEHOLDER_URL,
  SUPABASE_ANON_KEY || PLACEHOLDER_KEY,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  }
)

/**
 * Probe the backend so the UI can report a real status instead of assuming
 * it is connected. Supabase returns `{ error }` rather than throwing, so a
 * try/catch alone never sees a failed query.
 */
export async function checkBackendHealth() {
  if (!isSupabaseConfigured()) {
    return { ok: false, error: 'Supabase URL or anon key is missing.' }
  }
  try {
    const { error } = await supabase
      .from(TABLE_ALBUMS)
      .select('id', { count: 'exact', head: true })

    if (error) return { ok: false, error: error.message }
    return { ok: true, error: null }
  } catch (err) {
    return { ok: false, error: err.message }
  }
}

/**
 * 1. Storage: Upload media (image or video) to the media bucket
 */
export async function uploadPhotoToStorage(file, bucket = BUCKET_NAME) {
  try {
    if (!file) throw new Error('No file provided')

    const fileExt = file.name.split('.').pop()
    const cleanName = file.name.replace(/\.[^.]+$/, '').replace(/[^a-zA-Z0-9]/g, '_')
    const fileName = `${Date.now()}_${cleanName}.${fileExt}`
    const filePath = `uploads/${fileName}`

    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      })

    if (uploadError) {
      throw uploadError
    }

    const { data: publicUrlData } = supabase.storage.from(bucket).getPublicUrl(filePath)

    return {
      publicUrl: publicUrlData.publicUrl,
      filePath,
      error: null,
    }
  } catch (err) {
    console.error('Error uploading media to storage:', err)
    return { publicUrl: null, filePath: null, error: err.message }
  }
}

/** Alias kept for callers that used the media-oriented name. */
export const uploadMediaToSupabase = uploadPhotoToStorage

/**
 * 2. Storage: Delete media from the bucket, by public URL or by storage path
 */
export async function deletePhotoFromStorage(imageUrlOrPath, bucket = BUCKET_NAME) {
  try {
    if (!imageUrlOrPath) return

    let filePath = imageUrlOrPath
    if (imageUrlOrPath.includes(`${bucket}/`)) {
      const parts = imageUrlOrPath.split(`${bucket}/`)
      if (!parts[1]) return
      filePath = decodeURIComponent(parts[1].split('?')[0])
    } else if (/^https?:\/\//i.test(imageUrlOrPath)) {
      // A remote URL that does not belong to this bucket - nothing to remove.
      return
    }

    const { error } = await supabase.storage.from(bucket).remove([filePath])
    if (error) throw error
  } catch (err) {
    console.error('Error deleting media from storage:', err)
  }
}

/** Alias kept for callers that used the media-oriented name. */
export const deleteMediaFromSupabase = deletePhotoFromStorage

/**
 * 3. Database: Fetch published photos for the public site
 */
export async function fetchPublishedPhotos() {
  try {
    const { data, error } = await supabase
      .from('photos')
      .select('*')
      .eq('is_published', true)
      .order('sort_order', { ascending: true })

    if (error) {
      console.error('Supabase Error:', error)
      return { photos: [], error: error.message }
    }
    return { photos: data || [], error: null }
  } catch (err) {
    console.error('Supabase Error:', err.message)
    return { photos: [], error: err.message }
  }
}

/**
 * 4. Database: Fetch all photos for the Admin Dashboard
 */
export async function fetchAllPhotosAdmin() {
  try {
    const { data, error } = await supabase
      .from('photos')
      .select('*')
      .order('sort_order', { ascending: true })

    if (error) {
      console.error('Supabase Error:', error)
      return { photos: [], error: error.message }
    }
    return { photos: data || [], error: null }
  } catch (err) {
    console.error('Supabase Error:', err.message)
    return { photos: [], error: err.message }
  }
}

/**
 * 5. Database: Insert a new photo record into 'photos' table
 */
export async function insertPhotoRecord({
  title,
  category = 'Wedding Photography',
  image_url,
  sort_order = 0,
  is_published = true,
}) {
  try {
    const { data, error } = await supabase
      .from('photos')
      .insert([{ title, category, image_url, sort_order, is_published }])
      .select()
      .single()

    if (error) {
      console.error('Supabase Error:', error)
      return { data: null, error: error.message }
    }
    return { data, error: null }
  } catch (err) {
    console.error('Supabase Error:', err.message)
    return { data: null, error: err.message }
  }
}

/**
 * 6. Database: Update an existing photo record in 'photos' table
 */
export async function updatePhotoRecord(id, updates) {
  try {
    const { data, error } = await supabase
      .from('photos')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Supabase Error:', error)
      return { data: null, error: error.message }
    }
    return { data, error: null }
  } catch (err) {
    console.error('Supabase Error:', err.message)
    return { data: null, error: err.message }
  }
}

/**
 * 7. Database: Delete photo record and remove its media from the bucket
 */
export async function deletePhotoRecord(id, imageUrl) {
  try {
    if (imageUrl) {
      await deletePhotoFromStorage(imageUrl)
    }

    const { error } = await supabase.from('photos').delete().eq('id', id)

    if (error) {
      console.error('Supabase Error:', error)
      return { success: false, error: error.message }
    }
    return { success: true, error: null }
  } catch (err) {
    console.error('Supabase Error:', err.message)
    return { success: false, error: err.message }
  }
}

/**
 * 8. Database: Quick toggle is_published
 */
export async function togglePhotoPublished(id, currentPublishedStatus) {
  return updatePhotoRecord(id, { is_published: !currentPublishedStatus })
}
