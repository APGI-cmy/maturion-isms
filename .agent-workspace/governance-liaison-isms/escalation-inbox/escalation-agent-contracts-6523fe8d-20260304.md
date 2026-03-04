# Escalation: Agent Contract Files Detected in Ripple Payload — 6523fe8d

## Type
AUTHORITY_BOUNDARY

## Escalation ID
ESC-AGENTFILE-6523FE8D-20260304

## Status
OPEN — Awaiting CS2 authorization and CodexAdvisor-agent assignment

## Date
2026-03-04

## Session
session-044-20260304

## Rule Triggered
A-009: "I NEVER modify any file under `.github/agents/**` — including agent contract markdown files, even to revert changes. All `.github/agents/**` changes require CodexAdvisor-agent + IAA + CS2 per AGCFPP-001. Ripple payloads containing `.github/agents/**` paths are escalation triggers, not layer-down targets."

## Description

Ripple event `6523fe8d` (canonical commit `6523fe8d42e6fb1608a7744a64e910230f9cc881`) from `APGI-cmy/maturion-foreman-governance` contains changes to agent contract files under `.github/agents/**`. Per contract rule A-009 and AGCFPP-001, the governance-liaison-isms agent **does not have authority** to directly layer down these files.

This escalation requests:
1. CS2 authorization to proceed with agent contract file layer-down
2. CodexAdvisor-agent assignment to review and apply the canonical changes
3. IAA audit of the resulting agent contract changes before merge

## Trigger
`Merge pull request -1294 from APGI-cmy-copilot-create-iaa-pre-brief-protocol`

## Changed Agent Contract Files (Canonical Source)

| File | Canonical Commit | Notes |
|------|-----------------|-------|
| `.github/agents/foreman-v2.agent.md` | 6523fe8d | Updated foreman agent contract (new version from canonical) |
| `.github/agents/independent-assurance-agent.md` | 6523fe8d | Updated IAA agent contract with IAA Pre-Brief Protocol integration |

## Important Notes

### Relationship to Prior Escalation ESC-AGENTFILE-E77B00C7-20260303

This is a second ripple event (6523fe8d, 2026-03-04) with additional agent contract file changes. The prior escalation ESC-AGENTFILE-E77B00C7-20260303 (from ripple e77b00c7, 2026-03-03) remains OPEN. CS2 should consider whether the new versions from 6523fe8d supersede or complement the versions from e77b00c7:

- `foreman-v2.agent.md`: Both ripples contain changes — the e77b00c7 ripple had v2.3.0; the 6523fe8d ripple may have a newer version
- `independent-assurance-agent.md`: Both ripples contain this file — 6523fe8d likely reflects IAA Pre-Brief Protocol integration

CS2 should prioritize 6523fe8d (most recent canonical commit) as the authoritative version when resolving both escalations together.

### Related Non-Agent Changes (Already Layered Down)

As part of this session, the following governance canon files were successfully layered down (SHA256 verified):
- `governance/canon/IAA_PRE_BRIEF_PROTOCOL.md` (new file, v1.1.0)
- `governance/canon/INDEPENDENT_ASSURANCE_AGENT_CANON.md` (updated to v1.1.0 with Pre-Brief Protocol integration)

## Actions Already Taken by governance-liaison-isms

- ✅ `governance/canon/IAA_PRE_BRIEF_PROTOCOL.md` layered down (new file, SHA256 verified)
- ✅ `governance/canon/INDEPENDENT_ASSURANCE_AGENT_CANON.md` layered down (updated, SHA256 verified)
- ✅ `governance/CANON_INVENTORY.json` updated (new entry added, hash updated)
- ✅ `governance/alignment/GOVERNANCE_ALIGNMENT_INVENTORY.json` updated
- ✅ Ripple inbox entry created: `.agent-admin/governance/ripple-inbox/ripple-6523fe8d.json`
- ✅ `sync_state.json` updated: `sync_pending: true`, `result: PARTIAL_ESCALATED`
- ✅ This escalation document created
- ✅ Session memory created: `session-044-20260304.md`

## Actions Required by CS2 / CodexAdvisor-agent

1. Fetch `.github/agents/foreman-v2.agent.md` from canonical source at commit 6523fe8d42e6fb1608a7744a64e910230f9cc881
2. Fetch `.github/agents/independent-assurance-agent.md` from canonical source at commit 6523fe8d42e6fb1608a7744a64e910230f9cc881
3. Review content vs local versions (note: local has `secret_env_var:` per IAA invariant A-024/CORE-022 — do not revert to `secret:`)
4. Apply approved changes via CodexAdvisor-agent session with IAA audit
5. Merge resulting DRAFT PR (CS2 only)
6. Update this escalation status to RESOLVED and close
7. Resolve or supersede ESC-AGENTFILE-E77B00C7-20260303 as appropriate

## Governance References

- AGCFPP-001: `governance/canon/AGENT_CONTRACT_FILE_PROTECTION_POLICY.md`
- FAIL-ONLY-ONCE A-009: `.agent-workspace/governance-liaison-isms/knowledge/FAIL-ONLY-ONCE.md`
- Ripple Transport Protocol: `governance/canon/CROSS_REPO_RIPPLE_TRANSPORT_PROTOCOL.md`
- Layer-Down Protocol: `governance/canon/CROSS_REPOSITORY_LAYER_DOWN_PROTOCOL.md`

---

*Created by governance-liaison-isms session-044-20260304*
*Authority: CS2 (Johan Ras / @APGI-cmy)*
