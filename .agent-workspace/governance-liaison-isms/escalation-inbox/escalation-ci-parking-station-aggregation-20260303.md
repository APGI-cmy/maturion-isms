# Escalation: CI/Reporting Scripts — Parking Station Aggregation Update

## Type
AUTHORITY_BOUNDARY

## Description
CI and reporting scripts that aggregate from `.agent-workspace/parking-station/suggestions-log.md`
(the global file) must be updated to aggregate from all per-agent files:
`.agent-workspace/*/parking-station/suggestions-log.md`

This change is OUTSIDE the governance-liaison-isms write_access scope. Per the agent contract,
`.github/scripts/**` and `.github/workflows/**` are in `escalation_required`.

## Scope

**Scripts to audit and potentially update:**
- `.github/scripts/session-closure.sh` — does not reference parking station (no change required)
- `.github/scripts/wake-up-protocol.sh` — audit for parking station references
- Any reporting scripts or workflows that aggregate the parking station log

**Current status:**
- `session-closure.sh` has been reviewed — does NOT reference the parking station file
- No other scripts were found that directly reference `.agent-workspace/parking-station/`
- The parking station is currently written to manually by agents; no CI automation reads it yet

**Future-proofing required:**
When CI/reporting automation for parking station aggregation is implemented, it must target:
`.agent-workspace/*/parking-station/suggestions-log.md` (not the retired global file)

## Context
- Session: session-039-20260303
- Task: [Propagation][Parking Station] Update all agent contracts to use per-agent parking station file paths
- Blocked at: Phase 3 — .github/scripts/ and .github/workflows/ are escalation_required
- Related governance spec: `governance/PER_AGENT_PARKING_STATION_SPEC.md`

## Recommendation
1. Assign to Foreman-v2 → CI specialist for any needed script updates
2. Audit `.github/scripts/` and `.github/workflows/` for parking station references
3. If no current references, create a tracking issue for when CI automation is built
4. Ensure any new CI parking station automation uses the per-agent glob pattern

## Evidence
- Script review: `session-closure.sh` — no parking station references found
- Per-agent files created: `.agent-workspace/*/parking-station/suggestions-log.md`
- Governance spec: `governance/PER_AGENT_PARKING_STATION_SPEC.md`

---
Created: Session 039 | Date: 2026-03-03
Authority: CS2 — escalated per governance-liaison contract scope boundaries
