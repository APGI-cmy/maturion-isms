📄 ISMS MASTER SPECIFICATION — DESIGN NOTES (v0.1-Draft)
Integrated Security Management System (ISMS)
Architecture Notes, Concepts, and Principles — Collected Specification Draft
# 1. CORE PHILOSOPHIES
## 1.1 Minimum Human Dependency

Most incidents are auto-created.
Human interaction is workflow-guided.
Humans do not determine correctness — the system does.

Key points:

Humans cannot close incidents unless workflow is complete

Omissions require justification

AI evaluates evidence

Escalations are automated

Timers and rules govern completion

Structural mismatches create automated correction workflows

High-risk operations automatically become incidents

Performance management naturally emerges from workflow behaviour

# 2. ARC — Accountability–Responsibility Continuum

ARC is the ISMS’s governance fabric.
ARC applies across all modules and system behaviours.

## 2.1 ARC PRINCIPLES

Every entity/action has one accountable person

Accountability persists until responsibility is delegated

Responsibility cascades but accountability remains

Every delegation is tracked (ARC Trace)

Escalation always moves one level up

Escalation exhaustion becomes a maturity event

ARC violations generate structure-correction workflows

ARC behaviour feeds performance and maturity metrics

## 2.2 ARC TRACE

Tracks:

Accountability origin

Responsibility handovers

Timing

Deviations

Owner approvals

AI evaluations

Closure chain

ARC TRACE is used by:

Maturity Module

Assurance Engine

Performance reporting

Leadership evaluations

# 3. INCIDENT ENGINE (Governance Logic)
## 3.1 Incident Identity Anchors

Every incident contains:

Source (RADAM, RTAC, AI, manual, system-generated)

Owner (accountable)

Responsible Person (executor)

## 3.2 Workflow Completion Rules

All steps must be completed OR justified

Pauses create new subordinate workflows

AI evaluates evidence and rejects insufficient submissions

Incident remains open until fully compliant

Timer continues to run during corrections

## 3.3 Evidence Review Loop

User hits Complete

AI evaluates

AI requests corrections

User resubmits

Repeat until evidence meets requirements

If time expires → Failure-to-Complete incident auto-created

## 3.4 Two-Level Closure
Stage 1: Responsible person completes
Stage 2: Supervisor (one level up) closes

If no supervisor exists → Maturity scoring event.

# 4. ORGANOGRAM GOVERNANCE
## 4.1 Monthly Organogram Verification

Automatically generated incident:

Department head verifies team, shifts, supervisors, roles

Evidence uploaded

ARC principles enforced

## 4.2 Real-Time Organogram Monitoring

Whenever HR DB changes occur:

Promotion

Transfer

Shift rotation

Departure

System generates:

Organogram Mismatch Incident

→ Correct structure
→ Update team
→ Auto-reroute affected incidents

## 4.3 Wrong Assignment → Organogram Mismatch

If an incident reaches the wrong person:

Supervisor triggers Organogram Mismatch

Structure is corrected

Incident auto-rerouted

Event logged for maturity analytics

# 5. ESCALATION LOGIC

Always one level up (ARC rule)

Automatic reminders

Delays generate escalation incidents

If chain ends → maturity scoring event

Priority determines timing of reminders and escalations.

# 6. MATURITY ROADMAP INTEGRATION
Incident failures directly affect maturity scores in domains:

Leadership

Governance

Process Integrity

People & Culture

Protection

Assurance

Proof-It-Works

ARC behaviour is one of the strongest maturity indicators.
# 7. WIZARD-DRIVEN INCIDENT CREATION
Step 1: What do you want to report?

Work Activity

Incident

Project/Job-related Activity

Change Management

Other events

Step 2: Classification

AI suggests templates based on industry (Diamond Mining / Diamond Selling).

Step 3+: Guided steps

Conversational UI (Maturion) + Left panel structured wizard.

# 8. CATEGORY SYSTEM
## 8.1 Industry Templates (ICTL)

Stored templates for each industry:

Diamond Mining (Karowe)
Diamond Selling (Gaborone)

AI proposes category trees based on template + historical patterns.

## 8.2 Change Management for Categories

Category name changes require:

Risk assessment by AI

Change Management workflow

Custodian approval

Stakeholder communication

Change recorded as incident

# 9. PROJECT / JOB-RELATED PROJECT WIZARD

Integrated with PIT.

Steps include:

Project definition

Category tree (AI suggested)

Team formation

Milestones

Deliverables

Tasks

Evidence-driven workflows

Timeline integration with PIT

ARC-based owner/responsible assignment

ARC-based escalation

Locked timelines behave according to ARC + PIT rules.

# 10. PEOPLE & ENTITIES (POLE)

POLE model adopted:

People

Employees, contractors, visitors, suspects, law officials

ID scan capture

Role, team, hierarchy, job type

ARC integration

Objects

Tools, equipment, assets

Locations

Zones, high-risk sites

Events

Incidents, high-risk activities, access events, reviews

Spider diagrams link entities.

# 11. INTELLIGENCE ENGINE (Graph & Analysis)

Link analysis (spider diagrams)

Relationship discovery

Entity resolution

Clustering & anomaly detection

Integration with RADAM, RTAC, Investigations

ARC relationships also appear in graph as “Delegation Edges.”

# 12. SURVEILLANCE & ASSURANCE INTEGRATION

Tier 1 → Tier 2 → Tier 3
All feed into incident workflows.

RTAE adds assurance scoring for every incident.

# 13. RADAM — REMOTE ASSURANCE DATA ANALYTICS MODULE

Connects to operational databases

Rulesets detect deviations → incidents auto-created

AI learns patterns over time

Feeds RTAC and RTAE

Part of ACP & ARC

# 14. CHANGE MANAGEMENT GOVERNANCE

Any significant change triggers a Change Management Incident, including:

Category name changes

Structural (organogram) changes

Material procedural changes

Control changes

Change must be approved → ARC-tracked → Maturity-scored.

# 15. MATURION — THE AI ASSISTANT
Professional, slightly humorous personality
Responsibilities:

Suggest categories

Guide user through wizard

Evaluate evidence

Recommend corrections

Generate summaries

Detect anomalies

Conduct risk assessments

Help create workflows

Help design PIT timelines

Maturion operates inside ARC and cannot override ARC rules.

# 16. ACROSS-THE-PLATFORM INVARIANTS

These rules are system-wide:

ARC applies everywhere

Every workflow must have a closure pathway

AI cannot auto-close incidents

AI cannot reroute without a workflow

Escalation always 1 level up unless chain ends

End-of-chain = maturity event

All deviations must be captured

All omissions require justification

All evidence must be evaluated by AI

All changes require Change Management workflow

# 17. TRAINING MODULE — ARC COMPETENCY COURSE (Future)

ARC will be taught through:

Animated diagrams

Simulated workflows

Delegation exercises

ARC trace navigation

Assessment scenarios

UI overlays explaining ARC decisions

This will become part of onboarding.

# END OF FILE — (v0.1 — Draft)

To be expanded as design continues.