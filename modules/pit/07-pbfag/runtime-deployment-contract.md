# PIT Stage 7 — Runtime / Deployment Contract (Pre-Build)

## Contract Posture

| Field | Value |
|---|---|
| Contract Status | PASS_WITH_NON_BLOCKING_NOTES |
| Purpose | Define boundaries/assumptions for future implementation planning |
| Activation | Not activated in Stage 7 |
| Build Authorization Impact | None (remains NOT CLEARED) |

## Boundary Matrix

| Area | Contract Requirement | Ownership / Boundary |
|---|---|---|
| Vercel deployment surface | PIT runtime verification must occur on deployed environment URLs, not localhost-only | Delivery runtime boundary only; no Stage 7 deployment config changes |
| React + Vite SPA assumptions | Client app expected as SPA shell with route hydration and app-shell rendering in all required states | Implementation-stage concern; Stage 7 defines checks only |
| TanStack Router deep-link/fallback | Direct URL loads for all 27 routes must resolve with SPA fallback, including refresh behaviour and `*` route | Contract only; no Vercel rewrite edits in Stage 7 |
| Supabase URL/anon/service role boundaries | Client uses URL + anon key only; service role restricted to trusted server context; never exposed to browser evidence capture | Security boundary declared; no secret/config mutations |
| Edge Function deployment assumptions | Edge functions are assumed deployable targets for future stage validation (approved gateway pattern retained) | No function deployment performed in Stage 7 |
| Storage bucket assumptions | Evidence/report buckets must enforce role-aware access controls and deny unauthorized direct reads | Policy validation planning only |
| Environment variables | Names/owners must be explicitly tracked per environment before functional verification execution | Ownership documented in implementation stage; not created here |
| Vercel deployment protection/bypass | Bypass/test-access strategy must be explicit before live LFV execution | Strategy required, not activated in Stage 7 |
| GitHub Actions vs interactive agent runtime | CI secrets/runtime are distinct from interactive verification runtime; both paths require explicit identity tracing | Boundary documented for LFV controls |
| SHA matching | Verification artifacts must record deployed URL + PR/head SHA and match expected commit | Mandatory evidence condition |
| LFV workflow activation point | Activation of live LFV workflow is Stage 8+ authorised action only | Explicitly out of Stage 7 scope |
| Deployment evidence before functional claims | Screenshots, HAR/network logs, traces, console logs, verification report, URL, SHA, role identity are required before any functional pass claim | Stage 7 requirement declaration only |

## Explicit Non-Actions in Stage 7

- No `.github/workflows/` changes
- No runtime/deployment config creation
- No secret installation
- No functional pass declaration

