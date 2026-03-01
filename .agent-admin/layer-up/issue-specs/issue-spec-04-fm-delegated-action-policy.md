# Issue Spec: [Layer-Up] FM_MATURION_DELEGATED_ACTION_POLICY.md → canonical governance

**Target Repository**: APGI-cmy/maturion-foreman-governance  
**Labels**: `layer-up`, `governance-improvement`  
**Priority**: MEDIUM  
**Origin Reference**: APGI-cmy/maturion-isms#707  
**Candidate ID**: 2.1 (from `.agent-admin/layer-up/LAYER_UP_CANDIDATES.md`)

---

## Issue Body

---

## Trigger

**Cross-Repository Pattern Observed** (LAYER_UP_PROTOCOL.md Section 5.8)  
Policy carries "Canonical Governance Policy v1.0" status in maturion-isms but is absent from canonical governance repository.

## Evidence

- **File**: `governance/policy/FM_MATURION_DELEGATED_ACTION_POLICY.md` in APGI-cmy/maturion-isms
- **Status in file**: "Canonical Governance Policy v1.0, Authority: Governance Administrator, Required By: G-C13"
- **Origin**: CS2-authorized policy operating in ISMS since 2026-02-22

## Current Governance State

No equivalent policy exists in canonical governance. The FM-to-Maturion delegated action governance pattern is only documented in maturion-isms.

## Observed Gap/Conflict/Failure

Policy marked as "Canonical Governance Policy" is not present in the canonical governance repository. Other consumer repositories do not receive this governance. FM agents in other repos may delegate without proper governance framework.

## Proposed Governance Improvement

Add `FM_MATURION_DELEGATED_ACTION_POLICY.md` to canonical governance policy directory:
1. Establishes governance framework for FM-to-Maturion delegated platform actions
2. Defines when/how FM delegates to Maturion (AI orchestrator)
3. Specifies audit evidence requirements for delegated actions
4. Defines delegation failure handling and escalation path

**Breaking change**: NO — adds policy, does not modify existing rules.

## Impact Assessment

- **Scope**: All consumer repositories using FM + Maturion AI orchestration
- **Urgency**: MEDIUM — policy is operating in ISMS but not enforced ecosystem-wide
- **Ripple required**: YES — consumer repos need this policy for FM governance compliance
- **Conflict signal**: NONE — new policy, no conflict with existing canonical rules

---

Reference: APGI-cmy/maturion-isms#707
