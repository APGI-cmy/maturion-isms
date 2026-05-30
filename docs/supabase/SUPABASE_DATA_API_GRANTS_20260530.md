# Supabase Data API Grants and Security Advisor Hardening

**Wave**: supabase-data-api-grants-20260530  
**Date**: 2026-05-30  
**Project ref**: `ujucvyyspfxlxlfdamda`  
**Status**: Proposed via PR; deploy through normal Supabase migration workflow

## Why this exists

Supabase is changing default Data API exposure for new `public` schema tables. Tables that are meant to be accessed through PostgREST, GraphQL, or `supabase-js` must now carry explicit grants for the relevant client roles.

This repo already uses RLS on the relevant MMM subject-knowledge tables. The missing piece was explicit table-level Data API grants for `authenticated`.

## Migrations added

### `20260530000001_mmm_explicit_data_api_grants.sql`

Adds explicit authenticated Data API grants for:

- `public.mmm_subject_knowledge_documents`
- `public.ai_knowledge`
- `public.mmm_subject_knowledge_migration_runs`
- `public.mmm_criteria_learning_events`
- `public.mmm_criteria_deferred_queue`

It also adds `ai_knowledge_org_delete`, because `apps/mmm/src/pages/OrganisationContextPage.tsx` currently archives a source document and removes related `ai_knowledge` chunks directly through `supabase-js`.

### `20260530000002_mmm_security_advisor_hardening.sql`

Addresses conservative Security Advisor findings observed on 2026-05-30:

- Enables RLS on public tables reported as exposed without RLS.
- Removes client-role access from migration tracking tables.
- Adds authenticated read-only access for low-risk support/reference tables where needed.
- Sets flagged public views to `security_invoker = true`.
- Revokes anonymous/public direct RPC execution from sensitive `SECURITY DEFINER` helpers.

## Post-deploy verification

After merge and migration deployment, run the normal workflow checks:

```bash
supabase db push
supabase db diff --linked
```

Then verify the relevant app flows:

1. Log in as an authenticated MMM user.
2. Open Organisation Context.
3. Confirm existing source documents load.
4. Upload a source document to the `mmm-subject-knowledge` bucket.
5. Confirm the document ledger row appears and the automatic reprocess call completes.
6. Archive/delete a source document and confirm associated `ai_knowledge` chunks are removed or no longer visible.
7. Re-run Supabase Security Advisor and confirm the RLS-disabled table findings and SECURITY DEFINER view findings are cleared.

## Important note

These migrations intentionally do not grant access to `anon` for the MMM subject-knowledge tables. The expected path is authenticated access with RLS enforcing organisation isolation.
