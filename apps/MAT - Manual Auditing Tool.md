# MAT — Manual Audit Tool  
## App Description for Foreman → FRS & Architecture Generation

---

## 0. Document Purpose

This document defines the **Manual Audit Tool (MAT)** module within the Maturion ISMS platform.  
It is intended to be consumed by the **Foreman agent** to generate:

- Functional Requirement Specification (FRS)
- Architecture design
- Data models
- AI task routing and contracts
- QA plans and acceptance criteria
- Watchdog and continuous improvement hooks

This is a **single source of truth**.  
Nothing is hardcoded.  
All AI autonomy operates **within governance sandboxes**.

---

## 1. Module Identity

**Module Name:** MAT (Manual Audit Tool)  
**Platform:** Maturion ISMS  
**Module Type:** Core execution module (field + remote audits)

### Primary Objective
Enable structured, defensible, evidence-driven **manual audits** using arbitrary criteria documents, with:

- AI-assisted structuring (Domain → MPS → Criteria)
- Mobile-first evidence collection (voice, photo, files, interviews)
- AI-assisted maturity scoring (Basic → Resilient)
- Human confirmation and override
- Automated, branded report generation
- Full audit trail and governance compliance

---

## 2. Core Structural Model

### 2.1 Three-Level Audit Hierarchy

All audits MUST be structured as:

1. **Domain** (Level 1)  
2. **MPS — Mini Performance Standard** (Level 2)  
3. **Criteria** (Level 3)

This structure is mandatory regardless of source document format.

### 2.2 Numbering Rules (Immutable After Approval)

- Domains: `1`, `2`, `3`, …
- MPS: `1.1`, `1.2`, …
- Criteria: `1.1.1`, `1.1.2`, …

Changes after approval are **append-only events** and must be logged.

---

## 3. Maturity Model (Mandatory)

Each criterion is evaluated using a **5-level maturity scale**:

1. **Basic**
2. **Reactive**
3. **Compliant**
4. **Proactive**
5. **Resilient**

### 3.1 Maturity Definitions

MAT must support:
- **Global maturity DNA definitions**
- **Criterion-specific maturity definitions**

Both must appear in the final report.

---

## 4. Roles, Permissions, and Inheritance

### 4.1 Roles

- **Lead Auditor**
- **Domain Auditor**
- **MPS Auditor**
- **Evidence Contributor**

### 4.2 Assignment and Inheritance Rules

- Permissions are **scope-based** (Domain / MPS / Criteria)
- Write access only within assigned scope
- Read access across entire audit (unless future confidential mode)

**Inheritance Rule (Non-Negotiable):**
If no user is assigned at a lower level, responsibility remains at the last assigned higher level.

---

## 5. End-to-End User Workflows

### 5.1 Audit Creation

Lead Auditor:
- Creates audit assignment (title, client, site(s), dates)
- Uploads criteria document(s) (any format)
- Optionally uploads source/control documents
- Triggers **Compile Criteria**

---

## 6. Criteria Compilation (AI + Governance)

### 6.1 Input Flexibility (No Hardcoding)

Criteria documents may be:
- Word
- PDF
- Excel
- Mixed or unstructured
- Any language or layout

No assumptions may be made about formatting.

### 6.2 Parsing Pipeline (Conceptual)

1. **Ingest**
   - Convert documents into an intermediate representation:
     - text blocks
     - tables
     - headings
     - coordinates / page references
     - source anchors

2. **AI Structure Extraction**
   - AI proposes Domain → MPS → Criteria hierarchy

3. **Deterministic Validation**
   - Schema validation
   - Coverage validation
   - No-hallucination validation
   - Numbering validation

4. **Human Review Gate**
   - Lead Auditor must approve before audit execution

---

## 7. Parsing Guardrails (Mandatory)

### 7.1 No Hallucination Rule
AI may **never invent criteria**.

If uncertain:
- Flag `needs_human_review = true`
- Include raw excerpt
- Explain ambiguity

### 7.2 Coverage Rule
Every source content block must be:
- Mapped to Domain/MPS/Criteria  
**OR**
- Explicitly marked as non-criteria context

### 7.3 Evidence-First Rule
AI must refuse to score if evidence is insufficient.

---

## 8. Audit Execution (Mobile + Desktop)

### 8.1 Criterion Modal (Core Interaction)

Each criterion provides:

Tabs:
1. **Findings** (typed notes)
2. **Voice** (recorded observations)
3. **Evidence**
   - camera capture
   - file uploads (any type)
   - evidence links
4. **Conversation / Interview**

---

## 9. Conversation / Interview Mode

### 9.1 Purpose
Enable evidence capture via:
- Meetings
- Walkthrough discussions
- Remote interviews

### 9.2 Modes

**Criterion-Level Interview**
- Started from criterion modal
- Audio recorded
- Transcript generated
- Findings extracted for that criterion

**Audit-Level Interview**
- Started from audit conversation screen
- Covers multiple topics
- Transcript segments can be tagged to:
  - Domain
  - MPS
  - Criteria

### 9.3 Governance Rules
- Transcript segments must be time-stamped
- AI must cite transcript excerpts
- Testimonial evidence is weighted lower than documentary evidence

---

## 10. AI Scoring and Human Control

### 10.1 AI Responsibilities
For each criterion:
- Propose maturity level
- Provide confidence score
- Provide rationale citing evidence
- Provide gaps to next maturity level:
  - immediate
  - medium-term
  - long-term

### 10.2 Human Confirmation
- Human must confirm or override AI result
- Override requires justification
- Both AI output and human decision are stored

---

## 11. Dashboards and Tracking (Mandatory)

### 11.1 Global Audit Dashboard

Metrics:
- Total Domains
- Total MPS (overall)
- Total Criteria (overall)
- Total Evidence items
- Criteria status counts:
  - Not Started
  - In Progress
  - Submitted
  - AI Scored
  - Confirmed
  - Overridden
- % Completed
- % Outstanding
- % Blocked (AI refused)
- % Awaiting Review
- AI override rate
- Evidence completeness distribution

### 11.2 Domain Dashboard
- MPS count
- Criteria count
- Completion %
- Outstanding %
- Flags (missing evidence, AI refusal)

### 11.3 MPS Dashboard
- Criteria completion %
- Rating distribution
- Aggregated next actions

---

## 12. Offline / Field Mode

### 12.1 Offline Capture Queue
- Voice notes, photos, uploads stored locally
- Sync on reconnect
- Preserve timestamps
- Prevent duplicates

---

## 13. Reporting

### 13.1 Report Structure
- Executive summary
- Methodology
- Domain → MPS → Criteria findings
- Maturity definitions per criterion
- Evidence embedded and referenced
- Recommendations:
  - short-term
  - medium-term
  - long-term
- Task list:
  - task
  - responsible person
  - due date

### 13.2 Outputs
- DOCX
- PDF
- Structured JSON export

---

## 14. Security and Audit Integrity

- Row Level Security (RLS) by scope
- Append-only records after submission
- Full audit logs for:
  - uploads
  - AI scoring
  - confirmations / overrides
  - report generation

---

## 15. AI Output Schemas (Contract-First)

### 15.1 Criteria Structure Schema

```json
{
  "domains": [
    {
      "number": "1",
      "title": "Domain Title",
      "description": "Optional",
      "mps": [
        {
          "number": "1.1",
          "title": "MPS Title",
          "criteria": [
            {
              "number": "1.1.1",
              "statement": "Criterion statement text",
              "source_anchor": "reference to source block"
            }
          ]
        }
      ]
    }
  ],
  "warnings": [],
  "needs_human_review": false
}
15.2 AI Scoring Schema
{
  "criterion_id": "uuid",
  "proposed_level": "COMPLIANT",
  "confidence": 0.82,
  "rationale": [
    "Evidence E-123 shows...",
    "Transcript segment T-45 confirms..."
  ],
  "gaps_to_next_level": {
    "immediate": [],
    "medium": [],
    "long": []
  },
  "refuse_to_score": false,
  "missing_evidence_needed": []
}
15.3 Conversation Extraction Schema
{
  "conversation_id": "uuid",
  "linked_criteria": [
    {
      "criteria_id": "uuid",
      "findings": "Extracted finding text",
      "transcript_refs": ["T-12", "T-13"],
      "confidence": 0.7
    }
  ]
}
16. QA and Acceptance Criteria
Minimum acceptance:

Arbitrary criteria documents compile without hardcoding

No content loss during structuring

Evidence-first scoring enforced

AI outputs schema-validated

Human confirmation mandatory

Dashboards accurate and real-time

Offline capture syncs safely

Reports generated correctly

RLS prevents unauthorized edits

Full audit trail exists

17. Watchdog and Continuous Improvement
Watchdog monitors:

AI refusal rate

AI override rate

Missing evidence trends

Sync failures

Suspicious access patterns

Performance and latency

Feedback loop:

Override reasons feed controlled model improvement pipeline

18. Foreman Deliverable Expectation
Foreman must generate:

FRS (numbered requirements)

Architecture diagrams

DB schema

AI task routing specs

QA test plans

Watchdog alert definitions

End of Document
