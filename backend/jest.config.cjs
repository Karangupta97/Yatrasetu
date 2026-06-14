/** @type {import('jest').Config} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  transform: {
    "^.+\\.tsx?$": [
      "ts-jest",
      {
        tsconfig: {
          module: "CommonJS",
          moduleResolution: "node",
          ignoreDeprecations: "6.0",
          esModuleInterop: true,
          allowSyntheticDefaultImports: true,
          types: ["node", "jest"],
          noUnusedLocals: false,
          noUnusedParameters: false,
          noImplicitReturns: false,
          strict: false,
          rootDir: ".",
        },
        isolatedModules: true,
      },
    ],
  },
  moduleNameMapper: {
    // Strip .js extensions from imports so ts-jest can resolve .ts files
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },
  testMatch: ["**/__tests__/**/*.test.ts", "**/*.test.ts"],
  testPathIgnorePatterns: ["/node_modules/", "/dist/"],
};
