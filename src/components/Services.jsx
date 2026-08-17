import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowUpRight, CheckCircle2 } from 'lucide-react'
import { servicesList, getWhatsAppLink } from '../data/content'
import { portfolio } from '../data/portfolio'
import SectionHeading from './SectionHeading'
import Figure from './Figure'
import MagneticButton from './MagneticButton'

export default function Services({ onOpenProject }) {
  const [activeService, setActiveService] = useState(0)

  return (
    <section id="services" className="py-24 md:py-36 bg-paper-muted border-b border-charcoal/10 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          index="01"
          eyebrow="SERVICES & EXPERTISE"
          title="DISCIPLINES OF"
          titleItalic="Light & Motion"
          subtitle="Specialized photography solutions crafted for sports tournaments, architectural spaces, bespoke events, and editorial features across Sri Lanka."
        />

        {/* Desktop Split Layout: Interactive Rows on Left, Dynamic Preview Image on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Services List */}
          <div className="lg:col-span-7 space-y-4">
            {servicesList.map((service, index) => {
              const isActive = activeService === index
              const previewImg = portfolio.servicePreviews[service.id]

              return (
                <motion.div
                  key={service.id}
                  onMouseEnter={() => setActiveService(index)}
                  onClick={() => setActiveService(index)}
                  className={`p-6 sm:p-8 rounded-2xl transition-all duration-300 cursor-pointer border ${
                    isActive
                      ? 'bg-white border-charcoal/20 shadow-md translate-x-1'
                      : 'bg-white/40 border-charcoal/5 hover:bg-white/80 hover:border-charcoal/10'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex items-baseline gap-4">
                      <span className="font-sans text-xs font-bold tracking-widest text-copper">
                        {service.index}
                      </span>
                      <h3 className="font-sans text-xl sm:text-2xl font-bold tracking-tight text-charcoal">
                        {service.title}
                      </h3>
                    </div>

                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                        isActive ? 'bg-charcoal text-paper' : 'bg-sand-light text-charcoal'
                      }`}
                    >
                      <ArrowUpRight className="w-4 h-4" />
                    </div>
                  </div>

                  <p className="font-body text-sm sm:text-base text-charcoal-muted leading-relaxed mb-4 pl-8">
                    {service.description}
                  </p>

                  <div className="pl-8 flex items-center gap-2 text-xs font-sans text-charcoal/70 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5 text-copper" />
                    <span>{service.details}</span>
                  </div>

                  {/* Mobile Inline Image Preview */}
                  <div className="block lg:hidden mt-4 pl-8">
                    {previewImg && (
                      <div className="rounded-xl overflow-hidden h-48 sm:h-60 border border-charcoal/10 shadow-sm">
                        <Figure
                          image={previewImg}
                          alt={service.title}
                          className="w-full h-full"
                          aspectRatio="16/9"
                        />
                      </div>
                    )}
                  </div>
                </motion.div>
              )
            })}
          </div>

          {/* Desktop Sticky Image Preview Card */}
          <div className="hidden lg:block lg:col-span-5 sticky top-28">
            <div className="bg-white p-4 rounded-2xl border border-charcoal/10 shadow-lg">
              <div className="relative rounded-xl overflow-hidden aspect-[4/5] bg-sand-light">
                <AnimatePresence mode="wait">
                  {portfolio.servicePreviews[servicesList[activeService].id] && (
                    <motion.div
                      key={servicesList[activeService].id}
                      initial={{ opacity: 0, scale: 1.04 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                      className="w-full h-full"
                    >
                      <Figure
                        image={portfolio.servicePreviews[servicesList[activeService].id]}
                        alt={servicesList[activeService].title}
                        className="w-full h-full"
                        aspectRatio="4/5"
                        hoverZoom={false}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Overlaid Pill Badge */}
                <div className="absolute top-4 left-4 bg-paper/90 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-charcoal/10">
                  <span className="font-sans text-[11px] font-bold tracking-widest text-charcoal uppercase">
                    {servicesList[activeService].category}
                  </span>
                </div>
              </div>

              <div className="p-4 pt-5 flex items-center justify-between">
                <div>
                  <span className="font-sans text-[10px] font-bold tracking-ultra text-copper uppercase block">
                    INQUIRE ABOUT THIS DISCIPLINE
                  </span>
                  <span className="font-sans font-bold text-sm text-charcoal">
                    {servicesList[activeService].title}
                  </span>
                </div>

                <MagneticButton
                  href={getWhatsAppLink(`Hello Tilnogz Photography, I would like to inquire about ${servicesList[activeService].title}.`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="primary"
                  className="text-xs py-2 px-4"
                >
                  <span>INQUIRE</span>
                </MagneticButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
