import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, HelpCircle, MessageSquare } from 'lucide-react'
import { getWhatsAppLink } from '../data/content'
import { fadeUp, staggerContainer } from '../lib/motion'

const faqs = [
  {
    q: 'How do we book Tilnogz Photography for our wedding in Sri Lanka?',
    a: 'You can book your session by contacting Tharindu Lakshan directly via WhatsApp (+94 78 843 2741) or phone. We recommend reserving your wedding date at least 3 to 6 months in advance to secure availability for your special day.',
  },
  {
    q: 'Do you travel outside Colombo for destination weddings and photoshoots?',
    a: 'Yes, absolutely! Tilnogz Photography travels throughout Sri Lanka including Galle, Kandy, Nuwara Eliya, Bentota, Negombo, and international destination weddings upon request.',
  },
  {
    q: 'When will we receive our final edited photographs and wedding album?',
    a: 'We deliver a curated set of preview highlight photos within 48 to 72 hours so you can share your joy immediately. The complete high-resolution gallery and handcrafted heirloom leather album are delivered within 3 to 4 weeks.',
  },
  {
    q: 'What photography services does Tilnogz Photography offer?',
    a: 'We specialize in Wedding Photography, Pre-Wedding / Engagement shoots, Graduation Portraiture, Vehicle & Automotive rolling shots, High-Velocity Sports Photography, and 4K Cinematic Wedding Highlights.',
  },
  {
    q: 'Can we customize our photography package according to our requirements?',
    a: 'Yes, all our plans are flexible. Whether you need full 2-day wedding and homecoming coverage, drone aerial cinematography, or additional portrait albums, we can tailor a bespoke package just for you.',
  },
]

export default function FAQSection() {
  const [openIdx, setOpenIdx] = useState(null)

  const toggle = (idx) => {
    setOpenIdx(openIdx === idx ? null : idx)
  }

  return (
    <section id="faq" className="py-16 sm:py-24 md:py-32 bg-white relative border-t border-charcoal/5 overflow-hidden select-none">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.2 }}
          className="text-center mb-10 sm:mb-14"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sand/60 text-copper font-sans font-semibold text-xs tracking-wider uppercase mb-3">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Got Questions?</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-charcoal tracking-[0.18em] uppercase font-normal mb-3">
            FREQUENTLY ASKED QUESTIONS
          </h2>
          <p className="text-xs sm:text-sm font-sans text-charcoal-muted max-w-xl mx-auto">
            Everything you need to know about booking, coverage across Sri Lanka, and our delivery process.
          </p>
        </motion.div>

        {/* Accordion List */}
        <motion.div
          variants={staggerContainer(0.08, 0.04)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.15 }}
          className="space-y-3.5 sm:space-y-4"
        >
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx
            return (
              <motion.div
                key={idx}
                variants={fadeUp}
                className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                  isOpen
                    ? 'border-copper/40 bg-sand/20 shadow-md'
                    : 'border-charcoal/10 bg-[#FAF8F5] hover:border-charcoal/20'
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggle(idx)}
                  className="w-full px-5 sm:px-7 py-4 sm:py-5 flex items-center justify-between text-left gap-4"
                  aria-expanded={isOpen}
                >
                  <span className="font-sans font-bold text-sm sm:text-base text-charcoal tracking-wide">
                    {faq.q}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-copper flex-shrink-0 transition-transform duration-300 ${
                      isOpen ? 'rotate-180' : 'rotate-0'
                    }`}
                  />
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 sm:px-7 pb-5 pt-1 text-xs sm:text-sm font-sans text-charcoal/80 leading-relaxed border-t border-charcoal/5">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Quick Contact Prompt */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.2 }}
          className="mt-10 sm:mt-14 text-center bg-[#FAF8F5] p-6 sm:p-8 rounded-2xl border border-charcoal/10"
        >
          <h3 className="font-serif text-lg sm:text-xl text-charcoal font-bold mb-2">
            Have a custom enquiry or specific date in mind?
          </h3>
          <p className="text-xs sm:text-sm text-charcoal-muted font-sans mb-4 max-w-md mx-auto">
            Reach out directly to Tharindu Lakshan for immediate assistance and bespoke wedding quotes.
          </p>
          <a
            href={getWhatsAppLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-charcoal text-white hover:bg-copper transition-all duration-300 font-sans font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-lg"
          >
            <MessageSquare className="w-4 h-4 text-emerald-400" />
            <span>Chat on WhatsApp (+94 78 843 2741)</span>
          </a>
        </motion.div>
      </div>
    </section>
  )
}
