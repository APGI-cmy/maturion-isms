# IAA Rejection Package — session-161-ecap-001-20260408

**Artifact Type**: REJECTION-PACKAGE  
**Session**: session-161-ecap-001-20260408  
**Wave**: ecap-001-layer-down-implementation  
**Issue**: maturion-isms#1305  
**Branch**: copilot/ecap-001-layer-down-implementation  
**HEAD at review**: f7c4215ffc9d3eaa6bc5628731e833cde5a0bedd  
**IAA Version**: independent-assurance-agent v6.2.0 / contract 2.5.0  
**Date**: 2026-04-08  
**Adoption Phase**: PHASE_B_BLOCKING — Hard gate ACTIVE  
**Authority**: CS2 (Johan Ras / @APGI-cmy)

---

## Verdict

REJECTION-PACKAGE — 2 checks FAILED. Merge blocked. STOP-AND-FIX required.

---

## Findings

### FAILURE 1 — HFMC-02 [Ceremony]: Scope parity miss — suggestions-log.md undeclared

**Check**: HFMC-02 Scope parity  
**Classification**: Ceremony  
**Finding**: `.agent-workspace/foreman-v2/parking-station/suggestions-log.md` is present in the PR diff (2 lines added: S-040 improvement entry + cross-repo-note) but is NOT declared in `SCOPE_DECLARATION.md` "Files Changed in This Wave" section. SCOPE_DECLARATION declares 8 files; PR diff contains 9.  
**Fix required**: Add the following to the "Files Changed in This Wave" section of `SCOPE_DECLARATION.md`:
```
- `.agent-workspace/foreman-v2/parking-station/suggestions-log.md` — S-040 improvement suggestion and cross-repo-note appended (session 161 parking station ceremony)
```

### FAILURE 2 — SCOPE-FORMAT-001 [Systemic]: Em-dash in SCOPE_DECLARATION title

**Check**: Audit request item 6 / S-039 anti-regression  
**Classification**: Systemic (recurring — S-039 from session-160 already flagged this pattern)  
**Finding**: `SCOPE_DECLARATION.md` title reads `# SCOPE_DECLARATION — Wave ecap-001-layer-down-implementation` using em-dash (U+2014). Per S-039 (also committed in this PR's suggestions-log): "em-dash causes silent 0-file parse in validate-scope-to-diff.sh." QP declared PASS without verifying hyphen format despite S-039 explicitly requiring this check.  
**Fix required**: Change title to `# SCOPE_DECLARATION - Wave ecap-001-layer-down-implementation` (hyphen U+002D).  
**Prevention action required (NO-REPEAT-PREVENTABLE-001)**: Add `SCOPE_DECLARATION_TITLE_FORMAT_CHECK` as a BLOCKING row to `FM_QP_ENHANCED_QUICK_REFERENCE.md` QP checklist template. This is a structural prevention requirement, not just a re-detection.

---

## Checks Passed (all substantive AC verifications)

| Check | Result |
|-------|--------|
| AC-001: ECAP broken path fix | PASS ✅ |
| AC-002: AHM section header v1.1.6→v1.0.0 | PASS ✅ |
| AC-003: AHM canon reference v1.1.6→v1.0.0 | PASS ✅ |
| AC-004: §4.3c row added correctly, IAA independence preserved | PASS ✅ |
| AC-005 (SB-002 CRITICAL): Hashes independently verified match | PASS ✅ |
| AC-006: GOVERNANCE_CANON_MANIFEST.md verified | PASS ✅ |
| Invariants: IAA independence, PREHANDOVER immutability, non-substitution | PASS ✅ |
| SB-002 hash sequencing: AHM 179d56c6... ✅ ECAP d98be3c8... ✅ | PASS ✅ |
| PREHANDOVER completeness: All required sections present | PASS ✅ |
| Session memory: fail_only_once_attested, all phases documented | PASS ✅ |
| Ripple assessment (HFMC-01, A-023): Present and non-trivial | PASS ✅ |
| Artifacts committed (HFMC-03): All bundle items at HEAD | PASS ✅ |
| Pre-brief present (HFMC-04): 6 qualifying tasks declared | PASS ✅ |
| Token ceremony (HFMC-05): First invocation exception applies | PASS ✅ |

---

## Resolution Protocol

1. Foreman: Commit two text-only fixes in a single follow-up commit:
   - Add `suggestions-log.md` to `SCOPE_DECLARATION.md` files list
   - Change em-dash to hyphen in `SCOPE_DECLARATION.md` title
2. Foreman: Add `SCOPE_DECLARATION_TITLE_FORMAT_CHECK` to QP checklist template (NO-REPEAT-PREVENTABLE-001)
3. Foreman: Re-invoke IAA on the updated HEAD commit
4. IAA: Re-verify both findings are resolved before issuing ASSURANCE-TOKEN

---

**PHASE_B_BLOCKING_TOKEN: REJECTION-IAA-session-161-wave1305-ecap-001-20260408**

---

*This is a REJECTION-PACKAGE, not an ASSURANCE-TOKEN. Per §4.3b architecture: the Foreman initiates a fresh commit to resolve findings and requests IAA re-invocation. The PREHANDOVER proof is read-only post-commit — do not modify it.*
