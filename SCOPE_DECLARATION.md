# Scope Declaration — fix-mmm-migration-workflow-20260427

**Wave**: fix-mmm-migration-workflow-20260427
**Issue**: maturion-isms#1479
**Branch**: copilot/fix-mmm-migration-workflow
**Date**: 2026-04-27
**Authority**: SCOPE_TO_DIFF_RULE.md, MERGE_GATE_PHILOSOPHY.md (BL-027)

## Scope Decision

Remove unsupported `--project-ref` flag from `supabase db push` in the MMM migration workflow.
The project is already linked via `supabase link --project-ref` in the prior step, so `db push`
should rely on the linked project context rather than passing the unsupported flag.

## Changed Files

- `.github/workflows/deploy-mmm-supabase-migrations.yml`
- `SCOPE_DECLARATION.md`

## Out of Scope

- Any agent contract files (.github/agents/*.md)
- Any application code or schema migrations
- Any files not listed above

