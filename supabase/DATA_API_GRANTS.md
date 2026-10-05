# Explicit Data API permissions

Supabase's [October 30 change](https://github.com/orgs/supabase/discussions/45329)
removes automatic Data API grants for new tables in `public`. Existing table
grants remain unchanged. RLS policies alone do not grant access to a table.

`20260923124227_explicit_data_api_grants.sql` adds a fixed, reviewed access list
for the legacy, AIMC, MMM, PIT and approval schemas represented in this repository.
It adds only reviewed table privileges and preserves RLS policy predicates without
restoring automatic grants.

- Authenticated access follows existing RLS operations, with the deliberate
  exception of PIT `projects` and `source_links`: these remain SELECT-only for
  authenticated clients, with writes through their existing RPCs.
- The public MMM and PIT organisation/role helpers are not authenticated RPCs.
  Policies use the MMM `app_private` helpers and PIT private equivalents; the
  approved PIT project write RPCs remain callable by authenticated clients.
- Anonymous grants are limited to the existing `mmm_free_assessments` SELECT and
  INSERT path. No new anonymous access is added to private tables.
- The three migration tracking tables are excluded. Backend grants cover the
  application tables, including the nine approval workflow tables.
- The four listed views must use `security_invoker=true`; listed tables must
  have RLS enabled. Unexpected object types cause an atomic rollback.
- Objects absent from a partial deployment are reported and skipped. If added
  later, grant access in that object's migration or reapply this grant migration
  after reviewing the notices. The fresh replay currently lacks `healthcheck`;
  the grant migration also accommodates its existing hosted instance.

For every future Data API table, add explicit per-role grants in the migration
that creates it, alongside RLS and policies. Include `service_role` where the
backend uses the Data API: bypassing RLS does not bypass table privileges. Grant
anonymous access only when required by the feature, and sequence USAGE if a
future insert relies on a sequence. See
[Supabase API security](https://supabase.com/docs/guides/api/securing-your-api).

## Verification

Run `python scripts/test-data-api-grants.py` with Python 3 and Docker. The Data API
grants workflow runs this check on migration changes. It uses a disposable
Postgres 17 container without network access, host mounts or hosted credentials.

Replay follows the production workflow's order: legacy, AIMC, then root
migrations. It omits the pre-seeded
`20260310000001_wave16_6_schema_audit_completeness.sql`: that migration's
`evidence_submissions` column contract does not match existing legacy consumers,
so this PR makes no Data API grant or support claim for that table. The mismatch
remains unresolved and outside this PR's scope. The replay exposed duplicate
legacy trigger names; the two existing definitions in
`20260729130000_exclusion_cascade_triggers.sql` now use DROP IF EXISTS before
CREATE, preserving their final definitions while making a fresh replay succeed.

The test reproduces missing permissions with automatic grants disabled, applies
the repair, and exercises real database roles. It checks organisation isolation,
approval access, PIT helper non-callability and the approved write RPCs,
idempotency, unchanged RLS predicates/defaults, exclusion of future private
tables, and atomic refusal when RLS is disabled. Auth and Storage use minimal
local fixtures; this is a database test, not a hosted PostgREST or browser
end-to-end test.

## Deployment

Review and merge through the existing repository gates. Production database
changes use `.github/workflows/deploy-mmm-supabase-migrations.yml`, which requires
manual dispatch from main, `CONFIRM`, and the protected production environment's
approval. Do not bypass that workflow or its review requirements.

Review the pending migration queue before dispatch: the workflow applies all
unrecorded migrations, potentially including unrelated application changes.
Existing hosted tables do not require an emergency change for this notice.
The grant migration does not alter data or revoke access; do not undo it by
blindly revoking privileges that may have existed beforehand.

### Future post-merge deployment and verification checklist

This is a future checklist only. It is not deployment authorization and does not
state that production deployment or verification has occurred. A CS2 or otherwise
authorized operator must follow the existing protected path:

- [ ] Confirm the change has merged to `main` through the normal review and
  repository gates. Do not dispatch from a PR branch or use `supabase db push`,
  direct `psql`, or another deployment path.
- [ ] Before dispatch, review the complete pending migration queue across legacy,
  AIMC, and MMM-native migrations, in that order. The protected workflow applies
  all unrecorded migrations, not only the Data API grant migration. Resolve any
  unexpected or unrelated pending work before proceeding.
- [ ] Have the authorized operator manually dispatch
  `.github/workflows/deploy-mmm-supabase-migrations.yml` from `main`, enter
  `CONFIRM` exactly, and obtain the configured `production` environment approval.
  The workflow must pass its pre-flight branch/confirmation guard and complete
  migration and schema-verification jobs; do not bypass a failed gate.
- [ ] After a successful run, verify the deployed MMM-native migration tracking
  record for `20260923124227_explicit_data_api_grants.sql` and confirm the
  production run's commit/version. Check the effective grants on `projects` and
  `source_links`: `authenticated` has `SELECT` but not `INSERT`, `UPDATE`, or
  `DELETE`; verify the migration's reviewed grants and RLS-enabled state are
  present as expected. Confirm authenticated execution remains unavailable for
  public PIT organisation/role helpers and available for the approved PIT
  project RPCs.
- [ ] Using an authenticated PIT account, verify the project register and
  project-detail reads succeed for a record in that account's own organisation.
  Verify a known project ID from another organisation is not returned by either
  read path. Record only the verification outcome and non-sensitive identifiers.
- [ ] Recheck that direct authenticated writes to `projects` and `source_links`
  remain denied by their effective privileges. Verify the existing controlled
  PIT create/update RPC paths remain available and enforce their existing
  organisation and role checks; use only the approved PIT smoke-test procedure,
  never direct table writes to set up or clean up production data.
- [ ] Record the deployment run, migration/version verification, and smoke-test
  results through the established release process. If any check fails, stop and
  route it through the authorized incident/remediation process; do not improvise
  a production grant or policy change.
