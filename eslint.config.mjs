import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import eslintConfigPrettier from 'eslint-config-prettier';

export default tseslint.config(
    {
        ignores: [
            'node_modules/',
            '.*/',
            '**/dist/',
        ],
    },
    {
        files: ['**/*.ts'],
        extends: [
            eslint.configs.recommended,
            ...tseslint.configs.recommended,
            eslintConfigPrettier,
        ],
        rules: {
            '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
            '@typescript-eslint/explicit-function-return-type': 'warn',
            '@typescript-eslint/typedef': [
                'warn',
                {
                    parameter: true,
                    propertyDeclaration: true,
                    memberVariableDeclaration: true,
                },
            ],
            '@typescript-eslint/no-require-imports': 'off',
        },
    },
);
