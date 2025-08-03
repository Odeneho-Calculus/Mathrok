module.exports = {
    root: true,
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaVersion: 2017,
        sourceType: 'module',
        project: './tsconfig.json'
    },
    plugins: [
        '@typescript-eslint',
        'prettier'
    ],
    extends: [
        'eslint:recommended',
        '@typescript-eslint/recommended',
        '@typescript-eslint/recommended-requiring-type-checking',
        'prettier'
    ],
    env: {
        browser: true,
        node: true,
        es6: true,
        jest: true
    },
    rules: {
        // TypeScript specific rules
        '@typescript-eslint/no-unused-vars': ['error', {
            argsIgnorePattern: '^_',
            varsIgnorePattern: '^_'
        }],
        '@typescript-eslint/explicit-function-return-type': 'error',
        '@typescript-eslint/explicit-module-boundary-types': 'error',
        '@typescript-eslint/no-explicit-any': 'error',
        '@typescript-eslint/no-non-null-assertion': 'error',
        '@typescript-eslint/prefer-nullish-coalescing': 'error',
        '@typescript-eslint/prefer-optional-chain': 'error',
        '@typescript-eslint/strict-boolean-expressions': 'error',
        '@typescript-eslint/switch-exhaustiveness-check': 'error',
        '@typescript-eslint/prefer-readonly': 'error',
        '@typescript-eslint/prefer-readonly-parameter-types': 'off', // Too strict for math library
        '@typescript-eslint/no-floating-promises': 'error',
        '@typescript-eslint/await-thenable': 'error',
        '@typescript-eslint/no-misused-promises': 'error',

        // General JavaScript rules
        'no-console': ['warn', { allow: ['warn', 'error'] }],
        'no-debugger': 'error',
        'no-alert': 'error',
        'no-eval': 'error',
        'no-implied-eval': 'error',
        'no-new-func': 'error',
        'no-script-url': 'error',
        'no-return-assign': 'error',
        'no-sequences': 'error',
        'no-throw-literal': 'error',
        'no-unmodified-loop-condition': 'error',
        'no-unused-expressions': 'error',
        'no-useless-call': 'error',
        'no-useless-concat': 'error',
        'no-useless-return': 'error',
        'prefer-promise-reject-errors': 'error',
        'require-await': 'error',

        // Code style rules
        'array-callback-return': 'error',
        'consistent-return': 'error',
        'curly': ['error', 'all'],
        'default-case': 'error',
        'dot-notation': 'error',
        'eqeqeq': ['error', 'always'],
        'guard-for-in': 'error',
        'no-else-return': 'error',
        'no-empty-function': 'error',
        'no-eq-null': 'error',
        'no-extend-native': 'error',
        'no-extra-bind': 'error',
        'no-implicit-coercion': 'error',
        'no-implicit-globals': 'error',
        'no-lone-blocks': 'error',
        'no-loop-func': 'error',
        'no-magic-numbers': ['warn', {
            ignore: [-1, 0, 1, 2],
            ignoreArrayIndexes: true,
            ignoreDefaultValues: true
        }],
        'no-multi-spaces': 'error',
        'no-new': 'error',
        'no-new-wrappers': 'error',
        'no-param-reassign': 'error',
        'no-redeclare': 'error',
        'no-self-compare': 'error',
        'no-useless-escape': 'error',
        'no-void': 'error',
        'prefer-const': 'error',
        'prefer-template': 'error',
        'radix': 'error',
        'yoda': 'error',

        // Import rules
        'sort-imports': ['error', {
            ignoreCase: true,
            ignoreDeclarationSort: true
        }],

        // Prettier integration
        'prettier/prettier': 'error'
    },
    overrides: [
        {
            files: ['**/*.test.ts', '**/*.spec.ts', 'tests/**/*.ts'],
            rules: {
                '@typescript-eslint/no-explicit-any': 'off',
                '@typescript-eslint/no-non-null-assertion': 'off',
                'no-magic-numbers': 'off'
            }
        },
        {
            files: ['scripts/**/*.js', '*.config.js'],
            rules: {
                '@typescript-eslint/no-var-requires': 'off',
                'no-console': 'off'
            }
        }
    ],
    ignorePatterns: [
        'dist/',
        'coverage/',
        'node_modules/',
        '*.d.ts'
    ]
};