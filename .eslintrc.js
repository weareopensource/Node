module.exports = {
  root: true,
  env: {
    node: true,
    es6: true,
    browser: true,
    jest: true,
  },
  extends: 'airbnb-typescript/base',
  rules: {
    'not-tabs': 'off',
    'no-console': 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'max-len': 0,
    'no-param-reassign': 0,
    'global-require': 0,
    'prefer-destructuring': ['error', { object: false, array: false }],
    'import/no-dynamic-require': 0,
    // due to switch es6
    'consistent-return': 0,
    'no-underscore-dangle': 0,
    'no-shadow': 1,
    'operator-linebreak': 0,
  },
  parserOptions: {
    project: './tsconfig.json',
    createDefaultProgram: true,
  },
  plugins: [
    '@typescript-eslint',
  ],
  overrides: [
    {
      files: [
        '**/__tests__/*.{j,t}s?(x)',
        '**/tests/unit/**/*.spec.{j,t}s?(x)',
      ],
      env: {
        jest: true,
      },
    },
  ],
};
