# MAT — Functional Requirements Specification (FRS)

**Module**: MAT (Manual Audit Tool)
**Artifact Type**: Functional Requirements Specification
**Status**: COMPLETE
**Version**: v1.3.0
**Owner**: Foreman (FM)
**Authority**: Derived from App Description v1.2 (modules/mat/00-app-description/app-description.md)
**Applies To**: MAT module within maturion-isms repository
**Created**: 2026-02-13
**Last Updated**: 2026-02-13

---

## 0. Document Purpose

This document specifies all **verifiable, testable functional requirements** for the Manual Audit Tool (MAT) module. Every requirement is derived from the authoritative App Description (`modules/mat/00-app-description/app-description.md` v1.1 and `modules/mat/00-app-description/MAT_Manual_Audit_Tool_Updated.md`) and is suitable for downstream consumption by TRS, Architecture, and Builder stages.

### Derivation Statement

All requirements in this document are derived from the MAT App Description v1.1. No requirement exists without a traceable source in the App Description. Requirements that extend or clarify the App Description are explicitly marked with rationale.

### Priority Classification

- **P0 (Must Have)**: Core functionality required for MVP. System is non-functional without these.
- **P1 (Should Have)**: Important functionality expected at launch. System is usable but incomplete without these.
- **P2 (Nice to Have)**: Future enhancements or non-critical extensions. System is fully functional without these.

### Requirement ID Convention

All requirements use the format `FR-NNN` where NNN is a three-digit sequential number. Requirements are grouped by functional area.

---

## 1. Audit Lifecycle Management

### FR-001: Create New Audit

**Priority**: P0
**Source**: App Description §2 (Step 1), §5.1

The system MUST allow a Lead Auditor to create a new audit with the following mandatory fields:

- Audit Title
- Organisation Name (client)
- Facility / Location (site)
- Audit Lead (assigned Lead Auditor)
- Audit Period (start date and end date)

**Acceptance Criteria**:
1. All five fields are mandatory; form submission is blocked if any field is empty.
2. A unique audit ID is generated upon creation.
3. The audit is created with status "Not Started".
4. The creating user is assigned as Lead Auditor.
5. Audit creation is logged in the audit trail.

**Edge Cases**:
- Duplicate audit titles for the same organisation are permitted but a warning is displayed.
- Audit period end date must be on or after start date.

---

### FR-002: Audit Status Lifecycle

**Priority**: P0
**Source**: App Description §3.2.2

The system MUST enforce the following audit-level status transitions:

Not Started → In Progress → Under Review → Completed → Archived

**Acceptance Criteria**:
1. Status transitions follow the defined order; skipping states is not permitted.
2. Only the Lead Auditor can transition an audit to "Completed".
3. All status changes are logged with user, timestamp, and previous state.

**Edge Cases**:
- An audit in "Completed" status can be reopened (back to "Under Review") only by the Lead Auditor with mandatory justification. This is logged in the audit trail.

---

### FR-003: Audit Deletion and Archival

**Priority**: P1
**Source**: App Description §14

The system MUST support soft deletion and archival of audits.

**Acceptance Criteria**:
1. Audits are never physically deleted; soft delete marks them as archived.
2. Archived audits are accessible for read-only review.
3. Soft deletion is logged with user, timestamp, and justification.

---

## 2. Criteria Document Upload and AI Compilation

### FR-004: Upload Criteria Document

**Priority**: P0
**Source**: App Description §2 (Step 2), §6.1

The system MUST allow the Lead Auditor to upload one or more criteria documents in the following formats:

- .doc / .docx
- .pdf
- .xls / .xlsx
- .ppt / .pptx
- Plain text formats

**Acceptance Criteria**:
1. Upload supports all listed file formats.
2. Multiple documents can be uploaded per audit.
3. File size limits are enforced: 50MB for documents.
4. SHA-256 hash is computed on upload for integrity verification.
5. Uploaded files are immutable after upload (soft delete only).
6. Upload is logged in the audit trail.

**Edge Cases**:
- Unsupported file formats are rejected with a clear error message.
- Corrupt or unreadable files are flagged; AI parsing is not attempted.
- Zero-byte files are rejected.

---

### FR-005: AI Criteria Parsing and Structure Extraction

**Priority**: P0
**Source**: App Description §6.2, §15.1

The system MUST invoke AI to parse uploaded criteria documents and extract a three-level hierarchy:

- Level 1: Domains
- Level 2: Mini Performance Standards (MPS)
- Level 3: Criteria

**Acceptance Criteria**:
1. AI produces output conforming to the Criteria Structure Schema (App Description §15.1).
2. Sequential numbering is applied: Domains = `N`, MPS = `N.N`, Criteria = `N.N.N`.
3. Source anchors linking each criterion back to the source document are preserved.
4. AI includes warnings for ambiguous or uncertain extractions.
5. Items with confidence < 0.85 are flagged with `needs_human_review = true`.
6. Parsing progress is displayed to the user.

**Edge Cases**:
- Documents with no discernible structure: AI must flag the entire document for manual structuring.
- Mixed-language documents: AI must attempt parsing and flag language transitions.
- Documents with tables, images, or non-text content: AI must extract text from tables; non-text content is flagged for human review.

---

### FR-006: No Hallucination Rule

**Priority**: P0
**Source**: App Description §7.1

AI MUST NOT invent criteria that do not exist in the source document.

**Acceptance Criteria**:
1. Every criterion in AI output traces to a source content block via `source_anchor`.
2. If AI is uncertain, it flags `needs_human_review = true` and includes the raw excerpt.
3. AI explains any ambiguity in the warnings array.
4. Zero tolerance for hallucinated criteria (100% traceability required).

---

### FR-007: Coverage Rule

**Priority**: P0
**Source**: App Description §7.2

Every source content block in the uploaded document MUST be either:
- Mapped to a Domain, MPS, or Criterion, OR
- Explicitly marked as non-criteria context (e.g., introductory text, headers, footers)

**Acceptance Criteria**:
1. AI output includes a coverage report showing all source blocks and their mapping.
2. Unmapped content is listed as "non-criteria context" with explanation.
3. Coverage percentage is calculated and displayed.
4. Coverage below 100% requires human review before proceeding.

---

### FR-008: Human Approval of Compiled Structure

**Priority**: P0
**Source**: App Description §6.2 (Step 4), §2 (Step 2)

The Lead Auditor MUST approve the AI-compiled criteria structure before audit execution begins.

**Acceptance Criteria**:
1. Compiled structure is presented for review with all domains, MPS, and criteria.
2. Items flagged for human review are highlighted.
3. Lead Auditor can edit, add, remove, or re-order items before approval.
4. Approval action is logged with timestamp and user.
5. After approval, the criteria numbering becomes immutable (append-only changes permitted).
6. Audit execution cannot begin until structure is approved.

**Edge Cases**:
- If Lead Auditor rejects the structure, AI re-parsing can be triggered with adjusted parameters.
- Partial approval is not supported; the entire structure must be approved or rejected.

---

### FR-009: Criteria Numbering Immutability

**Priority**: P0
**Source**: App Description §2.2

After approval, Domain/MPS/Criteria numbering is immutable.

**Acceptance Criteria**:
1. Numbering follows the pattern: Domain = `N`, MPS = `N.N`, Criteria = `N.N.N`.
2. After approval, changes to the hierarchy are append-only events.
3. Append-only changes are logged in the audit trail with full before/after state.
4. The system prevents renumbering or reordering of approved items.

---

## 3. Audit Execution Structure and Navigation

### FR-010: Hierarchical Navigation

**Priority**: P0
**Source**: App Description §3

The system MUST provide hierarchical navigation through the audit structure:

Domain → MPS → Criteria

**Acceptance Criteria**:
1. Users can navigate from audit level down to individual criteria.
2. Each level displays its children (Domains show MPS list, MPS shows Criteria list).
3. Status indicators are visible at each level (completion %, outstanding items).
4. Navigation is responsive across desktop, tablet, and mobile viewports.

---

### FR-011: Criteria Modal

**Priority**: P0
**Source**: App Description §4, §8.1

Clicking a Criterion MUST open a modal containing:

1. **Criteria Description** — Full criteria statement
2. **Not Used** checkbox and exclusion workflow
3. **Evidence Collection** — Multi-format evidence capture
4. **Findings** — Typed notes
5. **Voice** — Recorded observations
6. **Conversation/Interview** — Interview mode access

**Acceptance Criteria**:
1. Modal opens in < 500ms.
2. All tabs/sections are accessible within the modal.
3. Modal supports scrolling for long content.
4. Modal can be closed without losing unsaved data (with confirmation prompt).
5. Modal is responsive across all supported viewports.

---

### FR-012: "Not Used" Criteria Exclusion

**Priority**: P0
**Source**: App Description §4.2

The system MUST allow marking a criterion as "Not Used" for the current audit.

**Acceptance Criteria**:
1. A checkbox "This criteria will not be used during this audit" is available.
2. Selecting the checkbox opens a confirmation modal requiring:
   - Mandatory reason for exclusion
   - Justification explanation
   - Submit confirmation
3. Excluded criteria are logged in the audit trail.
4. Excluded criteria are included in the final report with exclusion reason.
5. Excluded criteria do not count toward completion metrics.
6. Exclusion can be reversed (criterion re-included) before audit completion, with logging.

**Edge Cases**:
- Attempting to exclude a criterion that already has evidence: warning is shown; evidence is retained but excluded from scoring.

---

## 4. Evidence Collection

### FR-013: Multi-Format Evidence Capture

**Priority**: P0
**Source**: App Description §4.3, §8.1

The system MUST support the following evidence types per criterion:

- **Text**: Typed findings and notes
- **Voice**: Audio recordings (.mp3, .wav, .m4a)
- **Photo**: Camera capture and image upload (.jpg, .jpeg, .png, .webp)
- **Document**: File uploads (.pdf, .docx, .xlsx, .pptx)
- **Video**: Video uploads (.mp4, .mov, .avi)

**Acceptance Criteria**:
1. Each evidence type has a dedicated capture/upload mechanism.
2. Evidence is associated with the correct criterion.
3. Metadata is captured: timestamp, uploading user, location (if available), sync status.
4. Evidence upload preview renders in < 1 second.
5. Multiple evidence items of any type can be attached to a single criterion.
6. Evidence items are immutable after upload (soft delete with audit trail).

**Edge Cases**:
- Uploading evidence to a "Not Used" criterion: system warns but permits (evidence retained, not scored).
- File exceeding size limit: rejected with clear error and file size limit displayed.

---

### FR-014: Voice Recording

**Priority**: P0
**Source**: App Description §4.3, §8.1

The system MUST support in-app voice recording for audit observations.

**Acceptance Criteria**:
1. Voice recording can be started, paused, and stopped within the criteria modal.
2. Recording is saved as .mp3 or .wav format.
3. AI transcription is generated from the recording.
4. Transcript is editable by the auditor.
5. Both recording and transcript are stored as evidence.

---

### FR-015: Photo Capture

**Priority**: P0
**Source**: App Description §4.3, §8.1

The system MUST support camera capture and photo upload for evidence.

**Acceptance Criteria**:
1. Camera capture is available on mobile devices via browser API.
2. Existing images can be uploaded from device storage.
3. Image preview is displayed after capture/upload.
4. Supported formats: .jpg, .jpeg, .png, .webp.
5. Maximum file size: 50MB.

---

### FR-016: Document Upload as Evidence

**Priority**: P0
**Source**: App Description §4.3

The system MUST support document upload as evidence for criteria.

**Acceptance Criteria**:
1. Supported formats: .pdf, .docx, .xlsx, .pptx, and text formats.
2. Maximum file size: 50MB per document.
3. Document name and type are displayed in the evidence list.
4. Documents are stored with SHA-256 hash for integrity verification.

---

### FR-017: Video Upload and Processing

**Priority**: P0
**Source**: App Description §5, §16.7

The system MUST support video upload with AI-assisted processing.

**Acceptance Criteria**:
1. Supported formats: .mp4, .mov, .avi.
2. Maximum file size: 500MB per video.
3. Upon upload, the system MUST:
   a. Extract the audio track (for transcription).
   b. Generate a transcript via AI (Whisper or equivalent).
   c. Extract still-frame snapshots at defined intervals (every 10 seconds + key frames).
   d. Generate thumbnails for snapshot selection UI.
4. User can select specific snapshots for inclusion in the report.
5. Transcript and selected snapshots are stored as evidence.
6. Video metadata is extracted: duration, resolution, codec, frame rate.

**Edge Cases**:
- Video with no audio track: skip audio extraction, proceed with snapshot extraction.
- Corrupt video file: reject with error message before processing.
- Very long videos (>1 hour): processing progress indicator displayed.

---

### FR-018: Concurrent Evidence Upload

**Priority**: P1
**Source**: App Description §3.3.1

The system MUST support concurrent upload of 10+ files simultaneously.

**Acceptance Criteria**:
1. At least 10 files can be uploaded in parallel without failure.
2. Individual upload progress is shown for each file.
3. Failed uploads can be retried individually.
4. Upload queue handles mixed file types.

---

## 5. Evidence Review Stage

### FR-019: Pre-Report Evidence Review

**Priority**: P0
**Source**: App Description §6

Before final report generation, the user MUST review all uploaded evidence.

**Acceptance Criteria**:
1. A dedicated evidence review screen/stage is provided.
2. All evidence items across all criteria are listed for review.
3. Users can:
   a. Edit transcripts.
   b. Replace photographs.
   c. Replace documents.
   d. Replace video files.
4. Re-running AI evaluation is triggered if evidence is updated.
5. Report generation is blocked until user approves reviewed evidence.

**Edge Cases**:
- Replacing evidence for an already AI-scored criterion: AI scoring must be invalidated and re-run.
- Review of evidence on "Not Used" criteria: shown in review but marked as excluded.

---

## 6. Conversation and Interview Mode

### FR-020: Criterion-Level Interview

**Priority**: P0
**Source**: App Description §9.1, §9.2

The system MUST support criterion-level interviews.

**Acceptance Criteria**:
1. Interview can be started from within the criteria modal.
2. Audio is recorded during the interview.
3. AI generates a transcript from the audio.
4. Findings are extracted from the transcript for the linked criterion.
5. Transcript segments are time-stamped.

---

### FR-021: Audit-Level Interview

**Priority**: P1
**Source**: App Description §9.2

The system MUST support audit-level interviews that cover multiple topics.

**Acceptance Criteria**:
1. Interview can be started from the audit conversation screen.
2. Audio is recorded.
3. AI generates a transcript.
4. Transcript segments can be tagged to specific Domains, MPS, or Criteria.
5. Tagged segments are linked as evidence to the corresponding items.

**Edge Cases**:
- Transcript segment relevant to multiple criteria: allow tagging to multiple items.
- Untagged transcript segments: retained as general audit notes.

---

### FR-022: Interview Governance Rules

**Priority**: P0
**Source**: App Description §9.3

The system MUST enforce interview governance rules.

**Acceptance Criteria**:
1. All transcript segments are time-stamped.
2. AI must cite transcript excerpts when using interview evidence for scoring.
3. Testimonial (interview) evidence is weighted lower than documentary evidence in AI scoring.
4. Weighting is transparent and visible to the auditor.

---

## 7. AI Scoring and Maturity Evaluation

### FR-023: AI Maturity Scoring per Criterion

**Priority**: P0
**Source**: App Description §7, §10.1, §15.2

For each criterion with sufficient evidence, the system MUST invoke AI to evaluate and propose a maturity level.

**Acceptance Criteria**:
1. AI assigns one of five maturity levels: Basic, Reactive, Compliant, Proactive, Resilient.
2. AI provides a confidence score (0.0–1.0).
3. AI provides a rationale citing specific evidence items.
4. AI identifies gaps to the next maturity level:
   - Immediate actions
   - Medium-term actions
   - Long-term actions
5. AI output conforms to the AI Scoring Schema (App Description §15.2).
6. AI scoring completes in < 30 seconds per criterion.

**Edge Cases**:
- Criterion with conflicting evidence: AI flags conflict and reduces confidence score.
- Criterion with only testimonial evidence: AI applies lower weighting and flags for review.

---

### FR-024: Evidence-First Scoring Rule

**Priority**: P0
**Source**: App Description §7.3, AC-AI02

AI MUST refuse to score a criterion if evidence is insufficient.

**Acceptance Criteria**:
1. AI refuses to score when a criterion has fewer than 2 evidence items.
2. When refusing, AI provides `refuse_to_score = true` and lists `missing_evidence_needed`.
3. Refused criteria are flagged in the dashboard as "AI Blocked".
4. Auditor is prompted to add more evidence.

---

### FR-025: Human Confirmation of AI Scoring

**Priority**: P0
**Source**: App Description §10.2, AC-F04

Human MUST confirm or override every AI maturity score.

**Acceptance Criteria**:
1. AI-scored criteria require human review before being considered "Confirmed".
2. Human can confirm the AI score (accepted as-is).
3. Human can override the AI score with a different maturity level.
4. Override requires a mandatory justification (text field, cannot be empty).
5. Both AI output and human decision are stored (original AI score, confidence, rationale + human confirmed level, override justification).
6. Status transitions: AI Scored → Confirmed (or Overridden).

**Edge Cases**:
- Human overrides to a level more than 2 levels away from AI suggestion: system shows a warning but permits the override.
- Changing a confirmed score: allowed before audit completion, with full audit trail.

---

### FR-026: AI Override Logging for Learning

**Priority**: P1
**Source**: App Description §7, §18.2

All human overrides of AI scores MUST be logged for AI learning improvement.

**Acceptance Criteria**:
1. Override data includes: original AI level, human-selected level, justification, evidence items.
2. Override data is categorized by reason (evidence quality, AI misinterpretation, domain-specific nuance, other).
3. Override data is available for aggregated analysis.
4. Privacy safeguards: client data is anonymized before model training use.

---

### FR-027: Maturity Model Support

**Priority**: P0
**Source**: App Description §3, §3.1

The system MUST enforce the 5-level maturity model and support both global and criterion-specific definitions.

**Acceptance Criteria**:
1. Maturity levels are: Basic (1), Reactive (2), Compliant (3), Proactive (4), Resilient (5).
2. Global maturity DNA definitions are configurable and displayed.
3. Criterion-specific maturity definitions are supported.
4. Both global and criterion-specific definitions appear in the final report.

**Edge Cases**:
- New maturity models beyond 5 levels: system supports configuration of additional models (future extensibility requirement per App Description §15.4).

---

## 8. AI Model Routing and Governance

### FR-028: Dynamic AI Task Routing

**Priority**: P0
**Source**: App Description §8, §15.4, §16.6

The system MUST automatically route AI tasks to the correct model/capability.

**Acceptance Criteria**:
1. Document parsing → structured reasoning model (GPT-4 Turbo or equivalent).
2. Audio transcription → speech-to-text model (Whisper or equivalent).
3. Image interpretation → vision model (GPT-4 Vision or equivalent).
4. Maturity evaluation → reasoning model (GPT-4 Turbo or equivalent).
5. Report generation → specialist report-writing model.
6. Routine tasks (<1K tokens) → cost-optimized model (GPT-4o Mini or equivalent).
7. Routing is dynamic and does not require hardcoded model assignments.
8. Fallback models are configured per task type (App Description §16.6).

---

### FR-029: AI Invocation Logging

**Priority**: P0
**Source**: App Description §16.6

All AI invocations MUST be logged.

**Acceptance Criteria**:
1. Each AI invocation log includes: model used, prompt tokens, completion tokens, latency, cost estimate, timestamp, task type, audit ID, criterion ID (if applicable).
2. Logs are immutable (append-only).
3. Logs are queryable for monitoring and audit purposes.

---

### FR-030: AI Confidence Flagging

**Priority**: P0
**Source**: App Description §16.6

AI outputs with confidence below 70% MUST be flagged for human review.

**Acceptance Criteria**:
1. Outputs with confidence < 0.70 are automatically flagged.
2. Flagged items are visually indicated in the UI.
3. Flagged items appear in a dedicated review queue.

---

### FR-031: AI Rate Limiting and Circuit Breaker

**Priority**: P1
**Source**: App Description §16.6

The system MUST implement rate limiting and circuit breaker patterns for AI API calls.

**Acceptance Criteria**:
1. Exponential backoff is applied for AI API failures.
2. Circuit breaker activates if error rate exceeds 10% over a 5-minute window.
3. When circuit breaker is active, fallback model is used.
4. If fallback also fails, manual mode is offered to the user.

---

### FR-032: AI Model Versioning

**Priority**: P1
**Source**: App Description §15.4

All AI models used in an audit MUST be versioned and logged.

**Acceptance Criteria**:
1. Each audit records which AI model versions were used.
2. Model changes require regression testing against historical audits.
3. Fine-tuning is only permitted with governance approval and audit trail.

---

## 9. Pre-Report Structured Review Table

### FR-033: Structured Review Table Generation

**Priority**: P0
**Source**: App Description §9

Before report creation, the system MUST generate a structured review table.

**Acceptance Criteria**:
1. Table columns include:
   a. Domain / MPS / Criteria Number
   b. Description (Domain, MPS, or Criteria)
   c. Findings Summary
   d. Hyperlinks to Evidence
   e. Maturity Rating
   f. Immediate Recommendations (Next Level)
   g. Future Improvement Recommendations (Higher Level)
2. Table is interactive in the application.
3. Rows are expandable for detailed view.
4. Table content is editable before finalisation.
5. Table is exportable to Excel.

---

### FR-034: Review Table Editing

**Priority**: P0
**Source**: App Description §9

The system MUST allow editing of the structured review table before finalisation.

**Acceptance Criteria**:
1. Findings summaries can be edited.
2. Recommendations can be edited.
3. Edits are tracked in the audit trail.
4. Original AI-generated content is preserved alongside edits.

---

## 10. Reporting

### FR-035: Final Report Generation

**Priority**: P0
**Source**: App Description §10, §13.1

The system MUST generate a structured final audit report.

**Acceptance Criteria**:
1. Report includes:
   a. Executive summary
   b. Methodology section
   c. Domain → MPS → Criteria findings
   d. Maturity definitions per criterion (global and criterion-specific)
   e. Evidence embedded and referenced (snapshots, hyperlinks)
   f. Recommendations: short-term, medium-term, long-term
   g. Task list with: task, responsible person, due date
2. Report includes AI-generated maturity descriptors.
3. Report includes embedded snapshots from images/videos.
4. Report includes hyperlinked evidence references.
5. "Not Used" criteria are included with exclusion reasons.

**Edge Cases**:
- Audit with >500 criteria: report generation must complete in < 2 minutes.
- Missing evidence for some criteria: report flags these criteria.

---

### FR-036: Report Output Formats

**Priority**: P0
**Source**: App Description §13.2

The system MUST support the following report output formats:

- DOCX
- PDF
- Structured JSON export

**Acceptance Criteria**:
1. All three formats contain the same content.
2. DOCX and PDF include embedded images and formatted tables.
3. JSON export follows a defined schema for machine consumption.
4. Export function is available only after report is finalized.

---

### FR-037: Excel Export of Review Table

**Priority**: P0
**Source**: App Description §9

The structured review table MUST be exportable to Excel (.xlsx).

**Acceptance Criteria**:
1. Export produces a valid .xlsx file.
2. All columns from the review table are included.
3. Hyperlinks to evidence are preserved in the Excel file.
4. Export is available before and after report finalization.

---

### FR-038: Report Approval Gate

**Priority**: P0
**Source**: App Description §4.2 (Approval Authority)

Only the Lead Auditor can approve and publish the final report.

**Acceptance Criteria**:
1. Report generation requires Lead Auditor authorization.
2. Report publication requires explicit Lead Auditor approval.
3. Approval action is logged with timestamp and user.
4. Published reports are immutable (versioned if corrections needed).

---

## 11. Dashboard and Tracking

### FR-039: Global Audit Dashboard

**Priority**: P0
**Source**: App Description §11, §11.1

The system MUST provide a global audit dashboard with the following metrics:

**Acceptance Criteria**:
1. Dashboard displays:
   a. Total Domains
   b. Total MPS (overall)
   c. Total Criteria (overall)
   d. Total Evidence items
   e. Criteria status counts: Not Started, In Progress, Submitted, AI Scored, Confirmed, Overridden
   f. % Completed
   g. % Outstanding
   h. % Blocked (AI refused to score)
   i. % Awaiting Review
   j. AI override rate
   k. Evidence completeness distribution
2. Metrics are real-time accurate (max 5-second lag).
3. Dashboard refreshes in < 3 seconds.
4. Dashboard supports drill-down navigation.

---

### FR-040: Domain Dashboard

**Priority**: P0
**Source**: App Description §11.2

The system MUST provide a per-domain dashboard.

**Acceptance Criteria**:
1. Dashboard displays:
   a. MPS count within the domain
   b. Criteria count within the domain
   c. Completion %
   d. Outstanding %
   e. Flags: missing evidence, AI refusal
2. Drill-down to MPS level is available.

---

### FR-041: MPS Dashboard

**Priority**: P1
**Source**: App Description §11.3

The system MUST provide a per-MPS dashboard.

**Acceptance Criteria**:
1. Dashboard displays:
   a. Criteria completion %
   b. Rating distribution (maturity level counts)
   c. Aggregated next actions
2. Drill-down to individual criteria is available.

---

### FR-042: Maturity Distribution Overview

**Priority**: P0
**Source**: App Description §11 (MAT_Manual_Audit_Tool_Updated.md)

The dashboard MUST display a maturity distribution overview.

**Acceptance Criteria**:
1. Visual representation of maturity level distribution across all criteria.
2. Breakdown by Domain and MPS available.
3. Distribution updates in real-time as criteria are scored.

---

## 12. Roles, Permissions, and Access Control

### FR-043: Role-Based Access Control (RBAC)

**Priority**: P0
**Source**: App Description §4.1, §4.2

The system MUST enforce role-based access control with the following roles:

1. **Lead Auditor**: Full audit management and approval (create, edit, delete, approve, assign, export).
2. **Domain Auditor**: Domain-level findings and evidence management within assigned domains.
3. **MPS Auditor**: MPS-level findings and evidence management within assigned MPS.
4. **Evidence Contributor**: Evidence upload and annotation only within assigned criteria.

**Acceptance Criteria**:
1. Each role has precisely the permissions defined in the App Description §4.1.
2. Write access is restricted to assigned scope only.
3. Read access is audit-wide for all roles.
4. Permissions are enforced at the database level via Row-Level Security (RLS).

---

### FR-044: Permission Inheritance

**Priority**: P0
**Source**: App Description §4.2

If no user is assigned at a lower level, responsibility MUST remain at the last assigned higher level.

**Acceptance Criteria**:
1. Lead Auditor inherits responsibility for all unassigned domains.
2. Domain Auditor inherits responsibility for all unassigned MPS within their domain.
3. MPS Auditor inherits responsibility for all unassigned criteria within their MPS.
4. Inheritance is automatic and does not require manual assignment.

---

### FR-045: Assignment Flow

**Priority**: P0
**Source**: App Description §4.2

The system MUST support the following assignment flow:

**Acceptance Criteria**:
1. Lead Auditor MUST be assigned at audit creation (mandatory).
2. Domain Auditors MAY be assigned to specific domains (optional).
3. MPS Auditors MAY be assigned to specific MPS (optional).
4. Evidence Contributors MAY be assigned to specific criteria (optional).
5. Assignments can be changed by the Lead Auditor at any time before audit completion.
6. Assignment changes are logged in the audit trail.

---

### FR-046: Approval Authority Enforcement

**Priority**: P0
**Source**: App Description §4.2

Only the Lead Auditor can approve:
- Compiled criteria structure
- Final audit report
- Report publication

**Acceptance Criteria**:
1. Approval functions are accessible only to the Lead Auditor role.
2. Domain/MPS Auditors can mark their scope as "ready for review" but cannot approve.
3. Evidence Contributors cannot approve anything.
4. Approval actions are logged in the audit trail.

---

## 13. Offline and Field Mode

### FR-047: Offline Evidence Capture

**Priority**: P0
**Source**: App Description §12, §3.3.4

The system MUST support offline evidence capture on mobile devices.

**Acceptance Criteria**:
1. Voice notes, photos, and document uploads can be captured offline.
2. Captured evidence is stored locally on the device.
3. Local storage supports at least 1000 evidence items before sync is required.
4. Timestamps from capture time are preserved (not sync time).
5. App functions fully offline for 72+ hours.

---

### FR-048: Automatic Sync on Reconnect

**Priority**: P0
**Source**: App Description §12.1, §3.3.4

The system MUST automatically sync offline-captured evidence when connectivity is restored.

**Acceptance Criteria**:
1. Sync starts automatically on reconnect.
2. No duplicate items are created during sync.
3. Conflict resolution uses "last-writer-wins + audit trail" strategy.
4. 100% of offline data is recovered on reconnect.
5. Sync failures are logged and retryable.

**Edge Cases**:
- Simultaneous edits to the same criterion by two offline users: last-writer-wins with both versions preserved in audit trail.
- Connectivity drops during sync: partial sync is tracked; remaining items sync on next reconnect.

---

## 14. Security and Audit Integrity

### FR-049: Authentication

**Priority**: P0
**Source**: App Description §3.3.2, §14

The system MUST enforce authentication requirements.

**Acceptance Criteria**:
1. Multi-factor authentication (MFA) is mandatory for Lead Auditors.
2. Session timeout after 30 minutes of inactivity.
3. Password requirements: 12+ characters with complexity rules.

---

### FR-050: Row-Level Security

**Priority**: P0
**Source**: App Description §14, §3.3.2

The system MUST enforce Row-Level Security (RLS) at the database level.

**Acceptance Criteria**:
1. Organizational multi-tenancy is enforced via RLS policies.
2. Users can only access data within their assigned scope.
3. RLS is enforced by the database engine, not application logic.

---

### FR-051: Audit Trail

**Priority**: P0
**Source**: App Description §14, §3.3.3

The system MUST maintain a comprehensive, immutable audit trail.

**Acceptance Criteria**:
1. All actions are logged with: user, timestamp, action type, before/after state.
2. Logs are immutable (append-only).
3. Minimum log retention: 7 years.
4. Logs are exportable for legal/compliance review.
5. Logged actions include: uploads, AI scoring, confirmations, overrides, report generation, status changes, assignments.

---

### FR-052: Data Encryption

**Priority**: P0
**Source**: App Description §3.3.2

The system MUST encrypt all data.

**Acceptance Criteria**:
1. All data encrypted at rest (AES-256).
2. All data encrypted in transit (TLS 1.3+).
3. Evidence files encrypted with unique per-file keys.
4. Audit logs encrypted and tamper-evident.

---

### FR-053: Evidence Integrity Verification

**Priority**: P0
**Source**: App Description §3.3.3, §16.5

The system MUST verify evidence integrity.

**Acceptance Criteria**:
1. SHA-256 hash is computed for every evidence file on upload.
2. Hash is stored alongside the evidence record.
3. Integrity can be verified at any time by recomputing and comparing hashes.
4. Tamper detection alerts if hash mismatch is found.

---

## 15. Criterion Status Lifecycle

### FR-054: Criterion Status Transitions

**Priority**: P0
**Source**: App Description §3.2.2

The system MUST enforce the following criterion-level status transitions:

Not Started → In Progress → Submitted → AI Scored → Confirmed

**Acceptance Criteria**:
1. Status transitions follow the defined order.
2. Transitions are logged in the audit trail.
3. "Confirmed" status requires human confirmation (FR-025).
4. "AI Scored" status requires successful AI scoring (FR-023).

**Edge Cases**:
- Criterion marked as "Not Used": separate status track that bypasses scoring workflow.
- AI refuses to score: status remains at "Submitted" with "AI Blocked" flag.

---

## 16. Scalability and Future Extensions

### FR-055: Modular and Extensible Architecture

**Priority**: P1
**Source**: App Description §12, §15.4

The system MUST be architected for modular extensibility.

**Acceptance Criteria**:
1. New evidence types (e.g., IoT sensor data) can be added via plugin architecture.
2. New AI capabilities (e.g., anomaly detection) can be integrated with governance approval.
3. Custom criteria parsing rules are configurable (no hardcoding).
4. New maturity models beyond 5 levels can be configured.

---

### FR-056: Integration Hooks with PIT Module

**Priority**: P2
**Source**: App Description §12

The system MUST expose integration hooks for the PIT (Performance Improvement Tool) module.

**Acceptance Criteria**:
1. Audit findings can be exported in a format consumable by PIT.
2. Integration API is documented and versioned.
3. Data exchange respects organizational isolation (RLS).

---

### FR-057: Integration Hooks with Maturity Roadmap Module

**Priority**: P2
**Source**: App Description §12

The system MUST expose integration hooks for the Maturity Roadmap module.

**Acceptance Criteria**:
1. Maturity ratings and gap analysis can feed into roadmap planning.
2. Historical scan comparison logic is supported.
3. Integration API is documented and versioned.

---

### FR-058: Personal Profiling (Consent-Controlled)

**Priority**: P2
**Source**: App Description §12

The system MUST support personal profiling with explicit consent controls.

**Acceptance Criteria**:
1. Profiling features require explicit user consent.
2. Consent can be withdrawn at any time.
3. Consent status is logged in the audit trail.
4. Profiling data is subject to GDPR/POPIA requirements.

---

## 17. Watchdog and Continuous Improvement

### FR-059: Watchdog Monitoring Metrics

**Priority**: P1
**Source**: App Description §18.1

The system MUST track and display watchdog monitoring metrics.

**Acceptance Criteria**:
1. Real-time metrics tracked:
   a. AI refusal rate (% of criteria AI refuses to score)
   b. AI override rate (% of AI scores overridden by humans)
   c. Missing evidence trends
   d. Sync failures
   e. Suspicious access patterns
   f. Performance and latency
2. Alert thresholds are configurable.

---

### FR-060: Watchdog Alert Thresholds

**Priority**: P1
**Source**: App Description §18.1

The system MUST trigger alerts when watchdog thresholds are exceeded.

**Acceptance Criteria**:
1. AI refusal rate > 15%: alert triggered.
2. AI override rate > 25%: alert triggered.
3. Sync failure rate > 5%: alert triggered.
4. Unauthorized access attempts > 0: security incident alert triggered.
5. Response time > 95th percentile threshold: performance alert triggered.

---

### FR-061: Override Analysis and Feedback Loop

**Priority**: P1
**Source**: App Description §18.2

The system MUST support override analysis for continuous AI improvement.

**Acceptance Criteria**:
1. Override reasons are captured in structured format.
2. Overrides are categorized: evidence quality, AI misinterpretation, domain-specific nuance, other.
3. Anonymized override data can feed a model improvement pipeline.
4. Privacy safeguards prevent client data leakage in training data.

---

## 18. Responsive Design

### FR-062: Multi-Viewport Support

**Priority**: P0
**Source**: App Description §16.2, §3.3.5

The system MUST be fully functional across all supported viewports.

**Acceptance Criteria**:
1. Desktop (≥1024px): Full audit interface with side navigation, multi-column layout, full dashboard.
2. Tablet (768px–1023px): Collapsible navigation, single-column tables with horizontal scroll, optimized forms.
3. Mobile (<768px): Stacked layout, touch-optimized controls, simplified evidence upload UI, read-only report viewing.
4. Touch targets: minimum 44x44px for all interactive elements.

---

### FR-063: Progressive Web App (PWA) Support

**Priority**: P1
**Source**: App Description §3.3.5

The system MUST function as a Progressive Web App.

**Acceptance Criteria**:
1. Installable on mobile devices.
2. Offline-capable (linked to FR-047, FR-048).
3. Works on iOS 14+ and Android 10+.

---

## 19. Accessibility and Internationalization

### FR-064: Accessibility Compliance

**Priority**: P1
**Source**: App Description §3.3.5

The system MUST meet WCAG 2.1 Level AA accessibility standards.

**Acceptance Criteria**:
1. Screen reader support for all interactive elements.
2. Keyboard navigation for all functions.
3. High contrast mode support.
4. Automated and manual accessibility testing passes.

---

### FR-065: Internationalization Support

**Priority**: P1
**Source**: App Description §3.3.5

The system MUST support multiple languages.

**Acceptance Criteria**:
1. UI supports English and Afrikaans at launch.
2. Date/time formatting adapts per locale.
3. Number formatting adapts per locale.
4. Architecture supports right-to-left languages (future).

---

## 20. Data Privacy and Compliance

### FR-066: GDPR/POPIA Compliance

**Priority**: P0
**Source**: App Description §3.3.2

The system MUST handle personal data in compliance with GDPR and POPIA.

**Acceptance Criteria**:
1. Data retention policy is configurable and enforced.
2. Right to erasure is supported (with audit trail preservation).
3. Data export is available in structured format (JSON/CSV).
4. Privacy notices are displayed and consent recorded.

---

### FR-067: Regulatory Compliance Alignment

**Priority**: P1
**Source**: App Description §3.3.3

The system MUST align with relevant regulatory standards.

**Acceptance Criteria**:
1. ISO 27001 alignment for information security.
2. ISO 19011 alignment for audit management.
3. Industry-specific compliance is configurable per client.

---

## 21. Large-Scale Audit Support

### FR-068: Large Audit Compilation

**Priority**: P1
**Source**: App Description §3.3.1

The system MUST support audits with up to 2000+ criteria.

**Acceptance Criteria**:
1. Audit compilation of 1000+ criteria completes in < 5 minutes.
2. Report generation for 500-page reports completes in < 2 minutes.
3. System supports 10,000+ evidence items per audit.
4. Dashboard renders correctly for large audits.

---

### FR-069: Concurrent Auditor Support

**Priority**: P1
**Source**: App Description §3.3.1

The system MUST support 100+ concurrent auditors per deployment.

**Acceptance Criteria**:
1. No degradation of page load times (< 2 seconds) with 100 concurrent users.
2. Concurrent evidence uploads do not cause conflicts.
3. Dashboard metrics remain accurate under concurrent access.

---

## 22. Frontend Application Delivery

> **Governance Note (2026-02-16)**: This section was added to address a governance gap where all frontend functionality was specified as system requirements (FR-001–FR-069) but no requirement explicitly mandated the delivery of a packaged, deployable frontend application. This allowed all tests to pass at the service/logic level without a working React application ever being built. See BUILD_PROGRESS_TRACKER.md Deviation #9 for full RCA.

### FR-070: Frontend Application Scaffolding and Packaging

**Priority**: P0
**Source**: App Description §16.3 (Frontend Stack), §19.7 (Frontend Application Deliverable), TRS TR-001 (authoritative), TR-006

The system MUST include a scaffolded, buildable React 18+ frontend application located at `apps/mat-frontend/` within the monorepo workspace.

**Acceptance Criteria**:
1. A React 18+ application exists at `apps/mat-frontend/` using Vite 5+ per TRS TR-001.
2. The application is registered in `pnpm-workspace.yaml` as a workspace package.
3. `pnpm build` from the application root produces deployable static assets.
4. `pnpm dev` launches a local development server.
5. The application uses TypeScript 5.0+ with `strict: true` per TRS TR-001.
6. Shadcn/UI + Tailwind CSS 3+ used for all UI components per TRS TR-001.
7. Zustand for client state and TanStack Query for server state per TRS TR-001.
8. All functional components only — no class components per TRS TR-001.

**Edge Cases**:
- Build must succeed with zero warnings.
- Application must not depend on backend services to start (graceful degradation).

### FR-071: Frontend Application Wiring and Completeness

**Priority**: P0
**Source**: App Description §2–§12 (all user workflows), §16.2 (Responsive Design), §19.7 (Frontend Application Deliverable)

All UI components, pages, and user workflows specified in FR-001 through FR-069 that involve user interaction MUST be wired into the frontend application with functional routing and navigation.

**Acceptance Criteria**:
1. The frontend application contains routes/pages for: audit management, criteria management, evidence collection, AI scoring review, dashboards, and report generation.
2. All UI components from `modules/mat/src/components/` are imported and rendered in the application.
3. Navigation between all major sections is functional (sidebar or top navigation).
4. Responsive layout renders correctly at desktop (≥1024px), tablet (768–1023px), and mobile (<768px) per FR-062.
5. PWA manifest and service worker are registered per FR-063.
6. The application is deployable to Vercel and accessible at a production URL.

**Edge Cases**:
- Pages for features not yet connected to backend must render with appropriate placeholder states.
- Offline mode must show an offline indicator per FR-047.

---

### FR-072: Embedded AI Assistant (AIMC Advisory Integration)

**Priority**: P0
**Source**: App Description §13 (Embedded AI Assistant), Maturion Platform Standard LL-031, MANDATORY_CROSS_APP_COMPONENTS.md §13
**Constitutional Authority**: `AIMC_STRATEGY.md` v1.0.0
**AIMC Prerequisite**: **BLOCKED — Cannot be executed before AIMC Wave 3 (Advisory Gateway) is complete**

> **⚠️ AIMC BLOCKER**: This requirement CANNOT be implemented until the `@maturion/ai-centre` package
> exposes the Advisory Gateway (AIMC Wave 3). Any prior scaffold implementation that uses direct
> provider calls or placeholder wiring NOT connected to the AIMC Gateway is constitutionally
> non-compliant and must be refactored when AIMC Wave 3 delivers.
> Builders MUST NOT proceed with this requirement until POLC/CS2 confirms AIMC Wave 3 is complete.

The system MUST provide an embedded AI assistant panel accessible from every MAT frontend page,
consuming the AI advisory capability exclusively via the `@maturion/ai-centre` Gateway.

**Acceptance Criteria**:
1. A collapsible AI assistant panel is rendered in the application layout and accessible from every page.
2. The panel exposes persona selection sourced from the AIMC canonical agent directory: at minimum
   Maturity Advisor, Scoring Assistant, Document Parser, and Report Writer.
3. All AI invocations route through `@maturion/ai-centre` Gateway — no direct provider calls.
4. The panel captures the AIMC invocation reference ID returned by the Gateway for audit-domain logging per FR-029.
5. The panel is keyboard-navigable and WCAG 2.1 AA compliant per FR-065.
6. No AI provider API keys are present in the MAT frontend bundle or MAT backend configuration.

**Edge Cases**:
- AIMC Wave 3 not yet complete: panel renders a locked/disabled state with messaging that AI advisory
  capability is not yet available. Application MUST NOT crash.
- No persona selected: defaults to Maturity Advisor persona.

**Prerequisite Gate**: This requirement is gated on AIMC Wave 3 delivery. FR-072 acceptance criteria
cannot be signed off until AIMC Wave 3 is confirmed GREEN by POLC.

---



The following matrix links each FRS requirement to the source section(s) in the App Description.

| FRS ID | App Description Section(s) | Functional Area |
|--------|---------------------------|-----------------|
| FR-001 | §2 (Step 1), §5.1 | Audit Creation |
| FR-002 | §3.2.2 | Audit Status Lifecycle |
| FR-003 | §14 | Audit Archival |
| FR-004 | §2 (Step 2), §6.1 | Document Upload |
| FR-005 | §6.2, §15.1 | AI Criteria Parsing |
| FR-006 | §7.1 | No Hallucination |
| FR-007 | §7.2 | Coverage Rule |
| FR-008 | §6.2, §2 (Step 2) | Human Approval |
| FR-009 | §2.2 | Numbering Immutability |
| FR-010 | §3 | Hierarchical Navigation |
| FR-011 | §4, §8.1 | Criteria Modal |
| FR-012 | §4.2 | Not Used Exclusion |
| FR-013 | §4.3, §8.1 | Evidence Collection |
| FR-014 | §4.3, §8.1 | Voice Recording |
| FR-015 | §4.3, §8.1 | Photo Capture |
| FR-016 | §4.3 | Document Upload Evidence |
| FR-017 | §5, §16.7 | Video Processing |
| FR-018 | §3.3.1 | Concurrent Upload |
| FR-019 | §6 | Evidence Review |
| FR-020 | §9.1, §9.2 | Criterion Interview |
| FR-021 | §9.2 | Audit-Level Interview |
| FR-022 | §9.3 | Interview Governance |
| FR-023 | §7, §10.1, §15.2 | AI Scoring |
| FR-024 | §7.3, AC-AI02 | Evidence-First Rule |
| FR-025 | §10.2, AC-F04 | Human Confirmation |
| FR-026 | §7, §18.2 | Override Logging |
| FR-027 | §3, §3.1 | Maturity Model |
| FR-028 | §8, §15.4, §16.6 | AI Task Routing |
| FR-029 | §16.6 | AI Invocation Logging |
| FR-030 | §16.6 | AI Confidence Flagging |
| FR-031 | §16.6 | AI Rate Limiting |
| FR-032 | §15.4 | AI Model Versioning |
| FR-033 | §9 | Review Table |
| FR-034 | §9 | Review Table Editing |
| FR-035 | §10, §13.1 | Report Generation |
| FR-036 | §13.2 | Report Formats |
| FR-037 | §9 | Excel Export |
| FR-038 | §4.2 | Report Approval |
| FR-039 | §11, §11.1 | Global Dashboard |
| FR-040 | §11.2 | Domain Dashboard |
| FR-041 | §11.3 | MPS Dashboard |
| FR-042 | §11 | Maturity Distribution |
| FR-043 | §4.1, §4.2 | RBAC |
| FR-044 | §4.2 | Permission Inheritance |
| FR-045 | §4.2 | Assignment Flow |
| FR-046 | §4.2 | Approval Authority |
| FR-047 | §12, §3.3.4 | Offline Capture |
| FR-048 | §12.1, §3.3.4 | Auto Sync |
| FR-049 | §3.3.2, §14 | Authentication |
| FR-050 | §14, §3.3.2 | Row-Level Security |
| FR-051 | §14, §3.3.3 | Audit Trail |
| FR-052 | §3.3.2 | Data Encryption |
| FR-053 | §3.3.3, §16.5 | Evidence Integrity |
| FR-054 | §3.2.2 | Criterion Status |
| FR-055 | §12, §15.4 | Extensibility |
| FR-056 | §12 | PIT Integration |
| FR-057 | §12 | Maturity Roadmap Integration |
| FR-058 | §12 | Personal Profiling |
| FR-059 | §18.1 | Watchdog Metrics |
| FR-060 | §18.1 | Watchdog Alerts |
| FR-061 | §18.2 | Override Analysis |
| FR-062 | §16.2, §3.3.5 | Responsive Design |
| FR-063 | §3.3.5 | PWA Support |
| FR-064 | §3.3.5 | Accessibility |
| FR-065 | §3.3.5 | Internationalization |
| FR-066 | §3.3.2 | GDPR/POPIA |
| FR-067 | §3.3.3 | Regulatory Compliance |
| FR-068 | §3.3.1 | Large Audits |
| FR-069 | §3.3.1 | Concurrent Users |
| FR-070 | §16.3, §19.7, TRS TR-001, TR-006 | Frontend Application Scaffolding |
| FR-071 | §2–§12, §16.2, §19.7 | Frontend Application Wiring |
| FR-072 | §13, LL-031, MANDATORY_CROSS_APP_COMPONENTS.md §13, AIMC_STRATEGY.md v1.0.0 | Embedded AI Assistant (AIMC Advisory Integration — BLOCKED on AIMC Wave 3) |

---

## Priority Summary

| Priority | Count | Description |
|----------|-------|-------------|
| P0 | 46 | Must Have — Core MVP functionality |
| P1 | 18 | Should Have — Important for launch |
| P2 | 7 | Nice to Have — Future extensions |

### P0 Requirements (Must Have)
FR-001 through FR-017, FR-019, FR-020, FR-022 through FR-025, FR-027, FR-028 through FR-030, FR-033 through FR-040, FR-042 through FR-054, FR-062, FR-066, FR-070, FR-071, FR-072

### P1 Requirements (Should Have)
FR-003, FR-018, FR-021, FR-026, FR-031, FR-032, FR-041, FR-055, FR-059 through FR-061, FR-063 through FR-065, FR-067 through FR-069

### P2 Requirements (Nice to Have)
FR-056, FR-057, FR-058

---

## Glossary

| Term | Definition |
|------|-----------|
| **MAT** | Manual Audit Tool |
| **MPS** | Mini Performance Standard — Level 2 in the audit hierarchy |
| **Domain** | Level 1 grouping in the audit hierarchy |
| **Criterion** | Level 3 individual audit item |
| **Lead Auditor** | Primary authority for an audit; has full management and approval rights |
| **RLS** | Row-Level Security — Database-enforced access control |
| **RBAC** | Role-Based Access Control |
| **PWA** | Progressive Web App |
| **FRS** | Functional Requirements Specification |
| **TRS** | Technical Requirements Specification |
| **MFA** | Multi-Factor Authentication |

---

## Document Authority

This FRS is derived from the MAT App Description v1.2 (`modules/mat/00-app-description/app-description.md`) and the MAT Manual Audit Tool Updated specification (`modules/mat/00-app-description/MAT_Manual_Audit_Tool_Updated.md`).

**Governance Reference**: `governance/strategy/MODULE_LIFECYCLE_AND_REPO_STRUCTURE_STRATEGY.md`

**Next Stage**: This FRS feeds into the TRS (Technical Requirements Specification) at `modules/mat/01.5-trs/`.

**Change Log**:
- v1.3.0 (2026-02-23): Realigned FR-072 to AIMC Gateway pattern per `AIMC_STRATEGY.md` v1.0.0.
  FR-072 now blocked on AIMC Wave 3. Direct provider references removed. Issue #377 superseded.
- v1.2.0 (2026-02-20): Added FR-072 (Embedded AI Assistant) per platform governance blocker LL-031. See BUILD_PROGRESS_TRACKER.md INC-002.
- v1.1.0 (2026-02-16): Added FR-070, FR-071 (Frontend Application Delivery) per governance remediation. See BUILD_PROGRESS_TRACKER.md Deviation #9.
- v1.0.0 (2026-02-13): Initial FRS with 69 requirements (FR-001–FR-069).

---

*END OF FUNCTIONAL REQUIREMENTS SPECIFICATION*
