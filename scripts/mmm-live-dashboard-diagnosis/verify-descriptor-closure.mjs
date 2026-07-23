#!/usr/bin/env node

import { chromium } from 'playwright';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const ARTIFACT_DIR = path.resolve(
  process.env.ARTIFACT_DIR || 'descriptor-closure-artifacts',
);
const NAV_TIMEOUT = 60_000;
const WAIT_TIMEOUT = 30_000;
const GENERATION_TIMEOUT = 180_000;
const PREFERRED_CRITERION_CODE = 'D001.MPS002.C006';

function required(name) {
  const value = String(process.env[name] || '').trim();
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function withBypassParams(rawUrl, bypassSecret) {
  const url = new URL(rawUrl);
  if (bypassSecret) {
    url.searchParams.set('x-vercel-protection-bypass', bypassSecret);
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
  await page.goto(withBypassParams(`${origin}/dashboard`, bypassSecret), {
    waitUntil: 'domcontentloaded',
    timeout: NAV_TIMEOUT,
  });
  await page.waitForLoadState('networkidle', { timeout: WAIT_TIMEOUT }).catch(() => {});

  const loginEmail = page.locator('#login-email');
  const onLogin = await loginEmail
    .waitFor({ state: 'visible', timeout: 15_000 })
    .then(() => true)
    .catch(() => false);

  if (onLogin) {
    await loginEmail.fill(email);
    await page.locator('#login-password').fill(password);
    await Promise.all([
      page.waitForURL(/\/(dashboard|frameworks|assessment)/, { timeout: WAIT_TIMEOUT }).catch(() => null),
      page.locator('button[type="submit"]').click(),
    ]);
  }

  const currentUrl = page.url();
  if (!/\/(dashboard|frameworks|assessment)/.test(currentUrl)) {
    const alert = await page.locator('[role="alert"]').first().innerText().catch(() => '');
    throw new Error(`Login did not reach an authenticated route: ${currentUrl} ${alert}`);
  }
}

function createSupabaseCapture(page) {
  let resolved = false;
  let resolveCapture;
  const capturePromise = new Promise((resolve) => {
    resolveCapture = resolve;
  });

  page.on('request', async (request) => {
    if (resolved || !request.url().includes('.supabase.co/')) return;
    try {
      const headers = await request.allHeaders();
      const apikey = headers.apikey;
      const authorization = headers.authorization;
      if (!apikey || !authorization?.toLowerCase().startsWith('bearer ')) return;
      const requestUrl = new URL(request.url());
      resolved = true;
      resolveCapture({
        origin: requestUrl.origin,
        apikey,
        authorization,
      });
    } catch {
      // Continue listening for another request.
    }
  });

  return async () => {
    const timeout = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Timed out waiting for an authenticated Supabase request.')), WAIT_TIMEOUT);
    });
    return Promise.race([capturePromise, timeout]);
  };
}

async function querySupabase(page, capture, table, select) {
  return page.evaluate(
    async ({ origin, apikey, authorization, table, select }) => {
      const url = new URL(`${origin}/rest/v1/${table}`);
      url.searchParams.set('select', select);
      const response = await fetch(url.toString(), {
        headers: {
          apikey,
          Authorization: authorization,
          Accept: 'application/json',
        },
      });
      const text = await response.text();
      if (!response.ok) {
        throw new Error(`${table} query failed (${response.status}): ${text.slice(0, 500)}`);
      }
      return text ? JSON.parse(text) : [];
    },
    { ...capture, table, select },
  );
}

async function findIncompleteCriterion(page, capture) {
  const [criteria, descriptors, mpsRows, domains] = await Promise.all([
    querySupabase(page, capture, 'mmm_criteria', 'id,code,name,mps_id'),
    querySupabase(page, capture, 'mmm_level_descriptors', 'criterion_id,level,descriptor_text'),
    querySupabase(page, capture, 'mmm_maturity_process_steps', 'id,code,name,domain_id'),
    querySupabase(page, capture, 'mmm_domains', 'id,name,framework_id'),
  ]);

  const descriptorsByCriterion = new Map();
  for (const row of descriptors) {
    const current = descriptorsByCriterion.get(row.criterion_id) || [];
    current.push(row);
    descriptorsByCriterion.set(row.criterion_id, current);
  }
  const mpsById = new Map(mpsRows.map((row) => [row.id, row]));
  const domainById = new Map(domains.map((row) => [row.id, row]));

  const candidates = criteria
    .map((criterion) => {
      const criterionDescriptors = descriptorsByCriterion.get(criterion.id) || [];
      const populated = criterionDescriptors.filter(
        (row) => String(row.descriptor_text || '').trim().length > 0,
      );
      const mps = mpsById.get(criterion.mps_id);
      const domain = mps ? domainById.get(mps.domain_id) : null;
      return {
        criterion,
        descriptors: criterionDescriptors,
        populatedCount: populated.length,
        mps,
        domain,
      };
    })
    .filter(
      (item) =>
        item.populatedCount > 0 &&
        item.populatedCount < 5 &&
        item.mps &&
        item.domain &&
        item.domain.framework_id,
    )
    .sort((left, right) => {
      const leftPreferred = left.criterion.code === PREFERRED_CRITERION_CODE ? 1 : 0;
      const rightPreferred = right.criterion.code === PREFERRED_CRITERION_CODE ? 1 : 0;
      if (rightPreferred !== leftPreferred) return rightPreferred - leftPreferred;
      return left.populatedCount - right.populatedCount;
    });

  if (!candidates.length) {
    throw new Error(
      'No organisation-scoped criterion with between one and four populated maturity descriptors was found.',
    );
  }
  return candidates[0];
}

async function openCriteriaManagement(page, origin, target, bypassSecret) {
  const domainId = target.domain.id;
  const route = new URL(`${origin}/assessment/framework/domain/${encodeURIComponent(domainId)}`);
  route.searchParams.set('framework_id', target.domain.framework_id);
  route.searchParams.set('source_domain_id', domainId);
  route.searchParams.set('domain_name', target.domain.name || domainId);
  const url = withBypassParams(route.toString(), bypassSecret);

  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: NAV_TIMEOUT });
  await page.waitForLoadState('networkidle', { timeout: WAIT_TIMEOUT }).catch(() => {});

  const error = page.getByTestId('domain-audit-error');
  if (await error.isVisible().catch(() => false)) {
    throw new Error(`Domain workspace failed: ${await error.innerText()}`);
  }

  const action = page.getByTestId('step-action-criteria');
  await action.waitFor({ state: 'visible', timeout: WAIT_TIMEOUT });
  await action.click();
  await page.getByTestId('criteria-management').waitFor({ state: 'visible', timeout: WAIT_TIMEOUT });

  const codeInput = page.getByTestId(`criteria-code-input-${target.criterion.id}`);
  await codeInput.waitFor({ state: 'visible', timeout: WAIT_TIMEOUT });
}

async function readDescriptorValues(page, criterionId) {
  const values = {};
  for (let level = 1; level <= 5; level += 1) {
    values[level] = await page
      .getByTestId(`descriptor-input-${criterionId}-${level}`)
      .inputValue();
  }
  return values;
}

function nonEmptyLevels(values) {
  return Object.entries(values)
    .filter(([, value]) => String(value).trim().length > 0)
    .map(([level]) => Number(level));
}

function assertPreserved(before, after, editedLevel, allowEditedWhitespace = false) {
  for (const level of nonEmptyLevels(before)) {
    if (level === editedLevel && allowEditedWhitespace) {
      if (String(after[level]).trim() !== String(before[level]).trim()) {
        throw new Error(`Edited level ${level} changed substantively during recovery.`);
      }
      continue;
    }
    if (after[level] !== before[level]) {
      throw new Error(`Persisted level ${level} changed unexpectedly.`);
    }
  }
}

async function main() {
  const previewUrl = required('MMM_PREVIEW_URL');
  const email = required('MMM_TEST_ADMIN_EMAIL');
  const password = required('MMM_TEST_ADMIN_PASSWORD');
  const bypassSecret = String(process.env.VERCEL_AUTOMATION_BYPASS_SECRET || '').trim();
  const preview = new URL(previewUrl);
  const origin = preview.origin;

  await mkdir(ARTIFACT_DIR, { recursive: true });
  const summaryPath = path.join(ARTIFACT_DIR, 'descriptor-closure-summary.md');
  const jsonPath = path.join(ARTIFACT_DIR, 'descriptor-closure.json');
  const screenshotPath = path.join(ARTIFACT_DIR, 'descriptor-closure.png');
  const tracePath = path.join(ARTIFACT_DIR, 'descriptor-closure-trace.zip');

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
    extraHTTPHeaders: bypassSecret
      ? {
          'x-vercel-protection-bypass': bypassSecret,
          'x-vercel-set-bypass-cookie': 'true',
        }
      : undefined,
  });
  await context.tracing.start({ screenshots: true, snapshots: true, sources: true });
  const page = await context.newPage();
  const waitForSupabaseCapture = createSupabaseCapture(page);

  async function step(name, fn) {
    try {
      const detail = await fn();
      result.steps.push({ name, ok: true, detail: detail || '' });
      console.log(`[descriptor-closure] PASS ${name}${detail ? ` — ${detail}` : ''}`);
      return detail;
    } catch (error) {
      const detail = error instanceof Error ? error.message : String(error);
      result.steps.push({ name, ok: false, detail });
      throw error;
    }
  }

  try {
    await step('login', () => login(page, origin, email, password, bypassSecret));
    await page.goto(withBypassParams(`${origin}/dashboard`, bypassSecret), {
      waitUntil: 'domcontentloaded',
      timeout: NAV_TIMEOUT,
    });
    await page.waitForLoadState('networkidle', { timeout: WAIT_TIMEOUT }).catch(() => {});

    const capture = await step('capture-authenticated-supabase-context', waitForSupabaseCapture);
    const target = await step('locate-incomplete-criterion', async () => {
      const found = await findIncompleteCriterion(page, capture);
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

    await step('open-real-criteria-management-route', () =>
      openCriteriaManagement(page, origin, target, bypassSecret),
    );

    const criterionId = target.criterion.id;
    const before = await readDescriptorValues(page, criterionId);
    result.before = before;
    const populatedBefore = nonEmptyLevels(before);
    if (!populatedBefore.length || populatedBefore.length >= 5) {
      throw new Error(`Selected criterion is not incomplete: ${populatedBefore.length}/5 populated.`);
    }
    const editedLevel = populatedBefore[0];
    const editedInput = page.getByTestId(`descriptor-input-${criterionId}-${editedLevel}`);

    await step('whitespace-only-edit-and-decline-learning', async () => {
      await page.getByTestId(`edit-descriptor-btn-${criterionId}-${editedLevel}`).click();
      await editedInput.fill(`${before[editedLevel]} `);
      await page.getByTestId('descriptor-learning-prompt').waitFor({ state: 'visible', timeout: WAIT_TIMEOUT });
      await page.getByTestId('descriptor-learning-no').click();
      await page.getByTestId('descriptor-learning-prompt').waitFor({ state: 'hidden', timeout: WAIT_TIMEOUT });
      const afterConsent = await readDescriptorValues(page, criterionId);
      result.afterConsent = afterConsent;
      assertPreserved(before, afterConsent, editedLevel, true);
      return `level=${editedLevel}; learning capture declined; ${populatedBefore.length}/5 persisted levels preserved`;
    });

    await step('recover-only-missing-levels', async () => {
      const generateButton = page.getByTestId(`generate-descriptors-btn-${criterionId}`);
      await generateButton.click();
      await page.waitForFunction(
        ({ criterionId }) => {
          for (let level = 1; level <= 5; level += 1) {
            const input = document.querySelector(
              `[data-testid="descriptor-input-${criterionId}-${level}"]`,
            );
            if (!(input instanceof HTMLTextAreaElement) || !input.value.trim()) return false;
          }
          const button = document.querySelector(
            `[data-testid="generate-descriptors-btn-${criterionId}"]`,
          );
          return button instanceof HTMLButtonElement && !button.disabled;
        },
        { criterionId },
        { timeout: GENERATION_TIMEOUT },
      );
      const afterRecovery = await readDescriptorValues(page, criterionId);
      result.afterRecovery = afterRecovery;
      assertPreserved(before, afterRecovery, editedLevel, true);
      if (nonEmptyLevels(afterRecovery).length !== 5) {
        throw new Error('Recovery did not populate all five maturity levels.');
      }
      return 'missing levels filled; all pre-existing non-empty levels preserved';
    });

    await step('complete-dirty-set-blocks-regeneration', async () => {
      const valuesBeforeBlockedAttempt = await readDescriptorValues(page, criterionId);
      await page.getByTestId(`generate-descriptors-btn-${criterionId}`).click();
      const alert = page.getByText(/Save maturity descriptors before regenerating/i).first();
      await alert.waitFor({ state: 'visible', timeout: WAIT_TIMEOUT });
      const valuesAfterBlockedAttempt = await readDescriptorValues(page, criterionId);
      if (safeJson(valuesAfterBlockedAttempt) !== safeJson(valuesBeforeBlockedAttempt)) {
        throw new Error('Blocked regeneration changed descriptor values.');
      }
      return 'save-before-regenerate guard displayed and values remained unchanged';
    });

    await step('save-five-level-descriptor-set', async () => {
      await page.getByTestId(`save-descriptors-btn-${criterionId}`).click();
      const status = page.getByTestId(`descriptor-save-status-${criterionId}`);
      await status.waitFor({ state: 'visible', timeout: WAIT_TIMEOUT });
      await page.waitForFunction(
        ({ criterionId }) => {
          const node = document.querySelector(
            `[data-testid="descriptor-save-status-${criterionId}"]`,
          );
          return Boolean(node?.textContent?.includes('Saved 5 maturity descriptors'));
        },
        { criterionId },
        { timeout: WAIT_TIMEOUT },
      );
      const text = await status.innerText();
      if (/learning/i.test(text) && !/without Maturion learning capture|No descriptor text edits were detected/i.test(text)) {
        throw new Error(`Unexpected learning capture message: ${text}`);
      }
      return text.replace(/\s+/g, ' ').trim();
    });

    await step('reload-and-prove-five-level-persistence', async () => {
      await page.reload({ waitUntil: 'domcontentloaded', timeout: NAV_TIMEOUT });
      await page.waitForLoadState('networkidle', { timeout: WAIT_TIMEOUT }).catch(() => {});
      await page.getByTestId('step-action-criteria').click();
      await page.getByTestId('criteria-management').waitFor({ state: 'visible', timeout: WAIT_TIMEOUT });
      await page.getByTestId(`criteria-code-input-${criterionId}`).waitFor({ state: 'visible', timeout: WAIT_TIMEOUT });
      const afterReload = await readDescriptorValues(page, criterionId);
      result.afterReload = afterReload;
      if (nonEmptyLevels(afterReload).length !== 5) {
        throw new Error('Reloaded criterion does not contain five populated descriptors.');
      }
      for (const level of populatedBefore) {
        if (String(afterReload[level]).trim() !== String(before[level]).trim()) {
          throw new Error(`Reload changed pre-existing descriptor at level ${level}.`);
        }
      }
      return 'all five descriptors persisted after reload';
    });

    await page.screenshot({ path: screenshotPath, fullPage: true });
    result.functionalPass = true;
  } catch (error) {
    result.error = error instanceof Error ? error.message : String(error);
    console.error('[descriptor-closure] FAIL', result.error);
    await page.screenshot({ path: screenshotPath, fullPage: true }).catch(() => {});
  } finally {
    await context.tracing.stop({ path: tracePath }).catch(() => {});
    await browser.close().catch(() => {});
  }

  const summary = `# MMM Descriptor Runtime Live Closure\n\nFUNCTIONAL_PASS: ${result.functionalPass ? 'yes' : 'no'}\nSELECTED_CRITERION: ${result.selectedCriterion?.code || '(none)'}\nSELECTED_CRITERION_ID: ${result.selectedCriterion?.id || '(none)'}\nINITIAL_DESCRIPTOR_COVERAGE: ${result.selectedCriterion?.populatedCount ?? '(n/a)'}/5\nLEARNING_CAPTURE: declined for validation\nDATA_MUTATION: whitespace-only edit; saved text trims back to original wording; missing levels may be completed\nERROR: ${result.error || '(none)'}\n\n## Steps\n\n${result.steps
    .map((item) => `- ${item.ok ? 'PASS' : 'FAIL'} — ${item.name}${item.detail ? `: ${item.detail}` : ''}`)
    .join('\n')}\n\n## Artifacts\n\n- descriptor-closure.json\n- descriptor-closure.png\n- descriptor-closure-trace.zip\n`;

  await writeFile(summaryPath, summary);
  await writeFile(jsonPath, safeJson(result));
  console.log(summary);
  process.exit(result.functionalPass ? 0 : 1);
}

main().catch((error) => {
  console.error('[descriptor-closure] FATAL', error?.stack || error);
  process.exit(2);
});
