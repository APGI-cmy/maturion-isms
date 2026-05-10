# IAA Wave Record — layer-down-2026-05-08-481a57b1

**Agent**: independent-assurance-agent  
**Wave**: layer-down-2026-05-08-481a57b1  
**Issue**: #1587 — [Layer-Down] Propagate Governance Changes - 2026-05-08 (481a57b1)  
**Branch**: `copilot/layer-down-propagate-governance-changes-f67f5da7-5091-4c9b-97bf-41d34bda41fd`  
**Date**: 2026-05-10  
**Adoption Phase**: PHASE_B_BLOCKING

---

## PRE-BRIEF

Qualifying tasks: [F-01 add ECAP/PREHANDOVER evidence bundle for PR #1591 head; F-02 resolve RCA Tier2 path mismatch vs Tier1 contract (`.github/agents/root-cause-corrective-action-agent.md` ↔ `.agent-workspace/root-cause-corrective-action-agent/knowledge/**`); F-03 add CodexAdvisor proof artifact reference and cross-artifact linkage]
Applicable overlay: [MIXED — AGENT_CONTRACT + CANON_GOVERNANCE + KNOWLEDGE_GOVERNANCE]
Anti-regression obligations: [no — FUNCTIONAL-BEHAVIOUR-REGISTRY applies to BUILD/AAWP_MAT behavioural code paths, not this governance layer-down propagation]

### Trigger categories (declared)
- Primary: `MIXED`
- Escalation rule: AGENT_CONTRACT changes require full assurance path with ECAP evidence.

### FFA checks (declared)
- A-003 ambiguity rule: if unclear classification emerges, force mandatory IAA path
- A-004 bootstrap-first discipline: PASS
- A-005 `.github/agents/**` touched: HARD BLOCKER
- A-015 triggered governance work requires PREHANDOVER + session memory
- Functional Behaviour Registry NBR checks: N/A for this non-BUILD governance scope

### PREHANDOVER structure (required)
1. Identity / invocation context block
2. Trigger classification + protected-path declaration
3. Evidence exactness (file paths, counts, hashes, versions)
4. Canon commit mapping table (`481a57b1…`)
5. Overlay compliance checklist (CANON_GOVERNANCE)
6. Cross-artifact coherence (wave/issue/branch/session/token identifiers)
7. Session memory artifact
8. `iaa_audit_token` reference coherent with active bundle
9. CodexAdvisor proof reference for Tier 1 contract routing
10. Explicit phase declaration (Phase A only / Phase B) and hard-gate statement

### Follow-up status

- ceremony_admin_appointed: execution-ceremony-admin-agent
- codexadvisor_proof_ref: `.agent-admin/assurance/codexadvisor-proof-pr-1591.md`
- ecap_proof_ref: `.agent-admin/prehandover/proof-pr-1591-rca-operationalization-20260510.md`
- ecap_bundle_ref: `.agent-workspace/execution-ceremony-admin-agent/bundles/PREHANDOVER-pr-1591-rca-operationalization-20260510.md`

### Scope blockers
- SB-01: IAA final token still pending in this wave record
- SB-02: Session memory and final assurance artifacts still required before handover release

---

## TOKEN

PHASE_B_BLOCKING_TOKEN: PENDING
