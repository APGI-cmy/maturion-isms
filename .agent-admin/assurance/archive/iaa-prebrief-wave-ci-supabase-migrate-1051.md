# IAA Pre-Brief — wave-ci-supabase-migrate-1051

**Wave**: wave-ci-supabase-migrate-1051  
**Branch**: `copilot/fix-supabase-migrate-ci-job-failure`  
**Issue**: maturion-isms#1051 — "Bug: `supabase-migrate` CI job fails when Wave 16.6 migration already applied to production"  
**Pre-Brief Date**: 2026-03-10  
**Produced by**: independent-assurance-agent v6.2.0  
**Authority**: CS2 (Johan Ras / @APGI-cmy)  
**Pre-Brief Mode**: Phase 0 — GENERATE ARTIFACT AND STOP (no Phase 2–4 assurance at this time)

---

## Phase 1 Attestation (Session Preflight — abbreviated for Pre-Brief mode)

> I am independent-assurance-agent, class: assurance, version 6.2.0.  
> My role: Hard-gate merge blocker. Issues ASSURANCE-TOKEN or REJECTION-PACKAGE only. Binary verdict, no partial verdicts.  
> Class boundary: NOT a builder, foreman, or overseer. Outputs: verification verdicts and Pre-Brief artifact only.  
> Independence requirement: Must never review work I produced or contributed to.  
> STOP-AND-FIX mandate: ACTIVE.  
> No class exceptions: IAA mandatory for ALL agent contracts.  
> Ambiguity rule: Ambiguity resolves to mandatory invocation — never to exempt.  
> Active constitutional lock: SELF-MOD-IAA-001.  
> Authority: CS2 only (@APGI-cmy).  
>
> Tier 2 loaded. Knowledge version: 2.8.0.  
> Adoption phase: PHASE_B_BLOCKING — Hard gate ACTIVE.  
> Orientation Mandate acknowledged. Proceeding as quality engineer, not file auditor.

---

## §1 — Wave Scope Summary

| Field | Value |
|-------|-------|
| Wave slug | `wave-ci-supabase-migrate-1051` |
| Wave type | CI bugfix — single workflow file |
| Files in scope | `.github/workflows/deploy-mat-vercel.yml` ONLY |
| Files out of scope | `.github/agents/`, production code, SQL migration files |
| Producing agent | integration-builder (expected) |
| Wave tasks declared in `wave-current-tasks.md` | YES — confirmed in `.agent-workspace/foreman-v2/personal/wave-current-tasks.md` |

**Proposed changes to `deploy-mat-vercel.yml`:**
1. **Pre-register Wave 16.6 migration** — `INSERT INTO legacy_migrations (name, ...) ON CONFLICT DO NOTHING` before the migration loop, so CI skips the already-applied migration without attempting re-execution.
2. **Harden migration loop INSERT** — Change existing `INSERT INTO legacy_migrations (name) VALUES ('$name');` to `INSERT INTO legacy_migrations (name) VALUES ('$name') ON CONFLICT DO NOTHING;` as belt-and-suspenders.
3. **Add schema-verification step for `evidence_submissions`** — Add a new step in the `schema-verification` job that verifies `public.evidence_submissions` exists (matching the pattern of existing `public.audits` and `public.audit_logs` steps).

---

## §2 — Trigger Classification

Per `iaa-trigger-table.md` v2.1.0 — Classification Decision Flow applied:

| Step | Question | Answer | Classification |
|------|----------|--------|---------------|
| 1 | Does PR contain `.github/agents/` changes? | NO — explicitly out of scope | Not AGENT_CONTRACT |
| 2 | Does PR contain `governance/canon/` or `CANON_INVENTORY.json` changes? | NO | Not CANON_GOVERNANCE |
| 3 | Does PR contain `.github/workflows/` changes? | **YES** — `deploy-mat-vercel.yml` is the sole file | **CI_WORKFLOW — MANDATORY** |
| 4 | Does PR contain AAWP/MAT deliverable artifacts? | NO — workflow fix only | Not AAWP_MAT |
| 5–6 | Agent-integrity or Tier 2 knowledge changes? | NO | Not AGENT_INTEGRITY or KNOWLEDGE_GOVERNANCE |

**Primary trigger category: `CI_WORKFLOW` — IAA MANDATORY**

**Ambiguity check**: Classification is unambiguous. This is a single-file workflow modification. No AMBIGUITY RULE application needed.

**INJECTION_AUDIT_TRAIL overlay**: ALSO APPLIES — this PR is T2 qualifying (CI_WORKFLOW with mandatory IAA). OVL-INJ-001 will be checked at handover. The Pre-Brief artifact you are reading NOW serves as the Tier 2 injection evidence for OVL-INJ-001.

---

## §3 — Qualifying Tasks

This wave has exactly one qualifying task (single-file CI bugfix):

| Task ID | Task Summary | IAA Trigger Category | Required Phases | Notes |
|---------|-------------|---------------------|-----------------|-------|
| TASK-1051-CI | Patch `deploy-mat-vercel.yml`: pre-register Wave 16.6 migration, harden loop INSERT, add `evidence_submissions` schema check | CI_WORKFLOW + INJECTION_AUDIT_TRAIL | Phases 2, 3, 4 | Sole task in this wave |

No AGENT_CONTRACT, CANON_GOVERNANCE, KNOWLEDGE_GOVERNANCE, AAWP_MAT, or AGENT_INTEGRITY tasks declared.

---

## §4 — FFA Checks IAA Will Run at Handover

### §4.1 CORE Invariants (applicable subset for CI_WORKFLOW PR)

The following CORE checks from `iaa-core-invariants-checklist.md` v2.8.0 apply to this PR:

| Check ID | Check Name | Applicability | Notes |
|----------|-----------|---------------|-------|
| CORE-005 | Governance block present | ALL | Verify PR artifacts are consistent with governance claims |
| CORE-006 | CANON_INVENTORY alignment | ALL | No canon changes expected — binary existence check only |
| CORE-007 | No placeholder content | ALL | Scan PR diff for STUB/TODO/FIXME in workflow YAML |
| CORE-013 | IAA invocation evidence | ALL | PREHANDOVER proof must be present with `iaa_audit_token` pre-populated |
| CORE-014 | No class exemption claim | ALL | N/A in this wave (no AGENT_CONTRACT) — pass by default |
| CORE-015 | Session memory present | ALL | Session memory file must be on branch |
| CORE-016 | IAA verdict evidenced (§4.3b) | ALL | `iaa_audit_token` expected reference + dedicated token file at handover |
| CORE-017 | No `.github/agents/` mods by unauthorized agent | ALL | Scope declares no agent file changes — verify diff matches |
| CORE-018 | Complete evidence artifact sweep | ALL | PREHANDOVER proof + session memory + `iaa_audit_token` non-empty |
| CORE-019 | IAA token cross-verification | ALL | First-invocation exception applies; token file created at handover |
| CORE-020 | Zero partial pass rule | ALL | Any unverifiable check = REJECTION-PACKAGE |
| CORE-021 | Zero-severity-tolerance | ALL | No soft-pass language permitted |

*CORE-001 through CORE-004, CORE-008 through CORE-012, CORE-022 do not apply — these are AGENT_CONTRACT-specific checks and this PR contains no agent contract changes.*

### §4.2 CI_WORKFLOW Overlay Checks

From `iaa-category-overlays.md` v3.3.0:

| Check ID | Check Name | What IAA Will Verify | Specific Focus for This Wave |
|----------|-----------|---------------------|------------------------------|
| OVL-CI-001 | Workflow policy correctness | Does the pre-registration INSERT + loop hardening actually solve the stated problem? Does the logic correctly skip already-applied, untracked migrations? | Verify the `ON CONFLICT DO NOTHING` placement is BEFORE the loop's conditional check — the INSERT must come after the loop applies the migration file, not before the existence check. Verify idempotency is preserved end-to-end. |
| OVL-CI-002 | Merge gate integrity | All existing merge gate checks remain. No gate weakened or removed. | Confirm `build` → `supabase-migrate` → `schema-verification` → `deploy` dependency chain is intact. |
| OVL-CI-003 | Silent failure risk | Are there code paths where the fix could silently swallow failures? | Pre-reg INSERT failure must not be silent. Verify `ON CONFLICT DO NOTHING` on the pre-registration step does not mask a genuine DB connection error (it should not — `ON CONFLICT` only suppresses duplicate key violations, not connection errors). Verify `psql` exit code handling is preserved. The existing `-v ON_ERROR_STOP=1` flag on the migration file step is key — confirm it is not disturbed. |
| OVL-CI-004 | Environment parity | Consistent behaviour across environments | Schema-verification step must include the `SUPABASE_DB_URL` null-guard (same pattern as existing `public.audits` and `public.audit_logs` steps) — verify skip-with-message branch is present for secret-absent CI environments. |
| OVL-CI-005 | CI evidence present | **FULL CI RUN REQUIRED** — see §4.4 below | The Inherent Limitation Exception (S-033) does NOT apply here. See §4.4. |

### §4.3 INJECTION_AUDIT_TRAIL Overlay Checks

| Check ID | Check Name | Pass Condition for This Wave |
|----------|-----------|------------------------------|
| OVL-INJ-001 | Injection audit trail present | This Pre-Brief artifact (`.agent-admin/assurance/iaa-prebrief-wave-ci-supabase-migrate-1051.md`) committed before any integration-builder task artifacts = **Tier 2 evidence**. ✅ SELF-SATISFYING once this artifact is committed. |
| OVL-INJ-ADM-001 | Pre-Brief artifact non-empty | This file is non-empty and substantive. ✅ |
| OVL-INJ-ADM-002 | Pre-Brief references correct wave | Header declares `wave-ci-supabase-migrate-1051` — must match `wave-current-tasks.md`. ✅ Confirmed. |

### §4.4 FAIL-ONLY-ONCE Rules Applicable at Handover

| Rule | Applicability to This Wave | What IAA Will Check |
|------|--------------------------|---------------------|
| A-001 | MANDATORY | PREHANDOVER proof present with `iaa_audit_token` pre-populated to expected reference |
| A-021 | HIGH RISK | All changes must be committed and pushed BEFORE integration-builder invokes IAA. Working-tree-only fix is not a committed fix. |
| A-026 | MANDATORY | `SCOPE_DECLARATION.md` must match `git diff --name-only origin/main...HEAD` exactly. Only `.github/workflows/deploy-mat-vercel.yml` should appear (plus ceremony artifacts). |
| A-028 | MANDATORY | `SCOPE_DECLARATION.md` must use list format; prior-wave entries trimmed |
| A-029 | MANDATORY | PREHANDOVER proof is read-only post-commit; IAA writes dedicated token file; PREHANDOVER pre-populated with expected reference |
| **A-032** | **CRITICAL — see §4.5** | Schema Column Compliance: INSERT into `legacy_migrations` must use only columns that exist in the table DDL |
| A-031 | ADVISORY | If IAA's own prior ceremony artifacts (from earlier waves) appear in `SCOPE_DECLARATION.md` — apply A-031 carve-out note |

---

## §4.5 — A-032 Schema Column Compliance — Special Pre-Brief Notice

**Rule A-032 is ACTIVE and applies to this wave.**

The pre-registration INSERT (Fix #1) issues an `INSERT INTO legacy_migrations (...)` statement. Per A-032:

> IAA MUST read migration DDL and cross-check every column name. Non-existent column = REJECTION-PACKAGE. Silent try/catch does NOT exempt. Mocked tests do NOT satisfy.

**Table DDL (from existing workflow line 212):**
```sql
CREATE TABLE IF NOT EXISTS legacy_migrations (
  name TEXT PRIMARY KEY,
  applied_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

**Columns available**: `name`, `applied_at`

**What IAA will verify at handover**:
- The pre-registration INSERT must reference ONLY `name` (with the value `'20260310000001_wave16_6_schema_audit_completeness.sql'`), or `name` + `applied_at` (with explicit value or `now()`).
- No other column names may appear in the INSERT.
- The hoop loop INSERT (Fix #2) must similarly reference only `name`.

**Integration-builder MUST provide in PREHANDOVER proof**:
A-032 column compliance evidence — list the exact INSERT statement used in Fix #1, then list each column against the table DDL with ✅/❌ status.

**Example evidence format:**
```
A-032 Column Compliance — pre-registration INSERT:
INSERT INTO legacy_migrations (name) VALUES ('20260310000001_wave16_6_schema_audit_completeness.sql') ON CONFLICT DO NOTHING;
  - name: ✅ exists (TEXT PRIMARY KEY)
  - No other columns used. ✅
```

---

## §5 — OVL-CI-005 Determination — Full CI Run Required

**Determination: The Inherent Limitation Exception (S-033) does NOT apply to this PR.**

**Reasoning:**

The `deploy-mat-vercel.yml` workflow declares the following `on:` triggers:

```yaml
on:
  push:
    branches: [main]
    paths:
      - '.github/workflows/deploy-mat-vercel.yml'   # ← this file
      - ...
  pull_request:
    branches: [main]
    paths:
      - '.github/workflows/deploy-mat-vercel.yml'   # ← this file
      - ...
  workflow_dispatch:
```

The `pull_request` trigger explicitly includes `.github/workflows/deploy-mat-vercel.yml` in its `paths` filter. When this PR (which modifies only that file) targets `main`, GitHub Actions WILL execute the workflow on the PR. This is NOT a self-referential workflow PR in the S-033 sense — the workflow CAN and WILL run before merge.

**Consequence for PREHANDOVER proof (OVL-CI-005 hard requirement):**
The PREHANDOVER proof MUST include a CI check run URL (or log snippet) from a PR CI execution demonstrating that all jobs in `deploy-mat-vercel.yml` completed successfully with the proposed change applied.

The three S-033 substitutes (YAML validation + pattern parity + workflow_dispatch retention) are NOT sufficient for this PR. A real CI run URL is required.

**If the CI run URL is absent in the PREHANDOVER proof → REJECTION-PACKAGE (OVL-CI-005).**

---

## §6 — Required PREHANDOVER Proof Structure

Integration-builder must produce a PREHANDOVER proof committed to the branch before invoking IAA. The proof must include the following sections and fields:

```markdown
# PREHANDOVER PROOF — wave-ci-supabase-migrate-1051
## Session
session_id: session-wave-ci-supabase-migrate-1051-YYYYMMDD
wave: wave-ci-supabase-migrate-1051
branch: copilot/fix-supabase-migrate-ci-job-failure
issue: maturion-isms#1051
producing_agent: integration-builder
iaa_audit_token: IAA-session-wave-ci-supabase-migrate-1051-20260310-PASS  ← pre-populate this expected reference

## SCOPE_DECLARATION
(Must match git diff --name-only origin/main...HEAD exactly — A-026/A-028)
Files changed:
- .github/workflows/deploy-mat-vercel.yml
- [ceremony artifacts: PREHANDOVER proof, session memory — with A-031 carve-out if prior IAA artifacts appear]

## Fix Evidence
### Fix 1: Pre-registration INSERT
[Paste exact INSERT statement added to the workflow YAML]

### Fix 2: Loop hardening
[Paste exact modified INSERT statement in the migration loop]

### Fix 3: evidence_submissions schema verification
[Paste exact new step YAML block added to schema-verification job]

## A-032 Column Compliance Evidence
[List each INSERT column vs table DDL with ✅/❌ as described in §4.5]

## OVL-CI-005 Evidence — CI Run URL
CI check run URL: [GitHub Actions run URL for this PR]
Status: [All jobs: lint ✅ | typecheck ✅ | typecheck-api ✅ | test ✅ | build ✅ | supabase-migrate ✅ | schema-verification ✅]
(Note: supabase-migrate and schema-verification will skip live DB steps if SUPABASE_DB_URL secret is absent in PR context — this is expected and acceptable, as long as the logic path is correct)

## OVL-CI-003 Silent Failure Evidence
[Describe: does psql exit on connection error regardless of ON CONFLICT clause? Confirm -v ON_ERROR_STOP=1 flag is preserved on migration file steps. Confirm pre-registration INSERT failure behaviour.]

## Session Memory
session_memory_file: .agent-workspace/integration-builder/memory/session-wave-ci-supabase-migrate-1051-YYYYMMDD.md

## No .github/agents/ modifications
Confirmed: no .github/agents/ files modified in this PR. [evidence: git diff --name-only output]
```

---

## §7 — Scope Blockers and Governance Conflicts

**No hard blockers identified at Pre-Brief time.**

Soft notes for integration-builder awareness:

| # | Note | Severity | Guidance |
|---|------|----------|----------|
| 1 | **A-032 INSERT column list** — the pre-registration INSERT column list must match the table DDL exactly. This is trivial to satisfy (only `name` is strictly required; `applied_at` has a default) but evidence must be provided. | Advisory | See §4.5 — provide column compliance evidence in PREHANDOVER |
| 2 | **OVL-CI-005 — Full CI run required** — do not assume S-033 exception applies. A real CI check run URL is needed. | HIGH — will fail at handover if absent | Trigger a CI run before invoking IAA by pushing the fix to the branch |
| 3 | **OVL-CI-003 — Silent failure analysis** — confirm that `ON CONFLICT DO NOTHING` on the pre-registration INSERT does not suppress genuine database connection errors or permission errors. psql returns non-zero on connection failure regardless of SQL-level conflict handling. This should be a PASS but must be documented. | Advisory | One sentence of evidence in PREHANDOVER is sufficient |
| 4 | **OVL-CI-004 — environment parity** — The new `evidence_submissions` schema verification step must include the same null-guard pattern (`if [ -n "$SUPABASE_DB_URL" ]`) as the existing `audits` and `audit_logs` verification steps. Without this guard, CI on PR branches (where the DB secret may not be available) will exit 1 on `psql` connection failure. | HIGH — silent failure if guard omitted | Verify the new step includes the null-guard |
| 5 | **SCOPE_DECLARATION.md** — prior IAA ceremony artifacts from earlier waves (iaa-prebrief files, token files) should NOT appear in the scope declaration unless A-031 carve-out is explicitly noted. The scope for this PR is `.github/workflows/deploy-mat-vercel.yml` plus ceremony artifacts for this wave only. | Administrative | Apply A-031 carve-out note if needed |

---

## §8 — Summary: What Integration-Builder Must Deliver

| Deliverable | Mandatory? | Notes |
|-------------|-----------|-------|
| Modified `.github/workflows/deploy-mat-vercel.yml` with all three fixes | YES | Sole in-scope file |
| PREHANDOVER proof committed to branch | YES | Per §6 structure |
| Session memory file committed to branch | YES | CORE-015 |
| SCOPE_DECLARATION matching PR diff | YES | A-026/A-028 |
| CI check run URL (OVL-CI-005) | YES | S-033 exception does NOT apply |
| A-032 column compliance evidence | YES | List INSERT columns vs DDL |
| `evidence_submissions` null-guard in schema step | YES | OVL-CI-004 / OVL-CI-003 |
| No `.github/agents/` modifications | YES | CORE-017 — verify by diff |
| `iaa_audit_token` pre-populated in PREHANDOVER | YES | A-029 / CORE-018 |

---

## §9 — IAA Invocation Instructions

When all deliverables in §8 are committed and pushed, integration-builder invokes IAA with:

```
@independent-assurance-agent Please assure PR for wave-ci-supabase-migrate-1051
Branch: copilot/fix-supabase-migrate-ci-job-failure
Issue: maturion-isms#1051
PREHANDOVER proof: [path to committed proof file]
```

IAA will then execute Phases 1–4 using this Pre-Brief as the declared scope baseline.

---

**Authority**: CS2 (Johan Ras / @APGI-cmy)  
**Pre-Brief version**: 1.0.0  
**IAA contract version**: 2.2.0 | v6.2.0  
**STOP-AND-FIX mandate**: ACTIVE — No class exceptions — Ambiguity resolves to mandatory invocation  
**Adoption phase at Pre-Brief time**: PHASE_B_BLOCKING
