// @ts-check

import { configs } from "@js-soft/eslint-config-ts"
import { globalIgnores } from "eslint/config"
import tseslint from "typescript-eslint"

export default tseslint.config(globalIgnores(["**/dist", "**/node_modules"]), {
    extends: [configs.base, configs.mocha],
    languageOptions: {
        parserOptions: {
            project: ["./tsconfig.eslint.json", "./tsconfig.json", "./test/tsconfig.json"]
        }
    },
    files: ["**/*.ts"],
    rules: {
        "jest/expect-expect": [
            "error",
            {
                assertFunctionNames: ["expect", "expectValid*", "expectThrows*"]
            }
        ]
    }
})
