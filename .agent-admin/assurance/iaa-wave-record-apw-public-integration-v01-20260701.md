# IAA Wave Record — Public APW Maturion Integration v0.1

**Wave ID**: APW-PUBLIC-INTEGRATION-V01  
**Repository**: `APGI-cmy/maturion-isms`  
**Pull Request**: #1887  
**Date**: 2026-07-01  
**Scope Declaration**: `.agent-admin/scope-declarations/pr-1887.md`

---

IAA_PREFLIGHT_BRIEF:

schema_version: 1.0.0
result: PREFLIGHT_BRIEF_COMPLETE
wave_id: APW-PUBLIC-INTEGRATION-V01
repository: APGI-cmy/maturion-isms
PR: 1887
scope_summary: Batch 7 integrates Public APW routing behind a default-off control.
authority: CS2 — Johan Ras

EXPECTED_QA_SCOPE:

- Review public chat route integration and tests.
- Confirm default-off behaviour preserves current public chat responses.
- Confirm enabled behaviour uses internal APW draft support only for valid public APW questions.
- Confirm unsafe or private requests do not use APW draft support.
- Confirm Maturion remains final response authority.

FOREMAN_INSTRUCTIONS:

- Treat this wave as feature-flagged integration only.
- Keep the APW integration disabled by default.
- Do not activate APW Specialist in production in this PR.
- Do not create registry or database changes in this PR.
- Do not change build/governance agent contracts in this PR.

IAA_WILL_QA:

- IAA will check scope-to-diff parity.
- IAA will check default-off and enabled-route coverage.
- IAA will check that public chat endpoint behaviour remains safe.
- IAA will check that follow-on activation remains separately gated.

RESULT: PREFLIGHT_BRIEF_COMPLETE

---

This file records the prebrief only. It does not contain IAA final assurance, a merge verdict, or CS2 approval.
