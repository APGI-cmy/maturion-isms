# IAA Token File — Session 145 — 2026-03-05

| Field | Value |
|---|---|
| `token_reference` | IAA-session-145-20260305-REJECT |
| `session_id` | session-145 |
| `date` | 2026-03-05 |
| `pr_reviewed` | Issue #935 — [Layer-Down] Propagate Governance Changes - 2026-03-04 (29e76ecf) / branch: `copilot/propagate-governance-changes-551dc2cd-cb1b-40cb-a0a6-f3b74d039f88` |
| `invoking_agent` | governance-liaison-isms (session-048-20260305) — third invocation |
| `producing_agent` | governance-liaison-isms (session-048-20260305) |
| `producing_agent_class` | liaison |
| `pr_category` | CANON_GOVERNANCE |
| `adoption_phase` | PHASE_B_BLOCKING |
| `re_invocation_of` | session-144 REJECTION-PACKAGE (IAA-session-144-20260305-REJECT) |
| `verdict` | REJECTION-PACKAGE |

---

## REJECTION-PACKAGE (Verbatim)

```
═══════════════════════════════════════════════════════════════
REJECTION-PACKAGE
PR: Issue #935 — [Layer-Down] Propagate Governance Changes - 2026-03-04 (29e76ecf)
Branch: copilot/propagate-governance-changes-551dc2cd-cb1b-40cb-a0a6-f3b74d039f88
Re-invocation after: IAA-session-143-20260305-REJECT (×1) and IAA-session-144-20260305-REJECT (×1)

1 check FAILED. Merge blocked. STOP-AND-FIX required.

FAILURE:

  FAIL-145-01 / A-026 / CORE-021 / BL-027:
    Check: SCOPE_DECLARATION.md must match git diff --name-only origin/main...HEAD exactly
    Finding: PR diff contains 16 files. SCOPE_DECLARATION.md declares 14. Two files are
    present on the branch (committed at 376f20c — the session-144 REJECTION-PACKAGE commit)
    but are absent from SCOPE_DECLARATION.md:
      1. .agent-admin/assurance/iaa-token-session-144-wave-none-20260305.md
      2. .agent-workspace/independent-assurance-agent/memory/session-144-20260305.md
    These are IAA session-144 artifacts written during the second REJECTION-PACKAGE. They
    were on the branch before commit 7583b95 (the SCOPE_DECLARATION update), so the
    producing agent had visibility of them and should have declared them.
    The producing agent correctly declared session-143 IAA files but missed session-144 files.
    Fix required: Add both files to SCOPE_DECLARATION.md under "### Added", commit, push,
    and re-invoke IAA for the fourth time.
      - ".agent-admin/assurance/iaa-token-session-144-wave-none-20260305.md - IAA session-144 token file (REJECTION-PACKAGE)"
      - ".agent-workspace/independent-assurance-agent/memory/session-144-20260305.md - IAA session-144 session memory"

Adoption phase: PHASE_B_BLOCKING — hard gate ACTIVE.
═══════════════════════════════════════════════════════════════
```

---

## Phase 3 Checks Summary

| Category | Checks | PASS | FAIL |
|----------|--------|------|------|
| CORE invariants (active) | 10 | 9 | 1 (CORE-021→A-026) |
| CORE N/A (AGENT_CONTRACT only) | 12 | 12 | 0 |
| CANON_GOVERNANCE overlay | 7 | 7 | 0 |
| FAIL-ONLY-ONCE applied | 8 | 7 | 1 (A-026) |
| **Total active** | **25** | **24** | **1** |

---

## SHA256 Verification (confirmed this session)

| File | Actual SHA256 | Corrected Reference | Match |
|------|--------------|---------------------|-------|
| `governance/alignment/GOVERNANCE_ALIGNMENT_INVENTORY.json` | `18b102721751da3f24d1f4cd6fd817f0ca061a5211a3c47e399d8657a784e96a` | CORRECTION_ADDENDUM | ✅ MATCH |
| `.agent-admin/ripple/layer-down-received-20260304T083040Z.json` | `3e4bf709122cf9c97f33f66fcc659f6cacc06de3135b6744c45670fd8d6aaeab` | CORRECTION_ADDENDUM | ✅ MATCH |
| `governance/sync_state.json` | `8cafd9e3804b67cb7eaf48182f47b277ef9e911b91e13545e0c801bc5d2ecfd6` | CORRECTION_ADDENDUM | ✅ MATCH |
| `.agent-workspace/governance-liaison-isms/escalation-inbox/escalation-agent-contracts-29e76ecf-20260304.md` | `bc540a4017d61660eae6a8a323b84a49dd64551f5b78c7b7cee22092a0e2545c` | CORRECTION_ADDENDUM | ✅ MATCH |

---

*Authority: CS2 (@APGI-cmy) | IAA v6.2.0 | PHASE_B_BLOCKING*

PHASE_B_BLOCKING_TOKEN: IAA-session-145-20260305-REJECT
