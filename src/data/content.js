/**
 * Tilnogz Photography — Central Brand & Content Source of Truth.
 *
 * OFFICIAL DETAILS:
 * - Brand: Tilnogz Photography
 * - Address: Colombo 7, Sri Lanka
 * - Official Services:
 *     1. Wedding Photography
 *     2. Pre-Wedding / Engagement Photography
 *     3. Graduation Photography
 *     4. Vehicle Photography
 *     5. Sports Photography
 * - Official WhatsApp: +94 78 843 2741 (https://wa.me/94788432741)
 * - Official Facebook: https://web.facebook.com/Tilnogzphoto
 */

export const brand = {
  name: 'Tilnogz Photography',
  shortName: 'Tilnogz',
  tagline: 'Wedding, Pre-Wedding, Graduation, Vehicle & Sports Photography',
  address: 'Colombo 7, Sri Lanka',
  locations: ['Colombo 7', 'Galle', 'Hikkaduwa', 'Sri Lanka'],
  locationDisplay: 'Colombo 7, Sri Lanka',
  photographerName: 'Tharindu Lakshan',
  services: [
    'Wedding Photography',
    'Pre-Wedding / Engagement Photography',
    'Graduation Photography',
    'Vehicle Photography',
    'Sports Photography',
    'Videography / Cinematography',
  ],
}

export const contact = {
  phone: '+94 78 843 2741',
  phoneDisplay: '+94 78 843 2741',
  phoneTel: 'tel:+94788432741',
  whatsappUrl: 'https://wa.me/94788432741',
  facebookUrl: 'https://web.facebook.com/Tilnogzphoto/?_rdc=1&_rdr#',
  youtubeUrl: 'https://www.youtube.com/@Tilnogz',
  address: 'Colombo 7, Sri Lanka',
  defaultMessage: 'Hello Tilnogz Photography, I would like to inquire about a photography / videography session.',
}

/**
 * Builds a valid WhatsApp URL with an optional custom pre-filled message.
 */
export const getWhatsAppLink = (customMsg = contact.defaultMessage) => {
  return `${contact.whatsappUrl}?text=${encodeURIComponent(customMsg)}`
}

export const navLinks = [
  { label: 'HOME', href: '#' },
  { label: 'ALBUMS', href: '#work' },
  { label: 'VIDEOS', href: '#videos' },
  { label: 'ABOUT', href: '#about' },
  { label: 'SERVICES', href: '#services' },
  { label: 'TESTIMONIALS', href: '#testimonials' },
  { label: 'PLANS', href: '#plans' },
]

export const servicesList = [
  {
    index: '01',
    id: 'wedding',
    title: 'Wedding Photography',
    category: 'Ceremony & Grand Storytelling',
    description:
      'Comprehensive wedding day documentation capturing heartfelt emotions, timeless ceremonies, rituals, and joyful celebrations across Sri Lanka.',
    details: 'Full day coverage, artistic couple portraiture, and master color-graded high-resolution delivery.',
  },
  {
    index: '02',
    id: 'pre-wedding',
    title: 'Pre-Wedding / Engagement Photography',
    category: 'Romantic & Creative Concepts',
    description:
      'Intimate, cinematic pre-wedding and engagement sessions crafted in scenic indoor and outdoor locations with natural light and relaxed direction.',
    details: 'Custom location planning, signature color grading, and teaser highlight sets.',
  },
  {
    index: '03',
    id: 'graduation',
    title: 'Graduation Photography',
    category: 'Milestones & Achievements',
    description:
      'Honoring academic success and life milestones with dignified portraiture, celebratory group captures, and graduation monographs.',
    details: 'Individual portraits, family frames, and swift turnaround for social and print.',
  },
  {
    index: '04',
    id: 'vehicle',
    title: 'Vehicle Photography',
    category: 'Automotive & Motorcycle Aesthetics',
    description:
      'Dynamic rolling shots, studio-lit automotive angles, motorcycle culture, and detailed commercial vehicle features.',
    details: 'Rigid line alignment, high-contrast reflections, and action rolling frames.',
  },
  {
    index: '05',
    id: 'sports',
    title: 'Sports Photography',
    category: 'High-Velocity Motion & Athletic Focus',
    description:
      'Split-second action freezing, athletic intensity, tournament coverage, and dynamic movement on tracks, courts, and fields.',
    details: 'Fast shutter speed mastery, high-burst action tracking, and dramatic field storytelling.',
  },
  {
    index: '06',
    id: 'videography',
    title: 'Videography / Cinematography',
    category: 'Cinematic Motion & Storytelling',
    description:
      'High-definition cinematic highlight films, wedding teasers, dynamic vehicle reels, and emotional pre-shoot motion monographs with drone and gimbal stabilization.',
    details: '4K Ultra-HD capture, master audio design, color graded visual aesthetics, and teaser edits.',
  },
]

export const aboutContent = {
  eyebrow: 'BEHIND THE LENS',
  title: 'TILNOGZ PHOTOGRAPHY',
  lead: 'Specializing in Wedding, Pre-Wedding, Graduation, Vehicle, Sports Photography & Cinematography.',
  body: 'Led by Tharindu Lakshan and based at Colombo 7, Sri Lanka, Tilnogz Photography creates authentic visual narratives with deliberate composition, vivid emotion, and artistic precision.',
  details: [
    { label: 'ADDRESS', value: 'Colombo 7, Sri Lanka' },
    { label: 'PHOTOGRAPHER', value: 'Tharindu Lakshan' },
    { label: 'SERVICES', value: 'Wedding · Pre-Wedding · Graduation · Vehicle · Sports · Videography' },
    { label: 'EQUIPMENT', value: 'Professional Sony Alpha & Cinema Series' },
  ],
}

export const footerContent = {
  brand: 'TILNOGZ PHOTOGRAPHY',
  address: 'Address: Colombo 7, Sri Lanka',
  statement: 'WEDDING · PRE-WEDDING · GRADUATION · VEHICLE · SPORTS · VIDEOGRAPHY',
  disciplines: [
    'Wedding Photography',
    'Pre-Wedding / Engagement Photography',
    'Graduation Photography',
    'Vehicle Photography',
    'Sports Photography',
    'Videography / Cinematography',
  ],
  copyright: `© ${new Date().getFullYear()} Tilnogz Photography. All Rights Reserved.`,
}

export default {
  brand,
  contact,
  getWhatsAppLink,
  navLinks,
  servicesList,
  aboutContent,
  footerContent,
}
