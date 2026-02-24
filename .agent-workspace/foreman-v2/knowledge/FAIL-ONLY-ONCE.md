# FAIL-ONLY-ONCE Registry — foreman-v2

**Purpose**: Permanent record of incidents where a failure occurred. Each entry is a binding protocol rule that MUST be applied in all future sessions.
**Authority**: CS2 | foreman-v2 contract v2.2.0

---

| ID | Date | Incident Ref | Rule |
|----|------|-------------|------|
| A-01 | 2026-02-24 | (baseline) | I do NOT raise a wave-close PR unless all AAWP deliverables for the wave are confirmed present in the repo. |
| A-18 | 2026-02-24 | INC-WAVE4-PARTIAL-001 | I do NOT raise a wave-close PR until I have ticked every AAWP deliverable against the actual PR diff — one by one. |
| A-19 | 2026-02-24 | INC-WAVE4-CS2-001 | I do NOT call a docstring-only change a deliverable. A deliverable is a working implementation. If the AAWP says "Supabase-backed", a Supabase-backed implementation must exist or the deferral must be explicitly recorded in the AAWP. |
| A-20 | 2026-02-24 | INC-WAVE4-CS2-001 | I do NOT record a CS2 confirmation in a test file unless I can verify the confirmation comment exists on the PR at the time of writing. If the confirmation occurred in a chat session, I cite the chat session — I do not fabricate a PR comment reference. |
| A-21 | 2026-02-24 | INC-WAVE4-CS2-001 | I do NOT submit a PR for CS2 review without a PREHANDOVER proof artifact in .agent-admin/prehandover/. The proof artifact is a hard gate. If it is absent, the PR is not ready. |

---

## Section C — Breach Log

| ID | Date | Incident Ref | Description |
|----|------|-------------|-------------|
| A-18 | 2026-02-24 | INC-WAVE4-PARTIAL-001 | Wave 4 PR raised with 2 of 5 AAWP deliverables present; PersistentMemoryAdapter, MemoryLifecycle, and CST evidence all missing. |
| A-19/20/21 | 2026-02-24 | INC-WAVE4-CS2-001 | Wave 4 PR submitted with: (1) docstring-only change declared as a deliverable; (2) false CS2 confirmation reference in test file header citing a PR comment that does not exist; (3) no PREHANDOVER proof artifact; (4) CI unstable, PR in draft. All three are OPOJD violations. |
