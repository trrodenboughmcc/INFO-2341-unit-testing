import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    coverage: {
      provider: 'v8', // Use @vitest/coverage-v8
      reporter: ['text', 'html'], // generates terminal and HTML reports
    },
  },
});
