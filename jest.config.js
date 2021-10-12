const path = require('path');

module.exports = {
  rootDir: path.resolve(__dirname),
  passWithNoTests: true,
  testMatch: ['<rootDir>/tests/**/*.test.js'],
  testTimeout: 10000
};

