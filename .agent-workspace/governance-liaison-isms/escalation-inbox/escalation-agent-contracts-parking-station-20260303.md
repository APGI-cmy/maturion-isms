# Escalation: Agent Contract Parking Station Path Update Required

## Type
AUTHORITY_BOUNDARY

## Description
All agent contracts in `.github/agents/*.md` must be updated to change their Phase 4.2 parking
station instruction from the retired global path to the per-agent path.

**Current path (in all contracts):**
```
.agent-workspace/parking-station/suggestions-log.md
```

**Required new path (per agent):**
```
.agent-workspace/<agent-workspace-name>/parking-station/suggestions-log.md
```

This change is OUTSIDE the governance-liaison-isms write_access scope. Per AGCFPP-001, all
`.github/agents/*.md` modifications require CodexAdvisor-agent + IAA audit + CS2 authorization.

## Scope — Contracts Requiring Update

The following 9 agent contracts have actual parking station path references that must be updated
(search for `.agent-workspace/parking-station/suggestions-log.md`):

| Agent Contract File | Line | Required New Path |
|---------------------|------|-------------------|
| `.github/agents/governance-liaison-isms-agent.md` | 718 | `.agent-workspace/governance-liaison-isms/parking-station/suggestions-log.md` |
| `.github/agents/foreman-v2-agent.md` | 601 | `.agent-workspace/foreman-v2/parking-station/suggestions-log.md` |
| `.github/agents/CodexAdvisor-agent.md` | 587, 717 | `.agent-workspace/CodexAdvisor-agent/parking-station/suggestions-log.md` |
| `.github/agents/independent-assurance-agent.md` | 539 | `.agent-workspace/independent-assurance-agent/parking-station/suggestions-log.md` |
| `.github/agents/api-builder.md` | 438 | `.agent-workspace/api-builder/parking-station/suggestions-log.md` |
| `.github/agents/qa-builder.md` | 541 | `.agent-workspace/qa-builder/parking-station/suggestions-log.md` |
| `.github/agents/schema-builder.md` | 477 | `.agent-workspace/schema-builder/parking-station/suggestions-log.md` |
| `.github/agents/ui-builder.md` | 507 | `.agent-workspace/ui-builder/parking-station/suggestions-log.md` |
| `.github/agents/integration-builder.md` | 478 | `.agent-workspace/integration-builder/parking-station/suggestions-log.md` |

**Not requiring update (no parking station references found):**
criteria-generator-agent.md, document-parser-agent.md, mat-specialist.md, maturion-agent.md,
maturity-scoring-agent.md, pit-specialist.md, report-writer-agent.md, risk-platform-agent.md

## Context
- Session: session-039-20260303
- Task: [Propagation][Parking Station] Update all agent contracts to use per-agent parking station file paths
- Blocked at: Phase 3 — agent contract updates are escalation_required per AGCFPP-001
- Related governance spec: `governance/PER_AGENT_PARKING_STATION_SPEC.md`
- Per-agent parking station files: CREATED (migration complete for all active agents)
- Global file: RETIRED with migration notice

## Recommendation
1. Assign to CodexAdvisor-agent per AGCFPP-001
2. CodexAdvisor-agent searches all agent contracts for `.agent-workspace/parking-station/` references
3. Updates each Phase 4.2 parking station instruction to the per-agent path
4. IAA audit of contract changes
5. CS2 approval and merge

## Evidence
- Related governance spec: `governance/PER_AGENT_PARKING_STATION_SPEC.md`
- Per-agent parking station files: `.agent-workspace/*/parking-station/suggestions-log.md`
- Retired global file: `.agent-workspace/parking-station/suggestions-log.md`
- Session memory: `.agent-workspace/governance-liaison-isms/memory/session-039-20260303.md`

---
Created: Session 039 | Date: 2026-03-03
Authority: CS2 — escalated per AGCFPP-001 and governance-liaison contract A-05
