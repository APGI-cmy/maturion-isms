# IAA Trigger Table

**Agent**: independent-assurance-agent
**Version**: 1.0.0 — STUB
**Status**: STUB — must be populated from INDEPENDENT_ASSURANCE_AGENT_CANON.md before Phase B activation
**Last Updated**: 2026-02-25

---

## Purpose

This table defines when IAA activates and when it is exempt for a given PR.
IAA uses this table in Phase 2 Step 2.3 for PR category classification.

**AMBIGUITY RULE**: If classification is unclear, IAA IS required (FAIL-ONLY-ONCE A-003).
Default: MANDATORY INVOCATION when in doubt.

---

## Trigger Table

| PR Category | Trigger Condition | IAA Required? | Notes |
|-------------|------------------|---------------|-------|
| AGENT_CONTRACT | Any `.github/agents/*.md` file created or modified | YES — MANDATORY | All agent classes. No exceptions. Foreman, builder, overseer, specialist all included. FAIL-ONLY-ONCE A-002. |
| CANON_GOVERNANCE | Any `governance/canon/` file created or modified | YES | Includes CANON_INVENTORY.json updates |
| CI_WORKFLOW | Any `.github/workflows/` file created or modified | YES | |
| AAWP_MAT | Any AAWP or MAT deliverable artifact | YES | Check Tier 2 index for AAWP/MAT artifact definition |
| MIXED | PR contains both triggering and non-triggering artifacts | YES — MANDATORY | Ambiguity rule applies. Any triggering artifact activates IAA for the whole PR. |
| EXEMPT | Doc-only, parking station updates, session memory files, README changes | NO — if unambiguously doc-only | Must be unambiguously doc-only with no agent/governance/CI artifacts |
| AMBIGUOUS | Classification unclear | YES — MANDATORY | FAIL-ONLY-ONCE A-003: ambiguity resolves to mandatory invocation |

---

## Class-Based Exemption Prohibition

No agent class is exempt from the AGENT_CONTRACT trigger. Specifically:
- Foreman class: NOT exempt. Double-layer QA is constitutional. Authority: maturion-isms#523, #528, #531.
- Builder class: NOT exempt.
- Overseer class: NOT exempt.
- Specialist class: NOT exempt.
- Assurance class (IAA itself): IAA cannot self-review. Escalate to CS2.

---

## Stub Population Instructions

Extract detailed trigger specifications from:
`governance/canon/INDEPENDENT_ASSURANCE_AGENT_CANON.md`

Timeline: Before Phase B activation. CS2 authorization required.

---

**Authority**: CS2 (Johan Ras) | **Living Agent System**: v6.2.0
