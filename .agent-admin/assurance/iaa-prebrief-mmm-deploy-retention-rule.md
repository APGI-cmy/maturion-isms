# IAA Pre-Brief — Wave: mmm-deploy-retention-rule

**Wave**: mmm-deploy-retention-rule
**Issue**: #1279
**Branch**: copilot/issue-1279-mmm-deploy-retention
**Pre-Brief Date**: 2026-04-08
**IAA Version**: 6.2.0
**IAA Contract Version**: 2.4.0
**Adoption Phase**: PHASE_B_BLOCKING
**Authority**: CS2 (@APGI-cmy)

---

## Invocation Context

Invoked for Pre-Brief by the Copilot agent (assigned to issue #1279 by CS2).
This is a PHASE_0 Pre-Brief invocation — IAA does NOT execute Phases 2–4 this session.
Phases 2–4 assurance will be executed at handover when the builder invokes IAA.

---

## Step 0.2 — Wave Summary (from issue body)

Issue #1279 opened directly by CS2 (@APGI-cmy) and assigned to Copilot.

**Scope**: Amend `modules/MMM/00-app-description/MMM_app_description.md` to add explicit rules about:
1. MAT-specific deployments must be discontinued once no longer required for an active product path
2. Reusable deployment workflow patterns must be preserved and re-targeted to MMM rather than discarded
3. Distinction between retiring a legacy app deployment binding vs preserving reusable deployment scaffolding
4. MMM's deployment wave and runbook requirements must include migration/adoption of useful deployment workflow infrastructure from MAT

**Proposed sections**:
- §30.4 (new subsection under §30 Migration and Decommission Rules)
- §39P amendment (Deployment Wave Requirement — new clause)
- §39R amendment (Deployment Runbook — new clause)

**Nature of change**: Documentation update to existing Stage 1 App Description artifact.
No build artifacts. No CI changes. No agent contracts. No schema changes.

---

## Step 0.3 — Task Classification

### Qualifying Task: T-MMM-1279-001

| Field | Value |
|-------|-------|
| `task_id` | T-MMM-1279-001 |
| `task_summary` | Add §30.4 (decommission rule for MAT deployment discontinuation + workflow preservation) and new clauses to §39P and §39R in `MMM_app_description.md` |
| `iaa_trigger_category` | **PRE_BUILD_STAGE_MODEL** |
| `trigger_path_matched` | `modules/*/00-app-description/` — explicitly named in iaa-trigger-table.md v2.3.0 Step 7 |
| `NOT EXEMPT justification` | The App Description is a Stage 1 pre-build lifecycle governance artifact. The trigger table names this path explicitly. "Pure documentation" does not override a named trigger path. AMBIGUITY RULE (FAIL-ONLY-ONCE A-003) resolves any doubt to mandatory IAA. |
| `required_phases` | Phase 0 (this Pre-Brief) + Phase 2–4 at handover |
| `required_evidence_artifacts` | PREHANDOVER_PROOF.md, SCOPE_DECLARATION.md, Change-Propagation Audit log, IAA Pre-Brief (this file) |
| `applicable_overlays` | PRE_BUILD_GATES (OVL-PBG-001, OVL-PBG-002, OVL-PBG-008, OVL-PBG-009 advisory, OVL-PBG-014 BLOCKING), PRE_BRIEF_ASSURANCE (OVL-INJ-001) |
| `specific_rules` | OVL-PBG-014: Change-Propagation Audit BLOCKING; OVL-PBG-008: stage gating check (amendment must not inadvertently claim Stage 2+ completion); A-021: all changes committed before IAA invocation |

---

## Stage-Readiness View (CORE-025 / OVL-INJ-ADM-003)

Current MMM module stage status per BUILD_PROGRESS_TRACKER.md (last updated 2026-04-06):

| Stage | Name | Current Status | Impact from This Wave |
|-------|------|----------------|-----------------------|
| Stage 1 | App Description | COMPLETE (amending) | **This wave amends the completed artifact** |
| Stage 2 | UX Workflow & Wiring Spec | NOT_STARTED | No impact |
| Stage 3 | FRS | NOT_STARTED | No impact (not yet written) |
| Stage 4 | TRS | NOT_STARTED | No impact |
| Stage 5 | Architecture | IN_PROGRESS | **See Change-Propagation Audit requirement — builder must scope** |
| Stage 6 | QA-to-Red | NOT_STARTED | No impact |
| Stage 7 | PBFAG | NOT_STARTED | No impact |
| Stage 8 | Implementation Plan | NOT_STARTED | No impact |
| Stage 9 | Builder Checklist | NOT_STARTED | No impact |
| Stage 10 | IAA Pre-Brief | ACTIVE (this document) | Pre-Brief now active for this wave |
| Stage 11 | Builder Appointment | NOT_STARTED | Not applicable — Stage 1 amendment only |
| Stage 12 | Build | NOT_STARTED | Not applicable — Stage 1 amendment only |

**Stage gate blockers preventing Stage 11 (Builder Appointment)**:
- Stage 2 (UX Workflow & Wiring Spec): NOT_STARTED
- Stage 3 (FRS): NOT_STARTED
- Stage 4 (TRS): NOT_STARTED
- Stage 5 (Architecture): IN_PROGRESS (incomplete)
- Stages 6–9: NOT_STARTED

> Note: These blockers are for the MMM build programme generally, not for THIS wave.
> This wave IS a Stage 1 activity — it amends the Stage 1 artifact only.
> Stage gates 2–9 are deferred and do not block this wave's PR.

---

## FFA Checks Applicable (Q2 Answer — Detailed)

### BLOCKING Checks (REJECTION-PACKAGE triggers)

| Check ID | Check Name | Applicability Rationale |
|----------|-----------|-------------------------|
| OVL-PBG-001 | module.manifest.json slug matches directory | Always applied for PRE_BUILD_STAGE_MODEL PRs — verify `module_slug: "MMM"` matches `modules/MMM/` |
| OVL-PBG-002 | BUILD_PROGRESS_TRACKER module identity consistent | Always applied — verify tracker identity fields consistent with manifest |
| OVL-PBG-008 | Stage gating respected (no skipped stages) | Verify this amendment does NOT advance the module to a new stage or claim Stage 2+ completion. The PR must remain a Stage 1 amendment only. |
| **OVL-PBG-014** | **§7.1 Change-Propagation Audit — CRITICAL** | **App Description is explicitly named as a trigger artifact in OVL-PBG-014. A Change-Propagation Audit log entry MUST exist before IAA handover invocation. See Critical Blocker section below.** |
| OVL-INJ-001 | Pre-Brief Artifact Existence | Satisfied by this file — must be committed before handover |
| A-021 | All changes committed before IAA invocation | Working-tree-only state = immediate REJECTION-PACKAGE |
| A-026/A-028 | SCOPE_DECLARATION.md matches this wave's diff | Must list exactly the files in this PR — no stale prior-wave entries |

### ADVISORY Checks (documented, not REJECTION-PACKAGE)

| Check ID | Check Name | Notes |
|----------|-----------|-------|
| OVL-PBG-009 | Legacy directory numbering | MMM uses `00-app-description`, `01-frs` etc. (00/01/02 prefix). Advisory flag per OVL-PBG-009 — not a blocker, but IAA will document. |
| CORE-025 | Pre-Brief Stage-Readiness Declaration | Satisfied by this Pre-Brief document (Stage-Readiness View above) |

### NOT APPLICABLE to This Wave

| Check ID | Reason NOT Applicable |
|----------|----------------------|
| BD-000 (User Journey Trace) | No executable app behaviour delivered |
| AAWP_MAT overlay checks | Not an AAWP/MAT deliverable |
| OVL-PBG-003 | No architecture doc changes in this wave |
| OVL-PBG-004 | No FRS wave builder delegation in this wave |
| OVL-PBG-005 | No knowledge file AGENT_HANDOVER_AUTOMATION version citations modified |
| OVL-PBG-006 | BUILD_PROGRESS_TRACKER not modified in this wave |
| OVL-PBG-007 | Architecture doc not modified in this wave |
| OVL-PBG-010 | Stage 2 UX Spec check — not claiming Stage 5+ completion |
| OVL-PBG-011 | Stage 6 QA-to-Red — no build delegation |
| OVL-PBG-012 | Stage 7 PBFAG — no build delegation |
| OVL-PBG-013 | Stage 9 Builder Checklist — no build delegation |
| OVL-PBG-015 | §7.2 Runtime/Deployment Contract — not starting first build wave |
| OVL-PBG-016 | §7.3 Golden Path Verification Pack — not starting first build wave |

---

## CRITICAL BLOCKER — OVL-PBG-014: Change-Propagation Audit

**Status**: BLOCKING — REQUIRED at handover

**Trigger**: OVL-PBG-014 activates for "any PR that modifies App Description" and requires
a Change-Propagation Audit log entry confirming downstream artifacts have been assessed.

### Builder Must Produce Before Handover

The builder must produce a Change-Propagation Audit declaration (inline in PREHANDOVER_PROOF
or as a separate section) covering:

| Downstream Artifact | Current Status | Audit Assessment Required |
|--------------------|----------------|---------------------------|
| `modules/MMM/02-architecture/architecture.md` | IN_PROGRESS | **Must assess**: Does §39P amendment (deployment wave requirements) or §39R amendment (runbook requirements) or §30.4 (decommission rule) introduce concepts that architecture.md must reference or align with? Deployment section of architecture not yet present — if absent, builder must declare "no deployment section yet — deferred to Stage 5 completion." If deployment section exists or is planned, builder must declare alignment action. |
| `modules/MMM/01-frs/` (FRS) | NOT_STARTED | CLEAN — not yet written, no propagation required |
| `modules/MMM/` UX Wiring Spec | NOT_STARTED | CLEAN — not yet written, no propagation required |

**Expected outcome of audit**: Given that the architecture.md deployment section is not yet written (architecture is IN_PROGRESS with no deployment content found per IAA scan), the Change-Propagation Audit is likely to conclude: "No immediate propagation required — architecture deployment section deferred to Stage 5 completion. New §30.4/§39P/§39R rules will be reflected when architecture deployment section is authored."

**This declaration must be explicit in PREHANDOVER_PROOF** — an absent audit = OVL-PBG-014 FAIL = REJECTION-PACKAGE.

---

## Proof Phases Required at Handover (Q3 Answer)

### PREHANDOVER Ceremony — Required Artifacts

| Artifact | Path | Requirement |
|----------|------|-------------|
| IAA Pre-Brief | `.agent-admin/assurance/iaa-prebrief-mmm-deploy-retention-rule.md` | This file — must be committed BEFORE any build work begins (OVL-INJ-001) |
| PREHANDOVER_PROOF | Root-level `PREHANDOVER_PROOF_<wave>.md` or standard name | Must contain: `iaa_audit_token` pre-populated with expected token reference; Change-Propagation Audit declaration (OVL-PBG-014); file list matching SCOPE_DECLARATION |
| SCOPE_DECLARATION | Root-level `SCOPE_DECLARATION.md` | Must list ONLY the files changed in this PR — no stale entries from prior waves (A-026/A-028) |
| Change-Propagation Audit | Inline in PREHANDOVER_PROOF | See Critical Blocker section above |

### NOT Required for This Wave

| Artifact | Reason Not Required |
|----------|---------------------|
| Test evidence | No executable code |
| Schema migration evidence | No database changes |
| CI check run evidence | Standard merge gate only |
| Runtime/Deployment Contract (§7.2) | Not starting first build wave |
| Golden Path Verification Pack (§7.3) | Not starting first build wave |
| IBWR (Incremental Build Wave Record) | No build wave being executed |

---

## IAA Category Answer (Q1)

**Answer: `PRE_BUILD_STAGE_MODEL`**

Trigger table step 7 (iaa-trigger-table.md v2.3.0):
> "Does PR modify pre-build stage governance artifacts... `modules/*/00-app-description/`?"
> → YES → Category = PRE_BUILD_STAGE_MODEL. IAA = MANDATORY.

**NOT** AAWP_MAT (no executable deliverables).
**NOT** KNOWLEDGE_GOVERNANCE (no `.agent-workspace/*/knowledge/` files).
**NOT** CI_WORKFLOW (no `.github/workflows/` files).
**NOT** CANON_GOVERNANCE (no `governance/canon/` files).
**NOT** EXEMPT — the App Description is a named Stage 1 pre-build lifecycle governance artifact.
The AMBIGUITY RULE resolves any remaining doubt to mandatory IAA invocation.

---

## Stage 5–9 Gate Applicability (Q5 Answer)

**Stage 5–9 gates are DEFERRED for this wave — they do NOT apply.**

This wave IS Stage 1 (App Description amendment). Gates OVL-PBG-010 through OVL-PBG-013
have trigger conditions requiring Stage 5+ work or builder delegation — neither applies here.

The only PRE_BUILD_GATES check triggered by a Stage 1 amendment is:
- **OVL-PBG-014** (Change-Propagation Audit) — BLOCKING — see Critical Blocker section above.

All other pre-build stage gates (OVL-PBG-010 UX Wiring, OVL-PBG-011 QA-to-Red,
OVL-PBG-012 PBFAG, OVL-PBG-013 Builder Checklist, OVL-PBG-015 Runtime/Deployment Contract,
OVL-PBG-016 Golden Path Pack) are DEFERRED — applicable only when the module advances
to Stage 5+ or when first build wave is initiated.

---

## Scope Constraints (Q4 Answer — Additional Guidance)

### Confirmed In-Scope

| File | Change Type |
|------|-------------|
| `modules/MMM/00-app-description/MMM_app_description.md` | Add §30.4, add clause to §39P, add clause to §39R |

### Confirmed Out-of-Scope for This PR

| File | Reason |
|------|--------|
| `modules/MMM/02-architecture/architecture.md` | If Change-Propagation Audit determines architecture update needed, that is a SEPARATE wave — must NOT be included in this PR |
| Any `.github/agents/` files | Not a governance contract change |
| Any `governance/canon/` files | Not a canon change |
| Any test files | No executable code in scope |
| `modules/MMM/BUILD_PROGRESS_TRACKER.md` | Stage 1 status is already COMPLETE — no update needed unless approval formalisation is added (not requested) |

### Scope Blocker: A-021

All wave artifacts — including this Pre-Brief, PREHANDOVER_PROOF, SCOPE_DECLARATION, and the
amended `MMM_app_description.md` — must be committed and pushed before IAA handover invocation.
A working-tree-only state = immediate REJECTION-PACKAGE (FAIL-ONLY-ONCE A-021).

---

## FAIL-ONLY-ONCE Rules Applied This Pre-Brief

| Rule | Applied | Outcome |
|------|---------|---------|
| A-001 (own invocation evidence) | Pre-Brief artifact is this file | SATISFIED at handover when PREHANDOVER_PROOF references this pre-brief |
| A-002 (no class exceptions) | N/A for Pre-Brief — noted for handover | N/A |
| A-003 (ambiguity = mandatory) | Any doubt about PRE_BUILD_STAGE_MODEL vs EXEMPT → MANDATORY | APPLIED — category is PRE_BUILD_STAGE_MODEL |
| A-021 (commit before invocation) | Builder must commit all artifacts | FLAGGED as blocker |
| A-026/A-028 (SCOPE_DECLARATION accuracy) | SCOPE_DECLARATION must match this wave's diff only | FLAGGED as required |

---

## Summary for Builder

| Item | Status |
|------|--------|
| IAA category | PRE_BUILD_STAGE_MODEL |
| Stages covered | Stage 1 (amendment only) |
| Stage gates 2–9 | DEFERRED — not applicable to this wave |
| PREHANDOVER ceremony required | YES |
| Change-Propagation Audit (OVL-PBG-014) | **BLOCKING** — must be in PREHANDOVER_PROOF |
| Scope: files changed | `modules/MMM/00-app-description/MMM_app_description.md` only |
| Scope: architecture changes | OUT-OF-SCOPE for this PR |
| Pre-Brief artifact (OVL-INJ-001) | This file — must be committed before build begins |
| SCOPE_DECLARATION.md required | YES — must list this wave's files only |
| Test evidence required | NO |
| Schema evidence required | NO |
| Expected IAA verdict at handover | ASSURANCE-TOKEN if OVL-PBG-014 audit is declared and A-021/A-026/A-028 satisfied |

---

## Pre-Brief Status

**STATUS: COMPLETE**

This Pre-Brief is committed and satisfies OVL-INJ-001 (Pre-Brief Artifact Existence).
The builder may proceed with the Stage 1 amendment and must invoke IAA at handover
after committing all artifacts per A-021.

---

**IAA Version**: 6.2.0 | **Contract Version**: 2.4.0 | **Session**: pre-brief-mmm-deploy-retention-rule
**Authority**: CS2 (@APGI-cmy) | **Phase**: PHASE_B_BLOCKING
**Date**: 2026-04-08
