# SCOPE DECLARATION — Wave DCKIS-GOV-001

**Agent**: governance-liaison-isms-agent v6.2.0
**Wave**: DCKIS-GOV-001 — MAT Governance Document Amendments
**Session**: session-052-20260319
**Date**: 2026-03-19
**Branch**: copilot/dckis-gov-001-update-governance-docs
**Authority**: CS2 (@APGI-cmy) via Foreman delegation

## Declared Scope: Files Modified

Per `git diff --name-only` output (governance documentation only — zero production code):

1. `modules/mat/00-app-description/app-description.md` — GOV-001-D1: Added §6.3 Knowledge Document Upload (Pipeline 2)
2. `modules/mat/00-app-description/MAT_UX_WORKFLOW_AND_WIRING.md` — GOV-001-D2: Added STEP 2b Knowledge Upload workflow
3. `modules/mat/01-frs/functional-requirements.md` — GOV-001-D3: Added FR-KU-001 through FR-KU-005
4. `modules/mat/01.5-trs/technical-requirements-specification.md` — GOV-001-D4: Added TR-KU-001 through TR-KU-004
5. `modules/mat/02-architecture/system-architecture.md` — GOV-001-D5: Added §4.6 Knowledge Ingestion Pipeline Architecture
6. `modules/mat/03-implementation-plan/implementation-plan.md` — GOV-001-D6: Added Wave 19 Knowledge Upload Centre Integration
7. `modules/mat/02-architecture/test-strategy.md` — GOV-001-D7: Added Pipeline 2 Knowledge Ingestion Test Coverage

## ADR-005 Compliance Attestation

Pipeline 1 files UNTOUCHED. Verified by `git diff --name-only`:
- No changes to `criteria`, `domains`, or `mini_performance_standards` related files
- No changes to any Wave 1–18 implementation files
- No changes to Pipeline 1 Edge Functions
- No production code changes (governance documentation only)

## Out-of-Scope Files (NOT modified)

All Pipeline 1 files, all production code, all agent contracts, all CI workflows, all canonical governance files.

---

*Authority: governance-liaison-isms-agent v6.2.0 | Wave DCKIS-GOV-001 | 2026-03-19*
