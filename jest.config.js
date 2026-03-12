module.exports = {
    testMatch: [
        '**/*.test.js',
        '**/*.test.mjs',
        '**/*.test.ts',
    ],
    transform: {
        '\\.mjs$': 'babel-jest', // Use Babel to transpile .mjs files
        'ya?ml$': 'jest-transform-yaml',
        '\\.ts$': ['ts-jest', { tsconfig: 'games/mapgame/tsconfig.test.json' }],
    },
    extensionsToTreatAsEsm: ['.test.mjs'], // Treat .test.mjs files as ES Modules
    testEnvironment: 'node',
};
