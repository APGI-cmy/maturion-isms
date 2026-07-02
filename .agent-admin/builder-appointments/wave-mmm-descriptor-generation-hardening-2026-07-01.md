# Builder Appointment — MMM Descriptor Generation Hardening

Wave ID: wave-mmm-descriptor-generation-hardening-2026-07-01  
Issue: #1883  
Module: MMM  
Builder: ui-builder  
Status: appointed for bounded implementation after canonical pre-brief

## Pre-brief binding

- iaa_wave_record_path: `.agent-admin/assurance/iaa-wave-record-wave-mmm-descriptor-generation-hardening-2026-07-01.md`
- prebrief_result: `PREFLIGHT_BRIEF_COMPLETE`
- builder_appointment_timestamp: `2026-07-01T10:17:00+02:00`
- order_proof_note: This appointment record is intentionally re-anchored in a dedicated commit after the pre-brief commit and before the first implementation commit.

## Assignment

Implement hardening for MMM descriptor generation so output grammar is deterministic and criterion-evidence phrasing remains auditable while grounded in the scoped MMM subject-knowledge sources.

## Authorized files

- `apps/mmm/src/components/assessment/CriteriaManagement.tsx`
- `modules/MMM/tests/B4-framework/domain-workflow-behavior.test.tsx`

## Required behavior

- Eliminate recurrent literal gerund lead-ins in generated evidence clauses (for example `Evidence that Assessing ...` / `Evidence that Reviewing ...`).
- Preserve criterion actor/action/object semantics while normalizing grammar.
- Harden generation grounding pathway using MMM scoped subject-knowledge data where applicable to descriptor methodology retrieval.
- Add/adjust regression tests for the known failing grammar patterns.
- Keep behavior aligned with existing MMM descriptor authoring constraints and gate patterns.

## Exclusions

- No edits to `.github/agents/` files.
- No unrelated deployment/domain/Vercel changes.
- No PIT/ISMS cross-module changes outside MMM descriptor-generation hardening scope.

## Order gate intent

This appointment must be committed after canonical pre-brief evidence and before the first implementation commit. Delegation order proof will be recorded in `.agent-admin/control/delegation-orders/pr-1885.json`.
