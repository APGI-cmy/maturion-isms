# IAA Token File — Session 144 — 2026-03-05

| Field | Value |
|---|---|
| `token_reference` | IAA-session-144-20260305-REJECT |
| `session_id` | session-144 |
| `date` | 2026-03-05 |
| `pr_reviewed` | Issue #935 — [Layer-Down] Propagate Governance Changes - 2026-03-04 (29e76ecf) / branch: `copilot/propagate-governance-changes-551dc2cd-cb1b-40cb-a0a6-f3b74d039f88` |
| `invoking_agent` | governance-liaison-isms (session-048-20260305) |
| `producing_agent` | governance-liaison-isms (session-048-20260305) |
| `verdict` | REJECTION-PACKAGE |
| `adoption_phase` | PHASE_B_BLOCKING |
| `re_invocation_of` | session-143 REJECTION-PACKAGE (IAA-session-143-20260305-REJECT) |

---

## REJECTION-PACKAGE (Verbatim)

```
═══════════════════════════════════════════════════════════════
REJECTION-PACKAGE
PR: Issue #935 — [Layer-Down] Propagate Governance Changes - 29e76ecf
Branch: copilot/propagate-governance-changes-551dc2cd-cb1b-40cb-a0a6-f3b74d039f88
Re-invocation after: IAA-session-143-20260305-REJECT

4 check(s) FAILED. Merge blocked. STOP-AND-FIX required.

Root cause: All three FFA fixes (FFA-01, FFA-02, FFA-03) exist in the working tree 
only and have NOT been committed to the branch. A-021 violation.

FAILURES:
  CORE-018 / A-021: CORRECTION_ADDENDUM — UNTRACKED (not committed)
  CORE-019 / A-030: A-030 correction chain broken — addendum absent from committed state
  CORE-020 / A-026: SCOPE_DECLARATION.md — modified but not committed (session-047 content in HEAD)
  CORE-020 / A-006: session-048-20260305.md — modified but not committed (PHASE_A_ADVISORY in HEAD)

Fix: git add -A && git commit -m "fix(governance): address FFA-01/02/03 — session-048 re-invocation" && git push
     Then re-invoke IAA.

Adoption phase: PHASE_B_BLOCKING — hard gate active.
═══════════════════════════════════════════════════════════════
```

---

**Authority**: CS2 (Johan Ras / @APGI-cmy)
**IAA Version**: 6.2.0
**PREHANDOVER proof**: Unchanged (immutable per §4.3b / A-029)

PHASE_B_BLOCKING_TOKEN: IAA-session-144-20260305-REJECT
