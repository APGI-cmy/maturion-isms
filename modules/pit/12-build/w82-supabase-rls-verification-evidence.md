# PIT Stage 12 W8.2 Supabase RLS Verification Evidence

Issue: maturion-isms#1774
Related PRs: #1782, #1785
Verification source: Supabase SQL Editor output supplied by CS2 operator after PR #1785 merge.
Supabase project: `ujucvyyspfxlxlfdamda`

## Purpose

Record post-migration Supabase verification evidence for the W8.2 access-control foundation.

This evidence verifies:

- W8.2 tables exist in `public`.
- RLS is enabled for all W8.2 checked tables.
- W8.2 policies are present for organisation, membership, role, audit, and QA run surfaces.

## Query 1 - table/RLS status

```sql
select relname as table_name, relrowsecurity as rls_enabled
from pg_class
join pg_namespace on pg_namespace.oid = pg_class.relnamespace
where nspname = 'public'
  and relname in ('organisations', 'user_org_memberships', 'user_roles', 'audit_log', 'qa_runs')
order by relname;
```

## Query 1 result

| table_name | rls_enabled |
|---|---:|
| audit_log | true |
| organisations | true |
| qa_runs | true |
| user_org_memberships | true |
| user_roles | true |

## Query 2 - policy inventory

```sql
select tablename, policyname, cmd
from pg_policies
where schemaname = 'public'
  and tablename in ('organisations', 'user_org_memberships', 'user_roles', 'audit_log', 'qa_runs')
order by tablename, policyname;
```

## Query 2 result

| tablename | policyname | cmd |
|---|---|---|
| audit_log | audit_log_insert_member | INSERT |
| audit_log | audit_log_select_admin | SELECT |
| organisations | organisations_insert_authenticated | INSERT |
| organisations | organisations_select_member | SELECT |
| organisations | organisations_select_own | SELECT |
| organisations | organisations_update_own | UPDATE |
| qa_runs | qa_runs_select_cs2 | SELECT |
| qa_runs | qa_runs_write_cs2 | ALL |
| user_org_memberships | user_org_memberships_insert_admin | INSERT |
| user_org_memberships | user_org_memberships_select_member | SELECT |
| user_org_memberships | user_org_memberships_update_admin | UPDATE |
| user_roles | user_roles_select_admin | SELECT |
| user_roles | user_roles_write_admin | ALL |

## Interpretation

The W8.2 schema/RLS foundation migration from PR #1785 is applied and visible in Supabase.

Evidence supports the following W8.2 claims:

- `audit_log`, `organisations`, `qa_runs`, `user_org_memberships`, and `user_roles` exist and have RLS enabled.
- Policy inventory exists for checked W8.2 tables.
- `qa_runs` includes CS2-targeted policies.
- membership and role tables include admin-scoped insert/update/select policies.
- audit surface includes member insert and admin select policies.

## Evidence still not claimed

This artifact does not claim full W8.2 exit. The following remain to close before W8.2 can be fully accepted:

- live role matrix execution with seeded or real test actors;
- denied-path screenshots/HAR or equivalent deployed evidence for `/admin/*` and `/qa-dashboard`;
- query output proving actual positive/negative actor behavior under RLS;
- admin-nav visibility gating evidence;
- final W8.2 role-negative-path checklist with actor/result trace.

## Non-overclaim

This PR records Supabase table/RLS and policy inventory evidence only. It does not claim Stage 12 completion, PIT FUNCTIONAL_PASS, or full W8.2 completion.
