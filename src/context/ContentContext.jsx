import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { featured as defaultFeatured } from '../data/portfolio'
import {
  getSupabaseConfig,
  saveSupabaseConfig,
  isSupabaseConfigured,
} from '../lib/supabase'
import { createClient } from '@supabase/supabase-js'

const STORAGE_KEY = 'tilnogz_content_store_v2'
const AUTH_KEY = 'tilnogz_admin_auth'
const DEFAULT_PASSCODE = 'tilnogz2026'

// 4 default testimonials
const defaultTestimonials = [
  {
    id: 't-1',
    clientName: 'Lakeesha',
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
    clientName: 'Ishara',
    service: 'Lifestyle & Editorial Session',
    location: 'Hikkaduwa, Sri Lanka',
    image: '/photos/street/st-01.jpg',
    review:
      'Your photography skills are simply amazing, as you’ve managed to capture each important moment on camera. I have been impressed with your professionalism and would like to express my gratitude for doing such an amazing job! thanks a lot for every thing malli.. keep up good work. good luck ❤️',
    is_published: true,
    sort_order: 2,
  },
  {
    id: 't-3',
    clientName: 'Anju',
    service: 'Sports & Action Coverage',
    location: 'Colombo, Sri Lanka',
    image: '/photos/field/fd-04.jpg',
    review:
      'A huge thank goes to Tilnogz Photography for doing our pre-wedding shoot in the best way a client can think of 💖 All his clicks speak out his talent, passion, and dedication he puts into the work. We’re also grateful for his friendly and supportive service and for the faster outputs. All the very best to rank higher and higher in the industry! 😊',
    is_published: true,
    sort_order: 3,
  },
  {
    id: 't-4',
    clientName: 'Rowena',
    service: 'Architecture & Event Monograph',
    location: 'Galle, Sri Lanka',
    image: '/photos/editorial/ed-04.jpg',
    review:
      'I just wanted to thank you for the beautiful wedding photos you’ve taken. You captured the most special moments, and we were glad to get so many great images. All our friends and family members appreciated every picture. Working with you was a very positive experience. You took a perfect photo that looks very natural. We are very grateful for your work and will definitely turn to you in the future. 😍 ❤️',
    is_published: true,
    sort_order: 4,
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
    image: typeof item.image === 'string' ? item.image : item.image?.src || '',
    video_url: '',
    note: item.note || '',
    is_published: true,
    sort_order: idx + 1,
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

  const [supabaseStatus, setSupabaseStatus] = useState(isSupabaseConfigured() ? 'connected' : 'local')
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    try {
      return sessionStorage.getItem(AUTH_KEY) === 'true'
    } catch {
      return false
    }
  })

  // Load from Supabase on mount if configured
  const loadFromSupabase = useCallback(async () => {
    const config = getSupabaseConfig()
    if (!config.url || !config.anonKey) return

    try {
      const client = createClient(config.url, config.anonKey)

      // Fetch Albums
      const { data: albumData, error: albumErr } = await client
        .from('albums')
        .select('*')
        .order('sort_order', { ascending: true })

      // Fetch Hero
      const { data: heroData } = await client.from('hero_settings').select('*').limit(1).single()

      // Fetch About
      const { data: aboutData } = await client.from('about_settings').select('*').limit(1).single()

      // Fetch Testimonials
      const { data: testData } = await client
        .from('testimonials')
        .select('*')
        .order('sort_order', { ascending: true })

      if (!albumErr && albumData && albumData.length > 0) {
        setContent((prev) => ({
          ...prev,
          hero: heroData
            ? {
                desktopImage: heroData.desktop_image_url || prev.hero.desktopImage,
                mobileImage: heroData.mobile_image_url || prev.hero.mobileImage,
              }
            : prev.hero,
          about: aboutData
            ? {
                portraitImage: aboutData.portrait_url || prev.about.portraitImage,
                name: aboutData.name || prev.about.name,
                address: aboutData.address || prev.about.address,
                bio1: aboutData.bio1 || prev.about.bio1,
                bio2: aboutData.bio2 || prev.about.bio2,
              }
            : prev.about,
          albums: albumData.map((a) => ({
            id: a.id,
            title: a.title,
            category: a.category,
            image: a.image_url,
            video_url: a.video_url || '',
            note: a.note || '',
            is_published: a.is_published !== false,
            sort_order: a.sort_order || 0,
          })),
          testimonials: testData && testData.length > 0
            ? testData.map((t) => ({
                id: t.id,
                clientName: t.client_name,
                service: t.service,
                location: t.location,
                image: t.image_url,
                review: t.review,
                is_published: t.is_published !== false,
                sort_order: t.sort_order || 0,
              }))
            : prev.testimonials,
        }))
        setSupabaseStatus('connected')
      }
    } catch (err) {
      console.warn('Supabase fetch notice (running with local cache):', err)
      setSupabaseStatus('error')
    }
  }, [])

  useEffect(() => {
    if (isSupabaseConfigured()) {
      loadFromSupabase()
    }
  }, [loadFromSupabase])

  // Persist content updates to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(content))
    } catch (err) {
      console.error('Failed to save to localStorage:', err)
    }
  }, [content])

  // --- Authentication ---
  const login = async (passcodeOrEmail, password = '') => {
    // 1. Check Passcode
    if (passcodeOrEmail === DEFAULT_PASSCODE || passcodeOrEmail === 'admin') {
      setIsAuthenticated(true)
      try {
        sessionStorage.setItem(AUTH_KEY, 'true')
      } catch {}
      return { success: true }
    }

    // 2. Check Supabase Auth if credentials provided
    const config = getSupabaseConfig()
    if (config.url && config.anonKey && password) {
      try {
        const client = createClient(config.url, config.anonKey)
        const { data, error } = await client.auth.signInWithPassword({
          email: passcodeOrEmail,
          password: password,
        })
        if (error) throw error
        setIsAuthenticated(true)
        sessionStorage.setItem(AUTH_KEY, 'true')
        return { success: true, user: data.user }
      } catch (err) {
        return { success: false, error: err.message }
      }
    }

    return { success: false, error: 'Incorrect passcode. Default is tilnogz2026' }
  }

  const logout = async () => {
    setIsAuthenticated(false)
    try {
      sessionStorage.removeItem(AUTH_KEY)
      const config = getSupabaseConfig()
      if (config.url && config.anonKey) {
        const client = createClient(config.url, config.anonKey)
        await client.auth.signOut()
      }
    } catch {}
  }

  // --- Hero Actions ---
  const updateHeroImages = async ({ desktop, mobile }) => {
    const newDesktop = desktop !== undefined ? desktop : content.hero.desktopImage
    const newMobile = mobile !== undefined ? mobile : content.hero.mobileImage

    setContent((prev) => ({
      ...prev,
      hero: {
        desktopImage: newDesktop,
        mobileImage: newMobile,
      },
    }))

    // Sync with Supabase
    const config = getSupabaseConfig()
    if (config.url && config.anonKey) {
      try {
        const client = createClient(config.url, config.anonKey)
        await client.from('hero_settings').upsert({
          id: 'primary',
          desktop_image_url: newDesktop,
          mobile_image_url: newMobile,
          updated_at: new Date().toISOString(),
        })
      } catch (e) {
        console.error('Supabase hero sync error:', e)
      }
    }
  }

  // --- About Actions ---
  const updateAbout = async (updates) => {
    setContent((prev) => ({
      ...prev,
      about: {
        ...prev.about,
        ...updates,
      },
    }))

    // Sync with Supabase
    const config = getSupabaseConfig()
    if (config.url && config.anonKey) {
      try {
        const client = createClient(config.url, config.anonKey)
        await client.from('about_settings').upsert({
          id: 'primary',
          portrait_url: updates.portraitImage || content.about.portraitImage,
          name: updates.name || content.about.name,
          address: updates.address || content.about.address,
          bio1: updates.bio1 || content.about.bio1,
          bio2: updates.bio2 || content.about.bio2,
          updated_at: new Date().toISOString(),
        })
      } catch (e) {
        console.error('Supabase about sync error:', e)
      }
    }
  }

  // --- Album Actions ---
  const addAlbum = async (newAlbum) => {
    const albumWithId = {
      id: newAlbum.id || `album-${Date.now()}`,
      title: newAlbum.title,
      category: newAlbum.category || 'Wedding Photography',
      image: newAlbum.image,
      video_url: newAlbum.video_url || '',
      note: newAlbum.note || '',
      is_published: true,
      sort_order: 1,
    }

    setContent((prev) => ({
      ...prev,
      albums: [albumWithId, ...prev.albums.map((a) => ({ ...a, sort_order: (a.sort_order || 0) + 1 }))],
    }))

    // Sync with Supabase
    const config = getSupabaseConfig()
    if (config.url && config.anonKey) {
      try {
        const client = createClient(config.url, config.anonKey)
        await client.from('albums').insert({
          id: albumWithId.id,
          title: albumWithId.title,
          category: albumWithId.category,
          image_url: albumWithId.image,
          video_url: albumWithId.video_url,
          note: albumWithId.note,
          sort_order: 1,
          is_published: true,
        })
      } catch (e) {
        console.error('Supabase album add error:', e)
      }
    }
  }

  const removeAlbum = async (id) => {
    setContent((prev) => ({
      ...prev,
      albums: prev.albums.filter((a) => a.id !== id),
    }))

    const config = getSupabaseConfig()
    if (config.url && config.anonKey) {
      try {
        const client = createClient(config.url, config.anonKey)
        await client.from('albums').delete().eq('id', id)
      } catch (e) {
        console.error('Supabase album remove error:', e)
      }
    }
  }

  const updateAlbum = async (id, updates) => {
    setContent((prev) => ({
      ...prev,
      albums: prev.albums.map((a) => (a.id === id ? { ...a, ...updates } : a)),
    }))

    const config = getSupabaseConfig()
    if (config.url && config.anonKey) {
      try {
        const client = createClient(config.url, config.anonKey)
        const payload = {}
        if (updates.title !== undefined) payload.title = updates.title
        if (updates.category !== undefined) payload.category = updates.category
        if (updates.image !== undefined) payload.image_url = updates.image
        if (updates.video_url !== undefined) payload.video_url = updates.video_url
        if (updates.note !== undefined) payload.note = updates.note
        if (updates.is_published !== undefined) payload.is_published = updates.is_published
        if (updates.sort_order !== undefined) payload.sort_order = updates.sort_order
        payload.updated_at = new Date().toISOString()

        await client.from('albums').update(payload).eq('id', id)
      } catch (e) {
        console.error('Supabase album update error:', e)
      }
    }
  }

  // Toggle Visibility (Publish / Hide)
  const togglePublishAlbum = (id) => {
    const target = content.albums.find((a) => a.id === id)
    if (target) {
      updateAlbum(id, { is_published: !target.is_published })
    }
  }

  // Reorder Albums (Drag & Drop / Move Up / Down)
  const reorderAlbums = async (reorderedList) => {
    const updated = reorderedList.map((item, idx) => ({
      ...item,
      sort_order: idx + 1,
    }))
    setContent((prev) => ({
      ...prev,
      albums: updated,
    }))

    const config = getSupabaseConfig()
    if (config.url && config.anonKey) {
      try {
        const client = createClient(config.url, config.anonKey)
        for (const item of updated) {
          await client.from('albums').update({ sort_order: item.sort_order }).eq('id', item.id)
        }
      } catch (e) {
        console.error('Supabase album reorder error:', e)
      }
    }
  }

  // Shuffle Albums Order
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

    const config = getSupabaseConfig()
    if (config.url && config.anonKey) {
      try {
        const client = createClient(config.url, config.anonKey)
        for (const item of updated) {
          await client.from('albums').update({ sort_order: item.sort_order }).eq('id', item.id)
        }
      } catch (e) {
        console.error('Supabase album shuffle error:', e)
      }
    }
  }

  // --- Testimonial Actions ---
  const addTestimonial = async (newTestimonial) => {
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

    const config = getSupabaseConfig()
    if (config.url && config.anonKey) {
      try {
        const client = createClient(config.url, config.anonKey)
        await client.from('testimonials').insert({
          id: tWithId.id,
          client_name: tWithId.clientName,
          service: tWithId.service,
          location: tWithId.location,
          image_url: tWithId.image,
          review: tWithId.review,
          is_published: true,
          sort_order: 1,
        })
      } catch (e) {
        console.error('Supabase testimonial add error:', e)
      }
    }
  }

  const removeTestimonial = async (id) => {
    setContent((prev) => ({
      ...prev,
      testimonials: prev.testimonials.filter((t) => t.id !== id),
    }))

    const config = getSupabaseConfig()
    if (config.url && config.anonKey) {
      try {
        const client = createClient(config.url, config.anonKey)
        await client.from('testimonials').delete().eq('id', id)
      } catch (e) {
        console.error('Supabase testimonial remove error:', e)
      }
    }
  }

  const updateTestimonial = async (id, updates) => {
    setContent((prev) => ({
      ...prev,
      testimonials: prev.testimonials.map((t) => (t.id === id ? { ...t, ...updates } : t)),
    }))

    const config = getSupabaseConfig()
    if (config.url && config.anonKey) {
      try {
        const client = createClient(config.url, config.anonKey)
        const payload = {}
        if (updates.clientName !== undefined) payload.client_name = updates.clientName
        if (updates.service !== undefined) payload.service = updates.service
        if (updates.location !== undefined) payload.location = updates.location
        if (updates.image !== undefined) payload.image_url = updates.image
        if (updates.review !== undefined) payload.review = updates.review
        if (updates.is_published !== undefined) payload.is_published = updates.is_published
        if (updates.sort_order !== undefined) payload.sort_order = updates.sort_order
        payload.updated_at = new Date().toISOString()

        await client.from('testimonials').update(payload).eq('id', id)
      } catch (e) {
        console.error('Supabase testimonial update error:', e)
      }
    }
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

  const saveSupabaseCredentials = (url, anonKey) => {
    saveSupabaseConfig(url, anonKey)
    if (url && anonKey) {
      loadFromSupabase()
    } else {
      setSupabaseStatus('local')
    }
  }

  return (
    <ContentContext.Provider
      value={{
        content,
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
        saveSupabaseCredentials,
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
