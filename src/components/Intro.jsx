import React from 'react'
import { motion } from 'framer-motion'
import { introContent } from '../data/content'
import { fadeUp, staggerContainer } from '../lib/motion'

export default function Intro() {
  return (
    <section id="intro" className="py-24 md:py-36 bg-paper border-b border-charcoal/10 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Eyebrow / Left Column */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-40px' }}
            className="lg:col-span-4"
          >
            <div className="flex items-center gap-3 mb-3">
              <span className="w-8 h-[1.5px] bg-copper" />
              <span className="font-sans text-xs font-bold tracking-ultra text-copper uppercase">
                {introContent.eyebrow}
              </span>
            </div>
            <p className="font-body text-sm text-charcoal-muted max-w-xs leading-relaxed">
              Every frame is grounded in reading the natural light, honoring architectural geometry, and capturing human action.
            </p>
          </motion.div>

          {/* Main Statement / Right Column */}
          <motion.div
            variants={staggerContainer(0.12, 0.1)}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-40px' }}
            className="lg:col-span-8"
          >
            <h2 className="font-sans font-extrabold text-3xl sm:text-5xl md:text-6xl lg:text-7xl tracking-tight text-charcoal leading-[1.05] mb-8">
              {introContent.titleLines[0]}
              <br />
              <span className="font-serif italic font-normal text-charcoal/85 tracking-normal descender-safe">
                {introContent.titleLines[1]}
              </span>
            </h2>

            <p className="font-body text-lg md:text-xl text-charcoal/80 leading-relaxed max-w-[56ch] mb-8">
              {introContent.paragraph}
            </p>

            <div className="pt-8 border-t border-charcoal/10 flex flex-wrap items-center justify-between gap-6 text-xs text-charcoal-muted font-sans font-medium uppercase tracking-wider">
              <span>SPORTS PHOTOGRAPHY</span>
              <span>·</span>
              <span>ARCHITECTURAL STUDIES</span>
              <span>·</span>
              <span>EVENT COVERAGE</span>
              <span>·</span>
              <span>EDITORIAL SESSIONS</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
