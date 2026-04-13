# MMM — UX Workflow & Wiring Spec

## Stage 2 — Pre-Build Specification Artifact

---

## Status Header

- **Module**: MMM — Maturity Model Management
- **Artifact Type**: UX Workflow & Wiring Spec (Stage 2)
- **Status**: DRAFT — For CS2 review and approval
- **Version**: 0.1.0
- **Date**: 2026-04-13
- **Owner**: CS2 (Johan Ras / @APGI-cmy)
- **Produced By**: foreman-v2-agent (POLC-Orchestration mode)
- **Issue**: maturion-isms#1352
- **Upstream Authority**: `MMM_app_description.md` v0.5.0 (CS2-approved)
- **Inputs Used**:
  - `modules/MMM/00-app-description/MMM_app_description.md` v0.5.0
  - `modules/MMM/MMM_strategy.md` v0.1.0
  - `modules/MMM/harvest-map/harvest-map.md` v0.2.0

> **Derivation Rule**: This document derives from the approved App Description (Stage 1).
> All user journeys, screen interactions, and wiring specifications must trace back to
> a section of the App Description. No new capability may be introduced here that is not
> declared in the App Description.

---

## 0. Document Purpose

This document defines the complete UX Workflow & Wiring Spec for MMM — Maturity Model
Management. It specifies:

- **User journeys** — every primary and secondary path a user takes through MMM
- **Screen interactions** — what the user sees and does at each step
- **Data flows** — how data moves between UI, API, schema, and reporting layers
- **Wiring** — explicit connections between UI elements, API endpoints, schema tables, and
  reporting outputs
- **Boundary wiring** — how MMM interfaces with AIMC, PIT, KUC, and other ecosystem modules

This is a **Stage 2 pre-build specification artifact**. It does not define FRS-level
requirements, TRS-level technical constraints, or implementation code. It provides the
UX and workflow baseline from which FRS (Stage 3) will derive functional requirements.

---

## 1. User Journey Map — Overview

MMM supports the following primary user journeys, presented in the canonical sequence
a user follows from first contact to ongoing maturity operations:

| # | Journey | Section | Entry Condition | Primary Actor |
|---|---------|---------|-----------------|---------------|
| J-01 | Landing & attraction | §2 | External visitor | Prospect |
| J-02 | Free assessment | §3 | Landing page click-through | Prospect |
| J-03 | Subscription & sign-up | §4 | Assessment complete or direct subscribe | Subscriber |
| J-04 | Organisation onboarding | §5 | Post-subscription | Main User |
| J-05 | Framework-origin fork | §6 | Onboarding complete | Main User |
| J-06 | Verbatim upload (Mode A) | §7 | Fork decision: existing framework | Main User |
| J-07 | New criteria creation (Mode B) | §8 | Fork decision: no existing framework | Main User |
| J-08 | Framework review & approval | §9 | Framework compiled (either mode) | Main User / Approver |
| J-09 | Publication & activation | §10 | Framework approved | Executive / Main User |
| J-10 | Criterion drill-down & evidence | §11 | Published framework active | Any assigned user |
| J-11 | Audit workbench / walkabout | §12 | Published framework active | Auditor / Evidence Manager |
| J-12 | Findings & recommendations | §13 | Evidence collected | Main User / Domain User |
| J-13 | Output fork — Report | §14 | Findings available | Main User |
| J-14 | Output fork — PIT export | §15 | Findings available | Main User |
| J-15 | Live dashboard | §16 | Published framework with evidence | Any user with dashboard access |
| J-16 | Roles, invitations & permissions | §17 | Post-onboarding (ongoing) | Main User / Admin |
| J-17 | AI interactions (cross-cutting) | §18 | Context-dependent | Any authenticated user |

### Journey Dependencies

```
J-01 → J-02 → J-03 → J-04 → J-05 ──┬── J-06 ──┐
                                      └── J-07 ──┤
                                                  ├── J-08 → J-09 → J-10 → J-12 ──┬── J-13
                                                  │                  │              └── J-14
                                                  │                  └── J-11
                                                  │
                                                  └── J-15 (live, after J-09)
J-16: parallel to J-04 onwards
J-17: cross-cutting, available after J-03
```

---

## 2. Journey J-01 — Landing & Attraction

### User Story
A prospect visits the Maturion platform and discovers the maturity capability.

### Screen Interactions

| Step | Screen / Component | User Action | System Response |
|------|-------------------|-------------|-----------------|
| 2.1 | Landing page | View maturity module explanation | Display product overview, value proposition |
| 2.2 | Tutorial / explanation page | Click "Learn more" or scroll | Progressive disclosure of maturity model concept |
| 2.3 | CTA — Free Assessment | Click "Start Free Assessment" | Navigate to free assessment flow (J-02) |
| 2.4 | CTA — Subscribe | Click "Subscribe" | Navigate to subscription flow (J-03) |

### Wiring

| UI Element | API Endpoint | Schema Table | Notes |
|------------|-------------|--------------|-------|
| Landing page content | `/api/content/landing` | `content_pages` | Static/CMS-driven content |
| Tutorial content | `/api/content/tutorial` | `content_pages` | Progressive disclosure content |
| CTA buttons | Client-side routing | — | Navigation only, no API call |

### Data Flow
```
[Landing Page] → (client-side navigation) → [Free Assessment] or [Subscribe]
```

**Harvest Map Ref**: RR-01 (free assessment flow)
**App Description Ref**: §6.1

---

## 3. Journey J-02 — Free Assessment

### User Story
A prospect completes a free maturity self-assessment to establish a baseline maturity
position before subscription.

### Screen Interactions

| Step | Screen / Component | User Action | System Response |
|------|-------------------|-------------|-----------------|
| 3.1 | Assessment intro | Read instructions | Display assessment overview and expected duration |
| 3.2 | Domain selection | View domains presented | Display 5 canonical domains (or configured set) |
| 3.3 | Domain assessment card | Answer maturity questions per domain | AI processes answers; display progress |
| 3.4 | Assessment review | Review answers before submission | Display summary with edit capability |
| 3.5 | Assessment result | View baseline maturity position | Display maturity spider/radar chart and level summary |
| 3.6 | Subscribe prompt | Click "Subscribe to continue" | Navigate to subscription (J-03) |

### Wiring

| UI Element | API Endpoint | Schema Table | Notes |
|------------|-------------|--------------|-------|
| Domain assessment cards | `POST /api/assessment/free/respond` | `free_assessments`, `assessment_responses` | Anonymous or session-linked |
| Assessment result | `GET /api/assessment/free/result` | `free_assessments` | Computed maturity baseline |
| Maturity chart | `GET /api/assessment/free/result` | `free_assessments` | Client-side chart rendering from API data |
| AI assessment interpretation | `POST /api/ai/assessment-interpret` → AIMC | `ai_interactions` | AIMC-routed, not local AI |

### Data Flow
```
[User answers] → POST /api/assessment/free/respond → [free_assessments + assessment_responses]
                                                      ↓
[AIMC: interpret] ← POST /api/ai/assessment-interpret ← [assessment_responses]
                                                      ↓
[Result display] ← GET /api/assessment/free/result ← [free_assessments (computed baseline)]
```

### Secondary Paths
- **Abandon assessment**: User may leave and return; partial state preserved via session/cookie
- **Skip to subscribe**: User may subscribe without completing assessment; prompted to complete
  before framework configuration (App Description §6.3)

**Harvest Map Ref**: RR-01
**App Description Ref**: §6.2, §6.3

---

## 4. Journey J-03 — Subscription & Sign-Up

### User Story
A user subscribes to the Maturion platform and creates an account.

### Screen Interactions

| Step | Screen / Component | User Action | System Response |
|------|-------------------|-------------|-----------------|
| 4.1 | Subscription plan selection | Choose plan | Display plan options and pricing |
| 4.2 | Payment | Complete payment | Process payment; confirm subscription |
| 4.3 | Account creation | Provide email, password, name | Create auth identity |
| 4.4 | Email verification | Confirm email | Activate account |
| 4.5 | First login | Log in | Navigate to organisation onboarding (J-04) |

### Wiring

| UI Element | API Endpoint | Schema Table | Notes |
|------------|-------------|--------------|-------|
| Plan selection | `GET /api/subscriptions/plans` | `subscription_plans` | Shared platform subscription service |
| Payment | `POST /api/subscriptions/checkout` | `subscriptions` | External payment provider integration |
| Account creation | `POST /api/auth/register` | `auth.users`, `profiles` | Auth provider (Supabase Auth or equivalent) |
| Email verification | Auth provider callback | `auth.users` | Automated by auth provider |
| Login | `POST /api/auth/login` | `auth.users` | JWT-based session |

### Data Flow
```
[Plan selection] → POST /api/subscriptions/checkout → [subscriptions]
[Account creation] → POST /api/auth/register → [auth.users, profiles]
[Email confirm] → auth provider → [auth.users.email_confirmed]
[Login] → POST /api/auth/login → [JWT session token]
```

**App Description Ref**: §6.1

---

## 5. Journey J-04 — Organisation Onboarding

### User Story
After subscription, the main user provides organisational context that establishes
the foundation for all maturity work.

### Screen Interactions

| Step | Screen / Component | User Action | System Response |
|------|-------------------|-------------|-----------------|
| 5.1 | Organisation name | Enter organisation name | Validate and store |
| 5.2 | Organisational context | Describe organisation context | Store context for AI use |
| 5.3 | Industry / sector | Select or enter industry | Store; informs AI framework generation |
| 5.4 | Hierarchy / structure | Define sites, operations, subsidiaries | Store organisational hierarchy |
| 5.5 | Maturity intent | Describe maturity goals and operating context | Store; informs AI |
| 5.6 | Free assessment linking | Link prior free assessment (if exists) | Import baseline maturity from free assessment |
| 5.7 | Onboarding complete | Review and confirm | Navigate to framework-origin fork (J-05) |

### Wiring

| UI Element | API Endpoint | Schema Table | Notes |
|------------|-------------|--------------|-------|
| Organisation form | `POST /api/organisations` | `organisations` | Creates org record |
| Context/industry | `PUT /api/organisations/:id` | `organisations` | Updates org with context |
| Hierarchy setup | `POST /api/organisations/:id/hierarchy` | `organisation_hierarchy` | Sites, operations, subsidiaries |
| Assessment link | `POST /api/organisations/:id/link-assessment` | `organisations`, `free_assessments` | Links prior free assessment |
| Onboarding status | `PUT /api/organisations/:id/onboarding` | `organisations` | Marks onboarding complete |

### Data Flow
```
[Org form fields] → POST /api/organisations → [organisations]
[Hierarchy] → POST /api/organisations/:id/hierarchy → [organisation_hierarchy]
[Assessment link] → POST /api/organisations/:id/link-assessment → [organisations.assessment_id]
[Onboarding complete] → PUT /api/organisations/:id/onboarding → [organisations.onboarding_complete = true]
```

### Maturity Context Persistence
Per App Description §6.4, after onboarding completes:
- Current maturity level (from free assessment)
- Current domain maturity
- Target level (initially derived from AI interpretation)
- Current-to-next-level gap

These persist across all subsequent workflows via the `maturity_context` table/view.

**Harvest Map Ref**: RR-02
**App Description Ref**: §7.1

---

## 6. Journey J-05 — Framework-Origin Fork

### User Story
The user decides how to create their maturity framework — either by uploading an existing
framework (Mode A) or by having MMM + AI create a new one (Mode B).

### Screen Interactions

| Step | Screen / Component | User Action | System Response |
|------|-------------------|-------------|-----------------|
| 6.1 | Fork decision screen | View two options | Display Mode A and Mode B with clear descriptions |
| 6.2a | Select Mode A | Click "Upload Existing Framework" | Navigate to verbatim upload flow (J-06) |
| 6.2b | Select Mode B | Click "Create New Framework" | Navigate to new criteria creation flow (J-07) |

### Wiring

| UI Element | API Endpoint | Schema Table | Notes |
|------------|-------------|--------------|-------|
| Fork decision | `POST /api/frameworks/init` | `frameworks` | Creates framework record with origin_mode |
| Mode A selection | Client-side routing | `frameworks.origin_mode = 'verbatim_import'` | Updates framework record |
| Mode B selection | Client-side routing | `frameworks.origin_mode = 'ai_generated'` | Updates framework record |

### Data Flow
```
[Fork decision] → POST /api/frameworks/init → [frameworks { origin_mode, organisation_id }]
                                                ↓
                                    [Route to J-06 or J-07]
```

### Strategic Note
Per App Description §7.3, the expected dominant path is Mode B (new criteria creation).
Mode A (verbatim upload) is the less frequent but equally first-class path.

**Harvest Map Ref**: MT-01 (Mode A), LG-01 (Mode B)
**App Description Ref**: §7.2, §7.3

---

## 7. Journey J-06 — Verbatim Upload (Mode A)

### User Story
The user uploads an existing maturity standard or criteria model. MMM + AIMC parses it
into the Domain → MPS → Criteria hierarchy while preserving verbatim source meaning.

### Screen Interactions

| Step | Screen / Component | User Action | System Response |
|------|-------------------|-------------|-----------------|
| 7.1 | Upload interface | Upload document(s) | Accept file; send to AIMC/KUC ingestion |
| 7.2 | Ingestion progress | Wait / view progress | Display parsing progress and status |
| 7.3 | Parsed structure preview | Review extracted Domain/MPS/Criteria | Display parsed hierarchy with source anchors |
| 7.4 | Ambiguity review | Review flagged ambiguities | Display items AI flagged for human review |
| 7.5 | Human correction | Edit, approve, or reject parsed items | Update extracted hierarchy per human decisions |
| 7.6 | Coverage verification | Review coverage report | Display mapped vs unmapped source content |
| 7.7 | Framework compilation | Confirm and compile | Create compiled framework from reviewed extraction |

### Wiring

| UI Element | API Endpoint | Schema Table | Notes |
|------------|-------------|--------------|-------|
| File upload | `POST /api/upload/framework-source` → KUC | `documents`, `uploads` | KUC-governed ingestion; document_role = 'criteria_source' |
| Parse trigger | `POST /api/ai/framework-parse` → AIMC | `ai_interactions`, `parse_jobs` | AIMC framework-source ingestion path |
| Parsed preview | `GET /api/frameworks/:id/parsed` | `parsed_domains`, `parsed_mps`, `parsed_criteria` | Staged parsed output |
| Ambiguity list | `GET /api/frameworks/:id/ambiguities` | `parse_ambiguities` | AI-flagged items for human review |
| Human corrections | `PUT /api/frameworks/:id/parsed/:itemId` | `parsed_*` tables | Human edits to parsed output |
| Coverage report | `GET /api/frameworks/:id/coverage` | `parse_coverage` | Mapped vs unmapped source blocks |
| Compile framework | `POST /api/frameworks/:id/compile` | `domains`, `mps`, `criteria` | Moves parsed → canonical hierarchy |

### Data Flow — Framework-Source Ingestion Path
```
[Document upload] → POST /api/upload/framework-source → KUC
                                                        ↓
[KUC: store + classify] → [documents { document_role: 'criteria_source' }]
                                                        ↓
[AIMC: parse] ← POST /api/ai/framework-parse ← [documents]
                                                        ↓
[Parsed structure] → [parsed_domains, parsed_mps, parsed_criteria]
                                                        ↓
[Human review] → PUT corrections → [parsed_* tables]
                                                        ↓
[Compile] → POST /api/frameworks/:id/compile → [domains, mps, criteria]
```

### No Hallucination Rule
Per App Description §12.3: In verbatim-import mode, AI may not invent criteria. If
uncertain, AI must flag for human review, show source anchor, and show rationale for
structural interpretation.

### Secondary Paths
- **Reject entire parse**: User can discard and re-upload a different document
- **Partial acceptance**: User may accept some parsed items and reject others
- **Re-upload additional sources**: User may add supplementary documents

**Harvest Map Ref**: MT-01
**App Description Ref**: §12

---

## 8. Journey J-07 — New Criteria Creation (Mode B)

### User Story
MMM + AI generates a new maturity framework from scratch based on organisational context,
industry, and maturity intent.

### Screen Interactions

| Step | Screen / Component | User Action | System Response |
|------|-------------------|-------------|-----------------|
| 8.1 | Generation context | Review and refine org context for AI | Display pre-filled context from onboarding |
| 8.2 | AI generation trigger | Click "Generate Framework" | AIMC generates framework; display progress |
| 8.3 | Domain review | Review AI-proposed domains | Display proposed domains with edit/delete/recompile/AI-chat |
| 8.4 | MPS review (per domain) | Review AI-proposed MPSs | Display proposed MPSs with edit/delete/recompile/AI-chat |
| 8.5 | Intent statement review | Review AI-proposed intent statements | Display intent statements with edit capability |
| 8.6 | Criteria review (per MPS) | Review AI-proposed criteria | Display proposed criteria with edit/delete/recompile/AI-chat |
| 8.7 | Level descriptor review | Review AI-proposed maturity level descriptors | Display descriptors per criterion with edit capability |
| 8.8 | Framework compilation | Confirm and compile | Create compiled framework from reviewed AI output |

### Wiring

| UI Element | API Endpoint | Schema Table | Notes |
|------------|-------------|--------------|-------|
| Context review | `GET /api/organisations/:id` | `organisations` | Pre-filled from onboarding |
| AI generation | `POST /api/ai/framework-generate` → AIMC | `ai_interactions`, `generation_jobs` | AIMC framework-source generation |
| Domain review | `GET /api/frameworks/:id/proposed/domains` | `proposed_domains` | Staged AI output |
| MPS review | `GET /api/frameworks/:id/proposed/domains/:domainId/mps` | `proposed_mps` | Per-domain MPS list |
| Intent statements | `GET /api/frameworks/:id/proposed/mps/:mpsId/intent` | `proposed_mps` | Intent statement field |
| Criteria review | `GET /api/frameworks/:id/proposed/mps/:mpsId/criteria` | `proposed_criteria` | Per-MPS criteria list |
| Level descriptors | `GET /api/frameworks/:id/proposed/criteria/:criterionId/levels` | `proposed_level_descriptors` | 5-level scale descriptors |
| AI altering mechanism | `POST /api/ai/framework-alter` → AIMC | `ai_interactions` | Edit/delete/recompile/AI-chat |
| Compile framework | `POST /api/frameworks/:id/compile` | `domains`, `mps`, `criteria`, `level_descriptors` | Proposed → canonical |

### Data Flow
```
[Org context] → POST /api/ai/framework-generate → AIMC
                                                    ↓
[AI-generated structure] → [proposed_domains, proposed_mps, proposed_criteria, proposed_level_descriptors]
                                                    ↓
[User review + AI alter] → PUT corrections → [proposed_* tables]
                                                    ↓
[Compile] → POST /api/frameworks/:id/compile → [domains, mps, criteria, level_descriptors]
```

### AI Proposed Altering Mechanism
Per App Description §11.5, at every AI-proposed element the user has:
- **Edit** — directly modify the AI-proposed content
- **Delete** — remove the proposed element
- **Recompile** — ask AI to regenerate this element with updated context
- **AI Chat** — ask Maturion AI for explanation or alternatives

**Harvest Map Ref**: LG-01
**App Description Ref**: §11

---

## 9. Journey J-08 — Framework Review & Approval

### User Story
The compiled framework passes through a three-tier approval workflow before publication.

### Screen Interactions

| Step | Screen / Component | User Action | System Response |
|------|-------------------|-------------|-----------------|
| 9.1 | Framework overview | View complete compiled framework tree | Display Domain → MPS → Criteria hierarchy |
| 9.2 | Level 1 — User approval | Confirm individual items | Mark items as user-approved; audit trail |
| 9.3 | Level 2 — Domain approval | Submit domain for sign-off | Lock domain pending higher approval |
| 9.4 | Domain review communication | Back-and-forth with approver | Track comments, suggestions, changes |
| 9.5 | Level 3 — Executive sign-off | Final sign-off on entire framework | Lock framework for publication |

### Wiring

| UI Element | API Endpoint | Schema Table | Notes |
|------------|-------------|--------------|-------|
| Framework tree | `GET /api/frameworks/:id/tree` | `domains`, `mps`, `criteria` | Full hierarchy with approval states |
| Level 1 approval | `POST /api/approvals/item` | `approvals` | Per-item approval at MPS/criteria level |
| Level 2 domain submission | `POST /api/approvals/domain` | `approvals` | Domain-level submission |
| Approval communication | `POST /api/approvals/:id/comments` | `approval_comments` | Back-and-forth tracking |
| Level 3 sign-off | `POST /api/approvals/framework` | `approvals`, `frameworks` | Framework-level executive sign-off |
| Unlock for re-edit | `POST /api/approvals/:id/unlock` | `approvals` | Controlled unlock after rejection |

### Data Flow
```
[Level 1: User] → POST /api/approvals/item → [approvals { level: 1, status: 'approved' }]
                                               ↓
[Level 2: Domain] → POST /api/approvals/domain → [approvals { level: 2, status: 'submitted' }]
                                                   ↓
[Approval comms] ← → POST /api/approvals/:id/comments ← → [approval_comments]
                                                   ↓
[Level 3: Executive] → POST /api/approvals/framework → [approvals { level: 3, status: 'signed_off' }]
                                                        [frameworks.status = 'approved']
```

### Audit Trail
Per App Description §21.2, all approval actions are audit-trailed:
approve, reject, suggest alternative, unlock, resubmit, override, final sign-off.

**Harvest Map Ref**: RR-04
**App Description Ref**: §21

---

## 10. Journey J-09 — Publication & Activation

### User Story
The approved framework is published, activating the live maturity platform and all
operational features.

### Screen Interactions

| Step | Screen / Component | User Action | System Response |
|------|-------------------|-------------|-----------------|
| 10.1 | Publication confirmation | Click "Publish Framework" | Confirm publication intent |
| 10.2 | Publication processing | Wait | System activates live maturity platform |
| 10.3 | Celebration | View publication celebration | Display celebratory UX moment |
| 10.4 | Dashboard activation | Navigate to dashboard | Live dashboard now available |

### Wiring

| UI Element | API Endpoint | Schema Table | Notes |
|------------|-------------|--------------|-------|
| Publish button | `POST /api/frameworks/:id/publish` | `frameworks`, `publications` | Creates publication record |
| Publication status | `GET /api/frameworks/:id/status` | `frameworks` | framework_status = 'published' |
| Dashboard activation | `POST /api/dashboard/:orgId/activate` | `dashboards` | Creates dashboard instance |
| Celebration | Client-side | — | Celebratory UX pattern (App Description §22.3) |

### Publication Effects
Per App Description §22.2, publication activates:
- Live maturity platform
- Evidence activity
- Dashboard publication
- Achievement tracking
- Current-to-target maturity movement
- PIT handoff capability

**Harvest Map Ref**: RR-06
**App Description Ref**: §22

---

## 11. Journey J-10 — Criterion Drill-Down & Evidence

### User Story
Users navigate the published framework to individual criteria where they manage evidence,
view maturity scores, and access findings.

### Screen Interactions

| Step | Screen / Component | User Action | System Response |
|------|-------------------|-------------|-----------------|
| 11.1 | Framework navigator | Browse Domain → MPS → Criteria tree | Display hierarchy with maturity indicators |
| 11.2 | Criterion card | Click criterion | Display criterion detail card |
| 11.3 | Evidence workspace trigger | Click "Manage Evidence" on criterion | Open evidence modal/workspace |
| 11.4 | Evidence upload | Upload file, photo, audio, etc. | Submit to evidence-source ingestion path |
| 11.5 | Evidence classification | Classify evidence type | Store metadata |
| 11.6 | AI evidence evaluation | View AI assessment of evidence | Display AI-proposed maturity score |
| 11.7 | Human confirmation | Accept, query, or override AI score | Record decision with audit trail |
| 11.8 | Evidence summary | View current evidence state for criterion | Display linked evidence list with statuses |

### Wiring

| UI Element | API Endpoint | Schema Table | Notes |
|------------|-------------|--------------|-------|
| Framework tree nav | `GET /api/frameworks/:id/tree` | `domains`, `mps`, `criteria` | With maturity indicators |
| Criterion card | `GET /api/criteria/:id` | `criteria`, `maturity_scores`, `evidence_summary` | Full criterion detail |
| Evidence modal | `GET /api/criteria/:id/evidence` | `evidence` | Evidence list for criterion |
| Evidence upload | `POST /api/upload/evidence` → KUC | `documents`, `evidence` | KUC evidence-source ingestion |
| AI evaluation | `POST /api/ai/evidence-evaluate` → AIMC | `ai_interactions`, `score_proposals` | AIMC evidence classification |
| Human confirmation | `POST /api/scores/:id/confirm` | `maturity_scores` | Human-in-the-loop scoring |
| Human override | `POST /api/scores/:id/override` | `maturity_scores`, `override_log` | Override with audit trail |

### Data Flow — Evidence-Source Ingestion Path
```
[Evidence upload] → POST /api/upload/evidence → KUC
                                                 ↓
[KUC: store + classify] → [documents { document_role: 'evidence' }, evidence { criterion_id }]
                                                 ↓
[AIMC: evaluate] ← POST /api/ai/evidence-evaluate ← [evidence metadata + content]
                                                 ↓
[Score proposal] → [score_proposals { criterion_id, proposed_level, confidence }]
                                                 ↓
[Human confirm/override] → POST /api/scores/:id/confirm or /override
                                                 ↓
[Maturity score updated] → [maturity_scores { criterion_id, level, confirmed_by }]
                                                 ↓
[Live scoring recalculation] → trigger: MPS → Domain → Organisation level rollup
```

### Evidence Types Supported
Per App Description §17.3:
- Uploaded files/documents
- Photos/images
- Voice/audio
- Interview/conversation content
- Evidence links
- System/database integrations
- PIT-linked implementation evidence
- Risk Management evidence
- Incident Management evidence

### Criterion Card Components
Per App Description §14.4:
- Statement / neutral control statement
- Sequence number
- Summary of evidence state
- Current maturity level
- What is achieved vs what remains
- Tutorial/help component (Hover → Click → Ask Maturion)
- AI chat assistance
- Evidence entry/access
- Findings and recommendations access
- Level-descriptor visibility
- Approval state visibility

**Harvest Map Ref**: MT-03, MT-04
**App Description Ref**: §14, §17

---

## 12. Journey J-11 — Audit Workbench / Walkabout Mode

### User Story
A user conducts a field audit, collecting evidence on mobile while moving through the
organisation. This is the surviving MAT DNA inside MMM — repositioned as an operating
mode of MMM, not a standalone identity.

### Screen Interactions

| Step | Screen / Component | User Action | System Response |
|------|-------------------|-------------|-----------------|
| 12.1 | Audit session start | Create new audit session | Initialize audit with selected scope (domain/MPS/criteria) |
| 12.2 | Criterion walkthrough | Navigate criteria sequentially | Display criterion card in mobile-optimised view |
| 12.3 | Voice recording | Record voice observation | Capture audio; queue for upload |
| 12.4 | Photo capture | Take photo evidence | Capture image; queue for upload |
| 12.5 | File attachment | Attach document | Queue for upload |
| 12.6 | Finding note | Enter text finding at criterion | Store finding note |
| 12.7 | AI score proposal | View AI-proposed score after evidence | Display proposed score for human confirmation |
| 12.8 | Offline queue management | View sync status | Display queued items and sync progress |
| 12.9 | Sync on reconnect | Reconnect to network | Auto-sync queued evidence and findings |
| 12.10 | Audit session close | End audit session | Finalize session; trigger scoring recalculation |

### Wiring

| UI Element | API Endpoint | Schema Table | Notes |
|------------|-------------|--------------|-------|
| Audit session | `POST /api/audits/sessions` | `audit_sessions` | Scoped audit session |
| Criterion walkthrough | `GET /api/audits/sessions/:id/criteria` | `criteria` (filtered by scope) | Mobile-optimised view |
| Voice recording | `POST /api/upload/evidence` → KUC | `evidence { type: 'audio' }` | Via KUC; queued offline |
| Photo capture | `POST /api/upload/evidence` → KUC | `evidence { type: 'image' }` | Via KUC; queued offline |
| Finding note | `POST /api/findings/note` | `findings` | Text finding at criterion |
| Offline queue | Local storage / IndexedDB | — | Client-side queue |
| Sync | `POST /api/sync/evidence-batch` | `evidence`, `findings` | Batch sync on reconnect |
| Session close | `PUT /api/audits/sessions/:id/close` | `audit_sessions` | Triggers scoring recalculation |

### Data Flow — Offline / Walkabout
```
[Evidence capture] → [Local queue (IndexedDB)]
                      ↓ (on reconnect)
[Batch sync] → POST /api/sync/evidence-batch → KUC → [evidence, findings]
                                                       ↓
[AIMC: evaluate batch] → [score_proposals]
                          ↓
[Scoring recalculation] → [maturity_scores rollup]
```

### Offline Requirements
Per App Description §18.4:
- Local queueing
- Timestamp preservation
- Sync on reconnect
- Duplicate prevention
- Sync status tracking

**Harvest Map Ref**: MT-02, MT-05
**App Description Ref**: §18

---

## 13. Journey J-12 — Findings & Recommendations

### User Story
The system generates structured findings and recommendations based on evidence assessment
and maturity scoring. This is the single shared findings model that feeds both Report
and PIT output paths.

### Screen Interactions

| Step | Screen / Component | User Action | System Response |
|------|-------------------|-------------|-----------------|
| 13.1 | Findings dashboard | View findings overview | Display findings by domain, MPS, criterion |
| 13.2 | Finding detail | Click finding | Display finding with evidence reference, gap, recommendation |
| 13.3 | AI recommendation | View AI-generated recommendation | Display recommendation with confidence level |
| 13.4 | Human review | Accept, modify, or reject recommendation | Record decision |
| 13.5 | Priority/severity assignment | Set priority and severity | Store finding priority |
| 13.6 | Owner assignment | Assign responsible person | Store finding ownership |
| 13.7 | Output fork decision | Choose "Create Report" or "Export to PIT" | Navigate to J-13 or J-14 |

### Wiring

| UI Element | API Endpoint | Schema Table | Notes |
|------------|-------------|--------------|-------|
| Findings overview | `GET /api/findings?framework_id=:id` | `findings` | Filtered by framework/org |
| Finding detail | `GET /api/findings/:id` | `findings`, `evidence`, `maturity_scores` | With linked evidence |
| AI recommendation | `POST /api/ai/recommend` → AIMC | `ai_interactions`, `recommendations` | AIMC-generated |
| Human decision | `PUT /api/findings/:id` | `findings` | Accept/modify/reject |
| Priority | `PUT /api/findings/:id/priority` | `findings` | Priority/severity |
| Owner | `PUT /api/findings/:id/owner` | `findings` | Ownership assignment |

### Shared Findings Model
Per App Description §19.1, each finding references:
- Criterion
- Evidence
- Maturity position
- Rationale
- Gap to next level
- Recommendation
- Owner/responsibility
- Priority/severity
- Due date / target date

### No Duplicate Truth Rule
Per App Description §19.3: Report generation and PIT export must not create separate
incompatible versions of findings. Both derive from this single shared model.

**Harvest Map Ref**: MT-06
**App Description Ref**: §19

---

## 14. Journey J-13 — Output Fork: Report

### User Story
The user generates a formal maturity report from the shared findings model.

### Screen Interactions

| Step | Screen / Component | User Action | System Response |
|------|-------------------|-------------|-----------------|
| 14.1 | Report configuration | Select report scope and format | Display report options |
| 14.2 | Report preview | Preview generated report | Display report with sections |
| 14.3 | Report editing | Edit report content/narrative | Modify report in-place |
| 14.4 | Report generation | Click "Generate Report" | Produce PDF/DOCX + structured JSON |
| 14.5 | Report download | Download report | Provide download link |

### Wiring

| UI Element | API Endpoint | Schema Table | Notes |
|------------|-------------|--------------|-------|
| Report config | `POST /api/reports/configure` | `report_configs` | Scope, format selection |
| Report preview | `GET /api/reports/:id/preview` | `report_configs`, `findings` | Server-rendered preview |
| Report edit | `PUT /api/reports/:id/content` | `report_drafts` | In-place editing |
| Report generate | `POST /api/reports/:id/generate` | `reports` | PDF/DOCX generation service |
| Report download | `GET /api/reports/:id/download` | `reports` | File download |
| Structured JSON export | `GET /api/reports/:id/export/json` | `reports` | Machine-readable export |

### Data Flow
```
[Findings model] → POST /api/reports/configure → [report_configs]
                                                   ↓
[Report preview] ← GET /api/reports/:id/preview ← [findings + framework + evidence refs]
                                                   ↓
[Generate] → POST /api/reports/:id/generate → [reports { format: 'pdf'/'docx', content }]
                                               ↓
[Download] ← GET /api/reports/:id/download ← [reports]
```

### Report Sections
Per App Description §20.2:
- Executive summary
- Methodology
- Framework structure
- Findings by Domain / MPS / Criteria
- Maturity definitions
- Evidence references
- Recommendations
- Target-state path
- Tasks / ownership / dates

**Harvest Map Ref**: MT-07
**App Description Ref**: §20.2

---

## 15. Journey J-14 — Output Fork: PIT Export

### User Story
The user exports findings and recommendations to PIT as a structured implementation plan.

### Screen Interactions

| Step | Screen / Component | User Action | System Response |
|------|-------------------|-------------|-----------------|
| 15.1 | Export configuration | Select findings for export to PIT | Display exportable findings |
| 15.2 | Export preview | Preview export package | Display structured export data |
| 15.3 | Export trigger | Click "Export to PIT" | Send export package to PIT |
| 15.4 | Export confirmation | View confirmation | Display PIT import confirmation and link |

### Wiring

| UI Element | API Endpoint | Schema Table | Notes |
|------------|-------------|--------------|-------|
| Export config | `POST /api/pit-export/configure` | `pit_exports` | Select findings scope |
| Export preview | `GET /api/pit-export/:id/preview` | `pit_exports`, `findings` | Preview before send |
| Export trigger | `POST /api/pit-export/:id/send` | `pit_exports` | **MMM → PIT interface contract** |
| Export status | `GET /api/pit-export/:id/status` | `pit_exports` | Confirmation from PIT |

### MMM → PIT Interface Contract
Per Harvest Map §MMM ↔ PIT Boundary:
1. MMM generates findings and recommendations
2. User triggers "Export to PIT"
3. MMM produces structured export package conforming to the MMM → PIT interface contract
4. PIT receives the package and creates the executable implementation plan
5. PIT owns all downstream plan lifecycle

### Export Package Contents
Per App Description §20.3:
- Findings
- Recommendations
- Implementation tasks
- Reason codes
- Priorities
- Due dates
- Open constraints
- Linked maturity targets

### Ownership Boundary
- **MMM owns**: findings generation, export production, export status tracking
- **PIT owns**: import processing, plan creation, plan execution lifecycle
- **PROHIBITED**: No hidden PIT-owned planning logic inside MMM

**Harvest Map Ref**: RR-07, MMM ↔ PIT Boundary
**App Description Ref**: §20.3

---

## 16. Journey J-15 — Live Dashboard

### User Story
The live dashboard provides continuous organisational maturity visibility — the
"Operational Maturity House" concept from Maturity Roadmap.

### Screen Interactions

| Step | Screen / Component | User Action | System Response |
|------|-------------------|-------------|-----------------|
| 16.1 | Dashboard overview | View maturity house | Display house visualisation with domain indicators |
| 16.2 | Domain drill-down | Click domain | Display domain detail with MPS scores |
| 16.3 | MPS drill-down | Click MPS | Display MPS detail with criteria scores |
| 16.4 | Criterion drill-down | Click criterion | Navigate to criterion detail (J-10) |
| 16.5 | Achievement feed | View live feed | Display latest maturity movements and achievements |
| 16.6 | Hierarchy filter | Filter by site/operation/subsidiary | Filter dashboard data by organisational unit |
| 16.7 | Current vs target | View gap analysis | Display current-state vs target-state comparison |

### Wiring

| UI Element | API Endpoint | Schema Table | Notes |
|------------|-------------|--------------|-------|
| Dashboard house | `GET /api/dashboard/:orgId` | `dashboards`, `maturity_scores` | Aggregated scores |
| Domain detail | `GET /api/dashboard/:orgId/domains/:domainId` | `maturity_scores` | Domain-level scores |
| MPS detail | `GET /api/dashboard/:orgId/mps/:mpsId` | `maturity_scores` | MPS-level scores |
| Achievement feed | `GET /api/dashboard/:orgId/achievements` | `achievements` | Recent maturity movements |
| Hierarchy filter | `GET /api/dashboard/:orgId?hierarchy=:unitId` | `maturity_scores`, `organisation_hierarchy` | Filtered view |
| Gap analysis | `GET /api/dashboard/:orgId/gap` | `maturity_scores`, `maturity_targets` | Current vs target |

### House Structure
Per App Description §23.2:
- **Roof** → Leadership and Governance
- **Wall** → Process Integrity
- **Wall** → People and Culture
- **Wall** → Protection
- **Foundation** → Proof it Works

### Dashboard Panels
- Current State
- Working On / Next State
- Overall maturity level
- Domain-level maturity indicators

**Harvest Map Ref**: RR-06
**App Description Ref**: §23

---

## 17. Journey J-16 — Roles, Invitations & Permissions

### User Story
The main user manages organisational roles, invites team members, and controls
scope-based permissions throughout MMM.

### Screen Interactions

| Step | Screen / Component | User Action | System Response |
|------|-------------------|-------------|-----------------|
| 17.1 | User management screen | View current users and roles | Display user list with roles and scopes |
| 17.2 | Invite user | Enter email, select role and scope | Send invitation |
| 17.3 | Role assignment | Assign role to user | Update user role |
| 17.4 | Scope assignment | Assign scope (framework/domain/MPS/criterion/evidence) | Update user scope |
| 17.5 | Permission review | Review effective permissions | Display permission matrix |

### Wiring

| UI Element | API Endpoint | Schema Table | Notes |
|------------|-------------|--------------|-------|
| User list | `GET /api/organisations/:id/users` | `organisation_users` | With roles and scopes |
| Invite | `POST /api/invitations` | `invitations` | Role-scoped invitation |
| Role assignment | `PUT /api/organisations/:id/users/:userId/role` | `organisation_users` | Role update |
| Scope assignment | `PUT /api/organisations/:id/users/:userId/scope` | `user_scopes` | Scope-based permissions |
| Permission matrix | `GET /api/organisations/:id/users/:userId/permissions` | `user_scopes` | Computed effective permissions |

### Core Roles
Per App Description §24.1:
- Main User / Implementation Lead
- Domain User
- MPS User
- Evidence Manager
- Approver
- Executive Sign-Off User
- Independent Auditor (scoped/temporary)

### Permission Model
- Permissions scoped to: framework, domain, MPS, criterion, evidence set, approval scope
- Inheritance rule: if lower-level responsibility is not assigned, responsibility remains
  with the last assigned higher level (App Description §24.4)
- Approvals escalate one level up (§24.5)

**Harvest Map Ref**: RR-08
**App Description Ref**: §24

---

## 18. Journey J-17 — AI Interactions (Cross-Cutting)

### User Story
AI is available throughout MMM via AIMC, supporting framework generation, evidence
evaluation, scoring, findings, and contextual guidance.

### Screen Interactions

| Step | Screen / Component | User Action | System Response |
|------|-------------------|-------------|-----------------|
| 18.1 | AI chat (embedded) | Open AI assistant | Display context-aware AI chat |
| 18.2 | Tutorial — Hover | Hover over element | Display short tooltip explanation |
| 18.3 | Tutorial — Click | Click explanation | Display paragraph explanation |
| 18.4 | Tutorial — Ask Maturion | Click "Ask Maturion" | Open guided AI explanation |
| 18.5 | AI score proposal | View AI-proposed score | Display proposal with confidence |
| 18.6 | AI recommendation | View AI recommendation | Display recommendation with rationale |

### Wiring

| UI Element | API Endpoint | Schema Table | Notes |
|------------|-------------|--------------|-------|
| AI chat | `POST /api/ai/chat` → AIMC | `ai_interactions` | Context-aware chat via AIMC |
| Tutorial hover | Client-side | `help_content` | Pre-loaded help content |
| Tutorial click | `GET /api/help/:contextId` | `help_content` | Extended help content |
| Ask Maturion | `POST /api/ai/explain` → AIMC | `ai_interactions` | Guided AI explanation |
| Score proposal | `POST /api/ai/evidence-evaluate` → AIMC | `score_proposals` | Same as J-10 |
| Recommendation | `POST /api/ai/recommend` → AIMC | `recommendations` | Same as J-12 |

### AI Routing Rule
Per App Description §26.1 and §26.4: All AI functionality routes through AIMC.
No local AI stack inside MMM.

### Human Oversight
Per App Description §26.3: AI remains subject to human confirmation, override,
audit trail, governance controls, and Watchdog visibility.

**App Description Ref**: §14.5, §26

---

## 19. Boundary & Ownership Wiring

### 19.1 MMM ↔ AIMC Boundary

| Interaction | Direction | Interface | Owner |
|------------|-----------|-----------|-------|
| Framework parsing (Mode A) | MMM → AIMC | `POST /api/ai/framework-parse` | AIMC |
| Framework generation (Mode B) | MMM → AIMC | `POST /api/ai/framework-generate` | AIMC |
| Framework altering | MMM → AIMC | `POST /api/ai/framework-alter` | AIMC |
| Evidence evaluation | MMM → AIMC | `POST /api/ai/evidence-evaluate` | AIMC |
| Scoring recommendations | MMM → AIMC | `POST /api/ai/recommend` | AIMC |
| Contextual chat | MMM → AIMC | `POST /api/ai/chat` | AIMC |
| Contextual explanation | MMM → AIMC | `POST /api/ai/explain` | AIMC |
| Assessment interpretation | MMM → AIMC | `POST /api/ai/assessment-interpret` | AIMC |
| Knowledge upload/ingestion | MMM → KUC (within AIMC) | `POST /api/upload/*` | AIMC/KUC |

**Key Rule**: All AI interactions are AIMC-mediated. MMM calls AIMC; AIMC routes to
appropriate model/provider. MMM never calls AI providers directly.

### 19.2 MMM ↔ PIT Boundary

| Interaction | Direction | Interface | Owner |
|------------|-----------|-----------|-------|
| Export findings to PIT | MMM → PIT | `POST /api/pit-export/:id/send` | MMM (producer) |
| PIT import acknowledgment | PIT → MMM | Callback / webhook | PIT (consumer) |
| Implementation evidence return | PIT → MMM | `POST /api/evidence/pit-return` | PIT (producer), MMM (consumer) |

**Key Rule**: MMM owns findings production and export. PIT owns import and execution.
No PIT-owned planning logic inside MMM.

**Interface Contract**: The MMM → PIT export/interface contract must be formalized in
the MMM FRS (tracked as OQ-004 in the Harvest Map).

### 19.3 MMM ↔ KUC Boundary

| Interaction | Direction | Interface | Owner |
|------------|-----------|-----------|-------|
| Framework-source upload | MMM → KUC | `POST /api/upload/framework-source` | KUC |
| Evidence upload | MMM → KUC | `POST /api/upload/evidence` | KUC |
| Document classification | KUC → MMM | Classification metadata returned | KUC |

**Key Rule**: Both framework-source and evidence-source uploads go through KUC.
Shared infrastructure; distinct metadata models and lifecycle management.

### 19.4 MMM Internal Ownership

| Data Domain | Canonical Owner | Schema Tables |
|-------------|----------------|---------------|
| Frameworks | MMM | `frameworks` |
| Domains | MMM | `domains` |
| MPSs | MMM | `mps` |
| Criteria | MMM | `criteria` |
| Level descriptors | MMM | `level_descriptors` |
| Evidence (at criterion level) | MMM | `evidence` |
| Maturity scores | MMM | `maturity_scores` |
| Findings & recommendations | MMM | `findings`, `recommendations` |
| Approvals | MMM | `approvals` |
| Publications | MMM | `publications` |
| Dashboard state | MMM | `dashboards` |
| Audit sessions | MMM | `audit_sessions` |
| Reports | MMM | `reports` |
| PIT exports | MMM | `pit_exports` |
| Organisations | MMM | `organisations` |
| Organisation hierarchy | MMM | `organisation_hierarchy` |
| Organisation users | MMM | `organisation_users` |
| User scopes | MMM | `user_scopes` |
| Invitations | MMM | `invitations` |
| Free assessments | MMM | `free_assessments` |

### 19.5 Source-State / Switchover Implications for UX/Workflow

Per Harvest Map §Source-State Vocabulary, all capabilities are currently `ACTIVE_SOURCE`.
MMM is pre-Stage-2 — no destination equivalent exists yet. This means:

- All UX flows described in this document represent the **destination** specification
- Source system UX (MAT, Roadmap, Legacy) remains active until switchover gate is satisfied
  per Harvest Map §Switchover Gate Model
- No user-facing migration UI is specified here — migration execution is not authorized
  for Stage 2

---

## 20. Schema Table Summary

This section provides a consolidated view of all schema tables referenced in the wiring
specifications above. This is a UX-driven schema inventory, not a definitive schema
design — final schema design is a Stage 5 (Architecture) deliverable.

| Table | Primary Journey | Key Fields (UX-visible) |
|-------|----------------|------------------------|
| `content_pages` | J-01 | page_slug, content, type |
| `free_assessments` | J-02 | id, session_id, org_id, baseline_maturity, status |
| `assessment_responses` | J-02 | id, assessment_id, domain_id, response, score |
| `subscription_plans` | J-03 | id, name, price, features |
| `subscriptions` | J-03 | id, user_id, plan_id, status |
| `profiles` | J-03 | id, user_id, name, email |
| `organisations` | J-04 | id, name, context, industry, onboarding_complete |
| `organisation_hierarchy` | J-04 | id, org_id, parent_id, name, type |
| `frameworks` | J-05+ | id, org_id, origin_mode, status, version |
| `documents` | J-06, J-10 | id, document_role, upload_source, metadata |
| `uploads` | J-06 | id, document_id, status, kuc_ref |
| `parsed_domains` | J-06 | id, framework_id, name, source_anchor |
| `parsed_mps` | J-06 | id, domain_id, name, intent_statement |
| `parsed_criteria` | J-06 | id, mps_id, statement, source_anchor |
| `parse_ambiguities` | J-06 | id, framework_id, item_ref, reason |
| `parse_coverage` | J-06 | id, framework_id, mapped_count, unmapped_count |
| `proposed_domains` | J-07 | id, framework_id, name, ai_rationale |
| `proposed_mps` | J-07 | id, domain_id, name, intent_statement |
| `proposed_criteria` | J-07 | id, mps_id, statement, ai_rationale |
| `proposed_level_descriptors` | J-07 | id, criterion_id, level, description |
| `domains` | J-08+ | id, framework_id, name, sequence_number |
| `mps` | J-08+ | id, domain_id, name, intent_statement, sequence_number |
| `criteria` | J-08+ | id, mps_id, statement, sequence_number |
| `level_descriptors` | J-08+ | id, criterion_id, level, description |
| `approvals` | J-08 | id, target_type, target_id, level, status, approved_by |
| `approval_comments` | J-08 | id, approval_id, user_id, comment |
| `publications` | J-09 | id, framework_id, published_at, version |
| `evidence` | J-10, J-11 | id, criterion_id, type, source, metadata, status |
| `score_proposals` | J-10 | id, criterion_id, proposed_level, confidence, ai_model |
| `maturity_scores` | J-10+ | id, criterion_id, level, confirmed_by, source |
| `override_log` | J-10 | id, score_id, previous_level, new_level, reason, user_id |
| `audit_sessions` | J-11 | id, org_id, scope, status, started_at, closed_at |
| `findings` | J-12 | id, criterion_id, evidence_ref, maturity_position, gap, recommendation |
| `recommendations` | J-12 | id, finding_id, recommendation_text, ai_confidence |
| `report_configs` | J-13 | id, framework_id, scope, format |
| `report_drafts` | J-13 | id, report_config_id, content |
| `reports` | J-13 | id, report_config_id, format, file_path, generated_at |
| `pit_exports` | J-14 | id, framework_id, findings_scope, status, sent_at |
| `dashboards` | J-15 | id, org_id, framework_id, activated_at |
| `achievements` | J-15 | id, org_id, type, description, achieved_at |
| `maturity_targets` | J-15 | id, org_id, domain_id, target_level |
| `organisation_users` | J-16 | id, org_id, user_id, role |
| `user_scopes` | J-16 | id, user_id, scope_type, scope_id |
| `invitations` | J-16 | id, org_id, email, role, scope, status |
| `ai_interactions` | J-17 | id, user_id, context, request, response, model |
| `help_content` | J-17 | id, context_id, short_text, long_text |
| `generation_jobs` | J-07 | id, framework_id, status, started_at |
| `parse_jobs` | J-06 | id, framework_id, document_id, status |

---

## 21. Open Questions Carried Forward

The following open questions from the Harvest Map and App Description affect UX/workflow
design and must be resolved in FRS (Stage 3) or later stages. They are carried forward
here for explicit tracking.

### OQ-001 — Offline capability requirements (from MT-05)
**Question**: What is the minimum offline capability requirement for MMM walkabout mode?
Is full offline evidence storage required, or is low-connectivity / cached-submission sufficient?

**UX Impact**: Determines whether J-11 (Audit Workbench / Walkabout) requires full
offline-first architecture with local database sync, or lighter queue-and-sync model.
The wiring in §12 assumes a queue-and-sync model. FRS/TRS must confirm.

**Stage Required By**: TRS

### OQ-002 — Legacy UI component audit (from LG-03)
**Question**: Has a component audit of the legacy UI assets been performed?

**UX Impact**: Determines which existing UI components can be reused in MMM screens
described in this spec. No legacy component may be adopted without individual audit.

**Stage Required By**: Architecture wave

### OQ-003 — Legacy duplication audit (from LG-05)
**Question**: Has a full duplication audit of legacy vs Roadmap/MAT capabilities been completed?

**UX Impact**: Confirms no duplicate capability flows exist across MMM user journeys.

**Stage Required By**: Architecture wave

### OQ-004 — MMM → PIT export/interface contract (from RR-07)
**Question**: Has the MMM → PIT export/interface contract been defined? What is the exact
data shape, trigger conditions, and handover protocol?

**UX Impact**: Directly affects J-14 (PIT Export) wiring. The wiring in §15 uses placeholder
endpoint naming; exact contract must be formalized in FRS.

**Stage Required By**: FRS

### OQ-005 — CL-3.5 data-source registry status (from harvest map)
**Question**: Is the CL-3.5 data-source registry carry-over complete enough to support
framework-source ingestion pathway specification?

**UX Impact**: Affects J-06 (Verbatim Upload) and J-07 (New Criteria Creation) — specifically
the KUC integration path for framework-source documents.

**Stage Required By**: FRS

### OQ-006 — CL-13 dashboard carry-over status (from harvest map)
**Question**: Have legacy dashboard components been reconciled with the MMM dashboard spec?

**UX Impact**: Affects J-15 (Live Dashboard) — specifically which dashboard components
from CL-13 extended scope need to be reflected in the MMM dashboard.

**Stage Required By**: FRS

### OQ-007 — Switchover gate parameterisation (from harvest map)
**Question**: Should the switchover gate be parameterised per migration class?

**UX Impact**: No direct UX impact for Stage 2. Affects switchover execution timing but
not user-facing workflows.

**Stage Required By**: FRS / Architecture

### OQ-008 — MAT label survival (from App Description §41, item 2)
**Question**: Will the label "MAT" survive anywhere as a user-facing work mode name?

**UX Impact**: Affects naming in J-11 (Audit Workbench) — currently named "Audit Workbench /
Walkabout Mode" without MAT branding. If MAT label survives as a mode name, screen labels
and navigation need to reflect this.

**Stage Required By**: FRS

### OQ-009 — Hybrid framework mode timing (from App Description §41, item 5)
**Question**: Is hybrid framework mode (import + AI completion) MVP or later?

**UX Impact**: If MVP, J-05 (Fork Decision) needs a third option and J-06/J-07 need
hybrid sub-paths. Currently excluded from Stage 2 spec per App Description §7.4 treatment
as "future or optional."

**Stage Required By**: FRS

---

## 22. Framework-Source vs Evidence-Source Ingestion — UX Distinction

Per Harvest Map §Framework-Source vs Evidence-Source Ingestion, these two pathways share
KUC infrastructure but are distinct in UX flow, metadata, and lifecycle:

| Dimension | Framework-Source (J-06, J-07) | Evidence-Source (J-10, J-11) |
|-----------|------------------------------|------------------------------|
| **Entry point** | J-06 upload interface or J-07 generation | J-10 evidence workspace or J-11 walkabout |
| **Upload endpoint** | `POST /api/upload/framework-source` | `POST /api/upload/evidence` |
| **document_role** | `criteria_source` | `evidence` |
| **AI processing** | Parse → structure extraction | Evaluate → classify → score proposal |
| **Human review focus** | Structure accuracy, coverage completeness | Score accuracy, relevance |
| **Lifecycle** | Long-lived: framework definitions persist and are versioned | Short-to-medium-lived: per assessment cycle |
| **Downstream** | Feeds maturity hierarchy (domains, MPS, criteria) | Feeds scoring engine and findings model |

This distinction must not be collapsed in FRS/TRS specifications — each pathway must be
specified independently per Harvest Map governance rule.

---

## 23. Maturity Scoring Cascade — Wiring

Maturity scores cascade through the hierarchy whenever evidence is confirmed:

```
[Evidence confirmed at criterion] → maturity_scores UPDATE (criterion level)
                                     ↓
[MPS score recalculated] → maturity_scores UPDATE (MPS level — aggregate of criteria)
                            ↓
[Domain score recalculated] → maturity_scores UPDATE (domain level — aggregate of MPSs)
                               ↓
[Organisation score recalculated] → maturity_scores UPDATE (org level — aggregate of domains)
                                     ↓
[Dashboard refresh] → dashboard websocket/polling update
[Achievement check] → achievements INSERT (if level-up detected)
```

### Scoring Cascade API

| Trigger | API | Schema Impact |
|---------|-----|---------------|
| Evidence confirmed | `POST /api/scores/:id/confirm` | `maturity_scores` UPDATE cascade |
| Evidence overridden | `POST /api/scores/:id/override` | `maturity_scores` UPDATE cascade + `override_log` INSERT |
| Evidence staleness | Scheduled job / trigger | `maturity_scores` re-evaluate; potential downgrade |
| Batch sync (walkabout) | `POST /api/sync/evidence-batch` | Batch `maturity_scores` UPDATE cascade |

### Five-Level Scale
Per App Description §15.1:
1. Basic
2. Reactive
3. Compliant
4. Proactive
5. Resilient

### Evidence Capability Constraint
Per App Description §15.5: Document-only evidence may justify at most Compliant (level 3).
Higher levels require live, integrated, or automated evidence patterns.

---

## 24. Notification & UX Messaging Patterns

Per App Description §39S, MMM uses a consistent notification model:

| Event Category | UX Pattern | Example |
|---------------|------------|---------|
| Success | Toast (green) | "Evidence uploaded successfully" |
| Error | Toast (red) + detail panel | "Upload failed: file too large" |
| Warning | Toast (amber) | "Evidence approaching staleness review date" |
| Long-running operation | Progress indicator + background notification | "Framework parsing in progress..." |
| Background sync | Status indicator | "3 items queued for sync" |
| Evidence upload outcome | Toast + criterion card update | "Evidence linked to criterion 1.1.1" |
| Approval outcome | Toast + navigation | "Domain 1 approved by John Smith" |
| Export/report outcome | Toast + download link | "Report generated — click to download" |

---

## 25. State Persistence Model — UX-Visible State

Per App Description §39T, the following state is persisted across sessions:

| State Domain | Persistence Location | Access Pattern |
|-------------|---------------------|----------------|
| Organisation selection | `profiles.current_org_id` | Server-side; set on login/switch |
| Framework selection | `profiles.current_framework_id` | Server-side |
| Current navigation position | Client-side (URL + local storage) | Restored on page load |
| Dashboard filters | `user_preferences` | Server-side per user |
| Evidence workspace drafts | Client-side (local storage) | Restored on return |
| Offline queue state | Client-side (IndexedDB) | Persistent until sync |
| AI conversation context | `ai_interactions` | Server-side per session |
| UI preferences | `user_preferences` | Server-side per user |
| Role and scope context | `organisation_users`, `user_scopes` | Server-side; cached client-side |

---

## 26. Acceptance Criteria Verification

| # | Criterion (from Issue #1352) | Status | Section |
|---|------------------------------|--------|---------|
| AC-01 | `ux-workflow-wiring-spec.md` created in Stage 2 folder | ✅ | This document |
| AC-02 | All primary and secondary user journeys documented | ✅ | §1–§18 (17 journeys) |
| AC-03 | Screen interactions and user transitions documented | ✅ | Each journey section |
| AC-04 | UI → API → schema → reporting wiring made explicit | ✅ | Wiring tables in each section |
| AC-05 | MMM ↔ AIMC boundary explicit | ✅ | §19.1 |
| AC-06 | MMM ↔ PIT boundary explicit | ✅ | §19.2 |
| AC-07 | Framework-source vs evidence-source ingestion distinction reflected | ✅ | §22 |
| AC-08 | Source-system inheritance / switchover implications reflected | ✅ | §19.5 |
| AC-09 | Open questions carried forward clearly for FRS/TRS | ✅ | §21 (9 open questions) |
| AC-10 | Build Progress Tracker updated for Stage 2 | Pending | Separate deliverable (D4) |
| AC-11 | PREHANDOVER + session memory + IAA token completed | Pending | Phase 4 ceremony |

---

## 27. Mandatory Questions — Foreman Answers

Per Issue #1352, Foreman must answer these questions:

### Q1: What are the complete primary and secondary user journeys for MMM?

**Answer**: 17 user journeys identified (§1), covering:
- **Primary**: J-01 through J-15 (landing → dashboard)
- **Secondary**: J-16 (roles/invitations — ongoing management), J-17 (AI interactions — cross-cutting)
- **Sub-paths**: Abandon/resume assessment, skip-to-subscribe, partial acceptance, re-upload,
  offline queue, batch sync, report editing, multiple export configurations

### Q2: Where exactly does the user-facing fork occur between verbatim upload and new criteria creation?

**Answer**: The fork occurs at Journey J-05 (§6), immediately after organisation onboarding
completes. The user is presented with two clear options on a fork decision screen:
- Mode A → J-06 (Verbatim Upload)
- Mode B → J-07 (New Criteria Creation)

The fork is recorded in `frameworks.origin_mode` at the point of framework initialization.

### Q3: How is framework-source ingestion wired differently from evidence-source ingestion?

**Answer**: See §22 for the full comparison. Key differences:
- Different upload endpoints (`/api/upload/framework-source` vs `/api/upload/evidence`)
- Different document_role classification (`criteria_source` vs `evidence`)
- Different AI processing (parse/extract vs evaluate/classify)
- Different lifecycle (long-lived framework vs per-assessment-cycle evidence)
- Different downstream usage (hierarchy population vs scoring/findings)

Both share KUC infrastructure but must not be collapsed.

### Q4: What is the exact UX and workflow boundary between MMM findings and PIT plan execution?

**Answer**: See §19.2. MMM generates findings and the export package. The user triggers
"Export to PIT" in J-14 (§15). PIT receives the structured package and owns all downstream
plan lifecycle. No PIT-owned planning logic exists inside MMM. The interface contract
(data shape, trigger conditions, handover protocol) is tracked as OQ-004 for FRS definition.

### Q5: How does the audit workbench / walkabout mode sit inside MMM without preserving MAT as a standalone identity?

**Answer**: The audit workbench (J-11, §12) is positioned as an **operating mode** of MMM,
not a standalone product. It has no separate branding, no separate entry point, and no
separate navigation hierarchy. Users access it from within the published framework context
as a "Start Audit Session" action. The mode inherits MMM's framework, evidence model,
and scoring cascade. MAT's standalone identity is dissolved; only its portable audit DNA
survives as one way to interact with MMM's evidence and scoring system.

### Q6: What is the dashboard/publication workflow in MMM, especially in light of Roadmap backbone inheritance and CL-13 dashboard carry-over?

**Answer**: The dashboard workflow (J-15, §16) retains the Roadmap "Operational Maturity House"
concept as the primary visualization. Publication (J-09, §10) activates the dashboard.
CL-13 carry-over obligations are tracked as OQ-006 — legacy dashboard components must be
reconciled with this specification before FRS finalizes the dashboard design. The wiring
in §16 reflects the target MMM dashboard; CL-13 legacy components that need reconciliation
are deferred to FRS.

### Q7: Which open questions remain for FRS/TRS rather than Stage 2?

**Answer**: See §21 — 9 open questions carried forward:
- OQ-001 (offline capability) → TRS
- OQ-002 (legacy UI audit) → Architecture
- OQ-003 (duplication audit) → Architecture
- OQ-004 (PIT interface contract) → FRS
- OQ-005 (CL-3.5 status) → FRS
- OQ-006 (CL-13 status) → FRS
- OQ-007 (switchover gate) → FRS/Architecture
- OQ-008 (MAT label survival) → FRS
- OQ-009 (hybrid mode timing) → FRS

---

## Version History

| Version | Date | Change |
|---------|------|--------|
| 0.1.0 | 2026-04-13 | Initial Stage 2 UX Workflow & Wiring Spec — 17 user journeys, complete wiring, boundary definitions, open questions carried forward |

---

**Authority**: CS2 (Johan Ras / @APGI-cmy)
**Governed by**: `PRE_BUILD_STAGE_MODEL_CANON.md` v1.0.0, Stage 2 definition
**Wave**: MMM Stage 2 — maturion-isms#1352
