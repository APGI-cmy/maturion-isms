#!/bin/bash
# Session Closure Script for Living Agent System v6.2.0
# Authority: LIVING_AGENT_SYSTEM.md v6.2.0, Section 3.4
# Purpose: Execute agent session closure protocol with evidence capture
#
# Usage: .github/scripts/session-closure.sh <agent-id>
# Example: .github/scripts/session-closure.sh governance-liaison-isms

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
MEMORY_DIR="${WORKSPACE_DIR}/memory"
PERSONAL_DIR="${WORKSPACE_DIR}/personal"
ESCALATION_DIR="${WORKSPACE_DIR}/escalation-inbox"
AGENT_CONTRACT_FILE="${REPO_ROOT}/.github/agents/${AGENT_ID}-agent.md"
if [ ! -f "$AGENT_CONTRACT_FILE" ]; then
    AGENT_CONTRACT_FILE="${REPO_ROOT}/.github/agents/${AGENT_ID}.md"
fi
TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
SESSION_DATE=$(date -u +"%Y%m%d")

validate_required_merge_checks() {
    local result_file="/tmp/session-closure-required-checks-${AGENT_ID}-${SESSION_DATE}.json"
    RESULT_FILE="$result_file" \
    AGENT_CONTRACT_FILE="$AGENT_CONTRACT_FILE" \
    CHECK_RUNS_PATH="${CHECK_RUNS_PATH:-}" \
    CHECK_RUNS_JSON="${CHECK_RUNS_JSON:-}" \
    COMMIT_STATUSES_PATH="${COMMIT_STATUSES_PATH:-}" \
    COMMIT_STATUSES_JSON="${COMMIT_STATUSES_JSON:-}" \
    python3 <<'PY'
import json
import os
import re
import sys

result_file = os.environ["RESULT_FILE"]
contract_path = os.environ["AGENT_CONTRACT_FILE"]

def emit(payload):
    with open(result_file, "w", encoding="utf-8") as fh:
        json.dump(payload, fh, indent=2)

def fail(reason):
    emit({"ok": False, "reason": reason, "failures": [], "required_checks": []})
    print(reason)
    sys.exit(1)

if not os.path.exists(contract_path):
    fail(f"Agent contract not found: {contract_path}")

contract_text = open(contract_path, "r", encoding="utf-8").read()
frontmatter_match = re.search(r"^---\n(.*?)\n---\n", contract_text, re.S | re.M)
if not frontmatter_match:
    fail("Contract YAML frontmatter is missing.")
frontmatter = frontmatter_match.group(1)
lines = frontmatter.splitlines()

mg_start = None
for idx, line in enumerate(lines):
    if line.strip() == "merge_gate_interface:":
        mg_start = idx
        break
if mg_start is None:
    fail("merge_gate_interface block missing from contract frontmatter.")

required_checks = []
required_start = None
for idx in range(mg_start + 1, len(lines)):
    line = lines[idx]
    if line and not line.startswith((" ", "\t")):
        break
    if line.strip() == "required_checks:":
        required_start = idx
        break
if required_start is None:
    fail("merge_gate_interface.required_checks missing from contract frontmatter.")

for idx in range(required_start + 1, len(lines)):
    line = lines[idx]
    if line and not line.startswith((" ", "\t")):
        break
    stripped = line.strip()
    if not stripped:
        continue
    if not stripped.startswith("- "):
        if required_checks:
            break
        continue
    entry = stripped[2:].strip()
    if (entry.startswith('"') and entry.endswith('"')) or (entry.startswith("'") and entry.endswith("'")):
        entry = entry[1:-1]
    if entry:
        required_checks.append(entry)

required_checks = [c for c in required_checks if c]
if not required_checks:
    fail("merge_gate_interface.required_checks is empty.")

def load_json(path_key, json_key):
    path_val = os.environ.get(path_key, "").strip()
    if path_val:
        with open(path_val, "r", encoding="utf-8") as fh:
            return json.load(fh)
    raw = os.environ.get(json_key, "").strip()
    if raw:
        return json.loads(raw)
    return None

try:
    check_runs_payload = load_json("CHECK_RUNS_PATH", "CHECK_RUNS_JSON")
    commit_statuses_payload = load_json("COMMIT_STATUSES_PATH", "COMMIT_STATUSES_JSON")
except Exception as exc:
    fail(f"Could not parse check status evidence: {exc}")

if check_runs_payload is None and commit_statuses_payload is None:
    fail("Cannot verify required checks: no check-runs or commit-status evidence provided.")

check_runs = check_runs_payload.get("check_runs", []) if isinstance(check_runs_payload, dict) else (check_runs_payload or [])
commit_statuses = commit_statuses_payload.get("statuses", []) if isinstance(commit_statuses_payload, dict) else (commit_statuses_payload or [])

observed = {}
def add(name, state, detail):
    if not name:
        return
    observed.setdefault(name, []).append({"state": state, "detail": detail})

for run in check_runs:
    if not isinstance(run, dict):
        continue
    name = str(run.get("name", "")).strip()
    status = str(run.get("status", "")).strip().lower()
    conclusion = str(run.get("conclusion", "")).strip().lower()
    if status in {"queued", "in_progress", "waiting", "requested", "pending"}:
        add(name, "pending", f"check_run status={status}")
    elif status == "completed":
        if conclusion == "success":
            add(name, "success", f"check_run conclusion={conclusion}")
        else:
            add(name, "failed", f"check_run conclusion={conclusion or 'unknown'}")
    else:
        add(name, "pending", f"check_run status={status or 'unknown'}")

for status_row in commit_statuses:
    if not isinstance(status_row, dict):
        continue
    context = str(status_row.get("context", "")).strip()
    state = str(status_row.get("state", "")).strip().lower()
    if state == "success":
        add(context, "success", "commit_status state=success")
    elif state == "pending":
        add(context, "pending", "commit_status state=pending")
    elif state:
        add(context, "failed", f"commit_status state={state}")
    else:
        add(context, "pending", "commit_status state=unknown")

failures = []
for check in required_checks:
    states = [entry["state"] for entry in observed.get(check, [])]
    if not states:
        failures.append({"check": check, "status": "missing", "detail": "required check not observed"})
    elif "pending" in states:
        failures.append({"check": check, "status": "pending", "detail": "required check is pending/in-progress"})
    elif "failed" in states:
        failures.append({"check": check, "status": "failed", "detail": "required check failed"})
    elif "success" in states:
        continue
    else:
        failures.append({"check": check, "status": "unverified", "detail": "required check state cannot be verified"})

ok = len(failures) == 0
payload = {
    "ok": ok,
    "reason": "all required checks verified as success" if ok else "one or more required checks are not green",
    "required_checks": required_checks,
    "failures": failures,
}
emit(payload)
if not ok:
    for item in failures:
        print(f"{item['check']}: {item['status']} ({item['detail']})")
    sys.exit(1)
print("All merge_gate_interface.required_checks entries verified as success.")
PY
}

# Validation
if [ -z "$AGENT_ID" ]; then
    echo -e "${RED}❌ ERROR: Agent ID required${NC}"
    echo "Usage: $0 <agent-id>"
    echo "Example: $0 governance-liaison-isms"
    exit 1
fi

echo "======================================"
echo "🔒 SESSION CLOSURE PROTOCOL v6.2.0"
echo "======================================"
echo "Agent: $AGENT_ID"
echo "Time: $TIMESTAMP"
echo ""

# Ensure workspace exists
mkdir -p "$MEMORY_DIR" "$PERSONAL_DIR" "$ESCALATION_DIR"

# ==============================================================================
# Step 1: Capture Evidence
# ==============================================================================
echo -e "${BLUE}Step 1: Capture Evidence${NC}"
echo "------------------------------"

cd "$REPO_ROOT"

# Get list of modified files with SHA256 checksums
echo "  - Collecting modified files..."
MODIFIED_FILES=$(git status --porcelain | grep -E "^(M| M|A| A)" | awk '{print $2}' || echo "")

if [ -n "$MODIFIED_FILES" ]; then
    MODIFIED_COUNT=$(echo "$MODIFIED_FILES" | wc -l)
    echo -e "${GREEN}  ✓ ${MODIFIED_COUNT} modified files detected${NC}"
else
    MODIFIED_COUNT=0
    echo "  - No modified files detected"
fi

# Calculate checksums for modified files
CHECKSUMS_FILE="/tmp/session-checksums-${SESSION_DATE}.txt"
> "$CHECKSUMS_FILE"

if [ -n "$MODIFIED_FILES" ]; then
    echo "$MODIFIED_FILES" | while read -r file; do
        if [ -f "$file" ]; then
            CHECKSUM=$(sha256sum "$file" | awk '{print $1}')
            echo "${file}:${CHECKSUM}" >> "$CHECKSUMS_FILE"
        fi
    done
fi

echo -e "${GREEN}✓ Step 1: COMPLETE${NC}"
echo ""

# ==============================================================================
# Step 2: Create Session Memory
# ==============================================================================
echo -e "${BLUE}Step 2: Create Session Memory${NC}"
echo "------------------------------"

# Find next session number
LAST_SESSION=$(find "$MEMORY_DIR" -name "session-*.md" 2>/dev/null | sed 's/.*session-\([0-9]*\)-.*/\1/' | sort -n | tail -1)
SESSION_NUM=$((${LAST_SESSION:-0} + 1))
SESSION_NUM_PADDED=$(printf "%03d" "$SESSION_NUM")

SESSION_FILE="${MEMORY_DIR}/session-${SESSION_NUM_PADDED}-${SESSION_DATE}.md"

echo "  - Creating session memory: $(basename "$SESSION_FILE")"

# Create session memory document
cat > "$SESSION_FILE" <<EOF
# Session ${SESSION_NUM_PADDED} - ${SESSION_DATE} (Living Agent System v6.2.0)

## Agent
- Type: ${AGENT_ID}
- Session ID: session-${SESSION_NUM_PADDED}
- Date: ${TIMESTAMP}

## Task
[Describe what was requested - to be filled by agent]

---

## What I Did

### Files Modified
EOF

# Add file list with checksums
if [ -n "$MODIFIED_FILES" ]; then
    echo "$MODIFIED_FILES" | while read -r file; do
        if [ -f "$file" ]; then
            CHECKSUM=$(sha256sum "$file" 2>/dev/null | awk '{print $1}' || echo "unknown")
            echo "- \`${file}\` (SHA256: \`${CHECKSUM}\`)" >> "$SESSION_FILE"
        fi
    done
else
    echo "- No files modified in this session" >> "$SESSION_FILE"
fi

# Continue session memory template
cat >> "$SESSION_FILE" <<EOF

### Actions Taken
- Action 1: [description]
- Action 2: [description]

### Decisions Made
- Decision 1: [what and why]
- Decision 2: [what and why]

---

## Living Agent System Evidence

### Evidence Collection
- Files modified: ${MODIFIED_COUNT}
- Checksums captured: $([ -f "$CHECKSUMS_FILE" ] && wc -l < "$CHECKSUMS_FILE" || echo "0")
- Evidence file: ${CHECKSUMS_FILE}

### Ripple Status
- Ripple required: [YES/NO]
- Ripple actions: [description if applicable]

### Governance Alignment
- Drift detected: [YES/NO]
- Drift resolved: [YES/NO if applicable]
- Alignment actions: [description if applicable]

---

## Outcome
[✅ COMPLETE | ⚠️ PARTIAL | ❌ ESCALATED]

## Lessons

### What Worked Well
- [lesson 1]

### What Was Challenging
- [challenge 1]

### What Future Sessions Should Know
- [recommendation 1]

### Governance Insights
- [insight 1]

---

**Authority**: LIVING_AGENT_SYSTEM.md v6.2.0 | **Session**: ${SESSION_NUM_PADDED}  
**Generated**: ${TIMESTAMP}
EOF

echo -e "${GREEN}  ✓ Session memory created${NC}"
echo -e "${GREEN}✓ Step 2: COMPLETE${NC}"
echo ""

# ==============================================================================
# Step 3: Memory Rotation
# ==============================================================================
echo -e "${BLUE}Step 3: Memory Rotation${NC}"
echo "------------------------------"

# Count active sessions
ACTIVE_SESSIONS=$(find "$MEMORY_DIR" -name "session-*.md" ! -path "*/.*archive/*" 2>/dev/null | wc -l)

echo "  - Active sessions: ${ACTIVE_SESSIONS}"

if [ "$ACTIVE_SESSIONS" -gt 5 ]; then
    echo "  - Rotating memory (keeping latest 5 sessions)..."
    
    # Create archive directory
    ARCHIVE_DIR="${MEMORY_DIR}/.archive"
    mkdir -p "$ARCHIVE_DIR"
    
    # Move oldest sessions to archive
    find "$MEMORY_DIR" -name "session-*.md" ! -path "*/.*archive/*" -type f | \
        sort | \
        head -n -5 | \
        while read -r old_session; do
            mv "$old_session" "$ARCHIVE_DIR/"
            echo -e "${YELLOW}  → Archived: $(basename "$old_session")${NC}"
        done
    
    ARCHIVED_COUNT=$(find "$ARCHIVE_DIR" -name "session-*.md" 2>/dev/null | wc -l)
    echo -e "${GREEN}  ✓ ${ARCHIVED_COUNT} total sessions in archive${NC}"
else
    echo "  ✓ No rotation needed (≤5 sessions)"
fi

echo -e "${GREEN}✓ Step 3: COMPLETE${NC}"
echo ""

# ==============================================================================
# Step 4: Record Lessons
# ==============================================================================
echo -e "${BLUE}Step 4: Record Lessons${NC}"
echo "------------------------------"

LESSONS_FILE="${PERSONAL_DIR}/lessons-learned.md"
PATTERNS_FILE="${PERSONAL_DIR}/patterns.md"

# Initialize lessons file if it doesn't exist
if [ ! -f "$LESSONS_FILE" ]; then
    cat > "$LESSONS_FILE" <<EOF
# Lessons Learned

Personal learning log for ${AGENT_ID}

---

EOF
fi

# Add session entry placeholder
cat >> "$LESSONS_FILE" <<EOF
## Session ${SESSION_NUM_PADDED} - ${SESSION_DATE}

**What I Learned:**
- [Lesson to be filled by agent]

**What to Remember:**
- [Key insight to be filled by agent]

---

EOF

echo -e "${GREEN}  ✓ Lessons file updated: ${LESSONS_FILE}${NC}"

# Initialize patterns file if it doesn't exist
if [ ! -f "$PATTERNS_FILE" ]; then
    cat > "$PATTERNS_FILE" <<EOF
# Patterns & Best Practices

Common patterns discovered by ${AGENT_ID}

---

EOF
fi

echo -e "${GREEN}  ✓ Patterns file ready: ${PATTERNS_FILE}${NC}"
echo -e "${GREEN}✓ Step 4: COMPLETE${NC}"
echo ""

# ==============================================================================
# Step 5: Escalation Check
# ==============================================================================
echo -e "${BLUE}Step 5: Escalation Check${NC}"
echo "------------------------------"

UNRESOLVED_ESCALATIONS=$(find "$ESCALATION_DIR" -name "escalation-*.md" 2>/dev/null | wc -l)

echo "  - Pending escalations: ${UNRESOLVED_ESCALATIONS}"

if [ "$UNRESOLVED_ESCALATIONS" -gt 0 ]; then
    echo -e "${YELLOW}  ⚠️  Unresolved escalations detected:${NC}"
    find "$ESCALATION_DIR" -name "escalation-*.md" | while read -r esc_file; do
        echo "    • $(basename "$esc_file")"
    done
else
    echo -e "${GREEN}  ✓ No unresolved escalations${NC}"
fi

echo -e "${GREEN}✓ Step 5: COMPLETE${NC}"
echo ""

# ==============================================================================
# Step 6: Governance Alignment Check
# ==============================================================================
echo -e "${BLUE}Step 6: Governance Alignment Check${NC}"
echo "------------------------------"

# Check if working contract exists
WORKING_CONTRACT="${WORKSPACE_DIR}/working-contract.md"

if [ -f "$WORKING_CONTRACT" ]; then
    DRIFT_STATUS=$(grep "Drift detected:" "$WORKING_CONTRACT" | awk -F': ' '{print $2}' || echo "UNKNOWN")
    echo "  - Working contract exists"
    echo "  - Drift status: ${DRIFT_STATUS}"
else
    echo -e "${YELLOW}  ⚠️  No working contract found${NC}"
    DRIFT_STATUS="UNKNOWN"
fi

# Check CANON_INVENTORY.json
CANON_INVENTORY="${REPO_ROOT}/governance/CANON_INVENTORY.json"
if [ -f "$CANON_INVENTORY" ]; then
    if jq empty "$CANON_INVENTORY" 2>/dev/null; then
        echo -e "${GREEN}  ✓ CANON_INVENTORY.json valid${NC}"
    else
        echo -e "${RED}  ❌ CANON_INVENTORY.json invalid${NC}"
        DRIFT_STATUS="INVALID_CANON_INVENTORY"
    fi
fi

echo "  - Validating merge_gate_interface.required_checks..."
REQUIRED_CHECKS_RESULT_FILE="/tmp/session-closure-required-checks-${AGENT_ID}-${SESSION_DATE}.json"
if validate_required_merge_checks; then
    echo -e "${GREEN}  ✓ Required merge checks verified (all green)${NC}"
    REQUIRED_CHECKS_STATUS="PASS"
else
    echo -e "${RED}  ❌ Required merge check validation failed${NC}"
    REQUIRED_CHECKS_STATUS="FAIL"
fi

echo -e "${GREEN}✓ Step 6: COMPLETE${NC}"
echo ""

# ==============================================================================
# Step 7: Outcome Classification
# ==============================================================================
echo -e "${BLUE}Step 7: Outcome Classification${NC}"
echo "------------------------------"

# Determine outcome based on checks
OUTCOME="✅ COMPLETE"

if [ "$UNRESOLVED_ESCALATIONS" -gt 0 ]; then
    OUTCOME="❌ ESCALATED"
elif [ "$MODIFIED_COUNT" -eq 0 ]; then
    OUTCOME="⚠️ PARTIAL"
elif [ "${REQUIRED_CHECKS_STATUS:-FAIL}" != "PASS" ]; then
    OUTCOME="❌ ESCALATED"
fi

echo "  - Session outcome: ${OUTCOME}"

# Update session file with preliminary outcome (use # as delimiter to avoid conflict with | in pattern)
sed -i "s#\[✅ COMPLETE | ⚠️ PARTIAL | ❌ ESCALATED\]#${OUTCOME}#" "$SESSION_FILE"

echo -e "${GREEN}✓ Step 7: COMPLETE${NC}"
echo ""

# ==============================================================================
# Summary
# ==============================================================================
echo "======================================"
echo "🎯 SESSION CLOSURE COMPLETE"
echo "======================================"

echo ""
echo "📋 Evidence Bundle:"
echo "  - Session memory: ${SESSION_FILE}"
echo "  - Files modified: ${MODIFIED_COUNT}"
echo "  - Checksums file: ${CHECKSUMS_FILE}"
echo "  - Pending escalations: ${UNRESOLVED_ESCALATIONS}"
echo ""
echo "📝 Next Steps:"
echo "  1. Agent should fill in session details in: ${SESSION_FILE}"
echo "  2. Agent should update lessons in: ${LESSONS_FILE}"
echo "  3. Agent should review escalations: ${ESCALATION_DIR}"
echo ""
if [ "${REQUIRED_CHECKS_STATUS:-FAIL}" != "PASS" ]; then
    echo -e "${RED}❌ Session closure failed: required merge checks are not fully green or could not be verified${NC}"
    echo "  - Evidence file: ${REQUIRED_CHECKS_RESULT_FILE}"
    exit 1
fi

echo -e "${GREEN}✅ Session closure protocol completed successfully${NC}"

exit 0
