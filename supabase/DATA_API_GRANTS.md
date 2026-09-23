# Explicit Data API permissions

Supabase's [October 30 change](https://github.com/orgs/supabase/discussions/45329)
removes automatic Data API grants for new tables in `public`. Existing table
grants remain unchanged. RLS policies alone do not grant access to a table.

`20260923124227_explicit_data_api_grants.sql` adds a fixed, reviewed access list
for the legacy, AIMC, MMM, PIT and approval schemas represented in this repository.
It preserves existing privileges and policies without restoring automatic grants.

- Authenticated access follows existing RLS operations, with the deliberate
  exception of PIT `projects` and `source_links`: these remain SELECT-only for
  authenticated clients, with writes through their existing RPCs.
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
migrations. It skips the same obsolete legacy migration pre-seeded by production.
The replay exposed duplicate legacy trigger names; the two existing definitions
in `20260729130000_exclusion_cascade_triggers.sql` now use DROP IF EXISTS before
CREATE, preserving their final definitions while making a fresh replay succeed.

The test reproduces missing permissions with automatic grants disabled, applies
the repair, and exercises real database roles. It checks organisation isolation,
approval access, PIT's write boundary, idempotency, unchanged RLS and defaults,
exclusion of future private tables, and atomic refusal when RLS is disabled.
Auth and Storage use minimal local fixtures; this is a database test, not a
hosted PostgREST or browser end-to-end test.

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
