# AGENT_CONTRACT_ARCHITECTURE

**Status**: CANONICAL | **Version**: 1.1.0 | **Authority**: CS2  
**Date**: 2026-02-20

---

## Purpose

Establishes the **canonical four-phase agent contract architecture** that transforms agent contracts from static, prose-based documents into dynamic, executable, testable agent behavior systems.

This architecture applies to **all agent classes**: supervisor, builder, overseer, administrator, QA, orchestrator, specialist, and other specialized agents.

## Problem Statement

Traditional agent contracts suffer from:
- **Static Prose**: Contracts are interpreted, not executed, leading to inconsistent behavior
- **Lack of Enforcement**: No structural mechanism to prevent prohibited behaviors (e.g., supervisor writing implementation code)
- **No Context Continuity**: Agents start each session without awareness of prior work, learnings, or patterns
- **Manual Compliance**: Governance adherence depends on agent interpretation, not automated checks
- **Delayed Failure Detection**: Violations discovered at merge time, not session start

This leads to:
- POLC violations (Foreman writing code instead of delegating)
- Test debt accumulation (skipped tests, incomplete implementations)
- Governance drift (agents unaware of canonical changes)
- Repeated mistakes (no learning mechanism)
- Manual escalations (no automated degraded-mode detection)

## Solution: Four-Phase Canonical Contract Architecture

### Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│ PHASE 1: PREFLIGHT (Who Am I & Constraints)                 │
│ ─────────────────────────────────────────────────────────── │
│ • Identity & Authority (agent role, class, mandate)          │
│ • Sandbox & Constitutional Constraints (what I NEVER do)     │
│ • Canonical Governance Bindings (degraded mode triggers)     │
│ OUTPUT: Behavioral guardrails that BLOCK default behaviors   │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│ PHASE 2: INDUCTION (Dynamic Context Loading)                │
│ ─────────────────────────────────────────────────────────── │
│ • Session Wake-Up Protocol (executable script)               │
│ • Memory Load (last 5 sessions)                              │
│ • Canonical State Verification (CANON_INVENTORY check)       │
│ • Environment Health Assessment                              │
│ • Working Contract Generation (session-specific)             │
│ OUTPUT: Contextual awareness + degraded-mode detection       │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│ PHASE 3: BUILD (Executable Work Instructions)               │
│ ─────────────────────────────────────────────────────────── │
│ • Priority-Coded Task Sequences (H/M/L priorities)           │
│ • Agent-Class-Specific Scripts (supervisor ≠ builder)        │
│ • Governance-Enforcing Steps (100% GREEN, zero debt)         │
│ OUTPUT: Executable behavior scripts, not prose guidelines    │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│ PHASE 4: HANDOVER (Automated Closure & Evidence)            │
│ ─────────────────────────────────────────────────────────── │
│ • Evidence Artifact Generation (machine + human readable)    │
│ • Session Memory Creation & Rotation                         │
│ • Environment Health Verification                            │
│ • Escalation Documentation (when required)                   │
│ OUTPUT: Complete audit trail + safe handover state           │
└─────────────────────────────────────────────────────────────┘
```

## Phase Definitions

### Phase 1: Preflight (Identity & Constraints)

**Purpose**: Establish WHO the agent is and WHAT it NEVER does, blocking default behaviors before execution starts.

**Required Components**:
1. **Identity & Authority**: Agent role, class, critical invariants
2. **Sandbox & Constitutional Constraints**: Concrete examples of prohibited vs. permitted behaviors
3. **Canonical Governance Bindings**: Required canon, degraded mode triggers, escalation requirements

**Key Pattern**: Use **negative examples** (❌ WRONG vs. ✅ CORRECT) to block traditional coding agent defaults.

**Example Critical Invariant** (Foreman):
```
FOREMAN NEVER WRITES PRODUCTION CODE
```

**See**: `governance/canon/AGENT_PREFLIGHT_PATTERN.md` for detailed template.

### Phase 2: Induction (Dynamic Governance Loading)

**Purpose**: Load session-specific context, verify canonical alignment, detect degraded states, and generate working contract.

**Required Components**:
1. **Session Wake-Up Protocol**: Executable script (`.github/scripts/wake-up-protocol.sh`)
2. **Memory Load**: Last 5 sessions from `.agent-workspace/<agent>/memory/`
3. **Canonical Verification**: CANON_INVENTORY integrity, placeholder hash detection
4. **Environment Health**: Repository state, merge gate readiness
5. **Working Contract Generation**: Session-specific contract with current context

**Key Pattern**: Scripts are **executable and testable**, not prose. Priority-coded (H/M/L) for fail-fast.

**Degraded Mode Triggers**:
- CANON_INVENTORY missing/invalid → HALT
- Placeholder/truncated PUBLIC_API hashes → FAIL alignment gate, ESCALATE to CS2, BLOCK merge
- Protected files modified without CS2 approval → HALT, ESCALATE

**See**: `governance/canon/AGENT_INDUCTION_PROTOCOL.md` for detailed template.

### Phase 3: Build (Agent-Class-Specific Execution)

**Purpose**: Provide executable, priority-coded work instructions that enforce governance, not just describe it.

**Agent-Class-Specific Scripts**:

| Agent Class | Build Phase Focus | Key Scripts |
|-------------|-------------------|-------------|
| **Supervisor** (Foreman) | Plan-Orchestrate-Lead-Check | Architecture design, Red QA creation, builder delegation, supervision |
| **Builder** | Implement-to-Green | Code implementation, test satisfaction, evidence generation |
| **Overseer** (CodexAdvisor) | Review-Advise-Escalate | Alignment checks, advisory guidance, agent factory operations |
| **Administrator** (Governance) | Verify-Update-Propagate | Canon updates, ripple execution, inventory management |
| **QA** | Test-Verify-Enforce | Test execution, coverage verification, debt detection |
| **Orchestrator** | Decompose-Delegate-Monitor-Integrate | Task decomposition, specialist delegation, result integration |
| **Specialist** | Validate-Execute-Evidence-Report | Domain-scoped execution, evidence generation, result reporting |

**Key Pattern**: Scripts use **priority codes** (FM_H/M/L for supervisor, B_H/M/L for builders, etc.) to sequence critical vs. optional work.

**Priority Legend**:
- **X_H** (High): Constitutional mandate, never defer, escalate if blocked
- **X_M** (Medium): Operational requirement, defer only in extremis, escalate if blocked
- **X_L** (Low): Enhancement opportunity, may defer, park for later

**See**: `governance/canon/AGENT_PRIORITY_SYSTEM.md` for detailed priority definitions.

### Phase 4: Handover (Automated Evidence & Closure)

**Purpose**: Automate evidence generation, session memory capture, memory rotation, and safe handover state verification.

**Required Components**:
1. **Evidence Artifact Generation**: Gate results (JSON), prehandover proof (MD), RCA (if needed)
2. **Session Memory Creation**: Structured session file with task, actions, decisions, lessons
3. **Memory Rotation**: Keep last 5 sessions, archive older with monthly summaries
4. **Environment Health Verification**: Safe state confirmation, escalations recorded
5. **Learning Capture**: Update `lessons-learned.md`, `patterns.md`

**Key Pattern**: Handover is **fully automated** via `.github/scripts/session-closure.sh` - no manual steps.

**Evidence Structure**:
```
.agent-admin/
├── gates/gate-results-<timestamp>.json        # Machine-readable
├── prehandover/proof-<timestamp>.md           # Human-readable
├── rca/analysis-<timestamp>.md                # If failures occurred
└── improvements/capture-<timestamp>.md        # If enhancements found

.agent-workspace/<agent>/
├── memory/session-NNN-YYYYMMDD.md             # Last 5 sessions
├── memory/.archive/session-*.md               # Older sessions
├── personal/lessons-learned.md                # Cumulative learnings
├── personal/patterns.md                       # Observed patterns
└── escalation-inbox/blocker-*.md              # Unresolved escalations
```

**See**: `governance/canon/AGENT_HANDOVER_AUTOMATION.md` for detailed template.

## Contract Structure Template

All agent contracts MUST follow this structure:

```markdown
---
# YAML frontmatter with agent metadata
id: <agent-id>
agent:
  class: <supervisor|builder|overseer|administrator|qa|orchestrator|specialist>
  version: 6.2.0
governance:
  protocol: LIVING_AGENT_SYSTEM
  canon_inventory: governance/CANON_INVENTORY.json
metadata:
  contract_pattern: four_phase_canonical
---

# <Agent Name> — Four-Phase Canonical Contract v<version>

## PHASE 1: PREFLIGHT (WHO AM I & CONSTRAINTS)
### 1.1 Identity & Authority
### 1.2 Sandbox & Constitutional Constraints
### 1.3 Canonical Governance Bindings

## PHASE 2: INDUCTION SCRIPT (DYNAMIC GOVERNANCE/MEMORY LOAD)
### 2.1 Session Wake-Up Protocol (executable)

## PHASE 3: BUILD SCRIPT (AGENT-CLASS-SPECIFIC TASKS)
### 3.1 <Primary Task> (Priority H)
### 3.2 <Secondary Task> (Priority M)
### 3.3 <Tertiary Task> (Priority L)

## PHASE 4: HANDOVER SCRIPT (AUTOMATED EVIDENCE/COMPLIANCE/CLOSURE)
### 4.1 Evidence Artifact Generation
### 4.2 Session Memory & Closure
### 4.3 Compliance Check & Escalation (if needed)

## Priority Reference Matrix
## Canonical Governance References
## Rationale Commentary
```

## Benefits of Four-Phase Architecture

| Benefit | How Achieved | Impact |
|---------|--------------|--------|
| **Enforceable Constraints** | Preflight blocks prohibited behaviors with concrete examples | Prevents POLC violations, test debt |
| **Context Continuity** | Induction loads memories, learnings, patterns | Agents don't repeat mistakes |
| **Degraded-Mode Detection** | Induction verifies CANON_INVENTORY, detects placeholders | Auto-escalates alignment failures |
| **Testable Behavior** | Build scripts are executable, not prose | Can dry-run, verify, evolve |
| **Audit Trail** | Handover automates evidence, memory, escalations | Complete governance compliance |
| **Learning System** | Personal workspace accumulates lessons, patterns | Continuous improvement |
| **Priority-Driven** | All tasks coded H/M/L for fail-fast | Critical work first, defer optional |

## Migration Path

To migrate an existing agent contract to four-phase architecture:

1. **Preflight**: Extract identity, prohibited behaviors, critical invariants
2. **Induction**: Replace static "read this" with wake-up script reference
3. **Build**: Convert prose guidelines into executable, priority-coded scripts
4. **Handover**: Replace "create evidence" with session-closure script reference
5. **Verify**: Test wake-up, build, and handover scripts in isolated session
6. **Update Inventory**: Add to CANON_INVENTORY.json with `contract_pattern: four_phase_canonical`

## Compliance & Enforcement

**CANON_INVENTORY Requirement**:
All agent contracts MUST declare `contract_pattern: four_phase_canonical` in metadata.

**Merge Gate Enforcement**:
- Governance alignment gate verifies four-phase structure in `.agent.md` files
- Missing phases → FAIL gate
- Placeholder hashes in CANON_INVENTORY → DEGRADED mode, BLOCK merge

**CodexAdvisor Enforcement**:
- Agent factory validates four-phase structure before creating/updating agent files
- Checklists verify all four phases present
- 30,000 character limit enforced (keep phases concise, link to scripts)

## Authority & Version

**Authority Source**: Living Agent System v6.2.0 (`governance/canon/LIVING_AGENT_SYSTEM.md`)  
**Prototype Source**: Foreman v2.0.0 (`.github/agents/foreman-v2.agent.md`)  
**Approval**: CS2 (Johan Ras)  
**Effective Date**: 2026-02-17

## Related Canon

- `governance/canon/LIVING_AGENT_SYSTEM.md` - Living Agent framework
- `governance/canon/AGENT_PREFLIGHT_PATTERN.md` - Phase 1 template
- `governance/canon/AGENT_INDUCTION_PROTOCOL.md` - Phase 2 template  
- `governance/canon/AGENT_PRIORITY_SYSTEM.md` - Priority codes
- `governance/canon/AGENT_HANDOVER_AUTOMATION.md` - Phase 4 template
- `governance/canon/AGENT_CONTRACT_PROTECTION_PROTOCOL.md` - Contract modification
- `governance/canon/ORCHESTRATOR_SPECIALIST_ARCHITECTURE.md` - Orchestrator/specialist roles
- `governance/canon/AGENT_DELEGATION_PROTOCOL.md` - Delegation mechanics
- `governance/canon/SPECIALIST_KNOWLEDGE_MANAGEMENT.md` - Specialist knowledge management
- `governance/canon/MULTI_EMBODIMENT_ORCHESTRATION_MODEL.md` - Multi-embodiment patterns

---

**Version**: 1.1.0  
**Last Updated**: 2026-02-20  
**Authority**: CS2 (Johan Ras)  
**Living Agent System**: v6.2.0
