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
  fetchSiteSettings,
  saveSiteSettings,
  checkBackendHealth,
  isSupabaseConfigured,
  TABLE_ALBUMS,
} from '../lib/supabaseClient'

const STORAGE_KEY = 'tilnogz_content_store_v11'
const AUTH_KEY = 'tilnogz_admin_auth'
const ADMIN_PASSCODE = import.meta.env.VITE_ADMIN_PASSCODE || 'tilnogz1234'
const DEFAULT_PASSCODE = 'tilnogz1234'

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

const defaultPlans = [
  {
    id: 'plan-essential',
    name: 'ESSENTIAL',
    subtitle: 'Portraits & Individual Sessions',
    badge: 'FOCUSED SESSION',
    price: '',
    isPopular: false,
    description:
      'Tailored for personal branding, athlete portraits, single architectural sites, or lifestyle shoots.',
    features: [
      'Up to 2 Hours On-Location Coverage',
      '25+ Master Color-Graded Deliverables',
      'Pre-Shoot Creative Consultation',
      'High-Resolution Digital Web Gallery',
      '5-Day Standard Turnaround',
      'Personal & Social Usage Rights',
    ],
    inquiryMessage:
      'Hello Tilnogz Photography, I would like to inquire about the ESSENTIAL photography plan.',
    is_published: true,
    sort_order: 1,
  },
  {
    id: 'plan-signature',
    name: 'SIGNATURE',
    subtitle: 'Sports Tournaments & Events',
    badge: 'MOST POPULAR',
    price: '',
    isPopular: true,
    description:
      'Our most requested coverage for sports fixtures, architectural portfolios, and luxury event storytelling.',
    features: [
      'Up to 5 Hours Extended On-Location Coverage',
      '75+ Master Processed & Retouched Deliverables',
      'Multi-Angle High-Velocity Action Captures',
      '48-Hour Priority Highlight Teaser Set',
      'Full Commercial & Editorial Rights',
      'Private High-Speed Cloud Delivery',
    ],
    inquiryMessage:
      'Hello Tilnogz Photography, I would like to inquire about the SIGNATURE photography plan.',
    is_published: true,
    sort_order: 2,
  },
  {
    id: 'plan-bespoke',
    name: 'BESPOKE',
    subtitle: 'Full-Day Commercial & Multi-Location',
    badge: 'COMPREHENSIVE SUITE',
    price: '',
    isPopular: false,
    description:
      'Complete creative commission for multi-day sporting events, architectural monographs, or commercial features.',
    features: [
      'Full-Day Multi-Location Dedicated Coverage',
      '150+ Master Color-Graded Deliverables',
      'Dedicated Creative Direction & Lighting Setup',
      '24-Hour Express Teaser Deliverables',
      'Complete High-Res Processed Archive',
      'Full Commercial, Print & Social Licensing',
    ],
    inquiryMessage:
      'Hello Tilnogz Photography, I would like to inquire about the BESPOKE photography plan.',
    is_published: true,
    sort_order: 3,
  },
]

const defaultStripPhotos = [
  { id: 'strip-1', title: 'The Colonial Arcade', category: 'Architecture', image_url: '/photos/editorial/ed-01.jpg', is_published: true, sort_order: 1 },
  { id: 'strip-2', title: 'Coastal Movement', category: 'Lifestyle', image_url: '/photos/street/st-01.jpg', is_published: true, sort_order: 2 },
  { id: 'strip-3', title: 'Blue Archway', category: 'Heritage', image_url: '/photos/editorial/ed-03.jpg', is_published: true, sort_order: 3 },
  { id: 'strip-4', title: 'Iron Spiral Staircase', category: 'Architecture', image_url: '/photos/editorial/ed-06.jpg', is_published: true, sort_order: 4 },
  { id: 'strip-5', title: 'Floral Radiance', category: 'Portrait', image_url: '/photos/maheshika/maheshika-01.jpg', is_published: true, sort_order: 5 },
  { id: 'strip-6', title: 'Tropical Island Lagoon', category: 'Landscape', image_url: '/photos/nature/nt-03.jpg', is_published: true, sort_order: 6 },
  { id: 'strip-7', title: 'Grand Venue Chandelier', category: 'Events', image_url: '/photos/editorial/ed-04.jpg', is_published: true, sort_order: 7 },
  { id: 'strip-8', title: 'Street Glance', category: 'Portrait', image_url: '/photos/street/st-02.jpg', is_published: true, sort_order: 8 },
  { id: 'strip-9', title: 'Action Form', category: 'Action', image_url: '/photos/pasindu-dananjaya.jpg', is_published: true, sort_order: 9 },
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
  plans: defaultPlans,
  stripPhotos: defaultStripPhotos,
}

function sanitizeContent(raw) {
  if (!raw || typeof raw !== 'object') return initialContentState
  return {
    hero: {
      desktopImage: raw?.hero?.desktopImage || initialContentState.hero.desktopImage,
      mobileImage: raw?.hero?.mobileImage || initialContentState.hero.mobileImage,
    },
    about: {
      portraitImage: raw?.about?.portraitImage || initialContentState.about.portraitImage,
      name: raw?.about?.name || initialContentState.about.name,
      address: raw?.about?.address || initialContentState.about.address,
      bio1: raw?.about?.bio1 || initialContentState.about.bio1,
      bio2: raw?.about?.bio2 || initialContentState.about.bio2,
    },
    albums: Array.isArray(raw?.albums) && raw.albums.length > 0 ? raw.albums : initialContentState.albums,
    videos: Array.isArray(raw?.videos) && raw.videos.length > 0 ? raw.videos : initialContentState.videos,
    testimonials: Array.isArray(raw?.testimonials) && raw.testimonials.length > 0 ? raw.testimonials : initialContentState.testimonials,
    plans: Array.isArray(raw?.plans) && raw.plans.length > 0 ? raw.plans : defaultPlans,
    stripPhotos: Array.isArray(raw?.stripPhotos) && raw.stripPhotos.length > 0 ? raw.stripPhotos : defaultStripPhotos,
  }
}

const ContentContext = createContext(null)

export function ContentProvider({ children }) {
  const [content, setContent] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        return sanitizeContent(JSON.parse(saved))
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

  // 2. Fetch site settings & photos from Supabase on mount
  const loadPhotosFromSupabase = useCallback(async () => {
    setIsLoading(true)

    if (!isSupabaseConfigured()) {
      setSupabaseStatus('unconfigured')
      setSupabaseError('Supabase URL or anon key is missing from your .env file.')
      setIsLoading(false)
      return
    }

    try {
      // A. Load global site settings (Hero, About, Videos, Testimonials, Plans) if stored in Supabase
      const { content: remoteContent } = await fetchSiteSettings()
      if (remoteContent) {
        setContent((prev) => sanitizeContent({
          ...prev,
          ...remoteContent,
        }))
      }

      // B. Load photos from 'photos' table
      const { data, error } = await supabase
        .from('photos')
        .select('*')
        .order('sort_order', { ascending: true })

      if (error) {
        console.warn('Supabase photos load notice:', error.message)
      } else if (data && data.length > 0) {
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
      console.error('Supabase load error:', err)
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
    // A. Master Passcode / PIN checking
    const inputCode = (emailOrPasscode || '').trim()
    const inputPass = (password || '').trim()

    if (
      inputCode === 'tilnogz1234' ||
      inputCode === 'tilnogz2026' ||
      (ADMIN_PASSCODE && inputCode === ADMIN_PASSCODE.trim())
    ) {
      setIsAuthenticated(true)
      try {
        sessionStorage.setItem(AUTH_KEY, 'true')
      } catch {}
      return {
        success: true,
        warning: 'Signed in with Master PIN.',
      }
    }

    // B. Check Supabase Auth Email & Password
    if (inputCode && inputPass) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: inputCode,
          password: inputPass,
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

    return {
      success: false,
      error: 'Invalid Master PIN or Supabase credentials. Please try again.',
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
    setContent((prev) => {
      const updated = {
        ...prev,
        hero: {
          desktopImage: desktop !== undefined ? desktop : prev.hero?.desktopImage || '/photos/hero.png',
          mobileImage: mobile !== undefined ? mobile : prev.hero?.mobileImage || '/photos/hero-mobile.png',
        },
      }
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
      } catch (e) {
        console.error('LocalStorage save error:', e)
      }
      return updated
    })
  }

  // --- About Actions ---
  const updateAbout = (updates) => {
    setContent((prev) => {
      const updated = {
        ...prev,
        about: {
          ...(prev.about || {}),
          ...updates,
        },
      }
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
      } catch (e) {
        console.error('LocalStorage save error:', e)
      }
      return updated
    })
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

  // --- Plan & Package Actions ---
  const addPlan = (newPlan) => {
    const pWithId = {
      id: newPlan.id || `plan-${Date.now()}`,
      name: newPlan.name || 'NEW PACKAGE',
      subtitle: newPlan.subtitle || 'Custom Photography Package',
      badge: newPlan.badge || 'CUSTOM',
      price: newPlan.price || '',
      isPopular: Boolean(newPlan.isPopular),
      description: newPlan.description || '',
      features: Array.isArray(newPlan.features) ? newPlan.features : [],
      inquiryMessage:
        newPlan.inquiryMessage ||
        `Hello Tilnogz Photography, I would like to inquire about the ${newPlan.name} package.`,
      is_published: true,
      sort_order: ((content.plans || []).length) + 1,
    }
    setContent((prev) => ({
      ...prev,
      plans: [...(prev.plans || []), pWithId],
    }))
  }

  const removePlan = (id) => {
    setContent((prev) => ({
      ...prev,
      plans: (prev.plans || []).filter((p) => p.id !== id),
    }))
  }

  const updatePlan = (id, updates) => {
    setContent((prev) => ({
      ...prev,
      plans: (prev.plans || []).map((p) => (p.id === id ? { ...p, ...updates } : p)),
    }))
  }

  const togglePublishPlan = (id) => {
    const target = (content.plans || []).find((p) => p.id === id)
    if (target) {
      updatePlan(id, { is_published: !target.is_published })
    }
  }

  const reorderPlans = (reorderedPlans) => {
    setContent((prev) => ({
      ...prev,
      plans: reorderedPlans.map((p, idx) => ({ ...p, sort_order: idx + 1 })),
    }))
  }

  // --- Photo Strip Actions ---
  const addStripPhoto = (newPhoto) => {
    const pWithId = {
      id: newPhoto.id || `strip-${Date.now()}`,
      title: newPhoto.title || 'Untitled Capture',
      category: newPhoto.category || 'Editorial',
      image_url: newPhoto.image_url || newPhoto.image || '',
      is_published: true,
      sort_order: ((content.stripPhotos || []).length) + 1,
    }
    setContent((prev) => ({
      ...prev,
      stripPhotos: [...(prev.stripPhotos || []), pWithId],
    }))
  }

  const removeStripPhoto = (id) => {
    setContent((prev) => ({
      ...prev,
      stripPhotos: (prev.stripPhotos || []).filter((p) => p.id !== id),
    }))
  }

  const updateStripPhoto = (id, updates) => {
    setContent((prev) => ({
      ...prev,
      stripPhotos: (prev.stripPhotos || []).map((p) => (p.id === id ? { ...p, ...updates } : p)),
    }))
  }

  const togglePublishStripPhoto = (id) => {
    const target = (content.stripPhotos || []).find((p) => p.id === id)
    if (target) {
      updateStripPhoto(id, { is_published: !target.is_published })
    }
  }

  const reorderStripPhotos = (reorderedStripPhotos) => {
    setContent((prev) => ({
      ...prev,
      stripPhotos: reorderedStripPhotos.map((p, idx) => ({ ...p, sort_order: idx + 1 })),
    }))
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

  const saveAllChanges = async (extraPayload = {}) => {
    try {
      const merged = {
        ...content,
        ...(extraPayload.hero ? { hero: { ...(content.hero || {}), ...extraPayload.hero } } : {}),
        ...(extraPayload.about ? { about: { ...(content.about || {}), ...extraPayload.about } } : {}),
        ...(extraPayload.albums ? { albums: extraPayload.albums } : {}),
        ...(extraPayload.videos ? { videos: extraPayload.videos } : {}),
        ...(extraPayload.testimonials ? { testimonials: extraPayload.testimonials } : {}),
        ...(extraPayload.plans ? { plans: extraPayload.plans } : {}),
        ...(extraPayload.stripPhotos ? { stripPhotos: extraPayload.stripPhotos } : {}),
      }

      setContent(merged)
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(merged))
      } catch (e) {
        console.error('LocalStorage write error:', e)
      }

      // 1. Save full site settings (Hero, About, Videos, Testimonials, Plans, Strip Photos) to Supabase
      await saveSiteSettings(merged)

      // 2. Also ensure backend photos table is updated if configured
      if (Array.isArray(merged.albums)) {
        for (const item of merged.albums) {
          if (item.id && typeof item.id === 'number') {
            await updatePhotoRecord(item.id, {
              title: item.title,
              category: item.category,
              sort_order: item.sort_order || 0,
              is_published: item.is_published !== false,
            })
          } else if (item.id && String(item.id).startsWith('temp-')) {
            const { data } = await insertPhotoRecord({
              title: item.title,
              category: item.category,
              image_url: item.image_url || item.image,
              sort_order: item.sort_order || 0,
              is_published: item.is_published !== false,
            })
            if (data) {
              item.id = data.id
            }
          }
        }
      }
      return { success: true }
    } catch (err) {
      console.error('Save all error:', err)
      return { success: false, error: err.message }
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
        canWriteToBackend: true,
        isPasscodeEnabled: true,
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
        addPlan,
        removePlan,
        updatePlan,
        togglePublishPlan,
        reorderPlans,
        addStripPhoto,
        removeStripPhoto,
        updateStripPhoto,
        togglePublishStripPhoto,
        reorderStripPhotos,
        saveAllChanges,
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
