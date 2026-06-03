# PIT W8.1 Deployed Evidence Scope

SCOPE_SCHEMA_VERSION: 1
PR_NUMBER: TBD
ISSUE: 1775
BRANCH: pit-w81-deploy-evidence
OWNER: APGI-cmy
DATE_UTC: 2026-06-03

## Authority

- Stage 12 authorization: issue #1767
- W8.1 foundation: PR #1772
- W8.1 in-repo evidence closure: PR #1777
- W8.1 completion issue: #1775
- Appointed builder: pit-specialist

## IN_SCOPE

- Add repeatable deployed-smoke harness for W8.1 routes.
- File W8.1 deployed LFV evidence ledger.
- Keep runtime capture rows honest until a deployed preview/live URL is executed.
- Preserve W8.2 blocked status until W8.1 deployed evidence is accepted.

## OUT_OF_SCOPE

- W8.2 implementation.
- Business workflow implementation.
- CS2 L3 claim.
- FUNCTIONAL_PASS claim.
- Stage 12 completion claim.

## FILES_CHANGED

- apps/isms-portal/scripts/pit-w81-deployed-smoke.mjs
- modules/pit/12-build/w81-deployed-lfv-evidence.md
- .agent-admin/scope-declarations/pit-w81-deploy-evidence.md

## Exit posture

This PR provides the harness and ledger needed to collect the final W8.1 deployed evidence. It may only close W8.1 fully if reviewer/runtime capture evidence is attached and accepted.
