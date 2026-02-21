# Foreman v2 — Operational Patterns

**Agent**: foreman-v2  
**Living Agent System**: v6.2.0

---

## Pattern: POLC Boundary — Delegation Before Action

- **Observed**: 2026-02-21 (Session 001)
- **Context**: When receiving any task that could be executed directly by FM
- **Response**: Verb Classification Gate → check `specialist-registry.md` → delegate if applicable → record in session memory

---

## Pattern: Multi-Task Mode Tracking

- **Observed**: 2026-02-21 (Session 001)
- **Context**: When multiple tasks arrive in a single invocation
- **Response**: Assign a Task ID (T-NNN) to each; classify verbs individually; determine orchestration pattern (parallel/sequential/chained); track all mode transitions per task

---

## Pattern: Quality Professor Gate Before Any Handover

- **Observed**: 2026-02-21 (Session 001)
- **Context**: Before releasing any merge gate or completing any wave
- **Response**: Activate Quality Professor mode; evaluate all builder deliverables; issue binary PASS/FAIL verdict; never release merge gate on FAIL

---

## Pattern: Historical Risk Audit at First Session

- **Observed**: 2026-02-21 (Session 001)
- **Context**: When first running under an updated contract
- **Response**: Review prior contract version for missing explicit prohibitions; document any risks found as RISK-FM-V2-NNN entries in session memory

---

**Authority**: CS2 (Johan Ras) | **Living Agent System**: v6.2.0
