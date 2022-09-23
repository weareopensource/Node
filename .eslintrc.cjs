module.exports = {
  root: true,
  env: {
    node: true,
    es2022: true,
    browser: true,
    jest: true,
  },
  extends: ['airbnb-base', 'plugin:markdown/recommended', 'plugin:prettier/recommended'],
  plugins: ['prettier', 'markdown'],
  rules: {
    'prettier/prettier': 'error',
    'no-console': 0,
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'max-len': 0,
    'no-param-reassign': 0,
    'global-require': 0,
    'prefer-destructuring': ['error', { object: false, array: false }],
    'import/no-dynamic-require': 0,
    'consistent-return': 0,
    'no-underscore-dangle': 0,
    'no-shadow': 0,
    'operator-linebreak': 0,
    'import/extensions': [
      'error',
      {
        js: 'ignorePackages',
      },
    ],
  },
  parserOptions: {
    parser: 'babel-eslint',
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
};
