# MMM Published Maturity Model View QA-to-Red

Status: QA-to-red artifact
Date: 2026-06-23
Wave: `wave-mmm-published-model-qa-red-2026-06-23`
CS2 Authority: Johan Ras

## 1. Purpose

This artifact defines failing test expectations for Step 6 of the MMM approval workflow: published maturity model view.

It is intentionally pre-code. It does not implement published model UI, database migrations, API routes, edge functions, evidence management modal, MAT evidence harvest, AI question runtime, maturity scoring, evidence scoring, or approval workflow runtime behavior.

## 2. Authority inputs

- `approval-workflow-prebuild-contract.md`
- `approval-workflow-db-api-contract.md`
- `approval-workflow-notification-lock-contract.md`
- `approval-workflow-qa-to-red.md`
- `level2-invite-workspace-qa-to-red.md`
- `change-summary-accept-reject-apply-qa-to-red.md`
- `level3-approval-expansion-qa-to-red.md`
- CS2 instruction to proceed with Step 6 QA-to-red before implementation.

## 3. Feature under test

After final approval and final lock, the user must be able to view a published maturity model per domain/framework.

The published view must provide a collapsible structure that starts with MPSs and progressively exposes:

1. MPSs only.
2. MPS plus intent statement.
3. MPS plus intent plus criteria.
4. Criterion detail with maturity descriptors.
5. Criterion detail with evidence management entry point.

The view must be read-only with respect to final-approved maturity model content. Evidence management and AI question interfaces may appear as entry points/placeholders in this step but must not be implemented in this QA-to-red wave.

## 4. Red tests — Published visibility and entry point

### T-MMM-PUBLISHED-001 — Published view hidden before final approval

Given a roadmap/control standard has not reached final approval,
when a user attempts to open the published model route,
then access must be blocked or the route must show a not-published state.

### T-MMM-PUBLISHED-002 — Published view visible after final lock

Given a roadmap/control standard is final approved and final locked,
when an authorized user opens the published model route,
then the published maturity model view must be available.

### T-MMM-PUBLISHED-003 — Published view displays framework/domain identity

Given the published view loads,
then it must show framework name, domain name where applicable, publication status, and final approval state.

### T-MMM-PUBLISHED-004 — Published view is read-only

Given the published model is final locked,
then the published view must not expose direct editing controls for domain, MPS, intent, criterion, or descriptor content.

### T-MMM-PUBLISHED-005 — Published view cannot mutate canonical content

Given a user interacts with published view navigation, tabs, modals, or placeholders,
then canonical maturity model content must remain unchanged.

## 5. Red tests — Collapsible MPS-first navigation

### T-MMM-PUBLISHED-NAV-001 — Initial view shows MPS list

Given the published model loads,
then the first visible layer must show the list of MPSs for the selected domain/framework scope.

### T-MMM-PUBLISHED-NAV-002 — MPS expansion reveals intent statement

Given an MPS is collapsed,
when the user expands it,
then the MPS intent statement must become visible.

### T-MMM-PUBLISHED-NAV-003 — Criteria expansion reveals criteria under correct MPS

Given an expanded MPS has criteria,
when the user expands the criteria layer,
then each criterion must render under the correct MPS with a stable reference/sequence.

### T-MMM-PUBLISHED-NAV-004 — Descriptor expansion reveals maturity descriptors

Given a criterion has maturity descriptors,
when the user expands criterion detail,
then maturity descriptors must be visible by maturity level.

### T-MMM-PUBLISHED-NAV-005 — Collapse preserves navigation context

Given the user drills down to a criterion descriptor and collapses back up,
then the view must preserve enough context to return to the same MPS/criterion without losing state unexpectedly.

## 6. Red tests — Traceability and display references

### T-MMM-PUBLISHED-TRACE-001 — MPS reference is visible

Given an MPS appears in the published view,
then its stable MPS number/reference and name must be visible.

### T-MMM-PUBLISHED-TRACE-002 — Criterion reference is visible

Given a criterion appears in the published view,
then its reference must include MPS context and criterion sequence.

### T-MMM-PUBLISHED-TRACE-003 — Descriptor reference is visible

Given a maturity descriptor appears,
then its reference must include domain/MPS/criterion and maturity level context.

### T-MMM-PUBLISHED-TRACE-004 — Deep link preserves traceability

Given a user opens a deep link to a criterion or descriptor,
then the page must show the correct domain, MPS, criterion, and descriptor context.

### T-MMM-PUBLISHED-TRACE-005 — Search or filter does not break traceability

Given future search/filter behavior is added,
then filtered results must still show domain/MPS/criterion/descriptor context.

## 7. Red tests — Criterion card behavior

### T-MMM-PUBLISHED-CRITERION-001 — Criterion card shows statement and status

Given a criterion card renders,
then it must show criterion statement/reference and current maturity/status information if available.

### T-MMM-PUBLISHED-CRITERION-002 — Criterion card shows current maturity level tab

Given criterion detail opens,
then a current maturity level tab must be present.

### T-MMM-PUBLISHED-CRITERION-003 — Criterion card shows next maturity level tab

Given criterion detail opens,
then a next maturity level tab must be present.

### T-MMM-PUBLISHED-CRITERION-004 — Current level tab explains current position

Given the current maturity level tab is selected,
then it must show what the current level is and why that level is represented.

### T-MMM-PUBLISHED-CRITERION-005 — Next level tab explains next requirement

Given the next maturity level tab is selected,
then it must show what is required to progress to the next level.

### T-MMM-PUBLISHED-CRITERION-006 — Criterion card links to descriptor modal

Given criterion detail renders,
then the user must be able to open a maturity descriptor modal for all descriptor levels.

## 8. Red tests — Maturity descriptor modal

### T-MMM-PUBLISHED-DESCRIPTOR-001 — Descriptor modal shows all maturity levels

Given the descriptor modal opens,
then it must show Basic, Reactive, Compliant, Proactive, and Resilient descriptors where available.

### T-MMM-PUBLISHED-DESCRIPTOR-002 — Descriptor modal highlights current level

Given current maturity level information exists,
then the descriptor modal must indicate the current level.

### T-MMM-PUBLISHED-DESCRIPTOR-003 — Descriptor modal shows next level target

Given next maturity level information exists,
then the descriptor modal must indicate the next target level.

### T-MMM-PUBLISHED-DESCRIPTOR-004 — Descriptor modal remains read-only

Given the model is final locked,
then descriptor modal content must not be editable from the published view.

## 9. Red tests — Evidence management entry point placeholder

### T-MMM-PUBLISHED-EVIDENCE-001 — Evidence entry point visible on criterion card

Given a criterion card is visible,
then an evidence management entry point must be visible or reserved for the criterion.

### T-MMM-PUBLISHED-EVIDENCE-002 — Evidence entry point preserves criterion context

Given the user activates the evidence entry point,
then the future evidence modal route/action expectation must include domain, MPS, criterion, and descriptor context where applicable.

### T-MMM-PUBLISHED-EVIDENCE-003 — Evidence entry point does not implement evidence upload in this wave

Given this is the published model QA-to-red wave,
then tests must not require evidence upload runtime behavior.

### T-MMM-PUBLISHED-EVIDENCE-004 — Evidence placeholder is disabled or marked future-ready when runtime missing

Given evidence runtime is not implemented,
then the UI expectation must either disable the entry point or mark it as future-ready without breaking published view navigation.

## 10. Red tests — AI question interface placeholder

### T-MMM-PUBLISHED-AI-001 — AI question entry point visible on criterion detail

Given criterion detail renders,
then an AI question interface entry point or placeholder must be visible.

### T-MMM-PUBLISHED-AI-002 — AI question context includes selected criterion

Given the AI question entry point is activated,
then the future AI request expectation must include domain, MPS, criterion, current level, and next level context.

### T-MMM-PUBLISHED-AI-003 — AI question runtime is not implemented in this wave

Given this is the published model QA-to-red wave,
then tests must not require live AI question execution.

### T-MMM-PUBLISHED-AI-004 — AI placeholder does not mutate maturity score

Given the AI placeholder is viewed or activated,
then maturity score, descriptor content, and final-approved model content must remain unchanged.

## 11. Red tests — Authorization and read-only boundaries

### T-MMM-PUBLISHED-AUTH-001 — Unauthorized user cannot view unpublished/final-private model

Given a user lacks access to the organisation/framework,
when they attempt to open the published view,
then access must be denied.

### T-MMM-PUBLISHED-AUTH-002 — Authorized user can view final published model

Given a user has authorized access,
when they open the final published model,
then view access must be allowed.

### T-MMM-PUBLISHED-AUTH-003 — Viewer cannot perform approval actions from published view

Given a user is in the published model view,
then Level 2/Level 3 approval actions must not be available from that view.

### T-MMM-PUBLISHED-AUTH-004 — Viewer cannot edit model structure from published view

Given a user is in the published model view,
then controls to edit domains, MPS, intent statements, criteria, or descriptors must not be available.

## 12. Red tests — Loading, empty, and error states

### T-MMM-PUBLISHED-STATE-001 — Loading state visible

Given the published model data is loading,
then a loading state must be visible.

### T-MMM-PUBLISHED-STATE-002 — Empty model state visible

Given a final-approved model has no available published content due to data inconsistency,
then an empty/error state must be visible rather than a blank page.

### T-MMM-PUBLISHED-STATE-003 — Fetch error state visible

Given the published model data fails to load,
then a visible error state and retry expectation must exist.

### T-MMM-PUBLISHED-STATE-004 — Partial data state preserves available traceability

Given some descriptors or criteria fail to load,
then available domain/MPS/criterion context must remain visible and missing data must be clearly marked.

## 13. Non-goals for this QA-to-red wave

The future implementation wave must not use these tests to implement:

- evidence upload runtime;
- MAT evidence harvest/adaptation;
- AI question runtime;
- evidence scoring;
- maturity scoring recalculation;
- approval workflow runtime actions;
- database migrations or API endpoints beyond test expectations.

## 14. Acceptance criteria for this QA-to-red artifact

This artifact is complete when a future builder can convert these expectations into executable failing tests before implementing:

- published model visibility after final approval/final lock;
- read-only published model access;
- collapsible MPS-first navigation;
- drilldown to intent, criteria, and descriptors;
- criterion cards;
- current and next maturity tabs;
- maturity descriptor modal;
- evidence management and AI question placeholders;
- traceability and deep-link context;
- authorization, loading, empty, and error states;
- no mutation of final-approved model content from the published view.
