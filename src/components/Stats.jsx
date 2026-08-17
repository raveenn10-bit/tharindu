import React from 'react'
import { motion } from 'framer-motion'
import { statsList } from '../data/content'
import { fadeUp, staggerContainer } from '../lib/motion'

export default function Stats() {
  return (
    <section className="py-20 sm:py-28 bg-paper-muted border-b border-charcoal/10 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={staggerContainer(0.12, 0.05)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-40px' }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8"
        >
          {statsList.map((stat, index) => (
            <motion.div
              key={stat.label}
              variants={fadeUp}
              className="p-6 sm:p-8 rounded-2xl bg-white border border-charcoal/10 shadow-sm flex flex-col justify-between"
            >
              <div>
                <span className="font-sans text-[10px] font-bold tracking-ultra text-copper uppercase block mb-3">
                  {stat.note}
                </span>

                <div className="font-sans font-extrabold text-3xl sm:text-4xl md:text-5xl tracking-tight text-charcoal mb-2">
                  {stat.display}
                </div>
              </div>

              <div className="border-t border-charcoal/10 pt-3 mt-4">
                <span className="font-sans text-xs font-bold tracking-wider text-charcoal-muted uppercase block">
                  {stat.label}
                </span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
