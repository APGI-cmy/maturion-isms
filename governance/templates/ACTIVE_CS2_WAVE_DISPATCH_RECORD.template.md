# Active-CS2 Wave Dispatch Record

**Job ID**: `<stable job_id>`  
**Wave ID**: `<stable wave_id>`  
**Dispatch idempotency key**: `<key>`  
**Validated at**: `<ISO-8601 timestamp>`  
**State evaluator decision**: `ACCEPTED | REJECTED | NO_OP | TRIPPED`

## Validated Tier 3 context

- **Approved scope and envelope**: `<record reference and evaluated counters>`
- **Dependencies**: `<validated predecessor wave IDs and outcomes>`
- **PR fingerprint**: `<repository, PR, head SHA, base SHA, reviewed-content SHA256>`
- **Live blockers**: `<none or identifiers>`
- **Evidence envelope**: `<immutable envelope ID; frozen substantive fingerprint; permitted token-only delta if applicable>`
- **Merge-policy version**: `<version>`

## Stage evidence

Record each item as `PRESENT: <reference>`, `NOT_YET_APPLICABLE`, or `REJECTED: <typed reason>`. Initial dispatch must not claim or require its own future final evidence.

| Evidence | Required at stage |
|---|---|
| Pre-brief | `PRE_BRIEF` and later |
| QP evidence | `QP` and later |
| ECAP evidence | `ECAP` and later |
| Final IAA assurance | `FINAL_IAA`, `REVIEW`, `MERGE`, and later |
| Current checks, conflict, and compare-and-set evidence | `MERGE` |

## Route and response

**Next allowed stage**: `<stage>`  
**Foreman return route on failure**: `<owner and stage>`  
**Typed refusal, if any**: `<code and reason>`

This record is reconstructed from validated durable records; it creates no authority, cannot alter Tier 1, and must not be used to add scope, waves, budgets, or activation.
