module.exports = {
  env: {
    commonjs: true,
    es6: true,
    node: true,
    jest: true,
  },
  extends: ["airbnb-base", "plugin:prettier/recommended"],
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
    "no-console": 0,
    "no-param-reassign": ["error", { props: false }],
    "no-underscore-dangle": [
      "error",
      { allow: ["_id", "__v", "_countBy", "_merge"] },
    ],
  },
};
