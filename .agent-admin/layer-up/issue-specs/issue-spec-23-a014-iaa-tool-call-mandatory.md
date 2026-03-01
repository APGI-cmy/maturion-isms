# Issue Spec: [Layer-Up] A-014 — IAA tool call mandatory rule → canonical FOREMAN_AUTHORITY_AND_SUPERVISION_MODEL.md

**Target Repository**: APGI-cmy/maturion-foreman-governance  
**Labels**: `layer-up`, `governance-improvement`  
**Priority**: HIGH  
**Origin Reference**: APGI-cmy/maturion-isms#707  
**Candidate ID**: 7.1 (from `.agent-admin/layer-up/LAYER_UP_CANDIDATES.md`)  
**Origin**: CS2 directive 2026-02-28; A-014 in FAIL-ONLY-ONCE v1.8.0

---

## Issue Body

---

## Trigger

**Governance Enhancement Validated** (LAYER_UP_PROTOCOL.md Section 5.7)  
A-014 was locked in ISMS-local FAIL-ONLY-ONCE v1.8.0 by CS2 (2026-02-28) following INC-IAA-SKIP-001. Rule is universally applicable; requires canonical propagation to `FOREMAN_AUTHORITY_AND_SUPERVISION_MODEL.md`.

## Evidence

- **Rule**: A-014 — "The `independent-assurance-agent` MUST be invoked via the `task` tool as the FIRST action in Phase 4 Step 4.3a — before writing any `iaa_audit_token` value in the PREHANDOVER proof."
- **Authority**: CS2 — maturion-isms (2026-02-28); locked in FAIL-ONLY-ONCE v1.8.0
- **Violation class**: INC-IAA-SKIP-001 (PHASE_A_ADVISORY FABRICATION breach)
- **Current state**: A-014 is in ISMS-local Tier 2 registry; NOT yet in canonical FOREMAN_AUTHORITY_AND_SUPERVISION_MODEL.md

## Current Governance State

Canonical `FOREMAN_AUTHORITY_AND_SUPERVISION_MODEL.md` Phase 4 Step 4.3a describes the IAA invocation process but does not explicitly state "call the `task` tool FIRST before writing any `iaa_audit_token` value." The text describes what to OUTPUT in advisory mode, which was misinterpreted as permission to skip the tool call.

## Observed Gap/Conflict/Failure

INC-IAA-SKIP-001 occurred because the canonical contract text allowed ambiguous interpretation. The A-014 rule (ISMS-local) resolves this ambiguity by explicitly requiring the `task` tool call FIRST. Without canonical propagation, other consumer repos deploying Foreman v2 are exposed to the same vulnerability.

## Proposed Governance Improvement

Update canonical `FOREMAN_AUTHORITY_AND_SUPERVISION_MODEL.md` Phase 4 Step 4.3a:
1. Add explicit imperative at the START of Step 4.3a: "**ACTION REQUIRED — CALL THE TASK TOOL NOW**: Before writing anything in this step, call `task(agent_type: 'independent-assurance-agent', ...)`. Do not write any `iaa_audit_token` value until you have received the IAA response."
2. Rewrite "Phase A advisory mode" condition to require failed tool call (not absent tool call)
3. Add "The only permitted exception is a tool error — which must be logged verbatim and escalated to CS2"
4. Reference violation class: INC-IAA-SKIP-001

**Breaking change**: NO — clarifies existing Phase 4 Step 4.3a intent; no behavioral change for compliant implementations.

## Impact Assessment

- **Scope**: All consumer repositories deploying Foreman v2 agent with IAA oversight
- **Urgency**: HIGH — ongoing risk of PHASE_A_ADVISORY fabrication in any consumer repo without A-014 explicitly in their contract
- **Ripple required**: YES — foreman-v2-agent.md in all consumer repos needs this clarification
- **Conflict signal**: NONE — clarifies existing requirement, no conflict

---

Reference: APGI-cmy/maturion-isms#707
