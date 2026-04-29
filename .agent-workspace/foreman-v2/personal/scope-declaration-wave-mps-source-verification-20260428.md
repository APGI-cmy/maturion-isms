# Scope Declaration — Wave: wave-mps-source-verification

**Wave**: wave-mps-source-verification
**Session ID**: session-mps-source-verification-20260428
**Date**: 2026-04-28
**Branch**: copilot/verify-generic-mps-source-documents
**Issue**: CS2 clarification — verify canonical generic MPS source pack in AIMC/KUC before static question bank
**CS2 Authorization**: CONFIRMED — issue opened by CS2 (@APGI-cmy); foreman-v2-agent assigned

## Track A Approved Artifact Paths

This scope declaration covers Track A (research + gap recording) deliverables only.
Track B deliverables require a separate scope declaration after CS2 DB verification gate.

```yaml
approved_artifact_paths:
  - .agent-workspace/foreman-v2/personal/wave-current-tasks.md
  - .agent-workspace/foreman-v2/personal/mps-migration-gap-analysis-20260428.md
  - .agent-workspace/foreman-v2/personal/scope-declaration-wave-mps-source-verification-20260428.md
  - .agent-workspace/foreman-v2/memory/session-mps-source-verification-20260428.md
  - SCOPE_DECLARATION.md
```

## Files Changed This Wave (Track A)

- `.agent-workspace/foreman-v2/personal/wave-current-tasks.md` - Wave task tracker (recreated for new wave)
- `.agent-workspace/foreman-v2/personal/mps-migration-gap-analysis-20260428.md` - Migration gap analysis (Track A deliverable)
- `.agent-workspace/foreman-v2/personal/scope-declaration-wave-mps-source-verification-20260428.md` - This scope declaration
- `.agent-workspace/foreman-v2/memory/session-mps-source-verification-20260428.md` - Session memory
- `SCOPE_DECLARATION.md` - Updated root scope declaration

## Track B Scope (BLOCKED — pending CS2 gate)

Track B artifacts will be declared in a separate scope declaration when CS2 confirms:
- DB verification of mmm_maturity_process_steps content
- Re-upload of MPS 1-25 Word documents (if migration gap confirmed)

All Track B files will be in:
- `apps/mmm/src/pages/FreeAssessmentPage.tsx`
- `modules/MMM/tests/B3-ui/b3-ui.test.ts` (or new test file)
- `supabase/functions/mmm-assessment-free-respond/index.ts`
- Possibly: `modules/MMM/data/generic-mps-baseline.json` (new — KUC-derived)

## CI Gate Notes

Track A is EXEMPT from IAA final audit (pure research/workspace deliverables, no governance
file changes). governance-artifact-gate will verify these paths match PR diff.

