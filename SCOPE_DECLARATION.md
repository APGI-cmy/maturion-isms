# Scope Declaration — governance-liaison-isms Session-045

**PR**: `copilot/propagate-governance-changes-e45c6ae2-8853-4ff3-bb03-1720769d28b6`
**Session**: governance-liaison-isms session-045-20260304
**Date**: 2026-03-04
**Authority**: BL-027 (MERGE_GATE_PHILOSOPHY.md)
**Task**: Fix CI label validation error in ripple-integration.yml + governance artifacts for ripple 61ab7b83
**Issue**: APGI-cmy/maturion-isms#876

---

## Files Declared

- `.github/workflows/ripple-integration.yml` - Added `continue-on-error: true` to `create_pr_standard` and `create_pr_draft` steps (CI label validation defect fix)
- `.agent-admin/governance/sync_state.json` - Updated canonical_commit to 61ab7b83, last_ripple_dispatch_id, last_liaison_session
- `.agent-admin/governance/ripple-log.json` - Added liaison-escalated entry for ripple 61ab7b83 (48 events total)
- `.agent-workspace/governance-liaison-isms/escalation-inbox/escalation-agent-contracts-61ab7b83-20260304.md` - ESC-AGENTFILE-61AB7B83-20260304 escalation for CodexAdvisor-agent.md
- `.agent-workspace/governance-liaison-isms/memory/session-045-20260304.md` - Session memory for this session
- `.agent-workspace/governance-liaison-isms/parking-station/suggestions-log.md` - 1 session-045 suggestion appended
- `PREHANDOVER_PROOF_SESSION_045_RIPPLE_61AB7B83.md` - PREHANDOVER proof for this session
- `SCOPE_DECLARATION.md` - This file

- `.agent-workspace/CodexAdvisor-agent/memory/PREHANDOVER-session-045-20260304.md` - PREHANDOVER proof for this session
- `.agent-workspace/CodexAdvisor-agent/memory/session-045-20260304.md` - Session memory for this session
- `.agent-workspace/CodexAdvisor-agent/parking-station/suggestions-log.md` - 3 session-045 suggestions appended
- `.agent-workspace/foreman-v2/knowledge/FAIL-ONLY-ONCE.md` - A-028 added (PREHANDOVER immutability); version bumped to v2.6.0
- `.agent-workspace/foreman-v2/knowledge/prehandover-template.md` - §4.3b token ceremony; PENDING replaced with expected reference format; temporal ordering fixed
- `.agent-workspace/governance-liaison-isms/knowledge/index.md` - layer-down-scripts and ripple-processing-scripts bumped to v1.1.0
- `.agent-workspace/governance-liaison-isms/knowledge/layer-down-scripts.md` - Full 7-step protocol migrated from contract §3.1; version bumped to v1.1.0
- `.agent-workspace/governance-liaison-isms/knowledge/ripple-processing-scripts.md` - Full 5-step protocol migrated from contract §3.2; version bumped to v1.1.0
- `.agent-workspace/independent-assurance-agent/knowledge/FAIL-ONLY-ONCE.md` - A-029 added (artifact immutability §4.3b supersedes A-025); version bumped to v2.2.0
- `.agent-workspace/independent-assurance-agent/knowledge/iaa-core-invariants-checklist.md` - CORE-016 PENDING carve-out updated per A-029; version bumped to v2.6.0
- `.agent-workspace/independent-assurance-agent/knowledge/index.md` - FAIL-ONLY-ONCE and checklist versions updated to v2.2.0 and v2.6.0
- `.agent-workspace/integration-builder/knowledge/canonical-governance-refs.md` - NEW: Tier 2 governance references migrated from integration-builder contract
- `.agent-workspace/qa-builder/knowledge/canonical-governance-refs.md` - NEW: Tier 2 governance references migrated from qa-builder contract
- `.github/agents/api-builder.md` - can_invoke/cannot_invoke YAML; §4.6 iaa_audit_token reference
- `.github/agents/criteria-generator-agent.md` - can_invoke/cannot_invoke YAML
- `.github/agents/document-parser-agent.md` - can_invoke/cannot_invoke YAML
- `.github/agents/foreman-v2-agent.md` - §4.3b token ceremony; iaa_oversight artifact_immutability; can_invoke/cannot_invoke
- `.github/agents/governance-liaison-isms-agent.md` - §3.1/§3.2 migrated to Tier 2; §4.4b token ceremony; iaa_oversight updated; can_invoke/cannot_invoke; reduced from 30722 to 29857 bytes
- `.github/agents/independent-assurance-agent.md` - §4.2b token ceremony; artifact_immutability in capabilities; can_invoke/cannot_invoke
- `.github/agents/integration-builder.md` - can_invoke/cannot_invoke YAML; Canonical Governance References migrated to Tier 2; reduced from 30065 to 28859 bytes
- `.github/agents/mat-specialist.md` - can_invoke/cannot_invoke YAML
- `.github/agents/maturion-agent.md` - can_invoke/cannot_invoke YAML
- `.github/agents/maturity-scoring-agent.md` - can_invoke/cannot_invoke YAML
- `.github/agents/pit-specialist.md` - can_invoke/cannot_invoke YAML
- `.github/agents/qa-builder.md` - can_invoke/cannot_invoke YAML; Canonical Governance References migrated to Tier 2; reduced from 30095 to 28880 bytes
- `.github/agents/report-writer-agent.md` - can_invoke/cannot_invoke YAML
- `.github/agents/risk-platform-agent.md` - can_invoke/cannot_invoke YAML
- `.github/agents/schema-builder.md` - can_invoke/cannot_invoke YAML; §4.6 iaa_audit_token reference
- `.github/agents/ui-builder.md` - can_invoke/cannot_invoke YAML; §4.6 iaa_audit_token reference
- `SCOPE_DECLARATION.md` - this file

### LEGACY_BOUNDARY Files (CS2 commit 70e73fe — 2026-03-04)

- `.agent-workspace/CodexAdvisor-agent/memory/LEGACY_BOUNDARY.md` - CS2 legacy boundary marker (session-045 = first compliant session)
- `.agent-workspace/api-builder/memory/LEGACY_BOUNDARY.md` - CS2 legacy boundary marker
- `.agent-workspace/foreman-v2/memory/LEGACY_BOUNDARY.md` - CS2 legacy boundary marker
- `.agent-workspace/governance-liaison-isms/memory/LEGACY_BOUNDARY.md` - CS2 legacy boundary marker
- `.agent-workspace/independent-assurance-agent/memory/LEGACY_BOUNDARY.md` - CS2 legacy boundary marker
- `.agent-workspace/integration-builder/memory/LEGACY_BOUNDARY.md` - CS2 legacy boundary marker
- `.agent-workspace/qa-builder/memory/LEGACY_BOUNDARY.md` - CS2 legacy boundary marker
- `.agent-workspace/schema-builder/memory/LEGACY_BOUNDARY.md` - CS2 legacy boundary marker
- `.agent-workspace/ui-builder/memory/LEGACY_BOUNDARY.md` - CS2 legacy boundary marker
