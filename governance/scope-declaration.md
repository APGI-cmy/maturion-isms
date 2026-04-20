# Scope Declaration — wave-active-tracker-coherence-20260419

**Wave**: wave-active-tracker-coherence-20260419
**Issue**: maturion-isms#1412 — Canonize active-wave tracker coherence so final assurance cannot coexist with stale pending task artifacts
**Branch**: copilot/canonize-active-wave-tracker-coherence
**Date**: 2026-04-19
**Foreman**: foreman-v2-agent v6.2.0
**Authority**: CS2 (@APGI-cmy)

## Purpose

Governance hardening wave: new anti-pattern (AAP-21), IAA rejection trigger (ACR-15), ECAP checklist check (3.9), PREHANDOVER template update, Foreman Tier 2 knowledge update (A-039, D-2), and CANON_INVENTORY sync. No production code, schema, or migrations modified. CI workflow `.github/workflows/preflight-evidence-gate.yml` patched to fix an invalid grep character-class regex (non-behavioral fix: `[[:space:]-:]` → `[-[:space:]:]`).

## Approved Artifact Paths

APPROVED_ARTIFACT_PATHS:
- .agent-admin/assurance/iaa-wave-record-wave-active-tracker-coherence-20260419.md
- .agent-admin/prehandover/proof-governance-liaison-session-067-wave-active-tracker-coherence.md
- .agent-admin/prehandover/proof-wave-active-tracker-coherence-20260419.md
- .agent-workspace/foreman-v2/knowledge/FAIL-ONLY-ONCE.md
- .agent-workspace/foreman-v2/knowledge/index.md
- .agent-workspace/foreman-v2/knowledge/wave-reconciliation-checklist.md
- .agent-workspace/foreman-v2/memory/session-wave-active-tracker-coherence-20260419.md
- .agent-workspace/foreman-v2/personal/wave-current-tasks-active-tracker-coherence-20260419.md
- .agent-workspace/foreman-v2/personal/wave-current-tasks.md
- .agent-workspace/governance-liaison-isms/memory/session-067-20260419.md
- .agent-workspace/governance-liaison-isms/parking-station/suggestions-log.md
- .agent-workspace/independent-assurance-agent/memory/session-062-wave-active-tracker-coherence-20260419-R2.md
- .agent-workspace/independent-assurance-agent/memory/session-063-wave-active-tracker-coherence-20260419-R3.md
- .github/workflows/preflight-evidence-gate.yml
- governance/CANON_INVENTORY.json
- governance/canon/INDEPENDENT_ASSURANCE_AGENT_CANON.md
- governance/checklists/execution-ceremony-admin-anti-patterns.md
- governance/checklists/execution-ceremony-admin-checklist.md
- governance/scope-declaration.md
- governance/templates/execution-ceremony-admin/PREHANDOVER.template.md

FILES_CHANGED: 20

## Approved Artifact Path Notes

- `.agent-admin/assurance/iaa-wave-record-wave-active-tracker-coherence-20260419.md`: IAA Pre-Brief wave record
- `.agent-admin/prehandover/proof-governance-liaison-session-067-wave-active-tracker-coherence.md`: Governance-liaison PREHANDOVER proof (sub-session artifact)
- `.agent-admin/prehandover/proof-wave-active-tracker-coherence-20260419.md`: Foreman PREHANDOVER proof
- `.agent-workspace/foreman-v2/knowledge/FAIL-ONLY-ONCE.md`: A-039 ACTIVE-TRACKER-NORMALIZATION-MANDATORY added (v4.4.0)
- `.agent-workspace/foreman-v2/knowledge/index.md`: Knowledge index version bump (v2.8.0)
- `.agent-workspace/foreman-v2/knowledge/wave-reconciliation-checklist.md`: D-2 active tracker normalization check added (v1.2.0)
- `.agent-workspace/foreman-v2/memory/session-wave-active-tracker-coherence-20260419.md`: Foreman session memory
- `.agent-workspace/foreman-v2/personal/wave-current-tasks-active-tracker-coherence-20260419.md`: Wave-specific task tracker
- `.agent-workspace/foreman-v2/personal/wave-current-tasks.md`: Active wave-current-tasks (updated to this wave)
- `.agent-workspace/governance-liaison-isms/memory/session-067-20260419.md`: Governance-liaison session memory
- `.agent-workspace/governance-liaison-isms/parking-station/suggestions-log.md`: Suggestions log append
- `.agent-workspace/independent-assurance-agent/memory/session-062-wave-active-tracker-coherence-20260419-R2.md`: IAA R2 session (REJECTION-PACKAGE then corrected)
- `.agent-workspace/independent-assurance-agent/memory/session-063-wave-active-tracker-coherence-20260419-R3.md`: IAA R3 session (ASSURANCE-TOKEN PASS)
- `.github/workflows/preflight-evidence-gate.yml`: CI grep regex fix — `[[:space:]-:]` → `[-[:space:]:]` (invalid character-class range, non-behavioral)
- `governance/CANON_INVENTORY.json`: Updated: IAA canon v1.6.0→v1.9.0, anti-patterns v1.3.0, checklist v1.2.0 entries added
- `governance/canon/INDEPENDENT_ASSURANCE_AGENT_CANON.md`: ACR-15 added (v1.8.0→v1.9.0)
- `governance/checklists/execution-ceremony-admin-anti-patterns.md`: AAP-21 added (v1.2.0→v1.3.0)
- `governance/checklists/execution-ceremony-admin-checklist.md`: Check 3.9 added (v1.0.0→v1.2.0)
- `governance/scope-declaration.md`: This file
- `governance/templates/execution-ceremony-admin/PREHANDOVER.template.md`: active_trackers_normalized field added

## Excluded Paths

None — all wave files are governance artifacts. No production code, schema, or migrations.

## Separation of Duties

| Agent | Task | File(s) |
|-------|------|---------|
| independent-assurance-agent | IAA Pre-Brief wave record | `.agent-admin/assurance/iaa-wave-record-*.md` |
| governance-liaison-isms-agent | Governance canon/checklist/template changes | governance/canon/, governance/checklists/, governance/templates/, governance/CANON_INVENTORY.json |
| foreman-v2-agent | Tier 2 knowledge updates + ceremony artifacts | .agent-workspace/foreman-v2/, governance/scope-declaration.md |
