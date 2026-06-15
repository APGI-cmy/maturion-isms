# PIT Stage 12 W8.2 Actor-Map Discovery

Issue: APGI-cmy/maturion-isms#1803
Governing W8.2 issue: APGI-cmy/maturion-isms#1774
Builder: pit-specialist (Copilot last-resort resource per Foreman delegation)
Discovery date: 2026-06-15
Foreman live-discovery retry date: 2026-06-15
Status: DISCOVERY_ONLY — for CS2 review

## Purpose

Identify candidate existing test actors and organisations for later W8.2 verification planning.

This document contains no database writes, no seed execution, no auth-user creation, no code changes, and makes no W8.2 completion claim.

Final posture: **W8.2_NOT_READY**

---

## Current discovery outcome

Current-state Supabase discovery was attempted from the Foreman chat executor on 2026-06-15, but the executor did not return a usable result payload for the read-only count query.

Therefore this artifact must not be treated as current live Supabase evidence.

Outcome classification:

```text
ACTOR_MAP_DISCOVERY_BLOCKED
SEED_PLAN_APPROVAL_BLOCKED
W8.2_NOT_READY
```

This PR remains a planning/discovery scaffold only. It is not sufficient to authorize seed execution until CS2 or an approved builder captures fresh read-only Supabase counts and current actor/organisation refs.

---

## Last-known pre-execution counts

Source: `modules/pit/12-build/w82-role-matrix-denied-path-verification.md` (captured in PR #1791).

| Table | Count |
|---|---:|
| `auth.users` | 3 |
| `public.organisations` | 3 |
| `public.user_org_memberships` | 0 |
| `public.user_roles` | 0 |
| `public.audit_log` | 0 |
| `public.qa_runs` | 0 |

> **IMPORTANT**: These counts reflect the state at the time of the PR #1791 Supabase evidence query. The live counts may have changed. A fresh read-only Supabase query is required before any seed decision is made.

---

## Required fresh discovery before seed-plan approval

Before CS2 may approve any seed plan, an approved operator or builder must capture current read-only evidence from Supabase project `ujucvyyspfxlxlfdamda` showing:

| Evidence item | Required before seed approval |
|---|---|
| Current `auth.users` count | yes |
| Current `public.organisations` count | yes |
| Current `public.user_org_memberships` count | yes |
| Current `public.user_roles` count | yes |
| Current `public.audit_log` count | yes |
| Current `public.qa_runs` count | yes |
| Current anonymised auth-user refs | yes |
| Current anonymised organisation refs | yes |
| Confirmation that selected users are safe test actors | yes |
| Confirmation that selected organisations are safe test targets | yes |

If current counts or actor refs cannot be captured, the correct CS2 decision is to keep seed approval blocked and choose either manual Supabase dashboard confirmation, dedicated test users, or a Supabase development branch.

---

## Candidate refs (anonymised, planning-only)

The connected Supabase project (`ujucvyyspfxlxlfdamda`) contained exactly three auth users and three organisations as of the last captured evidence. They are referenced here using anonymised handles only. Actual UUIDs and email addresses are not held in code artifacts and must be supplied by CS2 from the Supabase Auth admin panel or captured by an approved read-only builder run.

### Candidate user refs

| Handle | Proposed actor role | Basis |
|---|---|---|
| `user_ref_A` | `actor_cs2_admin` | One of the three existing auth users; should be a CS2 or admin-level identity confirmed safe for test use. |
| `user_ref_B` | `actor_org_admin` | One of the three existing auth users; should be a non-admin identity that can receive a scoped `org_admin` role in `org_a` for verification only. |
| `user_ref_C` | `actor_non_admin` | One of the three existing auth users; should remain without any W8.2 role assignment so denied-path checks can be validated against a zero-role identity. |

### Candidate organisation refs

| Handle | Proposed actor scope | Basis |
|---|---|---|
| `org_ref_1` | `org_a` | First of the three existing organisations; proposed primary test org for allow/deny matrix. |
| `org_ref_2` | `org_b` | Second of the three existing organisations; proposed cross-org deny target to verify `cross_org_denied` rejection. |
| `org_ref_3` | spare | Third organisation; proposed as unused during W8.2 verification to keep scope minimal. |

---

## Proposed actor map (planning-only)

| Actor label | Candidate handle | Required seed | Proposed role assignment |
|---|---|---|---|
| `actor_cs2_admin` | `user_ref_A` | `user_roles` row: `role = 'cs2_admin'`, `org_id IS NULL`, `project_id IS NULL` | Global CS2 admin — cross-org visibility expected. |
| `actor_org_admin` | `user_ref_B` | `user_org_memberships` row: `org_id = org_ref_1`, `status = 'active'`; `user_roles` row: `role = 'org_admin'`, `org_id = org_ref_1` | Org-scoped admin for `org_a` only. |
| `actor_non_admin` | `user_ref_C` | No seed — zero membership, zero role assignment. | No role; denied-path verification subject. |
| `org_a` | `org_ref_1` | None — exists. | Primary test organisation. |
| `org_b` | `org_ref_2` | None — exists. | Cross-org deny target. |

---

## Expected verification coverage per actor

| Actor | Expected allowed behavior | Expected denied behavior |
|---|---|---|
| `actor_cs2_admin` | SELECT on all W8.2 tables via `pit_is_cs2_admin()`; `/qa-dashboard` route | Cannot spoof `created_by`/`actor_id` on authenticated writes due to RLS `WITH CHECK` policies (service role bypasses RLS). |
| `actor_org_admin` | SELECT own-org memberships/roles; INSERT membership in `org_a`; SELECT `audit_log` for `org_a`; admin nav for `org_a` visible | `/qa-dashboard` (CS2-only); cross-org membership/role reads; role writes outside `org_a`. |
| `actor_non_admin` | No positive W8.2 table access without membership. | All W8.2 admin routes (`/admin/org`, `/admin/users`, `/admin/settings`, `/admin/audit-log`, `/qa-dashboard`); all table SELECT via RLS. |

---

## Risks and uncertainties

| Risk | Severity | Notes |
|---|---|---|
| **COUNTS_STALE** | High | Last-known counts are from PR #1791. Foreman retried current read-only discovery on 2026-06-15, but no usable result payload was returned by the executor. Current counts are still required. |
| **USER_IDENTITY_UNKNOWN** | High | The actual identities (email, existing role state) of the three auth users are not visible from code artifacts. CS2 must confirm which users are safe for each actor role before any seed. |
| **ORG_IDENTITY_UNKNOWN** | High | Organisation names/UUIDs are not visible from code artifacts. CS2 must confirm which organisations are safe for test use. |
| **PARTIAL_ROLE_CONTAMINATION** | Medium | If any of the three auth users already hold any membership or role rows outside of W8.2 scope, a targeted role assignment may produce unexpected RLS side-effects. Pre-seed count and role inspection is required. |
| **SEED_REVERSIBILITY** | Medium | Any W8.2 seed must include a documented cleanup/rollback plan. Memberships and roles added only for verification should not persist as production access grants. |
| **THIRD_USER_SCOPE** | Low | If only two users are clearly suitable for `actor_cs2_admin` and `actor_org_admin`, the third user may need to be a purpose-created test account. CS2 must decide whether an existing user or a new test account is preferred for `actor_non_admin`. |

---

## Recommendation for CS2 seed-plan decision

CS2 should **not approve seed execution from this PR alone**.

Recommended next decision: require one of the following before seed approval:

1. **Manual CS2 confirmation** from the Supabase dashboard of current counts, selected user refs, selected org refs, and actor safety; or
2. **Approved read-only builder run** that captures current counts and refs without writes; or
3. **Dedicated test users** if existing users cannot be confirmed safe; or
4. **Supabase development branch** if live-project seeding is not acceptable.

Before any seed is executed:

1. **CS2 must supply confirmed user refs** — provide the actual UUID or anonymised handle for each of the three auth users, confirming which is safe to assign as `actor_cs2_admin`, `actor_org_admin`, and `actor_non_admin`.

2. **CS2 must supply confirmed org refs** — provide the actual UUID or name for `org_a` and `org_b` candidates.

3. **CS2 must confirm current table counts** — run the read-only count query against `auth.users`, `public.organisations`, `public.user_org_memberships`, and `public.user_roles` to confirm no changes since PR #1791.

4. **CS2 must issue explicit seed-plan authorization** — per the builder task order in `.agent-admin/builder-appointments/pit-stage12-w82-final-verification-builder-task.md`, no Supabase seed may occur until this authorization is issued and referenced in the evidence ledger.

5. **CS2 must confirm cleanup/retention posture** — decide whether test seed rows are cleaned up after verification or retained as permanent test fixtures.

Once these five items are resolved, pit-specialist may proceed with actor seed execution under the already-approved W8.2 verification wave.

---

## Non-overclaim

This artifact is discovery only. It does not constitute:

- a W8.2 completion claim
- a Stage 12 completion claim
- a PIT FUNCTIONAL_PASS claim
- an authorization to execute any Supabase seed
- an authorization to create auth users
- a seed-plan approval

Final posture: **W8.2_NOT_READY**
