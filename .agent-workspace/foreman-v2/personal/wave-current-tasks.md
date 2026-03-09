# Wave Current Tasks — foreman-v2-agent — wave-16-build

**Wave**: wave-16-build
**Session**: session-wave-16-build-20260309
**Date**: 2026-03-09
**Branch**: copilot/orchestrate-wave-16-build
**Triggering Issue**: maturion-isms#1026 — "Orchestrate Wave 16 Implementation Build for Completeness Gaps (see PR #1020)"
**CS2 Authorization**: Issue #1026 opened by @APGI-cmy and assigned to foreman-v2-agent
**Agent**: foreman-v2-agent v6.2.0
**Mode**: POLC-Orchestration (Wave 16 build orchestration — 25-gap completeness resolution)

---

## Wave Summary

Wave 16 build orchestration. Addressing the 25 gaps documented in the PR #1016 completeness
review, formalized in implementation-plan.md v2.7.0 (wave-mat-gov-process / PR #1020).

Immediately actionable sub-waves:
- Wave 16.1 — Evidence Collection Page Wire (CRITICAL — GAP-003)
- Wave 16.2 — Frontend UX Completeness (HIGH — 9 gaps)
- Wave 16.6 — Schema + Audit Completeness (HIGH — 5 gaps)
- Wave 16.7 — ARC Portal Frontend (HIGH — GAP-013)
- Wave 16.8 — Documentation Gaps (MEDIUM)

BLOCKED sub-waves (pending AIMC Waves 3–4):
- Wave 16.3 — AI Scoring Edge Function (CRITICAL — BLOCKED)
- Wave 16.4 — Report Generation Edge Function (CRITICAL — BLOCKED)
- Wave 16.5 — AIMC Scoring+Reporting Wiring (CRITICAL — BLOCKED)

PARKED:
- Wave 16.9 — Future Considerations (LOW)

---

## Tasks

| ID | Task | Agent | Status | Notes |
|----|------|-------|--------|-------|
| T-W16-QA-001 | Create RED QA tests for Wave 16.1 (Evidence Collection Page Wire) — at least 2 RED tests asserting `/evidence` route renders `EvidenceCollection.tsx` not stub | qa-builder | 🔴 PENDING | RED gate before ui-builder delegation |
| T-W16-QA-002 | Create RED QA tests for Wave 16.2 (Frontend UX Completeness) — at least 2 RED tests per gap: feedback/recommendations page, reports listing page, toast notification display | qa-builder | 🔴 PENDING | RED gate before ui-builder delegation |
| T-W16-QA-003 | Create RED QA tests for Wave 16.6 (Schema+Audit Completeness) — at least 2 RED tests: INSERT on `scores`/`audit_scores` succeeds for authenticated org member (RLS), `evidence_submissions` migration exists | qa-builder | 🔴 PENDING | RED gate before schema-builder delegation |
| T-W16-QA-004 | Create RED QA tests for Wave 16.7 (ARC Portal Frontend) — at least 2 RED tests: ARC operator can view pending feedback items and submit approve/reject | qa-builder | 🔴 PENDING | RED gate before ui-builder delegation |
| T-W16-IMPL-001 | Implement Wave 16.1 — wire `/evidence` route to `EvidenceCollection.tsx`, make RED tests GREEN | ui-builder | 🔴 BLOCKED | Blocked on T-W16-QA-001 RED gate PASS |
| T-W16-IMPL-002 | Implement Wave 16.2 — all 9 UX gaps: feedback/recommendations, reports page, toast system, CriteriaModal fix, interview playback, global audit context, gap_analysis display, unsaved-changes warnings, useAuditMetrics fix | ui-builder | 🔴 BLOCKED | Blocked on T-W16-QA-002 RED gate PASS |
| T-W16-IMPL-003 | Implement Wave 16.6 — RLS policies for scores/audit_scores, audit logging expansion, JWT auth on POST /api/ai/request, evidence_submissions migration | schema-builder + api-builder | 🔴 BLOCKED | Blocked on T-W16-QA-003 RED gate PASS |
| T-W16-IMPL-004 | Implement Wave 16.7 — ARC portal frontend page | ui-builder | 🔴 BLOCKED | Blocked on T-W16-QA-004 RED gate PASS |
| T-W16-DOC-001 | Wave 16.8 — mat-ai-gateway deployment docs, configuration guide, ENV var reference | mat-specialist | 🔴 PENDING | No RED gate required (documentation only) |
| T-W16-FM-001 | Foreman Phase 4 closure: PREHANDOVER proof, session memory, IAA audit, token ceremony | foreman-v2-agent | 🟢 DONE | PREHANDOVER proof + session memory committed; IAA ASSURANCE-TOKEN received (IAA-session-wave-16-build-20260309-PASS) |

---

## Deliverables (Immediately Actionable)

- `modules/mat/tests/wave16/wave16.1-evidence-page.test.ts` — RED QA: 2+ tests for Wave 16.1
- `modules/mat/tests/wave16/wave16.2-ux-completeness.test.ts` — RED QA: 2+ tests per Wave 16.2 gap
- `modules/mat/tests/wave16/wave16.6-schema-audit.test.ts` — RED QA: 2+ tests for Wave 16.6
- `modules/mat/tests/wave16/wave16.7-arc-portal.test.ts` — RED QA: 2+ tests for Wave 16.7
- Wave 16.1 implementation (ui-builder) — after RED gate
- Wave 16.2 implementation (ui-builder) — after RED gate
- Wave 16.6 implementation (schema-builder + api-builder) — after RED gate
- Wave 16.7 implementation (ui-builder) — after RED gate
- Wave 16.8 documentation (mat-specialist)
- `.agent-workspace/foreman-v2/memory/PREHANDOVER-session-wave-16-build-20260309.md` — PREHANDOVER proof
- `.agent-workspace/foreman-v2/memory/session-wave-16-build-20260309.md` — Session memory

---

## IAA Category

- Type: AAWP_MAT — production frontend/schema/API implementation
- Pre-Brief required: YES — mandatory per A-031 before ANY builder delegation
- FFA checks: schema column compliance (A-032), No `.github/agents/` changes, no CI workflow changes

---

## Re-Anchor Pulse

```yaml
wave: wave-16-build
session: session-wave-16-build-20260309
branch: copilot/orchestrate-wave-16-build
status: IAA_PASS_TOKEN_RECEIVED
tasks_total: 10
tasks_complete: 9
last_updated: 2026-03-09T15:34:00Z
blocking: none — IAA ASSURANCE-TOKEN received; awaiting CS2 merge approval
```
