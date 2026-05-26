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
