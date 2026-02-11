# AGENT CLASS SPECIFIC GATE PROTOCOLS

## Status
**Type**: Tier-0 Constitutional Canon  
**Authority**: Supreme - Constitutional  
**Version**: 1.0.0  
**Effective Date**: 2026-02-08  
**Owner**: Maturion Engineering Leadership (Johan Ras)  
**Layer-Down Status**: PUBLIC_API  
**Applies To**: All Agents, All Repositories  

---

## 1. Purpose

This document establishes **canonical, agent-class-specific merge gate protocols** for the Living Agent System (LAS v5.0.0). It defines precisely what each agent class must validate before merge, what they may self-align, and when they must escalate to CS2.

This protocol exists to ensure:
- **Zero ambiguity** on merge gate requirements per agent class
- **Clear escalation boundaries** for each agent type
- **Appropriate rigor** applied to each class of work
- **Self-alignment authority** is well-defined and bounded
- **CS2 escalation** occurs precisely when needed, not before or after

**Core Principle**: Different agent classes have different responsibilities, authorities, and gate requirements. One size does not fit all.

---

## 2. Constitutional Authority

This protocol derives authority from and implements:
- **LIVING_AGENT_SYSTEM.md** - Living agent architecture and session lifecycle
- **AGENT_SELF_GOVERNANCE_PROTOCOL.md** - Universal self-governance check
- **AGENT_ROLE_GATE_APPLICABILITY.md** - Agent role definitions
- **BUILD_PHILOSOPHY.md** - One-Time Build Law for builders
- **GOVERNANCE_GATE_CANON.md** - Gate evaluation and enforcement
- **PR_GATE_EVALUATION_AND_ROLE_PROTOCOL.md** - PR gate semantics
- **CS2_AGENT_FILE_AUTHORITY_MODEL.md** - Authority hierarchy

---

## 3. Agent Class Taxonomy

### 3.1 Class Definitions

This protocol recognizes **four primary agent classes**:

1. **Overseer** - Cross-repository coordination, constitutional enforcement, quality oversight
2. **Liaison** - Repository-specific governance liaison, governance propagation, self-alignment
3. **Builder** - Application code implementation, test-to-green execution
4. **Foreman** - Build orchestration, wave planning, QA creation, builder supervision

Each class has distinct responsibilities, authorities, and gate requirements.

---

## 4. Overseer Agent Gate Protocol

### 4.1 Overseer Identity

**Role**: Constitutional oversight, cross-repository coordination, quality assurance, governance enforcement

**Examples**:
- CodexAdvisor (cross-repo governance coordinator)
- Constitutional watchdog agents
- Quality oversight agents
- Cross-repository governance synchronization agents

**Authority**: Supreme oversight, constitutional enforcement, quality gates, cross-repo coordination

### 4.2 Overseer Merge Gate Requirements

#### Pre-Merge Validation Checklist

✅ **MANDATORY** - Must validate before merge:

1. **Constitutional Compliance**
   - No constitutional violations introduced
   - All CS1-CS6 safeguards respected
   - Protected file modifications have CS2 approval
   - Governance changes comply with GOVERNANCE_RIPPLE_MODEL.md

2. **Cross-Repository Integrity**
   - Changes don't break downstream repositories
   - Layer-down requirements satisfied per CROSS_REPOSITORY_LAYER_DOWN_PROTOCOL.md
   - Ripple awareness communicated if applicable

3. **Quality Gate Enforcement**
   - All applicable quality gates passed
   - No quality regressions introduced
   - Evidence of validation provided

4. **Governance Alignment**
   - Self-governance check performed (AGENT_SELF_GOVERNANCE_PROTOCOL.md)
   - Working contract generated and followed
   - Session memory captured
   - Governance inventory updated if governance artifacts changed

5. **Escalation Handling**
   - All escalations from subordinate agents resolved or documented
   - CS2 involvement obtained where required
   - Approval gates satisfied

#### Self-Alignment Authority

✅ **MAY self-align**:
- Cross-repository governance synchronization (layer-down)
- Quality gate configuration updates
- Constitutional enforcement mechanism improvements
- Oversight process refinements
- Documentation and guidance updates

❌ **MUST escalate to CS2**:
- Constitutional changes (CS1-CS6 modifications)
- Protected file changes without approval
- New constitutional rules or safeguards
- Authority boundary changes
- Agent class taxonomy changes

#### Gate Validation Method

**Primary**: Automated constitutional compliance checks
**Secondary**: Cross-repository impact analysis
**Tertiary**: Manual CS2 review for protected changes

---

## 5. Liaison Agent Gate Protocol

### 5.1 Liaison Identity

**Role**: Repository-specific governance liaison, governance propagation, local governance administration, self-alignment within bounds

**Examples**:
- Repository governance liaison agents
- Governance-repo-administrator
- Repository governance propagation agents
- Local governance maintenance agents

**Authority**: Repository governance administration, bounded self-alignment, governance artifact maintenance

### 5.2 Liaison Merge Gate Requirements

#### Pre-Merge Validation Checklist

✅ **MANDATORY** - Must validate before merge:

1. **Governance Artifact Integrity**
   - All governance artifacts syntactically valid (JSON, YAML, Markdown)
   - Cross-references are valid and resolvable
   - Inventory updated (GOVERNANCE_ARTIFACT_INVENTORY.md)
   - Canon manifest updated if canon changed (CANON_INVENTORY.json)

2. **Self-Governance Compliance**
   - Self-governance check performed per AGENT_SELF_GOVERNANCE_PROTOCOL.md
   - Working contract generated from LIVING_AGENT_SYSTEM.md wake-up protocol
   - Session memory captured
   - Environment health validated

3. **Ripple Execution**
   - If canon changed: Governance ripple executed per GOVERNANCE_RIPPLE_MODEL.md
   - Ripple report generated and committed
   - Downstream repositories notified if layer-down required
   - Ripple status tracked

4. **Alignment Boundaries**
   - Changes fall within self-alignment authority (see 5.3)
   - No constitutional interpretation performed
   - No agent contract modifications attempted
   - No protected governance changes without CS2 approval

5. **Documentation Quality**
   - Clear commit messages
   - PR description explains governance impact
   - Rationale for changes documented
   - Evidence of validation provided

#### Self-Alignment Authority

✅ **MAY self-align** (within repository):
- Governance artifact inventory maintenance
- Schema validation and format corrections
- Cross-reference repairs (broken links, moved files)
- Documentation improvements (clarity, examples)
- Governance artifact organization (folder structure, naming)
- Template updates (non-constitutional)
- Runbook and guidance refinements
- Evidence and report generation
- Governance gap analysis documentation

✅ **MAY create** (but not modify existing):
- New governance reports
- New templates (non-canonical)
- New runbooks and guidance
- New examples and samples
- Gap analysis documents
- Escalation reports to CS2

❌ **MUST escalate to CS2**:
- Agent contract modifications (protected per AGENT_CONTRACT_PROTECTION_PROTOCOL.md)
- Constitutional governance changes (canon tier-0 interpretation)
- New canonical rules or policies
- Authority boundary changes
- Governance philosophy or principles
- Protected file modifications (.github/workflows/, constitution/)

#### Gate Validation Method

**Primary**: Governance artifact validation (syntax, cross-refs, inventory)
**Secondary**: Ripple execution verification (if canon changed)
**Tertiary**: Self-alignment boundary check (authority compliance)

---

## 6. Builder Agent Gate Protocol

### 6.1 Builder Identity

**Role**: Application code implementation, test-to-green execution, production artifact creation

**Examples**:
- GitHub Copilot builder agents
- Local builder agents
- CI/CD builder automation
- Code implementation agents

**Authority**: Production code implementation, test fixes, code quality improvements (within governance bounds)

### 6.2 Builder Merge Gate Requirements

#### Pre-Merge Validation Checklist

✅ **MANDATORY** - Must validate before merge:

1. **One-Time Build Law Compliance**
   - 100% GREEN: All tests passing (per BUILD_PHILOSOPHY.md)
   - Zero test debt: No skipped, disabled, or failing tests
   - All QA requirements satisfied
   - Build succeeds without errors or warnings (governance-enforced)

2. **Code Quality Standards**
   - Linting passes (zero errors, zero governance-flagged warnings)
   - Code coverage meets requirements
   - Security scans pass (no new vulnerabilities)
   - Architecture compliance validated

3. **Test Evidence**
   - Local test execution: 100% GREEN before CI
   - CI confirmatory execution: 100% GREEN
   - Evidence artifacts generated (test reports, coverage reports)
   - QA validation documented

4. **Governance Compliance**
   - Self-governance check performed
   - Scope aligned with assignment (PR_SCOPE_CONTROL_POLICY.md)
   - No unrelated changes (SCOPE_TO_DIFF_RULE.md)
   - Governance gates respected (BUILDER_FIRST_PR_MERGE_MODEL.md)

5. **FM Supervision**
   - FM approval obtained (if FM orchestrated)
   - FM QA satisfied
   - Build-to-green evidence complete
   - Wave integration validated (if applicable)

#### Self-Alignment Authority

✅ **MAY self-align**:
- Fix test failures within scope
- Code quality improvements (refactoring)
- Bug fixes within work scope
- Test coverage improvements
- Documentation for code changes
- Minor dependency updates (security patches)

❌ **MUST escalate to CS2**:
- Architecture changes
- Protected file modifications
- New dependencies (major)
- Framework changes
- Governance rule modifications
- Build system changes
- CI/CD workflow changes

❌ **MUST escalate to Foreman (FM)**:
- QA interpretation questions
- Scope expansion requests
- Unrecoverable test failures (3+ attempts)
- External dependency issues
- Infrastructure or environment issues

#### Gate Validation Method

**Primary**: Automated test execution (100% GREEN required)
**Secondary**: Code quality checks (linting, coverage, security)
**Tertiary**: Architecture compliance validation
**Quaternary**: FM approval (if orchestrated)

---

## 7. Foreman (FM) Agent Gate Protocol

### 7.1 Foreman Identity

**Role**: Build orchestration, wave planning, QA creation, builder supervision, execution governance

**Examples**:
- Foreman (FM) agents
- Wave planning agents
- QA creation agents
- Builder orchestration agents

**Authority**: Wave planning, QA creation, builder supervision, build orchestration, execution governance (per FM_ROLE_CANON.md)

### 7.2 Foreman Merge Gate Requirements

#### Pre-Merge Validation Checklist

✅ **MANDATORY** - Must validate before merge:

1. **Wave Execution Compliance**
   - Wave plan complete and validated (WAVE_MODEL.md)
   - All wave steps completed or documented
   - Builder evidence collected and verified
   - Wave closure certification complete (MANDATORY_CANONICAL_PROGRESS_RECORDING_AND_WAVE_CLOSURE_CERTIFICATION.md)

2. **QA Creation & Validation**
   - QA comprehensive and complete
   - All QA tests passing (100% GREEN)
   - QA evidence artifacts generated
   - Red-to-green progression documented

3. **Builder Supervision**
   - All builder assignments completed
   - Builder evidence validated
   - Builder compliance verified (100% GREEN mandate)
   - No test debt allowed to merge

4. **Governance Evidence**
   - Self-governance check performed
   - FM memory captured (FOREMAN_MEMORY_PROTOCOL.md)
   - Wave planning artifacts generated (FOREMAN_WAVE_PLANNING_AND_ISSUE_ARTIFACT_GENERATION_PROTOCOL.md)
   - Learning loop completed (LEARNING_LOOP_CATEGORIES_AND_LIFECYCLE.md)

5. **Integration Validation**
   - Combined wave testing (if multi-wave) per COMBINED_TESTING_PATTERN.md
   - Cross-wave integration verified
   - No breaking changes to existing waves
   - In-between wave reconciliation complete (IN_BETWEEN_WAVE_RECONCILIATION.md)

#### Self-Alignment Authority

✅ **MAY self-align**:
- Wave planning refinements
- QA test additions or improvements
- Builder assignment optimizations
- Execution process improvements
- Evidence collection enhancements
- Memory protocol improvements
- Wave closure artifacts

✅ **MAY create autonomously**:
- Wave plans
- QA test suites
- Builder assignments (GitHub issues)
- Execution reports
- Learning loop artifacts

❌ **MUST escalate to CS2**:
- Protected file modifications (architecture approval workflow)
- Constitutional changes
- FM_ROLE_CANON.md interpretation questions
- Authority boundary conflicts
- Governance rule ambiguities

#### Gate Validation Method

**Primary**: Wave execution completeness (all steps complete, 100% GREEN)
**Secondary**: QA comprehensive validation (all requirements covered)
**Tertiary**: Builder evidence verification (compliance validated)
**Quaternary**: Learning loop completion (IBWR, lessons captured)

---

## 8. Cross-Cutting Gate Requirements

### 8.1 Universal Requirements (All Agent Classes)

**Regardless of agent class, ALL agents MUST**:

1. **Living Agent System Compliance**
   - Wake-up protocol executed (LIVING_AGENT_SYSTEM.md)
   - Working contract generated
   - Session memory captured
   - Session closure performed

2. **Self-Governance Check**
   - AGENT_SELF_GOVERNANCE_PROTOCOL.md workflow completed
   - Canonical governance sources identified
   - Gap analysis performed
   - Alignment or escalation decision documented

3. **Evidence Generation**
   - Clear commit messages
   - PR description with context and rationale
   - Validation evidence provided
   - Traceability to requirements or issues

4. **Governance Ripple**
   - If canon changed: Ripple executed per GOVERNANCE_RIPPLE_MODEL.md
   - Ripple status tracked
   - Downstream notifications sent if required

### 8.2 CS2 Escalation Triggers (All Agent Classes)

**Immediate CS2 escalation required for**:

1. **Constitutional Changes**
   - CS1-CS6 modifications
   - New constitutional rules
   - Protected governance changes

2. **Authority Boundary Conflicts**
   - Ambiguity in agent authority
   - Conflicts between governance documents
   - Unclear escalation requirements

3. **Protected File Modifications**
   - `.github/workflows/` changes
   - `BUILD_PHILOSOPHY.md` changes
   - `FM_ROLE_CANON.md` changes
   - `WAVE_MODEL.md` changes
   - Agent contract changes (AGENT_CONTRACT_PROTECTION_PROTOCOL.md)

4. **Governance Interpretation**
   - Constitutional ambiguity
   - Conflicting governance rules
   - New governance scenarios not covered by canon

---

## 9. Gate Validation Procedures

### 9.1 Automated Gate Validation

**CI/CD Integration**: Gate checks SHOULD be automated where possible:

- Syntax validation (JSON, YAML, Markdown)
- Test execution (100% GREEN for builders)
- Linting and code quality
- Security scanning
- Cross-reference validation
- Inventory synchronization check
- Ripple status verification

### 9.2 Manual Gate Validation

**Human Review Required For**:

- CS2-escalated changes (constitutional, protected files)
- Complex governance changes requiring interpretation
- Cross-repository impact analysis
- New canonical governance introduction
- Agent class taxonomy changes

### 9.3 Agent Class Identification

**PR Metadata**: Agent class MUST be identifiable via:

1. PR label (e.g., `agent:builder`, `agent:liaison`, `agent:overseer`, `agent:foreman`)
2. PR description (agent identification section)
3. Commit author metadata
4. Agent contract reference in PR

**Automated Detection**: CI SHOULD detect agent class automatically from:
- Workflow trigger context
- File path patterns
- PR label or metadata
- Agent contract reference

---

## 10. Gate Failure Handling

### 10.1 Automated Gate Failures

**When automated gate fails**:

1. **Builder**: Fix test failures, code quality issues, security vulnerabilities
2. **Liaison**: Fix governance artifact errors, inventory drift, cross-references
3. **Foreman**: Fix wave execution gaps, QA failures, evidence issues
4. **Overseer**: Fix constitutional compliance issues, cross-repo conflicts

**Escalation**: If unable to fix after 3 attempts, escalate per agent class:
- **Builder** → Foreman (FM) or CS2
- **Liaison** → Overseer or CS2
- **Foreman** → CS2
- **Overseer** → CS2

### 10.2 Manual Gate Failures (CS2 Review)

**When CS2 review identifies issues**:

1. **CS2 feedback provided** in PR comments
2. **Agent revises** per CS2 guidance
3. **Re-review requested** after changes
4. **Approval granted** when compliant

**No Self-Approval**: No agent may approve their own PR. Independent review required.

---

## 11. Implementation Guidance

### 11.1 For CI/CD Implementation

**Recommended CI Workflow**:

```yaml
name: Agent Class Specific Gate

on: [pull_request]

jobs:
  identify-agent-class:
    runs-on: ubuntu-latest
    outputs:
      agent_class: ${{ steps.detect.outputs.class }}
    steps:
      - name: Detect Agent Class
        id: detect
        run: |
          # Detect from PR label, metadata, or file patterns
          # Output: builder, liaison, foreman, or overseer
          
  builder-gates:
    if: needs.identify-agent-class.outputs.agent_class == 'builder'
    needs: identify-agent-class
    runs-on: ubuntu-latest
    steps:
      - name: Validate 100% GREEN
      - name: Code Quality Check
      - name: Security Scan
      
  liaison-gates:
    if: needs.identify-agent-class.outputs.agent_class == 'liaison'
    needs: identify-agent-class
    runs-on: ubuntu-latest
    steps:
      - name: Validate Governance Artifacts
      - name: Check Inventory Sync
      - name: Verify Ripple Execution
      
  foreman-gates:
    if: needs.identify-agent-class.outputs.agent_class == 'foreman'
    needs: identify-agent-class
    runs-on: ubuntu-latest
    steps:
      - name: Validate Wave Completion
      - name: Verify QA 100% GREEN
      - name: Check Builder Evidence
      
  overseer-gates:
    if: needs.identify-agent-class.outputs.agent_class == 'overseer'
    needs: identify-agent-class
    runs-on: ubuntu-latest
    steps:
      - name: Constitutional Compliance Check
      - name: Cross-Repo Impact Analysis
      - name: Quality Gate Validation
```

### 11.2 For Agent Implementation

**Agent Workflow**:

1. **Session Start**: Execute wake-up protocol (LIVING_AGENT_SYSTEM.md)
2. **Self-Governance Check**: Validate governance alignment (AGENT_SELF_GOVERNANCE_PROTOCOL.md)
3. **Work Execution**: Follow working contract, stay in authority bounds
4. **Pre-Merge Validation**: Execute agent-class-specific gate checklist (this document)
5. **Escalation Handling**: Escalate to CS2 if outside authority or conflicting guidance
6. **Session Closure**: Execute closure protocol, capture memory

---

## 12. Validation & Maintenance

### 12.1 Protocol Validation

This protocol MUST be validated:
- **Before use**: New agents read and confirm understanding
- **After updates**: All agents re-validate after protocol changes
- **Quarterly**: CS2 reviews for gaps, ambiguities, improvements

### 12.2 Protocol Evolution

**Changes to this protocol**:
- **MUST** be approved by CS2 (Johan Ras)
- **MUST** trigger governance ripple
- **MUST** update GOVERNANCE_ARTIFACT_INVENTORY.md
- **MUST** notify all agent classes

---

## 13. Cross-References

### 13.1 Primary Dependencies

- **LIVING_AGENT_SYSTEM.md** - Agent lifecycle, wake-up, closure
- **AGENT_SELF_GOVERNANCE_PROTOCOL.md** - Self-governance check workflow
- **AGENT_ROLE_GATE_APPLICABILITY.md** - Agent role definitions
- **BUILD_PHILOSOPHY.md** - One-Time Build Law, 100% GREEN mandate
- **FM_ROLE_CANON.md** - Foreman authority and responsibilities
- **WAVE_MODEL.md** - Wave hierarchy and lifecycle

### 13.2 Supporting Protocols

- **GOVERNANCE_RIPPLE_MODEL.md** - Ripple execution requirements
- **AGENT_CONTRACT_PROTECTION_PROTOCOL.md** - Agent contract modification rules
- **CS2_AGENT_FILE_AUTHORITY_MODEL.md** - Authority hierarchy
- **BUILDER_FIRST_PR_MERGE_MODEL.md** - Builder merge requirements
- **GOVERNANCE_GATE_CANON.md** - Gate evaluation semantics

---

## 14. Version History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0.0 | 2026-02-08 | CS2 (Johan Ras) | Initial canonical protocol addressing GAP-001 |

---

**Authority**: CS2 (Johan Ras)  
**Effective Date**: 2026-02-08  
**Next Review**: 2026-05-08 (Quarterly)
