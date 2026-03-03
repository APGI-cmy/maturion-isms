# Per-Agent Parking Station Specification

**Version**: 1.0.0
**Status**: ACTIVE
**Authority**: CS2 (Johan Ras)
**Effective**: 2026-03-03
**Supersedes**: Global `.agent-workspace/parking-station/suggestions-log.md` pattern

---

## 1. Summary

Each agent writes improvement suggestions to its **own** parking station file, not to a shared
global file. This prevents merge conflicts when multiple agents complete sessions concurrently.

## 2. File Location Pattern

```
.agent-workspace/<agent-workspace-name>/parking-station/suggestions-log.md
```

Where `<agent-workspace-name>` is the agent's workspace directory name (matches `agent.id` in
the agent contract YAML, or the directory already established under `.agent-workspace/`).

## 3. Agent-to-Workspace Mapping

| Agent ID (contract YAML) | Workspace Directory | Parking Station File |
|--------------------------|---------------------|----------------------|
| CodexAdvisor-agent | `.agent-workspace/CodexAdvisor-agent/` | `CodexAdvisor-agent/parking-station/suggestions-log.md` |
| api-builder | `.agent-workspace/api-builder/` | `api-builder/parking-station/suggestions-log.md` |
| foreman-v2-agent | `.agent-workspace/foreman-v2/` ¹ | `foreman-v2/parking-station/suggestions-log.md` |
| governance-liaison-isms | `.agent-workspace/governance-liaison-isms/` | `governance-liaison-isms/parking-station/suggestions-log.md` |
| independent-assurance-agent | `.agent-workspace/independent-assurance-agent/` | `independent-assurance-agent/parking-station/suggestions-log.md` |
| integration-builder | `.agent-workspace/integration-builder/` | `integration-builder/parking-station/suggestions-log.md` |
| qa-builder | `.agent-workspace/qa-builder/` | `qa-builder/parking-station/suggestions-log.md` |
| schema-builder | `.agent-workspace/schema-builder/` | `schema-builder/parking-station/suggestions-log.md` |
| ui-builder | `.agent-workspace/ui-builder/` | `ui-builder/parking-station/suggestions-log.md` |
| mat-specialist | `.agent-workspace/mat-specialist/` | `mat-specialist/parking-station/suggestions-log.md` |
| pit-specialist | `.agent-workspace/pit-specialist/` | `pit-specialist/parking-station/suggestions-log.md` |
| risk-platform-agent | `.agent-workspace/risk-platform-agent/` | `risk-platform-agent/parking-station/suggestions-log.md` |
| criteria-generator-agent | `.agent-workspace/criteria-generator-agent/` | `criteria-generator-agent/parking-station/suggestions-log.md` |
| document-parser-agent | `.agent-workspace/document-parser-agent/` | *(create on first use)* |
| maturion-agent | `.agent-workspace/maturion-agent/` | `maturion-agent/parking-station/suggestions-log.md` |
| maturity-scoring-agent | `.agent-workspace/maturity-scoring-agent/` | *(create on first use)* |
| report-writer-agent | `.agent-workspace/report-writer-agent/` | *(create on first use)* |

> ¹ The `foreman-v2-agent` contract YAML uses `foreman-v2-agent` as its agent ID, but the
> established workspace directory is `.agent-workspace/foreman-v2/` (pre-dating consistent naming).
> Both `foreman-v2` and `foreman-v2-agent` suggestion log entries from the global file have been
> migrated to `.agent-workspace/foreman-v2/parking-station/suggestions-log.md`.

## 4. File Format

```markdown
# Parking Station — Improvement Suggestions Log

**Agent**: <agent-display-name>
**Repository**: APGI-cmy/maturion-isms
**Purpose**: Append-only index of improvement suggestions from agent session handovers.
**Pattern**: Per-agent parking station.
**Aggregation**: CI reports aggregate all `.agent-workspace/*/parking-station/suggestions-log.md` files.

---

| Date | Agent | Session | Summary | Detail |
|------|-------|---------|---------|--------|
| YYYY-MM-DD | <agent-id> | session-NNN | [TRIGGER] | One-sentence summary | session-NNN-YYYYMMDD.md |
```

## 5. Append Format (per session)

```
| YYYY-MM-DD | <agent-id> | session-NNN | [ALIGNMENT/SESSION-END/DELEGATION-IMPROVEMENT/...] | <one-sentence summary> | <session-memory-filename> |
```

## 6. Global File Status

The retired global file `.agent-workspace/parking-station/suggestions-log.md` contains a
migration notice and audit-continuity entry only. **Do not append to it.**

## 7. CI/Reporting Aggregation

CI and reporting scripts that previously read from the global file must now aggregate from:
```
.agent-workspace/*/parking-station/suggestions-log.md
```

This is a pending update. See escalation: `.agent-workspace/governance-liaison-isms/escalation-inbox/escalation-ci-parking-station-aggregation-20260303.md`.

## 8. Agent Contract Update Requirement

All agent contracts (`.github/agents/*.md`) must be updated to reference the per-agent path
in their Phase 4.2 parking station instruction. This requires CodexAdvisor-agent + IAA + CS2
per AGCFPP-001.

See escalation: `.agent-workspace/governance-liaison-isms/escalation-inbox/escalation-agent-contracts-parking-station-20260303.md`.

---

*Authority: CS2 (Johan Ras) | Created: 2026-03-03 by governance-liaison-isms (session-039)*
*Governance: LIVING_AGENT_SYSTEM.md v6.2.0*
