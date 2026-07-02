# IAA Wave Record — APW Specialist Preview v0.1

**Wave ID**: APW-PREVIEW-V01  
**Repository**: `APGI-cmy/maturion-isms`  
**Pull Request**: #1895  
**Date**: 2026-07-02  
**Scope Declaration**: `.agent-admin/scope-declarations/pr-1895.md`

---

IAA_PREFLIGHT_BRIEF:

schema_version: 1.0.0
result: PREFLIGHT_BRIEF_COMPLETE
wave_id: APW-PREVIEW-V01
repository: APGI-cmy/maturion-isms
PR: 1895
scope_summary: Batch 8 prepares controlled APW preview use with rollback evidence.
authority: CS2 — Johan Ras

EXPECTED_QA_SCOPE:

- Review preview runbook and tests.
- Confirm preview-on behaviour uses the Batch 7 APW path.
- Confirm rollback-off behaviour returns to Maturion-only routing.
- Confirm restricted prompts do not use the APW route.
- Confirm Maturion remains final public response authority.

FOREMAN_INSTRUCTIONS:

- Treat this wave as preview-only.
- Do not enable production by default in this PR.
- Do not create registry or database changes in this PR.
- Do not change build/governance agent contracts in this PR.
- Keep the later production decision separate.

RESULT: PREFLIGHT_BRIEF_COMPLETE

---

This file records the prebrief only. It does not contain IAA final assurance, a merge verdict, or CS2 approval.
