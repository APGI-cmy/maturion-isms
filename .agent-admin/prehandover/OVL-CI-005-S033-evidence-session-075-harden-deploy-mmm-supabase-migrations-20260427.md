# OVL-CI-005 S-033 Explicit Exception Invocation
## CI Check Run Evidence — Wave harden-deploy-mmm-supabase-migrations

**Session**: session-075-20260427
**Branch**: copilot/harden-deploy-mmm-supabase-migrations
**Date**: 2026-04-27
**Authority**: IAA REJECTION-PACKAGE session-076-20260427 finding OVL-CI-005

---

## S-033 Exception Invocation

Per OVL-CI-005 S-033: This wave modifies a `workflow_dispatch`-only deployment workflow
that cannot be triggered from PR CI. The three required S-033 substitutes are assembled below
as an explicit exception invocation per IAA pre-brief FFA-3 and IAA rejection finding.

---

### S-033 Substitute 1: YAML Validation Evidence

**Requirement**: The YAML syntax of the modified workflow must be validated.

**Evidence**: api-builder ran `yaml.safe_load()` on the modified workflow YAML file at commit
SHA 5db2734 and confirmed the file parses without error (reported at builder handover).
Additional static review confirmed:
- No duplicate step names
- Correct job dependency chain: `preflight-guard → supabase-migrate → schema-verification → migration-summary`
- `needs:` references resolve correctly
- Environment and secret references are consistent with the existing workflow pattern

**Evidence type**: STATIC_CODE (YAML syntax validation)
**Status**: ✅ CONFIRMED

---

### S-033 Substitute 2: Pattern Parity Evidence

**Requirement**: The new step pattern is verified to work by reference to proven prior execution.

**Evidence**: The `Apply MMM-native migrations (supabase management api)` step introduced in
this PR uses identical code pattern to the two cross-app steps already in the SAME workflow:

```yaml
# Cross-app steps (PROVEN in PRs #1471, #1475, #1483):
python3 .github/scripts/apply-migrations-via-api.py \
  --migrations-dir apps/maturion-maturity-legacy/supabase/migrations/ \
  --tracking-table legacy_migrations

python3 .github/scripts/apply-migrations-via-api.py \
  --migrations-dir packages/ai-centre/supabase/migrations/ \
  --tracking-table aimc_migrations

# New MMM-native step (this PR — SAME PATTERN):
python3 .github/scripts/apply-migrations-via-api.py \
  --migrations-dir supabase/migrations/ \
  --tracking-table mmm_native_migrations
```

All three steps:
- Use the same Python script (`apply-migrations-via-api.py`)
- Use the same HTTPS transport to `api.supabase.com`
- Use the same env vars (`SUPABASE_ACCESS_TOKEN`, `SUPABASE_PROJECT_REF`) defined at job level
- Apply idempotent SQL via `CREATE TABLE IF NOT EXISTS` + `ON CONFLICT DO NOTHING` tracking
- Follow the same error-exit pattern (non-zero exit on script failure)

The script `apply-migrations-via-api.py` already validates both required env vars and exits
with error if either is absent — no per-step guard is needed beyond what's in the script.

The cross-app migration steps (legacy and AIMC) have been successfully executed in production
runs of this workflow. The identical pattern for the MMM-native step provides pattern parity
evidence that the new step will work.

**Evidence type**: STATIC_CODE (pattern parity to proven production execution)
**Parity confidence**: HIGH — same script, same env vars, same transport, same error handling
**Status**: ✅ CONFIRMED

---

### S-033 Substitute 3: `workflow_dispatch` Retention Confirmation

**Requirement**: Confirm the workflow trigger is still `workflow_dispatch` and the protected
environment gating is preserved (not weakened).

**Evidence**: Reviewed `.github/workflows/deploy-mmm-supabase-migrations.yml` lines 23-35:

```yaml
on:
  workflow_dispatch:
    inputs:
      confirm:
        description: >
          Type exactly: CONFIRM — to acknowledge this workflow mutates the live Supabase database.
          Unconfirmed runs will be rejected before any DB step executes.
        required: true
        default: ''
```

The `workflow_dispatch` trigger is present and unchanged. The `CONFIRM` input guard is present
and unchanged. The `environment: production` declaration on the `supabase-migrate` job is
present and unchanged. The `preflight-guard` job confirming `refs/heads/main` branch is
present and unchanged.

No weakening of protected-environment approval requirements has occurred. The change touches
only steps 3-5 of the `supabase-migrate` job (removing setup-cli + link, replacing db push).

**Evidence type**: STATIC_CODE (direct code inspection)
**Status**: ✅ CONFIRMED

---

## S-033 Exception Summary

| Substitute | Description | Evidence Type | Status |
|-----------|-------------|--------------|--------|
| S1: YAML Validation | YAML syntax valid, job dependency chain correct | STATIC_CODE | ✅ PASS |
| S2: Pattern Parity | Identical Management API pattern proven in same workflow (cross-app steps) | STATIC_CODE | ✅ PASS |
| S3: workflow_dispatch Retention | workflow_dispatch trigger and production environment gate unchanged | STATIC_CODE | ✅ PASS |

**OVL-CI-005 S-033 Exception Invocation: COMPLETE — all 3 substitutes confirmed.**

**Note**: Standard `pr_ci_run_url` is not applicable because `deploy-mmm-supabase-migrations.yml`
is a `workflow_dispatch`-only protected deployment workflow that cannot be triggered from PR CI.
This is the expected and accepted state per the workflow's design.

---

**Authority**: IAA session-076-20260427 OVL-CI-005 finding
**Committed to branch**: copilot/harden-deploy-mmm-supabase-migrations
