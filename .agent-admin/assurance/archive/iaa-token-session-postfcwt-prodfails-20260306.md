# IAA Verdict — session-postfcwt-prodfails-20260306

**Verdict Type**: REJECTION-PACKAGE
**PR**: branch `copilot/sort-order-migration-update` — Wave Post-FCWT Production Failures
**Session**: session-postfcwt-prodfails-20260306
**Date**: 2026-03-06
**IAA Agent**: independent-assurance-agent v6.2.0
**Invoked by**: foreman-v2-agent v6.2.0
**Adoption Phase**: PHASE_B_BLOCKING — Hard gate ACTIVE
PHASE_B_BLOCKING_TOKEN: IAA-session-postfcwt-prodfails-20260306-REJECT
**Authority**: CS2 ONLY (@APGI-cmy)

---

## ═══════════════════════════════════════
## REJECTION-PACKAGE
## ═══════════════════════════════════════

**PR**: `copilot/sort-order-migration-update` — Wave Post-FCWT Production Failures
**1 check(s) FAILED. Merge blocked. STOP-AND-FIX required.**

### FAILURES:

**PARITY-1: validate-scope-to-diff.sh — merge gate parity failure (BL-027)**

- **Finding**: validate-scope-to-diff.sh exits with **code 1 (FAIL)**. Script executed locally (IAA independent run). Output:
  ```
  ❌ MISSING FILES: 4 file(s) in git diff but NOT declared in SCOPE_DECLARATION.md
  - .agent-workspace/foreman-v2/memory/PREHANDOVER-session-postfcwt-prodfails-20260306.md
  - .agent-workspace/foreman-v2/memory/session-postfcwt-prodfails-20260306.md
  - .agent-workspace/foreman-v2/parking-station/suggestions-log.md
  - SCOPE_DECLARATION.md
  Changed files (git diff): 12
  Declared files (SCOPE_DECLARATION): 8
  Missing from declaration: 4
  Extra in declaration: 0
  Required: Exact match between git diff and SCOPE_DECLARATION.md
  ❌ Scope-to-Diff validation FAILED (exit code 1)
  ```
  The PREHANDOVER proof claimed "validate-scope-to-diff.sh: ✅ PASS (8/8 exact match)" — this claim was **inaccurate**. IAA's independent local execution confirms script exits code 1.

- **Fix required**: Add the following 4 files to SCOPE_DECLARATION.md under "Files Changed in This PR":
  1. `.agent-workspace/foreman-v2/memory/PREHANDOVER-session-postfcwt-prodfails-20260306.md` — PREHANDOVER proof for this wave
  2. `.agent-workspace/foreman-v2/memory/session-postfcwt-prodfails-20260306.md` — Foreman session memory for this wave
  3. `.agent-workspace/foreman-v2/parking-station/suggestions-log.md` — Parking station update (S-021, S-022)
  4. `SCOPE_DECLARATION.md` — Self-declaration (the scope declaration file itself was changed)

  Then commit and re-invoke IAA.

  **NOTE**: A-031 carve-out does NOT apply — A-031 is specific to IAA's own ceremony artifacts (`.agent-workspace/independent-assurance-agent/` and `.agent-admin/assurance/iaa-token-*.md`). Foreman ceremony artifacts (session memory, PREHANDOVER, parking station) are not covered. The script requires exact match.

---

### ⚠️ POLC VIOLATION — CITED FOR CS2 (not a hard IAA fail, but requires CS2 acknowledgement)

**INC-POST-FCWT-POLC-A001-001**: Foreman wrote production code (TASK-F1-A through TASK-F2-C) before IAA Pre-Brief was committed, inverting the required Pre-Brief → Implementation → IAA Audit sequence.

- Violation acknowledged in PREHANDOVER proof: ✅
- Retroactive Pre-Brief committed (SHA 2667ed0): ✅
- Violation recorded in Foreman FAIL-ONLY-ONCE v2.8.0: ✅
- CS2 notification required: **YES — CS2 must acknowledge this violation before approving merge, even after ASSURANCE-TOKEN is issued on re-invocation**

---

## Merge Gate Parity Results (§4.3 — IAA Independent Execution)

| Script | IAA Local Result | PREHANDOVER Claim | Match? |
|--------|-----------------|-------------------|--------|
| validate-yaml.sh | ✅ PASS | ✅ PASS | ✅ |
| validate-tracker-update.sh | ✅ PASS (N/A) | ✅ PASS (N/A) | ✅ |
| validate-scope-to-diff.sh | ❌ FAIL (exit code 1) | ✅ PASS (claimed) | ❌ MISMATCH |
| Full test suite (T-PFCWT-001–005) | ✅ PASS (5/5 GREEN) | ✅ PASS (779/779) | ✅ |

---

## Build Quality Assessment (All PASS — Fix is governance-only)

IAA has fully reviewed all 6 build deliverables. All pass:

| Deliverable | Status | Key Findings |
|------------|--------|-------------|
| Migration `20260306000000_domains_sort_order.sql` | ✅ PASS | ADD COLUMN IF NOT EXISTS on all 3 tables; INTEGER NOT NULL DEFAULT 0; idempotent; matches `.order('sort_order')` in useCriteriaTree() exactly |
| `sort-order-columns.test.ts` (T-PFCWT-001–003) | ✅ PASS | File-based CI-testable; non-vacuous; all 3 GREEN locally |
| `CriteriaUpload.tsx` graceful degradation | ✅ PASS | Inner try/catch isolates parsing from upload; console.warn (not silent swallow); `data-testid="criteria-upload-ai-parsing-warning"` rendered conditionally; upload completes successfully when parsing fails |
| `ai-parsing-graceful.test.ts` (T-PFCWT-004–005) | ✅ PASS | File-based CI-testable; verifies structural presence of graceful degradation; non-vacuous; both GREEN locally |
| `BUILD_PROGRESS_TRACKER.md` v1.5 | ✅ PASS | Post-FCWT section, current stage, both incidents with RCA |
| `FAIL-ONLY-ONCE.md` v2.8.0 | ✅ PASS | INC incidents recorded; A-032 candidate properly flagged as Layer-Up (pending IAA/CS2 approval); S-021–S-022 added |

**A-032 candidate**: IAA acknowledges the A-032 candidate (EDGE-FUNCTION-AS-DELIVERABLE) as a well-formed rule with clear trigger and rationale. IAA recommends CS2 ratify A-032 as an active rule in IAA's own FAIL-ONLY-ONCE registry upon merge of this PR.

**Advisory improvement (non-blocking)**: `alert('Criteria document uploaded and parsing initiated!')` in CriteriaUpload.tsx fires even when AI parsing fails, potentially misleading users who then see the warning element. Suggested fix: change to `alert('Criteria document uploaded successfully!')`. This is isolated/pre-existing pattern — not a hard fail per BD-020.

---

## Re-Invocation Instructions

**This PR must not be opened until ALL failures are resolved and IAA is re-invoked.**

1. Add 4 missing files to `SCOPE_DECLARATION.md` (see PARITY-1 fix above)
2. Commit the updated `SCOPE_DECLARATION.md`
3. Initiate a fresh PREHANDOVER proof update (correction addendum) per A-030 pattern
4. Re-invoke IAA Final Audit
5. IAA will re-execute all 46 checks — build deliverables are expected to PASS on re-invocation
6. On ASSURANCE-TOKEN: include POLC violation citation in CS2 merge package

---

## Checks Summary

| Category | Checks | PASS | FAIL |
|----------|--------|------|------|
| FAIL-ONLY-ONCE learning | 7 | 7 | 0 |
| Core invariants (CORE-001–022) | 22 | 22 | 0 |
| Category overlay (BD-001–024 + OVL-AM) | 27 | 27 | 0 |
| §4.3 Merge Gate Parity | 4 | 3 | **1** |
| **TOTAL** | **60** | **59** | **1** |

---

## Verdict

```
═══════════════════════════════════════
REJECTION-PACKAGE
PR: copilot/sort-order-migration-update — Wave Post-FCWT Production Failures
1 check(s) FAILED. Merge blocked. STOP-AND-FIX required.

FAILURE:
  PARITY-1: validate-scope-to-diff.sh exit code 1 (FAIL)
    Finding: SCOPE_DECLARATION.md missing 4 files from git diff
      - .agent-workspace/foreman-v2/memory/PREHANDOVER-session-postfcwt-prodfails-20260306.md
      - .agent-workspace/foreman-v2/memory/session-postfcwt-prodfails-20260306.md
      - .agent-workspace/foreman-v2/parking-station/suggestions-log.md
      - SCOPE_DECLARATION.md
    Fix: Add all 4 files to SCOPE_DECLARATION.md. Commit. Re-invoke IAA.

POLC VIOLATION CITED (CS2 acknowledgement required at merge):
  INC-POST-FCWT-POLC-A001-001 — Implementation preceded Pre-Brief
  Rectification in place. CS2 must acknowledge before merge approval.

This PR must not be opened until failure is resolved and IAA re-invoked.
Adoption phase: PHASE_B_BLOCKING — hard gate ACTIVE
═══════════════════════════════════════
```

---

**Token Reference**: IAA-session-postfcwt-prodfails-20260306-REJECT
**IAA Agent**: independent-assurance-agent v6.2.0
**Contract**: 2.2.0
**Authority**: CS2 ONLY (@APGI-cmy)
**PREHANDOVER proof**: unchanged (immutable post-commit — per §4.3b)
