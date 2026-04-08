# IWMS — Incident Workflow Management System
## Integrated Security Management System (ISMS)
### Core Execution Engine for Incidents, High-Risk Operations & Governed Work
### Version: v1.0 (Design Locked)

---

## 1. PURPOSE & POSITIONING

The Incident Workflow Management System (IWMS) is the **execution backbone** of the ISMS.

IWMS:
- Governs incidents, high-risk operations, work activities, and change events
- Converts events into **workflows**
- Enforces **ARC (Accountability–Responsibility Continuum)**
- Ensures completion through evidence, escalation, and oversight
- Feeds assurance, risk, maturity, and ROI analytics

IWMS is **not a passive logging system**.  
It is an **active governance engine**.

---

## 2. CORE DESIGN PHILOSOPHY

### 2.1 Minimum Human Dependency

- Most incidents are **auto-created**
- Human input is **guided by workflows**
- Humans do not decide “what is complete” — the system does
- Incident closure is enforced through:
  - Workflow completion
  - Evidence validation
  - AI evaluation
  - Supervisory oversight
- Memory, discretion, and informal processes are removed as dependencies

---

## 3. IWMS GOVERNING LAWS

IWMS operates under the following non-negotiable laws:

1. **Every high-risk operation becomes an incident**
2. **Every incident becomes a workflow**
3. **Every workflow becomes a control**
4. **Every control becomes an assurance metric**
5. **Every assurance metric becomes risk reduction**
6. **Every risk reduction becomes measurable ROI**
7. **ARC governs everything**

---

## 4. INCIDENT MODEL

### 4.1 Incident Identity Anchors

Every incident contains three immutable anchors:

#### 1. Source
Indicates how the incident was created:
- RADAM
- RTAC
- Surveillance (Tier 1 / 2 / 3)
- AI anomaly detection
- Manual user action
- External provider
- System-generated (overdue, mismatch, audit)

#### 2. Owner (Accountable)
- Derived from organisational hierarchy and incident category
- Retains accountability until closure
- May delegate responsibility but not accountability

#### 3. Responsible Person
- Executes workflow steps
- May delegate responsibility further
- All delegation is tracked via ARC Trace

---

## 5. INCIDENT CREATION — WIZARD MODEL

Incident creation is **wizard-driven**, not form-driven.

### Step 1 — What do you want to report?
- Work Activity
- Incident
- High-Risk Operation
- Project / Job-Related Work
- Change Management
- Other Governed Event

### Step 2 — Classification
- AI proposes industry-specific category trees
- Categories are selected, not typed (analytics integrity)
- Industry templates supported (e.g. Diamond Mining, Diamond Selling)

### Step 3 — Context & Scope
- Location
- People / Objects / Assets involved (POLE)
- Risk level
- Time sensitivity

### Step 4 — Confirmation
- Accountability auto-assigned (ARC)
- Workflow auto-generated
- Timers start immediately

---

## 6. INCIDENT LIFECYCLE

```mermaid
stateDiagram-v2
    [*] --> Open
    Open --> InProgress
    InProgress --> HalfClosed : Responsible completes
    HalfClosed --> InProgress : AI requests correction
    HalfClosed --> PendingClosure : AI satisfied
    PendingClosure --> Closed : Supervisor approves
    PendingClosure --> InProgress : Rejected
    Closed --> [*]
7. WORKFLOW EXECUTION RULES
7.1 Mandatory Steps
All workflow steps must be:

Completed, or

Explicitly justified if not applicable

Justifications are audited and analysed

7.2 Pausing Steps
Steps may be paused when information is unavailable

A paused step creates a subordinate open workflow

Parent incident cannot close until all sub-workflows are resolved

8. AI EVIDENCE REVIEW LOOP (“HALF-CLOSED STATE”)
Responsible person clicks Complete

AI evaluates:

Evidence sufficiency

Consistency

Contradictions

Missing artefacts

AI responds with required actions (e.g. add photo, clarify narrative)

Incident enters Half-Closed state

Responsible person updates and resubmits

Loop repeats until compliant

Timers continue running throughout.

If the allowed completion time is exceeded:

A Failure-to-Complete-in-Time incident is auto-created

Standard escalation rules apply

9. TWO-LEVEL CLOSURE MODEL
Level 1 — Responsible Person
Executes workflow

Submits evidence

Receives AI evaluation

Level 2 — Supervisor (Always One Level Up)
Supervisor may:

Approve closure

Reject (creates corrective workflow)

Request additional evidence

Trigger Organogram Mismatch workflow

Override AI (with justification)

If escalation reaches the top of the hierarchy:

Escalation stops

Outcome becomes an operational maturity signal

10. ESCALATION MODEL
mermaid
Copy code
flowchart BT
    R[Responsible Person]
    S[Supervisor]
    D[Department Head]
    T[Top of Hierarchy]
    M[Maturity Impact]

    R -->|Overdue / Non-compliance| S
    S -->|Unresolved| D
    D -->|Unresolved| T
    T -->|No Further Escalation| M
Escalation always follows ARC.

11. ORGANOGRAM GOVERNANCE
11.1 Monthly Verification
Once per month:

System generates Organogram Verification Incidents

Department heads verify:

Team composition

Shifts

Supervisory lines

Role assignments

Evidence required

Non-completion escalates

Escalation exhaustion feeds maturity scoring

11.2 Real-Time Monitoring
HR system changes trigger governance workflows:

Promotions

Transfers

New hires

Terminations

Shift changes

12. ORGANOGRAM MISMATCH WORKFLOW
Formerly “Wrong Assignment”.

Triggered when:

Incident routes to incorrect person

Role no longer exists

Structural inconsistency detected

mermaid
Copy code
flowchart TD
    A[Incident Routed Incorrectly]
    B[Organogram Mismatch Incident]
    C[Department Head Review]
    D[Structure Corrected]
    E[AI Verifies]
    F[Incident Re-routed]

    A --> B --> C --> D --> E --> F
Purpose:

Structural correction

Guaranteed routing accuracy

Governance, not blame

13. CATEGORY GOVERNANCE
Categories are analytics-critical

Category names cannot be changed silently

Any change requires:

AI risk assessment

Change Management workflow

Custodian approval

Stakeholder notification

Audit trail

14. PROJECT & PIT INTERACTION
Projects may be created in IWMS or PIT

IWMS governs:

Accountability

Workflow execution

Evidence

Assurance

PIT governs:

Timelines

Scheduling

Task loading

When integrated:

Workflow completion updates PIT tasks

PIT timeline changes inform IWMS monitoring

Both systems can operate independently.

15. EXTERNAL PARTICIPATION
IWMS supports controlled access for:

External service providers

Auditors

Regulators

Access is:

Role-restricted

Evidence-scoped

ARC-governed

Fully audited

16. INTEGRATION POINTS
IWMS integrates with:

ARC (governance)

RADAM (auto-incident creation)

RTAC (real-time detection)

RTAE (assurance metrics)

Maturity Roadmap

Intelligence & Investigations

PIT

17. SUMMARY
IWMS ensures that:

Nothing important is unmanaged

Nothing closes without proof

Nothing escalates without structure

Nothing fails without visibility

IWMS converts operations into governance,
and governance into measurable performance.

END OF FILE — IWMS.md