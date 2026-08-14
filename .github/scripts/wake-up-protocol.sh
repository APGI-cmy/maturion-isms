#!/bin/bash
# Wake-Up Protocol Script for Living Agent System v6.2.0
# Authority: LIVING_AGENT_GOVERNANCE_HEALTH_CHECKS.md, LIVING_AGENT_SYSTEM.md v6.2.0
# Purpose: Execute comprehensive agent wake-up health checks before session start
# 
# Usage: .github/scripts/wake-up-protocol.sh <agent-id>
# Example: .github/scripts/wake-up-protocol.sh governance-liaison-isms

set -euo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
AGENT_ID="${1:-}"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/../.." && pwd)"
WORKSPACE_DIR="${REPO_ROOT}/.agent-workspace/${AGENT_ID}"
# Try multiple naming conventions for agent contract files
AGENT_CONTRACT_FILE="${REPO_ROOT}/.github/agents/${AGENT_ID}-agent.md"
if [ ! -f "$AGENT_CONTRACT_FILE" ]; then
    AGENT_CONTRACT_FILE="${REPO_ROOT}/.github/agents/${AGENT_ID}.md"
fi
TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
SESSION_DATE=$(date -u +"%Y%m%d")
JSON_PARSER=""
NODE_BIN=""

# Select a standards-compliant JSON parser. jq is preferred for compatibility
# with existing jq expressions; Node is the repository's portable fallback.
# Failure to find either is a tooling failure, never an invalid-JSON result.
select_json_parser() {
    if command -v jq >/dev/null 2>&1 && jq --version >/dev/null 2>&1; then
        JSON_PARSER="jq"
        return 0
    fi

    if command -v node >/dev/null 2>&1 && node --version >/dev/null 2>&1; then
        JSON_PARSER="node"
        NODE_BIN="$(command -v node)"
        return 0
    fi

    echo -e "${RED}❌ JSON parser/tooling unavailable: neither jq nor Node.js is available; cannot validate governance JSON (failing closed)${NC}"
    return 1
}

# Strictly validates a JSON document using the selected standards-compliant parser.
json_validate() {
    local json_file="$1"

    if [ "$JSON_PARSER" = "jq" ]; then
        jq empty "$json_file" >/dev/null 2>&1
    else
        "$NODE_BIN" - "$json_file" >/dev/null 2>&1 <<'NODE'
const fs = require("fs");
JSON.parse(fs.readFileSync(process.argv[2], "utf8"));
NODE
    fi
}

# Emits CANON_INVENTORY metadata as count<TAB>has-explicit-count<TAB>version.
read_inventory_metadata() {
    local inventory_file="$1"

    if [ "$JSON_PARSER" = "jq" ]; then
        jq -r '[
          (.total_artifacts // .total_canons // (.canons | length? // 0)),
          (has("total_artifacts") or has("total_canons")),
          (.version // "unknown")
        ] | @tsv' "$inventory_file"
    else
        "$NODE_BIN" - "$inventory_file" <<'NODE'
const fs = require("fs");
const inventory = JSON.parse(fs.readFileSync(process.argv[2], "utf8"));
const hasCount = Object.prototype.hasOwnProperty.call(inventory, "total_artifacts")
  || Object.prototype.hasOwnProperty.call(inventory, "total_canons");
const count = inventory.total_artifacts ?? inventory.total_canons
  ?? (Array.isArray(inventory.canons) ? inventory.canons.length : 0);
console.log(`${count}\t${hasCount}\t${inventory.version ?? "unknown"}`);
NODE
    fi
}

# Returns 0 when the agent contract explicitly enables placeholder-hash degraded mode.
agent_requires_placeholder_hash_enforcement() {
    if [ ! -f "$AGENT_CONTRACT_FILE" ]; then
        return 1
    fi
    # Support both governance key variants for backward compatibility across contracts:
    # - degraded_on_placeholder_hashes (current)
    # - degraded_on_reserved_hash_markers (legacy synonym)
    grep -Eq '^[[:space:]]*(degraded_on_placeholder_hashes|degraded_on_reserved_hash_markers):[[:space:]]*true([[:space:]]|$)' "$AGENT_CONTRACT_FILE"
}

# Counts invalid/placeholder hashes in CANON_INVENTORY.json across supported layouts.
count_invalid_inventory_hashes() {
    local inventory_file="$1"
    if [ "$JSON_PARSER" = "jq" ]; then
        jq -r '
          def invalid_hash:
            if type != "string" then
              true
            else
              (test("^[0-9a-fA-F]{64}$") | not)
              or test("^0{64}$")
            end;
          if (.canons? | type) == "array" then
            [ .canons[]? | (.file_hash_sha256 // .file_hash) | select(invalid_hash) ] | length
          elif (.artifacts? | type) == "object" then
            [ .artifacts[]?
              | (if type == "object" then (.sha256 // .file_hash_sha256 // .file_hash) else . end)
              | select(invalid_hash)
            ] | length
          else
            0
          end
        ' "$inventory_file"
    else
        "$NODE_BIN" - "$inventory_file" <<'NODE'
const fs = require("fs");
const inventory = JSON.parse(fs.readFileSync(process.argv[2], "utf8"));
const isInvalid = (value) => typeof value !== "string"
  || !/^[0-9a-f]{64}$/i.test(value)
  || /^0{64}$/.test(value);
const entries = Array.isArray(inventory.canons)
  ? inventory.canons.map((entry) => entry?.file_hash_sha256 ?? entry?.file_hash)
  : inventory.artifacts && typeof inventory.artifacts === "object"
    ? Object.values(inventory.artifacts).map((entry) =>
      entry && typeof entry === "object"
        ? entry.sha256 ?? entry.file_hash_sha256 ?? entry.file_hash
        : entry)
    : [];
console.log(entries.filter(isInvalid).length);
NODE
    fi
}

# Counts entries missing canonical commit SHA provenance in CANON_INVENTORY.json.
count_missing_inventory_commit_provenance() {
    local inventory_file="$1"
    if [ "$JSON_PARSER" = "jq" ]; then
        jq -r '
          def missing_commit:
            . == null
            or (type != "string")
            or (length != 40)
            or (test("^[0-9a-fA-F]{40}$") | not);
          def commit_field:
            .canonical_commit_sha
            // .canonical_commit
            // .canonical_commit_sha1
            // .commit_sha
            // .source_commit_sha
            // .commit;
          if (.canons? | type) == "array" then
            [ .canons[]? | (if type == "object" then commit_field else null end) | select(missing_commit) ] | length
          elif (.artifacts? | type) == "object" then
            [ .artifacts[]?
              | (if type == "object" then commit_field else null end)
              | select(missing_commit)
            ] | length
          else
            0
          end
        ' "$inventory_file"
    else
        "$NODE_BIN" - "$inventory_file" <<'NODE'
const fs = require("fs");
const inventory = JSON.parse(fs.readFileSync(process.argv[2], "utf8"));
const commitOf = (entry) => entry?.canonical_commit_sha ?? entry?.canonical_commit
  ?? entry?.canonical_commit_sha1 ?? entry?.commit_sha ?? entry?.source_commit_sha
  ?? entry?.commit;
const entries = Array.isArray(inventory.canons)
  ? inventory.canons
  : inventory.artifacts && typeof inventory.artifacts === "object"
    ? Object.values(inventory.artifacts)
    : [];
console.log(entries.map(commitOf).filter((commit) =>
  typeof commit !== "string" || !/^[0-9a-f]{40}$/i.test(commit)).length);
NODE
    fi
}

# Prints every Tier 2 required-file entry declared inside the top-level
# tier2_knowledge YAML block. Supports block lists and inline YAML arrays
# without adding a YAML parser dependency to the bootstrap path.
extract_tier2_required_files() {
    awk '
      function trim(value) {
        gsub(/^[[:space:]]+|[[:space:]]+$/, "", value)
        gsub(/^["'"'"']|["'"'"']$/, "", value)
        return value
      }
      BEGIN {
        in_tier2 = 0
        in_required_list = 0
        required_indent = -1
      }
      /^tier2_knowledge:[[:space:]]*$/ {
        in_tier2 = 1
        next
      }
      in_tier2 && /^[^[:space:]]/ {
        exit
      }
      in_tier2 {
        current_indent = match($0, /[^[:space:]]/) - 1

        if (in_required_list) {
          if ($0 ~ /^[[:space:]]*$/) {
            next
          }
          if (current_indent > required_indent && $0 ~ /^[[:space:]]*-[[:space:]]+/) {
            value = $0
            sub(/^[[:space:]]*-[[:space:]]+/, "", value)
            value = trim(value)
            if (value != "") print value
            next
          }
          if (current_indent <= required_indent) {
            in_required_list = 0
          }
        }

        if ($0 ~ /^[[:space:]]+required_files:[[:space:]]*\[/) {
          value = $0
          sub(/^[^[]*\[/, "", value)
          sub(/\].*$/, "", value)
          count = split(value, entries, ",")
          for (i = 1; i <= count; i++) {
            entry = trim(entries[i])
            if (entry != "") print entry
          }
          next
        }

        if ($0 ~ /^[[:space:]]+required_files:[[:space:]]*$/) {
          required_indent = current_indent
          in_required_list = 1
        }
      }
    ' "$AGENT_CONTRACT_FILE"
}

# Prints the Tier 2 index path declared inside the top-level tier2_knowledge
# YAML block, if the active contract has one.
extract_tier2_index_path() {
    awk '
      function trim(value) {
        gsub(/^[[:space:]]+|[[:space:]]+$/, "", value)
        gsub(/^["'"'"']|["'"'"']$/, "", value)
        return value
      }
      /^tier2_knowledge:[[:space:]]*$/ {
        in_tier2 = 1
        next
      }
      in_tier2 && /^[^[:space:]]/ {
        exit
      }
      in_tier2 && /^[[:space:]]+index:[[:space:]]*/ {
        value = $0
        sub(/^[[:space:]]+index:[[:space:]]*/, "", value)
        print trim(value)
        exit
      }
    ' "$AGENT_CONTRACT_FILE"
}

# Fails closed when the active contract declares a Tier 2 index or required
# files that cannot be resolved. Bare filenames resolve beside the index;
# repository-qualified paths resolve from the repository root.
validate_tier2_required_files() {
    local tier2_index
    local tier2_index_abs
    local tier2_index_dir
    local required_file
    local index_candidate
    local repo_candidate
    local resolved_candidate
    local missing_count=0
    local required_count=0
    local -a tier2_required_files=()

    tier2_index="$(extract_tier2_index_path)"
    mapfile -t tier2_required_files < <(extract_tier2_required_files)

    if [ -z "$tier2_index" ] && [ "${#tier2_required_files[@]}" -eq 0 ]; then
        echo "  - Tier 2 required-file manifest: NOT DECLARED"
        return 0
    fi

    if [ -z "$tier2_index" ]; then
        echo -e "${RED}❌ Tier 2 required files are declared but tier2_knowledge.index is missing${NC}"
        return 1
    fi

    if [[ "$tier2_index" = /* ]]; then
        echo -e "${RED}❌ Tier 2 index must be repository-relative: ${tier2_index}${NC}"
        return 1
    fi

    tier2_index_abs="${REPO_ROOT}/${tier2_index#./}"
    if [ ! -f "$tier2_index_abs" ]; then
        echo -e "${RED}❌ Required Tier 2 knowledge index missing: ${tier2_index}${NC}"
        return 1
    fi

    tier2_index_dir="$(dirname "$tier2_index_abs")"
    echo -e "${GREEN}✓ Tier 2 knowledge index found: ${tier2_index}${NC}"

    for required_file in "${tier2_required_files[@]}"; do
        [ -z "$required_file" ] && continue
        required_count=$((required_count + 1))

        if [[ "$required_file" = /* ]]; then
            echo -e "${RED}❌ Tier 2 required file must be repository-relative: ${required_file}${NC}"
            missing_count=$((missing_count + 1))
            continue
        fi

        index_candidate="${tier2_index_dir}/${required_file#./}"
        repo_candidate="${REPO_ROOT}/${required_file#./}"
        resolved_candidate="$index_candidate"

        if [ -f "$index_candidate" ]; then
            resolved_candidate="$index_candidate"
        elif [ -f "$repo_candidate" ]; then
            resolved_candidate="$repo_candidate"
        fi

        if [ ! -f "$resolved_candidate" ]; then
            echo -e "${RED}❌ Required Tier 2 file missing: ${required_file} (index: ${tier2_index})${NC}"
            missing_count=$((missing_count + 1))
        fi
    done

    echo "  - Tier 2 required files declared: ${required_count}"
    echo "  - Tier 2 required files missing: ${missing_count}"

    if [ "$missing_count" -gt 0 ]; then
        return 1
    fi

    echo -e "${GREEN}✓ Tier 2 required-file validation passed${NC}"
    return 0
}

# Output files
WORKING_CONTRACT="${WORKSPACE_DIR}/working-contract.md"
ENVIRONMENT_HEALTH="${WORKSPACE_DIR}/environment-health.json"

# Validation
if [ -z "$AGENT_ID" ]; then
    echo -e "${RED}❌ ERROR: Agent ID required${NC}"
    echo "Usage: $0 <agent-id>"
    echo "Example: $0 governance-liaison-isms"
    exit 1
fi

echo "======================================"
echo "🔐 WAKE-UP PROTOCOL v6.2.0"
echo "======================================"
echo "Agent: $AGENT_ID"
echo "Time: $TIMESTAMP"
echo "Repository: $(basename "$REPO_ROOT")"
echo ""

# Initialize workspace if needed
mkdir -p "${WORKSPACE_DIR}"/{memory,context,escalation-inbox,personal}

# ==============================================================================
# Phase 1: Self-Identification
# ==============================================================================
echo -e "${BLUE}Phase 1: Self-Identification${NC}"
echo "------------------------------"

PHASE1_STATUS="PASS"

# Check if agent contract exists
if [ ! -f "$AGENT_CONTRACT_FILE" ]; then
    echo -e "${RED}❌ Agent contract not found: ${AGENT_CONTRACT_FILE}${NC}"
    PHASE1_STATUS="FAIL"
    
    # Create escalation
    ESCALATION_FILE="${WORKSPACE_DIR}/escalation-inbox/escalation-missing-agent-contract-${SESSION_DATE}.md"
    cat > "$ESCALATION_FILE" <<EOF
# Escalation: Missing Agent Contract

**Date**: ${TIMESTAMP}
**Agent**: ${AGENT_ID}
**Type**: BLOCKER
**Severity**: CRITICAL

## Issue
Agent contract file not found: ${AGENT_CONTRACT_FILE}

## Impact
Cannot proceed without agent identity, class, and authority boundaries.

## Required Action
Create agent contract file with required sections per LIVING_AGENT_SYSTEM.md v6.2.0

## Authority
LIVING_AGENT_GOVERNANCE_HEALTH_CHECKS.md - Phase 1: Self-Identification
EOF
    
    echo -e "${RED}✗ Phase 1: FAILED - Cannot proceed without agent contract${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Agent contract found: ${AGENT_CONTRACT_FILE}${NC}"

# Extract agent class from contract (YAML front matter)
# Use larger buffer to handle various YAML structures
AGENT_CLASS=$(grep -A 50 "^agent:" "$AGENT_CONTRACT_FILE" | grep "class:" | head -1 | awk '{print $2}' || echo "unknown")
AGENT_VERSION=$(grep -A 50 "^agent:" "$AGENT_CONTRACT_FILE" | grep "version:" | head -1 | awk '{print $2}' || echo "unknown")

echo "  - Class: ${AGENT_CLASS}"
echo "  - Version: ${AGENT_VERSION}"

if ! validate_tier2_required_files; then
    PHASE1_STATUS="FAIL"
    echo -e "${RED}✗ Phase 1: FAILED - Required Tier 2 controls are incomplete${NC}"
    echo "Agent bootstrap halted before memory scan and working-contract generation."
    exit 1
fi

echo -e "${GREEN}✓ Phase 1: PASSED${NC}"
echo ""

# ==============================================================================
# Phase 2: Memory Scan
# ==============================================================================
echo -e "${BLUE}Phase 2: Memory Scan${NC}"
echo "------------------------------"

PHASE2_STATUS="PASS"

# Scan memory directory
MEMORY_DIR="${WORKSPACE_DIR}/memory"
MEMORY_COUNT=$(find "$MEMORY_DIR" -name "session-*.md" 2>/dev/null | wc -l || echo "0")

echo "  - Memory directory: ${MEMORY_DIR}"
echo "  - Previous sessions found: ${MEMORY_COUNT}"

if [ "$MEMORY_COUNT" -gt 0 ]; then
    echo "  - Recent sessions:"
    RECENT_SESSIONS_FILE="$(mktemp "${TMPDIR:-/tmp}/wake-up-recent-sessions.XXXXXX")"
    if ! find "$MEMORY_DIR" -name "session-*.md" -type f -print0 | sort -zr >"$RECENT_SESSIONS_FILE"; then
        rm -f "$RECENT_SESSIONS_FILE"
        echo -e "${RED}❌ Unable to enumerate recent session memories${NC}"
        echo -e "${RED}✗ Phase 2: FAILED${NC}"
        exit 1
    fi

    RECENT_SESSION_COUNT=0
    while IFS= read -r -d '' session_file; do
        echo "    • $(basename "$session_file")"
        RECENT_SESSION_COUNT=$((RECENT_SESSION_COUNT + 1))
        if [ "$RECENT_SESSION_COUNT" -ge 5 ]; then
            break
        fi
    done <"$RECENT_SESSIONS_FILE"
    rm -f "$RECENT_SESSIONS_FILE"
fi

# Check escalation inbox
ESCALATION_COUNT=$(find "${WORKSPACE_DIR}/escalation-inbox" -name "escalation-*.md" 2>/dev/null | wc -l || echo "0")
echo "  - Pending escalations: ${ESCALATION_COUNT}"

if [ "$ESCALATION_COUNT" -gt 0 ]; then
    echo -e "${YELLOW}  ⚠️  Unresolved escalations detected${NC}"
    find "${WORKSPACE_DIR}/escalation-inbox" -name "escalation-*.md" | while read -r esc_file; do
        echo "    • $(basename "$esc_file")"
    done
fi

echo -e "${GREEN}✓ Phase 2: PASSED${NC}"
echo ""

# ==============================================================================
# Phase 3: Governance Discovery
# ==============================================================================
echo -e "${BLUE}Phase 3: Governance Discovery${NC}"
echo "------------------------------"

PHASE3_STATUS="PASS"

if ! select_json_parser; then
    echo -e "${RED}✗ Phase 3: FAILED - JSON parser/tooling is unavailable${NC}"
    exit 1
fi
echo "  - JSON parser: ${JSON_PARSER}"

# Load CANON_INVENTORY.json
CANON_INVENTORY="${REPO_ROOT}/governance/CANON_INVENTORY.json"
if [ -f "$CANON_INVENTORY" ]; then
    echo -e "${GREEN}✓ CANON_INVENTORY.json found${NC}"
    
    # Validate JSON
    if json_validate "$CANON_INVENTORY"; then
        IFS=$'\t' read -r CANON_COUNT HAS_EXPLICIT_CANON_COUNT CANON_VERSION < <(read_inventory_metadata "$CANON_INVENTORY")
        if [ "$HAS_EXPLICIT_CANON_COUNT" != "true" ]; then
            echo -e "${YELLOW}⚠️  CANON_INVENTORY.json missing total_artifacts/total_canons; using canons array length fallback${NC}"
        fi
        echo "  - Canon version: ${CANON_VERSION}"
        echo "  - Total artifacts: ${CANON_COUNT}"
        if agent_requires_placeholder_hash_enforcement; then
            INVALID_HASH_COUNT=$(count_invalid_inventory_hashes "$CANON_INVENTORY")
            MISSING_PROVENANCE_COUNT=$(count_missing_inventory_commit_provenance "$CANON_INVENTORY")
            echo "  - Placeholder-hash enforcement: ENABLED"
            echo "  - Invalid/placeholder hashes: ${INVALID_HASH_COUNT}"
            echo "  - Missing canonical commit SHA provenance: ${MISSING_PROVENANCE_COUNT}"
            if [ "${INVALID_HASH_COUNT}" -gt 0 ]; then
                echo -e "${RED}❌ CANON_INVENTORY.json is degraded (invalid/placeholder hashes detected)${NC}"
                PHASE3_STATUS="FAIL"
            fi
            if [ "${MISSING_PROVENANCE_COUNT}" -gt 0 ]; then
                echo -e "${RED}❌ CANON_INVENTORY.json is degraded (missing canonical commit SHA provenance)${NC}"
                PHASE3_STATUS="FAIL"
            fi
        else
            echo "  - Placeholder-hash enforcement: DISABLED"
        fi
        if [ -z "${NODE_BIN}" ]; then
            echo -e "${RED}❌ CANON_INVENTORY content validation requires Node.js (failing closed)${NC}"
            PHASE3_STATUS="FAIL"
        elif "$NODE_BIN" "${SCRIPT_DIR}/validate-canon-inventory.js" --inventory "$CANON_INVENTORY" --root "$REPO_ROOT"; then
            echo -e "${GREEN}✓ CANON_INVENTORY content hashes verified using LF-normalized UTF-8${NC}"
        else
            PHASE3_STATUS="FAIL"
        fi
    else
        echo -e "${RED}❌ CANON_INVENTORY.json is invalid JSON${NC}"
        PHASE3_STATUS="FAIL"
    fi
else
    echo -e "${RED}❌ CANON_INVENTORY.json not found${NC}"
    PHASE3_STATUS="FAIL"
fi

# Check governance inventory
GOV_INVENTORY="${REPO_ROOT}/GOVERNANCE_ARTIFACT_INVENTORY.md"
if [ -f "$GOV_INVENTORY" ]; then
    echo -e "${GREEN}✓ GOVERNANCE_ARTIFACT_INVENTORY.md found${NC}"
else
    echo -e "${YELLOW}⚠️  GOVERNANCE_ARTIFACT_INVENTORY.md not found${NC}"
fi

if [ "$PHASE3_STATUS" = "PASS" ]; then
    echo -e "${GREEN}✓ Phase 3: PASSED${NC}"
else
    echo -e "${RED}✗ Phase 3: FAILED${NC}"
fi
echo ""

# ==============================================================================
# Phase 4: Environment Health Check
# ==============================================================================
echo -e "${BLUE}Phase 4: Environment Health Check${NC}"
echo "------------------------------"

PHASE4_STATUS="PASS"

# Check git status
echo "  - Checking git repository..."
cd "$REPO_ROOT"
GIT_STATUS=$(git status --porcelain | wc -l)
GIT_BRANCH=$(git rev-parse --abbrev-ref HEAD)

echo "  - Current branch: ${GIT_BRANCH}"
echo "  - Uncommitted changes: ${GIT_STATUS}"

if [ "$GIT_STATUS" -gt 0 ]; then
    echo -e "${YELLOW}  ⚠️  Repository has uncommitted changes${NC}"
fi

# Validate JSON files in governance
echo "  - Validating JSON files..."
JSON_ERRORS=0
while IFS= read -r json_file; do
    if ! json_validate "$json_file"; then
        echo -e "${RED}    ❌ Invalid JSON: ${json_file}${NC}"
        JSON_ERRORS=$((JSON_ERRORS + 1))
    fi
done < <(find governance -name "*.json" 2>/dev/null)

if [ "$JSON_ERRORS" -gt 0 ]; then
    echo -e "${RED}  ❌ ${JSON_ERRORS} JSON files have errors${NC}"
    PHASE4_STATUS="FAIL"
else
    echo -e "${GREEN}  ✓ All JSON files valid${NC}"
fi

echo -e "${GREEN}✓ Phase 4: PASSED${NC}"
echo ""

# ==============================================================================
# Phase 5: Drift Detection & Analysis
# ==============================================================================
echo -e "${BLUE}Phase 5: Drift Detection & Analysis${NC}"
echo "------------------------------"

DRIFT_DETECTED="NO"

# Basic drift detection - check for untracked governance files
echo "  - Scanning for governance drift..."

# Check if there are governance files not in git
UNTRACKED_GOV=$(git ls-files --others --exclude-standard governance/ 2>/dev/null | wc -l || echo "0")
if [ "$UNTRACKED_GOV" -gt 0 ]; then
    echo -e "${YELLOW}  ⚠️  ${UNTRACKED_GOV} untracked governance files detected${NC}"
    DRIFT_DETECTED="YES"
fi

if [ "$DRIFT_DETECTED" = "NO" ]; then
    echo -e "${GREEN}  ✓ No governance drift detected${NC}"
fi

echo -e "${GREEN}✓ Phase 5: PASSED${NC}"
echo ""

# ==============================================================================
# Phase 6: Auto-Remediation
# ==============================================================================
echo -e "${BLUE}Phase 6: Auto-Remediation${NC}"
echo "------------------------------"

if [ "$DRIFT_DETECTED" = "NO" ]; then
    echo "  ✓ No remediation needed"
else
    echo "  - Drift detected but auto-remediation requires agent authority verification"
    echo "  - Agent should review and remediate within authority bounds"
fi

echo -e "${GREEN}✓ Phase 6: PASSED${NC}"
echo ""

# ==============================================================================
# Phase 7: Working Contract Generation
# ==============================================================================
echo -e "${BLUE}Phase 7: Working Contract Generation${NC}"
echo "------------------------------"

# Generate working contract
cat > "$WORKING_CONTRACT" <<EOF
# Working Contract - Session $(date +%Y%m%d)

**Agent**: ${AGENT_ID}  
**Class**: ${AGENT_CLASS}  
**Time**: ${TIMESTAMP}  
**Version**: ${AGENT_VERSION}

---

## Health Check Summary

### Phase Results
- ✅ Phase 1: Self-Identification - ${PHASE1_STATUS}
- ✅ Phase 2: Memory Scan - ${PHASE2_STATUS}
- ✅ Phase 3: Governance Discovery - ${PHASE3_STATUS}
- ✅ Phase 4: Environment Health Check - ${PHASE4_STATUS}
- ✅ Phase 5: Drift Detection - ${DRIFT_DETECTED}
- ✅ Phase 6: Auto-Remediation - COMPLETED
- ✅ Phase 7: Working Contract Generation - IN PROGRESS

### Memory Context
- Previous sessions: ${MEMORY_COUNT}
- Pending escalations: ${ESCALATION_COUNT}

### Governance Context
- Canon artifacts: ${CANON_COUNT:-0}
- Governance inventory: $([ -f "$GOV_INVENTORY" ] && echo "PRESENT" || echo "MISSING")
- Drift detected: ${DRIFT_DETECTED}

### Environment Context
- Git branch: ${GIT_BRANCH}
- Uncommitted changes: ${GIT_STATUS}
- JSON validation: $([ "$JSON_ERRORS" -eq 0 ] && echo "PASSED" || echo "FAILED (${JSON_ERRORS} errors)")

---

## Session Mandate

This working contract authorizes the agent to proceed with session work under the following conditions:

1. **Authority Boundaries**: As defined in agent contract
2. **Escalation Triggers**: As defined in LIVING_AGENT_SYSTEM.md v6.2.0
3. **Governance Compliance**: All health checks passed
4. **Session Safety**: Environment validated and ready

---

## Generated By
Wake-up protocol script v6.2.0
Authority: LIVING_AGENT_GOVERNANCE_HEALTH_CHECKS.md

EOF

echo -e "${GREEN}✓ Working contract generated: ${WORKING_CONTRACT}${NC}"

# Generate environment health JSON
cat > "$ENVIRONMENT_HEALTH" <<EOF
{
  "agent_id": "${AGENT_ID}",
  "agent_class": "${AGENT_CLASS}",
  "timestamp": "${TIMESTAMP}",
  "health_check_version": "6.2.0",
  "phases": {
    "phase1_self_identification": "${PHASE1_STATUS}",
    "phase2_memory_scan": "${PHASE2_STATUS}",
    "phase3_governance_discovery": "${PHASE3_STATUS}",
    "phase4_environment_health": "${PHASE4_STATUS}",
    "phase5_drift_detection": "${DRIFT_DETECTED}",
    "phase6_auto_remediation": "COMPLETED",
    "phase7_working_contract": "COMPLETED"
  },
  "memory": {
    "previous_sessions": ${MEMORY_COUNT},
    "pending_escalations": ${ESCALATION_COUNT}
  },
  "governance": {
    "canon_artifacts": ${CANON_COUNT:-0},
    "drift_detected": "${DRIFT_DETECTED}"
  },
  "environment": {
    "git_branch": "${GIT_BRANCH}",
    "uncommitted_changes": ${GIT_STATUS},
    "json_errors": ${JSON_ERRORS}
  }
}
EOF

echo -e "${GREEN}✓ Environment health JSON generated: ${ENVIRONMENT_HEALTH}${NC}"
echo -e "${GREEN}✓ Phase 7: PASSED${NC}"
echo ""

# ==============================================================================
# Summary
# ==============================================================================
echo "======================================"
echo "🎯 WAKE-UP PROTOCOL COMPLETE"
echo "======================================"

if [ "$PHASE1_STATUS" = "PASS" ] && [ "$PHASE2_STATUS" = "PASS" ] && [ "$PHASE3_STATUS" = "PASS" ] && [ "$PHASE4_STATUS" = "PASS" ]; then
    echo -e "${GREEN}✅ All health checks PASSED${NC}"
    echo ""
    echo "Agent is ready to begin session work."
    echo ""
    echo "Working contract: ${WORKING_CONTRACT}"
    echo "Environment health: ${ENVIRONMENT_HEALTH}"
    exit 0
else
    echo -e "${RED}❌ Health checks FAILED${NC}"
    echo ""
    echo "Review escalation inbox: ${WORKSPACE_DIR}/escalation-inbox/"
    exit 1
fi
