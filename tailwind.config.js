export default {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    './public/index.html'
  ],
  theme: {
    extend: {
      colors: {
        'eco-green': '#163D36', // Custom dark green
        'eco-yellow': '#FFD600', // Custom strong yellow
      },
      fontFamily: {
        playfair: ['Playfair Display', 'serif'],
        nunito: ['Nunito', 'ui-sans-serif', 'system-ui'],
        poppins: ['Poppins', 'ui-sans-serif', 'system-ui'],
        inter: ['Inter', 'ui-sans-serif', 'system-ui'],
      },
    },
  },
  plugins: [],
}; 