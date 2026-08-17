import React from 'react'
import { motion } from 'framer-motion'
import { Facebook, MessageSquare, MapPin, Lock } from 'lucide-react'
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

        {/* Centered Social Icons */}
        <motion.div variants={fadeUp} className="flex items-center justify-center gap-6 mb-6 sm:mb-8">
          <a
            href={contact.facebookUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-charcoal/80 hover:text-copper transition-colors p-1"
            aria-label="Tilnogz Photography Facebook"
          >
            <Facebook className="w-5 h-5 fill-current" />
          </a>

          <a
            href={getWhatsAppLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="text-charcoal/80 hover:text-copper transition-colors p-1"
            aria-label="Tilnogz Photography WhatsApp"
          >
            <MessageSquare className="w-5 h-5" />
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
