# Wave Current Tasks — wave-active-tracker-coherence-20260419

**Foreman**: foreman-v2-agent v6.2.0
**Wave**: wave-active-tracker-coherence-20260419
**Issue**: maturion-isms#1412 — Canonize active-wave tracker coherence so final assurance cannot coexist with stale pending task artifacts
**Branch**: copilot/canonize-active-wave-tracker-coherence
**Date**: 2026-04-19
**CS2 Authorization**: CONFIRMED — issue #1412 opened directly by CS2 (@APGI-cmy); assigns foreman-v2-agent
**ceremony_admin_appointed**: false — governance-only wave; ECAP agent not invoked (no production code, schema, migrations, or CI changes; PREHANDOVER and session memory authored by Foreman directly per ECAP-001 §2.4 governance-only carve-out)
iaa_wave_record_path: .agent-admin/assurance/iaa-wave-record-wave-active-tracker-coherence-20260419.md
iaa_prebrief_commit: 5461d87
iaa_prebrief_status: COMPLETE — CLEAR TO PROCEED

## Prior Wave Reference

Prior wave: mmm-stage9-builder-checklist-20260419 (PR #1409, awaiting CS2 merge).
See: `.agent-workspace/foreman-v2/personal/wave-current-tasks-mmm-stage9-builder-checklist-20260419.md`

## Tasks

| Task ID | Task | Owner | Status |
|---------|------|-------|--------|
| IAA-PRE | IAA Pre-Brief — wave record | independent-assurance-agent | ✅ COMPLETE — SHA 5461d87 |
| T1 | Add AAP-21 (active-tracker contradiction anti-pattern) | governance-liaison-isms-agent | ✅ COMPLETE — SHA fb5418c |
| T2 | Add ACR-15 (active-tracker IAA rejection trigger) | governance-liaison-isms-agent | ✅ COMPLETE — SHA fb5418c |
| T3 | Add ECAP checklist row 3.9 for active tracker normalization | governance-liaison-isms-agent | ✅ COMPLETE — SHA fb5418c |
| T4 | Define "active control artifact" boundary in AAP-21 and ACR-15 | governance-liaison-isms-agent | ✅ COMPLETE — SHA fb5418c |
| T5 | Update PREHANDOVER template with active_trackers_normalized field | governance-liaison-isms-agent | ✅ COMPLETE — SHA fb5418c |
| T6 | Update CANON_INVENTORY.json for all modified files | governance-liaison-isms-agent + Foreman | ✅ COMPLETE — IAA canon v1.9.0 + anti-patterns/checklist entries added |
| T7 | Add A-039 to Foreman FAIL-ONLY-ONCE.md v4.4.0 | foreman-v2-agent | ✅ COMPLETE |
| T8 | Add D-2 to wave-reconciliation-checklist.md v1.2.0 | foreman-v2-agent | ✅ COMPLETE |

## Wave Completion Gate

| Gate | Status |
|------|--------|
| All T1-T8 tasks COMPLETE | ✅ COMPLETE |
| Governance-liaison QP PASS | ✅ PASS |
| Foreman Tier 2 knowledge updated | ✅ COMPLETE |
| IAA Final Audit ASSURANCE-TOKEN obtained | ⏳ PENDING — awaiting Phase 4 IAA Final Audit invocation |
