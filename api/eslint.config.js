
export default [
    {
        // Apply to all JS files in api folder and subfolders
        files: ['**/*.js', '**/*.cjs', '**/*.mjs'],
        languageOptions: {
            ecmaVersion: 2021,
            sourceType: 'module'
        },
        linterOptions: {
            reportUnusedDisableDirectives: 'warn'
        },
        rules: {
            'no-console': 'off',
            'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
            'comma-dangle': ['error', 'never'],
            'quotes': ['error', 'single'],
            'no-trailing-spaces': 'error',
            'indent': ['error', 4]
        }
    }
];