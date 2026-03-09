# Wave Current Tasks — foreman-v2-agent — wave-audit-log-column-fix

**Wave**: wave-audit-log-column-fix  
**Branch**: `copilot/fix-document-upload-issues`  
**Date**: 2026-03-08  
**Session**: session-wave-audit-log-column-fix-20260308  
**Authority**: CS2 (@APGI-cmy) — "fix(criteria-upload): audit_logs insert/query column mismatches prevent uploaded documents from appearing; migration drift and governance gaps require postmortem / scope closure"  
**Protocol Reference**: IAA_PRE_BRIEF_PROTOCOL.md v1.1.0 §Trigger  
**IAA Pre-Brief**: `.agent-admin/assurance/iaa-prebrief-wave-audit-log-column-fix.md` — PENDING IAA RESPONSE  
**Prior Wave**: wave-upload-doclist-fix (PR #1007 — merged 2026-03-08)

---

## Wave Summary

Post-merge investigation of wave-upload-doclist-fix (PR #1007) reveals that the implementation
passed governance checks but introduced column mismatches against the actual `audit_logs` schema.
The previous fix wrote `audit_log(action='criteria_upload')` but used non-existent columns
(`user_id`, `resource_type`, `resource_id`) and omitted required NOT NULL column `organisation_id`.
The SELECT also queries `resource_id` which does not exist in the schema.

Root causes per issue:
1. `useUploadCriteria` inserts `user_id` (non-existent), `resource_type` (non-existent),
   `resource_id` (non-existent), and omits `organisation_id` (NOT NULL → insert fails at DB).
2. `useUploadedDocuments` selects `resource_id` (non-existent → SELECT fails → "Failed to load").
3. Migration path drift: audit_logs migration lives under legacy path.

---

## Architecture: Correct audit_logs Schema

**Actual audit_logs columns** (from migration `20260308000001_audit_logs_table.sql`):
- `id UUID PRIMARY KEY`
- `audit_id UUID NOT NULL REFERENCES audits(id)`
- `organisation_id UUID NOT NULL REFERENCES organisations(id)` ← REQUIRED, was missing
- `action TEXT NOT NULL`
- `file_path TEXT`
- `details JSONB`
- `created_by UUID REFERENCES auth.users(id)` ← was wrongly named `user_id`
- `created_at TIMESTAMPTZ NOT NULL`

**Columns that do NOT exist** (were incorrectly used):
- `user_id` — must be `created_by`
- `resource_type` — does not exist, must be removed
- `resource_id` — does not exist, must be removed from both INSERT and SELECT

---

## Task Registry

| Task ID | Assigned To | Description | Status |
|---------|-------------|-------------|--------|
| T-ALCF-QA-001 | qa-builder | Define RED gate tests for column fix: (a) INSERT uses correct columns (organisation_id, created_by, NOT resource_type/resource_id/user_id); (b) SELECT does not include resource_id; (c) UploadedDocument interface has no resource_id field | 🔴 NOT STARTED |
| T-ALCF-API-001 | api-builder | Fix `useUploadCriteria` insert: replace `user_id`→`created_by`, add `organisation_id`, remove `resource_type`, remove `resource_id`. Fix `useUploadedDocuments` select: remove `resource_id`. Update `UploadedDocument` interface: remove `resource_id` field. Fix deduplication key to use `details?.file_path ?? file_path`. | 🔴 NOT STARTED |
| T-ALCF-GOV-001 | foreman-v2 | Governance: register INC-ALCF-001 in FAIL-ONLY-ONCE (schema column mismatch escaped IAA gate in previous wave); update BUILD_PROGRESS_TRACKER; update SCOPE_DECLARATION; add wave entry to implementation-plan.md; postmortem on how column mismatch escaped the previous IAA gate | 🔴 NOT STARTED |

---

## Dependency Chain

```
IAA Pre-Brief received
  ↓
T-ALCF-QA-001 (RED gate tests — qa-builder)
  ↓ CST Gate: QA→API (all new tests RED-confirmed)
T-ALCF-API-001 (api-builder: column fix)
  ↓ all tests GREEN
T-ALCF-GOV-001 (foreman: governance closure)
  ↓ Phase 4: PREHANDOVER proof + session memory + IAA final audit
  ↓ CS2 review
```

---

## Acceptance Criteria

- [ ] `useUploadCriteria` insert uses: `audit_id`, `organisation_id`, `action`, `created_by`, `details` (NO `user_id`, `resource_type`, `resource_id`)
- [ ] `useUploadedDocuments` select does NOT include `resource_id`
- [ ] `UploadedDocument` interface does NOT include `resource_id` field
- [ ] Deduplication key uses `details?.file_path ?? file_path` (no `resource_id` reference)
- [ ] All existing tests remain GREEN (no regressions)
- [ ] INC-ALCF-001 registered in FAIL-ONLY-ONCE
- [ ] BUILD_PROGRESS_TRACKER updated
- [ ] IAA final assurance PASS token received before merge gate release

---

# ───────────────────────────────────────────────
# ARCHIVED — wave-upload-doclist-fix (previous wave)
# ───────────────────────────────────────────────

# Wave Current Tasks — foreman-v2-agent — wave-upload-doclist-fix

**Wave**: wave-upload-doclist-fix  
**Branch**: `copilot/fix-ai-parsing-trigger`  
**Date**: 2026-03-08  
**Session**: session-wave-upload-doclist-fix-20260308  
**Authority**: CS2 (@APGI-cmy) — "fix(app/api): Criteria document upload — AI parsing never triggers, uploaded documents never show"  
**Protocol Reference**: IAA_PRE_BRIEF_PROTOCOL.md v1.1.0 §Trigger  
**IAA Pre-Brief**: `.agent-admin/assurance/iaa-prebrief-wave-upload-doclist-fix.md` — PENDING IAA RESPONSE

---

## Wave Summary

Post-Wave-15R production investigation: criteria parsing pipeline still non-functional. Two root problems:

1. **Code bug (PRIMARY)**: When Edge Function fails (any reason), NO `audit_log` row is written for the uploaded document. `useUploadedDocuments` queries `audit_logs` with `action IN ('criteria_parsed', 'criteria_parse_failed')`. If parsing never runs, the document NEVER appears in the UI list. **Fix**: write `audit_log(action='criteria_upload')` immediately on upload success, BEFORE parsing is attempted. Expand `useUploadedDocuments` query to include `'criteria_upload'` action.

2. **Governance gap**: If parsing write-back to audit_logs is the only visibility mechanism, the upload pipeline is fragile. FRS/TRS/tests must be aligned to reflect the upload-then-parse pattern.

---

## Architecture: Upload Audit Log Pattern (Fixed)

**Current (broken) flow**:
```
upload → storage (succeeds) → triggerParsing → Edge Fn (fails/unavailable)
  → catch: yellow warning → no audit_log written → document list always empty
```

**Fixed flow**:
```
upload → storage (succeeds) → write audit_log(action='criteria_upload') → triggerParsing
  → if parsing succeeds: Edge Fn writes audit_log(action='criteria_parsed')
  → if parsing fails (fn deployed): Edge Fn writes audit_log(action='criteria_parse_failed')
  → if fn not deployed: inner catch: yellow warning shown
useUploadedDocuments → query(['criteria_upload','criteria_parsed','criteria_parse_failed'])
  → deduplicated by resource_id → always shows docs → status: PENDING|COMPLETE|FAILED
```

---

## Task Registry

| Task ID | Assigned To | Description | Status |
|---------|-------------|-------------|--------|
| T-WUF-QA-001 | qa-builder | Define RED gate tests: (a) `useUploadCriteria` writes `criteria_upload` to audit_logs; (b) `useUploadedDocuments` queries include `criteria_upload` action; (c) `getParseStatus` maps `criteria_upload` → PENDING; (d) document list shows entry even when parsing fails | 🔴 NOT STARTED |
| T-WUF-API-001 | api-builder | Fix `useUploadCriteria` hook: write `audit_log(action='criteria_upload')` after storage upload succeeds. Fix `useUploadedDocuments`: expand `action IN (...)` to include `'criteria_upload'`; client-side deduplicate by `resource_id` keeping best-status entry (criteria_parsed > criteria_parse_failed > criteria_upload) | 🔴 NOT STARTED |
| T-WUF-UI-001 | ui-builder | Fix `CriteriaUpload.tsx`: update `getParseStatus()` to return `'PENDING'` for `action === 'criteria_upload'` | 🔴 NOT STARTED |
| T-WUF-GOV-001 | foreman-v2 | Governance: register INC-WUF-DOCLIST-001 in FAIL-ONLY-ONCE; update BUILD_PROGRESS_TRACKER; confirm FRS FR-004/FR-103 and TRS TR-047 alignment; add wave entry to implementation-plan.md | 🔴 NOT STARTED |

---

## Dependency Chain

```
IAA Pre-Brief received
  ↓
T-WUF-QA-001 (RED gate tests — qa-builder)
  ↓ CST Gate: QA→API (all new tests RED-confirmed)
T-WUF-API-001 (api-builder: hook fixes)
  ↓ CST Gate: API→UI (hook changes GREEN)
T-WUF-UI-001 (ui-builder: component fix)
  ↓ all tests GREEN (QA confirms 81+N tests GREEN)
T-WUF-GOV-001 (foreman: governance closure)
  ↓ Phase 4: PREHANDOVER proof + session memory + IAA final audit
  ↓ CS2 review
```

---

## Acceptance Criteria

- [ ] Uploaded documents appear in the UI list IMMEDIATELY after storage upload, even when Edge Function unavailable
- [ ] Status badge shows PENDING for `criteria_upload` action; COMPLETE for `criteria_parsed`; FAILED for `criteria_parse_failed`
- [ ] No duplicate entries in document list (deduplicated by resource_id)
- [ ] All existing 81 tests remain GREEN; new RED→GREEN tests cover upload-audit-log pattern
- [ ] FRS FR-004/FR-103 and TRS TR-047 confirmed aligned
- [ ] FAIL-ONLY-ONCE INC-WUF-DOCLIST-001 registered
- [ ] BUILD_PROGRESS_TRACKER updated
- [ ] IAA final assurance PASS token received before merge gate release

---

# ───────────────────────────────────────────────
# ARCHIVED — T-W15R-QA-001 (previous wave)
# ───────────────────────────────────────────────

# Wave Current Tasks — foreman-v2-agent — T-W15R-QA-001 (create-red-tests-wave-15r)

**Wave**: Wave 15R Batch C — T-W15R-QA-001 (governance closure for qa-builder RED test delegation)
**Branch**: copilot/create-red-tests-wave-15r
**Issue**: maturion-isms#1000 — T-W15R-QA-001 — 5 RED tests for Wave 15R UX features
**Date**: 2026-03-08
**Session**: session-T-W15R-QA-001-20260308
**CS2 Authorization**: Issue #1000 opened directly by @APGI-cmy; "Please finish this job" directive 2026-03-08
**Protocol Reference**: IAA_PRE_BRIEF_PROTOCOL.md v1.1.0 §Trigger
**IAA Pre-Brief**: `.agent-admin/assurance/iaa-prebrief-wave15r-qa001.md` — PENDING

---

## GOVERNANCE CONTEXT — INC-OPOJD-W15R-QA-001 Recovery

Issue #1000 was created to recover the OPOJD failure recorded as INC-OPOJD-W15R-QA-001:
during the wave15r-gov governance session, qa-builder was delegated T-W15R-QA-001 (5 RED tests)
but no GitHub issue was created. The tests were delivered in Wave 15R and merged to main.

**Current test status**: `modules/mat/tests/wave15r/wave15r-ux-features.test.ts` — 35 assertions
covering T-W15R-UX-001 through T-W15R-UX-005. Tests are GREEN (implementation is complete).
The QA-to-Red gate sequence was bypassed (tests written post-implementation). This is recorded
in FAIL-ONLY-ONCE v3.2.0 as INC-OPOJD-W15R-QA-001 (REMEDIATED).

**Purpose of this PR**: Governance closure — produce proper governance artifacts for issue #1000
to close the OPOJD recovery loop. CS2 authorization: "Please finish this job" directive.

---

## Tasks — T-W15R-QA-001

| Task ID | Description | Builder | Status |
|---------|-------------|---------|--------|
| GOVERNANCE-001 | wave-current-tasks.md created for this wave | foreman-v2-agent (governance) | ✅ DONE |
| GOVERNANCE-002 | IAA Pre-Brief invoked | foreman-v2-agent → IAA | 🔴 PENDING |
| GOVERNANCE-003 | SCOPE_DECLARATION.md updated for this wave | foreman-v2-agent (governance) | 🔴 PENDING |
| QP-EVAL-001 | QP evaluation of qa-builder deliverable (wave15r-ux-features.test.ts on main) | foreman-v2-agent (QP mode) | 🔴 PENDING |
| PREHANDOVER-001 | PREHANDOVER proof + session memory written | foreman-v2-agent (governance) | 🔴 PENDING |
| IAA-AUDIT-001 | IAA final audit invoked | foreman-v2-agent → IAA | 🔴 PENDING |
| MERGE-001 | Merge gate released | foreman-v2-agent | 🔴 PENDING |

---

## Wave Completion Gate

- [ ] IAA Pre-Brief published at `.agent-admin/assurance/iaa-prebrief-wave15r-qa001.md`
- [ ] QP evaluation of qa-builder deliverable: PASS
- [ ] PREHANDOVER proof committed
- [ ] IAA ASSURANCE-TOKEN received
- [ ] CS2 notified for merge approval

---

# ───────────────────────────────────────────────
# ARCHIVED — wave15r-closure (previous wave)
# ───────────────────────────────────────────────
# Wave Current Tasks — foreman-v2-agent — wave15r-closure

**Wave**: wave15r-closure
**Branch**: copilot/run-cwt-and-ibwr-for-closure
**Issue**: maturion-isms#1003 — Wave 15R: Run CWT and IBWR after remediation merge for governance closure
**Date**: 2026-03-08
**Session**: session-wave15r-closure-correction-20260308
**CS2 Authorization**: Issue #1003 opened directly by @APGI-cmy
**Protocol Reference**: IAA_PRE_BRIEF_PROTOCOL.md v1.1.0 §Trigger
**IAA Pre-Brief**: `.agent-admin/assurance/iaa-prebrief-wave15r-closure.md` — RETROACTIVE (see INC-PREBRIEF-GOVERNANCE-CLOSURE-001)
**Ceremony Model**: Governance-only closure session — no builder delegation

---

## BREACH NOTE — INC-PREBRIEF-GOVERNANCE-CLOSURE-001

This wave-current-tasks.md was NOT created before the initial wave15r-closure session commit.
That is the violation being remediated in this correction session.
CS2 issued a FOREMAN RE-ALIGNMENT directive (maturion-isms#1003 comment, 2026-03-08).

---

## Wave Context

**Wave Slug**: wave15r-closure
**Summary**: Post-merge governance closure for Wave 15R (Criteria Parsing Pipeline Remediation).
PR #1002 was merged to main on 2026-03-08. This closure session compiles the CWT evidence,
produces the IBWR, and closes the governance loop for INC-WAVE15-PARSE-001.

No production code, tests, or CI scripts are modified. All changes are governance documents.

---

## Tasks — wave15r-closure

| Task ID | Description | Builder | Status |
|---------|-------------|---------|--------|
| CWT-W15R-001 | Compile CWT evidence (vitest 81/81 GREEN + pytest 45/45 GREEN) | foreman-v2-agent (governance only) | ✅ DONE |
| IBWR-W15R-001 | Produce IBWR with all 7 INC-WAVE15-PARSE-001 root causes closed | foreman-v2-agent (governance only) | ✅ DONE |
| IMPL-PLAN-001 | Update implementation plan v2.6.0 — Wave 15R status CLOSED | foreman-v2-agent (governance only) | ✅ DONE |
| CORRECTION-001 | Record INC-PREBRIEF-GOVERNANCE-CLOSURE-001 in FAIL-ONLY-ONCE registry | foreman-v2-agent (governance only) | IN PROGRESS |
| CORRECTION-002 | Create wave-current-tasks.md (retroactive) | foreman-v2-agent (governance only) | ✅ DONE (this file) |
| CORRECTION-003 | Invoke IAA Pre-Brief and create pre-brief artifact | foreman-v2-agent (governance only) | IN PROGRESS |
| CORRECTION-004 | Create CORRECTION-ADDENDUM for wave15r-closure session | foreman-v2-agent (governance only) | PENDING |

---

**IAA Pre-Brief Qualifying Tasks (per A-031):**
- CWT-W15R-001: N/A (already complete — corrective session)
- IBWR-W15R-001: N/A (already complete — corrective session)
- CORRECTION-001 through CORRECTION-004: Governance correction — IAA review of violation recording

> This wave-current-tasks.md was created retroactively as part of INC-PREBRIEF-GOVERNANCE-CLOSURE-001
> corrective action. Per A-031: retroactive Pre-Brief does not fully satisfy the rule — the
> violation has been recorded in FAIL-ONLY-ONCE registry.
