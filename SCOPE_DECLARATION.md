# Scope Declaration — decouple-supabase-db-ops-20260424

**Wave**: decouple-supabase-db-ops-20260424
**Issue**: maturion-isms#1466
**Branch**: copilot/decouple-supabase-db-operations
**Date**: 2026-04-24
**Authority**: SCOPE_TO_DIFF_RULE.md, MERGE_GATE_PHILOSOPHY.md (BL-027)

## Scope Decision

Decouple live Supabase DB operations from the MMM Vercel deploy workflow.
Patch `deploy-mmm-vercel.yml` to gate DB jobs behind `workflow_dispatch + main` only
and remove them from frontend deploy dependencies. Fix FAILED_MIGRATION tracking bug.
Introduce `deploy-mmm-supabase-migrations.yml` as the dedicated protected migration path.

## Changed Files

### Added

- `.github/workflows/deploy-mmm-supabase-migrations.yml` - Dedicated protected workflow for live Supabase DB migrations

### Modified

- `.github/workflows/deploy-mmm-vercel.yml` - Gate DB jobs behind workflow_dispatch+main; decouple deploy-preview/deploy-production from DB jobs; fix FAILED_MIGRATION bug
- `SCOPE_DECLARATION.md` - This file

## Out of Scope

- Any files not listed above
