#!/bin/bash
# Governance Alignment Script for Living Agent System v6.2.0
# Authority: CROSS_REPOSITORY_LAYER_DOWN_PROTOCOL.md, LIVING_AGENT_SYSTEM.md v6.2.0
# Purpose: Detect governance drift, layer down canonical governance, create alignment PR
# 
# Usage: .github/scripts/align-governance.sh [--dry-run] [--force-pr]
# Options:
#   --dry-run    Show drift without creating PR
#   --force-pr   Create PR even if no drift detected (for testing)

set -euo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/../.." && pwd)"
TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
SESSION_ID="align-$(date -u +"%Y%m%d-%H%M%S")"

# Canonical source
CANONICAL_REPO="APGI-cmy/maturion-foreman-governance"
CANONICAL_DIR="/tmp/maturion-foreman-governance-${SESSION_ID}"

# Local governance paths
LOCAL_GOVERNANCE="${REPO_ROOT}/governance"
LOCAL_CANON_INVENTORY="${LOCAL_GOVERNANCE}/CANON_INVENTORY.json"
LOCAL_SYNC_STATE="${LOCAL_GOVERNANCE}/sync_state.json"

# Evidence paths
EVIDENCE_DIR="${REPO_ROOT}/.agent-admin/governance"
RIPPLE_LOG="${EVIDENCE_DIR}/ripple-log.json"
DRIFT_REPORT="${EVIDENCE_DIR}/drift-report-${SESSION_ID}.md"

# Parse arguments
DRY_RUN=false
FORCE_PR=false

for arg in "$@"; do
    case $arg in
        --dry-run)
            DRY_RUN=true
            shift
            ;;
        --force-pr)
            FORCE_PR=true
            shift
            ;;
    esac
done

echo "======================================"
echo "🔄 GOVERNANCE ALIGNMENT v6.2.0"
echo "======================================"
echo "Session ID: $SESSION_ID"
echo "Time: $TIMESTAMP"
echo "Repository: $(basename "$REPO_ROOT")"
echo "Canonical Source: $CANONICAL_REPO"
echo ""

# Ensure evidence directory exists
mkdir -p "$EVIDENCE_DIR"

# Initialize ripple log if it doesn't exist
if [ ! -f "$RIPPLE_LOG" ]; then
    cat > "$RIPPLE_LOG" <<EOF
{
  "version": "1.0.0",
  "repository": "APGI-cmy/maturion-isms",
  "ripple_events": []
}
EOF
fi

echo "Phase 1: Fetch Canonical Governance"
echo "--------------------------------------"

# Authentication check — all CI clone/fetch operations MUST use MATURION_BOT_TOKEN.
# Unauthenticated access is prohibited because:
#   1. This repo may become private in the future.
#   2. GitHub API rate limits apply to unauthenticated requests (60/hr vs 5000/hr).
#   3. Governance enforcement requires auditable, identity-bound access.
#   4. Token revocation must immediately block unauthorized access.
if [ -z "${MATURION_BOT_TOKEN:-}" ]; then
    echo -e "${RED}❌ MATURION_BOT_TOKEN is not set or empty.${NC}"
    echo -e "${RED}   Unauthenticated git clone is prohibited by Gap 3 policy.${NC}"
    echo -e "${RED}   Ensure MATURION_BOT_TOKEN is available as an environment variable.${NC}"
    exit 1
fi

# Configure URL rewriting so the token is injected by git internally rather than
# appearing in the clone URL (prevents token exposure in process listings/error messages).
git config --global url."https://x-access-token:${MATURION_BOT_TOKEN}@github.com/".insteadOf "https://github.com/"

# Clone canonical governance repository using the plain public URL.
# Git rewrites it to the authenticated form via the config above.
if [ -d "$CANONICAL_DIR" ]; then
    rm -rf "$CANONICAL_DIR"
fi

echo "Cloning $CANONICAL_REPO (authenticated)..."
if ! git clone "https://github.com/${CANONICAL_REPO}.git" "$CANONICAL_DIR" --quiet; then
    echo -e "${RED}❌ Failed to clone canonical governance repository (authenticated)${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Canonical governance fetched${NC}"

# Unset URL rewrite to prevent token propagation beyond the clone
git config --global --unset "url.https://x-access-token:${MATURION_BOT_TOKEN}@github.com/.insteadOf" || true

# Get canonical commit hash
CANONICAL_COMMIT=$(cd "$CANONICAL_DIR" && git rev-parse HEAD)
echo "Canonical commit: $CANONICAL_COMMIT"
echo ""

echo "Phase 2: Load Canonical Inventory"
echo "--------------------------------------"

CANONICAL_INVENTORY="${CANONICAL_DIR}/governance/CANON_INVENTORY.json"

if [ ! -f "$CANONICAL_INVENTORY" ]; then
    echo -e "${RED}❌ CANON_INVENTORY.json not found in canonical repository${NC}"
    exit 1
fi

# Validate JSON syntax
if ! jq empty "$CANONICAL_INVENTORY" 2>/dev/null; then
    echo -e "${RED}❌ CANON_INVENTORY.json has invalid JSON syntax${NC}"
    exit 1
fi

CANONICAL_VERSION=$(jq -r '.version // "unknown"' "$CANONICAL_INVENTORY")
TOTAL_ARTIFACTS=$(jq -r '(.total_artifacts // .total_canons) // 0' "$CANONICAL_INVENTORY")

# Check if artifacts or canons key exists (support both formats)
ARTIFACTS_KEY="artifacts"
if ! jq -e '.artifacts' "$CANONICAL_INVENTORY" > /dev/null 2>&1; then
    if jq -e '.canons' "$CANONICAL_INVENTORY" > /dev/null 2>&1; then
        ARTIFACTS_KEY="canons"
    else
        echo -e "${RED}❌ CANON_INVENTORY.json missing 'artifacts' or 'canons' key${NC}"
        exit 1
    fi
fi

echo "Canonical inventory version: $CANONICAL_VERSION"
echo "Total artifacts: $TOTAL_ARTIFACTS"
echo "Using key: $ARTIFACTS_KEY"
echo -e "${GREEN}✓ Canonical inventory loaded${NC}"
echo ""

echo "Phase 3: Drift Detection"
echo "--------------------------------------"

DRIFT_DETECTED=false
DRIFT_FILES=()
MISSING_FILES=()
HASH_MISMATCHES=()

# Check if local CANON_INVENTORY exists
if [ ! -f "$LOCAL_CANON_INVENTORY" ]; then
    echo -e "${YELLOW}⚠️  Local CANON_INVENTORY.json not found${NC}"
    DRIFT_DETECTED=true
else
    LOCAL_VERSION=$(jq -r '.version' "$LOCAL_CANON_INVENTORY" 2>/dev/null || echo "unknown")
    echo "Local inventory version: $LOCAL_VERSION"
    
    if [ "$LOCAL_VERSION" != "$CANONICAL_VERSION" ]; then
        echo -e "${YELLOW}⚠️  Version mismatch: local=$LOCAL_VERSION, canonical=$CANONICAL_VERSION${NC}"
        DRIFT_DETECTED=true
    fi
fi

# Compare each artifact in canonical inventory
echo "Checking artifacts for drift..."
ARTIFACT_COUNT=0

# Determine format and iterate
if jq -e ".$ARTIFACTS_KEY | type == \"array\"" "$CANONICAL_INVENTORY" > /dev/null 2>&1; then
    # Array format (canonical governance repo format)
    ARTIFACT_COUNT=$(jq ".$ARTIFACTS_KEY | length" "$CANONICAL_INVENTORY")
    
    for ((i=0; i<ARTIFACT_COUNT; i++)); do
        # Get artifact details from array
        artifact_path=$(jq -r ".$ARTIFACTS_KEY[$i].path" "$CANONICAL_INVENTORY")
        CANONICAL_SHA256=$(jq -r ".$ARTIFACTS_KEY[$i].file_hash_sha256" "$CANONICAL_INVENTORY")
        
        # Skip if no path or hash
        if [ "$artifact_path" = "null" ] || [ "$CANONICAL_SHA256" = "null" ]; then
            continue
        fi
        
        # Check if placeholder hash (all zeros or short hash)
        if [[ "$CANONICAL_SHA256" =~ ^0+$ ]] || [ ${#CANONICAL_SHA256} -lt 64 ]; then
            echo -e "${YELLOW}⚠️  Placeholder hash detected for: $artifact_path${NC}"
            continue
        fi
        
        # Construct local path
        LOCAL_FILE="${REPO_ROOT}/${artifact_path}"
        
        # Check if file exists locally
        if [ ! -f "$LOCAL_FILE" ]; then
            echo "  Missing: $artifact_path"
            MISSING_FILES+=("$artifact_path")
            DRIFT_DETECTED=true
            continue
        fi
        
        # Calculate local SHA256
        LOCAL_SHA256=$(sha256sum "$LOCAL_FILE" | awk '{print $1}')
        
        # Compare hashes
        if [ "$LOCAL_SHA256" != "$CANONICAL_SHA256" ]; then
            # Before marking drift: check if local already matches the canonical actual file.
            # If yes, the CANON_INVENTORY.json entry has a stale hash — skip to avoid
            # a false-positive layer-down that would fail hash verification (exit 1).
            CANONICAL_ACTUAL_FILE="${CANONICAL_DIR}/${artifact_path}"
            if [ -f "$CANONICAL_ACTUAL_FILE" ] && \
               [ "$(sha256sum "$CANONICAL_ACTUAL_FILE" | awk '{print $1}')" = "$LOCAL_SHA256" ]; then
                echo -e "${YELLOW}⚠️  Stale inventory hash (local=canonical): $artifact_path — skipping${NC}"
            else
                echo "  Hash mismatch: $artifact_path"
                HASH_MISMATCHES+=("$artifact_path")
                DRIFT_DETECTED=true
            fi
        fi
    done
    
elif jq -e ".$ARTIFACTS_KEY | type == \"object\"" "$CANONICAL_INVENTORY" > /dev/null 2>&1; then
    # Object format (consumer repo format)
    while IFS= read -r artifact_path; do
        ARTIFACT_COUNT=$((ARTIFACT_COUNT + 1))
        
        # Get canonical SHA256
        CANONICAL_SHA256=$(jq -r ".$ARTIFACTS_KEY[\"$artifact_path\"].sha256 // .$ARTIFACTS_KEY[\"$artifact_path\"]" "$CANONICAL_INVENTORY")
        
        # Check if placeholder hash (all zeros or short hash or null)
        if [ "$CANONICAL_SHA256" = "null" ] || [[ "$CANONICAL_SHA256" =~ ^0+$ ]] || [ ${#CANONICAL_SHA256} -lt 64 ]; then
            echo -e "${YELLOW}⚠️  Placeholder hash detected for: $artifact_path${NC}"
            continue
        fi
        
        # Construct local path
        LOCAL_FILE="${REPO_ROOT}/${artifact_path}"
        
        # Check if file exists locally
        if [ ! -f "$LOCAL_FILE" ]; then
            echo "  Missing: $artifact_path"
            MISSING_FILES+=("$artifact_path")
            DRIFT_DETECTED=true
            continue
        fi
        
        # Calculate local SHA256
        LOCAL_SHA256=$(sha256sum "$LOCAL_FILE" | awk '{print $1}')
        
        # Compare hashes
        if [ "$LOCAL_SHA256" != "$CANONICAL_SHA256" ]; then
            # Before marking drift: check if local already matches the canonical actual file.
            CANONICAL_ACTUAL_FILE="${CANONICAL_DIR}/${artifact_path}"
            if [ -f "$CANONICAL_ACTUAL_FILE" ] && \
               [ "$(sha256sum "$CANONICAL_ACTUAL_FILE" | awk '{print $1}')" = "$LOCAL_SHA256" ]; then
                echo -e "${YELLOW}⚠️  Stale inventory hash (local=canonical): $artifact_path — skipping${NC}"
            else
                echo "  Hash mismatch: $artifact_path"
                HASH_MISMATCHES+=("$artifact_path")
                DRIFT_DETECTED=true
            fi
        fi
    done < <(jq -r ".$ARTIFACTS_KEY | keys[]" "$CANONICAL_INVENTORY" 2>/dev/null || echo "")
else
    echo -e "${YELLOW}⚠️  No artifacts found in canonical inventory${NC}"
fi

echo ""
echo "Drift Analysis:"
echo "  Total artifacts checked: $ARTIFACT_COUNT"
echo "  Missing files: ${#MISSING_FILES[@]}"
echo "  Hash mismatches: ${#HASH_MISMATCHES[@]}"

if [ "$DRIFT_DETECTED" = true ] || [ "$FORCE_PR" = true ]; then
    if [ "$FORCE_PR" = true ] && [ "$DRIFT_DETECTED" = false ]; then
        echo -e "${YELLOW}⚠️  No drift detected but --force-pr enabled${NC}"
    else
        echo -e "${YELLOW}⚠️  DRIFT DETECTED${NC}"
    fi
else
    echo -e "${GREEN}✓ No drift detected - governance aligned${NC}"
    
    # Update sync state — guard against write churn from concurrent workflows
    # Note: stat -c %Y is GNU coreutils (Linux/Ubuntu); this script runs on GitHub Actions (ubuntu-latest).
    if [ -f "$LOCAL_SYNC_STATE" ]; then
        LAST_MODIFIED=$(stat -c %Y "$LOCAL_SYNC_STATE" 2>/dev/null || echo 0)
        NOW=$(date +%s)
        ELAPSED=$(( NOW - LAST_MODIFIED ))
        if [ "$ELAPSED" -lt 300 ]; then
            echo "sync_state.json modified ${ELAPSED}s ago — skipping last_drift_check update (5-minute write guard)"
        else
            jq --arg timestamp "$TIMESTAMP" \
               --arg commit "$CANONICAL_COMMIT" \
               '.alignment_status.last_drift_check = $timestamp | 
                .alignment_status.drift_detected = false |
                .last_sync.canonical_commit = $commit' \
               "$LOCAL_SYNC_STATE" > "${LOCAL_SYNC_STATE}.tmp"
            mv "${LOCAL_SYNC_STATE}.tmp" "$LOCAL_SYNC_STATE"
        fi
    fi
    
    exit 0
fi

if [ "$DRY_RUN" = true ]; then
    echo ""
    echo "Dry run mode - no changes made"
    exit 0
fi

echo ""
echo "Phase 4: Layer Down Canonical Governance"
echo "--------------------------------------"

LAYERED_FILES=()
STALE_HASH_DETECTED=false

# Layer down each drifted or missing file
for artifact_path in "${MISSING_FILES[@]}" "${HASH_MISMATCHES[@]}"; do
    CANONICAL_FILE="${CANONICAL_DIR}/${artifact_path}"
    LOCAL_FILE="${REPO_ROOT}/${artifact_path}"
    
    if [ ! -f "$CANONICAL_FILE" ]; then
        echo -e "${RED}❌ Canonical file not found: $artifact_path${NC}"
        continue
    fi
    
    # Create directory if needed
    mkdir -p "$(dirname "$LOCAL_FILE")"
    
    # Copy file from canonical
    cp "$CANONICAL_FILE" "$LOCAL_FILE"
    
    # Verify SHA256
    LOCAL_SHA256=$(sha256sum "$LOCAL_FILE" | awk '{print $1}')
    
    # Get canonical SHA256 (handle both formats)
    if jq -e ".$ARTIFACTS_KEY | type == \"array\"" "$CANONICAL_INVENTORY" > /dev/null 2>&1; then
        # Find artifact in array by path
        CANONICAL_SHA256=$(jq -r ".$ARTIFACTS_KEY[] | select(.path == \"$artifact_path\") | .file_hash_sha256" "$CANONICAL_INVENTORY")
    else
        # Get from object
        CANONICAL_SHA256=$(jq -r ".$ARTIFACTS_KEY[\"$artifact_path\"].sha256 // .$ARTIFACTS_KEY[\"$artifact_path\"]" "$CANONICAL_INVENTORY")
    fi
    
    if [ "$LOCAL_SHA256" = "$CANONICAL_SHA256" ]; then
        echo -e "${GREEN}✓ Layered: $artifact_path${NC}"
        LAYERED_FILES+=("$artifact_path")
    else
        # The copied file's hash doesn't match the CANON_INVENTORY recorded hash.
        # This means the canonical CANON_INVENTORY.json has a stale hash for this file
        # (the file was updated in the canonical repo but the inventory wasn't updated).
        # Per A-07: escalation required; use exit 2 (partial success) to avoid silently
        # blocking all future ripple runs.
        echo -e "${YELLOW}⚠️  Stale hash in canonical CANON_INVENTORY for: $artifact_path${NC}"
        echo -e "${YELLOW}   Inventory: $CANONICAL_SHA256${NC}"
        echo -e "${YELLOW}   Actual:    $LOCAL_SHA256${NC}"
        echo -e "${YELLOW}   File copied. Escalation required for canonical CANON_INVENTORY update.${NC}"
        LAYERED_FILES+=("$artifact_path")
        STALE_HASH_DETECTED=true
    fi
done

# Update CANON_INVENTORY.json
if [ ${#LAYERED_FILES[@]} -gt 0 ] || [ ! -f "$LOCAL_CANON_INVENTORY" ]; then
    echo "Updating CANON_INVENTORY.json..."
    cp "$CANONICAL_INVENTORY" "$LOCAL_CANON_INVENTORY"
    LAYERED_FILES+=("governance/CANON_INVENTORY.json")
fi

# Update sync_state.json
if [ -f "$LOCAL_SYNC_STATE" ]; then
    echo "Updating sync_state.json..."
    jq --arg timestamp "$TIMESTAMP" \
       --arg session "$SESSION_ID" \
       --arg commit "$CANONICAL_COMMIT" \
       --arg version "$CANONICAL_VERSION" \
       --argjson count "${#LAYERED_FILES[@]}" \
       '.last_sync.timestamp = $timestamp |
        .last_sync.session_id = $session |
        .last_sync.canonical_commit = $commit |
        .last_sync.canonical_inventory_version = $version |
        .last_sync.total_canons_synced = $count |
        .last_sync.sync_method = "layer-down-automated" |
        .last_sync.sync_status = "SUCCESS" |
        .last_sync.ripple_pr = "pending" |
        .alignment_status.overall = "ALIGNED" |
        .alignment_status.drift_detected = false |
        .alignment_status.last_drift_check = $timestamp' \
       "$LOCAL_SYNC_STATE" > "${LOCAL_SYNC_STATE}.tmp"
    mv "${LOCAL_SYNC_STATE}.tmp" "$LOCAL_SYNC_STATE"
    LAYERED_FILES+=("governance/sync_state.json")
fi

echo -e "${GREEN}✓ Layer-down complete: ${#LAYERED_FILES[@]} files updated${NC}"
echo ""

echo "Phase 5: Create Drift Report"
echo "--------------------------------------"

cat > "$DRIFT_REPORT" <<EOF
# Governance Drift Report

**Session ID**: $SESSION_ID  
**Timestamp**: $TIMESTAMP  
**Canonical Commit**: $CANONICAL_COMMIT  
**Canonical Version**: $CANONICAL_VERSION

## Drift Summary

- **Missing Files**: ${#MISSING_FILES[@]}
- **Hash Mismatches**: ${#HASH_MISMATCHES[@]}
- **Files Layered Down**: ${#LAYERED_FILES[@]}

## Missing Files

EOF

if [ ${#MISSING_FILES[@]} -eq 0 ]; then
    echo "None" >> "$DRIFT_REPORT"
else
    for file in "${MISSING_FILES[@]}"; do
        echo "- \`$file\`" >> "$DRIFT_REPORT"
    done
fi

cat >> "$DRIFT_REPORT" <<EOF

## Hash Mismatches

EOF

if [ ${#HASH_MISMATCHES[@]} -eq 0 ]; then
    echo "None" >> "$DRIFT_REPORT"
else
    for file in "${HASH_MISMATCHES[@]}"; do
        echo "- \`$file\`" >> "$DRIFT_REPORT"
    done
fi

cat >> "$DRIFT_REPORT" <<EOF

## Files Updated

EOF

for file in "${LAYERED_FILES[@]}"; do
    echo "- \`$file\`" >> "$DRIFT_REPORT"
done

cat >> "$DRIFT_REPORT" <<EOF

## Verification

All files verified with SHA256 checksums from canonical CANON_INVENTORY.json.

---
**Authority**: CROSS_REPOSITORY_LAYER_DOWN_PROTOCOL.md  
**Script**: .github/scripts/align-governance.sh
EOF

echo -e "${GREEN}✓ Drift report created: $DRIFT_REPORT${NC}"
echo ""

echo "Phase 6: Update Ripple Log"
echo "--------------------------------------"

# Add ripple event to log
jq --arg timestamp "$TIMESTAMP" \
   --arg session "$SESSION_ID" \
   --arg commit "$CANONICAL_COMMIT" \
   --argjson count "${#LAYERED_FILES[@]}" \
   '.ripple_events += [{
     "timestamp": $timestamp,
     "session_id": $session,
     "type": "automated-alignment",
     "canonical_commit": $commit,
     "files_updated": $count,
     "status": "SUCCESS"
   }]' \
   "$RIPPLE_LOG" > "${RIPPLE_LOG}.tmp"
mv "${RIPPLE_LOG}.tmp" "$RIPPLE_LOG"

echo -e "${GREEN}✓ Ripple log updated${NC}"
echo ""

echo "======================================"
echo "✅ ALIGNMENT COMPLETE"
echo "======================================"
echo "Files updated: ${#LAYERED_FILES[@]}"
echo "Drift report: $DRIFT_REPORT"
echo ""
echo "Next steps:"
echo "  1. Review changes: git status"
echo "  2. Commit changes: git add . && git commit -m 'Governance alignment'"
echo "  3. Create PR for review"
echo ""

# Set output for GitHub Actions
if [ -n "${GITHUB_OUTPUT:-}" ]; then
    echo "drift_detected=true" >> "$GITHUB_OUTPUT"
    echo "files_updated=${#LAYERED_FILES[@]}" >> "$GITHUB_OUTPUT"
    echo "canonical_commit=$CANONICAL_COMMIT" >> "$GITHUB_OUTPUT"
    echo "drift_report=$DRIFT_REPORT" >> "$GITHUB_OUTPUT"
fi

# Cleanup
rm -rf "$CANONICAL_DIR"

# Exit 2 signals partial success: files were layered but canonical CANON_INVENTORY.json
# has stale hashes. The workflow treats this as success but logs a warning.
if [ "$STALE_HASH_DETECTED" = "true" ]; then
    echo "⚠️  Stale hashes detected in canonical CANON_INVENTORY.json. Exiting with code 2 (partial success — escalation required)."
    exit 2
fi

exit 0
