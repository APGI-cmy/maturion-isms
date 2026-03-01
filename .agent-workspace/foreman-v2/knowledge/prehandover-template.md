# PREHANDOVER Proof Template — Foreman v2

**Agent**: foreman-v2
**Version**: 1.1.0
**Last Updated**: 2026-03-01
**Purpose**: Template for generating Phase 4 PREHANDOVER proof artifacts per S-009 (FAIL-ONLY-ONCE v1.8.0)
**Authority**: CS2 (Johan Ras / @APGI-cmy)

---

## Template

Copy the structure below for each new PREHANDOVER proof.
Filename: `PREHANDOVER-session-NNN-waveX.Y-YYYYMMDD.md`
Replace all `[placeholder]` values — no field may be left blank.

---

```markdown
# PREHANDOVER Proof — Session [NNN] | Wave [X.Y] | [YYYY-MM-DD]

**Session ID**: [NNN]
**Date**: [YYYY-MM-DD]
**Agent Version**: foreman-v2-agent v6.2.0 (contract v2.5.0)
**Triggering Issue**: [Issue title and number]
**Branch**: [branch name]

---

## Wave Description

[Brief description of wave scope, Track, deliverables]

**Builders involved**: [list each builder agent and their contribution]

---

## QP Verdict

**QP EVALUATION — [builder(s)] | Wave [X.Y]:**
- 100% GREEN tests: [✅/❌]
- Zero skipped/todo/stub tests: [✅/❌]
- Zero test debt: [✅/❌]
- Evidence artifacts present: [✅/❌]
- Architecture followed ([architecture doc + version]): [✅/❌]
- Zero deprecation warnings: [✅/❌]
- Zero compiler/linter warnings: [✅/❌]

**QP VERDICT: [PASS / FAIL]**

---

## OPOJD Gate

- Zero test failures: [✅/❌]
- Zero skipped/todo/stub tests: [✅/❌]
- Zero deprecation warnings: [✅/❌]
- Zero compiler/linter warnings: [✅/❌]
- Evidence artifacts present: [✅/❌]
- Architecture compliance: [✅/❌]
- §4.3 Merge gate parity: [PASS/FAIL] [✅/❌]

**OPOJD: [PASS / FAIL]**

---

## CANON_INVENTORY Alignment

[State: verified/not verified, and why]

---

## Bundle Completeness

| # | Deliverable | Path | Status |
|---|---|---|---|
| 1 | [name] | [path] | [✅/❌] [Created/Updated] |

---

## §4.3 Merge Gate Parity

Local test run: [N] tests passed, [N] failed, [N] skipped — [N] test files.
`merge_gate_parity: PASS`

---

## CS2 Authorization Evidence

[Issue reference that constitutes CS2 wave-start authorization]

---

## Checklist

- [x] Zero test failures
- [x] Zero skipped/todo/stub tests
- [x] Zero deprecation warnings
- [x] Zero compiler/linter warnings
- [x] §4.3 Merge gate parity check: all required_checks match CI — PASS
- [x] IAA audit token recorded: [token]

---

## IAA Audit

<!-- ANTI-MISUSE: Set iaa_audit_token to PENDING before invoking IAA. Never pre-fill "-PASS". -->
<!-- After receiving ASSURANCE-TOKEN: follow the Post-ASSURANCE-TOKEN Ceremony in Notes below. -->
`iaa_audit_token: PENDING`

[Brief summary of IAA verdict — complete after receiving ASSURANCE-TOKEN]

## IAA Agent Response (verbatim)
<!-- MANDATORY PER S-009 (FAIL-ONLY-ONCE v1.8.0 / A-014) -->
<!-- Paste the COMPLETE raw output from task(agent_type: "independent-assurance-agent") here -->
<!-- A PREHANDOVER proof with a blank or placeholder IAA response section is a HANDOVER BLOCKER -->
<!-- IAA bare PHASE_A_ADVISORY without this section = INC-IAA-SKIP-001 breach -->

[IAA agent output pasted verbatim here — the ASSURANCE-TOKEN or REJECTION-PACKAGE block]

---

## Security Summary

[CodeQL result and any security observations]

---

*Merge authority: CS2 ONLY (@APGI-cmy)*
*Authority: [architecture version] | LIVING_AGENT_SYSTEM.md v6.2.0 | foreman-v2-agent v6.2.0*
```

---

## Notes for S-009 Compliance

The `## IAA Agent Response (verbatim)` section is **MANDATORY** per:
- FAIL-ONLY-ONCE v1.8.0, S-009 (INC-IAA-SKIP-001 corrective action)
- IAA CORE-016: checks for this section during audit
- IAA A-006: detects absence as PHASE_A_ADVISORY FABRICATION breach

**A PREHANDOVER proof missing this section, or with only `PHASE_A_ADVISORY — YYYY-MM-DD` in the IAA Audit field, is a HANDOVER BLOCKER.**

Real IAA responses always include either:
- `ASSURANCE-TOKEN` block with session reference (`IAA-session-NNN-YYYYMMDD-PASS`)
- `REJECTION-PACKAGE` block with findings and remediation

---

## Post-ASSURANCE-TOKEN Ceremony

After IAA issues ASSURANCE-TOKEN, complete these 3 steps **before opening the PR**:

1. Update `iaa_audit_token` from `PENDING` to the issued token — exact format: `IAA-session-NNN-YYYYMMDD-PASS`
2. Paste the verbatim ASSURANCE-TOKEN block into `## IAA Agent Response (verbatim)` — copy the complete raw block from the IAA tool output, character for character; never paraphrase or summarise
3. Commit the updated PREHANDOVER proof file — then open the PR

**Anti-misuse rules:**
- Never pre-fill `iaa_audit_token` with a `-PASS` suffix before IAA has issued the token
- Never claim PASS for a session that returned a REJECTION-PACKAGE
- Never paraphrase or summarise the IAA response — verbatim paste only

---

**Authority**: CS2 (Johan Ras) | **Living Agent System**: v6.2.0
