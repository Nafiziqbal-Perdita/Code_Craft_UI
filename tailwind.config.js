/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          blue: '#00A8E8',
          lightBlue: '#4FC3F7',
          darkBlue: '#0288D1',
        },
        secondary: {
          teal: '#26C6DA',
          mint: '#4DB6AC',
          aqua: '#80DEEA',
        },
        neutrals: {
          white: '#FFFFFF',
          lightGray: '#F8F9FA',
          mediumGray: '#E9ECEF',
          darkGray: '#6C757D',
          charcoal: '#343A40',
        },
        accent: {
          pink: '#FF6B9D',
          coral: '#FF8A65',
          yellow: '#FFD54F',
          green: '#81C784',
        },
      },
      fontFamily: {
        primary: ['SF Pro Display', '-apple-system', 'system-ui', 'sans-serif'],
        secondary: ['Inter', 'Helvetica', 'Arial', 'sans-serif'],
      },
      fontSize: {
        '5xl': '36px',
      },
      borderRadius: {
        sm: '8px',
        md: '12px',
        lg: '16px',
        xl: '20px',
        '2xl': '24px',
        full: '9999px',
      },
      boxShadow: {
        clay: '0 12px 48px rgba(0,0,0,0.15), 0 6px 24px rgba(0,0,0,0.1)',
        floating: '0 4px 24px rgba(0,0,0,0.08)',
      },
      backgroundImage: {
        'gradient-accent': 'linear-gradient(135deg, #00A8E8 0%, #4FC3F7 100%)',
      },
      spacing: {
        xs: '4px',
        sm: '8px',
        md: '16px',
        lg: '24px',
        xl: '32px',
        '2xl': '48px',
        '3xl': '64px',
      },
      transitionTimingFunction: {
        clay: 'ease-in-out',
      },
      transitionDuration: {
        slow: '500ms',
      },
    },
  },
  plugins: [],
};
