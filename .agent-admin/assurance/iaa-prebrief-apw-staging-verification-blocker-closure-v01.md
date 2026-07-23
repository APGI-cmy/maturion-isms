# IAA Pre-Flight Brief — APW Staging Verification and Blocker Closure v0.1

IAA_PREFLIGHT_BRIEF
PR: #1951
CURRENT_HEAD_SHA: GITHUB_PR_HEAD_SHA
FINDING: APW-PRODUCTION-ACTIVATION-BLOCKER-001
WAVE: APW-STAGING-VERIFICATION-BLOCKER-CLOSURE-V01
AUTHORITY: CS2 — Johan Ras
DATE: 2026-07-22

EXPECTED_QA_SCOPE:
- Verify the merged PR #1942 classifier hardening in the approved Render staging gateway.
- Confirm private, confidential, customer, client, tenant, account and record requests route to `maturion_only`.
- Confirm configuration, credential and token requests route to `maturion_only`.
- Confirm valid public onboarding and documentation requests route to `apw_specialist_internal_draft_candidate` while enabled.
- Confirm flag-off rollback routes to `apw_integration_disabled`.
- Confirm Maturion remains the visible final public response authority.
- Confirm live route telemetry contains route-safe metadata only and no prompt or answer content.

APPROVED_TARGET:
- Environment: staging only
- Gateway: https://maturion-mat-ai-gateway-staging.onrender.com
- Feature flag: APW_SPECIALIST_PUBLIC_INTEGRATION_ENABLED

EXPECTED_FAILURE_MODES:
- A restricted prompt enters the APW Specialist draft route.
- A public onboarding/documentation prompt is incorrectly blocked.
- Private data, tenant data, credentials, tokens, secrets or internal configuration are disclosed.
- Route telemetry contains prompt or answer content.
- Health check fails.
- Rollback does not produce `apw_integration_disabled`.

STOP_CONDITIONS:
- Stop immediately and restore the staging flag to `false` if any expected route fails, any unsafe disclosure occurs, telemetry contains prompt or answer content, health degrades, or Maturion ceases to be the final visible authority.

FOREMAN_INSTRUCTIONS:
- Keep the wave limited to staging verification, redacted telemetry inspection, rollback proof, evidence capture and blocker-decision governance.
- Do not alter any production flag, production Render service, Vercel configuration or Supabase configuration.
- Do not claim blocker closure as repository-ratified until every required evidence item is complete and PR #1951 is merged.

IAA_WILL_QA:
- Verify all eleven route tests and HTTP outcomes against the approved matrix.
- Verify Maturion remained the visible final public response authority.
- Verify the staging flag was restored to `false`, health remained OK and rollback returned `apw_integration_disabled`.
- Verify redacted live telemetry shows route-safe metadata only and contains no prompt or answer content.
- Verify the final blocker status and tracker do not overclaim production authorization.

BOUNDARIES:
- No production flag or production environment change.
- No Supabase, Vercel or production Render change.
- No production activation.
- Evidence capture only after each live test result is observed.

RESULT: PREFLIGHT_BRIEF_COMPLETE
