# GAP PRIORITY ENGINE — PIT HANDLING RULES & WORKFLOW — CHANGELOG

**Document:** `GAP_PRIORITY_ENGINE_PIT_HANDLING_v1.0.md`  
**Location:** `architecture/modules/pit/Architecture/`  
**Maintainer:** Foreman  

---

## Version 1.0 — 2025-12-09

### ✅ Initial Release

**Scope:** Part 3 of 4 — PIT Handling Rules & Workflow

**Changes:**

#### Added

- **Section 0: Purpose**
  - Defined the role of PIT handling rules in the Gap Priority Engine workflow
  - Established design principles: automated task creation, no duplicates, traceable lifecycle, bidirectional integration, user-centric UI, escalation clarity
  - Documented context as Part 3 of 4-part specification

- **Section 1: Recommended Handling Rules**
  - **1.1 Criterion-Level Handling:** Complete mapping of priority levels (low/medium/high/critical) to PIT actions
    - Defined due dates: Low (90-120 days), Medium (60-90 days), High (30 days), Critical (≤14 days)
    - Specified owner assignments by priority level
    - Documented notification rules per priority
  - **1.2 MPS-Level Handling:** Project vs. task decisions based on priority
    - Low: Monitor individual tasks
    - Medium/High: Create coordinated projects
    - Critical: Create strategic initiatives with executive oversight
  - **1.3 Domain-Level Handling:** Strategic initiatives for domain-wide gaps
    - Medium: Domain improvement plans
    - High: Strategic projects
    - Critical: Emergency response plans with board notification
  - **Override Rules:** Criticality, regulatory, risk, and time-based priority overrides

- **Section 2: Task Creation Payload**
  - **2.1 Core Task Structure:** Complete TypeScript interface for `PitTaskFromGap`
    - Task identification fields (task_id, task_name, task_type)
    - Origin tracking for deduplication (origin_module, origin_type, origin_id, cycle_id)
    - Organizational context (org_id, domain_id, mps_id, criterion_name)
    - Priority & severity fields with full calculation breakdown
    - Gap context (gap_size, current_level, target_level)
    - AI-generated content integration (reasoning_summary, recommended_actions from Part 2)
    - Assignment & deadlines (assigned_to, assigned_role, due_date, escalation_date)
    - Status & lifecycle tracking
    - Linked data (risks, incidents, compliance frameworks)
    - Metadata (tags, origin_url)
  - **2.2 Field Derivation Rules:** Mapping table for all payload fields
  - **2.3 Example Task Payload:** Complete working example with realistic data

- **Section 3: Deduplication Rules**
  - **3.1 Deduplication Logic:** Four-condition matching algorithm
    - Same origin_type
    - Same origin_id
    - Same cycle_id
    - Status not closed/archived
  - **3.2 Update Behavior:** When duplicate detected:
    - Append reasoning summary to task notes
    - Update severity/priority if increased (never downgrade)
    - Merge new recommended actions
    - Full examples with code snippets
  - **3.3 Deduplication Query Example:** SQL query for existing task lookup
  - **3.4 Edge Cases:** 
    - Multiple open tasks recovery logic
    - Gap closed then re-opened handling

- **Section 4: Task Lifecycle State Machine**
  - **4.1 State Definitions:** 11 task states defined (open, assigned, in_progress, blocked, pending_review, overdue, escalated, done, closed, deferred, cancelled)
  - **4.2 State Transition Diagram:** ASCII art flow diagram showing all valid transitions
  - **4.3 State Transition Rules:** Complete table of from→to transitions with triggers and actions
  - **4.4 Automatic State Changes:**
    - Overdue detection (daily cron at 00:00 UTC)
    - Automatic escalation (7 days overdue threshold)
    - Automatic closure after feedback
    - Full implementation examples with TypeScript code

- **Section 5: Feedback Loop to Maturity Module**
  - **5.1 Trigger:** Task marked as "done" emits `pit.task_completed` event
  - **5.2 Event Schema:** Complete JSON schema for feedback events
  - **5.3 Maturity Module Response:** Four required actions:
    1. Prompt for new evidence upload (with UI notification example)
    2. Trigger new scoring (automatic or scheduled options)
    3. Update dashboards (immediate status display)
    4. Update readiness for audit (calculation formula)
  - **5.4 Rescore Outcome Handling:** Four scenarios with code examples:
    - Scenario A: Gap closed (success)
    - Scenario B: Gap reduced but not closed
    - Scenario C: Gap unchanged (insufficient evidence)
    - Scenario D: Gap increased (regression/escalation)

- **Section 6: UI Requirements for PIT Integration**
  - **6.1 Maturity View Enhancements:** Criterion detail view with linked tasks widget (ASCII mockup)
  - **6.2 Show Warnings When Tasks Are Overdue:** Domain dashboard with overdue alerts (ASCII mockup)
  - **6.3 Show Recommendations Based on Priority:** Maturity cycle summary with priority-grouped gaps (ASCII mockup)
  - **6.4 Show History of Improvement Actions:** Criterion history timeline view (ASCII mockup)
  - **6.5 Linked Task Widget:** TypeScript interface and UI specification

- **Section 7: Integration with Other PIT Features**
  - **7.1 Integration with PIT Watchdog:** Monitoring rules for maturity-origin tasks
  - **7.2 Integration with Risk Module:** Risk rescore triggers on gap closure
  - **7.3 Integration with WRAC Module:** Waiver requests and compensating controls

- **Section 8: Performance & Scalability**
  - Bulk task creation: 500 tasks in <10 seconds
  - Caching strategy: 15-minute TTL for domain roles, cycle dates, config
  - Async event processing: 5-second SLA for feedback events

- **Section 9: Security & Access Control**
  - **9.1 Task Creation Authorization:** Service role and admin-only creation
  - **9.2 Task Visibility:** RLS rules by role
  - **9.3 State Change Authorization:** Complete permission table by action

- **Section 10: Audit Trail Requirements**
  - TypeScript interface for `PitTaskAuditLog`
  - Retention policy: 7 years
  - Exportability and searchability requirements

- **Section 11: Error Handling**
  - **11.1 Task Creation Failures:** Retry logic with exponential backoff
  - **11.2 Feedback Loop Failures:** Rescore retry mechanism
  - **11.3 State Transition Validation:** TypeScript validation function with allowed transitions

- **Section 12: Testing Requirements**
  - Unit tests: Payload generation, deduplication, state transitions, overrides, due dates
  - Integration tests: End-to-end workflow, duplicate prevention, feedback loop, state machine
  - Performance tests: 500 tasks <10s, deduplication <100ms, feedback <5s

- **Section 13: Implementation Checklist**
  - 17 implementation tasks across database, logic, automation, UI, and testing

- **Section 14: References**
  - Links to Parts 1, 2, and 4 (planned) of Gap Priority Engine
  - Links to PIT Scoring Integration Workflow, PIT Watchdog, PIT Database Schema
  - Links to Maturity Scoring API Contract

#### Technical Decisions

1. **Deduplication by Origin + Cycle:** Prevents duplicate tasks while allowing new tasks for new cycles
2. **Priority Never Downgraded:** Pessimistic approach maintains urgency even if gap appears to improve
3. **Automatic Escalation at 7 Days:** Balances timely escalation with giving assignees time to resolve
4. **Four-Outcome Rescore Handling:** Comprehensive coverage of all gap progression scenarios
5. **State Machine with 11 States:** Granular tracking while avoiding unnecessary complexity
6. **Bidirectional Event Flow:** PIT and Maturity communicate via events for loose coupling
7. **UI Integration Requirements:** Ensures users have visibility into improvement work status
8. **Bulk Processing:** Critical for performance when scoring 500+ criteria per cycle
9. **Audit Trail Immutability:** Append-only logs with 7-year retention for compliance
10. **Role-Based State Transitions:** Security model prevents unauthorized task manipulation

#### Validation

- Reviewed against `PIT_SCORING_INTEGRATION_WORKFLOW_v1.0.md` for event schema consistency
- Aligned with `GAP_PRIORITY_ENGINE_v1.0.md` for priority level handling
- Integrated with `GAP_PRIORITY_ENGINE_AI_REASONING_v1.0.md` for AI content usage
- Verified compatibility with `PIT_WATCHDOG_LOGIC_v1.0.md` for monitoring integration
- Confirmed database requirements align with `PIT_DATABASE_SCHEMA_v1.1.md`

#### Cross-References

- **Part 1 Integration:** Uses priority_score, priority_level, and modifiers from numeric model
- **Part 2 Integration:** Consumes reasoning_summary and recommended_actions from AI layer
- **Workflow Alignment:** Event schemas match `PIT_SCORING_INTEGRATION_WORKFLOW_v1.0.md`
- **Database Alignment:** Task payload fields map to `PIT_DATABASE_SCHEMA_v1.1.md` tables

---

## Future Versions

### Planned for v1.1

- Enhanced bulk task creation with parallel processing
- ML-based due date prediction using historical completion times
- Smart task grouping for related criteria in same MPS
- Automated waiver request suggestions for persistent gaps
- Integration with third-party project management tools (Jira, Asana)

### Planned for v2.0

- Adaptive state machine that learns from organization-specific workflows
- Predictive escalation based on assignee workload and task complexity
- Natural language task summaries for executive dashboards
- Automated evidence generation triggers based on task type
- Multi-cycle gap trend analysis for chronic issue detection

---

## Change Review Process

All changes to this specification must:

1. Update the version number (semantic versioning)
2. Add entry to this CHANGELOG
3. Notify PIT implementation team and Maturity module team
4. Update dependent documents (PIT_SCORING_INTEGRATION_WORKFLOW, PIT_WATCHDOG, etc.)
5. Trigger QA test review and updates
6. Update database schema if task payload changes
7. Review security implications of state transition changes

---

## Dependencies

This specification depends on:

- **GAP_PRIORITY_ENGINE_v1.0.md** — For priority scores and levels
- **GAP_PRIORITY_ENGINE_AI_REASONING_v1.0.md** — For AI-generated content
- **PIT_SCORING_INTEGRATION_WORKFLOW_v1.0.md** — For event schemas
- **PIT_DATABASE_SCHEMA_v1.1.md** — For database table structure

This specification is required by:

- **GAP_PRIORITY_ENGINE_QA_v1.0.md** — For test case definitions *(planned)*
- **PIT Edge Functions** — For task creation and state management implementations
- **Maturity UI Components** — For displaying linked tasks and recommendations

---

**Document Status:** ✅ Approved for Implementation  
**Approval Date:** 2025-12-09  
**Next Review:** After Part 4 completion or upon first production deployment (whichever comes first)

---

**Changelog Maintainer:** Foreman  
**Last Updated:** 2025-12-09
