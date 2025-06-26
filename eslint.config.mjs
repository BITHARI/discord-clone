import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [

    {
        ignores: [
            "node_modules",
            "lib/generated/prisma",
            ".next",
            "public",
            "dist",
            "out",
            "coverage",
            "*.config.mjs",
        ],
    },

    ...compat.extends("next/core-web-vitals", "next/typescript"),

    {
        rules: {
            "react-hooks/exhaustive-deps": "off",
            'allowObjectsTypes': 'off',
            "no-useless-escape": "off",
            "react/no-unescaped-entities": "off",
            '@typescript-eslint/no-empty-object-type' : "off",
            "@typescript-eslint/no-wrapper-object-types" : "off",
            '@typescript-eslint/no-unnecessary-type-constraint': 'off',
            "@typescript-eslint/no-explicit-any": "off",
            '@next/next/no-img-element': 'off',
            '@typescript-eslint/no-unused-vars': 'off',
            '@typescript-eslint/no-require-imports': 'off',
            '@typescript-eslint/no-unused-expressions': 'off',
            '@typescript-eslint/no-this-alias': 'off',
            '@typescript-eslint/no-unsafe-function-types': 'off',
            '@typescript-eslint/no-non-null-asserted-optional-chain': 'off',
            
        },
    },
];

export default eslintConfig;

