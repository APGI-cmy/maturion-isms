# PR #1973 Wave Current Tasks — MMM Private-Helper RLS Policy Alignment

**Wave:** `mmm-private-helper-policy-alignment-1959`  
**Session:** `session-mmm-private-helper-policy-alignment-1959-20260727`  
**Issue:** #1959  
**PR:** #1973  
**Branch:** `fix/issue-1959-private-helper-policy-alignment`  
**Base SHA:** `f6454c00719181cca7f31aff0e0909a63772750d`  
**Supabase target:** `ujucvyyspfxlxlfdamda`  
**CS2:** Johan Ras  
**Status:** TASK SET COMMITTED / IAA PRE-BRIEF COMPLETE at `aad6ee6f…` WITH TIMING CORRECTION `70cef205…` / SCHEMA BUILDER APPOINTED at `4b0f36bd…` / GOVERNANCE LAYER-DOWN CORRECTION MERGED VIA #1984 / SCHEMA-BUILDER WAKE-UP PASSED AT `3087aa2e…` / QA-TO-RED PENDING / IMPLEMENTATION NOT STARTED

iaa_wave_record_path: .agent-admin/assurance/iaa-wave-record-mmm-private-helper-policy-alignment-1959-20260727.md
iaa_prebrief_path: .agent-admin/assurance/iaa-wave-record-mmm-private-helper-policy-alignment-1959-20260727.md
IAA_PREFLIGHT_BRIEF_REVIEWED: yes
IAA_PREFLIGHT_BRIEF_PATH: .agent-admin/assurance/iaa-wave-record-mmm-private-helper-policy-alignment-1959-20260727.md
IAA_PREFLIGHT_BRIEF_SHA_OR_TIMESTAMP: aad6ee6f09fc7f5c77244b5b9d35b92255905f48
FOREMAN_CONSUMED_PREFLIGHT_BEFORE_IMPLEMENTATION: yes
BUILDER_DELEGATION_INCLUDES_PREFLIGHT_SCOPE: yes

## Frozen-contract preflight

- Current `main` remains the PR base `f6454c00719181cca7f31aff0e0909a63772750d`.
- PR head before this task set was `2275f5b7ef4605a040ec091ce49f62b1156223bc`, containing only the Issue #1959 scope carrier.
- Issue #1959 and PR #1973 agree on the same seven deployed policy targets and preserve the private-helper model.
- The automated PR comment copied the stale PR #1893 descriptor-hardening task list. It is explicitly non-authoritative for this wave and is displaced by this PR-scoped file.
- Independent IAA reviewed this task set at `f394cc44…` and committed the canonical pre-brief at `aad6ee6f…` using the live protocol/schema.
- No migration, test implementation or database mutation exists or is authorized yet.
- The appointed schema-builder wake-up was run at PR head `d4f7753c…` and
  halted because all 203 CANON inventory entries lack canonical commit-SHA
  provenance. The blocker and mandatory sequencing disclosure are recorded in
  the schema-builder workspace. Supabase CLI migration generation did not run.
- After governance PR #1375 and ISMS corrective PR #1984 were merged, corrected
  `main` was administratively merged into PR #1973 at `3087aa2e…`. The
  canonical schema-builder wake-up was rerun at 2026-07-28T09:36:04Z and
  passed all phases: 203 artifacts, zero invalid hashes, zero missing canonical
  commit-SHA provenance, zero pending escalations, and no governance drift.
- No migration, test implementation, runtime, database or Supabase mutation has
  occurred after the successful wake-up. The next governed step is QA-to-Red for
  the seven-policy scope.

## Qualifying task set

| Task | Summary | Assurance category | Current status |
|---|---|---|---|
| RLS-1959-01 | Freeze the seven-policy inventory, private-helper grant boundary and exact non-scope | SECURITY_ARCHITECTURE / GOVERNANCE_EVIDENCE | COMPLETE |
| RLS-1959-02 | Create PR-scoped manifest, scope and active task carriers | GOVERNANCE_EVIDENCE | COMPLETE |
| RLS-1959-03 | Independent IAA classifies the wave and writes the canonical pre-brief into the declared wave record | SECURITY_ASSURANCE / GOVERNANCE_EVIDENCE | COMPLETE — pre-brief `aad6ee6f…`; timing correction `70cef205…` |
| RLS-1959-04 | Foreman records a bounded schema-builder appointment before implementation; the schema-valid PR-scoped machine proof follows the first implementation commit | DELEGATION / GOVERNANCE_EVIDENCE | APPOINTMENT COMPLETE `4b0f36bd…`; machine proof pending first implementation SHA |
| RLS-1959-05 | Schema builder authors one idempotent migration that recreates only the seven named policies with `app_private.mmm_current_user_org_id()` | DATABASE_SCHEMA / RLS_SECURITY | READY AFTER QA-TO-RED — wake-up clear; implementation not started |
| RLS-1959-06 | Schema builder implements structural tests for seven private-helper references and unchanged hardened helper grants | DATABASE_QA / SECURITY_QA | QA-TO-RED PENDING — wake-up clear |
| RLS-1959-07 | Schema builder implements authenticated same-org, cross-org and anonymous criteria/descriptor/storage path tests without `service_role` masking | RLS_SECURITY / TENANT_ISOLATION | QA-TO-RED PENDING — wake-up clear |
| RLS-1959-08 | Run focused and regression suites; Foreman QP; ECAP; freeze current head; obtain independent final IAA | QUALITY / ADMINISTRATION / INDEPENDENT_ASSURANCE | BLOCKED BY RLS-1959-05..07 |
| RLS-1959-09 | CS2 review and merge, governed migration deployment, read-only live verification, Issue #1959 closure | MERGE / DEPLOYMENT_ASSURANCE | BLOCKED BY RLS-1959-08 |
| RLS-1959-10 | Reconcile the MMM tracker for PRs #1958/#1962 and prepare the separate #1961 build-to-GREEN lane | SUCCESSOR_CONTROL | BLOCKED BY RLS-1959-09; OUTSIDE PR #1973 IMPLEMENTATION |

## Exact implementation target

The future migration may replace only:

1. `public.mmm_criteria.mmm_criteria_update_own_org`;
2. `public.mmm_level_descriptors.mmm_level_descriptors_insert_own_org`;
3. `public.mmm_level_descriptors.mmm_level_descriptors_update_own_org`;
4. `storage.objects.mmm_evidence_org_read_v2`;
5. `storage.objects.mmm_evidence_org_insert_v2`;
6. `storage.objects.mmm_evidence_org_update_v2`;
7. `storage.objects.mmm_evidence_org_delete_v2`.

The intended replacement is the already-deployed `app_private.mmm_current_user_org_id()` helper. The migration must be idempotent and must preserve the existing policy actions, roles, bucket/path predicates and same-organisation semantics except for the qualified helper reference.

## Build-to-GREEN acceptance tests

1. Policy inventory proves exactly seven intended policies changed and no other policy, helper or grant changed.
2. All seven resulting policy expressions contain `app_private.mmm_current_user_org_id()`.
3. No resulting policy contains an unqualified or `public.mmm_current_user_org_id()` call.
4. `authenticated` retains only the intended `USAGE`/private-helper execution capability; `anon` cannot use or execute the private helpers.
5. Neither `anon` nor `authenticated` receives execution on the legacy public helpers.
6. Authenticated same-organisation criteria update, descriptor insert/update and evidence storage operations evaluate without `42501`.
7. Authenticated cross-organisation operations remain denied for all affected table/storage paths.
8. Anonymous operations remain denied.
9. Tests exercise actual authenticated/RLS identities and do not substitute `service_role` for tenant-path proof.
10. Existing descriptor live-closure and merged approval QA-to-RED authority remain green.
11. Migration reapplication is safe or deterministically idempotent.
12. Frozen-head GitHub checks, QP, ECAP and independent IAA pass before CS2 merge.
13. Post-merge deployment is applied only through the governed migration route, followed by read-only live inspection of project `ujucvyyspfxlxlfdamda`.

## Required order

`scope 2275f5b7… -> task set f394cc44… -> canonical IAA pre-brief aad6ee6f… -> IAA timing correction 70cef205… -> schema-builder appointment 4b0f36bd… -> first migration/test implementation -> machine delegation proof -> QP -> ECAP -> frozen-head final IAA -> CS2 merge -> governed deployment -> live verification -> #1959 closure`

## Appointment constraints

The schema builder appointment may authorize repository migration and test authorship only. The schema-valid machine delegation-order JSON is finalized after the first implementation SHA exists and before QP/handover, exactly as corrected by IAA at `70cef205…`. It must not authorize direct Supabase mutation, public-helper grants, approval-workflow implementation, UI/Edge Function work, merge, deployment, assurance self-certification or issue closure.

## Stop conditions

- IAA pre-brief is missing, malformed, stale or not bound to PR #1973.
- Appointment precedes the canonical pre-brief, or implementation precedes appointment.
- The seven-policy inventory changes without Foreman/CS2 re-scope and refreshed IAA pre-brief.
- Any helper body, helper grant, unrelated policy, generic privilege or `service_role` exposure changes.
- Same-org success is shown only with bypass/service credentials.
- Cross-org or anonymous denial weakens.
- Tests are skipped, vacuous, non-executable or weaken merged RED authority.
- Hosted gates, QP, ECAP or independent IAA are incomplete or reject.
- Database mutation is attempted before merge and governed deployment authority.
