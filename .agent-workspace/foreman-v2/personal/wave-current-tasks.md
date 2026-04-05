# Wave Current Tasks — CL-7: LKIAC-L3 PersonaLoader Improvements

**Session**: session-cl7-personaloader-20260405
**Wave**: CL-7
**Branch**: copilot/cl-7-personaloader-improvements
**Issue**: maturion-isms#CL-7 — 🟢 Wave CL-7: LKIAC-L3 — PersonaLoader Improvements
**Date**: 2026-04-05
**CS2 Authorization**: maturion-isms#1221 (2026-04-05)

---

## Wave Objective

Implement runtime YAML front-matter validation in `PersonaLoader.ts` with a typed `PersonaValidationError`. Add CI checks for persona registry sync and quarterly freshness review.

**Resolves**: GAP-002, GAP-003, GOV-003, GOV-004

---

## Task Breakdown

| ID | Deliverable | Assigned To | Status |
|---|---|---|---|
| CL-7-D1 | RED gate test: `PersonaValidationError` thrown on missing/invalid YAML fields | `qa-builder` | PENDING |
| CL-7-D2 | RED gate test: persona registry sync CI check integration test | `qa-builder` | PENDING |
| CL-7-D3 | Implementation: `PersonaValidationError` type + runtime YAML validation in `PersonaLoader.ts` | `api-builder` | PENDING (awaiting D1+D2 RED gate) |
| CL-7-D4 | CI check: persona registry sync workflow | `integration-builder` | PENDING (awaiting D2 RED gate) |
| CL-7-D5 | Scheduled workflow: quarterly persona review freshness check | `integration-builder` | PENDING |

---

## Governance

iaa_prebrief_path: .agent-admin/assurance/iaa-prebrief-cl7-personaloader-20260405.md
fail_only_once_attested: true
fail_only_once_version: v4.0.0
unresolved_breaches: none

---

**Authority**: CS2 (Johan Ras / @APGI-cmy)
**Foreman**: foreman-v2-agent v6.2.0
