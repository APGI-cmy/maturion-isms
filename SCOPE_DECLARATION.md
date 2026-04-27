# Scope Declaration — fix-supabase-migration-workflow-failure

**Wave**: fix-supabase-migration-workflow-failure
**Issue**: maturion-isms#1474
**Branch**: copilot/fix-supabase-migration-workflow-failure
**Date**: 2026-04-27
**Authority**: SCOPE_TO_DIFF_RULE.md, MERGE_GATE_PHILOSOPHY.md (BL-027)

## Scope Decision

Infrastructure fix: replace direct `psql` (unreachable from GitHub-hosted runners) with the
Supabase Management API in the protected MMM migration workflow. Covers the legacy/AIMC
cross-app exception path and the schema-verification step. No application source changes.

## Changed Files

- `.github/scripts/supabase-mgmt-api.sh`
- `.github/workflows/deploy-mmm-supabase-migrations.yml`
- `SCOPE_DECLARATION.md`
- `modules/MMM/_readiness/deployment-execution-contract.md`

## Out of Scope

- Any governance workspace artifacts (.agent-workspace/, .agent-admin/)
- Any agent contract files (.github/agents/*.md)
- Any files not listed above
