/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        palette: {
          text: '#bebabf',
          bg: '#413441',
          primary: '#fdf2f2',
          secondary: '#d6d5e7',
          accent: '#eaeafb',
          // Elevated surfaces & borders for rich UI hierarchy
          surface: '#362a36',
          card: '#3b2f3b',
          border: '#544354',
          borderHover: '#725c72',
        },
        google: {
          blue: '#4285F4',
          red: '#EA4335',
          yellow: '#FBBC05',
          green: '#34A853'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace']
      },
      boxShadow: {
        'subtle': '0 1px 3px 0 rgba(0, 0, 0, 0.3)',
        'panel': '0 4px 20px -2px rgba(25, 18, 25, 0.45)',
      }
    },
  },
  plugins: [],
}
