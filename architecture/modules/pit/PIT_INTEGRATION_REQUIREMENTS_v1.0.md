# 📘 PIT Integration Requirements v1.0

**Module:** PIT – Project Implementation Tracker  
**Version:** 1.0  
**Status:** Architecture Approved  
**Scope:** Defines how the PIT module integrates with the rest of the ISMS, with special emphasis on the Maturity module → PIT flow, WRAC/Risk flows, and feedback into Analytics & Dashboards.

---

## 0. Context

The PIT module is the central execution engine of the ISMS:

- It turns gaps, risks and decisions into projects, tasks and milestones.
- It receives work from Maturity, Risk, WRAC, Incident, Controls.
- It sends progress & completion signals back to Maturity, Remote Assurance, Analytics, Dashboards.

From the Integration Map, PIT owns: **project creation, task allocation, progress tracking, audit trail, and procurement references**.

---

## 1. Integration Principles

### Single Source of Truth
PIT is the only place where implementation work is created and tracked.

### Event-Driven Where Possible
Upstream modules emit events (e.g. `maturity.criteria_gap_detected`), PIT subscribes and creates work.

### Bidirectional Linking
Every PIT entity (project/task) must link back to the originating object (criterion, risk, incident, control, etc).

### Non-Blocking Analytic Flows
Analytics reads PIT data, but PIT does not depend on Analytics to function.

### No Business Logic Duplication
Upstream modules decide what is needed; PIT decides how and by when to implement.

---

## 2. Core Entities & IDs

### 2.1 PIT Entities

Minimal PIT entities:

- `pit_projects`
- `pit_milestones`
- `pit_tasks`
- `pit_task_comments`
- `pit_task_links` (generic cross-module links)
- `pit_project_roles` (owner, sponsor, implementer)
- `pit_audit_log`

### 2.2 Linking Back to Origin

Each PIT task created from another module must carry:

- `origin_module` (e.g. maturity, risk, incident)
- `origin_type` (e.g. criterion, mps, domain, risk_item, incident_case)
- `origin_id` (primary key in that module's table)
- `origin_path` (route path, e.g. `/maturity/domains/1/mps/3/criteria/10`)

This enables:

- Click-through from PIT → originating screen
- Analytics to aggregate by origin
- Maturity dashboards to show live implementation status per gap

---

## 3. Integration with Maturity Module

### 3.1 Triggers from Maturity → PIT

The Maturity module generates work for PIT in these situations:

1. **Criteria Gap Detected**  
   A criterion has a required maturity level (target_level) higher than its current level and lacks adequate evidence.

2. **Domain / MPS Approval With Conditions**  
   Approver approves with conditions, which must be implemented.

3. **External Auditor Findings**  
   Independent auditor rejects evidence or requires specific remediation steps.

4. **Maturity Cycle Planning**  
   At the start of a yearly journey, PIT receives a batch of planned improvement projects derived from the gap analysis.

### 3.2 Event Definitions

#### Event: `maturity.criteria_gap_detected`

**Emitted when:**
- A criterion is evaluated and found below target, OR
- Evidence AI evaluation marks it as insufficient for the target level.

**Payload (conceptual):**

```json
{
  "eventType": "maturity.criteria_gap_detected",
  "orgId": "string",
  "domainId": "string",
  "mpsId": "string",
  "criterionId": "string",
  "currentLevel": "basic" | "reactive" | "compliant" | "proactive" | "resilient",
  "targetLevel": "basic" | "reactive" | "compliant" | "proactive" | "resilient",
  "description": "string",
  "recommendedActions": ["string"],
  "severity": "low" | "medium" | "high",
  "suggestedDueDate": "string | null",
  "originUrl": "string"
}
```

PIT must listen to this event and create either:
- A new project (for major gaps), or
- One or more tasks in an existing project (for smaller gaps).

#### Event: `maturity.approval_with_conditions`

**Emitted when** a Domain or MPS is approved but with explicit conditions.

**Payload:**

```json
{
  "eventType": "maturity.approval_with_conditions",
  "orgId": "string",
  "level": "domain" | "mps",
  "domainId": "string",
  "mpsId": "string",
  "conditions": ["string"],
  "approverId": "string",
  "deadline": "string",
  "originUrl": "string"
}
```

PIT turns each condition into a task with:
- `origin_module = "maturity"`
- `origin_type = "domain" | "mps"`
- `origin_id = domainId or mpsId`

#### Event: `maturity.external_audit_finding`

**Emitted when** an external auditor captures a finding.

**Payload:**

```json
{
  "eventType": "maturity.external_audit_finding",
  "orgId": "string",
  "criterionId": "string",
  "auditorId": "string",
  "severity": "minor" | "major" | "critical",
  "findingSummary": "string",
  "recommendedActions": ["string"],
  "dueDate": "string",
  "originUrl": "string"
}
```

PIT must always create tasks for these with appropriate severity and owner.

### 3.3 Data Contract: PIT → Maturity (Feedback)

PIT provides status data back to the Maturity module so that:

- Maturity dashboards show implementation progress for each domain/MPS/criterion.
- The house model reflects not just maturity score but also "work-in-progress" status.

For each criterion, Maturity needs:

- `openTasksCount`
- `completedTasksCount`
- `latestTaskDueDate`
- `hasOverdueTasks`
- `completionRatio` (per criterion or per MPS/domain)
- `lastUpdatedAt`

PIT must expose:

- A query/API: `getTasksByOrigin(orgId, origin_module, origin_type, origin_id)`
- Or a view: `maturity_pit_status_view` driven off `pit_task_links`.

---

## 4. Integration with Risk, WRAC and Controls

From the Integration Map, Risk & WRAC feed into PIT after prioritisation.

### 4.1 Threat/Vulnerability/Risk → WRAC → PIT

**Flow (simplified):**

1. Threats & vulnerabilities identified
2. Risk assessment performed
3. WRAC prioritizes risk items and recommends controls
4. Export to PIT for implementation of controls

PIT must support:

- `origin_module = "risk"` with `origin_type = "risk_item"`
- `origin_module = "wrac"` with `origin_type = "wrac_entry"`
- Ability to aggregate tasks by risk category, facility, process etc.

### 4.2 Controls & CCR (Critical Control Register)

Where maturity criteria map directly to controls:

- PIT tasks must be linkable to CCR entries.
- Analytics can then report "Implementation status of critical controls tied to maturity criteria".

---

## 5. Integration with Incident & Intelligence

From Integration Map: Incident & Intel feed anomalies and threat drift, which may create new work.

**Requirements:**

- `incident.new_case` → may create PIT tasks for corrective actions.
- `incident.repeated_pattern_detected` → may trigger both risk reassessment and PIT implementations.
- Maturity may see evidence from Incident module as part of "Proof It Works".

PIT must support:

- `origin_module = "incident"`
- `origin_type = "incident_case" | "pattern"`

---

## 6. Integration with Analytics & Remote Assurance

### 6.1 Analytics

Analytics reads PIT data to:

- Show implementation velocity (tasks completed per week/month).
- Correlate maturity improvements with task completion.
- Highlight stalled improvements (e.g., open tasks older than X days).

**Requirements:**

PIT must provide queryable aggregates by:

- org → domain → MPS → criterion
- module (maturity, risk, incident, etc.)
- severity
- due date status

### 6.2 Remote Assurance

Remote Assurance uses PIT completion + evidence to validate that controls are operational.

**Integration:**

1. PIT signals "implementation done".
2. Evidence module and Remote Assurance verify "implementation effective".
3. Maturity and Risk may update scores accordingly.

---

## 7. User Roles & Permissions (Cross-Module)

**Roles (from True North & ISMS):**

- **Org Lead / Owner** – owns overall program, sees all PIT projects.
- **Domain Implementer** – sees tasks linked to their domains/MPS.
- **Evidence Manager** – can view tasks and mark evidence-related tasks as ready.
- **PIT Manager** – manages projects, assignments, timelines.
- **External Auditor** – can view PIT items linked to specific audit findings.

**Rules:**

- Maturity module can suggest owners for tasks (e.g. domain implementer), PIT enforces final assignment authority.
- External auditor can create findings that generate tasks but cannot assign those tasks without org approval (depends on your governance decisions; you can tighten later).

---

## 8. Error Handling & Edge Cases

- If a PIT task is deleted or archived, the origin module (e.g. Maturity) must treat it as "no active implementation" and may prompt a new PIT entry.
- If Maturity upgrades a criterion's target level, PIT must:
  - Check existing tasks for that criterion
  - Mark them as obsolete or extend them
  - Or create new tasks for the new target level.
- **Duplicates:** multiple gaps from Maturity must be merged or grouped in PIT where sensible (e.g., "Implement ISMS policy framework" instead of 25 micro-tasks, depending on configuration).

---

## 9. QA Requirements for Integration

For PIT integration to be "green":

1. Events are emitted correctly from Maturity (and Risk/Incident) with valid payloads.
2. PIT creates projects/tasks accordingly.
3. Back-links (origin → PIT and PIT → origin) work and are clickable.
4. Maturity dashboard correctly reflects PIT status.
5. No orphan PIT tasks exist without a valid origin.
6. Analytics can query PIT data by origin and produce correct summaries.

**Integration tests must be added to:**

- `src/modules/maturity/tests/pit-integration.test.ts`
- `src/modules/pit/tests/maturity-integration.test.ts`
- `src/modules/analytics/tests/pit-analytics.test.ts`

---

## 10. Versioning & Evolution

This is **PIT Integration Requirements v1.0**.

Any change to:

- Maturity → PIT event shapes
- PIT → Maturity status contracts
- Origin linkage model

**MUST update:**

- This document
- Maturity Module Architecture
- PIT Module Architecture
- QA Test Suites

---

✅ **End of PIT Integration Requirements v1.0**
