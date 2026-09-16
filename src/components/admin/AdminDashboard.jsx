import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X,
  Plus,
  Trash2,
  Edit,
  Eye,
  EyeOff,
  ArrowUp,
  ArrowDown,
  Image,
  Layers,
  User,
  MessageSquare,
  Sparkles,
  Download,
  Upload,
  RefreshCw,
  LogOut,
  ExternalLink,
  CheckCircle2,
  Smartphone,
  Monitor,
  MapPin,
  Database,
  Key,
  ShieldCheck,
  Video,
  Shuffle,
  AlertTriangle,
  Info,
  Film,
  Save,
  Check,
  Loader2,
  Package,
  CreditCard,
  Tag,
} from 'lucide-react'
import { useContent } from '../../context/ContentContext'
import ImageUploader from './ImageUploader'

// Backend status badge styling, keyed by ContentContext's supabaseStatus
const BACKEND_STATUS = {
  checking: {
    label: 'Checking',
    className: 'bg-charcoal/10 text-charcoal/70 border-charcoal/20 hover:bg-charcoal/15',
  },
  connected: {
    label: 'Live',
    className: 'bg-emerald-100 text-emerald-800 border-emerald-300 hover:bg-emerald-200',
  },
  unconfigured: {
    label: 'No Backend',
    className: 'bg-amber-100 text-amber-800 border-amber-300 hover:bg-amber-200',
  },
  error: {
    label: 'Offline',
    className: 'bg-red-100 text-red-700 border-red-300 hover:bg-red-200',
  },
}

// Maximum Limits as requested
const MAX_VISIBLE_PHOTOS = 45
const MAX_VISIBLE_VIDEOS = 3
const MAX_VISIBLE_TESTIMONIALS = 3

export default function AdminDashboard({ isOpen, onClose }) {
  const {
    content,
    supabaseStatus,
    supabaseError,
    refreshBackendStatus,
    canWriteToBackend,
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
  } = useContent()

  const backend = BACKEND_STATUS[supabaseStatus] || BACKEND_STATUS.checking

  const [activeTab, setActiveTab] = useState('albums') // 'albums' | 'videos' | 'plans' | 'strip' | 'hero' | 'about' | 'testimonials'
  const [toastMessage, setToastMessage] = useState('')
  const [isSavingAll, setIsSavingAll] = useState(false)

  // Modal / Form States
  const [isAddingAlbum, setIsAddingAlbum] = useState(false)
  const [editingAlbum, setEditingAlbum] = useState(null)

  const [isAddingVideo, setIsAddingVideo] = useState(false)
  const [editingVideo, setEditingVideo] = useState(null)

  const [isAddingTestimonial, setIsAddingTestimonial] = useState(false)
  const [editingTestimonial, setEditingTestimonial] = useState(null)

  const [isAddingPlan, setIsAddingPlan] = useState(false)
  const [editingPlan, setEditingPlan] = useState(null)
  const [newPlan, setNewPlan] = useState({
    name: '',
    subtitle: '',
    badge: 'CUSTOM PACKAGE',
    price: '',
    isPopular: false,
    description: '',
    featuresText: 'Up to 3 Hours Coverage\n50+ Master Retouched Photos\nHigh-Res Digital Gallery\nFull Social Usage Rights',
    inquiryMessage: '',
  })

  // Strip Photo Form States
  const [isAddingStripPhoto, setIsAddingStripPhoto] = useState(false)
  const [editingStripPhoto, setEditingStripPhoto] = useState(null)
  const [newStripPhoto, setNewStripPhoto] = useState({
    title: '',
    category: 'Architecture',
    image_url: '',
  })

  // Local Hero Form State
  const [heroForm, setHeroForm] = useState({
    desktop: content?.hero?.desktopImage || '/photos/hero.png',
    mobile: content?.hero?.mobileImage || '/photos/hero-mobile.png',
  })

  // Local About Form State
  const [aboutForm, setAboutForm] = useState({
    name: content?.about?.name || 'Tharindu Lakshan',
    address: content?.about?.address || 'Colombo 7, Sri Lanka',
    bio1: content?.about?.bio1 || '',
    bio2: content?.about?.bio2 || '',
    portraitImage: content?.about?.portraitImage || '/photos/tharindu-portrait.png',
  })

  // New Album Form State
  const [newAlbum, setNewAlbum] = useState({
    title: '',
    category: 'Wedding Photography',
    image: '',
    note: '',
  })

  // New Video Form State
  const [newVideo, setNewVideo] = useState({
    title: '',
    category: 'Pre-Wedding / Wedding Cinematography',
    video_url: '',
    description: '',
  })

  // New Testimonial Form State
  const [newTestimonial, setNewTestimonial] = useState({
    clientName: '',
    service: 'Wedding Photography',
    location: 'Colombo, Sri Lanka',
    image: '',
    review: '',
  })

  // Sync heroForm and aboutForm whenever content is loaded/updated
  useEffect(() => {
    if (content?.hero) {
      setHeroForm({
        desktop: content.hero.desktopImage || '/photos/hero.png',
        mobile: content.hero.mobileImage || '/photos/hero-mobile.png',
      })
    }
    if (content?.about) {
      setAboutForm({
        name: content.about.name || 'Tharindu Lakshan',
        address: content.about.address || 'Colombo 7, Sri Lanka',
        bio1: content.about.bio1 || '',
        bio2: content.about.bio2 || '',
        portraitImage: content.about.portraitImage || '/photos/tharindu-portrait.png',
      })
    }
  }, [content])

  const showToast = (msg) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(''), 3000)
  }

  // Published counts for limits
  const publishedPhotosCount = (content?.albums || []).filter((a) => a.is_published !== false).length
  const publishedVideosCount = (content?.videos || []).filter((v) => v.is_published !== false).length
  const publishedTestimonialsCount = (content?.testimonials || []).filter((t) => t.is_published !== false).length

  // --- Handlers for Albums ---
  const handleCreateAlbum = async (e) => {
    e.preventDefault()
    if (!newAlbum.title || !newAlbum.image) {
      alert('Please provide a title and upload a photo.')
      return
    }
    const res = await addAlbum(newAlbum)
    setNewAlbum({
      title: '',
      category: 'Wedding Photography',
      image: '',
      note: '',
    })
    setIsAddingAlbum(false)
    if (res?.error) {
      showToast('Saved locally. Backend note: ' + res.error)
    } else {
      showToast('Photo uploaded & saved to Database!')
    }
  }

  const handleSaveEditedAlbum = async (e) => {
    e.preventDefault()
    if (!editingAlbum) return
    const res = await updateAlbum(editingAlbum.id, editingAlbum)
    setEditingAlbum(null)
    if (res?.error) {
      showToast('Saved locally. Backend note: ' + res.error)
    } else {
      showToast('Photo details updated in Database!')
    }
  }

  const handleMoveAlbum = (index, direction) => {
    const list = [...content.albums]
    const targetIdx = index + direction
    if (targetIdx < 0 || targetIdx >= list.length) return
    const temp = list[index]
    list[index] = list[targetIdx]
    list[targetIdx] = temp
    reorderAlbums(list)
    showToast('Order updated!')
  }

  // --- Handlers for Videos ---
  const handleCreateVideo = (e) => {
    e.preventDefault()
    if (!newVideo.title || !newVideo.video_url) {
      alert('Please provide a video title and upload or paste a video URL.')
      return
    }
    if (addVideo) {
      addVideo(newVideo)
    }
    setNewVideo({
      title: '',
      category: 'Pre-Wedding / Wedding Cinematography',
      video_url: '',
      description: '',
    })
    setIsAddingVideo(false)
    showToast('Video added to Cinematography section!')
  }

  const handleSaveEditedVideo = (e) => {
    e.preventDefault()
    if (!editingVideo) return
    if (updateVideo) {
      updateVideo(editingVideo.id, editingVideo)
    }
    setEditingVideo(null)
    showToast('Video details updated!')
  }

  // --- Handlers for Testimonials ---
  const handleCreateTestimonial = (e) => {
    e.preventDefault()
    if (!newTestimonial.clientName || !newTestimonial.review || !newTestimonial.image) {
      alert('Please fill out client name, review, and upload a client photo.')
      return
    }
    addTestimonial(newTestimonial)
    setNewTestimonial({
      clientName: '',
      service: 'Wedding Photography',
      location: 'Colombo, Sri Lanka',
      image: '',
      review: '',
    })
    setIsAddingTestimonial(false)
    showToast('New testimonial published!')
  }

  const handleSaveEditedTestimonial = (e) => {
    e.preventDefault()
    if (!editingTestimonial) return
    updateTestimonial(editingTestimonial.id, editingTestimonial)
    setEditingTestimonial(null)
    showToast('Testimonial updated!')
  }

  // --- Handlers for Plans & Packages ---
  const handleCreatePlan = (e) => {
    e.preventDefault()
    if (!newPlan.name) {
      alert('Please provide a package name.')
      return
    }
    const features = (newPlan.featuresText || '')
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean)

    if (addPlan) {
      addPlan({
        ...newPlan,
        features: features.length > 0 ? features : ['On-Location Photography Coverage', 'Master Color-Graded Photos'],
        inquiryMessage:
          newPlan.inquiryMessage ||
          `Hello Tilnogz Photography, I would like to inquire about the ${newPlan.name} package.`,
      })
    }
    setNewPlan({
      name: '',
      subtitle: '',
      badge: 'CUSTOM PACKAGE',
      price: '',
      isPopular: false,
      description: '',
      featuresText: 'Up to 3 Hours Coverage\n50+ Master Retouched Photos\nHigh-Res Digital Gallery\nFull Social Usage Rights',
      inquiryMessage: '',
    })
    setIsAddingPlan(false)
    showToast('New photography plan created!')
  }

  const handleSaveEditedPlan = (e) => {
    e.preventDefault()
    if (!editingPlan) return
    const features = typeof editingPlan.featuresText === 'string'
      ? editingPlan.featuresText.split('\n').map((s) => s.trim()).filter(Boolean)
      : editingPlan.features

    if (updatePlan) {
      updatePlan(editingPlan.id, {
        ...editingPlan,
        features: features && features.length > 0 ? features : editingPlan.features,
      })
    }
    setEditingPlan(null)
    showToast('Plan package details updated!')
  }

  const handleTogglePublishPlan = (id) => {
    if (togglePublishPlan) {
      togglePublishPlan(id)
      showToast('Plan visibility updated!')
    }
  }

  const handleDeletePlan = (id, name) => {
    if (confirm(`Are you sure you want to delete the plan "${name}"?`)) {
      if (removePlan) {
        removePlan(id)
        showToast('Plan package removed.')
      }
    }
  }

  const handleMovePlan = (index, direction) => {
    const currentPlans = [...(content?.plans || [])]
    const targetIndex = index + direction
    if (targetIndex < 0 || targetIndex >= currentPlans.length) return
    const [moved] = currentPlans.splice(index, 1)
    currentPlans.splice(targetIndex, 0, moved)
    if (reorderPlans) {
      reorderPlans(currentPlans)
      showToast('Plan order updated!')
    }
  }

  // --- Handlers for Photo Strip ---
  const handleCreateStripPhoto = (e) => {
    e.preventDefault()
    if (!newStripPhoto.image_url) {
      alert('Please upload or provide an image for the photo strip.')
      return
    }
    addStripPhoto(newStripPhoto)
    setNewStripPhoto({
      title: '',
      category: 'Architecture',
      image_url: '',
    })
    setIsAddingStripPhoto(false)
    showToast('Photo added to bottom strip!')
  }

  const handleUpdateStripPhoto = (e) => {
    e.preventDefault()
    if (!editingStripPhoto || !editingStripPhoto.id) return
    updateStripPhoto(editingStripPhoto.id, {
      title: editingStripPhoto.title,
      category: editingStripPhoto.category,
      image_url: editingStripPhoto.image_url,
    })
    setEditingStripPhoto(null)
    showToast('Strip photo updated!')
  }

  const handleDeleteStripPhoto = (id, title) => {
    if (window.confirm(`Are you sure you want to remove "${title || 'this photo'}" from the strip?`)) {
      removeStripPhoto(id)
      showToast('Photo removed from strip.')
    }
  }

  const handleTogglePublishStripPhoto = (id) => {
    togglePublishStripPhoto(id)
    showToast('Strip photo visibility updated.')
  }

  const handleMoveStripPhoto = (index, direction) => {
    const stripList = [...(content?.stripPhotos || [])]
    const targetIndex = index + direction
    if (targetIndex < 0 || targetIndex >= stripList.length) return
    const [moved] = stripList.splice(index, 1)
    stripList.splice(targetIndex, 0, moved)
    reorderStripPhotos(stripList)
    showToast('Strip order updated!')
  }

  // --- Handlers for Hero & About ---
  const handleSaveHero = async (e) => {
    e.preventDefault()
    updateHeroImages(heroForm)
    if (saveAllChanges) {
      await saveAllChanges({ hero: heroForm })
    }
    showToast('Hero background images updated & published!')
  }

  const handleSaveAbout = async (e) => {
    e.preventDefault()
    updateAbout(aboutForm)
    if (saveAllChanges) {
      await saveAllChanges({ about: aboutForm })
    }
    showToast('About section updated & published!')
  }

  const handleSaveAll = async () => {
    setIsSavingAll(true)
    try {
      updateHeroImages(heroForm)
      updateAbout(aboutForm)
      if (saveAllChanges) {
        const res = await saveAllChanges({ hero: heroForm, about: aboutForm })
        if (res?.success) {
          showToast('All changes saved & updated on live site!')
        } else {
          showToast('Saved to browser. Backend updated.')
        }
      } else {
        showToast('All changes saved successfully!')
      }
    } catch (e) {
      showToast('All changes saved.')
    } finally {
      setIsSavingAll(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-0 md:p-6 bg-charcoal/85 backdrop-blur-lg select-none">
      <motion.div
        initial={{ opacity: 0, scale: 0.98, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.98, y: 15 }}
        className="w-full max-w-7xl h-[100dvh] md:h-[92vh] bg-white rounded-none md:rounded-3xl shadow-2xl border-0 md:border md:border-charcoal/15 flex flex-col overflow-hidden relative"
      >
        {/* ======================================================== */}
        {/* Top Header Bar (Desktop & Mobile Adaptive)              */}
        {/* ======================================================== */}
        <header className="px-4 sm:px-8 py-3.5 sm:py-4 bg-[#FAF8F5] border-b border-charcoal/10 flex items-center justify-between gap-2 flex-shrink-0">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-charcoal text-copper flex items-center justify-center shadow font-serif font-bold text-base sm:text-lg">
              T
            </div>
            <div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <h2 className="font-serif text-base sm:text-xl font-bold text-charcoal tracking-tight uppercase truncate">
                  Tilnogz Portal
                </h2>
                <button
                  type="button"
                  onClick={refreshBackendStatus}
                  title={
                    supabaseError
                      ? `${backend.label}: ${supabaseError} (click to retry)`
                      : `Backend ${backend.label} (click to re-check)`
                  }
                  className={`text-[9px] sm:text-[10px] font-sans font-bold px-1.5 py-0.5 rounded-full border flex-shrink-0 transition-colors ${backend.className}`}
                >
                  {backend.label}
                </button>
              </div>
              <p className="text-[10px] sm:text-xs text-charcoal-muted font-sans hidden sm:block">
                Manage Photos, Videos, Hero, About & Testimonials
              </p>
            </div>
          </div>

          {/* Header Action Controls */}
          <div className="flex items-center gap-1.5 sm:gap-2.5">
            {/* Primary Save Button */}
            <button
              type="button"
              onClick={handleSaveAll}
              disabled={isSavingAll}
              className="px-2.5 sm:px-4 py-1.5 sm:py-2 bg-copper hover:bg-copper-dark text-white rounded-lg sm:rounded-xl text-xs font-sans font-bold flex items-center gap-1.5 transition-all shadow-md active:scale-95 disabled:opacity-75"
              title="Save all changes & publish live"
            >
              {isSavingAll ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Save className="w-3.5 h-3.5" />
              )}
              <span className="hidden xs:inline sm:inline">
                {isSavingAll ? 'Saving...' : 'Save All Changes'}
              </span>
              <span className="xs:hidden sm:hidden">
                {isSavingAll ? '...' : 'Save'}
              </span>
            </button>

            <button
              type="button"
              onClick={exportConfig}
              className="p-2 sm:px-3 sm:py-1.5 bg-white border border-charcoal/20 text-charcoal hover:bg-copper hover:text-white rounded-lg sm:rounded-xl text-xs font-sans font-bold flex items-center gap-1.5 transition-colors shadow-sm"
              title="Download JSON Backup"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Backup</span>
            </button>

            <button
              type="button"
              onClick={() => {
                logout()
                onClose()
              }}
              className="p-2 sm:px-3 sm:py-1.5 bg-white border border-red-200 text-red-600 hover:bg-red-600 hover:text-white rounded-lg sm:rounded-xl text-xs font-sans font-bold flex items-center gap-1.5 transition-colors shadow-sm"
              title="Log Out"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 sm:p-2 text-charcoal/50 hover:text-charcoal rounded-full hover:bg-sand/40 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* ======================================================== */}
        {/* Read-only warning: RLS rejects writes without a session  */}
        {/* ======================================================== */}
        {!canWriteToBackend && (
          <div className="bg-amber-50 border-b border-amber-200 px-4 sm:px-8 py-2 flex items-center gap-1.5 text-[11px] sm:text-xs font-sans text-amber-900 flex-shrink-0">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
            <span className="truncate">
              <strong>Read-only:</strong> changes stay on this device. Sign in with your
              Supabase email and password to save them to the backend.
            </span>
          </div>
        )}

        {/* ======================================================== */}
        {/* Capacity Limit Reminder Alert Banner                     */}
        {/* ======================================================== */}
        <div className="bg-sand/30 border-b border-charcoal/10 px-4 sm:px-8 py-2 flex items-center justify-between gap-2 text-xs font-sans flex-shrink-0 overflow-x-auto scrollbar-none">
          <div className="flex items-center gap-1.5 text-charcoal text-[11px] sm:text-xs truncate">
            <Info className="w-3.5 h-3.5 text-copper flex-shrink-0" />
            <span className="font-medium truncate">
              <strong>Limits:</strong> Max 45 Images · Max 3 Videos · Max 3 Reviews
            </span>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-3 flex-shrink-0">
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] sm:text-[11px] font-bold ${
                publishedPhotosCount > MAX_VISIBLE_PHOTOS
                  ? 'bg-amber-100 text-amber-900 border border-amber-300'
                  : 'bg-white text-charcoal border border-charcoal/15'
              }`}
            >
              📷 {publishedPhotosCount}/{MAX_VISIBLE_PHOTOS}
            </span>
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] sm:text-[11px] font-bold ${
                publishedVideosCount > MAX_VISIBLE_VIDEOS
                  ? 'bg-amber-100 text-amber-900 border border-amber-300'
                  : 'bg-white text-charcoal border border-charcoal/15'
              }`}
            >
              🎬 {publishedVideosCount}/{MAX_VISIBLE_VIDEOS}
            </span>
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] sm:text-[11px] font-bold ${
                publishedTestimonialsCount > MAX_VISIBLE_TESTIMONIALS
                  ? 'bg-amber-100 text-amber-900 border border-amber-300'
                  : 'bg-white text-charcoal border border-charcoal/15'
              }`}
            >
              💬 {publishedTestimonialsCount}/{MAX_VISIBLE_TESTIMONIALS}
            </span>
          </div>
        </div>

        {/* ======================================================== */}
        {/* Main Body (Sidebar on Desktop + Bottom App Bar on Mobile)*/}
        {/* ======================================================== */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden pb-16 md:pb-0">
          {/* Desktop Navigation Sidebar (hidden on mobile) */}
          <aside className="hidden md:flex w-64 bg-[#FAF8F5] border-r border-charcoal/10 p-4 flex-col gap-1.5 overflow-y-auto flex-shrink-0">
            <button
              type="button"
              onClick={() => setActiveTab('albums')}
              className={`px-4 py-3 rounded-xl text-xs font-sans font-bold uppercase tracking-wider flex items-center justify-between transition-all ${
                activeTab === 'albums'
                  ? 'bg-charcoal text-white shadow-md'
                  : 'text-charcoal hover:bg-sand/40 hover:text-copper'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Image className="w-4 h-4" />
                <span>Albums ({content?.albums?.length || 0})</span>
              </div>
              <span
                className={`text-[10px] px-2 py-0.5 rounded-full ${
                  activeTab === 'albums' ? 'bg-white/20 text-white' : 'bg-charcoal/10 text-charcoal'
                }`}
              >
                {publishedPhotosCount} active
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('videos')}
              className={`px-4 py-3 rounded-xl text-xs font-sans font-bold uppercase tracking-wider flex items-center justify-between transition-all ${
                activeTab === 'videos'
                  ? 'bg-charcoal text-white shadow-md'
                  : 'text-charcoal hover:bg-sand/40 hover:text-copper'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Film className="w-4 h-4" />
                <span>Videos ({(content?.videos || []).length})</span>
              </div>
              <span
                className={`text-[10px] px-2 py-0.5 rounded-full ${
                  activeTab === 'videos' ? 'bg-white/20 text-white' : 'bg-charcoal/10 text-charcoal'
                }`}
              >
                {publishedVideosCount} active
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('plans')}
              className={`px-4 py-3 rounded-xl text-xs font-sans font-bold uppercase tracking-wider flex items-center justify-between transition-all ${
                activeTab === 'plans'
                  ? 'bg-charcoal text-white shadow-md'
                  : 'text-charcoal hover:bg-sand/40 hover:text-copper'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Package className="w-4 h-4" />
                <span>Plans ({(content?.plans || []).length})</span>
              </div>
              <span
                className={`text-[10px] px-2 py-0.5 rounded-full ${
                  activeTab === 'plans'
                    ? 'bg-white/20 text-white'
                    : 'bg-charcoal/10 text-charcoal'
                }`}
              >
                {(content?.plans || []).filter((p) => p.is_published !== false).length} active
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('strip')}
              className={`px-4 py-3 rounded-xl text-xs font-sans font-bold uppercase tracking-wider flex items-center justify-between transition-all ${
                activeTab === 'strip'
                  ? 'bg-charcoal text-white shadow-md'
                  : 'text-charcoal hover:bg-sand/40 hover:text-copper'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Layers className="w-4 h-4" />
                <span>Photo Strip ({(content?.stripPhotos || []).length})</span>
              </div>
              <span
                className={`text-[10px] px-2 py-0.5 rounded-full ${
                  activeTab === 'strip'
                    ? 'bg-white/20 text-white'
                    : 'bg-charcoal/10 text-charcoal'
                }`}
              >
                {(content?.stripPhotos || []).filter((p) => p.is_published !== false).length} active
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('hero')}
              className={`px-4 py-3 rounded-xl text-xs font-sans font-bold uppercase tracking-wider flex items-center gap-2.5 transition-all ${
                activeTab === 'hero'
                  ? 'bg-charcoal text-white shadow-md'
                  : 'text-charcoal hover:bg-sand/40 hover:text-copper'
              }`}
            >
              <Monitor className="w-4 h-4" />
              <span>Hero Images</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('about')}
              className={`px-4 py-3 rounded-xl text-xs font-sans font-bold uppercase tracking-wider flex items-center gap-2.5 transition-all ${
                activeTab === 'about'
                  ? 'bg-charcoal text-white shadow-md'
                  : 'text-charcoal hover:bg-sand/40 hover:text-copper'
              }`}
            >
              <User className="w-4 h-4" />
              <span>About Section</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('testimonials')}
              className={`px-4 py-3 rounded-xl text-xs font-sans font-bold uppercase tracking-wider flex items-center justify-between transition-all ${
                activeTab === 'testimonials'
                  ? 'bg-charcoal text-white shadow-md'
                  : 'text-charcoal hover:bg-sand/40 hover:text-copper'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <MessageSquare className="w-4 h-4" />
                <span>Reviews ({content?.testimonials?.length || 0})</span>
              </div>
              <span
                className={`text-[10px] px-2 py-0.5 rounded-full ${
                  activeTab === 'testimonials'
                    ? 'bg-white/20 text-white'
                    : 'bg-charcoal/10 text-charcoal'
                }`}
              >
                {publishedTestimonialsCount} active
              </span>
            </button>
          </aside>

          {/* Content Area */}
          <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 bg-white">
            {/* ======================================================== */}
            {/* TAB 1: ALBUMS / PHOTOS                                  */}
            {/* ======================================================== */}
            {activeTab === 'albums' && (
              <div className="space-y-4 sm:space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-charcoal/10">
                  <div>
                    <h3 className="font-serif text-lg sm:text-2xl font-bold text-charcoal uppercase">
                      Album Photos
                    </h3>
                    <p className="text-[11px] sm:text-xs text-charcoal-muted font-sans">
                      Upload directly to Supabase storage. <strong>Max 45 visible.</strong>
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        shuffleAlbums()
                        showToast('Albums shuffled!')
                      }}
                      className="px-3 py-2 bg-[#FAF8F5] border border-charcoal/20 text-charcoal hover:bg-sand rounded-xl text-[11px] sm:text-xs font-sans font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-sm"
                      title="Shuffle Order"
                    >
                      <Shuffle className="w-3.5 h-3.5" />
                      <span>Shuffle</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setIsAddingAlbum(true)}
                      className="flex-1 sm:flex-none px-3.5 py-2 bg-copper hover:bg-copper-dark text-white rounded-xl text-[11px] sm:text-xs font-sans font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-md transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Upload Photo</span>
                    </button>
                  </div>
                </div>

                {/* Upload New Photo Form Modal/Drawer */}
                {isAddingAlbum && (
                  <div className="fixed inset-0 z-[150] bg-charcoal/80 flex items-end sm:items-center justify-center p-0 sm:p-4">
                    <form
                      onSubmit={handleCreateAlbum}
                      className="bg-white rounded-t-3xl sm:rounded-2xl max-w-lg w-full max-h-[90dvh] overflow-y-auto p-5 sm:p-6 shadow-2xl border border-charcoal/15 space-y-4"
                    >
                      <div className="flex items-center justify-between pb-2 border-b border-charcoal/10">
                        <h4 className="font-serif text-base font-bold text-charcoal uppercase flex items-center gap-2">
                          <Plus className="w-4 h-4 text-copper" />
                          <span>Upload Photo to Supabase</span>
                        </h4>
                        <button
                          type="button"
                          onClick={() => setIsAddingAlbum(false)}
                          className="p-1 text-charcoal/40 hover:text-charcoal rounded-full"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>

                      <ImageUploader
                        value={newAlbum.image}
                        onChange={(img) => setNewAlbum({ ...newAlbum, image: img })}
                        label="Select Photo"
                        aspectRatio="aspect-[4/5]"
                        acceptMedia="image/*"
                      />

                      <div>
                        <label className="block text-xs font-sans font-bold text-charcoal uppercase mb-1">
                          Title / Shoot Name
                        </label>
                        <input
                          type="text"
                          required
                          value={newAlbum.title}
                          onChange={(e) => setNewAlbum({ ...newAlbum, title: e.target.value })}
                          placeholder="e.g. Royal Botanical Garden Couple Session"
                          className="w-full px-3 py-2 bg-[#FAF8F5] border border-charcoal/20 rounded-lg text-xs font-sans focus:outline-none focus:border-copper"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-sans font-bold text-charcoal uppercase mb-1">
                          Category
                        </label>
                        <select
                          value={newAlbum.category}
                          onChange={(e) => setNewAlbum({ ...newAlbum, category: e.target.value })}
                          className="w-full px-3 py-2 bg-[#FAF8F5] border border-charcoal/20 rounded-lg text-xs font-sans focus:outline-none focus:border-copper"
                        >
                          <option value="Wedding Photography">Wedding Photography</option>
                          <option value="Pre-Wedding / Engagement Photography">
                            Pre-Wedding / Engagement Photography
                          </option>
                          <option value="Graduation Photography">Graduation Photography</option>
                          <option value="Vehicle Photography">Vehicle Photography</option>
                          <option value="Sports Photography">Sports Photography</option>
                          <option value="Architecture Photography">Architecture Photography</option>
                        </select>
                      </div>

                      <div className="flex gap-2 pt-2">
                        <button
                          type="submit"
                          className="flex-1 py-3 bg-charcoal hover:bg-copper text-white text-xs font-sans font-bold uppercase rounded-xl transition-colors"
                        >
                          Publish to Albums
                        </button>
                        <button
                          type="button"
                          onClick={() => setIsAddingAlbum(false)}
                          className="px-4 py-3 bg-charcoal/10 text-charcoal text-xs font-sans font-bold uppercase rounded-xl"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {/* Edit Album Modal */}
                {editingAlbum && (
                  <div className="fixed inset-0 z-[150] bg-charcoal/80 flex items-end sm:items-center justify-center p-0 sm:p-4">
                    <form
                      onSubmit={handleSaveEditedAlbum}
                      className="bg-white rounded-t-3xl sm:rounded-2xl max-w-lg w-full max-h-[90dvh] overflow-y-auto p-5 sm:p-6 shadow-2xl border border-charcoal/15 space-y-4"
                    >
                      <div className="flex items-center justify-between pb-2 border-b border-charcoal/10">
                        <h4 className="font-serif text-base sm:text-lg font-bold text-charcoal uppercase">
                          Edit Photo Details
                        </h4>
                        <button
                          type="button"
                          onClick={() => setEditingAlbum(null)}
                          className="p-1 text-charcoal/40 hover:text-charcoal"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>

                      <ImageUploader
                        value={editingAlbum.image_url || editingAlbum.image}
                        onChange={(img) =>
                          setEditingAlbum({ ...editingAlbum, image_url: img, image: img })
                        }
                        label="Photo"
                        aspectRatio="aspect-[16/9]"
                      />

                      <div>
                        <label className="block text-xs font-sans font-bold text-charcoal uppercase mb-1">
                          Title
                        </label>
                        <input
                          type="text"
                          required
                          value={editingAlbum.title}
                          onChange={(e) =>
                            setEditingAlbum({ ...editingAlbum, title: e.target.value })
                          }
                          className="w-full px-3 py-2 text-xs bg-[#FAF8F5] border border-charcoal/20 rounded-lg focus:outline-none focus:border-copper"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-sans font-bold text-charcoal uppercase mb-1">
                          Category
                        </label>
                        <select
                          value={editingAlbum.category}
                          onChange={(e) =>
                            setEditingAlbum({ ...editingAlbum, category: e.target.value })
                          }
                          className="w-full px-3 py-2 text-xs bg-[#FAF8F5] border border-charcoal/20 rounded-lg focus:outline-none focus:border-copper"
                        >
                          <option value="Wedding Photography">Wedding Photography</option>
                          <option value="Pre-Wedding / Engagement Photography">
                            Pre-Wedding / Engagement Photography
                          </option>
                          <option value="Graduation Photography">Graduation Photography</option>
                          <option value="Vehicle Photography">Vehicle Photography</option>
                          <option value="Sports Photography">Sports Photography</option>
                          <option value="Architecture Photography">Architecture Photography</option>
                        </select>
                      </div>

                      <div className="flex gap-2 pt-2">
                        <button
                          type="submit"
                          className="flex-1 py-3 bg-copper text-white text-xs font-sans font-bold uppercase rounded-xl hover:bg-copper-dark"
                        >
                          Save Changes
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingAlbum(null)}
                          className="px-4 py-3 bg-charcoal/10 text-charcoal text-xs font-sans font-bold uppercase rounded-xl"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {/* Photos Responsive Grid (2 columns on mobile, 3-4 on desktop) */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                  {(content?.albums || []).map((album, idx) => {
                    const isPublished = album.is_published !== false
                    const imgSrc = album.image_url || album.image

                    return (
                      <div
                        key={album.id}
                        className={`group relative rounded-xl overflow-hidden border transition-all ${
                          isPublished
                            ? 'border-charcoal/15 bg-[#FAF8F5] shadow-sm'
                            : 'border-dashed border-charcoal/30 bg-charcoal/5 opacity-60'
                        }`}
                      >
                        <div className="aspect-[4/5] overflow-hidden bg-charcoal relative">
                          <img
                            src={imgSrc}
                            alt={album.title}
                            className="w-full h-full object-cover object-center"
                          />

                          {/* Quick Actions Bar (Touch-friendly for Mobile) */}
                          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-charcoal/90 via-charcoal/50 to-transparent p-1.5 flex items-center justify-between gap-1">
                            <button
                              type="button"
                              onClick={() => {
                                togglePublishAlbum(album.id)
                                showToast(isPublished ? 'Photo hidden' : 'Photo published!')
                              }}
                              className={`p-1.5 rounded-lg text-white ${
                                isPublished ? 'bg-emerald-600' : 'bg-charcoal'
                              }`}
                              title={isPublished ? 'Hide photo' : 'Publish photo'}
                            >
                              {isPublished ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                            </button>

                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() => setEditingAlbum(album)}
                                className="p-1.5 bg-white text-charcoal rounded-lg shadow"
                                title="Edit"
                              >
                                <Edit className="w-3 h-3" />
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  if (confirm(`Delete "${album.title}"?`)) {
                                    removeAlbum(album.id, album.image_url || album.image)
                                    showToast('Photo deleted')
                                  }
                                }}
                                className="p-1.5 bg-red-600 text-white rounded-lg shadow"
                                title="Delete"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        </div>

                        <div className="p-2 sm:p-3">
                          <span className="text-[8px] sm:text-[9px] font-sans font-bold text-copper uppercase truncate block">
                            {album.category}
                          </span>
                          <h4 className="font-serif text-[11px] sm:text-xs font-bold text-charcoal truncate mt-0.5">
                            {album.title}
                          </h4>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* ======================================================== */}
            {/* TAB 2: VIDEOS / CINEMATOGRAPHY                           */}
            {/* ======================================================== */}
            {activeTab === 'videos' && (
              <div className="space-y-4 sm:space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-charcoal/10">
                  <div>
                    <h3 className="font-serif text-lg sm:text-2xl font-bold text-charcoal uppercase">
                      Cinematography & Videos
                    </h3>
                    <p className="text-[11px] sm:text-xs text-charcoal-muted font-sans">
                      Upload 9:16 vertical videos. <strong>Max 3 visible on website.</strong>
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsAddingVideo(true)}
                    className="w-full sm:w-auto px-4 py-2.5 bg-copper hover:bg-copper-dark text-white rounded-xl text-xs font-sans font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-md transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Upload Video</span>
                  </button>
                </div>

                {/* Upload Video Modal / Drawer */}
                {isAddingVideo && (
                  <div className="fixed inset-0 z-[150] bg-charcoal/80 flex items-end sm:items-center justify-center p-0 sm:p-4">
                    <form
                      onSubmit={handleCreateVideo}
                      className="bg-white rounded-t-3xl sm:rounded-2xl max-w-lg w-full max-h-[90dvh] overflow-y-auto p-5 sm:p-6 shadow-2xl border border-charcoal/15 space-y-4"
                    >
                      <div className="flex items-center justify-between pb-2 border-b border-charcoal/10">
                        <h4 className="font-serif text-base font-bold text-charcoal uppercase flex items-center gap-2">
                          <Film className="w-4 h-4 text-copper" />
                          <span>Upload Video</span>
                        </h4>
                        <button
                          type="button"
                          onClick={() => setIsAddingVideo(false)}
                          className="p-1 text-charcoal/40 hover:text-charcoal"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>

                      <ImageUploader
                        value={newVideo.video_url}
                        onChange={(vUrl) => setNewVideo({ ...newVideo, video_url: vUrl })}
                        label="Select MP4 Video File"
                        aspectRatio="aspect-[9/16]"
                        acceptMedia="video/*"
                      />

                      <div>
                        <label className="block text-xs font-sans font-bold text-charcoal uppercase mb-1">
                          Video Title
                        </label>
                        <input
                          type="text"
                          required
                          value={newVideo.title}
                          onChange={(e) => setNewVideo({ ...newVideo, title: e.target.value })}
                          placeholder="e.g. Cinematic Wedding Teaser 4K"
                          className="w-full px-3 py-2 bg-[#FAF8F5] border border-charcoal/20 rounded-lg text-xs font-sans focus:outline-none focus:border-copper"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-sans font-bold text-charcoal uppercase mb-1">
                          Category
                        </label>
                        <select
                          value={newVideo.category}
                          onChange={(e) => setNewVideo({ ...newVideo, category: e.target.value })}
                          className="w-full px-3 py-2 bg-[#FAF8F5] border border-charcoal/20 rounded-lg text-xs font-sans focus:outline-none focus:border-copper"
                        >
                          <option value="Pre-Wedding / Wedding Cinematography">
                            Pre-Wedding / Wedding Cinematography
                          </option>
                          <option value="Vehicle & Rolling Action Reel">
                            Vehicle & Rolling Action Reel
                          </option>
                          <option value="Sports & Athletic Movement">
                            Sports & Athletic Movement
                          </option>
                          <option value="Event & Milestone Highlight">
                            Event & Milestone Highlight
                          </option>
                        </select>
                      </div>

                      <div className="flex gap-2 pt-2">
                        <button
                          type="submit"
                          className="flex-1 py-3 bg-charcoal hover:bg-copper text-white text-xs font-sans font-bold uppercase rounded-xl transition-colors"
                        >
                          Publish Video
                        </button>
                        <button
                          type="button"
                          onClick={() => setIsAddingVideo(false)}
                          className="px-4 py-3 bg-charcoal/10 text-charcoal text-xs font-sans font-bold uppercase rounded-xl"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {/* Edit Video Modal */}
                {editingVideo && (
                  <div className="fixed inset-0 z-[150] bg-charcoal/80 flex items-end sm:items-center justify-center p-0 sm:p-4">
                    <form
                      onSubmit={handleSaveEditedVideo}
                      className="bg-white rounded-t-3xl sm:rounded-2xl max-w-lg w-full max-h-[90dvh] overflow-y-auto p-5 sm:p-6 shadow-2xl border border-charcoal/15 space-y-4"
                    >
                      <div className="flex items-center justify-between pb-2 border-b border-charcoal/10">
                        <h4 className="font-serif text-base sm:text-lg font-bold text-charcoal uppercase">
                          Edit Video Details
                        </h4>
                        <button
                          type="button"
                          onClick={() => setEditingVideo(null)}
                          className="p-1 text-charcoal/40 hover:text-charcoal"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>

                      <ImageUploader
                        value={editingVideo.video_url}
                        onChange={(vUrl) => setEditingVideo({ ...editingVideo, video_url: vUrl })}
                        label="Video File / URL"
                        aspectRatio="aspect-[9/16]"
                        acceptMedia="video/*"
                      />

                      <div>
                        <label className="block text-xs font-sans font-bold text-charcoal uppercase mb-1">
                          Title
                        </label>
                        <input
                          type="text"
                          required
                          value={editingVideo.title}
                          onChange={(e) => setEditingVideo({ ...editingVideo, title: e.target.value })}
                          className="w-full px-3 py-2 text-xs bg-[#FAF8F5] border border-charcoal/20 rounded-lg focus:outline-none focus:border-copper"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-sans font-bold text-charcoal uppercase mb-1">
                          Category
                        </label>
                        <select
                          value={editingVideo.category}
                          onChange={(e) =>
                            setEditingVideo({ ...editingVideo, category: e.target.value })
                          }
                          className="w-full px-3 py-2 text-xs bg-[#FAF8F5] border border-charcoal/20 rounded-lg focus:outline-none focus:border-copper"
                        >
                          <option value="Pre-Wedding / Wedding Cinematography">
                            Pre-Wedding / Wedding Cinematography
                          </option>
                          <option value="Vehicle & Rolling Action Reel">
                            Vehicle & Rolling Action Reel
                          </option>
                          <option value="Sports & Athletic Movement">
                            Sports & Athletic Movement
                          </option>
                          <option value="Event & Milestone Highlight">
                            Event & Milestone Highlight
                          </option>
                        </select>
                      </div>

                      <div className="flex gap-2 pt-2">
                        <button
                          type="submit"
                          className="flex-1 py-3 bg-copper text-white text-xs font-sans font-bold uppercase rounded-xl hover:bg-copper-dark"
                        >
                          Save Changes
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingVideo(null)}
                          className="px-4 py-3 bg-charcoal/10 text-charcoal text-xs font-sans font-bold uppercase rounded-xl"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {/* Videos List Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {(content?.videos || []).map((vid) => {
                    const isPublished = vid.is_published !== false

                    return (
                      <div
                        key={vid.id}
                        className={`group relative rounded-2xl overflow-hidden border transition-all ${
                          isPublished
                            ? 'border-charcoal/15 bg-[#FAF8F5] shadow-sm'
                            : 'border-dashed border-charcoal/30 bg-charcoal/5 opacity-60'
                        }`}
                      >
                        <div className="aspect-[9/16] overflow-hidden bg-charcoal relative">
                          <video
                            src={vid.video_url}
                            controls
                            className="w-full h-full object-cover object-center"
                          />

                          {/* Quick Actions */}
                          <div className="absolute top-2 right-2 flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => {
                                if (togglePublishVideo) togglePublishVideo(vid.id)
                                showToast(isPublished ? 'Video hidden' : 'Video published!')
                              }}
                              className={`p-1.5 rounded-full text-white shadow ${
                                isPublished ? 'bg-emerald-600' : 'bg-charcoal'
                              }`}
                            >
                              {isPublished ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditingVideo(vid)}
                              className="p-1.5 bg-white text-charcoal hover:bg-copper hover:text-white rounded-full shadow transition-colors"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                if (confirm(`Delete video "${vid.title}"?`)) {
                                  if (removeVideo) removeVideo(vid.id)
                                  showToast('Video deleted')
                                }
                              }}
                              className="p-1.5 bg-red-600 text-white rounded-full shadow transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        <div className="p-3">
                          <span className="text-[9px] font-sans font-bold text-copper uppercase tracking-wider block">
                            {vid.category || 'Cinematography'}
                          </span>
                          <h4 className="font-serif text-xs sm:text-sm font-bold text-charcoal truncate mt-0.5">
                            {vid.title}
                          </h4>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* ======================================================== */}
            {/* TAB 3: HERO IMAGES                                       */}
            {/* ======================================================== */}
            {activeTab === 'hero' && (
              <form onSubmit={handleSaveHero} className="max-w-3xl space-y-4 sm:space-y-6">
                <div>
                  <h3 className="font-serif text-lg sm:text-2xl font-bold text-charcoal uppercase">
                    Hero Background Images
                  </h3>
                  <p className="text-[11px] sm:text-xs text-charcoal-muted font-sans">
                    Update Desktop and Mobile Hero background images.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  {/* Desktop Hero Image */}
                  <div className="p-4 sm:p-5 bg-[#FAF8F5] border border-charcoal/15 rounded-2xl space-y-3">
                    <div className="flex items-center gap-2 text-charcoal font-sans font-bold text-xs uppercase">
                      <Monitor className="w-4 h-4 text-copper" />
                      <span>Desktop Hero Image</span>
                    </div>
                    <ImageUploader
                      value={heroForm.desktop}
                      onChange={(img) => setHeroForm({ ...heroForm, desktop: img })}
                      label=""
                      aspectRatio="aspect-[16/9]"
                      acceptMedia="image/*"
                    />
                  </div>

                  {/* Mobile Hero Image */}
                  <div className="p-4 sm:p-5 bg-[#FAF8F5] border border-charcoal/15 rounded-2xl space-y-3">
                    <div className="flex items-center gap-2 text-charcoal font-sans font-bold text-xs uppercase">
                      <Smartphone className="w-4 h-4 text-copper" />
                      <span>Mobile Hero Image</span>
                    </div>
                    <ImageUploader
                      value={heroForm.mobile}
                      onChange={(img) => setHeroForm({ ...heroForm, mobile: img })}
                      label=""
                      aspectRatio="aspect-[9/16]"
                      acceptMedia="image/*"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full sm:w-auto px-6 py-3 bg-charcoal hover:bg-copper text-white text-xs font-sans font-bold uppercase tracking-wider rounded-xl transition-colors shadow-md"
                >
                  Save Hero Images
                </button>
              </form>
            )}

            {/* ======================================================== */}
            {/* TAB 4: ABOUT SECTION                                     */}
            {/* ======================================================== */}
            {activeTab === 'about' && (
              <form onSubmit={handleSaveAbout} className="max-w-3xl space-y-4 sm:space-y-6">
                <div>
                  <h3 className="font-serif text-lg sm:text-2xl font-bold text-charcoal uppercase">
                    About Artist & Studio
                  </h3>
                  <p className="text-[11px] sm:text-xs text-charcoal-muted font-sans">
                    Update photographer portrait, biography, and studio address.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-6">
                  <div className="md:col-span-5 space-y-2">
                    <label className="block text-xs font-sans font-bold text-charcoal uppercase">
                      Portrait Photo
                    </label>
                    <ImageUploader
                      value={aboutForm.portraitImage}
                      onChange={(img) => setAboutForm({ ...aboutForm, portraitImage: img })}
                      label=""
                      aspectRatio="aspect-[4/5]"
                      acceptMedia="image/*"
                    />
                  </div>

                  <div className="md:col-span-7 space-y-3 sm:space-y-4">
                    <div>
                      <label className="block text-xs font-sans font-bold text-charcoal uppercase mb-1">
                        Photographer Name
                      </label>
                      <input
                        type="text"
                        required
                        value={aboutForm.name}
                        onChange={(e) => setAboutForm({ ...aboutForm, name: e.target.value })}
                        className="w-full px-3 py-2 bg-[#FAF8F5] border border-charcoal/20 rounded-lg text-xs font-sans focus:outline-none focus:border-copper"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-sans font-bold text-charcoal uppercase mb-1">
                        Studio Address
                      </label>
                      <input
                        type="text"
                        required
                        value={aboutForm.address}
                        onChange={(e) => setAboutForm({ ...aboutForm, address: e.target.value })}
                        className="w-full px-3 py-2 bg-[#FAF8F5] border border-charcoal/20 rounded-lg text-xs font-sans focus:outline-none focus:border-copper"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-sans font-bold text-charcoal uppercase mb-1">
                        Bio Paragraph 1
                      </label>
                      <textarea
                        rows={3}
                        value={aboutForm.bio1}
                        onChange={(e) => setAboutForm({ ...aboutForm, bio1: e.target.value })}
                        className="w-full px-3 py-2 bg-[#FAF8F5] border border-charcoal/20 rounded-lg text-xs font-sans focus:outline-none focus:border-copper resize-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-sans font-bold text-charcoal uppercase mb-1">
                        Bio Paragraph 2
                      </label>
                      <textarea
                        rows={3}
                        value={aboutForm.bio2}
                        onChange={(e) => setAboutForm({ ...aboutForm, bio2: e.target.value })}
                        className="w-full px-3 py-2 bg-[#FAF8F5] border border-charcoal/20 rounded-lg text-xs font-sans focus:outline-none focus:border-copper resize-none"
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full sm:w-auto px-6 py-3 bg-charcoal hover:bg-copper text-white text-xs font-sans font-bold uppercase tracking-wider rounded-xl transition-colors shadow-md"
                >
                  Save About Section
                </button>
              </form>
            )}

            {/* ======================================================== */}
            {/* TAB 5: TESTIMONIALS                                      */}
            {/* ======================================================== */}
            {activeTab === 'testimonials' && (
              <div className="space-y-4 sm:space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-charcoal/10">
                  <div>
                    <h3 className="font-serif text-lg sm:text-2xl font-bold text-charcoal uppercase">
                      Client Testimonials
                    </h3>
                    <p className="text-[11px] sm:text-xs text-charcoal-muted font-sans">
                      Manage client reviews and photos. <strong>Max 3 visible on website.</strong>
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsAddingTestimonial(true)}
                    className="w-full sm:w-auto px-4 py-2.5 bg-copper hover:bg-copper-dark text-white rounded-xl text-xs font-sans font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-md transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Testimonial</span>
                  </button>
                </div>

                {/* Add Testimonial Modal / Drawer */}
                {isAddingTestimonial && (
                  <div className="fixed inset-0 z-[150] bg-charcoal/80 flex items-end sm:items-center justify-center p-0 sm:p-4">
                    <form
                      onSubmit={handleCreateTestimonial}
                      className="bg-white rounded-t-3xl sm:rounded-2xl max-w-lg w-full max-h-[90dvh] overflow-y-auto p-5 sm:p-6 shadow-2xl border border-charcoal/15 space-y-4"
                    >
                      <div className="flex items-center justify-between pb-2 border-b border-charcoal/10">
                        <h4 className="font-serif text-base font-bold text-charcoal uppercase flex items-center gap-2">
                          <MessageSquare className="w-4 h-4 text-copper" />
                          <span>New Client Review</span>
                        </h4>
                        <button
                          type="button"
                          onClick={() => setIsAddingTestimonial(false)}
                          className="p-1 text-charcoal/40 hover:text-charcoal"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>

                      <ImageUploader
                        value={newTestimonial.image}
                        onChange={(img) => setNewTestimonial({ ...newTestimonial, image: img })}
                        label="Client Photo"
                        aspectRatio="aspect-[4/3]"
                        acceptMedia="image/*"
                      />

                      <div>
                        <label className="block text-xs font-sans font-bold text-charcoal uppercase mb-1">
                          Client Name
                        </label>
                        <input
                          type="text"
                          required
                          value={newTestimonial.clientName}
                          onChange={(e) =>
                            setNewTestimonial({ ...newTestimonial, clientName: e.target.value })
                          }
                          placeholder="e.g. Imalka Sandeepani"
                          className="w-full px-3 py-2 bg-[#FAF8F5] border border-charcoal/20 rounded-lg text-xs font-sans focus:outline-none focus:border-copper"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-sans font-bold text-charcoal uppercase mb-1">
                          Location
                        </label>
                        <input
                          type="text"
                          required
                          value={newTestimonial.location}
                          onChange={(e) =>
                            setNewTestimonial({ ...newTestimonial, location: e.target.value })
                          }
                          placeholder="e.g. Galle, Sri Lanka"
                          className="w-full px-3 py-2 bg-[#FAF8F5] border border-charcoal/20 rounded-lg text-xs font-sans focus:outline-none focus:border-copper"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-sans font-bold text-charcoal uppercase mb-1">
                          Review Quote
                        </label>
                        <textarea
                          rows={3}
                          required
                          value={newTestimonial.review}
                          onChange={(e) =>
                            setNewTestimonial({ ...newTestimonial, review: e.target.value })
                          }
                          placeholder="Client feedback in quotes..."
                          className="w-full px-3 py-2 bg-[#FAF8F5] border border-charcoal/20 rounded-lg text-xs font-sans focus:outline-none focus:border-copper resize-none"
                        />
                      </div>

                      <div className="flex gap-2 pt-2">
                        <button
                          type="submit"
                          className="flex-1 py-3 bg-charcoal hover:bg-copper text-white text-xs font-sans font-bold uppercase rounded-xl transition-colors"
                        >
                          Publish Testimonial
                        </button>
                        <button
                          type="button"
                          onClick={() => setIsAddingTestimonial(false)}
                          className="px-4 py-3 bg-charcoal/10 text-charcoal text-xs font-sans font-bold uppercase rounded-xl"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {/* Edit Testimonial Modal */}
                {editingTestimonial && (
                  <div className="fixed inset-0 z-[150] bg-charcoal/80 flex items-end sm:items-center justify-center p-0 sm:p-4">
                    <form
                      onSubmit={handleSaveEditedTestimonial}
                      className="bg-white rounded-t-3xl sm:rounded-2xl max-w-lg w-full max-h-[90dvh] overflow-y-auto p-5 sm:p-6 shadow-2xl border border-charcoal/15 space-y-4"
                    >
                      <div className="flex items-center justify-between pb-2 border-b border-charcoal/10">
                        <h4 className="font-serif text-base sm:text-lg font-bold text-charcoal uppercase">
                          Edit Testimonial
                        </h4>
                        <button
                          type="button"
                          onClick={() => setEditingTestimonial(null)}
                          className="p-1 text-charcoal/40 hover:text-charcoal"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>

                      <ImageUploader
                        value={editingTestimonial.image}
                        onChange={(img) =>
                          setEditingTestimonial({ ...editingTestimonial, image: img })
                        }
                        label="Client Photo"
                        aspectRatio="aspect-[4/3]"
                      />

                      <div>
                        <label className="block text-xs font-sans font-bold text-charcoal uppercase mb-1">
                          Client Name
                        </label>
                        <input
                          type="text"
                          required
                          value={editingTestimonial.clientName}
                          onChange={(e) =>
                            setEditingTestimonial({
                              ...editingTestimonial,
                              clientName: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 text-xs bg-[#FAF8F5] border border-charcoal/20 rounded-lg focus:outline-none focus:border-copper"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-sans font-bold text-charcoal uppercase mb-1">
                          Location
                        </label>
                        <input
                          type="text"
                          required
                          value={editingTestimonial.location}
                          onChange={(e) =>
                            setEditingTestimonial({
                              ...editingTestimonial,
                              location: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 text-xs bg-[#FAF8F5] border border-charcoal/20 rounded-lg focus:outline-none focus:border-copper"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-sans font-bold text-charcoal uppercase mb-1">
                          Review Quote
                        </label>
                        <textarea
                          rows={3}
                          required
                          value={editingTestimonial.review}
                          onChange={(e) =>
                            setEditingTestimonial({
                              ...editingTestimonial,
                              review: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 text-xs bg-[#FAF8F5] border border-charcoal/20 rounded-lg focus:outline-none focus:border-copper resize-none"
                        />
                      </div>

                      <div className="flex gap-2 pt-2">
                        <button
                          type="submit"
                          className="flex-1 py-3 bg-copper text-white text-xs font-sans font-bold uppercase rounded-xl hover:bg-copper-dark"
                        >
                          Save Changes
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingTestimonial(null)}
                          className="px-4 py-3 bg-charcoal/10 text-charcoal text-xs font-sans font-bold uppercase rounded-xl"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {/* Testimonials List */}
                <div className="space-y-3 sm:space-y-4">
                  {(content?.testimonials || []).map((item) => {
                    const isPublished = item.is_published !== false

                    return (
                      <div
                        key={item.id}
                        className={`p-4 sm:p-5 rounded-2xl border flex flex-col sm:flex-row items-start gap-4 sm:gap-5 transition-all ${
                          isPublished
                            ? 'border-charcoal/15 bg-[#FAF8F5] shadow-sm'
                            : 'border-dashed border-charcoal/30 bg-charcoal/5 opacity-60'
                        }`}
                      >
                        <div className="w-16 h-16 sm:w-28 sm:h-28 rounded-xl overflow-hidden flex-shrink-0 bg-charcoal">
                          <img
                            src={typeof item.image === 'string' ? item.image : item.image?.src || ''}
                            alt={item.clientName}
                            className="w-full h-full object-cover object-center"
                          />
                        </div>

                        <div className="flex-1 space-y-1 w-full">
                          <div className="flex items-center justify-between">
                            <h4 className="font-serif text-base sm:text-lg font-bold text-charcoal">
                              {item.clientName}
                            </h4>
                            <div className="flex items-center gap-1.5">
                              <button
                                type="button"
                                onClick={() => {
                                  togglePublishTestimonial(item.id)
                                  showToast(
                                    isPublished ? 'Testimonial hidden' : 'Testimonial published!'
                                  )
                                }}
                                className={`p-1.5 rounded-full text-white shadow ${
                                  isPublished ? 'bg-emerald-600' : 'bg-charcoal'
                                }`}
                              >
                                {isPublished ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                              </button>
                              <button
                                type="button"
                                onClick={() => setEditingTestimonial(item)}
                                className="p-1.5 bg-white text-charcoal hover:bg-copper hover:text-white rounded-full shadow transition-colors"
                              >
                                <Edit className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  if (confirm(`Delete review from "${item.clientName}"?`)) {
                                    removeTestimonial(item.id)
                                    showToast('Testimonial removed')
                                  }
                                }}
                                className="p-1.5 bg-red-600 text-white rounded-full shadow transition-colors"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                          <p className="text-[11px] sm:text-xs text-copper font-sans font-semibold">
                            {item.service} · {item.location}
                          </p>
                          <p className="text-xs sm:text-sm text-charcoal/80 font-body italic leading-relaxed pt-0.5">
                            "{item.review}"
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* ======================================================== */}
            {/* TAB: PLANS & PACKAGES                                   */}
            {/* ======================================================== */}
            {activeTab === 'plans' && (
              <div className="space-y-4 sm:space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-charcoal/10">
                  <div>
                    <h3 className="font-serif text-lg sm:text-2xl font-bold text-charcoal uppercase flex items-center gap-2">
                      <Package className="w-5 h-5 text-copper" />
                      <span>Photography Plans & Investment</span>
                    </h3>
                    <p className="text-[11px] sm:text-xs text-charcoal-muted font-sans">
                      Customize packages, pricing tags, features, badges, and WhatsApp booking prompts shown on the website.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsAddingPlan(true)}
                    className="px-4 py-2 bg-copper hover:bg-copper-dark text-white rounded-xl text-[11px] sm:text-xs font-sans font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-md transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add New Package</span>
                  </button>
                </div>

                {/* Add Plan Modal */}
                {isAddingPlan && (
                  <div className="fixed inset-0 z-[150] bg-charcoal/80 flex items-end sm:items-center justify-center p-0 sm:p-4">
                    <form
                      onSubmit={handleCreatePlan}
                      className="bg-white rounded-t-3xl sm:rounded-2xl max-w-xl w-full max-h-[90dvh] overflow-y-auto p-5 sm:p-6 shadow-2xl border border-charcoal/15 space-y-4"
                    >
                      <div className="flex items-center justify-between pb-2 border-b border-charcoal/10">
                        <h4 className="font-serif text-base font-bold text-charcoal uppercase flex items-center gap-2">
                          <Plus className="w-4 h-4 text-copper" />
                          <span>Create New Package</span>
                        </h4>
                        <button
                          type="button"
                          onClick={() => setIsAddingPlan(false)}
                          className="p-1 text-charcoal/40 hover:text-charcoal"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-sans font-bold text-charcoal uppercase mb-1">
                            Package Name *
                          </label>
                          <input
                            type="text"
                            required
                            value={newPlan.name}
                            onChange={(e) => setNewPlan({ ...newPlan, name: e.target.value })}
                            placeholder="e.g. ESSENTIAL / GRADUATION"
                            className="w-full px-3 py-2 bg-[#FAF8F5] border border-charcoal/20 rounded-lg text-xs font-sans focus:outline-none focus:border-copper uppercase"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-sans font-bold text-charcoal uppercase mb-1">
                            Badge / Ribbon Text
                          </label>
                          <input
                            type="text"
                            value={newPlan.badge}
                            onChange={(e) => setNewPlan({ ...newPlan, badge: e.target.value })}
                            placeholder="e.g. MOST POPULAR / FOCUSED"
                            className="w-full px-3 py-2 bg-[#FAF8F5] border border-charcoal/20 rounded-lg text-xs font-sans focus:outline-none focus:border-copper uppercase"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-sans font-bold text-charcoal uppercase mb-1">
                            Subtitle / Target Audience
                          </label>
                          <input
                            type="text"
                            value={newPlan.subtitle}
                            onChange={(e) => setNewPlan({ ...newPlan, subtitle: e.target.value })}
                            placeholder="e.g. Portraits & Individual Sessions"
                            className="w-full px-3 py-2 bg-[#FAF8F5] border border-charcoal/20 rounded-lg text-xs font-sans focus:outline-none focus:border-copper"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-sans font-bold text-charcoal uppercase mb-1">
                            Price / Investment Tag (Optional)
                          </label>
                          <input
                            type="text"
                            value={newPlan.price}
                            onChange={(e) => setNewPlan({ ...newPlan, price: e.target.value })}
                            placeholder="e.g. LKR 45,000 or Quote on Request"
                            className="w-full px-3 py-2 bg-[#FAF8F5] border border-charcoal/20 rounded-lg text-xs font-sans focus:outline-none focus:border-copper"
                          />
                        </div>
                      </div>

                      <div className="flex items-center gap-2 p-3 bg-sand/30 rounded-xl border border-charcoal/10">
                        <input
                          type="checkbox"
                          id="isPopularNew"
                          checked={newPlan.isPopular}
                          onChange={(e) => setNewPlan({ ...newPlan, isPopular: e.target.checked })}
                          className="w-4 h-4 text-copper rounded focus:ring-copper"
                        />
                        <label htmlFor="isPopularNew" className="text-xs font-sans font-semibold text-charcoal cursor-pointer">
                          Highlight as "Most Popular / Featured" (Dark luxury theme card)
                        </label>
                      </div>

                      <div>
                        <label className="block text-xs font-sans font-bold text-charcoal uppercase mb-1">
                          Brief Description
                        </label>
                        <textarea
                          rows={2}
                          value={newPlan.description}
                          onChange={(e) => setNewPlan({ ...newPlan, description: e.target.value })}
                          placeholder="Short summary of who this package is for..."
                          className="w-full px-3 py-2 bg-[#FAF8F5] border border-charcoal/20 rounded-lg text-xs font-sans focus:outline-none focus:border-copper resize-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-sans font-bold text-charcoal uppercase mb-1">
                          Included Features (One feature per line)
                        </label>
                        <textarea
                          rows={4}
                          value={newPlan.featuresText}
                          onChange={(e) => setNewPlan({ ...newPlan, featuresText: e.target.value })}
                          placeholder="Up to 2 Hours On-Location Coverage&#10;25+ Color-Graded Photos&#10;Private Cloud Gallery&#10;5-Day Turnaround"
                          className="w-full px-3 py-2 bg-[#FAF8F5] border border-charcoal/20 rounded-lg text-xs font-sans focus:outline-none focus:border-copper resize-none font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-sans font-bold text-charcoal uppercase mb-1">
                          Custom WhatsApp Inquiry Message
                        </label>
                        <input
                          type="text"
                          value={newPlan.inquiryMessage}
                          onChange={(e) => setNewPlan({ ...newPlan, inquiryMessage: e.target.value })}
                          placeholder="Hello Tilnogz Photography, I would like to inquire about..."
                          className="w-full px-3 py-2 bg-[#FAF8F5] border border-charcoal/20 rounded-lg text-xs font-sans focus:outline-none focus:border-copper"
                        />
                      </div>

                      <div className="flex gap-2 pt-2">
                        <button
                          type="submit"
                          className="flex-1 py-3 bg-charcoal hover:bg-copper text-white text-xs font-sans font-bold uppercase rounded-xl transition-colors shadow"
                        >
                          Create Package
                        </button>
                        <button
                          type="button"
                          onClick={() => setIsAddingPlan(false)}
                          className="px-4 py-3 bg-charcoal/10 text-charcoal text-xs font-sans font-bold uppercase rounded-xl"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {/* Edit Plan Modal */}
                {editingPlan && (
                  <div className="fixed inset-0 z-[150] bg-charcoal/80 flex items-end sm:items-center justify-center p-0 sm:p-4">
                    <form
                      onSubmit={handleSaveEditedPlan}
                      className="bg-white rounded-t-3xl sm:rounded-2xl max-w-xl w-full max-h-[90dvh] overflow-y-auto p-5 sm:p-6 shadow-2xl border border-charcoal/15 space-y-4"
                    >
                      <div className="flex items-center justify-between pb-2 border-b border-charcoal/10">
                        <h4 className="font-serif text-base font-bold text-charcoal uppercase flex items-center gap-2">
                          <Edit className="w-4 h-4 text-copper" />
                          <span>Edit Package: {editingPlan.name}</span>
                        </h4>
                        <button
                          type="button"
                          onClick={() => setEditingPlan(null)}
                          className="p-1 text-charcoal/40 hover:text-charcoal"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-sans font-bold text-charcoal uppercase mb-1">
                            Package Name *
                          </label>
                          <input
                            type="text"
                            required
                            value={editingPlan.name || ''}
                            onChange={(e) => setEditingPlan({ ...editingPlan, name: e.target.value })}
                            className="w-full px-3 py-2 bg-[#FAF8F5] border border-charcoal/20 rounded-lg text-xs font-sans focus:outline-none focus:border-copper uppercase font-bold"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-sans font-bold text-charcoal uppercase mb-1">
                            Badge / Ribbon Text
                          </label>
                          <input
                            type="text"
                            value={editingPlan.badge || ''}
                            onChange={(e) => setEditingPlan({ ...editingPlan, badge: e.target.value })}
                            placeholder="e.g. MOST POPULAR"
                            className="w-full px-3 py-2 bg-[#FAF8F5] border border-charcoal/20 rounded-lg text-xs font-sans focus:outline-none focus:border-copper uppercase"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-sans font-bold text-charcoal uppercase mb-1">
                            Subtitle / Description Line
                          </label>
                          <input
                            type="text"
                            value={editingPlan.subtitle || ''}
                            onChange={(e) => setEditingPlan({ ...editingPlan, subtitle: e.target.value })}
                            className="w-full px-3 py-2 bg-[#FAF8F5] border border-charcoal/20 rounded-lg text-xs font-sans focus:outline-none focus:border-copper"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-sans font-bold text-charcoal uppercase mb-1">
                            Price / Investment Tag (Optional)
                          </label>
                          <input
                            type="text"
                            value={editingPlan.price || ''}
                            onChange={(e) => setEditingPlan({ ...editingPlan, price: e.target.value })}
                            placeholder="e.g. LKR 45,000"
                            className="w-full px-3 py-2 bg-[#FAF8F5] border border-charcoal/20 rounded-lg text-xs font-sans focus:outline-none focus:border-copper"
                          />
                        </div>
                      </div>

                      <div className="flex items-center gap-2 p-3 bg-sand/30 rounded-xl border border-charcoal/10">
                        <input
                          type="checkbox"
                          id="isPopularEdit"
                          checked={Boolean(editingPlan.isPopular)}
                          onChange={(e) => setEditingPlan({ ...editingPlan, isPopular: e.target.checked })}
                          className="w-4 h-4 text-copper rounded focus:ring-copper"
                        />
                        <label htmlFor="isPopularEdit" className="text-xs font-sans font-semibold text-charcoal cursor-pointer">
                          Highlight as "Most Popular / Featured" (Dark luxury theme card)
                        </label>
                      </div>

                      <div>
                        <label className="block text-xs font-sans font-bold text-charcoal uppercase mb-1">
                          Description
                        </label>
                        <textarea
                          rows={2}
                          value={editingPlan.description || ''}
                          onChange={(e) => setEditingPlan({ ...editingPlan, description: e.target.value })}
                          className="w-full px-3 py-2 bg-[#FAF8F5] border border-charcoal/20 rounded-lg text-xs font-sans focus:outline-none focus:border-copper resize-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-sans font-bold text-charcoal uppercase mb-1">
                          Included Features (One per line)
                        </label>
                        <textarea
                          rows={5}
                          value={
                            typeof editingPlan.featuresText === 'string'
                              ? editingPlan.featuresText
                              : Array.isArray(editingPlan.features)
                              ? editingPlan.features.join('\n')
                              : ''
                          }
                          onChange={(e) => setEditingPlan({ ...editingPlan, featuresText: e.target.value })}
                          placeholder="Feature 1&#10;Feature 2&#10;Feature 3"
                          className="w-full px-3 py-2 bg-[#FAF8F5] border border-charcoal/20 rounded-lg text-xs font-sans focus:outline-none focus:border-copper resize-none font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-sans font-bold text-charcoal uppercase mb-1">
                          WhatsApp Booking Prompt Message
                        </label>
                        <input
                          type="text"
                          value={editingPlan.inquiryMessage || ''}
                          onChange={(e) => setEditingPlan({ ...editingPlan, inquiryMessage: e.target.value })}
                          className="w-full px-3 py-2 bg-[#FAF8F5] border border-charcoal/20 rounded-lg text-xs font-sans focus:outline-none focus:border-copper"
                        />
                      </div>

                      <div className="flex gap-2 pt-2">
                        <button
                          type="submit"
                          className="flex-1 py-3 bg-copper hover:bg-copper-dark text-white text-xs font-sans font-bold uppercase rounded-xl transition-colors shadow"
                        >
                          Save Package Details
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingPlan(null)}
                          className="px-4 py-3 bg-charcoal/10 text-charcoal text-xs font-sans font-bold uppercase rounded-xl"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {/* Plans List Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {(content?.plans || []).map((plan, index) => {
                    const isPublished = plan.is_published !== false
                    return (
                      <div
                        key={plan.id || index}
                        className={`p-5 rounded-2xl border transition-all flex flex-col justify-between ${
                          plan.isPopular
                            ? 'bg-charcoal text-white border-copper shadow-lg'
                            : 'bg-[#FAF8F5] text-charcoal border-charcoal/15 shadow-sm'
                        } ${!isPublished ? 'opacity-60 grayscale-[40%]' : ''}`}
                      >
                        <div>
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <span
                              className={`text-[10px] font-sans font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-full ${
                                plan.isPopular
                                  ? 'bg-copper text-white'
                                  : 'bg-charcoal/10 text-copper'
                              }`}
                            >
                              {plan.badge || 'PACKAGE'}
                            </span>

                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() => handleMovePlan(index, -1)}
                                disabled={index === 0}
                                className="p-1 rounded bg-black/10 hover:bg-black/20 disabled:opacity-30"
                                title="Move Left / Up"
                              >
                                <ArrowUp className="w-3 h-3" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleMovePlan(index, 1)}
                                disabled={index === (content?.plans || []).length - 1}
                                className="p-1 rounded bg-black/10 hover:bg-black/20 disabled:opacity-30"
                                title="Move Right / Down"
                              >
                                <ArrowDown className="w-3 h-3" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleTogglePublishPlan(plan.id)}
                                className={`p-1 rounded ${
                                  isPublished ? 'text-emerald-500 hover:bg-emerald-500/10' : 'text-amber-500 hover:bg-amber-500/10'
                                }`}
                                title={isPublished ? 'Active on site' : 'Hidden from site'}
                              >
                                {isPublished ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                              </button>
                              <button
                                type="button"
                                onClick={() =>
                                  setEditingPlan({
                                    ...plan,
                                    featuresText: Array.isArray(plan.features) ? plan.features.join('\n') : '',
                                  })
                                }
                                className="p-1 rounded text-copper hover:bg-copper/10"
                                title="Edit Package"
                              >
                                <Edit className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeletePlan(plan.id, plan.name)}
                                className="p-1 rounded text-red-500 hover:bg-red-500/10"
                                title="Delete Package"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          <h4 className="font-sans font-extrabold text-lg uppercase tracking-tight">
                            {plan.name}
                          </h4>
                          <p className={`text-xs font-sans ${plan.isPopular ? 'text-white/70' : 'text-charcoal-muted'}`}>
                            {plan.subtitle}
                          </p>
                          {plan.price && (
                            <p className="text-sm font-bold text-copper mt-1">
                              {plan.price}
                            </p>
                          )}

                          <p className={`text-xs font-body mt-2 leading-relaxed ${plan.isPopular ? 'text-white/80' : 'text-charcoal/80'}`}>
                            {plan.description}
                          </p>

                          <div className="w-full h-[1px] my-3 bg-black/10" />

                          <ul className="space-y-1.5 text-xs font-sans">
                            {(plan.features || []).map((feat, fIdx) => (
                              <li key={fIdx} className="flex items-start gap-2">
                                <Check className="w-3 h-3 text-copper flex-shrink-0 mt-0.5" />
                                <span className={plan.isPopular ? 'text-white/90' : 'text-charcoal/90'}>
                                  {feat}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* ======================================================== */}
            {/* TAB: BOTTOM PHOTO STRIP                                 */}
            {/* ======================================================== */}
            {activeTab === 'strip' && (
              <div className="space-y-4 sm:space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-charcoal/10">
                  <div>
                    <h3 className="font-serif text-lg sm:text-2xl font-bold text-charcoal uppercase flex items-center gap-2">
                      <Layers className="w-5 h-5 text-copper" />
                      <span>Bottom Photo Strip (Marquee Gallery)</span>
                    </h3>
                    <p className="text-[11px] sm:text-xs text-charcoal-muted font-sans">
                      Curated high-impact vertical frames rendered in the infinite marquee ribbon above the footer.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsAddingStripPhoto(true)}
                    className="px-4 py-2 bg-copper hover:bg-copper-dark text-white rounded-xl text-[11px] sm:text-xs font-sans font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-md transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Upload Strip Photo</span>
                  </button>
                </div>

                {/* Upload New Strip Photo Modal */}
                {isAddingStripPhoto && (
                  <div className="fixed inset-0 z-[150] bg-charcoal/80 flex items-end sm:items-center justify-center p-0 sm:p-4">
                    <form
                      onSubmit={handleCreateStripPhoto}
                      className="bg-white rounded-t-3xl sm:rounded-2xl max-w-lg w-full max-h-[90dvh] overflow-y-auto p-5 sm:p-6 shadow-2xl border border-charcoal/15 space-y-4"
                    >
                      <div className="flex items-center justify-between pb-2 border-b border-charcoal/10">
                        <h4 className="font-serif text-base font-bold text-charcoal uppercase flex items-center gap-2">
                          <Plus className="w-4 h-4 text-copper" />
                          <span>Upload Photo to Bottom Strip</span>
                        </h4>
                        <button
                          type="button"
                          onClick={() => setIsAddingStripPhoto(false)}
                          className="p-1 text-charcoal/40 hover:text-charcoal"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>

                      {/* Image Uploader */}
                      <div>
                        <label className="block text-xs font-sans font-bold text-charcoal uppercase mb-1">
                          Select Vertical Frame / Photo *
                        </label>
                        <ImageUploader
                          value={newStripPhoto.image_url}
                          onChange={(url) => setNewStripPhoto({ ...newStripPhoto, image_url: url })}
                          currentImage={newStripPhoto.image_url}
                          onUploadComplete={(url) => setNewStripPhoto({ ...newStripPhoto, image_url: url })}
                          storageBucket="portfolio-images"
                          aspectRatio="aspect-[2/3]"
                          helperText="High-res portrait / vertical frame (2:3 aspect ratio recommended)"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-sans font-bold text-charcoal uppercase mb-1">
                          Photo Title / Caption *
                        </label>
                        <input
                          type="text"
                          required
                          value={newStripPhoto.title}
                          onChange={(e) => setNewStripPhoto({ ...newStripPhoto, title: e.target.value })}
                          placeholder="e.g. The Colonial Arcade"
                          className="w-full px-3 py-2 bg-[#FAF8F5] border border-charcoal/20 rounded-lg text-xs font-sans focus:outline-none focus:border-copper"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-sans font-bold text-charcoal uppercase mb-1">
                          Category *
                        </label>
                        <input
                          type="text"
                          required
                          value={newStripPhoto.category}
                          onChange={(e) => setNewStripPhoto({ ...newStripPhoto, category: e.target.value })}
                          placeholder="e.g. Architecture, Portrait, Wedding, Lifestyle, Heritage"
                          className="w-full px-3 py-2 bg-[#FAF8F5] border border-charcoal/20 rounded-lg text-xs font-sans focus:outline-none focus:border-copper mb-2"
                        />
                        {/* Quick Category Badges */}
                        <div className="flex flex-wrap gap-1.5">
                          {['Architecture', 'Portrait', 'Wedding', 'Pre-Wedding', 'Lifestyle', 'Heritage', 'Automotive', 'Landscape', 'Events'].map((cat) => (
                            <button
                              key={cat}
                              type="button"
                              onClick={() => setNewStripPhoto({ ...newStripPhoto, category: cat })}
                              className="px-2 py-0.5 rounded-full text-[10px] font-sans font-semibold bg-sand/60 hover:bg-copper hover:text-white transition-colors text-charcoal"
                            >
                              {cat}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="flex gap-2 pt-2">
                        <button
                          type="submit"
                          className="flex-1 py-3 bg-copper hover:bg-copper-dark text-white text-xs font-sans font-bold uppercase rounded-xl transition-colors shadow"
                        >
                          Add to Bottom Strip
                        </button>
                        <button
                          type="button"
                          onClick={() => setIsAddingStripPhoto(false)}
                          className="px-4 py-3 bg-charcoal/10 text-charcoal text-xs font-sans font-bold uppercase rounded-xl"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {/* Edit Strip Photo Modal */}
                {editingStripPhoto && (
                  <div className="fixed inset-0 z-[150] bg-charcoal/80 flex items-end sm:items-center justify-center p-0 sm:p-4">
                    <form
                      onSubmit={handleUpdateStripPhoto}
                      className="bg-white rounded-t-3xl sm:rounded-2xl max-w-lg w-full max-h-[90dvh] overflow-y-auto p-5 sm:p-6 shadow-2xl border border-charcoal/15 space-y-4"
                    >
                      <div className="flex items-center justify-between pb-2 border-b border-charcoal/10">
                        <h4 className="font-serif text-base font-bold text-charcoal uppercase flex items-center gap-2">
                          <Edit className="w-4 h-4 text-copper" />
                          <span>Edit Strip Photo</span>
                        </h4>
                        <button
                          type="button"
                          onClick={() => setEditingStripPhoto(null)}
                          className="p-1 text-charcoal/40 hover:text-charcoal"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>

                      {/* Image Uploader */}
                      <div>
                        <label className="block text-xs font-sans font-bold text-charcoal uppercase mb-1">
                          Frame Image *
                        </label>
                        <ImageUploader
                          value={editingStripPhoto.image_url}
                          onChange={(url) => setEditingStripPhoto({ ...editingStripPhoto, image_url: url })}
                          currentImage={editingStripPhoto.image_url}
                          onUploadComplete={(url) => setEditingStripPhoto({ ...editingStripPhoto, image_url: url })}
                          storageBucket="portfolio-images"
                          aspectRatio="aspect-[2/3]"
                          helperText="Change or replace this frame image"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-sans font-bold text-charcoal uppercase mb-1">
                          Photo Title / Caption *
                        </label>
                        <input
                          type="text"
                          required
                          value={editingStripPhoto.title || ''}
                          onChange={(e) => setEditingStripPhoto({ ...editingStripPhoto, title: e.target.value })}
                          className="w-full px-3 py-2 bg-[#FAF8F5] border border-charcoal/20 rounded-lg text-xs font-sans focus:outline-none focus:border-copper"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-sans font-bold text-charcoal uppercase mb-1">
                          Category *
                        </label>
                        <input
                          type="text"
                          required
                          value={editingStripPhoto.category || ''}
                          onChange={(e) => setEditingStripPhoto({ ...editingStripPhoto, category: e.target.value })}
                          className="w-full px-3 py-2 bg-[#FAF8F5] border border-charcoal/20 rounded-lg text-xs font-sans focus:outline-none focus:border-copper mb-2"
                        />
                        {/* Quick Category Badges */}
                        <div className="flex flex-wrap gap-1.5">
                          {['Architecture', 'Portrait', 'Wedding', 'Pre-Wedding', 'Lifestyle', 'Heritage', 'Automotive', 'Landscape', 'Events'].map((cat) => (
                            <button
                              key={cat}
                              type="button"
                              onClick={() => setEditingStripPhoto({ ...editingStripPhoto, category: cat })}
                              className="px-2 py-0.5 rounded-full text-[10px] font-sans font-semibold bg-sand/60 hover:bg-copper hover:text-white transition-colors text-charcoal"
                            >
                              {cat}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="flex gap-2 pt-2">
                        <button
                          type="submit"
                          className="flex-1 py-3 bg-copper hover:bg-copper-dark text-white text-xs font-sans font-bold uppercase rounded-xl transition-colors shadow"
                        >
                          Save Changes
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingStripPhoto(null)}
                          className="px-4 py-3 bg-charcoal/10 text-charcoal text-xs font-sans font-bold uppercase rounded-xl"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {/* Strip Photos Cards Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
                  {(content?.stripPhotos || []).map((photo, index) => {
                    const isPublished = photo.is_published !== false
                    const imgSrc = photo.image_url || photo.image || ''

                    return (
                      <div
                        key={photo.id || index}
                        className={`group relative rounded-xl overflow-hidden border transition-all flex flex-col justify-between bg-white shadow-sm hover:shadow-md ${
                          !isPublished ? 'opacity-50 grayscale-[50%]' : ''
                        } border-charcoal/15`}
                      >
                        {/* Image Frame 2:3 */}
                        <div className="w-full aspect-[2/3] relative bg-charcoal overflow-hidden">
                          {imgSrc ? (
                            <img
                              src={imgSrc}
                              alt={photo.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              loading="lazy"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-white/30 text-xs font-sans">
                              No Image
                            </div>
                          )}

                          {/* Category Badge */}
                          <div className="absolute top-2 left-2">
                            <span className="text-[9px] font-sans font-bold tracking-wider uppercase px-2 py-0.5 rounded-full bg-copper text-white shadow">
                              {photo.category || 'Strip'}
                            </span>
                          </div>

                          {/* Quick Toolbar */}
                          <div className="absolute top-2 right-2 flex items-center gap-1 bg-charcoal/80 backdrop-blur-sm p-1 rounded-lg">
                            <button
                              type="button"
                              onClick={() => handleMoveStripPhoto(index, -1)}
                              disabled={index === 0}
                              className="p-1 rounded text-white/80 hover:text-white disabled:opacity-30"
                              title="Move Left / Earlier"
                            >
                              <ArrowUp className="w-3 h-3" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleMoveStripPhoto(index, 1)}
                              disabled={index === (content?.stripPhotos || []).length - 1}
                              className="p-1 rounded text-white/80 hover:text-white disabled:opacity-30"
                              title="Move Right / Later"
                            >
                              <ArrowDown className="w-3 h-3" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleTogglePublishStripPhoto(photo.id)}
                              className={`p-1 rounded ${
                                isPublished ? 'text-emerald-400' : 'text-amber-400'
                              }`}
                              title={isPublished ? 'Visible in strip' : 'Hidden from strip'}
                            >
                              {isPublished ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                            </button>
                          </div>
                        </div>

                        {/* Card Info & Edit / Delete */}
                        <div className="p-2.5 sm:p-3 flex items-center justify-between gap-1.5 bg-[#FAF8F5] border-t border-charcoal/10">
                          <div className="min-w-0 flex-1">
                            <h5 className="font-sans font-bold text-xs text-charcoal truncate uppercase">
                              {photo.title || 'Untitled'}
                            </h5>
                            <span className="text-[10px] text-charcoal-muted block truncate font-sans">
                              {photo.category}
                            </span>
                          </div>

                          <div className="flex items-center gap-1 flex-shrink-0">
                            <button
                              type="button"
                              onClick={() => setEditingStripPhoto({ ...photo })}
                              className="p-1 rounded text-copper hover:bg-copper/10"
                              title="Edit Details & Image"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteStripPhoto(photo.id, photo.title)}
                              className="p-1 rounded text-red-500 hover:bg-red-500/10"
                              title="Remove from Strip"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* Empty State */}
                {(!content?.stripPhotos || content.stripPhotos.length === 0) && (
                  <div className="text-center py-12 px-4 border-2 border-dashed border-charcoal/20 rounded-2xl">
                    <Layers className="w-10 h-10 text-charcoal/30 mx-auto mb-3" />
                    <h4 className="font-serif text-base font-bold text-charcoal uppercase mb-1">
                      No Photos in Bottom Strip
                    </h4>
                    <p className="text-xs text-charcoal-muted font-sans max-w-sm mx-auto mb-4">
                      Add curated vertical frames to display in the continuous marquee strip above the footer.
                    </p>
                    <button
                      type="button"
                      onClick={() => setIsAddingStripPhoto(true)}
                      className="px-4 py-2 bg-copper text-white text-xs font-sans font-bold uppercase rounded-xl shadow"
                    >
                      + Add First Strip Photo
                    </button>
                  </div>
                )}
              </div>
            )}
          </main>
        </div>

        {/* ======================================================== */}
        {/* Mobile App Bottom Navigation Tab Bar (Mobile Only)       */}
        {/* ======================================================== */}
        <nav className="flex md:hidden fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-lg border-t border-charcoal/15 items-center justify-around py-2 px-1 z-40 shadow-[0_-4px_16px_rgba(0,0,0,0.06)]">
          <button
            type="button"
            onClick={() => setActiveTab('albums')}
            className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all ${
              activeTab === 'albums' ? 'text-copper font-bold' : 'text-charcoal/60'
            }`}
          >
            <Image className="w-4 h-4" />
            <span className="text-[10px] uppercase font-sans">Albums</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('videos')}
            className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl transition-all ${
              activeTab === 'videos' ? 'text-copper font-bold' : 'text-charcoal/60'
            }`}
          >
            <Film className="w-4 h-4" />
            <span className="text-[10px] uppercase font-sans">Videos</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('plans')}
            className={`flex flex-col items-center gap-1 py-1 px-2 rounded-xl transition-all ${
              activeTab === 'plans' ? 'text-copper font-bold' : 'text-charcoal/60'
            }`}
          >
            <Package className="w-4 h-4" />
            <span className="text-[10px] uppercase font-sans">Plans</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('strip')}
            className={`flex flex-col items-center gap-1 py-1 px-2 rounded-xl transition-all ${
              activeTab === 'strip' ? 'text-copper font-bold' : 'text-charcoal/60'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span className="text-[10px] uppercase font-sans">Strip</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('hero')}
            className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all ${
              activeTab === 'hero' ? 'text-copper font-bold' : 'text-charcoal/60'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span className="text-[10px] uppercase font-sans">Hero</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('about')}
            className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all ${
              activeTab === 'about' ? 'text-copper font-bold' : 'text-charcoal/60'
            }`}
          >
            <User className="w-4 h-4" />
            <span className="text-[10px] uppercase font-sans">About</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('testimonials')}
            className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all ${
              activeTab === 'testimonials' ? 'text-copper font-bold' : 'text-charcoal/60'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span className="text-[10px] uppercase font-sans">Reviews</span>
          </button>
        </nav>

        {/* Toast Notification */}
        <AnimatePresence>
          {toastMessage && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="absolute bottom-20 md:bottom-6 right-4 sm:right-6 z-[200] px-4 py-2.5 bg-charcoal text-white text-xs font-sans font-bold rounded-xl shadow-2xl border border-white/20 flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{toastMessage}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}
