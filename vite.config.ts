/// <reference types="vitest" />
import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    host: '0.0.0.0',
    port: 5173,
    open: false,
  },
  build: {
    target: 'esnext',
  },
  test: {
    globals: true,
    environment: 'happy-dom',
    include: ['tests/**/*.test.ts'],
    exclude: ['**/node_modules/**', '**/worktrees/**', '**/dist/**'],
  },
});
