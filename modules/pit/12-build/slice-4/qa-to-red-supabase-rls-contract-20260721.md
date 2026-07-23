# PIT Stage 12 Slice 4 — QA-to-RED and Supabase/RLS Contract

| Field | Value |
|---|---|
| Issue | #1943 |
| Stage authority | #1767 |
| Governance PR | #1945 |
| Implementation PR | #1952 |
| Date | 2026-07-21; reconciled 2026-07-23 |
| Slice | Supabase Project Persistence and Project Detail Workspace Foundation |
| Builder | `pit-specialist` after committed appointment and delegation |
| Status | QA-TO-RED SATISFIED / CODE, DATABASE, RLS, DEPLOYMENT AND AUTHENTICATED LFV GREEN — FINAL REVIEW OPEN |
| First implementation commit | `155b42e141c78a9fcd28ee9beefca0d104271d34` |

## Controlled objective

Replace the Slice 3 browser-local project persistence boundary with a governed Supabase-backed repository for `projects` and `source_links`, enforce authenticated organisation isolation through RLS, and add the first project detail workspace at `/projects/:id`.

The active implementation history proves PR-specific prebrief, builder appointment and QA-to-RED ordering before the GREEN implementation tree.

## Source authority

- PIT-TR-018: Supabase Auth JWT sessions.
- PIT-TR-029: `projects` table contract.
- PIT-TR-036: `source_links` table contract.
- PIT-TR-038: organisation-scoping constraint.
- PIT-TR-041 to PIT-TR-047: RLS and write-policy requirements.
- PIT architecture §§6–8: data model, RLS and direct Supabase boundaries.
- Stage 8 W8.3: project-management and `/projects/:id` delivery wave.

## Required technical contract

### Client and credential boundary

- Browser code may use only a publishable or anonymous Supabase credential.
- A service-role credential must never appear in browser code, public environment variables, client bundles, screenshots or test fixtures.
- Browser reads use authenticated RLS.
- Project/source-link mutations use only the checked transactional RPC boundary; direct authenticated table mutation is denied.

### Actor and organisation binding

- Every persisted project has immutable `org_id` binding at creation.
- `created_by` and `updated_by` derive from `auth.uid()` rather than editable form input.
- Client-supplied organisation or actor identifiers are never the sole authorisation control.
- Repository operations fail closed when session, active membership or permitted role context is absent.

### Project and source-link persistence

The Slice 4 schema and repository support the PIT-TR-029 project fields plus controlled actor/audit fields and the PIT-TR-036 source-link boundary. Each valid create transaction persists exactly one project and one source link. Direct table inserts are not granted to authenticated users.

### Row Level Security and RPC contract

1. Authenticated members may read only their organisation's projects.
2. `pit_create_project` checks active membership and creator-capable role before writing.
3. `pit_update_project` checks active membership, authorised role, existing parent project and existing source link.
4. Organisation/audit binding fields are not accepted in the update patch.
5. Viewer and cross-organisation mutation paths fail closed.
6. Anonymous access is denied.
7. Authenticated table privileges are `SELECT` only; mutations are RPC-only.

## QA-to-RED matrix and final evidence position

| RED ID | Required GREEN outcome | Final evidence position |
|---|---|---|
| PIT-S4-RED-REPO-001 | Valid create persists exactly one project and source link | GREEN — checked transactional RPC and deployed LFV |
| PIT-S4-RED-REPO-002 | Register reads organisation-scoped projects | GREEN — repository, RLS and deployed register |
| PIT-S4-RED-REPO-003 | `/projects/:id` loads permitted project | GREEN — deployed detail route |
| PIT-S4-RED-REPO-004 | Authorised update survives reload | GREEN — deployed LFV |
| PIT-S4-RED-VALID-001 | Invalid date order rejected without write | GREEN |
| PIT-S4-RED-VALID-002 | Invalid source input produces no partial write | GREEN |
| PIT-S4-RED-RLS-001 | Member reads own-organisation project | GREEN |
| PIT-S4-RED-RLS-002 | Foreign organisation read returns no row | GREEN |
| PIT-S4-RED-RLS-003 | Foreign organisation update denied | GREEN |
| PIT-S4-RED-RLS-004 | Viewer cannot insert or update | GREEN |
| PIT-S4-RED-RLS-005 | Creator inserts only into active organisation | GREEN |
| PIT-S4-RED-RLS-006 | Source-link access requires parent access | GREEN |
| PIT-S4-RED-AUTH-001 | Missing session/membership fails closed | GREEN |
| PIT-S4-RED-SEC-001 | No service-role browser secret | GREEN |
| PIT-S4-RED-STATE-001 | Route states deterministic | GREEN |
| PIT-S4-RED-COMPAT-001 | Browser-local compatibility truthful | GREEN |

## Executed evidence

- First PR-specific QA-to-RED implementation commit: `155b42e141c78a9fcd28ee9beefca0d104271d34`.
- Applied migrations:
  - `20260722090000_pit_stage12_slice4_project_persistence.sql`;
  - `20260722105000_pit_slice4_privilege_hardening.sql`;
  - `20260723130000_pit_slice4_rpc_only_mutation_boundary.sql`.
- Authenticated privilege result: `SELECT=true`; `INSERT=false`; `UPDATE=false`; `DELETE=false` on both tables.
- Anonymous table privileges: none.
- RPCs: `SECURITY DEFINER`, authenticated/service-role execute only, internal membership/role checks.
- Transactional result: creator persistence `true`; viewer denied `true`; cross-org visible `0`; residual projects `0`.
- Deployed LFV workflow run `30006074390`: login, create, detail, update, reload and register GREEN.
- LFV cleanup: residual projects `0`; residual source links `0`.

## Deterministic acceptance criteria

- Exactly one project and one source link are created for one valid submission.
- Register and detail view read the same Supabase record.
- Authorised updates survive reload.
- Invalid input creates no partial record.
- Direct authenticated table mutation is unavailable.
- Cross-organisation and viewer mutation paths fail closed.
- Service-role credentials remain outside the browser boundary.
- Browser-local compatibility never masquerades as migrated production persistence.

## Explicit exclusions

No milestones, deliverables, tasks, dependencies, timeline engine, evidence uploads, approvals, notifications, roll-up, reporting, AIMC work, full project lifecycle, full PIT completion, Stage 12 completion or release-readiness claim.

## Remaining before merge recommendation

- final current-head CI/deployment completion after review fixes;
- all review threads resolved;
- final proxy/IAA disposition.

This contract does not claim full PIT, Stage 12, `FUNCTIONAL_PASS`, handover or release readiness.
