/** @type {import('jest').Config} */
const config = {
  preset: 'ts-jest',
  testEnvironment: 'jest-environment-jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  transform: {
    '^.+\\.tsx?$': ['ts-jest', { tsconfig: 'tsconfig.test.json' }],
  },
  moduleNameMapper: {
    '^@/.*\\.svg\\?react$': '<rootDir>/src/__mocks__/svgReactMock.tsx',
    '^@/.*\\.svg$': '<rootDir>/src/__mocks__/fileMock.ts',
    '^@/.*\\.(png|jpg|jpeg|gif|webp)$': '<rootDir>/src/__mocks__/fileMock.ts',
    '^@/.*\\.(css|scss|sass)$': '<rootDir>/src/__mocks__/styleMock.ts',

    '^@/(.*)$': '<rootDir>/src/$1',

    '\\.(css|scss|sass)$': '<rootDir>/src/__mocks__/styleMock.ts',

    '\\.svg\\?react$': '<rootDir>/src/__mocks__/svgReactMock.tsx',
    '\\.svg$': '<rootDir>/src/__mocks__/fileMock.ts',

    '\\.(png|jpg|jpeg|gif|webp)$': '<rootDir>/src/__mocks__/fileMock.ts',
  },
  coverageDirectory: 'coverage',
  collectCoverageFrom: ['src/**/*.{ts,tsx}', '!src/**/*.d.ts', '!src/main.tsx'],
};

export default config;