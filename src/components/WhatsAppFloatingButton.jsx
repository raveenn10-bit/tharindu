import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { getWhatsAppLink } from '../data/content'

export default function WhatsAppFloatingButton() {
  const [showTooltip, setShowTooltip] = useState(true)

  return (
    <div className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-50 flex items-center gap-2 sm:gap-3 select-none">
      {/* Floating Tooltip Pill */}
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, x: 16, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ delay: 0.5, duration: 0.35 }}
            className="flex items-center gap-2 bg-white/95 backdrop-blur-md px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-full border border-charcoal/10 shadow-xl text-charcoal text-[11px] sm:text-xs font-sans font-bold tracking-wide"
          >
            <span className="w-2 h-2 rounded-full bg-[#25D366] animate-pulse" />
            <span>Chat on WhatsApp</span>
            <button
              type="button"
              onClick={() => setShowTooltip(false)}
              className="text-charcoal-muted hover:text-charcoal ml-1 p-0.5"
              aria-label="Close tooltip"
            >
              <X className="w-3 h-3" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main WhatsApp Floating Action Button */}
      <motion.a
        href={getWhatsAppLink('Hello Tilnogz Photography, I would like to inquire about booking a photography session.')}
        target="_blank"
        rel="noopener noreferrer"
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        className="relative group w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-[0_8px_25px_rgba(37,211,102,0.45)] hover:shadow-[0_12px_32px_rgba(37,211,102,0.6)] transition-all duration-300 focus:outline-none flex-shrink-0"
        aria-label="Contact Tilnogz Photography on WhatsApp (+94 78 843 2741)"
      >
        {/* Pulsating Ping Radar Effect */}
        <span className="absolute -inset-1 rounded-full bg-[#25D366]/40 animate-ping pointer-events-none" />

        {/* Official WhatsApp SVG Vector Icon */}
        <svg
          viewBox="0 0 24 24"
          className="w-6 h-6 sm:w-7 sm:h-7 fill-current transition-transform duration-300 group-hover:scale-110"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M17.472 14.382c-.301-.15-1.78-.878-2.056-.978-.276-.1-.476-.15-.677.15-.2.301-.777.978-.952 1.179-.176.201-.351.226-.652.075-.301-.15-1.272-.469-2.423-1.496-.896-.799-1.501-1.786-1.677-2.087-.176-.301-.019-.464.132-.614.136-.135.301-.351.452-.527.15-.176.201-.301.301-.502.101-.201.05-.377-.025-.527-.075-.15-.677-1.632-.928-2.234-.244-.587-.492-.507-.677-.516-.175-.008-.376-.01-.577-.01-.201 0-.527.075-.803.376-.276.301-1.053 1.029-1.053 2.509 0 1.48 1.079 2.909 1.229 3.11.15.201 2.124 3.243 5.145 4.548.719.311 1.28.497 1.718.636.723.23 1.381.197 1.901.12.58-.087 1.78-.728 2.031-1.431.251-.703.251-1.305.176-1.431-.076-.126-.276-.201-.577-.351z" />
          <path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.982-1.398A9.957 9.957 0 0 0 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18.167c-1.624 0-3.136-.487-4.407-1.326l-.316-.209-2.959.83.846-2.883-.23-.346A8.125 8.125 0 0 1 3.833 12c0-4.503 3.664-8.167 8.167-8.167 4.503 0 8.167 3.664 8.167 8.167 0 4.503-3.664 8.167-8.167 8.167z" />
        </svg>
      </motion.a>
    </div>
  )
}
