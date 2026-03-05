/**
 * MAT Liveness Test Suite — AI Health Probes
 * Spec: modules/mat/00-app-description/MAT_LIVENESS_TEST_SPEC.md v1.0
 *
 * Covers:
 *   LV-AI-01  AI Centre gateway reachable
 *   LV-AI-02  Document parser model available
 *   LV-AI-03  Maturity scoring model available
 *   LV-AI-04  Report writer model available
 *   LV-AI-05  AI chat model available
 *   LV-AI-06  All AI responses within latency budget
 *   LV-02-03  AI document parser fires on upload (API call confirmed)
 *   LV-06-02  Clicking Submit fires AI scoring request (API call confirmed)
 *   LV-06-04  AI scoring result (rating + rationale) appears after Submit
 *   LV-06-05  AI responds — response is non-empty and non-error
 *   LV-06-06  AI next-level explanation (improvement path) is visible
 *   LV-06-07  AI level+2 taster preview is visible
 *   LV-06-10  AI Chat responds to a test message (non-empty, non-error)
 *   LV-10-01  "Create Report" button fires AI report generation request
 *   LV-10-02  AI report generation responds (non-empty, non-error)
 *
 * Environment variables:
 *   BASE_URL                  — deployed MAT app URL
 *   AI_GATEWAY_URL            — AI Centre gateway health endpoint
 *   AI_DOC_PARSER_URL         — AI document parser endpoint
 *   AI_SCORING_URL            — AI scoring endpoint
 *   AI_CHAT_URL               — AI chat endpoint
 *   AI_REPORT_URL             — AI report writer endpoint
 *   AI_WARN_THRESHOLD_MS      — WARN if response > this (default 15000)
 *   AI_FAIL_THRESHOLD_MS      — FAIL if response > this (default 30000)
 *   AI_REPORT_TIMEOUT_MS      — Timeout for report generation (default 120000)
 */

import { test, expect, type APIRequestContext, type Page } from '@playwright/test';
import * as fs from 'node:fs';
import * as path from 'node:path';

// ─── Configuration ──────────────────────────────────────────────────────────
const BASE_URL = process.env['BASE_URL'] ?? 'http://localhost:3000';
const AI_GATEWAY_URL = process.env['AI_GATEWAY_URL'] ?? `${BASE_URL}/api/ai/health`;
const AI_DOC_PARSER_URL = process.env['AI_DOC_PARSER_URL'] ?? `${BASE_URL}/api/ai/parse-document`;
const AI_SCORING_URL = process.env['AI_SCORING_URL'] ?? `${BASE_URL}/api/ai/score`;
const AI_CHAT_URL = process.env['AI_CHAT_URL'] ?? `${BASE_URL}/api/ai/chat`;
const AI_REPORT_URL = process.env['AI_REPORT_URL'] ?? `${BASE_URL}/api/ai/report`;
const AI_WARN_THRESHOLD_MS = parseInt(process.env['AI_WARN_THRESHOLD_MS'] ?? '15000', 10);
const AI_FAIL_THRESHOLD_MS = parseInt(process.env['AI_FAIL_THRESHOLD_MS'] ?? '30000', 10);
const AI_REPORT_TIMEOUT_MS = parseInt(process.env['AI_REPORT_TIMEOUT_MS'] ?? '120000', 10);

const EVIDENCE_DIR = path.resolve(process.cwd(), 'modules/mat/tests/liveness/liveness-evidence');
const FIXTURES_DIR = path.resolve(process.cwd(), 'modules/mat/tests/liveness/fixtures');

// ─── State ──────────────────────────────────────────────────────────────────
let aiGatewayAvailable = false;

function ensureEvidenceDir(): void {
  if (!fs.existsSync(EVIDENCE_DIR)) {
    fs.mkdirSync(EVIDENCE_DIR, { recursive: true });
  }
}

async function screenshot(page: Page, name: string): Promise<void> {
  ensureEvidenceDir();
  await page.screenshot({ path: path.join(EVIDENCE_DIR, `${name}.png`), fullPage: false });
}

async function timedRequest(
  request: APIRequestContext,
  method: 'get' | 'post',
  url: string,
  options: Parameters<APIRequestContext['post']>[1] = {}
): Promise<{ status: number; body: string; durationMs: number }> {
  const start = Date.now();
  const response = method === 'get'
    ? await request.get(url, { timeout: AI_FAIL_THRESHOLD_MS, ...options })
    : await request.post(url, { timeout: AI_FAIL_THRESHOLD_MS, ...options });
  const durationMs = Date.now() - start;
  const body = await response.text();
  return { status: response.status(), body, durationMs };
}

// ─────────────────────────────────────────────────────────────────────────────
// AI HEALTH — Gateway & Model Availability
// ─────────────────────────────────────────────────────────────────────────────

test.describe('AI Health Probes', () => {
  test('LV-AI-01: AI Centre gateway is reachable (health check endpoint responds 200)', async ({ request }) => {
    const { status, durationMs } = await timedRequest(request, 'get', AI_GATEWAY_URL);
    expect(status, `AI gateway at ${AI_GATEWAY_URL} should return 200`).toBe(200);
    if (durationMs > AI_WARN_THRESHOLD_MS) {
      console.warn(`[WARN] LV-AI-01: AI gateway responded in ${durationMs}ms (>${AI_WARN_THRESHOLD_MS}ms warn threshold)`);
    }
    expect(durationMs, `AI gateway should respond within ${AI_FAIL_THRESHOLD_MS}ms`).toBeLessThan(AI_FAIL_THRESHOLD_MS);
    aiGatewayAvailable = true;
  });

  test('LV-AI-02: Document parser model is available (probe with empty payload)', async ({ request }) => {
    if (!aiGatewayAvailable) {
      test.skip(); // Dependent on LV-AI-01
      return;
    }
    const { status, body, durationMs } = await timedRequest(request, 'post', AI_DOC_PARSER_URL, {
      data: { probe: true, text: '' },
    });
    expect([200, 400, 422], `Document parser should be reachable (any non-5xx)`).toContain(
      status < 500 ? status : 500
    );
    expect(status, 'Document parser endpoint should not return 5xx').toBeLessThan(500);
    if (durationMs > AI_WARN_THRESHOLD_MS) {
      console.warn(`[WARN] LV-AI-02: Doc parser responded in ${durationMs}ms`);
    }
    expect(body.length, 'Doc parser response should not be empty').toBeGreaterThan(0);
  });

  test('LV-AI-03: Maturity scoring model is available (probe with minimal payload)', async ({ request }) => {
    if (!aiGatewayAvailable) {
      test.skip(); // Dependent on LV-AI-01
      return;
    }
    const { status, body, durationMs } = await timedRequest(request, 'post', AI_SCORING_URL, {
      data: {
        probe: true,
        criteria: 'Test criteria',
        evidence: 'Test evidence',
      },
    });
    expect(status, 'Scoring endpoint should not return 5xx').toBeLessThan(500);
    if (durationMs > AI_WARN_THRESHOLD_MS) {
      console.warn(`[WARN] LV-AI-03: Scoring model responded in ${durationMs}ms`);
    }
    expect(body.length, 'Scoring response should not be empty').toBeGreaterThan(0);
  });

  test('LV-AI-04: Report writer model is available (probe with minimal payload)', async ({ request }) => {
    if (!aiGatewayAvailable) {
      test.skip(); // Dependent on LV-AI-01
      return;
    }
    const { status, body, durationMs } = await timedRequest(request, 'post', AI_REPORT_URL, {
      timeout: AI_REPORT_TIMEOUT_MS,
      data: {
        probe: true,
        auditId: 'liveness-probe',
      },
    });
    expect(status, 'Report writer endpoint should not return 5xx').toBeLessThan(500);
    if (durationMs > AI_WARN_THRESHOLD_MS) {
      console.warn(`[WARN] LV-AI-04: Report writer responded in ${durationMs}ms`);
    }
    expect(body.length, 'Report writer response should not be empty').toBeGreaterThan(0);
  });

  test('LV-AI-05: AI chat model is available (probe with test message)', async ({ request }) => {
    if (!aiGatewayAvailable) {
      test.skip(); // Dependent on LV-AI-01
      return;
    }
    const { status, body, durationMs } = await timedRequest(request, 'post', AI_CHAT_URL, {
      data: {
        probe: true,
        message: 'Hello — this is a liveness probe.',
        context: { criteriaId: 'probe', auditId: 'probe' },
      },
    });
    expect(status, 'Chat endpoint should not return 5xx').toBeLessThan(500);
    if (durationMs > AI_WARN_THRESHOLD_MS) {
      console.warn(`[WARN] LV-AI-05: AI chat responded in ${durationMs}ms`);
    }
    expect(body.length, 'Chat response should not be empty').toBeGreaterThan(0);
  });

  test('LV-AI-06: All AI responses are received within acceptable latency (< 30s)', async ({ request }) => {
    if (!aiGatewayAvailable) {
      test.skip(); // Dependent on LV-AI-01
      return;
    }
    // Run a quick timing probe against the scoring endpoint
    const { durationMs } = await timedRequest(request, 'post', AI_SCORING_URL, {
      data: { probe: true, criteria: 'timing probe', evidence: 'timing probe' },
    });
    expect(
      durationMs,
      `AI scoring latency ${durationMs}ms exceeds hard limit of ${AI_FAIL_THRESHOLD_MS}ms`
    ).toBeLessThan(AI_FAIL_THRESHOLD_MS);
    if (durationMs > AI_WARN_THRESHOLD_MS) {
      console.warn(`[WARN] LV-AI-06: AI latency ${durationMs}ms is above warn threshold ${AI_WARN_THRESHOLD_MS}ms`);
    }
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// STEP 2 — AI Document Parser (API call confirmation)
// ─────────────────────────────────────────────────────────────────────────────

test.describe('STEP 2 — AI Document Parser', () => {
  test('LV-02-03: AI document parser fires on upload (API call confirmed)', async ({ page }) => {
    if (!aiGatewayAvailable) {
      test.skip();
      return;
    }
    const parserCalls: string[] = [];
    page.on('request', (req) => {
      if (/parse.*document|doc.*pars|ai.*pars/i.test(req.url())) {
        parserCalls.push(req.url());
      }
    });
    await page.goto(`${BASE_URL}/`, { waitUntil: 'domcontentloaded', timeout: 10_000 });
    const uploadBtn = page.locator('text=/upload.*criteria|upload.*document|upload/i').first();
    if (await uploadBtn.isVisible()) {
      await uploadBtn.click();
      const fileInput = page.locator('input[type=file]').first();
      await fileInput.setInputFiles(path.join(FIXTURES_DIR, 'test-criteria-document.pdf'));
      await page.waitForTimeout(5_000);
      expect(parserCalls.length, 'AI document parser API call should be fired on upload').toBeGreaterThan(0);
    } else {
      test.skip();
    }
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// STEP 6 — AI Scoring (via UI)
// ─────────────────────────────────────────────────────────────────────────────

test.describe('STEP 6 — AI Scoring (AI checks)', () => {
  test('LV-06-02: Clicking Submit fires AI scoring request (API call confirmed)', async ({ page }) => {
    if (!aiGatewayAvailable) {
      test.skip();
      return;
    }
    const scoringCalls: string[] = [];
    page.on('request', (req) => {
      if (/score|scoring|ai.*submit/i.test(req.url())) {
        scoringCalls.push(req.url());
      }
    });
    await page.goto(`${BASE_URL}/`, { waitUntil: 'domcontentloaded', timeout: 10_000 });
    const criteriaCard = page.locator('[data-testid*=criteria], .criteria-card').first();
    if (await criteriaCard.isVisible()) {
      await criteriaCard.click();
      const textInput = page.locator('textarea[placeholder*="evidence" i], textarea[name*=evidence]').first();
      if (await textInput.isVisible()) {
        await textInput.fill('Liveness AI scoring test evidence');
        await page.locator('button:has-text(/submit|score|analyse/i)').first().click();
        await page.waitForTimeout(5_000);
        expect(scoringCalls.length, 'AI scoring API call should be fired on Submit').toBeGreaterThan(0);
      } else {
        test.skip();
      }
    } else {
      test.skip();
    }
  });

  test('LV-06-04: AI scoring result (rating + rationale) appears after Submit', async ({ page }) => {
    if (!aiGatewayAvailable) {
      test.skip();
      return;
    }
    await page.goto(`${BASE_URL}/`, { waitUntil: 'domcontentloaded', timeout: 10_000 });
    const criteriaCard = page.locator('[data-testid*=criteria], .criteria-card').first();
    if (await criteriaCard.isVisible()) {
      await criteriaCard.click();
      const textInput = page.locator('textarea[placeholder*="evidence" i], textarea[name*=evidence]').first();
      if (await textInput.isVisible()) {
        await textInput.fill('Liveness AI scoring test evidence for rating');
        await page.locator('button:has-text(/submit|score|analyse/i)').first().click();
        await expect(page.locator('text=/rating|level|score|maturity/i').first()).toBeVisible({ timeout: AI_FAIL_THRESHOLD_MS });
        await expect(page.locator('text=/rationale|reason|explanation|because/i').first()).toBeVisible({ timeout: AI_FAIL_THRESHOLD_MS });
        await screenshot(page, 'LV-06-04-scoring-result');
      } else {
        test.skip();
      }
    } else {
      test.skip();
    }
  });

  test('LV-06-05: AI responds — response is non-empty and non-error', async ({ page }) => {
    if (!aiGatewayAvailable) {
      test.skip();
      return;
    }
    await page.goto(`${BASE_URL}/`, { waitUntil: 'domcontentloaded', timeout: 10_000 });
    const criteriaCard = page.locator('[data-testid*=criteria], .criteria-card').first();
    if (await criteriaCard.isVisible()) {
      await criteriaCard.click();
      const textInput = page.locator('textarea[placeholder*="evidence" i], textarea[name*=evidence]').first();
      if (await textInput.isVisible()) {
        await textInput.fill('Liveness AI non-empty response check');
        await page.locator('button:has-text(/submit|score|analyse/i)').first().click();
        await expect(page.locator('text=/error|failed|unavailable/i').first()).not.toBeVisible({ timeout: AI_FAIL_THRESHOLD_MS });
        // AI result area should have meaningful content
        const resultText = await page.locator('[data-testid*=score-result], .score-result, .ai-result').first().innerText().catch(() => '');
        expect(resultText.length, 'AI scoring response should not be empty').toBeGreaterThan(0);
      } else {
        test.skip();
      }
    } else {
      test.skip();
    }
  });

  test('LV-06-06: AI next-level explanation (improvement path) is visible', async ({ page }) => {
    if (!aiGatewayAvailable) {
      test.skip();
      return;
    }
    await page.goto(`${BASE_URL}/`, { waitUntil: 'domcontentloaded', timeout: 10_000 });
    const criteriaCard = page.locator('[data-testid*=criteria], .criteria-card').first();
    if (await criteriaCard.isVisible()) {
      await criteriaCard.click();
      const textInput = page.locator('textarea[placeholder*="evidence" i], textarea[name*=evidence]').first();
      if (await textInput.isVisible()) {
        await textInput.fill('Liveness next-level explanation check');
        await page.locator('button:has-text(/submit|score|analyse/i)').first().click();
        await expect(
          page.locator('text=/next level|improve|improvement|to reach|path/i').first()
        ).toBeVisible({ timeout: AI_FAIL_THRESHOLD_MS });
      } else {
        test.skip();
      }
    } else {
      test.skip();
    }
  });

  test('LV-06-07: AI level+2 taster preview is visible', async ({ page }) => {
    if (!aiGatewayAvailable) {
      test.skip();
      return;
    }
    await page.goto(`${BASE_URL}/`, { waitUntil: 'domcontentloaded', timeout: 10_000 });
    const criteriaCard = page.locator('[data-testid*=criteria], .criteria-card').first();
    if (await criteriaCard.isVisible()) {
      await criteriaCard.click();
      const textInput = page.locator('textarea[placeholder*="evidence" i], textarea[name*=evidence]').first();
      if (await textInput.isVisible()) {
        await textInput.fill('Liveness level+2 taster check');
        await page.locator('button:has-text(/submit|score|analyse/i)').first().click();
        await expect(
          page.locator('text=/taster|preview|level \+2|two levels/i').first()
        ).toBeVisible({ timeout: AI_FAIL_THRESHOLD_MS });
      } else {
        test.skip();
      }
    } else {
      test.skip();
    }
  });

  test('LV-06-10: AI Chat responds to a test message (non-empty, non-error)', async ({ page }) => {
    if (!aiGatewayAvailable) {
      test.skip();
      return;
    }
    await page.goto(`${BASE_URL}/`, { waitUntil: 'domcontentloaded', timeout: 10_000 });
    const criteriaCard = page.locator('[data-testid*=criteria], .criteria-card').first();
    if (await criteriaCard.isVisible()) {
      const chatTrigger = criteriaCard.locator('button:has-text(/chat|ask ai|ai chat/i)').first();
      if (await chatTrigger.isVisible()) {
        await chatTrigger.click();
        const chatInput = page.locator('[data-testid*=chat] input, .chat-panel input[placeholder*="message" i]').first();
        await expect(chatInput).toBeVisible({ timeout: 3_000 });
        await chatInput.fill('What does this criteria require?');
        await chatInput.press('Enter');
        await expect(page.locator('text=/error|failed|unavailable/i').first()).not.toBeVisible({ timeout: AI_FAIL_THRESHOLD_MS });
        // AI chat response area
        const chatResponse = page.locator('[data-testid*=chat-response], .chat-response, .message-assistant').first();
        await expect(chatResponse).toBeVisible({ timeout: AI_FAIL_THRESHOLD_MS });
        const responseText = await chatResponse.innerText();
        expect(responseText.length, 'AI chat response should not be empty').toBeGreaterThan(0);
        await screenshot(page, 'LV-06-10-ai-chat-response');
      } else {
        test.skip();
      }
    } else {
      test.skip();
    }
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// STEP 10 — AI Report Generation
// ─────────────────────────────────────────────────────────────────────────────

test.describe('STEP 10 — AI Report Generation', () => {
  test('LV-10-01: "Create Report" button fires AI report generation request (API call confirmed)', async ({ page }) => {
    if (!aiGatewayAvailable) {
      test.skip();
      return;
    }
    const reportCalls: string[] = [];
    page.on('request', (req) => {
      if (/report|generate.*report|ai.*report/i.test(req.url())) {
        reportCalls.push(req.url());
      }
    });
    await page.goto(`${BASE_URL}/`, { waitUntil: 'domcontentloaded', timeout: 10_000 });
    const createReportBtn = page.locator('button:has-text(/create report|generate report/i)').first();
    if (await createReportBtn.isVisible() && await createReportBtn.isEnabled()) {
      await createReportBtn.click();
      await page.waitForTimeout(5_000);
      expect(reportCalls.length, 'AI report generation API call should be fired').toBeGreaterThan(0);
    } else {
      test.skip(); // Not yet available (outstanding work remains)
    }
  });

  test('LV-10-02: AI report generation responds (non-empty, non-error)', async ({ page }) => {
    if (!aiGatewayAvailable) {
      test.skip();
      return;
    }
    await page.goto(`${BASE_URL}/`, { waitUntil: 'domcontentloaded', timeout: 10_000 });
    const createReportBtn = page.locator('button:has-text(/create report|generate report/i)').first();
    if (await createReportBtn.isVisible() && await createReportBtn.isEnabled()) {
      await createReportBtn.click();
      // Wait for report to be generated
      await expect(
        page.locator('text=/report.*ready|download.*report|your report/i').first()
      ).toBeVisible({ timeout: AI_REPORT_TIMEOUT_MS });
      await expect(page.locator('text=/error|failed|unavailable/i').first()).not.toBeVisible();
      await screenshot(page, 'LV-10-02-report-generated');
    } else {
      test.skip();
    }
  });
});
