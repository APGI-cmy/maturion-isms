# IAA Session Memory — Session 150 — Wave LV Re-Audit (F-149-001 Fix) — 2026-03-05

| Field | Value |
|-------|-------|
| `session_id` | session-150 |
| `date` | 2026-03-05 |
| `pr_reviewed` | copilot/implement-mat-liveness-test-suite (Issue #932, commit e203024 — F-149-001 fix) |
| `invoking_agent` | foreman-v2-agent (session-142 handover chain) |
| `producing_agent` | copilot-swe-agent[bot] co-authored-by APGI-cmy (e203024); qa-builder (LV-RED/1/2/3); integration-builder (LV-4/5) |
| `producing_agent_class` | builder + CS2-authorized fix |
| `pr_category` | AAWP_MAT + CI_WORKFLOW |
| `checks_executed` | 65 (6 FAIL-ONLY-ONCE + 22 core invariants + 5 CI_WORKFLOW overlay + 1 F-149-001 direct + 31 session-149 carry-forward) |
| `checks_passed` | 65 |
| `checks_failed` | 0 |
| `merge_gate_parity_result` | PASS |
| `verdict` | ASSURANCE-TOKEN |
| `token_reference` | IAA-session-150-waveLV-20260305-PASS |
| `token_file` | `.agent-admin/assurance/iaa-token-session-150-waveLV-20260305.md` |
| `failures_cited` | NONE |
| `adoption_phase_at_time_of_verdict` | PHASE_B_BLOCKING |
| `prior_sessions_reviewed` | session-149, session-148, session-141-v4, session-142, session-143 |
| `re_invocation_context` | F-149-001 fix applied per session-149 REJECTION-PACKAGE |

## F-149-001 Resolution

| Finding | Fix | Commit | Verification |
|---------|-----|--------|-------------|
| F-149-001: liveness job missing `permissions:` block (CodeQL `actions/missing-workflow-permissions`) | Added `permissions: contents: read` to `liveness:` job | e203024 | YAML machine-validated; `permissions = {'contents': 'read'}` confirmed; principle of least privilege satisfied |

## fail_only_once_rules_applied

| Rule | Applied | Outcome |
|------|---------|---------|
| A-001 (invocation evidence) | YES | PASS — PREHANDOVER present with prior session evidence |
| A-002 (no class exceptions) | YES | N/A — not an AGENT_CONTRACT PR |
| A-021 (commit before invocation) | YES | PASS — e203024 is HEAD, working tree clean |
| A-026 (SCOPE_DECLARATION parity) | YES | PASS — liveness.yml declared in SCOPE_DECLARATION |
| A-029 (PREHANDOVER immutability §4.3b) | YES | PASS — PREHANDOVER read-only; new token file written as session-150 |
| A-030 (CORE-019 re-invocation carve-out) | YES | PASS — session-149 REJECTION-PACKAGE committed at 3098872 = correction addendum |

## learning_notes

1. **Fast-path re-audit for minimal targeted fixes**: When a REJECTION-PACKAGE cites a single finding that is resolved by a minimal, non-logic-changing commit (2 lines, permissions block only), the re-audit is genuinely fast: YAML machine-validation replaces extended code review. The 50 prior PASS checks carry forward cleanly. This validates the S-IAA-149a suggestion (fast-path concept) — though the current protocol handles it adequately via carry-forward rules.

2. **`permissions: contents: read` is the correct minimal scope for checkout-only workflows**: For any workflow that only calls `actions/checkout@v4` and runs read-only commands (npm install, test, upload-artifact), `contents: read` is both necessary and sufficient. `actions/upload-artifact@v4` operates under GITHUB_TOKEN for artifact storage without requiring explicit write permissions in the job's permissions block. This is a confirmed pattern for future CI_WORKFLOW reviews.

3. **A-031 remains PROPOSED**: The OVL-CI-006 codification of "every workflow job must declare explicit permissions block" is still pending CS2 approval. F-149-001 was found by CodeQL rather than by an explicit IAA overlay check — the gap in the overlay is confirmed. CS2 should formally approve A-031 and OVL-CI-006 to catch this class of issue at IAA time rather than at CodeQL time.

## Suggestions for Improvement (MANDATORY)

**S-IAA-150a**: Formalise A-031 and OVL-CI-006 — "Every GitHub Actions workflow job must declare an explicit `permissions:` block with minimal required permissions." This was proposed in session-149 as a PROPOSED rule. After F-149-001 being resolved in this session (second invocation caused by this gap), the pattern is confirmed. CS2 should approve the addition to FAIL-ONLY-ONCE registry and iaa-category-overlays.md CI_WORKFLOW overlay in the next governance pass.

**S-IAA-150b**: Consider whether a `top-level permissions: {}` (deny-all-at-workflow-level) combined with per-job grants would be stronger than per-job grants only. For liveness.yml, a top-level `permissions: {}` + per-job `contents: read` would be belt-and-suspenders and eliminate any ambiguity about what other jobs in the workflow could inherit. Advisory only — current fix is compliant.

## fail_only_once_updates

None this session — A-031 remains PROPOSED from session-149. No new rule additions to the registry without CS2 approval.

## parking_station_entry

| 2026-03-05 | independent-assurance-agent | session-150 | PHASE-4 | A-031 still PROPOSED: formalise OVL-CI-006 (explicit permissions block per workflow job) as standing FAIL-ONLY-ONCE rule — second confirmed incident (F-149-001) | session-150-waveLV-20260305.md |
| 2026-03-05 | independent-assurance-agent | session-150 | PHASE-4 | Top-level `permissions: {}` + per-job grants pattern advisory for future CI workflow reviews | session-150-waveLV-20260305.md |
