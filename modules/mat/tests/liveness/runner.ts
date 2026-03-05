/**
 * MAT Liveness Test Suite — Runner
 * Spec Authority: modules/mat/00-app-description/MAT_LIVENESS_TEST_SPEC.md v1.0
 * Issue: #932
 * Runs all 3 Playwright liveness spec files and assembles reports.
 * Exit 0 on WARN only; exit 1 on any blocking FAIL.
 */
import { spawnSync } from 'node:child_process';
import * as fs from 'node:fs';
import * as path from 'node:path';

const LIVENESS_DIR = path.resolve(__dirname);
const EVIDENCE_DIR = path.resolve(process.cwd(), 'modules/mat/tests/liveness/liveness-evidence');
const TIMESTAMP = new Date().toISOString().replace(/[:.]/g, '-');
const RUN_DIR = path.join(EVIDENCE_DIR, `run-${TIMESTAMP}`);

const SPEC_FILES = [
  path.join(LIVENESS_DIR, 'mat-liveness.spec.ts'),
  path.join(LIVENESS_DIR, 'mat-ai-health.spec.ts'),
  path.join(LIVENESS_DIR, 'mat-visual.spec.ts'),
];

function runSpec(specFile: string): { passed: boolean; output: string } {
  const result = spawnSync(
    'npx',
    ['playwright', 'test', specFile, '--reporter=json'],
    {
      env: { ...process.env, PLAYWRIGHT_JSON_OUTPUT_NAME: path.join(RUN_DIR, `${path.basename(specFile)}.results.json`) },
      encoding: 'utf-8',
      cwd: process.cwd(),
    }
  );
  return {
    passed: result.status === 0,
    output: result.stdout + result.stderr,
  };
}

async function main() {
  fs.mkdirSync(RUN_DIR, { recursive: true });

  const results = SPEC_FILES.map((spec) => {
    console.log(`Running: ${path.basename(spec)}`);
    return { spec, ...runSpec(spec) };
  });

  const allPassed = results.every((r) => r.passed);
  const anyFailed = results.some((r) => !r.passed);

  // Write run summary
  const summary = { runId: `liveness-run-${TIMESTAMP}`, baseUrl: process.env.BASE_URL ?? 'unknown', results };
  fs.writeFileSync(path.join(RUN_DIR, 'run-summary.json'), JSON.stringify(summary, null, 2));

  console.log(allPassed ? '✅ All liveness checks passed' : anyFailed ? '❌ Some blocking checks failed' : '⚠️ Warnings present');

  // Exit 1 only on actual failures (WARN = exit 0 per IAA OVL-CI-001)
  process.exit(anyFailed ? 1 : 0);
}

main().catch((e) => { console.error(e); process.exit(1); });
