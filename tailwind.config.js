/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        paper: '#fdf6e3',
        'paper-deep': '#efe6cf',
        ink: '#1b1b1b',
        panel: '#fffdf7',
        accent: '#e4572e',
      },
      boxShadow: {
        paper: '4px 4px 0 #1b1b1b',
      },
      fontFamily: {
        display: ['Bangers', 'cursive'],
      },
    },
  },
  plugins: [],
};
