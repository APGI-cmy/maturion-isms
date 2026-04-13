# IAA Pre-Brief — Wave aimc-wave-status

**Artifact Type**: IAA Pre-Brief (Phase 0 — PRE-BRIEF mode)
**Wave**: aimc-wave-status
**Wave Description**: Outstanding AIMC/LKIAC Wave Status Confirmation & MMM/MAT/Roadmap Sequencing Risk Analysis
**Branch**: copilot/confirm-outstanding-aimc-lkiac-waves
**Issue**: #1209 — [Wave Status & Dependency Check] Confirm outstanding AIMC/LKIAC waves, resolve MMM/MAT/Roadmap sequencing risk
**Date**: 2026-04-04
**IAA Version**: independent-assurance-agent v6.2.0 / contract 2.3.0
**Adoption Phase**: PHASE_B_BLOCKING — Hard gate ACTIVE
**Authority**: CS2 only (@APGI-cmy)

---

## 1. Wave Scope Confirmation

**Declared scope (per issue #1209):**

This is a governance analysis and planning wave. No production code, schemas, migrations, CI
workflows, or agent contracts are modified.

| Artefact | Change |
|----------|--------|
| `.agent-workspace/foreman-v2/personal/wave-current-tasks.md` | Update active wave to aimc-wave-status |
| `.agent-workspace/foreman-v2/personal/AIMC_LKIAC_WAVE_STATUS_MATRIX_20260403.md` | New — complete AIMC/LKIAC wave status matrix |
| `.agent-workspace/foreman-v2/memory/session-aimc-wave-status-20260403.md` | New — session memory |
| `.agent-workspace/foreman-v2/memory/PREHANDOVER-session-aimc-wave-status-20260403.md` | New — PREHANDOVER proof |
| `.agent-admin/assurance/iaa-token-session-aimc-wave-status-20260403.md` | New — IAA ASSURANCE-TOKEN |

---

## 2. Trigger Category Classification

**Classification decision flow (per `iaa-trigger-table.md` v2.1.0):**

| Step | Check | Result |
|------|-------|--------|
| 1 | Any `.github/agents/` or `governance/agents/` changes? | NO |
| 2 | Any `governance/canon/` or `CANON_INVENTORY.json` changes? | NO |
| 3 | Any `.github/workflows/` changes? | NO |
| 4 | AAWP/MAT deliverable artifacts? | NO — planning/analysis documents in `.agent-workspace/` |
| 5 | Any `governance/quality/agent-integrity/` changes? | NO |
| 6 | Any `.agent-workspace/*/knowledge/` changes? | NO |
| 7 | Clearly and unambiguously doc-only outside governance/canon? | YES — `.agent-workspace/` personal and memory files |

**Classification: AMBIGUOUS → IAA MANDATORY (FAIL-ONLY-ONCE A-003)**

**Rationale**: The wave status matrix and sequencing risk analysis constitute foreman-level planning
output that informs future wave execution sequencing and agent commissioning. This class of document
has been treated as IAA-mandatory in prior foreman sessions (e.g., session-cep-v1.8.0-programme-clearance-20260403). AMBIGUITY RULE applies: ambiguity resolves to mandatory invocation.

**IAA trigger category (resolved)**: **AMBIGUOUS → MANDATORY** (governance planning output).

---

## 3. Qualifying Tasks

| Task ID | Summary | IAA Trigger Category | Required Phases |
|---------|---------|----------------------|-----------------|
| AIMC-STATUS-001 | Produce complete AIMC/LKIAC wave status matrix (17 waves, CL-0 through CL-15 incl. CL-3.5) with COMPLETE/IN PROGRESS/PENDING UNBLOCKED/PENDING BLOCKED classification | AMBIGUOUS → MANDATORY | P0 (pre-brief), P2–P4 |
| AIMC-STATUS-002 | Document MMM/MAT/Roadmap sequencing risks with CRITICAL/HIGH/MEDIUM ratings | AMBIGUOUS → MANDATORY | P0, P2–P4 |
| AIMC-STATUS-003 | Produce top actionable recommendations for CS2 with required next steps | AMBIGUOUS → MANDATORY | P0, P2–P4 |

---

## 4. FFA Checks IAA Will Run at Handover

### Universal Ceremony Gate

| Check | Requirement |
|-------|-------------|
| CERT-001 | PREHANDOVER proof file present on branch |
| CERT-002 | Session memory file present on branch |
| CERT-003 | FAIL-ONLY-ONCE attestation declared in session memory |
| CERT-004 | `iaa_audit_token` field present in PREHANDOVER proof |

### Core Invariants

| Check | What IAA Verifies |
|-------|------------------|
| CORE-007 | No STUB/TODO/FIXME/TBD/placeholder content in delivered documents |
| CORE-013 | PREHANDOVER proof or IAA token reference present in PR artifacts |
| CORE-015 | Session memory present in PR bundle |
| CORE-016 | Dedicated IAA token file exists |
| CORE-018 | Complete evidence artifact sweep — all ceremony artifacts present |
| CORE-020 | Zero partial pass rule — all checks verifiable |

### Planning FFA Checks (PLAN-FFA — PRIMARY REVIEW FOCUS)

| Check ID | Check Name | Pass Condition | Priority |
|----------|-----------|----------------|----------|
| PLAN-FFA-001 | All 17 waves covered | Matrix covers CL-0 through CL-15 (incl. CL-3.5); each wave has a classification (COMPLETE / IN PROGRESS / PENDING UNBLOCKED / PENDING BLOCKED) | BLOCKING |
| PLAN-FFA-002 | Status classifications accurate | Classifications match documented status in `governance/EXECUTION/AIMC_LKIAC_COMBINED_EXECUTION_PLAN.md` §14 and wave sections | BLOCKING |
| PLAN-FFA-003 | Incomplete waves documented | Each non-COMPLETE wave lists outstanding items and responsible agents | BLOCKING |
| PLAN-FFA-004 | Sequencing risk documented | MMM, MAT, and Roadmap sequencing risks explicitly named with severity ratings | BLOCKING |
| PLAN-FFA-005 | Conflict identification | Any legacy code or artefacts conflicting with MMM migration identified and documented | BLOCKING |
| PLAN-FFA-006 | Actionable recommendations | Minimum 3 actionable sequencing recommendations for CS2 produced | BLOCKING |
| PLAN-FFA-007 | No unauthorised scope | Wave status matrix does not implement, plan, or authorise any new work beyond what CS2 has already authorised | BLOCKING |
| PLAN-FFA-008 | No placeholder content | No TBD, STUB, TODO, or placeholder sections in delivered documents | BLOCKING |

---

## 5. Required PREHANDOVER Proof Structure

```yaml
wave: aimc-wave-status
branch: copilot/confirm-outstanding-aimc-lkiac-waves
issue: "#1209 — [Wave Status & Dependency Check] Confirm outstanding AIMC/LKIAC waves"
date: 2026-04-04
session_id: session-aimc-wave-status-20260403
producing_agent: foreman-v2-agent

## Deliverables
# AIMC_LKIAC_WAVE_STATUS_MATRIX_20260403.md — status matrix for all 17 waves

## PLAN-FFA Self-Assessment
PLAN-FFA-001: PASS — 17 waves covered
PLAN-FFA-002: PASS — aligned with CEP §14 and wave sections
PLAN-FFA-003: PASS — all non-COMPLETE waves have outstanding items
PLAN-FFA-004: PASS — MMM/MAT/Roadmap risks documented
PLAN-FFA-005: PASS — conflicts identified
PLAN-FFA-006: PASS — 3 actionable recommendations
PLAN-FFA-007: PASS — no new work authorised
PLAN-FFA-008: PASS — no placeholder content
```

---

## 6. Applicable FAIL-ONLY-ONCE Rules

| Rule | Trigger Condition |
|------|------------------|
| A-003 | Ambiguity resolves to mandatory invocation — applied |
| A-021 | Working tree must be clean before IAA invocation |
| A-033 | Artifact verification must use `git ls-tree HEAD` |

---

## 7. Exit Criteria

- [ ] Wave status matrix produced and committed
- [ ] PREHANDOVER proof committed
- [ ] Session memory committed
- [ ] IAA invoked → ASSURANCE-TOKEN received
- [ ] Token written to `.agent-admin/assurance/iaa-token-session-aimc-wave-status-20260403.md`
- [ ] `wave-current-tasks.md` updated

---

## 8. Pre-Brief Status

**Pre-Brief Status**: COMMITTED
**Phase 0 complete**: YES
**Phases 1–4 status**: STANDBY — awaiting deliverable production and IAA invocation
**IAA adoption phase**: PHASE_B_BLOCKING — hard gate ACTIVE

---

*Authority: CS2 (Johan Ras / @APGI-cmy) | IAA v6.2.0 | Pre-Brief committed: 2026-04-04*
