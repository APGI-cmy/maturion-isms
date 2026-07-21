# PIT Stage 12 Slice 4 — Builder Appointment and Delegation

| Field | Value |
|---|---|
| Issue | #1943 |
| Governance PR | #1945 |
| Wave | `pit-stage12-slice4-supabase-project-persistence` |
| Date | 2026-07-21 |
| CS2 authority | Johan Ras |
| Foreman | Orchestration, delegation, verification and control |
| Appointed builder | `pit-specialist` |
| Wave task declaration commit | `f44ede99e60befd9ba4c3d19ec1c17d235860268` |
| QA-to-RED contract commit | `0ebf8ffba93ab406df0e3f4f812c2f0321e0f4ad` |
| Canonical prebrief commit | `419d42df55b6419f6ae49dea7d14158a21c2cbb9` |
| Status | APPOINTED AND DELEGATED — IMPLEMENTATION MAY BEGIN ONLY AFTER PR #1945 MERGES AND THE IMPLEMENTATION BRANCH IS ALIGNED TO THAT MERGED BASELINE |

## Appointment

`pit-specialist` is appointed as the sole implementation builder for the Slice 4 runtime, schema and RLS boundary authorised by Issue #1943.

This appointment follows the committed wave task declaration, QA-to-RED contract and canonical IAA preflight brief. Foreman and CS2 proxy retain planning, verification and control responsibilities and do not self-attribute builder implementation.

## Delegated implementation scope

- Implement the governed Supabase persistence contract for `projects` and `source_links`.
- Establish authenticated actor and organisation binding without trusting editable identifiers.
- Implement and test organisation-scoped RLS.
- Replace browser-local project persistence behind a stable repository interface.
- Implement `/projects/:id` overview and deterministic loading, not-found, denied and recoverable-error states.
- Preserve existing validation, classification and duplicate-submission protections.
- Produce RED-to-GREEN, migration/policy, browser and current-head handover evidence.

## Mandatory exclusions

The builder is not delegated to implement milestones, deliverables, tasks, dependencies, timeline, evidence uploads, approvals, notifications, roll-up, reporting, AIMC, full lifecycle, full PIT completion, Stage 12 completion or release readiness.

The builder may not expose service-role credentials client-side, bypass RLS, invent organisation-membership semantics, silently relabel browser-local data as production data, merge the PR, or issue the final assurance verdict.

## Stop conditions

The builder must stop and return a governed dependency finding when the target Supabase environment cannot be identified, required authentication or organisation membership is absent, RLS cannot be proven through positive and negative tests, a cross-module change is required outside Issue #1943, or the requested work crosses an exclusion.

## Implementation sequencing

1. Merge PR #1945.
2. Align `pit-stage12-slice4-supabase-project-persistence` to the merged governance baseline.
3. Create the implementation PR and PR-scoped delegation order.
4. Commit QA-to-RED tests that fail for the correct reasons.
5. Record the detected first implementation commit SHA in the PR-scoped delegation order.
6. Proceed build-to-GREEN only after the ordering gate is provable.

## Handover standard

Handover must identify exact head SHA, changed paths, migrations and policies, tests executed, RED-to-GREEN results, deployment identity, browser evidence, known evidence debt and unresolved findings.