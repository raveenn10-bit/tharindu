/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Manrope', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
        body: ['DM Sans', 'sans-serif'],
        cormorant: ['Cormorant Garamond', 'serif'],
      },
      colors: {
        paper: {
          DEFAULT: '#FAF8F5',
          pure: '#FFFFFF',
          muted: '#F4F1EB',
          subtle: '#EDE8E0',
          card: '#FBF9F6',
        },
        charcoal: {
          DEFAULT: '#111111',
          light: '#242424',
          muted: '#555552',
          subtle: '#888884',
        },
        copper: {
          DEFAULT: '#C4704F',
          dark: '#A35838',
          light: '#EAD7CD',
        },
        sand: {
          DEFAULT: '#E5DFD7',
          light: '#EFECE6',
          dark: '#D0C7BC',
        },
      },
      letterSpacing: {
        tighter: '-0.04em',
        tight: '-0.02em',
        normal: '0em',
        wide: '0.04em',
        wider: '0.08em',
        widest: '0.16em',
        ultra: '0.24em',
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '30': '7.5rem',
      },
      animation: {
        'marquee': 'marquee 25s linear infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
    },
  },
  plugins: [],
}
