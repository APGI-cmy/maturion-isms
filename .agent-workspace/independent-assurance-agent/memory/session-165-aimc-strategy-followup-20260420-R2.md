# IAA Session Memory — R2 Re-Invocation

- session_id: session-165-aimc-strategy-followup-20260420-R2
- pr_reviewed: copilot/execute-post-merge-follow-up | wave aimc-strategy-followup-20260420 (R2 re-invocation)
- overlay_applied: MIXED (GOVERNANCE_AUDIT base + non-retrospective planning artifacts — per pre-brief Phase 0 classification)
- verdict: REJECTION-PACKAGE (R2) — reference: IAA-session-165-aimc-strategy-followup-20260420-R2-REJECTED
- checks_run: 11 substance checks: 10 PASS, 1 FAIL
- learning_note: |
    NEW PATTERN — A-031 carve-out note absent after R1 fix commit.
    Pattern: IAA issues REJECTION-PACKAGE (R1) → IAA ceremony session memory committed to shared
    branch (IAA write path) → foreman applies R1 fix targeting the specific R1 finding → IAA session
    memory now appears in git diff → foreman's scope declaration does not cover it (neither Option A
    nor Option B per A-031) → A-026 FAIL at R2.
    Root cause: Foreman's R1 fix scope was narrow (only addressed the R1-identified finding).
    At R1 time, the IAA session memory had not yet been committed, so R1 could not flag it.
    Prevention: Scope declaration template should include a standard A-031 carve-out placeholder
    that activates whenever the branch has a prior IAA rejection. This eliminates the need for
    foreman to manually add the note each time. Recommend CS2 to harden the scope declaration
    template with this placeholder as a standard section.
    R1 finding resolved: suggestions-log.md correctly added to scope declaration and PREHANDOVER.
    R2 finding: IAA session memory (a5c5549) in diff but no A-031 carve-out note. Fix is trivial —
    one of two options. All other 10 checks PASS. Wave substance fully sound.

## Context

**Wave**: aimc-strategy-followup-20260420
**Branch**: copilot/execute-post-merge-follow-up
**R1 reference**: IAA-session-165-aimc-strategy-followup-20260420-R1-REJECTED
**R2 reference**: IAA-session-165-aimc-strategy-followup-20260420-R2-REJECTED
**Producing agent**: foreman-v2-agent v6.2.0

## Check Summary

| Check | Verdict |
|-------|---------|
| CERT-001 PREHANDOVER present | PASS ✅ |
| CERT-002 Session memory present | PASS ✅ |
| CERT-003 FAIL-ONLY-ONCE attested | PASS ✅ |
| CERT-004 iaa_audit_token field | PASS ✅ |
| A-001 IAA invocation evidence | PASS ✅ |
| A-015 PREHANDOVER ceremony | PASS ✅ |
| A-021 Pre-IAA commit gate | PASS ✅ |
| A-029 iaa_audit_token not PENDING | PASS ✅ |
| D3–D6 substance presence | PASS ✅ |
| CORE-020/021 framework active | PASS ✅ |
| A-026 Scope declaration parity | **FAIL ❌** |

**Generated**: 2026-04-20
**IAA Agent**: independent-assurance-agent v6.2.0
**Adoption Phase**: PHASE_B_BLOCKING
