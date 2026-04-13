# IAA Pre-Brief — Wave: mmm-concurrent-programme-analysis

**Artifact Type**: IAA Pre-Brief
**Artifact Path**: `.agent-admin/assurance/iaa-prebrief-mmm-concurrent-programme-analysis-20260408.md`
**Wave**: mmm-concurrent-programme-analysis
**Branch**: copilot/complete-concurrent-programme-analysis
**Issue**: maturion-isms#1303
**Date**: 2026-04-08
**IAA Version**: independent-assurance-agent v6.2.0 / contract 2.5.0
**Adoption Phase**: PHASE_B_BLOCKING — Hard gate ACTIVE
**Authority**: CS2 (Johan Ras / @APGI-cmy)
**Pre-Brief Mode**: Phase 0 — PRE-BRIEF invocation (Phase 2–4 deferred until handover)

---

## Wave Identification

| Field | Value |
|-------|-------|
| Wave name | mmm-concurrent-programme-analysis |
| Branch | copilot/complete-concurrent-programme-analysis |
| Issue | maturion-isms#1303 |
| CS2 Authorization | Issue opened by @APGI-cmy, assigned to foreman-v2-agent (Copilot) |
| Producing agent | foreman-v2-agent |
| Producing agent class | FOREMAN |
| No builder delegation | CONFIRMED — Foreman planning/analysis only |
| No production code | CONFIRMED |
| No CI/workflow changes | CONFIRMED |
| No agent contract changes | CONFIRMED |

---

## Task Classification

### Qualifying Tasks (IAA REQUIRED)

| Task ID | Task Summary | IAA Trigger Category | Required Phases | Required Evidence Artifacts |
|---------|-------------|---------------------|----------------|----------------------------|
| D1 | Analysis artifact: `modules/MMM/analysis/aimc-lkiac-mmm-concurrency-analysis.md` — programme-state analysis of AIMC, LKIAC, MAT terminal harvest, Roadmap decommission, MMM concurrent execution analysis | PRE_BUILD_STAGE_MODEL (Stage 8 dir; module lifecycle artifact) | Phase 2 category classification, Phase 3 core invariants + PRE_BUILD_GATES overlay + FFA-D1 checks, Phase 4 verdict | Committed D1 file, non-stub content, dependency matrix section |
| D2 | Implementation plan: `modules/MMM/07-implementation-plan/concurrent-prebuild-and-legacy-plan.md` — concurrent execution plan with dependency classification, sequencing, gating points | PRE_BUILD_STAGE_MODEL (Stage 8 directory — direct trigger) | Phase 2 classification, Phase 3 OVL-PBG-008 stage gating + FFA-D2 checks, Phase 4 verdict | Committed D2 file, non-stub content, issue breakdown embedded, Stage 8 NOT COMPLETE in BPT |
| D3 | Dependency matrix (embedded in D1 as Section 3) | PRE_BUILD_STAGE_MODEL (part of D1 artifact) | Phase 3 FFA-D1-002 | Verifiable dependency matrix section with HARD/SOFT/PARALLEL classification |
| D4 | Issue breakdown recommendation (embedded in D2 as Section 6) | PRE_BUILD_STAGE_MODEL (part of D2 artifact) | Phase 3 FFA-D2-002 | Actionable issue breakdown: named titles, sequencing, assignee class |

### Governance Ceremony Tasks (GOVERNANCE_AUDIT — MANDATORY in this PR context)

| Task ID | Task Summary | Category | Notes |
|---------|-------------|----------|-------|
| C1 | wave-current-tasks.md update | Foreman workspace admin | References Issue #1303 / wave mmm-concurrent-programme-analysis |
| C2 | PREHANDOVER proof | GOVERNANCE_AUDIT | Includes ripple assessment, pre-populated iaa_audit_token |
| C3 | Session memory | GOVERNANCE_AUDIT | CORE-015 |
| C4 | IAA Pre-Brief (this artifact) | IAA Pre-Brief — satisfies HFMC-04 | Committed before IAA invocation |
| C5 | IAA token (post-verdict) | Written by IAA at verdict | Must contain PHASE_B_BLOCKING_TOKEN: key |

---

## IAA Trigger Category Declaration

**Primary Category**: PRE_BUILD_STAGE_MODEL
**IAA Required**: YES — MANDATORY
**Trigger Basis**: `modules/MMM/07-implementation-plan/` is the canonical Stage 8 directory per BUILD_PROGRESS_TRACKER.md and PRE_BUILD_STAGE_MODEL_CANON.md. Any file placed in this directory triggers PRE_BUILD_STAGE_MODEL.
**Ambiguity Check**: CLEAR — trigger is unambiguous.
**Applicable Overlays**: PRE_BUILD_GATES (OVL-PBG-001 through OVL-PBG-016)
**PRE_BRIEF_ASSURANCE overlay**: Applicable — OVL-INJ-ADM-001, OVL-INJ-ADM-002, OVL-INJ-ADM-003

---

## Stage-Readiness View (CORE-025)

**Module**: MMM (Maturity Management Module)
**Source**: BUILD_PROGRESS_TRACKER.md (verified 2026-04-08)

| Stage | Name | Status |
|-------|------|--------|
| Stage 1 | App Description | ✅ COMPLETE |
| Stage 2 | UX Workflow & Wiring Spec | ⬜ NOT_STARTED |
| Stage 3 | FRS | ⬜ NOT_STARTED |
| Stage 4 | TRS | ⬜ NOT_STARTED |
| Stage 5 | Architecture | 🔄 IN_PROGRESS |
| Stage 6 | QA-to-Red | ⬜ NOT_STARTED |
| Stage 7 | PBFAG | ⬜ NOT_STARTED |
| Stage 8 | Implementation Plan | 🔄 PARTIAL this wave (NOT COMPLETE — stages 2–7 unmet) |
| Stage 9 | Builder Checklist | ⬜ NOT_STARTED |
| Stage 10 | IAA Pre-Brief (for build) | ⬜ NOT_STARTED |
| Stage 11 | Builder Appointment | ⬜ NOT_STARTED |
| Stage 12 | Build | ⬜ NOT_STARTED |

---

## FFA Checks IAA Will Run at Handover

### HFMC Checks (6 mandatory)

| ID | Check | What IAA verifies |
|----|-------|-------------------|
| HFMC-01 | Ripple Assessment | PREHANDOVER proof contains non-empty `## Ripple/Cross-Agent Assessment` section |
| HFMC-02 | Scope parity | wave-current-tasks.md references Issue #1303 / wave mmm-concurrent-programme-analysis |
| HFMC-03 | Committed artifacts completeness | ALL declared artifacts in `git ls-tree -r HEAD` (A-033) |
| HFMC-04 | Pre-Brief committed | This artifact committed on branch |
| HFMC-05 | Token ceremony | PREHANDOVER proof `iaa_audit_token: IAA-session-mmm-cpa-20260408-PASS` (not PENDING) |
| HFMC-06 | Evidence bundle | Full bundle: D1, D2, PREHANDOVER, session memory, pre-brief, wave-current-tasks — all non-empty and committed |

### Core Invariant Checks

| Check | What IAA verifies |
|-------|-------------------|
| CORE-007 | No STUB / TODO / FIXME / TBD in D1 or D2 |
| CORE-015 | Session memory committed |
| CORE-016 | IAA token file exists after verdict |
| CORE-017 | No `.github/agents/` modifications by Foreman |
| CORE-024 | IAA token contains `PHASE_B_BLOCKING_TOKEN:` non-empty |
| CORE-025 | Stage-readiness view declared (this artifact) |

### PRE_BUILD_GATES Overlay Checks

| Check | What IAA verifies |
|-------|-------------------|
| OVL-PBG-001 | `module_slug: "MMM"` matches directory |
| OVL-PBG-002 | BUILD_PROGRESS_TRACKER identity consistent |
| OVL-PBG-003 | Architecture doc references (advisory for pre-existing inconsistencies) |
| OVL-PBG-006 | BUILD_PROGRESS_TRACKER uses full 12-stage model |
| OVL-PBG-007 | Architecture doc stage references (advisory) |
| OVL-PBG-008 | Stage 8 NOT marked COMPLETE in BUILD_PROGRESS_TRACKER.md — BLOCKING if violated |

### Substantive FFA Checks

| FFA-ID | Requirement |
|--------|-------------|
| FFA-D1-001 | D1 contains: AIMC state, LKIAC state, MAT harvest state, Roadmap decommission state, MMM concurrency analysis |
| FFA-D1-002 | D1 includes dependency matrix (Section 3) with HARD/SOFT/PARALLEL classification |
| FFA-D1-003 | No stub/TBD/placeholder content in D1 analysis |
| FFA-D2-001 | D2 contains: dependency classification, sequencing, gating points |
| FFA-D2-002 | D2 contains issue breakdown (Section 6) with actionable named issues |
| FFA-D2-003 | D2 explicitly states which MMM stages are blocking/unblocking |
| FFA-BPT-001 | BUILD_PROGRESS_TRACKER Stage 8 NOT_STARTED or PARTIAL (not COMPLETE) |

---

## Scope Blockers

| SB-ID | Blocker | Classification |
|-------|---------|----------------|
| SB-001 | No production code (`apps/`, `packages/`, `lib/`) | HARD STOP |
| SB-002 | No CI/workflow changes (`.github/workflows/`) | HARD STOP |
| SB-003 | No agent contract changes (`.github/agents/`) | HARD STOP |
| SB-004 | No schema migrations (`supabase/migrations/`) | HARD STOP |
| SB-005 | No test file changes (`*.test.ts`, `*.spec.ts`) | HARD STOP |
| SB-006 | No CANON_INVENTORY.json changes | HARD STOP |
| SB-007 | Stage 8 NOT to be marked COMPLETE in BUILD_PROGRESS_TRACKER.md | HARD STOP (OVL-PBG-008) |
| SB-008 | Deliverable files at exactly declared paths only | HARD STOP (HFMC-03) |
| SB-009 | Analysis must be substantive — no stub/TBD content | HARD STOP (CORE-007) |

---

## Pre-Existing Advisory Items

| Advisory | Detail |
|----------|--------|
| ADV-001 | `architecture.md` references `modules/MMM/01-frs/` (old path); actual is `modules/MMM/02-frs/`. Non-blocking. |
| ADV-002 | `architecture.md` lists only partial stage sequence. Advisory. |
| ADV-003 | Directory numbering offset: `07-implementation-plan/` = Stage 8. Known structural pattern. |
| ADV-004 | Architecture.md states FRS → IN_PROGRESS while BUILD_PROGRESS_TRACKER shows NOT_STARTED. Advisory. |

---

## Mandatory Pre-IAA Verification Command

```bash
git ls-tree -r HEAD --name-only | grep -E "analysis/aimc-lkiac|concurrent-prebuild|PREHANDOVER-session-mmm-cpa|session-mmm-cpa|iaa-prebrief-mmm-concurrent|wave-current-tasks"
```

All 6 artifact types must appear. If any missing → `git add` + `git push` before invoking IAA.

---

## IAA Token Target

After Foreman completes all steps and invokes IAA, IAA will write verdict to:
`.agent-admin/assurance/iaa-token-session-mmm-cpa-20260408.md`

This file will contain `PHASE_B_BLOCKING_TOKEN: IAA-session-mmm-cpa-20260408-PASS` (if PASS).
Foreman must not write this file — it is IAA's exclusive output.

---

**Pre-Brief Status**: COMPLETE
**Qualifying Tasks Found**: 4 (D1, D2, D3 in D1, D4 in D2) + 4 ceremony tasks
**IAA Required**: YES — MANDATORY
**Adoption Phase**: PHASE_B_BLOCKING — Hard gate ACTIVE
**Pre-Brief generated by**: independent-assurance-agent (Phase 0 PRE-BRIEF mode) — content committed by foreman-v2-agent
**Authority**: CS2 (Johan Ras / @APGI-cmy)
