import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { featured } from '../data/portfolio'
import { fadeUp, staggerContainer } from '../lib/motion'

// Duplicated array for seamless infinite mobile marquee loop
const infiniteMobileAlbums = [
  ...featured.map((item, idx) => ({ ...item, uniqueKey: `mob-a-${idx}` })),
  ...featured.map((item, idx) => ({ ...item, uniqueKey: `mob-b-${idx}` })),
]

export default function FeaturedWork({ onOpenProject }) {
  const [showAll, setShowAll] = useState(false)
  const [isMobilePaused, setIsMobilePaused] = useState(false)

  // Desktop: Show first 6 albums initially, or all albums when "View More" is clicked
  const displayedItems = showAll ? featured : featured.slice(0, 6)

  return (
    <section id="work" className="py-16 sm:py-24 md:py-32 bg-white relative border-t border-charcoal/5 overflow-hidden select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Centered ALBUMS Heading */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.2 }}
          className="text-center mb-10 sm:mb-16 md:mb-20"
        >
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-charcoal tracking-[0.25em] uppercase font-normal">
            ALBUMS
          </h2>
        </motion.div>

        {/* ======================================================== */}
        {/* MOBILE ONLY: Smooth Continuous Horizontal Auto-Scroll    */}
        {/* ======================================================== */}
        <div
          className="block md:hidden relative w-full overflow-hidden -mx-4 px-4"
          onTouchStart={() => setIsMobilePaused(true)}
          onTouchEnd={() => setIsMobilePaused(false)}
          onMouseEnter={() => setIsMobilePaused(true)}
          onMouseLeave={() => setIsMobilePaused(false)}
        >
          <motion.div
            className="flex gap-4 w-max cursor-pointer will-change-transform"
            animate={
              isMobilePaused
                ? {}
                : {
                    x: ['0%', '-50%'],
                  }
            }
            transition={{
              x: {
                repeat: Infinity,
                repeatType: 'loop',
                duration: 30,
                ease: 'linear',
              },
            }}
          >
            {infiniteMobileAlbums.map((item) => (
              <div
                key={item.uniqueKey}
                onClick={() => onOpenProject && onOpenProject(item)}
                className="flex-shrink-0 w-60 aspect-[4/5] rounded-sm overflow-hidden bg-charcoal relative shadow-md"
              >
                {/* Thumbnail Image */}
                <img
                  src={item.image.src}
                  alt={item.title}
                  className="w-full h-full object-cover object-center pointer-events-none"
                  loading="lazy"
                  decoding="async"
                />

                {/* Bottom Gradient Overlay with Title */}
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal/90 via-charcoal/20 to-transparent flex flex-col justify-end p-4 text-paper">
                  <span className="text-[10px] font-sans font-bold tracking-widest text-copper-light uppercase mb-1">
                    {item.category}
                  </span>
                  <h3 className="font-serif text-base text-white tracking-wide uppercase font-medium">
                    {item.title}
                  </h3>
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* ======================================================== */}
        {/* DESKTOP ONLY: 3-Column Responsive Interactive Grid       */}
        {/* ======================================================== */}
        <div className="hidden md:block">
          <motion.div
            variants={staggerContainer(0.06, 0.02)}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.1 }}
            className="grid grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
          >
            <AnimatePresence>
              {displayedItems.map((item) => (
                <motion.div
                  key={item.id}
                  variants={fadeUp}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  onClick={() => onOpenProject && onOpenProject(item)}
                  className="group relative cursor-pointer overflow-hidden bg-charcoal aspect-[4/5] shadow-sm rounded-sm"
                >
                  {/* Thumbnail Image */}
                  <img
                    src={item.image.src}
                    alt={item.title}
                    className="w-full h-full object-cover object-center group-hover:scale-105 group-hover:opacity-85 transition-all duration-700 ease-out"
                    loading="lazy"
                    decoding="async"
                  />

                  {/* Hoverer Caption Overlay */}
                  <div className="absolute inset-0 bg-charcoal/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-6 text-center text-paper">
                    <h3 className="font-serif text-xl sm:text-2xl text-white tracking-wide uppercase mb-2">
                      {item.title}
                    </h3>
                    <span className="text-xs font-sans text-paper/80 uppercase tracking-widest">
                      {item.category}
                    </span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {/* Centered View More / View Less Toggle Button */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.2 }}
            className="text-center mt-12 sm:mt-16"
          >
            <button
              type="button"
              onClick={() => setShowAll(!showAll)}
              className="inline-block px-10 py-3.5 bg-[#555552] hover:bg-charcoal text-white text-xs font-sans font-semibold tracking-widest uppercase transition-colors rounded-sm shadow-sm focus:outline-none"
            >
              {showAll ? 'Show Less' : 'View More'}
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
