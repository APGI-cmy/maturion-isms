# 05 — Test Identity and Role Matrix
<!-- LFV Template v1.0.0 | Authority: LIVE_FUNCTIONAL_VERIFICATION_CANON.md §4 | Issue: maturion-isms#1617 -->
<!-- PIT instantiation | Issue: maturion-isms#1619 | PR: #1624 -->

## Header

| Field | Value |
|-------|-------|
| Module | PIT (Project Implementation Tracker) |
| Wave | pit-lfv-package-20260512 |
| PR | #1624 |
| Issue | maturion-isms#1619 |
| Date | 2026-05-12 |
| Author | foreman-v2-agent |
| Status | DESIGN ARTIFACT — not a deployment claim |

---

## Purpose

This matrix defines all test identities required for PIT Live Functional Verification. One identity is required for each of the 7 PIT roles (including `unauthenticated`). All identities are test-only, scoped to the "PIT Test Organisation", and must be pre-seeded before verification begins.

---

## Test Organisation

| Field | Value |
|-------|-------|
| Organisation Name | PIT Test Organisation |
| Organisation Slug | `pit-test-org` |
| `org_id` | Seeded UUID — must match `TEST_ORG_ID` secret |
| Status | Active |
| Purpose | Isolates all LFV test data from production organisations |

---

## Identity 1: cs2_admin

| Field | Value |
|-------|-------|
| **Email** | `pit.cs2admin@test.maturion.dev` |
| **Role** | `cs2_admin` |
| **Scope** | Cross-organisation system access |
| **Access Summary** | Full system access; audit log (all orgs); QA dashboard; cross-org user management; report history (all orgs) |
| **Denied Actions** | None (full system authority) |
| **LFV Journeys** | Journey 13 (Audit Log), Journey 14 (QA Dashboard — authorised) |
| **Secret Reference** | `PIT_TEST_CS2_ADMIN_EMAIL` / `PIT_TEST_CS2_ADMIN_PASSWORD` |

| Context | Access |
|---------|--------|
| Interactive Coding Agent | ❌ No — secrets not available in agent session |
| GitHub Actions | ✅ Yes — via `${{ secrets.PIT_TEST_CS2_ADMIN_EMAIL }}` |
| Vercel Automation | N/A |
| Supabase Runtime | ✅ Yes — direct Supabase Auth login |
| CS2 Manual | ✅ Yes — Johan Ras has direct access |

---

## Identity 2: org_admin

| Field | Value |
|-------|-------|
| **Email** | `pit.orgadmin@test.maturion.dev` |
| **Role** | `org_admin` |
| **Scope** | Full management within "PIT Test Organisation" |
| **Access Summary** | User management; invite users; org settings; all project data in org; org-scoped audit log |
| **Denied Actions** | Cross-org data; QA dashboard; cs2_admin features |
| **LFV Journeys** | Org management paths; org-scoped audit log verification |
| **Secret Reference** | `PIT_TEST_ORG_ADMIN_EMAIL` / `PIT_TEST_ORG_ADMIN_PASSWORD` |

| Context | Access |
|---------|--------|
| Interactive Coding Agent | ❌ No — secrets not available in agent session |
| GitHub Actions | ✅ Yes — via `${{ secrets.PIT_TEST_ORG_ADMIN_EMAIL }}` |
| Vercel Automation | N/A |
| Supabase Runtime | ✅ Yes — direct Supabase Auth login |
| CS2 Manual | ✅ Yes — Johan Ras has direct access |

---

## Identity 3: project_manager

| Field | Value |
|-------|-------|
| **Email** | `pit.pm@test.maturion.dev` |
| **Role** | `project_manager` |
| **Scope** | Project creation and full management within "PIT Test Organisation" |
| **Access Summary** | Create/edit/delete projects; create milestones, deliverables, tasks; assign tasks; review and approve/return evidence; generate reports; view timeline; request/approve timeline overrides |
| **Denied Actions** | User management (org_admin only); audit log (cs2_admin/org_admin only); QA dashboard (cs2_admin only) |
| **LFV Journeys** | Journey 3 (Project Creation), 4 (Milestone), 5 (Deliverable), 6 (Task Creation/Assign), 7 (Timeline Load), 8 (Timeline Drag), 10 (Evidence Review), 12 (Report Generation), 13 (partial) |
| **Secret Reference** | `PIT_TEST_PROJECT_MANAGER_EMAIL` / `PIT_TEST_PROJECT_MANAGER_PASSWORD` |
| **Primary Happy-Path Role** | Yes — most LFV journeys use this identity as primary actor |

| Context | Access |
|---------|--------|
| Interactive Coding Agent | ❌ No — secrets not available in agent session |
| GitHub Actions | ✅ Yes — via `${{ secrets.PIT_TEST_PROJECT_MANAGER_EMAIL }}` |
| Vercel Automation | N/A |
| Supabase Runtime | ✅ Yes — direct Supabase Auth login |
| CS2 Manual | ✅ Yes — Johan Ras has direct access |

---

## Identity 4: team_leader

| Field | Value |
|-------|-------|
| **Email** | `pit.tl@test.maturion.dev` |
| **Role** | `team_leader` |
| **Scope** | Task oversight and evidence review within assigned projects |
| **Access Summary** | View all tasks in assigned projects; edit task status; review evidence (approve/return within assigned project scope); view milestones and deliverables; view timeline |
| **Denied Actions** | Project creation; milestone/deliverable creation; report generation; user management; audit log; QA dashboard |
| **LFV Journeys** | Task status change (secondary actor); evidence review (secondary actor) |
| **Secret Reference** | `PIT_TEST_TEAM_LEADER_EMAIL` / `PIT_TEST_TEAM_LEADER_PASSWORD` |

| Context | Access |
|---------|--------|
| Interactive Coding Agent | ❌ No — secrets not available in agent session |
| GitHub Actions | ✅ Yes — via `${{ secrets.PIT_TEST_TEAM_LEADER_EMAIL }}` |
| Vercel Automation | N/A |
| Supabase Runtime | ✅ Yes — direct Supabase Auth login |
| CS2 Manual | ✅ Yes — Johan Ras has direct access |

---

## Identity 5: contributor

| Field | Value |
|-------|-------|
| **Email** | `pit.contributor@test.maturion.dev` |
| **Role** | `contributor` |
| **Scope** | Task completion and evidence submission within assigned tasks |
| **Access Summary** | View assigned projects; view and update status of assigned tasks; upload evidence to assigned tasks; view notifications; accept/dismiss AIMC suggestions for own tasks |
| **Denied Actions** | Project/milestone/deliverable creation; task creation; evidence review/approval; report generation; user management; audit log; QA dashboard |
| **LFV Journeys** | Journey 6 (receives task assignment), Journey 9 (Evidence Upload), Journey 11 (Notifications), Journey 16 (AIMC Suggestions) |
| **Secret Reference** | `PIT_TEST_CONTRIBUTOR_EMAIL` / `PIT_TEST_CONTRIBUTOR_PASSWORD` |

| Context | Access |
|---------|--------|
| Interactive Coding Agent | ❌ No — secrets not available in agent session |
| GitHub Actions | ✅ Yes — via `${{ secrets.PIT_TEST_CONTRIBUTOR_EMAIL }}` |
| Vercel Automation | N/A |
| Supabase Runtime | ✅ Yes — direct Supabase Auth login |
| CS2 Manual | ✅ Yes — Johan Ras has direct access |

---

## Identity 6: viewer

| Field | Value |
|-------|-------|
| **Email** | `pit.viewer@test.maturion.dev` |
| **Role** | `viewer` |
| **Scope** | Read-only access to assigned project data only |
| **Access Summary** | View project overview, task list, milestones, deliverables for assigned projects; read-only; no write operations permitted |
| **Denied Actions** | ALL write operations (project/milestone/deliverable/task create/edit/delete); evidence upload; evidence review; report generation; task assignment; notifications management; all admin routes; QA dashboard |
| **LFV Journeys** | Journey 14 (QA Dashboard — denied), Journey 15 (Permission-Denied Path — primary actor) |
| **Secret Reference** | `PIT_TEST_VIEWER_EMAIL` / `PIT_TEST_VIEWER_PASSWORD` |
| **Critical Role for Security Verification** | Yes — all permission-denied paths must be verified with this identity |

| Context | Access |
|---------|--------|
| Interactive Coding Agent | ❌ No — secrets not available in agent session |
| GitHub Actions | ✅ Yes — via `${{ secrets.PIT_TEST_VIEWER_EMAIL }}` |
| Vercel Automation | N/A |
| Supabase Runtime | ✅ Yes — direct Supabase Auth login |
| CS2 Manual | ✅ Yes — Johan Ras has direct access |

---

## Identity 7: unauthenticated

| Field | Value |
|-------|-------|
| **Email** | No account |
| **Role** | `unauthenticated` (no JWT; no session) |
| **Scope** | Public routes only |
| **Access Summary** | Access to `/`, `/login`, `/signup`, `/forgot-password`, `/reset-password`, `/verify-email` only |
| **Denied Actions** | ALL protected routes (`/dashboard`, `/projects`, `/my-work`, `/admin/*`, `/qa-dashboard`, `/notifications`, `/profile`, etc.) |
| **LFV Journeys** | Journey 1 (starting state — unauthenticated → login) |
| **Secret Reference** | None required |

| Context | Access |
|---------|--------|
| Interactive Coding Agent | ✅ Yes — no credentials needed |
| GitHub Actions | ✅ Yes — no credentials needed |
| Vercel Automation | ✅ Yes — bypass token only needed |
| Supabase Runtime | N/A — unauthenticated |
| CS2 Manual | ✅ Yes — any browser in incognito mode |

---

## Role Access Matrix Summary

| Route / Action | cs2_admin | org_admin | project_manager | team_leader | contributor | viewer | unauthenticated |
|----------------|-----------|-----------|-----------------|-------------|-------------|--------|----------------|
| `/login` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| `/dashboard` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | 🔒 → `/login` |
| `/projects` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ (read) | 🔒 |
| `/projects/new` | ✅ | ✅ | ✅ | ❌ denied | ❌ denied | ❌ denied | 🔒 |
| `/projects/:id/tasks` | ✅ | ✅ | ✅ | ✅ | ✅ (assigned) | ✅ (read) | 🔒 |
| `/projects/:id/evidence` | ✅ | ✅ | ✅ (review) | ✅ (review) | ✅ (upload) | ✅ (read) | 🔒 |
| `/projects/:id/reports` | ✅ | ✅ | ✅ (generate) | ✅ (view) | ✅ (view) | ✅ (view) | 🔒 |
| `/projects/:id/timeline` | ✅ | ✅ | ✅ (drag) | ✅ (view) | ✅ (view) | ✅ (view) | 🔒 |
| `/my-work` | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ denied | 🔒 |
| `/notifications` | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ denied | 🔒 |
| `/admin/org` | ✅ | ✅ | ❌ denied | ❌ denied | ❌ denied | ❌ denied | 🔒 |
| `/admin/users` | ✅ | ✅ | ❌ denied | ❌ denied | ❌ denied | ❌ denied | 🔒 |
| `/admin/audit-log` | ✅ (all orgs) | ✅ (own org) | ❌ denied | ❌ denied | ❌ denied | ❌ denied | 🔒 |
| `/qa-dashboard` | ✅ | ❌ denied | ❌ denied | ❌ denied | ❌ denied | ❌ denied | 🔒 |
| POST `/rest/v1/projects` | ✅ | ✅ | ✅ | ❌ 403 RLS | ❌ 403 RLS | ❌ 403 RLS | ❌ 401 |
| POST `/storage/v1/object/evidence/...` | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ 403 RLS | ❌ 401 |
| POST `/functions/v1/generate-report` | ✅ | ✅ | ✅ | ❌ 403 | ❌ 403 | ❌ 403 | ❌ 401 |
| POST `/functions/v1/pit-task-advisor` | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ 403 | ❌ 401 |

**Legend**: ✅ = permitted | ❌ denied = permission-denied screen shown | 🔒 = redirected to `/login` | ❌ 403 = HTTP 403 from RLS/Edge Function | ❌ 401 = HTTP 401 unauthenticated

---

## Required Seed Fixtures

These fixture files must be present in CI and committed to the repository:

| Fixture File | Path | Size Limit | MIME Type | Purpose |
|-------------|------|-----------|-----------|---------|
| `test-evidence.pdf` | `modules/pit/05-live-functional-verification/fixtures/test-evidence.pdf` | ≤50KB | `application/pdf` | Journey 9: Primary evidence upload |
| `test-evidence-image.png` | `modules/pit/05-live-functional-verification/fixtures/test-evidence-image.png` | ≤100KB | `image/png` | Journey 9: Alternate evidence type |
| `test-evidence-spreadsheet.xlsx` | `modules/pit/05-live-functional-verification/fixtures/test-evidence-spreadsheet.xlsx` | ≤50KB | `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet` | Journey 9: Alternate evidence type |

---

## GitHub Actions Secret Reference Table

| Secret Name | Identity | Field | When Required |
|-------------|----------|-------|---------------|
| `PIT_TEST_CS2_ADMIN_EMAIL` | cs2_admin | Email address | Journey 13, 14 |
| `PIT_TEST_CS2_ADMIN_PASSWORD` | cs2_admin | Password | Journey 13, 14 |
| `PIT_TEST_ORG_ADMIN_EMAIL` | org_admin | Email address | Org management paths |
| `PIT_TEST_ORG_ADMIN_PASSWORD` | org_admin | Password | Org management paths |
| `PIT_TEST_PROJECT_MANAGER_EMAIL` | project_manager | Email address | Journeys 3–8, 10, 12 |
| `PIT_TEST_PROJECT_MANAGER_PASSWORD` | project_manager | Password | Journeys 3–8, 10, 12 |
| `PIT_TEST_TEAM_LEADER_EMAIL` | team_leader | Email address | Secondary paths |
| `PIT_TEST_TEAM_LEADER_PASSWORD` | team_leader | Password | Secondary paths |
| `PIT_TEST_CONTRIBUTOR_EMAIL` | contributor | Email address | Journeys 6, 9, 11, 16 |
| `PIT_TEST_CONTRIBUTOR_PASSWORD` | contributor | Password | Journeys 6, 9, 11, 16 |
| `PIT_TEST_VIEWER_EMAIL` | viewer | Email address | Journeys 14, 15 |
| `PIT_TEST_VIEWER_PASSWORD` | viewer | Password | Journeys 14, 15 |
| `TEST_ORG_ID` | All | Org UUID | All journeys requiring org context |
| `TEST_ORG_SLUG` | All | Org slug | URL construction, org-context lookups |
| `SUPABASE_URL` | All | Supabase project URL | All API/auth calls |
| `SUPABASE_ANON_KEY` | All | Supabase anon key | All unauthenticated + pre-auth API calls |
| `BYPASS_TOKEN` | CI/Automation | Vercel bypass | All Playwright navigation |
| `AIMC_TEST_ENABLED` | CI/Automation | Feature flag | Journey 16 (AIMC flow) |

---

## Seed Script Requirement

Before running LFV, a seed script must be executed (or confirmed as already run) that:
1. Creates "PIT Test Organisation" with `slug = 'pit-test-org'` if not exists
2. Creates all 6 test users in Supabase Auth with confirmed emails
3. Creates `user_org_memberships` entries linking each user to the org with correct role
4. Creates a "Baseline Project" (optional, for read-path verification without side effects)
5. Does NOT create ephemeral test data that pollutes subsequent verification runs (use unique names with timestamp suffix for created-object journeys)

**Seed script location** (when created): `modules/pit/05-live-functional-verification/scripts/seed-test-data.ts`

---

*LFV Template v1.0.0 | PIT Module | Wave pit-lfv-package-20260512 | 2026-05-12*
