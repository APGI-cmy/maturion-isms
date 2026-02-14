#!/bin/bash
# Session Closure Protocol - Living Agent System v6.2.0
# Authority: LIVING_AGENT_SYSTEM.md v6.2.0, Section 3.4
# Purpose: Capture session evidence, create memory, rotate old sessions, verify safe state

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Parse arguments
AGENT_ID="${1:-governance-liaison-isms}"
REPO_ROOT="$(git rev-parse --show-toplevel 2>/dev/null || echo ".")"
WORKSPACE="$REPO_ROOT/.agent-workspace/$AGENT_ID"
TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
SESSION_DATE=$(date -u +"%Y%m%d")

echo ""
echo "🔒 SESSION CLOSURE: $AGENT_ID"
echo ""

# Ensure workspace exists
mkdir -p "$WORKSPACE/memory" "$WORKSPACE/memory/.archive" "$WORKSPACE/personal" "$WORKSPACE/escalation-inbox"

# =============================================================================
# Step 1: Capture Evidence
# =============================================================================
echo -e "${BLUE}📸 STEP 1: Capturing evidence...${NC}"

# Count modified files
cd "$REPO_ROOT"
MODIFIED_COUNT=0
MODIFIED_FILES=()

if git rev-parse --git-dir > /dev/null 2>&1; then
    # Get list of modified files (staged and unstaged)
    while IFS= read -r file; do
        if [ -n "$file" ]; then
            MODIFIED_FILES+=("$file")
            MODIFIED_COUNT=$((MODIFIED_COUNT + 1))
        fi
    done < <(git status --porcelain | awk '{print $2}')
    
    echo "  📝 Modified files: $MODIFIED_COUNT"
    if [ "$MODIFIED_COUNT" -gt 0 ]; then
        for file in "${MODIFIED_FILES[@]}"; do
            echo "    - $file"
        done
    fi
else
    echo "  ⚠️  Not a git repository - cannot track modifications"
fi

# =============================================================================
# Step 2: Determine Session Number
# =============================================================================
echo ""
echo -e "${BLUE}🔢 STEP 2: Determining session number...${NC}"

# Count existing sessions
SESSION_COUNT=$(find "$WORKSPACE/memory" -maxdepth 1 -name "session-*.md" 2>/dev/null | wc -l || echo "0")
NEW_SESSION_NUMBER=$(printf "%03d" $((SESSION_COUNT + 1)))
SESSION_FILE="$WORKSPACE/memory/session-$NEW_SESSION_NUMBER-$SESSION_DATE.md"

echo "  📊 Previous sessions: $SESSION_COUNT"
echo "  🆕 New session: $NEW_SESSION_NUMBER"
echo "  📄 Session file: $(basename "$SESSION_FILE")"

# =============================================================================
# Step 3: Create Session Memory
# =============================================================================
echo ""
echo -e "${BLUE}🧠 STEP 3: Creating session memory...${NC}"

# Get current git info
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo "unknown")
CURRENT_COMMIT=$(git rev-parse --short HEAD 2>/dev/null || echo "unknown")

# Get escalation count
ESCALATION_COUNT=$(find "$WORKSPACE/escalation-inbox" -name "*.md" 2>/dev/null | wc -l || echo "0")

# Create session memory template
cat > "$SESSION_FILE" << 'TEMPLATE_EOF'
# Session NEW_SESSION_NUMBER - SESSION_DATE (Living Agent System v6.2.0)

## Agent
- Type: AGENT_ID
- Class: AGENT_CLASS
- Session ID: session-NEW_SESSION_NUMBER-SESSION_DATE

## Task
[Describe what was requested/what issue or work was assigned]

## What I Did

### Files Modified
[List files with descriptions and SHA256 checksums where applicable]

### Actions Taken
- Action 1: [description]
- Action 2: [description]

### Decisions Made
- Decision 1: [what and why, with authority reference]
- Decision 2: [what and why, with authority reference]

## Living Agent System Evidence

### Evidence Collection
- Evidence artifacts: [paths to evidence files created]
- Status: [summary of evidence captured]

### Ripple Status
- Status: [ripple state - NONE | RECEIVED | PROCESSED | DISPATCHED]
- Ripple required: [YES/NO]
- Details: [if applicable]

### Governance Gap Progress
- Status: [any gaps identified or addressed]
- Details: [if applicable]

### Governance Hygiene
- Status: [CLEAN | ISSUES_DETECTED]
- Details: [cross-references validated, syntax checked, etc.]

### Governance Alignment
- Local TIER_0 Canon: [version or status]
- Canonical TIER_0 Canon: [version or status]
- Drift: [NONE | DETECTED | RESOLVED]
- Files aligned: [count or list]

## Outcome
[✅ COMPLETE | ⚠️ PARTIAL | ❌ ESCALATED]

**Completed**:
- [List completed items]

**Pending** (if applicable):
- [List items requiring follow-up]

**Escalations** (if applicable):
- [List escalations created with paths]

## Lessons

### What Worked Well
- [lesson 1]
- [lesson 2]

### What Was Challenging
- [challenge 1]
- [challenge 2]

### What Future Sessions Should Know
- [recommendation 1]
- [recommendation 2]

### Governance Insights
- [insight 1]
- [insight 2]

## Session Environment

- **Branch**: CURRENT_BRANCH
- **Commit**: CURRENT_COMMIT
- **Modified Files**: MODIFIED_COUNT
- **Escalations**: ESCALATION_COUNT pending
- **Session Duration**: [if tracked]

---
Authority: LIVING_AGENT_SYSTEM.md v6.2.0 | Session: NEW_SESSION_NUMBER | Closed: TIMESTAMP
TEMPLATE_EOF

# Replace placeholders (using | as delimiter to avoid issues with / in paths)
sed -i "s|NEW_SESSION_NUMBER|$NEW_SESSION_NUMBER|g" "$SESSION_FILE"
sed -i "s|SESSION_DATE|$SESSION_DATE|g" "$SESSION_FILE"
sed -i "s|AGENT_ID|$AGENT_ID|g" "$SESSION_FILE"
sed -i "s|TIMESTAMP|$TIMESTAMP|g" "$SESSION_FILE"
sed -i "s|CURRENT_BRANCH|$CURRENT_BRANCH|g" "$SESSION_FILE"
sed -i "s|CURRENT_COMMIT|$CURRENT_COMMIT|g" "$SESSION_FILE"
sed -i "s|MODIFIED_COUNT|$MODIFIED_COUNT|g" "$SESSION_FILE"
sed -i "s|ESCALATION_COUNT|$ESCALATION_COUNT|g" "$SESSION_FILE"

# Try to determine agent class from agent file
AGENT_FILE=""
if [ -f "$REPO_ROOT/.github/agents/${AGENT_ID}-agent.md" ]; then
    AGENT_FILE="$REPO_ROOT/.github/agents/${AGENT_ID}-agent.md"
elif [ -f "$REPO_ROOT/.github/agents/${AGENT_ID}.agent.md" ]; then
    AGENT_FILE="$REPO_ROOT/.github/agents/${AGENT_ID}.agent.md"
elif [ -f "$REPO_ROOT/governance/agents/${AGENT_ID}.agent.md" ]; then
    AGENT_FILE="$REPO_ROOT/governance/agents/${AGENT_ID}.agent.md"
fi

if [ -n "$AGENT_FILE" ] && [ -f "$AGENT_FILE" ]; then
    AGENT_CLASS=$(grep -m 1 "^  class:" "$AGENT_FILE" | awk '{print $2}' || echo "unknown")
    sed -i "s|AGENT_CLASS|$AGENT_CLASS|g" "$SESSION_FILE"
else
    sed -i "s|AGENT_CLASS|unknown|g" "$SESSION_FILE"
fi

echo "  ✓ Session memory template created"
echo "  📝 File: $SESSION_FILE"
echo ""
echo -e "${YELLOW}  ⚠️  IMPORTANT: Fill in the session memory before committing!${NC}"
echo "     The template has been created with placeholders for you to complete."

# =============================================================================
# Step 4: Memory Rotation
# =============================================================================
echo ""
echo -e "${BLUE}🔄 STEP 4: Memory rotation check...${NC}"

# Count sessions (including the new one we just created)
TOTAL_SESSIONS=$(find "$WORKSPACE/memory" -maxdepth 1 -name "session-*.md" 2>/dev/null | wc -l || echo "0")
MAX_SESSIONS=5

echo "  📊 Total sessions: $TOTAL_SESSIONS (max: $MAX_SESSIONS)"

if [ "$TOTAL_SESSIONS" -gt "$MAX_SESSIONS" ]; then
    ARCHIVE_COUNT=$((TOTAL_SESSIONS - MAX_SESSIONS))
    echo "  🗄️  Archiving $ARCHIVE_COUNT oldest session(s)..."
    
    # Find and archive oldest sessions
    find "$WORKSPACE/memory" -maxdepth 1 -name "session-*.md" | sort | head -n "$ARCHIVE_COUNT" | while read -r old_session; do
        mv "$old_session" "$WORKSPACE/memory/.archive/"
        echo "    ✓ Archived: $(basename "$old_session")"
    done
else
    echo "  ✓ No rotation needed ($TOTAL_SESSIONS ≤ $MAX_SESSIONS)"
fi

# =============================================================================
# Step 5: Record Lessons
# =============================================================================
echo ""
echo -e "${BLUE}📚 STEP 5: Lessons learned tracking...${NC}"

LESSONS_FILE="$WORKSPACE/personal/lessons-learned.md"
PATTERNS_FILE="$WORKSPACE/personal/patterns.md"

# Initialize lessons-learned.md if it doesn't exist
if [ ! -f "$LESSONS_FILE" ]; then
    cat > "$LESSONS_FILE" << 'EOF'
# Lessons Learned

**Agent**: AGENT_ID  
**Last Updated**: TIMESTAMP

## Session-by-Session Lessons

### Session NEW_SESSION_NUMBER (SESSION_DATE)
- [Add lessons from this session]

## Recurring Themes
- [Themes that appear across multiple sessions]

## Best Practices Discovered
- [Practices that consistently work well]

## Anti-Patterns to Avoid
- [Patterns that consistently cause problems]

---
Living Agent System v6.2.0
EOF
    sed -i "s|AGENT_ID|$AGENT_ID|g" "$LESSONS_FILE"
    sed -i "s|TIMESTAMP|$TIMESTAMP|g" "$LESSONS_FILE"
    sed -i "s|NEW_SESSION_NUMBER|$NEW_SESSION_NUMBER|g" "$LESSONS_FILE"
    sed -i "s|SESSION_DATE|$SESSION_DATE|g" "$LESSONS_FILE"
    echo "  ✓ Initialized: lessons-learned.md"
else
    # Append session entry
    echo "" >> "$LESSONS_FILE"
    echo "### Session $NEW_SESSION_NUMBER ($SESSION_DATE)" >> "$LESSONS_FILE"
    echo "- [Add lessons from this session]" >> "$LESSONS_FILE"
    echo "  ✓ Updated: lessons-learned.md"
fi

# Initialize patterns.md if it doesn't exist
if [ ! -f "$PATTERNS_FILE" ]; then
    cat > "$PATTERNS_FILE" << 'EOF'
# Patterns Discovered

**Agent**: AGENT_ID  
**Last Updated**: TIMESTAMP

## Successful Patterns
- [Patterns that consistently lead to success]

## Problem Patterns
- [Patterns that consistently lead to problems]

## Governance Patterns
- [Patterns specific to governance management]

## Coordination Patterns
- [Patterns for working with other agents/humans]

---
Living Agent System v6.2.0
EOF
    sed -i "s|AGENT_ID|$AGENT_ID|g" "$PATTERNS_FILE"
    sed -i "s|TIMESTAMP|$TIMESTAMP|g" "$PATTERNS_FILE"
    echo "  ✓ Initialized: patterns.md"
else
    echo "  ✓ Exists: patterns.md"
fi

# =============================================================================
# Step 6: Escalation Check
# =============================================================================
echo ""
echo -e "${BLUE}🚨 STEP 6: Escalation inbox check...${NC}"

if [ "$ESCALATION_COUNT" -eq 0 ]; then
    echo "  ✅ No pending escalations"
else
    echo -e "  ${YELLOW}⚠️  $ESCALATION_COUNT pending escalation(s):${NC}"
    find "$WORKSPACE/escalation-inbox" -name "*.md" | while read -r escalation; do
        echo "    - $(basename "$escalation")"
    done
fi

# =============================================================================
# Step 7: Governance Alignment Status
# =============================================================================
echo ""
echo -e "${BLUE}🎯 STEP 7: Governance alignment status...${NC}"

CANON_INVENTORY="$REPO_ROOT/governance/CANON_INVENTORY.json"
if [ -f "$CANON_INVENTORY" ]; then
    if command -v jq &> /dev/null; then
        CANON_COUNT=$(jq '.artifacts | length' "$CANON_INVENTORY" 2>/dev/null || echo "0")
        CANON_VERSION=$(jq -r '.version' "$CANON_INVENTORY" 2>/dev/null || echo "unknown")
        echo "  ✓ CANON_INVENTORY.json: v$CANON_VERSION ($CANON_COUNT artifacts)"
        
        # Check for placeholder hashes
        PLACEHOLDER_COUNT=$(jq -r '.artifacts | to_entries[] | select(.value.sha256 | length < 64) | .key' "$CANON_INVENTORY" 2>/dev/null | wc -l || echo "0")
        if [ "$PLACEHOLDER_COUNT" -gt 0 ]; then
            echo -e "  ${RED}❌ DEGRADED: $PLACEHOLDER_COUNT placeholder hash(es) detected${NC}"
        else
            echo "  ✅ All hashes valid (no placeholders)"
        fi
    else
        echo "  ✓ CANON_INVENTORY.json exists (jq not available for parsing)"
    fi
else
    echo -e "  ${YELLOW}⚠️  CANON_INVENTORY.json not found${NC}"
fi

# =============================================================================
# Step 8: Outcome Classification
# =============================================================================
echo ""
echo -e "${BLUE}🎯 STEP 8: Outcome classification...${NC}"

echo "  ℹ️  Session outcome should be marked in session memory as:"
echo "     ✅ COMPLETE - All work finished, no pending items"
echo "     ⚠️  PARTIAL - Some work complete, some pending"
echo "     ❌ ESCALATED - Work blocked, escalation required"

# =============================================================================
# Summary
# =============================================================================
echo ""
echo "╔═══════════════════════════════════════════════╗"
echo -e "║  ${GREEN}✅ SESSION CLOSURE COMPLETE${NC}                ║"
echo "╚═══════════════════════════════════════════════╝"
echo ""

echo "Session Evidence Bundle:"
echo "  📝 Session memory: $SESSION_FILE"
echo "  📚 Lessons learned: $LESSONS_FILE"
echo "  🎯 Patterns: $PATTERNS_FILE"
[ "$ESCALATION_COUNT" -gt 0 ] && echo "  🚨 Escalations: $ESCALATION_COUNT pending"
echo ""

echo -e "${YELLOW}NEXT STEPS:${NC}"
echo "  1. Complete the session memory template in:"
echo "     $SESSION_FILE"
echo "  2. Update lessons learned and patterns as needed"
echo "  3. Review and address any pending escalations"
echo "  4. Commit session artifacts to git"
echo ""

exit 0
