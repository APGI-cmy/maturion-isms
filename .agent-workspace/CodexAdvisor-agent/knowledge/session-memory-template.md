# CodexAdvisor — Session Memory Template (Tier 2 Operational Knowledge)

**Agent**: CodexAdvisor-agent
**Knowledge Version**: 1.0.0
**Last Updated**: 2026-02-21

---

## Purpose

Standard session memory template for CodexAdvisor-agent. Create one file per session at `.agent-workspace/CodexAdvisor-agent/memory/session-NNN-YYYYMMDD.md`.

---

## Template

```markdown
# CodexAdvisor Session Memory — Session NNN (YYYY-MM-DD)

**Session ID**: NNN
**Date**: YYYY-MM-DD
**Agent**: CodexAdvisor-agent v6.2.0
**Contract**: 2.1.0
**Authorization**: CS2 Issue/PR #<number> — "<title>"

---

## Session Preamble

prior_sessions_reviewed: [NNN, NNN, ...]
unresolved_items_from_prior_sessions: [list or 'none']

---

## Session Summary

**Task**: <Brief description of what was requested>
**Outcome**: <COMPLETED | BLOCKED | ESCALATED>
**QP Verdict**: <PASS | FAIL | N/A>

---

## Actions Taken

| Step | Action | Result |
|------|--------|--------|
| 1 | Wake-up protocol | <PASS/FAIL> |
| 2 | CANON_INVENTORY verified | <PASS/DEGRADED> |
| 3 | CS2 authorization confirmed | <YES/NO> |
| 4 | Checklist loaded | <path/MISSING> |
| 5 | Agent file created/updated | <path/BLOCKED> |
| 6 | QP self-evaluation | <PASS/FAIL> |
| 7 | PREHANDOVER proof created | <path/N/A> |
| 8 | PR opened | <#number/BLOCKED> |

---

## Agent Files Created/Modified

| File | Operation | Character Count | QP Result |
|------|-----------|----------------|-----------|
| `.github/agents/<agent>.md` | <CREATE/UPDATE> | <N> chars | <PASS/FAIL> |

---

## Escalations Triggered

| ID | Trigger | Action Taken | Resolved |
|----|---------|--------------|---------|
| | | | |

---

## Blockers Encountered

| Blocker | Root Cause | Resolution |
|---------|-----------|-----------|
| | | |

---

## CANON_INVENTORY Status

- **Status**: <VALID | DEGRADED>
- **Placeholder hashes**: <NONE | LIST>
- **Last verified**: <YYYY-MM-DD HH:MM>

---

## Mode Transitions

| From Mode | To Mode | Trigger |
|-----------|---------|---------|
| STANDBY | RAEC-REVIEW | CS2 authorization received |
| RAEC-REVIEW | RAEC-ADVISE | All checks passed |
| RAEC-ADVISE | QP-INTERRUPT | Agent file draft complete |
| QP-INTERRUPT | RAEC-COORDINATE | QP PASS |
| RAEC-COORDINATE | HANDOVER | PR created |

---

## Next Session Notes

<Any important context for the next session, including pending approvals, blockers, or follow-up actions>

---

## Suggestions for Improvement (MANDATORY — non-blank)

<At least one concrete improvement suggestion. If nothing identified, state: 'No degradation observed — continuous improvement note: [specific note]'>

---

**Session closed**: <YYYY-MM-DD HH:MM>
**Handover status**: <COMPLETE | PENDING CS2 APPROVAL | BLOCKED>
```

---

## PREHANDOVER Proof Template

Create at `.agent-workspace/CodexAdvisor-agent/memory/PREHANDOVER-session-NNN-YYYYMMDD.md`:

```markdown
# CodexAdvisor PREHANDOVER Proof — Session NNN (YYYY-MM-DD)

**Agent**: CodexAdvisor-agent v6.2.0
**Session**: NNN
**Date**: YYYY-MM-DD
**QP Verdict**: PASS

---

## Agent File Compliance Report

| Check | Result | Detail |
|-------|--------|--------|
| Character count | <N> / 30,000 | <PASS/FAIL> |
| 9 mandatory components | <N>/9 present | <PASS/FAIL> |
| YAML valid | <YES/NO> | |
| `model` nested under `agent:` | <YES/NO> | |
| No embedded Tier 2 content | <YES/NO> | |
| Checklist compliance | <N>% | |
| CANON_INVENTORY aligned | <YES/NO> | |

---

## OPOJD Gate

- [ ] Zero test failures (0/0 failing) — PASS
- [ ] Zero skipped/todo/stub tests — PASS
- [ ] Zero deprecation warnings in build output — PASS
- [ ] Zero compiler/linter warnings — PASS
- [ ] No .skip(), .todo(), stub helpers in test suite — PASS

---

## Merge Gate Parity

merge_gate_parity: PASS | FAIL

- [ ] Merge gate parity check: all required_checks run locally and match CI result — PASS

---

## Bundle Completeness

- [x] Agent contract: `.github/agents/<agent>.md`
- [x] Tier 2 stub: `.agent-workspace/<agent>/knowledge/index.md`
- [x] PREHANDOVER proof: this file
- [x] Session memory: `session-NNN-YYYYMMDD.md`

---

**QP PASS — authorized to proceed to handover.**
```

---

**Authority**: CS2 (Johan Ras) | **Living Agent System**: v6.2.0
