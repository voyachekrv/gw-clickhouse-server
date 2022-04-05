/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
	preset: 'ts-jest',
	testEnvironment: 'node',
	clearMocks: true,
	coverageProvider: 'v8',
	moduleFileExtensions: ['ts', 'js'],
	roots: ['<rootDir>']
};
