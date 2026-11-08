/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#161412",
        paper: "#f3eee4",
        cream: "#faf7f2",
        gold: "#c4a36a",
        sage: "#2c4a40",
        rust: "#b85c38",
      },
      fontFamily: {
        serif: ["Fraunces", "Georgia", "serif"],
        sans: ["Outfit", "system-ui", "sans-serif"],
      },
      boxShadow: {
        paper: "0 24px 80px -24px rgba(22, 20, 18, 0.35)",
      },
    },
  },
  plugins: [],
};
