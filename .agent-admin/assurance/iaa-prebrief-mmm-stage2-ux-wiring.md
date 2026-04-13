# IAA Pre-Brief — MMM Stage 2: UX Workflow & Wiring Spec

**Agent**: independent-assurance-agent v6.2.0  
**Wave**: mmm-stage2-ux-workflow-wiring-spec-20260413  
**Issue**: maturion-isms#1352  
**Branch**: copilot/mmm-stage-2-wave-start-authorization  
**CS2 Authorization**: Issue #1352 opened and assigned by @APGI-cmy (CS2 = Johan Ras)  
**Pre-Brief Date**: 2026-04-13  
**Adoption Phase**: PHASE_B_BLOCKING  
**Ceremony-Admin Appointed**: NO  

---

## 1. Wave Summary

This wave produces the **UX Workflow & Wiring Spec** (Stage 2 of the canonical 12-stage Pre-Build Stage Model) for the Maturity Management Module (MMM/MAT). This is a **Stage 2 prebuild specification wave ONLY** — no implementation code, no FRS/TRS changes, no schema, no UI, no builder delegation.

Foreman produces the specification artifact directly. No builder appointment occurs.

### Deliverables Declared

| ID | Deliverable | Producer |
|----|------------|----------|
| D1 | UX Workflow & Wiring Spec — user journey maps, screen interactions | foreman-v2-agent |
| D2 | UX Workflow & Wiring Spec — data flows, UI→API→schema→reporting wiring | foreman-v2-agent |
| D3 | Open questions capture | foreman-v2-agent |
| D4 | BUILD_PROGRESS_TRACKER update (Stage 2 completion) | foreman-v2-agent |
| D5 | Phase 4 handover ceremony artifacts (PREHANDOVER, session memory) | foreman-v2-agent |

---

## 2. Qualifying Tasks & Trigger Categories

| Task | Trigger Category | IAA Required? | Rationale |
|------|-----------------|---------------|-----------|
| Produce UX Workflow & Wiring Spec (D1+D2) | PRE_BUILD_STAGE_MODEL | YES — MANDATORY | Creates Stage 2 pre-build artifact per PRE_BUILD_STAGE_MODEL_CANON.md §Stage 2; modifies module lifecycle stage artifacts |
| Update BUILD_PROGRESS_TRACKER (D4) | PRE_BUILD_STAGE_MODEL | YES — MANDATORY | Modifies `modules/mat/BUILD_PROGRESS_TRACKER.md` — stage advancement artifact |
| Phase 4 handover ceremony (D5) | CEREMONY (within PRE_BUILD_STAGE_MODEL scope) | YES — included in wave scope | PREHANDOVER proof and session memory are part of the qualifying wave |
| Capture open questions (D3) | EXEMPT (standalone doc) | NO — unless mixed with qualifying artifacts | Pure documentation capture; will be reviewed as context only |

**Overall Wave Classification**: **PRE_BUILD_STAGE_MODEL** — IAA is MANDATORY at handover.

---

## 3. Stage-Readiness View (per PRE_BUILD_STAGE_MODEL_CANON.md §10)

### Upstream Stages Status (12-Stage Canonical Model)

| Stage | Canonical Name | Status | Evidence Artifact |
|-------|---------------|--------|-------------------|
| 1 | App Description | ✅ COMPLETE | `modules/mat/00-app-description/MAT_APP_DESCRIPTION_v2.0.md` |
| **2** | **UX Workflow & Wiring Spec** | **🔄 THIS WAVE** | **To be produced by this wave** |
| 3 | FRS | ✅ COMPLETE | `modules/mat/01-frs/functional-requirements.md` (v1.5.0, 77 FRs) |
| 4 | TRS | ✅ COMPLETE | `modules/mat/01.5-trs/technical-requirements-specification.md` (77 TRs) |
| 5 | Architecture | ✅ COMPLETE | `modules/mat/02-architecture/` (14 documents, FROZEN) |
| 6 | QA-to-Red | ✅ COMPLETE | `governance/TEST_REGISTRY.json` (98 tests, all initially RED) |
| 7 | PBFAG | ⬜ NOT YET TRACKED | Not yet a distinct stage in current BUILD_PROGRESS_TRACKER |
| 8 | Implementation Plan | ✅ COMPLETE | `modules/mat/03-implementation-plan/implementation-plan.md` (v1.9.0) |
| 9 | Builder Checklist | ⬜ NOT YET TRACKED | Not yet a distinct stage in current BUILD_PROGRESS_TRACKER |
| 10 | IAA Pre-Brief | 🔄 IN PROGRESS | This artifact is the Stage 10 deliverable for this wave |
| 11 | Builder Appointment | ⬜ NOT APPLICABLE | No builder appointment in this wave |
| 12 | Build | ⬜ NOT APPLICABLE | No build execution in this wave |

### Artifacts Reviewed for Stage Completion Assessment

- `modules/mat/BUILD_PROGRESS_TRACKER.md` (v1.9)
- `modules/mat/module.manifest.json` (module_slug: "mat", module_name: "MAT")
- `modules/mat/00-app-description/MAT_APP_DESCRIPTION_v2.0.md`
- `modules/mat/01-frs/functional-requirements.md`
- `modules/mat/01.5-trs/` directory
- `modules/mat/02-architecture/` directory (14 architecture documents)
- `governance/TEST_REGISTRY.json`
- `modules/mat/03-implementation-plan/implementation-plan.md`

### Blockers Preventing Builder Appointment (Stage 11)

1. **Stage 2 not yet complete** — UX Workflow & Wiring Spec is the purpose of this wave
2. **BUILD_PROGRESS_TRACKER uses old shortened model** — Current tracker (v1.9) uses legacy numbering (Stages 0, 1, 1.5, 2, 2.5, 3) instead of the canonical 12-stage model. Per OVL-PBG-006, the tracker must be updated to the full 12-stage model before any future builder delegation. This is a **known structural gap** — not a blocker for this specification wave, but must be resolved before Stage 11.
3. **PBFAG (Stage 7) not yet tracked** — Not present as a distinct stage in the current tracker
4. **Builder Checklist (Stage 9) not yet tracked** — Not present as a distinct stage in the current tracker

> **NOTE**: Stages 3–6 and 8 are documented as COMPLETE in the current tracker. The MAT module has advanced significantly through implementation (11+ build waves completed), but the tracker structure pre-dates the canonical 12-stage model. The structural gap in tracker format is administrative — it does not invalidate the completed work. However, the tracker must be aligned to the 12-stage model as a governance obligation before future builder delegation.

---

## 4. Applicable Canon Overlays

| Overlay | Source | Applicable Checks |
|---------|--------|-------------------|
| PRE_BUILD_GATES | iaa-category-overlays.md | OVL-PBG-001 through OVL-PBG-010 (subset relevant to Stage 2 spec) |
| OVL-INJ-ADM-003 | iaa-category-overlays.md | Stage-readiness view declared (this artifact satisfies this) |
| Universal Ceremony Gate | iaa-category-overlays.md | CERT-001 through CERT-004 (at handover) |
| Core Invariants | iaa-core-invariants-checklist.md | CORE-013, CORE-016, CORE-018 (at handover) |

### Overlay-Specific Checks at Handover

| Check ID | Check Name | What IAA Will Verify |
|----------|-----------|---------------------|
| OVL-PBG-001 | module.manifest.json slug matches directory | `module_slug: "mat"` matches `modules/mat/` — pre-confirmed PASS |
| OVL-PBG-002 | BUILD_PROGRESS_TRACKER module identity consistent | Module name/slug consistency between tracker and manifest |
| OVL-PBG-008 | Stage gating respected | Stage 1 (App Description) is COMPLETE before Stage 2 begins — pre-confirmed PASS |
| OVL-PBG-009 | Legacy directory numbering flagged | Advisory: current tracker uses legacy numbering — to be flagged at handover |
| OVL-PBG-010 | Stage 2 UX Workflow & Wiring Spec present | The primary deliverable — must be committed and substantively complete |

### Checks NOT Applicable to This Wave

| Check ID | Reason Not Applicable |
|----------|----------------------|
| OVL-PBG-004 | No FRS wave builder delegation in this wave |
| OVL-PBG-006 | BUILD_PROGRESS_TRACKER 12-stage alignment is a known gap — advisory, not blocking for a spec wave |
| OVL-PBG-011 | No build work initiated |
| OVL-PBG-012 | No build work initiated |
| OVL-PBG-013 | No builder appointment |
| OVL-PBG-014 | No upstream artifacts being changed (new artifact created) |
| OVL-PBG-015 | Not first build wave |
| OVL-PBG-016 | Not first build wave |
| BD-000 through BD-029 | BUILD_DELIVERABLE overlay does not apply — no implementation code |

---

## 5. FAIL-ONLY-ONCE Checks Applicable

| Rule | Description | Applicability |
|------|------------|---------------|
| A-001 | IAA invocation evidence must be present | APPLICABLE — PREHANDOVER must reference IAA token |
| A-002 | IAA mandatory for all agent classes | N/A — no agent contract changes |
| A-023 | Ripple/Cross-Agent Assessment in PREHANDOVER | APPLICABLE — PREHANDOVER must include ripple section |
| A-025/A-029 | PREHANDOVER immutability / token file architecture | APPLICABLE — Foreman must pre-populate expected token ref in PREHANDOVER before IAA invocation |
| A-037 | PHASE_B_BLOCKING_TOKEN self-certification | APPLICABLE — token file must contain blocking token line |

---

## 6. Evidence Artifacts That Will Be Checked at Handover

| # | Artifact | Required? | What IAA Checks |
|---|----------|-----------|-----------------|
| 1 | UX Workflow & Wiring Spec document | **MANDATORY** | Substantive completeness: user journey maps, screen interactions, data flows, UI→API→schema→reporting wiring are present and internally consistent with App Description and Architecture |
| 2 | BUILD_PROGRESS_TRACKER update | **MANDATORY** | Stage 2 marked as complete/in-progress with artifact reference |
| 3 | PREHANDOVER proof | **MANDATORY** | Exists, contains iaa_audit_token with pre-populated expected ref, ripple section present, all bundle items committed |
| 4 | Session memory (Foreman) | **MANDATORY** | Exists (binary check only — no content audit) |
| 5 | Open questions document (D3) | **ADVISORY** | If present, reviewed as context. Absence not blocking. |
| 6 | IAA token file | **MANDATORY** (IAA writes this) | Written by IAA after ASSURANCE-TOKEN verdict |

### Substantive Review Focus (90% Effort at Handover)

The primary IAA assurance question at handover will be:

> **"Does this UX Workflow & Wiring Spec comprehensively describe the user journeys, screen interactions, data flows, and end-to-end wiring (UI → API → Schema → Reporting) for the MMM, such that a builder can implement Stage 5+ without gaps, ambiguities, or unstated assumptions?"**

Specific substantive checks:
1. **Completeness against App Description**: Every user-facing capability in the App Description has a corresponding workflow specification
2. **Wiring coverage**: Every declared data flow maps from UI component through API endpoint to schema entity to report output (where applicable)
3. **Framework-origin fork clarity**: Mode A (framework-supplied) vs Mode B (org-custom) flows are unambiguously defined
4. **Boundary and ownership wiring**: Cross-module boundaries (MMM↔PIT, MMM↔RADAM, MMM↔AIMC) are clearly demarcated with declared interface points
5. **Open question capture quality**: Identified gaps are actionable and traceable to specific workflow sections
6. **Alignment with frozen Architecture**: Wiring spec does not contradict the FROZEN architecture documents (v3.0.0)

---

## 7. Scope Blockers

| Blocker | Severity | Description | Resolution |
|---------|----------|-------------|------------|
| BUILD_PROGRESS_TRACKER format | **ADVISORY** | Tracker uses old shortened model (pre-12-stage). OVL-PBG-006 requires full 12-stage model. | Not blocking for this spec wave. Must be resolved before future builder delegation (Stage 11). CS2 to authorise migration plan. |
| No PBFAG stage tracked | **ADVISORY** | Stage 7 (PBFAG) is not tracked in current format | Same as above — 12-stage tracker alignment |
| No Builder Checklist stage tracked | **ADVISORY** | Stage 9 is not tracked in current format | Same as above — 12-stage tracker alignment |

**No HARD BLOCKERS exist for this wave.** The wave is authorised to proceed.

---

## 8. PREHANDOVER Structure Requirements

When Foreman prepares the PREHANDOVER proof for this wave, it MUST include:

```
## PREHANDOVER Proof Structure (Required)

session_id: [session identifier]
wave: mmm-stage2-ux-workflow-wiring-spec-20260413
issue: maturion-isms#1352
branch: copilot/mmm-stage-2-wave-start-authorization
producing_agent: foreman-v2-agent
producing_agent_class: foreman

## Deliverables
- [ ] D1: UX Workflow & Wiring Spec — user journey maps, screen interactions
- [ ] D2: UX Workflow & Wiring Spec — data flows, UI→API→schema→reporting wiring
- [ ] D3: Open questions capture
- [ ] D4: BUILD_PROGRESS_TRACKER update
- [ ] D5: Phase 4 handover ceremony artifacts

## Evidence Bundle
[List all committed files with relative paths]

## iaa_audit_token
[Pre-populated expected token reference: IAA-session-NNN-waveY-YYYYMMDD-PASS]

## Ripple / Cross-Agent Assessment
[Assessment of downstream impact — which agents/modules are affected]

## FAIL-ONLY-ONCE Attestation
fail_only_once_attested: true
rules_checked: [list applicable rules]

## CWT / Testing Section
[If tests applicable: CWT results. If spec-only wave with no tests: declare "No tests applicable — specification wave only"]
```

---

## 9. Anti-Regression Obligations (from Prior Sessions)

| Pattern | Source | Prevention |
|---------|--------|------------|
| PREHANDOVER must exist before IAA invocation | session-wave20-atomic-write-back-20260318 | Foreman commits PREHANDOVER with pre-populated token ref BEFORE invoking IAA |
| CWT section must be present | session-wave19-orchestration-20260317 | Even for spec-only waves, declare "No tests applicable" |
| A-032 column naming unconditional | session-wave19-orchestration-20260317-R2 | Not applicable to this wave (no schema changes) |
| BUILD_PROGRESS_TRACKER 12-stage model | OVL-PBG-006 | Advisory — flag at handover but do not block spec wave |

---

## 10. Summary

| Item | Value |
|------|-------|
| Wave | mmm-stage2-ux-workflow-wiring-spec-20260413 |
| IAA Trigger Category | PRE_BUILD_STAGE_MODEL |
| IAA Required at Handover | **YES — MANDATORY** |
| Adoption Phase | PHASE_B_BLOCKING |
| Hard Blockers | **NONE** |
| Advisory Findings | BUILD_PROGRESS_TRACKER format (pre-12-stage model) |
| Ceremony-Admin | NOT APPOINTED |
| Qualifying Tasks | 3 (D1+D2 spec, D4 tracker update, D5 handover ceremony) |
| Non-Qualifying Tasks | 1 (D3 open questions — standalone doc) |
| Primary Assurance Focus | Substantive completeness of UX Workflow & Wiring Spec |

---

**Authority**: CS2 (Johan Ras / @APGI-cmy)  
**IAA Version**: independent-assurance-agent v6.2.0  
**Contract Version**: 2.5.0  
**Pre-Brief Generated**: 2026-04-13  
**Status**: COMMITTED — Wave authorised to proceed
