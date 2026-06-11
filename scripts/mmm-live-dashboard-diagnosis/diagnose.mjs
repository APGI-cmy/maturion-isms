#!/usr/bin/env node
/**
 * MMM Live Dashboard Diagnosis (PR #1590)
 *
 * Drives the live Vercel protected-preview deployment with Playwright,
 * logs in as the configured test admin, opens /dashboard, and captures:
 *
 *   - screenshot of the dashboard route
 *   - browser console messages
 *   - all network requests/responses (URL, method, status, body for failing calls)
 *   - the Playwright trace (zip)
 *   - a diagnosis-summary.md file with the standard PR response fields
 *
 * The script exits non-zero (after writing artifacts) when the dashboard
 * shows the "Unable to load dashboard data." error banner OR when the
 * mmm-qiw-status (or any dashboard-related) network call fails.
 *
 * Required environment variables:
 *   MMM_PREVIEW_URL                 Full URL pointing at /dashboard
 *   MMM_TEST_ADMIN_EMAIL            Test admin email
 *   MMM_TEST_ADMIN_PASSWORD         Test admin password
 *
 * Optional:
 *   VERCEL_AUTOMATION_BYPASS_SECRET Vercel Deployment Protection bypass secret.
 *                                   When set, the script appends
 *                                   `x-vercel-protection-bypass=<secret>` and
 *                                   `x-vercel-set-bypass-cookie=samesitenone`
 *                                   to the first navigation so subsequent
 *                                   requests carry the protection-bypass
 *                                   cookie.
 *   MMM_TEST_ADMIN_USER_ID          (recorded into summary only)
 *   MMM_TEST_ORGANISATION_ID        (recorded into summary only)
 *   ARTIFACT_DIR                    Output directory (default ./diagnosis-artifacts)
 *   HEADLESS                        "false" to run headed (default headless)
 */

import { chromium } from 'playwright';
import { mkdir, writeFile, appendFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const DASHBOARD_ERROR_TEXT =
  'Unable to load dashboard data. Please check your connection and try again.';
const QIW_STATUS_HINT = 'mmm-qiw-status';

const ARTIFACT_DIR = path.resolve(
  process.env.ARTIFACT_DIR || 'diagnosis-artifacts',
);

function required(name) {
  const v = process.env[name];
  if (!v || !v.trim()) {
    console.error(`[diagnose] missing required env var: ${name}`);
    process.exit(2);
  }
  return v;
}

function safeJson(value) {
  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return String(value);
  }
}

async function main() {
  const previewUrl = required('MMM_PREVIEW_URL');
  const email = required('MMM_TEST_ADMIN_EMAIL');
  const password = required('MMM_TEST_ADMIN_PASSWORD');
  const bypassSecret = (process.env.VERCEL_AUTOMATION_BYPASS_SECRET || '').trim();
  const storageStatePath = (process.env.VERCEL_BYPASS_STORAGE_STATE || '').trim();
  const headless = (process.env.HEADLESS || 'true').toLowerCase() !== 'false';

  if (!existsSync(ARTIFACT_DIR)) {
    await mkdir(ARTIFACT_DIR, { recursive: true });
  }

  // If a Vercel Deployment Protection bypass secret is supplied, attach it to
  // the first navigation URL so Vercel sets the bypass cookie for the rest of
  // the session. Both query params are required by Vercel's documented
  // "Automation Bypass" flow.
  // See: https://vercel.com/docs/security/deployment-protection/methods-to-bypass-deployment-protection/protection-bypass-automation
  function withBypassParams(rawUrl) {
    if (!bypassSecret) return rawUrl;
    const u = new URL(rawUrl);
    u.searchParams.set('x-vercel-protection-bypass', bypassSecret);
    u.searchParams.set('x-vercel-set-bypass-cookie', 'samesitenone');
    return u.toString();
  }
  // When a pre-primed storageState is available the bypass cookie is already in
  // the browser context — no query params needed on the navigation URL.
  const navigateUrl = storageStatePath ? previewUrl : withBypassParams(previewUrl);

  const consoleLogPath = path.join(ARTIFACT_DIR, 'console.log');
  const networkLogPath = path.join(ARTIFACT_DIR, 'network.log');
  const networkJsonPath = path.join(ARTIFACT_DIR, 'network.json');
  const summaryPath = path.join(ARTIFACT_DIR, 'diagnosis-summary.md');
  const screenshotPath = path.join(ARTIFACT_DIR, 'dashboard.png');
  const tracePath = path.join(ARTIFACT_DIR, 'trace.zip');

  await writeFile(consoleLogPath, '');
  await writeFile(networkLogPath, '');

  const previewURL = new URL(previewUrl);
  const origin = previewURL.origin;

  const browser = await chromium.launch({ headless });
  const context = await browser.newContext({
    ignoreHTTPSErrors: true,
    viewport: { width: 1366, height: 900 },
    // Use a pre-primed storageState (bypass cookie) when available; otherwise
    // forward the bypass header on every request as a belt-and-braces measure.
    ...(storageStatePath
      ? { storageState: storageStatePath }
      : bypassSecret
      ? { extraHTTPHeaders: { 'x-vercel-protection-bypass': bypassSecret } }
      : {}),
  });
  await context.tracing.start({ screenshots: true, snapshots: true, sources: true });
  const page = await context.newPage();

  const consoleEntries = [];
  page.on('console', (msg) => {
    const line = `[${new Date().toISOString()}] ${msg.type().toUpperCase()} ${msg.text()}`;
    consoleEntries.push(line);
    appendFile(consoleLogPath, line + '\n').catch(() => {});
  });
  page.on('pageerror', (err) => {
    const line = `[${new Date().toISOString()}] PAGEERROR ${err.message}`;
    consoleEntries.push(line);
    appendFile(consoleLogPath, line + '\n').catch(() => {});
  });

  /** @type {Array<{url:string,method:string,status?:number,ok?:boolean,contentType?:string,body?:string,error?:string,phase:string,ts:string}>} */
  const networkEntries = [];

  page.on('request', (req) => {
    networkEntries.push({
      url: req.url(),
      method: req.method(),
      phase: 'request',
      ts: new Date().toISOString(),
    });
  });

  page.on('requestfailed', (req) => {
    networkEntries.push({
      url: req.url(),
      method: req.method(),
      phase: 'failed',
      error: req.failure()?.errorText || 'unknown',
      ts: new Date().toISOString(),
    });
  });

  page.on('response', async (resp) => {
    const req = resp.request();
    const url = resp.url();
    const status = resp.status();
    const ok = resp.ok();
    let body;
    let contentType = '';
    try {
      const headers = resp.headers();
      contentType = headers['content-type'] || '';
    } catch {
      /* noop */
    }
    // Capture body for non-2xx OR mmm-qiw-status calls (any status) OR any /functions/v1/ call
    const isQiw = url.includes(QIW_STATUS_HINT);
    const isFunctionsCall = url.includes('/functions/v1/');
    const capture = !ok || isQiw || isFunctionsCall;
    if (capture) {
      try {
        const buf = await resp.body();
        body = buf.toString('utf8').slice(0, 8000);
      } catch (e) {
        body = `(failed to read body: ${e?.message || e})`;
      }
    }
    networkEntries.push({
      url,
      method: req.method(),
      status,
      ok,
      contentType,
      body,
      phase: 'response',
      ts: new Date().toISOString(),
    });
  });

  /** @type {{step:string,detail?:string,ok:boolean}[]} */
  const steps = [];
  let deploymentAccess = false;
  let loginSuccess = false;
  let dashboardLoaded = false;
  let dashboardErrorVisible = false;

  async function step(name, fn) {
    try {
      const detail = await fn();
      steps.push({ step: name, ok: true, detail });
      console.log(`[diagnose] ✓ ${name}${detail ? ` — ${detail}` : ''}`);
    } catch (err) {
      const msg = err?.message || String(err);
      steps.push({ step: name, ok: false, detail: msg });
      console.log(`[diagnose] ✗ ${name} — ${msg}`);
      throw err;
    }
  }

  try {
    await step('navigate-to-preview', async () => {
      const resp = await page.goto(navigateUrl, {
        waitUntil: 'domcontentloaded',
        timeout: 60_000,
      });
      const s = resp?.status();
      deploymentAccess = !!resp && s !== undefined && s < 400;
      return `status=${s ?? 'n/a'}${bypassSecret ? ' (vercel-bypass=applied)' : ''}`;
    });

    // The MMM SPA redirects unauthenticated users to /login. Detect and log in.
    await step('detect-login-form', async () => {
      // Wait briefly for SPA to render. Either email field or dashboard renders.
      await page.waitForLoadState('networkidle', { timeout: 30_000 }).catch(() => {});
      const loginEmail = page.locator('#login-email');
      const dashErr = page.getByTestId('dashboard-error');
      const visible = await Promise.race([
        loginEmail
          .waitFor({ state: 'visible', timeout: 20_000 })
          .then(() => 'login')
          .catch(() => null),
        dashErr
          .waitFor({ state: 'visible', timeout: 20_000 })
          .then(() => 'dashboard-error')
          .catch(() => null),
      ]);
      return `first-visible=${visible || 'unknown'}`;
    });

    const onLogin = await page.locator('#login-email').isVisible().catch(() => false);
    if (onLogin) {
      await step('fill-login', async () => {
        await page.fill('#login-email', email);
        await page.fill('#login-password', password);
        return 'credentials entered';
      });
      await step('submit-login', async () => {
        await Promise.all([
          page
            .waitForURL(/\/dashboard/, { timeout: 30_000 })
            .catch(() => null),
          page.click('button[type="submit"]'),
        ]);
        const url = page.url();
        loginSuccess = url.includes('/dashboard');
        if (!loginSuccess) {
          // Check for visible login error
          const errText = await page
            .locator('.alert.alert-error')
            .first()
            .innerText()
            .catch(() => '');
          throw new Error(
            `login did not navigate to /dashboard, currentUrl=${url} alert=${errText || '(none)'}`,
          );
        }
        return `currentUrl=${url}`;
      });
    } else {
      // Already on dashboard route somehow (e.g. existing session). Treat as logged in.
      loginSuccess = page.url().includes('/dashboard');
    }

    await step('wait-for-dashboard-render', async () => {
      await page.waitForLoadState('networkidle', { timeout: 30_000 }).catch(() => {});
      // Wait up to 20s for either the dashboard pipeline section or the error banner.
      const errorLocator = page.getByTestId('dashboard-error');
      const permLocator = page.getByTestId('dashboard-permission-error');
      const headingLocator = page.getByRole('heading', { name: /Maturity Dashboard/i });

      // Give either outcome time to render
      await Promise.race([
        errorLocator.waitFor({ state: 'visible', timeout: 30_000 }).catch(() => null),
        permLocator.waitFor({ state: 'visible', timeout: 30_000 }).catch(() => null),
        headingLocator.waitFor({ state: 'visible', timeout: 30_000 }).catch(() => null),
      ]);

      dashboardErrorVisible = await errorLocator.isVisible().catch(() => false);
      const permVisible = await permLocator.isVisible().catch(() => false);
      dashboardLoaded = !dashboardErrorVisible && !permVisible;
      return `errorVisible=${dashboardErrorVisible} permissionErrorVisible=${permVisible} loaded=${dashboardLoaded}`;
    });
  } catch (err) {
    console.error('[diagnose] flow halted:', err?.message || err);
  }

  // Always capture screenshot + trace
  try {
    await page.screenshot({ path: screenshotPath, fullPage: true });
  } catch (e) {
    console.error('[diagnose] screenshot failed:', e?.message || e);
  }
  try {
    await context.tracing.stop({ path: tracePath });
  } catch (e) {
    console.error('[diagnose] trace stop failed:', e?.message || e);
  }
  await browser.close().catch(() => {});

  // Persist network logs
  await writeFile(networkJsonPath, safeJson(networkEntries));
  const netLines = networkEntries.map((e) => {
    const base = `[${e.ts}] ${e.phase.toUpperCase()} ${e.method} ${e.url}`;
    if (e.phase === 'response')
      return `${base} -> ${e.status}${e.ok ? '' : ' (NOT OK)'} ct=${e.contentType || '-'}${
        e.body ? `\n    body: ${e.body.replace(/\n/g, ' ').slice(0, 1200)}` : ''
      }`;
    if (e.phase === 'failed') return `${base} -> FAILED ${e.error}`;
    return base;
  });
  await writeFile(networkLogPath, netLines.join('\n') + '\n');

  // Diagnose root cause from network log
  const failingDashboardCall = networkEntries
    .filter((e) => e.phase === 'response' && e.ok === false)
    .find((e) => e.url.includes(QIW_STATUS_HINT)) ||
    networkEntries
      .filter((e) => e.phase === 'response' && e.ok === false)
      .find((e) => e.url.includes('/functions/v1/')) ||
    networkEntries.find((e) => e.phase === 'failed' && e.url.includes(QIW_STATUS_HINT)) ||
    networkEntries
      .filter((e) => e.phase === 'response' && e.ok === false)
      .pop();

  const qiwResponses = networkEntries.filter(
    (e) => e.phase === 'response' && e.url.includes(QIW_STATUS_HINT),
  );

  let likelyRootCause = 'unknown';
  let nextFix = 'Review captured artifacts; see network.log and dashboard.png.';
  if (failingDashboardCall) {
    const s = failingDashboardCall.status;
    if (failingDashboardCall.phase === 'failed') {
      likelyRootCause = 'network/CORS — request never received a response';
      nextFix =
        'Verify the edge function is deployed and CORS allows the preview origin. Check `supabase/functions/mmm-qiw-status` ALLOWED_ORIGINS / Access-Control-Allow-Origin.';
    } else if (s === 401 || s === 403) {
      likelyRootCause = `auth/RLS — ${s} returned from edge function`;
      nextFix =
        'Confirm Authorization header is being forwarded by supabase.functions.invoke (session present), and that the edge function authorises ADMIN/LEAD_AUDITOR via profile.role. Check RLS policies on tables read by the function.';
    } else if (s === 404) {
      likelyRootCause = 'missing function — mmm-qiw-status not deployed on the project';
      nextFix =
        'Re-run deploy-mmm-edge-functions workflow against the production/preview Supabase project, then retest.';
    } else if (s === 500 || s === 502 || s === 503) {
      likelyRootCause = 'edge function runtime error or downstream Supabase failure';
      nextFix =
        'Inspect Supabase edge function logs for mmm-qiw-status and the captured response body for the failing reason. Likely missing env var, bad schema query, or migration drift.';
    } else if (s && s >= 400) {
      likelyRootCause = `HTTP ${s} from dashboard call — response-shape or validation`;
      nextFix =
        'Inspect captured response body (network.log) for the failing reason and align client expectation in apps/mmm/src/pages/DashboardPage.tsx with the function response schema.';
    }
  } else if (dashboardErrorVisible && qiwResponses.length === 0) {
    likelyRootCause =
      'no mmm-qiw-status call observed — VITE_SUPABASE_URL/ANON_KEY may be empty in the preview build';
    nextFix =
      'Verify Vercel preview env vars VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are populated and rebuild.';
  } else if (dashboardErrorVisible) {
    likelyRootCause =
      'dashboard error banner visible but no failing HTTP response captured — response-shape mismatch (function returned 200 with unexpected shape)';
    nextFix =
      'Inspect mmm-qiw-status response body and DashboardPage.tsx parsing; the function likely returned a payload that surfaced as a thrown error in queryFn.';
  } else if (!dashboardLoaded && !loginSuccess) {
    likelyRootCause = 'login flow did not reach /dashboard';
    nextFix =
      'Check credentials (MMM_TEST_ADMIN_EMAIL / MMM_TEST_ADMIN_PASSWORD), Supabase auth status, and that the preview URL points at the same Supabase project where the test user exists.';
  } else if (!deploymentAccess) {
    likelyRootCause = 'preview URL not reachable (Vercel share token expired or 401)';
    nextFix = 'Generate a fresh ?_vercel_share=... token and re-run.';
  }

  const failingReq = failingDashboardCall
    ? `${failingDashboardCall.method} ${failingDashboardCall.url}`
    : '(no failing dashboard request captured)';
  const failingStatus = failingDashboardCall?.status ?? failingDashboardCall?.error ?? '(n/a)';
  const failingBody = failingDashboardCall?.body
    ? failingDashboardCall.body.slice(0, 4000)
    : '(no body captured)';
  const consoleErrors = consoleEntries
    .filter((l) => /ERROR|PAGEERROR/.test(l))
    .slice(-25)
    .join('\n');

  const summary = `# MMM Live Dashboard Diagnosis Summary

DEPLOYMENT_ACCESS: ${deploymentAccess ? 'yes' : 'no'}
LOGIN_SUCCESS: ${loginSuccess ? 'yes' : 'no'}
DASHBOARD_LOAD: ${dashboardLoaded ? 'pass' : 'fail'}
FAILING_REQUEST: ${failingReq}
HTTP_STATUS: ${failingStatus}
RESPONSE_BODY:
\`\`\`
${failingBody}
\`\`\`
CONSOLE_ERROR:
\`\`\`
${consoleErrors || '(none)'}
\`\`\`
LIKELY_ROOT_CAUSE: ${likelyRootCause}
NEXT_FIX: ${nextFix}

---

## Run context

- Preview URL: ${origin}${previewURL.pathname}${previewURL.search ? ' (with query params)' : ''}
- Vercel protection bypass: ${bypassSecret ? 'applied (VERCEL_AUTOMATION_BYPASS_SECRET present)' : 'not applied'}
- Steps:
${steps.map((s) => `  - ${s.ok ? '✓' : '✗'} ${s.step}${s.detail ? ` — ${s.detail}` : ''}`).join('\n')}

## mmm-qiw-status calls observed
${
  qiwResponses.length === 0
    ? '(none)'
    : qiwResponses
        .map((r) => `- ${r.method} ${r.url} → ${r.status} ${r.ok ? 'OK' : 'NOT OK'}`)
        .join('\n')
}

## Artifacts
- dashboard.png (screenshot, full page)
- console.log (browser console + page errors)
- network.log (human-readable request/response log)
- network.json (machine-readable network entries)
- trace.zip (Playwright trace, open with: npx playwright show-trace trace.zip)
`;

  await writeFile(summaryPath, summary);
  // NOTE: do not echo the full summary to stdout. The summary file is uploaded
  // as a workflow artifact and mirrored to $GITHUB_STEP_SUMMARY by the workflow.
  // We avoid echoing the full body (which may include env-derived identifiers
  // or response bodies) into the public runner log. Print only a short marker.
  console.log(`\n[diagnose] wrote diagnosis-summary.md (${summary.length} bytes)`);

  // Exit non-zero when the live dashboard failure is reproduced or no diagnosis possible.
  const reproduced = dashboardErrorVisible || !!failingDashboardCall;
  if (reproduced || !dashboardLoaded) {
    process.exit(1);
  }
  process.exit(0);
}

main().catch((err) => {
  console.error('[diagnose] fatal:', err?.stack || err?.message || err);
  process.exit(2);
});
