# Wave Current Tasks — mmm-ui-evidence-pack-hardening-20260430

**Foreman**: foreman-v2-agent v6.2.0
**Wave**: mmm-ui-evidence-pack-hardening-20260430
**Session ID**: session-mmm-ui-evidence-pack-hardening-20260430
**Date**: 2026-04-30
**Branch**: copilot/require-live-ui-evidence-pack
**Issue**: maturion-isms#1523
**CS2 Authorization**: CONFIRMED — issue opened by CS2 (@APGI-cmy) directly and assigned to Copilot
iaa_wave_record_path: .agent-admin/assurance/iaa-wave-record-mmm-ui-evidence-pack-hardening-20260430.md
iaa_prebrief_status: COMPLETE — SHA b30d90f — 8 qualifying tasks, MIXED classification (CANON_GOVERNANCE primary + CI_WORKFLOW + AAWP_MAT + PRE_BUILD_STAGE_MODEL + KNOWLEDGE_GOVERNANCE); 6 scope blockers declared
ceremony_admin_appointed: YES — ECAP required per ACR-01 (CANON_GOVERNANCE wave)

---

## Wave Purpose

Governance hardening: define and enforce a Live UI Evidence Pack (LUIEP) gate that must be
present before any PREHANDOVER proof may claim L2-complete or L3-complete
for MMM, or before any agent may describe MMM as
handover-ready to an operational audience.

The gate codifies §12.2 OC-001–OC-009 requirements as a hard machine-enforced gate —
converting the "pending CS2 live platform validation" items into verifiable evidence slots
that must be populated before L2/L3 completion claims are accepted.

---

## Task Breakdown

| # | Task | Owner | Status | Notes |
|---|------|-------|--------|-------|
| 1 | Phase 1 PREFLIGHT | foreman-v2-agent | ✅ COMPLETE | Identity, Tier 2, Tier 1, FAIL-ONLY-ONCE, session memory |
| 2 | wave-current-tasks.md created | foreman-v2-agent | ✅ COMPLETE | This file — regenerated from template |
| 3 | scope-declaration committed | foreman-v2-agent | ✅ COMPLETE | scope-declaration-wave-mmm-ui-evidence-pack-hardening-20260430.md |
| 4 | IAA Pre-Brief — wave record artifact committed | foreman-v2-agent | ✅ COMPLETE | SHA b30d90f — 8 qualifying tasks, 6 scope blockers |
| 5 | Phase 2 Alignment checks | foreman-v2-agent | ✅ COMPLETE | Governance wave — all checks confirmed (see Phase 2 below) |
| 6 | Delegate D1–D5 to governance-liaison-isms-agent | foreman-v2-agent | 🔄 IN PROGRESS | D1 (canon), D4 (checklist), D5 (template), D6 (tracker), D7 (FAIL-ONLY-ONCE) |
| 7 | Delegate D2–D3 to qa-builder | foreman-v2-agent | 🔄 IN PROGRESS | D2 (CI script), D3 (CI workflow job) |
| 8 | D8: CANON_INVENTORY update | governance-liaison-isms-agent | ⏳ PENDING | After D1 hash available |
| 9 | QP evaluation | foreman-v2-agent | ⏳ PENDING | After all builder deliverables |
| 10 | §4.3 Merge Gate Parity Check | foreman-v2-agent | ⏳ PENDING | CI-confirmed GREEN |
| 11 | ECAP ceremony | execution-ceremony-admin-agent | ⏳ PENDING | PREHANDOVER + session memory bundle |
| 12 | IAA Final Audit | independent-assurance-agent | ⏳ PENDING | ASSURANCE-TOKEN |
| 13 | Merge gate release | foreman-v2-agent | ⏳ PENDING | CS2 review |

---

## Deliverable Index

| ID | Path | Owner | Status |
|----|------|-------|--------|
| D1 | `governance/canon/MMM_UI_EVIDENCE_PACK_GATE.md` | governance-liaison-isms-agent | ⏳ PENDING |
| D2 | `.github/scripts/validate-mmm-ui-evidence-pack.sh` | qa-builder | ⏳ PENDING |
| D3 | `.github/workflows/preflight-evidence-gate.yml` (new job) | qa-builder | ⏳ PENDING |
| D4 | `governance/checklists/mmm-ui-evidence-pack-checklist.md` | governance-liaison-isms-agent | ⏳ PENDING |
| D5 | `modules/MMM/12-phase4-ecap/mmm-ui-evidence-pack-template.md` | governance-liaison-isms-agent | ⏳ PENDING |
| D6 | `modules/MMM/BUILD_PROGRESS_TRACKER.md` (§12.3 ref) | governance-liaison-isms-agent | ⏳ PENDING |
| D7 | `.agent-workspace/foreman-v2/knowledge/FAIL-ONLY-ONCE.md` (A-043) | governance-liaison-isms-agent | ⏳ PENDING |
| D8 | `governance/CANON_INVENTORY.json` | governance-liaison-isms-agent | ⏳ PENDING |

---

## IAA Scope Blockers (from Pre-Brief — MUST observe)

| # | Blocker | Affects | Consequence |
|---|---------|---------|-------------|
| SB-001 | D7 depends on D1 | A-043 must reference D1's exact path | D7 cannot finalize before D1 committed |
| SB-002 | D8 depends on D1 | CANON_INVENTORY SHA must be computed from committed D1 | No placeholder hashes |
| SB-003 | D2 depends on D1 | Script must check ALL D1 fields | D2 cannot complete before D1 finalized |
| SB-004 | D6 depends on D1+D3 | Tracker update cannot claim gate ACTIVE until D1+D3 merged | Forward-looking language only |
| SB-005 | D1, D4 | Canon/checklist must use normative language (MUST/REQUIRED) | Advisory-only = OVL-CG-003 rejection |
| SB-006 | D3 | Existing preflight jobs must not be weakened | OVL-CI-002 applies |

---

## Phase 2 Alignment Notes

- CS2 authorization: CONFIRMED (issue opened by @APGI-cmy, assigned to Copilot)
- Governance still clean: CANON_INVENTORY PASS (203 entries, all hashes valid)
- Verb classification: "Require / Hardening" → POLC-Orchestration mode
- Pre-build stages (1–11): N/A — this is a governance hardening wave, not a module build
- Red QA suite: N/A — governance document wave; no application tests
- PBFAG, Impl Plan, Builder Checklist: N/A — governance wave
- IAA Pre-Brief artifact: committed SHA b30d90f — CLEAR TO PROCEED TO PHASE 3

---

## Wave Close Steps (post-QP)

- [ ] Section D-2 of wave-reconciliation-checklist.md executed (A-039)
- [ ] All active trackers updated to post-token state before IAA invocation
- [ ] ECAP bundle accepted (handback accepted — Step 4.1a)
- [ ] §4.3 merge gate parity: ALL GREEN (CI-confirmed)
- [ ] IAA ASSURANCE-TOKEN received and token ceremony complete (Step 4.3c)
- [ ] Merge gate released to CS2

---

**Protocol**: WAVE-CURRENT-TASKS-PROTOCOL.md v1.2.0
**Regenerated**: 2026-04-30 — complete overwrite per protocol §3 (single active wave)
