# MMM FRS Addendum — Runtime Fallback + Roadmap Entry Reliability

## Scope
- Organisation Context page availability.
- DMC inventory availability.
- Sidebar “Maturity Roadmap” entry behavior.

## Functional Requirements

### FR-RT-001 — Organisation Context fallback availability
If `mmm-organisation-context` edge invocation is unavailable, the Organisation Context page shall fall back to direct canonical reads/writes using `mmm_profiles` and `mmm_organisations`.

### FR-RT-002 — DMC inventory fallback availability
If `mmm-subject-knowledge-list` edge invocation is unavailable, DMC shall fall back to direct canonical reads from `mmm_subject_knowledge_documents` and continue rendering inventory and counters.

### FR-RT-003 — Non-dead-end roadmap sidebar entry
Sidebar “Maturity Roadmap” shall route to a non-dead-end destination that does not require a preselected `framework_id`.
