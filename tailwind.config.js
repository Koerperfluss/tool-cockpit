/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#0a0a0a',
        card: '#161618',
        edge: '#26262a',
        accent: '#34d399',
      },
    },
  },
  plugins: [],
};
