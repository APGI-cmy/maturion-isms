# MMM Live Dashboard Diagnosis

Playwright-based diagnostic that drives the live Vercel protected-preview
deployment, logs in as the configured test admin, opens `/dashboard`, and
captures the failing `mmm-qiw-status` request (or whichever dashboard
network call is failing).

Runs from GitHub Actions via
`.github/workflows/mmm-live-dashboard-diagnosis.yml` (where the repository
secrets and the protected-preview share URL are available).

## Required secrets / inputs

| Name | Source | Purpose |
| --- | --- | --- |
| `MMM_PREVIEW_URL` | workflow input or repo variable | Full URL pointing at `/dashboard`, including `?_vercel_share=...` token |
| `MMM_TEST_ADMIN_EMAIL` | repo secret | Test admin email |
| `MMM_TEST_ADMIN_PASSWORD` | repo secret | Test admin password |
| `MMM_TEST_ADMIN_USER_ID` | repo secret | Recorded in summary only |
| `MMM_TEST_ORGANISATION_ID` | repo secret | Recorded in summary only |

## Artifacts produced

- `dashboard.png` — full-page screenshot of the dashboard route
- `console.log` — browser console + page errors
- `network.log` — human-readable network log (URLs, status, response bodies for failing/dashboard calls)
- `network.json` — machine-readable network entries
- `trace.zip` — Playwright trace (open with `npx playwright show-trace trace.zip`)
- `diagnosis-summary.md` — standard `DEPLOYMENT_ACCESS / LOGIN_SUCCESS / DASHBOARD_LOAD / FAILING_REQUEST / HTTP_STATUS / RESPONSE_BODY / CONSOLE_ERROR / LIKELY_ROOT_CAUSE / NEXT_FIX` block

## Local run

```bash
npm install --no-save playwright@1.48.2
npx playwright install --with-deps chromium
MMM_PREVIEW_URL='https://…/dashboard?_vercel_share=…' \
MMM_TEST_ADMIN_EMAIL='…' \
MMM_TEST_ADMIN_PASSWORD='…' \
node scripts/mmm-live-dashboard-diagnosis/diagnose.mjs
```

The script exits non-zero when the live dashboard failure is reproduced
(`Unable to load dashboard data. Please check your connection and try
again.` banner visible) or when a dashboard network call fails. This is
the desired behaviour: the workflow must FAIL while the live defect
exists so the diagnosis is recorded as an unmistakable signal.
