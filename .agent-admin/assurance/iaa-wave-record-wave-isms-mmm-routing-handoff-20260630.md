# IAA Wave Record - ISMS MMM Routing Handoff

Wave: `wave-isms-mmm-routing-handoff-20260630`
Date: 2026-06-30
Scope record: `.agent-admin/scope-declarations/wave-isms-mmm-routing-handoff-20260630.md`

## PRE-BRIEF

PR: #1879
CURRENT_HEAD_SHA: pending-final-head
WAVE: wave-isms-mmm-routing-handoff-20260630
BRANCH: isms-mmm-routing-gated
ISSUE: Entitled Maturity Roadmap users land on the ISMS preview instead of the MMM app.

EXPECTED_QA_SCOPE:
- Dashboard Maturity Roadmap opens the MMM app for entitled users.
- ISMS landing page Maturity Roadmap card opens the MMM app for entitled users.
- ISMS `/modules` Maturity Roadmap card opens the MMM app for entitled users.
- Non-entitled Maturity Roadmap users remain on ISMS marketing/subscription paths.
- MMM runtime remains untouched.

EXPECTED_FAILURE_MODES:
- ISMS implements MMM runtime behavior.
- Non-entitled users skip ISMS acquisition.
- PIT routing is altered by this change.
- The handoff uses an internal ISMS preview route instead of the MMM app host.

FOREMAN_INSTRUCTIONS:
- Verify the diff remains limited to ISMS routing/handoff and governance evidence.
- Verify no MMM runtime, PIT runtime, Supabase, or deployment workflow files are changed.
- Verify route helper coverage distinguishes external MMM host routing from internal ISMS routes.

IAA_WILL_QA:
- Confirm scope, builder appointment, and delegation-order records exist.
- Confirm PR number in governance artifacts matches PR #1879.
- Confirm all required CI and governance checks pass before merge disposition.

RESULT: PREFLIGHT_BRIEF_COMPLETE

## FINAL ASSURANCE

PENDING.
