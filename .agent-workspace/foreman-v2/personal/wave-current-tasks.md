# Wave Current Tasks — align-tier1-contracts-20260506

**Wave Slug**: align-tier1-contracts-20260506  
**Branch**: copilot/align-tier-1-agent-contracts-again  
**PR**: #1533  
**Issue**: maturion-isms (Hardening — Align Tier 1 agent contracts with Tier 2 lifecycle, evidence, scope, and live-validation gates)  
**Session**: session-align-tier1-20260506  
**Date**: 2026-05-06  
**Status**: IN PROGRESS  
**CS2 Authorization**: CONFIRMED (CS2 opened issue and assigned Copilot)

---

## Wave Objective

Audit and align Tier 1 agent contracts with Tier 2 lifecycle, evidence, scope, and live-validation gates. This wave addresses drift between recently hardened Tier 2 operational knowledge / CI gates and the executable Tier 1 agent contracts.

---

## Acceptance Criteria (From Issue)

| ID | Requirement | Status |
|----|-------------|--------|
| AC1 | Foreman Tier 1 gate inventory updated — enumerate live CI gate set | PENDING |
| AC2 | IAA Tier 1 contract aligned with current IAA canon (ACR triggers, evidence-first) | PENDING |
| AC3 | Tier 2 references bound, not advisory — halting behavior if missing/stale | PENDING |
| AC4 | Per-PR scope declaration model in Tier 1 contracts | PENDING |
| AC5 | Live operational validation requirement in Tier 1 for UI/app delivery | PENDING |
| AC6 | CI is confirmatory, not diagnostic — contracts declare pre-handover evidence collection | PENDING |
| AC7 | Tests/fixtures proving the above constraints | PENDING |

---

## Task Breakdown

### T-WAT-001 — Agent File Audit and Contract Alignment (CodexAdvisor)
**Scope**: `.github/agents/foreman-v2-agent.md`, `.github/agents/independent-assurance-agent.md`, `.github/agents/execution-ceremony-admin-agent.md`
**Addresses**: AC1, AC2, AC3, AC4, AC5, AC6
**Note**: AGENT FILE GUARD TRIGGERED — delegated to CodexAdvisor per NO-AGENT-FILES-001
**Status**: PENDING — IAA Pre-Brief confirmed, delegating now

### T-WAT-002 — Governance Canon Updates
**Scope**: `governance/canon/INDEPENDENT_ASSURANCE_AGENT_CANON.md`, `governance/canon/AGENT_HANDOVER_AUTOMATION.md`, `governance/canon/EXECUTION_CEREMONY_ADMINISTRATION_PROTOCOL.md`, `governance/canon/THREE_TIER_AGENT_KNOWLEDGE_ARCHITECTURE.md`, `governance/canon/TEMPORAL_AND_EVIDENCE_INTEGRITY_CANON.md`
**Addresses**: AC2, AC3, AC6
**Status**: OUT OF SCOPE for PR #1533 — per CS2 instruction, governance canon updates are a follow-on task. Only agent contract Tier 1 changes are in scope for this PR.

### T-WAT-003 — Tests and Fixtures (qa-builder)
**Scope**: Test files proving AC1-AC6 constraints
**Addresses**: AC7
**Status**: DEFERRED — test/fixture additions require agent contract changes to land first. May be follow-on PR or included in this PR if CodexAdvisor identifies test-only changes needed.

---

## ECAP Admin Appointment (SB-001)

**Status**: REQUIRED before PREHANDOVER
**ceremony_admin_appointed**: execution-ceremony-admin-agent
**appointment_timestamp**: To be set when ECAP is formally appointed
**Note**: `requires_ecap: true` is set in `.admin/pr.json`. ECAP admin must be appointed before Phase 4. Foreman will appoint ECAP at Step 4.1a after QP PASS.

---

## Pre-Build Gate Status

| Gate | Stage | Status |
|------|-------|--------|
| Architecture frozen | Stage 5 | Issue description acts as architecture specification |
| Red QA suite | Stage 6 | AC7 defines test requirements — PENDING |
| PBFAG | Stage 7 | CS2 implicit confirmation via issue ownership |
| Implementation Plan | Stage 8 | This document acts as implementation plan |
| Builder Checklist | Stage 9 | PENDING — to be created |
| IAA Pre-Brief | Stage 10 | INVOKED — awaiting response |

---

## Agent File Guard

**TRIGGERED** — This wave touches `.github/agents/*.md` files.
Per Phase 2 Step 2.6 and NO-AGENT-FILES-001:
- Foreman CANNOT write agent files
- Delegating to CodexAdvisor-agent
- CS2 authorization: CONFIRMED (issue opened by CS2 / APGI-cmy)

---

## Foreman Notes

This wave is a governance-class hardening. The issue was opened directly by CS2 (APGI-cmy) and assigned to Copilot, satisfying Phase 2 Step 2.1 CS2 wave-start authorization.

Agent file changes require CodexAdvisor delegation per AGCFPP-001. IAA Pre-Brief is mandatory before any delegation.


---

## IAA Wave Record Reference

iaa_wave_record_path: .agent-admin/assurance/iaa-wave-record-align-tier1-contracts-20260506.md
iaa_prebrief_sha: 3a1d538f
iaa_prebrief_confirmed: true
