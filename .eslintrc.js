module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    'plugin:vue/vue3-essential',
    '@vue/airbnb',
    '@vue/typescript/recommended',
  ],
  parserOptions: {
    ecmaVersion: 2020,
  },
  settings: {
    "import/resolver": {
      "node": {
        "paths": ["src"]
      }
    },
  },
  ignorePatterns: [
    'node_modules/',
    'dist/',
    '*.config.js',
    '*.html',
    'sw-loader.js',
  ],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-plusplus': 0,
    'no-restricted-globals': 0,
    'import/prefer-default-export': 0,
    "no-restricted-imports": 0, // ?
    "import/no-useless-path-segments": 2, // ?
    "import/no-relative-parent-imports": 2,
    '@typescript-eslint/ban-ts-comment': 1,
    '@typescript-eslint/no-var-requires': 0,
  },
};
