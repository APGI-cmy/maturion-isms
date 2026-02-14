# WE ONLY FAIL ONCE DOCTRINE

## Status
**Type**: Tier-0 Constitutional Canon  
**Authority**: Supreme - Constitutional  
**Version**: 1.0.0  
**Effective Date**: 2026-02-08  
**Owner**: Maturion Engineering Leadership (Johan Ras)  
**Layer-Down Status**: PUBLIC_API  
**Applies To**: All Agents, All Builders, All Foreman Instances, All Work, All Repositories, All Phases (Bootstrap and Production)

---

## 1. Purpose

This doctrine establishes the **"We Only Fail Once"** constitutional principle: **Every failure MUST result in structural governance improvement that prevents identical recurrence**.

The doctrine exists to ensure:
- **Zero repeat failures** of the same root cause
- **Systematic learning** from every failure
- **Governance evolution** driven by execution reality
- **Compulsory improvement** without exceptions
- **Failure as progress**, not waste

**Critical Principle**: Failing once is acceptable (we learn). Failing twice for the same reason is a **governance violation** (we didn't learn).

---

## 2. Constitutional Authority

This doctrine derives supreme authority from and integrates with:

- **BUILD_PHILOSOPHY.md** - One-Time Build Law, compulsory learning, zero regression
- **BYG_DOCTRINE.md** - Build-to-Green philosophy, failure semantics
- **LEARNING_INTAKE_AND_PROMOTION_MODEL.md** - Mandatory learning promotion to governance
- **FAILURE_PROMOTION_RULE.md** - Governance update requirements for failures
- **IN_BETWEEN_WAVE_RECONCILIATION.md** - Post-wave learning and governance improvement
- **STOP_AND_FIX_DOCTRINE.md** - Immediate remediation and zero tolerance
- **BOOTSTRAP_EXECUTION_LEARNINGS.md** - Bootstrap learnings model (BL entries)

**Integration Principle**: "We Only Fail Once" is the **binding constraint** that transforms learning intake from advisory to mandatory.

---

## 3. Core Principles

### 3.1 Failure-Once Philosophy

**Principle**: Every failure is an opportunity to improve governance. The FIRST occurrence is learning. The SECOND occurrence is a governance defect.

**Definition of Failure**:
- ❌ QA test failure (RED test)
- ❌ Build error (compilation, linking, packaging)
- ❌ PR gate failure (governance, quality, security)
- ❌ Governance violation detected
- ❌ Execution halt or escalation
- ❌ Rework required after handover
- ❌ Unanticipated issue during execution
- ❌ Near-miss (almost failed but caught)
- ❌ Manual intervention required
- ❌ Workaround needed to proceed

**Rationale**:
- First failure = **Learning** (we discover a gap)
- Second identical failure = **Governance failure** (we failed to prevent recurrence)
- Allowing repeat failures creates systemic weakness
- Governance that doesn't evolve from failures is incomplete governance

### 3.2 Mandatory Structural Change

**Principle**: Every failure requiring governance promotion MUST result in structural change to governance, not just documentation.

**Structural Change Defined**:
- ✅ New governance canon file created
- ✅ Existing canon updated with new rules
- ✅ New PR gate added or strengthened
- ✅ Agent contract updated with new prohibition
- ✅ Schema or template updated
- ✅ Enforcement mechanism added (CI check, script, validation)
- ✅ Checklist or protocol updated
- ✅ Bootstrap learning (BL) entry created with governance impact

**NOT Structural Change** (FORBIDDEN):
- ❌ "Known issue" documented in README
- ❌ Verbal reminder to "be careful next time"
- ❌ Slack/chat message warning others
- ❌ Comment in code explaining the issue
- ❌ Personal note in agent memory without canon update
- ❌ "We'll remember for next time"

**Rationale**: Non-structural changes are ephemeral and don't prevent recurrence. Only canonical governance changes are enforceable and auditable.

### 3.3 Recurrence is Governance Violation

**Principle**: If a failure occurs for the SECOND time with identical root cause, this is a **GOVERNANCE VIOLATION** requiring immediate escalation and governance review.

**Recurrence Detection**:
- Same error pattern (compilation error, test failure pattern, gate failure)
- Same root cause (missing rule, ambiguous guidance, incomplete checklist)
- Same agent behavior (repeated mistake despite previous correction)
- Same execution pattern (same workflow failure)

**When Recurrence Detected**:
1. **STOP**: Halt execution immediately
2. **ANALYZE**: Determine why governance update from first failure was insufficient
3. **ESCALATE**: Escalate to CS2 with:
   - First failure record (BL/FL-CI entry)
   - Governance change made from first failure
   - Evidence that second failure occurred despite governance change
   - Root cause analysis of governance inadequacy
4. **STRENGTHEN**: Make governance change stronger, more explicit, more enforceable
5. **VALIDATE**: Verify new governance prevents recurrence
6. **DOCUMENT**: Record as governance defect with RCA

**Recurrence Response Authority**:
- ✅ FM MUST detect recurrence and escalate
- ✅ governance-repo-administrator MUST analyze governance inadequacy
- ✅ CS2 MUST approve strengthened governance
- ❌ Recurrence MAY NOT be dismissed as "different enough"
- ❌ Recurrence MAY NOT be ignored as "rare"

---

## 4. Failure Classification and Promotion

### 4.1 Failure Classification

Every failure MUST be classified to determine promotion path:

#### Tier-0 (Constitutional)
- **Definition**: Failure reveals constitutional gap (fundamental governance principle missing)
- **Example**: "Build can proceed without architecture" → missing constitutional rule
- **Promotion Target**: Tier-0 canon file in maturion/
- **Authority**: CS2 (ARC approval required)

#### Tier-1 (Policy/Canon)
- **Definition**: Failure reveals policy gap (execution rule missing or incomplete)
- **Example**: "Builder accepted partial QA" → missing enforcement rule
- **Promotion Target**: Tier-1 canon file in governance/canon/
- **Authority**: CS2 (governance-repo-administrator can propose)

#### Bootstrap Learning (BL)
- **Definition**: Failure during bootstrap phase reveals execution gap
- **Example**: "FM couldn't track progress without canonical artifact" → BL-XXX
- **Promotion Target**: BOOTSTRAP_EXECUTION_LEARNINGS.md
- **Authority**: FM (documented), CS2 (validated)
- **Note**: BL entries often lead to Tier-1 canon creation

#### FL-CI (Failure/Continuous Improvement)
- **Definition**: Execution-level failure requiring immediate fix but not governance change
- **Example**: "Test failed due to typo in assertion"
- **Promotion Target**: FL-CI record in wave reconciliation report
- **Authority**: FM or Builder
- **Note**: FL-CI does NOT require governance promotion unless pattern emerges

### 4.2 Promotion Decision Tree

```
Failure Detected
  ↓
Does it reveal governance gap?
  ├─ NO → FL-CI record, immediate fix, no promotion
  └─ YES → Continue to classification
             ↓
       Constitutional gap?
         ├─ YES → Tier-0 promotion (ARC approval)
         └─ NO → Continue
                  ↓
            Policy/execution gap?
              ├─ YES → Tier-1 promotion OR BL entry
              └─ NO → FL-CI record only
```

**Mandatory Promotion Triggers** (governance promotion REQUIRED):
- ❌ Same failure type occurred before (recurrence)
- ❌ Failure caused by missing governance rule
- ❌ Failure caused by ambiguous governance guidance
- ❌ Failure caused by unenforced invariant
- ❌ Failure caused by incomplete checklist/protocol
- ❌ Failure caused by missing PR gate
- ❌ Failure reveals systemic governance gap

**Optional Promotion** (case-by-case):
- ⚠️ One-off execution error with no governance gap
- ⚠️ Environmental issue (infrastructure, external dependency)
- ⚠️ Human error with no governance prevention possible

---

## 5. Learning Promotion Workflow

### 5.1 Immediate Response (STOP-AND-FIX)

When failure detected:
1. **STOP**: Halt execution per STOP_AND_FIX_DOCTRINE.md
2. **ASSESS**: Determine root cause and governance gap
3. **FIX**: Remediate immediate issue
4. **CLASSIFY**: Determine failure type (Tier-0, Tier-1, BL, FL-CI)
5. **DECIDE**: Promote to governance? (Use decision tree Section 4.2)

### 5.2 Governance Promotion (If Required)

If governance promotion required:
1. **DOCUMENT**: Create BL/FL-CI entry with full context
2. **PROPOSE**: Draft governance change (new canon, updated canon, new gate)
3. **REVIEW**: Submit to CS2 for review (if Tier-0/Tier-1) OR governance-repo-administrator (if BL→Canon)
4. **IMPLEMENT**: Create/update canonical governance file
5. **RIPPLE**: Propagate changes to agent contracts, consumer repos (per GOVERNANCE_RIPPLE_CHECKLIST_PROTOCOL.md)
6. **VALIDATE**: Verify new governance prevents recurrence
7. **LINK**: Reference governance change in original failure record

### 5.3 Promotion Enforcement

**Mandatory Requirements**:
- ✅ Failure record MUST include governance promotion decision
- ✅ If promoted, failure record MUST link to governance PR/issue
- ✅ Governance promotion CANNOT be deferred "for later"
- ✅ Promotion MUST occur before wave closure (if during wave execution)
- ✅ Promotion MUST occur during IBWR (if discovered at wave end)

**Enforcement Mechanisms**:
- ✅ FAILURE_PROMOTION_RULE.md enforces governance link requirement
- ✅ IBWR blocks next wave until governance promotion complete
- ✅ Wave closure certification CANNOT be issued with unresolved governance promotion
- ✅ CI gates check for GOVERNANCE_UPDATE_REQUIRED: YES without evidence link

---

## 6. Recurrence Prevention Mechanisms

### 6.1 Preventative Controls

To prevent recurrence, governance changes MUST include one or more:

1. **Explicit Rule**: Canonical prohibition or requirement
   - Example: "FM MUST complete pre-auth checklist before wave authorization"

2. **Automated Gate**: CI check, script, or validation
   - Example: Pre-auth checklist validator script in PR gate

3. **Checklist Item**: Required verification step
   - Example: "[ ] Pre-auth checklist complete and verified" in wave planning template

4. **Schema Enforcement**: Structural constraint in template or schema
   - Example: WAVE_IMPLEMENTATION_PROGRESS.schema.md requires artifact index

5. **Agent Contract Update**: Explicit guidance or prohibition in agent contract
   - Example: "FM MUST NOT authorize wave without QA Catalog alignment"

6. **Template Update**: Default template includes prevention
   - Example: WAVE_IMPLEMENTATION_PROGRESS.template.md includes artifact index section

### 6.2 Detective Controls

To detect recurrence quickly if prevention fails:

1. **Pattern Matching**: CI checks for repeated error patterns
2. **Failure Correlation**: Compare current failure to BL/FL-CI history
3. **Escalation Triggers**: Automatic CS2 notification on recurrence detection
4. **Audit Trails**: Complete failure history for pattern analysis

---

## 7. "We Only Fail Once" in Practice

### 7.1 Bootstrap Phase Example

**First Occurrence** (BL-001):
- **Failure**: FM attempted to authorize wave without completed QA Catalog
- **Classification**: Bootstrap Learning (BL-001)
- **Response**:
  - Stop execution
  - Create BL-001 entry documenting gap
  - Promote to Tier-1 canon: Create FM_PREAUTH_CHECKLIST_CANON.md
  - Add QA Catalog alignment as checklist item
  - Update FM agent contract to reference checklist
  - Validate checklist prevents recurrence
- **Result**: Structural governance change prevents recurrence

**Second Occurrence** (GOVERNANCE VIOLATION):
- **Failure**: FM attempts wave authorization without QA Catalog alignment AGAIN
- **Classification**: Governance violation (recurrence)
- **Response**:
  - STOP and escalate to CS2 immediately
  - Analyze why FM_PREAUTH_CHECKLIST_CANON.md was insufficient
  - Strengthen governance:
    - Add CI gate enforcing QA Catalog alignment
    - Make checklist validation mandatory (not advisory)
    - Add explicit prohibition in FM_ROLE_CANON.md
  - Record as governance defect with RCA
- **Result**: Governance strengthened, recurrence prevented going forward

### 7.2 Production Phase Example

**First Occurrence** (FL-CI):
- **Failure**: Test fails due to missing mock data
- **Classification**: FL-CI (immediate fix, no governance gap)
- **Response**:
  - Stop execution
  - Add mock data
  - Verify test passes
  - Document in FL-CI record
  - Continue execution
- **Result**: Immediate fix, no governance promotion

**Second Occurrence** (BL/Tier-1):
- **Failure**: Test fails due to missing mock data AGAIN (different test, same pattern)
- **Classification**: Now promoted to BL or Tier-1 (pattern detected)
- **Response**:
  - Recognize pattern (missing mock data recurring)
  - Promote to Tier-1 canon: Update QA_POLICY_MASTER.md
  - Add requirement: "All tests MUST have complete mock data before QA creation phase ends"
  - Add checklist item in QA creation template
  - Update builder contract to emphasize mock data completeness
- **Result**: Governance updated to prevent pattern recurrence

---

## 8. Prohibited Responses

### 8.1 Dismissal Patterns (FORBIDDEN)

When failure occurs, the following responses are STRICTLY PROHIBITED:

- ❌ "That won't happen again" (without structural change)
- ❌ "We'll remember next time" (memory fades, governance doesn't)
- ❌ "Low probability of recurrence" (any probability > 0 is unacceptable)
- ❌ "Not worth the governance overhead" (preventing recurrence is always worth it)
- ❌ "Just a one-time mistake" (all failures are learning opportunities)
- ❌ "Already documented" (documentation without enforcement is insufficient)
- ❌ "Known issue in backlog" (backlog items are not governance)
- ❌ "Will fix in future sprint" (governance promotion is immediate)

### 8.2 Deferral Patterns (FORBIDDEN)

- ❌ Deferring governance promotion "until after wave completion"
- ❌ Deferring governance promotion "until we have more examples"
- ❌ Deferring governance promotion "until next governance review"
- ❌ Creating governance ticket without immediate implementation
- ❌ Documenting issue without creating governance change

**Rationale**: Deferral guarantees recurrence. Governance promotion MUST be immediate.

---

## 9. Integration with Related Canon

| Canon File | Integration Point |
|------------|------------------|
| **LEARNING_INTAKE_AND_PROMOTION_MODEL.md** | Defines promotion decision criteria and targets |
| **FAILURE_PROMOTION_RULE.md** | Enforces governance link requirement in failure records |
| **IN_BETWEEN_WAVE_RECONCILIATION.md** | Mandates learning promotion during IBWR |
| **STOP_AND_FIX_DOCTRINE.md** | Provides immediate remediation workflow |
| **BOOTSTRAP_EXECUTION_LEARNINGS.md** | Records all BL entries from bootstrap phase |
| **BUILD_PHILOSOPHY.md** | Establishes One-Time Build Law (never fail for same reason) |
| **GOVERNANCE_RIPPLE_CHECKLIST_PROTOCOL.md** | Ensures governance changes propagate completely |
| **LEARNING_LOOP_CATEGORIES_AND_LIFECYCLE.md** | Defines BL, FL-CI, Tier-0, Tier-1 categories |

---

## 10. Success Metrics

"We Only Fail Once" doctrine is successful when:

- ✅ Zero repeat failures of identical root cause
- ✅ Every failure results in BL/FL-CI record
- ✅ Every governance-gap failure results in canon update
- ✅ Governance canon grows continuously from execution learnings
- ✅ Recurrence rate approaches zero over time
- ✅ CI gates prevent known failures automatically
- ✅ Agent contracts strengthen from failure learnings
- ✅ IBWR produces governance improvements after every wave

**Failure Indicators** (require governance review):
- ❌ Same failure occurs twice (recurrence)
- ❌ Failure occurs without BL/FL-CI record
- ❌ Governance promotion deferred or skipped
- ❌ Governance change insufficient to prevent recurrence
- ❌ Pattern emerges without governance response

---

## 11. Doctrine Compliance and Enforcement

### 11.1 Agent Responsibilities

**Foreman (FM)**:
- ✅ Detect failures during execution
- ✅ Classify failures (Tier-0, Tier-1, BL, FL-CI)
- ✅ Promote failures requiring governance updates
- ✅ Create BL/FL-CI entries with full context
- ✅ Escalate recurrence to CS2 immediately
- ✅ Block wave closure until governance promotion complete

**Builders**:
- ✅ Report failures immediately (no hiding)
- ✅ Cooperate with failure analysis
- ✅ Implement fixes per STOP-AND-FIX workflow
- ✅ Document FL-CI records for immediate fixes

**governance-repo-administrator**:
- ✅ Review promoted failures
- ✅ Create/update canonical governance files
- ✅ Execute governance ripple protocol
- ✅ Validate recurrence prevention mechanisms
- ✅ Track recurrence patterns across waves

**CS2 (Johan Ras)**:
- ✅ Approve Tier-0 constitutional changes
- ✅ Review Tier-1 canon updates
- ✅ Resolve recurrence escalations
- ✅ Validate governance strengthening
- ✅ Enforce "We Only Fail Once" doctrine compliance

### 11.2 Enforcement Mechanisms

**CI Gates**:
- ✅ Check for GOVERNANCE_UPDATE_REQUIRED: YES without governance link
- ✅ Block merge if failure promotion incomplete
- ✅ Detect repeat failure patterns

**IBWR Blocking**:
- ✅ IBWR CANNOT complete if governance promotion deferred
- ✅ Next wave CANNOT start if previous wave failures not promoted

**Wave Closure Certification**:
- ✅ FM CANNOT certify wave closure with unresolved governance promotion
- ✅ Certification requires evidence of governance updates

---

**END OF WE ONLY FAIL ONCE DOCTRINE**

**Authority**: CS2 (Johan Ras) | **Version**: 1.0.0 | **Effective**: 2026-02-08
