import React from 'react'
import { motion } from 'framer-motion'

export default function Hero() {
  return (
    <section className="relative min-h-[100dvh] min-h-[100svh] w-full overflow-hidden bg-paper select-none">
      {/* Full-Bleed Hero Photograph with High-Performance Attributes */}
      <motion.div
        initial={{ opacity: 0, scale: 1.04 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        className="absolute inset-0 z-0"
      >
        <img
          src="/photos/hero.png"
          alt="Tilnogz Photography - Tharindu Lakshan"
          className="w-full h-full object-cover object-[center_top]"
          loading="eager"
          fetchPriority="high"
          decoding="async"
        />

        {/* Soft top gradient to ensure transparent navbar links and logo remain crisp on mobile & desktop */}
        <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black/20 via-transparent to-transparent pointer-events-none" />
      </motion.div>
    </section>
  )
}
