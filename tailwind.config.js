/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        mono: ['DM Mono', 'monospace'],
        sans: ['DM Sans', 'sans-serif'],
      },
      colors: {
        primary: '#1A56DB',
        positive: '#0E9F6E',
        negative: '#E02424',
        neutral: '#6B7280',
        border: '#E5E7EB',
        card: '#FFFFFF',
        background: '#F8F9FA',
      },
    },
  },
  plugins: [],
}