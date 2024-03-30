/**
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

/** @type {import('jest').Config} */
const config = {
  // diretorio onde queremos que seja feita a cobertura de testes
  collectCoverageFrom: ['<rootDir>/src/**/*.ts'],
  coverageDirectory: "coverage",
  coverageProvider: "babel",
  // para quando encontrar o path com @, ele vai substituir pelo rootdir/src
  moduleNameMapper: {
    '@/tests/(.+)':'<rootDir>/tests/$1',
    '@/(.+)':'<rootDir>/src/$1'
  },
  roots: [
    "<rootDir>/src",
    "<rootDir>/tests"
  ],
  // para o jest interpretar typescript
  transform: {
    '\\.ts$': 'ts-jest'
  },
  clearMocks: true

};

module.exports = config;
