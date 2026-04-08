Below is the complete ERM_FRONTEND_COMPONENT_MAP_v1.1.md, engineered to the same depth and standard as WRAC, PIT, and Course Crafter.

This map defines ALL UI components required for the ERM module, including:

Page hierarchy

Component definitions

UX behaviour

State stores

API bindings

Routing

Reusability model

Validation & access control behaviour

Integration touchpoints

Place in:
/Modules/Risk Management/ERM framework/ERM_FRONTEND_COMPONENT_MAP_v1.1.md

ERM_FRONTEND_COMPONENT_MAP_v1.1.md

Enterprise Risk Management — Frontend Component Map
Version 1.1
Aligned with: ERM_TRUE_NORTH_v1.0.md, ERM_DATABASE_SCHEMA_v1.1.md, ERM_EDGE_FUNCTIONS_v1.1.md
Framework Assumption: React + Next.js + Zustand/Redux + Tailwind (Maturion Standard UI Stack)

0. PURPOSE

This document defines every frontend component required to implement the ERM module UI.
It ensures:

Predictable, consistent UX

Modular, reusable components

Clear routing and navigation flows

Strong alignment with backend APIs

UX-safe workflows for risk governance

Zero ambiguity for Builders & UI engineers

The ERM UI is a mission-critical administrative interface.
It must be visually simple, but architecturally rigorous.

1. TOP-LEVEL UI STRUCTURE
/erm
  ├── dashboard
  ├── profiles
  │     ├── list
  │     ├── create
  │     ├── view/:profile_id
  │     ├── edit/:profile_id (draft only)
  ├── scales
  │     ├── likelihood/:profile_id
  │     ├── impact/:profile_id
  ├── heatmap/:profile_id
  ├── appetite/:profile_id
  ├── hierarchy/:profile_id
  ├── approvals/:profile_id
  ├── audit/:profile_id
  ├── export/:profile_id
  └── compare


These pages form the complete ERM workflow, matching the backend lifecycle.

2. GLOBAL UI COMPONENTS

These components are reused across multiple ERM pages and are considered foundational:

2.1 <ERMProfileSelector />

Dropdown + search

Used everywhere to switch profiles

Shows active/published tags

Displays version major.minor

2.2 <ERMStatusBadge />

Possible statuses:

Draft

Pending Approval

Approved

Published

Archived

2.3 <ERMVersionTag />

Displays semantic version (e.g., v1.3).

2.4 <ERMRoleGuard />

Wrapper component enforcing:

ERM_ADMIN

ERM_MANAGER

ERM_REVIEWER

Used for disabling/enabling buttons.

2.5 <ERMUnsavedChangesModal />

Prevents navigation loss during draft creation.

2.6 <ERMDeleteConfirm />

Used for impact/likelihood level removal (draft-only).

3. PAGE GROUP: PROFILES
3.1 /profiles/list

Components:

<PageHeader title="ERM Profiles" />

<ProfileTable />

<CreateProfileButton />

<ProfileStatusFilter />

<OrgTreeFilter />

<ProfileTable /> Columns:

Version

Status (badge)

Created By

Published At

“Open” Button

3.2 /profiles/create

Components:

<ProfileForm />

<OrgSelector />

<VersionInput />

<NotesEditor />

<CreateProfileActionBar />

On submit → calls erm_create_profile.

3.3 /profiles/view/:profile_id

Components:

<ProfileSummaryCard />

<ProfileMetadata />

<ProfileLifecycleTimeline />

<NavigateToLikelihood />

<NavigateToImpact />

<NavigateToHeatmap />

<NavigateToAppetite />

<NavigateToHierarchy />

<NavigateToApprovals />

<NavigateToAudit />

<ExportProfileButton />

<CompareProfileButton />

3.4 /profiles/edit/:profile_id (Draft only)

Components:

<DraftWarningBanner />

<EditProfileMeta />

<ProfileDraftSteps />

Draft steps:

Likelihood

Impact

Heatmap

Appetite

Hierarchy

Approvals

Publish

4. PAGE GROUP: SCALES (Likelihood & Impact)
4.1 /scales/likelihood/:profile_id

Components:

<LikelihoodEditor />

<LikelihoodLevelRow />

<AddLikelihoodLevelButton />

<ReorderLikelihoodLevels />

<SaveLikelihoodButton />

<ScalePreviewPanel />

<AI_SuggestLikelihoodButton />

<AI_LikelihoodSuggestionModal />

Behaviour:

Drag to reorder

Score uniqueness validation

Colour picker

Guidance popover

Version-safe (only draft)

4.2 /scales/impact/:profile_id

Components:

<DomainTabs /> (Safety, Security, Environmental, Operational, Financial, Reputation)

<ImpactEditor />

<ImpactLevelRow />

<AddImpactLevelButton />

<FinancialThresholdInput />

<SaveImpactButton />

<AI_SuggestImpactButton />

<AIImpactSuggestionModal />

5. PAGE GROUP: HEATMAP
5.1 /heatmap/:profile_id

Components:

<HeatmapGenerator />

<HeatmapCellCard />

<HeatmapMatrixView />

<HeatmapLegend />

<RiskLevelColourSelectors />

<AIHeatmapSuggestionButton />

<AIHeatmapSuggestionModal />

<SaveHeatmapButton />

Matrix behaviours:

Hover = show detailed cell metadata

Click cell = open cell editor

Locked once profile published

6. PAGE GROUP: APPETITE
6.1 /appetite/:profile_id

Components:

<AppetiteDomainCard />

<AppetiteLevelSelector />

<TriggerRangeInputs />

<AppetiteWorkflowRulePicker />

<SaveAppetiteButton />

<AIAppetiteSuggestionButton />

<AIAppetiteSuggestionModal />

Behaviour:

Validates appetite <= domain impact scale

Prevents illegal configurations

Inline warnings for appetite > High

7. PAGE GROUP: HIERARCHY & INHERITANCE
7.1 /hierarchy/:profile_id

Components:

<OrgHierarchyTree />

<InheritedRulesPanel />

<OverrideEditor />

<SaveInheritanceButton />

<ParentApprovalBanner />

<OrgNodeIndicator />

Behaviour:

Shows parent → child inheritance

Inline diff viewer for overrides

Parent-org approval gating

8. PAGE GROUP: APPROVALS
8.1 /approvals/:profile_id

Components:

<ApprovalStatusCard />

<ApprovalActionButtons /> (Approve / Reject)

<ApprovalCommentModal />

<ApprovalHistoryTable />

Status transitions:

draft → pending approval

pending approval → approved/rejected

approved → publish

9. PAGE GROUP: AUDIT
9.1 /audit/:profile_id

Components:

<AuditLogTable />

<DiffViewer />

<AI_ExplainChangeButton />

<AIChangeExplanationModal />

Columns:

Date

User

Action

Previous

New

AI & system events

10. PAGE GROUP: EXPORT
10.1 /export/:profile_id

Components:

<ExportOptionsCard />

<ExportFormatSelector /> (JSON, YAML, PDF, Bundle)

<ExportProfileButton />

<PreviewExportPanel />

<ExportSuccessModal />

11. PAGE GROUP: COMPARE PROFILES
11.1 /compare

Components:

<ProfileCompareSelector />

<SideBySideProfileCompare />

<LikelihoodCompareTable />

<ImpactCompareTable />

<HeatmapCompareMatrix />

<AppetiteCompareTable />

<HierarchyCompareViewer />

<AIProfileDiffExplainButton />

12. SUPPORTING COMPONENTS
12.1 Shared Input Components

<ColourPicker />

<NumericInput />

<TextBlockEditor />

<GuidanceTooltip />

<DomainSelector />

<VersionBadge />

13. STATE MANAGEMENT (Zustand / Redux)

ERM requires persistent client-side stores:

13.1 useERMProfileStore

activeProfileId

profileMeta

versions

status

13.2 useERMScaleStore

likelihood levels (draft)

impact levels (per domain)

temporary edits

13.3 useERMHeatmapStore

matrix cells

editing state

preview settings

13.4 useERMAppetiteStore

domain appetite

workflow rules

warnings

13.5 useERMHierarchyStore

inheritance map

overrides

13.6 useApprovalStore

approval history

approver actions

13.7 useAuditStore

audit logs

diff previews

13.8 useAISuggestionStore

AI suggestions

confidence levels

rationale text

14. ROUTING MAP
/erm
  /dashboard
  /profiles/list
  /profiles/create
  /profiles/view/:id
  /profiles/edit/:id
  /scales/likelihood/:id
  /scales/impact/:id
  /heatmap/:id
  /appetite/:id
  /hierarchy/:id
  /approvals/:id
  /audit/:id
  /export/:id
  /compare


Routing is nested under /erm for clarity and module-level isolation.

15. ACCESS CONTROL (UI LEVEL)
Role	View	Edit	Approve	Publish
ERM_ADMIN	✔	✔	✔	✔
ERM_MANAGER	✔	✔	✖	✖
ERM_REVIEWER	✔	✖	✔	✖
ORG_READONLY	✔	✖	✖	✖

UI enforces guards via <ERMRoleGuard />.

16. INTEGRATION TOUCHPOINTS

ERM UI integrates with:

Threat Module (retrieves likelihood scale)

Vulnerability (uses impact domain configuration)

RA Engine (consumes heatmap + appetite)

WRAC (heatmap visual mapping)

PIT (appetite-driven priority)

Bowtie (severity-driven barrier criticality)

Incident (severity classification)

Audit (view NCR → appetite relationship)

Remote Assurance (control degradation → appetite breach)

Integration logic documented in ERM_INTEGRATION_MAP_v1.0.md.

✔ END OF ERM_FRONTEND_COMPONENT_MAP_v1.1.md