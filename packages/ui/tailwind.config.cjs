const sharedConfig = require("tailwind-config");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}", "./index.{js,ts,jsx,tsx,mdx}"],
  presets: [sharedConfig],
  plugins: [],
};
