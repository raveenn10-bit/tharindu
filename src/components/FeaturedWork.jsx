import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { featured } from '../data/portfolio'
import { fadeUp, staggerContainer } from '../lib/motion'

export default function FeaturedWork({ onOpenProject }) {
  const [showAll, setShowAll] = useState(false)

  // Show first 6 albums initially, or all albums when "View More" is clicked
  const displayedItems = showAll ? featured : featured.slice(0, 6)

  return (
    <section id="work" className="py-16 sm:py-24 md:py-32 bg-white relative border-t border-charcoal/5 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Centered ALBUMS Heading without category filter tabs */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.2 }}
          className="text-center mb-12 sm:mb-16 md:mb-20"
        >
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-charcoal tracking-[0.25em] uppercase font-normal">
            ALBUMS
          </h2>
        </motion.div>

        {/* Responsive Albums Grid with Staggered Reversible Scroll Fade */}
        <motion.div
          variants={staggerContainer(0.06, 0.02)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8"
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
                  <h3 className="font-serif text-lg sm:text-xl md:text-2xl text-white tracking-wide uppercase mb-2">
                    {item.title}
                  </h3>
                  <span className="text-[11px] sm:text-xs font-sans text-paper/80 uppercase tracking-widest">
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
          className="text-center mt-10 sm:mt-14 md:mt-16"
        >
          <button
            type="button"
            onClick={() => setShowAll(!showAll)}
            className="inline-block px-8 sm:px-10 py-3 bg-[#555552] hover:bg-charcoal text-white text-xs font-sans font-semibold tracking-widest uppercase transition-colors rounded-sm shadow-sm focus:outline-none"
          >
            {showAll ? 'Show Less' : 'View More'}
          </button>
        </motion.div>
      </div>
    </section>
  )
}
