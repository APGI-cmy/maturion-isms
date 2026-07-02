# IAA Wave Record - ISMS MMM Post Auth Handoff Fix

Wave: `wave-isms-mmm-post-auth-handoff-20260701`
Date: 2026-07-01
PR: pending
Scope record: `.agent-admin/scope-declarations/wave-isms-mmm-post-auth-handoff-20260701.md`

## PRE-BRIEF

WAVE: wave-isms-mmm-post-auth-handoff-20260701
BRANCH: isms-mmm-post-auth-handoff-clean
ISSUE: Maturity Roadmap checkout reaches the correct checkout selection but mock sign-in continues to generic ISMS onboarding instead of the MMM app host.

EXPECTED_QA_SCOPE:
- Maturity Roadmap checkout continues to the MMM app host.
- Mock sign-in can continue to the MMM app host when checkout state requests it.
- PIT and bundle checkout paths keep existing behavior.
- MMM runtime is untouched.

EXPECTED_FAILURE_MODES:
- Maturity Roadmap checkout still routes to `/onboarding`.
- PIT checkout behavior changes accidentally.
- ISMS implements MMM runtime behavior.

RESULT: PREFLIGHT_BRIEF_COMPLETE

## FINAL ASSURANCE

PENDING.
