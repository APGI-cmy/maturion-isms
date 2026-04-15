# MMM Stage 6 — QA-to-Red Catalog

**Module**: MMM — Maturity Model Management
**Artifact**: QA-to-Red Catalog (Stage 6)
**Version**: 0.1.0
**Date**: 2026-04-15
**Wave**: mmm-stage6-qa-to-red-20260415
**Issue**: maturion-isms#1384
**Produced By**: qa-builder (delegated by foreman-v2-agent v6.2.0)
**IAA Pre-Brief**: .agent-admin/assurance/iaa-wave-record-mmm-stage6-qa-to-red-20260415.md (SHA ee6ac83)
**Status**: RED — No implementation exists. All tests must fail until implementation satisfies them.

---

## Summary

| Domain | Description | Test Range | Count |
|--------|-------------|-----------|-------|
| D1 | User Entry & Onboarding (J-01–J-05) | T-MMM-S6-001–020 | 20 |
| D2 | Framework Lifecycle — Ingestion (J-06–J-08) | T-MMM-S6-021–050 | 30 |
| D3 | Assessment Execution (J-09–J-11) | T-MMM-S6-051–080 | 30 |
| D4 | Findings & Reporting (J-12–J-15) | T-MMM-S6-081–097 | 17 |
| D5 | Boundary Flows (MMM↔AIMC, MMM↔PIT, MMM↔KUC) | T-MMM-S6-098–112 | 15 |
| D6 | Roles & Permissions (J-16) | T-MMM-S6-113–120 | 8 |
| D7 | AI Interactions (J-17) | T-MMM-S6-121–128 | 8 |
| D8 | Cross-Cutting — Performance & Reliability | T-MMM-S6-129–138 | 10 |
| D9 | Cross-Cutting — Security & Compliance | T-MMM-S6-139–152 | 14 |
| D10 | Cross-Cutting — Infrastructure & Quality Gates | T-MMM-S6-153–164 | 12 |
| D11 | Product Identity & Governance | T-MMM-S6-165–176 | 12 |
| **TOTAL** | | **T-MMM-S6-001–176** | **176** |

**FR Coverage**: 80/80 (100%)
**TR Coverage**: 66/66 (all security/integration/quality TRs fully covered; all others by domain)
**Journey Coverage**: 17/17 (J-01 through J-17)

---

## Domain 1: User Entry & Onboarding (J-01 through J-05)

*Sources: FR-006, FR-007, FR-008, FR-009, FR-010, FR-011, FR-012*

### T-MMM-S6-001 — Landing Page Renders Without Authentication
- **Source**: FR-006 / Architecture §A3 (Public Routes)
- **Layer**: E2E
- **Description**: The MMM landing page (content_pages with page_slug='landing') renders fully without any authentication token. All CTAs (Free Assessment, Subscribe) are visible.
- **RED Condition**: No landing page route exists; request returns 404, authentication redirect, or blank page.
- **Acceptance Criteria**: GET /mmm renders HTTP 200; page contains heading, maturity explanation copy, "Start Free Assessment" CTA, and "Subscribe" CTA; no auth cookie required.

### T-MMM-S6-002 — Maturity Explanation/Tutorial Page Accessible Unauthenticated
- **Source**: FR-006 / Architecture §A3
- **Layer**: E2E
- **Description**: The maturity module explanation/tutorial page is reachable without sign-in, explaining what MMM does and how the maturity model works.
- **RED Condition**: Tutorial page returns auth redirect or does not exist.
- **Acceptance Criteria**: Unauthenticated GET to tutorial/explanation route returns HTTP 200 with readable maturity explanation content.

### T-MMM-S6-003 — Free Assessment Entry Navigable From Landing Page
- **Source**: FR-006 / Architecture §A3
- **Layer**: E2E
- **Description**: Clicking "Start Free Assessment" on the landing page navigates the unauthenticated user to the free assessment entry screen.
- **RED Condition**: CTA missing or navigates to a login wall.
- **Acceptance Criteria**: Clicking "Start Free Assessment" CTA routes to /mmm/free-assessment with HTTP 200; no auth required.

### T-MMM-S6-004 — Free Assessment Collects Domain-Level Responses Without Sign-Up
- **Source**: FR-007 / Architecture §A3, §A6
- **Layer**: Integration
- **Description**: The free assessment workflow presents domain-level maturity questions and collects responses without requiring user registration. Session tracked via session_id.
- **RED Condition**: Assessment form requires authentication or sign-up before displaying questions.
- **Acceptance Criteria**: POST /api/free-assessment/responses accepts domain-level responses with only a session_id; no JWT required; responses persisted in free_assessments.

### T-MMM-S6-005 — Free Assessment Calculates and Stores Baseline Maturity Score
- **Source**: FR-007 / Architecture §A6
- **Layer**: Integration
- **Description**: On completion of domain-level responses, the system calculates a baseline_maturity score and stores it in the free_assessments table against the session_id.
- **RED Condition**: No calculation occurs; baseline_maturity field is null or absent from free_assessments.
- **Acceptance Criteria**: POST /api/free-assessment/complete returns a response body containing baseline_maturity (numeric 1–5); record in free_assessments.baseline_maturity is non-null and within range.

### T-MMM-S6-006 — Free Assessment Results Display Maturity Position Explanation
- **Source**: FR-007 / Architecture §A6
- **Layer**: E2E
- **Description**: After completing the free assessment, the results screen displays the calculated maturity level, a readable explanation of the user's current maturity position, and a description of what that level means.
- **RED Condition**: Results screen is blank, shows raw JSON, or is missing explanation text.
- **Acceptance Criteria**: Results page renders with: (a) maturity level badge; (b) level description paragraph; (c) explanation of current vs next level.

### T-MMM-S6-007 — Subscribe Prompt Presented After Free Assessment Completion
- **Source**: FR-007 / Architecture §A6
- **Layer**: E2E
- **Description**: After viewing free assessment results, a clear subscription prompt ("Subscribe to continue") is displayed, linking to the subscription flow.
- **RED Condition**: No subscribe prompt appears; user has no pathway to subscription after results.
- **Acceptance Criteria**: Results screen contains a "Subscribe to continue" CTA that navigates to the subscription/sign-up flow (J-03).

### T-MMM-S6-008 — Free Assessment Baseline Locked on Subscription
- **Source**: FR-008 / Architecture §A6
- **Layer**: Integration
- **Description**: When a user subscribes after completing the free assessment, the free_assessments.baseline_maturity value is locked and linked to the new organisation record. It cannot be modified post-lock.
- **RED Condition**: Baseline not linked on subscription; or baseline is mutable post-lock.
- **Acceptance Criteria**: On subscription completion, organisations.baseline_maturity_locked = true; free_assessments.locked_at timestamp set; subsequent attempts to modify baseline_maturity via API return HTTP 409.

### T-MMM-S6-009 — Framework Configuration Gated Until Baseline Established
- **Source**: FR-008 / Architecture §A6, §A7
- **Layer**: Integration
- **Description**: If a user attempts to access framework configuration screens without a locked baseline, the system presents a prompt to complete the free assessment first.
- **RED Condition**: Framework configuration screens accessible without baseline established; no gate enforced.
- **Acceptance Criteria**: GET /mmm/framework/configure returns HTTP 302 redirect to /mmm/free-assessment when organisations.baseline_maturity_locked = false; gate confirmed via API middleware test.

### T-MMM-S6-010 — Maturity Context Persists and Updates Across Workflows
- **Source**: FR-009 / Architecture §A7, §A9
- **Layer**: Integration
- **Description**: The maturity context object (current level, domain levels, target level, gap) is consistently available and up to date at all workflow screens after baseline is set.
- **RED Condition**: Maturity context absent from API responses; dashboard shows stale or null context.
- **Acceptance Criteria**: GET /api/organisations/:id/maturity-context returns JSON with current_level, domain_levels[], target_level, and current_gap fields; values match maturity_scores records.

### T-MMM-S6-011 — AIMC Call Payloads Include Maturity Context
- **Source**: FR-009 / Architecture §A9, §A12
- **Layer**: Integration
- **Description**: When MMM makes AIMC calls (evidence evaluation, recommendations, chat), the request payload includes the organisation's current maturity context fields.
- **RED Condition**: AIMC calls sent without maturity_context field; context not forwarded.
- **Acceptance Criteria**: Mock AIMC interceptor confirms all outbound AIMC calls include maturity_context: { current_level, target_level, gap } in request body.

### T-MMM-S6-012 — Subscription Flow Presents Plans, Collects Registration, Initiates Payment
- **Source**: FR-010 / Architecture §A4
- **Layer**: E2E
- **Description**: The subscription flow presents at least one plan, collects user email/password/name, and initiates the payment/plan activation process. User redirected to org onboarding on completion.
- **RED Condition**: Subscription page missing; no plan options shown; registration fails.
- **Acceptance Criteria**: GET /mmm/subscribe renders plan selection; POST /api/auth/register creates user; POST /api/subscriptions creates subscriptions record; user redirected to /mmm/onboarding.

### T-MMM-S6-013 — Subscription Creates profiles and subscriptions Records
- **Source**: FR-010 / Architecture §A4
- **Layer**: Integration
- **Description**: On subscription completion, both a profiles record and a subscriptions record exist in the database for the new user, with correct foreign key linkage.
- **RED Condition**: profiles or subscriptions records absent after sign-up; foreign keys null.
- **Acceptance Criteria**: After POST /api/auth/register + plan selection: profiles.id non-null, profiles.user_id matches auth UID; subscriptions.profile_id links to profiles.id; status = 'active'.

### T-MMM-S6-014 — Organisation Onboarding Collects All Mandatory Fields
- **Source**: FR-011 / Architecture §A5
- **Layer**: E2E
- **Description**: The organisation onboarding form collects: name, industry/sector, hierarchy/site/operation context, maturity intent, operating context, and AI contextualisation fields. All mandatory fields validated before proceeding.
- **RED Condition**: Onboarding form missing mandatory fields; form submittable with nulls.
- **Acceptance Criteria**: POST /api/organisations with missing mandatory fields returns HTTP 422 with validation errors; successful submission creates organisations record with all five mandatory field groups populated.

### T-MMM-S6-015 — onboarding_complete Flag Set Before Framework Fork Presented
- **Source**: FR-011 / Architecture §A5
- **Layer**: Integration
- **Description**: The framework-origin fork screen is not accessible until organisations.onboarding_complete = true. The flag is set only after all mandatory onboarding fields are confirmed.
- **RED Condition**: Fork screen accessible with onboarding_complete = false; flag never set.
- **Acceptance Criteria**: GET /mmm/framework/fork redirects to /mmm/onboarding when onboarding_complete = false; PATCH /api/organisations/:id/complete-onboarding sets onboarding_complete = true; subsequent fork access returns HTTP 200.

### T-MMM-S6-016 — Framework-Origin Fork Presented After Onboarding
- **Source**: FR-012 / Architecture §A5, §A6
- **Layer**: E2E
- **Description**: Immediately after onboarding_complete is confirmed, user is navigated to the framework-origin fork screen presenting Mode A (Verbatim Upload) and Mode B (New Criteria Creation) options.
- **RED Condition**: No fork screen exists; user lands on generic dashboard without choice.
- **Acceptance Criteria**: Completion of onboarding navigates to /mmm/framework/fork; page displays exactly two options labelled "Upload Existing Framework" (Mode A) and "Create New Framework" (Mode B).

### T-MMM-S6-017 — Fork Records origin_mode in frameworks Table
- **Source**: FR-012 / Architecture §A6
- **Layer**: Integration
- **Description**: When user selects Mode A or Mode B from the fork screen, a frameworks record is created or updated with origin_mode = 'verbatim_import' or 'ai_generated' respectively.
- **RED Condition**: frameworks.origin_mode is null or not set; no frameworks record created on fork selection.
- **Acceptance Criteria**: POST /api/frameworks with mode 'A' → frameworks.origin_mode = 'verbatim_import'; mode 'B' → frameworks.origin_mode = 'ai_generated'.

### T-MMM-S6-018 — Mode A (Verbatim Upload) Pathway Initiated From Fork
- **Source**: FR-012 / Architecture §A6
- **Layer**: E2E
- **Description**: Selecting "Upload Existing Framework" from the fork screen navigates the user to the verbatim upload interface (J-06 entry point).
- **RED Condition**: Mode A selection does not navigate to upload interface; broken routing.
- **Acceptance Criteria**: Clicking "Upload Existing Framework" routes to /mmm/framework/upload; page loads upload interface with framework-source file input.

### T-MMM-S6-019 — Mode B (New Criteria Creation) Pathway Initiated From Fork
- **Source**: FR-012 / Architecture §A6
- **Layer**: E2E
- **Description**: Selecting "Create New Framework" from the fork screen navigates the user to the AI-assisted new criteria creation interface (J-07 entry point).
- **RED Condition**: Mode B selection does not navigate to criteria creation; broken routing.
- **Acceptance Criteria**: Clicking "Create New Framework" routes to /mmm/framework/create; page loads criteria creation interface with AI generation controls.

### T-MMM-S6-020 — Free Assessment session_id Persists Across Sign-Up Boundary
- **Source**: FR-007, FR-008 / Architecture §A4, §A6
- **Layer**: Integration
- **Description**: The session_id established during the free assessment is preserved and linked to the newly created user profile on sign-up, so the baseline is not lost.
- **RED Condition**: session_id not carried through sign-up; baseline orphaned; free_assessments.profile_id null after sign-up.
- **Acceptance Criteria**: POST /api/auth/register with session_id in request body links free_assessments.session_id to profiles.id; free_assessments.profile_id non-null post-registration.

---

## Domain 2: Framework Lifecycle — Ingestion (J-06 through J-08)

*Sources: FR-013–FR-028, FR-056, FR-057*

### T-MMM-S6-021 — Framework-Source and Evidence Uploads Route Through Common KUC Infrastructure
- **Source**: FR-013, FR-055 / Architecture §A8
- **Layer**: Integration
- **Description**: Both POST /api/upload/framework-source and POST /api/upload/evidence requests are handled by the shared KUC (Knowledge Upload Centre) infrastructure layer.
- **RED Condition**: Uploads handled by separate independent stacks; no shared infrastructure.
- **Acceptance Criteria**: Both endpoints share the same upload middleware, document-management service, and KUC processing pipeline; confirmed via integration test intercepting both paths.

### T-MMM-S6-022 — No Separate Upload Pathways Outside Common Infrastructure
- **Source**: FR-013 / Architecture §A8
- **Layer**: Unit
- **Description**: Static analysis and code search confirm that no upload routes outside /api/upload/framework-source and /api/upload/evidence exist in the MMM codebase.
- **RED Condition**: Additional upload endpoints created bypassing KUC.
- **Acceptance Criteria**: grep/AST scan of codebase finds no file upload handlers outside the declared KUC-routed endpoints; test fails if any additional upload path is found.

### T-MMM-S6-023 — Document Role Classification Assigned at Upload Time
- **Source**: FR-014 / Architecture §A8
- **Layer**: Integration
- **Description**: Every document uploaded to MMM receives a non-null document_role classification at upload time.
- **RED Condition**: documents.document_role is null after upload; no classification occurs.
- **Acceptance Criteria**: POST /api/upload/* returns response with document_role field set; documents table record has non-null document_role for every upload.

### T-MMM-S6-024 — All Five Document Roles Accepted and Stored
- **Source**: FR-014 / Architecture §A8
- **Layer**: Unit
- **Description**: The document_role field accepts and stores exactly the five declared roles: criteria_source, knowledge_source, evidence, guidance, template.
- **RED Condition**: Role field validation missing; arbitrary values accepted or declared roles rejected.
- **Acceptance Criteria**: Unit test verifies enum constraint: five valid values accepted, any other value returns HTTP 422; database constraint enforced.

### T-MMM-S6-025 — Document Metadata Fields Populated on Upload
- **Source**: FR-015 / Architecture §A8
- **Layer**: Integration
- **Description**: All four metadata fields (scope_type, origin_mode, document_role, framework_status) are present and populated on every document record.
- **RED Condition**: Metadata fields absent, null, or not enforced on upload.
- **Acceptance Criteria**: After upload, documents record has non-null values for scope_type, origin_mode, document_role, and framework_status; each field accepts only its declared enum values.

### T-MMM-S6-026 — Framework-Source Pipeline Functionally Separate From Evidence Pipeline
- **Source**: FR-016 / Architecture §A8
- **Layer**: Integration
- **Description**: After upload, documents with document_role = 'criteria_source' are processed through the structure-extraction pipeline only; documents with document_role = 'evidence' are processed through the evaluation/scoring pipeline only.
- **RED Condition**: Evidence documents routed to framework parser; framework-source documents routed to scoring.
- **Acceptance Criteria**: Integration test uploads document with role='criteria_source'; confirms it triggers parse_jobs, not score_proposals. Uploads document with role='evidence'; confirms it triggers score_proposals, not parse_jobs.

### T-MMM-S6-027 — Evidence Documents Not Processed Through Framework Parser
- **Source**: FR-016 / Architecture §A8
- **Layer**: Unit
- **Description**: The framework parsing edge function/service rejects any document that does not have document_role = 'criteria_source'.
- **RED Condition**: Parser accepts all document roles without discrimination.
- **Acceptance Criteria**: Unit test: framework parser invoked with role='evidence' document returns early/error; no parse_jobs record created; confirmed via mock.

### T-MMM-S6-028 — Three-Level Domain→MPS→Criteria Hierarchy Enforced
- **Source**: FR-017 / Architecture §A9
- **Layer**: Unit
- **Description**: MMM rejects any attempt to publish a framework that does not have all three hierarchy levels (Domain, MPS, Criteria) populated.
- **RED Condition**: Flat or two-tier frameworks accepted for publication; hierarchy validation absent.
- **Acceptance Criteria**: POST /api/frameworks/:id/publish returns HTTP 422 if any Domain has no MPSs, or any MPS has no Criteria; success only when full three-tier structure present.

### T-MMM-S6-029 — Hierarchical Numbering Populated on Approval
- **Source**: FR-018 / Architecture §A9
- **Layer**: Integration
- **Description**: When a framework moves to approved state, sequence_number fields are populated on all Domain, MPS, and Criteria records following the 1 / 1.1 / 1.1.1 convention.
- **RED Condition**: sequence_number fields null after approval; numbering not assigned.
- **Acceptance Criteria**: After PATCH /api/frameworks/:id/approve, all domains.sequence_number, mps.sequence_number, and criteria.sequence_number fields are non-null with correct hierarchical format.

### T-MMM-S6-030 — No Retroactive Renumbering Without Audit Trail
- **Source**: FR-018 / Architecture §A9
- **Layer**: Integration
- **Description**: Any post-approval change to sequence_number values creates an audit_log entry recording the before/after state and the authorising user.
- **RED Condition**: Renumbering allowed without audit trail; no constraint on modification.
- **Acceptance Criteria**: PATCH /api/criteria/:id with changed sequence_number on an approved framework creates an audit_log record with action='renumber', before_state, after_state, user_id, and timestamp fields.

### T-MMM-S6-031 — Five Default Canonical Domains Used for New Frameworks
- **Source**: FR-019 / Architecture §A9
- **Layer**: Unit
- **Description**: When a new framework is initialised via Mode B (New Criteria Creation) without an import, the system seeds it with the five canonical domains: Leadership and Governance, Process Integrity, People and Culture, Protection, Proof it Works.
- **RED Condition**: New framework has no default domains; domains are blank or custom.
- **Acceptance Criteria**: POST /api/frameworks with origin_mode='ai_generated' and no import creates five domain records matching the canonical names; confirmed via unit test of framework seeding service.

### T-MMM-S6-032 — Mode A Upload Accepted via Framework-Source Endpoint
- **Source**: FR-020, FR-056 / Architecture §A8, §A10
- **Layer**: Integration
- **Description**: POST /api/upload/framework-source accepts a document file upload in Mode A flow and returns a document record with document_role='criteria_source'.
- **RED Condition**: Endpoint returns 404 or 405; upload fails; no document record created.
- **Acceptance Criteria**: POST /api/upload/framework-source with multipart/form-data file returns HTTP 201; documents record created with document_role='criteria_source'; parse_jobs record initiated.

### T-MMM-S6-033 — AIMC Parses Mode A Upload to Domain→MPS→Criteria Structure
- **Source**: FR-020 / Architecture §A10, §A12
- **Layer**: Integration
- **Description**: After framework-source upload, the system dispatches an AIMC parse request and stores the result as parsed_domains, parsed_mps, and parsed_criteria records.
- **RED Condition**: No AIMC parse call made; no parsed_* records created.
- **Acceptance Criteria**: After upload, parse_jobs record has status='completed'; parsed_domains, parsed_mps, and parsed_criteria records exist linked to the framework_id; AIMC mock confirms POST /api/ai/framework-parse was called.

### T-MMM-S6-034 — Parse Ambiguities Flagged in parse_ambiguities
- **Source**: FR-020, FR-021 / Architecture §A10
- **Layer**: Integration
- **Description**: When AIMC returns ambiguous source content during Mode A parsing, ambiguity records are created in parse_ambiguities with source_anchor and proposed_interpretation fields.
- **RED Condition**: Ambiguities silently discarded or auto-resolved; no parse_ambiguities records.
- **Acceptance Criteria**: AIMC mock returns a response with ambiguous items; parse_ambiguities records created with non-null source_anchor; human review UI displays them before publication.

### T-MMM-S6-035 — Every Mode A Criterion Has Non-Null source_anchor
- **Source**: FR-021 / Architecture §A10
- **Layer**: Integration
- **Description**: No criterion may be added to the parsed framework structure without a corresponding source_anchor reference to the uploaded document content.
- **RED Condition**: Criteria created with null source_anchor; hallucinated content without source.
- **Acceptance Criteria**: Query SELECT * FROM parsed_criteria WHERE framework_id = :id AND source_anchor IS NULL returns zero rows after any Mode A parse operation.

### T-MMM-S6-036 — Mode B AI Generates Framework Structure via AIMC
- **Source**: FR-022 / Architecture §A11, §A12
- **Layer**: Integration
- **Description**: Mode B framework creation triggers a call to POST /api/ai/framework-generate via AIMC, returning proposed domains, MPSs, criteria, and level descriptors specific to the organisation context.
- **RED Condition**: No AIMC generate call; static placeholder framework returned; no org-specific content.
- **Acceptance Criteria**: POST /api/frameworks/generate dispatches AIMC call with org_context payload; response stored in proposed_domains, proposed_mps, proposed_criteria, proposed_level_descriptors tables; each record has non-null content.

### T-MMM-S6-037 — Mode B Generates Level Descriptors Per Criterion
- **Source**: FR-022 / Architecture §A11
- **Layer**: Integration
- **Description**: For each generated criterion, the system creates proposed_level_descriptors records covering all five maturity levels (1–5).
- **RED Condition**: Level descriptors absent; proposed_level_descriptors table empty after generation.
- **Acceptance Criteria**: After Mode B generation, SELECT COUNT(*) FROM proposed_level_descriptors WHERE criteria_id = :id returns exactly 5 records (one per maturity level) for each criterion.

### T-MMM-S6-038 — AI-Proposed Structures Support Edit, Delete, Recompile, and Chat
- **Source**: FR-023 / Architecture §A11
- **Layer**: E2E
- **Description**: For all AI-proposed elements (MPSs, criteria, intent statements, level descriptors), the UI provides Edit, Delete, Recompile, and AI Chat action controls.
- **RED Condition**: Actions absent; user cannot modify AI proposals; read-only display only.
- **Acceptance Criteria**: E2E test confirms: PATCH /api/proposed-criteria/:id (edit), DELETE /api/proposed-criteria/:id (delete), POST /api/proposed-criteria/:id/recompile (recompile), POST /api/ai/chat with context (chat) all return success; UI renders all four controls on each proposed element.

### T-MMM-S6-039 — Intent Statement Field Present on MPS Records
- **Source**: FR-024 / Architecture §A9
- **Layer**: Unit
- **Description**: MPS table schema includes an intent_statement text field; the field is nullable pre-approval and non-null post-approval for published frameworks.
- **RED Condition**: intent_statement column absent from mps table; field not exposed in API.
- **Acceptance Criteria**: Database migration includes mps.intent_statement column; GET /api/mps/:id returns intent_statement field; PATCH /api/mps/:id/intent-statement updates the field and logs change.

### T-MMM-S6-040 — Criteria Card Presents All Ten Required Elements
- **Source**: FR-025 / Architecture §A9, §A14
- **Layer**: E2E
- **Description**: The criterion drill-down screen presents all ten elements: (a) criterion statement, (b) sequence number, (c) evidence state summary, (d) current maturity level, (e) achieved vs remaining, (f) tutorial/help component, (g) AI chat, (h) evidence access, (i) findings access, (j) level-descriptor visibility.
- **RED Condition**: One or more criterion card elements absent from rendered screen.
- **Acceptance Criteria**: E2E test navigates to criterion drill-down and confirms all ten element identifiers present in DOM (by data-testid attributes); no element renders as null or placeholder.

### T-MMM-S6-041 — Level 1 User Approval Available at MPS, Intent, and Criteria Levels
- **Source**: FR-026 / Architecture §A13
- **Layer**: E2E
- **Description**: From the framework review screen, users can trigger Level 1 approval on individual MPSs, Intent Statements, and Criteria items.
- **RED Condition**: Approval button absent at item level; approval only available at top level.
- **Acceptance Criteria**: POST /api/approvals with level=1 and target_type=mps|intent_statement|criterion creates approvals record; response HTTP 201; UI renders approval button at each level.

### T-MMM-S6-042 — Level 2 Domain Approval Workflow Enforced
- **Source**: FR-026 / Architecture §A13
- **Layer**: Integration
- **Description**: Level 2 domain approval requires all Level 1 items within the domain to be approved first. Once submitted, domain changes require controlled unlock/review tracked in approval_comments.
- **RED Condition**: Level 2 approval available without Level 1 prerequisites; no sequencing enforced.
- **Acceptance Criteria**: POST /api/approvals with level=2 and target_type=domain returns HTTP 422 if any child MPS/criteria items have approval_status != 'level1_approved'; success creates level-2 approvals record.

### T-MMM-S6-043 — Level 3 Executive Sign-Off Required Before Publication
- **Source**: FR-026 / Architecture §A13
- **Layer**: Integration
- **Description**: Framework publication is blocked unless a Level 3 executive sign-off approval record exists for the framework.
- **RED Condition**: Publication succeeds without Level 3 sign-off; approval gate absent.
- **Acceptance Criteria**: POST /api/frameworks/:id/publish returns HTTP 422 with error "level3_approval_required" when no approvals record with level=3 and status='approved' exists for the framework.

### T-MMM-S6-044 — Approval Comments Recorded in approval_comments
- **Source**: FR-026 / Architecture §A13
- **Layer**: Integration
- **Description**: During the approval workflow, all back-and-forth comments (approval notes, rejection reasons, unlock requests) are stored in the approval_comments table.
- **RED Condition**: approval_comments table absent; comments discarded or not persisted.
- **Acceptance Criteria**: POST /api/approval-comments creates record with approval_id, author_id, comment_text, and created_at; GET /api/approvals/:id/comments returns array of comments.

### T-MMM-S6-045 — Framework Publication Activates All Six Platform Capabilities
- **Source**: FR-027 / Architecture §A13, §A14
- **Layer**: Integration
- **Description**: On framework publication, all six platform capabilities activate: (a) live maturity platform, (b) evidence activity, (c) dashboard, (d) achievement tracking, (e) current-to-target movement, (f) PIT handoff capability.
- **RED Condition**: Publication creates a record but does not activate any downstream capabilities.
- **Acceptance Criteria**: After POST /api/frameworks/:id/publish: frameworks.status='published'; GET /api/organisations/:id/capabilities returns all six capability flags = true; evidence upload endpoint accepts submissions.

### T-MMM-S6-046 — publications Record Created With Version and Timestamp
- **Source**: FR-027 / Architecture §A13
- **Layer**: Integration
- **Description**: Framework publication creates a publications record with framework_id, version (semantic), published_at timestamp, and published_by user reference.
- **RED Condition**: No publications record created; version/timestamp fields absent.
- **Acceptance Criteria**: After POST /api/frameworks/:id/publish, SELECT * FROM publications WHERE framework_id = :id returns one record with non-null version, published_at, published_by, and status='active'.

### T-MMM-S6-047 — MVP Fork Screen Has Exactly Two Options (No Hybrid Mode)
- **Source**: FR-028 / Architecture §A5
- **Layer**: E2E
- **Description**: The framework-origin fork screen presents exactly two options (Mode A and Mode B). No hybrid mode option appears in the MVP build.
- **RED Condition**: Three or more options shown; hybrid mode present in UI.
- **Acceptance Criteria**: E2E test counts option buttons on /mmm/framework/fork and confirms exactly 2; no element with text containing "hybrid" or "Mode C" exists in DOM.

### T-MMM-S6-048 — Framework-Source Ingestion Creates parse_jobs Record
- **Source**: FR-056 / Architecture §A10
- **Layer**: Integration
- **Description**: Every framework-source upload triggers creation of a parse_jobs record linking document_id to framework_id with status='pending', then transitions to 'processing' and 'completed'.
- **RED Condition**: No parse_jobs record created; parse job tracking absent.
- **Acceptance Criteria**: POST /api/upload/framework-source creates parse_jobs record within 1s; status transitions to 'completed' within test timeout; GET /api/parse-jobs/:id returns final status.

### T-MMM-S6-049 — Evidence Ingestion Creates score_proposals Record
- **Source**: FR-057 / Architecture §A15
- **Layer**: Integration
- **Description**: Every evidence upload via POST /api/upload/evidence triggers AIMC evaluation and creates a score_proposals record with criterion_id, proposed_level, confidence, and rationale.
- **RED Condition**: No score_proposals record created; AIMC evaluation not triggered.
- **Acceptance Criteria**: POST /api/upload/evidence returns HTTP 201; score_proposals record created with non-null proposed_level (1–5) and confidence (0–1); maturity_scores updated.

### T-MMM-S6-050 — Framework-Source and Evidence Ingestion Use Separate API Paths
- **Source**: FR-016, FR-056, FR-057 / Architecture §A8
- **Layer**: Unit
- **Description**: POST /api/upload/framework-source and POST /api/upload/evidence are distinct routes with separate processing logic, even though they share KUC infrastructure.
- **RED Condition**: Single generic upload endpoint handles both without path separation.
- **Acceptance Criteria**: Route table test confirms /api/upload/framework-source and /api/upload/evidence are separate route handlers; middleware chain differs by document_role; confirmed via router unit test.

---

## Domain 3: Assessment Execution (J-09 through J-11)

*Sources: FR-029–FR-043, TR-004, TR-007, TR-008*

### T-MMM-S6-051 — Criterion Drill-Down Navigable From Domain→MPS→Criterion
- **Source**: FR-029, FR-077 / Architecture §A14
- **Layer**: E2E
- **Description**: From a published framework, the user can navigate Domain → MPS → Criterion with breadcrumb context visible at each level.
- **RED Condition**: Navigation breaks at any level; breadcrumb absent or incorrect.
- **Acceptance Criteria**: E2E navigation path /mmm/framework/:id → domain/:dId → mps/:mId → criterion/:cId succeeds at each step; breadcrumb component shows current Domain, MPS, and Criterion labels.

### T-MMM-S6-052 — Evidence Workspace Modal Opens From Criterion
- **Source**: FR-030, FR-078 / Architecture §A14
- **Layer**: E2E
- **Description**: Clicking "Open Evidence Workspace" on a criterion screen opens the evidence workspace modal. The modal is closable and collapsible; the framework hierarchy context remains visible.
- **RED Condition**: Modal does not open; workspace renders as separate page losing context; collapse not available.
- **Acceptance Criteria**: Clicking evidence workspace CTA renders modal overlay; modal has close button; framework breadcrumb visible behind/alongside modal; collapse/expand controls functional.

### T-MMM-S6-053 — Evidence Workspace Displays Existing Evidence Items
- **Source**: FR-030 / Architecture §A14
- **Layer**: Integration
- **Description**: The evidence workspace modal displays all evidence items currently linked to the criterion, including file name, type, upload date, and current scoring status.
- **RED Condition**: Existing evidence not displayed; workspace shows empty state for criteria with evidence.
- **Acceptance Criteria**: GET /api/criteria/:id/evidence returns array of evidence items; each item has id, name, type, uploaded_at, and scoring_status fields; workspace renders all items.

### T-MMM-S6-054 — AI Score Proposal and Confidence Level Visible in Workspace
- **Source**: FR-030 / Architecture §A14, §A12
- **Layer**: Integration
- **Description**: The evidence workspace displays the current AI score proposal (proposed_level 1–5) and confidence level (0–1) from score_proposals for the criterion.
- **RED Condition**: Score proposal absent from workspace UI; confidence not shown.
- **Acceptance Criteria**: GET /api/criteria/:id/score-proposals returns latest proposal with proposed_level and confidence fields; workspace UI renders both values with human-readable confidence label.

### T-MMM-S6-055 — Human Can Accept or Override AI Score
- **Source**: FR-030 / Architecture §A14
- **Layer**: Integration
- **Description**: The evidence workspace provides Accept and Override controls for the AI score proposal. Accept confirms the proposal; Override allows the user to select a different level with a mandatory rationale.
- **RED Condition**: No accept/override controls; AI score auto-applied; rationale field absent on override.
- **Acceptance Criteria**: POST /api/score-proposals/:id/accept creates confirmed maturity_scores record; POST /api/score-proposals/:id/override with new_level and rationale creates override_log record; both update maturity_scores.

### T-MMM-S6-056 — All Nine Evidence Types Uploadable/Linkable
- **Source**: FR-031 / Architecture §A14
- **Layer**: Integration
- **Description**: All nine evidence types (files, photos, voice/audio, interview content, URL links, system integrations, PIT-linked evidence, Risk Management evidence, Incident Management evidence) are accepted via the evidence workspace.
- **RED Condition**: One or more evidence types return an error; type field not persisted.
- **Acceptance Criteria**: Integration test submits one item per evidence type to POST /api/upload/evidence; all nine return HTTP 201; evidence.type field matches submitted type; no type returns HTTP 4xx/5xx.

### T-MMM-S6-057 — Evidence Decision Flow All Eight States Reachable
- **Source**: FR-032 / Architecture §A14
- **Layer**: Integration
- **Description**: The evidence workflow supports transitions through all eight states: upload, AI evaluation, human acceptance, human query, escalation, override, re-evaluation, audit trail logging.
- **RED Condition**: One or more states unreachable; transitions not persisted in audit trail.
- **Acceptance Criteria**: Integration test drives evidence item through each state via API calls; each state transition creates an audit_log record; final state 'audit_logged' reachable from 'override' and 're-evaluation'.

### T-MMM-S6-058 — Evidence State Transitions Recorded in Audit Trail
- **Source**: FR-032 / Architecture §A14, §A16
- **Layer**: Integration
- **Description**: Every evidence state transition (accept, query, escalate, override, re-evaluate) creates an override_log or audit_log record with actor, timestamp, and from/to state.
- **RED Condition**: Transitions not logged; audit trail empty after evidence workflow.
- **Acceptance Criteria**: After each state transition API call, SELECT * FROM audit_log WHERE entity_type='evidence' AND entity_id=:id returns a record with action, performed_by, created_at, from_state, to_state fields.

### T-MMM-S6-059 — All Four Non-Acceptance Paths Available
- **Source**: FR-033 / Architecture §A14
- **Layer**: Integration
- **Description**: The evidence workspace supports all four non-acceptance paths: (a) AI rating disputed (override), (b) insufficient due to budget/resource/skills (gap tracking), (c) criterion claimed not relevant, (d) evidence not relevant to criterion.
- **RED Condition**: One or more paths absent; no distinct status recorded per path.
- **Acceptance Criteria**: POST /api/evidence/:id/non-accept with reason_code in [dispute, insufficient, criterion_na, evidence_na] all return HTTP 200; evidence.status reflects distinct value per reason_code.

### T-MMM-S6-060 — Budget/Resource Path Creates PIT-Eligible Gap Record
- **Source**: FR-033 / Architecture §A14, §A17
- **Layer**: Integration
- **Description**: When evidence non-acceptance is due to budget/resource/skills constraints (reason_code='insufficient'), a gap record is created that is eligible for PIT export.
- **RED Condition**: Gap record not created; PIT export does not include constraint-based gaps.
- **Acceptance Criteria**: POST /api/evidence/:id/non-accept with reason_code='insufficient' creates findings record with gap_type='resource_constraint' and pit_eligible=true; record appears in GET /api/pit-export/preview.

### T-MMM-S6-061 — Evidence effective_date and review_frequency Fields Present
- **Source**: FR-034 / Architecture §A14
- **Layer**: Unit
- **Description**: The evidence table schema includes effective_date (date) and review_frequency (interval/text) fields. Both are mandatory for submitted evidence.
- **RED Condition**: Fields absent from schema; API accepts evidence without effective_date.
- **Acceptance Criteria**: POST /api/upload/evidence without effective_date returns HTTP 422; with valid effective_date and review_frequency returns HTTP 201; both fields present in returned evidence object.

### T-MMM-S6-062 — Stale Flag Visible When Review Date Passes
- **Source**: FR-034 / Architecture §A14
- **Layer**: Integration
- **Description**: Evidence items whose review date has passed are flagged as stale (evidence.is_stale = true) and displayed with a stale indicator in the evidence workspace.
- **RED Condition**: Stale flag never set; is_stale always false; no visual indicator in workspace.
- **Acceptance Criteria**: Seeded evidence with review_frequency set to past date triggers staleness check; evidence.is_stale = true; GET /api/criteria/:id/evidence returns is_stale=true; workspace renders stale badge.

### T-MMM-S6-063 — Re-Evaluate Action Invokes AIMC and Updates maturity_scores
- **Source**: FR-035 / Architecture §A14, §A12
- **Layer**: Integration
- **Description**: Clicking "Re-evaluate" on a criterion triggers a fresh AIMC evaluation call and updates score_proposals and maturity_scores records.
- **RED Condition**: Re-evaluate action missing; clicking it does nothing; AIMC not called; scores not updated.
- **Acceptance Criteria**: POST /api/criteria/:id/re-evaluate dispatches AIMC call (confirmed via mock); new score_proposals record created with updated proposed_level; maturity_scores updated; override_log records the re-evaluation event.

### T-MMM-S6-064 — Human Override Logged With All Five Required Fields
- **Source**: FR-036 / Architecture §A14, §A16
- **Layer**: Integration
- **Description**: Every human override of AI scoring is recorded in override_log with all five required fields: previous_level, new_level, rationale, user_id, and timestamp.
- **RED Condition**: override_log record missing one or more fields; partial records accepted.
- **Acceptance Criteria**: POST /api/score-proposals/:id/override with new_level and rationale creates override_log record; SELECT with all five columns shows non-null values; override without rationale returns HTTP 422.

### T-MMM-S6-065 — Only Five Maturity Scale Values Accepted in maturity_scores
- **Source**: FR-037 / Architecture §A9, §A15
- **Layer**: Unit
- **Description**: The maturity_scores table and score_proposals table enforce a check constraint accepting only values 1–5 (Basic, Reactive, Compliant, Proactive, Resilient).
- **RED Condition**: Values 0, 6, or arbitrary decimals accepted without error.
- **Acceptance Criteria**: INSERT/UPDATE to maturity_scores with level = 0 returns constraint violation; level = 6 returns constraint violation; levels 1–5 all succeed.

### T-MMM-S6-066 — Document-Only Evidence Capped at Level 3 (Compliant)
- **Source**: FR-038 / Architecture §A15
- **Layer**: Unit
- **Description**: When all evidence items for a criterion are document-type only (no live/integrated evidence), the AIMC scoring model returns at most level 3 (Compliant) as proposed_level.
- **RED Condition**: AIMC proposes level 4 or 5 for document-only evidence without constraint.
- **Acceptance Criteria**: Unit test of scoring service with evidence_types=['document'] confirms proposed_level ≤ 3; scoring service rejects AI proposal > 3 for document-only evidence and caps it.

### T-MMM-S6-067 — Override to Level 4/5 With Document-Only Evidence Requires Rationale
- **Source**: FR-038 / Architecture §A15
- **Layer**: Integration
- **Description**: When a user manually overrides to level 4 or 5 while all evidence is document-only, the system requires an explicit rationale entry in override_log (rationale field mandatory, not just non-null string).
- **RED Condition**: Level 4/5 override with document-only evidence accepted without rationale; rationale field optional.
- **Acceptance Criteria**: POST /api/score-proposals/:id/override with new_level=4, evidence_types=['document'], no rationale returns HTTP 422; with rationale returns HTTP 200 and override_log.override_reason non-null.

### T-MMM-S6-068 — Evidence Event Triggers Immediate Score Recalculation
- **Source**: FR-039 / Architecture §A15
- **Layer**: Integration
- **Description**: Any evidence event (upload, accept, override, re-evaluate, stale flag) triggers an immediate recalculation of the criterion's maturity_score without manual refresh.
- **RED Condition**: Score only updates on manual refresh; no event-triggered recalculation.
- **Acceptance Criteria**: Integration test submits evidence event via API; within 500ms, GET /api/criteria/:id/maturity-score returns updated value; no manual trigger required.

### T-MMM-S6-069 — Scoring Cascade Completes All Six Steps
- **Source**: FR-040, FR-004 / Architecture §A15
- **Layer**: Integration
- **Description**: After evidence confirmation, the full six-step scoring cascade executes: (1) criterion score, (2) MPS aggregate, (3) domain aggregate, (4) organisation aggregate, (5) dashboard refresh trigger, (6) achievement check.
- **RED Condition**: Cascade stops after criterion level; MPS/domain/org scores not updated.
- **Acceptance Criteria**: Integration test confirms: maturity_scores updated at criterion, MPS, domain, and org levels within 2s; dashboard_refresh event published; achievements table checked for level-up.

### T-MMM-S6-070 — Achievement Record Created on Level-Up Detection
- **Source**: FR-040 / Architecture §A15
- **Layer**: Integration
- **Description**: When the scoring cascade detects a maturity level increase (criterion, MPS, domain, or org), an achievements record is inserted with entity_type, entity_id, previous_level, new_level, and achieved_at.
- **RED Condition**: achievements table never populated; level-ups not detected.
- **Acceptance Criteria**: Integration test drives criterion score from level 2 to level 3; SELECT * FROM achievements WHERE entity_id = :criterion_id returns one record with previous_level=2, new_level=3, achieved_at non-null.

### T-MMM-S6-071 — Audit Workbench Accessible From Published Framework
- **Source**: FR-041 / Architecture §A18
- **Layer**: E2E
- **Description**: An authenticated user on a published framework can navigate to the Audit Workbench via a "Start Audit Session" button, launching the walkabout mode.
- **RED Condition**: Audit Workbench not accessible; button absent; route returns 404.
- **Acceptance Criteria**: GET /mmm/framework/:id/audit-workbench returns HTTP 200 for published framework; "Start Audit Session" button visible; clicking creates audit_sessions record.

### T-MMM-S6-072 — Audit Session Record Created and Closed Correctly
- **Source**: FR-041 / Architecture §A18
- **Layer**: Integration
- **Description**: "Start Audit Session" creates an audit_sessions record with framework_id, started_by, started_at, and status='active'. Closing the session updates status='closed' and sets ended_at.
- **RED Condition**: No audit_sessions record created; status not tracked; end time not recorded.
- **Acceptance Criteria**: POST /api/audit-sessions creates record with status='active'; PATCH /api/audit-sessions/:id/close sets status='closed' and ended_at=now(); GET /api/audit-sessions/:id reflects changes.

### T-MMM-S6-073 — Queue-and-Sync Model Operational in Walkabout Mode
- **Source**: FR-041, TR-040 / Architecture §A18
- **Layer**: Integration
- **Description**: Evidence captured during an audit session in low-connectivity conditions is queued in IndexedDB and synced to the server when connectivity is restored.
- **RED Condition**: Evidence submission fails immediately on connectivity loss; no queuing mechanism.
- **Acceptance Criteria**: Integration test simulates offline condition; evidence submission stored in local queue; on reconnect, queued items sync to /api/upload/evidence; audit_sessions.sync_pending count decrements to 0.

### T-MMM-S6-074 — No MAT Branding in User-Facing Screens
- **Source**: FR-042 / Architecture §A18
- **Layer**: E2E
- **Description**: The text "MAT" does not appear as a mode name or product label in any user-facing MMM screen. The walkabout/audit mode is consistently labelled "Audit Workbench" or "Audit Session".
- **RED Condition**: "MAT" appears as mode label anywhere in the UI.
- **Acceptance Criteria**: E2E scan of all rendered pages confirms zero instances of "MAT" as a navigation label, page title, or mode identifier; "Audit Workbench" is the canonical label confirmed in navigation, headers, and API responses.

### T-MMM-S6-075 — Independent Auditor Scoped Invitation and Access
- **Source**: FR-043 / Architecture §A19
- **Layer**: Integration
- **Description**: An admin can invite an independent auditor with a scoped, time-limited role granting read access to specific framework, criteria, and evidence within the organisation.
- **RED Condition**: Auditor invitation missing; auditor receives full admin access; time limit not enforced.
- **Acceptance Criteria**: POST /api/invitations with role='independent_auditor' and scope={framework_id, expiry_date} creates invitations record; auditor token limited to read-only on scoped framework; access denied after expiry_date.

### T-MMM-S6-076 — Independent Auditor Findings Recordable and in Audit Trail
- **Source**: FR-043 / Architecture §A19
- **Layer**: Integration
- **Description**: The independent auditor can submit findings via the API; submissions are recorded in findings table with auditor identity; all auditor actions appear in audit_log.
- **RED Condition**: Auditor cannot submit findings; findings not persisted; audit trail missing auditor session.
- **Acceptance Criteria**: POST /api/findings with auditor JWT creates findings record with submitted_by=auditor_id; GET /api/audit-log?actor=:auditor_id returns all auditor actions during session.

### T-MMM-S6-077 — Audit Workbench Supports Voice, File, Photos, and Findings at Criterion Level
- **Source**: FR-041 / Architecture §A18
- **Layer**: E2E
- **Description**: From within an active audit session, the user can submit voice recordings, file attachments, photos, and text findings against individual criteria.
- **RED Condition**: One or more capture types unavailable in audit session context; criterion linking broken.
- **Acceptance Criteria**: E2E test: within audit session, submitting voice, file, photo, and findings against a criterion all succeed; each creates evidence record with audit_session_id and criterion_id non-null.

### T-MMM-S6-078 — Scoring Cascade Latency ≤2s From Evidence Event (TR-004)
- **Source**: TR-004, FR-039, FR-040 / Architecture §A15
- **Layer**: Integration
- **Description**: The full scoring cascade (criterion → MPS → domain → org → dashboard refresh) triggered by an evidence confirmation event completes within 2 seconds at the Edge Function layer.
- **RED Condition**: Cascade takes >2s; no latency measurement in place.
- **Acceptance Criteria**: Performance test: evidence event dispatched; Edge Function execution log confirms cascade completed in ≤2000ms; p95 across 20 test runs meets 2s threshold.

### T-MMM-S6-079 — Audit Session Load ≤2s for 500-Criterion Framework (TR-007)
- **Source**: TR-007, FR-041 / Architecture §A18
- **Layer**: Integration
- **Description**: Initiating an audit session that loads the full framework context (500 criteria) completes within 2 seconds at p95.
- **RED Condition**: Session load exceeds 2s; no performance measurement.
- **Acceptance Criteria**: Load test with seeded 500-criterion framework: GET /api/audit-sessions/context responds within 2000ms at p95 across 10 test runs.

### T-MMM-S6-080 — Real-Time Score Update Visible in Dashboard Within 3s (TR-008)
- **Source**: TR-008, FR-039 / Architecture §A15
- **Layer**: Integration
- **Description**: When a maturity score is updated and a second browser session has the dashboard open (Supabase Realtime subscription), the updated score appears within 3 seconds.
- **RED Condition**: Dashboard not subscribed to realtime; updates require manual refresh.
- **Acceptance Criteria**: Integration test: session A updates score via evidence accept; session B has dashboard subscribed to maturity_scores channel; score update received by session B within 3000ms; confirmed via Supabase Realtime client mock.

---

## Domain 4: Findings & Reporting (J-12 through J-15)

*Sources: FR-044–FR-052*

### T-MMM-S6-081 — Findings Records Have All Nine Required Fields
- **Source**: FR-044, FR-004 / Architecture §A19
- **Layer**: Integration
- **Description**: Every findings record must contain all nine mandatory fields: criterion_ref, evidence_ref, maturity_position, rationale, gap_to_next_level, recommendation, owner, priority, and due_date.
- **RED Condition**: findings records creatable with missing mandatory fields; no validation enforced.
- **Acceptance Criteria**: POST /api/findings with missing any of the nine fields returns HTTP 422; successful creation includes all nine non-null fields in response; database constraint enforced.

### T-MMM-S6-082 — Report and PIT Export Reference Same findings Records
- **Source**: FR-045, FR-004 / Architecture §A19
- **Layer**: Integration
- **Description**: Generated reports and PIT exports reference findings_id foreign keys pointing to the same findings table. No duplicate findings data stored separately in reports or pit_exports records.
- **RED Condition**: reports.findings_data or pit_exports.findings_data columns store findings inline, creating divergence.
- **Acceptance Criteria**: Schema inspection: reports table has no inline findings columns; pit_exports table references findings via foreign key; GET /api/reports/:id/findings and GET /api/pit-exports/:id/findings return from same source records.

### T-MMM-S6-083 — Output Fork Presents Both Report and PIT Export Options
- **Source**: FR-046 / Architecture §A20
- **Layer**: E2E
- **Description**: The output fork screen (J-12 completion) presents two clearly labelled options: "Create Report" and "Export to PIT". Both are accessible from the findings summary screen.
- **RED Condition**: Only one option visible; PIT export option hidden or absent.
- **Acceptance Criteria**: E2E: findings summary screen renders exactly two output fork buttons; both buttons navigate to distinct routes (/mmm/report/create and /mmm/pit-export/prepare); both routes return HTTP 200.

### T-MMM-S6-084 — Report Output Contains All Nine Required Elements
- **Source**: FR-047 / Architecture §A20
- **Layer**: Integration
- **Description**: A generated report contains all nine elements: executive summary, methodology, framework structure, findings by domain/MPS/criteria, maturity definitions, evidence references, recommendations, target-state path, and tasks/ownership/dates.
- **RED Condition**: Report missing one or more elements; report is a single-section summary only.
- **Acceptance Criteria**: POST /api/reports generates report; GET /api/reports/:id returns structured JSON with all nine section keys non-null and non-empty.

### T-MMM-S6-085 — Report Exportable in at Least One Format
- **Source**: FR-047 / Architecture §A20
- **Layer**: E2E
- **Description**: The user can download a generated report in at least one format (PDF, DOCX, or equivalent).
- **RED Condition**: No export/download option; report view-only in browser.
- **Acceptance Criteria**: GET /api/reports/:id/export returns a non-empty binary response with appropriate Content-Type (application/pdf or similar); file download prompt triggered in E2E test.

### T-MMM-S6-086 — Report Configuration Saved for Reuse
- **Source**: FR-048 / Architecture §A20
- **Layer**: Integration
- **Description**: Report scope (full framework, selected domains, selected MPSs) and format can be saved as a reusable report_configs record, and a report can be regenerated from saved config.
- **RED Condition**: No report_configs table; configuration lost after generation.
- **Acceptance Criteria**: POST /api/report-configs creates record with scope and format; POST /api/reports with report_config_id generates report matching saved scope; GET /api/report-configs/:id returns saved config.

### T-MMM-S6-087 — report_configs Record Created With Scope and Format
- **Source**: FR-048 / Architecture §A20
- **Layer**: Unit
- **Description**: The report_configs table schema includes org_id, framework_id, scope (JSON: domains[], mpss[]), format (enum), and name fields.
- **RED Condition**: report_configs table missing; scope stored as freetext without structure.
- **Acceptance Criteria**: Database migration includes report_configs table with all declared columns; POST /api/report-configs with scope and format returns created record with id, scope, and format populated.

### T-MMM-S6-088 — PIT Export Contains All Eight Required Fields
- **Source**: FR-049 / Architecture §A20
- **Layer**: Integration
- **Description**: The PIT export payload (stored in pit_exports and sent to PIT) contains all eight fields: findings, recommendations, implementation_tasks, reason_codes, priorities, due_dates, open_constraints, linked_maturity_targets.
- **RED Condition**: Export payload missing one or more of the eight fields; incomplete export sent.
- **Acceptance Criteria**: POST /api/pit-export/prepare returns JSON with all eight top-level keys populated with non-empty arrays or values; schema validation passes against TR-016 PIT export schema.

### T-MMM-S6-089 — PIT Export Sent via POST /api/pit-export/:id/send
- **Source**: FR-049, TR-017 / Architecture §A20
- **Layer**: Integration
- **Description**: Confirming PIT export on the J-14 screen triggers POST /api/pit-export/:id/send to dispatch the structured payload to PIT.
- **RED Condition**: No send action; export prepared but never dispatched; endpoint missing.
- **Acceptance Criteria**: POST /api/pit-export/:id/send returns HTTP 200; mock PIT endpoint receives payload matching TR-016 schema; pit_exports.dispatch_at timestamp set.

### T-MMM-S6-090 — PIT Acknowledgment Received and sent_at Populated
- **Source**: FR-049, TR-017 / Architecture §A20
- **Layer**: Integration
- **Description**: After dispatching the PIT export, MMM receives an acknowledgment callback from PIT and records sent_at in pit_exports.
- **RED Condition**: sent_at never populated; no callback handling implemented.
- **Acceptance Criteria**: Mock PIT callback POST /api/evidence/pit-ack with export_id updates pit_exports.sent_at = now(); GET /api/pit-exports/:id shows sent_at non-null.

### T-MMM-S6-091 — Dashboard Activated on Framework Publication
- **Source**: FR-050 / Architecture §A21
- **Layer**: Integration
- **Description**: The MMM dashboard for an organisation is inactive (returns 404 or 'not_ready') until the organisation's framework is published, at which point it becomes accessible.
- **RED Condition**: Dashboard accessible before publication; no gate enforced.
- **Acceptance Criteria**: GET /api/organisations/:id/dashboard before publication returns status='not_ready'; after POST /api/frameworks/:id/publish, same endpoint returns HTTP 200 with dashboard data.

### T-MMM-S6-092 — Dashboard Renders All Nine Visual Elements
- **Source**: FR-050 / Architecture §A21
- **Layer**: E2E
- **Description**: The live dashboard renders all nine required elements: Operational Maturity House visualization, domain state indicators, working-on indicators, overall maturity level, domain maturity indicators, drill-down, achieved vs outstanding visibility, hierarchy filters, live achievement feed.
- **RED Condition**: One or more dashboard elements absent from rendered page.
- **Acceptance Criteria**: E2E test on published organisation dashboard confirms presence of nine data-testid elements: maturity-house, domain-indicators, working-on-indicator, overall-level, domain-levels, drill-down-link, achieved-outstanding, hierarchy-filter, achievement-feed.

### T-MMM-S6-093 — Dashboard Drill-Down Functional to Criterion Level
- **Source**: FR-050 / Architecture §A21
- **Layer**: E2E
- **Description**: From the dashboard, clicking a domain navigates to domain detail; clicking an MPS navigates to MPS detail; clicking a criterion navigates to criterion drill-down (J-10).
- **RED Condition**: Drill-down clicks do not navigate; dashboard is read-only flat view.
- **Acceptance Criteria**: E2E navigation from dashboard → domain → MPS → criterion all succeed with correct route parameters; each page loads with correct context.

### T-MMM-S6-094 — Dashboard Company Hierarchy Filters Operational
- **Source**: FR-050 / Architecture §A21
- **Layer**: E2E
- **Description**: The dashboard hierarchy filters (section, site, operation, subsidiary) can be applied to filter the maturity view to a sub-unit of the organisation.
- **RED Condition**: Filters absent; no sub-organisation filtering available.
- **Acceptance Criteria**: E2E: selecting a site filter updates dashboard scores to reflect only that site's evidence; filter state persists on reload via user_preferences.

### T-MMM-S6-095 — Live Achievement Feed Active on Dashboard
- **Source**: FR-050 / Architecture §A21
- **Layer**: Integration
- **Description**: The achievement feed displays recent criterion/MPS/domain level-up events as they occur, via Supabase Realtime subscription.
- **RED Condition**: Achievement feed empty; events not pushed to dashboard in real time.
- **Acceptance Criteria**: Integration test: trigger level-up event; dashboard achievement feed receives update via realtime channel within 3s; achievements.new_level displayed in feed.

### T-MMM-S6-096 — CL-13 Extended Scope Components Compatible With FR-050 Dashboard
- **Source**: FR-051 / Architecture §A21
- **Layer**: Integration
- **Description**: The CL-13 extended scope dashboard components (D5/D6/D7) are confirmed compatible with the MMM dashboard specification without requiring a separate reconciliation wave.
- **RED Condition**: CL-13 components conflict with MMM dashboard; rendering failures on integration.
- **Acceptance Criteria**: Integration test imports CL-13 D5/D6/D7 components into MMM dashboard shell; all render without errors; no prop-type conflicts or duplicate state management; confirmed GREEN.

### T-MMM-S6-097 — Dashboard Suitable for Office-Display and Shared-Screen Context
- **Source**: FR-052 / Architecture §A21
- **Layer**: E2E
- **Description**: The dashboard layout and design is verified suitable for large-screen/office display use cases (no text too small, no critical information cut off at 1920×1080 and 3840×2160 resolutions).
- **RED Condition**: Dashboard unreadable at large resolutions; critical data truncated.
- **Acceptance Criteria**: Lighthouse accessibility audit at 1920px width: no critical contrast failures; E2E screenshot at 1920×1080 confirms all nine dashboard elements visible without scrolling.

---

## Domain 5: Boundary Flows (MMM↔AIMC, MMM↔PIT, MMM↔KUC)

*Sources: FR-053–FR-059, TR-011–TR-020*

### T-MMM-S6-098 — Zero Direct AI Provider Calls in MMM Code
- **Source**: FR-053, FR-063 / Architecture §A12
- **Layer**: Unit
- **Description**: Static analysis confirms that the MMM codebase contains no direct calls to AI providers (OpenAI, Anthropic, etc.) — all AI calls route exclusively through AIMC gateway.
- **RED Condition**: Direct AI provider imports or HTTP calls found in MMM source.
- **Acceptance Criteria**: grep/AST scan of apps/MMM/** for AI provider SDK imports (openai, anthropic, cohere, etc.) returns zero results; test fails on any direct provider call found.

### T-MMM-S6-099 — All Nine AIMC Endpoint Paths Callable From MMM
- **Source**: FR-053 / Architecture §A12
- **Layer**: Integration
- **Description**: All nine AIMC endpoints defined in FR-053 are callable from MMM: framework-parse, framework-generate, framework-alter, evidence-evaluate, recommend, chat, explain, assessment-interpret, and upload.
- **RED Condition**: One or more AIMC endpoints not wired; MMM AIMC client missing routes.
- **Acceptance Criteria**: Integration test with mock AIMC server: all nine POST calls from MMM AIMC client return mocked responses; each endpoint handler confirmed in MMM service layer code.

### T-MMM-S6-100 — No PIT Lifecycle Logic in MMM Code
- **Source**: FR-054 / Architecture §A17
- **Layer**: Unit
- **Description**: MMM codebase contains no implementation plan management, action lifecycle, or PIT-owned planning logic. MMM only produces and sends the export package and receives the acknowledgment.
- **RED Condition**: PIT action lifecycle code found inside MMM source.
- **Acceptance Criteria**: Code audit confirms: no action management routes, no implementation plan CRUD in MMM; only /api/pit-export/* and /api/evidence/pit-return endpoints exist for PIT interaction.

### T-MMM-S6-101 — PIT Evidence Return Processed and Linked at Criterion Level
- **Source**: FR-054 / Architecture §A17
- **Layer**: Integration
- **Description**: When PIT sends implementation evidence back via POST /api/evidence/pit-return, MMM processes it, links it to the originating criterion, and triggers re-evaluation.
- **RED Condition**: Endpoint missing; returned evidence not linked to criterion; no re-evaluation triggered.
- **Acceptance Criteria**: POST /api/evidence/pit-return with criterion_id and evidence payload creates evidence record with source='pit'; re-evaluation triggered (score_proposals record created); criterion maturity_score updated.

### T-MMM-S6-102 — Both Upload Types Route Through KUC With Classification Returned
- **Source**: FR-055 / Architecture §A8
- **Layer**: Integration
- **Description**: POST /api/upload/framework-source and POST /api/upload/evidence both route to KUC and receive classification metadata in the response.
- **RED Condition**: KUC classification not returned; uploads processed without classification.
- **Acceptance Criteria**: Both upload endpoints return response body with kuc_classification object containing document_role, scope_type, and confidence_score fields from KUC; no upload bypasses KUC step.

### T-MMM-S6-103 — Framework-Source Ingestion Uses criteria_source document_role
- **Source**: FR-056 / Architecture §A10
- **Layer**: Integration
- **Description**: Documents uploaded via the framework-source upload path are classified with document_role = 'criteria_source' and processed through the structure-extraction pipeline.
- **RED Condition**: document_role not set on framework upload; wrong role assigned.
- **Acceptance Criteria**: POST /api/upload/framework-source returns document.document_role = 'criteria_source'; database record confirms same; parse_jobs triggered (not score_proposals).

### T-MMM-S6-104 — Evidence Ingestion Uses evidence document_role
- **Source**: FR-057 / Architecture §A15
- **Layer**: Integration
- **Description**: Documents uploaded via the evidence upload path are classified with document_role = 'evidence' and processed through the evaluation/scoring pipeline.
- **RED Condition**: document_role not set on evidence upload; wrong role assigned; scoring not triggered.
- **Acceptance Criteria**: POST /api/upload/evidence returns document.document_role = 'evidence'; score_proposals record created (not parse_jobs); maturity_score update triggered.

### T-MMM-S6-105 — MVP Has Exactly Two Fork Options; No Hybrid; No Migration UI
- **Source**: FR-028, FR-058, FR-059 / Architecture §A5
- **Layer**: E2E
- **Description**: The framework fork screen has exactly two options in MVP (no hybrid mode); the switchover gate model follows the standard SG-1–SG-5; no user-facing migration execution UI exists in MMM.
- **RED Condition**: Hybrid option visible; migration wizard present in MMM.
- **Acceptance Criteria**: Fork screen renders exactly two option buttons; text search confirms no "hybrid" option in UI strings; grep of codebase confirms no migration execution routes in MMM.

### T-MMM-S6-106 — AIMC Calls Include Service-to-Service JWT
- **Source**: TR-011 / Architecture §A12
- **Layer**: Integration
- **Description**: All outbound MMM → AIMC requests include an Authorization: Bearer header with a service-to-service JWT of TTL ≤ 3600s, rotated before expiry.
- **RED Condition**: AIMC calls made without Authorization header; JWT absent; TTL not enforced.
- **Acceptance Criteria**: Integration test intercepting AIMC calls confirms Authorization: Bearer header present on all nine endpoint calls; JWT payload shows exp within 3600s of iat; rotation logic unit test confirms pre-expiry refresh.

### T-MMM-S6-107 — AIMC Data Format Contract Enforced
- **Source**: TR-012 / Architecture §A12
- **Layer**: Integration
- **Description**: All MMM → AIMC request and response payloads conform to the declared AIMC data format contract (JSON schema defined in TR-012).
- **RED Condition**: Payload structure deviates from contract; AIMC mock rejects malformed requests.
- **Acceptance Criteria**: JSON schema validation test on all AIMC request/response payloads passes; mock AIMC validator confirms no schema violations for all nine endpoint calls.

### T-MMM-S6-108 — AIMC Timeout and Retry Contract Honored
- **Source**: TR-014 / Architecture §A12
- **Layer**: Integration
- **Description**: MMM AIMC client respects the timeout values declared in TR-014: standard operations timeout after ≤5000ms; retries with exponential backoff; max retry count enforced.
- **RED Condition**: No timeout configured; calls hang indefinitely; no retry logic.
- **Acceptance Criteria**: Unit test of AIMC client with mock that delays response beyond timeout confirms: request times out and retries with correct backoff; max retries exhausted triggers circuit breaker or fallback.

### T-MMM-S6-109 — PIT Export Payload Matches TR-016 JSON Schema
- **Source**: TR-016 / Architecture §A20
- **Layer**: Integration
- **Description**: The PIT export JSON payload produced by MMM validates against the schema declared in TR-016 (findings[], recommendations[], implementation_tasks[] with required fields).
- **RED Condition**: Export payload does not match TR-016 schema; required fields missing or wrong types.
- **Acceptance Criteria**: POST /api/pit-export/prepare generates payload; JSON Schema validation against TR-016 schema returns zero errors; field types and required fields all present.

### T-MMM-S6-110 — PIT Export Trigger and Handshake Per TR-017
- **Source**: TR-017 / Architecture §A20
- **Layer**: Integration
- **Description**: The PIT export trigger, dispatch, and handshake sequence follows TR-017: user confirms on J-14 screen → POST /api/pit-export/:id/send → PIT callback → sent_at recorded.
- **RED Condition**: Dispatch happens without user confirmation; callback not handled; sent_at not set.
- **Acceptance Criteria**: Sequence test: (1) POST /api/pit-export/:id/send returns HTTP 202; (2) mock PIT receives payload; (3) mock callback POST /api/evidence/pit-ack called; (4) pit_exports.sent_at set.

### T-MMM-S6-111 — PIT Evidence Return Contract Per TR-018
- **Source**: TR-018 / Architecture §A17
- **Layer**: Integration
- **Description**: Evidence returned from PIT via POST /api/evidence/pit-return conforms to the TR-018 return contract schema (criterion_id, evidence_type, content, pit_task_id, returned_at).
- **RED Condition**: Endpoint rejects valid TR-018 payloads; required fields not parsed.
- **Acceptance Criteria**: POST /api/evidence/pit-return with TR-018-compliant payload returns HTTP 201; evidence record created with pit_task_id, returned_at, and criterion_id all non-null.

### T-MMM-S6-112 — KUC Upload Request Contract Per TR-019 and Classification Response Per TR-020
- **Source**: TR-019, TR-020 / Architecture §A8
- **Layer**: Integration
- **Description**: Upload requests to KUC conform to TR-019 schema; classification responses from KUC conform to TR-020 schema.
- **RED Condition**: KUC request/response schemas not validated; arbitrary payloads accepted.
- **Acceptance Criteria**: JSON schema validation on KUC request (TR-019) and response (TR-020) passes for both framework-source and evidence upload paths; schema validation integrated in upload middleware tests.

---

## Domain 6: Roles & Permissions (J-16)

*Sources: FR-060–FR-062, TR-035, TR-036*

### T-MMM-S6-113 — All Seven Role Types Creatable in organisation_users
- **Source**: FR-060 / Architecture §A19
- **Layer**: Integration
- **Description**: All seven declared roles can be assigned in organisation_users: Main User/Implementation Lead, Domain User, MPS User, Evidence Manager, Approver, Executive Sign-Off User, Independent Auditor.
- **RED Condition**: One or more roles absent from role enum; assignment fails.
- **Acceptance Criteria**: INSERT to organisation_users with each of the seven role values succeeds; invalid role value returns database constraint violation.

### T-MMM-S6-114 — Each Role Has Distinct Permission Boundaries
- **Source**: FR-060 / Architecture §A19
- **Layer**: Integration
- **Description**: The seven roles have distinct permission sets: e.g., Domain User can edit their domain but not others; Evidence Manager can upload evidence but not approve frameworks; Independent Auditor is read-only scoped.
- **RED Condition**: Roles have identical permissions; no differentiation enforced.
- **Acceptance Criteria**: Permission matrix test: for each role, attempt five role-specific forbidden actions via API; each returns HTTP 403; permitted actions return HTTP 200.

### T-MMM-S6-115 — Invitation-Based Model Enforced
- **Source**: FR-061 / Architecture §A19
- **Layer**: Integration
- **Description**: Users cannot self-register for an organisation; they must be invited by the Main User or authorised role holder. Direct registration to an org without invitation returns an error.
- **RED Condition**: Any user can join any organisation by self-registering; no invitation gate.
- **Acceptance Criteria**: POST /api/auth/register with org_id but no invitation_token returns HTTP 403; POST with valid invitation_token succeeds and creates organisation_users record.

### T-MMM-S6-116 — Invitations Are Role-Scoped
- **Source**: FR-061 / Architecture §A19
- **Layer**: Integration
- **Description**: Invitations carry the target role and scope. The invited user's role and scope in organisation_users matches what was specified in the invitation.
- **RED Condition**: Invitations not role-scoped; invited users receive default/admin role.
- **Acceptance Criteria**: POST /api/invitations with role='evidence_manager' and scope=domain_id creates invitation; accepted invitation creates organisation_users record with role='evidence_manager' and correct scope.

### T-MMM-S6-117 — Scope-Based Permissions Enforced at All Six Scope Levels
- **Source**: FR-062, TR-036 / Architecture §A19
- **Layer**: Integration
- **Description**: Permissions are enforced at all six scope levels: whole framework, domain, MPS, criterion, evidence set, approval scope. Cross-scope access is denied.
- **RED Condition**: Scope restrictions not enforced; user with domain scope can access other domains.
- **Acceptance Criteria**: Integration test: user with domain_id=A scope attempts to access domain_id=B resources via API; all six scope types tested; cross-scope attempts return HTTP 403.

### T-MMM-S6-118 — Permission Inheritance Rule Verified
- **Source**: FR-062 / Architecture §A19
- **Layer**: Integration
- **Description**: If lower-level responsibility is not assigned, responsibility inherits upward. A user assigned at domain level can operate on all MPSs and criteria within that domain.
- **RED Condition**: Inheritance not implemented; domain-level user cannot access MPS/criteria.
- **Acceptance Criteria**: User with scope=domain_id can PATCH /api/mps/:id and /api/criteria/:id within that domain without explicit MPS/criteria scope assignment; returns HTTP 200.

### T-MMM-S6-119 — Cross-Scope Access Denied
- **Source**: FR-062, TR-036 / Architecture §A19
- **Layer**: Integration
- **Description**: A user scoped to Domain A cannot read, modify, or approve resources in Domain B, even within the same organisation.
- **RED Condition**: Scope boundary not enforced at API layer; cross-domain access succeeds.
- **Acceptance Criteria**: RLS policy test: user with domain_scope=A JWT attempts GET, PATCH, DELETE on domain_scope=B resources; all return HTTP 403 or empty result set.

### T-MMM-S6-120 — KUC Classification Response Contract (TR-020) Enforced in Upload Pipeline
- **Source**: TR-020 / Architecture §A8
- **Layer**: Unit
- **Description**: The upload pipeline validates KUC classification responses against the TR-020 schema and rejects non-conforming responses.
- **RED Condition**: Malformed KUC responses accepted silently; no validation in pipeline.
- **Acceptance Criteria**: Unit test: upload pipeline receives malformed KUC response (missing document_role); pipeline logs error and returns HTTP 502 Bad Gateway rather than proceeding with null classification.

---

## Domain 7: AI Interactions (J-17)

*Sources: FR-063–FR-066, TR-033, TR-034*

### T-MMM-S6-121 — No Local AI Stack in MMM
- **Source**: FR-063 / Architecture §A12
- **Layer**: Unit
- **Description**: MMM has no private AI client library, no direct LLM API keys, and no local model inference. All AI functionality routes through AIMC.
- **RED Condition**: AI SDK directly imported in MMM; private API keys in MMM environment config.
- **Acceptance Criteria**: package.json has no direct AI provider SDK dependencies; environment variable scan confirms no OPENAI_API_KEY or equivalent in MMM-specific config; all AI calls use AIMC client.

### T-MMM-S6-122 — No Auto-Accept Paths for AI Outputs
- **Source**: FR-064 / Architecture §A12
- **Layer**: Integration
- **Description**: No AI-generated output (score proposals, framework structures, recommendations) is automatically applied to maturity state without explicit human confirmation.
- **RED Condition**: Evidence evaluation automatically updates maturity_scores without human review; proposals auto-accepted.
- **Acceptance Criteria**: Integration test: AIMC returns score proposal; maturity_scores NOT updated until POST /api/score-proposals/:id/accept called; maturity_scores.updated_by must be a human user_id, not system.

### T-MMM-S6-123 — AI Confidence Visibility for Score Proposals
- **Source**: FR-065 / Architecture §A12
- **Layer**: Integration
- **Description**: The confidence level of every AI score proposal is stored in score_proposals.confidence (float 0–1) and displayed to the user in the evidence workspace.
- **RED Condition**: Confidence field absent; all proposals shown without confidence context.
- **Acceptance Criteria**: score_proposals.confidence is non-null for all AI-generated proposals; GET /api/criteria/:id/score-proposals returns confidence field; workspace UI renders confidence as percentage or label.

### T-MMM-S6-124 — ai_interactions Records Include Model and Confidence
- **Source**: FR-065, TR-034 / Architecture §A12
- **Layer**: Integration
- **Description**: Every AI interaction (all nine AIMC endpoint types) creates an ai_interactions record with model_id, model_version, confidence, and interaction_type fields.
- **RED Condition**: ai_interactions table not populated; model/confidence not recorded.
- **Acceptance Criteria**: After any AIMC call from MMM, ai_interactions record created with non-null model_id, model_version, confidence (where applicable), interaction_type, and created_at.

### T-MMM-S6-125 — Admin AI Chat Accessible to Admin Role Only
- **Source**: FR-066 / Architecture §A22
- **Layer**: Integration
- **Description**: The back-office Admin AI Chat pane is protected by role='admin' check. Non-admin users receive HTTP 403 when attempting to access /mmm/admin/ai-chat.
- **RED Condition**: Admin AI chat accessible to any authenticated user; no role check.
- **Acceptance Criteria**: GET /api/admin/ai-chat with non-admin JWT returns HTTP 403; with admin JWT returns HTTP 200; E2E confirms non-admin navigation attempt redirected.

### T-MMM-S6-126 — AI Telemetry Dashboard Displays All Five Metrics
- **Source**: FR-066 / Architecture §A22
- **Layer**: E2E
- **Description**: The admin AI telemetry dashboard (Pane 2) displays all five metrics: token usage, latency, cost, error rates, and AI interaction volume.
- **RED Condition**: Telemetry dashboard missing one or more metrics; dashboard blank.
- **Acceptance Criteria**: E2E (admin user): /mmm/admin/ai-telemetry renders data-testid attributes for token-usage, latency, cost, error-rate, and interaction-volume; all five show non-zero seeded data.

### T-MMM-S6-127 — Back-Office AI Interface Separated From End-User AI Chat
- **Source**: FR-066 / Architecture §A22
- **Layer**: Integration
- **Description**: The admin AI chat (FR-066) and telemetry dashboard are at separate routes from end-user AI chat (J-17). The admin pane has no user-facing entry points.
- **RED Condition**: Admin AI pane linked from end-user navigation; shared component state.
- **Acceptance Criteria**: Route scan confirms /mmm/admin/ai-* routes have admin middleware; end-user navigation contains no links to /mmm/admin/*; admin chat component not imported in user-facing pages.

### T-MMM-S6-128 — AI Governance Logging Records Override and Interaction Trail
- **Source**: FR-065, TR-034 / Architecture §A12, §A16
- **Layer**: Integration
- **Description**: All AI-to-human decision points (score proposal presented, override triggered, confidence threshold crossed) are logged in ai_interactions and override_log with ISO 42001-aligned fields.
- **RED Condition**: AI governance logs absent; no traceability of AI decision points.
- **Acceptance Criteria**: Integration test drives full AI decision cycle; ai_interactions and override_log records confirm complete trail with decision_point, model_id, confidence, user_decision, and rationale fields all populated.

---

## Domain 8: Cross-Cutting — Performance & Reliability

*Sources: TR-001–TR-010, FR-069, FR-070*

### T-MMM-S6-129 — Page Load TTI ≤2.5s on Broadband (TR-001)
- **Source**: TR-001, FR-069 / Architecture §A2
- **Layer**: Integration
- **Description**: All primary MMM routes achieve Time to Interactive ≤ 2.5s on standard broadband (≥10 Mbps). Lighthouse CI score ≥90 on desktop and ≥75 on mobile.
- **RED Condition**: Lighthouse CI not configured; TTI exceeds 2.5s; no performance budget enforced.
- **Acceptance Criteria**: Lighthouse CI runs on all primary routes; desktop TTI score ≥90; mobile score ≥75; test fails if any primary route exceeds 2500ms TTI.

### T-MMM-S6-130 — API Response Time p95 ≤500ms Under 50 Concurrent Users (TR-002)
- **Source**: TR-002, FR-069 / Architecture §A2
- **Layer**: Integration
- **Description**: All non-AI MMM API endpoints respond within 500ms at p95 under 50 concurrent users per organisation.
- **RED Condition**: No load test configured; p95 exceeds 500ms at baseline load.
- **Acceptance Criteria**: k6 load test with 50 VUs confirms p95 ≤ 500ms across all non-AI endpoints; database query p95 ≤ 200ms confirmed via Supabase logs.

### T-MMM-S6-131 — AI Endpoints p95 ≤5000ms With Progress Indicator (TR-002)
- **Source**: TR-002, FR-069 / Architecture §A12
- **Layer**: Integration
- **Description**: AI-mediated AIMC operations (framework parse, evidence evaluate, etc.) respond within 5000ms at p95 and display a progress indicator while processing.
- **RED Condition**: AI operations timeout before 5s; no progress indicator shown; user sees blank screen.
- **Acceptance Criteria**: Load test with AIMC mock: AI endpoint p95 ≤5000ms; E2E test confirms progress indicator visible during AI processing; polling endpoint available for long operations.

### T-MMM-S6-132 — Platform Supports ≥500 Concurrent Users Across Organisations (TR-003)
- **Source**: TR-003, FR-069 / Architecture §A2
- **Layer**: Integration
- **Description**: At the platform level, the system sustains ≥500 concurrent active users across all organisations with API p95 ≤500ms maintained.
- **RED Condition**: Platform degrades below 500 concurrent users; no capacity test.
- **Acceptance Criteria**: k6 load test with 500 VUs across 10 simulated organisations: p95 ≤500ms maintained throughout; no error rate above 1%.

### T-MMM-S6-133 — Dashboard Render ≤1.5s Cache Hit / ≤3s Cache Miss (TR-005)
- **Source**: TR-005, FR-069 / Architecture §A21
- **Layer**: Integration
- **Description**: Dashboard render time ≤1.5s with TanStack Query cached data; ≤3s on initial load (cache miss) with production-representative dataset (≥5 domains, ≥20 MPSs, ≥100 criteria).
- **RED Condition**: Dashboard render >3s on cold load; no caching configured.
- **Acceptance Criteria**: Timing test with representative dataset: cache-hit render ≤1500ms; cache-miss render ≤3000ms; both confirmed via React DevTools profiling in test run.

### T-MMM-S6-134 — File Upload Accepts ≤50MB; Processing Starts ≤3s (TR-006)
- **Source**: TR-006, FR-069 / Architecture §A8
- **Layer**: Integration
- **Description**: Document uploads accept files up to 50MB; processing begins within 3s of upload completion; metadata extraction for ≤10MB files completes within 30s.
- **RED Condition**: 50MB uploads rejected; processing does not start within 3s; no SLA enforced.
- **Acceptance Criteria**: Upload test with 1MB, 10MB, 50MB files: all accepted (HTTP 201); parse_jobs.started_at set within 3s; parse_jobs.completed_at within 30s for 10MB file.

### T-MMM-S6-135 — Health Endpoint Responds ≤100ms p99 Under All Load Conditions (TR-010)
- **Source**: TR-010, FR-067 / Architecture §A22
- **Layer**: Integration
- **Description**: GET /api/health responds within 100ms at p99 even during peak load conditions.
- **RED Condition**: Health endpoint shares resources with main application; degrades under load.
- **Acceptance Criteria**: k6 load test at 500 VU peak: health endpoint p99 ≤100ms measured in parallel; test fails if any p99 measurement exceeds 100ms.

### T-MMM-S6-136 — Circuit Breaker Opens After 5 Failures in 60s (TR-009)
- **Source**: TR-009, FR-070 / Architecture §A12
- **Layer**: Integration
- **Description**: Circuit breakers on AIMC and other external dependencies open after ≥5 consecutive failures within a 60-second window.
- **RED Condition**: Circuit breaker not implemented; failures accumulate indefinitely without opening.
- **Acceptance Criteria**: Integration test: simulate 5 consecutive AIMC failures within 60s; 6th call returns circuit-open fallback immediately (≤50ms); circuit state exposed in health endpoint.

### T-MMM-S6-137 — Circuit Breaker Recovers After 30s and Shows Fallback UI (TR-009)
- **Source**: TR-009, FR-070 / Architecture §A12
- **Layer**: Integration
- **Description**: After opening, the circuit breaker holds for ≥30s then sends a probe request. If probe succeeds, circuit closes. Throughout open state, fallback UI is presented (no hard failure).
- **RED Condition**: Circuit never closes after recovery; fallback UI not implemented; hard error shown to user.
- **Acceptance Criteria**: After circuit opens: 30s wait → probe request sent → mock responds successfully → circuit closes; user UI shows "AI features temporarily unavailable" banner during open state (not error page).

### T-MMM-S6-138 — Scoring Cascade ≤2s at Edge Function Layer (TR-004)
- **Source**: TR-004, FR-039, FR-040 / Architecture §A15
- **Layer**: Integration
- **Description**: Full criterion→MPS→domain→org→dashboard cascade triggered by evidence event completes within 2000ms at the Supabase Edge Function execution layer.
- **RED Condition**: No cascade timing measurement; cascade takes >2s.
- **Acceptance Criteria**: Edge Function execution log confirms cascade start and end timestamps differ by ≤2000ms; confirmed across 20 test evidence events at p95.

---

## Domain 9: Cross-Cutting — Security & Compliance

*Sources: TR-029–TR-038, FR-071, TR-058*

### T-MMM-S6-139 — Authentication Provider Integration Functional
- **Source**: TR-029 / Architecture §A4
- **Layer**: Integration
- **Description**: MMM authentication uses the declared provider (Supabase Auth). Login, logout, token refresh, and session management all function correctly.
- **RED Condition**: Auth provider not configured; login returns 500; sessions not persisted.
- **Acceptance Criteria**: POST /api/auth/login returns JWT; GET /api/auth/session returns active session; token refresh returns new JWT before expiry; POST /api/auth/logout invalidates token.

### T-MMM-S6-140 — JWT Tokens Have Required Claims and TTL
- **Source**: TR-030 / Architecture §A4
- **Layer**: Unit
- **Description**: JWT tokens issued contain required claims (sub, iss, aud, exp, iat, role, org_id) and expire within the declared TTL.
- **RED Condition**: Required claims absent; exp not enforced; arbitrary TTL.
- **Acceptance Criteria**: Unit test decodes JWT and confirms presence of all seven claims; exp - iat ≤ declared TTL; expired tokens rejected by middleware with HTTP 401.

### T-MMM-S6-141 — RLS Policies Enforced on All Critical Tables
- **Source**: TR-031 / Architecture §A4, §A5
- **Layer**: Integration
- **Description**: Row-Level Security policies are active on all critical tables: organisations, frameworks, criteria, evidence, maturity_scores, findings, approvals, override_log, audit_log.
- **RED Condition**: RLS disabled on one or more tables; cross-org data accessible.
- **Acceptance Criteria**: RLS test: user from Org A with valid JWT cannot read Org B records from any of the nine listed tables; each table tested with cross-org SELECT attempt returning empty result set.

### T-MMM-S6-142 — Organisation Data Isolation Enforced
- **Source**: TR-032 / Architecture §A5
- **Layer**: Integration
- **Description**: Multi-organisation deployment maintains complete data isolation. No organisation can access another organisation's frameworks, evidence, scores, or findings.
- **RED Condition**: Cross-organisation data visible in API responses; RLS bypass possible.
- **Acceptance Criteria**: Integration test with two isolated organisations: Org A user cannot read, write, or list any Org B resource; all endpoints tested; HTTP 403 or empty set returned for all cross-org attempts.

### T-MMM-S6-143 — AI Human Oversight Technical Requirements Met (TR-033)
- **Source**: TR-033, FR-064 / Architecture §A12
- **Layer**: Integration
- **Description**: Technical controls enforce human oversight of AI: (a) score proposals require explicit accept/override before maturity update, (b) framework generation requires human review before approval, (c) all AI proposals surfaced in a reviewable queue.
- **RED Condition**: AI decisions bypassing human review; no technical enforcement of oversight.
- **Acceptance Criteria**: API tests confirm: maturity_scores not updated by AI alone; POST /api/frameworks without human approval blocked; ai_interactions record created for every AI operation; oversight_queue endpoint returns pending AI proposals.

### T-MMM-S6-144 — AI Governance Logging in ai_interactions
- **Source**: TR-034, FR-065 / Architecture §A12
- **Layer**: Integration
- **Description**: Every AIMC call from MMM creates an ai_interactions record with interaction_type, model_id, model_version, input_tokens, output_tokens, latency_ms, confidence, and outcome fields.
- **RED Condition**: ai_interactions not populated; partial fields only; no model traceability.
- **Acceptance Criteria**: After each of nine AIMC call types, ai_interactions record confirms all eight fields non-null; model_id and model_version match AIMC response headers.

### T-MMM-S6-145 — Invitation Security Model Enforced (TR-035)
- **Source**: TR-035, FR-061 / Architecture §A19
- **Layer**: Integration
- **Description**: Invitations use signed tokens with expiry; invitation tokens cannot be reused; revocation is immediate.
- **RED Condition**: Invitation tokens reusable; no expiry enforced; revocation not implemented.
- **Acceptance Criteria**: Invitation accepted once; second acceptance attempt returns HTTP 410 Gone; PATCH /api/invitations/:id/revoke prevents further use immediately; expired invitations return HTTP 410.

### T-MMM-S6-146 — Scope-Based Permissions Enforced at Database Level (TR-036)
- **Source**: TR-036, FR-062 / Architecture §A5, §A19
- **Layer**: Integration
- **Description**: Permission boundaries are enforced by Supabase RLS policies at the database level, not only by application-layer checks.
- **RED Condition**: Permissions enforced only in application code; direct database queries bypass scope checks.
- **Acceptance Criteria**: RLS policy test via Supabase client (bypassing app middleware): domain-scoped user cannot SELECT criteria from a different domain; MPS-scoped user cannot SELECT evidence outside their MPS; all RLS policies confirmed active.

### T-MMM-S6-147 — Compliance Baseline Artifacts Present
- **Source**: FR-071, TR-037 / Architecture §A22
- **Layer**: Unit
- **Description**: The repository contains COMPLIANCE_SCOPE.md, CONTROL_MAPPING.md, and EVIDENCE_CATALOG.md as committed files with all required sections populated.
- **RED Condition**: One or more compliance artifact files absent from repository.
- **Acceptance Criteria**: File existence tests: COMPLIANCE_SCOPE.md, CONTROL_MAPPING.md, and EVIDENCE_CATALOG.md all present in modules/MMM/; each file has non-trivial content (>100 lines); no placeholder sections.

### T-MMM-S6-148 — Audit Log Technical Requirements Met (TR-038)
- **Source**: TR-038, FR-073 / Architecture §A16
- **Layer**: Integration
- **Description**: The audit log technical implementation meets TR-038 requirements: immutable append-only writes, indexed by entity_id and created_at, retention policy applied, deduplication rules enforced.
- **RED Condition**: Audit logs mutable (updates/deletes allowed); no retention policy; no deduplication.
- **Acceptance Criteria**: Database test: UPDATE on audit_log returns error (no update permission); DELETE returns error; indexes on entity_id and created_at confirmed; retention policy configured in Supabase; deduplication check rejects duplicate events within 1s window.

### T-MMM-S6-149 — COMPLIANCE_SCOPE.md Present and Populated
- **Source**: FR-071 / Architecture §A22
- **Layer**: Unit
- **Description**: COMPLIANCE_SCOPE.md declares ISO 27001, ISO 31000, and NIST CSF coverage with control traceability from architecture through QA to runtime evidence.
- **RED Condition**: File absent or contains only headers without content.
- **Acceptance Criteria**: File test: COMPLIANCE_SCOPE.md exists; contains sections for ISO 27001, ISO 31000, and NIST CSF; each section has at least one control reference; no "TBD" placeholder entries.

### T-MMM-S6-150 — CONTROL_MAPPING.md With End-to-End Traceability
- **Source**: FR-071 / Architecture §A22
- **Layer**: Unit
- **Description**: CONTROL_MAPPING.md maps each compliance control through Architecture → QA → Runtime → Evidence with no gaps in traceability.
- **RED Condition**: CONTROL_MAPPING.md absent; mapping incomplete; traceability chain broken.
- **Acceptance Criteria**: File contains mapping table with columns: control_id, control_name, architecture_ref, qa_test_id, runtime_check, evidence_ref; at least one row per ISO 27001/NIST CSF control area declared in COMPLIANCE_SCOPE.md.

### T-MMM-S6-151 — EVIDENCE_CATALOG.md Present and Referenced
- **Source**: FR-071 / Architecture §A22
- **Layer**: Unit
- **Description**: EVIDENCE_CATALOG.md catalogues the compliance evidence artifacts (test results, configuration exports, logs) that demonstrate each control.
- **RED Condition**: EVIDENCE_CATALOG.md absent; no mapping of controls to evidence.
- **Acceptance Criteria**: File exists with catalog table: control_id, evidence_type, evidence_location, collection_frequency; at least five entries covering security, access control, and audit log controls.

### T-MMM-S6-152 — SAST Scan Passes With Zero High/Critical Findings (TR-058)
- **Source**: TR-058 / Architecture §A22
- **Layer**: Integration
- **Description**: CodeQL or Semgrep SAST scan of MMM source returns zero high or critical severity findings.
- **RED Condition**: SAST scan not configured; high/critical findings present.
- **Acceptance Criteria**: CI SAST scan step runs on every PR; report shows 0 high findings, 0 critical findings; test fails if any high/critical issue is reported.

---

## Domain 10: Cross-Cutting — Infrastructure & Quality Gates

*Sources: TR-048–TR-064, FR-067, FR-072*

### T-MMM-S6-153 — Frontend Deployment on Declared Constraint (TR-048)
- **Source**: TR-048 / Architecture §A1
- **Layer**: Unit
- **Description**: MMM frontend is deployed to the platform declared in TR-048 (Vercel or equivalent). Deployment configuration matches declared constraints.
- **RED Condition**: Frontend deployed to undeclared platform; deployment config absent.
- **Acceptance Criteria**: vercel.json or equivalent deployment config present for MMM frontend; deployment target matches TR-048 declaration; deployment test confirms correct platform.

### T-MMM-S6-154 — Backend Deployment on Declared Constraint (TR-049)
- **Source**: TR-049 / Architecture §A1
- **Layer**: Unit
- **Description**: MMM backend (Edge Functions, API routes) deployed to Supabase Edge Functions as declared in TR-049.
- **RED Condition**: Backend deployed to undeclared platform; functions not in Supabase.
- **Acceptance Criteria**: supabase/functions/ directory contains MMM function definitions; TR-049 deployment constraint declaration present; deployment test confirms Edge Function reachability.

### T-MMM-S6-155 — Database Deployment on Declared Constraint (TR-050)
- **Source**: TR-050 / Architecture §A1
- **Layer**: Unit
- **Description**: MMM database deployed to Supabase PostgreSQL as declared in TR-050. All migrations apply cleanly.
- **RED Condition**: Database on undeclared platform; migration failures.
- **Acceptance Criteria**: All database migrations in supabase/migrations/ apply without error on clean database; connection test confirms Supabase PostgreSQL target; TR-050 declaration present.

### T-MMM-S6-156 — Commissioning State Machine INSTALLED→VALIDATED→COMMISSIONED→ACTIVATED
- **Source**: TR-051, FR-072 / Architecture §A22
- **Layer**: Integration
- **Description**: MMM implements a four-state commissioning machine. State transitions are sequential and enforced; no state can be skipped.
- **RED Condition**: Commissioning states not implemented; app starts in ACTIVATED without progression.
- **Acceptance Criteria**: Integration test drives commissioning from INSTALLED through each state; skipping VALIDATED to COMMISSIONED returns HTTP 422; ACTIVATED only reachable after all five readiness checks pass.

### T-MMM-S6-157 — Five Readiness Checks Pass Before ACTIVATED State
- **Source**: TR-051, FR-072 / Architecture §A22
- **Layer**: Integration
- **Description**: APP_STARTUP_REQUIREMENTS.md defines ≥5 readiness checks. All must pass before MMM transitions to ACTIVATED state. Failure of any check blocks ACTIVATED.
- **RED Condition**: APP_STARTUP_REQUIREMENTS.md absent; fewer than five checks; ACTIVATED reachable with failed checks.
- **Acceptance Criteria**: APP_STARTUP_REQUIREMENTS.md present with ≥5 named checks; integration test: simulate failure of each check individually; each failure prevents ACTIVATED state transition.

### T-MMM-S6-158 — Health and Telemetry Endpoint Functional (TR-052, FR-067)
- **Source**: TR-052, FR-067 / Architecture §A22
- **Layer**: Integration
- **Description**: GET /api/health returns a structured JSON response with service status, commissioning state, and telemetry for all eight critical paths.
- **RED Condition**: /api/health returns 404 or unstructured text; telemetry absent.
- **Acceptance Criteria**: GET /api/health returns HTTP 200 with JSON body containing: status, commissioning_state, and telemetry object covering all eight paths (free_assessment, framework_creation, evidence_operations, ai_interactions, findings_generation, report_generation, pit_export, dashboard_publication).

### T-MMM-S6-159 — Environment Configuration Requirements Met (TR-053)
- **Source**: TR-053 / Architecture §A1
- **Layer**: Unit
- **Description**: All required environment variables declared in TR-053 are defined and validated at startup. Missing variables prevent application start.
- **RED Condition**: Application starts without required env vars; missing vars silently ignored.
- **Acceptance Criteria**: Unit test of env validation module: removing any required var causes startup to fail with descriptive error; all required vars listed in TR-053 present in .env.example.

### T-MMM-S6-160 — Unit Test Coverage ≥80% (TR-054)
- **Source**: TR-054 / Architecture §A22
- **Layer**: Unit
- **Description**: MMM unit test suite achieves ≥80% line coverage across all modules.
- **RED Condition**: Coverage below 80%; no coverage measurement configured.
- **Acceptance Criteria**: vitest --coverage report shows line coverage ≥80%; CI gate fails if coverage drops below threshold; coverage report committed or uploaded as artifact.

### T-MMM-S6-161 — Integration Test Coverage Meets Threshold (TR-055)
- **Source**: TR-055 / Architecture §A22
- **Layer**: Integration
- **Description**: MMM integration test suite achieves the coverage threshold declared in TR-055 for all critical API paths.
- **RED Condition**: Integration coverage not measured; critical paths not covered.
- **Acceptance Criteria**: Integration test coverage report shows all declared critical paths covered; TR-055 threshold met; CI fails on regression below threshold.

### T-MMM-S6-162 — E2E Test Coverage Meets Declared Critical Paths (TR-056)
- **Source**: TR-056 / Architecture §A22
- **Layer**: E2E
- **Description**: E2E test suite covers all declared critical user paths (journeys J-01 through J-17 primary happy paths plus key error scenarios) as declared in TR-056.
- **RED Condition**: E2E suite absent; critical paths not covered by automation.
- **Acceptance Criteria**: Playwright E2E suite has test files for all 17 journeys; each journey has at least one happy-path test; TR-056 critical path list confirmed covered; CI runs E2E on every PR.

### T-MMM-S6-163 — Performance Test Gate Passes (TR-057)
- **Source**: TR-057 / Architecture §A22
- **Layer**: Integration
- **Description**: The CI performance test gate (k6/Artillery) passes with all SLA thresholds met. Gate is enforced on every build.
- **RED Condition**: Performance gate not configured; SLA thresholds not enforced in CI.
- **Acceptance Criteria**: CI performance step runs k6 test suite; all thresholds from TR-001 through TR-010 pass; build fails if any threshold is missed.

### T-MMM-S6-164 — Accessibility Gate WCAG 2.1 AA Passes (TR-059)
- **Source**: TR-059 / Architecture §A22
- **Layer**: E2E
- **Description**: Automated accessibility scan (axe-core/Lighthouse) confirms WCAG 2.1 AA compliance on all primary MMM routes.
- **RED Condition**: Accessibility gate not configured; WCAG violations present.
- **Acceptance Criteria**: Lighthouse accessibility audit on all primary routes returns score ≥90; axe-core scan returns zero WCAG 2.1 AA violations; gate enforced in CI.

---

## Domain 11: Product Identity & Governance

*Sources: FR-001–FR-005, FR-059, FR-067–FR-068, FR-069, FR-072–FR-080, TR-026, TR-027, TR-060, TR-065*

### T-MMM-S6-165 — MMM Declared as Canonical Maturity Platform (FR-001)
- **Source**: FR-001 / Architecture §A1
- **Layer**: Unit
- **Description**: Architecture and application identity files declare MMM as the single canonical maturity platform, with harvest map SG gates governing source-system transitions.
- **RED Condition**: No canonical declaration; MMM treated as parallel module alongside MAT.
- **Acceptance Criteria**: module.manifest.json declares mmm as canonical maturity platform; architecture.md §A1 includes canonical ownership statement; harvest-map.md SG-1–SG-5 referenced; no live canonical maturity capability outside MMM post-switchover asserted.

### T-MMM-S6-166 — Domain Hierarchy Single-Ownership Rule Enforced (FR-002)
- **Source**: FR-002 / Architecture §A9
- **Layer**: Integration
- **Description**: No module outside MMM can create or manage Domain/MPS/Criteria records. API and database constraints enforce single ownership.
- **RED Condition**: External module can INSERT to domains/mps/criteria tables; no ownership boundary.
- **Acceptance Criteria**: RLS policy test: only MMM service role JWT can write to domains, mps, criteria tables; other module service roles receive HTTP 403; ownership declaration in module.manifest.json.

### T-MMM-S6-167 — Evidence Ownership Anchored at Criterion Level in MMM (FR-003)
- **Source**: FR-003 / Architecture §A15
- **Layer**: Integration
- **Description**: All evidence records have non-null criterion_id linking them to the MMM criterion hierarchy. No evidence record can exist without criterion ownership.
- **RED Condition**: Evidence records with null criterion_id accepted; evidence not anchored.
- **Acceptance Criteria**: Database constraint: evidence.criterion_id NOT NULL enforced; foreign key to criteria table confirmed; INSERT without criterion_id returns constraint violation.

### T-MMM-S6-168 — MMM Deployed as Distinct Application With Own Path (FR-005)
- **Source**: FR-005 / Architecture §A1
- **Layer**: Unit
- **Description**: MMM is deployed as a top-level application under its own domain path (/mmm) with a dedicated deployment target and platform version declaration.
- **RED Condition**: MMM embedded as sub-feature of another app; no distinct deployment target.
- **Acceptance Criteria**: vercel.json or deployment config declares /mmm route prefix for MMM; module.manifest.json has distinct deployment_target and platform_version fields; GET /mmm returns 200 independent of other module routes.

### T-MMM-S6-169 — /api/health Returns Structured JSON Response (FR-067)
- **Source**: FR-067, TR-010 / Architecture §A22
- **Layer**: Integration
- **Description**: GET /api/health returns structured JSON with at minimum: status (ok/degraded/down), version, commissioning_state, and telemetry summary.
- **RED Condition**: /api/health returns 404 or plaintext.
- **Acceptance Criteria**: GET /api/health returns HTTP 200 with Content-Type: application/json; response body contains status, version, commissioning_state, uptime_seconds, and telemetry keys.

### T-MMM-S6-170 — QIW Dashboard Renders Status Indicators (FR-068, TR-060)
- **Source**: FR-068, TR-060 / Architecture §A22
- **Layer**: E2E
- **Description**: The QIW dashboard renders real-time colour-coded (GREEN/AMBER/RED) status indicators for all monitored pipeline stages and 7-day trend for each metric.
- **RED Condition**: QIW dashboard absent; no status indicators; no trend display.
- **Acceptance Criteria**: GET /mmm/admin/qiw renders page with status indicators for build, lint, test, deploy, runtime stages; each shows colour-coded badge; 7-day trend chart visible for each metric.

### T-MMM-S6-171 — QIW API Endpoint Returns Structured Response (FR-068, TR-065)
- **Source**: FR-068, TR-065 / Architecture §A22
- **Layer**: Integration
- **Description**: GET /api/qiw/status returns structured JSON with current pipeline status and 7-day trend data for programmatic consumption.
- **RED Condition**: QIW API endpoint absent; no machine-readable status.
- **Acceptance Criteria**: GET /api/qiw/status returns HTTP 200 with JSON: { stages: [{name, status, trend_7d}] }; all five pipeline stages present; trend data is array of daily values.

### T-MMM-S6-172 — Audit Log Has All Seven Fields and Eight Event Types (FR-073, TR-038)
- **Source**: FR-073, TR-038 / Architecture §A16
- **Layer**: Integration
- **Description**: The audit log schema has all seven fields (action_type, actor_id, target_entity, target_id, timestamp, before_state, after_state) and covers all eight event types (evidence decisions, scoring changes, overrides, approvals, PIT exports, report generation, invitation events, login/logout).
- **RED Condition**: One or more audit log fields absent; one or more event types not logged.
- **Acceptance Criteria**: Schema test confirms all seven columns present; integration test drives all eight event types and confirms audit_log record created for each; no event type silently omitted.

### T-MMM-S6-173 — Tutorial/Help Three Interactions Available at Each Structural Level (FR-074)
- **Source**: FR-074 / Architecture §A9, §A14
- **Layer**: E2E
- **Description**: At criterion, MPS, and domain levels, users have access to: hover tooltip, click expanded help, and "Ask Maturion" AI-powered guidance.
- **RED Condition**: Help interactions absent at one or more structural levels; Ask Maturion missing.
- **Acceptance Criteria**: E2E test at domain, MPS, and criterion levels: (1) hover over name shows tooltip; (2) click help icon shows expanded paragraph; (3) click "Ask Maturion" triggers AIMC chat; all three confirmed at all three structural levels.

### T-MMM-S6-174 — Consistent Notification Model Covers All Eight Event Categories (FR-075)
- **Source**: FR-075 / Architecture §A22
- **Layer**: E2E
- **Description**: The notification/toast system covers all eight categories: success, error+detail, warning, long-running progress, background sync, evidence upload outcome, approval outcome, export/report outcome. No raw alert() calls exist.
- **RED Condition**: Notifications inconsistent; one or more categories missing; alert() calls present.
- **Acceptance Criteria**: E2E test triggers each of eight event categories; correct toast type renders for each; grep of codebase confirms zero window.alert() calls; notification component consistent across all eight.

### T-MMM-S6-175 — State Persistence Across All Nine Declared State Domains (FR-076)
- **Source**: FR-076 / Architecture §A22
- **Layer**: E2E
- **Description**: All nine state domains persist correctly across session reload: org selection, framework selection, navigation position, dashboard filters, evidence drafts, offline queue, AI conversation context, UI preferences, role/scope context.
- **RED Condition**: State lost on reload for one or more domains; preferences not restored.
- **Acceptance Criteria**: E2E test: set state in all nine domains → reload session → confirm all nine domains restored; each using its declared persistence location (profiles, URL, localStorage, IndexedDB, ai_interactions, user_preferences).

### T-MMM-S6-176 — Framework Versioning on All Six Artifact Types (FR-080, TR-026, TR-027)
- **Source**: FR-080, TR-026, TR-027 / Architecture §A9
- **Layer**: Integration
- **Description**: Version fields exist and increment on modification for all six artifact types: framework, publication, assessment run, evidence, report, and PIT export. Historical versions are retrievable.
- **RED Condition**: Version fields absent on one or more artifact types; versions not incremented; history not retained.
- **Acceptance Criteria**: Unit test: each of six artifact types has version field; modifying the artifact increments version; GET /api/:artifact-type/:id/history returns array of previous versions; confirmed for all six types.

---

*End of MMM Stage 6 — QA-to-Red Catalog*
*Total: 176 tests | 80 FRs covered | 66 TRs covered (all key TRs) | 17 Journeys covered*
