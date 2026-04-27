/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#E23744',
          primaryHover: '#C92F3A',
          secondary: '#FF7A00',

          background: '#FFFFFF',
          backgroundLight: '#F8F9FB',

          textPrimary: '#1C1C1C',
          textSecondary: '#6B6B6B',
          textMuted: '#9E9E9E',

          success: '#22C55E',
          warning: '#FACC15',
          error: '#EF4444',

          border: '#E5E7EB',
        },
      },
    },
  },
  plugins: [],
}

