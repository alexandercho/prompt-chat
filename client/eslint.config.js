const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');
const reactNative = require('eslint-plugin-react-native');

module.exports = defineConfig([
  expoConfig,
  {
    ignores: ['dist/*', '.expo/*']
  },
  {
    files: ['**/*.tsx', '**/*.ts'],
    plugins: {
      'react-native': reactNative
    },
    rules: {
      'react-native/no-unused-styles': 'warn',
      'comma-dangle': ['error', 'never'],
      'quotes': ['error', 'single'],
      'no-trailing-spaces': 'error',
      'indent': ['error', 4]
    }
  }
]);
