/**
 * Portfolio Index — Curated photographic works by Tilnogz Photography.
 *
 * All works are based on verified studio files and authentic locations in Sri Lanka:
 * - New Shoots: Wedding, Pre-Wedding, Graduation, Vehicle, and Sports Photography
 * - Shoot 1: Editorial & Heritage Architecture
 * - Shoot 2: Street & Lifestyle Portraits
 * - shhot 4: Sports, Movement & Action
 * - Wild Life: Wildlife & Coastal Nature
 */

import { newShoots, editorial, street, field, nature } from './images'

const item = (id, image, title, category, extra = {}) => ({
  id,
  image,
  title,
  category,
  location: 'Sri Lanka',
  ...extra,
})

/**
 * Complete collection of all albums.
 */
export const featured = [
  // --- New Shoots Collection ---
  item('n-wedding1', newShoots.shoot01, 'Timeless Wedding Story', 'Wedding Photography', {
    note: 'Grand wedding ceremony and emotional celebration captures across Sri Lanka.',
  }),
  item('n-prewedding1', newShoots.shoot02, 'Cinematic Engagement Moments', 'Pre-Wedding / Engagement Photography', {
    note: 'Pre-wedding romantic concepts and intimate couple portraits in natural light.',
  }),
  item('n-grad1', newShoots.shoot03, 'Academic Milestone Honors', 'Graduation Photography', {
    note: 'Dignified graduation portraits and celebratory milestones.',
  }),
  item('n-vehicle1', newShoots.shoot04, 'Automotive Velocity & Form', 'Vehicle Photography', {
    note: 'High-contrast automotive reflections and dynamic vehicle lines.',
  }),
  item('n-sport1', newShoots.shoot05, 'Track & Field Adrenaline', 'Sports Photography', {
    note: 'High-speed action and athletic focus frozen in time.',
  }),
  item('n-wedding2', newShoots.shoot06, 'Sacred Union & Radiance', 'Wedding Photography', {
    note: 'Timeless wedding portraits and cultural ceremonies.',
  }),
  item('n-prewedding2', newShoots.shoot07, 'Golden Hour Sunset Romance', 'Pre-Wedding / Engagement Photography', {
    note: 'Scenic outdoor pre-shoot frames in warm golden natural light.',
  }),
  item('n-grad2', newShoots.shoot08, 'Convocation Triumph', 'Graduation Photography', {
    note: 'Celebration of scholarly achievement and lifelong friendship.',
  }),
  item('n-vehicle2', newShoots.shoot09, 'Precision Motor Rolling Frame', 'Vehicle Photography', {
    note: 'Two-wheeler and machine in motion across scenic roadways.',
  }),
  item('n-sport2', newShoots.shoot10, 'Peak Momentum & Power', 'Sports Photography', {
    note: 'Decisive sports plays and athletic dedication.',
  }),
  item('n-wedding3', newShoots.shoot11, 'Ceremonial Elegance', 'Wedding Photography', {
    note: 'Joyful family interactions and wedding memories.',
  }),
  item('n-prewedding3', newShoots.shoot12, 'Coastal Whispers & Promise', 'Pre-Wedding / Engagement Photography', {
    note: 'Atmospheric couple portraiture by the southern coast.',
  }),
  item('n-vehicle3', newShoots.shoot13, 'Automotive Craft & Detail', 'Vehicle Photography', {
    note: 'Detailed mechanical angles and custom machine craftsmanship.',
  }),
  item('n-sport3', newShoots.shoot14, 'Tournament Focus', 'Sports Photography', {
    note: 'Field championship and tournament intensity.',
  }),
  item('n-sig1', newShoots.shoot15, 'Signature Portraiture', 'Wedding Photography', {
    note: 'Editorial couple portraiture and timeless lighting.',
  }),
  item('n-sig2', newShoots.shoot16, 'Creative Monograph', 'Pre-Wedding / Engagement Photography', {
    note: 'Artistic pre-shoot visual story.',
  }),

  // --- Shoot 1: Editorial & Architecture ---
  item('f-arcade', editorial.arcade, 'The Colonial Arcade', 'Pre-Wedding / Engagement Photography', {
    note: 'A colonial arcade photographed end to end — framing white lace silhouette against rhythmic architectural arches.',
  }),
  item('f-staircase', editorial.staircase, 'Iron & Arch Descent', 'Architecture Photography', {
    note: 'Cast iron balustrade against a pristine white vaulted ceiling with classical structure and shadow play.',
  }),
  item('f-chandelier', editorial.chandelier, 'The Classical Landing', 'Wedding Photography', {
    note: 'A timeless venue interior captured under ambient chandelier lighting, emphasizing spatial symmetry and ironwork.',
  }),
  item('f-blueframe', editorial.blueFrame, 'Cyan Facade Study', 'Architecture Photography', {
    note: 'Clean interior composition balancing white architectural planes with a vibrant framed cyanotype print.',
  }),
  item('f-medusa', editorial.medusa, 'Sculptural Scale', 'Architecture Photography', {
    note: 'Architectural scale study placing the human figure beneath a wall-mounted metal relief to emphasize verticality.',
  }),
  item('f-railing', editorial.railingHigh, 'Balustrade Geometry', 'Architecture Photography', {
    note: 'Low-angle perspective emphasizing the craftsmanship of scrolled iron banisters against modern clean lines.',
  }),

  // --- Shoot 2: Street & Lifestyle Portraits ---
  item('f-lean', street.lean, 'Roadside Natural Light', 'Graduation Photography', {
    note: 'Natural daylight portrait utilizing compressed telephoto perspective to soften the coastal urban backdrop.',
  }),
  item('f-glance', street.glance, 'Quiet Horizon', 'Pre-Wedding / Engagement Photography', {
    note: 'Unposed glance captured during a coastal session, highlighting authentic emotion in natural ambient shade.',
  }),
  item('f-corridor', street.corridor, 'Open Shade Movement', 'Graduation Photography', {
    note: 'Portrait in open shade beside a pale architectural wall, capturing authentic movement and relaxed poise.',
  }),
  item('f-seated', street.seated, 'Concrete & Calm', 'Graduation Photography', {
    note: 'Seated portrait on a concrete architectural ledge with soft natural editorial lighting.',
  }),

  // --- shhot 4: Sports & Action ---
  item('f-rider1', field.riderFront, 'Evening Velocity', 'Vehicle Photography', {
    note: 'Motorcyclist in golden evening light on the open road, capturing sports speed and focus.',
  }),
  item('f-rider2', field.riderSeated, 'Paddock Ready', 'Vehicle Photography', {
    note: 'Candid rider portrait with machine in open field conditions.',
  }),
  item('f-turn', field.motionTurn, 'Decisive Pivot', 'Sports Photography', {
    note: 'Subject caught in mid-turn motion with backpack in natural tropical daylight.',
  }),
  item('f-fence', field.fenceLine, 'Perimeter Line', 'Sports Photography', {
    note: 'Athlete pausing along the boundary perimeter in direct midday sunlight.',
  }),

  // --- Wild Life: Wildlife & Coastal Nature ---
  item('f-island', nature.island, 'Wooded Lagoon Sanctuary', 'Pre-Wedding / Engagement Photography', {
    note: 'Wooded coastal island and boathouse across turquoise waters in southern Sri Lanka.',
  }),
  item('f-macaque-col', nature.macaqueColour, 'Canopy Reflex', 'Sports Photography', {
    note: 'Sri Lankan toque macaque reaching between lush jungle branches in native canopy.',
  }),
  item('f-surf', nature.surf, 'Southern Coastal Swell', 'Sports Photography', {
    note: 'Heavy surf breaking white over coastal rocks along the southern Sri Lankan coastline.',
  }),

  // --- Maheshika Portrait Series ---
  item('mah-01', '/photos/maheshika/maheshika-01.jpg', 'Botanical Bloom Portrait I', 'Pre-Wedding / Engagement Photography', {
    note: 'Close-up portrait with fresh florals and warm sunlight, capturing authentic radiance.',
  }),
  item('mah-02', '/photos/maheshika/maheshika-02.jpg', 'Floral Serenity Portrait II', 'Pre-Wedding / Engagement Photography', {
    note: 'Delicate floral framing in lush tropical nature.',
  }),
  item('mah-03', '/photos/maheshika/maheshika-03.jpg', 'Forest Walkway Monograph', 'Pre-Wedding / Engagement Photography', {
    note: 'Full-length portrait under an atmospheric forest canopy pathway.',
  }),
  item('mah-04', '/photos/maheshika/maheshika-04.jpg', 'Nature Canopy Reflections', 'Pre-Wedding / Engagement Photography', {
    note: 'Environmental portrait among sculptural tree branches with monochromatic depth.',
  }),
  item('mah-05', '/photos/maheshika/maheshika-05.jpg', 'Golden Hour Meadow Bouquet', 'Pre-Wedding / Engagement Photography', {
    note: 'Joyful floral gesture against soft woodland bokeh.',
  }),
]

export const portfolio = {
  featured,
}

export default portfolio
