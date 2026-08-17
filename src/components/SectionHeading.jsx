import React from 'react'
import { motion } from 'framer-motion'
import { fadeUp } from '../lib/motion'

/**
 * SectionHeading
 * Reusable editorial typography header with Swiss alignment and balanced hierarchy.
 */
export default function SectionHeading({
  index,
  eyebrow,
  title,
  titleItalic,
  titleEnd,
  subtitle,
  className = '',
  align = 'left', // 'left' | 'center'
  theme = 'light',
}) {
  const isCenter = align === 'center'

  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-60px' }}
      className={`mb-12 md:mb-16 ${isCenter ? 'text-center mx-auto max-w-3xl' : 'max-w-4xl'} ${className}`}
    >
      <div className={`flex items-center gap-3 mb-4 ${isCenter ? 'justify-center' : ''}`}>
        {index && (
          <span className="font-sans text-xs font-bold tracking-widest text-copper">
            [{index}]
          </span>
        )}
        {eyebrow && (
          <span className="font-sans text-xs uppercase tracking-ultra text-charcoal-muted font-medium">
            {eyebrow}
          </span>
        )}
      </div>

      <h2 className="font-sans text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-charcoal leading-[1.1] mb-6">
        {title}{' '}
        {titleItalic && (
          <span className="font-serif italic font-normal text-charcoal/90 descender-safe">
            {titleItalic}
          </span>
        )}{' '}
        {titleEnd}
      </h2>

      {subtitle && (
        <p className="font-body text-base md:text-lg text-charcoal-muted leading-relaxed max-w-[65ch]">
          {subtitle}
        </p>
      )}
    </motion.div>
  )
}
