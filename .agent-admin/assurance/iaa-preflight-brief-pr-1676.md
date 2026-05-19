# IAA Pre-flight Brief — PR #1676

IAA_PREFLIGHT_BRIEF
PR: #1676
ISSUE: #1675
CURRENT_HEAD_SHA: CURRENT_HEAD

FOREMAN_OBJECTIVE:
- Harden `foreman-v2-agent.md` to enforce ECAP-era invocation, preflight, and failed-gate routing controls before handover posture.

EXPECTED_QA_SCOPE:
- `.github/agents/foreman-v2-agent.md`
- `.admin/prs/pr-1676.json`
- `.agent-admin/scope-declarations/pr-1676.md`
- `.agent-admin/assurance/iaa-prebrief-pr1676.md`
- `.agent-admin/assurance/iaa-preflight-brief-pr-1676.md`
- `.agent-admin/assurance/iaa-token-pr-1676-foreman-contract-hardening-20260519.md`

EXPECTED_FAILURE_MODES:
- CS2 authorization reference missing in PR description
- per-PR scope/admin manifest missing or out-of-sync with diff
- missing/stale IAA preflight artifact
- missing/pending/stale IAA final assurance token

FOREMAN_INSTRUCTIONS:
- Keep PR admin manifest and per-PR scope declaration synchronized to the exact current diff.
- Keep IAA preflight + final token artifacts current-head (`CURRENT_HEAD` or explicit SHA).
- Do not claim handover-ready while any required current-head gate is non-green.

ECAP_REQUIRED / ECAP_EXPECTED_ARTIFACTS:
- required: yes
- expected:
  - `.admin/prs/pr-1676.json`
  - `.agent-admin/scope-declarations/pr-1676.md`

CURRENT_HEAD_CI_EXPECTATIONS:
- `preflight/evidence-exactness`: GREEN
- `preflight/scope-declaration-parity`: GREEN
- `preflight/mmm-pr-admin`: GREEN
- `preflight/injection-intake-current`: GREEN
- `agent-contract/cs2-authorization`: GREEN

POLC_AND_BUILDER_DELEGATION_EXPECTATIONS:
- Foreman remains non-implementing and builder delegation evidence remains mandatory by contract.

IAA_WILL_QA:
- Preflight/admin/scope/final-assurance coherence against current head.

RESULT: PREFLIGHT_BRIEF_COMPLETE
