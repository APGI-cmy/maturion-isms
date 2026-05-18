# IAA Pre-flight Brief — PR #1666

IAA_PREFLIGHT_BRIEF
PR: #1666
ISSUE: #1665
CURRENT_HEAD_SHA: CURRENT_HEAD

FOREMAN_OBJECTIVE:
- Deliver checkpoint + handover gate governance hardening that enforces failed-gate log consumption and rejects stale/non-current evidence before handover posture.

EXPECTED_QA_SCOPE:
- .github/scripts/pre-handover-checkpoint.js
- .github/scripts/pre-handover-checkpoint.test.sh
- .github/workflows/handover-claim-gate.yml
- .admin/prs/pr-1666.json
- .agent-admin/scope-declarations/pr-1666.md
- .agent-admin/assurance/iaa-wave-record-pr1666-qa-rejection-package-20260518.md
- .agent-admin/assurance/iaa-preflight-brief-pr-1666.md
- .agent-admin/prehandover/proof-pr-1666-qa-rejection-package-20260518.md
- .agent-workspace/execution-ceremony-admin-agent/bundles/PREHANDOVER-pr-1666-qa-rejection-package-20260518.md

EXPECTED_FAILURE_MODES:
- stale evidence
- missing scope parity
- missing current-head IAA token
- missing ECAP/admin proof
- missing failed-gate log consumption
- source-only evidence
- unresolved pending/missing gates

FOREMAN_INSTRUCTIONS:
- Keep PR admin manifest and scope declaration synchronized with exact diff.
- Keep active governance artifacts current-head (or CURRENT_HEAD tokenized where runtime substitution applies).
- Ensure PREHANDOVER proof includes Ripple/Cross-Agent Assessment with concrete impact row.
- Ensure unresolved gate output is consumed into structured rejection package before handover posture.

IAA_WILL_QA:
- exact gates: preflight/evidence-exactness, preflight/scope-declaration-parity, preflight/mmm-pr-admin, preflight/ecap-admin-ceremony, preflight/iaa-final-assurance, preflight/injection-intake-current
- exact artifacts: PR admin manifest, scope declaration, IAA wave/token artifact, preflight brief, PREHANDOVER proof, ECAP bundle
- exact fields: CURRENT_HEAD_SHA alignment, token non-pending posture, failed-gate package state/status fields, handover verdict fields
- current-head SHA matching: required

RESULT: PREFLIGHT_BRIEF_COMPLETE
