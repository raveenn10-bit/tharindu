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
  checkBackendHealth,
  isSupabaseConfigured,
  TABLE_ALBUMS,
} from '../lib/supabaseClient'

const STORAGE_KEY = 'tilnogz_content_store_v10'
const AUTH_KEY = 'tilnogz_admin_auth'
// Convenience gate only - a client-side passcode is visible in the bundle and
// is NOT a security boundary. Supabase Auth + RLS is what actually protects the
// data. Leave VITE_ADMIN_PASSCODE unset to disable passcode login entirely.
const ADMIN_PASSCODE = import.meta.env.VITE_ADMIN_PASSCODE || ''

// 3 curated client testimonials: Imalka Sandeepani, Maheshika, Pasindu Dananjaya
const defaultTestimonials = [
  {
    id: 't-1',
    clientName: 'Imalka Sandeepani',
    service: 'Special Event & Pre-Wedding Session',
    location: 'Galle, Sri Lanka',
    image: '/photos/editorial/ed-01.jpg',
    review:
      'You were really good at capturing our most valuable memories. you have done a great job capturing romantic moments at both our wedding and the preshoot. thank you Tharindu for making our day so special and giving us amazing photos to remember our day with for years to come. you are really talented and easy to work with. and really appreciate your hard work and engagement. ☺️',
    is_published: true,
    sort_order: 1,
  },
  {
    id: 't-2',
    clientName: 'Maheshika',
    service: 'Outdoor Portrait & Floral Session',
    location: 'Colombo, Sri Lanka',
    image: '/photos/maheshika/maheshika-01.jpg',
    review:
      'Thank you so much Tilnogz Photography for capturing these beautiful portraits! The colors, natural lighting, and peaceful mood with the flowers came out even better than I imagined. You made me feel so comfortable during the shoot, and your talent is truly exceptional! Highly recommend to anyone! 🌸✨',
    is_published: true,
    sort_order: 2,
  },
  {
    id: 't-3',
    clientName: 'Pasindu Dananjaya',
    service: 'Vehicle & Sports Action Session',
    location: 'Galle, Sri Lanka',
    image: '/photos/pasindu-dananjaya.jpg',
    review:
      'A huge shoutout to Tilnogz Photography for capturing my bike and action shots with such precision and energy! All his clicks speak out his talent, passion, and dedication he puts into the work. We’re also grateful for his friendly and supportive service and for the faster outputs. All the very best to rank higher and higher in the industry! 🔥🏍️',
    is_published: true,
    sort_order: 3,
  },
]

/**
 * Turn a Supabase auth failure into something the person reading it can act on.
 * Browsers word network failures differently ("Failed to fetch" in Chrome,
 * "Load failed" in Safari), and neither says anything useful on its own.
 */
function describeAuthError(err) {
  const raw = err?.message || 'Login failed.'
  const isNetworkFailure =
    err instanceof TypeError ||
    /failed to fetch|load failed|networkerror|network request failed/i.test(raw)

  if (isNetworkFailure) {
    return `Could not reach the Supabase backend (${raw}). Check that the project is running and that this site was deployed with the correct VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.`
  }
  return raw
}

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
  videos: [
    {
      id: 'vid-1',
      title: 'Cinematic Pre-Shoot Motion Story',
      category: 'Pre-Wedding / Wedding Cinematography',
      video_url: '/videos/tilnogz-cinematic-01.mp4',
      is_published: true,
      description:
        'Atmospheric romance, natural light storytelling, and decisive emotional moments captured in motion by Tilnogz Photography.',
    },
    {
      id: 'vid-2',
      title: 'Grand Wedding & Couple Highlights',
      category: 'Wedding Cinematography',
      video_url: '/videos/tilnogz-cinematic-02.mp4',
      is_published: true,
      description:
        'Joyful cultural celebrations, intimate promises, and grand wedding highlights in vibrant motion.',
    },
    {
      id: 'vid-3',
      title: 'Atmospheric Motion Monograph',
      category: 'Lifestyle & Editorial Film',
      video_url: '/videos/tilnogz-cinematic-03.mp4',
      is_published: true,
      description:
        'Sensory editorial film capturing subtle glances and cinematic movement in natural light.',
    },
  ],
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
  // 'checking' | 'connected' | 'unconfigured' | 'error'
  const [supabaseStatus, setSupabaseStatus] = useState('checking')
  const [supabaseError, setSupabaseError] = useState('')
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

  // 2. Fetch albums from Supabase on mount
  const loadPhotosFromSupabase = useCallback(async () => {
    setIsLoading(true)

    if (!isSupabaseConfigured()) {
      setSupabaseStatus('unconfigured')
      setSupabaseError('Supabase URL or anon key is missing from your .env file.')
      setIsLoading(false)
      return
    }

    try {
      const { data, error } = await supabase
        .from(TABLE_ALBUMS)
        .select('*')
        .order('sort_order', { ascending: true })

      // Supabase resolves with an `error` object rather than throwing, so this
      // branch - not the catch - is what a real backend failure lands in.
      if (error) {
        console.error('Supabase albums load failed:', error.message)
        setSupabaseStatus('error')
        setSupabaseError(error.message)
        return
      }

      if (data && data.length > 0) {
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
      }

      setSupabaseStatus('connected')
      setSupabaseError('')
    } catch (err) {
      console.error('Supabase albums load error:', err)
      setSupabaseStatus('error')
      setSupabaseError(err.message)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Re-probe the backend on demand (used by the dashboard status badge)
  const refreshBackendStatus = useCallback(async () => {
    setSupabaseStatus('checking')
    const { ok, error } = await checkBackendHealth()
    setSupabaseStatus(ok ? 'connected' : isSupabaseConfigured() ? 'error' : 'unconfigured')
    setSupabaseError(ok ? '' : error || '')
    return { ok, error }
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
    // A. Optional master passcode (local UI gate only - grants no DB access,
    // because RLS requires a real Supabase Auth session for writes).
    if (ADMIN_PASSCODE && emailOrPasscode === ADMIN_PASSCODE) {
      setIsAuthenticated(true)
      try {
        sessionStorage.setItem(AUTH_KEY, 'true')
      } catch {}
      return {
        success: true,
        warning:
          'Signed in with the master passcode. Sign in with your Supabase email and password to save changes to the backend.',
      }
    }

    // B. Check Supabase Auth Email & Password
    if (emailOrPasscode && password) {
      // Fail with something actionable rather than letting the request go out
      // to the placeholder host and surface a bare "Failed to fetch".
      if (!isSupabaseConfigured()) {
        return {
          success: false,
          // Kept short: the login screen already shows a persistent banner
          // spelling out which variables are missing and what to do.
          error: 'Email sign-in is unavailable until the backend is configured.',
        }
      }

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
        return { success: false, error: describeAuthError(err) }
      }
    }

    return {
      success: false,
      error: ADMIN_PASSCODE
        ? 'Invalid credentials. Enter a valid email and password, or the master passcode.'
        : 'Invalid credentials. Enter your Supabase admin email and password.',
    }
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

  // --- Photo & Album Actions (Supabase `albums` table & `tilnogz-media` bucket) ---

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

    // Insert into the Supabase `albums` table
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

  // --- Video Actions ---
  const addVideo = (newVideo) => {
    const vWithId = {
      id: newVideo.id || `vid-${Date.now()}`,
      title: newVideo.title,
      category: newVideo.category || 'Pre-Wedding / Wedding Cinematography',
      video_url: newVideo.video_url || newVideo.video,
      description: newVideo.description || '',
      is_published: true,
    }
    setContent((prev) => ({
      ...prev,
      videos: [vWithId, ...(prev.videos || [])],
    }))
  }

  const removeVideo = (id) => {
    setContent((prev) => ({
      ...prev,
      videos: (prev.videos || []).filter((v) => v.id !== id),
    }))
  }

  const updateVideo = (id, updates) => {
    setContent((prev) => ({
      ...prev,
      videos: (prev.videos || []).map((v) => (v.id === id ? { ...v, ...updates } : v)),
    }))
  }

  const togglePublishVideo = (id) => {
    const target = (content.videos || []).find((v) => v.id === id)
    if (target) {
      updateVideo(id, { is_published: !target.is_published })
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
        supabaseError,
        refreshBackendStatus,
        // Writes need a real Supabase Auth session: RLS rejects anon writes.
        canWriteToBackend: Boolean(session),
        isPasscodeEnabled: Boolean(ADMIN_PASSCODE),
        isBackendConfigured: isSupabaseConfigured(),
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
        addVideo,
        removeVideo,
        updateVideo,
        togglePublishVideo,
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
