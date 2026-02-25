# governance-liaison-isms — Session Memory Template (Tier 2 Knowledge)

**Agent**: governance-liaison-isms
**Knowledge Version**: 1.0.0
**Last Updated**: 2026-02-25
**Architecture**: `governance/canon/THREE_TIER_AGENT_KNOWLEDGE_ARCHITECTURE.md`
**Referenced from**: Phase 4 Step 4.3 of `.github/agents/governance-liaison-isms-agent.md`

---

## Purpose

Standard session memory template for governance-liaison-isms. Create one file per session at
`.agent-workspace/governance-liaison-isms/memory/session-NNN-YYYYMMDD.md`.

---

## Session Memory Template

```markdown
# governance-liaison-isms Session Memory — Session NNN (YYYY-MM-DD)

**Session ID**: NNN
**Date**: YYYY-MM-DD
**Agent**: governance-liaison-isms v6.2.0
**Contract**: 3.1.0
**Authorization**: CS2 Issue/PR #<number> — "<title>"

---

## Session Preamble

fail_only_once_attested: true | fail_only_once_version: <version> | unresolved_breaches: [none]
prior_sessions_reviewed: [NNN, NNN, ...]
unresolved_items_from_prior_sessions: [list or 'none']

---

## Session Summary

**Task**: <Brief description of what was requested>
**Outcome**: <COMPLETED | BLOCKED | ESCALATED>
**Ripple Event ID**: <uuid or N/A>

---

## Actions Taken

| Step | Action | Result |
|------|--------|--------|
| 1 | Identity declared from YAML | <PASS/FAIL> |
| 2 | Tier 2 loaded (index.md) | <PASS/FAIL> |
| 3 | CANON_INVENTORY verified | <PASS/DEGRADED> |
| 4 | Session memory loaded | <PASS/FAIL> |
| 5 | FAIL-ONLY-ONCE attested | <CLEAR/BLOCKED> |
| 6 | Merge gate requirements loaded | <PASS/FAIL> |
| 7 | Ripple event validated | <PASS/SKIPPED — no ripple> |
| 8 | Layer-down executed | <PASS/SKIPPED> |
| 9 | SHA256 checksums verified | <PASS/FAIL/SKIPPED> |
| 10 | Sync state updated | <PASS/SKIPPED> |
| 11 | Merge gate parity check (3.8) | <PASS/FAIL> |
| 12 | OPOJD gate (4.1) | <PASS/FAIL> |
| 13 | Evidence bundle created (4.2) | <PASS/N/A> |
| 14 | IAA invoked (4.4a) | <TOKEN / PHASE_A_ADVISORY / N/A> |
| 15 | PR opened | <#number/BLOCKED> |

---

## Files Modified

| File | Operation | SHA256 (first 16) | Result |
|------|-----------|-------------------|--------|
| `governance/canon/FILE1.md` | <UPDATE/CREATE> | <sha256...> | <PASS/FAIL> |
| `.agent-admin/governance/sync_state.json` | UPDATE | <sha256...> | <PASS/FAIL> |

---

## Governance Alignment

- **Ripple received**: <YES (dispatch-id: <uuid>) / NO>
- **Ripple processed**: <COMPLETE / PENDING / N/A>
- **Drift detected**: <YES / NO>
- **Self-alignment executed**: <YES / NO>
- **Files updated**: <N canon files / none>
- **Alignment gate**: <PASSED / FAILED>

---

## Escalations Triggered

| ID | Type | Trigger | Action Taken | Resolved |
|----|------|---------|--------------|---------|
| | | | | |

(or: none)

---

## CANON_INVENTORY Status

- **Status**: <VALID | DEGRADED>
- **Placeholder hashes**: <NONE | LIST>
- **Last verified**: <YYYY-MM-DD HH:MM>

---

## Merge Gate Parity

merge_gate_parity: <PASS | FAIL>

- [ ] Merge Gate Interface / merge-gate/verdict: <local result>
- [ ] Merge Gate Interface / governance/alignment: <local result>
- [ ] Merge Gate Interface / stop-and-fix/enforcement: <local result>

---

## IAA Invocation

- **IAA Required**: <YES / NO — category: [agent_contract / governance_change / not_required]>
- **IAA Result**: <ASSURANCE-TOKEN ref / REJECTION-PACKAGE / PHASE_A_ADVISORY token / NOT_REQUIRED>

---

## Suggestions for Improvement (MANDATORY — non-blank)

<At least one concrete improvement suggestion. If nothing identified, state:>
'No degradation observed. Continuous improvement note: [specific, actionable observation].'

---

## Parking Station Entries

| YYYY-MM-DD | governance-liaison-isms | session-NNN | [ALIGNMENT/SESSION-END] | <summary> | session-NNN-YYYYMMDD.md |

---

**Session closed**: <YYYY-MM-DD HH:MM>
**Handover status**: <COMPLETE | PENDING CS2 APPROVAL | BLOCKED>
```

---

## PREHANDOVER Proof Template

Create at `.agent-workspace/governance-liaison-isms/memory/PREHANDOVER-session-NNN-YYYYMMDD.md`:

```markdown
# governance-liaison-isms PREHANDOVER Proof — Session NNN (YYYY-MM-DD)

**Agent**: governance-liaison-isms v6.2.0
**Session**: NNN
**Date**: YYYY-MM-DD
**Contract Version**: 3.1.0
**Authorization**: CS2 Issue/PR #<number>

---

## OPOJD Gate (Phase 4.1)

| Check | Result | Detail |
|-------|--------|--------|
| YAML validation | <PASS/FAIL> | All modified files parse without error |
| Canon hash verification | <PASS/FAIL> | All hashes current and non-placeholder |
| SHA256 checksums verified | <PASS/FAIL> | All layered-down files verified |
| Sync state updated | <PASS/FAIL> | sync_state.json reflects current run |
| No placeholder/stub/TODO | <PASS/FAIL> | All artifacts complete |
| Evidence artifacts present | <PASS/FAIL> | All 4 bundle items confirmed |
| Merge gate parity | <PASS/FAIL> | From Phase 3.8 |

**OPOJD Gate**: <PASS / FAIL>

---

## Merge Gate Parity (Phase 3.8)

merge_gate_parity: <PASS | FAIL>

All [N] required checks pass locally. Local results match expected CI behaviour.

---

## Bundle Completeness

- [x] Session memory: `.agent-workspace/governance-liaison-isms/memory/session-NNN-YYYYMMDD.md`
- [x] PREHANDOVER proof: this file
- [x] Evidence bundle: `.agent-admin/build-evidence/session-NNN/`
- [x] Sync state: `.agent-admin/governance/sync_state.json`

---

## CS2 Authorization Evidence

Authorization source: <issue link or comment reference>

---

## IAA Invocation Result

<ASSURANCE-TOKEN ref / REJECTION-PACKAGE / PHASE_A_ADVISORY / NOT_REQUIRED>

---

**PREHANDOVER COMPLETE — authorized to proceed to PR open.**
```

---

**Authority**: CS2 (Johan Ras) | **Living Agent System**: v6.2.0
