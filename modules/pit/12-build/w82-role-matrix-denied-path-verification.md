# PIT Stage 12 W8.2 Role Matrix and Denied-Path Verification

Issue: maturion-isms#1774
Related PRs: #1782, #1785, #1790
Supabase project checked: `ujucvyyspfxlxlfdamda`

## Purpose

Continue W8.2 after the schema/RLS foundation and Supabase inventory evidence by defining the role-matrix and denied-path verification package.

## Current Supabase data discovery

The connected Supabase project was checked before role-matrix execution.

```sql
select count(*)::int as auth_user_count from auth.users;
```

Result:

| auth_user_count |
|---:|
| 3 |

```sql
select
  (select count(*)::int from public.organisations) as organisations_count,
  (select count(*)::int from public.user_org_memberships) as memberships_count,
  (select count(*)::int from public.user_roles) as roles_count,
  (select count(*)::int from public.audit_log) as audit_log_count,
  (select count(*)::int from public.qa_runs) as qa_runs_count;
```

Result:

| organisations_count | memberships_count | roles_count | audit_log_count | qa_runs_count |
|---:|---:|---:|---:|---:|
| 3 | 0 | 0 | 0 | 0 |

## Finding

The W8.2 schema/RLS migration is applied and policy inventory exists, but actor-based RLS behavior cannot yet be proven because `user_org_memberships` and `user_roles` contain no assignments.

## Verification matrix required before W8.2 full exit

| Actor | Setup requirement | Expected allowed behavior | Expected denied behavior |
|---|---|---|---|
| unauthenticated | no session/JWT | public-only routes | `/admin/*`, `/qa-dashboard` redirect to login or deny |
| viewer | active membership + `viewer` role | own-org non-admin reads where future screens allow | admin surfaces, role writes, QA runs |
| contributor | active membership + `contributor` role | own-org non-admin writes where future W8.3+ allows | admin surfaces, role writes, QA runs |
| org_admin | active membership + `org_admin` role | own-org membership/role admin and audit read | cross-org role/membership access, QA runs unless cs2_admin |
| cs2_admin | global role grant with `org_id is null` | cross-org admin/QA visibility | spoofed actor/created_by writes remain denied by constraints |

## Denied-path verification required

Routes:

- `/admin/org`
- `/admin/users`
- `/admin/settings`
- `/admin/audit-log`
- `/qa-dashboard`

Evidence required:

- unauthenticated deployed direct-load outcome;
- authenticated non-admin denied outcome;
- org-admin QA dashboard denied outcome;
- cs2-admin QA dashboard allowed outcome;
- screenshot/HAR/trace or equivalent browser output;
- no protected data visible in denied DOM.

## Current status

| Evidence item | Status | Notes |
|---|---|---|
| Schema/RLS inventory | PASS | Filed in `modules/pit/12-build/w82-supabase-rls-verification-evidence.md`. |
| Actor seed availability | BLOCKED | Membership and role tables are empty. |
| Positive actor behavior under RLS | NOT_CAPTURED | Requires seeded test assignments. |
| Negative actor behavior under RLS | NOT_CAPTURED | Requires seeded test assignments or verified JWT actors. |
| Deployed denied-path browser evidence | NOT_CAPTURED | Requires test credentials/actors or unauthenticated spot checks only. |
| Admin-nav visibility evidence | NOT_CAPTURED | Requires authenticated role-specific sessions. |
| Final W8.2 exit | NOT_READY | Role-matrix and denied-path evidence remain open. |

## Seeded actor execution requirement

Before full W8.2 exit, CS2 must approve creation of test-only membership and role rows, or provide existing test users/organisations that may be used for actor verification.

The test seed must be reversible and must not grant production users broader access outside the verification window.

## Non-overclaim

This artifact does not claim W8.2 full functional delivery. It records the role-matrix verification plan and the current data blocker after Supabase inventory evidence.
