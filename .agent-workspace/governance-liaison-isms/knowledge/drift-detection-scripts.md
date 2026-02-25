# Drift Detection Scripts — governance-liaison-isms

**Agent**: governance-liaison-isms  
**Contract Version**: 3.2.0  
**Knowledge Version**: 1.0.0  
**Last Updated**: 2026-02-25  
**Architecture**: `governance/canon/THREE_TIER_AGENT_KNOWLEDGE_ARCHITECTURE.md`  
**Canonical Reference**: `governance/canon/CROSS_REPOSITORY_LAYER_DOWN_PROTOCOL.md`

---

## Purpose

This file contains the operational scripts for governance drift detection.
These scripts are Tier 2 knowledge — they belong here, not inline in the agent contract.
Reference this file from Phase 3.3 of the agent contract.

---

## Script 1 — Drift Detection

Use during Phase 3.3 (Drift Detection & Remediation).

```bash
#!/bin/bash
# Compare canonical inventory version against local sync state to detect drift
# Usage: detect_drift
# Run hourly as fallback if ripple events are missed.

CANONICAL_SOURCE="https://raw.githubusercontent.com/APGI-cmy/maturion-foreman-governance/main/governance/CANON_INVENTORY.json"
SYNC_STATE=".agent-admin/governance/sync_state.json"

CANONICAL_INVENTORY=$(curl -sL "$CANONICAL_SOURCE")
if [ -z "$CANONICAL_INVENTORY" ]; then
  echo "ERROR: Cannot reach canonical inventory — HALT-002 (escalate to CS2)"
  exit 2
fi

CANONICAL_VERSION=$(echo "$CANONICAL_INVENTORY" | jq -r '.version')
LOCAL_VERSION=$(jq -r '.last_sync.canonical_inventory_version' "$SYNC_STATE")

if [ "$LOCAL_VERSION" = "$CANONICAL_VERSION" ]; then
  echo "NO DRIFT: Local governance is current (version=$CANONICAL_VERSION)"
  exit 0
fi

echo "DRIFT DETECTED: Local governance out of sync"
echo "  Local:     $LOCAL_VERSION"
echo "  Canonical: $CANONICAL_VERSION"

TIMESTAMP=$(date -u +%Y-%m-%dT%H:%M:%SZ)
jq --arg ts "$TIMESTAMP" \
   '.drift_detected = true | .drift_detected_at = $ts' \
   "$SYNC_STATE" > "${SYNC_STATE}.tmp" && mv "${SYNC_STATE}.tmp" "$SYNC_STATE"

echo "Drift flag set in sync_state.json. Execute self-alignment protocol (Phase 3.1)."
exit 1
```

**Exit codes**:
- Exit 0: No drift — governance is current
- Exit 1: Drift detected — execute self-alignment (Phase 3.1 layer-down)
- Exit 2: Cannot reach canonical source — HALT-002, escalate to CS2

**Post-drift remediation**: After successful layer-down (Phase 3.1), call `update_sync_state`
from `layer-down-scripts.md` to clear the `drift_detected` flag.

---

*Authority: CS2 (Johan Ras) | LIVING_AGENT_SYSTEM.md v6.2.0*  
*Policy: governance/canon/CROSS_REPOSITORY_LAYER_DOWN_PROTOCOL.md*  
*Created: 2026-02-25 | Status: ACTIVE*
