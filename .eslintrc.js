module.exports = {
  extends: [
    'airbnb-base'
  ],
  rules: {
    'max-len': 0,
    'no-console': 0,
    'no-param-reassign': 0,
    'global-require': 0,
    'prefer-destructuring': ['error', {'object': false, 'array': false}],
    'import/no-dynamic-require': 0,
    // due to switch es6
    'consistent-return': 0,
    'no-underscore-dangle': 0,
    'no-shadow': 0
  },
  env: {
    node: true,
    es6: true,
    browser: true,
    jest: true,
    mongo: true,
  },
  parserOptions: {
    ecmaVersion: 10,
    sourceType: 'module',
  }
};
