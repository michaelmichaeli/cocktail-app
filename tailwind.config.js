/** @type {import('tailwindcss').Config} */
import daisyui from 'daisyui';
import daisyuiThemes from 'daisyui/src/theming/themes';

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
      {
        light: {
          ...daisyuiThemes["light"],
          primary: "#2563eb",  // blue-600
          "primary-focus": "#1d4ed8",  // blue-700
          secondary: "#8b5cf6",  // violet-500
          "secondary-focus": "#7c3aed",  // violet-600
          accent: "#f59e0b",  // amber-500
          "accent-focus": "#d97706",  // amber-600
          error: "#dc2626",  // red-600
        },
        dark: {
          ...daisyuiThemes["dark"],
          primary: "#3b82f6",  // blue-500
          "primary-focus": "#2563eb",  // blue-600
          secondary: "#a855f7",  // violet-500
          "secondary-focus": "#9333ea",  // violet-600
          accent: "#fbbf24",  // amber-400
          "accent-focus": "#f59e0b",  // amber-500
          error: "#ef4444",  // red-500
        },
      },
      "light",
      "dark",
    ],
  },
}
