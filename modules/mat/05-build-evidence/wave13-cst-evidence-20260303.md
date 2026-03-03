# Wave 13 CST Evidence — Combined Subwave Testing
**Date**: 2026-03-03
**Session**: session-093
**Branch**: copilot/execute-wave-13-testing
**Issue Reference**: #849
**CS2 Authorization**: Issue #849 opened by @APGI-cmy
**Executed By**: qa-builder (supervised by foreman-v2-agent)

---

## Pre-CST: CI Fix Applied

**Merge Conflict Resolution** (blocking action prior to test execution):

| File | Conflict | Resolution |
|------|----------|------------|
| `/package.json` | `<<<<<<< HEAD` marker in devDependencies | HEAD version retained: `@types/node ^22.0.0`, `typescript ^5.3.3` |
| `/packages/ai-centre/package.json` | `<<<<<<< HEAD` marker in devDependencies | HEAD version retained: `@types/node ^22.19.11` |
| `/packages/ai-centre/src/__tests__/personas/PersonaLoader.test.ts` | `<<<<<<< HEAD` duplicate test comment block | HEAD version retained (includes CL-1-T-002 doc comment) |

All conflicts resolved by keeping HEAD (main branch) values. Resolved devDependencies in `package.json`:
```json
"devDependencies": {
    "@types/node": "^22.0.0",
    "typescript": "^5.3.3",
    "vitest": "^3.0.0"
}
```

**Post-fix install**: `pnpm install` completed successfully (vitest 3.2.4 installed).

---

## CST Execution

**Command**: `npx vitest run --reporter=verbose` (run from repo root)
**Start**: 10:46:00
**Duration**: 7.72s
**Test files**: 63 total (3 failed files, 60 passed)

---

## CST Checkpoint 1: Schema → Auth Integration (T-W13-SCH + T-W13-AUTH)

**Scope**: Validates that auth session wiring implementation is in place and correct.

| Test ID | Test Name | Result | Notes |
|---------|-----------|--------|-------|
| T-W13-AUTH-1 | getAuthenticatedClient is exported from lib/supabase.ts | ✅ PASS | Function export verified in supabase.ts |
| T-W13-AUTH-2 | getSessionToken is exported from lib/supabase.ts | ✅ PASS | Function export verified in supabase.ts |
| T-W13-AUTH-3 | lib/api/audits.ts exists and exports createAudit with auth header | ✅ PASS | createAudit with getAuthenticatedClient/getSessionToken verified |
| T-W13-AUTH-4 | lib/api/profile.ts exists and exports updateProfile with auth header | ✅ PASS | updateProfile with auth wiring verified |
| T-W13-SCH-1 | public.audits table exists in production schema | 🔴 EXPECTED RED | No production Supabase access in CI (by design) |
| T-W13-SCH-2 | public.criteria table exists in production schema | 🔴 EXPECTED RED | No production Supabase access in CI (by design) |
| T-W13-SCH-3 | public.domains table exists in production schema | 🔴 EXPECTED RED | No production Supabase access in CI (by design) |
| T-W13-SCH-4 | VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY env vars are set | 🔴 EXPECTED RED | No env vars set in CI (production-only, by design) |

**Checkpoint 1 Verdict**: ✅ PASS (CI-testable scope)
- T-W13-AUTH: 4/4 GREEN
- T-W13-SCH: 0/4 GREEN (all 4 are production-only tests, EXPECTED RED in CI)

---

## CST Checkpoint 2: Auth → UI Integration (T-W13-AUTH + T-W13-WIRE)

**Scope**: Validates frontend page wiring from auth session through to UI rendering.

| Test ID | Test Name | Result | Notes |
|---------|-----------|--------|-------|
| T-W13-WIRE-1 | AuditManagement component exists and renders audit-list testid | ✅ PASS | AuditManagement.tsx with data-testid="audit-list" and live Supabase query verified |
| T-W13-WIRE-2 | CriteriaManagement component exists and renders criteria-upload-pane testid | ✅ PASS | CriteriaManagement.tsx with data-testid="criteria-upload-pane" verified; placeholder removed |
| T-W13-WIRE-3 | EvidenceCollection component exists and renders evidence-collection-form testid | ✅ PASS | EvidenceCollection.tsx with data-testid="evidence-collection-form" verified |
| T-W13-WIRE-4 | Scoring component exists and renders scoring-content testid | ✅ PASS | Scoring.tsx with data-testid="scoring-content" verified |
| T-W13-WIRE-5 | Reports component exists and renders reports-content testid | ✅ PASS | Reports.tsx with data-testid="reports-content" verified |
| T-W13-WIRE-6 | Dashboard component exists and renders dashboard-content testid | ✅ PASS | Dashboard.tsx with data-testid="dashboard-content" verified |
| T-W13-WIRE-7 | Settings component exists and exposes language and theme dropdown testids | ❌ FAIL | **Genuine failure**: Settings.tsx has `data-testid` attributes but missing persistence wiring (no localStorage / useProfile / updateProfile) — ui-builder partial implementation |
| T-W13-WIRE-8 | AIChatModal component exists and does not render no-access overlay for authenticated users | ✅ PASS | AIChatModal.tsx with data-testid="ai-chat-input" verified; conditional overlay confirmed |

**Failure Detail for T-W13-WIRE-7**:
```
AssertionError: Settings dropdowns must use localStorage or profile storage to persist state:
  expected Settings component source to match /localStorage|useProfile|updateProfile/
  Actual Settings.tsx contains only stub: <select data-testid="settings-language-dropdown"/> 
  and <select data-testid="settings-theme-dropdown"/> with no persistence logic.
```

**Checkpoint 2 Verdict**: ⚠️ PARTIAL — 7/8 GREEN; T-W13-WIRE-7 genuine FAIL (persistence wiring incomplete)

**Escalation Required**: ui-builder must add localStorage or profile-based persistence to Settings.tsx to turn T-W13-WIRE-7 GREEN.

---

## CST Checkpoint 3: CI Gate Integration (T-W13-CI)

**Scope**: Validates that CI deploy pipeline now has required deployment gate steps.

| Test ID | Test Name | Result | Notes |
|---------|-----------|--------|-------|
| T-W13-CI-1 | CI workflow has schema-verification step | ✅ PASS | `.github/workflows/deploy-mat-vercel.yml` contains 'schema-verification' and 'public.audits' |
| T-W13-CI-2 | CI workflow has env-var-audit step | ✅ PASS | deploy workflow contains 'env-var-audit', 'VITE_SUPABASE_URL', 'VITE_SUPABASE_ANON_KEY' |
| T-W13-CI-3 | CI workflow has post-deploy auth smoke test step | ✅ PASS | deploy workflow contains 'post-deploy-smoke-test' and 'auth-smoke' |

**Checkpoint 3 Verdict**: ✅ PASS — 3/3 GREEN

---

## CST Summary

| Checkpoint | Description | Result | GREEN/Total |
|------------|-------------|--------|-------------|
| CP-1 | Schema → Auth Integration | ✅ PASS (CI scope) | 4/4 (CI-testable) |
| CP-2 | Auth → UI Integration | ⚠️ PARTIAL | 7/8 |
| CP-3 | CI Gate Integration | ✅ PASS | 3/3 |

**Wave 13 File-Based Test Totals**:
- T-W13-AUTH: 4/4 GREEN ✅
- T-W13-WIRE: 7/8 GREEN (1 genuine failure: T-W13-WIRE-7)
- T-W13-CI: 3/3 GREEN ✅
- T-W13-SCH: 0/4 GREEN (4 EXPECTED RED — production-only)
- T-W13-E2E: 0/5 GREEN (5 EXPECTED RED — production-only)

**Overall CST Result**: 14/15 CI-testable file-based tests GREEN

---

## CST Verdict: PARTIAL PASS

**CI-testable functionality**: 14/15 file-based tests GREEN (93.3%)
**Issue**: T-W13-WIRE-7 (Settings persistence) is a genuine failure requiring ui-builder remediation
**Production tests**: 9 tests EXPECTED RED by design (T-W13-SCH-1–4, T-W13-E2E-1–5) — no live deployment/env vars in CI

**Escalation**: Foreman must assign ui-builder to implement localStorage or profile persistence in Settings.tsx before full Wave 13 GREEN status can be achieved for file-based tests.

**Unblocked work**: Auth wiring (T-W13-AUTH-1–4) and CI gates (T-W13-CI-1–3) are fully GREEN and represent complete, tested deliverables.
