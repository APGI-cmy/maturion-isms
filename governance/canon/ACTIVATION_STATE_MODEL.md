# ACTIVATION STATE MODEL

## Status
Canonical Governance Standard  
Version: v1.0  
Authority: Johan Ras  
Applies To: All Maturion Systems, All Subsystems, All Capabilities, Foreman (FM), Builders, Governance Administrator

---

## 1. Purpose

This document defines the **canonical activation state model** for all Maturion systems, subsystems, and capabilities.

Activation states provide **explicit lifecycle control** over component operational authority, ensuring:

- Components advance through validated, human-authorized state transitions
- Operational capability is explicitly granted, not assumed
- State transitions are auditable and reversible
- Emergency controls exist to disable components without data loss
- No component self-activates or bypasses governance controls

**Foundational Principle**: Activation state is a **governance-controlled property**, not an implementation detail.

---

## 2. Core Definitions

### 2.1 Activation State

**Activation State** is the formal governance property that determines a component's **authorized operational capability level**.

Activation state defines:
- What operations a component may perform
- What resources a component may access
- What interactions a component may initiate
- Whether a component may process production workloads

**Critical Distinction**: Activation state is **not** operational status (running/stopped). A component may be running but in a restricted activation state.

### 2.2 Component

A **component** is any system, subsystem, capability, service, application, or function that:
- Has distinct operational scope
- Can be independently activated or deactivated
- Has governance-defined activation requirements

Components include:
- Complete applications (e.g., Foreman App, Builder Service)
- Subsystems within applications (e.g., Authentication Module, Reporting Engine)
- Capabilities or features (e.g., Auto-scaling, Autonomous Decision-Making)
- Integration points (e.g., External API Connector)

### 2.3 State Transition

A **state transition** is the governed, authorized change of a component from one activation state to another.

State transitions:
- Require explicit authorization (per Section 5)
- Must satisfy transition preconditions (per Section 6)
- Must be recorded in audit trail
- May be reversible or irreversible (per state definition)

---

## 3. Canonical Activation States

### 3.1 DORMANT

**Definition**: Component exists but has **no operational authority**.

**Operational Characteristics**:
- Component code/artifacts are deployed but inactive
- Component MUST NOT execute any operational logic
- Component MUST NOT access any resources (production or non-production)
- Component MUST NOT initiate any interactions
- Component MAY be present in codebase for future activation

**Use Cases**:
- New component awaiting validation
- Component under development (not yet commissioned)
- Component temporarily disabled pending investigation
- Component awaiting dependency satisfaction

**Allowed Operations**:
- None (component is completely inert)

**Exit Criteria**:
- Component meets validation requirements for next state
- Human authorization received for state transition

**Reversibility**: Components may return to DORMANT from any state via explicit deactivation.

---

### 3.2 VALIDATED

**Definition**: Component is **technically verified** but not yet authorized for any operational use.

**Operational Characteristics**:
- Component has passed technical validation (tests, security scans, QA)
- Component MUST NOT process production workloads
- Component MUST NOT access production resources
- Component MAY be executed in isolated test/validation environments only
- Component awaits authorization for limited operational modes

**Use Cases**:
- Post-build validation phase
- Pre-commissioning verification
- Regression testing after changes
- Compliance validation

**Allowed Operations**:
- Execution in isolated test environments
- Validation-mode operations (non-destructive, no side effects)
- Health checks and diagnostics

**Entry Criteria**:
- Component in DORMANT state
- Technical validation completed successfully
- Human authorization for validation phase received

**Exit Criteria**:
- Validation evidence documented
- Human authorization received for operational mode

**Reversibility**: May return to DORMANT if validation reveals issues requiring remediation.

---

### 3.3 READ_ONLY

**Definition**: Component is authorized for **non-mutating operational use** only.

**Operational Characteristics**:
- Component MAY read from production resources
- Component MUST NOT write to production resources
- Component MUST NOT modify system state
- Component MUST NOT initiate state-changing operations
- Component operates in observation/reporting mode only

**Use Cases**:
- Reporting and analytics components
- Monitoring and observability systems
- Audit trail readers
- Read-only API endpoints
- Components undergoing phased activation (read before write)

**Allowed Operations**:
- Read operations on authorized resources
- Query execution (SELECT only, no INSERT/UPDATE/DELETE)
- Data retrieval and aggregation
- Reporting and visualization
- Non-mutating API calls

**Forbidden Operations**:
- Any write, update, delete operations
- State modification
- Resource creation or destruction
- Triggering side effects in other systems

**Entry Criteria**:
- Component in VALIDATED state
- Read-only operational requirements validated
- Human authorization for READ_ONLY mode received

**Exit Criteria**:
- Component demonstrates safe read-only operation
- Human authorization received for full activation OR
- Component designated as permanently read-only

**Reversibility**: May return to VALIDATED or DORMANT if issues detected.

---

### 3.4 PROPOSAL_ONLY

**Definition**: Component is authorized to **propose actions** but not execute them without human approval.

**Operational Characteristics**:
- Component MAY analyze situations and generate recommendations
- Component MAY create proposals for state changes
- Component MUST NOT execute proposals without explicit human approval
- Component MUST present proposals with full context and impact analysis
- Component operates in advisory mode with human-in-the-loop

**Use Cases**:
- AI decision-making systems awaiting trust validation
- Autonomous agents in supervised mode
- High-risk operation automation (with approval gate)
- Governance enforcement with human override capability
- Components transitioning from READ_ONLY to ACTIVE

**Allowed Operations**:
- Read operations (same as READ_ONLY)
- Generate proposals, recommendations, or plans
- Present impact analysis and risk assessment
- Queue actions pending approval
- Log proposed actions for audit

**Forbidden Operations**:
- Execute proposals without approval
- Bypass human approval gate
- Auto-approve own proposals

**Entry Criteria**:
- Component in READ_ONLY state (or VALIDATED if no read capability needed)
- Proposal generation logic validated
- Human approval mechanism implemented and validated
- Human authorization for PROPOSAL_ONLY mode received

**Exit Criteria**:
- Component demonstrates safe proposal generation
- Human trust in component proposals established
- Human authorization received for ACTIVE mode OR
- Component designated as permanently proposal-only

**Reversibility**: May return to READ_ONLY, VALIDATED, or DORMANT if issues detected.

---

### 3.5 ACTIVE

**Definition**: Component is **fully authorized for all designed operational capabilities**.

**Operational Characteristics**:
- Component MAY perform all operations within its designed scope
- Component MAY read and write to authorized resources
- Component MAY modify system state per its responsibilities
- Component MAY initiate interactions with other systems
- Component operates with full operational authority

**Use Cases**:
- Production-ready components
- Fully trusted autonomous agents
- Core system services
- Complete applications

**Allowed Operations**:
- All operations defined in component's scope and architecture
- Read and write operations on authorized resources
- State modifications within component's domain
- Integration interactions with authorized systems
- Resource management (create, update, delete)

**Forbidden Operations**:
- Operations outside component's defined scope
- Unauthorized resource access
- Scope expansion without governance approval

**Entry Criteria**:
- Component in PROPOSAL_ONLY state (or READ_ONLY if no proposal phase needed)
- Component demonstrates successful operation in restricted modes
- All validation and commissioning requirements satisfied
- Human authorization for ACTIVE mode received

**Exit Criteria**:
- Human deactivation authorization received OR
- Emergency condition requiring immediate deactivation OR
- Component retired or deprecated

**Reversibility**: May return to any previous state via explicit deactivation or emergency controls.

---

## 4. State Transition Model

### 4.1 Standard Activation Path (Progressive)

The standard activation path follows **progressive capability expansion**:

```
DORMANT → VALIDATED → READ_ONLY → PROPOSAL_ONLY → ACTIVE
```

**Rationale**: Progressive activation allows:
- Validation at each capability level
- Risk mitigation through phased deployment
- Human observation before full trust
- Rollback to last known-good state

**Flexibility**: Components may skip intermediate states if:
- Component has no read capability (skip READ_ONLY)
- Component has no proposal generation capability (skip PROPOSAL_ONLY)
- Human explicitly authorizes direct transition (with risk acceptance)

### 4.2 State Transition Diagram

```
┌─────────┐
│ DORMANT │◄─────────────────────────────────┐
└────┬────┘                                   │
     │                                        │
     │ [Validation Complete]                  │
     │ [Human Authorization]                  │
     ▼                                        │
┌───────────┐                           [Deactivation]
│ VALIDATED │◄───────────┐              [Emergency Stop]
└─────┬─────┘            │                    │
      │                  │                    │
      │ [Read Auth]  [Issues Detected]        │
      │                  │                    │
      ▼                  │                    │
┌───────────┐            │                    │
│ READ_ONLY │────────────┘                    │
└─────┬─────┘                                 │
      │                                       │
      │ [Proposal Auth]                       │
      │                                       │
      ▼                                       │
┌───────────────┐                             │
│ PROPOSAL_ONLY │─────────────────────────────┤
└───────┬───────┘                             │
        │                                     │
        │ [Full Activation Auth]              │
        │                                     │
        ▼                                     │
   ┌────────┐                                 │
   │ ACTIVE │─────────────────────────────────┘
   └────────┘
```

---

## 5. Transition Authorization Requirements

### 5.1 Authorization Principle

**All state transitions require explicit authorization.**

No component may:
- Self-authorize state transitions
- Auto-activate based on external conditions
- Bypass authorization gates
- Infer authorization from deployment or configuration

### 5.2 Authorization Authority

**Primary Authority**: Johan Ras (Human Owner)

**Delegated Authority** (where explicitly granted):
- Foreman (FM) may authorize transitions for builder agents per FOREMAN_AUTHORITY_AND_SUPERVISION_MODEL.md
- Governance Administrator may authorize transitions for governance tooling per governance canon
- Emergency safeguards may authorize ACTIVE → DORMANT transitions per Section 8

### 5.3 Required Authorization Elements

Every state transition authorization MUST include:

1. **Component Identifier**: Clear identification of the component
2. **Current State**: Component's current activation state
3. **Target State**: Intended activation state
4. **Authorization Method**: How authorization is granted (explicit command, approval record, etc.)
5. **Authorization Timestamp**: When authorization was granted (ISO 8601 format)
6. **Authorizing Entity**: Who/what granted authorization
7. **Rationale**: Why transition is authorized (optional but recommended)

### 5.4 Authorization Recording

All authorizations MUST be recorded in:
- Component audit trail (per AUDIT_READINESS_MODEL.md)
- Activation state change log
- Governance evidence (if governance component)
- Application logs (if application component)

---

## 6. Allowed Transitions

### 6.1 Forward Transitions (Activation)

#### DORMANT → VALIDATED
- **Preconditions**: 
  - Component code/artifacts deployed
  - Technical validation requirements defined
  - Human authorization received
- **Authorization Level**: Human (Johan) or delegated authority
- **Validation Required**: Post-transition validation confirms component in VALIDATED mode

#### VALIDATED → READ_ONLY
- **Preconditions**:
  - Validation evidence complete and accepted
  - Component has read capability
  - Human authorization received
- **Authorization Level**: Human (Johan) or delegated authority
- **Validation Required**: Component demonstrates safe read-only operation

#### READ_ONLY → PROPOSAL_ONLY
- **Preconditions**:
  - Component demonstrates safe read operation
  - Component has proposal generation capability
  - Human approval mechanism implemented
  - Human authorization received
- **Authorization Level**: Human (Johan) or delegated authority
- **Validation Required**: Component generates proposals without executing them

#### PROPOSAL_ONLY → ACTIVE
- **Preconditions**:
  - Component demonstrates safe proposal generation
  - Human trust established
  - All commissioning requirements satisfied
  - Human authorization received
- **Authorization Level**: Human (Johan) or delegated authority
- **Validation Required**: Component operates within scope without violations

#### Skip Transitions (Selective)
Components may skip intermediate states with explicit authorization:

- **VALIDATED → ACTIVE** (skip READ_ONLY and PROPOSAL_ONLY)
  - Allowed if component has no read-only or proposal phase requirements
  - Requires explicit risk acceptance by Johan
  
- **VALIDATED → PROPOSAL_ONLY** (skip READ_ONLY)
  - Allowed if component has no read capability
  
- **READ_ONLY → ACTIVE** (skip PROPOSAL_ONLY)
  - Allowed if component has no proposal generation capability

---

### 6.2 Reverse Transitions (Deactivation)

#### Any State → DORMANT
- **Preconditions**:
  - Human deactivation authorization received OR
  - Emergency condition detected
- **Authorization Level**: Human (Johan), delegated authority, or emergency safeguard
- **Validation Required**: Component ceases all operational activity
- **Use Cases**:
  - Planned deactivation
  - Emergency shutdown
  - Security incident response
  - Component retirement

#### ACTIVE → PROPOSAL_ONLY
- **Preconditions**:
  - Human authorization received
  - Component supports proposal-only mode
- **Authorization Level**: Human (Johan) or delegated authority
- **Use Cases**:
  - Supervised operation mode required
  - Trust degradation
  - Phased deactivation

#### ACTIVE → READ_ONLY
- **Preconditions**:
  - Human authorization received
  - Component supports read-only mode
- **Authorization Level**: Human (Johan) or delegated authority
- **Use Cases**:
  - Prevent state changes while preserving observability
  - Maintenance mode
  - Investigation mode

#### PROPOSAL_ONLY → READ_ONLY
- **Preconditions**:
  - Human authorization received
- **Authorization Level**: Human (Johan) or delegated authority
- **Use Cases**:
  - Proposal capability no longer needed
  - Degraded operation mode

#### READ_ONLY → VALIDATED
- **Preconditions**:
  - Human authorization received
- **Authorization Level**: Human (Johan) or delegated authority
- **Use Cases**:
  - Component requires re-validation
  - Significant changes require validation

---

## 7. Forbidden Transitions

### 7.1 Prohibited Direct Transitions

The following transitions are **strictly forbidden** and MUST NOT be implemented:

#### DORMANT → READ_ONLY (skip VALIDATED)
- **Rationale**: Components must pass technical validation before any operational use
- **Risk**: Unvalidated components may have critical defects or security vulnerabilities

#### DORMANT → PROPOSAL_ONLY (skip VALIDATED)
- **Rationale**: Proposal generation requires validated logic
- **Risk**: Invalid proposals could mislead humans or cause incorrect decisions

#### DORMANT → ACTIVE (skip all intermediate states)
- **Rationale**: Full activation requires validation and phased capability expansion
- **Risk**: Catastrophic failure, security breach, data corruption

#### VALIDATED → ACTIVE (without READ_ONLY or PROPOSAL_ONLY)
- **Rationale**: Unless explicitly authorized with risk acceptance
- **Risk**: Insufficient operational observation before full authority granted

#### READ_ONLY → DORMANT → ACTIVE (bypass validation)
- **Rationale**: Any return to DORMANT requires re-validation before re-activation
- **Risk**: Deactivation may have been due to issues requiring re-validation

### 7.2 Auto-Transition Prohibition

The following auto-transitions are **strictly forbidden**:

- **Auto-activation on deployment**: Component must not activate simply because it's deployed
- **Auto-activation on first request**: Component must not activate upon receiving first operational request
- **Time-based auto-activation**: Component must not activate based on scheduled time without human authorization
- **Event-based auto-activation**: Component must not activate in response to external events without human authorization
- **Dependency-based auto-activation**: Component must not activate when dependencies become available

**Exception**: Emergency deactivation (ACTIVE → DORMANT) MAY be automated per Section 8.

### 7.3 Enforcement

CI and runtime enforcement MUST:
- Block any code implementing forbidden transitions
- Validate activation state transitions during PR review
- Monitor for unauthorized state transitions at runtime
- Alert on any forbidden transition attempts

---

## 8. Emergency Disable Semantics

### 8.1 Emergency Deactivation Authority

**Emergency deactivation** is the immediate transition of a component to DORMANT state without standard authorization process.

**Authorized Triggers**:
1. **Security Incident**: Active breach, credential exposure, or exploit detected
2. **Critical Failure**: Component causing cascading failures or resource exhaustion
3. **Data Integrity Threat**: Risk of data corruption or loss
4. **Compliance Violation**: Component violating regulatory or governance requirements

### 8.2 Emergency Deactivation Process

**Immediate Action**:
1. Component transitions to DORMANT state immediately
2. All operational activity ceases
3. Emergency deactivation recorded in audit trail
4. Human authority (Johan) notified immediately

**No Intermediate States**: Emergency deactivation bypasses all intermediate states for speed.

### 8.3 Pre-Authorized Emergency Mechanisms

The following mechanisms MAY execute emergency deactivation without real-time human authorization (but require pre-authorization in governance):

- **Circuit breakers**: Detect cascading failures and auto-deactivate (per CASCADING_FAILURE_CIRCUIT_BREAKER.md)
- **Security monitors**: Detect active threats and auto-deactivate
- **Resource exhaustion guards**: Prevent system-wide impact by deactivating component
- **Compliance enforcers**: Detect violations and auto-deactivate

**Requirements**:
- Mechanism behavior MUST be pre-defined in governance
- Mechanism MUST be validated during commissioning
- Mechanism MUST create complete audit trail
- Human MUST be notified immediately
- Re-activation MUST require human authorization (no auto-recovery)

### 8.4 Post-Emergency Protocol

After emergency deactivation:

1. **Incident Investigation**: Determine root cause and remediation steps
2. **Re-Validation Required**: Component MUST be re-validated before re-activation
3. **Human Authorization Required**: Re-activation requires explicit human approval
4. **Evidence Documentation**: Complete incident report and remediation evidence
5. **Learning Promotion**: Update governance if emergency exposed gaps

**No Auto-Recovery**: Components MUST NOT automatically re-activate after emergency deactivation.

---

## 9. Rollback Rules

### 9.1 Rollback Definition

**Rollback** is the intentional reversal of a state transition that proves problematic.

Rollback may occur:
- Within same session (e.g., ACTIVE → PROPOSAL_ONLY immediately after activation)
- Across sessions (e.g., return to previous state after period of operation)

### 9.2 Standard Rollback (Reverse Transition)

Standard rollback follows reverse transition rules (Section 6.2):

- Component transitions to previous state via allowed reverse transition
- Human authorization required (per Section 5)
- Validation required to confirm component operates correctly in previous state
- Audit trail records rollback with rationale

### 9.3 Emergency Rollback

Emergency rollback to DORMANT follows emergency deactivation rules (Section 8).

### 9.4 Rollback with Re-Validation

If component returns to DORMANT, re-activation requires:

1. **Re-Validation**: Component must pass through VALIDATED state again
2. **Root Cause Analysis**: Understand why rollback was necessary
3. **Remediation**: Fix issues that caused rollback
4. **Evidence**: Document remediation and re-validation

**No Fast-Path Re-Activation**: Components cannot skip validation after returning to DORMANT.

### 9.5 Rollback Limitations

**Irreversible State Changes**: Rollback does NOT undo:
- Data written to production systems
- State changes in external systems
- Side effects already executed
- Audit trail entries

Rollback changes **future operational authority**, not past actions.

### 9.6 Rollback vs Version Rollback

**State Rollback**: Change component's activation state (this document)

**Version Rollback**: Deploy previous version of component code (per SYSTEM_COMMISSIONING_AND_PROGRESSIVE_ACTIVATION_PROTOCOL.md)

Version rollback to previously commissioned version may allow faster re-activation, but still requires:
- Human authorization for activation
- Validation that previous version is still appropriate

---

## 10. Component Categories and State Applicability

### 10.1 Application-Level Components

**Examples**: Complete applications (Foreman App, Builder Service)

**State Applicability**: All states (DORMANT → VALIDATED → READ_ONLY → PROPOSAL_ONLY → ACTIVE)

**Typical Path**: DORMANT → VALIDATED → COMMISSIONED → ACTIVE (per SYSTEM_COMMISSIONING_AND_PROGRESSIVE_ACTIVATION_PROTOCOL.md)

**Integration**: Application commissioning protocol maps to activation states:
- INSTALLED → DORMANT
- VALIDATED → VALIDATED
- COMMISSIONED → PROPOSAL_ONLY or READ_ONLY (depending on application)
- ACTIVATED → ACTIVE

---

### 10.2 Subsystem-Level Components

**Examples**: Authentication Module, Reporting Engine, Data Processor

**State Applicability**: All states

**Typical Path**: May progress through all states or skip based on subsystem capability

**Independence**: Subsystems may have different activation states than parent application

---

### 10.3 Capability-Level Components

**Examples**: Auto-scaling, Autonomous Decision-Making, External API Integration

**State Applicability**: All states

**Typical Path**: Often use PROPOSAL_ONLY before ACTIVE for high-risk capabilities

**Granular Control**: Allows selective activation of capabilities within same application

---

### 10.4 Read-Only Components

**Examples**: Reporting Tools, Analytics Dashboards, Audit Viewers

**State Applicability**: DORMANT → VALIDATED → READ_ONLY (terminal state)

**Typical Path**: DORMANT → VALIDATED → READ_ONLY (ACTIVE not needed)

**Permanent Read-Only**: These components never transition to ACTIVE

---

### 10.5 Autonomous Agents

**Examples**: AI Decision Makers, Automated Governance Enforcers

**State Applicability**: All states, with emphasis on PROPOSAL_ONLY

**Typical Path**: DORMANT → VALIDATED → READ_ONLY → PROPOSAL_ONLY → ACTIVE

**Trust Building**: PROPOSAL_ONLY phase critical for building human trust

---

## 11. Audit Trail Requirements

### 11.1 Required Audit Records

Every state transition MUST be recorded with:

1. **Component Identifier**: Unique ID of component
2. **Transition Details**:
   - Previous state
   - New state
   - Transition timestamp (ISO 8601)
   - Transition type (standard, emergency, rollback)
3. **Authorization Details**:
   - Authorizing entity (human or pre-authorized mechanism)
   - Authorization method
   - Authorization timestamp
4. **Context**:
   - Rationale for transition
   - Preconditions satisfied
   - Validation results (if applicable)
5. **Outcome**:
   - Transition success/failure
   - Post-transition validation results
   - Any issues detected

### 11.2 Audit Trail Format

**Recommended Structure**:

```markdown
# Component Activation State Audit Trail

## Component Information
- **Component ID**: [unique-identifier]
- **Component Name**: [human-readable name]
- **Component Type**: [application/subsystem/capability]
- **Component Scope**: [operational scope description]

## State Transition History

### Transition 1: DORMANT → VALIDATED
- **Timestamp**: 2025-12-24T10:00:00Z
- **Authorized By**: Johan Ras
- **Authorization Method**: Explicit approval via GitHub issue #123
- **Rationale**: Initial deployment validation
- **Preconditions**: Code deployed, validation plan approved
- **Outcome**: SUCCESS - Component passed all validation checks
- **Evidence**: [link to validation report]

### Transition 2: VALIDATED → READ_ONLY
- **Timestamp**: 2025-12-24T12:00:00Z
- **Authorized By**: Johan Ras
- **Authorization Method**: Explicit approval via GitHub comment
- **Rationale**: Enable read-only monitoring
- **Preconditions**: Validation complete, read-only capability verified
- **Outcome**: SUCCESS - Component operating in read-only mode
- **Evidence**: [link to read-only validation]

[... additional transitions ...]
```

### 11.3 Audit Trail Retention

Audit trails MUST be:
- Retained for component lifetime
- Version-controlled (committed to repository or governance evidence)
- Immutable (append-only)
- Accessible to auditors and governance administrators

### 11.4 Integration with Existing Audit Systems

This activation state audit trail integrates with:
- AUDIT_READINESS_MODEL.md (governance audit requirements)
- SYSTEM_COMMISSIONING_AND_PROGRESSIVE_ACTIVATION_PROTOCOL.md (application commissioning audit trail)
- Build effectiveness tracking
- Security incident response logs

---

## 12. Enforcement Mechanisms

### 12.1 Architecture Requirements

All component architectures MUST:

1. **Declare Activation States**: Document which states component supports
2. **Implement State Gates**: Prevent operations not authorized in current state
3. **State Checking**: Validate current state before operations
4. **State Transition Logic**: Implement controlled state transition mechanism
5. **Audit Trail Recording**: Log all state transitions

### 12.2 Runtime Enforcement

Components MUST:

- Check activation state before executing operations
- Reject operations not authorized in current state
- Refuse to self-transition without authorization
- Record all state checks and rejections in logs

### 12.3 Governance Gate Enforcement

PR gates MUST validate:

- Architecture documents activation state support
- Implementation includes state gate logic
- No auto-activation mechanisms present
- No forbidden transitions implemented

### 12.4 Monitoring and Alerting

Production monitoring MUST:

- Track component activation states
- Alert on unauthorized state transitions
- Detect components operating outside activation state
- Provide visibility into state transition history

---

## 13. Integration with Other Governance Artifacts

This activation state model integrates with:

- **SYSTEM_COMMISSIONING_AND_PROGRESSIVE_ACTIVATION_PROTOCOL.md**: Application-level activation states map to commissioning phases
- **DOMAIN_EVOLUTION_RULES.md**: Domain lifecycle states (ACTIVE, DEPRECATED, RETIRED) are distinct from component activation states
- **DOMAIN_STATE_ENFORCEMENT_RULE.md**: Components in ACTIVE state may only reference domains in ACTIVE lifecycle state
- **GOVERNANCE_PURPOSE_AND_SCOPE.md**: Defines roles and authorization authority
- **FOREMAN_AUTHORITY_AND_SUPERVISION_MODEL.md**: Defines Foreman's delegated authorization authority
- **CASCADING_FAILURE_CIRCUIT_BREAKER.md**: Defines emergency deactivation authority
- **AUDIT_READINESS_MODEL.md**: Defines audit trail requirements
- **ARCHITECTURE_COMPLETENESS_REQUIREMENTS.md**: Requires architecture to document activation state support

---

## 14. Roles and Responsibilities

### 14.1 Owner (Johan) Responsibilities

**Authorization**:
- Authorize component state transitions
- Review activation requests and evidence
- Grant or deny activation authorization
- Issue emergency deactivation orders (if needed)

**Oversight**:
- Monitor component activation states
- Review activation state audit trails
- Assess need for state rollbacks

**Prohibited Actions**:
- Delegating authorization to unauthorized entities
- Bypassing activation state gates

---

### 14.2 Foreman (FM) Responsibilities

**Architecture**:
- Design activation state gates for components
- Document activation state support in architecture
- Specify state transition requirements

**Coordination**:
- Prepare activation requests with evidence
- Present activation state recommendations to Johan
- Coordinate state transitions after authorization
- Maintain activation state audit trails

**Delegated Authority** (where granted):
- Authorize state transitions for builder agents per FOREMAN_AUTHORITY_AND_SUPERVISION_MODEL.md

**Prohibited Actions**:
- Self-authorizing state transitions without delegation
- Bypassing authorization gates
- Auto-activating components

---

### 14.3 Builder Responsibilities

**Implementation**:
- Implement activation state gates per architecture
- Implement state transition logic
- Ensure component respects activation state
- Implement audit trail recording

**Operation**:
- Request state transitions via FM
- Provide evidence for state transition requests
- Operate within current activation state

**Prohibited Actions**:
- Implementing auto-activation mechanisms
- Bypassing activation state gates
- Self-authorizing state transitions

---

### 14.4 Governance Administrator Responsibilities

**Governance**:
- Maintain this activation state model
- Audit component activation state compliance
- Verify activation state audit trails
- Identify activation state model improvements

**Delegated Authority** (where granted):
- Authorize state transitions for governance tooling

**Prohibited Actions**:
- Authorizing state transitions outside granted authority
- Weakening activation state requirements

---

## 15. Compliance and Standards Alignment

### 15.1 ISO 27001 Alignment

This activation state model satisfies:

- **A.12.1.2** (Change management): State transitions provide change control
- **A.12.1.4** (Separation of development, testing, and operational environments): State-based separation enforced
- **A.14.2.2** (System change control procedures): State transitions are controlled procedures
- **A.14.2.8** (System security testing): VALIDATED state ensures security testing
- **A.14.2.9** (System acceptance testing): State progression provides acceptance gates
- **A.18.2.3** (Technical compliance review): Audit trail supports compliance verification

### 15.2 NIST CSF Alignment

This activation state model supports:

- **ID.AM-1** (Physical devices and systems inventory): Activation states provide operational inventory
- **PR.IP-1** (Baseline configuration): States enforce configuration requirements
- **PR.AC-4** (Access permissions and authorizations): States control operational authority
- **DE.CM-7** (Monitoring for unauthorized activity): State enforcement detects unauthorized operations
- **RS.AN-1** (Notifications): State transitions trigger appropriate notifications
- **RS.MI-2** (Incidents are mitigated): Emergency deactivation provides mitigation capability

### 15.3 ISO 31000 Alignment (Risk Management)

This activation state model supports:

- **Progressive risk exposure**: Phased activation limits risk at each stage
- **Risk treatment**: State restrictions provide risk controls
- **Monitoring and review**: State transitions require validation and review
- **Emergency response**: Emergency deactivation provides rapid risk mitigation

---

## 16. Success Criteria

This activation state model succeeds when:

✅ **All components declare and respect activation states**  
✅ **No component activates without explicit authorization**  
✅ **State transitions are auditable and reversible**  
✅ **Emergency deactivation mechanisms exist and are validated**  
✅ **Activation state violations are detected and prevented**  
✅ **Progressive activation reduces operational risk**

---

## 17. Changelog

### Version 1.0 (2025-12-24)

**Status**: Initial Release  
**Authority**: Johan Ras  
**Trigger**: Issue G-C2 — Define Canonical Activation States & Transition Rules

**Summary**: Created canonical activation state model defining five states (DORMANT, VALIDATED, READ_ONLY, PROPOSAL_ONLY, ACTIVE), allowed and forbidden transitions, authorization requirements, rollback rules, and emergency disable semantics.

**Key Requirements Established**:
- Five canonical activation states with clear operational characteristics
- Progressive activation path with capability expansion
- Explicit authorization requirements for all state transitions
- Forbidden transitions and auto-activation prohibition
- Rollback rules with re-validation requirements
- Emergency deactivation authority and process
- Component-level activation state independence
- Complete audit trail requirements
- Compliance and standards alignment

**Effect**: Component operational authority is now explicitly governed through activation states, ensuring no component may operate beyond its authorized capability level without explicit authorization.

---

**End of ACTIVATION STATE MODEL**

---

**Document Metadata**:
- Document ID: ACTIVATION_STATE_MODEL_V1.0
- Authority: Canonical Governance Standard
- Integrates With: SYSTEM_COMMISSIONING_AND_PROGRESSIVE_ACTIVATION_PROTOCOL.md, DOMAIN_EVOLUTION_RULES.md, GOVERNANCE_PURPOSE_AND_SCOPE.md, FOREMAN_AUTHORITY_AND_SUPERVISION_MODEL.md, AUDIT_READINESS_MODEL.md
- Enforcement: Governance Gate + Architecture Review + Runtime Enforcement + Human Authority
