/**
 * Tilnogz Photography — Central Brand & Content Source of Truth.
 *
 * STRICT BRAND COMPLIANCE:
 * - Brand: Tilnogz Photography
 * - Services: Sports, Architectural, Event, Lifestyle/Editorial Photography
 * - Locations: Galle / Hikkaduwa / Colombo, Sri Lanka
 * - Official WhatsApp: +94 78 843 2741 (https://wa.me/94788432741)
 * - Official Facebook: https://web.facebook.com/Tilnogzphoto
 * - Verified Stats: 1.5K+ Facebook Followers, 490+ Facebook Posts, 04 Photography Categories
 * - NO invented awards, fake reviews, fake clients, or fake emails.
 */

export const brand = {
  name: 'Tilnogz Photography',
  shortName: 'Tilnogz',
  tagline: 'Sports, Architectural, Event & Lifestyle Photography',
  locations: ['Galle', 'Hikkaduwa', 'Colombo', 'Sri Lanka'],
  locationDisplay: 'Galle / Hikkaduwa / Colombo, Sri Lanka',
  photographerName: 'Tharindu Lakshan',
  roles: ['Professional Photographer', 'Sports Photographer'],
}

export const contact = {
  phone: '+94 78 843 2741',
  phoneDisplay: '+94 78 843 2741',
  whatsappUrl: 'https://wa.me/94788432741',
  facebookUrl: 'https://web.facebook.com/Tilnogzphoto',
  defaultMessage: 'Hello Tilnogz Photography, I would like to inquire about a photography session.',
}

/**
 * Builds a valid WhatsApp URL with an optional custom pre-filled message.
 */
export const getWhatsAppLink = (customMsg = contact.defaultMessage) => {
  return `${contact.whatsappUrl}?text=${encodeURIComponent(customMsg)}`
}

export const navLinks = [
  { label: 'WORK', href: '#work' },
  { label: 'SERVICES', href: '#services' },
  { label: 'PLANS', href: '#plans' },
  { label: 'ABOUT', href: '#about' },
  { label: 'CONTACT', href: '#contact' },
]

export const heroContent = {
  badge: 'TILNOGZ PHOTOGRAPHY',
  location: 'GALLE / SRI LANKA',
  headline: {
    part1: 'CAPTURING',
    part2: 'the',
    part3: 'MOMENT.',
  },
  disciplines: ['SPORTS', 'ARCHITECTURE', 'VISUAL STORIES'],
  statement: 'Sports, architecture and visual stories captured with precision and character.',
  scrollPrompt: 'SCROLL TO EXPLORE',
  primaryCta: "LET'S TALK",
  secondaryCta: 'EXPLORE WORK',
}

export const introContent = {
  eyebrow: 'EDITORIAL VISION',
  titleLines: ['NOT JUST PHOTOGRAPHS.', 'VISUAL STORIES.'],
  paragraph:
    'Tilnogz Photography captures movement, architecture, events and visual stories through a distinctive photographic perspective.',
  subtext:
    'From high-speed sports action in the field to the quiet structural rhythm of colonial heritage arches, every frame is crafted with deliberate composition and natural light.',
}

export const servicesList = [
  {
    index: '01',
    id: 'sports',
    title: 'SPORTS PHOTOGRAPHY',
    category: 'Motion & Energy',
    description:
      'Decisive action, split-second speed, and athletic intensity. Capturing dynamic movement on the track, field, and open road.',
    details: 'Fast shutter precision, high-burst focus, and raw environmental storytelling.',
  },
  {
    index: '02',
    id: 'architecture',
    title: 'ARCHITECTURAL PHOTOGRAPHY',
    category: 'Lines / Form / Space',
    description:
      'Measured perspectives of structural spaces, heritage arches, wrought iron balustrades, and modern geometry under balanced natural light.',
    details: 'Orthogonal alignment, structural detail, and textural depth.',
  },
  {
    index: '03',
    id: 'events',
    title: 'EVENT PHOTOGRAPHY',
    category: 'Atmosphere & Moments',
    description:
      'Immersive documentation of gatherings, milestones, and celebrations, preserving genuine interactions and ambient elegance.',
    details: 'Unobtrusive coverage, candid timing, and evocative ambient lighting.',
  },
  {
    index: '04',
    id: 'lifestyle',
    title: 'LIFESTYLE / EDITORIAL',
    category: 'Portraiture & Character',
    description:
      'Distinctive editorial portraits and lifestyle stories captured in authentic Sri Lankan locations with character and artistic poise.',
    details: 'Natural light mastery, relaxed direction, and expressive human connection.',
  },
]

export const sportsSectionContent = {
  eyebrow: 'IN MOTION',
  headline: 'SPORT / ACTION / MOTION',
  description:
    'High-velocity energy frozen in time. From riders on coastal transit roads to the raw impact of ocean surf, our sports photography celebrates peak momentum.',
  interactionHint: 'DRAG OR SCROLL TO EXPLORE STRIP',
}

export const architectureSectionContent = {
  eyebrow: 'GEOMETRIC PRECISION',
  headline: 'ARCHITECTURE',
  subheading: 'LINES / FORM / SPACE',
  description:
    'A measured, calm approach to architectural photography. Celebrating colonial heritage arches, ornate ironwork, and modern spatial balance across Sri Lanka.',
}

export const aboutContent = {
  eyebrow: 'BEHIND THE LENS',
  title: 'AUTHENTIC PERSPECTIVE IN EVERY FRAME.',
  lead: 'Tilnogz Photography focuses on capturing authentic moments, movement, architecture and visual stories through a distinctive photographic perspective.',
  body: 'Led by Tharindu Lakshan and based along Sri Lanka’s vibrant southern coastline in Galle, with operations extending to Hikkaduwa and Colombo. Specializing in high-energy sports and action, contemplative architectural environments, and timeless editorial sessions.',
  details: [
    { label: 'BASE LOCATION', value: 'Galle / Sri Lanka' },
    { label: 'ACTIVE COVERAGE', value: 'Galle · Hikkaduwa · Colombo' },
    { label: 'CORE DISCIPLINES', value: 'Sports, Architecture, Events, Lifestyle' },
    { label: 'EQUIPMENT ECOSYSTEM', value: 'Professional Sony Alpha Systems' },
  ],
}

export const statsList = [
  { value: 1500, display: '1.5K+', label: 'FACEBOOK FOLLOWERS', note: 'Active Community' },
  { value: 490, display: '490+', label: 'FACEBOOK POSTS', note: 'Curated Stories' },
  { value: 4, display: '04', label: 'PHOTOGRAPHY CATEGORIES', note: 'Specialized Disciplines' },
  { value: 'LK', display: 'SRI LANKA', label: 'BASED & OPERATING', note: 'Galle / Colombo' },
]

export const testimonialsContent = {
  eyebrow: 'CLIENT NOTES',
  title: 'WHAT CLIENTS VALUE',
  subtitle: 'Authentic feedback and shoot experiences will appear here as new commissioned sessions are cataloged.',
  slots: [
    {
      id: 1,
      category: 'Sports & Action',
      quote: 'Capturing dynamic split-second movement with sharp detail and genuine atmosphere.',
      client: 'Field & Motion Session',
      location: 'Southern Province',
    },
    {
      id: 2,
      category: 'Architectural & Space',
      quote: 'Meticulous attention to lines, ambient light, and structural character in historic venues.',
      client: 'Heritage Space Study',
      location: 'Galle Fort & Coastal Venues',
    },
    {
      id: 3,
      category: 'Editorial & Lifestyle',
      quote: 'A relaxed, professional experience that translates authentic human emotion into art.',
      client: 'Editorial Portraiture',
      location: 'Colombo & Galle',
    },
  ],
}

export const socialContent = {
  eyebrow: 'FOLLOW THE FRAME',
  headline: 'CONNECT WITH TILNOGZ',
  body: 'Explore our latest photographic dispatches, behind-the-scenes moments, and community updates directly on Facebook.',
  ctaText: 'FOLLOW TILNOGZ ON FACEBOOK',
  meta: '1.5K+ Followers · 490+ Posts',
}

export const contactContent = {
  eyebrow: 'BOOKINGS & INQUIRIES',
  headline: "LET'S CREATE SOMETHING VISUAL.",
  subtext:
    'Available for sports tournaments, architectural commissions, milestone events, and editorial portrait sessions across Sri Lanka.',
  whatsappCard: {
    title: 'INSTANT WHATSAPP INQUIRY',
    phone: '+94 78 843 2741',
    note: 'Fastest response time for booking dates and rates.',
    cta: 'CHAT ON WHATSAPP',
  },
  form: {
    types: [
      'Sports Photography',
      'Architectural Photography',
      'Event Photography',
      'Lifestyle / Editorial Photography',
    ],
    submitText: 'SEND INQUIRY VIA WHATSAPP →',
  },
}

export const footerContent = {
  brand: 'TILNOGZ PHOTOGRAPHY',
  statement: 'SEE YOU THROUGH THE LENS.',
  disciplines: ['SPORTS', 'ARCHITECTURE', 'EVENTS', 'LIFESTYLE'],
  location: 'GALLE / HIKKADUWA / COLOMBO, SRI LANKA',
  copyright: '© 2026 Tilnogz Photography. All Rights Reserved.',
}

export default {
  brand,
  contact,
  getWhatsAppLink,
  navLinks,
  heroContent,
  introContent,
  servicesList,
  sportsSectionContent,
  architectureSectionContent,
  aboutContent,
  statsList,
  testimonialsContent,
  socialContent,
  contactContent,
  footerContent,
}
