# PARKING_STATION_PATH_STANDARD

**Status**: CANONICAL | **Version**: 1.0.0 | **Authority**: CS2 (Johan Ras)  
**Effective Date**: 2026-04-13

---

## 1. Purpose

This canon establishes the **canonical per-agent parking station path** and formalises the requirement that each agent writes suggestions only to its own dedicated file. It deprecates the legacy shared `suggestions-log.md` and the interim per-agent files in the shared `.agent-workspace/parking-station/` directory.

---

## 2. Canonical Path

Each agent MUST write parking station suggestions to:

```
.agent-workspace/<agent-name>/parking-station/suggestions-log.md
```

Where `<agent-name>` is the agent's workspace directory name as it appears under `.agent-workspace/`. Examples:

| Agent ID | Canonical Suggestions Log Path |
|----------|-------------------------------|
| `governance-repo-administrator` | `.agent-workspace/governance-repo-administrator/parking-station/suggestions-log.md` |
| `CodexAdvisor-agent` | `.agent-workspace/CodexAdvisor-agent/parking-station/suggestions-log.md` |
| `foreman-v2` | `.agent-workspace/foreman-v2/parking-station/suggestions-log.md` |
| `independent-assurance-agent` | `.agent-workspace/independent-assurance-agent/parking-station/suggestions-log.md` |

### 2.1 Rules

1. Each agent MUST write suggestions **only** to its own file at the canonical path above.
2. No agent may write to another agent's suggestions log.
3. No agent may write to the deprecated shared file (`.agent-workspace/parking-station/suggestions-log.md`).
4. No agent may write to the deprecated per-agent files in the shared directory (e.g., `.agent-workspace/parking-station/suggestions-log-{agent-id}.md`).

---

## 3. Row Format

Each suggestion entry is a Markdown table row with exactly six columns:

```
| YYYY-MM-DD | {agent-id} | session-NNN | [PHASE] | <summary> | <evidence-file> |
```

- **Date**: ISO 8601 date
- **Agent**: Agent identifier
- **Session**: Session reference
- **Phase**: Optional context label (e.g., `DRAFT-PHASE`, `SESSION-END`, or blank)
- **Suggestion**: Plain-language description (1–2 sentences)
- **Evidence**: Session memory filename containing full detail

---

## 4. File Template

When creating a new agent's parking station suggestions log, use this template:

```markdown
# Suggestions Log — <agent-name>

Agent suggestions for governance promotion. Reviewed periodically by CS2.

**Scope**: Entries from the `<agent-name>` agent only.
**Convention**: Per-agent parking station — see `governance/canon/PARKING_STATION_PATH_STANDARD.md`.

| Date | Agent | Session | Phase | Suggestion | Evidence |
|------|-------|---------|-------|------------|----------|
```

---

## 5. Aggregate View

To produce a combined view of all agent suggestions (e.g., for CS2 review), scan all agent workspace directories:

```bash
find .agent-workspace/*/parking-station -name "suggestions-log.md" -exec cat {} +
```

Or list individual agent files:

```bash
cat .agent-workspace/governance-repo-administrator/parking-station/suggestions-log.md
cat .agent-workspace/CodexAdvisor-agent/parking-station/suggestions-log.md
cat .agent-workspace/foreman-v2/parking-station/suggestions-log.md
cat .agent-workspace/independent-assurance-agent/parking-station/suggestions-log.md
```

---

## 6. Deprecated Paths

The following paths are **deprecated** and MUST NOT receive new entries:

| Deprecated Path | Status | Replacement |
|----------------|--------|-------------|
| `.agent-workspace/parking-station/suggestions-log.md` | RETIRED — read-only archive | Per-agent files at canonical path (§2) |
| `.agent-workspace/parking-station/suggestions-log-{agent-id}.md` | DEPRECATED — migrated | Per-agent files at canonical path (§2) |

The shared `.agent-workspace/parking-station/` directory is retained for its `README.md` (which documents the migration) and as a historical archive. No new suggestions may be written to any file in that directory.

---

## 7. Migration Plan

### 7.1 Governance Repository (this repo)

**Status**: Migration executed in this PR.

1. All existing entries from `.agent-workspace/parking-station/suggestions-log-{agent-id}.md` files have been migrated to the canonical path `.agent-workspace/<agent-name>/parking-station/suggestions-log.md`.
2. The deprecated per-agent files in the shared directory retain their content as read-only archives with a migration notice header.
3. The shared `suggestions-log.md` retains its deprecation notice (already in place since 2026-02-27).
4. **Follow-up required**: Agent contracts (`.github/agents/*.md`) that reference deprecated parking station paths in their §4.2a parking station entry must be updated to the canonical path. Per FAIL-ONLY-ONCE Rule B-06, agent contract modifications require CodexAdvisor and will be completed in a separate PR.

### 7.2 Consumer Repositories

Each consumer repository listed in `governance/CONSUMER_REPO_REGISTRY.json` MUST:

1. Create the per-agent parking station directory and `suggestions-log.md` for each agent with a workspace in that repo.
2. Migrate any existing entries from shared parking station files to the per-agent canonical paths.
3. Update the shared `suggestions-log.md` (if present) with a deprecation notice pointing to this standard.
4. Update any CI scripts, reporting dashboards, or aggregation tools that scan `.agent-workspace/parking-station/suggestions-log-*.md` to instead scan `.agent-workspace/*/parking-station/suggestions-log.md`.

**Timetable**: Consumer repos should complete migration within **one ripple cycle** (the next layer-down issue after this canon is merged).

---

## 8. CI and Reporting Updates

Any CI workflow, reporting script, or dashboard that depends on scanning the shared parking station directory MUST be updated:

| Old Pattern | New Pattern |
|-------------|-------------|
| `cat .agent-workspace/parking-station/suggestions-log-*.md` | `find .agent-workspace/*/parking-station -name "suggestions-log.md" -exec cat {} +` |
| Glob: `.agent-workspace/parking-station/suggestions-log-*.md` | Glob: `.agent-workspace/*/parking-station/suggestions-log.md` |

---

## 9. New Agent Onboarding

When a new agent is added to the system:

1. Create the agent workspace directory: `.agent-workspace/<agent-name>/`
2. Create the parking station subdirectory: `.agent-workspace/<agent-name>/parking-station/`
3. Create `suggestions-log.md` using the template in §4.
4. The agent contract MUST reference the canonical path in its Phase 4 handover section.

---

## 10. Conflict Prevention

Under this scheme:

- Each agent writes **only** to files in its own `.agent-workspace/<agent-name>/` directory.
- No two agents share a suggestions log file.
- Git merges of parallel agent branches will never conflict on suggestion log files.
- No manual merge resolution is required for suggestion entries.

---

## 11. Layer-Down Instructions

When rippling this canon to consumer repos, create a layer-down issue with:

**Title**: `[Layer-Down] Standardize per-agent parking station paths per PARKING_STATION_PATH_STANDARD.md v1.0.0`

**Body**:
1. For each agent with a workspace in the consumer repo, create `.agent-workspace/<agent-name>/parking-station/suggestions-log.md` using the template in §4.
2. Migrate existing entries from any shared parking station file to the per-agent files.
3. Add a deprecation notice to any shared parking station file.
4. Update agent contracts to reference the canonical path.
5. Update CI/reporting to scan per-agent paths.

---

## 12. Related Canon

- `governance/canon/AGENT_CONTRACT_ARCHITECTURE.md` — Four-phase contract architecture (Phase 4 workspace structure)
- `governance/canon/AGENT_HANDOVER_AUTOMATION.md` — Append-only artifact rules
- `governance/canon/AGENT_PRIORITY_SYSTEM.md` — Low-priority parking guidance
- `governance/canon/MANDATORY_ENHANCEMENT_CAPTURE_STANDARD.md` — Enhancement capture routing
- `governance/canon/LIVING_AGENT_SYSTEM.md` — Artifact immutability rules

---

**Version**: 1.0.0  
**Last Updated**: 2026-04-13  
**Authority**: CS2 (Johan Ras)  
**Living Agent System**: v6.2.0
