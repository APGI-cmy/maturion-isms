# Scope Declaration — governed-supabase-access-model-20260428

**Wave**: governed-supabase-access-model-20260428
**Issue**: maturion-isms#1504
**Branch**: copilot/add-supabase-migration-verification-model
**Date**: 2026-04-28
**Last refreshed**: 2026-04-28 (post-final-edit scope refresh per §4.3g / AAP-28)
**Authority**: SCOPE_TO_DIFF_RULE.md, MERGE_GATE_PHILOSOPHY.md (BL-027)

## Scope Decision

Implement a governed two-path Supabase access model: (1) mutation path via approved migration
workflows only; (2) read-only verification path through a new `governance_readonly` schema
with SECURITY DEFINER RPCs. Adds a GitHub Actions workflow `verify-supabase-readonly.yml`
for agents to trigger allowlisted read-only checks. Initial verification use case: MPS
source-pack status for maturion-isms#1501. Includes documentation of when CS2 action is
required vs agent self-service.

## Changed Files

- `SCOPE_DECLARATION.md` - Updated for this wave (per §4.3g scope refresh)
- `supabase/migrations/20260428000001_mmm_governance_readonly.sql` - Migration: creates `governance_readonly` schema, `verification_log` table, `log_verification_call` audit helper, and five SECURITY DEFINER read-only RPCs for MPS source-pack verification; GRANTs EXECUTE to `service_role` only
- `.github/workflows/verify-supabase-readonly.yml` - New workflow: governed read-only verification via `workflow_dispatch`; allowlisted RPC calls only; publishes sanitized job summary as durable evidence; fails on empty/error result
- `docs/supabase/SUPABASE_GOVERNED_ACCESS_MODEL.md` - New documentation: two-path access model, mutation path vs verification path, MPS source-pack verification guide, schema reference, when CS2 action is required vs agent self-service

## Out of Scope

- Any changes to `deploy-mmm-supabase-migrations.yml` (mutation workflow is unchanged)
- Any app source code outside `supabase/migrations/`
- Any agent contract files
- Any governance canon files
