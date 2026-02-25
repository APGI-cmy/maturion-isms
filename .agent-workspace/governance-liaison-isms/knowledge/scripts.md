# governance-liaison-isms — Operational Scripts (Tier 2 Knowledge)

**Agent**: governance-liaison-isms
**Knowledge Version**: 1.0.0
**Last Updated**: 2026-02-25
**Architecture**: `governance/canon/THREE_TIER_AGENT_KNOWLEDGE_ARCHITECTURE.md`
**Referenced from**: Phase 3 of `.github/agents/governance-liaison-isms-agent.md`

---

## Purpose

This file contains all operational bash scripts extracted from the governance-liaison-isms agent
contract (Phase 3). Scripts are organized by named section matching the reference in the contract.
The agent contract references this file for execution; the scripts themselves live here in Tier 2.

---

## Section: SHA256 Validation

**Used in**: Phase 3.1 — Cross-Repository Layer-Down Protocol, Step 2 (Validate Checksums)

Verify SHA256 for each changed file against CANON_INVENTORY.json before writing locally.
If checksum mismatches, halt and escalate per HALT-005.

```bash
# For each changed file in layer-down
EXPECTED_SHA=$(jq -r '.canons[] | select(.filename=="FILE.md") | .file_hash_sha256' governance/CANON_INVENTORY.json)
ACTUAL_SHA=$(sha256sum governance/canon/FILE.md | cut -d' ' -f1)

if [ "$EXPECTED_SHA" != "$ACTUAL_SHA" ]; then
  echo "CHECKSUM MISMATCH: Layer-down required for FILE.md"
  echo "Expected: $EXPECTED_SHA"
  echo "Actual:   $ACTUAL_SHA"
  # Trigger HALT-005: halt_escalate_do_not_write_file
fi
```

---

## Section: Sync State Update

**Used in**: Phase 3.1 — Step 7 (Update Sync State); Phase 3.2 — Step 3 (Update Sync State)

Update `.agent-admin/governance/sync_state.json` after a successful layer-down or ripple processing.

```bash
# After successful layer-down — update sync state
jq --arg ts "$(date -u +%Y-%m-%dT%H:%M:%SZ)" \
   --arg commit "$CANONICAL_COMMIT" \
   --arg inv_version "$CANONICAL_INVENTORY_VERSION" \
   --argjson files "$FILES_UPDATED_JSON" \
   '.last_sync.timestamp = $ts
   | .last_sync.canonical_commit = $commit
   | .last_sync.canonical_inventory_version = $inv_version
   | .last_sync.files_updated = $files
   | .sync_pending = false
   | .drift_detected = false' \
   .agent-admin/governance/sync_state.json > tmp && mv tmp .agent-admin/governance/sync_state.json
```

Example `sync_state.json` after update:
```json
{
  "last_sync": {
    "timestamp": "2026-02-25T10:00:00Z",
    "canonical_commit": "abc123",
    "canonical_inventory_version": "1.0.0",
    "files_updated": ["FILE1.md", "FILE2.md"]
  },
  "sync_pending": false,
  "drift_detected": false
}
```

---

## Section: Ripple Inbox Creation

**Used in**: Phase 3.2 — Governance Ripple Processing, Step 2 (Create Ripple Inbox Entry)

Create the ripple inbox directory and write the event payload.

```bash
mkdir -p .agent-admin/governance/ripple-inbox
echo "$EVENT_PAYLOAD" > .agent-admin/governance/ripple-inbox/ripple-${DISPATCH_ID}.json
```

---

## Section: Ripple Archive

**Used in**: Phase 3.2 — Governance Ripple Processing, Step 5 (Archive Ripple Event)

After the alignment PR is merged, move the processed ripple event to the archive.

```bash
# After PR merged
mv .agent-admin/governance/ripple-inbox/ripple-${DISPATCH_ID}.json \
   .agent-admin/governance/ripple-archive/
```

---

## Section: Drift Detection

**Used in**: Phase 3.3 — Drift Detection & Remediation

Compare canonical inventory version against local sync state to detect governance drift.
Run hourly as fallback if ripple event was missed.

```bash
#!/bin/bash
# Compare canonical inventory version against local sync state

CANONICAL_INVENTORY=$(curl -sL https://raw.githubusercontent.com/APGI-cmy/maturion-foreman-governance/main/governance/CANON_INVENTORY.json)
CANONICAL_VERSION=$(echo "$CANONICAL_INVENTORY" | jq -r '.version')
LOCAL_VERSION=$(jq -r '.last_sync.canonical_inventory_version' .agent-admin/governance/sync_state.json)

if [ "$LOCAL_VERSION" != "$CANONICAL_VERSION" ]; then
  echo "DRIFT DETECTED: Local governance out of sync"
  echo "Local: $LOCAL_VERSION, Canonical: $CANONICAL_VERSION"

  # Update sync state to flag drift
  jq --arg ts "$(date -u +%Y-%m-%dT%H:%M:%SZ)" \
     '.drift_detected = true | .drift_detected_at = $ts' \
     .agent-admin/governance/sync_state.json > tmp && mv tmp .agent-admin/governance/sync_state.json

  # Create issue for CS2 review (if constitutional change suspected)
  # Execute self-alignment protocol (if safe to self-align)
fi
```

**Remediation Steps** (after drift detected):
1. **Detect**: Identify which files are drifted (version mismatch)
2. **Analyze**: Determine if safe to self-align (no constitutional changes)
3. **Align**: Execute layer-down protocol (Phase 3.1)
4. **Validate**: Verify checksums match canonical (SHA256 Validation section above)
5. **Document**: Record alignment in session memory
6. **Clear Drift Flag**: Update sync_state.json with new `drift_detected: false`

---

**Authority**: CS2 (Johan Ras) | **Living Agent System**: v6.2.0
**Policy**: `governance/canon/THREE_TIER_AGENT_KNOWLEDGE_ARCHITECTURE.md`
