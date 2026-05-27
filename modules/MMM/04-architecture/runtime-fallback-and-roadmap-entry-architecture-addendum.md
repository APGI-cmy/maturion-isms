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
