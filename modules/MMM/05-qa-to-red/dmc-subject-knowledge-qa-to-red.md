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

### T-MMM-DMC-017 — Duplicate Uploads Must Prompt Replace/Skip Behavior
- **Source**: DMC operational UX + data-integrity contract
- **Layer**: Unit/static + operational
- **RED Condition**: Duplicate files are silently duplicated with no user choice.
- **GREEN Acceptance**: Duplicate upload surfaces explicit replacement choice (`replace_existing`) and supports skip behavior for bulk duplicates.

### T-MMM-DMC-018 — Archive Actions Must Require Confirmation
- **Source**: Safe destructive-action UX control
- **Layer**: Unit/static
- **RED Condition**: Archive single/bulk executes immediately with no confirmation.
- **GREEN Acceptance**: Archive action requires explicit confirmation prompt containing selected count or filename context.

### T-MMM-DMC-019 — Selection State Must Reset on Status Filter Change
- **Source**: Bulk-action safety contract
- **Layer**: Unit/static
- **RED Condition**: Hidden previous selections persist across filter changes, causing unintended bulk operations.
- **GREEN Acceptance**: Selection state is reset when status filter changes.

### T-MMM-DMC-020 — DMC Status Color-Coding Standard Is Visible In Inventory UX
- **Source**: UX scanning and consistency standard
- **Layer**: Unit/static
- **RED Condition**: Pending/Processing/Completed/Failed have no consistent visual distinction.
- **GREEN Acceptance**: DMC renders legend + subtle tonal classes for all status states.

### T-MMM-DMC-021 — Reprocess Must Not Depend On Potentially Corrupt Legacy JSON Columns
- **Source**: Runtime resilience for legacy-row recoverability
- **Layer**: Unit/static + operational
- **RED Condition**: Reprocess fails for specific legacy rows because optional JSON columns (for example `tags`) cannot be parsed.
- **GREEN Acceptance**: Reprocess fetch path avoids hard dependency on optional legacy JSON payload fields; document can be processed using safe defaults.

### T-MMM-DMC-022 — ai_knowledge JSON Retry Must Omit Metadata Column After Empty-Object Retry Fails
- **Source**: Live organisation-source upload failure, 2026-06-02.
- **Layer**: Unit/static + operational
- **RED Condition**: Organisation source upload writes storage + document ledger rows, but reprocess then fails all `ai_knowledge` insert retries with `invalid input syntax for type json`, leaving `processing_status=failed` and `chunk_count=0`.
- **GREEN Acceptance**: Upload/reprocess sanitize the full `ai_knowledge` insert row and, after JSON metadata fallbacks still fail, retry without the `metadata` column so Postgres applies the table default `{}`.

### T-MMM-DMC-023 — Organisation Source Archive/Reprocess Must Be Non-Destructive
- **Source**: Live organisation-source reprocess confusion, 2026-06-02.
- **Layer**: Unit/static + operational
- **RED Condition**: Reprocess or the adjacent organisation-source action physically removes the uploaded storage object, deletes canonical chunks before successful recovery, or reports success while the edge function returned `{ success: false }`.
- **GREEN Acceptance**: Organisation Source UI presents Archive rather than Delete, retains the uploaded storage object and existing chunks for audit/recovery, and surfaces structured reprocess failure responses instead of showing a false completion message.

### T-MMM-DMC-024 — MMM Vercel Guard Must Target Configured Production Alias
- **Source**: Live GitHub Actions failure, 2026-06-02.
- **Layer**: Unit/static + operational
- **RED Condition**: `deploy-mmm-vercel.yml` hard-codes `https://mmm.maturion.com` even though Vercel project `maturion-isms-mmm` does not have that domain attached and DNS has no `mmm` record, causing production deploys to fail after successful build/deploy.
- **GREEN Acceptance**: Workflow uses `https://maturion-isms-mmm.vercel.app` as the canonical production URL by default, while allowing an explicitly configured `MMM_CUSTOM_DOMAIN_URL` to opt back into custom-domain JS-hash validation once DNS/domain mapping exists.

### T-MMM-S6-203 — MPS AI Generation Must Surface Real AIMC Failure Detail (No Generic non-2xx)
- **Source**: Runtime observability + build-to-red anti-silent-failure policy
- **Layer**: Unit/static + operational
- **RED Condition**: MPS modal only reports generic `Edge Function returned a non-2xx status code`.
- **GREEN Acceptance**: MPS generation request parses edge response body and surfaces concrete reason/detail (e.g., AIMC endpoint/auth/config failure), while preserving fallback behavior.

### T-MMM-S6-204 — AIMC Client Must Probe Gateway Endpoint Variants
- **Source**: Boundary resilience for environment URL-shape drift
- **Layer**: Unit/static
- **RED Condition**: AIMC client hardcodes one namespace path and fails when gateway is mounted at a different API prefix.
- **GREEN Acceptance**: AIMC client attempts canonical and fallback endpoint candidates for each operation before failing.

### T-MMM-S6-205 — AI Chat Must Auto-Bridge to OpenAI-Compatible Gateway on AIMC 404
- **Source**: Runtime compatibility requirement for gateway endpoint variance
- **Layer**: Unit/static + operational
- **RED Condition**: AIMC chat route 404 causes unconditional fallback despite gateway exposing `/v1/chat/completions`.
- **GREEN Acceptance**: `mmm-ai-chat-user` attempts OpenAI-compatible `/v1/chat/completions` bridge on AIMC 404 and returns usable reply when available.

### T-MMM-S6-206 — Verbatim MPS Generation Must Use Framework-Proposed MPS Without AIMC Dependency
- **Source**: Verbatim-mode functional contract (uploaded framework is source-of-truth wording)
- **Layer**: Unit/static + operational
- **RED Condition**: Verbatim MPS flow still depends on AIMC chat route and shows 404/unavailable banner even when `mmm_proposed_mps` data exists for the selected framework/domain.
- **GREEN Acceptance**: `useAIMPSGeneration` loads MPS from `mmm_proposed_domains` + `mmm_proposed_mps` for `source_type=VERBATIM` first; no AIMC-unavailable warning is required for this path.

### T-MMM-S6-220 — Verbatim Intent Must Resolve From Processed Organisation-Source Chunks
- **Source**: Verbatim mode fidelity contract (organisation source wording must drive intent text)
- **Layer**: Unit/static + operational
- **RED Condition**: Organisation source shows processed (`completed`) but regenerate intent still returns generic or paraphrased text without querying `ai_knowledge` chunk content.
- **GREEN Acceptance**: `useIntentGeneration` resolves `source_mode:VERBATIM` documents, queries `ai_knowledge` by `document_id`, and extracts direct source-aligned wording before proposed/fallback branches.

### T-MMM-S6-303 — VERBATIM Source Processing Must Produce Canonical Verbatim Index Rows
- **Source**: Verbatim runtime contract redesign (index-first lookup)
- **Layer**: Unit/static + operational
- **RED Condition**: Organisation source document is marked `completed` in VERBATIM mode with zero indexed `intent_verbatim` rows.
- **GREEN Acceptance**: Reprocess/upload writes `mmm_org_source_verbatim_index` rows from parsed source and blocks completion (`processing_status=failed`) when none are extractable.

### T-MMM-S6-304 — VERBATIM Intent Regenerate Must Query Canonical Verbatim Index First
- **Source**: Runtime determinism + anti-paraphrase policy
- **Layer**: Unit/static + operational
- **RED Condition**: Regenerate intent bypasses canonical index and returns generic text while index rows exist.
- **GREEN Acceptance**: `useIntentGeneration` resolves intent from `mmm_org_source_verbatim_index` by organisation + domain + MPS mapping before secondary extraction paths.

## Execution Mapping

- Test file:
  - `modules/MMM/tests/B4-framework/dmc-subject-knowledge-routing.test.ts`
