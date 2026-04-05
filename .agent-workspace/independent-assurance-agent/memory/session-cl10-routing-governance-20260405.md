---
session_id: session-cl10-routing-governance-20260405
date: 2026-04-05
pr_reviewed: "copilot/cl-10-routing-governance-ci-enforcement (issue #1227)"
invoking_agent: foreman-v2-agent
producing_agent: "qa-builder (D1), integration-builder (D2+D3)"
producing_agent_class: "builder"
pr_category: "CI_WORKFLOW (primary) + AAWP_MAT (D1 test)"
checks_executed: 36
checks_passed: 30
checks_failed: 6
merge_gate_parity_result: FAIL
verdict: REJECTION-PACKAGE
token_reference: "REJECTION-PACKAGE — IAA-session-cl10-routing-governance-20260405-REJECTION"
adoption_phase_at_time_of_verdict: PHASE_B_BLOCKING
prior_sessions_reviewed:
  - session-wave20-atomic-write-back-20260318-R2
  - session-wave20-atomic-write-back-20260318
  - session-wave19-orchestration-20260317-R2
  - session-wave19-orchestration-20260317
  - session-waveOVLINJ-20260307
---

# IAA Session Memory — CL-10 Routing Governance CI Enforcement

## Invocation Summary

Wave CL-10 delivers three deliverables:
- CL-10-D1: RED gate test file (qa-builder) — 9 tests T-C-010-001 through T-C-010-009
- CL-10-D2: routing-governance-check.yml CI workflow (integration-builder)
- CL-10-D3: stub-detection-check.yml CI workflow (integration-builder)

Technical substance is HIGH QUALITY. All 9 tests GREEN. Both workflows YAML-valid.
Baseline clean. CL10-FFA-001 through CL10-FFA-007 all PASS.

## Failures Cited

1. **CORE-013 FAIL**: integration-builder PREHANDOVER and Foreman PREHANDOVER
   exist on disk but are NOT committed to git. A-033 rule enforced.

2. **CORE-015 FAIL**: Foreman session memory exists on disk but NOT committed to git.
   Also: SCOPE_DECLARATION modified but not committed (shows `M` in git status).

3. **CORE-018 FAIL**: Incomplete evidence sweep — three ceremony artifacts not in git,
   one file modified but not committed. CORE-018 triggers REJECTION-PACKAGE on ANY absence.

4. **FAIL-ONLY-ONCE A-001/A-033 FAIL**: Same pattern as Wave 20 R1. Disk-only artifacts.
   The A-033 rule was established specifically for this pattern (Wave 20 learning).
   Third recurrence now recorded.

5. **OVL-CI-005 FAIL**: D2 triggers on this PR (modules/mat/tests/ satisfies modules/**).
   D3 triggers on all PRs. S-033 self-referential exception does NOT apply.
   CI run evidence required but not provided. Integration-builder PREHANDOVER not committed.

## Fix Sequence Required

1. Ceremony commit: add integration-builder PREHANDOVER + Foreman PREHANDOVER + Foreman
   session memory + SCOPE_DECLARATION to git and commit.
2. OVL-CI-005 resolution: (recommended) add workflow_dispatch to D2 + D3, invoke S-033
   exception in integration-builder PREHANDOVER with YAML + pattern parity evidence, commit.
3. Commit this IAA token file.
4. Re-invoke IAA.

## FAIL-ONLY-ONCE Learning Applied

- A-001: Applied — D2+D3 evidence chain broken (integration-builder PREHANDOVER not committed)
- A-002: Applied — no class exemption claimed; confirmed PASS
- A-033: Applied — git-not-disk rule. Three ceremony artifacts on disk only.

fail_only_once_updates:
  - "A-033 recurrence pattern: Wave 18 (initial), Wave 20 R1, and now CL-10. Consider
     adding an explicit pre-invocation checklist step: 'Run git ls-files for every artifact
     listed in the SCOPE_DECLARATION before invoking IAA.' This would catch the pattern
     before IAA is called rather than during the audit."

## Learning Notes

1. **D2 path trigger analysis**: The `modules/**` path trigger in routing-governance-check.yml
   catches not just production code but also test files under `modules/`. IAA must assess
   path triggers holistically — a test file like `modules/mat/tests/...` satisfies `modules/**`
   and defeats the S-033 self-referential exception claim. Integration-builder should be aware
   that adding workflow path triggers for `modules/` means the workflow fires when test files
   in `modules/` change.

2. **A-033 third recurrence**: The disk-not-git pattern has now appeared in Wave 18, Wave 20 R1,
   and CL-10. The correct ceremony sequence (from Wave 20 learning note) is: build → commit
   PREHANDOVER → commit session memory → update SCOPE_DECLARATION → commit all → push → invoke IAA.
   Foreman should add a mandatory pre-IAA-invocation step: `git ls-files <all ceremony artifacts>`
   before calling IAA. If any return empty, the ceremony commit is incomplete.

3. **Technical delivery quality**: CL-10 technical substance is correct and well-implemented.
   The failure is purely ceremony. This is a positive sign — the build quality is improving
   while the ceremony discipline needs one more iteration.

4. **OVL-CI-005 and path triggers**: When designing CI workflows with `paths:` filters,
   designers should note that test files under `modules/` trigger `modules/**`. If a workflow
   is intended to be self-referential (not triggered by the PR that creates it), the path
   filter must exclude test file paths OR the workflow creator must obtain CI evidence before
   IAA invocation.

## Prior Open Rejection Packages Checked

- Wave 19 R1, R2: resolved at R3 (token: IAA-session-wave19-orchestration-20260317-R3-PASS) ✅
- Wave 20 R1: resolved at R2 ✅
- No open items from prior sessions carried forward.

## Suggestions for Improvement

1. **Pre-IAA git checklist**: Before invoking IAA, Foreman should run a mandatory git
   verification script: `git ls-files $(cat SCOPE_DECLARATION.md | grep -oP '\.\S+\.(md|ts|yml)')`
   to confirm every listed artifact is tracked. If any returns empty → ceremony commit incomplete.
   A shell script or Makefile target could automate this.

2. **workflow_dispatch on all new CI workflows**: Any new `.github/workflows/` file should
   include `workflow_dispatch:` as a default trigger alongside its primary trigger. This enables
   CS2 to manually validate workflows post-merge and satisfies the S-033 exception's third
   condition without requiring a live CI run before IAA review.

3. **Path trigger scoping awareness**: When designing `paths:` filters, document whether the
   filter is intended to be self-referential. A comment in the workflow YAML stating
   `# Note: This workflow fires when modules/ test files change (not self-referential)` would
   help the integration-builder and IAA align on CI evidence requirements.
---

## Token File Written

`.agent-admin/assurance/iaa-token-session-cl10-routing-governance-20260405.md` — REJECTION-PACKAGE

PREHANDOVER proofs: qa-builder PREHANDOVER is immutable post-commit (SHA 501779e).
integration-builder and Foreman PREHANDOVERs are NOT yet committed — they must be committed
as-is (without modification) and a resolution ceremony performed per the fix sequence above.
