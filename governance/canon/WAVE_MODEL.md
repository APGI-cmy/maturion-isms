# WAVE MODEL

## Status
**Type**: Tier-0 Constitutional Canon  
**Authority**: Supreme - Constitutional  
**Version**: 1.0.0  
**Effective Date**: 2026-02-08  
**Owner**: Maturion Engineering Leadership (Johan Ras)  
**Layer-Down Status**: PUBLIC_API  
**Applies To**: All Foreman Instances, All Wave Executions, All Application Repositories  

---

## 1. Purpose

This document establishes the **Wave Model** as the canonical execution unit structure for Maturion application development. Waves provide hierarchical decomposition of application development into manageable, testable, and governable units.

The Wave Model exists to ensure:
- **Structured decomposition** of complex applications into manageable units
- **Progressive delivery** with validated milestones at each wave completion
- **Testable integration** through Combined Wave Testing (CWT)
- **Traceable progress** through canonical progress artifacts
- **Governance-compliant execution** at every level
- **Learning propagation** through In-Between Wave Reconciliation (IBWR)

---

## 2. Constitutional Authority

This model derives supreme authority from and integrates with:

- **BUILD_PHILOSOPHY.md** - One-Time Build Law, zero test debt, 100% GREEN philosophy
- **BUILD_TREE_EXECUTION_MODEL.md** - Hierarchical execution structure
- **MANDATORY_CANONICAL_PROGRESS_RECORDING_AND_WAVE_CLOSURE_CERTIFICATION.md** - Progress recording and wave closure
- **IN_BETWEEN_WAVE_RECONCILIATION.md** - Post-wave learning and governance improvement
- **FM_ROLE_CANON.md** - FM authority for wave planning, execution, and certification
- **COMBINED_TESTING_PATTERN.md** - Cross-wave integration testing

---

## 3. Wave Hierarchy

### 3.1 Structure Definition

The Wave Model defines a **4-level hierarchical structure**:

```
APPLICATION
  ↓
WAVE (Primary Execution Unit)
  ↓
SUB-WAVE (Optional Decomposition)
  ↓
STEP (Atomic Work Unit)
  ↓
TASK (GitHub Issue Artifact)
```

### 3.2 Level Definitions

#### Application Level
- **Definition**: The entire application being developed
- **Scope**: All features, all modules, all integrations
- **Owner**: CS2 (Johan Ras in bootstrap, FM in production)
- **State**: PLANNED → IN_PROGRESS → COMPLETE → PRODUCTION

#### Wave Level (Primary)
- **Definition**: A coherent, testable, deliverable increment of functionality
- **Scope**: One or more related features that form a logical delivery unit
- **Owner**: FM (Foreman) - non-delegable authority
- **Duration**: Typically 1-4 weeks (bootstrap phase), shorter in production
- **Deliverable**: Working, tested, integrated features with zero test debt
- **State**: PLANNED → IN_PROGRESS → VALIDATING → COMPLETE → CLOSED

#### Sub-Wave Level (Optional)
- **Definition**: Decomposition of a large wave into smaller execution units
- **Scope**: Subset of wave features that can be independently built/tested
- **Owner**: FM
- **When Used**: When wave complexity exceeds cognitive capacity OR when parallel execution beneficial
- **Deliverable**: Partial wave functionality, must integrate with other sub-waves
- **State**: PLANNED → IN_PROGRESS → COMPLETE

#### Step Level
- **Definition**: Atomic work unit within a wave or sub-wave
- **Scope**: Single architectural component, single feature, single module
- **Owner**: Builder (under FM supervision)
- **Duration**: Hours to days
- **Deliverable**: One component with passing tests
- **State**: PENDING → IN_PROGRESS → COMPLETE

#### Task Level (GitHub Issue Artifact)
- **Definition**: Executable work item tracked as GitHub issue
- **Scope**: Specific implementation task assigned to builder
- **Owner**: Builder (executing), FM (tracking)
- **Purpose**: Trackable, linkable, auditable work unit
- **State**: OPEN → IN_PROGRESS → REVIEW → CLOSED

---

## 4. Wave Lifecycle

### 4.1 Wave States

```
PLANNED → IN_PROGRESS → VALIDATING → COMPLETE → CLOSED
```

#### PLANNED
- **Definition**: Wave scope defined, architecture documented, acceptance criteria established
- **Entry Criteria**:
  - Wave scope defined in canonical planning document
  - Architecture complete and validated (per ARCHITECTURE_COMPLETENESS_REQUIREMENTS.md)
  - QA Catalog aligned (per QA_CATALOG_ALIGNMENT_GATE_CANON.md)
  - BL/FL-CI forward-scan complete (per FM_PREAUTH_CHECKLIST_CANON.md)
  - GitHub issues generated for all tasks
- **Exit Criteria**: FM authorizes wave execution
- **Owner**: FM
- **Artifacts**: Wave planning document, architecture docs, QA Catalog, issue artifacts

#### IN_PROGRESS
- **Definition**: Active development, builders executing "Build to Green" instructions
- **Entry Criteria**: FM authorization received
- **During**:
  - Builders implement components to green QA
  - FM monitors progress via canonical progress artifact
  - FM validates completions against QA
  - Learning intake continuous
- **Exit Criteria**: All wave components built, all QA GREEN
- **Owner**: FM (orchestrating), Builders (executing)
- **Artifacts**: Canonical progress artifact (updated continuously), build evidence, QA results

#### VALIDATING
- **Definition**: FM validates wave completion against all requirements
- **Entry Criteria**: Builders report all components GREEN
- **During**:
  - FM re-runs full wave QA suite
  - FM validates architecture completeness
  - FM validates zero test debt
  - FM validates all evidence
  - FM prepares for wave closure certification
- **Exit Criteria**: 100% GREEN validation OR failure escalation
- **Owner**: FM
- **Artifacts**: Validation report, QA results, evidence trail

#### COMPLETE
- **Definition**: Wave validated and certified complete by FM
- **Entry Criteria**: FM wave closure certification issued (per MANDATORY_CANONICAL_PROGRESS_RECORDING_AND_WAVE_CLOSURE_CERTIFICATION.md)
- **During**:
  - Wave PR created and submitted
  - PR gates execute
  - Human review (if required)
- **Exit Criteria**: Wave PR merged to main
- **Owner**: FM (certification), CS2 (merge approval if protected files modified)
- **Artifacts**: Wave closure certification, PR, merged code

#### CLOSED
- **Definition**: Wave merged, IBWR complete, ready for next wave
- **Entry Criteria**: Wave PR merged AND IBWR complete (per IN_BETWEEN_WAVE_RECONCILIATION.md)
- **During**:
  - IBWR reconciliation and learning promotion
  - Governance updates from IBWR
  - Ripple propagation to consumer repos
  - Combined Wave Testing (CWT) for cumulative validation
- **Exit Criteria**: IBWR complete with all governance updates merged
- **Owner**: FM + governance-repo-administrator
- **Artifacts**: IBWR reconciliation report, governance updates, CWT evidence

---

### 4.2 Wave Transition Rules

#### PLANNED → IN_PROGRESS
- **Condition**: FM authorization AND pre-auth checklist complete
- **Blocking**: Missing architecture, QA Catalog misalignment, unresolved BL/FL-CI items
- **Authority**: FM (non-delegable)

#### IN_PROGRESS → VALIDATING
- **Condition**: All builders report GREEN AND FM confirms readiness
- **Blocking**: Failing QA, test debt, incomplete components, missing evidence
- **Authority**: FM (non-delegable)

#### VALIDATING → COMPLETE
- **Condition**: FM validation PASS AND wave closure certification issued
- **Blocking**: Validation failures, evidence gaps, certification cannot be issued
- **Authority**: FM (non-delegable)

#### COMPLETE → CLOSED
- **Condition**: Wave PR merged AND IBWR complete
- **Blocking**: PR not merged, IBWR not started, governance updates not merged, CWT not PASS
- **Authority**: FM + governance-repo-administrator

#### CLOSED → (Next Wave PLANNED)
- **Condition**: IBWR complete with all ripple propagation verified
- **Blocking**: Incomplete IBWR, governance gaps not addressed, ripple not propagated
- **Authority**: FM + governance-repo-administrator

---

## 5. Wave Completion Criteria

A wave is considered **COMPLETE** when ALL of the following are satisfied:

### 5.1 Quality Criteria
- ✅ 100% QA GREEN (all wave-specific tests passing)
- ✅ Zero test debt (no skipped, stubbed, or incomplete tests)
- ✅ Zero failing tests in cumulative test suite
- ✅ Zero warnings (unless explicitly whitelisted)
- ✅ All gates passing (PR gates, governance gates, security gates)

### 5.2 Evidence Criteria
- ✅ Canonical progress artifact complete (all sections filled, all artifacts indexed)
- ✅ Architecture documentation complete and validated
- ✅ Build evidence trail complete
- ✅ QA results recorded
- ✅ Validation results recorded

### 5.3 Governance Criteria
- ✅ All governance rules followed
- ✅ All constitutional safeguards observed
- ✅ No governance violations detected
- ✅ All required approvals obtained (CS2 if protected files modified)

### 5.4 Certification Criteria
- ✅ FM wave closure certification issued
- ✅ Certification based on evidence (not memory or assumption)
- ✅ Certification includes verdict: COMPLETE

---

## 6. Issue Artifact Generation

### 6.1 Purpose

**GitHub issues** serve as canonical task artifacts in the Wave Model, providing:
- **Traceability**: Every task links to code changes
- **Visibility**: CS2 and stakeholders can track progress
- **Auditability**: Complete execution trail
- **Integration**: Links to PRs, commits, and evidence

### 6.2 Issue Creation Protocol

#### When FM Creates Issues
- **At wave planning phase**: After architecture complete, before execution authorization
- **One issue per step**: Each atomic work unit gets dedicated issue
- **All issues created upfront**: No on-the-fly issue creation during execution

#### Issue Structure (Required Fields)
```markdown
# [WAVE-X.Y] - [Component Name] - [Brief Description]

## Wave Context
- Wave: Wave X
- Sub-Wave: Y (if applicable)
- Phase: Architecture | QA | Build | Validation

## Scope
[Clear description of what needs to be built/tested/validated]

## Architecture Reference
- Architecture Doc: [Link to architecture file]
- QA Catalog Entry: [Link to QA Catalog section]

## Acceptance Criteria
- [ ] Criterion 1
- [ ] Criterion 2
- [ ] All tests GREEN

## Dependencies
- Depends on: #issue_number (if applicable)
- Blocks: #issue_number (if applicable)

## Assigned To
- Builder: [builder-agent-name]
- Supervisor: Foreman

## Evidence Required
- [ ] Build evidence (commit links)
- [ ] QA results (test output)
- [ ] Validation confirmation (FM sign-off)
```

#### Issue Lifecycle
```
OPEN → IN_PROGRESS → REVIEW → CLOSED
```

- **OPEN**: Issue created, ready for assignment
- **IN_PROGRESS**: Builder actively working on task
- **REVIEW**: Builder reports completion, awaiting FM validation
- **CLOSED**: FM validates and closes issue with evidence link

### 6.3 Integration with Progress Artifact

- Every issue MUST be indexed in canonical progress artifact
- Progress artifact tracks issue status
- Issue closure MUST be recorded in progress artifact
- Evidence from issue MUST be linked in progress artifact

---

## 7. Combined Wave Testing (CWT)

### 7.1 Purpose

**Combined Wave Testing** validates that all waves through Wave N integrate correctly and function as a cohesive system.

### 7.2 CWT Requirements

#### When CWT Executes
- **Mandatory at IBWR**: Before wave can transition to CLOSED
- **Scope**: All waves from Wave 1 through current Wave N
- **Frequency**: After every wave completion

#### CWT Coverage
- ✅ Cross-wave integration (Wave 1 → Wave 2 → ... → Wave N)
- ✅ Cross-module integration (all modules in all waves)
- ✅ Multi-scenario coverage (happy path + error paths + edge cases)
- ✅ Cumulative regression testing (all previous functionality still works)

#### CWT Blocking Authority
> **CWT PASS is mandatory for wave closure. IBWR CANNOT complete without CWT PASS.**

### 7.3 CWT Failure Response

If CWT fails:
1. **STOP**: Halt IBWR immediately
2. **ANALYZE**: Determine which wave(s) caused integration failure
3. **FIX**: Remediate integration issue (may require reopening wave)
4. **RETEST**: Re-run full CWT suite
5. **DOCUMENT**: Record integration failure as FL-CI learning
6. **PROMOTE**: If governance gap revealed, promote to canon

---

## 8. In-Between Wave Reconciliation (IBWR) Integration

### 8.1 Wave Model's Role in IBWR

After wave PR merges, **IBWR** begins (per IN_BETWEEN_WAVE_RECONCILIATION.md):

1. **Reconciliation**: FM compares planned vs. actual execution
2. **Learning Capture**: FL-CI and BL entries created for execution insights
3. **Governance Improvement**: Gaps promoted to canon
4. **Ripple Propagation**: Updates flow to FM contracts, builder contracts, consumer repos
5. **CWT Execution**: Validate cumulative integration
6. **Next-Wave Readiness**: Ensure governance ready for Wave N+1

### 8.2 Blocking Authority

> **No Wave N+1 may begin until Wave N IBWR is complete.**

This ensures continuous governance improvement and prevents accumulation of technical or governance debt.

---

## 9. FM Authority and Responsibilities

### 9.1 Wave Planning
- FM MUST define wave scope, architecture, and acceptance criteria
- FM MUST create canonical wave planning document
- FM MUST generate GitHub issues for all tasks
- FM MUST complete pre-authorization checklist (QA Catalog, BL/FL-CI forward-scan)

### 9.2 Wave Execution
- FM MUST monitor progress via canonical progress artifact
- FM MUST update progress artifact systematically (per MANDATORY_CANONICAL_PROGRESS_RECORDING_AND_WAVE_CLOSURE_CERTIFICATION.md)
- FM MUST validate completions against QA
- FM MUST enforce governance throughout execution

### 9.3 Wave Closure
- FM MUST certify wave completion based on evidence
- FM MUST NOT certify without 100% QA GREEN, zero test debt
- FM MUST block merge if certification cannot be issued
- FM MUST generate wave closure certification artifact

### 9.4 IBWR Execution
- FM MUST initiate IBWR immediately after wave PR merge
- FM MUST generate reconciliation report
- FM MUST classify learnings (BL, FL-CI, Tier-0, Tier-1)
- FM MUST promote governance gaps to canon
- FM MUST execute CWT before IBWR completion

---

## 10. Prohibitions

FM and Builders MUST NEVER:

- ❌ Start wave execution without completed pre-auth checklist
- ❌ Skip wave planning phase ("just start building")
- ❌ Create issues on-the-fly during execution
- ❌ Certify wave closure without evidence review
- ❌ Proceed to next wave without IBWR completion
- ❌ Skip CWT to accelerate wave closure
- ❌ Accept partial wave completion (all-or-nothing)
- ❌ Merge wave PR with failing tests or test debt
- ❌ Allow wave state transitions without satisfying entry/exit criteria

---

## 11. Wave Model Versioning

This Wave Model (v1.0.0) establishes the foundational structure. Future versions may:
- Refine wave decomposition rules
- Add new wave states (e.g., PAUSED, BLOCKED)
- Enhance CWT requirements
- Improve issue artifact templates
- Integrate with Platform Tree architecture

**Change Authority**: All Wave Model changes require CS2 approval and ARC review (constitutional).

---

## 12. Integration with Related Canon

This Wave Model integrates with:

| Canon File | Integration Point |
|------------|------------------|
| **BUILD_TREE_EXECUTION_MODEL.md** | Hierarchical structure definition |
| **MANDATORY_CANONICAL_PROGRESS_RECORDING_AND_WAVE_CLOSURE_CERTIFICATION.md** | Progress recording, wave certification |
| **IN_BETWEEN_WAVE_RECONCILIATION.md** | Post-wave learning and governance improvement |
| **FM_ROLE_CANON.md** | FM authority for wave planning, execution, closure |
| **COMBINED_TESTING_PATTERN.md** | CWT requirements and blocking authority |
| **ARCHITECTURE_COMPLETENESS_REQUIREMENTS.md** | Architecture validation before wave authorization |
| **QA_CATALOG_ALIGNMENT_GATE_CANON.md** | QA Catalog alignment before wave execution |
| **FM_PREAUTH_CHECKLIST_CANON.md** | Pre-authorization validation checklist |
| **FOREMAN_WAVE_PLANNING_AND_ISSUE_ARTIFACT_GENERATION_PROTOCOL.md** | Issue creation protocol details |

---

**END OF WAVE MODEL**

**Authority**: CS2 (Johan Ras) | **Version**: 1.0.0 | **Effective**: 2026-02-08
