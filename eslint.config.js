import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'
import oxlint from 'eslint-plugin-oxlint'
import { plugin as shadcn } from '@shadcn/lint'

export default defineConfig([
  globalIgnores(['dist', 'node_modules']),
  {
    files: ['**/*.{ts,tsx}'],
    plugins: {
      shadcn,
    },
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
    },
    rules: {
      'shadcn/no-unknown-classes': 'warn',
      'shadcn/no-arbitrary-values': 'warn',
      'shadcn/no-inline-styles': 'warn',
      'react-hooks/set-state-in-effect': 'warn',
      'react-hooks/preserve-manual-memoization': 'warn',
    },
  },
  {
    // Strangler Fig migration gate: enforce strict design system rules on migrated components
    files: [
      'src/components/custom/stat-card.tsx',
      'src/components/custom/section-card.tsx',
      'src/components/custom/metric-card.tsx',
    ],
    rules: {
      'shadcn/no-unknown-classes': 'error',
      'shadcn/no-arbitrary-values': [
        'error',
        {
          allow: [
            'hover:bg-[#F3F0FF]/50',
            'bg-[#F3F0FF]',
            'text-[#584D75]',
            'active:scale-[0.99]',
            'text-[10px]',
            'sm:text-[11px]',
          ],
        },
      ],
      'shadcn/no-inline-styles': 'error',
    },
  },
  {
    // Allow internal UI primitives in components/ui to style themselves
    files: ['src/components/ui/**/*.{ts,tsx}'],
    rules: {
      'shadcn/no-arbitrary-values': 'off',
    },
  },
  ...oxlint.configs['flat/recommended'],
])
