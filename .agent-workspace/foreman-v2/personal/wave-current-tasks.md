# Wave Current Tasks — Issue 1305

wave: ecap-001-layer-down-implementation
iaa_prebrief_path: .agent-admin/assurance/iaa-prebrief-wave1305-ecap-001-20260408.md

## Active Wave: ecap-001-layer-down-implementation

### Wave Description
Complete ECAP-001 layer-down implementation in maturion-isms after PR #1296.
PR #1296 brought the canon files but left inconsistencies/defects that must be corrected.

CS2 Authorization: Issue maturion-isms#1305 opened by @APGI-cmy (CS2 = Johan Ras) and assigned to
foreman-v2-agent (Copilot). Issue author is CS2 (Johan Ras / @APGI-cmy).

### Tasks
- [x] IAA Pre-Brief: .agent-admin/assurance/iaa-prebrief-wave1305-ecap-001-20260408.md
- [x] AC-001: Fix broken strategy reference in EXECUTION_CEREMONY_ADMINISTRATION_PROTOCOL.md
- [x] AC-002: Normalize AGENT_HANDOVER_AUTOMATION.md section header v1.1.6 → v1.0.0
- [x] AC-003: Normalize AGENT_HANDOVER_AUTOMATION.md canon reference v1.1.6 → v1.0.0
- [x] AC-004: Add §4.3c row to Phase 4 table in AGENT_HANDOVER_AUTOMATION.md
- [x] AC-005: Update CANON_INVENTORY.json AGENT_HANDOVER_AUTOMATION entry (version + hash)
- [x] AC-006: Verify/reconcile GOVERNANCE_CANON_MANIFEST.md entries/totals
- [x] PREHANDOVER proof committed and verified
- [ ] IAA final audit and token

### IAA Pre-Brief Summary (from iaa-prebrief-wave1305-ecap-001-20260408.md)
- Trigger Category: CANON_GOVERNANCE — MANDATORY (all tasks)
- Qualifying Tasks: AC-001 through AC-006
- Scope Blockers: SB-001 (strategy fix approach), SB-002 (CRITICAL — hash sequencing), SB-003 (version bump), SB-004 (manifest entry), SB-005 (ripple), SB-006 (wave-current-tasks)
- FFA Sequence: 17 steps
- Critical note: CANON_INVENTORY hash must use POST-FIX sha256 (not pre-fix)

### Previous Wave (Closed)
wave: opojd-comment-only-copilot-20260408 (Issue #1286)
