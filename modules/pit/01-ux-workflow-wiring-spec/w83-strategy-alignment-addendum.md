# PIT UX/Wiring Addendum — W8.3 Strategy Alignment

## 1. Project-to-task setup journey

### J-W83-01 — Project leader establishes milestones

1. Project creation completes with name, purpose, description, leader and project dates.
2. The Implementation screen opens a guided `Set up milestones` step.
3. User chooses `Create manually` or `Ask Maturion for suggestions`.
4. Suggested milestones remain editable drafts until approved.
5. Each milestone is placed within project dates using date fields in W8.3 and timeline drag/resize in W8.6.
6. An owner is selected from current members or invited by email.
7. Invitation preview explains full milestone accountability and responsibility for descendant deliverables.
8. Milestone persists only after required fields and owner/default-accountability rules pass.

### J-W83-02 — Milestone owner establishes deliverables

1. Accepted milestone owner opens the milestone workspace.
2. Whole project is visible read-only according to membership.
3. Editing is enabled only within the owned milestone subtree.
4. Owner chooses manual creation or Maturion suggestions.
5. Deliverables are reviewed, dated and assigned.
6. Invitation explains responsibility for delivery and descendant tasks.

### J-W83-03 — Deliverable owner establishes tasks

1. Accepted deliverable owner opens the deliverable workspace.
2. Owner chooses manual creation, task-cluster template or Maturion suggestions.
3. Every task requires a deliverable parent, clear action statement, owner/default accountability, dates and completion/evidence criteria.
4. No `Add task directly to project` path is displayed.

## 2. Invitation and acceptance states

Required invitation states:

- draft;
- sent;
- delivered;
- accepted;
- rejected;
- expired;
- revoked.

Acceptance grants the defined project visibility and scoped editing permission. Rejection leaves the hierarchy item with its higher-level accountable owner until reassigned.

## 3. Scoped editing UX

- Project leader: edit whole project hierarchy.
- Milestone owner: edit owned milestone and descendants.
- Deliverable owner: edit owned deliverable and descendants.
- Task owner: update owned task execution fields and submit evidence.
- Viewer: read-only.

Disabled controls must explain why the action is unavailable. Hiding a control is not a substitute for backend denial.

## 4. Cancellation wizard

### J-W83-04 — Cancel milestone or deliverable with incomplete work

1. User selects `Cancel Milestone` or `Cancel Deliverable`.
2. System checks incomplete descendants.
3. If none exist, normal confirmation may proceed.
4. If incomplete descendants exist, cancellation is blocked.
5. Modal states: `This item cannot be cancelled because incomplete work remains.`
6. User chooses `Propose transfer of incomplete work` or `Keep item active`.
7. Transfer wizard lists each incomplete child and valid active target parent options.
8. User provides rationale and submits proposal.
9. Project leader receives approval request.
10. Until approval, source and target hierarchies remain unchanged.
11. Approval confirmation shows the complete move plan.
12. On approval, system applies all moves and cancellation atomically.
13. On any failure, no partial move or cancellation remains.
14. Rejection returns the proposal with reason and leaves hierarchy unchanged.

## 5. Date containment UX

- `end < start`: inline hard error; Save disabled.
- Child outside parent range: warning summary and explicit `Confirm exception` action.
- Confirmation requires rationale and creates an exception record.
- No silent date adjustment or automatic cascading date change.

## 6. AI suggestion and edit-learning UX

- `Ask Maturion` is optional and clearly labelled.
- Suggestions show source context and are marked `AI suggested — not yet approved`.
- User can accept, edit or reject each item.
- After an accepted edit, optional modal asks: `Use this accepted edit to improve Maturion's suggestions for your governed profile?`
- Default is `No`.
- Consent text identifies what is stored and provides a link to inspect/remove learned preferences.

## 7. MMM-origin project UX

MMM-origin project setup displays the imported structure before approval:

- Domains as proposed milestones;
- MPSs as proposed deliverables;
- criteria transformed into proposed executable tasks;
- source identifiers and lineage visible in details;
- user may edit task decomposition without breaking source lineage.

## 8. Screen states

Every W8.3 hierarchy and structural-change screen must implement loading, empty, permission/error, network-error and data states. Approval-pending is an additional domain state, not a substitute for the five standard states.

## 9. Later-wave wiring boundaries

- W8.4 implements live invitations, notifications and My Work.
- W8.5 implements evidence upload/review and audit export.
- W8.6 implements visual timeline drag/resize.
- W8.7 implements roll-up, RAG and watchdog.
- W8.9 implements live AIMC assistance and governed preference learning.

W8.3 must provide structurally complete fields, routes and contracts without falsely claiming these later runtimes.
