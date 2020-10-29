module.exports = {
  env: {
    browser: true,
    es6: true,
  },
  extends: [
    "plugin:react/recommended",
    "airbnb",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
    "prettier",
  ],
  globals: {
    Atomics: "readonly",
    SharedArrayBuffer: "readonly",
  },
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaFeatures: {
      tsx: true,
    },
    ecmaVersion: 11,
    sourceType: "module",
  },
  plugins: ["react", "@typescript-eslint"],
  rules: {
    //"arrow-body-style": "off",
    //"class-methods-use-this": "off",
    //"comma-dangle": "off",
    //"consistent-return": "off",
    "no-multi-str": "warn",
    "no-console": ["warn", { allow: ["error"] }],
    "no-unused-vars": "warn",
    quotes: ["warn", "double"],
    "react/jsx-filename-extension": [1, { extensions: [".tsx"] }],
    "object-curly-newline": [
      "off",
      {
        ObjectExpression: { multiline: true },
        ObjectPattern: { multiline: true },
        ImportDeclaration: { multiline: true },
        ExportDeclaration: { multiline: true },
      },
    ],
    "react/destructuring-assignment": "off",
    "react/no-unused-state": "warn",
    "react/jsx-wrap-multilines": "off",
    "react/jsx-one-expression-per-line": "off",
    //"prefer-destructuring": "off",
    "import/extensions": [
      "error",
      "ignorePackages",
      {
        js: "never",
        jsx: "never",
        ts: "never",
        tsx: "never",
      },
    ],
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/interface-name-prefix": "off",
  },
  settings: {
    "import/resolver": {
      node: {
        extensions: [".js", ".jsx", ".ts", ".tsx"],
        moduleDirectory: ["node_modules", "src/"],
      },
    },
  },
};
