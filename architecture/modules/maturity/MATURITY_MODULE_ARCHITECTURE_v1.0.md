# 📘 MATURITY MODULE ARCHITECTURE v1.0

**Version:** 1.0  
**Status:** Approved by Foreman  
**Scope:** Defines the full architecture, flows, data models, AI usage, QA expectations, integration points, and UX patterns for the Maturity Module.  
**Module Type:** Core ISMS Module  
**Last Updated:** 2025-12-08

---

## 0. Purpose

The Maturity Module operationalizes the Maturion Maturity Model across five domains:

1. **Leadership & Governance (Roof)**
2. **Process Integrity**
3. **People & Culture**
4. **Protection**
5. **Proof It Works (Foundation)**

It enables:

- Free baseline maturity assessment
- Full enterprise maturity implementation
- MPS & Criteria generation
- Evidence lifecycle
- Approval workflows
- Stakeholder collaboration
- PIT integration
- External auditor validation
- AI-assisted improvement pathways

The module MUST obey all elements of:

- ISMS Architecture v1.1
- Module Integration Map v1.0
- True North Architecture v1.2
- Build Philosophy v1.1

**This is the SINGLE SOURCE OF TRUTH for this module.**

---

## 1. Functional Specification

### 1.1 Key Features

#### 1. Free Assessment

- Public access (pre-subscription)
- Basic organization profiling
- One-page maturity snapshot
- Stored only after subscription

#### 2. Domain Overview

- Visual house model
- Domain cards with color-coded status
- Domain progress summary
- AI context-aware guidance panel

#### 3. MPS (Maturity Performance Standards)

- Domain → MPS hierarchy
- AI-generated MPS templates
- Editable by Implementers
- Tagged by roles

#### 4. Criteria

- Nested under each MPS
- 1–5 maturity level scaling
- AI-assisted writing
- Structural rules enforced by QA

#### 5. Evidence Management

- Evidence upload
- Evidence tagging
- AI evaluation of evidence
- Evidence scoring per criterion
- Evidence approval flows

#### 6. Stakeholder Engagement

- Assign Implementers (Domain, MPS, Evidence)
- Comment threads
- Audit notes
- Review cycles

#### 7. Approval Workflow

- Criteria approval
- MPS approval
- Domain approval
- Final maturity approval (frozen at cycle end)

#### 8. Reporting

- Domain-level dashboards
- Maturity radar chart
- Year-on-year comparisons
- Export PDF

#### 9. Integration

- **PIT:** Auto-generate improvement tasks
- **Risk:** Maturity-risk correlation
- **Analytics:** Heatmaps & dashboards
- **Skills:** Training recommendations
- **Systems:** Data extraction pipeline

---

## 2. User Journeys

### 2.1 Free Assessment

1. User clicks "Free Assessment" on marketing site
2. Completes short domain questionnaire
3. AI generates summary
4. CTA to subscribe

### 2.2 Full Maturity Journey

1. Organization signs up
2. Completes "Get to know you"
3. Lands on Maturity Overview
4. Selects domain
5. Reviews MPS
6. Reviews/edits criteria
7. Uploads evidence
8. Domain approval workflow
9. PIT integration triggers improvement projects
10. Final assessment freeze

---

## 3. Data Model

### 3.1 Database Entities (Supabase)

- `organizations`
- `users`
- `roles`
- `domains`
- `mps`
- `criteria`
- `criteria_levels`
- `evidence`
- `evidence_comments`
- `evidence_ai_scores`
- `approvals`
- `maturity_cycles`
- `baseline_assessments`

### 3.2 Domain Model

```
Domain
  └── MPS (1..*)
        └── Criteria (1..*)
              └── Levels (1..5)
              └── Evidence (0..*)
```

### 3.3 Approval Flow

```
Implementer → Supervisor → Approver → External Auditor
```

Roles enforced by RLS → defined in ISMS role model.

---

## 4. UI Architecture

### 4.1 Route Structure (inside ISMS portal)

```
/maturity
  /domains
    /:domainId
      /mps/:mpsId
        /criteria/:criteriaId
        /evidence/:evidenceId
      /approval
  /free-assessment
  /reports
  /settings
```

### 4.2 UI Patterns (True North)

- Left ISMS sidebar
- Top global header
- Right-hand AI side panel
- Card-grid interfaces
- Expandable drilldown
- Standardized breadcrumb
- shadcn/ui components

### 4.3 Required Screens

- Maturity Overview
- Domain Overview
- MPS Manager
- Criteria Editor
- Evidence Manager
- Approval Console
- Reports
- Settings

---

## 5. AI Usage

**All AI interactions MUST run through maturion-ai routing.**

### 5.1 AI Functions

- Generate MPS
- Rewrite criteria
- Evaluate evidence
- Provide improvement pathways
- Summarize domain progress
- Explain rationale for maturity scores

### 5.2 AI Constraints (True North)

- No hallucinations
- No cross-domain contamination
- Abort if context insufficient
- Evidence-first logic
- Strict adherence to structure
- No fallback to Annex 1

---

## 6. Integrations

### 6.1 PIT

- Criteria without evidence → auto-generate PIT remediation tasks
- Domain approvals → update PIT milestones
- PIT dashboards link back to Maturity

### 6.2 Risk

- Domain weaknesses inform risk scoring
- Maturity low values flag risk hotspots

### 6.3 Analytics

- Provide maturity heatmaps
- KPI aggregation
- Export endpoints

### 6.4 Skills

- Criteria gaps → generate training paths
- Role-specific course suggestions

---

## 7. QA Requirements

**QA derives STRICTLY from architecture.**

### 7.1 Architecture Tests

- All routes exist
- All components mounted
- Domain → MPS → Criteria chain intact

### 7.2 UI Tests

- Sidebar navigation
- Drilldown functioning
- State persistence

### 7.3 Data Model Tests

- Create/update/delete domain items
- RLS enforcement
- Approval workflow correctness

### 7.4 AI Tests

- Criteria writing
- Evidence scoring
- Model routing
- No hallucinations

### 7.5 Integration Tests

- PIT linkage
- Analytics feed
- Skills recommendations

---

## 8. Watchdog Requirements

**Monitor:**

- AI errors
- Evidence scoring failures
- Approval chain anomalies
- Missing evidence patterns
- Data drift
- High-latency AI calls

---

## 9. Backoffice & Admin Screens

- Domain master editor
- Criteria template library
- MPS template library
- Evidence type library
- Settings (roles, cycles, org preferences)

---

## 10. Versioning

- This document is version **1.0**
- Changes MUST follow: **Architecture → QA → Build**
- Foreman must approve all architectural changes
- All changes recorded in `architecture/modules/maturity/changelog.md`

---

✔️ **End of Maturity Module Architecture v1.0**
