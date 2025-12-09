# GAP PRIORITY ENGINE v1.0 — PIT HANDLING RULES & WORKFLOW

**Module:** PIT (Project Implementation Tracker)  
**Version:** 1.0  
**Status:** Architecture Approved  
**Part:** 3 of 4 — PIT Handling Logic & Workflow

---

## 0. Purpose

This document defines how the Gap Priority Engine's output drives PIT task and project creation, including:

- **Handling rules** based on priority levels and gap characteristics
- **Task creation payloads** and field mappings
- **Deduplication logic** to prevent duplicate tasks
- **Task lifecycle states** and state transitions
- **Feedback loops** from PIT back to Maturity scoring
- **UI integration requirements** for displaying PIT-Maturity linkage

This is Part 3 of the 4-part Gap Priority Engine specification:
- **Part 1:** Overview, Inputs, Outputs, Numeric Priority Model
- **Part 2:** AI Reasoning Layer (Interpretation & Explanation)
- **Part 3:** PIT Handling Rules & Workflow *(this document)*
- **Part 4:** QA Tests & Validation Requirements *(planned)*

### Context

Parts 1 and 2 defined how gaps are identified, scored, and explained. Part 3 defines what happens next: how these prioritized gaps translate into actionable PIT tasks and projects, how duplicates are prevented, and how task completion feeds back into maturity scoring.

### Design Principles

1. **Automated Task Creation:** Priority levels drive automatic PIT task/project generation
2. **No Duplicates:** Robust deduplication prevents redundant work
3. **Traceable Lifecycle:** Every task state change is logged and auditable
4. **Bidirectional Integration:** PIT completion triggers maturity re-scoring
5. **User-Centric UI:** Maturity views show linked tasks and improvement status
6. **Escalation Clarity:** Overdue and critical tasks trigger clear notifications

---

## 1. Recommended Handling Rules

Based on the `priority_level` (from Part 1) and `origin_type` (criterion/MPS/domain), the Gap Priority Engine recommends specific PIT actions.

### 1.1 Criterion-Level Handling

Criteria are the most granular gaps and typically map to individual PIT tasks.

| Priority Level | Recommended Action | Due Date | Owner Assignment | Notifications |
|---------------|-------------------|----------|------------------|---------------|
| **Low** (0.00-0.50) | **Defer** or batch with other low-priority items | Next cycle end (90-120 days) | Domain Owner (default) | None |
| **Medium** (0.51-1.50) | **Create Task** | 60-90 days | Domain Owner or Security Manager | Standard task creation email |
| **High** (1.51-2.50) | **Create Task** (urgent) | 30 days | Security Manager or CISO | Urgent task email + dashboard alert |
| **Critical** (2.51+) | **Create Task** + **Escalate** | 14 days or less | CISO + Domain Owner | Immediate notification to CISO and Org Admin |

#### Additional Rules

- **Criticality Override:** If `criticality = critical` (from Part 1 inputs), minimum priority is `high` regardless of score
- **Regulatory Override:** If `regulatory_relevance = high` and audit is upcoming (<90 days), escalate to `high` priority minimum
- **Risk Override:** If `linked_risks.max_severity = critical`, minimum priority is `high`
- **Time Override:** If `time_exposed_days > 365` (chronic gap), escalate by one priority level

### 1.2 MPS-Level Handling

MPS gaps indicate multiple related criteria are underperforming. These warrant project-level coordination.

| Priority Level | Recommended Action | Scope | Owner Assignment |
|---------------|-------------------|-------|------------------|
| **Low** | Monitor individual criterion tasks | No separate action | Domain Owner |
| **Medium** | **Create Project** grouping criterion tasks | All criteria in MPS | Domain Owner |
| **High** | **Create Project** + assign dedicated resources | All criteria in MPS + cross-domain coordination | Security Manager + Domain Owner |
| **Critical** | **Create Strategic Initiative** + executive oversight | All criteria in MPS + risk register linkage | CISO + Executive Sponsor |

### 1.3 Domain-Level Handling

Domain gaps indicate systemic issues requiring strategic initiatives.

| Priority Level | Recommended Action | Scope | Owner Assignment |
|---------------|-------------------|-------|------------------|
| **Low** | Monitor individual MPS/criterion tasks | No separate action | Domain Owner |
| **Medium** | **Create Domain Improvement Plan** | All underperforming MPS in domain | Domain Owner + Security Manager |
| **High** | **Create Strategic Project** | Domain-wide transformation | CISO + Domain Owner + Executive Sponsor |
| **Critical** | **Create Emergency Response Plan** + board notification | Organization-wide impact assessment | CEO/Board + CISO |

---

## 2. Task Creation Payload

When a gap triggers PIT task creation, the following payload is generated:

### 2.1 Core Task Structure

```typescript
interface PitTaskFromGap {
  // Task Identification
  task_id: string;                    // Auto-generated UUID
  task_name: string;                  // "Close maturity gap: {criterion_name}"
  task_type: 'task' | 'project' | 'initiative';
  
  // Origin Tracking (for deduplication)
  origin_module: 'maturity';
  origin_type: 'criterion' | 'mps' | 'domain';
  origin_id: string;                  // UUID of criterion/MPS/domain
  cycle_id: string;                   // Maturity cycle that detected the gap
  
  // Organizational Context
  org_id: string;
  domain_id: string;
  domain_name: string;
  mps_id?: string;                    // Optional (null for domain-level gaps)
  mps_name?: string;
  criterion_name?: string;            // Optional (null for MPS/domain-level gaps)
  
  // Priority & Severity
  priority: 'low' | 'medium' | 'high' | 'critical';
  severity: 'low' | 'medium' | 'high' | 'critical';
  priority_score: number;             // From Part 1 calculation
  priority_calculation: object;       // Full breakdown from Part 1 (for audit)
  
  // Gap Context
  gap_size: number;                   // 1-4 levels
  current_level: number;              // 1-5
  target_level: number;               // 1-5
  
  // AI-Generated Content (from Part 2)
  reasoning_summary: string;          // 1-3 sentence explanation (from AI)
  recommended_actions: string[];      // 2-5 actionable steps (from AI)
  ai_recommendations: object;         // Full AI output from Part 2
  
  // Assignment & Deadlines
  assigned_to?: string;               // User ID (initially null, assigned by rules)
  assigned_role: string;              // e.g., "domain_owner", "security_manager", "ciso"
  due_date: string;                   // ISO 8601 date, derived from priority level
  escalation_date?: string;           // Auto-set for critical tasks
  
  // Status & Lifecycle
  status: 'open';                     // Initial status (see Section 4)
  created_at: string;                 // ISO 8601 timestamp
  created_by: 'system';               // Automated creation
  
  // Linked Data
  linked_risks: string[];             // UUIDs of linked risk items
  linked_incidents: string[];         // UUIDs of linked incidents
  compliance_frameworks: string[];    // e.g., ["ISO 27001", "SOC 2"]
  
  // Metadata
  tags: string[];                     // Auto-generated: ["maturity", "gap", domain_name, mps_name]
  origin_url: string;                 // Deep link to maturity criterion/MPS/domain view
}
```

### 2.2 Field Derivation Rules

| Field | Derivation |
|-------|-----------|
| `task_name` | `"Close maturity gap: " + criterion_name` (or MPS/domain name) |
| `task_type` | `criterion → task`, `mps → project`, `domain → initiative` |
| `priority` | Direct mapping from Part 1 priority level |
| `severity` | Same as priority (synchronized) |
| `reasoning_summary` | From Part 2 AI output |
| `recommended_actions` | From Part 2 AI output |
| `assigned_role` | From Section 1 handling rules based on priority |
| `due_date` | `created_at + days` from Section 1 handling rules |
| `escalation_date` | `due_date - 7 days` for critical tasks |
| `linked_risks` | From Part 1 input `linked_risks.items[]` |
| `compliance_frameworks` | From Part 1 input `compliance_frameworks[]` |
| `origin_url` | `/maturity/domains/{domain_id}/mps/{mps_id}/criteria/{criterion_id}` |

### 2.3 Example Task Payload

```json
{
  "task_id": "550e8400-e29b-41d4-a716-446655440000",
  "task_name": "Close maturity gap: Incident Response Plan Documented",
  "task_type": "task",
  "origin_module": "maturity",
  "origin_type": "criterion",
  "origin_id": "ir-001-uuid",
  "cycle_id": "cycle-2024-q4-uuid",
  "org_id": "org-acme-uuid",
  "domain_id": "domain-ir-uuid",
  "domain_name": "Incident Response",
  "mps_id": "mps-ir-plan-uuid",
  "mps_name": "IR Planning & Preparation",
  "criterion_name": "Incident Response Plan Documented",
  "priority": "high",
  "severity": "high",
  "priority_score": 2.13,
  "priority_calculation": {
    "base_priority": 0.50,
    "modifiers": {
      "evidence_confidence": 1.05,
      "criticality": 2.0,
      "linked_risks": 1.5,
      "regulatory_relevance": 1.3,
      "time_exposed": 1.3,
      "existing_tasks": 1.0
    }
  },
  "gap_size": 2,
  "current_level": 2,
  "target_level": 4,
  "reasoning_summary": "This criterion has a 2-level gap and is critical for incident response capabilities. It is required by ISO 27001 and has been outstanding for 120 days.",
  "recommended_actions": [
    "Update Incident Response SOP to include detection, analysis, containment, eradication, and recovery phases",
    "Conduct tabletop exercise to validate IR plan",
    "Document lessons learned process",
    "Integrate IR plan with risk register"
  ],
  "ai_recommendations": {
    "model": "gpt-4.1",
    "timestamp": "2024-12-09T10:30:00Z",
    "confidence": 0.95
  },
  "assigned_role": "security_manager",
  "due_date": "2025-01-08T23:59:59Z",
  "status": "open",
  "created_at": "2024-12-09T10:30:00Z",
  "created_by": "system",
  "linked_risks": ["risk-ir-delay-uuid", "risk-data-breach-uuid"],
  "compliance_frameworks": ["ISO 27001", "SOC 2"],
  "tags": ["maturity", "gap", "incident-response", "ir-planning"],
  "origin_url": "/maturity/domains/domain-ir-uuid/mps/mps-ir-plan-uuid/criteria/ir-001-uuid"
}
```

---

## 3. Deduplication Rules

Because maturity scoring can run multiple times per cycle (e.g., after new evidence upload), PIT must prevent duplicate task creation.

### 3.1 Deduplication Logic

A PIT task is considered a **duplicate** if ALL of the following match:

1. **Same `origin_type`** (criterion, mps, or domain)
2. **Same `origin_id`** (UUID of the specific criterion/MPS/domain)
3. **Same `cycle_id`** (maturity cycle identifier)
4. **Status is NOT closed** (`status ≠ 'closed'` and `status ≠ 'archived'`)

If all conditions match → **Update existing task** instead of creating a new one.

### 3.2 Update Behavior

When a duplicate is detected, PIT should:

#### a) Append Reasoning Summary

Add the new AI reasoning to task notes/comments:

```
[2024-12-09 15:45] Gap re-evaluated during cycle rescore.
New reasoning: {reasoning_summary from Part 2}
Priority remains: {priority_level}
```

#### b) Update Severity/Priority if Increased

```typescript
if (new_priority_score > existing_priority_score) {
  task.priority = new_priority_level;
  task.severity = new_priority_level;
  task.priority_score = new_priority_score;
  task.updated_at = now();
  
  // Add escalation note
  task.comments.push({
    timestamp: now(),
    author: 'system',
    text: `Priority escalated from ${old_priority} to ${new_priority} due to ${escalation_reason}`
  });
  
  // Notify assignee
  notify(task.assigned_to, 'task_priority_escalated');
}
```

#### c) Update Recommended Actions

Merge new AI recommendations with existing ones:

```typescript
// Add new recommendations that aren't already present
const newActions = ai_recommendations.filter(
  action => !task.recommended_actions.includes(action)
);

if (newActions.length > 0) {
  task.recommended_actions.push(...newActions);
  task.comments.push({
    timestamp: now(),
    author: 'system',
    text: `Added ${newActions.length} new recommended actions based on gap re-evaluation`
  });
}
```

#### d) Do NOT Downgrade Priority

If the new priority score is lower than existing, do not change priority (pessimistic approach):

```typescript
if (new_priority_score < existing_priority_score) {
  // Log for audit but don't change task
  task.audit_log.push({
    timestamp: now(),
    event: 'gap_re_evaluated',
    old_priority_score: existing_priority_score,
    new_priority_score: new_priority_score,
    action: 'no_change',
    reason: 'Priority not downgraded to maintain urgency'
  });
}
```

### 3.3 Deduplication Query Example

```sql
SELECT t.task_id, t.status, t.priority_score
FROM pit_tasks t
WHERE t.origin_module = 'maturity'
  AND t.origin_type = ?
  AND t.origin_id = ?
  AND t.cycle_id = ?
  AND t.status NOT IN ('closed', 'archived')
LIMIT 1;
```

If this query returns a row → update that task.  
If this query returns no rows → create new task.

### 3.4 Edge Cases

#### Multiple Open Tasks for Same Gap (Error Recovery)

If multiple non-closed tasks exist for the same gap (data corruption scenario):

1. Keep the task with the highest priority score
2. Archive other tasks with status `duplicate_merged`
3. Log error for investigation
4. Notify admin

#### Gap Closed Then Re-Opened

If gap was closed in previous cycle but re-appeared:

1. Check if closed task exists for same `origin_id` in *previous* cycles
2. If found and gap re-appeared, create new task for current cycle
3. Link to previous task for historical context
4. Add comment: "Gap previously addressed in cycle {previous_cycle_id} but has re-emerged"

---

## 4. Task Lifecycle State Machine

PIT tasks transition through defined states with specific triggers and rules.

### 4.1 State Definitions

```typescript
type TaskStatus = 
  | 'open'           // Newly created, awaiting assignment or work
  | 'assigned'       // Assigned to a user
  | 'in_progress'    // Work actively underway
  | 'blocked'        // Work stopped due to dependency or blocker
  | 'pending_review' // Work completed, awaiting verification
  | 'overdue'        // Past due_date without completion
  | 'escalated'      // Escalated to higher authority
  | 'done'           // Work completed and verified
  | 'closed'         // Archived after verification and feedback
  | 'deferred'       // Postponed to next cycle
  | 'cancelled'      // No longer relevant
```

### 4.2 State Transition Diagram

```
                    ┌─────────┐
                    │  OPEN   │ (initial state)
                    └────┬────┘
                         │
                    ┌────▼────┐
                    │ASSIGNED │
                    └────┬────┘
                         │
                    ┌────▼────────┐
                    │ IN_PROGRESS │◄─────┐
                    └────┬────────┘      │
                         │               │
            ┌────────────┼─────────┐     │
            │            │         │     │
       ┌────▼────┐  ┌───▼────┐ ┌──▼──────┐
       │ BLOCKED │  │OVERDUE │ │ESCALATED│
       └────┬────┘  └───┬────┘ └──┬──────┘
            │            │         │
            └────────────┴─────────┘
                         │
                    ┌────▼──────────┐
                    │PENDING_REVIEW │
                    └────┬──────────┘
                         │
                    ┌────▼────┐
                    │  DONE   │
                    └────┬────┘
                         │
              ┌──────────┼──────────┐
              │          │          │
         ┌────▼────┐┌───▼────┐┌───▼──────┐
         │ CLOSED  ││DEFERRED││CANCELLED │
         └─────────┘└────────┘└──────────┘
```

### 4.3 State Transition Rules

| From State | To State | Trigger | Automated? | Actions |
|-----------|----------|---------|-----------|---------|
| open | assigned | User assigned to task | Manual or Auto (role-based) | Notify assignee |
| assigned | in_progress | User starts work | Manual | Update `started_at` timestamp |
| in_progress | blocked | Dependency not met | Manual | Create blocker record, notify manager |
| in_progress | pending_review | Work completed | Manual | Notify reviewer (domain owner/CISO) |
| in_progress | overdue | `due_date` passed | **Automatic (daily cron)** | Escalate, notify assignee + manager |
| overdue | escalated | 7 days overdue or critical priority | **Automatic** | Notify CISO/org admin |
| escalated | in_progress | Work resumed | Manual | Log escalation resolution |
| blocked | in_progress | Blocker resolved | Manual | Log blocker resolution |
| pending_review | done | Review approved | Manual (reviewer) | Update `completed_at` |
| pending_review | in_progress | Rework required | Manual (reviewer) | Add review comments |
| done | closed | Feedback sent to maturity | **Automatic** | Trigger maturity rescore (see Section 5) |
| in_progress | deferred | Postponed to next cycle | Manual (manager approval) | Create new task in next cycle |
| open/assigned/in_progress | cancelled | Gap no longer relevant | Manual (manager approval) | Log cancellation reason |

### 4.4 Automatic State Changes

#### Overdue Detection (Daily Cron Job)

```typescript
// Runs daily at 00:00 UTC
async function detectOverdueTasks() {
  const now = new Date();
  
  const overdueTasks = await db.query(`
    UPDATE pit_tasks
    SET status = 'overdue',
        overdue_since = NOW()
    WHERE status IN ('assigned', 'in_progress')
      AND due_date < $1
      AND status != 'overdue'
    RETURNING task_id, assigned_to, priority
  `, [now]);
  
  for (const task of overdueTasks) {
    // Notify assignee
    await notify(task.assigned_to, 'task_overdue', task);
    
    // Escalate if high/critical priority
    if (task.priority === 'high' || task.priority === 'critical') {
      await escalateTask(task.task_id);
    }
  }
}
```

#### Automatic Escalation (7 Days Overdue)

```typescript
// Runs daily at 01:00 UTC
async function escalateOverdueTasks() {
  const escalationThreshold = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  
  const tasksToEscalate = await db.query(`
    UPDATE pit_tasks
    SET status = 'escalated',
        escalated_at = NOW(),
        escalated_to = (
          SELECT user_id FROM organization_roles
          WHERE role = 'ciso' AND org_id = pit_tasks.org_id
          LIMIT 1
        )
    WHERE status = 'overdue'
      AND overdue_since < $1
      AND status != 'escalated'
    RETURNING task_id, assigned_to, escalated_to, domain_name
  `, [escalationThreshold]);
  
  for (const task of tasksToEscalate) {
    // Notify CISO and org admin
    await notify(task.escalated_to, 'task_escalated', task);
    await notify('org_admin', 'task_escalated', task);
    
    // Log escalation
    await db.insert('pit_task_escalations', {
      task_id: task.task_id,
      escalated_at: new Date(),
      escalated_by: 'system',
      reason: 'Overdue for 7+ days',
      escalated_to: task.escalated_to
    });
  }
}
```

#### Automatic Closure After Feedback

```typescript
// Triggered when maturity rescore completes
async function closeTaskAfterFeedback(task_id: string) {
  await db.update('pit_tasks', {
    status: 'closed',
    closed_at: new Date(),
    closed_by: 'system'
  }, { task_id });
  
  // Archive task metadata
  await db.insert('pit_task_archive', {
    task_id,
    archived_at: new Date(),
    final_status: 'closed',
    completion_duration_days: /* calculated */,
    gap_closed: true
  });
}
```

---

## 5. Feedback Loop to Maturity Module

When PIT tasks are completed, they must trigger maturity re-scoring to reflect improvements.

### 5.1 Trigger: Task Marked as "Done"

When a task transitions to `status = 'done'`:

1. **Emit Event:** `pit.task_completed`
2. **Payload Includes:**
   - `task_id`
   - `origin_type` (criterion/mps/domain)
   - `origin_id` (UUID of criterion/mps/domain)
   - `cycle_id`
   - `completed_at` (timestamp)
   - `completion_summary` (user-provided notes on work completed)

### 5.2 Event Schema

```json
{
  "event": "pit.task_completed",
  "task_id": "550e8400-e29b-41d4-a716-446655440000",
  "origin_module": "maturity",
  "origin_type": "criterion",
  "origin_id": "ir-001-uuid",
  "cycle_id": "cycle-2024-q4-uuid",
  "org_id": "org-acme-uuid",
  "completed_at": "2024-12-20T16:45:00Z",
  "completion_summary": "Updated IR SOP, conducted tabletop exercise, documented lessons learned process",
  "evidence_uploaded": false,
  "requires_rescore": true
}
```

### 5.3 Maturity Module Response

Upon receiving `pit.task_completed` event, the Maturity module must:

#### 1. Prompt for New Evidence Upload

Display UI notification to task assignee and domain owner:

```
✅ Task Completed: "Close maturity gap: Incident Response Plan Documented"

To reflect this improvement in your maturity score, please:
1. Upload updated evidence (e.g., revised IR SOP, tabletop exercise report)
2. Link evidence to criterion: IR-001
3. Trigger maturity rescore

[Upload Evidence] [Remind Me Later]
```

#### 2. Trigger New Scoring

Options:

**Option A: Automatic Rescore (if evidence uploaded)**
```typescript
if (event.evidence_uploaded) {
  await triggerMaturityRescore({
    org_id: event.org_id,
    cycle_id: event.cycle_id,
    scope: 'criterion',
    criterion_id: event.origin_id
  });
}
```

**Option B: Scheduled Rescore (if evidence not yet uploaded)**
```typescript
// Schedule rescore for 7 days after task completion
await scheduleMaturityRescore({
  org_id: event.org_id,
  cycle_id: event.cycle_id,
  scheduled_at: new Date(event.completed_at + 7 * 24 * 60 * 60 * 1000),
  trigger_reason: 'pit_task_completed_no_evidence'
});

// Reminder notification 6 days after completion
await scheduleNotification({
  recipient: event.assignee,
  scheduled_at: new Date(event.completed_at + 6 * 24 * 60 * 60 * 1000),
  message: 'Reminder: Please upload evidence for completed improvement task'
});
```

#### 3. Update Dashboards

Maturity dashboards should immediately show:

```
Domain: Incident Response
└── MPS: IR Planning & Preparation
    └── Criterion: IR-001 Incident Response Plan Documented
        ├── Current Score: 0.45 (Level 2)
        ├── Target Score: 0.75 (Level 4)
        ├── Gap: 2 levels
        ├── Linked PIT Task: ✅ Completed (2024-12-20)
        └── Status: ⏳ Awaiting evidence upload for rescore
```

#### 4. Update Readiness for Audit

```typescript
// Calculate audit readiness score
const auditReadiness = {
  total_gaps: 45,
  gaps_with_tasks: 38,
  tasks_completed: 22,
  tasks_in_progress: 12,
  tasks_overdue: 4,
  completion_rate: 22 / 38,
  readiness_score: (22 + 12 * 0.5) / 45  // 62% ready
};

// Display in dashboard
// "Audit Readiness: 62% — 22 gaps closed, 12 in progress, 4 overdue"
```

### 5.4 Rescore Outcome Handling

After maturity rescore completes:

**Scenario A: Gap Closed (Success)**

```typescript
if (new_gap === 0) {
  // Update PIT task
  await db.update('pit_tasks', {
    status: 'closed',
    closed_at: new Date(),
    gap_closed: true,
    rescore_result: 'gap_closed'
  }, { task_id: event.task_id });
  
  // Notify assignee
  await notify(task.assigned_to, 'gap_closed', {
    criterion_name: '...',
    old_level: 2,
    new_level: 4
  });
}
```

**Scenario B: Gap Reduced but Not Closed**

```typescript
if (new_gap > 0 && new_gap < old_gap) {
  // Update PIT task with partial progress
  await db.update('pit_tasks', {
    status: 'in_progress',
    gap_reduced: true,
    old_gap: old_gap,
    new_gap: new_gap,
    rescore_result: 'gap_reduced'
  }, { task_id: event.task_id });
  
  // Add comment
  await db.insert('pit_task_comments', {
    task_id: event.task_id,
    author: 'system',
    text: `Gap reduced from ${old_gap} to ${new_gap} levels. Further work required to close gap.`
  });
}
```

**Scenario C: Gap Unchanged (Evidence Insufficient)**

```typescript
if (new_gap === old_gap) {
  // Revert task to in_progress
  await db.update('pit_tasks', {
    status: 'in_progress',
    rescore_result: 'gap_unchanged'
  }, { task_id: event.task_id });
  
  // Notify assignee
  await notify(task.assigned_to, 'gap_unchanged', {
    criterion_name: '...',
    message: 'Evidence may be insufficient or additional controls needed'
  });
}
```

**Scenario D: Gap Increased (Regression)**

```typescript
if (new_gap > old_gap) {
  // Escalate immediately
  await db.update('pit_tasks', {
    status: 'escalated',
    gap_increased: true,
    old_gap: old_gap,
    new_gap: new_gap,
    rescore_result: 'gap_increased'
  }, { task_id: event.task_id });
  
  // Notify CISO
  await notify('ciso', 'gap_regression', {
    criterion_name: '...',
    old_gap: old_gap,
    new_gap: new_gap,
    task_id: event.task_id
  });
}
```

---

## 6. UI Requirements for PIT Integration

Maturity module UI must display PIT task status and linkage for user visibility and workflow integration.

### 6.1 Maturity View Enhancements

On **Criterion Detail View**:

```
┌───────────────────────────────────────────────────────────┐
│ Criterion: IR-001 — Incident Response Plan Documented    │
├───────────────────────────────────────────────────────────┤
│ Current Maturity: Level 2 (Reactive) — Score: 0.45       │
│ Target Maturity:  Level 4 (Proactive) — Score: 0.75      │
│ Gap: 2 levels                                             │
├───────────────────────────────────────────────────────────┤
│ 🔗 Linked PIT Tasks (1)                                   │
│                                                           │
│  ⚠️  High Priority — Due: 2025-01-08                      │
│      "Close maturity gap: IR-001"                         │
│      Status: In Progress (Started 2024-12-15)             │
│      Assigned to: Jane Smith (Security Manager)           │
│      [View Task Details →]                                │
│                                                           │
│  📋 Recommended Actions:                                  │
│      1. ✓ Update Incident Response SOP                    │
│      2. ⏳ Conduct tabletop exercise                       │
│      3. ⏳ Document lessons learned process                │
│      4. ⏳ Integrate IR plan with risk register            │
├───────────────────────────────────────────────────────────┤
│ [Upload Evidence] [Request Extension] [View History]     │
└───────────────────────────────────────────────────────────┘
```

### 6.2 Show Warnings When Tasks Are Overdue

On **Domain Dashboard**:

```
┌───────────────────────────────────────────────────────────┐
│ Domain: Incident Response                                 │
├───────────────────────────────────────────────────────────┤
│ Maturity Score: 0.52 (Level 3) — Target: 0.75 (Level 4)  │
│ Gap: 1 level                                              │
├───────────────────────────────────────────────────────────┤
│ ⚠️  Improvement Tasks Status                              │
│                                                           │
│  ❌ 2 Overdue Tasks (Urgent Attention Required)           │
│     • IR-001: 5 days overdue — [View Task →]              │
│     • IR-003: 12 days overdue — [View Task →]             │
│                                                           │
│  ⏳ 3 In Progress                                          │
│  ✅ 4 Completed This Quarter                              │
│                                                           │
│ [View All Tasks] [Escalate Overdue Tasks]                │
└───────────────────────────────────────────────────────────┘
```

### 6.3 Show Recommendations Based on Priority

On **Maturity Cycle Summary**:

```
┌───────────────────────────────────────────────────────────┐
│ Maturity Cycle: Q4 2024                                   │
│ Overall Score: 0.58 (Level 3 — Compliant)                 │
│ Target Score: 0.70 (Level 4 — Proactive)                  │
├───────────────────────────────────────────────────────────┤
│ 🎯 Priority Recommendations                               │
│                                                           │
│  🔴 Critical (2 gaps)                                     │
│     • Access Control: 3-level gap — [Create Task →]       │
│     • Incident Response: 2-level gap — [View Task →]      │
│                                                           │
│  🟠 High (5 gaps)                                         │
│     • Risk Management: 2-level gap — [View Tasks →]       │
│     • ... (4 more)                                        │
│                                                           │
│  🟡 Medium (12 gaps)                                      │
│     • Documentation: 1-level gap — [Batch Tasks →]        │
│     • ... (11 more)                                       │
│                                                           │
│ [Auto-Create All Tasks] [Review Priorities]              │
└───────────────────────────────────────────────────────────┘
```

### 6.4 Show History of Improvement Actions

On **Criterion History View**:

```
┌───────────────────────────────────────────────────────────┐
│ IR-001 — Improvement History                              │
├───────────────────────────────────────────────────────────┤
│ Timeline:                                                 │
│                                                           │
│ 📅 2024-12-20 — Task Completed                            │
│    ✅ "Close maturity gap: IR-001"                         │
│    Completed by: Jane Smith                               │
│    Completion notes: Updated IR SOP, conducted tabletop   │
│    Rescore result: Gap reduced from 2 to 1 level          │
│                                                           │
│ 📅 2024-12-15 — Task Started                              │
│    ⏳ Work began on improvement actions                    │
│                                                           │
│ 📅 2024-12-09 — Task Created                              │
│    🔴 High priority task created automatically             │
│    Gap detected: 2 levels (Level 2 → Level 4)             │
│    Priority score: 2.13 (High)                            │
│    Reasoning: Critical for IR capabilities, required by   │
│                ISO 27001, outstanding for 120 days        │
│                                                           │
│ 📅 2024-09-01 — Gap First Detected                        │
│    Gap: 2 levels                                          │
│    Evidence: 2 items, avg confidence: 0.60                │
│                                                           │
│ [Export History] [View Full Audit Trail]                 │
└───────────────────────────────────────────────────────────┘
```

### 6.5 Linked Task Widget

Component to embed in maturity views:

```typescript
interface LinkedPitTasksWidget {
  criterion_id: string;
  
  // Display
  total_tasks: number;
  open_tasks: number;
  completed_tasks: number;
  overdue_tasks: number;
  
  // Task list
  tasks: Array<{
    task_id: string;
    task_name: string;
    status: TaskStatus;
    priority: 'low' | 'medium' | 'high' | 'critical';
    assigned_to: string;
    due_date: string;
    days_until_due: number;
    progress_percentage: number;
  }>;
  
  // Actions
  onCreateTask: () => void;
  onViewTask: (task_id: string) => void;
  onEscalate: (task_id: string) => void;
}
```

**Widget UI:**

```
┌─────────────────────────────────────────────┐
│ 🔗 Linked PIT Tasks (3)                     │
├─────────────────────────────────────────────┤
│                                             │
│ ⚠️  High Priority — Overdue 5 days          │
│     Status: Overdue                         │
│     Assigned: Jane Smith                    │
│     [View] [Escalate]                       │
│                                             │
│ 🟡 Medium Priority — Due in 12 days         │
│     Status: In Progress (60% complete)      │
│     Assigned: John Doe                      │
│     [View]                                  │
│                                             │
│ ✅ Low Priority — Completed                 │
│     Completed: 2024-11-20                   │
│     Assigned: Jane Smith                    │
│     [View]                                  │
│                                             │
├─────────────────────────────────────────────┤
│ [Create New Task] [View All]               │
└─────────────────────────────────────────────┘
```

---

## 7. Integration with Other PIT Features

### 7.1 Integration with PIT Watchdog

PIT Watchdog monitors task health and triggers actions (see `PIT_WATCHDOG_LOGIC_v1.0.md`).

For maturity-origin tasks:

- **Watchdog Rule:** If task is overdue AND gap is critical → escalate to CISO
- **Watchdog Rule:** If task blocked > 14 days → notify domain owner + CISO
- **Watchdog Rule:** If task in pending_review > 7 days → auto-approve with audit flag

### 7.2 Integration with Risk Module

When PIT tasks close maturity gaps:

- **Check Linked Risks:** If risks were linked to the gap, re-evaluate risk scores
- **Trigger Risk Rescore:** Update risk likelihood/impact based on improved controls
- **Update Risk Register:** Add comment to linked risks noting control improvement

### 7.3 Integration with WRAC Module

- **Waiver Requests:** If gap cannot be closed, allow waiver request from PIT task
- **Risk Acceptance:** Link accepted risks to deferred PIT tasks
- **Compensating Controls:** Document compensating controls in PIT task completion notes

---

## 8. Performance & Scalability

### 8.1 Bulk Task Creation

When scoring a full cycle with 500+ criteria:

- **Batch Processing:** Create tasks in batches of 50
- **Deduplication:** Single query per batch for existing tasks
- **Transaction Handling:** Wrap each batch in database transaction
- **Target Performance:** 500 tasks created in < 10 seconds

### 8.2 Caching Strategy

Cache the following for 15 minutes:

- Domain role assignments
- Organization maturity cycle dates
- Gap priority configuration overrides
- User notification preferences

### 8.3 Async Event Processing

- **Gap events** processed asynchronously via queue
- **Task creation** non-blocking for scoring pipeline
- **Feedback events** processed within 5 seconds of task state change

---

## 9. Security & Access Control

### 9.1 Task Creation Authorization

Only authorized entities can create maturity-origin PIT tasks:

- `score-maturity-cycle` Edge Function (service role)
- Maturity API with valid service key
- Manual creation by domain owner/admin (with audit log)

### 9.2 Task Visibility

- **Users** see tasks in their organization
- **Domain owners** see tasks in their domain
- **Assignees** see tasks assigned to them
- **CISO/Admin** see all tasks

### 9.3 State Change Authorization

| Action | Authorized Roles |
|--------|------------------|
| Assign task | Domain owner, manager, admin |
| Start work | Assignee |
| Mark blocked | Assignee |
| Submit for review | Assignee |
| Approve completion | Domain owner, CISO, admin |
| Escalate | Manager, domain owner, CISO, system (auto) |
| Defer to next cycle | Manager, admin (requires approval) |
| Cancel | Domain owner, admin (requires justification) |

---

## 10. Audit Trail Requirements

All PIT task changes related to maturity gaps must be logged:

```typescript
interface PitTaskAuditLog {
  log_id: string;
  task_id: string;
  timestamp: string;
  event_type: string;  // 'created', 'updated', 'state_changed', 'escalated', etc.
  actor: string;       // user_id or 'system'
  changes: object;     // { field: { old: value, new: value } }
  reason?: string;     // For manual actions
  gap_context: {
    origin_type: string;
    origin_id: string;
    gap_size: number;
    priority_score: number;
  };
}
```

Audit logs must be:

- **Immutable** (append-only table)
- **Retained** for 7 years (compliance requirement)
- **Exportable** for auditor review
- **Searchable** by task, user, date range, event type

---

## 11. Error Handling

### 11.1 Task Creation Failures

If task creation fails:

1. Log error with full gap context
2. Add to `pit_task_creation_failures` table
3. Retry with exponential backoff (3 attempts)
4. After 3 failures, notify admin
5. Provide manual retry UI in admin panel

### 11.2 Feedback Loop Failures

If maturity rescore fails after task completion:

1. Leave task in `done` status
2. Schedule rescore retry in 1 hour
3. After 3 failures, notify maturity module maintainer
4. Provide manual rescore trigger in UI

### 11.3 State Transition Validation

All state changes must validate:

```typescript
function validateStateTransition(from: TaskStatus, to: TaskStatus): boolean {
  const validTransitions = {
    'open': ['assigned', 'cancelled'],
    'assigned': ['in_progress', 'cancelled'],
    'in_progress': ['blocked', 'pending_review', 'overdue', 'deferred', 'cancelled'],
    'blocked': ['in_progress', 'escalated'],
    'overdue': ['in_progress', 'escalated'],
    'escalated': ['in_progress'],
    'pending_review': ['done', 'in_progress'],
    'done': ['closed', 'in_progress'],
    'deferred': [],
    'cancelled': [],
    'closed': []
  };
  
  return validTransitions[from]?.includes(to) || false;
}
```

If invalid transition attempted → reject with error message.

---

## 12. Testing Requirements

### 12.1 Unit Tests

- Task creation payload generation
- Deduplication logic with various scenarios
- State transition validation
- Priority override rules
- Due date calculation

### 12.2 Integration Tests

- End-to-end: Gap detected → Task created → Task completed → Maturity rescored
- Deduplication: Multiple scoring runs don't create duplicate tasks
- Feedback loop: Task completion triggers rescore
- State machine: All valid transitions work correctly

### 12.3 Performance Tests

- 500 gaps processed and tasks created in < 10 seconds
- Deduplication query executes in < 100ms
- Feedback event processing completes in < 5 seconds

---

## 13. Implementation Checklist

- [ ] Create `pit_tasks` table with maturity integration fields
- [ ] Create `pit_task_audit_log` table
- [ ] Create `pit_task_creation_failures` table
- [ ] Implement task creation from gap priority output
- [ ] Implement deduplication logic
- [ ] Implement state machine with all transitions
- [ ] Implement automatic overdue detection (daily cron)
- [ ] Implement automatic escalation (daily cron)
- [ ] Implement feedback event handler (`pit.task_completed`)
- [ ] Create maturity module rescore trigger
- [ ] Create UI components for linked task display
- [ ] Create UI components for task history
- [ ] Add overdue warnings to maturity dashboards
- [ ] Add priority recommendations to cycle summary
- [ ] Implement bulk task creation for scoring runs
- [ ] Add comprehensive tests (unit, integration, performance)
- [ ] Document API contract for PIT-Maturity events

---

## 14. References

- **Part 1:** `GAP_PRIORITY_ENGINE_v1.0.md` — Numeric priority model and inputs
- **Part 2:** `GAP_PRIORITY_ENGINE_AI_REASONING_v1.0.md` — AI reasoning and explanations
- **Part 4:** `GAP_PRIORITY_ENGINE_QA_v1.0.md` — QA tests and validation *(planned)*
- **PIT Scoring Integration Workflow:** `PIT_SCORING_INTEGRATION_WORKFLOW_v1.0.md`
- **PIT Watchdog Logic:** `PIT_WATCHDOG_LOGIC_v1.0.md`
- **PIT Database Schema:** `PIT_DATABASE_SCHEMA_v1.1.md`
- **Maturity Scoring API Contract:** `architecture/api/MATURITY_SCORING_API_CONTRACT_v1.0.md`

---

**Status:** ✅ Architecture Approved  
**Owner:** Foreman  
**Target:** Builder Agents + PIT Implementation Team  
**Version:** 1.0  
**Date:** 2025-12-09

---

**End of Part 3 of 4**
