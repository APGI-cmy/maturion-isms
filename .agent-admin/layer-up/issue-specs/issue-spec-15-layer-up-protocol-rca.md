# Issue Spec: [Layer-Up] LAYER_UP_PROTOCOL_RCA_AND_IMPLEMENTATION.md → canonical learning evidence

**Target Repository**: APGI-cmy/maturion-foreman-governance  
**Labels**: `layer-up`, `governance-improvement`  
**Priority**: LOW  
**Origin Reference**: APGI-cmy/maturion-isms#707  
**Candidate ID**: 5.1 (from `.agent-admin/layer-up/LAYER_UP_CANDIDATES.md`)

---

## Issue Body

---

## Trigger

**Learning Promotion Threshold Met** (LAYER_UP_PROTOCOL.md Section 5.6)  
RCA documents the root cause of auto-layer-down failure and the implementation of fixes; valuable canonical learning evidence.

## Evidence

- **File**: `governance/rca/LAYER_UP_PROTOCOL_RCA_AND_IMPLEMENTATION.md` in APGI-cmy/maturion-isms
- **Origin**: Session-049 post-mortem (2026-02-23)
- **Documents**: repository_dispatch gap discovery, governance-ripple-sync.yml and layer-up-dispatch.yml implementation rationale

## Current Governance State

No canonical RCA exists documenting the governance ripple pipeline gap and how it was discovered and fixed. This learning exists only in maturion-isms.

## Observed Gap/Conflict/Failure

Without this RCA in canonical governance:
1. Other repos may encounter the same repository_dispatch gap without access to the RCA
2. The implementation rationale for governance-ripple-sync.yml is not canonically preserved
3. Protocol evolution evidence is lost when context is not preserved in canonical governance

## Proposed Governance Improvement

Add `LAYER_UP_PROTOCOL_RCA_AND_IMPLEMENTATION.md` to canonical governance `rca/` directory:
1. Documents the root cause of auto-layer-down failure (missing `repository_dispatch` handler)
2. Provides implementation rationale for `governance-ripple-sync.yml` and `layer-up-dispatch.yml`
3. Preserves protocol evolution evidence for future governance administrators
4. Serves as canonical evidence for the need for mandatory `governance-ripple-sync.yml` (candidate 4.2)

**Breaking change**: NO — learning documentation addition.

## Impact Assessment

- **Scope**: Governance administrators in all consumer repos
- **Urgency**: LOW — historical evidence; no immediate operational impact
- **Ripple required**: NO — documentation, consumer repos can access via canonical repo
- **Conflict signal**: NONE — new RCA document, no conflict

---

Reference: APGI-cmy/maturion-isms#707
