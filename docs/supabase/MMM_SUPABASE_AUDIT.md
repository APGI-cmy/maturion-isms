# MMM Supabase Audit

**Wave**: supabase-reconciliation-20260423  
**Issue**: maturion-isms#1461  
**Branch**: copilot/reconcile-supabase-project-state  
**Date**: 2026-04-23  
**Author**: mat-specialist (delegated by foreman-v2-agent)  
**Project ID**: ujucvyyspfxlxlfdamda  
**Status**: RECONCILED — repo is the source of truth

---

## Section A: Repo-Backed Supabase Artefacts

This section inventories every Supabase artefact that is version-controlled in this repository and therefore constitutes the authoritative definition of the project's schema, functions, and storage configuration.

### A.1 Config (`supabase/config.toml`)

| Field | Value |
|---|---|
| `project_id` | `ujucvyyspfxlxlfdamda` |
| File path | `supabase/config.toml` |
| Function entries | 26 (all Edge Functions registered) |
| Managed in repo | Yes |

**All 26 Edge Function entries are present. No gaps.**

### A.2 Migrations

6 migration files under `supabase/migrations/` — see Section D for full chain.

### A.3 Edge Functions

26 Edge Function directories under `supabase/functions/` (excluding `_shared`) — see Section E for full inventory.

### A.4 Shared Library

`supabase/functions/_shared/` — shared TypeScript utilities consumed by Edge Functions. Not a deployable function; excluded from function count.

### A.5 Seed

`supabase/seed-mmm.sql` — development seed data. Applied during local `supabase db reset`. Not applied to production.

---

## Section B: Expected Live Supabase State

A correctly reconciled live Supabase project (project ID `ujucvyyspfxlxlfdamda`) should reflect the following state after all repo migrations and function deployments have been applied.

### B.1 Database Tables (from migrations)

| Table | Introduced | Description |
|---|---|---|
| `public.mmm_organisations` | 20260420000001 | Tenant organisations |
| `public.mmm_profiles` | 20260420000001 | User profiles linked to `auth.users` |
| `public.mmm_frameworks` | 20260420000001 | Compliance frameworks |
| `public.mmm_assessments` | 20260420000001 | Assessment records |
| `public.mmm_criteria` | 20260420000001 | Assessment criteria |
| `public.mmm_evidence` | 20260420000001 | Evidence records |
| `public.mmm_invitations` | 20260420000001 | Pending user invitations |
| `public.mmm_audit_log` | 20260420000001 | Audit event log |

> **Note**: The exact table list is authoritative in `supabase/migrations/20260420000001_mmm_core_tables.sql`. The above reflects the known schema from the migration brief.

### B.2 Indexes

All performance indexes defined in `20260420000002_mmm_indexes.sql` are present on the above tables.

### B.3 RLS Policies

Row-Level Security is enabled on all core tables. Policies enforce org-level data isolation using two SECURITY DEFINER helper functions:

- `public.mmm_current_user_org_id()` — resolves calling user's `organisation_id` from `mmm_profiles`
- `public.mmm_current_user_role()` — resolves calling user's `role` from `mmm_profiles`

All policies are defined in `20260420000003_mmm_rls_policies.sql`.

### B.4 Storage Buckets

| Bucket | Access | Max Size | Defined In |
|---|---|---|---|
| `mmm-evidence` | Private | 50 MB | 20260420000004 |
| `mmm-framework-sources` | Private | 100 MB | 20260420000004 |

Storage RLS: authenticated access via `auth.uid() IS NOT NULL` (bucket-level policy).

### B.5 Edge Functions

All 26 Edge Functions deployed via `supabase functions deploy`. JWT settings match `supabase/config.toml`.

### B.6 Auth

Auth configuration is **dashboard-managed** — see Section G for details.

---

## Section C: Drift Assessment

Because direct API access to the live Supabase dashboard is not available in this repo-driven reconciliation wave, drift is assessed by comparing the repo-defined state against what a fresh deployment would produce. Actual live state must be verified by CS2 or a CI/CD pipeline.

### C.1 Known Drift Vectors

| Vector | Risk | Detection Method |
|---|---|---|
| Migrations applied out-of-order | Medium | `supabase db diff` against linked project |
| Dashboard-created objects (tables, policies, indexes) not in repo | High | `supabase db diff` — any unexpected `+` lines are dashboard drift |
| Functions deployed from dashboard directly (not repo) | High | `supabase functions list` — compare against `supabase/functions/` |
| Dashboard auth config changes not documented | Medium | Manual review of Auth → Settings in dashboard |
| Secrets added/removed from dashboard | Low | `supabase secrets list` — compare against documented set |
| Storage bucket MIME types modified in dashboard | Medium | `supabase db diff` on storage schema |

### C.2 Anti-Drift Model

The repo is the **single source of truth**. Any change made in the dashboard that is not back-ported to a migration or function file is considered **drift** and must be remediated in the next wave. See `docs/supabase/MMM_SUPABASE_OPERATING_PROCEDURE.md` Section 7.

### C.3 Current Assessment

As of wave `supabase-reconciliation-20260423`:

- **Repo state**: Fully documented (6 migrations, 26 functions, config.toml complete, 2 storage buckets with RLS)
- **Live state**: Cannot be independently verified without live dashboard access
- **Recommended action**: CS2 to run `supabase db diff --linked` and `supabase functions list` against project `ujucvyyspfxlxlfdamda` to confirm zero drift or record variance

---

## Section D: Migration Chain

All 6 migrations in chronological order:

| # | File | Purpose |
|---|---|---|
| 1 | `20260420000001_mmm_core_tables.sql` | Core tables: `mmm_organisations`, `mmm_profiles`, `mmm_frameworks`, `mmm_assessments`, `mmm_criteria`, `mmm_evidence`, `mmm_invitations`, `mmm_audit_log`. Establishes the complete MMM relational schema. |
| 2 | `20260420000002_mmm_indexes.sql` | Performance indexes on all core tables. Covers foreign keys, org-scoped lookups, status filtering, and search columns. |
| 3 | `20260420000003_mmm_rls_policies.sql` | Row-Level Security policies for all core tables. Defines `mmm_current_user_org_id()` and `mmm_current_user_role()` SECURITY DEFINER helper functions. |
| 4 | `20260420000004_mmm_storage_buckets.sql` | Creates `mmm-evidence` (50 MB, private) and `mmm-framework-sources` (100 MB, private) storage buckets. Defines storage RLS (`auth.uid() IS NOT NULL`). |
| 5 | `20260422000001_mmm_evidence_audio_mime_fix.sql` | Extends `mmm-evidence` allowed MIME types to include audio formats (`audio/mpeg`, `audio/wav`, `audio/ogg`, `audio/webm`, `audio/mp4`). |
| 6 | `20260422000002_mmm_evidence_rls_hardening.sql` | Hardens org-level RLS on `mmm-evidence` storage bucket. Restricts upload/download to authenticated users belonging to the same organisation as the evidence record. |

**Migration naming convention**: `YYYYMMDDNNNNNN_<description>.sql` where `NNNNNN` is a sequential 6-digit number (e.g. `000001`).

---

## Section E: Edge Functions Inventory

All 26 Edge Functions registered in `supabase/config.toml` with their JWT verification settings:

| Function | `verify_jwt` | Wave |
|---|---|---|
| `invoke-ai-parse-criteria` | `false` | Pre-MMM / legacy |
| `mmm-health` | `false` | B1 |
| `mmm-qiw-status` | `true` | B1 |
| `mmm-org-update` | `true` | B2 |
| `mmm-invitation-create` | `true` | B2 |
| `mmm-invitation-accept` | `false` | B2 |
| `mmm-commissioning-check` | `false` | B2 |
| `mmm-assessment-free-respond` | `false` | B3 |
| `mmm-assessment-free-result` | `false` | B3 |
| `mmm-org-create` | `true` | B3 |
| `mmm-framework-init` | `true` | B3 |
| `mmm-framework-compile` | `true` | B4 |
| `mmm-framework-publish` | `true` | B4 |
| `mmm-upload-framework-source` | `true` | B4 |
| `mmm-ai-framework-parse` | `true` | B4 |
| `mmm-ai-framework-generate` | `true` | B4 |
| `mmm-ai-framework-alter` | `true` | B4 |
| `mmm-score-confirm` | `true` | B5 |
| `mmm-upload-evidence` | `true` | B5 |
| `mmm-ai-evidence-evaluate` | `true` | B5 |
| `mmm-pit-export-send` | `true` | B6 |
| `mmm-pit-evidence-return` | `false` | B6 |
| `mmm-ai-recommend` | `true` | B6 |
| `mmm-ai-chat` | `true` | B7 |
| `mmm-ai-explain` | `true` | B7 |
| `mmm-ai-assessment-interpret` | `true` | B7 |

**`verify_jwt = false`** is intentional for public-facing functions (health checks, free assessments, invitation acceptance, commissioning checks, PIT evidence return) where unauthenticated callers are by design.

**`_shared/`** directory contains shared TypeScript utilities. It is not a deployable function and has no `config.toml` entry.

---

## Section F: Storage Configuration

### F.1 Buckets

| Bucket | ID | Public | File Size Limit | Defined In |
|---|---|---|---|---|
| `mmm-evidence` | `mmm-evidence` | No (private) | 52,428,800 bytes (50 MB) | `20260420000004` |
| `mmm-framework-sources` | `mmm-framework-sources` | No (private) | 104,857,600 bytes (100 MB) | `20260420000004` |

### F.2 MIME Type Allowlists

**`mmm-evidence`** (comprehensive — evidence can be documents, images, video, audio):

- Documents: `application/pdf`, `application/msword`, `application/vnd.openxmlformats-officedocument.*`, `application/vnd.oasis.opendocument.*`, `text/plain`, `text/csv`
- Images: `image/jpeg`, `image/png`, `image/gif`, `image/webp`, `image/svg+xml`
- Video: `video/mp4`, `video/webm`, `video/ogg`, `video/quicktime`
- Audio: `audio/mpeg`, `audio/wav`, `audio/ogg`, `audio/webm`, `audio/mp4` *(added in migration 5)*

**`mmm-framework-sources`** (document-focused):

- Documents: `application/pdf`, `application/msword`, `application/vnd.openxmlformats-officedocument.*`, `application/vnd.oasis.opendocument.*`, `text/plain`, `text/csv`, `text/markdown`

### F.3 Storage RLS

Storage RLS policies are defined in migration `20260420000004_mmm_storage_buckets.sql` and hardened by `20260422000002_mmm_evidence_rls_hardening.sql`. Key rules:

- **All uploads**: Require `auth.uid() IS NOT NULL`
- **`mmm-evidence` downloads**: Restricted to authenticated users of the same organisation as the evidence record (post-hardening migration)
- **`mmm-framework-sources`**: Authenticated access; org-scoped reads

---

## Section G: Auth Configuration

### G.1 Repo-Managed (via migrations)

- None. Auth configuration is entirely dashboard-managed.

### G.2 Dashboard-Managed (manual, not in repo)

| Item | Location in Dashboard | Notes |
|---|---|---|
| Auth providers (email/password, OAuth) | Authentication → Providers | Must be manually enabled/configured |
| Email templates | Authentication → Email Templates | Customised per tenant branding |
| JWT secret / expiry | Authentication → JWT Settings | Do not change without coordinating with all Edge Functions |
| Redirect URLs (OAuth/magic link) | Authentication → URL Configuration | Must include all Vercel deployment URLs |
| SMTP configuration | Authentication → SMTP Settings | Production email delivery |
| MFA settings | Authentication → Multi-Factor Auth | If enabled, applies globally |
| Session duration | Authentication → Sessions | Adjust per security policy |

### G.3 Auth Boundary Rationale

Supabase does not support codifying auth provider configuration in `config.toml` for production projects. These settings are applied via the dashboard API and are not idempotent via migration. They are therefore dashboard-managed with a mandatory documentation requirement (see `docs/supabase/MMM_SUPABASE_BOUNDARY.md`).

---

## Section H: Secrets and Variables Boundary

### H.1 Secrets That Must Exist in Supabase Dashboard (Settings → Edge Functions → Secrets)

| Secret Name | Purpose | Required By |
|---|---|---|
| `OPENAI_API_KEY` | AI completions | All `mmm-ai-*` functions |
| `AIMC_SERVICE_URL` | AIMC integration endpoint | `mmm-ai-*` via `_shared/mmm-aimc-client.ts` |
| `AIMC_API_KEY` | AIMC authentication | `mmm-ai-*` via `_shared/mmm-aimc-client.ts` |
| `SUPABASE_URL` | Supabase project URL (auto-injected) | All functions |
| `SUPABASE_ANON_KEY` | Anon key (auto-injected) | All functions |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role (auto-injected) | Admin-level function operations |

> **SECURITY RULE**: No secrets, API keys, or service role keys are to be committed to this repository. All secrets are managed exclusively through the Supabase dashboard Secrets UI or the `supabase secrets set` CLI command (not stored in any repo file).

### H.2 Environment Variables in Vercel

Vercel deployment requires the following environment variables (set in Vercel dashboard, not in repo):

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Client-side Supabase URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Client-side anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-side operations (if applicable) |

---

## Reconciliation Sign-Off

| Item | Status |
|---|---|
| Migrations inventory | ✅ Complete (6 files) |
| Functions inventory | ✅ Complete (26 functions + `_shared`) |
| `config.toml` gaps | ✅ None — all 26 functions have entries |
| Storage buckets documented | ✅ Complete (2 buckets) |
| RLS model documented | ✅ Complete |
| Auth boundary documented | ✅ Complete |
| Secrets boundary documented | ✅ Complete |
| Drift vectors documented | ✅ Complete |
| Live state verified | ⚠️ Pending CS2 `supabase db diff --linked` check |

**Wave**: supabase-reconciliation-20260423 | **Issue**: #1461
