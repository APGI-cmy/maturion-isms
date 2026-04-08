# Session Memory — foreman-v2-agent — Session 160

**Session ID**: session-160-normalize-dir-structure-20260408
**Date**: 2026-04-08
**Agent Version**: foreman-v2-agent v6.2.0 (contract 2.9.0)
**Branch**: copilot/normalize-maturion-isms-directory-structure
**Issue**: maturion-isms#1285 — [WIP] Normalize maturion-isms module directory structures to canonical model
**Wave**: normalize-maturion-isms-directory-structure

---

## Preflight Attestation

```yaml
fail_only_once_attested: true
fail_only_once_version: 4.2.0
unresolved_breaches: none
canon_inventory_check: PASS (198 canons, 0 placeholder hashes)
tier2_loaded: true
prior_sessions_reviewed:
  - session-159-ps-b-fail-only-once-v420-20260407
  - session-1277-mmm-39b-20260407
  - session-058-wave-1266-20260407
  - session-iaa-12stage-20260407
  - session-dckis-qa-red-20260319
unresolved_items_from_prior_sessions: none
iaa_prebrief_artifact: .agent-admin/assurance/iaa-prebrief-normalize-directory-structure-20260408.md
prebrief_wave: normalize-maturion-isms-directory-structure
prebrief_tasks_count: 10
open_improvements_reviewed: [S-001, S-002, S-003, S-004, S-005, S-006, S-007, S-008, S-009, S-010, S-011, S-012, S-013, S-014, S-015, S-016, S-017, S-018, S-019, S-020, S-021, S-022, S-023, S-024, S-026, S-027, S-028, S-032, S-033, S-034, S-035]
```

---

## Phase 1 Preflight Output

**Step 1.1 — Identity:**
> "I am foreman-v2-agent, class: foreman, version 6.2.0.
> Role: POLC Supervisor. Lock: SELF-MOD-FM-001. Authority: CS2 only."

**Step 1.2 — Tier 2 loaded:**
> "Tier 2 loaded. Version: 2.5.0. Files: [FAIL-ONLY-ONCE.md v4.2.0, specialist-registry.md,
> domain-flag-index.md, session-memory-template.md, prehandover-template.md,
> FM_QP_ENHANCED_QUICK_REFERENCE.md, WAVE-CURRENT-TASKS-PROTOCOL.md,
> wave-reconciliation-checklist.md]. Staleness: CURRENT"

**Step 1.3 — Tier 1 governance:**
> "Tier 1 governance verified. CANON_INVENTORY: PASS (198 canons, 0 placeholder hashes). Constraints loaded."

**Step 1.4 — Session memory:**
> "Sessions reviewed: [session-159-ps-b-fail-only-once-v420-20260407, session-1277-mmm-39b-20260407,
> session-058-wave-1266-20260407, session-iaa-12stage-20260407, session-dckis-qa-red-20260319].
> Unresolved items: none. Breaches: none."

**Step 1.5 — FAIL-ONLY-ONCE:**
> "FAIL-ONLY-ONCE breach registry:
>   Open breaches: none. Status: CLEAR TO PROCEED"

**Step 1.6 — Merge gate:**
> "Merge gate checks loaded: [Merge Gate Interface/merge-gate/verdict, Merge Gate Interface/governance/alignment,
> Merge Gate Interface/stop-and-fix/enforcement, POLC Boundary Validation/foreman-implementation-check,
> POLC Boundary Validation/builder-involvement-check, POLC Boundary Validation/session-memory-check,
> Evidence Bundle Validation/prehandover-proof-check]. Parity enforcement: BLOCKING. Local check before Phase 4."

**Step 1.7:**
> "PREFLIGHT COMPLETE. Status: STANDBY — wave-start authorized by CS2 (issue #1285 opened/assigned by @APGI-cmy)"

**Step 1.8 — IAA Pre-Brief:**
> "IAA Pre-Brief invoked. Artifact committed: .agent-admin/assurance/iaa-prebrief-normalize-directory-structure-20260408.md
> IAA Trigger: PRE_BUILD_STAGE_MODEL (MANDATORY). 10 ACs declared. 7 scope blockers.
> B-006 (ai-centre): IAA recommends Option C — exclude ai-centre (lives at packages/ai-centre/, BUILD_PROGRESS_TRACKER.md already 12-stage compliant).
> Status: CLEAR TO PROCEED"

---

## Phase 2 Alignment Output

**CS2 Authorization**: Issue #1285 opened and assigned by @APGI-cmy (CS2 = Johan Ras). VALID.

**Verb Classification**:
> "Task verb: normalize / align / restructure
>   Classification: POLC-Orchestration (repo-structure alignment, lifecycle-normalization)
>   Mode flags loaded: REPO_ALIGNMENT, LIFECYCLE_NORMALIZATION
>   Proceeding in mode: POLC-Orchestration."

**Pre-Build Gates**: Not applicable — documentation/structural normalization wave, no production code build delegation.

**Pre-Brief check**:
> "wave-current-tasks.md: committed
>   Pre-Brief artifact: EXISTS at .agent-admin/assurance/iaa-prebrief-normalize-directory-structure-20260408.md
>   Status: CLEAR TO PROCEED TO PHASE 3"

---

## Phase 3 — Orchestration

### Module Classification (confirmed from repo state)

| Module | Classification | App Description State | Action |
|--------|---------------|----------------------|--------|
| amc | ACTIVE — FRESH START | EXISTS | Scaffold 01-11 + _legacy |
| incident-intelligence | ACTIVE — FRESH START | EXISTS | Rename legacy folders to canonical |
| xdetect | ACTIVE — FRESH START | EXISTS | Rename legacy folders to canonical |
| isms | ACTIVE — RETROFIT NOW | EMPTY (anomaly) | Rename + create retrofit stub |
| pit | ACTIVE — RETROFIT NOW | EMPTY (anomaly) | Rename + create retrofit stub |
| course-crafter | ACTIVE — RETROFIT NOW | EMPTY (anomaly) | Rename + create retrofit stub |
| risk-management | ACTIVE — RETROFIT NOW | EMPTY (anomaly) | Rename + create retrofit stub |
| MMM | ACTIVE — RETROFIT NOW | EXISTS | Rename + preserve existing |
| mat | CLOSED | N/A | NOT TOUCHED |
| maturity-roadmap | CLOSED | N/A | NOT TOUCHED |
| ai-centre | EXCLUDED (lives at packages/) | N/A | B-006: tracker already 12-stage compliant |

### Agents Delegated To

| Agent | Task | Issue | Status |
|-------|------|-------|--------|
| governance-liaison-isms-agent | T-NORM-001 through T-NORM-010: Full structural normalization | maturion-isms#1285 (same issue, delegated as sub-task) | DELEGATED |

### IAA Pre-Brief Artifact
`.agent-admin/assurance/iaa-prebrief-normalize-directory-structure-20260408.md`

---

## Phase 4 — Handover (PENDING)

PREHANDOVER proof: PENDING — to be created after governance-liaison-isms-agent delivers

---

*Session: session-160-normalize-dir-structure-20260408 | Wave: normalize-maturion-isms-directory-structure | Authority: CS2*
