import React, { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ArrowLeft, ArrowRight, Camera, MapPin, MessageSquare, ArrowUpRight } from 'lucide-react'
import { getWhatsAppLink } from '../data/content'
import Figure from './Figure'
import MagneticButton from './MagneticButton'

export default function ProjectModal({ project, onClose, onPrev, onNext }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft' && onPrev) onPrev()
      if (e.key === 'ArrowRight' && onNext) onNext()
    }
    window.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'unset'
    }
  }, [onClose, onPrev, onNext])

  if (!project) return null

  const waInquiry = getWhatsAppLink(
    `Hello Tilnogz Photography, I would like to inquire about a session similar to "${project.title}" (${project.category}).`
  )

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 md:p-10 overflow-y-auto">
        {/* Backdrop Scrim */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={onClose}
          className="fixed inset-0 bg-charcoal/85 backdrop-blur-md"
        />

        {/* Modal Dialog Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="relative bg-paper w-full max-w-5xl rounded-3xl overflow-hidden shadow-2xl border border-charcoal/10 z-10 my-auto flex flex-col max-h-[90vh]"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          {/* Top Bar with Navigation Controls */}
          <div className="p-4 sm:p-6 border-b border-charcoal/10 flex items-center justify-between bg-white/80 backdrop-blur-sm sticky top-0 z-20">
            <div className="flex items-center gap-3">
              <span className="font-sans text-[11px] font-bold tracking-ultra text-copper uppercase">
                {project.category}
              </span>
              <span className="text-charcoal-muted">·</span>
              <span className="font-sans text-xs font-semibold text-charcoal/70 uppercase">
                {project.location || 'Sri Lanka'}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {onPrev && (
                <button
                  type="button"
                  onClick={onPrev}
                  className="w-9 h-9 rounded-full bg-sand-light hover:bg-charcoal hover:text-white flex items-center justify-center text-charcoal transition-colors"
                  aria-label="Previous work"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
              )}
              {onNext && (
                <button
                  type="button"
                  onClick={onNext}
                  className="w-9 h-9 rounded-full bg-sand-light hover:bg-charcoal hover:text-white flex items-center justify-center text-charcoal transition-colors"
                  aria-label="Next work"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
              <button
                type="button"
                onClick={onClose}
                className="w-9 h-9 rounded-full bg-charcoal text-paper hover:bg-copper flex items-center justify-center transition-colors ml-2"
                aria-label="Close dialog"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Scrollable Content Body */}
          <div className="overflow-y-auto p-4 sm:p-8 space-y-6">
            {/* Main High-Res Image Showcase */}
            <div className="rounded-2xl overflow-hidden bg-sand-light/60 border border-charcoal/10 shadow-sm max-h-[60vh] flex items-center justify-center">
              <img
                src={typeof project.image === 'string' ? project.image : project.image?.src}
                alt={project.title}
                className="max-h-[60vh] w-auto max-w-full object-contain mx-auto"
              />
            </div>

            {/* Information Grid */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start pt-4 border-t border-charcoal/10">
              <div className="md:col-span-8 space-y-3">
                <h3 id="modal-title" className="font-sans text-2xl sm:text-3xl font-extrabold text-charcoal">
                  {project.title}
                </h3>
                <p className="font-body text-sm sm:text-base text-charcoal-muted leading-relaxed">
                  {project.note || 'Authentic photography captured on location in Sri Lanka by Tilnogz Photography.'}
                </p>

                {project.discipline && (
                  <div className="pt-2 flex items-center gap-2 text-xs font-sans font-semibold text-charcoal/80">
                    <Camera className="w-4 h-4 text-copper" />
                    <span>Discipline: {project.discipline}</span>
                  </div>
                )}
              </div>

              {/* Inquiry Action */}
              <div className="md:col-span-4 flex flex-col gap-3">
                <MagneticButton
                  href={waInquiry}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="primary"
                  className="w-full gap-2 py-3.5 text-xs font-bold"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>INQUIRE VIA WHATSAPP</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </MagneticButton>

                <p className="text-[11px] font-sans text-charcoal-muted text-center">
                  Direct message to Tilnogz Photography
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
