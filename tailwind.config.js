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
          50: "#f9fafb",
          100: "#f3f4f6",
          200: "#e5e7eb",
          300: "#d1d5db",
          400: "#9ca3af",
          500: "#6b7280",
          600: "#4b5563",
          700: "#374151",
          800: "#1f2937",
          900: "#111827",
        },
        accent: {
          light: "#6600ff",
          lightHover: "#6000ef",
          dark: "#ff4500",
          darkHover: "#e63a00",
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
