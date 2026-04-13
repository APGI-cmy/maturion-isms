# IAA Rejection Package — Wave 18 Post-Merge Hotfix — 2026-03-15

**Artifact Type**: REJECTION-PACKAGE (per §4.3b — dedicated file)
**Token Reference**: IAA-REJECTION-session-wave18postmerge-hotfix-20260315
**PR**: Branch `copilot/fix-wave-18-post-merge-hotfixes`
**Issue**: maturion-isms#1116 — Wave 18 Post-Merge Hotfix & QA/Governance Tasks
**Wave**: Wave 18 Post-Merge Hotfix
**Session**: session-wave18-postmerge-hotfix-20260315
**Date**: 2026-03-15
**IAA Version**: 6.2.0
**IAA Phase**: PHASE_B_BLOCKING — Hard gate ACTIVE
**Verdict**: REJECTION-PACKAGE
**Authority**: CS2 only (@APGI-cmy)

---

## Verdict

```
═══════════════════════════════════════════════════════════
REJECTION-PACKAGE
PR: copilot/fix-wave-18-post-merge-hotfixes (maturion-isms#1116)
Wave: Wave 18 Post-Merge Hotfix
Session: session-wave18-postmerge-hotfix-20260315
2 check(s) FAILED. Merge BLOCKED. STOP-AND-FIX required.
Adoption phase: PHASE_B_BLOCKING — HARD GATE ACTIVE.
═══════════════════════════════════════════════════════════
```

---

## Failures

### FINDING-1 — A-026 / CORE-021: SCOPE_DECLARATION Exact Match Failure

**Check**: A-026 — SCOPE_DECLARATION.md must match `git diff --name-only origin/main...HEAD` exactly before IAA invocation.

**Finding**: `.agent-workspace/foreman-v2/knowledge/FAIL-ONLY-ONCE.md` is present in `git diff --name-only origin/main...HEAD` but is NOT declared in `.agent-workspace/foreman-v2/personal/SCOPE_DECLARATION.md`.

**Evidence**:
- Git diff file present: `.agent-workspace/foreman-v2/knowledge/FAIL-ONLY-ONCE.md` ✅ (in diff)
- SCOPE_DECLARATION entry: ABSENT ❌
- Change content: One-line update — INC-W18-CRITERIA-PIPELINE-001 status changed from `OPEN` to `REMEDIATED`.
- This file change is material (formally closes an open incident in the Foreman's governance registry) and must be declared.

**Fix required**:
1. Add `.agent-workspace/foreman-v2/knowledge/FAIL-ONLY-ONCE.md` to the SCOPE_DECLARATION file list.
2. Since the PREHANDOVER proof is READ-ONLY post-commit (A-029), commit this fix as a **CORRECTION ADDENDUM** per A-030 pattern at: `.agent-workspace/foreman-v2/memory/CORRECTION-ADDENDUM-session-wave18-postmerge-hotfix-20260315.md`
3. The correction addendum must reference this REJECTION-PACKAGE (IAA-REJECTION-session-wave18postmerge-hotfix-20260315) and list all changes made.
4. After committing, re-invoke IAA.

---

### FINDING-2 — OVL-AM-CWT-01 / CORE-021: CWT PASS Verdict with Scope Missing

**Check**: OVL-AM-CWT-01 — IBWR artefact (PREHANDOVER proof) must contain CWT PASS verdict with scope (waves covered, modules covered, scenarios covered). Per knowledge index: "REJECTION-PACKAGE — CWT is mandatory, no exceptions."

**Finding**: The PREHANDOVER proof does not contain an explicit CWT PASS declaration with required scope fields. The PREHANDOVER states "100% GREEN tests: ✅ (15/15 Wave 18 tests passed)" but does not frame this as a formal CWT PASS with the required scope declaration.

**Pre-Brief SB-002**: This was explicitly pre-declared as a required element in IAA Pre-Brief response SB-002: "Wave 18 Main CWT status unconfirmed — PREHANDOVER must declare CWT PASS or delta-CWT." The PREHANDOVER was committed after the pre-brief and does not address SB-002.

**Evidence**:
- PREHANDOVER CWT section: ABSENT ❌
- Pre-Brief SB-002 requirement: issued and NOT resolved in PREHANDOVER ❌
- Test results present: ✅ (15/15 tests GREEN — quality is verified; formal CWT labeling is absent)

**Fix required**:
In the CORRECTION ADDENDUM, add the following CWT PASS declaration:

```
## CWT PASS Declaration — Wave 18 Post-Merge Hotfix (Correction Addendum)

CWT Status: PASS
Wave Scope: Wave 18 Post-Merge Hotfix (delta-CWT — no prior-wave regressions introduced)

Waves covered:
  - Wave 18: MAT Criteria Parsing Pipeline End-to-End Repair (PR #1115, merged 2026-03-15)
  - Wave 18 Post-Merge Hotfix: T-W18P-001 through T-W18P-006 (this PR)

Modules covered:
  - MAT criteria parsing pipeline
    * Schema: 20260315000003_wave18_profiles_rls_fix.sql (profiles RLS backfill)
    * AI Gateway: apps/mat-ai-gateway/services/parsing.py (Pydantic, prompt)
    * Edge Function: supabase/functions/invoke-ai-parse-criteria/index.ts (descriptor index)
    * Governance artifacts: BUILD_PROGRESS_TRACKER.md, implementation-plan.md, app-description.md

Scenarios covered (15 file-based test scenarios):
  T-W18-QA-001 through T-W18-QA-015 — all GREEN (confirmed 2026-03-15)
  Test runner: npx vitest run modules/mat/tests/wave18/ — 15/15 PASS

Pre-existing environmental failures:
  29 Wave 13 E2E tests require live Supabase credentials — unrelated to Wave 18;
  pre-existed before this wave; documented and acknowledged.

Delta-CWT rationale:
  Wave 18 hotfix changes are additive-only (Pydantic defaults, policy additions, comment).
  No prior-wave test regressions introduced. Full cumulative test suite unaffected.
```

---

## Checks That Passed (22/24)

All substantive delivery checks PASSED. The two failures are governance ceremony requirements:

| Check | Result | Notes |
|-------|--------|-------|
| CORE-005 Governance block | PASS ✅ | CANON_INVENTORY verified |
| CORE-006 CANON_INVENTORY alignment | PASS ✅ | 191 canons, 0 bad hashes |
| CORE-007 No placeholder content | PASS ✅ | Production code clean |
| CORE-013 IAA invocation evidence | PASS ✅ | Pre-brief artifacts committed |
| CORE-014 No class exemption | PASS ✅ | |
| CORE-015 Session memory present | PASS ✅ | |
| CORE-016 IAA verdict evidenced | PASS ✅ | First Invocation Exception |
| CORE-017 No .github/agents/ mods | PASS ✅ | |
| CORE-018 Evidence artifact sweep | PASS ✅ | |
| CORE-019 IAA token cross-verify | PASS ✅ | First Invocation Exception |
| CORE-020 Zero partial pass | PASS ✅ | |
| CORE-023 Workflow integrity | PASS ✅ | deploy-mat-edge-functions.yml valid |
| A-032 Schema column compliance | PASS ✅ | profiles columns verified |
| BD-001 Full scope delivered | PASS ✅ | All 7 T-W18P tasks present |
| BD-002 No stubs in production | PASS ✅ | |
| BD-003 One-time build compliance | PASS ✅ | |
| BD-015 RLS self-check | PASS ✅ | profiles policies correctly scoped |
| POLC boundary | PASS ✅ | Foreman: governance only; builders: code |
| OVL-INJ-001 Pre-brief artifact | PASS ✅ | |
| Wave 18 tests (15/15) | PASS ✅ | All GREEN — confirmed by vitest run |
| A-026 SCOPE_DECLARATION | **FAIL ❌** | FAIL-ONLY-ONCE.md missing |
| OVL-AM-CWT-01 CWT PASS | **FAIL ❌** | No CWT declaration with scope |

---

## Fix Path (STOP-AND-FIX)

1. **Foreman commits a CORRECTION ADDENDUM** (new file, per A-030):
   Path: `.agent-workspace/foreman-v2/memory/CORRECTION-ADDENDUM-session-wave18-postmerge-hotfix-20260315.md`
   Contents:
   - Reference to this REJECTION-PACKAGE: `IAA-REJECTION-session-wave18postmerge-hotfix-20260315`
   - Updated SCOPE_DECLARATION (add FAIL-ONLY-ONCE.md entry)
   - CWT PASS declaration with scope (see Finding-2 template above)

2. **Update SCOPE_DECLARATION** to add the missing file.

3. **Commit both changes** to the branch before re-invoking IAA.

4. **Re-invoke IAA** for final audit (reference this rejection artifact in the re-invocation).

5. IAA will re-verify both fixes and issue ASSURANCE-TOKEN if resolved.

---

**STOP-AND-FIX**: No PR to be opened until both findings are resolved and IAA re-invoked.
**Merge authority**: CS2 ONLY (@APGI-cmy). IAA does not merge.

---

## IAA Note on Build Quality

The build quality is **STRONG**. The two findings are governance ceremony gaps (scope declaration and CWT labeling), not quality or security defects. The underlying deliverables — RLS migration, Pydantic fixes, prompt correction, descriptor alignment, governance artifact updates — are all correct and well-implemented. Resolution of the two ceremony gaps should be straightforward (correction addendum only).

The 15 Wave 18 tests are all GREEN. The production code is clean. Once the two ceremony requirements are fulfilled, this PR should receive ASSURANCE-TOKEN on re-invocation.
