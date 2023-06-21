process.env.DISABLE_CONFIG_CACHE = 'true'

module.exports = {
  testEnvironment: 'node',
  setupFiles: ['dotenv/config'],
  roots: [
    '<rootDir>/src'
  ],
  testMatch: [
    '**/__tests__/**/*.+(ts|tsx|js)',
    '**/?(*.)+(spec|test).+(ts|tsx|js)'
  ],
  preset: 'ts-jest',
  transform: {
    '^.+\\.(ts|tsx)?$': ['ts-jest', { isolatedModules: true }]
  }
}
