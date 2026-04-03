
## Status Header

| Field | Value |
|-------|-------|
| Version | {VERSION} (e.g., 1.0) |
| Status | `Draft` → `Approved` → `Superseded` |
| Owner | {OWNER — name/role} |
| Approval Date | {YYYY-MM-DD} |
| Last Updated | {YYYY-MM-DD} |
| Authority | Johan Ras |
| Canonical Location | `docs/governance/{APP}_TRS.md` |
| Policy Authority | `governance/policy/APP_DESCRIPTION_REQUIREMENT_POLICY.md` v2.0 |

---

## Section 0: Derivation and Upstream Authority (REQUIRED)

### Derivation Statement

> This Technical Requirements Specification is derived from `{APP}_FRS.md` version {VERSION}, approved {DATE}, which is in turn derived from `{APP}_APP_DESCRIPTION.md` version {VERSION}. All technical requirements herein implement and constrain the functional requirements defined in the FRS, without contradicting the App Description.

### Upstream Authority References

| Artifact | Location | Version | Status |
|----------|----------|---------|--------|
| App Description | `docs/governance/{APP}_APP_DESCRIPTION.md` | {VERSION} | Authoritative |
| FRS | `docs/governance/{APP}_FRS.md` | {VERSION} | Approved |

### Requirements Derivation Chain (§AD-02)

```
App Description: docs/governance/{APP}_APP_DESCRIPTION.md  v{VERSION}
    ↓ derives
FRS: docs/governance/{APP}_FRS.md  v{VERSION}
    ↓ derives
TRS (this document): docs/governance/{APP}_TRS.md  v{VERSION}
    ↓ derives
Architecture: architecture/{APP}_ARCHITECTURE.md  v{VERSION}
```

**Contradiction Rule**: No TRS requirement may contradict the App Description or the FRS. If a contradiction is discovered, the upstream document takes precedence and the TRS must be corrected before Architecture commences.

---

## Section 1: Purpose and Scope (REQUIRED)

**Purpose**: This TRS bridges the FRS (what the system must do) and Architecture (how the system will be structured) by capturing technical constraints, performance requirements, integration specifications, and tool validation rules.

**Scope**: Technical requirements within this document are scoped to:
- {Scope item 1}
- {Scope item 2}

**Out of Scope**: {What this TRS does NOT cover — must not exceed FRS scope}

---

## Section 2: Technology Stack (§AD-03) (REQUIRED)

> **Policy Reference**: `APP_DESCRIPTION_REQUIREMENT_POLICY.md` §AD-03  
> **Rule**: The TRS is the **downstream authoritative realization** of the technology stack baseline defined in the App Description. Any discrepancy between App Description §7 and this section is a **blocking defect** that MUST be resolved before Architecture commences. The TRS may refine or add constraints but may not contradict the App Description.

### 2.1 App Description Technology Baseline Reference

**App Description Technology Stack Section**: `{APP}_APP_DESCRIPTION.md` §7 — Technology Stack (§AD-03)

**Confirmed Alignment**: [ ] This section has been reviewed against the App Description §7 — no contradictions found.  
**Contradiction (if any)**: {Describe any discrepancy and resolution status, or "None"}

### 2.2 Authoritative Technology Stack

| Component | Technology / Framework | Version Constraint | Justification |
|-----------|----------------------|-------------------|---------------|
| Frontend | {e.g., Next.js} | {e.g., ≥14.0} | {Reason} |
| Backend | {e.g., Supabase, Node.js} | {e.g., Node ≥20} | {Reason} |
| Database | {e.g., PostgreSQL via Supabase} | {Version} | {Reason} |
| Auth | {e.g., Supabase Auth} | {Version} | {Reason} |
| Infrastructure | {e.g., Vercel, Docker} | {Version} | {Reason} |
| AI/LLM Gateway | {e.g., AIMC Gateway} | {Version} | {Reason} |

### 2.3 Platform and Runtime Constraints

- **Browser Support**: {e.g., Chrome ≥120, Safari ≥17, Firefox ≥120}
- **Node.js Version**: {e.g., ≥20.0 LTS}
- **Operating System Constraints**: {e.g., Linux x64 for server runtime}

### 2.4 Technology Stack Validation Gate

Before Architecture commences, the following must be confirmed:
- [ ] Every item in this section matches or refines (without contradicting) App Description §7
- [ ] All version constraints are explicit — no "latest" or "any" versions accepted
- [ ] Third-party service dependencies are named with API/SDK versions

---

## Section 3: FRS-to-TRS Traceability Matrix (REQUIRED)

Every TRS technical requirement MUST derive from one or more FRS requirements.

| TR ID | Technical Requirement Title | FRS Requirement(s) | §AD Source(s) | Priority |
|-------|---------------------------|-------------------|---------------|----------|
| TR-{APP}-001 | {Title} | FR-{APP}-{NNN} | §AD-{NN} | Must Have |
| TR-{APP}-002 | {Title} | FR-{APP}-{NNN}, FR-{APP}-{NNN} | §AD-{NN} | Must Have |

**Orphan TR Rule**: A TR that cannot be traced to any FRS requirement is an orphan and must be either justified or removed before TRS approval.

---

## Section 4: Technical Requirements — §AD Policy Alignment (REQUIRED)

> The subsections below provide dedicated coverage for each §AD section that has direct TRS-level obligations per `APP_DESCRIPTION_REQUIREMENT_POLICY.md` v2.0. Each subsection is **mandatory** unless explicitly marked `N/A` with documented justification.

---

### 4.1 Schema-to-Hook Validation (§AD-10) (REQUIRED)

> **Policy Reference**: `APP_DESCRIPTION_REQUIREMENT_POLICY.md` §AD-10  
> **Rule**: All schema changes and migrations MUST be cross-verified with data-architecture and with the hooks/queries that consume each column. No migration may be merged without a schema-to-hook alignment check.

**Applicability**: [ ] Applicable (database schema changes are in scope) | [ ] Not Applicable — Justification: {reason}

**Schema-to-Hook Validation Approach**:

| Table / Migration | Columns Affected | Hooks / Queries Consuming Column(s) | Validation Method | Status |
|-------------------|-----------------|-------------------------------------|-------------------|--------|
| {table_name} | {col1, col2} | {hook/query file paths} | {Manual / Automated} | {Pending / Complete} |

**Validation Gate Requirements**:
- [ ] Every migration wave includes a schema-to-hook alignment check artifact
- [ ] No orphaned columns (columns with no hook/query coverage)
- [ ] No missing hook coverage (hooks referencing non-existent columns)
- [ ] Schema-to-hook validation artifact filed before wave merge

**Evidence Artifact Location**: `{path to schema-to-hook validation artifact, e.g., architecture/builds/{BUILD_ID}/evidence/schema-to-hook-validation.md}`

---

### 4.2 Table Pathway Audit (§AD-11) (REQUIRED)

> **Policy Reference**: `APP_DESCRIPTION_REQUIREMENT_POLICY.md` §AD-11  
> **Rule**: A Table Pathway Audit MUST be performed before closing any wave that touches the database. The audit inventories every `.from('...')` database/table usage, cross-referenced with migration and test coverage.

**Applicability**: [ ] Applicable | [ ] Not Applicable — Justification: {reason}

**Table Pathway Audit Requirements**:

| Table | `.from()` Usage Locations | Migration Coverage | Test Coverage | RLS Policy | Audit Status |
|-------|--------------------------|-------------------|---------------|------------|--------------|
| {table_name} | {file:line references} | {migration file} | {test file(s)} | {✅ In Place / ❌ Missing} | {Pending / Complete} |

**Audit Gate Requirements**:
- [ ] Every table in wave scope is inventoried
- [ ] Every table in wave scope has migration coverage
- [ ] Every table in wave scope has test coverage
- [ ] Every table in wave scope has RLS policy in place
- [ ] Table Pathway Audit artifact filed and approved before wave closure sign-off

**Evidence Artifact Location**: `{path, e.g., architecture/builds/{BUILD_ID}/evidence/table-pathway-audit.md}`

---

### 4.3 RLS Audit Gate (§AD-12) (REQUIRED)

> **Policy Reference**: `APP_DESCRIPTION_REQUIREMENT_POLICY.md` §AD-12  
> **Rule**: An RLS Audit Gate MUST be performed before production deployment. The audit performs a table-by-table review of CRUD policy coverage for every table the application reads or writes.

**Applicability**: [ ] Applicable | [ ] Not Applicable — Justification: {reason}

**RLS Audit Coverage**:

| Table | SELECT Policy | INSERT Policy | UPDATE Policy | DELETE Policy | RLS Enabled | Audit Status |
|-------|--------------|--------------|--------------|--------------|-------------|--------------|
| {table_name} | {policy name / ❌ Missing} | {policy name / ❌ Missing} | {policy name / ❌ Missing} | {policy name / ❌ Missing} | {✅ / ❌} | {Pending / Complete} |

**RLS Gate Requirements**:
- [ ] RLS is enabled on every application table
- [ ] All CRUD operations are covered by explicit RLS policies (no implicit allow)
- [ ] RLS audit completion artifact filed
- [ ] Production deployment is blocked until RLS audit sign-off is recorded

**Responsible Agent/Role**: {Name or role responsible for RLS audit}  
**Sign-Off Authority**: {Name or role}  
**Evidence Artifact Location**: `{path, e.g., architecture/builds/{BUILD_ID}/evidence/rls-audit.md}`

---

### 4.4 Edge Function Registry (§AD-15) (REQUIRED)

> **Policy Reference**: `APP_DESCRIPTION_REQUIREMENT_POLICY.md` §AD-15  
> **Rule**: Every `supabase.functions.invoke` call (or equivalent) MUST point to a listed, named, deployed Edge Function in the registry. Calls to unregistered or non-deployed functions are a blocking defect.

**Applicability**: [ ] Applicable (edge functions are used) | [ ] Not Applicable — Justification: {reason}

**Edge Function Registry**:

| Edge Function Name | Invocation Location(s) | Deployment Status | Registry Status | Notes |
|-------------------|----------------------|-------------------|-----------------|-------|
| {function_name} | {file:line} | {Deployed / Pending} | {Registered / ❌ Missing} | {Notes} |

**Registry Gate Requirements**:
- [ ] Every `supabase.functions.invoke` call is listed in this registry
- [ ] All registered functions are deployed before PREHANDOVER
- [ ] PREHANDOVER proof references this registry and confirms all invocations match registered functions
- [ ] No calls to unregistered functions exist in the codebase

**Evidence Artifact Location**: `{path, e.g., architecture/builds/{BUILD_ID}/evidence/edge-function-registry.md}`

---

### 4.5 Secret Naming Convention (§AD-17) (REQUIRED)

> **Policy Reference**: `APP_DESCRIPTION_REQUIREMENT_POLICY.md` §AD-17  
> **Rule**: All environment variable names MUST follow UPPERCASE invariant. `.env.example` is the canonical reference for all required environment variables and MUST be complete and up to date. No production deployment may use environment variables not listed in `.env.example`.

**Applicability**: [ ] Applicable | [ ] Not Applicable — Justification: {reason}

**`.env.example` Reference**: `{path to .env.example file}`

**Environment Variable Registry**:

| Variable Name | Type | Required/Optional | Description | In `.env.example` |
|--------------|------|-------------------|-------------|-------------------|
| {VAR_NAME} | `Secret / Config` | Required | {Description} | ✅ / ❌ |

**Naming Convention Rules**:
- All variable names: UPPERCASE with underscores (e.g., `SUPABASE_URL`, `OPENAI_API_KEY`)
- No lowercase or camelCase environment variable names
- Prefix conventions: {e.g., `NEXT_PUBLIC_` for client-side, `SUPABASE_` for Supabase secrets}

**Secret Naming Gate Requirements**:
- [ ] All environment variables follow UPPERCASE naming convention
- [ ] `.env.example` is complete and lists every required variable
- [ ] No production environment variables exist that are absent from `.env.example`
- [ ] Secret naming cross-checked during deployment wave
- [ ] Naming deviations are treated as blocking defects

**Evidence Artifact Location**: `{path, e.g., architecture/builds/{BUILD_ID}/evidence/secret-naming-validation.md}`

---

### 4.6 Shared State Architecture (§AD-20) (REQUIRED)

> **Policy Reference**: `APP_DESCRIPTION_REQUIREMENT_POLICY.md` §AD-20  
> **Rule**: The state management approach MUST be named. All global state flows — including authentication state, user preferences, and cross-component data — must be explicitly described. Ambiguity in state ownership is a blocking defect.

**Applicability**: [ ] Applicable | [ ] Not Applicable — Justification: {reason}

**State Management Approach**: {e.g., React Context, Redux, Zustand, or equivalent — must match App Description §AD-20 declaration}

**Global State Inventory**:

| State Domain | Description | Owner Component/Service | Persistence | Sharing Mechanism |
|-------------|-------------|------------------------|-------------|-------------------|
| Authentication State | User session, JWT, roles | {e.g., AuthProvider} | Session | {e.g., React Context} |
| {State Domain} | {Description} | {Owner} | {Session / Local / DB} | {Mechanism} |

**State Architecture Requirements**:
- [ ] State management library/pattern is named and matches App Description §AD-20
- [ ] All global state flows are explicitly documented (no undocumented global state)
- [ ] Authentication state is managed via the named state management approach
- [ ] No ambiguous state ownership — every piece of shared state has exactly one authoritative owner
- [ ] Architecture confirms state management approach
- [ ] Code review validates no undocumented global state patterns

**Evidence Artifact Location**: `{path, e.g., architecture/builds/{BUILD_ID}/evidence/shared-state-architecture.md}`

---

### 4.7 Audit Log Design (§AD-22) (REQUIRED)

> **Policy Reference**: `APP_DESCRIPTION_REQUIREMENT_POLICY.md` §AD-22  
> **Rule**: The TRS MUST specify: (a) which action types will be logged, (b) how audit logs are queried or surfaced, and (c) the deduplication strategy. Audit log design must be approved before Architecture commences.

**Applicability**: [ ] Applicable | [ ] Not Applicable — Justification: {reason}

**Audit Log Scope**:

| Action Type | Trigger | Log Fields | Deduplication Key |
|------------|---------|------------|-------------------|
| Create | {Entity create event} | {id, actor, timestamp, entity_type, entity_id} | {event_id / idempotency_key} |
| Update | {Entity update event} | {id, actor, timestamp, entity_type, entity_id, changed_fields} | {event_id} |
| Delete | {Entity delete event} | {id, actor, timestamp, entity_type, entity_id} | {event_id} |
| Auth Event | {Login / logout / token refresh} | {id, actor, timestamp, event_type, ip_address} | {event_id} |
| {Custom Event} | {Description} | {Fields} | {Deduplication key} |

**Audit Log Query and Surfacing**:
- **Admin View**: {How administrators access audit logs — e.g., admin dashboard page, Supabase Studio}
- **Export Capability**: {Export format and method, e.g., CSV export via API endpoint}
- **Retention Policy**: {How long logs are retained, e.g., 90 days rolling}

**Audit Log Schema**:
```sql
-- Example audit log table schema (adapt to actual implementation)
CREATE TABLE audit_logs (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id    UUID NOT NULL UNIQUE,  -- idempotency / deduplication key
  actor_id    UUID REFERENCES auth.users(id),
  action_type TEXT NOT NULL,         -- 'create' | 'update' | 'delete' | 'auth_event' | ...
  entity_type TEXT,
  entity_id   UUID,
  metadata    JSONB,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

**Audit Log Design Requirements**:
- [ ] All action types to be logged are enumerated above
- [ ] Query/surfacing mechanism is specified (admin view, export)
- [ ] Deduplication strategy is defined (event_id / idempotency key)
- [ ] Audit log design is approved before Architecture commences
- [ ] Architecture includes the audit log schema
- [ ] Audit log design is referenced in Architecture

**Evidence Artifact Location**: `{path, e.g., architecture/builds/{BUILD_ID}/evidence/audit-log-design.md}`

---

### 4.8 State Persistence Specification (§AD-24) (REQUIRED)

> **Policy Reference**: `APP_DESCRIPTION_REQUIREMENT_POLICY.md` §AD-24  
> **Rule**: For each piece of user-configurable or device-specific state, the TRS MUST specify: (a) storage location, (b) retention policy, and (c) ownership. Ambiguity in state persistence is a blocking defect.

**Applicability**: [ ] Applicable | [ ] Not Applicable — Justification: {reason}

**State Persistence Inventory**:

| State Name | Description | Storage Location | Retention Policy | Authoritative Owner |
|-----------|-------------|-----------------|-----------------|---------------------|
| User Preferences | {e.g., theme, language} | {e.g., Database — user_preferences table} | {Permanent / TTL: 30d / Session} | {e.g., UserPreferencesService} |
| Session Data | {e.g., active session token} | {e.g., HttpOnly cookie / sessionStorage} | {Session} | {e.g., AuthProvider} |
| Device-Specific State | {e.g., last viewed page} | {e.g., localStorage} | {Permanent / TTL: 7d} | {e.g., NavigationService} |
| {State Name} | {Description} | {Storage Location} | {Retention Policy} | {Authoritative Owner} |

**Storage Location Definitions**:
- `localStorage`: Persists across sessions, device-specific, ~5MB limit
- `sessionStorage`: Session-only, device-specific, cleared on tab close
- `Cookie (HttpOnly)`: Server-accessible, session or persistent TTL
- `Database`: Cross-device, persistent, server-side authority
- `In-Memory / React State`: Session-only, lost on page reload

**State Persistence Requirements**:
- [ ] Every piece of user-configurable or device-specific state is listed above
- [ ] Storage location is explicit for every state item (no ambiguous "stored in frontend")
- [ ] Retention policy is specified for every state item
- [ ] Authoritative owner is designated for every state item
- [ ] No ambiguous state persistence — every state item has exactly one authoritative location
- [ ] Architecture references this specification
- [ ] Implementation review confirms alignment

**Evidence Artifact Location**: `{path, e.g., architecture/builds/{BUILD_ID}/evidence/state-persistence-spec.md}`

---

## Section 5: Performance Requirements (REQUIRED)

| TR ID | Requirement | Target | Measurement Method | §AD Source |
|-------|-------------|--------|-------------------|------------|
| TR-{APP}-PERF-001 | API response time | {e.g., < 200ms p95} | {e.g., Lighthouse / k6} | {§AD-NN or "N/A"} |
| TR-{APP}-PERF-002 | {Description} | {Target} | {Method} | {§AD-NN} |

---

## Section 6: Integration Requirements (REQUIRED)

| Integration | API / SDK Version | Auth Mechanism | Data Format | §AD Source |
|-------------|-----------------|----------------|-------------|------------|
| {Service name} | {Version} | {e.g., JWT, API Key} | {e.g., JSON, REST} | {§AD-NN} |

---

## Section 7: Anti-Failure (Tool Validation) Rules (REQUIRED)

| Rule ID | Tool / Gate | Trigger | Threshold / Requirement | §AD Source |
|---------|-------------|---------|------------------------|------------|
| TVR-{APP}-001 | {e.g., ESLint} | Every PR | {e.g., 0 errors} | {§AD-NN or "N/A"} |
| TVR-{APP}-002 | {e.g., TypeScript strict} | Every build | {e.g., 0 type errors} | {§AD-NN} |
| TVR-{APP}-003 | {e.g., Test coverage} | Pre-deployment | {e.g., ≥80% line coverage} | {§AD-NN} |

---

## Section 8: TRS-to-Architecture Mapping (REQUIRED)

| TR ID | Technical Requirement | Architecture Component(s) That Address It | Status |
|-------|----------------------|------------------------------------------|--------|
| TR-{APP}-001 | {Title} | {Architecture section/component} | Mapped |

**Completeness Gate**: Every TR must be mapped to at least one architecture component. Architecture MUST NOT commence until this mapping is complete and verified.

---

## Section 9: Open Issues and Risks (REQUIRED)

| Issue ID | Description | §AD Relevance | Owner | Resolution Date |
|----------|-------------|---------------|-------|-----------------|
| {ISSUE-001} | {Description of open issue} | {§AD-NN or "None"} | {Owner} | {Date or "Open"} |

**Open Issue Gate**: No TR marked as `Approved` may have an unresolved blocking issue.

---

## Section 10: Approval and Sign-Off (REQUIRED)

### Completeness Checklist

- [ ] Derivation statement references specific FRS file and version (Section 0)
- [ ] Technology Stack section (§AD-03) completed and aligned with App Description §7
- [ ] Schema-to-Hook Validation section (§AD-10) completed or N/A with justification
- [ ] Table Pathway Audit section (§AD-11) completed or N/A with justification
- [ ] RLS Audit Gate section (§AD-12) completed or N/A with justification
- [ ] Edge Function Registry section (§AD-15) completed or N/A with justification
- [ ] Secret Naming Convention section (§AD-17) completed or N/A with justification
- [ ] Shared State Architecture section (§AD-20) completed or N/A with justification
- [ ] Audit Log Design section (§AD-22) completed or N/A with justification
- [ ] State Persistence Specification section (§AD-24) completed or N/A with justification
- [ ] FRS-to-TRS Traceability Matrix complete — no orphan TRs
- [ ] No TRs contain "TBD" or placeholder content
- [ ] Performance requirements defined
- [ ] Integration requirements defined
- [ ] Tool validation rules defined
- [ ] TRS-to-Architecture mapping complete

### TRS Approval

**Approval Required From**:
- [ ] Foreman (FM) — TRS complete and correct
- [ ] Governance Administrator — Governance compliance validated
- [ ] Johan (or delegated authority) — Final approval

**Approval Date**: {DATE}  
**Approved By**: {APPROVER}

**Status After Approval**: `Approved` → Ready for Architecture Compilation stage

---

## Section 11: Change History (REQUIRED)

| Version | Date | Change Description | Changed By | Approval |
|---------|------|-------------------|------------|----------|
| {VERSION} | {DATE} | {Description} | {Person} | {Approver} |

**Supersedes**: {Previous version if any}  
**Superseded By**: {New version if superseded}

---

**End of TRS Document**

---

**Document Metadata**:
- TRS ID: {APP}_TRS_{VERSION}
- Required By: `APP_DESCRIPTION_REQUIREMENT_POLICY.md` v2.0, `governance/strategy/MODULE_LIFECYCLE_AND_REPO_STRUCTURE_STRATEGY.md`
- Enforcement: BUILD_AUTHORIZATION_GATE, Governance Administrator
- Template Version: v1.0
- Template Location: `governance/templates/TRS_TEMPLATE.md`
