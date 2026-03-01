# Issue Spec: [Layer-Up] AUTOMATED_DEPRECATION_DETECTION_GATE.md → canonical governance

**Target Repository**: APGI-cmy/maturion-foreman-governance  
**Labels**: `layer-up`, `governance-improvement`  
**Priority**: MEDIUM  
**Origin Reference**: APGI-cmy/maturion-isms#707  
**Candidate ID**: 2.2 (from `.agent-admin/layer-up/LAYER_UP_CANDIDATES.md`)

---

## Issue Body

---

## Trigger

**Governance Enhancement Validated** (LAYER_UP_PROTOCOL.md Section 5.7) + **Cross-Repository Pattern Observed** (Section 5.8)  
Policy carries "Canonical Governance Policy v1.0, Authority: Corporate Governance Canon, Source Learning: BL-026" status in maturion-isms.

## Evidence

- **File**: `governance/policy/AUTOMATED_DEPRECATION_DETECTION_GATE.md` in APGI-cmy/maturion-isms
- **Status in file**: "Canonical Governance Policy v1.0, Authority: Corporate Governance Canon, Source Learning: BL-026"
- **Learning origin**: BL-026 — triggered by Wave 2.13 builder reflection in maturion-isms
- **Validation**: Operating in maturion-isms; deprecation warnings now treated as OPOJD gate failures

## Current Governance State

No canonical deprecation detection gate policy exists. Consumer repos may allow deprecation warnings to accumulate, creating technical debt that blocks delivery.

## Observed Gap/Conflict/Failure

BL-026 learning (Wave 2.13) established that deprecation warnings are delivery-quality signals, not cosmetic issues. Without canonical enforcement, other consumer repos allow deprecation warnings that undermine the OPOJD standard.

## Proposed Governance Improvement

Add `AUTOMATED_DEPRECATION_DETECTION_GATE.md` to canonical governance policy directory:
1. Mandatory automated deprecation detection gate for technical debt prevention
2. Establishes deprecation warnings as OPOJD gate failures (zero-tolerance policy)
3. Defines automated CI/CD enforcement requirements
4. References BL-026 learning as evidentiary basis

**Breaking change**: NO — adds policy gate. Consumer repos must add CI enforcement, but existing code is not immediately invalidated.

## Impact Assessment

- **Scope**: All consumer repositories using OPOJD delivery standard
- **Urgency**: MEDIUM — technical debt accumulates without this gate
- **Ripple required**: YES — all consumer repos need CI deprecation detection
- **Conflict signal**: NONE — extends existing OPOJD standard

---

Reference: APGI-cmy/maturion-isms#707
