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
| `checks_failed` | 1 |
| `merge_gate_parity_result` | FAIL — F-149-001 (CodeQL: missing GITHUB_TOKEN permissions block) |
| `verdict` | REJECTION-PACKAGE |
| `token_reference` | N/A — REJECTION-PACKAGE issued |
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

## failures_cited

| Finding ID | Check | Description | Fix Required |
|-----------|-------|-------------|-------------|
| F-149-001 | CodeQL: actions/missing-workflow-permissions | liveness.yml job `liveness` (line 22-86) has no explicit `permissions:` block. GITHUB_TOKEN defaults to over-broad permissions. CodeQL alert: `actions/missing-workflow-permissions`. | Add `permissions: contents: read` to the liveness job definition in .github/workflows/liveness.yml. |

## Supersession Notice

⚠️ A premature ASSURANCE-TOKEN was committed to `.agent-admin/assurance/iaa-token-session-142-waveLV-20260305.md` before the mandatory codeql_checker step completed. That token is REVOKED by `.agent-admin/assurance/iaa-rejection-session-149-waveLV-20260305.md`. The REJECTION-PACKAGE is the operative verdict.

## Substantive Assessment

The Wave LV MAT Liveness Test Suite is substantively correct and fully complete. F-142-001 is RESOLVED. One new finding surfaced by CodeQL: missing explicit GITHUB_TOKEN permissions block in liveness.yml. This is a principle-of-least-privilege security requirement. Fix is a 2-line addition to liveness.yml. On re-invocation after fix, ASSURANCE-TOKEN is expected immediately (only F-149-001 remains).

## Advisory Observations (non-blocking, carried forward from session-148)

1. **TEST_PASSWORD fallback**: `LivenessTest!2026` fallback in mat-liveness.spec.ts — test-only, not a security risk. Recommend explicit env var requirement in production deployments.
2. **BASE_URL fallback**: fallback to `mat.example.com` — silent failure risk if LIVENESS_BASE_URL var not set. README update recommended.

## learning_notes

1. **A-030 re-invocation path works cleanly**: When PREHANDOVER is A-029-immutable and a REJECTION-PACKAGE is issued, the committed REJECTION-PACKAGE token file (from the prior IAA session) satisfies A-030's "correction addendum" requirement without requiring a separate formal addendum document. The session-148 token file committed in 09c67c0 was the correction addendum. This pattern should be relied on consistently.

2. **Comments-only fix in CI workflows**: A comment-only fix to a workflow file does not require new CI evidence under OVL-CI-005 when: (a) the PREHANDOVER is A-029-immutable, (b) the workflow is post-deploy-only and cannot run in PR CI, and (c) the YAML structure is unchanged. The original PREHANDOVER CI PASS evidence covers YAML structural validity.

4. **Missing GITHUB_TOKEN permissions block is a standalone check gap**: Session-148 passed BD-016 (no hardcoded secrets) but didn't surface the missing `permissions:` block. CodeQL's `actions/missing-workflow-permissions` check is specifically designed to catch this. Future CI workflow reviews must include an explicit check: "Does every job in the workflow have an explicit `permissions:` block?" This should be added as OVL-CI-006 or a new FAIL-ONLY-ONCE rule A-031.

## Suggestions for Improvement (MANDATORY)

**S-IAA-149a**: The re-invocation ceremony for comments-only fixes is disproportionately heavy relative to the risk. CS2 should consider a "minor-fix fast-path" for verified comment-only, doc-only, or 1-3 line non-logic changes where IAA carries forward all prior PASS verdicts with a fast re-audit stamp. This would require a new explicit rule or CS2 carve-out.

**S-IAA-149b**: OVL-CI should include an explicit check (OVL-CI-006 candidate): "Every workflow job must declare an explicit `permissions:` block with minimal required permissions." This check should be added to the CI_WORKFLOW overlay to prevent missing-permissions issues from bypassing BD-016 (which focuses on hardcoded secrets, not token permissions). Codify as FAIL-ONLY-ONCE A-031: "GitHub Actions workflow jobs must declare explicit `permissions:` blocks — missing permissions block = FAIL."

## fail_only_once_updates

**A-031 PROPOSED** (from session-149 finding F-149-001):
> "GitHub Actions workflow jobs must declare explicit `permissions:` blocks limiting GITHUB_TOKEN to minimum required. A job without a `permissions:` block inherits repository defaults (potentially write access). Fix: add `permissions: contents: read` (or minimum required). Checked via CodeQL `actions/missing-workflow-permissions`. Failure to declare = REJECTION-PACKAGE. Category: OVL-CI-WORKFLOW."
>
> Status: PROPOSED — pending CS2 approval to add to FAIL-ONLY-ONCE registry as A-031 and to iaa-category-overlays.md as OVL-CI-006.

## parking_station_entry

| 2026-03-05 | independent-assurance-agent | session-149 | PHASE-4 | OVL-CI-006 candidate: GitHub Actions jobs must have explicit permissions block (CodeQL: missing-workflow-permissions) — F-149-001 | session-149-waveLV-20260305.md |
| 2026-03-05 | independent-assurance-agent | session-149 | PHASE-4 | Re-invocation ceremony overhead is high for comment-only fixes; consider CS2-authorized fast-path for verified comment/doc-only re-audits — A-030b candidate | session-149-waveLV-20260305.md |
