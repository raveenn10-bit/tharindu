import React, { createContext, useContext, useState, useEffect } from 'react'
import { featured as defaultFeatured } from '../data/portfolio'

const STORAGE_KEY = 'tilnogz_content_store_v1'
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
    layout: 'text-left',
    review:
      'You were really good at capturing our most valuable memories. you have done a great job capturing romantic moments at both our wedding and the preshoot. thank you Tharindu for making our day so special and giving us amazing photos to remember our day with for years to come. you are really talented and easy to work with. and really appreciate your hard work and engagement. ☺️',
  },
  {
    id: 't-2',
    clientName: 'Ishara',
    service: 'Lifestyle & Editorial Session',
    location: 'Hikkaduwa, Sri Lanka',
    image: '/photos/street/st-01.jpg',
    layout: 'text-right',
    review:
      'Your photography skills are simply amazing, as you’ve managed to capture each important moment on camera. I have been impressed with your professionalism and would like to express my gratitude for doing such an amazing job! thanks a lot for every thing malli.. keep up good work. good luck ❤️',
  },
  {
    id: 't-3',
    clientName: 'Anju',
    service: 'Sports & Action Coverage',
    location: 'Colombo, Sri Lanka',
    image: '/photos/field/fd-04.jpg',
    layout: 'text-left',
    review:
      'A huge thank goes to Tilnogz Photography for doing our pre-wedding shoot in the best way a client can think of 💖 All his clicks speak out his talent, passion, and dedication he puts into the work. We’re also grateful for his friendly and supportive service and for the faster outputs. All the very best to rank higher and higher in the industry! 😊',
  },
  {
    id: 't-4',
    clientName: 'Rowena',
    service: 'Architecture & Event Monograph',
    location: 'Galle, Sri Lanka',
    image: '/photos/editorial/ed-04.jpg',
    layout: 'text-right',
    review:
      'I just wanted to thank you for the beautiful wedding photos you’ve taken. You captured the most special moments, and we were glad to get so many great images. All our friends and family members appreciated every picture. Working with you was a very positive experience. You took a perfect photo that looks very natural. We are very grateful for your work and will definitely turn to you in the future. 😍 ❤️',
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
  albums: defaultFeatured.map((item) => ({
    id: item.id,
    title: item.title,
    category: item.category,
    image: typeof item.image === 'string' ? item.image : item.image?.src || '',
    note: item.note || '',
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
      console.error('Failed to load saved content from localStorage:', err)
    }
    return initialContentState
  })

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    try {
      return sessionStorage.getItem(AUTH_KEY) === 'true'
    } catch {
      return false
    }
  })

  // Persist content updates to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(content))
    } catch (err) {
      console.error('Failed to save content to localStorage:', err)
    }
  }, [content])

  // Authentication methods
  const login = (passcode) => {
    if (passcode === DEFAULT_PASSCODE) {
      setIsAuthenticated(true)
      try {
        sessionStorage.setItem(AUTH_KEY, 'true')
      } catch {}
      return { success: true }
    }
    return { success: false, error: 'Incorrect passcode. Please try again.' }
  }

  const logout = () => {
    setIsAuthenticated(false)
    try {
      sessionStorage.removeItem(AUTH_KEY)
    } catch {}
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

  // --- Album Actions ---
  const addAlbum = (newAlbum) => {
    const albumWithId = {
      ...newAlbum,
      id: newAlbum.id || `album-${Date.now()}`,
    }
    setContent((prev) => ({
      ...prev,
      albums: [albumWithId, ...prev.albums],
    }))
  }

  const removeAlbum = (id) => {
    setContent((prev) => ({
      ...prev,
      albums: prev.albums.filter((a) => a.id !== id),
    }))
  }

  const updateAlbum = (id, updates) => {
    setContent((prev) => ({
      ...prev,
      albums: prev.albums.map((a) => (a.id === id ? { ...a, ...updates } : a)),
    }))
  }

  // --- Testimonial Actions ---
  const addTestimonial = (newTestimonial) => {
    const tWithId = {
      ...newTestimonial,
      id: newTestimonial.id || `t-${Date.now()}`,
      layout: prevLayout(content.testimonials.length),
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
        isAuthenticated,
        login,
        logout,
        updateHeroImages,
        updateAbout,
        addAlbum,
        removeAlbum,
        updateAlbum,
        addTestimonial,
        removeTestimonial,
        updateTestimonial,
        resetToDefaults,
        exportConfig,
        importConfig,
      }}
    >
      {children}
    </ContentContext.Provider>
  )
}

function prevLayout(length) {
  return length % 2 === 0 ? 'text-left' : 'text-right'
}

export function useContent() {
  const ctx = useContext(ContentContext)
  if (!ctx) {
    throw new Error('useContent must be used within a ContentProvider')
  }
  return ctx
}
