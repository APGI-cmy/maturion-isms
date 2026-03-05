# IAA Token File — Session 146 — 2026-03-05

| Field | Value |
|---|---|
| `token_reference` | IAA-session-146-20260305-PASS |
| `session_id` | session-146 |
| `date` | 2026-03-05 |
| `pr_reviewed` | Issue #935 — [Layer-Down] Propagate Governance Changes - 2026-03-04 (29e76ecf) / branch: `copilot/propagate-governance-changes-551dc2cd-cb1b-40cb-a0a6-f3b74d039f88` |
| `invoking_agent` | governance-liaison-isms-agent (session-048-20260305) — fourth invocation |
| `producing_agent` | governance-liaison-isms-agent (session-048-20260305) |
| `producing_agent_class` | liaison |
| `pr_category` | CANON_GOVERNANCE (A-003 ambiguity resolution — governance/alignment/ files; consistent with sessions 143, 144, 145) |
| `adoption_phase` | PHASE_B_BLOCKING |
| `re_invocation_of` | session-145 REJECTION-PACKAGE (IAA-session-145-20260305-REJECT) |
| `verdict` | ASSURANCE-TOKEN |

---

## ASSURANCE-TOKEN (Verbatim)

```
═══════════════════════════════════════════════════════════════════
ASSURANCE-TOKEN
PR: Issue #935 — [Layer-Down] Propagate Governance Changes - 2026-03-04 (29e76ecf)
Branch: copilot/propagate-governance-changes-551dc2cd-cb1b-40cb-a0a6-f3b74d039f88
Repository: APGI-cmy/maturion-isms
Producing Agent: governance-liaison-isms-agent (session-048-20260305)
Fourth invocation after: IAA-session-143-REJECT, IAA-session-144-REJECT, IAA-session-145-REJECT

All 26 active checks PASS. Merge gate parity: PASS.
Merge permitted (subject to CS2 approval).

Token reference: IAA-session-146-20260305-PASS
Adoption phase: PHASE_B_BLOCKING — hard gate ACTIVE
═══════════════════════════════════════════════════════════════════
```

---

## Phase 1 — Identity & Preflight (Summary)

> "I am independent-assurance-agent, class: assurance, version 6.2.0.
> My role: Independent Assurance Agent — hard-gate merge blocker and STOP-AND-FIX enforcer.
> Active constitutional lock: SELF-MOD-IAA-001.
> Authority: CS2 only (@APGI-cmy). I do not act without it."

**Tier 2 loaded.** Knowledge version: 2.4.0. All required files present.
FAIL-ONLY-ONCE registry: A-001 through A-030 active.
**CANON_INVENTORY hash check:** PASS — 191 canon entries, no placeholder hashes.
**Adoption phase:** PHASE_B_BLOCKING.

---

## Phase 2 — Alignment

| Field | Value |
|---|---|
| PR category | CANON_GOVERNANCE (A-003 ambiguity resolution — governance/alignment/ files) |
| IAA triggered | YES — mandatory |
| Independence check | CONFIRMED — IAA did not produce this work |
| Foreman/builder mandate | NOT APPLICABLE — no agent contracts in PR |

---

## Phase 3 — Assurance Results

### FAIL-ONLY-ONCE Learning Checks

| Rule | Check | Verdict |
|------|-------|---------|
| A-001 | IAA invocation evidence present | PASS ✅ |
| A-002 | No class exemption claims | PASS ✅ |
| A-006 | PHASE_A_ADVISORY detection — session memory corrected to REJECTED-BY-IAA-session-143 | PASS ✅ (A-030 supersedes PREHANDOVER narrative) |
| A-021 | Working tree clean — all artifacts committed before invocation | PASS ✅ |
| A-026 | SCOPE_DECLARATION — all 18 diff files present (zero missing); 2 pre-declared per A-029 pattern | PASS ✅ |
| A-029 | PREHANDOVER immutability respected — not modified since ed4419c | PASS ✅ |
| A-030 | CORRECTION_ADDENDUM committed at 7583b95 — correct SHA256, supersedes PREHANDOVER narrative | PASS ✅ |

### Core Invariants (Active Checks)

| Check | Verdict |
|-------|---------|
| CORE-001 to CORE-004 | N/A (AGENT_CONTRACT only) |
| CORE-005 Governance block present | PASS ✅ |
| CORE-006 CANON_INVENTORY alignment | PASS ✅ — IAA canon + AGCFPP-001 both present |
| CORE-007 No placeholder content | PASS ✅ — iaa_audit_token valid per carve-out; A-030 supersedes PREHANDOVER false narrative |
| CORE-008 to CORE-012 | N/A (AGENT_CONTRACT only) |
| CORE-013 IAA invocation evidence | PASS ✅ |
| CORE-014 No class exemption | PASS ✅ |
| CORE-015 Session memory present | PASS ✅ |
| CORE-016 IAA verdict evidenced (§4.3b) | PASS ✅ — sessions 143/144/145 token files committed; session-146 created this session |
| CORE-017 No .github/agents/ modifications | PASS ✅ — 0 agent contract files in PR diff |
| CORE-018 Complete evidence sweep | PASS ✅ |
| CORE-019 IAA token cross-verification | PASS ✅ — First invocation exception for session-048 reference; token created this session |
| CORE-020 Zero partial pass rule | PASS ✅ |
| CORE-021 Zero-severity-tolerance | PASS ✅ |
| CORE-022 Secret field naming | N/A (AGENT_CONTRACT only) |

### CANON_GOVERNANCE Overlay

| Check | Verdict |
|-------|---------|
| OVL-CG-001 Strategy alignment | PASS ✅ — A-009/A-015 correctly applied; CodexAdvisor escalated to CS2 |
| OVL-CG-002 No contradictions | PASS ✅ |
| OVL-CG-003 Enforcement gap | PASS ✅ — ESC + sync_pending tracking |
| OVL-CG-004 Ripple impact assessed | PASS ✅ — agent-contract-only ripple correctly handled |
| OVL-CG-005 ISMS layer-down scope | PASS ✅ — zero canon files layered down (correct) |
| OVL-CG-ADM-001 CANON_INVENTORY updated | PASS ✅ — no update required for agent-contract-only ripple |
| OVL-CG-ADM-002 Version bump present | PASS ✅ — not applicable for governance tracking file |

**Total: 26 active checks | 26 PASS | 0 FAIL**

---

## Phase 4 — Merge Gate Parity (§4.3)

| Gate | Local Result |
|------|-------------|
| merge-gate/verdict | PASS ✅ — JSON validation, SCOPE_DECLARATION coverage (18/18), pre-declaration valid |
| governance/alignment | PASS ✅ — CANON_INVENTORY 191 entries, no placeholder hashes; tracking files valid JSON |
| stop-and-fix/enforcement | PASS ✅ — 0 .github/agents/ modifications; working tree clean; FFA fixes committed |

**Merge gate parity: PASS**

---

## SHA256 Verification (Final — as confirmed against committed state)

| File | Declared in CORRECTION_ADDENDUM | Actual SHA256 | Result |
|------|--------------------------------|---------------|--------|
| `.agent-admin/ripple/layer-down-received-20260304T083040Z.json` | `3e4bf709122cf9c97f33f66fcc659f6cacc06de3135b6744c45670fd8d6aaeab` | `3e4bf709122cf9c97f33f66fcc659f6cacc06de3135b6744c45670fd8d6aaeab` | ✅ MATCH |
| `governance/alignment/GOVERNANCE_ALIGNMENT_INVENTORY.json` | `18b102721751da3f24d1f4cd6fd817f0ca061a5211a3c47e399d8657a784e96a` | `18b102721751da3f24d1f4cd6fd817f0ca061a5211a3c47e399d8657a784e96a` | ✅ MATCH |
| `governance/sync_state.json` | `8cafd9e3804b67cb7eaf48182f47b277ef9e911b91e13545e0c801bc5d2ecfd6` | `8cafd9e3804b67cb7eaf48182f47b277ef9e911b91e13545e0c801bc5d2ecfd6` | ✅ MATCH |
| `.agent-workspace/governance-liaison-isms/escalation-inbox/escalation-agent-contracts-29e76ecf-20260304.md` | `bc540a4017d61660eae6a8a323b84a49dd64551f5b78c7b7cee22092a0e2545c` | `bc540a4017d61660eae6a8a323b84a49dd64551f5b78c7b7cee22092a0e2545c` | ✅ MATCH |

All 4 SHA256 hashes verified ✅

---

## Prior REJECTION-PACKAGE Resolution Status

| Finding | Issued | Resolution | Status |
|---------|--------|-----------|--------|
| FFA-01 SHA256 mismatch | session-143 | CORRECTION_ADDENDUM at 7583b95 — correct hash documented and verified | ✅ RESOLVED |
| FFA-02 SCOPE_DECLARATION stale | session-143/144/145 | SCOPE_DECLARATION updated — all 18 files declared; 2 pre-declared per A-029 | ✅ RESOLVED |
| FFA-03 False PHASE_A_ADVISORY | session-143 | Session memory corrected; CORRECTION_ADDENDUM supersedes PREHANDOVER narrative per A-030 | ✅ RESOLVED |

---

*Token file written per §4.3b (A-029 architecture). PREHANDOVER proof unchanged (immutable post-commit).*
*Authority: CS2 (@APGI-cmy) | Session: session-146 | LIVING_AGENT_SYSTEM v6.2.0 | PHASE_B_BLOCKING*
