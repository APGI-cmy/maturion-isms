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
