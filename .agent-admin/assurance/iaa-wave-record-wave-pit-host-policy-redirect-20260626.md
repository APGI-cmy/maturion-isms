# IAA Wave Record - PIT Host Policy Redirect

WAVE: wave-pit-host-policy-redirect-20260626
PR: #1865
CURRENT_HEAD_SHA: GITHUB_PR_HEAD_SHA
WAVE_TASKS_PATH: .agent-workspace/foreman-v2/personal/wave-current-tasks.md
REPOSITORY: APGI-cmy/maturion-isms
SCOPE_RECORD: .agent-admin/scope-declarations/wave-pit-host-policy-redirect-20260626.md
BRANCH: foreman/pit-host-policy-redirect-governed

IAA_PREFLIGHT_BRIEF:

EXPECTED_QA_SCOPE:
  - Verify that maturion-pit.vercel.app redirects to the canonical ISMS host instead of rendering a duplicate public acquisition surface.
  - Verify that maturion-pit.vercel.app/pit/tracker redirects to maturion-isms-portal.vercel.app/pit/tracker while preserving route intent.
  - Verify that the canonical ISMS host does not redirect away from itself.
  - Verify that PR #1861 entitlement behavior remains intact after host-policy correction.

EXPECTED_FAILURE_MODES:
  - PIT deployment host continues rendering the duplicate ISMS public landing page.
  - Canonical ISMS host enters a redirect loop or redirects away from itself.
  - Runtime deep links lose path, query string, or hash during canonical-host redirect.
  - Host-policy correction changes PIT runtime behavior instead of only routing to the canonical host.

FOREMAN_INSTRUCTIONS:
  - Treat this as a narrow PIT-RED-BND-007 host-policy correction only.
  - Do not claim W8.2 closure from this PR alone.
  - Require post-deployment browser evidence before marking the host-policy test green.
  - Preserve the boundary that ISMS owns the public acquisition host and PIT runtime remains canonical under the ISMS host.

IAA_WILL_QA:
  - Review the diff for host-policy scope containment.
  - Confirm that no PIT runtime feature implementation is introduced.
  - Confirm that no Supabase, billing, payment, pricing, or entitlement storage changes are introduced.
  - Confirm that production evidence expectations remain explicit and non-completion wording is preserved.

RESULT: PREFLIGHT_BRIEF_COMPLETE

## FINAL ASSURANCE

PENDING.
