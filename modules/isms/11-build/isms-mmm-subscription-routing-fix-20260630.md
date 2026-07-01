# ISMS MMM Subscription Routing Fix Evidence

Date: 2026-06-30
Module lane: ISMS platform shell
Related runtime owner: MMM
Status: Build-to-green correction evidence

## Defect observed

After PR #1879 deployment, clicking Maturity Roadmap from the ISMS landing page correctly opened the ISMS Maturity Roadmap marketing page for a non-entitled user. However, clicking `Subscribe to Maturity Roadmap` navigated to the generic subscription page, where the subscription catalogue only exposed Project Implementation Tracker.

The user then entered the PIT checkout/onboarding flow instead of a Maturity Roadmap subscription flow.

## Correction

- Maturity Roadmap marketing CTAs now navigate directly to checkout with `modules=maturity-roadmap` and source `maturity-roadmap-marketing`.
- The ISMS static subscription catalogue now includes `maturity-roadmap` so checkout can represent the intended selection.

## Boundary discipline

- ISMS owns this marketing/subscription/checkout routing correction.
- MMM runtime remains untouched.
- PIT runtime remains untouched.

## Verification expectation

After deployment:

1. Non-entitled user clicks Maturity Roadmap on ISMS landing page.
2. User lands on ISMS Maturity Roadmap marketing page.
3. User clicks `Subscribe to Maturity Roadmap`.
4. User lands on checkout with `modules=maturity-roadmap`, not PIT.
5. After mock checkout/onboarding, entitled Maturity Roadmap handoff can proceed to the MMM app host.
