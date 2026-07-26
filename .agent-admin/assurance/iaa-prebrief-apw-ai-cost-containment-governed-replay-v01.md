# IAA Pre-Flight Brief — APW AI Cost Containment Governed Replay v0.1

IAA_PREFLIGHT_BRIEF
PR: #1967
WAVE: APW-AI-COST-CONTAINMENT-GOVERNED-REPLAY-V01
BRANCH: apw-ai-cost-containment-governed-replay-v01
WAVE_TASKS_PATH: .agent-admin/prs/pr-1967/wave-current-tasks.md
CURRENT_HEAD_SHA: GITHUB_PR_HEAD_SHA
AUTHORITY: CS2 — Johan Ras
DATE: 2026-07-26

EXPECTED_QA_SCOPE:
- Prove that public-chat requests make zero paid model calls when APW integration is disabled.
- Prove that private, confidential, client, customer, account, record, token, credential, secret and internal-configuration requests make zero paid model calls.
- Prove paid public-chat calls require explicit `MATURION_PUBLIC_CHAT_PAID_CALLS_ENABLED=true`.
- Prove only the approved low-cost model `gpt-4o-mini` can be selected.
- Prove output-token ceilings and a bounded daily paid-call ceiling are enforced.
- Prove telemetry records route, response mode and numeric token usage without prompt or answer content.
- Preserve Maturion as final visible public-response authority.

EXPECTED_FAILURE_MODES:
- OpenAI is called while APW integration is disabled.
- A restricted request invokes a paid model.
- An unapproved model override is honoured.
- Paid calls occur without explicit enablement.
- Token or daily-call limits are bypassed.
- Telemetry exposes prompt or answer content.
- Existing safe public APW routing regresses.

STOP_CONDITIONS:
- Stop if any zero-paid-call path invokes OpenAI.
- Stop if private or restricted content reaches a paid model.
- Stop if an unapproved model can be selected.
- Stop if telemetry contains prompt or answer content.
- Stop if the remediation changes any Render, Vercel, Supabase or production environment.

FOREMAN_INSTRUCTIONS:
- Enforce strict prebrief → builder appointment → implementation → tests → delegation evidence order.
- Keep the change limited to `apps/mat-ai-gateway` public-chat cost containment and its governance evidence.
- Do not activate production or enable paid calls.
- Do not weaken existing privacy routing or Maturion final-response authority.

IAA_WILL_QA:
- Review commit ancestry and delegation evidence.
- Verify zero-call regression tests.
- Verify low-cost model allowlisting and ceilings.
- Verify safe telemetry content.
- Verify no production/environment mutation is included.

RESULT: PREFLIGHT_BRIEF_COMPLETE
