# IAA Pre-Brief — Wave 14 Batch B
# Evidence Interaction, AI Evaluation Triggers, Results Table & Report Generation (Issue #909)

**Status**: ACTIVE — PRE-BRIEF ISSUED — IMPLEMENTATION NOT YET STARTED
**Wave**: Wave 14 Batch B
**Issue**: #909 (CS2 direct — @APGI-cmy)
**Branch**: `copilot/implement-evidence-interaction-model`
**Foreman Session**: session-141
**Pre-Brief Date**: 2026-03-05
**IAA Session (Pre-Brief)**: IAA-PREBRIEF-W14-BATCHB-20260305
**Authority**: CS2 (Johan Ras / @APGI-cmy)
**Depends On**: Wave 14 Batch A (branch: `copilot/implement-onboarding-and-assignment`, Pre-Brief: `.agent-admin/assurance/iaa-prebrief-wave14-batchA.md`)

> **POLC CONTEXT**: This Pre-Brief is generated BEFORE implementation begins per the IAA
> Pre-Brief gate declared in `wave-current-tasks.md`:
> "IAA Pre-Brief MUST exist at `.agent-admin/assurance/iaa-prebrief-wave14-batchB.md`
> before ANY builder task is delegated."
> This is a PROSPECTIVE Pre-Brief. All Phase 2–4 assurance audit work will be performed
> at HANDOVER time, against the completed deliverables. The STOP-AND-FIX mandate is
> FULLY ACTIVE at handover.

---

## Step 0.2 — Wave Context (from wave-current-tasks.md)

**Wave number**: Wave 14 Batch B (implementation phase)
**Wave scope**: Evidence Interaction, AI Evaluation Triggers, Audit Results Table, Dashboard
  Metrics, and Report Generation — Subwaves 14.5 through 14.11
**Source authority**: `modules/mat/00-app-description/MAT_UX_WORKFLOW_AND_WIRING.md` v1.0
**FRS coverage**: FR-093 through FR-099
**TRS coverage**: TR-093 through TR-099
**GAP coverage**: GAP-W05, GAP-W06, GAP-W07, GAP-W08, GAP-W09, GAP-W10, GAP-W11

**Producing builders**:
- `schema-builder` — TASK-W14-BB-001, TASK-W14-BB-003, TASK-W14-BB-009 (3 SQL migrations)
- `ui-builder` — TASK-W14-BB-002, TASK-W14-BB-004, TASK-W14-BB-005, TASK-W14-BB-006,
  TASK-W14-BB-007, TASK-W14-BB-008 (6 components / pages)

**RED gate tests**: T-W14-UX-005 through T-W14-UX-011 (7 tests — MUST stay RED until
  migrations and components are delivered, then turn GREEN)

---

## Step 0.3 — Task Classification

All nine tasks are **QUALIFYING**. Classification rationale:

| Task ID | Classification | Reason |
|---------|---------------|--------|
| TASK-W14-BB-001 | QUALIFYING — AAWP_MAT | Schema migration delivering executable DB behaviour (evidence table column evolution + CHECK constraint) |
| TASK-W14-BB-002 | QUALIFYING — AAWP_MAT | Frontend component delivering executable UX behaviour (EvidenceUploadPanel with 6 evidence types + storage wiring) |
| TASK-W14-BB-003 | QUALIFYING — AAWP_MAT | Schema migration delivering executable DB behaviour (criteria_evaluations + evaluation_overrides tables + RLS) |
| TASK-W14-BB-004 | QUALIFYING — AAWP_MAT | Frontend component delivering executable UX behaviour (CriteriaCard with AI guidance surfaces) |
| TASK-W14-BB-005 | QUALIFYING — AAWP_MAT | Frontend component update delivering executable UX behaviour (EmbeddedAIAssistant contextPayload injection) |
| TASK-W14-BB-006 | QUALIFYING — AAWP_MAT | Frontend component delivering executable UX behaviour (AuditResultsTable with full domain→MPS→criteria chain) |
| TASK-W14-BB-007 | QUALIFYING — AAWP_MAT | Page update delivering executable UX behaviour (AuditManagementPage Results tab) |
| TASK-W14-BB-008 | QUALIFYING — AAWP_MAT | Page update delivering executable UX behaviour (DashboardPage metrics + Create Report gate) |
| TASK-W14-BB-009 | QUALIFYING — AAWP_MAT | Schema migration delivering executable DB behaviour (audit_reports table + storage bucket + RLS) |

**Non-qualifying tasks this wave**: None. All nine tasks are build deliverables.

---

## Step 0.4 — Per-Task Pre-Brief Declarations

---

### TASK-W14-BB-001
**File**: `apps/maturion-maturity-legacy/supabase/migrations/20260305000003_wave14_evidence_schema.sql`
**Builder**: schema-builder
**Gap / FR / TR**: GAP-W05 / FR-093 / TR-093
**Subwave**: 14.5 — Evidence Card Interaction Model

#### iaa_trigger_category
`AAWP_MAT` — Supabase schema migration evolving the `evidence` table to support the
full evidence interaction model: soft-delete, findings text capture, and storage path tracking.

#### task_summary
ALTERs the existing `evidence` table: adds `findings_text TEXT`, `deleted BOOLEAN NOT NULL
DEFAULT false`, and `storage_path TEXT` columns; DROPs the existing `type` CHECK constraint;
ADDs a new `type` CHECK constraint that includes `'file'` and `'voice'` types (in addition to
any pre-existing valid types). Intended to enable the EvidenceUploadPanel (TASK-W14-BB-002) to
record all six evidence types and support soft-delete and storage path lookup.

#### required_phases
- **Phase 2** (Alignment): PR category classification, trigger table application
- **Phase 3** (Assurance work): Full BD-TIER-1 through BD-TIER-6 overlay execution plus
  task-specific rules below
- **Phase 3.1** (FAIL-ONLY-ONCE): Apply A-001 and A-002; apply migration-specific rules
- **Phase 4** (Merge gate parity + verdict)

#### required_evidence_artifacts
| Artifact | Location | Required For |
|---------|----------|-------------|
| PREHANDOVER proof | PR bundle root | CERT-001, CORE-016 |
| Session memory (schema-builder) | `.agent-workspace/schema-builder/memory/` | CERT-002 |
| IAA invocation evidence | PREHANDOVER proof `iaa_audit_token` field | CORE-013 |
| Migration file present | `apps/maturion-maturity-legacy/supabase/migrations/20260305000003_wave14_evidence_schema.sql` | BD-001 |
| Test T-W14-UX-005 GREEN | CI output or test run log | BD-011 |

#### applicable_overlays
- **Universal Ceremony Gate** (CERT-001 through CERT-004)
- **BUILD_DELIVERABLE Overlay** — BD-TIER-1 through BD-TIER-6

#### specific_rules

| Rule ID | Rule | Rationale |
|---------|------|-----------|
| W14-BB-001-R01 | Verify migration idempotency: use `IF NOT EXISTS` for new columns and `IF EXISTS` for DROP/ADD on CHECK constraints. The migration must be safe to re-run without error. | BD-003 — one-time build safety; idempotency is a hard requirement for Supabase migrations. |
| W14-BB-001-R02 | Verify the new `type` CHECK constraint preserves ALL previously valid type values (e.g., `'document'`, `'link'`, `'image'`, or whatever existed) PLUS adds `'file'` and `'voice'`. IAA must confirm no previously valid type is silently excluded by the replacement CHECK. Dropping the old CHECK and replacing with a narrower set would break existing evidence rows. | BD-003, BD-008 — relational integrity; existing data must satisfy the new constraint. |
| W14-BB-001-R03 | Verify `deleted BOOLEAN NOT NULL DEFAULT false` is correct: the `NOT NULL` with a `DEFAULT` means existing rows will be backfilled to `false`. Confirm this is the intended behaviour (it is correct — no row should start as deleted). | BD-003 — functional correctness; confirm no data migration risk. |
| W14-BB-001-R04 | Verify `storage_path TEXT` is nullable (no NOT NULL constraint) since existing evidence rows will have no storage path. If it is declared NOT NULL without a DEFAULT, the migration will fail on a populated table. | BD-003 — migration safety; adding NOT NULL to a populated table without a DEFAULT is a runtime failure. |
| W14-BB-001-R05 | Verify that the storage path format expected by TASK-W14-BB-002 (`${organisationId}/${auditId}/criteria/${criterionId}/`) is reflected in any CHECK or application-layer constraint on `storage_path`, OR confirm that path format is enforced at the application layer (in EvidenceUploadPanel) and not at DB level. IAA must confirm one or the other is present — silent path divergence between schema and UI = BD-005 wiring failure. | BD-005, BD-022 — end-to-end wiring; storage path must be consistent across migration and component. |
| W14-BB-001-R06 | Verify test T-W14-UX-005 (file: `evidence-upload-panel.test.ts`) turns GREEN after this migration lands. IAA must see evidence of GREEN test run. | BD-011 — zero test failures. |

---

### TASK-W14-BB-002
**File**: `modules/mat/frontend/src/components/evidence/EvidenceUploadPanel.tsx`
**Builder**: ui-builder
**Gap / FR / TR**: GAP-W05 / FR-093 / TR-093
**Subwave**: 14.5 — Evidence Card Interaction Model

#### iaa_trigger_category
`AAWP_MAT` — React frontend component delivering the six-type evidence upload interface
with Remove/Replace tile actions and org-scoped storage path construction.

#### task_summary
Creates a new `EvidenceUploadPanel` component that renders six evidence type upload tiles
(document, link, image, file, voice, and one more per FRS), Remove/Replace actions per tile,
and constructs the Supabase storage path as
`${organisationId}/${auditId}/criteria/${criterionId}/` when uploading evidence.
This component is the primary UI surface for the evidence interaction model (GAP-W05).

#### required_phases
- **Phase 2** (Alignment): PR category classification
- **Phase 3** (Assurance work): Full BD-TIER-1 through BD-TIER-6 overlay
- **Phase 4** (Merge gate parity + verdict)

#### required_evidence_artifacts
| Artifact | Location | Required For |
|---------|----------|-------------|
| PREHANDOVER proof | PR bundle root | CERT-001 |
| Session memory (ui-builder) | `.agent-workspace/ui-builder/memory/` | CERT-002 |
| Component file present | `modules/mat/frontend/src/components/evidence/EvidenceUploadPanel.tsx` | BD-001 |
| Test T-W14-UX-005 GREEN | CI output or test run log | BD-011 |

#### applicable_overlays
- **Universal Ceremony Gate** (CERT-001 through CERT-004)
- **BUILD_DELIVERABLE Overlay** — BD-TIER-1 through BD-TIER-6

#### specific_rules

| Rule ID | Rule | Rationale |
|---------|------|-----------|
| W14-BB-002-R01 | Verify all 6 evidence type tiles are rendered and individually wired: each type must trigger a different upload path or handler. A single generic handler serving all types without distinguishing them is a functional stub. | BD-002, BD-003 — no stubs in production paths. |
| W14-BB-002-R02 | Verify storage path construction is exactly `${organisationId}/${auditId}/criteria/${criterionId}/` — matching the storage RLS path guard from the postbuild-fixes-03 wave. A path that does not include `organisationId` as the first segment WILL be blocked by the existing storage policy `split_part(name,'/',1) = organisation_id`. | BD-005 — end-to-end wiring; storage path must match RLS policy. BD-022 — architecture alignment. |
| W14-BB-002-R03 | Verify that `organisationId`, `auditId`, and `criterionId` are sourced from authenticated session/context — not from a prop that could be spoofed or missing. IAA must confirm the component fetches or receives these values safely. | BD-007, BD-017 — auth guard + input validation. |
| W14-BB-002-R04 | Verify Remove/Replace tile actions: Remove must set `deleted = true` on the evidence row (soft-delete per TASK-W14-BB-001); Replace must upload a new file and update the existing evidence row's `storage_path`. Neither action should hard-delete rows. | BD-003, BD-008 — functional correctness; soft-delete is the declared architecture. |
| W14-BB-002-R05 | Verify `data-testid` attributes are present on all interactive elements required by T-W14-UX-005: at minimum, one testid per evidence type tile plus the remove/replace controls. If T-W14-UX-005 asserts on `data-testid` selectors that are missing from the component, the test will fail. IAA must cross-reference test assertions against component markup. | BD-011, BD-013 — test coverage must assert on real behaviour. |
| W14-BB-002-R06 | Verify the component is exported and registered for consumption by AuditManagementPage or CriteriaCard — it must not be an orphaned file. | BD-010 — no orphaned deliverables. |

---

### TASK-W14-BB-003
**File**: `apps/maturion-maturity-legacy/supabase/migrations/20260305000004_wave14_evaluations.sql`
**Builder**: schema-builder
**Gap / FR / TR**: GAP-W06 / FR-094 / TR-094
**Subwave**: 14.6 — Submit Button as AI Evaluation Trigger

#### iaa_trigger_category
`AAWP_MAT` — Supabase schema migration creating the AI evaluation persistence layer:
`criteria_evaluations` and `evaluation_overrides` tables with org-isolation RLS.

#### task_summary
Creates `criteria_evaluations` table with fields: `proposed_level`, `confidence_score`,
`rationale`, `findings_summary`, `next_level_guidance`, `next_plus_one_taster`, `status`
(CHECK: `pending_review` / `confirmed` / `overridden`), `evaluated_by`. Creates
`evaluation_overrides` table with `justification NOT NULL`. Applies RLS org-isolation
on both tables. This is the data persistence layer for the AI evaluation loop
(GAP-W06/W07 — consumed by CriteriaCard and DashboardPage).

#### required_phases
- **Phase 2** (Alignment): PR category classification
- **Phase 3** (Assurance work): Full BD-TIER-1 through BD-TIER-6 overlay
- **Phase 4** (Merge gate parity + verdict)

#### required_evidence_artifacts
| Artifact | Location | Required For |
|---------|----------|-------------|
| PREHANDOVER proof | PR bundle root | CERT-001 |
| Session memory (schema-builder) | `.agent-workspace/schema-builder/memory/` | CERT-002 |
| Migration file present | `apps/maturion-maturity-legacy/supabase/migrations/20260305000004_wave14_evaluations.sql` | BD-001 |
| Test T-W14-UX-006 GREEN | CI output or test run log | BD-011 |

#### applicable_overlays
- **Universal Ceremony Gate** (CERT-001 through CERT-004)
- **BUILD_DELIVERABLE Overlay** — BD-TIER-1 through BD-TIER-6

#### specific_rules

| Rule ID | Rule | Rationale |
|---------|------|-----------|
| W14-BB-003-R01 | Verify `criteria_evaluations` FK chain: the table must have a FK to `criteria` (or to an `(audit_id, criterion_id)` pair) to establish which criterion the evaluation belongs to. An orphaned evaluation with no FK to the criteria hierarchy is a relational integrity failure. | BD-008 — FK and relational integrity. |
| W14-BB-003-R02 | Verify `evaluation_overrides` FK to `criteria_evaluations`: the overrides table must have a FK referencing `criteria_evaluations.id`. Without this FK, overrides are disconnected from their evaluations and cannot be reliably queried. | BD-008 — relational integrity. |
| W14-BB-003-R03 | Verify `status` CHECK constraint on `criteria_evaluations` covers exactly: `'pending_review'`, `'confirmed'`, `'overridden'` — and no other values. The DashboardPage gate (TASK-W14-BB-008) depends on filtering by `'confirmed'` and `'overridden'`. Any divergence in status values will silently break the Create Report gate. | BD-003, BD-005 — functional correctness; status values are cross-component contract. |
| W14-BB-003-R04 | Verify `evaluation_overrides.justification` is `NOT NULL` — this is a hard architectural requirement (a user override without a justification is not a valid audit trail). If the schema builder makes it nullable, IAA must fail this check. | BD-022 — architecture alignment. |
| W14-BB-003-R05 | Verify RLS completeness for BOTH tables: `criteria_evaluations` and `evaluation_overrides` must each have SELECT, INSERT, UPDATE, and DELETE policies (or an explicit decision that some operations are not permitted, documented). The AI evaluation trigger will INSERT rows; confirmed/overridden updates require UPDATE; audit trail requires SELECT. Missing any of these policies = functional blocker. | BD-015 — RLS policies complete. |
| W14-BB-003-R06 | Verify migration idempotency: `CREATE TABLE IF NOT EXISTS` for both tables; all policies use `CREATE POLICY IF NOT EXISTS` or guarded equivalently. | BD-003 — migration safety. |
| W14-BB-003-R07 | Verify test T-W14-UX-006 (file: `ai-evaluation-trigger.test.ts`) turns GREEN after this migration lands. IAA must see evidence of GREEN test run. | BD-011 — zero test failures. |

---

### TASK-W14-BB-004
**File**: `modules/mat/frontend/src/components/criteria/CriteriaCard.tsx`
**Builder**: ui-builder
**Gap / FR / TR**: GAP-W07 / FR-095 / TR-095
**Subwave**: 14.7 — AI Next-Level Guidance Surface

#### iaa_trigger_category
`AAWP_MAT` — React frontend component surfacing AI evaluation results on each criteria card:
proposed level badge, next-level guidance, next-plus-one taster, and "Explore further levels" link.

#### task_summary
Creates `CriteriaCard` component that renders: a `proposed_level` badge (from
`criteria_evaluations`), a "What to improve" section from `next_level_guidance`, a "Where
you're heading" section from `next_plus_one_taster`, and an "Explore further levels" link.
Must handle the case where no evaluation exists yet (null-safe rendering). Passes
`contextPayload` to `EmbeddedAIAssistant` (TASK-W14-BB-005) when AI chat is opened.

#### required_phases
- **Phase 2** (Alignment): PR category classification
- **Phase 3** (Assurance work): Full BD-TIER-1 through BD-TIER-6 overlay
- **Phase 4** (Merge gate parity + verdict)

#### required_evidence_artifacts
| Artifact | Location | Required For |
|---------|----------|-------------|
| PREHANDOVER proof | PR bundle root | CERT-001 |
| Session memory (ui-builder) | `.agent-workspace/ui-builder/memory/` | CERT-002 |
| Component file present | `modules/mat/frontend/src/components/criteria/CriteriaCard.tsx` | BD-001 |
| Test T-W14-UX-007 GREEN | CI output or test run log | BD-011 |

#### applicable_overlays
- **Universal Ceremony Gate** (CERT-001 through CERT-004)
- **BUILD_DELIVERABLE Overlay** — BD-TIER-1 through BD-TIER-6

#### specific_rules

| Rule ID | Rule | Rationale |
|---------|------|-----------|
| W14-BB-004-R01 | Verify null-safe rendering: when no `criteria_evaluations` row exists for the criterion, the component must render gracefully (no crash, no empty fragment without user-visible indication). The proposed_level badge, guidance sections, and link must either be hidden or show a placeholder. A component that crashes on null evaluation data is not production-safe. | BD-003 — one-time build compliance. |
| W14-BB-004-R02 | Verify that `criteria_evaluations` data is fetched via a hook (not a direct Supabase call inside the component). Direct Supabase calls in components violate the codebase's hook-based data access pattern established in prior waves. | BD-022 — architecture alignment. |
| W14-BB-004-R03 | Verify `contextPayload` construction and passing: when the user opens AI chat from this component, `contextPayload` must contain `{ criteria_name, current_level, next_level_guidance }` — all three fields. Missing any field means `EmbeddedAIAssistant` (TASK-W14-BB-005) will render without the AI context indicator, silently degrading the feature. | BD-005 — FFA-02 wiring verification: CriteriaCard → EmbeddedAIAssistant contextPayload chain. |
| W14-BB-004-R04 | Verify "Explore further levels" link has a valid `href` or `onClick` — it must not be a dead link (`href="#"`) or a no-op button with no handler. A non-functional link in a production component is a stub violation. | BD-002 — no stubs in production paths. |
| W14-BB-004-R05 | Verify `data-testid` attributes are present for T-W14-UX-007 assertions: at minimum `proposed-level-badge`, `next-level-guidance`, `next-plus-one-taster`, and `explore-further-link` (or equivalent testids expected by the test file). IAA must cross-reference with the test file. | BD-011, BD-013 — test coverage. |

---

### TASK-W14-BB-005
**File**: `modules/mat/frontend/src/components/common/EmbeddedAIAssistant.tsx` (UPDATE)
**Builder**: ui-builder
**Gap / FR / TR**: GAP-W08 / FR-096 / TR-096
**Subwave**: 14.8 — AI Chat Context Injection

#### iaa_trigger_category
`AAWP_MAT` — React component update adding the `contextPayload` prop to enable criteria-aware
AI assistant sessions, with `data-testid="ai-context-indicator"` when context is active.

#### task_summary
Updates existing `EmbeddedAIAssistant` component to accept an optional `contextPayload` prop
of shape `{ criteria_name: string, current_level: string, next_level_guidance: string }`.
When `contextPayload` is provided, it is used in the AI session initialisation (injected into
the system context or first message). Renders `data-testid="ai-context-indicator"` element
when `contextPayload` is set. Existing usages of `EmbeddedAIAssistant` without `contextPayload`
must continue to work unchanged (prop is optional).

#### required_phases
- **Phase 2** (Alignment): PR category classification
- **Phase 3** (Assurance work): Full BD-TIER-1 through BD-TIER-6 overlay
- **Phase 4** (Merge gate parity + verdict)

#### required_evidence_artifacts
| Artifact | Location | Required For |
|---------|----------|-------------|
| PREHANDOVER proof | PR bundle root | CERT-001 |
| Session memory (ui-builder) | `.agent-workspace/ui-builder/memory/` | CERT-002 |
| Updated component file present | `modules/mat/frontend/src/components/common/EmbeddedAIAssistant.tsx` | BD-001 |
| Test T-W14-UX-008 GREEN | CI output or test run log | BD-011 |

#### applicable_overlays
- **Universal Ceremony Gate** (CERT-001 through CERT-004)
- **BUILD_DELIVERABLE Overlay** — BD-TIER-1 through BD-TIER-6

#### specific_rules

| Rule ID | Rule | Rationale |
|---------|------|-----------|
| W14-BB-005-R01 | Verify `contextPayload` is declared as an **optional** prop (TypeScript: `contextPayload?: { criteria_name: string; current_level: string; next_level_guidance: string }`). A required prop would break all existing call sites that do not pass it. IAA must check every existing usage of `EmbeddedAIAssistant` in the codebase for potential breakage. | BD-009 — cross-component integration fit; backward compatibility. |
| W14-BB-005-R02 | Verify `contextPayload` is used in the AI session initialisation — not just stored as state. If the prop is accepted but not passed to the AI session init call, the feature silently does nothing. IAA must trace from the prop declaration to the session init invocation. | BD-002, BD-003 — no stubs; one-time build compliance. |
| W14-BB-005-R03 | Verify `data-testid="ai-context-indicator"` renders **only when** `contextPayload` is defined and non-null. It must NOT render when contextPayload is absent (this would make T-W14-UX-008 assertions vacuously pass regardless of wiring). | BD-013 — no test dodging. |
| W14-BB-005-R04 | Verify all three contextPayload fields (`criteria_name`, `current_level`, `next_level_guidance`) are included in the AI session context injection. A partial injection (e.g., only `criteria_name`) means the AI assistant does not receive the full context needed for meaningful guidance. | BD-003 — FFA-02 wiring: contextPayload fields must fully flow through. |
| W14-BB-005-R05 | Verify no regression in existing EmbeddedAIAssistant functionality: the base AI chat must still open and function normally when `contextPayload` is undefined. IAA must check that no existing test for EmbeddedAIAssistant breaks after this change. | BD-004, BD-009 — no regression. |

---

### TASK-W14-BB-006
**File**: `modules/mat/frontend/src/components/audit/AuditResultsTable.tsx`
**Builder**: ui-builder
**Gap / FR / TR**: GAP-W09 / FR-097 / TR-097
**Subwave**: 14.9 — Audit Results Table

#### iaa_trigger_category
`AAWP_MAT` — React frontend component delivering the full audit results table with domain→MPS→
criteria hierarchy display, findings summary, AI-proposed rating, recommendations, excluded
criteria labelling, and sort/filter capability.

#### task_summary
Creates `AuditResultsTable` component rendering a table with columns: Domain, MPS (Management
Practices Scope), Criteria, Findings Summary, Rating (from `criteria_evaluations.proposed_level`
or confirmed level), Recommendations. Excluded criteria (from `excluded_columns` or
`criteria_evaluations.status = 'overridden'` with exclusion justification) show an "Excluded"
label in the Rating column. Table must be sortable and filterable. Consumed by
`AuditManagementPage` Results tab (TASK-W14-BB-007).

#### required_phases
- **Phase 2** (Alignment): PR category classification
- **Phase 3** (Assurance work): Full BD-TIER-1 through BD-TIER-6 overlay
- **Phase 4** (Merge gate parity + verdict)

#### required_evidence_artifacts
| Artifact | Location | Required For |
|---------|----------|-------------|
| PREHANDOVER proof | PR bundle root | CERT-001 |
| Session memory (ui-builder) | `.agent-workspace/ui-builder/memory/` | CERT-002 |
| Component file present | `modules/mat/frontend/src/components/audit/AuditResultsTable.tsx` | BD-001 |
| Test T-W14-UX-009 GREEN | CI output or test run log | BD-011 |

#### applicable_overlays
- **Universal Ceremony Gate** (CERT-001 through CERT-004)
- **BUILD_DELIVERABLE Overlay** — BD-TIER-1 through BD-TIER-6

#### specific_rules

| Rule ID | Rule | Rationale |
|---------|------|-----------|
| W14-BB-006-R01 | Verify all six columns are present and populated from the correct data sources: Domain (from domains table), MPS (from mps table), Criteria (from criteria table), Findings Summary (from `criteria_evaluations.findings_summary`), Rating (from `criteria_evaluations.proposed_level` or override status), Recommendations (from `criteria_evaluations.next_level_guidance` or a dedicated field). IAA must verify each column's data source explicitly — no placeholder or static values. | BD-002, BD-003 — no stubs; one-time build compliance. |
| W14-BB-006-R02 | Verify "Excluded" label logic: the component must correctly identify excluded criteria and render the "Excluded" label in place of a rating. IAA must confirm which data source determines exclusion — either the `excluded_columns` table (from TASK-W14-B-003/Wave 14 Batch A) or `evaluation_overrides` with a specific justification pattern. The source must be consistent with what DashboardPage (TASK-W14-BB-008) uses for the Excluded count. | BD-005, BD-009 — FFA-02 wiring: excluded criteria definition must be consistent across AuditResultsTable and DashboardPage. |
| W14-BB-006-R03 | Verify sort functionality is implemented (not a stub or TODO): at minimum, sortable by Domain, Rating, and Criteria columns. A "sortable" comment without actual sort handlers = stub violation. | BD-002, BD-003 — no stubs. |
| W14-BB-006-R04 | Verify filter functionality is implemented: at minimum, a text filter for Criteria name and a status/rating filter. A filter input that does not filter rows = stub violation. | BD-002, BD-003 — no stubs. |
| W14-BB-006-R05 | Verify data is fetched via a dedicated hook (e.g., `useAuditResults` or similar) — not via direct Supabase calls inside the component. The hook must JOIN across `criteria_evaluations`, `criteria`, `domains`, and `mps` to build the full row data. A partial JOIN (e.g., only criteria_evaluations without the hierarchy) will produce a table with missing domain/MPS data. | BD-022 — architecture alignment; BD-005 — wiring verification. |
| W14-BB-006-R06 | Verify the component is exported and consumed by `AuditManagementPage` (TASK-W14-BB-007). An orphaned table component with no consumer = BD-010 failure. | BD-010 — no orphaned deliverables. |

---

### TASK-W14-BB-007
**File**: `modules/mat/frontend/src/pages/AuditManagementPage.tsx` (UPDATE)
**Builder**: ui-builder
**Gap / FR / TR**: GAP-W09 / FR-097 / TR-097
**Subwave**: 14.9 — Audit Results Table

#### iaa_trigger_category
`AAWP_MAT` — Page-level update adding the Results tab to `AuditManagementPage`, wiring
`AuditResultsTable` into the audit management workflow.

#### task_summary
Updates `AuditManagementPage` to add a new "Results" tab alongside the existing tabs.
The Results tab renders `AuditResultsTable` scoped to the current audit's data. Existing
tabs (e.g., Overview, Criteria assignment) must not be broken by this addition.

#### required_phases
- **Phase 2** (Alignment): PR category classification
- **Phase 3** (Assurance work): Full BD-TIER-1 through BD-TIER-6 overlay
- **Phase 4** (Merge gate parity + verdict)

#### required_evidence_artifacts
| Artifact | Location | Required For |
|---------|----------|-------------|
| PREHANDOVER proof | PR bundle root | CERT-001 |
| Session memory (ui-builder) | `.agent-workspace/ui-builder/memory/` | CERT-002 |
| Updated page file present | `modules/mat/frontend/src/pages/AuditManagementPage.tsx` | BD-001 |
| Test T-W14-UX-009 GREEN | CI output or test run log | BD-011 |

#### applicable_overlays
- **Universal Ceremony Gate** (CERT-001 through CERT-004)
- **BUILD_DELIVERABLE Overlay** — BD-TIER-1 through BD-TIER-6

#### specific_rules

| Rule ID | Rule | Rationale |
|---------|------|-----------|
| W14-BB-007-R01 | Verify no regression on existing tabs: the addition of the Results tab must not alter the routing, rendering, or state management of existing `AuditManagementPage` tabs. IAA must check that existing tab tests (if any) still pass. | BD-004, BD-009 — no regression; cross-component integration fit. |
| W14-BB-007-R02 | Verify the Results tab renders `AuditResultsTable` with the correct `auditId` prop scoped to the currently selected audit. A Results tab that renders the table without scoping to the current audit will show cross-audit data or empty data — both are silent functional failures. | BD-005 — end-to-end wiring: auditId must flow from page context to AuditResultsTable. |
| W14-BB-007-R03 | Verify `data-testid="results-tab"` (or equivalent expected by T-W14-UX-009) is present on the Results tab button/panel for test assertions. | BD-011, BD-013 — test coverage. |

---

### TASK-W14-BB-008
**File**: `modules/mat/frontend/src/pages/DashboardPage.tsx` (UPDATE)
**Builder**: ui-builder
**Gap / FR / TR**: GAP-W10 / FR-098 / TR-098
**Subwave**: 14.10 — Dashboard Outstanding Work Drill-Down and Create Report Gate

#### iaa_trigger_category
`AAWP_MAT` — Page-level update adding Submitted/Outstanding/Excluded metrics and wiring the
Create Report gate to the `criteria_evaluations` status data and `audit_reports` table.

#### task_summary
Updates `DashboardPage` to add three metrics: Submitted (criteria_evaluations with status
`'confirmed'` or `'overridden'`), Outstanding (criteria not yet evaluated or at
`'pending_review'`), Excluded (criteria in the exclusion set). Wires the Create Report button
to be enabled ONLY when Outstanding count = 0 (all criteria evaluated). The Create Report
button triggers insertion into the `audit_reports` table (TASK-W14-BB-009) with initial
status `'generating'`.

#### required_phases
- **Phase 2** (Alignment): PR category classification
- **Phase 3** (Assurance work): Full BD-TIER-1 through BD-TIER-6 overlay
- **Phase 4** (Merge gate parity + verdict)

#### required_evidence_artifacts
| Artifact | Location | Required For |
|---------|----------|-------------|
| PREHANDOVER proof | PR bundle root | CERT-001 |
| Session memory (ui-builder) | `.agent-workspace/ui-builder/memory/` | CERT-002 |
| Updated page file present | `modules/mat/frontend/src/pages/DashboardPage.tsx` | BD-001 |
| Test T-W14-UX-010 GREEN | CI output or test run log | BD-011 |

#### applicable_overlays
- **Universal Ceremony Gate** (CERT-001 through CERT-004)
- **BUILD_DELIVERABLE Overlay** — BD-TIER-1 through BD-TIER-6

#### specific_rules

| Rule ID | Rule | Rationale |
|---------|------|-----------|
| W14-BB-008-R01 | Verify Submitted metric counts `criteria_evaluations` rows with `status IN ('confirmed', 'overridden')` — exactly these two statuses, consistent with TASK-W14-BB-003's CHECK constraint. If the metric uses a different filter expression, it will silently produce wrong counts. | BD-005 — FFA-02 wiring: status values must be consistent across migration and page. |
| W14-BB-008-R02 | Verify Outstanding metric correctly identifies criteria that have NOT been fully evaluated: either no `criteria_evaluations` row exists for the criterion, or the row has status `'pending_review'`. IAA must confirm the query handles the case where a criterion has no evaluation row at all (LEFT JOIN or equivalent). A COUNT that only looks at `criteria_evaluations` rows will miss criteria with no row. | BD-003, BD-005 — functional correctness; outstanding count must be accurate for the gate to work correctly. |
| W14-BB-008-R03 | Verify Excluded metric is consistent with `AuditResultsTable`'s "Excluded" label definition (W14-BB-006-R02). Both must draw from the same data source — if the dashboard counts excluded from `excluded_columns` but the table labels excluded from `evaluation_overrides`, the numbers will diverge and confuse users. | BD-005, BD-009 — FFA-02 wiring; consistent excluded criteria definition. |
| W14-BB-008-R04 | Verify Create Report gate is a hard disable: the Create Report button must be `disabled` (not just visually greyed) when Outstanding > 0. A button that is visually greyed but still clickable is a functional bug that permits premature report generation. | BD-003 — functional correctness; gate must be enforced, not cosmetic. |
| W14-BB-008-R05 | Verify Create Report button action: when clicked (with Outstanding = 0), must trigger an INSERT into `audit_reports` with `status = 'generating'`. IAA must confirm the handler exists and is wired to the `audit_reports` table — a button with no handler = stub. | BD-002, BD-005 — no stubs; FFA-02 wiring: DashboardPage Create Report → audit_reports INSERT. |
| W14-BB-008-R06 | Verify no regression on existing DashboardPage content. The three new metrics and Create Report gate must be additive — existing metrics, navigation, or audit list rendering must not be broken. | BD-004, BD-009 — no regression. |
| W14-BB-008-R07 | Verify test T-W14-UX-010 (file: `dashboard-create-report-gate.test.ts`) assertions are satisfied: the test file should assert on the three metric counts and the gate disable/enable state. IAA must cross-reference test assertions against actual component behaviour. | BD-011, BD-013 — zero test failures; no test dodging. |

---

### TASK-W14-BB-009
**File**: `apps/maturion-maturity-legacy/supabase/migrations/20260305000006_wave14_audit_reports.sql`
**Builder**: schema-builder
**Gap / FR / TR**: GAP-W11 / FR-099 / TR-099
**Subwave**: 14.11 — Create Report Button as Final AI Trigger

#### iaa_trigger_category
`AAWP_MAT` — Supabase schema migration creating the `audit_reports` table, registering the
`reports` storage bucket, and applying org-isolation RLS.

#### task_summary
Creates `audit_reports` table with `storage_path NOT NULL` and `status` CHECK constraint
covering `'generating'`, `'final'`, `'failed'`. Inserts a row into `storage.buckets` for
the `'reports'` bucket. Applies org-isolation SELECT RLS policy. This migration is the data
persistence layer for the final report generation feature (GAP-W11).

#### required_phases
- **Phase 2** (Alignment): PR category classification
- **Phase 3** (Assurance work): Full BD-TIER-1 through BD-TIER-6 overlay
- **Phase 4** (Merge gate parity + verdict)

#### required_evidence_artifacts
| Artifact | Location | Required For |
|---------|----------|-------------|
| PREHANDOVER proof | PR bundle root | CERT-001 |
| Session memory (schema-builder) | `.agent-workspace/schema-builder/memory/` | CERT-002 |
| Migration file present | `apps/maturion-maturity-legacy/supabase/migrations/20260305000006_wave14_audit_reports.sql` | BD-001 |
| Test T-W14-UX-011 GREEN | CI output or test run log | BD-011 |

#### applicable_overlays
- **Universal Ceremony Gate** (CERT-001 through CERT-004)
- **BUILD_DELIVERABLE Overlay** — BD-TIER-1 through BD-TIER-6

#### specific_rules

| Rule ID | Rule | Rationale |
|---------|------|-----------|
| W14-BB-009-R01 | Verify `audit_reports` has FK to `audits` table: a report must belong to an audit. An `audit_reports` table without a FK to `audits` allows orphaned report records and makes it impossible to scope report queries to the current audit. | BD-008 — relational integrity. |
| W14-BB-009-R02 | Verify `storage_path NOT NULL` constraint: the path where the generated report PDF/document will be stored must be declared at creation time. If this is `NOT NULL` without a DEFAULT, inserting with `status = 'generating'` (before the report is ready) requires passing a placeholder path or the migration needs to allow `storage_path` to be NULL initially and be updated when the report is ready. IAA must determine which approach the builder has taken and whether it is consistent with the DashboardPage Create Report handler (TASK-W14-BB-008-R05). A misalignment here will cause a runtime INSERT error when the button is clicked. | BD-003, BD-005 — functional correctness; wiring between Create Report INSERT and schema constraint. |
| W14-BB-009-R03 | Verify `status` CHECK covers exactly `'generating'`, `'final'`, `'failed'`. The DashboardPage must use `'generating'` as the initial status on Create Report click. If the status values diverge between migration and DashboardPage, the INSERT will fail with a CHECK violation at runtime. | BD-005 — FFA-02 wiring: status values must be consistent across migration and application layer. |
| W14-BB-009-R04 | Verify `INSERT INTO storage.buckets` for `'reports'` is idempotent: use `INSERT ... ON CONFLICT DO NOTHING` or `DO $$ BEGIN IF NOT EXISTS ... END $$`. A bare INSERT will fail if the bucket already exists (e.g., from a prior deployment or re-run). | BD-003 — migration safety; idempotency. |
| W14-BB-009-R05 | Verify RLS completeness: the task declaration says "org-isolation SELECT". IAA must check whether an INSERT policy is also required — the DashboardPage Create Report handler needs to INSERT a row into `audit_reports`. If only a SELECT policy exists, the INSERT from the application layer will be blocked by RLS. At minimum, an INSERT policy for authenticated org members must be declared alongside the SELECT policy. | BD-015 — RLS policies complete; missing INSERT policy = functional blocker. |
| W14-BB-009-R06 | Verify the `reports` storage bucket policy: the `storage.buckets` INSERT creates the bucket, but Supabase storage also requires an `objects` policy to control who can read/write to the bucket. If no storage objects policy is declared, authenticated users will be unable to store report files in the bucket. IAA must confirm either a storage policy is added in this migration or a reference is made to an existing catch-all storage policy that covers the `reports` bucket. | BD-015, BD-022 — RLS completeness; architecture alignment. |
| W14-BB-009-R07 | Verify migration idempotency: `CREATE TABLE IF NOT EXISTS`, policies use `CREATE POLICY IF NOT EXISTS`, bucket INSERT is conflict-safe. | BD-003 — migration safety. |
| W14-BB-009-R08 | Verify test T-W14-UX-011 (file: `create-report-generation.test.ts`) turns GREEN after this migration lands. IAA must see evidence of GREEN test run. | BD-011 — zero test failures. |

---

## Step 0.5 — FFA-01/FFA-02/FFA-04 Cross-Task Wiring Checks

The following cross-task wiring checks are mandatory at HANDOVER assurance time.
They span multiple tasks and must be verified as an integrated chain — not just per-task.

### FFA-01: Delivery Completeness (Cross-Task)

| Check | Expectation |
|-------|-------------|
| All 9 task files exist in the PR diff | 3 migration files + 6 component/page files — all 9 present |
| All 7 RED gate tests GREEN in CI | T-W14-UX-005 through T-W14-UX-011 all pass |
| No task was partially delivered (stub + TODO in production path) | Verified per-task per BD-002 |

### FFA-02: End-to-End Wiring Chain Verification

The following wiring chains must be traced and confirmed as complete at handover:

| Chain ID | Chain Description | Links |
|----------|------------------|-------|
| CHAIN-BB-01 | Evidence upload → DB persistence | `EvidenceUploadPanel` constructs storage path → uploads to Supabase Storage → INSERTs/UPDATEs `evidence.storage_path` + `evidence.type` (with new CHECK values) |
| CHAIN-BB-02 | Evidence soft-delete | `EvidenceUploadPanel` Remove tile → UPDATE `evidence.deleted = true` → UI hides/marks deleted evidence |
| CHAIN-BB-03 | AI evaluation persistence | Submit button → AI evaluation call → INSERT into `criteria_evaluations` (status: `pending_review`) → `CriteriaCard` re-renders with `proposed_level` badge + guidance |
| CHAIN-BB-04 | AI context injection | `CriteriaCard` opens AI chat → constructs `contextPayload` → passes to `EmbeddedAIAssistant` → `contextPayload` used in AI session init → `data-testid="ai-context-indicator"` present |
| CHAIN-BB-05 | Evaluation confirmation/override | User confirms or overrides evaluation → UPDATE `criteria_evaluations.status` to `'confirmed'` or `'overridden'` → `DashboardPage` Submitted count increments |
| CHAIN-BB-06 | Excluded criteria consistency | Excluded criteria are identified consistently by both `AuditResultsTable` ("Excluded" label) and `DashboardPage` (Excluded metric count) from the same data source |
| CHAIN-BB-07 | Create Report gate | `DashboardPage` Outstanding count = 0 → Create Report button enabled → onClick → INSERT `audit_reports` (status: `'generating'`, storage_path placeholder) → `audit_reports` table via migration |
| CHAIN-BB-08 | Audit Results display | `AuditManagementPage` Results tab → renders `AuditResultsTable` → fetches via hook → JOINs `criteria_evaluations` + `criteria` + `domains` + `mps` → displays complete domain→MPS→criteria hierarchy |

### FFA-04: Security (Cross-Task)

| Check | Required Evidence |
|-------|-----------------|
| `criteria_evaluations` RLS complete: SELECT + INSERT + UPDATE + DELETE for authenticated org members | See TASK-W14-BB-003-R05 |
| `evaluation_overrides` RLS complete: SELECT + INSERT for authenticated org members | See TASK-W14-BB-003-R05 |
| `audit_reports` RLS: SELECT present per task declaration; INSERT required per Create Report wiring | See TASK-W14-BB-009-R05 |
| `reports` storage bucket: objects policy required for read/write access | See TASK-W14-BB-009-R06 |
| `evidence` storage upload path: uses `${organisationId}/...` prefix enforced by RLS policy `split_part(name,'/',1) = organisation_id` | See TASK-W14-BB-002-R02 |
| No hardcoded secrets in any new file | BD-016 — IAA will scan diff for all 9 files |
| Auth guard on EvidenceUploadPanel upload operation | TASK-W14-BB-002-R03 |

---

## Step 0.6 — Canon Overlays Applicable to This Wave

| Overlay | Applies To | Why |
|---------|-----------|-----|
| **RLS Policy Standards** | TASK-W14-BB-003 (criteria_evaluations, evaluation_overrides), TASK-W14-BB-009 (audit_reports) | All new tables must have complete RLS. Cross-referenced against postbuild-fails-03 wave RLS standards. |
| **Migration Idempotency Standard** | TASK-W14-BB-001, TASK-W14-BB-003, TASK-W14-BB-009 | All three schema migrations must be idempotent per the established standard for maturion-isms migrations. |
| **Storage Path Convention** | TASK-W14-BB-001 (storage_path column), TASK-W14-BB-002 (upload path construction), TASK-W14-BB-009 (reports bucket) | Storage paths must follow the `${organisationId}/...` convention enforced by existing RLS hardening migration `20260303000005_audit_documents_rls_hardening.sql`. |
| **Hook-Based Data Access** | TASK-W14-BB-004, TASK-W14-BB-006, TASK-W14-BB-008 | Components must not contain direct Supabase calls — all data access must go through hooks. Established pattern in prior waves. |
| **POLC Boundary** | All tasks | Builders (schema-builder, ui-builder) must stay within their POLC boundaries. schema-builder delivers migrations only; ui-builder delivers components only. Neither builder may modify architecture documents, canon files, or governance artifacts. |
| **Zero Test Debt Standard** | All tasks | No `.skip()`, `.only()`, `test.todo()`, or commented-out tests in any new or modified test file. All 7 RED gate tests must be GREEN at handover. |

---

## Step 0.7 — Pre-Brief Summary

| Task | Builder | Classification | Phases | Primary Risk |
|------|---------|---------------|--------|-------------|
| TASK-W14-BB-001 | schema-builder | AAWP_MAT | 2, 3, 4 | CHECK constraint replacement must preserve existing types; storage_path NOT NULL safety |
| TASK-W14-BB-002 | ui-builder | AAWP_MAT | 2, 3, 4 | Storage path must match RLS policy; all 6 types must be wired; Remove = soft-delete |
| TASK-W14-BB-003 | schema-builder | AAWP_MAT | 2, 3, 4 | RLS completeness (all 4 policies); FK chain; status CHECK must match app layer exactly |
| TASK-W14-BB-004 | ui-builder | AAWP_MAT | 2, 3, 4 | Null-safe rendering; contextPayload chain to EmbeddedAIAssistant |
| TASK-W14-BB-005 | ui-builder | AAWP_MAT | 2, 3, 4 | contextPayload must be optional; all 3 fields must flow to AI session init |
| TASK-W14-BB-006 | ui-builder | AAWP_MAT | 2, 3, 4 | Excluded criteria definition must be consistent with DashboardPage; sort/filter must be real |
| TASK-W14-BB-007 | ui-builder | AAWP_MAT | 2, 3, 4 | Results tab must scope AuditResultsTable to current auditId; no existing tab regression |
| TASK-W14-BB-008 | ui-builder | AAWP_MAT | 2, 3, 4 | Create Report gate must be hard-disabled; Outstanding count LEFT JOIN accuracy; status values must match migration |
| TASK-W14-BB-009 | schema-builder | AAWP_MAT | 2, 3, 4 | storage_path NOT NULL vs generating status conflict; INSERT policy missing; bucket objects policy missing |

**Highest-risk items requiring IAA priority attention at handover**:
1. **TASK-W14-BB-009-R05** — `audit_reports` may only declare SELECT policy per task spec, but the Create Report INSERT requires an INSERT policy. This is a likely miss.
2. **TASK-W14-BB-009-R02** — `storage_path NOT NULL` with `status = 'generating'` is a schema-vs-application conflict that will produce a runtime error on the first Create Report click if not resolved.
3. **TASK-W14-BB-003-R05** — `criteria_evaluations` RLS must cover INSERT (for AI evaluation writes) and UPDATE (for confirm/override). Task declaration says "org-isolation" but may only implement SELECT.
4. **TASK-W14-BB-001-R02** — CHECK constraint replacement risk: if the builder replaces the entire CHECK without carrying forward prior type values, existing evidence rows may violate the new constraint.
5. **CHAIN-BB-06** — Excluded criteria consistency between AuditResultsTable and DashboardPage must be verified as a cross-task chain, not just per-component.

---

**Pre-Brief Status**: ISSUED ✅
**Assurance Phase**: Phase 0 complete — awaiting Phase 2–4 invocation at handover
**IAA STOP-AND-FIX Mandate**: ACTIVE — no PR opens until all Phase 2–4 checks pass and ASSURANCE-TOKEN is issued
**Authority**: CS2 (Johan Ras / @APGI-cmy) — merge authority CS2 only
