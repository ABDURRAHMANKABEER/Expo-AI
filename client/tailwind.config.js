/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#4F46E5',
          dark: '#06B6D4'
        },
        accent: '#6366F1'
      }
    }
  },
  plugins: [],
};
