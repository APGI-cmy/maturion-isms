# Lesson Learned — IAA Oversight Omission from Foreman Contract

**Date**: 2026-02-25  
**Session type**: Governance stop-and-fix  
**Issue**: maturion-isms#523  
**Authority**: CS2 (Johan Ras / @APGI-cmy)  
**Classification**: FAIL-ONLY-ONCE — Governance Omission Class  
**Incident ID**: INC-IAA-OMISSION-20260225  
**Status**: REMEDIATED

---

## What Happened

The Foreman v2 agent contract (`.github/agents/foreman-v2-agent.md`) was upgraded to contract version 2.3.0 without including the explicit IAA oversight declarations required by recent constitutional amendments. Specifically:

1. **Missing `iaa_oversight` YAML block**: The contract YAML frontmatter had no `iaa_oversight` block explicitly declaring IAA as mandatory for all wave handovers, referencing the verdict-handling protocol, or linking to AGCFPP-001.

2. **Missing AGCFPP-001 reference in governance block**: The `governance` YAML section did not reference the Agent Contract File Protection Policy (AGCFPP-001), which governs all `.github/agents/` modifications and mandates IAA audit after CodexAdvisor changes.

3. **Missing IAA submission in capabilities block**: The `capabilities` YAML block did not enumerate `iaa_submission` as a mandatory capability, leaving the contract ambiguous on whether IAA invocation was a core functional responsibility.

4. **Missing IAA canon in `expected_artifacts`**: The `governance.expected_artifacts` list did not include `governance/canon/INDEPENDENT_ASSURANCE_AGENT_CANON.md`, meaning the agent could not verify the IAA governance canon at preflight.

**Note**: Phase 4 Step 4.3a (IAA Independent Audit) WAS present in the contract body. The omission was entirely in the YAML frontmatter structural declarations — the execution step existed but was not reflected in the machine-readable contract metadata.

---

## Root Cause

**Primary**: YAML frontmatter was not updated in parallel with Phase 4 body text additions. The YAML blocks (governance, capabilities, metadata) and the Markdown phase steps are two representations of the same contract requirements; they must be kept in sync. When Step 4.3a was added to the Phase 4 body, the corresponding YAML structural declarations were not added.

**Secondary**: No checklist gate explicitly required verification that all YAML capability blocks mirror all Phase 4 steps. The `agent-file-non-negotiables-checklist.md` gates focus on structural presence of YAML blocks but do not include a cross-reference check: "does every mandatory Phase 4 action have a corresponding YAML capability declaration?"

**Contributing factor**: AGCFPP-001 was created after the initial Foreman v2 contract was written. When AGCFPP-001 was enacted, a ripple to foreman-v2-agent.md's governance block was required but not executed.

---

## Corrective Actions (Completed)

| # | Action | Evidence |
|---|--------|----------|
| 1 | Added `iaa_oversight` block to YAML frontmatter with full verdict-handling protocol and AGCFPP-001 policy reference | `foreman-v2-agent.md` v2.4.0 |
| 2 | Added `AGCFPP-001` reference to `governance.policy_refs` in YAML | `foreman-v2-agent.md` v2.4.0 |
| 3 | Added `iaa_submission` block to `capabilities` YAML (MANDATORY for all sub-items) | `foreman-v2-agent.md` v2.4.0 |
| 4 | Added `governance/canon/INDEPENDENT_ASSURANCE_AGENT_CANON.md` to `governance.expected_artifacts` | `foreman-v2-agent.md` v2.4.0 |
| 5 | Created this lesson-learned file per FAIL-ONLY-ONCE root cause protocols | This file |
| 6 | A-010 already locked in FAIL-ONLY-ONCE.md (maturion-isms#523, 2026-02-25) | `.agent-workspace/foreman-v2/knowledge/FAIL-ONLY-ONCE.md` A-010 |

---

## Universal A-Rule Derived

This omission is already captured as **A-010** in `FAIL-ONLY-ONCE.md`:

> **A-010 (IAA-INVOKE-001)**: All Foreman wave handovers MUST include an IAA independent audit (Step 4.3a) before merge gate release. IAA audit token MUST be recorded in the PREHANDOVER proof. IAA STOP-AND-FIX halts handover. IAA ESCALATE routes to CS2. Foreman's role as QA agent does NOT exempt it from IAA oversight.

---

## Prevention: What Will Stop This Recurring

1. **YAML–Phase alignment rule**: When adding a mandatory Phase 4 action, ALWAYS simultaneously add the corresponding YAML capability declaration. These are two views of the same requirement; they must stay in sync.

2. **New governance policy → contract ripple check**: When a new governance policy (e.g., AGCFPP-001) is enacted, all agent contracts in scope must be checked for required references. The Foreman contract is in scope for AGCFPP-001 because it can initiate changes that require CodexAdvisor involvement.

3. **IAA oversight is unconditional for Foreman**: Foreman's role as the QA gatekeeper does NOT exempt it from IAA oversight. The double layer (Foreman QAs builders; IAA QAs Foreman) is a constitutional design choice, not optional. Any suggestion that "Foreman is already QA so doesn't need IAA" is incorrect and must be rejected.

---

## Open Improvement Suggestion

**S-008 (derived from this incident)**: Add a cross-reference gate to the `agent-file-non-negotiables-checklist.md` that verifies every mandatory Phase 4 action has a corresponding YAML capability declaration. This prevents YAML-vs-phase-body desync from going undetected.

Add to `.agent-workspace/parking-station/suggestions-log.md`:
`| 2026-02-25 | foreman-v2-agent | lesson-learned-iaa-omission | Add cross-reference gate to non-negotiables checklist: every mandatory Phase 4 action must have a corresponding YAML capability declaration | lesson-learned-iaa-omission-20260225.md |`

---

*Authority: CS2 (Johan Ras) | Governance Ref: maturion-isms#523 | AGCFPP-001 | FAIL-ONLY-ONCE A-010*  
*Created: 2026-02-25 | Status: REMEDIATED*
