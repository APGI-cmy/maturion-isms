# PIT Stage 12 W8.2 RLS Schema and Policy Evidence

Issue: maturion-isms#1774
Branch: pit-stage12-w82-rls-schema

## Review of PR #1782

PR #1782 is accepted as a W8.2 foundation slice. It added protected admin route shells and a local access-decision helper with tests. It did not claim full W8.2 exit, live Supabase RLS execution, database query evidence, deployed denied-path screenshots, or full role-matrix execution.

## Continuation scope

This PR adds the database/RLS foundation required for the rest of W8.2:

- `user_org_memberships`
- `user_roles`
- `audit_log`
- `qa_runs`
- helper functions for organisation membership and role checks
- RLS policies for org membership, admin role management, append-only audit insertion, and CS2-only QA run access
- frontend role vocabulary alignment from `platform_admin` to `cs2_admin`

## Architecture alignment

The PIT architecture defines the role hierarchy as:

`cs2_admin > org_admin > project_manager > team_leader > contributor > viewer`

This PR aligns the frontend access helper and schema policy vocabulary to that hierarchy.

## W8.2 coverage mapping

| Requirement area | Evidence in this PR |
|---|---|
| Org/user/role foundations | Migration creates membership and role tables with org-scoped uniqueness. |
| Role hierarchy enforcement | Role check constraint and helper use PIT role vocabulary. |
| Cross-org denial | RLS helper checks membership/role against target org. |
| Admin-route scope control | PR #1782 protected route shells plus this PR's admin role policies. |
| Audit surface | `audit_log` is org-scoped; members may append, admins may read. |
| QA dashboard restriction | `qa_runs` select/write policies require `cs2_admin`. |

## Supabase discovery evidence before PR

Connected project `ujucvyyspfxlxlfdamda` was inspected before this migration PR. It contained `public.organisations` but not the W8.2 PIT-specific `user_org_memberships`, `user_roles`, `audit_log`, or `qa_runs` tables. Existing public tables had RLS enabled. Existing helper functions included MMM-specific org/role helpers only, not PIT-specific helpers.

## Evidence not yet claimed

- Migration has not been applied to production Supabase by this PR.
- No live query output proves RLS behavior yet.
- No deployed denied-path screenshots yet.
- No full role matrix against live auth identities yet.
- No full W8.2 exit claim.

## Next evidence after merge

After merge, run the migration against Supabase, then capture:

- `pg_class` RLS-enabled output for W8.2 tables
- `pg_policies` output for W8.2 tables
- role-negative-path checklist using seeded or real test actors
- deployed denied-path spot checks for `/admin/*` and `/qa-dashboard`

## Non-overclaim

This is a W8.2 schema/RLS foundation PR. It does not claim Stage 12 completion or PIT FUNCTIONAL_PASS.
