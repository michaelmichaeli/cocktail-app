/** @type {import('tailwindcss').Config} */
import daisyui from 'daisyui';

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUpAndFade: {
          '0%': { opacity: '0', transform: 'translateY(4px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        highlight: {
          '0%': { 
            backgroundColor: 'transparent',
          },
          '15%': {
            backgroundColor: 'hsl(var(--p) / 0.15)',
          },
          '100%': {
            backgroundColor: 'transparent',
          },
        }
      },
      animation: {
        fadeIn: 'fadeIn 150ms ease-out',
        slideUpAndFade: 'slideUpAndFade 150ms cubic-bezier(0.16, 1, 0.3, 1)',
        highlight: 'highlight 750ms cubic-bezier(0.4, 0, 0.2, 1)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(circle at center, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [daisyui],
  daisyui: {
    themes: ["light", "dark"],
    base: true,
    styled: true,
    utils: true,
    rtl: false,
    prefix: "",
    logs: false,
  },
}
