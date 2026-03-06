# IAA Pre-Brief — Wave Post-FCWT Production Failures

**Pre-Brief ID**: PREBRIEF-POSTFCWT-PRODFAILS-20260306
**Wave**: Wave Post-FCWT Production Failures — sort_order Migration + Edge Function Gap + BUILD_PROGRESS_TRACKER Update
**Session**: session-postfcwt-prodfails-20260306
**Branch**: `copilot/sort-order-migration-update`
**Issue**: [Foreman] FCWT Production Failures: sort_order Migration + Edge Function Gap + BUILD_PROGRESS_TRACKER Update
**Invocation Mode**: PRE-BRIEF (Phase 0)
**Invoked by**: foreman-v2-agent
**IAA Agent**: independent-assurance-agent
**Date Issued**: 2026-03-06
**Authority**: CS2 (Johan Ras / @APGI-cmy)
**Output Path**: `.agent-admin/assurance/iaa-prebrief-wave-postfcwt-prodfails.md`
**Protocol Reference**: IAA_PRE_BRIEF_PROTOCOL.md v1.1.0 §Trigger

---

## ⚠️ POLC VIOLATION RECORDED

> **Violation Type**: A-001 breach — Direct implementation before IAA Pre-Brief was committed.
>
> **What occurred**: The Foreman (foreman-v2-agent) executed all wave deliverables (TASK-F1-A
> through TASK-F2-C) and committed them to branch `copilot/sort-order-migration-update` before
> this Pre-Brief artifact was authored or committed. This inverts the required sequencing:
> Pre-Brief → Implementation → IAA Final Audit.
>
> **Scope of violation**: All 6 qualifying tasks in this wave (TASK-F1-A, TASK-F1-B, TASK-F2-A,
> TASK-F2-B, TASK-F1-C, TASK-F2-C). All are already on the branch at time of Pre-Brief issuance.
>
> **Acknowledgement**: The Foreman has acknowledged this violation in the wave-current-tasks.md
> and in the invocation context. The violation is attributed to urgency around live production
> failures detected post-FCWT.
>
> **Rectification path**: This Pre-Brief is being issued retroactively per POLC rectification
> protocol. All deliverables already on branch are subject to full IAA Final Audit before
> merge release. No merge is permitted without ASSURANCE-TOKEN. CS2 is to be notified of the
> POLC violation as part of the merge package.
>
> **Violation reference**: INC-POST-FCWT-POLC-A001-001 (for FAIL-ONLY-ONCE registry consideration)
>
> **Impact on Pre-Brief**: The Pre-Brief proceeds as normal — all deliverables exist and can be
> reviewed. The Final Audit will treat this as a retroactive gate. ASSURANCE-TOKEN is not
> diminished but the violation must be cited in session memory.

---

## Wave Source Document

Read from: `.agent-workspace/foreman-v2/personal/wave-current-tasks.md`
Confirmed present: ✅
Wave context extracted: Post-FCWT production failures detected in live testing after
FCWT CI-CERTIFIED PRODUCTION READY declaration (session-144, 2026-03-05).

**Two incident types**:
| Incident ID | Failure | Root Cause Class |
|-------------|---------|-----------------|
| INC-POST-FCWT-SORT-ORDER-001 | `column domains.sort_order does not exist` — useCriteriaTree() calls `.order('sort_order')` but column was never added to schema | Schema-to-hook drift (same class as INC-W14-COL-MAPPING-001) |
| INC-POST-FCWT-EDGE-FN-001 | `Failed to trigger AI parsing: Failed to send a request to the Edge Function` — invoke-ai-parse-criteria Edge Function does not exist | Architecture-to-implementation gap |

---

## Task Classification

### IAA Trigger Table Applied

Source: `.agent-workspace/independent-assurance-agent/knowledge/iaa-trigger-table.md`

| Category | Trigger Criteria |
|----------|-----------------|
| AAWP_MAT | Schema migrations, API endpoints, frontend components, hooks, Supabase operations, test files for MAT module |
| GOVERNANCE_ARTIFACT | BUILD_PROGRESS_TRACKER.md, FAIL-ONLY-ONCE.md, canon files, governed knowledge files |
| EXEMPT | Docs-only (no code), parking station admin, session memory only |

---

### TASK-F1-A — Migration `20260306000000_domains_sort_order.sql`

| Field | Value |
|-------|-------|
| **task_id** | TASK-F1-A |
| **task_summary** | ADD COLUMN sort_order (integer, NOT NULL, DEFAULT 0) to `domains`, `mini_performance_standards`, and `criteria` tables. Fixes INC-POST-FCWT-SORT-ORDER-001: `useCriteriaTree()` calls `.order('sort_order')` on all three tables but columns were missing from live database. |
| **builder** | schema-builder (direct — POLC violation) |
| **artifact** | `apps/maturion-maturity-legacy/supabase/migrations/20260306000000_domains_sort_order.sql` |
| **iaa_trigger_category** | **AAWP_MAT** |
| **qualifying** | ✅ YES — Schema migration for production MAT database. Direct path to live-env failure INC-POST-FCWT-SORT-ORDER-001. |
| **required_phases** | Phase 2 (Alignment), Phase 3 (Assurance), Phase 4 (Merge Gate Parity + Verdict) |
| **required_evidence_artifacts** | (1) Migration SQL file on branch confirming ADD COLUMN syntax for all 3 tables; (2) Test run log showing T-PFCWT-001–003 GREEN after migration (live or mock); (3) Confirmation columns match the `.order('sort_order')` call signature in `useCriteriaTree()` |
| **applicable_overlays** | BUILD_DELIVERABLE: BD-001–BD-024 (full); CORE invariants: CORE-001–CORE-022 |
| **specific_rules** | BD-005 (end-to-end wiring: columns must match hook call); BD-006 (writer path: migration is the writer, `.order()` is the reader — both must be verified); BD-015 (RLS: assess whether sort_order column on existing RLS-enabled tables requires policy updates); BD-008 (FK/relational integrity: integer NOT NULL DEFAULT 0 — no FK, but confirm no constraint violations with existing data in live env) |
| **risk_notes** | Existing live rows in `domains`, `mini_performance_standards`, `criteria` will need DEFAULT 0 applied at migration time. Migration must be idempotent-safe (IF NOT EXISTS or equivalent). Confirm migration is backward-compatible: no existing production data should break. |

---

### TASK-F1-B — Sort-Order Test File `sort-order-columns.test.ts`

| Field | Value |
|-------|-------|
| **task_id** | TASK-F1-B |
| **task_summary** | RED gate tests T-PFCWT-001, T-PFCWT-002, T-PFCWT-003 in `modules/mat/tests/postfcwt/sort-order-columns.test.ts`. Tests verify that `domains`, `mini_performance_standards`, and `criteria` tables accept `sort_order` column without error. |
| **builder** | qa-builder (direct — POLC violation) |
| **artifact** | `modules/mat/tests/postfcwt/sort-order-columns.test.ts` |
| **iaa_trigger_category** | **AAWP_MAT** |
| **qualifying** | ✅ YES — Test files for MAT module covering a production schema change. |
| **required_phases** | Phase 2 (Alignment), Phase 3 (Assurance), Phase 4 (Merge Gate Parity + Verdict) |
| **required_evidence_artifacts** | (1) Test file on branch; (2) Test run evidence showing T-PFCWT-001–003 GREEN; (3) Wave test baseline comparison (pre: 774, post: 779 — net +5 across all TASK-F1-B + TASK-F2-B tests) |
| **applicable_overlays** | BUILD_DELIVERABLE: BD-011 through BD-013; CORE invariants: CORE-001–CORE-022 |
| **specific_rules** | BD-011 (100% test pass rate — all 5 new tests must be GREEN); BD-012 (zero test debt — no `.skip()`, no `test.todo()`); BD-013 (no test dodging — tests must assert on actual schema presence, not vacuous checks); BD-003 (one-time build compliance — tests must run green in CI pipeline without requiring live Supabase) |
| **risk_notes** | If tests require live Supabase connection, they may be EXPECTED RED in CI. Confirm test classification (CI-testable vs live-env-only). If EXPECTED RED in CI, this must be explicitly declared in test file header and excluded from the 774→779 CI count. Pre-brief flags this as a key question for the Final Audit. |

---

### TASK-F2-A — CriteriaUpload.tsx Graceful Degradation

| Field | Value |
|-------|-------|
| **task_id** | TASK-F2-A |
| **task_summary** | Update `CriteriaUpload.tsx`: wrap `triggerParsing()` call in an inner try/catch so AI parsing failures (e.g. missing Edge Function) do not surface as hard errors. Render a `data-testid="criteria-upload-ai-parsing-warning"` warning element (not a blocking error) when parsing fails. Fixes INC-POST-FCWT-EDGE-FN-001 user-facing impact. |
| **builder** | ui-builder (direct — POLC violation) |
| **artifact** | `modules/mat/frontend/src/components/criteria/CriteriaUpload.tsx` |
| **iaa_trigger_category** | **AAWP_MAT** |
| **qualifying** | ✅ YES — Production frontend component change addressing a live-env user-facing failure. |
| **required_phases** | Phase 2 (Alignment), Phase 3 (Assurance), Phase 4 (Merge Gate Parity + Verdict) |
| **required_evidence_artifacts** | (1) `CriteriaUpload.tsx` diff showing inner try/catch wrapping `triggerParsing()`; (2) Warning element with `data-testid="criteria-upload-ai-parsing-warning"` present in diff; (3) Test evidence from TASK-F2-B showing T-PFCWT-004–005 GREEN; (4) Confirm upload workflow is not blocked on parsing failure (primary upload path still succeeds) |
| **applicable_overlays** | BUILD_DELIVERABLE: BD-001–BD-024 (full); CORE invariants: CORE-001–CORE-022 |
| **specific_rules** | BD-002 (no stub/TODO — inner catch must handle the error, not re-throw silently); BD-003 (one-time build compliance — upload must work end-to-end even when Edge Function absent; warning must render but not block); BD-013 (no test dodging — T-PFCWT-004–005 must actually simulate Edge Function failure and assert on warning element); BD-021 (no bare `catch (e) {}` — error must be at minimum logged or surfaced to the warning UI state); BD-020 (clean structure — inner try/catch should not exceed 15 lines or obscure the primary flow) |
| **risk_notes** | The graceful degradation pattern is correct architectural response to INC-POST-FCWT-EDGE-FN-001. However, IAA must confirm: (1) the catch does not silently swallow errors without any user feedback; (2) the warning element is rendered with sufficient context for the user to understand AI parsing was skipped (not just a hidden element); (3) the primary criteria upload path (file parsing, saving to DB) still completes successfully even when AI parsing fails. |

---

### TASK-F2-B — AI Parsing Graceful Test File `ai-parsing-graceful.test.ts`

| Field | Value |
|-------|-------|
| **task_id** | TASK-F2-B |
| **task_summary** | RED gate tests T-PFCWT-004, T-PFCWT-005 in `modules/mat/tests/postfcwt/ai-parsing-graceful.test.ts`. Tests verify that when `triggerParsing()` throws, the upload still succeeds and the warning element is rendered. |
| **builder** | qa-builder (direct — POLC violation) |
| **artifact** | `modules/mat/tests/postfcwt/ai-parsing-graceful.test.ts` |
| **iaa_trigger_category** | **AAWP_MAT** |
| **qualifying** | ✅ YES — Test files for MAT module covering a production frontend graceful-degradation change. |
| **required_phases** | Phase 2 (Alignment), Phase 3 (Assurance), Phase 4 (Merge Gate Parity + Verdict) |
| **required_evidence_artifacts** | (1) Test file on branch; (2) Test run evidence showing T-PFCWT-004–005 GREEN; (3) Confirmation tests use mocking (not live Edge Function) and are CI-testable |
| **applicable_overlays** | BUILD_DELIVERABLE: BD-011 through BD-013; CORE invariants: CORE-001–CORE-022 |
| **specific_rules** | BD-011 (100% test pass rate — T-PFCWT-004 + T-PFCWT-005 must both be GREEN); BD-012 (zero test debt); BD-013 (no test dodging — T-PFCWT-004 must simulate actual Edge Function failure via mock and assert the warning `data-testid` is present in the rendered output; T-PFCWT-005 must assert the upload does NOT fail on parsing error); BD-003 (CI-testable — must not require live Edge Function to pass in CI) |
| **risk_notes** | BD-013 is the highest-risk check for this task. Tests that merely check a component renders without error when `triggerParsing` is mocked as a no-op are insufficient. Tests must specifically simulate `triggerParsing` throwing an error and then verify: (a) the warning element appears, and (b) the component does not crash. IAA will review the mock setup carefully. |

---

### TASK-F1-C — BUILD_PROGRESS_TRACKER.md v1.4→v1.5

| Field | Value |
|-------|-------|
| **task_id** | TASK-F1-C |
| **task_summary** | Update `modules/mat/BUILD_PROGRESS_TRACKER.md` from v1.4 to v1.5. Adds: Post-FCWT Production Failures section documenting INC-POST-FCWT-SORT-ORDER-001 and INC-POST-FCWT-EDGE-FN-001, updated Current Stage to reflect active production failure remediation, updated Next Steps. |
| **builder** | foreman (governance artifact — not a POLC violation for foreman-authored governance files) |
| **artifact** | `modules/mat/BUILD_PROGRESS_TRACKER.md` |
| **iaa_trigger_category** | **GOVERNANCE_ARTIFACT** |
| **qualifying** | ✅ YES — BUILD_PROGRESS_TRACKER.md is a governed artifact that tracks the authoritative state of the MAT build. Production failure record must be accurate and complete. |
| **required_phases** | Phase 2 (Alignment), Phase 3 (Assurance — CERT checks + content alignment), Phase 4 (Merge Gate Parity + Verdict) |
| **required_evidence_artifacts** | (1) BUILD_PROGRESS_TRACKER.md diff on branch showing v1.5 header; (2) Post-FCWT Production Failures section present; (3) Both incidents (INC-POST-FCWT-SORT-ORDER-001, INC-POST-FCWT-EDGE-FN-001) documented; (4) Current Stage and Next Steps updated |
| **applicable_overlays** | CERT-001–CERT-004 (Universal Ceremony Gate); GOVERNANCE_ARTIFACT overlay |
| **specific_rules** | CERT-001 (PREHANDOVER proof — foreman must produce one before merge); CERT-002 (session memory present); The content of the BPST v1.5 update must accurately reflect the incidents — no minimisation of the POLC violation or the production failures. The Next Steps must reflect the pending IAA Final Audit gate. |
| **risk_notes** | Low technical risk. Governance accuracy risk: the incident descriptions must not sanitise or understate the production failures. The POLC violation note must be present and honest. |

---

### TASK-F2-C — FAIL-ONLY-ONCE.md v2.7→v2.8

| Field | Value |
|-------|-------|
| **task_id** | TASK-F2-C |
| **task_summary** | Update `.agent-workspace/foreman-v2/knowledge/FAIL-ONLY-ONCE.md` from v2.7 to v2.8. Adds: INC-POST-FCWT-SORT-ORDER-001 entry, INC-POST-FCWT-EDGE-FN-001 entry, A-032 candidate (schema-to-hook drift prevention), S-021 and S-022 improvement suggestions. |
| **builder** | foreman (governance artifact) |
| **artifact** | `.agent-workspace/foreman-v2/knowledge/FAIL-ONLY-ONCE.md` |
| **iaa_trigger_category** | **GOVERNANCE_ARTIFACT** |
| **qualifying** | ✅ YES — FAIL-ONLY-ONCE.md is a governed learning artifact; updates to it represent canonical governance learning. |
| **required_phases** | Phase 2 (Alignment), Phase 3 (Assurance — CERT checks + content alignment), Phase 4 (Merge Gate Parity + Verdict) |
| **required_evidence_artifacts** | (1) FAIL-ONLY-ONCE.md diff on branch showing v2.8 header; (2) Both incident entries present with root cause class, pattern, and preventive rule; (3) A-032 candidate entry present; (4) S-021 and S-022 improvement suggestions present |
| **applicable_overlays** | CERT-001–CERT-004 (Universal Ceremony Gate); GOVERNANCE_ARTIFACT overlay |
| **specific_rules** | The incident entries must include: (a) incident ID, (b) failure description, (c) root cause class, (d) preventive rule or detection method, (e) reference to the fix. A-032 candidate must state the pattern that caused INC-POST-FCWT-SORT-ORDER-001 and the proposed detection rule. S-021 and S-022 must be actionable (not vague). |
| **risk_notes** | Low technical risk. Governance learning quality risk: if the incident entries are superficial or the A-032 candidate does not actually prevent recurrence, IAA will note this as an advisory finding. The critical question is: would A-032 as written have prevented this wave's incidents? |

---

### TASK-F2-D — Edge Function `invoke-ai-parse-criteria/index.ts` (DEFERRED)

| Field | Value |
|-------|-------|
| **task_id** | TASK-F2-D |
| **task_summary** | Full Edge Function implementation — Supabase Edge Function calling AIMC Gateway. Deferred to future wave by Foreman assessment. |
| **iaa_trigger_category** | — |
| **qualifying** | ❌ NO — Deferred. Not in scope for this wave. Will require a new Pre-Brief when actioned. |
| **required_phases** | N/A (deferred) |

---

## Qualifying Task Summary

| Task | Category | Qualifying | IAA Phases Required |
|------|----------|------------|---------------------|
| TASK-F1-A | AAWP_MAT | ✅ YES | Phases 2, 3, 4 |
| TASK-F1-B | AAWP_MAT | ✅ YES | Phases 2, 3, 4 |
| TASK-F2-A | AAWP_MAT | ✅ YES | Phases 2, 3, 4 |
| TASK-F2-B | AAWP_MAT | ✅ YES | Phases 2, 3, 4 |
| TASK-F1-C | GOVERNANCE_ARTIFACT | ✅ YES | Phases 2, 3, 4 |
| TASK-F2-C | GOVERNANCE_ARTIFACT | ✅ YES | Phases 2, 3, 4 |
| TASK-F2-D | — (DEFERRED) | ❌ NO | N/A |

**Total qualifying tasks**: 6  
**AAWP_MAT tasks**: 4 (TASK-F1-A, TASK-F1-B, TASK-F2-A, TASK-F2-B)  
**GOVERNANCE_ARTIFACT tasks**: 2 (TASK-F1-C, TASK-F2-C)  
**EXEMPT/DEFERRED**: 1 (TASK-F2-D)

---

## Required Overlays for Final Audit

### For AAWP_MAT tasks (TASK-F1-A, TASK-F1-B, TASK-F2-A, TASK-F2-B):

| Overlay Set | Checks | Primary Focus |
|------------|--------|---------------|
| CORE Invariants | CORE-001 through CORE-022 | Full check |
| BUILD_DELIVERABLE Tier 1 | BD-001–BD-004 | Delivery completeness |
| BUILD_DELIVERABLE Tier 2 | BD-005–BD-010 | Wiring & integration — especially BD-005, BD-006 for TASK-F1-A |
| BUILD_DELIVERABLE Tier 3 | BD-011–BD-014 | Test quality — especially BD-013 for TASK-F1-B and TASK-F2-B |
| BUILD_DELIVERABLE Tier 4 | BD-015–BD-019 | Security — especially BD-015 for TASK-F1-A (RLS on modified tables) |
| BUILD_DELIVERABLE Tier 5 | BD-020–BD-024 | Code quality — especially BD-021 for TASK-F2-A (no bare catch) |
| Universal Ceremony Gate | CERT-001–CERT-004 | Existence checks only |

### For GOVERNANCE_ARTIFACT tasks (TASK-F1-C, TASK-F2-C):

| Overlay Set | Checks | Primary Focus |
|------------|--------|---------------|
| CORE Invariants | CORE-001 through CORE-022 | Full check |
| Universal Ceremony Gate | CERT-001–CERT-004 | Existence checks only |
| Governance content alignment | As described in task-specific rules above | Content quality check |

---

## Key Questions for IAA Final Audit

The following specific questions must be answered during the Final Audit (Phase 3 Assurance Work):

1. **TASK-F1-A**: Are the sort_order columns added to all three tables (`domains`, `mini_performance_standards`, `criteria`)? Does the migration safely handle existing live rows with DEFAULT 0?

2. **TASK-F1-A**: Does the column name and type exactly match what `useCriteriaTree()` calls with `.order('sort_order')`? (BD-005 — end-to-end wiring)

3. **TASK-F1-A**: Do the existing RLS policies on these tables need updating after the column addition? (BD-015)

4. **TASK-F1-B + TASK-F2-B**: Are T-PFCWT-001–005 CI-testable (not live-env-only)? The claimed test count increase from 774→779 must align with this classification.

5. **TASK-F2-A**: Does the inner try/catch in `CriteriaUpload.tsx` meet BD-021 (no bare catch)? Is the error surfaced to the user via the warning element or logged?

6. **TASK-F2-A**: Does the primary upload flow (criteria saved to DB) complete successfully even when the inner try/catch catches a parsing error? (BD-003)

7. **TASK-F2-B**: Do T-PFCWT-004 and T-PFCWT-005 specifically simulate `triggerParsing` throwing and assert on the warning element and upload success? (BD-013)

8. **TASK-F2-C**: Does A-032 candidate in FAIL-ONLY-ONCE.md v2.8 propose a detection rule that would have caught INC-POST-FCWT-SORT-ORDER-001 in a prior wave?

---

## Evidence Artifacts Expected at IAA Final Audit

| # | Artifact | Expected State |
|---|---------|---------------|
| 1 | `apps/maturion-maturity-legacy/supabase/migrations/20260306000000_domains_sort_order.sql` | Present, correct SQL for all 3 tables |
| 2 | `modules/mat/tests/postfcwt/sort-order-columns.test.ts` | Present, T-PFCWT-001–003 defined, GREEN |
| 3 | `modules/mat/tests/postfcwt/ai-parsing-graceful.test.ts` | Present, T-PFCWT-004–005 defined, GREEN |
| 4 | `modules/mat/frontend/src/components/criteria/CriteriaUpload.tsx` | Present, inner try/catch + warning element |
| 5 | `modules/mat/BUILD_PROGRESS_TRACKER.md` | v1.5, post-FCWT failures section present |
| 6 | `.agent-workspace/foreman-v2/knowledge/FAIL-ONLY-ONCE.md` | v2.8, both incidents + A-032 candidate |
| 7 | Test run evidence (774→779 GREEN, 0 regressions) | Produced by qa-builder / foreman |
| 8 | PREHANDOVER proof | Produced by foreman before IAA Final Audit |
| 9 | IAA ASSURANCE-TOKEN (this session) | Issued by IAA after Final Audit PASS |

---

## POLC Violation Disposition

| Field | Value |
|-------|-------|
| Violation ID | INC-POST-FCWT-POLC-A001-001 |
| Rule violated | A-001: No implementation before IAA Pre-Brief committed |
| Wave impacted | Wave Post-FCWT Production Failures (all 6 qualifying tasks) |
| Acknowledged by | foreman-v2-agent (wave-current-tasks.md, explicit note) |
| Rectification | Retroactive Pre-Brief (this document) + Full IAA Final Audit required before merge |
| Merge gate impact | NONE REMOVED — Full ASSURANCE-TOKEN required before any merge release |
| CS2 notification | REQUIRED — POLC violation must be cited in the merge package to CS2 |
| FAIL-ONLY-ONCE action | Foreman to assess whether A-032 or a new entry should reference this POLC breach pattern |

---

## Pre-Brief Completion Status

- [x] wave-current-tasks.md read in full
- [x] POLC violation identified and recorded
- [x] All 7 tasks classified against IAA trigger table
- [x] 6 qualifying tasks identified with required phases, evidence artifacts, overlays, and specific rules
- [x] 1 deferred task identified as not qualifying (TASK-F2-D)
- [x] Key questions for Final Audit declared
- [x] Pre-Brief artifact authored

**Status**: COMPLETE  
**Next Step**: IAA Final Audit may be invoked after PREHANDOVER proof is committed by Foreman.  
**Hard Gate**: No merge release without ASSURANCE-TOKEN from IAA Final Audit.

---

*Issued by*: independent-assurance-agent  
*Pre-Brief Reference*: PREBRIEF-POSTFCWT-PRODFAILS-20260306  
*Authority*: CS2 only (@APGI-cmy) — Merge permitted only with CS2 approval after ASSURANCE-TOKEN received
