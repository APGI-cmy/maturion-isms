# Scope Declaration — wave-mat-gov-process — 2026-03-09

**Wave**: wave-mat-gov-process — MAT Governance Overlay: FRS/TRS/Implementation Plan/Tracker expansion from PR #1016 completeness review
**Branch**: copilot/implement-governance-process-mat
**Session**: session-wave-mat-gov-process-20260309
**Date**: 2026-03-09
**Authority**: CS2 (Johan Ras / @APGI-cmy)

## Scope

### Producer Deliverables

- `.agent-admin/assurance/iaa-prebrief-wave-mat-gov-process.md` - IAA Pre-Brief artifact for wave-mat-gov-process
- `.agent-workspace/foreman-v2/memory/PREHANDOVER-session-wave-mat-gov-process-20260309.md` - PREHANDOVER proof for wave-mat-gov-process
- `.agent-workspace/foreman-v2/memory/session-wave-mat-gov-process-20260309.md` - Foreman session memory for wave-mat-gov-process
- `.agent-workspace/foreman-v2/personal/wave-current-tasks.md` - Wave current tasks (corrected FR-104-111/TR-103-110 specs)
- `modules/mat/01-frs/functional-requirements.md` - FRS v2.2.0: FR-104 through FR-111 added (completeness gap traceability)
- `modules/mat/01.5-trs/frs-to-trs-traceability.md` - Traceability matrix: FR-104→TR-103 through FR-111→TR-110 added
- `modules/mat/01.5-trs/technical-requirements-specification.md` - TRS v2.0.0: TR-103 through TR-110 added
- `modules/mat/03-implementation-plan/implementation-plan.md` - Implementation plan v2.7.0: Wave 16.1–16.9 gap-resolution plan
- `modules/mat/BUILD_PROGRESS_TRACKER.md` - Tracker v1.8: completeness review section, 25-gap register, Wave 16.x state machines
- `SCOPE_DECLARATION.md` - Updated for wave-mat-gov-process (A-026/A-028 compliance)

### IAA Protocol Artifacts (A-031 carve-out — IAA-authored, not producer deliverables)

- `.agent-admin/assurance/iaa-token-session-wave-mat-gov-process-20260309-REJECTION.md` - IAA R1 REJECTION-PACKAGE token
- `.agent-admin/assurance/iaa-token-session-wave-mat-gov-process-20260309-R2-REJECTION.md` - IAA R2 REJECTION-PACKAGE token
- `.agent-workspace/independent-assurance-agent/memory/session-wave-mat-gov-process-20260309.md` - IAA session memory (R1)
- `.agent-workspace/independent-assurance-agent/memory/session-wave-mat-gov-process-20260309-R2.md` - IAA session memory (R2)
- `.agent-workspace/independent-assurance-agent/parking-station/suggestions-log.md` - IAA parking station

**Wave**: OVL-INJ — Add OVL-INJ-001 Injection Audit Trail check to IAA PREHANDOVER canon
**Branch**: copilot/add-injection-audit-trail-check
**Session**: session-waveOVLINJ-20260307
**Date**: 2026-03-07
**Authority**: CS2 (Johan Ras / @APGI-cmy) — issue assigned to CodexAdvisor-agent
**PR**: copilot/add-injection-audit-trail-check (#980)

## Scope

### Deliverables (T-OVLINJ-001 through T-OVLINJ-004)
- `governance/canon/INDEPENDENT_ASSURANCE_AGENT_CANON.md` - amended to v1.4.0; added §Injection Audit Trail, OVL-INJ-001 REJECTION-PACKAGE trigger, AGCFPP-001 reference
- `.agent-workspace/independent-assurance-agent/knowledge/iaa-category-overlays.md` - updated to v3.2.0; added INJECTION_AUDIT_TRAIL overlay section with OVL-INJ-001
- `.agent-workspace/independent-assurance-agent/knowledge/index.md` - updated to v2.7.0; version reference and history for iaa-category-overlays.md v3.2.0
- `governance/CANON_INVENTORY.json` - IAA canon entry updated to v1.4.0 with refreshed SHA256 hash

### IAA Protocol Artifacts
- `.agent-admin/assurance/iaa-prebrief-waveOVLINJ-20260307.md` - new; IAA Pre-Brief for Wave OVL-INJ
- `.agent-admin/assurance/iaa-token-session-waveOVLINJ-20260307.md` - new; IAA ASSURANCE-TOKEN (PASS) for Wave OVL-INJ

### CodexAdvisor Governance Artifacts
- `.agent-workspace/CodexAdvisor-agent/memory/PREHANDOVER-waveOVLINJ-20260307.md` - new; PREHANDOVER proof for Wave OVL-INJ
- `.agent-workspace/CodexAdvisor-agent/memory/session-waveOVLINJ-20260307.md` - new; CodexAdvisor session memory
- `.agent-workspace/CodexAdvisor-agent/parking-station/suggestions-log.md` - updated; parking station

### Foreman Artifacts
- `.agent-workspace/foreman-v2/personal/wave-current-tasks.md` - updated; OVL-INJ wave tasks

### IAA Memory (IAA-authored)
- `.agent-workspace/independent-assurance-agent/memory/session-waveOVLINJ-20260307.md` - new; IAA session memory for Wave OVL-INJ
- `.agent-workspace/independent-assurance-agent/parking-station/suggestions-log.md` - updated; IAA parking station

### This File
- `SCOPE_DECLARATION.md` - this file (root-level merge gate input; BL-027 compliance)

- `.agent-admin/assurance/iaa-prebrief-wave-session-refresh-auth-fix.md` - IAA Pre-Brief (IAA-authored)
- `.agent-admin/assurance/iaa-token-session-wave-session-refresh-auth-fix-20260309.md` - IAA ASSURANCE-TOKEN (IAA-authored)
- `.agent-workspace/foreman-v2/knowledge/FAIL-ONLY-ONCE.md` - INC-AUTHFIX-IMPL-001 registered; S-029 noted; v3.5.0
- `.agent-workspace/foreman-v2/memory/PREHANDOVER-session-wave-session-refresh-auth-fix-20260309.md` - PREHANDOVER proof
- `.agent-workspace/foreman-v2/memory/session-wave-session-refresh-auth-fix-20260309.md` - Session memory
- `.agent-workspace/foreman-v2/parking-station/suggestions-log.md` - Parking station S-007 promotion entry
- `.agent-workspace/foreman-v2/personal/wave-current-tasks.md` - Wave task list for wave-session-refresh-auth-fix
- `SCOPE_DECLARATION.md` - Updated for wave-session-refresh-auth-fix
- `modules/mat/frontend/src/lib/hooks/useCriteria.ts` - Session refresh guard in useTriggerAIParsing
- `modules/mat/tests/wave-session-refresh-auth-fix/wave-sraf-session-refresh.test.ts` - 4 RED to GREEN tests
