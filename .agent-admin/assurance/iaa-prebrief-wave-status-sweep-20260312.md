# IAA Pre-Brief — Wave: wave-status-sweep-20260312

**Pre-Brief Version**: 1.0.0  
**Date**: 2026-03-12  
**Wave**: wave-status-sweep-20260312 — Foreman Analogy Sweep (MAT/AIMC/LKIAC outstanding waves)  
**Branch**: copilot/commission-foreman-analogy-sweep  
**PR**: #1089 (DRAFT — [WIP] [MAT-17] Commission foreman-led analogy and status sweep)  
**Produced By**: independent-assurance-agent v6.2.0  
**Session**: session-wave-status-sweep-prebrief-20260312  
**IAA Phase at Execution**: PHASE_B_BLOCKING  
**Authority**: CS2 (Johan Ras / @APGI-cmy)  
**Triggering Issue**: Issue opened by CS2 under this repository with foreman-v2-agent assigned  

---

## Phase 0 — Pre-Brief Attestation

This artifact was produced per IAA contract Phase 0 — PRE-BRIEF INVOCATION. IAA does NOT
execute Phase 2–4 assurance for this wave until/unless a triggering artifact is committed.
This Pre-Brief is committed **before** any wave deliverable is produced — per OVL-INJ-001
pass condition.

---

## Step 0.2 — Wave Scope Extracted from wave-current-tasks.md

> **Note**: At the time of this Pre-Brief, `wave-current-tasks.md` does not yet contain a
> task register for this wave (wave-status-sweep-20260312). The task register is derived from
> the triggering request, as declared below. The foreman must update `wave-current-tasks.md`
> with this wave's task register as a first action.

**Wave Number (N)**: wave-status-sweep-20260312  
**Wave Type**: POLC-Orchestration/Analysis — governance status sweep  
**Prior Wave Completed**: Wave 17 (PR #1081 — User-Guided AI Parsing — MERGED 2026-03-11)  
**IAA Session for Wave 17**: Not yet recorded in IAA memory (wave17 IAA session memory absent — wave17 pre-brief: `.agent-admin/assurance/iaa-prebrief-wave17-user-guided-parsing.md` present, SHA a569450)  

**Declared Tasks (from triggering request):**

| Task ID | Description | Execution |
|---------|-------------|-----------|
| T-SWEEP-001 | Read and analyse `modules/mat/03-implementation-plan/implementation-plan.md` | Foreman read-only analysis |
| T-SWEEP-002 | Read and analyse `governance/EXECUTION/AIMC_LKIAC_COMBINED_EXECUTION_PLAN.md` | Foreman read-only analysis |
| T-SWEEP-003 | Survey IAA + Foreman session memory for wave status (wave16, wave17) | Foreman read-only analysis |
| T-SWEEP-004 | Produce status sweep artifact at `.agent-admin/status-sweep/` or similar path | Foreman output — governance document |
| T-SWEEP-005 (implied) | Update `wave-current-tasks.md` with this wave's task register | Foreman personal file |
| T-SWEEP-006 (implied) | Produce PREHANDOVER proof and session memory | Governance ceremony |

---

## Step 0.3 — Trigger Category Classification

### Trigger Table Applied (iaa-trigger-table.md v2.1.0)

| Task | Files Touched | Trigger Category | IAA Required? |
|------|---------------|-----------------|---------------|
| T-SWEEP-001 | `modules/mat/03-implementation-plan/implementation-plan.md` — READ ONLY | N/A (read-only) | NO |
| T-SWEEP-002 | `governance/EXECUTION/AIMC_LKIAC_COMBINED_EXECUTION_PLAN.md` — READ ONLY | N/A (read-only) | NO |
| T-SWEEP-003 | `.agent-workspace/` session memory — READ ONLY | N/A (read-only) | NO |
| T-SWEEP-004 | New file at `.agent-admin/status-sweep/*.md` | NOT in triggering paths | NO |
| T-SWEEP-005 | `.agent-workspace/foreman-v2/personal/wave-current-tasks.md` | Session memory / personal | NO — session memory category |
| T-SWEEP-006 | PREHANDOVER proof + session memory in `.agent-workspace/` | Session memory ceremony | NO — session memory category |

### Classification Verdict: **EXEMPT**

**Justification:**
1. No `.github/agents/` files modified → AGENT_CONTRACT not triggered
2. No `governance/canon/` or `CANON_INVENTORY.json` modified → CANON_GOVERNANCE not triggered
3. No `.github/workflows/` files modified → CI_WORKFLOW not triggered
4. No `modules/mat/`, `packages/ai-centre/`, or AAWP architecture files modified → AAWP_MAT not triggered
5. No `governance/quality/agent-integrity/` files modified → AGENT_INTEGRITY not triggered
6. No `.agent-workspace/*/knowledge/` files modified → KNOWLEDGE_GOVERNANCE not triggered
7. Output at `.agent-admin/status-sweep/` is NOT in any triggering path
8. Wave is unambiguously doc-only / analysis-only within declared scope

**AMBIGUITY RULE CHECK**: No ambiguity detected. Classification is clear: EXEMPT.  
**FAIL-ONLY-ONCE A-003**: Applied — no ambiguity to resolve.

---

## Step 0.4 — Qualifying Tasks

Per the classification above: **ZERO qualifying tasks** under the declared scope.

> **IAA STATUS FOR THIS WAVE (declared scope): NO HARD-GATE IAA REQUIRED AT HANDOVER**
>
> The Foreman may proceed without an IAA Phase 2–4 assurance review, provided the scope
> remains strictly within the declared boundaries. No ASSURANCE-TOKEN is required to open
> or merge the PR for this wave under the declared scope.
>
> **Exception**: If any out-of-scope file is committed (see Conditional Trigger Table below),
> IAA MUST be invoked BEFORE the PR is opened. Merging a triggering artifact without IAA
> invocation is a PHASE_B_BLOCKING governance violation.

---

## Step 0.4a — Conditional Trigger Table (MANDATORY — Foreman must read)

The following scope expansions would IMMEDIATELY elevate this wave to IAA-required.
If any of these occur, the Foreman MUST stop, invoke IAA Pre-Brief amendment, and
invoke IAA Phase 2–4 assurance BEFORE opening the PR.

| Scope Expansion | Trigger Category Activated | IAA Required? |
|-----------------|---------------------------|---------------|
| Any `.github/agents/*.md` file modified | AGENT_CONTRACT | YES — MANDATORY |
| `governance/EXECUTION/AIMC_LKIAC_COMBINED_EXECUTION_PLAN.md` **MODIFIED** (not just read) | CANON_GOVERNANCE (possible) | YES — if governance/canon/ path, or AAWP_MAT if plan update constitutes a deliverable amendment |
| `modules/mat/03-implementation-plan/implementation-plan.md` **MODIFIED** | AAWP_MAT | YES — MANDATORY |
| Any `governance/canon/*.md` file modified | CANON_GOVERNANCE | YES — MANDATORY |
| Any `.github/workflows/*.yml` modified | CI_WORKFLOW | YES — MANDATORY |
| Any `.agent-workspace/*/knowledge/` file modified | KNOWLEDGE_GOVERNANCE | YES — MANDATORY |
| The status sweep document is written to `governance/` or `modules/` (not `.agent-admin/`) | CANON_GOVERNANCE or AAWP_MAT (path-dependent) | EVALUATE and invoke IAA if triggering |
| Any production code, schema, or UI file modified | AAWP_MAT | YES — MANDATORY |

> **Critical Note on `governance/EXECUTION/` path**: The `AIMC_LKIAC_COMBINED_EXECUTION_PLAN.md`
> is at `governance/EXECUTION/` — NOT at `governance/canon/`. If this file is modified as
> part of status updates, IAA evaluates whether this constitutes a CANON_GOVERNANCE or
> AAWP_MAT trigger. **Foreman must not modify this file without prior IAA Pre-Brief amendment
> and Phase 2–4 review.** Read-only access is cleared.

---

## Step 0.4b — FFA Checks IAA Will Run at Handover (if invoked)

If this wave is later elevated to IAA-required (due to scope expansion), the following
FAIL-ONLY-ONCE checks apply. Even for an EXEMPT wave, the Foreman must comply with the
following governance requirements at handover:

### Mandatory at ALL handovers (including EXEMPT):

| Rule | Check | Required Evidence |
|------|-------|------------------|
| A-026 | `SCOPE_DECLARATION.md` matches `git diff --name-only origin/main...HEAD` exactly | `git diff` output in PREHANDOVER proof |
| A-028 | `SCOPE_DECLARATION.md` format compliance — list format, no prior-wave entries | Clean list of this wave's files only |
| A-025 | No pre-filled anticipated IAA token references (N/A for EXEMPT — no token expected) | N/A |
| A-021 | All files committed before any IAA invocation (N/A — no IAA required for EXEMPT) | N/A |

### If IAA is later invoked (scope elevation):

| Rule | Check | Required Evidence |
|------|-------|------------------|
| A-001 | IAA invocation evidence in PREHANDOVER proof | Token reference = `PENDING` pre-commit; replaced post-verdict |
| A-029 | PREHANDOVER proof immutability — READ ONLY post-commit | IAA writes dedicated token file; PREHANDOVER not edited |
| A-021 | Commit + push BEFORE IAA invocation | `git log --oneline` showing all artifacts committed |
| A-026 | SCOPE_DECLARATION.md matches PR diff exactly | Must be updated before IAA invocation |
| OVL-INJ-001 | This Pre-Brief artifact present and committed before builder task artifacts | ✅ SATISFIED — this file is committed first |

---

## Step 0.4c — PREHANDOVER Proof Structure Required

For an **EXEMPT** wave, the PREHANDOVER proof must contain at minimum:

```markdown
## Pre-Brief Artifact
Path: .agent-admin/assurance/iaa-prebrief-wave-status-sweep-20260312.md
Status: COMMITTED (SHA: [actual SHA])

## SCOPE_DECLARATION Verification
Matches git diff: [YES/NO — show git diff --name-only output]

## IAA Invocation Status
Category: EXEMPT — no triggering artifacts in scope
IAA Required: NO (per iaa-prebrief-wave-status-sweep-20260312.md)
IAA Token: NOT REQUIRED — EXEMPT wave

## Scope Confirmation
Files committed:
- .agent-admin/assurance/iaa-prebrief-wave-status-sweep-20260312.md (IAA pre-brief)
- .agent-admin/status-sweep/[status-sweep-document].md (primary deliverable)
- .agent-workspace/foreman-v2/personal/wave-current-tasks.md (session admin)
- SCOPE_DECLARATION.md (updated to reflect this wave only)
- [any other files — must be EXEMPT category only]

Confirmed: No triggering artifacts (no .github/agents/, no governance/canon/, 
           no .github/workflows/, no modules/mat/ modifications, no production code)
```

**If scope expands to triggering artifacts**, the PREHANDOVER proof must additionally contain:
- Token reference field: `iaa_token: PENDING` (pre-commit) → replaced with actual token post-verdict
- Per A-029: PREHANDOVER proof is READ-ONLY post-commit; IAA writes dedicated token file
- All CORE and category overlay evidence per IAA Phase 3

---

## Step 0.5 — Scope Blockers and Governance Conflicts Visible Now

### Current State Assessment (as of 2026-03-12)

#### MAT Programme Status

| Wave | Status | Notes |
|------|--------|-------|
| Waves 0–12 | ✅ COMPLETE | Core platform delivered (session-078/080/081) |
| Wave 13 | ⏳ OPEN — awaiting CS2 wave-start | Live deployment wiring regression fix |
| Wave 14 (subwaves 14.1–14.14) | 🔴 RED — BLOCKED | UX workflow gap remediation — GAP-W01–W14; RED QA spec complete but builder delegation pending |
| Wave 16.1 | ✅ COMPLETE (implied — part of wave16-full-batch) | Evidence Collection Page Wire |
| Wave 16.2 | ✅ COMPLETE (wave-16.2-gap-remediation, ASSURANCE-TOKEN PASS 2026-03-11) | Frontend UX completeness |
| Wave 16.3 | 🔴 BLOCKED | AI Scoring Edge Function — blocked pending Wave 16.5 + AIMC Waves 3–4 |
| Wave 16.4 | 🔴 BLOCKED | Report Generation Edge Function — blocked pending Wave 16.5 + 16.3 + AIMC |
| Wave 16.5 | 🔴 BLOCKED | AIMC Scoring+Reporting Wiring — blocked on AIMC CL-12 |
| Wave 16.6 | ✅ COMPLETE (part of wave16-full-batch, 2026-03-10) | Schema + Audit completeness |
| Wave 16.7 | ✅ COMPLETE (implied — part of wave16-full-batch) | ARC Portal Frontend |
| Wave 16.8 | Status unknown | Documentation gaps — mat-specialist |
| Wave 16.9 | 🅿️ PARKED | Future considerations — LOW priority |
| Wave 17 | ✅ COMPLETE (PR #1081 MERGED 2026-03-11) | User-Guided AI Parsing Instruction System |
| MAT Waves 7–9 | 🔴 BLOCKED on AIMC | AIMC Advisory/Analysis/Embeddings integration — blocked on AIMC CL-12 |
| Wave 6 (Deployment) | Status requires confirmation | CWT on production required |

#### AIMC/LKIAC Programme Status (as of AIMC Plan v1.4.0 — last updated 2026-03-01)

| Wave | Status | Next Action |
|------|--------|-------------|
| CL-0: Governance Foundation | ✅ COMPLETE (2026-03-01) | Gate closed |
| CL-1: Maturion Persona Migration | ✅ COMPLETE (2026-03-01) | CP-1 CS2 review pending |
| CL-2: Legacy Knowledge Inventory | ⏳ PENDING | Awaiting CS2 wave-start issue |
| CL-3: Deprecation Register Activation | ⏳ PENDING | Awaiting CS2 wave-start issue |
| CL-3.5: AI Data Sources Registry | ⏳ PENDING (PROPOSED) | CP-3.5 CS2 schema approval required |
| CL-4: AIMC Audit Phase A | ⏳ PENDING | Awaiting CS2 wave-start issue |
| CL-5: Knowledge Upload Centre Spec | ⏳ IN PROGRESS (v1.1.0) | CL-5-D2 upload arch review outstanding |
| CL-6 through CL-15 | ⏳ PENDING | All blocked on CL-2–CL-5 completion |

#### Open Blockers (cross-programme)

| Blocker ID | Description | Blocking | Resolution |
|------------|-------------|---------|------------|
| BL-AIMC-01 | AIMC CL-2 through CL-5 not yet started | MAT Waves 7, 8, 9, 16.3, 16.4, 16.5 | CS2 wave-start issue(s) required |
| BL-MAT-W14 | Wave 14 builder delegation not executed | MAT UX gap remediation | CS2 direction on priority |
| BL-MAT-W6 | Wave 6 (Deployment/CWT) status unclear | Production sign-over / FCWT | CWT/FCWT evidence required |
| BL-CI-001 | wave-ci-supabase-migrate-1051 REJECTION_R3 | PR on separate branch — not blocking this sweep | CS2 must approve CI run |

#### Governance Conflicts Visible Now

1. **wave-current-tasks.md stale on wave17**: The foreman's `wave-current-tasks.md` shows
   wave17 with `status: ASSURANCE_TOKEN_PENDING` — but PR #1081 is now MERGED. The foreman
   should confirm IAA wave17 assurance was completed and update wave-current-tasks.md to
   `COMPLETE`.

2. **IAA wave17 session memory absent**: No IAA session memory file found for wave17 assurance.
   IAA cannot confirm wave17 ASSURANCE-TOKEN was issued. The foreman's status sweep should
   investigate and surface this gap.

3. **No FCWT/CWT for Wave 17**: Wave 17 merged (PR #1081). No CWT PASS evidence in IAA memory
   for this wave. Per `COMBINED_TESTING_PATTERN.md §5.2`, CWT is mandatory before IBWR completion.
   The status sweep should confirm whether CWT was executed for Wave 17.

4. **AIMC Plan v1.4.0 date**: The AIMC/LKIAC Combined Execution Plan is dated 2026-03-01 and
   has not been updated to reflect wave progress since that date. The status sweep should
   note the staleness delta.

---

## Step 0.6 — Requested Deliverables from Foreman (this wave)

| # | Request | Expected Output |
|---|---------|-----------------|
| 1 | Cross-programme status analogy sweep | `.agent-admin/status-sweep/status-sweep-wave-status-sweep-20260312.md` |
| 2 | Outstanding blocker register | Embedded in sweep document |
| 3 | Dependency map (MAT → AIMC → LKIAC) | Embedded in sweep document |
| 4 | Recommended next foreman actions | Embedded in sweep document (advisory, CS2 must authorise) |
| 5 | PREHANDOVER proof (minimal — EXEMPT wave) | `.agent-workspace/foreman-v2/memory/PREHANDOVER-session-wave-status-sweep-20260312.md` |
| 6 | Session memory | `.agent-workspace/foreman-v2/memory/session-wave-status-sweep-20260312.md` |
| 7 | SCOPE_DECLARATION.md update | `SCOPE_DECLARATION.md` (list format, this wave files only) |

---

## Pre-Brief Summary

```yaml
wave: wave-status-sweep-20260312
branch: copilot/commission-foreman-analogy-sweep
pr: "#1089"
wave_type: POLC-Orchestration/Analysis
primary_deliverable: governance status sweep document at .agent-admin/status-sweep/
iaa_trigger_category: EXEMPT
iaa_hard_gate_required: false
qualifying_tasks: 0
conditional_triggers: see Step 0.4a
iaa_status_for_this_wave: NO_HARD_GATE_IAA_REQUIRED (EXEMPT — declared scope)
prebrief_status: COMMITTED
prebrief_artifact: .agent-admin/assurance/iaa-prebrief-wave-status-sweep-20260312.md
produced_by: independent-assurance-agent v6.2.0
session: session-wave-status-sweep-prebrief-20260312
date: 2026-03-12
adoption_phase: PHASE_B_BLOCKING
```

---

**Authority**: CS2 (Johan Ras / @APGI-cmy)  
**IAA Version**: 6.2.0 | **Contract**: 2.2.0  
**STOP-AND-FIX Mandate**: ACTIVE — This wave is EXEMPT under declared scope. Any scope expansion → IAA MANDATORY.
