import React from 'react'
import { motion } from 'framer-motion'
import { ArrowUpRight, Facebook, Share2 } from 'lucide-react'
import { socialContent, contact } from '../data/content'
import { socialGrid } from '../data/portfolio'
import SectionHeading from './SectionHeading'
import Figure from './Figure'
import MagneticButton from './MagneticButton'
import { fadeUp, staggerContainer } from '../lib/motion'

export default function SocialGallery({ onOpenProject }) {
  return (
    <section className="py-24 md:py-36 bg-paper-muted border-b border-charcoal/10 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <SectionHeading
            index="07"
            eyebrow={socialContent.eyebrow}
            title="FOLLOW"
            titleItalic="The Frame"
            subtitle={socialContent.body}
            className="mb-0 md:mb-0"
          />

          <MagneticButton
            href={contact.facebookUrl}
            target="_blank"
            rel="noopener noreferrer"
            variant="primary"
            className="gap-2 self-start md:self-end"
            ariaLabel="Follow Tilnogz Photography on Facebook"
          >
            <Facebook className="w-4 h-4 text-white fill-current" />
            <span>{socialContent.ctaText}</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </MagneticButton>
        </div>

        {/* 6 Curated Images Grid */}
        <motion.div
          variants={staggerContainer(0.08, 0.05)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-40px' }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6"
        >
          {socialGrid.map((item, index) => (
            <motion.div
              key={index}
              variants={fadeUp}
              onClick={() => onOpenProject && onOpenProject({
                title: item.title,
                category: item.meta,
                image: item.img,
                location: 'Sri Lanka',
                note: 'Captured on location by Tilnogz Photography. Follow on Facebook for new dispatches.',
              })}
              className="group relative rounded-2xl overflow-hidden bg-white border border-charcoal/10 shadow-sm cursor-pointer"
              data-cursor="view"
            >
              <div className="aspect-square relative overflow-hidden">
                <Figure
                  image={item.img}
                  alt={item.title}
                  className="w-full h-full"
                  imgClassName="group-hover:scale-110 transition-transform duration-700 ease-out"
                />

                {/* Hover Scrim */}
                <div className="absolute inset-0 bg-charcoal/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-3 text-center">
                  <Facebook className="w-5 h-5 text-paper mb-2 transform -translate-y-2 group-hover:translate-y-0 transition-transform duration-300" />
                  <span className="font-sans text-[10px] font-bold tracking-widest text-paper uppercase">
                    VIEW FRAME
                  </span>
                  <span className="font-sans text-[9px] text-paper/70 mt-1">
                    {item.meta}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
