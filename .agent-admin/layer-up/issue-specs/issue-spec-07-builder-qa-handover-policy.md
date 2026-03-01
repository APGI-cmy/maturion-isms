# Issue Spec: [Layer-Up] BUILDER_QA_HANDOVER_POLICY.md → canonical governance

**Target Repository**: APGI-cmy/maturion-foreman-governance  
**Labels**: `layer-up`, `governance-improvement`  
**Priority**: MEDIUM  
**Origin Reference**: APGI-cmy/maturion-isms#707  
**Candidate ID**: 2.4 (from `.agent-admin/layer-up/LAYER_UP_CANDIDATES.md`)

---

## Issue Body

---

## Trigger

**Cross-Repository Pattern Observed** (LAYER_UP_PROTOCOL.md Section 5.8)  
Builder QA handover pattern validated in maturion-isms across multiple build waves; applicable to all consumer repos using builder/foreman separation.

## Evidence

- **File**: `governance/policy/BUILDER_QA_HANDOVER_POLICY.md` in APGI-cmy/maturion-isms
- **Origin**: Emerged from Foreman Quality Professor gate requirements during Waves 1–10 in maturion-isms

## Current Governance State

Builder handover requirements are implicitly encoded in the Foreman contract but not as a standalone canonical policy document.

## Observed Gap/Conflict/Failure

Without a canonical handover policy, builder agents in other repos do not know the required evidence package for Foreman QP evaluation. This creates inconsistent handover quality and Foreman rejection cycles.

## Proposed Governance Improvement

Add `BUILDER_QA_HANDOVER_POLICY.md` to canonical governance policy directory specifying:
1. Required evidence artifacts for builder-to-foreman handover
2. Test evidence format requirements (pass count, zero skips, zero stubs)
3. Architecture compliance attestation requirements
4. Deprecation/warning zero-tolerance requirement
5. PREHANDOVER proof trigger conditions

**Breaking change**: NO — formalizes existing implicit requirements.

## Impact Assessment

- **Scope**: All consumer repositories using builder agent + foreman POLC model
- **Urgency**: MEDIUM — reduces Foreman rejection cycles
- **Ripple required**: YES — builder agents in all consumer repos need this standard
- **Conflict signal**: NONE — extends Foreman contract with explicit builder-side requirements

---

Reference: APGI-cmy/maturion-isms#707
