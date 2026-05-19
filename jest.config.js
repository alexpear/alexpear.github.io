module.exports = {
    testMatch: [
        '**/*.test.js',
        '**/*.test.mjs',
        '**/*.test.ts',
        '!**/dist/*',
    ],
    transform: {
        '\\.mjs$': 'babel-jest', // Use Babel to transpile .mjs files
        'ya?ml$': 'jest-transform-yaml',
        'games/limitlessmoon.*\\.ts$': ['ts-jest', { tsconfig: 'games/limitlessmoon/tsconfig.test.json' }],
        '\\.ts$': ['ts-jest', { tsconfig: 'games/blockscout/tsconfig.test.json' }],
    },
    extensionsToTreatAsEsm: ['.test.mjs'], // Treat .test.mjs files as ES Modules
    testEnvironment: 'node',
};
