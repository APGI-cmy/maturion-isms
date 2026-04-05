# {APP_NAME} — UX Workflow & Wiring Spec

## Status Header

| Field | Value |
|-------|-------|
| Version | {VERSION} (e.g., 1.0) |
| Status | `Draft` → `Approved` → `Superseded` |
| Owner | {OWNER — name/role} |
| Approval Date | {YYYY-MM-DD} |
| Last Updated | {YYYY-MM-DD} |
| Authority | Johan Ras |
| Canonical Location | `docs/governance/{APP}_UX_WORKFLOW_WIRING_SPEC.md` |
| Policy Authority | `PRE_BUILD_STAGE_MODEL_CANON.md` v1.0.0 — Stage 2 |

---

## Section 0: Derivation and Upstream Authority (REQUIRED)

### Derivation Statement

> This UX Workflow & Wiring Spec is derived from `{APP}_APP_DESCRIPTION.md` version {VERSION}, approved {DATE}. All user journeys, interactions, data flows, and wiring definitions herein operationalise the scope, purpose, and capabilities defined in that authoritative document.

### Upstream Authority References

| Artifact | Location | Version | Status |
|----------|----------|---------|--------|
| App Description | `docs/governance/{APP}_APP_DESCRIPTION.md` | {VERSION} | Authoritative |

---

## Section 1: Purpose and Scope (REQUIRED)

**Purpose**: {One-sentence statement of what this UX Workflow & Wiring Spec covers}

**Scope**: User journeys and wiring in this document are scoped to:
- {Scope item 1}
- {Scope item 2}

**Out of Scope**: {What this spec does NOT cover — must align with App Description scope boundary}

**Variant**: [ ] Full UX Workflow & Wiring Spec (user-facing build) | [ ] Wiring Spec Only (non-user-facing build)

---

## Section 2: User Journey Maps (REQUIRED for user-facing builds)

> **Rule**: All primary and secondary user paths must be documented. No user journey present in the App Description may be omitted.

### Journey Coverage Matrix

| Journey ID | Journey Name | Type | Status | Section Reference |
|-----------|-------------|------|--------|-------------------|
| UJ-{APP}-001 | {Journey Name} | Primary / Secondary | Documented / Partial / Missing | §2.x |
| UJ-{APP}-002 | {Journey Name} | Primary / Secondary | Documented / Partial / Missing | §2.x |

> **Coverage Gate**: Every journey listed as "Primary" must be fully documented before approval. "Secondary" journeys must be at minimum sketched with screen transitions noted.

---

### 2.x Journey: {UJ ID} — {Journey Name}

> _Copy this block for each user journey._

**Journey ID**: UJ-{APP}-NNN  
**Type**: `Primary | Secondary`  
**Entry Point**: {How/where the user enters this journey}  
**Exit Point**: {How/where the journey completes — success state}  
**Error Exit Points**: {Identified failure / error states}

**Step-by-Step Flow**:

| Step | User Action | System Response | Screen / State | Data In | Data Out |
|------|------------|-----------------|----------------|---------|----------|
| 1 | {Describe user action} | {Describe system response} | {Screen or state name} | {Input data} | {Output data} |
| 2 | | | | | |

**Observable Outcomes**:
- {What the user sees at journey completion}
- {Any notifications, confirmations, or state changes visible to the user}

**Edge Cases and Exceptions**:
- {Edge case 1}: {How the system handles it}
- {Edge case 2}: {How the system handles it}

---

## Section 3: Screen-Level Interaction Definitions (REQUIRED for user-facing builds)

> **Rule**: Every screen involved in a Primary user journey must be defined here.

### Screen Inventory

| Screen ID | Screen Name | Accessible From | Leads To | Journey References |
|-----------|------------|----------------|----------|--------------------|
| SCR-{APP}-001 | {Screen Name} | {Entry point(s)} | {Exit point(s)} | UJ-{APP}-NNN |

---

### 3.x Screen: {SCR ID} — {Screen Name}

> _Copy this block for each screen._

**Screen ID**: SCR-{APP}-NNN  
**Purpose**: {What this screen allows the user to do}  
**Access Control**: {Who can see/use this screen}

**UI Elements**:

| Element | Type | Action / Trigger | Validation | API / Data Source |
|---------|------|-----------------|------------|-------------------|
| {Element name} | Button / Input / Table / etc. | {What happens when used} | {Validation rules} | {API endpoint or data source} |

**State Conditions**:
- Loading state: {Description}
- Empty state: {Description}
- Error state: {Description}
- Success state: {Description}

---

## Section 4: Trigger Point Catalogue (REQUIRED)

> **Rule**: Every trigger point (user action, system event, time-based event) that initiates a workflow must be documented.

| Trigger ID | Type | Description | Initiating Source | Resulting Workflow | Notes |
|-----------|------|-------------|------------------|-------------------|-------|
| TRG-{APP}-001 | User Action / System Event / Scheduled | {Description} | {User role / system process / cron} | {Journey or workflow name} | |

---

## Section 5: Data Movement Flows (REQUIRED)

> **Rule**: For every user journey, document the data movement from input through processing to output and storage.

### 5.x Data Flow: {UJ ID} — {Journey Name}

```
User Input: {describe input data / form fields / actions}
    ↓
Frontend Processing: {describe any client-side processing, validation}
    ↓
API Call: {endpoint name and method}
    ↓
Backend Processing: {describe server-side logic / validation / transformation}
    ↓
Database Operation: {table name | operation type: INSERT / UPDATE / SELECT / DELETE}
    ↓
Response: {describe API response payload}
    ↓
UI Update: {describe how the UI updates in response}
    ↓
Storage Side-Effect (if any): {describe any audit logs, notifications, or derived state updates}
```

---

## Section 6: State Transition Definitions (REQUIRED)

> **Rule**: All significant state transitions affecting user experience or data integrity must be documented.

| Entity | From State | To State | Trigger | Reversible? | Guard Conditions |
|--------|-----------|---------|---------|-------------|-----------------|
| {Entity name} | {State A} | {State B} | {Trigger event} | Yes / No | {Conditions that must be true} |

---

## Section 7: AI Action Integration Points (REQUIRED if AI used)

> **Rule**: Every point at which an AI agent acts on behalf of the user must be explicitly defined.

| AI Action ID | Description | Trigger | Input Context | Output / Effect | Human Override? |
|-------------|-------------|---------|--------------|-----------------|-----------------|
| AI-{APP}-001 | {Description of what AI does} | {Trigger event} | {Data/context provided to AI} | {What AI produces or changes} | Yes / No |

If no AI integration: document `N/A — No AI action points in this module` and skip this section.

---

## Section 8: Report and Dashboard Flow Definitions (REQUIRED if applicable)

> **Rule**: Every report or dashboard output visible to the user must be traced from data source to display.

| Report / Dashboard | Data Source(s) | Query / Aggregation | Filters Available | Refresh Trigger | Access Control |
|-------------------|---------------|---------------------|------------------|----------------|----------------|
| {Report name} | {Tables / APIs} | {Describe aggregation} | {User-controlled filters} | {On load / scheduled / manual} | {Role or condition} |

If no reports or dashboards: document `N/A — No reports or dashboards in this module` and skip this section.

---

## Section 9: End-to-End Wiring Matrix (REQUIRED)

> **Rule**: This matrix explicitly wires every UI element, API endpoint, schema table, and reporting output together. No element may be present in any one column without a corresponding entry in at least one other column.

| UI Element (Screen + Element ID) | API Endpoint | HTTP Method | Schema Table(s) | Report / Output | Journey Reference |
|----------------------------------|-------------|-------------|----------------|-----------------|-------------------|
| {Screen / Element} | {/api/path} | GET/POST/PUT/DELETE | {table_name} | {Report name or "—"} | UJ-{APP}-NNN |

---

## Section 10: Wiring Completeness Gate (REQUIRED)

Before this spec may be approved, confirm:

- [ ] Every user journey in Section 2 maps to at least one row in the Wiring Matrix (§9)
- [ ] Every screen in Section 3 maps to at least one row in the Wiring Matrix (§9)
- [ ] Every API endpoint in §9 has a corresponding TRS entry (or is explicitly noted as new — pending TRS)
- [ ] Every schema table in §9 is accounted for in the Architecture data model (or is explicitly noted as new)
- [ ] No journey end-state is left without a defined system response or data outcome
- [ ] No UI element is wired to a non-existent API endpoint or table
- [ ] All AI action points in §7 have a corresponding trigger in §4

**Gate Condition**: All items above must be checked. Any unchecked item blocks approval.

---

## Section 11: Open Issues and Wiring Gaps (REQUIRED)

| Gap ID | Description | Severity | Artifact to Update | Owner | Resolution Date |
|--------|-------------|----------|--------------------|-------|-----------------|
| {GAP-001} | {Description of wiring gap} | CRITICAL / MAJOR / MINOR | {Artifact name} | {Owner} | {Date or "Open"} |

**Open Gap Gate**: No gap of CRITICAL or MAJOR severity may remain open at time of approval. MINOR gaps must be documented with owner and target resolution date.

---

## Section 12: Approval and Sign-Off (REQUIRED)

### Completeness Checklist

- [ ] All primary user journeys fully documented in §2
- [ ] All screens for primary journeys defined in §3
- [ ] Trigger point catalogue (§4) complete
- [ ] Data movement flows (§5) documented for all primary journeys
- [ ] State transitions (§6) documented for all stateful entities
- [ ] AI action points (§7) documented or explicitly N/A
- [ ] Report / dashboard flows (§8) documented or explicitly N/A
- [ ] Wiring matrix (§9) complete — no orphan UI elements, endpoints, or tables
- [ ] Wiring completeness gate (§10) fully checked
- [ ] No CRITICAL or MAJOR open gaps in §11
- [ ] Derivation statement in §0 references specific App Description file and version

### Approval

**Approval Required From**:
- [ ] Foreman (FM) — UX Workflow & Wiring Spec complete and correct
- [ ] Client / User Representative — User journeys reflect actual intended workflows
- [ ] Governance Administrator — Governance compliance validated

**Approval Date**: {DATE}  
**Approved By**: {APPROVER}

**Status After Approval**: `Approved` → Ready for FRS stage

---

## Section 13: Change History (REQUIRED)

| Version | Date | Change Description | Changed By | Approval |
|---------|------|-------------------|------------|----------|
| {VERSION} | {DATE} | {Description} | {Person} | {Approver} |

**Supersedes**: {Previous version if any}  
**Superseded By**: {New version if superseded}

---

**End of UX Workflow & Wiring Spec Document**

---

**Document Metadata**:
- Template ID: UX_WORKFLOW_WIRING_SPEC_TEMPLATE_V1.0
- Stage: Stage 2 — per `PRE_BUILD_STAGE_MODEL_CANON.md` v1.0.0
- Required By: `PRE_BUILD_STAGE_MODEL_CANON.md` v1.0.0 §Stage 2; `APP_DESCRIPTION_REQUIREMENT_POLICY.md` v2.0 §AD-01
- Template Version: v1.0
- Template Location: `governance/templates/UX_WORKFLOW_WIRING_SPEC_TEMPLATE.md`
- Effective Date: 2026-04-05
