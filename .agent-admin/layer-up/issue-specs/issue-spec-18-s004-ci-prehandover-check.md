# Issue Spec: [Layer-Up] S-004 — CI mandatory PREHANDOVER proof check

**Target Repository**: APGI-cmy/maturion-foreman-governance  
**Labels**: `layer-up`, `governance-improvement`  
**Priority**: MEDIUM  
**Origin Reference**: APGI-cmy/maturion-isms#707  
**Candidate ID**: 6.3 (from `.agent-admin/layer-up/LAYER_UP_CANDIDATES.md`)  
**FAIL-ONLY-ONCE Ref**: S-004, INC-PREHANDOVER-OMISSION-20260224

---

## Issue Body

---

## Trigger

**Governance Enhancement Validated** (LAYER_UP_PROTOCOL.md Section 5.7)  
INC-PREHANDOVER-OMISSION-20260224 proved that the PREHANDOVER protocol can be silently omitted without CI catching it.

## Evidence

- **Incident**: INC-PREHANDOVER-OMISSION-20260224 — A complete governance workflow session completed without executing Phase 4 PREHANDOVER protocol; evidence bundle, PREHANDOVER proof, session memory, and parking station append were all omitted
- **Root cause**: Agent operated as general-purpose code implementer; no CI gate exists to fail a PR when PREHANDOVER proof is absent
- **Current state**: S-004 is OPEN in ISMS-local FAIL-ONLY-ONCE v1.8.0

## Current Governance State

The PREHANDOVER protocol is a soft governance obligation — agents are expected to execute it, but no CI gate enforces its presence. A PR can be merged without any PREHANDOVER proof.

## Observed Gap/Conflict/Failure

INC-PREHANDOVER-OMISSION-20260224 proved that the PREHANDOVER protocol can be skipped entirely without detection. The Phase 4 protocol is the primary governance checkpoint for every wave — its absence means the wave is ungoverned.

## Proposed Governance Improvement

Add canonical CI gate requirement:
1. CI check that fails PR when no `.agent-admin/prehandover/proof-*.md` file is present in the diff
2. Alternative: CI check that reads the PR diff for a file matching `PREHANDOVER-session-*.md` in `.agent-workspace/foreman-v2/memory/`
3. Gate failure message: "This PR is missing a PREHANDOVER proof. Per Phase 4 of the Foreman contract, a PREHANDOVER proof is mandatory for all waves. See FOREMAN_AUTHORITY_AND_SUPERVISION_MODEL.md."
4. Document the CI gate in `CANONICAL_CI_GATE_REQUIREMENTS.md` with reference to FOREMAN_AUTHORITY_AND_SUPERVISION_MODEL.md Phase 4

**Breaking change**: NO — adds CI gate for existing mandatory requirement.

## Impact Assessment

- **Scope**: All consumer repositories using Foreman v2 four-phase contract
- **Urgency**: MEDIUM — every ungoverned PR is a governance gap
- **Ripple required**: YES — CI gate implementation needed in all consumer repos
- **Conflict signal**: NONE — enforces existing protocol, no conflict

---

Reference: APGI-cmy/maturion-isms#707
