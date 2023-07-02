module.exports = {
  parser: "@typescript-eslint/parser",
  extends: ["plugin:@typescript-eslint/recommended"],
  plugins: ["@typescript-eslint"],
  rules: {
    // Additional rules or overrides can be added here
  },
};

// module.exports = {
//   root: true,
//   parser: "@typescript-eslint/parser",
//   plugins: ["@typescript-eslint"],
//   extends: [
//     "eslint:recommended",
//     "plugin:@typescript-eslint/recommended",
//     "plugin:@typescript-eslint/recommended-requiring-type-checking",
//   ],
//   parserOptions: {
//     ecmaVersion: 2021,
//     sourceType: "module",
//     project: "./tsconfig.json",
//   },
//   rules: {
//     // General ESLint rules
//     "no-console": "error",
//     "no-debugger": "error",
//     "no-unused-vars": "error",

//     // TypeScript-specific rules
//     "@typescript-eslint/explicit-module-boundary-types": "error",
//     "@typescript-eslint/no-unused-vars": "error",
//     "@typescript-eslint/no-unsafe-assignment": "error",
//     "@typescript-eslint/no-unsafe-member-access": "error",
//     "@typescript-eslint/no-unsafe-call": "error",
//     "@typescript-eslint/no-unsafe-return": "error",
//     "@typescript-eslint/restrict-template-expressions": "error",
//     "@typescript-eslint/no-floating-promises": "error",
//     "@typescript-eslint/require-await": "error",
//     "@typescript-eslint/no-misused-promises": "error",
//     "@typescript-eslint/prefer-nullish-coalescing": "error",
//     "@typescript-eslint/prefer-optional-chain": "error",
//     "@typescript-eslint/prefer-ts-expect-error": "error",
//   },
// };
