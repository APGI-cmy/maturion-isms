# IAA REJECTION-PACKAGE — session-131-20260304

**Agent**: independent-assurance-agent v6.2.0
**Session**: session-131-20260304
**Date**: 2026-03-04
**Adoption Phase**: PHASE_B_BLOCKING
**Prior Rejection**: IAA-session-130-20260304-REJECTION (8 failures)
**This Rejection**: IAA-session-131-20260304-REJECTION (1 failure — remaining)

---

## PR Under Review

- **Branch**: `copilot/propagate-governance-changes-e45c6ae2-8853-4ff3-bb03-1720769d28b6`
- **Issue**: APGI-cmy/maturion-isms#876 — [Layer-Down] Propagate Governance Changes 2026-03-04 (61ab7b83)
- **Invoking Agent**: governance-liaison-isms (session-045-20260304)
- **Producing Agent**: governance-liaison-isms (session-045-20260304)
- **PR Category**: CI_WORKFLOW

---

## Verdict

```
═══════════════════════════════════════════════════════════════
REJECTION-PACKAGE
PR: copilot/propagate-governance-changes-e45c6ae2-8853-4ff3-bb03-1720769d28b6
    Issue #876 — [Layer-Down] Propagate Governance Changes (61ab7b83)

1 check FAILED. Merge blocked. STOP-AND-FIX required.

FAILURES:
  BL-027 / A-026 / A-028: SCOPE_DECLARATION.md fails exact-match validation.
    Finding: BL-027 validate-scope-to-diff.sh exits code 1.
    Git diff has 11 files; SCOPE_DECLARATION.md declares 47 files.
    → 4 files in git diff NOT declared:
       (1) .agent-admin/assurance/rejection-package-session-130-20260304.md
       (2) .agent-workspace/independent-assurance-agent/memory/session-130-20260304.md
       (3) .agent-workspace/independent-assurance-agent/parking-station/suggestions-log.md
       (4) .github/workflows/ripple-integration.yml  ← PRIMARY CI CHANGE — UNDECLARED
    → 40 extra files declared that are NOT in this branch's diff.
       These are from the CodexAdvisor session-045 agent contracts PR (a different
       branch/PR), LEGACY_BOUNDARY files, and governance-liaison knowledge files.
       They must be removed from SCOPE_DECLARATION.md for this PR.
    Fix required:
      1. Run: git diff --name-only origin/main...HEAD | sort
         (result: the 11 files listed above)
      2. Replace SCOPE_DECLARATION.md "Files Declared" section entirely with ONLY those
         11 files, one per line, using list format:
         - `<path>` - <one-line description>
      3. Remove all CodexAdvisor session-045 entries, LEGACY_BOUNDARY entries, and any
         entries not present in the current branch's diff.
      4. Commit and push the corrected SCOPE_DECLARATION.md.
      5. Re-invoke IAA.
    Authority: FAIL-ONLY-ONCE A-026 (BL-027 scope-to-diff rule), A-028 (format/trim),
               MERGE_GATE_PHILOSOPHY.md.

Adoption phase: PHASE_B_BLOCKING — hard gate ACTIVE
═══════════════════════════════════════════════════════════════
```

---

## What PASSES (preserve — substantive work is sound)

- CI workflow fix (`continue-on-error: true` on label steps): SUBSTANTIVELY CORRECT ✅
- PREHANDOVER proof: PRESENT — ceremony structure correct ✅
- IAA Agent Response (verbatim) section: PRESENT — rejection output included ✅
- A-006 PHASE_A_ADVISORY fabrication: REMOVED — session memory correct ✅
- OVL-CI-001 through OVL-CI-006: ALL PASS ✅
- CORE-005, 006, 007, 013, 014, 015, 016, 017, 018, 019, 020, 022: ALL PASS ✅
- CANON_INVENTORY: 191 canons, 0 bad hashes ✅
- A-021: committed before invocation ✅

---

## Specific Fix Required

Run the following BEFORE re-invoking IAA:

```bash
# Step 1: Verify exact diff
git diff --name-only origin/main...HEAD | sort
# Expected output (11 files):
# .agent-admin/assurance/rejection-package-session-130-20260304.md
# .agent-admin/assurance/rejection-package-session-131-20260304.md  ← ADD THIS (written by IAA this session)
# .agent-admin/governance/ripple-log.json
# .agent-admin/governance/sync_state.json
# .agent-workspace/governance-liaison-isms/escalation-inbox/escalation-agent-contracts-61ab7b83-20260304.md
# .agent-workspace/governance-liaison-isms/memory/session-045-20260304.md
# .agent-workspace/governance-liaison-isms/parking-station/suggestions-log.md
# .agent-workspace/independent-assurance-agent/memory/session-130-20260304.md
# .agent-workspace/independent-assurance-agent/memory/session-131-20260304.md  ← ADD THIS (written by IAA this session)
# .agent-workspace/independent-assurance-agent/parking-station/suggestions-log.md
# .github/workflows/ripple-integration.yml
# PREHANDOVER_PROOF_SESSION_045_RIPPLE_61AB7B83.md
# SCOPE_DECLARATION.md

# NOTE: IAA will commit session-131 artifacts after issuing this rejection.
# Re-run git diff after IAA commits to get the final exact file list.

# Step 2: Verify list-format count matches
git diff --name-only origin/main...HEAD | wc -l
grep -E '^\s*-\s+`[^`]+`\s+-\s+' SCOPE_DECLARATION.md | wc -l
# These MUST match.
```

Replace SCOPE_DECLARATION.md with ONLY the files from `git diff --name-only origin/main...HEAD`.
Use list format: `- \`path/to/file\` - one-line description`

---

**Authority**: CS2 (Johan Ras / @APGI-cmy)
**Merge authority**: CS2 ONLY
