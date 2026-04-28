# Scope Declaration — add-issue-mismatch-validation-20260428

**Wave**: add-issue-mismatch-validation-20260428
**Issue**: maturion-isms#1490
**Branch**: copilot/add-issue-mismatch-validation
**Date**: 2026-04-28
**Authority**: SCOPE_TO_DIFF_RULE.md, MERGE_GATE_PHILOSOPHY.md (BL-027)

## Scope Decision

Document the ISSUE-MISMATCH (Check 6) defect class in governance evidence artifacts
(proof-of-operation doc and PREHANDOVER template).

## Changed Files

- `governance/design/evidence-exactness-proof-of-operation-20260422.md` - Add ISSUE-MISMATCH to defect class coverage map and detection examples
- `governance/templates/execution-ceremony-admin/PREHANDOVER.template.md` - Add ISSUE-MISMATCH (Check 6) row to Evidence Exactness Gate defect class table
- `SCOPE_DECLARATION.md` - Updated for this wave

## Out of Scope

- Any application code or schema migrations
- Any agent contract files (.github/agents/*.md)
- Weakening existing PATH/COUNT/HASH/VERSION-MISMATCH gates
- Any files not listed above
