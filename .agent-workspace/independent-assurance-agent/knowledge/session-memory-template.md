# IAA Session Memory Template

**Agent**: independent-assurance-agent
**Version**: 1.0.0
**Last Updated**: 2026-02-25

---

## Session Memory Structure

Copy this template for each new session. Filename: `session-NNN-YYYYMMDD.md`
Replace all `[placeholder]` values — no field may be left blank.

---

```markdown
# IAA Session Memory — Session [NNN] — [YYYY-MM-DD]

## Session Identity
- session_id: session-[NNN]
- date: [YYYY-MM-DD]
- agent_version: 6.2.0
- contract_version: 2.0.0

## Invocation Context
- pr_reviewed: [PR number and title]
- invoking_agent: [agent name that called IAA]
- producing_agent: [agent name(s) that produced the work]
- producing_agent_class: [foreman / builder / overseer / specialist]

## Classification
- pr_category: [AGENT_CONTRACT / CANON_GOVERNANCE / CI_WORKFLOW / AAWP_MAT / EXEMPT]
- ambiguity_rule_applied: [YES — ambiguity resolved to mandatory / NO — category clear]
- foreman_builder_mandate_applied: [YES / NO]

## Checks Executed
- checks_executed: [total number]
- fail_only_once_checks: [count]
- core_invariants_checks: [count]
- category_overlay_checks: [count]

## Results
- checks_passed: [count]
- checks_failed: [count]
- merge_gate_parity_result: [PASS / FAIL]

## Verdict
- verdict: [ASSURANCE-TOKEN / REJECTION-PACKAGE / EXEMPT]
- token_reference: [IAA-session-NNN-YYYYMMDD-PASS — if ASSURANCE-TOKEN, else N/A]
- adoption_phase_at_time_of_verdict: [PHASE_A_ADVISORY / PHASE_B]

## Failures Cited (if REJECTION-PACKAGE)
- failures:
    - check_id: [CORE/OVERLAY/PARITY-N]
      check_name: [name]
      finding: [specific description]
      fix_required: [exactly what must change]

## FAIL-ONLY-ONCE Rules Applied
- fail_only_once_rules_applied:
    - rule_id: A-001
      outcome: [PASS / FAIL]
      notes: [brief note]
    - rule_id: A-002
      outcome: [PASS / FAIL]
      notes: [brief note]
    - rule_id: A-003
      outcome: [PASS / FAIL]
      notes: [brief note]

## Learning Notes
- learning_notes: >
    [Record any new pattern, deviation, governance gap, or systemic observation from
    this session that should inform future invocations. If no new learning: state
    "No new patterns observed. Previous rules confirmed effective." Never leave blank.]

## FAIL-ONLY-ONCE Updates
- fail_only_once_updates: [list any new rules added to FAIL-ONLY-ONCE.md, or 'none']

## Prior Sessions Reviewed
- prior_sessions_reviewed: [list session IDs, or 'none — first session']

## Unresolved Items Carried Forward
- unresolved_items: [list, or 'none']

## Suggestions for Improvement
- suggestions: >
    [MANDATORY — never blank. At least one concrete improvement suggestion, or:
    "No degradation observed. Continuous improvement note: [specific, actionable observation]."]

## Parking Station
- parking_entries_added: [YES — entries added to suggestions-log.md / NO — none this session]
```

---

**Authority**: CS2 (Johan Ras) | **Living Agent System**: v6.2.0
