# Session Memory — GOV-2064-T2 Gate Router Mixed-Payload Classification Fix

- **Agent**: qa-builder
- **Class**: Builder (specialized QA)
- **Session**: session-gov-2064-t2-gate-router-20261005
- **Date**: 2026-10-05
- **Task ID**: GOV-2064-T2
- **PR / Issue**: #2065 / #2064
- **Appointment / Pre-brief**: `.agent-admin/assurance/iaa-wave-record-pr-2065-prevent-rejected-iaa-handover-20261005.md`
- **Bound task record**: `.agent-admin/prs/pr-2065/wave-current-tasks.md`

## Task Description

Correct PR-class detection in `.github/scripts/validate-product-delivery-gates.sh` (the
CS2 governed-build gate router) so a migration/security payload never falls through to
`EVIDENCE_ONLY` when mixed with SQL/Python tests, workflow files, docs, and admin files.
Runtime UI/API changes or an explicit formal functional-delivery claim must still force
`APP_FUNCTIONAL_BUILD`. Unknown/mismatched PR manifests must fail closed. Add focused
regression tests exercising the actual script entrypoint.

## Root Cause Confirmed

`all_files_database_or_evidence()` required **every** changed file to match
`is_database_path` or `is_evidence_file`. Any accompanying SQL/Python test file, workflow
file (`.github/workflows/*`), docs file, or admin note (none of which matched either
predicate) caused this gate to fail, so a PR containing a real `supabase/migrations/*`
file would skip the `DATABASE_MIGRATION`/`SECURITY_REMEDIATION` branch entirely and fall
through the `elif` chain all the way to the final catch-all:
`PR_CLASS="EVIDENCE_ONLY"` ("no app, database, or governance-control gate payload
detected") — silently bypassing the mandatory migration/security evidence-profile gate.

Reproduced before fix: a migration file + SQL test + Python test + workflow file + docs
file + admin note classified as `EVIDENCE_ONLY` and the script exited 0 (PASS) with no
evidence artifact at all.

## Fix

- Removed `all_files_database_or_evidence()` (now-dead gatekeeping function).
- Changed the classification branch from
  `elif all_files_database_or_evidence && [ "$HAS_DB" = true ]; then`
  to simply `elif [ "$HAS_DB" = true ]; then`.
- Since the `APP_FUNCTIONAL_BUILD` branch (`HAS_APP` / explicit product claim) is
  evaluated first and unchanged, runtime UI/API files and explicit functional-delivery
  claims still take priority and force `APP_FUNCTIONAL_BUILD` even when a migration file
  is also present in the same diff.
- Unknown manifest class handling (line ~200) and manifest-vs-file-payload conflict
  handling (the `case "$PR_CLASS:$MANIFEST_CLASS"` block) were untouched — both already
  fail closed and continue to do so.

## Files Modified

- `.github/scripts/validate-product-delivery-gates.sh` (removed 1 dead function, changed
  1 `elif` condition + its reason string — minimal, surgical diff)
- `.github/scripts/validate-product-delivery-gates.test.sh` (added fixture dirs, extended
  `run_test` with an optional 4th "expected classification" argument, added 8 new focused
  regression tests)

## Evidence

- Reproduced the defect against the pre-fix script in an isolated git workspace
  (`/tmp/repro`): mixed migration + SQL/Python tests + workflow + docs + admin →
  `EVIDENCE_ONLY`, exit 0 (bug confirmed).
- Re-ran the identical fixture against the fixed script: `DATABASE_MIGRATION`, exit 1
  (fails closed, requires evidence) — then PASS (exit 0) once database evidence profile
  added.
- Full local regression suite: `bash .github/scripts/validate-product-delivery-gates.test.sh`
  → **17/17 PASS, 0 FAIL** (9 pre-existing + 8 new).
- `shellcheck` run on both files: zero new warnings/errors; the few pre-existing SC2317
  "info"-level notices (indirect-function-call false positives, already present for
  `is_app_functional_path` before this change) shift line numbers because a dead
  direct-call site was removed, but this is a pre-existing shellcheck limitation with
  indirect `fn="$1"; "$fn" "$file"` dispatch used throughout this file — not a new
  defect, not CI-enforced for this script (no shellcheck step references this file).
- `runtime-tools-secret_scanning`: no secrets detected in either modified file.

## New Regression Test Scenarios (actual script entrypoint, not document wording)

1. Mixed migration + SQL/Python tests + workflow + docs + admin, **no evidence** →
   fails closed as `DATABASE_MIGRATION` (exit 1), never `EVIDENCE_ONLY`.
2. Same mixed payload **with** database evidence profile → passes as `DATABASE_MIGRATION`.
3. Same mixed payload + security-hint PR body + security evidence profile → passes as
   `SECURITY_REMEDIATION`.
4. Mixed migration + runtime UI/API file, **no functional evidence** → escalates to
   `APP_FUNCTIONAL_BUILD` (exit 1), not downgraded to database profile.
5. Same scenario **with** full functional + IAA evidence → passes as
   `APP_FUNCTIONAL_BUILD`.
6. Migration-only diff + explicit `Functional-Delivery-Artifact:` claim in PR body (no
   runtime file touched) → still escalates to `APP_FUNCTIONAL_BUILD`.
7. Unknown PR manifest class (`NOT_A_REAL_CLASS`) → fails closed (exit 1).
8. PR manifest attempts to downgrade a real database-migration payload to
   `EVIDENCE_ONLY` → fails closed (exit 1), manifest cannot relax evidence requirements.

## Governance Alignment / Compliance Check

- Zero Test Debt: no `.skip()`/`.todo()`/commented tests introduced; all 17 tests GREEN.
- One-Time Build: single focused fix, verified against actual executable entrypoint, no
  trial-and-error loop.
- Scope discipline: touched only the two files named in GOV-2064-T2; did not touch
  `.github/agents/*.md`, did not touch any `#2058` historical artifact, did not touch
  Task 1/3/4 files (Foreman/IAA/active-CS2 contracts, OPOJD, checkpoint schema).
- No agent contract files modified (SELF-MOD-QA-001 respected).

## Process Improvement Reflection (Phase 4.4)

1. **What went well**: The defect was easy to confirm with a minimal, isolated git
   reproduction before touching any code, which made the fix target obvious and let me
   verify both the "before" (bug) and "after" (fixed) behavior with the same fixture.
2. **What failed / required rework**: My first draft of the new mixed-fixture test put
   a Python test file under `apps/mmm/tests/`, which itself matched
   `is_app_functional_path` (any `.py` file under `apps/*`) and silently flipped the
   scenario to `APP_FUNCTIONAL_BUILD`, masking the intended `DATABASE_MIGRATION`
   assertion. Caught immediately by running the suite and reading the failure diff;
   moved the fixture to `supabase/tests/` instead.
2b. (same item continued) This is a reminder that "SQL/Python tests" fixtures for
   migration/security regression scenarios must be placed outside `apps/*`, `packages/*`,
   `supabase/functions/*`, `api/*` and outside any `src|app|api|pages|components|routes`
   segment, or they will themselves count as an app/runtime payload.
3. **Process/tooling improvement that would have helped**: `run_test` previously only
   asserted exit code, which let a wrong classification silently "pass" if it happened to
   produce the same exit code via a different gate failure. I extended `run_test` with an
   optional 4th parameter to assert the actual `Detected PR class: X` string in the
   script's stdout — this is now reusable for future gate-router regression work and
   should be the default idiom when adding classification tests.
4. **BL compliance check**: BL-016 (ratchet conditions) — n/a, no ratchet touched.
   BL-018/BL-019 (QA range / semantic alignment) — n/a, no QA-catalog tests touched.
   BL-022 — not activated. BL-024 (constitutional sandbox) — procedural judgment used
   only for test-fixture layout and the `run_test` classification-assertion extension;
   constitutional requirements (zero test debt, 100% GREEN) were not negotiated. BL-029
   (tracker update) — this is a CI_WORKFLOW/gate-script control correction under issue
   #2064, not a module build-progress wave; no `BUILD_PROGRESS_TRACKER.md` applies to
   this script-level control fix, so none was updated. Fully compliant.
5. **Actionable improvement to layer up to governance canon**: Recommend documenting the
   "classification-assertion" pattern for `run_test` (assert `Detected PR class: X`, not
   only exit code) as a required idiom in any future gate-router test-authoring guidance,
   and recommend adding an explicit canon note that PR-class predicate functions
   (`is_app_functional_path`, `is_database_path`, etc.) must be the single source of truth
   for "is this file a runtime/database payload" — any new aggregate gating function
   (like the removed `all_files_database_or_evidence`) that requires *all* files to match
   a narrow predicate set is a known fail-open/fail-fallthrough risk pattern and should be
   avoided in favor of "any matching payload file escalates" + explicit manifest
   conflict-fail-closed, which is the pattern now used uniformly for `HAS_APP`/`HAS_DB`.

## Outcome

**COMPLETE** — fix implemented, 17/17 tests GREEN locally against the actual script
entrypoint, evidence captured, no scope creep, no protected files touched.

## What Future Sessions Should Know

- The gate router's priority order is: `APP_FUNCTIONAL_BUILD` (HAS_APP or explicit claim)
  → `DATABASE_MIGRATION`/`SECURITY_REMEDIATION` (HAS_DB) → `EVIDENCE_ONLY` (all evidence
  files) → `GOVERNANCE_CONTROL` (all governance-controlled paths) → `EVIDENCE_ONLY`
  catch-all. Any change to this ordering or to the `HAS_APP`/`HAS_DB` detection functions
  must be re-verified against the 17 regression scenarios in
  `.github/scripts/validate-product-delivery-gates.test.sh`.
- When adding new file-type predicates (`is_*_path`), remember `is_app_functional_path`
  treats **any** `.py`/`.ts`/`.js`/`.go` file under `apps/*`, `packages/*`,
  `supabase/functions/*`, `api/*` as an app/runtime payload — test fixtures for
  non-runtime scenarios (migration/security/evidence) must avoid those path prefixes.
