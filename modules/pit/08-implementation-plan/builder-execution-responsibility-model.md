# PIT Stage 8 — Builder Execution Responsibility Model

> Governance model for future build waves. Stage 11 remains the appointment stage. Build Authorization remains **NOT CLEARED** unless explicitly cleared by CS2 in tracker.

## Role definitions

- **Builder role**: executes assigned implementation wave scope only after Stage 11 appointment and explicit Build Authorization clearance.
- **Foreman role**: orchestrates, delegates, verifies evidence contracts, and controls wave pass/fail flow (no implementation execution).
- **QA/reviewer role**: validates RED->GREEN proof, negative-path coverage, and evidence completeness.
- **IAA role**: independent challenge/audit of preflight and handover assurance posture.
- **CS2 role**: sole authority for explicit Build Authorization clearance and final approval decisions.

## Signature/approval ownership by activity

| Activity | Builder | Foreman | QA/Reviewer | IAA | CS2 |
|---|---|---|---|---|---|
| Wave implementation execution | **R** | A | C | I | I |
| Wave scope sign-off (functional contract met) | R | **A** | C | I | I |
| RED test evidence filing | **R** | A | C | I | I |
| Scope conflict resolution | C | **A** | C | C | I (or A on exception) |
| Rollback approval during wave | C | **A** | C | I | C (A for policy exception) |
| CS2 exception request initiation | C | **R** | I | C | **A** |
| Claim `GREEN` (wave-level test status) | R (proposes) | **A (approves claim)** | C (validates) | I | I |
| Claim `FUNCTIONAL_PASS` | I | I | C | C | **A only** |
| Clear Build Authorization | I | I | I | C | **A only** |

Legend: **R** = Responsible, **A** = Accountable, **C** = Consulted, **I** = Informed.

## Hard governance constraints

1. Stage 11 is the builder appointment stage; no builder is appointed in Stage 8/9/10.
2. No role other than CS2 may mark Build Authorization as CLEARED.
3. Builder cannot unilaterally claim wave closure; Foreman acceptance + QA evidence is required.
4. `FUNCTIONAL_PASS` is not a builder or Foreman self-declaration; CS2 authority only after required evidence gates.
