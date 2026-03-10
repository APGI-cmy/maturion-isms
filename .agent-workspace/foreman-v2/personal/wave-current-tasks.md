# Wave Current Tasks — foreman-v2-agent — wave16-full-batch

**Wave**: wave16-full-batch — Wave 16 Full-Batch Build: All Actionable Sub-Waves  
**Session**: session-wave16-full-batch-20260310  
**Date**: 2026-03-10  
**Branch**: copilot/orchestrate-wave-16-build-another-one  
**Triggering Issue**: "Orchestrate full-batch Wave 16 build: Implement all actionable sub-waves, update progress tracker"  
**CS2 Authorization**: Issue opened by @APGI-cmy and assigns foreman-v2-agent  
**Agent**: foreman-v2-agent v6.2.0  
**Mode**: POLC-Orchestration  
**Governance Source**: `modules/mat/03-implementation-plan/implementation-plan.md` v2.7.0; `modules/mat/BUILD_PROGRESS_TRACKER.md` v1.9  
**Prior Session**: wave16-orchestration kick-off (PR #1034, merged) — task register published, all sub-waves documented

---

## Wave Summary

This session executes the FULL BATCH Wave 16 build. All actionable sub-waves (16.1, 16.2, 16.6, 16.7, 16.8) are to be implemented in this wave. Blocked (16.3, 16.4, 16.5) and parked (16.9) waves remain deferred per prior documentation.

### Execution Order (per architectural dependency diagram — issue image)
1. **16.6** (schema-builder + api-builder) — FIRST: unblocks RLS-dependent work
2. **16.1** (ui-builder) — parallel with 16.6: Evidence Collection Page Wire
3. **16.8** (mat-specialist) — parallel: documentation only, no dependency
4. **16.2** (ui-builder) — after 16.1: Frontend UX Completeness
5. **16.7** (ui-builder) — after 16.1/16.2 or parallel: ARC Portal Frontend

---

## Sub-Wave Task Register

| ID | Sub-Wave | Builder | Priority | Status | Dependency | Gaps |
|----|----------|---------|----------|--------|-----------|------|
| T-W16.6-SCH-001 | Schema + Audit Completeness — RED QA suite | qa-builder | HIGH | OPEN | None | GAP-011,012,016,017,019 |
| T-W16.6-SCH-002 | Schema + Audit Completeness — implementation | schema-builder + api-builder | HIGH | OPEN — awaiting RED QA | T-W16.6-SCH-001 | GAP-011,012,016,017,019 |
| T-W16.1-UI-001 | Evidence Collection Page Wire — RED QA suite | qa-builder | CRITICAL | OPEN | None | GAP-003 |
| T-W16.1-UI-002 | Evidence Collection Page Wire — implementation | ui-builder | CRITICAL | OPEN — awaiting RED QA | T-W16.1-UI-001 | GAP-003 |
| T-W16.8-DOC-001 | Documentation Gaps — mat-ai-gateway deployment runbook | mat-specialist | MEDIUM | OPEN | None | GAP-018 |
| T-W16.2-UI-001 | Frontend UX Completeness — RED QA suite | qa-builder | HIGH | OPEN | After 16.1 | GAP-006,007,008,009,014,015,020,024,025 |
| T-W16.2-UI-002 | Frontend UX Completeness — implementation | ui-builder | HIGH | OPEN — awaiting RED QA | T-W16.2-UI-001 + 16.1 complete | GAP-006,007,008,009,014,015,020,024,025 |
| T-W16.7-UI-001 | ARC Portal Frontend — RED QA suite | qa-builder | HIGH | OPEN | After 16.1/16.2 | GAP-013 |
| T-W16.7-UI-002 | ARC Portal Frontend — implementation | ui-builder | HIGH | OPEN — awaiting RED QA | T-W16.7-UI-001 | GAP-013 |
| T-W16.3-API-001 | AI Scoring Edge Function — RED QA suite | qa-builder | CRITICAL | BLOCKED | Wave 16.5 | GAP-001,010 |
| T-W16.3-API-002 | AI Scoring Edge Function — implementation | api-builder | CRITICAL | BLOCKED | T-W16.3-API-001 + Wave 16.5 | GAP-001,010 |
| T-W16.4-API-001 | Report Generation Edge Function — RED QA suite | qa-builder | CRITICAL | BLOCKED | Wave 16.3 + 16.5 | GAP-002 |
| T-W16.4-API-002 | Report Generation Edge Function — implementation | api-builder | CRITICAL | BLOCKED | T-W16.4-API-001 + Wave 16.3 + 16.5 | GAP-002 |
| T-W16.5-INT-001 | AIMC Scoring+Reporting Wiring — RED integration QA suite | qa-builder | CRITICAL | BLOCKED | AIMC Waves 3-4 | GAP-004,005 |
| T-W16.5-INT-002 | AIMC Scoring+Reporting Wiring — implementation | integration-builder | CRITICAL | BLOCKED | T-W16.5-INT-001 + AIMC Waves 3-4 | GAP-004,005 |
| T-W16.9-PARKED | Future Considerations | TBD | LOW | PARKED — awaiting CS2 decision | CS2 decision | GAP-021,022,023 |

---

## Execution Sequence

### Batch 1 (Parallel — First Priority)
1. Wave 16.6 → qa-builder (RED) → schema-builder + api-builder (GREEN) — HIGH
2. Wave 16.1 → qa-builder (RED) → ui-builder (GREEN) — CRITICAL
3. Wave 16.8 → mat-specialist (documentation only) — MEDIUM

### Batch 2 (After Batch 1)
4. Wave 16.2 → qa-builder (RED) → ui-builder (GREEN) — HIGH (after 16.1 complete)
5. Wave 16.7 → qa-builder (RED) → ui-builder (GREEN) — HIGH (after 16.1/16.2)

### Blocked (External Dependencies)
- Wave 16.5 — unlock when AIMC delivers Waves 3-4
- Wave 16.3 — unlock when Wave 16.5 complete
- Wave 16.4 — unlock when Wave 16.3 + 16.5 complete

### Parked
- Wave 16.9 — escalate to CS2 for architectural decision

---

## Gating Checks per Sub-Wave

All sub-waves (except 16.8 documentation and 16.9 parked) must pass:
- RED QA gate: min 2 RED tests written and confirmed failing BEFORE builder delegation
- IAA pre-brief: pre-brief artifact committed before any builder delegation
- SCOPE_DECLARATION: fresh overwrite per A-029 before handover
- QP evaluation: 100% GREEN, zero skipped/todo/stub tests, zero warnings
- PREHANDOVER proof + IAA final audit + token ceremony
- CS2 merge approval

---

## IAA Pre-Brief Trigger

This file commit triggers the automated IAA Pre-Brief injection workflow.
Wave: wave16-full-batch
Branch: copilot/orchestrate-wave-16-build-another-one

---

## Re-Anchor Pulse

```yaml
wave: wave16-full-batch
session: session-wave16-full-batch-20260310
branch: copilot/orchestrate-wave-16-build-another-one
status: IAA_PRE_BRIEF_PENDING
tasks_total: 16
tasks_actionable: 9
tasks_blocked: 6
tasks_parked: 1
batches: 2
batch_1_sub_waves: [16.1, 16.6, 16.8]
batch_2_sub_waves: [16.2, 16.7]
blocked_sub_waves: [16.3, 16.4, 16.5]
parked_sub_waves: [16.9]
```
