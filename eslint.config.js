import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
  },
  {
    // Route modules are required by React Router to export loaders, meta, links
    // and friends alongside the component. react-refresh flags those as
    // non-component exports, which is a false positive for this file type.
    files: ['app/root.tsx', 'app/routes/**/*.{ts,tsx}'],
    rules: {
      'react-refresh/only-export-components': [
        'error',
        {
          allowExportNames: [
            'action',
            'clientAction',
            'clientLoader',
            'ErrorBoundary',
            'handle',
            'headers',
            'HydrateFallback',
            'Layout',
            'links',
            'loader',
            'meta',
            'middleware',
            'shouldRevalidate',
          ],
        },
      ],
    },
  },
])
