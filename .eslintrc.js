module.exports = {
  extends: [
    'next/core-web-vitals',
    'plugin:@typescript-eslint/recommended',
    'prettier'
  ],
  plugins: ['@typescript-eslint', 'prettier'],
  rules: {
    'prettier/prettier': 'error',
    '@typescript-eslint/explicit-function-return-type': 'off', // Turn off for pages and components
    '@typescript-eslint/no-unused-vars': 'error',
    '@typescript-eslint/no-explicit-any': 'warn',
    'no-console': ['warn', { allow: ['warn', 'error'] }], // Allow console.warn and console.error
    '@typescript-eslint/no-empty-function': 'off',
    '@typescript-eslint/no-empty-interface': 'off'
  },
  overrides: [
    {
      // Enable stricter rules for API routes
      files: ['src/app/api/**/*.ts'],
      rules: {
        '@typescript-eslint/explicit-function-return-type': 'error'
      }
    }
  ]
};
