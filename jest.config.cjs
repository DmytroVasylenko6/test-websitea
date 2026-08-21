/** @type {import('jest').Config} */
const config = {
	testEnvironment: "node",
	setupFilesAfterEnv: ["jest-extended/all"],
	transform: {
		"^.+\\.tsx?$": [
			"ts-jest",
			{
				tsconfig: {
					module: "commonjs",
					esModuleInterop: true,
					strict: true,
					skipLibCheck: true,
				},
			},
		],
	},
	moduleNameMapper: {
		"^@/(.*)$": "<rootDir>/src/$1",
	},
	testMatch: ["**/*.test.ts"],
	watchman: false,
};

module.exports = config;
