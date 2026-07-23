# IAA Pre-Flight Brief — APW AI Cost Containment and Model Routing v0.1

IAA_PREFLIGHT_BRIEF
PR: PENDING
CURRENT_HEAD_SHA: GITHUB_PR_HEAD_SHA
WAVE: APW-AI-COST-CONTAINMENT-MODEL-ROUTING-V01
AUTHORITY: CS2 — Johan Ras
DATE: 2026-07-23

EXPECTED_QA_SCOPE:
- Prove the public APW chat performs zero paid model calls when the APW integration flag is off.
- Prove restricted/private/configuration/token requests perform zero paid model calls.
- Prove paid public-chat calls are disabled by default unless explicitly enabled.
- Prove an unapproved model identifier cannot override the low-cost allowlist.
- Prove output-token and daily-call ceilings are enforced.
- Prove telemetry records route, response mode, containment reason, model and numeric token usage without logging prompts or answers.
- Preserve valid public APW onboarding routing and Maturion final-response authority.

EXPECTED_FAILURE_MODES:
- A flag-off or restricted request invokes OpenAI.
- Paid calls are enabled implicitly.
- An expensive or unapproved model is accepted through an environment variable.
- Token or daily-call ceilings can be bypassed.
- Prompt or answer content appears in telemetry.
- Existing private-request routing or rollback behaviour regresses.

STOP_CONDITIONS:
- Any live paid call occurs when containment should apply.
- Any private, restricted, credential or configuration request reaches a paid model.
- Any secret, prompt or answer content is logged.
- Existing route safety tests regress.

FOREMAN_INSTRUCTIONS:
- Keep the remediation limited to public-chat cost containment, model allowlisting, token/call ceilings, safe usage telemetry, tests and operator documentation.
- Do not activate production.
- Do not enable paid calls in Render during this PR.
- Do not modify Supabase or Vercel configuration.

IAA_WILL_QA:
- Review all changed code and tests.
- Verify zero-call containment paths with regression tests.
- Verify model allowlist and numeric ceilings.
- Verify telemetry-content safety.
- Verify no production activation or environment change is included.

RESULT: PREFLIGHT_BRIEF_COMPLETE
