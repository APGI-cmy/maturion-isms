# IAA Session Memory — session-wave15r-impl-20260308

| Field | Value |
|-------|-------|
| `session_id` | session-wave15r-impl-20260308 |
| `date` | 2026-03-08 |
| `pr_reviewed` | copilot/commission-api-ui-qa-builders — Wave 15R Implementation — Issue #997 |
| `invoking_agent` | foreman-v2-agent (Phase 4 Step 4.3a) |
| `producing_agent` | api-builder, ui-builder, qa-builder (commissioned by foreman-v2-agent) |
| `producing_agent_class` | builder / foreman |
| `pr_category` | AAWP_MAT |
| `checks_executed` | 46 |
| `checks_passed` | 43 |
| `checks_failed` | 3 |
| `merge_gate_parity_result` | FAIL |
| `verdict` | REJECTION-PACKAGE |
| `token_reference` | IAA-session-wave15r-impl-20260308-REJECTION |
| `token_file_path` | `.agent-admin/assurance/iaa-token-session-wave15r-impl-20260308-REJECTION.md` |
| `adoption_phase_at_time_of_verdict` | PHASE_B_BLOCKING |
| `prior_sessions_reviewed` | session-prebrief-wave15r-impl-20260308, session-wave15r-gov-20260308-R2, session-rca-breach-20260308-R2, session-wave15-schemadrift-20260307, session-rca-breach-20260308-R1 |

## Failures Cited

| # | Check | Finding | Fix |
|---|-------|---------|-----|
| 1 | CORE-015 + CORE-018 | ui-builder and qa-builder session memory absent; PREHANDOVER SHA references inaccurate | Both builders commit session memory; correction addendum (A-030) to update PREHANDOVER; re-invoke |
| 2 | A-026 (BL-027) | SCOPE_DECLARATION.md not updated for wave15r-impl; still shows wave15r-gov content | Rewrite SCOPE_DECLARATION.md for this wave; add A-031 note; commit; re-invoke |

## FAIL-ONLY-ONCE Rules Applied

| Rule | Applied | Outcome |
|------|---------|---------|
| A-001 | IAA invocation evidence | Present (Pre-Brief + iaa_audit_token) — PASS |
| A-002 | No class exceptions | Builder/foreman subject to IAA — CONFIRMED |
| A-006 | PHASE_A_ADVISORY fabrication check | api-builder commit note is legitimate mid-wave status — NOT A-006 breach |
| A-021 | Commit before invocation | All SHAs pre-date this invocation — PASS |
| A-026 | SCOPE_DECLARATION match | STALE — FAIL |
| A-029 | PREHANDOVER immutability | iaa_audit_token pre-populated correctly — PASS; correction addendum path for re-invocation |
| A-031 | IAA ceremony carve-out | Carve-out note absent from SCOPE_DECLARATION.md — not applicable |

## fail_only_once_updates

None added. Pattern noted: builder agents committing deliverables without session memory is a recurring gap risk. If this recurs after R2, propose A-032 (builder session memory same-commit requirement).

## learning_notes

Build quality for wave15r-impl is high — 81/81 GREEN, pipeline complete, SSRF preserved. Both REJECTION findings are ceremony-only. The PREHANDOVER SHA reference for Batch B and C session memory was inaccurate (SHAs existed but contained only app code, not session memory). Foreman should verify builder SHA contents before citing them in PREHANDOVER.

## Suggestions for Improvement

Builder agents should be instructed (and the PREHANDOVER template should require) that session memory must be committed in the SAME commit as the builder's deliverables, not as a separate Foreman-level step. This prevents PREHANDOVER SHA mismatches where a SHA is cited for "session memory" but actually only contains application code.
