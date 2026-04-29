# AGENT_HANDOVER_AUTOMATION

**Status**: CANONICAL | **Version**: 1.7.0 | **Authority**: CS2  
**Date**: 2026-02-24  
**Amended**: 2026-04-29 — v1.7.0: Updated §4.3d Scope-Declaration Parity Gate — Required Checks table split into two rows (diff count vs bullet entries, numeric field integrity); gate script extended with Check 4b validating FILES_CHANGED: N numeric field against bullet entry count; §4.3e Check B updated to use per-PR scope file (.agent-admin/scope-declarations/pr-${PR_NUMBER}.md) with fallback discovery, removing deprecated governance/scope-declaration.md check; AAP-04 updated to reference per-PR path and include numeric field check; authority: CS2 — issue #1359 (per-PR immutable scope declaration model — PR review feedback closure).  
**Amended**: 2026-04-21 — v1.6.0: Added §4.3e Check L (active-bundle token/session coherence) — scopes wave-tracker contradiction check to the wave declared in the PREHANDOVER proof (L1); validates that `iaa_audit_token` is not a placeholder and that the exact referenced token file is committed to the branch with a matching PR reference (L2); verifies `active_bundle_iaa_coherence` field (L3); added AAP-23 and AAP-24 to auto-fail rule table; updated Handover Validation Checklist to include coherence check; aligned with ISMS merged hardening baseline (parity catch-up wave); authority: CS2 — governance-repo ECAP/IAA parity catch-up issue.  
**Amended**: 2026-04-19 — v1.5.0: Hardened §4.3e Admin Ceremony Compliance Gate with gate-inventory checks (Check H), pre-final instruction wording denylist (Check I), cross-artifact final-state consistency with active-bundle scoping (Check J), and carried-forward claim verification (Check K); updated auto-fail rule table with AAP-15 through AAP-21; active-bundle scoping rule clarified to prevent false positives from historical archive; authority: CS2 — governance-repo hardening wave (gate-inventory + post-token normalization hardening).  
**Amended**: 2026-04-17 — v1.4.1: Tightened §4.3e Check C stale-wording scan to final-state artifact set only — superseded pre-token proofs retained immutably under the append-only model are now explicitly exempt; updated AAP-01 auto-fail rule to document final-state scope and superseded-proof exemption; authority: CS2 — PR review feedback on §4.3e canon collision with append-only proof retention.  
**Previous amendment**: 2026-04-17 — v1.4.0: Added §4.3e Admin Ceremony Compliance Gate (BLOCKING, pre-IAA, ECAP-involved jobs); added auto-fail rules table for 9 known admin anti-patterns (AAP-01 through AAP-09); updated Phase 4 structure and sequencing note; updated Handover Validation Checklist with admin-compliance gate item; authority: CS2 — issue: Canonize a 3-layer admin ceremony compliance stack for ECAP, Foreman QP, and IAA.  
**Previous amendment**: 2026-04-09 — v1.3.0: Post-ECAP-001 governance quality closure (ECAP-QC-001 through ECAP-QC-004) — added §4.3d Scope-Declaration Parity Gate (blocking, pre-IAA); added mandatory drift evidence and metadata correctness requirements to Administrator evidence checklist; updated validate-canon-hashes.sh to catch version/canonical_version mismatches; codified amended_date and timestamp discipline; authority: CS2 — ECAP-001 follow-up quality closure issue.  
**Previous amendment**: 2026-04-08 — v1.2.0: Added §4.3c Pre-IAA Commit-State Gate (canonical blocking step) — required immediately before every IAA invocation in all producing-agent contracts; defines mandatory git status / HEAD verification checks; adds guidance for recording commit-state evidence in PREHANDOVER proof; adds §PHASE_B_BLOCKING note for IAA deployment phase; authority: CS2 — pre-IAA handover discipline hardening issue.  
**Previous amendment**: 2026-04-08 — v1.1.5: Added §Phase 4 Terminal State Rule; explicitly forbade "remaining Phase 4 ceremony" and equivalent deferral language; clarified that `report_progress` for the final handover commit MUST NOT be called until all Phase 4 artifacts are committed (PREHANDOVER proof, session memory, IAA assurance artifact where required); authority: CS2 — OPOJD hardening issue.

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

> ### ⚠️ PHASE 4 TERMINAL STATE RULE (CONSTITUTIONAL — added v1.1.5)
>
> Phase 4 is not post-job administration. **Phase 4 is part of the job.**
>
> A job has exactly two valid terminal states:
>
> | State | Condition | `report_progress` permitted? |
> |-------|-----------|------------------------------|
> | **COMPLETE** | PREHANDOVER proof committed + session memory committed + IAA artifact committed (if required) | ✅ YES |
> | **BLOCKED / INCOMPLETE** | Any required Phase 4 artifact is absent | ❌ NO — do NOT call `report_progress` as a final handover commit |
>
> **Prohibited language** in handover commits or PR descriptions:
> - ❌ "remaining Phase 4 ceremony"
> - ❌ "PREHANDOVER still to be completed next session"
> - ❌ "IAA token still pending but job otherwise complete"
> - ❌ "work complete; evidence can follow"
>
> An agent in BLOCKED / INCOMPLETE state MUST complete the missing artifacts **before** calling `report_progress` on the final commit. Deferring Phase 4 to the next session is an OPOJD v2.1 violation.
>
> **Authority**: `governance/opojd/OPOJD_COMPLETE_JOB_HANDOVER_DOCTRINE.md` v2.1

Phase 4 consists of five mandatory sections:

```markdown
## PHASE 4: HANDOVER SCRIPT (AUTOMATED EVIDENCE/COMPLIANCE/CLOSURE)

### 4.1 Evidence Artifact Generation
### 4.2 Session Memory & Closure
### 4.3 Pre-Handover Merge Gate Parity Check (mandatory, BLOCKING)
### 4.3b Token Update Ceremony (IAA token — append-only, dedicated file)
### 4.3c Pre-IAA Commit-State Gate (mandatory, BLOCKING)
### 4.3d Scope-Declaration Parity Gate (mandatory, BLOCKING — governance PRs)
### 4.3e Admin Ceremony Compliance Gate (mandatory, BLOCKING — ECAP-involved jobs)
### 4.4 Compliance Check & Escalation (if needed)
```

> **Sequencing note**: §4.3c Pre-IAA Commit-State Gate MUST run immediately before IAA invocation (which each producing-agent contract places after §4.3c). §4.3d Scope-Declaration Parity Gate runs after §4.3c and before IAA invocation for all governance PRs (i.e., any PR modifying files under `governance/`, `.agent-admin/`, `.agent-workspace/`, or `.github/`). **§4.3e Admin Ceremony Compliance Gate runs after §4.3d and before IAA invocation for all jobs where an `execution-ceremony-admin-agent` was appointed.** §4.3b Token Update Ceremony runs after IAA has returned a verdict. The canonical ordering is: §4.3 → §4.3c → §4.3d (if governance PR) → §4.3e (if ECAP job) → IAA invocation → §4.3b → §4.4.

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
✅ CANON-HASH-001: `.github/scripts/validate-canon-hashes.sh` run — 0 failures confirmed
✅ Protected files enforcement checked
✅ Ripple propagation executed (if needed)
✅ CHANGELOG updated (if governance changes)
✅ Inventory synchronized
✅ Drift evidence: for each amended canon file, before/after SHA256 recorded in PREHANDOVER proof (ECAP-QC-001)
✅ `.agent-admin/scope-declarations/pr-${PR_NUMBER}.md` created/updated from `git diff --name-only origin/main...HEAD` as final pre-IAA action (ECAP-QC-002)
✅ version and canonical_version aligned for all amended CANON_INVENTORY entries (ECAP-QC-003)
✅ amended_date set to today's date for all amended CANON_INVENTORY entries (ECAP-QC-004)
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



## Section 4.3c: Pre-IAA Commit-State Gate (mandatory, BLOCKING)

**Purpose**: Guarantee that the working tree is clean and all intended deliverables are committed
at HEAD before IAA is invoked. IAA must assess the exact committed state that is being submitted
for assurance — not an in-progress or partially-committed working tree.

**Problem This Solves**: Producing agents can satisfy §4.3 local parity checks, generate artifacts,
and invoke IAA while still holding uncommitted changes or artifacts that exist only in the working
tree. This creates a commit-state / ceremony-state mismatch that IAA cannot detect at invocation
time but that causes avoidable REJECTION-PACKAGEs and repeated handover hygiene failures.

**Effective**: 2026-04-08 | **Authority**: CS2 | **Added**: v1.2.0

### Rule

> **ABSOLUTE RULE**: No producing-agent contract (Foreman, CodexAdvisor, builder) may invoke the IAA agent
> if the commit-state gate has not been explicitly run and returned a PASS result. A dirty working tree
> or uncommitted deliverable at IAA invocation time is a handover hygiene violation.

### Required Checks (minimum — all must PASS)

| Check | Command | PASS condition |
|-------|---------|----------------|
| Clean working tree | `git status --porcelain` | Output is empty |
| No unstaged diffs | `git diff --name-only` | Output is empty |
| HEAD is the review state | `git show --name-only --format=fuller HEAD` | Displays latest commit with all expected files |
| PREHANDOVER proof committed | `git show HEAD -- <proof-path>` | File present at HEAD |
| Session memory committed | `git show HEAD -- <memory-path>` | File present at HEAD |
| No post-commit mutation | check artifact timestamps vs commit | Artifacts not newer than last commit |

### Template

```markdown
### 4.3c Pre-IAA Commit-State Gate (<Agent>_H — BLOCKING)

**Authority**: `governance/canon/AGENT_HANDOVER_AUTOMATION.md` v1.2.0

> **ABSOLUTE RULE (OVF-002)**: This gate MUST pass before IAA is invoked. A dirty working tree
> or uncommitted deliverable at IAA invocation time is a handover hygiene violation.

> If this step is MISSING from a producing-agent contract, the contract is non-compliant with
> AGENT_HANDOVER_AUTOMATION.md v1.2.0 and the agent MUST halt and escalate.

> **Consumer note**: The closing fence of the bash block below uses escaped backticks (`` \`\`\` ``) to prevent Markdown fence collision inside this outer code block. When copying this template into an agent contract or script, replace every `` \`\`\` `` (backslash + three backticks) with ` ``` ` (three plain backticks).

```bash
#!/bin/bash
# <Agent> Handover - Pre-IAA Commit-State Gate
# Priority: <Agent>_H  — BLOCKING: do NOT invoke IAA until all checks PASS

echo "🔒 PRE-IAA COMMIT-STATE GATE (BLOCKING)"

COMMIT_STATE_FAILURES=()

# Check 1: Working tree must be clean
echo "  Checking: working tree status"
DIRTY_FILES=$(git status --porcelain 2>/dev/null)
if [ -n "${DIRTY_FILES}" ]; then
  COMMIT_STATE_FAILURES+=("dirty working tree — uncommitted changes present")
  echo "  ❌ Working tree: DIRTY"
  echo "     Dirty files:"
  git status --porcelain | while read f; do echo "       ${f}"; done
else
  echo "  ✅ Working tree: CLEAN"
fi

# Check 2: No unstaged diffs
echo "  Checking: unstaged diffs"
UNSTAGED=$(git diff --name-only 2>/dev/null)
if [ -n "${UNSTAGED}" ]; then
  COMMIT_STATE_FAILURES+=("unstaged diffs present: ${UNSTAGED}")
  echo "  ❌ Unstaged diffs: PRESENT (${UNSTAGED})"
else
  echo "  ✅ Unstaged diffs: NONE"
fi

# Check 3: PREHANDOVER proof exists at HEAD
echo "  Checking: PREHANDOVER proof at HEAD"
PROOF_FILES=$(git show HEAD --name-only --format="" 2>/dev/null | grep -E "prehandover|proof" | head -5)
PROOF_COUNT=$(ls .agent-admin/prehandover/proof-*.md 2>/dev/null | wc -l)
if [ "${PROOF_COUNT}" -eq 0 ]; then
  COMMIT_STATE_FAILURES+=("PREHANDOVER proof not found in working tree")
  echo "  ❌ PREHANDOVER proof: MISSING"
else
  # Verify proof is committed, not just present in working tree
  PROOF_PATH=$(ls .agent-admin/prehandover/proof-*.md 2>/dev/null | head -1)
  if git ls-files --error-unmatch "${PROOF_PATH}" > /dev/null 2>&1; then
    echo "  ✅ PREHANDOVER proof: COMMITTED at HEAD (${PROOF_PATH})"
  else
    COMMIT_STATE_FAILURES+=("PREHANDOVER proof exists in working tree but is NOT committed: ${PROOF_PATH}")
    echo "  ❌ PREHANDOVER proof: NOT COMMITTED (${PROOF_PATH})"
  fi
fi

# Check 4: Session memory exists at HEAD
echo "  Checking: session memory at HEAD"
MEMORY_PATH=$(ls .agent-workspace/<agent>/memory/session-*.md 2>/dev/null | head -1)
if [ -z "${MEMORY_PATH}" ]; then
  COMMIT_STATE_FAILURES+=("session memory not found")
  echo "  ❌ Session memory: MISSING"
else
  if git ls-files --error-unmatch "${MEMORY_PATH}" > /dev/null 2>&1; then
    echo "  ✅ Session memory: COMMITTED at HEAD (${MEMORY_PATH})"
  else
    COMMIT_STATE_FAILURES+=("session memory exists in working tree but is NOT committed: ${MEMORY_PATH}")
    echo "  ❌ Session memory: NOT COMMITTED (${MEMORY_PATH})"
  fi
fi

# Check 5: Show HEAD for audit trail
echo "  HEAD commit state:"
git show --name-only --format="    Commit: %H%n    Author: %an%n    Date:   %ad%n    Title:  %s" HEAD 2>/dev/null | head -20

# Evaluate
if [ ${#COMMIT_STATE_FAILURES[@]} -gt 0 ]; then
  echo ""
  echo "❌ [<Agent>_H] PRE-IAA COMMIT-STATE GATE FAILED — IAA MUST NOT BE INVOKED"
  echo "Failures:"
  for f in "${COMMIT_STATE_FAILURES[@]}"; do echo "  - ${f}"; done
  echo ""
  echo "ACTION REQUIRED: Commit all pending changes, re-run §4.3 parity check, then re-run this gate."
  echo "IAA invocation with a dirty or partially-committed working tree is a handover hygiene violation."
  exit 1
fi

echo ""
echo "✅ [<Agent>_H] PRE-IAA COMMIT-STATE GATE PASSED"
echo "✅ [<Agent>_H] Working tree is clean. All declared deliverables are committed at HEAD."
echo "✅ [<Agent>_H] Agent is cleared to invoke IAA."
\`\`\`

**Commentary**: This gate is **BLOCKING**. If any check fails:
1. Commit all pending changes that belong to this PR.
2. Re-run §4.3 Pre-Handover Merge Gate Parity Check from step 1.
3. Re-run this §4.3c Pre-IAA Commit-State Gate.
4. Only then invoke IAA.
```

### Recording Commit-State Evidence in PREHANDOVER Proof

After §4.3c PASS, record the commit-state evidence in the PREHANDOVER proof before committing it.
The PREHANDOVER proof MUST include (or the check output must be preserved as evidence):

```markdown
## Commit-State Evidence (§4.3c)

- working_tree_status: CLEAN
- unstaged_diffs: NONE
- prehandover_proof_committed: YES — <path>
- session_memory_committed: YES — <path>
- head_commit: <full SHA>
- head_commit_title: <commit message first line>
- commit_state_gate: PASS
```

> **Note**: The PREHANDOVER proof itself must be committed before §4.3c runs (it checks that the
> proof is committed). If the proof is not yet committed, commit it, then run §4.3c.

### IAA Phase Status — PHASE_B_BLOCKING

The IAA is now **operationally PHASE_B_BLOCKING** in the live system. Producing-agent contracts
that still declare `advisory_phase: PHASE_A_ADVISORY` in their YAML frontmatter are stale and
must be updated to `advisory_phase: PHASE_B_BLOCKING`.

The `PHASE_A_ADVISORY` response is only valid when the IAA tool call itself returns a
`deployment-error` — it is NOT a self-declaration that can be written before or without making
the tool call.

| IAA Tool Call Result | Correct agent response |
|---------------------|------------------------|
| ASSURANCE-TOKEN | Record token reference; proceed to §4.3b |
| REJECTION-PACKAGE | Stop. Fix all failures. Re-run from §4.3. |
| deployment-error | Record PHASE_A_ADVISORY status; flag PR for IAA review |
| NOT called | HALT. INC-IAA-SKIP-001. Record in FAIL-ONLY-ONCE. Escalate to CS2. |



## Section 4.3d: Scope-Declaration Parity Gate (mandatory for governance PRs, BLOCKING)

**Purpose**: Guarantee that the per-PR scope declaration at `.agent-admin/scope-declarations/pr-<PR_NUMBER>.md`
exactly reflects the actual branch diff at the moment IAA is invoked. The scope declaration is a
binding attestation — if it lists the wrong files or an incorrect count, it is a false representation
of PR scope and causes avoidable REJECTION-PACKAGEs.

**Problem This Solves**: The stale scope-declaration pattern (A-026) recurred 6 consecutive times
(PRs #1315, #1317, #1319, #1320, #1332, and the follow-up remediation of #1332). Each occurrence
had the same root cause: the global `governance/scope-declaration.md` was regenerated at some earlier
point during the session, and then additional artifacts were added afterwards, creating a file-count
mismatch. Additionally, concurrent PRs repeatedly conflicted on the same shared file.
This gate, combined with the per-PR immutable model, eliminates both failure classes.

**Effective**: 2026-04-09 | **Authority**: CS2 | **Added**: v1.3.0 | **Amended**: v1.6.0 (issue #1359 — per-PR immutable model)

**Applicability**: This gate is **BLOCKING** for all governance PRs — defined as any PR that
modifies at least one file under `governance/`, `.agent-admin/`, `.agent-workspace/`, or `.github/`.
For such PRs, `.agent-admin/scope-declarations/pr-<PR_NUMBER>.md` MUST be created/updated and
committed as the final file before IAA invocation. Non-governance PRs (application code,
documentation only, no governance-path files) are exempt.

> **Deprecated**: The global `governance/scope-declaration.md` is no longer the per-PR scope
> evidence artifact. Agents MUST NOT write per-PR scope evidence to that shared file.

### Rule

> **ABSOLUTE RULE (ECAP-QC-002)**: `.agent-admin/scope-declarations/pr-<PR_NUMBER>.md` MUST be
> the final file committed to the PR branch before IAA invocation. Its FILES_CHANGED list MUST
> exactly match `git diff --name-only origin/main...HEAD`. Any mismatch is a blocking handover
> failure. Only one per-PR scope declaration file must exist for each PR number.

### Required Checks

| Check | Command | PASS condition |
|-------|---------|----------------|
| scope-declaration present | `ls .agent-admin/scope-declarations/pr-${PR_NUMBER}.md` | File exists |
| diff count vs bullet count | compare `git diff --name-only origin/main...HEAD \| wc -l` vs count of `- ` bullet entries under `## FILES_CHANGED` | Counts equal |
| numeric field integrity | compare `FILES_CHANGED: N` value vs count of `- ` bullet entries | Values equal |
| no pending changes after generation | `git status --porcelain .agent-admin/scope-declarations/pr-${PR_NUMBER}.md` | Output is empty (file committed) |
| correct PR number in path | file path contains current PR number | Path matches `pr-${PR_NUMBER}.md` |

### Template

```markdown
### 4.3d Scope-Declaration Parity Gate (<Agent>_H — BLOCKING for governance PRs)

**Authority**: `governance/canon/AGENT_HANDOVER_AUTOMATION.md` v1.6.0

> **ABSOLUTE RULE (ECAP-QC-002)**: `.agent-admin/scope-declarations/pr-${PR_NUMBER}.md` must be
> the final committed file before IAA invocation. Its FILES_CHANGED count must match
> `git diff --name-only origin/main...HEAD`.

> **Consumer note**: The closing fence of the bash block below uses escaped backticks (`` \`\`\` ``) to prevent Markdown fence collision inside this outer code block. When copying this template into an agent contract or script, replace every `` \`\`\` `` (backslash + three backticks) with ` ``` ` (three plain backticks).

```bash
#!/bin/bash
# <Agent> Handover - Scope-Declaration Parity Gate
# Priority: <Agent>_H  — BLOCKING for governance PRs: do NOT invoke IAA until PASS

echo "📋 SCOPE-DECLARATION PARITY GATE (BLOCKING — governance PRs)"

SCOPE_FAILURES=()

# Require PR_NUMBER to be set (export from environment or CI context)
# In CI: export PR_NUMBER="${{ github.event.pull_request.number }}" before calling this gate.
# Locally: export PR_NUMBER=1360 && bash handover-gate.sh
if [ -z "${PR_NUMBER}" ]; then
  echo "  ❌ PR_NUMBER environment variable not set — cannot locate per-PR scope file"
  exit 1
fi

SCOPE_FILE=".agent-admin/scope-declarations/pr-${PR_NUMBER}.md"

# Check 1: Detect whether this is a governance PR
# A PR is a governance PR if it touches any file under governance/, .agent-admin/, .agent-workspace/, or .github/
GOVERNANCE_FILES=$(git diff --name-only origin/main...HEAD 2>/dev/null | grep -E '^(governance/|\.agent-admin/|\.agent-workspace/|\.github/)' | wc -l | tr -d ' ')
if [ "${GOVERNANCE_FILES}" -eq 0 ]; then
  echo "  ℹ️  No governance-path files in branch diff — not a governance PR"
  echo "✅ Scope-Declaration Parity Gate: SKIP (not a governance PR)"
  exit 0
fi

# Check 2: Per-PR scope file must exist
if [ ! -f "${SCOPE_FILE}" ]; then
  SCOPE_FAILURES+=("per-PR scope declaration missing: ${SCOPE_FILE}")
  echo "  ❌ Per-PR scope file NOT FOUND: ${SCOPE_FILE}"
  echo "     ACTION: Create .agent-admin/scope-declarations/pr-${PR_NUMBER}.md"
  echo "             listing all files from: git diff --name-only origin/main...HEAD"
fi

# Check 3: Count files in actual branch diff
DIFF_COUNT=$(git diff --name-only origin/main...HEAD | wc -l | tr -d ' ')
echo "  Branch diff file count: ${DIFF_COUNT}"

# Check 4: Count files listed in per-PR scope file FILES_CHANGED section (bullet entries)
if [ -f "${SCOPE_FILE}" ]; then
  SCOPE_COUNT=$(awk '/^## FILES_CHANGED/{found=1; next} found && /^- /{count++} found && /^##/{if(!/FILES_CHANGED/)found=0} END{print count+0}' "${SCOPE_FILE}")
  echo "  ${SCOPE_FILE} bullet entry count: ${SCOPE_COUNT}"

  if [ "${DIFF_COUNT}" -ne "${SCOPE_COUNT}" ]; then
    SCOPE_FAILURES+=("file count mismatch: diff has ${DIFF_COUNT} files, scope-declaration lists ${SCOPE_COUNT} bullets")
    echo "  ❌ Diff count: MISMATCH (${DIFF_COUNT} in diff vs ${SCOPE_COUNT} bullets in scope-declaration)"
    echo "     ACTION: Update ${SCOPE_FILE} from:"
    echo "             git diff --name-only origin/main...HEAD"
    echo "     Then commit it and re-run §4.3c + §4.3d before invoking IAA."
  else
    echo "  ✅ Diff count: MATCH (${DIFF_COUNT})"
  fi

  # Check 4b: Validate numeric FILES_CHANGED: N field matches bullet count
  NUMERIC_FIELD=$(grep -E "^FILES_CHANGED:" "${SCOPE_FILE}" | awk '{print $2}' | tr -d ' ')
  if [ -z "${NUMERIC_FIELD}" ]; then
    SCOPE_FAILURES+=("FILES_CHANGED: N field missing from ## FILES_CHANGED section")
    echo "  ❌ Numeric field: FILES_CHANGED: N not found in ${SCOPE_FILE}"
  elif [ "${NUMERIC_FIELD}" != "${SCOPE_COUNT}" ]; then
    SCOPE_FAILURES+=("numeric field mismatch: FILES_CHANGED: ${NUMERIC_FIELD} does not match bullet count ${SCOPE_COUNT}")
    echo "  ❌ Numeric field: FILES_CHANGED: ${NUMERIC_FIELD} ≠ bullet count ${SCOPE_COUNT}"
  else
    echo "  ✅ Numeric field: FILES_CHANGED: ${NUMERIC_FIELD} matches bullet count"
  fi

  # Check 5: Per-PR scope file must be committed (not dirty)
  SCOPE_DIRTY=$(git status --porcelain "${SCOPE_FILE}" 2>/dev/null)
  if [ -n "${SCOPE_DIRTY}" ]; then
    SCOPE_FAILURES+=("${SCOPE_FILE} has uncommitted changes — commit it first")
    echo "  ❌ Per-PR scope file: UNCOMMITTED CHANGES (${SCOPE_DIRTY})"
  else
    echo "  ✅ Per-PR scope file: COMMITTED"
  fi
fi

# Evaluate
if [ ${#SCOPE_FAILURES[@]} -gt 0 ]; then
  echo ""
  echo "❌ [<Agent>_H] SCOPE-DECLARATION PARITY GATE FAILED — IAA MUST NOT BE INVOKED"
  echo "Failures:"
  for f in "${SCOPE_FAILURES[@]}"; do echo "  - ${f}"; done
  echo ""
  echo "ACTION: Create/update .agent-admin/scope-declarations/pr-${PR_NUMBER}.md as the ABSOLUTE LAST action before IAA."
  echo "        No further file changes permitted after creation/update."
  echo "        Commit the file, then re-run §4.3c, then re-run §4.3d, then invoke IAA."
  exit 1
fi

echo ""
echo "✅ [<Agent>_H] SCOPE-DECLARATION PARITY GATE PASSED"
echo "✅ [<Agent>_H] .agent-admin/scope-declarations/pr-${PR_NUMBER}.md is committed and matches branch diff."
echo "✅ [<Agent>_H] Agent is cleared to invoke IAA."
\`\`\`

**Commentary**: This gate is **BLOCKING** for governance PRs. If it fails:
1. Create/update `.agent-admin/scope-declarations/pr-${PR_NUMBER}.md` from `git diff --name-only origin/main...HEAD`.
2. Commit the file (no other changes).
3. Re-run §4.3c Pre-IAA Commit-State Gate.
4. Re-run §4.3d Scope-Declaration Parity Gate.
5. Only then invoke IAA.
```

### What Constitutes a Governance PR

A PR is a **governance PR** for the purpose of this gate if it includes changes to any file in:
- `governance/` (any subdirectory)
- `.agent-admin/` (evidence and assurance artifacts)
- `.agent-workspace/` (agent memory and knowledge)
- `.github/` (workflow and agent files)

Non-governance PRs (application code only, documentation only) are exempt from §4.3d.



## Section 4.3e: Admin Ceremony Compliance Gate (mandatory for ECAP-involved jobs, BLOCKING)

**Purpose**: Verify that the `execution-ceremony-admin-agent` has completed the full admin-compliance normalization required by `EXECUTION_CEREMONY_ADMINISTRATION_PROTOCOL.md` §3.5–§3.9 before IAA is invoked. This gate ensures that ceremony defects are caught at the ECAP/Foreman boundary rather than forwarded to IAA for detection.

**Trigger**: This gate is **MANDATORY and BLOCKING** for every job where an `execution-ceremony-admin-agent` was appointed (i.e., any job that used ECAP ceremony administration). It is also the prescribed gate for Foreman Quality-of-Process (QP) admin-compliance verification per `FOREMAN_AUTHORITY_AND_SUPERVISION_MODEL.md §14.6`.

```bash
#!/bin/bash
# §4.3e Admin Ceremony Compliance Gate (BLOCKING — ECAP-involved jobs)
# Priority: Producer_H (Foreman or execution-ceremony-admin-agent)
# Authority: EXECUTION_CEREMONY_ADMINISTRATION_PROTOCOL.md v1.1.0 + AGENT_HANDOVER_AUTOMATION.md v1.4.0

echo "🔍 §4.3e ADMIN CEREMONY COMPLIANCE GATE (BLOCKING)"

ACC_FAILURES=()

# ─────────────────────────────────────────────────────────────────────────────
# CHECK A: Artifact Completeness
# ─────────────────────────────────────────────────────────────────────────────
echo "  [A] Artifact Completeness..."

# A1: PREHANDOVER proof committed
PREHANDOVER_COUNT=$(git ls-files --error-unmatch .agent-admin/prehandover/proof-*.md 2>/dev/null | wc -l || echo 0)
[ "${PREHANDOVER_COUNT}" -eq 0 ] && \
  ACC_FAILURES+=("A1: PREHANDOVER proof not found or not committed")

# A2: Session memory committed
SESSION_MEMORY_COUNT=$(git ls-files --error-unmatch .agent-workspace/*/memory/session-*.md 2>/dev/null | wc -l || echo 0)
[ "${SESSION_MEMORY_COUNT}" -eq 0 ] && \
  ACC_FAILURES+=("A2: Session memory not found or not committed")

# A3: Gate results (JSON) committed
GATE_RESULTS_COUNT=$(git ls-files --error-unmatch .agent-admin/gates/gate-results-*.json 2>/dev/null | wc -l || echo 0)
[ "${GATE_RESULTS_COUNT}" -eq 0 ] && \
  ACC_FAILURES+=("A3: Gate results JSON not found or not committed (ECAP-CCI-01)")

# ─────────────────────────────────────────────────────────────────────────────
# CHECK B: Scope Declaration Parity (ECAP-CCI-05 — no stale counts)
# Uses per-PR immutable scope file (issue #1359 — global governance/scope-declaration.md abolished)
# PR_NUMBER must be set in the environment (export from CI context or §4.3d invocation)
# ─────────────────────────────────────────────────────────────────────────────
echo "  [B] Scope Declaration Parity..."

PER_PR_SCOPE_FILE=""
if [ -n "${PR_NUMBER:-}" ]; then
  PER_PR_SCOPE_FILE=".agent-admin/scope-declarations/pr-${PR_NUMBER}.md"
else
  # Fallback: discover from committed files when PR_NUMBER is unavailable
  PER_PR_SCOPE_FILE=$(git ls-files '.agent-admin/scope-declarations/pr-*.md' 2>/dev/null | sort -V | tail -1 || echo "")
fi

if [ -n "${PER_PR_SCOPE_FILE}" ] && [ -f "${PER_PR_SCOPE_FILE}" ]; then
  DECLARED_COUNT=$(grep -E "^FILES_CHANGED:" "${PER_PR_SCOPE_FILE}" | awk '{print $2}')
  BULLET_COUNT=$(awk '/^## FILES_CHANGED/{found=1; next} found && /^- /{count++} found && /^##/{if(!/FILES_CHANGED/)found=0} END{print count+0}' "${PER_PR_SCOPE_FILE}")
  ACTUAL_COUNT=$(git diff --name-only origin/main...HEAD | wc -l | tr -d ' ')
  if [ -n "${DECLARED_COUNT}" ] && [ "${DECLARED_COUNT}" != "${ACTUAL_COUNT}" ]; then
    ACC_FAILURES+=("B1: Scope declaration FILES_CHANGED=${DECLARED_COUNT} but actual changed files=${ACTUAL_COUNT} (ECAP-CCI-05)")
  fi
  if [ -n "${DECLARED_COUNT}" ] && [ "${DECLARED_COUNT}" != "${BULLET_COUNT}" ]; then
    ACC_FAILURES+=("B2: Scope declaration FILES_CHANGED: ${DECLARED_COUNT} numeric field does not match bullet entry count ${BULLET_COUNT} (ECAP-CCI-05)")
  fi
else
  ACC_FAILURES+=("B1: Per-PR scope declaration not found — expected at .agent-admin/scope-declarations/pr-${PR_NUMBER:-<PR_NUMBER>}.md (ECAP-CCI-05)")
fi

# ─────────────────────────────────────────────────────────────────────────────
# CHECK C: Status Normalization (ECAP-CCI-03 / ECAP-CCI-04)
# Scans only FINAL-STATE artifacts — superseded (pre-token) proofs that are
# retained immutably under the append-only model are excluded from this scan.
# A proof is superseded when any other committed proof declares it via a
# "Supersedes: <filename>" line.  Session memories: only the latest per
# agent workspace is evaluated.
# ─────────────────────────────────────────────────────────────────────────────
echo "  [C] Status Normalization — scanning final-state ceremony artifacts for prohibited provisional wording..."

# Build superseded-file set: collect all basenames declared in "Supersedes:" lines
SUPERSEDED_SET=()
for f in $(git ls-files .agent-admin/prehandover/proof-*.md 2>/dev/null); do
  while IFS= read -r SUPERSEDES_NAME; do
    [ -n "${SUPERSEDES_NAME}" ] && SUPERSEDED_SET+=(".agent-admin/prehandover/${SUPERSEDES_NAME}")
  done < <(grep -oP '(?i)(?<=Supersedes: )\S+' "${f}" 2>/dev/null || true)
done

STALE_WORDING_FILES=()

# Scan PREHANDOVER proofs — skip superseded originals
for f in $(git ls-files .agent-admin/prehandover/proof-*.md 2>/dev/null); do
  IS_SUPERSEDED=false
  for s in "${SUPERSEDED_SET[@]}"; do
    [ "${f}" = "${s}" ] && IS_SUPERSEDED=true && break
  done
  ${IS_SUPERSEDED} && continue
  if grep -qiE "\bTODO\b|\bTBD\b|\bin[ _-]?progress\b|\bPENDING\b" "${f}" 2>/dev/null; then
    STALE_WORDING_FILES+=("${f}")
  fi
done

# Scan session memories — only the latest file per agent workspace
for WORKSPACE_DIR in $(git ls-files '.agent-workspace/*/memory/session-*.md' 2>/dev/null | \
    sed 's|/memory/session-.*||' | sort -u); do
  LATEST_SESSION=$(git ls-files "${WORKSPACE_DIR}/memory/session-*.md" 2>/dev/null | sort | tail -1)
  if [ -n "${LATEST_SESSION}" ] && \
     grep -qiE "\bTODO\b|\bTBD\b|\bin[ _-]?progress\b|\bPENDING\b" "${LATEST_SESSION}" 2>/dev/null; then
    STALE_WORDING_FILES+=("${LATEST_SESSION}")
  fi
done

[ ${#STALE_WORDING_FILES[@]} -gt 0 ] && \
  ACC_FAILURES+=("C1: Provisional/stale wording found in final-state ceremony artifacts: ${STALE_WORDING_FILES[*]} (ECAP-CCI-03)")

# ─────────────────────────────────────────────────────────────────────────────
# CHECK D: Version Normalization (ECAP-CCI-04)
# ─────────────────────────────────────────────────────────────────────────────
echo "  [D] Version normalization check skipped (manual review required for mixed version labels)"
# Mixed version labels are a manual review item — cannot be machine-checked generically.
# The Foreman QP checkpoint (§14.6) is the human verification layer for version consistency.

# ─────────────────────────────────────────────────────────────────────────────
# CHECK E: Token / Session / Path / Issue / PR / Wave Consistency (§3.7)
# ─────────────────────────────────────────────────────────────────────────────
echo "  [E] Token / session / path consistency (spot check)..."
# Machine check: PREHANDOVER proof must declare iaa_audit_token field
LATEST_PROOF=$(ls -t .agent-admin/prehandover/proof-*.md 2>/dev/null | head -1)
if [ -n "${LATEST_PROOF}" ]; then
  if ! grep -q "iaa_audit_token" "${LATEST_PROOF}"; then
    ACC_FAILURES+=("E1: PREHANDOVER proof missing iaa_audit_token field (§3.7 token consistency)")
  fi
fi

# ─────────────────────────────────────────────────────────────────────────────
# CHECK F: Inventory / Hash / Amended-Date Correctness (ECAP-QC-003, ECAP-QC-004)
# ─────────────────────────────────────────────────────────────────────────────
echo "  [F] CANON_INVENTORY amended_date and hash correctness..."
TODAY=$(date -u +"%Y-%m-%d")
# Run existing validate-canon-hashes.sh if present
if [ -f ".github/scripts/validate-canon-hashes.sh" ]; then
  bash .github/scripts/validate-canon-hashes.sh > /tmp/canon-hash-check.txt 2>&1
  HASH_FAILURES=$(grep -c "FAIL\|MISMATCH\|ERROR" /tmp/canon-hash-check.txt || true)
  [ "${HASH_FAILURES}" -gt 0 ] && \
    ACC_FAILURES+=("F1: validate-canon-hashes.sh reported ${HASH_FAILURES} failure(s) — see /tmp/canon-hash-check.txt")
fi

# ─────────────────────────────────────────────────────────────────────────────
# CHECK G: Ripple / Registry Readiness (§3.9)
# ─────────────────────────────────────────────────────────────────────────────
echo "  [G] Ripple / registry readiness..."
# Machine check: if governance/canon/ files changed, CANON_INVENTORY must also be changed
CANON_CHANGES=$(git diff --name-only origin/main...HEAD | grep "^governance/canon/" | wc -l | tr -d ' ')
INVENTORY_CHANGED=$(git diff --name-only origin/main...HEAD | grep -c "^governance/CANON_INVENTORY.json" || true)
if [ "${CANON_CHANGES}" -gt 0 ] && [ "${INVENTORY_CHANGED}" -eq 0 ]; then
  ACC_FAILURES+=("G1: Canon files changed but CANON_INVENTORY.json not updated — ripple/registry obligation unmet (§3.9)")
fi

# ─────────────────────────────────────────────────────────────────────────────
# CHECK H: Gate Evidence Inventory (AAP-15, AAP-16)
# When gate parity is claimed, an explicit per-gate inventory must exist.
# ─────────────────────────────────────────────────────────────────────────────
echo "  [H] Gate evidence inventory and provisional gate-pass wording check..."

# H1: Per-gate inventory enforcement — only when gate parity is claimed in the active bundle
GATE_PARITY_CLAIMED=false
for f in $(git ls-files .agent-admin/prehandover/proof-*.md 2>/dev/null); do
  IS_SUPERSEDED=false
  for s in "${SUPERSEDED_SET[@]}"; do
    [ "${f}" = "${s}" ] && IS_SUPERSEDED=true && break
  done
  ${IS_SUPERSEDED} && continue
  if grep -qiE "gate.parity|merge_gate_verdict|all.*gates.*pass" "${f}" 2>/dev/null; then
    GATE_PARITY_CLAIMED=true
    break
  fi
done
LATEST_GATE=$(ls -t .agent-admin/gates/gate-results-*.json 2>/dev/null | head -1)
if ${GATE_PARITY_CLAIMED}; then
  if [ -z "${LATEST_GATE}" ]; then
    ACC_FAILURES+=("H1: Gate parity claimed in active bundle but no gate-results JSON found (AAP-15)")
  else
    GATE_COUNT=$(python3 -c "import json,sys; d=json.load(open('${LATEST_GATE}')); print(len(d.get('gates',{})))" 2>/dev/null || echo 0)
    if [ "${GATE_COUNT}" -eq 0 ]; then
      ACC_FAILURES+=("H1: Gate parity claimed but gate results JSON has no individual gate entries — per-gate inventory required (AAP-15)")
    fi
  fi
fi

# H2: No provisional gate-pass wording in active-bundle final-state artifacts
# Scope: latest non-superseded proof + current ECAP reconciliation + latest session memories
PROVISIONAL_GATE_FILES=()
H2_ACTIVE_BUNDLE=()
# Add latest non-superseded proof
for f in $(git ls-files .agent-admin/prehandover/proof-*.md 2>/dev/null); do
  IS_SUPERSEDED=false
  for s in "${SUPERSEDED_SET[@]}"; do
    [ "${f}" = "${s}" ] && IS_SUPERSEDED=true && break
  done
  ${IS_SUPERSEDED} && continue
  H2_ACTIVE_BUNDLE+=("${f}")
done
# Add current ECAP reconciliation
LATEST_H2_RECON=$(git ls-files '.agent-admin/prehandover/ecap-reconciliation-*.md' 2>/dev/null | sort | tail -1)
[ -n "${LATEST_H2_RECON}" ] && H2_ACTIVE_BUNDLE+=("${LATEST_H2_RECON}")
# Add latest session memory per workspace
for WDIR in $(git ls-files '.agent-workspace/*/memory/session-*.md' 2>/dev/null | \
    sed 's|/memory/session-.*||' | sort -u); do
  LATEST_H2_SM=$(git ls-files "${WDIR}/memory/session-*.md" 2>/dev/null | sort | tail -1)
  [ -n "${LATEST_H2_SM}" ] && H2_ACTIVE_BUNDLE+=("${LATEST_H2_SM}")
done
for f in "${H2_ACTIVE_BUNDLE[@]}"; do
  [ -f "${f}" ] || continue
  if grep -qiE "expected to pass|parity to be confirmed|pending.*verification|gate.*deferred|to be confirmed" "${f}" 2>/dev/null; then
    PROVISIONAL_GATE_FILES+=("${f}")
  fi
done
[ ${#PROVISIONAL_GATE_FILES[@]} -gt 0 ] && \
  ACC_FAILURES+=("H2: Provisional gate-pass wording found in active-bundle artifacts: ${PROVISIONAL_GATE_FILES[*]} (AAP-16)")

# ─────────────────────────────────────────────────────────────────────────────
# CHECK I: Pre-Final Instruction Wording / Template Instruction Leakage (AAP-17, AAP-18, AAP-21)
# Denylist of template-instruction patterns that must not appear in committed
# final-state artifacts.
# ─────────────────────────────────────────────────────────────────────────────
echo "  [I] Pre-final instruction wording / template instruction leakage check..."

INSTRUCTION_LEAK_FILES=()

# Build the active final-state bundle (same superseded logic as Check C)
for f in $(git ls-files .agent-admin/prehandover/proof-*.md 2>/dev/null); do
  IS_SUPERSEDED=false
  for s in "${SUPERSEDED_SET[@]}"; do
    [ "${f}" = "${s}" ] && IS_SUPERSEDED=true && break
  done
  ${IS_SUPERSEDED} && continue
  if grep -qiE "\[fill in\]|\[instruction\]|replace this with|EXAMPLE TEXT|\[PLACEHOLDER\]|\[YOUR TEXT HERE\]|ASSEMBLY_TIME_ONLY|REMOVE BEFORE COMMIT|TEMPLATE INSTRUCTION" "${f}" 2>/dev/null; then
    INSTRUCTION_LEAK_FILES+=("${f}")
  fi
  # I2: Check for blank/placeholder iaa_audit_token or iaa_session_reference while final_state is COMPLETE (AAP-18)
  if grep -qE "^final_state:[[:space:]]*COMPLETE[[:space:]]*$" "${f}" 2>/dev/null; then
    if grep -qE "iaa_audit_token:[[:space:]]*(none|<[^>]+>|\[.*\]|TBD|PENDING)" "${f}" 2>/dev/null; then
      INSTRUCTION_LEAK_FILES+=("${f} [iaa_audit_token placeholder while final_state=COMPLETE]")
    fi
    if grep -qE "iaa_session_reference:[[:space:]]*(none|<[^>]+>|\[.*\]|TBD|PENDING)" "${f}" 2>/dev/null; then
      INSTRUCTION_LEAK_FILES+=("${f} [iaa_session_reference placeholder while final_state=COMPLETE]")
    fi
  fi
done

# Scan latest session memories
for WORKSPACE_DIR in $(git ls-files '.agent-workspace/*/memory/session-*.md' 2>/dev/null | \
    sed 's|/memory/session-.*||' | sort -u); do
  LATEST_SESSION=$(git ls-files "${WORKSPACE_DIR}/memory/session-*.md" 2>/dev/null | sort | tail -1)
  if [ -n "${LATEST_SESSION}" ] && \
     grep -qiE "\[fill in\]|\[instruction\]|replace this with|EXAMPLE TEXT|\[PLACEHOLDER\]|ASSEMBLY_TIME_ONLY|REMOVE BEFORE COMMIT" "${LATEST_SESSION}" 2>/dev/null; then
    INSTRUCTION_LEAK_FILES+=("${LATEST_SESSION}")
  fi
done

[ ${#INSTRUCTION_LEAK_FILES[@]} -gt 0 ] && \
  ACC_FAILURES+=("I1: Template instruction leakage / pre-final instruction wording in final-state artifacts: ${INSTRUCTION_LEAK_FILES[*]} (AAP-17, AAP-18, AAP-21)")

# ─────────────────────────────────────────────────────────────────────────────
# CHECK J: Cross-Artifact Final-State Consistency — Active-Bundle Scoped (AAP-19, AAP-22)
# Compares final_state across PREHANDOVER proof and ECAP reconciliation summary.
# Scoped to ACTIVE final-state bundle only — historical archive is NOT scanned.
# ─────────────────────────────────────────────────────────────────────────────
echo "  [J] Cross-artifact final-state consistency (active-bundle scoped)..."

LATEST_PROOF=$(git ls-files .agent-admin/prehandover/proof-*.md 2>/dev/null | sort | tail -1)
LATEST_RECONCILIATION=$(git ls-files .agent-admin/prehandover/ecap-reconciliation-*.md 2>/dev/null | sort | tail -1)

if [ -n "${LATEST_PROOF}" ] && [ -n "${LATEST_RECONCILIATION}" ]; then
  PROOF_FINAL=$(grep -E "^final_state:" "${LATEST_PROOF}" | awk '{print $2}' | head -1)
  RECON_FINAL=$(grep -iE "^\*\*Final State\*\*:|^Final State:" "${LATEST_RECONCILIATION}" | grep -v "^#" | head -1 | sed 's/.*://' | tr -d ' `*')
  # Only fail if both values exist and they differ (symmetric comparison)
  if [ -n "${PROOF_FINAL}" ] && [ -n "${RECON_FINAL}" ]; then
    PROOF_NORM=$(echo "${PROOF_FINAL}" | tr '[:lower:]' '[:upper:]' | tr -d ' ')
    RECON_NORM=$(echo "${RECON_FINAL}" | tr '[:lower:]' '[:upper:]' | tr -d ' ')
    if [ "${PROOF_NORM}" != "${RECON_NORM}" ]; then
      ACC_FAILURES+=("J1: Cross-artifact contradiction — PREHANDOVER final_state=${PROOF_FINAL} but ECAP reconciliation says: ${RECON_FINAL} (AAP-19)")
    fi
  fi
fi

# ─────────────────────────────────────────────────────────────────────────────
# CHECK K: Carried-Forward Claim Resolvability (AAP-20) — spot-check only
# Full carried-forward verification is a manual Foreman QP check (AAP-20).
# Machine check: verify that any "carried forward from" reference names a file
# that actually exists on the branch.
# ─────────────────────────────────────────────────────────────────────────────
echo "  [K] Carried-forward claim file-existence spot-check..."

UNRESOLVABLE_CF=()
# Active bundle: non-superseded proofs + latest reconciliation (avoids false positives from historical archive)
CF_SCAN_FILES=()
for f in $(git ls-files .agent-admin/prehandover/proof-*.md 2>/dev/null); do
  IS_SUPERSEDED=false
  for s in "${SUPERSEDED_SET[@]}"; do
    [ "${f}" = "${s}" ] && IS_SUPERSEDED=true && break
  done
  ${IS_SUPERSEDED} || CF_SCAN_FILES+=("${f}")
done
[ -n "${LATEST_RECONCILIATION}" ] && CF_SCAN_FILES+=("${LATEST_RECONCILIATION}")

for f in "${CF_SCAN_FILES[@]}"; do
  while IFS= read -r CF_SOURCE; do
    CF_SOURCE_CLEAN=$(echo "${CF_SOURCE}" | tr -d '"' | sed 's/^[[:space:]]*//' | sed 's/[[:space:]]*$//')
    [ -z "${CF_SOURCE_CLEAN}" ] && continue
    # Only check if it looks like a file path (contains /)
    echo "${CF_SOURCE_CLEAN}" | grep -q "/" || continue
    if ! git ls-files --error-unmatch "${CF_SOURCE_CLEAN}" > /dev/null 2>&1; then
      UNRESOLVABLE_CF+=("${f}: carried forward from '${CF_SOURCE_CLEAN}' — file not found on branch")
    fi
  done < <(grep -iE "carried forward from |verbatim from " "${f}" 2>/dev/null | \
    sed -E 's/.*(carried forward from|verbatim from)[[:space:]]+([^[:space:],;]+).*/\2/' || true)
done

[ ${#UNRESOLVABLE_CF[@]} -gt 0 ] && \
  ACC_FAILURES+=("K1: Carried-forward source file(s) not found on branch: ${UNRESOLVABLE_CF[*]} (AAP-20)")

# ─────────────────────────────────────────────────────────────────────────────
# CHECK L: Active-Bundle Token/Session Coherence (ACR-15, ACR-16, AAP-23, AAP-24)
# Verifies that the active final-state bundle is mutually coherent:
#   L1: Wave task-tracker does not contradict the declared job final state (ACR-15, AAP-23)
#   L2: iaa_audit_token reference resolves to an actual committed token file (ACR-16, AAP-24)
#   L3: active_bundle_iaa_coherence field is present and set to VERIFIED (ACR-16, AAP-24)
# ─────────────────────────────────────────────────────────────────────────────
echo "  [L] Active-bundle token/session coherence check..."

# L1: Wave task-tracker contradiction check
# Convention: wave tracker files follow naming `.agent-admin/waves/wave-<ID>-current-tasks.md`
# Scoped to the wave declared in the PREHANDOVER proof — tasks for other jobs/PRs in different
# waves are not in active-bundle scope and must not cause false-positive failures.
LATEST_PROOF_L=$(git ls-files .agent-admin/prehandover/proof-*.md 2>/dev/null | sort | tail -1)
if [ -n "${LATEST_PROOF_L}" ]; then
  PROOF_FINAL_L=$(grep -E "^final_state:" "${LATEST_PROOF_L}" | awk '{print $2}' | head -1)
  if [ "${PROOF_FINAL_L}" = "COMPLETE" ]; then
    # Extract wave ID from proof to scope the tracker lookup to this job's wave
    WAVE_ID=$(grep -E "^wave:" "${LATEST_PROOF_L}" | sed 's/wave:[[:space:]]*//' | awk '{print $1}' | head -1)
    JOB_WAVE_TRACKER=""
    if [ -n "${WAVE_ID}" ]; then
      # Look for the tracker file matching this job's wave ID exactly
      JOB_WAVE_TRACKER=$(git ls-files ".agent-admin/waves/wave-${WAVE_ID}-current-tasks.md" 2>/dev/null | head -1)
    fi
    # Fall back to alphabetically-last tracker only when no wave-scoped match is found
    if [ -z "${JOB_WAVE_TRACKER}" ]; then
      JOB_WAVE_TRACKER=$(git ls-files '.agent-admin/waves/wave-*-current-tasks.md' 2>/dev/null | sort | tail -1)
    fi
    if [ -n "${JOB_WAVE_TRACKER}" ]; then
      # Check for open [ ] entries not annotated with [~] in the job-scoped wave tracker
      OPEN_TASKS=$(grep -c "^\- \[ \]" "${JOB_WAVE_TRACKER}" 2>/dev/null || echo 0)
      if [ "${OPEN_TASKS}" -gt 0 ]; then
        ACC_FAILURES+=("L1: Wave task-tracker '${JOB_WAVE_TRACKER}' has ${OPEN_TASKS} open [ ] task(s) while PREHANDOVER declares final_state=COMPLETE — active-bundle contradiction (ACR-15, AAP-23). Tick tasks or annotate with [~] + reason.")
      fi
    fi
  fi
fi

# L2: iaa_audit_token must resolve to an actual committed token file (if final_state=COMPLETE)
if [ -n "${LATEST_PROOF_L}" ]; then
  PROOF_FINAL_L=$(grep -E "^final_state:" "${LATEST_PROOF_L}" | awk '{print $2}' | head -1)
  if [ "${PROOF_FINAL_L}" = "COMPLETE" ]; then
    IAA_TOKEN_REF=$(grep -E "^iaa_audit_token:" "${LATEST_PROOF_L}" | sed 's/iaa_audit_token:[[:space:]]*//; s/^[[:space:]]*//' | head -1)
    # Check that it's not a placeholder (all known placeholder patterns)
    if echo "${IAA_TOKEN_REF}" | grep -qE "^(<|none|\[|TBD|PENDING|TODO|N/A|null|\")" 2>/dev/null || [ -z "${IAA_TOKEN_REF}" ]; then
      ACC_FAILURES+=("L2: PREHANDOVER proof final_state=COMPLETE but iaa_audit_token is a placeholder value '${IAA_TOKEN_REF}' — no actual token reference (ACR-16, AAP-24)")
    else
      # Determine whether the reference is a file path or a token ID string
      RESOLVED_TOKEN_FILE=""
      if echo "${IAA_TOKEN_REF}" | grep -qE "^\.agent-admin/|^agent-admin/|\.md$" 2>/dev/null; then
        # Reference looks like a file path — validate the exact file is committed
        if git ls-files --error-unmatch "${IAA_TOKEN_REF}" >/dev/null 2>&1; then
          RESOLVED_TOKEN_FILE="${IAA_TOKEN_REF}"
        else
          ACC_FAILURES+=("L2: PREHANDOVER proof declares iaa_audit_token='${IAA_TOKEN_REF}' but this exact file path is not committed to the branch (ACR-16, AAP-24)")
        fi
      else
        # Reference is a token ID — locate a committed token file that contains it
        RESOLVED_TOKEN_FILE=$(grep -rlF "${IAA_TOKEN_REF}" .agent-admin/assurance/iaa-token-*.md 2>/dev/null | head -1 || true)
        if [ -z "${RESOLVED_TOKEN_FILE}" ]; then
          ACC_FAILURES+=("L2: PREHANDOVER proof declares iaa_audit_token='${IAA_TOKEN_REF}' but no committed token file in .agent-admin/assurance/ contains this token ID (ACR-16, AAP-24)")
        fi
      fi
      # Cross-check: token file must reference the same PR declared in the PREHANDOVER proof
      if [ -n "${RESOLVED_TOKEN_FILE}" ]; then
        PROOF_PR=$(grep -E "^pr:" "${LATEST_PROOF_L}" | awk '{print $2}' | grep -oE '[0-9]+' | head -1)
        if [ -n "${PROOF_PR}" ] && ! grep -qiE "(^|[^0-9])(PR|pull[[:space:]]request)[[:space:]#:-]*${PROOF_PR}([^0-9]|$)" "${RESOLVED_TOKEN_FILE}" 2>/dev/null; then
          ACC_FAILURES+=("L2: Token file '${RESOLVED_TOKEN_FILE}' does not reference PR #${PROOF_PR} declared in the PREHANDOVER proof — token/proof PR mismatch (ACR-16, AAP-24)")
        fi
      fi
    fi
    # L3: active_bundle_iaa_coherence field must be present and VERIFIED
    if ! grep -qE "^active_bundle_iaa_coherence:[[:space:]]*VERIFIED" "${LATEST_PROOF_L}" 2>/dev/null; then
      ACC_FAILURES+=("L3: PREHANDOVER proof final_state=COMPLETE but active_bundle_iaa_coherence field is absent, blank, or not set to VERIFIED (ACR-16, AAP-24). Add 'active_bundle_iaa_coherence: VERIFIED' after performing L1 and L2 checks.")
    fi
  fi
fi

# ─────────────────────────────────────────────────────────────────────────────
# GATE RESULT
# ─────────────────────────────────────────────────────────────────────────────
if [ ${#ACC_FAILURES[@]} -gt 0 ]; then
  echo ""
  echo "❌ §4.3e ADMIN CEREMONY COMPLIANCE GATE FAILED — IAA MUST NOT BE INVOKED"
  echo "Failures:"
  for f in "${ACC_FAILURES[@]}"; do echo "  - ${f}"; done
  echo ""
  echo "ACTION: Return bundle to ECAP for normalization. Fix all failures, re-run §4.3c + §4.3d + §4.3e, then invoke IAA."
  exit 1
fi

echo ""
echo "✅ §4.3e ADMIN CEREMONY COMPLIANCE GATE PASSED"
echo "✅ Admin-compliance readiness confirmed. Foreman may accept bundle and proceed to IAA invocation."
```

### Auto-Fail Rules for Known Admin Anti-Patterns (§4.3e)

The following conditions are **auto-fail** for the §4.3e gate regardless of other checks. Any of these conditions present in the committed ceremony bundle at IAA invocation time constitutes a ceremony-integrity defect:

| ID | Anti-Pattern | Auto-Fail Trigger |
|----|-------------|-------------------|
| AAP-01 | Issued token but pending/in-progress wording remains | Any of: `PENDING`, `in progress`, `in-progress` in the **final-state** PREHANDOVER proof or latest session memory where a PASS/COMPLETE is the required state. Pre-token proofs retained immutably under the append-only model (i.e., superseded by a post-token proof that declares `Supersedes: <filename>`) are **exempt** from this check. |
| AAP-02 | Mixed internal version labels | Multiple different version strings for the same artifact within a single document (e.g., "v1.2.0" and "v1.3.0" both appear as the current version of the same file) |
| AAP-03 | Stale artifact path references | A declared path in PREHANDOVER proof or session memory that does not exist as a committed file on the branch |
| AAP-04 | Stale scope declaration after file changes | `FILES_CHANGED: N` in `.agent-admin/scope-declarations/pr-${PR_NUMBER}.md` does not match actual `git diff --name-only origin/main...HEAD` count, or numeric field does not match bullet entry count |
| AAP-05 | Stale hash after file finalization | A declared SHA256 hash in PREHANDOVER proof or CANON_INVENTORY for a file that was modified after the hash was recorded |
| AAP-06 | Requested vs completed assurance session mismatch | PREHANDOVER proof cites a specific IAA session ID that does not match the IAA session that issued the token in the token file |
| AAP-07 | Declared file/artifact count mismatch | A declared count of files, artifacts, or changed items in any ceremony artifact does not match the actual count |
| AAP-08 | PUBLIC_API ripple obligations omitted or silently skipped | Any changed file with `layer_down_status: PUBLIC_API` in CANON_INVENTORY that has no ripple assessment block in the ECAP reconciliation summary |
| AAP-09 | Committed truth not matching proof/session memory claims | The branch's actual committed file state contradicts a declared artifact path, hash, or status in a ceremony document |
| AAP-15 | Gate parity claimed without explicit gate inventory | Gate results JSON has no individual per-gate entries when gate parity is claimed in PREHANDOVER proof |
| AAP-16 | Stale gate-pass provisional wording | Any of: `expected to pass`, `parity to be confirmed`, `pending verification`, `gate deferred`, `to be confirmed` in active-bundle final-state artifacts (proof, reconciliation, or latest session memory) where a definitive gate status is required |
| AAP-17 | Pre-final instruction wording / template instruction leakage | Any of: `[fill in]`, `[instruction]`, `replace this with`, `EXAMPLE TEXT`, `[PLACEHOLDER]`, `[YOUR TEXT HERE]` in committed final-state artifacts |
| AAP-18 | Verbatim IAA-response section blank or instruction-only | `iaa_audit_token` or `iaa_session_reference` field still contains a template placeholder value (e.g., `<token-file-path>`, `[pending]`) while `final_state: COMPLETE` is declared |
| AAP-19 | Cross-artifact final-state contradiction | PREHANDOVER `final_state: COMPLETE` but ECAP reconciliation summary or session memory declares a non-final status for the same dimension |
| AAP-20 | Carried-forward claim silently changes ownership or gate authority | A "carried forward from" claim in a final-state artifact references a source that does not contain the stated claim, or the carried-forward text modifies gate authority/ownership |
| AAP-21 | ASSEMBLY_TIME_ONLY block not removed | A block explicitly marked `ASSEMBLY_TIME_ONLY`, `REMOVE BEFORE COMMIT`, or `TEMPLATE INSTRUCTION` remains in a committed output artifact |
| AAP-23 | Active-wave/task-tracker contradiction | Wave task-tracker (`.agent-admin/waves/wave-N-current-tasks.md`) has open `[ ]` task entries for the current job while PREHANDOVER proof declares `final_state: COMPLETE`; or the task's `qp_verdict` field in the wave record contradicts the declared final state |
| AAP-24 | Active token/session incoherence | PREHANDOVER proof declares `final_state: COMPLETE` but: (a) `iaa_audit_token` field is a placeholder, (b) no IAA token file exists in `.agent-admin/assurance/`, or (c) `active_bundle_iaa_coherence` field is absent, blank, or not set to `VERIFIED` |

### Admin Ceremony Compliance Gate in the Handover Validation Checklist

The following item is added to the handover checklist when an ECAP job is involved:

> - [ ] **Admin Ceremony Compliance Gate PASSED** (ECAP jobs): §4.3e gate run — 0 auto-fail conditions (AAP-01 through AAP-21, AAP-23, AAP-24 auto-fail conditions included); ECAP reconciliation summary present; admin-compliance readiness accepted by Foreman QP checkpoint; active-bundle token/session coherence verified (Check L) (BLOCKING — IAA must not be invoked until this is ✅)

**Purpose**: Govern how the IAA writes its assurance verdict. The PREHANDOVER proof is
**read-only** once committed. The IAA token is written to a new, dedicated artifact file —
never as an edit to the PREHANDOVER proof.

**Effective**: 2026-03-04 | **Authority**: CS2 | **Added**: v1.1.3

### Rule

> **ABSOLUTE RULE**: After initial commit of the PREHANDOVER proof, no agent (including the IAA)
> may modify that file. The IAA MUST write its assurance verdict to a separate, dedicated token
> file. The PREHANDOVER proof records only the token reference (ID), not the token text.

### Template

```markdown
### 4.3b Token Update Ceremony (FM_H / GA_H — MANDATORY after IAA PASS)

**Trigger**: IAA has issued a verdict for this PR.

**Protocol**:

1. **Do NOT edit the PREHANDOVER proof.** The PREHANDOVER proof is immutable once committed.
2. The IAA writes its verdict to a dedicated token file:
   `.agent-admin/assurance/iaa-token-session-NNN-waveY-YYYYMMDD.md`
   For re-invocation rounds (after a prior `REJECTION-PACKAGE`), append `-rZ` where Z is the round number:
   `.agent-admin/assurance/iaa-token-session-NNN-waveY-YYYYMMDD-rZ.md`
3. The PREHANDOVER proof `iaa_audit_token` field already recorded the token reference at
   initial commit time (using the expected format `IAA-session-NNN-YYYYMMDD-PASS`).
   No update to the PREHANDOVER proof is needed or permitted.
4. The submitting agent (Foreman or GA) commits the token file as a **new file only** —
   no amendments to any existing committed artifact.
5. If the IAA issues a REJECTION-PACKAGE, it similarly writes a new rejection artifact;
   the submitting agent opens a STOP-AND-FIX, fixes the gaps, and re-initiates handover
   with a fresh PREHANDOVER proof in a new commit. See `INDEPENDENT_ASSURANCE_AGENT_CANON.md
   §IAA Re-Invocation After Rejection — PREHANDOVER Proof Handling During Rejection Cycle`.

\`\`\`bash
#!/bin/bash
# 4.3b Token Update Ceremony — append-only dedicated token file

IAA_TOKEN_FILE=".agent-admin/assurance/iaa-token-session-${IAA_SESSION}-wave${WAVE}-${TIMESTAMP}.md"

# IAA writes token to new file — NEVER edits prehandover proof
cat > "${IAA_TOKEN_FILE}" <<EOF
# IAA Token — session-${IAA_SESSION}-wave${WAVE}-${TIMESTAMP}

IAA Session: ${IAA_SESSION}
PR: #${PR_NUMBER}
Wave: ${WAVE}
Date: $(date +%Y-%m-%d)

## Verdict

${IAA_VERDICT}

## PHASE_B_BLOCKING_TOKEN: IAA-session-${IAA_SESSION}-$(date +%Y%m%d)-PASS

Phases Verified: 1-${PHASE1}, 2-${PHASE2}, 3-${PHASE3}, 4-${PHASE4}
Agent Integrity: ${INTEGRITY_RESULT}
Independence: CONFIRMED
Verdict: ${MERGE_VERDICT}
EOF

echo "✅ IAA token written to: ${IAA_TOKEN_FILE}"
echo "✅ PREHANDOVER proof unchanged (immutable post-commit)"
\`\`\`
```

### Append-Only Session Artifact Rules

All post-commit governance artifacts produced during Phase 4 MUST follow the append-only pattern.
These rules apply to all agent classes:

| Artifact Type | Rule |
|---------------|------|
| **PREHANDOVER proof** | Read-only after initial commit. Never edited post-commit by any agent. |
| **IAA assurance token** | Dedicated new file per §Token Ceremony. Never written into PREHANDOVER proof. |
| **Parking station suggestions** | Per-agent dedicated log file at `.agent-workspace/<agent-name>/parking-station/suggestions-log.md` (never a shared cross-agent file). See `governance/canon/PARKING_STATION_PATH_STANDARD.md`. |
| **Session memories** | New file per session. Rotate per LIVING_AGENT_SYSTEM.md §Rolling Memory. |
| **FAIL-ONLY-ONCE entries** | Append new rule row only. Never delete or edit prior rows. |
| **RCA breach log entries** | Append-only. Never overwrite a prior entry. |

**Rationale**: In multi-agent, concurrent-wave execution, shared mutable files on a branch tip
cause merge conflicts and artifact drift. Each agent writes its own new file; no agent edits
another agent's committed artifact.

**Full specification**: `governance/canon/INDEPENDENT_ASSURANCE_AGENT_CANON.md` §Artifact Immutability Rule

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
- [ ] **Pre-IAA commit-state gate PASSED**: Working tree clean, all deliverables committed at HEAD, PREHANDOVER proof and session memory committed (BLOCKING — IAA must not be invoked until this is ✅)
- [ ] **Scope-declaration parity gate PASSED** (governance PRs only): `.agent-admin/scope-declarations/pr-${PR_NUMBER}.md` file count matches `git diff --name-only origin/main...HEAD` count; per-PR scope file committed and not dirty (BLOCKING — IAA must not be invoked until this is ✅)  (ECAP-QC-002)
- [ ] **Admin Ceremony Compliance Gate PASSED** (ECAP jobs only): §4.3e gate run — 0 auto-fail conditions (AAP-01 through AAP-09, AAP-15 through AAP-21, AAP-23, AAP-24 included); ECAP reconciliation summary present; Foreman QP admin-compliance checkpoint explicitly accepted; active-bundle token/session coherence verified (Check L) (BLOCKING — IAA must not be invoked until this is ✅)
- [ ] **Drift evidence present** (governance/canon PRs): PREHANDOVER proof includes before/after SHA256 for every amended canon file (ECAP-QC-001)
- [ ] **Metadata correctness**: `version == canonical_version` and `amended_date == today` for all amended CANON_INVENTORY entries (ECAP-QC-003, ECAP-QC-004)
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
| **Invoking IAA with dirty tree** | IAA reviews wrong state; REJECTION-PACKAGE | Run §4.3c commit-state gate before IAA; commit all changes first |
| **Escalating resolvable failures** | Ambiguous — hides fixable issues | Escalation only for genuinely ambiguous blockers; fix routine failures directly |
| **No escalation creation** | Ambiguous blockers undocumented | Auto-generate escalation document when a blocker truly cannot be resolved within authority |
| **Vague session memory** | No actionable context for next session | Use structured template |
| **No environment health** | Unknown state at handover | Always record health status |
| **Stale per-PR scope-declaration** | IAA A-026 finding; REJECTION-PACKAGE | Create/update `.agent-admin/scope-declarations/pr-${PR_NUMBER}.md` as the absolute last file committed before IAA; run §4.3d parity gate (ECAP-QC-002) |
| **Writing scope to global governance/scope-declaration.md** | Merge conflicts on concurrent PRs; stale evidence | Use per-PR path `.agent-admin/scope-declarations/pr-${PR_NUMBER}.md` only |
| **Missing drift evidence in proof** | IAA OVL-CG-005 finding; REJECTION-PACKAGE | Include before/after SHA256 for every amended canon file in PREHANDOVER proof (ECAP-QC-001) |
| **version ≠ canonical_version in CANON_INVENTORY** | Downstream version-guard tooling reads the canon as drifted | Run `validate-canon-hashes.sh` which checks consistency; align fields before committing (ECAP-QC-003) |
| **Wrong amended_date or stale hash in CANON_INVENTORY** | Inventory integrity failure; OVL-CG-006 | Set amended_date to today; re-run sha256sum and update file_hash after every file modification (ECAP-QC-004) |
| **Wave task-tracker left with open tasks at handover** | ACR-15 / AAP-23 rejection at §4.3e and IAA | Tick wave task entries (or annotate `[~]` with reason) before running §4.3e; do not submit with open `[ ]` tasks when declaring `final_state: COMPLETE` |
| **active_bundle_iaa_coherence field absent or not VERIFIED** | ACR-16 / AAP-24 rejection at §4.3e and IAA | Perform Check L coherence verification; set `active_bundle_iaa_coherence: VERIFIED` in PREHANDOVER proof only after L1, L2, L3 all pass |

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

## Execution Ceremony Administration Integration (v1.1.6)

When the Foreman appoints an `execution-ceremony-admin-agent` for ceremony bundle preparation, the Phase 4 handover sequence is structured as follows:

### Role Responsibilities in Phase 4

| Phase 4 Step | Default Actor (no ceremony admin) | Actor when ceremony-admin appointed |
|--------------|-----------------------------------|--------------------------------------|
| 4.1 Evidence artifact generation | Producing agent (Foreman / builder) | **execution-ceremony-admin-agent** |
| 4.2 Session memory & closure | Producing agent (Foreman) | **execution-ceremony-admin-agent** |
| 4.3 Pre-handover gate parity check | Producing agent | **execution-ceremony-admin-agent** (prepares); Foreman (reviews) |
| 4.3b Token update ceremony | IAA only | IAA only (unchanged) |
| 4.4 Compliance check | Producing agent | Foreman (post-bundle review) |
| IAA invocation | Foreman | **Foreman** (unchanged — Foreman always invokes IAA) |

### Invariants

The following rules are **unchanged** regardless of whether a ceremony admin is involved:

1. **PREHANDOVER immutability** — once the PREHANDOVER proof is committed, it must not be mutated in-place. A new proof supersedes. This applies whether generated by the Foreman or the `execution-ceremony-admin-agent`.

2. **IAA independence** — IAA is invoked by the Foreman; IAA does NOT perform ceremony administration or cleanup. The `execution-ceremony-admin-agent` does NOT invoke IAA.

3. **Phase 4 Terminal State Rule** — the job remains in BLOCKED/INCOMPLETE state until all required Phase 4 artifacts are committed. Appointing a ceremony admin does not defer this obligation.

4. **Foreman accountability** — Foreman is accountable for bundle completeness at IAA handover time regardless of who prepared the bundle.

### Phase 4 Bundle Return Pattern

When the `execution-ceremony-admin-agent` returns the ceremony bundle to the Foreman:

```markdown
## Ceremony Bundle Return — [Job/Wave Identifier]

**Returned By**: execution-ceremony-admin-agent
**Returned To**: Foreman
**Date**: YYYY-MM-DD
**Bundle Status**: [COMPLETE | PENDING_FOREMAN_REVIEW]

### Artifacts Prepared
- PREHANDOVER proof: [path]
- Session memory: [path]
- Evidence files: [list]
- Gate results: [path]

### Known Issues / Notes
[Any residual administrative issues for Foreman awareness — NOT substantive defects]

### Handover Readiness
[READY FOR FOREMAN REVIEW | REQUIRES FOREMAN DECISION ON: ...]
```

**Full normative definition**: `governance/canon/EXECUTION_CEREMONY_ADMINISTRATION_PROTOCOL.md`

---

## Related Canon

- `governance/canon/AGENT_CONTRACT_ARCHITECTURE.md` - Four-phase overview
- `governance/canon/LIVING_AGENT_SYSTEM.md` - Living Agent framework
- `governance/canon/AGENT_PREFLIGHT_PATTERN.md` - Phase 1 template
- `governance/canon/AGENT_INDUCTION_PROTOCOL.md` - Phase 2 template
- `governance/canon/AGENT_PRIORITY_SYSTEM.md` - Priority codes
- `governance/canon/EVIDENCE_ARTIFACT_BUNDLE_STANDARD.md` - Evidence requirements
- `governance/canon/EXECUTION_CEREMONY_ADMINISTRATION_PROTOCOL.md` - Execution ceremony admin role and handover sequence (v1.1.6)

---

**Version**: 1.6.0  
**Last Updated**: 2026-04-21  
**Authority**: CS2 (Johan Ras)  
**Living Agent System**: v6.2.0
