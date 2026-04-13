# IAA Pre-Brief — wave-ai-criteria-creation-fix

**Artifact Type**: Pre-Brief (Phase 0)
**Wave**: wave-ai-criteria-creation-fix
**Branch**: copilot/fix-ai-criteria-creation-failure
**Issue**: maturion-isms — "Diagnostic Wave: Fix AI Criteria Creation Failure in MAT App"
**Pre-Brief Date**: 2026-03-11
**IAA Agent**: independent-assurance-agent v6.2.0
**IAA Session**: session-prebrief-wave-ai-criteria-creation-fix-20260311
**Authority**: CS2 (Johan Ras / @APGI-cmy)
**Adoption Phase**: PHASE_B_BLOCKING — Hard gate ACTIVE

---

## Step 0.1 — Pre-Brief Invocation Confirmation

Pre-Brief invocation received via direct task request from CS2-authorized wave orchestration.
Wave name: `wave-ai-criteria-creation-fix`. Branch: `copilot/fix-ai-criteria-creation-failure`.
**Mode: PRE-BRIEF ONLY. IAA does NOT execute Phases 2–4 assurance in this session.**

---

## Step 0.2 — Wave Scope Summary (from issue description)

**Primary Objective**: Investigate and fix the AI parsing pipeline that fails to create criteria
entries in the Supabase database from uploaded audit documents in the MAT app.

**Scope declared by issue**:
- Review full AI parsing pipeline end-to-end: Edge Function (`invoke-ai-parse-criteria`),
  AI Gateway (Render service), DB wiring
- Run test uploads; check Supabase logs, Edge Function logs, Render AI Gateway logs
- Verify DB schema: `criteria` table — constraints, columns, RLS policies, upsert conflicts
- Use CodexAdvisor and QA tools for investigation and validation
- Validate AI Gateway API contract and prompt structure
- Investigate FK violations, transaction issues, upsert errors, missing columns
- Document root cause findings and implement fixes
- **Acceptance**: Root cause documented, fix implemented, evidence shows criteria creation
  working (DB entries present, UI populated, pipeline END-TO-END passes), QA validation attached

**Key files likely in scope** (to be confirmed at handover):
- `supabase/functions/invoke-ai-parse-criteria/index.ts` — Edge Function (primary)
- `supabase/migrations/` — Schema DDL for `criteria` table
- `packages/ai-centre/` — AI Gateway code / AI centre package
- `modules/mat/` — MAT module (hooks, API, tests)
- Possibly `apps/maturion-maturity-legacy/` — frontend integration

---

## Step 0.3 — Task Classification Against Trigger Table

Based on the issue scope description and known file paths affected:

| Task / Scope Element | IAA Trigger Category | Qualifying? | Notes |
|----------------------|---------------------|-------------|-------|
| Fix Edge Function `invoke-ai-parse-criteria/index.ts` | AAWP_MAT | ✅ YES | MAT AI pipeline — primary AAWP deliverable |
| Fix DB schema (criteria table columns, constraints, RLS) | AAWP_MAT | ✅ YES | `supabase/migrations/` MAT schema |
| Fix AI Gateway API contract / prompt | AAWP_MAT | ✅ YES | `packages/ai-centre/` MAT deliverable |
| MAT module hooks/API wiring fix | AAWP_MAT | ✅ YES | `modules/mat/` MAT deliverable |
| QA tests for pipeline | AAWP_MAT | ✅ YES | BD-011/BD-012 mandatory |
| Any `.github/workflows/` changes | CI_WORKFLOW | ⚠️ CONDITIONAL | Only if CI files are modified — evaluate at handover |
| Any `.github/agents/` changes | AGENT_CONTRACT | ⚠️ CONDITIONAL | Only if agent contract files are modified — evaluate at handover |
| Session memory / parking station only | EXEMPT | ✅ NOT triggering | Excluded from scope by trigger table |

**Primary Declared Category**: **AAWP_MAT**
**Secondary Categories (conditional)**: CI_WORKFLOW and/or AGENT_CONTRACT — only if those file
paths appear in the PR diff. Foreman MUST re-evaluate per A-022 at handover invocation.

**AMBIGUITY RULE**: If any `.github/agents/` or `.github/workflows/` files appear in the PR
diff at handover, the IAA trigger category expands to include AGENT_CONTRACT and/or CI_WORKFLOW
respectively. Foreman may not argue exemption. Per FAIL-ONLY-ONCE A-022: re-evaluate ALL
trigger categories on every invocation.

---

## Step 0.4 — Required Evidence Artifacts

### A. PRE_BRIEF_ASSURANCE (OVL-INJ-001)

| Artifact | Path | Status |
|----------|------|--------|
| IAA Pre-Brief artifact (this file) | `.agent-admin/assurance/iaa-prebrief-wave-ai-criteria-creation-fix.md` | ✅ BEING COMMITTED THIS SESSION |

**OVL-INJ-001 requirement met**: This artifact must be committed to the branch BEFORE any
builder task artifact is committed. This Pre-Brief is being produced first, before
implementation is delegated. This is the correct governance sequence.

---

### B. PREHANDOVER Proof — Required Structure

The producing agent (Foreman / delegated builder) MUST commit a PREHANDOVER proof to the branch
before invoking IAA at handover. The PREHANDOVER proof MUST contain ALL of the following fields:

```yaml
# PREHANDOVER Proof — wave-ai-criteria-creation-fix
wave_id: wave-ai-criteria-creation-fix
branch: copilot/fix-ai-criteria-creation-failure
session: session-<ID>-wave-ai-criteria-creation-fix-YYYYMMDD
date: YYYY-MM-DD
producing_agent: <agent(s) who implemented the fix>
issue_ref: <GitHub issue number>

# Scope Declaration — MUST MATCH `git diff --name-only origin/main...HEAD` EXACTLY (A-026)
scope_declaration:
  - <each file changed — exact path>
  # Must be current wave only — remove prior wave entries (A-028)

# Files in scope summary
files_changed:
  - path: supabase/functions/invoke-ai-parse-criteria/index.ts
    change: <describe fix applied>
  - path: <schema migration file if modified>
    change: <describe schema change>
  - path: <test file>
    change: <describe tests added>
  # ... all files

# Root Cause Evidence
root_cause_documented:
  finding: <specific root cause identified — FK violation / upsert conflict / missing column / etc.>
  evidence_source: <Supabase logs / Edge Function logs / Render logs — attach or summarise>

# Test Evidence — BD-011/BD-012 mandatory
test_evidence:
  command: <test command run>
  result: ALL PASS — N/N tests green
  test_ids: [<T-WACF-001>, <T-WACF-002>, ...]
  no_skips: true
  no_todos: true

# A-032 Schema Column Compliance Evidence (MANDATORY — FAIL-ONLY-ONCE A-032)
# IAA WILL read migration DDL directly. Every INSERT/SELECT column must exist in DDL.
a032_schema_column_compliance:
  criteria_table_ddl_file: <path to migration file>
  columns_used_in_insert: [<col1>, <col2>, ...]
  columns_used_in_select: [<col1>, <col2>, ...]
  ddl_cross_check: ALL PRESENT — no phantom columns

# RLS Verification Evidence (BD-015)
rls_verification:
  criteria_table_policies:
    SELECT: <policy name and condition>
    INSERT: <policy name and condition>
    UPDATE: <policy name and condition — if applicable>
    DELETE: <policy name and condition — if applicable>
  status: COMPLETE

# End-to-End Pipeline Evidence (BD-003 / BD-005)
e2e_pipeline_evidence:
  upload_test: <evidence of test upload working>
  db_entries_created: <evidence of DB entries present after test>
  ui_populated: <evidence of UI showing criteria after parse>
  pipeline_status: PASS

# IAA Audit Token — pre-populated expected reference (A-029 §4.3b)
# IAA will write its verdict to a dedicated token file. This field is READ-ONLY post-commit.
iaa_audit_token: IAA-session-prebrief-wave-ai-criteria-creation-fix-YYYYMMDD-PASS

# Git log evidence (A-021 — commit BEFORE invoking IAA)
git_log: |
  # Output of: git log --oneline -10 origin/main..HEAD
  # Must show all artifacts committed BEFORE IAA invocation
  <paste actual git log output>
```

> ⚠️ **POLC REMINDER**: The PREHANDOVER proof, session memory, and ALL wave artifacts MUST be
> committed and pushed to the branch BEFORE invoking IAA at handover (FAIL-ONLY-ONCE A-021).
> Working-tree-only files will trigger CORE-015, CORE-018 REJECTION-PACKAGE.
> This is the ninth+ recorded instance of A-021 in recent waves. Do NOT repeat.

---

### C. Session Memory File

Required file: `.agent-workspace/<producing-agent>/memory/session-<ID>-wave-ai-criteria-creation-fix-YYYYMMDD.md`
Must be committed to branch before IAA invocation at handover.

---

### D. SCOPE_DECLARATION.md (A-026 / A-028)

`SCOPE_DECLARATION.md` at repo root must:
- List ONLY the current wave files (not prior wave entries — A-028)
- Match `git diff --name-only origin/main...HEAD` EXACTLY (A-026)
- Be committed to branch before IAA invocation

---

### E. Dedicated IAA Token File (§4.3b / A-029)

IAA will write its verdict to:
`.agent-admin/assurance/iaa-token-session-<ID>-wave-ai-criteria-creation-fix-YYYYMMDD.md`

The PREHANDOVER proof's `iaa_audit_token` field must contain the **expected reference** for this
token file (pre-populated at PREHANDOVER commit time). IAA does NOT edit the PREHANDOVER proof
post-commit — it writes only to the dedicated token file.

---

## Step 0.5 — FFA Checks IAA Will Run at Handover

### Core Invariants (applied to ALL PRs)

| Check ID | Check Name | Priority for this wave |
|----------|-----------|------------------------|
| CORE-001 | YAML frontmatter valid | LOW (no agent contract in scope unless conditional) |
| CORE-005 | Governance block present | STANDARD |
| CORE-006 | CANON_INVENTORY alignment | STANDARD |
| CORE-007 | No placeholder content | STANDARD |
| CORE-013 | IAA invocation evidence | STANDARD |
| CORE-015 | Session memory present | STANDARD |
| CORE-016 | IAA verdict evidenced (§4.3b) | STANDARD |
| CORE-018 | Complete evidence artifact sweep | **CRITICAL — all 4 items must be present** |
| CORE-019 | IAA token cross-verification | STANDARD |
| CORE-020 | Zero partial pass rule | STANDARD |
| CORE-021 | Zero-severity-tolerance | STANDARD |
| CORE-022 | (any additional checks per checklist v2.8.0) | STANDARD |

---

### AAWP_MAT Overlay Checks

| Check ID | Check Name | Priority for this wave |
|----------|-----------|------------------------|
| BD-001 | Full scope delivered | **CRITICAL** — Root cause documented + fix + tests + evidence all required |
| BD-002 | No stub/TODO in production paths | **HIGH** |
| BD-003 | One-time build compliance | **CRITICAL** — Pipeline must work end-to-end first deployment |
| BD-004 | No leftover debt from previous jobs | HIGH |
| BD-005 | End-to-end wiring verified | **CRITICAL** — Upload → Edge Function → AI Gateway → DB → UI chain |
| BD-006 | Writers and readers confirmed | **CRITICAL** — criteria table must have confirmed INSERT and SELECT paths |
| BD-007 | Auth guards applied end-to-end | HIGH — RLS on criteria table |
| BD-008 | FK and relational integrity | **CRITICAL** — FK violations are explicitly cited in issue as potential root cause |
| BD-009 | Cross-component integration fit | HIGH |
| BD-010 | No orphaned deliverables | STANDARD |
| BD-011 | 100% test pass rate | **CRITICAL** — All QA tests GREEN, evidence required |
| BD-012 | Zero test debt | HIGH — no `.skip()`, `.only()`, incomplete stubs |
| BD-013 | No test dodging | HIGH — tests must assert on actual DB criteria creation |
| BD-014 | No deprecation accumulation | STANDARD |
| BD-015 | RLS policies complete | **HIGH** — criteria table RLS must cover SELECT/INSERT/UPDATE/DELETE for all roles |
| BD-016 | No hardcoded secrets | STANDARD |
| BD-017 | Input validation present | HIGH — AI gateway input validation |
| BD-018 | No obvious injection vectors | HIGH |
| BD-019 | International standards compliance | STANDARD |
| BD-020–BD-024 | Code quality & architecture fitness | ADVISORY unless severe |

### A-032 Schema Column Compliance (FAIL-ONLY-ONCE — HIGHEST PRIORITY)

> **A-032 is the single most important technical check for this wave.**
>
> The issue explicitly cites: upsert errors, missing columns, FK violations, transaction issues.
> These are exactly the failure modes A-032 was established to catch.
>
> IAA WILL:
> 1. Open the migration DDL for the `criteria` table directly
> 2. Extract every column name from the DDL
> 3. Cross-check every column name used in INSERT and SELECT operations in the Edge Function
>    and any other INSERT/SELECT paths against the DDL
> 4. Any column name used in code that does NOT exist in the DDL = **REJECTION-PACKAGE**
> 5. Mocked tests do NOT satisfy A-032 — IAA reads DDL directly
> 6. Silent `try/catch` does NOT exempt — IAA inspects all insert paths

> **Carry-forward note from wave-criteria-display-bugfix-1049**: The A-032 check was assessed
> as "NOT TRIGGERED" in that wave because the fix was logic-only (normaliseMpsNumber).
> In THIS wave, A-032 IS TRIGGERED — the issue explicitly targets DB column schema, upsert
> conflicts, and FK violations. A-032 applies with full force.

### PRE_BRIEF_ASSURANCE (OVL-INJ-001)

| Check ID | Check Name | Status at handover |
|----------|-----------|-------------------|
| OVL-INJ-001 | Pre-Brief Artifact Existence | Will PASS — this artifact being committed before implementation |

### CWT/CST Prompting Obligation

At handover, IAA will assess whether a **CST (Combined Subwave Testing)** checkpoint is warranted
given this wave introduces cross-boundary integration fixes (Edge Function ↔ AI Gateway ↔ DB ↔ UI).

If this wave completes and closes a cross-boundary integration point, IAA will prompt Foreman
for a CST before wave closure per `COMBINED_TESTING_PATTERN.md` §4.2.

---

## Step 0.6 — Scope Blockers and Governance Conflicts Visible Now

### Blocker 1 — POLC Sequence Compliance (KNOWN RISK — NOT a blocker yet)

**Observation**: The three most recent waves (wave-polc-boundary-fix-1052, wave-criteria-display-bugfix-1049,
wave-fix-vercel-supabase-migration) all received REJECTION-PACKAGEs on ceremony failures
specifically the A-021 pattern (artifacts committed after IAA invocation, not before).

**For this wave**: The PRE-BRIEF is being produced FIRST — this is correct. The risk is that
the builder implementing the fix will commit the PREHANDOVER proof and session memory as
untracked working-tree files before invoking IAA, repeating the A-021 pattern.

**IAA expectation**: Foreman/builder MUST stage, commit, and push ALL ceremony artifacts
(PREHANDOVER proof, session memory, SCOPE_DECLARATION.md) BEFORE invoking IAA at handover.
Failure to do so = REJECTION-PACKAGE on CORE-015 + CORE-018 + A-021 (again).

**This is a blocker waiting to happen. It is within Foreman's control to prevent.**

### Blocker 2 — CANON_INVENTORY.json Format Anomaly (ADVISORY)

**Observation**: IAA's Phase 1 parse of `governance/CANON_INVENTORY.json` returned 0 entries.
This may be a JSON structure anomaly (key name differing from expected `files`/`inventory`).
The file exists and was accessible — this is a parsing format issue, not a missing file.

**Impact**: CORE-006 (CANON_INVENTORY alignment) check at handover may surface this. If the
IAA canon file hash in CANON_INVENTORY.json is a placeholder (`null` / `""` / `000000`), this
becomes a HALT-002 condition.

**Action required before handover**: Foreman should verify `governance/CANON_INVENTORY.json`
contains valid non-placeholder SHA256 hashes for all canon files. If format is non-standard,
flag for CS2.

### Blocker 3 — SCOPE_DECLARATION.md Staleness (KNOWN RISK)

**Observation**: In the two most recent waves, SCOPE_DECLARATION.md was stale (showed prior
wave content, not current wave). This triggers A-026 / BL-027 at handover.

**For this wave**: SCOPE_DECLARATION.md MUST be updated to reflect current wave files and
MUST match `git diff --name-only origin/main...HEAD` exactly before IAA invocation.

### No Governance Conflicts Visible Now

No conflicts between the issue scope and existing governance canon are visible at this time.
The fix wave is a standard MAT AAWP deliverable — no agent contract changes, no canon changes,
no CI changes are implied by the issue description. If the implementation introduces any such
changes, trigger re-classification per A-022.

---

## Step 0.7 — PREHANDOVER Proof Checklist (Summary)

At handover, Foreman MUST confirm all items below are checked BEFORE invoking IAA:

```
Pre-IAA Commit Gate (A-021 / A-027):
[ ] All PREHANDOVER proof fields populated (including a032_schema_column_compliance)
[ ] PREHANDOVER proof committed and pushed to branch
[ ] Session memory file committed and pushed to branch
[ ] SCOPE_DECLARATION.md updated to current wave ONLY and committed and pushed
[ ] `git diff --name-only origin/main...HEAD` output attached or verified to match scope
[ ] All test results documented (test command + output + pass count)
[ ] E2E pipeline evidence attached (upload → DB entry → UI populated)
[ ] Supabase logs / Edge Function logs / Render logs summarised in proof

AFTER all above are committed and pushed → THEN invoke IAA.
```

---

## Artifact Summary

| Artifact | Path | Status |
|----------|------|--------|
| IAA Pre-Brief (this file) | `.agent-admin/assurance/iaa-prebrief-wave-ai-criteria-creation-fix.md` | ✅ CREATED — ready to commit |
| PREHANDOVER proof template | Foreman workspace / memory | ❌ NOT YET — produced by Foreman at implementation complete |
| Session memory (Foreman) | Foreman workspace / memory | ❌ NOT YET — produced at implementation complete |
| IAA token file | `.agent-admin/assurance/iaa-token-session-prebrief-wave-ai-criteria-creation-fix-YYYYMMDD.md` | ❌ NOT YET — produced by IAA at handover verdict |

---

## Qualifying Tasks Found

| # | Task | Trigger Category | Notes |
|---|------|-----------------|-------|
| 1 | Fix AI parsing pipeline (Edge Function + AI Gateway + DB wiring) | AAWP_MAT | Primary — all sub-tasks qualify |
| 2 | Fix DB schema issues (criteria table: columns, constraints, RLS, upsert) | AAWP_MAT | A-032 applies with full force |
| 3 | QA validation and test evidence | AAWP_MAT | BD-011/BD-012 mandatory |
| 4 | Root cause documentation | AAWP_MAT | BD-001 delivery completeness |
| 5 | CI/workflow changes (conditional) | CI_WORKFLOW | Only if `.github/workflows/` modified |
| 6 | Agent contract changes (conditional) | AGENT_CONTRACT | Only if `.github/agents/` modified |

**Total qualifying tasks**: 4 mandatory AAWP_MAT + 2 conditional

---

## IAA Pre-Brief Confirmation

This Pre-Brief artifact is committed to the branch BEFORE any implementation task is delegated.
This satisfies OVL-INJ-001 (Pre-Brief artifact existence check) for this wave.

Foreman may now delegate implementation tasks. IAA will be re-invoked at handover for full
Phase 2–4 assurance after ALL ceremony artifacts are committed and pushed.

**STOP-AND-FIX mandate**: ACTIVE. PHASE_B_BLOCKING. No PR opens until IAA issues ASSURANCE-TOKEN.

---

**IAA Pre-Brief Reference**: IAA-PREBRIEF-wave-ai-criteria-creation-fix-20260311
**Authority**: CS2 (Johan Ras / @APGI-cmy)
**Agent**: independent-assurance-agent v6.2.0
**Session**: session-prebrief-wave-ai-criteria-creation-fix-20260311
