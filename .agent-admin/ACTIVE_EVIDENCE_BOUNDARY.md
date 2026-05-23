# Agent Admin Active Evidence Boundary

**Authority**: CS2 (Johan Ras / @APGI-cmy) working model; CodexAdvisor cleanup pass  
**Date**: 2026-05-22  
**Purpose**: Separate active PR evidence from protected historical governance records.

## Boundary Rule

For active PR checks, the preferred evidence sources are PR-scoped paths:

```text
.agent-admin/prs/pr-<ACTIVE_PR_NUMBER>/active-state.json
.agent-admin/prs/pr-<ACTIVE_PR_NUMBER>/wave-current-tasks.md
.agent-admin/scope-declarations/pr-<ACTIVE_PR_NUMBER>.md
.admin/prs/pr-<ACTIVE_PR_NUMBER>.json
```

Resolver-selected paths from `active-state.json` are active evidence for that PR. Broad scans of `.agent-admin/assurance/`, `.agent-admin/prehandover/`, and `.agent-workspace/**/memory/` are legacy fallback behavior only.

## Protected History

Historical assurance tokens, wave records, prehandover proofs, ECAP bundles, and session memories are governance records. They may reference older PRs, old SHAs, rejection histories, or historical failures. Those references are not defects in the active PR unless the active PR explicitly selects that artifact as current evidence.

Do not delete or rewrite historical records to make current gates quieter. If a historical artifact is not active, route it as `ARCHIVED_CONTEXT` or `REFERENCE_ONLY`, not as current-head proof.

## Cleanup Standard

Noise cleanup must:

- preserve historical evidence;
- make active evidence deterministic and PR-scoped;
- avoid broad current-head mutation of old records;
- leave product blockers visible when they are real.

