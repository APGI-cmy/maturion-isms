# Scope Declaration — wave-OVL-INJ — 2026-03-07

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
