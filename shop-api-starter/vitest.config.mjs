import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['tests/**/*.test.mjs'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'json'],
      include: ['src/**/*.mjs'],
      exclude: ['src/server.mjs'],
      // Module 2 target: raise to 80/80/80 after completing the deductStock tests
      thresholds: {
        lines: 70,
        branches: 60,
        functions: 70,
      },
    },
  },
});
