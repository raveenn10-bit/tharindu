import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { editorial, street, nature } from '../data/images'

// High-impact vertical gallery frames spanning full-width
const baseStripPhotos = [
  { id: 1, title: 'The Colonial Arcade', category: 'Architecture', image: editorial.arcade },
  { id: 2, title: 'Coastal Movement', category: 'Lifestyle', image: street.lean },
  { id: 3, title: 'Blue Archway', category: 'Heritage', image: editorial.blueFrame },
  { id: 4, title: 'Iron Spiral Staircase', category: 'Architecture', image: editorial.staircase },
  { id: 5, title: 'Floral Radiance', category: 'Portrait', image: '/photos/maheshika/maheshika-01.jpg' },
  { id: 6, title: 'Tropical Island Lagoon', category: 'Landscape', image: nature.island },
  { id: 7, title: 'Grand Venue Chandelier', category: 'Events', image: editorial.chandelier },
  { id: 8, title: 'Street Glance', category: 'Portrait', image: street.glance },
  { id: 9, title: 'Action Form', category: 'Action', image: '/photos/pasindu-dananjaya.jpg' },
]

// Duplicate the array 3 times for a seamless continuous marquee loop
const infiniteStrip = [
  ...baseStripPhotos.map((item, idx) => ({ ...item, uniqueKey: `strip-a-${idx}` })),
  ...baseStripPhotos.map((item, idx) => ({ ...item, uniqueKey: `strip-b-${idx}` })),
  ...baseStripPhotos.map((item, idx) => ({ ...item, uniqueKey: `strip-c-${idx}` })),
]

export default function FullWidthPhotoStrip({ onOpenProject }) {
  const [isPaused, setIsPaused] = useState(false)

  return (
    <section className="w-full bg-white overflow-hidden select-none border-t border-charcoal/10 relative">
      {/* Continuous Infinite Auto-Scrolling Photo Ribbon */}
      <div
        className="relative w-full overflow-hidden"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
      >
        <motion.div
          className="flex w-max cursor-pointer will-change-transform"
          animate={
            isPaused
              ? {}
              : {
                  x: ['0%', '-33.333333%'],
                }
          }
          transition={{
            x: {
              repeat: Infinity,
              repeatType: 'loop',
              duration: 65,
              ease: 'linear',
            },
          }}
        >
          {infiniteStrip.map((item) => {
            const imgSrc = typeof item.image === 'string' ? item.image : item.image?.src || ''
            return (
              <div
                key={item.uniqueKey}
                onClick={() =>
                  onOpenProject &&
                  onOpenProject({
                    title: item.title,
                    category: item.category,
                    image: imgSrc,
                    location: 'Sri Lanka',
                    note: 'High-resolution photographic capture from the Tilnogz Photography archive.',
                  })
                }
                className="flex-shrink-0 w-44 sm:w-56 md:w-72 lg:w-80 aspect-[2/3] overflow-hidden group relative bg-charcoal"
              >
                <img
                  src={imgSrc}
                  alt={item.title}
                  className="w-full h-full object-cover object-center group-hover:scale-105 group-hover:opacity-85 transition-all duration-700 ease-out pointer-events-none"
                  loading="lazy"
                  decoding="async"
                />

                {/* Hoverer Caption Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal/85 via-charcoal/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 sm:p-5 text-paper">
                  <span className="text-[10px] font-sans font-bold tracking-widest text-copper-light uppercase mb-1">
                    {item.category}
                  </span>
                  <span className="font-sans font-bold text-xs sm:text-sm text-white uppercase block">
                    {item.title}
                  </span>
                  <span className="text-[10px] sm:text-[11px] text-paper/80 font-sans tracking-wide mt-1">
                    Click to inspect frame →
                  </span>
                </div>
              </div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
