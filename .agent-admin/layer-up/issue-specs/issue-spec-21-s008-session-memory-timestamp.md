# Issue Spec: [Layer-Up] S-008 — CI session memory timestamp enforcement (preflight detection)

**Target Repository**: APGI-cmy/maturion-foreman-governance  
**Labels**: `layer-up`, `governance-improvement`  
**Priority**: MEDIUM  
**Origin Reference**: APGI-cmy/maturion-isms#707  
**Candidate ID**: 6.6 (from `.agent-admin/layer-up/LAYER_UP_CANDIDATES.md`)  
**FAIL-ONLY-ONCE Ref**: S-008, GOV-BREACH-AIMC-W5-002

---

## Issue Body

---

## Trigger

**Governance Enhancement Validated** (LAYER_UP_PROTOCOL.md Section 5.7)  
GOV-BREACH-AIMC-W5-002 (Preflight Skipped) proved that a Foreman can begin implementation without reading the agent file; no machine enforcement exists.

## Evidence

- **Incident**: GOV-BREACH-AIMC-W5-002 — Foreman began writing production implementation code as the very first action of the session, without reading the agent file or executing Phase 1 PREFLIGHT
- **Root cause**: No machine enforcement exists that requires Phase 1 PREFLIGHT before any action
- **Current state**: S-008 is OPEN in ISMS-local FAIL-ONLY-ONCE v1.8.0
- **Dependency chain**: Session memory is only written in Phase 4 → which requires Phase 1 completion

## Current Governance State

The only enforcement for Phase 1 PREFLIGHT is A-011 and A-012 (agent-discipline rules). No CI gate verifies that a session memory file was created, which is the only observable evidence that Phase 1 was executed.

## Observed Gap/Conflict/Failure

GOV-BREACH-AIMC-W5-002 proved that without CI enforcement, a Foreman agent can complete an entire wave without ever executing Phase 1. The session memory timestamp provides an indirect but reliable signal: session memory is only written at Phase 4 (which requires successful Phase 1 completion).

## Proposed Governance Improvement

Add canonical CI gate requirement:
1. CI check that verifies the PR diff includes a session memory file (`.agent-workspace/foreman-v2/memory/session-*.md`) with a creation/modification timestamp matching the PR branch creation date (±24 hours)
2. Gate failure message: "This PR is missing a current-session Foreman session memory file. Phase 1 PREFLIGHT must be completed (producing session memory at Phase 4) before any implementation work. See A-011 (FAIL-ONLY-ONCE v1.8.0)."
3. Document in `CANONICAL_CI_GATE_REQUIREMENTS.md` as a structural PREFLIGHT enforcement gate

**Breaking change**: NO — adds CI verification for existing mandatory Phase 1 requirement.

## Impact Assessment

- **Scope**: All consumer repositories deploying Foreman v2 agent
- **Urgency**: MEDIUM — preflight skip is a recurring root cause; machine detection is needed
- **Ripple required**: YES — CI gate needed in all consumer repos with Foreman
- **Conflict signal**: NONE — enforces existing Phase 1 requirement

---

Reference: APGI-cmy/maturion-isms#707
