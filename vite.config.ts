import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/pizzatime/',
  test: {
    globals: true,          // <-- gives you describe/it/expect
    environment: 'jsdom',   // <-- simulates browser for React components
    setupFiles: './tests/setup.ts'
  },
});