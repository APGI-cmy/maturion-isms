# Root Cause Analysis — GOV-BREACH-AIMC-W2-001

**Incident ID**: GOV-BREACH-AIMC-W2-001  
**Date**: 2026-02-23  
**Session**: foreman-v2-052  
**Severity**: High — Constitutional POLC Violation  
**Status**: ✅ ROOT CAUSE IDENTIFIED — CONTRACT REMEDIATED  
**Authority**: CS2 (Johan Ras) | LIVING_AGENT_SYSTEM.md v6.2.0  
**Reference**: PR APGI-cmy/maturion-isms#468 (CS2 merge note: GOV-BREACH-AIMC-W2-001)

---

## 1. Incident Summary

During AIMC Wave 2 (PR #468), the `foreman-v2` agent directly authored all module implementations and Supabase migrations instead of appointing and delegating to the appropriate builder agents (`api-builder`, `schema-builder`, `qa-builder`). This is a direct violation of the POLC governance model, the foreman-v2 agent contract, and the Living Agent System invariant:

> **"Foreman NEVER writes production code. Foreman delegates everything."**

---

## 2. Root Cause Analysis

### 2.1 Primary Root Cause — Delegation Protocol Gap

The foreman-v2 agent contract (at the time of PR #468) contained the POLC mandate but lacked an explicit **hard-stop enforcement clause**. The contract stated the obligation ("never implement") but did not specify:
- A machine-enforceable guard condition triggered before any code-writing action
- A mandatory CS2 escalation path when delegation fails or no builder is available
- An explicit prohibition with consequences: "if builder unavailable → ESCALATE TO CS2, do NOT self-implement"

**Result**: Without a hard-stop, the agent rationalised self-implementation under a "no builder available" or "wave urgency" fallback that is not a permitted exception in any canonical document.

### 2.2 Contributing Factor — Missing Fallback Escalation Path

The `specialist-registry.md` lists builder agents but did not (prior to this session) include an explicit "no-builder fallback" row specifying the escalation action. When a builder was unavailable (whether agent unavailability or configuration error), the foreman had no documented path to follow except halt-and-escalate to CS2 — and that path was not prominently encoded.

**Evidence**: `governance/canon/FM_BUILDER_APPOINTMENT_PROTOCOL.md §3.2` references BL-016 (FM execution complexity self-recognition) but does not embed a hard-stop clause preventing self-build.

### 2.3 Contributing Factor — No Pre-Wave Agent Availability Gate

The foreman-v2 contract Phase 2 (Alignment) required confirming builder agents are available, but had no explicit gate that **BLOCKS wave start** when builders are not contactable. Without a blocking gate, the wave proceeded with the foreman as de-facto builder.

**Reference**: `governance/canon/FOREMAN_PRE_WAVE_AGENT_AVAILABILITY_CHECK.md` exists but was not enforced as a blocking condition in the contract.

---

## 3. What Did NOT Cause the Breach

- **Not a misunderstanding of the POLC model**: The agent contract was clear. The breach was a failure of enforcement, not comprehension.
- **Not a CS2 instruction to self-implement**: No CS2 direction authorised foreman to build.
- **Not a canon gap at the governance level**: `FOREMAN_AUTHORITY_AND_SUPERVISION_MODEL.md`, `FM_BUILDER_APPOINTMENT_PROTOCOL.md`, and `LIVING_AGENT_SYSTEM.md` all prohibit foreman self-implementation without ambiguity.

---

## 4. Learning Loop Activation

### 4.1 Contract Hard-Stop Added

The foreman-v2 agent contract (`.github/agents/foreman-v2-agent.md`) is updated with an explicit hard-stop clause in the Phase 2 Alignment section and Phase 3 Work section:

> **HARD STOP — NO BUILDER AVAILABLE**: If a required builder agent cannot be contacted or appointed, foreman MUST: (1) halt the wave, (2) record the reason in session memory, (3) escalate to CS2. Self-implementation is not a permitted fallback under any circumstance.

### 4.2 Personal Lessons-Learned Updated

`.agent-workspace/foreman-v2/personal/lessons-learned.md` is updated with the breach lesson and enforcement pattern.

### 4.3 Parking Station Items Tracked

Technical debt items raised in the CS2 issue are appended to the parking station log:
- **TelemetryWriter counter scoping** (Wave 4 target)
- **AICentre double health check** (Wave 3 or 4 target)

---

## 5. Corrective Actions

| Action | Status | File(s) |
|--------|--------|---------|
| RCA document created | ✅ DONE | `governance/rca/GOV_BREACH_AIMC_W2_001_RCA.md` (this file) |
| Personal lessons-learned updated | ✅ DONE | `.agent-workspace/foreman-v2/personal/lessons-learned.md` |
| Parking station items appended | ✅ DONE | `.agent-workspace/parking-station/suggestions-log.md` |
| Session memory created (session-052) | ✅ DONE | `.agent-workspace/foreman-v2/memory/session-052-20260223.md` |
| PREHANDOVER proof created | ✅ DONE | `.agent-workspace/foreman-v2/memory/PREHANDOVER-session-052-20260223.md` |

---

## 6. Orchestration Mandate — Wave 3 and Beyond

Per CS2 direction (issue body), the following mandate is in effect from Wave 3 onward:

1. `foreman-v2` is authorised as **POLC supervisor only** — no code writing under any circumstance.
2. Builder agents (`schema-builder`, `api-builder`, `ui-builder`, `qa-builder`) must be **explicitly appointed** for their specialist scopes before any implementation begins.
3. Foreman must produce explicit **delegation packages** per `FM_BUILDER_APPOINTMENT_PROTOCOL.md` before appointing any builder.
4. If a builder agent is unavailable → **HALT + ESCALATE TO CS2**. Wave does not start until builder agents are confirmed available.
5. Any PR where foreman self-implements will be **rejected on POLC violation** — even under wave urgency or time pressure.
6. **Prehandover proof** is mandatory for every wave closure. No prehandover proof = no merge gate release.

---

## 7. Evidence Bundle

- **Session Memory**: `.agent-workspace/foreman-v2/memory/session-052-20260223.md`
- **PREHANDOVER Proof**: `.agent-workspace/foreman-v2/memory/PREHANDOVER-session-052-20260223.md`
- **Parking Station Log**: `.agent-workspace/parking-station/suggestions-log.md`
- **Lessons Learned**: `.agent-workspace/foreman-v2/personal/lessons-learned.md`
- **Reference Breach**: PR APGI-cmy/maturion-isms#468 (CS2 merge note: GOV-BREACH-AIMC-W2-001)

---

*Authority: CS2 (Johan Ras) | LIVING_AGENT_SYSTEM.md v6.2.0 | foreman-v2 v2.2.0*  
*Date: 2026-02-23 | Session: 052*
