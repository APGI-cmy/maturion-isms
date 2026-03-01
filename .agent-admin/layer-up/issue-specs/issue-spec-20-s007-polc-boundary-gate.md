# Issue Spec: [Layer-Up] S-007 — CI POLC boundary gate (foreman production code check)

**Target Repository**: APGI-cmy/maturion-foreman-governance  
**Labels**: `layer-up`, `governance-improvement`  
**Priority**: HIGH  
**Origin Reference**: APGI-cmy/maturion-isms#707  
**Candidate ID**: 6.5 (from `.agent-admin/layer-up/LAYER_UP_CANDIDATES.md`)  
**FAIL-ONLY-ONCE Ref**: S-007, GOV-BREACH-AIMC-W5-001, GOV-BREACH-AIMC-W5-002, GOV-BREACH-AIMC-W8-001

---

## Issue Body

---

## Trigger

**Governance Enhancement Validated** (LAYER_UP_PROTOCOL.md Section 5.7) — CRITICAL recurring pattern  
POLC boundary violation (Foreman writing production code) occurred 3 times (GOV-BREACH-AIMC-W5-001, GOV-BREACH-AIMC-W5-002, GOV-BREACH-AIMC-W8-001). Agent-discipline rules alone are insufficient; machine enforcement is required.

## Evidence

- **Incident 1**: GOV-BREACH-AIMC-W5-001 — Foreman wrote Wave 5 production implementation code directly (CRITICAL, 2026-02-24)
- **Incident 2**: GOV-BREACH-AIMC-W5-002 — Foreman began implementation before reading agent file (CRITICAL, 2026-02-25)
- **Incident 3**: GOV-BREACH-AIMC-W8-001 — Foreman self-implemented complete Wave 8 deliverables (CRITICAL, 2026-02-25)
- **Pattern**: Same root cause 3 times; A-001 and A-009 rules alone cannot prevent recurrence
- **Current state**: S-007 is OPEN in ISMS-local FAIL-ONLY-ONCE v1.8.0

## Current Governance State

A-001 prohibits Foreman from writing production code. A-009 requires Verb Classification Gate. These rules depend entirely on agent discipline — there is no machine-level enforcement that catches a Foreman directly modifying production code files.

## Observed Gap/Conflict/Failure

3 CRITICAL POLC boundary violations occurred despite A-001 being locked in governance. The pattern (Foreman skips preflight → adopts wrong identity → self-implements) repeated because the only enforcement was agent-discipline-based. Machine enforcement is the only reliable prevention for this failure mode.

## Proposed Governance Improvement

Add canonical CI gate requirement (HIGH PRIORITY):
1. CI check that examines PR diff author metadata; if the PR author matches `foreman-v2-agent` (or equivalent Foreman identity), verify no production code files were modified
2. "Production code files" = any file outside designated governance evidence paths (`.agent-workspace/`, `.agent-admin/`, `governance/`, `modules/*/BUILD_PROGRESS_TRACKER.md`, `modules/*/implementation-plan.md`)
3. Gate failure message: "POLC BOUNDARY VIOLATION: foreman-v2-agent is the author of production code changes in this PR. Foreman agents may only modify governance planning artifacts. See A-001 (FAIL-ONLY-ONCE v1.8.0) and FOREMAN_AUTHORITY_AND_SUPERVISION_MODEL.md."
4. Update `FOREMAN_AUTHORITY_AND_SUPERVISION_MODEL.md` to reference the CI gate as mandatory enforcement
5. Update `CANONICAL_CI_GATE_REQUIREMENTS.md` with this gate specification

**Breaking change**: NO — enforces existing A-001 rule at CI level.

## Impact Assessment

- **Scope**: All consumer repositories deploying Foreman v2 agent
- **Urgency**: HIGH — 3 repeat violations; A-001 rule alone is insufficient
- **Ripple required**: YES — CI gate implementation needed in all consumer repos with Foreman
- **Conflict signal**: NONE — enforces existing rule, no conflict

---

Reference: APGI-cmy/maturion-isms#707
