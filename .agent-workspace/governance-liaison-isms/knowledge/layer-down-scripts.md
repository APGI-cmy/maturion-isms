# Layer-Down Scripts — governance-liaison-isms

**Agent**: governance-liaison-isms  
**Contract Version**: 3.2.0  
**Knowledge Version**: 1.0.0  
**Last Updated**: 2026-02-25  
**Architecture**: `governance/canon/THREE_TIER_AGENT_KNOWLEDGE_ARCHITECTURE.md`  
**Canonical Reference**: `governance/canon/CROSS_REPOSITORY_LAYER_DOWN_PROTOCOL.md`

---

## Purpose

This file contains the operational scripts for the cross-repository layer-down protocol.
These scripts are Tier 2 knowledge — they belong here, not inline in the agent contract.
Reference this file from Phase 3.1 of the agent contract.

---

## Script 1 — Checksum Validation

Use during Phase 3.1 Step 2 (Validate Checksums).

```bash
#!/bin/bash
# Validate SHA256 checksum for a canonical file against CANON_INVENTORY.json
# Usage: validate_checksum <filename>
# Example: validate_checksum LIVING_AGENT_SYSTEM.md

FILENAME="$1"
CANON_PATH="governance/canon/${FILENAME}"
INVENTORY_PATH="governance/CANON_INVENTORY.json"

EXPECTED_SHA=$(jq -r --arg fn "$FILENAME" \
  '.canons[] | select(.filename==$fn) | .file_hash_sha256' \
  "$INVENTORY_PATH")

if [ -z "$EXPECTED_SHA" ] || [ "$EXPECTED_SHA" = "null" ]; then
  echo "ERROR: $FILENAME not found in CANON_INVENTORY.json — HALT-002"
  exit 2
fi

ACTUAL_SHA=$(sha256sum "$CANON_PATH" | cut -d' ' -f1)

if [ "$EXPECTED_SHA" != "$ACTUAL_SHA" ]; then
  echo "CHECKSUM MISMATCH for $FILENAME — HALT-005"
  echo "  Expected: $EXPECTED_SHA"
  echo "  Actual:   $ACTUAL_SHA"
  exit 1
fi

echo "CHECKSUM OK: $FILENAME ($ACTUAL_SHA)"
exit 0
```

**Halt triggers**:
- Exit code 1: SHA256 mismatch → HALT-005 (do not write the file)
- Exit code 2: File not in inventory → HALT-002 (escalate to CS2)

---

## Script 2 — Sync State Update

Use during Phase 3.1 Step 7 (Update Sync State).

```bash
#!/bin/bash
# Update sync_state.json after a successful layer-down
# Usage: update_sync_state <canonical_commit> <canonical_inventory_version> <files_updated_csv>

CANONICAL_COMMIT="$1"
CANONICAL_VERSION="$2"
FILES_UPDATED="$3"  # comma-separated list of filenames
SYNC_STATE=".agent-admin/governance/sync_state.json"

TIMESTAMP=$(date -u +%Y-%m-%dT%H:%M:%SZ)
FILES_JSON=$(echo "$FILES_UPDATED" | jq -R 'split(",")')

jq --arg ts "$TIMESTAMP" \
   --arg commit "$CANONICAL_COMMIT" \
   --arg version "$CANONICAL_VERSION" \
   --argjson files "$FILES_JSON" \
   '.last_sync.timestamp = $ts |
    .last_sync.canonical_commit = $commit |
    .last_sync.canonical_inventory_version = $version |
    .last_sync.files_updated = $files |
    .sync_pending = false |
    .drift_detected = false' \
   "$SYNC_STATE" > "${SYNC_STATE}.tmp" && mv "${SYNC_STATE}.tmp" "$SYNC_STATE"

echo "Sync state updated: $TIMESTAMP | commit=$CANONICAL_COMMIT | version=$CANONICAL_VERSION"
```

**Expected sync_state.json structure after update**:
```json
{
  "last_sync": {
    "timestamp": "2026-02-25T10:00:00Z",
    "canonical_commit": "<sha>",
    "canonical_inventory_version": "1.0.0",
    "files_updated": ["FILE1.md", "FILE2.md"]
  },
  "sync_pending": false,
  "drift_detected": false
}
```

---

*Authority: CS2 (Johan Ras) | LIVING_AGENT_SYSTEM.md v6.2.0*  
*Policy: governance/canon/CROSS_REPOSITORY_LAYER_DOWN_PROTOCOL.md*  
*Created: 2026-02-25 | Status: ACTIVE*
