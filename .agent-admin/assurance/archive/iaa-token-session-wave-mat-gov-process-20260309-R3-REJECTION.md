# IAA Token — REJECTION-PACKAGE R3
# Session: session-wave-mat-gov-process-20260309-R3
# Date: 2026-03-09
# PR: copilot/implement-governance-process-mat (wave-mat-gov-process)
# Adoption Phase: PHASE_B_BLOCKING

## Verdict: REJECTION-PACKAGE

**Token Reference**: IAA-session-wave-mat-gov-process-20260309-R3-REJECTION

### Checks Failed: 3

#### FAILURE 1 — A-026 / BL-027: SCOPE_DECLARATION.md does not match diff (EXTRA FILES)

- BL-027 extracts 38 files from SCOPE_DECLARATION.md
- git diff 5344fcf..HEAD contains 15 files
- 23 EXTRA files from prior-wave OVL-INJ and session-refresh-auth-fix sections remain in file
- BL-027 validate-scope-to-diff.sh exits code 1 — "EXTRA FILES" violation
- Fix: Completely rewrite SCOPE_DECLARATION.md — retain ONLY wave-mat-gov-process section (15 files)

#### FAILURE 2 — A-028: Prior-wave entries not trimmed

- OVL-INJ wave section (lines 32+) still present in SCOPE_DECLARATION.md
- session-refresh-auth-fix fragment still present
- wave-current-tasks.md declared 3×; SCOPE_DECLARATION.md declared 3×
- R3 fix (SHA 000bb79) prepended new section but left old sections intact
- Fix: DELETE old sections entirely from SCOPE_DECLARATION.md

#### FAILURE 3 — MERGE GATE PARITY (§4.3 — BL-027): FAIL

- Local BL-027 run: exit code 1
- CI will fail on "EXTRA FILES: 23 files declared but not in git diff"
- Merge gate cannot pass in current state

### Fix Required (R4)

Single action: Rewrite SCOPE_DECLARATION.md to contain ONLY the wave-mat-gov-process section.
15 files total (10 producer + 5 A-031 carve-out). Remove OVL-INJ and session-refresh-auth-fix
sections entirely. Commit. Run bash .github/scripts/validate-scope-to-diff.sh and verify exit 0.
Re-invoke IAA as R4.

### What Passed

All 15 files in the branch diff are correctly listed in the wave-mat-gov-process section.
FRS v2.2.0 (FR-104–111), TRS v2.0.0 (TR-103–110), implementation plan v2.7.0, tracker v1.8
all substantively correct. PREHANDOVER proof, session memory, iaa_audit_token all present and
properly formatted per A-029. R4 should pass if SCOPE_DECLARATION.md is fully rewritten.

---
*Merge authority: CS2 ONLY (@APGI-cmy)*
*IAA Version: 6.2.0 | Phase: PHASE_B_BLOCKING*

PHASE_B_BLOCKING_TOKEN: IAA-session-wave-mat-gov-process-20260309-R3-REJECTION
