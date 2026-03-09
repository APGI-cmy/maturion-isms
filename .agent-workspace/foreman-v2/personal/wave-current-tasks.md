# Wave Current Tasks — foreman-v2-agent — wave-mat-gov-process

**Wave**: wave-mat-gov-process
**Session**: session-wave-mat-gov-process-20260309
**Date**: 2026-03-09
**Branch**: copilot/implement-governance-process-mat
**Triggering Issue**: maturion-isms — "Implement end-to-end governance process, reporting, and oversight for MAT compliance workflow pipeline (PR #1016)"
**CS2 Authorization**: Issue opened by @APGI-cmy and assigned to foreman-v2-agent
**Agent**: foreman-v2-agent v6.2.0
**Mode**: POLC-Orchestration (governance overlay formalization, traceable progress tracking, gap documentation)

---

## Wave Summary

Governance formalization wave. Acting on the 25 gaps documented in PR #1016 completeness review
(`docs/completeness-review/compliance-workflow-completeness-report-20260309.md`), this wave:

1. Updates the MAT implementation plan with new gap-resolution wave definitions (Waves 16.x)
2. Updates BUILD_PROGRESS_TRACKER.md with completeness review findings, gap status, and new planned waves
3. Expands governance overlays (FRS, TRS) to cover traceability for all 25 identified gaps
4. Produces a traceable build plan covering end-to-end governance from review findings to closure

No production code, no schema migrations, no tests, no CI changes — this is a governance/documentation wave.

---

## Tasks

| ID | Task | Agent | Status | Notes |
|----|------|-------|--------|-------|
| T-MGP-GOV-001 | Update `modules/mat/03-implementation-plan/implementation-plan.md` — add Wave 16.x gap-resolution plan covering all 25 gaps from completeness review, with builder assignments, dependencies, and acceptance criteria | mat-specialist | 🔴 PENDING | Governance document update; must trace every gap to a wave |
| T-MGP-GOV-002 | Update `modules/mat/BUILD_PROGRESS_TRACKER.md` — add completeness review section, gap register with status, new wave 16.x state machines | mat-specialist | 🔴 PENDING | Governance document update; must include gap-resolution state machines |
| T-MGP-GOV-003 | Expand FRS (`modules/mat/01-frs/functional-requirements.md`) — add FR-078 through FR-085 covering evidence collection wiring, report listing, feedback/recommendations UI, AIMC scoring/reporting wiring, audit logging completeness, RLS completion, toast notifications | mat-specialist | 🔴 PENDING | Governance overlay expansion — traceability from gaps to requirements |
| T-MGP-GOV-004 | Expand TRS (`modules/mat/01.5-trs/technical-requirements-specification.md`) — add TR-078 through TR-085 as technical counterparts to FR-078–FR-085, with FRS-to-TRS traceability matrix update | mat-specialist | 🔴 PENDING | Technical requirements expansion |
| T-MGP-FM-001 | Foreman governance closure: FAIL-ONLY-ONCE attestation, wave-current-tasks.md, PREHANDOVER proof, session memory | foreman-v2-agent | 🔴 PENDING | Phase 4 ceremony |

---

## Deliverables

- `modules/mat/03-implementation-plan/implementation-plan.md` v2.7.0+ — updated with Wave 16.x gap-resolution plan
- `modules/mat/BUILD_PROGRESS_TRACKER.md` v1.8+ — updated with completeness review findings and wave 16.x state machines
- `modules/mat/01-frs/functional-requirements.md` v1.6.0+ — FR-078 to FR-085 added
- `modules/mat/01.5-trs/technical-requirements-specification.md` v1.5.0+ — TR-078 to TR-085 added
- `.agent-workspace/foreman-v2/memory/PREHANDOVER-session-wave-mat-gov-process-20260309.md` — PREHANDOVER proof
- `.agent-workspace/foreman-v2/memory/session-wave-mat-gov-process-20260309.md` — Session memory

---

## IAA Category

- Type: KNOWLEDGE_GOVERNANCE + AAWP_MAT (governance overlay documents are MAT module deliverables)
- Pre-Brief required: YES — mandatory per A-031 before ANY builder delegation or substantive commit
- FFA checks: all triggering paths must be verified before handover

---

## Gap Register Summary (from PR #1016)

| GAP | Severity | Description | Planned Wave |
|-----|----------|-------------|-------------|
| GAP-001 | CRITICAL | `invoke-ai-score-criterion` Edge Function missing | Wave 16.3 (BLOCKED on AIMC) |
| GAP-002 | CRITICAL | `generate-audit-report` Edge Function missing | Wave 16.4 (BLOCKED on AIMC) |
| GAP-003 | CRITICAL | `/evidence` page is stub component | Wave 16.1 |
| GAP-004 | CRITICAL | AIMC `scoring` capability wiring incomplete | Wave 16.5 (cross-module dependency) |
| GAP-005 | CRITICAL | AIMC `reporting` capability wiring incomplete | Wave 16.5 (cross-module dependency) |
| GAP-006 | HIGH | No feedback/recommendations UI | Wave 16.2 |
| GAP-007 | HIGH | `/reports` page is stub | Wave 16.2 |
| GAP-008 | HIGH | No toast notification system | Wave 16.2 |
| GAP-009 | HIGH | `CriteriaModal` shows mock/hardcoded data | Wave 16.2 |
| GAP-010 | HIGH | No long-running task tracker for report generation | Wave 16.3 |
| GAP-011 | HIGH | `scores` INSERT/UPDATE RLS policies incomplete | Wave 16.6 |
| GAP-012 | HIGH | `audit_scores` INSERT/UPDATE RLS policies incomplete | Wave 16.6 |
| GAP-013 | HIGH | No ARC portal frontend | Wave 16.7 |
| GAP-014 | MEDIUM | Interview recording playback not implemented | Wave 16.2 |
| GAP-015 | MEDIUM | No global audit selection context | Wave 16.2 |
| GAP-016 | MEDIUM | Audit logging covers only criteria parsing | Wave 16.6 |
| GAP-017 | MEDIUM | `POST /api/ai/request` lacks JWT authentication | Wave 16.6 |
| GAP-018 | MEDIUM | `mat-ai-gateway` deployment instructions not in repo | Wave 16.8 (docs) |
| GAP-019 | MEDIUM | `evidence_submissions` table referenced but no migration | Wave 16.6 |
| GAP-020 | MEDIUM | Score `gap_analysis` JSONB never displayed | Wave 16.2 |
| GAP-021 | LOW | No database webhooks for async processing | Wave 16.9 (future consideration) |
| GAP-022 | LOW | No `report_requests` table | Wave 16.9 (future consideration) |
| GAP-023 | LOW | `control_standards` concept not explicitly modeled | Wave 16.9 (future consideration) |
| GAP-024 | LOW | No unsaved-changes warnings or confirmation dialogs | Wave 16.2 |
| GAP-025 | LOW | `useAuditMetrics` polling has no stop condition | Wave 16.2 |

---

## Re-Anchor Pulse

```yaml
wave: wave-mat-gov-process
session: session-wave-mat-gov-process-20260309
branch: copilot/implement-governance-process-mat
status: PRE_BRIEF_PENDING
tasks_total: 5
tasks_complete: 0
last_updated: 2026-03-09T10:40:00Z
blocking: IAA_PRE_BRIEF_REQUIRED — A-031
```
