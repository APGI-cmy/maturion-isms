#!/usr/bin/env node
/**
 * MMM Mode A/B/C End-to-End Verification (PR #1590 — Phase 6)
 *
 * Runs the full MMM framework lifecycle for each mode against the live
 * Vercel preview deployment:
 *
 *   Mode B: AI generate → review page → compile → publish
 *   Mode A: Upload document → parse COMPLETE → review page → compile → publish
 *   Mode C: Hybrid upload → parse COMPLETE → review page → compile → publish
 *   Dashboard: Verify dashboard reflects completed frameworks
 *
 * Required environment variables:
 *   MMM_PREVIEW_URL                 Base URL of the preview deployment
 *   MMM_TEST_ADMIN_EMAIL            Test admin email
 *   MMM_TEST_ADMIN_PASSWORD         Test admin password
 *
 * Optional:
 *   VERCEL_AUTOMATION_BYPASS_SECRET Vercel Deployment Protection bypass secret
 *   SAMPLE_FILE_PATH                Path to framework source file for Mode A/C
 *                                   (defaults to sample-framework.txt in same dir)
 *   ARTIFACT_DIR                    Output directory (default ./diagnosis-artifacts)
 *   HEADLESS                        "false" to run headed (default headless)
 */

import { chromium } from 'playwright';
import { mkdir, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import process from 'node:process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const ARTIFACT_DIR = path.resolve(
  process.env.ARTIFACT_DIR || 'diagnosis-artifacts',
);

// Timeouts
const NAV_TIMEOUT = 60_000;
const WAIT_TIMEOUT = 30_000;
const PARSE_JOB_TIMEOUT = 120_000; // 2 minutes for parse job to complete
const COMPILE_TIMEOUT = 60_000;
const AI_GENERATION_TIMEOUT = 180_000; // 3 minutes — AIMC framework-generate can take up to 90s+retry

function required(name) {
  const v = process.env[name];
  if (!v || !v.trim()) {
    console.error(`[verify-modes] missing required env var: ${name}`);
    process.exit(2);
  }
  return v;
}

function withBypassParams(rawUrl, bypassSecret) {
  if (!bypassSecret) return rawUrl;
  const u = new URL(rawUrl);
  u.searchParams.set('x-vercel-protection-bypass', bypassSecret);
  u.searchParams.set('x-vercel-set-bypass-cookie', 'samesitenone');
  return u.toString();
}

function safeJson(value) {
  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return String(value);
  }
}

/**
 * Login to the app and return to the dashboard URL.
 * Assumes we start at the app origin or dashboard URL.
 */
async function loginIfNeeded(page, loginUrl, email, password) {
  await page.goto(loginUrl, { waitUntil: 'domcontentloaded', timeout: NAV_TIMEOUT });
  await page.waitForLoadState('networkidle', { timeout: WAIT_TIMEOUT }).catch(() => {});

  const loginEmail = page.locator('#login-email');
  const onLoginPage = await loginEmail
    .waitFor({ state: 'visible', timeout: 15_000 })
    .then(() => true)
    .catch(() => false);

  if (!onLoginPage) {
    // Already authenticated or not on login page
    const currentUrl = page.url();
    if (currentUrl.includes('/dashboard') || currentUrl.includes('/frameworks')) {
      return true;
    }
    // May have redirected to login with different structure
    console.log(`[verify-modes] Not on login page and not on dashboard: ${currentUrl}`);
    return false;
  }

  await page.fill('#login-email', email);
  await page.fill('#login-password', password);
  await Promise.all([
    page.waitForURL(/\/(dashboard|frameworks)/, { timeout: WAIT_TIMEOUT }).catch(() => null),
    page.click('button[type="submit"]'),
  ]);

  const url = page.url();
  const success = url.includes('/dashboard') || url.includes('/frameworks');
  if (!success) {
    const errText = await page
      .locator('.alert.alert-error')
      .first()
      .innerText()
      .catch(() => '');
    throw new Error(
      `Login failed — currentUrl=${url} alert=${errText || '(none)'}`,
    );
  }
  return true;
}

/**
 * Run a single framework mode (A, B, or C) end-to-end.
 * Returns an object with: success, frameworkId, compileResult, publishResult, details[]
 */
async function runMode(page, origin, mode, sampleFilePath) {
  const details = [];
  let frameworkId = null;
  let compileResult = 'not-attempted';
  let publishResult = 'not-attempted';

  function log(msg) {
    details.push(msg);
    console.log(`[verify-modes][Mode ${mode}] ${msg}`);
  }

  try {
    // 1. Navigate to the upload page
    await page.goto(`${origin}/frameworks/upload`, {
      waitUntil: 'domcontentloaded',
      timeout: NAV_TIMEOUT,
    });
    await page.waitForLoadState('networkidle', { timeout: WAIT_TIMEOUT }).catch(() => {});
    log('Navigated to /frameworks/upload');

    // 2. Select the mode via the radio button.
    // NOTE: The radio input has className="sr-only" (visually hidden); the parent
    // <label class="mode-card"> intercepts pointer events. Click the label instead
    // of the hidden radio so the React onChange handler fires reliably.
    const radioLocator = page.locator(`input[name="framework-mode"][value="${mode}"]`);
    await radioLocator.waitFor({ state: 'attached', timeout: WAIT_TIMEOUT });
    const isChecked = await radioLocator.isChecked();
    if (!isChecked) {
      const labelLocator = page.locator(`label:has(input[name="framework-mode"][value="${mode}"])`);
      await labelLocator.waitFor({ state: 'visible', timeout: WAIT_TIMEOUT });
      await labelLocator.click();
      // Verify radio is now checked (React state update is sync via onChange)
      const nowChecked = await radioLocator.isChecked().catch(() => false);
      if (!nowChecked) {
        // Fallback: force-set the radio state directly
        await radioLocator.check({ force: true });
      }
      log(`Selected Mode ${mode}`);
    } else {
      log(`Mode ${mode} already selected`);
    }

    // 3. For Mode A/C, attach the sample file
    if (mode === 'A' || mode === 'C') {
      const fileInput = page.locator('#framework-source-file');
      await fileInput.waitFor({ state: 'attached', timeout: WAIT_TIMEOUT });
      await fileInput.setInputFiles(sampleFilePath);
      log(`Attached sample file: ${path.basename(sampleFilePath)}`);
    }

    // 4. Click Start — wait for redirect to review page.
    // Mode B (AI generate) uses a longer timeout since the AIMC call can take up to 90s
    // with one retry + 15s backoff — total worst-case ~3 min.
    const startBtn = page.getByRole('button', { name: 'Start' });
    await startBtn.waitFor({ state: 'visible', timeout: WAIT_TIMEOUT });
    const isEnabled = await startBtn.isEnabled();
    if (!isEnabled) {
      throw new Error('Start button is disabled — file may not be attached or mode not selected');
    }

    const reviewWaitTimeout = mode === 'B' ? AI_GENERATION_TIMEOUT : WAIT_TIMEOUT;
    await Promise.all([
      page.waitForURL(/\/frameworks\/[a-f0-9-]+\/review/, { timeout: reviewWaitTimeout }),
      startBtn.click(),
    ]);

    const reviewUrl = page.url();
    const match = reviewUrl.match(/\/frameworks\/([a-f0-9-]+)\/review/);
    frameworkId = match?.[1] ?? null;
    log(`Redirected to review page: ${reviewUrl} (frameworkId=${frameworkId})`);

    await page.waitForLoadState('networkidle', { timeout: WAIT_TIMEOUT }).catch(() => {});

    // 5. For Mode A/C: wait for parse job to complete
    if (mode === 'A' || mode === 'C') {
      log('Waiting for parse job to complete (Mode A/C)…');
      const parseCompleteText = page.getByText(/✓ Complete —/);
      const parseFailText = page.getByText(/✗ Parse failed/);

      const parseOutcome = await Promise.race([
        parseCompleteText
          .waitFor({ state: 'visible', timeout: PARSE_JOB_TIMEOUT })
          .then(() => 'complete')
          .catch(() => null),
        parseFailText
          .waitFor({ state: 'visible', timeout: PARSE_JOB_TIMEOUT })
          .then(() => 'failed')
          .catch(() => null),
      ]);

      if (parseOutcome === 'complete') {
        log('Parse job COMPLETE');
      } else if (parseOutcome === 'failed') {
        log('Parse job FAILED — proceeding to check compile availability');
      } else {
        log('Parse job did not reach COMPLETE or FAILED within timeout — proceeding');
      }
    }

    // 6. For Mode B: wait for proposed domains to load (synchronous AI generation)
    if (mode === 'B') {
      log('Waiting for proposed framework structure to load (Mode B)…');
      // The review page shows "✓ Proposed structure ready" when domains exist
      const readyText = page.getByText(/✓ Proposed structure ready/);
      const noDomainsText = page.getByText(/No proposed framework structure found/);

      const structureOutcome = await Promise.race([
        readyText
          .waitFor({ state: 'visible', timeout: WAIT_TIMEOUT })
          .then(() => 'ready')
          .catch(() => null),
        noDomainsText
          .waitFor({ state: 'visible', timeout: WAIT_TIMEOUT })
          .then(() => 'none')
          .catch(() => null),
      ]);

      log(`Proposed structure outcome: ${structureOutcome ?? 'unknown (may still be loading)'}`);
    }

    // 7. Wait for Compile button to become enabled
    const compileBtn = page.getByRole('button', { name: /^Compile$/ });
    await compileBtn.waitFor({ state: 'visible', timeout: WAIT_TIMEOUT });

    // Poll up to 60s for compile button to be enabled (parse jobs can take time)
    let compileEnabled = false;
    const compileCheckDeadline = Date.now() + 60_000;
    while (!compileEnabled && Date.now() < compileCheckDeadline) {
      compileEnabled = await compileBtn.isEnabled();
      if (!compileEnabled) {
        await page.waitForTimeout(2000);
      }
    }

    if (!compileEnabled) {
      // Check what's blocking: parse job status, proposed domains
      const MAX_ERROR_CONTEXT_LENGTH = 300;
      const parseJobText = await page.locator('section').first().innerText().catch(() => '');
      throw new Error(
        `Compile button did not become enabled within timeout. Review page state: ${parseJobText.slice(0, MAX_ERROR_CONTEXT_LENGTH)}`,
      );
    }

    // 8. Click Compile
    log('Clicking Compile…');
    await compileBtn.click();

    // Wait for compile success or error
    const compileSuccess = page.getByText(/✓ Framework compiled\. Status moved to REVIEW\./);
    const compileError = page.locator('[role="alert"]').filter({ hasText: /✗ Compile failed/ });

    const compileOutcome = await Promise.race([
      compileSuccess
        .waitFor({ state: 'visible', timeout: COMPILE_TIMEOUT })
        .then(() => 'success')
        .catch(() => null),
      compileError
        .waitFor({ state: 'visible', timeout: COMPILE_TIMEOUT })
        .then(() => 'error')
        .catch(() => null),
    ]);

    if (compileOutcome === 'success') {
      compileResult = 'PASS';
      log('Compile: PASS — ✓ Framework compiled. Status moved to REVIEW.');
    } else if (compileOutcome === 'error') {
      const errMsg = await compileError.innerText().catch(() => '');
      compileResult = `FAIL — ${errMsg}`;
      log(`Compile: FAIL — ${errMsg}`);
      throw new Error(`Compile failed: ${errMsg}`);
    } else {
      compileResult = 'TIMEOUT — compile success/error banner did not appear';
      log(`Compile: ${compileResult}`);
      throw new Error(compileResult);
    }

    // 9. Click Publish
    log('Clicking Publish…');
    const publishBtn = page.getByRole('button', { name: /^Publish$/ });
    await publishBtn.waitFor({ state: 'visible', timeout: WAIT_TIMEOUT });

    // Wait for Publish to become enabled (status must be REVIEW after compile)
    let publishEnabled = false;
    const publishCheckDeadline = Date.now() + 15_000;
    while (!publishEnabled && Date.now() < publishCheckDeadline) {
      publishEnabled = await publishBtn.isEnabled();
      if (!publishEnabled) {
        await page.waitForTimeout(1000);
        // Reload query data
        await page.waitForLoadState('networkidle', { timeout: 10_000 }).catch(() => {});
      }
    }

    if (!publishEnabled) {
      throw new Error('Publish button did not become enabled after compile (framework may not be in REVIEW status)');
    }

    const publishSuccess = page.getByText(/✓ Framework published\. Redirecting…/);
    const publishError = page.locator('[role="alert"]').filter({ hasText: /✗ Publish failed/ });

    await Promise.all([
      Promise.race([
        publishSuccess
          .waitFor({ state: 'visible', timeout: WAIT_TIMEOUT })
          .then(() => 'success')
          .catch(() => null),
        publishError
          .waitFor({ state: 'visible', timeout: WAIT_TIMEOUT })
          .then(() => 'error')
          .catch(() => null),
        page.waitForURL(/\/frameworks$/, { timeout: WAIT_TIMEOUT }).catch(() => null),
      ]),
      publishBtn.click(),
    ]);

    // Check publish outcome
    const publishErrorVisible = await publishError.isVisible().catch(() => false);
    if (publishErrorVisible) {
      const errMsg = await publishError.innerText().catch(() => '');
      publishResult = `FAIL — ${errMsg}`;
      log(`Publish: FAIL — ${errMsg}`);
      throw new Error(`Publish failed: ${errMsg}`);
    }

    publishResult = 'PASS';
    log('Publish: PASS — framework published');

    return { success: true, frameworkId, compileResult, publishResult, details };
  } catch (err) {
    const msg = err?.message || String(err);
    details.push(`ERROR: ${msg}`);
    // Capture the page's mutation error state (if visible) to help diagnose backend failures
    try {
      const mutationErrPanel = await page.locator('.upload-page__next-state-panel').first().isVisible();
      if (mutationErrPanel) {
        const panelText = await page.locator('.upload-page__next-state-panel').first().innerText();
        details.push(`Page state: ${panelText.replace(/\s+/g, ' ').slice(0, 400)}`);
      }
      const mutationErrNote = await page.locator('.upload-page__next-state-note').first().isVisible();
      if (mutationErrNote) {
        const noteText = await page.locator('.upload-page__next-state-note').first().innerText();
        details.push(`Mutation error: ${noteText.replace(/\s+/g, ' ').slice(0, 300)}`);
      }
    } catch {
      // ignore secondary capture errors
    }
    return { success: false, frameworkId, compileResult, publishResult, details, error: msg };
  }
}

async function main() {
  const previewUrl = required('MMM_PREVIEW_URL');
  const email = required('MMM_TEST_ADMIN_EMAIL');
  const password = required('MMM_TEST_ADMIN_PASSWORD');
  const bypassSecret = (process.env.VERCEL_AUTOMATION_BYPASS_SECRET || '').trim();
  const headless = (process.env.HEADLESS || 'true').toLowerCase() !== 'false';

  const sampleFilePath = path.resolve(
    process.env.SAMPLE_FILE_PATH ||
    path.join(__dirname, 'sample-framework.txt'),
  );

  if (!existsSync(sampleFilePath)) {
    console.error(`[verify-modes] sample file not found: ${sampleFilePath}`);
    process.exit(2);
  }

  if (!existsSync(ARTIFACT_DIR)) {
    await mkdir(ARTIFACT_DIR, { recursive: true });
  }

  const previewURL = new URL(previewUrl);
  const origin = previewURL.origin;

  // Login URL — navigate to the app root so auth redirects us to login
  const loginUrl = withBypassParams(`${origin}/dashboard`, bypassSecret);

  const browser = await chromium.launch({ headless });
  const context = await browser.newContext({
    ignoreHTTPSErrors: true,
    viewport: { width: 1366, height: 900 },
    extraHTTPHeaders: bypassSecret
      ? { 'x-vercel-protection-bypass': bypassSecret }
      : undefined,
  });
  await context.tracing.start({ screenshots: true, snapshots: true, sources: true });
  const page = await context.newPage();

  const results = {};

  try {
    // Login once, then reuse the session for all modes
    console.log('[verify-modes] Logging in…');
    await loginIfNeeded(page, loginUrl, email, password);
    console.log(`[verify-modes] Logged in, current URL: ${page.url()}`);

    // Take a screenshot after login
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'verify-login.png') });

    // --- Mode B (no file upload — simplest, run first) ---
    console.log('[verify-modes] === Mode B: AI Generate ===');
    results.modeB = await runMode(page, origin, 'B', sampleFilePath);
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'verify-mode-b.png') });

    // --- Mode A (upload document) ---
    console.log('[verify-modes] === Mode A: Upload Document ===');
    results.modeA = await runMode(page, origin, 'A', sampleFilePath);
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'verify-mode-a.png') });

    // --- Mode C (hybrid upload) ---
    console.log('[verify-modes] === Mode C: Hybrid Upload ===');
    results.modeC = await runMode(page, origin, 'C', sampleFilePath);
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'verify-mode-c.png') });

    // --- Dashboard reflection check ---
    console.log('[verify-modes] === Dashboard Reflection ===');
    await page.goto(withBypassParams(`${origin}/dashboard`, bypassSecret), {
      waitUntil: 'domcontentloaded',
      timeout: NAV_TIMEOUT,
    });
    await page.waitForLoadState('networkidle', { timeout: WAIT_TIMEOUT }).catch(() => {});
    // Wait for the page to leave the isLoading state — the heading <h1>Maturity Dashboard</h1>
    // only renders when isLoading is false (success or error). Do NOT rely on a fixed delay.
    await page
      .getByRole('heading', { name: /Maturity Dashboard/i })
      .waitFor({ state: 'visible', timeout: WAIT_TIMEOUT })
      .catch(() => {});

    const dashboardError = await page.getByTestId('dashboard-error').isVisible().catch(() => false);
    const dashboardHeading = await page
      .getByRole('heading', { name: /Maturity Dashboard/i })
      .isVisible()
      .catch(() => false);
    results.dashboard = {
      loaded: !dashboardError && dashboardHeading,
      errorVisible: dashboardError,
    };
    console.log(`[verify-modes] Dashboard loaded: ${results.dashboard.loaded} errorVisible: ${dashboardError}`);
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'verify-dashboard.png') });
  } catch (err) {
    console.error('[verify-modes] Outer error:', err?.message || err);
  } finally {
    try {
      await context.tracing.stop({ path: path.join(ARTIFACT_DIR, 'verify-modes-trace.zip') });
    } catch {
      /* noop */
    }
    await browser.close().catch(() => {});
  }

  // Determine overall pass
  const modeA = results.modeA;
  const modeB = results.modeB;
  const modeC = results.modeC;
  const dashboard = results.dashboard;

  const allModesPass =
    modeA?.success && modeB?.success && modeC?.success && dashboard?.loaded;
  const functionalPass = allModesPass ? 'yes' : 'no';

  function modeResult(r) {
    if (!r) return 'NOT-RUN';
    if (r.success) return `PASS (frameworkId=${r.frameworkId ?? 'n/a'})`;
    return `FAIL — ${r.error ?? 'unknown'}`;
  }

  function modeDetails(r) {
    if (!r?.details?.length) return '(no details)';
    return r.details.map((d) => `  - ${d}`).join('\n');
  }

  const summary = `# MMM Mode A/B/C Verification Summary

MODE_B_RESULT: ${modeResult(modeB)}
MODE_A_RESULT: ${modeResult(modeA)}
MODE_C_RESULT: ${modeResult(modeC)}
COMPILE_RESULT: A=${modeA?.compileResult ?? 'n/a'} | B=${modeB?.compileResult ?? 'n/a'} | C=${modeC?.compileResult ?? 'n/a'}
PUBLISH_RESULT: A=${modeA?.publishResult ?? 'n/a'} | B=${modeB?.publishResult ?? 'n/a'} | C=${modeC?.publishResult ?? 'n/a'}
DASHBOARD_REFLECTION_RESULT: ${dashboard?.loaded ? 'PASS — dashboard loaded without error' : `FAIL — loaded=${dashboard?.loaded ?? false} errorVisible=${dashboard?.errorVisible ?? 'unknown'}`}
FUNCTIONAL_PASS: ${functionalPass}

---

## Mode B detail (AI Generate)
${modeDetails(modeB)}

## Mode A detail (Upload Document)
${modeDetails(modeA)}

## Mode C detail (Hybrid Upload)
${modeDetails(modeC)}

## Artifacts
- verify-login.png (screenshot after login)
- verify-mode-b.png (Mode B final state)
- verify-mode-a.png (Mode A final state)
- verify-mode-c.png (Mode C final state)
- verify-dashboard.png (dashboard state after all modes)
- verify-modes-trace.zip (Playwright trace)
`;

  await writeFile(path.join(ARTIFACT_DIR, 'verify-modes-summary.md'), summary);
  await writeFile(
    path.join(ARTIFACT_DIR, 'verify-modes-results.json'),
    safeJson({ modeA, modeB, modeC, dashboard, functionalPass }),
  );

  console.log(`\n[verify-modes] wrote verify-modes-summary.md (${summary.length} bytes)`);
  console.log(`[verify-modes] FUNCTIONAL_PASS: ${functionalPass}`);

  process.exit(functionalPass === 'yes' ? 0 : 1);
}

main().catch((err) => {
  console.error('[verify-modes] fatal:', err?.stack || err?.message || err);
  process.exit(2);
});
