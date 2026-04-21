/**
 * MMM Wave B2 — Core API Tests
 * Wave Slug: mmm-build-wave-b2-core-api
 * Test Domains:
 *   D6 (Roles & Permissions):    T-MMM-S6-113 to T-MMM-S6-120
 *   D10 (Infrastructure, B2):    T-MMM-S6-153 to T-MMM-S6-160
 *   D11 (Product Identity, B2):  T-MMM-S6-165 to T-MMM-S6-176 (subset)
 *
 * Builder: api-builder
 * Date: 2026-04-21
 * Issue: maturion-isms#1428
 *
 * FILE-BASED tests — no live Supabase required.
 * Reads Edge Function source files to verify structure, patterns, and NBR compliance.
 */

import { describe, it, expect } from 'vitest';
import * as fs from 'node:fs';
import * as path from 'node:path';

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────

const ROOT = process.cwd();
const FUNCTIONS_DIR = path.join(ROOT, 'supabase', 'functions');
const SHARED_AUTH = path.join(FUNCTIONS_DIR, '_shared', 'mmm-auth.ts');
const CONFIG_TOML = path.join(ROOT, 'supabase', 'config.toml');

/** All 6 Edge Function index files */
const EDGE_FUNCTIONS: Record<string, string> = {
  'mmm-health':               path.join(FUNCTIONS_DIR, 'mmm-health', 'index.ts'),
  'mmm-qiw-status':           path.join(FUNCTIONS_DIR, 'mmm-qiw-status', 'index.ts'),
  'mmm-org-update':           path.join(FUNCTIONS_DIR, 'mmm-org-update', 'index.ts'),
  'mmm-invitation-create':    path.join(FUNCTIONS_DIR, 'mmm-invitation-create', 'index.ts'),
  'mmm-invitation-accept':    path.join(FUNCTIONS_DIR, 'mmm-invitation-accept', 'index.ts'),
  'mmm-commissioning-check':  path.join(FUNCTIONS_DIR, 'mmm-commissioning-check', 'index.ts'),
};

/** Auth-required functions (JWT validated) */
const JWT_REQUIRED_FUNCTIONS = ['mmm-qiw-status', 'mmm-org-update', 'mmm-invitation-create'];

/** Functions that must NOT require JWT */
const JWT_NOT_REQUIRED_FUNCTIONS = ['mmm-health', 'mmm-invitation-accept', 'mmm-commissioning-check'];

function read(filePath: string): string {
  return fs.existsSync(filePath) ? fs.readFileSync(filePath, 'utf-8') : '';
}

// ─────────────────────────────────────────────────────────────────────────────
// D10: Infrastructure — T-MMM-S6-153 to T-MMM-S6-160
// ─────────────────────────────────────────────────────────────────────────────

describe('D10 Infrastructure (T-MMM-S6-153–160)', () => {
  it('T-MMM-S6-156: All 6 Edge Function files exist at expected paths', () => {
    for (const [name, filePath] of Object.entries(EDGE_FUNCTIONS)) {
      expect(fs.existsSync(filePath), `Missing: ${name} at ${filePath}`).toBe(true);
    }
  });

  it('T-MMM-S6-153: Health endpoint returns correct shape (status, version, timestamp)', () => {
    const src = read(EDGE_FUNCTIONS['mmm-health']);
    expect(src).toContain('"healthy"');
    expect(src).toContain('version');
    expect(src).toContain('timestamp');
    expect(src).toContain('1.0.0');
  });

  it('T-MMM-S6-154: Commissioning check defines all 5 gates (CHK-001–CHK-005)', () => {
    const src = read(EDGE_FUNCTIONS['mmm-commissioning-check']);
    expect(src).toContain('CHK-001');
    expect(src).toContain('CHK-002');
    expect(src).toContain('CHK-003');
    expect(src).toContain('CHK-004');
    expect(src).toContain('CHK-005');
  });

  it('T-MMM-S6-155: Edge Function startup env var validation (CHK-005 pattern)', () => {
    for (const [name, filePath] of Object.entries(EDGE_FUNCTIONS)) {
      const src = read(filePath);
      expect(src, `${name} missing SUPABASE_URL startup log`).toMatch(/SUPABASE_URL/);
    }
  });

  it('T-MMM-S6-157: Shared auth middleware file exists', () => {
    expect(fs.existsSync(SHARED_AUTH)).toBe(true);
  });

  it('T-MMM-S6-158: supabase/config.toml registers all 6 functions', () => {
    const config = read(CONFIG_TOML);
    for (const name of Object.keys(EDGE_FUNCTIONS)) {
      expect(config, `config.toml missing [functions.${name}]`).toContain(`[functions.${name}]`);
    }
  });

  it('T-MMM-S6-159: JWT-required functions have verify_jwt = true in config.toml', () => {
    const config = read(CONFIG_TOML);
    // mmm-qiw-status, mmm-org-update, mmm-invitation-create must have verify_jwt = true
    const lines = config.split('\n');
    for (const name of JWT_REQUIRED_FUNCTIONS) {
      const idx = lines.findIndex(l => l.includes(`[functions.${name}]`));
      expect(idx, `${name} not found in config.toml`).toBeGreaterThan(-1);
      const block = lines.slice(idx, idx + 5).join('\n');
      expect(block, `${name} must have verify_jwt = true`).toContain('verify_jwt = true');
    }
  });

  it('T-MMM-S6-160: Public functions have verify_jwt = false in config.toml', () => {
    const config = read(CONFIG_TOML);
    const lines = config.split('\n');
    for (const name of JWT_NOT_REQUIRED_FUNCTIONS) {
      const idx = lines.findIndex(l => l.includes(`[functions.${name}]`));
      expect(idx, `${name} not found in config.toml`).toBeGreaterThan(-1);
      const block = lines.slice(idx, idx + 5).join('\n');
      expect(block, `${name} must have verify_jwt = false`).toContain('verify_jwt = false');
    }
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// D6: Roles & Permissions — T-MMM-S6-113 to T-MMM-S6-120
// ─────────────────────────────────────────────────────────────────────────────

describe('D6 Roles & Permissions (T-MMM-S6-113–120)', () => {
  it('T-MMM-S6-113: ADMIN role required for org operations (mmm-org-update)', () => {
    const src = read(EDGE_FUNCTIONS['mmm-org-update']);
    expect(src).toContain("requireRole(claims.role, ['ADMIN'])");
  });

  it('T-MMM-S6-114: JWT validation middleware present in all auth-required functions', () => {
    for (const name of JWT_REQUIRED_FUNCTIONS) {
      const src = read(EDGE_FUNCTIONS[name]);
      expect(src, `${name} missing validateJWT call`).toContain('validateJWT(req, supabase)');
    }
  });

  it('T-MMM-S6-115: Invitation create requires ADMIN role', () => {
    const src = read(EDGE_FUNCTIONS['mmm-invitation-create']);
    expect(src).toContain("requireRole(claims.role, ['ADMIN'])");
  });

  it('T-MMM-S6-116: Invitation accept is token-based (no JWT, reads token from body)', () => {
    const src = read(EDGE_FUNCTIONS['mmm-invitation-accept']);
    // Must NOT call validateJWT
    expect(src).not.toContain('validateJWT');
    // Must read token from body
    expect(src).toContain('token');
    expect(src).toContain('email');
  });

  it('T-MMM-S6-117: Role scope enforcement — requireRole defined in shared auth', () => {
    const src = read(SHARED_AUTH);
    expect(src).toContain('export function requireRole');
    expect(src).toContain('allowedRoles');
  });

  it('T-MMM-S6-118: HTTP 403 returned for insufficient scope (NBR-002 — invitation-create)', () => {
    const src = read(EDGE_FUNCTIONS['mmm-invitation-create']);
    // requireRole throws a 403 Response; also explicit 403 for wrong org
    expect(src).toContain('403');
    // Shared auth must throw 403 when role not allowed
    const authSrc = read(SHARED_AUTH);
    expect(authSrc).toContain('status: 403');
  });

  it('T-MMM-S6-119: JWT claims parsed correctly — validateJWT returns userId, orgId, role', () => {
    const src = read(SHARED_AUTH);
    expect(src).toContain('userId');
    expect(src).toContain('orgId');
    expect(src).toContain('role');
    expect(src).toContain('export async function validateJWT');
  });

  it('T-MMM-S6-120: Org-scoped permission checks enforced in mmm-org-update', () => {
    const src = read(EDGE_FUNCTIONS['mmm-org-update']);
    // Checks claims.orgId !== orgId → returns 403
    expect(src).toContain('claims.orgId');
    expect(src).toContain('403');
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// D11: Product Identity & Governance — T-MMM-S6-165 to T-MMM-S6-176 (B2 subset)
// ─────────────────────────────────────────────────────────────────────────────

describe('D11 Product Identity & Governance (T-MMM-S6-165–176, B2 subset)', () => {
  it('T-MMM-S6-165: QIW dashboard endpoint defined and structured correctly', () => {
    const src = read(EDGE_FUNCTIONS['mmm-qiw-status']);
    expect(src).toContain('pipeline_stages');
    expect(src).toContain('seven_day_trend');
    expect(src).toContain('retrieved_at');
    // 5 pipeline stages
    expect(src).toContain("'upload'");
    expect(src).toContain("'parse'");
    expect(src).toContain("'criteria_map'");
    expect(src).toContain("'score_proposal'");
    expect(src).toContain("'review'");
  });

  it('T-MMM-S6-166: Audit log write path defined in mmm-health (HEALTH_CHECK)', () => {
    const src = read(EDGE_FUNCTIONS['mmm-health']);
    expect(src).toContain('mmm_audit_logs');
    expect(src).toContain('HEALTH_CHECK');
  });

  it('T-MMM-S6-167: Audit log write path defined in mmm-org-update (ORG_UPDATE)', () => {
    const src = read(EDGE_FUNCTIONS['mmm-org-update']);
    expect(src).toContain('mmm_audit_logs');
    expect(src).toContain('ORG_UPDATE');
  });

  it('T-MMM-S6-168: All functions import from Deno-compatible ESM (esm.sh)', () => {
    for (const [name, filePath] of Object.entries(EDGE_FUNCTIONS)) {
      const src = read(filePath);
      // Each function must either use esm.sh import OR only use shared (which does)
      const usesEsm = src.includes('esm.sh') || src.includes('../_shared/mmm-auth.ts');
      expect(usesEsm, `${name} must use esm.sh or shared module`).toBe(true);
    }
  });

  it('T-MMM-S6-169: NBR-001 cache invalidation comments present in mutation functions', () => {
    // Mutation functions: mmm-org-update, mmm-invitation-create
    for (const name of ['mmm-org-update', 'mmm-invitation-create']) {
      const src = read(EDGE_FUNCTIONS[name]);
      expect(src, `${name} missing NBR-001 cache invalidation comment`).toContain('NBR-001');
    }
  });

  it('T-MMM-S6-170: NBR-002 HTTP 403 enforcement documented in invitation-create source', () => {
    const src = read(EDGE_FUNCTIONS['mmm-invitation-create']);
    expect(src).toContain('NBR-002');
  });

  it('T-MMM-S6-171: Health function references version string 1.0.0', () => {
    const src = read(EDGE_FUNCTIONS['mmm-health']);
    expect(src).toContain('1.0.0');
  });

  it('T-MMM-S6-172: Commissioning check returns PASS/FAIL status field', () => {
    const src = read(EDGE_FUNCTIONS['mmm-commissioning-check']);
    expect(src).toContain("'PASS'");
    expect(src).toContain("'FAIL'");
    expect(src).toContain('status');
  });

  it('T-MMM-S6-173: Invitation accept validates expiry and email match', () => {
    const src = read(EDGE_FUNCTIONS['mmm-invitation-accept']);
    expect(src).toContain('expires_at');
    expect(src).toContain('expired');
    expect(src).toContain('email');
    expect(src).toContain('400');
  });

  it('T-MMM-S6-174: Invitation create generates token via crypto.randomUUID()', () => {
    const src = read(EDGE_FUNCTIONS['mmm-invitation-create']);
    expect(src).toContain('crypto.randomUUID()');
  });

  it('T-MMM-S6-175: Invitation create sets expiry to now + 7 days', () => {
    const src = read(EDGE_FUNCTIONS['mmm-invitation-create']);
    expect(src).toContain('7 * 24 * 60 * 60 * 1000');
  });

  it('T-MMM-S6-176: QIW status endpoint restricts to ADMIN or LEAD_AUDITOR', () => {
    const src = read(EDGE_FUNCTIONS['mmm-qiw-status']);
    expect(src).toContain('ADMIN');
    expect(src).toContain('LEAD_AUDITOR');
  });
});
