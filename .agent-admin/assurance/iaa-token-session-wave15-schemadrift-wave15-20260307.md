# IAA Token — Wave 15 Schema Drift Remediation (parse_tasks migration)

**Token type**: REJECTION-PACKAGE
**Session ID**: session-wave15-schemadrift-20260307
**Date**: 2026-03-07
**Agent**: independent-assurance-agent v6.2.0 / contract v2.2.0
**PR Branch**: copilot/add-migration-for-parse-tasks-table
**Issue**: #971
**Wave**: Wave 15 — Schema Drift Remediation (parse_tasks migration)
**Wave Slug**: wave15-schemadrift
**Adoption Phase**: PHASE_B_BLOCKING — hard gate ACTIVE
**Pre-Brief**: `.agent-admin/assurance/iaa-prebrief-wave15-schemadrift.md`
**PREHANDOVER proof reviewed**: `.agent-workspace/foreman-v2/memory/PREHANDOVER-session-wave15-schemadrift-wave15-20260307.md`

---

## Invocation Context

| Field | Value |
|-------|-------|
| Invoked by | foreman-v2-agent (via CS2-authorised task, Issue #971) |
| Work produced by | schema-builder (T-W15-SCH-001) + foreman-v2-agent (T-W15-SCH-002) |
| Producing agent class | builder + foreman |
| PR category | AAWP_MAT |
| IAA triggered | YES |
| Independence check | CONFIRMED — IAA did not produce any artifact in this PR |

---

## Checks Executed

| Category | Checks | PASS | FAIL |
|----------|--------|------|------|
| FAIL-ONLY-ONCE learning | 5 | 3 | 2 |
| Core invariants (CORE-001 to CORE-022) | 22 | 17 | 3 |
| AAWP_MAT BUILD_DELIVERABLE overlay (BD-001 to BD-024) | 24 | 23 | 1 |
| Merge gate parity (3 checks) | 3 | 2 | 1 |
| **TOTAL** | **39** | **33** | **5** |

---

## Migration SQL Quality (INFORMATIONAL — Technical Checks All PASS)

The migration `20260307000001_parse_tasks_table.sql` is **technically correct**.  
All 19 Pre-Brief checks PASS:

| # | Check | Result |
|---|-------|--------|
| 1 | `id uuid PRIMARY KEY DEFAULT gen_random_uuid()` | ✅ PASS |
| 2 | `audit_id uuid NOT NULL REFERENCES public.audits(id) ON DELETE CASCADE` | ✅ PASS |
| 3 | `status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','processing','completed','failed'))` | ✅ PASS |
| 4 | `error_message text` | ✅ PASS |
| 5 | `created_at timestamptz NOT NULL DEFAULT now()` | ✅ PASS |
| 6 | `updated_at timestamptz NOT NULL DEFAULT now()` | ✅ PASS |
| 7 | `ENABLE ROW LEVEL SECURITY` | ✅ PASS |
| 8 | SELECT policy org-isolation: `audit_id IN (SELECT a.id FROM public.audits a WHERE a.organisation_id IN (SELECT organisation_id FROM public.profiles WHERE id = auth.uid()))` | ✅ PASS |
| 9 | `CREATE TABLE IF NOT EXISTS` (idempotent) | ✅ PASS |
| 10 | `DO $$ BEGIN IF NOT EXISTS … END $$` (idempotent policy guard via pg_policies check) | ✅ PASS |
| 11 | Exactly 6 declared columns (id, audit_id, status, error_message, created_at, updated_at) | ✅ PASS |
| 12 | No stubs, TODOs, FIXMEs, or placeholders | ✅ PASS |
| 13 | `CREATE TABLE IF NOT EXISTS public.parse_tasks` pattern present — T-W13-SCH-11 PASS | ✅ PASS |
| 14-19 | RLS SELECT policy present; auth.uid() chain verified; FK cascade delete; no secrets; no injection vectors; architecture alignment | ✅ ALL PASS |

**BUILD_PROGRESS_TRACKER.md** (T-W15-SCH-002) content is also **correct** — Wave 15 Schema Drift RCA with INC-W15-SCHEMA-DRIFT-001 fully documented.

> **This REJECTION-PACKAGE is PURELY for uncommitted ceremony artifacts.** No migration SQL changes required.

---

## Failures (5 Total)

### FAILURE 1 — CORE-018 / CORE-013: PREHANDOVER proof not committed

- **Check**: CORE-018 condition (a); CORE-013
- **Evidence**: `git ls-files .agent-workspace/foreman-v2/memory/PREHANDOVER-session-wave15-schemadrift-wave15-20260307.md` → `error: pathspec did not match any file(s) known to git`
- **Status**: `??` UNTRACKED in git status. NOT in `git diff --name-only origin/main...HEAD`.
- **PREHANDOVER claim**: "✅ Committed (This file)" — **INACCURATE**
- **Fix**: `git add .agent-workspace/foreman-v2/memory/PREHANDOVER-session-wave15-schemadrift-wave15-20260307.md`

### FAILURE 2 — BD-001 / A-021: BUILD_PROGRESS_TRACKER.md staged but not committed

- **Check**: BD-001 (full scope delivered); A-021 (commit before IAA)
- **Evidence**: `git status --short` shows `M  modules/mat/00-app-description/BUILD_PROGRESS_TRACKER.md` — staged, NOT committed
- **Git diff confirm**: `git diff --name-only origin/main...HEAD` does NOT include BUILD_PROGRESS_TRACKER.md
- **PREHANDOVER claim**: "✅ Committed" — **INACCURATE**
- **Fix**: File is already staged. Commit only: `git commit -m "gov: add Wave 15 Schema Drift RCA to BUILD_PROGRESS_TRACKER"`

### FAILURE 3 — CORE-015: Foreman session memory not committed

- **Check**: CORE-015 (session memory present)
- **Evidence**: `git ls-files .agent-workspace/foreman-v2/memory/session-wave15-schemadrift-20260307.md` → `error: pathspec did not match any file(s) known to git`
- **Status**: `??` UNTRACKED. Not in PREHANDOVER evidence bundle (5-artifact bundle does not list session memory).
- **Fix**: `git add .agent-workspace/foreman-v2/memory/session-wave15-schemadrift-20260307.md`

### FAILURE 4 — A-026 / BL-027 (Merge Gate Parity FAIL): SCOPE_DECLARATION.md stale

- **Check**: A-026; Merge gate parity check 1 (validate-scope-to-diff.sh exits 1)
- **Evidence**: SCOPE_DECLARATION.md declares branch `copilot/initiate-wave-15-orchestration`, date 2026-03-06, session `session-wave15-impl-20260306`. Lists 20 files from prior Wave 15 impl PR.
- **Actual diff** (3 files): `.agent-admin/assurance/iaa-prebrief-wave15-schemadrift.md`, `.agent-workspace/foreman-v2/personal/wave-current-tasks.md`, `apps/maturion-maturity-legacy/supabase/migrations/20260307000001_parse_tasks_table.sql`
- **Validation script**: `validate-scope-to-diff.sh` EXIT 1 — 2 files missing, 19 extra
- **Fix**: Update SCOPE_DECLARATION.md for branch `copilot/add-migration-for-parse-tasks-table` and list all 6 files that will be in the final diff after committing FAILURES 1–3

### FAILURE 5 — CORE-018 condition (b): Session memory not on branch

- **Check**: CORE-018 condition (b)
- **Evidence**: Session memory untracked (same root cause as FAILURE 3)
- **Fix**: Same as FAILURE 3 (bundled)

---

## Complete Fix Sequence

```bash
# Step 1: Stage all uncommitted artifacts
git add modules/mat/00-app-description/BUILD_PROGRESS_TRACKER.md \
        .agent-workspace/foreman-v2/memory/PREHANDOVER-session-wave15-schemadrift-wave15-20260307.md \
        .agent-workspace/foreman-v2/memory/session-wave15-schemadrift-20260307.md

# Step 2: Commit ceremony artifacts
git commit -m "gov: commit ceremony artifacts for wave15-schemadrift (PREHANDOVER, session-memory, RCA)"

# Step 3: Update SCOPE_DECLARATION.md for this PR
# Set Wave: Wave 15 — Schema Drift Remediation (parse_tasks migration)
# Set Branch: copilot/add-migration-for-parse-tasks-table
# Set Session: session-wave15-schemadrift-20260307
# Set Date: 2026-03-07
# List ONLY files in final diff:
#   - apps/maturion-maturity-legacy/supabase/migrations/20260307000001_parse_tasks_table.sql
#   - .agent-workspace/foreman-v2/personal/wave-current-tasks.md
#   - .agent-admin/assurance/iaa-prebrief-wave15-schemadrift.md
#   - modules/mat/00-app-description/BUILD_PROGRESS_TRACKER.md
#   - .agent-workspace/foreman-v2/memory/PREHANDOVER-session-wave15-schemadrift-wave15-20260307.md
#   - .agent-workspace/foreman-v2/memory/session-wave15-schemadrift-20260307.md
#   - SCOPE_DECLARATION.md (this file itself)
git add SCOPE_DECLARATION.md
git commit -m "gov: update SCOPE_DECLARATION for wave15-schemadrift hotfix"

# Step 4: Push
git push

# Step 5: Verify merge gate
bash .github/scripts/validate-scope-to-diff.sh  # Must exit 0

# Step 6: Re-invoke IAA
```

---

## Verdict

```
═══════════════════════════════════════════════════════════════════════
REJECTION-PACKAGE
PR: copilot/add-migration-for-parse-tasks-table — Issue #971
5 check(s) FAILED. Merge blocked. STOP-AND-FIX required.
Token reference: IAA-session-wave15-schemadrift-wave15-20260307-REJECTION
Adoption phase: PHASE_B_BLOCKING — hard gate ACTIVE
═══════════════════════════════════════════════════════════════════════
```

> **No PR may be opened until all 5 failures are resolved, fix sequence executed, and IAA re-invoked.**
> The migration SQL is correct and requires no changes. Re-invocation after committing ceremony artifacts and updating SCOPE_DECLARATION.md is expected to produce ASSURANCE-TOKEN.

---

## CWT Gate Assessment

T-W13-SCH-11 (`no frontend hook references a table absent from all migrations`) — **WILL PASS** once this PR is merged. The migration creates `public.parse_tasks` at `CREATE TABLE IF NOT EXISTS public.parse_tasks (` — the `CREATE TABLE.*parse_tasks` pattern is present and unambiguous. The CWT RED gate that triggered this wave will clear upon merge.

---

*Authority: CS2 (@APGI-cmy) | independent-assurance-agent v6.2.0 | PHASE_B_BLOCKING*
*PREHANDOVER proof: NOT modified — immutable post-commit per §4.3b / A-029*
