import React, { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, Pause, Volume2, VolumeX, Maximize2, Film, Sparkles, X } from 'lucide-react'
import { useContent } from '../context/ContentContext'
import { fadeUp } from '../lib/motion'

export default function VideoSection() {
  const { content } = useContent()
  const rawVideos = content?.videos || [
    {
      id: 'vid-1',
      title: 'Cinematic Pre-Shoot Motion Story',
      category: 'Pre-Wedding / Wedding Cinematography',
      video_url: '/videos/tilnogz-cinematic-01.mp4',
      is_published: true,
      description: 'Atmospheric romance, natural light storytelling, and decisive emotional moments captured in motion by Tilnogz Photography.',
    },
  ]

  const publishedVideos = rawVideos.filter((v) => v.is_published !== false)

  const [activeVideo, setActiveVideo] = useState(publishedVideos[0] || null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(true)
  const [modalVideo, setModalVideo] = useState(null)
  const videoRef = useRef(null)

  if (publishedVideos.length === 0) return null

  const togglePlay = () => {
    if (!videoRef.current) return
    if (isPlaying) {
      videoRef.current.pause()
      setIsPlaying(false)
    } else {
      videoRef.current.play()
      setIsPlaying(true)
    }
  }

  const toggleMute = (e) => {
    e.stopPropagation()
    if (!videoRef.current) return
    videoRef.current.muted = !isMuted
    setIsMuted(!isMuted)
  }

  const openFullscreenModal = (vid) => {
    setModalVideo(vid)
  }

  return (
    <section
      id="videos"
      className="py-16 sm:py-24 md:py-32 bg-[#FAF8F5] relative border-t border-charcoal/5 overflow-hidden select-none"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.2 }}
          className="text-center mb-10 sm:mb-14"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-copper/10 text-copper text-[11px] font-sans font-bold tracking-widest uppercase mb-3">
            <Film className="w-3.5 h-3.5" />
            <span>Motion & Film</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-charcoal tracking-[0.25em] uppercase font-normal">
            CINEMATOGRAPHY
          </h2>
          <p className="text-xs sm:text-sm font-sans text-charcoal-muted max-w-xl mx-auto mt-3">
            Moving visual narratives crafted with intentional pacing, intimate interactions, and timeless emotion.
          </p>
        </motion.div>

        {/* Featured Video Player Showcase */}
        {activeVideo && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-5xl mx-auto mb-12"
          >
            <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden bg-charcoal shadow-2xl border border-charcoal/15 group aspect-[16/9] md:aspect-[21/9]">
              {/* HTML5 Video */}
              <video
                ref={videoRef}
                src={activeVideo.video_url}
                muted={isMuted}
                loop
                playsInline
                onClick={togglePlay}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                className="w-full h-full object-cover object-center cursor-pointer"
              />

              {/* Dark Gradient Overlay */}
              <div
                onClick={togglePlay}
                className={`absolute inset-0 bg-gradient-to-t from-charcoal/90 via-charcoal/30 to-transparent transition-opacity duration-300 ${
                  isPlaying ? 'opacity-0 hover:opacity-100' : 'opacity-100'
                } flex flex-col justify-between p-6 sm:p-8 cursor-pointer`}
              >
                {/* Top Badge */}
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 bg-white/20 backdrop-blur-md text-white text-[10px] sm:text-xs font-sans font-bold tracking-widest uppercase rounded-full border border-white/20">
                    {activeVideo.category || 'Cinematic Film'}
                  </span>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      openFullscreenModal(activeVideo)
                    }}
                    className="p-2 sm:p-2.5 rounded-full bg-white/20 hover:bg-white/40 text-white backdrop-blur-md transition-colors"
                    title="Open Fullscreen Theater"
                  >
                    <Maximize2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Center Big Play Button (when paused) */}
                {!isPlaying && (
                  <div className="self-center flex items-center justify-center">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-copper/90 hover:bg-copper text-white flex items-center justify-center shadow-2xl transition-transform hover:scale-110">
                      <Play className="w-7 h-7 sm:w-8 sm:h-8 ml-1 fill-white" />
                    </div>
                  </div>
                )}

                {/* Bottom Bar: Title & Controls */}
                <div className="flex items-end justify-between gap-4">
                  <div>
                    <h3 className="font-serif text-lg sm:text-2xl text-white font-bold tracking-wide uppercase">
                      {activeVideo.title}
                    </h3>
                    {activeVideo.description && (
                      <p className="text-xs sm:text-sm text-white/80 font-sans mt-1 max-w-xl line-clamp-2">
                        {activeVideo.description}
                      </p>
                    )}
                  </div>

                  {/* Audio Toggle */}
                  <button
                    type="button"
                    onClick={toggleMute}
                    className="p-2.5 sm:p-3 rounded-full bg-charcoal/70 hover:bg-copper text-white backdrop-blur-md transition-colors shadow-lg flex-shrink-0"
                    title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
                  >
                    {isMuted ? <VolumeX className="w-4 h-4 sm:w-5 sm:h-5" /> : <Volume2 className="w-4 h-4 sm:w-5 sm:h-5" />}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Video Grid (if multiple videos exist) */}
        {publishedVideos.length > 1 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {publishedVideos.map((vid) => {
              const isSelected = activeVideo?.id === vid.id
              return (
                <div
                  key={vid.id}
                  onClick={() => {
                    setActiveVideo(vid)
                    setIsPlaying(false)
                  }}
                  className={`group cursor-pointer rounded-2xl overflow-hidden bg-white border transition-all duration-300 ${
                    isSelected
                      ? 'border-copper ring-2 ring-copper/30 shadow-lg'
                      : 'border-charcoal/10 hover:border-copper/40 shadow-sm hover:shadow-md'
                  }`}
                >
                  <div className="aspect-video relative overflow-hidden bg-charcoal">
                    <video
                      src={vid.video_url}
                      muted
                      playsInline
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-charcoal/40 group-hover:bg-charcoal/20 transition-colors flex items-center justify-center">
                      <div className="w-10 h-10 rounded-full bg-white/80 group-hover:bg-copper text-charcoal group-hover:text-white flex items-center justify-center shadow transition-colors">
                        <Play className="w-4 h-4 ml-0.5 fill-current" />
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <span className="text-[10px] font-sans font-bold text-copper uppercase tracking-wider block mb-1">
                      {vid.category || 'Cinematography'}
                    </span>
                    <h4 className="font-serif text-sm font-bold text-charcoal truncate">
                      {vid.title}
                    </h4>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Cinematic Theater Modal */}
      <AnimatePresence>
        {modalVideo && (
          <div className="fixed inset-0 z-[200] bg-charcoal/95 backdrop-blur-xl flex items-center justify-center p-4 sm:p-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-5xl bg-black rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl relative border border-white/10"
            >
              <button
                type="button"
                onClick={() => setModalVideo(null)}
                className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-white/20 hover:bg-white text-white hover:text-charcoal backdrop-blur-md transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="aspect-video w-full">
                <video
                  src={modalVideo.video_url}
                  controls
                  autoPlay
                  className="w-full h-full object-contain"
                />
              </div>

              <div className="p-6 bg-charcoal text-white">
                <span className="text-xs font-sans text-copper font-bold uppercase tracking-widest block mb-1">
                  {modalVideo.category}
                </span>
                <h3 className="font-serif text-xl sm:text-2xl font-bold uppercase">
                  {modalVideo.title}
                </h3>
                {modalVideo.description && (
                  <p className="text-sm text-white/70 font-sans mt-1">
                    {modalVideo.description}
                  </p>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  )
}
