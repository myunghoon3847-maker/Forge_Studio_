import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['tests/unit/**/*.test.js', 'tests/integration/**/*.test.js'],
    reporters: ['default'],
    testTimeout: 15000,
    hookTimeout: 15000,
    coverage: {
      enabled: false,
    },
  },
});
