# Scope Declaration: Issue #2033 — MMM Supplementary PPTX/XLSX Chunking Fix

**Issued**: 2026-09-01T08:30Z  
**Authority**: CS2 (via cs2-decision-latest.json, 2026-08-24T09:05:06Z)  
**Target Issue**: https://github.com/APGI-cmy/maturion-isms/issues/2033  
**Target Branch**: `fix-mmm-supplementary-upload-mime`  
**Delivery Method**: Governed (Foreman → api-builder)  

---

## Problem Statement

When users upload supplementary documents (PDF, PPTX, XLSX) to the Organisation Context in the MMM module:

- **MIME type allowlist** was missing PPTX/XLSX variants → uploads rejected at storage layer (PR #2032, **MERGED 2026-08-21**)
- **After MIME fix applied**: XLSX uploads succeed and chunk properly (32 chunks observed)
- **Failure**: PDF and PPTX uploads complete (storage succeeds) but remain stuck in `processing` status with `chunks = 0`, never completing chunking

**Root Cause**: The `extractBestEffortText()` function in `supabase/functions/_shared/mmm-subject-knowledge.ts` lacks extraction paths for PPTX and XLSX:
- PPTX (ZIP-based Office XML) requires parsing `ppt/slides/slide*.xml` and extracting `<a:t>` text runs
- XLSX (ZIP-based Office XML) requires parsing `xl/sharedStrings.xml` and `xl/worksheets/sheet*.xml` with cell reference resolution
- Without these extractors, files fall through to KUC (knowledge understanding component) fallback, which returns empty → chunking fails

**Impact**: Supplementary PPTX/XLSX documents cannot be ingested into MMM knowledge base, blocking audit evidence ingestion workflows.

---

## Solution Scope

**Narrow, surgical fix**: Add ZIP-XML extraction paths for PPTX and XLSX to the `extractBestEffortText()` fallback chain.

### Changes Required

**File**: `supabase/functions/_shared/mmm-subject-knowledge.ts`

#### New Functions

1. **`isPptxMimeType(mimeType: string): boolean`**
   - Detects standard PPTX and legacy PPT MIME types
   - Supports: `application/vnd.openxmlformats-officedocument.presentationml.presentation`, `application/vnd.ms-powerpoint`

2. **`extractPptxText(fileBlob: Blob): Promise<string>`**
   - Accepts PPTX file as Blob
   - Loads ZIP archive, extracts `ppt/slides/slide*.xml` files in numeric order
   - Parses XML, extracts all `<a:t>` text run content
   - Joins text runs with spaces per slide, slides separated by double newline
   - Returns sanitized, PostgreSQL-safe UTF-8 text
   - Falls through silently if ZIP structure invalid or no text found

3. **`isXlsxMimeType(mimeType: string): boolean`**
   - Detects standard XLSX and legacy XLS MIME types
   - Supports: `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`, `application/vnd.ms-excel`

4. **`extractXlsxText(fileBlob: Blob): Promise<string>`**
   - Accepts XLSX file as Blob
   - Loads ZIP archive, parses `xl/sharedStrings.xml` into indexed string table
   - Extracts `xl/worksheets/sheet*.xml` files in numeric order
   - For each cell, resolves:
     - `t="s"` (shared-string index) → look up in string table
     - `t="inlineStr"` → parse inline `<is><t>` content
     - Raw numeric/date/boolean values as-is
   - Joins cell values per row with tabs, rows with newlines, sheets with double newline
   - Returns sanitized, PostgreSQL-safe UTF-8 text
   - Falls through silently if ZIP structure invalid or no text found

#### Integration Point

**Function**: `extractBestEffortText(params: { mimeType, fileBlob, fallbackText, kucClassification?, aiParsedText? }): Promise<string>`

**Current dispatch chain** (post-DOCX):
```
1. isDocxMimeType → extractDocxText
2. (fallback to AI parsed text or KUC)
```

**New dispatch chain**:
```
1. isDocxMimeType → extractDocxText
2. isPptxMimeType → extractPptxText    [NEW]
3. isXlsxMimeType → extractXlsxText    [NEW]
4. aiParsedText (from AI Gateway fallback)
5. isTextLikeMimeType → fallback
6. kucClassification (Knowledge Understanding Component parse)
7. metadata (fallback to file size, type, etc.)
```

**Key Invariant**: Each branch returns early if text extracted successfully; silently falls through if extraction fails, empty, or MIME doesn't match.

---

## Testing & Validation

**Test File**: `modules/MMM/tests/B4-framework/mmm-subject-knowledge-pptx-xlsx-extraction.test.ts`

**Test Coverage** (12 tests, **ALL PASSING**):

| Test ID | Test Name | Status |
|---------|-----------|--------|
| T-MMM-SK-EXTRACT-001 | MIME type detection guards (PPTX, XLSX, DOCX) | ✅ PASS |
| T-MMM-SK-EXTRACT-002 | extractBestEffortText dispatching (wiring, ordering) | ✅ PASS |
| T-MMM-SK-EXTRACT-003 | PPTX XML path parsing and <a:t> extraction | ✅ PASS |
| T-MMM-SK-EXTRACT-004 | XLSX shared-string table parsing | ✅ PASS |
| T-MMM-SK-EXTRACT-005 | XLSX sheet cell reference resolution | ✅ PASS |
| T-MMM-SK-EXTRACT-006 | Fallback chain ordering (DOCX before PPTX before XLSX) | ✅ PASS |
| T-MMM-SK-EXTRACT-007 | Edge case: empty PPTX (no slides) | ✅ PASS |
| T-MMM-SK-EXTRACT-008 | Edge case: PPTX with only speaker notes (no slide text) | ✅ PASS |
| T-MMM-SK-EXTRACT-009 | Edge case: empty XLSX (no worksheets) | ✅ PASS |
| T-MMM-SK-EXTRACT-010 | Edge case: XLSX with only formulas (no text) | ✅ PASS |
| T-MMM-SK-EXTRACT-011 | Numeric ordering: slide10.xml sorts after slide2.xml | ✅ PASS |
| T-MMM-SK-EXTRACT-012 | Numeric ordering: sheet20.xml sorts after sheet3.xml | ✅ PASS |

**Implementation Commit**: `96ebc40f`

---

## Dependencies & Prerequisites

### External Dependencies
- **JSZip** v3.10.1 (already in use for DOCX extraction, already present in dependencies)
- No new package installs required

### Prior Work
- **PR #2032** (MERGED): Added PPTX/XLSX/legacy Office MIME types to Supabase Storage bucket allowlist
  - This is required; PPTX/XLSX files cannot reach the edge function without this migration
  - Status: **COMPLETE** as of 2026-08-21

### Runtime Dependencies
- Edge functions: `mmm-subject-knowledge-upload` and `mmm-subject-knowledge-reprocess` both use `extractBestEffortText()`
- No change to function signatures; fully backward compatible
- Extraction happens after MIME validation, so invalid archives fail gracefully

---

## Governance Context

### Breach Class
**PROCESS_BYPASS**: PR #2034 was created directly by CS2 chat session, bypassing Foreman orchestration.

### Corrective Action
Route through full POLC (Plan-Orchestrate-Lead-Check) sequence:
1. **CS2 Decision** (authority): Issue authorization to Foreman
2. **Foreman Orchestration**: Take ownership, create scope, delegate to api-builder
3. **api-builder Implementation**: Integrate tested fix, produce POLC artifacts
4. **Foreman QP (Quality Pass)**: Validate delivery and governance bindings
5. **Pre-handover Gate**: Final compliance check
6. **Merge**: Post merge guidance with exact head SHA and evidence binding

### Evidence Binding

| Artifact | Status | Reference |
|----------|--------|-----------|
| Scope Declaration | ✅ This document | scope-declaration-issue-2033-pptx-xlsx-chunking-fix.md |
| Technical Commit | ✅ Verified | 96ebc40f (PPTX/XLSX extractors + 12 passing tests) |
| Test Suite | ✅ 12/12 passing | modules/MMM/tests/B4-framework/mmm-subject-knowledge-pptx-xlsx-extraction.test.ts |
| Pre-requisite (MIME fix) | ✅ MERGED | PR #2032 (2026-08-21) |
| Prehandover Documentation | ⏳ In progress | Will be produced during api-builder delivery |
| ECAP Bundle | ⏳ In progress | Will be produced during api-builder delivery |
| IAA Pre-brief | ⏳ Pending | Scheduled after prehandover completion |
| Merge Guidance | ⏳ Pending | Will be posted when all gates pass (31/31) |

---

## Non-Negotiable Requirements

1. **Code Quality**: All 12 tests must pass on the exact head SHA before merge
2. **Governance Compliance**: All 31 required CI gates must pass (no exceptions)
3. **Evidence Continuity**: Exact head SHA must be consistent across all artifacts (scope, prehandover, ECAP, merge comment)
4. **No Substitutions**: The technical fix at commit 96ebc40f is final; no re-implementation or "refactoring" without explicit retesting
5. **Backward Compatibility**: No breaking changes to `extractBestEffortText()` signature; fallback chain must remain silent on extraction failure

---

## Success Criteria

✅ **Technical**: PPTX and XLSX files upload, parse, chunk, and are stored in `mmm_subject_knowledge_chunks` table  
✅ **Governance**: All 31 CI gates pass on exact head SHA  
✅ **Evidence**: Prehandover doc, ECAP, and merge comment reference exact same head  
✅ **Audit**: Issue #2033 marked resolved; wave tracker records breach class and CI loop activation  
✅ **Merge**: PR merged with exact evidence chain intact  

---

## Sign-Off

- **Scope Authority**: CS2 (@APGI-cmy)
- **Scope Declaration Author**: Copilot App
- **Approved By**: Foreman (via orchestration)
- **Delivered By**: api-builder (via delegation)
- **QP Certified By**: Foreman QP
- **IAA Assured By**: Independent Assurance Agent (pending)

**Status**: SCOPE DECLARED, READY FOR FOREMAN DELEGATION (2026-09-01T08:30Z)
