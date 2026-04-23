# MMM Supabase Operating Procedure

**Wave**: supabase-reconciliation-20260423  
**Issue**: maturion-isms#1461  
**Branch**: copilot/reconcile-supabase-project-state  
**Date**: 2026-04-23  
**Author**: mat-specialist (delegated by foreman-v2-agent)  
**Project ID**: ujucvyyspfxlxlfdamda  
**Version**: 1.0.0  
**Status**: ACTIVE — effective from wave supabase-reconciliation-20260423

---

## Section 1: Overview — Agent-Driven Supabase Change Model

### 1.1 Guiding Principle

The repository is the **single source of truth** for the Supabase project. No agent, developer, or CS2 operator makes changes to schema, storage buckets, storage policies, or Edge Functions directly in the dashboard without first making the equivalent change in the repo and going through the standard PR + IAA review gate.

### 1.2 Change Categories

| Change Category | Mechanism | Route |
|---|---|---|
| Database schema (tables, indexes, policies, functions) | SQL migration file | PR → IAA review → merge → deploy |
| Storage buckets, MIME types, storage RLS | SQL migration file | PR → IAA review → merge → deploy |
| Edge Function logic | TypeScript file in `supabase/functions/` | PR → IAA review → merge → deploy |
| Edge Function JWT setting | `supabase/config.toml` entry | PR → IAA review → merge → deploy |
| Auth configuration | Dashboard-managed | CS2 operational action (see Section 8) |
| Secrets | Supabase Secrets UI / CLI | CS2 operational action (see Sections 5.4, H.1) |

### 1.3 Agents and Supabase

Agents (api-builder, schema-builder, ui-builder, etc.) produce repo artefacts. They do not have live Supabase credentials and must not attempt direct database connections. Agents:

- Create migration SQL files in `supabase/migrations/`
- Create or modify Edge Function files in `supabase/functions/`
- Update `supabase/config.toml` for new function registrations
- Document expected state in `docs/supabase/`

Deployment of those artefacts to the live project is a **CS2 operational action** following the workflow in Section 5.

---

## Section 2: How to Add Migrations

### 2.1 Naming Convention

```
YYYYMMDDNNNNNN_<description>.sql
```

- `YYYYMMDD` — date the migration is authored (UTC, not the date it is deployed)
- `NNNNNN` — 6-digit sequential number, zero-padded, starting at `000001` for the first migration on a given date
- `<description>` — snake_case description of the change, prefixed with `mmm_`

**Examples:**

```
20260423000001_mmm_add_risk_register_table.sql
20260423000002_mmm_add_risk_register_indexes.sql
20260424000001_mmm_extend_evidence_mime_types.sql
```

> **Rule**: Never reuse a migration timestamp that already exists. If two migrations are created on the same date, increment the 6-digit sequence.

### 2.2 Migration File Structure

Every migration file must include:

1. A header comment block identifying the wave, issue, and purpose
2. The SQL DDL/DML statements
3. A comment at each significant step

```sql
-- Migration: 20260423000001_mmm_add_risk_register_table.sql
-- Wave: <wave-name>
-- Issue: maturion-isms#XXXX
-- Purpose: Adds mmm_risk_register table for risk tracking
-- Author: <agent-name>

-- Create risk register table
CREATE TABLE IF NOT EXISTS public.mmm_risk_register (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organisation_id UUID NOT NULL REFERENCES public.mmm_organisations(id) ON DELETE CASCADE,
  -- ... columns
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS immediately on creation
ALTER TABLE public.mmm_risk_register ENABLE ROW LEVEL SECURITY;
```

### 2.3 RLS Policy Requirement

Every new table migration **must** include:

1. `ALTER TABLE <table> ENABLE ROW LEVEL SECURITY;`
2. RLS policies using `public.mmm_current_user_org_id()` and/or `public.mmm_current_user_role()` helpers

If RLS policies are complex, they may be placed in a separate migration file (next sequential number, same date).

### 2.4 Migration Workflow

```
1. Author creates migration SQL in supabase/migrations/
2. Author updates docs/supabase/MMM_SUPABASE_AUDIT.md Section D (migration chain)
3. PR opened → IAA review gate
4. IAA PASS → CS2 merges PR
5. CS2 deploys: supabase db push (see Section 5)
6. CS2 runs: supabase db diff --linked to verify zero residual drift
```

### 2.5 Hard Rules for Migrations

- **Never** modify or delete an existing migration file that has been applied to production
- **Never** create a migration that bypasses the RLS model
- **Never** create a migration that stores secrets or API keys
- **Never** use `DROP TABLE` without a compensating data backup procedure documented in the PR
- Schema-destructive operations (DROP, TRUNCATE, column removal) require CS2 explicit approval comment in the PR

---

## Section 3: How to Add or Change Storage Buckets and Policies

### 3.1 Principle

All storage bucket creation, modification, and RLS changes are performed **via SQL migrations**, not via the Supabase dashboard Storage UI.

### 3.2 Adding a New Bucket

Create a new migration file:

```sql
-- Migration: 20260423000001_mmm_add_new_bucket.sql
-- Creates the mmm-new-bucket storage bucket

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'mmm-new-bucket',
  'mmm-new-bucket',
  false,                           -- private
  52428800,                        -- 50 MB
  ARRAY[
    'application/pdf',
    'image/jpeg',
    'image/png'
    -- add more MIME types as needed
  ]
)
ON CONFLICT (id) DO NOTHING;
```

Then add storage RLS policies in the same migration or a subsequent one:

```sql
-- Read policy: authenticated users only
CREATE POLICY "mmm_new_bucket_read"
  ON storage.objects
  FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'mmm-new-bucket'
    AND auth.uid() IS NOT NULL
  );

-- Upload policy: authenticated users only
CREATE POLICY "mmm_new_bucket_upload"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'mmm-new-bucket'
    AND auth.uid() IS NOT NULL
  );
```

### 3.3 Extending MIME Types on an Existing Bucket

Create a new migration that UPDATEs the bucket row:

```sql
-- Migration: 20260423000001_mmm_extend_bucket_mime_types.sql
UPDATE storage.buckets
SET allowed_mime_types = array_cat(
  allowed_mime_types,
  ARRAY['text/markdown', 'text/html']
)
WHERE id = 'mmm-evidence';
```

### 3.4 Hardening or Modifying Storage RLS

Create a compensating migration that DROPs the old policy and re-creates it:

```sql
-- Drop existing policy
DROP POLICY IF EXISTS "old_policy_name" ON storage.objects;

-- Create hardened policy
CREATE POLICY "new_hardened_policy"
  ON storage.objects
  FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'mmm-evidence'
    AND auth.uid() IS NOT NULL
    -- add org-level check here
  );
```

> **Never** modify the policy directly in the dashboard Storage UI — this creates drift.

---

## Section 4: How to Add or Modify Edge Functions

### 4.1 Adding a New Edge Function

1. Create a new directory under `supabase/functions/`:

   ```
   supabase/functions/mmm-new-function/
   supabase/functions/mmm-new-function/index.ts
   ```

2. Add an entry to `supabase/config.toml` with the appropriate `verify_jwt` setting:

   ```toml
   # Wave B8 — New Feature
   [functions.mmm-new-function]
   verify_jwt = true
   ```

   **JWT setting guidance:**
   - `verify_jwt = true` — for all authenticated operations (default for any function requiring a logged-in user)
   - `verify_jwt = false` — only for explicitly public functions (health checks, free assessments, public webhooks). Requires justification comment in the PR.

3. If the function uses shared utilities, import from `../_shared/`:

   ```typescript
   import { createMmmClient } from '../_shared/mmm-supabase-client.ts'
   ```

4. Update `docs/supabase/MMM_SUPABASE_AUDIT.md` Section E to add the new function to the inventory.

### 4.2 Modifying an Existing Edge Function

1. Edit `supabase/functions/<function-name>/index.ts` (or any sub-files)
2. Open PR with the changes
3. IAA review → CS2 merge → deploy via `supabase functions deploy <function-name>`

### 4.3 Modifying Shared Utilities

Changes to `supabase/functions/_shared/` affect all functions that import from it. The PR must:

1. List all functions that import the modified shared file
2. Confirm tests pass for each affected function
3. Note that deployment requires re-deploying all affected functions (or all functions via `supabase functions deploy`)

### 4.4 Deleting a Function

1. Remove the directory from `supabase/functions/`
2. Remove the `[functions.<name>]` section from `supabase/config.toml`
3. Add a note to `docs/supabase/MMM_SUPABASE_AUDIT.md` Section E marking the function as removed (with wave/date)
4. After merge: CS2 deletes the function from the dashboard (cannot be done via `supabase functions deploy`)

---

## Section 5: How to Deploy and Apply Changes

### 5.1 Prerequisites

```bash
# Install Supabase CLI (if not already installed)
npm install -g supabase

# Verify CLI version
supabase --version

# Link to the live project (one-time setup; requires SUPABASE_ACCESS_TOKEN)
supabase link --project-ref ujucvyyspfxlxlfdamda
```

### 5.2 Local Testing Before Deploy

```bash
# Start local Supabase environment
supabase start

# Apply migrations to local instance
supabase db push --local

# Check for drift between local and repo
supabase db diff

# Run seed data (development only)
supabase db reset  # Warning: destructive — resets local DB and re-seeds

# Test a function locally
supabase functions serve mmm-health --env-file .env.local
```

### 5.3 Applying Migrations to the Linked Project

```bash
# Apply all pending migrations to linked project
supabase db push

# Verify no remaining drift
supabase db diff --linked
```

> If `supabase db diff --linked` outputs anything other than an empty diff, record the variance in `docs/supabase/MMM_SUPABASE_AUDIT.md` Section C and open a remediation task.

### 5.4 Deploying Edge Functions

```bash
# Deploy a single function
supabase functions deploy mmm-health

# Deploy all functions at once (no function name = deploys all)
supabase functions deploy

# Set a secret (NEVER commit secrets to repo)
supabase secrets set OPENAI_API_KEY=<value>

# List all secrets (names only — values are not shown)
supabase secrets list
```

### 5.5 Full Deployment Workflow (Post-Merge)

```bash
# Step 1: Pull the latest merged code
git pull origin main

# Step 2: Apply all pending migrations
supabase db push

# Step 3: Verify migration drift
supabase db diff --linked
# Expected output: (empty — no diff)

# Step 4: Deploy all Edge Functions
supabase functions deploy

# Step 5: Verify functions are live
supabase functions list
# Verify all 26 functions appear with correct updated_at timestamps

# Step 6: Run smoke tests
curl https://ujucvyyspfxlxlfdamda.supabase.co/functions/v1/mmm-health
# Expected: {"status":"ok"}
```

### 5.6 Rollback Procedure

Supabase does not support automatic migration rollback. Rollback is performed by creating a **compensating migration**:

```bash
# Create compensating migration
# File: supabase/migrations/YYYYMMDDNNNNNN_mmm_rollback_<description>.sql
# Content: SQL that undoes the problematic migration

# Apply compensating migration
supabase db push

# Verify
supabase db diff --linked
```

For Edge Functions, rollback is performed by deploying the previous version:

```bash
git checkout <previous-commit-sha> -- supabase/functions/mmm-affected-function/
supabase functions deploy mmm-affected-function
git checkout HEAD -- supabase/functions/mmm-affected-function/
# Then open PR to formally revert the function change
```

---

## Section 6: Preflight Checks

The following checks must be completed before committing any Supabase-affecting file change.

### 6.1 Migration Preflight

- [ ] Migration filename follows `YYYYMMDDNNNNNN_mmm_<description>.sql` convention
- [ ] No duplicate timestamp with existing migration files
- [ ] Header comment block present (wave, issue, purpose, author)
- [ ] `ENABLE ROW LEVEL SECURITY` included for any new table
- [ ] RLS policies use `mmm_current_user_org_id()` / `mmm_current_user_role()` helpers
- [ ] No secrets, API keys, or credentials in the migration SQL
- [ ] `supabase db push --local` succeeds with no errors
- [ ] `supabase db diff` (local) shows only the expected changes

### 6.2 Edge Function Preflight

- [ ] `supabase/config.toml` entry added/updated for function
- [ ] `verify_jwt` setting is correct (`true` unless explicitly justified as `false`)
- [ ] No secrets hardcoded in function source code
- [ ] All imports from `_shared/` use relative paths (`../_shared/`)
- [ ] Function handles errors gracefully (returns appropriate HTTP status codes)
- [ ] `supabase functions serve <function-name> --env-file .env.local` runs without errors

### 6.3 config.toml Preflight

- [ ] `project_id` remains `ujucvyyspfxlxlfdamda` — do not change
- [ ] All existing entries are preserved — only additions permitted in normal workflow
- [ ] New function entry includes `verify_jwt` setting
- [ ] No JWT secrets or credentials added to config.toml

### 6.4 Cross-Cutting Preflight

- [ ] `docs/supabase/MMM_SUPABASE_AUDIT.md` updated to reflect the change (new migration in Section D, new function in Section E, etc.)
- [ ] `modules/MMM/BUILD_PROGRESS_TRACKER.md` updated if this is a wave-level change
- [ ] PR description includes wave name, issue number, and a clear description of what Supabase artefacts are affected

---

## Section 7: Anti-Drift Rules

The following actions are **prohibited** without an accompanying repo back-port (migration + PR):

### 7.1 Never Do Without Back-Porting

| Prohibited Action | Required Back-Port |
|---|---|
| Creating a table in the Supabase SQL editor | Create a migration that creates the same table |
| Adding a column via the dashboard Table Editor | Create a migration with `ALTER TABLE ... ADD COLUMN` |
| Creating or modifying an RLS policy via dashboard | Create a migration that creates/replaces the policy |
| Adding a storage bucket via the dashboard Storage UI | Create a migration that inserts into `storage.buckets` |
| Modifying bucket MIME types via the dashboard | Create a migration that updates `storage.buckets` |
| Adding a storage policy via the dashboard | Create a migration that creates the policy |
| Deploying an Edge Function from dashboard upload | Push source to `supabase/functions/` and deploy via CLI |
| Changing a function's `verify_jwt` in the dashboard | Update `supabase/config.toml` and redeploy |
| Adding a Postgres extension via the dashboard | Create a migration with `CREATE EXTENSION IF NOT EXISTS` |

### 7.2 Drift Detection Schedule

CS2 should run `supabase db diff --linked` after every production deployment and at the start of each new wave. Any diff output must be investigated and resolved before the wave closes.

### 7.3 Drift Severity Classification

| Drift Type | Severity | Required Response |
|---|---|---|
| Extra table/column in live DB not in repo | Critical | Immediate back-port migration + wave |
| Missing policy (policy deleted from live) | Critical | Immediate back-port migration |
| Extra function deployed to live not in repo | High | Add to repo + `config.toml` + PR in next wave |
| MIME type mismatch on bucket | Medium | Back-port migration in next wave |
| Auth config changes not documented | Medium | Document in OC checklist |

---

## Section 8: Emergency and Manual Override Procedure

### 8.1 When Manual Intervention Is Permitted

Manual dashboard intervention (bypassing the normal PR → deploy flow) is permitted **only** in the following scenarios:

1. **Production outage** caused by a schema or policy issue requiring immediate remediation
2. **Security incident** requiring immediate secret rotation or auth setting change
3. **Data corruption** requiring immediate manual SQL intervention

### 8.2 Emergency Response Protocol

**Step 1: Declare Emergency**

CS2 posts to the relevant GitHub issue:

```
EMERGENCY OVERRIDE DECLARED
Type: [outage | security | data]
Affected artefact: [table/policy/function/secret]
Justification: [brief description]
Timestamp: YYYY-MM-DDTHH:MM:SSZ
```

**Step 2: Apply Minimum Necessary Fix**

Apply only the minimum change required to restore service. Document every dashboard action taken (screenshot where possible).

**Step 3: Back-Port Within 24 Hours**

Create a back-port PR within 24 hours that:

1. Contains a migration or config change that matches the emergency fix
2. References the emergency declaration comment in the PR description
3. Includes `EMERGENCY BACK-PORT` in the PR title
4. Passes the IAA review gate (expedited — IAA must complete within 4 hours for emergency back-ports)

**Step 4: Verify Reconciliation**

After the back-port PR merges:

```bash
supabase db diff --linked
# Must return empty diff — confirming repo and live are reconciled
```

**Step 5: Post-Incident Recording**

Update `docs/supabase/MMM_SUPABASE_AUDIT.md` Section C.1 with the incident and its resolution.

### 8.3 Secret Rotation (Non-Emergency)

Secret rotation does not require a migration or PR. Process:

```bash
# Rotate a secret
supabase secrets set OPENAI_API_KEY=<new-value>

# Verify the secret is set
supabase secrets list
# (values are never shown — only names)
```

CS2 documents the rotation date in the operational log (OC checklist / `modules/MMM/12-phase4-ecap/` operational records).

### 8.4 What Requires CS2 Approval Before ANY Action

- Changing `project_id` in `config.toml` (would point all deployments at a different project)
- Rotating the JWT secret (invalidates all active sessions)
- Dropping a table or truncating data
- Disabling RLS on any table
- Making a bucket public that was previously private

---

## Change Log

| Version | Date | Wave | Change |
|---|---|---|---|
| 1.0.0 | 2026-04-23 | supabase-reconciliation-20260423 | Initial version — establishes agent-driven Supabase operating procedure for MMM |

---

**Wave**: supabase-reconciliation-20260423 | **Issue**: #1461 | **Authority**: CS2
