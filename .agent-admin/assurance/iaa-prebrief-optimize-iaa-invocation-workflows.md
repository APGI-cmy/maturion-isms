# IAA Pre-Brief — Wave: optimize-iaa-invocation-workflows

**Agent**: independent-assurance-agent  
**Version**: 6.2.0 (contract 2.5.0)  
**Wave**: optimize-iaa-invocation-workflows  
**Branch**: copilot/optimize-iaa-invocation-workflows  
**Issue**: maturion-isms#1311  
**Date**: 2026-04-09  
**Invoking Agent**: foreman-v2-agent  
**Producing Agent**: foreman-v2-agent (planning-only — no builder delegation)  
**IAA Session Mode**: PHASE 0 — PRE-BRIEF  
**Adoption Phase**: PHASE_B_BLOCKING  

---

## Phase 1 — Preflight Attestation (Pre-Brief Mode)

**Identity**: I am independent-assurance-agent, class: assurance, version 6.2.0.  
**Tier 2 loaded**: Knowledge version 3.5.0. All required files present (confirmed).  
**CANON_INVENTORY hash check**: PASS — all 199 entries have valid `file_hash` values. IAA canon (`INDEPENDENT_ASSURANCE_AGENT_CANON.md`) present and registered.  
**FAIL-ONLY-ONCE registry**: PRESENT — rules A-001 through A-035 active. No open breaches.  
**Orientation Mandate**: Acknowledged. Proceeding as quality engineer, not file auditor.  
**Adoption Phase**: PHASE_B_BLOCKING — Hard gate ACTIVE.  
**STOP-AND-FIX mandate**: ACTIVE. No class exceptions. Ambiguity resolves to mandatory invocation.

> Note: CANON_INVENTORY uses field `file_hash` (not `file_hash_sha256`). All 199 entries contain valid non-null, non-empty, non-000000 hash values. IAA contract cross-reference note: field naming difference between contract text and actual inventory schema — this is a pre-existing structural discrepancy, not a new gap.

> Note: FAIL-ONLY-ONCE contract reference cites A-037 (PHASE_B_BLOCKING_TOKEN requirement in token files). FAIL-ONLY-ONCE.md registry (v2.5.0) covers A-001 through A-035. The A-037 reference appears in the newer contract text, which postdates the current IAA registry and is not yet reflected there. IAA applies the PHASE_B_BLOCKING_TOKEN requirement as stated in the contract regardless of the registry gap.

---

## Phase 0 — Pre-Brief Execution

### Step 0.1 — Invocation Mode Confirmed

This session was triggered by a comment containing `[IAA PRE-BRIEF REQUEST]` from foreman-v2-agent for wave `optimize-iaa-invocation-workflows`.  
**Mode**: PRE-BRIEF. Phase 2–4 assurance NOT executed. Pre-Brief artifact generation ONLY.

---

### Step 0.2 — Wave Current Tasks (Read in Full)

Source: `.agent-workspace/foreman-v2/personal/wave-current-tasks.md`

**Wave**: optimize-iaa-invocation-workflows  
**CS2 Authorization**: Issue #1311 opened by @APGI-cmy (CS2 = Johan Ras), assigned to foreman-v2-agent.

**Tasks declared**:

| Task ID | Summary |
|---------|---------|
| T1 | IAA Pre-Brief → `.agent-admin/assurance/iaa-prebrief-optimize-iaa-invocation-workflows.md` |
| T2 | D1 Workflow Review Artifact → `.agent-workspace/foreman-v2/memory/iaa-inject-watchdog-reimplementation-review-20260409.md` |
| T3 | D2/D3 Reimplementation Strategy/Plan → `.agent-workspace/foreman-v2/memory/` |
| T4 | D4 Follow-up GitHub Issues (administrative — no committed files) |
| T5 | PREHANDOVER proof → `.agent-workspace/foreman-v2/memory/PREHANDOVER-session-162-optimize-iaa-inject-watchdog-20260409.md` |
| T6 | IAA final audit and token → `.agent-admin/assurance/iaa-token-session-162-optimize-iaa-inject-watchdog-20260409.md` |

**Workflows under review (D1 scope — review only, NOT modified in this wave)**:

| Workflow | Status |
|----------|--------|
| `.github/workflows/iaa-prebrief-inject.yml` | DISABLED — issue #1061 |
| `.github/workflows/iaa-prebrief-gate.yml` | DISABLED — issue #1061 |
| `.github/workflows/governance-watchdog.yml` | ACTIVE — Gaps 1, 2A, 2, 3 |
| `.github/workflows/foreman-reanchor.yml` | DISABLED — issue #1061, stale IAA wording |
| `.github/workflows/injection-audit-report.yml` | DISABLED — manual-only |

---

### Step 0.3 — Task Classification Per Trigger Table

**Trigger table applied**: `iaa-trigger-table.md` v2.4.0

Classification decision flow applied to each declared artifact:

| Task | Artifact Path | Artifact Type | Trigger Category | Qualifying? | Rationale |
|------|--------------|---------------|-----------------|------------|-----------|
| T1 | `.agent-admin/assurance/iaa-prebrief-optimize-iaa-invocation-workflows.md` | IAA Pre-Brief (IAA is generating this artifact) | N/A — IAA-generated ceremony artifact | NOT QUALIFYING (IAA cannot self-classify its own pre-brief) | IAA generates this; it is itself the pre-brief |
| T2 | `.agent-workspace/foreman-v2/memory/iaa-inject-watchdog-reimplementation-review-20260409.md` | Foreman session memory / review artifact | GOVERNANCE_AUDIT | NOT QUALIFYING — EXEMPT | Session memory in `.agent-workspace/*/memory/` — review artifact only; no governance operational state modified |
| T3 | `.agent-workspace/foreman-v2/memory/session-162-*.md` (strategy/plan) | Foreman session memory | GOVERNANCE_AUDIT | NOT QUALIFYING — EXEMPT | Session memory files |
| T4 | GitHub issues (D4) | Administrative action — no committed files on branch | EXEMPT | NOT QUALIFYING | GitHub issue creation produces no committed artifacts |
| T5 | `.agent-workspace/foreman-v2/memory/PREHANDOVER-session-162-*.md` | PREHANDOVER proof | GOVERNANCE_AUDIT | NOT QUALIFYING — EXEMPT | PREHANDOVER proof files explicitly listed as EXEMPT in trigger table |
| T6 | `.agent-admin/assurance/iaa-token-session-162-*.md` | IAA token file | GOVERNANCE_AUDIT | NOT QUALIFYING — EXEMPT | IAA token files explicitly listed as EXEMPT in trigger table |
| Already committed | `.agent-workspace/foreman-v2/personal/wave-current-tasks.md` | Foreman planning artifact | GOVERNANCE_AUDIT | NOT QUALIFYING — EXEMPT | Agent workspace personal planning file; no governance operational change |

**Ambiguity Rule Check** (FAIL-ONLY-ONCE A-003):

The wave's SUBJECT is IAA workflow governance and CI workflow optimization. However, the trigger table is **file-based** (what artifacts are in the PR diff), not subject-based. The artifacts in this PR are entirely planning/memory/ceremony files in `.agent-workspace/` and `.agent-admin/assurance/`. No `.github/workflows/` files are modified. No `.github/agents/` files modified. No `governance/canon/` files modified.

> **AMBIGUITY ASSESSMENT**: Classification is NOT ambiguous. The PR diff contains exclusively GOVERNANCE_AUDIT EXEMPT artifacts (session memory, PREHANDOVER proof, IAA ceremony files). The subject matter of the planning work does not elevate the artifact classification. This is a distinguishable, clear EXEMPT scenario.

**Result**: **NO QUALIFYING TASKS** per the IAA trigger table.

**Final wave classification**: `GOVERNANCE_AUDIT EXEMPT (PLANNING_ONLY)`

> Per contract Step 0.3: "If no qualifying tasks: confirm `PHASE_A_ADVISORY` status."  
> **PHASE_A_ADVISORY status confirmed for this wave at final T6 audit.**  
> 
> **Implication for T6**: When foreman invokes IAA for T6 final audit, IAA will apply GOVERNANCE_AUDIT EXEMPT classification and issue `ASSURANCE-TOKEN (EXEMPT — IAA not triggered)` — IF AND ONLY IF the final PR diff contains only the declared EXEMPT artifacts. If any unexpected triggering artifact is committed to the branch before T6, IAA must re-classify (FAIL-ONLY-ONCE A-022: re-evaluate ALL trigger categories on every invocation).

---

### Step 0.3b — Anti-Regression Obligations

**Prior session learning_notes reviewed** (last 5 sessions):

- session-wave20-atomic-write-back-20260318-R2: R1 rejection had 5 ceremony failures; R2 PASS. Learning: commit all artifacts before IAA invocation (A-021).
- session-wave20-atomic-write-back-20260318: REJECTION-PACKAGE — merge gate parity failure; SCOPE_DECLARATION stale; artifacts not committed. Learning: HFMC-02 and A-021 critical.
- session-waveOVLINJ-20260307: ASSURANCE-TOKEN. Learning: GOVERNANCE_AUDIT + KNOWLEDGE_GOVERNANCE mixed = mandatory.

**Known recurring failure patterns for this wave type (PLANNING_ONLY/CEREMONY)**:

| Pattern | Description | Anti-Regression Obligation |
|---------|-------------|---------------------------|
| **A-021 (Commit-before-IAA)** | Producing agent invokes IAA before committing all artifacts — most frequent recurring failure across sessions | Foreman MUST commit ALL declared artifacts (D1, D2/D3, PREHANDOVER proof, SCOPE_DECLARATION.md update) before invoking IAA at T6. IAA will verify via `git ls-files` or `git ls-tree HEAD`. |
| **HFMC-02 (SCOPE_DECLARATION parity)** | SCOPE_DECLARATION.md not updated for current wave before T6 invocation | Foreman MUST update the repo-root `SCOPE_DECLARATION.md` (not `.agent-workspace/foreman-v2/personal/SCOPE_DECLARATION.md`) for the `optimize-iaa-invocation-workflows` wave and list all committed artifacts before T6. |
| **A-029 (PREHANDOVER token pre-population)** | iaa_audit_token field left as PENDING (old A-025 pattern) — violates §4.3b | PREHANDOVER proof must pre-populate `iaa_audit_token: IAA-session-162-optimize-iaa-inject-watchdog-20260409-PASS` at commit time. IAA writes dedicated token file post-verdict. |
| **HFMC-01 (Ripple section)** | PREHANDOVER proof missing `## Ripple/Cross-Agent Assessment` section | PREHANDOVER proof MUST include a non-empty ripple/cross-agent assessment section. For a planning wave this should assess: downstream CI workflow changes will require future IAA T6 invocations; governance-liaison-isms-agent ripple may apply when implementation issues are raised. |

**Confirmation**: No Systemic or Substantive build-correctness failure patterns apply (this is a PLANNING_ONLY wave with no code/schema/test deliverables).

---

### Step 0.4 — Pre-Brief Artifact

**Qualifying Tasks Found**: 0  
**Wave IAA Trigger Status**: EXEMPT — GOVERNANCE_AUDIT (PLANNING_ONLY)  
**Phase_A_Advisory Confirmed**: YES

#### T1 — IAA Pre-Brief

| Field | Value |
|-------|-------|
| `task_id` | T1 |
| `task_summary` | IAA Phase 0 Pre-Brief generation and commitment |
| `iaa_trigger_category` | N/A — IAA is the generating agent |
| `required_phases` | Phase 0 only (this document) |
| `required_evidence_artifacts` | `.agent-admin/assurance/iaa-prebrief-optimize-iaa-invocation-workflows.md` (this file) |
| `applicable_overlays` | None — pre-brief mode does not execute overlays |
| `specific_rules` | Contract §Phase 0 (Steps 0.1–0.6) |

#### T2 — D1 Workflow Review Artifact

| Field | Value |
|-------|-------|
| `task_id` | T2 |
| `task_summary` | Review artifact for 5 discontinued/active IAA inject/watchdog workflows |
| `iaa_trigger_category` | GOVERNANCE_AUDIT — EXEMPT |
| `required_phases` | N/A — no IAA phases triggered at T2 |
| `required_evidence_artifacts` | `.agent-workspace/foreman-v2/memory/iaa-inject-watchdog-reimplementation-review-20260409.md` |
| `applicable_overlays` | None (EXEMPT) |
| `specific_rules` | Must be committed before T6 IAA invocation (A-021) |

#### T3 — D2/D3 Reimplementation Strategy/Plan

| Field | Value |
|-------|-------|
| `task_id` | T3 |
| `task_summary` | Reimplementation strategy and recommended workflow set decision |
| `iaa_trigger_category` | GOVERNANCE_AUDIT — EXEMPT (session memory/planning artifact) |
| `required_phases` | N/A — no IAA phases triggered |
| `required_evidence_artifacts` | D2/D3 artifact in `.agent-workspace/foreman-v2/memory/` |
| `applicable_overlays` | None (EXEMPT) |
| `specific_rules` | Must be committed before T6 (A-021) |

#### T4 — D4 GitHub Issues

| Field | Value |
|-------|-------|
| `task_id` | T4 |
| `task_summary` | Create follow-up GitHub issues for actual implementation work |
| `iaa_trigger_category` | EXEMPT — administrative action; no committed files |
| `required_phases` | N/A |
| `required_evidence_artifacts` | None (no committed artifacts; issue URLs may be referenced in session memory) |
| `applicable_overlays` | None |
| `specific_rules` | Future implementation issues will each require their own IAA Pre-Brief and T6 audit |

#### T5 — PREHANDOVER Proof

| Field | Value |
|-------|-------|
| `task_id` | T5 |
| `task_summary` | Foreman PREHANDOVER ceremony proof for T6 IAA invocation |
| `iaa_trigger_category` | GOVERNANCE_AUDIT — EXEMPT |
| `required_phases` | N/A — PREHANDOVER proof is ceremony artifact |
| `required_evidence_artifacts` | `.agent-workspace/foreman-v2/memory/PREHANDOVER-session-162-optimize-iaa-inject-watchdog-20260409.md` |
| `applicable_overlays` | None (EXEMPT) |
| `specific_rules` | A-029: `iaa_audit_token` must be pre-populated at commit time with expected reference (not PENDING). A-031: this file is carved out of SCOPE_DECLARATION scope tracking. HFMC-01: must include non-empty `## Ripple/Cross-Agent Assessment` section. |

#### T6 — IAA Final Audit and Token

| Field | Value |
|-------|-------|
| `task_id` | T6 |
| `task_summary` | IAA final audit verdict and ASSURANCE-TOKEN issuance |
| `iaa_trigger_category` | GOVERNANCE_AUDIT — EXEMPT (token file is IAA ceremony artifact) |
| `required_phases` | Phase 1 (preflight) + Phase 2 (alignment/classification) + Phase 4 (EXEMPT verdict + token ceremony) |
| `required_evidence_artifacts` | `.agent-admin/assurance/iaa-token-session-162-optimize-iaa-inject-watchdog-20260409.md` |
| `applicable_overlays` | None (EXEMPT classification — no overlay triggers) |
| `specific_rules` | A-022: re-evaluate ALL trigger categories at T6 invocation — do not carry forward this pre-brief's EXEMPT classification blindly. A-016: cross-PR token reuse prohibited. PHASE_B_BLOCKING_TOKEN field required in token file. |

---

### Step 0.3 (cont.) — PREHANDOVER Structure Requirements

The foreman PREHANDOVER proof for this wave MUST contain all of the following sections:

```
## PREHANDOVER Proof — session-162-optimize-iaa-inject-watchdog-20260409

wave: optimize-iaa-invocation-workflows
branch: copilot/optimize-iaa-invocation-workflows
issue: maturion-isms#1311
session_id: session-162-optimize-iaa-inject-watchdog-20260409
iaa_audit_token: IAA-session-162-optimize-iaa-inject-watchdog-20260409-PASS    ← A-029: pre-populate; do NOT use PENDING
iaa_prebrief_path: .agent-admin/assurance/iaa-prebrief-optimize-iaa-invocation-workflows.md

## Committed Artifacts
[List of all committed files matching declared wave artifacts — A-021 compliance]

## Scope Declaration Parity
[Confirm SCOPE_DECLARATION.md updated for this wave and matches git diff — HFMC-02/A-026]

## Ripple/Cross-Agent Assessment    ← HFMC-01 / A-023 — must be non-empty
[Assessment of downstream agent impact — at minimum: future CI workflow implementation
 waves will require IAA CI_WORKFLOW category invocations; governance-liaison-isms-agent 
 ripple assessment if any governance canon changes arise in D4 issues]

## Pre-IAA Commit Gate
[git status output showing clean working tree]
[git log --oneline -3 showing all artifacts committed]
```

**PREHANDOVER prohibited patterns**:
- `iaa_audit_token: PENDING` — PROHIBITED (A-029 supersedes A-025)
- Missing `## Ripple/Cross-Agent Assessment` section — REJECTION trigger (HFMC-01)
- Artifacts listed as "will commit" or uncommitted — REJECTION trigger (HFMC-03 / A-021)

---

### Step 0.3 (cont.) — FFA Checks at T6 Invocation

The following FAIL-ONLY-ONCE checks are mandatory at T6 regardless of EXEMPT classification:

| Rule | Check | Rationale |
|------|-------|-----------|
| **A-021** | All wave artifacts committed to branch before T6 invocation | Most frequent recurring failure; mandatory for every invocation |
| **A-022** | Re-evaluate ALL trigger categories at T6 — do NOT carry forward this pre-brief's EXEMPT classification | New commits can introduce triggering artifacts |
| **A-026 / HFMC-02** | `SCOPE_DECLARATION.md` updated for `optimize-iaa-invocation-workflows` and matches `git diff origin/main...HEAD --name-only` exactly | SCOPE_DECLARATION.md currently references `iaa-12stage-upgrade` wave — must be updated |
| **A-029** | PREHANDOVER `iaa_audit_token` pre-populated with expected reference (not PENDING) | §4.3b architecture; PREHANDOVER is read-only post-commit |
| **A-031** | IAA ceremony artifacts (pre-brief, PREHANDOVER, session memory, token) carved out of SCOPE_DECLARATION scope tracking | Standard carve-out per A-031 |
| **HFMC-01** | PREHANDOVER includes non-empty `## Ripple/Cross-Agent Assessment` | Recurring pattern; mandatory for all invocations |
| **HFMC-03** | All PREHANDOVER-declared artifacts committed before T6 | A-021 companion check |
| **HFMC-05** | IAA token ceremony: dedicated token file written post-verdict; PREHANDOVER proof read-only post-commit | §4.3b enforcement |
| **HFMC-06** | Evidence bundle completeness: pre-brief artifact present, PREHANDOVER committed, session memory committed | OVL-INJ-001 / PRE_BRIEF_ASSURANCE |

**Checks NOT required at T6** (EXEMPT classification):
- CORE-025 Stage-Readiness View (PRE_BUILD_STAGE_MODEL — not applicable)
- OVL-PBG-001 through OVL-PBG-016 (PRE_BUILD_GATES — not applicable)
- FUNCTIONAL-BEHAVIOUR-REGISTRY niggles (AAWP_MAT — not applicable)
- OVL-AC-001 through OVL-AC-012 (AGENT_CONTRACT — not applicable)

---

### Step 0.4 (cont.) — Scope Blockers

| Blocker | Description | Resolution Required Before |
|---------|-------------|---------------------------|
| **SCOPE_DECLARATION.md stale** | Currently references `iaa-12stage-upgrade` wave — must be updated to `optimize-iaa-invocation-workflows` before T6 | Before T6 IAA invocation |
| **SCOPE_DECLARATION.md parity** | Must match `git diff origin/main...HEAD --name-only` exactly at T6 invocation time (with A-031 carve-out for ceremony artifacts noted) | Before T6 IAA invocation |
| **No scope escalation if D4 issues create branch artifacts** | If creating GitHub issues causes any automated file commit on the branch (e.g., issue templates), re-classify wave at T6 | At T6 — A-022 |

**No hard blockers preventing wave execution.** All blockers are ceremony-compliance requirements addressable by the foreman before T6.

---

### Step 0.5 — Commit Confirmation

Pre-Brief artifact: `.agent-admin/assurance/iaa-prebrief-optimize-iaa-invocation-workflows.md`  
Commit: To be confirmed after `git commit` (see commit SHA below).

---

### Step 0.6 — Pre-Brief Summary

**Wave**: optimize-iaa-invocation-workflows  
**Qualifying tasks**: 0 (zero)  
**Wave IAA status**: PHASE_A_ADVISORY — GOVERNANCE_AUDIT EXEMPT (PLANNING_ONLY)  
**Anti-regression obligations declared**: 4 recurring patterns (A-021, HFMC-02/A-026, A-029, HFMC-01)  
**PREHANDOVER structure requirements**: Declared above — iaa_audit_token pre-population, Ripple section, Pre-IAA Commit Gate, Scope parity  
**FFA checks at T6**: 9 checks listed above  
**Scope blockers**: SCOPE_DECLARATION.md staleness (non-blocking — addressable before T6)  
**Pre-Brief artifact path**: `.agent-admin/assurance/iaa-prebrief-optimize-iaa-invocation-workflows.md`

---

**Authority**: CS2 (Johan Ras / @APGI-cmy)  
**IAA Adoption Phase**: PHASE_B_BLOCKING — Hard gate ACTIVE  
**STOP-AND-FIX Mandate**: ACTIVE
