# AGENT_HANDOVER_AUTOMATION

**Status**: CANONICAL | **Version**: 1.1.2 | **Authority**: CS2  
**Date**: 2026-02-24

---

## Purpose

Defines the **canonical Handover phase** (Phase 4) of the four-phase agent contract architecture. This phase automates evidence generation, session memory capture, memory rotation, and safe handover state verification.

## Problem This Solves

Traditional agent workflows:
- **Manual evidence creation**: Agents forget to document work, create inconsistent evidence
- **No memory**: Each session starts from scratch, repeating mistakes
- **No learning capture**: Lessons and patterns lost between sessions
- **Manual compliance checks**: QA verification depends on agent diligence
- **Unsafe handovers**: Environment left in unknown state

**Handover automation solves this** by scripting evidence generation, memory management, and compliance verification - making governance adherence automatic, not optional.

## Handover Phase Structure

Phase 4 consists of four mandatory sections:

```markdown
## PHASE 4: HANDOVER SCRIPT (AUTOMATED EVIDENCE/COMPLIANCE/CLOSURE)

### 4.1 Evidence Artifact Generation
### 4.2 Session Memory & Closure
### 4.3 Pre-Handover Merge Gate Parity Check (mandatory, BLOCKING)
### 4.4 Compliance Check & Escalation (if needed)
```

## Section 4.1: Evidence Artifact Generation

**Purpose**: Automate creation of machine-readable and human-readable evidence per governance requirements.

**Template**:

```markdown
### 4.1 Evidence Artifact Generation (Priority_H)

**Script**: Evidence generation is automated via session closure

**Evidence Structure**:
```bash
#!/bin/bash
# <Agent> Handover - Evidence Generation
# Priority: <Agent>_H (mandatory for every governed PR)

echo "📦 EVIDENCE ARTIFACT GENERATION"

TIMESTAMP=$(date -u +"%Y%m%dT%H%M%SZ")
SESSION_ID="${SESSION_ID:-$(date +%Y%m%d-%H%M%S)}"
AGENT_TYPE="<agent-type>"

# <Agent>_H: Create evidence structure
mkdir -p .agent-admin/{prehandover,gates,rca,improvements,governance}

# <Agent>_H: Generate gate results (machine-readable)
cat > .agent-admin/gates/gate-results-${TIMESTAMP}.json <<EOF
{
  "timestamp": "${TIMESTAMP}",
  "session_id": "${SESSION_ID}",
  "agent": "${AGENT_TYPE}",
  "verdict": "<PASS|FAIL|DEGRADED>",
  "gates": {
    "merge-gate/verdict": {
      "status": "<PASS|FAIL>",
      "details": {
        <gate-specific details>
      }
    },
    "governance/alignment": {
      "status": "<PASS|FAIL|DEGRADED>",
      "canon_state": "<ALIGNED|DEGRADED>",
      "placeholder_count": <N>
    },
    "stop-and-fix/enforcement": {
      "status": "<PASS|FAIL>"
    }
  }
}
EOF

# <Agent>_H: Generate prehandover proof (human-readable)
cat > .agent-admin/prehandover/proof-${TIMESTAMP}.md <<EOF
# Prehandover Proof - <Task Summary>

**Agent**: ${AGENT_TYPE}
**Session**: ${SESSION_ID}
**Priority**: <Agent>_H
**Status**: <COMPLETE|PARTIAL|ESCALATED>

## Evidence
<Evidence checklist specific to agent class>

## Merge Gate Verdict
<PASS|FAIL> - <Rationale>

## Compliance
<Agent-specific compliance verification>

---
Authority: EVIDENCE_ARTIFACT_BUNDLE_STANDARD.md
Generated: ${TIMESTAMP}
EOF

echo "✅ [<Agent>_H] Evidence artifacts generated"
\`\`\`

**Commentary**: Automated evidence generation per governance requirements.
```

**Evidence File Structure**:

```
.agent-admin/
├── gates/
│   └── gate-results-<timestamp>.json      # Machine-readable gate results
├── prehandover/
│   └── proof-<timestamp>.md               # Human-readable completion proof
├── rca/
│   └── analysis-<timestamp>.md            # Root cause analysis (if failures)
├── improvements/
│   └── capture-<timestamp>.md             # Enhancement opportunities found
└── governance/
    ├── sync_state.json                    # Canonical alignment state
    └── degraded-alignment-<date>.json     # Degraded mode marker (if applicable)
```

### Evidence Artifact Types

| Artifact | Format | When Required | Purpose |
|----------|--------|---------------|---------|
| **Gate Results** | JSON | Every session | Machine-readable pass/fail for CI/CD |
| **Prehandover Proof** | Markdown | Every session | Human-readable evidence summary |
| **RCA** | Markdown | When failures occur | Root cause analysis per STOP_AND_FIX |
| **Improvements** | Markdown | When enhancements found | Mandatory enhancement capture |
| **Sync State** | JSON | When canon changes | Governance alignment tracking |

### Evidence Requirements by Agent Class

**Supervisor (Foreman)**:
```markdown
## Evidence
✅ Architecture designed (PLAN)
✅ Red QA created (ORCHESTRATE)  
✅ Builder appointed and supervised (LEAD)
✅ 100% GREEN verified (CHECK)
✅ Zero test debt confirmed
✅ All gates PASS
```

**Builder**:
```markdown
## Evidence
✅ All Red QA tests GREEN (100%, zero failures)
✅ Lint validation PASS (0 errors, 0 warnings)
✅ Type-check validation PASS (0 errors)
✅ Build validation PASS (successful build)
✅ Test coverage: <N>%
✅ Zero skipped/disabled tests
✅ Zero test debt (no stubs/TODOs)
✅ Code quality checks PASS
✅ Static analysis gates PASS (lint/type/build)
✅ Handover documentation complete
✅ CLI/CI evidence attached for all gates
```

**Overseer (CodexAdvisor)**:
```markdown
## Evidence
✅ CANON_INVENTORY alignment verified
✅ Advisory guidance provided
✅ Agent factory operations compliant
✅ Cross-repo coordination complete
✅ Approval gates respected
```

**Administrator (Governance)**:
```markdown
## Evidence
✅ CANON_INVENTORY integrity verified
✅ Protected files enforcement checked
✅ Ripple propagation executed (if needed)
✅ CHANGELOG updated (if governance changes)
✅ Inventory synchronized
```

**QA**:
```markdown
## Evidence
✅ Test execution: <passed>/<total> (100% required)
✅ Coverage: <N>% (meets requirements)
✅ Flaky tests: <count> (zero expected)
✅ Performance: <metrics>
✅ Quality gates: PASS
```

## Section 4.2: Session Memory & Closure

**Purpose**: Automate session memory creation, rotation, and learning capture.

**Template**:

```markdown
### 4.2 Session Memory & Closure (Priority_M)

**Script**: Session closure automates memory and learning capture

**Session Closure Protocol**:
```bash
#!/bin/bash
# <Agent> Handover - Session Memory & Closure
# Priority: <Agent>_M

echo "💾 SESSION MEMORY & CLOSURE"

AGENT_TYPE="<agent-type>"
SESSION_ID="$(date +%Y%m%d-%H%M%S)"
WORKSPACE=".agent-workspace/${AGENT_TYPE}"

# <Agent>_M: Create session memory
SESSION_NUMBER=$(ls -1 "${WORKSPACE}/memory"/session-*.md 2>/dev/null | wc -l)
SESSION_NUMBER=$((SESSION_NUMBER + 1))
SESSION_FILE="${WORKSPACE}/memory/session-$(printf "%03d" ${SESSION_NUMBER})-$(date +%Y%m%d).md"

cat > "${SESSION_FILE}" <<EOF
# Session $(printf "%03d" ${SESSION_NUMBER}) - $(date +%Y%m%d) (Living Agent System v6.2.0)

## Agent
- Type: ${AGENT_TYPE}
- Class: <class>
- Session ID: ${SESSION_ID}

## Task
<What was I asked to do?>

## What I Did
### Files Modified
<List files with SHA256 checksums>

### Actions Taken
- Action 1: <description>
- Action 2: <description>

### Decisions Made
- Decision 1: <what and why>
- Decision 2: <what and why>

## Living Agent System Evidence
### Evidence Collection
- Evidence log: .agent-admin/prehandover/proof-*.md
- Status: <COMPLETE|PARTIAL>

### Ripple Status
- Ripple required: <YES|NO>
- Status: <if required, what was done>

### Governance Gap Progress
- Status: <any gaps addressed>

### Governance Hygiene
- Status: <any hygiene issues detected>

## Outcome
<✅ COMPLETE | ⚠️ PARTIAL | ❌ ESCALATED>

## Lessons
### What Worked Well
- <lesson 1>
- <lesson 2>

### What Was Challenging
- <challenge 1>
- <challenge 2>

### What Future Sessions Should Know
- <recommendation 1>
- <recommendation 2>

### <Agent-Specific> Insights
- <insight 1>
- <insight 2>

---
Authority: LIVING_AGENT_SYSTEM.md v6.2.0 | Session: $(printf "%03d" ${SESSION_NUMBER})
EOF

echo "✅ [<Agent>_M] Session memory created: ${SESSION_FILE}"

# <Agent>_M: Rotate memories (keep last 5)
MEMORY_COUNT=$(ls -1 "${WORKSPACE}/memory"/session-*.md 2>/dev/null | wc -l)
if [ "${MEMORY_COUNT}" -gt 5 ]; then
  echo "[<Agent>_M] Rotating memories (keeping last 5)..."
  mkdir -p "${WORKSPACE}/memory/.archive"
  ls -t "${WORKSPACE}/memory"/session-*.md | tail -n +6 | while read old_memory; do
    mv "${old_memory}" "${WORKSPACE}/memory/.archive/"
    echo "  Archived: $(basename "${old_memory}")"
  done
  echo "✅ [<Agent>_M] Memory rotation complete"
fi

# <Agent>_M: Update environment health
jq '.environment_health_status = "SAFE_FOR_HANDOVER" | .last_check = "'$(date -u +%Y-%m-%dT%H:%M:%SZ)'" | .session_id = "'${SESSION_ID}'"' \
  "${WORKSPACE}/environment-health.json" > "${WORKSPACE}/environment-health.json.tmp"
mv "${WORKSPACE}/environment-health.json.tmp" "${WORKSPACE}/environment-health.json"

echo "✅ SESSION CLOSURE COMPLETE"
echo "📦 Evidence: Complete and verified"
echo "💾 Memory: Saved and rotated"
echo "🔍 Environment: SAFE_FOR_HANDOVER"
\`\`\`

**Commentary**: Automated session closure per Living Agent System protocol.
```

### Session Memory Template

**File Path**: `.agent-workspace/<agent-type>/memory/session-NNN-YYYYMMDD.md`

**Required Sections**:
1. **Agent**: Type, class, session ID
2. **Task**: What was requested
3. **What I Did**: Files modified, actions taken, decisions made
4. **Living Agent System Evidence**: Evidence collection, ripple status, governance gaps, hygiene
5. **Outcome**: Complete/Partial/Escalated
6. **Lessons**: What worked, what was challenging, recommendations, agent-specific insights

### Memory Rotation Protocol

**Rule**: Keep last 5 sessions in `memory/`, archive older to `memory/.archive/`

**Process**:
1. Count sessions in `memory/`
2. If count > 5:
   - Move oldest sessions to `.archive/`
   - Keep 5 most recent in `memory/`
3. Log archived session filenames

**Monthly Archive Summary** (optional, Priority_L):
- Create `memory/.archive/summary-YYYYMM.md`
- Summarize key patterns from archived sessions
- Extract recurring lessons

### Personal Learning Files

**Lessons Learned** (`.agent-workspace/<agent>/personal/lessons-learned.md`):
```markdown
## Session YYYYMMDD

### Lesson: <Title>
- Context: <when this applies>
- Pattern: <what to watch for>
- Action: <what to do>

## Session YYYYMMDD

### Lesson: <Title>
...
```

**Patterns** (`.agent-workspace/<agent>/personal/patterns.md`):
```markdown
## Pattern: <Name>
- Observed: YYYY-MM-DD (Session NNN)
- Context: <when this occurs>
- Response: <how to handle>

## Pattern: <Name>
...
```

## Section 4.3: Pre-Handover Merge Gate Parity Check (mandatory, BLOCKING)

**Purpose**: Guarantee that every merge gate check passes locally before the PR is opened. Opening a PR with a failing gate is **prohibited** — it is the same class of violation as pushing directly to main.

**Template**:

```markdown
### 4.3 Pre-Handover Merge Gate Parity Check (Priority_H — BLOCKING)

**Script**: Run all merge gate checks locally before opening the PR

**Parity Check Protocol**:

> **Consumer note**: The closing fence of the bash block below uses escaped backticks (`` \`\`\` ``) to prevent Markdown fence collision inside this outer code block. When copying this template into an agent contract or script, replace every `` \`\`\` `` (backslash + three backticks) with ` ``` ` (three plain backticks).

```bash
#!/bin/bash
# <Agent> Handover - Pre-Handover Merge Gate Parity Check
# Priority: <Agent>_H  — BLOCKING: do NOT open PR until all checks PASS

echo "🔍 PRE-HANDOVER MERGE GATE PARITY CHECK (BLOCKING)"

GATE_FAILURES=()

# Step 1: Read required checks from agent contract YAML
# MERGE_GATE_CHECKS is the list from merge_gate_interface.required_checks
# e.g. MERGE_GATE_CHECKS=("merge-gate/verdict" "governance/alignment" "stop-and-fix/enforcement")

# Step 2: Run each check locally using the same script/ruleset CI will use
# and record a declared PASS or FAIL result

# merge-gate/verdict — run the same commands the CI verdict job runs
echo "  Running: merge-gate/verdict"
<verdict check commands>
VERDICT_RESULT=$?
if [ "${VERDICT_RESULT}" -ne 0 ]; then
  GATE_FAILURES+=("merge-gate/verdict: FAIL")
  echo "  ❌ merge-gate/verdict: FAIL"
else
  echo "  ✅ merge-gate/verdict: PASS"
fi

# governance/alignment — validate canon hashes locally
echo "  Running: governance/alignment"
if [ -f ".github/scripts/validate-canon-hashes.sh" ]; then
  bash .github/scripts/validate-canon-hashes.sh > /dev/null 2>&1
  ALIGNMENT_RESULT=$?
  if [ "${ALIGNMENT_RESULT}" -ne 0 ]; then
    GATE_FAILURES+=("governance/alignment: FAIL")
    echo "  ❌ governance/alignment: FAIL"
  else
    echo "  ✅ governance/alignment: PASS"
  fi
else
  echo "  ⚠️  governance/alignment: SKIPPED — .github/scripts/validate-canon-hashes.sh not found"
  echo "     Confirm whether absence of this script is expected before opening the PR."
fi

# stop-and-fix/enforcement — verify no open RCA blockers
echo "  Running: stop-and-fix/enforcement"
OPEN_BLOCKERS=$(find .agent-workspace -name "blocker-*.md" 2>/dev/null | wc -l)
if [ "${OPEN_BLOCKERS}" -gt 0 ]; then
  GATE_FAILURES+=("stop-and-fix/enforcement: FAIL (${OPEN_BLOCKERS} open blocker(s))")
  echo "  ❌ stop-and-fix/enforcement: FAIL (${OPEN_BLOCKERS} open blocker(s))"
else
  echo "  ✅ stop-and-fix/enforcement: PASS"
fi

# Step 3: Evaluate — if ANY check FAILED, STOP immediately
# Step 4: STOP — do NOT open the PR; fix and re-run from step 1
if [ ${#GATE_FAILURES[@]} -gt 0 ]; then
  echo ""
  echo "❌ [<Agent>_H] PRE-HANDOVER GATE PARITY FAILED — PR MUST NOT BE OPENED"
  echo "Failing gates:"
  for f in "${GATE_FAILURES[@]}"; do echo "  - ${f}"; done
  echo ""
  echo "ACTION REQUIRED: Fix all failing gates above, then re-run this check from step 1."
  echo "Escalation is only appropriate for ambiguous blockers, NOT for gate failures."
  echo "Opening a PR on a local gate failure is PROHIBITED (same class as pushing to main)."
  exit 1
fi

# Step 5: All checks PASS — agent may proceed to open the PR
echo ""
echo "✅ [<Agent>_H] ALL MERGE GATE PARITY CHECKS PASSED"
echo "✅ [<Agent>_H] Agent is cleared to open the PR"
\`\`\`

**Commentary**: This check is **BLOCKING**. If any gate fails the agent **stops, fixes the issue, and re-runs from step 1**. Escalation is reserved for ambiguous blockers only — failing merge gates must be fixed before the PR is opened.
```

### Merge Gate Parity Rules

| Rule | Detail |
|------|--------|
| **BLOCKING** | Gate failures halt handover; the PR must not be opened |
| **Fix-first** | Agent fixes the root cause and re-runs all checks from step 1 |
| **No partial bypass** | Every required check must produce a declared PASS result |
| **Escalation scope** | Only for genuinely ambiguous blockers — not for known gate failures |
| **Prohibition parity** | Opening a PR on a local gate failure = pushing to main (both prohibited) |

### Agent Contract File Modification Prohibition (CONSTITUTIONAL — added v1.1.2)

> **ABSOLUTE RULE**: During pre-handover and all other phases, NO agent (other than CodexAdvisor with explicit CS2 permission) may modify `.github/agents/` contract files.

If a handover or ripple operation requires changes to `.github/agents/` files, the agent **MUST**:

1. **STOP** — do NOT make any write to `.github/agents/`
2. **Create a structured escalation** documenting the required changes
3. **CS2 reviews and authorizes** via a layer-down issue to CodexAdvisor
4. **CodexAdvisor executes** the approved changes; IAA audits before merge

**Handoff escalation template** (create at `.agent-workspace/<agent>/escalation-inbox/agent-contract-modification-YYYYMMDD.md`):

```markdown
# Escalation: Agent Contract Modification Required

## Type
AGENT_CONTRACT_MODIFICATION_REQUEST

## Files Requiring Modification
- `.github/agents/<file>`: <what change and why>

## Originating Ripple / Issue
<Reference to the triggering canon change or issue>

## Proposed Diff Specification
<Exact proposed changes — CS2 reviews and approves before CodexAdvisor executes>

## Authority
Per AGENT_CONTRACT_FILE_PROTECTION_POLICY.md §1:
Only CodexAdvisor with CS2 permission may modify .github/agents/ files.
This escalation requests CS2 review and CodexAdvisor invocation.

---
Created: <timestamp>
Agent: <agent-type>
```

**Full policy**: `governance/canon/AGENT_CONTRACT_FILE_PROTECTION_POLICY.md`  
**Incident reference**: `governance/incidents/INCIDENT-2026-02-24-PR517-AGENT-CONTRACT-BREACH.md`



**Purpose**: Verify agent-class-specific compliance requirements and create escalations if needed.

**Template**:

```markdown
### 4.4 <Agent-Specific> Compliance Check (Priority_H)

**Script**: Verify compliance; fix ALL issues before proceeding — escalation only for ambiguous blockers

**Compliance Verification**:
```bash
#!/bin/bash
# <Agent> Handover - Compliance Check
# Priority: <Agent>_H

echo "✅ <AGENT-SPECIFIC> COMPLIANCE CHECK"

COMPLIANCE_ISSUES=()

# Check 1: <Agent-specific requirement>
<check logic>
[ <condition> ] && COMPLIANCE_ISSUES+=("<Issue description>")

# Check 2: <Agent-specific requirement>
<check logic>
[ <condition> ] && COMPLIANCE_ISSUES+=("<Issue description>")

# Check 3: <Agent-specific requirement>
<check logic>
[ <condition> ] && COMPLIANCE_ISSUES+=("<Issue description>")

# <Agent>_H: Evaluate compliance
if [ ${#COMPLIANCE_ISSUES[@]} -gt 0 ]; then
  echo "❌ [<Agent>_H] COMPLIANCE FAILED"
  echo "Issues: ${COMPLIANCE_ISSUES[@]}"
  
  # ALL compliance issues MUST be fixed before proceeding.
  # Escalation documents are only created for genuinely ambiguous blockers —
  # routine compliance failures (failing tests, missing artifacts, etc.) must be
  # resolved by the agent before the PR is opened, not handed off to CI or CS2.
  echo ""
  echo "ACTION REQUIRED: Fix ALL issues listed above and re-run compliance check."
  echo "Do NOT open the PR until every compliance check passes."
  echo ""
  echo "If (and only if) a blocker is genuinely ambiguous and cannot be resolved"
  echo "within authority, create a structured escalation document and halt:"
  mkdir -p .agent-workspace/<agent>/escalation-inbox
  cat > .agent-workspace/<agent>/escalation-inbox/compliance-failure-$(date +%Y%m%d).md <<EOF
# Escalation: Compliance Failure (Ambiguous Blocker)

## Type
BLOCKER

## Priority
<Agent>_H

## Description
<Agent-specific> compliance check failed with an ambiguous blocker that cannot
be resolved within agent authority.

## Issues
$(for issue in "${COMPLIANCE_ISSUES[@]}"; do echo "- ${issue}"; done)

## Context
Session: ${SESSION_ID}
Agent: <agent-type>
Phase: Handover

## Recommendation
<Agent-specific remediation>

## Note
Escalation is only appropriate for ambiguous blockers. Routine failures
(test failures, missing artifacts, gate failures) MUST be fixed by the
agent — do not escalate resolvable issues.

---
Created: $(date -u +%Y-%m-%dT%H:%M:%SZ)
EOF
  
  exit 1
else
  echo "✅ [<Agent>_H] Compliance VERIFIED"
  echo "✅ [<Agent>_H] Ready for safe handover"
fi
\`\`\`

**Commentary**: Automated compliance checking. ALL issues must be fixed before the PR is opened. Escalation documents are reserved for genuinely ambiguous blockers that cannot be resolved within agent authority.
```

### Compliance Checks by Agent Class

**Supervisor (Foreman)**:
```bash
# Check 1: 100% GREEN
[ "${FAILED_TESTS}" -gt 0 ] && COMPLIANCE_ISSUES+=("NOT 100% GREEN")

# Check 2: Zero test debt
DEBT_COUNT=$(grep -rE '\\.skip\\(|\\.todo\\(|// TODO' tests/ 2>/dev/null | wc -l)
[ "${DEBT_COUNT}" -gt 0 ] && COMPLIANCE_ISSUES+=("Test debt detected: ${DEBT_COUNT}")

# Check 3: Evidence artifacts
[ $(ls .agent-admin/prehandover/proof-*.md 2>/dev/null | wc -l) -eq 0 ] && \
  COMPLIANCE_ISSUES+=("Missing prehandover proof")

# Check 4: Builder supervision complete
[ ! -f .agent-workspace/foreman/builder-tasks/completed-*.md ] && \
  COMPLIANCE_ISSUES+=("Builder task not marked complete")
```

**Builder**:
```bash
# Check 1: All Red QA tests pass
[ "${FAILED_TESTS}" -gt 0 ] && COMPLIANCE_ISSUES+=("Failed tests: ${FAILED_TESTS}")

# Check 2: No skipped tests
[ "${SKIPPED_TESTS}" -gt 0 ] && COMPLIANCE_ISSUES+=("Skipped tests: ${SKIPPED_TESTS}")

# Check 3: Lint validation PASS (0 errors, 0 warnings)
# Note: Customize command for your repository (yarn/npm/pnpm lint, eslint, pylint, etc.)
LINT_EXIT_CODE=$(yarn lint > /dev/null 2>&1; echo $?)
[ "${LINT_EXIT_CODE}" -ne 0 ] && COMPLIANCE_ISSUES+=("Lint failed: exit code ${LINT_EXIT_CODE}")

# Check 4: Type-check validation PASS (0 errors)
# Note: Adapt command and condition for your repository's type system
if command -v tsc &> /dev/null || [ -f "package.json" ]; then
  TYPECHECK_EXIT_CODE=$(yarn type-check > /dev/null 2>&1; echo $?)
  [ "${TYPECHECK_EXIT_CODE}" -ne 0 ] && COMPLIANCE_ISSUES+=("Type-check failed: exit code ${TYPECHECK_EXIT_CODE}")
fi

# Check 5: Build validation PASS
# Note: Customize command for your repository (yarn/npm build, make, cargo build, etc.)
BUILD_EXIT_CODE=$(yarn build > /dev/null 2>&1; echo $?)
[ "${BUILD_EXIT_CODE}" -ne 0 ] && COMPLIANCE_ISSUES+=("Build failed: exit code ${BUILD_EXIT_CODE}")

# Check 6: Code coverage meets requirement
[ "${COVERAGE_PCT}" -lt "${REQUIRED_COVERAGE}" ] && \
  COMPLIANCE_ISSUES+=("Coverage ${COVERAGE_PCT}% < required ${REQUIRED_COVERAGE}%")

# Check 7: Handover documentation with static gate evidence
[ ! -f .agent-admin/prehandover/proof-*.md ] && \
  COMPLIANCE_ISSUES+=("Missing handover proof")

# Check 8: Static gate evidence in prehandover proof
if [ -f .agent-admin/prehandover/proof-*.md ]; then
  grep -q "Static Analysis & Build Gates" .agent-admin/prehandover/proof-*.md || \
    COMPLIANCE_ISSUES+=("Missing static analysis gates section in handover proof")
fi
```

**Overseer (CodexAdvisor)**:
```bash
# Check 1: CANON_INVENTORY alignment verified
[ ! -f .agent-admin/governance/sync_state.json ] && \
  COMPLIANCE_ISSUES+=("Missing alignment verification")

# Check 2: Approval obtained (if required)
if [ "${APPROVAL_REQUIRED}" = "true" ] && [ "${APPROVAL_OBTAINED}" != "true" ]; then
  COMPLIANCE_ISSUES+=("Approval required but not obtained")
fi

# Check 3: Agent factory compliance (if agent files created)
AGENT_FILES=$(find .github/agents -name "*.agent.md" -newer .agent-admin/session-start.marker 2>/dev/null)
if [ -n "${AGENT_FILES}" ]; then
  # Verify compliance checks...
  :
fi
```

**Administrator (Governance)**:
```bash
# Check 1: CANON_INVENTORY integrity
if ! jq -e '.constitutional_canon' governance/CANON_INVENTORY.json > /dev/null 2>&1; then
  COMPLIANCE_ISSUES+=("CANON_INVENTORY integrity check failed")
fi

# Check 2: Protected file enforcement
if [ -n "$(git diff --name-only | grep -E '^governance/canon/|^\.github/workflows/')" ]; then
  # Check for CS2 approval...
  :
fi

# Check 3: Ripple propagation (if canon changed)
if [ -n "$(git diff --name-only | grep '^governance/canon/')" ]; then
  [ ! -f .agent-admin/governance/ripple-executed-*.json ] && \
    COMPLIANCE_ISSUES+=("Canon changed but ripple not executed")
fi
```

**QA**:
```bash
# Check 1: 100% test pass
[ "${FAILED_TESTS}" -gt 0 ] && COMPLIANCE_ISSUES+=("Failed tests: ${FAILED_TESTS}")

# Check 2: No flaky tests
FLAKY_COUNT=$(grep -c "flaky" .agent-admin/qa/test-results-*.json 2>/dev/null || echo 0)
[ "${FLAKY_COUNT}" -gt 0 ] && COMPLIANCE_ISSUES+=("Flaky tests detected: ${FLAKY_COUNT}")

# Check 3: Coverage requirement
[ "${COVERAGE_PCT}" -lt "${MIN_COVERAGE}" ] && \
  COMPLIANCE_ISSUES+=("Coverage too low: ${COVERAGE_PCT}%")
```

## Escalation Document Template

**File Path**: `.agent-workspace/<agent>/escalation-inbox/<type>-<date>.md`

**Template**:
```markdown
# Escalation: <Title>

## Type
BLOCKER | GOVERNANCE_GAP | AUTHORITY_BOUNDARY | COMPLIANCE_FAILURE

## Priority
<Agent>_H | <Agent>_M

## Description
<What requires CS2 attention>

## Context
Session: <session-id>
Agent: <agent-type>
Phase: Handover
Task: <task summary>

## Issues
- Issue 1
- Issue 2

## Recommendation
<Proposed solution>

## Impact if Not Resolved
<What fails if blocker persists>

---
Created: <timestamp> | Session: <NNN>
```

## Handover Validation Checklist

Before session ends, verify:

- [ ] **Evidence artifacts generated**: Gate results (JSON) and prehandover proof (MD)
- [ ] **Session memory created**: Structured file in `memory/`
- [ ] **Memory rotated**: Last 5 kept, older archived
- [ ] **Personal learnings updated**: Lessons and patterns files updated
- [ ] **Environment health set**: Status = `SAFE_FOR_HANDOVER`
- [ ] **Pre-handover merge gate parity check PASSED**: All merge gate checks pass locally (BLOCKING — PR must not be opened until this is ✅)
- [ ] **Compliance checked**: Agent-specific requirements verified; ALL issues fixed before proceeding
- [ ] **Escalations created**: Only if genuinely ambiguous blockers remain that cannot be resolved within authority
- [ ] **Working contract archived**: Ephemeral file can be deleted

## Anti-Patterns to Avoid

| Anti-Pattern | Why It Fails | Correct Pattern |
|--------------|--------------|-----------------|
| **Manual evidence creation** | Inconsistent, forgotten | Automated script generates all evidence |
| **No memory rotation** | Memory directory grows unbounded | Always rotate, keep last 5 |
| **Skipping compliance checks** | Violations discovered at merge time | Always verify compliance before handover |
| **Opening PR with failing gates** | Gate failure is CI's problem, not agent's | Run merge gate parity check locally; fix ALL failures before opening PR |
| **Escalating resolvable failures** | Ambiguous — hides fixable issues | Escalation only for genuinely ambiguous blockers; fix routine failures directly |
| **No escalation creation** | Ambiguous blockers undocumented | Auto-generate escalation document when a blocker truly cannot be resolved within authority |
| **Vague session memory** | No actionable context for next session | Use structured template |
| **No environment health** | Unknown state at handover | Always record health status |

## Enforcement & Compliance

**Merge Gate Validation**:
- Verdict gate checks for `.agent-admin/prehandover/proof-*.md`
- Missing evidence → FAIL gate
- Compliance issues documented → FAIL gate

**Session Closure Validation**:
- Verifies session memory created
- Checks memory rotation occurred
- Confirms environment health = `SAFE_FOR_HANDOVER`

**CodeQL Security Check** (before final handover):
- Run security scan on changes
- Document vulnerabilities found
- Fix or escalate security issues

## Authority & Version

**Authority Source**: `governance/canon/AGENT_CONTRACT_ARCHITECTURE.md`  
**Prototype Source**: Foreman v2.0.0 Handover phase  
**Approval**: CS2 (Johan Ras)  
**Effective Date**: 2026-02-17

## Related Canon

- `governance/canon/AGENT_CONTRACT_ARCHITECTURE.md` - Four-phase overview
- `governance/canon/LIVING_AGENT_SYSTEM.md` - Living Agent framework
- `governance/canon/AGENT_PREFLIGHT_PATTERN.md` - Phase 1 template
- `governance/canon/AGENT_INDUCTION_PROTOCOL.md` - Phase 2 template
- `governance/canon/AGENT_PRIORITY_SYSTEM.md` - Priority codes
- `governance/canon/EVIDENCE_ARTIFACT_BUNDLE_STANDARD.md` - Evidence requirements

---

**Version**: 1.1.2  
**Last Updated**: 2026-02-24  
**Authority**: CS2 (Johan Ras)  
**Living Agent System**: v6.2.0
