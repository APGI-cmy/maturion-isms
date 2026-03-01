# Issue Spec: [Layer-Up] PREHANDOVER proof template with verbatim IAA section → canonical governance template

**Target Repository**: APGI-cmy/maturion-foreman-governance  
**Labels**: `layer-up`, `governance-improvement`  
**Priority**: HIGH  
**Origin Reference**: APGI-cmy/maturion-isms#707  
**Candidate ID**: 7.2 (from `.agent-admin/layer-up/LAYER_UP_CANDIDATES.md`)  
**Origin**: D4 deliverable from session-073-layer-up-iaa-tier2-20260228; S-009 implementation

---

## Issue Body

---

## Trigger

**Governance Enhancement Validated** (LAYER_UP_PROTOCOL.md Section 5.7)  
`prehandover-template.md` v1.0.0 was created in ISMS Tier 2 (session-073, 2026-02-28) with the mandatory `## IAA Agent Response (verbatim)` section (S-009). Template should be promoted to canonical governance for ecosystem-wide use.

## Evidence

- **File**: `.agent-workspace/foreman-v2/knowledge/prehandover-template.md` v1.0.0 in APGI-cmy/maturion-isms
- **Created**: Session-073 (2026-02-28) as D4 deliverable for layer-up IAA tier 2 wave
- **Contains**: Full PREHANDOVER proof template with mandatory IAA Agent Response (verbatim) section
- **IAA validation**: IAA session-020 PASS confirmed template meets CORE-016 requirements
- **Foreman session**: session-073-layer-up-iaa-tier2-20260228

## Current Governance State

No canonical PREHANDOVER proof template exists in the governance repository. The only canonical PREHANDOVER proof specification is in `FOREMAN_AUTHORITY_AND_SUPERVISION_MODEL.md` Phase 4 Step 4.2 (prose, not a template). Each Foreman implementation creates ad-hoc proof files.

## Observed Gap/Conflict/Failure

Without a canonical template:
1. PREHANDOVER proofs vary in format and completeness across consumer repos
2. The `## IAA Agent Response (verbatim)` section (critical for A-014 compliance) may be omitted
3. PREHANDOVER proof validation (IAA CORE-016 check) cannot apply a consistent standard
4. New Foreman deployments must create their own template without canonical guidance

## Proposed Governance Improvement

Add `PREHANDOVER_PROOF_TEMPLATE.md` to canonical governance templates directory:
1. Complete PREHANDOVER proof template with all mandatory sections:
   - Session identity table (session_id, date, agent, wave, trigger)
   - OPOJD gate checklist (zero failures, zero skips, zero stubs, zero warnings, evidence artifacts, architecture compliance)
   - §4.3 merge gate parity check result
   - IAA invocation record
   - `## IAA Agent Response (verbatim)` section (mandatory — A-014 compliance)
   - `iaa_audit_token` field (starts as PENDING; updated after IAA response)
   - IAA audit token recorded checklist item
   - CS2 authorization evidence field
2. Add template version history and authority reference
3. Update `FOREMAN_AUTHORITY_AND_SUPERVISION_MODEL.md` Phase 4 Step 4.2 to reference canonical template

**Breaking change**: NO — new canonical template; does not invalidate existing proofs.

## Impact Assessment

- **Scope**: All consumer repositories deploying Foreman v2 agent
- **Urgency**: HIGH — standardizes a critical governance artifact; ensures A-014 compliance across ecosystem
- **Ripple required**: YES — template should be available in all consumer repos' Tier 2 knowledge
- **Conflict signal**: NONE — new template, no conflict with existing rules

---

Reference: APGI-cmy/maturion-isms#707
