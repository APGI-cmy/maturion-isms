# Combined Wave Testing (CWT) — Waves 0–4

**CWT ID**: CWT-W0-W4
**Date**: 2026-02-15
**Author**: foreman-isms
**Type**: CWT — Mandatory before IBWR (Wave 4 → Wave 5 gate)
**Authority**: `governance/canon/COMBINED_TESTING_PATTERN.md` v1.0.0 § 5.4
**Module**: mat

---

## 1. Purpose

This CWT validates cross-wave integration for Waves 0–4 — the complete audit lifecycle from creation through scoring to dashboard display and report generation. This is mandatory before IBWR completion per COMBINED_TESTING_PATTERN.md § 5.4.

**CWT Scope** (per Implementation Plan § 4.2):
> "Waves 0–4: All data flows rendered in dashboards + reports. Dashboard and report accuracy against stored audit data."

---

## 2. CWT Test Scenarios

### Scenario 1: Wave 0 → Wave 1 — Database Schema Supports Criteria Upload and Parsing

**Validates**: RLS policies (Wave 0) correctly enforce access control for criteria CRUD operations (Wave 1).

**Test Evidence**:
- ✅ MAT-T-0043 (RBAC Enforcement) — Roles and permissions correctly applied
- ✅ MAT-T-0044 (Permission Inheritance) — Role hierarchy enforced
- ✅ MAT-T-0051 (Row-Level Security Policies) — RLS active on criteria tables
- ✅ MAT-T-0004 (Criteria Document Upload) — Upload respects RLS
- ✅ MAT-T-0005 (AI Criteria Parsing) — Parsed criteria stored with correct ownership
- ✅ MAT-T-0008 (Human Approval of Parsed Criteria) — Approval flow uses role hierarchy
- ✅ MAT-T-0001 (Audit Creation) — Audit entity created with correct status
- ✅ MAT-T-0045 (Auditor Assignment Flow) — Assignment uses RBAC

**Result**: ✅ **PASS** — Wave 0 schema/RLS correctly supports Wave 1 criteria management.

### Scenario 2: Wave 1 → Wave 2 — Parsed Criteria Integrate with Evidence Collection

**Validates**: Criteria entities created in Wave 1 can be linked to evidence collected in Wave 2.

**Test Evidence**:
- ✅ MAT-T-0009 (Criteria Numbering Immutability) — Criteria IDs stable for linking
- ✅ MAT-T-0054 (Criterion Status Tracking) — Status transitions support evidence workflow
- ✅ MAT-T-0013 (Evidence Collection — Text and Document) — Evidence links to criteria
- ✅ MAT-T-0014 (Evidence Collection — Voice Recording) — Audio evidence linked
- ✅ MAT-T-0015 (Evidence Collection — Photo Capture) — Photo evidence linked
- ✅ MAT-T-0018 (Evidence Integrity Verification) — SHA-256 hash integrity validated
- ✅ MAT-T-0021 (Audit-Level Interview) — Interview evidence linked to audit
- ✅ MAT-T-0056 (PIT Module Integration Export) — Export includes criteria+evidence

**Result**: ✅ **PASS** — Wave 1 criteria integrate with Wave 2 evidence collection.

### Scenario 3: Wave 2 → Wave 3 — Evidence Feeds AI Scoring Engine

**Validates**: Evidence collected in Wave 2 feeds the AI scoring engine (Wave 3) with correct data structures.

**Test Evidence**:
- ✅ MAT-T-0022 (Interview Governance) — Evidence governance rules enforced before scoring
- ✅ MAT-T-0078 (Upload Failure and Retry) — Retry logic ensures evidence availability
- ✅ MAT-T-0023 (AI Maturity Scoring) — Scoring uses evidence as input
- ✅ MAT-T-0024 (Evidence-First Scoring Rule) — Scoring blocked without evidence
- ✅ MAT-T-0025 (Human Score Confirmation) — Human confirmation required for AI scores
- ✅ MAT-T-0026 (Override Logging) — Score overrides logged with justification
- ✅ MAT-T-0027 (Maturity Model 5-Level) — Model levels consistent with evidence grading
- ✅ MAT-T-0030 (AI Confidence Flagging) — Low confidence triggers human review

**Result**: ✅ **PASS** — Wave 2 evidence correctly feeds Wave 3 AI scoring.

### Scenario 4: Wave 3 → Wave 4 — Confirmed Scores Render in Dashboards + Reports

**Validates**: Confirmed scores from Wave 3 (human confirmation) are correctly rendered in Wave 4 dashboards and reports.

**Test Evidence**:
- ✅ MAT-T-0039 (Global Dashboard) — Dashboard shows aggregate metrics from confirmed scores
- ✅ MAT-T-0040 (Domain Dashboard) — Domain drill-down shows per-domain scores
- ✅ MAT-T-0041 (MPS Dashboard) — MPS drill-down shows per-criterion detail
- ✅ MAT-T-0042 (Maturity Distribution Visualization) — Distribution chart data correct
- ✅ MAT-T-0035 (Report Generation) — Report generated from confirmed scores
- ✅ MAT-T-0036 (Report Formats DOCX/PDF/JSON) — All formats contain correct data
- ✅ MAT-T-0037 (Excel Export) — Excel rows match confirmation data
- ✅ MAT-T-0098 (Dashboard Realtime Update Wiring) — Real-time subscription active

**Data Flow Validation**:
1. Human confirmation (`confirmScore()`) → `HumanScoreConfirmation` record
2. Same record → `generateDashboardMetrics()` → correct aggregate metrics
3. Same record → `generateDomainDrilldown()` → correct per-domain breakdown
4. Same record → `generateReport()` → correct report sections
5. Same record → `generateExcelExport()` → correct Excel rows
6. Real-time subscription → `subscribeToDashboardUpdates()` → data refresh trigger

**Result**: ✅ **PASS** — Wave 3 confirmed scores correctly render in Wave 4 dashboards and reports.

### Scenario 5: Waves 0–4 Combined — End-to-End Audit Lifecycle

**Validates**: Complete data flow from audit creation through dashboards and reports.

**Test Evidence (end-to-end chain)**:
1. ✅ MAT-T-0001 (Audit Creation) → Audit created with `not_started` status
2. ✅ MAT-T-0002 (Audit Status Lifecycle) → Status transitions enforced
3. ✅ MAT-T-0004 (Criteria Document Upload) → Criteria document uploaded
4. ✅ MAT-T-0005 (AI Criteria Parsing) → AI parses criteria
5. ✅ MAT-T-0008 (Human Approval) → Human approves parsed criteria
6. ✅ MAT-T-0013 (Evidence Collection) → Evidence attached to criteria
7. ✅ MAT-T-0018 (Integrity Verification) → Evidence integrity verified
8. ✅ MAT-T-0023 (AI Maturity Scoring) → AI generates maturity score
9. ✅ MAT-T-0024 (Evidence-First Rule) → Scoring requires evidence
10. ✅ MAT-T-0025 (Human Confirmation) → Human confirms AI score
11. ✅ MAT-T-0026 (Override Logging) → Override logged if human disagrees
12. ✅ MAT-T-0039 (Global Dashboard) → Dashboard displays aggregated results
13. ✅ MAT-T-0040 (Domain Dashboard) → Domain drill-down functional
14. ✅ MAT-T-0042 (Maturity Distribution) → Distribution visualization correct
15. ✅ MAT-T-0035 (Report Generation) → Report generated from confirmed scores
16. ✅ MAT-T-0037 (Excel Export) → Excel review table exported
17. ✅ MAT-T-0098 (Realtime Wiring) → Real-time subscription active

**Result**: ✅ **PASS** — Complete end-to-end flow validated including Wave 4 dashboards and reports.

### Scenario 6: Cross-Cutting Concerns — Offline Sync + Security + Real-Time

**Validates**: Offline sync, security, and real-time updates work correctly across all waves.

**Test Evidence**:
- ✅ MAT-T-0047 (Offline Evidence Capture) — Evidence captured offline respects RLS on sync
- ✅ MAT-T-0048 (Auto Sync on Reconnect) — Synced data maintains integrity
- ✅ MAT-T-0064 (PWA Support) — PWA manifest and service worker operational
- ✅ MAT-T-0052 (Audit Trail Immutability) — Audit trail maintained across sync
- ✅ MAT-T-0053 (Data Encryption) — Encryption active for offline + online data
- ✅ MAT-T-0076 (Circuit Breaker) — AI service failure handled gracefully
- ✅ MAT-T-0077 (Manual Scoring Fallback) — Manual scoring available when AI unavailable
- ✅ MAT-T-0098 (Dashboard Realtime) — Real-time updates via Supabase Realtime
- ✅ MAT-T-0061 (Responsive Desktop) — Desktop layout renders correctly
- ✅ MAT-T-0062 (Responsive Tablet) — Tablet layout renders correctly
- ✅ MAT-T-0063 (Responsive Mobile) — Mobile layout renders correctly
- ✅ MAT-T-0065 (Accessibility WCAG 2.1 AA) — WCAG compliance validated
- ✅ MAT-T-0066 (Internationalization) — EN/AF translations complete

**Result**: ✅ **PASS** — Cross-cutting concerns integrate correctly across Waves 0–4.

---

## 3. Test Count Reconciliation

```
Wave 0: 31 tests GREEN (Schema, RLS, Auth, Core API)
Wave 1: 10 tests GREEN (Criteria Management)
Wave 2: 20 tests GREEN (Evidence Collection, Offline Sync)
Wave 3: 15 tests GREEN (AI Scoring, Human Confirmation)
Wave 4:  9 tests GREEN (Dashboards, Responsive, WCAG, i18n, Realtime Wiring)
---------------------------------------------------------
Total:  85 tests GREEN (verified via `npx vitest run`)

RED tests: 13 (expected — Waves 5–6 scope)
Total test suite: 98 tests
```

**Wave 4 Tests Turned GREEN (9 tests)**:
- MAT-T-0040: Domain Dashboard
- MAT-T-0041: MPS Dashboard
- MAT-T-0042: Maturity Distribution Visualization
- MAT-T-0061: Responsive Design — Desktop
- MAT-T-0062: Responsive Design — Tablet
- MAT-T-0063: Responsive Design — Mobile
- MAT-T-0065: Accessibility (WCAG 2.1 AA)
- MAT-T-0066: Internationalization (i18n)
- MAT-T-0098: Dashboard Realtime Update Wiring

**Verification**: `npx vitest run` confirms 85 passed, 13 failed (all NOT_IMPLEMENTED tests for Waves 5–6).

---

## 4. Integration Failures Found

**None.** All 6 CWT scenarios passed. No cross-wave integration issues detected.

---

## 5. CWT Verdict

| Scenario | Description | Result |
|----------|-------------|--------|
| 1 | Wave 0 → Wave 1: Schema supports criteria | ✅ PASS |
| 2 | Wave 1 → Wave 2: Criteria integrate with evidence | ✅ PASS |
| 3 | Wave 2 → Wave 3: Evidence feeds AI scoring | ✅ PASS |
| 4 | Wave 3 → Wave 4: Scores render in dashboards + reports | ✅ PASS |
| 5 | Waves 0–4: End-to-end audit lifecycle | ✅ PASS |
| 6 | Cross-cutting: Offline + Security + Real-Time | ✅ PASS |

**Overall CWT Verdict**: ✅ **PASS** — All cross-wave integration scenarios validated. No integration failures. Test count reconciled (85 GREEN = 31 + 10 + 20 + 15 + 9).

---

**Authority**: `governance/canon/COMBINED_TESTING_PATTERN.md` v1.0.0 § 5.4
**CWT Status**: ✅ FINAL
**Filed**: 2026-02-15
