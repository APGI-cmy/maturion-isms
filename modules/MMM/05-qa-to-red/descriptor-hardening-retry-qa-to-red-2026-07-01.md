# MMM Descriptor Hardening Retry — QA-to-RED

| Field | Value |
|---|---|
| Wave ID | `wave-mmm-descriptor-hardening-retry-2026-07-01` |
| Issue | #1883 |
| Module | MMM |
| Status | RED expectations only (no implementation in this artifact) |

## Purpose

Define retry acceptance criteria after revert commit `41d7503c`: remove criterion-specific hardcoded descriptor template behavior while preserving coherent fallback semantics and deterministic test behavior.

## RED Criteria

### T-MMM-DHR-001 — No criterion-specific hardcoded template mapping

RED if descriptor generation depends on criterion-identifier-specific hardcoded output strings.

GREEN only when generation uses generalized grammar normalization and scoped grounding logic, not per-criterion literal templates.

### T-MMM-DHR-002 — Coherent fallback semantics are preserved

RED if fallback output becomes contradictory, incomplete, or grammatically broken when scoped subject knowledge is missing/partial.

GREEN when fallback still produces coherent auditable evidence clauses preserving actor/action/object intent.

### T-MMM-DHR-003 — Gerund-led criteria normalize deterministically

Given inputs like `Assessing ...` / `Reviewing ...`,  
GREEN when generated clauses avoid literal gerund lead-ins (`Evidence that Assessing...`) and normalize to evidence-state phrasing while keeping meaning.

### T-MMM-DHR-004 — Test consistency and anti-dodging

GREEN requires:

- `modules/MMM/tests/B4-framework/domain-workflow-behavior.test.tsx` updated/extended for retry behavior;
- no skipped/todo/incomplete tests in target suite;
- deterministic assertions for both normalization and fallback paths.

### T-MMM-DHR-005 — Scoped MMM grounding remains active

GREEN only when methodology grounding still uses scoped MMM subject-knowledge pathway where available, with deterministic fallback when unavailable.

## Authorized Test Target

- `pnpm exec vitest run --config vitest.mmm-b4.config.ts modules/MMM/tests/B4-framework/domain-workflow-behavior.test.tsx`

## Boundary

No PIT/ISMS routing/deployment workflow scope. This QA artifact authorizes only descriptor-hardening retry surfaces.

