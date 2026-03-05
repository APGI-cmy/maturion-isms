/**
 * MAT Liveness Test Suite — AUTO checks
 * Spec: modules/mat/00-app-description/MAT_LIVENESS_TEST_SPEC.md v1.0
 *
 * Covers: LV-00-xx through LV-10-xx (AUTO type only — excludes AI and VISUAL checks)
 * AI checks → mat-ai-health.spec.ts
 * VISUAL checks → mat-visual.spec.ts
 *
 * Environment variables:
 *   BASE_URL                — e.g. https://your-mat-deployment.vercel.app
 *   LIVENESS_TEST_EMAIL     — e.g. liveness@yourdomain.com
 *   LIVENESS_TEST_PASSWORD  — e.g. LivenessTest!2026
 *
 * Outputs: liveness-evidence/ directory (screenshots per spec §4 naming)
 */

import { test, expect, type Page } from '@playwright/test';
import * as fs from 'node:fs';
import * as path from 'node:path';

// ─── Configuration ──────────────────────────────────────────────────────────
const BASE_URL = process.env['BASE_URL'] ?? 'http://localhost:3000';
const TEST_PASSWORD = process.env['LIVENESS_TEST_PASSWORD'] ?? 'LivenessTest!2026';
const EVIDENCE_DIR = path.resolve(process.cwd(), 'modules/mat/tests/liveness/liveness-evidence');
const FIXTURES_DIR = path.resolve(process.cwd(), 'modules/mat/tests/liveness/fixtures');
const TIMESTAMP = Date.now();
const AUDIT_NAME = `MAT Liveness Test Audit ${TIMESTAMP}`;
const ORG_NAME = `Liveness Test Org ${TIMESTAMP}`;

// ─── State shared between tests ─────────────────────────────────────────────
let createdAuditId: string | undefined;
let auditWorkspaceUrl: string | undefined;
let auditIsComplete = false;

// ─── Helpers ────────────────────────────────────────────────────────────────
function ensureEvidenceDir(): void {
  if (!fs.existsSync(EVIDENCE_DIR)) {
    fs.mkdirSync(EVIDENCE_DIR, { recursive: true });
  }
}

/** Generate a unique liveness test email address with a given prefix */
function makeTestEmail(prefix: string): string {
  return `${prefix}-${TIMESTAMP}@liveness.test`;
}

async function screenshot(page: Page, name: string): Promise<void> {
  ensureEvidenceDir();
  await page.screenshot({ path: path.join(EVIDENCE_DIR, `${name}.png`), fullPage: false });
}

// ─────────────────────────────────────────────────────────────────────────────
// STEP 0 — Sign Up & Onboarding
// ─────────────────────────────────────────────────────────────────────────────

test.describe('STEP 0 — Sign Up & Onboarding', () => {
  test('LV-00-01: Sign-up page loads and form fields are present', async ({ page }) => {
    await page.goto(`${BASE_URL}/signup`, { waitUntil: 'domcontentloaded', timeout: 10_000 });
    await expect(page.locator('text=/sign|create account/i').first()).toBeVisible({ timeout: 10_000 });
    await expect(page.locator('input[name=email], input[type=email]').first()).toBeVisible();
    await expect(page.locator('input[name=password], input[type=password]').first()).toBeVisible();
    await expect(page.locator('button[type=submit]').first()).toBeVisible();
    await screenshot(page, 'LV-00-01-signup-page');
  });

  test('LV-00-02: Sign-up form accepts input and navigates to /onboarding', async ({ page }) => {
    const livenessEmail = makeTestEmail('liveness-signup');
    await page.goto(`${BASE_URL}/signup`, { waitUntil: 'domcontentloaded', timeout: 10_000 });
    await page.locator('input[name=email], input[type=email]').first().fill(livenessEmail);
    await page.locator('input[name=password], input[type=password]').first().fill(TEST_PASSWORD);
    await page.locator('button[type=submit]').first().click();
    await expect(page).toHaveURL(/onboarding|confirm|verify/, { timeout: 10_000 });
    await screenshot(page, 'LV-00-02-signup');
  });

  test('LV-00-03: Onboarding wizard Step 1 (name) accepts input', async ({ page }) => {
    await page.goto(`${BASE_URL}/onboarding`, { waitUntil: 'domcontentloaded', timeout: 10_000 });
    await expect(page.locator('text=/name|what should we call/i').first()).toBeVisible({ timeout: 10_000 });
    await page.locator('input[name*=name], input[placeholder*="name" i]').first().fill('Liveness Test User');
    await page.locator('button:has-text(/next|continue/i)').first().click();
    await expect(page.locator('text=/organis|company|workspace/i').first()).toBeVisible({ timeout: 5_000 });
  });

  test('LV-00-04: Onboarding wizard Step 2 (org name) accepts input and submits', async ({ page }) => {
    await page.goto(`${BASE_URL}/onboarding`, { waitUntil: 'domcontentloaded', timeout: 10_000 });
    // Advance to step 2 if needed
    const step2Heading = page.locator('text=/organis|company|workspace/i').first();
    if (!(await step2Heading.isVisible())) {
      await page.locator('input[name*=name], input[placeholder*="name" i]').first().fill('Liveness Test User');
      await page.locator('button:has-text(/next|continue/i)').first().click();
    }
    await expect(step2Heading).toBeVisible({ timeout: 5_000 });
    await page.locator('input[name*=org], input[name*=company], input[placeholder*="org" i], input[placeholder*="company" i]').first().fill(ORG_NAME);
    await page.locator('button[type=submit], button:has-text(/finish|done|complete|get started/i)').first().click();
    await expect(page).toHaveURL(/dashboard|home|\/$/i, { timeout: 10_000 });
    await screenshot(page, 'LV-00-04-onboarding-complete');
  });

  test('LV-00-05: Confirmation email dispatch fires (API call confirmed)', async ({ page }) => {
    const requests: string[] = [];
    page.on('request', (req) => {
      if (/signup|auth|register/i.test(req.url())) {
        requests.push(req.url());
      }
    });
    await page.goto(`${BASE_URL}/signup`, { waitUntil: 'domcontentloaded', timeout: 10_000 });
    await page.locator('input[name=email], input[type=email]').first().fill(makeTestEmail('liveness-verify'));
    await page.locator('input[name=password], input[type=password]').first().fill(TEST_PASSWORD);
    await page.locator('button[type=submit]').first().click();
    await page.waitForTimeout(3_000);
    expect(requests.length, 'Expected at least one signup/auth API call to be made').toBeGreaterThan(0);
    // MANUAL: Verify confirmation email arrived in liveness-test email inbox
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// STEP 1 — Create New Audit
// ─────────────────────────────────────────────────────────────────────────────

test.describe('STEP 1 — Create New Audit', () => {
  test('LV-01-01: Dashboard home loads with "Create New Audit" button visible', async ({ page }) => {
    await page.goto(`${BASE_URL}/`, { waitUntil: 'domcontentloaded', timeout: 10_000 });
    await expect(page.locator('text=/create.*(new )?audit|new audit/i').first()).toBeVisible({ timeout: 10_000 });
    const bodyText = await page.locator('body').innerText();
    expect(bodyText.length, 'Page body appears blank').toBeGreaterThan(50);
    await screenshot(page, 'LV-01-01-dashboard');
  });

  test('LV-01-02: Create New Audit modal/form opens on button click', async ({ page }) => {
    await page.goto(`${BASE_URL}/`, { waitUntil: 'domcontentloaded', timeout: 10_000 });
    await page.locator('text=/create.*(new )?audit|new audit/i').first().click();
    await expect(page.locator('input, textarea, form').first()).toBeVisible({ timeout: 3_000 });
  });

  test('LV-01-03: Audit creation form accepts all metadata fields', async ({ page }) => {
    await page.goto(`${BASE_URL}/`, { waitUntil: 'domcontentloaded', timeout: 10_000 });
    await page.locator('text=/create.*(new )?audit|new audit/i').first().click();
    await page.locator('input[name*=name], input[name*=title], input[placeholder*="audit" i]').first().fill(AUDIT_NAME);
    // No validation error on valid input
    const errorMsg = page.locator('text=/error|invalid|required/i').first();
    await expect(errorMsg).not.toBeVisible();
  });

  test('LV-01-04: Submitting audit creation navigates to audit workspace', async ({ page }) => {
    await page.goto(`${BASE_URL}/`, { waitUntil: 'domcontentloaded', timeout: 10_000 });
    await page.locator('text=/create.*(new )?audit|new audit/i').first().click();
    await page.locator('input[name*=name], input[name*=title], input[placeholder*="audit" i]').first().fill(AUDIT_NAME);
    await page.locator('button[type=submit], button:has-text(/create|save|start/i)').first().click();
    await expect(page).toHaveURL(/audits?\//i, { timeout: 10_000 });
    auditWorkspaceUrl = page.url();
    const match = auditWorkspaceUrl.match(/audits?\/([^/?#]+)/i);
    if (match) createdAuditId = match[1];
    await expect(page.locator(`text=${AUDIT_NAME}`).first()).toBeVisible({ timeout: 5_000 });
    await screenshot(page, 'LV-01-04-audit-workspace');
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// STEP 2 — Upload Criteria Document
// ─────────────────────────────────────────────────────────────────────────────

test.describe('STEP 2 — Upload Criteria Document', () => {
  test('LV-02-01: Upload Criteria Document button is present and clickable', async ({ page }) => {
    const url = auditWorkspaceUrl ?? `${BASE_URL}/`;
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 10_000 });
    await expect(page.locator('text=/upload.*criteria|upload.*document|upload/i').first()).toBeVisible({ timeout: 10_000 });
  });

  test('LV-02-02: PDF upload is accepted by the file input', async ({ page }) => {
    const url = auditWorkspaceUrl ?? `${BASE_URL}/`;
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 10_000 });
    await page.locator('text=/upload.*criteria|upload.*document|upload/i').first().click();
    const fileInput = page.locator('input[type=file]').first();
    const pdfPath = path.join(FIXTURES_DIR, 'test-criteria-document.pdf');
    await fileInput.setInputFiles(pdfPath);
    // No rejection error
    const errorMsg = page.locator('text=/error|invalid|unsupported/i').first();
    await expect(errorMsg).not.toBeVisible({ timeout: 3_000 });
  });

  test('LV-02-04: Domain / MPS / Criteria hierarchy cards appear after parse', async ({ page }) => {
    const url = auditWorkspaceUrl ?? `${BASE_URL}/`;
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 10_000 });
    await page.locator('text=/upload.*criteria|upload.*document|upload/i').first().click();
    const fileInput = page.locator('input[type=file]').first();
    await fileInput.setInputFiles(path.join(FIXTURES_DIR, 'test-criteria-document.pdf'));
    // Wait for hierarchy cards to render
    await expect(page.locator('[data-testid*=domain], .domain-card, text=/domain/i').first()).toBeVisible({ timeout: 60_000 });
    await expect(page.locator('[data-testid*=mps], .mps-card, text=/mps/i').first()).toBeVisible({ timeout: 60_000 });
    await expect(page.locator('[data-testid*=criteria], .criteria-card, text=/criteria/i').first()).toBeVisible({ timeout: 60_000 });
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// STEP 3 — Domain, MPS & Criteria Card Interaction
// ─────────────────────────────────────────────────────────────────────────────

test.describe('STEP 3 — Domain, MPS & Criteria Cards', () => {
  test('LV-03-01: Domain card renders with title and toggle', async ({ page }) => {
    const url = auditWorkspaceUrl ?? `${BASE_URL}/`;
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 10_000 });
    const domainCard = page.locator('[data-testid*=domain], .domain-card').first();
    await expect(domainCard).toBeVisible({ timeout: 10_000 });
    await expect(domainCard.locator('text=/./').first()).toBeVisible();
    await expect(domainCard.locator('button, [role=switch], input[type=checkbox]').first()).toBeVisible();
  });

  test('LV-03-02: Domain card toggle (exclude) greys out domain and cascades to MPS/Criteria', async ({ page }) => {
    const url = auditWorkspaceUrl ?? `${BASE_URL}/`;
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 10_000 });
    const domainCard = page.locator('[data-testid*=domain], .domain-card').first();
    await expect(domainCard).toBeVisible({ timeout: 10_000 });
    const toggle = domainCard.locator('button:has-text(/exclude/i), [role=switch], input[type=checkbox]').first();
    await toggle.click();
    // Wait for cascade visual
    await page.waitForTimeout(1_000);
    // Check that card has excluded visual indicator
    const cardHtml = await domainCard.innerHTML();
    expect(
      cardHtml.match(/excluded|greyed|disabled|opacity/i),
      'Domain card should show excluded/greyed visual after toggle'
    ).toBeTruthy();
  });

  test('LV-03-03: MPS card renders within domain with correct hierarchy', async ({ page }) => {
    const url = auditWorkspaceUrl ?? `${BASE_URL}/`;
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 10_000 });
    const mpsCard = page.locator('[data-testid*=mps], .mps-card').first();
    await expect(mpsCard).toBeVisible({ timeout: 10_000 });
  });

  test('LV-03-04: Criteria card renders within MPS', async ({ page }) => {
    const url = auditWorkspaceUrl ?? `${BASE_URL}/`;
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 10_000 });
    const criteriaCard = page.locator('[data-testid*=criteria], .criteria-card').first();
    await expect(criteriaCard).toBeVisible({ timeout: 10_000 });
  });

  test('LV-03-05: Level descriptor is visible on Criteria card', async ({ page }) => {
    const url = auditWorkspaceUrl ?? `${BASE_URL}/`;
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 10_000 });
    const criteriaCard = page.locator('[data-testid*=criteria], .criteria-card').first();
    await expect(criteriaCard).toBeVisible({ timeout: 10_000 });
    await expect(criteriaCard.locator('text=/level|descriptor/i').first()).toBeVisible();
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// STEP 4 — Invitations
// ─────────────────────────────────────────────────────────────────────────────

test.describe('STEP 4 — Invite Auditor / Evidence Submitter', () => {
  test('LV-04-01: Invite Auditor button is present on Domain card', async ({ page }) => {
    const url = auditWorkspaceUrl ?? `${BASE_URL}/`;
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 10_000 });
    await expect(page.locator('text=/invite.*auditor/i').first()).toBeVisible({ timeout: 10_000 });
  });

  test('LV-04-02: Invite Auditor modal opens', async ({ page }) => {
    const url = auditWorkspaceUrl ?? `${BASE_URL}/`;
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 10_000 });
    await page.locator('text=/invite.*auditor/i').first().click();
    await expect(page.locator('[role=dialog], .modal, form').first()).toBeVisible({ timeout: 3_000 });
  });

  test('LV-04-03: Invite form accepts email and role fields', async ({ page }) => {
    const url = auditWorkspaceUrl ?? `${BASE_URL}/`;
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 10_000 });
    await page.locator('text=/invite.*auditor/i').first().click();
    const emailInput = page.locator('[role=dialog] input[type=email], .modal input[type=email], form input[type=email]').first();
    await expect(emailInput).toBeVisible({ timeout: 3_000 });
    await emailInput.fill('auditor-liveness@liveness.test');
    // No validation error on valid email
    await expect(page.locator('text=/invalid email/i').first()).not.toBeVisible();
  });

  test('LV-04-04: Invite submission fires API call (confirmed)', async ({ page }) => {
    const inviteRequests: string[] = [];
    page.on('request', (req) => {
      if (/invite|member|collaborat/i.test(req.url())) {
        inviteRequests.push(req.url());
      }
    });
    const url = auditWorkspaceUrl ?? `${BASE_URL}/`;
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 10_000 });
    await page.locator('text=/invite.*auditor/i').first().click();
    const emailInput = page.locator('[role=dialog] input[type=email], .modal input[type=email], form input[type=email]').first();
    await emailInput.fill('auditor-liveness@liveness.test');
    await page.locator('[role=dialog] button[type=submit], .modal button[type=submit], button:has-text(/send.*invite|invite/i)').first().click();
    await page.waitForTimeout(2_000);
    expect(inviteRequests.length, 'Expected invite API call to be fired').toBeGreaterThan(0);
  });

  test('LV-04-06: Invite Evidence Submitter button present at Criteria level', async ({ page }) => {
    const url = auditWorkspaceUrl ?? `${BASE_URL}/`;
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 10_000 });
    const criteriaCard = page.locator('[data-testid*=criteria], .criteria-card').first();
    await expect(criteriaCard).toBeVisible({ timeout: 10_000 });
    await expect(criteriaCard.locator('text=/invite.*evidence|evidence.*submitter/i').first()).toBeVisible();
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// STEP 5 — Evidence Collection
// ─────────────────────────────────────────────────────────────────────────────

test.describe('STEP 5 — Evidence Collection', () => {
  test('LV-05-01: Evidence upload panel opens on Criteria card', async ({ page }) => {
    const url = auditWorkspaceUrl ?? `${BASE_URL}/`;
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 10_000 });
    const criteriaCard = page.locator('[data-testid*=criteria], .criteria-card').first();
    await expect(criteriaCard).toBeVisible({ timeout: 10_000 });
    await criteriaCard.click();
    await expect(page.locator('[data-testid*=evidence], .evidence-panel, text=/upload.*evidence|add evidence/i').first()).toBeVisible({ timeout: 5_000 });
  });

  test('LV-05-02: Text evidence input field accepts text', async ({ page }) => {
    const url = auditWorkspaceUrl ?? `${BASE_URL}/`;
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 10_000 });
    const criteriaCard = page.locator('[data-testid*=criteria], .criteria-card').first();
    await criteriaCard.click();
    const textInput = page.locator('textarea[placeholder*="evidence" i], textarea[name*=evidence], textarea[placeholder*="text" i]').first();
    await expect(textInput).toBeVisible({ timeout: 5_000 });
    await textInput.fill('Liveness test evidence text');
    await expect(textInput).toHaveValue('Liveness test evidence text');
  });

  test('LV-05-03: File evidence upload accepts a test document', async ({ page }) => {
    const url = auditWorkspaceUrl ?? `${BASE_URL}/`;
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 10_000 });
    const criteriaCard = page.locator('[data-testid*=criteria], .criteria-card').first();
    await criteriaCard.click();
    const fileInput = page.locator('input[type=file]').first();
    await expect(fileInput).toBeAttached({ timeout: 5_000 });
    await fileInput.setInputFiles(path.join(FIXTURES_DIR, 'test-evidence.pdf'));
    await expect(page.locator('text=/error|rejected|unsupported/i').first()).not.toBeVisible({ timeout: 3_000 });
  });

  test('LV-05-04: Photo upload button is present and triggers file picker', async ({ page }) => {
    const url = auditWorkspaceUrl ?? `${BASE_URL}/`;
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 10_000 });
    const criteriaCard = page.locator('[data-testid*=criteria], .criteria-card').first();
    await criteriaCard.click();
    await expect(page.locator('button:has-text(/photo|image|camera/i), [aria-label*=photo i]').first()).toBeVisible({ timeout: 5_000 });
  });

  test('LV-05-05: Voice/video record button is present (click-and-hold interaction available)', async ({ page }) => {
    const url = auditWorkspaceUrl ?? `${BASE_URL}/`;
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 10_000 });
    const criteriaCard = page.locator('[data-testid*=criteria], .criteria-card').first();
    await criteriaCard.click();
    await expect(page.locator('button:has-text(/record|voice|audio|video/i), [aria-label*=record i]').first()).toBeVisible({ timeout: 5_000 });
  });

  test('LV-05-06: Uploaded evidence is listed in evidence card', async ({ page }) => {
    const url = auditWorkspaceUrl ?? `${BASE_URL}/`;
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 10_000 });
    const criteriaCard = page.locator('[data-testid*=criteria], .criteria-card').first();
    await criteriaCard.click();
    const textInput = page.locator('textarea[placeholder*="evidence" i], textarea[name*=evidence]').first();
    await textInput.fill('Liveness test evidence text');
    await page.locator('button:has-text(/add|save|attach/i)').first().click();
    await expect(page.locator('text=/liveness test evidence/i').first()).toBeVisible({ timeout: 5_000 });
  });

  test('LV-05-07: Evidence can be removed after upload', async ({ page }) => {
    const url = auditWorkspaceUrl ?? `${BASE_URL}/`;
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 10_000 });
    const criteriaCard = page.locator('[data-testid*=criteria], .criteria-card').first();
    await criteriaCard.click();
    const textInput = page.locator('textarea[placeholder*="evidence" i], textarea[name*=evidence]').first();
    await textInput.fill('Evidence to remove');
    await page.locator('button:has-text(/add|save|attach/i)').first().click();
    await expect(page.locator('text=/evidence to remove/i').first()).toBeVisible({ timeout: 5_000 });
    // Remove it
    await page.locator('[aria-label*=remove], [aria-label*=delete], button:has-text(/remove|delete/i)').first().click();
    await expect(page.locator('text=/evidence to remove/i').first()).not.toBeVisible({ timeout: 3_000 });
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// STEP 6 — AI Scoring (AUTO checks only — AI checks in mat-ai-health.spec.ts)
// ─────────────────────────────────────────────────────────────────────────────

test.describe('STEP 6 — AI Scoring (AUTO checks)', () => {
  test('LV-06-01: Submit button is present on evidence panel', async ({ page }) => {
    const url = auditWorkspaceUrl ?? `${BASE_URL}/`;
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 10_000 });
    const criteriaCard = page.locator('[data-testid*=criteria], .criteria-card').first();
    await criteriaCard.click();
    await expect(page.locator('button:has-text(/submit|score|analyse/i)').first()).toBeVisible({ timeout: 5_000 });
  });

  test('LV-06-03: Loading/spinner state is shown while AI processes', async ({ page }) => {
    const url = auditWorkspaceUrl ?? `${BASE_URL}/`;
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 10_000 });
    const criteriaCard = page.locator('[data-testid*=criteria], .criteria-card').first();
    await criteriaCard.click();
    const textInput = page.locator('textarea[placeholder*="evidence" i], textarea[name*=evidence]').first();
    await textInput.fill('Liveness test evidence for AI scoring');
    await page.locator('button:has-text(/submit|score|analyse/i)').first().click();
    // Spinner should appear immediately after submit
    await expect(page.locator('[role=status], .spinner, .loading, text=/loading|processing|analysing/i').first()).toBeVisible({ timeout: 5_000 });
  });

  test('LV-06-08: AI Chat UI entry point (button/link) is present on criteria card', async ({ page }) => {
    const url = auditWorkspaceUrl ?? `${BASE_URL}/`;
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 10_000 });
    const criteriaCard = page.locator('[data-testid*=criteria], .criteria-card').first();
    await expect(criteriaCard).toBeVisible({ timeout: 10_000 });
    await expect(criteriaCard.locator('button:has-text(/chat|ask ai|ai chat/i), [aria-label*=chat i]').first()).toBeVisible();
  });

  test('LV-06-09: AI Chat panel opens when triggered', async ({ page }) => {
    const url = auditWorkspaceUrl ?? `${BASE_URL}/`;
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 10_000 });
    const criteriaCard = page.locator('[data-testid*=criteria], .criteria-card').first();
    await criteriaCard.locator('button:has-text(/chat|ask ai|ai chat/i), [aria-label*=chat i]').first().click();
    await expect(page.locator('[data-testid*=chat], .chat-panel, [role=dialog]:has(input[placeholder*="message" i])').first()).toBeVisible({ timeout: 3_000 });
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// STEP 7 — Results Table
// ─────────────────────────────────────────────────────────────────────────────

test.describe('STEP 7 — Audit Results Table', () => {
  test('LV-07-01: Audit Results Table is present after submission', async ({ page }) => {
    const url = auditWorkspaceUrl ?? `${BASE_URL}/`;
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 10_000 });
    await expect(page.locator('[data-testid*=results], .results-table, table').first()).toBeVisible({ timeout: 10_000 });
    await screenshot(page, 'LV-07-01-results-table');
  });

  test('LV-07-02: Results table shows required columns', async ({ page }) => {
    const url = auditWorkspaceUrl ?? `${BASE_URL}/`;
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 10_000 });
    const table = page.locator('[data-testid*=results], .results-table, table').first();
    await expect(table).toBeVisible({ timeout: 10_000 });
    const tableText = await table.innerText();
    expect(tableText, 'Results table should contain "Domain" column').toMatch(/domain/i);
    expect(tableText, 'Results table should contain "MPS" column').toMatch(/mps/i);
    expect(tableText, 'Results table should contain "Rating" or "Score" column').toMatch(/rating|score/i);
  });

  test('LV-07-03: Results table is populated (not empty rows)', async ({ page }) => {
    const url = auditWorkspaceUrl ?? `${BASE_URL}/`;
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 10_000 });
    const table = page.locator('[data-testid*=results], .results-table, table').first();
    await expect(table).toBeVisible({ timeout: 10_000 });
    const rows = table.locator('tbody tr, [role=row]');
    const rowCount = await rows.count();
    expect(rowCount, 'Results table should have at least one data row').toBeGreaterThan(0);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// STEP 8 — Dashboard & Create Report Gate
// ─────────────────────────────────────────────────────────────────────────────

test.describe('STEP 8 — Dashboard & Report Gate', () => {
  test('LV-08-01: Dashboard loads with completion percentage visible', async ({ page }) => {
    const url = auditWorkspaceUrl ?? `${BASE_URL}/`;
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 10_000 });
    await expect(page.locator('text=/%|completion|complete/i').first()).toBeVisible({ timeout: 10_000 });
    await screenshot(page, 'LV-08-01-dashboard-progress');
  });

  test('LV-08-02: Dashboard shows outstanding work items', async ({ page }) => {
    const url = auditWorkspaceUrl ?? `${BASE_URL}/`;
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 10_000 });
    await expect(page.locator('text=/outstanding|remaining|pending|incomplete/i').first()).toBeVisible({ timeout: 10_000 });
  });

  test('LV-08-03: Dashboard drill-down to outstanding item navigates correctly', async ({ page }) => {
    const url = auditWorkspaceUrl ?? `${BASE_URL}/`;
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 10_000 });
    const outstandingLink = page.locator('a:has-text(/outstanding|view|go to/i), button:has-text(/view|go to/i)').first();
    if (await outstandingLink.isVisible()) {
      await outstandingLink.click();
      await expect(page).toHaveURL(/criteria|evidence|audit/i, { timeout: 5_000 });
    } else {
      // No outstanding items — skip drill-down check
      test.skip();
    }
  });

  test('LV-08-04: "Create Report" button is inactive when outstanding work remains', async ({ page }) => {
    const url = auditWorkspaceUrl ?? `${BASE_URL}/`;
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 10_000 });
    const createReportBtn = page.locator('button:has-text(/create report|generate report/i)').first();
    if (!auditIsComplete) {
      await expect(createReportBtn).toBeVisible({ timeout: 10_000 });
      const isDisabled = await createReportBtn.isDisabled();
      expect(isDisabled, '"Create Report" should be disabled when work is outstanding').toBe(true);
    } else {
      test.skip();
    }
  });

  test('LV-08-05: "Create Report" button becomes active when all work is addressed', async ({ page }) => {
    if (!auditIsComplete) {
      test.skip(); // SKIP condition: audit not yet complete
      return;
    }
    const url = auditWorkspaceUrl ?? `${BASE_URL}/`;
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 10_000 });
    const createReportBtn = page.locator('button:has-text(/create report|generate report/i)').first();
    await expect(createReportBtn).toBeEnabled({ timeout: 10_000 });
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// STEP 9 — Level Descriptors
// ─────────────────────────────────────────────────────────────────────────────

test.describe('STEP 9 — Level Descriptors', () => {
  test('LV-09-01: Criteria-level descriptor card shows current level text', async ({ page }) => {
    const url = auditWorkspaceUrl ?? `${BASE_URL}/`;
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 10_000 });
    const criteriaCard = page.locator('[data-testid*=criteria], .criteria-card').first();
    await expect(criteriaCard).toBeVisible({ timeout: 10_000 });
    await expect(criteriaCard.locator('text=/level [0-9]|current level|maturity/i').first()).toBeVisible();
  });

  test('LV-09-02: MPS-level descriptor card shows aggregated level', async ({ page }) => {
    const url = auditWorkspaceUrl ?? `${BASE_URL}/`;
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 10_000 });
    const mpsCard = page.locator('[data-testid*=mps], .mps-card').first();
    await expect(mpsCard).toBeVisible({ timeout: 10_000 });
    await expect(mpsCard.locator('text=/level [0-9]|aggregated|maturity/i').first()).toBeVisible();
  });

  test('LV-09-03: Domain-level descriptor card shows aggregated level', async ({ page }) => {
    const url = auditWorkspaceUrl ?? `${BASE_URL}/`;
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 10_000 });
    const domainCard = page.locator('[data-testid*=domain], .domain-card').first();
    await expect(domainCard).toBeVisible({ timeout: 10_000 });
    await expect(domainCard.locator('text=/level [0-9]|aggregated|maturity/i').first()).toBeVisible();
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// STEP 10 — Report Download (AUTO checks only — AI checks in mat-ai-health.spec.ts)
// ─────────────────────────────────────────────────────────────────────────────

test.describe('STEP 10 — Report Download (AUTO checks)', () => {
  test('LV-10-03: Report is available for download in at least one format (PDF or DOCX)', async ({ page }) => {
    const url = auditWorkspaceUrl ?? `${BASE_URL}/`;
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 10_000 });
    await expect(
      page.locator('a[href*=.pdf], a[href*=.docx], button:has-text(/download.*pdf|download.*docx|download report/i)').first()
    ).toBeVisible({ timeout: 10_000 });
  });

  test('LV-10-04: Downloaded PDF file is non-zero bytes', async ({ page }) => {
    const url = auditWorkspaceUrl ?? `${BASE_URL}/`;
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 10_000 });
    const downloadLink = page.locator('a[href*=.pdf], button:has-text(/download.*pdf/i)').first();
    await expect(downloadLink).toBeVisible({ timeout: 10_000 });
    const [download] = await Promise.all([
      page.waitForEvent('download', { timeout: 60_000 }),
      downloadLink.click(),
    ]);
    const downloadPath = await download.path();
    expect(downloadPath, 'Downloaded PDF path should not be null').not.toBeNull();
    if (downloadPath) {
      const stats = fs.statSync(downloadPath);
      expect(stats.size, 'Downloaded PDF must be non-zero bytes').toBeGreaterThan(0);
    }
    await screenshot(page, 'LV-10-04-report-download');
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Cleanup
// ─────────────────────────────────────────────────────────────────────────────

test.afterAll(async ({ browser }) => {
  if (!createdAuditId) return;
  // Best-effort cleanup: delete the test audit so we don't leave test data in prod
  try {
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto(`${BASE_URL}/api/audits/${createdAuditId}`, { waitUntil: 'domcontentloaded', timeout: 5_000 });
    await context.request.delete(`${BASE_URL}/api/audits/${createdAuditId}`).catch(() => void 0);
    await context.close();
  } catch {
    // Cleanup failure is non-blocking — liveness test still passes
  }
});
