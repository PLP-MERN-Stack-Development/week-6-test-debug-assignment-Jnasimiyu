// jest.config.js
module.exports = {
  verbose: true,
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.[jt]sx?$': 'babel-jest',
  },
  setupFiles: ['./jest.setup.js'],
  setupFilesAfterEnv: ['./jest.setup.js'],
  moduleFileExtensions: ['js', 'jsx'],
};
