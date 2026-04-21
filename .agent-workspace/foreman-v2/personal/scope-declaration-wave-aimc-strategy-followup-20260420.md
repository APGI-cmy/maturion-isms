# Scope Declaration — Wave aimc-strategy-followup-20260420

**Foreman**: foreman-v2-agent v6.2.0
**Wave**: aimc-strategy-followup-20260420
**Date**: 2026-04-20
**Branch**: copilot/execute-post-merge-follow-up
**Issue**: [AIMC / Maturion] Execute post-merge follow-up work from PR #1386 strategy v2.0.1
**Authority**: CS2 (Johan Ras / @APGI-cmy)

---

## Scope Declaration

This wave produces POLC-Orchestration governance tracking artifacts only. No implementation code,
no schema changes, no CI workflow changes, no `.github/agents/` modifications.

---

## Approved Artifact Paths

```yaml
approved_artifact_paths:
  - .agent-admin/assurance/iaa-wave-record-aimc-strategy-followup-20260420-20260420.md
  - .agent-workspace/foreman-v2/personal/wave-current-tasks.md
  - .agent-workspace/foreman-v2/personal/scope-declaration-wave-aimc-strategy-followup-20260420.md
  - .agent-workspace/foreman-v2/personal/gap-009-status-check-20260420.md
  - .agent-workspace/foreman-v2/personal/canon-alignment-wave-tracking-20260420.md
  - .agent-workspace/foreman-v2/personal/module-consumer-spec-wave-tracking-20260420.md
  - .agent-workspace/foreman-v2/personal/convergence-bridge-wave-tracking-20260420.md
  - .agent-workspace/foreman-v2/memory/session-165-aimc-strategy-followup-20260420.md
  - .agent-workspace/foreman-v2/memory/PREHANDOVER-session-165-aimc-strategy-followup-20260420.md
  - .agent-workspace/foreman-v2/parking-station/suggestions-log.md
```

---

## Out-of-Scope Boundaries

The following are explicitly OUT OF SCOPE for this wave:

- `.github/agents/` — no agent contract modifications
- `governance/canon/` — no new canon files; SPECIALIST_KNOWLEDGE_MANAGEMENT.md already exists
- `.github/workflows/` — no CI changes
- `modules/MMM/` — no MMM module artifacts
- `packages/ai-centre/` — no AIMC implementation changes
- Any implementation artifacts

---

## Rationale

This is a POLC-Orchestration tracking wave. The sole purpose is to document the governance 
follow-up path from PR #1386 (strategy v2.0.1) to downstream canonisation and convergence work.
All four follow-up workstreams are tracked in separate artifacts (D3–D6) with dependency gates 
explicitly recorded.

---

## A-031 Carve-Out — IAA Ceremony Artifacts

Per A-031, IAA ceremony artifacts written by `independent-assurance-agent` to its own workspace
during prior rejection ceremonies on this branch are excluded from `approved_artifact_paths`
and are NOT subject to A-026 scope declaration requirements.

The following IAA-owned ceremony artifacts were committed on this branch during R1 and R2
REJECTION-PACKAGE runs and are covered by this carve-out:

- `.agent-workspace/independent-assurance-agent/memory/session-165-aimc-strategy-followup-20260420.md`
  (R1 rejection ceremony session memory — IAA-authored)
- `.agent-workspace/independent-assurance-agent/memory/session-165-aimc-strategy-followup-20260420-R2.md`
  (R2 rejection ceremony session memory — IAA-authored)

All IAA ceremony artifacts at path `.agent-workspace/independent-assurance-agent/` from any
R-series rejection run on this branch are covered by this A-031 carve-out.

---

**Created**: 2026-04-20
**Created by**: foreman-v2-agent v6.2.0
