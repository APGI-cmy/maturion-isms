# IAA Wave Record — mmm-aimc-convergence-bridge-20260417

**Wave**: mmm-aimc-convergence-bridge-20260417  
**Date**: 2026-04-17  
**Branch**: copilot/define-mmm-aimc-convergence-bridge  
**Issue**: maturion-isms#1383 — [MMM / AIMC] Define the MMM ↔ AIMC convergence bridge and CL-12c readiness contract  
**IAA Version**: 6.2.0 | Contract: 2.7.0  
**Adoption Phase**: PHASE_B_BLOCKING — Hard gate ACTIVE  
**Authority**: CS2 (Johan Ras / @APGI-cmy)

---

## PRE-BRIEF

**Invocation mode**: PRE-BRIEF (Phase 0)  
**Invoked by**: foreman-v2-agent (via Foreman comment on maturion-isms#1383)  
**Producing agent**: Not yet assigned (bridge-definition wave — mat-specialist or foreman-v2-agent expected)  
**Ceremony admin appointed**: NOT YET DECLARED (expected: true, based on prior wave pattern)

---

### Qualifying Tasks

| # | Deliverable | Path | IAA Qualifying? | Rationale |
|---|-------------|------|-----------------|-----------|
| D1 | MMM ↔ AIMC specialist dependency matrix | `modules/MMM/_readiness/mmm-aimc-specialist-dependency-matrix.md` | **YES** | Defines Stage 12 build prerequisites (AIMC specialist dependency surface). PRE_BUILD_STAGE_MODEL trigger: "any file that defines or advances a module's pre-build lifecycle stage." |
| D2 | MMM AI capability consumption contract | `modules/MMM/_readiness/mmm-ai-capability-consumption-contract.md` | **YES** | Defines AI capability contracts required before Stage 12 (Build) can proceed. PRE_BUILD_STAGE_MODEL trigger: Stage 12 build readiness contract. |
| D3 | CL-12c readiness contract | `modules/MMM/_readiness/cl-12c-readiness-contract.md` | **YES — PRIMARY** | Explicitly names Stage 12 checklist item c. This is a direct Stage 12 (Build) readiness artifact. Strongest PRE_BUILD_STAGE_MODEL trigger in this wave. |
| D4 | Harvest-map alignment note | `modules/MMM/_readiness/mmm-aimc-harvest-map-alignment-note.md` | **YES** | Aligns harvest-map for AIMC convergence — pre-build readiness alignment artifact. Relates to upstream stage traceability (harvest-map is cross-stage governance artifact at `modules/MMM/harvest-map/harvest-map.md`). |
| D5 | Forward implementation handoff note | `modules/MMM/_readiness/mmm-aimc-forward-handoff-note.md` | **YES** | Explicitly a "forward implementation handoff" — handoff TO Stage 12 (Build) / Stage 8 (Implementation Plan). PRE_BUILD_STAGE_MODEL trigger: defines Stage 12 entry conditions. |
| GOV-1 | wave-current-tasks.md update | `.agent-workspace/foreman-v2/personal/wave-current-tasks.md` | **GOVERNANCE_AUDIT** | Retrospective admin — not PRE_BUILD_STAGE_MODEL. Exempt if isolated; here it is MIXED with D1-D5. |
| GOV-2 | Scope declaration | `.agent-workspace/foreman-v2/personal/scope-declaration-wave-mmm-aimc-convergence-bridge*.md` | **GOVERNANCE_AUDIT** | Retrospective admin artifact. Part of MIXED PR. |
| GOV-3 | Session memory | `.agent-workspace/*/memory/session-*.md` | **GOVERNANCE_AUDIT** | Retrospective admin — IAA checks existence only. |
| GOV-4 | PREHANDOVER proof | `.agent-workspace/*/memory/PREHANDOVER-*.md` | **GOVERNANCE_AUDIT** | Retrospective admin — IAA checks: (a) exists, (b) git-committed (A-033), (c) iaa_audit_token format correct (A-029). |
| GOV-5 | BUILD_PROGRESS_TRACKER.md update | `modules/MMM/BUILD_PROGRESS_TRACKER.md` | **YES** | If updated, triggers PRE_BUILD_STAGE_MODEL (named explicitly in trigger table). Must not misrepresent CS2 approval status for Stages 5-7. |

**Qualifying task count**: 5 substantive deliverables (D1-D5) + BUILD_PROGRESS_TRACKER if updated (GOV-5). All are IAA-qualifying.

---

### Applicable Overlay

**Primary category**: MIXED  
**Triggering sub-categories**:
- PRE_BUILD_STAGE_MODEL (D1–D5, GOV-5 if BUILD_PROGRESS_TRACKER updated)
- GOVERNANCE_AUDIT (GOV-1 through GOV-4, but merged into MIXED by AMBIGUITY RULE)

**IAA triggered**: YES — MANDATORY  
**Ambiguity**: RESOLVED — MANDATORY (MIXED = all triggering artifacts activate IAA for whole PR)

**Overlay applied**: PRE_BUILD_GATES (OVL-PBG-001 through OVL-PBG-016)  
**Universal Ceremony Gate**: CERT-001 through CERT-004  

> **Scope note**: This is a bridge-definition wave (NOT an implementation wave). No code is produced. PRE_BUILD_GATES overlay applies, but the BUILD_DELIVERABLE overlay (BD-000 through BD-024) does NOT apply — there is no implementation diff to trace. IAA will apply PRE_BUILD_GATES checks scoped to: (a) stage gating integrity, (b) internal artifact consistency, (c) no false stage-advancement claims, (d) correct scoping of CL-12c.

---

### Stage-Readiness View (per OVL-INJ-ADM-003)

Upstream stages reviewed against `modules/MMM/BUILD_PROGRESS_TRACKER.md` (last updated 2026-04-15).

| Stage | Name | Status (per tracker) | CS2 Approved? | IAA Token Issued? |
|-------|------|----------------------|---------------|-------------------|
| 1 | App Description | COMPLETE ✅ | YES — #1298 (2026-04-08) | — (pre-IAA gate) |
| 2 | UX Workflow & Wiring Spec | COMPLETE ✅ | YES — #1352 (2026-04-14) | — |
| 3 | FRS | COMPLETE ✅ | YES — #1366 (2026-04-14) | — |
| 4 | TRS | COMPLETE ✅ | YES — #1378 (carried forward) | IAA-session-mmm-stage4-trs-20260414-PASS |
| 5 | Architecture | COMPLETE ✅ artifacts produced | PENDING CS2 formal merge | IAA-session-212-mmm-stage5-architecture-20260414-PASS |
| 6 | QA-to-Red | COMPLETE ✅ artifacts produced | PENDING CS2 formal merge | IAA-session-mmm-stage6-qa-to-red-20260415-PASS |
| 7 | PBFAG | COMPLETE ✅ artifacts produced | PENDING CS2 formal merge | IAA-session-mmm-stage7-pbfag-20260415-PASS |
| 8 | Implementation Plan | NOT_STARTED | — | — |
| 9 | Builder Checklist | NOT_STARTED | — | — |
| 10 | IAA Pre-Brief | NOT_STARTED | — | — |
| 11 | Builder Appointment | NOT_STARTED | — | — |
| 12 | Build Execution | NOT_STARTED | — | — |

**Blockers preventing Stage 11 (Builder Appointment)**:
1. Stages 5–7: IAA tokens issued, awaiting CS2 formal merge approval — these PRs must be merged before Stage 8 proceeds per tracker
2. Stage 8 (Implementation Plan): NOT_STARTED — must precede Stage 9
3. Stage 9 (Builder Checklist): NOT_STARTED — must precede Stage 10
4. Stage 10 (IAA Pre-Brief): NOT_STARTED — must precede Stage 11

**This wave's positioning**: Bridge-definition artifacts D1–D5 are PRE-Stage-8 readiness inputs. They define the AIMC integration contract that the Stage 8 Implementation Plan will reference. This wave does NOT advance any of Stages 8–12 — it prepares inputs for them. No OVL-PBG-008 stage-gating violation.

---

### Anti-Regression Obligations

**Functional Behaviour Registry (NBR) checks**: NO — this is a documentation-only wave. No TanStack Query mutations (NBR-001) or Supabase RLS write paths (NBR-002) are introduced. FBR checks are NOT applicable.

**FAIL-ONLY-ONCE rules applicable to this wave**:

| Rule | Description | Application |
|------|-------------|-------------|
| A-001 | IAA invocation evidence in PR artifacts | PREHANDOVER proof must reference IAA audit token for this wave |
| A-003 | Ambiguity → mandatory invocation | Applied to classify MIXED → IAA mandatory |
| A-015 | Non-EXEMPT PRs require full PREHANDOVER ceremony | Full ceremony required (PREHANDOVER proof + session memory + IAA audit) |
| A-029 | PREHANDOVER proof `iaa_audit_token` = expected reference format | Expected token: `IAA-session-mmm-aimc-convergence-bridge-20260417-PASS`. NOT `PENDING`. |
| A-029b | No carry-forward leftovers block token | Producing agent must confirm no unresolved leftovers from prior waves |
| A-031 | IAA ceremony artifact A-026 carve-out | If scope declaration references IAA's own prior session files, explicit A-031 carve-out note required |
| A-033 | PREHANDOVER proof must be git-committed | Verify via `git ls-tree HEAD` — disk existence is insufficient (CORE-018) |
| A-034 | FUNCTIONAL-BEHAVIOUR-REGISTRY reading for BUILD/AAWP_MAT | NOT applicable (doc-only wave — no code diff) |
| A-035 | Niggle pattern library application | NOT applicable (no code diff) |

---

### Required PREHANDOVER Structure

At handover, the PREHANDOVER proof submitted to IAA MUST contain:

```
wave: mmm-aimc-convergence-bridge-20260417
branch: copilot/define-mmm-aimc-convergence-bridge
issue: maturion-isms#1383
produced_by: [agent name]
deliverables:
  - D1: modules/MMM/_readiness/mmm-aimc-specialist-dependency-matrix.md [SHA required]
  - D2: modules/MMM/_readiness/mmm-ai-capability-consumption-contract.md [SHA required]
  - D3: modules/MMM/_readiness/cl-12c-readiness-contract.md [SHA required]
  - D4: modules/MMM/_readiness/mmm-aimc-harvest-map-alignment-note.md [SHA required]
  - D5: modules/MMM/_readiness/mmm-aimc-forward-handoff-note.md [SHA required]
  - GOV: BUILD_PROGRESS_TRACKER.md (if updated) [SHA required]
iaa_audit_token: IAA-session-mmm-aimc-convergence-bridge-20260417-PASS
upstream_dependencies_confirmed:
  - issue_1382: CLOSED (AIMC specialist hardening — iaa-wave-record-aimc-specialist-hardening-20260415-20260415.md)
  - issue_1383: OPEN (CS2-authorized by @APGI-cmy)
fail_only_once_attested: true
a031_carve_out: [YES/NO — if YES, note IAA ceremony artifacts excluded from scope declaration per A-031]
```

> **A-029 enforcement**: `iaa_audit_token: PENDING` is the OLD pattern. Expected reference must be pre-populated as above.

---

### Scope Blockers

| Blocker | Type | Description | Impact |
|---------|------|-------------|--------|
| SB-001 | AWARENESS (not blocking) | Stages 5–7 pending CS2 formal merge | BUILD_PROGRESS_TRACKER update must not represent pending PRs as CS2-approved. Tracker must accurately reflect "pending CS2 formal merge" status. |
| SB-002 | SCOPE BOUNDARY | CL-12c readiness contract must NOT claim to satisfy Stage 9 (Builder Checklist) or Stage 10 (IAA Pre-Brief) | These stages must be completed separately. D3 is a readiness *definition* artifact, not a stage gate completion artifact. |
| SB-003 | SCOPE BOUNDARY | D1–D5 are bridge-definition artifacts only | No implementation code, no schema changes, no API endpoints. Producing agent must not include implementation artifacts. |
| SB-004 | AWARENESS (not blocking) | Stage 8 (Implementation Plan) NOT_STARTED | This wave provides inputs to Stage 8. Formal stage authorization requires CS2 merge of Stages 5–7 first. |

---

### Evidence Requirements at Handover

IAA will verify the following at full assurance (Phase 3):

1. **D1–D5 exist and are git-committed**: `git ls-tree HEAD modules/MMM/_readiness/` must show all 5 files (A-033)
2. **Internal consistency**: Each of D1–D5 is internally consistent and does not contradict existing stage artifacts (FRS, TRS, Architecture, QA-to-Red, PBFAG)
3. **No false stage-advancement claims**: None of D1–D5 may claim that Stages 8–12 have been started or completed
4. **CL-12c scope correct**: `cl-12c-readiness-contract.md` must be clearly scoped as a readiness *definition* for Stage 12, not a Stage 9/10 gate completion
5. **Harvest-map alignment correct**: D4 must align with `modules/MMM/harvest-map/harvest-map.md` (existing artifact)
6. **BUILD_PROGRESS_TRACKER accurate**: If updated, must reflect CS2 approval status correctly (Stages 5–7 = IAA token issued, pending CS2 formal merge — NOT "CS2-approved")
7. **Upstream dependency confirmation**: AIMC specialist hardening strategy (issue #1382, `Maturion/strategy/Maturion_agent_usage_escalation_strategy.md` v2.0.0) referenced correctly in D1/D2 where applicable
8. **PREHANDOVER proof**: Exists, git-committed, `iaa_audit_token` = expected reference format (not PENDING)
9. **Session memory**: Exists, `fail_only_once_attested: true` declared

---

## TOKEN

*(To be appended by IAA after full assurance at handover — Phase 4 Step 4.2b)*

---

## REJECTION_HISTORY

*(Empty — no prior rejections for this wave)*

---

**Wave record created**: 2026-04-17  
**Created by**: independent-assurance-agent (PRE-BRIEF mode, Phase 0)  
**Next action**: Foreman invokes producing agent. Full IAA assurance (Phases 2–4) at handover.
