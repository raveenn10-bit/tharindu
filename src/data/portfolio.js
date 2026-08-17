/**
 * Portfolio Index — Curated photographic works by Tilnogz Photography.
 *
 * All works are based on verified studio files and authentic locations in Sri Lanka.
 */

import { editorial, street, field, nature } from './images'

const item = (id, image, title, category, extra = {}) => ({
  id,
  image,
  title,
  category,
  location: 'Sri Lanka',
  ...extra,
})

/**
 * Asymmetric featured work grid with varied aspect ratios and editorial compositions.
 */
export const featured = [
  item('f-arcade', editorial.arcade, 'The Grand Arcade', 'Lifestyle / Editorial', {
    span: 'lead',
    aspect: 'tall',
    camera: 'Sony Alpha Series',
    discipline: 'Editorial Portraiture',
    note: 'A colonial arcade photographed end to end — framing the white lace silhouette against rhythmic architectural arches and lush greenery.',
  }),
  item('f-staircase', editorial.staircase, 'Iron & Arch Descent', 'Architecture', {
    span: 'tall',
    aspect: 'tall',
    camera: 'Sony Alpha Series',
    discipline: 'Architectural Studies',
    note: 'Cast iron balustrade against a pristine white vaulted ceiling. Measured geometry capturing classical structure and subtle shadow play.',
  }),
  item('f-lean', street.lean, 'Roadside Natural Light', 'Lifestyle / Editorial', {
    span: 'portrait',
    aspect: 'portrait',
    camera: 'Sony Alpha Series',
    discipline: 'Street Editorial',
    note: 'Natural daylight portrait utilizing compressed telephoto perspective to soften the urban coastal environment behind the subject.',
  }),
  item('f-chandelier', editorial.chandelier, 'The Classical Landing', 'Events', {
    span: 'wide',
    aspect: 'portrait',
    camera: 'Sony Alpha Series',
    discipline: 'Event Photography',
    note: 'A timeless venue interior captured under ambient chandelier lighting, emphasizing spatial symmetry, ironwork, and poise.',
  }),
  item('f-medusa', editorial.medusa, 'Sculptural Scale', 'Architecture', {
    span: 'vertical',
    aspect: 'tall',
    camera: 'Sony Alpha Series',
    discipline: 'Architectural Details',
    note: 'Architectural scale study placing the human figure beneath a wall-mounted metal relief to emphasize verticality and texture.',
  }),
  item('f-glance', street.glance, 'Quiet Horizon', 'Lifestyle / Editorial', {
    span: 'portrait',
    aspect: 'portrait',
    camera: 'Sony Alpha Series',
    discipline: 'Editorial Portraiture',
    note: 'Unposed glance captured during a coastal session, highlighting authentic emotion and delicate hair illumination in natural shade.',
  }),
  item('f-blueframe', editorial.blueFrame, 'Cyan Facade Study', 'Architecture', {
    span: 'small',
    aspect: 'portrait',
    camera: 'Sony Alpha Series',
    discipline: 'Architectural Studies',
    note: 'Clean interior composition balancing white architectural planes with a vibrant framed cyanotype print.',
  }),
  item('f-railing', editorial.railingHigh, 'Balustrade Geometry', 'Architecture', {
    span: 'portrait',
    aspect: 'portrait',
    camera: 'Sony Alpha Series',
    discipline: 'Architectural Details',
    note: 'Low-angle perspective emphasizing the craftsmanship of scrolled iron banisters against modern clean lines.',
  }),
]

/**
 * Sports, motion, and field collection for the dynamic horizontal strip.
 */
export const sportsMotion = [
  item('s-rider1', field.riderFront, 'Evening Transit', 'Sports & Action', {
    tag: 'RIDER / MOTION',
    speed: '1/1000s',
    note: 'Motorcycle rider captured in warm side light during transit on an open road.',
  }),
  item('s-surf', nature.surf, 'Southern Swell', 'Sports & Action', {
    tag: 'SURF / COAST',
    speed: '1/2000s',
    note: 'Heavy surf crashing over jagged reefs along the Galle and Hikkaduwa coastline.',
  }),
  item('s-rider2', field.riderSeated, 'Paddock Ready', 'Sports & Action', {
    tag: 'FIELD / MOTOR',
    speed: '1/800s',
    note: 'Candid rider portrait with machine in field conditions.',
  }),
  item('s-palms', nature.palms, 'Coastal Gales', 'Sports & Action', {
    tag: 'WIND / MOTION',
    speed: '1/500s',
    note: 'Coconut palms bending violently under tropical monsoon winds over coastal cliffs.',
  }),
  item('s-turn', field.motionTurn, 'Decisive Pivot', 'Sports & Action', {
    tag: 'DYNAMIC / ATHLETE',
    speed: '1/1250s',
    note: 'Subject caught in mid-turn motion with gear in natural sunlight.',
  }),
  item('s-treebike', nature.treeBike, 'Field Sanctuary', 'Sports & Action', {
    tag: 'ENDURANCE / FIELD',
    speed: '1/640s',
    note: 'Two-wheeler staged beneath ancient banyan canopy in rural Sri Lanka.',
  }),
  item('s-fence', field.fenceLine, 'Perimeter Line', 'Sports & Action', {
    tag: 'TRACK / BOUNDARY',
    speed: '1/1000s',
    note: 'Athlete pausing along the boundary line in direct midday sun.',
  }),
  item('s-macaque', nature.macaqueColour, 'Canopy Reflex', 'Sports & Action', {
    tag: 'WILD / INSTINCT',
    speed: '1/1600s',
    note: 'Wildlife in instant motion, leaping across high jungle foliage.',
  }),
]

/**
 * Dedicated Architecture collection with line/form/space focus.
 */
export const architectureSet = [
  item('a-staircase', editorial.staircase, 'Classical Descent', 'Architecture', {
    concept: '01 / LINE',
    subtitle: 'WROUGHT IRON & VAULTED ARCS',
    note: 'The grand staircase read as a striking diagonal slicing through vertical colonnades and white vaulted arches.',
  }),
  item('a-railingred', editorial.railingRed, 'Curvilinear Scroll', 'Architecture', {
    concept: '02 / FORM',
    subtitle: 'HERITAGE IRONWORK & ACCENT PLANES',
    note: 'Ornate black metalwork contrasted against a single geometric crimson plane and crisp white masonry.',
  }),
  item('a-arcade', editorial.arcadeWide, 'Spatial Enclosure', 'Architecture', {
    concept: '03 / SPACE',
    subtitle: 'SYMMETRY, LIGHT & DEPTH',
    note: 'A quiet colonial hallway composed with rigorous mathematical symmetry and natural soft diffusion.',
  }),
]

/**
 * 6 Curated frames for the "Follow the Frame" social section.
 */
export const socialGrid = [
  { img: street.corridor, title: 'Natural Shade Study', meta: 'Street Series' },
  { img: editorial.arcade, title: 'Colonial Corridor', meta: 'Editorial Session' },
  { img: nature.island, title: 'Southern Shoreline', meta: 'Coastal Story' },
  { img: editorial.railingRed, title: 'Architectural Scroll', meta: 'Form & Line' },
  { img: field.riderSeated, title: 'Roadside Motion', meta: 'Field Series' },
  { img: street.seated, title: 'Concrete & Calm', meta: 'Lifestyle Shoot' },
]

/**
 * Interactive service hover image mapping.
 */
export const servicePreviews = {
  sports: field.riderFront,
  architecture: editorial.staircase,
  events: editorial.chandelier,
  lifestyle: street.corridor,
}

export const portfolio = {
  featured,
  sportsMotion,
  architectureSet,
  socialGrid,
  servicePreviews,
}

export default portfolio
