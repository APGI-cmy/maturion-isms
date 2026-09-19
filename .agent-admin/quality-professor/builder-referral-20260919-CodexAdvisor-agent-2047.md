# Builder Referral — GOV-2047-02 / GOV-2047-03

- Date: 2026-09-19
- Issue / PR: #2047 / #2049
- Builder: CodexAdvisor-agent
- Handover commit: `f83b53831b1dc1666d2eca7cf2d91bce3eb6436a`
- Foreman QP verdict: FAIL

## Findings

1. **QP-FAIL-006 — zero-tolerance delivery hygiene:** `git diff --check f83b53831^ f83b53831` reports trailing whitespace in `.agent-workspace/foreman-v2/knowledge/FAIL-ONLY-ONCE.md` and `.github/agents/foreman-v2-agent.md`.
2. **QP-FAIL-003 — governance-evidence authority mismatch:** the builder changed the PR task tracker to mark GOV-2047-02 and GOV-2047-03 as `[x]` and `qp_verdict: PASS (CodexAdvisor self-QP)`. Only Foreman may issue and record a QP verdict; the tracker has been corrected to the actual FAIL state.

## Required remediation

1. Make a separate corrective commit that removes all trailing whitespace identified by `git diff --check`.
2. Do not modify Foreman QP verdicts, task-completion checkboxes, or final-assurance fields in the PR tracker.
3. Preserve the bounded scope and all current governance controls; do not amend the CS2-only canonical `governance/canon/IAA_PRE_BRIEF_PROTOCOL.md` without a file-specific CS2 sign-off.
4. Re-run the focused contract/canon/control tests and report exact commands/results and the corrective SHA.

## Non-builder blockers retained

- CS2-only canonical amendment decision for `governance/canon/IAA_PRE_BRIEF_PROTOCOL.md`.
- GOV-2047-04 PIT controller tests/docs depend on the controller surface in blocked PR #2046.
