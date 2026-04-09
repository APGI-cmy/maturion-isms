# CodexAdvisor — ECAP Agent Factory Rollout Notes

## Scope

This note records the minimum agent-factory changes required for ECAP downstream completion.

## New contract introduced

- `.github/agents/execution-ceremony-admin-agent.md`

## Still expected in a later safe contract-normalization pass

- Add `execution-ceremony-admin-agent` to Foreman delegable-role language
- Add explicit three-role split wording to IAA contract text
- Add explicit registry/update wording to CodexAdvisor contract text

## Why these follow-on edits were not force-written here

The existing Foreman / IAA / CodexAdvisor contracts are large protected files. A safe amendment pass should be executed as a deliberate contract-normalization wave rather than a blind whole-file rewrite.

## AGCFPP-001 reminders

- `.github/agents/` remains a protected surface
- CodexAdvisor + CS2 approval still governs amendments
- IAA audit remains mandatory for agent-contract PRs
