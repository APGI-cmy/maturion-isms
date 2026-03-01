# Issue Spec: [Layer-Up] AGENT_IGNORANCE_PROHIBITION_DOCTRINE.md → canonical governance

**Target Repository**: APGI-cmy/maturion-foreman-governance  
**Labels**: `layer-up`, `governance-improvement`  
**Priority**: MEDIUM  
**Origin Reference**: APGI-cmy/maturion-isms#707  
**Candidate ID**: 3.1 (from `.agent-admin/layer-up/LAYER_UP_CANDIDATES.md`)

---

## Issue Body

---

## Trigger

**Governance Gap Discovered** (LAYER_UP_PROTOCOL.md Section 5.2)  
Constitutional doctrine marked PUBLIC_API and "All Repositories" scope exists only in maturion-isms.

## Evidence

- **File**: `governance/agent/AGENT_IGNORANCE_PROHIBITION_DOCTRINE.md` in APGI-cmy/maturion-isms
- **Status in file**: "Constitutional - Active, Authority: Supreme, Layer-Down Status: PUBLIC_API, Applies To: All Agents, All Work, All Repositories"
- **Ratified**: Johan Ras 2026-02-11
- **Equivalent authority**: Same tier as OPOJD, STOP_AND_FIX_DOCTRINE

## Current Governance State

No equivalent doctrine exists in canonical governance. The prohibition on agents acting in ignorance of applicable governance rules is not enforceable across the ecosystem.

## Observed Gap/Conflict/Failure

Without this doctrine in canonical governance:
1. Agents in other consumer repos can claim ignorance of governance rules without consequence
2. No canonical mandate for agents to read their contracts before acting
3. The preflight protocol chain (which relies on this doctrine) is not constitutionally enforced

## Proposed Governance Improvement

Add `AGENT_IGNORANCE_PROHIBITION_DOCTRINE.md` to canonical governance with full constitutional authority:
1. Prohibits agents from acting in ignorance of applicable governance rules
2. Establishes "I knew / should have known" standard for governance compliance
3. Provides equivalent enforcement authority to OPOJD and STOP_AND_FIX_DOCTRINE
4. Defines what constitutes adequate governance knowledge for each agent tier

**Breaking change**: NO — constitutionalizes existing implicit expectation.

## Impact Assessment

- **Scope**: All agents in all consumer repositories (PUBLIC_API, universal scope)
- **Urgency**: MEDIUM — provides constitutional foundation for preflight enforcement
- **Ripple required**: YES — must propagate to all consumer repos
- **Conflict signal**: NONE — additive constitutional doctrine

---

Reference: APGI-cmy/maturion-isms#707
