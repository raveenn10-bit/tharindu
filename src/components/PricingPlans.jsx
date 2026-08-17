import React from 'react'
import { motion } from 'framer-motion'
import { Check, ArrowUpRight, Sparkles } from 'lucide-react'
import { getWhatsAppLink } from '../data/content'
import { fadeUp, staggerContainer } from '../lib/motion'

const plans = [
  {
    id: 'essential',
    name: 'ESSENTIAL',
    subtitle: 'Portraits & Individual Sessions',
    badge: 'FOCUSED SESSION',
    isPopular: false,
    description:
      'Tailored for personal branding, athlete portraits, single architectural sites, or lifestyle shoots.',
    features: [
      'Up to 2 Hours On-Location Coverage',
      '25+ Master Color-Graded Deliverables',
      'Pre-Shoot Creative Consultation',
      'High-Resolution Digital Web Gallery',
      '5-Day Standard Turnaround',
      'Personal & Social Usage Rights',
    ],
    inquiryMessage:
      'Hello Tilnogz Photography, I would like to inquire about the ESSENTIAL photography plan.',
  },
  {
    id: 'signature',
    name: 'SIGNATURE',
    subtitle: 'Sports Tournaments & Events',
    badge: 'MOST POPULAR',
    isPopular: true,
    description:
      'Our most requested coverage for sports fixtures, architectural portfolios, and luxury event storytelling.',
    features: [
      'Up to 5 Hours Extended On-Location Coverage',
      '75+ Master Processed & Retouched Deliverables',
      'Multi-Angle High-Velocity Action Captures',
      '48-Hour Priority Highlight Teaser Set',
      'Full Commercial & Editorial Rights',
      'Private High-Speed Cloud Delivery',
    ],
    inquiryMessage:
      'Hello Tilnogz Photography, I would like to inquire about the SIGNATURE photography plan.',
  },
  {
    id: 'bespoke',
    name: 'BESPOKE',
    subtitle: 'Full-Day Commercial & Multi-Location',
    badge: 'COMPREHENSIVE SUITE',
    isPopular: false,
    description:
      'Complete creative commission for multi-day sporting events, architectural monographs, or commercial features.',
    features: [
      'Full-Day Multi-Location Dedicated Coverage',
      '150+ Master Color-Graded Deliverables',
      'Dedicated Creative Direction & Lighting Setup',
      '24-Hour Express Teaser Deliverables',
      'Complete High-Res Processed Archive',
      'Full Commercial, Print & Social Licensing',
    ],
    inquiryMessage:
      'Hello Tilnogz Photography, I would like to inquire about the BESPOKE photography plan.',
  },
]

export default function PricingPlans() {
  return (
    <section id="plans" className="py-16 sm:py-24 md:py-32 bg-paper border-t border-charcoal/10 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header with Bidirectional Fade */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.2 }}
          className="text-center max-w-3xl mx-auto mb-12 sm:mb-16 md:mb-20"
        >
          <span className="text-[11px] font-sans font-bold tracking-ultra text-copper uppercase block mb-3">
            CURATED PACKAGES
          </span>
          <h2 className="font-sans font-extrabold text-2xl sm:text-4xl md:text-5xl text-charcoal tracking-tight uppercase">
            PLANS & INVESTMENT
          </h2>
          <div className="w-12 h-[2px] bg-copper mx-auto mt-4 mb-4" />
          <p className="font-body text-xs sm:text-sm md:text-base text-charcoal-muted max-w-xl mx-auto">
            Transparent, tailored packages crafted to capture decisive moments, architectural lines, and authentic visual stories across Sri Lanka.
          </p>
        </motion.div>

        {/* 3 Plans Grid with Staggered Bidirectional Fade */}
        <motion.div
          variants={staggerContainer(0.12, 0.04)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.15 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 items-stretch"
        >
          {plans.map((plan) => {
            const isPopular = plan.isPopular

            return (
              <motion.div
                key={plan.id}
                variants={fadeUp}
                className={`relative flex flex-col justify-between p-6 sm:p-8 md:p-10 rounded-2xl transition-all duration-300 ${
                  isPopular
                    ? 'bg-charcoal text-paper shadow-2xl border-2 border-copper scale-[1.02] md:-translate-y-2'
                    : 'bg-white text-charcoal border border-charcoal/10 shadow-sm hover:shadow-lg'
                }`}
              >
                {/* Popular Pill Badge */}
                {isPopular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-copper text-white text-[10px] font-sans font-bold tracking-widest uppercase px-4 py-1 rounded-full shadow-md flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3 fill-current" />
                    <span>{plan.badge}</span>
                  </div>
                )}

                <div>
                  {/* Card Header */}
                  <div className="mb-6">
                    {!isPopular && (
                      <span className="text-[10px] font-sans font-bold tracking-widest text-copper uppercase block mb-1">
                        {plan.badge}
                      </span>
                    )}
                    <h3 className="font-sans font-extrabold text-xl sm:text-2xl md:text-3xl tracking-tight uppercase">
                      {plan.name}
                    </h3>
                    <p className={`text-xs font-sans mt-1 ${isPopular ? 'text-paper/70' : 'text-charcoal-muted'}`}>
                      {plan.subtitle}
                    </p>
                  </div>

                  <p className={`font-body text-xs sm:text-sm leading-relaxed mb-6 sm:mb-8 ${isPopular ? 'text-paper/85' : 'text-charcoal/80'}`}>
                    {plan.description}
                  </p>

                  <div className={`w-full h-[1px] mb-6 sm:mb-8 ${isPopular ? 'bg-paper/15' : 'bg-charcoal/10'}`} />

                  {/* Features List */}
                  <ul className="space-y-3 sm:space-y-3.5 mb-8 sm:mb-10">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 sm:gap-3 text-xs sm:text-[13px] font-sans">
                        <div className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                          isPopular ? 'bg-copper text-white' : 'bg-sand text-charcoal'
                        }`}>
                          <Check className="w-2.5 h-2.5 stroke-[3]" />
                        </div>
                        <span className={isPopular ? 'text-paper/90' : 'text-charcoal/85'}>
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* CTA Button */}
                <a
                  href={getWhatsAppLink(plan.inquiryMessage)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center justify-center gap-2 w-full py-3.5 sm:py-4 text-xs font-sans font-bold tracking-widest uppercase transition-all duration-300 rounded-sm shadow-md ${
                    isPopular
                      ? 'bg-copper text-white hover:bg-copper-dark'
                      : 'bg-charcoal text-paper hover:bg-copper'
                  }`}
                >
                  <span>Book via WhatsApp</span>
                  <ArrowUpRight className="w-4 h-4" />
                </a>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
