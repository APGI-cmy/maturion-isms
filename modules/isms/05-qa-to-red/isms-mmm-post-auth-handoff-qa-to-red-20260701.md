# ISMS MMM Post Auth Handoff QA-to-Red

Date: 2026-07-01
Module lane: ISMS platform shell
Runtime owner: MMM
Status: ACTIVE QA-to-RED artifact

## Objective

Ensure Maturity Roadmap checkout and mock sign-in continue to the MMM app host instead of generic ISMS onboarding.

## RED tests

| Test ID | Surface | Actor / State | Action | Expected RED | Expected GREEN |
|---|---|---|---|---|---|
| ISMS-MMM-AUTH-RED-001 | Maturity Roadmap checkout | Non-signed-in user | Complete mock checkout | User is sent to generic `/auth` with `/onboarding` continuation | User is sent to mock auth with MMM app continuation target |
| ISMS-MMM-AUTH-RED-002 | Mock sign-in | Non-signed-in user after Maturity Roadmap checkout | Enter work email and continue | User lands on `/onboarding` | User lands on `https://maturion-isms-mmm.vercel.app` |
| ISMS-MMM-AUTH-RED-003 | PIT checkout | Non-signed-in PIT user | Complete mock checkout and sign-in | PIT route changes unexpectedly | Existing PIT behavior remains unchanged |
| ISMS-MMM-AUTH-RED-004 | Boundary discipline | Any | Inspect diff | ISMS implements MMM runtime behavior | ISMS changes only checkout/auth handoff routing; MMM runtime untouched |

## Non-goals

- Do not implement MMM runtime.
- Do not change MMM app deployment.
- Do not change PIT runtime or PIT routing.
