# ECAP - PIT W8.1 Deployed Evidence

Issue: maturion-isms#1775
Branch: pit-w81-deploy-evidence

## Scope authority

This wave follows PR #1777 and addresses the remaining deployed LFV evidence gap for W8.1.

## Primary artifacts touched

- apps/isms-portal/scripts/pit-w81-deployed-smoke.mjs
- modules/pit/12-build/w81-deployed-lfv-evidence.md
- .agent-admin/scope-declarations/pit-w81-deploy-evidence.md

## Decision record

- Added a repeatable Node-based deployed-smoke harness instead of relying only on manual prose.
- Filed a deployed LFV ledger that explicitly marks runtime captures as PENDING_RUNTIME_CAPTURE until actual deployed evidence is attached.
- Preserved W8.2 blocked posture.

## Open risks

- Actual screenshots/HAR evidence cannot be manufactured from repository code.
- A deployed preview/live URL must be executed and evidence attached before W8.1 can be declared fully exited.

## ECAP disposition

Administrative trail is sufficient for review. Functional exit depends on runtime evidence capture and reviewer acceptance.
