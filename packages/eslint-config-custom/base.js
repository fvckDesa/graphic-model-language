/** @type {import("eslint").Linter.Config} */
module.exports = {
  env: { es2020: true },
  reportUnusedDisableDirectives: true,
  extends: ["eslint:recommended", "turbo", "prettier"],
  plugins: ["prettier"],
  rules: {
    "prettier/prettier": [
      "error",
      {
        endOfLine: "auto",
      },
    ],
    indent: [
      "error",
      2,
      {
        SwitchCase: 1,
      },
    ],
    quotes: ["error", "double", { avoidEscape: true }],
    semi: ["error", "always"],
  },
  overrides: [
    {
      files: ["*.cjs"],
      env: {
        node: true,
      },
    },
  ],
};
