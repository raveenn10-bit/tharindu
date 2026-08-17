import React from 'react'
import { motion } from 'framer-motion'

export default function Hero() {
  return (
    <section className="relative min-h-[100dvh] min-h-[100svh] w-full overflow-hidden bg-paper select-none">
      {/* Full-Bleed Responsive Hero Photograph with Mobile/Portrait Support */}
      <motion.div
        initial={{ opacity: 0, scale: 1.04 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        className="absolute inset-0 z-0"
      >
        <picture className="w-full h-full">
          {/* Mobile and Portrait Orientation */}
          <source
            media="(max-width: 768px), (orientation: portrait)"
            srcSet="/photos/hero-mobile.png"
          />
          {/* Desktop and Landscape Orientation */}
          <source
            media="(min-width: 769px) and (orientation: landscape)"
            srcSet="/photos/hero.png"
          />
          {/* Fallback Image */}
          <img
            src="/photos/hero.png"
            alt="Tilnogz Photography - Tharindu Lakshan"
            className="w-full h-full object-cover object-[center_top]"
            loading="eager"
            fetchPriority="high"
            decoding="async"
          />
        </picture>

        {/* Soft top gradient to ensure transparent navbar links and logo remain crisp */}
        <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black/20 via-transparent to-transparent pointer-events-none" />
      </motion.div>
    </section>
  )
}
