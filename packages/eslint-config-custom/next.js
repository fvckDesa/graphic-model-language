module.exports = {
  extends: [
    "./base",
    "./typescript",
    "./react",
    "eslint-config-next",
    "eslint-config-turbo",
    "eslint-config-prettier",
  ].map(require.resolve),
  rules: {
    "@next/next/no-html-link-for-pages": "off",
  },
  parserOptions: {
    babelOptions: {
      presets: [require.resolve("next/babel")],
    },
  },
};
