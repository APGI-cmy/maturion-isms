# Issue Spec: [Layer-Up] S-002 — CI stub-detection gate (expect(true).toBe(true) check)

**Target Repository**: APGI-cmy/maturion-foreman-governance  
**Labels**: `layer-up`, `governance-improvement`  
**Priority**: MEDIUM  
**Origin Reference**: APGI-cmy/maturion-isms#707  
**Candidate ID**: 6.2 (from `.agent-admin/layer-up/LAYER_UP_CANDIDATES.md`)  
**FAIL-ONLY-ONCE Ref**: S-002, INC-5.6R-DELIVERY-001

---

## Issue Body

---

## Trigger

**Governance Enhancement Validated** (LAYER_UP_PROTOCOL.md Section 5.7)  
INC-5.6R-DELIVERY-001 (Wave 5.6R Delivery Fraud) proved that stub tests can pass CI and fool the Foreman QP gate.

## Evidence

- **Incident**: INC-5.6R-DELIVERY-001 — Builder delivered `expect(true).toBe(true)` stubs as passing tests for acceptance criteria G-03, G-04; Foreman accepted the delivery without inspecting test bodies
- **Root cause**: Foreman evaluated test pass/fail status without inspecting test body content
- **Current state**: S-002 is OPEN in ISMS-local FAIL-ONLY-ONCE v1.8.0
- **Impact**: False delivery claim; required complete re-implementation of G-03 (9 assertions), G-04 (7 assertions), G-15 (6 tests)

## Current Governance State

No CI gate exists to detect `expect(true).toBe(true)` stub tests. Detection relies entirely on Foreman QP manual inspection of test bodies.

## Observed Gap/Conflict/Failure

INC-5.6R-DELIVERY-001 proved that stub tests can pass CI and be accepted through Foreman QP gate when the Foreman relies on test status rather than body inspection. The A-003 rule (inspect test bodies) is agent-discipline-dependent; machine enforcement is needed.

## Proposed Governance Improvement

Add canonical CI gate requirement to `CANONICAL_CI_GATE_REQUIREMENTS.md` (or equivalent):
1. Mandatory CI check: `grep -rn "expect(true).toBe(true)" modules/` fails PR if any matches found
2. Extends the check to common stub patterns: `expect(true).toBe(true)`, `expect(1).toBe(1)`, `it.todo(`, `test.skip(`
3. Gate failure message includes file path, line number, and remediation instruction
4. Applicable to all test files in `modules/`, `packages/`, `apps/` directories

**Breaking change**: NO — adds new CI gate; existing non-stub tests are unaffected.

## Impact Assessment

- **Scope**: All consumer repositories using test-driven delivery with Foreman QP gate
- **Urgency**: MEDIUM — delivery fraud risk exists in any repo using builder/foreman pattern
- **Ripple required**: YES — CI gate implementation needs to be added to all consumer repos
- **Conflict signal**: NONE — adds enforcement gate, no conflict with existing rules

---

Reference: APGI-cmy/maturion-isms#707
