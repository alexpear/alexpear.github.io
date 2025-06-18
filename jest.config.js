module.exports = {
    testMatch: [
        '**/*.test.js', 
        '**/*.test.mjs',
    ],
    transform: {
        '\\.mjs$': 'babel-jest', // Use Babel to transpile .mjs files
        'ya?ml$': 'jest-transform-yaml', //'yamlify',
    },
    extensionsToTreatAsEsm: ['.test.mjs'], // Treat .mjs files as ES Modules
    testEnvironment: 'node', // Use Node.js environment for testing
};
