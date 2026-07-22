#!/usr/bin/env node

import process from 'node:process';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const ALLOWED_SUFFIXES = ['.vercel.app', '.now.sh'];
const REQUIRED_PROJECT_TOKEN = 'maturion-isms-mmm';
const REQUEST_TIMEOUT_MS = 30_000;

export function isAllowedMmmPreviewHost(hostname) {
  const normalized = String(hostname || '').trim().toLowerCase();
  const suffix = ALLOWED_SUFFIXES.find((candidate) => normalized.endsWith(candidate));
  if (!suffix) return false;

  const projectHost = normalized.slice(0, -suffix.length);
  return (
    projectHost === REQUIRED_PROJECT_TOKEN ||
    projectHost.startsWith(`${REQUIRED_PROJECT_TOKEN}-git-`)
  );
}

export function validateConfiguredPreviewUrl(rawUrl) {
  const normalizedRawUrl = String(rawUrl || '').trim();
  let parsed;
  try {
    parsed = new URL(normalizedRawUrl);
  } catch {
    throw new Error(
      `MMM_PREVIEW_URL is not a valid absolute URL: ${normalizedRawUrl || '(empty)'}`,
    );
  }
  if (parsed.protocol !== 'https:') {
    throw new Error(`MMM_PREVIEW_URL must use https: ${parsed.toString()}`);
  }
  if (!isAllowedMmmPreviewHost(parsed.hostname)) {
    throw new Error(
      `MMM_PREVIEW_URL must target the MMM Vercel preview host, not ${parsed.hostname}`,
    );
  }
  return parsed;
}

export function assertEffectivePreviewUrl(expectedUrl, effectiveUrl) {
  const expected = validateConfiguredPreviewUrl(expectedUrl);
  const effective = new URL(String(effectiveUrl || '').trim());
  if (effective.hostname !== expected.hostname) {
    throw new Error(
      `MMM preview redirected away from the application host: expected ${expected.hostname}, reached ${effective.hostname}${effective.pathname}`,
    );
  }
  if (!isAllowedMmmPreviewHost(effective.hostname)) {
    throw new Error(
      `Effective preview host is not an allowed MMM preview host: ${effective.hostname}`,
    );
  }
  return effective;
}

export function buildVercelBypassHeaders(bypassSecret = '') {
  const secret = String(bypassSecret || '').trim();
  if (!secret) return undefined;
  return {
    'x-vercel-protection-bypass': secret,
    'x-vercel-set-bypass-cookie': 'true',
  };
}

export async function verifyEffectivePreviewOrigin(rawUrl, bypassSecret = '') {
  const expected = validateConfiguredPreviewUrl(rawUrl);
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    const response = await fetch(expected, {
      method: 'GET',
      redirect: 'follow',
      signal: controller.signal,
      headers: buildVercelBypassHeaders(bypassSecret),
    });
    console.log(
      `[preview-preflight] response status=${response.status} effectiveUrl=${response.url}`,
    );
    const effective = assertEffectivePreviewUrl(expected.toString(), response.url);
    console.log(
      `[preview-preflight] verified MMM preview origin ${effective.origin} (HTTP ${response.status})`,
    );
  } finally {
    clearTimeout(timeout);
  }
}

async function main() {
  const rawUrl = String(process.env.MMM_PREVIEW_URL || '').trim();
  if (!rawUrl) throw new Error('MMM_PREVIEW_URL is empty');
  await verifyEffectivePreviewOrigin(
    rawUrl,
    process.env.VERCEL_AUTOMATION_BYPASS_SECRET || '',
  );
}

const invokedModuleUrl = process.argv[1]
  ? pathToFileURL(path.resolve(process.argv[1])).href
  : '';

if (import.meta.url === invokedModuleUrl) {
  main().catch((error) => {
    console.error(
      `[preview-preflight] ${error instanceof Error ? error.message : String(error)}`,
    );
    process.exit(1);
  });
}
