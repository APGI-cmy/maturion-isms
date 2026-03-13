# Wave Current Tasks — foreman-v2-agent — wave-cl2-20260313

**Wave**: CL-2 — LKIAC Wave 2: Legacy Knowledge Inventory and Domain Tagging Plan (Parallel Execution Start)
**Session**: session-wave-cl2-20260313
**Date**: 2026-03-13
**Branch**: copilot/cl-2-initiate-knowledge-inventory
**Triggering Issue**: maturion-isms — "Wave CL-2: LKIAC Wave 2 — Knowledge Inventory, Tagging Plan (Parallel Execution Start)"
**CS2 Authorization**: Issue opened by CS2 (@APGI-cmy) and assigns foreman-v2-agent; constitutes valid CS2 wave-start authorization per foreman contract §2.1
**Agent**: foreman-v2-agent v6.2.0
**Mode**: POLC-Orchestration
**IAA Pre-Brief**: `.agent-admin/assurance/iaa-prebrief-cl2-knowledge-inventory.md` — COMMITTED (SHA 4178ea9)

---

## Wave CL-2 Context

**Programme**: LKIAC  
**Type**: Audit/research — produces planning documents  
**Priority**: HIGH — critical path dependency for CL-6 through CL-15  
**Parallel With**: CL-4 (no interdependency — both start after CL-0 ✅)  
**Existing Draft Deliverables** (from 2026-03-01 session-078):
- CL-2-D1: `.agent-workspace/audit/LKIAC-W2-legacy-inventory-20260301.md` — DRAFT, awaiting CP-2
- CL-2-D2+D3: `.agent-workspace/audit/LKIAC-W2-domain-tag-map-20260301.md` — DRAFT, awaiting CP-2

**Blockers**: NONE — CL-0 cleared; CS2 wave-start issued; draft deliverables present and structurally complete.
# Wave Current Tasks — foreman-v2-agent — wave14-execution-start-20260313

**Wave**: Wave 14 — UX Workflow Gap Remediation (Execution Start, GAP-W01–GAP-W14)
**Session**: session-wave14-execution-start-20260313
**Date**: 2026-03-13
**Branch**: copilot/start-ux-workflow-gap-remediation
**Triggering Issue**: maturion-isms — "MAT Wave 14: UX Workflow Gap Remediation — Execution Start (GAP-W01–W14)"
**CS2 Authorization**: Issue opened by CS2 (@APGI-cmy) and assigns foreman-v2-agent; constitutes valid CS2 wave-start authorization per foreman contract §2.1
**Agent**: foreman-v2-agent v6.2.0
**Mode**: POLC-Orchestration
**IAA Pre-Brief**: `.agent-admin/assurance/iaa-prebrief-wave14-execution-start-20260313.md` — COMMITTED (SHA 905eb10)
**FRS Reference**: FR-089–FR-102
**TRS Reference**: TR-089–TR-102
**RED QA Spec**: `modules/mat/tests/wave14/wave14-ux-gap-red-suite-spec.md`
**Source Authority**: `modules/mat/00-app-description/MAT_UX_WORKFLOW_AND_WIRING.md` v1.0

---

## Wave 14 Task Register — Full Sub-Wave + Task Listing

### Sub-Wave Priority Sequence (GAP-W01 → GAP-W14)

Sequential per sub-wave. No sub-wave begins before RED gate is confirmed for its test(s).

| Priority | Sub-Wave | Name | Gap Ref | Builder(s) | RED Tests |
|----------|----------|------|---------|-----------|-----------|
| 1 | 14.1 | Sign-Up, Onboarding, and First-Use Flow | GAP-W01 | ui-builder + schema-builder | T-W14-UX-001 |
| 2 | 14.2 | Invite Auditor UX and Acceptance Flow | GAP-W02 | ui-builder + schema-builder + api-builder | T-W14-UX-002 |
| 3 | 14.3 | Toggle Exclude with Cascade | GAP-W03 | schema-builder + ui-builder | T-W14-UX-003 |
| 4 | 14.4 | Invite Evidence Submitter (Criteria-Scoped) | GAP-W04 | ui-builder + schema-builder | T-W14-UX-004 |
| 5 | 14.5 | Evidence Card Interaction Model | GAP-W05 | ui-builder + schema-builder | T-W14-UX-005 |
| 6 | 14.6 | Submit Button as AI Evaluation Trigger | GAP-W06 | api-builder + schema-builder + ui-builder | T-W14-UX-006 |
| 7 | 14.7 | AI Next-Level Guidance Surface | GAP-W07 | ui-builder | T-W14-UX-007 |
| 8 | 14.8 | AI Chat UI Context Injection from Criteria Card | GAP-W08 | ui-builder | T-W14-UX-008 |
| 9 | 14.9 | Audit Results Table | GAP-W09 | ui-builder + api-builder | T-W14-UX-009 |
| 10 | 14.10 | Dashboard Outstanding Work Drill-Down and Create Report Gate | GAP-W10 | ui-builder + api-builder | T-W14-UX-010 |
| 11 | 14.11 | Create Report Button as Final AI Trigger | GAP-W11 | api-builder + schema-builder + ui-builder | T-W14-UX-011 |
| 12 | 14.12 | Level Descriptor Cards | GAP-W12 | schema-builder + ui-builder | T-W14-UX-012 |
| 13 | 14.13 | Scoring and Rating Method Wired Through DB | GAP-W13 | schema-builder + api-builder | T-W14-UX-013, T-W14-UX-016 |
| 14 | 14.14 | Responsibility Cascade Rule | GAP-W14 | schema-builder + ui-builder | T-W14-UX-014 |
| 15 | ALL | RLS Cross-Org Isolation | ALL | schema-builder | T-W14-UX-015 |

### Full Task Register

| # | Task ID | Description | Builder | Status |
|---|---------|-------------|---------|--------|
| 1 | TASK-W14-001 | FRS addendum FR-089–FR-102 | foreman | ✅ DONE |
| 2 | TASK-W14-002 | TRS addendum TR-089–TR-102 | foreman | ✅ DONE |
| 3 | TASK-W14-003 | RED QA suite spec (16 tests) | foreman (spec) | ✅ DONE |
| 4 | TASK-W14-004 | Implementation plan Wave 14 gap waves | foreman | ✅ DONE |
| 5 | TASK-W14-005 | BUILD_PROGRESS_TRACKER.md governance failure heading + 14 gap entries | foreman | ✅ DONE |
| 6 | TASK-W14-006 | RED test files T-W14-UX-001 to T-W14-UX-016 (RED gate confirmation) | qa-builder | 🔴 IN PROGRESS |
| 7 | TASK-W14-007 | Subwave 14.1 schema migrations + UI (onboarding guard) | schema-builder + ui-builder | 🔴 PENDING |
| 8 | TASK-W14-008 | Subwave 14.2 schema + Edge Function + UI (invite auditor) | schema-builder + api-builder + ui-builder | 🔴 PENDING |
| 9 | TASK-W14-009 | Subwave 14.3 schema cascade trigger + UI (toggle exclude) | schema-builder + ui-builder | 🔴 PENDING |
| 10 | TASK-W14-010 | Subwave 14.4 schema + UI (invite evidence submitter) | schema-builder + ui-builder | 🔴 PENDING |
| 11 | TASK-W14-011 | Subwave 14.5 UI (evidence card, MediaRecorder, tiles) | ui-builder + schema-builder | 🔴 PENDING |
| 12 | TASK-W14-012 | Subwave 14.6 schema + API + UI (AI evaluation trigger) | schema-builder + api-builder + ui-builder | 🔴 PENDING |
| 13 | TASK-W14-013 | Subwave 14.7 UI (next-level guidance surface) | ui-builder | 🔴 PENDING |
| 14 | TASK-W14-014 | Subwave 14.8 UI (AI chat context injection) | ui-builder | 🔴 PENDING |
| 15 | TASK-W14-015 | Subwave 14.9 UI + API (audit results table) | ui-builder + api-builder | 🔴 PENDING |
| 16 | TASK-W14-016 | Subwave 14.10 UI + API (dashboard + create report gate) | ui-builder + api-builder | 🔴 PENDING |
| 17 | TASK-W14-017 | Subwave 14.11 API + schema + UI (create report + PDF) | api-builder + schema-builder + ui-builder | 🔴 PENDING |
| 18 | TASK-W14-018 | Subwave 14.12 schema + UI (level descriptor cards) | schema-builder + ui-builder | 🔴 PENDING |
| 19 | TASK-W14-019 | Subwave 14.13 schema (scoring tables + seed) | schema-builder | 🔴 PENDING |
| 20 | TASK-W14-020 | Subwave 14.14 schema + UI (responsibility cascade) | schema-builder + ui-builder | 🔴 PENDING |

---

## Delegations

| # | Agent | Task | Status | Outcome |
|---|-------|------|--------|---------|
| 1 | independent-assurance-agent | IAA Pre-Brief — Wave 14 Execution Start | COMPLETE ✅ | Pre-Brief committed at .agent-admin/assurance/iaa-prebrief-wave14-execution-start-20260313.md |
| 2 | qa-builder | TASK-W14-006: Confirm RED gate for T-W14-UX-001–016 | ✅ COMPLETE | All 104 tests GREEN — implementation already delivered (sessions 140–143, 2026-03-04/05) |
| 3 | ui-builder | TASK governance update: mark Wave 14 tasks COMPLETE in implementation-plan.md | ✅ COMPLETE | Implementation plan updated: all TASK-W14-006 through TASK-W14-020 now ✅ DONE |

---

## Re-Anchor Pulse

```yaml
status: ASSURANCE_TOKEN_PASS
wave: wave14-execution-start-20260313
session: session-wave14-execution-start-20260313
branch: copilot/start-ux-workflow-gap-remediation
iaa_prebrief_artifact: .agent-admin/assurance/iaa-prebrief-wave14-execution-start-20260313.md
last_updated: 2026-03-13
tasks_done: 7
tasks_total: 20
tasks_in_progress: 0
iaa_token: IAA-session-wave14-execution-start-20260313-R2-PASS
notes: |
  RED gate audit by qa-builder (2026-03-13): 104/104 tests GREEN.
  Wave 14 implementation was already COMPLETE (sessions 140-143, 2026-03-04/05).
  BLOCKER-W14-001 resolved: implementation confirmed present.
  Implementation plan updated by ui-builder to reflect completion.
  No further builder delegation required for implementation.
  IAA R2 ASSURANCE-TOKEN issued: IAA-session-wave14-execution-start-20260313-R2-PASS.
  Merge gate released. Awaiting CS2 (@APGI-cmy) review and approval.
```

---

# --- PRIOR WAVE RECORD (wave-status-sweep-20260312) ARCHIVED BELOW ---

# Wave Current Tasks — foreman-v2-agent — wave-status-sweep-20260312
# Wave Current Tasks — foreman-v2-agent — cp-1-persona-gate-closure-20260313

**Wave**: cp-1-persona-gate-closure-20260313 — CP-1 CS2 Checkpoint: maturion-advisor.md Persona Gate Closure
**Session**: session-cp-1-persona-gate-closure-20260313
**Date**: 2026-03-13
**Branch**: copilot/cp-1-update-maturion-advisor-sign-off
**Triggering Issue**: maturion-isms — "CP-1: CS2 Sign-Off — maturion-advisor.md Persona Gate Closure"
**CS2 Authorization**: Issue opened by CS2 (@APGI-cmy) and assigns foreman-v2-agent; constitutes valid CS2 wave-start authorization per foreman contract §2.1
**Agent**: foreman-v2-agent v6.2.0
**Mode**: POLC-Orchestration
**IAA Pre-Brief**: `.agent-admin/assurance/iaa-prebrief-cp-1-persona-gate-closure-20260313.md` — COMMITTED (SHA 27b5517)

---

## Tasks

| # | Task ID | Description | Delegated To | Status |
|---|---------|-------------|--------------|--------|
| 1 | T-CP1-001 | Read and confirm `maturion-advisor.md` completeness at v1.0.0 | Foreman (read-only) | COMPLETE ✅ |
| 2 | T-CP1-002 | Create `.agent-admin/checkpoints/cp-1-closure-20260313.md` | Foreman | COMPLETE ✅ |
| 3 | T-CP1-003 | Update `governance/EXECUTION/AIMC_LKIAC_COMBINED_EXECUTION_PLAN.md` CL-1 CP-1 status | Foreman | COMPLETE ✅ |
| 4 | T-CP1-004 | Update `wave-current-tasks.md` | Foreman | COMPLETE ✅ |
| 5 | T-CP1-005 | Governance ceremony: PREHANDOVER proof + session memory + IAA final audit | Foreman | IN PROGRESS |

---

## Re-Anchor Pulse

```yaml
status: IAA_PRE_BRIEF_PENDING
wave: cp-1-persona-gate-closure-20260313
session: session-cp-1-persona-gate-closure-20260313
branch: copilot/cp-1-update-maturion-advisor-sign-off
iaa_prebrief_artifact: .agent-admin/assurance/iaa-prebrief-cp-1-persona-gate-closure-20260313.md
last_updated: 2026-03-13
tasks_done: 4
tasks_total: 5
iaa_token: PENDING
```

---

# --- PRIOR WAVE RECORD (wave-status-sweep-20260312) ARCHIVED BELOW ---
**IAA Pre-Brief**: `.agent-admin/assurance/iaa-prebrief-wave-status-sweep-20260312.md` — COMMITTED (SHA a400e34)

---

## Tasks

| # | Task ID | Description | Delegated To | Status |
|---|---------|-------------|--------------|--------|
| 1 | T-CL2-001 | Phase 1 preflight + IAA Pre-Brief invocation | Foreman | COMPLETE ✅ |
| 2 | T-CL2-002 | Phase 2 alignment — CS2 auth, verb classification, arch/QA gate | Foreman | COMPLETE ✅ |
| 3 | T-CL2-003 | Update wave-current-tasks.md for CL-2 | Foreman | COMPLETE ✅ |
| 4 | T-CL2-004 | Update plan registry — CL-2 status to STARTED, team assignments logged, Amendment v1.5.0 | Foreman | COMPLETE ✅ |
| 5 | T-CL2-005 | Create acceptance gate CL-2-A1 document | Foreman | COMPLETE ✅ |
| 6 | T-CL2-006 | Governance ceremony — PREHANDOVER proof + session memory + IAA final audit + token | Foreman | COMPLETE ✅ |

---

## Team Assignments (Logged)

| Deliverable | Responsible Agent | Status |
|---|---|---|
| CL-2-D1: Legacy knowledge inventory | `mat-specialist` | DRAFT exists (2026-03-01) — pending CP-2 sign-off |
| CL-2-D2: Domain tagging mapping | `mat-specialist` | DRAFT exists (2026-03-01) — pending CP-2 sign-off |
| CL-2-D3: Extended source taxonomy | `governance-liaison-isms-agent` | Combined into CL-2-D2 (2026-03-01) — pending CP-2 |
| CL-2-A1 acceptance gate | Foreman | PRODUCED this session |

---

## Re-Anchor Pulse

```yaml
status: ASSURANCE_TOKEN_PASS
wave: wave-cl2-20260313
session: session-wave-cl2-20260313
branch: copilot/cl-2-initiate-knowledge-inventory
iaa_prebrief_artifact: .agent-admin/assurance/iaa-prebrief-cl2-knowledge-inventory.md
last_updated: 2026-03-13
tasks_done: 6
tasks_total: 6
iaa_token: IAA-session-wave-cl2-20260313-PASS
iaa_token_file: .agent-admin/assurance/iaa-token-session-wave-cl2-20260313.md
iaa_token_sha: 6e998370
```

---

# --- PRIOR WAVE RECORD (wave-status-sweep-20260312) ARCHIVED BELOW ---

# Wave Current Tasks — foreman-v2-agent — wave-status-sweep-20260312

**Wave**: wave-status-sweep-20260312 — Foreman Analogy Sweep: All Outstanding Waves and Plans (MAT, AIMC, LKIAC)
**Session**: session-wave-status-sweep-20260312
**Date**: 2026-03-12
**Branch**: copilot/commission-foreman-analogy-sweep
**Triggering Issue**: maturion-isms — "Foreman Analogy Request: Sweep all outstanding waves and cross-program plans (MAT, AIMC, LKIAC)"
**CS2 Authorization**: Issue opened by CS2 (@APGI-cmy) and assigns foreman-v2-agent; constitutes valid CS2 wave-start authorization per foreman contract §2.1
**Agent**: foreman-v2-agent v6.2.0
**Mode**: POLC-Orchestration/Analysis
**IAA Pre-Brief**: `.agent-admin/assurance/iaa-prebrief-wave-status-sweep-20260312.md` — COMMITTED (SHA a400e34)

**Tasks**: T-SWEEP-001 through T-SWEEP-006 — ALL COMPLETE ✅  
**Status**: COMPLETE (2026-03-12)

---

# --- PRIOR WAVE RECORD (wave17-user-guided-parsing) ARCHIVED BELOW ---

# Wave Current Tasks — foreman-v2-agent — wave17-user-guided-parsing

**Wave**: 17 — User-Guided AI Parsing Instruction System
**Session**: session-wave17-orchestration-20260311
**Date**: 2026-03-11
**Branch**: copilot/implement-user-guided-ai-parsing
**Triggering Issue**: maturion-isms — "Wave 17 — Build Orchestration: User-Guided AI Parsing Instruction System"
**CS2 Authorization**: Issue opened by CS2 (@APGI-cmy) and assigns foreman-v2-agent; constitutes valid CS2 wave-start authorization per foreman contract §2.1
**Agent**: foreman-v2-agent v6.2.0
**Mode**: POLC-Orchestration
**IAA Pre-Brief**: `.agent-admin/assurance/iaa-prebrief-wave17-user-guided-parsing.md` — COMMITTED (SHA a569450)

---

## Design Defect Corrected

**MAT-DES-PARSE-001 — Hardcoded Parsing Strategy**: The AI Gateway previously used a hardcoded LDCS-specific system prompt. Wave 17 replaces this with a split-layer architecture: invariant schema-first permanent layer (system role) + user-provided variable instructions (user role).

---

## Tasks

| # | Task ID | Description | Delegated To | Status |
|---|---------|-------------|--------------|--------|
| 1 | T-W17-A | Schema: parsing_instructions column + parsing_instruction_templates table + RLS + seed | schema-builder | COMPLETE ✅ |
| 2 | T-W17-B | AI Gateway: parsing.py user_instructions support + split prompt | api-builder | COMPLETE ✅ |
| 3 | T-W17-C | Edge Function: user_instructions forwarding + DB storage | api-builder | COMPLETE ✅ |
| 4 | T-W17-D | UI: ParsingInstructionsModal + CriteriaUpload + useCriteria hook | ui-builder | COMPLETE ✅ |
| 5 | T-W17-E | QA: T-W17-QA-001 to T-W17-QA-012 RED→GREEN | qa-builder | COMPLETE ✅ |

---

## Re-Anchor Pulse

```yaml
status: ASSURANCE_TOKEN_PENDING
wave: 17
session: session-wave17-orchestration-20260311
branch: copilot/implement-user-guided-ai-parsing
batches_complete: [A, B, C, D, E]
tests_green: 17/17
regression_green: 14/14
iaa_prebrief_artifact: .agent-admin/assurance/iaa-prebrief-wave17-user-guided-parsing.md
last_updated: 2026-03-11
tasks_done: 5
tasks_total: 5
```

---

## Root Cause Identified

**PRIMARY ROOT CAUSE**: The `criteria` table is missing the `title TEXT` column.
- The Edge Function (`supabase/functions/invoke-ai-parse-criteria/index.ts`, line 318) attempts to insert `title: c.title ?? null`
- The criteria table DDL (`apps/maturion-maturity-legacy/supabase/migrations/20260302000000_mat_core_tables.sql`) has no `title` column
- PostgreSQL error: `column "title" of relation "criteria" does not exist`
- This causes `criteriaError` to be thrown → status set to `parse_failed` → criteria never created

**SECONDARY ISSUE**: `description TEXT NOT NULL` in criteria table but Edge Function sends `c.description ?? null` — null description would cause NOT NULL violation.

---

## Tasks

| # | Task ID | Description | Delegated To | Status |
|---|---------|-------------|--------------|--------|
| 1 | T-W17-QA-001 | Define Red QA test for criteria title column insertion failure | qa-builder | PENDING |
| 2 | T-W17-SCH-001 | Add migration: `title TEXT` column to criteria table; make `description` nullable | schema-builder | PENDING |
| 3 | T-W17-QA-002 | Run tests to confirm Green after schema fix | qa-builder | PENDING |

---

## Re-Anchor Pulse

```yaml
wave: wave-ci-supabase-migrate-1051
session: session-wave-ci-supabase-migrate-1051-20260310-R2
branch: copilot/fix-supabase-migrate-ci-job-failure
issue: "maturion-isms#1051 — Bug: supabase-migrate CI job fails when Wave 16.6 migration already applied to production"
status: CI_APPROVAL_REQUIRED_AWAITING_CS2
tasks_total: 1
tasks_open: 0
tasks_done: 1
last_updated: 2026-03-10T17:00:00Z
iaa_status: REJECTION_R3 (OVL-CI-005 — needs CS2 CI approval + job evidence)
ci_run_url: https://github.com/APGI-cmy/maturion-isms/actions/runs/22914288734
blocking: CS2_MUST_APPROVE_CI_RUN_THEN_UPDATE_ADDENDUM_THEN_INVOKE_IAA_R4
```

---

# --- PRIOR WAVE RECORD (wave-wf-contract-audit-20260310) ARCHIVED BELOW ---
# Wave Current Tasks — foreman-v2-agent — wave16-full-batch

**Wave**: wave16-full-batch — Wave 16 Full-Batch Build: All Actionable Sub-Waves  
**Session**: session-wave16-full-batch-20260310  
**Date**: 2026-03-10  
**Branch**: copilot/orchestrate-wave-16-build-another-one  
**Triggering Issue**: "Orchestrate full-batch Wave 16 build: Implement all actionable sub-waves, update progress tracker"  
**CS2 Authorization**: Issue opened by @APGI-cmy and assigns foreman-v2-agent  
# Wave Current Tasks — foreman-v2-agent — wave-ldcs-parse-bugfix

**Wave**: wave-ldcs-parse-bugfix — LDCS Parsing Completeness Bugfix  
**Session**: session-wave-ldcs-parse-bugfix-20260310  
**Date**: 2026-03-10  
**Branch**: copilot/fix-ldcs-parsing-issues  
**Triggering Issue**: maturion-isms#1039 — "[BUGFIX] Parsing completeness for LDCS seed: Upgrade to gpt-4.1, increase document limit, fix criteria mapping"  
**CS2 Authorization**: Issue opened by @APGI-cmy and assigned to Copilot (issue #1039)  
**Agent**: foreman-v2-agent v6.2.0  
**Mode**: POLC-Orchestration  
**Governance Source**: `apps/mat-ai-gateway/services/parsing.py`, `supabase/functions/invoke-ai-parse-criteria/index.ts`
# Wave Current Tasks — foreman-v2-agent — wave-16.2-gap-remediation

**Wave**: wave-wf-contract-audit-20260310 — Agent-Contract-Audit Workflow Trigger Migration
**Session**: session-wave-wf-contract-audit-20260310
**Date**: 2026-03-10
**Branch**: copilot/update-agent-contract-audit-workflow
**Triggering Issue**: maturion-isms — "Update agent-contract-audit workflow to use pull_request_target trigger for Copilot agent compatibility"
**CS2 Authorization**: Issue opened by @APGI-cmy and assigned to Copilot
**Agent**: foreman-v2-agent v6.2.0
**Mode**: POLC-Orchestration

---

## Wave Summary

This wave delivers a single-file CI workflow change:
- Migrate `.github/workflows/agent-contract-audit.yml` from `pull_request` to `pull_request_target` trigger
- Add `ref: ${{ github.event.pull_request.head.sha }}` to all checkout steps
- Achieve consistency with all other governance workflows already migrated to `pull_request_target`
- Ensure the required check runs automatically on Copilot-authored PRs without manual approval

### Files in Scope
1. `apps/maturion-maturity-legacy/supabase/migrations/20260310000001_wave16_6_schema_audit_completeness.sql`
2. `.github/workflows/deploy-mat-vercel.yml`
3. `.agent-workspace/foreman-v2/personal/wave-current-tasks.md` — this file
4. `.agent-admin/assurance/iaa-prebrief-wave-fix-vercel-supabase-migration.md`
5. `.agent-workspace/foreman-v2/memory/PREHANDOVER-session-wave-fix-vercel-supabase-migration-20260311.md`
6. `.agent-workspace/foreman-v2/memory/session-wave-fix-vercel-supabase-migration-20260311.md`
7. `.agent-admin/assurance/iaa-token-session-wave-fix-vercel-supabase-migration-20260311.md`

### Files Out of Scope
- No `.github/agents/` files (AGCFPP-001 — N/A)
- No frontend code changes
- No new table schemas or RLS policies beyond this constraint modification

---

## Task Register

| ID | Task | File | Builder | Status |
|----|------|------|---------|--------|
| T-WFVSM-001 | Fix audit_logs_action_check constraint — add NOT VALID | migration .sql | (self-implemented — POLC violation on record) | ✅ DONE |
| T-WFVSM-002 | Enhance CI migration steps with diagnostics | deploy-mat-vercel.yml | (self-implemented — POLC violation on record) | ✅ DONE |
| T-WFVSM-003 | Retroactive governance ceremony | This session | foreman-v2-agent | ✅ DONE |

---

## Re-Anchor Pulse

```yaml
wave: wave-fix-vercel-supabase-migration
session: session-wave-fix-vercel-supabase-migration-20260311
branch: copilot/fix-vercel-supabase-migration
status: ASSURANCE_TOKEN_PASS
tasks_total: 3
tasks_done: 3
last_updated: 2026-03-11
```

---

# Wave Current Tasks — foreman-v2-agent — wave-16.2-gap-remediation

**Wave**: wave-16.2-gap-remediation — Wave 16.2 Gap Remediation: CriteriaModal Backend, Audio Playback, Audit Context, Confirmation Dialogs
**Session**: session-wave-16.2-gap-remediation-20260311
**Date**: 2026-03-11
**Branch**: copilot/fix-criteria-modal-backend
**Triggering Issue**: maturion-isms#1076 — "Wave 16.2 Gap Remediation"
**CS2 Authorization**: Issue opened by @APGI-cmy and assigned to Copilot
**Agent**: foreman-v2-agent v6.2.0
**Mode**: POLC-Orchestration

---

## Wave Summary

This wave closes the outstanding actionable gaps from Wave 16.2. All four gap implementations
have been verified as already present in the codebase. The primary remaining deliverable is:
1. Wire the existing wave162r RED QA suite into the vitest config include pattern
2. Confirm all 13 wave162r tests pass GREEN
3. Complete the full governance ceremony

### Gaps In Scope
| GAP | Priority | Description | Status |
|-----|----------|-------------|--------|
| GAP-009 | HIGH | Wire CriteriaModal to live backend data | ✅ IMPLEMENTED |
| GAP-014 | MEDIUM | Audio player UI for interview recordings | ✅ IMPLEMENTED |
| GAP-015 | MEDIUM | Global AuditContext provider | ✅ IMPLEMENTED |
| GAP-024 | LOW | State-based confirmation dialogs | ✅ IMPLEMENTED |

### Files in Scope
1. `modules/mat/frontend/vitest.config.ts` — add `../tests/ui-wiring/**/*.test.ts` include pattern
2. `.agent-workspace/foreman-v2/personal/wave-current-tasks.md` — this file
3. `.agent-admin/assurance/iaa-prebrief-wave-16.2-gap-remediation-20260311.md`
4. `.agent-workspace/foreman-v2/memory/PREHANDOVER-session-wave-16.2-gap-remediation-20260311.md`
5. `.agent-workspace/foreman-v2/memory/session-wave-16.2-gap-remediation-20260311.md`
6. `.agent-admin/assurance/iaa-token-session-wave-16.2-gap-remediation-20260311.md`
7. `SCOPE_DECLARATION.md`

### Files Out of Scope
- No `.github/agents/` files (AGCFPP-001 — N/A)
- No new backend code, schemas, or migrations

---

## Task Register

| ID | Task | File | Builder | Status |
|----|------|------|---------|--------|
| T-W162-GAP-001 | Verify GAP-009 implementation | CriteriaModal.tsx | QP scan | ✅ DONE |
| T-W162-GAP-002 | Verify GAP-014 implementation | EvidenceCollection.tsx | QP scan | ✅ DONE |
| T-W162-GAP-003 | Verify GAP-015 implementation | AuditContext.tsx + App.tsx | QP scan | ✅ DONE |
| T-W162-GAP-004 | Verify GAP-024 implementation | AuditList.tsx + EvidenceCollection.tsx | QP scan | ✅ DONE |
| T-W162-VITEST-001 | Add ui-wiring tests to vitest config | vitest.config.ts | qa-builder | ✅ DONE |
| T-W162-QA-001 | Confirm wave162r tests GREEN | wave162r tests | qa-builder | ✅ DONE |
| T-W162-GOV-001 | Governance ceremony | ceremony files | foreman-v2-agent | ✅ DONE |

---

## Re-Anchor Pulse

```yaml
wave: wave-16.2-gap-remediation
session: session-wave-16.2-gap-remediation-20260311
branch: copilot/fix-criteria-modal-backend
status: ASSURANCE_TOKEN_PASS
tasks_total: 7
tasks_done: 7
last_updated: 2026-03-11
```



---

## CI Gateway Fix — Issue #1085 (Session: session-ci-gateway-fix-20260312)

**Wave**: CI Gateway Fix
**Branch**: copilot/fix-ci-gateway-failure
**Session**: session-ci-gateway-fix-20260312
**Date**: 2026-03-12

### Tasks

| ID | Task | Status |
|----|------|--------|
| T-CI-001 | Investigate typecheck-api failure root cause | ✅ DONE |
| T-CI-002 | Investigate authority-check never-fires root cause | ✅ DONE |
| T-CI-003 | Sync pnpm-lock.yaml @testing-library/dom specifier | ✅ DONE |
| T-CI-004 | Confirm deploy-mat-vercel.yml --no-frozen-lockfile fix in main | ✅ CONFIRMED (PR #1084) |
| T-CI-005 | Confirm authority-check job in agent-contract-audit.yml | ✅ CONFIRMED (PR #1084) |

### Re-Anchor Pulse

```yaml
wave: ci-gateway-fix
session: session-ci-gateway-fix-20260312
branch: copilot/fix-ci-gateway-failure
status: COMPLETE
tasks_total: 5
tasks_done: 5
last_updated: 2026-03-12
```
