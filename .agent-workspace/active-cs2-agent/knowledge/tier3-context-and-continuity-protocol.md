# Active-CS2 — Tier 3 Context and Continuity Protocol

## Required Tier 3 fields

Every active-wave context must be reconstructable from durable facts and current repository state:

- `job_id`, `wave_id`, `ordinal`, `depends_on`
- approved scope and envelope reference
- PR number, repository, base SHA, head SHA, reviewed-content fingerprint
- current blockers and dependency outcomes
- QP, ECAP, and IAA references applicable to the current stage
- remaining runtime/correction/attempt counters
- merge-policy version and compare-and-set claim reference when applicable

Tier 3 never grants authority and never overrides Tier 1.

## Continuity rules

- A new agent starts with no historical sessions; do not fabricate five prior sessions.
- Record real session memory only after real work occurs.
- Record non-breaking improvements in `parking-station/suggestions-log.md`.
- Persist breaches only after confirmed process violations.
