const sharedConfig = require("tailwind-config");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./nodes/**/*.{js,ts,jsx,tsx}"],
  presets: [sharedConfig],
  plugins: [],
};
