# Per-PR Scope Declarations

**Authority**: CS2 (@APGI-cmy) | Issue: maturion-isms#1521 | Schema: SCOPE_DECLARATION_SCHEMA.md v2.0.0

This directory holds per-PR immutable scope declarations introduced by maturion-isms#1521.

## File Naming Convention

```
pr-<PR_NUMBER>.md
```

Example: `pr-1521.md`

## Required Fields

Each file must contain these YAML-style fields at the top:

```yaml
SCOPE_SCHEMA_VERSION: v2
PR_NUMBER: <PR_NUMBER>
ISSUE: #<ISSUE_NUMBER> — <issue title>
BRANCH: <branch-name>
OWNER: <agent-or-user>
DATE_UTC: <YYYY-MM-DDTHH:MM:SSZ>
```

And these Markdown sections:

- `## PR Responsibility Domain` with `RESPONSIBILITY_DOMAIN:` field
- `## Explicitly In Scope` with `IN_SCOPE:` list
- `## Explicitly Out of Scope` with `OUT_OF_SCOPE:` list
- `## FILES_CHANGED` with `FILES_CHANGED: <N>` and file list

## Template

Use `governance/canon/scope-declaration.template.md` as the starting point.

## Rules

- One file per PR — created when the PR is opened, never modified by subsequent PRs.
- The CI gate `preflight/scope-declaration-parity` enforces existence for agent PRs.
- The root `SCOPE_DECLARATION.md` is archival — do not rewrite it for normal PRs.

## Enforcement

- **Gate A** (`ROOT-REWRITE-BLOCKED`): CI fails if `SCOPE_DECLARATION.md` is modified without a migration exemption label or CS2 waiver.
- **Gate B** (`PER-PR-SCOPE-REQUIRED`): CI fails if no `pr-<PR_NUMBER>.md` file exists for agent/Copilot PRs.
