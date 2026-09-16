import React, { useRef, useState } from 'react'
import { UploadCloud, Image, Video, Link, X, Check, Loader2 } from 'lucide-react'
import { uploadPhotoToStorage, BUCKET_NAME } from '../../lib/supabaseClient'

export default function ImageUploader({
  value,
  onChange,
  currentImage,
  onUploadComplete,
  label = 'Upload Media',
  aspectRatio = 'aspect-[4/3]',
  acceptMedia = 'image/*,video/*',
  storageBucket,
  helperText,
}) {
  const fileInputRef = useRef(null)
  const [urlInput, setUrlInput] = useState('')
  const [isEnteringUrl, setIsEnteringUrl] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')

  const activeValue = value || currentImage || ''

  const notifyChange = (newUrl) => {
    if (typeof onChange === 'function') onChange(newUrl)
    if (typeof onUploadComplete === 'function') onUploadComplete(newUrl)
  }

  const isVideo =
    activeValue &&
    (activeValue.endsWith('.mp4') ||
      activeValue.endsWith('.webm') ||
      activeValue.endsWith('.mov') ||
      activeValue.includes('video') ||
      activeValue.includes('.mp4'))

  const handleFile = async (file) => {
    if (!file) return
    setIsUploading(true)
    setUploadError('')

    try {
      // 1. Upload directly to the Supabase Storage bucket
      const bucket = storageBucket || BUCKET_NAME
      const { publicUrl, error } = await uploadPhotoToStorage(file, bucket)
      if (publicUrl) {
        notifyChange(publicUrl)
        setIsUploading(false)
        return
      }

      if (error) {
        console.warn('Supabase storage upload error, fallback to local FileReader:', error)
      }

      // 2. Local fallback if offline: read as data URL
      const reader = new FileReader()
      reader.onload = (e) => {
        notifyChange(e.target.result)
        setIsUploading(false)
      }
      reader.onerror = () => {
        setUploadError('Failed to read file.')
        setIsUploading(false)
      }
      reader.readAsDataURL(file)
    } catch (err) {
      console.error('File handle error:', err)
      setUploadError(err.message || 'Failed to upload.')
      setIsUploading(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }

  const handleUrlSubmit = (e) => {
    e.preventDefault()
    if (urlInput.trim()) {
      notifyChange(urlInput.trim())
      setUrlInput('')
      setIsEnteringUrl(false)
    }
  }

  return (
    <div className="space-y-2">
      {label && (
        <div className="flex items-center justify-between">
          <label className="block text-xs font-sans font-semibold text-charcoal/80 uppercase tracking-wider">
            {label}
          </label>
          <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-bold">
            Supabase: {BUCKET_NAME}
          </span>
        </div>
      )}

      {isUploading ? (
        <div
          className={`${aspectRatio} w-full rounded-xl border-2 border-copper/40 bg-copper/5 flex flex-col items-center justify-center`}
        >
          <Loader2 className="w-8 h-8 text-copper animate-spin mb-2" />
          <span className="text-xs font-sans font-bold text-copper">
            Uploading to Supabase Storage...
          </span>
        </div>
      ) : activeValue ? (
        <div className="relative group rounded-xl overflow-hidden border border-charcoal/15 bg-sand/30">
          <div
            className={`${aspectRatio} w-full overflow-hidden flex items-center justify-center bg-charcoal/5`}
          >
            {isVideo ? (
              <video
                src={activeValue}
                controls
                className="w-full h-full object-cover object-center"
              />
            ) : (
              <img
                src={activeValue}
                alt="Media Preview"
                className="w-full h-full object-cover object-center"
              />
            )}
          </div>
          <div className="absolute inset-0 bg-charcoal/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-1.5 bg-white text-charcoal text-xs font-sans font-bold rounded shadow hover:bg-copper hover:text-white transition-colors"
            >
              Replace
            </button>
            <button
              type="button"
              onClick={() => notifyChange('')}
              className="p-1.5 bg-red-600 text-white rounded shadow hover:bg-red-700 transition-colors"
              title="Remove Media"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <div>
          <div
            onDragOver={(e) => {
              e.preventDefault()
              setDragOver(true)
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl ${aspectRatio} flex flex-col items-center justify-center p-4 cursor-pointer transition-all ${
              dragOver
                ? 'border-copper bg-copper/5 scale-[0.99]'
                : 'border-charcoal/20 bg-[#FAF8F5] hover:border-copper/50 hover:bg-sand/20'
            }`}
          >
            <UploadCloud className="w-8 h-8 text-charcoal/40 mb-2" />
            <p className="text-xs font-sans font-medium text-charcoal/80 text-center">
              Click or Drag & Drop photo / video here
            </p>
            <p className="text-[10px] font-sans text-charcoal-muted mt-0.5">
              JPG, PNG, WEBP, MP4, MOV supported
            </p>
          </div>

          {uploadError && (
            <p className="text-xs text-red-600 font-sans mt-1">{uploadError}</p>
          )}

          {/* Direct URL input option */}
          <div className="mt-2 flex items-center justify-between text-[11px] font-sans text-charcoal/70">
            {isEnteringUrl ? (
              <form onSubmit={handleUrlSubmit} className="flex gap-2 w-full mt-1">
                <input
                  type="url"
                  placeholder="Paste direct URL (https://... or /videos/...)"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  className="flex-1 px-2.5 py-1.5 text-xs bg-white border border-charcoal/20 rounded focus:outline-none focus:border-copper"
                />
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-copper text-white text-xs rounded hover:bg-copper-dark flex items-center gap-1 font-bold"
                >
                  <Check className="w-3 h-3" /> Set
                </button>
                <button
                  type="button"
                  onClick={() => setIsEnteringUrl(false)}
                  className="px-2 py-1.5 bg-charcoal/10 text-charcoal text-xs rounded hover:bg-charcoal/20"
                >
                  <X className="w-3 h-3" />
                </button>
              </form>
            ) : (
              <button
                type="button"
                onClick={() => setIsEnteringUrl(true)}
                className="inline-flex items-center gap-1 text-copper hover:underline text-[11px] font-medium"
              >
                <Link className="w-3 h-3" /> Or paste media URL
              </button>
            )}
          </div>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept={acceptMedia}
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0])
          }
        }}
        className="hidden"
      />
    </div>
  )
}
