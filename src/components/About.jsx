import React from 'react'
import { motion } from 'framer-motion'
import { getWhatsAppLink } from '../data/content'

export default function About() {
  return (
    <section id="about" className="py-16 sm:py-24 md:py-32 bg-white relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 lg:gap-16 items-center">
          {/* Left Column: Portrait Photo Fading In when scrolling into view, fading out when scrolling out */}
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

          {/* Right Column: Texts Fading In from Right when scrolling down, out when scrolling up */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.08 }}
            className="lg:col-span-7 flex flex-col justify-center text-left"
          >
            <h2 className="font-sans font-extrabold text-2xl sm:text-3xl md:text-4xl text-charcoal tracking-wider uppercase mb-6 sm:mb-8">
              TILNOGZ PHOTOGRAPHY
            </h2>

            <div className="space-y-4 sm:space-y-6 text-charcoal/80 font-body text-sm sm:text-base md:text-[17px] leading-relaxed mb-8 sm:mb-10">
              <p>
                I’m <strong className="text-charcoal font-semibold">Tharindu Lakshan</strong>, An Artist. A Photographer. The photographer in me finds moments everywhere, be it tucked in a little quiet corner or sprawling across an ocean of human emotions, sports adrenaline, and architectural heritage.
              </p>
              <p>
                My approach to photography in Sri Lanka is deeply personal. A shoot is made up of hundreds of intimate interactions, bursting with matchless emotions and decisive split-seconds. So, I pick these precious moments from the fabric of reality and craft them into your very own story, one thriving with authentic colours and feelings that tug at your heartstrings.
              </p>
              <p>
                From sports tournaments and architectural spaces in my hometown, to lifestyle and editorial shoots across Galle, Hikkaduwa, and Colombo, my work speaks of energy, togetherness, and precision.
              </p>
            </div>

            {/* Simple rectangular More button */}
            <div>
              <a
                href={getWhatsAppLink('Hello Tharindu, I would like to learn more about Tilnogz Photography services.')}
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
