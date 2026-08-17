import React, { useRef } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { useReducedMotion, useIsTouch } from '../lib/hooks'

/**
 * MagneticButton
 * Physics-based micro-interaction button using Framer Motion springs.
 */
export default function MagneticButton({
  children,
  className = '',
  onClick,
  href,
  target,
  rel,
  strength = 20,
  variant = 'primary', // 'primary' | 'secondary' | 'outline' | 'ghost'
  type = 'button',
  ariaLabel,
}) {
  const ref = useRef(null)
  const prefersReducedMotion = useReducedMotion()
  const isTouch = useIsTouch()

  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const springConfig = { damping: 15, stiffness: 150, mass: 0.1 }
  const springX = useSpring(x, springConfig)
  const springY = useSpring(y, springConfig)

  const handleMouseMove = (e) => {
    if (prefersReducedMotion || isTouch || !ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    const distanceX = (e.clientX - centerX) / (rect.width / 2)
    const distanceY = (e.clientY - centerY) / (rect.height / 2)

    x.set(distanceX * strength)
    y.set(distanceY * strength)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  // Base styling variants
  const variantStyles = {
    primary:
      'bg-charcoal text-paper hover:bg-copper border border-charcoal hover:border-copper shadow-sm',
    secondary:
      'bg-white text-charcoal hover:bg-charcoal hover:text-white border border-sand shadow-sm',
    outline:
      'bg-transparent text-charcoal border border-charcoal/30 hover:border-charcoal hover:bg-charcoal hover:text-white',
    copper:
      'bg-copper text-white hover:bg-copper-dark border border-copper hover:border-copper-dark shadow-sm',
    ghost:
      'bg-transparent text-charcoal hover:text-copper',
  }

  const commonProps = {
    ref,
    onMouseMove: handleMouseMove,
    onMouseLeave: handleMouseLeave,
    style: prefersReducedMotion || isTouch ? undefined : { x: springX, y: springY },
    className: `inline-flex items-center justify-center font-sans text-xs tracking-wider uppercase font-semibold transition-colors duration-300 select-none px-6 py-3.5 rounded-full ${variantStyles[variant] || variantStyles.primary} ${className}`,
    'aria-label': ariaLabel,
  }

  if (href) {
    return (
      <motion.a
        href={href}
        target={target}
        rel={rel}
        onClick={onClick}
        whileTap={{ scale: 0.97 }}
        {...commonProps}
      >
        {children}
      </motion.a>
    )
  }

  return (
    <motion.button
      type={type}
      onClick={onClick}
      whileTap={{ scale: 0.97 }}
      {...commonProps}
    >
      {children}
    </motion.button>
  )
}
