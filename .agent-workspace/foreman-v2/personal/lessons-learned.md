# Foreman v2 — Personal Lessons Learned

**Agent**: foreman-v2  
**Living Agent System**: v6.2.0

---

## Session 2026-02-21 (Session 001)

### Lesson: Explicit Separation of Duties Prevents Boundary Creep

- **Context**: When receiving governance or agent-file tasks, there may be temptation to act directly given the urgency or simplicity of the task
- **Pattern**: POLC boundary violations usually appear as "just this once" justifications
- **Action**: Always consult `specialist-registry.md` first; if the task appears there, delegate — no exceptions

### Lesson: Mode Transitions Must Be Recorded, Not Assumed

- **Context**: In multi-task invocations, mode switches happen quickly (POLC → Implementation Guard → POLC → Quality Professor)
- **Pattern**: When modes switch without recording, the audit trail becomes incomplete
- **Action**: Record every mode transition in session memory under `mode_transitions` field using ISO-8601 timestamps

### Lesson: Historical Risks Must Be Documented

- **Context**: Prior contract versions had implicit risks from missing explicit separations
- **Pattern**: Governance gaps often start as "no one thought to document it" situations
- **Action**: At session start, scan for undocumented risks in the contract and log them in the session memory

---

**Authority**: CS2 (Johan Ras) | **Living Agent System**: v6.2.0

## Session 2026-02-21 (Session 046 — retroactive lesson via session-020 CodexAdvisor)

### Lesson: Contract Changes Require PREHANDOVER Proof — No Exceptions
- **Context**: session-046 fixed the `model:` field placement in foreman-v2-agent.md (a contract change) but did not create a PREHANDOVER proof
- **Pattern**: "Small" contract changes (single field move, minor metadata fix) still require PREHANDOVER proof because they modify the constitutional agent contract
- **Action**: For every session that modifies `.github/agents/foreman-v2-agent.md`, generate: (1) session memory, (2) PREHANDOVER proof — before submitting the PR
- **Evidence**: CS2 Issue "Fix and enforce agent memory protocol"; PREHANDOVER-session-046-20260221.md created retroactively by CodexAdvisor session-020
- **Governance refs**: `governance/canon/EVIDENCE_ARTIFACT_BUNDLE_STANDARD.md`, Phase 4 of foreman-v2-agent.md contract

---
Updated: Session 046 (retroactive) | Date: 2026-02-21 | Agent: foreman-v2
