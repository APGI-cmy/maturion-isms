# MMM TRS Addendum — Criteria Deferred Routing + Parse Hardening

Date: 2026-05-28

## Technical Requirements

1. Criteria AI response parser must support:
   - strict JSON arrays,
   - extraction of first bracketed JSON array from mixed reply text.
2. Criteria state model must support:
   - per-item source origin metadata,
   - optional deferred target MPS id.
3. Save operation must route each accepted criterion to `deferred_target_mps_id ?? current_mps_id`.
4. Modal footer must expose `Accept / Submit` for bulk persistence across MPS sections.
5. UI must expose source-origin tag for each generated criterion row.

## QA-to-Red references

- `T-MMM-S6-CRIT-201`: parse mixed AI reply and still build criteria set.
- `T-MMM-S6-CRIT-202`: deferred criterion persists to alternate MPS target.
- `T-MMM-S6-CRIT-203`: modal-level submit persists accepted sets and exits modal.
