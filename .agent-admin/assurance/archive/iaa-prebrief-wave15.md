# IAA Pre-Brief — Wave 15 — Post-Delivery Oversight Remediation (Criteria Parsing Pipeline)

**IAA Session**: IAA-20260306-PREBRIEF-WAVE15  
**Wave**: 15  
**Date**: 2026-03-06  
**Oversight ID**: INC-POST-FCWT-CRITERIA-PIPELINE-001  
**Wave Task List**: `.agent-workspace/foreman-v2/personal/wave-current-tasks.md`  
**Authority**: `governance/canon/IAA_PRE_BRIEF_PROTOCOL.md` v1.1.0  
**Canon Basis**: `governance/canon/INDEPENDENT_ASSURANCE_AGENT_CANON.md` v1.3.0  
**Status**: ACTIVE  

---

## Phase 0 Confirmation

This artifact is produced under Phase 0 (PRE-BRIEF) invocation only.  
IAA Phases 1–4 assurance will execute at each PR handover — **not** during Pre-Brief.  
Trigger confirmed: `IAA_PRE_BRIEF_PROTOCOL.md §Trigger` present in `wave-current-tasks.md`.  
Prior Wave 15 Pre-Brief: **ABSENT** — first generation confirmed, no duplicate.

---

## Wave Summary

Wave 15 remediates a post-FCWT production gap (INC-POST-FCWT-CRITERIA-PIPELINE-001): criteria upload to Supabase Storage succeeds, but parsing silently fails because the Supabase Edge Function `invoke-ai-parse-criteria` does not exist in production and the AI Gateway `DocumentParser` in `apps/mat-ai-gateway/services/parsing.py` returns a stub response. No criteria hierarchy is ever created as a result. This wave delivers architecture documentation updates to concretise the parsing pipeline specification, a RED QA test suite to lock intended behaviour before implementation, a real Edge Function + Python DocumentParser + DB write-back (Batch A), UI error surfacing + polling + hierarchy panel (Batch B), and QA GREEN pass (Batch C). Delivery is sequenced across four PRs with the IAA gate required before each merge.

---

## Task Classification

### Non-Qualifying Tasks (excluded from per-task requirements below)

| Task ID | Task | Reason Not Qualifying |
|---------|------|-----------------------|
| T-W15-GOV-001 | Update BUILD_PROGRESS_TRACKER.md — add Wave 15 section | Admin tracking document update. `BUILD_PROGRESS_TRACKER.md` is a project management artefact. Per `IAA_PRE_BRIEF_PROTOCOL.md §Qualifying Tasks`: "Docs-only task → NO, Admin/housekeeping task → NO." Will be bundled in the Governance Batch PR and reviewed as incidental to the qualifying batch — IAA will not spend focused audit time on this file specifically. |
| T-W15-GOV-006 | Final BUILD_PROGRESS_TRACKER update — Wave 15 ✅ COMPLETE | Same as above. Final admin closure record. Not a functional deliverable. Will be in the wave-closure PR reviewed as incidental to the AAWP_MAT qualifying tasks in that PR. |

---

## Qualifying Tasks — Per-Task Assurance Declaration

Wave 15 is delivered in **four PR batches**. Tasks are grouped by batch for clarity. IAA is invoked once per batch PR.

---

### BATCH: GOVERNANCE + QA RED
**PR Scope**: T-W15-GOV-002, T-W15-GOV-003, T-W15-GOV-004, T-W15-GOV-005, T-W15-QA-001  
**Builder(s)**: mat-specialist (GOV-002 to GOV-005), qa-builder (QA-001)  
**IAA Category**: `AAWP_MAT` — T2  
**Ceremony Level**: Full Five-Phase (Phases 1–4) required  
**Rationale**: This batch contains `src/test/wave15-criteria-parsing.test.ts` — an executable test artefact in the MAT module. Per `INDEPENDENT_ASSURANCE_AGENT_CANON.md §Risk-Tiered Ceremony Table` and the trigger table, any PR delivering executable application behaviour (tests, hooks, components) in a MAT path pattern is classified T2. All files in this batch — including the architecture documentation updates — are reviewed at T2 ceremony level because the highest-risk file in the batch governs the tier.

---

#### T-W15-GOV-002

| Field | Value |
|-------|-------|
| **task_id** | T-W15-GOV-002 |
| **task_summary** | Update `modules/mat/00-app-description/app-description.md` to v1.4, concretising §6.2 Parsing Pipeline with a real architecture narrative (Edge Function → AI Gateway → DB), adding version bump and history entry |
| **iaa_trigger_category** | `AAWP_MAT` — architecture specification document in MAT module path (`modules/mat/`) |
| **required_phases** | 1 (Preflight), 2 (Governance), 3 (Working Phase), 4 (Handover) |
| **required_evidence_artifacts** | `PREHANDOVER proof` (mat-specialist) at `.agent-admin/prehandover/prehandover-proof-wave15-gov-batch.md` or equivalent; Preflight declaration in session memory; Governance proof citing canon version |
| **applicable_overlays** | `BUILD_DELIVERABLE` — BD-001 (scope delivered: §6.2 content matches design intent from wave task), BD-022 (architecture alignment: parsing pipeline description must match system-architecture.md §Criteria Parsing Pipeline Architecture added in T-W15-GOV-005) |
| **specific_rules** | BD-001, BD-022, CORE-016 (PREHANDOVER proof copy-paste requirement), CORE-018 (evidence bundle completeness) |
| **notes** | §6.2 content must be internally consistent with MAT_UX_WORKFLOW_AND_WIRING.md (T-W15-GOV-003) and system-architecture.md (T-W15-GOV-005). IAA will cross-check cross-document consistency as a BD-022 check. Version bump to v1.4 must be present with history entry. |

---

#### T-W15-GOV-003

| Field | Value |
|-------|-------|
| **task_id** | T-W15-GOV-003 |
| **task_summary** | Update `modules/mat/00-app-description/MAT_UX_WORKFLOW_AND_WIRING.md` to add the complete UI→Edge Function→AI Gateway→DB→poll workflow cycle for the criteria parsing feature |
| **iaa_trigger_category** | `AAWP_MAT` — UX workflow and wiring specification in MAT module path |
| **required_phases** | 1 (Preflight), 2 (Governance), 3 (Working Phase), 4 (Handover) |
| **required_evidence_artifacts** | `PREHANDOVER proof` (mat-specialist) at `.agent-admin/prehandover/prehandover-proof-wave15-gov-batch.md` or equivalent |
| **applicable_overlays** | `BUILD_DELIVERABLE` — BD-001 (scope: parsing workflow cycle present), BD-005 (wiring trace: IAA will verify that the documented UI→Edge Fn→AI Gateway→DB→poll chain has every link named, including request/response shapes at each boundary), BD-022 (architecture alignment: wiring document must match system-architecture.md) |
| **specific_rules** | BD-001, BD-005, BD-022, CORE-018 |
| **notes** | IAA will verify that the wiring document specifies: (1) CriteriaUpload.tsx trigger event, (2) Edge Function invocation method and URL pattern, (3) AI Gateway DocumentParser.parse() invocation, (4) DB write-back table and column names, (5) polling mechanism (interval, terminal states), (6) error surface path. Any gap in the chain = advisory finding. Boundary mismatches with system-architecture.md = BD-022 FAIL. |

---

#### T-W15-GOV-004

| Field | Value |
|-------|-------|
| **task_id** | T-W15-GOV-004 |
| **task_summary** | Update `modules/mat/01-frs/functional-requirements.md` to v2.0.0 — expand FR-005 with 8 new acceptance criteria covering parsing pipeline behaviour, and add FR-102 (new functional requirement for criteria hierarchy creation) |
| **iaa_trigger_category** | `AAWP_MAT` — functional requirements specification in MAT module |
| **required_phases** | 1 (Preflight), 2 (Governance), 3 (Working Phase), 4 (Handover) |
| **required_evidence_artifacts** | `PREHANDOVER proof` (mat-specialist) at `.agent-admin/prehandover/prehandover-proof-wave15-gov-batch.md` or equivalent |
| **applicable_overlays** | `BUILD_DELIVERABLE` — BD-001 (scope: FR-005 expanded with 8 ACs, FR-102 present), BD-022 (requirements alignment: ACs must correspond directly to the 14 QA test cases defined in T-W15-QA-001 — IAA will cross-reference) |
| **specific_rules** | BD-001, BD-022, CORE-018 |
| **notes** | IAA will verify that the 8 new FR-005 acceptance criteria and FR-102 together provide traceable coverage for the 14 RED tests in T-W15-QA-001. Version bump to v2.0.0 with history entry mandatory. A functional requirement that has no corresponding test, or a test with no corresponding FR, will be flagged as traceability gap (advisory, not blocking, unless systematic). |

---

#### T-W15-GOV-005

| Field | Value |
|-------|-------|
| **task_id** | T-W15-GOV-005 |
| **task_summary** | Update `modules/mat/02-architecture/system-architecture.md` — add §Criteria Parsing Pipeline Architecture section describing the Edge Function, AI Gateway, and DB write-back components and their integration topology |
| **iaa_trigger_category** | `AAWP_MAT` — system architecture specification in MAT module |
| **required_phases** | 1 (Preflight), 2 (Governance), 3 (Working Phase), 4 (Handover) |
| **required_evidence_artifacts** | `PREHANDOVER proof` (mat-specialist) at `.agent-admin/prehandover/prehandover-proof-wave15-gov-batch.md` or equivalent |
| **applicable_overlays** | `BUILD_DELIVERABLE` — BD-001 (scope: §Criteria Parsing Pipeline Architecture present), BD-022 (architecture alignment: component descriptions must match what Batch A will implement — if there is a design decision that diverges from what the api-builder will produce, it must be flagged here or in working phase notes), BD-005 (wiring trace: architecture section must name all integration points explicitly) |
| **specific_rules** | BD-001, BD-005, BD-022, CORE-018 |
| **notes** | This document is the **source of truth** that Batch A (api-builder) will build against. IAA will assess whether the architecture section is sufficiently concrete to serve as an unambiguous build specification — vague or incomplete architecture descriptions will generate an advisory finding. The section must at minimum specify: Edge Function name + trigger mechanism, AI Gateway endpoint + expected request/response contract, DB table(s) for criteria hierarchy write-back, polling mechanism design. |

---

#### T-W15-QA-001

| Field | Value |
|-------|-------|
| **task_id** | T-W15-QA-001 |
| **task_summary** | Create RED QA suite at `src/test/wave15-criteria-parsing.test.ts` — 14 tests (T-W15-CP-001 to T-W15-CP-014) that are all failing (RED) at commit time, proving the implementation does not yet exist |
| **iaa_trigger_category** | `AAWP_MAT` — executable test artefact in MAT module; T2 build deliverable |
| **required_phases** | 1 (Preflight), 2 (Governance), 3 (Working Phase), 4 (Handover) |
| **required_evidence_artifacts** | `PREHANDOVER proof` (qa-builder) at `.agent-admin/prehandover/prehandover-proof-wave15-gov-batch.md` or equivalent; **test run output log** proving all 14 tests are RED (failing) at commit time — this is a non-negotiable evidence artifact; the test run must be committed, not just referenced |
| **applicable_overlays** | `BUILD_DELIVERABLE` — BD-001 (all 14 tests present), BD-002 (no stubs or placeholder test bodies that would cause false RED — tests must test real system calls), BD-012 (zero test debt: no `.skip()`, `.only()`, `test.todo()`), BD-013 (no test dodging: every test must have assertions that will meaningfully go GREEN only when the implementation is real), BD-011 (RED evidence required — test run log showing 14/14 failures) |
| **specific_rules** | BD-001, BD-002, BD-011, BD-012, BD-013, CORE-018 |
| **notes** | **Critical**: IAA will scrutinise the test file for false RED patterns — tests that are RED because they import a non-existent module but do not actually assert meaningful behaviour (these will become vacuous GREEN after any stub import is created). Each test must assert on actual end-state behaviour (e.g., a criteria hierarchy row existing in the DB, an error message surfaced in the UI). IAA will also verify that every test maps to a FR-005 AC or FR-102 requirement from T-W15-GOV-004. Test run log must be committed alongside the test file — a verbal "all RED" assertion is not acceptable evidence. |

---

### BATCH A — EDGE FUNCTION + AI GATEWAY + DB WRITE-BACK
**PR Scope**: T-W15-IMPL-001  
**Builder**: api-builder  
**IAA Category**: `AAWP_MAT` — T2  
**Ceremony Level**: Full Five-Phase (Phases 1–4) required  

---

#### T-W15-IMPL-001

| Field | Value |
|-------|-------|
| **task_id** | T-W15-IMPL-001 |
| **task_summary** | Implement `supabase/functions/invoke-ai-parse-criteria/index.ts` (new Edge Function), replace stub `DocumentParser.parse()` in `apps/mat-ai-gateway/services/parsing.py` with real implementation, and implement DB write-back to criteria hierarchy tables |
| **iaa_trigger_category** | `AAWP_MAT` — T2 build deliverable: new Supabase Edge Function, Python service implementation, database write operations |
| **required_phases** | 1 (Preflight), 2 (Governance), 3 (Working Phase), 4 (Handover) |
| **required_evidence_artifacts** | `PREHANDOVER proof` (api-builder) at `.agent-admin/prehandover/prehandover-proof-wave15-batch-a.md` or equivalent; working phase proof documenting design decisions for Edge Function→AI Gateway invocation contract, DocumentParser implementation approach, and DB write-back schema mapping; evidence that parsing stub has been **removed** (not just overridden) |
| **applicable_overlays** | `BUILD_DELIVERABLE` — full BD-001 through BD-024 apply; **high-priority checks**: BD-002 (no remaining stubs — the `{"status": "queued", "task_id": "stub"}` return must be gone), BD-003 (one-time build: parsing must work end-to-end on first deploy), BD-005 (wiring: Edge Fn → AI Gateway → DB chain fully verified), BD-006 (writers confirmed: criteria hierarchy tables must have real INSERT paths), BD-007 (auth guards on Edge Function), BD-015 (RLS on any new/modified Supabase tables), BD-016 (no hardcoded secrets — `AI_GATEWAY_URL`, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` must come from env vars), BD-017 (input validation on Edge Function request body), BD-018 (no injection vectors in Python AI Gateway) |
| **specific_rules** | BD-001, BD-002, BD-003, BD-005, BD-006, BD-007, BD-015, BD-016, BD-017, BD-018, BD-022, CORE-018, A-026 (SCOPE_DECLARATION.md must match diff exactly) |
| **notes** | **CST Checkpoint Required**: This batch closes a critical cross-boundary integration point (Supabase Edge Function → Python AI Gateway → PostgreSQL write-back). Per `COMBINED_TESTING_PATTERN.md` §4.2 and IAA knowledge index §CST Prompt Conditions, a CST is warranted after Batch A merges and before Batch B begins UI integration work. The Foreman must commission CST covering the Edge Function → AI Gateway → DB chain before Batch B opens for review. **IAA will verify at Batch A handover that CST has been commissioned or that the Foreman has recorded a documented rationale for deferral.** ENV VAR safety: the three required env vars (`AI_GATEWAY_URL`, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`) must be configured in Supabase project secrets — IAA will verify the Edge Function reads them from `Deno.env.get()` / equivalent, never hardcoded. |

---

### BATCH B — UI INTEGRATION
**PR Scope**: T-W15-IMPL-002  
**Builder**: ui-builder  
**IAA Category**: `AAWP_MAT` — T2  
**Ceremony Level**: Full Five-Phase (Phases 1–4) required  
**Dependency**: Batch A must have received ASSURANCE-TOKEN before Batch B PR opens.

---

#### T-W15-IMPL-002

| Field | Value |
|-------|-------|
| **task_id** | T-W15-IMPL-002 |
| **task_summary** | Implement error surfacing in `CriteriaUpload.tsx` (distinguish "upload complete, parsing initiated" from "parsing failed"), add polling to `useCriteria.ts` hook (check criteria hierarchy creation status), and implement Criteria Hierarchy panel displaying parsed hierarchy |
| **iaa_trigger_category** | `AAWP_MAT` — T2 build deliverable: React component, custom hook, new UI panel |
| **required_phases** | 1 (Preflight), 2 (Governance), 3 (Working Phase), 4 (Handover) |
| **required_evidence_artifacts** | `PREHANDOVER proof` (ui-builder) at `.agent-admin/prehandover/prehandover-proof-wave15-batch-b.md` or equivalent; working phase proof documenting polling interval strategy, error state design decisions, and hierarchy panel data shape; evidence that the misleading `alert('Criteria document uploaded and parsing initiated!')` message has been updated to be accurate |
| **applicable_overlays** | `BUILD_DELIVERABLE` — BD-001 (all three UI deliverables present), BD-002 (no stub polling — real interval-based hook), BD-003 (one-time build: user sees accurate error state on first deploy), BD-005 (wiring: UI → Edge Fn invocation → poll → hierarchy panel data flow verified), BD-009 (cross-component fit: `useCriteria.ts` hook must correctly consume the DB structure that Batch A writes), BD-017 (input validation), BD-018 (XSS: hierarchy panel must not render unescaped content from parsing results), BD-021 (TypeScript strictness) |
| **specific_rules** | BD-001, BD-002, BD-003, BD-005, BD-009, BD-017, BD-018, BD-021, BD-022, CORE-018, A-026 |
| **notes** | **Previous session learning applied (session-postfcwt-prodfails-v2-20260306)**: The prior session noted that `alert('Criteria document uploaded and parsing initiated!')` is misleading when parsing is unavailable. This wave must fix that UX gap as part of T-W15-IMPL-002. IAA will verify the alert/notification message accurately distinguishes between upload success and parsing status. The `useCriteria.ts` polling hook must handle all terminal states: (a) hierarchy created successfully, (b) parsing failed, (c) parsing timeout. Each state must surface a distinct, accurate user-facing message. Missing terminal state handling = BD-003 FAIL. |

---

### BATCH C — QA RED → GREEN
**PR Scope**: T-W15-IMPL-003  
**Builder**: qa-builder  
**IAA Category**: `AAWP_MAT` — T2  
**Ceremony Level**: Full Five-Phase (Phases 1–4) required  
**Dependency**: Batch A and Batch B must have received ASSURANCE-TOKEN before Batch C opens.

---

#### T-W15-IMPL-003

| Field | Value |
|-------|-------|
| **task_id** | T-W15-IMPL-003 |
| **task_summary** | Execute QA RED→GREEN transition: all 14 tests in `src/test/wave15-criteria-parsing.test.ts` (T-W15-CP-001 to T-W15-CP-014) must pass (GREEN) against the Batch A + Batch B implementation |
| **iaa_trigger_category** | `AAWP_MAT` — T2 build deliverable: QA convergence point |
| **required_phases** | 1 (Preflight), 2 (Governance), 3 (Working Phase), 4 (Handover) |
| **required_evidence_artifacts** | `PREHANDOVER proof` (qa-builder) at `.agent-admin/prehandover/prehandover-proof-wave15-batch-c.md` or equivalent; **test run output log showing 14/14 GREEN** — committed log file, not verbal assertion; working phase proof documenting any test adjustments made during GREEN transition (if any test needed to be updated to match real implementation, the rationale must be documented) |
| **applicable_overlays** | `BUILD_DELIVERABLE` — BD-011 (100% pass rate: 14/14 GREEN evidence required), BD-012 (zero test debt: no `.skip()`, `.only()`, `test.todo()` introduced during GREEN transition), BD-013 (no test dodging: if any test was modified to go GREEN, the modification must not weaken the assertion — IAA will compare original test bodies from T-W15-QA-001 commit against final versions) |
| **specific_rules** | BD-011, BD-012, BD-013, CORE-018, A-026, OVL-AM-CST-01 |
| **notes** | **CWT Requirement**: Batch C is the final implementation PR in this wave. Per `COMBINED_TESTING_PATTERN.md` §5.2, a CWT (Combined Wave Test) is **mandatory** before the wave-closure PR (T-W15-GOV-006) can be submitted. The Foreman must commission a CWT covering Wave 15 and all prior waves, and include CWT PASS evidence in the wave-closure PREHANDOVER proof. **IAA will check for CWT PASS evidence in the wave-closure PR — absence = REJECTION-PACKAGE, no exceptions.** If any of the 14 tests were modified during GREEN transition (e.g., mock contracts updated to match actual API shape), IAA will diff the original vs modified test bodies and verify no meaningful assertion was removed. Weakening a test assertion to make it GREEN is a BD-013 violation. |

---

## Cross-Wave Integration Testing Obligations

### CST Obligation — After Batch A, Before Batch B

Per `governance/canon/COMBINED_TESTING_PATTERN.md` §4.2 and `iaa-knowledge/index.md` §CST/CWT/FCWT Orchestration Prompting:

> **Batch A closes a cross-architectural-boundary integration point** — new Supabase Edge Function invokes an external Python AI Gateway service which writes to the PostgreSQL criteria hierarchy tables. This is a non-trivial, three-component chain across two runtimes (Deno Edge Function + Python ASGI). A CST is warranted.

**IAA will check at Batch A handover**: Has the Foreman commissioned a CST for the Edge Function → AI Gateway → DB chain? If not, a documented rationale for deferral must be present in the Batch A PREHANDOVER proof. An undocumented skip = advisory finding (per OVL-AM-CST-01, since CST may be skipped with rationale citing cumulative regression assurance).

### CWT Obligation — After Batch C, Before Wave Closure

Per `COMBINED_TESTING_PATTERN.md` §5.2:

> **CWT is mandatory before IBWR/wave-closure completion.** Wave 15 delivers new Supabase functions, Python service changes, React component changes, and new test coverage. CWT must confirm no regression across all prior waves.

**IAA will check at wave-closure PR (T-W15-GOV-006 PR)**: CWT PASS evidence must be present in the PREHANDOVER proof. The wave-closure PR will be rejected without CWT PASS.

### FCWT Obligation — Not triggered this wave

Wave 15 is a post-FCWT remediation wave fixing a production gap. It does not constitute a new production sign-over event. FCWT was completed in Wave 14. A new FCWT is **not** required unless CS2 specifically authorises a second sign-over.

---

## Evidence Artifact Summary — Required Per PR

| PR Batch | PREHANDOVER Proof | Preflight/Governance/Working Proof | Test Run Log | CST Evidence | CWT Evidence |
|----------|------------------|------------------------------------|--------------|-------------|-------------|
| Governance Batch (GOV-002–005, QA-001) | `.agent-admin/prehandover/prehandover-proof-wave15-gov-batch.md` | Within PREHANDOVER proof or session memory | **14/14 RED test run log** — mandatory committed evidence | N/A | N/A |
| Batch A (IMPL-001) | `.agent-admin/prehandover/prehandover-proof-wave15-batch-a.md` | Within PREHANDOVER proof | N/A | CST evidence or documented skip rationale | N/A |
| Batch B (IMPL-002) | `.agent-admin/prehandover/prehandover-proof-wave15-batch-b.md` | Within PREHANDOVER proof | N/A | N/A | N/A |
| Batch C (IMPL-003) | `.agent-admin/prehandover/prehandover-proof-wave15-batch-c.md` | Within PREHANDOVER proof | **14/14 GREEN test run log** — mandatory committed evidence | N/A | CWT PASS evidence required in wave-closure PR |

---

## PREHANDOVER Proof Required Block — wave_checklist

Per `IAA_PRE_BRIEF_PROTOCOL.md §Merge Gate Enforcement`, each PREHANDOVER proof **must** include a `wave_checklist` block referencing this Pre-Brief. Required block format:

```markdown
## wave_checklist

| Field | Value |
|-------|-------|
| pre_brief_reference | `.agent-admin/assurance/iaa-prebrief-wave15.md` |
| wave | 15 |
| status | ALL_TICKED / PARTIAL (with [~] reasons) |
| qualifying_tasks_covered | [list T-W15 task IDs covered by this PR] |
```

Absence of this block in any PREHANDOVER proof for a Wave 15 PR = **merge blocker**.

---

## IAA Adoption Phase

**PHASE_B_BLOCKING** — Hard gate is ACTIVE. All Wave 15 PRs require ASSURANCE-TOKEN before merge. REJECTION-PACKAGE is a hard block — no PR opens without IAA token. No class exceptions. No deferral.

---

## FAIL-ONLY-ONCE Rules Applicable This Wave

| Rule | Applicability |
|------|--------------|
| A-001 | IAA invocation evidence must be present in all qualifying PRs — all four batches |
| A-021 | All commits must be pushed before IAA is invoked — verified per batch |
| A-025 | IAA token references in PREHANDOVER proofs must use `PENDING` until token is issued — do not pre-fill anticipated PASS tokens |
| A-026 | SCOPE_DECLARATION.md must match `git diff --name-only origin/main...HEAD` exactly before each batch IAA invocation |
| A-028 | SCOPE_DECLARATION.md must use list format; prior-wave entries must be trimmed |
| A-029 | PREHANDOVER proof is immutable post-commit — IAA writes dedicated token file; PREHANDOVER is read-only |

---

## Declaration

The requirements listed above are the acceptance criteria the IAA will verify at handover for each Wave 15 PR batch. Meeting all criteria listed is necessary (but not sufficient) for an ASSURANCE-TOKEN. The IAA retains intelligence-led assessment authority and may identify additional issues discovered during review not listed here — particularly FFA findings (BD-TIER-1 through BD-TIER-6) for Batch A and Batch B implementation PRs.

**Builders and the Foreman should treat this Pre-Brief as a checklist before PREHANDOVER proof is written.** If a declared evidence artifact is missing at handover, the IAA will issue a REJECTION-PACKAGE citing the specific gap.

**IAA signature**: IAA-20260306-PREBRIEF-WAVE15  
**Adoption Phase**: PHASE_B_BLOCKING  
**Authority**: CS2 (Johan Ras / @APGI-cmy)
