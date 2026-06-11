# ISMS W6 Build Evidence — Backend Boundary, Persistence, Schema/RLS, Audit

| Field | Value |
|---|---|
| Wave | W6 — Backend Boundary, Persistence, Schema/RLS, Audit |
| Branch | `foreman/isms-w6-backend-persistence-audit` |
| Status | IMPLEMENTED ON BRANCH — PR/CI PENDING |
| Date | 2026-06-10 |

---

## Scope delivered

Runtime/boundary scope:

- `modules/isms/04-architecture/edge-function-registry.md`
- `supabase/migrations/20260610180000_isms_w6_persistence_audit.sql`
- `apps/isms-portal/src/lib/persistenceBoundary.ts`
- `apps/isms-portal/src/lib/persistenceBoundary.test.ts`

Governance scope:

- `.agent-admin/builder-appointments/isms-stage11-w6-backend-persistence-audit-builder-appointment.md`
- `modules/isms/11-build/w6-backend-persistence-audit-evidence.md`

---

## Backend/edge boundary decision

W6 introduces schema/RLS/audit boundaries only. It does not introduce any Supabase Edge Function invocation.

```text
EDGE FUNCTION DECISION: NO EDGE FUNCTIONS INTRODUCED IN W6
```

The backend registry states that no frontend runtime may call a backend function unless that function is registered with caller, input, output, auth model, error model and deploy status.

---

## Persistence schema evidence

W6 migration creates these ISMS tables:

| Table | Purpose |
|---|---|
| `isms_onboarding_profiles` | persisted onboarding profile boundary |
| `isms_assessments` | free assessment/report summary boundary |
| `isms_entitlements` | entitlement-state boundary |
| `isms_maturity_handoffs` | maturity setup handoff boundary |
| `isms_audit_events` | audit-event boundary |

---

## RLS evidence

RLS is enabled on all W6 tables.

Policies are user scoped via `auth.uid()` for private user-owned tables. Assessment and audit tables allow nullable user IDs for future public/anonymous boundary decisions while preserving user scope when a user ID is present.

---

## Schema-to-hook evidence

W6 deliberately does not add live persistence hooks. The frontend `persistenceBoundary.ts` registry marks all capabilities as `schema_registered_only`.

This preserves the backend boundary without quietly adding runtime writes before hook/audit decisions are reviewed.

---

## D7/D8/D9 QA mapping

| Requirement | Evidence |
|---|---|
| D7 backend boundary | `edge-function-registry.md` records no-edge-function decision and registered backend capabilities. |
| D7 no unregistered function invocation | No Edge Function invocation is introduced. |
| D8 schema exists for required persisted objects | W6 migration creates assessment, onboarding, entitlement, maturity handoff and audit tables. |
| D8 RLS exists | W6 migration enables RLS and policies on all W6 tables. |
| D9 audit writer boundary | `isms_audit_events` schema exists; runtime audit writer remains future hook work. |
| D9 env alignment | No new env variable is introduced in W6. Existing Supabase env decisions remain future W7 deployment/env hardening scope. |

---

## Known partials

- No live persistence hook is introduced.
- No Edge Function is introduced.
- No live AI provider call is introduced.
- No production audit writer invocation is introduced.
- W7-W8 remain unappointed and unauthorized.

---

## Evidence still required before merge

- Build/lint/test results or CI equivalents.
- CI status inspection.
- PR-scoped functional-delivery evidence.
- IAA prebrief/wave record.
- Review conversation disposition.
