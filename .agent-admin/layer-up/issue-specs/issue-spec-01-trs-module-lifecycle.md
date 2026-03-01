# Issue Spec: [Layer-Up] TRS Stage — MODULE_LIFECYCLE_AND_REPO_STRUCTURE_STRATEGY.md upgrade

**Target Repository**: APGI-cmy/maturion-foreman-governance  
**Labels**: `layer-up`, `governance-improvement`  
**Priority**: HIGH  
**Origin Reference**: APGI-cmy/maturion-isms#707  
**Candidate ID**: 1.1 (from `.agent-admin/layer-up/LAYER_UP_CANDIDATES.md`)

---

## Issue Body

---

## Trigger

**Governance Enhancement Validated** (LAYER_UP_PROTOCOL.md Section 5.7)  
TRS (Technical Requirements Specification) stage validated across 8 modules in maturion-isms (PR #98, merged 2026-02-23).

## Evidence

- **File**: `governance/strategy/MODULE_LIFECYCLE_AND_REPO_STRUCTURE_STRATEGY.md` in APGI-cmy/maturion-isms
- **SHA256**: `b832fc05e9dfdb3cc238b3750a2131598383d1d32edb2d7382f6483fab460773`
- **Validation**: Applied to 8 modules in maturion-isms; eliminates late-discovery of technical constraints
- **Evidence package**: `LAYER_UP_TRS_GOVERNANCE_UPGRADE.md` in APGI-cmy/maturion-isms
- **Phase 1 completion**: `LAYER_UP_PHASE1_COMPLETE.md` in APGI-cmy/maturion-isms

## Current Governance State

Canonical `MODULE_LIFECYCLE_AND_REPO_STRUCTURE_STRATEGY.md` defines 6-stage module lifecycle (App Description → FRS → Architecture → Build Authorization → Implementation → Deployment).

## Observed Gap/Conflict/Failure

Direct FRS → Architecture transition causes late discovery of technical constraints and downstream failures. Module lifecycle misses a critical technical requirements stage between FRS and Architecture. This gap was observed across all 8 MAT modules.

## Proposed Governance Improvement

Update canonical `MODULE_LIFECYCLE_AND_REPO_STRUCTURE_STRATEGY.md` to:
1. Insert TRS (Technical Requirements Specification) as **Stage 1.5** between FRS and Architecture
2. Add comprehensive Section 4.1 defining TRS purpose, ownership, scope (5 categories: performance, security, integration, technology, constraints), and deliverables
3. Update module folder structure to include `01.5-trs/` path
4. Update lifecycle diagram to reflect 7-stage flow: App Description → FRS → **TRS** → Architecture → Build Authorization → Implementation → Deployment

**Breaking change**: MODERATE — adds mandatory stage between FRS and Architecture. New modules must create TRS artifacts. Existing modules are NOT required to retrofit TRS retroactively unless undergoing major revision.

## Impact Assessment

- **Scope**: All consumer repositories using module lifecycle governance
- **Urgency**: HIGH — prevents architecture-stage rework caused by missing technical requirements
- **Ripple required**: YES — 4 consumer repos (maturion-isms, office-app, PartPulse, R_Roster)
- **Conflict signal**: NONE — additive change, no conflict with existing canonical rules

---

Reference: APGI-cmy/maturion-isms#707
