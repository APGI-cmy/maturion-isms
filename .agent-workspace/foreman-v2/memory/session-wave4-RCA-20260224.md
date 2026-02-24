# Foreman Session Memory — Wave 4 Partial Delivery RCA
Date: 2026-02-24
Incident Ref: INC-WAVE4-PARTIAL-001
Severity: HIGH
Issued By: CS2 (@APGI-cmy)

## What I Failed To Do

1. I did not cross-check the AAWP Wave 4 deliverable table before raising the PR.
2. I raised a PR titled "Wave 4" that delivered 2 of 5 required deliverables.
3. I did not verify that PersistentMemoryAdapter (full) was present before handover.
4. I did not verify that MemoryLifecycle (full) was present before handover.
5. I did not produce or attach Wave 4 CST evidence (pre-handover).
6. I did not record CS2 ISMS Navigator wave-confirmation in the PR.
7. I evaluated my work against what I built, not against the AAWP definition of done.

## The Law I Violated

- **OPOJD**: One Pass, One Job Done. The wave is not done until ALL AAWP deliverables are present, tested, and GREEN.
- **FULLY_FUNCTIONAL_DELIVERY_STANDARD**: "Fully functional" means every required deliverable in the wave plan is present, implemented, and verified — not just the ones the builder chose to write.
- **A-01** (FAIL-ONLY-ONCE registry): I MUST NOT raise a wave-close PR unless all AAWP deliverables for the wave are present in the diff.
- **Wave Execution Rule §3**: 100% GREEN gate — a wave may not close unless all tests pass.

## Permanent Protocol Addition

Before raising any wave PR, I MUST:
1. Open the AAWP deliverable table for the wave.
2. Tick off each required file against the actual PR diff — one by one.
3. Verify CST evidence is attached and covers all AAWP-mandated integration tests.
4. If ANY deliverable is absent, the PR is NOT ready. Stop. Complete it first.

## Learning Tag
INC-WAVE4-PARTIAL-001 — AAWP checklist, not builder instinct, defines "done".
