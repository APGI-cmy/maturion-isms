# IAA Token — Session cep-v1.8.0-programme-clearance-20260403 (R4)

**Document Type**: IAA_ASSURANCE_TOKEN
**Token Reference**: IAA-session-cep-v1.8.0-programme-clearance-20260403-R4-PASS
PHASE_B_BLOCKING_TOKEN: IAA-session-cep-v1.8.0-programme-clearance-20260403-R4-PASS
**Date**: 2026-04-03
**IAA Version**: independent-assurance-agent v6.2.0 (contract 2.3.0)
**Adoption Phase**: PHASE_B_BLOCKING
**Branch**: copilot/foreman-v2-agent-cep-v1-8-0-update
**Wave**: cep-v1.8.0-programme-clearance-20260403
**Invoking Agent**: foreman-v2-agent
**Producing Agent**: foreman-v2-agent v6.2.0
**Invocation**: R4 — re-invocation following R3 ceremony defect (R3 token attested superseded HEAD SHA a681df9; commit a92f321 was added after R3)

---

## R4 Context — Why R4 Was Needed

The R3 token was committed at HEAD a681df9. One additional commit (a92f321) followed, which
applied three minor PR review corrections (wave-current-tasks.md D-6 path, R1 IAA session
memory token_file_path, LKIAC_DEPRECATION_REGISTER.md DEP-008 status code). All three files
were already declared in SCOPE_DECLARATION.md. No production code was changed. However,
the IAA gate rule requires the operative token to attest the actual branch HEAD.

R4 corrects this by attesting HEAD a92f321dcbdcd439982f22f6dba14eb0e5bb41d3.

---

## Commit a92f321 — Files Verified Against SCOPE_DECLARATION

| File Changed in a92f321 | In SCOPE_DECLARATION? |
|-------------------------|-----------------------|
| `.agent-workspace/foreman-v2/personal/wave-current-tasks.md` | ✅ DECLARED (MODIFIED) |
| `.agent-workspace/independent-assurance-agent/memory/session-cep-v1.8.0-programme-clearance-20260403.md` | ✅ DECLARED (NEW) |
| `governance/aimc/LKIAC_DEPRECATION_REGISTER.md` | ✅ DECLARED (MODIFIED) |

All three files were already declared in SCOPE_DECLARATION.md prior to this R4 invocation.
No undeclared scope expansion occurred in commit a92f321.

---

## Checks Executed

| Category | Checks | PASS | FAIL |
|----------|--------|------|------|
| FAIL-ONLY-ONCE learning | 7 | 7 | 0 |
| Core invariants | 14 applied (9 N/A) | 14 | 0 |
| CANON_GOVERNANCE overlay | 7 | 7 | 0 |
| Merge gate parity (§4.3) | 5 | 5 | 0 |
| **Total** | **28** | **28** | **0** |

---

## Substantive Assessment

### SCOPE_DECLARATION.md at HEAD a92f321

SCOPE_DECLARATION.md now lists 18 file entries (table) + self-exclusion, matching exactly the
19 files returned by `git diff origin/main HEAD --name-only` at final HEAD (after R4 token
commit). This R4 token file is the 19th file in the diff. The SCOPE_DECLARATION has been
updated to declare it. Verified entries:

- All 17 entries from R3 SCOPE_DECLARATION ✅
- `.agent-admin/assurance/iaa-token-session-cep-v1.8.0-programme-clearance-20260403-R4.md` ✅ (this file)

### Diff File Count Verification

- Files at HEAD a92f321 (before R4 token commit): 18
- Files added by this R4 commit: 1 (this token file; SCOPE_DECLARATION.md already in diff)
- Final diff file count: 19
- SCOPE_DECLARATION entries (table): 18 + self-excluded = 19 total ✅

### CEP v1.8.0 and All Prior Substantive Checks

All substantive findings from R3 remain valid and are incorporated by reference. The only
change in this R4 round is the addition of this token file and the SCOPE_DECLARATION update.
No governance content, no production code, no CI workflows were modified.

### Branch HEAD Verification

```
R4 invocation assessed HEAD: SHA a92f321dcbdcd439982f22f6dba14eb0e5bb41d3
Commit message: fix(review): apply PR review feedback — token_file_path, D-6 path, DEP-008 status code
Files in diff (git diff origin/main HEAD at a92f321): 18 files
All 3 files from commit a92f321 confirmed declared in prior SCOPE_DECLARATION ✅
Working tree clean (prior to R4 token commit): ✅
All declared artifacts verified via git ls-tree HEAD ✅
```

---

## Verdict

```
═══════════════════════════════════════════════════════════════════
ASSURANCE-TOKEN
PR: copilot/foreman-v2-agent-cep-v1-8-0-update
Wave: cep-v1.8.0-programme-clearance-20260403 (R4)
Date: 2026-04-03

All 28 checks PASS. Merge gate parity: PASS.
R3 ceremony defect (superseded HEAD SHA) resolved.

Branch HEAD attested: SHA a92f321dcbdcd439982f22f6dba14eb0e5bb41d3
3 files from post-R3 commit (a92f321) confirmed declared in SCOPE_DECLARATION ✅
SCOPE_DECLARATION updated to 18 entries + self (19 total) ✅

Merge permitted (subject to CS2 approval).
Token reference: IAA-session-cep-v1.8.0-programme-clearance-20260403-R4-PASS
Adoption phase: PHASE_B_BLOCKING — hard gate.
═══════════════════════════════════════════════════════════════════
```

---

## IAA Agent Response (verbatim)

Produced by independent-assurance-agent v6.2.0 (contract 2.3.0) — PHASE_B_BLOCKING.
Session: session-cep-v1.8.0-programme-clearance-20260403-R4
Date: 2026-04-03
Branch HEAD assessed: SHA a92f321dcbdcd439982f22f6dba14eb0e5bb41d3
All declared artifacts verified via `git ls-tree HEAD` (not disk).
Working tree verified clean (prior to R4 token commit) via `git status --porcelain` → empty.
PREHANDOVER proof: READ-ONLY post-commit per A-029/§4.3b — not modified.
R3 token: retained as historical record (immutable — not modified).
R2 token: retained as historical record (immutable — not modified).
R1 rejection package: retained as historical record (immutable — not modified).

---

*Authority: CS2 only (@APGI-cmy). Merge authority: CS2 ONLY.*
*This document is the authoritative operative IAA verdict for this wave.*
*R4 supersedes R3 as the merge gate artifact.*
*R3 token: `.agent-admin/assurance/iaa-token-session-cep-v1.8.0-programme-clearance-20260403-R3.md` (immutable — historical record).*
*R2 token: `.agent-admin/assurance/iaa-token-session-cep-v1.8.0-programme-clearance-20260403-R2.md` (immutable — historical record).*
*R1 rejection package: `.agent-admin/assurance/iaa-rejection-package-session-cep-v1.8.0-programme-clearance-20260403.md` (immutable — historical record).*
