import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { featured as defaultFeatured } from '../data/portfolio'
import {
  supabase,
  uploadPhotoToStorage,
  deletePhotoFromStorage,
  fetchPublishedPhotos,
  fetchAllPhotosAdmin,
  insertPhotoRecord,
  updatePhotoRecord,
  deletePhotoRecord,
  togglePhotoPublished,
  TABLE_PHOTOS,
} from '../lib/supabaseClient'

const STORAGE_KEY = 'tilnogz_content_store_v4'
const AUTH_KEY = 'tilnogz_admin_auth'
const DEFAULT_PASSCODE = 'tilnogz2026'

// 3 curated client testimonials
const defaultTestimonials = [
  {
    id: 't-1',
    clientName: 'Imalka Sandeepani',
    service: 'Special Event & Portrait Session',
    location: 'Galle, Sri Lanka',
    image: '/photos/editorial/ed-01.jpg',
    review:
      'You were really good at capturing our most valuable memories. you have done a great job capturing romantic moments at both our wedding and the preshoot. thank you Tharindu for making our day so special and giving us amazing photos to remember our day with for years to come. you are really talented and easy to work with. and really appreciate your hard work and engagement. ☺️',
    is_published: true,
    sort_order: 1,
  },
  {
    id: 't-2',
    clientName: 'Anju',
    service: 'Sports & Action Coverage',
    location: 'Colombo, Sri Lanka',
    image: '/photos/field/fd-04.jpg',
    review:
      'A huge thank goes to Tilnogz Photography for doing our pre-wedding shoot in the best way a client can think of 💖 All his clicks speak out his talent, passion, and dedication he puts into the work. We’re also grateful for his friendly and supportive service and for the faster outputs. All the very best to rank higher and higher in the industry! 😊',
    is_published: true,
    sort_order: 2,
  },
  {
    id: 't-3',
    clientName: 'Rowena',
    service: 'Architecture & Event Monograph',
    location: 'Galle, Sri Lanka',
    image: '/photos/editorial/ed-04.jpg',
    review:
      'I just wanted to thank you for the beautiful wedding photos you’ve taken. You captured the most special moments, and we were glad to get so many great images. All our friends and family members appreciated every picture. Working with you was a very positive experience. You took a perfect photo that looks very natural. We are very grateful for your work and will definitely turn to you in the future. 😍 ❤️',
    is_published: true,
    sort_order: 3,
  },
]

const initialContentState = {
  hero: {
    desktopImage: '/photos/hero.png',
    mobileImage: '/photos/hero-mobile.png',
  },
  about: {
    portraitImage: '/photos/tharindu-portrait.png',
    name: 'Tharindu Lakshan',
    address: 'Colombo 7, Sri Lanka',
    bio1: "I’m Tharindu Lakshan, An Artist. A Photographer. Based at Colombo 7, the photographer in me finds decisive moments everywhere — across love stories, academic triumphs, high-velocity sports, and automotive precision.",
    bio2: "My approach to photography across Sri Lanka is deeply personal. A shoot is made up of hundreds of intimate interactions, bursting with matchless emotions. I capture these precious moments and craft them into your very own story.",
  },
  albums: defaultFeatured.map((item, idx) => ({
    id: item.id,
    title: item.title,
    category: item.category,
    image_url: typeof item.image === 'string' ? item.image : item.image?.src || '',
    sort_order: idx + 1,
    is_published: true,
  })),
  testimonials: defaultTestimonials,
}

const ContentContext = createContext(null)

export function ContentProvider({ children }) {
  const [content, setContent] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        return JSON.parse(saved)
      }
    } catch (err) {
      console.error('Failed to load local content:', err)
    }
    return initialContentState
  })

  const [isLoading, setIsLoading] = useState(true)
  const [supabaseStatus, setSupabaseStatus] = useState('connected')
  const [session, setSession] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    try {
      return sessionStorage.getItem(AUTH_KEY) === 'true'
    } catch {
      return false
    }
  })

  // 1. Supabase Auth Session Listener & Check
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      if (session) {
        setIsAuthenticated(true)
        sessionStorage.setItem(AUTH_KEY, 'true')
      }
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      if (session) {
        setIsAuthenticated(true)
        sessionStorage.setItem(AUTH_KEY, 'true')
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  // 2. Fetch Photos from Supabase `photos` table on Mount
  const loadPhotosFromSupabase = useCallback(async () => {
    setIsLoading(true)
    try {
      const { data, error } = await supabase
        .from(TABLE_PHOTOS)
        .select('*')
        .order('sort_order', { ascending: true })

      if (!error && data && data.length > 0) {
        setContent((prev) => ({
          ...prev,
          albums: data.map((p) => ({
            id: p.id,
            title: p.title,
            category: p.category,
            image_url: p.image_url,
            sort_order: p.sort_order || 0,
            is_published: p.is_published !== false,
            created_at: p.created_at,
          })),
        }))
        setSupabaseStatus('connected')
      }
    } catch (err) {
      console.warn('Supabase photos load notice:', err)
      setSupabaseStatus('fallback')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    loadPhotosFromSupabase()
  }, [loadPhotosFromSupabase])

  // Persist content updates to localStorage as backup
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(content))
    } catch (err) {
      console.error('Failed to save to localStorage:', err)
    }
  }, [content])

  // --- Supabase Authentication ---
  const login = async (emailOrPasscode, password = '') => {
    // A. Check Master Passcode
    if (emailOrPasscode === DEFAULT_PASSCODE || emailOrPasscode === 'admin') {
      setIsAuthenticated(true)
      try {
        sessionStorage.setItem(AUTH_KEY, 'true')
      } catch {}
      return { success: true }
    }

    // B. Check Supabase Auth Email & Password
    if (emailOrPasscode && password) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: emailOrPasscode.trim(),
          password: password,
        })
        if (error) throw error

        setSession(data.session)
        setIsAuthenticated(true)
        sessionStorage.setItem(AUTH_KEY, 'true')
        return { success: true, user: data.user }
      } catch (err) {
        return { success: false, error: err.message }
      }
    }

    return { success: false, error: 'Invalid credentials. Enter valid Email & Password or Master Passcode.' }
  }

  const logout = async () => {
    setIsAuthenticated(false)
    setSession(null)
    try {
      sessionStorage.removeItem(AUTH_KEY)
      await supabase.auth.signOut()
    } catch (err) {
      console.error('Logout error:', err)
    }
  }

  // --- Hero Actions ---
  const updateHeroImages = ({ desktop, mobile }) => {
    setContent((prev) => ({
      ...prev,
      hero: {
        desktopImage: desktop !== undefined ? desktop : prev.hero.desktopImage,
        mobileImage: mobile !== undefined ? mobile : prev.hero.mobileImage,
      },
    }))
  }

  // --- About Actions ---
  const updateAbout = (updates) => {
    setContent((prev) => ({
      ...prev,
      about: {
        ...prev.about,
        ...updates,
      },
    }))
  }

  // --- Photo & Album Actions (Supabase `photos` table & `portfolio-images` bucket) ---

  // 1. Add / Upload Photo
  const addAlbum = async (newPhoto) => {
    const photoData = {
      title: newPhoto.title,
      category: newPhoto.category || 'Wedding Photography',
      image_url: newPhoto.image_url || newPhoto.image,
      sort_order: 1,
      is_published: newPhoto.is_published !== false,
    }

    // Optimistic UI update
    const tempId = `temp-${Date.now()}`
    const optimisticRecord = { id: tempId, ...photoData }

    setContent((prev) => ({
      ...prev,
      albums: [
        optimisticRecord,
        ...prev.albums.map((a) => ({ ...a, sort_order: (a.sort_order || 0) + 1 })),
      ],
    }))

    // Insert into Supabase `photos` table
    const { data, error } = await insertPhotoRecord(photoData)
    if (data) {
      setContent((prev) => ({
        ...prev,
        albums: prev.albums.map((a) => (a.id === tempId ? data : a)),
      }))
    }
    return { data, error }
  }

  // 2. Remove / Delete Photo
  const removeAlbum = async (id, imageUrl) => {
    // Optimistic remove
    setContent((prev) => ({
      ...prev,
      albums: prev.albums.filter((a) => a.id !== id),
    }))

    // Delete from Supabase Database & Storage Bucket
    return deletePhotoRecord(id, imageUrl)
  }

  // 3. Edit Photo Details
  const updateAlbum = async (id, updates) => {
    const dbPayload = {}
    if (updates.title !== undefined) dbPayload.title = updates.title
    if (updates.category !== undefined) dbPayload.category = updates.category
    if (updates.image_url !== undefined) dbPayload.image_url = updates.image_url
    if (updates.image !== undefined) dbPayload.image_url = updates.image
    if (updates.sort_order !== undefined) dbPayload.sort_order = updates.sort_order
    if (updates.is_published !== undefined) dbPayload.is_published = updates.is_published

    // Optimistic UI update
    setContent((prev) => ({
      ...prev,
      albums: prev.albums.map((a) => (a.id === id ? { ...a, ...updates } : a)),
    }))

    return updatePhotoRecord(id, dbPayload)
  }

  // 4. Toggle Publish / Hide Status
  const togglePublishAlbum = async (id) => {
    const target = content.albums.find((a) => a.id === id)
    if (target) {
      const nextStatus = !target.is_published
      setContent((prev) => ({
        ...prev,
        albums: prev.albums.map((a) => (a.id === id ? { ...a, is_published: nextStatus } : a)),
      }))
      await togglePhotoPublished(id, target.is_published)
    }
  }

  // 5. Reorder Photos (Update sort_order)
  const reorderAlbums = async (reorderedList) => {
    const updated = reorderedList.map((item, idx) => ({
      ...item,
      sort_order: idx + 1,
    }))

    setContent((prev) => ({
      ...prev,
      albums: updated,
    }))

    for (const item of updated) {
      await updatePhotoRecord(item.id, { sort_order: item.sort_order })
    }
  }

  // 6. Shuffle Photos
  const shuffleAlbums = async () => {
    const shuffled = [...content.albums]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    const updated = shuffled.map((item, idx) => ({
      ...item,
      sort_order: idx + 1,
    }))

    setContent((prev) => ({
      ...prev,
      albums: updated,
    }))

    for (const item of updated) {
      await updatePhotoRecord(item.id, { sort_order: item.sort_order })
    }
  }

  // --- Testimonial Actions ---
  const addTestimonial = (newTestimonial) => {
    const tWithId = {
      id: newTestimonial.id || `t-${Date.now()}`,
      clientName: newTestimonial.clientName,
      service: newTestimonial.service || 'Wedding Photography',
      location: newTestimonial.location || 'Colombo, Sri Lanka',
      image: newTestimonial.image,
      review: newTestimonial.review,
      is_published: true,
      sort_order: 1,
    }
    setContent((prev) => ({
      ...prev,
      testimonials: [tWithId, ...prev.testimonials],
    }))
  }

  const removeTestimonial = (id) => {
    setContent((prev) => ({
      ...prev,
      testimonials: prev.testimonials.filter((t) => t.id !== id),
    }))
  }

  const updateTestimonial = (id, updates) => {
    setContent((prev) => ({
      ...prev,
      testimonials: prev.testimonials.map((t) => (t.id === id ? { ...t, ...updates } : t)),
    }))
  }

  const togglePublishTestimonial = (id) => {
    const target = content.testimonials.find((t) => t.id === id)
    if (target) {
      updateTestimonial(id, { is_published: !target.is_published })
    }
  }

  // --- Backup & Reset Actions ---
  const resetToDefaults = () => {
    setContent(initialContentState)
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch {}
  }

  const exportConfig = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(content, null, 2))
    const downloadAnchor = document.createElement('a')
    downloadAnchor.setAttribute('href', dataStr)
    downloadAnchor.setAttribute('download', `tilnogz_backup_${new Date().toISOString().slice(0, 10)}.json`)
    document.body.appendChild(downloadAnchor)
    downloadAnchor.click()
    downloadAnchor.remove()
  }

  const importConfig = (jsonString) => {
    try {
      const parsed = JSON.parse(jsonString)
      if (parsed.hero && parsed.about && Array.isArray(parsed.albums)) {
        setContent(parsed)
        return { success: true }
      }
      return { success: false, error: 'Invalid configuration format' }
    } catch (e) {
      return { success: false, error: e.message }
    }
  }

  return (
    <ContentContext.Provider
      value={{
        content,
        isLoading,
        session,
        supabaseStatus,
        isAuthenticated,
        login,
        logout,
        updateHeroImages,
        updateAbout,
        addAlbum,
        removeAlbum,
        updateAlbum,
        togglePublishAlbum,
        reorderAlbums,
        shuffleAlbums,
        addTestimonial,
        removeTestimonial,
        updateTestimonial,
        togglePublishTestimonial,
        resetToDefaults,
        exportConfig,
        importConfig,
      }}
    >
      {children}
    </ContentContext.Provider>
  )
}

export function useContent() {
  const ctx = useContext(ContentContext)
  if (!ctx) {
    throw new Error('useContent must be used within a ContentProvider')
  }
  return ctx
}
