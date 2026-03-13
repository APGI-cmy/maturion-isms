# IAA Session Memory — session-cp-1-persona-gate-closure-20260313

**Agent**: independent-assurance-agent  
**Version**: 6.2.0  
**Contract**: 2.2.0  

---

## Session Fields

```yaml
session_id: session-cp-1-persona-gate-closure-20260313
date: 2026-03-13
pr_reviewed: "copilot/cp-1-update-maturion-advisor-sign-off — CP-1 Persona Gate Closure"
pr_commit_reviewed: 1ae39714b6e8dff358215ef145689c3b0fdb22e2
invoking_agent: foreman-v2-agent
producing_agent: foreman-v2-agent
producing_agent_class: foreman
pr_category: CANON_GOVERNANCE (primary), PRE_BRIEF_ASSURANCE (secondary)
checks_executed: 33
checks_passed: 32
checks_failed: 1
merge_gate_parity_result: FAIL
verdict: REJECTION-PACKAGE
token_reference: IAA-session-cp-1-persona-gate-closure-20260313-REJECTION-001
adoption_phase_at_time_of_verdict: PHASE_B_BLOCKING
prior_sessions_reviewed:
  - session-wave-status-sweep-prebrief-20260312.md (EXEMPT verdict)
  - session-ci-gateway-fix-20260312.md (REJECTION-PACKAGE — different PR)
  - session-wave16-full-batch-20260310.md (ASSURANCE-TOKEN)
  - session-gov-improvement-s032-s033-s007-s023-20260310-R2.md (ASSURANCE-TOKEN)
  - session-wave-16.2-gap-remediation-20260311.md (ASSURANCE-TOKEN)
```

---

## FAIL-ONLY-ONCE Rules Applied

```yaml
fail_only_once_rules_applied:
  - rule: A-001
    outcome: PASS — IAA pre-brief (27b5517) and PREHANDOVER proof committed; invocation evidence present
  - rule: A-002
    outcome: PASS — foreman class subject to IAA; no class exception claimed
  - rule: A-021
    outcome: PASS — pre-brief committed at 27b5517 before substantive changes at 1ae3971
  - rule: A-025
    outcome: PASS — iaa_token: PENDING in PREHANDOVER; A-029 pre-populated reference format used
  - rule: A-026
    outcome: FAIL — SCOPE_DECLARATION.md declares wave-status-sweep-20260312 (prior wave), not cp-1-persona-gate-closure-20260313; file not in git diff; stale = BL-027 merge gate parity failure
  - rule: A-028
    outcome: FAIL — prior-wave entries not trimmed; SCOPE_DECLARATION.md unchanged from prior merged wave
  - rule: A-029
    outcome: PASS — PREHANDOVER proof is read-only post-commit; IAA writes own rejection artifact
  - rule: A-031
    outcome: PASS — IAA pre-brief correctly excluded from SCOPE_DECLARATION with carve-out note in PREHANDOVER
```

---

## Failures Cited

```yaml
failures_cited:
  - check: CORE-001 / A-026 / A-028
    description: "SCOPE_DECLARATION.md stale — declares wave-status-sweep-20260312 (prior wave); current PR is cp-1-persona-gate-closure-20260313; file not updated in this PR; git diff does not include SCOPE_DECLARATION.md"
    fix_required: "Update SCOPE_DECLARATION.md to declare wave cp-1-persona-gate-closure-20260313 with list of 7 PR files + SCOPE_DECLARATION.md itself. Commit as new commit. Re-invoke IAA. Do NOT edit PREHANDOVER proof (A-029 immutability)."
```

---

## Substantive Quality Assessment

The CP-1 deliverables are high quality:
- `cp-1-closure-20260313.md`: complete, all required fields, CS2 sign-off placeholder correctly framed, all three CL-1 deliverables confirmed and cross-referenced
- `AIMC_LKIAC_COMBINED_EXECUTION_PLAN.md` Amendment v1.5.0: precisely scoped, correct version bump, no unintended edits to other wave entries
- `maturion-advisor.md`: confirmed present at actual path (`packages/ai-centre/src/agents/`), version 1.0.0, all 7 YAML front-matter fields verified
- PREHANDOVER proof: thorough, all required fields, correct A-031 carve-out, accurate task completion table

The only failure is a ceremony administration miss (SCOPE_DECLARATION.md not updated). Fix is trivial — one file update, one commit.

---

## Learning Notes

```yaml
learning_notes:
  - observation: "SCOPE_DECLARATION.md A-026 failure is a recurring pattern. This is the third recent instance (session-ci-gateway-fix-20260312 also had SCOPE_DECLARATION issues). The Foreman's PREHANDOVER template claims A-026 compliance via a 'Scope Declaration Reference' section listing the files, but SCOPE_DECLARATION.md itself may not be updated."
  - pattern: "Foreman may confuse PREHANDOVER 'Scope Declaration Reference' section (a documentation section within PREHANDOVER) with the actual SCOPE_DECLARATION.md file at root. These are two distinct artifacts. Both must match the git diff."
  - suggestion: "Consider recommending that Foreman PREHANDOVER template include an explicit pre-commit checklist item: 'git diff --name-only origin/main...HEAD | cat SCOPE_DECLARATION.md — confirm SCOPE_DECLARATION.md was updated this session'. This would prevent the recurring A-026 miss."
  - observation: "A-030 pattern applies for re-invocation — correction addendum commit resolves CORE-019; PREHANDOVER immutability (A-029) is correctly preserved by NOT editing PREHANDOVER proof."
```

---

## FAIL-ONLY-ONCE Registry Updates

```yaml
fail_only_once_updates:
  - candidate_rule: "Foreman PREHANDOVER 'Scope Declaration Reference' section ≠ SCOPE_DECLARATION.md file. A-026 requires SCOPE_DECLARATION.md at root to be updated AND committed in the PR. PREHANDOVER section is a documentation cross-reference only — it does not satisfy A-026."
  - action: "Existing A-026 rule covers this — no new rule needed. Learning note captured above."
```

---

## Suggestions for Improvement

**S-ONGOING-IAA-CP1-001**: The Foreman's PREHANDOVER template's "Scope Declaration Reference" section naming is ambiguous — it could be misread as claiming that the section itself satisfies A-026, rather than as a documentation cross-reference to the separately-required SCOPE_DECLARATION.md file. Consider adding an explicit note to the PREHANDOVER template: "This section is a documentation reference only. A-026 requires SCOPE_DECLARATION.md at repository root to be separately updated, matching `git diff --name-only origin/main...HEAD` exactly, and committed in the PR."

---

## Parking Station Entry

Entry to be appended to `.agent-workspace/independent-assurance-agent/parking-station/suggestions-log.md`:

`| 2026-03-13 | independent-assurance-agent | session-cp-1-persona-gate-closure-20260313 | TEMPLATE-CLARITY | PREHANDOVER 'Scope Declaration Reference' section ambiguous — could mask A-026 miss; suggest adding explicit note distinguishing section from SCOPE_DECLARATION.md file | session-cp-1-persona-gate-closure-20260313.md |`

---

**Authority**: CS2 (Johan Ras / @APGI-cmy)
**LIVING_AGENT_SYSTEM**: v6.2.0
**IAA Agent**: independent-assurance-agent v6.2.0
