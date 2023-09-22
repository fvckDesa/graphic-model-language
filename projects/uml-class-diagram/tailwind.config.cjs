const { project } = require("tailwind-config");

/** @type {import('tailwindcss').Config} */
module.exports = {
  prefix: "uml-",
  content: ["./nodes/**/*.{js,ts,jsx,tsx}", "./edges/**/*.{js,ts,jsx,tsx}"],
  presets: [project],
  plugins: [],
};
