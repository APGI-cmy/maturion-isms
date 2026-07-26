# Scope Declaration — Issue #1959 MMM Private-Helper RLS Policy Alignment

**Status:** AUTHORIZED / ACTIVE / IMPLEMENTATION NOT YET APPOINTED  
**CS2 authority:** Johan Ras, 2026-07-26  
**Base SHA:** `f6454c00719181cca7f31aff0e0909a63772750d`  
**Branch:** `fix/issue-1959-private-helper-policy-alignment`  
**Issue:** #1959  
**Supabase target:** `ujucvyyspfxlxlfdamda` (`APGI-cmy's Project`)  
**Module/product impact:** MMM RLS policies only; no approval-workflow runtime implementation

## Authorized outcome

Align exactly seven deployed MMM policies with the existing `app_private.mmm_current_user_org_id()` helper so authenticated same-organisation policy evaluation no longer fails with `42501`, while cross-organisation and anonymous paths remain denied.

## Live read-only baseline

On 2026-07-26, connected project inspection confirmed:

- `authenticated` can execute `app_private.mmm_current_user_org_id()` and `app_private.mmm_current_user_role()` and has `USAGE` on `app_private`;
- `anon` cannot use the schema or execute the private helpers;
- `anon` and `authenticated` cannot execute the legacy `public` helpers;
- most MMM policies already call `app_private`;
- exactly seven stale policies still call the unqualified/public organisation helper: `mmm_criteria_update_own_org`, descriptor insert/update, and the four `mmm_evidence_org_*_v2` storage policies.

## Initial carrier

This first commit creates only the bounded issue scope needed to open a draft PR and obtain a stable PR number. The PR-scoped task carrier, canonical IAA pre-brief, schema-builder appointment/delegation, migration and test implementation, QP, ECAP, prehandover, final IAA, merge, deployment, and live verification must follow in governed order.

## Planned file scope

- `.agent-admin/scope-declarations/issue-1959.md` — this bounded authority carrier.
- `.admin/prs/pr-<PR_NUMBER>.json` — PR-scoped manifest.
- `.agent-admin/scope-declarations/pr-<PR_NUMBER>.md` — exact PR scope.
- `.agent-admin/prs/pr-<PR_NUMBER>/wave-current-tasks.md` — active task and acceptance register.
- `.agent-admin/assurance/iaa-wave-record-mmm-private-helper-policy-alignment-1959-20260726.md` — canonical pre-brief and final assurance carrier.
- `.agent-admin/builder-appointments/issue-1959-schema-builder.md` and `.agent-admin/control/delegation-orders/pr-<PR_NUMBER>.json` — ordered bounded appointment evidence.
- One new Supabase migration generated through the repository/Supabase CLI convention after appointment; it may alter only the seven named policies and preserve existing helper grants.
- Focused executable schema/security tests proving private-helper references, same-org success, cross-org denial, anonymous denial, and no public-helper grant.
- PR-scoped QP, ECAP, Foreman session/prehandover, and exact-head evidence paths required by the live gates.

## Non-scope

- Granting `anon` or `authenticated` execution on either legacy `public` helper.
- Changing the private helper bodies or weakening their grants/search paths.
- Disabling or bypassing RLS.
- Generic table privilege broadening or `service_role` exposure.
- Descriptor reasoning, UI, Edge Function, approval-workflow, Vercel, or infrastructure implementation.
- Direct database mutation before the governed migration/deployment stage.
- Direct push to `main` or IAA self-certification.

## Acceptance boundary

- All seven named policy definitions call `app_private.mmm_current_user_org_id()` and contain no unqualified/public helper call.
- Existing private/public helper grants remain unchanged and hardened.
- Authenticated same-org criteria, descriptor, and storage policy paths evaluate without `42501`.
- Authenticated cross-org and anonymous paths remain denied.
- Existing descriptor closure and approval QA-to-RED tests remain green.
- Frozen-head CI, QP, ECAP where required, and independent IAA pass before CS2 merge.
- Post-merge governed deployment and read-only live verification confirm the exact target state before Issue #1959 closes.

## Stop conditions

The wave halts if the canonical pre-brief is missing, appointment does not precede implementation, scope expands beyond the seven policies and focused tests, the public helper is re-exposed, any denial boundary weakens, CI is incomplete, or independent IAA does not PASS.
