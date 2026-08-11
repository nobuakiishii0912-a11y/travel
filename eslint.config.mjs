import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';

const compat = new FlatCompat();

export default [
  {
    ignores: [
      ".next/*",
      ".next_build/*",
      "node_modules/*",
      "public/*.js",
      "dist/*",
      "out/*"
    ]
  },
  js.configs.recommended,
  ...compat.extends('next/core-web-vitals'),
  {
    rules: {
      "no-unused-vars": "off",
      "import/no-anonymous-default-export": "off",
      "react-hooks/set-state-in-effect": "off"
    }
  }
];
