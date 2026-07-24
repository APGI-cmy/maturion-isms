# IAA Pre-Brief — MMM Approval Workflow Foundation

**Issue:** #1961  
**Wave:** `mmm-approval-workflow-foundation-qa-red`  
**Date:** 2026-07-23  
**Authority baseline commit:** `7ba38474082bf0d3e8d054f45127cc3549a3165a`

## Assurance objective

Independently verify that the first wave creates an executable failing contract for Level 1, Level 2 and Level 3 approval behavior without implementing production approval behavior prematurely.

## Mandatory evidence

1. FRS addendum exists before this pre-brief.
2. Builder appointment exists before the first executable QA commit.
3. Tests cover T-MMM-AWF-001 through T-MMM-AWF-018 or explicitly map deferred cases.
4. Current failure is attributable to absent/incomplete production contracts, not broken fixtures or syntax.
5. Tests inspect server-side authorisation, state transitions, idempotency, expected-state/version handling, audit history, locking and tenant isolation.
6. Tests prove Level 3 gating depends on current Level 2 approvals across required domains.
7. Tests include the #1959 RLS-helper permission dependency without weakening RLS.
8. Existing descriptor regression tests remain in scope as non-regression evidence.
9. No ISMS Portal, PIT or unrelated module change enters the wave.

## Prohibited shortcuts

- UI-only approval enforcement.
- Hard-coded user IDs, organisation IDs or criterion/domain IDs in production code.
- Service-role exposure to the browser.
- generic RLS bypass or disabled policies;
- treating an audit-log write failure as non-fatal;
- mutable replacement of prior comments/transitions;
- self-approval;
- Level 3 approval before all required domains are approved at Level 2;
- silent mutation after signoff;
- production implementation in the QA-to-RED PR beyond explicitly approved test seams.

## Required red-state classification

Each failing test must be classified as one of:

- missing state-machine contract;
- missing schema/persistence authority;
- missing server-side authorisation;
- missing idempotency/concurrency control;
- missing immutable evidence;
- missing UI projection of server truth;
- unresolved RLS helper permission dependency;
- descriptor regression.

## IAA handover rule

IAA may recommend merge of the QA-to-RED authority only when failures are deterministic, expected, traceable to issue #1961, and do not arise from malformed test infrastructure.
