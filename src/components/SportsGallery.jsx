import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react'
import { editorial, field, street, nature } from '../data/images'

// Continuous multi-image photographic carousel strip matching the reference site
const baseCarouselImages = [
  { id: 1, title: 'The Colonial Arcade', category: 'Architecture', image: editorial.arcade },
  { id: 2, title: 'Sprint Velocity', category: 'Sports', image: field.riderFront },
  { id: 3, title: 'Grand Chandelier', category: 'Events', image: editorial.chandelier },
  { id: 4, title: 'Street Movement', category: 'Lifestyle', image: street.lean },
  { id: 5, title: 'Motorcycle Transit', category: 'Action', image: field.riderSeated },
  { id: 6, title: 'Cyan Facade', category: 'Architecture', image: editorial.arcadeWide },
  { id: 7, title: 'Tropical Island', category: 'Landscape', image: nature.island },
  { id: 8, title: 'Quiet Horizon', category: 'Portrait', image: street.glance },
  { id: 9, title: 'Iron Staircase', category: 'Architecture', image: editorial.staircase },
  { id: 10, title: 'Decisive Turn', category: 'Motion', image: field.motionTurn },
]

// Duplicate the array 3 times for a continuous infinite marquee loop
const infiniteImages = [
  ...baseCarouselImages.map((img, i) => ({ ...img, uniqueKey: `a-${i}` })),
  ...baseCarouselImages.map((img, i) => ({ ...img, uniqueKey: `b-${i}` })),
  ...baseCarouselImages.map((img, i) => ({ ...img, uniqueKey: `c-${i}` })),
]

export default function SportsGallery({ onOpenProject }) {
  const [isPaused, setIsPaused] = useState(false)

  return (
    <section className="py-16 sm:py-24 bg-paper-muted border-t border-charcoal/10 overflow-hidden relative select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 flex items-center justify-between">
        <div>
          <span className="text-[11px] font-sans font-bold tracking-ultra text-copper uppercase block mb-1">
            VISUAL MOMENTS
          </span>
          <h2 className="font-sans font-bold text-2xl sm:text-3xl text-charcoal uppercase tracking-tight">
            FRAME REEL
          </h2>
        </div>

        {/* Auto-scroll Status & Controls */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsPaused(!isPaused)}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-charcoal/15 text-charcoal text-xs font-sans font-bold tracking-wider uppercase hover:bg-charcoal hover:text-white transition-colors shadow-sm"
            aria-label={isPaused ? 'Resume auto-scroll' : 'Pause auto-scroll'}
          >
            {isPaused ? (
              <>
                <Play className="w-3.5 h-3.5 text-copper fill-current" />
                <span>Play</span>
              </>
            ) : (
              <>
                <Pause className="w-3.5 h-3.5 text-copper fill-current" />
                <span>Pause</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Infinite Auto-Scrolling Carousel Ribbon */}
      <div
        className="relative w-full overflow-hidden"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <motion.div
          className="flex gap-4 sm:gap-6 w-max cursor-pointer"
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
              duration: 35,
              ease: 'linear',
            },
          }}
        >
          {infiniteImages.map((item) => (
            <div
              key={item.uniqueKey}
              onClick={() =>
                onOpenProject &&
                onOpenProject({
                  title: item.title,
                  category: item.category,
                  image: item.image,
                  location: 'Sri Lanka',
                  note: 'High-resolution photographic capture from the studio archive.',
                })
              }
              className="flex-shrink-0 w-60 sm:w-72 md:w-80 aspect-[2/3] rounded-md overflow-hidden bg-charcoal relative group shadow-md"
            >
              <img
                src={item.image.src}
                alt={item.title}
                className="w-full h-full object-cover object-center group-hover:scale-105 group-hover:opacity-85 transition-all duration-700 pointer-events-none"
                loading="lazy"
              />
              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/85 via-charcoal/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5 text-paper">
                <span className="text-[10px] font-sans font-bold tracking-widest text-copper-light uppercase mb-1">
                  {item.category}
                </span>
                <span className="font-sans font-bold text-sm text-white uppercase block">
                  {item.title}
                </span>
                <span className="text-[11px] text-paper/80 font-sans tracking-wide mt-1">
                  Click to inspect frame →
                </span>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
