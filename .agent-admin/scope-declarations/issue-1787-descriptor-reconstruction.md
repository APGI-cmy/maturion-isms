# Scope Declaration — Issue 1787 Descriptor Reconstruction

- **Repository**: `APGI-cmy/maturion-isms`
- **Module**: `modules/MMM`
- **Issue**: #1787
- **Wave ID**: `mmm-dmc-descriptor-reconstruction-20260610`
- **Authority**: CS2 reported live DMC defect and authorized Foreman to proceed.
- **Foreman Role**: foreman-v2 governed orchestration.
- **Classification**: MMM DMC build-to-green correction; pre-build and QA-to-RED must be recorded before implementation.

## Scope

This wave records and prepares the global rule that maturity descriptor generation must sentence-reconstruct accepted criteria into readable audit-evidence statements. The rule applies globally across all criteria, MPS rows, domains, source modes, and maturity levels.

## In Scope

1. Record a pre-build architecture addendum for global descriptor sentence reconstruction.
2. Record QA-to-RED obligations before runtime implementation.
3. Record the live failure and expected build-to-green acceptance.
4. Prepare the downstream builder contract for implementation work.

## Out of Scope for this initial pre-build commit

1. Direct runtime implementation before RED tests are recorded.
2. CS2 sign-off or merge recommendation.
3. Declaring the defect fixed before tests and CI prove GREEN.

## Required Build-to-Green Outcomes

- Descriptor text must not be `criterion copy + maturity suffix`.
- Descriptor text must preserve the criterion-specific actor/action/object/context anchor.
- Descriptor text must compile criterion and maturity posture into one grammatical audit-evidence sentence.
- The rule must apply globally, not only to the criterion shown in CS2 screenshots.
- Per-level learning consent must work for Basic, Reactive, Compliant, Proactive, and Resilient edits.
- Descriptor editing must remain available until second-level/final descriptor sign-off locks the criterion.

## Evidence Required Before Handover

- Architecture addendum committed.
- QA-to-RED addendum committed.
- Runtime code and tests committed in a later builder step.
- CI/test result reported honestly.
- Foreman QP, ECAP, and IAA records created before merge recommendation.
