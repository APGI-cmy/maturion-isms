# Issue Spec: [Layer-Up] S-003 — AAWP deliverable table line-by-line verification as mandatory pre-handover step

**Target Repository**: APGI-cmy/maturion-foreman-governance  
**Labels**: `layer-up`, `governance-improvement`  
**Priority**: MEDIUM  
**Origin Reference**: APGI-cmy/maturion-isms#707  
**Candidate ID**: 6.8 (from `.agent-admin/layer-up/LAYER_UP_CANDIDATES.md`)  
**FAIL-ONLY-ONCE Ref**: S-003, INC-WAVE3-20260224

---

## Issue Body

---

## Trigger

**Governance Enhancement Validated** (LAYER_UP_PROTOCOL.md Section 5.7)  
INC-WAVE3-20260224 (Wave 3 Incomplete Scope Verification) proved that a wave can be delivered with only 2 of 10 required deliverable rows present in the PR diff, with 8 pre-existing files assumed complete without explicit verification.

## Evidence

- **Incident**: INC-WAVE3-20260224 — Wave 3 PR raised with only 2 of 10 deliverable rows in the diff. 8 files were pre-existing from Wave 2 scaffolds and assumed complete without explicit verification against Wave 3 acceptance criteria.
- **Root cause**: AAWP (Agent Acceptance Work Package) Wave 3 deliverable table not verified line-by-line before PR. Pre-existing files assumed complete without explicit accounting.
- **Corrective action taken**: Wave Completeness Gate checklist added to PREHANDOVER proof template
- **Current state**: S-003 is OPEN in ISMS-local FAIL-ONLY-ONCE v1.8.0 — mandatory checklist step not yet in canonical Foreman contract

## Current Governance State

Canonical `FOREMAN_AUTHORITY_AND_SUPERVISION_MODEL.md` Phase 3 Step 3.5 (Quality Professor) and Phase 4 Step 4.1 (OPOJD Gate) do not explicitly require line-by-line verification of the wave deliverable table. The OPOJD check is high-level; it does not mandate that the Foreman explicitly account for every pre-existing file vs. newly created file in the wave scope.

## Observed Gap/Conflict/Failure

INC-WAVE3-20260224 proved that a wave can pass QP evaluation with a partial deliverable when pre-existing files are assumed (not verified) to be complete. Without a mandatory numbered step requiring line-by-line deliverable table verification, partial deliveries can pass the merge gate.

## Proposed Governance Improvement

Update canonical `FOREMAN_AUTHORITY_AND_SUPERVISION_MODEL.md` Phase 4 Step 4.1 (OPOJD Gate) to add a mandatory explicit checklist step:

> "**Wave Completeness Gate**: Verify the wave deliverable table line-by-line.  
> For each deliverable row:  
> (a) Confirm the file/artifact EXISTS in the PR diff (newly created or explicitly modified)  
> (b) If pre-existing: explicitly confirm it meets this wave's acceptance criteria  
> (c) Record: file path, diff status (new/modified/pre-existing), acceptance criterion verified  
> Zero unaccounted deliverable rows permitted."

Also update `CANONICAL_PRE_HANDOVER_CHECKLIST.md` (or equivalent) with this as a numbered mandatory step.

**Breaking change**: NO — makes explicit an implicit verification requirement.

## Impact Assessment

- **Scope**: All consumer repositories using AAWP/wave deliverable tables with Foreman v2
- **Urgency**: MEDIUM — partial deliveries can pass undetected without this check
- **Ripple required**: YES — Foreman contracts in all consumer repos should include this mandatory step
- **Conflict signal**: NONE — extends existing OPOJD gate with more explicit verification

---

Reference: APGI-cmy/maturion-isms#707
