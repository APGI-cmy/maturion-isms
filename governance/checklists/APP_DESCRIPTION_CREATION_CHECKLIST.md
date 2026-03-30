# App Description Creation Checklist

## Status
Governance Checklist  
Version: v1.0  
Policy Authority: `governance/policy/APP_DESCRIPTION_REQUIREMENT_POLICY.md` v2.0  
Template Reference: `governance/templates/APP_DESCRIPTION_TEMPLATE.md`  
Applies To: All new module App Descriptions; all App Description updates

---

## Purpose

This checklist is the gate artifact for **Pre-FRS** and **Pre-Architecture** enforcement (§11.1, §11.2 of APP_DESCRIPTION_REQUIREMENT_POLICY.md v2.0). It must be completed and filed before Build Authorization is granted.

**Filing location**: `.agent-admin/evidence/app-description-checklist/{MODULE}-{YYYYMMDD}.md`

---

## Instructions

Copy this checklist into the evidence artifact at the filing location above. Mark each item `[x]` (pass) or `[ ]` (pending/fail). A single `[ ]` item blocks Build Authorization.

**Module**: {MODULE_NAME}  
**App Description File**: `docs/governance/{APP}_APP_DESCRIPTION.md`  
**App Description Version**: {VERSION}  
**Completed By**: {agent/role}  
**Date**: {YYYY-MM-DD}

---

## Part A — Required Sections (§5.1)

### A1 — Status Header
- [ ] Version is specified
- [ ] Status is one of: `Draft`, `Authoritative`, `Superseded`
- [ ] Owner (name/role) is identified
- [ ] Approval Date is present (or `Pending` if Draft)
- [ ] Last Updated date is present

### A2 — Application Identity
- [ ] Application name is specified
- [ ] Purpose statement (what the app does) is present
- [ ] Target users/audience is defined
- [ ] Core value proposition is stated

### A3 — Scope Definition
- [ ] In-scope items are listed
- [ ] Out-of-scope items are explicitly listed
- [ ] Boundaries and constraints are stated

### A4 — Success Criteria
- [ ] Measurable outcomes are listed
- [ ] Definition of "done" for the application is stated

### A5 — Strategic Context
- [ ] Reason the application exists is stated
- [ ] Business or operational driver is documented
- [ ] Relationship to other applications or systems is described

---

## Part B — Mandatory Governance Sections (§5.3)

### B1 — §AD-01: Build Lifecycle Stages
- [ ] Canonical stage order is listed (min. App Description → FRS → TRS → Architecture → QA-to-Red → Implementation → Deployment)
- [ ] Explicit prohibition of skipping or reordering stages is stated
- [ ] All stages are named

### B2 — §AD-02: Requirements Derivation Chain
- [ ] Derivation chain diagram or table is present (App Description → FRS → TRS → Architecture)
- [ ] Cross-linking artifact names are cited for each transition
- [ ] "Derived from" statement requirement is documented

### B3 — §AD-03: Technology Stack
- [ ] All major technology layers are listed (frontend, language, DB, auth, deployment, etc.)
- [ ] AI integration layer is identified (AIMC Gateway or equivalent)
- [ ] TRS-as-authoritative-source rule is acknowledged
- [ ] Conflict resolution rule (discrepancies block Architecture) is stated

### B4 — §AD-04: Deliverable Artifacts
- [ ] Checklist of all deliverable artifacts is present
- [ ] "Is the deployable app a non-negotiable deliverable?" is answered YES
- [ ] Governance artifacts are listed (FRS, TRS, architecture, test suites, PREHANDOVER proofs, etc.)

### B5 — §AD-05: Component Definition of Done
- [ ] "Exists and works" policy is stated
- [ ] At least one named component has a definition-of-done entry
- [ ] All major components are listed with done criteria

### B6 — §AD-06: Test-First Guarantee
- [ ] Code-first prohibition is explicitly stated
- [ ] QA agent/role is named
- [ ] Minimum passing threshold is defined
- [ ] Remediation wave rule is acknowledged

### B7 — §AD-07: Physical Verification Gate
- [ ] Browser-based verification requirement is stated for UI waves
- [ ] Role responsible is named
- [ ] Evidence filing location is specified
- [ ] Wave closure gate condition is stated

### B8 — §AD-08: PBFAG Checklist Requirements
- [ ] PBFAG is mandated between QA-to-Red and builder allocation
- [ ] Minimum 8 PBFAG checks are listed
- [ ] Gate condition (no builder allocation without PBFAG) is stated

### B9 — §AD-09: Agent Authority Chain
- [ ] Authority chain table is present with all roles
- [ ] CodexAdvisor sole-authority-for-agent-contracts is stated
- [ ] Foreman sole-builder-allocator rule is stated
- [ ] Gate points for authority transitions are defined

### B10 — §AD-10: Schema-to-Hook Validation
- [ ] Column-by-column validation requirement is stated
- [ ] Validation artifact location is specified
- [ ] No-merge-without-check rule is stated

### B11 — §AD-11: Table Pathway Audit
- [ ] Table Pathway Audit is mandated for DB-touching waves
- [ ] Audit artifact location is specified
- [ ] Wave closure gate condition is stated

### B12 — §AD-12: RLS Audit Gate
- [ ] Table-by-table RLS review is mandated before production deployment
- [ ] Audit artifact location is specified
- [ ] Sign-off authority is named
- [ ] Production deployment gate condition is stated

### B13 — §AD-13: Auth Wiring Checklist
- [ ] AuthProvider wrapping requirement is stated
- [ ] ProtectedRoute/HOC requirement is stated
- [ ] Login/logout end-to-end test requirement is stated
- [ ] No-mock-auth-in-production rule is stated

### B14 — §AD-14: AI Integration Requirements
- [ ] AIMC Gateway requirement is stated (all AI calls routed via gateway)
- [ ] Direct provider call prohibition is explicit
- [ ] AIMC Gateway endpoint is named (or noted as TBD until TRS)
- [ ] Testability requirement is stated

### B15 — §AD-15: Edge Function Registry
- [ ] Edge Function Registry requirement is stated
- [ ] Registry location is specified
- [ ] Unregistered-invocations-are-blocking-defect rule is stated
- [ ] PREHANDOVER proof must reference registry is stated

### B16 — §AD-16: Deployment Wave
- [ ] Final Deployment & Commissioning wave is mandated in implementation plan
- [ ] CWT (Combined Wave Test) requirement is stated
- [ ] CWT closure report requirement is stated
- [ ] Module completion gate (no closure without CWT) is stated

### B17 — §AD-17: Secret Naming Convention
- [ ] UPPERCASE convention is stated
- [ ] `.env.example` as canonical reference is stated
- [ ] Deployment gate (undocumented env vars are blocking) is stated

### B18 — §AD-18: Deployment Runbook
- [ ] Runbook requirement for all deployable components is stated
- [ ] Runbook filing location is specified
- [ ] Runbook minimum contents are listed (deploy, rollback, redeploy)
- [ ] Deployment wave closure gate is stated

### B19 — §AD-19: Notification/UX Patterns
- [ ] `alert()` prohibition is explicit
- [ ] Toast notification library/system is named
- [ ] Root-level integration requirement is stated
- [ ] Physical verification check for toast system is stated

### B20 — §AD-20: Shared State Architecture
- [ ] State management approach is named (library/pattern)
- [ ] Global state inventory is present (auth state, user preferences, etc.)
- [ ] Cross-page state flows are described
- [ ] Pre-Architecture approval gate is stated

### B21 — §AD-21: API Authentication
- [ ] JWT (or equivalent) authentication is mandated for session-scoped endpoints
- [ ] Unauthenticated endpoints are explicitly listed (or stated as none)
- [ ] PREHANDOVER API authentication audit requirement is stated

### B22 — §AD-22: Audit Log Design
- [ ] Action types to be logged are listed
- [ ] Log query/surfacing method is described
- [ ] Deduplication strategy is stated
- [ ] Log retention policy is stated
- [ ] Pre-Architecture approval gate is stated

### B23 — §AD-23: Tracker Update Requirement
- [ ] BUILD_PROGRESS_TRACKER.md update is mandated per wave
- [ ] Tracker location is specified
- [ ] Wave closure gate (tracker must be current) is stated
- [ ] Foreman validation step is stated

### B24 — §AD-24: State Persistence Specification
- [ ] State persistence table/list is present for all user settings and device states
- [ ] Storage location is specified for each state item
- [ ] Retention policy is specified for each state item
- [ ] Ownership is specified for each state item

---

## Part C — Approval and Readiness

### C1 — Authoritative Status
- [ ] All required sections (Part A) are complete
- [ ] All 24 mandatory governance sections (Part B) are complete
- [ ] Status is set to `Authoritative` (or a formal plan to reach Authoritative exists)
- [ ] Approval from Johan Ras (or designated authority) is documented

### C2 — Downstream Readiness
- [ ] FRS may only commence after this checklist is complete
- [ ] Architecture may only commence after FRS is complete and references this App Description
- [ ] Build Authorization Gate requires this checklist as a filed evidence artifact

---

## Checklist Result

| Part | Status | Notes |
|------|--------|-------|
| Part A — Required Sections | PASS / FAIL | |
| Part B — Mandatory Governance Sections | PASS / FAIL | |
| Part C — Approval and Readiness | PASS / FAIL | |
| **Overall Result** | **PASS / FAIL** | |

**Completed By**: {agent/role}  
**Date**: {YYYY-MM-DD}  
**Build Authorization Cleared**: YES / NO — pending resolution of: {list any failing items}

---

**Checklist Metadata**:
- Checklist ID: APP_DESCRIPTION_CREATION_CHECKLIST_V1.0
- Policy Authority: `governance/policy/APP_DESCRIPTION_REQUIREMENT_POLICY.md` v2.0 §11.1, §11.2, §20
- Template: `governance/templates/APP_DESCRIPTION_TEMPLATE.md`
- Evidence/Taxonomy: MAT module `modules/mat/BUILD_PROGRESS_TRACKER.md` (55+ errors, 2026-03-09)

---

**End of APP_DESCRIPTION_CREATION_CHECKLIST**
