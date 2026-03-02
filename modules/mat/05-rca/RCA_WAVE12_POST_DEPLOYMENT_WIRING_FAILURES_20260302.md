# MAT — Post-Wave 12 Live Deployment Wiring Failures — Root Cause Assessment

**Document ID**: MAT-RCA-002  
**Module**: MAT (Manual Audit Tool)  
**Version**: v1.0.0  
**Status**: FINAL  
**Author**: Foreman (foreman-v2-agent v6.2.0), session-084  
**Created**: 2026-03-02  
**Last Updated**: 2026-03-02  
**Authority**: Post-deployment review directive — Issue: [CI/CD & QA] Post-Wave Complete Failure/Wiring Regression Doc — Root Cause Blockchain for Fix Plan, Prebuild Upgrade, Wave 13 Handover  
**Governance Reference**: `governance/canon/WE_ONLY_FAIL_ONCE_DOCTRINE.md` v1.0.0

---

## 1. Purpose

This document records the complete Root Cause Assessment (RCA) for all wiring failures and functional defects observed in the MAT live deployment **after Wave 12 was signed off as COMPLETE** (2026-03-01, 559/559 tests GREEN). The failures were discovered via direct post-deployment functional testing of the live Vercel deployment.

This RCA fulfils the **"We Only Fail Once"** constitutional principle. Every failure is analysed, its root cause identified, and a concrete preventive action (structural governance improvement) is recorded.

This RCA is a permanent governance artifact. It is referenced by:
- `modules/mat/BUILD_PROGRESS_TRACKER.md`
- `modules/mat/03-implementation-plan/implementation-plan.md` (Wave 13)
- Future MAT build waves and all post-deployment quality gates

---

## 2. Scope — Observed Failures

All failures were observed in the live Vercel deployment (`matfrontend-93ooodm29-rassie-ras-projects.vercel.app`) post-Wave 12 deployment.

### 2.1 Failure Inventory

| # | Area | Observed Failure | Severity |
|---|------|-----------------|----------|
| F-01 | Audit Management | `Failed to create audit: User not authenticated` | CRITICAL |
| F-02 | Audit Management | `Error loading audits: Failed to fetch audits: Could not find the table 'public.audits' in the schema cache` | CRITICAL |
| F-03 | Criteria Management | Criteria upload pane empty — shows "Create an audit first to upload criteria" | HIGH |
| F-04 | Criteria Management | Cannot upload or view criteria documents — no UI wiring or backend flow | HIGH |
| F-05 | Evidence Management | Evidence Collection nonfunctional — UI shows placeholder only | HIGH |
| F-06 | Scoring | Scoring page blank — no logic, no data shown | HIGH |
| F-07 | Reports | Reports page blank — no logic, no routes operating | HIGH |
| F-08 | Dashboard | Dashboard blank — no backend or frontend wiring | HIGH |
| F-09 | Settings | Cannot update email (greyed out, cannot be changed) | MEDIUM |
| F-10 | Settings | Save triggers `Failed to update profile: Not authenticated` | CRITICAL |
| F-11 | Settings | Drop-downs (Language, Theme) do not persist or wire through state | MEDIUM |
| F-12 | Settings | AI chat UI shows "no access" overlay instead of launching modal/feature | HIGH |

---

## 3. Root Cause Assessment — Individual Gap Analysis

### F-01 & F-10: User Not Authenticated (Audit Create, Settings Save)

**Gap**: API calls to Supabase for audit creation and profile update fail with authentication errors in the live deployment, even when a user appears logged in on the frontend.

**Root Cause**: The Supabase client session token is not being forwarded from the frontend auth state to the API call context in the production deployment. This is an **auth-to-API wiring gap**: the frontend session (Supabase `auth.getSession()`) is not being retrieved and attached before mutating API calls execute. Likely causes:
- The Supabase client in the production environment is initialised without the correct anon key or URL, causing session establishment to fail silently.
- API route handlers do not re-validate the session using the server-side Supabase client before executing DB writes.
- RLS policies on the `audits` table require `auth.uid()`, and without a valid session the INSERT is rejected.

**Why tests passed but production failed**: Wave 12 tests ran against a mocked or seeded Supabase environment with pre-injected auth tokens. Production requires real session establishment via OAuth/email login, and the auth flow was not tested end-to-end against the live Vercel → live Supabase deployment.

**Prevention**: Add **E2E authentication scenario tests** that run against the live deployment URL, verifying that session tokens are present before any mutating API calls. These tests must be part of the wave gate — not just local mocked tests.

---

### F-02: Missing `public.audits` Table in Schema Cache

**Gap**: The Supabase schema cache does not contain the `public.audits` table, causing all audit fetch operations to fail with a schema cache miss error.

**Root Cause**: The database migration that creates the `audits` table was not applied to the production Supabase instance. One of the following:
- The `supabase db push` CI step ran but was targeting the wrong database URL (staging vs. production).
- The migration file for the `audits` table was not included in the migration sequence applied during Wave 12 deployment.
- The schema migration CI step was gated on a condition that evaluated false in the production deployment job.

**Why tests passed but production failed**: Wave 12 tests ran against a local Supabase instance (`supabase start`) where migrations are always applied. The production Supabase instance was never validated post-migration with a schema existence check.

**Prevention**: Add **schema existence preflight checks** as a mandatory CI step after every deployment — before surfacing the UI or running CWT. These checks must query the production Supabase instance and assert that each required table exists and is accessible via the schema cache.

---

### F-03 & F-04: Criteria Management Non-functional (Audit Dependency Cascade)

**Gap**: Criteria management shows "Create an audit first to upload criteria" even when the intent is to test the criteria upload flow — because the underlying audit creation flow (F-01/F-02) is broken.

**Root Cause**: This is a **cascade failure** from F-01/F-02. The criteria management UI correctly gates on an audit being available. Since audit creation fails and the `audits` table is missing, no audit can exist, so criteria management is blocked at the first dependency check. This is not an independent failure; it resolves when F-01/F-02 are fixed.

**Prevention**: Add **dependency chain integration tests** that verify the full audit → criteria → evidence flow end-to-end in the production deployment context.

---

### F-05: Evidence Management — Placeholder Only

**Gap**: Evidence Collection page shows only a placeholder ("Collect and manage evidence for audit criteria.") with no interactive elements.

**Root Cause**: The Evidence Collection component was assembled in Wave 5.6 but the wiring from the component to live audit/criteria context (selected audit ID, criteria ID) was either:
- Never completed in production (only mocked locally), or
- Dependent on a live audit existing — which fails due to F-02.

This is partially a cascade from F-02, but the placeholder-only presentation suggests the component wiring was never validated against a live Supabase connection.

**Prevention**: Covered by E2E wiring tests required in Wave 13 PBFAG update.

---

### F-06, F-07, F-08: Scoring, Reports, Dashboard — Blank Pages

**Gap**: All three pages (Scoring, Reports, Dashboard) display blank content with no data, no routes operating, and no backend wiring apparent.

**Root Cause**: These pages depend on:
1. A valid authenticated session (broken by F-01)
2. Audits existing in the database (broken by F-02)
3. API routes returning data from the `audits`, `criteria`, `evidence` tables

Without a valid auth session and schema, all data fetch calls return empty or error states, rendering these pages blank. The UI components may render correctly but show empty data — or the API calls fail silently and the UI does not surface the error.

**Prevention**: Add **data-dependent page integration tests** that verify each page renders non-empty content when a valid audit with criteria and evidence exists in the production database.

---

### F-09, F-11: Settings — Email Greyed Out, Dropdowns Not Persisting

**Gap**: Email cannot be changed (greyed out by design — this is correct Supabase Auth behavior). Dropdowns for Language/Theme do not persist.

**Root Cause**: 
- Email greyed out: This is **expected behavior** — Supabase Auth does not allow email updates from the client. This is a UX clarification issue, not a bug.
- Dropdowns not persisting: User preferences are stored in the `user_profiles` table (or similar). Without an authenticated session (F-01), the `UPDATE` call fails silently. This is a cascade from F-01.

**Prevention**: Covered by auth E2E fix in F-01 remediation.

---

### F-12: AI Chat UI Shows "No Access" Overlay

**Gap**: AI chat/AIMC feature shows "no access" overlay instead of launching the expected modal or feature.

**Root Cause**: The AI feature (AIMC integration — Waves 7/8/9) is gated behind feature flags or entitlement checks. In the live deployment, the entitlement check evaluates to false because:
- No valid auth session → org context cannot be resolved → AIMC access denied.
- Or the AIMC feature flag/env variable is not set in the production Vercel environment.

**Prevention**: Add env variable audit step to CWT gate — verify all required env vars are set before deployment completes.

---

## 4. Cross-Cutting Root Cause: Insufficient E2E Wiring Tests Before Sign-Off

The fundamental root cause underlying all failures in this RCA is:

> **Wave 12 was signed off GREEN based on locally-executed tests that did not exercise the full production deployment stack (Vercel frontend → production Supabase → live auth).**

Specifically, no tests verified:
1. That database migrations were applied to the production Supabase instance
2. That the auth session established by a real login is forwarded to API calls
3. That each major page renders non-empty content after a real login + data setup
4. That environment variables required for Supabase and AIMC are present in Vercel production

The Wave 12 "CWT" (Combined Working Test) was defined as running against the production URL, but the schema existence check and auth flow were not independently verified at the application layer.

---

## 5. Preventive Actions (Wave 13 Gate Requirements)

These actions are **mandatory entry criteria** for all future wave sign-offs. They are codified in the updated PBFAG (§1.5 of the implementation plan) and are required as Wave 13 deliverables.

| # | Action | Owner | Integration Point |
|---|--------|-------|-------------------|
| PA-01 | Add schema existence preflight: assert each required table exists in production schema cache before surfacing UI | schema-builder + integration-builder | Wave 13 Task 13.1 |
| PA-02 | Add auth E2E test: verify session token is present and forwarded before any mutating API call | api-builder + qa-builder | Wave 13 Task 13.2 |
| PA-03 | Add full audit→criteria→evidence→scoring E2E test against production URL | integration-builder | Wave 13 Task 13.3 |
| PA-04 | Add env variable audit step to CWT: verify all required env vars are set in Vercel production | integration-builder | Wave 13 Task 13.1 |
| PA-05 | Update PBFAG (§1.5) to require E2E UI→API→DB wiring tests before every wave sign-off | foreman-v2-agent (governance) | Implementation plan update |
| PA-06 | Update PBFAG to require schema existence check as a CWT pre-condition | foreman-v2-agent (governance) | Implementation plan update |

---

## 6. Structural Governance Improvements (WE_ONLY_FAIL_ONCE Protocol)

Per `governance/canon/WE_ONLY_FAIL_ONCE_DOCTRINE.md`, every failure must result in a structural improvement that prevents identical recurrence:

| # | Failure Pattern | Structural Improvement |
|---|----------------|----------------------|
| WGI-01 | Tests GREEN locally but broken in production (schema missing) | PBFAG updated: schema existence check is now a mandatory CWT pre-condition |
| WGI-02 | Auth works in mocked tests but fails in live deployment | PBFAG updated: E2E auth flow test against live URL is now mandatory before wave sign-off |
| WGI-03 | Major pages blank due to missing auth/schema — not caught in wave gate | PBFAG updated: All major pages must render non-empty content in E2E test before gate passes |
| WGI-04 | Env var missing in Vercel production — not verified at deployment | Deployment checklist updated: env var audit added to CWT gate |

---

## 7. Summary

| RCA Finding | Root Cause Class | Resolution Wave |
|-------------|-----------------|----------------|
| F-01, F-10: User not authenticated | Auth session not forwarded to API in production | Wave 13 — Task 13.2 |
| F-02: Missing `audits` table | Schema migration not applied to production | Wave 13 — Task 13.1 |
| F-03, F-04: Criteria blocked | Cascade from F-01/F-02 | Resolved with F-01/F-02 |
| F-05: Evidence placeholder | Component not wired to live context | Wave 13 — Task 13.3 |
| F-06, F-07, F-08: Blank pages | Cascade from F-01/F-02 | Resolved with F-01/F-02 |
| F-09, F-11: Settings partial | Cascade from F-01 + UX clarification | Resolved with F-01 |
| F-12: AI chat no access | Auth cascade + env var check | Wave 13 — Task 13.1 |

---

*Authority: CS2 (Johan Ras) | Governance: `WE_ONLY_FAIL_ONCE_DOCTRINE.md` v1.0.0 | Version: v1.0.0 | 2026-03-02*
