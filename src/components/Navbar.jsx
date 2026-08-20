import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, ArrowUpRight, MessageSquare, Facebook, Youtube } from 'lucide-react'
import { contact, navLinks, getWhatsAppLink } from '../data/content'
import { useScrolled } from '../lib/hooks'
import MagneticButton from './MagneticButton'
import Logo from './Logo'

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const isScrolled = useScrolled(50)

  // Close mobile menu on escape key or resize
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setMobileMenuOpen(false)
    }
    const handleResize = () => {
      if (window.innerWidth >= 1024) setMobileMenuOpen(false)
    }
    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [mobileMenuOpen])

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ease-out ${
          isScrolled
            ? 'bg-paper/95 backdrop-blur-md py-3.5 border-b border-charcoal/10 shadow-[0_4px_24px_rgba(0,0,0,0.04)]'
            : 'bg-transparent py-5 sm:py-6'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Brand Official Vector Logo */}
          <a
            href="#"
            className="group flex items-center focus:outline-none drop-shadow-sm"
            aria-label="Tilnogz Photography Home"
          >
            <Logo className="h-8 sm:h-9 md:h-10 w-auto" />
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-7 xl:gap-9" aria-label="Main Navigation">
            {navLinks.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="font-sans text-[11.5px] font-bold tracking-wider text-charcoal hover:text-copper uppercase transition-colors duration-200 py-1 relative group drop-shadow-[0_1px_2px_rgba(255,255,255,0.8)]"
              >
                {item.label}
                <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-copper transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </nav>

          {/* Right Social Links & WhatsApp CTA */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Social Icons matching the reference style */}
            <div className="hidden sm:flex items-center gap-2 pr-2 border-r border-charcoal/20">
              <a
                href={contact.facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full flex items-center justify-center text-charcoal hover:text-copper hover:bg-white/70 transition-colors"
                aria-label="Tilnogz Photography Facebook"
              >
                <Facebook className="w-4 h-4 fill-current" />
              </a>
              <a
                href={contact.youtubeUrl || 'https://www.youtube.com/@Tilnogz'}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full flex items-center justify-center text-charcoal hover:text-copper hover:bg-white/70 transition-colors"
                aria-label="Tilnogz Photography YouTube"
              >
                <Youtube className="w-4 h-4 fill-current" />
              </a>
              <a
                href={getWhatsAppLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full flex items-center justify-center text-charcoal hover:text-copper hover:bg-white/70 transition-colors"
                aria-label="Tilnogz Photography WhatsApp"
              >
                <MessageSquare className="w-4 h-4" />
              </a>
            </div>

            <div className="hidden sm:block">
              <MagneticButton
                href={getWhatsAppLink()}
                target="_blank"
                rel="noopener noreferrer"
                variant="primary"
                className="gap-2 text-xs py-2.5 px-5 shadow-sm"
                ariaLabel="Let's talk on WhatsApp"
              >
                <span>LET'S TALK</span>
                <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </MagneticButton>
            </div>

            {/* Mobile Hamburger Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2.5 rounded-full text-charcoal hover:bg-sand/40 transition-colors focus:outline-none"
              aria-label={mobileMenuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Fullscreen Animated Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-30 bg-paper pt-24 px-6 pb-8 flex flex-col justify-between lg:hidden overflow-y-auto"
          >
            <div className="max-w-md mx-auto w-full pt-2">
              <div className="mb-6 pb-4 border-b border-charcoal/10 flex justify-center">
                <Logo className="h-9 w-auto" />
              </div>

              <div className="text-[10px] font-bold tracking-ultra text-copper uppercase mb-4">
                NAVIGATION
              </div>
              <ul className="space-y-4">
                {navLinks.map((item, index) => (
                  <motion.li
                    key={item.label}
                    initial={{ opacity: 0, x: -24 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.08 * index, duration: 0.4 }}
                  >
                    <a
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="block font-sans text-2xl sm:text-3xl font-bold tracking-tight text-charcoal hover:text-copper transition-colors py-1"
                    >
                      {item.label}
                    </a>
                  </motion.li>
                ))}
              </ul>
            </div>

            {/* Mobile Footer Area */}
            <div className="max-w-md mx-auto w-full border-t border-charcoal/10 pt-6 space-y-4">
              <div>
                <span className="text-[10px] font-bold tracking-ultra text-charcoal-muted uppercase block mb-1">
                  OFFICIAL WHATSAPP
                </span>
                <a
                  href={getWhatsAppLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-sans text-lg font-bold text-charcoal flex items-center gap-2 hover:text-copper transition-colors"
                >
                  <MessageSquare className="w-4 h-4 text-copper" />
                  {contact.phoneDisplay}
                </a>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-charcoal/10">
                <div className="flex items-center gap-4">
                  <a
                    href={contact.facebookUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-sans text-xs font-semibold tracking-wider text-charcoal/80 hover:text-copper uppercase underline underline-offset-4"
                  >
                    Facebook →
                  </a>
                  <a
                    href={contact.youtubeUrl || 'https://www.youtube.com/@Tilnogz'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-sans text-xs font-semibold tracking-wider text-charcoal/80 hover:text-copper uppercase underline underline-offset-4"
                  >
                    YouTube →
                  </a>
                </div>
                <span className="text-xs text-charcoal-muted font-sans">
                  Colombo / Sri Lanka
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
