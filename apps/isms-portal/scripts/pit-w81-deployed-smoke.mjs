#!/usr/bin/env node

const baseUrl = process.env.PIT_W81_BASE_URL;

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
  console.error('PIT_W81_BASE_URL is required. Example: PIT_W81_BASE_URL=https://preview.example.com node scripts/pit-w81-deployed-smoke.mjs');
  process.exit(2);
}

const normalizedBase = baseUrl.replace(/\/$/, '');
const results = [];

for (const route of routes) {
  const url = `${normalizedBase}${route}`;
  const startedAt = new Date().toISOString();
  try {
    const response = await fetch(url, { redirect: 'manual' });
    const body = await response.text();
    const looksLikeAppShell = body.includes('<div id="root"') || body.includes('id="root"');
    const hasWhiteScreenRisk = response.ok && body.trim().length < 250;

    results.push({
      route,
      url,
      startedAt,
      status: response.status,
      redirected: response.status >= 300 && response.status < 400,
      location: response.headers.get('location'),
      looksLikeAppShell,
      hasWhiteScreenRisk,
      bytes: body.length,
      pass: response.status < 500 && looksLikeAppShell && !hasWhiteScreenRisk,
    });
  } catch (error) {
    results.push({
      route,
      url,
      startedAt,
      error: error instanceof Error ? error.message : String(error),
      pass: false,
    });
  }
}

const passed = results.every((result) => result.pass);
console.log(JSON.stringify({ baseUrl: normalizedBase, generatedAt: new Date().toISOString(), results }, null, 2));

if (!passed) {
  process.exit(1);
}
