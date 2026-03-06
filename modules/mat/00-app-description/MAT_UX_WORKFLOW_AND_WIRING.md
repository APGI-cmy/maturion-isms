# MAT — UX Workflow & Wiring Specification

**Status:** Authoritative Draft  
**Version:** v1.0  
**Owner:** Johan Ras (CS2 / Product Owner)  
**Date:** 2026-03-04  
**Authority:** CS2 direct  
**Supersedes:** N/A (new artifact)  
**Derived from:** CS2 verbal specification (2026-03-04) + gap analysis against existing app-description.md, MAT_Manual_Audit_Tool_Updated.md, MAT_APP_DESCRIPTION_v2.0.md

---

## 0. Purpose of This Document

This document serves two purposes:

1. **UX Workflow Specification** — a complete, step-by-step description of the MAT user experience from first signup through to final exported report, written in the language of screens, buttons, modals, cards, and interactions.
2. **Wiring Specification** — for each UX step, this document identifies what backend services, database tables, AI capabilities, RLS policies, and integration hooks must be in place for that step to function. This is the document the QA suite is written against.

This document is the **upstream authority** for:
- Any new FRS sections covering the workflow and wiring described here
- The RED QA suite the Foreman will commission to expose gaps between this spec and what is currently built
- IAA FFA-01/FFA-02/FFA-04 wiring checks on all MAT build PRs

---

## 1. Gap Analysis: What the Existing Descriptions Cover and What They Do Not

### 1.1 What Existing App Descriptions Cover (✅ Addressed)

| Area | Covered In |
|------|-----------|
| Three-level hierarchy (Domain → MPS → Criteria) | app-description.md §2, MAT_Manual_Audit_Tool_Updated.md §2–3 |
| Audit creation form with basic metadata fields | MAT_Manual_Audit_Tool_Updated.md §2 Step 1 |
| Document upload and AI restructuring into hierarchy | MAT_Manual_Audit_Tool_Updated.md §2 Step 2 |
| Multi-format evidence collection (text, voice, photo, video, file) | MAT_Manual_Audit_Tool_Updated.md §4, app-description.md §9 |
| AI maturity scoring (5 levels) with confidence + rationale | MAT_Manual_Audit_Tool_Updated.md §7, app-description.md §10 |
| Human confirmation and override with logging | MAT_Manual_Audit_Tool_Updated.md §7 |
| Pre-report structured review table | MAT_Manual_Audit_Tool_Updated.md §9 |
| Report generation (PDF/DOCX/JSON/Excel) | MAT_Manual_Audit_Tool_Updated.md §10 |
| Dashboard requirements (completion %, drill-down) | MAT_Manual_Audit_Tool_Updated.md §11 |
| AI model routing (document parser, scoring, report writer) | MAT_Manual_Audit_Tool_Updated.md §8 |
| Embedded AI assistant panel (LL-031) | MAT_Manual_Audit_Tool_Updated.md §13 |
| Role definitions (Lead Auditor, Domain Auditor, MPS Auditor, Evidence Collector) | app-description.md, BUILD_PROGRESS_TRACKER.md Wave 0 |
| Offline evidence capture | BUILD_PROGRESS_TRACKER.md Wave 2.2 |

### 1.2 What Is NOT Covered (🔴 Gaps — Addressed in this document)

| Gap # | Missing Area | Impact |
|-------|-------------|--------|
| GAP-W01 | Sign-up → onboarding → first-use flow with org creation | App is dead on first use without it |
| GAP-W02 | **Invite Auditor** UX: per-domain and per-MPS invite modal, email flow, accept → signup → scoped access | No delegation model described at UI level |
| GAP-W03 | **Toggle exclude** behaviour: greying out a Domain/MPS/Criteria and what happens to responsibility and scoring when toggled | Scoring model breaks without this |
| GAP-W04 | **Invite Evidence Submitter** as a distinct lower-access role (criteria-scoped, not domain-scoped) | Evidence submission delegation unspecified |
| GAP-W05 | **Evidence card** interaction model: click-and-hold for voice/video, multi-type uploader state machine, edit/remove/add after initial upload | Evidence UI spec is vague |
| GAP-W06 | **Submit button** as the AI trigger: exactly what the AI does on submit, what inputs it consumes, what outputs it produces | AI invocation is described but not triggered from a specific UX action |
| GAP-W07 | **AI next-level explanation + taster**: the visible feature showing rating, improvement path, and preview of level+2 | Scoring describes AI output but not this specific UX surface |
| GAP-W08 | **AI chat UI** entry point from the criteria card for deeper level exploration | Mentioned implicitly in LL-031 but not wired to criteria card |
| GAP-W09 | **Audit results table**: Domain / MPS / Criteria / Findings / Rating / Recommendations displayed post-submission in a table | Post-submission display surface not specified |
| GAP-W10 | **Dashboard outstanding work drill-down**: what "addressed" means, the gating condition before "Create Report" becomes active | Dashboard described at high level only |
| GAP-W11 | **"Create Report" button** as the final AI trigger: exact sequence, content of generated report, export format and structure | Report generation is listed but not triggered from a specific button with a defined condition |
| GAP-W12 | **Level descriptor cards**: Domain, MPS, and Criteria cards each show a level descriptor; Domain/MPS aggregate underlying achievements | Card-level descriptors not described |
| GAP-W13 | **Scoring and rating method** in DB — rating/scoring tables exist per existing description but their structure is not explicitly wired to the UI | Scoring tables referenced but not linked to display logic |
| GAP-W14 | **Responsibility cascade rule** wired: if no one is invited at domain level, Lead Auditor retains responsibility; must be enforced in DB and UI | Mentioned in architecture but not at UX level |

---

## 2. Full UX Workflow

### STEP 0 — Sign Up & Onboarding

**Actor:** New user (becomes Lead Auditor / Org Owner)

**Screen: Sign Up**
- Fields: Email, Password
- Action: `POST /auth/signup` → Supabase Auth `signUp()`
- On success: navigate to `/onboarding`

**Screen: Onboarding Wizard (2 steps)**

Step 1 — Your Name
- Field: Full name (required)
- Button: "Next"
- Validation: JS-side trim check (not just HTML `required`)

Step 2 — Create Your Organisation
- Field: Organisation name (required)
- Button: "Create & Continue"
- On submit:
  1. `INSERT INTO public.organisations (name)` → returns `id`
  2. `UPSERT INTO public.profiles (id, organisation_id, full_name, display_name, email)`
  3. Navigate to `/`

**Wiring required:**
- `auth.users` (Supabase Auth)
- `public.profiles` table with `organisation_id`, `full_name`, `display_name`, `role`
- `public.organisations` table
- RLS: `organisations` INSERT policy (any authenticated user), SELECT policy (user's own org via profiles)
- `OnboardingGuard` in `App.tsx` blocking all app routes until `profile.organisation_id` is non-null
- `useCreateOrganisation` hook in `useSettings.ts`

**Already built:** PR #902 (merged), PR #904 (follow-up fixes — open)

---

### STEP 1 — Create New Audit

**Actor:** Lead Auditor (Org Owner)

**Screen: Audit List**
- Button: "Create New Audit"
- Opens an audit creation form or modal

**Audit Creation Form Fields:**
- Audit Title (required)
- Description (optional)

> **GAP-W01a:** The current `AuditCreationForm` (post-PR #903) only collects `title` and `description`. Per `MAT_Manual_Audit_Tool_Updated.md §2 Step 1`, the form should also collect: Organisation Name, Facility/Location, Audit Lead, Audit Period (start + end). These fields were present before PR #903 stripped phantom columns. They must be restored to the form **and** added as real columns in the `audits` DB table before the form can be rebuilt.

**On submit:**
- `INSERT INTO public.audits (title, description, organisation_id, status, created_by)`
- Status default: `'draft'`
- `created_by` = `auth.uid()`

**Wiring required:**
- `public.audits` table with columns: `id`, `title`, `description`, `organisation_id`, `status`, `created_by`, `created_at`, `updated_at`
- RLS: audits INSERT/SELECT/UPDATE isolated to `organisation_id`
- `useCreateAudit` hook wired to the correct columns
- Audit list view showing existing audits for the org

---

### STEP 2 — Upload Audit Criteria Document

**Actor:** Lead Auditor

**Screen: Audit Detail → Criteria tab**
- Button: "Upload Criteria Document"
- Accepted formats: `.docx`, `.doc`, `.pdf`, `.xlsx`, `.xls`, `.pptx`, `.ppt`, plain text

**What happens on upload:**
1. File stored in Supabase Storage bucket `criteria-documents` under `{organisation_id}/{audit_id}/`
2. `INSERT INTO public.criteria_documents (audit_id, file_path, status='pending_parse')`
3. AI parsing pipeline triggered (async):
   - Extract text from document (model: structured reasoning / GPT-4 Turbo)
   - Restructure into Domain → MPS → Criteria hierarchy
   - Apply sequential numbering: `1`, `1.1`, `1.1.1`
   - AI must NOT invent criteria — only restructure what is in the document
4. Result written to: `public.domains`, `public.mps`, `public.criteria` (linked to `audit_id`)
5. Status updated to `pending_review`

#### Step 2a — Concrete Parse Cycle Wiring (Wave 15)

The complete, concretised wiring for the upload-to-parse cycle is:

```
UI (CriteriaUpload.tsx)
  → useTriggerAIParsing hook (fires on upload success)
    → Supabase Edge Function: invoke-ai-parse-criteria
        (supabase/functions/invoke-ai-parse-criteria/index.ts)
      → AI Gateway /parse endpoint
          (apps/mat-ai-gateway/services/parsing.py → DocumentParser.parse())
        → DB write-back:
            INSERT INTO public.domains
            INSERT INTO public.mini_performance_standards
            INSERT INTO public.criteria
  → Frontend polling: useCriteria.ts (polls criteria_documents.status)
    → Criteria Hierarchy panel renders (Domain → MPS → Criteria tree)
```

**Polling behaviour:** `useCriteria.ts` polls `criteria_documents.status` until status reaches `pending_review` (success) or `parse_failed` (error). On `parse_failed`, the UI surfaces a clear error message — silent failures are prohibited (see FR-103).

**DB write-back is transactional:** All domain/MPS/criteria inserts for a single parse job are wrapped in a DB transaction. A partial failure rolls back all inserts for that job.

**Screen: Criteria Review**
- User sees proposed structure tree (Domain → MPS → Criteria)
- User can edit names/numbers before approval
- Button: "Approve Structure"
- On approval: records become locked (append-only thereafter)

**Wiring required:**
- `public.criteria_documents` table: `id`, `audit_id`, `file_path`, `status`, `created_at`
- `public.domains` table: `id`, `audit_id`, `name`, `number`, `organisation_id`, `status`, `excluded` (boolean), `created_at`
- `public.mps` table: `id`, `domain_id`, `audit_id`, `name`, `number`, `organisation_id`, `status`, `excluded` (boolean), `created_at`
- `public.criteria` table: `id`, `mps_id`, `domain_id`, `audit_id`, `name`, `number`, `organisation_id`, `status`, `excluded` (boolean), `created_at`
- Supabase Storage bucket: `criteria-documents`
- AI endpoint: `POST /ai/parse-criteria-document` (inputs: file path, audit_id; output: structured JSON of domains/mps/criteria)
- AI model routing: document parsing → GPT-4 Turbo / structured reasoning model
- RLS on domains/mps/criteria: org-isolated (SELECT, INSERT, UPDATE, DELETE)

---

### STEP 3 — Domain, MPS & Criteria Card Interaction Model

After criteria are approved, the audit execution screen displays cards at three levels.

#### 3.1 Domain Card

Each domain appears as a card containing:

**Card elements:**
- Domain number and name
- Aggregate maturity level indicator (computed from underlying MPS/Criteria — see §6)
- Level descriptor for this domain (from `domain_level_descriptors` or computed label)
- **Toggle (exclude):** Greying out the entire domain. When toggled OFF:
  - Domain card visually greyed
  - All underlying MPS and Criteria inherit excluded state
  - Domain is excluded from audit scoring and from the final report
  - Responsibility for the domain is released (no one is responsible for excluded domains)
  - DB: `domains.excluded = true`
- **Edit button:** Opens inline editor for domain name/description
- **Invite Auditor button:** Opens Invite Auditor modal (see §4.1)

**Responsibility rule (GAP-W14):**
- If no auditor is invited for a domain, the Lead Auditor (Org Owner) retains responsibility
- This must be visually indicated: "Responsible: You" or the assigned auditor's name
- DB: `domain_assignments` table — if no row exists for this domain, responsibility defaults to `created_by` of the audit

#### 3.2 MPS Card (within a Domain)

Same card elements as Domain, scoped to MPS level:
- MPS number and name
- Aggregate maturity level (from underlying Criteria)
- Level descriptor for this MPS
- **Toggle (exclude):** Greys out the MPS and all its Criteria; excluded from scoring
- **Edit button**
- **Invite Auditor button:** Opens Invite Auditor modal scoped to MPS (see §4.1)
- Responsibility defaults to Domain Auditor if none assigned, then Lead Auditor

#### 3.3 Criteria Card (within an MPS)

Each Criteria card contains:
- Criteria number and name
- Current maturity rating (displayed after AI evaluation, or blank before evidence submission)
- **Level descriptor** for this criteria at its current rating level (e.g. "Compliant: The organisation has documented procedures...")
- **Toggle (exclude):** Greys out the criteria; excluded from scoring
- **Edit button**
- **Invite Evidence Submitter button:** Opens Invite Evidence Submitter modal (see §4.2)
- **Upload Evidence button:** Opens the Evidence Upload panel (see §5)
- **Submit button:** Active once evidence is uploaded. Triggers AI evaluation (see §6)

---

### STEP 4 — Invitation System

#### 4.1 Invite Auditor (Domain-level or MPS-level)

**Trigger:** User clicks "Invite Auditor" on a Domain or MPS card

**Modal: Invite Auditor**
- Field: Auditor Full Name (required)
- Field: Email Address (required)
- Scope shown: "This person will be responsible for [Domain/MPS name] and all items beneath it"
- Button: "Send Invite"

**What happens on submit:**
1. `INSERT INTO public.audit_invitations (audit_id, scope_type='domain'|'mps', scope_id, invitee_email, invitee_name, status='pending', invited_by, created_at)`
2. Email sent to invitee via email service (Supabase Edge Function `send-invitation`):
   - Contains: personal greeting, audit name, scope description, signup link with invite token
   - Signup link: `https://app.maturion.ai/accept-invite?token={invitation_token}`
3. `audit_invitations.invitation_token` = UUID generated at insert

**Invitee flow:**
1. Invitee clicks link → lands on `/accept-invite?token=...`
2. If not yet registered: shown sign-up form (name pre-filled from invitation)
3. Creates account → onboarding skips org creation step (they join under the inviting org)
4. Profile created with `organisation_id` = inviting org, `role` = `'domain_auditor'` or `'mps_auditor'`
5. `audit_invitations.status` updated to `'accepted'`
6. `domain_assignments` or `mps_assignments` row created linking the user to the scope
7. User lands on their scoped audit view — they can only see and interact with their assigned domain/MPS and all criteria beneath it

**Access rights for Domain Auditor:**
- Can see: their assigned domain, all MPS under it, all criteria under those MPS
- Can do: upload evidence, invite Evidence Submitters for criteria under their domain, submit evidence
- Cannot see: other domains, other audits, organisation settings

**Access rights for MPS Auditor:**
- Can see: their assigned MPS, all criteria under it
- Can do: upload evidence, invite Evidence Submitters for criteria under their MPS, submit
- Cannot see: other MPS, other domains

**Wiring required:**
- `public.audit_invitations` table: `id`, `audit_id`, `scope_type` (enum: `domain`/`mps`/`criteria`), `scope_id`, `invitee_email`, `invitee_name`, `invitation_token` (UUID, unique), `status` (enum: `pending`/`accepted`/`declined`), `invited_by`, `created_at`, `accepted_at`
- `public.domain_assignments` table: `id`, `domain_id`, `audit_id`, `user_id`, `assigned_at`
- `public.mps_assignments` table: `id`, `mps_id`, `audit_id`, `user_id`, `assigned_at`
- Supabase Edge Function: `send-invitation` (takes invitation_id, sends email via Resend/SendGrid)
- Accept-invite route: `/accept-invite` in React app, reads token, creates/links user
- RLS: invitees can only SELECT/INSERT/UPDATE rows where their `user_id` appears in `domain_assignments` or `mps_assignments` scoped to the audit
- Onboarding flow: must support `?invite_token=...` parameter to skip org creation and join existing org

#### 4.2 Invite Evidence Submitter (Criteria-level)

Same flow as §4.1 but scope is a single Criteria.

**Access rights for Evidence Submitter:**
- Can see and interact with: only the specific criteria they were invited for
- Can do: upload evidence, type findings, submit
- Cannot see: other criteria, other MPS, other domains

**Wiring required:**
- `public.criteria_assignments` table: `id`, `criteria_id`, `audit_id`, `user_id`, `assigned_at`
- RLS criteria for Evidence Submitter: SELECT/INSERT/UPDATE only rows where `criteria_assignments.user_id = auth.uid()`
- Same invitation token flow as §4.1 with `scope_type = 'criteria'`

---

### STEP 5 — Evidence Upload Panel

**Trigger:** User clicks "Upload Evidence" on a Criteria card

**Panel opens (not a full-page nav — a drawer or expanded card section)**

#### 5.1 Evidence Types Supported

| Type | Interaction | Notes |
|------|------------|-------|
| Text Findings | Text area (always visible) | Free-form audit findings |
| File Upload | Click to open file picker | Any file type |
| Voice Note | Click to start, click again to stop | Records until stopped; produces audio file |
| Photo | Click to open camera/file picker | Image capture or upload |
| Video | Click-and-hold to record, release to stop OR click to open file picker | Video capture or upload |
| Interview Transcript | Text area with tag-to-criteria support | Can be linked to a voice note |

**Click-and-hold behaviour for voice/video:**
- Button shows "Hold to record"
- On mousedown/touchstart: recording begins (MediaRecorder API)
- On mouseup/touchend: recording stops, file staged for upload
- Alternative: toggle mode — click once to start, click again to stop

#### 5.2 Evidence Management After Upload

Each uploaded item appears as a tile in the evidence panel with:
- Preview (image thumbnail, audio player, video player, file icon)
- Remove button (soft delete — sets `evidence.deleted = true`)
- Replace button (re-opens picker for that evidence slot)
- Add More button (appends additional evidence items)

**Findings text area is always present** and saves on change (auto-save with debounce or explicit Save button).

#### 5.3 Submit

- Button: "Submit for Evaluation" (disabled until at least one evidence item is present OR findings text is non-empty)
- On click: confirmation dialog "Submit evidence for AI evaluation? This will generate a maturity assessment."
- On confirm: triggers AI evaluation workflow (see §6)

**Wiring required:**
- `public.evidence` table: `id`, `criteria_id`, `audit_id`, `organisation_id`, `submitted_by`, `type` (enum: `file`/`voice`/`photo`/`video`/`transcript`/`text`), `storage_path`, `findings_text`, `deleted` (boolean), `submitted_at`, `updated_at`
- Supabase Storage bucket: `evidence-files` (org-isolated paths: `{organisation_id}/{audit_id}/{criteria_id}/`)
- RLS on `evidence`: INSERT/UPDATE/DELETE scoped to assigned user (via `criteria_assignments`, `mps_assignments`, or `domain_assignments` cascade)
- MediaRecorder API in frontend for voice/video capture
- File upload: `supabase.storage.from('evidence-files').upload()`
- Auto-save for findings text: debounced `UPDATE evidence SET findings_text = ...`

---

### STEP 6 — AI Evaluation (Triggered by Submit)

**Trigger:** User clicks "Submit for Evaluation" on a Criteria

**What the AI does:**

1. **Ingest all evidence for the criteria:**
   - Fetch all non-deleted `evidence` rows for this `criteria_id`
   - Fetch text from uploaded documents (file extraction)
   - Fetch audio transcripts (voice notes → transcription model)
   - Fetch video frames/transcript (video → multimodal model)
   - Fetch image descriptions (photos → vision model)
   - Combine with `findings_text`

2. **Evaluate against maturity criteria:**
   - AI reads the criteria description and its 5-level maturity descriptors (from `criteria_maturity_descriptors` table or AI knowledge)
   - AI proposes a maturity level: Basic / Reactive / Compliant / Proactive / Resilient
   - AI produces a confidence score (0–100)
   - AI produces a rationale (citing specific evidence)
   - AI produces a findings summary (synthesised from all evidence)
   - AI produces improvement guidance:
     - **What is needed to reach the next level** (detailed, actionable)
     - **A taster of what the level after next looks like** (brief preview)

3. **Store AI outputs:**
   - `INSERT INTO public.criteria_evaluations (criteria_id, audit_id, organisation_id, proposed_level, confidence_score, rationale, findings_summary, next_level_guidance, next_plus_one_taster, ai_model_used, evaluated_at)`

4. **Update criteria card:**
   - Card now shows the maturity level rating badge (e.g. "Compliant")
   - Findings summary visible
   - Improvement guidance visible
   - Rating is shown as: Basic / Reactive / Compliant / Proactive / Resilient (colour-coded)
   - "Explore further levels" link → opens AI Chat UI (see §6.1)

5. **Human confirmation:**
   - Button: "Confirm Rating" — locks the AI-proposed level as the human-confirmed level
   - Button: "Override" — opens override form with:
     - Select: correct maturity level
     - Text: justification (required)
     - On submit: `INSERT INTO public.evaluation_overrides (evaluation_id, original_level, overridden_level, justification, overridden_by, overridden_at)`

**Wiring required:**
- `public.criteria_evaluations` table: `id`, `criteria_id`, `audit_id`, `organisation_id`, `proposed_level` (enum), `confirmed_level` (enum, nullable until confirmed), `confidence_score`, `rationale`, `findings_summary`, `next_level_guidance`, `next_plus_one_taster`, `ai_model_used`, `status` (enum: `pending_review`/`confirmed`/`overridden`), `evaluated_at`
- `public.evaluation_overrides` table: `id`, `evaluation_id`, `original_level`, `overridden_level`, `justification`, `overridden_by`, `overridden_at`
- AI endpoint: `POST /ai/evaluate-criteria` (inputs: criteria_id, audit_id; fetches all evidence from storage + DB; returns structured JSON)
- AI model routing:
  - Text/document → GPT-4 Turbo
  - Audio → Whisper transcription → GPT-4 Turbo
  - Video → frame extraction + Whisper → GPT-4 Vision
  - Images → GPT-4 Vision
  - Evaluation synthesis → GPT-4 Turbo
- `criteria_maturity_descriptors` table or embedded in AI prompt: 5-level descriptors per criteria
- RLS on `criteria_evaluations`: SELECT scoped to org, INSERT/UPDATE by evaluating user or system

#### 6.1 AI Chat UI (Deep Level Exploration)

**Trigger:** User clicks "Explore further levels" link on criteria card

**Behaviour:**
- Opens the embedded AI assistant panel (LL-031 — already described in MAT_Manual_Audit_Tool_Updated.md §13)
- Pre-loads context: criteria name, current rating, next-level guidance already shown
- User can ask: "What does Proactive look like?", "What would I need to get to Resilient?"
- AI responds with criteria-specific, organisation-aware guidance
- Chat history is NOT persisted (session-only) unless explicitly saved

**Wiring required:**
- Embedded AI chat panel already specified in LL-031 / FR-072 / TR-072
- Context injection: on open, inject `{ criteria_name, current_level, next_level_guidance, audit_context }` into the AI session
- AI model: GPT-4 Turbo (general audit guidance)

---

### STEP 7 — Audit Results Table

**Screen:** Audit Detail → Results tab (or auto-displayed after all criteria submitted)

**Displays a table with one row per criteria:**

| Domain | MPS | Criteria | Findings Summary | Rating | Recommendations |
|--------|-----|----------|-----------------|--------|-----------------|
| 1. Governance | 1.1 Policy | 1.1.1 Policy documented | AI-generated summary | Compliant | [Next level actions] |

**Table features:**
- Sortable by Domain, MPS, Rating
- Expandable row: shows full rationale, all evidence links, improvement detail, next-plus-one taster
- Excluded criteria are greyed out and labelled "Excluded"
- Outstanding criteria (not yet submitted) shown with status badge "Pending"

**Wiring required:**
- Query joining: `audits` → `domains` → `mps` → `criteria` → `criteria_evaluations`
- All joins must respect `excluded = false` filter (excluded items still visible but greyed)
- `findings_summary`, `confirmed_level` (or `proposed_level` if not yet confirmed), `next_level_guidance` from `criteria_evaluations`
- RLS: Lead Auditor sees all rows; Domain/MPS Auditors see only their scope

---

### STEP 8 — Dashboard (Progress & Outstanding Work)

**Available to:** All users (scoped to their access level)

**Lead Auditor Dashboard (full view):**

| Metric | Display |
|--------|---------|
| Total Domains | Count |
| Total MPS | Count |
| Total Criteria | Count |
| Criteria Submitted | Count + % |
| Criteria Outstanding | Count + % |
| Criteria Excluded | Count + % |
| Overall Maturity Rating | Aggregate score (from scoring table) |
| Maturity Distribution | Bar chart: count per level (Basic → Resilient) |

**Drill-down:**
- Click Domain → see MPS-level breakdown for that domain
- Click MPS → see Criteria-level breakdown for that MPS
- Click Criteria (outstanding) → navigate directly to that criteria card for evidence upload

**"Create Report" button gating condition:**
- Button is **disabled** (greyed, tooltip: "All criteria must be submitted or excluded") unless:
  - Every non-excluded criteria has `criteria_evaluations.status IN ('confirmed', 'overridden')`
  - i.e. `COUNT(criteria WHERE excluded=false AND evaluation.status NOT IN ('confirmed','overridden')) = 0`
- When condition is met: button becomes active, green, labelled "Create Report"

**Wiring required:**
- Aggregate query: `SELECT COUNT(*), SUM(CASE WHEN status='confirmed' OR status='overridden' THEN 1 ELSE 0 END), ...` from criteria join evaluations
- Scoring method: `public.scoring_rules` or `public.maturity_scoring` table defines how individual criteria ratings aggregate to MPS → Domain → Audit level (e.g. weighted average, minimum threshold, etc.)
- Overall maturity rating computed from scoring rules table — not hardcoded
- Real-time updates via Supabase Realtime subscriptions on `criteria_evaluations`

---

### STEP 9 — Level Descriptor Cards

**At every card level (Domain, MPS, Criteria), a level descriptor is visible.**

#### 9.1 Criteria-level descriptor

- Shows the descriptor text for the **current confirmed maturity level** of this criteria
- E.g. "Compliant: The organisation has a formally documented and approved information security policy that meets all regulatory requirements."
- Source: `criteria_level_descriptors` table or embedded in AI evaluation output

#### 9.2 MPS-level descriptor

- Aggregated from underlying criteria ratings
- Aggregate method: majority level OR weighted average OR lowest level (configurable per scoring rules)
- Shows the MPS descriptor text for the aggregate level achieved
- Source: `mps_level_descriptors` table

#### 9.3 Domain-level descriptor

- Aggregated from underlying MPS ratings using same method
- Shows the Domain descriptor text for the aggregate level achieved
- Source: `domain_level_descriptors` table

**Wiring required:**
- `public.criteria_level_descriptors` table: `id`, `criteria_id`, `level` (enum), `descriptor_text`
- `public.mps_level_descriptors` table: `id`, `mps_id`, `level` (enum), `descriptor_text`
- `public.domain_level_descriptors` table: `id`, `domain_id`, `level` (enum), `descriptor_text`
- Alternatively: descriptors stored as JSONB column on criteria/mps/domain rows
- Aggregation logic: stored in `public.scoring_rules` — defines aggregation method per org or globally
- These descriptors should be pre-populated by the AI during the criteria parsing step (Step 2), not manually entered

---

### STEP 10 — Create Report (Final AI Trigger)

**Trigger:** Lead Auditor clicks "Create Report" (active only when dashboard gating condition is met — see §8)

**What the AI does:**

1. **Retrieve all audit data:**
   - All non-excluded domains, MPS, criteria
   - All confirmed/overridden evaluations
   - All findings summaries, rationale, recommendations
   - All level descriptors at each level
   - All evidence references (file names, storage paths)

2. **Generate report content:**
   - Executive Summary (AI-authored, 1–2 paragraphs)
   - For each Domain:
     - Domain heading with aggregate level and descriptor
     - For each MPS under the domain:
       - MPS heading with aggregate level and descriptor
       - For each Criteria under the MPS:
         - Criteria name and number
         - Findings summary
         - Maturity rating (level label + descriptor)
         - Evidence references (hyperlinked where possible)
         - Recommendations: "To reach [next level]..." (detailed)
         - Recommendations: "Longer term, [level+2] requires..." (taster)

3. **Format and export:**
   - Rendered in-app as a preview (HTML)
   - Export button: "Download PDF"
   - Export button: "Download DOCX" (future)
   - PDF generated via: server-side Puppeteer/wkhtmltopdf OR client-side jsPDF

4. **Report stored:**
   - `INSERT INTO public.audit_reports (audit_id, organisation_id, generated_at, generated_by, storage_path, status='final')`
   - File stored in Supabase Storage bucket `reports` under `{organisation_id}/{audit_id}/`

**Wiring required:**
- AI endpoint: `POST /ai/generate-report` (inputs: audit_id; fetches all evaluation data; returns structured report JSON or HTML)
- AI model: GPT-4 Turbo (report writing agent)
- PDF generation service: Supabase Edge Function `generate-pdf` OR client-side (decision to be made in FRS)
- `public.audit_reports` table: `id`, `audit_id`, `organisation_id`, `generated_at`, `generated_by`, `storage_path`, `status`
- Supabase Storage bucket: `reports`
- RLS: only Lead Auditor (or above) may trigger report generation and download
- `scoring_rules` / `maturity_scoring` tables must be readable at report generation time to compute final aggregate scores

---

## 3. Responsibility Cascade Rule (GAP-W14 — Wiring)

| Level | Assigned Auditor | No Auditor Assigned |
|-------|-----------------|---------------------|
| Domain | Domain Auditor (from `domain_assignments`) | Lead Auditor (audit.created_by) |
| MPS | MPS Auditor (from `mps_assignments`) | Domain Auditor if assigned, else Lead Auditor |
| Criteria | Evidence Submitter (from `criteria_assignments`) | MPS Auditor if assigned, else Domain Auditor, else Lead Auditor |

**UI must display the responsible person name** on each card.

**Wiring required:**
- View or computed column `responsible_user_id` on domains/mps/criteria — resolved by cascading through assignments tables
- Frontend: `useResponsibleUser(level, scope_id)` hook that queries the cascade

---

## 4. Scoring and Rating Method (GAP-W13 — Wiring)

The scoring method is stored in the DB and must not be hardcoded in the frontend.

**Tables required:**
- `public.maturity_levels` table: `id`, `name` (Basic/Reactive/Compliant/Proactive/Resilient), `numeric_value` (1–5), `colour_hex`
- `public.scoring_rules` table: `id`, `organisation_id` (nullable = global), `aggregation_method` (enum: `weighted_average`/`minimum`/`majority`), `weight_criteria`, `weight_mps`, `weight_domain`
- Default global rule: `weighted_average` with equal weights

**Aggregate score display:**
- Criteria: raw level from `criteria_evaluations.confirmed_level`
- MPS: computed from criteria using `scoring_rules.aggregation_method`
- Domain: computed from MPS using same method
- Audit overall: computed from Domains using same method
- All aggregate scores: stored in `public.aggregate_scores (audit_id, level_type, scope_id, computed_level, computed_at)`

---

## 5. Excluded Item Behaviour Summary

| Item | Toggle OFF effect | Scoring | Report | Responsibility |
|------|------------------|---------|--------|----------------|
| Domain | All MPS/Criteria under it inherit excluded=true | Excluded from all scoring | Excluded (not in report) | Released |
| MPS | All Criteria under it inherit excluded=true | Excluded from domain aggregate | Excluded | Defaults to Domain Auditor |
| Criteria | Only this criteria excluded | Excluded from MPS aggregate | Excluded | Released |

**DB enforcement:**
- `domains.excluded`, `mps.excluded`, `criteria.excluded` boolean columns
- Cascade trigger OR application-level logic: when `domain.excluded` flipped to true, all child MPS and criteria set to `excluded=true`
- "Create Report" gating checks `excluded=false AND evaluation.status NOT IN ('confirmed','overridden')` — excluded items do not block the report

---

## 6. Summary of All New Tables Required (not yet in existing migrations)

| Table | Purpose |
|-------|---------|
| `criteria_documents` | Track uploaded criteria documents and parse status |
| `domains` | Domain hierarchy (audit-scoped) |
| `mps` | MPS hierarchy (domain-scoped) |
| `criteria` | Criteria (mps-scoped), with excluded flag |
| `audit_invitations` | Invitation tokens for all invite flows |
| `domain_assignments` | Links accepted auditors to domains |
| `mps_assignments` | Links accepted auditors to MPS |
| `criteria_assignments` | Links accepted evidence submitters to criteria |
| `criteria_evaluations` | AI evaluation outputs per criteria |
| `evaluation_overrides` | Human override records |
| `criteria_level_descriptors` | Level descriptors per criteria |
| `mps_level_descriptors` | Level descriptors per MPS |
| `domain_level_descriptors` | Level descriptors per domain |
| `maturity_levels` | Lookup: level names, numeric values, colours |
| `scoring_rules` | Aggregation method config (global + per-org) |
| `aggregate_scores` | Computed aggregate ratings at all levels |
| `audit_reports` | Metadata for generated reports |

> **Note:** Tables `audits`, `organisations`, `profiles` already exist. RLS policies for new tables must follow the org-isolation pattern established in migration `20260304000004`.

---

## 7. AI Capability Routing Summary

| Trigger | AI Task | Model |
|---------|---------|-------|
| Criteria document upload | Text extraction + hierarchy restructuring | GPT-4 Turbo (structured reasoning) |
| Criteria document upload | Image/diagram extraction from PPT/PDF | GPT-4 Vision |
| Evidence submit — voice note | Transcription | Whisper |
| Evidence submit — video | Frame extraction + transcription | Whisper + GPT-4 Vision |
| Evidence submit — photos | Image interpretation | GPT-4 Vision |
| Evidence submit — documents | Text extraction | GPT-4 Turbo |
| AI evaluation (criteria) | Maturity scoring + rationale + guidance | GPT-4 Turbo |
| Create Report | Report drafting | GPT-4 Turbo (report writer agent) |
| Level descriptor generation | Per-criteria descriptor text at parse time | GPT-4 Turbo |
| AI Chat (embedded panel) | Contextual Q&A | GPT-4o (default) / GPT-4 Turbo |

All routing must go through the AI Gateway per TR-040. No direct OpenAI calls from frontend.

---

## 8. What the QA RED Suite Must Cover

The Foreman should commission RED gate tests (failing because the feature is not yet built) for each of the following:

1. Invite Auditor flow: invitation token created, email triggered, acceptance updates assignments
2. Invite Evidence Submitter: same flow scoped to criteria
3. Accept Invite: new user lands on accept page, creates account, is scoped to correct domain/MPS/criteria only
4. Toggle exclude: domain exclusion cascades to child MPS and criteria
5. Responsibility cascade: Lead Auditor shown as responsible when no domain auditor assigned
6. Evidence upload: all 6 evidence types upload and store correctly
7. Click-and-hold voice/video recording produces a storable audio/video artifact
8. AI evaluation triggered on Submit: evaluation row created, criteria card updated with rating
9. AI chat panel pre-loads criteria context on open from criteria card
10. Audit results table renders with Domain/MPS/Criteria/Findings/Rating/Recommendations
11. Dashboard gating: "Create Report" button disabled while any non-excluded criteria is unconfirmed
12. "Create Report" generates and stores PDF artifact
13. Level descriptor shown on each card at correct level
14. Aggregate scoring: MPS/Domain scores compute from criteria ratings using scoring_rules
15. Scoring rules table: default global rule exists and is readable at report time
16. All new tables exist with correct columns and RLS policies

---

*This document was generated from CS2 verbal specification (2026-03-04) and gap analysis against existing MAT app description artifacts. It is authoritative for the purposes of RED QA suite commissioning and FRS gap remediation.*

---

## Wave 15 Correction — 2026-03-06

> **Wave 15 correction — 2026-03-06 — parsing workflow wiring concretised per INC-POST-FCWT-CRITERIA-PIPELINE-001**

In Wave 15 post-delivery oversight review, it was identified that the criteria parsing pipeline wiring lacked concrete end-to-end specification. Specifically, the upstream/downstream bindings between `CriteriaUpload.tsx`, `useTriggerAIParsing`, the Supabase Edge Function `invoke-ai-parse-criteria`, the AI Gateway `/parse` endpoint, DB write-back, `useCriteria.ts` polling, and the Criteria Hierarchy panel were defined only at a high level in STEP 2.

**Correction applied:** Step 2a (Concrete Parse Cycle Wiring) was added to STEP 2 above, providing the full, explicit component-to-component wiring diagram for the parse cycle. This correction is traceable to incident INC-POST-FCWT-CRITERIA-PIPELINE-001 and mirrors the architectural concretisation recorded in:
- App Description §6.2 and §6.2.1 (v1.4)
- System Architecture §4 (Criteria Parsing Pipeline Architecture)
- FRS FR-005 acceptance criteria 7–14 and FR-103 (Parsing Resilience and Error Surface)

No functional behaviour was changed by this correction — only the wiring documentation was made explicit.