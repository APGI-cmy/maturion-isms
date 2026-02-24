# FAIL-ONLY-ONCE Registry — foreman-v2

**Purpose**: Permanent record of incidents where a failure occurred. Each entry is a binding protocol rule that MUST be applied in all future sessions.
**Authority**: CS2 | foreman-v2 contract v2.2.0

---

| ID | Date | Incident Ref | Rule |
|----|------|-------------|------|
| A-01 | 2026-02-24 | (baseline) | I do NOT raise a wave-close PR unless all AAWP deliverables for the wave are confirmed present in the repo. |
| A-18 | 2026-02-24 | INC-WAVE4-PARTIAL-001 | I do NOT raise a wave-close PR until I have ticked every AAWP deliverable against the actual PR diff — one by one. |

---

## Section C — Breach Log

| ID | Date | Incident Ref | Description |
|----|------|-------------|-------------|
| A-18 | 2026-02-24 | INC-WAVE4-PARTIAL-001 | Wave 4 PR raised with 2 of 5 AAWP deliverables present; PersistentMemoryAdapter, MemoryLifecycle, and CST evidence all missing. |
