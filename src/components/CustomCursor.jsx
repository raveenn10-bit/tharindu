import React, { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import { useReducedMotion, useIsTouch } from '../lib/hooks'

/**
 * CustomCursor Component
 * Editorial desktop cursor with dynamic states (Default dot, Expanded 'VIEW', 'DRAG').
 * Automatically disabled on touch screens and under reduced-motion settings.
 */
export default function CustomCursor() {
  const prefersReducedMotion = useReducedMotion()
  const isTouch = useIsTouch()
  const [cursorState, setCursorState] = useState({
    type: 'default', // 'default' | 'view' | 'drag' | 'link'
    text: '',
    visible: false,
  })

  const mouseX = useMotionValue(-100)
  const mouseY = useMotionValue(-100)

  const springConfig = { damping: 28, stiffness: 350, mass: 0.2 }
  const cursorX = useSpring(mouseX, springConfig)
  const cursorY = useSpring(mouseY, springConfig)

  useEffect(() => {
    if (prefersReducedMotion || isTouch) return

    const handleMouseMove = (e) => {
      mouseX.set(e.clientX)
      mouseY.set(e.clientY)
      if (!cursorState.visible) {
        setCursorState((prev) => ({ ...prev, visible: true }))
      }

      // Check cursor data attribute on target or parent
      const target = e.target.closest('[data-cursor]')
      if (target) {
        const cursorType = target.getAttribute('data-cursor')
        if (cursorType === 'project' || cursorType === 'view') {
          setCursorState({ type: 'view', text: 'VIEW', visible: true })
        } else if (cursorType === 'drag') {
          setCursorState({ type: 'drag', text: 'DRAG', visible: true })
        } else if (cursorType === 'link') {
          setCursorState({ type: 'link', text: '', visible: true })
        }
      } else {
        const isInteractive = e.target.closest('a, button, input, textarea, select, [role="button"]')
        if (isInteractive) {
          setCursorState({ type: 'link', text: '', visible: true })
        } else {
          setCursorState({ type: 'default', text: '', visible: true })
        }
      }
    }

    const handleMouseLeave = () => {
      setCursorState((prev) => ({ ...prev, visible: false }))
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    document.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [prefersReducedMotion, isTouch, mouseX, mouseY, cursorState.visible])

  if (prefersReducedMotion || isTouch || !cursorState.visible) {
    return null
  }

  const isExpanded = cursorState.type === 'view' || cursorState.type === 'drag'
  const isLink = cursorState.type === 'link'

  return (
    <motion.div
      className="pointer-events-none fixed top-0 left-0 z-50 flex items-center justify-center -translate-x-1/2 -translate-y-1/2 select-none"
      style={{
        x: cursorX,
        y: cursorY,
      }}
    >
      <motion.div
        animate={{
          width: isExpanded ? 76 : isLink ? 36 : 12,
          height: isExpanded ? 76 : isLink ? 36 : 12,
          backgroundColor: isExpanded
            ? 'rgba(17, 17, 17, 0.92)'
            : isLink
            ? 'rgba(196, 112, 79, 0.25)'
            : 'rgba(17, 17, 17, 0.85)',
          borderColor: isExpanded ? 'rgba(250, 248, 245, 0.2)' : isLink ? 'rgba(196, 112, 79, 0.6)' : 'transparent',
          borderWidth: isExpanded || isLink ? 1 : 0,
        }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="flex items-center justify-center rounded-full backdrop-blur-[2px] shadow-sm text-center"
      >
        {isExpanded && (
          <motion.span
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.6 }}
            className="font-sans text-[10px] font-bold tracking-widest text-paper uppercase"
          >
            {cursorState.text}
          </motion.span>
        )}
      </motion.div>
    </motion.div>
  )
}
