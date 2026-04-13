# IAA REJECTION-PACKAGE — Session 052 — Wave 0 — 2026-04-06

```
═══════════════════════════════════════
REJECTION-PACKAGE
PR: copilot/add-fail-only-once-rule-a-036
Branch: copilot/add-fail-only-once-rule-a-036
Issue: APGI-cmy/maturion-isms#1249
2 check(s) FAILED. Merge blocked. STOP-AND-FIX required.

FAILURES:
  OVL-AC-007 / A-023: Ripple/Cross-Agent Assessment section absent from PREHANDOVER
    Finding: The PREHANDOVER proof at
    .agent-workspace/CodexAdvisor-agent/memory/PREHANDOVER-session-052-20260406.md
    does not contain a mandatory `## Ripple/Cross-Agent Assessment` section as required
    by FAIL-ONLY-ONCE A-023 and OVL-AC-007. The PREHANDOVER contains a "Change Summary"
    listing files, but this does NOT satisfy the ripple assessment requirement. Per A-023:
    "If absent: FAIL immediately. Session memory is not a substitute."
    Fix required: CodexAdvisor must create a FRESH PREHANDOVER proof (new file, e.g.
    PREHANDOVER-session-052-R2-20260406.md) that includes an explicit
    `## Ripple/Cross-Agent Assessment` section documenting:
    - Ripple to Foreman contract (foreman-v2-agent.md Step 4.3b) — INCLUDED in PR ✅
    - Ripple to IAA T2 knowledge (CORE-024 added) — INCLUDED in PR ✅
    - Ripple to CodexAdvisor T2 knowledge (A-037 added) — INCLUDED in PR ✅
    - Ripple to copilot-instructions.md (IAA TOKEN COMPLIANCE NOTICE) — INCLUDED in PR ✅
    - Ripple to IAA session-memory-template.md (PHASE_B_BLOCKING_TOKEN field) — INCLUDED ✅
    - Any additional agents that create token files — assessment must be explicit.
    The new PREHANDOVER must be committed before re-invoking IAA.
    The old PREHANDOVER remains immutable — do NOT edit it.

  PARITY-A-026: SCOPE_DECLARATION.md not updated to match PR diff
    Finding: validate-scope-to-diff.sh returned exit code 1.
    7 PR diff files are missing from SCOPE_DECLARATION.md:
      - .agent-workspace/CodexAdvisor-agent/knowledge/FAIL-ONLY-ONCE.md
      - .agent-workspace/CodexAdvisor-agent/memory/PREHANDOVER-session-052-20260406.md
      - .agent-workspace/independent-assurance-agent/knowledge/iaa-core-invariants-checklist.md
      - .agent-workspace/independent-assurance-agent/knowledge/session-memory-template.md
      - .github/agents/foreman-v2-agent.md
      - .github/agents/independent-assurance-agent.md
      - .github/copilot-instructions.md
    The current SCOPE_DECLARATION.md belongs to a prior wave (governance-liaison
    session-055 layer-down, 2026-04-03) and has not been updated for this PR.
    Fix required: Update SCOPE_DECLARATION.md to exactly match the PR diff:
    - Declare all 7 files listed above as Modified
    - Remove or supersede the prior wave declarations
    - The SCOPE_DECLARATION.md update must itself appear in the commit
    - Commit before re-invoking IAA

This PR must not be opened/merged until all failures are resolved and IAA re-invoked.
Adoption phase: PHASE_B_BLOCKING — hard gate.
═══════════════════════════════════════
```

## IAA Assessment Summary

**Agent**: independent-assurance-agent v6.2.0
**Contract version**: 2.3.0 (pre-merge — this contract is under review)
**Session**: session-052
**Date**: 2026-04-06
**Invoking agent**: CodexAdvisor-agent (session-052)
**Producing agent**: CodexAdvisor-agent (session-052), class: overseer

## Checks Executed

| Check | Category | Verdict |
|-------|----------|---------|
| CORE-001 YAML frontmatter | Core | PASS ✅ |
| CORE-002 Agent version | Core | PASS ✅ |
| CORE-003 Contract version | Core | PASS ✅ |
| CORE-004 Identity block | Core | PASS ✅ |
| CORE-005 Governance block | Core | PASS ✅ |
| CORE-006 CANON_INVENTORY alignment | Core | PASS ✅ |
| CORE-007 No placeholder content | Core | PASS ✅ |
| CORE-008 Prohibitions block | Core | PASS ✅ |
| CORE-009 Merge gate interface | Core | PASS ✅ |
| CORE-010 Tier 2 knowledge indexed | Core | PASS ✅ |
| CORE-011 Four-phase structure | Core | PASS ✅ |
| CORE-012 Self-modification lock | Core | PASS ✅ |
| CORE-013 IAA invocation evidence | Core | PASS ✅ |
| CORE-014 No class exemption | Core | PASS ✅ |
| CORE-015 Session memory present | Core | PASS ✅ |
| CORE-016 IAA verdict evidenced | Core | PASS ✅ (first invocation) |
| CORE-017 No unauthorized .github/agents/ mods | Core | PASS ✅ |
| CORE-018 Complete evidence artifact sweep | Core | PASS ✅ |
| CORE-019 IAA token cross-verification | Core | PASS ✅ (first invocation) |
| CORE-020 Zero partial pass rule | Core | PASS ✅ |
| CORE-021 Zero-severity-tolerance | Core | PASS ✅ |
| CORE-022 Secret field naming | Core | PASS ✅ |
| CORE-023 Workflow integrity ripple | Core | PASS ✅ (N/A) |
| CORE-024 PHASE_B_BLOCKING_TOKEN | Core | PASS ✅ (N/A - no token file in PR diff) |
| OVL-AC-001 Strategy alignment | Overlay | PASS ✅ |
| OVL-AC-002 No contradictions | Overlay | PASS ✅ |
| OVL-AC-003 Authority boundaries | Overlay | PASS ✅ |
| OVL-AC-004 Delegation safety | Overlay | PASS ✅ |
| OVL-AC-005 Four-phase structure | Overlay | PASS ✅ |
| OVL-AC-006 Self-modification prohibition | Overlay | PASS ✅ |
| OVL-AC-007 Ripple/cross-agent impact | Overlay | **FAIL ❌** |
| OVL-AC-ADM-001 PREHANDOVER exists | Overlay | PASS ✅ |
| OVL-AC-ADM-002 Session memory exists | Overlay | PASS ✅ |
| OVL-AC-ADM-003 T2 stub present | Overlay | PASS ✅ |
| OVL-AC-ADM-004 Character count ≤30,000 | Overlay | PASS ✅ |
| PARITY-A-026 SCOPE_DECLARATION match | Parity | **FAIL ❌** |

**Total**: 36 checks — 34 PASS, 2 FAIL

## Resolution Steps for CodexAdvisor

1. **Fix A-023 (OVL-AC-007)**: Create a new PREHANDOVER proof file (e.g., `PREHANDOVER-session-052-R2-20260406.md`) that includes `## Ripple/Cross-Agent Assessment` section with explicit coverage of all agents/files impacted by this PR.

2. **Fix A-026**: Update `SCOPE_DECLARATION.md` in this PR branch to declare all 7 changed files. The prior wave declarations should be replaced. Include `SCOPE_DECLARATION.md` itself in the file list.

3. Commit both fixes in a new commit on the PR branch.

4. Re-invoke IAA via `task(agent_type: "independent-assurance-agent")` after the new commit.

---

**Issued by**: independent-assurance-agent v6.2.0
**Authority**: CS2 only (@APGI-cmy)
**Adoption phase**: PHASE_B_BLOCKING — hard gate ACTIVE
**STOP-AND-FIX**: ACTIVE — no PR opens until IAA re-invoked and ASSURANCE-TOKEN issued
