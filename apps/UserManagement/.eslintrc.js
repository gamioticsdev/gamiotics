module.exports = {
    env: { node: true },
    root: true,
    parser: '@typescript-eslint/parser',
    parserOptions: {
      project: './tsconfig.json'
    },
    plugins: ['@typescript-eslint/eslint-plugin'],
    ignorePatterns: ['.eslintrc.js'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      'no-case-declarations': 'off',
      '@typescript-eslint/no-non-null-assertion': 'off',
      '@typescript-eslint/ban-ts-comment': 'off',
      '@typescript-eslint/no-floating-promises': 1,
      'curly': 2,
      'prettier/prettier': [
        'error',
        {
          'endOfLine': 'auto',
        }
      ]
    },
    extends: [
      'eslint:recommended',
      'plugin:@typescript-eslint/recommended',
      'prettier',
      'plugin:prettier/recommended',
    ],
  };
  