# MMM Descriptor Reasoning — UI Runtime Wiring and Learning Replay QA-to-RED

| Field | Value |
|---|---|
| Module | MMM — Maturity Model Management |
| QA Type | UI runtime wiring, visible descriptor regeneration, learning replay |
| Status | RED expectations — generated from CS2 live validation failure |
| Authority | CS2 — Johan Ras |
| Created | 2026-07-07 |
| Builds on | PR #1898, PR #1905 |

---

## 1. Live validation finding

CS2 live validation showed that the Criteria Management UI still produced the invalid descriptor stem:

```text
Evidence that Review and approval of facility design changes for adequate Security measures...
```

This proves the visible `Create maturity descriptors` / `Regenerate maturity descriptors` flow is not yet fully governed by the descriptor reasoning pipeline.

A second live validation showed that the DCC meeting criterion was reduced to only the meeting frequency, omitting the evidence-critical minutes/actions/decisions/accountability/delivery content.

---

## 2. Required runtime behaviour

The visible Criteria Management descriptor buttons MUST generate descriptors through a reasoning path that:

1. reconstructs verbatim-source headings into evidence-state clauses;
2. preserves evidence-bearing secondary clauses;
3. prevents raw malformed criterion stems in visible descriptors;
4. replays consented descriptor learning when a matching or similar correction is available;
5. keeps descriptor editability and learning consent behaviour intact.

---

## 3. T-MMM-DUIR-001 — Facility design review wording is visible in UI output

Given the criterion statement is:

```text
Review and approval of facility design changes for adequate Security measures.
```

When the user clicks `Create maturity descriptors` or `Regenerate maturity descriptors`,

Then the visible Basic descriptor MUST include:

```text
Evidence that facility design changes are reviewed and approved for adequate Security measures
```

And the visible descriptor MUST NOT include:

```text
Evidence that Review and approval of facility design changes
```

---

## 4. T-MMM-DUIR-002 — DCC minutes remain part of the evidence subject

Given the criterion statement is:

```text
The DCC will meet at least four times a year. Minutes will be taken of these meetings, actions agreed, decisions recorded, and individuals made accountable for their delivery.
```

When the user creates maturity descriptors,

Then the visible Basic descriptor MUST preserve the evidence-bearing bundle:

```text
DCC meets at least four times a year
minutes are taken
actions are agreed
decisions are recorded
individuals are made accountable
 delivery is traceable
```

The output MUST NOT reduce the descriptor subject to only:

```text
the DCC meets at least four times a year
```

---

## 5. T-MMM-DUIR-003 — Consented learning is replayed

Given the user edits a generated descriptor,

And the user clicks the `add to memory` / learning consent button,

When the same or materially similar criterion is regenerated,

Then the generation path MUST consult stored descriptor learning before producing the descriptor,

And matching permitted learning MUST influence the regenerated descriptor.

The implementation must expose testable evidence that learning was considered, for example:

```text
learningApplied === true
```

or an equivalent retrieval/result flag.

---

## 6. T-MMM-DUIR-004 — Edit and consent workflow survives regeneration wiring

After descriptors are created or regenerated through the new runtime wiring:

1. `Edit descriptor` remains available;
2. saving an edited descriptor still triggers the learning consent prompt;
3. declining consent does not create reusable learning;
4. accepting consent records a scoped learning event.

---

## 7. Non-scope

This QA does not authorise:

- ISMS public journey work;
- subscription/auth/onboarding/dashboard changes;
- PIT, RADAM, Risk, Incident, or APW changes;
- Vercel workflow changes;
- global Subject Knowledge promotion;
- direct AI provider orchestration outside existing AIMC/runtime boundaries.
