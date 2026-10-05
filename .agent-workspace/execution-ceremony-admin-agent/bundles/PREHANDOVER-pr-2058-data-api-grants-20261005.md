# PR #2058 — PREHANDOVER Evidence Collation

> **Status boundary:** This document collates evidence under the Foreman appointment; it is not a quality, merge, readiness, assurance, or handover verdict. ECAP did not invoke IAA. Final IAA and CS2 review remain pending.

## Identity and appointment

- Agent: `execution-ceremony-admin-agent` — administrator, v1.0.0
- Wave: `PR-2058-SECURITY-CORRECTION`
- PR / task: #2058; `PR2058-SEC-01`, `PR2058-SEC-02`
- Branch: `codex/explicit-data-api-grants-20260923`
- Appointment: `2026-10-05T06:12:10Z`
- Foreman appointment and scope: `.agent-workspace/foreman-v2/personal/scope-declaration-wave-pr-2058-data-api-grants-20261005.md`
- Canonical wave record / populated `## PRE-BRIEF`: `.agent-admin/assurance/iaa-wave-record-PR-2058-SECURITY-CORRECTION-2026-10-04.md`
- Active task record: `.agent-admin/prs/pr-2058/wave-current-tasks.md`
- Authorized return paths:
  - `.agent-workspace/execution-ceremony-admin-agent/bundles/PREHANDOVER-pr-2058-data-api-grants-20261005.md`
  - `.agent-workspace/execution-ceremony-admin-agent/bundles/session-pr-2058-data-api-grants-20261005.md`

The appointment declares accepted narrowed-scope Foreman QP PASS and §4.3 parity PASS. These are attributed to Foreman and are not ECAP judgments. The current appointment and pre-brief truthfully state they do not predate the historical implementation.

## Head bindings and evidence scope

- Reviewed substantive security implementation head: `1eb903588c0bfc090925cdceb7414fddcccc615b`.
- Inventory-preserving correction commit / current local and GitHub PR head: `72510573e50a3b9f68fbd950d7e216e3a71b59f3`.
- Foreman declaration's historical `current_submitted_head`: `7e71a5b6b6877117c21f98e232f643b2364845b1`.
- Foreman declaration's `current_pr_head_at_appointment`: `ef762b8dd30f6ba4121e1830a9911c876d1eaa60`.

Security implementation evidence below is bound to `1eb903588c0bfc090925cdceb7414fddcccc615b`, not inferred from the later inventory-preserving commit. The differing head references above are retained as recorded; this collation does not normalize them or claim new gate execution at the substantive head.

### Source traces at the reviewed substantive head

- `supabase/migrations/20260608000001_pit_w82_access_foundation.sql` defines public PIT organisation/role helpers as `SECURITY DEFINER`.
- `supabase/migrations/20260923124227_explicit_data_api_grants.sql` routes policy helper references to `app_private`, retains authenticated/service-role private helper execution for policy use, revokes direct public PIT helper execution from `PUBLIC`, `anon`, `authenticated`, and `service_role`, and revokes authenticated execution of the public MMM helpers. The migration uses an explicit table privilege allowlist.
- `supabase/migrations/20260723141559_pit_slice4_rpc_only_mutation_boundary.sql` retains authenticated execution of the controlled `pit_create_project` and `pit_update_project` RPCs, with role checks and SELECT-only direct table grants.
- `apps/isms-portal/src/lib/supabasePitProjectClient.ts` calls those controlled PIT RPCs.
- Focused regression sources: `supabase/tests/data-api-grants-access.sql`, `supabase/tests/data-api-grants-coverage.sql`, `supabase/tests/support/grants-bootstrap.sql`, and `scripts/test-data-api-grants.py`.

This bounded scope excludes Wave 16.6 and `public.evidence_submissions` from its allowlist, focused replay, fixtures, coverage, and supported-use claims. The separate legacy consumer/DDL mismatch remains unresolved and out of scope. No supported-use claim for that table is made here.

## Focused regression and recorded CI evidence

**Data API grants regression:** GitHub Actions run [37203866742](https://github.com/APGI-cmy/maturion-isms/actions/runs/37203866742), job `111440899125`, succeeded on branch `codex/explicit-data-api-grants-20260923` at exact head `1eb903588c0bfc090925cdceb7414fddcccc615b`. Its log reports:

1. Missing grants reproduced with automatic privileges disabled.
2. 88 historical migrations replayed; role coverage and idempotency verified.
3. Real role reads/writes, row isolation, and restricted-table boundaries.
4. Future-table deny-by-default and atomic refusal of unprotected tables.

This is disposable PostgreSQL 17 CI evidence, not a live database change. ECAP did not run tests, builds, or linters.

The existing wave record also records CodeQL check `111434717633` as success and `merge-gate/verdict`, `governance/alignment`, and `stop-and-fix/enforcement` as success for its reviewed CI snapshot. The Foreman-declared named inventory below is preserved separately from later GitHub check snapshots.

At GitHub Actions retrieval, Merge Gate Interface run [37274356565](https://github.com/APGI-cmy/maturion-isms/actions/runs/37274356565) was completed successfully on head `72510573e50a3b9f68fbd950d7e216e3a71b59f3`. Its check-run snapshot records these successful named checks:

- `merge-gate/verdict` — job `111648052728`
- `governance/alignment` — job `111648052824`
- `stop-and-fix/enforcement` — job `111648052740`
- `preflight/ecap-admin-boundary-gate` — job `111648001411`
- `preflight/iaa-prebrief-contract-alignment` — job `111648000972`
- `preflight/foreman-prehandover-lane-gate` — job `111648000779`
- `preflight/merge-gate-required-checks-alignment` — job `111648000821`
- `Supabase Preview` — check `111648240459`
- `Vercel Preview Comments` — check `111648137906`

These are the named checks and preview checks observed in that snapshot, not a claim that every current PR check has passed. The separate check-run snapshot showed CodeQL as `neutral`, JavaScript/TypeScript CodeQL analysis and the `grants` job in progress. Supabase and Vercel Preview results are not production migration deployment evidence.

## Foreman-declared gate inventory — preserved as recorded

The Foreman appointment reports 11 PASS outcomes when its accepted QP PASS is included with the ten named PASS fields below, plus the twelfth outcome `delegation_order: FAIL`. The inventory data is copied without changing a result:

```yaml
gate_set_checked:
  current_submitted_head: "7e71a5b6b6877117c21f98e232f643b2364845b1"
  substantive_scope_head: "1eb903588c0bfc090925cdceb7414fddcccc615b"
  grants: PASS
  codeql: PASS
  supabase_preview: PASS
  vercel_preview_comments: PASS
  merge_gate_verdict: PASS
  governance_alignment: PASS
  ecap_admin_boundary: PASS
  iaa_prebrief_contract_alignment: PASS
  foreman_prehandover_lane: PASS
  merge_gate_required_checks_alignment: PASS
  delegation_order:
    result: FAIL
    disposition: "Historical one-time PR-scoped CS2 exception, comment 5979822573; not PASS or waived."
```

The historical delegation-order failure remains red. The sole cited disposition is CS2's one-time PR-scoped exception in comment [5979822573](https://github.com/APGI-cmy/maturion-isms/pull/2058#issuecomment-5979822573); it is neither a PASS nor a waiver. No historical ordering proof is manufactured.

## Deployment and assurance boundaries

- No live Supabase/database deployment occurred.
- No production deployment is evidenced by Supabase Preview or Vercel Preview.
- The earlier IAA rejection remains historical evidence for the former scope; its `evidence_submissions` finding is superseded for the current bounded scope by exclusion, not by a repair.
- No current-scope final IAA verdict or token is recorded in this collation. IAA was not invoked by ECAP.
- Final IAA and CS2 review remain pending. This document does not authorize handover, merge, or deployment.
- No CI carrier, assurance artifact, token, pre-brief, task record, Foreman memory, or other record was created or modified.

## Commit-state observation

Immediately before these two authorized files were written: `git status --porcelain` was empty; `git diff --name-only` was empty; HEAD was `72510573e50a3b9f68fbd950d7e216e3a71b59f3`; `git show --name-only HEAD` showed only the Foreman scope declaration. The evidence sources cited above are existing records or source files. These two new administrative files are not represented as committed. No commit was made.

## Embedded ECAP reconciliation summary — evidence only

This is embedded here to honor the two-file-only scope; no separate reconciliation artifact was created.

| Row | Reconciliation | Observed state |
|---|---|---|
| R01 | Session identifier | Uses the exact appointment return-path slug `session-pr-2058-data-api-grants-20261005`; no numeric session ID was supplied. |
| R02 | IAA token reference | No current-scope token issued or referenced; IAA pending. |
| R03 | Issue/task | PR/task #2058; tasks `PR2058-SEC-01` and `PR2058-SEC-02`. |
| R04 | PR number | #2058, consistent across the appointment, task record, and GitHub. |
| R05 | Wave | `PR-2058-SECURITY-CORRECTION`, consistent across active records. |
| R06 | Branch | `codex/explicit-data-api-grants-20260923`, consistent with local branch and GitHub. |
| R07 | Changed-file paths/count | **Not reconciled:** `.agent-admin/scope-declarations/pr-2058.md` says `FILES_CHANGED: 15`; GitHub PR metadata reports 12 changed files. The wave record also contains an older 11-file parity statement. Foreman review is needed; ECAP did not alter these records. |
| R08 | PREHANDOVER ↔ session record | Both authorized output paths, PR, wave, and evidence-only status are aligned. |
| R09 | PREHANDOVER ↔ IAA | No token/session reference exists for this current scope; final IAA pending. |
| R10 | Task tracker ↔ wave record | Both identify the same PR/wave and state final IAA pending; historical rejection is explicitly separated. |
| R11 | Scope declaration ↔ changed files | Same count discrepancy as R07; not asserted reconciled. |
| R12 | Session record ↔ committed artifacts | The two authorized files are present as uncommitted admin artifacts; no committed-state claim is made. |
| R13 | CANON_INVENTORY hashes | All 217 inventory entries resolved and SHA-256 matched before writing; no canon file was changed. |
| R14 | PUBLIC_API ripple | No canon/public API file changed in this ECAP collation; not applicable to these two administrative files. |
| R15 | Final-state coherence | Evidence collation only; final IAA and CS2 review are pending and no completion/readiness state is asserted. |
| R16 | Declared counts | The `FILES_CHANGED` discrepancy in R07 remains unresolved; no artifact count is asserted as reconciled. |
| R17 | IAA session reference | No current IAA session has been issued; pending. |

### Checklist / anti-pattern observations

- `gate_set_checked` is present and the delegation-order outcome remains explicitly `FAIL` (AAP-15 inventory evidence present).
- AAP-16 scan found no unresolved or provisional gate-pass wording in these two artifacts.
- No token, assurance verdict, or claim that ECAP invoked IAA is included.
- The scope-count inconsistency in R07/R11, uncommitted state, and pending IAA/CS2 review prevent treating the checklist/reconciliation as a completed handover gate. This file makes no §4.3e PASS assertion.
- The required Foreman parking-station append was not made because the appointment's user instruction restricts changes to these two exact paths.
