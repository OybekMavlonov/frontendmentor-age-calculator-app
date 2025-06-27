export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        poppins: ['"Poppins"', 'sans-serif'],
      },
      colors: {
        white: "hsl(0, 0%, 100%)",
        black: "hsl(0, 0%, 0%)",
        purple: "hsl(259, 100%, 65%)",
        red: "hsl(0, 100%, 67%)",
        grey: {
          100: "hsl(0, 0%, 94%)",
          200: "hsl(0, 0%, 86%)",
          500: "hsl(0, 1%, 44%)"
        }
      }
    },
  },
}
