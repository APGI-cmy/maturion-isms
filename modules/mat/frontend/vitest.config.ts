import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    include: [
      'tests/**/*.test.ts',
      'tests/**/*.test.tsx',
      '../tests/ui-wiring/**/*.test.ts',
      '../tests/ui-wiring/**/*.test.tsx',
    ],
    globals: true,
    reporters: ['verbose'],
    environment: 'jsdom',
    env: {
      VITE_SUPABASE_URL: process.env.VITE_SUPABASE_URL ?? '',
      VITE_SUPABASE_ANON_KEY: process.env.VITE_SUPABASE_ANON_KEY ?? '',
      VITE_API_BASE_URL: process.env.VITE_API_BASE_URL ?? '',
    },
  },
});
