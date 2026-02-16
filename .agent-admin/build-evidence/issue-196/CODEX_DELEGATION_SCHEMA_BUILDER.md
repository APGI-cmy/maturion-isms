# Codex Delegation: schema-builder Contract Enhancement Specification

**Prepared By**: Foreman (FM)
**Date**: 2026-02-16
**For**: Codex Advisor Agent
**Label**: `ai:codex-executor`
**Priority**: P0 — HIGH
**Authority**: FM Contract v2.1.0, Issue #196
**Status**: ✅ COMPLETE — Codex Advisor executed enhancement in builder contract v2.0.0

---

## Issue Title

Enhance schema-builder Contract for FM v2.1.0 + LAS v6.2.0 Gate Compliance

## Status

**COMPLETED** — The Codex Advisor agent has successfully enhanced the schema-builder contract.

## Original Issue Body

### Context

The schema-builder contract in `modules/mat/04-builder-appointment/builder-contract.md` §1 has been enhanced with Builder-Only Constraints, session memory protocol, and LAS v6.2.0 compliance sections as part of the unified contract document update (Issue #196).

This delegation requests Codex Advisor to **validate** the enhancements and ensure full compliance with all 8 LAS v6.2.0 builder categories.

### Required Validation Points

1. **Builder-Only Constraint** (§1 of contract):
   - Verify authorized file paths cover all schema-builder responsibilities (Wave 0)
   - Verify prohibited file paths prevent scope drift
   - Verify constraint supports merge gate Check 2 (Validate Builder Involvement)

2. **Session Memory Protocol** (§8 of contract):
   - Verify session memory template is complete for schema-builder context
   - Verify completion report format captures all required evidence
   - Verify delegation acceptance protocol aligns with FM appointment model

3. **LAS v6.2.0 Categories** (§0 Governance Binding table):
   - Category 0: Identity & Bindings — assignment table has contract version and LAS version
   - Category 1: Authority & Boundaries — Builder-Only Constraint covers authorized/prohibited scope
   - Category 2: Governance Loading — §6 enhanced with loading requirements
   - Category 3: Memory & Evidence — §8 session memory and completion report mandatory
   - Category 4: Ripple & Gates — §6 merge gate awareness table
   - Category 5: Escalation & Stop — §6 escalation and stop conditions
   - Category 6: Deliverables & Outputs — §1 scope, test coverage, acceptance criteria
   - Category 7: Prohibitions & Guardrails — §1 Forbidden Actions + Builder-Only Constraint

4. **Merge Gate Support**:
   - schema-builder artifacts must support Check 2 (Validate Builder Involvement)
   - Completion reports must be machine-detectable
   - Session memory must include builder attestation

5. **Contract Metadata**:
   - Contract version 2.0.0
   - LAS version 6.2.0
   - Updated date

### Acceptance Criteria

- [ ] All 8 LAS v6.2.0 categories satisfied for schema-builder
- [ ] Builder-Only Constraint structured for gate validation
- [ ] Session memory and completion report protocols complete
- [ ] No gaps vs FM v2.1.0 governance requirements
- [ ] Contract metadata updated

### References

- FM Contract v2.1.0 (Foreman-ISMS Agent Contract)
- `modules/mat/04-builder-appointment/builder-contract.md` (enhanced)
- `governance/canon/MERGE_GATE_INTERFACE_STANDARD.md`
- `governance/canon/EVIDENCE_ARTIFACT_BUNDLE_STANDARD.md`
- `docs/builder-checklist-development/BUILDER_AGENT_FILE_COMPLIANCE_DETAILED_SECTIONS.md`
- `governance/canon/BUILDER_CONTRACT_BINDING_CHECKLIST.md`

---

**Assignee**: Codex Advisor Agent
**Label**: `ai:codex-executor`

---

*END OF DELEGATION SPECIFICATION — schema-builder*
