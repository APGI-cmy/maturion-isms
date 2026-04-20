# IAA Session Memory — session-governance-layer-down-84997301-20260420 — 2026-04-20

```
- session_id: session-governance-layer-down-84997301-20260420
- pr_reviewed: copilot/layer-down-propagate-governance-changes-78484a54-fd01-4679-acf4-d8b3a7677083 | Issue #1423 | Wave: governance-layer-down-84997301-20260420
- overlay_applied: LIAISON_ADMIN (KNOWLEDGE_GOVERNANCE overlay + CANON_GOVERNANCE admin checks OVL-CG-ADM-001, OVL-CG-005)
- verdict: REJECTION-PACKAGE
- checks_run: 12 substance checks: 9 PASS, 3 FAIL
- learning_note: This is the SECOND occurrence of the pre-commit IAA invocation pattern (first was session-166 / layer-down-404c78fa). The prior REJECTION explicitly flagged this as a prevention candidate (NO-REPEAT-PREVENTABLE-001). The governance-liaison-isms agent invoked IAA before committing deliverables again. This pattern MUST be promoted to FAIL-ONLY-ONCE. Additionally: CANON_INVENTORY.json staleness is a new pattern in this wave — the ripple PR applied file content to main but did not update CANON_INVENTORY.json hashes. Future layer-down audits must include CANON_INVENTORY.json hash cross-verification as an explicit check item. A-029 Phase A/B confusion also recurring — governance-liaison agent must be updated to reflect Phase B is active.
```

---

## Promotion to FAIL-ONLY-ONCE (Required — NO-REPEAT-PREVENTABLE-001)

Pattern: governance-liaison-isms agent invoking IAA before committing deliverables to the PR branch (second occurrence).

Rule to add to FAIL-ONLY-ONCE.md:
> **A-[NEXT] — Governance-liaison deliverables must be committed before IAA invocation**
> Triggered by: INC-LIAISON-PRECOMMIT-001 (session-166 layer-down-404c78fa, session-governance-layer-down-84997301-20260420)
> Permanent Rule: If `governance/alignment/GOVERNANCE_ALIGNMENT_INVENTORY.json` or governance-liaison session artifacts are modified in working directory but NOT committed to the PR branch, IAA must issue REJECTION-PACKAGE with COMMIT GATE classification. No exceptions for governance-only waves.

*Authority: CS2 | IAA: session-governance-layer-down-84997301-20260420 | 2026-04-20*
