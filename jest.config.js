// for a detailed explanation regarding each configuration property & type-check, visit: https://jestjs.io/docs/configuration

module.exports = {
	preset: 'ts-jest',
	testEnvironment: 'node',
	clearMocks: true,
	collectCoverage: true,
	coverageProvider: 'v8',
	coveragePathIgnorePatterns: ['node_modules/'],
	coverageDirectory: 'coverage'
};