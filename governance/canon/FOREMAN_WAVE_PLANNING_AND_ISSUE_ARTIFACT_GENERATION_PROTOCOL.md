# FOREMAN WAVE PLANNING AND ISSUE ARTIFACT GENERATION PROTOCOL

## Status
**Type**: Canonical Governance Protocol  
**Authority**: Supreme - Canonical  
**Version**: 1.0.0  
**Effective Date**: 2026-02-08  
**Owner**: Maturion Engineering Leadership (Johan Ras)  
**Precedence**: Subordinate to GOVERNANCE_PURPOSE_AND_SCOPE.md  
**Layer-Down Status**: PUBLIC_API  
**Applies To**: All Foreman (FM) Instances, All Repositories

---

## 1. Purpose

This protocol establishes the **canonical workflow for FM wave planning and issue artifact generation**, defining:
- Wave planning methodology and decomposition strategy
- Subwave identification and boundary establishment
- Issue artifact generation workflow (wave, builder task, correction, gap)
- Artifact requirements and quality standards
- Wave progress tracking and certification
- Integration with wave lifecycle and memory protocols

**Core Principle**: **Systematic wave planning** with **explicit artifact generation** ensures architectural completeness, execution traceability, and governance compliance across the entire build lifecycle.

**Critical Mandate**: FM MUST decompose work into **manageable waves and subwaves** with **clear issue artifacts** that enable autonomous builder execution and comprehensive audit trails.

---

## 2. Constitutional Authority

This protocol derives authority from and implements:
- **WAVE_MODEL.md** — Wave lifecycle, phase transitions, wave/subwave definitions
- **FM_ROLE_CANON.md** — FM authority, canonical progress recording (§6.1), issue artifact generation (§13)
- **FOREMAN_AUTHORITY_AND_SUPERVISION_MODEL.md** — FM as managerial authority, POLC framework
- **FOREMAN_MEMORY_PROTOCOL.md** — Wave memory management, progress artifact maintenance
- **FM_BUILDER_APPOINTMENT_PROTOCOL.md** — Builder appointment and task assignment
- **BUILD_PHILOSOPHY.md** — Architecture primacy, QA-as-proof, one-time build law
- **WE_ONLY_FAIL_ONCE_DOCTRINE.md** — Failure learning and RCA requirements
- **AGENT_SELF_GOVERNANCE_PROTOCOL.md** — Governance gap detection and escalation

---

## 3. Wave Planning Methodology

### 3.1 Wave Planning Phases

FM wave planning follows the **POLC (Planning, Organising, Leading, Control)** management framework:

```
┌──────────────────────────────────────────────────────────┐
│ PLANNING PHASE                                           │
│ - Analyze requirements                                   │
│ - Decompose into waves/subwaves                          │
│ - Define architecture scope per wave                     │
│ - Estimate complexity and builder capacity               │
│ - Establish wave success criteria                        │
└──────────────────────────────────────────────────────────┘
                         ↓
┌──────────────────────────────────────────────────────────┐
│ ORGANISING PHASE                                         │
│ - Create wave initialization issue                       │
│ - Generate wave progress artifact                        │
│ - Define artifact requirements                           │
│ - Establish dependency chains                            │
│ - Plan builder resource allocation                       │
└──────────────────────────────────────────────────────────┘
                         ↓
┌──────────────────────────────────────────────────────────┐
│ LEADING PHASE (Execution — see WAVE_MODEL.md)           │
│ - Architecture design                                    │
│ - QA creation (red)                                      │
│ - Builder appointment and instruction                    │
│ - Validation and quality control                         │
└──────────────────────────────────────────────────────────┘
                         ↓
┌──────────────────────────────────────────────────────────┐
│ CONTROL PHASE (Monitoring — see FM_ROLE_CANON.md §6)    │
│ - Track progress via wave progress artifact             │
│ - Monitor builder execution                              │
│ - Validate against acceptance criteria                   │
│ - Execute corrections and RCA                            │
│ - Certify wave completion                                │
└──────────────────────────────────────────────────────────┘
```

### 3.2 Wave Decomposition Strategy

#### 3.2.1 Wave Scope Definition

**Wave** is the **primary execution unit** representing:
- A cohesive set of features or architectural components
- A single merged PR (not multiple PRs)
- A complete Architecture → Red QA → Build to Green cycle
- A standalone validation and closure unit

**Wave Sizing Principles**:
- ✅ **Merge-once**: Wave completes in single PR merge (not incremental)
- ✅ **Architectural coherence**: Components within wave are tightly coupled
- ✅ **Builder capacity**: Wave complexity matches available builder resources
- ✅ **Testability**: Wave scope enables comprehensive QA suite creation
- ✅ **Reversibility**: Wave can be rolled back atomically if validation fails

**Wave Scope Anti-Patterns**:
- ❌ **Too large**: Wave scope exceeds builder capacity or QA complexity threshold
- ❌ **Too small**: Wave scope is trivial and creates unnecessary overhead
- ❌ **Incoherent**: Wave mixes unrelated features (e.g., auth + reporting)
- ❌ **Incremental**: Wave depends on multiple PR merges (violates merge-once)

#### 3.2.2 Subwave Decomposition

**Subwave** is a **subdivision of a large wave** when:
- Wave scope exceeds builder capacity (>40 hours estimated effort)
- Wave has natural architectural boundaries (layers, modules, services)
- Wave requires phased rollout (foundational → dependent components)
- Wave complexity requires staged validation

**Subwave Decomposition Workflow**:

```
Wave Scope Analysis
   ↓
Is wave complexity > builder capacity threshold?
   ↓
┌─────────────────────────────────────────────────────┐
│ NO: Execute as single wave                          │
│   → Single wave initialization issue                │
│   → Single wave progress artifact                   │
│   → Single PR merge                                 │
└─────────────────────────────────────────────────────┘
   ↓
┌─────────────────────────────────────────────────────┐
│ YES: Decompose into subwaves                        │
│   → Identify architectural boundaries               │
│   → Define subwave dependency chain                 │
│   → Create subwave scope issues                     │
│   → Execute subwaves sequentially                   │
│   → Merge subwaves independently                    │
└─────────────────────────────────────────────────────┘
```

**Subwave Dependency Management**:
- **Sequential**: Subwave N+1 depends on Subwave N completion
- **Parallel**: Subwaves N and M are independent (rare, requires explicit validation)
- **Layered**: Foundation subwave → Application subwave → Integration subwave

**Subwave Scope Requirements**:
- Each subwave has independent wave progress artifact
- Each subwave has independent QA suite (subset of parent wave)
- Each subwave merges independently (not blocked by sibling subwaves)
- Subwave closures documented in parent wave progress artifact

### 3.3 Complexity Assessment

FM MUST assess wave complexity before decomposition:

#### Complexity Factors
1. **Requirement Count**: Number of user stories, features, or components
2. **Integration Depth**: Number of layers or services involved (UI → API → Database)
3. **Architectural Ambiguity**: Degree of uncertainty in component design
4. **QA Coverage Requirements**: Test surface area (unit, integration, UI, performance)
5. **External Dependencies**: Third-party APIs, libraries, or services
6. **Builder Capability**: Available builder skill level and capacity

#### Complexity Classification
- **Simple** (0-10 points): Single component, no integration, clear requirements
- **Moderate** (11-25 points): Multi-component, one integration layer, mostly clear requirements
- **Complex** (26-50 points): Multi-layer, multiple integrations, some ambiguity
- **Very Complex** (51+ points): Cross-cutting, deep integration, high ambiguity

**Decision Rules**:
- Simple → Single wave, no subwaves
- Moderate → Single wave, consider subwaves if builder capacity limited
- Complex → Decompose into 2-3 subwaves
- Very Complex → Decompose into 3-5 subwaves OR escalate for requirements clarification

---

## 4. Issue Artifact Generation Workflow

### 4.1 Wave Initialization Issue

**When**: At wave planning completion, before architecture phase  
**Purpose**: Authorize wave start, document scope, establish success criteria

#### Content Requirements
```markdown
# [Wave N] <Wave Title>

## Wave Scope
<Brief description of wave objectives and deliverables>

## Wave Objectives
1. <Objective 1>
2. <Objective 2>
3. <Objective 3>

## Wave Deliverables
- [ ] <Deliverable 1>
- [ ] <Deliverable 2>
- [ ] <Deliverable 3>

## Wave Success Criteria
- [ ] All deliverables complete (100% list checked)
- [ ] Architecture documentation complete (validated against checklist)
- [ ] QA suite complete and 100% passing (zero failures, zero debt)
- [ ] Zero governance violations (all gates passed)
- [ ] Wave closure certification generated

## Wave Phases
1. **Planning** (Complete) — Wave decomposition and artifact planning
2. **Architecture** (Next) — Complete architecture documentation
3. **QA Creation** (Pending) — Create failing QA suite
4. **Build** (Pending) — Builder execution to green
5. **Validation** (Pending) — Validate QA green, zero debt
6. **Closure** (Pending) — Certify wave completion

## Wave Progress Artifact
- **Location**: `execution-progress/WAVE_<N>_IMPLEMENTATION_PROGRESS.md`
- **Authority**: FM_ROLE_CANON.md §6.1

## Governance Authority
- **WAVE_MODEL.md** — Wave lifecycle and phase definitions
- **FM_ROLE_CANON.md** — FM authority for wave execution
- **BUILD_PHILOSOPHY.md** — Architecture primacy, QA-as-proof

## Acceptance Criteria Validation
- [ ] Architecture checklist 100% complete
- [ ] QA suite created and validated red
- [ ] Builder task issued and accepted
- [ ] QA validated green (100% pass, zero debt)
- [ ] Wave closure certification signed

---
**Created**: YYYY-MM-DD by FM  
**Authority**: FOREMAN_WAVE_PLANNING_AND_ISSUE_ARTIFACT_GENERATION_PROTOCOL.md §4.1
```

#### Generation Workflow
```bash
# Create wave initialization issue
create_wave_init_issue() {
  WAVE_NUM=$1
  WAVE_TITLE=$2
  WAVE_SCOPE=$3
  
  # Generate issue from template
  ISSUE_BODY=$(sed "s/{{WAVE_NUM}}/$WAVE_NUM/g" \
    governance/templates/WAVE_INITIALIZATION_ISSUE.template.md)
  ISSUE_BODY=$(echo "$ISSUE_BODY" | sed "s/{{WAVE_TITLE}}/$WAVE_TITLE/g")
  ISSUE_BODY=$(echo "$ISSUE_BODY" | sed "s/{{WAVE_SCOPE}}/$WAVE_SCOPE/g")
  
  # Create issue via GitHub API
  ISSUE_NUMBER=$(gh issue create \
    --title "[Wave $WAVE_NUM] $WAVE_TITLE" \
    --body "$ISSUE_BODY" \
    --label "wave,foreman" \
    --output json | jq -r '.number')
  
  # Document in wave progress artifact
  echo "## Wave Initialization" >> execution-progress/WAVE_${WAVE_NUM}_IMPLEMENTATION_PROGRESS.md
  echo "**Issue**: #${ISSUE_NUMBER}" >> execution-progress/WAVE_${WAVE_NUM}_IMPLEMENTATION_PROGRESS.md
  echo "**Created**: $(date -u +%Y-%m-%d\ %H:%M:%S\ UTC)" >> execution-progress/WAVE_${WAVE_NUM}_IMPLEMENTATION_PROGRESS.md
  
  echo $ISSUE_NUMBER
}
```

### 4.2 Builder Task Issue

**When**: After architecture and QA creation complete, before builder appointment  
**Purpose**: Instruct builder to "Build to Green" against failing QA

#### Content Requirements
```markdown
# [Wave N] Builder Task: <Component/Feature Name>

## Instruction: BUILD TO GREEN

You are instructed to **Build to Green** the following failing QA suite.

**Critical**: Your ONLY objective is to make ALL tests pass. You MUST NOT:
- Skip tests
- Modify test expectations (without FM approval)
- Add test debt (.skip, .only, incomplete stubs)
- Implement features not validated by tests

## Red QA Suite
- **Location**: `<path-to-test-suite>`
- **Current Status**: 🔴 RED (all tests failing as expected)
- **Expected Status**: 🟢 GREEN (100% passing after your work)

## Architecture Documentation
- **Location**: `evidence/architecture/WAVE_<N>_ARCHITECTURE.md`
- **Completeness**: ✅ Validated against architecture checklist

## Acceptance Criteria
- [ ] 100% QA passing (zero failures, zero errors)
- [ ] Zero test debt (no .skip, .only, or stubs)
- [ ] Code quality validated (linter passing)
- [ ] Architecture alignment validated (FM review)
- [ ] PR created with descriptive title and summary

## Build-to-Green Process
1. Read architecture documentation thoroughly
2. Run QA suite (validate all tests are RED)
3. Implement code to make tests GREEN (one test at a time)
4. Validate QA suite (100% passing, zero debt)
5. Create PR with evidence (QA results, linter results)
6. Request FM validation

## Governance Constraints
- **BUILD_PHILOSOPHY.md** — One-time build law, zero test debt
- **STOP_AND_FIX_DOCTRINE.md** — If you see it, you own it
- **BUILDER_FIRST_PR_MERGE_MODEL.md** — First-time builder requirements

## Escalation Criteria
If you encounter:
- Ambiguous architecture (unclear component design)
- Insufficient QA (missing test coverage)
- Blocker (external dependency unavailable)
- Unresolvable test failure (appears to be QA bug)

→ **Escalate to FM immediately** (do not guess, do not workaround)

---
**Created**: YYYY-MM-DD by FM  
**Authority**: FOREMAN_WAVE_PLANNING_AND_ISSUE_ARTIFACT_GENERATION_PROTOCOL.md §4.2
```

#### Generation Workflow
```bash
# Create builder task issue
create_builder_task_issue() {
  WAVE_NUM=$1
  COMPONENT_NAME=$2
  QA_PATH=$3
  ARCH_PATH=$4
  
  # Generate issue from template
  ISSUE_BODY=$(sed "s/{{WAVE_NUM}}/$WAVE_NUM/g" \
    governance/templates/BUILDER_TASK_ISSUE.template.md)
  ISSUE_BODY=$(echo "$ISSUE_BODY" | sed "s/{{COMPONENT_NAME}}/$COMPONENT_NAME/g")
  ISSUE_BODY=$(echo "$ISSUE_BODY" | sed "s|{{QA_PATH}}|$QA_PATH|g")
  ISSUE_BODY=$(echo "$ISSUE_BODY" | sed "s|{{ARCH_PATH}}|$ARCH_PATH|g")
  
  # Create issue via GitHub API
  ISSUE_NUMBER=$(gh issue create \
    --title "[Wave $WAVE_NUM] Builder Task: $COMPONENT_NAME" \
    --body "$ISSUE_BODY" \
    --label "builder-task,wave-$WAVE_NUM" \
    --output json | jq -r '.number')
  
  # Document in wave progress artifact
  echo "## Builder Task #${ISSUE_NUMBER}: $COMPONENT_NAME" \
    >> execution-progress/WAVE_${WAVE_NUM}_IMPLEMENTATION_PROGRESS.md
  echo "**Created**: $(date -u +%Y-%m-%d\ %H:%M:%S\ UTC)" \
    >> execution-progress/WAVE_${WAVE_NUM}_IMPLEMENTATION_PROGRESS.md
  echo "**Status**: Assigned (awaiting builder acceptance)" \
    >> execution-progress/WAVE_${WAVE_NUM}_IMPLEMENTATION_PROGRESS.md
  
  echo $ISSUE_NUMBER
}
```

### 4.3 Correction/RCA Issue

**When**: When QA failure, governance violation, or blocker detected  
**Purpose**: Document failure, root cause, and remediation plan

#### Content Requirements
```markdown
# [Wave N] Correction: <Failure Description>

## Failure Summary
<Brief description of what failed and when>

## Failure Details
- **Failure Type**: QA Failure | Governance Violation | Blocker | Other
- **Detection Time**: YYYY-MM-DD HH:MM:SS UTC
- **Wave Phase**: Architecture | QA | Build | Validation
- **Severity**: Low | Medium | High | Critical

## Root Cause Analysis (RCA)
### What Happened
<Detailed description of failure event>

### Why It Happened
<Root cause identification>

### Contributing Factors
1. <Factor 1>
2. <Factor 2>
3. <Factor 3>

## Remediation Plan
- [ ] <Remediation step 1>
- [ ] <Remediation step 2>
- [ ] <Remediation step 3>

## Prevention Measures
- [ ] <Prevention measure 1>
- [ ] <Prevention measure 2>

## Learning Capture
- **Category**: Architectural | QA | Builder Supervision | Governance Gap
- **Learning**: <What did we learn?>
- **Proposed Promotion**: <Should this become canonical guidance?>

## Governance Authority
- **WE_ONLY_FAIL_ONCE_DOCTRINE.md** — Failure learning and prevention
- **CATASTROPHIC_FAILURE_PROTOCOL.md** — RCA requirements (if critical)
- **LEARNING_LOOP_CATEGORIES_AND_LIFECYCLE.md** — Learning capture and promotion

## Acceptance Criteria
- [ ] Root cause identified and documented
- [ ] Remediation plan executed and validated
- [ ] Prevention measures implemented
- [ ] Learning captured in personal/lessons-learned.md
- [ ] Proposed for governance promotion (if applicable)

---
**Created**: YYYY-MM-DD by FM  
**Authority**: FOREMAN_WAVE_PLANNING_AND_ISSUE_ARTIFACT_GENERATION_PROTOCOL.md §4.3
```

### 4.4 Governance Gap Issue

**When**: When missing or ambiguous governance identified  
**Purpose**: Escalate gap to CS2 for canonical resolution

#### Content Requirements
```markdown
# [Governance Gap] <Gap Description>

## Gap Summary
<Brief description of missing or ambiguous governance>

## Gap Details
- **Gap Type**: Missing Canon | Ambiguous Canon | Conflicting Canon | Outdated Canon
- **Detection Context**: <When and how gap was identified>
- **Impact**: <How gap blocks or risks execution>

## Current Workaround
<How FM is currently handling the gap>

## Proposed Resolution
<FM's recommendation for canonical governance>

## Impact Assessment
- **Execution Impact**: Blocked | Degraded | Workaround Available
- **Governance Integrity Risk**: Low | Medium | High
- **Cross-Repository Impact**: Isolated | Ripple Required

## Related Governance
- <Existing canon file that should address this>
- <Related governance that creates ambiguity>

## CS2 Decision Required
- [ ] Create new canonical governance
- [ ] Clarify existing canonical governance
- [ ] Resolve conflict between existing canons
- [ ] Update outdated canonical governance
- [ ] Other: ___________________

---
**Created**: YYYY-MM-DD by FM  
**Authority**: FOREMAN_WAVE_PLANNING_AND_ISSUE_ARTIFACT_GENERATION_PROTOCOL.md §4.4
```

---

## 5. Wave Progress Artifact Requirements

### 5.1 Artifact Structure

Per FM_ROLE_CANON.md §6.1, FM MUST maintain canonical wave progress artifact:

```markdown
# Wave N Implementation Progress

**Wave**: <wave-number>  
**Title**: <wave-title>  
**Status**: Planning | Architecture | QA | Build | Validation | Complete  
**Started**: YYYY-MM-DD  
**Completed**: YYYY-MM-DD | In Progress  
**Authority**: FM_ROLE_CANON.md §6.1

---

## Wave Scope
<Brief description from wave initialization issue>

## Phase Status

| Phase | Status | Started | Completed | Evidence |
|-------|--------|---------|-----------|----------|
| Planning | ✅ Complete | YYYY-MM-DD | YYYY-MM-DD | This artifact |
| Architecture | ⏳ In Progress | YYYY-MM-DD | - | evidence/architecture/ |
| QA Creation | ⏸️ Pending | - | - | - |
| Build | ⏸️ Pending | - | - | - |
| Validation | ⏸️ Pending | - | - | - |
| Closure | ⏸️ Pending | - | - | - |

## Issue Registry

| Issue # | Type | Title | Created | Assigned | Status | Closed |
|---------|------|-------|---------|----------|--------|--------|
| #123 | Wave Init | Wave 3: User Auth | 2026-02-01 | FM | Closed | 2026-02-15 |
| #124 | Builder Task | Implement Login | 2026-02-03 | Builder-A | In Progress | - |

## Artifact Index

| Artifact | Path | Status | Last Updated |
|----------|------|--------|--------------|
| Architecture | evidence/architecture/WAVE_3_ARCH.md | Complete | 2026-02-02 |
| QA Suite | tests/auth/ | In Progress | 2026-02-03 |

## Execution Timeline

### YYYY-MM-DD HH:MM - Wave Initialization
- Wave scope defined
- Wave initialization issue created (#123)
- Wave progress artifact created

### YYYY-MM-DD HH:MM - Architecture Phase Start
- Architecture design initiated
- Architecture checklist validation in progress

### YYYY-MM-DD HH:MM - Architecture Phase Complete
- Architecture documentation complete
- Architecture validated against checklist

## Corrections and RCA

| Date | Issue # | Description | Resolution |
|------|---------|-------------|------------|
| 2026-02-08 | #125 | QA timeout failure | RCA complete, remediated |

## Wave Closure Certification
<Generated at wave completion per FM_ROLE_CANON.md §6.2>

---
**Maintained by**: FM  
**Authority**: FM_ROLE_CANON.md §6.1, FOREMAN_MEMORY_PROTOCOL.md §4.2
```

### 5.2 Update Frequency

Per FM_ROLE_CANON.md §6.1.1, FM MUST update wave progress artifact:
- **Within 4 hours** of phase transition
- **Within 4 hours** of artifact creation/completion
- **Within 4 hours** of issue creation/closure
- **Within 4 hours** of correction/RCA event

---

## 6. Artifact Quality Standards

### 6.1 High-Quality Artifacts

✅ **Clear and Complete**:
- Unambiguous language (no "TBD", "as needed", "maybe")
- Complete acceptance criteria (testable, objective)
- Explicit governance authority citations
- Comprehensive references (architecture, QA, canon)

✅ **Governance-Aligned**:
- Complies with BUILD_PHILOSOPHY.md (architecture primacy, QA-as-proof)
- Complies with WAVE_MODEL.md (wave lifecycle, phase definitions)
- Complies with FM_ROLE_CANON.md (FM authority, progress recording)
- Complies with STOP_AND_FIX_DOCTRINE.md (zero tolerance, universal responsibility)

✅ **Audit-Ready**:
- Timestamps for all events (creation, transitions, closure)
- Evidence links (architecture, QA results, CI logs)
- Acceptance criteria validation documentation
- Learning capture integration

### 6.2 Poor-Quality Artifacts (FM MUST NOT Create)

❌ **Vague or Incomplete**:
- Missing acceptance criteria
- Ambiguous success criteria ("improve", "enhance", "fix")
- Missing governance authority
- Broken references (dead links, missing files)

❌ **Governance-Violating**:
- Bypasses Build-to-Green process (no Red QA reference)
- Accepts test debt (partial QA pass)
- Skips architecture phase (build without design)
- Allows scope creep (acceptance criteria change mid-execution)

❌ **Non-Auditable**:
- Missing timestamps
- No evidence links
- Incomplete execution timeline
- Missing acceptance criteria validation

---

## 7. Integration with Other Governance

### 7.1 Integration Points

| Governance Artifact | Integration |
|---------------------|-------------|
| **WAVE_MODEL.md** | Wave lifecycle, phase definitions, wave/subwave rules |
| **FM_ROLE_CANON.md** | FM authority, canonical progress recording (§6.1), issue artifacts (§13) |
| **FOREMAN_MEMORY_PROTOCOL.md** | Wave memory management, progress artifact maintenance |
| **FM_BUILDER_APPOINTMENT_PROTOCOL.md** | Builder appointment, task assignment workflow |
| **BUILD_PHILOSOPHY.md** | Architecture primacy, QA-as-proof, one-time build law |
| **WE_ONLY_FAIL_ONCE_DOCTRINE.md** | Correction/RCA requirements |
| **LEARNING_LOOP_CATEGORIES_AND_LIFECYCLE.md** | Learning capture and promotion |

---

## 8. Compliance and Enforcement

### 8.1 Mandatory Requirements

**FM MUST**:
- ✅ Create wave initialization issue before architecture phase
- ✅ Generate wave progress artifact at wave start
- ✅ Create builder task issues with Red QA and architecture references
- ✅ Create correction/RCA issues for all failures
- ✅ Create governance gap issues when gaps identified
- ✅ Update wave progress artifact within 4 hours of events
- ✅ Use standardized issue templates
- ✅ Validate issue quality before creation

**FM MUST NOT**:
- ❌ Create issues without governance authority
- ❌ Create vague or incomplete issues
- ❌ Skip wave progress artifact updates
- ❌ Close issues without acceptance criteria validation
- ❌ Create issues that bypass Build-to-Green process

---

## 9. Versioning and Evolution

**Current Version**: 1.0.0 (2026-02-08)

**Version History**:
- **v1.0.0** (2026-02-08) — Initial canonical protocol establishing wave planning methodology, issue artifact generation workflow, and progress tracking requirements

---

## 10. Summary

**Wave planning methodology?**  
POLC framework: Planning (decomposition) → Organising (artifacts) → Leading (execution) → Control (monitoring).

**Wave decomposition strategy?**  
Single wave (default) or subwaves (if complexity exceeds builder capacity or architectural boundaries exist).

**Issue artifact types?**  
Wave initialization, builder task, correction/RCA, governance gap, subwave scope.

**Wave progress artifact?**  
Canonical progress tracking document (execution-progress/WAVE_N_IMPLEMENTATION_PROGRESS.md) updated within 4 hours of events.

**Artifact quality standards?**  
Clear, complete, governance-aligned, audit-ready. No vague criteria, governance violations, or missing timestamps.

---

**Authority**: GOVERNANCE_PURPOSE_AND_SCOPE.md  
**Version**: 1.0.0  
**Effective**: 2026-02-08  
**Owner**: CS2 (Johan Ras)
