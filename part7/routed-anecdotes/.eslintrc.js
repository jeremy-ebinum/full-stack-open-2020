module.exports = {
  env: {
    es6: true,
    node: true,
  },
  extends: ["react-app", "plugin:prettier/recommended"],
  globals: {
    Atomics: "readonly",
    SharedArrayBuffer: "readonly",
  },
  parserOptions: {
    ecmaVersion: 2018,
  },
  plugins: ["prettier"],
  rules: {
    "prettier/prettier": [
      "error",
      {
        trailingComma: "es5",
        arrowParens: "always",
        printWidth: 80,
        tabWidth: 2,
        semi: true,
        singleQuote: false,
        bracketSpacing: true,
      },
    ],
    "react/jsx-filename-extension": [1, { extensions: [".js", ".jsx"] }],
    "no-param-reassign": ["error", { props: false }],
    "no-console": 0,
  },
};
