# Governance Evidence Directory

This directory contains evidence artifacts for governance alignment and ripple synchronization.

## Authority

- **CROSS_REPOSITORY_LAYER_DOWN_PROTOCOL.md**
- **LIVING_AGENT_SYSTEM.md v6.2.0**
- **Governance Liaison Contract v2.0.0**

## Directory Contents

### Core Files

1. **ripple-log.json** - Log of all governance ripple events
   - Tracks automated alignment activities
   - Records canonical commits and file updates
   - Maintains audit trail for governance synchronization

2. **drift-report-*.md** - Drift detection reports
   - Created by `.github/scripts/align-governance.sh`
   - Documents missing files and hash mismatches
   - Provides verification evidence for layer-down activities

### Evidence Lifecycle

1. **Creation**: Alignment script detects drift and creates evidence artifacts
2. **Logging**: Ripple events logged to `ripple-log.json`
3. **Archival**: Drift reports archived for audit trail
4. **Retention**: Keep last 10 drift reports, archive older ones

## Related Infrastructure

- **Receiver Workflow**: `.github/workflows/governance-ripple-sync.yml`
- **Scheduled Fallback**: `.github/workflows/governance-alignment-schedule.yml`
- **Alignment Script**: `.github/scripts/align-governance.sh`
- **Sync State**: `governance/sync_state.json`
- **Canon Inventory**: `governance/CANON_INVENTORY.json`

## Governance Liaison Authority

Per **GOVERNANCE_LIAISON_MINIMUM_APPOINTMENT_REQUIREMENTS.md**, the Governance Liaison has **unique self-alignment authority** to:

✅ Layer down governance canon automatically when drift detected  
✅ Update governance inventories automatically  
✅ Create evidence artifacts during alignment  
✅ Update sync state with alignment metadata

## Maintenance

Evidence artifacts are automatically managed by governance workflows. Manual intervention should not be necessary under normal operations.

For issues or questions, escalate to CS2 per agent contract escalation protocol.

---
**Version**: 1.0.0  
**Created**: 2026-02-14  
**Authority**: LIVING_AGENT_SYSTEM.md v6.2.0
