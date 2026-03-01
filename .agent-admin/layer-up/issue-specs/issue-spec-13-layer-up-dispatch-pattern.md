# Issue Spec: [Layer-Up] layer-up-dispatch.yml → document as canonical workflow pattern

**Target Repository**: APGI-cmy/maturion-foreman-governance  
**Labels**: `layer-up`, `governance-improvement`  
**Priority**: LOW  
**Origin Reference**: APGI-cmy/maturion-isms#707  
**Candidate ID**: 4.1 (from `.agent-admin/layer-up/LAYER_UP_CANDIDATES.md`)

---

## Issue Body

---

## Trigger

**Learning Promotion Threshold Met** (LAYER_UP_PROTOCOL.md Section 5.6)  
Workflow pattern validated end-to-end in maturion-isms (PR #426); other consumer repos need this pattern.

## Evidence

- **File**: `.github/workflows/layer-up-dispatch.yml` in APGI-cmy/maturion-isms
- **Validated in**: PR #426 (session-049 implementation, 2026-02-23)
- **Functionality**: Automates LAYER_UP_PROTOCOL.md Phase 3 escalation (maturion-isms issue → maturion-foreman-governance issue)

## Current Governance State

The workflow pattern exists only in maturion-isms. Other consumer repositories do not have an automated mechanism to dispatch layer-up issues to the canonical governance repository.

## Observed Gap/Conflict/Failure

Without the workflow pattern documented canonically:
1. Other consumer repos must manually create governance repo issues (slow, error-prone)
2. The automated governance feedback loop is not available ecosystem-wide
3. Layer-up candidates accumulate without dispatch mechanism

## Proposed Governance Improvement

Document `layer-up-dispatch.yml` as a **canonical workflow template** in the governance repository:
1. Add template workflow to canonical `workflow-templates/` directory
2. Document configuration points (governance repo target, label names, token requirements)
3. Provide implementation guide for consumer repos
4. Include dup-check logic and comment-back patterns

**Breaking change**: NO — new template documentation.

## Impact Assessment

- **Scope**: All consumer repositories that need automated layer-up dispatch
- **Urgency**: LOW — manual dispatch is available as fallback
- **Ripple required**: NO — consumer repos can adopt at own pace via documentation
- **Conflict signal**: NONE — new template, no conflict

---

Reference: APGI-cmy/maturion-isms#707
