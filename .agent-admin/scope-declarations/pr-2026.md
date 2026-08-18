# Scope Declaration — Issue #2025

**Governing issue:** https://github.com/APGI-cmy/maturion-isms/issues/2025
**Title:** Fix organisation-context mixed-document ingestion and repeatable supplementary uploads
**CS2 authority:** Johan Ras / @APGI-cmy (issue author, OWNER association; issue body explicitly states "CS2-authorized UAT remediation")
**Branch:** apgi-cmy-issue-2025-fix-organisation-context-mixed-document-b10067
**Base:** main
**Foreman session:** foreman-v2-agent clean-worktree delivery session, 2026-08-18

---

## Production fault (authoritative statement)

- Surface symptom: at `https://maturion-isms-mmm.vercel.app/organisation-context`, uploading an organisation source document surfaces the generic browser alert `Edge Function returned a non-2xx status code`.
- **Root cause under remediation:** the `mmm-subject-knowledge-reprocess` Edge Function returns HTTP 546 `WORKER_RESOURCE_LIMIT` after approximately 125.6 seconds — a resource/time-limit exhaustion during document parsing/reprocessing, not a database/metadata-save failure.
- Context metadata saves are **not** the primary fault. Any inline context-save error UX work is secondary/complementary to the resource-exhaustion fix, not a substitute for it.

## Frozen outcome requirements (verbatim from issue #2025, do not expand or contract)

1. Organisation Context UI must support an arbitrary number of supplementary files via repeatable optional upload rows:
   - Selecting a file in the current row reveals a new empty optional row.
   - Users may remove selected optional rows.
   - Users may upload 3+ supplementary files without reopening/replacing a single picker.
2. Accepted source formats: PDF, DOC, DOCX, TXT, MD, CSV, JSON, PPT, PPTX, XLS, XLSX, with MIME fallback based on filename when browser MIME detection is absent.
3. Ingestion must be intelligence-driven, not hard-coded to one customer document:
   - Detect/normalize supported document types before extraction.
   - Process a mixed batch independently per file.
   - Preserve successful uploads if another file in the batch fails.
   - Present durable, actionable per-file processing status/error details.
4. Complex documents must not fail the entire batch through Edge Worker resource exhaustion. Architecture must use bounded/resource-safe processing and expose a recoverable status when asynchronous processing is necessary.
5. Organisation Context save failures must show the exact actionable error inline; browser alerts alone are unacceptable.
6. Preserve access control, storage isolation (RLS), and existing organisation-context behavior.

## Required governed sequence (per issue #2025 and Foreman Tier 1/Tier 2)

1. Foreman creates/reconciles architecture and builder appointment evidence (this document + wave-current-tasks.md + IAA pre-brief).
2. QA Builder produces functional QA-to-Red covering: repeatable 3+ optional rows and row removal; all listed formats incl. JSON with MIME/filename fallback; mixed-batch per-file isolation; partial success durability; recoverable bounded/async resource-failure handling; exact inline context-save error UX (no browser alerts); RLS/security preservation. Tests must assert functional behavior, not source-text/static presence.
3. UI Builder implements only UI/client-state changes (repeatable rows, per-file status, inline error rendering). No server-side parsing logic.
4. API Builder and/or document-parser-agent implement bounded/async, resource-safe ingestion/parsing changes only. No client UI changes.
5. Targeted tests, app build, CWT/cross-wave anti-regression, compatibility/security/compliance evidence, full local required-check parity, ECAP administrative bundle, pre-handover gate, and independent IAA final assurance before any handover claim.

## In-scope files (expected; builders confirm exact paths in their appointment evidence)

- Organisation Context upload UI component(s) and related client state (frontend `apps/*` or `modules/*` MMM organisation-context feature area).
- `mmm-subject-knowledge-reprocess` Supabase Edge Function and any shared document-parsing/normalization helper modules it depends on.
- Associated QA test files for the above.
- Governance/admin artifacts under `.agent-admin/**` and `.agent-workspace/foreman-v2/**` for this PR's orchestration evidence.

## Out of scope

- Any unrelated MMM/PIT/MAT feature work not tied to organisation-context ingestion.
- Any schema/RLS change not strictly required to support bounded/async status tracking for per-file ingestion (if a schema change is required for durable per-file status, it must be called out explicitly by the responsible builder and reviewed by Foreman QP before merge).
- Any agent contract (`.github/agents/*.md`) modification.
- Any change to unrelated production files not touched by the above.

## Architecture decision (Foreman orchestration note, not implementation)

- The resource-exhaustion fault requires the ingestion/parsing path to become bounded and/or asynchronous (e.g., chunked/streamed extraction, size/time budget checks, deferred/background processing with a durable status record) rather than a single synchronous Edge Function invocation that can run past the platform worker limit. Exact mechanism (queue, background task, chunking, streaming) is an API Builder / document-parser-agent implementation decision, constrained by: no single request may exhaust the Edge Function worker resource limit for any document within the frozen accepted-format list.
- Per-file status must be durable (persisted, not only in-memory/client state) so a page refresh does not lose actionable status for a partially-processed batch.
- UI and backend concerns are strictly separated per governed sequence above; QA-to-Red is written before either builder starts implementation.

## Acceptance contract (binary, verified by Foreman QP + IAA)

- [ ] 3+ supplementary files can be added via repeatable rows and removed individually — proven by test, not visual inspection alone.
- [ ] All 11 listed formats accepted; MIME-fallback-by-filename proven for at least one format lacking reliable browser MIME detection.
- [ ] Mixed-batch test proves one failing file does not roll back or block other files' successful ingestion.
- [ ] A resource-heavy/complex document scenario is proven not to exhaust the Edge Function worker resource limit (bounded/async behavior asserted, not merely hoped for).
- [ ] Inline context-save error UX asserted (no `window.alert`/browser alert usage for this flow).
- [ ] RLS/storage isolation regression tests remain green; no policy relaxation introduced.
- [ ] CWT/cross-wave anti-regression suite green at current PR head.
- [ ] IAA final assurance PASS token present in the wave record before any CS2 handover claim.

## Risks

- Risk: bounded/async redesign of `mmm-subject-knowledge-reprocess` could regress existing successful single-document ingestion paths. Mitigation: QA-to-Red must include a regression case for the existing single-primary-document happy path.
- Risk: introducing per-file durable status may require a new column/table; any such schema change must be QA-to-Red-first and reviewed for RLS parity by schema-builder if invoked.
- Risk: UI/API builders working in parallel could collide on the status-shape contract. Mitigation: QA-to-Red defines the per-file status contract before either builder starts; both builders implement against that contract.

## Evidence requirements

- Targeted test run output (QA-to-Red then Build-to-Green) pasted into PREHANDOVER proof.
- Build output for affected app(s).
- CWT/cross-wave anti-regression evidence.
- Compatibility/security/compliance evidence (RLS policy diff review, no new browser-alert usage grep, format-list completeness check).
- Full local required-check parity evidence per `.agent-admin/control/merge-gate-required-checks.json`.
- ECAP administrative bundle (Phase 4) — administrative only, not a readiness substitute.
- IAA canonical PRE-BRIEF (this document's binding) and IAA final assurance token before handover language is used.

---

**Authority:** CS2 (Johan Ras / @APGI-cmy) via issue #2025.
**Recorded by:** foreman-v2-agent, clean-worktree delivery session, 2026-08-18.
