import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useContent } from '../context/ContentContext'
import { fadeUp, staggerContainer } from '../lib/motion'

const BATCH_SIZE = 9

export default function FeaturedWork({ onOpenProject }) {
  const { content } = useContent()
  const allAlbums = content?.albums || []

  // Only display published albums on public site
  const baseAlbums = allAlbums.filter((a) => a.is_published !== false)

  const [selectedCategory, setSelectedCategory] = useState('All')
  const [batchIndex, setBatchIndex] = useState(0)
  const [isSectionHovered, setIsSectionHovered] = useState(false)
  const [isMobilePaused, setIsMobilePaused] = useState(false)

  const categories = [
    'All',
    'Wedding Photography',
    'Pre-Wedding / Engagement Photography',
    'Graduation Photography',
    'Vehicle Photography',
    'Sports Photography',
    'Architecture Photography',
  ]

  // Filter based on selected category
  const filteredAlbums =
    selectedCategory === 'All'
      ? baseAlbums
      : baseAlbums.filter((a) =>
          a.category?.toLowerCase().includes(selectedCategory.toLowerCase().slice(0, 8))
        )

  // Reset batch index when category changes
  useEffect(() => {
    setBatchIndex(0)
  }, [selectedCategory])

  // Auto-shuffle / cycle 9 photos every 2 seconds (2000ms)
  useEffect(() => {
    if (isSectionHovered || filteredAlbums.length <= 1) return

    const interval = setInterval(() => {
      setBatchIndex((prev) => (prev + 1))
    }, 2000)

    return () => clearInterval(interval)
  }, [isSectionHovered, filteredAlbums.length])

  // Get active 9 photos for the current 2-second cycle
  const getActive9Photos = () => {
    const total = filteredAlbums.length
    if (total === 0) return []
    if (total <= BATCH_SIZE) {
      // If 9 or fewer photos, rotate/shuffle their positions
      const shift = batchIndex % total
      return [...filteredAlbums.slice(shift), ...filteredAlbums.slice(0, shift)]
    }

    // Pick 9 photos sequentially with wrap-around
    const start = (batchIndex * BATCH_SIZE) % total
    const result = []
    for (let i = 0; i < BATCH_SIZE; i++) {
      result.push(filteredAlbums[(start + i) % total])
    }
    return result
  }

  const activePhotos = getActive9Photos()

  // Mobile infinite ribbon array
  const infiniteMobileAlbums = [
    ...filteredAlbums.map((item, idx) => ({ ...item, uniqueKey: `mob-a-${idx}-${item.id}` })),
    ...filteredAlbums.map((item, idx) => ({ ...item, uniqueKey: `mob-b-${idx}-${item.id}` })),
  ]

  return (
    <section
      id="work"
      onMouseEnter={() => setIsSectionHovered(true)}
      onMouseLeave={() => setIsSectionHovered(false)}
      className="py-16 sm:py-24 md:py-32 bg-white relative border-t border-charcoal/5 overflow-hidden select-none"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Centered ALBUMS Heading */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.2 }}
          className="text-center mb-6 sm:mb-8"
        >
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-charcoal tracking-[0.25em] uppercase font-normal">
            ALBUMS
          </h2>
        </motion.div>

        {/* Category Filter Pills */}
        <div className="flex items-center justify-center gap-2 flex-wrap mb-10 sm:mb-12 px-2">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat
            const shortName = cat.replace(' Photography', '').replace(' / Engagement', '')
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 sm:px-4 py-1.5 rounded-full text-[11px] font-sans uppercase tracking-wider transition-all duration-200 ${
                  isSelected
                    ? 'bg-charcoal text-white font-bold shadow-sm'
                    : 'bg-[#FAF8F5] text-charcoal/70 hover:bg-sand/60 font-medium'
                }`}
              >
                {cat === 'All' ? 'All Works' : shortName}
              </button>
            )
          })}
        </div>

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
                duration: 25,
                ease: 'linear',
              },
            }}
          >
            {infiniteMobileAlbums.map((item) => {
              const imgSrc = typeof item.image === 'string' ? item.image : item.image?.src || ''
              return (
                <div
                  key={item.uniqueKey}
                  onClick={() => onOpenProject && onOpenProject(item)}
                  className="flex-shrink-0 w-60 aspect-[4/5] rounded-sm overflow-hidden bg-charcoal relative shadow-md"
                >
                  {/* Thumbnail Image */}
                  <img
                    src={imgSrc}
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
                    <h3 className="font-serif text-base text-white tracking-wide uppercase font-medium truncate">
                      {item.title}
                    </h3>
                  </div>
                </div>
              )
            })}
          </motion.div>
        </div>

        {/* ======================================================== */}
        {/* DESKTOP: 3x3 Grid of 9 Photos Cycling Every 2 Seconds    */}
        {/* ======================================================== */}
        <div className="hidden md:block">
          <motion.div
            layout
            variants={staggerContainer(0.04, 0.02)}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-3 gap-6 md:gap-7"
          >
            <AnimatePresence mode="popLayout">
              {activePhotos.map((item, slotIndex) => {
                const imgSrc = typeof item.image === 'string' ? item.image : item.image?.src || ''
                return (
                  <motion.div
                    key={`slot-${slotIndex}-${item.id}`}
                    layout
                    initial={{ opacity: 0, scale: 0.94 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.94 }}
                    transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                    onClick={() => onOpenProject && onOpenProject(item)}
                    className="group relative cursor-pointer overflow-hidden bg-charcoal aspect-[4/5] shadow-sm rounded-sm"
                  >
                    {/* High Performance Thumbnail Image */}
                    <img
                      src={imgSrc}
                      alt={item.title}
                      className="w-full h-full object-cover object-center group-hover:scale-105 group-hover:opacity-85 transition-all duration-700 ease-out"
                      loading="lazy"
                      decoding="async"
                    />

                    {/* Hover Caption Overlay */}
                    <div className="absolute inset-0 bg-charcoal/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-6 text-center text-paper">
                      <h3 className="font-serif text-lg lg:text-xl text-white tracking-wide uppercase mb-1.5">
                        {item.title}
                      </h3>
                      <span className="text-xs font-sans text-paper/80 uppercase tracking-widest">
                        {item.category}
                      </span>
                    </div>
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
