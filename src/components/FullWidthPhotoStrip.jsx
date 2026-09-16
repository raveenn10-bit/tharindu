import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useContent } from '../context/ContentContext'
import { editorial, street, nature } from '../data/images'

// Fallback high-impact vertical gallery frames
const fallbackStripPhotos = [
  { id: 'strip-1', title: 'The Colonial Arcade', category: 'Architecture', image_url: editorial.arcade?.src || '/photos/editorial/ed-01.jpg', is_published: true },
  { id: 'strip-2', title: 'Coastal Movement', category: 'Lifestyle', image_url: street.lean?.src || '/photos/street/st-01.jpg', is_published: true },
  { id: 'strip-3', title: 'Blue Archway', category: 'Heritage', image_url: editorial.blueFrame?.src || '/photos/editorial/ed-03.jpg', is_published: true },
  { id: 'strip-4', title: 'Iron Spiral Staircase', category: 'Architecture', image_url: editorial.staircase?.src || '/photos/editorial/ed-06.jpg', is_published: true },
  { id: 'strip-5', title: 'Floral Radiance', category: 'Portrait', image_url: '/photos/maheshika/maheshika-01.jpg', is_published: true },
  { id: 'strip-6', title: 'Tropical Island Lagoon', category: 'Landscape', image_url: nature.island?.src || '/photos/nature/nt-03.jpg', is_published: true },
  { id: 'strip-7', title: 'Grand Venue Chandelier', category: 'Events', image_url: editorial.chandelier?.src || '/photos/editorial/ed-04.jpg', is_published: true },
  { id: 'strip-8', title: 'Street Glance', category: 'Portrait', image_url: street.glance?.src || '/photos/street/st-02.jpg', is_published: true },
  { id: 'strip-9', title: 'Action Form', category: 'Action', image_url: '/photos/pasindu-dananjaya.jpg', is_published: true },
]

export default function FullWidthPhotoStrip({ onOpenProject }) {
  const { content } = useContent()
  const [isPaused, setIsPaused] = useState(false)

  // 1. All active strip photos (user-uploaded/edited photos + all existing strip frames)
  const rawStripPhotos = Array.isArray(content?.stripPhotos) && content.stripPhotos.length > 0
    ? content.stripPhotos.filter((p) => p && typeof p === 'object' && p.is_published !== false)
    : fallbackStripPhotos

  const baseStrip = rawStripPhotos.length > 0 ? rawStripPhotos : fallbackStripPhotos

  // 2. Also include any uploaded portfolio albums so all work is showcased
  const existingKeys = new Set(
    baseStrip.map((p) => (p.image_url || p.image || '').toLowerCase().trim())
  )

  const extraAlbums = Array.isArray(content?.albums)
    ? content.albums.filter(
        (a) =>
          a &&
          typeof a === 'object' &&
          a.is_published !== false &&
          (a.image_url || a.image) &&
          !existingKeys.has((a.image_url || a.image).toLowerCase().trim())
      )
    : []

  const displayPhotos = [...baseStrip, ...extraAlbums]

  // Duplicate the array 3 times for a seamless continuous marquee loop
  const infiniteStrip = [
    ...displayPhotos.map((item, idx) => ({ ...item, uniqueKey: `strip-a-${item.id || idx}` })),
    ...displayPhotos.map((item, idx) => ({ ...item, uniqueKey: `strip-b-${item.id || idx}` })),
    ...displayPhotos.map((item, idx) => ({ ...item, uniqueKey: `strip-c-${item.id || idx}` })),
  ]

  return (
    <section id="gallery-strip" className="w-full bg-white overflow-hidden select-none border-t border-charcoal/10 relative">
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
              duration: Math.max(35, displayPhotos.length * 7),
              ease: 'linear',
            },
          }}
        >
          {infiniteStrip.map((item) => {
            const imgSrc = typeof item.image_url === 'string'
              ? item.image_url
              : typeof item.image === 'string'
              ? item.image
              : item.image?.src || ''

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
