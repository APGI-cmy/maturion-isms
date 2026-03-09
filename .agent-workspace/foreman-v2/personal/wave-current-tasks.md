# Wave Current Tasks — foreman-v2-agent — wave16-orchestration

**Wave**: wave16-orchestration — Wave 16 Completeness Gap Resolution Kick-Off  
**Session**: session-wave16-orchestration-20260309  
**Date**: 2026-03-09  
**Branch**: copilot/orchestrate-wave-16-build-again  
**Triggering Issue**: maturion-isms — "Orchestrate Wave 16 Implementation Build for Completeness Gaps (see PR #1020)"  
**CS2 Authorization**: Issue opened by @APGI-cmy and assigned to foreman-v2-agent; PR #1020 governance overlay committed  
**Agent**: foreman-v2-agent v6.2.0  
**Mode**: POLC-Orchestration  
**Governance Source**: `modules/mat/03-implementation-plan/implementation-plan.md` v2.7.0; `modules/mat/BUILD_PROGRESS_TRACKER.md` v1.8  

---

## Wave Summary

Wave 16 addresses all 25 completeness gaps documented in the end-to-end compliance workflow review (PR #1016). The MAT pipeline is ~45% functional; three CRITICAL gaps block full adoption.

This session is the **formal kick-off** for Wave 16 orchestration. It publishes the task sequence, registers blocked waves, documents builder assignments, and updates the BUILD_PROGRESS_TRACKER. Individual sub-wave implementation sessions follow per builder delegation.

### Pipeline Status at Wave 16 Start
- Critical blockers: GAP-001 (`invoke-ai-score-criterion` missing), GAP-002 (`generate-audit-report` missing), GAP-003 (`/evidence` stub)
- AIMC cross-module dependency: GAP-004, GAP-005 (Waves 16.3/16.4 blocked on AIMC Waves 3-4 via Wave 16.5)
- Immediately actionable: Wave 16.1, 16.2, 16.6, 16.7, 16.8 (no external dependencies)
- Blocked: Wave 16.3, 16.4 (need 16.5 first); Wave 16.5 (needs AIMC Waves 3-4)
- Parked: Wave 16.9 (awaits CS2 architectural decision)

---

## Sub-Wave Task Register

| ID | Sub-Wave | Builder | Priority | Status | Dependency | Gaps |
|----|----------|---------|----------|--------|-----------|------|
| T-W16.1-UI-001 | Evidence Collection Page Wire — RED QA suite | qa-builder | CRITICAL | OPEN — awaiting IAA pre-brief | None | GAP-003 |
| T-W16.1-UI-002 | Evidence Collection Page Wire — implementation | ui-builder | CRITICAL | OPEN — awaiting RED QA | T-W16.1-UI-001 | GAP-003 |
| T-W16.2-UI-001 | Frontend UX Completeness — RED QA suite | qa-builder | HIGH | OPEN — awaiting IAA pre-brief | None | GAP-006,007,008,009,014,015,020,024,025 |
| T-W16.2-UI-002 | Frontend UX Completeness — implementation | ui-builder | HIGH | OPEN — awaiting RED QA | T-W16.2-UI-001 | GAP-006,007,008,009,014,015,020,024,025 |
| T-W16.3-API-001 | AI Scoring Edge Function — RED QA suite | qa-builder | CRITICAL | BLOCKED | Wave 16.5 | GAP-001,010 |
| T-W16.3-API-002 | AI Scoring Edge Function — implementation | api-builder | CRITICAL | BLOCKED | T-W16.3-API-001 + Wave 16.5 | GAP-001,010 |
| T-W16.4-API-001 | Report Generation Edge Function — RED QA suite | qa-builder | CRITICAL | BLOCKED | Wave 16.3 + 16.5 | GAP-002 |
| T-W16.4-API-002 | Report Generation Edge Function — implementation | api-builder | CRITICAL | BLOCKED | T-W16.4-API-001 + Wave 16.3 + 16.5 | GAP-002 |
| T-W16.5-INT-001 | AIMC Scoring+Reporting Wiring — RED integration QA suite | qa-builder | CRITICAL | OPEN (cross-module) — awaiting AIMC Waves 3-4 | AIMC Waves 3-4 | GAP-004,005 |
| T-W16.5-INT-002 | AIMC Scoring+Reporting Wiring — implementation | integration-builder | CRITICAL | OPEN | T-W16.5-INT-001 + AIMC Waves 3-4 | GAP-004,005 |
| T-W16.6-SCH-001 | Schema + Audit Completeness — RED QA suite | qa-builder | HIGH | OPEN — awaiting IAA pre-brief | None | GAP-011,012,016,017,019 |
| T-W16.6-SCH-002 | Schema + Audit Completeness — migrations + RLS + JWT auth | schema-builder + api-builder | HIGH | OPEN — awaiting RED QA | T-W16.6-SCH-001 | GAP-011,012,016,017,019 |
| T-W16.7-UI-001 | ARC Portal Frontend — RED QA suite | qa-builder | HIGH | OPEN — awaiting IAA pre-brief | None | GAP-013 |
| T-W16.7-UI-002 | ARC Portal Frontend — implementation | ui-builder | HIGH | OPEN — awaiting RED QA | T-W16.7-UI-001 | GAP-013 |
| T-W16.8-DOC-001 | Documentation Gaps — mat-ai-gateway deployment runbook | mat-specialist | MEDIUM | OPEN | None | GAP-018 |
| T-W16.9-PARKED | Future Considerations | TBD | LOW | PARKED — awaiting CS2 decision | CS2 decision | GAP-021,022,023 |

---

## Execution Sequence

### Immediately Actionable (parallel sub-wave sessions after IAA pre-brief received)
1. Wave 16.1 → qa-builder (RED) → ui-builder (GREEN) — CRITICAL
2. Wave 16.6 → qa-builder (RED) → schema-builder + api-builder (GREEN) — HIGH
3. Wave 16.7 → qa-builder (RED) → ui-builder (GREEN) — HIGH
4. Wave 16.8 → mat-specialist (documentation only) — MEDIUM
5. Wave 16.2 → qa-builder (RED) → ui-builder (GREEN) — HIGH (after 16.1)

### Blocked (external dependencies)
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
- SCOPE_DECLARATION: fresh overwrite per A-029 before each sub-wave
- QP evaluation: 100% GREEN, zero skipped/todo/stub tests, zero warnings
- PREHANDOVER proof + IAA final audit + token ceremony per sub-wave
- CS2 merge approval per sub-wave

---

## IAA Pre-Brief Trigger

This file commit triggers the automated IAA Pre-Brief injection workflow.
Wave: wave16-orchestration
Branch: copilot/orchestrate-wave-16-build-again

---

## Re-Anchor Pulse

```yaml
wave: wave16-orchestration
session: session-wave16-orchestration-20260309
branch: copilot/orchestrate-wave-16-build-again
status: IAA_PRE_BRIEF_PENDING
tasks_total: 16
tasks_actionable: 10
tasks_blocked: 4
tasks_parked: 1
last_updated: 2026-03-09T15:57:39Z
blocking: IAA_PRE_BRIEF_REQUIRED
```
