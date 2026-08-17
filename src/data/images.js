/**
 * Central image registry — every photograph used on the site is declared once here.
 *
 * All files are real Tilnogz Photography frames from shoot sessions:
 *   editorial/  <- Shoot 1   (1536x2048 — high resolution)
 *   street/     <- Shoot 2   (1536x2048 — high resolution)
 *   field/      <- shhot 4   (Sports / motorcycle action & movement)
 *   nature/     <- Wild Life (Wildlife & coastal action)
 *   studio/     <- Tharindu Lakshan photographer contact sheet (2048x1024)
 */

const img = (src, w, h, alt, extra = {}) => ({ src, w, h, alt, ...extra })

export const editorial = {
  arcade: img(
    '/photos/editorial/ed-01.jpg',
    1536,
    2048,
    'Woman in a white lace dress walking along an architectural plant-lined colonial arcade with arched openings.'
  ),
  arcadeWide: img(
    '/photos/editorial/ed-02.jpg',
    1536,
    2048,
    'Editorial portrait beside a framed blue-toned architectural print in an open light-filled interior.'
  ),
  blueFrame: img(
    '/photos/editorial/ed-03.jpg',
    1412,
    2048,
    'Subject in white standing beside a tall framed cyanotype-blue print of an arched facade.'
  ),
  chandelier: img(
    '/photos/editorial/ed-04.jpg',
    1536,
    2048,
    'Portrait on a grand landing beneath a chandelier, framed by a classical archway and wrought iron railing.'
  ),
  medusa: img(
    '/photos/editorial/ed-05.jpg',
    1032,
    2048,
    'Subject looking up at a circular metal relief sculpture mounted on a minimalist wall.'
  ),
  staircase: img(
    '/photos/editorial/ed-06.jpg',
    1536,
    2048,
    'Descending an ornate black wrought iron staircase beneath a vaulted white arch.'
  ),
  railingRed: img(
    '/photos/editorial/ed-07.jpg',
    1536,
    2048,
    'Architectural angle along a scrolled iron banister with a crimson accent panel and white column.'
  ),
  railingHigh: img(
    '/photos/editorial/ed-08.jpg',
    1536,
    2048,
    'Low-angle perspective through a cast iron balustrade at a figure leaning on the upper handrail.'
  ),
}

export const street = {
  lean: img(
    '/photos/street/st-01.jpg',
    1536,
    2048,
    'Lifestyle portrait — subject in chambray shirt leaning against a concrete bench with soft natural light.'
  ),
  glance: img(
    '/photos/street/st-02.jpg',
    1536,
    2048,
    'Street portrait — subject glancing thoughtfully off-camera against a soft-focus urban backdrop.'
  ),
  corridor: img(
    '/photos/street/st-03.jpg',
    1536,
    2048,
    'Portrait in open shade beside a pale architectural wall, capturing authentic movement.'
  ),
  seated: img(
    '/photos/street/st-04.jpg',
    1536,
    2048,
    'Seated portrait on a concrete architectural ledge, natural editorial lighting.'
  ),
}

export const field = {
  riderFront: img(
    '/photos/field/fd-01.jpg',
    400,
    400,
    'Motorcyclist in golden evening light on the road, sports and movement photography.',
    { lowRes: true }
  ),
  riderSeated: img(
    '/photos/field/fd-02.jpg',
    400,
    400,
    'Rider on motorcycle turning towards camera, candid sports and field photography.',
    { lowRes: true }
  ),
  fenceLine: img(
    '/photos/field/fd-03.jpg',
    400,
    400,
    'Subject leaning back on a rail in front of a chain link fence in outdoor sunlight.',
    { lowRes: true }
  ),
  motionTurn: img(
    '/photos/field/fd-04.jpg',
    400,
    400,
    'Dynamic action portrait turning mid-step with backpack in motion.',
    { lowRes: true }
  ),
  handPause: img(
    '/photos/field/fd-05.jpg',
    400,
    400,
    'Action lifestyle portrait, close frame in warm sunlight.',
    { lowRes: true }
  ),
  greenLight: img(
    '/photos/field/fd-06.jpg',
    400,
    400,
    'Portrait in natural light with greenery and ambient tones.',
    { lowRes: true }
  ),
}

export const nature = {
  surf: img(
    '/photos/nature/nt-01.jpg',
    400,
    400,
    'Surf breaking white over coastal rocks along the southern Sri Lankan coastline.',
    { lowRes: true }
  ),
  palms: img(
    '/photos/nature/nt-02.jpg',
    400,
    400,
    'Coconut palms bending in the coastal breeze above a headland.',
    { lowRes: true }
  ),
  island: img(
    '/photos/nature/nt-03.jpg',
    400,
    400,
    'Wooded coastal island and boathouse across turquoise waters.',
    { lowRes: true }
  ),
  treeBike: img(
    '/photos/nature/nt-04.jpg',
    400,
    400,
    'Motorcycle parked under a giant banyan canopy beside a roadside structure.',
    { lowRes: true }
  ),
  macaqueColour: img(
    '/photos/nature/nt-05.jpg',
    400,
    400,
    'Sri Lankan toque macaque reaching between jungle branches.',
    { lowRes: true }
  ),
  macaqueMono: img(
    '/photos/nature/nt-06.jpg',
    400,
    400,
    'Monochrome wildlife study of a macaque seated on a boulder.',
    { lowRes: true }
  ),
  bulbul: img(
    '/photos/nature/nt-07.jpg',
    400,
    400,
    'Endemic bird perched among lush tropical foliage.',
    { lowRes: true }
  ),
  crow: img(
    '/photos/nature/nt-08.jpg',
    400,
    400,
    'Silhouetted crow perched on a bare branch against the morning sky.',
    { lowRes: true }
  ),
}

export const studio = {
  contactSheet: img(
    '/photos/studio/photographer-contact-sheet.jpg',
    2048,
    1024,
    'Four-frame on-location shoot contact sheet of photographer Tharindu Lakshan with Sony Alpha gear.'
  ),
}

export const images = { editorial, street, field, nature, studio }
export default images
