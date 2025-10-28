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
      fontFamily: {
        'serif': ['Playfair Display', 'Georgia', 'serif'],
        'sans': ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
      },
      borderRadius: {
        card: '0'
      },
      boxShadow: {
        card: 'none'
      }
    },
  },
  plugins: [],
}





