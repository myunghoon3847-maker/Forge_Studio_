import js from '@eslint/js';

export default [
  {
    ignores: [
      'dist/**',
      'node_modules/**',
      'playwright-report/**',
      'src/generated/**',
      'test-results/**',
      'work/**',
      'outputs/**',
    ],
  },
  js.configs.recommended,
  {
    files: ['**/*.js', '**/*.mjs'],
    languageOptions: {
      ecmaVersion: 2024,
      sourceType: 'module',
      globals: {
        Blob: 'readonly',
        cancelAnimationFrame: 'readonly',
        crypto: 'readonly',
        document: 'readonly',
        FileReader: 'readonly',
        HTMLDialogElement: 'readonly',
        navigator: 'readonly',
        performance: 'readonly',
        requestAnimationFrame: 'readonly',
        ResizeObserver: 'readonly',
        setTimeout: 'readonly',
        structuredClone: 'readonly',
        TextEncoder: 'readonly',
        URL: 'readonly',
        window: 'readonly',
      },
    },
    rules: {
      'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      'no-constant-condition': ['error', { checkLoops: false }],
      'no-control-regex': 'off',
    },
  },
  {
    files: ['tests/**/*.js', 'playwright.config.js', 'scripts/**/*.mjs'],
    languageOptions: {
      globals: {
        Buffer: 'readonly',
        CSS: 'readonly',
        console: 'readonly',
        Event: 'readonly',
        fetch: 'readonly',
        process: 'readonly',
        screen: 'readonly',
      },
    },
  },
];
