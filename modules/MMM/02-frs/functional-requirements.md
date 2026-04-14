# MMM — Functional Requirements Specification (FRS)

## Stage 3 — Pre-Build Specification Artifact

---

## Status Header

- **Module**: MMM — Maturity Model Management
- **Artifact Type**: Functional Requirements Specification (FRS — Stage 3)
- **Status**: DRAFT — For CS2 review and approval
- **Version**: 0.1.0
- **Date**: 2026-04-14
- **Owner**: CS2 (Johan Ras / @APGI-cmy)
- **Produced By**: foreman-v2-agent (POLC-Orchestration mode)
- **Issue**: maturion-isms#1365 (MMM Stage 3 wave-start authorization)
- **Upstream Authority (Stage 1)**: `modules/MMM/00-app-description/MMM_app_description.md` v0.5.0
  — CS2-approved (maturion-isms#1298, 2026-04-08)
- **Upstream Authority (Stage 2)**: `modules/MMM/01-ux-workflow-wiring-spec/ux-workflow-wiring-spec.md` v0.1.0
  — Produced maturion-isms#1352, CS2-approved maturion-isms#1352 (2026-04-14); Stage 3 wave authorized maturion-isms#1365
- **Harvest Map Reference**: `modules/MMM/harvest-map/harvest-map.md` v0.2.1
- **Supersedes / Prior Spec**: None — first FRS artifact for MMM

> **Governance Note:** This document establishes the formal functional requirement baseline
> for all downstream MMM artifacts: TRS, Architecture, QA-to-Red, PBFAG, and implementation
> planning. No downstream stage may derive from anything other than this FRS without explicit
> CS2 authorization.

---

## 0. Document Purpose

This Functional Requirements Specification (FRS) formalizes the complete set of verifiable
functional requirements for MMM — Maturity Model Management, derived from:

1. **Stage 1** — `MMM_app_description.md` v0.5.0 (§AD references below)
2. **Stage 2** — `ux-workflow-wiring-spec.md` v0.1.0 (§UX references below)

The FRS answers eight mandatory questions established by the Stage 3 wave authorization:

1. What are the complete functional capabilities MMM must provide?
2. What exact functional distinction governs framework-source vs evidence-source ingestion?
3. What exact functional outputs and state transitions occur across the assessment journey?
4. What exact functional boundary exists between MMM findings/recommendations and PIT execution?
5. What must audit workbench / walkabout mode functionally support inside MMM?
6. What exact dashboard/publication behaviours are functionally required?
7. Which open questions are still legitimately TRS / Architecture questions vs FRS questions?
8. Is 100% App Description traceability demonstrated with no TBDs?

**Answer to Q8**: Yes — all §AD sections (§1–§42) and all UX journeys (J-01–J-17) are
explicitly traced in this document. No TBD or placeholder requirements appear below.

---

## 1. Derivation Sources and Traceability Convention

### 1.1 Reference Notation

Requirements in this document use the following source references:

| Notation | Source |
|----------|--------|
| `§AD-N` | App Description section N (e.g. `§AD-6` = App Description §6) |
| `§AD-N.M` | App Description sub-section N.M |
| `§UX-J-NN` | UX Wiring Spec Journey J-NN |
| `§UX-NN` | UX Wiring Spec section NN |
| `§HM` | Harvest Map (capability or open-question register) |

### 1.2 Requirement ID Convention

Requirements are identified as `FR-NNN` (three-digit, zero-padded).
Requirements within a functional group share sequential IDs.
Cross-cutting requirements (security, performance, observability) follow the primary
functional requirements under dedicated sections.

### 1.3 Traceability Completeness Statement

All forty-two sections of `MMM_app_description.md` v0.5.0 are traced in this FRS.
All seventeen user journeys (J-01 through J-17) in `ux-workflow-wiring-spec.md` v0.1.0
are traced in this FRS.

**100% §AD traceability: CONFIRMED. Zero TBD items.**

---

## 2. Product Identity and Canonical Ownership Requirements

*Derived from: §AD-1, §AD-3, §AD-4, §AD-5*

### FR-001 — Canonical Maturity Platform Identity
MMM must function as the single canonical maturity platform in the Maturion ecosystem,
replacing MAT and Maturity Roadmap as standalone modules once MMM capability is confirmed
and switchover gate conditions are satisfied.

**Source**: §AD-1.2, §AD-3.5  
**Acceptance**: No live canonical maturity capability outside MMM post-switchover.

### FR-002 — Domain Hierarchy Single-Ownership Rule
MMM must be the single canonical owner of all Domains, MPSs, and Criteria at all times.
No other module may claim canonical ownership of these structures.

**Source**: §AD-3.1, §AD-5.4  
**Acceptance**: No other module creates or manages Domain/MPS/Criteria structures independently.

### FR-003 — Evidence Ownership
MMM must be the canonical owner of all criterion-linked evidence management, evidence
scoring state, and evidence audit trail.

**Source**: §AD-3.1, §AD-17  
**Acceptance**: Evidence is anchored at criterion level within MMM.

### FR-004 — Findings and Recommendations Ownership
MMM must be the canonical source of maturity findings and recommendations.
No downstream module (PIT, reporting tools) may create independent findings structures
that diverge from the MMM findings model.

**Source**: §AD-3.1, §AD-19, §AD-20.4  
**Acceptance**: One shared findings model; two rendering modes (report/PIT export).

### FR-005 — Module Deployment as Distinct Application
MMM must be delivered as a distinct top-level application within the Maturion portal
shell, deployed as its own service with a dedicated deployment target, domain path, and
platform version constraints.

**Source**: §AD-41 item 1 (RESOLVED)  
**Acceptance**: Separate deployment target declared in TRS; MMM has own domain path.

---

## 3. User Entry and Onboarding Flows

*Derived from: §AD-6, §AD-7, §UX-J-01, §UX-J-02, §UX-J-03, §UX-J-04*

### FR-006 — Pre-Subscription Attraction Flow
MMM must support a pre-subscription attraction flow consisting of:
(a) landing page,
(b) maturity module explanation / tutorial page,
(c) free assessment entry.

The flow must be accessible without authentication.

**Source**: §AD-6.1, §UX-J-01  
**Acceptance**: Unauthenticated users can navigate from landing page through to free assessment entry.

### FR-007 — Free Assessment Execution
MMM must provide a free assessment workflow that:
(a) collects domain-level responses from the user without requiring sign-up,
(b) calculates and stores a baseline maturity score,
(c) presents the results with an explanation of current maturity position,
(d) prompts the user to subscribe and sign up to continue.

**Source**: §AD-6.2, §UX-J-02  
**Acceptance**: Free assessment produces a `baseline_maturity` value stored in `free_assessments`; results are displayed; subscription prompt is presented.

### FR-008 — Locked Baseline Rule
When a user subscribes, the free assessment result must be locked as the preliminary
maturity baseline. If the user subscribes without completing the free assessment, MMM
must prompt completion before framework configuration begins.

**Source**: §AD-6.3, §UX-J-02, §UX-J-04  
**Acceptance**: Framework configuration screens are gated until baseline is established or user bypasses via explicit prompt acknowledgment.

### FR-009 — Maturity Context Persistence Across Workflows
MMM must maintain and expose the following maturity context at all times:
(a) organisation's current maturity level,
(b) current domain maturity levels,
(c) target level,
(d) current-to-next-level gap.

This context must be available to the AI system (via AIMC) and visible to the user in
relevant workflow screens.

**Source**: §AD-6.4  
**Acceptance**: Maturity context is included in AIMC call payloads; displayed in dashboard and criterion-level screens.

### FR-010 — Subscription and Sign-Up Flow
MMM must support a subscription and sign-up flow that:
(a) presents available subscription plans,
(b) collects user registration details,
(c) initiates payment/plan activation,
(d) creates the user's profile and associated organisation record.

**Source**: §AD-6.1, §UX-J-03  
**Acceptance**: On completion, `profiles` and `subscriptions` records exist; user is redirected to organisation onboarding.

### FR-011 — Organisation Onboarding
MMM must collect the following organisation information during onboarding:
(a) organisation name,
(b) organisational context and industry/sector,
(c) hierarchy / site / operation data,
(d) maturity intent and operating context,
(e) other fields required for AI contextualisation.

Onboarding must be complete before the framework-origin fork is presented.

**Source**: §AD-7.1, §UX-J-04  
**Acceptance**: `organisations` record created with all mandatory fields; `onboarding_complete` flag set before fork presented.

### FR-012 — Framework-Origin Decision Fork
Immediately after organisation onboarding completes, MMM must present the user with a
required framework-origin decision fork offering two options:
(a) **Mode A — Verbatim Upload**: for organisations with an existing maturity standard,
(b) **Mode B — New Criteria Creation**: for organisations starting without an existing model.

The selected mode must be recorded in `frameworks.origin_mode`.

**Source**: §AD-7.2, §UX-J-05  
**Acceptance**: Fork screen displayed post-onboarding; origin_mode recorded; correct pathway initiated.

---

## 4. Framework Lifecycle Flows

*Derived from: §AD-8, §AD-9, §AD-10, §AD-11, §AD-12, §AD-13, §AD-14, §UX-J-06, §UX-J-07, §UX-J-08, §UX-J-09*

### FR-013 — Common Upload and Ingestion Infrastructure
All document uploads in MMM — whether framework-source or evidence — must route through
a common governed upload/document-management infrastructure. This infrastructure must
prevent duplicate upload flows and fragmented document governance.

**Source**: §AD-8.1, §UX-19.3  
**Acceptance**: Both `/api/upload/framework-source` and `/api/upload/evidence` share KUC
infrastructure; no separate upload pathways exist outside this common infrastructure.

### FR-014 — Document Role Classification
All uploaded content must be classified with a `document_role` at upload time. Supported
roles must include at minimum:
- `criteria_source`
- `knowledge_source`
- `evidence`
- `guidance`
- `template`

**Source**: §AD-8.2, §UX-22  
**Acceptance**: Every document record in `documents` has a non-null `document_role` value.

### FR-015 — Document Metadata Requirements
Uploaded content must support metadata including:
- `scope_type`: `organisation_specific` | `generic` | `sector_specific` | `framework_reference`
- `origin_mode`: `verbatim_import` | `ai_generated` | `hybrid`
- `document_role` (see FR-014)
- `framework_status`: `draft` | `approved` | `published` | `superseded`

**Source**: §AD-8.3  
**Acceptance**: All four metadata fields present on document records; no undeclared metadata fields used.

### FR-016 — Framework-Source vs Evidence-Source Pipeline Separation
MMM must functionally separate framework-source ingestion (criteria compilation input)
from evidence-source ingestion (assessment input). These pathways share upload
infrastructure but must not collapse into one undifferentiated processing pipeline.

The distinction must be maintained across:
- upload endpoints (separate API paths)
- document_role classification (`criteria_source` vs `evidence`)
- AI processing (structure extraction vs evaluation/scoring)
- lifecycle management (long-lived framework vs per-assessment-cycle)
- downstream routing (hierarchy population vs scoring/findings)

**Source**: §AD-8.4, §UX-22  
**Acceptance**: No evidence document is processed through the framework parsing pipeline; no framework-source document is evaluated for scoring.

### FR-017 — Mandatory Domain → MPS → Criteria Hierarchy
All maturity frameworks in MMM must be structured as a three-level hierarchy:
1. **Domain**
2. **MPS — Mini Performance Standard**
3. **Criteria**

This hierarchy is mandatory regardless of whether the framework originated from AI
generation, verbatim import, or hybrid composition.

**Source**: §AD-9.1, §AD-9.3  
**Acceptance**: Every published framework has the three-tier structure; no flat or two-tier frameworks are permitted.

### FR-018 — Hierarchical Numbering Rule
The framework structure must support immutable hierarchical numbering once approved:
- Domain: `1`, `2`, `3`
- MPS: `1.1`, `1.2`
- Criteria: `1.1.1`, `1.1.2`

Post-approval changes to numbering must be append-only or fully audit-trailed through
governance. No retroactive renumbering is permitted without explicit CS2 authorization.

**Source**: §AD-9.2  
**Acceptance**: Approved frameworks have `sequence_number` fields populated on all Domain,
MPS, and Criteria records; audit trail exists for any post-approval changes.

### FR-019 — Five Default Canonical Domains
MMM must use the following five-domain model as the default maturity structure:
1. Leadership and Governance
2. Process Integrity
3. People and Culture
4. Protection
5. Proof it Works

This structure must be the default unless an imported framework or approved configuration
mode introduces a controlled variant.

**Source**: §AD-10  
**Acceptance**: New frameworks initialized without an import use these five domains as defaults.

### FR-020 — Verbatim Upload Flow (Mode A)
When Mode A (Verbatim Upload) is selected, MMM must:
(a) accept uploaded criteria/source documents via the framework-source upload endpoint,
(b) parse the upload into Domain → MPS → Criteria structure using AIMC,
(c) preserve verbatim source meaning where required,
(d) flag ambiguities for human review (stored in `parse_ambiguities`),
(e) enforce coverage completeness — every relevant source content block must be mapped
    or explicitly classified as non-framework content (tracked in `parse_coverage`),
(f) present the parsed structure for human review and correction before publication.

**Source**: §AD-12, §UX-J-06  
**Acceptance**: After upload, `parsed_domains`, `parsed_mps`, `parsed_criteria` records exist;
all ambiguities surfaced; coverage completeness verified.

### FR-021 — No Hallucination Rule in Verbatim Import
In Mode A (Verbatim Upload), AI must not invent criteria. If uncertain about any source
content, the system must:
(a) flag the item for human review,
(b) show the source anchor,
(c) show the rationale for the structural interpretation proposed.

No content may be added to the parsed framework structure without a corresponding source
anchor or explicit human confirmation.

**Source**: §AD-12.3  
**Acceptance**: Every criterion in `parsed_criteria` has a non-null `source_anchor`; ambiguous
items appear in `parse_ambiguities` rather than being silently included.

### FR-022 — New Criteria Creation Flow (Mode B)
When Mode B (New Criteria Creation) is selected, MMM must:
(a) generate Domain, MPS, Intent Statements, and Criteria using AIMC, with AI responses
    specific to the organisation's context and industry,
(b) generate maturity level descriptors for each criterion,
(c) allow the user to edit, delete, recompile, or interact with AI chat on all proposed
    structures,
(d) present all AI-proposed structures for human review and approval before publication.

Generated elements must be industry-specific, organisation-specific, and aligned to
international best practice.

**Source**: §AD-11, §UX-J-07  
**Acceptance**: AI-generated framework stored in `proposed_domains`, `proposed_mps`,
`proposed_criteria`, `proposed_level_descriptors`; edit/delete/recompile/chat actions
available on each; human must approve before promoting to published hierarchy.

### FR-023 — AI Proposed Altering Mechanism
For all AI-generated or AI-proposed structures, the user must have access to a consistent
altering mechanism with the following capabilities:
- Edit
- Delete
- Recompile (regenerate with constraints)
- AI chat assistance

This mechanism must be available wherever AI proposes MPSs, Intent Statements, Criteria,
level descriptors, or other configurable framework elements.

**Source**: §AD-11.5  
**Acceptance**: Edit, delete, recompile, and chat actions are available on all AI-proposed
elements; user cannot be blocked from modifying AI proposals.

### FR-024 — Intent Statements
Each MPS must support an Intent Statement that:
(a) describes what the organisation seeks to achieve through that MPS,
(b) is collapsible and readable in-place,
(c) is editable through the AI Proposed Altering Mechanism,
(d) is approvable through the approval workflow.

**Source**: §AD-13  
**Acceptance**: `intent_statement` field exists on MPS records; collapsible UI; edit and
approval actions available.

### FR-025 — Criteria Card Requirements
Each criterion must support a focused work area providing:
(a) criterion statement / neutral control statement,
(b) sequence number,
(c) summary of evidence state,
(d) current maturity level,
(e) what is achieved vs what remains,
(f) tutorial/help component (hover/click/Ask Maturion),
(g) AI chat assistance,
(h) evidence entry/access,
(i) findings and recommendations access,
(j) level-descriptor visibility,
(k) approval state visibility.

**Source**: §AD-14.4, §AD-14.5  
**Acceptance**: Criterion drill-down screen presents all ten elements; no element missing from MVP.

### FR-026 — Framework Review and Three-Tier Approval Workflow
Before publication, a compiled framework must pass through a three-tier approval workflow:

- **Level 1 — User Approval**: user confirms item; not fully locked; audit trail required;
  available at MPS, Intent Statement, and Criteria levels.
- **Level 2 — Domain-Level Approval**: domain submitted for broader sign-off; changes
  require controlled unlock/review; communication tracked; locked pending higher approval.
- **Level 3 — Executive Sign-Off**: full framework receives highest-level sign-off; changes
  cascade back down if required; final sign-off locks framework for publication.

All approval actions must be audit-trailed in `approvals` and `approval_comments`.

**Source**: §AD-21, §UX-J-08  
**Acceptance**: Three approval levels enforced; `approvals` records reflect each level;
`approval_comments` track back-and-forth; framework cannot be published without Level 3 sign-off.

### FR-027 — Framework Publication
MMM must support a framework publication event that:
(a) activates the live maturity platform for the organisation,
(b) enables evidence activity,
(c) activates the dashboard,
(d) enables achievement tracking,
(e) enables current-to-target maturity movement,
(f) enables PIT handoff capability.

Publication creates a `publications` record with version and timestamp.

**Source**: §AD-22, §UX-J-09  
**Acceptance**: On publication, all six activation effects confirmed; `publications` record
created; framework is locked for assessment activity.

### FR-028 — Hybrid Framework Mode Timing (OQ-009 RESOLVED)
Hybrid framework mode (import existing standard + AI normalization/completion of missing
parts) is **not an MVP requirement**. It is an explicitly planned future mode.

MMM MVP must support only Mode A (Verbatim Upload) and Mode B (New Criteria Creation).
The J-05 fork decision screen must present only two options at MVP. Hybrid mode may be
introduced in a future release upon explicit CS2 authorization.

**Source**: §AD-7.4, §UX-J-05, OQ-009 resolution  
**Acceptance**: MVP fork screen has exactly two options; no hybrid pathway in initial build.

---

## 5. Assessment Execution Flows

*Derived from: §AD-14, §AD-15, §AD-16, §AD-17, §AD-18, §UX-J-10, §UX-J-11*

### FR-029 — Criterion Drill-Down
From any published framework view, the user must be able to navigate to an individual
criterion drill-down / evidence workspace. The drill-down must present all criterion card
elements (FR-025) and provide direct access to the evidence workspace.

**Source**: §AD-14, §AD-17.2, §UX-J-10  
**Acceptance**: User can navigate from Domain → MPS → Criterion; criterion screen renders
all required elements; evidence workspace accessible from criterion.

### FR-030 — Evidence Workspace Modal Behaviour
When the user opens the evidence workspace for a criterion, the system must:
(a) display existing evidence items linked to the criterion,
(b) allow upload of new evidence (files, photos, voice/audio, links),
(c) display the current AI score proposal and confidence level,
(d) allow human acceptance or override of the AI score,
(e) support evidence classification by type,
(f) display evidence source integrity context (source system, uploaded by, date, provenance).

**Source**: §AD-17, §UX-J-10  
**Acceptance**: Evidence workspace modal opens from criterion; all six capabilities function;
`score_proposals` and `evidence` records reflect current state.

### FR-031 — Supported Evidence Types
The evidence workspace must support the following evidence types:
(a) uploaded files/documents,
(b) photos/images,
(c) voice/audio,
(d) interview/conversation content,
(e) evidence links (URLs),
(f) system/database integrations (via connected-evidence pathways),
(g) PIT-linked implementation evidence (returned from PIT via `POST /api/evidence/pit-return`),
(h) Risk Management evidence,
(i) Incident Management evidence.

**Source**: §AD-17.3  
**Acceptance**: Each evidence type can be uploaded/linked; `evidence.type` field reflects
classification; no evidence type returns an error.

### FR-032 — Evidence Decision Flow
The evidence management flow must support the following decision states:
upload/connect → AI evaluation → human acceptance → human query → escalation → override
→ re-evaluation → audit trail logging.

Each state transition must be recorded in the audit trail.

**Source**: §AD-17.6  
**Acceptance**: All eight states reachable from the evidence workspace; each transition
creates an `override_log` or equivalent audit record.

### FR-033 — Evidence Non-Acceptance Paths
MMM must support at least the following evidence non-acceptance paths:
(a) evidence sufficient but AI rating disputed (human override),
(b) evidence insufficient due to budget/resource/skills constraints (tracked as open gap;
    due dates postponable; PIT may receive implementation task),
(c) criterion claimed not relevant,
(d) evidence deemed not relevant to the criterion.

**Source**: §AD-17.8, §AD-17.9  
**Acceptance**: All four paths available from evidence workspace; each records a distinct
status in `evidence` or `findings`; budget/resource path creates a PIT-eligible gap record.

### FR-034 — Evidence Freshness and Staleness
Every evidence item must support:
(a) effective date,
(b) review frequency,
(c) stale flagging when review date passes,
(d) re-evaluation trigger on staleness.

Stale evidence may reduce maturity state if the underlying requirement is no longer
supportable. Stale evidence triggers a scoring re-evaluation.

**Source**: §AD-17.10, §UX-23  
**Acceptance**: `evidence` records have `effective_date` and `review_frequency` fields;
staleness check runs on schedule; stale flag visible in evidence workspace.

### FR-035 — Re-Evaluation of Evidence
Users must be able to trigger re-evaluation of a criterion's maturity score when:
(a) better evidence is uploaded,
(b) stale evidence is refreshed,
(c) AI interpretation is disputed,
(d) system-linked evidence changes materially.

Re-evaluation must invoke AIMC and update `maturity_scores` and `score_proposals`.

**Source**: §AD-17.7  
**Acceptance**: Re-evaluate action available in evidence workspace; triggers AIMC call;
`maturity_scores` updated; change recorded in `override_log`.

### FR-036 — Human Override Logging
All human overrides of AI evidence interpretation or AI scoring must be logged and
retained. Override records must include:
(a) previous level,
(b) new level (or human-asserted position),
(c) rationale,
(d) user ID,
(e) timestamp.

Override records serve self-learning, oversight, and traceability purposes.

**Source**: §AD-17.11  
**Acceptance**: `override_log` records exist for every human scoring override; all five
fields populated; override log accessible to authorized users.

### FR-037 — Five-Level Maturity Scale
MMM must evaluate all criteria against a canonical five-level maturity scale:
1. Basic
2. Reactive
3. Compliant
4. Proactive
5. Resilient

This scale is mandatory for all assessment activity. No criterion may be scored outside
these five levels.

**Source**: §AD-15.1, §UX-23  
**Acceptance**: Score proposals and confirmed scores use only these five values; no other
scale values accepted in `maturity_scores`.

### FR-038 — Evidence Capability Constraint
Document-only evidence may justify at most a **Compliant** (level 3) maturity score.
Higher maturity levels (Proactive, Resilient) require live, integrated, or automated
evidence patterns. This constraint must be enforced by the AI scoring model and declared
in the UI where relevant.

**Source**: §AD-15.5, §UX-23  
**Acceptance**: AI score proposals for document-only evidence are capped at level 3;
human override to level 4 or 5 with document-only evidence requires an explicit rationale
entry in `override_log`.

### FR-039 — Continuous Live Maturity Engine
MMM is not a static audit model. Maturity state must update when evidence:
is uploaded, is connected, is re-evaluated, becomes stale, is approved, is rejected,
is overridden, or is superseded.

Scoring must be recalculated live at criterion, MPS, domain, and organisation levels
following any evidence event.

**Source**: §AD-16, §UX-23  
**Acceptance**: Evidence event triggers immediate recalculation cascade; `maturity_scores`
updated at all four levels within one scoring cycle.

### FR-040 — Scoring Cascade
Maturity scores must cascade through the hierarchy on evidence confirmation:
1. Criterion-level score updated in `maturity_scores`
2. MPS-level score recalculated (aggregate of criteria)
3. Domain-level score recalculated (aggregate of MPSs)
4. Organisation-level score recalculated (aggregate of domains)
5. Dashboard refresh triggered
6. Achievement check executed (insert `achievements` record if level-up detected)

**Source**: §AD-16.3, §UX-23  
**Acceptance**: Full cascade confirmed in QA; all six steps traceable via audit log.

### FR-041 — Audit Workbench / Walkabout Mode
MMM must provide an audit workbench / walkabout operating mode that:
(a) allows the user to move through the organisation collecting evidence in the field,
(b) supports voice observations, file attachments, photos, and findings at criterion level,
(c) operates within the published framework context (accessed via "Start Audit Session"),
(d) creates and manages an `audit_sessions` record,
(e) inherits MMM's framework, evidence model, and scoring cascade (not a standalone product),
(f) supports mobile-capable field evidence creation,
(g) supports a queue-and-sync model for low-connectivity environments.

**Source**: §AD-18, §UX-J-11  
**Acceptance**: Audit workbench accessible from published framework; all evidence types
capturable; `audit_sessions` record created/closed; sync model confirmed.

### FR-042 — MAT Label Survival Decision (OQ-008 RESOLVED)
The label "MAT" must **not** survive as a user-facing work mode name in MMM. The audit
workbench / walkabout operating mode is named **Audit Workbench** in all user-facing
screens, navigation, and documentation. No "MAT" branding appears in MMM's user
interface. MAT's identity is dissolved; only its portable audit DNA survives as the Audit
Workbench mode within MMM.

**Source**: §AD-18, §UX-J-11, OQ-008 resolution  
**Acceptance**: Zero instances of "MAT" as a mode name in any user-facing screen; mode
consistently named "Audit Workbench" or "Audit Session" in UI.

### FR-043 — Independent Auditor Flow
MMM must support escalation to an independent auditor process where required, including:
(a) controlled invitation with scoped and temporary access rights,
(b) scoped read access to the relevant framework, criteria, and evidence,
(c) findings submission by the independent auditor,
(d) resolution handling by the organisation user,
(e) full audit-trail recording of the independent auditor's session.

**Source**: §AD-17.12  
**Acceptance**: Invitation with auditor role exists; auditor access is time-limited and
scoped; auditor findings recordable; all actions in audit trail.

---

## 6. Findings, Recommendations, and Reporting Flows

*Derived from: §AD-19, §AD-20, §AD-21, §AD-22, §AD-23, §UX-J-12, §UX-J-13, §UX-J-14*

### FR-044 — Shared Findings Model
MMM must produce one shared findings and recommendations model. Each finding must support:
(a) criterion reference,
(b) evidence reference,
(c) maturity position,
(d) rationale,
(e) gap to next level,
(f) recommendation,
(g) owner/responsibility,
(h) priority/severity,
(i) due date / target date where applicable.

**Source**: §AD-19.1, §UX-J-12  
**Acceptance**: `findings` and `recommendations` records have all nine fields populated for
every finding; no incomplete findings permitted at wave closure.

### FR-045 — No Duplicate Truth Rule
Report generation and PIT export must not create separate incompatible versions of
findings. Both are two renderings of one shared maturity finding model.

**Source**: §AD-19.3, §AD-20.4  
**Acceptance**: `reports` and `pit_exports` both reference the same `findings` records; no
findings are stored independently in report or export records.

### FR-046 — Output Fork Decision
After findings and recommendations are available, MMM must present the user with an
explicit output fork:

- **Option A — Create Report**: generate a report-oriented output
- **Option B — Export to PIT**: generate an implementation-oriented action plan

Both options must be accessible from the findings summary screen.

**Source**: §AD-20.1, §UX-J-13, §UX-J-14  
**Acceptance**: Fork screen presents both options; user can choose either; both pathways
lead to distinct but functionally complete flows.

### FR-047 — Report Output Requirements
Report generation must produce an output supporting:
(a) executive summary,
(b) methodology,
(c) framework structure,
(d) findings by Domain / MPS / Criteria,
(e) maturity definitions,
(f) evidence references,
(g) recommendations,
(h) target-state path,
(i) tasks / ownership / dates where appropriate.

Report must be available in at minimum one exportable format.

**Source**: §AD-20.2, §UX-J-13  
**Acceptance**: Generated `reports` contain all nine elements; export format available to user.

### FR-048 — Report Configuration
Users must be able to configure report scope (full framework, selected domains, selected
MPSs) and format before report generation. Report configuration must be saved for reuse.

**Source**: §UX-J-13  
**Acceptance**: `report_configs` record created with scope and format; report can be regenerated from saved config.

### FR-049 — PIT Export Requirements (OQ-004 RESOLVED)
MMM must produce a structured PIT export package that includes:
(a) findings (from `findings` table),
(b) recommendations (from `recommendations` table),
(c) implementation tasks (derived from findings gaps),
(d) reason codes for each implementation task,
(e) priorities,
(f) due dates,
(g) open constraints,
(h) linked maturity targets.

The export is sent to PIT via `POST /api/pit-export/:id/send`. PIT returns an
acknowledgment callback. No PIT-owned planning logic is embedded inside MMM.

**PIT interface contract (OQ-004 RESOLVED)**:
- **Data shape**: structured JSON payload containing findings[], recommendations[],
  implementation_tasks[], linked to `pit_exports` record by export ID.
- **Trigger conditions**: user confirms export on the J-14 output fork screen after
  reviewing the export summary.
- **Handover protocol**: MMM sends via `POST /api/pit-export/:id/send`; PIT sends
  acknowledgment via callback/webhook; MMM records `sent_at` in `pit_exports` on
  acknowledgment receipt.
- **Implementation evidence return**: PIT may return implementation evidence to MMM
  via `POST /api/evidence/pit-return`; this evidence is linked to the originating
  criterion and triggers a re-evaluation (FR-035).

**Source**: §AD-20.3, §UX-J-14, §UX-19.2, §HM OQ-004  
**Acceptance**: `pit_exports` record populated with all eight fields; export sent to PIT;
acknowledgment received; `sent_at` populated.

### FR-050 — Dashboard Publication Behaviour
The live dashboard must be activated on framework publication (FR-027) and must
display:
(a) Operational Maturity House visualization (Roadmap backbone),
(b) current state indicators per domain,
(c) working-on / next-state indicators,
(d) overall maturity level,
(e) domain-level maturity indicators,
(f) drill-down capability to domain, MPS, and criterion level,
(g) achieved vs outstanding visibility at each level,
(h) company hierarchy filtering (section, site, operation, subsidiary),
(i) live achievement feed (criterion/MPS/domain achievements, level-up moments).

**Source**: §AD-23, §UX-J-15  
**Acceptance**: Dashboard renders all nine elements on publication; drill-down functional;
filters operational; achievement feed live.

### FR-051 — Dashboard CL-13 Carry-Over Alignment (OQ-006 RESOLVED)
CL-13 extended scope (D5/D6/D7) dashboard components are confirmed as delivered
(15/15 tests GREEN per session-083). These components are confirmed compatible with the
MMM dashboard specification in FR-050. The target MMM dashboard (J-15 wiring) subsumes
the CL-13 extended scope dashboard components. No outstanding reconciliation is required
before FRS approval. CL-13 core deliverables (D1–D4) remain pending as separate LKIAC
items and are not MMM blockers.

**Source**: §UX-J-15, §HM OQ-006, `lkiac-carryover-closure-note.md`  
**Acceptance**: CL-13 extended scope components compatible with FR-050; no separate
reconciliation wave required before MMM implementation.

### FR-052 — Dashboard Wow Factor
The dashboard must be designed as a strong internal engagement artifact intended for
broad internal visibility, including shared-screen or office-display use cases. It is
not merely a reporting widget.

**Source**: §AD-23.8  
**Acceptance**: UX design brief for dashboard includes engagement and office-display
suitability criteria (assessed during Architecture/UI wave).

---

## 7. Boundary Flows

*Derived from: §AD-3.2, §AD-3.3, §AD-26.1, §AD-26.4, §UX-19*

### FR-053 — MMM ↔ AIMC Functional Boundary
All AI functionality in MMM must route through AIMC. MMM must never call AI providers
directly. The following functional interactions must be AIMC-mediated:

| Interaction | Direction | Interface |
|-------------|-----------|-----------|
| Framework parsing (Mode A) | MMM → AIMC | `POST /api/ai/framework-parse` |
| Framework generation (Mode B) | MMM → AIMC | `POST /api/ai/framework-generate` |
| Framework altering | MMM → AIMC | `POST /api/ai/framework-alter` |
| Evidence evaluation | MMM → AIMC | `POST /api/ai/evidence-evaluate` |
| Scoring recommendations | MMM → AIMC | `POST /api/ai/recommend` |
| Contextual chat | MMM → AIMC | `POST /api/ai/chat` |
| Contextual explanation | MMM → AIMC | `POST /api/ai/explain` |
| Assessment interpretation | MMM → AIMC | `POST /api/ai/assessment-interpret` |
| Knowledge upload/ingestion | MMM → KUC (within AIMC) | `POST /api/upload/*` |

**Source**: §AD-26, §AD-39N, §UX-19.1  
**Acceptance**: Zero direct AI provider calls in MMM application code; all AI calls pass
through AIMC gateway; AIMC call patterns confirmed in TRS.

### FR-054 — MMM ↔ PIT Functional Boundary
The functional boundary between MMM and PIT is as follows:

- **MMM owns**: findings production, recommendations, export package preparation, PIT
  export trigger, implementation evidence receipt from PIT.
- **PIT owns**: import and processing of the export package, implementation plan
  lifecycle, action management, implementation progress tracking.
- **No PIT-owned planning logic** may exist inside MMM.

This boundary is materialized by:
- `POST /api/pit-export/:id/send` (MMM → PIT)
- `POST /api/evidence/pit-return` (PIT → MMM)

**Source**: §AD-3.3, §AD-20.3, §UX-19.2  
**Acceptance**: No PIT lifecycle logic in MMM code; PIT export is a one-way push plus
acknowledgment; evidence return from PIT processed and linked at criterion level.

### FR-055 — MMM ↔ KUC Functional Boundary
Both framework-source uploads and evidence uploads must route through the KUC (Knowledge
Upload Centre, within AIMC scope). KUC returns classification metadata for each upload.

| Interaction | Direction | Interface |
|-------------|-----------|-----------|
| Framework-source upload | MMM → KUC | `POST /api/upload/framework-source` |
| Evidence upload | MMM → KUC | `POST /api/upload/evidence` |
| Document classification | KUC → MMM | Classification metadata returned |

Shared infrastructure; distinct metadata models and lifecycle management must be maintained.

**Source**: §AD-8, §UX-19.3  
**Acceptance**: Both upload types route to KUC; classification metadata returned for every
upload; no upload bypasses KUC.

### FR-056 — Framework-Source Ingestion Functional Specification
Framework-source ingestion (Mode A verbatim upload path) must function as follows:

- **Entry point**: J-06 upload interface
- **Upload endpoint**: `POST /api/upload/framework-source` (via KUC)
- **document_role**: `criteria_source`
- **AI processing**: structure extraction (parse → domain/MPS/criteria mapping)
- **Human review focus**: structure accuracy, coverage completeness
- **Lifecycle**: long-lived — framework definitions persist and are versioned
- **Downstream**: populates maturity hierarchy (domains, MPS, criteria)

**Source**: §AD-8, §AD-12, §UX-22, §HM OQ-005  
**Acceptance**: Framework-source documents processed through structure-extraction pipeline;
`parse_jobs` record created and tracked; parsed hierarchy available for human review.

### FR-057 — Evidence-Source Ingestion Functional Specification
Evidence-source ingestion must function as follows:

- **Entry point**: J-10 evidence workspace or J-11 walkabout capture
- **Upload endpoint**: `POST /api/upload/evidence` (via KUC)
- **document_role**: `evidence`
- **AI processing**: evaluate → classify → score proposal
- **Human review focus**: score accuracy, relevance to criterion
- **Lifecycle**: short-to-medium-lived — per assessment cycle
- **Downstream**: feeds scoring engine and findings model

CL-3.5 data-source registry is confirmed COMPLETE (session-082; 27/27 tests GREEN; OQ-005
ANSWERED). The registry is available to support this specification and the framework-source
ingestion pathway.

**Source**: §AD-17, §AD-8.4, §UX-22, §HM OQ-005  
**Acceptance**: Evidence documents processed through evaluation pipeline; `score_proposals`
record created; maturity score updated.

### FR-058 — Switchover Gate Parameterisation (OQ-007 RESOLVED)
The switchover gate model is **not parameterised per migration class** at FRS stage. The
single gate model (SG-1 through SG-5 in `harvest-map.md`) applies to all migration
classes.

However, SG-3 (data/state migration path) includes an explicit N/A clause for capabilities
with no persistent data/state — this provides effective parameterisation for data-free
migrations without requiring a class-specific gate model.

If a capability-specific deviation from the standard gate model is required at
Architecture or implementation stage, this must be explicitly authorized by CS2 with a
harvest-map update. The standard gate model is authoritative until such deviation is
formally recorded.

**Source**: §HM Switchover Gate Model, OQ-007 resolution  
**Acceptance**: Harvest map updated to reflect OQ-007 resolution; no separate per-class
gate models created without CS2 authorization.

### FR-059 — Source-System Inheritance and Traceability
Until switchover gate conditions are satisfied, all source system capabilities (MAT,
Maturity Roadmap, Legacy) remain active. MMM's functional flows represent the destination
specification. No user-facing migration UI is required in the initial MMM build. The
harvest map governs source-state transitions.

**Source**: §UX-19.5, §HM Source-State Vocabulary  
**Acceptance**: MMM build does not include migration execution UI; harvest map OQ statuses
updated to reflect FRS-stage resolutions.

---

## 8. Roles, Permissions, and Invitation Flows

*Derived from: §AD-24, §UX-J-16*

### FR-060 — Core Role Model
MMM must support at minimum the following roles:
(a) Main User / Implementation Lead,
(b) Domain User,
(c) MPS User,
(d) Evidence Manager,
(e) Approver,
(f) Executive Sign-Off User,
(g) Independent Auditor (scoped/temporary).

Final role naming must be confirmed during Architecture/TRS derivation (§AD-24.6 ambiguity
preservation note).

**Source**: §AD-24.1, §UX-J-16  
**Acceptance**: All seven role types creatable in `organisation_users`; each role has
distinct permission boundaries.

### FR-061 — Invitation Model
User access must follow an invitation-based model:
(a) original user signs up and becomes Main User,
(b) subsequent users are invited by the Main User or appropriate role holder,
(c) invitations are role-scoped,
(d) write permissions are limited to assigned areas,
(e) read rights may be broad subject to governance rules.

**Source**: §AD-24.2, §AD-24.3, §UX-J-16  
**Acceptance**: `invitations` records created with role and scope; invited user's permissions
limited to declared scope; no self-signup for organisation users.

### FR-062 — Scope-Based Permissions
Permissions must be scoped to:
(a) whole framework,
(b) domain,
(c) MPS,
(d) criterion,
(e) evidence set,
(f) approval scope.

If lower-level responsibility is not assigned, responsibility inherits to the last assigned
higher level.

**Source**: §AD-24.3, §AD-24.4  
**Acceptance**: `user_scopes` records enforce scope; cross-scope access denied; inheritance
rule verified in QA.

---

## 9. AI Strategy Requirements

*Derived from: §AD-26, §AD-32*

### FR-063 — No Local AI Stack
MMM must not build a separate uncontrolled AI layer outside AIMC. All AI routing must
be through the AIMC gateway and approved platform routing only. This applies to all AI
features including chat, framework generation, evidence interpretation, scoring, and
findings generation.

**Source**: §AD-26.4, §AD-39N  
**Acceptance**: Zero direct provider calls in MMM code; no private AI client in MMM;
TRS must cite AIMC as the sole AI routing layer.

### FR-064 — AI Human Oversight Rule
All AI recommendations, score proposals, and framework generation outputs must remain
subject to:
(a) human confirmation,
(b) human override,
(c) audit trail recording,
(d) governance controls,
(e) watchdog visibility.

No AI output may be automatically applied to maturity state without human confirmation.

**Source**: §AD-26.3  
**Acceptance**: No auto-accept paths for AI outputs; all AI proposals require explicit
human confirmation before updating `maturity_scores` or `criteria`.

### FR-065 — AI Governance Requirements
MMM must support:
(a) confidence visibility for AI score proposals,
(b) model/version traceability in `ai_interactions`,
(c) override tracking in `override_log`,
(d) AI decision logging,
(e) ISO 42001-aligned oversight expectations.

**Source**: §AD-26.6  
**Acceptance**: All five fields present in relevant records; `ai_interactions` records
include model and confidence data.

### FR-066 — Back-Office AI Administration Interface
MMM must include a two-pane back-office AI administration interface:
(a) **Admin AI Chat** (Pane 1): dedicated admin-only AI chat interface for operational
    queries, diagnostics, and governance reporting.
(b) **AI Telemetry Dashboard** (Pane 2): real-time AI usage telemetry displaying token
    usage, latency, cost, error rates, and AI interaction volume.

This interface is admin-only and separate from the end-user AI chat.

**Source**: §AD-32.1  
**Acceptance**: Admin AI chat accessible to admin role only; telemetry dashboard displays
all five metrics; no end-user access to admin pane.

---

## 10. Observability, Telemetry, and Cross-App Governance Requirements

*Derived from: §AD-31, §AD-33, §AD-34, §AD-35, §AD-37, §AD-38*

### FR-067 — Health and Telemetry Endpoints
MMM must expose:
(a) `/api/health` — application health endpoint,
(b) structured JSON logging for all critical paths,
(c) runtime telemetry covering: free assessment flow, framework creation/import, evidence
    operations, AI interactions, findings generation, report generation, PIT export,
    dashboard publication.

**Source**: §AD-34  
**Acceptance**: `/api/health` returns structured response; telemetry visible in logging
output for all eight listed critical paths.

### FR-068 — QIW Dashboard
MMM must implement a Quality Integrity Watchdog (QIW) dashboard with:
(a) real-time colour-coded status indicators for all monitored pipeline stages
    (build, lint, test, deploy, runtime) — GREEN/AMBER/RED,
(b) 7-day trend display for each monitored metric,
(c) QIW API endpoint exposing status and trend data programmatically.

**Source**: §AD-33.1  
**Acceptance**: QIW dashboard renders three-stage status; 7-day trend visible; QIW API
returns structured response.

### FR-069 — Performance Measurement Baseline
MMM must define and monitor:
(a) AI token usage, latency, and cost,
(b) p50/p95/p99 latency for critical workflows,
(c) throughput and error rates,
(d) inter-service latency for all cross-service calls (MMM → AIMC, MMM → database,
    MMM → auth provider).

Performance targets (SLA values) are to be specified in TRS.

**Source**: §AD-35  
**Acceptance**: Metrics collection infrastructure defined; measurement points declared
for all four categories; targets deferred to TRS.

### FR-070 — Circuit Breaker Requirements
MMM must implement circuit breaker patterns for all external service dependencies.
Circuit breakers must:
(a) open after a configurable failure threshold,
(b) provide fallback behavior (graceful degradation, not hard failure),
(c) expose circuit state via the health/metrics endpoint.

**Source**: §AD-35.1  
**Acceptance**: Circuit breaker present on all external service calls; fallback behavior
confirmed; circuit state in health endpoint.

### FR-071 — Compliance Baseline
MMM must demonstrate compliance with:
(a) ISO 27001 — Information Security Management System requirements,
(b) ISO 31000 — Risk Management principles and guidelines,
(c) NIST CSF — Cybersecurity Framework.

Control traceability must cover Architecture → QA → Runtime → Evidence.

**Source**: §AD-37  
**Acceptance**: `COMPLIANCE_SCOPE.md`, `CONTROL_MAPPING.md`, and `EVIDENCE_CATALOG.md`
present; every control traceable end-to-end.

### FR-072 — Commissioning Model
MMM must support a progressive commissioning model with four states:
INSTALLED → VALIDATED → COMMISSIONED → ACTIVATED.

A runtime readiness verification sequence of at minimum five checks must pass before
ACTIVATED state is reached.

**Source**: §AD-38, §AD-38.2  
**Acceptance**: Commissioning state machine implemented; five readiness checks defined
in `APP_STARTUP_REQUIREMENTS.md` (TRS deliverable); failure of any check prevents ACTIVATED.

### FR-073 — Audit Log Design
MMM must implement an explicit audit log covering:
(a) action types,
(b) actor identity,
(c) target entity,
(d) timestamps,
(e) before/after state where relevant,
(f) deduplication rules,
(g) retention expectations.

Audit log must capture all evidence decisions, scoring changes, overrides, approvals,
PIT exports, and report generation events.

**Source**: §AD-39V  
**Acceptance**: Audit log schema defined in TRS; all seven fields present; all eight
event types confirmed in QA.

---

## 11. Tutorial, Help, and UX Model

*Derived from: §AD-14.5, §AD-25, §AD-39S, §AD-39T*

### FR-074 — Tutorial and Help Model
At all relevant structural layers (criterion, MPS, domain), MMM must support:
(a) **Hover** → short explanation (tooltip),
(b) **Click** → paragraph explanation (expanded help),
(c) **Ask Maturion** → guided AI explanation and linked learning/help (via AIMC).

**Source**: §AD-14.5, §AD-25.5  
**Acceptance**: All three interactions available at each declared structural level; Ask
Maturion invokes AIMC; help content stored in `help_content`.

### FR-075 — Consistent Notification Model
MMM must use a consistent notification model (toast or approved equivalent) covering:
- success (green)
- error (red) + detail panel
- warning (amber)
- long-running operations (progress indicator)
- background sync (status indicator)
- evidence upload outcome
- approval outcome
- export/report outcome

No raw `alert()` patterns or undefined feedback behavior.

**Source**: §AD-39S, §UX-24  
**Acceptance**: Toast/notification system present; all eight event categories produce
correct notification type; no `alert()` calls.

### FR-076 — State Persistence Model
MMM must persist the following state across sessions:
(a) organisation selection (`profiles.current_org_id`),
(b) framework selection (`profiles.current_framework_id`),
(c) current navigation position (client-side URL + local storage),
(d) dashboard filters (`user_preferences`),
(e) evidence workspace drafts (client-side local storage),
(f) offline queue state (client-side IndexedDB),
(g) AI conversation context (`ai_interactions` server-side),
(h) UI preferences (`user_preferences`),
(i) role and scope context (server-side, cached client-side).

**Source**: §AD-39T, §UX-25  
**Acceptance**: All nine state domains persist and restore correctly across session reload;
confirmed in QA against each listed persistence location.

### FR-077 — Drill-Down Context Visibility
Users must always know where they are within the framework hierarchy:
(a) current Domain displayed,
(b) current MPS displayed,
(c) current Criterion displayed (where applicable),
(d) current evidence context displayed (where applicable).

Structure-aware navigation must be available at all framework interaction screens.

**Source**: §AD-25.1, §AD-25.2  
**Acceptance**: Breadcrumb or equivalent context indicator visible at all drill-down levels.

### FR-078 — Collapsibility and Multi-Level Navigation
Users must be able to:
(a) expand all structural levels,
(b) collapse sections,
(c) focus on one layer or one branch of the framework hierarchy.

**Source**: §AD-25.3  
**Acceptance**: Expand all / collapse controls functional; branch focus available.

---

## 12. Versioning and Traceability Requirements

*Derived from: §AD-28, §AD-29*

### FR-079 — Canonical Data Separation
MMM must maintain distinct canonical separation between:
(a) **Framework** — the maturity model structure (domains, MPSs, criteria, descriptors,
    publication state, version),
(b) **Assessment Run / Audit Activity** — a specific audit or review against a framework version,
(c) **Evidence State** — evidence linked to criteria and their maturity assessment,
(d) **Operational Maturity State** — the live maturity position reflected by evidence and decisions,
(e) **Action State** — the implementation/remediation path, including PIT-linked actions.

This separation is mandatory to prevent duplicate truth and broken traceability.

**Source**: §AD-28  
**Acceptance**: Five distinct data domains reflected in schema; no cross-domain duplication
of records; confirmed in TRS schema design.

### FR-080 — Versioning Requirements
MMM must support versioning of:
(a) framework version,
(b) publication version,
(c) assessment run / audit instance,
(d) evidence timestamps and currency,
(e) report version,
(f) PIT export version.

Versioning is required to preserve defensibility, historical comparison, report integrity,
implementation traceability, and governance auditability.

**Source**: §AD-29  
**Acceptance**: Version fields present on all six artifact types; historical versions
retrievable; version increments on modification.

---

## 13. Open Questions — Disposition Register

This section formally disposes all open questions from the Harvest Map
(`harvest-map.md` v0.2.1) and UX Wiring Spec (`ux-workflow-wiring-spec.md` §21).

### OQ-001 — Offline Capability Requirements (CARRIED FORWARD → TRS)
**Question**: What is the minimum offline capability requirement for MMM walkabout mode?

**FRS Position**: FR-041 specifies a queue-and-sync model for low-connectivity environments.
Full offline-first architecture requirements (local database sync, conflict resolution,
capacity bounds) belong to TRS as technical constraints, not functional requirements.

**Disposition**: CARRIED FORWARD TO TRS.

---

### OQ-002 — Legacy UI Component Audit (CARRIED FORWARD → Architecture)
**Question**: Has a component audit of the legacy UI assets been performed?

**FRS Position**: No legacy UI component may be adopted without individual audit. This is
an Architecture-wave deliverable — the FRS does not declare which UI components are
harvestable; that decision requires the architectural assessment.

**Disposition**: CARRIED FORWARD TO ARCHITECTURE WAVE.

---

### OQ-003 — Legacy Duplication Audit (CARRIED FORWARD → Architecture)
**Question**: Has a full duplication audit of legacy vs Roadmap/MAT been completed?

**FRS Position**: LG-05 establishes the policy (retire confirmed duplicates); named
retirement decisions are Architecture-wave deliverables. The FRS does not declare specific
legacy components as retired — that requires the component-level audit artifact.

**Disposition**: CARRIED FORWARD TO ARCHITECTURE WAVE.

---

### OQ-004 — MMM → PIT Export/Interface Contract (RESOLVED — FR-049)
**Question**: Has the MMM → PIT export/interface contract been defined?

**FRS Resolution**: FR-049 defines the complete interface contract:
data shape (structured JSON payload), trigger conditions (user confirms on J-14 screen),
handover protocol (push via `POST /api/pit-export/:id/send`, PIT callback/webhook,
`sent_at` recorded on acknowledgment), and evidence return path
(`POST /api/evidence/pit-return`).

**Disposition**: RESOLVED. See FR-049.

---

### OQ-005 — CL-3.5 Data-Source Registry Status (RESOLVED — FR-056, FR-057)
**Question**: Is the CL-3.5 data-source registry complete enough to support framework-source
ingestion pathway specification?

**FRS Resolution**: CL-3.5 is COMPLETE (session-082, 27/27 tests GREEN, DEP-008 at
PARALLEL-RUN). The registry supports both framework-source (FR-056) and evidence-source
(FR-057) ingestion pathway specification. No FRS-blocking dependency on CL-3.5.

**Disposition**: RESOLVED. See FR-056, FR-057.

---

### OQ-006 — CL-13 Dashboard Carry-Over Status (RESOLVED — FR-051)
**Question**: Have legacy dashboard components been reconciled with the MMM dashboard?

**FRS Resolution**: CL-13 extended scope (D5/D6/D7) is COMPLETE (session-083, 15/15
tests GREEN). These components are compatible with the MMM dashboard specification
(FR-050). No reconciliation wave required before FRS approval. CL-13 core deliverables
(D1–D4) are PENDING but are not MMM blockers.

**Disposition**: RESOLVED. See FR-051.

---

### OQ-007 — Switchover Gate Parameterisation (RESOLVED — FR-058)
**Question**: Should the switchover gate be parameterised per migration class?

**FRS Resolution**: The single standard gate model (SG-1 through SG-5) applies to all
migration classes. SG-3 N/A clause provides effective parameterisation for data-free
migrations. No class-specific gate model required at this stage.

**Disposition**: RESOLVED. See FR-058.

---

### OQ-008 — MAT Label Survival (RESOLVED — FR-042)
**Question**: Will the label "MAT" survive as a user-facing work mode name?

**FRS Resolution**: No. The audit workbench / walkabout mode is named "Audit Workbench"
in all user-facing screens and navigation. No "MAT" branding in MMM.

**Disposition**: RESOLVED. See FR-042.

---

### OQ-009 — Hybrid Framework Mode Timing (RESOLVED — FR-028)
**Question**: Is hybrid framework mode MVP or later?

**FRS Resolution**: Hybrid framework mode is NOT MVP. MMM MVP supports only Mode A
(Verbatim Upload) and Mode B (New Criteria Creation). Hybrid mode deferred to a future
release requiring explicit CS2 authorization.

**Disposition**: RESOLVED. See FR-028.

---

## 14. App Description Traceability Matrix

This matrix confirms 100% traceability of all §AD sections to FRS requirements.

| §AD Section | Topic | FRS Requirement(s) |
|-------------|-------|-------------------|
| §AD-0 | Document Purpose | FR-001 |
| §AD-1 | Product Identity | FR-001, FR-005 |
| §AD-2 | Product Vision | FR-001 through FR-006 |
| §AD-3 | Canonical Ownership | FR-001, FR-002, FR-003, FR-004, FR-053, FR-054 |
| §AD-4 | Module Position | FR-053, FR-054, FR-055 |
| §AD-5 | Core Product Philosophy | FR-001, FR-002 |
| §AD-6 | User Entry Journey | FR-006, FR-007, FR-008, FR-009, FR-010 |
| §AD-7 | Organisation Setup | FR-011, FR-012, FR-028 |
| §AD-8 | Common Upload and Ingestion | FR-013, FR-014, FR-015, FR-016, FR-055 |
| §AD-9 | Core Structural Model | FR-017, FR-018 |
| §AD-10 | Five Canonical Domains | FR-019 |
| §AD-11 | Framework Authoring Mode | FR-022, FR-023 |
| §AD-12 | Framework Import Mode | FR-020, FR-021 |
| §AD-13 | Intent Statements | FR-024 |
| §AD-14 | Assessment Criteria | FR-025, FR-074 |
| §AD-15 | Maturity Model | FR-037, FR-038 |
| §AD-16 | Continuous Live Maturity Engine | FR-039, FR-040 |
| §AD-17 | Evidence Management | FR-030, FR-031, FR-032, FR-033, FR-034, FR-035, FR-036, FR-043 |
| §AD-18 | Audit / Field Evidence Mode | FR-041, FR-042 |
| §AD-19 | Findings and Recommendations | FR-044, FR-045 |
| §AD-20 | Output Fork | FR-046, FR-047, FR-048, FR-049, FR-050 |
| §AD-21 | Approval and Governance | FR-026 |
| §AD-22 | Publication and Live Operations | FR-027 |
| §AD-23 | Live Dashboard | FR-050, FR-051, FR-052 |
| §AD-24 | Roles, Permissions, Invitations | FR-060, FR-061, FR-062 |
| §AD-25 | UI/UX Principles | FR-074, FR-077, FR-078 |
| §AD-26 | AI Strategy | FR-053, FR-063, FR-064, FR-065 |
| §AD-27 | Knowledge and Guidance Model | FR-055, FR-056, FR-057 |
| §AD-28 | Canonical Data Separation | FR-079 |
| §AD-29 | Versioning and Traceability | FR-080 |
| §AD-30 | Migration and Decommission | FR-059 |
| §AD-31 | Mandatory Cross-App Components | FR-067, FR-068, FR-069, FR-070, FR-071, FR-072, FR-073 |
| §AD-32 | Agent and AI Operating Model | FR-053, FR-063, FR-066 |
| §AD-33 | Watchdog / QIW / Oversight | FR-068 |
| §AD-34 | Observability, Telemetry, Metrics | FR-067 |
| §AD-35 | Performance Measurement | FR-069, FR-070 |
| §AD-36 | Feedback and Learning | FR-067 |
| §AD-37 | Compliance Baseline | FR-071 |
| §AD-38 | Startup, Commissioning | FR-072 |
| §AD-39 | Architecture Completeness | FR-072, FR-073 |
| §AD-39A | Build Lifecycle Stages | Governance artifact — noted in FRS governance header |
| §AD-39B | Requirements Derivation Chain | This document — FRS derived from §AD + §UX |
| §AD-39C | Technology Stack Authority | Deferred to TRS (stack authority is TRS domain) |
| §AD-39D | Deliverable Artifacts | Governance note — tracked in BUILD_PROGRESS_TRACKER |
| §AD-39E | Component Definition of Done | Governance note — enforced via QA-to-Green |
| §AD-39F | Test-First Guarantee | Governance note — enforced via Stage 6 QA-to-Red |
| §AD-39G | Physical Verification Gate | Governance note — enforced via Stage 6 QA-to-Red |
| §AD-39H | PBFAG Gate | Governance note — Stage 7 gate |
| §AD-39I | Agent Authority Chain | Governance note — agent contracts |
| §AD-39J | Schema-to-Hook Validation | Governance note — TRS and build wave gate |
| §AD-39K | Table Pathway Audit | Governance note — TRS and build wave gate |
| §AD-39L | RLS Audit Gate | Governance note — TRS and build wave gate |
| §AD-39M | Auth Wiring Checklist | FR-062 (scope-based), deferred detail to TRS |
| §AD-39N | AI Integration Rule | FR-053, FR-063 |
| §AD-39O | Edge Function Registry | Governance note — TRS deliverable |
| §AD-39P | Deployment Wave | Governance note — Stage 12 |
| §AD-39Q | Secret Naming Convention | Governance note — TRS deliverable |
| §AD-39R | Deployment Runbook | Governance note — Stage 12 |
| §AD-39S | Notification Patterns | FR-075 |
| §AD-39T | Shared State Architecture | FR-076 |
| §AD-39U | API Authentication Rule | Governance note — TRS and build wave gate |
| §AD-39V | Audit Log Design | FR-073 |
| §AD-39W | Tracker Update Requirement | Governance note — BUILD_PROGRESS_TRACKER |
| §AD-39X | State Persistence | FR-076 |
| §AD-40 | Security and Integrity | FR-071, deferred detail to TRS |
| §AD-41 | Open Design Items | FR-005 (item 1 RESOLVED); items 2/8 deferred to TRS/Architecture |
| §AD-42 | Final Statement | FR-001 through FR-080 (full coverage) |

**Traceability Status**: 100% coverage. All 42 sections of §AD traced. Zero TBD items.

---

## 15. UX Journey Traceability Matrix

| Journey | Title | FRS Requirement(s) |
|---------|-------|-------------------|
| J-01 | Landing & Attraction | FR-006 |
| J-02 | Free Assessment | FR-007, FR-008, FR-009 |
| J-03 | Subscription & Sign-Up | FR-010 |
| J-04 | Organisation Onboarding | FR-011 |
| J-05 | Framework-Origin Fork | FR-012, FR-028 |
| J-06 | Verbatim Upload (Mode A) | FR-013, FR-014, FR-015, FR-016, FR-020, FR-021, FR-056 |
| J-07 | New Criteria Creation (Mode B) | FR-013, FR-016, FR-022, FR-023 |
| J-08 | Framework Review & Approval | FR-026 |
| J-09 | Publication & Activation | FR-027 |
| J-10 | Criterion Drill-Down & Evidence | FR-025, FR-029, FR-030, FR-031, FR-032, FR-033, FR-034, FR-035, FR-036, FR-038, FR-057 |
| J-11 | Audit Workbench / Walkabout | FR-041, FR-042 |
| J-12 | Findings & Recommendations | FR-044, FR-045 |
| J-13 | Output Fork: Report | FR-046, FR-047, FR-048 |
| J-14 | Output Fork: PIT Export | FR-046, FR-049, FR-054 |
| J-15 | Live Dashboard | FR-050, FR-051, FR-052 |
| J-16 | Roles, Invitations & Permissions | FR-060, FR-061, FR-062 |
| J-17 | AI Interactions (Cross-Cutting) | FR-053, FR-063, FR-064, FR-065, FR-074 |

**Journey Coverage**: 17/17 journeys traced. 100% §UX coverage confirmed.

---

## 16. Mandatory Questions — Foreman Answers

### Q1: Complete functional capabilities
**Answer**: FR-001 through FR-080 define all functional capabilities, covering product
identity, entry flows, framework lifecycle, assessment execution, findings/reporting,
boundary flows, roles, AI strategy, and cross-app governance.

### Q2: Framework-source vs evidence-source ingestion distinction
**Answer**: FR-016, FR-056 (framework-source), and FR-057 (evidence-source) establish
the complete functional distinction. Separate upload endpoints, document roles, AI
processing modes, lifecycles, and downstream routing govern each pathway.

### Q3: Functional outputs and state transitions across assessment journey
**Answer**: FR-039 and FR-040 define the live maturity engine and scoring cascade.
FR-029 through FR-038 define the criterion drill-down, evidence workspace, and scoring
state transitions. FR-044 through FR-050 define the findings and output fork transitions.

### Q4: MMM findings/recommendations vs PIT execution boundary
**Answer**: FR-049 and FR-054 define this boundary completely. MMM produces findings and
export package. PIT owns import and execution. No PIT planning logic inside MMM.
Interface contract fully defined in FR-049.

### Q5: Audit workbench / walkabout mode functional support
**Answer**: FR-041 defines all functional requirements for the Audit Workbench. FR-042
resolves MAT label survival. The mode is an operating mode within MMM (not standalone),
inherits MMM's framework and scoring, supports mobile capture and queue-and-sync.

### Q6: Dashboard / publication behaviours
**Answer**: FR-050 defines all required dashboard elements. FR-027 defines publication
activation effects. FR-051 confirms CL-13 carry-over alignment. FR-052 declares wow
factor requirement.

### Q7: Open questions that are TRS/Architecture vs FRS
**Answer**: OQ-001 (offline capability) → TRS. OQ-002 (legacy UI audit) → Architecture.
OQ-003 (duplication audit) → Architecture. All other OQs resolved at FRS stage (see §13).

### Q8: 100% App Description traceability with no TBDs?
**Answer**: Yes. Confirmed in §14 (traceability matrix). All 42 §AD sections traced to
one or more requirements. Zero TBD items. All OQs dispositioned (5 resolved, 3 carried
forward with explicit stage assignment).

---

## 17. Acceptance Criteria Verification

| # | Criterion | Status | Reference |
|---|-----------|--------|-----------|
| AC-01 | `modules/MMM/02-frs/functional-requirements.md` created | ✅ | This document |
| AC-02 | Verifiable functional requirements derived from Stage 1 and Stage 2 | ✅ | FR-001 through FR-080 |
| AC-03 | Explicit derivation statements included | ✅ | Each FR has Source and Acceptance fields |
| AC-04 | Requirement IDs and traceability structure included | ✅ | FR-NNN IDs; §14 and §15 traceability matrices |
| AC-05 | 100% App Description traceability confirmed | ✅ | §14 — all 42 sections traced |
| AC-06 | No TBD / placeholder requirements | ✅ | Zero TBDs; all OQs dispositioned |
| AC-07 | MMM ↔ AIMC functional boundary explicit | ✅ | FR-053, FR-063 |
| AC-08 | MMM ↔ PIT functional boundary explicit | ✅ | FR-049, FR-054 |
| AC-09 | Framework-source vs evidence-source handling formalized | ✅ | FR-016, FR-056, FR-057 |
| AC-10 | Functional open questions resolved or lawfully deferred | ✅ | §13 — 6 resolved, 3 deferred with explicit stage |
| AC-11 | BUILD_PROGRESS_TRACKER updated | ✅ | Separate deliverable (D5-BPT) |
| AC-12 | Relevant live MMM control documents updated | ✅ | harvest-map.md updated (D5-HM) |
| AC-13 | PREHANDOVER + session memory + IAA PASS completed | Pending | D6 ceremony artifacts |

---

## Version History

| Version | Date | Change |
|---------|------|--------|
| 0.1.0 | 2026-04-14 | Initial Stage 3 FRS — 80 requirements (FR-001 through FR-080), complete §AD traceability, all 17 UX journeys traced, 9 OQs dispositioned (6 resolved, 3 carried forward), boundary contracts formalized |

---

**Authority**: CS2 (Johan Ras / @APGI-cmy)
**Governed by**: `PRE_BUILD_STAGE_MODEL_CANON.md` v1.0.0, Stage 3 definition
**Wave**: maturion-isms#1365 — MMM Stage 3 wave-start authorization
**Upstream**: `MMM_app_description.md` v0.5.0 (§AD) | `ux-workflow-wiring-spec.md` v0.1.0 (§UX)
