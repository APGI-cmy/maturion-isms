# Supabase Sync Audit — Wave postbuild-fails-01
**Date**: 2026-03-04
**Incident**: F-001 (profiles RLS INSERT/UPDATE), F-002 (audits RLS INSERT)
**Issue**: #891

---

## 1. Tables with RLS Enabled

| Table | RLS Enabled | SELECT | INSERT | UPDATE | DELETE |
|-------|------------|--------|--------|--------|--------|
| `public.profiles` | ✅ | ❌ missing | ❌ missing | ❌ missing | — |
| `public.audits` | ✅ | org-isolation | ❌ missing | org-isolation | — |
| `public.organisations` | ✅ | — | — | — | — |
| `public.domains` | ✅ | org-isolation | — | — | — |
| `public.mini_performance_standards` | ✅ | — | — | — | — |
| `public.criteria` | ✅ | org-isolation | — | — | — |
| `public.evidence` | ✅ | — | — | — | — |
| `public.scores` | ✅ | — | — | — | — |
| `public.organisation_settings` | ✅ | — | — | — | — |
| `public.audit_scores` | ✅ | — | — | — | — |
| `storage.objects` (audit-documents) | ✅ | org-path v2 | org-path v2 | — | org-path v2 |

---

## 2. Confirmed Gaps

### GAP-001: `profiles` — no INSERT policy (F-001)
- **Symptom**: `useUpdateUserProfile` uses `upsert()` → triggers INSERT → violates RLS
- **Fix**: Add `profiles_insert_own` with `WITH CHECK (auth.uid() = id)`

### GAP-002: `profiles` — no UPDATE policy (F-001)
- **Symptom**: Profile save fails with "new row violates row-level security policy for table `profiles`"
- **Fix**: Add `profiles_update_own` with `USING (auth.uid() = id) WITH CHECK (auth.uid() = id)`

### GAP-003: `profiles` — no SELECT policy
- **Symptom**: Profile reads may fail or return empty with RLS enabled
- **Fix**: Add `profiles_select_own` with `USING (auth.uid() = id)`

### GAP-004: `audits` — no INSERT policy (F-002)
- **Symptom**: `useCreateAudit` INSERT fails with "new row violates row-level security policy for table `audits`"
- **Existing policy**: `audits_org_isolation` has only `USING` clause (SELECT/UPDATE/DELETE) — no `WITH CHECK` for INSERT
- **Fix**: Add `audits_insert_authenticated` with `WITH CHECK (auth.role() = 'authenticated' AND auth.uid() = created_by)`

### GAP-005: No `handle_new_user()` trigger (root cause of F-001 + F-002)
- **Symptom**: New auth users have no `profiles` row → all profile-dependent queries fail
- **Fix**: Create `public.handle_new_user()` SECURITY DEFINER trigger function + `on_auth_user_created` trigger on `auth.users`

---

## 3. Frontend Hook Cross-Reference

| Hook | Table | Operation | Policy Required | Status Before Fix |
|------|-------|-----------|----------------|-------------------|
| `useUpdateUserProfile` | `profiles` | UPSERT (INSERT+UPDATE) | INSERT + UPDATE | ❌ No INSERT/UPDATE policy |
| `useUserProfile` | `profiles` | SELECT | SELECT | ❌ No SELECT policy |
| `useCreateAudit` | `audits` | INSERT | INSERT WITH CHECK | ❌ No INSERT policy |
| `useAudits` | `audits` | SELECT | SELECT (org-isolation) | ✅ Covered |

---

## 4. Fix Applied

Migration: `apps/maturion-maturity-legacy/supabase/migrations/20260304000003_fix_rls_policies_postbuild.sql`

| Policy / Trigger | Table | Operation | Change |
|-----------------|-------|-----------|--------|
| `handle_new_user()` + `on_auth_user_created` | `auth.users` | AFTER INSERT | ✅ ADDED |
| `profiles_select_own` | `profiles` | SELECT | ✅ ADDED |
| `profiles_insert_own` | `profiles` | INSERT | ✅ ADDED |
| `profiles_update_own` | `profiles` | UPDATE | ✅ ADDED |
| `audits_insert_authenticated` | `audits` | INSERT | ✅ ADDED |

---

## 5. Test Coverage

| Test ID | Description | Status |
|---------|-------------|--------|
| T-PBF-001 | handle_new_user() trigger migration exists | ✅ GREEN |
| T-PBF-002 | profiles INSERT + UPDATE policies in migration | ✅ GREEN |
| T-PBF-003 | audits INSERT policy in migration | ✅ GREEN |
| T-PBF-004 | RLS isolation — uid-scoped policies present | ✅ GREEN |
