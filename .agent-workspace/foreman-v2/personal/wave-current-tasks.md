# Wave Current Tasks — foreman-v2-agent

**Wave**: Wave 15 — Post-Delivery Oversight Remediation (Criteria Parsing Pipeline) + Schema Drift Remediation
**Session**: session-wave15-schemadrift-20260307
**Date**: 2026-03-07
**Issue**: [Schema Drift] Missing migration for 'parse_tasks' table (blocks CWT RED gate T-W13-SCH-11) — #971
**Branch**: copilot/add-migration-for-parse-tasks-table
**CS2 Authorization**: Issue opened and assigned to foreman-v2-agent by @APGI-cmy directly
**Protocol Reference**: IAA_PRE_BRIEF_PROTOCOL.md v1.1.0 §Trigger
**IAA Pre-Brief**: `.agent-admin/assurance/iaa-prebrief-wave15-schemadrift.md` — PENDING

---

## Wave Context

**Oversight ID**: INC-POST-FCWT-CRITERIA-PIPELINE-001  
**Detected**: 2026-03-06 (post-FCWT live testing with LDCS document)  
**Root cause**: Two components were stubbed and never fully implemented:
1. Supabase Edge Function `invoke-ai-parse-criteria` — does not exist in production
2. AI Gateway `DocumentParser` — `apps/mat-ai-gateway/services/parsing.py` returns `{"status": "queued", "task_id": "stub"}` and does nothing

The criteria upload UI works (file goes to Supabase Storage), but parsing silently fails — no criteria hierarchy is ever created.

**Scope**: Architecture documentation (Steps 1–5 in this PR) + Implementation (Steps 6–7 in separate PRs).

---

## Outstanding Tasks

| # | Task ID | Task | Builder | Status | PR / Evidence |
|---|---------|------|---------|--------|---------------|
| 1 | T-W15-GOV-001 | Update BUILD_PROGRESS_TRACKER.md — add Wave 15 section (post-FCWT gap, oversight, 🔴 PENDING BUILD) | foreman-v2 (governance artifact) | 🔴 PENDING | — |
| 2 | T-W15-GOV-002 | Update app-description.md to v1.4 — concretise §6.2 Parsing Pipeline, version bump, history entry | mat-specialist | 🔴 PENDING | — |
| 3 | T-W15-GOV-003 | Update MAT_UX_WORKFLOW_AND_WIRING.md — add UI→Edge Fn→AI Gateway→DB→poll cycle | mat-specialist | 🔴 PENDING | — |
| 4 | T-W15-GOV-004 | Update functional-requirements.md to v2.0.0 — expand FR-005 (8 new ACs), add FR-102 | mat-specialist | 🔴 PENDING | — |
| 5 | T-W15-GOV-005 | Update system-architecture.md — add §Criteria Parsing Pipeline Architecture section | mat-specialist | 🟢 DONE | This PR |
| 6 | T-W15-QA-001 | Create RED QA suite: src/test/wave15-criteria-parsing.test.ts (T-W15-CP-001 to T-W15-CP-014) | qa-builder | 🔴 PENDING | — |
| 7 | T-W15-IMPL-001 | Batch A: Edge Function `invoke-ai-parse-criteria` + real DocumentParser.parse() + DB write-back | api-builder | 🔴 PENDING | — |
| 8 | T-W15-IMPL-002 | Batch B: CriteriaUpload.tsx error surfacing + useCriteria.ts polling + Hierarchy panel | ui-builder | 🔴 PENDING | — |
| 9 | T-W15-IMPL-003 | Batch C: QA RED → GREEN (T-W15-CP-001 to T-W15-CP-014 all GREEN) | qa-builder | 🔴 PENDING | — |
| 10 | T-W15-GOV-006 | Final BUILD_PROGRESS_TRACKER update — Wave 15 ✅ COMPLETE, oversight closed, IAA tokens, PR links | foreman-v2 (governance artifact) | 🔴 PENDING | — |
| 11 | T-W15-SCH-001 | **[SCHEMA DRIFT]** Add migration `20260307000001_parse_tasks_table.sql` — CREATE TABLE public.parse_tasks with RLS SELECT; fixes T-W13-SCH-11 CWT RED gate | schema-builder | 🟡 IN PROGRESS | PR #971 |
| 12 | T-W15-SCH-002 | **[SCHEMA DRIFT RCA]** Record Schema Drift RCA in `modules/mat/00-app-description/BUILD_PROGRESS_TRACKER.md` — Wave 15 schema drift incident | foreman-v2 (governance artifact) | 🟡 IN PROGRESS | PR #971 |

**Status key**: 🔴 PENDING | 🟡 IN PROGRESS | 🟢 DONE (IAA ASSURANCE-TOKEN received) | ❌ BLOCKED

---

## Batch Assignments (per issue guidance)

| Batch | Scope | Builder | PR Strategy |
|-------|-------|---------|-------------|
| Governance Batch (this PR) | Steps 1–5: Documentation + RED QA | mat-specialist + qa-builder | This PR |
| Batch A | Step 6: Edge Function + AI Gateway + DB write-back | api-builder | Separate PR |
| Batch B | Step 6: UI Integration (error surface + polling + hierarchy) | ui-builder | Separate PR (after Batch A) |
| Batch C | Step 6: QA RED→GREEN | qa-builder | Separate PR (after Batch A+B) |
| **Schema Drift Hotfix** | T-W15-SCH-001 + T-W15-SCH-002: parse_tasks migration + RCA | schema-builder (migration) + foreman-v2 (RCA) | PR #971 (this PR) |

---

## IAA Tokens Received This Wave

| PR # | Batch | Token | Date |
|------|-------|-------|------|
| — | Governance | PENDING | — |
| — | Batch A | PENDING | — |
| — | Batch B | PENDING | — |
| — | Batch C | PENDING | — |

---

## Wave Completion Gate

- [ ] All governance documentation tasks (T-W15-GOV-001 to T-W15-GOV-006) complete
- [ ] RED QA suite committed (T-W15-QA-001) — 14 tests all RED
- [ ] Batch A ASSURANCE-TOKEN received
- [ ] Batch B ASSURANCE-TOKEN received  
- [ ] Batch C ASSURANCE-TOKEN received (all 14 tests GREEN)
- [ ] CWT PASS for Wave 15
- [ ] Oversight INC-POST-FCWT-CRITERIA-PIPELINE-001 marked CLOSED with evidence
- [ ] BUILD_PROGRESS_TRACKER.md Wave 15 state: ✅ COMPLETE
- [ ] CS2 notified for merge approval

---

## Env Vars Required (Batch A)

- `AI_GATEWAY_URL` — URL of the AI Gateway service
- `SUPABASE_URL` — Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY` — Service role key for DB write-back

