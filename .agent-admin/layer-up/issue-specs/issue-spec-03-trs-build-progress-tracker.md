# Issue Spec: [Layer-Up] TRS Stage — BUILD_PROGRESS_TRACKER_TEMPLATE.md (new canonical template)

**Target Repository**: APGI-cmy/maturion-foreman-governance  
**Labels**: `layer-up`, `governance-improvement`  
**Priority**: HIGH  
**Origin Reference**: APGI-cmy/maturion-isms#707  
**Candidate ID**: 1.3 (from `.agent-admin/layer-up/LAYER_UP_CANDIDATES.md`)

---

## Issue Body

---

## Trigger

**Governance Enhancement Validated** (LAYER_UP_PROTOCOL.md Section 5.7)  
New template validated in maturion-isms (PR #98); standardizes module lifecycle progress tracking across ecosystem.

## Evidence

- **File**: `governance/templates/BUILD_PROGRESS_TRACKER_TEMPLATE.md` in APGI-cmy/maturion-isms (NEW file)
- **SHA256**: `070d3345e0b3904e8b14fcb8a3dde745cd2dca5787c3e275c9355283e2c8e1f4`
- **Evidence package**: `LAYER_UP_TRS_GOVERNANCE_UPGRADE.md` in APGI-cmy/maturion-isms

## Current Governance State

No canonical template exists for module lifecycle progress tracking. Each module creates ad-hoc tracking documents, leading to inconsistency and missing audit trails.

## Observed Gap/Conflict/Failure

Absence of standardized progress tracking template leads to:
1. Inconsistent tracking across modules
2. Missing governance compliance audit trails
3. Difficulty identifying module lifecycle stage at a glance
4. No standardized format for Build Authorization gate documentation

## Proposed Governance Improvement

Add `BUILD_PROGRESS_TRACKER_TEMPLATE.md` to canonical governance templates directory:
1. Standardized template for tracking module lifecycle progress
2. All 7 stages documented with checklists (including TRS Stage 1.5)
3. Wave-level progress tracking with state machine (PENDING → IN_PROGRESS → COMPLETE)
4. Governance compliance section with OPOJD evidence requirements
5. Continuous improvement table for wave-level learning capture

**Breaking change**: NO — new template, not required retroactively. Existing modules may adopt at their own pace.

## Impact Assessment

- **Scope**: All consumer repositories with modules following lifecycle governance
- **Urgency**: HIGH — provides immediate audit-readiness benefit
- **Ripple required**: YES — template should be available in all consumer repos
- **Conflict signal**: NONE — new file, no conflict

---

Reference: APGI-cmy/maturion-isms#707
