# IAA Pre-Brief — wave-audit-log-column-fix

**Artifact Type**: IAA Pre-Brief
**Agent**: independent-assurance-agent
**Version**: 6.2.0 | Contract 2.2.0
**Wave**: wave-audit-log-column-fix
**Branch**: `copilot/fix-document-upload-issues`
**Issue**: fix(criteria-upload): audit_logs insert/query column mismatches prevent uploaded documents from appearing; migration drift and governance gaps require postmortem / scope closure
**Date**: 2026-03-08
**Authority**: CS2 (Johan Ras / @APGI-cmy)
**Protocol Reference**: IAA_PRE_BRIEF_PROTOCOL.md v1.1.0 §Trigger
**Adoption Phase**: PHASE_B_BLOCKING — Hard gate ACTIVE
**Prior Wave**: wave-upload-doclist-fix (PR #1007 — merged 2026-03-08)

---

## EXECUTIVE SUMMARY — WHY THIS WAVE EXISTS

PR #1007 (wave-upload-doclist-fix) was merged 2026-03-08 after IAA issued ASSURANCE-TOKEN
(`iaa-token-session-wave-upload-doclist-fix-20260308-R2-PASS` or equivalent). Post-merge
investigation confirms the implementation introduced column mismatches between the code and the
**actual** `audit_logs` schema. The IAA review on that wave found "no substantive findings"
and explicitly noted `resource_id in UploadedDocument: All good` — which was **incorrect**.

The mismatches are:

| Location | Wrong Columns Used | Correct Columns |
|----------|--------------------|-----------------|
| `useUploadCriteria` INSERT | `user_id` (non-existent), `resource_type` (non-existent), `resource_id` (non-existent) | `created_by`, remove `resource_type`, remove `resource_id` |
| `useUploadCriteria` INSERT | `organisation_id` OMITTED — NOT NULL constraint → silent DB failure | `organisation_id` REQUIRED |
| `useUploadedDocuments` SELECT | `resource_id` (non-existent → SELECT fails → "Failed to load") | Remove `resource_id` from select |
| `UploadedDocument` interface | `resource_id: string | null` field present | Remove field |
| Deduplication key | `row.resource_id ?? row.details?.file_path ?? row.file_path` | `row.details?.file_path ?? row.file_path` |

**Actual `audit_logs` schema** (confirmed from
`apps/maturion-maturity-legacy/supabase/migrations/20260308000001_audit_logs_table.sql`):

```sql
id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
audit_id        UUID        NOT NULL REFERENCES public.audits(id),
organisation_id UUID        NOT NULL REFERENCES public.organisations(id),  -- NOT NULL
action          TEXT        NOT NULL,
file_path       TEXT,
details         JSONB,
created_by      UUID        REFERENCES auth.users(id),  -- was misnamed user_id in code
created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
```

`user_id`, `resource_type`, `resource_id` do **not** exist in this schema.

---

## 1. Wave Scope Summary

This wave delivers three tasks in dependency order:

1. **T-ALCF-QA-001** (qa-builder): RED gate tests confirming the column mismatches before the fix
2. **T-ALCF-API-001** (api-builder): Fix `useUploadCriteria` INSERT, `useUploadedDocuments` SELECT,
   `UploadedDocument` interface, and deduplication key
3. **T-ALCF-GOV-001** (foreman-v2): Governance closure — INC-ALCF-001 registered in IAA
   FAIL-ONLY-ONCE, BUILD_PROGRESS_TRACKER, SCOPE_DECLARATION, implementation-plan updated;
   postmortem on how the column mismatch escaped the previous IAA gate

---

## 2. Task Registry — Qualifying Classification

| Task ID | Assigned To | Description | IAA Trigger Category | Qualifying? |
|---------|-------------|-------------|----------------------|-------------|
| T-ALCF-QA-001 | qa-builder | RED gate tests: (a) INSERT uses correct columns (`organisation_id`, `created_by`, NOT `resource_type`/`resource_id`/`user_id`); (b) SELECT does not include `resource_id`; (c) `UploadedDocument` interface has no `resource_id` field | AAWP_MAT | ✅ QUALIFYING |
| T-ALCF-API-001 | api-builder | Fix `useUploadCriteria` INSERT (replace `user_id`→`created_by`, add `organisation_id`, remove `resource_type`, remove `resource_id`). Fix `useUploadedDocuments` SELECT (remove `resource_id`). Update `UploadedDocument` interface (remove `resource_id`). Fix deduplication key. | AAWP_MAT | ✅ QUALIFYING |
| T-ALCF-GOV-001 | foreman-v2 | Register INC-ALCF-001 in FAIL-ONLY-ONCE (IAA's own registry — new rule A-031); update BUILD_PROGRESS_TRACKER; update SCOPE_DECLARATION; add wave entry to implementation-plan.md; postmortem: how did column mismatch escape the previous IAA gate? | KNOWLEDGE_GOVERNANCE (FAIL-ONLY-ONCE registry update) + AAWP_MAT (BUILD_PROGRESS_TRACKER) | ✅ QUALIFYING |

**Trigger categories active for this wave**:
- **AAWP_MAT**: Production code changes to `modules/mat/frontend/src/lib/hooks/useCriteria.ts` and tests
- **KNOWLEDGE_GOVERNANCE**: `.agent-workspace/independent-assurance-agent/knowledge/FAIL-ONLY-ONCE.md`
  update (new A-031 rule — Schema Column Compliance)

**IAA Final Audit**: MANDATORY — hard-blocking. PR must not be opened until ASSURANCE-TOKEN issued.

---

## 3. Files Expected In Diff — Trigger Mapping

| File | Category | IAA Check Focus |
|------|----------|-----------------|
| `modules/mat/frontend/src/lib/hooks/useCriteria.ts` | AAWP_MAT | INSERT uses `created_by`, `organisation_id`; no `user_id`/`resource_type`/`resource_id`; SELECT excludes `resource_id`; `UploadedDocument` has no `resource_id`; deduplication key fixed |
| `modules/mat/tests/wave-audit-log-column-fix/*.test.ts` (new) | AAWP_MAT | RED gate tests confirmed RED before fix; GREEN after |
| `.agent-workspace/independent-assurance-agent/knowledge/FAIL-ONLY-ONCE.md` | KNOWLEDGE_GOVERNANCE | A-031 (Schema Column Compliance Check) entry present |
| `.agent-workspace/foreman-v2/knowledge/FAIL-ONLY-ONCE.md` | KNOWLEDGE_GOVERNANCE | INC-ALCF-001 registered |
| `modules/mat/BUILD_PROGRESS_TRACKER.md` | AAWP_MAT (governance) | Wave entry for wave-audit-log-column-fix present; INC-ALCF-001 cross-referenced |
| `modules/mat/03-implementation-plan/implementation-plan.md` | AAWP_MAT (governance) | Wave entry added |
| `SCOPE_DECLARATION.md` | AAWP_MAT (governance) | All files listed above declared |

---

## 4. FFA Checks (Final Full Audit — to be executed at PREHANDOVER invocation)

These are the checks IAA will run at final audit invocation. Builders must produce evidence for each.

### 4.1 QA-to-RED Gate (HARD GATE — must precede T-ALCF-API-001)

| Check ID | Check | Evidence Required |
|----------|-------|-------------------|
| FFA-001 | All new tests in `modules/mat/tests/wave-audit-log-column-fix/` confirmed RED **before** API fix applied | QA gate certification from qa-builder: vitest output showing test names and RED state |
| FFA-002 | Test coverage: INSERT does NOT use `user_id`, `resource_type`, `resource_id` | Test file present; assertion verifiable |
| FFA-003 | Test coverage: INSERT DOES use `organisation_id` and `created_by` | Test file present; assertion verifiable |
| FFA-004 | Test coverage: SELECT does NOT include `resource_id` | Test file present; assertion verifiable |
| FFA-005 | Test coverage: `UploadedDocument` interface does NOT have `resource_id` field | Test file present; assertion verifiable |

### 4.2 Implementation Correctness (T-ALCF-API-001)

| Check ID | Check | Evidence Required |
|----------|-------|-------------------|
| FFA-006 | `useUploadCriteria` INSERT: `organisation_id: organisationId` present (already fetched for storage path) | Code inspection — `profile.organisation_id` value passed to INSERT |
| FFA-007 | `useUploadCriteria` INSERT: `created_by: user.id` replaces `user_id: user.id` | Code inspection — field name changed |
| FFA-008 | `useUploadCriteria` INSERT: `resource_type` and `resource_id` fields **absent** | Code inspection — no `resource_type`, no `resource_id` in INSERT object |
| FFA-009 | `useUploadCriteria` INSERT: `file_path` or `details.file_path` present (data path persisted in correct column) | Code inspection — `file_path: data.path` OR `details: { file_path: data.path }` |
| FFA-010 | `useUploadedDocuments` SELECT: `.select('id, file_path, action, details, created_at')` — no `resource_id` | Code inspection — `resource_id` absent from select string |
| FFA-011 | `UploadedDocument` interface: `resource_id` field removed | Type inspection in `useCriteria.ts` |
| FFA-012 | Deduplication key: `row.details?.file_path ?? row.file_path ?? ''` — no `row.resource_id` reference | Code inspection — deduplication key correct |
| FFA-013 | All new tests GREEN after fix | vitest output with all test names and GREEN state |
| FFA-014 | All pre-existing tests remain GREEN (regression check) | vitest output — no regressions |
| FFA-015 | TypeScript: `tsc --noEmit` exits 0 on the affected file | TSC output or CI evidence |

### 4.3 Schema Column Cross-Check (NEW — A-031 enforcement)

| Check ID | Check | Evidence Required |
|----------|-------|-------------------|
| FFA-016 | Migration file `20260308000001_audit_logs_table.sql` read by IAA directly; INSERT column names confirmed against schema | IAA reads migration file during final audit — evidence produced in IAA output |
| FFA-017 | SELECT column names confirmed against schema | IAA cross-checks SELECT string against schema column list |
| FFA-018 | No column names used in code that do not appear in migration schema | IAA sweep: code vs. schema diff = empty |

### 4.4 Governance Closure (T-ALCF-GOV-001)

| Check ID | Check | Evidence Required |
|----------|-------|-------------------|
| FFA-019 | INC-ALCF-001 registered in IAA FAIL-ONLY-ONCE.md as new rule A-031 | File present on branch; A-031 entry readable |
| FFA-020 | INC-ALCF-001 registered in Foreman FAIL-ONLY-ONCE.md | File present on branch; entry readable |
| FFA-021 | BUILD_PROGRESS_TRACKER updated with wave-audit-log-column-fix entry | File present on branch |
| FFA-022 | SCOPE_DECLARATION.md matches git diff (A-026 compliance) | validate-scope-to-diff.sh exits 0 |
| FFA-023 | Postmortem present (see §6 below): root cause and corrective action documented | Postmortem entry in INC-ALCF-001 or dedicated postmortem file |

---

## 5. PREHANDOVER Proof Structure Required

The foreman (or designated handover agent) MUST commit a PREHANDOVER proof file to the branch
**before** invoking IAA for the final audit. The file must be at:

```
.agent-workspace/foreman-v2/memory/PREHANDOVER-session-wave-audit-log-column-fix-20260308.md
```

Required fields (§4.3b architecture — A-029):

```yaml
session_id: session-wave-audit-log-column-fix-20260308
wave: wave-audit-log-column-fix
branch: copilot/fix-document-upload-issues
producing_agents:
  - qa-builder (T-ALCF-QA-001)
  - api-builder (T-ALCF-API-001)
  - foreman-v2-agent (T-ALCF-GOV-001)
deliverables:
  - modules/mat/frontend/src/lib/hooks/useCriteria.ts (fixed)
  - modules/mat/tests/wave-audit-log-column-fix/*.test.ts (new)
  - .agent-workspace/independent-assurance-agent/knowledge/FAIL-ONLY-ONCE.md (A-031 added)
  - .agent-workspace/foreman-v2/knowledge/FAIL-ONLY-ONCE.md (INC-ALCF-001 added)
  - modules/mat/BUILD_PROGRESS_TRACKER.md (updated)
  - modules/mat/03-implementation-plan/implementation-plan.md (updated)
  - SCOPE_DECLARATION.md (updated)
acceptance_criteria_met: [list each item from wave-current-tasks.md acceptance criteria]
iaa_audit_token: IAA-session-wave-audit-log-column-fix-20260308-PASS  # expected reference format (§4.3b)
commit_sha: [git commit SHA of final commit before IAA invocation]
working_tree_clean: true  # A-021 — must be clean
scope_declaration_matches_diff: true  # A-026 — validate-scope-to-diff.sh must exit 0
```

**A-021 mandatory**: Working tree must be clean at time of IAA invocation. All files committed.
**A-026 mandatory**: SCOPE_DECLARATION.md must include every file in the git diff. Run
`validate-scope-to-diff.sh` before invoking IAA; fix any discrepancy before invocation.

---

## 6. Postmortem — How Did Column Mismatches Escape the Previous IAA Gate?

### Incident Reference: INC-ALCF-001

**Wave affected**: wave-upload-doclist-fix (branch `copilot/fix-ai-parsing-trigger`, PR #1007)
**IAA sessions**: session-wave-upload-doclist-fix-20260308 (R1 REJECTION) → R2 (REJECTION) → final PASS

### Root Cause Analysis

The IAA R2 session memory explicitly stated:

> *"Technical quality note: The audit_log write is correctly placed in a try/catch that is
> non-fatal (upload result returned regardless). The STATUS_PRIORITY Map uses an O(n) single-pass
> deduplication. TypeScript interfaces are fully typed **including resource_id in UploadedDocument.
> All good.**"*

IAA confirmed `resource_id` was present and said "All good" — which was incorrect. The root
cause is a **gap in IAA's BD-005/BD-006 schema column compliance check**:

1. **BD-005 (End-to-end wiring)** and **BD-006 (Writers and readers confirmed)** were applied to
   verify the logic flow (upload → audit_log → query → UI) but did **not** include reading the
   actual migration file to cross-check INSERT/SELECT column names against the schema.

2. The migration file is at `apps/maturion-maturity-legacy/supabase/migrations/20260308000001_audit_logs_table.sql`
   — a **legacy app path**, not the standard `supabase/migrations/` path. IAA did not read this
   file during the wave-upload-doclist-fix review.

3. The `try/catch` wrapper around the INSERT made the failure **silent** in the application.
   No runtime error surfaced during testing because the INSERT failed silently at the DB layer
   (NOT NULL `organisation_id` constraint violation, plus non-existent columns). The tests
   mocked Supabase and did not exercise the schema contract.

### Corrective Action — New Rule A-031

**A-031 (Schema Column Compliance Check)** must be added to IAA FAIL-ONLY-ONCE:

> *For any PR containing Supabase INSERT or SELECT operations on a named table:
> IAA MUST read the migration file for that table and cross-check every column name used in
> INSERT values and SELECT strings against the schema definition. Any column used in code that
> does not appear in the migration = REJECTION-PACKAGE. This check is BD-TIER-2 mandatory,
> executed as part of BD-005/BD-006.*

**Why the tests did not catch this**: The QA RED gate tests for wave-upload-doclist-fix (T-WUF-QA-001)
tested the logic (query includes `criteria_upload` action, deduplication by `resource_id`, etc.)
but used mocked Supabase clients. The mocks returned whatever columns were requested — no schema
contract validation. The new RED gate tests for this wave (T-ALCF-QA-001) must assert that the
INSERT object contains exactly the correct column names and that `resource_id` does NOT appear.

**Systemic gap identified**: When Supabase is mocked at the client level, column name errors are
invisible. For column compliance, tests must either: (a) assert the exact object passed to
`.insert()` matches the schema, or (b) run against a live Supabase instance. T-ALCF-QA-001
must use option (a) — spy/capture the insert arguments and assert column names.

---

## 7. Scope Blockers and Governance Conflicts

### Blocker 1 — A-031 Must Be in IAA FAIL-ONLY-ONCE Before Final Audit

The new rule A-031 (Schema Column Compliance Check) must be added to IAA's own
`.agent-workspace/independent-assurance-agent/knowledge/FAIL-ONLY-ONCE.md` as part of
T-ALCF-GOV-001. IAA will enforce A-031 during the final audit (FFA-016 through FFA-018).
If A-031 is not present in FAIL-ONLY-ONCE at time of final audit invocation → REJECTION-PACKAGE
(CORE-007 placeholder content or missing governance artifact).

**Resolution**: T-ALCF-GOV-001 must include adding A-031 to **IAA's** FAIL-ONLY-ONCE, not only
Foreman's. This is noted as a shared responsibility between foreman-v2-agent and IAA self-governance.
IAA will confirm the rule is present during the final audit.

### Blocker 2 — `organisation_id` Value Source Must Be Explicit

The `organisation_id` value is already available in `useUploadCriteria` (fetched as `organisationId`
from `profile.organisation_id` for the storage path). The fix must pass this value into the INSERT.
IAA will verify this explicitly (FFA-006). The api-builder must not introduce a new profile fetch —
reuse the already-fetched `organisationId` variable.

### Blocker 3 — `file_path` Column Usage Must Be Confirmed

The schema has `file_path TEXT` as a top-level column. The original code stored the file path
only in `details.file_path` (JSONB). The fix must determine whether to use the top-level
`file_path` column, `details.file_path`, or both. IAA will verify (FFA-009):

**Recommended pattern**: Store in both — `file_path: data.path` at the top level AND
`details: { file_path: data.path, file_name: ..., file_size: ..., hash: ... }` in JSONB.
This satisfies the top-level index (`audit_logs_action_idx` exists; no `file_path` index,
but direct column allows future indexing) and preserves the rich `details` payload.

### Governance Conflict — Silent Try/Catch Anti-Pattern

The current implementation wraps the INSERT in a `try/catch` with:
```typescript
// Non-fatal: audit_log write failure must not block the upload result
console.warn('[useUploadCriteria] audit_log write failed; ...');
```

This is architecturally correct (the upload must not be blocked by a logging failure). However,
the **silent failure mode** is what allowed the column mismatch to go undetected in production.
The fix must preserve the non-fatal wrapper (per the original architecture) but the test suite
must now assert the INSERT is called with the correct columns — so the non-fatal wrapper is
tested for correctness, not just presence.

**IAA will not require changing the non-fatal pattern** — it is the correct architecture for
observability writes. But T-ALCF-QA-001 must assert argument correctness, not just call presence.

---

## 8. Dependency Chain

```
IAA Pre-Brief (this artifact) — COMPLETE
  ↓
T-ALCF-QA-001 (qa-builder): RED gate tests
  — tests must be RED before T-ALCF-API-001 begins
  — qa-builder commits test file, runs vitest, captures RED output as evidence
  ↓ CST Gate: QA → API
T-ALCF-API-001 (api-builder): column fix
  — fix useCriteria.ts as specified above
  — all new tests GREEN; all pre-existing tests GREEN
  ↓
T-ALCF-GOV-001 (foreman-v2): governance closure
  — INC-ALCF-001 in Foreman FAIL-ONLY-ONCE
  — A-031 in IAA FAIL-ONLY-ONCE
  — BUILD_PROGRESS_TRACKER + SCOPE_DECLARATION + implementation-plan updated
  ↓
PREHANDOVER proof committed (foreman-v2) — A-021: working tree clean
  ↓
IAA Final Audit invocation
  — FFA-001 through FFA-023 executed
  — A-031 (Schema Column Compliance) applied — migration file read directly
  ↓
ASSURANCE-TOKEN issued → CS2 review → merge gate release
```

---

## 9. Applicable Overlays

| Category | Overlay Applied |
|----------|----------------|
| AAWP_MAT | BUILD_DELIVERABLE overlay: BD-TIER-1 through BD-TIER-6 (all tiers) |
| KNOWLEDGE_GOVERNANCE | Existence check: FAIL-ONLY-ONCE A-031 entry present (binary) |

The BUILD_DELIVERABLE overlay is the primary overlay. BD-003 (one-time build compliance) is
the key check: **if this PR is merged and the app is opened, will uploaded documents appear
in the document list?** The answer must be YES before ASSURANCE-TOKEN is issued.

---

## 10. IAA Self-Governance Note — Postmortem on IAA Gate Miss

IAA acknowledges that the previous wave-upload-doclist-fix review contained a substantive
error: IAA explicitly confirmed `resource_id in UploadedDocument: All good` — which was
incorrect. This is a gap in IAA's own BD-005/BD-006 application.

**The corrective action at IAA level**:
1. A-031 is declared in this Pre-Brief and will be added to IAA FAIL-ONLY-ONCE as part of T-ALCF-GOV-001
2. The final audit for this wave will apply A-031 (FFA-016 through FFA-018) — IAA will read the migration file directly
3. This Pre-Brief is itself evidence that IAA has identified and is closing its own gap without
   deflecting responsibility

**No waiver or exemption applies**: IAA's own error is subject to the same STOP-AND-FIX mandate.
The fix is this wave. The governance record is INC-ALCF-001.

---

## 11. Pre-Brief Status

| Item | Status |
|------|--------|
| Wave tasks identified | ✅ COMPLETE — 3 qualifying tasks |
| Trigger categories declared | ✅ COMPLETE — AAWP_MAT + KNOWLEDGE_GOVERNANCE |
| FFA checks declared | ✅ COMPLETE — FFA-001 through FFA-023 |
| PREHANDOVER structure declared | ✅ COMPLETE — §5 above |
| Scope blockers identified | ✅ COMPLETE — §7 above (3 blockers) |
| Governance conflicts identified | ✅ COMPLETE — §7 above |
| IAA postmortem | ✅ COMPLETE — §6 above |
| Artifact committed | ✅ COMMITTED (this file) |

**IAA Final Audit**: Invocation required after T-ALCF-GOV-001 completes and PREHANDOVER proof
is committed. Invoke via `task(agent_type='independent-assurance-agent')` from foreman-v2-agent.
Hard-blocking — PR must not be opened without ASSURANCE-TOKEN.

---

**Pre-Brief issued by**: independent-assurance-agent
**Session reference**: session-prebrief-wave-audit-log-column-fix-20260308
**Date**: 2026-03-08
**Authority**: CS2 (Johan Ras / @APGI-cmy)
**Adoption Phase**: PHASE_B_BLOCKING
