#!/usr/bin/env node
/**
 * Prime Vercel Deployment Protection for Playwright checks.
 *
 * The browser based dashboard checks must not add the bypass header to every
 * browser request, because that header leaks into third-party requests and
 * creates CORS noise. This helper uses Node fetch to ask Vercel to set the
 * protection bypass cookie, then writes cookies to a Playwright storageState
 * file that can be loaded by the browser checks.
 */

import { writeFile } from 'node:fs/promises';
import process from 'node:process';

const targetUrl = process.env.MMM_PREVIEW_URL;
const bypassSecret = process.env.VERCEL_AUTOMATION_BYPASS_SECRET;
const output = process.env.VERCEL_BYPASS_STORAGE_STATE || 'vercel-bypass-storage-state.json';

if (!targetUrl) {
  console.error('MMM_PREVIEW_URL is required');
  process.exit(2);
}

const url = new URL(targetUrl);
const origin = url.origin;

const state = { cookies: [], origins: [] };

if (!bypassSecret) {
  console.warn('VERCEL_AUTOMATION_BYPASS_SECRET is not set; writing empty storage state.');
  await writeFile(output, JSON.stringify(state, null, 2));
  process.exit(0);
}

// Use the query-param approach documented by Vercel for Automation Bypass:
// https://vercel.com/docs/security/deployment-protection/methods-to-bypass-deployment-protection/protection-bypass-automation
// Vercel validates the secret, sets the _vercel_jwt bypass cookie, and returns a
// redirect response (3xx). With redirect:'manual' we capture that redirect response
// and extract the Set-Cookie header — which is the actual bypass cookie.
const bypassUrl = new URL(origin);
bypassUrl.searchParams.set('x-vercel-protection-bypass', bypassSecret);
bypassUrl.searchParams.set('x-vercel-set-bypass-cookie', 'samesitenone');
const response = await fetch(bypassUrl.toString(), {
  redirect: 'manual',
});

const setCookieHeader = response.headers.get('set-cookie') || '';
const cookieParts = setCookieHeader
  .split(/,(?=\s*[^;=]+=[^;]+)/)
  .map((part) => part.trim())
  .filter(Boolean);

for (const rawCookie of cookieParts) {
  const [nameValue, ...attrs] = rawCookie.split(';').map((part) => part.trim());
  const eq = nameValue.indexOf('=');
  if (eq <= 0) continue;
  const name = nameValue.slice(0, eq);
  const value = nameValue.slice(eq + 1);
  const cookie = {
    name,
    value,
    domain: url.hostname,
    path: '/',
    httpOnly: attrs.some((attr) => /^httponly$/i.test(attr)),
    secure: true,
    sameSite: 'None',
  };
  state.cookies.push(cookie);
}

if (state.cookies.length === 0) {
  console.warn(`No Vercel bypass cookies were returned from ${origin}; response status ${response.status}.`);
} else {
  console.log(`Primed ${state.cookies.length} Vercel bypass cookie(s) for ${origin}.`);
}

await writeFile(output, JSON.stringify(state, null, 2));
