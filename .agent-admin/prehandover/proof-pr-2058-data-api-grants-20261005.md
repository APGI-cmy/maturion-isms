# PR #2058 — CI Evidence Carrier

> **Status boundary:** This is the single authorized PR-scoped CI evidence carrier. It is not a handover, completion, assurance, or merge-readiness claim. Final IAA and CS2 merge review remain pending.

## Identity and scope

- PR / wave: #2058; `PR-2058-SECURITY-CORRECTION`
- Branch: `codex/explicit-data-api-grants-20260923`
- Reviewed substantive security head: `1eb903588c0bfc090925cdceb7414fddcccc615b`
- Canonical pre-brief: `.agent-admin/assurance/iaa-wave-record-PR-2058-SECURITY-CORRECTION-2026-10-04.md`
- Scope: narrowed Data API grants correction only. `evidence_submissions` and Wave 16.6 remain excluded; no supported-use or grant claim is made for that table.

The reviewed substantive head is the stable security submission, not this administrative carrier commit. The count mismatch noted in the ECAP collation is reconciled against the current pre-carrier state: GitHub reported 14 changed files at administrative head `377ade464b193de9305a9e8988be74384a710abc`, and the frozen 15-path scope inventory includes this carrier as its final path. The older ECAP observation of 12 files is retained as a historical snapshot, not a current scope finding.

## Regression and security evidence

- Data API grants run [37203866742](https://github.com/APGI-cmy/maturion-isms/actions/runs/37203866742), job `111440899125`, succeeded on the exact substantive head `1eb903588c0bfc090925cdceb7414fddcccc615b`. The PostgreSQL 17 regression reproduced missing grants with automatic privileges disabled, replayed 88 in-scope migrations, and passed role coverage, idempotency, RLS/read-write/isolation, restricted-table, future-table, and atomic RLS-refusal checks.
- The current grants rerun [37275102923](https://github.com/APGI-cmy/maturion-isms/actions/runs/37275102923), job `111650669303`, succeeded at administrative head `377ade464b193de9305a9e8988be74384a710abc`; its log confirms all four focused regression milestones.
- CodeQL succeeded at that administrative head (run `37275102861`, job `111650285521`).

## Current check snapshot

At retrieval for `377ade464b193de9305a9e8988be74384a710abc`, these checks succeeded: `merge-gate/verdict`, `governance/alignment`, `stop-and-fix/enforcement`, `preflight/ecap-admin-boundary-gate`, `preflight/iaa-prebrief-contract-alignment`, `preflight/foreman-prehandover-lane-gate`, and `preflight/merge-gate-required-checks-alignment`. Supabase Preview and Vercel Preview Comments also succeeded; neither is production-deployment evidence. The `copilot` check was still in progress at retrieval.

`preflight/delegation-order-gate` remains technically failed. CS2's one-time PR-scoped disposition is comment [5979822573](https://github.com/APGI-cmy/maturion-isms/pull/2058#issuecomment-5979822573). This records the historical ordering exception only; it does not turn the gate green, create historical proof, or waive security, testing, final IAA, or CS2 review.

## Foreman review and boundaries

Foreman reviewed and accepted the returned ECAP artifacts as evidence collation only. Their 12-file count was an earlier observation; the current 14-file pre-carrier count and frozen 15-path inventory (including this carrier) are reconciled above. The ECAP files remain unchanged.

- No live Supabase/database deployment occurred.
- No legacy UI or Edge Function files were changed.
- The former-scope IAA rejection remains historical; its `evidence_submissions` finding is superseded for the current scope by exclusion, not by a repair.
- No current-scope final IAA verdict or token is recorded here.
- Final independent IAA and CS2 merge review are pending.
- This carrier does not claim handover, completion, or merge readiness.
