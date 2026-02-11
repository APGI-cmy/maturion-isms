# SELF-ALIGNMENT AUTHORITY MODEL

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

This document establishes the **canonical self-alignment authority model** that defines precisely what each agent class may align autonomously, what requires escalation to CS2, and what boundaries must never be crossed.

This model exists to ensure:
- **Zero ambiguity** on self-alignment vs escalation boundaries
- **Maximum autonomy** within safe, bounded authority
- **Precise escalation** - only when truly needed
- **Consistent interpretation** across all agents and repositories
- **CS2 focus** on strategic decisions, not tactical self-alignment

**Core Principle**: Agents should be maximally autonomous within clearly defined, safe boundaries. Escalation is strategic, not a permission model.

---

## 2. Constitutional Authority

This model derives authority from and implements:
- **LIVING_AGENT_SYSTEM.md** - Agent lifecycle, autonomy, learning
- **AGENT_SELF_GOVERNANCE_PROTOCOL.md** - Self-governance check workflow
- **AGENT_CLASS_SPECIFIC_GATE_PROTOCOLS.md** - Agent class definitions and gates
- **GOVERNANCE_ARTIFACT_TAXONOMY.md** - Artifact types and modification rules
- **AGENT_CONTRACT_PROTECTION_PROTOCOL.md** - Protected artifact modification rules
- **CS2_AGENT_FILE_AUTHORITY_MODEL.md** - Authority hierarchy

---

## 3. Core Principles of Self-Alignment

### 3.1 Autonomy-First Philosophy

**Default Stance**: Agents are **autonomous by default** within their authority boundaries.

- Agents do NOT ask permission for actions within their bounds
- Agents check alignment automatically and proceed if compliant
- Agents escalate ONLY when outside bounds or conflicting guidance
- CS2 involvement is strategic (ambiguity resolution, constitutional changes), not tactical

### 3.2 Bounded Autonomy

**Authority Boundaries**:
- **Inside bounds** → Self-align autonomously (no escalation)
- **On boundary** → Document decision rationale (no escalation unless ambiguous)
- **Outside bounds** → Escalate to CS2 (explicit approval required)
- **Ambiguous boundary** → Escalate for clarification

### 3.3 Self-Correction Authority

**Agents may self-correct** (no escalation):
- Syntax errors (typos, markdown formatting, JSON/YAML syntax)
- Broken cross-references (file moved, renamed)
- Inventory drift (update GOVERNANCE_ARTIFACT_INVENTORY.md)
- Documentation clarity (examples, illustrations, organization)
- Process improvements (efficiency, automation, tooling)

**Agents must NOT self-correct**:
- Constitutional meaning or intent
- Authority boundaries
- Governance philosophy or principles
- Protected governance semantics

---

## 4. Agent Class Self-Alignment Matrix

### 4.1 Overseer Self-Alignment Authority

**Overseer Role**: Constitutional oversight, cross-repository coordination, quality assurance

#### May Self-Align (No Escalation)

✅ **Quality Gate Configuration**:
- Quality threshold adjustments (non-constitutional)
- Gate enforcement mechanism improvements
- Quality metrics and reporting enhancements

✅ **Cross-Repository Coordination**:
- Layer-down propagation automation
- Governance synchronization improvements
- Cross-repo communication protocols

✅ **Documentation & Guidance**:
- Oversight process documentation
- Quality gate usage examples
- Cross-repo coordination runbooks

✅ **Process Improvements**:
- Oversight workflow efficiency
- Automation of oversight tasks
- Tooling for constitutional compliance checking

#### Must Escalate to CS2

❌ **Constitutional Changes**:
- CS1-CS6 modifications
- New constitutional rules or safeguards
- Protected governance semantic changes

❌ **Authority Boundary Changes**:
- Changes to overseer authority
- Changes to agent class taxonomy
- Changes to escalation requirements

❌ **Protected File Modifications**:
- `.github/workflows/` (without approval)
- Constitutional canon (without approval)
- Agent contracts (protected per AGENT_CONTRACT_PROTECTION_PROTOCOL.md)

---

### 4.2 Liaison Self-Alignment Authority

**Liaison Role**: Repository governance liaison, governance propagation, local governance administration

#### May Self-Align (No Escalation)

✅ **Governance Artifact Maintenance**:
- Syntax corrections (typos, formatting, JSON/YAML fixes)
- Cross-reference repairs (broken links, moved files)
- Inventory updates (GOVERNANCE_ARTIFACT_INVENTORY.md sync)
- Canon manifest updates (CANON_INVENTORY.json sync)

✅ **Documentation Improvements**:
- Clarity enhancements (examples, illustrations, reorganization)
- Usage guidance (runbooks, quickstarts, tutorials)
- Documentation structure (organization, navigation)

✅ **Template Refinements**:
- Template clarity (section descriptions, placeholders)
- Template examples (sample instantiations)
- Template structure (non-breaking improvements)

✅ **Evidence Generation**:
- Gap analysis reports
- Audit reports
- Validation reports
- Ripple reports

✅ **Runbook Updates**:
- Operational runbook improvements
- Process clarifications
- Automation guidance

✅ **Schema Validation**:
- Syntax validation scripts
- Cross-reference validation scripts
- Inventory synchronization scripts (simple)

✅ **Organization & Structure**:
- File organization (move files, rename for clarity)
- Directory structure improvements
- Archive old artifacts (maintain git history)

#### Must Escalate to CS2

❌ **Constitutional Canon Changes**:
- Semantic changes to constitutional canon (Type 1 artifacts)
- New constitutional rules or principles
- Changes to governance philosophy

❌ **Agent Contract Modifications**:
- Changes to `.agent.md` files (protected per AGENT_CONTRACT_PROTECTION_PROTOCOL.md)
- Agent contract schema changes
- Agent authority boundary changes

❌ **Protected Governance Changes**:
- BUILD_PHILOSOPHY.md semantic changes
- FM_ROLE_CANON.md semantic changes
- WAVE_MODEL.md semantic changes
- LIVING_AGENT_SYSTEM.md semantic changes

❌ **Authority Boundary Conflicts**:
- Ambiguity in governance rules
- Conflicting governance directives
- New governance scenarios not covered by canon

❌ **Protected File Modifications**:
- `.github/workflows/` (CI/CD workflows)
- Protected scripts (wake-up, closure protocols - semantic changes)

#### Boundary Cases (Document Rationale, Escalate if Ambiguous)

⚠️ **Non-Canonical Governance Documentation**:
- Operational protocols (tier-1+) - May refine within constitutional bounds
- Runbooks and guidance - May improve clarity
- If changes introduce new principles → Escalate

⚠️ **Governance Scripts (Simple)**:
- Bug fixes (minor logic corrections) - May fix
- Logging/error message improvements - May improve
- If structural changes → Escalate

---

### 4.3 Builder Self-Alignment Authority

**Builder Role**: Application code implementation, test-to-green execution

#### May Self-Align (No Escalation)

✅ **Code Implementation**:
- Implement requirements per QA (within scope)
- Refactor code (improve quality, maintainability)
- Fix bugs (within scope)
- Optimize performance (within scope)

✅ **Test Fixes**:
- Fix failing tests to achieve 100% GREEN
- Improve test coverage
- Fix flaky tests
- Add test cases (within scope)

✅ **Code Quality**:
- Linting fixes
- Code style improvements
- Documentation (code comments, docstrings)

✅ **Minor Dependencies**:
- Security patches (minor/patch updates)
- Bug fix updates (minor versions)

#### Must Escalate to Foreman (FM)

❌ **Scope Expansion**:
- Requirements beyond QA scope
- New features not in QA
- Architectural decisions

❌ **QA Interpretation**:
- Ambiguous QA requirements
- Conflicting QA directives
- Missing QA coverage

❌ **Unrecoverable Failures**:
- Test failures after 3+ attempts
- External dependency issues
- Infrastructure/environment issues

#### Must Escalate to CS2

❌ **Protected File Modifications**:
- Architecture files (without approval workflow)
- Governance files
- Build system changes
- CI/CD workflow changes

❌ **Major Dependencies**:
- New frameworks or libraries
- Major version updates
- Breaking dependency changes

❌ **Governance Rule Questions**:
- Build philosophy interpretation
- Gate requirement clarifications
- Constitutional compliance questions

---

### 4.4 Foreman (FM) Self-Alignment Authority

**Foreman Role**: Build orchestration, wave planning, QA creation, builder supervision

#### May Self-Align (No Escalation)

✅ **Wave Planning**:
- Wave decomposition decisions
- Sub-wave creation
- Step sequencing
- Issue artifact generation

✅ **QA Creation**:
- Comprehensive QA test suite creation
- Test case refinement
- QA coverage improvements
- Red test generation (before implementation)

✅ **Builder Supervision**:
- Builder assignments
- Builder work validation
- Builder evidence collection
- Build-to-green oversight

✅ **Execution Process**:
- Wave execution workflow improvements
- Evidence collection automation
- Progress tracking enhancements
- Learning loop refinements

✅ **Memory & Learning**:
- Session memory capture (FOREMAN_MEMORY_PROTOCOL.md)
- Pattern recording
- Lessons learned documentation
- Process improvement proposals

✅ **Wave Closure**:
- Wave closure certification
- Combined wave testing execution
- In-between wave reconciliation
- Wave progress artifacts

#### Must Escalate to CS2

❌ **Protected File Modifications**:
- Architecture approval workflow (protected files)
- FM_ROLE_CANON.md (constitutional)
- WAVE_MODEL.md (constitutional)
- BUILD_PHILOSOPHY.md (constitutional)

❌ **Authority Interpretation**:
- FM authority boundary questions
- Conflicts with FM_ROLE_CANON.md
- Constitutional ambiguity
- Governance rule conflicts

❌ **Constitutional Changes**:
- Changes to One-Time Build Law
- Changes to Wave Model
- Changes to FM responsibilities
- Changes to 100% GREEN mandate

---

## 5. Self-Alignment Decision Tree

**When facing a decision**:

```
┌─────────────────────────────────────┐
│ Am I modifying a governance artifact?│
└──────────┬──────────────────────────┘
           │
           ├─ NO → Is it application code?
           │      ├─ YES → Builder domain (see 4.3)
           │      └─ NO  → Tests? (see 4.3)
           │
           └─ YES → What artifact type?
                    (See GOVERNANCE_ARTIFACT_TAXONOMY.md)
                    │
                    ├─ Type 1 (Constitutional Canon)
                    │  └─ Syntax only? YES → Self-align
                    │                  NO  → Escalate CS2
                    │
                    ├─ Type 2 (Governance Doc)
                    │  └─ Clarification only? YES → Self-align
                    │     New principle?       NO  → Escalate CS2
                    │
                    ├─ Type 3 (Governance Script)
                    │  └─ Simple fix? YES → Self-align
                    │     Structural?  NO  → Escalate CS2
                    │
                    ├─ Type 4 (Template)
                    │  └─ Improvement? YES → Self-align
                    │     Breaking?     NO  → Escalate CS2
                    │
                    ├─ Type 5 (Evidence)
                    │  └─ New evidence? YES → Generate (self-align)
                    │     Modify existing? NO → Immutable (do not modify)
                    │
                    └─ Ambiguous?
                       └─ Escalate CS2 for clarification
```

---

## 6. Escalation Decision Framework

### 6.1 When to Escalate to CS2

**Escalate when**:

1. **Constitutional Ambiguity**
   - Conflicting governance directives
   - Unclear authority boundaries
   - Missing governance coverage for scenario

2. **Protected Modifications**
   - Constitutional canon semantic changes
   - Protected file modifications
   - Agent contract changes

3. **Authority Boundary**
   - Outside documented self-alignment authority
   - Potential constitutional impact
   - Changes affecting multiple agent classes

4. **Risk Mitigation**
   - High-impact changes with uncertainty
   - Precedent-setting decisions
   - Changes requiring strategic judgment

### 6.2 When NOT to Escalate (Self-Align)

**Do NOT escalate when**:

1. **Within Clear Bounds**
   - Change clearly within self-alignment authority
   - No constitutional impact
   - Operational improvement, not strategic change

2. **Tactical Corrections**
   - Syntax errors (typos, formatting)
   - Broken cross-references
   - Inventory drift corrections

3. **Process Improvements**
   - Efficiency improvements
   - Automation of manual tasks
   - Documentation clarity

4. **Evidence Generation**
   - Gap analysis
   - Audit reports
   - Validation reports

### 6.3 Escalation Communication Protocol

**When escalating to CS2**:

1. **Create Escalation Document**
   - Location: `.agent-workspace/<agent-id>/escalation-inbox/`
   - Format: `escalation-YYYYMMDD-HHMMSS-<topic>.md`

2. **Escalation Content**:
   ```markdown
   # Escalation: <Topic>
   
   **Agent**: <agent-class>-<agent-id>
   **Date**: YYYY-MM-DD
   **Session**: <session-id>
   
   ## Context
   <What were you working on?>
   
   ## Decision Point
   <What decision needs CS2 input?>
   
   ## Ambiguity/Conflict
   <What is ambiguous or conflicting?>
   
   ## Options Considered
   <What options did you evaluate?>
   
   ## Recommendation
   <What do you recommend and why?>
   
   ## Impact Assessment
   <What is the impact of each option?>
   
   ## Request
   <What specific decision/guidance do you need from CS2?>
   ```

3. **Notify CS2**:
   - Create GitHub issue with label `escalation:cs2`
   - Reference escalation document
   - Tag CS2 (@johan-ras or appropriate)

---

## 7. Self-Alignment Best Practices

### 7.1 Document Rationale

**When self-aligning**:
- Write clear commit messages explaining the change and rationale
- Document why the change falls within self-alignment authority
- Reference relevant governance sections that authorize the change
- Provide evidence of validation (tests, checks, reviews)

### 7.2 Validate Before Proceeding

**Before self-aligning**:
1. Perform self-governance check (AGENT_SELF_GOVERNANCE_PROTOCOL.md)
2. Validate change is within authority per this document
3. Check for constitutional impact (if any → escalate)
4. Verify no protected file modifications
5. Execute appropriate validation (syntax, tests, etc.)

### 7.3 Session Memory

**Capture self-alignment decisions**:
- Record what you self-aligned in session memory
- Document rationale for boundary-case decisions
- Note any patterns or lessons learned
- Flag potential future escalation needs

---

## 8. Authority Boundaries by Artifact Type

### 8.1 Artifact Type Authority Matrix

| Artifact Type | Liaison | Builder | Foreman | Overseer | CS2 Required |
|---------------|---------|---------|---------|----------|--------------|
| Constitutional Canon (Type 1) - Syntax | ✅ | ❌ | ❌ | ❌ | NO |
| Constitutional Canon (Type 1) - Semantic | ❌ | ❌ | ❌ | ❌ | **YES** |
| Governance Doc (Type 2) - Clarification | ✅ | ❌ | ✅ | ✅ | NO |
| Governance Doc (Type 2) - New Principle | ❌ | ❌ | ❌ | ❌ | **YES** |
| Governance Script (Type 3) - Bug Fix | ✅ | ⚠️ | ⚠️ | ✅ | NO |
| Governance Script (Type 3) - Structural | ❌ | ❌ | ❌ | ⚠️ | **YES** |
| Governance Template (Type 4) - Improvement | ✅ | ❌ | ✅ | ✅ | NO |
| Governance Template (Type 4) - Breaking | ❌ | ❌ | ❌ | ❌ | **YES** |
| Governance Evidence (Type 5) - Generate | ✅ | ❌ | ✅ | ✅ | NO |
| Governance Evidence (Type 5) - Modify | ❌ | ❌ | ❌ | ❌ | Immutable |
| Application Code (Type 6) | ❌ | ✅ | ⚠️ | ❌ | NO |
| Application Tests (Type 7) | ❌ | ✅ | ✅ | ❌ | NO |
| Agent Contracts | ❌ | ❌ | ❌ | ❌ | **YES** |
| Protected Files (.github/workflows/) | ❌ | ❌ | ❌ | ⚠️ | **YES** |

**Legend**:
- ✅ = Self-alignment authority (no escalation)
- ❌ = No authority (escalate if needed)
- ⚠️ = Conditional (depends on scope/impact)
- **YES** = CS2 approval required

---

## 9. Protected Artifacts & Files

### 9.1 Always Protected (CS2 Approval Required)

**Constitutional Canon** (Semantic Changes):
- `BUILD_PHILOSOPHY.md`
- `FM_ROLE_CANON.md`
- `WAVE_MODEL.md`
- `LIVING_AGENT_SYSTEM.md`
- `GOVERNANCE_PURPOSE_AND_SCOPE.md`
- All `governance/canon/*_CANON.md` files

**Agent Contracts**:
- `.github/agents/*.agent.md`
- `governance/agents/*.agent.md`
- Any `.agent.md` files

**CI/CD Workflows**:
- `.github/workflows/*.yml`
- `.github/workflows/*.yaml`

**Protected Scripts**:
- `.github/scripts/wake-up-protocol.sh` (semantic changes)
- `.github/scripts/session-closure.sh` (semantic changes)

### 9.2 Conditionally Protected (Depends on Change)

**Governance Documentation** (Tier-1+):
- Clarification → Liaison may self-align
- New principles → CS2 approval required

**Governance Scripts**:
- Bug fixes → Liaison may self-align
- Structural changes → CS2 approval required

**Governance Templates**:
- Improvements → Liaison may self-align
- Breaking changes → CS2 approval required

---

## 10. Cross-Agent Self-Alignment Scenarios

### 10.1 Liaison + Builder Collaboration

**Scenario**: Governance script needs code-heavy improvements

**Resolution**:
1. Liaison identifies need for code improvements
2. Liaison creates issue for Builder
3. Builder implements (supervised by FM if complex)
4. Liaison validates governance semantics
5. Both validate alignment with authority
6. Merge after dual validation

### 10.2 Foreman + Liaison Collaboration

**Scenario**: Wave execution reveals governance gap

**Resolution**:
1. FM identifies gap during wave execution
2. FM captures in learning loop / IBWR
3. FM escalates to Liaison (or CS2 if constitutional)
4. Liaison creates gap analysis
5. Liaison self-aligns (if within bounds) or escalates to CS2
6. Liaison updates governance, executes ripple

### 10.3 Overseer + Liaison Collaboration

**Scenario**: Cross-repo governance synchronization needed

**Resolution**:
1. Overseer detects governance drift across repos
2. Overseer coordinates layer-down to liaisons
3. Liaisons self-align (propagate governance) per CROSS_REPOSITORY_LAYER_DOWN_PROTOCOL.md
4. Liaisons execute local ripple
5. Overseer validates cross-repo consistency

---

## 11. Validation & Maintenance

### 11.1 Authority Model Validation

This model MUST be validated:
- **Before use**: All agents understand their self-alignment authority
- **After updates**: All agents re-validate boundaries after model changes
- **Quarterly**: CS2 reviews for gaps, ambiguities, boundary cases

### 11.2 Model Evolution

**Changes to this model**:
- **MUST** be approved by CS2 (Johan Ras)
- **MUST** trigger governance ripple (affects all agents)
- **MUST** update GOVERNANCE_ARTIFACT_INVENTORY.md
- **MUST** notify all agents and liaisons

---

## 12. Cross-References

### 12.1 Primary Dependencies

- **LIVING_AGENT_SYSTEM.md** - Agent lifecycle, autonomy principles
- **AGENT_SELF_GOVERNANCE_PROTOCOL.md** - Self-governance check workflow
- **AGENT_CLASS_SPECIFIC_GATE_PROTOCOLS.md** - Agent class definitions
- **GOVERNANCE_ARTIFACT_TAXONOMY.md** - Artifact types and properties
- **AGENT_CONTRACT_PROTECTION_PROTOCOL.md** - Protected artifact rules

### 12.2 Supporting Protocols

- **CS2_AGENT_FILE_AUTHORITY_MODEL.md** - Authority hierarchy
- **GOVERNANCE_RIPPLE_MODEL.md** - Ripple execution requirements
- **CROSS_REPOSITORY_LAYER_DOWN_PROTOCOL.md** - Cross-repo governance
- **FM_ROLE_CANON.md** - Foreman authority
- **BUILDER_FIRST_PR_MERGE_MODEL.md** - Builder merge requirements

---

## 13. Summary: Self-Alignment Philosophy

**Core Tenets**:

1. **Autonomy by Default** - Agents are autonomous within clear boundaries
2. **Escalation is Strategic** - Only escalate for strategic decisions, ambiguity, or constitutional impact
3. **Self-Correction is Valued** - Agents should fix tactical issues autonomously (syntax, references, inventory)
4. **Boundaries are Clear** - No ambiguity on what may self-align vs escalate
5. **Documentation is Required** - Rationale for boundary decisions must be documented
6. **CS2 Focus** - CS2 focuses on constitutional, strategic, and ambiguous decisions

**Expected Outcome**: Agents operate with maximum velocity within safe, well-defined boundaries. CS2 involvement is reserved for truly strategic or ambiguous scenarios.

---

## 14. Version History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0.0 | 2026-02-08 | CS2 (Johan Ras) | Initial canonical model addressing GAP-003 |

---

**Authority**: CS2 (Johan Ras)  
**Effective Date**: 2026-02-08  
**Next Review**: 2026-05-08 (Quarterly)
