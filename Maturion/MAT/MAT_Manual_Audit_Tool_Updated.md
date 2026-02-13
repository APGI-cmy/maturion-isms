# MAT -- Manual Auditing Tool (Updated Comprehensive Specification)

## 1. Overview

The Manual Auditing Tool (MAT) is an AI-assisted structured audit
execution platform forming part of the ISMS ecosystem.

MAT enables:

-   Creation of new audits
-   Upload and AI restructuring of audit criteria documents
-   Hierarchical execution (Domain → MPS → Criteria)
-   Multi-format evidence collection (text, audio, image, document,
    video)
-   AI maturity evaluation
-   Human review and override
-   Structured pre-report validation table
-   Final report generation
-   Excel export capability
-   Intelligent AI model and capability routing

All functionality operates within governance-controlled, internationally
aligned best-practice architecture.

------------------------------------------------------------------------

## 2. Audit Lifecycle Workflow

### Step 1 -- Create New Audit

User clicks: **Create New Audit**

Required inputs:

-   Audit Title
-   Organisation Name
-   Facility / Location
-   Audit Lead
-   Audit Period

------------------------------------------------------------------------

### Step 2 -- Upload Audit Criteria

User uploads audit criteria document.

Supported formats:

-   .doc / .docx
-   .pdf
-   .xls / .xlsx
-   .ppt / .pptx
-   Text formats
-   Extensible future formats

No parsing logic is hardcoded.

AI will:

-   Parse the full document
-   Preserve scope and intent
-   Restructure into:

Level 1: Domains\
Level 2: Mini Performance Standards (MPS)\
Level 3: Criteria

Sequential numbering applied:

-   1
-   1.1
-   1.1.1

User must approve structure before execution begins.

------------------------------------------------------------------------

## 3. Execution Structure

Navigation:

Domain → MPS → Criteria

Clicking a Criteria opens a modal.

------------------------------------------------------------------------

## 4. Criteria Modal Structure

### 4.1 Criteria Description

Displays full criteria statement.

------------------------------------------------------------------------

### 4.2 "Not Used" Functionality

Checkbox:

☐ This criteria will not be used during this audit.

If selected:

Modal appears requiring:

-   Mandatory reason for exclusion
-   Justification explanation
-   Submit confirmation

Logged in audit trail and included in report.

------------------------------------------------------------------------

### 4.3 Evidence Collection

User may submit:

-   Typed findings
-   Voice recordings
-   Document uploads
-   Photographs
-   Video uploads

------------------------------------------------------------------------

## 5. Video Capability

Supported formats:

-   .mp4
-   .mov
-   .avi

AI must:

-   Extract audio
-   Generate transcript
-   Identify relevant segments
-   Extract still-frame snapshots
-   Allow snapshot selection
-   Use transcript + snapshots in report

------------------------------------------------------------------------

## 6. Evidence Review Stage (Before Report Generation)

Before final report generation:

User must review all uploaded evidence.

Capabilities:

-   Edit transcripts
-   Replace photographs
-   Replace documents
-   Replace video files
-   Re-run AI evaluation if evidence updated

No report generation until user approval of reviewed evidence.

------------------------------------------------------------------------

## 7. AI Evaluation Workflow

For each criteria:

AI evaluates:

-   Findings
-   Evidence
-   Transcript
-   Images
-   Video snapshots

AI assigns maturity level:

1.  Basic\
2.  Reactive\
3.  Compliant\
4.  Proactive\
5.  Resilient

User reviews AI summary and approves or overrides.

Overrides are logged for AI learning improvement.

------------------------------------------------------------------------

## 8. AI Model & Capability Management

System must automatically route tasks to correct AI capabilities.

Examples:

-   Document parsing → structured reasoning model
-   Video transcript extraction → multimodal model
-   Image interpretation → vision model
-   Report generation → specialist report-writing agent

If custom tailored agents are required, system supports integration.

If OpenAI platform capabilities exist, they must be invoked
automatically.

AI capability routing must be dynamic and scalable.

------------------------------------------------------------------------

## 9. Pre-Report Structured Review Table

Before report creation, structured review table is generated.

Columns:

1.  Domain / MPS / Criteria Number\
2.  Description (Domain, MPS or Criteria)\
3.  Findings Summary\
4.  Hyperlinks to Evidence\
5.  Maturity Rating\
6.  Immediate Recommendations (Next Level)\
7.  Future Improvement Recommendations (Higher Level)

Table must:

-   Be interactive in app
-   Expandable per row
-   Allow editing before finalisation
-   Be exportable to Excel

This table forms basis of final report writing.

------------------------------------------------------------------------

## 10. Reporting

Report structured:

-   Domains
-   MPS
-   Criteria
-   Ratings
-   Evidence references
-   Immediate actions
-   Medium-term actions
-   Long-term resilience recommendations

Report must embed:

-   Snapshots from images/videos
-   Hyperlinked evidence
-   AI-generated maturity descriptors

------------------------------------------------------------------------

## 11. Dashboard Requirements

Summary dashboard must display:

-   Total Domains
-   Total MPS per Domain and overall
-   Total Criteria per MPS and overall
-   \% Completed
-   \% Outstanding
-   \% Not Used
-   Maturity Distribution Overview

Drill-down capability required.

------------------------------------------------------------------------

## 12. Scalability & Future Extensions

Future enhancements:

-   Personal profiling (with consent controls)
-   Historical scan comparison logic
-   Continuous AI learning
-   Integration with Maturity Roadmap
-   PIT integration
-   Advanced marketing triggers

Architecture must remain modular and extensible.

------------------------------------------------------------------------

## End of Document
