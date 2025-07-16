import js from '@eslint/js'
import globals from 'globals'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs['recommended-latest'],
      reactRefresh.configs.vite,
    ],
    settings: { 
      react: { 
        version: 'detect' 
      } 
    },
    plugins: {
      react,
      "react-hooks": reactHooks, // Added this plugin for React Hooks
      "react-refresh": reactRefresh, // Added this plugin for React Refresh
    },
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    rules: {
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
      ...js.configs.recommended.rules, // Use recommended rules from ESLint
      ...react.configs.recommended.rules, // Use recommended rules from eslint-plugin-react
      ...react.configs["jsx-runtime"].rules, // Use rules for JSX runtime
      ...reactHooks.configs["recommended-latest"].rules, // Use recommended rules for React Hooks
      ...reactRefresh.configs.vite.rules, // Use rules for React Refresh
      "no-unused-vars": "warn", // Warn on unused variables
      "react/prop-types": "off", // Disable prop-types rule as we use TypeScript
    },
  },
])
