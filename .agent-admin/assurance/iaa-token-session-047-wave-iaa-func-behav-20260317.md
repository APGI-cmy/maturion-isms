# IAA Verdict — Session 047 / wave-iaa-func-behav / 2026-03-17

**Agent**: independent-assurance-agent
**Session ID**: session-047-wave-iaa-func-behav-20260317
**Date**: 2026-03-17
**Contract Version**: 2.3.0 (as reviewed)
**Adoption Phase**: PHASE_B_BLOCKING

---

## Invocation Context

| Field | Value |
|-------|-------|
| PR Branch | `copilot/add-user-journey-trace-checks` |
| Invoked by | CodexAdvisor-agent (session-047-20260317) |
| Producing agent | CodexAdvisor-agent (session-047-20260317), class: overseer |
| PR category | AGENT_CONTRACT (primary) + KNOWLEDGE_GOVERNANCE (secondary) |
| CS2 Authorization | Issue "[Agent Task] Strengthen IAA functional behaviour checks: journey trace, functional-behaviour registry, living signal integration" — opened and assigned by @APGI-cmy |

---

## Checks Executed

| Layer | Pass | Fail |
|-------|------|------|
| FAIL-ONLY-ONCE learning (A-001, A-002) | 2 | 0 |
| Core invariants (CORE-001 through CORE-023) | 23 | 0 |
| IAA_AGENT_CONTRACT_AUDIT_STANDARD (AC-01 through AC-07) | 5 | 1 |
| AGENT_CONTRACT overlay (OVL-AC-001 through OVL-AC-ADM-004) | 10 | 1 |
| KNOWLEDGE_GOVERNANCE overlay (OVL-KG-001 through OVL-KG-ADM-003) | 7 | 0 |
| PRE_BRIEF_ASSURANCE overlay (OVL-INJ-001) | 1 | 0 |
| **Total** | **48** | **1** |

Note: AC-05 and OVL-AC-007 represent the same root cause (missing ripple assessment). Counted as 1 finding across 2 check IDs.

---

## Merge Gate Parity (§4.3)

| Check | Local Result |
|-------|-------------|
| YAML validation | PASS ✅ |
| Character count (29,833 / 30,000) | PASS ✅ |
| All 4 required phases present | PASS ✅ |
| Canon hash verification (191 entries, 0 bad) | PASS ✅ |
| No prohibited `secret:` field | PASS ✅ |
| governance/alignment (ripple assessment) | **FAIL ❌** |

**Parity result**: FAIL — governance/alignment check fails.

---

## ═══════════════════════════════════════
## REJECTION-PACKAGE
## PR: copilot/add-user-journey-trace-checks
## 47 checks PASS. 1 check FAILED. Merge BLOCKED. STOP-AND-FIX required.

### FAILURE: AC-05 / OVL-AC-007 — Ripple Assessment Missing from PREHANDOVER Proof

**Enforces**: FAIL-ONLY-ONCE A-023, OVL-AC-007, IAA_AGENT_CONTRACT_AUDIT_STANDARD Step AC-05

**Finding**:
`.agent-workspace/CodexAdvisor-agent/memory/PREHANDOVER-session-047-20260317.md`
is missing a mandatory `## Ripple Assessment` section (or equivalent).

IAA_AGENT_CONTRACT_AUDIT_STANDARD Step AC-05 requires the PREHANDOVER proof to contain
an explicit declaration of either:
- "NO DOWNSTREAM RIPPLE REQUIRED — [justification]", OR
- A list of all downstream agent contracts and knowledge files updated as a result of this PR.

The PREHANDOVER proof was searched in full (all sections reviewed). No ripple assessment
section was found. The proof contains: Job Summary, QP Verdict, Merge Gate Parity, Bundle
Completeness, IAA Trigger Classification, IAA Audit Token, OPOJD Gate Result, Parking
Station Entries. Ripple assessment is absent from all sections.

**Fix required** (per A-029 PREHANDOVER immutability — proof is read-only post-commit):

Since the PREHANDOVER proof cannot be modified, CodexAdvisor must:

1. Create and commit a new addendum file at:
   `.agent-workspace/CodexAdvisor-agent/memory/RIPPLE-ASSESSMENT-session-047-20260317.md`

2. The addendum must explicitly declare (suggested content):
   ```
   ## Ripple Assessment — Session 047 (Addendum per IAA REJECTION-PACKAGE)
   
   Scope: IAA contract v2.2.0 → v2.3.0 + Tier 2 knowledge additions
   
   Assessment: NO DOWNSTREAM RIPPLE REQUIRED
   
   Justification:
   - Step 2.3b (liveness signal check): IAA-internal. BUILD/AAWP_MAT PRs only. No other
     agent contract needs to reference this step; it is an IAA operational step.
   - Step 3.1 expansion (FUNCTIONAL-BEHAVIOUR-REGISTRY reading): IAA-internal. No other
     agent contract reads or references IAA's Phase 3 Step 3.1.
   - FUNCTIONAL-BEHAVIOUR-REGISTRY.md v1.0.0: IAA Tier 2 knowledge file. Governed by
     FAIL-ONLY-ONCE A-034 which applies to IAA only. No ripple to other agents.
   - niggle-pattern-library.md v1.0.0: IAA Tier 2 knowledge file. Governed by A-035 which
     applies to IAA only. No ripple to other agents.
   - liveness/last-known-good.md v1.0.0: Cross-agent operational file. Its "How to Update"
     section designates who maintains it (Foreman, IAA, CS2 directly). Foreman's contract
     and builders' contracts do not need amendment to support this file — they will be
     updated separately if and when Foreman or builders are mandated to read/update this
     file. No immediate ripple required.
   - iaa-category-overlays.md v3.5.0 (BD-000 additions): IAA Tier 2 knowledge overlay.
     Only IAA reads this file. No other agent contracts reference iaa-category-overlays.md.
   - FAIL-ONLY-ONCE.md v2.7.0 (A-034, A-035): IAA Tier 2 FAIL-ONLY-ONCE registry. Only
     IAA reads this file. A-034 and A-035 govern IAA's own BUILD PR review behaviour.
     No ripple to other agents.
   
   Conclusion: All changes are IAA-internal or IAA-governed Tier 2 files. No corresponding
   updates required in any other agent contract, builder knowledge file, or canon document.
   ```

3. Commit and push the addendum.

4. Re-invoke IAA for Phase 2–4 assurance.

**Merge gate parity failure**: governance/alignment — Step AC-05 / OVL-AC-007 / A-023.

---

## PREHANDOVER Proof Status

PREHANDOVER proof `.agent-workspace/CodexAdvisor-agent/memory/PREHANDOVER-session-047-20260317.md`
is **read-only post-commit** per §4.3b / A-029. This token file is the IAA verdict record.
The PREHANDOVER proof is NOT edited. The addendum file approach is the correct fix path.

---

## What Passes

For completeness, the following substantive aspects of the PR **pass** IAA review and will
not need re-examination on re-invocation (assuming no changes to these items):

- IAA contract YAML structure, all required fields, character count (29,833 / 30,000)
- Step 2.3b (living agent signal check) — correctly wired, references existing liveness file
- Step 3.1 FUNCTIONAL-BEHAVIOUR-REGISTRY mandate — correctly wired, references existing file
- FUNCTIONAL-BEHAVIOUR-REGISTRY.md — substantive entries (NBR-001 through NBR-004), clear
  permanent checks, stack-appropriate patterns
- niggle-pattern-library.md — comprehensive stack-specific patterns (TanStack Query, Supabase,
  Zustand, Next.js, TypeScript), actionable checks
- BD-000 User Journey Trace overlay (BD-000-A through BD-000-D) — clear, blocking, correctly
  integrated into BUILD_DELIVERABLE overlay
- liveness/last-known-good.md — well-structured canonical liveness source with maintenance
  instructions
- FAIL-ONLY-ONCE A-034, A-035 — clearly triggered, unambiguous rules, no duplication
- All Tier 2 cross-references resolve correctly
- PREHANDOVER ceremony artifacts committed and git-verified
- CS2 authorization documented

**On re-invocation**: IAA will verify (a) the ripple assessment addendum is committed, and
(b) all previously-passing checks remain intact. Assuming the addendum is created as described
and no other changes are made, re-invocation should produce ASSURANCE-TOKEN.

---

## Adoption Phase

**PHASE_B_BLOCKING** — This REJECTION-PACKAGE is hard-blocking. The PR must not be opened
or merged until IAA re-invokes and issues ASSURANCE-TOKEN.

---

**Verdict**: REJECTION-PACKAGE
**Token reference**: IAA-REJECTION-session-047-wave-iaa-func-behav-20260317
**Session memory**: `.agent-workspace/independent-assurance-agent/memory/session-047-wave-iaa-func-behav-20260317.md`
**Authority**: CS2 (Johan Ras / @APGI-cmy) | **Living Agent System**: v6.2.0
**PREHANDOVER proof (read-only)**: `.agent-workspace/CodexAdvisor-agent/memory/PREHANDOVER-session-047-20260317.md`
