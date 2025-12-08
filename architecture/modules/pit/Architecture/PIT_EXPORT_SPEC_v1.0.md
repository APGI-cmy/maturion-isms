Below is the complete PIT_EXPORT_SPEC_v1.0.md, aligned with:

PIT_TRUE_NORTH_v1.0.md

PIT_DATABASE_SCHEMA_v1.1.md

PIT_EDGE_FUNCTIONS_v1.1.md

PIT_FRONTEND_COMPONENT_MAP_v1.1.md

PIT_WIREFRAMES_v1.1.md

PIT_QA_IMPLEMENTATION_PLAN_v1.1.md

Maturion True North & One-Time Build Philosophy

This is the official export specification for PIT.
All PDF/CSV/Excel/JSON exports must follow this standard with zero deviations.

Place in:

/Modules/PIT/Architecture/PIT_EXPORT_SPEC_v1.0.md

PIT_EXPORT_SPEC_v1.0.md

Project Implementation Tracker — Export Specification
Version 1.0
Owner: Maturion ISMS
Applies to all PIT projects, tasks, clusters, Gantt timelines, and integrations.

0. PURPOSE

This document defines the exact structure, formatting, layout, metadata, and content rules for all PIT exports including:

PDF reports

Excel spreadsheets

CSV extracts

JSON API exports

Timeline (Gantt) exports

Risk mitigation feedback exports

Evidence ZIP bundles

AI-generated summary reports

These ensure:

Consistency

Interoperability

Auditability

Downstream processing accuracy

Long-term stability

Zero regression across releases

No export can be developed without complying with this specification.

1. EXPORT TYPES (MASTER OVERVIEW)

PIT supports 11 export formats:

1. Project Summary PDF
2. Task List (CSV)
3. Task List (Excel)
4. Timeline/Gantt PDF
5. Timeline/Gantt JSON
6. Risk-Mitigation Feedback Report (PDF)
7. Control Implementation Pack (Excel + PDF)
8. Evidence Bundle (ZIP)
9. AI Weekly Summary (PDF or HTML)
10. Integration Exports to other modules (JSON)
11. Full Project Archive Export (ZIP)


Each type is detailed below.

2. PROJECT SUMMARY PDF
Purpose

A top-level project report summarizing:

Progress

Tasks

Risk mitigation

Costing

Watchdog alerts

Key dates

AI analysis

Format

A4, portrait

Maximum 15 pages

Auto paginate

Colour-coded status indicators

Maturion ISMS branding applied

Sections
2.1 Cover Page
Project Name  
Project Code  
Owner  
Sponsor  
Organisation  
Version  
Export date (ISO 8601)  
QR code linking to PIT project  

2.2 Executive Summary

Contains:

AI-generated summary (max 250 words)

Overall progress

Risk mitigation %

CAPEX/OPEX summary

Overdue tasks

Critical tasks

Watchdog status

2.3 Progress Summary

Progress rings for project / phases / work packages

Trend chart showing last 30 days (if available)

Forecast completion date (AI & PIT engine blended)

2.4 Risk Mitigation Summary

From the Risk Mitigation Engine:

Total linked risks
Mitigation achieved
Mitigation remaining
High-risk items requiring attention

2.5 Task Summary

Table:

| Task | Status | Owner | Start | End | % | Priority | Linked Risks | Evidence? |

Tables must be:

Paginated

Colour-coded

Controlled width

2.6 Timeline Snapshot (Static Image)

From Gantt export.

2.7 Watchdog Summary

Includes:

Red alerts

Yellow alerts

AI suggestions

Escalation records

2.8 Appendices

Dependency list

Risk mappings

Control links

3. TASK LIST (CSV EXPORT)
Filename format

pit_tasks_<project_code>_<YYYY-MM-DD>.csv

Encoding

UTF-8, RFC-4180 compliant.

Columns
task_id
project_id
phase_name
work_package_name
task_name
description
owner
assignees
priority
status
progress_pct
requires_evidence
start_date
end_date
duration_days
capex_cost
opex_cost
linked_risk_ids (comma-separated)
linked_control_set_id
source_module
updated_at
created_at

Rules

No merged cells

No styling

Dates ISO 8601

Assignees as comma-separated user IDs

4. TASK LIST (EXCEL EXPORT)
Filename format

pit_tasks_<project_code>_<YYYY-MM-DD>.xlsx

Workbook structure:
Sheet 1: Tasks (main dataset)
Sheet 2: Risks (linked)
Sheet 3: Controls (linked)
Sheet 4: Summary Dashboard (optional charts)
Sheet 5: Metadata

4.1 Sheet 1: Tasks

Same columns as CSV, plus formatting:

Header bar: dark blue

Status: coloured

Priority: icon + color

Dates: ISO-formatted but with Excel date type

Progress: % format

4.2 Sheet 2: Risks

Columns:

risk_id
risk_title
inherent_rating
residual_rating
projected_rating
mitigation_pct

4.3 Sheet 3: Controls

Columns:

control_set_id
control_name
control_group
type (preventive/detective)
effectiveness_expected
effectiveness_current (if RA integrated)

4.4 Sheet 4: Summary Dashboard

Charts generated:

Progress ring

Risk mitigation bar

Cost breakdown

Task priority distribution

4.5 Sheet 5: Metadata

Includes:

Export timestamp

PIT version

User

Organisation

Checksum

5. TIMELINE / GANTT PDF EXPORT
Format

A3 landscape

Scrollable multi-page if long

Critical path in red

Task bars in blue

Milestones in yellow

Content

Full Gantt chart

Summary panel

Legend

6. TIMELINE / GANTT JSON EXPORT
Used for:

Integration with external PM tools

Embedding in APIs

Downstream ingestion

Structure
{
  "project": {...},
  "timeline": [
     {
        "task_id": "...",
        "name": "...",
        "start": "ISO8601",
        "end": "ISO8601",
        "status": "...",
        "dependencies": [
            {"type": "FS", "task_id": "...", "lag": 0}
        ],
        "phase": "...",
        "work_package": "..."
     }
  ]
}

7. RISK MITIGATION FEEDBACK REPORT (PDF)
Purpose

To send back into:

WRAC

Risk Assessment

Bowtie

Controls

Sections:

Risk Summary Table

Mitigation Achieved vs Planned

Control Implementation %

Critical Barriers (Bowtie)

AI Commentary on Risk Trajectory

8. CONTROL IMPLEMENTATION PACK
Delivered as ZIP containing:

control_implementation.xlsx

project_summary.pdf

Evidence folder (if selected)

8.1 Excel

Columns:

control_id
control_name
control_group
related_risks
expected_effectiveness
current_effectiveness
PIT_tasks
evidence_count
owner
status

9. EVIDENCE BUNDLE (ZIP)

Folder structure:

/evidence
    /task_<task_id>/
         evidence_timestamp_filename.ext
/metadata.json

metadata.json includes:
{
  "project_code": "...",
  "generated_at": "ISO8601",
  "evidence_count": N,
  "hash": "sha256"
}

10. AI WEEKLY SUMMARY EXPORT (PDF/HTML)
Sections:

Executive analysis

Bottlenecks

Watchdog AI flags

Forecasted delays

Recommendations

Risk movement

HTML must be:

Responsive

Printable

Dark/light mode

11. INTEGRATION EXPORTS (JSON)
11.1 To Risk Module
{
  "project_id": "...",
  "risk_updates": [
     {
       "risk_id": "...",
       "mitigation_pct": 34,
       "evidence_status": "complete",
       "projected_residual": "Medium"
     }
  ]
}

11.2 To Controls Module
{
  "control_set_id": "...",
  "implementation_pct": 45,
  "tasks": [...],
  "evidence": [...]
}

11.3 To Audit
{
  "ncr_id": "...",
  "close_ready": true,
  "tasks": [...]
}

11.4 To Incident Module
{
  "incident_id": "...",
  "status": "resolved",
  "task_updates": [...]
}

12. FULL PROJECT ARCHIVE EXPORT (ZIP)
Includes:

All PDFs

All Excels

All JSON

All evidence

Audit log

Timeline snapshots

Watchdog history

AI decisions log (optional toggle)

Manifest.json

Manifest.json:
{
  "project": "...",
  "exported_at": "...",
  "version": "1.0",
  "export_components": [...],
  "hashes": {...}
}

13. ERROR HANDLING SPECIFICATION

If export fails, return:

EXPORT_ERROR_001 – invalid project
EXPORT_ERROR_002 – data integrity issue
EXPORT_ERROR_003 – missing linked items
EXPORT_ERROR_004 – rendering failure
EXPORT_ERROR_005 – unauthorized

14. VERSIONING

Each export contains:

Export version

PIT version

Schema version

Rendering engine version

AI engine version (if applicable)

✔ END OF PIT_EXPORT_SPEC_v1.0.md