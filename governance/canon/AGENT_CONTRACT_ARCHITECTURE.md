# AGENT CONTRACT ARCHITECTURE

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

This document establishes the **canonical 4-phase agent contract architecture** that replaces flat, unenforceable documentation with sharp, executable structure. This architecture becomes the mandatory standard for all Maturion agent contracts across all repositories and agent classes.

### Why This Architecture Exists

**Problem**: Flat agent files and checklists fail to block default LLM behaviors, causing:
- Agents defaulting to code-writing instead of orchestration
- Governance drift and boundary violations
- Post-merge gate failures that waste resources
- Constitution violations caught only after cost/burn

**Solution**: Executable, phase-based contracts with mandatory preflight and priority context that STOP constitutional violations before they start, regardless of agent or repository.

### Core Principle

> **Constitutional violations must be prevented, not detected.**  
> Preflight checks and priority-driven context loading enforce boundaries BEFORE work begins.

---

## 2. Constitutional Authority

This architecture derives authority from and supersedes:
- **LIVING_AGENT_SYSTEM.md** - Agent lifecycle framework (now structured via 4 phases)
- **AGENT_SELF_GOVERNANCE_PROTOCOL.md** - Self-governance requirements
- **BUILD_PHILOSOPHY.md** - Constitutional execution discipline
- **GOVERNANCE_PURPOSE_AND_SCOPE.md** - Governance supremacy principle
- **AGENT_CONTRACT_PROTECTION_PROTOCOL.md** - Contract integrity

All existing agent contracts MUST migrate to this architecture. This document is the canonical definition of agent contract structure.

---

## 3. The 4-Phase Architecture

All agent contracts MUST implement these four sequential phases:

```
┌─────────────────────────────────────────────────────────────┐
│ Phase 1: PREFLIGHT                                          │
│ ─────────────────────────────────────────────────────────   │
│ • Identity verification                                     │
│ • Boundary enforcement                                      │
│ • Default behavior blocking                                 │
│ • Role-specific sandbox establishment                       │
│ • STOP conditions: Exit if preflight fails                  │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│ Phase 2: INDUCTION                                          │
│ ─────────────────────────────────────────────────────────   │
│ • Priority-based context loading                            │
│ • Memory scan (last 5 sessions)                             │
│ • Governance canon integration                              │
│ • Environment health check                                  │
│ • Working contract generation                               │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│ Phase 3: BUILD                                              │
│ ─────────────────────────────────────────────────────────   │
│ • Task execution per working contract                       │
│ • Agent-specific orchestration scripts                      │
│ • Constitutional boundary adherence                         │
│ • Continuous evidence capture                               │
│ • Real-time governance alignment                            │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│ Phase 4: HANDOVER                                           │
│ ─────────────────────────────────────────────────────────   │
│ • Automated compliance verification                         │
│ • Evidence artifact generation                              │
│ • Session memory capture                                    │
│ • Environment safe-state validation                         │
│ • Escalation creation (if needed)                           │
└─────────────────────────────────────────────────────────────┘
```

---

## 4. Phase 1: PREFLIGHT

### 4.1 Purpose

**Block default behaviors and establish constitutional boundaries BEFORE any work begins.**

Preflight is the agent's constitutional firewall. It prevents:
- Code-writing when orchestration is required
- Boundary violations
- Role confusion
- Working with degraded/invalid governance state

### 4.2 Mandatory Preflight Checks

ALL agents MUST implement these checks:

1. **Identity Verification**
   - Agent type, class, and role confirmed
   - Contract version validated
   - Execution mode verified (orchestration vs. implementation)

2. **Boundary Establishment**
   - Read/write scope defined and locked
   - Escalation-required paths identified
   - Prohibited actions explicitly listed

3. **Default Behavior Blocking**
   - Code-writing disabled (for orchestration agents)
   - Direct canon modification blocked
   - Force-push and rebase operations prohibited
   - Merge gate bypass prevention

4. **Governance State Validation**
   - CANON_INVENTORY.json exists and valid
   - No placeholder/truncated hashes (degraded mode check)
   - Required governance artifacts present
   - Merge gate interface configured

5. **Role-Specific Sandbox**
   - Foreman: No production code writing, QA ownership established
   - Builder: Architecture Red → Green enforcement
   - Liaison: Read-only cross-repo with controlled writes
   - Administrator: Protected file detection enabled

### 4.3 Preflight Failure = Session Halt

If ANY preflight check fails:
- **STOP IMMEDIATELY** - Do not proceed to Induction
- Create escalation in `escalation-inbox/`
- Exit with clear failure message
- Log failure reason to environment-health.json

**No exceptions. Preflight failures are constitutional blockers.**

### 4.4 Implementation

Preflight MUST be implemented via:
- Executable script: `.github/scripts/preflight-<agent-type>.sh`
- Or embedded in wake-up protocol
- Exit code 0 = pass, non-zero = fail and halt

See: `AGENT_PREFLIGHT_PATTERN.md` for canonical implementation pattern.

---

## 5. Phase 2: INDUCTION

### 5.1 Purpose

**Load context dynamically based on priority, ensuring agents work with current, complete, and relevant governance.**

Induction transforms static contract reading into intelligent, adaptive context loading.

### 5.2 Induction Sequence

1. **Priority Context Loading** (NEW - Core Innovation)
   - Load files from `governance/priorities/<agent-class>/` in priority order
   - Level 0 (Critical): Constitutional constraints (e.g., BUILD_PHILOSOPHY.md)
   - Level 1 (High): Role-specific canon (e.g., FM_ROLE_CANON.md)
   - Level 2 (Medium): Domain-specific guidance
   - Level 3 (Low): Reference material
   - Agent-specific overrides in `priorities/<agent-type>/`

2. **Memory Scan**
   - Read last 5 session memories
   - Extract patterns and lessons learned
   - Load personal anti-patterns and efficiency notes

3. **Governance Integration**
   - Validate CANON_INVENTORY.json integrity
   - Check for new/updated canon since last session
   - Detect pending canon references
   - Verify cross-references

4. **Environment Health Check**
   - Repository state validation
   - Branch protection verification
   - Uncommitted changes detection
   - Workspace structure remediation

5. **Working Contract Generation**
   - Synthesize all loaded context into session-specific contract
   - Include active mandates, boundaries, recent learnings
   - Embed success criteria and escalation triggers

### 5.3 Priority System Benefits

- **Focused Loading**: Agents get critical context first
- **Role Adaptation**: Different agents load different contexts
- **Extensibility**: New canon added via priority files, not contract updates
- **Override Capability**: Agent-specific exceptions without forking contracts

See: `AGENT_PRIORITY_SYSTEM.md` and `AGENT_INDUCTION_PROTOCOL.md` for details.

---

## 6. Phase 3: BUILD

### 6.1 Purpose

**Execute task with orchestration scripts while maintaining constitutional discipline.**

Build is where the agent's actual work happens, guided by the working contract and orchestration scripts.

### 6.2 Build Principles

1. **Script-Driven Orchestration**
   - Task execution via governance/templates/scripts/
   - Reusable, tested, versioned automation
   - No ad-hoc manual changes

2. **Constitutional Boundary Enforcement**
   - Working contract boundaries respected
   - Escalation on boundary violations
   - Real-time governance alignment checks

3. **Evidence Capture**
   - Continuous logging to evidence artifacts
   - Decision rationale documented
   - Pattern detection and recording

4. **Progress Reporting**
   - Regular commits with meaningful messages
   - PR updates with checklist progress
   - Stakeholder visibility maintained

### 6.3 Agent-Specific Build Behaviors

- **Foreman**: Create Red QA, appoint builders, supervise execution, own merge verdict
- **Builder**: Implement architecture to Green, never write Red QA, never approve own PR
- **Liaison**: Synchronize governance cross-repo, maintain alignment, report drift
- **Administrator**: Maintain canon inventory, execute ripple, protect constitutional files

### 6.4 Build Phase Guardrails

- **No Direct Canon Modification**: All constitutional changes via PR + CS2 approval
- **No Gate Bypass**: Local validation before every commit
- **No Test Debt Introduction**: 100% passage, zero warnings
- **No Evidence Mutation**: Create new artifacts, never overwrite

---

## 7. Phase 4: HANDOVER

### 7.1 Purpose

**Automated compliance verification and clean handover to next agent/session.**

Handover ensures the environment is left in a safe, compliant state with complete evidence.

### 7.2 Handover Automation

Handover MUST be automated via:
- Script: `.github/scripts/session-closure.sh <agent-type>`
- Exit code 0 required for successful handover
- Generates compliance evidence artifacts

### 7.3 Mandatory Handover Steps

1. **Compliance Verification**
   - All merge gates pass locally
   - Zero warnings in validation output
   - Zero test debt introduced
   - PREHANDOVER_PROOF artifact generated

2. **Evidence Generation**
   - Session memory created in `memory/session-NNN-YYYYMMDD.md`
   - Evidence artifacts captured
   - Decisions and rationale documented
   - Git diff scope validated

3. **Memory Rotation**
   - Archive sessions beyond 5
   - Update monthly summaries
   - Maintain personal learning files

4. **Safe State Validation**
   - Working tree status checked
   - Branch protection verified
   - Escalations created if needed
   - Environment-health.json updated

5. **Learning Capture**
   - Lessons learned documented
   - Patterns identified and recorded
   - Anti-patterns flagged
   - Efficiency improvements noted

### 7.4 Handover Failure = Incomplete Session

If handover automation fails:
- Session marked as INCOMPLETE
- Create escalation documenting failure
- Do NOT proceed to PR approval
- CS2 review required

See: `AGENT_HANDOVER_AUTOMATION.md` for implementation details.

---

## 8. Migration Path

### 8.1 Existing Agent Contracts

All existing agent contracts MUST migrate to 4-phase architecture:

**Priority Order**:
1. **Foreman** (FM) agents - Highest governance impact
2. **Governance Repository Administrator** - Canon steward
3. **Builder** agents - Execution discipline
4. **CodexAdvisor** - Cross-repo oversight
5. **Liaison** agents - Governance synchronization

### 8.2 Migration Checklist

Per agent contract:
- [ ] Extract preflight checks into Phase 1 section
- [ ] Define priority context files in `governance/priorities/<agent-type>/`
- [ ] Create/update induction protocol script
- [ ] Document build phase orchestration scripts
- [ ] Implement automated handover verification
- [ ] Update agent contract file with 4-phase structure
- [ ] Test full lifecycle (preflight → induction → build → handover)
- [ ] Update CANON_INVENTORY.json entry

### 8.3 Backward Compatibility

- Legacy agent contracts marked as DEPRECATED in CANON_INVENTORY.json
- Grace period: 30 days for migration
- After grace period: Non-compliant contracts trigger merge gate failure

---

## 9. Enforcement

### 9.1 Merge Gate Integration

The Merge Gate Interface MUST verify 4-phase compliance:

1. **Preflight Verification**
   - Agent executed preflight successfully
   - No degraded mode indicators
   - Boundary violations detected and blocked

2. **Induction Verification**
   - Working contract generated
   - Priority context loaded
   - Memory scan completed

3. **Build Verification**
   - Constitutional boundaries respected
   - Evidence artifacts present
   - No prohibited actions taken

4. **Handover Verification**
   - Session closure executed
   - Session memory captured
   - Environment left in safe state

### 9.2 CodexAdvisor Enforcement

CodexAdvisor MUST validate agent behavior against this architecture:
- Preflight execution confirmed
- Priority-based loading verified
- Constitutional boundaries respected
- Handover automation completed

Non-compliance triggers:
- PR rejection with constitutional violation flag
- Escalation to CS2
- Agent contract review requirement

---

## 10. Canonical References

### 10.1 Required Documents

This architecture is implemented via these canonical documents:

| Document | Purpose | Location |
|----------|---------|----------|
| AGENT_CONTRACT_ARCHITECTURE.md | Overall 4-phase structure (this document) | governance/canon/ |
| AGENT_PREFLIGHT_PATTERN.md | Preflight check implementation pattern | governance/canon/ |
| AGENT_PRIORITY_SYSTEM.md | Priority-based context loading | governance/canon/ |
| AGENT_INDUCTION_PROTOCOL.md | Induction phase scripting | governance/canon/ |
| AGENT_HANDOVER_AUTOMATION.md | Handover compliance automation | governance/canon/ |

### 10.2 Supporting Infrastructure

| Component | Purpose | Location |
|-----------|---------|----------|
| Priority Files | Agent-class-specific context files | governance/priorities/<class>/ |
| Script Templates | Reusable orchestration scripts | governance/templates/scripts/ |
| Agent Contracts | 4-phase agent contract instances | .github/agents/*.agent.md |
| Wake-Up Protocol | Preflight + Induction automation | .github/scripts/wake-up-protocol.sh |
| Session Closure | Handover automation | .github/scripts/session-closure.sh |

---

## 11. Acceptance Criteria

A fully compliant 4-phase agent contract MUST demonstrate:

- ✅ **Preflight**: Blocks default behaviors, enforces boundaries, halts on governance degradation
- ✅ **Induction**: Loads priority context, scans memory, generates working contract
- ✅ **Build**: Executes via orchestration scripts, maintains boundaries, captures evidence
- ✅ **Handover**: Automated compliance checks, evidence generation, safe state validation

**Verification**: Full lifecycle test from fresh clone to PR handover with zero manual intervention.

---

## 12. Rationale

### 12.1 Why 4 Phases?

1. **Preflight**: Prevention is cheaper than detection
2. **Induction**: Dynamic context beats static documentation
3. **Build**: Orchestration scripts enforce discipline
4. **Handover**: Automation eliminates manual oversight gaps

### 12.2 Why Constitutional (Tier-0)?

This architecture prevents governance drift at the source. Making it constitutional ensures:
- **Mandatory adoption**: Not optional or negotiable
- **Ripple enforcement**: All repos MUST comply
- **Merge gate integration**: Non-compliance blocks merge
- **Immutable standard**: Changes require CS2 approval

### 12.3 Why Mandatory Priority System?

Priority-based loading:
- Solves context overload problem
- Enables agent-specific customization
- Supports dynamic governance updates
- Prevents stale context issues

---

## 13. Examples

### 13.1 Foreman Agent 4-Phase Structure

**Phase 1: Preflight**
```bash
# Verify Foreman identity
# Block production code writing
# Confirm QA ownership mandate
# Check merge gate configuration
```

**Phase 2: Induction**
```bash
# Load Level 0: BUILD_PHILOSOPHY.md
# Load Level 1: FM_ROLE_CANON.md
# Scan last 5 sessions
# Generate working contract
```

**Phase 3: Build**
```bash
# Create Red QA from architecture
# Appoint builder with task brief
# Monitor builder progress
# Generate merge verdict
```

**Phase 4: Handover**
```bash
# Verify all QA passing
# Confirm builder handover complete
# Create session memory
# Validate environment safe state
```

### 13.2 Builder Agent 4-Phase Structure

**Phase 1: Preflight**
```bash
# Verify Builder identity
# Block Red QA creation (Foreman-only)
# Establish architecture → Green mandate
# Confirm no self-approval capability
```

**Phase 2: Induction**
```bash
# Load Level 0: BUILD_PHILOSOPHY.md
# Load Level 1: BUILDER_ROLE_CANON.md
# Review FM task assignment
# Load architecture Red QA
```

**Phase 3: Build**
```bash
# Implement architecture to Green
# Run tests continuously
# Report progress to FM
# Request QA updates if needed
```

**Phase 4: Handover**
```bash
# Verify 100% Green
# Generate implementation evidence
# Create session memory
# Hand over to FM for verdict
```

---

## 14. Compliance and Auditing

### 14.1 Agent Contract Audit

Every agent contract MUST be auditable for 4-phase compliance:

**Audit Checklist**:
- [ ] Phase 1 (Preflight) section exists and executable
- [ ] Phase 2 (Induction) uses priority system
- [ ] Phase 3 (Build) references orchestration scripts
- [ ] Phase 4 (Handover) uses automated validation
- [ ] All 4 phases tested and verified
- [ ] CANON_INVENTORY.json entry updated

### 14.2 Continuous Compliance

Compliance is verified:
- **At Wake-Up**: Preflight execution mandatory
- **During Build**: Constitutional boundary monitoring
- **At Handover**: Automated compliance verification
- **At Merge**: Gate Interface 4-phase validation

---

## 15. Version History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0.0 | 2026-02-17 | Johan Ras | Initial canonical architecture definition |

---

**Authority**: CS2 (Johan Ras)  
**Governance**: LIVING_AGENT_SYSTEM.md v1.0.0  
**Enforcement**: Merge Gate Interface + CodexAdvisor  
**Ripple**: PUBLIC_API (all consumer repositories)

---

*This document is Tier-0 constitutional canon. All agent contracts MUST comply. Changes require CS2 approval and full governance ripple.*
