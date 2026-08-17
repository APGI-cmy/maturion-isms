# Foreman Trigger Directory

This directory holds CS2→Foreman and Foreman→CS2 signal files for the play-button automation chain.

## Files

### `cs2-decision-latest.json`
Written by **CS2 Oversight** automation at end of each run (Phase 5), regardless of PASS/FAIL.

```json
{
  "timestamp": "<ISO>",
  "decision": "FOREMAN_REENTRY_PACKET | STOP_AND_FIX",
  "head_sha": "<current HEAD at time of review>",
  "findings_summary": "<one sentence>",
  "cs2_authorized": true | false,
  "foreman_may_proceed": true | false
}
```

**Foreman reads this in Step 0** before proceeding. If `foreman_may_proceed` is false, Foreman stops immediately.

### `foreman-complete-latest.json`
Written by **Foreman** only when the full cycle reaches `final-handover-ready` (Phase 6).

```json
{
  "timestamp": "<ISO>",
  "status": "final-handover-ready",
  "head_sha": "<HEAD at cycle end>",
  "cycle_file": "<foreman-cycle-YYYYMMDD-HHMM.md>",
  "cs2_review_requested": true
}
```

**CS2 Independent Review** reads this on its startup to know Foreman has completed a full cycle.

## Chain Summary

```
[User clicks CS2 play] 
  → CS2 runs review
  → writes cs2-decision-latest.json (PASS or FAIL)
  → [User clicks Foreman play]
    → Foreman reads cs2-decision-latest.json
    → if PASS: runs full QP→ECAP→IAA cycle
    → writes foreman-complete-latest.json
    → [User clicks CS2 Independent Review play]
      → CS2 runs independent review on final HEAD
      → issues merge recommendation
```

Note: Foreman and CS2 Independent Review can be triggered manually by the user, or their prompts can be updated to auto-trigger when the trigger files are present.
