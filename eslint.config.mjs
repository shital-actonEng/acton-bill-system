import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      // Disable the explicit any rule
      // '@typescript-eslint/no-explicit-any': 'off',

      // Optional: downgrade to a warning instead of disabling completely
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-implicit-any-catch': 'off',
    },
  },
];

export default eslintConfig;
