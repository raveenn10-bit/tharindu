import React from 'react'
import { motion } from 'framer-motion'
import { MapPin, Heart, Sparkles, GraduationCap, Car, Trophy } from 'lucide-react'
import { getWhatsAppLink } from '../data/content'

const servicesData = [
  {
    id: 1,
    name: 'Wedding Photography',
    desc: 'Ceremony & Grand Storytelling',
    icon: Sparkles,
  },
  {
    id: 2,
    name: 'Pre-Wedding / Engagement',
    desc: 'Romantic & Creative Concepts',
    icon: Heart,
  },
  {
    id: 3,
    name: 'Graduation Photography',
    desc: 'Milestones & Achievements',
    icon: GraduationCap,
  },
  {
    id: 4,
    name: 'Vehicle Photography',
    desc: 'Automotive & Rolling Shots',
    icon: Car,
  },
  {
    id: 5,
    name: 'Sports Photography',
    desc: 'High-Velocity Action & Speed',
    icon: Trophy,
  },
]

export default function About() {
  return (
    <section id="about" className="py-16 sm:py-24 md:py-32 bg-white relative overflow-hidden select-none">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 lg:gap-16 items-center">
          {/* Left Column: Portrait Photo with Bidirectional Scroll Animation */}
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 flex justify-center"
          >
            <div className="relative mx-auto max-w-xs sm:max-w-sm md:max-w-md lg:max-w-none w-full">
              <div className="rounded-2xl overflow-hidden bg-gradient-to-b from-[#F5F3EE] to-white p-3 sm:p-5 border border-charcoal/10 shadow-[0_12px_40px_rgba(0,0,0,0.06)] flex justify-center">
                <img
                  src="/photos/tharindu-portrait.png"
                  alt="Tharindu Lakshan - Tilnogz Photography"
                  className="w-auto max-h-[380px] sm:max-h-[480px] md:max-h-[540px] object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.12)] hover:scale-105 transition-transform duration-700"
                  loading="lazy"
                  decoding="async"
                />
              </div>
            </div>
          </motion.div>

          {/* Right Column: Content & 5 Services */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.08 }}
            className="lg:col-span-7 flex flex-col justify-center text-left"
          >
            <h2 className="font-sans font-extrabold text-2xl sm:text-3xl md:text-4xl text-charcoal tracking-wider uppercase mb-2">
              TILNOGZ PHOTOGRAPHY
            </h2>

            {/* Address Badge */}
            <div className="flex items-center gap-1.5 text-copper font-sans font-semibold text-xs tracking-wider uppercase mb-5">
              <MapPin className="w-4 h-4" />
              <span>Address: Colombo 7, Sri Lanka</span>
            </div>

            {/* 5 Services Badges Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-6">
              {servicesData.map((svc) => {
                const IconComponent = svc.icon
                return (
                  <div
                    key={svc.id}
                    className="flex items-center gap-3 p-2.5 sm:p-3 rounded-xl bg-[#FAF8F5] border border-charcoal/5 hover:border-copper/30 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-lg bg-sand flex items-center justify-center flex-shrink-0 text-copper">
                      <IconComponent className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-sans font-bold text-xs sm:text-[13px] text-charcoal tracking-tight">
                        {svc.name}
                      </h4>
                      <span className="text-[10px] text-charcoal-muted font-sans block">
                        {svc.desc}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="space-y-3 sm:space-y-4 text-charcoal/80 font-body text-xs sm:text-sm md:text-base leading-relaxed mb-6 sm:mb-8">
              <p>
                I’m <strong className="text-charcoal font-semibold">Tharindu Lakshan</strong>, An Artist. A Photographer. Based at <strong className="text-charcoal font-medium">Colombo 7</strong>, the photographer in me finds decisive moments everywhere — across love stories, academic triumphs, high-velocity sports, and automotive precision.
              </p>
              <p>
                My approach to photography across Sri Lanka is deeply personal. A shoot is made up of hundreds of intimate interactions, bursting with matchless emotions. I capture these precious moments and craft them into your very own story.
              </p>
            </div>

            {/* More CTA Button */}
            <div>
              <a
                href={getWhatsAppLink('Hello Tharindu, I would like to inquire about your photography services.')}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-8 sm:px-10 py-3 sm:py-3.5 bg-[#555552] hover:bg-charcoal text-white text-xs font-sans font-semibold tracking-widest uppercase transition-colors rounded-sm shadow-sm"
              >
                More
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
