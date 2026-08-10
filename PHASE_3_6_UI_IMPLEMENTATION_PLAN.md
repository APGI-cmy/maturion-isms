# MMM Approval Workflow Foundation — Phase 3-6 UI Implementation Plan

**Issue**: #2004 (mmm-approval-foundation-runtime-build-to-green)  
**Wave**: mmm-approval-foundation-runtime  
**Status**: Phase 2 COMPLETE — Phase 3-6 KICKOFF

---

## Overview

Phase 3-6 implement the UI runtime for three-tier approval workflow:
- **Phase 3**: Level 2 approver workspace (invitation discovery, domain filtering, change summary)
- **Phase 4**: Level 1 response interface (accept/reject/comment, evidence modal, learning consent)
- **Phase 5**: Level 3 final approval (gating, published model viewer)
- **Phase 6**: Notification delivery, audit dashboard, learning event persistence

All phases wire to existing Phase 2 Edge Functions (7 functions committed in 1d48cc77).

---

## Phase 3: Level 2 Invitation + Approver Workspace UI

**Objective**: Create approver workspace for Level 2 domain experts.

### 3.1 Level 2 Invitation Discovery Component
**File**: `apps/mat/src/components/ApprovalWorkflow/Level2InvitationDiscovery.tsx`

**Features**:
- Display pending approval rounds assigned to current user
- Filter by domain (multi-select)
- Filter by status (pending, in_review, changes_requested)
- Accept invitation flow (token validation via mmm-approval-invite-accept)
- Decline invitation option
- Show invitation expiry countdown

**Implementation**:
1. Fetch pending invitations (via mmm-approval-workspace-read)
2. Display invitation modal with token acceptance
3. Show domain scope for each invitation
4. Wire accept to mmm-approval-invite-accept Edge Function
5. Show confirmation message on accept

### 3.2 Approver Workspace Component
**File**: `apps/mat/src/components/ApprovalWorkflow/ApproverWorkspace.tsx`

**Features**:
- Display all accepted approval rounds for current user
- Domain-scoped view (show only rounds in user's domain)
- Status summary (pending review, awaiting decision, completed)
- Round detail view with proposed changes list
- Approver roster (show all approvers per round)

**Implementation**:
1. Query mmm-approval-workspace-read with domain filter
2. Display rounds in workable order (pending first)
3. Show change summary (count of proposed, accepted, rejected)
4. Display timeline of decision stages
5. Show audit log for current round

### 3.3 Change Summary Display
**File**: `apps/mat/src/components/ApprovalWorkflow/ChangeSummary.tsx`

**Features**:
- Table view of proposed changes (field, original, proposed)
- Change status indicator (proposed, accepted, rejected, edited)
- Inline comments per change
- Evidence link (opens modal with descriptor/evidence)
- Lock status indicator (locked_by_level_2 prevents further changes)

**Implementation**:
1. Fetch proposed_changes for round
2. Display in sortable table
3. Show immutability status (original_value/proposed_value immutable after lock)
4. Link to evidence modal (descriptor reasoning, criteria alignment)
5. Display level_1_response status for each change

### 3.4 Decision Interface
**File**: `apps/mat/src/components/ApprovalWorkflow/ApprovalDecisionForm.tsx`

**Features**:
- Approve / Request Changes / Reject radio buttons
- Optional decision comment
- Submit button (wires to mmm-approval-decision-submit)
- Status confirmation (shows all-approved transition if consensus reached)

**Implementation**:
1. Form submission to mmm-approval-decision-submit Edge Function
2. Show pending changes check (cannot decide if own proposed changes pending)
3. Display domain approver roster
4. Show lock creation confirmation when all approve
5. Handle errors (round superseded, already decided)

---

## Phase 4: Level 1 Response UI + Evidence Modal

**Objective**: Create response interface for Level 1 (framework owner) and evidence modal for all tiers.

### 4.1 Level 1 Response Interface
**File**: `apps/mat/src/components/ApprovalWorkflow/Level1ResponseForm.tsx`

**Features**:
- Display proposed changes with current descriptor state
- Accept / Edit / Reject options per change
- Edit interface for accepting with modifications
- Comment field
- Resubmit option when changes_requested status

**Implementation**:
1. Query approval round and proposed changes
2. Fetch current descriptor state for comparison
3. Display original/proposed/current side-by-side
4. Accept: store final_value = proposed_value, transition to 'accepted'
5. Edit: allow final_value modification, transition to 'edited_by_level_1'
6. Reject: transition to 'rejected', require reason
7. Wire to mmm-approval-level1-response-submit Edge Function

### 4.2 Evidence Modal
**File**: `apps/mat/src/components/ApprovalWorkflow/EvidenceModal.tsx`

**Features**:
- Display descriptor reasoning (why change was proposed)
- Show criteria alignment (which LDCS criteria this change addresses)
- Display evidence sources (audit logs, recommendation rationale)
- Link to original framework descriptor definition
- Version history toggle (show previous versions if applicable)

**Implementation**:
1. Fetch descriptor reasoning from mmm_approval_evidence_descriptors
2. Query criteria_alignment records
3. Display linked audit events
4. Show confidence/recommendation strength
5. Render markdown reasoning with citations
6. Provide "Copy reasoning" button

### 4.3 Learning Consent UI
**File**: `apps/mat/src/components/ApprovalWorkflow/LearningConsentDialog.tsx`

**Features**:
- Consent checkbox: "Allow this approval decision to inform future AI recommendations"
- Privacy notice (data used for model improvement only, not shared)
- Optional learning reason field
- Submit button captures consent status to ai_learning_events

**Implementation**:
1. Display before final response submission
2. Fetch user's prior learning consent (default to not consented)
3. Store consent boolean in ai_learning_events table
4. Log decision reason if provided
5. Allow users to withdraw future consent (update prior records if desired)

---

## Phase 5: Level 3 Final Approval + Published Model

**Objective**: Create Level 3 final approval interface and published model viewer.

### 5.1 Level 3 Approval Gating Component
**File**: `apps/mat/src/components/ApprovalWorkflow/Level3ApprovalGate.tsx`

**Features**:
- Display approval progress (x of y domains approved at Level 2)
- Require all Level 2 domain approvals before enabling Level 3
- Final approval/rejection decision interface
- Show domain consensus summary
- Lock confirmation (transitions to locked_by_final_approval)

**Implementation**:
1. Query approval round status (must be 'approved_by_all' to proceed to L3)
2. Fetch approver roster, show approval status per domain
3. Disable L3 button until all domains approve
4. Submit final decision to mmm-approval-decision-submit (but with L3 validation)
5. Wire lock transition to mmm-approval-lock-transition Edge Function
6. Show confirmation: "Domain is now final-locked"

### 5.2 Published Model Materialization
**File**: `supabase/functions/mmm-approval-published-model-create/index.ts`

**Features**:
- Create published_model record when L3 approval completes
- Snapshot all approved changes to published_model_changes table
- Include version, published_by_user_id, published_at
- Immutable published model (no further edits)
- Link to approval round for audit trail

**Implementation**:
1. Triggered by mmm-approval-lock-transition (lock_state = 'locked_by_final_approval')
2. Create published_model record (status = 'published')
3. Copy all accepted/edited changes to published_model_changes
4. Create audit event (published_model_created)
5. Create notification event (model_published) for distribution

### 5.3 Published Model Viewer
**File**: `apps/mat/src/components/ApprovalWorkflow/PublishedModelViewer.tsx`

**Features**:
- Display published model snapshot (read-only)
- Show all published changes with final values
- Version history (previous published models)
- Download/export option (JSON or CSV)
- Link back to approval round for traceability

**Implementation**:
1. Query published_model by framework_id and version
2. Fetch published_model_changes
3. Render side-by-side (old vs published)
4. Show publication date and approvers
5. Provide export functionality
6. Display linked approval round with approver signatures

---

## Phase 6: Audit + Notification + Learning Delivery

**Objective**: Implement delivery pathways and dashboards for audit, notification, and learning events.

### 6.1 Notification Event Delivery Pipeline
**File**: `supabase/functions/mmm-approval-notification-deliver/index.ts`

**Features**:
- Async delivery of notification events to configured channels
- Email delivery (framework owner, approvers, stakeholders)
- In-app notification delivery (update notification-events.status = 'delivered')
- Retry logic with exponential backoff (failed, queued, delivered states)
- Idempotency check (idempotency_key prevents duplicate sends)

**Implementation**:
1. Poll notification_events where status = 'queued'
2. Determine recipient list based on notification_type:
   - level_2_all_approved → send to L3 approvers
   - level_1_response_submitted → send to domain approvers
   - model_published → send to stakeholders
3. Render email template with relevant context
4. Send via email service (Resend or similar)
5. Update notification_events.status = 'delivered' on success, 'failed' on error
6. Log delivery to audit_events

### 6.2 Audit Log Dashboard
**File**: `apps/mat/src/components/ApprovalWorkflow/AuditLogDashboard.tsx`

**Features**:
- Timeline view of all approval round events
- Filter by event type (round_created, decision_submitted, change_applied, lock_transition)
- Filter by actor (user, system)
- Show event details (timestamp, actor, affected object)
- Export audit log (JSON, CSV)
- Read-only display (immutable audit trail)

**Implementation**:
1. Query audit_events for approval_round_id
2. Order by timestamp DESC
3. Display event type badges with icons
4. Show actor name (query users table if needed)
5. Render immutable event data
6. Provide download button (generates JSON or CSV)

### 6.3 AI Learning Event Capture & Delivery
**File**: `supabase/functions/mmm-approval-learning-publish/index.ts`

**Features**:
- Aggregate ai_learning_events into learning batches
- Filter by consent = true (only use consented decisions for learning)
- Serialize learning data (original/proposed/final values, decision reason, actor role)
- Publish to descriptor reasoning pipeline (integration with Issue #1961)
- Create learning delivery audit trail

**Implementation**:
1. Query ai_learning_events where created_at > last_publish_time AND consent = true
2. Group by framework_id and approval_level
3. Serialize into learning event batches (schema TBD by descriptor reasoning)
4. POST to descriptor reasoning API endpoint
5. Update learning_events.published_at on success
6. Create audit_events entry for learning delivery
7. Log any delivery failures (non-blocking)

### 6.4 Learning Event Visibility & Consent Management
**File**: `apps/mat/src/components/ApprovalWorkflow/LearningEventConsent.tsx`

**Features**:
- Display user's historical learning events (decisions they contributed to learning)
- Show consent status per event
- Allow retrospective withdrawal of consent
- Show aggregated learning impact (e.g., "Your decisions informed 3 model improvements")

**Implementation**:
1. Query ai_learning_events for current_user_id
2. Display consent checkbox per event
3. Allow toggling consent via mmm-approval-learning-consent-update Edge Function
4. Show summary stats (events contributed, consent rate)
5. Link to learning event reasoning (if published)

---

## Integration Points

### Edge Function Mappings

| Phase | Component | Edge Function | Contract Ref |
|-------|-----------|---|---|
| 3 | InvitationDiscovery | mmm-approval-invite-accept | DB-API §14 |
| 3 | ApproverWorkspace | mmm-approval-workspace-read | DB-API §19 |
| 3 | ChangeSummary | mmm-approval-workspace-read | DB-API §19 |
| 3 | DecisionForm | mmm-approval-decision-submit | DB-API §16 |
| 4 | Level1ResponseForm | mmm-approval-level1-response-submit | DB-API §17 |
| 4 | EvidenceModal | mmm-approval-workspace-read | DB-API §19 |
| 4 | LearningConsent | mmm-approval-level1-response-submit | DB-API §17 |
| 5 | Level3ApprovalGate | mmm-approval-decision-submit | DB-API §16 |
| 5 | PublishedModelCreate | mmm-approval-lock-transition | DB-API §18 |
| 5 | PublishedModelViewer | mmm-approval-workspace-read | DB-API §19 |
| 6 | NotificationDeliver | [new] | — |
| 6 | AuditLogDashboard | mmm-approval-workspace-read | DB-API §19 |
| 6 | LearningPublish | [new] | — |
| 6 | LearningConsent | [new] | — |

---

## Test Coverage Mapping

| Test ID | Phase | Component | Test Expectation |
|---------|-------|-----------|---|
| T-MMM-APPROVAL-DB-001 | 3 | DecisionForm | Level 2 round requires domain_id |
| T-MMM-APPROVAL-DB-002 | 5 | Level3ApprovalGate | L3 blocked before L2 approval |
| T-MMM-APPROVAL-DB-003 | 3 | InvitationDiscovery | No duplicate approver emails |
| T-MMM-APPROVAL-DB-004 | 3 | InvitationDiscovery | Token stored hashed |
| T-MMM-APPROVAL-DB-005 | 3 | InvitationDiscovery | Expired/revoked invite denied |
| T-MMM-APPROVAL-DB-006 | 4 | Level1ResponseForm | Approver proposed changes captured |
| T-MMM-APPROVAL-DB-007 | 4 | Level1ResponseForm | Proposed changes immutable after lock |
| T-MMM-APPROVAL-DB-008 | 4 | Level1ResponseForm | Round status: in_review → changes_requested |
| T-MMM-APPROVAL-DB-009 | 4 | Level1ResponseForm | L1 accepts changes |
| T-MMM-APPROVAL-DB-010 | 4 | Level1ResponseForm | L1 edits proposed values |
| T-MMM-APPROVAL-DB-011 | 4 | Level1ResponseForm | L1 rejects changes |
| T-MMM-APPROVAL-DB-012 | 3 | DecisionForm | All-approver consensus locked at L2 |
| T-MMM-APPROVAL-DB-013 | 3 | DecisionForm | Domain lock created on consensus |
| T-MMM-APPROVAL-DB-014 | 3 | DecisionForm | Round status: in_review → approved_by_all |
| T-MMM-APPROVAL-DB-015 | 5 | Level3ApprovalGate | Lock transition to locked_by_final_approval |
| T-MMM-APPROVAL-DB-016 | 3 | ChangeSummary | Comments immutable |
| T-MMM-APPROVAL-DB-017 | 3 | ApproverWorkspace | RLS: user sees only own/assigned rounds |
| T-MMM-APPROVAL-DB-018 | 3 | ApproverWorkspace | Tenant isolation (cross-org blocked) |
| T-MMM-APPROVAL-DB-019 | 6 | NotificationDeliver | Idempotent notifications |
| T-MMM-APPROVAL-DB-020 | 6 | NotificationDeliver | Notification failure non-blocking |
| T-MMM-APPROVAL-DB-021 | 4 | LearningConsent | AI-learning event creation |
| T-MMM-APPROVAL-DB-022 | 4 | LearningConsent | Consent gating (consent required to publish) |

---

## Prohibited Shortcuts (Enforcement Checklist)

- ❌ **UI-only state enforcement**: All state transitions must be server-enforced in Edge Functions
- ❌ **Hard-coded user/org/domain/criterion IDs**: All IDs must come from database queries
- ❌ **Approval state in localStorage/session**: State must be fetched fresh from server on each load
- ❌ **RLS disabled or bypassed**: All queries must respect RLS policies
- ❌ **Silent mutation after lock**: Mutations after lock_state = 'locked_by_level_2' must fail loudly
- ❌ **Treating notification failure as non-fatal**: Must log and retry (idempotent delivery)
- ❌ **Skipping comment/audit immutability**: All immutable fields must have database constraints
- ❌ **Self-approval without override**: Level 1 cannot be approver in own round
- ❌ **Level 3 approval before Level 2 completion**: Must validate all L2 approvals first
- ❌ **Descriptor/domain mutation within approval round**: Lock prevents mutations

---

## Handover Gate Checklist

When Phase 3-6 complete:
- [ ] All 52 RED tests → GREEN
- [ ] All UI components connected to Edge Functions
- [ ] No hard-coded IDs in production code
- [ ] RLS enforced at all endpoints
- [ ] Audit log immutable
- [ ] Notification delivery working (email tested)
- [ ] AI learning events captured (consent gated)
- [ ] Published model snapshots created
- [ ] All CI checks GREEN
- [ ] Ready for Quality Professor review

---

**Version**: 1.0.0  
**Created**: 2026-02-18 (Phase 2 completion)  
**Status**: Phase 3-6 KICKOFF
