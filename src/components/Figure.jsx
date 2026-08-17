import React, { useState } from 'react'
import { motion } from 'framer-motion'

/**
 * Figure Component
 * Aspect-ratio preserving, lazy-loaded image container with shimmer placeholder
 * and smooth fade-in reveal to prevent layout shifts.
 */
export default function Figure({
  image,
  alt,
  className = '',
  imgClassName = '',
  aspectRatio = 'auto',
  priority = false,
  onClick,
  hoverZoom = true,
  caption,
  cursorType = 'default',
}) {
  const [loaded, setLoaded] = useState(false)
  const src = typeof image === 'string' ? image : image?.src
  const imageAlt = alt || (typeof image === 'object' ? image?.alt : '') || 'Tilnogz Photography'
  const isLowRes = typeof image === 'object' && image?.lowRes

  return (
    <figure
      className={`relative overflow-hidden bg-sand-light/50 ${className}`}
      style={aspectRatio !== 'auto' ? { aspectRatio } : undefined}
      onClick={onClick}
      data-cursor={cursorType}
    >
      {/* Shimmer loading placeholder */}
      {!loaded && (
        <div
          className="absolute inset-0 img-placeholder z-0"
          aria-hidden="true"
        />
      )}

      {/* Actual image with smooth reveal */}
      <img
        src={src}
        alt={imageAlt}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        onLoad={() => setLoaded(true)}
        className={`w-full h-full object-cover transition-all duration-700 ease-out ${
          loaded ? 'opacity-100' : 'opacity-0'
        } ${hoverZoom ? 'hover:scale-[1.03]' : ''} ${
          isLowRes ? 'filter contrast-[1.02]' : ''
        } ${imgClassName}`}
      />

      {caption && (
        <figcaption className="sr-only">{caption}</figcaption>
      )}
    </figure>
  )
}
