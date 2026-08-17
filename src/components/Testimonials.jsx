import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Quote } from 'lucide-react'
import { contact } from '../data/content'
import { useContent } from '../context/ContentContext'
import { fadeUp } from '../lib/motion'

export default function Testimonials() {
  const { content } = useContent()
  const allStories = content?.testimonials || []

  // Only display published testimonials on public site
  const testimonialStories = allStories.filter((t) => t.is_published !== false)

  const [activeMobileStory, setActiveMobileStory] = useState(0)

  const handleMobileScroll = (e) => {
    const container = e.target
    const scrollPosition = container.scrollLeft
    const cardWidth = container.offsetWidth * 0.86
    const newIndex = Math.round(scrollPosition / cardWidth)
    if (newIndex >= 0 && newIndex < testimonialStories.length) {
      setActiveMobileStory(newIndex)
    }
  }

  if (testimonialStories.length === 0) return null

  return (
    <section id="testimonials" className="py-16 sm:py-24 md:py-32 bg-white relative border-t border-charcoal/5 overflow-hidden select-none">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Centered Heading with Bidirectional Fade */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.2 }}
          className="text-center mb-10 sm:mb-16 md:mb-24"
        >
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-charcoal tracking-[0.25em] uppercase font-normal">
            TESTIMONIALS
          </h2>
        </motion.div>

        {/* ======================================================== */}
        {/* MOBILE ONLY: Horizontal Swipeable Testimonial Story Cards*/}
        {/* ======================================================== */}
        <div className="block lg:hidden">
          <div
            onScroll={handleMobileScroll}
            className="flex gap-4 overflow-x-auto no-scrollbar snap-x snap-mandatory px-4 pb-6 -mx-4"
          >
            {testimonialStories.map((story) => {
              const imgSrc = typeof story.image === 'string' ? story.image : story.image?.src || ''
              return (
                <div
                  key={story.id}
                  className="w-[86vw] flex-shrink-0 snap-center bg-[#FAF8F5] border border-charcoal/10 rounded-2xl p-6 shadow-md flex flex-col justify-between"
                >
                  <div>
                    {/* Card Header: Client Photo & Name */}
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-16 h-16 rounded-xl overflow-hidden shadow-sm flex-shrink-0 bg-sand">
                        <img
                          src={imgSrc}
                          alt={story.clientName}
                          className="w-full h-full object-cover object-center"
                          loading="lazy"
                          decoding="async"
                        />
                      </div>
                      <div>
                        <h3 className="font-serif text-lg text-charcoal font-bold tracking-tight">
                          {story.clientName}
                        </h3>
                        <span className="text-[11px] font-sans text-copper font-medium block">
                          {story.service}
                        </span>
                        <span className="text-[10px] font-sans text-charcoal-muted">
                          {story.location}
                        </span>
                      </div>
                    </div>

                    {/* Quote Body */}
                    <div className="relative">
                      <Quote className="w-6 h-6 text-copper/25 absolute -top-2 -left-1 pointer-events-none" />
                      <p className="font-body text-xs sm:text-sm text-charcoal/85 leading-relaxed pl-3 italic">
                        "{story.review}"
                      </p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Mobile Swipe Indicators & Pagination Dots */}
          {testimonialStories.length > 1 && (
            <>
              <div className="flex items-center justify-center gap-2 mt-2">
                {testimonialStories.map((_, idx) => (
                  <span
                    key={idx}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      activeMobileStory === idx
                        ? 'w-6 bg-copper'
                        : 'w-1.5 bg-charcoal/20'
                    }`}
                  />
                ))}
              </div>
              <div className="text-center text-[10px] font-sans text-charcoal-muted mt-2">
                <span>Swipe to read client stories →</span>
              </div>
            </>
          )}
        </div>

        {/* ======================================================== */}
        {/* DESKTOP ONLY: Alternating Testimonials with Scroll Motion */}
        {/* ======================================================== */}
        <div className="hidden lg:block space-y-20 md:space-y-28">
          {testimonialStories.map((story, idx) => {
            const imgSrc = typeof story.image === 'string' ? story.image : story.image?.src || ''
            const isTextLeft = story.layout === 'text-left' || idx % 2 === 0

            return (
              <div
                key={story.id}
                className="grid grid-cols-12 gap-8 lg:gap-12 items-center overflow-hidden"
              >
                {isTextLeft ? (
                  <>
                    {/* Left: Text Area Fading In from Left */}
                    <motion.div
                      initial={{ opacity: 0, x: -60 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: false, amount: 0.2 }}
                      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                      className="col-span-8 flex flex-col justify-center"
                    >
                      <h3 className="font-serif text-2xl text-charcoal font-semibold mb-3">
                        {story.clientName}
                      </h3>
                      <p className="font-body text-base text-charcoal/80 leading-relaxed max-w-[62ch]">
                        {story.review}
                      </p>
                    </motion.div>

                    {/* Right: Image Area Fading In from Right */}
                    <motion.div
                      initial={{ opacity: 0, x: 60 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: false, amount: 0.2 }}
                      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                      className="col-span-4"
                    >
                      <div className="overflow-hidden shadow-md bg-sand-light aspect-[4/3] rounded-sm">
                        <img
                          src={imgSrc}
                          alt={story.clientName}
                          className="w-full h-full object-cover object-center hover:scale-105 transition-transform duration-700"
                          loading="lazy"
                          decoding="async"
                        />
                      </div>
                    </motion.div>
                  </>
                ) : (
                  <>
                    {/* Left: Image Area Fading In from Left */}
                    <motion.div
                      initial={{ opacity: 0, x: -60 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: false, amount: 0.2 }}
                      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                      className="col-span-4"
                    >
                      <div className="overflow-hidden shadow-md bg-sand-light aspect-[4/3] rounded-sm">
                        <img
                          src={imgSrc}
                          alt={story.clientName}
                          className="w-full h-full object-cover object-center hover:scale-105 transition-transform duration-700"
                          loading="lazy"
                          decoding="async"
                        />
                      </div>
                    </motion.div>

                    {/* Right: Text Area Fading In from Right */}
                    <motion.div
                      initial={{ opacity: 0, x: 60 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: false, amount: 0.2 }}
                      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                      className="col-span-8 flex flex-col justify-center"
                    >
                      <h3 className="font-serif text-2xl text-charcoal font-semibold mb-3">
                        {story.clientName}
                      </h3>
                      <p className="font-body text-base text-charcoal/80 leading-relaxed max-w-[62ch]">
                        {story.review}
                      </p>
                    </motion.div>
                  </>
                )}
              </div>
            )
          })}
        </div>

        {/* Centered More Button with Bidirectional Fade */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.2 }}
          className="text-center mt-12 sm:mt-16 md:mt-20"
        >
          <a
            href={contact.facebookUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-8 sm:px-10 py-3 bg-[#555552] hover:bg-charcoal text-white text-xs font-sans font-semibold tracking-widest uppercase transition-colors rounded-sm shadow-sm"
          >
            More
          </a>
        </motion.div>
      </div>
    </section>
  )
}
