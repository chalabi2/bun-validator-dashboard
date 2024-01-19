/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["components/**/*.{js,jsx,ts,tsx}", "pages/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        purple: {
          damp: "#6674D9",
        },
        gray: {
          bg: "#3d494c",
          lightbg: "#9ecbd4",
          bglighthover: "#c5e0e8",
          bgdarkhover: "#2c3a3d",
        },
        primary: {
          50: "#e5e7f9",
          100: "#bec4ef",
          200: "#929ce4",
          300: "#6674d9",
          400: "#4657d1",
          500: "#2539c9",
          600: "#2133c3",
          700: "#1b2cbc",
          800: "#1624b5",
          900: "#0d17a9",
        },
      },
    },
  },
  plugins: [
    require("@tailwindcss/typography"),
    require("@tailwindcss/aspect-ratio"),
    require("@tailwindcss/forms"),
    require("tailwind-scrollbar-hide"),
  ],
};
