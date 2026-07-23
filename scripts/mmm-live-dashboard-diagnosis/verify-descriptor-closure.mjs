#!/usr/bin/env node

import { chromium } from 'playwright';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const ARTIFACT_DIR = path.resolve(process.env.ARTIFACT_DIR || 'descriptor-closure-artifacts');
const NAV_TIMEOUT = 60_000;
const WAIT_TIMEOUT = 30_000;
const GENERATION_TIMEOUT = 180_000;
const PREFERRED_CODE = 'D001.MPS002.C006';

function required(name) {
  const value = String(process.env[name] || '').trim();
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
}

function withBypass(rawUrl, secret) {
  const url = new URL(rawUrl);
  if (secret) {
    url.searchParams.set('x-vercel-protection-bypass', secret);
    url.searchParams.set('x-vercel-set-bypass-cookie', 'samesitenone');
  }
  return url.toString();
}

function safeJson(value) {
  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return String(value);
  }
}

async function login(page, origin, email, password, bypassSecret) {
  await page.goto(withBypass(`${origin}/dashboard`, bypassSecret), {
    waitUntil: 'domcontentloaded',
    timeout: NAV_TIMEOUT,
  });
  await page.waitForLoadState('networkidle', { timeout: WAIT_TIMEOUT }).catch(() => {});
  const emailInput = page.locator('#login-email');
  const onLogin = await emailInput.waitFor({ state: 'visible', timeout: 15_000 })
    .then(() => true)
    .catch(() => false);
  if (onLogin) {
    await emailInput.fill(email);
    await page.locator('#login-password').fill(password);
    await Promise.all([
      page.waitForURL(/\/(dashboard|frameworks|assessment)/, { timeout: WAIT_TIMEOUT }).catch(() => null),
      page.locator('button[type="submit"]').click(),
    ]);
  }
  if (!/\/(dashboard|frameworks|assessment)/.test(page.url())) {
    const alert = await page.locator('[role="alert"]').first().innerText().catch(() => '');
    throw new Error(`Login did not reach an authenticated route: ${page.url()} ${alert}`);
  }
}

function captureSupabasePublicConfig(page) {
  let resolveConfig;
  let resolved = false;
  const promise = new Promise((resolve) => { resolveConfig = resolve; });
  page.on('request', async (request) => {
    if (resolved || !request.url().includes('.supabase.co/')) return;
    try {
      const headers = await request.allHeaders();
      if (!headers.apikey) return;
      resolved = true;
      resolveConfig({ origin: new URL(request.url()).origin, apikey: headers.apikey });
    } catch {
      // Wait for another request.
    }
  });
  return async () => Promise.race([
    promise,
    new Promise((_, reject) => setTimeout(
      () => reject(new Error('Timed out waiting for Supabase public configuration.')),
      WAIT_TIMEOUT,
    )),
  ]);
}

async function readBrowserAccessToken(page) {
  const token = await page.evaluate(() => {
    for (let index = 0; index < localStorage.length; index += 1) {
      const key = localStorage.key(index);
      if (!key || !key.startsWith('sb-') || !key.endsWith('-auth-token')) continue;
      try {
        const stored = JSON.parse(localStorage.getItem(key) || 'null');
        const candidate = stored?.access_token || stored?.currentSession?.access_token || stored?.session?.access_token;
        if (typeof candidate === 'string' && candidate.split('.').length === 3) return candidate;
      } catch {
        // Ignore unrelated local-storage values.
      }
    }
    return '';
  });
  if (!token) throw new Error('Authenticated Supabase access token was not found in browser storage.');
  return token;
}

async function queryTable(page, config, accessToken, table, select) {
  return page.evaluate(async ({ config, accessToken, table, select }) => {
    const url = new URL(`${config.origin}/rest/v1/${table}`);
    url.searchParams.set('select', select);
    const response = await fetch(url.toString(), {
      headers: {
        apikey: config.apikey,
        Authorization: `Bearer ${accessToken}`,
        Accept: 'application/json',
      },
    });
    const text = await response.text();
    if (!response.ok) throw new Error(`${table} query failed (${response.status}): ${text.slice(0, 500)}`);
    return text ? JSON.parse(text) : [];
  }, { config, accessToken, table, select });
}

async function findTarget(page, config, accessToken) {
  const [criteria, descriptors, mpsRows, domains] = await Promise.all([
    queryTable(page, config, accessToken, 'mmm_criteria', 'id,code,name,mps_id'),
    queryTable(page, config, accessToken, 'mmm_level_descriptors', 'criterion_id,level,descriptor_text'),
    queryTable(page, config, accessToken, 'mmm_maturity_process_steps', 'id,code,name,domain_id'),
    queryTable(page, config, accessToken, 'mmm_domains', 'id,name,framework_id'),
  ]);
  const descriptorMap = new Map();
  for (const row of descriptors) {
    const rows = descriptorMap.get(row.criterion_id) || [];
    rows.push(row);
    descriptorMap.set(row.criterion_id, rows);
  }
  const mpsMap = new Map(mpsRows.map((row) => [row.id, row]));
  const domainMap = new Map(domains.map((row) => [row.id, row]));
  const candidates = criteria.map((criterion) => {
    const criterionDescriptors = descriptorMap.get(criterion.id) || [];
    const populatedCount = criterionDescriptors.filter(
      (row) => String(row.descriptor_text || '').trim(),
    ).length;
    const mps = mpsMap.get(criterion.mps_id);
    const domain = mps ? domainMap.get(mps.domain_id) : null;
    return { criterion, populatedCount, mps, domain };
  }).filter((item) =>
    item.populatedCount > 0 && item.populatedCount < 5 && item.mps && item.domain?.framework_id,
  ).sort((left, right) => {
    const preference = Number(right.criterion.code === PREFERRED_CODE) - Number(left.criterion.code === PREFERRED_CODE);
    return preference || left.populatedCount - right.populatedCount;
  });
  if (!candidates.length) {
    throw new Error('No organisation-scoped criterion with between one and four populated maturity descriptors was found.');
  }
  return candidates[0];
}

async function openCriteria(page, origin, target, bypassSecret) {
  const route = new URL(`${origin}/assessment/framework/domain/${encodeURIComponent(target.domain.id)}`);
  route.searchParams.set('framework_id', target.domain.framework_id);
  route.searchParams.set('source_domain_id', target.domain.id);
  route.searchParams.set('domain_name', target.domain.name || target.domain.id);
  await page.goto(withBypass(route.toString(), bypassSecret), {
    waitUntil: 'domcontentloaded',
    timeout: NAV_TIMEOUT,
  });
  await page.waitForLoadState('networkidle', { timeout: WAIT_TIMEOUT }).catch(() => {});
  const error = page.getByTestId('domain-audit-error');
  if (await error.isVisible().catch(() => false)) throw new Error(await error.innerText());
  await page.getByTestId('step-action-criteria').click();
  await page.getByTestId('criteria-management').waitFor({ state: 'visible', timeout: WAIT_TIMEOUT });
  await page.getByTestId(`criteria-code-input-${target.criterion.id}`).waitFor({ state: 'visible', timeout: WAIT_TIMEOUT });
}

async function values(page, criterionId) {
  const result = {};
  for (let level = 1; level <= 5; level += 1) {
    result[level] = await page.getByTestId(`descriptor-input-${criterionId}-${level}`).inputValue();
  }
  return result;
}

function populatedLevels(descriptors) {
  return Object.entries(descriptors)
    .filter(([, text]) => String(text).trim())
    .map(([level]) => Number(level));
}

function assertExistingPreserved(before, after, editedLevel) {
  for (const level of populatedLevels(before)) {
    const expected = String(before[level]);
    const actual = String(after[level]);
    if (level === editedLevel ? actual.trim() !== expected.trim() : actual !== expected) {
      throw new Error(`Previously populated level ${level} changed unexpectedly.`);
    }
  }
}

async function main() {
  const previewUrl = required('MMM_PREVIEW_URL');
  const email = required('MMM_TEST_ADMIN_EMAIL');
  const password = required('MMM_TEST_ADMIN_PASSWORD');
  const bypassSecret = String(process.env.VERCEL_AUTOMATION_BYPASS_SECRET || '').trim();
  const origin = new URL(previewUrl).origin;
  await mkdir(ARTIFACT_DIR, { recursive: true });

  const result = {
    functionalPass: false,
    selectedCriterion: null,
    steps: [],
    before: null,
    afterConsent: null,
    afterRecovery: null,
    afterReload: null,
    error: null,
  };
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 1000 },
    ignoreHTTPSErrors: true,
    extraHTTPHeaders: bypassSecret ? {
      'x-vercel-protection-bypass': bypassSecret,
      'x-vercel-set-bypass-cookie': 'true',
    } : undefined,
  });
  await context.tracing.start({ screenshots: true, snapshots: true, sources: true });
  const page = await context.newPage();
  const waitForPublicConfig = captureSupabasePublicConfig(page);

  async function step(name, operation) {
    try {
      const detail = await operation();
      result.steps.push({ name, ok: true, detail: typeof detail === 'string' ? detail : '' });
      console.log(`[descriptor-closure] PASS ${name}${typeof detail === 'string' && detail ? ` — ${detail}` : ''}`);
      return detail;
    } catch (error) {
      const detail = error instanceof Error ? error.message : String(error);
      result.steps.push({ name, ok: false, detail });
      throw error;
    }
  }

  try {
    await step('login', () => login(page, origin, email, password, bypassSecret));
    await page.goto(withBypass(`${origin}/dashboard`, bypassSecret), {
      waitUntil: 'domcontentloaded', timeout: NAV_TIMEOUT,
    });
    await page.waitForLoadState('networkidle', { timeout: WAIT_TIMEOUT }).catch(() => {});
    const publicConfig = await step('capture-supabase-public-config', waitForPublicConfig);
    const accessToken = await step('read-authenticated-browser-session', () => readBrowserAccessToken(page));
    const target = await step('locate-incomplete-criterion', async () => {
      const found = await findTarget(page, publicConfig, accessToken);
      result.selectedCriterion = {
        id: found.criterion.id,
        code: found.criterion.code,
        populatedCount: found.populatedCount,
        mpsId: found.mps.id,
        domainId: found.domain.id,
        frameworkId: found.domain.framework_id,
      };
      return found;
    });
    await step('open-real-criteria-management-route', () => openCriteria(page, origin, target, bypassSecret));

    const criterionId = target.criterion.id;
    const before = await values(page, criterionId);
    result.before = before;
    const initiallyPopulated = populatedLevels(before);
    if (!initiallyPopulated.length || initiallyPopulated.length >= 5) {
      throw new Error(`Selected criterion is not incomplete: ${initiallyPopulated.length}/5.`);
    }
    const editedLevel = initiallyPopulated[0];

    await step('whitespace-only-edit-and-decline-learning', async () => {
      await page.getByTestId(`edit-descriptor-btn-${criterionId}-${editedLevel}`).click();
      await page.getByTestId(`descriptor-input-${criterionId}-${editedLevel}`).fill(`${before[editedLevel]} `);
      await page.getByTestId('descriptor-learning-prompt').waitFor({ state: 'visible', timeout: WAIT_TIMEOUT });
      await page.getByTestId('descriptor-learning-no').click();
      await page.getByTestId('descriptor-learning-prompt').waitFor({ state: 'hidden', timeout: WAIT_TIMEOUT });
      const after = await values(page, criterionId);
      result.afterConsent = after;
      assertExistingPreserved(before, after, editedLevel);
      return `level=${editedLevel}; learning declined; ${initiallyPopulated.length}/5 existing levels preserved`;
    });

    await step('recover-only-missing-levels', async () => {
      await page.getByTestId(`generate-descriptors-btn-${criterionId}`).click();
      await page.waitForFunction(({ criterionId }) => {
        const allFilled = [1, 2, 3, 4, 5].every((level) => {
          const input = document.querySelector(`[data-testid="descriptor-input-${criterionId}-${level}"]`);
          return input instanceof HTMLTextAreaElement && Boolean(input.value.trim());
        });
        const button = document.querySelector(`[data-testid="generate-descriptors-btn-${criterionId}"]`);
        return allFilled && button instanceof HTMLButtonElement && !button.disabled;
      }, { criterionId }, { timeout: GENERATION_TIMEOUT });
      const after = await values(page, criterionId);
      result.afterRecovery = after;
      assertExistingPreserved(before, after, editedLevel);
      if (populatedLevels(after).length !== 5) throw new Error('Recovery did not populate all five levels.');
      return 'missing levels filled and every prior non-empty level preserved';
    });

    await step('complete-dirty-set-blocks-regeneration', async () => {
      const beforeAttempt = await values(page, criterionId);
      await page.getByTestId(`generate-descriptors-btn-${criterionId}`).click();
      await page.getByText(/Save maturity descriptors before regenerating/i).first()
        .waitFor({ state: 'visible', timeout: WAIT_TIMEOUT });
      const afterAttempt = await values(page, criterionId);
      if (safeJson(beforeAttempt) !== safeJson(afterAttempt)) throw new Error('Blocked regeneration changed values.');
      return 'guard displayed and descriptor values remained unchanged';
    });

    await step('save-five-level-descriptor-set', async () => {
      await page.getByTestId(`save-descriptors-btn-${criterionId}`).click();
      const status = page.getByTestId(`descriptor-save-status-${criterionId}`);
      await status.waitFor({ state: 'visible', timeout: WAIT_TIMEOUT });
      await page.waitForFunction(({ criterionId }) => {
        const node = document.querySelector(`[data-testid="descriptor-save-status-${criterionId}"]`);
        return Boolean(node?.textContent?.includes('Saved 5 maturity descriptors'));
      }, { criterionId }, { timeout: WAIT_TIMEOUT });
      const text = (await status.innerText()).replace(/\s+/g, ' ').trim();
      if (/Recorded .* for Maturion learning/i.test(text)) throw new Error(`Learning was unexpectedly captured: ${text}`);
      return text;
    });

    await step('reload-and-prove-five-level-persistence', async () => {
      await page.reload({ waitUntil: 'domcontentloaded', timeout: NAV_TIMEOUT });
      await page.waitForLoadState('networkidle', { timeout: WAIT_TIMEOUT }).catch(() => {});
      await page.getByTestId('step-action-criteria').click();
      await page.getByTestId('criteria-management').waitFor({ state: 'visible', timeout: WAIT_TIMEOUT });
      await page.getByTestId(`criteria-code-input-${criterionId}`).waitFor({ state: 'visible', timeout: WAIT_TIMEOUT });
      const after = await values(page, criterionId);
      result.afterReload = after;
      if (populatedLevels(after).length !== 5) throw new Error('Reload did not retain five populated levels.');
      for (const level of initiallyPopulated) {
        if (String(after[level]).trim() !== String(before[level]).trim()) {
          throw new Error(`Reload changed original level ${level}.`);
        }
      }
      return 'all five descriptors persisted after reload';
    });

    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'descriptor-closure.png'), fullPage: true });
    result.functionalPass = true;
  } catch (error) {
    result.error = error instanceof Error ? error.message : String(error);
    console.error('[descriptor-closure] FAIL', result.error);
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'descriptor-closure.png'), fullPage: true }).catch(() => {});
  } finally {
    await context.tracing.stop({ path: path.join(ARTIFACT_DIR, 'descriptor-closure-trace.zip') }).catch(() => {});
    await browser.close().catch(() => {});
  }

  const summary = `# MMM Descriptor Runtime Live Closure\n\nFUNCTIONAL_PASS: ${result.functionalPass ? 'yes' : 'no'}\nSELECTED_CRITERION: ${result.selectedCriterion?.code || '(none)'}\nSELECTED_CRITERION_ID: ${result.selectedCriterion?.id || '(none)'}\nINITIAL_DESCRIPTOR_COVERAGE: ${result.selectedCriterion?.populatedCount ?? '(n/a)'}/5\nLEARNING_CAPTURE: declined for validation\nDATA_MUTATION: whitespace-only edit; saved text trims to original wording; missing levels may be completed\nERROR: ${result.error || '(none)'}\n\n## Steps\n\n${result.steps.map((item) => `- ${item.ok ? 'PASS' : 'FAIL'} — ${item.name}${item.detail ? `: ${item.detail}` : ''}`).join('\n')}\n\n## Artifacts\n\n- descriptor-closure.json\n- descriptor-closure.png\n- descriptor-closure-trace.zip\n`;
  await writeFile(path.join(ARTIFACT_DIR, 'descriptor-closure-summary.md'), summary);
  await writeFile(path.join(ARTIFACT_DIR, 'descriptor-closure.json'), safeJson(result));
  console.log(summary);
  process.exit(result.functionalPass ? 0 : 1);
}

main().catch((error) => {
  console.error('[descriptor-closure] FATAL', error?.stack || error);
  process.exit(2);
});
