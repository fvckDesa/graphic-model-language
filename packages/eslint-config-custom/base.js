/** @type {import("eslint").Linter.Config} */
module.exports = {
  env: { es2020: true },
  reportUnusedDisableDirectives: true,
  extends: ["eslint:recommended"],
  rules: {
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
