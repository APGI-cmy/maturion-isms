# Issue Spec: [Layer-Up] PR_GATE_FAILURE_HANDLING_PROTOCOL.md → canonical governance

**Target Repository**: APGI-cmy/maturion-foreman-governance  
**Labels**: `layer-up`, `governance-improvement`  
**Priority**: MEDIUM  
**Origin Reference**: APGI-cmy/maturion-isms#707  
**Candidate ID**: 2.6 (from `.agent-admin/layer-up/LAYER_UP_CANDIDATES.md`)

---

## Issue Body

---

## Trigger

**Cross-Repository Pattern Observed** (LAYER_UP_PROTOCOL.md Section 5.8)  
Protocol pattern validated in maturion-isms; provides consistent governance response to PR gate failures.

## Evidence

- **File**: `governance/policy/PR_GATE_FAILURE_HANDLING_PROTOCOL.md` in APGI-cmy/maturion-isms
- **Origin**: Governance hardening wave (2026-02-25); addresses inconsistent PR gate failure response

## Current Governance State

No canonical protocol defines how to respond to PR gate failures. Each consumer repo handles gate failures ad-hoc, leading to inconsistent remediation and missed escalation.

## Observed Gap/Conflict/Failure

Without a canonical protocol:
1. Agents cannot distinguish governance gate failures (require Foreman action) from CI failures (require builder action)
2. No defined escalation path for persistent gate failures
3. No defined timeout for gate failure remediation

## Proposed Governance Improvement

Add `PR_GATE_FAILURE_HANDLING_PROTOCOL.md` to canonical governance specifying:
1. Classification of gate failure types (governance failure vs. technical failure)
2. Required response per failure type (who acts, what evidence is needed)
3. Escalation thresholds (persistent failures → CS2)
4. Timeout and re-run rules for flaky gate checks

**Breaking change**: NO — adds protocol for previously unspecified governance response.

## Impact Assessment

- **Scope**: All consumer repositories using CI merge gates and governance gates
- **Urgency**: MEDIUM — reduces ambiguity when gates fail
- **Ripple required**: YES — all consumer repos should follow this protocol
- **Conflict signal**: NONE — new protocol, no conflict with existing rules

---

Reference: APGI-cmy/maturion-isms#707
