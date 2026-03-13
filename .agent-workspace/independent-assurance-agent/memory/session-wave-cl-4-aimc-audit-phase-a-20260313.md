# IAA Session Memory — Wave CL-4 AIMC Audit Phase A — 2026-03-13

```yaml
session_id: session-wave-cl-4-aimc-audit-phase-a-20260313
date: 2026-03-13
pr_reviewed: "copilot/cl-4-launch-audit-verification — Wave CL-4 AIMC Audit Phase A: Foundation Verification"
pr_branch: copilot/cl-4-launch-audit-verification
invoking_agent: foreman-v2-agent
producing_agent: foreman-v2-agent
producing_agent_class: foreman
pr_category: EXEMPT (verified correct — ceremony A-rule violations present)
secondary_triggers: "A-026/A-028 verified by explicit Foreman request and Pre-Brief Step 0.4a declaration"
checks_executed: 24
checks_passed: 22
checks_failed: 2
merge_gate_parity_result: FAIL
verdict: REJECTION-PACKAGE
token_reference: "IAA-session-wave-cl-4-aimc-audit-phase-a-20260313-REJECTION"
token_file: .agent-admin/assurance/iaa-token-session-wave-cl-4-aimc-audit-phase-a-20260313.md
adoption_phase_at_time_of_verdict: PHASE_B_BLOCKING
prior_sessions_reviewed:
  - session-wave16-orchestration-20260309
  - session-wave16-orchestration-20260309-R2
  - session-wave15r-impl-R2-20260308
  - session-wave16-full-batch-20260310
  - session-waveOVLINJ-20260307
prehandover_proof: .agent-workspace/foreman-v2/memory/PREHANDOVER-session-wave-cl-4-aimc-audit-phase-a-20260313.md
session_memory_foreman: .agent-workspace/foreman-v2/memory/session-wave-cl-4-aimc-audit-phase-a-20260313.md
iaa_prebrief: .agent-admin/assurance/iaa-prebrief-waveCL-4-launch-20260313.md (SHA fbcef8b)
```

---

## Checks Summary

### Passing Checks (22/24)

- CERT-001 to CERT-004: PASS — all ceremony gates clear
- CORE-007: PASS — no placeholder content
- CORE-013: PASS — A-001 IAA invocation evidence present (SHA fbcef8b)
- CORE-014: PASS — no class exemption claimed
- CORE-015: PASS — session memory present
- CORE-016: PASS — first invocation exception applied; token file created this session
- CORE-017: PASS — no .github/agents/ modifications
- CORE-018: PASS — complete evidence artifact sweep clear
- CORE-019: PASS — first invocation exception
- CORE-020: PASS — zero partial passes
- CORE-022: PASS — N/A (no agent contract changes)
- CORE-023: PASS — N/A (no workflow-adjacent changes)
- OVL-INJ-001: PASS — Pre-Brief artifact present and non-empty
- OVL-INJ-ADM-001: PASS — non-empty
- OVL-INJ-ADM-002: PASS — correct wave reference
- A-001: PASS — Pre-Brief committed before builder work (SHA fbcef8b)
- A-021: PASS — Pre-IAA Commit Gate all items checked
- A-029: PASS — PREHANDOVER proof immutable, token pre-populated at commit time
- A-031: PASS — N/A (no prior rejection ceremony on this branch)
- EXEMPT classification: PASS — 7/7 git diff files are governance/orchestration artifacts

### Failing Checks (2/24)

**FAILURE 1 — A-026**:
`.agent-workspace/foreman-v2/personal/SCOPE_DECLARATION.md` in git diff but not in CL-4 table.
Fix: Add self-row to CL-4 files table.

**FAILURE 2 — A-028**:
SCOPE_DECLARATION.md contains prior-wave entries from wave17-parsing-instructions and
wave-ai-criteria-creation-fix not trimmed. File claims "Fresh overwrite: YES" but overwrite
was incomplete. Fix: Remove two stale `## Files Modified` sections and associated `## Out of Scope` sections.

---

## Failures Cited

```yaml
failures_cited:
  - check: A-026
    finding: "SCOPE_DECLARATION.md missing self-entry (.agent-workspace/foreman-v2/personal/SCOPE_DECLARATION.md not listed in CL-4 table)"
    fix_required: "Add self-row to CL-4 files table: | `.agent-workspace/foreman-v2/personal/SCOPE_DECLARATION.md` | Governance personal | GOVERNANCE — this file (scope declaration for A-026/A-028) |"
  - check: A-028
    finding: "Prior-wave entries (wave17-parsing-instructions and wave-ai-criteria-creation-fix sections) not trimmed from SCOPE_DECLARATION.md despite 'Fresh overwrite: YES' declaration"
    fix_required: "Remove second and third ## Files Modified sections and associated ## Out of Scope sections from SCOPE_DECLARATION.md"
```

---

## FAIL-ONLY-ONCE Rules Applied

```yaml
fail_only_once_rules_applied:
  - rule: A-001
    outcome: PASS — Pre-Brief artifact SHA fbcef8b confirmed before any builder work
  - rule: A-002
    outcome: PASS — Foreman-class; no class exemption claimed
  - rule: A-021
    outcome: PASS — Pre-IAA Commit Gate confirmed
  - rule: A-026
    outcome: FAIL — SCOPE_DECLARATION missing self-entry
  - rule: A-028
    outcome: FAIL — prior-wave entries not trimmed
  - rule: A-029
    outcome: PASS — PREHANDOVER proof immutable, token pre-populated
  - rule: A-031
    outcome: PASS — N/A (no prior rejection on this branch)
fail_only_once_updates: none (existing A-026/A-028 rules sufficient)
```

---

## Learning Notes

```yaml
learning_notes:
  - "SCOPE_DECLARATION.md 'Fresh overwrite: YES' declaration is not a substitute for verifying the file
     actually contains only current-wave content. IAA must cat the file and check for stale sections
     regardless of the overwrite declaration."
  - "Pattern confirmed: SCOPE_DECLARATION.md must always list itself in the files table when it is
     in the git diff. Prior sessions (wave17) demonstrate this practice. Foreman should treat this as
     a checklist item in the PREHANDOVER template."
  - "CL-4 EXEMPT classification was CORRECT — all 7 git diff files are governance/orchestration artifacts.
     The two failures are purely ceremony/process issues on the SCOPE_DECLARATION file, not substantive
     governance or security concerns. R2 expected to be rapid."
  - "For future EXEMPT-category PRs where Foreman explicitly requests A-026/A-028 verification:
     IAA correctly runs these checks per CORE-021 zero-severity-tolerance. The Foreman's explicit
     Pre-Brief declaration of A-rules to verify at handover creates an obligation for IAA to run them."
```

---

## Suggestions for Improvement

```yaml
suggestions_for_improvement:
  - suggestion: "Add a SCOPE_DECLARATION self-check to the Foreman PREHANDOVER template as an explicit
     checkbox: '[ ] SCOPE_DECLARATION.md lists itself in the files table'. This recurring pattern
     (SCOPE_DECLARATION omitting itself) has now appeared in multiple waves."
  - suggestion: "The SCOPE_DECLARATION 'Fresh overwrite: YES' declaration provides false assurance if
     the file is not actually fully overwritten. Foreman should use a script or explicit delete-and-recreate
     pattern rather than an in-place edit that may retain prior content."
```

---

**Authority**: CS2 (Johan Ras / @APGI-cmy)
**IAA**: independent-assurance-agent v6.2.0
**Adoption Phase**: PHASE_B_BLOCKING
**Date**: 2026-03-13
