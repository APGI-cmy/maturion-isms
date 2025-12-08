# PIT Scoring Integration Workflow v1.0

**Module:** PIT (Project Implementation Tracker)  
**Integrates With:** Maturity Module, Risk, WRAC, Analytics  
**Version:** 1.0  
**Purpose:** Defines how scoring results automatically trigger PIT projects/tasks and how PIT feeds progress back into Maturity scoring.

---

# 0. Purpose & Context

PIT is the **execution engine** for the entire ISMS.

The Maturity scoring model produces:

- Criterion gaps
- MPS gaps
- Domain gaps
- Organization-wide underperformance indicators

These gaps **must be automatically translated into PIT work**, using Foreman's rule:

> **Evidence → Scoring → Gap Detection → PIT Work → Continuous Improvement**

This workflow document defines:

- Trigger conditions
- Event shapes
- Deduplication rules
- Priority rules
- Task generation logic
- PIT → Maturity feedback
- Full lifecycle of improvement work

This is required for:

- Continuous maturity improvement
- Auditor expectations
- True North alignment
- Long-term automation and AI agent workflows

---

# 1. Trigger Points

PIT tasks must be generated when the scoring pipeline finds:

## 1.1 Criterion Gap

A criterion has:

```
gap = target_level - actual_level > 0
```

This is the strongest and most direct PIT driver.

### Trigger

When the scoring pipeline writes to:

```
criteria_scores
→ gap > 0
```

### Result

A PIT gap event is created.

---

## 1.2 MPS Gap

When an MPS is underperforming:

```
gap > 0
```

Example:

- MPS target = Level 4
- Actual maturity level = Level 2
- Gap = 2 → PIT must be notified

---

## 1.3 Domain Gap

Domain-level gaps trigger **strategic projects**.

Example:

- Domain target = Level 4
- Actual = Level 2
- Gap = 2 → Domain-wide improvement plan needed

---

## 1.4 Organization Maturity Gap

If an organization is below:

- minimum acceptable score
- minimum acceptable domain distribution
- auditor-defined threshold

The PIT module receives a strategic PIT project creation event.

---

# 2. Event Types (PIT Events)

Events are emitted by scoring pipeline or API.

Place them physically in:

```
infrastructure/supabase/functions/score-maturity-cycle/
events/
```

---

## 2.1 Event: `maturity.criterion_gap`

```json
{
  "event": "maturity.criterion_gap",
  "org_id": "<uuid>",
  "cycle_id": "<uuid>",
  "criterion_id": "<uuid>",
  "mps_id": "<uuid>",
  "domain_id": "<uuid>",
  "current_level": 2,
  "target_level": 4,
  "gap": 2,
  "impact": "medium",
  "recommended_actions": [
    "Update SOP for incident response",
    "Provide staff training",
    "Test incident response plan quarterly"
  ],
  "origin_url": "/maturity/domains/xxx/mps/yyy/criteria/zzz"
}
```

---

## 2.2 Event: `maturity.mps_gap`

```json
{
  "event": "maturity.mps_gap",
  "org_id": "<uuid>",
  "cycle_id": "<uuid>",
  "mps_id": "<uuid>",
  "domain_id": "<uuid>",
  "current_level": 2,
  "target_level": 4,
  "gap": 2,
  "recommendations": ["Improve risk registers", "Implement corrective actions logging"]
}
```

---

## 2.3 Event: `maturity.domain_gap`

Triggered when weak domain-level maturity affects risk posture & audit readiness.

```json
{
  "event": "maturity.domain_gap",
  "org_id": "<uuid>",
  "cycle_id": "<uuid>",
  "domain_id": "<uuid>",
  "domain_name": "Incident Response",
  "current_level": 2,
  "target_level": 4,
  "gap": 2,
  "strategic_actions": ["Conduct incident simulation", "Update response playbooks"]
}
```

---

# 3. PIT Task Generation Logic

When an event arrives, PIT creates:

- **One PIT project per domain gap**
- **One PIT project per MPS gap (if meaningful)**
- **One PIT task per criterion gap**

### 3.1 PIT Project Structure

```
project_name: "Maturity Improvement – <Domain>"
origin: "maturity"
owner: domain_owner
priority: derived from gap
```

### 3.2 PIT Task Structure

```
task_name: "Close maturity gap for Criterion <ID>"
origin: "maturity"
origin_type: "criterion"
origin_id: <uuid>
domain_id: <uuid>
mps_id: <uuid>
gap: 2
recommended_actions: [...]
severity: derived from gap (e.g., gap ≥ 2 → high)
assignee: mapped using domain roles
due_date: based on target maturity cycle
```

---

# 4. Deduplication Rules

Because scoring runs multiple times, PIT must not duplicate tasks.

A PIT task is considered a duplicate if:

- Same `origin_id`
- Same `origin_type`
- Same `cycle_id`
- Status is not `closed`

If all of the above match → **update existing PIT task** instead of creating a new one.

---

# 5. Task Update Lifecycle

If gap decreases:

- Update task progress
- Add comment:

  > "Criterion improved from Level 2 → Level 3 due to new evidence."

If gap remains constant:

- No change unless aging threshold is reached

If gap increases (rare):

- Escalate severity
- Notify stakeholder
- Add mandatory audit note

---

# 6. PIT → Maturity Feedback Loop

PIT updates scoring context.

### 6.1 A task linked to a criterion is completed

PIT sends:

```
{
  "event": "pit.task_completed",
  "origin_type": "criterion",
  "origin_id": "<criterion-id>",
  "message": "Underlying improvement actions have been completed for this criterion"
}
```

Maturity module responds by:

- prompting user to upload new evidence
- suggesting AI-driven evidence generation
- re-running the criterion scoring
- recomputing MPS/domain scores

### 6.2 A task is overdue

Maturity domain UI displays:

- "⚠️ Improvement action overdue"
- Links to the overdue PIT task for immediate escalation

---

# 7. Full Lifecycle Example

## Scenario: Incident Response Criterion Gap

### Step 1: Scoring Detects Gap

```
Criterion: "IR-001 Incident Response Plan Documented"
Target Level: 4 (Proactive)
Current Level: 2 (Reactive)
Gap: 2
```

### Step 2: Event Emitted

```json
{
  "event": "maturity.criterion_gap",
  "criterion_id": "ir-001-uuid",
  "current_level": 2,
  "target_level": 4,
  "gap": 2,
  "recommended_actions": ["Update IR SOP", "Conduct tabletop exercise"]
}
```

### Step 3: PIT Creates Task

```
Task: "Close maturity gap for IR-001"
Origin: maturity/criterion/ir-001-uuid
Owner: Security Manager
Due: End of current maturity cycle
Severity: High (gap ≥ 2)
Actions:
  - Update IR SOP
  - Conduct tabletop exercise
```

### Step 4: Security Manager Completes Work

- Updates IR SOP document
- Conducts tabletop exercise
- Uploads evidence to Maturity module
- Marks PIT task as "Complete"

### Step 5: PIT Notifies Maturity

```json
{
  "event": "pit.task_completed",
  "origin_type": "criterion",
  "origin_id": "ir-001-uuid"
}
```

### Step 6: Maturity Re-Scores

- New evidence processed
- Criterion re-evaluated
- New score: Level 4
- Gap: 0
- PIT task archived

---

# 8. Priority Derivation Rules

Gap-to-priority mapping:

| Gap | Priority | Severity |
|-----|----------|----------|
| 0   | None     | N/A      |
| 1   | Low      | Low      |
| 2   | Medium   | Medium   |
| 3+  | High     | High     |

Domain/MPS gaps inherit the maximum criterion gap priority within their scope.

---

# 9. Integration with Analytics

PIT tasks feed into:

- **Maturity Progress Dashboard** – Shows % of gaps closed
- **Risk Heat Map** – Maps PIT delays to rising risk scores
- **Executive Summary** – "X critical gaps remain open"
- **Auditor View** – "Organization is actively addressing Y findings"

Analytics module reads from:

- `pit_tasks` (origin_module = 'maturity')
- `pit_project_progress` (status, completion %)
- `criteria_scores` (current vs target)

---

# 10. Error Handling

## 10.1 Event Processing Failures

If PIT cannot process a gap event:

- Log error to `pit_event_failures`
- Send notification to admin
- Retry with exponential backoff
- Mark event as "failed" after 3 retries
- Provide manual retry UI in PIT admin panel

## 10.2 Duplicate Task Detection Failures

If deduplication logic fails:

- Default to creating new task
- Flag for manual review
- Admin can merge duplicate tasks manually

## 10.3 Missing Origin Data

If event lacks required fields (e.g., `criterion_id`, `domain_id`):

- Reject event
- Log validation error
- Notify scoring pipeline maintainer

---

# 11. Security & Access Control

## 11.1 Event Publishing

Only authorized services can emit maturity gap events:

- `score-maturity-cycle` Edge Function
- Maturity API with service role key

## 11.2 Task Visibility

PIT tasks respect organization RLS:

- Users see only tasks for their organization
- Domain owners see tasks in their domain
- Admins see all tasks

## 11.3 Task Modification

Only authorized roles can close tasks:

- Task assignee
- Project owner
- Domain owner
- Organization admin

---

# 12. Performance Considerations

## 12.1 Batch Event Processing

When scoring a full cycle (hundreds of criteria):

- Batch gap events into single transaction
- Process all criterion gaps together
- Deduplicate before creating tasks
- Create tasks in bulk insert

## 12.2 Caching

PIT caches:

- Domain role mappings (15 min TTL)
- Organization maturity cycle dates (1 hour TTL)
- User assignments (30 min TTL)

## 12.3 Async Processing

Gap events are processed asynchronously:

- Event published to queue
- Worker picks up event within 5 seconds
- Task creation is non-blocking for scoring pipeline

---

# 13. Testing Requirements

## 13.1 Unit Tests

- Event shape validation
- Deduplication logic
- Priority derivation
- Task creation from events

## 13.2 Integration Tests

- End-to-end: Score → Gap Event → PIT Task
- Feedback loop: PIT Complete → Maturity Rescore
- Batch processing with 100+ criteria

## 13.3 Performance Tests

- 1000 criterion gaps processed in < 10 seconds
- No duplicate tasks created under concurrent load

---

# 14. Implementation Checklist

- [ ] Create `pit_gap_events` table
- [ ] Create `pit_event_failures` table
- [ ] Implement gap event handler in PIT module
- [ ] Implement deduplication logic
- [ ] Implement task creation from events
- [ ] Implement priority derivation
- [ ] Implement task update lifecycle
- [ ] Implement PIT → Maturity feedback events
- [ ] Create admin panel for event failures
- [ ] Add event processing to `score-maturity-cycle` function
- [ ] Add batch processing support
- [ ] Implement async event queue
- [ ] Add comprehensive tests
- [ ] Document event schemas in API contract

---

# 15. References

- **PIT Integration Requirements:** `architecture/modules/pit/PIT_INTEGRATION_REQUIREMENTS_v1.0.md`
- **Maturity Scoring API Contract:** `architecture/api/MATURITY_SCORING_API_CONTRACT_v1.0.md`
- **Scoring Model Migration:** `infrastructure/db/migrations/20250208_scoring_model.sql`
- **Score Maturity Cycle Function:** `infrastructure/supabase/functions/score-maturity-cycle/index.ts`
- **ISMS Integration Map:** `architecture/core/INTEGRATED_ISMS_MODULE_INTEGRATION_MAP_v1.0.md`

---

**Status:** ✅ Architecture Approved  
**Owner:** Foreman  
**Target:** Builder Agents + QA Team
