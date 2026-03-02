# Governance Drift Report

**Session ID**: align-20260301-ripple-79652ea5  
**Timestamp**: 2026-03-01T16:50:00Z  
**Canonical Commit**: 79652ea59982559435b40519f47c3ab854da3d1a  
**Canonical Version**: 1.0.0  
**Trigger**: manual recovery trigger — ripple issue #765

## Drift Summary

- **Missing Files**: 0
- **Hash Mismatches**: 6
- **Files Layered Down**: 7 (6 canon files + CANON_INVENTORY.json)

## Missing Files

None

## Hash Mismatches

- `governance/canon/ACTIVATION_STATE_MODEL.md`
- `governance/canon/AGENT_ROLE_GATE_APPLICABILITY.md`
- `governance/canon/APP_STARTUP_REQUIREMENTS_DECLARATION.md`
- `governance/canon/BUILD_TREE_EXECUTION_MODEL.md`
- `governance/canon/GOVERNANCE_LAYERDOWN_CONTRACT.md`
- `governance/canon/PR_GATE_EVALUATION_AND_ROLE_PROTOCOL.md`

## Files Updated

- `governance/canon/ACTIVATION_STATE_MODEL.md`
- `governance/canon/AGENT_ROLE_GATE_APPLICABILITY.md`
- `governance/canon/APP_STARTUP_REQUIREMENTS_DECLARATION.md`
- `governance/canon/BUILD_TREE_EXECUTION_MODEL.md`
- `governance/canon/GOVERNANCE_LAYERDOWN_CONTRACT.md`
- `governance/canon/PR_GATE_EVALUATION_AND_ROLE_PROTOCOL.md`
- `governance/CANON_INVENTORY.json`

## Local Extensions Preserved

- `governance/canon/AMC_SCOPE_DOCUMENT.md` (local extension, v1.0.0, 2026-03-01)

## Verification

All files verified with SHA256 checksums from canonical CANON_INVENTORY.json.

## CI Fix

`.github/workflows/ripple-integration.yml` updated to use `github.token` as fallback
when `MATURION_BOT_TOKEN` is not configured, enabling automated ripple integration.

---
**Authority**: CROSS_REPOSITORY_LAYER_DOWN_PROTOCOL.md  
**Script**: .github/scripts/align-governance.sh  
**Agent**: governance-liaison-isms-agent v6.2.0
