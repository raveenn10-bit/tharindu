import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, Pause, Volume2, VolumeX, Maximize2, Film, Sparkles, X } from 'lucide-react'
import { useContent } from '../context/ContentContext'
import { fadeUp } from '../lib/motion'

// Sub-component for each individual 9:16 AutoPlaying Reel Card
function ReelCard({ video, onOpenModal }) {
  const videoRef = useRef(null)
  const [isPlaying, setIsPlaying] = useState(true)
  const [isMuted, setIsMuted] = useState(true)

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = true
      const playPromise = videoRef.current.play()
      if (playPromise !== undefined) {
        playPromise
          .then(() => setIsPlaying(true))
          .catch(() => {
            // Autoplay fallback
            if (videoRef.current) {
              videoRef.current.muted = true
              videoRef.current.play().catch(() => {})
            }
          })
      }
    }
  }, [video.video_url])

  const togglePlay = (e) => {
    e.stopPropagation()
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

  return (
    <motion.div
      variants={fadeUp}
      className="group relative rounded-2xl sm:rounded-3xl overflow-hidden bg-charcoal shadow-xl hover:shadow-2xl border border-charcoal/15 transition-all duration-500 hover:-translate-y-1.5 flex flex-col"
    >
      {/* 9:16 Aspect Video Container */}
      <div className="relative aspect-[9/16] w-full overflow-hidden bg-black cursor-pointer">
        <video
          ref={videoRef}
          src={video.video_url}
          autoPlay
          loop
          muted={isMuted}
          playsInline
          onClick={togglePlay}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
        />

        {/* Ambient Gradient Overlay */}
        <div
          onClick={togglePlay}
          className={`absolute inset-0 bg-gradient-to-t from-charcoal/90 via-charcoal/20 to-charcoal/40 transition-opacity duration-300 ${
            isPlaying ? 'opacity-0 group-hover:opacity-100' : 'opacity-100'
          } flex flex-col justify-between p-4 sm:p-5`}
        >
          {/* Top Bar: Category Pill & Fullscreen Button */}
          <div className="flex items-center justify-between gap-2">
            <span className="px-2.5 py-1 bg-white/20 backdrop-blur-md text-white text-[10px] font-sans font-bold tracking-wider uppercase rounded-full border border-white/20 truncate max-w-[70%]">
              {video.category || 'Cinematography'}
            </span>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                onOpenModal(video)
              }}
              className="p-2 rounded-full bg-white/25 hover:bg-white text-white hover:text-charcoal backdrop-blur-md transition-all shadow-md"
              title="Open Fullscreen Theater"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Center Play Indicator (shown when paused or hovered) */}
          <div className="self-center flex items-center justify-center pointer-events-none">
            {!isPlaying ? (
              <div className="w-14 h-14 rounded-full bg-copper/90 text-white flex items-center justify-center shadow-2xl scale-110">
                <Play className="w-6 h-6 ml-0.5 fill-white" />
              </div>
            ) : (
              <div className="w-12 h-12 rounded-full bg-black/40 text-white/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Pause className="w-5 h-5 fill-white" />
              </div>
            )}
          </div>

          {/* Bottom Bar: Title, Description, & Sound Control */}
          <div className="flex items-end justify-between gap-3">
            <div className="flex-1 min-w-0 pr-1">
              <h3 className="font-serif text-sm sm:text-base text-white font-bold tracking-wide uppercase truncate">
                {video.title}
              </h3>
              {video.description && (
                <p className="text-[11px] text-white/80 font-sans mt-0.5 line-clamp-2 leading-relaxed">
                  {video.description}
                </p>
              )}
            </div>

            {/* Audio Toggle Button */}
            <button
              type="button"
              onClick={toggleMute}
              className="p-2.5 rounded-full bg-charcoal/80 hover:bg-copper text-white backdrop-blur-md transition-colors shadow-lg flex-shrink-0"
              title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
            >
              {isMuted ? (
                <VolumeX className="w-4 h-4" />
              ) : (
                <Volume2 className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default function VideoSection() {
  const { content } = useContent()
  const rawVideos = content?.videos || [
    {
      id: 'vid-1',
      title: 'Cinematic Pre-Shoot Motion Story',
      category: 'Pre-Wedding / Wedding Cinematography',
      video_url: '/videos/tilnogz-cinematic-01.mp4',
      is_published: true,
      description:
        'Atmospheric romance, natural light storytelling, and decisive emotional moments captured in motion by Tilnogz Photography.',
    },
    {
      id: 'vid-2',
      title: 'Grand Wedding & Couple Highlights',
      category: 'Wedding Cinematography',
      video_url: '/videos/tilnogz-cinematic-02.mp4',
      is_published: true,
      description:
        'Joyful cultural celebrations, intimate promises, and grand wedding highlights in vibrant motion.',
    },
    {
      id: 'vid-3',
      title: 'Atmospheric Motion Monograph',
      category: 'Lifestyle & Editorial Film',
      video_url: '/videos/tilnogz-cinematic-03.mp4',
      is_published: true,
      description:
        'Sensory editorial film capturing subtle glances and cinematic movement in natural light.',
    },
  ]

  const publishedVideos = rawVideos.filter((v) => v.is_published !== false)
  const [modalVideo, setModalVideo] = useState(null)

  if (publishedVideos.length === 0) return null

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
          className="text-center mb-10 sm:mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-copper/10 text-copper text-[11px] font-sans font-bold tracking-widest uppercase mb-3">
            <Film className="w-3.5 h-3.5" />
            <span>9:16 Cinematic Motion</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-charcoal tracking-[0.25em] uppercase font-normal">
            CINEMATOGRAPHY
          </h2>
          <p className="text-xs sm:text-sm font-sans text-charcoal-muted max-w-xl mx-auto mt-3">
            Vertical cinematic reels and moving visual narratives captured in crisp 9:16 portrait frames.
          </p>
        </motion.div>

        {/* 3 Synchronized AutoPlaying 9:16 Reels Side-by-Side */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto items-stretch">
          {publishedVideos.slice(0, 3).map((vid) => (
            <ReelCard
              key={vid.id}
              video={vid}
              onOpenModal={(v) => setModalVideo(v)}
            />
          ))}
        </div>
      </div>

      {/* Cinematic Fullscreen Theater Modal */}
      <AnimatePresence>
        {modalVideo && (
          <div className="fixed inset-0 z-[200] bg-charcoal/95 backdrop-blur-xl flex items-center justify-center p-4 sm:p-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-black rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl relative border border-white/10"
            >
              <button
                type="button"
                onClick={() => setModalVideo(null)}
                className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-white/20 hover:bg-white text-white hover:text-charcoal backdrop-blur-md transition-colors shadow-lg"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="aspect-[9/16] w-full bg-black">
                <video
                  src={modalVideo.video_url}
                  controls
                  autoPlay
                  className="w-full h-full object-contain"
                />
              </div>

              <div className="p-5 bg-charcoal text-white">
                <span className="text-xs font-sans text-copper font-bold uppercase tracking-widest block mb-1">
                  {modalVideo.category}
                </span>
                <h3 className="font-serif text-lg sm:text-xl font-bold uppercase">
                  {modalVideo.title}
                </h3>
                {modalVideo.description && (
                  <p className="text-xs text-white/70 font-sans mt-1 leading-relaxed">
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
