# PIT Stage 12 Slice 3 Builder Appointment

| Field | Value |
|---|---|
| Issue | #1934 |
| PR | #1935 |
| Wave | `pit-stage12-slice3-project-persistence-foundation` |
| Date | 2026-07-13 |
| Appointing authority | CS2 - Johan Ras |
| Orchestrator | Foreman |
| Appointed builder | `pit-specialist` |
| Bound prebrief | `.agent-admin/assurance/iaa-wave-record-pit-stage12-slice3-20260713.md` |
| Status | ACTIVE FOR SLICE 3 ONLY |

## Delegated scope

Implement the typed browser-persistence adapter, validated project creation workflow, persisted Project Register, deterministic tests, and Slice 3 evidence required by Issue #1934.

## Required runtime paths

- `apps/isms-portal/src/lib/pitProjectPersistence.ts`
- `apps/isms-portal/src/lib/pitProjectPersistence.test.ts`
- `apps/isms-portal/src/pages/pit/CreateProjectFoundation.tsx`
- `apps/isms-portal/src/pages/pit/ProjectRegisterFoundation.tsx`

## Obligations

- Preserve existing auth, entitlement and role guards.
- Keep persistence logic outside React components.
- Validate all records before writing.
- State the browser-local persistence boundary truthfully.
- Stop and correct any test, build or gate failure before handover.

## Prohibitions

No Supabase schema, RLS, secrets, provider integration, project hierarchy, evidence workflow, reporting, full-PIT completion claim, merge action or independent assurance verdict is delegated.