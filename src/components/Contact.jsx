import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { MessageSquare, Phone, Send, ArrowUpRight, CheckCircle, Calendar, Sparkles } from 'lucide-react'
import { contactContent, contact, getWhatsAppLink } from '../data/content'
import SectionHeading from './SectionHeading'
import MagneticButton from './MagneticButton'
import { fadeUp } from '../lib/motion'

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    photographyType: 'Sports Photography',
    date: '',
    message: '',
  })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()

    // Formulate a structured inquiry message for WhatsApp
    const structuredMessage = `Hello Tilnogz Photography,
I would like to inquire about a photography booking:
- Name: ${formData.name || 'Not specified'}
- Phone: ${formData.phone || 'Not specified'}
- Discipline: ${formData.photographyType}
- Target Date: ${formData.date || 'Flexible'}
- Details: ${formData.message || 'Standard inquiry'}`

    const waUrl = getWhatsAppLink(structuredMessage)
    window.open(waUrl, '_blank', 'noopener,noreferrer')
    setSubmitted(true)
  }

  return (
    <section id="contact" className="py-24 md:py-36 bg-paper border-b border-charcoal/10 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          index="08"
          eyebrow={contactContent.eyebrow}
          title="LET'S CREATE"
          titleItalic="Something Visual."
          subtitle={contactContent.subtext}
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Direct WhatsApp Card & Studio Info */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-40px' }}
            className="lg:col-span-5 space-y-6"
          >
            {/* Primary WhatsApp Card */}
            <div className="p-8 rounded-3xl bg-charcoal text-paper shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-copper/20 rounded-full blur-2xl pointer-events-none" />

              <span className="font-sans text-[10px] font-bold tracking-ultra text-copper-light uppercase block mb-3">
                DIRECT BOOKING DESK
              </span>

              <h3 className="font-sans text-2xl font-bold mb-2">
                Fastest Communication via WhatsApp
              </h3>

              <p className="font-body text-sm text-paper/80 leading-relaxed mb-6">
                For urgent date reservations, rates, and tournament schedules across Galle, Hikkaduwa, and Colombo.
              </p>

              <div className="mb-6 p-4 rounded-2xl bg-white/10 border border-white/10">
                <span className="font-sans text-[10px] uppercase tracking-wider text-paper/60 block mb-1">
                  OFFICIAL WHATSAPP NUMBER
                </span>
                <span className="font-sans text-xl font-extrabold tracking-wide text-white block">
                  {contact.phone}
                </span>
              </div>

              <MagneticButton
                href={getWhatsAppLink()}
                target="_blank"
                rel="noopener noreferrer"
                variant="copper"
                className="w-full gap-2 py-4 text-xs font-bold"
                ariaLabel="Open WhatsApp directly"
              >
                <MessageSquare className="w-4 h-4" />
                <span>CHAT ON WHATSAPP NOW</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </MagneticButton>
            </div>

            {/* Coverage Locations Pill Box */}
            <div className="p-6 rounded-2xl bg-paper-muted border border-charcoal/10">
              <span className="font-sans text-[10px] font-bold tracking-ultra text-charcoal-muted uppercase block mb-2">
                COVERAGE BASES
              </span>
              <p className="font-sans text-xs font-semibold text-charcoal">
                Galle · Hikkaduwa · Colombo · Southern Province · Sri Lanka
              </p>
            </div>
          </motion.div>

          {/* Right Column: Structured Inquiry Form */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-40px' }}
            className="lg:col-span-7 bg-white p-8 sm:p-10 rounded-3xl border border-charcoal/10 shadow-lg"
          >
            <h3 className="font-sans text-2xl font-bold text-charcoal mb-2">
              Send a Booking Inquiry
            </h3>
            <p className="font-body text-sm text-charcoal-muted mb-8">
              Fill in your session requirements below. Submitting will prepare a pre-filled WhatsApp message.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name & Phone Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="contact-name"
                    className="block font-sans text-xs font-bold uppercase tracking-wider text-charcoal mb-2"
                  >
                    Your Name *
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Ruwan Silva"
                    className="w-full px-4 py-3.5 rounded-xl border border-charcoal/15 bg-paper-card text-charcoal font-sans text-sm focus:outline-none focus:ring-2 focus:ring-copper/40 focus:border-copper transition-all"
                  />
                </div>

                <div>
                  <label
                    htmlFor="contact-phone"
                    className="block font-sans text-xs font-bold uppercase tracking-wider text-charcoal mb-2"
                  >
                    Phone / WhatsApp *
                  </label>
                  <input
                    id="contact-phone"
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+94 7X XXX XXXX"
                    className="w-full px-4 py-3.5 rounded-xl border border-charcoal/15 bg-paper-card text-charcoal font-sans text-sm focus:outline-none focus:ring-2 focus:ring-copper/40 focus:border-copper transition-all"
                  />
                </div>
              </div>

              {/* Photography Type Selector */}
              <div>
                <label
                  htmlFor="contact-discipline"
                  className="block font-sans text-xs font-bold uppercase tracking-wider text-charcoal mb-2"
                >
                  Photography Discipline
                </label>
                <select
                  id="contact-discipline"
                  value={formData.photographyType}
                  onChange={(e) => setFormData({ ...formData, photographyType: e.target.value })}
                  className="w-full px-4 py-3.5 rounded-xl border border-charcoal/15 bg-paper-card text-charcoal font-sans text-sm focus:outline-none focus:ring-2 focus:ring-copper/40 focus:border-copper transition-all cursor-pointer"
                >
                  {contactContent.form.types.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              {/* Preferred Date */}
              <div>
                <label
                  htmlFor="contact-date"
                  className="block font-sans text-xs font-bold uppercase tracking-wider text-charcoal mb-2"
                >
                  Preferred Date / Timeline
                </label>
                <input
                  id="contact-date"
                  type="text"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  placeholder="e.g. Next Month / Specific Weekend"
                  className="w-full px-4 py-3.5 rounded-xl border border-charcoal/15 bg-paper-card text-charcoal font-sans text-sm focus:outline-none focus:ring-2 focus:ring-copper/40 focus:border-copper transition-all"
                />
              </div>

              {/* Message */}
              <div>
                <label
                  htmlFor="contact-message"
                  className="block font-sans text-xs font-bold uppercase tracking-wider text-charcoal mb-2"
                >
                  Session Details & Location
                </label>
                <textarea
                  id="contact-message"
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Describe the venue, number of hours, tournament format, or editorial concept..."
                  className="w-full px-4 py-3.5 rounded-xl border border-charcoal/15 bg-paper-card text-charcoal font-sans text-sm focus:outline-none focus:ring-2 focus:ring-copper/40 focus:border-copper transition-all resize-none"
                />
              </div>

              <MagneticButton
                type="submit"
                variant="primary"
                className="w-full gap-2 py-4 text-xs font-bold"
                ariaLabel="Send Inquiry via WhatsApp"
              >
                <span>SEND INQUIRY VIA WHATSAPP</span>
                <Send className="w-4 h-4" />
              </MagneticButton>

              {submitted && (
                <p className="text-xs text-copper font-sans font-semibold text-center flex items-center justify-center gap-1.5 pt-2">
                  <CheckCircle className="w-4 h-4" />
                  <span>WhatsApp conversation ready. Opening chat...</span>
                </p>
              )}
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
