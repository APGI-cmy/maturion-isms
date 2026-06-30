# IAA Wave Record — APW Specialist Red Tests + Stubs v0.1

**Wave ID**: APW-SPEC-RED-STUBS-V01  
**Repository**: `APGI-cmy/maturion-isms`  
**Pull Request**: #1875  
**Date**: 2026-06-30  
**Scope Declaration**: `.agent-admin/scope-declarations/pr-1875.md`

---

IAA_PREFLIGHT_BRIEF:

schema_version: 1.0.0
result: PREFLIGHT_BRIEF_COMPLETE
wave_id: APW-SPEC-RED-STUBS-V01
repository: APGI-cmy/maturion-isms
PR: 1875
scope_summary: Batch 5 creates APW Specialist red tests and non-activating stubs only.
authority: CS2 — Johan Ras

EXPECTED_QA_SCOPE:

- Review APW Specialist stubs and executable red tests.
- Confirm the PR blocks unsafe context, unsafe registry, unsafe source metadata, private mandate requests and unsafe output.
- Confirm the PR proves APW Specialist is not invoked in Batch 5.
- Confirm public chat endpoint behaviour is not wired to the stubs in this wave.
- Confirm activation remains a later separate wave.

EXPECTED_FAILURE_MODES:

- Red tests accidentally enable public routing.
- Stubs are treated as production specialist activation.
- Public chat behaviour changes during Batch 5.
- Specialist code calls OpenAI, Supabase, vector search or external services.
- Registry state is created or mutated.
- Build-to-green is claimed before CS2 approves a later wave.

FOREMAN_INSTRUCTIONS:

- Treat this wave as red-tests-and-stubs only.
- Do not wire APW Specialist into `/api/v1/public-chat` in this PR.
- Do not activate APW Specialist in this PR.
- Do not create registry or database changes in this PR.
- Do not change build/governance agent contracts in this PR.
- Use IAA findings to correct scope, tests or stubs before merge.

IAA_WILL_QA:

- IAA will check scope-to-diff parity.
- IAA will check that all Batch 5 tests target denial, validation and stub boundaries.
- IAA will check that public chat endpoint behaviour remains unchanged.
- IAA will check that no activation permission is implied by this implementation footing.
- IAA will check that follow-on build-to-green remains separately gated.

RESULT: PREFLIGHT_BRIEF_COMPLETE

---

## REQUESTED IAA OUTPUT

IAA should provide a later independent assurance verdict or rejection package after reviewing the PR.

This file records the prebrief only. It does not contain IAA final assurance, a merge verdict, or CS2 approval.
