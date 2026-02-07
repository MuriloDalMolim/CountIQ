/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#FEFDF9',  
          100: '#F5EFE6', 
          500: '#C05621', 
          600: '#9C4221', 
        }
      }
    },
  },
  plugins: [],
}