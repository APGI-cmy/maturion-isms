# PIT Stage 11 — RED Baseline Reconciliation Decision

## Status
**UNRESOLVED — APPOINTMENT BLOCKER**

Stage 11 builder appointment is blocked until this decision is resolved and signed off by CS2.

## Known mismatch (exact)
- Stage 8 declared baseline: **144 RED tests**
- Current catalog enumeration: **147 rows**
- Delta rows:
  - `PIT-RED-ROUTE-029`
  - `PIT-RED-TIMELINE-011`
  - `PIT-RED-TIMELINE-012`

## Valid decision paths (only)
- **Option A**: Maintain 144 baseline; retire or reclassify the 3 delta rows.
- **Option B**: Update baseline to 147; CS2 approves expanded scope.

No other decision path is valid unless CS2 explicitly adds it.

## Mandatory controls
- [ ] CS2 decision/sign-off recorded.
- [ ] Stage 6 evidence chain updated if decision impact requires it.
- [ ] Stage 8 `wave-to-red-test-manifest.md` updated if decision impact requires it.
- [ ] Stage 10/Stage 11 blocker status updated if decision impact requires it.
- [ ] `BUILD_PROGRESS_TRACKER.md` updated to reflect final CS2-recorded reconciliation posture.
- [ ] Builder appointment remains blocked while unresolved.

## CS2 decision record
| Field | Value |
|---|---|
| Selected option (A or B) | `TBD` |
| Decision authority | `CS2` |
| Decision date | `TBD` |
| Sign-off reference | `TBD` |
| Evidence-chain updates completed | `TBD` |

## Non-overclaim statement
This document does not resolve the mismatch by itself, does not appoint a builder, does not start Stage 12, and does not clear Build Authorization.
