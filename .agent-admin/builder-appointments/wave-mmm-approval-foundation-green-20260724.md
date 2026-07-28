# Builder Appointment — MMM Approval Workflow Foundation Build-to-GREEN

**Issue:** #1961  
**Security prerequisite:** #1959  
**Wave:** `mmm-approval-workflow-foundation-green`  
**Appointed role:** MMM Runtime Builder  
**Date:** 2026-07-24

## Upstream authority

- Merged QA authority: PR #1962
- Runtime IAA pre-brief commit: `02c6419f3962bcb8fd4395a7822a0eceec5231c5`
- Approval FRS: `modules/MMM/02-frs/approval-workflow-foundation-frs-addendum.md`
- QA contract: `modules/MMM/05-qa-to-red/approval-workflow-foundation-qa-to-red.md`

This appointment exists before the first #1961 runtime implementation commit. The earlier migration commit on this branch is the separately authorised #1959 security prerequisite and is not approval runtime implementation.

## Authorised work

1. Preserve the hardened `app_private` RLS helper model and reconcile stale policies.
2. Implement the central approval state machine under `apps/mmm/src/lib/approval/`.
3. Harden `mmm-domain-approval-action` for Level 1/2 transitions.
4. Implement `mmm-framework-approval-action` for Level 3 transitions.
5. Add idempotent persistence for immutable transitions and concurrency/idempotency evidence where required.
6. Register the new Edge Function and project server truth into existing MMM approval UI surfaces.
7. Reconcile the MMM progress tracker.
8. Make the merged approval foundation QA contract GREEN without weakening it.

## Authorised paths

- `apps/mmm/src/lib/approval/**`
- `apps/mmm/src/components/assessment/DomainAuditBuilder.tsx`
- `apps/mmm/src/pages/AssessmentFrameworkHandoffPage.tsx`
- `supabase/functions/mmm-domain-approval-action/**`
- `supabase/functions/mmm-framework-approval-action/**`
- `supabase/migrations/20260724*.sql`
- `supabase/config.toml`
- `modules/MMM/tests/B4-framework/approval-workflow-foundation-red.test.ts`
- focused approval tests/evidence
- `modules/MMM/BUILD_PROGRESS_TRACKER.md`
- PR-scoped governance evidence

## Prohibitions

- No public helper RPC restoration.
- No service-role browser exposure.
- No self-approval.
- No UI-only security.
- No mutable audit-history replacement.
- No descriptor-generation redesign.
- No ISMS Portal, PIT, billing or unrelated module changes.
- No weakening tests to obtain GREEN.

## Handover requirements

Provide exact test evidence, #1959 production verification, changed-file boundary, current-head gate status, unresolved-thread status and explicit non-scope confirmation before merge recommendation.