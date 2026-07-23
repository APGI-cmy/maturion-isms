# PIT Stage 12 Slice 4 — PR #1952 Builder Appointment

| Field | Value |
|---|---|
| Issue | #1943 |
| Implementation PR | #1952 |
| Wave | `pit-stage12-slice4-supabase-project-persistence` |
| Date | 2026-07-22 |
| CS2 authority | Johan Ras |
| Foreman role | Orchestration, delegation, verification and control |
| Appointed builder | `pit-specialist` |
| PR-specific prebrief commit | `80a3a5b911f6a41f0a0885dd666758a9d5595493` |
| Status | APPOINTED AND DELEGATED — QA-TO-RED MUST BE THE NEXT IMPLEMENTATION-LIKE COMMIT |

## Appointment

`pit-specialist` is appointed as the sole implementation builder for the Slice 4 runtime, schema, repository, authentication and RLS boundary authorised by Issue #1943 and governed through PR #1952.

This appointment is committed after the PR-specific IAA preflight brief and before any implementation-like file or test is introduced into the repaired branch history.

## Delegated scope

- Implement Supabase-backed `projects` and `source_links` persistence.
- Bind actor and organisation identity to the authenticated Supabase session.
- Implement organisation-scoped RLS and role-controlled create/update behavior.
- Implement the stable project repository, Project Register, Create Project and `/projects/:id` workspace.
- Preserve truthful browser-local compatibility handling.
- Produce RED-to-GREEN, RLS, deployment and authenticated browser evidence.

## Exclusions

No milestones, deliverables, tasks, dependencies, timeline, evidence workflows, notifications, reporting, AIMC, full lifecycle, Stage 12 completion or full PIT completion is delegated.

The builder may not weaken RLS, expose service-role credentials, bypass the delegation gate, merge the PR, or issue final assurance.

## Required next step

The next implementation-like commit must introduce the QA-to-RED Slice 4 test contract before repository, route, schema or runtime implementation appears in this repaired history.
