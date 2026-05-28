# MMM QA-to-Red Addendum — MPS AI Fallback Non-Blocking Gate

**Test ID**: `T-MMM-S6-187`  
**Area**: Domain workspace -> `Create MPSs` modal  
**Purpose**: Prevent regression where AI edge-function outage is surfaced as a hard failure even though fallback payload is available.

## RED Condition

When AI invocation fails:

1. UI shows hard error state only, or
2. no fallback list appears, or
3. workflow actions become blocked.

## GREEN Condition

When AI invocation fails:

1. `mps-generation-warning` is rendered.
2. `mps-generation-error` is not rendered.
3. `generated-mps-list` is rendered and remains actionable.

## Automated Enforcement

- File: `modules/MMM/tests/B4-framework/domain-workflow-behavior.test.tsx`
- Case: `AI function error shows non-blocking fallback warning with generated legacy pack`
