/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    fontFamily: {
      "sans": ['"Work Sans"', 'sans-serif']
    },
    colors: {
      primary: "#016A70",
      secondary: "#73C67E",
      accent: "#00A9BC",
      neutral: {
        1: "#ffffe6",
        2: "#f7f7df",
        3: "#e6e6cf"
      }
    },
    extend: {},
  },
  plugins: [],
}

