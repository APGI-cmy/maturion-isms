# IAA Token — session-cwt-envvars — wave-cwt-envvars — 2026-03-07

**Token Reference**: IAA-session-cwt-envvars-wave-cwt-envvars-20260307-REJECTION
**Session ID**: session-cwt-envvars-20260307
**Date**: 2026-03-07
**IAA Agent Version**: 6.2.0
**Contract Version**: 2.2.0
**Adoption Phase**: PHASE_B_BLOCKING
PHASE_B_BLOCKING_TOKEN: IAA-session-cwt-envvars-wave-cwt-envvars-20260307-REJECTION
**Verdict**: REJECTION-PACKAGE
**Invoking Agent**: foreman-v2-agent v6.2.0
**Producing Agents**: integration-builder + foreman-v2-agent
**PR**: copilot/fix-supabase-env-vars-for-tests (PR #976)
**Wave**: wave-cwt-envvars
**Branch Head SHA**: cfd396392e870a4594006e7a19c9d87a2cabc8e3

---

## IAA Verdict (Verbatim)

```
═══════════════════════════════════════
REJECTION-PACKAGE
PR: copilot/fix-supabase-env-vars-for-tests (#976) — Fix CWT: Pass Supabase env vars to test runner
1 check FAILED. Merge blocked. STOP-AND-FIX required.

FAILURES:
  BL-027 / A-026: SCOPE_DECLARATION.md — Exact Match Failure
    Finding: validate-scope-to-diff.sh exits with code 1.
    SCOPE_DECLARATION.md declares 3 parseable files; git diff --name-only origin/main...HEAD
    returns 8 changed files. 5 files from the diff are not declared.

    Root Cause A (A-028 format): Two deliverable file entries use em-dash (—) as separator
    instead of the required hyphen (-). The script parser requires the format:
      - `path/to/file` - description
    but finds: - `path/to/file` — description (em-dash). These two entries fail to parse:
      - .github/workflows/deploy-mat-ai-gateway.yml
      - modules/mat/00-app-description/BUILD_PROGRESS_TRACKER.md

    Root Cause B (missing ceremony files): Three ceremony files committed in cfd3963
    are entirely absent from SCOPE_DECLARATION.md:
      - .agent-workspace/foreman-v2/memory/PREHANDOVER-session-cwt-envvars-wave-cwt-envvars-20260307.md
      - .agent-workspace/foreman-v2/memory/session-cwt-envvars-20260307.md
      - .agent-workspace/foreman-v2/parking-station/suggestions-log.md

    Fix required: Rewrite SCOPE_DECLARATION.md using correct hyphen format for ALL 8 files
    in the diff. Example correct format:
      - `.github/workflows/deploy-mat-ai-gateway.yml` - description
    All 8 files must be listed. Then commit + push BEFORE re-invoking IAA (A-021).

This PR must not be opened until this failure is resolved and IAA re-invoked.
Adoption phase: PHASE_B_BLOCKING — hard gate.
═══════════════════════════════════════
```

---

## Checks Summary

| # | Check ID | Check Name | Verdict |
|---|----------|-----------|---------|
| 1 | A-001 | IAA invocation evidence | PASS ✅ |
| 2 | A-002 | No class exceptions | PASS ✅ |
| 3 | CORE-005 | Governance block present | PASS ✅ |
| 4 | CORE-006 | CANON_INVENTORY alignment | PASS ✅ |
| 5 | CORE-007 | No placeholder content | PASS ✅ |
| 6 | CORE-013 | IAA invocation evidence | PASS ✅ |
| 7 | CORE-015 | Session memory present | PASS ✅ |
| 8 | CORE-016 | IAA verdict evidenced (§4.3b) | PASS ✅ (first invocation exception) |
| 9 | CORE-017 | No .github/agents/ modifications | PASS ✅ |
| 10 | CORE-018 | Complete evidence artifact sweep | PASS ✅ |
| 11 | CORE-019 | IAA token cross-verification | PASS ✅ (first invocation exception) |
| 12 | CORE-020 | Zero partial pass rule | PASS ✅ |
| 13 | OVL-CI-001 | Workflow policy correctness | PASS ✅ |
| 14 | OVL-CI-002 | Merge gate integrity | PASS ✅ |
| 15 | OVL-CI-003 | Silent failure risk | PASS ✅ |
| 16 | OVL-CI-004 | Environment parity | PASS ✅ |
| 17 | OVL-CI-005 | CI evidence present | PASS ✅ (independent verification) |
| 18 | BD-001 | Full scope delivered | PASS ✅ |
| 19 | BD-002 | No stubs | PASS ✅ |
| 20 | BD-003 | One-time build compliance | PASS ✅ |
| 21 | BD-016 | No hardcoded secrets | PASS ✅ |
| 22 | FFA-01 | Delivery completeness | PASS ✅ |
| 23 | CORE-021 | Zero-severity-tolerance | APPLIED |
| 24 | BL-027 | Merge gate parity — scope-to-diff | **FAIL ❌** |
| — | A-026 | SCOPE_DECLARATION exact match | **FAIL ❌** |

**Total: 25 checks, 23 PASS, 1 FAIL (BL-027/A-026 — same root cause)**

---

## Merge Gate Parity (§4.3)

| Check | Local Result |
|-------|-------------|
| Merge Gate Interface / merge-gate/verdict | FAIL ❌ (BL-027 EXIT 1) |
| Merge Gate Interface / governance/alignment | PASS ✅ |
| Merge Gate Interface / stop-and-fix/enforcement | PASS ✅ |

**Parity result: FAIL** — BL-027 scope-to-diff validation failed.

---

## Substantive Quality Assessment

**This REJECTION-PACKAGE is caused SOLELY by SCOPE_DECLARATION.md format/completeness.**

All substantive checks PASS:

- **Workflow fix (T-CWT-EV-001)**: CORRECT. Step-level `env:` block only (not job-level). Three
  correct secret references. No `continue-on-error`. `set -o pipefail` preserved. YAML valid.
  CWT job `if:` condition unchanged. No existing steps/permissions weakened.
- **Documentation (T-CWT-EV-002)**: COMPLETE. JWT generation Method A + B documented. GitHub
  Secrets location correctly described. Table of 3 secret names with format descriptions (no values).
  Expected test outcomes listed (8 GREEN, T-W13-E2E-1 excluded with rationale). BD-016 compliant.
- **Governance ceremony**: PREHANDOVER proof and session memory both on branch. No agent contract
  modifications. CANON_INVENTORY verified.

---

## OVL-CI-005 Observation (not a rejection finding)

PREHANDOVER §9 cites run `22798614542` as "triggered on PR push, commit e649b85."

**IAA verification**: Run `22798614542` was actually triggered at commit `f7cc7ab` (Initial Plan)
— BEFORE the workflow fix was committed. This claim is factually incorrect.

**Correct evidence independently verified by IAA**:
- Run `22798803030` (Deploy MAT AI Gateway) at commit `e649b8540` — post-fix, `action_required`
  (expected behavior: workflow ran to environment approval gate, YAML valid)
- Run `22798832075` (Deploy MAT AI Gateway) at commit `cfd39639` — HEAD, `action_required`

OVL-CI-005 PASSES on substantive grounds. When re-submitting, update PREHANDOVER §9 to cite:
`https://github.com/APGI-cmy/maturion-isms/actions/runs/22798803030`

---

## Fix Required (Complete Procedure)

1. Update `SCOPE_DECLARATION.md`:
   - Change all em-dash (`—`) separators to hyphen (`-`) in file entries
   - Add the 3 missing ceremony files
   - All 8 files must be listed using format: `- \`path/file.ext\` - description`
   - Required format (example): `- \`.github/workflows/deploy-mat-ai-gateway.yml\` - added env: block (step-level only)`

2. Optionally: correct PREHANDOVER §9 CI evidence URL to `22798803030` (advisory — not blocking)

3. `git add SCOPE_DECLARATION.md && git commit -m "fix(scope): correct SCOPE_DECLARATION.md format and add ceremony files" && git push`

4. Verify: `bash .github/scripts/validate-scope-to-diff.sh` exits 0

5. Re-invoke IAA (A-021 compliant: all changes committed before invocation)

Per A-030: a correction addendum commit satisfies CORE-019 for re-invocation. The existing
PREHANDOVER proof is read-only (A-029). The correction addendum (this token file) is the
resolution path for re-invocation.

---

**Authority**: CS2 (Johan Ras / @APGI-cmy)
**IAA Agent**: independent-assurance-agent v6.2.0
**Merge authority**: CS2 ONLY. This PR must not be opened until ASSURANCE-TOKEN is issued.
