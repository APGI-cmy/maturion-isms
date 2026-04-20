# Scope Declaration — Wave: mmm-stage11-builder-appointment-20260420

**Foreman**: foreman-v2-agent v6.2.0
**Wave**: mmm-stage11-builder-appointment-20260420
**Issue**: maturion-isms#1426
**Branch**: copilot/mmm-stage-11-builder-appointment
**Date**: 2026-04-20

## Purpose

This scope declaration lists all approved artifact paths for wave `mmm-stage11-builder-appointment-20260420`.
All agent-created files in this wave must match a declared path. Undeclared paths are blocked by
CI governance-artifact-gate.

## Approved Artifact Paths

APPROVED_ARTIFACT_PATHS:
  - modules/MMM/10-builder-appointment/builder-contract.md
  - modules/MMM/BUILD_PROGRESS_TRACKER.md
  - .agent-admin/assurance/iaa-wave-record-mmm-stage11-builder-appointment-20260420.md
  - .agent-workspace/foreman-v2/personal/wave-current-tasks.md
  - .agent-workspace/foreman-v2/personal/scope-declaration-wave-mmm-stage11-builder-appointment-20260420.md
  - .agent-workspace/foreman-v2/memory/PREHANDOVER-session-mmm-stage11-builder-appointment-20260420.md
  - .agent-workspace/foreman-v2/memory/session-mmm-stage11-builder-appointment-20260420.md
  - .agent-workspace/execution-ceremony-admin-agent/bundles/PREHANDOVER-session-mmm-stage11-builder-appointment-20260420.md
  - .agent-workspace/execution-ceremony-admin-agent/bundles/session-mmm-stage11-builder-appointment-20260420.md
  - .agent-workspace/independent-assurance-agent/memory/session-mmm-stage11-builder-appointment-20260420.md
  - .agent-workspace/foreman-v2/parking-station/suggestions-log.md

## Out of Scope

The following are explicitly out of scope for this wave:
- Stage 12 build execution (any code under apps/ or packages/)
- Agent contract modifications (.github/agents/*.md)
- CI/workflow changes (.github/workflows/)
- Schema migrations
- Source retirement or platform convergence
- Any deliverable not listed in APPROVED_ARTIFACT_PATHS above
