/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#2c3e50",
        secondary: "#34495e",
        accent: "#3498db",
        background: "#f4f7f6",
        surface: "#ffffff",
      }
    },
  },
  plugins: [],
}
