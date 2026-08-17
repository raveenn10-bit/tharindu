import React from 'react'
import { motion } from 'framer-motion'
import { Maximize2, Compass, Layers, Sliders } from 'lucide-react'
import { architectureSectionContent } from '../data/content'
import { architectureSet } from '../data/portfolio'
import SectionHeading from './SectionHeading'
import Figure from './Figure'
import { fadeUp, staggerContainer } from '../lib/motion'

export default function Architecture({ onOpenProject }) {
  return (
    <section id="architecture" className="py-24 md:py-36 bg-paper border-b border-charcoal/10 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          index="04"
          eyebrow={architectureSectionContent.eyebrow}
          title="ARCHITECTURE"
          titleItalic="Lines, Form & Space"
          subtitle={architectureSectionContent.description}
        />

        {/* 3 Large Architectural Study Panels */}
        <motion.div
          variants={staggerContainer(0.15, 0.1)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8 sm:gap-10"
        >
          {architectureSet.map((item, index) => (
            <motion.div
              key={item.id}
              variants={fadeUp}
              onClick={() => onOpenProject && onOpenProject({
                ...item,
                camera: 'Sony Alpha Series · Prime Optics',
                discipline: 'Architectural Studies',
                location: 'Sri Lanka',
              })}
              className="group cursor-pointer flex flex-col justify-between"
              data-cursor="view"
            >
              <div className="relative rounded-2xl overflow-hidden bg-sand-light border border-charcoal/10 shadow-sm group-hover:shadow-xl transition-all duration-700 mb-6">
                <div className="aspect-[3/4] relative overflow-hidden">
                  <Figure
                    image={item.image}
                    alt={item.title}
                    className="w-full h-full"
                    imgClassName="group-hover:scale-[1.03] transition-transform duration-1000 ease-out filter grayscale-[20%] group-hover:grayscale-0"
                  />
                </div>

                {/* Concept Label */}
                <div className="absolute top-4 left-4 bg-paper/90 backdrop-blur-md px-3 py-1 rounded-full border border-charcoal/10">
                  <span className="font-sans text-[10px] font-bold tracking-widest text-charcoal uppercase">
                    {item.concept}
                  </span>
                </div>

                {/* Expand Icon */}
                <div className="absolute bottom-4 right-4 w-9 h-9 rounded-full bg-charcoal/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-md">
                  <Maximize2 className="w-4 h-4" />
                </div>
              </div>

              {/* Editorial Description */}
              <div className="border-t border-charcoal/10 pt-4">
                <span className="font-sans text-[10px] font-bold tracking-ultra text-copper uppercase block mb-1">
                  {item.subtitle}
                </span>
                <h3 className="font-sans text-xl font-bold text-charcoal group-hover:text-copper transition-colors mb-2">
                  {item.title}
                </h3>
                <p className="font-body text-xs text-charcoal-muted leading-relaxed">
                  {item.note}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Studio Architectural Principle Banner */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mt-16 sm:mt-20 p-8 sm:p-12 rounded-3xl bg-white border border-charcoal/10 shadow-sm flex flex-col md:flex-row items-center justify-between gap-8"
        >
          <div className="max-w-xl">
            <span className="font-sans text-[10px] font-bold tracking-ultra text-copper uppercase block mb-2">
              SPATIAL PHILOSOPHY
            </span>
            <h4 className="font-sans text-2xl font-bold text-charcoal mb-3">
              Measured, Level & Patient with Ambient Light
            </h4>
            <p className="font-body text-sm text-charcoal-muted leading-relaxed">
              We photograph colonial architecture and contemporary interiors with rigorous attention to vertical lines, natural highlights, and textures that endure.
            </p>
          </div>

          <div className="flex items-center gap-6 sm:gap-8 border-t sm:border-t-0 sm:border-l border-charcoal/10 pt-6 sm:pt-0 sm:pl-8 w-full md:w-auto">
            <div>
              <span className="font-sans text-2xl sm:text-3xl font-extrabold text-charcoal block">
                100%
              </span>
              <span className="font-sans text-[10px] text-charcoal-muted tracking-wider uppercase font-semibold">
                Orthogonal Geometry
              </span>
            </div>
            <div>
              <span className="font-sans text-2xl sm:text-3xl font-extrabold text-charcoal block">
                Natural
              </span>
              <span className="font-sans text-[10px] text-charcoal-muted tracking-wider uppercase font-semibold">
                Ambient Lighting
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
