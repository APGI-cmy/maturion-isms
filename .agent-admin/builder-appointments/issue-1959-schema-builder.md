# Bounded Appointment — Issue #1959 MMM Private-Helper RLS Policy Alignment

**Status:** APPOINTED — REPOSITORY IMPLEMENTATION AUTHORITY ONLY  
**Appointment timestamp:** 2026-07-27T07:44:38Z  
**Appointing authority:** Johan Ras (CS2), by direct instruction to create PR #1973's task set and IAA pre-brief and then appoint the schema builder before implementation  
**Orchestrating role:** `foreman-v2-agent`  
**Executing builder:** `schema-builder`  
**Issue:** #1959  
**PR:** #1973  
**Wave:** `mmm-private-helper-policy-alignment-1959`  
**Branch:** `fix/issue-1959-private-helper-policy-alignment`  
**Base SHA:** `f6454c00719181cca7f31aff0e0909a63772750d`  
**Supabase target for post-merge deployment only:** `ujucvyyspfxlxlfdamda`  
**Canonical IAA pre-brief:** `.agent-admin/assurance/iaa-wave-record-mmm-private-helper-policy-alignment-1959-20260727.md`  
**Pre-brief commit:** `aad6ee6f09fc7f5c77244b5b9d35b92255905f48`  
**IAA timing-correction commit:** `70cef205b5bc7c867b706a4b34ec6c320a42ca1f`  
**Task authority:** `.agent-admin/prs/pr-1973/wave-current-tasks.md`

## Appointment nature

This is the issue-specific Foreman wave-start appointment for the schema builder under the existing MMM Stage 11 builder fitness and appointment authority in `modules/MMM/10-builder-appointment/builder-contract.md` §3.1. It does not reopen the full B1 schema wave and does not authorize any table, column, index, bucket, helper body or unrelated RLS redesign.

The builder is appointed only to bring RLS-1959-05 through RLS-1959-07 to evidence-backed GREEN within this PR. The appointment is a repository implementation instruction, not database deployment authority.

## Exact authorized outcome

Author one idempotent Supabase migration and focused executable tests that align exactly these seven policies to `app_private.mmm_current_user_org_id()` while preserving every other policy property:

1. `public.mmm_criteria.mmm_criteria_update_own_org`;
2. `public.mmm_level_descriptors.mmm_level_descriptors_insert_own_org`;
3. `public.mmm_level_descriptors.mmm_level_descriptors_update_own_org`;
4. `storage.objects.mmm_evidence_org_read_v2`;
5. `storage.objects.mmm_evidence_org_insert_v2`;
6. `storage.objects.mmm_evidence_org_update_v2`;
7. `storage.objects.mmm_evidence_org_delete_v2`.

The migration must preserve the existing command, target role, USING/WITH CHECK structure, bucket and object-path predicates, and same-organisation semantics except for replacing the stale helper reference with the existing private helper.

## Authorized repository write scope

After this appointment commit, the schema builder may create:

- exactly one migration created first through the installed Supabase CLI using `supabase migration new <descriptive-name>`;
- one focused executable test file under `modules/MMM/tests/B1-schema/` for the Issue #1959 structural and identity-path obligations;
- only the smallest existing test configuration/runner update demonstrably required to execute that focused file, with the PR manifest and scope declaration updated before such a path is changed;
- the builder evidence needed to report commands, outcomes and exact file/policy parity;
- PR-scoped governance carrier updates already authorized by the Foreman task set.

The schema builder must discover the actual CLI command and flags with `supabase --help`, `supabase migration --help` and `supabase migration new --help`; it may not invent a migration filename.

## First implementation actions

1. Reconfirm that the PR ancestry contains task-set head `f394cc44…`, pre-brief commit `aad6ee6f…`, timing-correction commit `70cef205…`, and this appointment commit in that order.
2. Confirm no migration, `*.test.*`, `*.spec.*`, application or live-database change predates this appointment.
3. Run the Supabase CLI discovery commands and record the version/help evidence.
4. Generate the single migration file through the CLI.
5. Capture exact pre-change definitions for all seven policies and preserve every non-helper predicate.
6. Implement the migration and focused tests in a distinct later commit.
7. After the first implementation commit exists, finalize `.agent-admin/control/delegation-orders/pr-1973.json` with the real three-commit lineage before QP or handover.

## Binding security conditions

- Preserve the deployed `app_private` helper bodies, pinned search paths, schema privileges and current minimum EXECUTE grants.
- Do not grant `anon` or `authenticated` execution on either legacy public helper.
- Do not grant `anon` access to `app_private`.
- Do not broaden table, sequence, schema, storage or function privileges.
- Do not disable, bypass or weaken RLS.
- Do not introduce `service_role` into browser/client code or use it as proof of tenant-path behavior.
- Use actual authenticated and anonymous/RLS identities for same-org, cross-org and anonymous proof.
- Treat UPDATE paths as requiring the existing SELECT plus USING/WITH CHECK semantics; do not silently narrow or broaden them.
- Preserve storage bucket and object-path predicates and all existing actions/roles.

## Mandatory evidence

- Supabase CLI version/help and migration-generation command.
- Exact generated migration path.
- Before/after policy definition matrix for all seven names.
- Proof that only the helper qualification changed in each policy.
- Structural tests: seven private-helper references, zero unqualified/public references, hardened grants unchanged.
- Authenticated same-org criteria update, descriptor insert/update and evidence-storage success without `42501`.
- Authenticated cross-org denial and anonymous denial across affected paths.
- Proof that tenant-path tests did not use `service_role` or BYPASSRLS.
- Migration safe-reapplication/idempotency evidence.
- Existing descriptor live-closure and approval QA-to-RED regression results.
- Exact changed-file and commit-order evidence.
- Explicit statement that no live Supabase mutation occurred during repository implementation.

## Per-wave role assignment

| Role | Assigned role | Status and boundary |
|---|---|---|
| Builder | `schema-builder` | CONFIRMED — sole implementation writer for the bounded migration/test scope |
| QA | `qa-builder` | CONFIRMED — executes/reviews focused and regression QA independently of schema authorship |
| Integration | `integration-builder` | CONFIRMED — no-change boundary verification only; no integration implementation |
| ECAP | `execution-ceremony-admin-agent` | CONFIRMED — administrative validation after Foreman QP |
| IAA | `independent-assurance-agent` | CONFIRMED — final frozen-head assurance only; no implementation contribution |

All five roles are assigned for the wave. Only `schema-builder` receives implementation write authority from this appointment.

## Authority exclusions

This appointment does not authorize:

- any direct Supabase SQL execution, migration application, branch creation, production mutation or deployment;
- changes to helper functions or grants;
- changes to another policy, schema object, application runtime, UI, Edge Function, Vercel, Render or infrastructure surface;
- Level 1/2/3 approval-workflow implementation under Issue #1961;
- use of service or secret keys in repository evidence;
- alteration or weakening of merged RED tests;
- Foreman QP self-performance by the builder;
- ECAP, IAA, CS2 merge, issue-closure or waiver authority;
- direct push to `main`.

## Delegation-order timing

The IAA correction at `70cef205…` is binding. This appointment is committed before implementation. The schema-valid machine delegation-order JSON cannot be finalized until the first implementation SHA exists. It must then prove:

`pre-brief aad6ee6f… -> this appointment commit -> first implementation commit`

as three distinct commits, and must be committed before QP or handover. Placeholder or synthetic SHAs are prohibited.

## Stop conditions

Stop and return to Foreman if the seven-policy live inventory changes; an existing policy definition cannot be reproduced without semantic drift; the CLI cannot generate the migration convention safely; a test requires privileged bypass to prove tenant behavior; any helper/grant/policy outside scope would change; a denial boundary weakens; implementation appears before this appointment; the machine lineage cannot be proven; or any test/gate/assurance result is incomplete or failing.

## Appointment disposition

`schema-builder` is now formally appointed for the bounded PR #1973 repository implementation lane. Migration and test implementation may begin only in a later commit. Live Supabase deployment remains blocked until CS2 merge and separate governed deployment authority.
