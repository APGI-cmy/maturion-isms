# P1 External Deployment Proof

Status: VERIFIED WITH FOLLOW-UP FINDINGS

Verified production Vercel project: maturion-isms-portal.

Production deployment inspected: dpl_wwAYwu19XLPP1Kzm8cmvF2q1SqNC.

Production domain: https://maturion-isms-portal.vercel.app.

Deployment state: READY.

Target: production.

Branch: main.

Commit: 21e278ed6336fd9f171c577719e64c29a6d14bc8.

Routes checked through Vercel connector:

- / returned 200 OK.
- /dashboard returned 200 OK.
- /maturity/setup returned 200 OK.
- /free-assessment returned 200 OK.
- /subscribe returned 200 OK.
- /modules/maturity-roadmap returned 200 OK.

Deep links returned the Vite SPA shell, confirming representative SPA fallback behavior.

Runtime log check for the production deployment returned no logs for the checked one-hour window.

Follow-up findings:

- Vercel project latestDeployment currently points to a non-production branch deployment in ERROR state, while production remains READY.
- Node engine and pnpm lockfile version alignment should be reviewed.
- Build logs included non-ISMS API TypeScript errors even though production deployment completed.
- Bundle size warning should be reviewed later.

This P1 record proves the production domain serves the ISMS SPA and representative deep links externally. It does not close later production hardening work.