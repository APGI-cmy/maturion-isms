# SCOPE DECLARATION — Wave gap-009-episodic-memory-remediation

**Agent**: api-builder v6.2.0
**Wave**: gap-009-episodic-memory-remediation — Wire Supabase INSERT to ai_episodic_events
**Session**: session-gap009-20260407
**Date**: 2026-04-07
**Branch**: copilot/gap-009-wire-supabase-insert
**Issue**: maturion-isms#1274
**Authority**: CS2 (Johan Ras / @APGI-cmy)

> **A-029 NOTE**: Fresh overwrite applied. Previous content replaced in full.
> **A-031 NOTE**: IAA ceremony artifacts are carved out of pre-declaration scope per A-031, but MUST appear in this file to satisfy validate-scope-to-diff.sh exact-set comparison.

## Declared Scope: Files Changed

- `.agent-admin/assurance/iaa-prebrief-gap-009-episodic-memory-remediation.md` — IAA Pre-Brief for wave gap-009-episodic-memory-remediation (pre-existing, committed by IAA agent)
- `.agent-workspace/api-builder/memory/session-gap009-20260407.md` — Session memory for session-gap009-20260407
- `.agent-workspace/foreman-v2/personal/wave-current-tasks.md` — Wave task tracking file updated to reference gap-009 wave
- `packages/ai-centre/src/memory/EpisodicMemoryAdapter.ts` — Rewritten: in-memory stub replaced with Supabase-backed implementation (GAP-009 / F-D4-001 remediation)
- `packages/ai-centre/src/__tests__/memory/EpisodicMemoryAdapter.test.ts` — Updated: mock Supabase client injection, DB write assertions added
- `PREHANDOVER_PROOF_GAP_009_SUPABASE_INSERT.md` — PREHANDOVER proof for session-gap009-20260407
- `packages/ai-centre/supabase/migrations/011_ai_episodic_capability_rag.sql` — New: adds 'rag' to ai_episodic_events capability CHECK constraint (resolves IAA CF-001 / Capability.RAG mismatch)
- `packages/ai-centre/src/__tests__/schema/gap009-episodic-capability-rag.test.ts` — New: 5 schema tests verifying migration 011 (GAP009-SCH-T-001 through T-005)
- `SCOPE_DECLARATION.md` — This file (scope declaration for wave gap-009-episodic-memory-remediation)

**File count: 9 files (excluding IAA session/token artifacts written by IAA agent post-verdict).**

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
