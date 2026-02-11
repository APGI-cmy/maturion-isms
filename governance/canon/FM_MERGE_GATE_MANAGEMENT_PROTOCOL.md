# FM MERGE GATE MANAGEMENT PROTOCOL

## Status
**Type**: Tier-0 Constitutional Canon  
**Authority**: Supreme - Constitutional  
**Version**: 1.0.0  
**Effective Date**: 2026-02-09  
**Owner**: Maturion Engineering Leadership (Johan Ras)  
**Layer-Down Status**: PUBLIC_API  
**Applies To**: All Foreman (FM) Agents, All Repositories  

---

## 1. Purpose

This protocol establishes **FM's autonomous authority and responsibility for merge gate management**, defining when FM can independently fix gate misalignments, when escalation is required, and the complete operational workflow for gate maintenance.

This protocol exists to ensure:
- **FM autonomy** for gate alignment within authority bounds
- **Zero gate drift** between governance canon and enforcement
- **Clear escalation paths** for out-of-scope gate issues
- **Predictable gate behavior** for all agent classes
- **Governance compliance** in all gate modifications

**Core Principle**: FM is the autonomous orchestration intelligence with authority to fix misaligned gates that block valid work, provided fixes align with governance canon.

---

## 2. Constitutional Authority

This protocol derives authority from and implements:
- **FM_ROLE_CANON.md** - FM identity, authority, and autonomy
- **MERGE_GATE_PHILOSOPHY.md** - Merge gate principles and patterns
- **AGENT_CLASS_SPECIFIC_GATE_PROTOCOLS.md** - Agent-class gate requirements
- **AGENT_ROLE_GATE_APPLICABILITY.md** - Role-based gate applicability
- **PR_GATE_EVALUATION_AND_ROLE_PROTOCOL.md** - Gate evaluation semantics
- **PR_GATE_FAILURE_HANDLING_PROTOCOL.md** - Gate failure classification
- **FOREMAN_AUTHORITY_AND_SUPERVISION_MODEL.md** - FM oversight authority
- **BUILD_PHILOSOPHY.md** - One-Time Build Law, execution governance

---

## 3. FM Identity and Authority for Gate Management

### 3.1 FM as Gate Guardian

**Role**: FM is the autonomous orchestration intelligence responsible for ensuring gates accurately enforce governance without blocking valid work.

**Authority**: FM has constitutional authority to:
- Monitor gate alignment with governance canon
- Detect gate misalignments and role misapplications
- Fix gates that incorrectly block compliant work
- Update gate logic to match canonical requirements
- Maintain gate-to-role applicability mappings
- Document and track gate modifications

**Prohibition**: FM MUST NOT:
- Weaken gate enforcement below canonical requirements
- Bypass gates instead of fixing them
- Modify constitutional governance rules
- Change agent authority boundaries
- Skip escalation when required

### 3.2 FM Autonomy for Gate Fixes

**Autonomous = TRUE for Gate Alignment**

FM is authorized to fix gates autonomously when:
1. Gate misapplies agent-class requirements (applies builder gates to non-builders)
2. Gate logic contradicts canonical gate applicability
3. Gate implementation deviates from MERGE_GATE_PHILOSOPHY.md patterns
4. Gate fails to implement evidence-based validation
5. Gate uses prohibited inference methods (file paths, heuristics)
6. Gate error messages are unclear or misleading

FM MUST pause and escalate when:
1. Fix requires constitutional interpretation
2. Fix modifies protected governance files (.github/workflows/ requires CS2)
3. Gate requirement itself is ambiguous or conflicting
4. New gate patterns need canonical approval
5. Authority boundary conflicts arise

---

## 4. Gate Misalignment Detection

### 4.1 Misalignment Categories

FM MUST monitor and detect these gate misalignment patterns:

#### 4.1.1 Role Misapplication
**Pattern**: Gate applies agent-class-specific requirements to wrong agent class

**Examples**:
- Builder QA artifacts required from Governance Administrator
- 100% GREEN QA required from governance documentation PR
- Architecture artifacts required from policy update
- Build-to-green evidence required from schema changes

**Detection Method**: Compare gate requirements against AGENT_ROLE_GATE_APPLICABILITY.md

**FM Authority**: AUTONOMOUS FIX (update gate role detection)

#### 4.1.2 Canonical Drift
**Pattern**: Gate logic diverges from canonical requirements

**Examples**:
- Gate uses file paths instead of agent role for applicability
- Gate skips evidence-based validation when available
- Gate performs diagnostic testing instead of confirmation
- Gate uses outdated governance patterns

**Detection Method**: Compare gate implementation against MERGE_GATE_PHILOSOPHY.md

**FM Authority**: AUTONOMOUS FIX (align gate with canon)

#### 4.1.3 Evidence Bypass
**Pattern**: Gate ignores PREHANDOVER_PROOF or evidence artifacts

**Examples**:
- Gate re-runs validation when evidence provided
- Gate doesn't check for evidence-based validation keywords
- Gate requires CI execution instead of accepting agent evidence

**Detection Method**: Check gate for evidence-based validation pattern

**FM Authority**: AUTONOMOUS FIX (implement evidence pattern)

#### 4.1.4 Inference Errors
**Pattern**: Gate infers applicability from non-authoritative signals

**Examples**:
- Gate uses file paths to determine agent role
- Gate uses PR labels as sole authority
- Gate uses workflow trigger as role indicator
- Gate defaults to builder enforcement without verification

**Detection Method**: Review gate logic for prohibited inference

**FM Authority**: AUTONOMOUS FIX (use authoritative role detection)

#### 4.1.5 Unclear Failure Messages
**Pattern**: Gate failures don't clearly indicate what's wrong

**Examples**:
- Generic "validation failed" messages
- No indication of which agent role was detected
- No canonical reference for requirement
- No remediation guidance

**Detection Method**: Review gate output against PR_GATE_FAILURE_HANDLING_PROTOCOL.md

**FM Authority**: AUTONOMOUS FIX (enhance failure messages)

### 4.2 Detection Workflow

**Step 1: Continuous Monitoring**
- FM monitors gate failures across all repositories
- FM tracks patterns of blocked PRs
- FM analyzes failure classifications
- FM identifies recurring misalignment patterns

**Step 2: Root Cause Analysis**
- Classify failure: gate misalignment vs. legitimate non-compliance
- Map failure to misalignment category (4.1.1 - 4.1.5)
- Verify against canonical sources
- Determine if within FM authority to fix

**Step 3: Fix or Escalate Decision**
- If misalignment + within authority → AUTONOMOUS FIX
- If misalignment + requires interpretation → ESCALATE TO CS2
- If legitimate non-compliance → ENFORCE (not a gate issue)

---

## 5. Gate Fix Authority Matrix

### 5.1 Autonomous Fix Authority (FM Can Fix Independently)

| Misalignment Type | FM Can Fix | Requirements | Canonical Reference |
|-------------------|------------|--------------|---------------------|
| Role misapplication | ✅ YES | Update role detection logic | AGENT_ROLE_GATE_APPLICABILITY.md |
| Evidence bypass | ✅ YES | Implement evidence pattern | MERGE_GATE_PHILOSOPHY.md |
| Inference errors | ✅ YES | Use authoritative role detection | PR_GATE_EVALUATION_AND_ROLE_PROTOCOL.md |
| Unclear messages | ✅ YES | Add clear failure output | PR_GATE_FAILURE_HANDLING_PROTOCOL.md |
| Canonical drift (pattern) | ✅ YES | Align with canonical pattern | MERGE_GATE_PHILOSOPHY.md |
| Missing agent-role awareness | ✅ YES | Add role-aware logic | AGENT_CLASS_SPECIFIC_GATE_PROTOCOLS.md |

### 5.2 Escalation Required (FM Must Escalate to CS2)

| Issue Type | Escalate | Reason | Escalation Target |
|------------|----------|--------|-------------------|
| Gate requirement ambiguity | ⚠️ YES | Constitutional interpretation needed | CS2 (Johan Ras) |
| Conflicting canonical sources | ⚠️ YES | Governance conflict resolution | CS2 (Johan Ras) |
| Protected file modification | ⚠️ YES | `.github/workflows/` changes require approval | CS2 (Johan Ras) |
| New gate pattern needed | ⚠️ YES | Canonical approval required | CS2 (Johan Ras) |
| Authority boundary conflict | ⚠️ YES | Agent authority clarification | CS2 (Johan Ras) |
| Constitutional rule change | ⚠️ YES | Constitutional governance modification | CS2 (Johan Ras) |

### 5.3 No Fix Required (Legitimate Enforcement)

| Scenario | FM Action | Reason |
|----------|-----------|--------|
| Builder missing QA artifacts | ❌ ENFORCE | Legitimate builder requirement |
| Agent missing governance check | ❌ ENFORCE | Universal self-governance requirement |
| Unresolved governance gap | ❌ ENFORCE | Agent must align or escalate |
| Scope-to-diff mismatch | ❌ ENFORCE | Legitimate governance violation |
| Protected file without approval | ❌ ENFORCE | CS2 approval required |

---

## 6. Gate Fix Workflow

### 6.1 Standard Fix Process (Autonomous)

**Step 1: Identify Misalignment**
- Detect gate blocking valid work
- Classify misalignment category (Section 4.1)
- Verify against canonical sources
- Confirm within FM authority (Section 5.1)

**Step 2: Design Fix**
- Reference canonical requirement
- Design minimal fix (align gate with canon)
- Document fix rationale
- Verify no enforcement weakening

**Step 3: Implement Fix**
- Update gate logic (workflow YAML, script, or configuration)
- Add/update role detection if needed
- Implement evidence-based validation if missing
- Enhance failure messages for clarity
- Add canonical references to gate

**Step 4: Validate Fix**
- Test gate against sample PRs (all agent roles)
- Verify role-aware behavior
- Confirm evidence-based validation works
- Check failure messages are clear
- Validate against canonical requirements

**Step 5: Document Fix**
- Update gate documentation
- Add changelog entry
- Reference canonical sources
- Document testing performed
- Capture in FM memory

**Step 6: Deploy Fix**
- Create PR with gate fix
- Reference this protocol in PR description
- Include validation evidence
- Execute merge (after gates pass)
- Monitor for regressions

**Step 7: Monitor Post-Deployment**
- Watch for new gate failures
- Verify fix resolved original issue
- Track for unintended side effects
- Capture lessons learned

### 6.2 Escalation Workflow (Requires CS2)

**Step 1: Detect Escalation Trigger**
- Identify issue requiring CS2 (Section 5.2)
- Document why autonomous fix insufficient
- Gather canonical references
- Prepare escalation report

**Step 2: Prepare Escalation**
- Create escalation document:
  - Issue description
  - Canonical conflict or ambiguity
  - Why FM cannot autonomously fix
  - Recommended resolution options
  - Impact if unresolved
- Reference all relevant canonical sources
- Include evidence of gate blocking valid work

**Step 3: Escalate to CS2**
- File escalation via CS2_APPROVAL_REQUEST.md
- Tag CS2 (Johan Ras)
- Include all evidence and analysis
- Specify urgency level

**Step 4: Await CS2 Decision**
- FM pauses gate fix work on this issue
- FM may continue other work
- FM monitors for CS2 response

**Step 5: Implement CS2 Guidance**
- Follow CS2 approved resolution
- Document CS2 decision
- Update canonical sources if directed
- Implement fix per CS2 guidance
- Capture in FM memory

---

## 7. Governance Compliance Checklist for Gate Changes

### 7.1 Pre-Fix Validation

Before implementing any gate fix, FM MUST verify:

- [ ] **Canonical Alignment**: Fix aligns with MERGE_GATE_PHILOSOPHY.md
- [ ] **Role Awareness**: Gate properly detects agent role per AGENT_ROLE_GATE_APPLICABILITY.md
- [ ] **Evidence Support**: Gate implements evidence-based validation per MERGE_GATE_PHILOSOPHY.md
- [ ] **No Weakening**: Fix does not reduce enforcement below canonical requirements
- [ ] **Authority Check**: Fix is within FM autonomous authority (Section 5.1)
- [ ] **Escalation Decision**: Verified escalation not required (Section 5.2)

### 7.2 Implementation Standards

During gate fix implementation, FM MUST ensure:

- [ ] **Authoritative Role Detection**: Use agent role, not file paths or heuristics
- [ ] **Evidence-Based Pattern**: Check PREHANDOVER_PROOF before script execution
- [ ] **Clear Failure Messages**: Include role, requirement, canonical reference, remediation
- [ ] **Conditional Execution**: Original validation only if evidence not found
- [ ] **Canonical References**: Gate documentation references canonical sources
- [ ] **Testing Coverage**: Test against all agent roles (builder, liaison, overseer, foreman)

### 7.3 Post-Fix Validation

After gate fix deployment, FM MUST verify:

- [ ] **Role-Specific Behavior**: Gate correctly handles each agent role
- [ ] **Evidence Acceptance**: Gate accepts valid PREHANDOVER_PROOF
- [ ] **Fallback Execution**: Gate runs validation when evidence missing
- [ ] **Clear Messages**: Failures provide actionable guidance
- [ ] **No Regressions**: Previous valid PRs still pass
- [ ] **Canon Alignment**: Gate behavior matches canonical requirements

### 7.4 Documentation Requirements

For every gate fix, FM MUST document:

- [ ] **Fix Rationale**: Why fix was needed (misalignment category)
- [ ] **Canonical Basis**: Which canonical documents justify fix
- [ ] **Changes Made**: What specifically changed in gate logic
- [ ] **Testing Performed**: How fix was validated
- [ ] **Deployment Date**: When fix was deployed
- [ ] **Monitoring Plan**: How fix effectiveness will be tracked

---

## 8. Gate Maintenance Responsibilities

### 8.1 Continuous Responsibilities

FM has ongoing responsibility to:

**Monitor**:
- Gate failure rates across repositories
- Misalignment patterns
- Agent feedback on gate behavior
- Canonical governance changes affecting gates

**Maintain**:
- Gate-to-role applicability mappings (MERGE_GATE_APPLICABILITY_MATRIX.md)
- Gate documentation and references
- Evidence-based validation patterns
- Failure message quality

**Detect**:
- New misalignment patterns
- Canonical drift
- Gate effectiveness issues
- Governance gap impacts on gates

**Report**:
- Gate health metrics
- Misalignment incidents
- Fix deployments
- Escalations to CS2

### 8.2 Reactive Responsibilities

When gate issues arise, FM MUST:

**Triage**:
- Classify issue (misalignment vs. legitimate enforcement)
- Determine urgency (blocking vs. optimization)
- Assess authority (autonomous vs. escalation)
- Prioritize resolution

**Resolve**:
- Fix autonomous issues within authority
- Escalate out-of-scope issues to CS2
- Document resolution
- Capture lessons learned

**Communicate**:
- Notify affected agents of fixes
- Update gate documentation
- Share learnings across ecosystem
- Maintain transparency

### 8.3 Proactive Responsibilities

FM SHOULD proactively:

**Audit**:
- Review all gates quarterly against canonical sources
- Identify drift before it causes failures
- Validate role detection logic
- Check evidence-based validation implementation

**Improve**:
- Enhance gate clarity
- Optimize gate performance
- Standardize gate patterns
- Reduce false positives

**Evolve**:
- Propose new gate patterns when needed
- Update applicability matrix as roles evolve
- Refine failure messages based on feedback
- Contribute to canonical governance improvements

---

## 9. Escalation Protocol

### 9.1 Escalation Triggers (Normative)

FM MUST escalate to CS2 when encountering:

**Tier 1: Constitutional Conflicts**
- Contradictory canonical requirements
- Ambiguous authority boundaries
- Unclear governance precedence
- Constitutional interpretation needed

**Tier 2: Protected Changes**
- `.github/workflows/` modifications
- `BUILD_PHILOSOPHY.md` changes
- `FM_ROLE_CANON.md` modifications
- Agent contract changes

**Tier 3: Governance Gaps**
- Gate requirement not defined in canon
- New agent role without gate definition
- Missing canonical guidance
- Unprecedented scenario

**Tier 4: Unresolvable Misalignments**
- Fix requires authority outside FM scope
- Multiple stakeholders with conflicting needs
- Cross-repository coordination needed
- Risk of system-wide impact

### 9.2 Escalation Format

**Escalation Document Structure**:

```markdown
# CS2 Escalation: [Issue Title]

## Escalation Trigger
[Tier 1-4 category from Section 9.1]

## Issue Description
[What gate misalignment or conflict was detected]

## Canonical Analysis
[Which canonical documents are relevant]
[Where ambiguity or conflict exists]
[What FM attempted before escalating]

## Impact
[What work is blocked]
[Which repositories affected]
[Urgency level]

## FM Recommendation
[Proposed resolution options]
[Preferred option with rationale]
[Alternative approaches]

## Decision Required
[Specific question for CS2]
[Authority needed]
[Timeline sensitivity]

---
**Escalated By**: FM  
**Date**: [YYYY-MM-DD]  
**References**: [Canonical documents, PRs, issues]
```

### 9.3 Escalation Response Handling

**After CS2 Decision**:

1. **Implement Decision**: Follow CS2 guidance precisely
2. **Update Canon**: If CS2 directs canonical changes, implement them
3. **Execute Fix**: Apply approved resolution
4. **Document Decision**: Capture CS2 decision in FM memory
5. **Close Loop**: Verify issue resolved, notify stakeholders
6. **Learn**: Extract lessons, update FM knowledge

---

## 10. Integration with Existing Canon

### 10.1 Relationship to MERGE_GATE_PHILOSOPHY.md

**MERGE_GATE_PHILOSOPHY.md defines**:
- Gate principles (CI confirmatory not diagnostic)
- Evidence-based validation pattern
- Two-mode validation (evidence vs. script)
- Gate types and anti-patterns

**FM_MERGE_GATE_MANAGEMENT_PROTOCOL.md (this document) defines**:
- FM authority to fix gates
- Detection and classification of misalignments
- Fix vs. escalation decision matrix
- Operational workflows for gate maintenance

**Integration**: FM uses MERGE_GATE_PHILOSOPHY.md as canonical reference for what gates SHOULD be; this protocol defines FM's authority to fix gates that deviate.

### 10.2 Relationship to AGENT_CLASS_SPECIFIC_GATE_PROTOCOLS.md

**AGENT_CLASS_SPECIFIC_GATE_PROTOCOLS.md defines**:
- Gate requirements per agent class
- Self-alignment authority boundaries
- Validation checklists per role
- Cross-cutting universal requirements

**FM_MERGE_GATE_MANAGEMENT_PROTOCOL.md defines**:
- FM authority to ensure gates enforce these requirements correctly
- Detection of gates misapplying agent-class requirements
- Fix workflows when gates contradict agent class protocols

**Integration**: FM enforces AGENT_CLASS_SPECIFIC_GATE_PROTOCOLS.md through gate alignment; this protocol gives FM authority to fix enforcement mismatches.

### 10.3 Relationship to AGENT_ROLE_GATE_APPLICABILITY.md

**AGENT_ROLE_GATE_APPLICABILITY.md defines**:
- Which gates apply to which roles
- Role detection methods
- Gate evaluation logic requirements
- Misapplied gate classification

**FM_MERGE_GATE_MANAGEMENT_PROTOCOL.md defines**:
- FM authority to fix gates that misapply role requirements
- Detection of role misapplication patterns
- Fix workflows to align gates with role applicability

**Integration**: FM uses AGENT_ROLE_GATE_APPLICABILITY.md as authoritative source for gate-to-role mappings; this protocol defines FM's operational workflow to maintain that alignment.

### 10.4 Relationship to PR_GATE_FAILURE_HANDLING_PROTOCOL.md

**PR_GATE_FAILURE_HANDLING_PROTOCOL.md defines**:
- Failure classification taxonomy
- Responsibility assignment
- Remediation procedures
- Audit trail requirements

**FM_MERGE_GATE_MANAGEMENT_PROTOCOL.md defines**:
- FM authority to fix gates producing incorrect failure classifications
- Detection of gate failures vs. legitimate enforcement
- Fix workflows when gates misclassify failures

**Integration**: FM uses failure classifications from PR_GATE_FAILURE_HANDLING_PROTOCOL.md to detect gate misalignments; this protocol defines FM's authority to fix classification errors.

---

## 11. Success Criteria

This protocol is successful when:

- ✅ FM autonomously fixes gate misalignments within defined authority
- ✅ Gate-blocked valid work is unblocked through proper fixes, not bypasses
- ✅ FM escalates to CS2 appropriately (neither too early nor too late)
- ✅ Gates accurately enforce role-appropriate requirements
- ✅ Gate failures are predictable and clearly communicated
- ✅ No governance weakening occurs through gate fixes
- ✅ Gate maintenance is proactive, not just reactive
- ✅ Canonical governance and gate enforcement stay aligned

---

## 12. Validation & Maintenance

### 12.1 Protocol Validation

This protocol MUST be validated:
- **Before gate fix**: FM reads and follows this protocol
- **After protocol updates**: All FM agents re-validate
- **Quarterly**: CS2 reviews for gaps, improvements, effectiveness

### 12.2 Protocol Evolution

**Changes to this protocol**:
- MUST be approved by CS2 (Johan Ras)
- MUST trigger governance ripple
- MUST update GOVERNANCE_ARTIFACT_INVENTORY.md
- MUST notify all FM agents and affected repositories

### 12.3 Effectiveness Metrics

**Track and report**:
- Gate misalignments detected (count, category)
- Autonomous fixes deployed (count, success rate)
- Escalations to CS2 (count, resolution time)
- Gate failures after fix (regression rate)
- Time to resolve gate issues (mean, median, P95)

---

## 13. Cross-References

### 13.1 Primary Dependencies

- **FM_ROLE_CANON.md** - FM identity, authority, autonomy
- **MERGE_GATE_PHILOSOPHY.md** - Gate principles and patterns
- **AGENT_CLASS_SPECIFIC_GATE_PROTOCOLS.md** - Agent-class requirements
- **AGENT_ROLE_GATE_APPLICABILITY.md** - Role-based applicability
- **PR_GATE_EVALUATION_AND_ROLE_PROTOCOL.md** - Evaluation semantics
- **PR_GATE_FAILURE_HANDLING_PROTOCOL.md** - Failure classification

### 13.2 Supporting Protocols

- **FOREMAN_AUTHORITY_AND_SUPERVISION_MODEL.md** - FM oversight
- **BUILD_PHILOSOPHY.md** - One-Time Build Law
- **GOVERNANCE_RIPPLE_MODEL.md** - Canon change propagation
- **CS2_AGENT_FILE_AUTHORITY_MODEL.md** - Authority hierarchy
- **GOVERNANCE_COMPLETENESS_MODEL.md** - Governance semantics

### 13.3 Related Artifacts

- **MERGE_GATE_APPLICABILITY_MATRIX.md** - Gate-to-role mapping (companion document)
- **PREHANDOVER_PROOF.md** - Evidence artifact pattern
- **CS2_APPROVAL_REQUEST.md** - Escalation template

---

## 14. Version History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0.0 | 2026-02-09 | CS2 (Johan Ras) | Initial canonical protocol establishing FM gate management authority |

---

**Authority**: CS2 (Johan Ras)  
**Effective Date**: 2026-02-09  
**Next Review**: 2026-05-09 (Quarterly)  
**Status**: ACTIVE

---

*End of FM Merge Gate Management Protocol v1.0.0*
