/* eslint-env node */
module.exports = {
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
  ignorePatterns: [".eslintrc.js", "jest.config.js", "*.js"], // Please don't lint these files...
  rules: {
    'no-empty':'off', // SICP JS requires empty else-clauses
    'no-unused-vars':'off' // unused variables is quite common in teaching-code
  },
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  root: true,
  parserOptions: {
    // which JavaScript version
    "ecmaVersion": "latest"
  },
  env: {
        "browser": true,
        "node": true,
        "jest": true
  },
  overrides: [{
    files: ['*.ts'],
    extends: ["plugin:@typescript-eslint/recommended",
      "plugin:@typescript-eslint/recommended-requiring-type-checking",],
    parserOptions: {
      tsconfigRootDir: __dirname,
      project: ["./tsconfig.json"],
    },
    // This rule set correspond quite well to the style guide used in the PKD course
    rules: {
      // makes "I am " + age + " years old" possible for combining number with string
      "@typescript-eslint/restrict-plus-operands": "off",

      // end line with semicolons
      "@typescript-eslint/semi": "error",

      // if the type is "obvious" to the compiler, you may as well skip the type declaration
      "@typescript-eslint/no-inferrable-types": "warn",

      // all functions must have explicit return types
      "@typescript-eslint/explicit-function-return-type": "error",

      // do put a blankspace before curly braces (e.g. in function definitions and if-else-clauses
      "@typescript-eslint/space-before-blocks": "warn",

      // use correct naming conventions
      "@typescript-eslint/naming-convention": ["error",
        { selector: "default", format: ["snake_case"] },
        { selector: "typeLike", format: ["PascalCase"] },
      ],

      // use Array<T> rather than T[]
      "@typescript-eslint/array-type": ["error", { default: 'generic' }]
    }
  }]
};