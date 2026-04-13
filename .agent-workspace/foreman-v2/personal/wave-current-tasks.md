# Wave Current Tasks — IAA 90/10 Restructuring

**Wave**: iaa-90-10-restructuring
**Issue**: maturion-isms#1354
**Branch**: copilot/iaa-90-structure-90-10-evaluation-ratio
**Date**: 2026-04-13
**Status**: IN_PROGRESS
**CS2 Authorization**: CS2 opened issue #1354 directly, assigned this agent
**IAA Pre-Brief**: .agent-admin/assurance/iaa-wave-record-iaa9010-20260413.md (PENDING)
iaa_prebrief_path: .agent-admin/assurance/iaa-wave-record-iaa9010-20260413.md
ceremony_admin_appointed: NO

---

## Tasks

| Task ID | Summary | Builder | IAA Category | Status |
|---------|---------|---------|-------------|--------|
| T-IAA9010-01 | Rewrite IAA contract: collapse Phase 0/1, remove mechanical checks from Phase 3, reduce session memory | CodexAdvisor-agent | AGENT_CONTRACT | PENDING |
| T-IAA9010-02 | Restructure iaa-core-invariants-checklist.md: retain CORE-020/021 only, move rest to CI spec | CodexAdvisor-agent | AGENT_CONTRACT | PENDING |
| T-IAA9010-03 | Convert iaa-high-frequency-checks.md to CI spec document | CodexAdvisor-agent | AGENT_CONTRACT | PENDING |
| T-IAA9010-04 | Create/extend CI workflow for mechanical checks (HFMC + CORE) | qa-builder | CI_WORKFLOW | PENDING |
| T-IAA9010-05 | Update INDEPENDENT_ASSURANCE_AGENT_CANON.md to reflect new procedure | CodexAdvisor-agent | CANON_GOVERNANCE | PENDING |
| T-IAA9010-06 | Update GOVERNANCE_ARTIFACT_TAXONOMY.md — remove deprecated standalone artifact types | CodexAdvisor-agent | CANON_GOVERNANCE | PENDING |

---

## Delegation Plan

| Task | Builder | Justification |
|------|---------|---------------|
| T-IAA9010-01 through 03, 05-06 | CodexAdvisor-agent | Agent contract + related Tier 2 + canon = CodexAdvisor domain |
| T-IAA9010-04 | qa-builder | CI workflow implementation |
