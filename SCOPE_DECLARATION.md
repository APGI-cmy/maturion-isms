# Scope Declaration — foreman-v2-agent Session 144 — FCWT-Final

**PR**: `copilot/run-fcwt-for-entire-build`
**Session**: session-144 (foreman-v2-agent)
**Task**: FCWT-Final — Final Combined Wave Testing for Entire Build (Waves 0–14)
**Date**: 2026-03-05
**Authority**: CS2 directive (FCWT for entire build — production readiness gate)

## Files Declared

### Added (session-144 FCWT deliverables)

- `.agent-admin/assurance/iaa-prebrief-fcwt-final-session-144.md` - IAA Pre-Brief for FCWT-Final (PHASE_B_BLOCKING); 4 qualifying tasks; high-risk rules PC-FCWT-001–008 flagged
- `.agent-workspace/foreman-v2/memory/PREHANDOVER-session-144-fcwt-final-20260305.md` - Foreman PREHANDOVER proof session-144: FCWT results, QP PASS, OPOJD PASS, §4.3 merge gate parity PASS
- `.agent-workspace/foreman-v2/memory/session-144-fcwt-final-20260305.md` - Foreman session memory session-144: FCWT-Final, 774/783 GREEN, IAA PASS
- `modules/mat/05-build-evidence/fcwt-final-run-log-20260305.txt` - Actual vitest run output (1014 lines, 774 GREEN / 783 total / 9 EXPECTED RED)
- `modules/mat/05-build-evidence/fcwt-final-certificate-20260305.md` - FCWT Final Certificate: all waves 0–14, production readiness declared
- `modules/mat/05-build-evidence/fcwt-final-evidence-bundle-20260305.md` - FCWT Evidence Bundle: all CWT/CST/FCWT tokens by wave, test count progression 25→783

### Modified (session-144 FCWT deliverables)

- `.agent-workspace/foreman-v2/personal/wave-current-tasks.md` - Updated for session-144 FCWT-Final task list
- `modules/mat/BUILD_PROGRESS_TRACKER.md` - v1.3 → v1.4: FCWT Final section added; 774/783 GREEN recorded; production readiness certified
- `SCOPE_DECLARATION.md` - This file (updated for session-144 scope per A-026/A-028 compliance)

---

**Wave**: FCWT-Final — Final Combined Wave Testing for Entire Build
**Issue**: Run FCWT (Final Combined Wave Testing) for Entire Build
**Date**: 2026-03-05
**Authority**: A-026, A-028 (FAIL-ONLY-ONCE v2.6.0), AGCFPP-001
