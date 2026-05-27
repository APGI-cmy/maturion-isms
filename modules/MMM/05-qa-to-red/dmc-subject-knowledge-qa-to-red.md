# MMM QA-to-Red Addendum — DMC Subject Knowledge

- **Module**: MMM
- **Stage**: 6 QA-to-Red Addendum
- **Date**: 2026-05-25
- **Status**: RED definition artifact

## Test Catalog (DMC)

### T-MMM-DMC-001 — DMC Route Exists as Protected Navigation Target
- **Source**: FRS addendum (top navigation behavior), TR addendum route contract
- **Layer**: Unit/static
- **RED Condition**: `/dmc` route missing in `App.tsx`; Upload tab still points directly to framework upload page.
- **GREEN Acceptance**: `App.tsx` contains protected `/dmc` route; nav links point to `/dmc`.

### T-MMM-DMC-002 — Framework Upload Flow Remains Intact
- **Source**: FRS addendum (no workflow regression)
- **Layer**: Unit/static
- **RED Condition**: `/frameworks/upload` route removed or repurposed.
- **GREEN Acceptance**: `/frameworks/upload` remains registered; framework CTA still routes there.

### T-MMM-DMC-003 — Subject Knowledge Surface Rendered in DMC
- **Source**: FRS addendum (DMC purpose)
- **Layer**: Unit/static
- **RED Condition**: DMC page missing or generic placeholder with no subject-knowledge context.
- **GREEN Acceptance**: DMC page contains explicit Subject Knowledge upload and inventory behavior.

### T-MMM-DMC-004 — Inventory Reads Legacy/AIMC-Compatible Sources
- **Source**: TR addendum data contract
- **Layer**: Unit/static
- **RED Condition**: DMC reads only local mocks or unrelated tables.
- **GREEN Acceptance**: DMC attempts `list-all-documents` and falls back to `ai_documents`; filters `context_level = 'global'`.

### T-MMM-DMC-005 — Upload Pipeline Persists and Triggers Processing
- **Source**: TR addendum upload + processing contracts
- **Layer**: Unit/static
- **RED Condition**: Upload does not create `ai_documents` metadata record or never triggers ingestion.
- **GREEN Acceptance**: DMC writes `ai_documents`, records `ai_upload_audit`, invokes `process-ai-document`.

### T-MMM-DMC-006 — Superuser Boundary Enforced for Subject Knowledge Writes
- **Source**: FRS/TR addendum role boundary
- **Layer**: Unit/static
- **RED Condition**: Any authenticated role can upload/archive/reprocess subject knowledge.
- **GREEN Acceptance**: DMC contains explicit superuser role guard and denial messaging for non-superuser roles.

### T-MMM-DMC-007 — Upload Controls Not Deadlocked by Client-Side Role Resolution
- **Source**: Runtime resilience requirement (avoid false-disabled upload CTAs)
- **Layer**: Unit/static
- **RED Condition**: Upload, bulk upload, or migration check buttons remain disabled solely because client role hydration is stale/null.
- **GREEN Acceptance**: Client enables controls based on file/pending state; server-side edge functions remain authority for role authorization.

### T-MMM-DMC-008 — DMC Action Clicks Must Produce Immediate User Feedback
- **Source**: Fully functional UX control requirement (no silent click outcomes)
- **Layer**: Unit/static
- **RED Condition**: Clicking Upload/Bulk Upload produces no immediate visible action feedback when validation fails or request starts.
- **GREEN Acceptance**: DMC action handlers set immediate status text and explicit validation errors for missing file selection.

### T-MMM-DMC-009 — DMC Status/Errors Must Render In-Panel Near Action Buttons
- **Source**: Architecture runtime feedback placement rule
- **Layer**: Unit/static
- **RED Condition**: DMC only renders feedback at remote page positions and user cannot see response at click location.
- **GREEN Acceptance**: DMC upload panel renders status/error alert directly below action buttons.

### T-MMM-DMC-010 — Bulk Upload Failures Must Expose Dominant Error Causes
- **Source**: Failure observability requirement (no opaque aggregate fail result)
- **Layer**: Unit/static
- **RED Condition**: Bulk upload reports only count failure totals without actionable reason diagnostics.
- **GREEN Acceptance**: Bulk upload status message includes grouped top failure causes (reason + count).

### T-MMM-DMC-011 — Live Supabase Schema Must Include DMC Canonical Tables
- **Source**: Deployment/runtime schema contract
- **Layer**: Operational gate
- **RED Condition**: DMC runtime shows `Could not find the table 'public.mmm_subject_knowledge_documents' in the schema cache`.
- **GREEN Acceptance**: `supabase migration list` shows remote alignment through `20260525000002` and `20260526000003`, and DMC inventory no longer throws schema-cache table-not-found.

### T-MMM-DMC-012 — DMC Must Surface Real Edge Error Payloads (Non-2xx Diagnostics)
- **Source**: Runtime observability and triage requirement
- **Layer**: Unit/static
- **RED Condition**: DMC displays only generic `Edge Function returned a non-2xx status code`.
- **GREEN Acceptance**: DMC parses response body for edge failures and shows function-specific diagnostic text (`<function> failed: <error>`).

### T-MMM-DMC-013 — Reprocess Path Sanitizes Null/Control Characters Before Canonical Inserts
- **Source**: Runtime data-safety contract for canonical knowledge writes
- **Layer**: Unit/static + operational
- **RED Condition**: Bulk reprocess fails with `unsupported Unicode escape sequence` (`\u0000 cannot be converted to text`) and 0 documents succeed.
- **GREEN Acceptance**: Shared subject-knowledge sanitization removes null/control characters before chunk/json writes; bulk reprocess can complete without unicode-escape DB rejection for valid docs.

### T-MMM-DMC-014 — Reprocess Path Retries JSONB Chunk Inserts With Slim Metadata Fallback
- **Source**: Runtime resilience requirement for legacy edge-case metadata payloads
- **Layer**: Unit/static + operational
- **RED Condition**: Reprocess fails with `invalid input syntax for type json` for a small subset of legacy documents.
- **GREEN Acceptance**: Reprocess handler retries `ai_knowledge` insert with slim metadata payload when JSONB parser rejection occurs, allowing document completion instead of terminal failure.

### T-MMM-DMC-015 — Reprocess Completion Update Retries Without KUC JSON Blob
- **Source**: Runtime completion-state resilience
- **Layer**: Unit/static + operational
- **RED Condition**: Reprocess chunk insert succeeds but completion update fails with `invalid input syntax for type json`.
- **GREEN Acceptance**: Reprocess completion update retries with `kuc_classification = null` and document reaches completed state.

### T-MMM-DMC-016 — Reprocess Chunk Insert Has Final Empty-Metadata JSON Fallback
- **Source**: Runtime resilience for legacy documents with strict JSON parser edge cases
- **Layer**: Unit/static + operational
- **RED Condition**: Reprocess still fails after slim metadata retry with `invalid input syntax for type json`.
- **GREEN Acceptance**: Reprocess performs final chunk insert retry with `metadata: {}` and completes for recoverable documents.

## Execution Mapping

- Test file:
  - `modules/MMM/tests/B4-framework/dmc-subject-knowledge-routing.test.ts`
