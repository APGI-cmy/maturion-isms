# ISMS MMM Post Auth Handoff Build-to-Green Evidence

Date: 2026-07-01
Module lane: ISMS platform shell
Runtime owner: MMM
Status: Build-to-green correction evidence

## Defect observed

After PR #1884 deployment, the Maturity Roadmap marketing and checkout selection were correct, but the post-checkout continuation still used the generic ISMS onboarding path.

Observed journey:

1. Landing page Maturity Roadmap card opened the Maturity Roadmap marketing page.
2. Get Started opened checkout with Maturity Roadmap selected.
3. Mock checkout opened mock sign-in.
4. Mock sign-in continued to `/onboarding` instead of the MMM app host.

## Correction

- Maturity Roadmap-only checkout now resolves its continuation route to the MMM app host.
- If the user is already signed in, successful Maturity Roadmap checkout opens the MMM app host directly.
- If the user is not signed in, the mock auth continuation target is the MMM app host.
- Mock sign-in now supports external module continuation routes.

## Boundary discipline

- ISMS owns this checkout/auth continuation correction.
- MMM runtime remains untouched.
- PIT runtime and PIT checkout continuation remain unchanged.

## Verification expectation

After deployment:

1. Non-entitled user opens Maturity Roadmap marketing from ISMS.
2. User selects Get Started or Subscribe to Maturity Roadmap.
3. Checkout shows Maturity Roadmap.
4. Mock checkout opens mock sign-in when needed.
5. Mock sign-in continues to `https://maturion-isms-mmm.vercel.app`.
6. If the MMM host renders blank, that is MMM deployment/runtime evidence for the MMM agent, not an ISMS routing failure once the URL handoff is correct.
