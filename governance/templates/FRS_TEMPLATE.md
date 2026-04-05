# {APP_NAME} — Functional Requirements Specification (FRS)

## Status Header

| Field | Value |
|-------|-------|
| Version | {VERSION} (e.g., 1.0) |
| Status | `Draft` → `Approved` → `Superseded` |
| Owner | {OWNER — name/role} |
| Approval Date | {YYYY-MM-DD} |
| Last Updated | {YYYY-MM-DD} |
| Authority | Johan Ras |
| Canonical Location | `docs/governance/{APP}_FRS.md` |
| Policy Authority | `governance/policy/APP_DESCRIPTION_REQUIREMENT_POLICY.md` v2.0 |

---

## Section 0: Derivation and Upstream Authority (REQUIRED)

### Derivation Statement

> This Functional Requirements Specification is derived from `{APP}_APP_DESCRIPTION.md` version {VERSION} and `{APP}_UX_WORKFLOW_WIRING_SPEC.md` version {VERSION}, both approved before this FRS commenced. All requirements herein implement the application purpose, scope, success criteria, user journeys, screen interactions, and wiring logic defined in those authoritative documents.

### Upstream Authority References

| Artifact | Location | Version | Status |
|----------|----------|---------|--------|
| App Description | `docs/governance/{APP}_APP_DESCRIPTION.md` | {VERSION} | Authoritative |
| UX Workflow & Wiring Spec | `docs/governance/{APP}_UX_WORKFLOW_WIRING_SPEC.md` | {VERSION} | Authoritative |

### Requirements Derivation Chain (§AD-02)

```
App Description: docs/governance/{APP}_APP_DESCRIPTION.md  v{VERSION}
    ↓ derives
UX Workflow & Wiring Spec: docs/governance/{APP}_UX_WORKFLOW_WIRING_SPEC.md  v{VERSION}
    ↓ derives (together with App Description)
FRS (this document): docs/governance/{APP}_FRS.md  v{VERSION}
    ↓ derives
TRS: docs/governance/{APP}_TRS.md  v{VERSION}
    ↓ derives
Architecture: architecture/{APP}_ARCHITECTURE.md  v{VERSION}
```

**Cross-Linking**: Each downstream artifact must contain an explicit "Derived from: {upstream artifact} v{version}" statement.

---

## Section 1: Purpose and Scope (REQUIRED)

**Purpose**: {One-sentence statement of what this FRS covers}

**Scope**: Requirements within this document are scoped to:
- {Scope item 1}
- {Scope item 2}

**Out of Scope**: {What this FRS does NOT cover — must align with App Description scope boundary}

---

## Section 2: Functional Requirements (REQUIRED)

> **Traceability Requirement**: Every functional requirement in this section MUST cite the relevant
> `APP_DESCRIPTION_REQUIREMENT_POLICY.md` section(s) (§AD-NN) from which it derives.
> Requirements without a §AD citation are **incomplete** and block downstream TRS/Architecture compilation.

### FR Traceability Table

The table below provides a summary mapping of every FR in this document to its §AD source section(s).
See individual FR entries in Section 2.x for full requirement details.

| FR ID | Requirement Title | §AD Source(s) | Priority | Status |
|-------|------------------|---------------|----------|--------|
| FR-{APP}-001 | {Title} | §AD-{NN} | Must Have | Draft |
| FR-{APP}-002 | {Title} | §AD-{NN}, §AD-{NN} | Must Have | Draft |
| FR-{APP}-003 | {Title} | §AD-{NN} | Should Have | Draft |

> **Instructions**: Add one row per functional requirement. `§AD Source(s)` must reference at least one
> section from `APP_DESCRIPTION_REQUIREMENT_POLICY.md` §5.3 (§AD-01 through §AD-24). If a requirement
> does not trace to an §AD section, escalate to the Governance Administrator before proceeding.

---

### 2.x Functional Requirement: {FR ID} — {Title}

> _Copy this block for each functional requirement._

**Requirement ID**: FR-{APP}-NNN  
**Title**: {Short descriptive title}  
**Priority**: `Must Have | Should Have | Nice to Have`  
**Status**: `Draft | Approved | Implemented | Verified`

**§AD Traceability**:

| §AD Section | Policy Requirement | Relevance to this FR |
|-------------|-------------------|----------------------|
| §AD-{NN} | {Section title from APP_DESCRIPTION_REQUIREMENT_POLICY.md} | {Explain how this FR implements the policy requirement} |

**Description**:
> {Full description of what the system must functionally do. Use "The system SHALL…" language.}

**Acceptance Criteria**:
- [ ] {Measurable criterion 1}
- [ ] {Measurable criterion 2}
- [ ] {Measurable criterion 3}

**Dependencies**: {Other FR IDs this requirement depends on, or "None"}

**Notes**: {Any clarifications, constraints, or open questions}

---

## Section 3: FR-to-§AD Coverage Matrix (REQUIRED)

This matrix confirms that all applicable §AD sections from `APP_DESCRIPTION_REQUIREMENT_POLICY.md` v2.0
are addressed by at least one FR in this document, or are explicitly documented as not applicable.

| §AD Section | Policy Title | FR(s) Addressing It | Coverage Status |
|-------------|-------------|---------------------|-----------------|
| §AD-01 | Build Lifecycle Stages | {FR IDs or "N/A — governance-level, not FR-level"} | ✅ Covered / ⚠️ Partial / ❌ Not Covered / N/A |
| §AD-02 | Requirements Derivation Chain | {FR IDs or "N/A"} | |
| §AD-03 | Technology Stack | {FR IDs or "N/A — addressed in TRS"} | |
| §AD-04 | Deliverable Artifacts | {FR IDs or "N/A"} | |
| §AD-05 | Component Definition of Done | {FR IDs or "N/A"} | |
| §AD-06 | Test-First Guarantee | {FR IDs or "N/A"} | |
| §AD-07 | Physical Verification Gate | {FR IDs or "N/A"} | |
| §AD-08 | PBFAG Checklist | {FR IDs or "N/A"} | |
| §AD-09 | Agent Authority Chain | {FR IDs or "N/A"} | |
| §AD-10 | Schema-to-Hook Validation | {FR IDs} | |
| §AD-11 | Table Pathway Audit | {FR IDs} | |
| §AD-12 | RLS Audit Gate | {FR IDs} | |
| §AD-13 | Auth Wiring Checklist | {FR IDs} | |
| §AD-14 | AI Integration Requirements | {FR IDs or "N/A — no AI integration"} | |
| §AD-15 | Edge Function Registry | {FR IDs or "N/A — no edge functions"} | |
| §AD-16 | Deployment Wave | {FR IDs or "N/A"} | |
| §AD-17 | Secret Naming Convention | {FR IDs or "N/A — addressed in TRS"} | |
| §AD-18 | Deployment Runbook | {FR IDs or "N/A"} | |
| §AD-19 | Notification/UX Patterns | {FR IDs or "N/A — no UI"} | |
| §AD-20 | Shared State Architecture | {FR IDs or "N/A"} | |
| §AD-21 | API Authentication | {FR IDs} | |
| §AD-22 | Audit Log Design | {FR IDs} | |
| §AD-23 | Tracker Update Requirement | {FR IDs or "N/A"} | |
| §AD-24 | State Persistence Specification | {FR IDs} | |

**Coverage Completion Gate**: All §AD sections must be either ✅ Covered, ⚠️ Partially Covered (with rationale), or documented as N/A with justification. Any ❌ Not Covered entry **blocks FRS approval**.

---

## Section 4: Non-Functional Requirements (OPTIONAL)

> _Complete if non-functional requirements are applicable. Non-functional requirements that have §AD backing should cite the relevant §AD section._

| NFR ID | Category | Description | §AD Source | Acceptance Criteria |
|--------|----------|-------------|------------|---------------------|
| NFR-{APP}-001 | Performance | {Description} | {§AD-NN or "N/A"} | {Criterion} |
| NFR-{APP}-002 | Security | {Description} | {§AD-NN} | {Criterion} |

---

## Section 5: Open Issues and Risks (REQUIRED)

| Issue ID | Description | §AD Relevance | Owner | Resolution Date |
|----------|-------------|---------------|-------|-----------------|
| {ISSUE-001} | {Description of open issue} | {§AD-NN or "None"} | {Owner} | {Date or "Open"} |

**Open Issue Gate**: No FR marked as `Approved` may have an unresolved blocking issue. Blocking issues must be resolved or escalated to CS2 before FRS approval.

---

## Section 6: Approval and Sign-Off (REQUIRED)

### Completeness Checklist

- [ ] All FRs include at least one §AD citation in the traceability table
- [ ] FR-to-§AD Coverage Matrix (Section 3) is complete — no ❌ rows without documented justification
- [ ] No FRs contain "TBD" or placeholder content
- [ ] Derivation statement in Section 0 references specific App Description file and version
- [ ] Scope does not exceed App Description scope
- [ ] All open blocking issues resolved or CS2-escalated

### FRS Approval

**Approval Required From**:
- [ ] Foreman (FM) — FRS complete and correct
- [ ] Governance Administrator — Governance compliance validated
- [ ] Johan (or delegated authority) — Final approval

**Approval Date**: {DATE}  
**Approved By**: {APPROVER}

**Status After Approval**: `Approved` → Ready for TRS stage

---

## Section 7: Change History (REQUIRED)

| Version | Date | Change Description | Changed By | Approval |
|---------|------|-------------------|------------|----------|
| {VERSION} | {DATE} | {Description} | {Person} | {Approver} |

**Supersedes**: {Previous version if any}  
**Superseded By**: {New version if superseded}

---

**End of FRS Document**

---

**Document Metadata**:
- FRS ID: {APP}_FRS_{VERSION}
- Required By: `APP_DESCRIPTION_REQUIREMENT_POLICY.md` v2.0, `governance/contracts/app-description-frs-alignment-checklist.md`
- Enforcement: BUILD_AUTHORIZATION_GATE, Governance Administrator
- Template Version: v1.0
- Template Location: `governance/templates/FRS_TEMPLATE.md`
