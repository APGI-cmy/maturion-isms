#!/usr/bin/env node

import process from 'node:process';

const ALLOWED_SUFFIXES = ['.vercel.app', '.now.sh'];
const REQUIRED_PROJECT_TOKEN = 'maturion-isms-mmm';
const REQUEST_TIMEOUT_MS = 30_000;

export function isAllowedMmmPreviewHost(hostname) {
  const normalized = String(hostname || '').trim().toLowerCase();
  return normalized.includes(REQUIRED_PROJECT_TOKEN) && ALLOWED_SUFFIXES.some((suffix) => normalized.endsWith(suffix));
}

export function validateConfiguredPreviewUrl(rawUrl) {
  let parsed;
  try {
    parsed = new URL(rawUrl);
  } catch {
    throw new Error(`MMM_PREVIEW_URL is not a valid absolute URL: ${rawUrl || '(empty)'}`);
  }
  if (parsed.protocol !== 'https:') {
    throw new Error(`MMM_PREVIEW_URL must use https: ${parsed.toString()}`);
  }
  if (!isAllowedMmmPreviewHost(parsed.hostname)) {
    throw new Error(`MMM_PREVIEW_URL must target the MMM Vercel preview host, not ${parsed.hostname}`);
  }
  return parsed;
}

export function assertEffectivePreviewUrl(expectedUrl, effectiveUrl) {
  const expected = validateConfiguredPreviewUrl(expectedUrl);
  const effective = new URL(effectiveUrl);
  if (effective.hostname !== expected.hostname) {
    throw new Error(`MMM preview redirected away from the application host: expected ${expected.hostname}, reached ${effective.hostname}${effective.pathname}`);
  }
  if (!isAllowedMmmPreviewHost(effective.hostname)) {
    throw new Error(`Effective preview host is not an allowed MMM preview host: ${effective.hostname}`);
  }
  return effective;
}

export async function verifyEffectivePreviewOrigin(rawUrl, bypassSecret = '') {
  const expected = validateConfiguredPreviewUrl(rawUrl);
  const requestUrl = new URL(expected);
  const trimmedBypassSecret = String(bypassSecret || '').trim();
  if (trimmedBypassSecret) {
    requestUrl.searchParams.set('x-vercel-protection-bypass', trimmedBypassSecret);
    requestUrl.searchParams.set('x-vercel-set-bypass-cookie', 'samesitenone');
  }
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    const response = await fetch(requestUrl, {
      method: 'GET',
      redirect: 'follow',
      signal: controller.signal,
      headers: trimmedBypassSecret ? { 'x-vercel-protection-bypass': trimmedBypassSecret } : undefined,
    });
    const effective = assertEffectivePreviewUrl(expected.toString(), response.url);
    console.log(`[preview-preflight] verified MMM preview origin ${effective.origin} (HTTP ${response.status})`);
  } finally {
    clearTimeout(timeout);
  }
}

async function main() {
  const rawUrl = String(process.env.MMM_PREVIEW_URL || '').trim();
  if (!rawUrl) throw new Error('MMM_PREVIEW_URL is empty');
  await verifyEffectivePreviewOrigin(rawUrl, process.env.VERCEL_AUTOMATION_BYPASS_SECRET || '');
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((error) => {
    console.error(`[preview-preflight] ${error instanceof Error ? error.message : String(error)}`);
    process.exit(1);
  });
}
