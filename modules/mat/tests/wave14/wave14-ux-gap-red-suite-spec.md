# Wave 14 — RED QA Suite Specification: UX Workflow Gap Remediation

**Module**: MAT (Manual Audit Tool)
**Wave**: Wave 14
**Governance**: Issue #909 — Governance Remediation: FRS, TRS, and Red QA Suite for Unaddressed UX Workflow Gaps
**Source authority**: `modules/mat/00-app-description/MAT_UX_WORKFLOW_AND_WIRING.md` v1.0 (CS2 direct, 2026-03-04)
**FRS Reference**: FR-089 to FR-102
**TRS Reference**: TR-089 to TR-102
**Created**: 2026-03-04
**Status**: 🔴 RED SUITE — All 16 tests MUST FAIL before any implementation begins; these tests expose missing features

---

## Purpose

This document specifies the 16 RED gate tests for Wave 14. Each test description covers:
- The UX gap it addresses (GAP-Wxx reference)
- The exact scenario to test
- The expected outcome (what must exist/work once the gap is closed)
- The RED justification (why the test currently fails)

These tests MUST be commissioned to **qa-builder** for implementation. The test files belong in `modules/mat/tests/wave14/`. Each test must FAIL before any implementation is delivered and PASS only after the builder has fully implemented the wired feature.

**Test assertion numbering convention**: The spec lists numbered assertions (1, 2, 3, ...) as the minimum required assertions. The implementing test files may use letter suffixes (T-W14-UX-NNNa, T-W14-UX-NNNb, ...) to split a single spec assertion into multiple fine-grained test cases. This is acceptable — additional test cases add coverage without contradicting the spec. The mapping is: spec assertion N → one or more test cases using letter suffix (e.g. spec assertion 2 may become T-W14-UX-001b and T-W14-UX-001c). As long as every spec assertion has at least one corresponding test case, the implementation is conformant.

---

## Test Specifications

### T-W14-UX-001 — Onboarding Guard blocks unauthenticated users without org (GAP-W01)

**FRS/TRS**: FR-089 / TR-089
**File**: `modules/mat/tests/wave14/onboarding-guard.test.ts`

**Scenario**: A freshly signed-up user with a valid Supabase Auth session but no `profiles.organisation_id` attempts to navigate to the audit dashboard (`/`).

**Expected outcome**: The application redirects the user to `/onboarding` and does NOT render any dashboard content. The onboarding wizard renders with two steps (full name → create organisation). On completing both steps, `public.organisations` has a new row and `public.profiles` has the updated `organisation_id`.

**RED justification**: `OnboardingGuard` does not yet exist in `App.tsx` routing. The two-step onboarding wizard is not implemented. The organisations INSERT and profiles UPSERT calls are not wired.

**Test assertions**:
1. Route `/` with no `organisation_id` in profile → React renders `/onboarding`, not `/`.
2. Completing Step 1 (name) + Step 2 (org name) → `organisations` table gains a row.
3. `profiles.organisation_id` is non-null after completion.
4. Navigating to `/` after completion renders the dashboard (guard passes).

---

### T-W14-UX-002 — Invite Auditor modal creates invitation and triggers email (GAP-W02)

**FRS/TRS**: FR-090 / TR-090
**File**: `modules/mat/tests/wave14/invite-auditor.test.ts`

**Scenario**: Lead Auditor clicks "Invite Auditor" on a Domain card, fills in the modal (name + email), and clicks "Send Invite". The invitee then visits the accept-invite link, creates an account, and is assigned as Domain Auditor with scoped access.

**Expected outcome**: 
- `audit_invitations` row is created with `scope_type = 'domain'`, `status = 'pending'`, and a non-null `invitation_token`.
- `send-invitation` Edge Function is called with the `invitation_id`.
- Visiting `/accept-invite?token={token}` creates a user account under the inviting org.
- `domain_assignments` row is created linking the new user to the domain.
- `audit_invitations.status` is updated to `'accepted'`.
- New user's app view shows only their assigned domain.

**RED justification**: `audit_invitations` table does not exist. `domain_assignments` table does not exist. Invite modal is not implemented. `send-invitation` Edge Function is not implemented. Accept-invite route is not implemented.

**Test assertions**:
1. POST to the invite flow creates `audit_invitations` row with correct `scope_type` and `status = 'pending'`.
2. Edge function invocation is triggered (stub/mock verifies call).
3. Accept-invite with valid token creates `domain_assignments` row.
4. `audit_invitations.status` becomes `'accepted'` after acceptance.
5. Invitee cannot query criteria from other domains (RLS test: query returns 0 rows for out-of-scope domain).

---

### T-W14-UX-003 — Toggle exclude domain cascades to child MPS and criteria (GAP-W03)

**FRS/TRS**: FR-091 / TR-091
**File**: `modules/mat/tests/wave14/toggle-exclude-cascade.test.ts`

**Scenario**: A domain with 2 MPS and 4 criteria (2 per MPS) is toggled to `excluded = true`. All 6 child items must inherit the exclusion. The "Create Report" gating query must not count the excluded criteria as blocking.

**Expected outcome**:
- `domains.excluded = true` → all child `mps.excluded = true` AND all child `criteria.excluded = true`.
- Scoring aggregate query excludes all toggled items.
- "Create Report" gate query returns 0 blocking criteria when all are excluded.

**RED justification**: `domains.excluded`, `mps.excluded`, `criteria.excluded` columns may not exist. No cascade trigger or application logic has been implemented. "Create Report" gate query is not implemented.

**Test assertions**:
1. UPDATE `domains SET excluded = true WHERE id = $domainId` → SELECT COUNT(*) FROM mps WHERE domain_id = $domainId AND excluded = false → returns 0.
2. SELECT COUNT(*) FROM criteria WHERE domain_id = $domainId AND excluded = false → returns 0.
3. "Create Report" gate query returns 0 blocking criteria.
4. Un-toggling the domain (set excluded = false) does NOT automatically restore the child items' exclusion state if they were individually excluded before the parent toggle.

---

### T-W14-UX-004 — Invite Evidence Submitter creates criteria-scoped access (GAP-W04)

**FRS/TRS**: FR-092 / TR-092
**File**: `modules/mat/tests/wave14/invite-evidence-submitter.test.ts`

**Scenario**: Lead Auditor invites an Evidence Submitter for a specific Criteria. The invitee accepts and can upload evidence for that criteria only.

**Expected outcome**:
- `audit_invitations` row with `scope_type = 'criteria'` is created.
- On acceptance: `criteria_assignments` row is created.
- Evidence Submitter cannot SELECT criteria outside their assignment (RLS enforces scope).
- Evidence Submitter CAN INSERT into `evidence` for their assigned `criteria_id`.

**RED justification**: `criteria_assignments` table does not exist. Accept-invite route does not handle `scope_type = 'criteria'`. Evidence RLS for criteria-scoped access is not implemented.

**Test assertions**:
1. Accept-invite with `scope_type = 'criteria'` creates `criteria_assignments` row.
2. Evidence Submitter query for an out-of-scope criteria returns 0 rows.
3. Evidence Submitter can INSERT an evidence row for their assigned `criteria_id`.
4. Evidence Submitter cannot INSERT an evidence row for a different `criteria_id`.

---

### T-W14-UX-005 — Evidence upload panel supports all 6 types and stores files (GAP-W05)

**FRS/TRS**: FR-093 / TR-093
**File**: `modules/mat/tests/wave14/evidence-upload-panel.test.ts`

**Scenario**: A user uploads one of each of the 6 evidence types (text findings, file, voice note, photo, video, transcript) for a criteria. All items are stored correctly. Remove and Replace controls function. Findings text auto-saves.

**Expected outcome**:
- Each uploaded evidence item has an `evidence` DB row with correct `type`, `storage_path`, and non-deleted status.
- Voice note recording via click-and-hold produces a storable audio Blob.
- Soft delete sets `evidence.deleted = true` — does not remove the storage object.
- Auto-save debounce writes `findings_text` to the `evidence` row.

**RED justification**: `evidence` table may be missing required columns (`type` ENUM, `deleted`, `storage_path`). MediaRecorder voice/video recording is not implemented. Evidence tile component with Remove/Replace does not exist. Auto-save is not implemented.

**Test assertions**:
1. INSERT into `evidence` with `type = 'file'` succeeds (validates schema).
2. INSERT into `evidence` with `type = 'voice'` succeeds.
3. INSERT into `evidence` with `type = 'text'` sets `findings_text` correctly.
4. UPDATE `evidence SET deleted = true` succeeds; row still exists in DB.
5. UPDATE `evidence SET findings_text = '...'` succeeds (auto-save simulation).
6. Querying `evidence WHERE deleted = false` excludes the soft-deleted row.

---

### T-W14-UX-006 — Submit button triggers AI evaluation and creates criteria_evaluations row (GAP-W06)

**FRS/TRS**: FR-094 / TR-094
**File**: `modules/mat/tests/wave14/ai-evaluation-trigger.test.ts`

**Scenario**: User submits evidence for a criteria. The AI evaluation endpoint is called, returns a structured result, and a `criteria_evaluations` row is inserted. Confirm Rating updates status. Override creates an override row.

**Expected outcome**:
- AI evaluation endpoint is called with `{ criteria_id, audit_id }`.
- `criteria_evaluations` row is created with all required fields populated (`proposed_level`, `confidence_score`, `rationale`, `findings_summary`, `next_level_guidance`, `next_plus_one_taster`, `status = 'pending_review'`).
- Confirm Rating: `status` → `'confirmed'`, `confirmed_level` set.
- Override: `evaluation_overrides` row created with `justification`.

**RED justification**: `criteria_evaluations` table does not exist. `evaluation_overrides` table does not exist. AI evaluation endpoint is not implemented. Human confirmation flow is not implemented.

**Test assertions**:
1. `criteria_evaluations` table exists with all required columns.
2. INSERT into `criteria_evaluations` succeeds with all required fields.
3. UPDATE `criteria_evaluations SET status = 'confirmed', confirmed_level = $level` succeeds.
4. INSERT into `evaluation_overrides` with all fields (including `justification`) succeeds.
5. `evaluation_overrides` INSERT without `justification` fails (NOT NULL constraint).

---

### T-W14-UX-007 — Criteria card shows next-level guidance and taster after evaluation (GAP-W07)

**FRS/TRS**: FR-095 / TR-095
**File**: `modules/mat/tests/wave14/next-level-guidance-surface.test.ts`

**Scenario**: After AI evaluation, the criteria card displays the current rating, `next_level_guidance`, and `next_plus_one_taster` sourced from the `criteria_evaluations` row.

**Expected outcome**:
- Criteria card renders a maturity level badge (colour-coded).
- `next_level_guidance` text is rendered in a "What to improve" section.
- `next_plus_one_taster` text is rendered in a "Where you're heading" section.
- "Explore further levels" link is visible and associated with the criteria.

**RED justification**: Criteria card does not render evaluation data. `next_level_guidance` and `next_plus_one_taster` columns do not exist in `criteria_evaluations` (table not yet created). "Explore further levels" link does not exist in the UI.

**Test assertions**:
1. `criteria_evaluations` table has `next_level_guidance TEXT` and `next_plus_one_taster TEXT` columns (schema test).
2. A criteria card rendered with a mock evaluation row shows the rating badge.
3. A criteria card shows `next_level_guidance` text from the evaluation row.
4. A criteria card shows `next_plus_one_taster` text from the evaluation row.
5. "Explore further levels" link is rendered when evaluation row exists.

---

### T-W14-UX-008 — AI chat panel pre-loads criteria context on open from criteria card (GAP-W08)

**FRS/TRS**: FR-096 / TR-096
**File**: `modules/mat/tests/wave14/ai-chat-context-injection.test.ts`

**Scenario**: User clicks "Explore further levels" on a criteria card (post-evaluation). The AI chat panel opens with `{ criteria_name, current_level, next_level_guidance }` injected into the chat session context. The AI responds to criteria-specific questions with the correct context.

**Expected outcome**:
- AI chat panel opens with contextPayload prop populated from the evaluation row.
- First AI response reflects the injected criteria name and level.
- Chat opened from main navigation (no criteria context) does NOT include stale criteria context.

**RED justification**: AI chat panel does not accept a `contextPayload` prop. Context injection into the chat session is not implemented. The "Explore further levels" link does not open the panel.

**Test assertions**:
1. AI chat panel component accepts `contextPayload` prop without error (unit test).
2. When `contextPayload` is provided, the component renders a pre-loaded context indicator.
3. When `contextPayload` is null/undefined, no criteria context is shown.
4. Opening the panel from a criteria card passes the correct `criteria_name` and `current_level` values.

---

### T-W14-UX-009 — Audit results table renders all criteria with correct columns (GAP-W09)

**FRS/TRS**: FR-097 / TR-097
**File**: `modules/mat/tests/wave14/audit-results-table.test.ts`

**Scenario**: An audit with 3 criteria (2 confirmed, 1 pending) across 2 MPS and 1 domain renders the Results table. The table shows all criteria rows with correct columns. An excluded criteria is greyed. RLS scoping restricts domain auditor to their domain only.

**Expected outcome**:
- Table renders with columns: Domain, MPS, Criteria, Findings Summary, Rating, Recommendations.
- Pending criteria shows "Pending" status badge.
- Excluded criteria shows "Excluded" label and greyed treatment.
- Domain Auditor user can only see their domain's criteria rows (RLS test).

**RED justification**: Results tab and table component do not exist. `criteria_evaluations` table does not exist. RLS scoping for results table is not implemented.

**Test assertions**:
1. Query joining audits→domains→mps→criteria→criteria_evaluations (LEFT JOIN) returns expected row count.
2. Criteria with no evaluation row has `status = null` / surfaces as "Pending".
3. Criteria with `excluded = true` is included in query but has the excluded flag set.
4. Domain Auditor query: criteria from out-of-scope domain returns 0 rows.

---

### T-W14-UX-010 — Dashboard gating: Create Report disabled until all criteria evaluated (GAP-W10)

**FRS/TRS**: FR-098 / TR-098
**File**: `modules/mat/tests/wave14/dashboard-create-report-gate.test.ts`

**Scenario**: An audit has 3 non-excluded criteria. 2 are confirmed, 1 is still pending. The "Create Report" gate query must return a count > 0 (button disabled). After confirming the third criteria, the gate query returns 0 (button enabled).

**Expected outcome**:
- Gate query: `SELECT COUNT(*) FROM criteria WHERE audit_id = $1 AND excluded = false AND id NOT IN (SELECT criteria_id FROM criteria_evaluations WHERE status IN ('confirmed','overridden'))` → returns 1 when one criteria is pending.
- After confirming the third, gate query returns 0.
- Dashboard metrics (Total, Submitted, Outstanding, Excluded counts) are correctly computed.

**RED justification**: `criteria_evaluations` table does not exist. Dashboard metrics query is not implemented. Gate query is not implemented. "Create Report" button gating logic is not implemented.

**Test assertions**:
1. Gate query returns 1 when one non-excluded criteria has no confirmed evaluation.
2. Gate query returns 0 when all non-excluded criteria have confirmed evaluations.
3. Gate query returns 0 when all non-excluded criteria are excluded (edge case: no criteria left).
4. Dashboard counts (Submitted, Outstanding, Excluded) are correctly computed via aggregate query.

---

### T-W14-UX-011 — Create Report generates PDF and stores audit_reports row (GAP-W11)

**FRS/TRS**: FR-099 / TR-099
**File**: `modules/mat/tests/wave14/create-report-generation.test.ts`

**Scenario**: Lead Auditor clicks "Create Report". The AI generation endpoint is called, a PDF is generated, stored in the `reports` bucket, and an `audit_reports` row is created. A signed download URL is returned.

**Expected outcome**:
- `POST /ai/generate-report` is called with `{ audit_id }`.
- `audit_reports` table has a new row with `status = 'final'` and a non-null `storage_path`.
- PDF is stored in `reports/{organisation_id}/{audit_id}/` path.
- Signed download URL is returned to the frontend.

**RED justification**: `audit_reports` table does not exist. `generate-report` endpoint is not implemented. `generate-pdf` Edge Function is not implemented. `reports` storage bucket is not configured.

**Test assertions**:
1. `audit_reports` table exists with correct schema (schema test).
2. INSERT into `audit_reports` with all required fields succeeds.
3. `storage_path` column is NOT NULL (constraint test).
4. Only Lead Auditor can SELECT the `audit_reports` row for their audit (RLS test).
5. Non-org member cannot SELECT the `audit_reports` row (RLS test).

---

### T-W14-UX-012 — Level descriptors exist on criteria, MPS, and domain cards (GAP-W12)

**FRS/TRS**: FR-100 / TR-100
**File**: `modules/mat/tests/wave14/level-descriptor-tables.test.ts`

**Scenario**: After AI criteria parsing, each criteria/MPS/domain has 5 descriptor rows (one per maturity level). The criteria card shows the descriptor for the current confirmed level. MPS and Domain cards show the descriptor for their aggregate level.

**Expected outcome**:
- `criteria_level_descriptors` table has 5 rows per criteria (one per level) after parsing.
- `mps_level_descriptors` table has descriptor rows for each MPS.
- `domain_level_descriptors` table has descriptor rows for each domain.
- A criteria card query for the current level returns the correct `descriptor_text`.

**RED justification**: `criteria_level_descriptors`, `mps_level_descriptors`, and `domain_level_descriptors` tables do not exist. AI parsing endpoint does not populate these tables. Card components do not render descriptors.

**Test assertions**:
1. `criteria_level_descriptors` table exists with correct schema (schema test).
2. `mps_level_descriptors` table exists with correct schema.
3. `domain_level_descriptors` table exists with correct schema.
4. `descriptor_text` NOT NULL constraint is enforced (INSERT with null descriptor fails).
5. UNIQUE constraint on `(criteria_id, level)` is enforced (duplicate INSERT fails).

---

### T-W14-UX-013 — Scoring tables exist and default rule is seeded (GAP-W13)

**FRS/TRS**: FR-101 / TR-101
**File**: `modules/mat/tests/wave14/scoring-tables.test.ts`

**Scenario**: The `maturity_levels`, `scoring_rules`, and `aggregate_scores` tables exist with correct schemas. A global default scoring rule is seeded. The frontend can query `maturity_levels` to get the numeric value for each level name without hardcoding.

**Expected outcome**:
- `maturity_levels` has exactly 5 rows: Basic(1), Reactive(2), Compliant(3), Proactive(4), Resilient(5).
- `scoring_rules` has at least 1 row with `organisation_id = NULL` and `aggregation_method = 'weighted_average'` (global default).
- `aggregate_scores` table can receive an UPSERT from the compute function.
- Querying `maturity_levels` returns 5 rows sorted by `numeric_value`.

**RED justification**: `maturity_levels`, `scoring_rules`, and `aggregate_scores` tables do not exist. No seed data migration exists. Scoring computation function is not implemented.

**Test assertions**:
1. `maturity_levels` table exists and has exactly 5 rows (schema + seed test).
2. All 5 level names are present: Basic, Reactive, Compliant, Proactive, Resilient.
3. `scoring_rules` has a global default row (`organisation_id IS NULL`).
4. `aggregate_scores` table exists with correct schema.
5. UPSERT into `aggregate_scores` on `(audit_id, level_type, scope_id)` succeeds without duplicate key error.

---

### T-W14-UX-014 — Responsibility cascade defaults to Lead Auditor when no assignment (GAP-W14)

**FRS/TRS**: FR-102 / TR-102
**File**: `modules/mat/tests/wave14/responsibility-cascade.test.ts`

**Scenario**: A domain, its MPS, and a criteria under that MPS have no assignment rows in `domain_assignments`, `mps_assignments`, or `criteria_assignments`. The responsibility cascade for all three must resolve to the Lead Auditor (`audit.created_by`). When a domain auditor is assigned (`domain_assignments` row inserted), the domain responsibility changes; MPS and criteria cascade to the domain auditor.

**Expected outcome**:
- Without any assignment rows: all three levels resolve `responsible_user_id = audit.created_by`.
- After inserting a `domain_assignments` row: domain resolves to the domain auditor; MPS resolves to the domain auditor; criteria resolves to the domain auditor.
- After inserting an `mps_assignments` row: MPS and criteria resolve to the MPS auditor; domain remains domain auditor.

**RED justification**: `domain_assignments`, `mps_assignments`, `criteria_assignments` tables do not exist. Responsibility cascade view/function is not implemented. Card components do not display the responsible user name.

**Test assertions**:
1. `domain_assignments` table exists (schema test).
2. `mps_assignments` table exists (schema test).
3. `criteria_assignments` table exists (schema test).
4. With no assignment rows, responsibility cascade query for domain returns `audit.created_by`.
5. After inserting `domain_assignments` row, cascade query for domain returns the assigned `user_id`.
6. After inserting `mps_assignments` row, cascade query for MPS returns the MPS `user_id` (not domain auditor).

---

### T-W14-UX-015 — All new tables have org-isolation RLS (cross-org access denied)

**FRS/TRS**: FR-089 to FR-102 / TR-089 to TR-102 (cross-cutting)
**File**: `modules/mat/tests/wave14/new-tables-rls.test.ts`

**Scenario**: A user from Organisation A attempts to SELECT rows from all 14 new Wave 14 tables that belong to Organisation B. All queries must return 0 rows.

**Expected outcome**: RLS policies on all 14 new tables enforce org-isolation. No cross-org data leakage.

**RED justification**: None of the 14 new tables exist yet. RLS policies are not implemented.

**Tables to test**: `audit_invitations`, `domain_assignments`, `mps_assignments`, `criteria_assignments`, `criteria_evaluations`, `evaluation_overrides`, `criteria_level_descriptors`, `mps_level_descriptors`, `domain_level_descriptors`, `maturity_levels` (global — no RLS needed), `scoring_rules` (global — no RLS needed), `aggregate_scores`, `audit_reports`.

**Test assertions**:
1. Org-A user cannot SELECT `audit_invitations` rows belonging to Org-B audit.
2. Org-A user cannot SELECT `criteria_evaluations` rows belonging to Org-B audit.
3. Org-A user cannot SELECT `aggregate_scores` rows belonging to Org-B audit.
4. Org-A user cannot SELECT `audit_reports` rows belonging to Org-B audit.
5. All 13 org-scoped new tables have SELECT RLS confirmed (maturity_levels and scoring_rules global defaults are publicly readable — verified separately).

---

### T-W14-UX-016 — Scoring rules table global default readable at report time (GAP-W13 supplement)

**FRS/TRS**: FR-101 / TR-101
**File**: `modules/mat/tests/wave14/scoring-rules-report-access.test.ts`

**Scenario**: During report generation, the service calls `SELECT * FROM scoring_rules WHERE organisation_id IS NULL` to retrieve the global default scoring rule. The query must succeed and return exactly 1 row. A per-org override (if present) must take precedence over the global default.

**Expected outcome**:
- Global default `scoring_rules` row is returned by the query.
- If a per-org override exists (matching `organisation_id`), it is returned in preference to the global default.
- If no scoring rule exists at all, the report generation must fail gracefully with a clear error (not silently produce wrong scores).

**RED justification**: `scoring_rules` table does not exist. Global default seed does not exist. Score computation function is not implemented.

**Test assertions**:
1. SELECT `scoring_rules WHERE organisation_id IS NULL` returns exactly 1 row.
2. Global default has `aggregation_method = 'weighted_average'`.
3. Inserting an org-specific rule and querying with `WHERE organisation_id = $orgId OR organisation_id IS NULL ORDER BY organisation_id NULLS LAST LIMIT 1` returns the org-specific rule.
4. Querying with a non-existent org ID returns the global default (fallback logic).

---

## Implementation Notes for qa-builder

When implementing these tests, follow the established Wave 13/14 pattern:
- Test file extension: `.test.ts`
- Test framework: Vitest with Supabase test client
- All tests that require DB access use the test Supabase project with migrations applied
- Each test must have a `describe` block matching the test ID (e.g. `describe('T-W14-UX-001', ...)`)
- Tests must be **RED (FAIL)** before any implementation — do not write tests that pass before the feature is built
- See existing examples in `modules/mat/tests/security-rls/` and `modules/mat/tests/wave13/` for patterns

**Total test count**: 16 test descriptions, corresponding to tests T-W14-UX-001 through T-W14-UX-016.

---

*This specification was created by foreman-v2-agent session-099 per issue #909. Implementation of test files must be commissioned to qa-builder.*
