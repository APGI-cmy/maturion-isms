# IAA Token — session-cwt-envvars — wave-cwt-envvars — 2026-03-07 — PASS

**Token Reference**: IAA-session-cwt-envvars-wave-cwt-envvars-20260307-PASS
**Session ID**: session-cwt-envvars-20260307
**Date**: 2026-03-07
**IAA Agent Version**: 6.2.0
**Contract Version**: 2.2.0
**Adoption Phase**: PHASE_B_BLOCKING
PHASE_B_BLOCKING_TOKEN: IAA-session-cwt-envvars-wave-cwt-envvars-20260307-PASS
**Verdict**: ASSURANCE-TOKEN
**Invocation Type**: A-030 RE-INVOCATION (correction path — prior REJECTION remediated)
**Invoking Agent**: foreman-v2-agent v6.2.0
**Producing Agents**: integration-builder + foreman-v2-agent
**PR**: copilot/fix-supabase-env-vars-for-tests (#976)
**Wave**: wave-cwt-envvars
**Branch**: copilot/fix-supabase-env-vars-for-tests
**Branch Head SHA**: 41e0c36 (fix(scope): correct SCOPE_DECLARATION.md format and add all ceremony/IAA files (BL-027 A-030 fix))

---

## Prior Rejection Reference

**Prior rejection token**: `.agent-admin/assurance/iaa-token-session-cwt-envvars-wave-cwt-envvars-20260307.md`
**Prior rejection reference**: IAA-session-cwt-envvars-wave-cwt-envvars-20260307-REJECTION
**Finding remediated**: F-1 — BL-027 / A-026 — SCOPE_DECLARATION.md format failure (em-dash instead of hyphen; missing ceremony files)

**Remediation verified**:
- SCOPE_DECLARATION.md rewritten with correct hyphen format (` - ` separator) for all 11 entries
- All 11 files from `git diff --name-only origin/main...HEAD` declared
- validate-scope-to-diff.sh: **EXIT CODE 0** — exact set match confirmed (11 declared = 11 diff, 0 missing, 0 extra)

---

## IAA Verdict (Verbatim)

```
═══════════════════════════════════════
ASSURANCE-TOKEN
PR: copilot/fix-supabase-env-vars-for-tests (#976) — Fix CWT: Pass Supabase env vars to test runner
All 31 checks PASS. Merge gate parity: PASS.
Merge permitted (subject to CS2 approval).
Token reference: IAA-session-cwt-envvars-wave-cwt-envvars-20260307-PASS
Adoption phase: PHASE_B_BLOCKING — hard gate ACTIVE
A-030 re-invocation: single prior finding F-1 (BL-027) — REMEDIATED ✅
═══════════════════════════════════════
```

---

## Check Summary

| Phase | Check | Verdict |
|-------|-------|---------|
| FAIL-ONLY-ONCE | A-001 IAA invocation evidence | PASS ✅ |
| FAIL-ONLY-ONCE | A-021 pre-IAA commit gate | PASS ✅ |
| FAIL-ONLY-ONCE | A-026 SCOPE_DECLARATION exact match | PASS ✅ |
| FAIL-ONLY-ONCE | A-028 SCOPE_DECLARATION format | PASS ✅ |
| FAIL-ONLY-ONCE | A-029 PREHANDOVER immutability | PASS ✅ |
| FAIL-ONLY-ONCE | A-030 re-invocation path | PASS ✅ |
| CORE-001 | Deliverable present and matches task | PASS ✅ |
| CORE-003 | CS2 authorization documented | PASS ✅ |
| CORE-004 | No hardcoded credentials | PASS ✅ |
| CORE-005 | Branch matches wave scope | PASS ✅ |
| CORE-006 | PREHANDOVER proof complete | PASS ✅ |
| CORE-007 | No merge gate weakening | PASS ✅ |
| CORE-008 | Scope declaration matches diff (BL-027) | PASS ✅ |
| CORE-009 | No prohibited patterns | PASS ✅ |
| CORE-010 | Documentation complete | PASS ✅ |
| CORE-015 | Session memory present | PASS ✅ |
| CORE-016 | IAA verdict evidenced (§4.3b) | PASS ✅ |
| CORE-017 | No unauthorized agent contract modifications | PASS ✅ |
| CORE-018 | Complete evidence artifact sweep | PASS ✅ |
| CORE-019 | IAA token cross-verification | PASS ✅ (A-030 creating invocation) |
| CORE-020 | Zero partial pass rule | PASS ✅ |
| CORE-021 | Zero-severity-tolerance | PASS ✅ |
| OVL-CI-001 | Workflow policy correctness | PASS ✅ |
| OVL-CI-002 | Merge gate integrity | PASS ✅ |
| OVL-CI-003 | Silent failure risk | PASS ✅ |
| OVL-CI-004 | Environment parity | PASS ✅ |
| OVL-CI-005 | CI evidence present | PASS ✅ |
| OVL-AAWP | Documentation substance | PASS ✅ |
| MERGE GATE | BL-027 validate-scope-to-diff.sh | PASS ✅ (EXIT 0) |
| MERGE GATE | YAML validation | PASS ✅ |
| MERGE GATE | Governance alignment | PASS ✅ |

**Total: 31 checks — 31 PASS — 0 FAIL**

---

## Key Evidence

### Workflow Fix (T-CWT-EV-001)
- **File**: `.github/workflows/deploy-mat-ai-gateway.yml`
- **Change**: `env:` block at step level on `Run Combined Wave Tests (MAT-T-0001–0098)` step
- **Env vars**: VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY, MAT_E2E_TEST_TOKEN (all `${{ secrets.VAR }}` pattern)
- **Scoping**: Step-level only — NOT at job level (correct — prevents secret contamination of other steps)
- **continue-on-error**: None (confirmed via YAML parse)
- **Silent failure prevention**: `set -o pipefail` present in `run:` block

### CI Evidence (OVL-CI-005)
- **Run**: Deploy MAT AI Gateway — `22798803030`
- **Commit**: `e649b854` (post-fix commit)
- **Status**: completed (action_required — reached environment approval gate; confirms YAML valid and cwt job structure processed)
- **PREHANDOVER §9**: Correctly references this run (corrected from prior erroneous citation of 22798614542)

### SCOPE_DECLARATION.md — BL-027 PASS
- **Script**: `.github/scripts/validate-scope-to-diff.sh`
- **Exit code**: 0
- **Result**: 11 declared = 11 diff — exact match, 0 missing, 0 extra
- **Format**: All entries use ` - ` (hyphen) separator — A-028 compliant

---

## §4.3b Architecture Note

Per §4.3b:
- This token is written as a **new dedicated file**: `iaa-token-session-cwt-envvars-wave-cwt-envvars-20260307-PASS.md`
- The prior REJECTION token file (`iaa-token-session-cwt-envvars-wave-cwt-envvars-20260307.md`) is **unchanged and immutable**
- The PREHANDOVER proof (`PREHANDOVER-session-cwt-envvars-wave-cwt-envvars-20260307.md`) is **unchanged and immutable** (IAA did not edit it — A-029 compliant)

---

**Authority**: CS2 (Johan Ras / @APGI-cmy)
**IAA Agent**: independent-assurance-agent v6.2.0
**Contract**: 2.2.0
**Issued**: 2026-03-07
