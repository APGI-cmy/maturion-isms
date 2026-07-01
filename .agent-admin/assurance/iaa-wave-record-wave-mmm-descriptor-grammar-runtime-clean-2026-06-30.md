# IAA Wave Record - MMM Descriptor Grammar Runtime Clean Build

Wave ID: wave-mmm-descriptor-grammar-runtime-clean-2026-06-30
Parent wave: wave-mmm-descriptor-grammar-closure-2026-06-30
Issue: #1871
Module: MMM
Status: PRE-BRIEF ONLY

## PRE-BRIEF

IAA_PREFLIGHT_BRIEF

EXPECTED_QA_SCOPE:
- Verify RACI wording normalization: are to be clearly defined -> are clearly defined.
- Verify incentive wording normalization: Assessing incentive schemes and measures for their impact on Security -> incentive schemes and measures are assessed for their impact on Security.
- Verify should be, will be, shall be, and must be wording becomes evidence-state wording.
- Verify descriptor editing remains available until a later explicit signoff lock.

EXPECTED_FAILURE_MODES:
- Descriptor output preserves raw criterion wording in the maturity sentence.
- Descriptor output begins with Evidence that Assessing incentive schemes.
- Descriptor output loses the specific criterion object.
- Work widens into ISMS route, subscription, onboarding, signoff, Vercel, PIT, Risk, RADAM, or other module scope.

FOREMAN_INSTRUCTIONS:
- Keep the work focused on issue #1871 and MMM descriptor grammar only.
- Preserve prebrief -> builder appointment -> first implementation commit order.
- Use the existing QA-to-red expectations from modules/MMM/05-qa-to-red/descriptor-grammar-closure-qa-to-red.md.

IAA_WILL_QA:
- Scope remains MMM descriptor grammar closure.
- Tests cover the CS2 examples.
- The final descriptor text preserves criterion meaning.
- Governance order is machine-checkable.

RESULT: PREFLIGHT_BRIEF_COMPLETE

## FINAL ASSURANCE

Not performed in this record.
