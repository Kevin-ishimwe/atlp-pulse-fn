module.exports = {
  content: ['./src/**/*.{ts,tsx}', './index.html'],
  darkMode: 'class',
  theme: {
    extend: {
      screens: {
        sm: '375px',
        md: '768px',
        lg: '976px',
        xl: '1440px',
      },
      colors: {
        primary: '#148FB6',
        secondary: '#173B3F',
        tertiary: '#F3F4F6',
        'light-bg': '#F9F9FB',
        'light-text': '#111827',
        'header-text': '#173B3F',
        'dark-text-fill': '#F3F4F6',
        'dark-bg': '#1F2A37',
        'dark-frame-bg': '#262E3D',
        'dark-tertiary': '#374151',
        'divider-bg': '#E5E7EB',
        'dark-45': '#00000073',
        'border-dark': '#5f5b5b80',
      },
      fontFamily: {
        Inria: ['Inria Serif', 'serif'],
        josefin: ['Josefin Sans', 'sans-serif'],
        lexend: ['Lexend Deca', 'sans-serif'],
        sans: ['PT Serif', 'serif'],
      },
      extend: {
        borderRadius: {
          '4xl': '2rem',
        },
        keyframes: {
          wave: {
            '0%': { transform: 'rotate(0.0deg)' },
            '10%': { transform: 'rotate(14deg)' },
            '20%': { transform: 'rotate(-8deg)' },
            '30%': { transform: 'rotate(14deg)' },
            '40%': { transform: 'rotate(-4deg)' },
            '50%': { transform: 'rotate(10.0deg)' },
            '60%': { transform: 'rotate(0.0deg)' },
            '100%': { transform: 'rotate(0.0deg)' },
          },
        },
        animation: {
          'waving-hand': 'wave 10s linear infinite',
        },
      },
    },
    plugins: [],
  },
};
