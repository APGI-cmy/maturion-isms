# SCOPE DECLARATION — Wave iaa-12stage-upgrade | Session iaa-12stage-20260407

**Agent**: foreman-v2-agent
**Wave**: iaa-12stage-upgrade
**Branch**: copilot/upgrade-iaa-tier-logic
**Date**: 2026-04-07
**Issue**: maturion-isms#1258
**Authority**: A-026 / A-031

> **A-031 NOTE**: IAA ceremony artifacts (Pre-Brief, PREHANDOVER, session memory, token file)
> from this wave are carved out of scope tracking per A-031.

## Files Added (This Wave)

| Path | Description |
|------|-------------|
| `.agent-admin/assurance/iaa-prebrief-iaa-12stage-upgrade.md` | IAA Phase 0 Pre-Brief artifact |
| `.agent-workspace/foreman-v2/memory/PREHANDOVER-session-iaa-12stage-20260407.md` | Foreman PREHANDOVER proof (A-031 carve-out) |
| `.agent-workspace/foreman-v2/memory/session-iaa-12stage-20260407.md` | Foreman session memory (A-031 carve-out) |
| `.agent-admin/assurance/iaa-token-session-iaa-12stage-20260407.md` | IAA ASSURANCE-TOKEN (A-031 carve-out) |

## Files Modified (This Wave)

| Path | Description |
|------|-------------|
| `.agent-workspace/foreman-v2/personal/wave-current-tasks.md` | Updated for iaa-12stage-upgrade active wave |
| `.agent-workspace/independent-assurance-agent/knowledge/iaa-category-overlays.md` | v3.8.0 → v4.0.0 — OVL-PBG-010–016 added; PRE_BRIEF_ASSURANCE strengthened |
| `.agent-workspace/independent-assurance-agent/knowledge/iaa-core-invariants-checklist.md` | v2.9.0 → v3.0.0 — CORE-025 Pre-Brief Stage-Readiness Declaration added |
| `.agent-workspace/independent-assurance-agent/knowledge/iaa-trigger-table.md` | v2.2.0 → v2.3.0 — all 12 stages named; OVL-PBG-001–016 reference |
| `.agent-workspace/independent-assurance-agent/knowledge/index.md` | v3.3.0 → v3.4.0 — all version entries updated |
| `governance/canon/INDEPENDENT_ASSURANCE_AGENT_CANON.md` | v1.3.0 → v1.4.0 — §Pre-Build Stage Assurance added |
| `governance/CANON_INVENTORY.json` | INDEPENDENT_ASSURANCE_AGENT_CANON.md entry: v1.4.0, hash 86e0a1fd... |

## Files Excluded

- `node_modules/`
- `dist/`
- Any file not listed above

## Scope Boundaries

- Production code paths touched: None
- CI workflows added: 2 (routing-governance-check.yml, stub-detection-check.yml)
- Existing CI workflows modified: None
- Agent contract files modified: None

## Amendments (Post-IAA R1 REJECTION-PACKAGE)

Following IAA R1 REJECTION-PACKAGE, two amendments were made:

1. **OVL-CI-005 fix**: `workflow_dispatch: {}` added to:
   - `.github/workflows/routing-governance-check.yml`
   - `.github/workflows/stub-detection-check.yml`
   Both files remain YAML valid (re-verified via python yaml.safe_load).

2. **integration-builder PREHANDOVER updated**: OVL-CI-005 S-033 exception section added with YAML evidence + pattern parity evidence.

Ceremony artifacts committed as one batch per IAA required fix sequence.
