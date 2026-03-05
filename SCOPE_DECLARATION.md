# Scope Declaration — governance-liaison-isms Session 049 + CodexAdvisor Session 046 — IAA Agent Contract Audit Standard

**PR**: `copilot/create-iaa-agent-audit-standard`
**Sessions**: session-049 (governance-liaison-isms), session-046 (CodexAdvisor-agent)
**Task**: Create Tier 2 Knowledge: IAA Agent Contract Audit Standard and Update IAA Contract Reference
**Issue**: Create Tier 2 Knowledge: IAA Agent Contract Audit Standard (#930)
**Date**: 2026-03-05
**Authority**: CS2 directive (governance administration)

## Files Declared

### Added

- `.agent-workspace/independent-assurance-agent/knowledge/IAA_AGENT_CONTRACT_AUDIT_STANDARD.md` - New Tier 2 audit standard v1.0.0 for AGENT_CONTRACT PRs (mandatory audit steps, pre-approval doctrine, protected components, tier discipline, decision matrix)
- `.agent-workspace/governance-liaison-isms/escalation-inbox/escalation-agent-contracts-iaa-phase2-20260305.md` - Escalation ESC-AGENTFILE-IAA-PHASE2-20260305 for IAA contract Phase 2 update (A-009/AGCFPP-001 boundary)
- `.agent-workspace/governance-liaison-isms/memory/session-049-20260305.md` - Session memory for governance-liaison session-049
- `.agent-admin/build-evidence/session-049/PREHANDOVER_PROOF_session-049-20260305.md` - PREHANDOVER proof for governance-liaison session-049
- `.agent-workspace/CodexAdvisor-agent/memory/PREHANDOVER-session-046-20260305.md` - PREHANDOVER proof for CodexAdvisor session-046
- `.agent-workspace/CodexAdvisor-agent/memory/session-046-20260305.md` - Session memory for CodexAdvisor session-046

### Modified

- `.github/agents/independent-assurance-agent.md` - Phase 2 Step 2.4 updated to load IAA_AGENT_CONTRACT_AUDIT_STANDARD.md for AGENT_CONTRACT PRs; identity YAML compressed for 30,000 byte compliance; contract v2.1.0 → v2.2.0
- `.agent-workspace/independent-assurance-agent/knowledge/index.md` - Updated 2.4.0 → 2.5.0 (IAA_AGENT_CONTRACT_AUDIT_STANDARD.md entry added)
- `.agent-workspace/governance-liaison-isms/parking-station/suggestions-log.md` - Session-049 suggestion appended
- `SCOPE_DECLARATION.md` - This file — scope declaration for session-049 + session-046 (A-026 compliance)

## Governance Actions
- Zero governance canon files layered down (payload contained only agent contract file)
- CodexAdvisor-agent.md escalated to CS2 per A-015 (ESC-AGENTFILE-29E76ECF-20260304)
- SHA256 correction documented in CORRECTION_ADDENDUM (A-030)

---

# Scope Declaration — foreman-v2-agent Session 142 — Wave 14 Batch C

**PR**: `copilot/finalise-mat-gap-closure`
**Sessions**: session-142
**Wave**: Wave 14 Batch C — Finalise MAT Remaining Gap Closure and QA Acceptance
**Issue**: #909
**Date**: 2026-03-05
**Authority**: A-026, A-028 (FAIL-ONLY-ONCE v2.6.0), AGCFPP-001

## Files Declared

### Added

- `apps/maturion-maturity-legacy/supabase/migrations/20260305000005_wave14_level_descriptors.sql` - GAP-W12/FR-100: criteria_level_descriptors + mps_level_descriptors + domain_level_descriptors tables with UNIQUE constraints, org-isolation RLS SELECT policies
- `apps/maturion-maturity-legacy/supabase/migrations/20260305000007_wave14_scoring_tables.sql` - GAP-W13/FR-101: maturity_levels (5 seed rows), scoring_rules (global default), aggregate_scores (UPSERT UNIQUE), RLS posture (maturity_levels/scoring_rules public-read, aggregate_scores org-isolated)
- `modules/mat/05-build-evidence/wave14-postimplementation-assurance-report.md` - Wave 14 Post-Implementation Assurance Report: all 15 GAPs tick-list, screenshot QA attestation, drill-down capability attestation, QA sign-off
- `modules/mat/05-build-evidence/app-management-centre-watchdog-readiness.md` - MAT App Management Centre Watchdog Readiness: health check endpoints, event hooks, monitoring surfaces, integration interface contract
- `.agent-admin/assurance/iaa-prebrief-wave14-batchC.md` - IAA Pre-Brief for Wave 14 Batch C
- `.agent-workspace/foreman-v2/memory/PREHANDOVER-session-142-wave14-batchC-20260305.md` - Foreman PREHANDOVER session-142
- `.agent-workspace/foreman-v2/memory/session-142-wave14-batchC-20260305.md` - Foreman session memory session-142

### Modified

- `.agent-workspace/foreman-v2/personal/wave-current-tasks.md` - Updated with Wave 14 Batch C tasks
- `SCOPE_DECLARATION.md` - This file — scope declaration for session-142 Wave 14 Batch C

### STOP-AND-FIX Additions (IAA REJECTION-PACKAGE remediation)

- `modules/mat/05-build-evidence/wave14-cwt-evidence-20260305.md` - FINDING-BC-002 fix: Wave 14 Combined Wave Test evidence — formal CWT PASS verdict, 104/104 Wave 14 tests GREEN, 15/15 GAPs closed (OVL-AM-CWT-01)
- `.agent-workspace/foreman-v2/memory/PREHANDOVER-session-142-v2-wave14-batchC-20260305.md` - PREHANDOVER proof v2 (STOP-AND-FIX resolutions: FINDING-BC-001 partial index + FINDING-BC-002 CWT evidence)

### IAA Session-147 Governance Artifacts (REJECTION-PACKAGE ceremony record)

- `.agent-admin/assurance/iaa-token-session-142-wave14-batchC-20260305.md` - IAA session-147 REJECTION-PACKAGE token (FINDING-BC-001: aggregate_scores partial index; FINDING-BC-002: CWT evidence missing)
- `.agent-workspace/independent-assurance-agent/memory/session-147-wave14-batchC-20260305.md` - IAA session-147 session memory (first rejection invocation for Wave 14 Batch C)

### PREHANDOVER v3 Correction Addendum (A-030 pattern)

- `.agent-workspace/foreman-v2/memory/PREHANDOVER-session-142-v3-wave14-batchC-20260305.md` - PREHANDOVER proof v3: correction addendum acknowledging all prior IAA findings resolved; complete bundle with IAA ceremony artifacts

### IAA Session-149 Governance Artifacts (ASSURANCE-TOKEN ceremony record)

- `.agent-admin/assurance/iaa-token-session-142-v3-wave14-batchC-20260305.md` - IAA ASSURANCE-TOKEN (session-149) — Wave 14 Batch C v3 PASS — all 35+ checks PASS — merge gate released
- `.agent-workspace/independent-assurance-agent/memory/session-149-wave14-batchC-v3-20260305.md` - IAA session-149 session memory (ASSURANCE-TOKEN invocation)

---

# Scope Declaration — foreman-v2-agent Session 143 — Wave 14 IBWR

**PR**: `copilot/update-wave-14-ibwr-tracker`
**Session**: session-143
**Wave**: Wave 14 IBWR — In-Between Wave Reconciliation (Final)
**Issue**: Wave 14 IBWR: Formal In-Between Wave Reconciliation & Progress Tracker Update
**Date**: 2026-03-05
**Authority**: A-026, A-028 (FAIL-ONLY-ONCE v2.6.0)

## Files Declared

### Added

- `.agent-admin/assurance/ibwr-wave14-session-143-20260305.md` - Formal Wave 14 IBWR artifact: 15/15 GAPs closed, 104/104 tests GREEN, 4 IAA tokens referenced, CWT PASS, FCWT readiness declared
- `.agent-workspace/foreman-v2/memory/session-143-wave14-ibwr-20260305.md` - Foreman session memory for IBWR session-143
- `.agent-workspace/foreman-v2/memory/PREHANDOVER-session-143-wave14-ibwr-20260305.md` - PREHANDOVER proof for session-143 IBWR

### Modified

- `modules/mat/BUILD_PROGRESS_TRACKER.md` - Wave 14 Batch A/B/C sections added; IBWR section added; postbuild-fails-02 closed; Current Stage updated to FCWT READY
- `.agent-workspace/foreman-v2/personal/wave-current-tasks.md` - Updated for IBWR session-143 task list
- `SCOPE_DECLARATION.md` - This file — scope declaration for session-143 IBWR (A-026 compliance)

---

# Scope Declaration — foreman-v2-agent Session 143 v2 — Wave 14 IBWR Correction (A-030)

**PR**: `copilot/update-wave-14-ibwr-tracker`
**Session**: session-143 v2 (correction addendum — A-030 pattern)
**Correction Type**: A-030 — CWT Batch C test count corrected (20→27) per IAA REJECTION-PACKAGE (session-150)
**Date**: 2026-03-05

## Correction Summary

IAA session-150 issued REJECTION-PACKAGE FINDING-IBWR-001: CWT tally arithmetic inconsistency.
IBWR §3 and BUILD_PROGRESS_TRACKER CWT tally both stated Batch C = 20 tests.
Correct count = 27 (37+40+27=104 ✓ per CWT runner output and state machine entry).
Fix: "20" → "27" in both documents.

## Files Corrected

- `.agent-admin/assurance/ibwr-wave14-session-143-20260305.md` - §3 CWT Tally: Batch C 20→27; 20/20→27/27
- `modules/mat/BUILD_PROGRESS_TRACKER.md` - IBWR CWT tally: Batch C 20→27; Batch C section test results 20→27
- `SCOPE_DECLARATION.md` - This correction addendum
