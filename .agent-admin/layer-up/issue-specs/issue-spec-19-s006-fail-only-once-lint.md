# Issue Spec: [Layer-Up] S-006 — CI FAIL-ONLY-ONCE status validation lint

**Target Repository**: APGI-cmy/maturion-foreman-governance  
**Labels**: `layer-up`, `governance-improvement`  
**Priority**: MEDIUM  
**Origin Reference**: APGI-cmy/maturion-isms#707  
**Candidate ID**: 6.4 (from `.agent-admin/layer-up/LAYER_UP_CANDIDATES.md`)  
**FAIL-ONLY-ONCE Ref**: S-006, maturion-isms#498

---

## Issue Body

---

## Trigger

**Governance Enhancement Validated** (LAYER_UP_PROTOCOL.md Section 5.7)  
Originated from maturion-isms#498; the FAIL-ONLY-ONCE HARD STOP rule depends on agent discipline; machine enforcement prevents registry corruption from going undetected.

## Evidence

- **Origin issue**: maturion-isms#498
- **Rule being enforced**: FAIL-ONLY-ONCE PREFLIGHT §1.3 — if any incident has an invalid status, treat as registry corruption and HALT
- **Current state**: S-006 is OPEN in ISMS-local FAIL-ONLY-ONCE v1.8.0
- **Allowed statuses**: `OPEN | IN_PROGRESS | REMEDIATED | ACCEPTED_RISK (CS2)`

## Current Governance State

The FAIL-ONLY-ONCE PREFLIGHT HARD STOP rule is agent-discipline-dependent. An agent might miss an invalid status if the registry has a typo or unauthorized status value. No CI gate validates the registry format.

## Observed Gap/Conflict/Failure

Without CI validation of FAIL-ONLY-ONCE incident statuses:
1. Registry corruption (invalid status values) could pass undetected until an agent reads the file
2. An agent might accept an invalid status without triggering the HARD STOP
3. No audit trail exists for status changes over time

## Proposed Governance Improvement

Add canonical CI lint requirement:
1. CI check that parses `FAIL-ONLY-ONCE.md` (or equivalent breach registry) and validates every incident status is in the allowed set (`OPEN | IN_PROGRESS | REMEDIATED | ACCEPTED_RISK (CS2)`)
2. Any incident with a status NOT in the allowed set: CI FAIL with specific error message
3. Gate failure message: "FAIL-ONLY-ONCE registry contains invalid status '<value>' for incident '<id>'. Valid statuses: OPEN | IN_PROGRESS | REMEDIATED | ACCEPTED_RISK (CS2)."
4. Document lint check requirements in `CANONICAL_CI_GATE_REQUIREMENTS.md`

**Breaking change**: NO — adds CI validation for existing registry format requirement.

## Impact Assessment

- **Scope**: All consumer repositories maintaining a FAIL-ONLY-ONCE breach registry
- **Urgency**: MEDIUM — registry corruption is a latent risk; agent-discipline dependency is a single point of failure
- **Ripple required**: YES — CI lint needed in all consumer repos with FAIL-ONLY-ONCE registries
- **Conflict signal**: NONE — enforces existing format requirement

---

Reference: APGI-cmy/maturion-isms#707
