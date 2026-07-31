/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'bg-base': '#0B0E14',
        'bg-surface': '#131720',
        'border-subtle': '#232838',
        'text-primary': '#E6E8EE',
        'text-secondary': '#8A93A6',
        'accent-primary': '#5B8CFF',
        'accent-success': '#33C481',
        'accent-warning': '#F5A623',
        'accent-danger': '#EF4B4B',
      },
      fontFamily: {
        ui: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}
