# ISMS to MMM Routing QA-to-Red

Date: 2026-06-30
Module lane: ISMS platform shell
Runtime owner: MMM
Status: ACTIVE QA-to-RED artifact

## Objective

Make the ISMS-owned Maturity Roadmap handoff route to the MMM app when the user is entitled, without moving MMM runtime into ISMS.

## RED tests

| Test ID | Surface | Actor / State | Action | Expected RED | Expected GREEN |
|---|---|---|---|---|---|
| ISMS-MMM-RED-001 | ISMS dashboard | Entitled full-bundle user | Click Maturity Roadmap / Open module | User lands on internal ISMS `/maturity/setup` preview shell | User lands on `https://maturion-isms-mmm.vercel.app` |
| ISMS-MMM-RED-002 | ISMS `/modules` page | Entitled full-bundle user | Click Maturity Roadmap card | User lands on ISMS marketing page or internal preview shell | User lands on `https://maturion-isms-mmm.vercel.app` |
| ISMS-MMM-RED-003 | ISMS landing page module grid | Entitled full-bundle user | Click Maturity Roadmap card | User lands on ISMS marketing page or internal preview shell | User lands on `https://maturion-isms-mmm.vercel.app` |
| ISMS-MMM-RED-004 | ISMS public/marketing path | Non-entitled user | Open Maturity Roadmap public overview | User is sent to MMM runtime before entitlement/acquisition | User stays on ISMS-owned marketing/subscription path |
| ISMS-MMM-RED-005 | Boundary discipline | Any | Inspect diff | ISMS implements MMM runtime behavior | ISMS changes only routing/handoff behavior; MMM runtime untouched |

## Non-goals

- Do not implement MMM runtime.
- Do not change MMM app deployment.
- Do not change MMM scoring, assessment, evidence, or descriptor behavior.
- Do not change PIT runtime or PIT routing.
