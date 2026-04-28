# Scope Declaration — add-issue-mismatch-validation-20260428

**Wave**: add-issue-mismatch-validation-20260428
**Issue**: maturion-isms#1486
**Branch**: copilot/add-issue-mismatch-validation
**Date**: 2026-04-28
**Authority**: SCOPE_TO_DIFF_RULE.md, MERGE_GATE_PHILOSOPHY.md (BL-027)

## Scope Decision

Add ISSUE-MISMATCH validation (Check 6) to the governance evidence exactness gate so that
stale issue-authority references in SCOPE_DECLARATION.md are caught automatically before
review or merge. The new check:
- Parses the `**Issue**:` line from root `SCOPE_DECLARATION.md`
- Accepts either bare `NNN` or `maturion-isms#NNN`, normalizing bare numbers to
  `maturion-isms#NNN`
- Compares against `EXPECTED_ISSUE` env var when supplied (CI derives it from a
  `Governing-Issue:` control field in the PR body)
- Fails with a clear `ISSUE-MISMATCH` message when stale, missing, or malformed
- Warns (format-only pass) when no expected authority can be determined

## Changed Files

- `.github/scripts/validate-governance-evidence-exactness.sh`
- `.github/workflows/preflight-evidence-gate.yml`
- `governance/design/evidence-exactness-proof-of-operation-20260422.md`
- `governance/templates/execution-ceremony-admin/PREHANDOVER.template.md`
- `SCOPE_DECLARATION.md`

## Out of Scope

- Any agent contract files (.github/agents/*.md)
- Any application code or schema migrations
- Weakening existing PATH/COUNT/HASH/VERSION-MISMATCH gates
- Replacing SCOPE_DECLARATION.md with a different artifact
- Broad redesign of issue/PR linking outside the scope declaration authority check
