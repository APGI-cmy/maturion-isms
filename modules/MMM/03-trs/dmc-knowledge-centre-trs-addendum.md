# MMM TRS Addendum — DMC Subject Knowledge Integration

- **Module**: MMM
- **Stage**: 4 (TRS Addendum)
- **Date**: 2026-05-25
- **Status**: ACTIVE
- **Purpose**: Define the technical implementation contract for DMC subject-knowledge wiring.

## Technical Contract

1. **Route Contract**
   - Protected route `/dmc` must resolve to a dedicated page component.
   - Existing `/frameworks/upload` route remains unchanged for criteria mode selection and framework-source workflows.

2. **Data Contract**
   - DMC document inventory reads from legacy-compatible subject-knowledge sources:
     - preferred: edge function `list-all-documents`
     - fallback: direct table query `ai_documents`
   - Subject Knowledge filter condition is `context_level = 'global'` and `deleted_at IS NULL`.

3. **Upload Contract**
   - Upload flow stores binaries in storage bucket (`ai-documents` primary, fallback buckets allowed for compatibility).
   - Metadata record persists in `ai_documents` with:
     - `context_level = 'global'`
     - `target_organization_id = null`
     - `document_type`, `title`, `tags`, `upload_notes`
   - Audit event written to `ai_upload_audit`.

4. **Processing Contract**
   - After upload, DMC invokes `process-ai-document` with `documentId`.
   - Reprocess action on existing rows also invokes `process-ai-document`.

5. **Authorization Contract**
   - DMC write operations (upload/archive/reprocess) require superuser-admin class role.
   - UI must render explicit denial notice when role is insufficient.

## QA-to-Red Binding

- `T-MMM-DMC-001` through `T-MMM-DMC-006`
- Test implementation file:
  - `modules/MMM/tests/B4-framework/dmc-subject-knowledge-routing.test.ts`
