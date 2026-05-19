# IAA Wave Record — pit-stage8-implementation-plan

**Wave**: pit-stage8-implementation-plan  
**Branch**: copilot/initiate-pit-stage-8-implementation-plan  
**Issue**: #1677 — Foreman: Initiate PIT Stage 8 Implementation Plan after Stage 7 gate-pass merge  
**Agent**: independent-assurance-agent  
**Wave Record Created**: 2026-05-19

---

## PRE-BRIEF

**Pre-Brief Date**: 2026-05-19  
**Invocation**: PRE-BRIEF (Phase 0 only)  
**Prerequisite check**: PR #1674 merged to `main` — CONFIRMED  
**ceremony_admin_appointed**: PENDING (no wave-specific `wave-current-tasks.md` for this wave found on branch)

### Canonical Pre-Brief Output

```text
Qualifying tasks: T1 modules/pit/BUILD_PROGRESS_TRACKER.md stage-8-initiation update; T2 modules/pit/08-implementation-plan/implementation-plan.md create/update; T3 modules/pit/08-implementation-plan/* supporting planning artifacts (if present); T4 PREHANDOVER/admin evidence files (non-triggering alone, MIXED when combined with T1/T2/T3).

Applicable overlay: PRE_BUILD_STAGE_MODEL (mandatory) with PRE_BUILD_GATES overlay OVL-PBG-001..OVL-PBG-019 + OVL-PBG-ADM-001; PRE_BRIEF_ASSURANCE (OVL-INJ-001..OVL-INJ-ADM-003) for pre-brief artifact and stage-readiness posture.

Anti-regression obligations: NO — FUNCTIONAL-BEHAVIOUR-REGISTRY checks are mandatory for BUILD/AAWP_MAT runtime-delivery PRs; this Stage 8 wave is docs/governance planning scope (reference: FUNCTIONAL-BEHAVIOUR-REGISTRY.md, purpose/scope).
```

### Trigger Categories (declared)

- **PRE_BUILD_STAGE_MODEL** — mandatory trigger (Stage 8 implementation-plan and tracker stage progression artifacts).
- **MIXED** — applies if EXEMPT governance/admin artifacts are included with triggering artifacts in same PR.
- **EXEMPT (solo only)** — retrospective/session/admin artifacts only; not applicable if mixed with triggering paths.

### FFA Checks (declared)

- **FFA-01..FFA-06** are **not active** for this pre-build docs/governance initiation wave.
- FFA summary activates during product BUILD/AAWP_MAT assurance, not at Stage 8 planning pre-brief.

### PREHANDOVER Structure (required for final assurance invocation)

- Scope declaration matching actual PR diff.
- Trigger classification + overlay declaration (including PRE_BUILD_GATES range).
- Stage-readiness view (stages complete/pending, blockers to Stage 11).
- Evidence map for Stage 8 guardrails (routes, RED-to-GREEN allocation, wave acceptance evidence).
- IAA token field populated per current §4.3b architecture expectations.

### Scope Blockers (current)

1. No wave-specific `.agent-workspace/foreman-v2/personal/wave-current-tasks*` artifact found for `pit-stage8-implementation-plan` on this branch.
2. `ceremony_admin_appointed` is unresolved (PENDING) for this wave context.
3. `modules/pit/08-implementation-plan/` artifact set is not yet present on this branch (expected for producer wave implementation).

