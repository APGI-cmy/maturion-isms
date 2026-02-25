# LIVING_AGENT_SYSTEM

**Status**: CANONICAL | **Version**: 1.1.0 | **Authority**: CS2  
**Date**: 2026-02-24

---

## Purpose

Transform agent contracts from static, monolithic documents into a dynamic, memory-enabled system that enables agents to:
- Contextualize themselves at session start
- Maintain rolling memory across sessions
- Perform mandatory environment and governance self-checks
- Generate contextual working contracts dynamically
- Learn from experience and maintain continuity
- Escalate intelligently without requiring static contract updates

## Problem Statement

Current agent contracts are:
- **Static and Lengthy**: 600+ lines that quickly become outdated
- **Context-Free**: No awareness of previous sessions or learnings
- **Memory-Less**: No ability to remember patterns, mistakes, or improvements
- **High Maintenance**: Require frequent manual updates and version management
- **Fragile**: Direct modification creates governance risk and version drift

This leads to:
- Recurring governance gaps
- Distributed context loss across sessions
- Increased CS2 workload for trivial contract updates
- Agent confusion from outdated information
- Inability to learn and improve over time

## Solution: Living Agent System

### Core Principles

1. **One-Read Entry**: Reading this protocol at session start provides complete context
2. **Zero Direct Writing**: Agents NEVER modify agent contract files directly
3. **Dynamic Context**: Working contracts generated fresh each session from current state
4. **Rolling Memory**: Last 5 sessions retained, older archived with summaries
5. **Continuous Learning**: Patterns, mistakes, and improvements captured for reuse
6. **Smart Escalation**: Only escalate what cannot be auto-remediated
7. **Environment Awareness**: Self-check environment health before starting work

---

## Agent Lifecycle

### 1. Wake-Up Phase (Session Start)

**Executable**: `.github/scripts/wake-up-protocol.sh`

**Actions**:
1. **Self-Identification**: Load agent identity (type, class, mission)
2. **Memory Scan**: Read last 5 session memories from `.agent-workspace/<agent-type>/memory/`
3. **Context Load**: Read big-picture context and architecture
4. **Environment Check**: Verify repo state, branches, governance alignment
5. **Environment Health Scan & Remediation** (NEW - Constitutional): Pre-task environment scanning, autonomous remediation, and escalation per AGENT_ENVIRONMENTAL_RESPONSIBILITY_DOCTRINE.md
6. **Gap Analysis**: Check governance inventory for missing/outdated canon
7. **Working Contract Generation**: Create session-specific `working-contract.md`
8. **Escalation Check**: Review escalation inbox for handoffs from other agents
9. **Health Assessment**: Record environment health in `environment-health.json`

**Output**: 
- `working-contract.md` (session-specific context, boundaries, mandates)
- `environment-health.json` (last health check timestamp and status with environment_health_status)
- Console confirmation of readiness state
- Autonomous remediations logged (if any)
- Escalations created (if critical issues detected)

### 2. Working Phase (Execution)

**Agent Behavior**:
- Follow working contract, not static agent file
- Reference canonical governance from CANON_INVENTORY.json
- Capture lessons learned in personal workspace
- Record patterns and anti-patterns encountered
- Note efficiency improvements and blockers
- Flag governance gaps for later analysis

**Memory Capture** (Continuous):
- Decisions made and rationale
- Patterns discovered
- Mistakes avoided
- Efficiency improvements
- Blockers encountered
- Governance gaps identified

### 2.5 Pre-Build Reality Check Gate (Foreman — MANDATORY)

**Authority**: PRE_BUILD_REALITY_CHECK_CANON.md v1.0.0  
**Priority**: FM_H — Cannot be bypassed  
**Applies To**: All module deliveries (MAT, ROADMAP, PIT, AIMC, RADAM, and successors)

Before any ticket generation or build wave begins, the Foreman MUST execute the Pre-Build Reality Check gate:

1. **Verify prerequisites complete**: App Description, FRS, TRS, Architecture, Implementation Plan, Red QA Suite — all approved
2. **Coordinate multi-party review**: Foreman + client/user rep + builder lead + quality/domain expert
3. **Execute §4.3 checklist** (PRE_BUILD_REALITY_CHECK_CANON.md): requirements completeness, functional coverage, architecture alignment, plan fidelity, Red QA coverage, statutory compliance, risk assessment
4. **Document findings**: Record all gaps in Reality Check Log with severity classification
5. **Resolve gaps**: All CRITICAL and MAJOR gaps must be closed; re-check affected sections after each fix
6. **Record gate outcome**: PASS / CONDITIONAL PASS / FAIL / ESCALATED in module tracker and session memory
7. **Proceed only on PASS or CONDITIONAL PASS**: Build must not start while gate is FAIL or ESCALATED

**Evidence Required**: Reality Check Log at `<module>/05-build-readiness/pre-build-reality-check-YYYYMMDD.md` or equivalent path per canon.

**Retroactive Mandate**: Modules in active delivery must apply this gate before their next build wave.

---

### 3. Session Closure Phase (Handover)

**Executable**: `.github/scripts/session-closure.sh`

**Actions**:
1. **Memory Creation**: Write session summary to `memory/session-YYYYMMDD-HHMMSS.md`
2. **Memory Rotation**: Archive sessions older than 5 into `.archive/`
3. **Lessons Capture**: Update `personal/lessons-learned.md`
4. **Pattern Recording**: Update `personal/patterns.md`
5. **Escalation Creation**: Write escalation files to `escalation-inbox/` if needed
6. **Environment Update**: Update `environment-health.json` with final state
7. **Working Contract Archive**: Move `working-contract.md` to memory archive
8. **Improvement Proposals**: Create proposal files per MANDATORY_ENHANCEMENT_CAPTURE_STANDARD.md
9. **Safe State Verification**: Confirm environment left in clean state

**Output**:
- Session memory file created
- Old memories archived
- Escalations prepared for next agent/session
- Environment verified safe for handover

---

## Workspace Structure

```
.agent-workspace/
├── <agent-type>/                    # e.g., governance-repo-administrator/
│   ├── memory/                      # Rolling memory (last 5 sessions)
│   │   ├── session-20260204-135856.md
│   │   ├── session-20260203-081234.md
│   │   ├── session-20260202-143021.md
│   │   ├── session-20260201-090147.md
│   │   ├── session-20260131-165512.md
│   │   └── .archive/                # Older sessions + summaries
│   │       ├── summary-2026-01.md   # Monthly summary
│   │       └── sessions-2026-01/    # Full archived sessions
│   ├── working-contract.md          # Current session context
│   ├── environment-health.json      # Last environment check
│   ├── personal/                    # Private learnings
│   │   ├── lessons-learned.md       # Mistakes to avoid
│   │   ├── patterns.md              # Recurring patterns
│   │   ├── efficiency-log.md        # Process improvements
│   │   └── anti-patterns.md         # Things that don't work
│   ├── context/                     # Big-picture understanding
│   │   ├── system-purpose.md        # Overall system goals
│   │   ├── architecture.md          # High-level architecture
│   │   ├── agent-role.md            # This agent's role in ecosystem
│   │   └── dependencies.md          # Integration points
│   └── escalation-inbox/            # Handoffs from other agents
│       ├── from-<agent>-YYYYMMDD.md
│       └── resolved/                # Processed escalations
```

---

## Memory Format

### Session Memory (`memory/session-YYYYMMDD-HHMMSS.md`)

```markdown
# Session Memory: YYYY-MM-DD HH:MM:SS

## Agent
- Type: <agent-type>
- Class: <agent-class>
- Session ID: <session-id>

## Context
- Issue: #<issue-number>
- Branch: <branch-name>
- Purpose: <high-level task description>

## Actions Taken
- Action 1: <description>
- Action 2: <description>
...

## Decisions Made
- Decision 1: <what> and <why>
- Decision 2: <what> and <why>
...

## Lessons Learned
- Lesson 1: <observation>
- Lesson 2: <observation>
...

## Patterns Observed
- Pattern 1: <description>
- Pattern 2: <description>
...

## Blockers Encountered
- Blocker 1: <description> [RESOLVED/ESCALATED]
- Blocker 2: <description> [RESOLVED/ESCALATED]
...

## Governance Gaps Identified
- Gap 1: <description> [ACTION TAKEN]
- Gap 2: <description> [ACTION TAKEN]
...

## Files Modified
- <file-path>: <change description>
...

## Next Session Recommendations
- Recommendation 1: <description>
- Recommendation 2: <description>
...

## Handover State
- Status: [COMPLETE/ESCALATED/BLOCKED]
- Environment: [CLEAN/DIRTY/PARTIAL]
- Notes: <additional context>
```

### Working Contract (`working-contract.md`)

Generated fresh each session from:
- Agent identity (from agent contract YAML frontmatter)
- Last 5 session memories
- Current governance canon bindings
- Current environment state
- Big-picture context
- Personal lessons learned

**Structure**:
```markdown
# Working Contract: <Agent Type> - Session <Timestamp>

## Identity & Mission
[From agent contract frontmatter]

## Session Context
- Task: <current task>
- Branch: <branch>
- Environment Health: <status>

## Active Mandates
[From governance bindings + recent learnings]

## Session Boundaries
- Scope: <what's in scope>
- Out of Scope: <what's excluded>
- Escalate If: <conditions>

## Recent Learnings
[Last 5 sessions summary]

## Current Governance State
[From CANON_INVENTORY.json + inventory]

## Personal Reminders
[From personal/ lessons and patterns]

## Success Criteria
[Session-specific completion criteria]
```

---

## Integration with Existing Governance

### Governance Inventory Integration

Wake-up protocol MUST:
1. Read `GOVERNANCE_ARTIFACT_INVENTORY.md`
2. Compare against CANON_INVENTORY.json
3. Detect missing or outdated canon files
4. Attempt auto-remediation (pull from canonical source)
5. Escalate if remediation fails or approval required

### Gap Analyzer Integration

Wake-up protocol MUST:
1. Execute governance gap analysis scan
2. Review findings for session-relevant gaps
3. Auto-remediate known gap patterns
4. Escalate novel gaps with context

### Ripple Integration

Session closure protocol MUST:
1. Detect if changes affect governance canon
2. Update GOVERNANCE_ARTIFACT_INVENTORY.md if canon modified
3. Create ripple plan for consumer repos
4. Coordinate with governance-liaison for external ripple
5. Document ripple completion status in memory

### Gate Integration

Both wake-up and session closure MUST:
1. Verify all merge gates can execute
2. Run local validation before handover
3. Document gate results in environment-health.json
4. Escalate if gates fail and cannot self-fix

---

## Agent Contract Migration

### Static Contract → Living System

**Old Model** (Static):
```
.github/agents/agent-name.md (600+ lines, frequently outdated)
```

**New Model** (Dynamic):
```
.github/agents/agent-name.md (YAML frontmatter + mission statement only)
governance/canon/LIVING_AGENT_SYSTEM.md (one-read protocol)
.agent-workspace/<agent-type>/ (memory, context, working contract)
.github/scripts/wake-up-protocol.sh (executable entry point)
.github/scripts/session-closure.sh (executable exit point)
```

### Migration Steps

1. **Extract Core Identity**:
   - Keep YAML frontmatter (id, class, governance bindings, scope, capabilities)
   - Keep mission statement (1-2 paragraphs)
   - Remove all procedural instructions (moved to LAS protocol)

2. **Archive Static Content**:
   - Move full contract to `.github/agents/legacy/<agent-name>.md`
   - Add README explaining supersession by LIVING_AGENT_SYSTEM
   - Maintain for historical reference only

3. **Initialize Workspace**:
   - Create `.agent-workspace/<agent-type>/` structure
   - Initialize context files (system-purpose.md, architecture.md, agent-role.md)
   - Create empty memory and personal directories

4. **First Session**:
   - Agent reads LIVING_AGENT_SYSTEM.md (one-read protocol)
   - Executes wake-up-protocol.sh
   - Generates first working-contract.md
   - Performs work
   - Executes session-closure.sh
   - Creates first session memory

---

## Prohibitions

1. **❌ NEVER modify agent contract files directly — especially `.github/agents/` files**
   - Escalate contract changes to CS2
   - Document in improvement proposals
   - Use working contract for session-specific adjustments
   - **CONSTITUTIONAL**: Only CodexAdvisor (with explicit CS2 permission via layer-down issue) may write to `.github/agents/`. All other agents — including governance-repo-administrator executing ripple — MUST stop and escalate to CS2. See `governance/canon/AGENT_CONTRACT_FILE_PROTECTION_POLICY.md`.

2. **❌ NEVER skip wake-up protocol**
   - Mandatory for all sessions
   - Required for context and memory loading
   - Ensures environment health check

3. **❌ NEVER skip session closure**
   - Mandatory for all handovers
   - Required for memory capture
   - Ensures safe environment state

4. **❌ NEVER clear memory without archiving**
   - Rolling 5-session window
   - Older sessions archived with summaries
   - Permanent deletion requires CS2 approval

5. **❌ NEVER bypass environment health checks**
   - Critical for detecting governance drift
   - Required for gap analysis
   - Mandatory before starting work

6. **❌ NEVER assume context from previous sessions**
   - Always read memory files explicitly
   - Memory provides continuity, not assumptions
   - Verify current state, don't rely on history

---

## Codex/AI Agent Participation

### AI Agent Integration

AI agents (like CodexAdvisor, governance-repo-administrator) MUST:

1. **Read LAS Protocol**: First action of every session
2. **Execute Wake-Up**: Run wake-up-protocol.sh
3. **Reference Working Contract**: Use generated working contract, not static file
4. **Capture Memory**: Document learnings during session
5. **Execute Closure**: Run session-closure.sh before handover

### Human Agent Integration

Human agents (like CS2, FM) MAY:

1. **Review Agent Memory**: Understand agent learnings and patterns
2. **Provide Context**: Add to context/ files for agent reference
3. **Resolve Escalations**: Review escalation-inbox/ and provide guidance
4. **Approve Improvements**: Review proposals from session-closure

### Cross-Agent Coordination

Multiple agents working on related tasks:

1. **Shared Context**: Read each other's context/ files for coordination
2. **Escalation Handoffs**: Use escalation-inbox/ for agent-to-agent communication
3. **Memory Review**: Check related agent memories for patterns
4. **Working Contract Visibility**: Can read other agents' working contracts for awareness

---

## Implementation Bootstrapping

### Phase 1: Governance Repo Implementation

1. Create LIVING_AGENT_SYSTEM.md (this document) in governance/canon/
2. Create wake-up-protocol.sh and session-closure.sh in .github/scripts/
3. Create workspace structure templates
4. Migrate governance-repo-administrator and CodexAdvisor-agent
5. Test with simulated jobs
6. Document in GOVERNANCE_ARTIFACT_INVENTORY.md

### Phase 2: Consumer Repo Ripple

1. Coordinate with governance-liaison agents in consumer repos
2. Create issue in each consumer repo for LAS adoption
3. Provide workspace templates and scripts
4. Support migration of consumer repo agents (if any)
5. Verify adoption and functionality

### Phase 3: Full Ecosystem Adoption

1. Add LAS to CANON_INVENTORY.json
2. Update agent onboarding documentation
3. Establish LAS as mandatory entry protocol
4. Monitor adoption and effectiveness
5. Iterate based on agent feedback and learnings

### Testing Scenarios

**Scenario 1: Builder Onboarding**
```bash
# Session 1
.github/scripts/wake-up-protocol.sh governance-repo-administrator
# Agent performs builder onboarding plan creation
.github/scripts/session-closure.sh governance-repo-administrator

# Session 2 (follow-up)
.github/scripts/wake-up-protocol.sh governance-repo-administrator
# Agent should reference Session 1 memory and continue work
.github/scripts/session-closure.sh governance-repo-administrator
```

**Scenario 2: Governance Canon Update**
```bash
# Session 1
.github/scripts/wake-up-protocol.sh governance-repo-administrator
# Agent updates governance canon file
# Session closure should detect ripple requirement
.github/scripts/session-closure.sh governance-repo-administrator
# Should create escalation for governance-liaison
```

**Scenario 3: Multi-Agent Coordination**
```bash
# CodexAdvisor session
.github/scripts/wake-up-protocol.sh CodexAdvisor-agent
# Identifies issue requiring governance-repo-administrator
# Creates escalation in governance-repo-administrator/escalation-inbox/
.github/scripts/session-closure.sh CodexAdvisor-agent

# governance-repo-administrator session
.github/scripts/wake-up-protocol.sh governance-repo-administrator
# Reads escalation from CodexAdvisor
# Processes escalation
.github/scripts/session-closure.sh governance-repo-administrator
```

---

## Success Criteria

- [x] LIVING_AGENT_SYSTEM.md created and canonical
- [ ] wake-up-protocol.sh implemented and functional
- [ ] session-closure.sh implemented and functional
- [ ] Workspace structure templates created
- [ ] governance-repo-administrator migrated to LAS
- [ ] CodexAdvisor-agent migrated to LAS
- [ ] Legacy contracts archived with documentation
- [ ] GOVERNANCE_ARTIFACT_INVENTORY.md updated
- [ ] CANON_INVENTORY.json updated
- [ ] Functional testing complete (3 scenarios)
- [ ] Memory continuity verified across sessions
- [ ] Quick start guide created
- [ ] Consumer repo ripple plan documented

---

## Agent Contract File Protection (Constitutional)

> **Version Note**: Added in v1.1.0 following governance breach in `APGI-cmy/maturion-isms` PR #517. See `governance/incidents/INCIDENT-2026-02-24-PR517-AGENT-CONTRACT-BREACH.md`.

### Absolute Prohibition

**CONSTITUTIONAL RULE — NON-BYPASSABLE:**

> **No agent — other than CodexAdvisor acting with explicit CS2 permission via a CS2-approved layer-down issue — may create, modify, or delete any file in `.github/agents/`.**

This applies universally: all agent types, all contexts (including ripple execution), all repositories.

### Who May Modify `.github/agents/` Files

| Actor | Authority | Condition |
|-------|-----------|-----------|
| CS2 (Johan Ras) | ✅ FULL | Always |
| CodexAdvisor | ✅ CONDITIONAL | ONLY with explicit CS2 permission via approved layer-down issue; IAA audit required |
| governance-repo-administrator | ❌ PROHIBITED | Must escalate to CS2 even during ripple |
| All other agents | ❌ PROHIBITED | Must escalate to CS2 |

### Mandatory Pathway When Ripple Requires Agent Contract Changes

1. **Stop** — do NOT modify `.github/agents/` files
2. **Create escalation** at `.agent-workspace/<agent>/escalation-inbox/agent-contract-modification-YYYYMMDD.md`
3. **CS2 reviews** and creates an authorized layer-down issue for CodexAdvisor
4. **CodexAdvisor executes** the approved changes with full traceability
5. **IAA audits** the changes before merge is permitted

**Full specification**: `governance/canon/AGENT_CONTRACT_FILE_PROTECTION_POLICY.md`

### IAA Audit Requirement

All `.github/agents/` modifications by CodexAdvisor require Independent Assurance Agent (IAA) audit:
- Diff check against CS2-approved specification
- Content evaluation and semantic appropriateness
- Authority compliance verification
- ASSURANCE-TOKEN (approved) or REJECTION-PACKAGE (blocked merge)

### CI/CD Enforcement

`.github/workflows/agent-contract-audit.yml` runs on all PRs modifying `.github/agents/**` and enforces CS2 authorization and CodexAdvisor involvement requirements.

---

## Authority & Enforcement

**Authority**: CS2 (Johan Ras/Maturion)  
**Scope**: All agents in Maturion governed repositories  
**Enforcement**: MANDATORY for new agents, migration required for existing agents  
**Review Cycle**: Quarterly or after 100 agent sessions  
**Amendment Process**: CS2 approval required for protocol changes

---

## Version History

**v1.0.0** (2026-02-04): Initial canonical protocol creation. Defines agent lifecycle, workspace structure, memory management, integration with governance, migration process, and enforcement model. Authority: CS2, Issue #[TBD].

**v1.1.0** (2026-02-24): Added Agent Contract File Protection section (constitutional rule: only CodexAdvisor with explicit CS2 permission may modify `.github/agents/` files). Updated Prohibition #1 to be explicit about `.github/agents/` scope. Added IAA audit requirement and CI/CD enforcement specification. Triggered by governance breach in `APGI-cmy/maturion-isms` PR #517. Authority: CS2 (Johan Ras).

---

## Cross-Repository Layer-Down Requirements

**MANDATORY**: When this canon is created or updated, the following layer-down actions MUST be executed:

### 1. Update Canonical Governance Inventory
- Update `GOVERNANCE_ARTIFACT_INVENTORY.md` with this canon
- Mark version and last-updated timestamp
- Document ripple requirement

### 2. Create Consumer Repo Issues
- Create issue in each consumer repo (office-app, PartPulse, R_Roster)
- Assign to respective governance-liaison agents
- Include adoption plan and timeline
- Provide workspace templates and scripts

### 3. Update Agent Contracts (Governance Repo)
- Archive current agent contracts to legacy/
- Update agent contracts to reference LAS
- Add wake-up/closure protocol requirements to LOCKED sections
- Update AGENT_CONTRACT_PROTECTION_PROTOCOL.md to include LAS requirements

### 4. Script Deployment
- Ensure wake-up-protocol.sh and session-closure.sh exist
- Verify scripts are executable
- Test scripts with dry-run mode
- Document script usage in agent contracts

### 5. Workspace Template Creation
- Create `.agent-workspace-template/` in governance repo
- Include all required directories and file templates
- Provide initialization script
- Document in START_HERE.md

### 6. TIER_0 Canon Integration
- Add LIVING_AGENT_SYSTEM.md to CANON_INVENTORY.json
- Update manifest version
- Verify all agents load this canon at runtime

### 7. Documentation Updates
- Update START_HERE.md with LAS overview
- Create QUICK_START_LAS.md for agent onboarding
- Update agent recruitment documentation
- Add LAS to agent training materials

**Validation**: All layer-down steps must be completed and verified before considering canon implementation complete. Document completion in PREHANDOVER_PROOF with evidence.

**Authority**: AGENT_CONTRACT_PROTECTION_PROTOCOL.md Section 11.2, GOVERNANCE_RIPPLE_MODEL.md

---
