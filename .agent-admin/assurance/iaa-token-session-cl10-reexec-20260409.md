# IAA ASSURANCE-TOKEN — Session cl10-reexec-R2-20260409

**Token Reference**: IAA-session-cl10-reexec-R2-20260409-PASS
**PHASE_B_BLOCKING_TOKEN**: IAA-session-cl10-reexec-R2-20260409-PASS
**Date**: 2026-04-09
**Agent**: independent-assurance-agent v6.2.0 (contract 2.5.0)
**Adoption Phase**: PHASE_B_BLOCKING — Hard gate ACTIVE
**Authority**: CS2 (Johan Ras / @APGI-cmy)

---

## Verdict

```
═══════════════════════════════════════════════════════════════
ASSURANCE-TOKEN
PR: copilot/cl-10-routing-governance-ci-enforcement-again
    Wave CL-10 (Re-execution) — Issue maturion-isms#1313 — Round R2
All 36 checks PASS. Merge gate parity: PASS.
Merge permitted (subject to CS2 approval).
Token reference: IAA-session-cl10-reexec-R2-20260409-PASS
Adoption phase: PHASE_B_BLOCKING — Hard gate ACTIVE
═══════════════════════════════════════════════════════════════
```

---

## Invocation Context

| Field | Value |
|-------|-------|
| PR branch | `copilot/cl-10-routing-governance-ci-enforcement-again` |
| Issue | maturion-isms#1313 |
| Round | R2 (R1 REJECTION-PACKAGE resolved) |
| Invoked by | foreman-v2-agent |
| Work produced by | integration-builder (CL-10-D2 workflow + tests), foreman-v2-agent (ceremony) |
| Producer class | builder / foreman |
| Ceremony-admin appointed | NO |
| PR category | CI_WORKFLOW (primary) + AAWP_MAT (secondary) |
| R1 finding resolved | A-026 SCOPE_DECLARATION parity — 4 Foreman ceremony files absent → fixed at SHA 0cd10aa0 |

---

## Summary of Checks

| Category | Checks | PASS | FAIL | N/A |
|----------|--------|------|------|-----|
| FAIL-ONLY-ONCE learning | 4 | 4 | 0 | 0 |
| HFMC (01–06) | 6 | 6 | 0 | 0 |
| ECAP three-role split | N/A | — | — | — |
| Core invariants (CORE-001–025) | 25 | 13 | 0 | 12 |
| CI_WORKFLOW overlay (OVL-CI-001–005) | 5 | 5 | 0 | 0 |
| OVL-INJ-001 Pre-Brief existence | 1 | 1 | 0 | 0 |
| BUILD_DELIVERABLE overlay (applicable) | 17 | 7 | 0 | 10 |
| **TOTAL** | **58** | **36** | **0** | **22** |

All 36 executed checks: **PASS**.

---

## Key Substantive Findings (Positive)

### CI Workflow — GRS-016 Policy Correctness (OVL-CI-001)
- Scans `modules/*/package.json` and `apps/*/package.json` ✅
- Bans: `openai`, `@anthropic-ai/sdk`, `@langchain/*` (exact + prefix) per GRS-016 §4.1 ✅
- Scans BOTH `dependencies` AND `devDependencies` per GRS-016 requirement ✅
- `apps/maturion-maturity-legacy/` excluded with documented GOV legacy exemption ✅
- `sys.exit(1)` on violations — no silent failure paths ✅
- Baseline clean: IAA independently verified zero violations on current codebase ✅

### S-033 Exception (OVL-CI-005)
- Self-referential workflow PR — trigger orthogonal to PR's changed file paths ✅
- Condition 1: YAML valid (yaml.safe_load PASS, IAA independently verified) ✅
- Condition 2: Pattern parity vs routing-governance-check.yml documented ✅
- Condition 3: `workflow_dispatch: {}` retained at line 35 (IAA independently verified) ✅

### Tests (BD-011, BD-012, BD-013)
- T-C-010-010: checks workflow exists → will FAIL if absent ✅
- T-C-010-011: checks 'openai' + 'package.json' content ✅
- T-C-010-012: checks '@anthropic-ai/sdk' + 'devDependencies' content ✅
- RED→GREEN sequence: d363f2f (RED) → 8774b79 (GREEN) ✅
- IAA independently confirmed workflow contains all required patterns ✅

### SCOPE_DECLARATION R1 Finding Resolution
- R1 found 4 Foreman ceremony files absent from SCOPE_DECLARATION.md
- Fixed at SHA 0cd10aa0: root SCOPE_DECLARATION.md updated
- R2 PREHANDOVER committed at SHA 22057946
- IAA verified: 12-file diff matches exactly 12 files in SCOPE_DECLARATION.md ✅

---

## Pre-Brief Alignment
- Pre-Brief artifact: `.agent-admin/assurance/iaa-prebrief-cl-10-routing-governance-ci-enforcement-again.md` (SHA 7794c4d)
- Wave declared: CL-10 (Re-execution) ✅
- Task classified: CL-10-D2 → CI_WORKFLOW ✅
- Anti-regression obligations declared: A-033, A-026, A-031 ✅

---

## Artifact Immutability Declaration (§4.3b)

- This token file is IAA-authored per §4.3b and ECAP-001
- PREHANDOVER proofs (R1 + R2) are read-only post-commit — NOT modified by IAA
- Token written by: `independent-assurance-agent` ONLY
- `execution-ceremony-admin-agent` did NOT write this file (ECAP-02 compliant)

---

## PREHANDOVER Cross-Reference

| PREHANDOVER | File | iaa_audit_token |
|------------|------|-----------------|
| Foreman R2 (operative) | `.agent-workspace/foreman-v2/memory/PREHANDOVER-session-cl10-reexec-R2-20260409.md` | `IAA-session-cl10-reexec-R2-20260409-PASS` ← matches this token |
| Integration-builder | `.agent-workspace/integration-builder/memory/PREHANDOVER-session-cl10-d2-20260409.md` | `IAA-session-cl10-reexec-20260409-PASS` |
| Foreman R1 (superseded) | `.agent-workspace/foreman-v2/memory/PREHANDOVER-session-cl10-reexec-20260409.md` | Pre-populated reference — superseded by R2 |

**Operative PREHANDOVER for this verdict**: `PREHANDOVER-session-cl10-reexec-R2-20260409.md`

---

## Merge Authority

**Merge authority: CS2 ONLY (Johan Ras / @APGI-cmy)**
This ASSURANCE-TOKEN permits the PR to be opened and reviewed. Merge requires explicit CS2 approval.
