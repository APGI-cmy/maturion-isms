# Issue Spec: [Layer-Up] TRS Stage — APP_DESCRIPTION_REQUIREMENT_POLICY.md flow diagram update

**Target Repository**: APGI-cmy/maturion-foreman-governance  
**Labels**: `layer-up`, `governance-improvement`  
**Priority**: HIGH  
**Origin Reference**: APGI-cmy/maturion-isms#707  
**Candidate ID**: 1.2 (from `.agent-admin/layer-up/LAYER_UP_CANDIDATES.md`)

---

## Issue Body

---

## Trigger

**Governance Enhancement Validated** (LAYER_UP_PROTOCOL.md Section 5.7)  
Companion change to TRS module lifecycle upgrade (candidate 1.1). Required to maintain policy flow consistency.

## Evidence

- **File**: `governance/policy/APP_DESCRIPTION_REQUIREMENT_POLICY.md` in APGI-cmy/maturion-isms
- **SHA256**: `3e14b061c313aab7b70197846b333f17b7de7db445b6feb9b9cf57afc88b422c`
- **Evidence package**: `LAYER_UP_TRS_GOVERNANCE_UPGRADE.md` in APGI-cmy/maturion-isms

## Current Governance State

Canonical `APP_DESCRIPTION_REQUIREMENT_POLICY.md` defines the development flow as:  
App Description → FRS → Architecture → Build Authorization → Implementation

## Observed Gap/Conflict/Failure

After TRS stage is added to module lifecycle (candidate 1.1), the policy flow diagram becomes inconsistent — it omits TRS. This creates a governance contradiction between the lifecycle strategy and the app description policy.

## Proposed Governance Improvement

Update canonical `APP_DESCRIPTION_REQUIREMENT_POLICY.md` to:
1. Update the canonical flow diagram to include TRS stage
2. Update ordering rule to: App Description → FRS → **TRS** → Architecture → Build Authorization → Implementation
3. Add reference to `MODULE_LIFECYCLE_AND_REPO_STRUCTURE_STRATEGY.md` Section 4.1 for TRS requirements

**Breaking change**: YES — ordering rule change. Any governance document or workflow that encodes the old ordering must be updated.

## Impact Assessment

- **Scope**: All consumer repositories using app description governance  
- **Urgency**: HIGH — must be coordinated with candidate 1.1 (module lifecycle change) to avoid inconsistency
- **Ripple required**: YES — same 4 consumer repos as candidate 1.1
- **Conflict signal**: NONE — companion change to 1.1, additive

---

Reference: APGI-cmy/maturion-isms#707
