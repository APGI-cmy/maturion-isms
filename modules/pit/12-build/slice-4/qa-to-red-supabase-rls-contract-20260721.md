# PIT Stage 12 Slice 4 — QA-to-RED and Supabase/RLS Contract

| Field | Value |
|---|---|
| Issue | #1943 |
| Stage authority | #1767 |
| Governance PR | #1945 |
| Implementation PR | #1952 |
| Date | 2026-07-21 |
| Slice | Supabase Project Persistence and Project Detail Workspace Foundation |
| Builder | `pit-specialist` after committed appointment and delegation |
| Status | QA-TO-RED SATISFIED / CODE AND DATABASE GREEN — DEPLOYED BROWSER LFV OPEN |
| First implementation commit | `4f31c3a1648357aee6c45f3e6e286eeab3f1a46a` |

## Controlled objective

Replace the Slice 3 browser-local project persistence boundary with a governed Supabase-backed repository for `projects` and `source_links`, enforce authenticated organisation isolation through RLS, and add the first project detail workspace at `/projects/:id`.

The governance baseline was merged and the implementation branch was aligned before the first implementation commit.

## Source authority

- PIT-TR-018: Supabase Auth JWT sessions.
- PIT-TR-029: `projects` table contract.
- PIT-TR-036: `source_links` table contract.
- PIT-TR-038: organisation-scoping constraint.
- PIT-TR-041 to PIT-TR-047: RLS and write-policy requirements.
- PIT architecture §§6–8: data model, RLS and direct Supabase CRUD boundaries.
- Stage 8 W8.3: project-management and `/projects/:id` delivery wave.

## Required technical contract

### Client and credential boundary

- Browser code may use only a publishable or anonymous Supabase credential.
- A service-role credential must never appear in browser code, public environment variables, client bundles, screenshots or test fixtures.
- Direct project CRUD uses the Supabase client under authenticated RLS.
- Privileged bypass logic is out of scope unless separately authorised and server-side.

### Actor and organisation binding

- Every persisted project has immutable `org_id` binding at creation.
- `created_by` and `updated_by` derive from the authenticated actor rather than editable form input.
- Client-supplied organisation or actor identifiers are never the sole authorisation control.
- Repository operations fail closed when session or organisation-membership context is absent.

### Project and source-link persistence

The Slice 4 schema and repository support the PIT-TR-029 project fields plus controlled actor/audit fields and the PIT-TR-036 source-link boundary. Organisation access is derived through the parent project and matching organisation boundary.

### Row Level Security contract

RLS is enabled before application use.

Minimum policies and tests:

1. **Organisation read:** an authenticated member reads only projects in an organisation to which the actor belongs.
2. **Creator insert:** only a creator-capable role may insert, and only for the authenticated organisation.
3. **Authorised update:** only authorised roles may update permitted fields within their organisation.
4. **Cross-organisation denial:** no actor may read or mutate another organisation's project.
5. **Viewer denial:** viewer/non-creator roles receive no positive project or source-link mutation path.
6. **Source-link ownership:** source-link access requires access to the parent project.
7. **Anonymous denial:** unauthenticated access is denied; no public project policy is authorised.

## QA-to-RED matrix and execution position

| RED ID | Required GREEN outcome | Current evidence position |
|---|---|---|
| PIT-S4-RED-REPO-001 | Valid create persists exactly one project and returns identity | GREEN — repository/RPC contract test |
| PIT-S4-RED-REPO-002 | Register reads organisation-scoped projects from Supabase | GREEN — repository and register implementation |
| PIT-S4-RED-REPO-003 | `/projects/:id` loads the permitted project overview | GREEN — detail route/data state implementation |
| PIT-S4-RED-REPO-004 | Authorised update persists and survives reload | GREEN at repository/RPC layer; deployed browser reload trace open |
| PIT-S4-RED-VALID-001 | Invalid date order is rejected without a write | GREEN — validation test |
| PIT-S4-RED-VALID-002 | Invalid source input produces no partial write | GREEN — validation and transactional RPC |
| PIT-S4-RED-RLS-001 | Permitted member reads own-organisation project | GREEN — policy and transactional scenario |
| PIT-S4-RED-RLS-002 | Foreign-organisation project read returns no row | GREEN — transactional scenario returned zero |
| PIT-S4-RED-RLS-003 | Foreign-organisation update is denied | GREEN by parent organisation RLS; final browser negative trace open |
| PIT-S4-RED-RLS-004 | Viewer cannot insert or update | GREEN — repository denial and transactional database denial |
| PIT-S4-RED-RLS-005 | Creator inserts only into authenticated organisation | GREEN — session-bound RPC and policy |
| PIT-S4-RED-RLS-006 | Source-link access requires parent-project access | GREEN — parent-project RLS policies |
| PIT-S4-RED-AUTH-001 | Repository/routes fail closed without session/membership | GREEN — repository and protected-route implementation |
| PIT-S4-RED-SEC-001 | No service-role secret in client boundary | GREEN — publishable key only; privilege hardening applied |
| PIT-S4-RED-STATE-001 | Loading/not-found/denied/error/data are deterministic | GREEN — pure state test and route implementation |
| PIT-S4-RED-COMPAT-001 | Browser-local compatibility is explicit and truthful | GREEN — read-only compatibility metadata and UI notice |

## Required test layers

- Pure validation tests for project and source-link inputs.
- Repository contract tests against a controlled database abstraction.
- SQL/RLS positive and negative verification using two organisations and creator/viewer contexts.
- Route/component state implementation for register and `/projects/:id`.
- Secret/client-boundary verification.
- Current-head TypeScript, build, routing, governance, POLC, CodeQL and deployment checks.

## Executed evidence

- First RED commit: `4f31c3a1648357aee6c45f3e6e286eeab3f1a46a`.
- Applied migration: `20260722090000_pit_stage12_slice4_project_persistence.sql`.
- Applied privilege hardening: `20260722105000_pit_slice4_privilege_hardening.sql`.
- Transactional result: creator persistence `true`; viewer denied `true`; cross-org visible `0`; residual projects `0`.
- TypeScript result: exit `0`, empty diagnostics.
- Detailed record: `modules/pit/12-build/slice-4/red-to-green-and-rls-evidence-20260722.md`.

## Deterministic acceptance criteria

- Exactly one project is created for one valid submission.
- Register and detail view read the same Supabase record.
- Authorised updates survive reload.
- Invalid input creates no partial project or orphan source link.
- Cross-organisation reads and writes fail closed.
- Viewer mutation fails at UI/repository and database-policy layers.
- Service-role credentials remain server-only.
- Browser-local compatibility never masquerades as migrated production persistence.

## Explicit exclusions

No milestones, deliverables, tasks, dependencies, timeline engine, evidence uploads, approvals, notifications, roll-up, reporting, AIMC work, full project lifecycle, full PIT completion, Stage 12 completion or release-readiness claim.

## Evidence still required before merge recommendation

- Project create/read/update browser trace on the deployed preview using an approved test account.
- Final current-head gate, preview deployment and route-smoke evidence after all documentation commits.
- Review-thread closure and independent assurance or canonical CS2 Direct Review.

This contract does not claim browser LFV, `FUNCTIONAL_PASS`, Stage 12 completion, PIT completion, handover or release readiness.
