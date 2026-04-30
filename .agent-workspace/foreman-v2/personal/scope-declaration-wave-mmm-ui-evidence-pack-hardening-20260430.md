# Scope Declaration — Wave: mmm-ui-evidence-pack-hardening-20260430

**Agent**: foreman-v2-agent v6.2.0
**Wave**: mmm-ui-evidence-pack-hardening-20260430
**Issue**: maturion-isms#1523
**Branch**: copilot/require-live-ui-evidence-pack
**Date**: 2026-04-30
**CS2 Authorization**: Confirmed — issue opened by @APGI-cmy (APGI-cmy/maturion-isms#1523)

## Wave Description

Governance hardening: define and enforce a Live UI Evidence Pack (LUIEP) gate that must be
present before any PREHANDOVER proof may claim L2 (Deployment Commissioned) or L3
(Operationally Closed) completion for MMM, or before any agent may describe MMM as
"handover ready" to an operational audience. Codifies §12.2 OC-001–OC-009 requirements as
a hard machine-enforced gate.

## Approved Artifact Paths

The following paths are approved for this wave. All agent-created files must match an entry
in this list.

```yaml
approved_artifact_paths:
  # Wave infrastructure
  - .agent-workspace/foreman-v2/personal/wave-current-tasks.md
  - .agent-workspace/foreman-v2/personal/scope-declaration-wave-mmm-ui-evidence-pack-hardening-20260430.md

  # IAA Pre-Brief wave record (IAA-authored, A-031 carve-out)
  - .agent-admin/assurance/iaa-wave-record-mmm-ui-evidence-pack-hardening-20260430.md

  # D1 — New canon document
  - governance/canon/MMM_UI_EVIDENCE_PACK_GATE.md

  # D2 — CI gate validation script
  - .github/scripts/validate-mmm-ui-evidence-pack.sh

  # D3 — CI workflow (preflight-evidence-gate.yml — add mmm-ui-evidence-pack-gate job)
  - .github/workflows/preflight-evidence-gate.yml

  # D4 — Operational checklist
  - governance/checklists/mmm-ui-evidence-pack-checklist.md

  # D5 — Evidence pack template for CS2
  - modules/MMM/12-phase4-ecap/mmm-ui-evidence-pack-template.md

  # D6 — BUILD_PROGRESS_TRACKER §12.3 update
  - modules/MMM/BUILD_PROGRESS_TRACKER.md

  # D7 — FAIL-ONLY-ONCE A-043 addition
  - .agent-workspace/foreman-v2/knowledge/FAIL-ONLY-ONCE.md

  # D8 — CANON_INVENTORY update
  - governance/CANON_INVENTORY.json

  # Root SCOPE_DECLARATION.md (mandatory — must list itself)
  - SCOPE_DECLARATION.md

  # Phase 4 ceremony artifacts (ECAP)
  - .agent-workspace/execution-ceremony-admin-agent/bundles/PREHANDOVER-session-mmm-ui-evidence-pack-hardening-20260430.md
  - .agent-workspace/execution-ceremony-admin-agent/bundles/session-mmm-ui-evidence-pack-hardening-20260430.md
  - .agent-workspace/foreman-v2/memory/PREHANDOVER-session-mmm-ui-evidence-pack-hardening-20260430.md
  - .agent-workspace/foreman-v2/memory/session-mmm-ui-evidence-pack-hardening-20260430.md
  - .agent-admin/prehandover/proof-session-mmm-ui-evidence-pack-hardening-20260430.md
  - .agent-admin/assurance/iaa-token-session-mmm-ui-evidence-pack-hardening-20260430.md
```

## Undeclared Paths Policy

Any file created or modified on this branch that does not match an entry in
`approved_artifact_paths[]` above is a scope violation and will fail the
governance-artifact-gate CI check (HALT-008).

## Issue Reference

**Issue**: maturion-isms#1523 — Hardening — Require live UI evidence pack before MMM handover
or operational-complete claims
**Opened by**: CS2 (@APGI-cmy) — valid CS2 wave-start authorization (Step 2.1 confirmed)
