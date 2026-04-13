# IAA Pre-Brief — DCKIS Alignment Plan: MAT Knowledge Ingestion Alignment Plan

**Document type**: IAA Pre-Brief Artifact (Phase 0 — PRE-BRIEF mode)
**Wave slug**: dckis-alignment-plan
**Declared branch**: `copilot/dckis-alignment-plan`
**Observed working branch**: `copilot/produce-mat-knowledge-ingestion-plan`
**Issue**: [Foreman Task] Produce MAT Knowledge Ingestion Alignment Plan — Wave strategy for
document chunking integration (DCKIS v1.0.0)
**Pre-Brief authored by**: independent-assurance-agent v6.2.0
**Date**: 2026-03-19
**Authority**: CS2 (@APGI-cmy) | `INDEPENDENT_ASSURANCE_AGENT_CANON.md`
**Invocation mode**: PHASE 0 — PRE-BRIEF ONLY. Phases 1–4 assurance NOT executed in this session.
**Source strategy**: `Maturion/strategy/DOCUMENT_CHUNKING_AND_KNOWLEDGE_INGESTION_INTEGRATION_STRATEGY.md` v1.0.0
**Adoption phase**: PHASE_B_BLOCKING — verdicts at handover are hard-blocking.

---

## Phase 0 Pre-Brief Execution Record

### Step 0.1 — Invocation Context Confirmation

> **PRE-BRIEF MODE CONFIRMED.**
> Triggered by: CS2-issued task containing `[IAA PRE-BRIEF REQUEST]` for wave `dckis-alignment-plan`.
> I am operating in Phase 0 exclusively. I do NOT execute Phases 1–4 in this session.
> I generate the Pre-Brief artifact and commit it. I stop there.

### Step 0.2 — Source Documents Read

Documents read to produce this Pre-Brief:

| Document | Path | Status |
|----------|------|--------|
| DCKIS Strategy v1.0.0 | `Maturion/strategy/DOCUMENT_CHUNKING_AND_KNOWLEDGE_INGESTION_INTEGRATION_STRATEGY.md` | READ |
| IAA Trigger Table v2.1.0 | `.agent-workspace/independent-assurance-agent/knowledge/iaa-trigger-table.md` | READ |
| IAA Core Invariants | `.agent-workspace/independent-assurance-agent/knowledge/iaa-core-invariants-checklist.md` | READ |
| IAA Category Overlays v3.6.0 | `.agent-workspace/independent-assurance-agent/knowledge/iaa-category-overlays.md` | READ |
| FAIL-ONLY-ONCE Registry v2.5.0 | `.agent-workspace/independent-assurance-agent/knowledge/FAIL-ONLY-ONCE.md` | READ |
| IAA Knowledge Index v3.1.0 | `.agent-workspace/independent-assurance-agent/knowledge/index.md` | READ |
| Foreman wave-current-tasks.md | `.agent-workspace/foreman-v2/personal/wave-current-tasks.md` | READ |
| CANON_INVENTORY | `governance/CANON_INVENTORY.json` | READ — 191 canons, 0 bad hashes |
| IAA Canon | `governance/canon/INDEPENDENT_ASSURANCE_AGENT_CANON.md` | PRESENT — confirmed in CANON_INVENTORY |
| Pre-Brief example (Wave 19) | `.agent-admin/assurance/iaa-prebrief-wave19-criteria-parsing-repair.md` | READ — format reference |

> CANON_INVENTORY hash check: **PASS** — no null, empty, or placeholder hashes found.
> IAA canon present: **YES**
> Adoption phase: **PHASE_B_BLOCKING** — hard gate ACTIVE.

### Step 0.3 — Wave Scope Assessment

This wave is a **Foreman POLC-Orchestration task** (verb: "Produce"). The deliverables are:

| # | Deliverable | Description | Qualifying? |
|---|-------------|-------------|-------------|
| T-DCKIS-000 | IAA Pre-Brief artifact | This document — IAA Phase 0 output | NOT QUALIFYING — IAA authors it |
| T-DCKIS-001 | MAT Knowledge Ingestion Alignment Plan | New strategic governance planning document covering gap analysis, wave sequencing, RED gate requirements, task breakdown for DCKIS integration | **QUALIFYING** |
| T-DCKIS-002 | `wave-current-tasks.md` update | Foreman task tracker file in `.agent-workspace/foreman-v2/personal/` | NOT QUALIFYING — EXEMPT (session admin file in foreman workspace) |
| T-DCKIS-003 | Session memory | IAA and Foreman session memory files | NOT QUALIFYING — EXEMPT |

**What is NOT in this wave** (confirmed by pre-brief request):
- No production code changes
- No schema migrations
- No UI implementation
- No Edge Function changes
- No agent contract modifications
- No canon file modifications

---

## 1. Wave Summary

This wave produces the **MAT Knowledge Ingestion Alignment Plan** — a strategic governance
planning document that establishes the execution roadmap for integrating the legacy document
chunking system into MAT and the AIMC Knowledge Centre, as directed by DCKIS v1.0.0.

The plan will cover (per DCKIS §9 Step 2 and the Pre-Brief request):

- **Gap analysis**: legacy code/assets (`apps/maturion-maturity-legacy/`) vs. target state
  in MAT/AIMC
- **Accelerated approach**: what is taken directly vs. what needs adaptation
- **Wave sequencing**: new or amended waves in the Combined Execution Plan (AIMC/LKIAC CEP)
- **RED gate test requirements**: per-wave RED gate test declarations
- **Task breakdown**: governance-liaison, MAT builders (schema, api, ui), QA
- **Wave start criteria and acceptance checkpoints**
- **DCKIS §10 success criteria** (SC-1 through SC-10) mapped to acceptance checkpoints

**Scope authority**: DCKIS v1.0.0 §9, §10 — this plan is the execution specification that
converts the DCKIS strategy into actionable wave definitions.

---

## 2. IAA Trigger Category Declaration

### Classification

The single qualifying task (T-DCKIS-001 — the Alignment Plan document) is classified as:

| Category | IAA Required? | Rationale |
|----------|---------------|-----------|
| **CANON_GOVERNANCE** | **YES — PRIMARY** | The Alignment Plan is a strategic governance document that (a) defines wave sequencing in the AIMC/LKIAC Combined Execution Plan, (b) establishes architecture-freeze decisions for multiple downstream build waves, (c) is expected to be placed in `Maturion/strategy/` or a `governance/` subdirectory. Even if the filename does not contain `ARCHITECTURE` or `STRATEGY` verbatim, the AMBIGUITY RULE applies: a document defining wave sequencing and architecture freeze for a CS2-authorised programme is unambiguously governance in character. |
| **AAWP_MAT** | **CONDITIONAL** | If the Alignment Plan or any companion deliverable is placed in `modules/mat/` paths (e.g. updating `modules/mat/03-implementation-plan/implementation-plan.md`), the AAWP_MAT trigger also activates. **IAA pre-declares this as a conditional secondary trigger.** The Foreman must confirm at handover whether any `modules/mat/` files were modified; if yes, AAWP_MAT overlay also applies. |
| **PRE_BRIEF_ASSURANCE** | **YES — ALWAYS** | Applied alongside all triggering categories per overlay rules. This Pre-Brief artifact IS the required evidence. OVL-INJ-001 will confirm it is present and pre-dates any builder delegation. |
| AGENT_CONTRACT | NO | No agent contracts are modified in this wave. |
| CI_WORKFLOW | NO | No `.github/workflows/` files are modified. |
| KNOWLEDGE_GOVERNANCE | NO | No `.agent-workspace/*/knowledge/` files are modified. |
| EXEMPT | NO — AMBIGUITY RULE | Even if an argument could be made that a planning document is "doc-only," the AMBIGUITY RULE applies. The Alignment Plan shapes architecture and wave sequencing for CS2-approved programme work. Ambiguity resolves to mandatory IAA invocation. |

**AMBIGUITY RULE applied**: The DCKIS Alignment Plan is a governance document in substance
regardless of its file path. IAA is mandatory at handover. No exemption claim is valid.

---

## 3. Qualifying Task — T-DCKIS-001: MAT Knowledge Ingestion Alignment Plan

### 3.1 Task Declaration

| Field | Value |
|-------|-------|
| **Task ID** | T-DCKIS-001 |
| **Task Summary** | Produce the MAT Knowledge Ingestion Alignment Plan — a governance planning document that converts DCKIS v1.0.0 into an actionable wave execution specification. Covers gap analysis, accelerated approach, wave sequencing, RED gate test requirements, task breakdown, and acceptance checkpoints against DCKIS §10 SC-1 through SC-10. |
| **Producing Agent** | foreman-v2-agent |
| **Producing Agent Class** | foreman |
| **IAA Trigger Category** | CANON_GOVERNANCE (primary) + PRE_BRIEF_ASSURANCE (always) + AAWP_MAT (conditional — see §2) |
| **Required Phases at Handover** | Phase 2 (Alignment), Phase 3 (Assurance Work), Phase 4 (Verdict) |
| **IAA Adoption Phase** | PHASE_B_BLOCKING — verdict is hard-blocking |

### 3.2 Required Evidence Artifacts at Handover

The following artifacts MUST be present in the PR bundle at handover. Absence of ANY item
triggers CORE-018 failure → immediate REJECTION-PACKAGE before overlay checks:

| Artifact | Path Pattern | CORE Check |
|----------|-------------|------------|
| PREHANDOVER proof file | `PREHANDOVER_PROOF_DCKIS_ALIGNMENT_PLAN.md` or equivalent on branch | CORE-018(a) |
| Session memory file | `.agent-workspace/foreman-v2/memory/session-dckis-alignment-*.md` | CORE-018(b) + CORE-015 |
| `iaa_audit_token` field in PREHANDOVER proof | Non-empty, non-placeholder reference | CORE-018(c) |
| IAA token file (to be written by IAA at handover) | `.agent-admin/assurance/iaa-token-session-NNN-wavedckis-YYYYMMDD.md` | CORE-018(d) + CORE-016 |
| IAA Pre-Brief artifact | `.agent-admin/assurance/iaa-prebrief-dckis-alignment-plan.md` (this file) | OVL-INJ-001 |
| The Alignment Plan document itself | Committed, non-placeholder, covering all required sections | CORE-007 |
| DCKIS §10 SC-1 through SC-10 acceptance checkpoints | Present in or referenced from the Alignment Plan | OVL-CG-001 |

### 3.3 FFA Checks IAA Will Run at Handover

IAA will execute ALL of the following checks at handover invocation.

**FAIL-ONLY-ONCE rules applicable to this task:**

| Rule | Applicable? | Why |
|------|-------------|-----|
| A-001 | YES | IAA invocation evidence must be present (this Pre-Brief IS that evidence) |
| A-002 | YES | No class exemption — foreman class is not exempt from IAA oversight |
| A-003 | YES | Ambiguity resolves to mandatory invocation (already applied in §2) |
| A-013 | CONDITIONAL | If any `.github/agents/` file appears in the PR diff → auto-REJECTION-PACKAGE unless CS2 auth documented |
| A-015 | YES | PREHANDOVER ceremony required for all T1/T2 PRs |
| A-026 | YES | Ceremony artifact carve-out — session numbering / file sequence IDs are NOT audited |

**Core invariants IAA will check (ALL 23 checks — CORE-001 through CORE-023):**

| Check | Applicability | Primary Focus for This Wave |
|-------|---------------|----------------------------|
| CORE-001 through CORE-012 | AGENT_CONTRACT scope only — N/A if no contracts in PR | Skip (no contracts in this wave) |
| CORE-005 | ALL | Governance block valid in any governance file delivered |
| CORE-006 | ALL | CANON_INVENTORY alignment — if Alignment Plan references new canon entries |
| CORE-007 | **CRITICAL** | No placeholder, TODO, STUB, or TBD content in the Alignment Plan. A planning document with incomplete sections is a REJECTION-PACKAGE. |
| CORE-013 | **CRITICAL** | IAA invocation evidence present — this Pre-Brief artifact, committed before builder delegation |
| CORE-014 | ALL | No class exemption claim from foreman or any agent |
| CORE-015 | ALL | Session memory present in PR bundle |
| CORE-016 | ALL | Dedicated IAA token file at `.agent-admin/assurance/` (written by IAA at handover) |
| CORE-017 | ALL | No unauthorised `.github/agents/` modifications |
| CORE-018 | **CRITICAL** | Complete evidence artifact sweep — all 4 items (a)(b)(c)(d) present before overlay proceeds |
| CORE-019 | ALL | IAA token cross-verification (first invocation exception applies if no prior session for this wave) |
| CORE-020 | ALL | Zero partial pass rule — absence of evidence = fail |
| CORE-021 | ALL | Zero-severity-tolerance — all findings produce REJECTION-PACKAGE regardless of perceived severity |
| CORE-022 | N/A | No agent contracts in PR (unless foreman unexpectedly includes one) |
| CORE-023 | ALL | Workflow integrity — N/A if no workflow-adjacent files changed; IAA will confirm at review |

**CANON_GOVERNANCE overlay checks IAA will apply (OVL-CG-001 through OVL-CG-005, ADM-001, ADM-002):**

| Check | What IAA Will Specifically Examine |
|-------|-----------------------------------|
| **OVL-CG-001** — Strategy alignment | Does the Alignment Plan correctly implement DCKIS v1.0.0? Specifically: (a) Does gap analysis address all 8 legacy components listed in DCKIS §2.1 table? (b) Are the two-pipeline architecture position (DCKIS §3.1) and ADR-001 through ADR-005 respected? (c) Does the wave sequencing honour DCKIS §8.4 "no conflict with wave sequencing" constraints? (d) Do acceptance checkpoints map explicitly to DCKIS §10 SC-1 through SC-10? |
| **OVL-CG-002** — No contradictions | Does the Alignment Plan contradict any existing canon, the AIMC/LKIAC CEP, or the MAT architecture? Specific risk: the plan must not propose bypassing CL-5-D2 as a gate. |
| **OVL-CG-003** — Enforcement gap | Are the wave start criteria in the Alignment Plan concrete and verifiable? A wave start criterion of "when ready" or similar is an enforcement gap = REJECTION-PACKAGE. Each wave must have a specific, testable gate. |
| **OVL-CG-004** — Ripple impact assessed | Does the Alignment Plan identify all downstream ripple impacts? Specifically: (a) AIMC/LKIAC CEP updates required? (b) MAT governance documents that need amendment per DCKIS §7? (c) CL-3 Deprecation Register entries per DCKIS §8.3? (d) CL-5-D2 completion gate documented? |
| **OVL-CG-005** — ISMS layer-down scope | N/A for this wave (no layer-down from governance canonical source) — IAA will confirm and record as N/A. |
| OVL-CG-ADM-001 | CANON_INVENTORY updated if the Alignment Plan adds any new canonical governance document |
| OVL-CG-ADM-002 | Version field present in the Alignment Plan document header |

**PRE_BRIEF_ASSURANCE overlay check:**

| Check | Pass Condition |
|-------|----------------|
| **OVL-INJ-001** | This Pre-Brief artifact exists at `.agent-admin/assurance/iaa-prebrief-dckis-alignment-plan.md`, is non-empty, non-placeholder, and was committed before any Alignment Plan draft was delegated or committed. |

**AAWP_MAT overlay checks (conditional — apply only if `modules/mat/` files appear in PR diff):**

If any `modules/mat/` path appears in the PR diff at handover, IAA will additionally apply the
full AAWP_MAT overlay. The Foreman must confirm at handover whether this applies.

---

## 4. PREHANDOVER Proof Structure Required

The Foreman's PREHANDOVER proof must include the following sections/fields.
A missing required section = CORE-018 failure.

```markdown
# PREHANDOVER PROOF — DCKIS Alignment Plan

## Wave Identity
wave: dckis-alignment-plan
branch: copilot/dckis-alignment-plan  [or the actual confirmed branch]
issue: [issue number]
producing_agent: foreman-v2-agent
cs2_authorization: [GitHub issue URL or reference confirming CS2 direction]

## Deliverables Committed
- [ ] T-DCKIS-001: MAT Knowledge Ingestion Alignment Plan committed at: [path]
- [ ] T-DCKIS-000: IAA Pre-Brief artifact committed at: .agent-admin/assurance/iaa-prebrief-dckis-alignment-plan.md
- [ ] Session memory committed at: [path]

## Alignment Plan Coverage Attestation
The Alignment Plan:
- [ ] Covers gap analysis for all 8 legacy components (DCKIS §2.1)
- [ ] Respects two-pipeline architecture (DCKIS §3.1, ADR-001 through ADR-005)
- [ ] Contains wave sequencing for Pipeline 2 integration
- [ ] Identifies CL-5-D2 as a prerequisite gate
- [ ] Maps DCKIS §10 SC-1 through SC-10 to acceptance checkpoints
- [ ] Contains RED gate test requirements per proposed wave
- [ ] Contains task breakdown per agent class

## No-Placeholder Attestation
All sections of the Alignment Plan are complete. No TODO, STUB, TBD, or placeholder content.

## CANON_GOVERNANCE Declaration
Modified governance paths in this PR: [list paths or "none — planning document in Maturion/strategy/ only"]
modules/mat/ paths modified: [YES/NO — if YES, AAWP_MAT overlay also applies at handover]

## IAA Invocation Reference
iaa_audit_token: IAA-session-[NNN]-wavedckis-[YYYYMMDD]-PASS
[pre-populated with expected reference format; token file will be created by IAA at handover]
```

---

## 5. Scope Blockers and Governance Conflicts — Visible Now

IAA has identified the following items that the Foreman should resolve BEFORE completing the
Alignment Plan. These are pre-handover advisories — they are not REJECTION-PACKAGE items at
this stage, but each becomes a blocking finding if unresolved at handover.

### BLOCKER-001 — DCKIS Strategy Document Status Discrepancy

**Severity**: BLOCKING at handover if unresolved
**Observation**: The DCKIS strategy document (`Maturion/strategy/DOCUMENT_CHUNKING_AND_KNOWLEDGE_INGESTION_INTEGRATION_STRATEGY.md` v1.0.0) contains the following header field:
```
| **Status** | DRAFT — Awaiting CS2 Review and Foreman Alignment |
```
However, the Pre-Brief request states: *"Source Authority: DOCUMENT_CHUNKING_AND_KNOWLEDGE_INGESTION_INTEGRATION_STRATEGY.md v1.0.0 **(CS2 approved)**"*

**Conflict**: The document says DRAFT; the invocation context says CS2 approved. IAA cannot verify CS2 approval from the document itself.

**Resolution required**: One of the following must be confirmed before or at handover:
1. The DCKIS document header is updated to reflect `APPROVED — CS2 Reviewed` with a reference to the approving issue/comment, OR
2. A GitHub issue or comment from @APGI-cmy is cited in the PREHANDOVER proof confirming approval of DCKIS v1.0.0.

**IAA position**: If the strategy document still reads DRAFT at handover, the Alignment Plan
produced from it has an unverified source authority. This would fail OVL-CG-001 (strategy
alignment cannot be verified against an unapproved strategy).

---

### BLOCKER-002 — Branch Name Mismatch

**Severity**: ADVISORY — no immediate block, but must be confirmed at handover
**Observation**: The Pre-Brief request declares branch `copilot/dckis-alignment-plan`.
The current working repository state shows HEAD on `copilot/produce-mat-knowledge-ingestion-plan`.

**Resolution required**: The Foreman must confirm the branch that the PR will be raised against.
The PREHANDOVER proof must state the actual branch name. If the branch is renamed or a new branch
is created, IAA will verify the PR is raised against the declared branch.

---

### DEPENDENCY-001 — CL-5-D2 Gate for Pipeline 2 Implementation

**Severity**: ADVISORY — planning blocker, not a handover blocker for THIS wave
**Observation**: DCKIS §8.1 states: *"CL-5-D2 completion before the Pipeline 2 implementation wave begins."*
The Alignment Plan must explicitly identify CL-5-D2 as a **wave start gate** for any wave proposing
Pipeline 2 implementation (Edge Function migration, schema work, UI components).

**IAA will check at handover**: Does the Alignment Plan clearly document CL-5-D2 as a blocking
prerequisite for the Pipeline 2 implementation wave? A wave sequencing plan that schedules
Pipeline 2 implementation without this gate = OVL-CG-002 violation.

---

### DEPENDENCY-002 — Wave 19 Criteria Parsing Repair (In-Flight)

**Severity**: INFORMATIONAL — wave sequencing context for the Alignment Plan
**Observation**: Wave 19 (PR open — criteria parsing repair) and Wave 20 (atomic write-back)
are currently in-flight. The Alignment Plan's wave sequencing must not propose any wave that
creates a merge ordering conflict with Wave 19/20 activity on shared modules/mat/ paths.

**IAA will check at handover**: Does the Alignment Plan acknowledge the current in-flight
criteria parsing work and correctly sequence the Pipeline 2 integration waves to avoid
overlap on shared governance documents?

---

### DEPENDENCY-003 — Two-Pipeline Architectural Boundary Preservation

**Severity**: BLOCKING if violated
**Observation**: DCKIS ADR-005 states Pipeline 1 (criteria parsing: `CriteriaUpload.tsx → invoke-ai-parse-criteria → mat-ai-gateway/parsing.py`) SHALL NOT be modified by any wave produced from this strategy.

**IAA will check at handover**: Does the Alignment Plan contain any task that touches Pipeline 1
files or proposes any modification to Pipeline 1? If yes, this is a scope violation of ADR-005 =
REJECTION-PACKAGE citing OVL-CG-002 (contradiction with existing architecture decision).

---

## 6. IAA Orientation for This Wave

Per the Orientation Mandate (90/10 Rule — CS2 Directive):

**This is a PLANNING/GOVERNANCE wave.** IAA's effort allocation at handover:

- **90% of IAA effort** — Does the Alignment Plan actually work as a governance document? Specifically:
  - Is the gap analysis substantive? Does it correctly identify what exists in legacy vs. what is needed?
  - Is the wave sequencing coherent? Do proposed waves have clear dependencies and RED gate gates?
  - Does the plan respect the two-pipeline architectural boundary (ADR-005)?
  - Are DCKIS §10 SC-1 through SC-10 explicitly mapped as acceptance checkpoints?
  - Are the wave start criteria concrete and testable?
  - Does the plan correctly identify CL-5-D2 as a prerequisite gate?

- **10% of IAA effort** — Ceremony admin (existence checks only):
  - Is the PREHANDOVER proof present? Yes/No.
  - Is session memory present? Yes/No.
  - Is the IAA Pre-Brief artifact (this file) cited? Yes/No.
  - Is the `iaa_audit_token` field pre-populated? Yes/No.

**IAA will NOT investigate**: Session numbering, file naming conventions, version bump history
consistency, or cross-reference consistency across session files. These are foreman
self-maintenance responsibilities.

---

## 7. Summary — Qualifying Tasks Table

| Task ID | Task Summary | IAA Trigger Category | Required Phases | Key Specific Rules |
|---------|-------------|---------------------|----------------|-------------------|
| **T-DCKIS-001** | MAT Knowledge Ingestion Alignment Plan | CANON_GOVERNANCE (primary) + PRE_BRIEF_ASSURANCE (always) + AAWP_MAT (conditional if `modules/mat/` paths present) | Phase 2 + Phase 3 + Phase 4 | OVL-CG-001: strategy alignment to DCKIS §10 SC-1—SC-10; OVL-CG-002: no ADR-005 violations; OVL-CG-003: concrete wave start criteria; OVL-CG-004: ripple impacts identified; CORE-007: zero placeholders; CORE-018: evidence bundle complete |
| T-DCKIS-002 | wave-current-tasks.md update | EXEMPT | N/A | Session admin file |
| T-DCKIS-003 | Session memory | EXEMPT | N/A | CORE-015 existence check only |

---

## 8. Pre-Brief Completion Confirmation

> **PHASE 0 PRE-BRIEF COMPLETE.**
>
> IAA has:
> - Confirmed Pre-Brief invocation mode (Phase 0 only — Phases 1–4 NOT executed)
> - Read all relevant governance documents and source strategy
> - Classified qualifying tasks and declared trigger categories
> - Declared all FFA checks that will run at handover
> - Declared the PREHANDOVER proof structure required
> - Identified scope blockers and governance conflicts visible at this stage
>
> **This artifact is committed to `.agent-admin/assurance/iaa-prebrief-dckis-alignment-plan.md`.**
>
> **Foreman may proceed with the Alignment Plan.** This Pre-Brief artifact is the required
> pre-delegation IAA invocation evidence for OVL-INJ-001 at handover.
>
> **IAA must be re-invoked at handover** (after the Alignment Plan is committed) for Phases 2–4
> full assurance review. This Pre-Brief does NOT constitute an ASSURANCE-TOKEN.
>
> Blockers to resolve before handover:
> - **BLOCKER-001 (BLOCKING)**: Confirm CS2 approval of DCKIS v1.0.0 in PREHANDOVER proof.
> - **BLOCKER-002 (ADVISORY)**: Confirm actual branch name in PREHANDOVER proof.
> - **DEPENDENCY-001 (ADVISORY)**: Alignment Plan must declare CL-5-D2 as a wave start gate.
> - **DEPENDENCY-002 (INFORMATIONAL)**: Acknowledge Wave 19/20 in-flight work in sequencing.
> - **DEPENDENCY-003 (BLOCKING if violated)**: No Pipeline 1 files touched by any proposed wave.

---

**Authority**: CS2 (Johan Ras / @APGI-cmy)
**IAA Version**: 6.2.0 | **Contract Version**: 2.3.0
**Pre-Brief Date**: 2026-03-19
**Adoption Phase**: PHASE_B_BLOCKING
**STOP-AND-FIX Mandate**: ACTIVE — verdicts at handover are hard-blocking
**Re-invocation required**: YES — at PR submission, before merge
