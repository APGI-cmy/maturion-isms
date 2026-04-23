# MMM Supabase Boundary Document

**Wave**: supabase-reconciliation-20260423  
**Issue**: maturion-isms#1461  
**Branch**: copilot/reconcile-supabase-project-state  
**Date**: 2026-04-23  
**Author**: mat-specialist (delegated by foreman-v2-agent)  
**Project ID**: ujucvyyspfxlxlfdamda  
**Status**: ACTIVE — enforced from wave supabase-reconciliation-20260423 onwards

---

## Purpose

This document defines the explicit boundary between what is controlled by the repository (version-controlled, reproducible, agent-driven) and what must remain managed through the Supabase dashboard. This boundary prevents drift, ensures reproducibility, and protects production stability.

---

## Section 1: Repo-Controlled Items

The following items are **owned by this repository**. Any change to these items must be made in the repo first (via migration, function code, or config.toml update) and then deployed to the live project. Manual dashboard changes to these items constitute **drift** and must be back-ported immediately.

### 1.1 Database Schema

| Item | Location | Mechanism |
|---|---|---|
| All `public.*` tables | `supabase/migrations/` | SQL migration files |
| All `public.*` indexes | `supabase/migrations/` | SQL migration files |
| All `public.*` RLS policies | `supabase/migrations/` | SQL migration files |
| All `public.*` helper functions (`mmm_current_user_org_id`, `mmm_current_user_role`) | `supabase/migrations/` | SQL migration files |
| All `public.*` sequences and defaults | `supabase/migrations/` | SQL migration files |
| Enum types (if any) | `supabase/migrations/` | SQL migration files |

### 1.2 Storage

| Item | Location | Mechanism |
|---|---|---|
| Storage bucket definitions (`mmm-evidence`, `mmm-framework-sources`) | `supabase/migrations/20260420000004_mmm_storage_buckets.sql` | SQL via `storage.buckets` insert |
| Bucket MIME type allowlists | `supabase/migrations/` | SQL migration (update to bucket config) |
| Storage RLS policies | `supabase/migrations/` | SQL migration files |
| Bucket size limits | `supabase/migrations/` | SQL migration (update to bucket config) |

### 1.3 Edge Functions

| Item | Location | Mechanism |
|---|---|---|
| All 26 Edge Function source code | `supabase/functions/<function-name>/index.ts` | Deployed via `supabase functions deploy` |
| Shared Edge Function utilities | `supabase/functions/_shared/` | Bundled at deploy time |
| JWT verification settings | `supabase/config.toml` — `[functions.<name>]` sections | Config applied during deployment |
| Function import map / runtime config | `supabase/config.toml` | Applied during deployment |

### 1.4 Project Identity

| Item | Location |
|---|---|
| `project_id` | `supabase/config.toml` — `project_id = "ujucvyyspfxlxlfdamda"` |

---

## Section 2: Dashboard-Managed Items

The following items are **not controlled by this repository** and must be configured and maintained through the Supabase dashboard or via the `supabase` CLI in a dashboard-linked session. They are documented here for operational completeness but changes to them do not require a migration or PR.

### 2.1 Auth Configuration

| Item | Dashboard Location | Change Protocol |
|---|---|---|
| Email/password auth enable | Authentication → Providers | CS2 operational action; document in OC checklist |
| OAuth providers (Google, GitHub, etc.) | Authentication → Providers | CS2 operational action |
| Email templates (confirmation, magic link, invite) | Authentication → Email Templates | CS2 operational action; screenshot before/after |
| JWT secret and expiry | Authentication → JWT Settings | Critical; coordinate with all Edge Functions before change |
| Allowed redirect URLs | Authentication → URL Configuration | Update whenever Vercel deployment URL changes |
| SMTP provider configuration | Authentication → SMTP Settings | CS2 operational action; OC-005 checklist |
| MFA configuration | Authentication → Multi-Factor Auth | CS2 security decision |
| Session duration and inactivity timeout | Authentication → Sessions | CS2 security decision |

### 2.2 Secrets

| Item | Dashboard Location | Change Protocol |
|---|---|---|
| `OPENAI_API_KEY` | Settings → Edge Functions → Secrets | `supabase secrets set` or dashboard; never in repo |
| `AIMC_SERVICE_URL` | Settings → Edge Functions → Secrets | `supabase secrets set` or dashboard; never in repo |
| `AIMC_API_KEY` | Settings → Edge Functions → Secrets | `supabase secrets set` or dashboard; never in repo |
| All other API keys / third-party credentials | Settings → Edge Functions → Secrets | Never in repo |

### 2.3 Project-Level Settings

| Item | Dashboard Location | Change Protocol |
|---|---|---|
| Project name | Settings → General | CS2 action only |
| Organisation / team membership | Organisation → Members | CS2 action only |
| Billing plan | Billing → Plan | CS2 action only |
| Database password | Settings → Database → Connection string | CS2 action; rotate via dashboard only |
| Realtime configuration | Database → Replication | Not currently used by MMM; CS2 if needed |
| Point-in-time recovery (PITR) settings | Settings → Backups | CS2 action only |
| Postgres extensions | Database → Extensions | Dashboard or migration — if needed in repo, use a migration |

### 2.4 Monitoring and Logging

| Item | Notes |
|---|---|
| Log drain / log forwarding | Dashboard-configured; not repo-managed |
| Alerts (slow query, error rate) | Dashboard-configured |
| Query performance advisors | Dashboard-read-only |

---

## Section 3: Decision Rationale

### 3.1 Why Schema, Storage, and Functions Are Repo-Managed

1. **Reproducibility**: Any developer or CI pipeline with the `supabase` CLI and project credentials can recreate the entire database schema from migrations. This eliminates "it works on my machine" issues.
2. **Auditability**: Every schema change is a git commit with an author, timestamp, and PR linkage. Dashboard changes leave no git history.
3. **Agent safety**: Agents operate on repo files, not live dashboards. Agent-driven schema changes must be expressible as migrations. This prevents agents from bypassing governance.
4. **Rollback**: Migrations can be rolled back (with appropriate down migrations or compensating migrations). Dashboard changes often cannot be undone without data loss.
5. **PR gate**: Schema changes go through the standard PR + IAA review pipeline. Dashboard changes bypass this gate entirely.

### 3.2 Why Auth, Secrets, and Project Settings Are Dashboard-Managed

1. **Supabase limitation**: Supabase does not support auth provider configuration or secret injection via `config.toml` for linked (production) projects. These values are applied via the Supabase Management API.
2. **Security**: Secrets (API keys, JWT secret) must never be committed to a repository. The dashboard secrets vault is the appropriate store.
3. **Sensitivity**: JWT secret rotation, MFA policy, and OAuth provider configuration require human review and deliberate CS2 action — they are not appropriate for automated agent deployment.
4. **Idempotency**: Auth provider and SMTP settings are not idempotent via SQL migration. A migration setting `enable_signup = true` would re-run on every `db push` and could override deliberate runtime changes.

### 3.3 Storage Boundary Nuance

Storage bucket definitions (the bucket rows in `storage.buckets`) and their RLS policies are repo-managed via migrations because they are structural schema-level objects. However, pre-signed URL settings, CORS configuration, and CDN settings (if added by Supabase in future) would be dashboard-managed.

---

## Section 4: Exception Register

Exceptions to the above boundary must be approved by CS2 and recorded here.

| ID | Item | Standard Classification | Exception | Rationale | Approved By | Date |
|---|---|---|---|---|---|---|
| EX-001 | Postgres extensions (e.g., `pgvector`, `pg_cron`) | Dashboard-managed | May be migrated to repo via `CREATE EXTENSION IF NOT EXISTS` in a migration | Required for vector search (criteria embeddings in Phase 4) | Pending CS2 approval | TBD |

> **No active exceptions as of wave supabase-reconciliation-20260423.** EX-001 is a pre-registered anticipated need, not yet active.

---

## Boundary Enforcement

Any PR that modifies the following files must pass the IAA merge gate before merging:

- `supabase/migrations/*.sql` (any new or modified migration)
- `supabase/config.toml` (function JWT settings, project_id)
- `supabase/functions/**` (any Edge Function code change)

Dashboard changes that affect repo-managed items must be back-ported via a migration PR within the same wave. See `docs/supabase/MMM_SUPABASE_OPERATING_PROCEDURE.md` Section 8.

---

**Wave**: supabase-reconciliation-20260423 | **Issue**: #1461 | **Authority**: CS2
