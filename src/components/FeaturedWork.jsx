import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Shuffle, Sparkles } from 'lucide-react'
import { useContent } from '../context/ContentContext'
import { fadeUp, staggerContainer } from '../lib/motion'

export default function FeaturedWork({ onOpenProject }) {
  const { content, shuffleAlbums } = useContent()
  const allAlbums = content?.albums || []

  // Only display published albums on public site
  const albums = allAlbums.filter((a) => a.is_published !== false)

  const [selectedCategory, setSelectedCategory] = useState('All')
  const [showAll, setShowAll] = useState(false)
  const [isMobilePaused, setIsMobilePaused] = useState(false)
  const [isShuffling, setIsShuffling] = useState(false)

  const categories = [
    'All',
    'Wedding Photography',
    'Pre-Wedding / Engagement Photography',
    'Graduation Photography',
    'Vehicle Photography',
    'Sports Photography',
    'Architecture Photography',
  ]

  const filteredAlbums =
    selectedCategory === 'All'
      ? albums
      : albums.filter((a) => a.category?.toLowerCase().includes(selectedCategory.toLowerCase().slice(0, 8)))

  // Duplicated array for seamless infinite mobile marquee loop
  const infiniteMobileAlbums = [
    ...filteredAlbums.map((item, idx) => ({ ...item, uniqueKey: `mob-a-${idx}-${item.id}` })),
    ...filteredAlbums.map((item, idx) => ({ ...item, uniqueKey: `mob-b-${idx}-${item.id}` })),
  ]

  // Desktop: Show first 6 albums initially, or all albums when "View More" is clicked
  const displayedItems = showAll ? filteredAlbums : filteredAlbums.slice(0, 6)

  const handleShuffle = () => {
    setIsShuffling(true)
    if (shuffleAlbums) {
      shuffleAlbums()
    }
    setTimeout(() => setIsShuffling(false), 600)
  }

  return (
    <section id="work" className="py-16 sm:py-24 md:py-32 bg-white relative border-t border-charcoal/5 overflow-hidden select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Centered ALBUMS Heading + Luxury Shuffle Button */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.2 }}
          className="text-center mb-8 sm:mb-12"
        >
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-charcoal tracking-[0.25em] uppercase font-normal mb-4">
            ALBUMS
          </h2>

          {/* Luxury Shuffle Control */}
          <div className="inline-flex items-center gap-2">
            <button
              type="button"
              onClick={handleShuffle}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-charcoal/15 bg-[#FAF8F5] hover:bg-charcoal hover:text-white text-charcoal text-xs font-sans font-bold tracking-widest uppercase transition-all duration-300 shadow-sm group active:scale-95"
              title="Shuffle albums order"
            >
              <motion.div
                animate={isShuffling ? { rotate: 360 } : { rotate: 0 }}
                transition={{ duration: 0.5, ease: 'easeInOut' }}
              >
                <Shuffle className="w-3.5 h-3.5 text-copper group-hover:text-copper-light transition-colors" />
              </motion.div>
              <span>Shuffle Collection</span>
            </button>
          </div>
        </motion.div>

        {/* Category Filter Pills */}
        <div className="flex items-center justify-center gap-2 flex-wrap mb-10 sm:mb-14 px-2">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat
            const shortName = cat.replace(' Photography', '').replace(' / Engagement', '')
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 sm:px-4 py-1.5 rounded-full text-[11px] font-sans uppercase tracking-wider transition-all duration-200 ${
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
                duration: 30,
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
        {/* DESKTOP ONLY: 3-Column Responsive Interactive Grid       */}
        {/* ======================================================== */}
        <div className="hidden md:block">
          <motion.div
            layout
            variants={staggerContainer(0.06, 0.02)}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
          >
            <AnimatePresence mode="popLayout">
              {displayedItems.map((item) => {
                const imgSrc = typeof item.image === 'string' ? item.image : item.image?.src || ''
                return (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                    onClick={() => onOpenProject && onOpenProject(item)}
                    className="group relative cursor-pointer overflow-hidden bg-charcoal aspect-[4/5] shadow-sm rounded-sm"
                  >
                    {/* Thumbnail Image */}
                    <img
                      src={imgSrc}
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
                )
              })}
            </AnimatePresence>
          </motion.div>

          {/* Centered View More / View Less Toggle Button */}
          {filteredAlbums.length > 6 && (
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
                {showAll ? 'Show Less' : `View More (${filteredAlbums.length})`}
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  )
}
