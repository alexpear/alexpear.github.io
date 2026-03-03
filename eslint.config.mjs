import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import eslintConfigPrettier from 'eslint-config-prettier';

export default tseslint.config(
    eslint.configs.recommended,
    ...tseslint.configs.recommended,
    eslintConfigPrettier,
    {
        ignores: [
            'node_modules/',
            '.*/',
            '**/dist/',
            'util/imageSorter/',
        ],
    },
    {
        files: ['**/*.ts'],
        rules: {
            // '@typescript-eslint/no-unused-vars': 'off',
            '@typescript-eslint/explicit-function-return-type': 'warn',
            '@typescript-eslint/typedef': [
                'warn',
                {
                    parameter: true,
                    propertyDeclaration: true,
                    memberVariableDeclaration: true,
                },
            ],
        },
    },
);
