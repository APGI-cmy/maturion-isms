# Escalation: Agent Contract Files Detected in Ripple Payload — e77b00c7

## Type
AUTHORITY_BOUNDARY

## Escalation ID
ESC-AGENTFILE-E77B00C7-20260303

## Status
OPEN — Awaiting CS2 authorization and CodexAdvisor-agent assignment

## Date
2026-03-03

## Session
session-040-20260303

## Rule Triggered
A-009: "I NEVER modify any file under `.github/agents/**` — including agent contract markdown files, even to revert changes. All `.github/agents/**` changes require CodexAdvisor-agent + IAA + CS2 per AGCFPP-001. Ripple payloads containing `.github/agents/**` paths are escalation triggers, not layer-down targets."

## Description

Ripple event `e77b00c7` (canonical commit `e77b00c71511ae353d903f89fa85680dcbfc7cd9`) from `APGI-cmy/maturion-foreman-governance` contains changes to agent contract files under `.github/agents/**`. Per contract rule A-009 and AGCFPP-001, the governance-liaison-isms agent **does not have authority** to directly layer down these files.

This escalation requests:
1. CS2 authorization to proceed with agent contract file layer-down
2. CodexAdvisor-agent assignment to review and apply the canonical changes
3. IAA audit of the resulting agent contract changes before merge

## Changed Agent Contract Files (Canonical Source)

| File | Canonical SHA (git) | Canonical Contract Version | Local Status |
|------|---------------------|---------------------------|--------------|
| `.github/agents/CodexAdvisor-agent.md` | `d8e07cde1c2907cf415c93626b288f0ef842fbaf` | 3.2.0 | Local v3.3.0 (local is NEWER — possible layer-up situation) |
| `.github/agents/foreman-v2.agent.md` | `33ea404cec5231c03d9cc6c7367b56906bf365d9` | 2.3.0 | Local: `foreman-v2-agent.md` exists at v2.5.0 (different filename) |
| `.github/agents/governance-repo-administrator-v2.agent.md` | `7e6e98c3f1356758167a5a2325c233f6d6838ec4` | 2.0.0 | Not present locally |
| `.github/agents/independent-assurance-agent.md` | `104af34806c18a06b5521bd03e75bdbdeeba262a` | 2.0.0 | Local v2.0.0 (description changed in canonical) |

## Important Notes

### CodexAdvisor-agent.md: Local is NEWER

Local file has `contract_version: 3.3.0`; canonical has `contract_version: 3.2.0`. The local contract was updated by CodexAdvisor-agent in a prior session beyond the canonical version. This is a layer-up situation, not layer-down. CS2 must determine the resolution strategy:
- Option A: Submit a layer-up PR to `maturion-foreman-governance` to adopt local v3.3.0 as new canonical
- Option B: If canonical v3.2.0 contains corrections not in local v3.3.0, merge those corrections into the local contract

Additionally, the canonical file uses `secret: MATURION_BOT_TOKEN` (YAML key), whereas the local correctly uses `secret_env_var: "MATURION_BOT_TOKEN"` per IAA invariant A-024/CORE-022 (to avoid CI secret-scanner false positives). If any canonical content is adopted locally, this field must remain as `secret_env_var:`.

### foreman-v2.agent.md vs foreman-v2-agent.md: Filename Mismatch

The canonical source has `foreman-v2.agent.md`; local has `foreman-v2-agent.md`. These may be the same agent with a filename discrepancy. CS2 review needed to confirm whether:
- The canonical file should be copied as `foreman-v2-agent.md` (rename to match local)  
- Or a new file `foreman-v2.agent.md` should be created (leaving local `foreman-v2-agent.md` as is)

### governance-repo-administrator-v2.agent.md: Not Present Locally

This agent contract exists in the canonical source but not locally. CS2 and CodexAdvisor-agent should determine whether to introduce this agent to the maturion-isms repository.

## Actions Already Taken by governance-liaison-isms

- ✅ Ripple inbox entry created: `.agent-admin/governance/ripple-inbox/ripple-e77b00c7.json`
- ✅ `governance/sync_state.json` updated: `sync_pending: true`, `result: ESCALATED_TO_CS2`
- ✅ `governance/alignment/GOVERNANCE_ALIGNMENT_INVENTORY.json` updated with agent contract drift entries
- ✅ This escalation document created
- ✅ Session memory created: `session-040-20260303.md`

## Actions Required by CS2 / CodexAdvisor-agent

1. Review canonical changes vs local for each file listed above
2. Resolve layer-up conflict for `CodexAdvisor-agent.md` (local v3.3.0 > canonical v3.2.0)
3. Resolve filename discrepancy for `foreman-v2.agent.md` vs `foreman-v2-agent.md`
4. Decide on introduction of `governance-repo-administrator-v2.agent.md` locally
5. Apply approved changes via CodexAdvisor-agent session with IAA audit
6. Merge resulting PR (DRAFT — CS2 only)
7. Update this escalation status to RESOLVED and close

## Governance References

- AGCFPP-001: `governance/canon/AGENT_CONTRACT_FILE_PROTECTION_POLICY.md`
- FAIL-ONLY-ONCE A-009: `.agent-workspace/governance-liaison-isms/knowledge/FAIL-ONLY-ONCE.md`
- Ripple Transport Protocol: `governance/canon/CROSS_REPO_RIPPLE_TRANSPORT_PROTOCOL.md`
- Layer-Down Protocol: `governance/canon/CROSS_REPOSITORY_LAYER_DOWN_PROTOCOL.md`

---

*Created by governance-liaison-isms session-040-20260303*  
*Authority: CS2 (Johan Ras / @APGI-cmy)*
