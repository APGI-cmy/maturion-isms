# IAA Pre-Brief — Wave: mmm-harvest-map-revision

**Agent**: independent-assurance-agent v6.2.0 (contract 2.5.0)
**Wave**: mmm-harvest-map-revision-20260413
**Issue**: maturion-isms#1345
**Date**: 2026-04-13
**Adoption Phase**: PHASE_B_BLOCKING — Hard gate ACTIVE
**Authority**: CS2 (Johan Ras / @APGI-cmy)

---

## 1. Wave Summary

CS2 opened issue #1345 requesting 9 specific improvements to the MMM Harvest Map / Ownership
Transition Matrix (`modules/MMM/harvest-map/harvest-map.md`) before MMM Stage 2 / FRS / TRS
derivation can proceed. Foreman revises the governance planning artifact directly — no builder
delegation, no implementation code.

**Deliverables**:
- D1: Revised harvest-map.md with all 9 improvements
- D2: Change note / rationale documenting what changed and why
- D3: Final readiness recommendation for CS2 approval

---

## 2. Qualifying Tasks

| Task ID | Task Summary | IAA Trigger Category | IAA Required? |
|---------|-------------|---------------------|---------------|
| D1 | Revise `modules/MMM/harvest-map/harvest-map.md` with 9 improvements (source-state model, switchover-gate logic, "Adopt as-is" reassessment, MMM↔PIT boundary, framework vs evidence ingestion, legacy retirement, CL-3.5/CL-13 anchoring, migration-class clarity, open-questions extension) | PRE_BUILD_STAGE_MODEL | **YES — MANDATORY** |
| D2 | Produce change note / rationale | Supporting artifact (covered by D1) | YES (part of D1 bundle) |
| D3 | Final readiness recommendation to CS2 | Supporting artifact (covered by D1) | YES (part of D1 bundle) |

**Non-qualifying tasks in this wave**: None. All tasks are qualifying.

---

## 3. Trigger Category Justification

**Primary category**: PRE_BUILD_STAGE_MODEL

**Reasoning**: The harvest map is explicitly identified in issue #1345 as a gate artifact
that must be hardened "before MMM Stage 2 proceeds." Per `iaa-trigger-table.md` v2.4.0,
PRE_BUILD_STAGE_MODEL covers "any file that defines or advances a module's pre-build
lifecycle stage." The harvest map defines the convergence control decisions that are
prerequisites for FRS/TRS derivation (Stage 2+). Modifying it for Stage 2 readiness
directly advances the module's pre-build lifecycle.

**Secondary note**: This is NOT a build deliverable. No executable code, schema migrations,
API endpoints, or frontend components are being produced. BUILD_DELIVERABLE overlay (BD-*)
does NOT apply.

---

## 4. Required Phases at Handover

| Phase | Required? | Notes |
|-------|-----------|-------|
| Phase 1 (Identity & Preflight) | YES | Standard IAA preflight |
| Phase 2 (Alignment) | YES | PR classification, independence check |
| Phase 3 (Assurance Work) | YES | Core invariants + PRE_BUILD_GATES overlay + governance substance checks |
| Phase 4 (Verdict & Handover) | YES | Binary verdict, token file, session memory |

---

## 5. Required Evidence Artifacts at Handover

The following artifacts MUST be committed to the branch BEFORE IAA is invoked for Phase 2–4 assurance:

| # | Artifact | Path (expected) | Purpose |
|---|----------|-----------------|---------|
| 1 | Revised harvest map (D1) | `modules/MMM/harvest-map/harvest-map.md` | Primary deliverable — revised governance planning artifact |
| 2 | Change note (D2) | `modules/MMM/harvest-map/CHANGE_NOTE_mmm-harvest-map-revision.md` or equivalent | Documents what changed and rationale for each of the 9 improvements |
| 3 | Readiness recommendation (D3) | Included in PREHANDOVER proof or separate file | Foreman's recommendation to CS2 |
| 4 | PREHANDOVER proof | `PREHANDOVER_PROOF_mmm-harvest-map-revision.md` or equivalent | Ceremony: scope, artifacts, ripple assessment, IAA token field |
| 5 | Foreman session memory | `.agent-workspace/foreman-v2/memory/session-*.md` | Foreman's session record |
| 6 | SCOPE_DECLARATION.md | Foreman equivalent | Must match PR diff file list exactly (A-026) |
| 7 | IAA Pre-Brief artifact | `.agent-admin/assurance/iaa-prebrief-mmm-harvest-map-revision-20260413.md` | This file (must be committed before handover) |

---

## 6. Applicable Overlays and Checks

### 6.1 Universal Ceremony Gate (CERT-001 through CERT-004)

| Check | What IAA Verifies |
|-------|-------------------|
| CERT-001 | PREHANDOVER proof exists on branch |
| CERT-002 | Session memory exists on branch |
| CERT-003 | FAIL-ONLY-ONCE attestation declared in session memory |
| CERT-004 | `iaa_audit_token` field present in PREHANDOVER proof |

### 6.2 Core Invariants (applicable subset — governance doc revision)

| Check | Applies? | Notes |
|-------|----------|-------|
| CORE-005 | YES | Governance block present in any modified governance artifact |
| CORE-007 | YES | No placeholder/TODO/FIXME in delivered artifacts |
| CORE-013 | YES | IAA invocation evidence present |
| CORE-014 | YES | No class exemption claimed |
| CORE-015 | YES | Session memory present |
| CORE-016 | YES | IAA token file exists (created during handover) |
| CORE-018 | YES | Complete evidence artifact sweep |
| CORE-019 | YES | IAA token cross-verification (first invocation exception applies) |
| CORE-020 | YES | Zero partial pass rule |
| CORE-021 | YES | Zero severity tolerance |
| CORE-001–004, 008–012 | NO | AGENT_CONTRACT-specific — no agent contracts modified |
| CORE-017 | NO | No .github/agents/ files modified |

### 6.3 PRE_BUILD_GATES Overlay (PRE_BUILD_STAGE_MODEL category)

IAA will verify at handover:
- Whether the harvest map revision correctly supports Stage 2 readiness
- Whether stage progression claims in any module manifest or BUILD_PROGRESS_TRACKER are consistent with the revised harvest map
- No premature stage advancement claims

### 6.4 Governance Substance Checks (adapted from CANON_GOVERNANCE overlay)

Since the harvest map is a governance-grade planning artifact (not canon, but governance-weight), IAA will apply substance checks by analogy:

| Check | What IAA Verifies |
|-------|-------------------|
| Strategy alignment | Do the 9 improvements align with `MMM_strategy.md` v0.1.0 and `MMM_app_description.md` v0.5.0? |
| No contradictions | Does the revised harvest map contradict any existing governance artifact? |
| Completeness of 9 improvements | Are all 9 improvements from issue #1345 actually addressed in the diff? Missing improvement = REJECTION-PACKAGE. |
| Ripple impact | Does the revision create downstream obligations for PIT, Maturity Roadmap, or other modules? |
| Open questions integrity | Does the extended open-questions register introduce new blocking questions without a resolution path? |

### 6.5 High-Frequency Miss Checks (HFMC-01 through HFMC-06)

All 6 HFMC checks apply at handover. Key risk areas for this wave:
- HFMC-01 (Ripple): Harvest map changes WILL have cross-module ripple — Foreman must document this
- HFMC-03 (Committed artifacts): All D1/D2/D3 must be committed, not "will commit"
- HFMC-04 (Pre-brief): This artifact must exist on branch before handover

---

## 7. FAIL-ONLY-ONCE Checks Applicable

| Rule | Description | Applies? | Verification Method |
|------|-------------|----------|---------------------|
| A-001 | IAA invocation evidence present | YES | PREHANDOVER proof contains `iaa_audit_token` field |
| A-003 | Ambiguity resolves to mandatory | YES | Classification was not ambiguous, but rule is always loaded |
| A-015 | Full PREHANDOVER ceremony required | YES | No content-type exemption for governance docs |
| A-021 | Commit before IAA invocation | YES | All artifacts on branch before IAA Phase 2–4 |
| A-023 | Ripple assessment required | YES | PREHANDOVER must contain ripple section |
| A-026 | SCOPE_DECLARATION parity | YES | File list must match PR diff exactly |
| A-029 | Artifact immutability | YES | PREHANDOVER read-only after commit; IAA token to dedicated file |

---

## 8. Scope Blockers

| # | Blocker | Status | Impact |
|---|---------|--------|--------|
| — | None identified | N/A | No scope blockers detected for this wave |

---

## 9. Ceremony-Admin Status

`ceremony_admin_appointed`: **NO**
ECAP three-role split check: **N/A** at handover.

---

## 10. Anti-Regression Obligations

| Pattern | Obligation | Mechanically Verified Before Phase 2–4? |
|---------|-----------|----------------------------------------|
| A-021 (commit before invocation) | All D1/D2/D3 + ceremony artifacts committed | YES — `git ls-tree HEAD` verification |
| A-023 (ripple assessment) | PREHANDOVER contains non-empty ripple section | YES — content check |
| A-026 (SCOPE_DECLARATION parity) | File list matches `git diff --name-only` | YES — parity script |
| HFMC recurrence | CERT-001 through CERT-004 all pass | YES — existence checks |

---

## 11. Stage-Readiness View (OVL-INJ-ADM-003)

| Stage | Status | Notes |
|-------|--------|-------|
| 1. App Description | COMPLETE | `MMM_app_description.md` v0.5.0 — CS2-approved (maturion-isms#1298) |
| 2. UX Workflow & Wiring Spec | PENDING | Not yet produced for MMM |
| 3. FRS | PENDING | Blocked until harvest map revision accepted |
| 4. TRS | PENDING | Blocked until FRS |
| 5. Architecture | PENDING | Blocked until FRS/TRS |
| 6. QA-to-Red | PENDING | Blocked until Architecture |
| 7. PBFAG | PENDING | Blocked until QA-to-Red |
| 8. Implementation Plan | PENDING | Blocked until PBFAG |
| 9. Builder Checklist | PENDING | Blocked until Implementation Plan |
| 10. IAA Pre-Brief (build) | PENDING | Separate from this governance Pre-Brief |
| 11. Builder Appointment | PENDING | Blocked until stages 1–10 complete |
| 12. Build | PENDING | Blocked until Builder Appointment |

**Current gate**: Stage 1 COMPLETE. Harvest map revision (this wave) is a pre-Stage-2 governance gate. Stages 2–12 remain PENDING.

---

## 12. Pre-Brief Verdict

**Status**: PHASE_A_ADVISORY — Pre-Brief complete.
**Qualifying tasks**: 3 (D1, D2, D3) — all covered under PRE_BUILD_STAGE_MODEL trigger.
**IAA invocation at handover**: MANDATORY.
**Blocking enforcement**: PHASE_B_BLOCKING — hard gate active at handover.

---

**Pre-Brief produced by**: independent-assurance-agent v6.2.0
**Session**: Pre-Brief invocation for wave mmm-harvest-map-revision
**Date**: 2026-04-13
**Authority**: CS2 only (@APGI-cmy)
