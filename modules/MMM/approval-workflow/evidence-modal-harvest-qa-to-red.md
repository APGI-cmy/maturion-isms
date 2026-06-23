# MMM Evidence Modal Harvest/Adaptation QA-to-Red

Status: QA-to-red artifact
Date: 2026-06-23
Wave: `wave-mmm-evidence-modal-qa-red-2026-06-23`
CS2 Authority: Johan Ras

## 1. Purpose

This artifact defines failing test expectations for Step 7 of the MMM approval workflow: evidence modal harvest/adaptation from MAT.

It is intentionally pre-code. It does not implement evidence modal UI, upload runtime, storage adapters, camera/audio/video capture runtime, AI evidence evaluation, PIT/risk/incident integrations, database migrations, API routes, edge functions, published model runtime behavior, or approval workflow runtime behavior.

## 2. Authority inputs

- `approval-workflow-prebuild-contract.md`
- `approval-workflow-db-api-contract.md`
- `approval-workflow-notification-lock-contract.md`
- `approval-workflow-qa-to-red.md`
- `level2-invite-workspace-qa-to-red.md`
- `change-summary-accept-reject-apply-qa-to-red.md`
- `level3-approval-expansion-qa-to-red.md`
- `published-model-view-qa-to-red.md`
- `modules/mat/frontend/src/components/evidence/EvidenceUploadPanel.tsx`
- CS2 instruction to proceed with Step 7 QA-to-red before implementation.

## 3. Feature under test

The published maturity model view must provide an evidence management entry point from criterion context. The future evidence modal should harvest/adapt the MAT evidence panel patterns while preserving MMM criterion/domain/MPS context.

The MAT source supports evidence types and behaviors that must be represented in MMM QA-to-red expectations:

- document/URL;
- photo/image;
- text findings;
- video;
- spreadsheet/file;
- voice note/audio;
- remove/replace controls;
- criterion-scoped storage path context.

This wave does not implement the modal. It prepares QA-to-red only.

## 4. Red tests — MAT source identification

### T-MMM-EVIDENCE-SOURCE-001 — MAT source component is identified

Given Step 7 implementation is planned,
then tests must expect the source reference `modules/mat/frontend/src/components/evidence/EvidenceUploadPanel.tsx` to be used as the behavioral source for evidence type and control parity.

### T-MMM-EVIDENCE-SOURCE-002 — MAT evidence type parity is required

Given MAT supports evidence types for document/URL, photo/image, text/findings, video, spreadsheet/file, voice note/audio, and interview recording,
then the future MMM evidence modal test suite must include those evidence type expectations (or explicitly document any intentional exclusions).

### T-MMM-EVIDENCE-SOURCE-003 — MAT remove/replace parity is required

Given MAT supports remove and replace controls for uploaded evidence,
then the future MMM evidence modal test suite must include remove and replace expectations.

### T-MMM-EVIDENCE-SOURCE-004 — MAT storage path context is adapted, not copied blindly

Given MAT stores evidence using organisation, audit, and criterion context,
then MMM must adapt the path expectation to organisation/framework-or-roadmap/criterion context without losing criterion identity.

## 5. Red tests — Published criterion entry point

### T-MMM-EVIDENCE-ENTRY-001 — Criterion card exposes evidence entry point

Given a published criterion card is visible,
then an evidence management entry point must be visible or reserved on that criterion card.

### T-MMM-EVIDENCE-ENTRY-002 — Evidence entry point preserves domain context

Given the user opens evidence management from a criterion card,
then the evidence modal context expectation must include domain id and domain display reference.

### T-MMM-EVIDENCE-ENTRY-003 — Evidence entry point preserves MPS context

Given the user opens evidence management from a criterion card,
then the evidence modal context expectation must include MPS id and MPS display reference.

### T-MMM-EVIDENCE-ENTRY-004 — Evidence entry point preserves criterion context

Given the user opens evidence management from a criterion card,
then the evidence modal context expectation must include criterion id, criterion sequence/reference, and criterion statement.

### T-MMM-EVIDENCE-ENTRY-005 — Evidence entry point preserves descriptor context when applicable

Given the user opens evidence management from a maturity descriptor view,
then the evidence modal context expectation must include maturity level and descriptor reference where applicable.

## 6. Red tests — Evidence type expectations

### T-MMM-EVIDENCE-TYPE-001 — Document/URL evidence option exists

Given the evidence modal opens,
then a document/URL evidence option must be available.

### T-MMM-EVIDENCE-TYPE-002 — Photo/image evidence option exists

Given the evidence modal opens,
then a photo/image evidence option must be available.

### T-MMM-EVIDENCE-TYPE-003 — Text findings evidence option exists

Given the evidence modal opens,
then a text findings or findings-note evidence option must be available.

### T-MMM-EVIDENCE-TYPE-004 — Video evidence option exists

Given the evidence modal opens,
then a video evidence option must be available.

### T-MMM-EVIDENCE-TYPE-005 — Spreadsheet/file evidence option exists

Given the evidence modal opens,
then a spreadsheet/file evidence option must be available.

### T-MMM-EVIDENCE-TYPE-006 — Voice note/audio evidence option exists

Given the evidence modal opens,
then a voice note/audio evidence option must be available.

### T-MMM-EVIDENCE-TYPE-007 — Evidence option labels are clear to non-technical users

Given evidence options render,
then each option label must clearly describe what the user can upload or capture.

## 7. Red tests — Upload/runtime placeholders

### T-MMM-EVIDENCE-UPLOAD-001 — Runtime upload not required in QA-to-red wave

Given this is the QA-to-red wave,
then tests must not require actual file upload runtime behavior.

### T-MMM-EVIDENCE-UPLOAD-002 — Future upload request preserves context

Given a future upload action is triggered,
then the request expectation must include organisation id, framework or roadmap id, domain id, MPS id, criterion id, evidence type, and user id.

### T-MMM-EVIDENCE-UPLOAD-003 — Future upload result preserves storage path

Given a future upload succeeds,
then the result expectation must include a criterion-scoped storage path and uploaded evidence id.

### T-MMM-EVIDENCE-UPLOAD-004 — Upload validation blocks missing criterion context

Given criterion id or criterion reference is missing,
when a future upload action is attempted,
then upload must be blocked with a visible context error.

## 8. Red tests — Remove and replace controls

### T-MMM-EVIDENCE-CONTROL-001 — Uploaded evidence list shows remove control

Given uploaded evidence exists for a criterion,
then the evidence list must expose a remove control for each removable item.

### T-MMM-EVIDENCE-CONTROL-002 — Uploaded evidence list shows replace control

Given uploaded evidence exists for a criterion,
then the evidence list must expose a replace control for each replaceable item.

### T-MMM-EVIDENCE-CONTROL-003 — Remove preserves audit expectation

Given a future remove action is requested,
then tests must expect an evidence removal audit event with actor, evidence id, criterion id, reason where supplied, and timestamp.

### T-MMM-EVIDENCE-CONTROL-004 — Replace preserves previous evidence reference

Given a future replace action is requested,
then tests must expect the new evidence record to retain reference to the replaced evidence id.

### T-MMM-EVIDENCE-CONTROL-005 — Remove/replace does not mutate maturity descriptor text

Given evidence is removed or replaced,
then maturity descriptor content and final-approved maturity model text must remain unchanged.

## 9. Red tests — Mobile capture and direct camera expectations

### T-MMM-EVIDENCE-CAPTURE-001 — Mobile photo capture expectation exists

Given the user is on a mobile-capable device,
then a future photo capture expectation must be available for image evidence.

### T-MMM-EVIDENCE-CAPTURE-002 — Mobile video capture expectation exists

Given the user is on a mobile-capable device,
then a future video capture expectation must be available for video evidence.

### T-MMM-EVIDENCE-CAPTURE-003 — Mobile voice note capture expectation exists

Given the user is on a mobile-capable device,
then a future voice note capture expectation must be available for audio evidence.

### T-MMM-EVIDENCE-CAPTURE-004 — Direct camera capture preserves criterion context

Given a user captures photo or video directly from the criterion card/modal,
then the future capture request expectation must preserve organisation, framework/roadmap, domain, MPS, and criterion context.

### T-MMM-EVIDENCE-CAPTURE-005 — Capture permissions failure is visible

Given the browser/device denies camera or microphone access,
then a visible error state and fallback upload option expectation must exist.

## 10. Red tests — Evidence list rendering

### T-MMM-EVIDENCE-LIST-001 — Evidence list renders by criterion

Given a criterion has linked evidence,
then the evidence list must render only evidence linked to that criterion.

### T-MMM-EVIDENCE-LIST-002 — Evidence list shows metadata

Given evidence items render,
then each item must show evidence type, filename/title or summary, uploader, uploaded timestamp, and status where available.

### T-MMM-EVIDENCE-LIST-003 — Empty evidence state is visible

Given a criterion has no evidence,
then the evidence modal must show a visible empty state rather than a blank panel.

### T-MMM-EVIDENCE-LIST-004 — Evidence loading/error states are visible

Given evidence list data is loading or fails to load,
then loading and error states must be visible.

## 11. Red tests — AI evidence evaluation placeholders

### T-MMM-EVIDENCE-AI-001 — AI evaluation entry point placeholder exists

Given evidence is linked to a criterion,
then an AI evidence evaluation entry point or placeholder must exist.

### T-MMM-EVIDENCE-AI-002 — AI evaluation request preserves criterion context

Given the future AI evaluation action is triggered,
then the request expectation must include criterion id, evidence ids, current maturity level, target maturity level, and organisation context.

### T-MMM-EVIDENCE-AI-003 — AI evaluation runtime is not implemented in this wave

Given this is the QA-to-red wave,
then tests must not require live AI evaluation execution.

### T-MMM-EVIDENCE-AI-004 — Re-evaluation placeholder exists after evidence changes

Given evidence is added, removed, or replaced,
then a future re-evaluation placeholder or expectation must be visible or queued.

### T-MMM-EVIDENCE-AI-005 — AI evaluation placeholder does not mutate score

Given the AI placeholder is viewed or triggered,
then current maturity score, descriptor content, and final-approved model content must remain unchanged.

## 12. Red tests — PIT/risk/incident link placeholders

### T-MMM-EVIDENCE-LINK-001 — PIT link placeholder exists

Given the evidence modal opens,
then a future PIT linkage placeholder must be available or reserved.

### T-MMM-EVIDENCE-LINK-002 — Risk register link placeholder exists

Given the evidence modal opens,
then a future risk register linkage placeholder must be available or reserved.

### T-MMM-EVIDENCE-LINK-003 — Incident link placeholder exists

Given the evidence modal opens,
then a future incident linkage placeholder must be available or reserved.

### T-MMM-EVIDENCE-LINK-004 — External data links preserve criterion context

Given a future PIT/risk/incident link is created,
then the request expectation must preserve organisation, framework/roadmap, domain, MPS, and criterion context.

## 13. Red tests — Authorization and read-only boundaries

### T-MMM-EVIDENCE-AUTH-001 — Unauthorized user cannot open evidence modal

Given a user lacks access to the published model or criterion,
when they attempt to open evidence management,
then access must be denied.

### T-MMM-EVIDENCE-AUTH-002 — Viewer without evidence permission cannot add evidence

Given a user may view the published model but lacks evidence contribution permission,
when they attempt to add evidence,
then the action must be blocked.

### T-MMM-EVIDENCE-AUTH-003 — Evidence actions do not alter final-approved model text

Given an authorized user adds, removes, replaces, or links evidence in the future implementation,
then final-approved domain, MPS, criterion, and descriptor text must remain unchanged.

### T-MMM-EVIDENCE-AUTH-004 — Evidence actions do not trigger approval workflow transitions

Given evidence is added, removed, replaced, or linked,
then Level 2, Level 3, final approval, and lock states must not change.

## 14. Non-goals for this QA-to-red wave

The future implementation wave must not use these tests to implement:

- evidence modal UI runtime;
- upload runtime;
- storage adapters;
- camera/audio/video capture runtime;
- AI evidence evaluation runtime;
- PIT/risk/incident integrations;
- database migrations;
- API routes or edge functions;
- published model runtime behavior;
- approval workflow runtime behavior.

## 15. Acceptance criteria for this QA-to-red artifact

This artifact is complete when a future builder can convert these expectations into executable failing tests before implementing:

- MAT evidence source parity expectations;
- criterion-linked evidence modal entry;
- evidence type options;
- upload/capture context preservation;
- remove/replace controls;
- evidence list rendering;
- AI evaluation and re-evaluation placeholders;
- PIT/risk/incident placeholders;
- authorization and read-only boundaries;
- non-mutation of final-approved maturity model and approval workflow state.
