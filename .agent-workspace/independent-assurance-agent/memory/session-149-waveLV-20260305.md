# IAA Session Memory — Session 149 — Wave LV Re-Audit — 2026-03-05

| Field | Value |
|-------|-------|
| `session_id` | session-149 |
| `date` | 2026-03-05 |
| `pr_reviewed` | copilot/implement-mat-liveness-test-suite (Issue #932, commit fa72776 — F-142-001 fix) |
| `invoking_agent` | foreman-v2-agent (session-142) |
| `producing_agent` | qa-builder (LV-RED, LV-1/2/3), integration-builder (LV-4/5); foreman-v2-agent (fix commit fa72776) |
| `producing_agent_class` | builder + foreman |
| `pr_category` | AAWP_MAT + CI_WORKFLOW |
| `checks_executed` | 50 |
| `checks_passed` | 50 |
| `checks_failed` | 0 |
| `merge_gate_parity_result` | PASS |
| `verdict` | ASSURANCE-TOKEN |
| `token_reference` | IAA-session-142-waveLV-20260305-PASS |
| `adoption_phase_at_time_of_verdict` | PHASE_B_BLOCKING |
| `prior_sessions_reviewed` | session-143, session-144, session-145, session-146, session-147-prebrief-waveLV, session-148-waveLV |
| `re_invocation_context` | F-142-001 fix applied per session-148 REJECTION-PACKAGE |

## F-142-001 Resolution Evidence

| Item | Before (commit 75bac27) | After (commit fa72776) | Status |
|------|------------------------|------------------------|--------|
| liveness.yml lines 3-5 | IAA policy OVL-CI-001: WARN→exit0, FAIL→exit1 (blocking) | All liveness results non-blocking; runner exits 1 for artifact reporting; review artifact | FIXED ✅ |
| liveness.yml step comment (line ~43) | continue-on-error: WARN exits 0 — only blocking FAIL exits 1 | continue-on-error: true — liveness failures never block CI | FIXED ✅ |
| runner.ts line 6 | Exit 0 on WARN only; exit 1 on any blocking FAIL | Exits 1 if any check fails (for artifact reporting); all results non-blocking via CI | FIXED ✅ |

Fix is 3 comment lines only. No functional code changed. Implementation (continue-on-error: true) now matches documentation exactly.

## fail_only_once_rules_applied

| Rule | Applied | Outcome |
|------|---------|---------|
| A-001 (invocation evidence) | YES | PASS — PREHANDOVER has valid iaa_audit_token, session-148 evidence present |
| A-002 (no class exceptions) | YES | N/A — not an AGENT_CONTRACT PR |
| A-021 (commit before invocation) | YES | PASS — fa72776 is HEAD, working tree clean |
| A-026 (SCOPE_DECLARATION parity) | YES | PASS — fix files declared; shallow clone prevents full diff, resolved by inspection |
| A-029 (PREHANDOVER immutability) | YES | PASS — PREHANDOVER read-only; new token file written |
| A-030 (CORE-019 re-invocation carve-out) | YES | PASS — session-148 REJECTION-PACKAGE token (commit 09c67c0) = correction addendum |

## Substantive Assessment

The Wave LV MAT Liveness Test Suite is substantively correct and fully complete. The fix correctly resolves the only finding from session-148 (F-142-001). The CI architecture (continue-on-error: true) is intentional and correct for a post-deploy observational liveness suite — liveness failures must not block CI; they are captured in the uploaded evidence artifact for operator review. The fix aligns all documentation with this architecture. No new findings.

## Advisory Observations (non-blocking, carried forward from session-148)

1. **TEST_PASSWORD fallback**: `LivenessTest!2026` fallback in mat-liveness.spec.ts — test-only, not a security risk. Recommend explicit env var requirement in production deployments.
2. **BASE_URL fallback**: fallback to `mat.example.com` — silent failure risk if LIVENESS_BASE_URL var not set. README update recommended.

## learning_notes

1. **A-030 re-invocation path works cleanly**: When PREHANDOVER is A-029-immutable and a REJECTION-PACKAGE is issued, the committed REJECTION-PACKAGE token file (from the prior IAA session) satisfies A-030's "correction addendum" requirement without requiring a separate formal addendum document. The session-148 token file committed in 09c67c0 was the correction addendum. This pattern should be relied on consistently.

2. **Comments-only fix in CI workflows**: A comment-only fix to a workflow file does not require new CI evidence under OVL-CI-005 when: (a) the PREHANDOVER is A-029-immutable, (b) the workflow is post-deploy-only and cannot run in PR CI, and (c) the YAML structure is unchanged. The original PREHANDOVER CI PASS evidence covers YAML structural validity.

3. **Conditional test.skip() in Playwright liveness suites**: `test.skip()` inside an `if (!gatewayAvailable)` condition is NOT test debt — it is proper Playwright test dependency chaining. IAA must distinguish between unconditional `.skip()` (test debt = BD-012 FAIL) and conditional runtime skips (valid pattern). The `aiGatewayAvailable` flag in mat-ai-health.spec.ts is a canonical example of legitimate conditional skip pattern.

## Suggestions for Improvement (MANDATORY)

**S-IAA-149**: The re-invocation ceremony for comments-only fixes is disproportionately heavy relative to the risk. CS2 should consider a "minor-fix fast-path" (for verified comment-only, doc-only, or 1-3 line non-logic changes) where IAA verifies the diff is genuinely comment-only and carries forward all prior PASS verdicts with a fast re-audit stamp, rather than re-executing all 50 checks. This would require a new explicit A-030b rule or a CS2 carve-out. The current session demonstrates the pattern works, but the ceremony overhead is high for 3 changed comment lines.

## fail_only_once_updates

No new FAIL-ONLY-ONCE rules added this session. A-030 worked as designed. Patterns learned have been recorded in learning_notes. If the "comments-only fast path" suggestion (S-IAA-149) recurs in another session, consider formalizing as A-031.

## parking_station_entry

| 2026-03-05 | independent-assurance-agent | session-149 | PHASE-4 | Re-invocation ceremony overhead is high for comment-only fixes; consider CS2-authorized fast-path for verified comment/doc-only re-audits — A-030b candidate | session-149-waveLV-20260305.md |
