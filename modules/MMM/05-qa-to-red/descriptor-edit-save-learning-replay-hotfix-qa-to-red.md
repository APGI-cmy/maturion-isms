# MMM Descriptor Edit Save and Learning Replay Hotfix — QA-to-RED

| Field | Value |
|---|---|
| Module | MMM — Criteria Management |
| Issue | #1929 |
| Parent issue | #1914 |
| QA Type | Live validation failure / hotfix |
| Status | RED expectations from CS2 live validation |
| Authority | CS2 — Johan Ras |
| Created | 2026-07-12 |

---

## 1. Live validation failure

After PR #1918 merged, CS2 live-tested the descriptor learning loop.

Observed failure:

1. The Basic descriptor for a DCC-style evidence-bundle criterion was manually edited.
2. The edit preserved meeting cadence, minutes, actions, decisions, accountable individuals, and traceable delivery / implementation proof.
3. The user exited descriptor editing.
4. The user clicked Create / Regenerate maturity descriptors.
5. The Basic descriptor reverted to the generated wording.

This means the user correction was not persisted and/or was not replayed before regeneration.

---

## 2. Probable failure mode

Current UI behaviour appears to separate three concepts:

- Edit descriptor / Done editing;
- Maturion learning consent;
- Save maturity descriptors.

The user-facing workflow makes this look like the edit was accepted, but `Done editing` only exits the edit state. Learning is only persisted through the separate descriptor save action.

If the user regenerates before saving descriptors, the correction can be overwritten before any replayable learning record exists.

This is a workflow failure. The UI must not allow a user correction to be silently discarded.

---

## 3. Required product behaviour

The implementation must do at least one of the following:

1. Persist descriptor edits when the user clicks `Done editing`; or
2. Prevent regeneration while descriptor edits are unsaved and show a clear save-first message.

Preferred behaviour:

- Clicking `Done editing` on an edited descriptor should save descriptor changes or clearly trigger the save pathway.
- If learning consent was accepted, the save must persist a descriptor-learning event.
- Regeneration must never overwrite unsaved descriptor edits without warning.

---

## 4. T-MMM-DESR-001 — regeneration is blocked when descriptor edits are unsaved

Given a user edits any maturity descriptor level,

And the edited descriptor has not yet been persisted,

When the user clicks Create / Regenerate maturity descriptors,

Then the UI must not overwrite the edited descriptor draft.

The UI must show a clear message such as:

```text
Save maturity descriptor edits before regenerating so Maturion can record and replay your correction.
```

---

## 5. T-MMM-DESR-002 — finishing edit cannot imply persistence if no persistence occurred

Given a user clicks `Done editing`,

Then either the descriptor change must be persisted,

Or the UI must continue to indicate that descriptor changes are unsaved.

The workflow must not imply that Maturion has learned from the edit unless the save path has completed successfully.

---

## 6. T-MMM-DESR-003 — saved descriptor edit records learning when consent is accepted

Given a user edits a descriptor level,

And accepts the Maturion learning prompt,

When the descriptor save completes,

Then `mmm-level-descriptor-save` must record a descriptor-learning event.

The success message must indicate that Maturion learning was recorded.

---

## 7. T-MMM-DESR-004 — same-criterion regeneration replays the saved correction

Given a descriptor edit was saved with learning consent,

When the user regenerates descriptors for the same criterion,

Then descriptor generation must retrieve the saved learning,

And the regenerated descriptors must reflect the corrected evidence subject across all five levels.

---

## 8. T-MMM-DESR-005 — similar-criterion replay remains pattern-based

Given a saved evidence-bundle correction exists,

When a materially similar criterion is regenerated,

Then Maturion may reuse the learned evidence-bundle reasoning pattern within scope.

It must not copy exact DCC wording, criterion code, or one corrected descriptor into unrelated criteria.

---

## 9. Anti-hard-coding rule

Do not hard-code:

- `D001.MPS002.C017`;
- `DCC`;
- exact screenshot wording;
- one corrected Basic descriptor copied into all five levels.

The fix must protect the edit-save-replay workflow for any descriptor correction.

---

## 10. Non-scope

This hotfix does not authorise:

- global Subject Knowledge promotion;
- cross-tenant approved global methodology governance;
- AI-provider orchestration;
- PIT / RADAM / Risk / Incident / APW work;
- ISMS public journey work;
- subscription/auth/onboarding/dashboard changes;
- Vercel workflow changes;
- `.github/agents` changes;
- unrelated Supabase schema work.
