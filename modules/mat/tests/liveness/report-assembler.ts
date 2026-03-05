/**
 * MAT Liveness Test Suite — Report Assembler
 * Spec Authority: modules/mat/00-app-description/MAT_LIVENESS_TEST_SPEC.md v1.0
 * Issue: #932
 * Assembles Machine Report (JSON) and Human Summary (Markdown) per spec §5.
 * Also generates the Manual Checklist per spec §3.
 */
import * as fs from 'node:fs';
import * as path from 'node:path';

const EVIDENCE_DIR = path.resolve(process.cwd(), 'modules/mat/tests/liveness/liveness-evidence');

// Spec §3 Manual Checklist template (verbatim from MAT_LIVENESS_TEST_SPEC.md)
const MANUAL_CHECKLIST = `# MAT Manual Liveness Checklist
Generated from: MAT_LIVENESS_TEST_SPEC.md v1.0
Run date: _______________
Run by: _______________
Environment: _______________

INVITATIONS
[ ] LV-04-05: Invitation email arrived in invited user's inbox within 5 minutes
[ ] LV-04-05: Invitation email contains working accept link
[ ] LV-04-05: Accept link navigates to signup/accept page

AI QUALITY (JUDGMENT REQUIRED)
[ ] LV-06-11: AI scoring result is coherent and relevant to the criteria
[ ] LV-06-11: AI rationale text is sensible (not garbled/empty/generic)
[ ] LV-06-11: AI improvement path is actionable
[ ] LV-06-11: AI chat response is relevant and not an error message

REPORT OUTPUT
[ ] LV-10-05: PDF report opens without error in PDF reader
[ ] LV-10-05: PDF contains report title, Domain/MPS/Criteria sections, ratings, recommendations
[ ] LV-10-06: DOCX report opens without error in Word or LibreOffice
[ ] LV-10-06: DOCX is correctly formatted with expected sections

ADDITIONAL HUMAN CHECKS (not covered by automation)
[ ] Notifications: Push notifications received on mobile device (if enabled)
[ ] Audio: Voice recording playback works correctly in evidence panel
[ ] Video: Video recording playback works correctly in evidence panel
[ ] Offline: Evidence capture works when network is disconnected (reconnects on restore)

OVERALL MANUAL VERDICT: __________ (PASS / FAIL / PARTIAL)
Notes: _______________
`;

function getLastRunDir(): string | null {
  if (!fs.existsSync(EVIDENCE_DIR)) return null;
  const runs = fs.readdirSync(EVIDENCE_DIR)
    .filter((d) => d.startsWith('run-'))
    .sort()
    .reverse();
  return runs.length > 0 ? path.join(EVIDENCE_DIR, runs[0]) : null;
}

interface CheckResult {
  id: string;
  description: string;
  type: 'AUTO' | 'AI' | 'VISUAL' | 'AUTO+MANUAL';
  result: 'PASS' | 'FAIL' | 'WARN' | 'SKIP';
  error?: string;
  screenshotPath?: string;
}

function assembleMachineReport(runDir: string, checks: CheckResult[]): void {
  const pass = checks.filter((c) => c.result === 'PASS').length;
  const fail = checks.filter((c) => c.result === 'FAIL').length;
  const warn = checks.filter((c) => c.result === 'WARN').length;
  const skip = checks.filter((c) => c.result === 'SKIP').length;
  const manual = 5; // LV-00-05, LV-04-05, LV-06-11, LV-10-05, LV-10-06

  const report = {
    runId: `liveness-run-${path.basename(runDir).replace('run-', '')}`,
    baseUrl: process.env.BASE_URL ?? 'unknown',
    timestamp: new Date().toISOString(),
    summary: { total: checks.length + manual, pass, fail, warn, skip, manual },
    checks,
  };
  fs.writeFileSync(path.join(runDir, 'report.json'), JSON.stringify(report, null, 2));
  console.log(`Machine report written: ${path.join(runDir, 'report.json')}`);
}

function assembleHumanSummary(runDir: string, checks: CheckResult[]): void {
  const pass = checks.filter((c) => c.result === 'PASS').length;
  const fail = checks.filter((c) => c.result === 'FAIL').length;
  const warn = checks.filter((c) => c.result === 'WARN').length;
  const skip = checks.filter((c) => c.result === 'SKIP').length;
  const auto = checks.filter((c) => c.type === 'AUTO' || c.type === 'AUTO+MANUAL').length;
  const visual = checks.filter((c) => c.type === 'VISUAL').length;
  const ai = checks.filter((c) => c.type === 'AI').length;

  const verdict = fail > 0 ? '❌ DEGRADED' : warn > 0 ? '⚠️ PARTIAL' : '✅ LIVE';
  const failedChecks = checks.filter((c) => c.result === 'FAIL');
  const warnChecks = checks.filter((c) => c.result === 'WARN');

  const md = `# MAT Liveness Assurance Report
**Date:** ${new Date().toISOString()}
**Environment:** ${process.env.BASE_URL ?? 'unknown'}
**Triggered by:** manual

## Summary
| Category | Total | PASS | FAIL | SKIP | WARN |
|----------|-------|------|------|------|------|
| AUTO checks | ${auto} | ${checks.filter((c) => (c.type === 'AUTO' || c.type === 'AUTO+MANUAL') && c.result === 'PASS').length} | ${checks.filter((c) => (c.type === 'AUTO' || c.type === 'AUTO+MANUAL') && c.result === 'FAIL').length} | ${checks.filter((c) => (c.type === 'AUTO' || c.type === 'AUTO+MANUAL') && c.result === 'SKIP').length} | ${checks.filter((c) => (c.type === 'AUTO' || c.type === 'AUTO+MANUAL') && c.result === 'WARN').length} |
| VISUAL checks | ${visual} | ${checks.filter((c) => c.type === 'VISUAL' && c.result === 'PASS').length} | ${checks.filter((c) => c.type === 'VISUAL' && c.result === 'FAIL').length} | 0 | 0 |
| AI checks | ${ai} | ${checks.filter((c) => c.type === 'AI' && c.result === 'PASS').length} | ${checks.filter((c) => c.type === 'AI' && c.result === 'FAIL').length} | ${checks.filter((c) => c.type === 'AI' && c.result === 'SKIP').length} | ${checks.filter((c) => c.type === 'AI' && c.result === 'WARN').length} |
| MANUAL (pending) | 5 | — | — | — | — |
| **TOTAL** | **${checks.length + 5}** | **${pass}** | **${fail}** | **${skip}** | **${warn}** |

## Overall Verdict
${verdict}

## Failed Checks
${failedChecks.length === 0 ? 'None' : failedChecks.map((c) => `- **${c.id}**: ${c.description} — ${c.error ?? 'no detail'}`).join('\n')}

## Warnings
${warnChecks.length === 0 ? 'None' : warnChecks.map((c) => `- **${c.id}**: ${c.description}`).join('\n')}

## Manual Checklist Status
Pending human verification — see Section 3 of MAT_LIVENESS_TEST_SPEC.md
`;

  fs.writeFileSync(path.join(runDir, 'summary.md'), md);
  console.log(`Human summary written: ${path.join(runDir, 'summary.md')}`);
}

function main() {
  const lastRun = getLastRunDir();
  if (!lastRun) {
    console.log('No run found. Run `npm run liveness` first.');
    process.exit(0);
  }

  console.log(`Assembling report from: ${lastRun}`);

  // In --last-run mode, parse existing JSON results
  const checks: CheckResult[] = [];
  // Read any existing results files
  const resultFiles = fs.readdirSync(lastRun).filter((f) => f.endsWith('.results.json'));
  for (const rf of resultFiles) {
    try {
      const data = JSON.parse(fs.readFileSync(path.join(lastRun, rf), 'utf-8'));
      // Extract check results from Playwright JSON format
      const suites = data.suites ?? [];
      for (const suite of suites) {
        for (const spec of suite.specs ?? []) {
          const idMatch = spec.title.match(/^(LV-[\w-]+):/);
          if (idMatch) {
            checks.push({
              id: idMatch[1],
              description: spec.title.replace(/^LV-[\w-]+:\s*/, ''),
              type: idMatch[1].includes('AI') ? 'AI' : 'AUTO',
              result: spec.tests?.[0]?.status === 'expected' ? 'PASS' : 'FAIL',
            });
          }
        }
      }
    } catch {
      // Skip unparseable files
    }
  }

  assembleMachineReport(lastRun, checks);
  assembleHumanSummary(lastRun, checks);
  fs.writeFileSync(path.join(lastRun, 'manual-checklist.md'), MANUAL_CHECKLIST);
  console.log(`Manual checklist written: ${path.join(lastRun, 'manual-checklist.md')}`);
  console.log('Report assembly complete.');
}

main();
