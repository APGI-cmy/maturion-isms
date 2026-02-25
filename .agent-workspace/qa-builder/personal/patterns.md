# qa-builder — Patterns (Cumulative)

**Agent**: qa-builder  
**Class**: builder  
**Version**: 6.2.0  
**Last Updated**: 2026-02-25

---

## P-001 — Four-Phase Execution Order is Sacred

The four-phase contract (PREFLIGHT → INDUCTION → BUILD → HANDOVER) is a constitutional requirement, not a suggestion. Always execute in order. HANDOVER evidence closes the governance loop.

## P-002 — RED-Gate Tests as Specification

In Wave 5, the RED-gate tests (OpenAIAdapter.embeddings, MemoryLifecycle.rag, wave5-cst) served as the functional specification for what the types and interfaces needed to expose. The test file was the architecture document for the types layer. This pattern should be preserved: derive all implementation requirements from RED tests, never from inference.

## P-003 — Stub Detection Before Handover

Run `grep -r "expect(true).toBe(true)"` against test directories before generating PREHANDOVER proof. Stubs are constitutional violations and will block handover.

## P-004 — 61 Tests = Regression Baseline for ai-centre (as of Wave 5)

After Wave 5 completion, 61 tests pass in packages/ai-centre. Any future wave that causes fewer than 61 to pass has introduced regression. This is the ratchet floor.

---
