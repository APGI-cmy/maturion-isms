# Scope Declaration — harden-deploy-mmm-supabase-migrations-20260427

**Wave**: harden-deploy-mmm-supabase-migrations-20260427
**Issue**: maturion-isms — "Foreman: harden Deploy MMM Supabase Migrations workflow end-to-end until it passes"
**Branch**: copilot/harden-deploy-mmm-supabase-migrations
**Date**: 2026-04-27
**Authority**: SCOPE_TO_DIFF_RULE.md, MERGE_GATE_PHILOSOPHY.md (BL-027)

## Scope Decision

Replace the interactive `supabase link + supabase db push` mechanism with the proven
Management API approach (apply-migrations-via-api.py) to make MMM-native migrations
non-interactive and eliminate the SASL auth/password failure.

## Changed Files

- `.github/workflows/deploy-mmm-supabase-migrations.yml`
- `SCOPE_DECLARATION.md`
- `.agent-workspace/foreman-v2/personal/wave-current-tasks.md`
- `.agent-workspace/foreman-v2/personal/scope-declaration-wave-harden-deploy-mmm-supabase-migrations-20260427.md`
- `.agent-admin/assurance/iaa-wave-record-harden-deploy-mmm-supabase-migrations-20260427.md`
- `.agent-workspace/foreman-v2/memory/PREHANDOVER-session-075-harden-deploy-mmm-supabase-migrations-20260427.md`
- `.agent-workspace/foreman-v2/memory/session-075-20260427.md`
- `.agent-admin/prehandover/proof-session-075-harden-deploy-mmm-supabase-migrations-20260427.md`

## Out of Scope

- Any agent contract files (.github/agents/*.md)
- Any application code or schema migrations
- Any files not listed above
