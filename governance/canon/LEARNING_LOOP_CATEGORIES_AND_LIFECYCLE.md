# LEARNING LOOP CATEGORIES AND LIFECYCLE

## Status
**Type**: Tier-1 Operational Canon  
**Authority**: Constitutional  
**Version**: 1.0.0  
**Effective Date**: 2026-02-08  
**Owner**: Maturion Engineering Leadership (Johan Ras)  
**Layer-Down Status**: PUBLIC_API  
**Applies To**: All Agents, All Learning Intake, All Governance Promotion

---

## 1. Purpose

This document formally defines the **learning loop categories** and their lifecycles within the Maturion governance ecosystem.

Learning loops capture execution insights and promote them to governance, ensuring continuous improvement without regression. This canon establishes:
- **Four learning categories**: Tier-0, Tier-1, BL, FL-CI
- **Category definitions** and classification criteria
- **Lifecycle states** for each category
- **Promotion paths** from execution to governance
- **Integration** with governance ripple and IBWR

---

## 2. Constitutional Authority

This model derives authority from and integrates with:

- **LEARNING_INTAKE_AND_PROMOTION_MODEL.md** - Learning intake triggers and promotion decisions
- **WE_ONLY_FAIL_ONCE_DOCTRINE.md** - Mandatory structural change from failures
- **FAILURE_PROMOTION_RULE.md** - Governance promotion requirements
- **IN_BETWEEN_WAVE_RECONCILIATION.md** - Post-wave learning promotion
- **BOOTSTRAP_EXECUTION_LEARNINGS.md** - BL entry model
- **BUILD_PHILOSOPHY.md** - Compulsory learning without regression

---

## 3. Learning Loop Categories

### 3.1 Category Taxonomy

| Category | Scope | Authority Level | Promotion Target | Lifecycle |
|----------|-------|----------------|------------------|-----------|
| **Tier-0** | Constitutional | Supreme (ARC) | maturion/*.md | PROPOSED → APPROVED → CANONICAL → RIPPLED |
| **Tier-1** | Policy/Canon | Constitutional | governance/canon/*.md | PROPOSED → APPROVED → CANONICAL → RIPPLED |
| **BL** | Bootstrap Learning | Execution | BOOTSTRAP_EXECUTION_LEARNINGS.md | CAPTURED → CLASSIFIED → PROMOTED | ARCHIVED |
| **FL-CI** | Failure/Continuous Improvement | Execution | Wave reconciliation report | CAPTURED → RESOLVED → CLOSED |

---

### 3.2 Tier-0 (Constitutional)

#### Definition
**Tier-0 learnings** reveal fundamental constitutional gaps in the Maturion governance framework.

#### Characteristics
- ✅ Reveals missing foundational principle
- ✅ Affects system-wide behavior or identity
- ✅ Requires ARC (Architecture Review Committee) approval
- ✅ Changes immutable constitutional documents

#### Examples
- Watchdog oversight principles (oversight-system.md)
- True North principles (maturion-true-north.md)
- Core identity definitions (maturion-identity.md)
- Constitutional memory architecture

#### Promotion Target
- **Location**: `maturion/*.md` (constitutional documents)
- **Authority**: CS2 with ARC approval
- **Change Control**: Immutable except through formal ARC process

#### Lifecycle States

```
PROPOSED
  ↓
UNDER_ARC_REVIEW
  ↓
APPROVED_BY_ARC
  ↓
CANONICAL (merged to maturion/)
  ↓
RIPPLED (propagated to all governance layers)
```

**State Definitions**:
- **PROPOSED**: Learning captured, constitutional gap identified, proposal drafted
- **UNDER_ARC_REVIEW**: Submitted to CS2 for ARC review
- **APPROVED_BY_ARC**: CS2/ARC approves constitutional change
- **CANONICAL**: Change merged to maturion/ directory
- **RIPPLED**: Changes propagated to Tier-1 canon, agent contracts, consumer repos

---

### 3.3 Tier-1 (Policy/Canon)

#### Definition
**Tier-1 learnings** reveal policy or execution gaps requiring canonical governance updates.

#### Characteristics
- ✅ Reveals missing or incomplete governance rule
- ✅ Affects execution behavior or quality standards
- ✅ Requires CS2 approval (governance-repo-administrator can propose)
- ✅ Creates or updates governance canon files

#### Examples
- Wave model rules (WAVE_MODEL.md)
- Stop-and-fix doctrine (STOP_AND_FIX_DOCTRINE.md)
- FM authority boundaries (FOREMAN_AUTHORITY_AND_SUPERVISION_MODEL.md)
- PR gate requirements

#### Promotion Target
- **Location**: `governance/canon/*.md`
- **Authority**: CS2 (governance-repo-administrator proposes)
- **Change Control**: Canonical, requires approval and ripple

#### Lifecycle States

```
PROPOSED
  ↓
UNDER_REVIEW
  ↓
APPROVED_BY_CS2
  ↓
CANONICAL (merged to governance/canon/)
  ↓
RIPPLED (propagated to agent contracts, consumer repos)
```

**State Definitions**:
- **PROPOSED**: Learning captured, governance gap identified, canon update drafted
- **UNDER_REVIEW**: Submitted to CS2 or governance-repo-administrator for review
- **APPROVED_BY_CS2**: CS2 approves governance change
- **CANONICAL**: Change merged to governance/canon/
- **RIPPLED**: Changes propagated to agent contracts and consumer repositories

---

### 3.4 BL (Bootstrap Learning)

#### Definition
**Bootstrap Learnings (BL)** are insights captured during bootstrap execution that inform future governance and automation.

#### Characteristics
- ✅ Captured during bootstrap phase (Wave 0, manual execution)
- ✅ Documents structural gaps, execution challenges, near-misses
- ✅ Often leads to Tier-1 canon creation
- ✅ Numbered sequentially (BL-0001, BL-0002, etc.)
- ✅ Recorded in BOOTSTRAP_EXECUTION_LEARNINGS.md

#### Examples
- BL-0001: Governance stabilization before FM recruitment
- BL-0024: Need for combined wave testing (CWT)
- BL-029: Excuse-based test dodging patterns
- BL-030: FL/CI loop false attestation pattern

#### Promotion Target
- **Location**: `governance/canon/BOOTSTRAP_EXECUTION_LEARNINGS.md`
- **Authority**: FM (capture), CS2 (validation and promotion to canon)
- **Change Control**: Additive (BL entries never deleted, only archived)

#### Lifecycle States

```
CAPTURED
  ↓
CLASSIFIED (Tier-0 | Tier-1 | Process | Tool)
  ↓
PROMOTED_TO_CANON (if governance gap) OR RESOLVED (if execution-only)
  ↓
ARCHIVED (after superseded or resolved)
```

**State Definitions**:
- **CAPTURED**: BL entry created with context, root cause, governance impact
- **CLASSIFIED**: Learning type determined (constitutional, policy, process, tool)
- **PROMOTED_TO_CANON**: If governance gap, Tier-0 or Tier-1 canon created/updated
- **RESOLVED**: If execution-only issue, fixed without governance promotion
- **ARCHIVED**: BL entry preserved for historical reference after governance promotion complete

#### BL Classification Types

| Type | Definition | Example | Promotion Path |
|------|------------|---------|----------------|
| **Constitutional** | Reveals Tier-0 gap | Missing oversight principle | Tier-0 canon |
| **Policy** | Reveals Tier-1 gap | Missing wave closure rule | Tier-1 canon |
| **Process** | Reveals workflow gap | Missing checklist item | Template/schema update |
| **Tool** | Reveals tooling gap | Missing validation script | Script creation |

---

### 3.5 FL-CI (Failure/Continuous Improvement)

#### Definition
**FL-CI records** capture execution-level failures and continuous improvement opportunities that require immediate fix but may not require governance promotion.

#### Characteristics
- ✅ Immediate execution issue (test failure, build error, configuration problem)
- ✅ Fixed during execution (does not block wave completion)
- ✅ May reveal pattern requiring promotion to BL or Tier-1
- ✅ Recorded in wave reconciliation reports

#### Examples
- Test failed due to typo in assertion (fixed immediately)
- Build error due to missing import (corrected)
- Configuration mismatch (environment-specific, resolved)
- Performance regression (optimized)

#### Promotion Target
- **Location**: Wave reconciliation report (in IBWR)
- **Authority**: FM or Builder
- **Change Control**: Not canonical (unless pattern emerges)

#### Lifecycle States

```
CAPTURED
  ↓
RESOLVED (immediate fix applied)
  ↓
CLOSED (verified fixed, no recurrence)
  ↓
PROMOTED_TO_BL (if pattern detected) OR ARCHIVED
```

**State Definitions**:
- **CAPTURED**: FL-CI entry created during execution
- **RESOLVED**: Immediate fix applied, execution continues
- **CLOSED**: Fix validated, no recurrence in same wave
- **PROMOTED_TO_BL**: If pattern emerges (3+ similar FL-CI), promote to BL for governance review
- **ARCHIVED**: FL-CI preserved in wave reconciliation report for audit

---

## 4. Learning Classification Decision Tree

```
Execution Insight Captured
  ↓
Does it reveal governance gap?
  ├─ NO → FL-CI (immediate fix only)
  └─ YES → Continue to classification
             ↓
       Is it constitutional (Tier-0)?
         ├─ YES → Tier-0 promotion (ARC approval)
         └─ NO → Continue
                  ↓
            Is it policy/execution rule (Tier-1)?
              ├─ YES → Tier-1 promotion OR BL entry (bootstrap)
              └─ NO → Continue
                        ↓
                  Is it workflow/process gap?
                    ├─ YES → BL entry (Process type)
                    └─ NO → FL-CI with monitoring for pattern
```

---

## 5. Promotion Pathways

### 5.1 FL-CI → BL Promotion

**Trigger**: 3+ similar FL-CI records in same wave OR across multiple waves

**Process**:
1. FM detects pattern in FL-CI records
2. FM creates BL entry documenting pattern
3. BL entry includes references to FL-CI records
4. BL follows normal classification and promotion path

**Example**: 3 tests fail due to missing mock data → BL-XXX created → Tier-1 canon updated (QA mock data requirements)

---

### 5.2 BL → Tier-1 Promotion

**Trigger**: BL entry classified as "Policy" type reveals governance gap

**Process**:
1. BL entry created and classified
2. governance-repo-administrator reviews BL
3. Tier-1 canon file created or updated
4. BL entry updated with governance reference
5. BL marked as PROMOTED_TO_CANON

**Example**: BL-024 (need for CWT) → COMBINED_TESTING_PATTERN.md created

---

### 5.3 BL → Tier-0 Promotion

**Trigger**: BL entry classified as "Constitutional" type reveals foundational gap

**Process**:
1. BL entry created and classified
2. Escalated to CS2 for ARC review
3. Constitutional document created or updated (requires ARC approval)
4. BL entry updated with constitutional reference
5. BL marked as PROMOTED_TO_CANON

**Example**: BL identifying missing oversight principle → oversight-system.md updated

---

## 6. Integration with IBWR

### 6.1 IBWR Learning Promotion

During In-Between Wave Reconciliation (IBWR):

1. **Review FL-CI records**: Identify patterns requiring BL promotion
2. **Review BL entries**: Classify and promote to Tier-0 or Tier-1
3. **Update governance**: Create/update canon files from promoted learnings
4. **Ripple changes**: Propagate to agent contracts and consumer repos
5. **Block next wave**: Until all governance promotions complete

**IBWR CANNOT complete** without resolving all learning promotions.

---

## 7. Learning Loop Metrics

### 7.1 Success Metrics

Learning loop is successful when:

- ✅ All execution insights captured (FL-CI or BL)
- ✅ Patterns detected and promoted within 1 wave
- ✅ Governance grows from execution learnings
- ✅ Recurrence rate decreases over time
- ✅ IBWR produces governance improvements after every wave
- ✅ BL entries systematically promote to Tier-1 canon

### 7.2 Health Indicators

**Healthy Learning Loop**:
- ✅ Steady BL/FL-CI creation rate
- ✅ High BL→Tier-1 promotion rate (learning becomes governance)
- ✅ Decreasing FL-CI recurrence rate
- ✅ Increasing canonical governance coverage

**Unhealthy Learning Loop**:
- ❌ No BL/FL-CI entries (not capturing learnings)
- ❌ Low BL→Tier-1 promotion rate (not improving governance)
- ❌ High FL-CI recurrence rate (not learning from failures)
- ❌ BL entries accumulating without promotion (governance stagnation)

---

## 8. Integration with Related Canon

| Canon File | Integration Point |
|------------|------------------|
| **LEARNING_INTAKE_AND_PROMOTION_MODEL.md** | Defines promotion decision criteria |
| **WE_ONLY_FAIL_ONCE_DOCTRINE.md** | Mandates promotion to prevent recurrence |
| **FAILURE_PROMOTION_RULE.md** | Enforces governance link in failure records |
| **IN_BETWEEN_WAVE_RECONCILIATION.md** | IBWR promotes learnings to governance |
| **BOOTSTRAP_EXECUTION_LEARNINGS.md** | Records all BL entries |
| **GOVERNANCE_RIPPLE_CHECKLIST_PROTOCOL.md** | Propagates promoted learnings |

---

**END OF LEARNING LOOP CATEGORIES AND LIFECYCLE**

**Authority**: CS2 (Johan Ras) | **Version**: 1.0.0 | **Effective**: 2026-02-08
