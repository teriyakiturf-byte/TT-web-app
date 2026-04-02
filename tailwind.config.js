/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Montserrat', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        tt: {
          forest:       '#1B4332',
          lime:         '#95D5B2',
          orange:       '#FF6B35',
          charcoal:     '#2C3E50',
          cream:        '#F5F1E8',
          'light-lime': '#E8F5E9',
          'light-orange':'#FFF4E6',
        },
      },
    },
  },
  plugins: [],
}
