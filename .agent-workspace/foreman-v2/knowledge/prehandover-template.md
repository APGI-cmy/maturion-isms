# PREHANDOVER Proof Template — Foreman v2

**Agent**: foreman-v2
**Version**: 1.7.0
**Last Updated**: 2026-03-18
**Purpose**: Template for generating Phase 4 PREHANDOVER proof artifacts per S-009 (FAIL-ONLY-ONCE v1.8.0)
**Authority**: CS2 (Johan Ras / @APGI-cmy)

---

## Version History

| Version | Date | Change |
|---|---|---|
| 1.0.0 | 2026-02-25 | Initial template |
| 1.1.0 | 2026-03-01 | Add `## IAA Agent Response (verbatim)` mandatory section per S-009 (FAIL-ONLY-ONCE v1.8.0 / A-014) |
| 1.2.0 | 2026-03-02 | Add `## Environment Parity` section (OVL-CI-006 / A-020 — 7-session recurring flag closed via issue #815) |
| 1.3.0 | 2026-03-03 | Add `## End-to-End Wiring Trace (OVL-AM-008)` section — mandatory for PRs touching schema migrations, API endpoints, Supabase hooks, or frontend data hooks |
| 1.4.0 | 2026-03-04 | Post-ASSURANCE-TOKEN Ceremony rewritten with explicit temporal ordering per §4.3b (CR-2 fix); PENDING replaced with expected reference format per A-028/A-029 |
| 1.5.0 | 2026-03-05 | SCOPE_DECLARATION Ceremony section added (A-029 / INC-SCOPE-STALE-001); IAA token date accuracy note added (A-030) |
| 1.6.0 | 2026-03-08 | Pre-IAA Commit Gate section added (A-021 / INC-BOOTSTRAP-IMPL-001 / R1 fix) — mandatory STOP checkpoint requiring actual `git status` + `git log --oneline -5` output before IAA invocation |
| 1.7.0 | 2026-03-18 | IAA Token Self-Certification Guard section added (governance directive STRUCTURAL-GATE) — `PHASE_B_BLOCKING_TOKEN` field check; Pre-Brief path check added to bundle completeness |

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

## SCOPE_DECLARATION Ceremony

> **A-029 MANDATORY**: Before writing any content to `SCOPE_DECLARATION.md`, execute:
> ```bash
> cat /dev/null > SCOPE_DECLARATION.md
> ```
> This clears stale content from prior sessions. Stale SCOPE_DECLARATION content has caused IAA rejections (sessions 116, 120, 152). Failure to clear first is a protocol violation (INC-SCOPE-STALE-001).

Scope written: [list each file in diff matching `- \`path\` - desc` format]

---

## Pre-IAA Commit Gate (MANDATORY STOP — A-021)

> ⛔ **HARD STOP — DO NOT INVOKE IAA UNTIL THIS SECTION IS COMPLETE.**
>
> Per A-021 (CORE-018): ALL PREHANDOVER artifacts — PREHANDOVER proof, session memory, FAIL-ONLY-ONCE.md updates, SCOPE_DECLARATION.md, parking station — MUST be committed to the branch BEFORE invoking the IAA for the final audit. The IAA will issue a REJECTION-PACKAGE if any artifact is untracked or unstaged at the time of invocation.
>
> Paste ACTUAL command outputs below — no placeholders permitted. A PREHANDOVER proof with `[to be populated]` in this section is a protocol violation.

**Pre-commit `git status` output:**
```
[paste actual output of: git status]
```

**`git log --oneline -5` output AFTER committing all deliverables:**
```
[paste actual output after committing — first line MUST be the commit that adds these artifacts]
```

All ceremony artifacts staged and committed before IAA invocation: ✅

---

Local test run: [N] tests passed, [N] failed, [N] skipped — [N] test files.
`merge_gate_parity: PASS`

---

## Environment Parity

Confirms local execution environment matches CI merge gate configuration.

| Check | Local | CI | Match? |
|---|---|---|---|
| Node version | [X.Y.Z] | [X.Y.Z from .nvmrc / CI config] | [✅/❌] |
| Required env vars present | [list or 'all present'] | [required by CI] | [✅/❌] |
| Schema/migration state | [migrated/current] | [expected by CI] | [✅/❌] |
| Any environment-specific flags | [list or 'none'] | [CI flags] | [✅/❌] |

**Environment Parity Verdict: [PASS / FAIL]**

> If FAIL: describe discrepancy and resolution before proceeding to Phase 4.

---

## End-to-End Wiring Trace (OVL-AM-008)

> Required for any PR touching schema migrations, API endpoints, Supabase hooks, or frontend data hooks.
> State "Not applicable" with justification if this PR contains no such changes.

### Writers
<!-- Which runtime clients write to each new/modified table or endpoint? Specify Supabase key used (anon/service role). -->

### Readers
<!-- Which hooks or components read from this table/endpoint? What columns/fields do they query? -->

### Shape Compatibility
<!-- Confirm writer payload fields map correctly to table columns / API response fields consumed by readers. -->

### Auth / RLS Model
<!-- State which Supabase key each writer uses. Is the RLS policy consistent with this access pattern? -->

### FK / Dependency Chain
<!-- Confirm all foreign key references resolve correctly given current migration order and production data state. -->

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

<!-- §4.3b (AGENT_HANDOVER_AUTOMATION.md v1.1.3): PREHANDOVER proof is READ-ONLY after initial commit.
     Pre-populate iaa_audit_token with the expected reference at commit time (not PENDING).
     After IAA verdict, IAA writes token to .agent-admin/assurance/iaa-token-session-NNN-waveY-YYYYMMDD.md.
     Do NOT edit this file post-commit. -->
`iaa_audit_token: IAA-session-NNN-waveY-YYYYMMDD-PASS`
<!-- A-030: Token date MUST match actual token file date. Look up `.agent-admin/assurance/iaa-token-session-NNN-*` filename BEFORE writing this field. Do NOT use session date. For multi-batch waves, the token file date may differ from the session date. -->

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

## Post-ASSURANCE-TOKEN Ceremony (§4.3b — Artifact Immutability)

Per `AGENT_HANDOVER_AUTOMATION.md` v1.1.3 §4.3b, the PREHANDOVER proof is immutable once committed.

After IAA issues ASSURANCE-TOKEN:
1. **Before initial commit**: Write PREHANDOVER proof with `iaa_audit_token: IAA-session-NNN-waveY-YYYYMMDD-PASS` pre-populated. Do NOT commit yet.
2. **Before initial commit**: Invoke IAA. Receive ASSURANCE-TOKEN. Paste the verbatim ASSURANCE-TOKEN block into `## IAA Agent Response (verbatim)` — copy character-for-character; never paraphrase.
3. **Initial commit**: Commit the PREHANDOVER proof now. This is the read-only initial commit — henceforth immutable (§4.3b).
4. **Post-commit (new file only)**: The IAA writes its dedicated token to `.agent-admin/assurance/iaa-token-session-NNN-waveY-YYYYMMDD.md`. No amendments to the committed PREHANDOVER proof.

**Anti-misuse rules:**
- Pre-populate `iaa_audit_token` with the expected reference format at commit time (not PENDING)
- Never claim PASS for a session that returned a REJECTION-PACKAGE
- Never paraphrase or summarise the IAA response — verbatim paste only

---

## IAA Token Self-Certification Guard (MANDATORY VERIFICATION)

Before accepting any IAA token as valid, verify the following. A FAILING token is a
**HANDOVER BLOCKER** — do not release the merge gate.

**Step 1 — Token file exists:**
```bash
ls .agent-admin/assurance/iaa-token-session-NNN-waveY-YYYYMMDD.md
# MUST exist. Absent = IAA-SKIP-001 violation.
```

**Step 2 — PHASE_B_BLOCKING_TOKEN field present:**
```bash
grep "PHASE_B_BLOCKING_TOKEN:" .agent-admin/assurance/iaa-token-session-NNN-waveY-YYYYMMDD.md
# MUST be present and non-empty. Missing = IAA-SELF-CERT-001 violation.
```

**Step 3 — Token value is not PHASE_A_ADVISORY:**
```bash
grep "PHASE_A_ADVISORY" .agent-admin/assurance/iaa-token-session-NNN-waveY-YYYYMMDD.md
# MUST return NO MATCH. Any match = IAA-PHASE-A-BYPASS-001 violation.
```

Record in PREHANDOVER proof:
```
iaa_token_self_cert_guard:
  token_file_exists: [YES / NO]
  phase_b_blocking_token_present: [YES / NO]
  phase_a_advisory_absent: [YES / NO]
  guard_result: [PASS / FAIL — IAA-SELF-CERT-001]
```

---

**Authority**: CS2 (Johan Ras) | **Living Agent System**: v6.2.0
