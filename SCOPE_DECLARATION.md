# Scope Declaration — governance-liaison-isms Session 050 — Formalise OVL-AC-ADM Overlay Series

**PR**: `copilot/formalise-ovl-ac-adm-overlay`
**Session**: session-050 (governance-liaison-isms)
**Task**: Formalise OVL-AC-ADM-001 through OVL-AC-ADM-004 in iaa-category-overlays.md; fix stale IAA index version reference
**Issue**: APGI-cmy/maturion-isms#966 (Formalise OVL-AC-ADM Overlay Series in iaa-category-overlays.md v2.4.0)
**Date**: 2026-03-05
**Authority**: CS2 directive (governance administration)

## Files Declared

### Modified (session-050 producing agent deliverables)

- `.agent-workspace/independent-assurance-agent/knowledge/iaa-category-overlays.md` - v3.0.0 → v3.1.0: OVL-AC-ADM-001 through OVL-AC-ADM-004 descriptions completed with full pass conditions; version history table added
- `.agent-workspace/independent-assurance-agent/knowledge/index.md` - v2.5.0 → v2.6.0: iaa-category-overlays.md version reference corrected from stale 2.3.0 to 3.1.0; version history entry added
- `.agent-workspace/governance-liaison-isms/parking-station/suggestions-log.md` - Session-049 resolved entry and session-050 suggestion appended
- `SCOPE_DECLARATION.md` - This file (updated for session-050 scope per A-026/A-028 compliance)

### Added (session-050 producing agent deliverables)

- `.agent-admin/prehandover/PREHANDOVER_PROOF_session-050-20260305.md` - PREHANDOVER proof for governance-liaison session-050
- `.agent-workspace/governance-liaison-isms/memory/session-050-20260305.md` - Session memory for governance-liaison session-050

## Governance Actions
- Zero governance canon files modified
- Zero agent contract files modified (`.github/agents/**`)
- Tier 2 knowledge files updated within liaison write authority
- No ripple event required

## A-031 Carve-Out — IAA Ceremony Artifacts

Per FAIL-ONLY-ONCE A-031 (codified session-150-20260305): IAA ceremony artifacts from sessions 149 and 150 rejection/re-invocation ceremonies on this branch are excluded from the producing-agent scope declaration. These files are fully committed and included in the branch diff but are IAA's own ceremony records, not producing agent deliverables:

- `.agent-admin/assurance/iaa-token-session-050-wave1-20260305.md` (IAA ceremony)
- `.agent-workspace/independent-assurance-agent/memory/session-149-20260305.md` (IAA session memory)
- `.agent-workspace/independent-assurance-agent/memory/session-150-20260305.md` (IAA session memory)
- `.agent-workspace/independent-assurance-agent/parking-station/suggestions-log.md` (IAA ceremony)
- `.agent-workspace/independent-assurance-agent/knowledge/FAIL-ONLY-ONCE.md` (IAA A-031 codification)


- IAA contract Phase 2 Step 2.4 updated by CodexAdvisor-agent per AGCFPP-001 + CS2 Issue #930
- Ripple assessment: NO GOVERNANCE RIPPLE REQUIRED (consumer-only Tier 2 reference change)

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
