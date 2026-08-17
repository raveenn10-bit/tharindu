/**
 * Portfolio Index — Curated photographic works by Tilnogz Photography.
 *
 * All works are based on verified studio files and authentic locations in Sri Lanka:
 * - Shoot 1: Editorial & Heritage Architecture
 * - Shoot 2: Street & Lifestyle Portraits
 * - shhot 4: Sports, Movement & Action
 * - Wild Life: Wildlife & Coastal Nature
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
 * Complete collection of all albums spanning Shoot 1, Shoot 2, Shoot 4 (Sports), and Wildlife.
 */
export const featured = [
  // --- Shoot 1: Editorial & Architecture ---
  item('f-arcade', editorial.arcade, 'The Colonial Arcade', 'Editorial & Heritage', {
    note: 'A colonial arcade photographed end to end — framing white lace silhouette against rhythmic architectural arches.',
  }),
  item('f-staircase', editorial.staircase, 'Iron & Arch Descent', 'Architecture & Heritage', {
    note: 'Cast iron balustrade against a pristine white vaulted ceiling with classical structure and shadow play.',
  }),
  item('f-chandelier', editorial.chandelier, 'The Classical Landing', 'Events & Monograph', {
    note: 'A timeless venue interior captured under ambient chandelier lighting, emphasizing spatial symmetry and ironwork.',
  }),
  item('f-blueframe', editorial.blueFrame, 'Cyan Facade Study', 'Architecture & Details', {
    note: 'Clean interior composition balancing white architectural planes with a vibrant framed cyanotype print.',
  }),
  item('f-medusa', editorial.medusa, 'Sculptural Scale', 'Architecture & Details', {
    note: 'Architectural scale study placing the human figure beneath a wall-mounted metal relief to emphasize verticality.',
  }),
  item('f-railing', editorial.railingHigh, 'Balustrade Geometry', 'Architecture & Form', {
    note: 'Low-angle perspective emphasizing the craftsmanship of scrolled iron banisters against modern clean lines.',
  }),
  item('f-railingred', editorial.railingRed, 'Curvilinear Scroll', 'Architecture & Form', {
    note: 'Ornate black metalwork contrasted against geometric crimson planes and crisp white masonry.',
  }),
  item('f-arcadewide', editorial.arcadeWide, 'Spatial Enclosure', 'Architecture & Space', {
    note: 'A quiet colonial hallway composed with rigorous mathematical symmetry and natural soft diffusion.',
  }),

  // --- Shoot 2: Street & Lifestyle Portraits ---
  item('f-lean', street.lean, 'Roadside Natural Light', 'Lifestyle & Portraiture', {
    note: 'Natural daylight portrait utilizing compressed telephoto perspective to soften the coastal urban backdrop.',
  }),
  item('f-glance', street.glance, 'Quiet Horizon', 'Lifestyle & Portraiture', {
    note: 'Unposed glance captured during a coastal session, highlighting authentic emotion in natural ambient shade.',
  }),
  item('f-corridor', street.corridor, 'Open Shade Movement', 'Street & Lifestyle', {
    note: 'Portrait in open shade beside a pale architectural wall, capturing authentic movement and relaxed poise.',
  }),
  item('f-seated', street.seated, 'Concrete & Calm', 'Street & Lifestyle', {
    note: 'Seated portrait on a concrete architectural ledge with soft natural editorial lighting.',
  }),

  // --- shhot 4: Sports, Movement & Action ---
  item('f-rider1', field.riderFront, 'Evening Velocity', 'Sports & Action', {
    note: 'Motorcyclist in golden evening light on the open road, capturing sports speed and focus.',
  }),
  item('f-rider2', field.riderSeated, 'Paddock Ready', 'Sports & Action', {
    note: 'Candid rider portrait with machine in open field conditions.',
  }),
  item('f-turn', field.motionTurn, 'Decisive Pivot', 'Sports & Action', {
    note: 'Subject caught in mid-turn motion with backpack in natural tropical daylight.',
  }),
  item('f-fence', field.fenceLine, 'Perimeter Line', 'Sports & Action', {
    note: 'Athlete pausing along the boundary perimeter in direct midday sunlight.',
  }),
  item('f-handpause', field.handPause, 'Golden Hour Focus', 'Sports & Action', {
    note: 'Close frame action lifestyle portrait in warm coastal sunlight.',
  }),
  item('f-greenlight', field.greenLight, 'Field Ambient Light', 'Sports & Action', {
    note: 'Field action portrait capturing vibrant greenery and ambient natural tones.',
  }),

  // --- Wild Life: Wildlife & Coastal Nature ---
  item('f-island', nature.island, 'Wooded Lagoon Sanctuary', 'Wildlife & Nature', {
    note: 'Wooded coastal island and boathouse across turquoise waters in southern Sri Lanka.',
  }),
  item('f-macaque-col', nature.macaqueColour, 'Canopy Reflex', 'Wildlife & Nature', {
    note: 'Sri Lankan toque macaque reaching between lush jungle branches in native canopy.',
  }),
  item('f-macaque-mono', nature.macaqueMono, 'Sentinel on Boulder', 'Wildlife & Nature', {
    note: 'Monochrome wildlife study of a macaque seated on a natural stone boulder.',
  }),
  item('f-bulbul', nature.bulbul, 'Tropical Canopy Perch', 'Wildlife & Nature', {
    note: 'Endemic bird perched peacefully among lush tropical jungle foliage.',
  }),
  item('f-surf', nature.surf, 'Southern Coastal Swell', 'Wildlife & Nature', {
    note: 'Heavy surf breaking white over coastal rocks along the southern Sri Lankan coastline.',
  }),
  item('f-palms', nature.palms, 'Coastal Gales & Palms', 'Wildlife & Nature', {
    note: 'Coconut palms bending in the coastal monsoon breeze above a headland.',
  }),
  item('f-treebike', nature.treeBike, 'Banyan Field Sanctuary', 'Wildlife & Nature', {
    note: 'Two-wheeler staged beneath an ancient sacred banyan tree canopy in rural Sri Lanka.',
  }),
  item('f-crow', nature.crow, 'Morning Solitude', 'Wildlife & Nature', {
    note: 'Silhouetted bird perched on a bare branch against the morning sky.',
  }),
]

export const portfolio = {
  featured,
}

export default portfolio
