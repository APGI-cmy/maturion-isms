# IAA Pre-Brief — Wave 14 Batch A
# Access, Identity & Assignment Implementation (Issue #909)

**Status**: ACTIVE — IMPLEMENTATION TASKS
**Wave**: Wave 14 Batch A
**Issue**: #909 (CS2 direct — @APGI-cmy)
**Branch**: `copilot/implement-onboarding-and-assignment`
**Foreman Session**: session-140
**Pre-Brief Date**: 2026-03-05
**IAA Session (Pre-Brief)**: IAA-PREBRIEF-W14-BATCHA-20260305
**Authority**: CS2 (Johan Ras / @APGI-cmy)
**Prior Pre-Brief**: `.agent-admin/assurance/iaa-prebrief-wave14.md`
  (covered planning artifacts only — FRS, TRS, QA spec — not these implementation tasks)

> **POLC CONTEXT**: Per the POLC breach recorded in `wave-current-tasks.md`
> (SELF-BREACH-SESSION-140-001), the implementation was delivered before this
> Pre-Brief was confirmed for Batch A. This Pre-Brief is generated retroactively
> per Foreman instruction. The full assurance audit (Phases 2–4) MUST still be
> performed before this PR is opened for merge. IAA confirmation of a POLC breach
> does NOT waive the Phase 2–4 audit requirement. The STOP-AND-FIX mandate remains
> fully ACTIVE for this PR.

---

## Step 0.2 — Wave Context

**Wave number**: Wave 14 Batch A (implementation phase)
**Wave scope**: UX Workflow Gap Remediation — Onboarding, Invitations, Assignments, Exclusions, RLS
**Producing builders**:
- `schema-builder` — TASK-W14-B-001 through TASK-W14-B-004 (SQL migrations)
- `ui-builder` — TASK-W14-B-005 and TASK-W14-B-006 (React frontend)

**FRS coverage**: FR-089, FR-090, FR-091, FR-092, FR-102
**TRS coverage**: TR-089, TR-090, TR-091, TR-092, TR-102
**GAP coverage**: GAP-W01, GAP-W02, GAP-W03, GAP-W04, GAP-W14, GAP-W15

---

## Step 0.3 — Task Classification

All six tasks are qualifying. Classification rationale below:

| Task ID | Classification | Reason |
|---------|---------------|--------|
| TASK-W14-B-001 | QUALIFYING — AAWP_MAT | Schema migration delivering executable DB behaviour (onboarding_completions table + trigger + RLS) |
| TASK-W14-B-002 | QUALIFYING — AAWP_MAT | Schema migration delivering executable DB behaviour (5 tables + VIEW + RLS — assignment architecture core) |
| TASK-W14-B-003 | QUALIFYING — AAWP_MAT | Schema migration delivering executable DB behaviour (excluded columns + cascade trigger + gate VIEW) |
| TASK-W14-B-004 | QUALIFYING — AAWP_MAT | Schema migration delivering cross-cutting RLS consolidation for all Wave 14 tables |
| TASK-W14-B-005 | QUALIFYING — AAWP_MAT | Frontend component change delivering executable UX routing behaviour (OnboardingGuard sentinel) |
| TASK-W14-B-006 | QUALIFYING — AAWP_MAT | Frontend component change delivering executable UX rendering behaviour (OnboardingPage step markers) |

**Non-qualifying tasks this wave**: None (all Batch A tasks are build deliverables).

---

## Step 0.4 — Per-Task Pre-Brief Declarations

---

### TASK-W14-B-001
**File**: `apps/maturion-maturity-legacy/supabase/migrations/20260305000000_wave14_onboarding_support.sql`
**Builder**: schema-builder
**Gap / FR / TR**: GAP-W01 / FR-089 / TR-089

#### iaa_trigger_category
`AAWP_MAT` — Supabase schema migration delivering the onboarding completion tracking layer.

#### task_summary
Creates the `onboarding_completions` table, enables RLS with an org-isolation SELECT policy,
and creates the `record_onboarding_complete()` trigger function + `organisations_insert_onboarding`
trigger. Intended to record when a user completes the two-step onboarding wizard.

#### required_phases
- **Phase 2** (Alignment): PR category classification, trigger table application
- **Phase 3** (Assurance work): Full BD-TIER-1 through BD-TIER-6 overlay execution
- **Phase 3.1** (FAIL-ONLY-ONCE): Apply A-001 and A-002; apply any migration-specific rules
- **Phase 4** (Merge gate parity + verdict)

#### required_evidence_artifacts
| Artifact | Location | Required For |
|---------|----------|-------------|
| PREHANDOVER proof | PR bundle root | CERT-001, CORE-016 |
| Session memory (schema-builder) | `.agent-workspace/schema-builder/memory/` | CERT-002 |
| IAA invocation evidence | PREHANDOVER proof `iaa_audit_token` field | CORE-013 |
| Test evidence — T-W14-UX-001d GREEN | CI output or test run log | BD-011 |
| Test evidence — T-W14-UX-001e GREEN | CI output or test run log | BD-011 |
| Migration file present | `apps/maturion-maturity-legacy/supabase/migrations/20260305000000_wave14_onboarding_support.sql` | BD-001 |

#### applicable_overlays
- **Universal Ceremony Gate** (CERT-001 through CERT-004)
- **BUILD_DELIVERABLE Overlay** — BD-TIER-1 through BD-TIER-6

#### specific_rules

| Rule ID | Rule | Rationale |
|---------|------|-----------|
| W14-B-001-R01 | Verify `record_onboarding_complete()` trigger correctness: the function inserts `VALUES (NEW.id, NEW.id)` where the FIRST value is typed `user_id UUID NOT NULL REFERENCES auth.users(id)`. Since `NEW` is an `organisations` row, `NEW.id` is the organisation UUID — NOT the user UUID. **IAA must determine whether this constitutes a functional bug.** | BD-003, BD-022 — if the trigger fires after org INSERT and `NEW.id` is the org UUID, the `user_id` column will contain an org UUID pointing into `auth.users`, which is semantically wrong and will likely cause FK violation or silent data corruption. |
| W14-B-001-R02 | Verify RLS completeness: `onboarding_completions` has a SELECT policy but NO INSERT policy. Users must INSERT their own completion row. Without an INSERT policy (or a SECURITY DEFINER function covering the insert), authenticated users will be blocked from writing their completion record. | BD-015 — RLS table with missing INSERT policy is a functional blocker. |
| W14-B-001-R03 | Verify `SECURITY DEFINER` trigger context: `auth.uid()` is not available inside `SECURITY DEFINER` PL/pgSQL functions — the trigger runs as the function owner, not the calling session user. If `auth.uid()` is needed inside the trigger to resolve the real user, a different approach is required. | BD-003, BD-022 — architectural correctness. |
| W14-B-001-R04 | Verify test T-W14-UX-001d (`migration file exists`) and T-W14-UX-001e (`onboarding_completions table declared`) are GREEN in CI. | BD-011 — zero test failures. |

---

### TASK-W14-B-002
**File**: `apps/maturion-maturity-legacy/supabase/migrations/20260305000001_wave14_invitations_assignments.sql`
**Builder**: schema-builder
**Gap / FR / TR**: GAP-W02, GAP-W04, GAP-W14 / FR-090, FR-092, FR-102 / TR-090, TR-092, TR-102

#### iaa_trigger_category
`AAWP_MAT` — Core assignment architecture: five tables + responsibility cascade VIEW + RLS.

#### task_summary
Creates `audit_invitations`, `domain_assignments`, `mps_assignments`, `criteria_assignments` tables
with constraints and unique indexes. Enables RLS and adds org-isolation SELECT policies on all four.
Creates the `responsibility_cascade` VIEW implementing the priority cascade:
`criteria_assignments → mps_assignments → domain_assignments → audits.created_by`.

#### required_phases
- **Phase 2** (Alignment)
- **Phase 3** (Assurance work) — full BD-TIER-1 through BD-TIER-6
- **Phase 3.1** (FAIL-ONLY-ONCE)
- **Phase 4** (Merge gate parity + verdict)

#### required_evidence_artifacts
| Artifact | Location | Required For |
|---------|----------|-------------|
| PREHANDOVER proof | PR bundle root | CERT-001, CORE-016 |
| Session memory (schema-builder) | `.agent-workspace/schema-builder/memory/` | CERT-002 |
| Test evidence — T-W14-UX-002a through T-W14-UX-002g GREEN | CI output | BD-011 |
| Test evidence — T-W14-UX-004a through T-W14-UX-004e GREEN | CI output | BD-011 |
| Migration file present | `apps/maturion-maturity-legacy/supabase/migrations/20260305000001_wave14_invitations_assignments.sql` | BD-001 |

#### applicable_overlays
- **Universal Ceremony Gate** (CERT-001 through CERT-004)
- **BUILD_DELIVERABLE Overlay** — BD-TIER-1 through BD-TIER-6

#### specific_rules

| Rule ID | Rule | Rationale |
|---------|------|-----------|
| W14-B-002-R01 | Verify `responsibility_cascade` VIEW references columns that exist: `criteria.domain_id`, `criteria.mps_id`, `criteria.organisation_id`, `criteria.audit_id`. These columns must exist in the `criteria` table from prior migrations. IAA must confirm each referenced column exists in at least one prior migration. | BD-005 — wiring integrity; broken VIEW causes silent query failure. |
| W14-B-002-R02 | Verify `mini_performance_standards` table exists and has `id` column (referenced by `mps_assignments` FK). Confirm this table was created by a prior migration. | BD-008 — FK integrity; orphaned FK causes migration failure. |
| W14-B-002-R03 | Verify `responsibility_cascade` VIEW is not orphaned: confirm that at least one consumer (hook, API endpoint, or downstream migration) exists or is declared in Wave 14 Batch B. If no consumer exists in the PR and no consumer is declared in the wave plan, flag as BD-010 orphan. | BD-010 — orphaned deliverables indicate incomplete wiring. |
| W14-B-002-R04 | Verify that BOTH `scope_type` value constraints are exercised by tests: `scope_type = 'domain'` (T-W14-UX-002) and `scope_type = 'criteria'` (T-W14-UX-004). | BD-013 — test coverage must match the constraint surface. |
| W14-B-002-R05 | Verify RLS completeness for `audit_invitations`: is there an INSERT policy for the inviter, and an UPDATE policy for status transitions (`pending → accepted`)? SELECT-only RLS blocks the core invitation workflow at runtime. | BD-015 — RLS completeness. |
| W14-B-002-R06 | Verify RLS completeness for `domain_assignments`, `mps_assignments`, `criteria_assignments`: INSERT policies required for the assigning user. SELECT-only policies block the assignment workflow. | BD-015 — RLS completeness. |

---

### TASK-W14-B-003
**File**: `apps/maturion-maturity-legacy/supabase/migrations/20260305000002_wave14_excluded_columns.sql`
**Builder**: schema-builder
**Gap / FR / TR**: GAP-W03 / FR-091 / TR-091

#### iaa_trigger_category
`AAWP_MAT` — Excluded-column cascade architecture for domains → MPS → criteria hierarchy.

#### task_summary
Adds `excluded BOOLEAN NOT NULL DEFAULT FALSE` column to `domains`, `mini_performance_standards`,
and `criteria` tables. Creates `cascade_exclude_to_children()` trigger function that propagates
`excluded = true/false` from domain → MPS → criteria. Creates `create_report_gate` VIEW counting
non-excluded criteria per audit. Attaches cascade triggers to `domains` and `mini_performance_standards`.

#### required_phases
- **Phase 2** (Alignment)
- **Phase 3** (Assurance work) — full BD-TIER-1 through BD-TIER-6
- **Phase 3.1** (FAIL-ONLY-ONCE)
- **Phase 4** (Merge gate parity + verdict)

#### required_evidence_artifacts
| Artifact | Location | Required For |
|---------|----------|-------------|
| PREHANDOVER proof | PR bundle root | CERT-001, CORE-016 |
| Session memory (schema-builder) | `.agent-workspace/schema-builder/memory/` | CERT-002 |
| Test evidence — T-W14-UX-003 test cases GREEN | CI output | BD-011 |
| Migration file present | `apps/maturion-maturity-legacy/supabase/migrations/20260305000002_wave14_excluded_columns.sql` | BD-001 |

#### applicable_overlays
- **Universal Ceremony Gate** (CERT-001 through CERT-004)
- **BUILD_DELIVERABLE Overlay** — BD-TIER-1 through BD-TIER-6

#### specific_rules

| Rule ID | Rule | Rationale |
|---------|------|-----------|
| W14-B-003-R01 | Verify the cascade trigger handles MPS-level exclusion independently: when `mps.excluded = true` is set WITHOUT the domain being excluded, child criteria must also inherit `excluded = true`. Verify the `TG_TABLE_NAME = 'mini_performance_standards'` branch in the trigger function is reached by a test. | BD-013 — each trigger branch must have test coverage. |
| W14-B-003-R02 | Verify `create_report_gate` VIEW is not orphaned: confirm at least one consumer (frontend hook, service, or gate query) uses this VIEW or the `excluded` column filter. If the VIEW is defined but no consumer is present and none is declared for Batch B, flag as BD-010. | BD-010 — orphaned VIEW delivers no value and adds maintenance surface. |
| W14-B-003-R03 | Verify that `ADD COLUMN IF NOT EXISTS` idempotency is correct for `domains`, `mini_performance_standards`, and `criteria` tables. Confirm these tables exist in prior migrations (not created by this migration). | BD-008 — ALTER TABLE on non-existent table causes migration failure. |
| W14-B-003-R04 | Verify the cascade is bidirectional: setting `excluded = false` (un-exclusion) must also propagate to children. Inspect trigger code: `OLD.excluded IS DISTINCT FROM NEW.excluded` correctly fires on both true→false and false→true transitions. Confirm test coverage includes un-exclusion path. | BD-003 — one-way cascade without un-exclusion creates stuck state in the UI. |

---

### TASK-W14-B-004
**File**: `apps/maturion-maturity-legacy/supabase/migrations/20260305000008_wave14_new_tables_rls.sql`
**Builder**: schema-builder
**Gap / FR / TR**: GAP-W15 (cross-cutting) / FR-089 to FR-102 / TR-089 to TR-102

#### iaa_trigger_category
`AAWP_MAT` — Cross-cutting RLS consolidation for all Wave 14 org-scoped tables.

#### task_summary
Adds org-isolation SELECT RLS policies for the full set of Wave 14 tables:
`audit_invitations`, `domain_assignments`, `criteria_evaluations`, `evaluation_overrides`,
`criteria_level_descriptors`, `audit_reports`, `aggregate_scores`.
Also grants `SELECT` on `maturity_levels` to authenticated users (global reference table).

> **NOTE**: This migration (sequence `000008`) references tables created by migrations
> `000004` through `000007` (`criteria_evaluations`, `evaluation_overrides`,
> `criteria_level_descriptors`, `audit_reports`, `aggregate_scores`). These migrations
> are NOT part of Batch A. IAA must verify they exist before this migration can be
> applied safely.

#### required_phases
- **Phase 2** (Alignment)
- **Phase 3** (Assurance work) — full BD-TIER-1 through BD-TIER-6 with dependency emphasis
- **Phase 3.1** (FAIL-ONLY-ONCE)
- **Phase 4** (Merge gate parity + verdict)

#### required_evidence_artifacts
| Artifact | Location | Required For |
|---------|----------|-------------|
| PREHANDOVER proof | PR bundle root | CERT-001, CORE-016 |
| Session memory (schema-builder) | `.agent-workspace/schema-builder/memory/` | CERT-002 |
| Migrations 000004–000007 present | `apps/maturion-maturity-legacy/supabase/migrations/` | W14-B-004-R01 |
| Migration file present | `apps/maturion-maturity-legacy/supabase/migrations/20260305000008_wave14_new_tables_rls.sql` | BD-001 |

#### applicable_overlays
- **Universal Ceremony Gate** (CERT-001 through CERT-004)
- **BUILD_DELIVERABLE Overlay** — BD-TIER-1 through BD-TIER-6

#### specific_rules

| Rule ID | Rule | Rationale |
|---------|------|-----------|
| W14-B-004-R01 | **HARD CHECK — DEPENDENCY VERIFICATION**: Confirm migrations `20260305000004_wave14_evaluations.sql`, `20260305000005_wave14_level_descriptors.sql`, `20260305000006_wave14_audit_reports.sql`, and `20260305000007_wave14_scoring_tables.sql` ALL exist in the migrations directory. If ANY of these are absent, this RLS migration cannot apply safely (it will fail with "table does not exist"). | BD-005 — broken chain; migration 000008 is a downstream consumer of 000004–000007. |
| W14-B-004-R02 | Verify that the RLS policies added here do NOT duplicate policies already created by earlier migrations (000001, 000000). The `IF NOT EXISTS` guards on policy names are present for `audit_invitations` and `domain_assignments`. Confirm the policy NAME in this migration (`audit_invitations_org_select`) is distinct from the policy name in migration 000001 (`audit_invitations_select`) — Postgres will treat them as two separate policies. IAA must flag if duplicate policies create an unintended union condition. | BD-022 — duplicate RLS policies with slightly different names create additive policy logic, which may be correct or may be unintended. |
| W14-B-004-R03 | Verify that `mps_assignments` (created in migration 000001) is NOT missing from this consolidation migration. The migration covers `domain_assignments` twice but `mps_assignments` is absent from `20260305000008`. If `mps_assignments` RLS is intended to be covered only by migration 000001, confirm this is a deliberate omission and flag in the audit. | BD-015 — RLS gaps on assignment tables are security vulnerabilities. |
| W14-B-004-R04 | Verify `GRANT SELECT ON public.maturity_levels TO authenticated` is safe: confirm `maturity_levels` contains no PII or org-specific data that should be restricted. It should be a global reference table. | BD-019 — data classification compliance. |

---

### TASK-W14-B-005
**File**: `modules/mat/frontend/src/App.tsx`
**Builder**: ui-builder
**Gap / FR / TR**: GAP-W01 / FR-089 / TR-089

#### iaa_trigger_category
`AAWP_MAT` — Frontend routing change delivering OnboardingGuard with testability sentinel.

#### task_summary
`App.tsx` now includes an `OnboardingGuard` component that:
1. Reads `useUserProfile()` to check for `profile.organisation_id`
2. Redirects to `/onboarding` if no organisation is linked
3. Renders `<span data-testid="onboarding-guard" style={{ display: 'none' }} />` as a testability sentinel when the guard passes
4. Wraps all protected app routes inside `<OnboardingGuard>`

#### required_phases
- **Phase 2** (Alignment)
- **Phase 3** (Assurance work) — BD-TIER-1 through BD-TIER-6
- **Phase 3.1** (FAIL-ONLY-ONCE)
- **Phase 4** (Merge gate parity + verdict)

#### required_evidence_artifacts
| Artifact | Location | Required For |
|---------|----------|-------------|
| PREHANDOVER proof | PR bundle root | CERT-001, CORE-016 |
| Session memory (ui-builder) | `.agent-workspace/ui-builder/memory/` | CERT-002 |
| Test evidence — T-W14-UX-001a GREEN | CI output | BD-011 |
| `App.tsx` diff showing OnboardingGuard | PR diff | BD-001 |

#### applicable_overlays
- **Universal Ceremony Gate** (CERT-001 through CERT-004)
- **BUILD_DELIVERABLE Overlay** — BD-TIER-1 through BD-TIER-6

#### specific_rules

| Rule ID | Rule | Rationale |
|---------|------|-----------|
| W14-B-005-R01 | Verify the `OnboardingGuard` route nesting is correct: the `/onboarding` route must be OUTSIDE the `OnboardingGuard` wrapper. If `/onboarding` is inside `OnboardingGuard`, a user without an org will be redirected from `/onboarding` back to `/onboarding` in an infinite loop. | BD-003 — infinite redirect loop is a P0 functional failure. |
| W14-B-005-R02 | Verify `useUserProfile()` returns a profile object that exposes `organisation_id`. Confirm the hook type definition includes this field. If the hook returns a shape that lacks `organisation_id`, the guard condition `!profile?.organisation_id` will always be `true` (falsy undefined), creating a permanent redirect loop for all users. | BD-005 — wiring: hook return type must match guard's expected field. |
| W14-B-005-R03 | Verify the `isLoading || isFetching` guard prevents false redirects during profile fetch. If the guard redirects before the profile is loaded (treating `undefined` as missing org), all users will be briefly redirected to `/onboarding` on every app load. | BD-003 — race-condition redirect is a UX P0. |
| W14-B-005-R04 | Verify test T-W14-UX-001a is GREEN: `App.tsx` contains `data-testid="onboarding-guard"` string. | BD-011 — zero test failures. |

---

### TASK-W14-B-006
**File**: `modules/mat/frontend/src/pages/OnboardingPage.tsx`
**Builder**: ui-builder
**Gap / FR / TR**: GAP-W01 / FR-089 / TR-089

#### iaa_trigger_category
`AAWP_MAT` — Frontend page delivering the two-step onboarding wizard with testability markers.

#### task_summary
`OnboardingPage.tsx` implements a two-step onboarding wizard:
- **Step 1**: Full name entry form (`data-testid="onboarding-step-1"`)
- **Step 2**: Organisation name entry form (`data-testid="onboarding-step-2"`)
- On Step 2 submit: calls `useCreateOrganisation().mutateAsync()` then navigates to `/`
- Guards: redirects to `/` if user already has an `organisation_id`
- Error display: renders error messages in a `role="alert"` element

#### required_phases
- **Phase 2** (Alignment)
- **Phase 3** (Assurance work) — BD-TIER-1 through BD-TIER-6
- **Phase 3.1** (FAIL-ONLY-ONCE)
- **Phase 4** (Merge gate parity + verdict)

#### required_evidence_artifacts
| Artifact | Location | Required For |
|---------|----------|-------------|
| PREHANDOVER proof | PR bundle root | CERT-001, CORE-016 |
| Session memory (ui-builder) | `.agent-workspace/ui-builder/memory/` | CERT-002 |
| Test evidence — T-W14-UX-001b GREEN | CI output | BD-011 |
| Test evidence — T-W14-UX-001c GREEN | CI output | BD-011 |
| `OnboardingPage.tsx` diff showing step forms | PR diff | BD-001 |

#### applicable_overlays
- **Universal Ceremony Gate** (CERT-001 through CERT-004)
- **BUILD_DELIVERABLE Overlay** — BD-TIER-1 through BD-TIER-6

#### specific_rules

| Rule ID | Rule | Rationale |
|---------|------|-----------|
| W14-B-006-R01 | Verify `useCreateOrganisation` hook exists and is importable from `../lib/hooks/useSettings`. This import must succeed; if the hook does not exist, the page fails to compile. | BD-005 — end-to-end wiring: page depends on this hook. |
| W14-B-006-R02 | Verify the `useCreateOrganisation` hook wires to a Supabase INSERT into `public.organisations` AND updates `public.profiles` with the new `organisation_id`. Without the profiles update, `useUserProfile()` will still return `organisation_id: null` after onboarding, causing `OnboardingGuard` to redirect back to `/onboarding` in a loop. | BD-003 — the post-onboarding guard re-entry loop is a P0 functional failure. |
| W14-B-006-R03 | Verify `fullName` from Step 1 is consumed by the Step 2 `mutateAsync` call (passed as `ownerFullName`). The Step 1 name must not be silently dropped between steps. | BD-002 — no stub data paths; collected data must flow to the mutation. |
| W14-B-006-R04 | Verify the `Back` button on Step 2 returns to Step 1 without clearing `fullName` state. If `setFullName('')` is called on back navigation, the user must re-enter their name, which is a UX regression. | BD-020 — clean UX behaviour. |
| W14-B-006-R05 | Verify tests T-W14-UX-001b and T-W14-UX-001c are GREEN: `OnboardingPage.tsx` contains `data-testid="onboarding-step-1"` and `data-testid="onboarding-step-2"`. | BD-011 — zero test failures. |

---

## Step 0.4 (continued) — Cross-Cutting Assurance Requirements

These requirements apply to the PR as a whole (all six tasks together), not to any single task.

### Cross-Cut-001 — PREHANDOVER Proof Coverage
The PREHANDOVER proof must reference ALL six tasks (TASK-W14-B-001 through TASK-W14-B-006).
A single PREHANDOVER proof covering all tasks is acceptable.
The `iaa_audit_token` field must be pre-populated with the expected token reference
`IAA-session-NNN-wave14-batchA-YYYYMMDD-PASS`.

### Cross-Cut-002 — Session Memory Coverage
At minimum one session memory file must exist for each producing builder:
- `schema-builder` session memory covering TASK-W14-B-001 through TASK-W14-B-004
- `ui-builder` session memory covering TASK-W14-B-005 and TASK-W14-B-006

### Cross-Cut-003 — Test Suite Full Pass
All tests in `modules/mat/tests/wave14/` must pass:
- `onboarding-guard.test.ts` — T-W14-UX-001a through T-W14-UX-001e: all GREEN
- `invite-auditor.test.ts` — T-W14-UX-002a through T-W14-UX-002g: all GREEN
- `invite-evidence-submitter.test.ts` — T-W14-UX-004a through T-W14-UX-004e: all GREEN

Zero test failures. Zero skipped. Zero `.skip()` or `.only()` calls.

### Cross-Cut-004 — Migration Sequence Integrity
IAA must verify the migration file sequence is contiguous and all dependency migrations
for `20260305000008` are present:
- `20260305000000` ✅ (Batch A)
- `20260305000001` ✅ (Batch A)
- `20260305000002` ✅ (Batch A)
- `20260305000003` — must exist or be declared absent with justification
- `20260305000004` — must exist (dependency of 000008)
- `20260305000005` — must exist (dependency of 000008)
- `20260305000006` — must exist (dependency of 000008)
- `20260305000007` — must exist (dependency of 000008)
- `20260305000008` ✅ (Batch A)

### Cross-Cut-005 — IAA Watch Points (Pre-Identified Risks)
These specific risks were identified during Pre-Brief file inspection and MUST be
investigated with full BD-tier depth during Phase 3 assurance:

| Watch Point ID | Location | Risk | Severity |
|---------------|----------|------|----------|
| WP-001 | `20260305000000_wave14_onboarding_support.sql` line 38 | `VALUES (NEW.id, NEW.id)` — `NEW.id` in organisations trigger context is an org UUID, not a user UUID. Inserting an org UUID into a `user_id UUID REFERENCES auth.users` column is a semantic bug that will cause FK violation or data corruption. | **P0 — Functional Failure** |
| WP-002 | `20260305000000_wave14_onboarding_support.sql` | `onboarding_completions` has SELECT policy only. No INSERT policy. Users completing onboarding cannot write their own completion row without an INSERT policy or a SECURITY DEFINER path. | **P0 — Security/Functional Block** |
| WP-003 | `20260305000001_wave14_invitations_assignments.sql` | `audit_invitations`, `domain_assignments`, `mps_assignments`, `criteria_assignments` have SELECT policies only. All four tables need INSERT policies (and `audit_invitations` needs an UPDATE policy for status transitions). SELECT-only RLS blocks the primary workflow. | **P0 — Functional Block** |
| WP-004 | `20260305000008_wave14_new_tables_rls.sql` | Migration 000008 references `criteria_evaluations`, `evaluation_overrides`, `criteria_level_descriptors`, `audit_reports`, `aggregate_scores` — tables created by migrations 000004–000007 which are NOT in Batch A. If those migrations are absent, 000008 will fail on deployment. | **P1 — Dependency Risk** |
| WP-005 | `20260305000008_wave14_new_tables_rls.sql` | Policy name duplication: migration 000001 creates `audit_invitations_select` and `domain_assignments_select`; migration 000008 creates `audit_invitations_org_select` and `domain_assignments_org_select`. Two SELECT policies on the same table create an additive RLS union. Verify this is intentional. | **P1 — RLS Semantic Risk** |
| WP-006 | `App.tsx` `OnboardingGuard` | Route nesting: verify `/onboarding` is NOT inside the `OnboardingGuard` wrapper (infinite redirect loop risk). | **P0 — Functional Failure** |
| WP-007 | `OnboardingPage.tsx` → `useCreateOrganisation` | Verify the hook updates `profiles.organisation_id` after org creation. Without this, `OnboardingGuard` will loop users back to `/onboarding` after they complete it. | **P0 — Functional Failure** |

> **IAA DIRECTIVE**: Watch Points WP-001, WP-002, WP-003, WP-006, and WP-007 are classified
> as **P0 functional failures**. If any of these are confirmed as unresolved defects during
> Phase 3 assurance, IAA MUST issue a REJECTION-PACKAGE citing the specific watch point(s).
> The builder must resolve ALL P0 watch points before a ASSURANCE-TOKEN can be issued.

---

## Step 0.5 — Confirmation

This Pre-Brief artifact was generated by IAA in response to Foreman session-140's retroactive
Pre-Brief request. It covers all six qualifying TASK-W14-B-001 through TASK-W14-B-006 tasks.

**Pre-Brief completeness check**:
- [x] All 6 qualifying tasks declared
- [x] Per-task `iaa_trigger_category` assigned
- [x] Per-task `required_phases` declared
- [x] Per-task `required_evidence_artifacts` listed
- [x] Per-task `applicable_overlays` identified
- [x] Per-task `specific_rules` defined (including file-inspection-based rules)
- [x] Cross-cutting requirements declared
- [x] IAA Watch Points (pre-identified risks) listed with severity

**Status after Pre-Brief**: PRE-BRIEF COMPLETE — awaiting Phase 2–4 invocation.

**STOP-AND-FIX mandate**: ACTIVE. No PR may be opened until IAA Phases 2–4 complete and
an ASSURANCE-TOKEN is issued. POLC breach (SELF-BREACH-SESSION-140-001) does not waive
this requirement — it reinforces it.

---

*Generated by: independent-assurance-agent*
*Pre-Brief ID: IAA-PREBRIEF-W14-BATCHA-20260305*
*Adoption Phase at generation: PHASE_B_BLOCKING*
*Authority: CS2 only (@APGI-cmy)*
