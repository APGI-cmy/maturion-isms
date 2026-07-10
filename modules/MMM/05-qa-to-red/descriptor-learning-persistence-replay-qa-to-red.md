# MMM Descriptor Learning Persistence and Replay — QA-to-RED

| Field | Value |
|---|---|
| Module | MMM — Maturity Model Management |
| Issue | #1914 |
| QA Type | Descriptor learning persistence, governed retrieval, reasoning replay |
| Status | RED expectations — generated from CS2 live validation after PR #1909 |
| Authority | CS2 — Johan Ras |
| Created | 2026-07-08 |
| Builds on | PR #1898, PR #1905, PR #1909 |

---

## 1. Live validation evidence

After PR #1909 merged, CS2 validated the live Criteria Management UI.

Observed improvements:

1. Facility-design descriptors now regenerate with the corrected evidence-state lead-in:
   - Good: `Evidence that facility design changes are reviewed and approved...`
   - Previous failure: `Evidence that Review and approval of facility design changes...`

2. DCC-style meeting descriptors now preserve the evidence bundle:
   - meeting cadence;
   - minutes;
   - actions agreed;
   - decisions recorded;
   - accountable individuals;
   - delivery / implementation traceability.

Observed remaining failure:

1. CS2 manually edited a generated descriptor.
2. CS2 accepted the Maturion memory / learning consent prompt.
3. On regeneration, the descriptor reverted to the previous generated wording.

Conclusion: visible descriptor reasoning is improved, but consented descriptor learning is not yet persistently replayed.

---

## 2. Design rule: teach reasoning, do not hard-code outcomes

This lane must not hard-code:

- criterion code `D001.MPS002.C017`;
- the acronym `DCC`;
- an exact descriptor sentence;
- a one-off branch for the live screenshot text.

The implementation must learn and replay generalised transformation patterns. It must recognise evidence-bearing structures, not isolated criterion IDs.

Examples of reusable reasoning patterns:

- A criterion that contains meeting cadence plus minutes/actions/decisions/accountability/delivery must preserve the full evidence bundle.
- A criterion containing several evidence objects must not be reduced to the first clause.
- A user correction may create a scoped reusable pattern only when consented and lifecycle-valid.
- Learning replay should influence all five maturity levels by adapting the evidence subject and maturity state, not by copy/pasting one corrected Basic descriptor into every level.

---

## 3. Required data contract

A persisted descriptor-learning record must include, at minimum:

- tenant / organisation or framework scope;
- criterion id and/or criterion code where available;
- source mode;
- original criterion text;
- original generated descriptor text;
- user-corrected descriptor text;
- maturity level corrected;
- inferred correction category;
- transformation summary;
- reusable pattern candidate text;
- review / lifecycle status;
- conflict status;
- consent timestamp;
- created / updated timestamps.

The record must be scoped. No learning may become globally reusable merely because one user accepted a memory prompt.

---

## 4. T-MMM-DLPR-001 — accepted consent persists descriptor learning

Given a user edits a generated descriptor,

And accepts the memory / learning consent prompt,

When the edit is saved,

Then a descriptor-learning record is persisted with the required data contract.

The saved record must contain both the original generated descriptor and the user-corrected descriptor.

---

## 5. T-MMM-DLPR-002 — declined consent does not persist reusable learning

Given a user edits a generated descriptor,

And declines the memory / learning consent prompt,

When the edit is saved,

Then no reusable descriptor-learning record is created.

The descriptor may still be saved as the current descriptor, but it may not become reusable learning.

---

## 6. T-MMM-DLPR-003 — same-criterion regeneration replays learning

Given a descriptor-learning record exists for a criterion,

And the record is consented, lifecycle-valid, tenant-valid, and conflict-free,

When the same criterion is regenerated,

Then learning retrieval occurs before descriptor generation,

And the regenerated descriptors reflect the learned transformation.

The generation result must expose or log a testable signal equivalent to:

```text
learningApplied === true
```

---

## 7. T-MMM-DLPR-004 — similar-criterion regeneration uses reasoning pattern, not copy/paste

Given a stored learning record preserves a multi-part evidence bundle,

When a materially similar but not identical criterion is regenerated,

Then Maturion may reuse the learned transformation pattern only if scope and lifecycle rules allow it.

The replay must preserve analogous evidence objects from the new criterion.

It must not copy exact DCC wording, exact criterion codes, or an unrelated descriptor sentence into the new criterion.

---

## 8. T-MMM-DLPR-005 — all maturity levels are influenced by learned evidence subject

Given learning replay identifies a corrected evidence subject,

When five maturity descriptors are regenerated,

Then each level must use the learned evidence subject in a level-appropriate maturity state:

- Basic: absence / weak / inconsistent / person-dependent;
- Reactive: exists but mostly incident/audit/pressure driven;
- Compliant: complete, current, traceable, and auditor-verifiable;
- Proactive: owner-led, risk-based, measured, and improved;
- Resilient: embedded, monitored, escalated, and robust under disruption.

The system must not copy one corrected Basic descriptor into all five levels.

---

## 9. T-MMM-DLPR-006 — DCC-style evidence bundle remains a behavioural test, not a hard-coded branch

A DCC-style live validation case may be used as a test fixture:

```text
The DCC will meet at least four times a year. Minutes will be taken of these meetings, actions agreed, decisions recorded, and individuals made accountable for their delivery.
```

Expected evidence objects:

- meeting cadence;
- minutes;
- actions agreed;
- decisions recorded;
- accountable individuals;
- delivery / implementation traceability.

But the implementation must not branch on `DCC`, `D001.MPS002.C017`, or the exact text.

A second fixture with different nouns but the same evidence structure must also pass.

---

## 10. T-MMM-DLPR-007 — tenant isolation remains enforced

Learning created by Organisation A must not be retrieved by Organisation B unless it has been reviewed and promoted to an approved global methodology pattern.

Records with `approved_for_reuse_scope === "anonymised_global_pattern_candidate"` may not be reused across tenants until promoted to `approved_global_methodology_pattern`.

---

## 11. T-MMM-DLPR-008 — conflicts are not silently merged

If two applicable learning records contain conflicting transformations, Maturion must not silently merge them.

It must either:

- select a higher-confidence non-conflicting record using governed priority; or
- flag the conflict and use deterministic fallback.

---

## 12. T-MMM-DLPR-009 — retrieval unavailable fallback is honest

If the learning store is unavailable or retrieval fails,

Then descriptor generation must still fall back deterministically,

And the UI must not claim that Maturion learning was applied.

---

## 13. Non-scope

This QA-to-red does not authorise:

- ISMS public journey work;
- subscription/auth/onboarding/dashboard changes;
- PIT, RADAM, Risk, Incident, or APW changes;
- Vercel workflow changes;
- `.github/agents` changes;
- global Subject Knowledge promotion without explicit governed approval;
- unrelated schema migrations.
