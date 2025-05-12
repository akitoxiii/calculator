/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          'SF Pro Display',
          'SF Pro Text',
          'San Francisco',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'sans-serif',
        ],
      },
      colors: {
        primary: {
          DEFAULT: '#1d1d1f', // Appleの黒
          light: '#f5f5f7',   // Appleの薄いグレー
          dark: '#000000',
        },
        accent: {
          DEFAULT: '#0071e3', // Appleの青
          light: '#2997ff',
          dark: '#004080',
        },
        gray: {
          50: '#f5f5f7',
          100: '#e5e5ea',
          200: '#d1d1d6',
          300: '#aeaeb2',
          400: '#86868b',
          500: '#6e6e73',
          600: '#48484a',
          700: '#3a3a3c',
          800: '#1c1c1e',
          900: '#000000',
        },
        success: '#1ec773',
        warning: '#ffd60a',
        error: '#ff453a',
        white: '#fff',
        black: '#000',
      },
      borderRadius: {
        xl: '1.5rem',
        '2xl': '2rem',
        '3xl': '2.5rem',
        full: '9999px',
      },
      boxShadow: {
        apple: '0 4px 24px 0 rgba(0,0,0,0.08)',
      },
      transitionProperty: {
        spacing: 'margin, padding',
      },
      transitionTimingFunction: {
        apple: 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      transitionDuration: {
        400: '400ms',
      },
    },
  },
  plugins: [],
} 