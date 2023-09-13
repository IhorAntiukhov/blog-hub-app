/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}'
  ],
  theme: {
    fontFamily: {
      'sans': ['"Work Sans"', 'sans-serif']
    },
    colors: {
      primary: '#016A70',
      primarySaturated: '#418f94',
      secondary: '#73C67E',
      accent: '#00A9BC',
      neutral: {
        1: '#ffffe6',
        2: '#f7f7df',
        3: '#e6e6cf'
      },
      info: '#127be3',
      error: '#e32e12',
      errorSaturated: '#ea634e'
    },
    animation: {
      'shift-right': 'shiftRight 0.3s linear 1, shiftLeft 0.3s linear 3.7s 1 normal forwards'
    },
    extend: {
      keyframes: {
        shiftRight: {
          '0%': { transform: 'translateX(-120%)' },
          '100%': { transform: 'translateX(0)' }
        },
        shiftLeft: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-120%)' }
        }
      }
    },
  },
  plugins: [],
}

