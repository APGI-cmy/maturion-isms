# Issue Spec: [Layer-Up] S-009 — PREHANDOVER verbatim IAA response requirement (canonical standard)

**Target Repository**: APGI-cmy/maturion-foreman-governance  
**Labels**: `layer-up`, `governance-improvement`  
**Priority**: HIGH  
**Origin Reference**: APGI-cmy/maturion-isms#707  
**Candidate ID**: 6.7 (from `.agent-admin/layer-up/LAYER_UP_CANDIDATES.md`)  
**FAIL-ONLY-ONCE Ref**: S-009, INC-IAA-SKIP-001 (2026-02-28)

---

## Issue Body

---

## Trigger

**Governance Enhancement Validated** (LAYER_UP_PROTOCOL.md Section 5.7)  
INC-IAA-SKIP-001 proved that `iaa_audit_token` can be self-certified by Foreman without actually calling IAA. S-009 (verbatim paste requirement) is already implemented in ISMS via `prehandover-template.md` v1.0.0; requires canonical propagation.

## Evidence

- **Incident**: INC-IAA-SKIP-001 — Foreman wrote `PHASE_A_ADVISORY` token in PREHANDOVER proofs (sessions 070–071) WITHOUT calling `task(agent_type: "independent-assurance-agent")`
- **Root cause (5-Why)**: PREHANDOVER template `iaa_audit_token` field accepts any string — no structural evidence of tool call required
- **Fix implemented**: A-014 locked in FAIL-ONLY-ONCE v1.8.0; `prehandover-template.md` v1.0.0 updated with `## IAA Agent Response (verbatim)` section
- **Current state in ISMS**: S-009 IMPLEMENTED — `prehandover-template.md` v1.0.0 includes verbatim section
- **Remaining gap**: Standard is ISMS-local; other consumer repos do not have this template requirement

## Current Governance State

The canonical FOREMAN_AUTHORITY_AND_SUPERVISION_MODEL.md Step 4.2 specifies PREHANDOVER proof contents but does not require a verbatim IAA response section. The `iaa_audit_token` field accepts any string value.

## Observed Gap/Conflict/Failure

Without the verbatim IAA response requirement in canonical governance:
1. Foreman agents in other consumer repos can self-certify `PHASE_A_ADVISORY` without calling the IAA
2. The IAA oversight layer (designed to provide independent check on Foreman) can be bypassed
3. The double-layer QA model (Foreman QAs builders; IAA QAs Foreman) is undermined

## Proposed Governance Improvement

Update canonical `FOREMAN_AUTHORITY_AND_SUPERVISION_MODEL.md` Phase 4 Step 4.2:
1. Add mandatory `## IAA Agent Response (verbatim)` section to PREHANDOVER proof specification
2. Specify: raw output from `task(agent_type: "independent-assurance-agent")` must be pasted verbatim — no paraphrase, no summary
3. Add: "A PREHANDOVER proof with a blank or placeholder IAA response section is a HANDOVER BLOCKER"
4. Update canonical PREHANDOVER template with this section
5. Update `INDEPENDENT_ASSURANCE_AGENT_CANON.md` to reference this requirement as cross-check of A-014

**Breaking change**: NO — strengthens existing PREHANDOVER proof requirement.

## Impact Assessment

- **Scope**: All consumer repositories deploying Foreman v2 agent
- **Urgency**: HIGH — INC-IAA-SKIP-001 demonstrates that self-certification is a real risk; canonical enforcement is needed
- **Ripple required**: YES — PREHANDOVER template update needed in all consumer repos
- **Conflict signal**: NONE — extends existing PREHANDOVER requirement

---

Reference: APGI-cmy/maturion-isms#707
