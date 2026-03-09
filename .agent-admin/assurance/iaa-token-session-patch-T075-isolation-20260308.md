# IAA Token File — REJECTION-PACKAGE

**Session ID**: session-patch-T075-isolation-20260308
**Date**: 2026-03-08
**Wave**: patch-T075-isolation
**Branch**: copilot/fix-isolate-build-persistent-memory-test
**PR**: fix(test): Isolate buildPersistentMemory() test (T-075) from shared state contamination
**Invoking Agent**: foreman-v2-agent
**Producing Agent**: qa-builder (test fix), foreman-v2-agent (coordination)
**IAA Contract Version**: 2.2.0 | **Knowledge Version**: 2.6.0
**Adoption Phase**: PHASE_B_BLOCKING

---

## Verdict

```
═══════════════════════════════════════════════════════════════
REJECTION-PACKAGE
PR: copilot/fix-isolate-build-persistent-memory-test
    fix(test): Isolate buildPersistentMemory() test (T-075) from shared state contamination

6 check(s) FAILED. Merge BLOCKED. STOP-AND-FIX required.

Token reference: IAA-session-patch-T075-isolation-20260308-REJECTION
Adoption phase: PHASE_B_BLOCKING — Hard gate ACTIVE
═══════════════════════════════════════════════════════════════
```

---

## Failures

| # | Check | Finding | Fix Required |
|---|-------|---------|-------------|
| F-1 | CORE-018 (a) / A-021 | PREHANDOVER proof is UNTRACKED — not committed to branch. `git status` → `?? .agent-workspace/foreman-v2/memory/PREHANDOVER-session-patch-T075-isolation-20260308.md` | `git add .agent-workspace/foreman-v2/memory/PREHANDOVER-session-patch-T075-isolation-20260308.md && git commit -m "gov: add PREHANDOVER proof for patch-T075-isolation" && git push` |
| F-2 | CORE-015 | No session memory for producing agent (qa-builder) in PR bundle. Not listed in PREHANDOVER bundle table. Not in git diff. | Create `.agent-workspace/qa-builder/memory/session-patch-T075-isolation-20260308.md`, commit to branch, list in PREHANDOVER bundle table |
| F-3 | CERT-001 | PREHANDOVER proof not committed — ceremony gate fails. Derived from F-1. | Resolved by F-1 fix |
| F-4 | CERT-002 | Session memory absent from PR bundle. Derived from F-2. | Resolved by F-2 fix |
| F-5 | CERT-003 | FAIL-ONLY-ONCE attestation unverifiable (PREHANDOVER untracked). Derived from F-1. | Resolved by F-1 fix |
| F-6 | CERT-004 | `iaa_audit_token` unverifiable against committed state (PREHANDOVER untracked). Derived from F-1. | Resolved by F-1 fix |

---

## Substantive Assessment (for Foreman context)

The actual test fix (T-T075-ISO-001) is **CORRECT and COMPLETE**:
- BD-013 (anti-dodging): PASS — test asserts on real SupabasePersistentMemoryAdapter behaviour
- BD-011 (test pass rate): PASS — 25/25
- FFA-01 through FFA-06: ALL PASS
- BL-027 scope-to-diff: PASS (validate-scope-to-diff.sh EXIT 0)

**This REJECTION-PACKAGE requires ZERO code changes.** Only two uncommitted ceremony artifacts need to be committed and pushed. Re-invoke IAA after committing both.

---

## Re-Invocation Instructions

1. Commit the PREHANDOVER proof (F-1 fix)
2. Create and commit qa-builder session memory (F-2 fix)
3. Update PREHANDOVER bundle completeness table to list the session memory file
4. Re-commit the PREHANDOVER proof (it has been modified by step 3)
5. Push all commits to `copilot/fix-isolate-build-persistent-memory-test`
6. Re-invoke IAA

**Per A-030**: On re-invocation with a new PREHANDOVER proof commit, this rejection token file
documents the prior rejection verdict. The new PREHANDOVER proof commit satisfies CORE-019
for the re-invocation scenario (A-030 correction addendum path).

---

**Authority**: CS2 (Johan Ras / @APGI-cmy)
**PREHANDOVER proof**: READ-ONLY post-commit — per §4.3b (A-029)
**Merge authority**: CS2 ONLY (@APGI-cmy)
