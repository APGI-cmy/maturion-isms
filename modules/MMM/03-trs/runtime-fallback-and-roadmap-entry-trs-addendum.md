# MMM TRS Addendum — Runtime Fallback + Roadmap Entry Reliability

## Technical Requirements

### TR-RT-001
Organisation Context client shall attempt edge invocation first, then execute canonical-table fallback (`mmm_profiles` -> `mmm_organisations`) on invocation transport/runtime failure.

### TR-RT-002
DMC inventory client shall attempt edge invocation first, then execute canonical-table fallback (`mmm_subject_knowledge_documents`) on invocation transport/runtime failure.

### TR-RT-003
Sidebar “Maturity Roadmap” link shall target a route that does not require request-time query prerequisites.

### TR-RT-004
Fallback paths shall preserve current user-scoped organisation filtering and shall not broaden scope beyond resolved `organisation_id`.
