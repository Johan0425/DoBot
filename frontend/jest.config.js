export default {
    testEnvironment: 'jsdom',
    setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
    moduleNameMapping: {
      '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
      '\\.(gif|ttf|eot|svg|png)$': 'jest-transform-stub'
    },
    transform: {
      '^.+\\.(js|jsx)$': 'babel-jest'
    },
    testMatch: [
      '<rootDir>/src/**/__tests__/**/*.{js,jsx}',
      '<rootDir>/src/**/*.{test,spec}.{js,jsx}'
    ],
    collectCoverageFrom: [
      'src/**/*.{js,jsx}',
      '!src/main.jsx',
      '!src/index.css',
      '!src/**/*.test.{js,jsx}'
    ],
    moduleFileExtensions: ['js', 'jsx', 'json'],
    transformIgnorePatterns: [
      'node_modules/(?!(lucide-react)/)'
    ]
  };