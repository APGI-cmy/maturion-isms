# Scope Declaration — PR #<PR_NUMBER>

<!-- Version: v2.0.0 | Amended: 2026-04-29 — per-PR immutable scope declaration format; authority: CS2 — issue #1359 -->
SCOPE_SCHEMA_VERSION: v2
PR_NUMBER: <PR_NUMBER>
ISSUE: #<ISSUE_NUMBER> — <issue title>
BRANCH: <branch-name>
OWNER: <agent-or-user>
DATE_UTC: <YYYY-MM-DDTHH:MM:SSZ>

## PR Responsibility Domain
RESPONSIBILITY_DOMAIN: <single noun phrase>

## Explicitly In Scope
IN_SCOPE:
- 

## Explicitly Out of Scope
OUT_OF_SCOPE:
- Tests
- CI
- Migrations
- Email
- Logging
- Audit
- Deployment
- Infra

## Expected Verification Signal
EXPECTED_VERIFICATION:
- CI: GREEN
- TESTS: UNCHANGED | GREEN
- GOVERNANCE_GATES: GREEN

## Scope Freeze Declaration
SCOPE_FROZEN: YES

## FILES_CHANGED

FILES_CHANGED: <N>

- <path/to/file1>
- <path/to/file2>

---

*Per-PR immutable scope declaration. File: `.agent-admin/scope-declarations/pr-<PR_NUMBER>.md`.
Introduced by PR #<PR_NUMBER>. Not to be modified by subsequent PRs.*
