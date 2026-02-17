# AGENT_PRIORITY_SYSTEM

**Status**: CANONICAL | **Version**: 1.0.0 | **Authority**: CS2  
**Date**: 2026-02-17

---

## Purpose

Defines the **canonical priority coding system** for all agents in the Living Agent System. Priority codes enable:
- Fail-fast on critical issues
- Explicit trade-off decisions
- Clear escalation triggers
- Deterministic task sequencing
- Communication clarity between agents

## Problem This Solves

Without priority codes:
- Everything feels equally important
- No guidance on what to defer when blocked
- Unclear when to escalate vs. park
- No structured fail-fast on critical issues
- Agents waste time on low-priority work when high-priority work is blocked

## Priority Code Structure

Priority codes follow the pattern: `<AgentClass>_<Level>`

**Format**: `AA_L` where:
- `AA` = Agent class abbreviation (2-3 characters)
- `L` = Priority level (H/M/L)

**Examples**:
- `FM_H` = Foreman High priority
- `B_M` = Builder Medium priority  
- `CA_L` = CodexAdvisor Low priority
- `GA_H` = Governance Administrator High priority
- `QA_M` = QA Agent Medium priority

## Agent Class Abbreviations

| Agent Class | Abbreviation | Example Agents |
|-------------|--------------|----------------|
| **Foreman** | FM | foreman-v2 |
| **Builder** | B | ui-builder, api-builder, schema-builder, integration-builder |
| **CodexAdvisor** | CA | CodexAdvisor-agent |
| **Governance Administrator** | GA | governance-repo-administrator-v2 |
| **QA** | QA | qa-builder, test-enforcer |
| **Governance Liaison** | GL | governance-liaison |

**Note**: When new agent classes are added, register abbreviation in this canon.

## Priority Level Definitions

### High Priority (H)

**Meaning**: Constitutional mandate, never defer, never compromise.

**Characteristics**:
- Required for constitutional compliance
- Failure blocks all subsequent work
- Must escalate if blocked
- Cannot be deferred under any circumstances

**When to Use**:
- Core agent responsibilities (e.g., Foreman: architecture-first, Red QA creation, 100% GREEN enforcement)
- Governance compliance (e.g., CANON_INVENTORY verification, degraded mode detection)
- Security/safety requirements (e.g., no secrets in commits, no direct pushes to main)
- Critical invariants (e.g., Foreman NEVER writes code, Builder NEVER bypasses QA)

**Failure Response**:
- HALT execution immediately
- Create CS2 escalation (for constitutional issues)
- Document blocker
- Do NOT attempt workarounds

**Examples by Agent Class**:

| Agent Class | High Priority Examples |
|-------------|------------------------|
| **FM** | Architecture-first design, Red QA creation, 100% GREEN enforcement, Merge gate decisions |
| **B** | Satisfy all Red QA tests, Achieve 100% GREEN, Zero test debt, Complete handover |
| **CA** | CANON_INVENTORY alignment, Agent factory compliance, 30k character limit enforcement |
| **GA** | CANON_INVENTORY integrity, CS2 approval for protected files, Ripple propagation |
| **QA** | 100% test pass rate, Zero skipped/disabled tests, Coverage requirements met |

### Medium Priority (M)

**Meaning**: Operational requirement, defer only in extremis, escalate if blocked.

**Characteristics**:
- Important for quality and compliance
- Should complete in normal flow
- May defer if High priority work is blocked
- Escalate with structured documentation if blocked

**When to Use**:
- Evidence generation (e.g., prehandover proof, gate results)
- Memory management (e.g., session memory, rotation)
- Operational procedures (e.g., builder appointment, governance sync)
- Non-critical governance checks (e.g., cross-reference validation, inventory drift warnings)

**Failure Response**:
- Continue if High priority work is available
- Create structured escalation document
- Document in session memory
- Plan to address in subsequent session if unblocked

**Examples by Agent Class**:

| Agent Class | Medium Priority Examples |
|-------------|------------------------|
| **FM** | Evidence artifact generation, Session memory creation, Builder compliance checking |
| **B** | Code quality standards, Documentation completeness, Performance optimization |
| **CA** | Advisory guidance, Cross-repo coordination, Alignment monitoring |
| **GA** | CHANGELOG updates, Inventory synchronization, Ripple status tracking |
| **QA** | Test performance, Coverage reports, Flaky test detection |

### Low Priority (L)

**Meaning**: Enhancement opportunity, may defer, do NOT escalate.

**Characteristics**:
- Nice-to-have improvements
- Can be parked for future sessions
- Does not block High or Medium work
- No escalation required if skipped

**When to Use**:
- Process improvements (e.g., efficiency gains, automation enhancements)
- Code style refinements (e.g., minor formatting, comment clarity)
- Documentation polish (e.g., examples, cross-references)
- Optional tooling (e.g., helper scripts, dev convenience)

**Failure Response**:
- Park in `.agent-workspace/<agent>/parking-station/`
- Document in session memory as "deferred"
- No escalation required
- May address opportunistically in future sessions

**Examples by Agent Class**:

| Agent Class | Low Priority Examples |
|-------------|------------------------|
| **FM** | Process efficiency improvements, Automation enhancements, Optional documentation |
| **B** | Code style refinements, Comment improvements, Optional helper utilities |
| **CA** | Advisory documentation polish, Optional cross-repo insights, Process suggestions |
| **GA** | Governance documentation polish, Optional tooling, Archive cleanup |
| **QA** | Test code refactoring, Optional coverage enhancements, Performance optimizations |

## Priority Reference Matrix

| Priority | Meaning | When to Use | Can Defer? | Escalate if Blocked? | Failure Action |
|----------|---------|-------------|------------|---------------------|----------------|
| **X_H** | Constitutional mandate | Core duties, governance, safety, critical invariants | NO | YES - to CS2 | HALT, ESCALATE |
| **X_M** | Operational requirement | Evidence, memory, procedures, quality | In extremis only | YES - structured doc | CONTINUE, DOCUMENT |
| **X_L** | Enhancement opportunity | Improvements, polish, convenience | YES | NO | PARK, NOTE |

## Usage in Agent Contracts

### In Preflight Phase

Use priority codes to classify agent duties:

```markdown
**What I Do**:
- Design architecture BEFORE building (FM_H)
- Create Red QA BEFORE execution (FM_H)
- Appoint builders and issue "Build to Green" orders (FM_H)
- Generate evidence artifacts (FM_M)
- Optimize builder workflows (FM_L)
```

### In Induction Scripts

Use priority codes to sequence wake-up checks:

```bash
# FM_H: Verify CANON_INVENTORY integrity (CRITICAL - degraded mode check)
echo "[FM_H] Verifying CANON_INVENTORY integrity..."
if ! jq -e '.constitutional_canon' governance/CANON_INVENTORY.json > /dev/null 2>&1; then
  echo "❌ [FM_H] CANON_INVENTORY missing or invalid - DEGRADED MODE"
  exit 1
fi

# FM_M: Load last 5 session memories
echo "[FM_M] Loading session memories (last 5)..."
MEMORIES=$(ls -t "${WORKSPACE}/memory"/session-*.md 2>/dev/null | head -5)

# FM_L: Check for process improvements
echo "[FM_L] Scanning for process improvement opportunities..."
```

### In Build Scripts

Use priority codes to order task execution:

```bash
# FM_H: Review task requirements against canonical standards
echo "[FM_H] Reviewing task requirements..."

# FM_H: Design architecture (PLAN phase)
echo "[FM_H] Designing architecture..."

# FM_M: Document builder task specification
echo "[FM_M] Documenting builder specification..."

# FM_L: Optimize documentation format
echo "[FM_L] Optional: Formatting documentation..."
```

### In Handover Scripts

Use priority codes for evidence generation:

```bash
# FM_H: Generate gate results (mandatory)
echo "[FM_H] Generating gate results..."

# FM_M: Create session memory (operational)
echo "[FM_M] Creating session memory..."

# FM_L: Update personal learnings (enhancement)
echo "[FM_L] Updating personal learnings..."
```

## Priority Decision Tree

```
┌─ Is this required for constitutional compliance?
│  ├─ YES → Priority_H
│  └─ NO ↓
│
├─ Is this required for operational quality?
│  ├─ YES → Priority_M
│  └─ NO ↓
│
└─ Is this an enhancement/improvement?
   ├─ YES → Priority_L
   └─ NO → Reconsider if task is needed
```

## Priority Escalation Rules

### When to Escalate by Priority

| Priority | Escalate When | Escalate To | Documentation Required |
|----------|---------------|-------------|------------------------|
| **H** | Blocked, failed, or degraded | CS2 | Escalation document in `escalation-inbox/` |
| **M** | Blocked for >1 session | CS2 or agent supervisor | Structured escalation document |
| **L** | NEVER | N/A | Park in `parking-station/` with note |

### Escalation Document Template (for H/M priorities)

```markdown
# Escalation: <Title>

## Type
BLOCKER | GOVERNANCE_GAP | AUTHORITY_BOUNDARY

## Priority
<Agent>_H | <Agent>_M

## Description
[What requires CS2 attention]

## Context
Session: <session-id>
Task: <task description>
Agent: <agent type>
Phase: <Preflight|Induction|Build|Handover>

## Blocker Details
[Why work cannot proceed]

## Recommendation
[Proposed solution]

## Impact if Not Resolved
[What fails if blocker persists]

---
Created: Session <NNN> | Date: YYYY-MM-DD | Priority: <Agent>_<H|M>
```

## Cross-Agent Priority Coordination

When agents work together, priority codes enable clear communication:

| Scenario | Foreman Priority | Builder Priority | Interaction |
|----------|-----------------|------------------|-------------|
| Red QA creation | FM_H | B_H (must satisfy) | FM creates, B implements to GREEN |
| Architecture design | FM_H | B_M (must follow) | FM designs, B consults if unclear |
| Evidence generation | FM_M | B_H (must provide) | FM supervises, B generates proof |
| Code style | FM_L | B_L | Both may defer if time-constrained |

**Key Pattern**: High priority work from supervisor becomes High priority constraint for builder.

## Common Priority Patterns

### Supervisor Pattern (Foreman)

```
FM_H: Architecture design, Red QA, 100% GREEN enforcement, Merge gate
FM_M: Evidence, memory, builder supervision
FM_L: Process improvements, efficiency gains
```

### Builder Pattern

```
B_H: Satisfy Red QA, 100% GREEN, Zero test debt, Complete handover
B_M: Code quality, documentation, performance
B_L: Code style, optional tooling, refactoring
```

### Overseer Pattern (CodexAdvisor)

```
CA_H: CANON_INVENTORY alignment, Agent factory compliance, Approval gates
CA_M: Advisory guidance, cross-repo coordination
CA_L: Documentation polish, optional insights
```

### Administrator Pattern (Governance)

```
GA_H: CANON_INVENTORY integrity, Protected file enforcement, Ripple execution
GA_M: CHANGELOG updates, inventory sync, evidence rotation
GA_L: Archive cleanup, optional documentation
```

## Validation & Enforcement

**Merge Gate Checks**:
- All agent contract duties MUST have priority codes
- All induction/build/handover script steps MUST use priority prefixes
- Missing priority codes → FAIL governance alignment gate

**CodexAdvisor Agent Factory**:
- Validates priority codes in agent contracts
- Ensures H/M/L distribution is reasonable (not everything is H)
- Checks that critical invariants are Priority_H

**Session Closure**:
- Session memory records which priorities were completed vs. deferred
- Unfinished Priority_H work triggers escalation check
- Priority_L deferrals are parked, not escalated

## Anti-Patterns to Avoid

| Anti-Pattern | Why It Fails | Correct Pattern |
|--------------|--------------|-----------------|
| **Everything is Priority_H** | No fail-fast guidance | Use H for constitutional only |
| **No priority codes** | No trade-off clarity | All duties/steps must have priority |
| **Priority_L escalations** | Wastes CS2 time | Park L work, don't escalate |
| **Deferring Priority_H** | Constitutional violations | NEVER defer H; HALT and ESCALATE |
| **Priority in prose only** | Not machine-readable | Use `(Priority_X)` format in lists |

## Authority & Version

**Authority Source**: `governance/canon/AGENT_CONTRACT_ARCHITECTURE.md`  
**Prototype Source**: Foreman v2.0.0 priority matrix  
**Approval**: CS2 (Johan Ras)  
**Effective Date**: 2026-02-17

## Related Canon

- `governance/canon/AGENT_CONTRACT_ARCHITECTURE.md` - Four-phase overview
- `governance/canon/AGENT_PREFLIGHT_PATTERN.md` - Phase 1 template
- `governance/canon/AGENT_INDUCTION_PROTOCOL.md` - Phase 2 template
- `governance/canon/AGENT_HANDOVER_AUTOMATION.md` - Phase 4 template

---

**Version**: 1.0.0  
**Last Updated**: 2026-02-17  
**Authority**: CS2 (Johan Ras)  
**Living Agent System**: v6.2.0
