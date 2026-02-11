# Cross-Agent Coordination Protocol

**Version:** 1.0  
**Status:** Constitutional - Active  
**Authority:** Supreme (constitutional governance)  
**Created:** 2026-02-11  
**Ratified By:** Maturion Engineering Leadership (Johan Ras)  
**Layer-Down Status:** PUBLIC_API  
**Applies To:** All Agents, All Coordination Scenarios, All Repositories

---

## Constitutional Status

This protocol has **constitutional status** within the Maturion governance framework:

- **Authority Level:** Supreme (equivalent to OPOJD, STOP_AND_FIX_DOCTRINE, BUILD_PHILOSOPHY)
- **Scope:** All agents requiring coordination across authority or capability boundaries
- **Enforcement:** Mandatory - coordination violations are governance incidents
- **Modification:** Requires Constitutional Evolution Protocol (CEIP) or Johan's direct authorization

---

## 1. Purpose and Scope

### 1.1 Purpose

This protocol establishes the **canonical process for cross-agent coordination** when an agent encounters authority or capability boundaries during execution.

**Core Principle:** When an agent needs authority or capability beyond their boundary, they MUST coordinate with the agent who has that authority/capability rather than hand over incomplete work.

**Integration:** This protocol ensures OPOJD v2.0 compliance by providing a structured coordination mechanism that enables complete job handover even when authority/capability boundaries are encountered.

### 1.2 Scope

This protocol applies to ALL scenarios where an agent needs to:
- Access authority they don't possess (e.g., protected file modification)
- Utilize capability they lack (e.g., specialized testing, complex analysis)
- Cross repository boundaries (e.g., governance changes affecting consumer repos)
- Navigate constitutional guardrails (e.g., CS2 architecture approval)
- Obtain domain expertise (e.g., security review, performance optimization)

**Excluded:** This protocol does NOT apply to:
- Escalations for unresolvable blockers (use escalation protocol)
- Human approval requests (use CS2 or appropriate constitutional protocol)
- Emergency incidents (use incident protocol)

---

## 2. Core Principles

### 2.1 Continuous Responsibility

**Principle:** The originating agent remains **continuously responsible** for job completion throughout coordination.

**Implication:**
- Coordination is NOT a handover
- Originating agent drives coordination to completion
- Originating agent validates coordination outcome
- Originating agent integrates coordinated work
- Originating agent completes full job after coordination

**Anti-Pattern:**
```
❌ "I need X, I'm assigning this issue to agent Y"  [Abandoning responsibility]
✅ "I need X, I'm coordinating with agent Y to obtain X, then I'll complete the job"
```

### 2.2 Explicit Boundary Detection

**Principle:** Agents MUST explicitly detect and declare boundary encounters rather than proceeding incorrectly or stopping.

**Boundary Types:**

1. **Authority Boundary:** Agent lacks permission to perform required action
   - Example: Protected file modification
   - Example: Constitutional document changes
   - Example: Production deployment approval

2. **Capability Boundary:** Agent lacks skill or tool to perform required action
   - Example: Complex performance testing
   - Example: Security vulnerability assessment
   - Example: Advanced algorithm optimization

3. **Domain Boundary:** Agent lacks context or knowledge of required domain
   - Example: Business logic validation
   - Example: API contract compliance
   - Example: Platform-specific behavior

4. **Repository Boundary:** Agent needs action in different repository
   - Example: Governance ripple to consumer repo
   - Example: Cross-repo dependency update
   - Example: Shared library modification

**Detection Requirement:** Agent MUST detect boundary proactively during planning phase, not reactively after failure.

### 2.3 Coordination NOT Delegation

**Principle:** Coordination is collaborative work toward originating agent's goal, NOT delegation of responsibility.

**Coordination Characteristics:**
- ✅ Originating agent retains full job ownership
- ✅ Assisting agent provides specific authority/capability
- ✅ Originating agent integrates assistance
- ✅ Originating agent validates final result
- ✅ Originating agent completes handover

**Delegation Anti-Pattern (PROHIBITED):**
- ❌ Originating agent assigns job to another agent
- ❌ Originating agent walks away
- ❌ Assisting agent becomes job owner
- ❌ Fragmented responsibility

**Example:**
```
COORDINATION (Correct):
"I'm implementing feature X. It requires protected file Y modification. 
I'm coordinating with CS2 agent for architecture approval of my proposed changes.
Once approved, I'll implement the changes and complete feature X."

DELEGATION (Violation):
"I'm implementing feature X. It requires protected file Y modification.
I'm reassigning this issue to CS2 agent to handle it."
```

### 2.4 Context Completeness

**Principle:** Every coordination request MUST include complete context enabling the assisting agent to provide effective help.

**Required Context Elements:**
1. **Job Context:** What's the originating job and its requirements?
2. **Current State:** What's been completed so far?
3. **Boundary Encountered:** What specific boundary was hit?
4. **Assistance Needed:** What specific help is required?
5. **Verification Criteria:** How will assistance be validated?
6. **Integration Plan:** How will assistance be integrated?
7. **Timeline:** When is assistance needed?

**Insufficient Context Example (VIOLATION):**
```
❌ "I need help with performance testing"
```

**Complete Context Example (CORRECT):**
```
✅ "Implementing user authentication feature (Issue #123).
   
   Current State: Authentication logic implemented, unit tests passing.
   
   Boundary Encountered: Capability - complex performance testing required for 
   authentication under load (10K concurrent users).
   
   Assistance Needed: QA specialist to:
   1. Review my proposed performance test scenarios
   2. Guide implementation of load testing infrastructure
   3. Validate test results meet performance requirements
   
   Verification Criteria:
   - Performance tests execute successfully
   - Authentication handles 10K concurrent users
   - Response time < 200ms at p95
   
   Integration Plan: I'll implement performance tests per guidance, 
   validate results, and include in feature PR.
   
   Timeline: Need guidance within 2 hours to maintain OPOJD continuity."
```

### 2.5 Verification and Integration

**Principle:** Originating agent MUST verify coordination outcome and integrate it into complete job.

**Verification Requirements:**
- Agent MUST validate assisting agent's contribution
- Agent MUST verify contribution meets requirements
- Agent MUST test integrated result
- Agent MUST ensure no gaps introduced by coordination

**Integration Requirements:**
- Agent MUST fully integrate coordinated work
- Agent MUST resolve any conflicts or inconsistencies
- Agent MUST ensure coherent final result
- Agent MUST document coordination in evidence

---

## 3. Coordination Workflow

### 3.1 Standard Coordination Process

**Phase 1: Boundary Detection**
1. Agent performing work detects authority/capability boundary
2. Agent analyzes boundary type and assistance needed
3. Agent identifies appropriate assisting agent
4. Agent prepares coordination context

**Phase 2: Coordination Request**
5. Agent creates coordination issue or request with complete context
6. Agent notifies assisting agent (via appropriate channel)
7. Agent provides all necessary context and materials
8. Agent specifies verification criteria and timeline

**Phase 3: Collaborative Execution**
9. Assisting agent reviews request and confirms understanding
10. Assisting agent provides assistance (guidance, approval, implementation)
11. Originating agent integrates assistance
12. Both agents validate integration

**Phase 4: Completion and Documentation**
13. Originating agent verifies coordination outcome
14. Originating agent completes remaining work
15. Originating agent documents coordination in evidence
16. Originating agent completes full job handover

### 3.2 Coordination Templates

#### Template 1: Authority Coordination (CS2 Approval)

```markdown
## Coordination Request: Architecture Approval Required

**Originating Agent:** [Agent ID]
**Originating Job:** [Issue #XXX - Job description]
**Coordination Type:** Authority - CS2 Architecture Approval

### Job Context
[Complete description of the job and requirements]

### Current Progress
- [x] Requirements analyzed
- [x] Initial implementation planned
- [ ] Protected file modification needed ← **BOUNDARY**
- [ ] Implementation
- [ ] Testing
- [ ] Handover

### Boundary Encountered
**Type:** Authority Boundary  
**Specific:** Modification of protected file [filename] required  
**Authority Holder:** CS2 (Architecture Approval)

### Proposed Architecture Change
**File:** [filename]  
**Reason:** [Why this change is necessary]  
**Impact:** [What will change and why]  
**Alternatives Considered:**
1. [Alternative A] - Rejected because [reason]
2. [Alternative B] - Rejected because [reason]

**Proposed Changes:**
```diff
[Proposed diff or description]
```

### Verification Criteria
- [ ] Architecture change approved by CS2
- [ ] Change aligns with system architecture
- [ ] No negative side effects introduced
- [ ] Change properly documented

### Integration Plan
1. Receive approval from CS2
2. Implement approved changes
3. Complete testing with changes
4. Validate no architecture violations
5. Complete job handover

### Timeline
**Urgency:** [HIGH/MEDIUM/LOW]  
**Needed By:** [Timestamp]  
**Reason:** [Why this timeline matters]

### Questions for CS2
1. [Specific question 1]
2. [Specific question 2]
```

#### Template 2: Capability Coordination (Specialist Help)

```markdown
## Coordination Request: Specialist Assistance Needed

**Originating Agent:** [Agent ID]
**Originating Job:** [Issue #XXX - Job description]
**Coordination Type:** Capability - [Type of expertise needed]

### Job Context
[Complete description of the job and requirements]

### Current Progress
[What's been completed, what's remaining]

### Capability Gap Encountered
**Type:** Capability Boundary  
**Specific:** [Specific capability lacking]  
**Expertise Needed:** [What kind of specialist]

### Assistance Needed
**What I Need:**
1. [Specific help item 1]
2. [Specific help item 2]
3. [Specific help item 3]

**What I've Tried:**
1. [Research attempt 1] - Outcome: [result]
2. [Research attempt 2] - Outcome: [result]

### Proposed Approach (For Review)
[My current thinking on how to solve this]

### Verification Criteria
- [ ] [Criterion 1]
- [ ] [Criterion 2]
- [ ] [Criterion 3]

### Integration Plan
1. [How I'll apply the guidance]
2. [How I'll validate it works]
3. [How I'll complete the job]

### Specific Questions
1. [Question 1]
2. [Question 2]

### Timeline
**Needed By:** [Timestamp]  
**Current Blocker:** [What's blocked waiting for this]
```

#### Template 3: Domain Coordination (Knowledge Transfer)

```markdown
## Coordination Request: Domain Knowledge Needed

**Originating Agent:** [Agent ID]
**Originating Job:** [Issue #XXX - Job description]
**Coordination Type:** Domain Knowledge - [Domain]

### Job Context
[Complete description of the job and requirements]

### Domain Gap Encountered
**Domain:** [Specific domain]  
**Gap:** [What domain knowledge is missing]  
**Impact:** [How this affects job completion]

### Specific Knowledge Needed
1. [Knowledge item 1]
2. [Knowledge item 2]
3. [Knowledge item 3]

### Current Understanding (For Validation)
[My current understanding of the domain aspects - correct if wrong]

### Verification Criteria
- [ ] Domain constraints understood
- [ ] Implementation aligns with domain rules
- [ ] No domain violations introduced

### Integration Plan
[How I'll apply domain knowledge to complete the job]

### Questions
1. [Question 1]
2. [Question 2]
```

### 3.3 Coordination Channels

**Primary Channels:**
1. **GitHub Issues:** For substantial coordination requiring tracking and history
2. **Coordination Issues:** Tagged with `coordination` label and linked to originating issue
3. **Direct Agent Invocation:** Using task tool for immediate coordination
4. **Governance Repository:** For governance-related coordination

**Channel Selection:**
- Use **GitHub Issues** for: Architecture approvals, complex capability transfers, cross-repo coordination
- Use **Direct Invocation** for: Quick clarifications, simple guidances, immediate needs
- Use **Governance Repository** for: Canon interpretations, governance clarifications, policy questions

---

## 4. Decision Trees

### 4.1 Boundary Detection Decision Tree

```
Encounter something I can't do →
│
├─ Do I lack AUTHORITY? →
│  └─ YES → Authority Boundary
│     ├─ Protected file? → CS2 Coordination
│     ├─ Governance change? → Governance Admin Coordination
│     ├─ Production action? → Deployment Authority Coordination
│     └─ Other? → Identify authority holder → Coordinate
│
├─ Do I lack CAPABILITY? →
│  └─ YES → Capability Boundary
│     ├─ Can I learn it quickly (< 30 min)? → Research, then continue
│     ├─ Complex/specialized? → Specialist Coordination
│     └─ Tool missing? → Create/download tool OR tool specialist coordination
│
├─ Do I lack DOMAIN KNOWLEDGE? →
│  └─ YES → Domain Boundary
│     ├─ Documented somewhere? → Research, then continue
│     ├─ Requires expert? → Domain Expert Coordination
│     └─ Ambiguous? → Governance Clarification Coordination
│
└─ Outside my repository? →
   └─ YES → Repository Boundary
      ├─ Governance change → Use ripple protocol
      ├─ Dependency change → Consumer repo coordination
      └─ Shared resource → Resource owner coordination
```

### 4.2 Coordination vs Escalation Decision Tree

```
Encountered boundary →
│
├─ Can assistance enable me to complete job? →
│  └─ YES → COORDINATION (use this protocol)
│     └─ Coordinate → Integrate assistance → Complete job
│
└─ Is blocker genuinely unresolvable by any available agent? →
   └─ YES → ESCALATION (use escalation protocol)
      └─ Must have attempted all reasonable resolutions
      └─ Must provide proposed solutions
      └─ Must complete all non-blocked work
```

### 4.3 Agent Selection Decision Tree

```
Need to coordinate →
│
├─ What type of boundary?
│  │
│  ├─ Authority → Who has this authority?
│  │  ├─ Protected files → CS2 Agent
│  │  ├─ Governance → Governance-Repo-Administrator
│  │  ├─ Deployment → Foreman
│  │  └─ Other → Check governance for authority holder
│  │
│  ├─ Capability → What capability needed?
│  │  ├─ Testing expertise → QA Specialist Agent
│  │  ├─ Security expertise → Security Agent
│  │  ├─ Performance → Performance Agent
│  │  ├─ Build/tooling → Build Agent
│  │  └─ General coding → General-Purpose Agent
│  │
│  └─ Domain → What domain?
│     ├─ Business logic → Domain Expert or Product
│     ├─ Technical architecture → CS2 Agent
│     ├─ Governance interpretation → CodexAdvisor or Governance Admin
│     └─ Other → Identify domain owner
│
└─ Coordinate with identified agent
```

---

## 5. Sandbox Clarity Requirements

### 5.1 Agent Contract Sandbox Definition

**Requirement:** Every agent contract MUST clearly define the agent's sandbox (authority and capability boundaries).

**Mandatory Sandbox Elements:**

1. **Authority Boundaries**
   - What files can the agent modify?
   - What actions can the agent approve?
   - What decisions can the agent make autonomously?
   - What requires coordination?

2. **Capability Boundaries**
   - What technical capabilities does the agent have?
   - What types of problems can the agent solve?
   - What expertise does the agent lack?
   - What tools are available to the agent?

3. **Coordination Requirements**
   - What scenarios require coordination?
   - Who should the agent coordinate with?
   - What protocol should be used?

4. **Escalation Triggers**
   - What situations require escalation?
   - Who should receive escalations?
   - What format should escalations use?

**Example Sandbox Definition:**
```yaml
agent:
  id: "builder-typescript"
  
  authority:
    can_modify:
      - "src/**/*.ts"
      - "src/**/*.tsx"
      - "tests/**/*.test.ts"
      - "package.json" (dependencies only)
    cannot_modify:
      - ".github/**"
      - "governance/**"
      - "architecture/**"
    coordination_required:
      - protected_files: "CS2 Agent"
      - package.json (scripts): "Build Agent"
  
  capability:
    has:
      - "TypeScript implementation"
      - "React component development"
      - "Unit testing"
      - "Integration testing"
    lacks:
      - "Performance testing" → Coordinate with QA
      - "Security assessment" → Coordinate with Security
      - "Complex algorithms" → Coordinate with Specialist
  
  coordination:
    architecture_changes: "CS2 Agent"
    specialized_testing: "QA Specialist"
    security_concerns: "Security Agent"
    governance_questions: "CodexAdvisor"
```

### 5.2 Coordination Outside Sandbox

**Rule:** Anything outside defined sandbox REQUIRES coordination.

**Detection:**
- Agent continuously monitors if current work is within sandbox
- Agent proactively identifies boundary crossings
- Agent initiates coordination BEFORE attempting boundary crossing

**Anti-Patterns:**
```
❌ Attempt action outside sandbox, fail, then coordinate
❌ Skip action outside sandbox, leave incomplete
❌ Ignore boundary, proceed anyway
❌ Assume boundary doesn't apply to "simple" cases
```

**Correct Pattern:**
```
✅ Detect boundary during planning
✅ Initiate coordination before attempting crossing
✅ Wait for coordination outcome
✅ Integrate outcome and continue
✅ Complete job fully
```

---

## 6. Integration with OPOJD

### 6.1 Coordination Enables Complete Handover

**Principle:** Coordination is the mechanism that enables OPOJD v2.0 complete handover when boundaries encountered.

**Without Coordination:**
```
Agent hits boundary → Cannot proceed → Incomplete handover (VIOLATION)
```

**With Coordination:**
```
Agent hits boundary → Coordinates → Obtains assistance → Proceeds → Complete handover (COMPLIANT)
```

### 6.2 Coordination Timeline

**OPOJD v2.0 Requirement:** Coordination MUST NOT become excuse for infinite delays.

**Timeline Expectations:**
- **Authority Coordination:** < 4 hours for CS2 approval (typical case)
- **Capability Coordination:** < 2 hours for specialist guidance
- **Domain Coordination:** < 1 hour for clarifications

**If Timelines Exceeded:**
- Agent MUST escalate delay as blocker
- Agent MUST provide proposed alternatives
- Agent MUST complete all non-blocked work
- Agent MUST maintain OPOJD continuity principles

### 6.3 Coordination Evidence

**Requirement:** All coordination MUST be documented in evidence bundle.

**Documentation Required:**
- Boundary encountered (type, specific details)
- Coordination request (full context)
- Assisting agent response
- Integration actions taken
- Verification results
- Timeline and duration

**Evidence Purpose:**
- Audit trail for complete handover validation
- Learning for future boundary scenarios
- Metrics for coordination efficiency
- Governance improvement input

---

## 7. Learning and Improvement

### 7.1 Coordination as Learning Opportunity

**Principle:** Every coordination is an opportunity to improve agents, processes, or governance.

**Learning Capture Requirements:**

After coordination, originating agent MUST document:

1. **Boundary Analysis**
   - Why wasn't this boundary detected earlier?
   - Could this boundary be eliminated?
   - Should sandbox be adjusted?

2. **Process Efficiency**
   - Was coordination smooth?
   - What slowed down coordination?
   - How could coordination be faster?

3. **Knowledge Transfer**
   - What was learned from assisting agent?
   - Can this knowledge be codified in agent contract?
   - Should training materials be updated?

4. **Capability Gaps**
   - Should originating agent gain this capability?
   - Is this capability needed frequently?
   - Should tooling be created?

5. **Governance Gaps**
   - Was coordination protocol clear?
   - Were roles/responsibilities clear?
   - Should governance be updated?

### 7.2 Improvement Promotion

**Requirement:** Coordination learnings MUST be promoted to governance/training.

**Promotion Process:**
1. Agent documents coordination learning
2. Agent tags learning for governance review
3. Governance reviews for patterns
4. If pattern detected (3+ similar coordinations):
   - Update agent contracts to include capability
   - Create tooling to automate
   - Update governance to clarify boundary
   - Add training materials

**Examples:**
- If 5 agents coordinate with QA for same performance testing → Create performance testing tool/template
- If agents repeatedly coordinate for same governance clarification → Update governance to be clearer
- If capability coordination common → Add capability to base agent contract

### 7.3 Coordination Metrics

**Tracked Metrics:**
1. **Coordination Frequency:** # coordinations per 100 jobs
   - Target: < 20 (most work within sandbox)
2. **Coordination Time:** Average time from request to resolution
   - Target: < 2 hours
3. **Coordination Success Rate:** % coordinations resulting in successful completion
   - Target: > 98%
4. **Repeat Coordination Rate:** % coordinations on same boundary type
   - Target: < 5% (learning should reduce repeats)

---

## 8. Enforcement and Compliance

### 8.1 Violation Categories

**Critical Violations:**
- Boundary crossing without coordination
- Incomplete job due to coordination failure
- Context-free coordination request
- Abandoning job during coordination (delegation anti-pattern)

**Serious Violations:**
- Insufficient coordination context
- Late boundary detection (reactive not proactive)
- Coordination without verification
- Missing coordination documentation

**Minor Violations:**
- Slow coordination response
- Suboptimal coordination channel
- Incomplete learning capture

### 8.2 Compliance Validation

**Pre-Handover Validation:**
- [ ] All boundaries encountered identified
- [ ] All boundaries coordinated properly
- [ ] All coordination outcomes integrated
- [ ] All coordination documented in evidence
- [ ] All learnings captured

**Post-Handover Audit:**
- Review coordination requests for completeness
- Verify coordination enabled job completion
- Validate originating agent maintained ownership
- Check learning was captured and promoted

### 8.3 Coordination Quality Standards

**High-Quality Coordination:**
- ✅ Complete context provided upfront
- ✅ Specific questions asked
- ✅ Clear verification criteria
- ✅ Timely response from both parties
- ✅ Successful integration
- ✅ Complete documentation
- ✅ Learning captured

**Low-Quality Coordination (Requires Improvement):**
- ❌ Vague "need help" request
- ❌ Missing context
- ❌ Unclear what's needed
- ❌ Slow back-and-forth
- ❌ Integration failures
- ❌ Poor documentation
- ❌ No learning captured

---

## 9. Examples and Scenarios

### 9.1 Example: Authority Boundary (CS2)

**Scenario:** Builder needs to modify protected governance file

**Coordination Flow:**
1. **Detection:** Builder identifies governance file modification needed during planning
2. **Boundary Recognition:** Governance files are protected (CS2 authority)
3. **Coordination Request:** Builder creates CS2 coordination issue with:
   - Complete job context
   - Why governance change needed
   - Proposed change with rationale
   - Alternatives considered
   - Impact analysis
4. **CS2 Review:** CS2 agent reviews proposal, asks clarifying questions
5. **Approval:** CS2 approves with minor modifications
6. **Integration:** Builder implements approved changes
7. **Verification:** Builder validates changes work as intended
8. **Completion:** Builder completes full job including governance change
9. **Documentation:** Builder documents coordination in evidence

**Outcome:** ✅ Complete job handover via authority coordination

### 9.2 Example: Capability Boundary (Performance Testing)

**Scenario:** Builder needs complex performance testing expertise

**Coordination Flow:**
1. **Detection:** Builder identifies performance testing needed during planning
2. **Self-Assessment:** Builder recognizes lack of performance testing expertise
3. **Research:** Builder spends 20 minutes researching basics
4. **Decision:** Complexity requires specialist (e.g., load testing under 10K users)
5. **Coordination Request:** Builder creates coordination request with:
   - Feature context
   - Performance requirements
   - Proposed test approach (for review)
   - Specific questions
6. **QA Response:** QA specialist provides:
   - Test approach validation/corrections
   - Tool recommendations
   - Example test structure
   - Success criteria
7. **Integration:** Builder implements tests per guidance
8. **Verification:** QA specialist reviews implemented tests
9. **Completion:** Builder completes feature with performance tests
10. **Documentation:** Builder documents coordination and learning

**Outcome:** ✅ Complete job handover via capability coordination

### 9.3 Example: Domain Boundary (Business Logic)

**Scenario:** Builder unclear on business rule validation

**Coordination Flow:**
1. **Detection:** Builder encounters ambiguous business rule during implementation
2. **Research:** Builder checks documentation (incomplete)
3. **Coordination Request:** Builder asks domain expert:
   - Feature context
   - Specific business rule question
   - Current understanding (for validation)
   - Proposed implementation approaches
4. **Expert Response:** Domain expert clarifies:
   - Correct business rule interpretation
   - Edge cases to handle
   - Validation requirements
5. **Integration:** Builder implements per clarification
6. **Verification:** Builder validates with domain expert
7. **Completion:** Builder completes feature correctly
8. **Documentation:** Builder documents coordination + documents business rule for future (improvement)

**Outcome:** ✅ Complete job handover + governance improved with documented business rule

### 9.4 Example: Gate Validation Failure (Coordinate with FM)

**Scenario:** Builder encounters merge gate validation failure that cannot be self-resolved

**Coordination Flow:**
1. **Detection:** Builder runs pre-handover gate validation per MERGE_GATE_PHILOSOPHY v2.0
2. **Failure:** Gate script `validate-deprecated-apis.sh` exits with code 1
3. **Analysis:** Builder reviews error: "Error: grep: invalid option -- 'E'"
4. **Self-Resolution Attempt 1:** Builder checks script syntax, finds grep usage issue
5. **Self-Resolution Attempt 2:** Builder attempts local script fix, tests, but uncertain if fix is correct
6. **Decision:** Gate script bug requires FM coordination (FM owns gate management per FM_MERGE_GATE_MANAGEMENT_PROTOCOL.md)
7. **Coordination Request:** Builder creates coordination issue with:
   - Job context: "Implementing feature X, need to pass deprecation gate"
   - Gate script: `.github/scripts/validate-deprecated-apis.sh`
   - Error encountered: Full error output from script
   - Self-resolution attempts: "Tried fixing grep syntax, uncertain if fix matches intent"
   - Proposed fix: Specific grep syntax correction with rationale
   - Urgency: HIGH (blocking PR handover per OPOJD v2.0)
   - Current state: "All other gates GREEN, only this gate blocking handover"
8. **FM Response:** FM reviews coordination request
   - Validates proposed fix aligns with gate intent
   - Approves fix with minor modification
   - Updates gate script
   - Confirms fix addresses issue
9. **Builder Re-Validation:** Builder re-runs gate script
   - Command: `.github/scripts/validate-deprecated-apis.sh`
   - Exit code: 0 (SUCCESS)
   - Documents re-validation in PREHANDOVER_PROOF
10. **Completion:** Builder completes job with all gates validated
11. **Documentation:** Builder documents coordination and gate fix in evidence

**Outcome:** ✅ Complete job handover via FM coordination for gate fix + Gate improved for all future PRs

**Key Points:**
- Builder maintained job ownership throughout coordination
- Builder did NOT hand over incomplete work
- FM fixed gate within authority (gate management)
- Builder re-validated after fix before handover
- Compliance with OPOJD v2.0, MERGE_GATE_PHILOSOPHY v2.0, Ignorance Prohibition

---

## 10. Version History

**v1.1 (2026-02-11):**
- Added Example 9.4: Gate Validation Failure coordination with FM
- Integrated with MERGE_GATE_PHILOSOPHY v2.0 gate validation mandate
- Added cross-reference to FM_MERGE_GATE_MANAGEMENT_PROTOCOL.md
- Authority: Aligned with MERGE_GATE_PHILOSOPHY v2.0 (Issue #[TBD])

**v1.0 (2026-02-11):**
- Initial Cross-Agent Coordination Protocol
- Defined coordination vs delegation distinction
- Established boundary detection requirements
- Created coordination templates and decision trees
- Integrated with OPOJD v2.0 complete handover mandate
- Defined sandbox clarity requirements
- Established learning and improvement requirements
- Created enforcement mechanisms

---

## 11. Authority Statement

This protocol is ratified under the authority of:
- Maturion Engineering Leadership (Johan Ras)
- Constitutional status: ACTIVE
- Enforcement: MANDATORY
- Modification: Requires CEIP or Johan authorization

This protocol operates alongside and reinforces:
- **OPOJD_COMPLETE_JOB_HANDOVER_DOCTRINE.md** (complete handover mandate)
- **AGENT_IGNORANCE_PROHIBITION_DOCTRINE.md** (ban on ignorance excuses)
- **STOP_AND_FIX_DOCTRINE.md** (zero tolerance for defects)
- **Agent Contract Management Protocols** (sandbox definitions)

**Status:** ACTIVE AND ENFORCED

---

## 12. Cross-References

**Related Governance:**
- `governance/opojd/OPOJD_COMPLETE_JOB_HANDOVER_DOCTRINE.md` (complete handover)
- `governance/agent/AGENT_IGNORANCE_PROHIBITION_DOCTRINE.md` (ignorance prohibition)
- `governance/canon/MERGE_GATE_PHILOSOPHY.md` v2.0 (pre-handover gate validation mandate)
- `governance/canon/FM_MERGE_GATE_MANAGEMENT_PROTOCOL.md` (FM gate management authority)
- `governance/canon/AGENT_CONTRACT_MANAGEMENT_PROTOCOL.md` (contract management)
- `governance/canon/AGENT_CONTRACT_PROTECTION_PROTOCOL.md` (CS2 authority)
- `governance/canon/EVIDENCE_ARTIFACT_BUNDLE_STANDARD.md` (evidence requirements)
- `governance/canon/STOP_AND_FIX_DOCTRINE.md` (defect responsibility)

**Implementation Requirements:**
- Agent contracts MUST define sandbox boundaries
- Merge gates MUST validate coordination documentation
- Gate validation failures MUST trigger FM coordination (not incomplete handover)
- Evidence bundles MUST include coordination records
- Governance metrics MUST track coordination efficiency

---

*Cross-Agent Coordination Protocol is now the constitutional standard for navigating authority and capability boundaries.*
