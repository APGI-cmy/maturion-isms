# SCOPE_DECLARATION — wave-disable-automatic-injections-and-reinforce-contract

**Wave**: wave-disable-automatic-injections-and-reinforce-contract
**Session**: session-wave-disable-automatic-injections-20260311
**Date**: 2026-03-11
**Branch**: copilot/disable-automatic-injections-yet-again
**Issue**: maturion-isms#1061 — "Please finish this job"
**Agent**: foreman-v2-agent v6.2.0 / Contract v2.7.0

---

## Scope Declaration

All files modified in this wave (git diff --name-only origin/main...HEAD):

| File | Change Type | Category |
|------|-------------|----------|
| `.agent-admin/assurance/iaa-prebrief-wave-disable-automatic-injections-and-reinforce-contract.md` | NEW | PRE_BRIEF_ASSURANCE |
| `.agent-admin/assurance/iaa-token-session-wave-disable-automatic-injections-20260311.md` | NEW | IAA_TOKEN |
| `.agent-workspace/foreman-v2/memory/PREHANDOVER-wave-disable-automatic-injections-20260311.md` | NEW | CEREMONY |
| `.agent-workspace/foreman-v2/memory/session-wave-disable-automatic-injections-20260311.md` | NEW | CEREMONY |
| `.agent-workspace/foreman-v2/parking-station/suggestions-log.md` | MODIFIED | CEREMONY |
| `.agent-workspace/independent-assurance-agent/knowledge/iaa-category-overlays.md` | MODIFIED | KNOWLEDGE_GOVERNANCE |
| `.agent-workspace/independent-assurance-agent/knowledge/index.md` | MODIFIED | KNOWLEDGE_GOVERNANCE |
| `.agent-workspace/independent-assurance-agent/memory/session-wave-disable-automatic-injections-20260311.md` | NEW | IAA_SESSION |
| `.agent-workspace/independent-assurance-agent/parking-station/suggestions-log.md` | MODIFIED | CEREMONY |
| `.github/agents/foreman-v2-agent.md` | MODIFIED | AGENT_CONTRACT |
| `.github/workflows/agent-bootstrap-inject.yml` | MODIFIED | CI_WORKFLOW |
| `.github/workflows/foreman-reanchor.yml` | MODIFIED | CI_WORKFLOW |
| `.github/workflows/iaa-prebrief-gate.yml` | MODIFIED | CI_WORKFLOW |
| `.github/workflows/iaa-prebrief-inject.yml` | MODIFIED | CI_WORKFLOW |
| `.github/workflows/injection-audit-report.yml` | MODIFIED | CI_WORKFLOW |
| `.github/workflows/polc-boundary-gate.yml` | MODIFIED | CI_WORKFLOW |
| `governance/CANON_INVENTORY.json` | MODIFIED | CANON_GOVERNANCE |
| `governance/canon/INDEPENDENT_ASSURANCE_AGENT_CANON.md` | MODIFIED | CANON_GOVERNANCE |
| `SCOPE_DECLARATION.md` | MODIFIED | CEREMONY |

---

**Authority**: CS2 (Johan Ras / @APGI-cmy)
**IAA Pre-Brief**: `.agent-admin/assurance/iaa-prebrief-wave-disable-automatic-injections-and-reinforce-contract.md`

---

**A-031 Carve-Out Note:**
> IAA ceremony artifacts committed on this branch by the IAA agent (IAA session memory files,
> IAA rejection token files, IAA parking station updates) from R1 rejection (commit de3ceaf),
> R2 rejection (commit e5bd632), and any R3/R4 IAA invocation artifacts are excluded from the
> scope table above per A-031 carve-out. These are IAA-owned files committed by IAA after
> PREHANDOVER was committed; producing agent deliverables are fully declared in the table above.
# SCOPE DECLARATION — wave-polc-boundary-fix-1052 — 2026-03-10

**Wave**: wave-polc-boundary-fix-1052
**Branch**: copilot/fix-poll-validation-issue
**Issue**: maturion-isms#1052 — Bug: POLC Boundary Validation fires false positives on Copilot PRs where agent is acting as builder (not Foreman)
**Session**: session-wave-polc-boundary-fix-1052-20260310
**Agent**: foreman-v2-agent v6.2.0
**Date**: 2026-03-10

---

### Wave Deliverables
- `.github/workflows/polc-boundary-gate.yml` — T-POLC-FIX-001/002: label bypass + session-memory-check scoping fix

### Governance Ceremony Artifacts
- `.agent-admin/assurance/iaa-prebrief-wave-polc-boundary-fix-1052.md` — IAA pre-brief (retroactive, CS2-authorized)
- `.agent-admin/assurance/iaa-token-session-wave-polc-boundary-fix-1052-20260310.md` — IAA rejection/token file
- `.agent-workspace/foreman-v2/personal/wave-current-tasks.md` — wave task register (wave-polc-boundary-fix-1052 block)
- `.agent-workspace/foreman-v2/memory/PREHANDOVER-session-wave-polc-boundary-fix-1052-20260310.md` — PREHANDOVER proof
- `.agent-workspace/foreman-v2/memory/session-wave-polc-boundary-fix-1052-20260310.md` — session memory
- `.agent-workspace/foreman-v2/parking-station/suggestions-log.md` — parking station entry
- `.agent-workspace/independent-assurance-agent/memory/session-wave-polc-boundary-fix-1052-20260310.md` — IAA session memory
- `.agent-workspace/independent-assurance-agent/parking-station/suggestions-log.md` — IAA parking station
- `SCOPE_DECLARATION.md` — this file

Total: 1 production/CI file + 9 governance ceremony files. No .github/agents/ files. No schema/frontend/API files.

### Out of Scope (not modified)
- No `.github/agents/` files
- No frontend code
- No new table schemas
- No backend API routes

*Scope written per A-029 | 2026-03-10 — fresh overwrite of prior wave scope*
