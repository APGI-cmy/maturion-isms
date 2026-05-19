# IAA Pre-Flight Brief — PR #1676

IAA_PREFLIGHT_BRIEF
PR: #1676
ISSUE: #1675
WAVE: pr1676-foreman-v2-contract-hardening
WAVE_TASKS_PATH: .agent-workspace/foreman-v2/personal/wave-current-tasks.md
CURRENT_HEAD_SHA: CURRENT_HEAD

EXPECTED_QA_SCOPE:
- `.github/agents/foreman-v2-agent.md`
- `.admin/prs/pr-1676.json`
- `.agent-admin/scope-declarations/pr-1676.md`
- `.agent-admin/prehandover/proof-pr-1676-foreman-contract-hardening-20260519.md`
- `.agent-workspace/execution-ceremony-admin-agent/bundles/PREHANDOVER-pr-1676-foreman-contract-hardening-20260519.md`
- `.agent-admin/assurance/iaa-prebrief-pr1676.md`
- `.agent-admin/assurance/iaa-preflight-brief-pr-1676.md`
- `.agent-admin/assurance/iaa-token-pr-1676-foreman-contract-hardening-20260519.md`

EXPECTED_FAILURE_MODES:
- Active pre-flight artifact not PR-matched to #1676
- Wave current tasks preflight pointer mismatch
- Missing PREHANDOVER ECAP evidence on protected-path PR
- Missing ECAP bundle artifact while claiming ECAP PASS
- IAA token claims PASS without coherent current-head ceremony evidence

FOREMAN_INSTRUCTIONS:
- Keep `iaa_prebrief_path` and `IAA_PREFLIGHT_BRIEF_PATH` synchronized to this file.
- Keep per-PR scope/admin artifacts parity-locked to current diff.
- Ensure ECAP evidence exists before claiming IAA PASS on protected-path PR.
- Do not declare handover-ready while any required current-head gate is non-GREEN.

IAA_WILL_QA:
- Active preflight brief structure, PR binding, and current-head relevance.
- Wave task pointer coherence for preflight consumption.
- ECAP/IAA coherence across scope, proof, bundle, and token artifacts.

RESULT: PREFLIGHT_BRIEF_COMPLETE
