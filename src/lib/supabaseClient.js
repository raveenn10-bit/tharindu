import { createClient } from '@supabase/supabase-js'

export const SUPABASE_URL =
  import.meta.env.VITE_SUPABASE_URL ||
  import.meta.env.NEXT_PUBLIC_SUPABASE_URL ||
  'https://ooyeyswduirjfovbxgzo.supabase.co'

export const SUPABASE_ANON_KEY =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  'sb_publishable_NdxiUjzy-QZOJxhcbZL9Fw_94coK'

export const BUCKET_NAME = 'portfolio-images'
export const TABLE_PHOTOS = 'photos'

// Initialize Supabase Client
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
})

/**
 * 1. Storage: Upload Image directly to 'portfolio-images' bucket
 */
export async function uploadPhotoToStorage(file) {
  try {
    if (!file) throw new Error('No file provided')

    const fileExt = file.name.split('.').pop()
    const cleanName = file.name.replace(/[^a-zA-Z0-9]/g, '_')
    const fileName = `${Date.now()}_${cleanName}.${fileExt}`
    const filePath = `uploads/${fileName}`

    const { data, error: uploadError } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      })

    if (uploadError) {
      throw uploadError
    }

    const { data: publicUrlData } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(filePath)

    return {
      publicUrl: publicUrlData.publicUrl,
      filePath,
      error: null,
    }
  } catch (err) {
    console.error('Error uploading photo to storage:', err)
    return { publicUrl: null, filePath: null, error: err.message }
  }
}

/**
 * 2. Storage: Delete Image from 'portfolio-images' bucket
 */
export async function deletePhotoFromStorage(imageUrl) {
  try {
    if (!imageUrl) return
    // Extract file path from public URL if it belongs to this bucket
    if (imageUrl.includes(BUCKET_NAME)) {
      const parts = imageUrl.split(`${BUCKET_NAME}/`)
      if (parts[1]) {
        const filePath = decodeURIComponent(parts[1])
        await supabase.storage.from(BUCKET_NAME).remove([filePath])
      }
    }
  } catch (err) {
    console.error('Error deleting photo from storage:', err)
  }
}

/**
 * 3. Database: Fetch published photos for Public Portfolio (ordered by sort_order ASC)
 */
export async function fetchPublishedPhotos() {
  try {
    const { data, error } = await supabase
      .from(TABLE_PHOTOS)
      .select('*')
      .eq('is_published', true)
      .order('sort_order', { ascending: true })

    if (error) throw error
    return { photos: data || [], error: null }
  } catch (err) {
    console.warn('Supabase fetch published photos notice:', err.message)
    return { photos: [], error: err.message }
  }
}

/**
 * 4. Database: Fetch all photos for Admin Dashboard
 */
export async function fetchAllPhotosAdmin() {
  try {
    const { data, error } = await supabase
      .from(TABLE_PHOTOS)
      .select('*')
      .order('sort_order', { ascending: true })

    if (error) throw error
    return { photos: data || [], error: null }
  } catch (err) {
    console.error('Supabase fetch admin photos error:', err.message)
    return { photos: [], error: err.message }
  }
}

/**
 * 5. Database: Insert a new photo record
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
      .from(TABLE_PHOTOS)
      .insert([
        {
          title,
          category,
          image_url,
          sort_order,
          is_published,
        },
      ])
      .select()
      .single()

    if (error) throw error
    return { data, error: null }
  } catch (err) {
    console.error('Supabase insert photo error:', err.message)
    return { data: null, error: err.message }
  }
}

/**
 * 6. Database: Update an existing photo record
 */
export async function updatePhotoRecord(id, updates) {
  try {
    const { data, error } = await supabase
      .from(TABLE_PHOTOS)
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return { data, error: null }
  } catch (err) {
    console.error('Supabase update photo error:', err.message)
    return { data: null, error: err.message }
  }
}

/**
 * 7. Database: Delete photo record and remove image from storage bucket
 */
export async function deletePhotoRecord(id, imageUrl) {
  try {
    // Delete from Storage bucket
    if (imageUrl) {
      await deletePhotoFromStorage(imageUrl)
    }

    // Delete row from photos table
    const { error } = await supabase
      .from(TABLE_PHOTOS)
      .delete()
      .eq('id', id)

    if (error) throw error
    return { success: true, error: null }
  } catch (err) {
    console.error('Supabase delete photo error:', err.message)
    return { success: false, error: err.message }
  }
}

/**
 * 8. Database: Quick Toggle is_published
 */
export async function togglePhotoPublished(id, currentPublishedStatus) {
  return updatePhotoRecord(id, { is_published: !currentPublishedStatus })
}
