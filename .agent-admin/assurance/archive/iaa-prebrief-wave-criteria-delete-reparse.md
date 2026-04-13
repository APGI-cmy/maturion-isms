# IAA Pre-Brief — wave-criteria-delete-reparse (RETROACTIVE)

**Artifact Type**: IAA Pre-Brief (Phase 0 — Retroactive)
**Pre-Brief ID**: IAA-PB-wave-criteria-delete-reparse-20260309
**Wave**: wave-criteria-delete-reparse
**Branch**: copilot/add-document-delete-reparse-function
**Issue**: Add document delete + re-parse (replace) function with governance overlay for criteria management
**Date**: 2026-03-09
**IAA Version**: 6.2.0 (contract v2.2.0)
**Adoption Phase**: PHASE_B_BLOCKING — Hard gate ACTIVE
**Authority**: CS2 (Johan Ras / @APGI-cmy)

---

## Phase 0 — Pre-Brief Mode Confirmed

This Pre-Brief was invoked **retroactively**. All build work on branch `copilot/add-document-delete-reparse-function`
was committed before the IAA Pre-Brief was triggered. This constitutes a **GOV-BREACH-AIMC-W5-002 — preflight skip**.

**Breach status**: Acknowledged by foreman-v2-agent (wave-current-tasks.md § POLC Violation Record).
**Remediation path**: IAA will conduct a full retroactive assurance audit at handover.
The breach does NOT prevent ASSURANCE-TOKEN — it must be formally documented in the PREHANDOVER proof.

---

## §1 — Wave Scope Read

Source: `.agent-workspace/foreman-v2/personal/wave-current-tasks.md`

| Task ID | Task | Agent | Status |
|---------|------|-------|--------|
| T-CDR-ESL-001 | Fix ESLint CI failure: wrap `invalidate` in `useCallback` | ui-builder | 🟢 DONE |
| T-CDR-API-001 | Add `useDeleteCriteriaDocument` hook | api-builder | 🟢 DONE |
| T-CDR-API-002 | Add `useReparseCriteriaDocument` hook | api-builder | 🟢 DONE |
| T-CDR-UI-001 | Update `CriteriaUpload.tsx` — delete + re-parse buttons + confirmation dialogs | ui-builder | 🟢 DONE |
| T-CDR-QA-001 | Add tests `criteria-delete-reparse.test.ts` — 29 assertions T-DEL-001 to T-DEL-014 | qa-builder | 🟢 DONE |
| T-CDR-GOV-001 | Governance overlay `OVL-CRITERIA-DELETE-REPARSE.md` | foreman-v2-agent | 🟢 DONE |
| T-CDR-FM-001 | IAA Pre-Brief invocation (retroactive) | foreman-v2-agent | 🟡 IN PROGRESS |
| T-CDR-FM-002 | Receive ASSURANCE-TOKEN from IAA | independent-assurance-agent | 🔴 PENDING |
| T-CDR-FM-003 | PREHANDOVER proof + session memory + IAA token ceremony | foreman-v2-agent | 🔴 PENDING |

**Files Changed on Branch** (verified via `git diff origin/main...HEAD --name-only`):

```
.agent-workspace/foreman-v2/personal/wave-current-tasks.md
governance/overlays/OVL-CRITERIA-DELETE-REPARSE.md
modules/mat/frontend/src/components/criteria/CriteriaUpload.tsx
modules/mat/frontend/src/lib/hooks/useCriteria.ts
modules/mat/frontend/tests/criteria-delete-reparse.test.ts
```

5 files changed. No agent contract files, no canon files, no CI/workflow files.

---

## §2 — Trigger Category Classification

Per `iaa-trigger-table.md` v2.1.0 — Classification Decision Flow applied:

| Step | Question | Answer | Classification |
|------|----------|--------|----------------|
| 1 | Any `.github/agents/` or `governance/agents/` changes? | NO | — |
| 2 | Any `governance/canon/` or `CANON_INVENTORY.json` changes? | NO | — |
| 3 | Any `.github/workflows/` changes? | NO | — |
| 4 | AAWP/MAT deliverable artifacts (`modules/mat/`)? | YES | AAWP_MAT ← PRIMARY |
| 5 | Any `governance/quality/agent-integrity/` changes? | NO | — |
| 6 | Any `.agent-workspace/*/knowledge/` file changes? | NO | — |
| 7 | `governance/overlays/OVL-CRITERIA-DELETE-REPARSE.md` | GOVERNANCE DOC (overlay) | AAWP_MAT supporting artifact |

**Final Classification**: `AAWP_MAT`

**Note on governance overlay**: `governance/overlays/` is NOT `governance/canon/`. The overlay is a
supporting governance artifact for the MAT deliverable, classified under AAWP_MAT. It does not
trigger CANON_GOVERNANCE independently.

**AMBIGUITY CHECK**: No ambiguity. Classification is clear. AAWP_MAT confirmed.

**IAA Triggered**: YES — MANDATORY (AAWP_MAT is a mandatory trigger category).

---

## §3 — Qualifying Tasks for IAA Assurance

Applying trigger table to wave tasks:

| Task ID | Category | Qualifying? | Notes |
|---------|----------|-------------|-------|
| T-CDR-ESL-001 | AAWP_MAT — source hook fix | ✅ QUALIFYING | React hook change in `modules/mat/` |
| T-CDR-API-001 | AAWP_MAT — new mutation hook | ✅ QUALIFYING | New `useDeleteCriteriaDocument` hook |
| T-CDR-API-002 | AAWP_MAT — new mutation hook | ✅ QUALIFYING | New `useReparseCriteriaDocument` hook |
| T-CDR-UI-001 | AAWP_MAT — UI component change | ✅ QUALIFYING | New buttons + confirmation flow in `CriteriaUpload.tsx` |
| T-CDR-QA-001 | AAWP_MAT — test suite | ✅ QUALIFYING | 29 assertions T-DEL-001 to T-DEL-014 |
| T-CDR-GOV-001 | AAWP_MAT supporting governance | ✅ QUALIFYING | Governance overlay — AAWP_MAT support artifact |

All 6 delivered tasks are qualifying. IAA will audit all of them.

---

## §4 — Schema Column Compliance (A-032 — Mandatory Pre-Brief Verification)

Per FAIL-ONLY-ONCE A-032: IAA must read migration DDL and cross-check every column name for any
PR containing INSERT/SELECT/DELETE operations on named Supabase tables.

**Tables affected by new hooks**:

### `public.domains`
Migration: `20260302000000_mat_core_tables.sql`
Schema columns: `id`, `audit_id`, `organisation_id`, `number`, `name`, `description`, `created_at`, `updated_at`

| Operation in hook | Column used | Schema match |
|-------------------|-------------|--------------|
| `.delete().eq('audit_id', auditId)` | `audit_id` | ✅ PRESENT |

### `public.criteria_documents`
Migration: `20260309000002_criteria_documents_processing_status.sql`
Schema columns: `id`, `audit_id`, `file_path`, `status`, `created_at`, `updated_at`

| Operation in hook | Column used | Schema match |
|-------------------|-------------|--------------|
| `.delete().eq('audit_id', auditId).eq('file_path', filePath)` | `audit_id`, `file_path` | ✅ BOTH PRESENT |
| `.upsert({ audit_id, file_path, status: 'processing' })` | `audit_id`, `file_path`, `status` | ✅ ALL PRESENT |
| Conflict target: `onConflict: 'audit_id,file_path'` | composite unique? | ⚠️ SEE NOTE |

**NOTE — upsert conflict target**: The criteria_documents schema does NOT declare a UNIQUE constraint
on `(audit_id, file_path)` in the migration DDL read above. The `upsert` uses `onConflict: 'audit_id,file_path'`
which requires a unique index or unique constraint on that pair. IAA must verify at handover that
either: (a) a separate migration adds this constraint, or (b) the existing criteria_documents
record is always first inserted via the upload path (which would fail on duplicate without the
unique constraint). This is a **pre-condition check item** — not a blocking finding at Pre-Brief
stage, but must be verified at handover.

### `public.audit_logs`
Migration: `20260308000001_audit_logs_table.sql`
Schema columns: `id`, `audit_id`, `organisation_id`, `action`, `file_path`, `details`, `created_by`, `created_at`

| Operation in hook | Column used | Schema match |
|-------------------|-------------|--------------|
| `.delete().eq('audit_id', auditId).eq('file_path', filePath).in('action', [...])` | `audit_id`, `file_path`, `action` | ✅ ALL PRESENT |

**A-032 Preliminary Status**: CONDITIONAL PASS pending handover verification of `criteria_documents` unique constraint.

---

## §5 — RLS Policy Status (Pre-Brief Verification)

| Table | RLS Enabled | Policies Present |
|-------|-------------|-----------------|
| `domains` | ✅ YES (`ALTER TABLE public.domains ENABLE ROW LEVEL SECURITY`) | `domains_org_isolation` policy present |
| `criteria_documents` | ✅ YES (`ALTER TABLE public.criteria_documents ENABLE ROW LEVEL SECURITY`) | `criteria_documents_org_isolation` policy present |
| `audit_logs` | ✅ YES (`ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY`) | `audit_logs_org_isolation` + `audit_logs_insert_authenticated` present |
| `mini_performance_standards` | ✅ YES (FROM mat_core_tables.sql) | Cascaded from domains |

No new tables introduced. All existing RLS policies remain in effect. **RLS check: PRE-CLEAR**.

---

## §6 — FFA Checks IAA Will Run at Handover

These are the specific checks IAA will execute during Phase 3 — Assurance Work when the
Foreman invokes IAA for the full audit:

### Category: AAWP_MAT BUILD_DELIVERABLE Overlay

#### BD-TIER-1 — Delivery Completeness
| FFA Check | Scope |
|-----------|-------|
| BD-001 | All 5 declared files present in diff; all 6 task deliverables present |
| BD-002 | No stub/TODO in hook implementations or UI component — inspect production paths |
| BD-003 | One-time build: merge + deploy = working delete/reparse feature without follow-up fix |
| BD-004 | No leftover debt (ESLint fix is part of scope — verify no new violations introduced) |

#### BD-TIER-2 — Wiring & Integration Verification
| FFA Check | Scope |
|-----------|-------|
| BD-005 | Trace: `useDeleteCriteriaDocument` → Supabase tables → `onSuccess` cache invalidation → UI list refresh |
| BD-005 | Trace: `useReparseCriteriaDocument` → domains delete → upsert processing → Edge Function invoke → cache invalidation |
| BD-005 | Trace: UI delete button → `setConfirmDeleteFilePath` → confirmation banner → `handleConfirmDelete` → mutation |
| BD-005 | Trace: UI reparse button → `setConfirmReparseFilePath` → confirmation banner → `handleConfirmReparse` → mutation |
| BD-006 | Writers: both new mutations write to Supabase; Readers: `useUploadedDocuments` reads from `criteria_documents` |
| BD-007 | Auth guard: `useReparseCriteriaDocument` calls `supabase.auth.refreshSession()` before Edge Function invoke — VERIFY present |
| BD-008 | FK/relational integrity: domains CASCADE to MPS → criteria; this is relied upon for delete cascade |
| BD-009 | Interface fit: new hooks exported from `useCriteria.ts` and consumed in `CriteriaUpload.tsx` — verify import alignment |
| BD-010 | No orphaned deliverables — test file must reference both hooks and UI paths |

#### BD-TIER-3 — Test Quality
| FFA Check | Scope |
|-----------|-------|
| BD-011 | Re-run `vitest run modules/mat/frontend/tests/criteria-delete-reparse.test.ts` at handover — must report 29/29 PASS |
| BD-012 | Zero test debt — no `.skip()`, `.only()`, `test.todo()` in test file |
| BD-013 | No test dodging — file-based assertions must accurately reflect actual hook implementation |

#### BD-TIER-4 — Security
| FFA Check | Scope |
|-----------|-------|
| BD-015 | RLS: no new tables; all existing tables have RLS (pre-cleared in §5 above) |
| BD-016 | No hardcoded secrets or tokens in new code |
| BD-017 | Input validation: `auditId` and `filePath` are typed TypeScript inputs from authenticated session |
| BD-018 | No injection vectors: all DB operations use Supabase client parameterised calls; no raw SQL |

#### BD-TIER-5 — Code Quality
| FFA Check | Scope |
|-----------|-------|
| BD-020 | Code structure: hooks are well-factored; UI handlers are concise |
| BD-021 | TypeScript strictness: no `any` casts, proper error propagation |
| BD-022 | Architecture alignment: hooks follow existing `useMutation` + TanStack Query patterns |

#### BD-TIER-6 — FFA Summary
IAA will produce a full FFA-01 through FFA-06 summary at handover.

### Category: Core Invariants (ALL)
| CORE Check | Scope |
|------------|-------|
| CORE-007 | No placeholder content in any artifact |
| CORE-013 | IAA invocation evidence in PREHANDOVER proof |
| CORE-015 | Session memory present (foreman session memory) |
| CORE-016 | IAA verdict token file present (issued at handover) |
| CORE-018 | Complete evidence artifact sweep: PREHANDOVER + session memory + iaa_audit_token field |
| CORE-019 | First invocation — token file will be created this handover session |
| CORE-020 | Zero partial pass rule |
| CORE-021 | Zero-severity-tolerance |

### FAIL-ONLY-ONCE Rules Applied at Handover
| Rule | Check |
|------|-------|
| A-021 | Clean working tree before IAA invocation — `git status` must show no untracked committed items |
| A-026 | SCOPE_DECLARATION.md must match `git diff --name-only origin/main...HEAD` exactly |
| A-028 | SCOPE_DECLARATION format: list format required; prior-wave entries trimmed |
| A-029 | `iaa_audit_token` pre-populated in PREHANDOVER proof with expected reference format |
| A-031 | IAA ceremony artifacts (this pre-brief + token file) excluded via A-031 carve-out in SCOPE_DECLARATION |
| A-032 | Schema column compliance — full re-verification at handover (including upsert conflict target) |

### INTEGRATION TESTING — CST Assessment
Per `COMBINED_TESTING_PATTERN.md` §4.2:

This wave introduces new mutation paths (`useDeleteCriteriaDocument`, `useReparseCriteriaDocument`)
that invoke the existing `invoke-ai-parse-criteria` Edge Function. This is a **cross-boundary
integration point** (frontend → Supabase Edge Function).

**CST Assessment**: The Edge Function interface is **unchanged** — same invocation pattern, same
`body: { auditId, filePath }` contract, same auth header pattern. The prior wave that implemented
this Edge Function has already been through assurance. Cumulative regression coverage via the
existing 29 file-based assertions is sufficient for this integration point.

**IAA Determination**: CST is **NOT REQUIRED** for this wave. The integration point is stable
and the interface contract is verified. Cumulative regression is sufficient.

**CWT Requirement**: Per `COMBINED_TESTING_PATTERN.md` §5.2, a CWT PASS verdict is mandatory
before IBWR completion. This wave does not appear to include an IBWR artifact. If the Foreman
intends this wave as a wave-complete gate (i.e., it closes the MAT criteria management capability),
CWT must be commissioned before PR is opened as final. If this is a sub-wave within a larger wave
(Wave 16.x series), CWT may be deferred to the wave completion gate. **Foreman must clarify**
whether a CWT is required at this wave's closure.

---

## §7 — PREHANDOVER Proof Structure Required

The PREHANDOVER proof committed before IAA invocation must contain all of the following:

```
Path: .agent-workspace/foreman-v2/memory/PREHANDOVER-session-wave-criteria-delete-reparse-YYYYMMDD.md

Required fields:
  wave: wave-criteria-delete-reparse
  branch: copilot/add-document-delete-reparse-function
  session_id: session-wave-criteria-delete-reparse-20260309
  producing_agents: [api-builder, ui-builder, qa-builder, foreman-v2-agent]
  iaa_audit_token: IAA-session-wave-criteria-delete-reparse-20260309-PASS
    (pre-populated expected reference per A-029 §4.3b — not PENDING)
  polc_violation_acknowledgement: GOV-BREACH-AIMC-W5-002 documented
    (code committed before pre-brief; retroactive IAA audit conducted)
  scope_declaration_match: CONFIRMED (A-026)
  a031_carve_out_note: PRESENT (covering this pre-brief file + IAA token file)
  
Required evidence sections:
  - Delivery summary (all 6 tasks: T-CDR-ESL-001 through T-CDR-GOV-001 with DONE status)
  - Test results: vitest run evidence showing 29/29 PASS
  - ESLint/lint gate: evidence showing 0 warnings for the changed files
  - IAA pre-brief artifact: .agent-admin/assurance/iaa-prebrief-wave-criteria-delete-reparse.md
  - Session memory path reference
  - SCOPE_DECLARATION.md compliance note
```

---

## §8 — SCOPE_DECLARATION.md Requirements (A-026 / A-028)

**Current state**: `SCOPE_DECLARATION.md` on branch shows **wave-mat-gov-process** scope — this is
from the prior wave and has NOT been updated for this wave. This is a **mandatory fix before IAA
invocation at handover**.

**Required**: Foreman must update `SCOPE_DECLARATION.md` to declare the 5 diff files for this wave:

```markdown
# Scope Declaration — wave-criteria-delete-reparse — 2026-03-09

## Changed Files
- `modules/mat/frontend/src/lib/hooks/useCriteria.ts` — ESLint fix + 2 new mutation hooks
- `modules/mat/frontend/src/components/criteria/CriteriaUpload.tsx` — delete/reparse UI
- `modules/mat/frontend/tests/criteria-delete-reparse.test.ts` — 29 test assertions (NEW)
- `governance/overlays/OVL-CRITERIA-DELETE-REPARSE.md` — governance overlay (NEW)
- `.agent-workspace/foreman-v2/personal/wave-current-tasks.md` — wave tasks updated

## Governance Actions
- IAA ceremony artifacts from wave-criteria-delete-reparse committed on branch
  (IAA pre-brief, IAA token file, IAA session memory, IAA parking station update)
  excluded per A-031 carve-out. These are IAA-owned files; producing agent deliverables
  declared above.
```

---

## §9 — Retroactive Assessment: Does Committed Work Satisfy Requirements?

IAA has conducted a preliminary technical review of the committed code based on the diff.

### Substantive Assessment

| Area | Preliminary Status | Notes |
|------|-------------------|-------|
| ESLint fix (useCallback) | ✅ CLEAN | `invalidate` wrapped with `useCallback([queryClient, auditId])` — correct dependencies |
| Delete hook scope safety | ✅ CLEAN | All DELETE ops gated by `.eq('audit_id', auditId)` — no cross-audit contamination |
| Reparse sequence | ✅ CLEAN | Clear domains → upsert processing → session refresh → Edge Function invocation |
| Auth guard in reparse | ✅ CLEAN | `supabase.auth.refreshSession()` called before Edge Function invoke |
| UI confirmation dialogs | ✅ CLEAN | `role="alertdialog"`, `aria-modal="true"` present; separate state for delete vs reparse |
| Error surfacing | ✅ CLEAN | `actionError` state surfaces errors inline; no bare `alert()` calls |
| Confirmation before destructive action | ✅ CLEAN | Both delete and reparse require explicit user confirm before mutation fires |
| Test coverage (29/29) | ✅ PASS (at commit time) | File-based assertions; re-run required at handover to confirm still green |
| Schema column compliance (A-032) | ⚠️ CONDITIONAL | `criteria_documents` upsert conflict target needs unique constraint verification |
| RLS completeness | ✅ PRE-CLEAR | All affected tables have RLS; no new tables |
| Governance overlay | ✅ CLEAN | OVL-CRITERIA-DELETE-REPARSE.md documents gap, resolution, limitations accurately |

### Known Limitation Assessment

| Limitation ID | Severity | IAA Assessment |
|---------------|----------|---------------|
| LIM-001 (delete affects all audit criteria, not per-document) | MODERATE | **ACCEPTED** — architectural constraint of current schema; correctly disclosed in overlay §3.2 and §5. UI confirmation wording must accurately reflect that ALL criteria for the audit will be removed, not just the selected document's criteria. IAA will verify confirmation wording at handover. |
| LIM-002 (storage object not deleted) | LOW | **ACCEPTED** — intentional design; file preserved for re-parse. Acceptable and disclosed. |
| LIM-003 (cascade assignments) | LOW | **ACCEPTED** — governed by Supabase ON DELETE CASCADE; schema-enforced. |

### POLC Violation — Formal Finding

**Finding**: GOV-BREACH-AIMC-W5-002 — Code committed before IAA Pre-Brief invocation.

**IAA Position**: This is a genuine procedural breach. However:
1. The work itself appears technically sound (preliminary assessment above).
2. The breach was acknowledged immediately in wave-current-tasks.md.
3. No governance harm has occurred as a result (no merge has taken place).
4. Retroactive audit is the correct remediation path per IAA protocol.

**This breach does NOT pre-determine the ASSURANCE-TOKEN verdict.** IAA will assess the
work on its merits. The breach must be formally documented in the PREHANDOVER proof.

### Preliminary Verdict Forecast

Based on preliminary review, IAA foresees a **probable ASSURANCE-TOKEN** provided:
1. PREHANDOVER proof is committed with all required fields (§7 above)
2. SCOPE_DECLARATION.md is updated for this wave (§8 above)
3. Session memory committed
4. `criteria_documents` unique constraint verified or upsert behaviour explained
5. Working tree clean before IAA invocation
6. 29/29 tests still passing at handover time
7. ESLint 0 warnings confirmed

**This is a Pre-Brief forecast only — NOT an ASSURANCE-TOKEN.** The final verdict is issued
only after full Phase 3 assurance work at handover invocation.

---

## §10 — Scope Blockers and Gaps

### BLOCKING (must be resolved before IAA full audit invocation)

| Blocker ID | Description | Required Action |
|------------|-------------|-----------------|
| BLK-CDR-001 | PREHANDOVER proof absent | Foreman must commit `PREHANDOVER-session-wave-criteria-delete-reparse-YYYYMMDD.md` to `.agent-workspace/foreman-v2/memory/` |
| BLK-CDR-002 | SCOPE_DECLARATION.md stale (shows wave-mat-gov-process) | Foreman must update to declare the 5 wave-criteria-delete-reparse diff files |
| BLK-CDR-003 | Foreman session memory absent | Foreman must commit session memory for this wave |
| BLK-CDR-004 | `criteria_documents` upsert unique constraint unverified | Verify that a unique index on `(audit_id, file_path)` exists — check migrations |

### ADVISORY (noted, not blocking)

| Advisory ID | Description | Recommendation |
|-------------|-------------|----------------|
| ADV-CDR-001 | LIM-001: delete confirmation warning text must clearly state ALL criteria for the audit are removed | Verify UI confirmation banner text at handover; if unclear, update wording |
| ADV-CDR-002 | CWT requirement clarification needed | Foreman must clarify whether this wave requires a CWT before closure, or whether it feeds into a larger wave's CWT gate |
| ADV-CDR-003 | POLC breach must be formally recorded | PREHANDOVER proof must include a `polc_violation_acknowledgement` field per §7 |

---

## §11 — IAA Invocation Sequence for Handover

1. Foreman resolves all BLOCKING items (BLK-CDR-001 through BLK-CDR-004)
2. Foreman commits ALL ceremony artifacts in a single commit before invoking IAA
3. Foreman confirms clean working tree (`git status` clean)
4. Foreman invokes IAA with full Phase 3 + 4 assurance request
5. IAA runs all FFA checks declared in §6
6. IAA issues ASSURANCE-TOKEN or REJECTION-PACKAGE
7. Foreman opens PR only after ASSURANCE-TOKEN received

---

## §12 — Pre-Brief Completion Declaration

**Wave read**: ✅ wave-current-tasks.md read in full
**Files verified**: ✅ All 5 branch files inspected (`git diff`, hook code, test file, overlay, component)
**Schema verified (A-032)**: ✅ DDL read for `domains`, `criteria_documents`, `audit_logs`
**RLS verified**: ✅ All tables have RLS policies
**Trigger categories declared**: ✅ AAWP_MAT (sole qualifying trigger)
**FFA checks declared**: ✅ BD-001 through BD-024 (as applicable), CORE-007/013/015/016/018/019/020/021
**PREHANDOVER structure declared**: ✅ §7
**SCOPE_DECLARATION requirements declared**: ✅ §8
**Scope blockers identified**: ✅ BLK-CDR-001 through BLK-CDR-004
**Retroactive assessment completed**: ✅ Preliminary technical review in §9

**Pre-Brief Artifact**: `.agent-admin/assurance/iaa-prebrief-wave-criteria-delete-reparse.md`
**Status**: COMMITTED

---

**IAA Pre-Brief issued by**: independent-assurance-agent v6.2.0
**Adoption Phase**: PHASE_B_BLOCKING
**STOP-AND-FIX mandate**: ACTIVE
**Authority**: CS2 only (@APGI-cmy)
