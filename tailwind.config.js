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
      secondarySaturated: '#96d49e',
      accent: '#00A9BC',
      neutral: {
        1: '#ffffe6',
        2: '#f7f7df',
        3: '#e6e6cf',
        4: '#808077'
      },
      neutralSaturated: {
        1: '#f0f0d8',
        2: '#a0a093',
      },
      info: '#127be3',
      error: '#e32e12',
      errorSaturated: '#ea634e'
    },
    animation: {
      'shift-right': 'shiftRight 0.3s linear 1, shiftLeft 0.3s linear 3.7s 1 normal forwards',
      'open-dropdown': 'openDropdown 0.3s linear 1 forwards',
      'close-dropdown': 'closeDropdown 0.3s linear 1 forwards'
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
        },
        openDropdown: {
          '0%': { transform: 'scaleY(0%)' },
          '100%': { transform: 'scaleY(100%)' }
        },
        closeDropdown: {
          '0%': { transform: 'scaleY(100%)' },
          '100%': { transform: 'scaleY(0%)' }
        }
      }
    },
  },
  plugins: [],
}

