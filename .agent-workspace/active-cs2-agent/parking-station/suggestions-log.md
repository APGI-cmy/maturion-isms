# Active-CS2 — Suggestions Log

- **2026-10-05 (session 001, GOV-2064-T3)**: The approved merge-policy `refusal_codes` closed enum (`governance/schemas/ACTIVE_CS2_MERGE_POLICY.schema.json`) already fully expresses rejected (`MATERIAL_BLOCKER`), missing (`GATE_UNSATISFIED`), and stale (`EVIDENCE_STALE`) final-IAA states — no new code was needed or added. A future canon revision could consider naming these three states explicitly (e.g. `IAA_REJECTED`/`IAA_MISSING`/`IAA_STALE`) purely for operator readability, but this is a non-breaking cosmetic suggestion only, not a functional gap, and must go through the normal publisher layer-down route if ever pursued — not a hand-edit of this consumer copy.

