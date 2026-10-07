# PREHANDOVER PROOF — GOV-2064-T2 Gate Router Mixed-Payload Classification Fix

- **Builder**: qa-builder
- **Task**: GOV-2064-T2
- **PR**: #2065 (branch `copilot/prevent-rejected-iaa-handover`)
- **Issue**: #2064
- **Pre-brief**: `.agent-admin/assurance/iaa-wave-record-pr-2065-prevent-rejected-iaa-handover-20261005.md`
- **Current head SHA reviewed**: 11a9d6181e743fada163a20c11d3a6a5a4827699
- **Date**: 2026-10-05

## Scope (bounded to GOV-2064-T2 only)

Correct PR-class detection in `.github/scripts/validate-product-delivery-gates.sh` (the
CS2 governed-build gate router / merge-gate classification entrypoint) so a database
migration or security remediation payload never falls through to `EVIDENCE_ONLY` when
mixed with supporting SQL/Python test files, workflow files, docs, and admin files. Add
focused regression tests against the actual script entrypoint. Preserve: runtime UI/API
changes and explicit formal functional-delivery claims still force `APP_FUNCTIONAL_BUILD`;
unknown/mismatched PR manifests still fail closed.

## Checklist

- [x] Scope matches the appointed task (GOV-2064-T2 only; Tasks 1/3/4 not touched)
- [x] 100% QA tests GREEN (17/17 — 9 pre-existing + 8 new regression scenarios)
- [x] Zero test debt/warnings (no `.skip()`/`.todo()`/commented tests; `shellcheck` clean
      of new findings — see Known Non-Blocking Notes below)
- [x] Build succeeds (bash syntax validated via `bash -n`, full test harness executes
      the actual script without error)
- [x] No `.github/agents/*.md` file touched (SELF-MOD-QA-001 respected)
- [x] No `#2058` historical artifact touched or reassessed
- [x] Evidence artifacts generated (this proof + session memory)
- [x] Regression suite passes in well under 12 minutes (full suite completes in <5s)

## Root Cause

`all_files_database_or_evidence()` required every changed file to be a database path or
a recognized evidence-file path. Any accompanying test/workflow/docs/admin file (not
matching either predicate) caused the database/security branch's `elif` guard to fail,
so the script fell through its `elif` chain to the final catch-all
`PR_CLASS="EVIDENCE_ONLY"` — even though a real `supabase/migrations/*` file was present
in the diff — bypassing the mandatory migration/security evidence-profile gate entirely.

## Fix (minimal, surgical diff)

`.github/scripts/validate-product-delivery-gates.sh`:
- Removed the now-unnecessary `all_files_database_or_evidence()` function.
- Changed `elif all_files_database_or_evidence && [ "$HAS_DB" = true ]; then` to
  `elif [ "$HAS_DB" = true ]; then`.
- The `APP_FUNCTIONAL_BUILD` branch (runtime UI/API path or explicit product-delivery
  claim) is still evaluated **first** and unchanged, so it continues to take priority
  over any database/security payload in the same diff.
- Unknown-manifest-class and manifest-vs-payload conflict handling were not modified —
  both already fail closed.

`.github/scripts/validate-product-delivery-gates.test.sh`:
- Extended `run_test` with an optional 4th argument to assert the actual
  `Detected PR class: X` string emitted by the script (not just the exit code), so a
  misclassification can't silently "pass" by coincidentally producing the same exit code
  via an unrelated gate failure.
- Added 8 new focused regression tests (see Test Evidence below) exercising the real
  script entrypoint with mixed-file-type fixtures.

## Test Evidence

Command: `bash .github/scripts/validate-product-delivery-gates.test.sh`

```
=== CS2 Governed Build Gate Router Regression ===
PASS mixed migration+test/workflow/docs/admin never classifies EVIDENCE_ONLY (fails closed, requires DB evidence)
PASS mixed migration+test/workflow/docs/admin with database evidence passes as DATABASE_MIGRATION
PASS mixed migration+test/workflow/docs/admin with security hint passes as SECURITY_REMEDIATION
PASS runtime UI/API file mixed with migration still escalates to APP_FUNCTIONAL_BUILD
PASS runtime UI/API file mixed with migration passes APP_FUNCTIONAL_BUILD with full evidence
PASS explicit formal functional-delivery claim escalates migration-only diff to APP_FUNCTIONAL_BUILD
PASS unknown PR manifest class fails closed
PASS manifest cannot downgrade a database migration payload to EVIDENCE_ONLY (fails closed)
PASS governance/strategy-only PR is not product-delivery gated
PASS evidence-only PR is advisory for product gate
PASS database migration without database evidence profile fails
PASS database migration with database evidence profile passes
PASS security remediation migration uses security evidence profile
PASS app functional build without evidence fails
PASS app functional build with full evidence passes
PASS app functional build still requires independent IAA artifact
PASS CS2 hotfix manifest cannot use placeholder justification

Passed: 17
Failed: 0
```

Exit code: 0.

### Manual before/after reproduction (isolated workspace, outside repo tree)

Fixture: `supabase/migrations/*.sql` + `tests/sql/*.sql` + `tests/python/*.py` +
`.github/workflows/*.yml` + `docs/*.md` + `.agent-admin/notes/*.md`, no evidence file,
no manifest.

| | Pre-fix | Post-fix |
|---|---|---|
| Detected PR class | `EVIDENCE_ONLY` | `DATABASE_MIGRATION` |
| Exit code | `0` (PASS — silently bypasses evidence gate) | `1` (FAIL — requires scoped evidence artifact) |

## Known Non-Blocking Notes

- `shellcheck` on the modified script shows only pre-existing "info"-level `SC2317`
  (unreachable code) false positives caused by this file's existing pattern of invoking
  predicate functions indirectly (`fn="$1"; "$fn" "$file"`) — the same false-positive
  class already present for `is_app_functional_path` before this change. Removing the
  dead `all_files_database_or_evidence()` function shifted which line numbers shellcheck
  flags for `is_database_path`, but introduced no new warning category and is not part of
  any CI-enforced lint gate for this script. No action taken (out of scope; pre-existing
  limitation of the indirect-dispatch pattern used throughout the file).
- Session memory `.agent-workspace/qa-builder/memory/` currently holds more than 5
  session files (rotation backlog pre-dates this session). Per the GOV-2064-T2 pre-brief
  scope bound ("bounded to the four named control corrections only"; "no broad
  governance cleanup"), archive rotation was not performed in this session to avoid
  scope creep; flagged for a future housekeeping pass.

## Evidence Files

- `.github/scripts/validate-product-delivery-gates.sh` (fix)
- `.github/scripts/validate-product-delivery-gates.test.sh` (new regression tests)
- `.agent-workspace/qa-builder/memory/session-gov-2064-t2-gate-router-20261005.md` (session memory)
- This file: `.agent-admin/prehandover/proof-pr-2065-gov-2064-t2-gate-router-20261005.md`

## Double-QA

- **Foreman QA (build)**: pending Foreman review of this builder submission.
- **IAA QA (handover)**: PRE-BRIEF only recorded at
  `.agent-admin/assurance/iaa-wave-record-pr-2065-prevent-rejected-iaa-handover-20261005.md`;
  final IAA invocation for GOV-2064-T2 is outstanding and must be requested per the
  pre-brief's `required_builder_evidence` before this PR proceeds to merge. This proof
  does not itself constitute a final ASSURANCE-TOKEN.
