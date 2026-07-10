# Wave 3 CodexAdvisor Authority Route Correction

**Status:** Controlling correction to the Wave 3 proposal  
**Date:** 2026-07-10  
**Authority:** CS2 / Johan Ras  
**Applies to:** PR #1920 and `Wave3_Maturion_thin_core_contract_correction_proposal_20260710.md`

## 1. Reason for correction

The Wave 3 proposal originally described a CodexAdvisor self-modification package as the prerequisite route.

That route is not permitted by the controlling governance.

`governance/canon/AGENT_CONTRACT_MANAGEMENT_PROTOCOL.md` states that:

- no agent may modify its own contract;
- the prohibition is absolute for agents;
- only CS2 may modify the CodexAdvisor contract;
- CodexAdvisor may recommend its own contract changes but may not implement them.

The IAA checklist in `AGENT_CONTRACT_FILE_PROTECTION_POLICY.md` also requires verification that CodexAdvisor is not modifying its own contract.

## 2. Superseding decision

This correction supersedes Section 5.4 and Decision 2 of the original Wave 3 proposal wherever they refer to:

- CodexAdvisor self-modification;
- a SELF-MOD-001 override;
- CodexAdvisor authoring a change to `.github/agents/CodexAdvisor-agent.md`.

No issue-level override may replace the canonical prohibition.

## 3. Correct prerequisite route

Before CodexAdvisor may update the Maturion contract, CS2 must authorise a **CS2-direct CodexAdvisor contract correction**.

The CS2-direct correction package may specify:

1. adding `orchestrator` and `specialist` to CodexAdvisor's supported classes;
2. correcting any contract language that suggests CodexAdvisor may update its own contract;
3. preserving SELF-MOD-001 as a prohibition with escalation to CS2;
4. registering the canonical Orchestrator and Specialist contract checklists;
5. operationalising the merged Wave 2 runtime-specialist bundle method in CodexAdvisor Tier 2;
6. reconciling `thin_core_living` with mandatory four-phase governance;
7. preserving final IAA, merge-gate parity, OPOJD, evidence, memory, file-size, and protected-path controls.

CodexAdvisor may prepare a recommendation package. It may not author or commit the change to its own contract.

## 4. Independent assurance

The CS2-direct contract-change PR must receive independent IAA review. IAA must verify:

- CS2 is the direct contract-change authority;
- CodexAdvisor did not modify its own contract;
- the actual diff matches the authorised specification;
- no standing self-write authority was introduced;
- no product, runtime, schema, deployment, Supabase, Vercel, or specialist-activation scope was introduced;
- all applicable agent-contract and merge gates pass.

## 5. Hard stop

This correction does not authorise:

- a change to `.github/agents/maturion-agent.md`;
- a change to Maturion Tier 2;
- runtime implementation;
- AIMC implementation;
- specialist creation or activation.

After CodexAdvisor is corrected, merged, independently assured, and declared FIT by CS2, a separate exact issue is still required for the Maturion contract correction.

## 6. Corrected Wave 3 disposition

**CodexAdvisor remains NOT FIT pending CS2-direct correction.**

**Controlling next step:** CS2-direct CodexAdvisor contract correction, not CodexAdvisor self-modification.
