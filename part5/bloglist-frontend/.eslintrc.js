module.exports = {
  env: {
    commonjs: true,
    es6: true,
    node: true,
    jest: true
  },
  extends: ["react-app", "plugin:prettier/recommended"],
  globals: {
    Atomics: "readonly",
    SharedArrayBuffer: "readonly"
  },
  parserOptions: {
    ecmaVersion: 2018
  },
  plugins: ["prettier"],
  rules: {
    "prettier/prettier": "error",
    quotes: ["error", "double"],
    semi: 0,
    "react/jsx-filename-extension": [1, { extensions: [".js", ".jsx"] }],
    eqeqeq: "error",
    "no-param-reassign": ["error", { props: false }]
  }
};
