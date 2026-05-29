# MMM Architecture Addendum — Runtime Fallback + Roadmap Entry Reliability

## Reliability Pattern
Client flows use an **edge-first, canonical-fallback** strategy:
1. Attempt edge function path.
2. On invocation/runtime transport failure, execute direct canonical-table query path.
3. Preserve organisation-scoped filtering and existing UI contracts.

## Applied Components
- Organisation Context page (`mmm-organisation-context` -> fallback tables).
- DMC inventory (`mmm-subject-knowledge-list` -> fallback table).
- Sidebar roadmap entry routed to non-dead-end workflow entry (`/frameworks`).
- DMC command surface (Upload/Bulk Upload/Migration Check) with local action-feedback zone so request start, validation errors, and result states are visible at click location.
- DMC bulk-ingest diagnostics aggregate and surface dominant failure causes (top grouped reasons) to prevent opaque "N failed" outcomes.
- DMC edge invocation path must parse and expose non-2xx response payload bodies (`{ error: ... }`) so runtime failures are actionable and not masked by generic client errors.
- DMC upload/reprocess canonical-write path must sanitize null/control characters from chunk content and JSON metadata before `ai_knowledge` + document status writes to prevent Postgres `unsupported Unicode escape sequence` runtime failures.
- DMC upload path must enforce duplicate detection by active file identity and support explicit replace semantics (`replace_existing`) instead of silently duplicating records.
- DMC destructive actions (archive single/bulk) must require explicit user confirmation before mutation.
- DMC status model must expose consistent tonal UX treatment (Pending/Processing/Completed/Failed) via subtle card/row/pill color coding for fast operational scanning.
- DMC reprocess must tolerate legacy-row anomalies by avoiding hard dependency on optional JSON fields (for example `tags`) and using safe defaults where needed.
- MPS generation in `VERBATIM` mode must source records directly from canonical framework proposal tables (`mmm_proposed_domains` + `mmm_proposed_mps`) before AIMC invocation; uploaded framework content is authoritative for this mode and must not hard-fail on AIMC chat-route outages.
- Organisation-context source documents (PDF/DOCX/non-text MIME) must not be indexed as metadata-only placeholders when KUC parse payload text is available; DMC upload/reprocess must extract best-effort parsed text from KUC classification payload before fallback content synthesis.
- Intent generation in `VERBATIM` mode must resolve direct source wording from processed organisation-source chunks (`ai_knowledge` rows linked by `document_id`) prior to proposed-table/default draft fallback.
