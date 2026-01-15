module.exports = {
  content: [
    "../src/index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'background-main': '#FEF3E2',
        'primary': '#EB6424',
        'secondary': '#89AC46',
        'title': '#333333',
        'subtitle': '#666666',
        'primary-dark': "#c1531e"
      },
      fontFamily: {
        'nunito': ['Nunito Sans', 'sans-serif'],
        'lobster': ['Lobster Two', 'cursive'],
      },
    },
  },
  plugins: [],
}
