import { defineConfig } from 'vitest/config';
import path from 'node:path';

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'apps/mmm/src'),
      react: path.resolve(__dirname, 'apps/mmm/node_modules/react'),
      'react-dom': path.resolve(__dirname, 'apps/mmm/node_modules/react-dom'),
      'react-router-dom': path.resolve(__dirname, 'apps/mmm/node_modules/react-router-dom'),
      '@tanstack/react-query': path.resolve(
        __dirname,
        'apps/mmm/node_modules/@tanstack/react-query',
      ),
    },
  },
  test: {
    include: [
      // Source-contract suite (repo-root executable).
      'modules/MMM/tests/B4-framework/b4-framework.test.ts',
      // DMC routing and subject-knowledge wiring contracts.
      'modules/MMM/tests/B4-framework/dmc-subject-knowledge-routing.test.ts',
      // Domain workflow behavior contracts.
      'modules/MMM/tests/B4-framework/domain-workflow-behavior.test.tsx',
      // Domain runtime resilience contracts.
      'modules/MMM/tests/B4-framework/domain-workspace-resilience.test.tsx',
      // Runtime resilience gate for compile handoff workspace.
      'modules/MMM/tests/B4-framework/framework-handoff-resilience.test.tsx',
      // Framework origin routing guard (no blocking edge call at mode-select step).
      'modules/MMM/tests/B4-framework/framework-origin-routing.test.ts',
      // Edge-runtime fallback guards for context + DMC inventory.
      'modules/MMM/tests/B4-framework/edge-runtime-fallbacks.test.ts',
      // AI linkage + fallback guards for MPS/Intent/Criteria generation.
      'modules/MMM/tests/B4-framework/ai-linkage-fallbacks.test.ts',
      // Sidebar/context/approval recovery gates.
      'modules/MMM/tests/B4-framework/sidebar-context-and-mps-approval.test.ts',
    ],
    globals: true,
    reporters: ['verbose'],
    environment: 'jsdom',
  },
});
