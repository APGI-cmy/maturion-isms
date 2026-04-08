# SCOPE DECLARATION — Wave ps-f-iaa-trigger-table-new-categories | Session 160

**Agent**: foreman-v2-agent v6.2.0 (contract 2.9.0)
**Wave**: ps-f-iaa-trigger-table-new-categories
**Session**: session-160
**Date**: 2026-04-08
**Branch**: copilot/add-new-categories-to-iaa-trigger-table
**Issue**: maturion-isms#1270 ([PS-F] IAA Trigger Table — new categories)
**Authority**: A-026 / A-029 / A-031

> **A-029 NOTE**: Fresh overwrite applied. Previous content replaced in full.
> **A-031 NOTE**: IAA ceremony artifacts are carved out of pre-declaration scope per A-031, but MUST appear in this file to satisfy validate-scope-to-diff.sh exact-set comparison.

## Declared Scope: Files Changed

**Wave Category**: KNOWLEDGE_GOVERNANCE

### Primary Deliverables (IAA Tier 2 — independent-assurance-agent)

- `.agent-workspace/independent-assurance-agent/knowledge/iaa-trigger-table.md` - v2.3.0 → v2.4.0: LIAISON_ADMIN (YES/MANDATORY) and GOVERNANCE_AUDIT (EXEMPT/unless-mixed) trigger categories added; decision flow renumbered steps 7–11
- `.agent-workspace/independent-assurance-agent/knowledge/index.md` - Knowledge Version 3.4.0 → 3.5.0: iaa-trigger-table.md v2.4.0 registered

### Foreman Tier 2 Knowledge Updates

- `.agent-workspace/foreman-v2/knowledge/FAIL-ONLY-ONCE.md` - v4.2.0 → v4.3.0: INC-OPOJD-PSF-001 registered; S-039 added; version history appended
- `.agent-workspace/foreman-v2/knowledge/index.md` - v2.5.0 → v2.6.0: FAIL-ONLY-ONCE version reference updated

### Wave Administration

- `.agent-workspace/foreman-v2/personal/wave-current-tasks.md` - Updated for ps-f wave (iaa_prebrief_path set)
- `SCOPE_DECLARATION.md` - This file (fresh overwrite per A-029)

### CodexAdvisor Evidence Bundle (session-054)

- `.agent-workspace/CodexAdvisor-agent/memory/session-054-20260407.md` - CodexAdvisor session memory
- `.agent-workspace/CodexAdvisor-agent/memory/PREHANDOVER-codexadvisor-session-054-ps-f-iaa-trigger-table-20260407.md` - CodexAdvisor PREHANDOVER proof (READ-ONLY post-commit per §4.3b)
- `.agent-workspace/CodexAdvisor-agent/parking-station/suggestions-log.md` - CodexAdvisor parking station

### Foreman Phase 4 Ceremony Artifacts (A-031 carve-out — MUST be declared for scope parity)

- `.agent-workspace/foreman-v2/memory/PREHANDOVER-session-160-ps-f-iaa-trigger-table-20260408.md` - Foreman PREHANDOVER proof session-160 (READ-ONLY post-commit per §4.3b)
- `.agent-workspace/foreman-v2/memory/session-160-ps-f-iaa-trigger-table-20260408.md` - Foreman session memory session-160
- `.agent-workspace/foreman-v2/parking-station/suggestions-log.md` - Foreman parking station (INC-OPOJD-PSF-001 + S-039 appended)

### IAA Ceremony Artifacts (A-031 carve-out — MUST be declared for scope parity)

- `.agent-admin/assurance/iaa-prebrief-ps-f-iaa-trigger-table-20260407.md` - IAA Pre-Brief (committed before changes; A-031 carve-out)
- `.agent-admin/assurance/iaa-rejection-session-057-ps-f-iaa-trigger-table-20260407.md` - IAA REJECTION-PACKAGE round 1 (CodexAdvisor A-026 miss; A-031 carve-out)
- `.agent-admin/assurance/iaa-rejection-session-160-ps-f-iaa-trigger-table-20260408.md` - IAA REJECTION-PACKAGE round 1 session-160 (pre-commit artifacts missing; A-031 carve-out)
- `.agent-admin/assurance/iaa-token-session-160-ps-f-iaa-trigger-table-20260408.md` - IAA ASSURANCE-TOKEN session-160 (committed after IAA PASS; A-031 carve-out)
- `.agent-workspace/independent-assurance-agent/memory/session-057-ps-f-iaa-trigger-table-20260407.md` - IAA session memory round 1 (A-031 carve-out)
- `.agent-workspace/independent-assurance-agent/memory/session-160-ps-f-iaa-trigger-table-20260408.md` - IAA session memory round 2 session-160 (A-031 carve-out)
- `.agent-workspace/independent-assurance-agent/parking-station/suggestions-log.md` - IAA parking station (A-031 carve-out)

## Out of Scope

- No production code changes (apps/, modules/, supabase/, packages/)
- No CI workflow changes (.github/workflows/)
- No agent contract changes (.github/agents/)
- No canon governance changes (governance/canon/)
- No migration or schema changes

## IAA Pre-Brief

Pre-Brief artifact: `.agent-admin/assurance/iaa-prebrief-ps-f-iaa-trigger-table-20260407.md`
Pre-Brief committed: YES (commit f11ac3dc — before any substantive changes)
Category: KNOWLEDGE_GOVERNANCE — MANDATORY
