const path = require('path')

module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'prettier'],
  parserOptions: {
    project: path.join(__dirname, './tsconfig.eslint.json'),
  },
  ignorePatterns: ['.eslintrc.js'],
  settings: {
    react: {
      version: 'detect',
    },
  },
  extends: [
    'eslint:recommended',
    'next/core-web-vitals',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'airbnb',
    'airbnb-typescript',
    'plugin:prettier/recommended',
    'prettier',
  ],
  rules: {
    'prettier/prettier': 'error',
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': 'error',
    'react-hooks/exhaustive-deps': 'off',
    'react/jsx-props-no-spreading': 'off',
    '@typescript-eslint/no-unsafe-assignment': 'off',
    'react/react-in-jsx-scope': 'off',
    'react/function-component-definition': 'off',
    'no-nested-ternary': 'off',
    'react/prop-types': 'off',
    'react/no-unstable-nested-components': 'off',
    'import/prefer-default-export': 'off',
    'react/require-default-props': 'off',
    'react/destructuring-assignment': 'off',
    '@typescript-eslint/no-unsafe-call': 'off',
    '@typescript-eslint/no-unsafe-member-access': 'off',
    '@typescript-eslint/no-unsafe-return': 'off',
    '@typescript-eslint/no-floating-promises': 'warn',
    'jsx-a11y/anchor-is-valid': 'warn',
    '@typescript-eslint/no-unsafe-argument': 'warn',
    'import/newline-after-import': 'off',
    'max-classes-per-file': 'off',
    '@typescript-eslint/no-misused-promises': 'warn',
    'react/no-unused-prop-types': 'off',
  },
}
