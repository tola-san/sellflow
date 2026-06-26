
/** @type {import('tailwindcss').Config} */
export default {
  content: [
  './index.html',
  './src/**/*.{js,ts,jsx,tsx}'
],
  theme: {
    extend: {
      colors: {
        // New brand palette
        brand: {
          DEFAULT: '#8c60f3',
          hover: '#7a4ee8',
          soft: '#ede7fd',
        },
        ink: '#353148',
        muted: '#8e8a9c',
        line: '#cccad2',
        surface: '#e4e0ec',
        canvas: '#f8f6fc',
      },
      borderRadius: {
        '2xl': '16px',
        '3xl': '20px',
        '4xl': '24px',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['"Plus Jakarta Sans"', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 4px 24px -4px rgba(53, 49, 72, 0.08)',
        glow: '0 8px 40px -8px rgba(140, 96, 243, 0.35)',
        card: '0 10px 40px -12px rgba(53, 49, 72, 0.12)',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        gradient: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        gradient: 'gradient 12s ease infinite',
      },
    },
  },
  plugins: [],
}

