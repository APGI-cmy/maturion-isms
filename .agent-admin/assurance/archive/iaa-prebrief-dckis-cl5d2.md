# IAA Pre-Brief — DCKIS-CL5D2: Architecture Review for Pipeline 2 Rehosting (Entry Gate)

**Document type**: IAA Pre-Brief Artifact (Phase 0 — PRE-BRIEF mode)
**Wave ID**: DCKIS-CL5D2
**Wave Title**: CL-5-D2 Upload Architecture Review — Pipeline 2 Rehosting Entry Gate
**Declared branch**: `copilot/dckis-cl5d2-architecture-review`
**Pre-Brief authored by**: independent-assurance-agent v6.2.0 (contract 2.3.0)
**Date**: 2026-03-19
**Authority**: CS2 (@APGI-cmy) | `INDEPENDENT_ASSURANCE_AGENT_CANON.md`
**Invocation mode**: PHASE 0 — PRE-BRIEF ONLY. Phases 1–4 assurance NOT executed in this session.
**Adoption phase**: PHASE_B_BLOCKING — verdicts at handover are hard-blocking.
**Parent pre-brief**: `.agent-admin/assurance/iaa-prebrief-dckis-alignment-plan.md`
**Gov pre-brief**: `.agent-admin/assurance/iaa-prebrief-dckis-gov-001.md`
**Source authority**: `governance/EXECUTION/MAT_KNOWLEDGE_INGESTION_ALIGNMENT_PLAN.md` v1.0.0 §3–§4
**Entry criteria confirmed**: DCKIS-GOV-001 MERGED ✅ (IAA token: `IAA-session-052-dckis-gov-001-20260319-PASS`)

---

## Phase 0 Execution Record

### Step 0.1 — Pre-Brief Invocation Context Confirmation

> **PRE-BRIEF MODE CONFIRMED.**
> Triggered by: CS2-issued comment `[IAA PRE-BRIEF REQUEST]` for wave `DCKIS-CL5D2`.
> Branch under review: `copilot/dckis-cl5d2-architecture-review`.
> I am operating in Phase 0 exclusively. I do NOT execute Phases 1–4 in this session.
> I generate this Pre-Brief artifact and commit it. Execution stops there.

### Step 0.2 — Phase 1 Bootstrap Summary

| Bootstrap Check | Status |
|----------------|--------|
| Agent identity (YAML) | ATTESTED — `independent-assurance-agent`, class: assurance, v6.2.0 |
| Wake-up protocol | PASS — all 7 phases passed, 0 uncommitted changes |
| CANON_INVENTORY hashes | PASS — 191 canons, 0 bad/null/placeholder hashes |
| IAA canon present | YES — `governance/canon/INDEPENDENT_ASSURANCE_AGENT_CANON.md` in inventory |
| Tier 2 knowledge | LOADED — index.md v3.1.0; FAIL-ONLY-ONCE.md v2.5.0 (A-001 through A-035 ACTIVE) |
| Session memory (last 5) | REVIEWED — session-dckis-gov-001-20260319, session-dckis-alignment-plan (x2), session-wave20, session-wave19 |
| Open REJECTION-PACKAGEs | NONE for DCKIS-CL5D2 |
| A-001 (invocation evidence) | ATTESTED |
| A-002 (no class exceptions) | ATTESTED |
| Adoption phase | PHASE_B_BLOCKING — hard gate ACTIVE |

### Step 0.3 — Source Documents Read for This Pre-Brief

| Document | Path | Status |
|----------|------|--------|
| MAT Knowledge Ingestion Alignment Plan v1.0.0 | `governance/EXECUTION/MAT_KNOWLEDGE_INGESTION_ALIGNMENT_PLAN.md` | READ ✅ — §3 wave sequencing, §4 DCKIS-CL5D2 spec |
| AIMC LKIAC Combined Execution Plan | `governance/EXECUTION/AIMC_LKIAC_COMBINED_EXECUTION_PLAN.md` | READ ✅ — CL-5-D2 status: OUTSTANDING |
| process-document-v2 Edge Function | `apps/maturion-maturity-legacy/supabase/functions/process-document-v2/index.ts` | CONFIRMED PRESENT ✅ |
| ai_knowledge migration 003 | `packages/ai-centre/supabase/migrations/003_ai_knowledge.sql` | CONFIRMED PRESENT ✅ |
| ai_knowledge migration 006 | `packages/ai-centre/supabase/migrations/006_ai_knowledge_metadata.sql` | CONFIRMED PRESENT ✅ |
| IAA Trigger Table v2.1.0 | `.agent-workspace/independent-assurance-agent/knowledge/iaa-trigger-table.md` | READ ✅ |
| IAA Core Invariants v2.9.0 | `.agent-workspace/independent-assurance-agent/knowledge/iaa-core-invariants-checklist.md` | READ ✅ |
| IAA Category Overlays v3.6.0 | `.agent-workspace/independent-assurance-agent/knowledge/iaa-category-overlays.md` | READ ✅ |
| FAIL-ONLY-ONCE Registry v2.5.0 | `.agent-workspace/independent-assurance-agent/knowledge/FAIL-ONLY-ONCE.md` | READ ✅ |
| Parent DCKIS Pre-Brief | `.agent-admin/assurance/iaa-prebrief-dckis-alignment-plan.md` | READ ✅ |
| GOV-001 Pre-Brief | `.agent-admin/assurance/iaa-prebrief-dckis-gov-001.md` | READ ✅ |
| Session-052 IAA Token | `.agent-admin/assurance/iaa-token-session-052-dckis-gov-001-20260319.md` | READ ✅ — PASS confirmed |
| Branch state (git) | `copilot/dckis-cl5d2-architecture-review` | READ ✅ — 0 files changed vs main; 1 empty "Initial plan" commit |

---

### Step 0.4 — Wave Scope Assessment

**Wave type per alignment plan**: Architecture review — produces **one documentation artefact only**.
No production code changes. No schema migrations deployed. No agent contracts modified. No CI changes.

| # | Deliverable | Path | Qualifying for IAA? |
|---|-------------|------|-------------------|
| CL5D2-D1 | Upload architecture review document | `.agent-workspace/audit/AIMC-P1-upload-arch-review-20260319.md` | **YES — QUALIFYING** (AAWP_MAT, see §Step 0.5) |
| CL5D2-D2 | CL-5-D2 recorded as COMPLETE in execution plan | `governance/EXECUTION/AIMC_LKIAC_COMBINED_EXECUTION_PLAN.md` | **YES — QUALIFYING** (Governance execution plan update; must be included in this PR) |
| IAA Pre-Brief | This document | `.agent-admin/assurance/iaa-prebrief-dckis-cl5d2.md` | NOT QUALIFYING — IAA authors it |
| Session memory | IAA + api-builder session memory | `.agent-workspace/*/memory/` | NOT QUALIFYING — EXEMPT |

**What is NOT in this wave** (confirmed by alignment plan §4 and invocation context):
- No production Edge Function code changes
- No schema migrations
- No Supabase deployment
- No frontend UI changes
- No agent contract changes
- DCKIS-SCH-001 (schema assessment) is the NEXT wave and is blocked on this one

---

### Step 0.5 — IAA Trigger Category Classification

Applying IAA Trigger Table v2.1.0:

| Trigger Check | Finding | Result |
|--------------|---------|--------|
| AGENT_CONTRACT: Any `.github/agents/` changes? | None — api-builder is not modifying agent contracts | ❌ NOT TRIGGERED |
| CANON_GOVERNANCE: Any `governance/canon/` changes? | None — execution plan is in `governance/EXECUTION/` (not canon) | ❌ NOT TRIGGERED |
| CI_WORKFLOW: Any `.github/workflows/` changes? | None | ❌ NOT TRIGGERED |
| KNOWLEDGE_GOVERNANCE: Any `.agent-workspace/*/knowledge/` changes? | None | ❌ NOT TRIGGERED |
| AAWP_MAT: DCKIS programme; architecture review for `packages/ai-centre/`; audit artefact at `.agent-workspace/audit/`; alignment plan explicitly governs this wave | The deliverable is an architecture review document for the AI Centre Pipeline 2 rehosting — the DCKIS programme is unambiguously AAWP/MAT domain per `MAT_KNOWLEDGE_INGESTION_ALIGNMENT_PLAN.md` | ✅ **TRIGGERED** |
| AMBIGUITY RULE (A-003): Is classification unambiguous? | DCKIS-CL5D2 is a MAT/AAWP programme deliverable. Alignment plan assigns it to the DCKIS wave sequence. IAA was explicitly requested by CS2. AMBIGUITY RULE confirms mandatory invocation. | ✅ **MANDATORY** |

**Primary IAA Trigger Category**: `AAWP_MAT`

**Rationale**: While the deliverable file path (`.agent-workspace/audit/`) is not a production code path, the wave is an architecture review for `packages/ai-centre/` (AAWP/MAT domain), is governed by `MAT_KNOWLEDGE_INGESTION_ALIGNMENT_PLAN.md`, and its output gates DCKIS-SCH-001 (a hard-code wave requiring IAA). The AMBIGUITY RULE (FAIL-ONLY-ONCE A-003) applies and resolves to mandatory IAA invocation. CS2 explicitly requested this Pre-Brief, confirming IAA oversight applies.

**Additional trigger note (CL5D2-D2)**: The required update to `governance/EXECUTION/AIMC_LKIAC_COMBINED_EXECUTION_PLAN.md` is a governance execution document update. This file is in `governance/EXECUTION/` (NOT `governance/canon/`) and is NOT in CANON_INVENTORY — it does NOT trigger CANON_GOVERNANCE independently. However, it must be included in the PR and IAA will verify its presence at handover under CORE-018 (evidence sweep) and the substance check below.

---

### Step 0.6 — Declared FFA Checks at Handover

The following checks will be applied by IAA at the DCKIS-CL5D2 handover invocation.

#### Core Invariants (Applicable Subset — AAWP_MAT Documentation PR)

| Check | Applies? | Rationale |
|-------|----------|-----------|
| CORE-005 (Governance block present) | N/A | No agent contract |
| CORE-006 (CANON_INVENTORY alignment) | N/A | No canon changes |
| CORE-007 (No placeholder content) | **YES** | Deliverable document must be complete, not stub/TBD |
| CORE-013 (IAA invocation evidence — PREHANDOVER proof) | **YES** | PREHANDOVER proof must be committed before IAA invocation |
| CORE-015 (Session memory present) | **YES** | api-builder session memory required |
| CORE-016 (IAA token file §4.3b) | **YES** — First invocation | Token file created by this IAA session; PREHANDOVER `iaa_audit_token` must contain expected reference format |
| CORE-017 (No unauthorized `.github/agents/` mods) | **YES** | Verify no agent files touched |
| CORE-018 (Complete evidence sweep) | **YES** | All four evidence artifacts must be present |
| CORE-019 (IAA token cross-verification) | **YES** — First invocation exception | Token file will be created during this handover session |
| CORE-020 (Zero partial pass) | **YES** | |
| CORE-021 (Zero-severity-tolerance) | **YES** | |
| CORE-023 (Workflow integrity ripple) | **YES — check then likely N/A** | Verify no workflow-adjacent files touched; if none, record N/A |

#### PRE_BRIEF_ASSURANCE Overlay

| Check | Applies? | What IAA Will Verify |
|-------|----------|---------------------|
| OVL-INJ-001 (Pre-Brief artifact existence) | **YES** | This artifact (`.agent-admin/assurance/iaa-prebrief-dckis-cl5d2.md`) must be committed to branch BEFORE api-builder's deliverable |
| OVL-INJ-ADM-001 (Non-empty) | **YES** | This file is substantive |
| OVL-INJ-ADM-002 (Correct wave reference) | **YES** | This file references `DCKIS-CL5D2` |

#### AAWP_MAT Substance Checks (Architecture Document Quality)

For this documentation-only wave, BD-000 (user journey trace) and other executable-behaviour checks are **NOT APPLICABLE** — there is no deployed code. IAA will instead apply the following architecture document quality checks derived from the alignment plan specification:

| Check ID | Check Name | What IAA Will Verify |
|----------|-----------|---------------------|
| **ARCH-001** | Re-hosting feasibility verdict present | Document contains an explicit, unambiguous PASS or FAIL verdict on whether `process-document-v2` can be re-hosted in `packages/ai-centre/supabase/functions/`. A verdict of "partial" or "conditional" without a binary position = FAIL. |
| **ARCH-002** | Schema delta documented | Document contains explicit column-by-column comparison: legacy `document_chunks` vs AIMC `ai_knowledge`. Each delta column (additions, removals, type changes) must be named. Alignment plan expects `source` and `approval_status` as additions; `organisation_id` as already present in legacy. IAA will verify the document addresses this, not that it reaches any particular conclusion. |
| **ARCH-003** | Smart Chunk Reuse portability assessed | Document addresses portability of `chunked_from_tester` / `approved_via_tester` logic. Must be explicit — not implied or omitted. |
| **ARCH-004** | Dependency identification (env vars / secrets) | Document lists any `process-document-v2` dependencies on legacy Supabase project-specific settings (env vars, secrets, service role keys, storage bucket names) that must be migrated or re-configured. Omission without explicit "none found" statement = FAIL. |
| **ARCH-005** | Coverage of all 5 alignment plan mandated topics | The alignment plan §4 DCKIS-CL5D2 mandates 5 review topics. IAA will verify all 5 are addressed: (1) re-hosting feasibility, (2) schema delta, (3) Smart Chunk Reuse portability, (4) dependency migration, (5) PASS/FAIL verdict. Missing any topic = FAIL. |
| **ARCH-006** | No contradiction with existing governance | Document must not contradict ADR-001 (output table target: `ai_knowledge`), ADR-002 (Smart Chunk Reuse unchanged), ADR-003 (approval workflow), ADR-004 (domain taxonomy), ADR-005 (Pipeline 1 untouched). Any contradiction = FAIL with specific ADR citation. |
| **ARCH-007** | AIMC_LKIAC_COMBINED_EXECUTION_PLAN.md updated | `governance/EXECUTION/AIMC_LKIAC_COMBINED_EXECUTION_PLAN.md` must reflect CL-5-D2 as COMPLETE in this PR. Exit criteria per alignment plan §4. Absence = FAIL. |
| **ARCH-008** | Source documents explicitly cited | The review document must name the exact source files reviewed: `apps/maturion-maturity-legacy/supabase/functions/process-document-v2/index.ts`, `packages/ai-centre/supabase/migrations/003_ai_knowledge.sql`, and `006_ai_knowledge_metadata.sql`. An architecture review citing unnamed source material cannot be verified. |

> **Orientation Mandate Note**: For this documentation wave, ARCH-001 through ARCH-008 constitute the 90% substance review. CORE and OVL checks above are the 10% ceremony admin. IAA will not spend disproportionate effort on ceremony.

---

### Step 0.7 — Required PREHANDOVER Proof Structure

api-builder must commit a PREHANDOVER proof **before** invoking IAA at handover.
Per A-029 (§4.3b), the proof is immutable after commit. IAA will NOT edit it.

**Required fields in PREHANDOVER proof** (minimum — not a complete template):

```yaml
session_id: session-dckis-cl5d2-20260319   # or date of actual session
wave: DCKIS-CL5D2
branch: copilot/dckis-cl5d2-architecture-review
producing_agent: api-builder
pr_category: AAWP_MAT

# Deliverable evidence
deliverable_path: .agent-workspace/audit/AIMC-P1-upload-arch-review-20260319.md
deliverable_committed: true   # git SHA must be provided
deliverable_sha: <commit SHA>

# Source documents confirmed reviewed
source_documents_reviewed:
  - apps/maturion-maturity-legacy/supabase/functions/process-document-v2/index.ts
  - packages/ai-centre/supabase/migrations/003_ai_knowledge.sql
  - packages/ai-centre/supabase/migrations/006_ai_knowledge_metadata.sql

# Architecture review mandatory content
arch_verdict_present: true   # PASS or FAIL on re-hosting feasibility
schema_delta_documented: true
smart_chunk_reuse_addressed: true
dependency_migration_addressed: true
all_5_alignment_plan_topics_covered: true

# Execution plan update
aimc_lkiac_plan_updated: true   # CL-5-D2 recorded as COMPLETE
aimc_lkiac_plan_sha: <commit SHA>

# Governance
iaa_prebrief_path: .agent-admin/assurance/iaa-prebrief-dckis-cl5d2.md
iaa_prebrief_sha: <SHA of this pre-brief file>

# Pre-populated IAA token reference (A-029 §4.3b)
iaa_audit_token: IAA-session-dckis-cl5d2-20260319-PASS   # expected format — do NOT use PENDING

# Session memory
session_memory_path: .agent-workspace/api-builder/memory/session-dckis-cl5d2-20260319.md
session_memory_sha: <commit SHA>
```

> **A-021 REMINDER**: All evidence artifacts (deliverable, session memory, PREHANDOVER proof) must be **committed and pushed** before invoking IAA. Working-tree-only state at invocation time = immediate REJECTION-PACKAGE citing A-021.

> **A-029 REMINDER**: `iaa_audit_token` must contain the **expected reference** in format `IAA-session-dckis-cl5d2-YYYYMMDD-PASS` at commit time. `PENDING` or blank = CORE-016/CORE-018 FAIL.

---

### Step 0.8 — Scope Blockers and Governance Conflicts

**No blocking conflicts found at pre-brief time.** All entry criteria are satisfied.

#### Entry Criteria Status

| Entry Criterion | Status |
|----------------|--------|
| DCKIS-GOV-001 merged (FRS/TRS formally exist) | ✅ CONFIRMED — IAA token: `IAA-session-052-dckis-gov-001-20260319-PASS`; commit `3ba5d43` on main |
| CS2 wave-start authorisation for DCKIS-CL5D2 | ✅ CONFIRMED — GitHub issue opened and assigned by CS2 (@APGI-cmy) |
| `process-document-v2/index.ts` accessible | ✅ CONFIRMED — `apps/maturion-maturity-legacy/supabase/functions/process-document-v2/index.ts` present |
| `003_ai_knowledge.sql` accessible | ✅ CONFIRMED — `packages/ai-centre/supabase/migrations/003_ai_knowledge.sql` present |
| `006_ai_knowledge_metadata.sql` accessible | ✅ CONFIRMED — `packages/ai-centre/supabase/migrations/006_ai_knowledge_metadata.sql` present |
| `.agent-workspace/audit/` directory exists | ✅ CONFIRMED — Directory present with existing audit artifacts |

#### Advisory Notes (Not Blocking — For api-builder Awareness)

**ADVISORY-01 — Branch is currently empty**: The branch `copilot/dckis-cl5d2-architecture-review` currently has one commit ("Initial plan") with zero file changes vs main. api-builder must produce and commit all deliverables before invoking IAA at handover. This is the expected pre-work state.

**ADVISORY-02 — CL5D2-D2 is mandatory, not optional**: The alignment plan exit criteria explicitly require `governance/EXECUTION/AIMC_LKIAC_COMBINED_EXECUTION_PLAN.md` to reflect CL-5-D2 as COMPLETE. This file update must be included in the DCKIS-CL5D2 PR. Omitting it will cause ARCH-007 FAIL at handover.

**ADVISORY-03 — Explicit PASS/FAIL verdict is required**: The alignment plan mandates "Produce architecture review artefact with explicit PASS/FAIL verdict on re-hosting feasibility." A narrative-only review without a binary verdict will fail ARCH-001.

**ADVISORY-04 — ADR compliance**: The architecture review must not inadvertently contradict the four ADRs embedded in the alignment plan (ADR-001 through ADR-005). In particular, ADR-005 is absolute: Pipeline 1 (Criteria Parsing) must not be touched. Any recommendation in the review that touches Pipeline 1 scope will fail ARCH-006.

**ADVISORY-05 — Smart Chunk Reuse field names**: The alignment plan refers to specific column names (`chunked_from_tester`, `approved_via_tester`) as the Smart Chunk Reuse implementation. The review must address these by name to be verifiable by IAA at ARCH-003.

---

### Step 0.9 — Pre-Brief Classification Summary

```yaml
iaa_prebrief_id: iaa-prebrief-dckis-cl5d2
wave: DCKIS-CL5D2
branch: copilot/dckis-cl5d2-architecture-review
date: 2026-03-19
authored_by: independent-assurance-agent v6.2.0
invocation_mode: PHASE_0_PRE_BRIEF_ONLY

qualifying_tasks:
  - task_id: CL5D2-D1
    task_summary: Upload architecture review document for process-document-v2 re-hosting
    iaa_trigger_category: AAWP_MAT
    required_phases: [Phase_2_ALIGNMENT, Phase_3_ASSURANCE, Phase_4_VERDICT]
    required_evidence_artifacts:
      - .agent-workspace/audit/AIMC-P1-upload-arch-review-20260319.md
      - .agent-workspace/api-builder/memory/session-dckis-cl5d2-20260319.md
      - PREHANDOVER proof (path TBD by api-builder)
      - governance/EXECUTION/AIMC_LKIAC_COMBINED_EXECUTION_PLAN.md (CL-5-D2 = COMPLETE)
    applicable_overlays:
      - PRE_BRIEF_ASSURANCE (OVL-INJ-001)
      - AAWP_MAT (ARCH-001 through ARCH-008)
    specific_rules:
      - A-003 (ambiguity → mandatory)
      - A-021 (commit before invocation)
      - A-029 (PREHANDOVER immutability / token pre-population)
      - ARCH-001 (binary PASS/FAIL verdict required)
      - ARCH-007 (execution plan update mandatory)

entry_criteria_all_met: true
scope_blockers: NONE
advisory_flags: 5 (non-blocking — see Step 0.8)
adoption_phase: PHASE_B_BLOCKING
iaa_required_at_handover: YES — MANDATORY
```

---

**IAA Pre-Brief confirmation**: This Pre-Brief artifact declares all trigger categories, FFA checks, PREHANDOVER structure requirements, and scope flags visible at wave-start for DCKIS-CL5D2. api-builder may proceed to produce the architecture review deliverable. IAA will be invoked at handover once all deliverables are committed.

**Authority**: CS2 (Johan Ras / @APGI-cmy)
**Pre-Brief filed by**: independent-assurance-agent v6.2.0
**STOP-AND-FIX mandate**: ACTIVE — PHASE_B_BLOCKING
