/**
 * Central image registry — every photograph used on the site is declared once here.
 */

const img = (src, w, h, alt, extra = {}) => ({ src, w, h, alt, ...extra })

export const newShoots = {
  shoot01: img('/photos/shoots/IMG_2311.JPG.jpeg', 1920, 1080, 'Wedding & Pre-Shoot story frame'),
  shoot02: img('/photos/shoots/IMG_2312.JPG.jpeg', 1920, 1080, 'Pre-Wedding & Engagement session'),
  shoot03: img('/photos/shoots/IMG_2313.JPG.jpeg', 1920, 1080, 'Graduation portraiture session'),
  shoot04: img('/photos/shoots/IMG_2314.JPG.jpeg', 1920, 1080, 'Vehicle and automotive aesthetics'),
  shoot05: img('/photos/shoots/IMG_2315.JPG.jpeg', 1920, 1080, 'Sports action and movement'),
  shoot06: img('/photos/shoots/IMG_2316.JPG.jpeg', 1920, 1080, 'Wedding ceremony celebration'),
  shoot07: img('/photos/shoots/IMG_2317.JPG.jpeg', 1920, 1080, 'Pre-wedding romantic moments'),
  shoot08: img('/photos/shoots/IMG_5591.JPG.jpeg', 1920, 1080, 'Graduation milestone capture'),
  shoot09: img('/photos/shoots/IMG_5595.JPG.jpeg', 1920, 1080, 'Vehicle photography rolling frame'),
  shoot10: img('/photos/shoots/IMG_5596.JPG.jpeg', 1920, 1080, 'Sports photography focus'),
  shoot11: img('/photos/shoots/IMG_5600.JPG.jpeg', 1920, 1080, 'Wedding candid interactions'),
  shoot12: img('/photos/shoots/IMG_5605.JPG.jpeg', 1920, 1080, 'Pre-wedding editorial setting'),
  shoot13: img('/photos/shoots/IMG_5607.JPG.jpeg', 1920, 1080, 'Vehicle details and precision lines'),
  shoot14: img('/photos/shoots/IMG_5608.JPG.jpeg', 1920, 1080, 'Sports tournament coverage'),
  shoot15: img('/photos/shoots/34205917-d2e7-4cd5-a44d-7705545ea2da.jpg.jpeg', 1920, 1080, 'Signature editorial portrait'),
  shoot16: img('/photos/shoots/960515ed-4089-416e-a919-bbcc63f5a41d.jpg.jpeg', 1920, 1080, 'Creative monograph frame'),
}

export const editorial = {
  arcade: img('/photos/editorial/ed-01.jpg', 1536, 2048, 'Colonial arcade editorial portraiture.'),
  arcadeWide: img('/photos/editorial/ed-02.jpg', 1536, 2048, 'Architectural interior and soft diffusion.'),
  blueFrame: img('/photos/editorial/ed-03.jpg', 1412, 2048, 'Cyanotype print architectural study.'),
  chandelier: img('/photos/editorial/ed-04.jpg', 1536, 2048, 'Grand landing beneath ambient chandelier lighting.'),
  medusa: img('/photos/editorial/ed-05.jpg', 1032, 2048, 'Architectural scale study.'),
  staircase: img('/photos/editorial/ed-06.jpg', 1536, 2048, 'Wrought iron staircase descent.'),
  railingRed: img('/photos/editorial/ed-07.jpg', 1536, 2048, 'Curvilinear ironwork and crimson accent.'),
  railingHigh: img('/photos/editorial/ed-08.jpg', 1536, 2048, 'Low-angle balustrade craftsmanship.'),
}

export const street = {
  lean: img('/photos/street/st-01.jpg', 1536, 2048, 'Lifestyle portrait with soft natural light.'),
  glance: img('/photos/street/st-02.jpg', 1536, 2048, 'Street portrait and thoughtful glance.'),
  corridor: img('/photos/street/st-03.jpg', 1536, 2048, 'Movement in natural open shade.'),
  seated: img('/photos/street/st-04.jpg', 1536, 2048, 'Concrete architectural ledge portrait.'),
}

export const field = {
  riderFront: img('/photos/field/fd-01.jpg', 400, 400, 'Motorcyclist in golden evening light.'),
  riderSeated: img('/photos/field/fd-02.jpg', 400, 400, 'Candid rider portrait in field conditions.'),
  fenceLine: img('/photos/field/fd-03.jpg', 400, 400, 'Athlete pausing in midday sun.'),
  motionTurn: img('/photos/field/fd-04.jpg', 400, 400, 'Dynamic action portrait in motion.'),
  handPause: img('/photos/field/fd-05.jpg', 400, 400, 'Action lifestyle portrait in warm sunlight.'),
  greenLight: img('/photos/field/fd-06.jpg', 400, 400, 'Field action portrait in ambient tones.'),
}

export const nature = {
  surf: img('/photos/nature/nt-01.jpg', 400, 400, 'Surf breaking white along the southern coast.'),
  palms: img('/photos/nature/nt-02.jpg', 400, 400, 'Coconut palms in coastal breeze.'),
  island: img('/photos/nature/nt-03.jpg', 400, 400, 'Wooded island and boathouse across turquoise waters.'),
  treeBike: img('/photos/nature/nt-04.jpg', 400, 400, 'Two-wheeler staged beneath banyan canopy.'),
  macaqueColour: img('/photos/nature/nt-05.jpg', 400, 400, 'Sri Lankan toque macaque in jungle canopy.'),
  macaqueMono: img('/photos/nature/nt-06.jpg', 400, 400, 'Monochrome wildlife study on boulder.'),
  bulbul: img('/photos/nature/nt-07.jpg', 400, 400, 'Tropical bird perched in foliage.'),
  crow: img('/photos/nature/nt-08.jpg', 400, 400, 'Silhouetted bird against morning sky.'),
}

export const images = { newShoots, editorial, street, field, nature }
export default images
