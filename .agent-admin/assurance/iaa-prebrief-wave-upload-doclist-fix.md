# IAA Pre-Brief — wave-upload-doclist-fix

**Artifact Type**: IAA Pre-Brief  
**Agent**: independent-assurance-agent  
**Version**: 6.2.0 | Contract 2.2.0  
**Wave**: wave-upload-doclist-fix  
**Branch**: `copilot/fix-ai-parsing-trigger`  
**Issue**: fix(app/api): Criteria document upload — AI parsing never triggers, uploaded documents never show — governance/implementation alignment required  
**Date**: 2026-03-08  
**Authority**: CS2 (Johan Ras / @APGI-cmy)  
**Protocol Reference**: IAA_PRE_BRIEF_PROTOCOL.md v1.1.0 §Trigger  
**Adoption Phase**: PHASE_B_BLOCKING — Hard gate ACTIVE  

---

## 1. Wave Scope Summary

Post-Wave-15R production investigation confirms that the criteria parsing pipeline remains partially non-functional due to two root problems:

1. **Code bug (PRIMARY)**: When the Edge Function fails, **no `audit_log` row is written** for the uploaded document. `useUploadedDocuments` only queries for `criteria_parsed` and `criteria_parse_failed` actions. If parsing never runs, the document **never appears in the UI list**. Fix: write `audit_log(action='criteria_upload')` immediately on storage upload success, **before** parsing is attempted; expand `useUploadedDocuments` query to include `'criteria_upload'` action.

2. **Governance gap (SECONDARY)**: FRS FR-004/FR-103 and TRS TR-047 must be confirmed aligned to the upload-then-parse pattern. FAIL-ONLY-ONCE must record this as a new incident class.

---

## 2. Task Registry — Qualifying Classification

| Task ID | Assigned To | Description | IAA Trigger Category | Qualifying? |
|---------|-------------|-------------|----------------------|-------------|
| T-WUF-QA-001 | qa-builder | RED gate tests: (a) `useUploadCriteria` writes `criteria_upload` audit_log; (b) `useUploadedDocuments` includes `criteria_upload`; (c) `getParseStatus` maps `criteria_upload`→PENDING; (d) doc list shows entry even when parsing fails | AAWP_MAT | ✅ QUALIFYING |
| T-WUF-API-001 | api-builder | Fix `useUploadCriteria`: write `audit_log(action='criteria_upload')` after storage upload succeeds. Fix `useUploadedDocuments`: expand `action IN (...)` to include `'criteria_upload'`; deduplicate by `resource_id` keeping best-status entry | AAWP_MAT | ✅ QUALIFYING |
| T-WUF-UI-001 | ui-builder | Fix `CriteriaUpload.tsx` `getParseStatus()`: return `'PENDING'` for `action === 'criteria_upload'` | AAWP_MAT | ✅ QUALIFYING |
| T-WUF-GOV-001 | foreman-v2 | Register INC-WUF-DOCLIST-001 in FAIL-ONLY-ONCE; update BUILD_PROGRESS_TRACKER; confirm FRS/TRS alignment; add wave entry to implementation-plan.md | KNOWLEDGE_GOVERNANCE (FAIL-ONLY-ONCE update) + AAWP_MAT (BUILD_PROGRESS_TRACKER) | ✅ QUALIFYING |

**Trigger categories active for this wave**:
- **AAWP_MAT**: Production code changes to `modules/mat/` (hooks, component, tests)
- **KNOWLEDGE_GOVERNANCE**: `.agent-workspace/foreman-v2/knowledge/FAIL-ONLY-ONCE.md` update

**IAA Final Audit**: MANDATORY — hard-blocking. PR must not be opened until ASSURANCE-TOKEN issued.

---

## 3. Files Modified — Trigger Mapping

| File | Category | IAA Check Focus |
|------|----------|-----------------|
| `modules/mat/frontend/src/lib/hooks/useCriteria.ts` | AAWP_MAT | Correctness of `criteria_upload` audit_log write; `useUploadedDocuments` query expansion; deduplication logic |
| `modules/mat/frontend/src/components/criteria/CriteriaUpload.tsx` | AAWP_MAT | `getParseStatus()` maps `criteria_upload` → `'PENDING'` |
| `modules/mat/tests/wave-upload-doclist-fix/*.test.ts` (new) | AAWP_MAT | QA-to-RED gate: all new tests must be confirmed RED before API/UI builds; confirmed GREEN after |
| `.agent-workspace/foreman-v2/knowledge/FAIL-ONLY-ONCE.md` | KNOWLEDGE_GOVERNANCE | INC-WUF-DOCLIST-001 entry present with correct root cause, corrective action, and REMEDIATED status |
| `modules/mat/BUILD_PROGRESS_TRACKER.md` | AAWP_MAT (governance) | Wave entry for wave-upload-doclist-fix present; INC-WUF-DOCLIST-001 cross-referenced |
| `modules/mat/03-implementation-plan/implementation-plan.md` | AAWP_MAT (governance) | Wave entry for wave-upload-doclist-fix present; FRS/TRS alignment confirmed |

---

## 4. FFA Checks (Final Full Audit — to be executed at PREHANDOVER)

These are the checks IAA will run at final audit invocation. Builders must produce evidence for each.

### 4.1 QA-to-RED Gate (HARD GATE — must precede T-WUF-API-001 and T-WUF-UI-001)

| Check ID | Check | Evidence Required |
|----------|-------|-------------------|
| FFA-001 | All new tests in `modules/mat/tests/wave-upload-doclist-fix/` confirmed RED before API/UI implementation | QA gate certification from qa-builder (vitest output showing RED state) |
| FFA-002 | Test coverage: `useUploadCriteria` writes `criteria_upload` audit_log entry | Test file present; test name clearly maps to this assertion |
| FFA-003 | Test coverage: `useUploadedDocuments` query includes `criteria_upload` action | Test file present; test name clearly maps to this assertion |
| FFA-004 | Test coverage: `getParseStatus('criteria_upload')` returns `'PENDING'` | Test file present; test name clearly maps to this assertion |
| FFA-005 | Test coverage: document list shows entry when Edge Function is unavailable (parse never triggered) | Test file present; test name clearly maps to this assertion |

### 4.2 Implementation Correctness (T-WUF-API-001 + T-WUF-UI-001)

| Check ID | Check | Evidence Required |
|----------|-------|-------------------|
| FFA-006 | `useUploadCriteria` mutationFn: `audit_log(action='criteria_upload')` write occurs **after** storage upload success and **before** `triggerParsing` is called | Code inspection of `useCriteria.ts`; vitest output GREEN |
| FFA-007 | `useUploadCriteria` audit_log write includes: `audit_id`, `resource_id` (= storage path), `action = 'criteria_upload'`, `details: { file_path }` | Code inspection — all required fields present |
| FFA-008 | `useUploadedDocuments` query: `action IN ('criteria_upload', 'criteria_parsed', 'criteria_parse_failed')` | Code inspection of `useCriteria.ts` |
| FFA-009 | `useUploadedDocuments` deduplicates by `resource_id` keeping best-status: `criteria_parsed` > `criteria_parse_failed` > `criteria_upload` | Code inspection — deduplication logic present |
| FFA-010 | `getParseStatus()` in `CriteriaUpload.tsx`: branch `if (doc.action === 'criteria_upload') return 'PENDING'` added before default | Code inspection of `CriteriaUpload.tsx` |
| FFA-011 | `UploadedDocument` interface updated or confirmed to include `criteria_upload` in action typings | Type check — interface in `useCriteria.ts` |

### 4.3 Test Outcome Gate

| Check ID | Check | Evidence Required |
|----------|-------|-------------------|
| FFA-012 | All existing 81 tests remain GREEN (no regressions) | Vitest output showing 81 + N tests; existing test count unchanged GREEN |
| FFA-013 | All new wave-upload-doclist-fix tests are GREEN | Vitest output showing new tests GREEN |
| FFA-014 | Total test count = 81 + N (where N ≥ 4, covering FFA-002 through FFA-005) | Vitest summary line |

### 4.4 FRS/TRS Alignment

| Check ID | Check | Evidence Required |
|----------|-------|-------------------|
| FFA-015 | FRS FR-004 confirmed aligned: upload produces `criteria_upload` audit_log entry immediately | Foreman attestation in PREHANDOVER proof citing FR-004 text vs implementation |
| FFA-016 | FRS FR-103 confirmed aligned: upload failures and parse failures surfaced inline (not silent) — `criteria_upload` always visible | Foreman attestation citing FR-103 text vs implementation |
| FFA-017 | TRS TR-047 confirmed aligned: `useUploadedDocuments` query pattern includes `criteria_upload` | Foreman attestation citing TR-047 text vs implementation |

### 4.5 Governance Closure (T-WUF-GOV-001)

| Check ID | Check | Evidence Required |
|----------|-------|-------------------|
| FFA-018 | `INC-WUF-DOCLIST-001` registered in `.agent-workspace/foreman-v2/knowledge/FAIL-ONLY-ONCE.md` | File content showing entry with: incident ID, root cause, corrective action, status = REMEDIATED |
| FFA-019 | `BUILD_PROGRESS_TRACKER.md` updated with wave-upload-doclist-fix wave entry | File content showing wave entry |
| FFA-020 | `implementation-plan.md` updated with wave-upload-doclist-fix entry | File content showing entry |

### 4.6 PREHANDOVER Ceremony Completeness

| Check ID | Check | Evidence Required |
|----------|-------|-------------------|
| FFA-021 | PREHANDOVER proof file committed to branch | File path confirmed; committed before IAA invocation |
| FFA-022 | PREHANDOVER proof contains all required sections (see §5 below) | Section checklist in IAA review |
| FFA-023 | CST gate evidence present: QA→API gate (qa-builder confirmed RED before api-builder started) | Section in PREHANDOVER proof or separate CST gate artefact |
| FFA-024 | CST gate evidence present: API→UI gate (hook changes GREEN before ui-builder started) | Section in PREHANDOVER proof or separate CST gate artefact |

---

## 5. PREHANDOVER Proof Structure Required

The PREHANDOVER proof must be a single committed file (e.g. `PREHANDOVER_PROOF_WAVE_UPLOAD_DOCLIST_FIX.md`) containing all of the following sections. IAA will REJECT if any section is missing or contains `[TODO]` / `[PENDING]` placeholders.

```
# PREHANDOVER PROOF — wave-upload-doclist-fix

## 1. Wave Identity
- Wave: wave-upload-doclist-fix
- Branch: copilot/fix-ai-parsing-trigger
- Issue: [link]
- Date: YYYY-MM-DD
- Authority: CS2 @APGI-cmy

## 2. Task Completion Evidence
- T-WUF-QA-001: [COMPLETE — link to test file]
- T-WUF-API-001: [COMPLETE — link to useCriteria.ts diff]
- T-WUF-UI-001: [COMPLETE — link to CriteriaUpload.tsx diff]
- T-WUF-GOV-001: [COMPLETE — governance files updated]

## 3. QA Gate Evidence (MANDATORY)
- RED gate confirmation (before API/UI build): [vitest output excerpt or QA gate cert]
- GREEN gate confirmation (after all builds): [vitest output — test count N+81 GREEN]

## 4. CST Gate Evidence
- QA→API gate: [confirmation that T-WUF-QA-001 RED tests existed before T-WUF-API-001 started]
- API→UI gate: [confirmation that hook changes were GREEN before T-WUF-UI-001 started]

## 5. Implementation Correctness Attestation
- FFA-006 (audit_log write position): [PASS — evidence]
- FFA-007 (audit_log fields): [PASS — evidence]
- FFA-008 (query expansion): [PASS — evidence]
- FFA-009 (deduplication): [PASS — evidence]
- FFA-010 (getParseStatus): [PASS — evidence]

## 6. FRS/TRS Alignment
- FR-004: [aligned — evidence]
- FR-103: [aligned — evidence]
- TR-047: [aligned — evidence]

## 7. Governance Closure
- FAIL-ONLY-ONCE INC-WUF-DOCLIST-001: [REGISTERED — file path]
- BUILD_PROGRESS_TRACKER: [UPDATED — wave entry]
- implementation-plan.md: [UPDATED — wave entry]

## 8. Test Summary
- Existing tests: 81 GREEN (no regressions)
- New wave-upload-doclist-fix tests: N GREEN
- Total: 81+N GREEN

## 9. IAA Invocation Request
- Requesting: IAA Final Audit
- PREHANDOVER committed: YES — SHA [commit-sha]
- All FFA checks self-attested: YES
```

---

## 6. Scope Blockers and Governance Conflicts — Visible Now

| ID | Blocker / Conflict | Severity | Action Required |
|----|-------------------|----------|-----------------|
| SB-001 | **QA-to-RED gate sequence MUST be strictly respected**: T-WUF-QA-001 must be complete and RED-confirmed before T-WUF-API-001 or T-WUF-UI-001 begin. If any builder starts implementation before RED gate, OPOJD violation is triggered (per INC-OPOJD-W15R-QA-001 precedent). | HIGH | Foreman must enforce hard CST gate between QA and API tasks. |
| SB-002 | **`UploadedDocument` interface gap**: The current interface comment says `action` is `'criteria_parsed'` or `'criteria_parse_failed'`. After T-WUF-API-001, `'criteria_upload'` becomes a valid action. The interface docstring and potentially the `action` type must be updated — failing to do so will cause a TypeScript type mismatch. | MEDIUM | api-builder must update interface definition and docstring in addition to query logic. |
| SB-003 | **Deduplication logic placement**: The deduplication by `resource_id` (best-status wins) is a client-side operation. If implemented incorrectly (e.g., keeping the newest row instead of best-status row), a document could show as PENDING even after successful parsing. Spec is clear: `criteria_parsed > criteria_parse_failed > criteria_upload`. | MEDIUM | api-builder must implement priority ordering, not chronological ordering, for deduplication. |
| SB-004 | **`audit_log` write failure handling**: If the `audit_log(action='criteria_upload')` Supabase insert fails, the upload flow must NOT silently succeed. The outer `useUploadCriteria` mutation must either: (a) throw and surface the error, or (b) log a warning and continue. The chosen behaviour must be documented in the PREHANDOVER proof. | MEDIUM | api-builder must define and implement error handling for the audit_log write step; foreman must attest to this in PREHANDOVER proof. |
| SB-005 | **FRS/TRS gap not yet confirmed**: FR-004, FR-103, and TR-047 reference the upload flow. The current FRS/TRS language was written before the `criteria_upload` action was conceived. If the spec text does not cover this pattern, a spec amendment may be needed before T-WUF-GOV-001 can be closed. | LOW | Foreman confirms FRS/TRS alignment in T-WUF-GOV-001; if gap found, spec amendment is in-scope for this wave. |
| SB-006 | **INC-WUF-DOCLIST-001 not yet registered**: FAIL-ONLY-ONCE does not yet contain this incident. T-WUF-GOV-001 must register it. IAA will hard-fail if missing at final audit. | LOW (known — in scope) | foreman-v2 completes T-WUF-GOV-001 as final task after GREEN gate confirmed. |

---

## 7. Applicable Overlays at Final Audit

| Overlay | Reason |
|---------|--------|
| AAWP_MAT overlay (from `iaa-category-overlays.md`) | Production code changes to `modules/mat/` |
| KNOWLEDGE_GOVERNANCE overlay | FAIL-ONLY-ONCE update in `.agent-workspace/` |
| Evidence bundle completeness (CORE invariants) | PREHANDOVER proof + QA gate + CST gate evidence mandatory |

---

## 8. Dependency Chain Confirmation

```
IAA Pre-Brief committed (this artifact) ← YOU ARE HERE
  ↓
T-WUF-QA-001 (qa-builder: RED gate tests)
  ↓ CST HARD GATE — QA→API (foreman certifies RED state)
T-WUF-API-001 (api-builder: useUploadCriteria + useUploadedDocuments fix)
  ↓ CST HARD GATE — API→UI (hooks GREEN confirmed)
T-WUF-UI-001 (ui-builder: CriteriaUpload.tsx getParseStatus fix)
  ↓ All tests GREEN (QA confirms 81+N GREEN)
T-WUF-GOV-001 (foreman: FAIL-ONLY-ONCE + BUILD_PROGRESS_TRACKER + impl-plan)
  ↓ PREHANDOVER proof committed
  ↓ IAA Final Audit invoked
  ↓ ASSURANCE-TOKEN issued
  ↓ CS2 review + merge gate release
```

---

## 9. Pre-Brief Status

**Pre-Brief**: ✅ COMMITTED  
**Wave Status**: PENDING — awaiting T-WUF-QA-001 start  
**IAA Final Audit**: Scheduled after T-WUF-GOV-001 and PREHANDOVER proof committed  
**Hard Gate**: ACTIVE — PR must not be opened until ASSURANCE-TOKEN issued  

---

*IAA Pre-Brief generated by independent-assurance-agent v6.2.0 | 2026-03-08*  
*Authority: CS2 (Johan Ras / @APGI-cmy) | STOP-AND-FIX mandate ACTIVE*
