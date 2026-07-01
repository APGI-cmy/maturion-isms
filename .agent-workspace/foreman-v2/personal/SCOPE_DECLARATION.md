# SCOPE DECLARATION — Wave wave-mmm-descriptor-generation-hardening-2026-07-01

**Agent**: foreman-v2-agent (orchestration only)
**Wave**: wave-mmm-descriptor-generation-hardening-2026-07-01
**Branch**: apgi-cmy-fix-descriptor-gerund-normalization
**Date**: 2026-07-01
**Issue**: maturion-isms#1883
**Authority**: A-029 / SCOPE_DECLARATION fresh-overwrite requirement
**IAA Trigger Category**: PRE_BUILD_IMPLEMENTATION_WAVE

## In-Scope Governance/Control Files (prebuild stage)

| Path | Description |
|------|-------------|
| `.agent-workspace/foreman-v2/personal/wave-current-tasks.md` | Active wave tracker and fail-only-once incident record |
| `.agent-workspace/foreman-v2/personal/SCOPE_DECLARATION.md` | This scope declaration |
| `.agent-admin/assurance/iaa-wave-record-wave-mmm-descriptor-generation-hardening-2026-07-01.md` | Canonical IAA pre-brief/final assurance wave record (to be created by IAA) |
| `.agent-admin/builder-appointments/wave-mmm-descriptor-generation-hardening-2026-07-01.md` | Builder appointment artifact (post-prebrief) |
| `.agent-admin/control/delegation-order.json` | Delegation ordering proof artifact |

## Planned Implementation Scope (builder-owned only after prebrief/delegation gates)

| Path | Ownership | Intent |
|------|-----------|--------|
| `apps/mmm/src/components/assessment/CriteriaManagement.tsx` | ui-builder | Harden descriptor generation grounding and deterministic grammar normalization |
| `modules/MMM/tests/B4-framework/domain-workflow-behavior.test.tsx` | ui-builder | Add/adjust regression coverage for descriptor grammar/format outcomes |

## Explicit Out of Scope

- Any direct implementation by foreman-v2-agent.
- Any changes to `.github/agents/` contract files.
- Any unrelated ISMS/PIT/runtime/deployment work outside descriptor-generation hardening scope.
