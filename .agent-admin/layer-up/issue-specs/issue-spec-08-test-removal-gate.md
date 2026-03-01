# Issue Spec: [Layer-Up] TEST_REMOVAL_GOVERNANCE_GATE.md → canonical governance

**Target Repository**: APGI-cmy/maturion-foreman-governance  
**Labels**: `layer-up`, `governance-improvement`  
**Priority**: MEDIUM  
**Origin Reference**: APGI-cmy/maturion-isms#707  
**Candidate ID**: 2.5 (from `.agent-admin/layer-up/LAYER_UP_CANDIDATES.md`)

---

## Issue Body

---

## Trigger

**Cross-Repository Pattern Observed** (LAYER_UP_PROTOCOL.md Section 5.8)  
Test removal gate validated in maturion-isms; prevents unauthorized test removal that could mask delivery failures.

## Evidence

- **File**: `governance/policy/TEST_REMOVAL_GOVERNANCE_GATE.md` in APGI-cmy/maturion-isms
- **Origin**: Governance hardening wave (2026-02-25); addresses delivery fraud risk from test count reduction

## Current Governance State

No canonical policy governs test removal. The only protection is the OPOJD standard (100% GREEN tests), but a builder could pass OPOJD by removing failing tests rather than fixing them.

## Observed Gap/Conflict/Failure

Without a test removal gate, a builder can increase test pass rate by removing tests rather than fixing failures. This circumvents the OPOJD standard while appearing compliant. This class of delivery fraud was identified during post-mortem analysis.

## Proposed Governance Improvement

Add `TEST_REMOVAL_GOVERNANCE_GATE.md` to canonical governance specifying:
1. Any PR that reduces total test count must include an explicit justification
2. Test count reduction requires Foreman QP approval (not just CI pass)
3. Automated CI check: compare test count against base branch; flag decreases
4. Exception process for legitimate test refactoring (merge of equivalent tests)

**Breaking change**: NO — adds governance gate for a previously ungated action.

## Impact Assessment

- **Scope**: All consumer repositories using test-driven OPOJD delivery
- **Urgency**: MEDIUM — prevents a class of delivery fraud that CI alone cannot catch
- **Ripple required**: YES — CI test-count check needs to be added to all consumer repos
- **Conflict signal**: NONE — new gate, no conflict

---

Reference: APGI-cmy/maturion-isms#707
