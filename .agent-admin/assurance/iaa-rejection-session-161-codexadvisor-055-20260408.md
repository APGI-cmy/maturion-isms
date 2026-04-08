# IAA Token File — Session 161 | CodexAdvisor Session 055 (2026-04-08)

**Type**: REJECTION-PACKAGE
**IAA Session**: session-161-codexadvisor-055-20260408
**Wave**: foreman-v2-agent-ripple-b54d57b5
**Invoked by**: CodexAdvisor-agent session-055-20260408
**Branch**: copilot/layer-down-propagate-governance-changes-4b3d0753-0ea9-4992-99b8-b5e93415074e
**Date**: 2026-04-08
**IAA Version**: independent-assurance-agent v6.2.0 / Contract 2.5.0
**Adoption Phase**: PHASE_B_BLOCKING
**Round**: 1

---

## Token Reference

PHASE_B_BLOCKING_TOKEN: IAA-session-161-codexadvisor-055-20260408-REJECTION

> **This is a REJECTION-PACKAGE.** The PR must not be opened until all cited failures are
> resolved and IAA is re-invoked for a second assurance round.

---

## Verdict

```
═══════════════════════════════════════
REJECTION-PACKAGE
PR: copilot/layer-down-propagate-governance-changes-4b3d0753...
    (foreman-v2-agent.md v2.9.0 → v2.10.0, canonical ripple b54d57b5)
    Invoked by: CodexAdvisor-agent session-055-20260408

4 check(s) FAILED. Merge BLOCKED. STOP-AND-FIX required.

FAILURES:

  FINDING-1 — HFMC-01 / AC-05 / OVL-AC-007 [Ceremony]:
    Finding: PREHANDOVER proof lacks Ripple/Cross-Agent Assessment section.
    Fix: Superseding PREHANDOVER proof must add ## Ripple/Cross-Agent Assessment
         section confirming no downstream ripple within maturion-isms and flagging
         pending CS2-only files (CodexAdvisor-agent.md, governance-repo-admin).

  FINDING-2 — HFMC-02 / A-026 [Systemic — 4th+ recurrence]:
    Finding: SCOPE_DECLARATION.md not updated for session-055 (still has session-054
             files). validate-scope-to-diff.sh confirms 6 changed / 0 declared.
    Fix: Update SCOPE_DECLARATION.md to declare all 6 PR diff files for session-055.
    Systemic prevention: CS2 to embed SCOPE_DECLARATION update as mandatory Step 1
    in CodexAdvisor session startup.

  FINDING-3 — CERT-004 / CORE-018(c) [Ceremony — Regression from session-054]:
    Finding: `iaa_audit_token` field/section identifier absent from PREHANDOVER proof.
             Section `## IAA Classification and Token Reference` does not satisfy
             CERT-004 binary field-existence check. Regression from session-054.
    Fix: Superseding PREHANDOVER proof must include `## iaa_audit_token` section with
         value `IAA-session-161-codexadvisor-055-20260408-PASS` (or the corrected
         expected token reference for the re-invocation session).

  FINDING-4 — OVL-AC-001 / OVL-AC-002 [Substantive — Cross-Reference Error]:
    Finding: Step 4.3c (Token Update Ceremony) references
             `AGENT_HANDOVER_AUTOMATION.md §4.3c` for the immutability rule.
             Canonical §4.3c = Pre-IAA Commit-State Gate (NOT token ceremony).
             Token ceremony immutability rule lives at canonical §4.3b.
    Fix: In foreman-v2-agent.md Step 4.3c, restore:
         `Per AGENT_HANDOVER_AUTOMATION.md §4.3b:` (canonical section unchanged —
         only the foreman's internal step label changed, not the canonical numbering).

This PR must not be opened until all 4 failures are resolved and IAA re-invoked.
Adoption phase: PHASE_B_BLOCKING — hard gate ACTIVE.
═══════════════════════════════════════
```

---

## Checks Executed

| Check | Verdict |
|-------|---------|
| HFMC-01 Ripple | FAIL ❌ |
| HFMC-02 Scope parity | FAIL ❌ |
| HFMC-03 Artifacts committed | PASS ✅ |
| HFMC-04 Pre-brief | N/A ✅ |
| HFMC-05 Token ceremony | PASS ✅ (First Invocation Exception) |
| HFMC-06 Evidence bundle | PASS ✅ |
| CERT-001 PREHANDOVER exists | PASS ✅ |
| CERT-002 Session memory exists | PASS ✅ |
| CERT-003 FAIL-ONLY-ONCE attested | PASS ✅ |
| CERT-004 iaa_audit_token field | FAIL ❌ |
| CORE-001 Agent identity | PASS ✅ |
| CORE-002 Version | PASS ✅ |
| CORE-003 Contract version | PASS ✅ |
| CORE-004 Identity fields | PASS ✅ |
| CORE-005 Governance protocol | PASS ✅ |
| CORE-006 Canon inventory ref | PASS ✅ |
| CORE-008 Prohibitions block | PASS ✅ |
| CORE-009 Merge gate interface | PASS ✅ |
| CORE-010 Tier 2 ref | PASS ✅ |
| CORE-011 Four-phase structure | PASS ✅ |
| CORE-012 Self-mod prohibition | PASS ✅ |
| CORE-013 IAA invocation evidence | PASS ✅ |
| CORE-015 Session memory | PASS ✅ |
| CORE-016 IAA verdict evidence | CONDITIONAL (CORE-019 first invocation) |
| CORE-017 Authorized agent | PASS ✅ |
| CORE-018 Evidence sweep | FAIL ❌ (part c — see CERT-004) |
| CORE-019 Token cross-verify | PASS ✅ (First Invocation Exception) |
| CORE-022 Secret field naming | PASS ✅ |
| CORE-023 Workflow integrity | N/A ✅ |
| AC-01 AGCFPP-001 auth | PASS ✅ |
| AC-02 Protected components | PASS ✅ |
| AC-03 Pre-approval scope | PASS ✅ |
| AC-04 Tier placement | PASS ✅ |
| AC-05 Ripple assessment | FAIL ❌ |
| OVL-AC-001 Strategy alignment | FAIL ❌ (cross-ref error) |
| OVL-AC-002 No contradictions | FAIL ❌ (cross-ref error) |
| OVL-AC-003 Authority boundaries | PASS ✅ |
| OVL-AC-004 Delegation safety | PASS ✅ |
| OVL-AC-005 Four-phase structure | PASS ✅ |
| OVL-AC-006 Self-mod prohibition | PASS ✅ |
| OVL-AC-ADM-001 PREHANDOVER exists | PASS ✅ |
| OVL-AC-ADM-002 Session memory exists | PASS ✅ |
| OVL-AC-ADM-003 Tier 2 stub | PASS ✅ |
| OVL-AC-ADM-004 Char count | PASS ✅ |
| Merge gate parity (scope) | FAIL ❌ |

**Total checks: 43 | PASS: 34 | FAIL: 4 (unique findings) | N/A: 3**

---

*IAA independent-assurance-agent | Session 161 | 2026-04-08 | PHASE_B_BLOCKING*
