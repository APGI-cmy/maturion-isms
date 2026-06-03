# MMM Architecture Addendum — DMC Subject Knowledge Wiring

- **Module**: MMM
- **Stage**: 5 precursor architecture addendum
- **Date**: 2026-05-25
- **Status**: ACTIVE

## Objective

Restore legacy document-management capability into MMM as a governed Subject Knowledge surface without breaking framework build flows.

## Architecture Decisions

1. **Separation of concerns**
   - `DMC` (Subject Knowledge admin surface): `/dmc`
   - `Framework source mode selection` (criteria generation flow): `/frameworks/upload`

2. **Data pathway**
   - Read path:
     - primary: `list-all-documents` edge function
     - fallback: `ai_documents` table read
   - Write path:
     - file upload to storage bucket (`ai-documents` first, compatibility fallback supported)
     - metadata insert to `ai_documents`
     - audit insert to `ai_upload_audit`
     - ingestion trigger `process-ai-document`

3. **Subject scope enforcement**
   - DMC Subject Knowledge view is global-only using `context_level = 'global'`.
   - Industry/organisation-specific knowledge remains separately scoped and is not mixed into global view.

4. **Role boundary**
   - Write actions restricted to superuser-admin class roles.
   - Unauthorized roles receive explicit UI denial state.

5. **Backward compatibility**
   - Legacy table/function contract retained (`ai_documents`, `ai_upload_audit`, `process-ai-document`).
   - Mode A/B/C framework workflows unchanged.

6. **Organisation source retention**
   - Organisation source documents are audit-bearing inputs and must not be physically removed by routine UI archive/reprocess actions.
   - Archive hides the document from active organisation-source lists by setting `archived_at`; it retains the Supabase Storage object and existing canonical chunks for recovery, audit, and forensic diagnosis.
   - Reprocess must report structured edge failure payloads to the UI. A non-transport response with `{ success: false }` is a failed reprocess, not a completed one.

7. **Production deployment alias guard**
   - MMM Vercel deployment validation must target the configured MMM project production alias by default: `https://maturion-isms-mmm.vercel.app`.
   - `https://mmm.maturion.com` is not the default canonical target until it is attached to the Vercel project and resolves in DNS.
   - Once a custom domain is configured, CI may opt into the same JS-hash guard with `MMM_CUSTOM_DOMAIN_URL`.

8. **Chunk-positive VERBATIM source readiness**
   - VERBATIM intent generation is governed by available extracted source chunks, not only by the final document ledger status string.
   - An organisation/framework source document with `chunk_count > 0` is usable for strict verbatim extraction from `ai_knowledge`, even if the UI status still shows `processing` or carries a parser/index warning.
   - Zero-chunk documents remain blocked because they do not provide usable source text for verbatim extraction.
   - Status-lag warnings should remain visible so operators can diagnose ingestion completion drift without blocking available chunk-based extraction.
   - Canonical `mmm_org_source_verbatim_index` rows are the preferred deterministic lookup path, but absence of index rows must not demote a chunk-positive source to failed.

9. **Office document text extraction**
   - DOCX organisation sources must be unzipped and converted from WordprocessingML to readable text before any `ai_knowledge` chunk writes.
   - Raw Office package bytes (`PK...`, `[Content_Types].xml`, `word/document.xml`) are not valid knowledge chunks and must never be treated as successful VERBATIM source extraction.
   - KUC/AI parse results may enrich extraction, but local DOCX text extraction is the deterministic fallback for Word source documents.

## QA Binding

- `modules/MMM/05-qa-to-red/dmc-subject-knowledge-qa-to-red.md`
- `modules/MMM/tests/B4-framework/dmc-subject-knowledge-routing.test.ts`
