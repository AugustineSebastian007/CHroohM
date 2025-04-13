/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx,css}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#FDD835",  // Yellow color from design
        secondary: "#FF6E40", // Orange color from design
        dark: "#121212",
        light: "#F5F5F5",
        accent1: "#4FC3F7", // Light blue
        accent2: "#FF8A65", // Light orange
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
} 