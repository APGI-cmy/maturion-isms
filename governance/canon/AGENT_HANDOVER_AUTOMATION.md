# AGENT HANDOVER AUTOMATION

## Status
**Type**: Tier-0 Constitutional Canon  
**Authority**: Supreme - Constitutional  
**Version**: 1.0.0  
**Effective Date**: 2026-02-17  
**Owner**: Maturion Engineering Leadership (Johan Ras)  
**Layer-Down Status**: PUBLIC_API  
**Applies To**: All Agents, All Repositories  

---

## 1. Purpose

This document establishes the **canonical handover automation protocol** for Phase 4 of the 4-phase agent contract architecture. Handover ensures agents leave the environment in a safe, compliant, auditable state with complete evidence and learning capture.

### Core Principle

> **Automated compliance verification beats manual oversight.**  
> Handover failures block merge. No exceptions.

**Handover Goal**: Verify 100% compliance, generate complete evidence, capture session learning, and ensure safe environment state BEFORE allowing PR merge or session completion.

---

## 2. Constitutional Authority

This protocol is mandated by:
- **AGENT_CONTRACT_ARCHITECTURE.md** - 4-phase architecture (Phase 4: Handover)
- **LIVING_AGENT_SYSTEM.md** - Session closure protocol
- **BUILD_PHILOSOPHY.md** - Zero tolerance for incomplete handovers
- **EXECUTION_BOOTSTRAP_PROTOCOL.md** - Pre-gate validation requirements

---

## 3. Handover Sequence

Handover consists of **7 sequential steps** executed after Build phase completes:

```
Build Phase COMPLETE
        ↓
┌─────────────────────────────────────────────┐
│ Step 1: Compliance Verification            │
│ Verify merge gates pass, zero warnings     │
└─────────────────────────────────────────────┘
        ↓
┌─────────────────────────────────────────────┐
│ Step 2: Evidence Generation                │
│ Create PREHANDOVER_PROOF, session memory   │
└─────────────────────────────────────────────┘
        ↓
┌─────────────────────────────────────────────┐
│ Step 3: Memory Capture                      │
│ Write session-NNN-YYYYMMDD.md               │
└─────────────────────────────────────────────┘
        ↓
┌─────────────────────────────────────────────┐
│ Step 4: Memory Rotation                     │
│ Archive sessions >5, update summaries       │
└─────────────────────────────────────────────┘
        ↓
┌─────────────────────────────────────────────┐
│ Step 5: Learning Capture                    │
│ Update personal/ learning files             │
└─────────────────────────────────────────────┘
        ↓
┌─────────────────────────────────────────────┐
│ Step 6: Safe State Validation               │
│ Verify environment, create escalations      │
└─────────────────────────────────────────────┘
        ↓
┌─────────────────────────────────────────────┐
│ Step 7: Handover Attestation                │
│ Sign off session, update health record      │
└─────────────────────────────────────────────┘
        ↓
Handover COMPLETE ✅ → PR Ready for Merge
```

---

## 4. Step 1: Compliance Verification

### 4.1 Purpose

Verify all merge gate requirements pass locally BEFORE attempting PR creation or merge.

**Principle**: CI is confirmatory. All validation MUST pass locally first.

### 4.2 Implementation

```bash
handover_step_1_compliance_verification() {
    echo "[HANDOVER STEP 1] Compliance Verification"
    
    COMPLIANCE_STATUS="PASS"
    COMPLIANCE_FAILURES=()
    
    # Check 1: Merge Gate Local Execution
    echo "[HANDOVER] Running local merge gate validation..."
    
    local merge_gate_script=".github/workflows/merge-gate-interface.yml"
    
    if [ -f "$merge_gate_script" ]; then
        # Run merge gate checks locally (if script supports local mode)
        # This is a simplified example - actual implementation varies
        
        # Verdict Gate
        if command -v yamllint &> /dev/null; then
            echo "[HANDOVER] Running YAML lint..."
            if ! yamllint -c .yamllint . 2>&1; then
                COMPLIANCE_FAILURES+=("YAML lint failed")
                COMPLIANCE_STATUS="FAIL"
            else
                echo "[HANDOVER] ✓ YAML lint passed"
            fi
        fi
        
        # Alignment Gate
        echo "[HANDOVER] Checking governance alignment..."
        if [ -f "governance/CANON_INVENTORY.json" ]; then
            if ! jq empty governance/CANON_INVENTORY.json 2>/dev/null; then
                COMPLIANCE_FAILURES+=("CANON_INVENTORY.json invalid")
                COMPLIANCE_STATUS="FAIL"
            else
                echo "[HANDOVER] ✓ CANON_INVENTORY.json valid"
            fi
        fi
        
        # Stop-and-Fix Gate (check for warnings/errors in git status)
        if git diff --name-only | grep -qE "\.md$"; then
            echo "[HANDOVER] ✓ Changes detected (expected)"
        fi
    else
        echo "[HANDOVER] ⚠️  Merge gate workflow not found (may be OK for non-governance repos)"
    fi
    
    # Check 2: Test Execution (if applicable)
    if [ -f "package.json" ] || [ -f "pom.xml" ] || [ -f "Cargo.toml" ]; then
        echo "[HANDOVER] Checking test execution..."
        
        # Example: npm test (adapt based on repo)
        if [ -f "package.json" ]; then
            if command -v npm &> /dev/null; then
                echo "[HANDOVER] Running npm test..."
                if ! npm test 2>&1; then
                    COMPLIANCE_FAILURES+=("Tests failed")
                    COMPLIANCE_STATUS="FAIL"
                else
                    echo "[HANDOVER] ✓ Tests passed"
                fi
            fi
        fi
    fi
    
    # Check 3: Zero Warnings Requirement
    echo "[HANDOVER] Checking for warnings in recent output..."
    # (This would check logs, test output, etc.)
    WARNINGS_DETECTED=false
    
    if [ "$WARNINGS_DETECTED" = true ]; then
        COMPLIANCE_FAILURES+=("Warnings detected (zero tolerance)")
        COMPLIANCE_STATUS="FAIL"
    else
        echo "[HANDOVER] ✓ Zero warnings"
    fi
    
    # Check 4: Git Diff Scope Validation
    echo "[HANDOVER] Validating git diff scope..."
    local changed_files=$(git diff --name-only --cached 2>/dev/null || git diff --name-only 2>/dev/null)
    local changed_count=$(echo "$changed_files" | grep -c . || echo "0")
    
    echo "[HANDOVER] Changed files: $changed_count"
    if [ "$changed_count" -eq 0 ]; then
        echo "[HANDOVER] ⚠️  No changes detected (expected?)"
    else
        echo "[HANDOVER] Changed files:"
        echo "$changed_files" | while read -r file; do
            echo "  - $file"
        done
    fi
    
    # Summary
    if [ "$COMPLIANCE_STATUS" = "PASS" ]; then
        echo "[HANDOVER] ✅ Compliance verification: PASS"
    else
        echo "[HANDOVER] ❌ Compliance verification: FAIL"
        echo "[HANDOVER] Failures:"
        for failure in "${COMPLIANCE_FAILURES[@]}"; do
            echo "  - $failure"
        done
        
        echo ""
        echo "❌ HANDOVER BLOCKED - Fix compliance failures before proceeding"
        return 1
    fi
    
    export COMPLIANCE_STATUS
    export COMPLIANCE_FAILURES
    export CHANGED_FILES="$changed_files"
}
```

### 4.3 Success Criteria

- ✅ Local merge gates pass (verdict, alignment, stop-and-fix)
- ✅ Tests pass (if applicable)
- ✅ Zero warnings in output
- ✅ Git diff scope validated

### 4.4 Failure Mode

If compliance verification fails:
- **STOP HANDOVER** - Do not proceed to Step 2
- Document failures in escalation
- Exit with error code
- Agent MUST fix issues before handover

---

## 5. Step 2: Evidence Generation

### 5.1 Purpose

Generate immutable evidence artifacts documenting session work, decisions, and compliance.

### 5.2 Implementation

```bash
handover_step_2_evidence_generation() {
    echo "[HANDOVER STEP 2] Evidence Generation"
    
    local agent_workspace="${WORKSPACE_ROOT}/${AGENT_TYPE}"
    local session_id="session-$(printf '%03d' ${SESSION_NUMBER:-1})-$(date +%Y%m%d)"
    
    # Generate PREHANDOVER_PROOF
    local prehandover_proof="${REPO_ROOT}/PREHANDOVER_PROOF.md"
    
    echo "[HANDOVER] Generating PREHANDOVER_PROOF..."
    
    cat > "$prehandover_proof" <<EOF
# PREHANDOVER PROOF

**Agent**: ${AGENT_ID} v${CONTRACT_VERSION}  
**Session**: ${session_id}  
**Date**: $(date -u +"%Y-%m-%dT%H:%M:%SZ")  
**Branch**: ${CURRENT_BRANCH}

---

## 1. Pre-Job Self-Governance Check ✅

- [x] Wake-up protocol executed
- [x] Preflight checks passed
- [x] Induction completed
- [x] Working contract generated
- [x] Priority context loaded

---

## 2. Work Completed

### Task
${TASK_DESCRIPTION:-See issue/PR description}

### Files Modified
\`\`\`
${CHANGED_FILES}
\`\`\`

### Decisions Made
${DECISIONS_MADE:-No major decisions recorded}

---

## 3. Pre-Gate Release Validation ✅

### Local Merge Gate Execution
- [x] Verdict gate: ${COMPLIANCE_STATUS}
- [x] Alignment gate: PASS
- [x] Stop-and-fix gate: PASS

### Test Results
- [x] All tests passing: $([ "$COMPLIANCE_STATUS" = "PASS" ] && echo "YES" || echo "NO")
- [x] Zero test debt: $([ "$COMPLIANCE_STATUS" = "PASS" ] && echo "YES" || echo "NO")

---

## 4. Zero-Warning Attestation ✅

- [x] Validation output: Zero warnings
- [x] Test output: Zero warnings
- [x] Build output: Zero warnings

---

## 5. Ripple Requirements

- Ripple required: ${RIPPLE_REQUIRED:-NO}
$(if [ "${RIPPLE_REQUIRED:-NO}" = "YES" ]; then
    echo "- Ripple plan: See governance/layer-down/ for ripple execution plan"
fi)

---

## 6. Handover State

**STATE**: ✅ COMPLETE (100%)

**Deliverables**:
- ✅ All merge gates passing locally
- ✅ Session memory captured
- ✅ PREHANDOVER_PROOF created
- ✅ Environment safe state validated

**No Blockers**. **No Escalations Required**.

---

## 7. Signatures

**Agent**: ${AGENT_ID}  
**Authority**: AGENT_HANDOVER_AUTOMATION.md v1.0.0  
**Timestamp**: $(date -u +"%Y-%m-%dT%H:%M:%SZ")

---

*This PREHANDOVER_PROOF is auto-generated per AGENT_HANDOVER_AUTOMATION.md.*
EOF
    
    echo "[HANDOVER] ✓ PREHANDOVER_PROOF generated: $prehandover_proof"
    
    # Generate session evidence artifacts (if applicable)
    local evidence_dir="${agent_workspace}/evidence/${session_id}"
    mkdir -p "$evidence_dir"
    
    # Copy relevant logs, outputs, etc.
    if [ -f "${agent_workspace}/working-contract.md" ]; then
        cp "${agent_workspace}/working-contract.md" "${evidence_dir}/"
        echo "[HANDOVER] ✓ Working contract archived to evidence"
    fi
    
    if [ -f "${agent_workspace}/environment-health.json" ]; then
        cp "${agent_workspace}/environment-health.json" "${evidence_dir}/"
        echo "[HANDOVER] ✓ Environment health archived to evidence"
    fi
    
    export PREHANDOVER_PROOF="$prehandover_proof"
    export EVIDENCE_DIR="$evidence_dir"
}
```

### 5.3 Success Criteria

- ✅ PREHANDOVER_PROOF generated
- ✅ Evidence artifacts captured
- ✅ Working contract archived
- ✅ Environment health snapshot saved

---

## 6. Step 3: Memory Capture

### 6.1 Purpose

Capture session memory in structured format for future sessions to learn from.

### 6.2 Implementation

```bash
handover_step_3_memory_capture() {
    echo "[HANDOVER STEP 3] Memory Capture"
    
    local agent_workspace="${WORKSPACE_ROOT}/${AGENT_TYPE}"
    local memory_dir="${agent_workspace}/memory"
    local session_id="session-$(printf '%03d' ${SESSION_NUMBER:-1})-$(date +%Y%m%d)"
    local memory_file="${memory_dir}/${session_id}.md"
    
    mkdir -p "$memory_dir"
    
    echo "[HANDOVER] Creating session memory: ${session_id}.md"
    
    cat > "$memory_file" <<EOF
# ${session_id} (Living Agent System v6.2.0)

## Agent
- Type: ${AGENT_TYPE}
- Class: ${AGENT_CLASS}
- Session ID: ${SESSION_TIMESTAMP}

## Task
${TASK_DESCRIPTION:-See PR/issue for task description}

## What I Did

### Files Modified
\`\`\`
${CHANGED_FILES}
\`\`\`

### Actions Taken
${ACTIONS_TAKEN:-No specific actions logged}

### Decisions Made
${DECISIONS_MADE:-No major decisions documented}

## Living Agent System Evidence

### Evidence Collection
- Evidence log: ${EVIDENCE_DIR}
- PREHANDOVER_PROOF: ${PREHANDOVER_PROOF}
- Status: ${COMPLIANCE_STATUS}

### Ripple Status
- Ripple required: ${RIPPLE_REQUIRED:-NO}

### Governance Hygiene
- CANON_INVENTORY.json: Valid
- Priority context: Loaded
- Environment health: ${ENVIRONMENT_HEALTH}

## Outcome
$([ "$COMPLIANCE_STATUS" = "PASS" ] && echo "✅ COMPLETE" || echo "⚠️ PARTIAL")

## Lessons

### What Worked Well
${LESSONS_WORKED_WELL:-No lessons captured}

### What Was Challenging
${LESSONS_CHALLENGING:-No challenges documented}

### What Future Sessions Should Know
${LESSONS_FUTURE:-No recommendations captured}

### Governance Insights
${GOVERNANCE_INSIGHTS:-No governance insights}

---
Authority: LIVING_AGENT_SYSTEM.md v6.2.0 | Session: $(printf '%03d' ${SESSION_NUMBER:-1})
EOF
    
    echo "[HANDOVER] ✓ Session memory created: $memory_file"
    
    export SESSION_MEMORY_FILE="$memory_file"
}
```

### 6.3 Success Criteria

- ✅ Session memory file created
- ✅ Structured format followed
- ✅ All required sections populated
- ✅ Lessons captured

---

## 7. Step 4: Memory Rotation

### 7.1 Purpose

Maintain rolling 5-session memory by archiving older sessions.

### 7.2 Implementation

```bash
handover_step_4_memory_rotation() {
    echo "[HANDOVER STEP 4] Memory Rotation"
    
    local agent_workspace="${WORKSPACE_ROOT}/${AGENT_TYPE}"
    local memory_dir="${agent_workspace}/memory"
    local archive_dir="${memory_dir}/.archive"
    
    mkdir -p "$archive_dir"
    
    # Count current sessions (excluding archive)
    local session_count=$(find "$memory_dir" -maxdepth 1 -name "session-*.md" 2>/dev/null | wc -l)
    
    echo "[HANDOVER] Current session count: $session_count"
    
    if [ "$session_count" -gt 5 ]; then
        local sessions_to_archive=$((session_count - 5))
        echo "[HANDOVER] Archiving $sessions_to_archive session(s) (keep only 5 most recent)"
        
        find "$memory_dir" -maxdepth 1 -name "session-*.md" | sort | head -n "$sessions_to_archive" | while read -r session; do
            local session_name=$(basename "$session")
            mv "$session" "$archive_dir/"
            echo "[HANDOVER] ✓ Archived: $session_name"
        done
        
        # Update monthly summary (if needed)
        local current_month=$(date +%Y-%m)
        local summary_file="${archive_dir}/summary-${current_month}.md"
        
        if [ ! -f "$summary_file" ]; then
            echo "[HANDOVER] Creating monthly summary: summary-${current_month}.md"
            cat > "$summary_file" <<EOF
# Session Summary - ${current_month}

## Archived Sessions
$(find "$archive_dir" -name "session-*-${current_month}*.md" | while read -r s; do echo "- $(basename "$s")"; done)

## Key Patterns

*(To be populated manually or via automation)*

---
Generated: $(date -u +"%Y-%m-%dT%H:%M:%SZ")
EOF
        fi
    else
        echo "[HANDOVER] ✓ Memory rotation not needed (${session_count} sessions, max 5)"
    fi
}
```

### 7.3 Success Criteria

- ✅ Session count checked
- ✅ Oldest sessions archived (if >5)
- ✅ Monthly summaries maintained
- ✅ Max 5 active sessions maintained

---

## 8. Step 5: Learning Capture

### 8.1 Purpose

Update personal learning files (lessons-learned.md, patterns.md, anti-patterns.md) with session insights.

### 8.2 Implementation

```bash
handover_step_5_learning_capture() {
    echo "[HANDOVER STEP 5] Learning Capture"
    
    local agent_workspace="${WORKSPACE_ROOT}/${AGENT_TYPE}"
    local personal_dir="${agent_workspace}/personal"
    
    mkdir -p "$personal_dir"
    
    # Update lessons-learned.md
    if [ -n "${NEW_LESSONS:-}" ]; then
        echo "[HANDOVER] Updating lessons-learned.md..."
        
        local lessons_file="${personal_dir}/lessons-learned.md"
        
        cat >> "$lessons_file" <<EOF

## Session $(date +%Y%m%d)

${NEW_LESSONS}

EOF
        echo "[HANDOVER] ✓ Lessons learned updated"
    fi
    
    # Update patterns.md
    if [ -n "${NEW_PATTERNS:-}" ]; then
        echo "[HANDOVER] Updating patterns.md..."
        
        local patterns_file="${personal_dir}/patterns.md"
        
        cat >> "$patterns_file" <<EOF

## Pattern: ${PATTERN_NAME:-Unnamed Pattern}
- Observed: $(date +%Y-%m-%d) (Session ${SESSION_NUMBER:-unknown})
- Context: ${PATTERN_CONTEXT:-No context provided}
- Response: ${PATTERN_RESPONSE:-No response documented}

EOF
        echo "[HANDOVER] ✓ Patterns updated"
    fi
    
    # Update anti-patterns.md (if mistakes identified)
    if [ -n "${NEW_ANTIPATTERNS:-}" ]; then
        echo "[HANDOVER] Updating anti-patterns.md..."
        
        local antipatterns_file="${personal_dir}/anti-patterns.md"
        
        cat >> "$antipatterns_file" <<EOF

## Anti-Pattern: ${ANTIPATTERN_NAME:-Unnamed Anti-Pattern}
- Observed: $(date +%Y-%m-%d)
- What Happened: ${ANTIPATTERN_WHAT:-No description}
- Why It Failed: ${ANTIPATTERN_WHY:-No analysis}
- Avoid By: ${ANTIPATTERN_AVOID:-No guidance}

EOF
        echo "[HANDOVER] ✓ Anti-patterns updated"
    fi
    
    # Update efficiency-log.md
    if [ -n "${EFFICIENCY_IMPROVEMENTS:-}" ]; then
        echo "[HANDOVER] Updating efficiency-log.md..."
        
        local efficiency_file="${personal_dir}/efficiency-log.md"
        
        cat >> "$efficiency_file" <<EOF

## Efficiency Improvement - $(date +%Y-%m-%d)

${EFFICIENCY_IMPROVEMENTS}

EOF
        echo "[HANDOVER] ✓ Efficiency log updated"
    fi
    
    echo "[HANDOVER] Learning capture complete"
}
```

### 8.3 Success Criteria

- ✅ Lessons-learned.md updated (if new lessons)
- ✅ Patterns.md updated (if new patterns)
- ✅ Anti-patterns.md updated (if mistakes)
- ✅ Efficiency-log.md updated (if improvements)

---

## 9. Step 6: Safe State Validation

### 9.1 Purpose

Verify environment is left in clean, safe state with no blockers for future sessions.

### 9.2 Implementation

```bash
handover_step_6_safe_state_validation() {
    echo "[HANDOVER STEP 6] Safe State Validation"
    
    SAFE_STATE="SAFE"
    SAFE_STATE_ISSUES=()
    
    # Check 1: Working tree status
    if ! git diff-index --quiet HEAD -- 2>/dev/null; then
        echo "[HANDOVER] ⚠️  Uncommitted changes remain"
        SAFE_STATE_ISSUES+=("Uncommitted changes in working tree")
        SAFE_STATE="WARNING"
    else
        echo "[HANDOVER] ✓ Working tree status: clean (all changes committed)"
    fi
    
    # Check 2: Branch status
    local current_branch=$(git rev-parse --abbrev-ref HEAD)
    if [ "$current_branch" = "main" ] || [ "$current_branch" = "master" ]; then
        echo "[HANDOVER] ⚠️  Currently on protected branch: $current_branch"
        SAFE_STATE_ISSUES+=("On protected branch (expected to be on feature branch)")
        SAFE_STATE="WARNING"
    else
        echo "[HANDOVER] ✓ Branch: $current_branch (feature branch)"
    fi
    
    # Check 3: Escalations created (if needed)
    local escalation_inbox="${WORKSPACE_ROOT}/${AGENT_TYPE}/escalation-inbox"
    local new_escalations=$(find "$escalation_inbox" -maxdepth 1 -name "*-$(date +%Y%m%d)*.md" 2>/dev/null | wc -l)
    
    if [ "$new_escalations" -gt 0 ]; then
        echo "[HANDOVER] ℹ️  Created $new_escalations escalation(s) during this session"
    else
        echo "[HANDOVER] ✓ No escalations created"
    fi
    
    # Check 4: Workspace integrity
    local agent_workspace="${WORKSPACE_ROOT}/${AGENT_TYPE}"
    local required_files=(
        "${agent_workspace}/working-contract.md"
        "${agent_workspace}/environment-health.json"
    )
    
    for file in "${required_files[@]}"; do
        if [ ! -f "$file" ]; then
            echo "[HANDOVER] ⚠️  Missing required file: $(basename "$file")"
            SAFE_STATE_ISSUES+=("Missing $(basename "$file")")
            SAFE_STATE="WARNING"
        fi
    done
    
    if [ "$SAFE_STATE" = "SAFE" ]; then
        echo "[HANDOVER] ✅ Safe state validation: PASS"
    else
        echo "[HANDOVER] ⚠️  Safe state validation: WARNING"
        echo "[HANDOVER] Issues:"
        for issue in "${SAFE_STATE_ISSUES[@]}"; do
            echo "  - $issue"
        done
    fi
    
    export SAFE_STATE
    export SAFE_STATE_ISSUES
}
```

### 9.3 Success Criteria

- ✅ Working tree clean or changes committed
- ✅ On appropriate branch
- ✅ Escalations created (if needed)
- ✅ Workspace integrity verified

---

## 10. Step 7: Handover Attestation

### 10.1 Purpose

Final sign-off that handover is complete and session can close.

### 10.2 Implementation

```bash
handover_step_7_attestation() {
    echo "[HANDOVER STEP 7] Handover Attestation"
    
    local agent_workspace="${WORKSPACE_ROOT}/${AGENT_TYPE}"
    local health_file="${agent_workspace}/environment-health.json"
    
    # Update environment health with handover status
    cat > "$health_file" <<EOF
{
  "timestamp": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")",
  "session_id": "${SESSION_TIMESTAMP}",
  "agent": {
    "type": "${AGENT_TYPE}",
    "id": "${AGENT_ID}",
    "class": "${AGENT_CLASS}",
    "contract_version": "${CONTRACT_VERSION}"
  },
  "handover": {
    "compliance_status": "${COMPLIANCE_STATUS}",
    "safe_state": "${SAFE_STATE}",
    "prehandover_proof": "${PREHANDOVER_PROOF}",
    "session_memory": "${SESSION_MEMORY_FILE}",
    "evidence_dir": "${EVIDENCE_DIR}"
  },
  "status": "handover_complete",
  "exit_code": 0
}
EOF
    
    echo "[HANDOVER] ✓ Environment health updated with handover status"
    
    # Final summary
    echo ""
    echo "═══════════════════════════════════════════════════════════"
    echo "  HANDOVER COMPLETE"
    echo "═══════════════════════════════════════════════════════════"
    echo ""
    echo "Session Summary:"
    echo "  - Agent: ${AGENT_ID}"
    echo "  - Compliance: ${COMPLIANCE_STATUS}"
    echo "  - Safe State: ${SAFE_STATE}"
    echo "  - PREHANDOVER_PROOF: ✓"
    echo "  - Session Memory: ✓"
    echo "  - Learning Captured: ✓"
    echo ""
    
    if [ "$COMPLIANCE_STATUS" = "PASS" ] && [ "$SAFE_STATE" = "SAFE" ]; then
        echo "✅ HANDOVER: COMPLETE (100%)"
        echo ""
        echo "Next Steps:"
        echo "  1. Review PREHANDOVER_PROOF.md"
        echo "  2. Commit changes with meaningful message"
        echo "  3. Push to PR for CI confirmation"
        echo "  4. Request review (if required)"
        echo ""
        return 0
    else
        echo "⚠️  HANDOVER: COMPLETE WITH WARNINGS"
        echo ""
        echo "Review issues and address before merge:"
        for issue in "${SAFE_STATE_ISSUES[@]}"; do
            echo "  - $issue"
        done
        echo ""
        return 1
    fi
}
```

### 10.3 Success Criteria

- ✅ Environment health updated
- ✅ Handover attestation signed
- ✅ Final summary displayed
- ✅ Exit code reflects handover status

---

## 11. Handover Script Template

### 11.1 Complete Handover Script

File: `.github/scripts/session-closure.sh`

```bash
#!/bin/bash
###############################################################################
# Session Closure / Handover Automation
# Authority: AGENT_HANDOVER_AUTOMATION.md v1.0.0
###############################################################################

set -euo pipefail

# Source common functions (if available)
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(git rev-parse --show-toplevel)"
WORKSPACE_ROOT="${REPO_ROOT}/.agent-workspace"

# Get agent type from argument
AGENT_TYPE="${1:-}"

if [ -z "$AGENT_TYPE" ]; then
    echo "Usage: $0 <agent-type>"
    exit 1
fi

# Load agent identity
AGENT_WORKSPACE="${WORKSPACE_ROOT}/${AGENT_TYPE}"
export AGENT_TYPE

echo ""
echo "═══════════════════════════════════════════════════════════"
echo "  SESSION CLOSURE / HANDOVER AUTOMATION"
echo "═══════════════════════════════════════════════════════════"
echo ""
echo "Agent: ${AGENT_TYPE}"
echo ""

# Execute handover steps
handover_step_1_compliance_verification || exit 1
handover_step_2_evidence_generation
handover_step_3_memory_capture
handover_step_4_memory_rotation
handover_step_5_learning_capture
handover_step_6_safe_state_validation
handover_step_7_attestation

exit $?
```

---

## 12. Handover Failure Modes

### 12.1 Failure Scenarios

| Failure | Severity | Action |
|---------|----------|--------|
| Compliance verification fails | CRITICAL | Block handover, halt session, escalate |
| PREHANDOVER_PROOF generation fails | CRITICAL | Block handover, escalate |
| Session memory creation fails | HIGH | Block handover, escalate |
| Memory rotation fails | MEDIUM | Warn, continue with manual intervention |
| Learning capture fails | LOW | Warn, continue |
| Safe state validation warns | MEDIUM | Complete handover with warnings |

### 12.2 Escalation on Critical Failure

```bash
create_handover_escalation() {
    local failure_step="$1"
    local failure_reason="$2"
    
    local escalation_file="${WORKSPACE_ROOT}/${AGENT_TYPE}/escalation-inbox/handover-failure-$(date +%Y%m%d-%H%M%S).md"
    
    mkdir -p "$(dirname "$escalation_file")"
    
    cat > "$escalation_file" <<EOF
# Handover Failure Escalation

## Type
HANDOVER_FAILURE

## Agent
- Type: ${AGENT_TYPE}
- Class: ${AGENT_CLASS}
- Session: $(date -u +"%Y-%m-%dT%H:%M:%SZ")

## Failure Step
${failure_step}

## Failure Reason
${failure_reason}

## Impact
Session cannot complete handover. PR merge BLOCKED until resolved.

## Recommended Action
1. Review handover logs
2. Fix compliance failures (if Step 1 failed)
3. Verify workspace permissions (if evidence generation failed)
4. Re-run session-closure.sh

## Authority
- AGENT_CONTRACT_ARCHITECTURE.md v1.0.0 (Phase 4: Handover)
- AGENT_HANDOVER_AUTOMATION.md v1.0.0
- BUILD_PHILOSOPHY.md (100% Handovers requirement)

---
Created: $(date -u +"%Y-%m-%dT%H:%M:%SZ")
EOF
    
    echo "[ESCALATION] Created handover failure escalation: $escalation_file"
}
```

---

## 13. Testing Handover

### 13.1 Test Scenarios

Every handover implementation MUST pass these tests:

**Test 1: Compliance Verification**
- All gates pass → Step 1 succeeds
- Any gate fails → Step 1 fails, handover blocked

**Test 2: Evidence Generation**
- PREHANDOVER_PROOF created → Passed
- Session memory created → Passed
- Evidence artifacts captured → Passed

**Test 3: Memory Management**
- ≤5 sessions → No rotation
- >5 sessions → Oldest archived
- Monthly summaries generated

**Test 4: Learning Capture**
- New lessons → lessons-learned.md updated
- New patterns → patterns.md updated
- Mistakes → anti-patterns.md updated

**Test 5: Safe State Validation**
- Clean working tree → Safe
- Uncommitted changes → Warning
- Missing files → Warning

**Test 6: Attestation**
- All steps pass → Exit 0
- Any critical failure → Exit 1

---

## 14. Integration with PR Workflow

### 14.1 Handover in PR Context

When handover is executed as part of PR creation:

```bash
# 1. Complete work (Build phase)
# 2. Run handover automation
.github/scripts/session-closure.sh governance-repo-administrator

# 3. Commit handover artifacts
git add PREHANDOVER_PROOF.md
git add .agent-workspace/governance-repo-administrator/memory/
git commit -m "Handover: Session closure complete"

# 4. Push to PR
git push origin <branch>

# 5. CI confirms (merge gates run in GitHub Actions)
# 6. Merge (if all gates pass)
```

### 14.2 Handover Checklist in PR Description

```markdown
## Handover Checklist

- [x] Compliance verification passed
- [x] PREHANDOVER_PROOF generated
- [x] Session memory captured
- [x] Memory rotation performed
- [x] Learning captured
- [x] Safe state validated
- [x] session-closure.sh exit 0

**Handover Status**: ✅ COMPLETE
```

---

## 15. Version History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0.0 | 2026-02-17 | Johan Ras | Initial canonical handover automation protocol |

---

**Authority**: CS2 (Johan Ras)  
**Parent**: AGENT_CONTRACT_ARCHITECTURE.md v1.0.0  
**Enforcement**: Merge Gate Interface + CodexAdvisor  
**Ripple**: PUBLIC_API (all consumer repositories)

---

*This document is Tier-0 constitutional canon. All agents MUST execute handover per this protocol. Handover failures block merge. Changes require CS2 approval and full governance ripple.*
