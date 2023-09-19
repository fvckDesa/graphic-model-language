const { project } = require("tailwind-config");

/** @type {import('tailwindcss').Config} */
module.exports = {
  prefix: "simple",
  content: ["./nodes/**/*.{js,ts,jsx,tsx}", "./edges/**/*.{js,ts,jsx,tsx}"],
  presets: [project],
  plugins: [],
};
