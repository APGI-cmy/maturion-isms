# IAA Wave Record - ISMS MMM Subscription Routing Fix

Wave: `wave-isms-mmm-subscription-routing-20260701`
Date: 2026-07-01
PR: #1884
Scope record: `.agent-admin/scope-declarations/wave-isms-mmm-subscription-routing-20260701.md`

## PRE-BRIEF

PR: #1884
WAVE: wave-isms-mmm-subscription-routing-20260701
BRANCH: isms-mmm-subscription-routing
ISSUE: Maturity Roadmap marketing subscription path enters the PIT checkout flow because the ISMS subscription catalogue only exposes Project Implementation Tracker.

EXPECTED_QA_SCOPE:
- Maturity Roadmap marketing CTA opens checkout with `modules=maturity-roadmap`.
- Static ISMS subscription catalogue includes `maturity-roadmap`.
- PIT subscription and runtime behavior are unchanged.
- MMM runtime is untouched.

EXPECTED_FAILURE_MODES:
- Maturity Roadmap still routes to generic `/subscribe` and defaults to PIT.
- Checkout records `project-implementation` instead of `maturity-roadmap`.
- ISMS implements MMM runtime behavior.
- PIT runtime or PIT routing changes accidentally.

FOREMAN_INSTRUCTIONS:
- Verify the diff remains limited to ISMS subscription/marketing routing and governance evidence.
- Verify no MMM runtime, PIT runtime, Supabase, or deployment workflow files are changed.

IAA_WILL_QA:
- Confirm PR #1884 has scope, IAA, builder appointment, and delegation-order records.
- Confirm CI and governance gates pass before merge disposition.

RESULT: PREFLIGHT_BRIEF_COMPLETE

## FINAL ASSURANCE

PENDING.
