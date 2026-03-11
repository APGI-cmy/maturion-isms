# IAA Pre-Brief — wave-fix-vercel-supabase-migration

**Pre-Brief Type**: RETROACTIVE (implementation committed before Pre-Brief — POLC violation on record)
**Pre-Brief Date**: 2026-03-10
**IAA Version**: independent-assurance-agent v6.2.0
**Wave**: wave-fix-vercel-supabase-migration
**Branch**: copilot/fix-vercel-supabase-migration
**Issue**: maturion-isms#1057 — Fix failing deployment: Vercel Apply Supabase Migrations check
**Authority**: CS2 (Johan Ras / @APGI-cmy)
**Pre-Brief Phase**: PHASE 0

---

## ⚠️ POLC VIOLATION ON RECORD

**Incident ID**: INC-VERCEL-MIGRATION-PREBRIEF-IMPL-001

The implementation changes for this wave were committed BEFORE the IAA Pre-Brief was
requested and written. This is a POLC violation equivalent to the pattern recorded in
INC-WCA-PREBRIEF-IMPL-001 (session-wave-wf-contract-audit-20260310).

**Committed before Pre-Brief**:
- `apps/maturion-maturity-legacy/supabase/migrations/20260310000001_wave16_6_schema_audit_completeness.sql` (modified)
- `.github/workflows/deploy-mat-vercel.yml` (modified)

**Disposition**: This Pre-Brief is retroactive. IAA records the violation and proceeds
with the standard Pre-Brief output. The PREHANDOVER proof MUST explicitly declare this
incident ID and confirm the violation is on record. IAA will apply all checks at handover
regardless of the retroactive nature — no relaxation of standards applies.

The producing agent must not interpret retroactive Pre-Brief completion as absolution for
the POLC breach. A carry-forward note will be issued at handover to address process
improvement.

---

## Step 0.2 — Wave Tasks

**Wave**: wave-fix-vercel-supabase-migration (single-commit wave)

**Task 1**: Fix `audit_logs_action_check` CHECK constraint to use `NOT VALID`
- File: `apps/maturion-maturity-legacy/supabase/migrations/20260310000001_wave16_6_schema_audit_completeness.sql`
- Root cause: CI failure "check constraint audit_logs_action_check of relation audit_logs
  is violated by some row" — existing rows in the `audit_logs` table contained action values
  recorded before the CHECK constraint was introduced, causing the migration to fail when
  it attempted to add the constraint with full row validation.
- Fix: Added `NOT VALID` to defer row validation, allowing the constraint to be added
  without failing on pre-existing data.

**Task 2**: Improve CI migration error diagnostics in `deploy-mat-vercel.yml`
- File: `.github/workflows/deploy-mat-vercel.yml`
- Changes:
  - "Apply pending migrations" step: added explicit `SUPABASE_DB_URL` empty-check with
    `exit 1` and clear error message; added `::error::` annotations naming the failing
    migration file; added per-file success/failure logging; tracks `FAILED_MIGRATION`
    variable and errors on non-zero exit from psql.
  - "Apply AIMC package migrations" step: same pattern applied.

---

## Step 0.3 — Trigger Classification

### Task 1: Migration SQL fix

| Criterion | Applies? | Trigger Category |
|-----------|---------|-----------------|
| `.github/agents/` modified | NO | — |
| `governance/canon/` modified | NO | — |
| `.github/workflows/` modified | NO (Task 2 handles this) | — |
| AAWP/MAT deliverable path: `apps/maturion-maturity-legacy/supabase/migrations/**` | **YES** | **AAWP_MAT** |
| Schema migration (executable DDL) | **YES** | **AAWP_MAT** + A-032 |

**Task 1 Trigger Category**: `AAWP_MAT` — QUALIFYING. IAA mandatory.

### Task 2: CI workflow enhancement

| Criterion | Applies? | Trigger Category |
|-----------|---------|-----------------|
| `.github/workflows/deploy-mat-vercel.yml` modified | **YES** | **CI_WORKFLOW** |

**Task 2 Trigger Category**: `CI_WORKFLOW` — QUALIFYING. IAA mandatory.

### Combined PR Classification

This PR contains both `CI_WORKFLOW` and `AAWP_MAT` triggering artifacts.
Per the trigger table: when multiple triggering categories are present, the classification
is `MIXED` and all applicable overlays apply.

**Final Classification**: `MIXED` (CI_WORKFLOW + AAWP_MAT)
**IAA Required**: YES — MANDATORY for both categories
**AMBIGUITY RULE**: Not applicable — classification is unambiguous.

---

## Step 0.4 — Required Checks at Handover

### A. CORE Invariants (Applied to ALL Invocations)

| Check ID | Check Name | Notes for This PR |
|----------|-----------|------------------|
| CORE-005 | Governance block present | N/A — no agent contract in scope; verify no governance artifacts inadvertently modified |
| CORE-006 | CANON_INVENTORY alignment | N/A — no canon files modified |
| CORE-007 | No placeholder content | Verify no TODOs/stubs in migration DDL or workflow script |
| CORE-013 | IAA invocation evidence | PREHANDOVER must contain `iaa_audit_token` with valid reference |
| CORE-014 | No class exemption claim | Confirm no class exemption has been claimed |
| CORE-015 | Session memory present | Session memory file must be present on branch |
| CORE-016 | IAA verdict evidenced (§4.3b) | Dedicated token file must exist at `.agent-admin/assurance/iaa-token-session-wave-fix-vercel-supabase-migration-20260310.md` |
| CORE-017 | No .github/agents/ modifications by unauthorized agent | Workflow file is `.github/workflows/` not `.github/agents/` — verify no agents file was modified |
| CORE-018 | Complete evidence artifact sweep | PREHANDOVER proof + session memory + `iaa_audit_token` non-empty + token file present (or First Invocation Exception) |
| CORE-019 | IAA token cross-verification | First invocation — exception applies; token file will be created this session |
| CORE-020 | Zero partial pass rule | No assumed passes |
| CORE-021 | Zero-severity-tolerance | Any finding = REJECTION-PACKAGE regardless of perceived severity |

### B. CI_WORKFLOW Overlay (for `.github/workflows/deploy-mat-vercel.yml`)

| Check ID | Check Name | What IAA Will Assess |
|----------|-----------|---------------------|
| OVL-CI-001 | Workflow policy correctness | Does the enhanced migration logic correctly implement: (a) empty URL check before any psql call, (b) per-file failure tracking, (c) ::error:: annotations naming the actual failing file, (d) final exit 1 only after FAILED_MIGRATION is set? Verify the shell logic is correct — e.g., `if [ -z "$SUPABASE_DB_URL" ]; then exit 1; fi` runs before psql. |
| OVL-CI-002 | Merge gate integrity | Confirm all pre-existing gate checks remain — lint, typecheck, supabase-migrate, schema-verification, deploy steps. None may have been removed or softened. |
| OVL-CI-003 | Silent failure risk | Verify the `FAILED_MIGRATION` variable pattern: does `break` in the for loop correctly short-circuit to the final `if [ -n "$FAILED_MIGRATION" ]` check? Verify `ON_ERROR_STOP=1` is passed to psql so SQL errors are not swallowed. |
| OVL-CI-004 | Environment parity | Is the SUPABASE_DB_URL empty-check applied to BOTH "Apply pending migrations" AND "Apply AIMC package migrations"? Confirm symmetric treatment. |
| OVL-CI-005 | CI evidence present | **Self-referential exception assessment**: The workflow fires on `pull_request:` paths that include `apps/maturion-maturity-legacy/supabase/migrations/**` AND `.github/workflows/deploy-mat-vercel.yml`. Since the migration file was modified, the `pull_request:` trigger WILL fire on this PR's CI run. This is NOT a pure self-referential workflow — a CI run IS expected. Therefore, OVL-CI-005 self-referential exception does NOT fully apply. PREHANDOVER must include either: (a) a CI run URL showing the supabase-migrate job passing, OR (b) a YAML syntax validation (actionlint/yamllint) result PLUS a documented explanation for why the full run cannot be produced (e.g., SUPABASE_DB_URL secret not available in PR context). Bare claim of "workflow looks correct" without evidence = REJECTION-PACKAGE. |

### C. AAWP_MAT / BUILD_DELIVERABLE Overlay (for migration SQL)

| Check ID | Check Name | What IAA Will Assess |
|----------|-----------|---------------------|
| BD-001 | Full scope delivered | The issue required: (1) identify the root cause, (2) fix the migration SQL, (3) improve CI error logging. All three are present in the diff. |
| BD-002 | No stub/TODO in production paths | Verify no TODO/stub comments in migration DDL beyond the technical justification comment for `NOT VALID`. |
| BD-003 | One-time build compliance | Will the `NOT VALID` fix allow the migration to apply cleanly against a database that already has rows violating the original constraint? This is the core correctness question. |
| BD-015 | RLS policies complete | The migration already passed Wave 16 full-batch IAA (token: IAA-session-wave16-full-batch-20260310-PASS). The modification is only the `NOT VALID` addition to the constraint DDL and no new RLS changes. Verify no RLS regression introduced. |
| BD-016 | No hardcoded secrets or credentials | Verify no secrets in migration SQL. |
| BD-018 | No obvious injection vectors | Verify SQL is not constructed from user input. |

### D. A-032 Schema Column Compliance Check (MANDATORY — FAIL-ONLY-ONCE active)

**A-032 applies to this PR**: The migration modifies `audit_logs` table DDL (constraint change).

IAA must:
1. Read the full migration DDL directly (not rely on test evidence).
2. Verify the `audit_logs_action_check` constraint definition in the migration matches the
   constraint name referenced in the issue description.
3. Confirm that `NOT VALID` is the appropriate PostgreSQL clause for this scenario
   (adding a constraint without validating existing rows) vs. `VALIDATE CONSTRAINT` for
   a subsequent step if needed.
4. Verify the idempotency guard (`IF NOT EXISTS` on `pg_constraint`) is correctly applied
   and will not attempt to add the constraint a second time on re-run.

### E. POLC Violation Evidence Check (Retroactive Wave Specific)

IAA must verify the PREHANDOVER proof contains:
- Explicit acknowledgement of INC-VERCEL-MIGRATION-PREBRIEF-IMPL-001
- Confirmation that Pre-Brief was requested retroactively
- Date of implementation commit vs. date of Pre-Brief request
- No claim that the retroactive ceremony absolved the violation

---

## Step 0.5 — Required PREHANDOVER Proof Structure

The PREHANDOVER proof for this wave MUST contain all of the following sections.
Absence of any mandatory section = REJECTION-PACKAGE at handover.

```
PREHANDOVER Proof — wave-fix-vercel-supabase-migration
Branch: copilot/fix-vercel-supabase-migration
Issue: maturion-isms#1057

## POLC Violation Declaration (MANDATORY)
  incident_id: INC-VERCEL-MIGRATION-PREBRIEF-IMPL-001
  implementation_commit: [SHA of 2e88a82]
  prebrief_date: 2026-03-10
  violation_status: ON RECORD — retroactive Pre-Brief completed

## Scope Declaration
  Files changed (per git diff --name-only):
    - apps/maturion-maturity-legacy/supabase/migrations/20260310000001_wave16_6_schema_audit_completeness.sql
    - .github/workflows/deploy-mat-vercel.yml

## Task Summary
  Task 1: Migration SQL fix — NOT VALID added to audit_logs_action_check constraint
  Task 2: CI workflow migration error diagnostics improvement

## Root Cause Evidence
  [Description of why the constraint failed — existing rows with legacy action values]
  [Evidence: specific error message from the failing CI run, or psql output]

## CI Evidence (OVL-CI-005 compliance)
  Option A (preferred): CI run URL showing supabase-migrate job GREEN on this branch
  Option B (fallback): actionlint/yamllint output on .github/workflows/deploy-mat-vercel.yml
    + documented explanation for why full run cannot be produced (SUPABASE_DB_URL context)

## NOT VALID Justification (BD-003 compliance)
  [Explain why NOT VALID is correct for this scenario]
  [Confirm: the constraint can be VALIDATED later via ALTER TABLE ... VALIDATE CONSTRAINT if needed]

## A-032 Compliance
  [Confirm migration DDL read directly]
  [Confirm constraint idempotency guard verified]

## iaa_audit_token
  IAA-session-wave-fix-vercel-supabase-migration-20260310-PASS

## Session Memory Reference
  [Path to session memory file on this branch]
```

---

## Step 0.6 — Scope Blockers and Governance Conflicts

### Blocker 1 — POLC Violation (ACTIVE — must be declared, not a merge blocker if evidenced)

**Status**: ON RECORD. Implementation preceded Pre-Brief. The PREHANDOVER proof MUST
declare this explicitly. The violation does not block merge if all IAA checks pass at
handover, but it will be cited in the session memory as a carry-forward mandate for
process improvement.

**Action required from producing agent**: Declare INC-VERCEL-MIGRATION-PREBRIEF-IMPL-001
in the PREHANDOVER proof.

### Blocker 2 — OVL-CI-005 Evidence Gap (POTENTIAL — depends on CI secret availability)

**Status**: CONDITIONAL. The workflow triggers on `pull_request:` and the changed paths
include the migration file, so the supabase-migrate job SHOULD run on this PR. However,
if `SUPABASE_DB_URL` is not available as a CI secret in the PR context (common for
security-restricted CI environments), the migration step will exit 1 at the empty-check
guard rather than actually testing migrations.

**Assessment**: If the CI run URL is available and shows GREEN, OVL-CI-005 is satisfied.
If the secret is unavailable in PR context, actionlint/yamllint output + documented
justification is required. A bare PREHANDOVER proof with no CI evidence = REJECTION-PACKAGE.

**Action required from producing agent**: Include one of the two OVL-CI-005 compliance
options in the PREHANDOVER proof (see Step 0.5 above).

### Blocker 3 — NOT VALID Constraint — Validate Constraint Gap (ADVISORY — not a blocker)

**Status**: ADVISORY. PostgreSQL `NOT VALID` defers row validation. The constraint will
prevent new violations but will not catch existing bad rows until `ALTER TABLE audit_logs
VALIDATE CONSTRAINT audit_logs_action_check` is run separately. This is the correct
approach for a live database with legacy data, but the PREHANDOVER proof should acknowledge
this and confirm whether a subsequent VALIDATE CONSTRAINT is planned or intentionally
deferred.

**Action required from producing agent**: Acknowledge in PREHANDOVER proof whether
VALIDATE CONSTRAINT is planned as a follow-up or is intentionally omitted (acceptable if
legacy data cleanup is out of scope for this fix).

### No Additional Governance Conflicts Visible

- No `.github/agents/` files are modified (A-005 not triggered)
- No `governance/canon/` files are modified (CANON_GOVERNANCE not triggered)
- No agent contracts are modified (AGENT_CONTRACT not triggered)
- No Tier 2 knowledge files are modified (KNOWLEDGE_GOVERNANCE not triggered)
- The migration was already audited as part of Wave 16 full-batch (PASS: IAA-session-wave16-full-batch-20260310-PASS); this PR modifies that file. IAA must re-verify the modified constraint section only — the rest of the file was already approved.

---

## Summary

| Item | Value |
|------|-------|
| Wave | wave-fix-vercel-supabase-migration |
| Branch | copilot/fix-vercel-supabase-migration |
| Issue | maturion-isms#1057 |
| Qualifying Tasks | 2 (migration SQL fix, CI workflow enhancement) |
| Trigger Categories | CI_WORKFLOW + AAWP_MAT (combined: MIXED) |
| IAA Required | YES — MANDATORY |
| POLC Violation | INC-VERCEL-MIGRATION-PREBRIEF-IMPL-001 (on record) |
| Pre-Brief Status | RETROACTIVE — generated after implementation committed |
| Adoption Phase | PHASE_B_BLOCKING — hard gate active |
| Session ID for Handover | `session-wave-fix-vercel-supabase-migration-20260310` |
| Expected Token File | `.agent-admin/assurance/iaa-token-session-wave-fix-vercel-supabase-migration-20260310.md` |
| Expected Token Reference | `IAA-session-wave-fix-vercel-supabase-migration-20260310-PASS` |

---

**Authority**: CS2 (Johan Ras / @APGI-cmy)
**IAA Version**: independent-assurance-agent v6.2.0 | Contract v2.2.0
**Phase B Blocking**: ACTIVE — REJECTION-PACKAGE prevents merge
