# IAA Session Memory — wave-ci-supabase-migrate-1051 (R2)

session_id: session-wave-ci-supabase-migrate-1051-20260310-R2
date: 2026-03-10
agent: independent-assurance-agent v6.2.0

## Invocation
pr_reviewed: "copilot/fix-supabase-migrate-ci-job-failure — wave-ci-supabase-migrate-1051 R2 (Issue #1051)"
invoking_agent: CS2 (@APGI-cmy)
producing_agent: integration-builder (supervised by foreman-v2-agent)
producing_agent_class: builder/foreman

## Verdict
pr_category: CI_WORKFLOW (+ INJECTION_AUDIT_TRAIL)
checks_executed: 29
checks_passed: 28
checks_failed: 1
merge_gate_parity_result: FAIL (OVL-CI-005 — no CI run URL; branch local-only)
verdict: REJECTION-PACKAGE
token_reference: IAA-session-wave-ci-supabase-migrate-1051-20260310-R2-REJECTION
adoption_phase_at_time_of_verdict: PHASE_B_BLOCKING

## Prior Sessions Reviewed
- session-wave16-full-batch-20260310 (ASSURANCE-TOKEN)
- session-wave16-orchestration-20260309-R2 (ASSURANCE-TOKEN)
- session-wave16-orchestration-20260309 (REJECTION-PACKAGE)
- session-waveOVLINJ-20260307 (previous)
- session-wave15r-impl-R2-20260308 (ASSURANCE-TOKEN)

## FAIL-ONLY-ONCE Rules Applied
fail_only_once_rules_applied:
  - A-001: PASS — Both PREHANDOVER proofs contain iaa_audit_token pre-populated expected reference
  - A-002: PASS — N/A (no agent contract in scope)
  - A-032: PASS — legacy_migrations DDL columns verified: name (PK) and applied_at (with default). Both INSERTs use only `name` column. Zero non-existent column references.

## Failures Cited
failures_cited:
  - OVL-CI-005: No CI run URL. Branch commits (04d0e1f, 56a1df4) are local-only. Push to origin blocked in api_call_received context. S-033 exception does not apply (workflow triggers on pull_request for the modified file path). Fix: CS2 pushes branch → opens PR → CI run completes → CI URL documented → IAA re-invoked.

## Technical Quality Assessment
- Fix logic: CORRECT — pre-registration INSERT at line 213 correctly records out-of-band migration before loop runs; loop's COUNT(*) check returns 1 → skip triggered
- Belt-and-suspenders: CORRECT — ON CONFLICT DO NOTHING on loop INSERT (line 220) prevents future duplicate key errors
- Schema verification: CORRECT — evidence_submissions step (lines 297-312) follows exact pattern of audits/audit_logs steps; null-guard present
- Silent failure analysis: CLEAN — ON CONFLICT DO NOTHING does not suppress connection errors; ON_ERROR_STOP=1 preserved; schema-verification error path exits 1
- YAML: VALID (verified locally)
- CodeQL: 0 alerts (per producing agent evidence)
- A-032 compliance: CLEAN — only `name` column used in both INSERTs

## Advisory Observations (non-blocking)
- SCOPE_DECLARATION.md is stale (from previous wave wave-gov-improvement) — should be updated to wave-ci-supabase-migrate-1051 before push to origin. Will surface as BL-027 in CI if not fixed (A-026).
- Pre-existing: schema-verification does not gate deploy-preview/deploy-production jobs — architectural observation for CS2, not introduced by this fix.

## §4.3b Ceremony
token_file_written: .agent-admin/assurance/iaa-token-session-wave-ci-supabase-migrate-1051-20260310-R2.md
prehandover_proofs: UNCHANGED (read-only post-commit per A-029 §4.3b)

## FAIL-ONLY-ONCE Updates
fail_only_once_updates: none — no new patterns observed. OVL-CI-005 with local-only branch is the same scenario as R1 (push blocked). A-021 would normally apply but the push block is an infrastructure constraint (api_call_received context), not an agent workflow error.

## Learning Notes
learning_notes:
  - When a PR is submitted from api_call_received context with no push access, the correct path is: foreman documents the local-only state explicitly → IAA issues REJECTION-PACKAGE citing OVL-CI-005 → CS2 pushes manually → CI runs → re-invocation. This is the established pattern and was followed correctly.
  - The placeholder token file pattern (PLACEHOLDER.md committed on branch, replaced by IAA actual verdict file) works cleanly. CORE-007 carve-out covers it.
  - Advisory note on SCOPE_DECLARATION.md staleness: producing agents should update SCOPE_DECLARATION.md as part of their ceremony commit. Stale = BL-027 risk in CI. This should be noted in the Pre-Brief template as a required deliverable.

## Suggestions for Improvement
suggestions_for_improvement: |
  Add SCOPE_DECLARATION.md update as an explicit required deliverable in IAA Pre-Brief §8 template.
  Currently the Pre-Brief §8 lists ceremony artifacts (PREHANDOVER proof, session memory, iaa_audit_token)
  but does not explicitly call out SCOPE_DECLARATION.md update as a required step. Adding this would
  prevent the A-026 staleness advisory from recurring across waves. One-line addition to §8 checklist:
  "| SCOPE_DECLARATION.md updated to this wave | YES | A-026/A-028 — list format, prior-wave entries trimmed |"
