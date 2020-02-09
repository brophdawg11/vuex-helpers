module.exports = {
    clearMocks: true,
    collectCoverage: true,
    collectCoverageFrom: ['src/**/*.js'],
    coverageReporters: ['html', 'text'],
    coverageThreshold: {
        global: {
            branches: 95,
            functions: 95,
            lines: 95,
            statements: 95,
        },
    },
    silent: false,
    transform: {
        '^.+\\.js?$': 'babel-jest',
    },
    verbose: true,
};
