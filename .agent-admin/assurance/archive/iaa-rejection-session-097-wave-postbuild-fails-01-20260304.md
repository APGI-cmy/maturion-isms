# IAA Rejection Package — session-097 — wave-postbuild-fails-01 — 2026-03-04

**Token Reference**: IAA-session-097-20260304-REJECTION
**Session ID**: session-097
**Date**: 2026-03-04
**PR Branch**: copilot/resolve-supabase-rls-failures
**Issue**: #891 — MAT App: Supabase RLS Failures
**Wave**: postbuild-fails-01
**Invoking Agent**: foreman-v2-agent (session-097)
**Adoption Phase**: PHASE_B_BLOCKING
**Verdict**: REJECTION-PACKAGE

---

## Summary

9 checks failed. Merge BLOCKED. STOP-AND-FIX required.

All technical deliverables (migration SQL, tests, governance docs) are confirmed correct.
The failure is entirely in the governance ceremony: PREHANDOVER proof absent, session memory
absent, SCOPE_DECLARATION.md stale from a different PR.

---

## Failures Cited

| ID | Check | Finding | Fix Required |
|----|-------|---------|--------------|
| CORE-018 | Evidence artifact sweep | PREHANDOVER proof absent, session memory absent, iaa_audit_token absent, verbatim section absent | Create PREHANDOVER proof + session memory on branch |
| CORE-013 | IAA invocation evidence | No PREHANDOVER proof or IAA token on branch | Create PREHANDOVER proof |
| CORE-015 | Session memory present | No session memory for foreman session-097 on branch | Create foreman session memory file |
| CORE-016 | IAA tool call evidenced | No `## IAA Agent Response (verbatim)` section | Include section in PREHANDOVER proof |
| MERGE-GATE-PARITY | validate-scope-to-diff.sh | SCOPE_DECLARATION.md from different PR (CodexAdvisor session-045); 0/9 PR files declared | Replace SCOPE_DECLARATION.md with this PR's 11-file declaration |
| OVL-AM-004 | Architecture ripple/impact plan | PREHANDOVER absent | Include before/after diff + ripple assessment in PREHANDOVER |
| OVL-AM-005 | Wave gap register trace | PREHANDOVER absent | Reference GAP-001 to GAP-005 in PREHANDOVER |
| OVL-AM-006 | Environment parity validation | No parity statement committed | Include environment parity section in PREHANDOVER |
| OVL-AM-007 | Session memory learning notes | Session memory not on branch | Session memory must include concrete learning note |
| OVL-AM-008 | End-to-end wiring trace | PREHANDOVER absent | Include full 5-element wiring trace in PREHANDOVER |

---

## Remediation Sequence

1. Create PREHANDOVER proof with all overlay content (OVL-AM-004, 005, 006, 008)
2. Create foreman-v2-agent session-097 memory file with learning notes (OVL-AM-007)
3. Update SCOPE_DECLARATION.md to exactly match 11-file PR diff (A-026)
4. Commit and push all three files
5. Re-invoke IAA (new session number)

---

## Technical Quality Confirmation

The following are confirmed correct and require no re-work:
- Migration SQL: idempotent, SECURITY DEFINER, all 5 gaps addressed ✅
- Tests T-PBF-001 to T-PBF-004: 4/4 GREEN, real assertions ✅
- TEST_REGISTRY.json: T-PBF-001 to T-PBF-004 registered (CAT-14, P0) ✅
- FR-082/083, TR-082/083: Present and correct ✅
- BUILD_PROGRESS_TRACKER.md: Wave section added correctly ✅
- Zero .github/agents/ modifications (CORE-017 PASS) ✅

---

**Authority**: CS2 (Johan Ras / @APGI-cmy)
**IAA Version**: 6.2.0 | **Contract**: 2.0.0
**STOP-AND-FIX mandate**: ACTIVE — No PR opens until ASSURANCE-TOKEN issued
