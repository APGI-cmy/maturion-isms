# Pre-Implementation Behavior Review Protocol

## Status
**Type**: Canonical Governance Protocol  
**Authority**: Supreme - Canonical  
**Version**: 1.0.0  
**Effective Date**: 2026-01-14  
**Owner**: Maturion Engineering Leadership (Johan Ras)  
**Precedence**: Subordinate to BUILD_PHILOSOPHY.md  
**Applies To**: All Builders, All Enhancement Work, All Application Repositories  
**Related Canon**: BUILD_PHILOSOPHY.md, MANDATORY_ENHANCEMENT_CAPTURE_STANDARD.md, BUILDER_CONTRACT_BINDING_CHECKLIST.md  
**Bootstrap Learning**: Wave 3.5 Performance & Scalability Validation (APGI-cmy/maturion-foreman-office-app)

---

## 1. Purpose

This protocol establishes **Pre-Implementation Behavior Review** as a mandatory step in all enhancement testing workflows to prevent repeated test rework cycles caused by assumptions about expected behavior rather than actual code implementation.

This protocol exists to ensure that:
- Builders and reviewers have visibility into current implementation state before designing enhancement tests
- Test design is based on actual current behavior, not assumed behavior
- Enhancement deltas (what will change vs. current behavior) are explicitly identified
- Test rework cycles are minimized through upfront behavior verification
- Governance overhead from repeated test failures is reduced

This document establishes:
- What Pre-Implementation Behavior Review is and when it applies
- Mandatory steps for enhancement test design
- Builder and FM responsibilities
- Evidence and documentation requirements
- Enforcement and compliance validation

---

## 2. Constitutional Mandate

This protocol derives authority from and implements:
- **BUILD_PHILOSOPHY.md** — One-Time Build Law, 100% GREEN philosophy, zero test debt
- **MANDATORY_ENHANCEMENT_CAPTURE_STANDARD.md** — Enhancement capture and process improvement requirements
- **BUILDER_CONTRACT_BINDING_CHECKLIST.md** — Builder execution discipline
- **BOOTSTRAP_EXECUTION_LEARNINGS.md** — Wave 3.5 Performance & Scalability Validation learnings

**Constitutional Principle**: Test debt from avoidable rework cycles violates the One-Time Build philosophy. Prevention through upfront behavior verification is mandatory.

---

## 3. Core Principle: Behavior Before Tests

### 3.1 The Test Rework Problem

**Without Pre-Implementation Behavior Review:**
- Builders write enhancement tests based on assumptions about current behavior
- Tests fail because actual behavior differs from assumptions
- Multiple rework cycles required to align tests with actual implementation
- Wasted time, increased governance overhead, delayed delivery
- Repeated failures erode confidence in build process

**With Pre-Implementation Behavior Review:**
- Builders verify actual current behavior before writing tests
- Enhancement delta (preserved vs. new behaviors) is explicitly identified
- Tests are designed to validate both preserved and new behaviors
- First-pass test success rate increases significantly
- Rework cycles eliminated or minimized
- Build confidence maintained

---

### 3.2 Protocol Mandate

**This protocol is MANDATORY for all enhancement work** involving:
- Feature enhancements to existing functionality
- Performance optimizations
- Behavior modifications
- API changes
- Database schema enhancements
- UI/UX improvements to existing components
- Refactoring that may affect observable behavior

**This protocol is NOT REQUIRED for:**
- Net-new features with no existing implementation
- Bug fixes where current behavior is explicitly defined as incorrect
- Mechanical refactoring with no behavior changes (extract method, rename, etc.)
- Documentation-only changes

When uncertain whether Pre-Implementation Behavior Review is required, **err on the side of applying the protocol**.

---

## 4. Pre-Implementation Behavior Review Process

### 4.1 Mandatory Four-Step Process

Before writing any enhancement tests, builders MUST complete all four steps:

#### Step 1: Review Current Implementation in Detail

**Objective**: Understand the complete current implementation state

**Required Actions**:
- Read the complete implementation code for the component being enhanced
- Identify all code paths, edge cases, and boundary conditions
- Review existing tests to understand currently validated behaviors
- Identify any existing test gaps or incomplete test coverage
- Document implementation complexity and architectural patterns used

**Evidence Required**:
- File paths reviewed (with line ranges if applicable)
- Key implementation patterns identified
- Existing test coverage summary
- Known gaps or technical debt documented

#### Step 2: Document Actual Current Behavior

**Objective**: Create explicit record of how the system ACTUALLY behaves today

**Required Actions**:
- Execute current implementation locally and observe behavior
- Document actual inputs, outputs, side effects, and error handling
- Capture behavior for happy path, edge cases, and error conditions
- Identify any discrepancies between code, tests, and documentation
- Document any non-obvious behaviors or implicit assumptions

**Evidence Required**:
- Behavior verification commands executed (with outputs)
- Actual behavior description for key scenarios
- Screenshots/logs for observable behaviors (if applicable)
- Discrepancies between code, tests, and docs documented

**Format**: Use behavior specification format:
```
GIVEN [current system state]
WHEN [action is performed]
THEN [actual observed behavior]
```

#### Step 3: Identify Enhancement Delta

**Objective**: Explicitly define what WILL change vs. what MUST be preserved

**Required Actions**:
- Compare desired enhancement behavior to documented current behavior
- Explicitly list behaviors that MUST be preserved (backward compatibility)
- Explicitly list behaviors that WILL change (enhancements)
- Identify integration points and cross-component impacts
- Flag high-risk areas where behavior changes may have cascading effects

**Evidence Required**:
- **Preserved Behaviors** table (behaviors that must continue to work)
- **Changed Behaviors** table (behaviors that will be modified)
- **New Behaviors** table (net-new capabilities being added)
- Integration impact analysis
- Risk assessment for each behavior change

**Format**:
```
| Behavior Category | Current | Enhanced | Risk Level |
|-------------------|---------|----------|------------|
| [Behavior name]   | [Current behavior] | [Enhanced behavior] | [Low/Med/High] |
```

#### Step 4: Design Tests Validating Both Preserved and New Behaviors

**Objective**: Create comprehensive test suite covering both continuity and enhancement

**Required Actions**:
- Write tests for **preserved behaviors** (regression prevention)
- Write tests for **changed behaviors** (enhancement validation)
- Write tests for **new behaviors** (net-new capability validation)
- Ensure tests cover edge cases and error conditions for ALL categories
- Validate test independence and isolation
- Run tests against current implementation BEFORE making changes (preserved behavior tests should pass)

**Evidence Required**:
- Test file paths and test names
- Test categorization (preserved/changed/new)
- Pre-enhancement test run results (preserved behavior tests passing)
- Test coverage metrics (if available)

---

### 4.2 Documentation Requirements

Builders MUST create a **Pre-Implementation Behavior Review Report** documenting completion of all four steps.

**Required Sections**:
1. **Scope Declaration**
   - Component being enhanced
   - Enhancement objective
   - Related requirements/issues

2. **Step 1 Evidence: Implementation Review**
   - Files reviewed
   - Implementation patterns identified
   - Existing test coverage summary

3. **Step 2 Evidence: Current Behavior Documentation**
   - Behavior verification commands and outputs
   - Actual behavior specifications (GIVEN/WHEN/THEN)
   - Discrepancies documented

4. **Step 3 Evidence: Enhancement Delta**
   - Preserved Behaviors table
   - Changed Behaviors table
   - New Behaviors table
   - Risk assessment

5. **Step 4 Evidence: Test Design**
   - Test categorization table
   - Pre-enhancement test run results
   - Test coverage validation

6. **Review Completion Certification**
   - Builder attestation that all four steps completed
   - FM/Reviewer validation (if required by workflow)
   - Date and timestamp

**Template**: `governance/templates/PRE_IMPLEMENTATION_BEHAVIOR_REVIEW_REPORT.template.md`

---

## 5. Enforcement and Compliance

### 5.1 Gate Integration

Pre-Implementation Behavior Review Protocol compliance MUST be validated before enhancement PRs are merged.

**FM Responsibilities**:
- Validate that Pre-Implementation Behavior Review Report exists for enhancement work
- Verify all four steps are documented with required evidence
- Confirm behavior delta is explicit and risk-assessed
- Validate tests cover preserved, changed, and new behaviors
- Block merge if protocol compliance is incomplete

**Builder Responsibilities**:
- Complete all four steps before writing enhancement tests
- Provide complete evidence for each step
- Update review report if implementation changes during development
- Escalate to FM if current behavior is undocumented or ambiguous

### 5.2 Violation Severity

Absence of Pre-Implementation Behavior Review for applicable enhancement work is a **governance compliance violation**.

**Violation Categories**:
- **MINOR**: Incomplete evidence for one step (requires remediation before merge)
- **MODERATE**: Missing entire step (requires complete remediation and re-review)
- **MAJOR**: No Pre-Implementation Behavior Review performed (PR rejected, must restart)
- **CATASTROPHIC**: Pattern of repeated violations (escalation to Maturion, builder retraining required)

### 5.3 Exemption Process

If a builder believes Pre-Implementation Behavior Review is not applicable or not practical for specific enhancement work, they MUST:
1. Document why protocol is not applicable (with specific justification)
2. Escalate to FM for approval
3. Obtain explicit exemption in writing
4. Document exemption rationale in PR description

**Exemptions are rare and require strong justification.**

---

## 6. Integration with Existing Governance

### 6.1 Relationship to BUILD_PHILOSOPHY.md

Pre-Implementation Behavior Review Protocol implements the BUILD_PHILOSOPHY.md requirement for **one-time, fully functional builds** by preventing avoidable test rework cycles.

**Alignment**:
- Supports 100% GREEN philosophy by reducing test debt from rework
- Prevents "will fix later" test debt by ensuring upfront behavior verification
- Reduces governance overhead by eliminating preventable failures

### 6.2 Relationship to MANDATORY_ENHANCEMENT_CAPTURE_STANDARD.md

Pre-Implementation Behavior Review Protocol is a **process improvement** that emerged from Wave 3.5 execution learnings and exemplifies the mandatory process improvement reflection requirement.

**Alignment**:
- Implements learning capture from repeated test rework patterns
- Prevents systematic process failures through upfront discipline
- Reduces process gaps exposed during enhancement work

### 6.3 Relationship to BUILDER_CONTRACT_BINDING_CHECKLIST.md

Pre-Implementation Behavior Review Protocol extends builder execution discipline to include mandatory behavior verification before test design.

**Alignment**:
- Adds Step 0 to enhancement test design: "Verify actual current behavior"
- Requires explicit evidence of behavior understanding
- Enforces separation between "what we assume" and "what actually exists"

---

## 7. Success Metrics

### 7.1 Primary Metrics

This protocol's effectiveness will be measured by:
- **Test Rework Cycle Reduction**: Number of enhancement PRs requiring test rework after initial submission
- **First-Pass Test Success Rate**: Percentage of enhancement tests passing on first execution
- **Review Time Reduction**: Average time for FM to review enhancement PRs (reduced due to explicit behavior documentation)
- **Builder Confidence**: Self-reported confidence in test design after completing protocol

### 7.2 Governance Improvement Indicators

Secondary indicators of protocol value:
- Reduction in test-related escalations
- Reduction in "clarify expected behavior" FM queries
- Increase in reusable behavior documentation
- Improved architectural understanding from systematic behavior review

---

## 8. Training and Rollout

### 8.1 Builder Training Requirements

Before working on enhancement tasks, builders MUST complete:
1. Read this protocol document (complete)
2. Review Pre-Implementation Behavior Review Report template
3. Complete at least one practice review (on non-critical component)
4. Demonstrate protocol application to FM or senior builder

### 8.2 Rollout Guidance

**Phase 1: High-Risk Enhancements (Immediate)**
- Apply protocol to all performance optimizations
- Apply protocol to all API behavior changes
- Apply protocol to all database schema enhancements

**Phase 2: All Enhancements (After 3 successful Phase 1 completions)**
- Extend protocol to all feature enhancements
- Extend protocol to all UI/UX improvements
- Extend protocol to all refactoring with behavior impact

**Phase 3: Continuous Improvement (Ongoing)**
- Collect builder feedback on protocol effectiveness
- Refine template based on learnings
- Update training materials
- Integrate into builder onboarding

---

## 9. Related Documents

### 9.1 Canonical Governance
- `BUILD_PHILOSOPHY.md` — One-Time Build philosophy
- `MANDATORY_ENHANCEMENT_CAPTURE_STANDARD.md` — Enhancement and improvement capture
- `BUILDER_CONTRACT_BINDING_CHECKLIST.md` — Builder execution discipline
- `COMBINED_TESTING_PATTERN.md` — Strategic integration testing
- `DEFECT_RESOLUTION_MAINTENANCE_CANON.md` — Maintenance and defect handling

### 9.2 Templates
- `governance/templates/PRE_IMPLEMENTATION_BEHAVIOR_REVIEW_REPORT.template.md` — Report template (to be created)

### 9.3 Bootstrap Learnings
- Wave 3.5 Performance & Scalability Validation (APGI-cmy/maturion-foreman-office-app)
- Test rework cycle analysis (source of this protocol)

---

## 10. Maintenance and Evolution

### 10.1 Protocol Review Cadence

This protocol will be reviewed:
- After every 10 enhancement PRs using the protocol
- Quarterly during IBWR (In-Between Wave Reconciliation)
- When builder feedback indicates friction or gaps
- When test rework patterns emerge despite protocol use

### 10.2 Version History

| Version | Date | Changes | Authority |
|---------|------|---------|-----------|
| 1.0.0 | 2026-01-14 | Initial canonization from Wave 3.5 learnings | Governance Administrator Agent |

---

## 11. Frequently Asked Questions

### Q1: Is this protocol required for bug fixes?
**A**: No, bug fixes where current behavior is explicitly incorrect do not require Pre-Implementation Behavior Review. However, if the bug fix changes observable behavior that other components may depend on, behavior review is recommended.

### Q2: What if current behavior is undocumented?
**A**: Document actual behavior during Step 2, then escalate to FM. Undocumented current behavior is a governance gap that should be addressed before enhancement proceeds.

### Q3: How long should Pre-Implementation Behavior Review take?
**A**: For small enhancements: 30-60 minutes. For complex enhancements: 2-4 hours. For large-scale enhancements: May require multiple sessions. Time invested upfront saves multiples in avoided rework.

### Q4: Can I skip behavior review if I wrote the original implementation?
**A**: No. Original authors may have implicit assumptions that are not obvious. The protocol requires explicit evidence regardless of author familiarity.

### Q5: What if the enhancement changes so much that behavior delta is obsolete?
**A**: If enhancement scope changes significantly during implementation, update the Pre-Implementation Behavior Review Report. Treat it as a living document until PR submission.

---

**End of Pre-Implementation Behavior Review Protocol**
