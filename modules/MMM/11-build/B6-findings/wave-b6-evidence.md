# Wave B6 Evidence — Findings & Reporting

**Wave Slug**: mmm-build-wave-b6-findings  
**Issue**: maturion-isms#1428  
**Builder**: ui-builder  
**Date**: 2026-04-22  
**Status**: ✅ COMPLETE

---

## Files Created

### Edge Functions (3)
| Function | Path | JWT Required |
|---|---|---|
| `mmm-pit-export-send` | `supabase/functions/mmm-pit-export-send/index.ts` | Yes (ADMIN or FRAMEWORK_OWNER) |
| `mmm-pit-evidence-return` | `supabase/functions/mmm-pit-evidence-return/index.ts` | No (service role) |
| `mmm-ai-recommend` | `supabase/functions/mmm-ai-recommend/index.ts` | Yes — AIMC stub |

### React Pages (4)
| File | Purpose |
|---|---|
| `apps/mmm/src/pages/FindingsPage.tsx` | J-12, FR-044–046: Findings list |
| `apps/mmm/src/pages/ReportPage.tsx` | J-13, FR-047–048: Domain scores + PDF export |
| `apps/mmm/src/pages/DashboardPage.tsx` | J-14, FR-050–052, TR-005: Pipeline + 7-day trend |
| `apps/mmm/src/pages/PitExportPage.tsx` | J-15, FR-049, TR-016–018: 7-step PIT handshake |

---

## Test Results

**Config**: `vitest.mmm-b6.config.ts`  
**Test File**: `modules/MMM/tests/B6-findings/b6-findings.test.ts`  
**Test IDs**: T-MMM-S6-081–T-MMM-S6-097

| Result | Count |
|---|---|
| ✅ PASSED | 47 |
| ❌ FAILED | 0 |
| ⏭️ SKIPPED | 0 |

**Exit Code**: 0 (100% GREEN)

---

## NBR Compliance

### NBR-001 (UI Cache Invalidation)
- ✅ `PitExportPage.tsx`: invalidates `['pit-exports', exportId]` on successful send
- ✅ `mmm-pit-export-send`: `// NBR-001: UI must invalidate ['pit-exports', id]`

### NBR-002 (JWT/Role Enforcement)
- ✅ `mmm-pit-export-send`: Requires ADMIN or FRAMEWORK_OWNER role
- ✅ Returns HTTP 403 if role check fails
- ✅ Returns HTTP 403 if `exportRecord.organisation_id !== claims.orgId`
- ✅ `mmm-ai-recommend`: JWT required via `validateJWT`

### NBR-003
- N/A for B6

---

## Architecture Compliance

### TR-016 PIT 7-Step Handshake
- ✅ Step 1: Validate export record in `mmm_pit_exports`
- ✅ Step 2: Serialize findings to TR-016 payload format (criterion_code, maturity_position, gap_to_next, finding_text)
- ✅ Step 3: Sign payload (stub — cryptographic signing in B7)
- ✅ Step 4: POST to stub PIT endpoint (mock ack)
- ✅ Step 5: Record `pit_task_id`
- ✅ Step 6: Set `status='SENT'`, `sent_at=now()`
- ✅ Step 7: Log `PIT_EXPORT_SENT` to `mmm_audit_logs`

### TR-005 Dashboard Performance
- ✅ `DashboardPage.tsx` uses `staleTime: 30_000` on the dashboard query
- ✅ Comment: `// TR-005: cache for dashboard render performance`

### AIMC Stubs (B7 placeholder)
- ✅ `mmm-ai-recommend`: Returns 5 domain mock recommendations with `domain`, `gap_to_next`, `recommendation_text`
- ✅ AIMC_BASE_URL comment present — wired in B7

---

## Wave Closure Declaration

Wave B6 (Findings & Reporting) is COMPLETE.

All 3 Edge Functions created, 4 React pages implemented with full NBR compliance. TR-016 7-step PIT handshake implemented as stub. TR-005 dashboard caching implemented. All 47 tests (T-MMM-S6-081–097) GREEN with 0 failures.

**CONTROL_MAPPING**: All B6 deliverables mapped to `modules/MMM/04-architecture/CONTROL_MAPPING.md`. PIT export (TR-016), audit logging, AIMC recommend stubs, and dashboard QIW status all traced to architectural control requirements.
