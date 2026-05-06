# Wave Current Tasks — pit-stage1-app-description-hardening

**Wave**: pit-stage1-app-description-hardening  
**Issue**: maturion-isms#1537 — Harden PIT Stage 1 App Description using MMM delivery lessons  
**Branch**: copilot/update-app-description-with-mmm-lessons  
**Date**: 2026-05-06  
**Agent**: foreman-v2-agent  
**IAA Pre-Brief**: `.agent-admin/assurance/iaa-wave-record-pit-stage1-app-description-hardening-20260506.md`  
**Category**: PRE_BUILD_STAGE_MODEL  

---

## Wave Purpose

Replace the wrong-identity PIT "Penetration Intelligence Tool" retrofit stub with the corrected Stage 1 App Description for "Project Implementation Tracker". Harvest MMM delivery lessons and promote them as pre-build hardening controls in PIT. Update the BUILD_PROGRESS_TRACKER.md and file all required governance artifacts.

## Active Tasks

| # | Task | Status | Artifact Path |
|---|------|--------|---------------|
| T-1 | Replace app-description.md with corrected Stage 1 (Project Implementation Tracker + MMM lessons) | IN_PROGRESS | `modules/pit/00-app-description/app-description.md` |
| T-2 | Create governance mirror/pointer | PENDING | `docs/governance/PIT_APP_DESCRIPTION.md` |
| T-3 | File App Description creation checklist | PENDING | `.agent-admin/evidence/app-description-checklist/pit-20260506.md` |
| T-4 | Update BUILD_PROGRESS_TRACKER.md | PENDING | `modules/pit/BUILD_PROGRESS_TRACKER.md` |
| T-5 | Create MMM lessons improvement register | PENDING | `modules/pit/_readiness/pit-build-process-improvement-register.md` |
| T-6 | Update module.manifest.json (BLOCKER-1 resolution) | PENDING | `modules/pit/module.manifest.json` |
| T-7 | Delete undeclared draft files (BLOCKER-2 resolution) | PENDING | `modules/pit/00-app-description/pit_app_description_stage1.md`, `pit_app_description_stage1_rewritten_v1.md` |

---

## IAA Blockers Being Resolved

| Blocker | Resolution |
|---------|-----------|
| BLOCKER-1: module.manifest.json identity gap | Option (a): update manifest to include full name |
| BLOCKER-2: undeclared files in 00-app-description/ | Option (a): delete both draft files after content extracted to app-description.md |

---

## Phase Status

- Phase 1 (Preflight): COMPLETE  
- Phase 2 (Alignment): COMPLETE  
- Phase 3 (Work): IN_PROGRESS  
- Phase 4 (Handover): PENDING  

---

# Archive: Previous Wave — wave-mps-source-verification

**Wave**: wave-mps-source-verification

**Foreman**: foreman-v2-agent v6.2.0
**Wave**: wave-mps-source-verification
**Session ID**: session-mps-source-verification-20260428
**Date**: 2026-04-28
**Branch**: copilot/verify-generic-mps-source-documents
**CS2 Authorization**: CONFIRMED — issue opened by CS2 (@APGI-cmy) and assigned to foreman-v2-agent; branch initialized as copilot/verify-generic-mps-source-documents
iaa_wave_record_path: .agent-admin/assurance/iaa-wave-record-wave-mps-source-verification-20260428.md
iaa_prebrief_status: COMPLETE — PRE-BRIEF committed SHA caa8bc9; Track A = EXEMPT; Track B = AAWP_MAT (conditional on Track A gate)
ceremony_admin_appointed: NO (Track A only — EXEMPT)

## Wave Purpose

CS2 clarification directive: Before accepting a static replacement question bank in PR #1500,
verify whether the 25 generic MPS Word source documents are already present and approved in
the current AIMC/KUC/ai_knowledge store. If absent, record as migration gap and request
re-upload. Only proceed to Track B (structured JSON model + question bank derivation) once
CS2 confirms source document status.

## Wave Design — Conditional Track Structure

```
TRACK A (mandatory first) → CS2 DB Verification Gate → TRACK B (conditional)
```

- **Track A**: Research/verify KUC schema and code evidence; record findings; provide
  DB queries for CS2; block PR #1500 static question bank pending CS2 decision.
- **Track B**: Only if CS2 confirms documents PRESENT. Implement Domain→MPS→Criteria JSON
  model; derive question bank; add tests proving all 25 MPSs covered.

## Current Wave Tasks

| # | Task | Agent | Status | Notes |
|---|------|-------|--------|-------|
| 1 | Phase 1 Preflight | foreman-v2-agent | 🟢 DONE | Identity, Tier 2, CANON_INVENTORY PASS, sessions, FAIL-ONLY-ONCE v4.6.0 |
| 2 | IAA Pre-Brief (Phase 1 Step 1.8) | independent-assurance-agent | 🟢 DONE | SHA caa8bc9; Track A=EXEMPT; Track B=AAWP_MAT |
| 3 | wave-current-tasks.md | foreman-v2-agent | 🟢 DONE | This file |
| 4 | Track A: KUC schema/code investigation | foreman-v2-agent (research) | 🟢 DONE | AIMC/ai_knowledge schema: MPS columns present; NO seed migration found |
| 5 | Track A: Migration gap analysis committed | foreman-v2-agent | 🟢 DONE | .agent-workspace/foreman-v2/personal/mps-migration-gap-analysis-20260428.md |
| 6 | Track A: Scope declaration | foreman-v2-agent | 🟢 DONE | scope-declaration-wave-mps-source-verification-20260428.md |
| 7 | Track A: SCOPE_DECLARATION.md update | foreman-v2-agent | 🟢 DONE | Cleared per A-029; wave-scoped |
| 8 | Track A: Session memory (Track A) | foreman-v2-agent | 🟢 DONE | session-mps-source-verification-20260428.md |
| B-1 | (BLOCKED) Structured Domain→MPS→Criteria JSON model | mat-specialist + api-builder | ❌ BLOCKED | Pending CS2 re-upload of 25 MPS Word docs (gap confirmed LIKELY_ABSENT) |
| B-2 | (BLOCKED) Free-assessment question bank derivation | ui-builder | ❌ BLOCKED | Pending B-1 |
| B-3 | (BLOCKED) QA tests proving all 25 MPSs covered | qa-builder | ❌ BLOCKED | Pending B-1/B-2 |

**Status key**: 🔴 PENDING | 🟡 IN PROGRESS | 🟢 DONE (IAA ASSURANCE-TOKEN received) | ❌ BLOCKED

## CS2 Decision Gate (Track A → Track B)

CS2 must perform before Track B delegation:

1. ~~Query live Supabase `ai_knowledge` table — SQL provided in migration gap analysis.~~ ✅ DONE
2. ~~Confirm whether MPS 1–25 generic Word documents were migrated from legacy KUC.~~ ✅ DONE — **LIKELY_ABSENT** (all counts = 0)
3. ABSENT confirmed — initiate re-upload of 25 Word documents via MMM framework upload pipeline (mmm-framework-sources bucket).
4. After re-upload and parse pipeline completes, approve Track B delegation.

**PR #1500 (static question bank)**: Approved interim implementation under maturion-isms#1499
(CS2 caveat: must NOT close maturion-isms#1501). #1501 remains open. Track B remains blocked
pending CS2 re-upload of 25 generic MPS Word documents (DB verification confirmed LIKELY_ABSENT).

## IAA Tokens Received This Wave

| PR # | Token | Date |
|------|-------|------|
| Track A | EXEMPT (no implementation/application changes) | 2026-04-28 |

## Wave Completion Gate

- [x] Phase 1 Preflight complete
- [x] IAA Pre-Brief complete — SHA caa8bc9
- [x] wave-current-tasks.md committed
- [x] Track A: KUC investigation complete
- [x] Track A: Migration gap analysis committed
- [x] Track A: Session memory written
- [x] CS2: DB verification of ai_knowledge table — **COMPLETE** (LIKELY_ABSENT; migration gap confirmed 2026-04-28)
- [ ] CS2: Re-upload of 25 generic MPS Word documents via MMM framework upload pipeline
- [ ] CS2: Track B approval (after re-upload and parse pipeline complete)
- [ ] Track B: Delegation to builders (BLOCKED pending CS2 gate)
- [ ] Track B: PREHANDOVER + IAA Final Audit (AAWP_MAT — mandatory)
- [ ] CS2 notified for merge approval

