# Intelligence & Investigations Module
## Integrated Security Management System (ISMS)
### Entity Intelligence, Investigative Governance & Evidential Integrity
### Version: v1.0 (Design Locked)

---

## 1. PURPOSE & POSITIONING

The Intelligence & Investigations Module is the **sense-making and truth-finding layer** of the ISMS.

This module:
- Converts incidents, data signals, and events into intelligence
- Models people, objects, locations, and events (POLE)
- Visualises relationships through graph/spider diagrams
- Governs investigations through structured workflows
- Manages evidence with court-defensible integrity
- Feeds insight back into IWMS, RTAE, and maturity scoring

It answers the question:

> **“What does this really mean, who is involved, and can we prove it?”**

---

## 2. DESIGN PHILOSOPHY

### 2.1 Intelligence Is Structured, Not Intuitive
- Intelligence is built from verified entities and relationships
- Narratives are evidence-driven
- Conclusions must be reproducible

### 2.2 Investigations Are Governed
- No arbitrary investigations
- Every investigation has:
  - A trigger
  - An accountable owner (ARC)
  - A workflow
  - Oversight
  - Closure criteria

---

## 3. POLE ENTITY MODEL

The Intelligence module is built on the **POLE model**:

- **People**
- **Objects**
- **Locations**
- **Events**

All intelligence is a relationship between these four entity types.

---

## 4. PEOPLE ENTITY

People entities may include:
- Employees
- Contractors
- Suppliers
- Customers
- Visitors
- Law enforcement officials
- Persons of interest
- Suspects

### Attributes (examples):
- Identity (ID scan preferred)
- Role / designation
- Organisation / employer
- Employment status
- Team / shift
- Access rights
- ARC relationships

Human-in-the-loop verification is mandatory for identity capture.

---

## 5. OBJECT ENTITY

Objects include:
- Assets
- Tools
- Equipment
- Vehicles
- Documents
- Evidence items

Attributes:
- Unique identifier
- Ownership
- Location history
- Status
- Associated incidents
- Chain-of-custody state

---

## 6. LOCATION ENTITY

Locations include:
- Sites
- Zones
- Rooms
- Restricted areas
- Virtual locations (systems, databases)

Attributes:
- Risk level
- Control requirements
- Surveillance coverage
- Historical incidents

---

## 7. EVENT ENTITY

Events include:
- Incidents
- Near misses
- High-risk operations
- Access events
- Surveillance observations
- Investigation actions

Events are **time-bound and immutable**.

---

## 8. RELATIONSHIP GRAPH (SPIDER DIAGRAMS)

The Intelligence module visualises POLE relationships as graphs.

```mermaid
graph TD
    P1[Person]
    O1[Object]
    L1[Location]
    E1[Event]

    P1 -->|Handled| O1
    O1 -->|Located at| L1
    E1 -->|Occurred at| L1
    P1 -->|Involved in| E1
Graphs enable:

Pattern recognition

Link discovery

Anomaly identification

Investigative hypothesis testing

9. INTELLIGENCE INGESTION SOURCES
Intelligence inputs originate from:

IWMS incidents

RADAM detections

RTAC triggers

Surveillance metadata

Evidence uploads

External systems (where authorised)

Manual investigator input (governed)

All inputs are traceable to source.

10. INVESTIGATION INITIATION
Investigations may be initiated by:

Incident escalation

AI recommendation

Assurance failure

Pattern detection

Management decision

Regulatory requirement

Each initiation:

Creates an Investigation Case

Assigns an accountable owner (ARC)

Generates a workflow

Defines scope and objectives

11. INVESTIGATION WORKFLOW GOVERNANCE
Investigations are executed through workflows, including:

Case planning

Evidence collection

Interviews

Analysis

Findings

Recommendations

Closure

Mandatory controls:

Oversight layer (Investigation Manager)

Evidence requirements

Time constraints

Audit trail

12. INTERVIEWS & STATEMENTS
12.1 Interview Capture
Interviews may be recorded (mobile or desktop)

Audio/video ingestion supported

Transcription generated automatically

12.2 AI-Assisted Statement Compilation
AI structures interviews into formal statements

Human review is mandatory

Original recordings are preserved

Statement versions are immutable once approved

This ensures consistency and reduces investigator bias.

13. EVIDENCE MANAGEMENT & CHAIN OF CUSTODY
Evidence management is court-defensible by design.

Controls include:

Unique evidence identifiers

Hashing / integrity checks

Access control

Time-stamped handling records

ARC-assigned accountability

Mandatory deviation reporting

Evidence deviation automatically creates an incident.

14. INVESTIGATION ↔ IWMS INTEGRATION
Investigations are linked to originating incidents

Investigation outcomes may:

Close incidents

Escalate incidents

Create new incidents

Investigation workflows are governed the same way as incidents

15. INTELLIGENCE ↔ RADAM / RTAC
RADAM patterns may trigger investigations

RTAC real-time failures may require investigation

Investigation findings refine RADAM rulesets

Feedback loops improve detection accuracy

16. INTELLIGENCE ↔ RTAE
Investigation outcomes validate or invalidate controls

Findings affect assurance confidence

Recurrent findings reduce assurance scores

Verified controls increase assurance strength

17. ARC IN INVESTIGATIONS
ARC governs investigations fully:

One accountable investigation owner

Delegated investigative responsibility tracked

Oversight enforced

Escalation rules apply

Closure requires supervisory approval

18. MATURITY & PERFORMANCE FEEDBACK
Investigation behaviour feeds maturity scoring:

Quality of investigations

Timeliness

Evidence integrity

Oversight effectiveness

Recurrence of similar findings

Investigations are a lead indicator of organisational integrity.

19. SECURITY, ETHICS & COMPLIANCE
Strict access control

Privacy-aware design

Jurisdictional compliance

Separation of duties

Audit readiness

Ethical misuse of intelligence is itself an incident.

20. SUMMARY
The Intelligence & Investigations Module ensures that:

Data becomes insight

Insight becomes truth

Truth becomes action

Action becomes governance

Governance becomes maturity

It is the analytical conscience of the ISMS.

END OF FILE — Intelligence_Investigations.md