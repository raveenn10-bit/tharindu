import React, { useState } from 'react'
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
} from 'lucide-react'
import { useContent } from '../../context/ContentContext'
import { getSupabaseConfig, saveSupabaseConfig } from '../../lib/supabase'
import ImageUploader from './ImageUploader'

export default function AdminDashboard({ isOpen, onClose }) {
  const {
    content,
    supabaseStatus,
    logout,
    updateHeroImages,
    updateAbout,
    addAlbum,
    removeAlbum,
    updateAlbum,
    togglePublishAlbum,
    reorderAlbums,
    addTestimonial,
    removeTestimonial,
    updateTestimonial,
    togglePublishTestimonial,
    resetToDefaults,
    exportConfig,
    importConfig,
    saveSupabaseCredentials,
  } = useContent()

  const [activeTab, setActiveTab] = useState('albums')
  const [toastMessage, setToastMessage] = useState('')
  const [isAddingAlbum, setIsAddingAlbum] = useState(false)
  const [editingAlbum, setEditingAlbum] = useState(null)
  const [isAddingTestimonial, setIsAddingTestimonial] = useState(false)
  const [editingTestimonial, setEditingTestimonial] = useState(null)

  // Supabase Credentials Settings State
  const [showDbConfig, setShowDbConfig] = useState(false)
  const [supabaseUrl, setSupabaseUrl] = useState(getSupabaseConfig().url)
  const [supabaseKey, setSupabaseKey] = useState(getSupabaseConfig().anonKey)

  // New Album Form State
  const [newAlbum, setNewAlbum] = useState({
    title: '',
    category: 'Wedding Photography',
    image: '',
    video_url: '',
    note: '',
  })

  // New Testimonial Form State
  const [newTestimonial, setNewTestimonial] = useState({
    clientName: '',
    service: 'Wedding Photography',
    location: 'Colombo, Sri Lanka',
    image: '',
    review: '',
  })

  if (!isOpen) return null

  const showToast = (msg) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(''), 3000)
  }

  const handleCreateAlbum = (e) => {
    e.preventDefault()
    if (!newAlbum.title || !newAlbum.image) {
      alert('Please provide an album title and upload a photo.')
      return
    }
    addAlbum(newAlbum)
    setNewAlbum({
      title: '',
      category: 'Wedding Photography',
      image: '',
      video_url: '',
      note: '',
    })
    setIsAddingAlbum(false)
    showToast('Album created and published!')
  }

  const handleSaveEditedAlbum = (e) => {
    e.preventDefault()
    if (!editingAlbum) return
    updateAlbum(editingAlbum.id, editingAlbum)
    setEditingAlbum(null)
    showToast('Album details updated!')
  }

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

  const handleSaveDbSettings = (e) => {
    e.preventDefault()
    saveSupabaseCredentials(supabaseUrl.trim(), supabaseKey.trim())
    setShowDbConfig(false)
    showToast('Supabase database settings saved!')
  }

  return (
    <div className="fixed inset-0 z-[110] bg-charcoal/90 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-hidden">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-[150] bg-copper text-white text-xs font-sans font-bold px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.98 }}
        className="w-full max-w-6xl h-[94vh] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-charcoal/15"
      >
        {/* Top Header Bar */}
        <div className="bg-[#FAF8F5] px-4 sm:px-6 py-4 border-b border-charcoal/10 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-charcoal text-copper flex items-center justify-center font-serif font-bold text-sm">
              T
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-serif text-base sm:text-lg font-bold text-charcoal tracking-wide uppercase">
                  Tilnogz Studio Manager
                </h2>
                {supabaseStatus === 'connected' ? (
                  <span className="flex items-center gap-1 text-[10px] text-emerald-700 bg-emerald-100 font-sans font-bold px-2 py-0.5 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                    Supabase Connected
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => setShowDbConfig(true)}
                    className="flex items-center gap-1 text-[10px] text-amber-800 bg-amber-100 font-sans font-bold px-2 py-0.5 rounded-full hover:bg-amber-200"
                  >
                    <Database className="w-3 h-3" /> Connect Supabase
                  </button>
                )}
              </div>
              <span className="text-[10px] font-sans text-charcoal-muted block">
                Tharindu Lakshan · Colombo 7, Sri Lanka
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={() => setShowDbConfig(true)}
              className="p-2 text-charcoal/60 hover:text-copper hover:bg-sand/40 rounded-lg transition-colors"
              title="Database Settings"
            >
              <Database className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-sand hover:bg-sand-dark text-charcoal text-xs font-sans font-semibold rounded-lg transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">View Site</span>
            </button>

            <button
              type="button"
              onClick={() => {
                logout()
                onClose()
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-sans font-semibold rounded-lg transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-charcoal/50 hover:text-charcoal rounded-lg hover:bg-charcoal/5 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Database Config Modal */}
        {showDbConfig && (
          <div className="fixed inset-0 z-[160] bg-charcoal/80 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-charcoal/15 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Database className="w-5 h-5 text-copper" />
                  <h3 className="font-serif text-lg font-bold text-charcoal">Supabase Credentials</h3>
                </div>
                <button type="button" onClick={() => setShowDbConfig(false)} className="text-charcoal/40 hover:text-charcoal">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <p className="text-xs text-charcoal-muted font-sans leading-relaxed">
                Connect your Supabase project URL and Anon Key to enable live cloud database storage and sync.
              </p>

              <form onSubmit={handleSaveDbSettings} className="space-y-3">
                <div>
                  <label className="block text-xs font-sans font-bold text-charcoal uppercase mb-1">Project URL</label>
                  <input
                    type="url"
                    value={supabaseUrl}
                    onChange={(e) => setSupabaseUrl(e.target.value)}
                    placeholder="https://xyzcompany.supabase.co"
                    className="w-full px-3 py-2 text-xs bg-[#FAF8F5] border border-charcoal/20 rounded-lg focus:outline-none focus:border-copper font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-sans font-bold text-charcoal uppercase mb-1">Anon Public Key</label>
                  <input
                    type="password"
                    value={supabaseKey}
                    onChange={(e) => setSupabaseKey(e.target.value)}
                    placeholder="eyJhbGciOi..."
                    className="w-full px-3 py-2 text-xs bg-[#FAF8F5] border border-charcoal/20 rounded-lg focus:outline-none focus:border-copper font-mono"
                  />
                </div>

                <div className="pt-2 flex gap-2">
                  <button
                    type="submit"
                    className="flex-1 py-2.5 bg-copper text-white text-xs font-sans font-bold rounded-lg hover:bg-copper-dark transition-colors"
                  >
                    Save & Connect
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      saveSupabaseCredentials('', '')
                      setSupabaseUrl('')
                      setSupabaseKey('')
                      setShowDbConfig(false)
                      showToast('Switched to local offline mode')
                    }}
                    className="px-3 py-2.5 bg-charcoal/10 text-charcoal text-xs font-sans font-medium rounded-lg hover:bg-charcoal/20"
                  >
                    Clear
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Main Body Area: Sidebar + Content */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* Sidebar Tabs */}
          <div className="w-full md:w-64 bg-[#F7F5F0] border-r border-charcoal/10 p-3 sm:p-4 flex md:flex-col gap-1 overflow-x-auto flex-shrink-0">
            <button
              type="button"
              onClick={() => setActiveTab('albums')}
              className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-sans font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
                activeTab === 'albums' ? 'bg-charcoal text-white shadow-sm' : 'text-charcoal/70 hover:bg-sand/60'
              }`}
            >
              <Layers className="w-4 h-4 text-copper" />
              <span>Albums ({content.albums.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('hero')}
              className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-sans font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
                activeTab === 'hero' ? 'bg-charcoal text-white shadow-sm' : 'text-charcoal/70 hover:bg-sand/60'
              }`}
            >
              <Image className="w-4 h-4 text-copper" />
              <span>Hero Photos</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('about')}
              className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-sans font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
                activeTab === 'about' ? 'bg-charcoal text-white shadow-sm' : 'text-charcoal/70 hover:bg-sand/60'
              }`}
            >
              <User className="w-4 h-4 text-copper" />
              <span>About & Services</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('testimonials')}
              className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-sans font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
                activeTab === 'testimonials' ? 'bg-charcoal text-white shadow-sm' : 'text-charcoal/70 hover:bg-sand/60'
              }`}
            >
              <MessageSquare className="w-4 h-4 text-copper" />
              <span>Testimonials ({content.testimonials.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('settings')}
              className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-sans font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
                activeTab === 'settings' ? 'bg-charcoal text-white shadow-sm' : 'text-charcoal/70 hover:bg-sand/60'
              }`}
            >
              <RefreshCw className="w-4 h-4 text-copper" />
              <span>Database & Backup</span>
            </button>
          </div>

          {/* Active Tab Panel Content */}
          <div className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto bg-white">
            {/* ======================================================== */}
            {/* TAB: ALBUMS MANAGER (Add, Edit, Delete, Reorder, Hide)   */}
            {/* ======================================================== */}
            {activeTab === 'albums' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div>
                    <h3 className="font-serif text-xl sm:text-2xl text-charcoal font-bold">
                      Albums & Media Manager
                    </h3>
                    <p className="text-xs text-charcoal-muted font-sans mt-0.5">
                      Upload new photos/videos, edit details, drag & reorder, and toggle visibility.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsAddingAlbum(true)}
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-copper hover:bg-copper-dark text-white text-xs font-sans font-bold tracking-wider uppercase rounded-xl transition-colors shadow-md"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Upload New Album</span>
                  </button>
                </div>

                {/* Add Album Form */}
                {isAddingAlbum && (
                  <form onSubmit={handleCreateAlbum} className="p-5 bg-[#FAF8F5] rounded-2xl border-2 border-copper/30 space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-sans font-bold text-sm text-charcoal uppercase tracking-wider">
                        Upload & Publish New Album
                      </h4>
                      <button
                        type="button"
                        onClick={() => setIsAddingAlbum(false)}
                        className="p-1 text-charcoal/40 hover:text-charcoal"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <ImageUploader
                          value={newAlbum.image}
                          onChange={(img) => setNewAlbum({ ...newAlbum, image: img })}
                          label="Album Photo or Video"
                          aspectRatio="aspect-[4/5]"
                        />
                      </div>

                      <div className="space-y-3">
                        <div>
                          <label className="block text-xs font-sans font-semibold text-charcoal/80 uppercase mb-1">
                            Album Title
                          </label>
                          <input
                            type="text"
                            required
                            value={newAlbum.title}
                            onChange={(e) => setNewAlbum({ ...newAlbum, title: e.target.value })}
                            placeholder="e.g. Wedding Highlight in Colombo"
                            className="w-full px-3 py-2 bg-white border border-charcoal/20 rounded-lg text-xs font-sans focus:outline-none focus:border-copper"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-sans font-semibold text-charcoal/80 uppercase mb-1">
                            Service Category
                          </label>
                          <select
                            value={newAlbum.category}
                            onChange={(e) => setNewAlbum({ ...newAlbum, category: e.target.value })}
                            className="w-full px-3 py-2 bg-white border border-charcoal/20 rounded-lg text-xs font-sans focus:outline-none focus:border-copper"
                          >
                            <option value="Wedding Photography">Wedding Photography</option>
                            <option value="Pre-Wedding / Engagement Photography">Pre-Wedding / Engagement Photography</option>
                            <option value="Graduation Photography">Graduation Photography</option>
                            <option value="Vehicle Photography">Vehicle Photography</option>
                            <option value="Sports Photography">Sports Photography</option>
                            <option value="Architecture Photography">Architecture Photography</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-sans font-semibold text-charcoal/80 uppercase mb-1">
                            Optional Video Link (MP4 / YouTube / Vimeo)
                          </label>
                          <input
                            type="url"
                            value={newAlbum.video_url}
                            onChange={(e) => setNewAlbum({ ...newAlbum, video_url: e.target.value })}
                            placeholder="https://..."
                            className="w-full px-3 py-2 bg-white border border-charcoal/20 rounded-lg text-xs font-sans focus:outline-none focus:border-copper"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-sans font-semibold text-charcoal/80 uppercase mb-1">
                            Notes / Story
                          </label>
                          <textarea
                            rows={2}
                            value={newAlbum.note}
                            onChange={(e) => setNewAlbum({ ...newAlbum, note: e.target.value })}
                            placeholder="Brief description of the shoot..."
                            className="w-full px-3 py-2 bg-white border border-charcoal/20 rounded-lg text-xs font-sans focus:outline-none focus:border-copper resize-none"
                          />
                        </div>

                        <button
                          type="submit"
                          className="w-full py-3 bg-charcoal hover:bg-copper text-white text-xs font-sans font-bold uppercase tracking-wider rounded-xl transition-colors"
                        >
                          Publish Album
                        </button>
                      </div>
                    </div>
                  </form>
                )}

                {/* Edit Album Modal */}
                {editingAlbum && (
                  <div className="fixed inset-0 z-[150] bg-charcoal/80 flex items-center justify-center p-4">
                    <form onSubmit={handleSaveEditedAlbum} className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-charcoal/15 space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="font-serif text-lg font-bold text-charcoal">Edit Album</h4>
                        <button type="button" onClick={() => setEditingAlbum(null)} className="text-charcoal/40 hover:text-charcoal">
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      <ImageUploader
                        value={editingAlbum.image}
                        onChange={(img) => setEditingAlbum({ ...editingAlbum, image: img })}
                        label="Album Photo"
                        aspectRatio="aspect-[16/9]"
                      />

                      <div>
                        <label className="block text-xs font-sans font-bold text-charcoal uppercase mb-1">Title</label>
                        <input
                          type="text"
                          required
                          value={editingAlbum.title}
                          onChange={(e) => setEditingAlbum({ ...editingAlbum, title: e.target.value })}
                          className="w-full px-3 py-2 text-xs bg-[#FAF8F5] border border-charcoal/20 rounded-lg focus:outline-none focus:border-copper"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-sans font-bold text-charcoal uppercase mb-1">Category</label>
                        <select
                          value={editingAlbum.category}
                          onChange={(e) => setEditingAlbum({ ...editingAlbum, category: e.target.value })}
                          className="w-full px-3 py-2 text-xs bg-[#FAF8F5] border border-charcoal/20 rounded-lg focus:outline-none focus:border-copper"
                        >
                          <option value="Wedding Photography">Wedding Photography</option>
                          <option value="Pre-Wedding / Engagement Photography">Pre-Wedding / Engagement Photography</option>
                          <option value="Graduation Photography">Graduation Photography</option>
                          <option value="Vehicle Photography">Vehicle Photography</option>
                          <option value="Sports Photography">Sports Photography</option>
                          <option value="Architecture Photography">Architecture Photography</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-sans font-bold text-charcoal uppercase mb-1">Notes</label>
                        <textarea
                          rows={2}
                          value={editingAlbum.note || ''}
                          onChange={(e) => setEditingAlbum({ ...editingAlbum, note: e.target.value })}
                          className="w-full px-3 py-2 text-xs bg-[#FAF8F5] border border-charcoal/20 rounded-lg focus:outline-none focus:border-copper resize-none"
                        />
                      </div>

                      <div className="flex gap-2 pt-2">
                        <button
                          type="submit"
                          className="flex-1 py-2.5 bg-copper text-white text-xs font-sans font-bold uppercase rounded-lg hover:bg-copper-dark"
                        >
                          Save Changes
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingAlbum(null)}
                          className="px-4 py-2.5 bg-charcoal/10 text-charcoal text-xs font-sans font-medium rounded-lg hover:bg-charcoal/20"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {/* Albums Grid with Reorder, Publish, Edit, Delete */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  {content.albums.map((album, idx) => {
                    const isPublished = album.is_published !== false

                    return (
                      <div
                        key={album.id}
                        className={`group relative rounded-xl overflow-hidden border shadow-sm flex flex-col justify-between transition-all ${
                          isPublished ? 'bg-[#FAF8F5] border-charcoal/15' : 'bg-charcoal/5 border-charcoal/10 opacity-60'
                        }`}
                      >
                        <div className="aspect-[4/5] overflow-hidden bg-charcoal relative">
                          <img
                            src={album.image}
                            alt={album.title}
                            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                          />

                          {/* Quick Actions Overlay */}
                          <div className="absolute inset-0 bg-charcoal/70 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2">
                            {/* Top row: Reorder controls */}
                            <div className="flex items-center justify-between">
                              <div className="flex gap-1">
                                <button
                                  type="button"
                                  disabled={idx === 0}
                                  onClick={() => handleMoveAlbum(idx, -1)}
                                  className="p-1 bg-white/90 hover:bg-white text-charcoal rounded disabled:opacity-40"
                                  title="Move Up / Left"
                                >
                                  <ArrowUp className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  type="button"
                                  disabled={idx === content.albums.length - 1}
                                  onClick={() => handleMoveAlbum(idx, 1)}
                                  className="p-1 bg-white/90 hover:bg-white text-charcoal rounded disabled:opacity-40"
                                  title="Move Down / Right"
                                >
                                  <ArrowDown className="w-3.5 h-3.5" />
                                </button>
                              </div>

                              {/* Publish / Hide toggle */}
                              <button
                                type="button"
                                onClick={() => {
                                  togglePublishAlbum(album.id)
                                  showToast(isPublished ? 'Album hidden from public view' : 'Album published live!')
                                }}
                                className={`p-1.5 rounded text-white shadow ${isPublished ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-charcoal hover:bg-charcoal/80'}`}
                                title={isPublished ? 'Hide from public site' : 'Publish live'}
                              >
                                {isPublished ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                              </button>
                            </div>

                            {/* Bottom row: Edit & Delete buttons */}
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                type="button"
                                onClick={() => setEditingAlbum(album)}
                                className="p-1.5 bg-white text-charcoal hover:bg-copper hover:text-white rounded shadow transition-colors"
                                title="Edit Album Details"
                              >
                                <Edit className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  if (confirm(`Delete album "${album.title}"?`)) {
                                    removeAlbum(album.id)
                                    showToast('Album deleted')
                                  }
                                }}
                                className="p-1.5 bg-red-600 hover:bg-red-700 text-white rounded shadow transition-colors"
                                title="Delete Album"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>

                        <div className="p-3">
                          <div className="flex items-center justify-between">
                            <span className="text-[9px] font-sans font-bold text-copper uppercase truncate">
                              {album.category}
                            </span>
                            {!isPublished && (
                              <span className="text-[8px] bg-red-100 text-red-700 font-bold px-1.5 py-0.5 rounded">
                                HIDDEN
                              </span>
                            )}
                          </div>
                          <h4 className="font-serif text-xs font-bold text-charcoal truncate mt-0.5">
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
            {/* TAB: HERO PHOTOS                                         */}
            {/* ======================================================== */}
            {activeTab === 'hero' && (
              <div className="max-w-4xl space-y-6">
                <div>
                  <h3 className="font-serif text-xl sm:text-2xl text-charcoal font-bold">
                    Hero Section Background Photos
                  </h3>
                  <p className="text-xs text-charcoal-muted font-sans mt-0.5">
                    Upload or replace the desktop landscape and mobile vertical hero backgrounds.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Desktop Hero */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-[#FAF8F5] border border-charcoal/10 space-y-3">
                    <div className="flex items-center gap-2 text-xs font-sans font-bold text-charcoal uppercase">
                      <Monitor className="w-4 h-4 text-copper" />
                      <span>Desktop Hero Photo (Landscape)</span>
                    </div>
                    <ImageUploader
                      value={content.hero.desktopImage}
                      onChange={(newImg) => {
                        updateHeroImages({ desktop: newImg })
                        showToast('Desktop hero image updated!')
                      }}
                      aspectRatio="aspect-[16/9]"
                      label=""
                    />
                  </div>

                  {/* Mobile Hero */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-[#FAF8F5] border border-charcoal/10 space-y-3">
                    <div className="flex items-center gap-2 text-xs font-sans font-bold text-charcoal uppercase">
                      <Smartphone className="w-4 h-4 text-copper" />
                      <span>Mobile / Portrait Hero Photo</span>
                    </div>
                    <ImageUploader
                      value={content.hero.mobileImage}
                      onChange={(newImg) => {
                        updateHeroImages({ mobile: newImg })
                        showToast('Mobile hero image updated!')
                      }}
                      aspectRatio="aspect-[3/4]"
                      label=""
                    />
                  </div>
                </div>
              </div>
            )}

            {/* ======================================================== */}
            {/* TAB: ABOUT & SERVICES                                    */}
            {/* ======================================================== */}
            {activeTab === 'about' && (
              <div className="max-w-3xl space-y-6">
                <div>
                  <h3 className="font-serif text-xl sm:text-2xl text-charcoal font-bold">
                    About Section & Profile
                  </h3>
                  <p className="text-xs text-charcoal-muted font-sans mt-0.5">
                    Update your portrait cutout, studio address, and biographical details.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div>
                    <ImageUploader
                      value={content.about.portraitImage}
                      onChange={(img) => {
                        updateAbout({ portraitImage: img })
                        showToast('Portrait image updated!')
                      }}
                      label="Photographer Portrait Cutout"
                      aspectRatio="aspect-[3/4]"
                    />
                  </div>

                  <div className="sm:col-span-2 space-y-4">
                    <div>
                      <label className="block text-xs font-sans font-semibold text-charcoal/80 uppercase mb-1">
                        Photographer Name
                      </label>
                      <input
                        type="text"
                        value={content.about.name}
                        onChange={(e) => updateAbout({ name: e.target.value })}
                        className="w-full px-3 py-2 bg-[#FAF8F5] border border-charcoal/20 rounded-lg text-xs font-sans focus:outline-none focus:border-copper"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-sans font-semibold text-charcoal/80 uppercase mb-1">
                        Studio Address
                      </label>
                      <div className="relative">
                        <MapPin className="w-3.5 h-3.5 text-copper absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          value={content.about.address}
                          onChange={(e) => updateAbout({ address: e.target.value })}
                          className="w-full pl-9 pr-3 py-2 bg-[#FAF8F5] border border-charcoal/20 rounded-lg text-xs font-sans focus:outline-none focus:border-copper"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-sans font-semibold text-charcoal/80 uppercase mb-1">
                        Bio Paragraph 1
                      </label>
                      <textarea
                        rows={3}
                        value={content.about.bio1}
                        onChange={(e) => updateAbout({ bio1: e.target.value })}
                        className="w-full px-3 py-2 bg-[#FAF8F5] border border-charcoal/20 rounded-lg text-xs font-sans focus:outline-none focus:border-copper resize-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-sans font-semibold text-charcoal/80 uppercase mb-1">
                        Bio Paragraph 2
                      </label>
                      <textarea
                        rows={3}
                        value={content.about.bio2}
                        onChange={(e) => updateAbout({ bio2: e.target.value })}
                        className="w-full px-3 py-2 bg-[#FAF8F5] border border-charcoal/20 rounded-lg text-xs font-sans focus:outline-none focus:border-copper resize-none"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ======================================================== */}
            {/* TAB: TESTIMONIALS MANAGER                                */}
            {/* ======================================================== */}
            {activeTab === 'testimonials' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div>
                    <h3 className="font-serif text-xl sm:text-2xl text-charcoal font-bold">
                      Client Testimonials
                    </h3>
                    <p className="text-xs text-charcoal-muted font-sans mt-0.5">
                      Add, edit, remove, and toggle visibility for client review stories.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsAddingTestimonial(true)}
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-copper hover:bg-copper-dark text-white text-xs font-sans font-bold tracking-wider uppercase rounded-xl transition-colors shadow-md"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Testimonial</span>
                  </button>
                </div>

                {/* Add Testimonial Form */}
                {isAddingTestimonial && (
                  <form onSubmit={handleCreateTestimonial} className="p-5 bg-[#FAF8F5] rounded-2xl border-2 border-copper/30 space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-sans font-bold text-sm text-charcoal uppercase tracking-wider">
                        Add Client Testimonial Story
                      </h4>
                      <button
                        type="button"
                        onClick={() => setIsAddingTestimonial(false)}
                        className="p-1 text-charcoal/40 hover:text-charcoal"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <ImageUploader
                          value={newTestimonial.image}
                          onChange={(img) => setNewTestimonial({ ...newTestimonial, image: img })}
                          label="Client Session Photo"
                          aspectRatio="aspect-[4/3]"
                        />
                      </div>

                      <div className="sm:col-span-2 space-y-3">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-sans font-semibold text-charcoal/80 uppercase mb-1">
                              Client Name
                            </label>
                            <input
                              type="text"
                              required
                              value={newTestimonial.clientName}
                              onChange={(e) => setNewTestimonial({ ...newTestimonial, clientName: e.target.value })}
                              placeholder="e.g. Lakeesha"
                              className="w-full px-3 py-2 bg-white border border-charcoal/20 rounded-lg text-xs font-sans focus:outline-none focus:border-copper"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-sans font-semibold text-charcoal/80 uppercase mb-1">
                              Service Tag
                            </label>
                            <input
                              type="text"
                              value={newTestimonial.service}
                              onChange={(e) => setNewTestimonial({ ...newTestimonial, service: e.target.value })}
                              placeholder="e.g. Wedding Photography"
                              className="w-full px-3 py-2 bg-white border border-charcoal/20 rounded-lg text-xs font-sans focus:outline-none focus:border-copper"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-sans font-semibold text-charcoal/80 uppercase mb-1">
                            Client Review
                          </label>
                          <textarea
                            rows={3}
                            required
                            value={newTestimonial.review}
                            onChange={(e) => setNewTestimonial({ ...newTestimonial, review: e.target.value })}
                            placeholder="Client feedback text..."
                            className="w-full px-3 py-2 bg-white border border-charcoal/20 rounded-lg text-xs font-sans focus:outline-none focus:border-copper resize-none"
                          />
                        </div>

                        <button
                          type="submit"
                          className="w-full py-3 bg-charcoal hover:bg-copper text-white text-xs font-sans font-bold uppercase tracking-wider rounded-xl transition-colors"
                        >
                          Publish Testimonial
                        </button>
                      </div>
                    </div>
                  </form>
                )}

                {/* Existing Testimonials List */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {content.testimonials.map((t) => {
                    const isPublished = t.is_published !== false

                    return (
                      <div
                        key={t.id}
                        className={`p-4 rounded-xl border relative flex gap-4 items-start group shadow-sm transition-all ${
                          isPublished ? 'bg-[#FAF8F5] border-charcoal/15' : 'bg-charcoal/5 border-charcoal/10 opacity-60'
                        }`}
                      >
                        <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-sand">
                          <img src={t.image} alt={t.clientName} className="w-full h-full object-cover object-center" />
                        </div>

                        <div className="flex-1 min-w-0 pr-14">
                          <div className="flex items-center gap-2">
                            <h4 className="font-serif text-sm font-bold text-charcoal truncate">
                              {t.clientName}
                            </h4>
                            {!isPublished && (
                              <span className="text-[8px] bg-red-100 text-red-700 font-bold px-1.5 py-0.5 rounded">
                                HIDDEN
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] font-sans text-copper font-medium block truncate">
                            {t.service}
                          </span>
                          <p className="text-xs font-body text-charcoal/75 line-clamp-3 mt-1.5 italic">
                            "{t.review}"
                          </p>
                        </div>

                        {/* Action buttons */}
                        <div className="absolute top-3 right-3 flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => {
                              togglePublishTestimonial(t.id)
                              showToast(isPublished ? 'Testimonial hidden' : 'Testimonial published!')
                            }}
                            className={`p-1.5 rounded transition-colors ${
                              isPublished ? 'text-emerald-700 hover:bg-emerald-50' : 'text-charcoal/40 hover:bg-charcoal/10'
                            }`}
                            title={isPublished ? 'Hide from public site' : 'Publish'}
                          >
                            {isPublished ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              if (confirm(`Remove testimonial from ${t.clientName}?`)) {
                                removeTestimonial(t.id)
                                showToast('Testimonial removed')
                              }
                            }}
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                            title="Delete Testimonial"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* ======================================================== */}
            {/* TAB: DATABASE, BACKUP & RESET                            */}
            {/* ======================================================== */}
            {activeTab === 'settings' && (
              <div className="max-w-2xl space-y-6">
                <div>
                  <h3 className="font-serif text-xl sm:text-2xl text-charcoal font-bold">
                    Database & Backup Management
                  </h3>
                  <p className="text-xs text-charcoal-muted font-sans mt-0.5">
                    Configure Supabase PostgreSQL backend, export backups, or reset content.
                  </p>
                </div>

                <div className="space-y-4">
                  {/* Supabase Status Card */}
                  <div className="p-5 rounded-2xl bg-[#FAF8F5] border border-charcoal/10 flex items-center justify-between flex-wrap gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Database className="w-4 h-4 text-copper" />
                        <h4 className="font-sans font-bold text-xs text-charcoal uppercase">
                          Supabase Backend Connection
                        </h4>
                      </div>
                      <p className="text-[11px] text-charcoal-muted font-sans">
                        Status: <strong className="text-charcoal capitalize">{supabaseStatus}</strong>
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setShowDbConfig(true)}
                      className="px-4 py-2 bg-charcoal hover:bg-copper text-white text-xs font-sans font-bold rounded-xl transition-colors"
                    >
                      Configure Keys
                    </button>
                  </div>

                  {/* Export Backup */}
                  <div className="p-5 rounded-2xl bg-[#FAF8F5] border border-charcoal/10 flex items-center justify-between flex-wrap gap-4">
                    <div>
                      <h4 className="font-sans font-bold text-xs text-charcoal uppercase">
                        Export Website Backup (JSON)
                      </h4>
                      <p className="text-[11px] text-charcoal-muted font-sans mt-0.5">
                        Download all current images, albums, and text configurations into a single file.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={exportConfig}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-charcoal hover:bg-copper text-white text-xs font-sans font-bold rounded-xl transition-colors shadow-sm"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download Backup</span>
                    </button>
                  </div>

                  {/* Reset to Defaults */}
                  <div className="p-5 rounded-2xl bg-red-50/50 border border-red-200 flex items-center justify-between flex-wrap gap-4">
                    <div>
                      <h4 className="font-sans font-bold text-xs text-red-800 uppercase">
                        Reset to Original Studio Defaults
                      </h4>
                      <p className="text-[11px] text-red-700/80 font-sans mt-0.5">
                        Clear all custom uploaded photos and revert to original shoot 1, 2, 4 and wildlife collections.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm('Are you sure you want to reset all content back to original defaults?')) {
                          resetToDefaults()
                          showToast('Website reset to original studio defaults')
                        }
                      }}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-sans font-bold rounded-xl transition-colors shadow-sm"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Reset Defaults</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  )
}
