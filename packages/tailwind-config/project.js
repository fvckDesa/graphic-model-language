const base = require("./base");

/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [base],
  corePlugins: {
    preflight: false,
  },
};
