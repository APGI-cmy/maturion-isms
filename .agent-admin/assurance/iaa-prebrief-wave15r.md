# IAA Pre-Brief Artifact — Wave 15R (Wave 15 Remediation — Criteria Parsing Pipeline)

**Pre-Brief Reference**: IAA-PREBRIEF-WAVE15R-20260308
**Wave**: wave15r
**Branch**: copilot/update-governance-orchestration-wave15
**Issue**: #996 — gov(wave15): Foreman — full governance update + orchestration for failed Wave 15 criteria parsing pipeline
**CS2 Authority**: Issue #996 opened directly by @APGI-cmy
**Date**: 2026-03-08
**IAA Session**: session-prebrief-wave15r-20260308
**IAA Adoption Phase**: PHASE_B_BLOCKING

---

## Phase 1 Preflight Summary

> This Pre-Brief was generated after full Phase 1 preflight execution. Evidence:

| Preflight Step | Result |
|---|---|
| Contract YAML loaded (Step 1.1) | ✅ PASS — agent.id: independent-assurance-agent, class: assurance, v6.2.0 |
| Tier 2 knowledge loaded (Step 1.2) | ✅ PASS — all 8 required files PRESENT, knowledge v2.6.0 |
| Orientation Mandate (Step 1.3) | ✅ ACKNOWLEDGED — quality engineer mode, not file auditor |
| CANON_INVENTORY hash check (Step 1.4) | ✅ PASS — 191 entries, 0 bad hashes, IAA canon PRESENT |
| Session memory review (Step 1.5) | ✅ PASS — last 5 sessions reviewed; no open REJECTION-PACKAGEs outstanding |
| Breach registry (Step 1.6) | ✅ CLEAR — no open breaches |
| Merge gate checks loaded (Step 1.7) | ✅ LOADED — 3 required checks declared |
| FAIL-ONLY-ONCE loaded (Step 1.6b) | ✅ PASS — A-001 and A-002 attested |

---

## Phase 0 — Step 0.1: Pre-Brief Invocation Confirmed

This session was triggered by an explicit **IAA PRE-BRIEF REQUEST** comment on Issue #996, referencing `wave15r` scope. Pre-Brief mode is ACTIVE. Phases 2–4 assurance will NOT be executed this session.

> **Note on wave-current-tasks.md**: The file at `.agent-workspace/foreman-v2/personal/wave-current-tasks.md` currently reflects the prior wave (`fix-e2e-w13-liveness`). Foreman has not yet updated this file for wave15r at the time of this Pre-Brief. The authoritative task scope for this Pre-Brief is therefore drawn directly from Issue #996 (CS2-authored, @APGI-cmy). This is recorded as a **minor administrative observation** — not a blocker. Foreman must update `wave-current-tasks.md` for wave15r before IAA invocation at handover (A-026 / SCOPE_DECLARATION compliance will require it).

---

## Phase 0 — Step 0.2 & 0.3: Task Inventory and Classification

Wave 15R governance batch tasks derived from Issue #996:

| Task ID | Task Summary | Files Touched | IAA Trigger Category | Qualifying? |
|---------|-------------|---------------|---------------------|-------------|
| T-W15R-GOV-001 | Add Wave 15 FAILED section + Wave 15R plan to implementation-plan.md | `modules/mat/03-implementation-plan/implementation-plan.md` | AAWP_MAT | ✅ QUALIFYING |
| T-W15R-GOV-002 | Add INC-WAVE15-PARSE-001 to BUILD_PROGRESS_TRACKER.md | `modules/mat/BUILD_PROGRESS_TRACKER.md` | AAWP_MAT | ✅ QUALIFYING |
| T-W15R-GOV-003 | Annotate App Description with production gap (§6.2) | `modules/mat/00-app-description/app-description.md` | AAWP_MAT | ✅ QUALIFYING |
| T-W15R-GOV-004 | Annotate FRS — FR-005, FR-103 not satisfied in production | `modules/mat/01-frs/functional-requirements.md` | AAWP_MAT | ✅ QUALIFYING |
| T-W15R-GOV-005 | Annotate TRS — corresponding technical requirements unverified | `modules/mat/02-trs/` (TRS file) | AAWP_MAT | ✅ QUALIFYING |
| T-W15R-GOV-006 | Declare RED QA suite for Wave 15R Batch C + delegate to qa-builder | Foreman session / PREHANDOVER (delegation record) | AAWP_MAT | ✅ QUALIFYING |
| T-W15R-GOV-007 | Register INC-WAVE15-PARSE-001 in FAIL-ONLY-ONCE registry | `.agent-workspace/foreman-v2/knowledge/FAIL-ONLY-ONCE.md` | KNOWLEDGE_GOVERNANCE | ✅ QUALIFYING |
| T-W15R-GOV-008 | Write Foreman session memory | `.agent-workspace/foreman-v2/memory/session-NNN-20260308.md` | EXEMPT (session memory) | ❌ NOT QUALIFYING (governed by T-W15R-GOV-001 trigger) |
| T-W15R-GOV-009 | Commission IAA Pre-Brief for Wave 15R | `.agent-admin/assurance/iaa-prebrief-wave15r.md` | META (this artifact) | N/A — THIS SESSION |

**Net trigger categories for the wave15r PR:**
- **AAWP_MAT** (primary — T-W15R-GOV-001 through -006)
- **KNOWLEDGE_GOVERNANCE** (T-W15R-GOV-007 — Foreman FAIL-ONLY-ONCE registry patch)
- **MIXED** applies per trigger table: any triggering artifact activates IAA for the whole PR

---

## Phase 0 — Step 0.4: Pre-Brief Artifact

### A. Qualifying Task Details

---

#### T-W15R-GOV-001: Implementation Plan Update

| Field | Value |
|---|---|
| `task_id` | T-W15R-GOV-001 |
| `task_summary` | Add Wave 15 FAILED section + Wave 15R remediation plan (Batch A/B/C with CST gate) to implementation-plan.md |
| `iaa_trigger_category` | AAWP_MAT |
| `required_phases` | AAWP_MAT overlay (OVL-AM-001 through OVL-AM-*) + CORE-001 through CORE-022 |
| `required_evidence_artifacts` | PREHANDOVER proof committed to branch; SCOPE_DECLARATION.md current; session memory on branch |
| `applicable_overlays` | iaa-category-overlays.md §AAWP_MAT; CST/CWT/FCWT audit checks OVL-AM-CST-01, OVL-AM-CWT-01 |
| `specific_rules` | A-021 (commit before IAA), A-026 (SCOPE_DECLARATION must match diff), A-028 (SCOPE_DECLARATION format), A-029 (PREHANDOVER immutability) |
| `iaa_notes` | The Wave 15R plan must explicitly declare CST gate between Batch A and Batch B. IAA will verify the implementation plan names the CST gate as mandatory before issuing ASSURANCE-TOKEN. |

---

#### T-W15R-GOV-002: Build Progress Tracker Update

| Field | Value |
|---|---|
| `task_id` | T-W15R-GOV-002 |
| `task_summary` | Add INC-WAVE15-PARSE-001 to BUILD_PROGRESS_TRACKER.md with state machine, symptoms, root cause, FAIL-ONLY-ONCE cross-reference |
| `iaa_trigger_category` | AAWP_MAT |
| `required_phases` | AAWP_MAT overlay + CORE invariants |
| `required_evidence_artifacts` | BUILD_PROGRESS_TRACKER.md committed on branch with INC-WAVE15-PARSE-001 section |
| `applicable_overlays` | iaa-category-overlays.md §AAWP_MAT |
| `specific_rules` | A-021, A-026, A-029 |
| `iaa_notes` | IAA will verify that the incident record includes: root cause (Edge Function never deployed; AI_GATEWAY_URL not set; AI Gateway reachability unverified; UI UX gap), state machine transition FAILED → remediation-in-progress, and cross-reference to Wave 15R implementation plan section. |

---

#### T-W15R-GOV-003: App Description Annotation

| Field | Value |
|---|---|
| `task_id` | T-W15R-GOV-003 |
| `task_summary` | Annotate §6.2 Parsing Pipeline in app-description.md with production gap (INC-WAVE15-PARSE-001) and Wave 15R remediation reference |
| `iaa_trigger_category` | AAWP_MAT |
| `required_phases` | AAWP_MAT overlay + CORE invariants |
| `required_evidence_artifacts` | app-description.md committed on branch with annotation |
| `applicable_overlays` | iaa-category-overlays.md §AAWP_MAT |
| `specific_rules` | A-021, A-026, A-029 |
| `iaa_notes` | IAA will verify annotation does not delete or contradict existing approved requirements — it supplements with production gap status only. |

---

#### T-W15R-GOV-004: FRS Annotation

| Field | Value |
|---|---|
| `task_id` | T-W15R-GOV-004 |
| `task_summary` | Annotate FR-005 (criteria parsing) and FR-103 (error surfacing) as not satisfied in production; link to Wave 15R remediation |
| `iaa_trigger_category` | AAWP_MAT |
| `required_phases` | AAWP_MAT overlay + CORE invariants |
| `required_evidence_artifacts` | functional-requirements.md committed on branch with FR-005 and FR-103 annotations |
| `applicable_overlays` | iaa-category-overlays.md §AAWP_MAT |
| `specific_rules` | A-021, A-026, A-029 |
| `iaa_notes` | IAA will verify FR-005 and FR-103 are the correct FRS entries for the criteria parsing pipeline and error surfacing. Annotation must not remove requirements — only add production status. |

---

#### T-W15R-GOV-005: TRS Annotation

| Field | Value |
|---|---|
| `task_id` | T-W15R-GOV-005 |
| `task_summary` | Annotate TRS technical requirements corresponding to FR-005/FR-103 as unverified in production; link to Wave 15R |
| `iaa_trigger_category` | AAWP_MAT |
| `required_phases` | AAWP_MAT overlay + CORE invariants |
| `required_evidence_artifacts` | TRS file committed on branch with corresponding technical requirement annotations |
| `applicable_overlays` | iaa-category-overlays.md §AAWP_MAT |
| `specific_rules` | A-021, A-026, A-029 |
| `iaa_notes` | IAA will verify the TRS file path is identified and the correct TR entries are annotated. Foreman should identify the TRS file path before handover. |

---

#### T-W15R-GOV-006: RED QA Suite Delegation

| Field | Value |
|---|---|
| `task_id` | T-W15R-GOV-006 |
| `task_summary` | Declare RED tests for Wave 15R Batch C (Edge Function, AI Gateway, UI document list, retry button, inline error log) and formally delegate to qa-builder |
| `iaa_trigger_category` | AAWP_MAT |
| `required_phases` | AAWP_MAT overlay + CORE invariants |
| `required_evidence_artifacts` | PREHANDOVER proof must list qa-builder delegation with RED test scope declared |
| `applicable_overlays` | iaa-category-overlays.md §AAWP_MAT |
| `specific_rules` | A-021, A-026, A-029 |
| `iaa_notes` | IAA will verify the PREHANDOVER proof records the delegation to qa-builder with a complete list of required RED tests. The delegation is not a separate artifact — it must be evidenced in the PREHANDOVER. IAA will NOT accept a PREHANDOVER that says "qa-builder will handle tests" without listing the test IDs or test scope. |

---

#### T-W15R-GOV-007: FAIL-ONLY-ONCE Registry Update (KNOWLEDGE_GOVERNANCE)

| Field | Value |
|---|---|
| `task_id` | T-W15R-GOV-007 |
| `task_summary` | Register INC-WAVE15-PARSE-001 as a new rule entry in Foreman's FAIL-ONLY-ONCE registry (`.agent-workspace/foreman-v2/knowledge/FAIL-ONLY-ONCE.md`) |
| `iaa_trigger_category` | KNOWLEDGE_GOVERNANCE |
| `required_phases` | KNOWLEDGE_GOVERNANCE overlay (OVL-KG-001 through OVL-KG-005) + CORE invariants |
| `required_evidence_artifacts` | PREHANDOVER proof with FAIL-ONLY-ONCE patch section; `.agent-workspace/foreman-v2/knowledge/FAIL-ONLY-ONCE.md` committed on branch with new rule entry |
| `applicable_overlays` | iaa-category-overlays.md §KNOWLEDGE_GOVERNANCE; FAIL-ONLY-ONCE A-015 |
| `specific_rules` | A-015 (Tier 2 knowledge patches require full PREHANDOVER ceremony), A-021, A-026, A-028, A-029 |
| `iaa_notes` | Per A-015 and OVL-KG-004: the new rule entry must follow the established rule ID sequence (next available ID must be verified). Per OVL-KG-003: the patch must not modify or weaken any existing rule entries. IAA will verify the new entry is additive only. |

---

### B. Non-Qualifying Tasks

| Task ID | Task Summary | Reason Not Qualifying |
|---------|-------------|----------------------|
| T-W15R-GOV-008 | Foreman session memory | Session memory files are EXEMPT per trigger table; governed by the qualifying tasks above |
| T-W15R-GOV-009 | IAA Pre-Brief commissioning | This is the Pre-Brief itself — not an IAA assurance target |

---

## IAA Checks Declared for Handover

### Core Invariants (CORE-001 to CORE-022)

IAA will execute all 22 core invariant checks. Specific attention flags for this wave:

| Check | Attention Flag |
|---|---|
| CORE-013 (IAA invocation evidence) | MANDATORY — A-001 attested |
| CORE-015 (Session memory on branch) | MANDATORY — Foreman session memory must be committed |
| CORE-016 (Token file existence) | MANDATORY per A-029 — PREHANDOVER pre-populated with PENDING token |
| CORE-018 (Complete evidence artifact sweep) | MANDATORY — all declared deliverables must be committed, not just staged |
| CORE-019 (Re-invocation evidence if prior rejection) | N/A — no prior rejection on this wave |
| CORE-022 (secret_env_var: field naming) | FLAG — any new agent contract references must use `secret_env_var:` not `secret:` |

### AAWP_MAT Overlay

Full AAWP_MAT overlay checks will be executed. Key checks:

| Check | What IAA Will Verify |
|---|---|
| OVL-AM-CST-01 | CST gate between Batch A and Batch B is explicitly declared in the implementation plan as MANDATORY. Absence = REJECTION-PACKAGE (this is a critical integration point — api-builder output feeds ui-builder). |
| OVL-AM-CWT-01 | Wave 15R IBWR artefact (when produced at wave close) must include CWT PASS verdict. Not applicable to THIS governance PR — noted for Foreman's planning awareness. |

### KNOWLEDGE_GOVERNANCE Overlay

Full KNOWLEDGE_GOVERNANCE overlay (OVL-KG-001 through OVL-KG-005) will be executed against the FAIL-ONLY-ONCE registry patch.

| Check ID | What IAA Will Verify |
|---|---|
| OVL-KG-001 | Knowledge file change is additive only — no deletion or weakening of existing rules |
| OVL-KG-002 | Change is within Foreman's authorised write scope |
| OVL-KG-003 | Existing rule entries are unchanged in the commit diff |
| OVL-KG-004 | New rule ID follows established sequence (no ID collision, no gap-fill that skips IDs) |
| OVL-KG-005 | PREHANDOVER ceremony evidence present for knowledge governance patch (A-015) |

---

## PREHANDOVER Proof Structure Required

Foreman must produce a PREHANDOVER proof committed to branch **before** IAA invocation.
The PREHANDOVER proof must contain all of the following sections:

```
## Section 1 — Scope Declaration
- Branch: copilot/update-governance-orchestration-wave15
- SCOPE_DECLARATION.md current and matching `git diff --name-only origin/main...HEAD`
- List of ALL files changed in the PR

## Section 2 — Deliverable Evidence
For each task T-W15R-GOV-001 through -007:
- File path
- Committed SHA (must be a real committed SHA, not "pending" or "staged")
- Brief description of what was written

## Section 3 — INC-WAVE15-PARSE-001 Record
- Root cause summary (verbatim from issue #996)
- State machine transition: FAILED → remediation-in-progress
- Cross-references to implementation plan and BUILD_PROGRESS_TRACKER

## Section 4 — FAIL-ONLY-ONCE Patch Evidence (KNOWLEDGE_GOVERNANCE)
- New rule entry ID (confirm next available ID)
- Rule text as written
- Confirm existing entries unchanged (OVL-KG-003 compliance)

## Section 5 — qa-builder Delegation
- Complete list of RED tests delegated to qa-builder for Wave 15R Batch C
  (minimum: Edge Function 200 check, AI Gateway /parse check, UI document list render,
   UI retry button render, UI inline error log render)
- Delegation recorded as a separate qa-builder task or issue reference

## Section 6 — CST Gate Declaration
- Confirm the implementation plan explicitly names CST between Batch A and Batch B as MANDATORY
- Confirm CST scope is declared (api-builder output verification before ui-builder starts)

## Section 7 — Pre-IAA Commit Gate (A-021 / A-027 compliance)
- `git status` output showing working tree clean
- `git log --oneline -5` showing all deliverables committed
- `git diff --name-only origin/main...HEAD` matching SCOPE_DECLARATION.md

## Section 8 — IAA Token Reference (Pre-Populated per A-029)
- Token reference: PENDING — to be replaced by IAA post-verdict
  (format: IAA-session-prebrief-wave15r-wave15r-20260308-PASS or -REJECTION)
```

---

## CST / CWT / FCWT Obligations for Wave 15R

IAA declares the following testing gate obligations for Wave 15R:

| Gate | When | Mandatory? | IAA Action at Handover |
|---|---|---|---|
| **CST (Batch A → B)** | Before ui-builder starts Batch B | **MANDATORY** — Foreman has declared it explicitly in the issue; api-builder output (AI Gateway + Edge Function) is a prerequisite for UI work | IAA will REJECT Batch B PREHANDOVER if CST PASS is not evidenced |
| **CWT (Wave 15R close)** | Before Wave 15R IBWR completion | **MANDATORY** — standard CWT requirement | IAA will REJECT IBWR without CWT PASS verdict |
| **FCWT** | Not applicable to Wave 15R governance batch | N/A | Will apply at final production sign-over |

> **Prompt to Foreman**: The Wave 15R implementation plan must include explicit CST gate language between Batch A and Batch B, specifying:
> - CST scope: confirm `invoke-ai-parse-criteria` Edge Function returns 200 and AI Gateway `/parse` responds correctly before ui-builder commences Batch B
> - CST executor: qa-builder
> - CST blocking condition: Batch B cannot begin if CST fails

---

## Scope Blockers and Governance Conflicts

| # | Item | Category | Severity | Action Required |
|---|---|---|---|---|
| 1 | `wave-current-tasks.md` not yet updated for wave15r | Administrative | ⚠️ ADVISORY | Foreman must update `wave-current-tasks.md` to wave15r before IAA invocation. Stale file may cause SCOPE_DECLARATION mismatch (A-026). |
| 2 | Wave 15R is MULTI-BATCH — three separate builders (api-builder, ui-builder, qa-builder) | Architecture | ℹ️ INFORMATIONAL | Each batch PR requires its own IAA invocation. This governance batch PR is IAA-1 of N. Foreman must not combine Batch A, B, C code into a single PR. |
| 3 | TRS file path not confirmed in issue #996 | Scope gap | ⚠️ ADVISORY | Foreman must confirm the TRS file path (modules/mat/02-trs/?) before handover. IAA cannot verify T-W15R-GOV-005 without a committed file on the branch. |
| 4 | FAIL-ONLY-ONCE registry next available rule ID not confirmed | Administrative | ⚠️ ADVISORY | Foreman must confirm the next available rule ID in `.agent-workspace/foreman-v2/knowledge/FAIL-ONLY-ONCE.md` before writing the INC-WAVE15-PARSE-001 entry (OVL-KG-004 compliance). |
| 5 | qa-builder delegation requires a trackable task reference | Process | ⚠️ ADVISORY | The delegation to qa-builder for RED tests should be evidenced by an issue number or task reference. Foreman should open a qa-builder issue (or reference an existing one) before committing the PREHANDOVER. |
| 6 | No prior IAA rejection on wave15r — clean start | Positive | ✅ CLEAR | No A-030 correction addendum required. Fresh branch. |

---

## FFA Checks at Handover — Full Declaration

At IAA invocation for the wave15r governance batch PR, the following checks will be run:

### Category: CORE Invariants (22 checks)
All CORE-001 through CORE-022 — standard execution.

### Category: AAWP_MAT Overlay
Full overlay. Plus:
- OVL-AM-CST-01: CST gate declared in implementation plan for Batch A→B
- OVL-AM-CWT-01: CWT gate noted for future wave close (not checked in this governance PR)

### Category: KNOWLEDGE_GOVERNANCE Overlay
OVL-KG-001 through OVL-KG-005 — full execution against FAIL-ONLY-ONCE patch.

### FAIL-ONLY-ONCE Rules Active for This Wave
| Rule | Relevance |
|---|---|
| A-001 | IAA invocation evidence must be in PR artifacts |
| A-002 | No class exceptions — Foreman class must invoke IAA |
| A-015 | Full PREHANDOVER ceremony required for FAIL-ONLY-ONCE registry patch |
| A-021 | All deliverables committed before IAA invocation (Pre-IAA Commit Gate) |
| A-022 | All trigger categories re-evaluated (MIXED: AAWP_MAT + KNOWLEDGE_GOVERNANCE both active) |
| A-025 | PREHANDOVER token reference must be PENDING (not pre-filled as PASS) |
| A-026 | SCOPE_DECLARATION.md must match `git diff --name-only origin/main...HEAD` exactly |
| A-027 | Three-consecutive A-021 failure = systemic gap. Not applicable yet — clean start. |
| A-028 | SCOPE_DECLARATION format — list format, prior wave entries trimmed |
| A-029 | PREHANDOVER proof immutable post-commit — IAA writes dedicated token file, never edits PREHANDOVER |

---

## Pre-Brief Summary

| Item | Value |
|---|---|
| Wave | wave15r — Wave 15 Remediation (Criteria Parsing Pipeline) |
| IAA Trigger Categories | AAWP_MAT (primary) + KNOWLEDGE_GOVERNANCE (secondary) = MIXED |
| Qualifying Tasks | 7 (T-W15R-GOV-001 through -007) |
| Non-Qualifying Tasks | 2 (session memory, this Pre-Brief) |
| Total Core Checks at Handover | 22 |
| Total Overlay Checks at Handover | AAWP_MAT overlay + KNOWLEDGE_GOVERNANCE overlay (OVL-KG-001 to -005) |
| FAIL-ONLY-ONCE Rules Active | A-001, A-002, A-015, A-021, A-022, A-025, A-026, A-027, A-028, A-029 |
| Scope Blockers | 0 hard blockers; 4 advisories (see §Scope Blockers) |
| CST Gate Required | YES — Batch A → Batch B (mandatory per Foreman's declared plan) |
| CWT Gate Required | YES — at Wave 15R close before IBWR |
| Adoption Phase | PHASE_B_BLOCKING — verdicts are hard-blocking |

---

**Authority**: CS2 (Johan Ras / @APGI-cmy)
**Pre-Brief Reference**: IAA-PREBRIEF-WAVE15R-20260308
**IAA Version**: 6.2.0
**Self-Modification Lock**: SELF-MOD-IAA-001 ACTIVE
