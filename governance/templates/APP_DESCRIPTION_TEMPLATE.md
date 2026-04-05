# {APP_NAME} — App Description

## Status Header

| Field | Value |
|-------|-------|
| Version | {VERSION} (e.g., 1.0) |
| Status | `Draft` → `Authoritative` → `Superseded` |
| Owner | {OWNER — name/role} |
| Approval Date | {YYYY-MM-DD} |
| Last Updated | {YYYY-MM-DD} |
| Authority | Johan Ras |
| Canonical Location | `docs/governance/{APP}_APP_DESCRIPTION.md` |
| Policy Authority | `governance/policy/APP_DESCRIPTION_REQUIREMENT_POLICY.md` v2.0 |

---

## §1 — Application Identity

- **Application Name**: {APP_NAME}
- **Purpose**: {One-sentence purpose — what the app does}
- **Target Users/Audience**: {Who uses this app}
- **Core Value Proposition**: {What problem does this solve / why does it exist}

---

## §2 — Scope Definition

### In Scope
- {Item 1}
- {Item 2}

### Explicitly Out of Scope
- {Item 1}
- {Item 2}

### Boundaries and Constraints
- {Constraint 1}

---

## §3 — Success Criteria

- {Measurable outcome 1}
- {Measurable outcome 2}
- **Definition of Done for the Application**: {How "done" is defined for the whole application}

---

## §4 — Strategic Context

- **Why this application exists**: {Business or operational driver}
- **Relationship to other applications**: {How this integrates with or depends on other systems}
- **Replacement/extension of**: {Predecessor or related system, if any}

---

## §5 — Build Lifecycle Stages (§AD-01)

> **Rule**: Stages MUST be executed in the canonical order below. Skipping or reordering is **prohibited** without documented CS2 approval.
> **Authority**: `PRE_BUILD_STAGE_MODEL_CANON.md` v1.0.0 — this is the binding canonical sequence.

1. App Description (this document) — Authoritative before any downstream artifact
2. UX Workflow & Wiring Spec — user journeys, screen interactions, data flows, wiring (mandatory for user-facing builds; Wiring Spec Only variant for non-user-facing builds)
3. Functional Requirements Specification (FRS) — derives from App Description + UX Workflow & Wiring Spec
4. Technical Requirements Specification (TRS)
5. Architecture
6. QA-to-Red — RED test suite built and approved before any implementation begins
7. Pre-Build Functionality Assessment Gate (PBFAG) — mandatory hard gate; all upstream artifacts verified
8. Implementation Plan — delivery wave breakdown with explicit scope per wave
9. Builder Checklist — builder role-fit, scope comprehension, and protocol compliance verification
10. IAA Pre-Brief — mandatory acceptance criteria declaration before builder appointment
11. Builder Appointment — formal Foreman appointment after all prior gates pass
12. Build — implementation begins only after all prior stages are complete and gate-passed

**Prohibited**: Skipping any stage, or beginning a downstream stage before the preceding stage is Authoritative. Violations require a governance escalation to CS2.

---

## §6 — Requirements Derivation Chain (§AD-02)

```
App Description: docs/governance/{APP}_APP_DESCRIPTION.md  v{VERSION}
    ↓ derives
UX Workflow & Wiring Spec: docs/governance/{APP}_UX_WORKFLOW_WIRING_SPEC.md  v{VERSION}
    ↓ derives (together with App Description)
FRS: docs/governance/{APP}_FRS.md  v{VERSION}
    ↓ derives
TRS: docs/governance/{APP}_TRS.md  v{VERSION}
    ↓ derives
Architecture: architecture/{APP}_ARCHITECTURE.md  v{VERSION}
    ↓ derives
Build Authorization: architecture/builds/{BUILD_ID}/BUILD_AUTHORIZATION_CERTIFICATE.md
                    & architecture/builds/{BUILD_ID}/BUILD_AUTHORIZATION_BLOCK.md
```

**Cross-linking requirement**: Each downstream artifact must contain an explicit "Derived from: {upstream artifact} v{version}" statement in its header or §0.

---

## §7 — Technology Stack (§AD-03)

> **Rule**: TRS is the downstream authoritative source. Any discrepancy between this section and TRS must be resolved before Architecture commences.

| Layer | Technology | Notes |
|-------|-----------|-------|
| Frontend Framework | {e.g., React 18 + Vite} | |
| Language | {e.g., TypeScript 5.x} | |
| State Management | {e.g., React Context / Zustand} | — see §AD-20 |
| Database | {e.g., Supabase (PostgreSQL)} | |
| Auth | {e.g., Supabase Auth} | |
| AI Integration | {e.g., AIMC Gateway} | direct provider calls prohibited — see §AD-14 |
| Edge Functions | {e.g., Supabase Edge Functions} | — see §AD-15 |
| Deployment | {e.g., Vercel} | |
| CI/CD | {e.g., GitHub Actions} | |
| Notification/UX | {e.g., react-hot-toast} | — see §AD-19 |
| Other | {as needed} | |

---

## §8 — Deliverable Artifacts (§AD-04)

> **Rule**: All items below are non-negotiable deliverables. "Is the deployable app a non-negotiable deliverable?" — **YES**.

- [ ] Deployable application (production build)
- [ ] App Description (this document)
- [ ] FRS
- [ ] TRS
- [ ] Architecture
- [ ] All QA-to-Red test suites (per wave)
- [ ] PBFAG artifacts (per wave)
- [ ] PREHANDOVER proofs (per wave)
- [ ] Physical verification evidence (screenshots — UI waves)
- [ ] Schema-to-hook validation artifacts (§AD-10)
- [ ] Table Pathway Audit artifacts (§AD-11)
- [ ] RLS Audit Gate artifact (§AD-12)
- [ ] Auth Wiring Checklist artifacts (§AD-13)
- [ ] Edge Function Registry (§AD-15)
- [ ] Deployment Runbooks (§AD-18)
- [ ] CWT Closure Report (§AD-16)
- [ ] BUILD_PROGRESS_TRACKER.md (updated per wave — §AD-23)
- [ ] {Additional module-specific deliverables}

---

## §9 — Component Definition of Done (§AD-05)

> **"Exists and works" policy**: A component is ONLY done when it is fully functional in the running application. Source code alone does not constitute "done".

| Component | Done Criteria |
|-----------|--------------|
| {Component 1} | Implemented + Integrated + QA green + Browser-verified + PREHANDOVER-proved |
| {Component 2} | Implemented + Integrated + QA green + Browser-verified + PREHANDOVER-proved |
| {Add rows for each major component} | |

---

## §10 — Test-First Guarantee (§AD-06)

> **Rule**: Code-first development is **prohibited**. Every build wave (including remediation waves) MUST be preceded by a QA-to-Red test suite.

- **QA Agent/Role**: {QA agent name or role}
- **Expected QA-to-Red state before builder allocation**: {e.g., 100% of QA-to-Red tests red/failing (confirming tests exist and correctly fail before implementation)}
- **Remediation wave rule**: Remediation waves require a new QA-to-Red suite targeting the defect(s), not just reuse of prior suites.

---

## §11 — Physical Verification Gate (§AD-07)

> **Rule**: Every wave delivering or modifying a user-facing interface requires browser-based user-path verification. Screenshots and walkthrough evidence must be filed.

- **Role responsible**: {Foreman / designated agent}
- **Minimum evidence**: Screenshots of all user-facing screens in the wave scope
- **Filing location**: `.agent-admin/evidence/physical-verification/wave-{N}-{YYYYMMDD}/`
- **Gate condition**: Wave closure is blocked until physical verification evidence is filed.

---

## §12 — PBFAG Checklist Requirements (§AD-08)

> **Rule**: The Pre-Build Functionality Assessment Gate (PBFAG) is required between QA-to-Red completion and builder allocation for every wave.

**Minimum 8 checks required**:
1. QA-to-Red test suite exists and all tests are failing (confirming coverage)
2. Prior wave defects are closed or formally deferred
3. Auth wiring readiness confirmed (§AD-13)
4. Schema alignment confirmed (§AD-10)
5. RLS coverage confirmed for tables in wave scope (§AD-12)
6. PREHANDOVER proof from prior wave filed
7. Edge Function Registry up to date for wave scope (§AD-15)
8. BUILD_PROGRESS_TRACKER.md current as of prior wave (§AD-23)
9. {Module-specific check 9}
10. {Module-specific check 10}

---

## §13 — Agent Authority Chain (§AD-09)

> **Rule**: The authority chain below is binding. Violations are escalated to CS2 immediately.

| Role | Authority | Gate Point |
|------|-----------|-----------|
| CS2 (Johan Ras) | Ultimate authority; approves constitutional changes | Any governance override |
| CodexAdvisor | Only role that writes agent contracts for this module | Before any agent contract is created or modified |
| Foreman | Only role that allocates builders; approves wave plans | Before builder allocation |
| Builder | Implements within wave scope; may not modify governance artifacts | Within approved wave scope only |
| QA Agent | Writes test suites; reports defects; does not merge code | Before builder allocation (PBFAG gate) |
| {Other roles} | {Authority} | {Gate} |

---

## §14 — Schema-to-Hook Validation (§AD-10)

> **Rule**: All schema changes and migrations must be cross-verified column-by-column with hooks/queries that consume each column. No migration merges without this check.

- **Validation artifact location**: `.agent-admin/evidence/schema-to-hook/wave-{N}-{YYYYMMDD}.md`
- **Validation authority**: {Role responsible}
- **Format**: Column-by-column table with migration action and consuming hook listed for each column

---

## §15 — Table Pathway Audit (§AD-11)

> **Rule**: Before closing any wave that touches the database, an inventory of every `.from('...')` usage must be produced and cross-referenced with migration coverage and test coverage.

- **Audit artifact location**: `.agent-admin/evidence/table-pathway/wave-{N}-{YYYYMMDD}.md`
- **Format**: Table name | `.from()` usage count | Migration coverage | Test coverage | RLS policy confirmed
- **Gate condition**: Wave closure is blocked until Table Pathway Audit is filed and approved.

---

## §16 — RLS Audit Gate (§AD-12)

> **Rule**: Table-by-table RLS review is required before production deployment is authorized.

- **Audit artifact location**: `.agent-admin/evidence/rls-audit/wave-{N}-{YYYYMMDD}.md`
- **Sign-off authority**: {Role — typically Foreman with CS2 approval for production}
- **Format**: Table name | CRUD operations | RLS policy | Coverage status | Sign-off
- **Gate condition**: Production deployment is blocked until RLS Audit is signed off.

---

## §17 — Auth Wiring Checklist (§AD-13)

> **Rule**: Auth wiring must be verified for every wave. No mock auth in production builds.

Required items per wave:
- [ ] AuthProvider wraps root component
- [ ] ProtectedRoute or equivalent HOC on all authenticated routes
- [ ] Login flow tested end-to-end
- [ ] Logout flow tested end-to-end
- [ ] Real {Supabase / equivalent} auth integration (no mock auth)
- [ ] Session refresh/expiry handling tested

---

## §18 — AI Integration Requirements (§AD-14)

> **Rule**: All AI/LLM calls route via AIMC Gateway. Direct provider calls are prohibited.

- **AIMC Gateway endpoint**: {endpoint name/URL}
- **Prohibited**: Direct API calls to OpenAI, Anthropic, or any AI provider from client or server code
- **Testability**: A test or linting rule must confirm no direct provider API keys exist in the codebase outside the gateway
- **Compliance verification**: Architecture diagram shows all AI calls routing through gateway

---

## §19 — Edge Function Registry (§AD-15)

> **Rule**: Every `supabase.functions.invoke` call (or equivalent) must point to a registered, named, deployed Edge Function.

- **Registry location**: `docs/edge-functions/{APP}_EDGE_FUNCTION_REGISTRY.md`
- **Format**: Function name | Invocation path | Deployed | PREHANDOVER confirmed
- **Gate condition**: PREHANDOVER proof must reference registry; unregistered invocations are a blocking defect.

---

## §20 — Deployment Wave (§AD-16)

> **Rule**: The final wave of every implementation plan must be a Deployment & Commissioning wave.

**Required Deployment Wave contents**:
- Production environment provisioning steps
- Configuration injection (env vars, secrets — see §AD-17)
- Combined Wave Test (CWT) execution
- Production smoke testing
- CWT closure report filing

**Gate condition**: Module is not declared complete without a filed CWT closure report.

---

## §21 — Secret Naming Convention (§AD-17)

> **Rule**: All environment variable names are UPPERCASE. `.env.example` is canonical.

- **Convention**: `UPPERCASE_SNAKE_CASE` for all environment variable names
- **Canonical reference**: `.env.example` must list all required variables (no undocumented env vars in production)
- **Deployment gate**: `.env.example` must be validated during deployment wave; undocumented variables are a blocking defect

---

## §22 — Deployment Runbook (§AD-18)

> **Rule**: All deployable components require explicit runbooks before deployment wave closes.

- **Runbook location**: `docs/runbooks/{COMPONENT}_RUNBOOK.md`
- **Required sections per runbook**: Deployment steps | Rollback steps | Re-deploy instructions | Environment-specific notes
- **Gate condition**: Deployment wave closure is blocked until all runbooks are filed.

---

## §23 — Notification/UX Patterns (§AD-19)

> **Rule**: `alert()` is prohibited for user notifications. A toast notification system is required.

- **Notification library**: {e.g., react-hot-toast, sonner}
- **Integration confirmed**: Toast system integrated at root level, not ad hoc per component
- **Physical verification**: Toast notifications confirmed in browser during physical verification gate

---

## §24 — Shared State Architecture (§AD-20)

> **Rule**: State management architecture must be explicit and approved before Architecture commences.

- **State management approach**: {e.g., React Context for auth state; Zustand for UI state}
- **Global state inventory**:
  - Authentication state: {location and owner}
  - User preferences: {location and owner}
  - {Other global state}: {location and owner}
- **Cross-page flows**: {Describe any state that persists across page navigation}

---

## §25 — API Authentication (§AD-21)

> **Rule**: All session/user-context API endpoints require JWT (or equivalent) auth. PREHANDOVER check required.

- **Auth mechanism**: {e.g., Supabase JWT in Authorization header}
- **Unauthenticated endpoints** (explicitly listed): {none / list exceptions}
- **PREHANDOVER check**: API authentication audit is a required section in every PREHANDOVER proof

---

## §26 — Audit Log Design (§AD-22)

> **Rule**: Audit logging strategy must be specified before Architecture commences.

- **Action types logged**: {e.g., create, update, delete, login, logout, permission change}
- **Log query/surfacing**: {e.g., Admin dashboard audit log view; Supabase audit table with RLS}
- **Deduplication strategy**: {e.g., event_id UUID; idempotency key per operation}
- **Log retention**: {e.g., 90 days; indefinite}

---

## §27 — Tracker Update Requirement (§AD-23)

> **Rule**: BUILD_PROGRESS_TRACKER.md must be updated at every wave PR/merge. Wave closure is prohibited unless tracker is current.

- **Tracker location**: `modules/{APP}/BUILD_PROGRESS_TRACKER.md`
- **Update gate**: Foreman validates tracker currency before wave closure sign-off
- **Content required per wave entry**: Wave number | Status | Date | Evidence links | Known issues

---

## §28 — State Persistence Specification (§AD-24)

> **Rule**: Every user setting or device state must have explicit persistence specification.

| State Item | Storage Location | Retention Policy | Ownership |
|-----------|-----------------|-----------------|-----------|
| {User preference 1} | {local storage / DB / session storage} | {session / permanent / TTL} | {component/service} |
| {Device setting 1} | {local storage / DB / session storage} | {session / permanent / TTL} | {component/service} |
| {Add rows as needed} | | | |

---

## Optional Sections

### High-Level Feature List (non-exhaustive)
- {Feature 1}
- {Feature 2}

### User Personas
- {Persona 1}: {description}
- {Persona 2}: {description}

### Key Use Cases
- {Use case 1}
- {Use case 2}

### Non-Functional Priorities
- Performance: {e.g., page load < 2s}
- Security: {e.g., OWASP Top 10 compliance}
- Availability: {e.g., 99.9% uptime}

### Future Evolution Considerations
- {Consideration 1}

---

## Approval Record

| Action | By | Date | Notes |
|--------|----|------|-------|
| Draft created | {agent/role} | {YYYY-MM-DD} | |
| Review completed | {agent/role} | {YYYY-MM-DD} | |
| Authoritative status granted | Johan Ras | {YYYY-MM-DD} | CS2 sign-off |

---

**Template Metadata**:
- Template ID: APP_DESCRIPTION_TEMPLATE_V1.0
- Policy Authority: `governance/policy/APP_DESCRIPTION_REQUIREMENT_POLICY.md` v2.0
- Required Sections: §5.1 (5 sections) + §5.3 (24 mandatory governance sections)
- Checklist: `governance/checklists/APP_DESCRIPTION_CREATION_CHECKLIST.md`
- Evidence/Taxonomy: MAT module `modules/mat/BUILD_PROGRESS_TRACKER.md` (55+ errors, 2026-03-09)

---

**End of APP_DESCRIPTION_TEMPLATE**
