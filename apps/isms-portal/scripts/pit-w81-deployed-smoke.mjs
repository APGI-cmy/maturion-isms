#!/usr/bin/env node

const baseUrl = process.env.PIT_W81_BASE_URL;
const staticOnly = process.env.PIT_W81_STATIC_ONLY === '1';

const routes = [
  '/',
  '/login',
  '/signup',
  '/forgot-password',
  '/reset-password',
  '/invite/example-token',
  '/dashboard',
  '/projects',
  '/projects/new',
  '/onboarding',
];

if (!baseUrl) {
  console.error('PIT_W81_BASE_URL is required. Example: PIT_W81_BASE_URL=https://preview.example.com node apps/isms-portal/scripts/pit-w81-deployed-smoke.mjs');
  process.exit(2);
}

const normalizedBase = baseUrl.replace(/\/$/, '');

async function runStaticProbe() {
  const results = [];

  for (const route of routes) {
    const url = `${normalizedBase}${route}`;
    const startedAt = new Date().toISOString();
    try {
      const response = await fetch(url, { redirect: 'manual' });
      const body = await response.text();
      const servesSpaShell = body.includes('<div id="root"') || body.includes('id="root"');
      const hasWhiteScreenRisk = response.ok && body.trim().length < 250;

      results.push({
        route,
        url,
        startedAt,
        status: response.status,
        redirected: response.status >= 300 && response.status < 400,
        location: response.headers.get('location'),
        servesSpaShell,
        hasWhiteScreenRisk,
        bytes: body.length,
        hydratedAppChecked: false,
        pass: false,
        note: 'Static fetch only. This cannot prove W8.1 deployed LFV because the React app was not hydrated.',
      });
    } catch (error) {
      results.push({
        route,
        url,
        startedAt,
        error: error instanceof Error ? error.message : String(error),
        hydratedAppChecked: false,
        pass: false,
      });
    }
  }

  return {
    mode: 'static-probe',
    baseUrl: normalizedBase,
    generatedAt: new Date().toISOString(),
    lfValidated: false,
    warning: 'Static probe results are advisory only and must not be used as W8.1 deployed LFV PASS evidence.',
    results,
  };
}

async function runHydratedProbe() {
  let chromium;
  try {
    ({ chromium } = await import('playwright'));
  } catch {
    throw new Error('Hydrated W8.1 LFV requires Playwright. Run with a project environment that has playwright installed, or set PIT_W81_STATIC_ONLY=1 for advisory static probing only.');
  }

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  const results = [];

  for (const route of routes) {
    const url = `${normalizedBase}${route}`;
    const startedAt = new Date().toISOString();
    const errors = [];

    page.removeAllListeners('pageerror');
    page.removeAllListeners('console');
    page.on('pageerror', (error) => errors.push(error.message));
    page.on('console', (message) => {
      if (message.type() === 'error') errors.push(message.text());
    });

    try {
      const response = await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
      const bodyText = await page.locator('body').innerText({ timeout: 10000 });
      const rootVisible = await page.locator('#root').isVisible({ timeout: 10000 }).catch(() => false);
      const hasMeaningfulText = bodyText.trim().length > 20;
      const notNotFound = !/404|not found/i.test(bodyText);
      const protectedRoute = ['/dashboard', '/projects', '/projects/new', '/onboarding'].includes(route);
      const landedOnLogin = page.url().includes('/login');

      results.push({
        route,
        url,
        finalUrl: page.url(),
        startedAt,
        status: response?.status() ?? null,
        hydratedAppChecked: true,
        rootVisible,
        hasMeaningfulText,
        protectedRouteRedirectedToLogin: protectedRoute ? landedOnLogin : null,
        errors,
        pass: Boolean(response && response.status() < 500 && rootVisible && hasMeaningfulText && notNotFound && errors.length === 0),
      });
    } catch (error) {
      results.push({
        route,
        url,
        startedAt,
        hydratedAppChecked: true,
        error: error instanceof Error ? error.message : String(error),
        pass: false,
      });
    }
  }

  await browser.close();

  return {
    mode: 'hydrated-browser',
    baseUrl: normalizedBase,
    generatedAt: new Date().toISOString(),
    lfValidated: true,
    results,
  };
}

const report = staticOnly ? await runStaticProbe() : await runHydratedProbe();
const passed = report.lfValidated && report.results.every((result) => result.pass);

console.log(JSON.stringify(report, null, 2));

if (!passed) {
  process.exit(1);
}
