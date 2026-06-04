# PIT Stage 12 W8.1 Deployed LFV Evidence

Issue: maturion-isms#1775
Deployment URL: `https://maturion-pit.vercel.app`
Evidence capture timestamp: 2026-06-04T07:28:03.615Z
Captured by: Johan Ras / CS2 operator, using the merged W8.1 hydrated deployed-smoke harness from PR #1778.

## Purpose

Record the W8.1 deployed route/auth hydrated-smoke evidence after PR #1777 and PR #1778.

## Routes requiring deployed direct-load and refresh evidence

- `/`
- `/login`
- `/signup`
- `/forgot-password`
- `/reset-password`
- `/invite/:token`
- `/dashboard`
- `/projects`
- `/projects/new`
- `/onboarding`

## Harness

`apps/isms-portal/scripts/pit-w81-deployed-smoke.mjs`

Executed command:

```text
PIT_W81_BASE_URL=https://maturion-pit.vercel.app node apps/isms-portal/scripts/pit-w81-deployed-smoke.mjs > pit-w81-deployed-smoke-result.json
```

PowerShell verification also returned:

```text
$LASTEXITCODE = 0
Get-Content .\pit-w81-deployed-smoke-result.json | Select-String '"pass": false|"error"' returned no rows
```

## Hydrated deployed-smoke result

```json
{
  "mode": "hydrated-browser",
  "baseUrl": "https://maturion-pit.vercel.app",
  "generatedAt": "2026-06-04T07:28:03.615Z",
  "lfValidated": true,
  "results": [
    {
      "route": "/",
      "url": "https://maturion-pit.vercel.app/",
      "finalUrl": "https://maturion-pit.vercel.app/",
      "startedAt": "2026-06-04T07:27:46.453Z",
      "status": 200,
      "hydratedAppChecked": true,
      "rootVisible": true,
      "hasMeaningfulText": true,
      "protectedRouteRedirectedToLogin": null,
      "errors": [],
      "pass": true
    },
    {
      "route": "/login",
      "url": "https://maturion-pit.vercel.app/login",
      "finalUrl": "https://maturion-pit.vercel.app/login",
      "startedAt": "2026-06-04T07:27:57.140Z",
      "status": 200,
      "hydratedAppChecked": true,
      "rootVisible": true,
      "hasMeaningfulText": true,
      "protectedRouteRedirectedToLogin": null,
      "errors": [],
      "pass": true
    },
    {
      "route": "/signup",
      "url": "https://maturion-pit.vercel.app/signup",
      "finalUrl": "https://maturion-pit.vercel.app/signup",
      "startedAt": "2026-06-04T07:27:57.972Z",
      "status": 200,
      "hydratedAppChecked": true,
      "rootVisible": true,
      "hasMeaningfulText": true,
      "protectedRouteRedirectedToLogin": null,
      "errors": [],
      "pass": true
    },
    {
      "route": "/forgot-password",
      "url": "https://maturion-pit.vercel.app/forgot-password",
      "finalUrl": "https://maturion-pit.vercel.app/forgot-password",
      "startedAt": "2026-06-04T07:27:58.538Z",
      "status": 200,
      "hydratedAppChecked": true,
      "rootVisible": true,
      "hasMeaningfulText": true,
      "protectedRouteRedirectedToLogin": null,
      "errors": [],
      "pass": true
    },
    {
      "route": "/reset-password",
      "url": "https://maturion-pit.vercel.app/reset-password",
      "finalUrl": "https://maturion-pit.vercel.app/reset-password",
      "startedAt": "2026-06-04T07:27:59.368Z",
      "status": 200,
      "hydratedAppChecked": true,
      "rootVisible": true,
      "hasMeaningfulText": true,
      "protectedRouteRedirectedToLogin": null,
      "errors": [],
      "pass": true
    },
    {
      "route": "/invite/example-token",
      "url": "https://maturion-pit.vercel.app/invite/example-token",
      "finalUrl": "https://maturion-pit.vercel.app/invite/example-token",
      "startedAt": "2026-06-04T07:27:59.927Z",
      "status": 200,
      "hydratedAppChecked": true,
      "rootVisible": true,
      "hasMeaningfulText": true,
      "protectedRouteRedirectedToLogin": null,
      "errors": [],
      "pass": true
    },
    {
      "route": "/dashboard",
      "url": "https://maturion-pit.vercel.app/dashboard",
      "finalUrl": "https://maturion-pit.vercel.app/login",
      "startedAt": "2026-06-04T07:28:00.500Z",
      "status": 200,
      "hydratedAppChecked": true,
      "rootVisible": true,
      "hasMeaningfulText": true,
      "protectedRouteRedirectedToLogin": true,
      "errors": [],
      "pass": true
    },
    {
      "route": "/projects",
      "url": "https://maturion-pit.vercel.app/projects",
      "finalUrl": "https://maturion-pit.vercel.app/login",
      "startedAt": "2026-06-04T07:28:01.073Z",
      "status": 200,
      "hydratedAppChecked": true,
      "rootVisible": true,
      "hasMeaningfulText": true,
      "protectedRouteRedirectedToLogin": true,
      "errors": [],
      "pass": true
    },
    {
      "route": "/projects/new",
      "url": "https://maturion-pit.vercel.app/projects/new",
      "finalUrl": "https://maturion-pit.vercel.app/login",
      "startedAt": "2026-06-04T07:28:01.957Z",
      "status": 200,
      "hydratedAppChecked": true,
      "rootVisible": true,
      "hasMeaningfulText": true,
      "protectedRouteRedirectedToLogin": true,
      "errors": [],
      "pass": true
    },
    {
      "route": "/onboarding",
      "url": "https://maturion-pit.vercel.app/onboarding",
      "finalUrl": "https://maturion-pit.vercel.app/login",
      "startedAt": "2026-06-04T07:28:02.530Z",
      "status": 200,
      "hydratedAppChecked": true,
      "rootVisible": true,
      "hasMeaningfulText": true,
      "protectedRouteRedirectedToLogin": true,
      "errors": [],
      "pass": true
    }
  ]
}
```

## Evidence status

| Evidence item | Status | Notes |
|---|---|---|
| Direct-load checks | PASS | Hydrated browser LFV run executed against `https://maturion-pit.vercel.app`; all W8.1 routes returned `pass: true`. |
| Refresh checks | NOT_CAPTURED | The harness executed direct deep-link loads for each route. It did not perform an explicit browser refresh/reload cycle. |
| Deep-link screenshots | OUTCOME_ONLY_NO_SCREENSHOTS | CS2 supplied a UI screenshot showing deployed `/` rendering without white screen. No per-route screenshot artifact is attached in this PR. |
| Auth redirect HAR/equivalent | OUTCOME_ONLY_DESTINATION_STATE_NOT_VERIFIED | Protected routes `/dashboard`, `/projects`, `/projects/new`, and `/onboarding` ended at `/login` with `protectedRouteRedirectedToLogin: true`; no HAR/trace artifact is attached, and React Router `location.state.from` / query-hash preservation was not verified in the deployed browser evidence. |
| Shell-state screenshots | NOT_CAPTURED | Full data/empty/loading/permission-denied/network-error screenshots are not attached and are not all externally reachable in W8.1 unauthenticated LFV. |
| Route coverage ledger | FILED | `modules/pit/12-build/w81-route-coverage-ledger.md` |
| Auth journey pass matrix | FILED | `modules/pit/12-build/w81-auth-journey-pass-matrix.md` |

## W8.1 exit decision

W8.1 deployed route/auth **hydrated smoke** is accepted as PASS for the evidence actually captured.

The deployed hydrated browser evidence proves:

- all W8.1 public routes hydrate without white-screen failure;
- protected W8.1 routes deep-link safely and redirect unauthenticated users to `/login`;
- no console/page errors were recorded by the hydrated smoke harness;
- the LFV harness exited successfully with `$LASTEXITCODE = 0` and no `pass: false` or `error` rows.

The following W8.1 evidence items remain not captured in this PR and must not be represented as passed:

- explicit browser refresh/reload checks;
- per-route screenshots;
- HAR/trace artifact;
- deployed verification of intended-destination state preservation, including query/hash behavior;
- full shell-state screenshots for data/empty/loading/permission-denied/network-error.

This PR records a valid W8.1 hydrated route/auth smoke PASS, but it does **not** by itself close every W8.1 LFV evidence row or unblock W8.2.

## Non-overclaim

This W8.1 evidence does **not** claim full PIT Stage 12 completion, CS2 L3 completion for the whole module, production handover, global `FUNCTIONAL_PASS` for PIT, or W8.2 authorization. It only accepts the W8.1 deployed hydrated route/auth smoke evidence as passed.
