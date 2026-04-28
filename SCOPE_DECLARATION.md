# Scope Declaration — mmm-mps-level-questionnaire-20260428

**Wave**: mmm-mps-level-questionnaire-20260428
**Issue**: maturion-isms#1503
**Branch**: copilot/fix-issue-using-generic-mps-level-questionnaire
**Date**: 2026-04-28
**Last refreshed**: 2026-04-28 (post-final-edit scope refresh per §4.3g / AAP-28)
**Authority**: SCOPE_TO_DIFF_RULE.md, MERGE_GATE_PHILOSOPHY.md (BL-027)

## Scope Decision

Replace the five-question flat domain self-rating free assessment with a generic MPS-level
psychometric questionnaire (generic-mps-baseline-v1): 5 domains × 5 MPSs × 1 diagnostic
A/B/C question = 25 questions total. Updates frontend page, result page, store, edge function,
and tests. Adds T-MMM-S6-022 anti-regression suite.

AIMC/KUC note: Generic MPS content is not yet confirmed in the AIMC/KUC knowledge store.
This PR ships a static v1 question bank as an interim implementation. A follow-up issue is
required to ingest generic-mps-baseline-v1 through the governed KUC path.

## Changed Files

- `SCOPE_DECLARATION.md` - Updated for this wave (per §4.3g scope refresh)
- `apps/mmm/src/pages/FreeAssessmentPage.tsx` - Replaced flat domain self-rating UI with MPS-level domain-by-domain questionnaire; 25 diagnostic A/B/C questions across 5 domains × 5 MPSs; structured payload (assessment_version, responses); domain progress indicator; exports QUESTION_BANK
- `apps/mmm/src/pages/FreeAssessmentResultPage.tsx` - Updated to show domain-level breakdown (data-testid="domain-breakdown") alongside overall baseline maturity; reads domainScores from store
- `apps/mmm/src/store/freeAssessmentStore.ts` - Added domainScores state; updated setResult signature to accept domain scores
- `supabase/functions/mmm-assessment-free-respond/index.ts` - Updated to accept structured { assessment_version, responses: [{ domain_id, mps_id, question_id, response: A|B|C }] }; computes per-MPS, per-domain, overall scores; CHOICE_SCORE_MAP A=0.0 B=0.5 C=1.0; legacy domain_responses path retained for backward compatibility
- `modules/MMM/tests/B3-ui/b3-ui.test.ts` - Updated T-MMM-S6-002 (MPS-level payload assertions, anti-regression for flat self-rating); updated T-MMM-S6-018 (A/B/C scoring, mps_scores, domain_scores); added T-MMM-S6-022 anti-regression suite (QUESTION_BANK structure, 25+ questions, 5 canonical domains, domain breakdown in result page)

## Out of Scope

- Any Supabase schema migrations
- Any deployment workflow changes
- Any other app directories outside `apps/mmm/` and `supabase/functions/mmm-assessment-free-respond/`
- Any governance canon files
