# PIT Stage 12 Slice 3 Governance and QA Pack

| Field | Value |
|---|---|
| Issue | #1934 |
| PR | #1935 |
| Date | 2026-07-13 |
| Slice | Project Register / Project Creation Persistence Foundation |
| Builder | `pit-specialist` |
| Status | IMPLEMENTED - CURRENT-HEAD VERIFICATION PENDING |

## Scope

Deliver a creator-only, validated project creation workflow and browser-persistent Project Register through a typed adapter in the current mock-auth portal.

## Applicable RED baseline

| RED ID | Slice 3 GREEN outcome |
|---|---|
| PIT-RED-ROUTE-008 | `/projects` renders persisted project records. |
| PIT-RED-ROUTE-009 | Creator-capable roles can open `/projects/new`. |
| PIT-RED-RLS-001 | Viewer receives permission denial on `/projects/new`. |
| PIT-RED-RLS-013 | Non-creator mutation is rejected by the adapter. |
| PIT-RED-PROJECT-001 | Valid submission creates exactly one project visible in the register. |
| PIT-RED-PROJECT-002 | Type and delivery classification are retained and displayed. |

## Deterministic acceptance criteria

- Required name, project leader, start date and end date.
- End date may not precede start date.
- Non-manual source requires a reference.
- CAPEX/OPEX must be finite non-negative values when supplied.
- Malformed stored payloads fail safely.
- Created records survive navigation and browser reload.
- Existing auth, entitlement and role guards remain unchanged.
- Persistence logic remains outside React components.
- No production Supabase claim appears in UI or evidence.

## Explicit exclusions

No Supabase tables, RLS, provider authentication, cross-device synchronisation, milestones, deliverables, tasks, evidence, reporting, archive/restore, full PIT completion or release-readiness claim.

## Required verification

- `pitProjectPersistence.test.ts` passes.
- Existing portal tests and TypeScript/Vite build pass.
- Current-head repository governance, POLC, routing, CodeQL and deployment gates pass.
- Formal browser screenshots are captured separately or honestly marked outstanding.

## Assurance boundary

The structured preflight is filed at `.agent-admin/assurance/iaa-wave-record-pit-stage12-slice3-20260713.md`. It is not a final IAA verdict. Final assurance or canonical CS2 Direct Review remains required before merge recommendation.