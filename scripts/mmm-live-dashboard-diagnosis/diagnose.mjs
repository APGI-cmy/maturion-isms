#!/usr/bin/env node
/**
 * MMM live dashboard diagnosis.
 *
 * Verifies the protected MMM Vercel preview with Playwright, authenticates the
 * configured test administrator, confirms that the dashboard renders, and
 * records dashboard/API evidence. Expected 3xx navigation responses used by
 * Vercel to establish the automation-bypass cookie are diagnostic only and do
 * not represent application failures.
 */

import { chromium } from 'playwright';
import { appendFile, mkdir, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const QIW_STATUS_HINT = 'mmm-qiw-status';
const ARTIFACT_DIR = path.resolve(
  process.env.ARTIFACT_DIR || 'diagnosis-artifacts',
);

function required(name) {
  const value = process.env[name];
  if (!value || !value.trim()) {
    console.error(`[diagnose] missing required env var: ${name}`);
    process.exit(2);
  }
  return value.trim();
}

function safeJson(value) {
  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return String(value);
  }
}

function withBypassParams(rawUrl, bypassSecret) {
  if (!bypassSecret) return rawUrl;
  const url = new URL(rawUrl);
  url.searchParams.set('x-vercel-protection-bypass', bypassSecret);
  url.searchParams.set('x-vercel-set-bypass-cookie', 'samesitenone');
  return url.toString();
}

function isHttpFailure(entry) {
  return (
    entry.phase === 'response' &&
    typeof entry.status === 'number' &&
    entry.status >= 400
  );
}

function isDashboardRelated(entry) {
  return (
    entry.url.includes(QIW_STATUS_HINT) ||
    entry.url.includes('/functions/v1/')
  );
}

async function main() {
  const previewUrl = required('MMM_PREVIEW_URL');
  const email = required('MMM_TEST_ADMIN_EMAIL');
  const password = required('MMM_TEST_ADMIN_PASSWORD');
  const bypassSecret = (
    process.env.VERCEL_AUTOMATION_BYPASS_SECRET || ''
  ).trim();
  const headless =
    (process.env.HEADLESS || 'true').toLowerCase() !== 'false';

  await mkdir(ARTIFACT_DIR, { recursive: true });

  const consoleLogPath = path.join(ARTIFACT_DIR, 'console.log');
  const networkLogPath = path.join(ARTIFACT_DIR, 'network.log');
  const networkJsonPath = path.join(ARTIFACT_DIR, 'network.json');
  const summaryPath = path.join(ARTIFACT_DIR, 'diagnosis-summary.md');
  const screenshotPath = path.join(ARTIFACT_DIR, 'dashboard.png');
  const tracePath = path.join(ARTIFACT_DIR, 'trace.zip');

  await writeFile(consoleLogPath, '');
  await writeFile(networkLogPath, '');

  const configuredUrl = new URL(previewUrl);
  const navigateUrl = withBypassParams(previewUrl, bypassSecret);

  const browser = await chromium.launch({ headless });
  const context = await browser.newContext({
    ignoreHTTPSErrors: true,
    viewport: { width: 1366, height: 900 },
    extraHTTPHeaders: bypassSecret
      ? {
          'x-vercel-protection-bypass': bypassSecret,
          'x-vercel-set-bypass-cookie': 'true',
        }
      : undefined,
  });
  await context.tracing.start({
    screenshots: true,
    snapshots: true,
    sources: true,
  });

  const page = await context.newPage();
  const consoleEntries = [];
  const networkEntries = [];
  const steps = [];

  page.on('console', (message) => {
    const line = `[${new Date().toISOString()}] ${message
      .type()
      .toUpperCase()} ${message.text()}`;
    consoleEntries.push(line);
    appendFile(consoleLogPath, `${line}\n`).catch(() => {});
  });

  page.on('pageerror', (error) => {
    const line = `[${new Date().toISOString()}] PAGEERROR ${error.message}`;
    consoleEntries.push(line);
    appendFile(consoleLogPath, `${line}\n`).catch(() => {});
  });

  page.on('request', (request) => {
    networkEntries.push({
      url: request.url(),
      method: request.method(),
      phase: 'request',
      ts: new Date().toISOString(),
    });
  });

  page.on('requestfailed', (request) => {
    networkEntries.push({
      url: request.url(),
      method: request.method(),
      phase: 'failed',
      error: request.failure()?.errorText || 'unknown',
      ts: new Date().toISOString(),
    });
  });

  page.on('response', async (response) => {
    const request = response.request();
    const status = response.status();
    const url = response.url();
    let body;
    let contentType = '';

    try {
      contentType = response.headers()['content-type'] || '';
    } catch {
      // Diagnostic metadata only.
    }

    const captureBody =
      status >= 400 ||
      url.includes(QIW_STATUS_HINT) ||
      url.includes('/functions/v1/');

    if (captureBody && status < 300) {
      try {
        body = (await response.body()).toString('utf8').slice(0, 8000);
      } catch (error) {
        body = `(failed to read body: ${error?.message || error})`;
      }
    }

    networkEntries.push({
      url,
      method: request.method(),
      status,
      ok: status < 400,
      contentType,
      body,
      phase: 'response',
      ts: new Date().toISOString(),
    });
  });

  let deploymentAccess = false;
  let loginSuccess = false;
  let dashboardLoaded = false;
  let dashboardErrorVisible = false;
  let permissionErrorVisible = false;

  async function step(name, operation) {
    try {
      const detail = await operation();
      steps.push({ step: name, ok: true, detail });
      console.log(`[diagnose] ✓ ${name}${detail ? ` — ${detail}` : ''}`);
    } catch (error) {
      const detail = error?.message || String(error);
      steps.push({ step: name, ok: false, detail });
      console.error(`[diagnose] ✗ ${name} — ${detail}`);
      throw error;
    }
  }

  try {
    await step('navigate-to-preview', async () => {
      const response = await page.goto(navigateUrl, {
        waitUntil: 'domcontentloaded',
        timeout: 60_000,
      });
      const status = response?.status();
      deploymentAccess =
        Boolean(response) && typeof status === 'number' && status < 400;
      if (!deploymentAccess) {
        throw new Error(`preview navigation failed with status ${status ?? 'n/a'}`);
      }
      return `status=${status}${bypassSecret ? ' (vercel-bypass=applied)' : ''}`;
    });

    await page.waitForLoadState('networkidle', { timeout: 30_000 }).catch(() => {});

    const loginEmail = page.locator('#login-email');
    const onLogin = await loginEmail
      .waitFor({ state: 'visible', timeout: 20_000 })
      .then(() => true)
      .catch(() => false);

    if (onLogin) {
      await step('submit-login', async () => {
        await page.fill('#login-email', email);
        await page.fill('#login-password', password);
        await Promise.all([
          page
            .waitForURL(/\/dashboard/, { timeout: 30_000 })
            .catch(() => null),
          page.click('button[type="submit"]'),
        ]);

        const currentUrl = page.url();
        loginSuccess = currentUrl.includes('/dashboard');
        if (!loginSuccess) {
          const alert = await page
            .locator('.alert.alert-error')
            .first()
            .innerText()
            .catch(() => '');
          throw new Error(
            `login did not reach /dashboard; currentUrl=${currentUrl} alert=${
              alert || '(none)'
            }`,
          );
        }
        return `currentUrl=${currentUrl}`;
      });
    } else {
      loginSuccess = page.url().includes('/dashboard');
    }

    await step('wait-for-dashboard-render', async () => {
      await page.waitForLoadState('networkidle', { timeout: 30_000 }).catch(() => {});

      const dashboardError = page.getByTestId('dashboard-error');
      const permissionError = page.getByTestId('dashboard-permission-error');
      const heading = page.getByRole('heading', {
        name: /Maturity Dashboard/i,
      });

      await Promise.race([
        dashboardError
          .waitFor({ state: 'visible', timeout: 30_000 })
          .catch(() => null),
        permissionError
          .waitFor({ state: 'visible', timeout: 30_000 })
          .catch(() => null),
        heading
          .waitFor({ state: 'visible', timeout: 30_000 })
          .catch(() => null),
      ]);

      dashboardErrorVisible = await dashboardError
        .isVisible()
        .catch(() => false);
      permissionErrorVisible = await permissionError
        .isVisible()
        .catch(() => false);
      const headingVisible = await heading.isVisible().catch(() => false);
      dashboardLoaded =
        headingVisible && !dashboardErrorVisible && !permissionErrorVisible;

      if (!dashboardLoaded) {
        throw new Error(
          `dashboard did not render successfully: heading=${headingVisible} dashboardError=${dashboardErrorVisible} permissionError=${permissionErrorVisible}`,
        );
      }

      return 'dashboard heading visible with no error banner';
    });
  } catch (error) {
    console.error('[diagnose] flow halted:', error?.message || error);
  }

  try {
    await page.screenshot({ path: screenshotPath, fullPage: true });
  } catch (error) {
    console.error('[diagnose] screenshot failed:', error?.message || error);
  }

  try {
    await context.tracing.stop({ path: tracePath });
  } catch (error) {
    console.error('[diagnose] trace stop failed:', error?.message || error);
  }

  await browser.close().catch(() => {});

  await writeFile(networkJsonPath, safeJson(networkEntries));
  const networkLines = networkEntries.map((entry) => {
    const base = `[${entry.ts}] ${entry.phase.toUpperCase()} ${entry.method} ${entry.url}`;
    if (entry.phase === 'response') {
      return `${base} -> ${entry.status}${
        isHttpFailure(entry) ? ' (NOT OK)' : ''
      } ct=${entry.contentType || '-'}${
        entry.body
          ? `\n    body: ${entry.body.replace(/\n/g, ' ').slice(0, 1200)}`
          : ''
      }`;
    }
    if (entry.phase === 'failed') return `${base} -> FAILED ${entry.error}`;
    return base;
  });
  await writeFile(networkLogPath, `${networkLines.join('\n')}\n`);

  const qiwResponses = networkEntries.filter(
    (entry) =>
      entry.phase === 'response' && entry.url.includes(QIW_STATUS_HINT),
  );

  const failingDashboardCall =
    networkEntries.find(
      (entry) => isDashboardRelated(entry) && isHttpFailure(entry),
    ) ||
    networkEntries.find(
      (entry) =>
        isDashboardRelated(entry) && entry.phase === 'failed',
    );

  let likelyRootCause = 'none — live dashboard verification passed';
  let nextFix = 'No corrective action required.';

  if (failingDashboardCall?.phase === 'failed') {
    likelyRootCause = 'network/CORS — dashboard request received no response';
    nextFix =
      'Verify the edge function deployment and allowed preview origin.';
  } else if (failingDashboardCall) {
    likelyRootCause = `dashboard/API HTTP ${failingDashboardCall.status}`;
    nextFix =
      'Inspect the captured response body and corresponding Supabase function logs.';
  } else if (dashboardErrorVisible || permissionErrorVisible) {
    likelyRootCause = 'dashboard rendered an application or permission error';
    nextFix = 'Inspect the dashboard screenshot and network evidence.';
  } else if (!loginSuccess) {
    likelyRootCause = 'login flow did not reach /dashboard';
    nextFix = 'Verify the configured test administrator credentials and profile.';
  } else if (!deploymentAccess) {
    likelyRootCause = 'protected preview was not reachable';
    nextFix = 'Verify the MMM preview URL and automation-bypass secret.';
  }

  const failingRequest = failingDashboardCall
    ? `${failingDashboardCall.method} ${failingDashboardCall.url}`
    : '(none)';
  const failingStatus =
    failingDashboardCall?.status || failingDashboardCall?.error || '(n/a)';
  const failingBody = failingDashboardCall?.body || '(no failing body captured)';
  const consoleErrors = consoleEntries
    .filter((entry) => /ERROR|PAGEERROR/.test(entry))
    .slice(-25)
    .join('\n');

  const summary = `# MMM Live Dashboard Diagnosis Summary

DEPLOYMENT_ACCESS: ${deploymentAccess ? 'yes' : 'no'}
LOGIN_SUCCESS: ${loginSuccess ? 'yes' : 'no'}
DASHBOARD_LOAD: ${dashboardLoaded ? 'pass' : 'fail'}
FAILING_REQUEST: ${failingRequest}
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

- Preview URL: ${configuredUrl.origin}${configuredUrl.pathname}
- Vercel protection bypass: ${
    bypassSecret ? 'applied' : 'not applied'
  }
- Steps:
${steps
  .map(
    (entry) =>
      `  - ${entry.ok ? '✓' : '✗'} ${entry.step}${
        entry.detail ? ` — ${entry.detail}` : ''
      }`,
  )
  .join('\n')}

## mmm-qiw-status calls observed
${
  qiwResponses.length
    ? qiwResponses
        .map(
          (entry) =>
            `- ${entry.method} ${entry.url} → ${entry.status} ${
              isHttpFailure(entry) ? 'NOT OK' : 'OK'
            }`,
        )
        .join('\n')
    : '(none)'
}

## Artifacts
- dashboard.png
- console.log
- network.log
- network.json
- trace.zip
`;

  await writeFile(summaryPath, summary);
  console.log(`[diagnose] wrote diagnosis-summary.md (${summary.length} bytes)`);

  const failed =
    !deploymentAccess ||
    !loginSuccess ||
    !dashboardLoaded ||
    dashboardErrorVisible ||
    permissionErrorVisible ||
    Boolean(failingDashboardCall);

  process.exit(failed ? 1 : 0);
}

main().catch((error) => {
  console.error('[diagnose] fatal:', error?.stack || error?.message || error);
  process.exit(2);
});
