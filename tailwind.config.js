/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/*.{astro,html,js,jsx,ts,tsx}',
    './public/**/*.html'
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          bg: '#261315',
          ink: '#F3E7DF'
        },
        surface: '#FAF8F6',
        card: '#FFFFFF',
        accent: '#A38469'
      },
      borderRadius: {
        card: '14px'
      },
      boxShadow: {
        card: '0 8px 24px rgba(0,0,0,0.06)'
      }
    },
  },
  plugins: [],
}





