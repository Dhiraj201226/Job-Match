/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1d4ed8',
        secondary: '#9333ea',
        background: '#0f172a',
        surface: '#1e293b',
        textMain: '#f8fafc',
        textMuted: '#94a3b8',
      }
    },
  },
  plugins: [],
}
