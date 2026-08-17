/**
 * Framer Motion Animation Variants & Spring Configurations.
 * Tuned for premium editorial feel: physics-based springs, smooth cubic bezier easings.
 */

export const transitions = {
  spring: {
    type: 'spring',
    stiffness: 100,
    damping: 20,
    mass: 0.8,
  },
  smooth: {
    duration: 0.7,
    ease: [0.25, 0.1, 0.25, 1],
  },
  editorial: {
    duration: 0.9,
    ease: [0.16, 1, 0.3, 1],
  },
  slow: {
    duration: 1.2,
    ease: [0.16, 1, 0.3, 1],
  },
}

export const fadeIn = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: transitions.smooth,
  },
}

export const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: transitions.editorial,
  },
}

export const fadeDown = {
  hidden: { opacity: 0, y: -24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: transitions.editorial,
  },
}

export const scaleReveal = {
  hidden: { opacity: 0, scale: 0.94 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: transitions.editorial,
  },
}

export const imageReveal = {
  hidden: { opacity: 0, scale: 1.06 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 1.1,
      ease: [0.16, 1, 0.3, 1],
    },
  },
}

export const maskReveal = {
  hidden: { clipPath: 'inset(100% 0% 0% 0%)' },
  visible: {
    clipPath: 'inset(0% 0% 0% 0%)',
    transition: {
      duration: 1.0,
      ease: [0.16, 1, 0.3, 1],
    },
  },
}

export const staggerContainer = (staggerDelay = 0.12, delayChildren = 0) => ({
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: staggerDelay,
      delayChildren: delayChildren,
    },
  },
})

export const textLineReveal = {
  hidden: { y: '100%', opacity: 0 },
  visible: {
    y: '0%',
    opacity: 1,
    transition: {
      duration: 0.85,
      ease: [0.16, 1, 0.3, 1],
    },
  },
}

export default {
  transitions,
  fadeIn,
  fadeUp,
  fadeDown,
  scaleReveal,
  imageReveal,
  maskReveal,
  staggerContainer,
  textLineReveal,
}
