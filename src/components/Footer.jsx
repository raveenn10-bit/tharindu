import React from 'react'
import { motion } from 'framer-motion'
import { Facebook, Youtube, MessageSquare, MapPin, Lock } from 'lucide-react'
import { contact, getWhatsAppLink, brand } from '../data/content'
import Logo from './Logo'
import { fadeUp, staggerContainer } from '../lib/motion'

export default function Footer({ onOpenAdmin }) {
  return (
    <footer className="bg-[#FAF8F5] text-charcoal py-14 sm:py-16 md:py-20 border-t border-charcoal/10 overflow-hidden select-none">
      <motion.div
        variants={staggerContainer(0.08, 0.04)}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.15 }}
        className="max-w-4xl mx-auto px-4 text-center"
      >
        {/* Centered Logo */}
        <motion.div variants={fadeUp} className="mb-6 flex justify-center">
          <Logo className="h-9 sm:h-10 md:h-12 w-auto" />
        </motion.div>

        {/* Centered Social Icons (Original Branded Vectors with Luxury Micro-Interactions) */}
        <motion.div variants={fadeUp} className="flex items-center justify-center gap-4 sm:gap-6 mb-6 sm:mb-8">
          {/* Official Facebook */}
          <a
            href={contact.facebookUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 rounded-full border border-charcoal/15 bg-white text-charcoal/80 hover:text-[#1877F2] hover:border-[#1877F2]/40 hover:bg-[#1877F2]/5 transition-all duration-300 flex items-center justify-center shadow-sm hover:scale-110 active:scale-95 group"
            aria-label="Tilnogz Photography Official Facebook Page"
            title="Follow Tilnogz Photography on Facebook"
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current transition-transform duration-300 group-hover:scale-105" aria-hidden="true">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
          </a>

          {/* Official YouTube */}
          <a
            href={contact.youtubeUrl || 'https://www.youtube.com/@Tilnogz'}
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 rounded-full border border-charcoal/15 bg-white text-charcoal/80 hover:text-[#FF0000] hover:border-[#FF0000]/40 hover:bg-[#FF0000]/5 transition-all duration-300 flex items-center justify-center shadow-sm hover:scale-110 active:scale-95 group"
            aria-label="Tilnogz Photography Official YouTube Channel"
            title="Subscribe to Tilnogz Photography on YouTube"
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current transition-transform duration-300 group-hover:scale-105" aria-hidden="true">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
            </svg>
          </a>

          {/* Official WhatsApp */}
          <a
            href={getWhatsAppLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 rounded-full border border-charcoal/15 bg-white text-charcoal/80 hover:text-[#25D366] hover:border-[#25D366]/40 hover:bg-[#25D366]/5 transition-all duration-300 flex items-center justify-center shadow-sm hover:scale-110 active:scale-95 group"
            aria-label="Tilnogz Photography WhatsApp Chat"
            title="Chat with Tharindu Lakshan on WhatsApp"
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current transition-transform duration-300 group-hover:scale-105" aria-hidden="true">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.888 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
            </svg>
          </a>
        </motion.div>

        {/* Horizontal Navigation Menu */}
        <motion.nav
          variants={fadeUp}
          className="flex flex-wrap justify-center gap-4 sm:gap-8 md:gap-10 text-xs font-sans font-semibold tracking-wider text-charcoal/90 uppercase mb-6 sm:mb-8"
        >
          <a href="#" className="hover:text-copper transition-colors">
            Home
          </a>
          <a href="#work" className="hover:text-copper transition-colors">
            Albums
          </a>
          <a href="#about" className="hover:text-copper transition-colors">
            About Us
          </a>
          <a href="#plans" className="hover:text-copper transition-colors">
            Plans
          </a>
          <a href="#testimonials" className="hover:text-copper transition-colors">
            Testimonials
          </a>
        </motion.nav>

        {/* 5 Services List */}
        <motion.div variants={fadeUp} className="flex flex-wrap justify-center gap-x-4 gap-y-1.5 text-[11px] sm:text-xs font-sans text-charcoal/70 mb-6 sm:mb-8">
          {brand.services.map((svc, idx) => (
            <span key={idx} className="flex items-center gap-2">
              <span>{svc}</span>
              {idx < brand.services.length - 1 && (
                <span className="text-copper font-bold">·</span>
              )}
            </span>
          ))}
        </motion.div>

        {/* Contact Info & Address Block */}
        <motion.div variants={fadeUp} className="space-y-1.5 sm:space-y-2 mb-8 sm:mb-12 text-xs sm:text-sm font-sans text-charcoal/80">
          <p className="font-semibold text-copper tracking-wider uppercase text-[10px] sm:text-[11px]">
            Get in Touch!
          </p>
          <p>
            <a
              href={contact.phoneTel}
              className="font-bold text-sm sm:text-base md:text-lg text-charcoal hover:text-copper transition-colors"
            >
              {contact.phoneDisplay}
            </a>
          </p>
          <p className="flex items-center justify-center gap-1.5 text-xs text-charcoal-muted font-medium">
            <MapPin className="w-3.5 h-3.5 text-copper" />
            <span>Address: Colombo 7, Sri Lanka</span>
          </p>
        </motion.div>

        {/* Copyright Line + Discreet Owner Login Trigger */}
        <motion.div variants={fadeUp} className="border-t border-charcoal/10 pt-6 sm:pt-8 flex items-center justify-center gap-3 text-[10px] sm:text-[11px] text-charcoal-muted font-sans tracking-wide">
          <span>
            Copyright &copy; {new Date().getFullYear()} Tilnogz Photography. All Rights Reserved.
          </span>
          <button
            type="button"
            onClick={onOpenAdmin}
            title="Owner Dashboard Access"
            className="text-charcoal/30 hover:text-copper transition-colors p-1"
          >
            <Lock className="w-3 h-3" />
          </button>
        </motion.div>
      </motion.div>
    </footer>
  )
}
