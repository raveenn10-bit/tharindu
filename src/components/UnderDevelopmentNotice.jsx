import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, MessageSquare, X, AlertTriangle } from 'lucide-react'
import { getWhatsAppLink, contact } from '../data/content'

export default function UnderDevelopmentNotice() {
  const [isVisible, setIsVisible] = useState(true)

  if (!isVisible) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -50, opacity: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="sticky top-0 z-[60] bg-charcoal text-white text-xs font-sans border-b border-copper/30 shadow-md select-none"
      >
        <div className="max-w-7xl mx-auto px-4 py-2.5 sm:py-2 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 truncate">
            <span className="flex h-2 w-2 relative flex-shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-copper opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-copper" />
            </span>
            <span className="font-bold text-copper uppercase tracking-wider text-[11px] sm:text-xs">
              Notice:
            </span>
            <span className="text-white/90 text-[11px] sm:text-xs font-medium truncate">
              <strong>Page is Under Development</strong> — Active updates in progress.
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            <a
              href={getWhatsAppLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="px-2.5 py-1 bg-copper hover:bg-copper-dark text-white rounded-full text-[10px] sm:text-[11px] font-bold uppercase tracking-wider flex items-center gap-1 transition-colors shadow-sm"
            >
              <MessageSquare className="w-3 h-3" />
              <span className="hidden sm:inline">WhatsApp Inquiries</span>
              <span className="sm:hidden">WhatsApp</span>
            </a>

            <button
              type="button"
              onClick={() => setIsVisible(false)}
              className="p-1 text-white/50 hover:text-white rounded-full transition-colors"
              title="Dismiss Notice"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
