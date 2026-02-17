# ESCALATION POLICY

## Status
**Type**: Tier-1 Constitutional Canon  
**Authority**: Supreme - Constitutional  
**Version**: 3.0.0  
**Effective Date**: 2026-02-17  
**Owner**: Maturion Engineering Leadership (Johan Ras)  
**Layer-Down Status**: PUBLIC_API  
**Applies To**: All Agents, All Builders, All Foreman Instances, All Work, All Repositories  
**Supersedes**: `governance/escalation/ESCALATION_POLICY.md` (model-focused v1.0)

---

## 1. Purpose

This policy establishes the **canonical escalation hierarchy, triggers, procedures, and authority chain** for the Maturion ecosystem.

Escalation is a **governed mechanism for resolving issues beyond agent capability, authority, or cognitive capacity**. It ensures:
- **Correct authority level** addresses each issue type
- **Systematic resolution** of blockers and conflicts
- **Proactive complexity awareness** prevents silent failures
- **Model-appropriate cognitive capability** matches task complexity
- **Audit trail and learning** from all escalations
- **Safety and governance** maintained through authority boundaries

**Critical Principle**: Escalation is **NOT failure**—it is appropriate use of the authority hierarchy when issues exceed agent capability, authority, or cognitive limits.

---

## 2. Constitutional Authority

This policy derives supreme authority from and integrates with:

- **GOVERNANCE_PURPOSE_AND_SCOPE.md** - Governance as canonical memory and control system
- **FOREMAN_AUTHORITY_AND_SUPERVISION_MODEL.md** - FM supervisory authority and POLC model
- **STOP_AND_FIX_DOCTRINE.md** - Zero tolerance for defects, remediation escalation paths
- **COGNITIVE_CAPABILITY_ORCHESTRATION_MODEL.md** - Capability-aware complexity assessment
- **SELF_ALIGNMENT_AUTHORITY_MODEL.md** - Self-alignment boundaries and CS2 escalation
- **PR_GATE_EVALUATION_AND_ROLE_PROTOCOL.md** - Gate failure escalation procedures
- **FM_RUNTIME_ENFORCEMENT_AND_AWARENESS_MODEL.md** - FM escalation semantics
- **GOVERNANCE_BUILDER_SUBMISSION_SURVEY.md** - Builder escalation rules
- **WATCHDOG_AUTHORITY_AND_SCOPE.md** - Independent oversight and escalation authority

---

## 3. Escalation Hierarchy

### 3.1 Four-Level Authority Model

The Maturion ecosystem operates on a **four-level escalation hierarchy**:

| Level | Authority | Primary Role | Cognitive Model Class | Escalation Scope |
|-------|-----------|--------------|----------------------|------------------|
| **L1: Builder** | Builder agents | Implementation execution | Haiku/GPT-4o-mini (routine work) | Implementation defects, test failures, build failures, transient issues |
| **L2: Foreman (FM)** | FM orchestration agent | Supervision, coordination, QA design | Sonnet 4.5/GPT-4o (coordination + oversight) | Architecture failures, QA design failures, builder coordination failures, governance interpretation |
| **L3: Codex / Governance Administrator / Watchdog** | Independent oversight agents | Governance mutation, constitutional validation, quality integrity | Opus/o1/Gemini Pro (deep reasoning, governance analysis) | Governance defects, gate logic defects, canonical contradictions, constitutional analysis |
| **L4: Human (Johan Ras)** | Final human authority | Strategic decisions, constitutional changes, emergency authority | Human + Highest AI models (strategic synthesis) | Governance ambiguity, architectural classification, release authority, emergency situations |

**Authority Principle**: The **overseeing intelligence must be at least one level higher** than the implementing intelligence. No layer may approve itself.

---

### 3.2 Escalation Path Flows

**L1 → L2**: Builder to Foreman
- Builder encounters issue beyond implementation authority
- Builder escalates to FM for coordination, architecture clarification, or governance interpretation
- FM provides resolution or escalates upward

**L2 → L3**: Foreman to Codex/Governance Administrator/Watchdog
- FM encounters governance structural issue
- FM escalates to independent oversight for constitutional validation
- Codex/GA/Watchdog provides governance mutation or escalates to human

**L3 → L4**: Codex/GA/Watchdog to Human
- Constitutional ambiguity or strategic decision required
- CS2 (Codex Supervision Level 2 - Human) provides final authority
- Human resolves with strategic judgment and constitutional interpretation

**Direct Escalation to L4**: Any level may escalate directly to human for:
- Security vulnerabilities requiring immediate action
- Catastrophic failures (UNAUTHORIZED_ACTION, data loss risk)
- Emergency situations requiring human judgment
- Time-critical production issues

---

## 4. Escalation Triggers

### 4.1 Proactive Escalation (Complexity-Aware)

Escalate **before** execution when:

1. **Cognitive Capacity Exceeded**
   - Task complexity exceeds available cognitive capability (FM assesses during planning)
   - Cognitive saturation detected (agent recognizes inability to reason effectively)
   - Architectural complexity beyond current model capacity (multi-layer integration, high ambiguity)
   - No suitable capability class available for task requirements

2. **Authority Boundary Reached**
   - Required action outside documented authority scope
   - Constitutional canon semantic changes needed
   - Protected file modifications required
   - Agent contract changes needed
   - Precedent-setting decisions required

3. **Strategic/Governance Decisions**
   - Multiple valid governance interpretations exist
   - Governance gap or ambiguity discovered
   - Constitutional conflict detected
   - Cross-agent authority conflicts
   - Strategic architectural decisions needed

**Proactive escalation is expected behavior** and indicates healthy governance awareness.

---

### 4.2 Reactive Escalation (Failure-Based)

Escalate **after** failures occur when:

1. **Technical Failures**
   - Repeated CI failures without clear cause (3+ attempts)
   - Build errors persisting after remediation attempts
   - Test failures with unclear root cause
   - Infrastructure failures blocking progress
   - Unrecoverable errors detected

2. **Governance/Gate Failures**
   - Governance deadlock (merge blocked by phase mismatch)
   - Gate evaluation produces ERROR status
   - Contradictory gate results detected
   - Ambiguous gate requirements detected
   - Agent cannot determine applicable gate requirements

3. **Quality/Architectural Issues**
   - Architecture ambiguity or contradictions
   - Zero Test Debt cannot be achieved (systemic issue)
   - Test infrastructure fundamentally broken
   - Repeated regressions or unstable behavior
   - QA suite itself has defects

4. **Coordination/Authority Issues**
   - Builder fails 3+ times on same task
   - Builder violates governance repeatedly
   - Cross-repo changes required
   - Conflicting instructions
   - Unclear scope boundaries

5. **Security/Safety Concerns**
   - Security vulnerabilities discovered
   - Permissions uncertainty
   - Data loss risk detected
   - Safety violations
   - Compliance issues

**Reactive escalation indicates system strengthening is needed** below the escalation level.

---

### 4.3 Stop-and-Fix Escalation

Escalate **during Stop-and-Fix remediation** when:

1. **Capability Limits**
   - Unresolvable issue requiring domain expertise agent lacks
   - Root cause investigation exceeds reasonable time (> 4 hours)
   - Multiple fix attempts failed without resolution

2. **Authority Limits**
   - Issue requires changing code/architecture outside agent authority
   - Governance policy interpretation needed
   - Constitutional decision required

3. **External Blockers**
   - Issue caused by external system, tool, or infrastructure failure
   - External dependency unavailable
   - Third-party service blocking progress

**Stop-and-Fix Escalation Requirements**:
- Provide complete issue description and reproduction steps
- Document investigation summary and root cause hypothesis
- Ensure work is in SAFE state (no broken builds, no data loss risk)
- Commit work-in-progress on feature branch
- Tag escalation: "STOP-AND-FIX ESCALATION - Requires [Level] Intervention"
- Wait for guidance before proceeding

**Stop-and-Fix escalation is NOT failure**—it is appropriate use of escalation path when remediation exceeds agent capability or authority.

See: `governance/canon/STOP_AND_FIX_DOCTRINE.md` Section 5

---

### 4.4 Level-Specific Escalation Triggers

#### L1: Builder Escalation Triggers

Builders MUST escalate to Foreman (L2) when:

**Authority and Instruction Issues**:
- Ambiguous instruction received
- Conflicting instructions
- Instruction violates governance
- Unclear scope boundaries
- Required action outside declared scope

**Architecture Issues**:
- Architecture missing for assigned task
- Architecture incomplete (gaps in specification)
- Architecture contradictory
- Architecture unimplementable
- Architecture mismatch during implementation

**Governance Issues**:
- Governance rules conflict
- Required action violates governance
- Protected path modification required
- Scope boundary exceeded
- Constitutional safeguard triggered (CS1-CS6)

**Technical Issues**:
- Critical dependency unavailable
- Required tool/service unavailable
- 3+ consecutive QA failures on same module
- Unrecoverable error detected
- Infrastructure failure blocking progress

**Quality Issues**:
- Zero Test Debt cannot be achieved (systemic issue)
- Test infrastructure fundamentally broken
- QA suite itself has defects

See: `governance/canon/GOVERNANCE_BUILDER_SUBMISSION_SURVEY.md` Section 11.2

---

#### L2: Foreman Escalation Triggers

Foreman MUST escalate to Codex/Governance Administrator/Watchdog (L3) when:

**Governance Structural Issues**:
- Constitutional violations detected
- Canonical contradictions discovered
- Governance defects requiring canon mutation
- Gate logic defects or errors
- Governance policy conflicts

**Quality Integrity Issues**:
- Repeated builder failures indicating systemic governance gap
- QA design failures at architectural level
- Builder contract issues requiring governance change
- Pattern of failures indicating governance weakness

**Cognitive Capacity Issues**:
- Task complexity requires deeper reasoning than available (Sonnet → Opus/o1)
- Constitutional analysis required
- Multi-layer governance integration analysis
- Strategic governance synthesis needed

See: `governance/canon/FM_RUNTIME_ENFORCEMENT_AND_AWARENESS_MODEL.md` Section 8.2

---

#### L3: Codex/Governance Administrator Escalation Triggers

Codex/GA/Watchdog MUST escalate to Human (L4) when:

**Constitutional Ambiguity**:
- Multiple valid governance interpretations exist
- Governance gap requires constitutional decision
- Conflicting governance directives
- Missing governance coverage for scenario
- Authority boundary conflicts

**Strategic Decisions**:
- Governance changes affecting multiple systems
- Precedent-setting policy decisions
- Architectural classification requiring strategic judgment
- Release authority decisions
- Emergency merge authority

**Security/Safety Critical**:
- Security vulnerabilities requiring immediate human judgment
- Catastrophic failures (UNAUTHORIZED_ACTION, data loss)
- Compliance violations with regulatory consequences
- Emergency situations requiring human authority

See: `governance/canon/SELF_ALIGNMENT_AUTHORITY_MODEL.md` Section 6.1

---

## 5. Model-Specific Cognitive Escalation

### 5.1 Model Capability Tiers

Cognitive model selection MUST match task complexity:

**Tier 1: Routine Implementation (L1)**
- **Models**: Claude Haiku, GPT-4o-mini, Gemini Flash
- **Suitable For**: Standard implementation tasks, documented patterns, routine testing
- **Escalate When**: Task requires architectural reasoning, multi-file coordination, governance interpretation

**Tier 2: Coordination & Oversight (L2)**
- **Models**: Claude Sonnet 4.5, GPT-4o, Gemini 1.5 Pro
- **Suitable For**: Architecture design, QA design, builder supervision, governance interpretation
- **Escalate When**: Deep constitutional analysis needed, strategic synthesis required, cognitive overload detected

**Tier 3: Deep Reasoning & Governance (L3)**
- **Models**: Claude Opus, OpenAI o1, Gemini Pro 1.5 Advanced
- **Suitable For**: Constitutional analysis, governance mutation, strategic reasoning, complex multi-system integration
- **Escalate When**: Human strategic judgment required, constitutional ambiguity exists, emergency authority needed

**Tier 4: Human + Highest AI (L4)**
- **Models**: Human judgment + any AI model as advisory
- **Suitable For**: Strategic decisions, constitutional changes, emergency authority, final resolution

---

### 5.2 Sonnet → Opus/o1 Escalation (L2 → L3)

**When Foreman (L2 Sonnet) MUST escalate to L3 (Opus/o1)**:

1. **Cognitive Overload**
   - Task complexity exceeds Sonnet's effective reasoning capacity
   - Multiple governance layers requiring deep integration analysis
   - Constitutional contradictions requiring synthesis
   - Strategic architectural decisions with high uncertainty

2. **Governance Complexity**
   - Constitutional canon analysis required
   - Governance mutation with multi-system impact
   - Canonical contradiction resolution
   - Policy precedent requiring deep reasoning

3. **Multi-System Synthesis**
   - Cross-repository governance integration
   - Platform-level architectural decisions
   - Multi-agent coordination requiring strategic oversight
   - Complex ripple analysis across governance layers

4. **Quality/Safety Critical Analysis**
   - RCA requiring deep causal reasoning
   - Security vulnerability analysis requiring threat modeling
   - Safety-critical system validation
   - Compliance analysis with constitutional implications

**Escalation Procedure**:
1. FM recognizes task exceeds Sonnet cognitive capacity
2. FM documents complexity assessment and escalation justification
3. FM halts execution and creates escalation document
4. FM invokes Opus/o1 capability for resolution
5. FM receives resolution and validates against governance
6. FM resumes execution with resolution guidance

**Integration**: See `governance/canon/COGNITIVE_CAPABILITY_ORCHESTRATION_MODEL.md` Section 5.4

---

### 5.3 Escalation vs. Capability Switching

**Authority Escalation**: Moving up the hierarchy (L1 → L2 → L3 → L4)
- Triggered by authority boundaries or failures
- Requires handover to higher authority level
- Previous level awaits resolution

**Capability Switching**: Selecting different cognitive capability at same level
- Foreman switches from Reasoning to Analysis capability
- Foreman switches from Coding to Security Reasoning capability
- No authority change, same level orchestrates different tools

**When to Escalate Authority** (not capability switch):
- Task requires higher oversight/approval authority
- Issue involves governance interpretation or mutation
- Decision has constitutional or strategic implications
- Multiple attempts at current level have failed

**When to Switch Capability** (not authority escalation):
- Different functional capability needed (visual generation, pedagogy)
- Same authority level, different cognitive tool
- No governance/authority implications

See: `governance/canon/COGNITIVE_CAPABILITY_ORCHESTRATION_MODEL.md` Section 5

---

## 6. Escalation Document Structure

### 6.1 Required Content

All escalations MUST include:

1. **Header**
   ```markdown
   # Escalation: [Title]
   
   **From**: [Agent Class] ([Agent ID/Name])
   **To**: [Target Authority Level]
   **Date**: YYYY-MM-DD HH:MM:SS UTC
   **Session**: [Session ID]
   **Escalation ID**: ESC-YYYYMMDD-HHMMSS-[topic]
   ```

2. **Classification**
   - **Category**: [Authority Conflict | Architecture Gap | Governance Violation | Technical Block | Cognitive Overload | Security | Emergency]
   - **Severity**: [BLOCKER | CRITICAL | HIGH | MEDIUM | LOW]
   - **Type**: [Proactive | Reactive | Stop-and-Fix]

3. **Context**
   - What operation was in progress
   - What was the intended outcome
   - What governance/canonical documents are relevant
   - What work has been completed
   - What work remains blocked

4. **Trigger**
   - Exact condition that triggered escalation
   - Specific failure, ambiguity, or complexity identified
   - Evidence of attempts made (if reactive escalation)
   - Cognitive capacity assessment (if proactive)

5. **Evidence**
   - Audit trail, logs, error messages
   - Governance references and canonical citations
   - Failure history (if reactive)
   - Complexity assessment (if proactive)
   - Current state snapshot

6. **Impact**
   - What is blocked or at risk
   - Timeline implications
   - Dependencies affected
   - Safety/security implications

7. **Options** (if agent can assess)
   - Possible resolution paths identified
   - Tradeoffs and risks for each option
   - Constraints and boundaries

8. **Recommendation** (if agent can assess)
   - Lowest-risk path forward
   - Rationale for recommendation
   - Authority needed for implementation

9. **Current State**
   - Work-in-progress status (committed, pushed, clean, dirty)
   - Safety state (GREEN, safe to pause, no data loss risk)
   - Resume instructions (what needs to happen to resume)

---

### 6.2 Escalation Document Template

```markdown
# Escalation: [Concise Title]

**From**: [L1 Builder / L2 Foreman / L3 Codex] ([Agent ID])
**To**: [L2 Foreman / L3 Governance Administrator / L4 Human]
**Date**: YYYY-MM-DD HH:MM:SS UTC
**Session**: [Session ID]
**Escalation ID**: ESC-YYYYMMDD-HHMMSS-[topic]

---

## Classification

- **Category**: [Authority Conflict | Architecture Gap | Governance Violation | Technical Block | Cognitive Overload | Security | Emergency]
- **Severity**: [BLOCKER | CRITICAL | HIGH | MEDIUM | LOW]
- **Type**: [Proactive | Reactive | Stop-and-Fix]
- **Escalation Trigger**: [Specific trigger from Section 4]

---

## Context

**Operation in Progress**:
[What were you doing when escalation was triggered?]

**Intended Outcome**:
[What was the goal?]

**Canonical References**:
- [Relevant governance documents and sections]

**Work Completed**:
- [What has been done successfully]

**Work Blocked**:
- [What cannot proceed without resolution]

---

## Trigger

**Exact Condition**:
[Precise description of what triggered escalation]

**Evidence of Trigger**:
- [Error messages, logs, governance citations]
- [Attempts made (if reactive)]
- [Complexity assessment (if proactive)]

---

## Evidence

**Audit Trail**:
[Links to logs, PR, commits, evidence artifacts]

**Governance References**:
- [Canonical document citations]
- [Specific sections and requirements]

**Failure History** (if reactive):
- Attempt 1: [description and outcome]
- Attempt 2: [description and outcome]
- Attempt 3: [description and outcome]

**Complexity Assessment** (if proactive):
- Task complexity: [assessment]
- Available cognitive capacity: [current model/capability]
- Capacity gap: [why current capacity is insufficient]

---

## Impact

**What is Blocked**:
[Specific work that cannot proceed]

**Timeline Impact**:
[Delay implications]

**Dependencies Affected**:
[Other work or systems affected]

**Safety/Security Implications**:
[Any safety or security risks]

---

## Resolution Options

### Option 1: [Description]
- **Action**: [What would be done]
- **Tradeoffs**: [Pros and cons]
- **Risk**: [Risk level and type]
- **Authority Needed**: [What authority is required]

### Option 2: [Description]
- **Action**: [What would be done]
- **Tradeoffs**: [Pros and cons]
- **Risk**: [Risk level and type]
- **Authority Needed**: [What authority is required]

---

## Recommendation

**Recommended Path**: [Option number and brief rationale]

**Rationale**:
[Why this option is recommended]

**Authority Needed**:
[What level of authority is required to implement]

---

## Current State

**Work Status**:
- Committed: [YES/NO]
- Pushed: [YES/NO]
- Working tree: [clean/dirty]
- Branch: [branch name]

**Safety State**:
- Build status: [GREEN/RED/UNKNOWN]
- Tests passing: [YES/NO/PARTIAL]
- Data loss risk: [NONE/LOW/MEDIUM/HIGH]
- Safe to pause: [YES/NO]

**Resume Instructions**:
[What needs to happen to resume work after resolution]

---

**Authority**: ESCALATION_POLICY.md v3.0.0 | Created: [timestamp]
```

---

### 6.3 Escalation Storage

**File Location**: `.agent-workspace/[agent-id]/escalation-inbox/`

**File Naming**: `escalation-YYYYMMDD-HHMMSS-[topic].md`

**Examples**:
- `.agent-workspace/builder-001/escalation-inbox/escalation-20260217-143022-architecture-ambiguity.md`
- `.agent-workspace/foreman/escalation-inbox/escalation-20260217-150445-governance-conflict.md`

**Persistence**: Escalation documents MUST be preserved in git for audit trail.

---

## 7. Escalation Procedures

### 7.1 Escalation Initiation

**When Escalation is Triggered**:

1. **HALT** — Stop current operation if:
   - Hard stop triggered (safety, security, UNAUTHORIZED_ACTION)
   - Authority boundary reached
   - Cannot proceed without resolution

2. **PRESERVE** — Save execution state:
   - Commit work-in-progress to feature branch
   - Document current state and context
   - Ensure safe state (no broken builds, no data loss risk)

3. **DOCUMENT** — Create comprehensive escalation document:
   - Use template from Section 6.2
   - Include all required content from Section 6.1
   - Store in `.agent-workspace/[agent-id]/escalation-inbox/`

4. **NOTIFY** — Notify appropriate escalation level:
   - Comment on PR/issue with escalation summary
   - Tag appropriate authority (e.g., `@Foreman`, `@GovernanceAdministrator`, `@JohanRas`)
   - Reference escalation document location

5. **WAIT** — Wait for resolution decision:
   - Do NOT proceed with assumptions
   - Do NOT implement "temporary workaround"
   - Do NOT modify scope to avoid escalation
   - Monitor for resolution response

6. **AUDIT** — Record escalation in audit trail:
   - Update session log with escalation event
   - Track escalation ID and timestamp
   - Document escalation in evidence artifacts

---

### 7.2 Escalation Resolution

**When Resolution is Received**:

1. **RECEIVE** — Receive resolution decision from higher authority:
   - Read resolution instructions completely
   - Understand all requirements and constraints
   - Clarify any ambiguities before proceeding

2. **VALIDATE** — Validate resolution is actionable and compliant:
   - Resolution is within agent authority to implement
   - Resolution complies with governance
   - Resolution addresses the escalation trigger
   - All required information is provided

3. **IMPLEMENT** — Execute resolution as instructed:
   - Follow resolution guidance exactly
   - Do NOT deviate or interpret creatively
   - Do NOT add scope beyond resolution
   - Stay within authorized boundaries

4. **VERIFY** — Verify resolution resolves escalation trigger:
   - Test that original trigger is resolved
   - Validate no new issues introduced
   - Confirm work can proceed
   - Document verification evidence

5. **RESUME** — Resume operation if authorized:
   - Continue from preserved state
   - Follow updated instructions or architecture
   - Maintain audit trail of resolution

6. **LEARN** — Capture escalation as learning:
   - Document what was learned
   - Update patterns/lessons if applicable
   - Contribute to governance improvement
   - Record in session memory

---

### 7.3 Escalation Timeout

**If Escalation Response Not Received**:

**For Informational Escalations** (LOW/MEDIUM severity):
- **1 hour**: Send reminder (comment or re-tag)
- **4 hours**: Re-escalate to next level
- **1 business day**: Escalate to human for visibility

**For Blocking Escalations** (HIGH/CRITICAL severity):
- **30 minutes**: Send reminder
- **2 hours**: Re-escalate to next level
- **4 hours**: Escalate to human authority

**For Emergency Escalations** (BLOCKER severity):
- **Immediate**: Direct escalation to human (L4)
- **15 minutes**: Follow emergency protocol
- **30 minutes**: Activate emergency stop authority per `FOREMAN_AUTHORITY_AND_SUPERVISION_MODEL.md` Section 7.4

---

## 8. Post-Escalation Behavior

### 8.1 Builder Post-Escalation

After escalating, builder MUST:
- ✅ STOP all work on affected task
- ✅ AWAIT FM resolution
- ❌ Do NOT proceed with assumptions
- ❌ Do NOT implement "temporary workaround"
- ❌ Do NOT modify scope to avoid escalation

After resolution received, builder MUST:
- ✅ Resume from preserved state
- ✅ Follow resolution guidance exactly
- ✅ Document resolution in evidence trail
- ✅ Continue to completion
- ✅ Record learnings

See: `governance/canon/GOVERNANCE_BUILDER_SUBMISSION_SURVEY.md` Section 11.4

---

### 8.2 Foreman Post-Escalation

After escalating to L3 or L4, Foreman MUST:
- ✅ Preserve builder state and context
- ✅ Document escalation comprehensively
- ✅ Monitor for resolution
- ✅ Prepare to receive and validate resolution

After resolution received, Foreman MUST:
- ✅ Validate resolution against governance
- ✅ Translate resolution into builder instructions (if applicable)
- ✅ Update architecture or QA design (if needed)
- ✅ Resume builder coordination
- ✅ Capture learning for governance improvement

---

### 8.3 Governance Administrator Post-Escalation

After escalating to L4 (Human), Governance Administrator MUST:
- ✅ Create structured escalation document
- ✅ Provide governance analysis and options
- ✅ Recommend lowest-risk path
- ✅ Await CS2 decision

After CS2 resolution received, Governance Administrator MUST:
- ✅ Implement governance changes as authorized
- ✅ Execute ripple propagation if canon changes
- ✅ Update CANON_INVENTORY and artifact inventories
- ✅ Validate resolution compliance
- ✅ Document precedent for future reference

See: `governance/canon/SELF_ALIGNMENT_AUTHORITY_MODEL.md` Section 6.3

---

## 9. Escalation vs. Autonomous Resolution

### 9.1 When to Escalate (Do NOT Attempt Resolution)

**ALWAYS Escalate**:
- Governance interpretation questions
- Architecture changes needed
- Protected path modifications
- Constitutional conflicts
- Authority ambiguity
- Security vulnerabilities (critical)
- Emergency situations
- Cognitive capacity exceeded

---

### 9.2 When to Attempt Resolution First

**Attempt Resolution, Escalate if Fails**:
- Test failures (retry, fix implementation)
- Build errors (fix syntax, dependencies)
- Configuration issues (adjust settings)
- Transient infrastructure issues (retry)
- Linter warnings (fix code)

**Authority Boundary**: 
- Builders have authority to fix **implementation issues**
- Builders do NOT have authority to interpret or modify **governance**
- Foreman has authority for **architecture and QA design**
- Foreman does NOT have authority for **constitutional governance changes**

---

## 10. Auditing and Learning

### 10.1 Escalation Metrics

Track and analyze:
- Escalation frequency by level (L1→L2, L2→L3, L3→L4)
- Escalation categories (authority, architecture, governance, technical, cognitive)
- Resolution time by severity
- Root causes and patterns
- Proactive vs. reactive escalation ratio

**Healthy Governance Indicators**:
- ✅ Proactive escalation > reactive escalation (complexity awareness)
- ✅ Most escalations resolved at lowest viable level
- ✅ Decreasing frequency of same-root-cause escalations (learning)
- ✅ Clear audit trail for all escalations

**Warning Indicators**:
- ⚠️ Frequent reactive escalations (system weaknesses)
- ⚠️ Escalation timeouts (unresponsive authority levels)
- ⚠️ Repeated escalations for same issues (no learning)
- ⚠️ Emergency escalations bypassing levels (process breakdown)

---

### 10.2 Escalation Learning

After each escalation:

1. **Record in Session Memory**:
   - What triggered escalation
   - How it was resolved
   - What was learned
   - How to prevent similar future escalations

2. **Update Patterns** (if applicable):
   - Document new escalation pattern
   - Update agent personal/patterns.md
   - Contribute to governance improvement

3. **Governance Improvement** (if applicable):
   - Identify governance gaps revealed by escalation
   - Propose governance clarifications
   - Update canonical documents to prevent recurrence

4. **Capability Calibration** (if cognitive escalation):
   - Document task complexity assessment
   - Validate model selection criteria
   - Update capability selection guidance if needed

See: `governance/canon/LEARNING_PROMOTION_RULE.md` for learning capture and promotion

---

## 11. Integration with Other Governance

### 11.1 PR Gate Evaluation Integration

Gate failures trigger escalation per severity:
- **FAIL** status → L1 (Builder self-remediation)
- **ERROR** status → L3 (Governance defect, requires GA)
- **Repeated FAIL** → L2 (FM coordination)
- **UNAUTHORIZED_ACTION** → L4 (Emergency, immediate human)

See: `governance/canon/PR_GATE_EVALUATION_AND_ROLE_PROTOCOL.md` Section 10

---

### 11.2 Stop-and-Fix Integration

Stop-and-Fix doctrine triggers escalation when remediation exceeds capability:
- Agent discovers defect requiring domain expertise → Escalate
- Agent cannot resolve after genuine attempts → Escalate
- RCA exceeds reasonable time → Escalate
- Fix requires authority beyond agent scope → Escalate

**Critical**: Stop-and-Fix escalation is NOT failure—it is proper use of escalation when issue exceeds agent capability.

See: `governance/canon/STOP_AND_FIX_DOCTRINE.md` Section 5

---

### 11.3 Self-Alignment Integration

Governance Administrator self-alignment boundaries determine escalation:
- **Self-Align**: Syntax fixes, cross-reference corrections, inventory drift
- **Escalate to CS2**: Constitutional semantics, protected files, agent contracts, authority boundary conflicts

See: `governance/canon/SELF_ALIGNMENT_AUTHORITY_MODEL.md` Section 6

---

### 11.4 Cognitive Capability Integration

Foreman capability orchestration integrates with escalation:
- **Authority escalation** (L1→L2→L3→L4): Move up hierarchy
- **Capability switching** (same level): Select different cognitive tool
- **Model escalation** (Sonnet→Opus): Complexity-aware model selection

FM must distinguish when to escalate authority vs. switch capability.

See: `governance/canon/COGNITIVE_CAPABILITY_ORCHESTRATION_MODEL.md` Section 5

---

## 12. Emergency Escalation

### 12.1 Emergency Escalation Triggers

**Immediate L4 (Human) Escalation Required**:
- UNAUTHORIZED_ACTION detected
- Data loss imminent
- Security breach detected
- Production outage requiring emergency fix
- Compliance violation with legal consequences
- Safety-critical system failure
- Catastrophic governance failure

---

### 12.2 Emergency Escalation Procedure

1. **IMMEDIATE HALT** — Stop all operations
2. **PRESERVE STATE** — Save all context, do not modify
3. **EMERGENCY DOCUMENT** — Create escalation document tagged "EMERGENCY"
4. **DIRECT HUMAN NOTIFICATION** — Notify Johan Ras immediately
5. **AWAIT EMERGENCY AUTHORITY** — Do not proceed without explicit human authorization

**Emergency Bypass Authority**: Only human (Johan Ras) may authorize emergency bypass of governance gates. See `governance/policy/PR_GATE_FAILURE_HANDLING_PROTOCOL.md` Section 9.

---

## 13. Checklist for Escalation Compliance

When escalating, verify:

- [ ] Escalation trigger is legitimate and documented
- [ ] Current work is in safe state (committed, GREEN, no data loss risk)
- [ ] Escalation document created with all required content (Section 6.1)
- [ ] Escalation document stored in `.agent-workspace/[agent-id]/escalation-inbox/`
- [ ] Appropriate authority level notified (L2/L3/L4)
- [ ] Escalation ID and timestamp recorded
- [ ] Work HALTED on affected task (not proceeding with assumptions)
- [ ] Evidence and audit trail preserved
- [ ] Resolution instructions will be followed exactly when received
- [ ] Learning will be captured after resolution

---

## 14. Authority and Governance

**Canonical Authority**: This document is the **single canonical source** for all escalation policy, hierarchy, triggers, procedures, and authority chains in the Maturion ecosystem.

**Supersedes**: This document supersedes all previous escalation guidance in:
- `governance/escalation/ESCALATION_POLICY.md` (model-focused v1.0, DEPRECATED)
- Distributed escalation guidance in other canonical documents (consolidated here)

**Updates**: Changes to this policy require:
- CS2 (Human) approval for constitutional changes
- Governance Administrator may self-align syntax/clarity per `SELF_ALIGNMENT_AUTHORITY_MODEL.md`
- Version increment and effective date update
- Ripple propagation to all consumer repositories per `GOVERNANCE_RIPPLE_MODEL.md`

**Layer-Down**: This document is PUBLIC_API and must be layer-down propagated to all governed repositories.

---

**Version**: 3.0.0  
**Effective**: 2026-02-17  
**Authority**: GOVERNANCE_PURPOSE_AND_SCOPE.md, LIVING_AGENT_SYSTEM.md v6.2.0  
**Owner**: Johan Ras (CS2)  
**Next Review**: As needed or upon constitutional governance changes
