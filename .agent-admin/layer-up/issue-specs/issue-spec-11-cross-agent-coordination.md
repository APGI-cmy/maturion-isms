# Issue Spec: [Layer-Up] CROSS_AGENT_COORDINATION_PROTOCOL.md → canonical governance

**Target Repository**: APGI-cmy/maturion-foreman-governance  
**Labels**: `layer-up`, `governance-improvement`  
**Priority**: MEDIUM  
**Origin Reference**: APGI-cmy/maturion-isms#707  
**Candidate ID**: 3.2 (from `.agent-admin/layer-up/LAYER_UP_CANDIDATES.md`)

---

## Issue Body

---

## Trigger

**Governance Gap Discovered** (LAYER_UP_PROTOCOL.md Section 5.2)  
Constitutional protocol marked PUBLIC_API and "All Repositories" scope exists only in maturion-isms.

## Evidence

- **File**: `governance/coordination/CROSS_AGENT_COORDINATION_PROTOCOL.md` in APGI-cmy/maturion-isms
- **Status in file**: "Constitutional - Active, Authority: Supreme, Layer-Down Status: PUBLIC_API, Applies To: All Agents, All Coordination Scenarios, All Repositories"
- **Ratified**: Johan Ras 2026-02-11
- **Equivalent authority**: Same tier as OPOJD, STOP_AND_FIX_DOCTRINE

## Current Governance State

No equivalent cross-agent coordination protocol exists in canonical governance. Agents in different repos coordinate via ad-hoc methods without a canonical framework.

## Observed Gap/Conflict/Failure

Without a canonical cross-agent coordination protocol:
1. Agents in different consumer repos coordinate differently, creating inconsistent handover patterns
2. No canonical definition of when delegation is required vs. optional
3. No canonical escalation path when agents cannot coordinate
4. The builder/foreman separation model lacks canonical cross-repo enforcement

## Proposed Governance Improvement

Add `CROSS_AGENT_COORDINATION_PROTOCOL.md` to canonical governance with full constitutional authority:
1. Defines required coordination patterns (direct delegation, via Foreman, via CS2)
2. Establishes separation of duties boundaries at the coordination level
3. Defines escalation path when agents cannot reach coordination agreement
4. Provides canonical reference for all agent contracts

**Breaking change**: NO — constitutionalizes existing coordination patterns.

## Impact Assessment

- **Scope**: All agents in all consumer repositories (PUBLIC_API, universal scope)
- **Urgency**: MEDIUM — provides canonical foundation for multi-agent orchestration
- **Ripple required**: YES — must propagate to all consumer repos as agent contract reference
- **Conflict signal**: NONE — additive constitutional protocol

---

Reference: APGI-cmy/maturion-isms#707
