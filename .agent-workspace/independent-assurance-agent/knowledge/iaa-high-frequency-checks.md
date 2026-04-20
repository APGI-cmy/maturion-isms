# IAA High-Frequency Checks — CI Enforcement Specification

**Agent**: independent-assurance-agent
**Version**: 2.1.0
**Status**: CI-ENFORCED
**Last Updated**: 2026-04-19
**Authority**: CS2 (Johan Ras / @APGI-cmy)

---

## Purpose

These 6 checks are now enforced by CI workflows. This document specifies what CI must check. IAA no longer executes them at session time. Per the 90/10 restructuring (CS2 directive — maturion-isms#1354), mechanical binary checks are CI's responsibility so IAA can focus 90% of session time on substance evaluation.

---

## Check Definitions

### HFMC-01 — Ripple Assessment Presence

**CI must check**: Does the PREHANDOVER proof include a `## Ripple/Cross-Agent Assessment` section (or equivalent `## Ripple` / `## Cross-Agent` heading) that evaluates impact on downstream agents?

**How to verify**: Scan PREHANDOVER proof file for `## Ripple` or `## Cross-Agent` heading. Section must be non-empty (contain at least one concrete impact conclusion line — not only blank lines, blockquote guidance, or placeholder text).

**FAIL if**: Section absent or empty.

**CI job name**: `preflight/hfmc-ripple-presence` (in `preflight-evidence-gate.yml`)

**Background**: Recurring failure in sessions 051, 052, 055, 056. FAIL-ONLY-ONCE A-023. Template hardened in `PREHANDOVER_PROOF_TEMPLATE.md` v3.1 and `PREHANDOVER.template.md` (ECAP) v1.1.0. Producer-side enforcement added as AAP-20 (anti-patterns) and ACR-14 (IAA rejections). §4.3e Check J added to AGENT_HANDOVER_AUTOMATION.md v1.6.0.

---

### HFMC-02 — SCOPE_DECLARATION.md Parity

**CI must check**: Does the scope declaration file list exactly the same files as the PR diff?

**How to verify**: Run `git diff origin/main...HEAD --name-only | sort` and compare to SCOPE_DECLARATION.md contents. File lists must match exactly.

**FAIL if**: Any file in PR diff not listed in SCOPE_DECLARATION.md, or vice versa.

**Background**: Recurring failure in sessions 052, 050. FAIL-ONLY-ONCE PARITY-A-026.

---

### HFMC-03 — Committed Artifacts Completeness

**CI must check**: Are ALL bundle items declared in the PREHANDOVER proof already committed to the branch?

**How to verify**: For each file path listed in the PREHANDOVER proof bundle, confirm the file exists in the working branch (`git show HEAD:[path]`). Any path not yet committed = FAIL.

**FAIL if**: Any declared bundle item is not committed.

**Background**: IAA R1 rejections frequently cited uncommitted artifacts. Session 051.

---

### HFMC-04 — Pre-Brief Presence

**CI must check**: Does a valid IAA wave record with `## PRE-BRIEF` section exist at `.agent-admin/assurance/iaa-wave-record-*.md`?

**How to verify**: Confirm at least one wave record file exists with a non-empty `## PRE-BRIEF` section.

**FAIL if**: No wave record with pre-brief section found. N/A if PR was initiated without wave context (record justification).

**Background**: CI enforces `iaa_prebrief_path:` field in wave-current-tasks.md.

---

### HFMC-05 — Token Ceremony Correctness

**CI must check**: Does the IAA wave record contain a `## TOKEN` section with a valid `PHASE_B_BLOCKING_TOKEN:` line?

**How to verify**:
1. Wave record exists at expected path
2. `## TOKEN` section contains `PHASE_B_BLOCKING_TOKEN: <non-empty, non-PENDING value>`

**FAIL if**: TOKEN section absent, PHASE_B_BLOCKING_TOKEN missing/empty/PENDING.

**Background**: FAIL-ONLY-ONCE A-037. CI gate `preflight/iaa-token-self-certification`.

---

### HFMC-06 — Evidence Bundle Completeness

**CI must check**: Are all required bundle items present for agent contract or governance PRs?

Required bundle items:
1. Agent contract file (`.github/agents/<agent>.md`)
2. Tier 2 knowledge stub (`.agent-workspace/<agent>/knowledge/index.md` or updated T2 file)
3. PREHANDOVER proof (`.agent-workspace/*/memory/PREHANDOVER-session-*.md`)
4. Session memory (`.agent-workspace/*/memory/session-*.md`)

**How to verify**: Confirm all 4 path patterns exist in the current PR diff.

**FAIL if**: Any required bundle item missing from PR diff.

**Background**: BREACH-001 through BREACH-006 in CodexAdvisor breach registry.

---

## CI Workflow Reference

These checks are implemented in the following CI workflows:

| Workflow | Checks Enforced |
|----------|----------------|
| `preflight-evidence-gate.yml` | HFMC-01 (`preflight/hfmc-ripple-presence`), HFMC-02, HFMC-03, HFMC-04, HFMC-05, HFMC-06 |
| `agent-contract-format-gate.yml` | Supplementary format checks (CORE-001 through CORE-012) |

**Enforcement level**: BLOCKING — PR cannot merge if any HFMC check fails in CI.

---

## Version History

| Version | Date | Change |
|---------|------|--------|
| 1.0.0 | 2026-04-07 | Initial version — IAA-executed checks (Issue #1282) |
| 2.0.0 | 2026-04-13 | Converted to CI enforcement specification; IAA no longer executes these checks at session time; CI Workflow Reference added; Output Format removed; authority: CS2 — maturion-isms#1354 |
| 2.1.0 | 2026-04-19 | HFMC-01 definition updated: CI job name added (`preflight/hfmc-ripple-presence`), non-empty section requirement clarified; CI Workflow Reference table updated; authority: CS2 — Harden PREHANDOVER templates for Ripple/Cross-Agent Assessment |

---

**Authority**: CS2 (Johan Ras / @APGI-cmy)
