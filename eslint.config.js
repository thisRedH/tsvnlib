import tseslint from "typescript-eslint";

export default tseslint.config(
    { ignores: ["dist/", "node_modules/"] },
    ...tseslint.configs.recommended,
    {
        languageOptions: {
            parserOptions: {
                projectService: true,
                tsconfigRootDir: import.meta.dirname,
            },
        },
        rules: {
            "eqeqeq": ["error", "always", { "null": "ignore" }],
            "prefer-const": "error",
            "@typescript-eslint/consistent-type-imports": "error",
            "@typescript-eslint/no-non-null-assertion": "warn",
        },
    },
);
