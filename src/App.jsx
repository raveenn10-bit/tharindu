import React, { useState, useEffect } from 'react'
import { ContentProvider, useContent } from './context/ContentContext'
import UnderDevelopmentNotice from './components/UnderDevelopmentNotice'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import FeaturedWork from './components/FeaturedWork'
import VideoSection from './components/VideoSection'
import Testimonials from './components/Testimonials'
import PricingPlans from './components/PricingPlans'
import FullWidthPhotoStrip from './components/FullWidthPhotoStrip'
import Footer from './components/Footer'
import CustomCursor from './components/CustomCursor'
import WhatsAppFloatingButton from './components/WhatsAppFloatingButton'
import ProjectModal from './components/ProjectModal'
import AdminLogin from './components/admin/AdminLogin'
import AdminDashboard from './components/admin/AdminDashboard'

function MainSite() {
  const { content, isAuthenticated } = useContent()
  const albums = content?.albums || []

  const [selectedProject, setSelectedProject] = useState(null)
  const [currentIndex, setCurrentIndex] = useState(0)

  // Admin state
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false)
  const [isAdminDashboardOpen, setIsAdminDashboardOpen] = useState(false)

  // Listen for #admin hash and keyboard shortcut (Ctrl+Shift+A)
  useEffect(() => {
    const handleHash = () => {
      if (window.location.hash === '#admin') {
        if (isAuthenticated) {
          setIsAdminDashboardOpen(true)
        } else {
          setIsAdminLoginOpen(true)
        }
      }
    }

    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'a') {
        e.preventDefault()
        if (isAuthenticated) {
          setIsAdminDashboardOpen(true)
        } else {
          setIsAdminLoginOpen(true)
        }
      }
    }

    handleHash()
    window.addEventListener('hashchange', handleHash)
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('hashchange', handleHash)
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isAuthenticated])

  const handleOpenAdmin = () => {
    if (isAuthenticated) {
      setIsAdminDashboardOpen(true)
    } else {
      setIsAdminLoginOpen(true)
    }
  }

  // Open modal with specific project and set its index for prev/next
  const handleOpenProject = (project) => {
    setSelectedProject(project)
    const idx = albums.findIndex((p) => p.id === project.id || p.title === project.title)
    if (idx !== -1) setCurrentIndex(idx)
  }

  const handleCloseModal = () => {
    setSelectedProject(null)
  }

  const handlePrev = () => {
    if (!albums.length) return
    const nextIdx = (currentIndex - 1 + albums.length) % albums.length
    setCurrentIndex(nextIdx)
    setSelectedProject(albums[nextIdx])
  }

  const handleNext = () => {
    if (!albums.length) return
    const nextIdx = (currentIndex + 1) % albums.length
    setCurrentIndex(nextIdx)
    setSelectedProject(albums[nextIdx])
  }

  return (
    <div className="min-h-screen bg-white text-charcoal flex flex-col relative selection:bg-copper selection:text-white">
      {/* Desktop Custom Cursor */}
      <CustomCursor />

      {/* WhatsApp Floating Action Button */}
      <WhatsAppFloatingButton />

      {/* Under Development Top Announcement Notice */}
      <UnderDevelopmentNotice />

      {/* Global Transparent Navbar */}
      <Navbar />

      {/* Main Content Sections strictly matching reference sequence */}
      <main id="main-content" className="flex-grow">
        {/* 1. Full-Bleed Cinematic Hero */}
        <Hero />

        {/* 2. 2-Column About Artist & Photographer Portrait */}
        <About />

        {/* 3. ALBUMS Portfolio Grid with 9-Photo 2s Auto-Cycle */}
        <FeaturedWork onOpenProject={handleOpenProject} />

        {/* 4. CINEMATOGRAPHY Video Showcase */}
        <VideoSection />

        {/* 5. TESTIMONIALS Alternating Story Blocks */}
        <Testimonials />

        {/* 6. 3 Curated Session Plans & Investment */}
        <PricingPlans />

        {/* 6. Full-Width Edge-to-Edge 7-Image Photo Strip */}
        <FullWidthPhotoStrip onOpenProject={handleOpenProject} />
      </main>

      {/* 7. Centered Colophon & Footer with discreet Admin lock trigger */}
      <Footer onOpenAdmin={handleOpenAdmin} />

      {/* Fullscreen Interactive Project Detail Modal */}
      {selectedProject && (
        <ProjectModal
          project={selectedProject}
          onClose={handleCloseModal}
          onPrev={handlePrev}
          onNext={handleNext}
        />
      )}

      {/* Owner Login Modal */}
      <AdminLogin
        isOpen={isAdminLoginOpen}
        onClose={() => setIsAdminLoginOpen(false)}
        onSuccess={() => {
          setIsAdminLoginOpen(false)
          setIsAdminDashboardOpen(true)
        }}
      />

      {/* Owner Admin Dashboard Overlay */}
      <AdminDashboard
        isOpen={isAdminDashboardOpen}
        onClose={() => {
          setIsAdminDashboardOpen(false)
          if (window.location.hash === '#admin') {
            window.history.replaceState(null, null, ' ')
          }
        }}
      />
    </div>
  )
}

export default function App() {
  return (
    <ContentProvider>
      <MainSite />
    </ContentProvider>
  )
}
