# IAA Wave Record — APW Specialist Build-to-Green v0.1

**Wave ID**: APW-SPEC-BUILD-GREEN-V01  
**Repository**: `APGI-cmy/maturion-isms`  
**Pull Request**: #1881  
**Date**: 2026-06-30  
**Scope Declaration**: `.agent-admin/scope-declarations/pr-1881.md`

---

IAA_PREFLIGHT_BRIEF:

schema_version: 1.0.0
result: PREFLIGHT_BRIEF_COMPLETE
wave_id: APW-SPEC-BUILD-GREEN-V01
repository: APGI-cmy/maturion-isms
PR: 1881
scope_summary: Batch 6 builds the internal APW Specialist adapter to green without public routing or activation.
authority: CS2 — Johan Ras

EXPECTED_QA_SCOPE:

- Review internal APW Specialist adapter and tests.
- Confirm valid public APW cases become internally eligible.
- Confirm blocked-case coverage remains intact.
- Confirm draft output remains non-final and behind Maturion.
- Confirm public chat endpoint behaviour is unchanged.
- Confirm activation remains a later separate wave.

FOREMAN_INSTRUCTIONS:

- Treat this wave as internal build-to-green only.
- Do not wire the adapter into `/api/v1/public-chat` in this PR.
- Do not activate APW Specialist in this PR.
- Do not create registry or database changes in this PR.
- Do not change build/governance agent contracts in this PR.

IAA_WILL_QA:

- IAA will check scope-to-diff parity.
- IAA will check green valid-path coverage and blocked-case coverage.
- IAA will check that public chat endpoint behaviour remains unchanged.
- IAA will check that follow-on public integration remains separately gated.

RESULT: PREFLIGHT_BRIEF_COMPLETE

---

This file records the prebrief only. It does not contain IAA final assurance, a merge verdict, or CS2 approval.
