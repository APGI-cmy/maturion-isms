# ARC — Accountability–Responsibility Continuum
## Integrated Security Management System (ISMS)
### Governance Law, Performance Framework & Architectural Invariant
### Version: v1.0 (Locked Design)

---

## 1. PURPOSE & POSITIONING

ARC (Accountability–Responsibility Continuum) is a **system-wide governing law** of the ISMS.

ARC defines how:
- Accountability is assigned
- Responsibility is delegated
- Oversight is enforced
- Escalation is executed
- Performance is measured
- Organisational maturity is evaluated

ARC is **not a module**.
ARC is a **cross-cutting invariant** that applies to **every module, workflow, task, incident, project, deviation, and change**.

---

## 2. CORE ARC PRINCIPLE

> **Everything has exactly one accountable person.  
That person remains accountable until responsibility is explicitly delegated.  
Responsibility may cascade, but accountability persists.  
Each accountability level has oversight over the responsibilities it assigned.**

This principle applies without exception.

---

## 3. DEFINITIONS

### 3.1 Accountable Person
The individual who:
- Ultimately owns the outcome
- Has oversight responsibility
- Must ensure completion, correctness, and closure
- Retains accountability even after delegation

### 3.2 Responsible Person
The individual who:
- Executes the assigned work
- Completes workflow steps
- Provides evidence
- May further delegate responsibility (with traceability)

### 3.3 ARC Trace
A complete, immutable record of:
- Accountability origin
- Responsibility delegations
- Timing of handovers
- Oversight decisions
- Escalations
- Deviations
- Closure approvals

ARC Trace is a **first-class data object**.

---

## 4. ARC RULES (SYSTEM INVARIANTS)

### ARC-1: Single Accountability
Every entity must have **exactly one accountable person**:
- Incident
- Workflow
- Step
- Task
- Project
- Milestone
- Deliverable
- Deviation
- Change request
- Organogram update

No exceptions.

---

### ARC-2: Accountability Persists
Accountability **never disappears**.
Delegation transfers responsibility, **not accountability**.

---

### ARC-3: Responsibility Cascades
Responsibility may cascade through multiple levels.
Each delegation:
- Is explicit
- Is time-stamped
- Is attributable
- Creates oversight obligations upstream

---

### ARC-4: Oversight Is Mandatory
Each accountability level must:
- Monitor downstream execution
- Review outcomes
- Participate in escalation when required

Oversight failure is itself a performance signal.

---

### ARC-5: Escalation Is One Level Up
All escalations:
- Move **exactly one level up** the organisational hierarchy
- Follow the defined organogram
- Cannot skip levels

---

### ARC-6: Escalation Exhaustion
If escalation reaches the top of the hierarchy:
- Escalation stops
- The outcome becomes a **maturity signal**
- The event feeds the **Operational Maturity Platform**

---

### ARC-7: No Silent Rerouting
ARC **never allows silent reassignment**.
Structural mismatches must trigger:
- A workflow
- A correction process
- An audit trail

---

## 5. ARC TRACE LIFECYCLE

```mermaid
flowchart TD
    A[Accountable Assigned] --> B[Responsibility Delegated]
    B --> C[Work Executed]
    C --> D[Evidence Submitted]
    D --> E[Oversight Review]
    E -->|Approved| F[Closure]
    E -->|Rejected| G[Correction Loop]
    G --> C
Each node and transition is recorded in ARC Trace.

6. ARC DELEGATION MODEL
mermaid
Copy code
flowchart LR
    A[Department Head<br/>Accountable]
    B[Supervisor<br/>Responsible]
    C[Team Lead<br/>Responsible]
    D[Executor<br/>Responsible]

    A -->|Delegates| B
    B -->|Delegates| C
    C -->|Delegates| D
Accountability remains with A

Oversight exists at A → B → C

Performance can be measured at each level

7. ARC ESCALATION MODEL
mermaid
Copy code
flowchart BT
    L4[Top of Hierarchy]
    L3[Department Head]
    L2[Supervisor]
    L1[Responsible Person]

    L1 -->|Overdue / Failure| L2
    L2 -->|Unresolved| L3
    L3 -->|Unresolved| L4
    L4 -->|No Further Escalation| M[Maturity Signal]
8. ARC & PERFORMANCE MANAGEMENT
ARC enables hierarchical performance analytics:

Delegation depth

Delegation speed

Oversight effectiveness

Correction responsiveness

Escalation frequency

Escalation exhaustion events

These metrics:

Are objective

Are evidence-based

Do not rely on subjective reporting

9. ARC & OPERATIONAL MATURITY
ARC feeds directly into maturity domains, including:

Leadership & Governance

Process Integrity

People & Culture

Proof-It-Works

Examples:

Unresolved escalations → maturity degradation

Clean ARC traces → maturity improvement

Frequent organogram mismatches → governance weakness

Strong oversight → leadership maturity

10. ARC & ORGANOGRAM INTEGRITY
ARC depends on a living organogram.

Therefore:

Organogram changes trigger workflows

Monthly organogram verification is mandatory

Structural mismatches generate correction incidents

ARC routing always uses the current verified structure

11. ARC & AI (MATURION)
AI responsibilities under ARC:

Suggest delegations

Detect ARC violations

Highlight oversight gaps

Generate ARC summaries

Recommend escalation

AI cannot:

Change accountability

Reroute incidents silently

Close ARC chains autonomously

Human authority is preserved.

12. ARC & TRAINING
ARC is not only enforced — it is taught.

ARC will exist as:

A training course

An onboarding tutorial

An interactive simulation

A visual ARC Trace explorer

Understanding ARC is mandatory for:

Supervisors

Managers

Project owners

Incident owners

Platform custodians

13. ARC SUMMARY (NON-NEGOTIABLE)
ARC applies everywhere

Accountability is never ambiguous

Responsibility is always traceable

Oversight is enforceable

Escalation is structured

Maturity is measurable

Performance is visible

ARC is the governance backbone of the ISMS.

END OF FILE — ARC.md