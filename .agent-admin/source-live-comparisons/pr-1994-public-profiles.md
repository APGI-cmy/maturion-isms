# PR #1994 — public.profiles Source / Live Comparison

## Provenance

The active root migration inventory did not contain a committed `public.profiles` source. Historical ISMS/MAT source records establish the table family; the recovery narrows that history to the current shared foundation contract only.

## Recovered source contract

| Contract area | Recovered definition |
| --- | --- |
| Columns | `id`, `organisation_id`, `display_name`, `email`, `language`, `theme`, `role`, `created_at`, `updated_at`, `full_name`, `preferences` |
| Defaults | `language='en'`, `theme='light'`, `role='viewer'`, timestamps `now()`, preferences `'{}'::jsonb` |
| Foreign keys | `id → auth.users(id) ON DELETE CASCADE`; `organisation_id → public.organisations(id)` |
| Security | RLS enabled; self-only SELECT, INSERT, and UPDATE policies using `auth.uid() = id` |
| Ordering | after `20260610180000_isms_w6_persistence_audit.sql`; before `20260722102655_pit_stage12_slice4_project_persistence.sql` |

## Automatic preview exception

The repository-managed Supabase Git integration automatically created a non-production empty-data preview branch after the draft PR opened and processed the recovered migration. This branch is not a clean bootstrap and is not validation evidence for this recovery.

Read-only production confirmation: APGI-cmy’s Project does not record `20260615000000_public_profiles_root_provenance`.

## Deliberate exclusions

No legacy MAT `audits`, `domains`, `criteria`, triggers, storage, broad grants, runtime behaviour, or product data model is recovered.

## Non-mutation statement

No operator-directed SQL was applied and no production migration occurred. APGI-cmy’s Project, PR #1986, and PR #1981 were not changed by this PR.
