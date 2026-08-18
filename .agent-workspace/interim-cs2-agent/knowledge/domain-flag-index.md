# Interim CS2 Agent - Domain Flag Index

**Version**: 1.0.0
**Effective Date**: 2026-08-12

## Purpose

This file lists the governance and authority flags the interim CS2 agent must recognize.

## Initial State

| Flag | State | Notes |
|---|---|---|
| `CS2_ONLY_AUTHORITY` | enabled | CS2 is the only merge/authority source |
| `CONSUMER_REPO_RECEIVE_ONLY` | enabled | No consumer-side canon invention |
| `IAA_REQUIRED_FOR_FINAL_ASSURANCE` | enabled | Final assurance requires independent IAA |
| `NO_RUNTIME_ACTIVATION` | enabled | Contract existence does not activate runtime |
| `NO_PRODUCT_IMPLEMENTATION` | enabled | No product work is permitted |
| `NO_SELF_MODIFICATION` | enabled | Agent must not self-edit contract files |
| `TRUTHFUL_STATUS_ONLY` | enabled | Status claims must remain literal and evidenced |
| `FOREMAN_EQUIVALENT_BOOTSTRAP` | enabled | Load Tier 1/Tier 2/canon/memory/FAIL-ONLY-ONCE and merge-gate requirements before trigger review |
| `DELIVERY_INTENT_REVIEW_ONLY` | enabled | Review evidence and stated purpose; do not perform implementation or IAA assurance |
| `APP_INTENT_GAP_ESCALATION` | enabled | App-breaking intent or specification insufficiency is reserved for CS2 |
| `FOREMAN_REENTRY_REQUIRED` | enabled | Clear review returns to Foreman, never directly to merge |
| `TRACKER_UPDATE_ON_SUBSTANTIVE_CORRECTION` | enabled | Correction requires the applicable BUILD_PROGRESS_TRACKER or continuous-improvement update |

## Flags

- `CS2_ONLY_AUTHORITY`
- `CONSUMER_REPO_RECEIVE_ONLY`
- `IAA_REQUIRED_FOR_FINAL_ASSURANCE`
- `NO_RUNTIME_ACTIVATION`
- `NO_PRODUCT_IMPLEMENTATION`
- `NO_SELF_MODIFICATION`
- `TRUTHFUL_STATUS_ONLY`
- `FOREMAN_EQUIVALENT_BOOTSTRAP`
- `DELIVERY_INTENT_REVIEW_ONLY`
- `APP_INTENT_GAP_ESCALATION`
- `FOREMAN_REENTRY_REQUIRED`
- `TRACKER_UPDATE_ON_SUBSTANTIVE_CORRECTION`

## Notes

- Flags are descriptive, not executable.
- Any missing or conflicting flag requires escalation to CS2.
