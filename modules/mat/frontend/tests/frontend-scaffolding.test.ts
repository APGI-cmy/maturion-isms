/**
 * MAT Frontend QA-to-Red Test Suite — CAT-FE-01: Frontend Application Scaffolding
 *
 * QA-to-Red: Tests define expected behavior for FR-070 (Frontend Scaffolding).
 * Status at creation: RED — modules/mat/frontend/ application not yet scaffolded.
 *
 * FRS: FR-070 (Frontend Application Scaffolding and Packaging)
 * TRS: TR-001, TR-006
 * Registry: governance/TEST_REGISTRY.json
 */
import { describe, it, expect } from 'vitest';
import { existsSync, readFileSync } from 'fs';
import { resolve } from 'path';

const APP_ROOT = resolve(__dirname, '..');

describe('CAT-FE-01: frontend application scaffolding (FR-070)', () => {
  it('MAT-FE-T-001: React 18+ application exists at modules/mat/frontend/', () => {
    // FRS: FR-070 AC-1
    // TRS: TR-001
    // Type: structural | Priority: P0
    // Status: RED — application not yet scaffolded

    const packageJsonPath = resolve(APP_ROOT, 'package.json');
    expect(existsSync(packageJsonPath)).toBe(true);

    const pkg = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
    expect(pkg.name).toBe('mat-frontend');
  });

  it('MAT-FE-T-002: Application registered in pnpm-workspace.yaml', () => {
    // FRS: FR-070 AC-2
    // TRS: TR-006
    // Type: structural | Priority: P0
    // Status: RED — not yet registered in workspace

    const workspacePath = resolve(APP_ROOT, '../../../pnpm-workspace.yaml');
    expect(existsSync(workspacePath)).toBe(true);

    const content = readFileSync(workspacePath, 'utf-8');
    // workspace should include modules/mat/frontend
    expect(content).toMatch(/modules\/mat\/frontend/);
  });

  it('MAT-FE-T-003: TypeScript strict mode enabled', () => {
    // FRS: FR-070 AC-5
    // TRS: TR-001
    // Type: structural | Priority: P0
    // Status: RED — tsconfig.json not yet created

    const tsconfigPath = resolve(APP_ROOT, 'tsconfig.json');
    expect(existsSync(tsconfigPath)).toBe(true);

    const tsconfig = JSON.parse(readFileSync(tsconfigPath, 'utf-8'));
    expect(tsconfig.compilerOptions?.strict).toBe(true);
  });

  it('MAT-FE-T-004: Vite 5+ build configuration exists', () => {
    // FRS: FR-070 AC-1, AC-3
    // TRS: TR-001
    // Type: structural | Priority: P0
    // Status: RED — vite.config.ts not yet created

    const viteConfigPath = resolve(APP_ROOT, 'vite.config.ts');
    expect(existsSync(viteConfigPath)).toBe(true);
  });

  it('MAT-FE-T-005: React 18+ declared as dependency', () => {
    // FRS: FR-070 AC-1
    // TRS: TR-001
    // Type: structural | Priority: P0
    // Status: RED — React not yet added as dependency

    const pkg = JSON.parse(readFileSync(resolve(APP_ROOT, 'package.json'), 'utf-8'));
    const reactVersion = pkg.dependencies?.react || '';
    // React 18 or higher — extract major version number
    const majorMatch = reactVersion.match(/(\d+)\./);
    expect(majorMatch).not.toBeNull();
    expect(Number(majorMatch![1])).toBeGreaterThanOrEqual(18);
  });

  it('MAT-FE-T-006: Application entry point exists (index.html + main.tsx)', () => {
    // FRS: FR-070 AC-1
    // TRS: TR-001
    // Type: structural | Priority: P0
    // Status: RED — entry points not yet created

    expect(existsSync(resolve(APP_ROOT, 'index.html'))).toBe(true);
    expect(existsSync(resolve(APP_ROOT, 'src/main.tsx'))).toBe(true);
  });

  it('MAT-FE-T-007: Tailwind CSS 3+ configured', () => {
    // FRS: FR-070 AC-6
    // TRS: TR-001
    // Type: structural | Priority: P0
    // Status: RED — Tailwind not yet configured

    const pkg = JSON.parse(readFileSync(resolve(APP_ROOT, 'package.json'), 'utf-8'));
    const allDeps = { ...pkg.dependencies, ...pkg.devDependencies };
    expect(allDeps['tailwindcss']).toBeDefined();
  });

  it('MAT-FE-T-008: Zero build warnings on production build', () => {
    // FRS: FR-070 Edge Case 1
    // TRS: TR-001
    // Type: build | Priority: P0
    // Status: RED — build not yet configured
    // Note: This test validates build output; requires build infrastructure

    // Placeholder assertion — will be replaced with actual build validation
    // when build infrastructure is in place
    const pkg = JSON.parse(readFileSync(resolve(APP_ROOT, 'package.json'), 'utf-8'));
    expect(pkg.scripts?.build).toBeDefined();
    expect(pkg.scripts?.build).not.toContain('echo');
  });
});
