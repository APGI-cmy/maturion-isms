# Ripple Processing Scripts — governance-liaison-isms

**Agent**: governance-liaison-isms  
**Contract Version**: 3.2.0  
**Knowledge Version**: 1.0.0  
**Last Updated**: 2026-02-25  
**Architecture**: `governance/canon/THREE_TIER_AGENT_KNOWLEDGE_ARCHITECTURE.md`  
**Canonical Reference**: `governance/canon/CROSS_REPO_RIPPLE_TRANSPORT_PROTOCOL.md`

---

## Purpose

This file contains the operational scripts for governance ripple event processing.
These scripts are Tier 2 knowledge — they belong here, not inline in the agent contract.
Reference this file from Phase 3.2 of the agent contract.

---

## Script 1 — Create Ripple Inbox Entry

Use during Phase 3.2 Step 2 (Create Ripple Inbox Entry).

```bash
#!/bin/bash
# Write an incoming ripple event to the ripple inbox
# Usage: create_ripple_inbox_entry <event_payload_file> <dispatch_id>

EVENT_PAYLOAD_FILE="$1"
DISPATCH_ID="$2"
INBOX_DIR=".agent-admin/governance/ripple-inbox"

mkdir -p "$INBOX_DIR"

cp "$EVENT_PAYLOAD_FILE" "${INBOX_DIR}/ripple-${DISPATCH_ID}.json"

echo "Ripple inbox entry created: ${INBOX_DIR}/ripple-${DISPATCH_ID}.json"
```

**Expected ripple event structure** (for validation):
```json
{
  "event_type": "governance_ripple",
  "canonical_commit": "<sha>",
  "inventory_version": "<version>",
  "changed_paths": ["governance/canon/FILE.md"],
  "sender": "APGI-cmy/maturion-foreman-governance",
  "dispatch_id": "<uuid>",
  "timestamp": "<iso-8601>"
}
```

---

## Script 2 — Update Sync State on Ripple Receipt

Use during Phase 3.2 Step 3 (Update Sync State).

```bash
#!/bin/bash
# Update sync_state.json when a ripple event is received (before layer-down)
# Usage: update_sync_state_on_ripple <canonical_commit>

CANONICAL_COMMIT="$1"
SYNC_STATE=".agent-admin/governance/sync_state.json"

TIMESTAMP=$(date -u +%Y-%m-%dT%H:%M:%SZ)

jq --arg ts "$TIMESTAMP" \
   --arg commit "$CANONICAL_COMMIT" \
   '.last_ripple_received = $ts | .canonical_commit = $commit | .sync_pending = true' \
   "$SYNC_STATE" > "${SYNC_STATE}.tmp" && mv "${SYNC_STATE}.tmp" "$SYNC_STATE"

echo "Sync state updated (ripple received): $TIMESTAMP | commit=$CANONICAL_COMMIT"
```

---

## Script 3 — Archive Processed Ripple Event

Use during Phase 3.2 Step 5 (Archive Ripple Event) — after PR is merged.

```bash
#!/bin/bash
# Move a processed ripple event from inbox to archive
# Usage: archive_ripple_event <dispatch_id>

DISPATCH_ID="$1"
INBOX_DIR=".agent-admin/governance/ripple-inbox"
ARCHIVE_DIR=".agent-admin/governance/ripple-archive"

mkdir -p "$ARCHIVE_DIR"

INBOX_FILE="${INBOX_DIR}/ripple-${DISPATCH_ID}.json"

if [ ! -f "$INBOX_FILE" ]; then
  echo "ERROR: Ripple inbox file not found: $INBOX_FILE"
  exit 1
fi

mv "$INBOX_FILE" "${ARCHIVE_DIR}/ripple-${DISPATCH_ID}.json"

echo "Ripple event archived: ${ARCHIVE_DIR}/ripple-${DISPATCH_ID}.json"
```

---

*Authority: CS2 (Johan Ras) | LIVING_AGENT_SYSTEM.md v6.2.0*  
*Policy: governance/canon/CROSS_REPO_RIPPLE_TRANSPORT_PROTOCOL.md*  
*Created: 2026-02-25 | Status: ACTIVE*
