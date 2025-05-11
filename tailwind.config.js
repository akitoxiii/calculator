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
      colors: {
        primary: {
          DEFAULT: '#2563eb', // 青系
          light: '#3b82f6',
          dark: '#1e40af',
        },
        accent: {
          DEFAULT: '#f59e42', // オレンジ系
          light: '#fbbf24',
          dark: '#b45309',
        },
        success: '#22c55e',
        warning: '#facc15',
        error: '#ef4444',
      },
    },
  },
  plugins: [],
} 