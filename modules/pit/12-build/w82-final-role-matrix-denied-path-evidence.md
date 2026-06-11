# PIT Stage 12 W8.2 Final Role Matrix and Denied-Path Evidence

Issue: APGI-cmy/maturion-isms#1774
Wave: pit-stage12-w82-final-verification
Date: 2026-06-11

## Purpose

Record the final actor-based RLS allow/deny matrix and deployed denied-path evidence required for W8.2 full exit verification.

## Non-overclaim

**W8.2 is NOT_READY until every required evidence row in this ledger is completed and passing.**

No W8.2 completion, Stage 12 completion, or PIT FUNCTIONAL_PASS is claimed in this artifact.

---

## 1. Pre-Seed Counts

Supabase project: `ujucvyyspfxlxlfdamda`

Record actual database state before any seed is applied. All counts must be captured from a live query before seeding begins.

| Table | Row count | Captured at | Notes |
|---|---|---|---|
| auth.users | TODO | TODO | |
| public.organisations | TODO | TODO | |
| public.user_org_memberships | TODO | TODO | |
| public.user_roles | TODO | TODO | |
| public.audit_log | TODO | TODO | |
| public.qa_runs | TODO | TODO | |

---

## 2. Seed Approval Record

Supabase seeding is **BLOCKED** until CS2 issues an explicit seed plan authorization.

| Field | Value |
|---|---|
| CS2 seed plan authorization reference | PENDING — CS2 approval required before any seed |
| Authorized seed scope | TODO (to be filled after CS2 authorization) |
| Seed reversibility plan | TODO |
| Seed window start | TODO |
| Seed window end / cleanup target | TODO |

---

## 3. Actor Map

Record the test actor identities and their membership/role assignments used for verification. All actor rows must be populated before role-matrix execution.

| Actor | auth.users ID | Organisation | user_org_memberships row | user_roles row | Notes |
|---|---|---|---|---|---|
| unauthenticated | N/A — no session | N/A | N/A | N/A | TODO: confirm no residual session |
| viewer | TODO | TODO | TODO | TODO | |
| contributor | TODO | TODO | TODO | TODO | |
| team_leader | TODO | TODO | TODO | TODO | |
| project_manager | TODO | TODO | TODO | TODO | |
| org_admin | TODO | TODO | TODO | TODO | |
| cs2_admin | TODO | TODO | TODO | `org_id is null` | |

---

## 4. RLS Allow/Deny Matrix

Record the actual Supabase RLS policy outcomes per actor per table. Each cell must contain observed result: ALLOW, DENY, or N/A.

| Actor | organisations (SELECT own) | organisations (SELECT other) | user_org_memberships (SELECT own) | user_roles (SELECT own) | audit_log (SELECT own) | qa_runs (SELECT) | Notes |
|---|---|---|---|---|---|---|---|
| unauthenticated | TODO | TODO | TODO | TODO | TODO | TODO | |
| viewer | TODO | TODO | TODO | TODO | TODO | TODO | |
| contributor | TODO | TODO | TODO | TODO | TODO | TODO | |
| team_leader | TODO | TODO | TODO | TODO | TODO | TODO | |
| project_manager | TODO | TODO | TODO | TODO | TODO | TODO | |
| org_admin (own org) | TODO | TODO | TODO | TODO | TODO | TODO | |
| org_admin (other org) | TODO | TODO | TODO | TODO | TODO | TODO | MUST be DENY |
| cs2_admin | TODO | TODO | TODO | TODO | TODO | TODO | |

---

## 5. Deployed Route Denied-Path Matrix

Record browser-observable outcomes for each protected route per actor on the deployed preview/production environment. Each cell must contain: REDIRECT_TO_LOGIN, DENIED (HTTP status or UI error), ALLOWED, or TODO.

Routes under test:
- `/admin/org`
- `/admin/users`
- `/admin/settings`
- `/admin/audit-log`
- `/qa-dashboard`

| Actor | /admin/org | /admin/users | /admin/settings | /admin/audit-log | /qa-dashboard | Evidence type | Notes |
|---|---|---|---|---|---|---|---|
| unauthenticated | TODO | TODO | TODO | TODO | TODO | screenshot/HAR | |
| viewer | TODO | TODO | TODO | TODO | TODO | screenshot/HAR | MUST be denied |
| contributor | TODO | TODO | TODO | TODO | TODO | screenshot/HAR | MUST be denied |
| team_leader | TODO | TODO | TODO | TODO | TODO | screenshot/HAR | MUST be denied |
| project_manager | TODO | TODO | TODO | TODO | TODO | screenshot/HAR | MUST be denied |
| org_admin | TODO | TODO | TODO | TODO | TODO | screenshot/HAR | qa-dashboard MUST be denied |
| cs2_admin | TODO | TODO | TODO | TODO | TODO | screenshot/HAR | qa-dashboard MUST be allowed |

---

## 6. Protected Data Exposure Checks

Verify that no protected data is visible in denied DOM responses. Each row must be completed before W8.2 exit.

| Check | Route | Actor | Result | Notes |
|---|---|---|---|---|
| No org data visible in denied response | /admin/org | viewer | TODO | |
| No user data visible in denied response | /admin/users | viewer | TODO | |
| No audit entries visible in denied response | /admin/audit-log | viewer | TODO | |
| No QA run data visible in denied response | /qa-dashboard | org_admin | TODO | |
| No cross-org data in any denied DOM | all admin routes | all non-admin | TODO | |

---

## 7. Cleanup / Retention Decision

Record the outcome of the post-verification cleanup or retention decision for any seeded test data.

| Item | Decision | Notes |
|---|---|---|
| Test actor memberships (user_org_memberships) | TODO — RETAIN or REMOVE | |
| Test actor roles (user_roles) | TODO — RETAIN or REMOVE | |
| Test organisations | TODO — RETAIN or REMOVE | |
| Test auth users | TODO — RETAIN or REMOVE | Requires CS2 authorization to remove |
| Cleanup completed at | TODO | |
| CS2 retention decision reference | TODO | |

---

## 8. Final W8.2 Verification Decision

**W8.2 is NOT_READY until every required evidence row in this ledger is completed and passing.**

| Criterion | Status | Evidence reference | Notes |
|---|---|---|---|
| Pre-seed counts captured | TODO | | |
| CS2 seed plan authorization obtained | TODO | | BLOCKED — required before seeding |
| All actor map rows populated | TODO | | |
| RLS allow/deny matrix completed with no unexpected ALLOW | TODO | | |
| All denied-path routes confirmed denied for non-privileged actors | TODO | | |
| No protected data exposure in denied responses | TODO | | |
| Cleanup/retention decision recorded | TODO | | |
| Foreman/QP reviewed and confirmed | TODO | | |
| IAA assurance token obtained | TODO | | |

**Final decision: W8.2 is NOT_READY until every required evidence row is completed and passing.**
