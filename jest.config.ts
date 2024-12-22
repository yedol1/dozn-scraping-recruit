import type { Config } from "jest";
import nextJest from "next/jest.js";

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: "./",
});

// Add any custom config to be passed to Jest
const config: Config = {
  coverageProvider: "v8",
  preset: "ts-jest",
  testEnvironment: "jest-environment-jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  moduleNameMapper: {
    "@/auth": "<rootDir>/__tests__/mocks/auth.ts",
    "next-auth/providers/credentials":
      "<rootDir>/__tests__/mocks/next-auth-providers-credentials.ts",
    "next-auth": "<rootDir>/__tests__/mocks/next-auth.ts",
  },
  testPathIgnorePatterns: ["/node_modules/", "/__tests__/mocks/"],
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
export default createJestConfig(config);
