module.exports = {
    testEnvironment: "jest-environment-jsdom",
    moduleNameMapper: {
        '\\.(css|less)$': '<rootDir>/__mocks__/styleMock.js',
    },
};