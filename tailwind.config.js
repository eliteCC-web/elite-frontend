/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Colores del logo de Elite
        red: {
          600: "#e11d48", // Rojo del logo
          700: "#be123c",
        },
        blue: {
          700: "#1d4ed8", // Azul del logo
          800: "#1e40af",
        },
        yellow: {
          400: "#facc15", // Amarillo del logo
          500: "#eab308",
        },
        green: {
          500: "#22c55e", // Verde del logo
          600: "#16a34a",
        },
        purple: {
          600: "#9333ea", // Púrpura del logo
          700: "#7e22ce",
        },
      },
    },
  },
  plugins: [],
}