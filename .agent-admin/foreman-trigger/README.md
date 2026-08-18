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

### `cs2-lane-request.json`
Written by **Foreman** when state is `no-active-lane` — no builder PR exists for the authorized scope.

```json
{
  "timestamp": "<ISO>",
  "request_type": "LANE_ESTABLISHMENT_REQUIRED",
  "active_scope_declaration": "<scope file>",
  "issue_ref": "<issue number>",
  "reason": "<why no lane>",
  "foreman_cycle_file": "<cycle file>",
  "cs2_action_required": true
}
```

**CS2 reads this on startup (Phase 0)** and routes to builder appointment before writing a new CS2 trigger.

### `cs2-builder-appointment.json`
Written by **CS2** when it appoints a builder after receiving a lane request.

```json
{
  "timestamp": "<ISO>",
  "appointed_builder": "<builder agent id>",
  "issue_ref": "<issue>",
  "scope_declaration": "<scope file>",
  "task": "<exact task for builder>",
  "cs2_authorized": true,
  "builder_may_proceed": true
}
```

## Full Automated Chain

```
[User clicks CS2 play — ONE click to start the loop]
  → CS2 checks for cs2-lane-request.json (Foreman lane request)
    → if present: appoints builder, writes cs2-builder-appointment.json
  → CS2 reviews scope + traceability
  → writes cs2-decision-latest.json on main
  → calls run_workflow → Foreman wakes up automatically
    → Foreman reads cs2-decision-latest.json from main
    → if no active builder lane:
        writes cs2-lane-request.json on main
        calls run_workflow → CS2 wakes up automatically
          → CS2 appoints builder, writes trigger → Foreman wakes again
    → if active lane: runs QP → ECAP → IAA
      → if any gate FAIL: STOP_AND_FIX (named owner fixes, re-trigger CS2)
      → if all gates PASS:
          writes foreman-complete-latest.json on main
          calls run_workflow → CS2 Independent Review wakes up automatically
            → CS2-IR reviews final HEAD
            → LANE_CLEAR_FOR_MERGE or STOP_AND_FIX routes back to Foreman
```

**All wakeups are automatic via `run_workflow`. No manual clicks required after the first CS2 trigger.**

## Important: All trigger files must be on the `main` branch
- All workflows navigate to `C:\Users\Johan\.copilot\repos\maturion-isms` (main checkout) before reading or writing trigger files.
- Writing to a worktree path will break the chain — the other workflow won't see it.
