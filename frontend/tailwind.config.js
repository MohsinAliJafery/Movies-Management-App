/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html", 
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  darkMode: 'class', // Enable dark mode class-based toggling
  theme: {
    extend: {
      colors: {
        'primary': '#fff' // Color for light mode
      },
    },
  },
  plugins: [],
}

