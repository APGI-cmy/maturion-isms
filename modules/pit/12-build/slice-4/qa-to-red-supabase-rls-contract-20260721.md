# PIT Stage 12 Slice 4 — QA-to-RED and Supabase/RLS Contract

| Field | Value |
|---|---|
| Issue | #1943 |
| Stage authority | #1767 |
| PR | #1945 |
| Date | 2026-07-21 |
| Slice | Supabase Project Persistence and Project Detail Workspace Foundation |
| Builder | `pit-specialist` after committed appointment and delegation |
| Status | QA-TO-RED CONTRACT — IMPLEMENTATION NOT STARTED |

## Controlled objective

Replace the Slice 3 browser-local project persistence boundary with a governed Supabase-backed repository for `projects` and `source_links`, enforce authenticated organisation isolation through RLS, and add the first project detail workspace at `/projects/:id`.

No runtime implementation is authorised until this governance baseline is merged and the controlled implementation branch is aligned to that merged baseline.

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
- `created_by` and `updated_by`, where implemented by the approved schema, derive from the authenticated actor rather than editable form input.
- Client-supplied organisation or actor identifiers are never the sole authorisation control.
- Repository operations fail closed when session or organisation-membership context is absent.

### Project and source-link persistence

The Slice 4 schema and repository must support the existing project boundary, including the authoritative PIT-TR-029 fields: `id`, `org_id`, `name`, `type`, `quick_win_type`, `description`, `project_leader_id`, `start_date`, `end_date`, `status`, `capex_amount`, `opex_amount`, `fiscal_year`, `created_at`, and `updated_at`.

`source_links` must comply with PIT-TR-036: project ownership, governed source type, nullable external reference where permitted, and at most one source link per project. Organisation access must be derived through the parent project and matching organisation boundary.

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

## QA-to-RED matrix

These tests must exist and fail for the correct reason before implementation turns them green.

| RED ID | Required failing condition before implementation | Required GREEN outcome |
|---|---|---|
| PIT-S4-RED-REPO-001 | Supabase project repository is absent | Valid create persists exactly one project and returns its generated identity |
| PIT-S4-RED-REPO-002 | Register still depends on browser-local data | Register reads organisation-scoped projects from Supabase |
| PIT-S4-RED-REPO-003 | Project detail route cannot load persisted data | `/projects/:id` loads the permitted project overview |
| PIT-S4-RED-REPO-004 | Update persistence is absent | Authorised update persists and survives reload |
| PIT-S4-RED-VALID-001 | Invalid date order can reach persistence | End date before start date is rejected without a write |
| PIT-S4-RED-VALID-002 | Invalid source state can reach persistence | Invalid source input produces no project or source-link write |
| PIT-S4-RED-RLS-001 | Same-organisation read policy is absent | Permitted member reads own-organisation project |
| PIT-S4-RED-RLS-002 | Cross-organisation read isolation is absent | Foreign-organisation project read returns no row or permission denial |
| PIT-S4-RED-RLS-003 | Cross-organisation mutation isolation is absent | Foreign-organisation update is denied |
| PIT-S4-RED-RLS-004 | Viewer mutation denial is absent | Viewer cannot insert or update a project |
| PIT-S4-RED-RLS-005 | Creator insert policy is absent | Creator inserts only into the authenticated organisation |
| PIT-S4-RED-RLS-006 | Source links are not parent constrained | Source-link access requires parent-project access |
| PIT-S4-RED-AUTH-001 | Missing session is not handled | Repository and routes fail closed without authenticated context |
| PIT-S4-RED-SEC-001 | Client credential boundary is not enforced | No service-role secret exists in client code or public configuration |
| PIT-S4-RED-STATE-001 | Detail route states are incomplete | Loading, not-found, denied and recoverable-error states are deterministic |
| PIT-S4-RED-COMPAT-001 | Browser-local records are treated as migrated production data | Compatibility handling is explicit, non-destructive and truthfully labelled |

## Required test layers

- Pure validation tests for project and source-link inputs.
- Repository contract tests against a controlled Supabase test environment or transaction-safe equivalent.
- SQL/RLS positive and negative tests using at least two organisations and creator/viewer contexts.
- Route/component tests for register and `/projects/:id` states.
- Secret scanning and client-bundle/config assertions.
- Current-head TypeScript, build, routing, governance, POLC, CodeQL and deployment checks.

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

## Evidence required before implementation merge recommendation

- RED-to-GREEN trace by test ID.
- Applied migration/schema and policy evidence.
- RLS positive and negative test output.
- Project create/read/update browser trace on the deployed preview.
- Cross-organisation and viewer-denial evidence.
- Secret/client-boundary verification.
- Current-head gate and deployment evidence.
- Review-thread closure and independent assurance or canonical CS2 Direct Review.