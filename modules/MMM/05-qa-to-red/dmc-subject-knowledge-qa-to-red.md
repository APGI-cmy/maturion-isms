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

### T-MMM-DMC-025 — VERBATIM Intent Readiness Must Accept Chunk-Positive Organisation Sources
- **Source**: Live VERBATIM intent-generation failure, 2026-06-03.
- **Layer**: Unit/static + operational
- **RED Condition**: Organisation source inventory shows extracted chunks (`chunk_count > 0`) while the ledger status remains `processing`, and intent regeneration blocks with `Verbatim mode requires at least one processed source document`.
- **GREEN Acceptance**: VERBATIM readiness and chunk fallback treat organisation/framework source documents with extracted chunks as usable for verbatim extraction, including parser/index-warning statuses, while zero-chunk sources remain blocked and status-lag warnings remain visible.

### T-MMM-DMC-026 — VERBATIM Index Failure Must Not Demote Chunked Source To Failed
- **Source**: Live organisation-source regression report, 2026-06-03.
- **Layer**: Unit/static + operational
- **RED Condition**: Upload/reprocess writes `ai_knowledge` chunks (`chunk_count > 0`) but marks the organisation source `failed` because `mmm_org_source_verbatim_index` has no rows, causing the saved profile source to appear broken.
- **GREEN Acceptance**: Upload/reprocess marks chunk-positive organisation VERBATIM sources `completed` with a parser/index warning note when canonical index rows are absent; only zero-chunk ingestion remains failed.

### T-MMM-DMC-027 — DOCX Organisation Sources Must Be Unzipped Before Chunking
- **Source**: Live VERBATIM intent extraction failure, 2026-06-03.
- **Layer**: Unit/static + operational
- **RED Condition**: Uploaded `.docx` source produces `ai_knowledge` chunks containing raw ZIP/binary payload beginning with `PK` and Word package paths instead of searchable document text; intent extraction cannot find leadership/governance wording.
- **GREEN Acceptance**: Upload/reprocess extracts readable text from DOCX `word/*.xml` entries before chunking, so `ai_knowledge.content` is searchable source text and VERBATIM intent extraction can operate on real document clauses.

### T-MMM-DMC-028 — VERBATIM Criteria Must Copy Required Actions From Organisation Source
- **Source**: Live VERBATIM criteria-generation drift, 2026-06-03.
- **Layer**: Unit/static + operational
- **RED Condition**: Criteria generation for a source-backed VERBATIM MPS returns generic or Hybrid fallback wording such as `(hybrid source)` instead of copying the matching source document `Required Actions` block.
- **GREEN Acceptance**: VERBATIM criteria generation resolves `source_mode:VERBATIM` organisation/framework documents, queries `ai_knowledge` chunks, extracts the matching MPS `Required Actions` text as uploaded-source criteria, and blocks with a source-quality error rather than silently falling back to generated criteria when no required actions are extractable.

### T-MMM-DMC-029 — VERBATIM Criteria Must Preserve Evidence-Bearing Child Clauses
- **Source**: Live VERBATIM criteria evidence-shape review, 2026-06-03.
- **Layer**: Unit/static + operational
- **RED Condition**: A parent Required Action clause with child subclauses is saved as a standalone evidence criterion while its evidence-bearing child clauses are omitted, separated from parent context, or flattened into ambiguous fragments.
- **GREEN Acceptance**: When a Required Action parent clause has child clauses (for example `1.4.1`, `1.4.2`, or unnumbered child paragraphs such as `Through...` lines), each child is emitted as its own evidence-bearing criterion with the parent stem carried into the statement; the parent stem is not emitted as a standalone evidence item.

### T-MMM-DMC-030 — VERBATIM Criteria Must Ignore Format Instructions And Match Real MPS Sections
- **Source**: Live VERBATIM MPS002 criteria extraction regression, 2026-06-03.
- **Layer**: Unit/static + operational
- **RED Condition**: Criteria generation for a later MPS returns only the document-format instruction text (`These actions are mandatory...`) or misses real Required Actions because the source title wording differs slightly from the MMM scaffold title.
- **GREEN Acceptance**: MPS criteria extraction rejects table-of-contents and format-instruction `Required Actions` text, matches real MPS sections by ordinal plus heading-token similarity or same-ordinal numbered actions, and extracts all evidence-bearing Required Action clauses including parent/child groups.

### T-MMM-DMC-031 — Accepted Criteria Must Reopen For Editing And Descriptor Authoring
- **Source**: Live criteria workflow usability review, 2026-06-03.
- **Layer**: Unit/static + operational
- **RED Condition**: After criteria are accepted, the main card only offers `Create Criteria`, saved criteria are not clearly re-enterable/editable, and criterion-level maturity descriptors cannot be generated or approved under each criterion.
- **GREEN Acceptance**: The criteria step card shows a mini dashboard with MPS count and criteria count per MPS, the action changes to `View / Edit Criteria` when accepted criteria exist, saved criteria reopen as editable cards, and each criterion can generate/edit/save five maturity level descriptors (Basic, Reactive, Compliant, Proactive, Resilient) under `mmm_level_descriptors`.

### T-MMM-DMC-032 — Maturity Descriptors Must Reconstruct Criteria Into Level-Specific Operating States
- **Source**: Live descriptor-authoring regression, 2026-06-03.
- **Layer**: Unit/static + operational
- **RED Condition**: `Create maturity descriptors` copies the accepted criterion into Basic, Reactive, Compliant, Proactive, and Resilient with only the level label/generic guidance changed.
- **GREEN Acceptance**: Descriptor generation uses the uploaded Approved Methodology Reference when available, rejects AI responses that are identical or materially too similar to the criterion, and emits five distinct auditable operating-state statements where Compliant is the neutral baseline, Proactive includes risk-based review/measurement/improvement, and Resilient includes embedded controls, automation or hard barriers where practicable, exception escalation, continuity, and survival of staff turnover/disruption.

### T-MMM-DMC-033 — Descriptor Authoring Must Stay Green When AI Refinement Is Unavailable
- **Source**: Live descriptor recreation banner, 2026-06-03.
- **Layer**: Unit/static + operational
- **RED Condition**: `Create maturity descriptors` successfully creates fallback descriptor drafts but presents a scary generic message such as `Used methodology fallback after AI reconstruction was unavailable or invalid: Edge Function returned a non-2xx status code`, making the user think descriptor creation failed.
- **GREEN Acceptance**: Descriptor authoring treats the approved methodology generator as the governed stable path, optionally attempts AI refinement, keeps five editable descriptors visible, and does not expose AI/AIMC/404/non-2xx diagnostics in the normal success banner.

### T-MMM-DMC-034 — Maturity Descriptors Must Describe Evidence State, Not Restate Obligations
- **Source**: Live descriptor semantic review, 2026-06-03.
- **Layer**: Unit/static + operational
- **RED Condition**: Basic/Reactive/Compliant/Proactive/Resilient descriptors say the criterion "must" or "shall" be approved/current/implemented, which restates the obligation instead of describing what the evidence shows at that maturity level.
- **GREEN Acceptance**: Descriptor text is phrased as observable evidence state at each level, for example absent/weak/fragmented evidence at Basic, current/traceable/verifiable evidence at Compliant, and embedded/continuous/assured evidence at Resilient.

### T-MMM-DMC-035 — Descriptor Save Must Be Visible And Capture User Edits For Learning
- **Source**: Live descriptor save/edit usability review, 2026-06-04.
- **Layer**: Unit/static + operational
- **RED Condition**: Clicking `Save maturity descriptors` provides no visible response, descriptor text can be modified without an explicit per-level edit action, or changed descriptor text is saved without an immutable audit/learning trace.
- **GREEN Acceptance**: Descriptor cards are read-only by default and expose an `Edit descriptor` control per maturity level, the save action shows adjacent pending/success/error feedback, and descriptor saves route through a service-role function that persists `mmm_level_descriptors`, writes `MATURITY_DESCRIPTOR_SAVE` to `mmm_audit_logs`, and records changed descriptor text as `USER_PREFERENCE_CAPTURE` / `MATURITY_DESCRIPTOR_EDIT` telemetry for Maturion learning.

### T-MMM-DMC-036 — Maturity Descriptors Must Preserve Criterion-Specific Evidence Anchors
- **Source**: Live descriptor semantic review, 2026-06-04.
- **Layer**: Unit/static + operational
- **RED Condition**: A role, reporting-line, meeting, support, or escalation criterion generates generic maturity descriptors such as policy ownership/display/awareness or generic control requirement evidence without referencing the criterion's actual actor, action, object, cadence, or evidence route.
- **GREEN Acceptance**: Each generated maturity descriptor preserves a distinctive criterion-specific evidence anchor while applying Basic/Reactive/Compliant/Proactive/Resilient evidence-state doctrine. For example Risk Manager accountability descriptors reference Risk Manager: Security accountability, delivery of security, and standard alignment; reporting descriptors reference direct senior-executive reporting/meeting evidence; and HOD support descriptors reference HOD/Business Unit support, deviation escalation, decisions, actions, and closure.

### T-MMM-DMC-037 — Maturity Descriptors Must Start From The Actual Evidence Requirement
- **Source**: Live auditor-consistency review, 2026-06-04.
- **Layer**: Unit/static + operational
- **RED Condition**: A maturity descriptor begins with a broad evidence category such as `Evidence for policy approval/currency` or `Evidence for governance forum mandate`, leaving auditors to infer which exact accepted criterion requirement is being assessed.
- **GREEN Acceptance**: Each Basic/Reactive/Compliant/Proactive/Resilient descriptor begins with the accepted criterion requirement restated as an auditable subject, then describes the evidence state at that level. For example, `A documented governance charter that defines leadership responsibilities and decision authority is absent, weak...`, rather than a generic governance-forum evidence category.

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
- **RED Condition**: Organisation source document has no extracted chunks and no indexed `intent_verbatim` rows, yet is marked usable for VERBATIM generation.
- **GREEN Acceptance**: Reprocess/upload writes `mmm_org_source_verbatim_index` rows when extractable; if rows are absent but chunks exist, the document remains completed with a warning and chunk fallback remains the source-of-truth path.

### T-MMM-S6-304 — VERBATIM Intent Regenerate Must Query Canonical Verbatim Index First
- **Source**: Runtime determinism + anti-paraphrase policy
- **Layer**: Unit/static + operational
- **RED Condition**: Regenerate intent bypasses canonical index and returns generic text while index rows exist.
- **GREEN Acceptance**: `useIntentGeneration` resolves intent from `mmm_org_source_verbatim_index` by organisation + domain + MPS mapping before secondary extraction paths.

## Execution Mapping

- Test file:
  - `modules/MMM/tests/B4-framework/dmc-subject-knowledge-routing.test.ts`
