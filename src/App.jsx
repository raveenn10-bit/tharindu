import React, { useState } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import FeaturedWork from './components/FeaturedWork'
import Testimonials from './components/Testimonials'
import PricingPlans from './components/PricingPlans'
import FullWidthPhotoStrip from './components/FullWidthPhotoStrip'
import Footer from './components/Footer'
import CustomCursor from './components/CustomCursor'
import WhatsAppFloatingButton from './components/WhatsAppFloatingButton'
import ProjectModal from './components/ProjectModal'
import { featured } from './data/portfolio'

export default function App() {
  const [selectedProject, setSelectedProject] = useState(null)
  const [currentIndex, setCurrentIndex] = useState(0)

  // Open modal with specific project and set its index for prev/next
  const handleOpenProject = (project) => {
    setSelectedProject(project)
    const idx = featured.findIndex((p) => p.id === project.id || p.title === project.title)
    if (idx !== -1) setCurrentIndex(idx)
  }

  const handleCloseModal = () => {
    setSelectedProject(null)
  }

  const handlePrev = () => {
    const nextIdx = (currentIndex - 1 + featured.length) % featured.length
    setCurrentIndex(nextIdx)
    setSelectedProject(featured[nextIdx])
  }

  const handleNext = () => {
    const nextIdx = (currentIndex + 1) % featured.length
    setCurrentIndex(nextIdx)
    setSelectedProject(featured[nextIdx])
  }

  return (
    <div className="min-h-screen bg-white text-charcoal flex flex-col relative selection:bg-copper selection:text-white">
      {/* Desktop Custom Cursor */}
      <CustomCursor />

      {/* WhatsApp Floating Action Button */}
      <WhatsAppFloatingButton />

      {/* Global Transparent Navbar */}
      <Navbar />

      {/* Main Content Sections strictly matching reference sequence */}
      <main id="main-content" className="flex-grow">
        {/* 1. Full-Bleed Cinematic Hero */}
        <Hero />

        {/* 2. 2-Column About Artist & Photographer Portrait */}
        <About />

        {/* 3. ALBUMS Portfolio Grid with Hoverer Effect */}
        <FeaturedWork onOpenProject={handleOpenProject} />

        {/* 4. TESTIMONIALS Alternating Story Blocks */}
        <Testimonials />

        {/* 5. 3 Curated Session Plans & Investment */}
        <PricingPlans />

        {/* 6. Full-Width Edge-to-Edge 7-Image Photo Strip */}
        <FullWidthPhotoStrip onOpenProject={handleOpenProject} />
      </main>

      {/* 7. Centered Colophon & Footer */}
      <Footer />

      {/* Fullscreen Interactive Project Detail Modal */}
      {selectedProject && (
        <ProjectModal
          project={selectedProject}
          onClose={handleCloseModal}
          onPrev={handlePrev}
          onNext={handleNext}
        />
      )}
    </div>
  )
}
