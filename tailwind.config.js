/** @type {import('tailwindcss').Config} */
import daisyui from 'daisyui';

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        'fade-in': 'fade-in 200ms ease-out forwards',
        'slide-in': 'slide-in 200ms ease-out forwards',
        'slide-up': 'slide-up 200ms ease-out forwards',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slide-in': {
          '0%': { 
            opacity: '0',
            transform: 'translateY(-8px)'
          },
          '100%': { 
            opacity: '1',
            transform: 'translateY(0)'
          },
        },
        'slide-up': {
          '0%': { 
            opacity: '0',
            transform: 'translateY(16px)'
          },
          '100%': { 
            opacity: '1',
            transform: 'translateY(0)'
          },
        },
      },
      transitionProperty: {
        'height': 'height',
        'spacing': 'margin, padding',
      },
      transitionTimingFunction: {
        'bounce-in': 'cubic-bezier(0.17, 0.67, 0.83, 0.67)',
      },
      zIndex: {
        'toast': '1000',
        'modal': '1100',
        'popover': '1200',
        'tooltip': '1300',
      },
    },
  },
  plugins: [daisyui],
  daisyui: {
    themes: [
      "cupcake",
      "light",
      "dark",
    ],
  },
}
