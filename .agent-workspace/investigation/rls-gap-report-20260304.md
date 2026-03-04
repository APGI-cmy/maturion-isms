# RLS Gap Report — maturion-isms App

**Date**: 2026-03-04  
**Investigator**: Copilot (investigation-only PR)  
**Scope**: All Supabase tables and all write operations in the codebase  
**PR type**: `investigation-report` / `docs-only`

---

## Executive Summary

The application is experiencing Supabase RLS failures because three independent root-cause problems compound each other. First, the `audits`, `domains`, and `criteria` tables enforce organisation isolation via a Postgres session variable (`current_setting('app.current_organisation_id', true)`) that is **never populated** by the frontend anon-key Supabase client, making every SELECT/UPDATE/DELETE on those tables fail for authenticated users. Second, several tables (`evidence`, `organisation_settings`) have RLS enabled and no `WITH CHECK` INSERT policy, causing all INSERT operations to be silently blocked. Third, the `organisations` table has RLS enabled but **no policies at all**, meaning no row can be read or written even with a valid JWT. A postbuild-fix migration (`20260304000003`) added correct `auth.uid()`-based policies for `profiles` and an INSERT policy for `audits`, but the inconsistency with the organisation-isolation approach and missing policies on other tables leaves the app substantially broken.

---

## Supabase Client Configuration

### Client Inventory

| Client | Location | Key used | Bypasses RLS? |
|---|---|---|---|
| `supabase` (singleton) | `modules/mat/frontend/src/lib/supabase.ts` | `VITE_SUPABASE_ANON_KEY` | No — RLS enforced, JWT required |
| `getAuthenticatedClient()` | `modules/mat/frontend/src/lib/supabase.ts` | Same anon key | No — just returns same client |
| `buildPersistentMemory()` client | `api/ai/request.ts` (Vercel serverless) | `SUPABASE_SERVICE_ROLE_KEY` | **Yes — bypasses all RLS** |
| `buildFeedbackPipeline()` client | `api/ai/feedback/approve.ts` (Vercel serverless) | `SUPABASE_SERVICE_ROLE_KEY` | **Yes — bypasses all RLS** |
| `api/ai/feedback/pending.ts` client | `api/ai/feedback/pending.ts` (Vercel serverless) | `SUPABASE_SERVICE_ROLE_KEY` | **Yes — bypasses all RLS** |
| Edge function client | `infrastructure/supabase/functions/score-maturity-cycle/index.ts` | `SUPABASE_SERVICE_ROLE_KEY` | **Yes — bypasses all RLS** |
| Legacy edge functions (40+) | `apps/maturion-maturity-legacy/supabase/functions/*/index.ts` | `SUPABASE_SERVICE_ROLE_KEY` | **Yes — bypasses all RLS** |

**Key observation**: All Vercel serverless routes and Supabase edge functions use the **service role key**, bypassing RLS entirely. The frontend uses the **anon key** and is therefore subject to all RLS policies. The RLS failures are exclusively a **frontend-path problem** because service-role callers bypass RLS.

### Frontend JWT Handling

The `supabase` client is configured with `persistSession: true` and `autoRefreshToken: true`, which means valid sessions are stored in `localStorage` and automatically included as a JWT `Authorization` header on all requests. Authentication state is managed via `supabase.auth.getUser()` / `supabase.auth.getSession()` inside hooks. **There is no Next.js middleware** (the app is a Vite SPA, not Next.js), and there is no server-side JWT forwarding required — all calls go directly from the browser to Supabase.

---

## RLS Policy Inventory

### `public.organisations`

| Operation | Policy name | Condition | Status |
|---|---|---|---|
| ALL | _(none)_ | _(no policies defined)_ | ❌ **BLOCKED — no policies** |

**Note**: RLS is enabled (`ALTER TABLE public.organisations ENABLE ROW LEVEL SECURITY`) but no policies are defined in any migration. This means **no authenticated user can read or write any organisation row**.  
**Migration source**: `20260302000000_mat_core_tables.sql`

---

### `public.profiles`

| Operation | Policy name | Condition | Status |
|---|---|---|---|
| SELECT | `profiles_select_own` | `auth.uid() = id` | ✅ Correct |
| INSERT | `profiles_insert_own` | `WITH CHECK (auth.uid() = id)` | ✅ Correct |
| UPDATE | `profiles_update_own` | `USING (auth.uid() = id) WITH CHECK (auth.uid() = id)` | ✅ Correct |
| DELETE | _(none)_ | _(no policy)_ | ⚠️ DELETE blocked (acceptable) |

**Migration source**: `20260304000003_fix_rls_policies_postbuild.sql`  
**Note**: Added by the postbuild fix migration. Correct use of `auth.uid()`. DELETE is blocked but not used by the frontend.

---

### `public.audits`

| Operation | Policy name | Condition | Status |
|---|---|---|---|
| SELECT | `audits_org_isolation` (USING) | `organisation_id::text = current_setting('app.current_organisation_id', true)` | ❌ **FAILS — session var never set** |
| INSERT | `audits_insert_authenticated` | `auth.role() = 'authenticated' AND auth.uid() = created_by` | ⚠️ Works only if `created_by` is set to `auth.uid()` |
| UPDATE | `audits_org_isolation` (USING) | `current_setting('app.current_organisation_id', true)` | ❌ **FAILS — session var never set** |
| DELETE | `audits_org_isolation` (USING) | `current_setting('app.current_organisation_id', true)` | ❌ **FAILS — session var never set** |

**Migration sources**: `20260302000000_mat_core_tables.sql` (org isolation), `20260304000003_fix_rls_policies_postbuild.sql` (INSERT policy)  
**Note**: Two different isolation strategies are mixed. `audits_org_isolation` uses a Postgres session variable that is never set by the frontend SDK. Only `audits_insert_authenticated` uses standard Supabase `auth.uid()`.

---

### `public.domains`

| Operation | Policy name | Condition | Status |
|---|---|---|---|
| SELECT | `domains_org_isolation` (USING) | `organisation_id::text = current_setting('app.current_organisation_id', true)` | ❌ **FAILS — session var never set** |
| INSERT | _(none)_ | _(no WITH CHECK)_ | ❌ **BLOCKED — no INSERT policy** |
| UPDATE | `domains_org_isolation` (USING) | `current_setting('app.current_organisation_id', true)` | ❌ **FAILS — session var never set** |
| DELETE | `domains_org_isolation` (USING) | `current_setting('app.current_organisation_id', true)` | ❌ **FAILS — session var never set** |

**Migration source**: `20260302000000_mat_core_tables.sql`

---

### `public.mini_performance_standards`

| Operation | Policy name | Condition | Status |
|---|---|---|---|
| ALL | _(none)_ | _(no policies defined)_ | ❌ **BLOCKED — no policies** |

**Note**: RLS is enabled but no policies are defined in any migration.  
**Migration source**: `20260302000000_mat_core_tables.sql`

---

### `public.criteria`

| Operation | Policy name | Condition | Status |
|---|---|---|---|
| SELECT | `criteria_org_isolation` (USING) | `organisation_id::text = current_setting('app.current_organisation_id', true)` | ❌ **FAILS — session var never set** |
| INSERT | _(none)_ | _(no WITH CHECK)_ | ❌ **BLOCKED — no INSERT policy** |
| UPDATE | `criteria_org_isolation` (USING) | `current_setting('app.current_organisation_id', true)` | ❌ **FAILS — session var never set** |
| DELETE | `criteria_org_isolation` (USING) | `current_setting('app.current_organisation_id', true)` | ❌ **FAILS — session var never set** |

**Migration source**: `20260302000000_mat_core_tables.sql`

---

### `public.evidence`

| Operation | Policy name | Condition | Status |
|---|---|---|---|
| SELECT | `evidence_org_isolation` (USING) | `organisation_id IN (SELECT organisation_id FROM profiles WHERE id = auth.uid())` | ✅ Correct approach |
| INSERT | _(none)_ | _(no WITH CHECK policy)_ | ❌ **BLOCKED — no INSERT policy** |
| UPDATE | `evidence_org_isolation` (USING) | Same as SELECT | ✅ (USING covers UPDATE row filtering) |
| DELETE | `evidence_org_isolation` (USING) | Same as SELECT | ✅ (USING covers DELETE row filtering) |

**Migration source**: `20260303000001_evidence_table.sql`  
**Note**: The USING clause alone without a `WITH CHECK` means the SELECT/UPDATE/DELETE restriction works correctly (a user can only see/modify their org's evidence), but **INSERT is completely blocked** because there is no matching `WITH CHECK` policy and RLS is enabled.

---

### `public.scores`

| Operation | Policy name | Condition | Status |
|---|---|---|---|
| SELECT | `scores_org_isolation` (USING) | `organisation_id IN (SELECT organisation_id FROM profiles WHERE id = auth.uid())` | ✅ Correct approach |
| INSERT | _(none)_ | _(no WITH CHECK policy)_ | ❌ **BLOCKED — no INSERT policy** |
| UPDATE | `scores_org_isolation` (USING) | Same as SELECT | ✅ |
| DELETE | `scores_org_isolation` (USING) | Same as SELECT | ✅ |

**Migration source**: `20260303000002_scores_table.sql`  
**Note**: Frontend uses `useConfirmScore` and `useOverrideScore` which perform UPDATE (not INSERT). These should work correctly if the user's profile has a matching `organisation_id`. INSERT into `scores` (done by AI scoring edge function using service role key) bypasses RLS — not blocked.

---

### `public.organisation_settings`

| Operation | Policy name | Condition | Status |
|---|---|---|---|
| SELECT | `organisation_settings_org_isolation` (USING) | `id IN (SELECT organisation_id FROM profiles WHERE id = auth.uid())` | ✅ Correct approach |
| INSERT | _(none)_ | _(no WITH CHECK policy)_ | ❌ **BLOCKED — no INSERT policy** |
| UPDATE | `organisation_settings_org_isolation` (USING) | Same as SELECT | ✅ |
| DELETE | _(none)_ | _(no policy)_ | ❌ BLOCKED |

**Migration source**: `20260303000003_organisation_settings_table.sql`  
**Note**: `useUpdateOrganisationSettings` uses `.upsert()` which performs INSERT on first call. Without a `WITH CHECK` INSERT policy, the initial settings creation will be blocked.

---

### `public.audit_scores`

| Operation | Policy name | Condition | Status |
|---|---|---|---|
| SELECT | `audit_scores_org_isolation` (USING) | `organisation_id IN (SELECT organisation_id FROM profiles WHERE id = auth.uid())` | ✅ Correct approach |
| INSERT | _(none)_ | _(no WITH CHECK policy)_ | ❌ **BLOCKED — no INSERT policy** |
| UPDATE | `audit_scores_org_isolation` (USING) | Same as SELECT | ✅ |
| DELETE | _(none)_ | _(no policy)_ | ❌ BLOCKED |

**Migration sources**: `20260303000006_audit_scores_table.sql`, `20260304000002_audit_scores_table.sql`  
**Note**: Frontend `useAuditMetrics` only reads from this table (SELECT). INSERT is done by edge functions using service role key — not blocked. Gaps are lower priority than `evidence` and `organisation_settings`.

---

### `storage.objects` (audit-documents bucket)

| Operation | Policy name | Condition | Status |
|---|---|---|---|
| SELECT | `audit_documents_org_read_v2` | `bucket_id = 'audit-documents' AND auth.role() = 'authenticated' AND split_part(name, '/', 1) = (SELECT organisation_id::text FROM profiles WHERE id = auth.uid())` | ✅ Hardened |
| INSERT | `audit_documents_org_insert_v2` | Same path-prefix check | ✅ Hardened |
| DELETE | `audit_documents_org_delete_v2` | Same path-prefix check | ✅ Hardened |

**Migration source**: `20260303000005_audit_documents_rls_hardening.sql`  
**Note**: However, the frontend `useUploadEvidence` uploads to path `evidence/<criterionId>/...` and `useUploadCriteria` uploads to `criteria/<auditId>/...` — both paths **start with a folder name, not the `organisation_id`**. The v2 policy checks `split_part(name, '/', 1) = organisation_id`, so these uploads will fail because the first path component is `evidence` or `criteria`, not the organisation UUID.

---

### `storage.objects` (organisation-assets bucket)

| Operation | Policy name | Condition | Status |
|---|---|---|---|
| SELECT | `organisation_assets_public_read` | `bucket_id = 'organisation-assets'` (public) | ✅ |
| INSERT | `organisation_assets_auth_insert` | `bucket_id = 'organisation-assets' AND auth.role() = 'authenticated'` | ✅ Correct for authenticated users |

**Migration source**: `20260303000004_storage_buckets.sql`

---

## Write Operation Gap Analysis

| # | File | Line | Table | Operation | Gap | Severity |
|---|---|---|---|---|---|---|
| 1 | `modules/mat/frontend/src/lib/hooks/useAudits.ts` | ~91–117 | `audits` | INSERT | `organisation_id` falls back to `'00000000-0000-0000-0000-000000000000'` if `user.user_metadata?.organisation_id` is unset (common for new auth users). INSERT policy `audits_insert_authenticated` requires `auth.uid() = created_by` — this IS set correctly. However, if org UUID is invalid, the FK check on `organisations` will fail (and organisations table is fully locked anyway). | P0 |
| 2 | `modules/mat/frontend/src/lib/hooks/useAudits.ts` | ~128–144 | `audits` | UPDATE | Uses `audits_org_isolation` USING clause which checks `current_setting('app.current_organisation_id', true)` — this session variable is never set by the frontend SDK. All UPDATE operations fail RLS. | P0 |
| 3 | `modules/mat/frontend/src/lib/hooks/useAudits.ts` | ~156–172 | `audits` | UPDATE (soft delete) | Same as #2 — `audits_org_isolation` fails because session variable is not set. | P0 |
| 4 | `modules/mat/frontend/src/lib/hooks/useAudits.ts` | ~34–50 | `audits` | SELECT | Same as #2 — `audits_org_isolation` fails. All audit list views will return empty or error. | P0 |
| 5 | `modules/mat/frontend/src/lib/hooks/useEvidence.ts` | ~55–115 | `evidence` | INSERT | No INSERT (`WITH CHECK`) policy exists on `evidence`. All evidence creation is blocked. Additionally, insert payload does not include `organisation_id` or `audit_id` (both NOT NULL in schema). | P0 |
| 6 | `modules/mat/frontend/src/lib/hooks/useEvidence.ts` | ~119–153 | `evidence` | DELETE | `evidence_org_isolation` USING clause covers DELETE but requires `organisation_id` to match profile — should work after org assignment, but depends on evidence having correct `organisation_id` (which can't be inserted per #5). | P1 |
| 7 | `modules/mat/frontend/src/lib/hooks/useEvidence.ts` | ~29–46 | `evidence` | SELECT | `evidence_org_isolation` USING clause covers SELECT correctly via profiles join — but evidence can't be created (per #5), so this gap is secondary. | P1 |
| 8 | `modules/mat/frontend/src/lib/hooks/useCriteria.ts` | ~68–107 | `storage.objects` (`audit-documents`) | INSERT (storage upload) | `useUploadCriteria` uploads to path `criteria/<auditId>/<filename>`. The v2 RLS policy checks `split_part(name, '/', 1) = organisation_id` — but the first path component is `criteria`, not the organisation UUID. Upload will fail RLS. | P0 |
| 9 | `modules/mat/frontend/src/lib/hooks/useEvidence.ts` | ~68–87 | `storage.objects` (`audit-documents`) | INSERT (storage upload) | Same as #8: path is `evidence/<criterionId>/...`. First component is `evidence`, not the org UUID. Upload will fail RLS. | P0 |
| 10 | `modules/mat/frontend/src/lib/hooks/useSettings.ts` | ~72–92 | `profiles` | UPSERT | Sets `id: user.id` — satisfies `profiles_insert_own` (`WITH CHECK (auth.uid() = id)`). Should work after postbuild fix. | ✅ Fixed |
| 11 | `modules/mat/frontend/src/lib/hooks/useSettings.ts` | ~125–146 | `organisation_settings` | UPSERT | No `WITH CHECK` INSERT policy. First upsert (creating settings row) will fail RLS. | P0 |
| 12 | `modules/mat/frontend/src/lib/hooks/useScoring.ts` | ~145–170 | `scores` | UPDATE | `scores_org_isolation` USING clause (profiles join via `auth.uid()`) — correct approach. Should work if user has a matching profile with `organisation_id`. | ✅ Likely works |
| 13 | `modules/mat/frontend/src/lib/hooks/useScoring.ts` | ~173–210 | `scores` | UPDATE | Same as #12. | ✅ Likely works |
| 14 | `modules/mat/frontend/src/lib/api/audits.ts` | ~20 | `audits` | INSERT | `CreateAuditInput` does not include `created_by`. The `audits_insert_authenticated` policy requires `auth.uid() = created_by`. Without `created_by` the INSERT will violate the RLS policy (the column will be NULL, which does not equal `auth.uid()`). | P0 |
| 15 | `modules/mat/frontend/src/lib/api/profile.ts` | ~20 | `profiles` | UPDATE | Uses `session.user.id` correctly. Satisfies `profiles_update_own`. | ✅ Correct |
| 16 | `modules/mat/frontend/src/lib/hooks/useCriteria.ts` | ~49–67 | `domains` | SELECT | `domains_org_isolation` uses `current_setting('app.current_organisation_id', true)` — never set. SELECT fails. Criteria tree will always error or return empty. | P0 |
| 17 | `modules/mat/frontend/src/lib/hooks/useAuditMetrics.ts` | ~38–75 | `audits` | SELECT | Same as #4 — `audits_org_isolation` session variable not set. All metrics return 0. | P0 |
| 18 | Implicit | — | `organisations` | SELECT | No policies on `organisations`. Any query joining to or selecting from `organisations` fails. | P0 |
| 19 | Implicit | — | `mini_performance_standards` | ALL | No policies. All operations blocked. The criteria tree uses a nested select through `domains → mini_performance_standards → criteria` which will fail. | P0 |

---

## Root Cause

There are three layered root-cause problems:

### Root Cause 1: `current_setting('app.current_organisation_id')` — Session Variable Never Set (Critical)

The `audits_org_isolation`, `domains_org_isolation`, and `criteria_org_isolation` policies use a PostgreSQL session variable (`app.current_organisation_id`) as the isolation mechanism. This variable is only meaningful when it is explicitly set per database connection via `SET LOCAL app.current_organisation_id = '<uuid>'`. The Supabase JavaScript SDK does not support setting per-request session variables without using a Postgres function call or RPC. The frontend never sets this variable, so the `current_setting()` call returns `NULL` (because the second argument is `true`, meaning it returns NULL rather than raising an error on missing setting). Every SELECT/UPDATE/DELETE on `audits`, `domains`, and `criteria` returns no rows (or violates the policy) for all frontend clients.

This is the **primary cause** of the reported `"new row violates row-level security policy for table 'audits'"` error. Actually, the `audits_insert_authenticated` policy is separate and should allow inserts if `created_by = auth.uid()`, but after the insert, any subsequent SELECT to confirm the insertion would fail (returns 0 rows because `audits_org_isolation` blocks it with a NULL session variable).

### Root Cause 2: Missing `WITH CHECK` INSERT Policies (Critical)

When a table has RLS enabled, an `INSERT` operation is governed by `WITH CHECK` policies. A `USING` clause alone is not sufficient for INSERT — it only applies to SELECT, UPDATE (row filter), and DELETE. The following tables have RLS enabled but no `WITH CHECK` INSERT policy, blocking all frontend inserts:

- `evidence` — all evidence creation is blocked
- `organisation_settings` — first-time settings setup is blocked  
- `domains` — no insert policy (domain creation blocked)
- `criteria` — no insert policy (criteria creation blocked)
- `mini_performance_standards` — no policies at all
- `organisations` — no policies at all

### Root Cause 3: Missing `organisation_id` and `created_by` in Write Payloads (High)

Even where INSERT policies exist (e.g., `audits_insert_authenticated` requiring `auth.uid() = created_by`), some write operations in the code do not supply the required fields:

- `api/ai/audits.ts` `createAudit()` does not pass `created_by` — INSERT will fail the policy `auth.uid() = created_by` since `created_by` will be NULL.
- `useUploadEvidence()` does not pass `organisation_id` or `audit_id` to the `evidence` INSERT, which are NOT NULL columns — this would fail the schema constraint even if the RLS policy were fixed.
- `useCreateAudit()` resolves `organisation_id` from `user.user_metadata?.organisation_id` which is only populated if set during signup — new users will get `'00000000-0000-0000-0000-000000000000'` which fails the FK constraint against `organisations`.

### Root Cause 4: Storage Path Mismatch (High)

The hardened audit-documents storage policy (`audit_documents_org_insert_v2`) requires the file path to begin with the organisation's UUID. However, both `useUploadCriteria` and `useUploadEvidence` upload to paths like `criteria/<auditId>/...` and `evidence/<criterionId>/...` respectively. The first path component is a static folder name (`criteria`, `evidence`), not the organisation UUID, so the path check `split_part(name, '/', 1) = organisation_id` will always fail.

---

## Recommended Fixes

The following fixes are listed in priority order. **This report does not implement any fixes** — it only identifies what is needed.

### P0 — Critical Blockers (app is non-functional without these)

1. **Replace `current_setting('app.current_organisation_id')` with `auth.uid()`-based policies on `audits`, `domains`, `criteria`.**
   - Drop `audits_org_isolation`, `domains_org_isolation`, `criteria_org_isolation`.
   - Replace with policies that join via `profiles` like the `evidence`/`scores` tables:
     ```sql
     CREATE POLICY audits_org_isolation ON public.audits
       USING (organisation_id IN (
         SELECT organisation_id FROM public.profiles WHERE id = auth.uid()
       ));
     ```
   - Add `WITH CHECK` INSERT policies for `domains` and `criteria` similarly.

2. **Add `WITH CHECK` INSERT policies for `evidence`, `organisation_settings`, `domains`, `criteria`.**
   - Pattern (for `evidence`):
     ```sql
     CREATE POLICY evidence_insert_own_org ON public.evidence
       FOR INSERT WITH CHECK (
         organisation_id IN (
           SELECT organisation_id FROM public.profiles WHERE id = auth.uid()
         )
       );
     ```

3. **Add RLS policies for `organisations` table.**
   - At minimum, a SELECT policy for authenticated users to read their own organisation:
     ```sql
     CREATE POLICY organisations_select_own ON public.organisations
       FOR SELECT USING (
         id IN (SELECT organisation_id FROM public.profiles WHERE id = auth.uid())
       );
     ```

4. **Add RLS policies for `mini_performance_standards` table.**
   - Same pattern as `domains`:
     ```sql
     CREATE POLICY mps_org_isolation ON public.mini_performance_standards
       USING (organisation_id IN (
         SELECT organisation_id FROM public.profiles WHERE id = auth.uid()
       ));
     ```

5. **Fix `useUploadEvidence` to include `organisation_id` and `audit_id` in INSERT payload.**
   - The hook must receive `organisationId` and `auditId` as parameters and include them in the evidence record.

6. **Fix `api/ai/audits.ts` `createAudit()` to include `created_by: user.id` in the insert.**
   - Resolve the current session user server-side before calling `.insert()`.

7. **Fix storage upload paths in `useUploadCriteria` and `useUploadEvidence` to use org-prefixed paths.**
   - Change path from `criteria/<auditId>/...` to `<organisationId>/criteria/<auditId>/...`.
   - Change path from `evidence/<criterionId>/...` to `<organisationId>/evidence/<criterionId>/...`.
   - Update the memory reference in `modules/mat/frontend/src/lib/hooks/useCriteria.ts` and `useEvidence.ts`.

### P1 — High Priority (functionality degraded without these)

8. **Fix `useCreateAudit` to resolve `organisation_id` from the user's `profiles` row, not from `user_metadata`.**
   - Before creating the audit, fetch the profile (`SELECT organisation_id FROM profiles WHERE id = auth.uid()`) and use that value.
   - Eliminates the `'00000000-0000-0000-0000-000000000000'` fallback.

9. **Add a `handle_new_user()` trigger path that also creates an `organisation` and links the `profiles.organisation_id`.**
   - Currently new users have no organisation. Without `organisation_id` in `profiles`, all org-isolation policies return no rows.
   - Consider a trigger or a server-side onboarding endpoint that creates a default organisation for new users.

### P2 — Medium Priority (edge cases)

10. **Add `SELECT` and `UPDATE` policies for `audit_scores` matching the pattern used by `scores`.**
    - The existing `audit_scores_org_isolation` (USING) covers SELECT/UPDATE/DELETE. An INSERT policy is needed if frontend or non-service-role callers will insert rows.

11. **Standardise the isolation pattern across all tables** to use `auth.uid()` via profiles join (same as `evidence`, `scores`, `organisation_settings`, `audit_scores`). The mixed use of `current_setting()` vs `auth.uid()` creates maintenance risk.

12. **Add `UPDATE` policies explicitly on `evidence` table** (USING policy currently serves as implicit UPDATE filter, which is correct PostgreSQL behaviour, but explicit per-operation policies are easier to audit).

---

## Appendix: Policy Classification Reference

| Table | RLS Enabled | Policies: SELECT | INSERT | UPDATE | DELETE | Net Status |
|---|---|---|---|---|---|---|
| `organisations` | ✅ | ❌ | ❌ | ❌ | ❌ | 🔴 Fully blocked |
| `profiles` | ✅ | ✅ auth.uid() | ✅ auth.uid() | ✅ auth.uid() | ❌ | 🟡 Missing DELETE |
| `audits` | ✅ | ❌ session var | ✅ auth.uid()=created_by | ❌ session var | ❌ session var | 🔴 SELECT/UPDATE/DELETE broken |
| `domains` | ✅ | ❌ session var | ❌ | ❌ session var | ❌ session var | 🔴 Fully broken |
| `mini_performance_standards` | ✅ | ❌ | ❌ | ❌ | ❌ | 🔴 Fully blocked |
| `criteria` | ✅ | ❌ session var | ❌ | ❌ session var | ❌ session var | 🔴 Fully broken |
| `evidence` | ✅ | ✅ profiles join | ❌ | ✅ (via USING) | ✅ (via USING) | 🔴 INSERT blocked |
| `scores` | ✅ | ✅ profiles join | ❌ | ✅ (via USING) | ✅ (via USING) | 🟡 INSERT blocked (edge fn ok) |
| `organisation_settings` | ✅ | ✅ profiles join | ❌ | ✅ (via USING) | ❌ | 🔴 INSERT blocked |
| `audit_scores` | ✅ | ✅ profiles join | ❌ | ✅ (via USING) | ❌ | 🟡 INSERT blocked (edge fn ok) |
| `storage.objects` (audit-docs) | ✅ | ✅ org path prefix | ✅ org path prefix | — | ✅ org path prefix | 🔴 Path mismatch in code |
| `storage.objects` (org-assets) | ✅ | ✅ public | ✅ authenticated | — | — | ✅ Correct |
