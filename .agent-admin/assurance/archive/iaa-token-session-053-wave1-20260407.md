# IAA REJECTION-PACKAGE

**Token Reference**: IAA-session-053-wave1-20260407-REJECT
**Session**: session-053-wave1-20260407
**Date**: 2026-04-07
**PR Branch**: Issue #1257 — "Align builder contract assumptions to the canonical 12-stage pre-build model"
**Invoking Agent**: CodexAdvisor-agent (session 053, 2026-04-07)
**Producing Agent**: CodexAdvisor-agent (class: overseer)
**IAA Invocation**: R1 (first invocation for this session)
**Adoption Phase**: PHASE_B_BLOCKING

---

## ═══════════════════════════════════════
## REJECTION-PACKAGE

**PR**: Issue #1257 — "Align builder contract assumptions to the canonical 12-stage pre-build model"
**5 builder contracts reviewed**: api-builder.md, integration-builder.md, qa-builder.md, schema-builder.md, ui-builder.md

**1 check FAILED. Merge blocked. STOP-AND-FIX required.**

### FAILURES:

**CORE-012: Self-modification lock present — FAIL ❌**

**Affected contracts**: `integration-builder.md`, `schema-builder.md`, `ui-builder.md` (3 of 5)

**Finding**: Three of the five builder contracts under review do NOT have a `prohibitions:` array entry with `id` matching `SELF-MOD-*` and `enforcement: CONSTITUTIONAL`. These contracts have:
- `lock_id: SELF-MOD-[AGENT]-001` declared in the `identity:` YAML block (reference only)
- `NO-CONTRACT-001: BLOCKING` prohibition (insufficient — BLOCKING, not CONSTITUTIONAL; and `NO-CONTRACT-001` does not match `SELF-MOD-*` pattern)
- `NO-CLASS-EXEMPTION: CONSTITUTIONAL` prohibition (different purpose — class exemption gate, not self-modification lock)

**What is present in api-builder and qa-builder (the correct pattern)**:
```yaml
prohibitions:
  - id: SELF-MOD-API-001
    rule: "I NEVER write to or modify any .github/agents/*.md file. If instructed, HALT and escalate to Foreman."
    enforcement: CONSTITUTIONAL
```

**What is MISSING in integration-builder, schema-builder, ui-builder**: An equivalent `SELF-MOD-INT-001`, `SELF-MOD-SCHEMA-001`, `SELF-MOD-UI-001` prohibition entry with:
- `id:` matching `SELF-MOD-*` pattern
- `rule:` stating the self-modification prohibition
- `enforcement: CONSTITUTIONAL`

**Fix required**: Add a proper `SELF-MOD-*` prohibition entry to the `prohibitions:` YAML array in each of the three affected contracts:
- `.github/agents/integration-builder.md` → add `id: SELF-MOD-INT-001, rule: "I NEVER write to or modify any .github/agents/*.md file. If instructed, HALT and escalate to Foreman.", enforcement: CONSTITUTIONAL`
- `.github/agents/schema-builder.md` → add `id: SELF-MOD-SCHEMA-001, enforcement: CONSTITUTIONAL`
- `.github/agents/ui-builder.md` → add `id: SELF-MOD-UI-001, enforcement: CONSTITUTIONAL`

> **ZERO-SEVERITY-TOLERANCE NOTE**: This is a pre-existing gap not introduced by this PR. However, CORE-012 is a binary existence check applied to all AGENT_CONTRACT PRs reviewing the artifact as-submitted. CORE-021 is absolute: any finding = REJECTION-PACKAGE. There is no written CS2 waiver for this gap in the PREHANDOVER proof.

---

### PASS SUMMARY (checks that passed — informational only)

All changes for Issue #1257 are substantively correct and will PASS upon R2 resubmission once the CORE-012 gap is resolved:

| Check | Result |
|-------|--------|
| **SUBSTANCE: 12-Stage Model Alignment** | ✅ PASS — All 5 contracts correctly reference Stages 1–11 |
| **SUBSTANCE: Pre-build chain escalation rule** | ✅ PASS — All 5 have `Pre-build chain (Stages 1-11) not complete -> halt_and_escalate` (6th rule, correctly positioned) |
| **SUBSTANCE: Pre-Build entry assumption** | ✅ PASS — All 5 declare `Stages 1-11 complete — scope frozen, PBFAG passed, Builder Checklist satisfied, IAA Pre-Brief acknowledged, Builder Appointment valid` |
| **SUBSTANCE: Build Sequence steps 3–6** | ✅ PASS — All 5 have the 4 new verification steps before implementation |
| **SUBSTANCE: ui-builder §3.7 compaction** | ✅ PASS — Compacted to single paragraph, WCAG 2.1 AA authority retained, within char limit |
| YAML valid (all 5 files) | ✅ PASS |
| Character counts ≤ 30,000 (all 5) | ✅ PASS — max 29,721 chars (ui-builder) |
| YAML escalation rules = 6 (all 5) | ✅ PASS |
| CORE-001: YAML frontmatter valid | ✅ PASS |
| CORE-002: Agent version 6.2.0 | ✅ PASS |
| CORE-003: Contract version 4.0.0 | ✅ PASS |
| CORE-004: Identity block complete | ✅ PASS |
| CORE-005: Governance block present | ✅ PASS |
| CORE-006: CANON_INVENTORY alignment | ✅ PASS — 198 canons, 0 placeholder hashes; IAA canon, PRE_BUILD_STAGE_MODEL_CANON, AGCFPP-001, LIVING_AGENT_SYSTEM all present with valid SHA256 hashes |
| CORE-007: No placeholder content | ✅ PASS — `iaa_audit_token: IAA-session-053-20260407-PASS` is valid pre-populated reference format |
| CORE-008: Prohibitions block present (at least one CONSTITUTIONAL) | ✅ PASS — all 5 have at least one CONSTITUTIONAL prohibition |
| CORE-009: Merge gate interface present | ✅ PASS — all 5 have 3 required checks, parity_required: true, enforcement: BLOCKING |
| CORE-010: Tier 2 knowledge indexed | ✅ PASS — all 5 agent Tier 2 stubs present |
| CORE-011: Four-phase structure present | ✅ PASS — all 5 contracts have all four phases present |
| CORE-013: IAA invocation evidence | ✅ PASS — PREHANDOVER proof present with valid IAA token reference |
| CORE-014: No class exemption claim | ✅ PASS |
| CORE-015: Session memory present | ✅ PASS — session-053-20260407.md confirmed present |
| CORE-016: IAA verdict evidenced (§4.3b) | ✅ PASS — First Invocation Exception: token file being created this session |
| CORE-017: No unauthorized .github/agents/ modifications | ✅ PASS — producing agent is CodexAdvisor-agent with CS2 authorization (Issue #1257 by @APGI-cmy) |
| CORE-018: Complete evidence artifact sweep | ✅ PASS — all evidence present; first invocation exception for token file |
| CORE-019: IAA token cross-verification | ✅ PASS — First Invocation Exception applies (session-053 wave1-20260321 is a different PR/agent) |
| CORE-020: Zero partial pass rule | ✅ APPLIED |
| CORE-021: Zero-severity-tolerance | ✅ APPLIED — CORE-012 failure reported; no severity downgrade permitted |
| CORE-022: Secret field naming compliance | ✅ PASS — no `secret:` pattern in changed agent file lines |
| CORE-023: Workflow integrity ripple | ✅ N/A — no workflow-adjacent files touched |
| CORE-024: PHASE_B_BLOCKING_TOKEN in token file | ✅ PASS — included below |
| FAIL-ONLY-ONCE A-001: IAA invocation evidence | ✅ PASS |
| FAIL-ONLY-ONCE A-002: No class exceptions | ✅ PASS |
| OVL-AC-001: Strategy alignment | ✅ PASS — changes align with PRE_BUILD_STAGE_MODEL_CANON.md v1.0.0 |
| OVL-AC-002: No contradictions | ✅ PASS |
| OVL-AC-003: Authority boundaries correct | ✅ PASS |
| OVL-AC-004: Delegation safety | ✅ PASS |
| OVL-AC-005: Four-phase structure | ✅ PASS |
| OVL-AC-006: Self-modification prohibition present | ❌ FAIL — CORE-012 (same finding — REJECTION-PACKAGE) |
| OVL-AC-007: Ripple/cross-agent impact | ✅ PASS — Issue #1257 explicitly scopes to 5 builder contracts |
| OVL-AC-ADM-001: PREHANDOVER proof exists | ✅ PASS |
| OVL-AC-ADM-002: Session memory exists | ✅ PASS |
| OVL-AC-ADM-003: Tier 2 stubs present | ✅ PASS — all 5 builder Tier 2 stubs confirmed |
| OVL-AC-ADM-004: Character count ≤ 30,000 | ✅ PASS |

---

**This PR must NOT be opened until all failures are resolved and IAA re-invoked.**

**R2 path**: CodexAdvisor adds SELF-MOD-* CONSTITUTIONAL prohibition entries to integration-builder, schema-builder, and ui-builder. All other changes are correct and require NO modification. IAA re-invoked for R2 verification.

**Note for CS2**: The CORE-012 gap is pre-existing in these three contracts (not introduced by this PR). If CS2 determines that a waiver is appropriate (e.g., these contracts already have equivalent protection via `lock_id` + `NO-CONTRACT-001` and this naming gap was accepted during the four-phase rollout), a written waiver in the R2 PREHANDOVER proof will allow IAA to pass CORE-012 in R2.

Adoption phase: PHASE_B_BLOCKING — hard gate ACTIVE

## ═══════════════════════════════════════

---

## PHASE_B_BLOCKING_TOKEN

`PHASE_B_BLOCKING_TOKEN: IAA-session-053-wave1-20260407-REJECT`

> This is a REJECTION-PACKAGE. The PHASE_B_BLOCKING_TOKEN reflects the rejection verdict. No merge permitted until IAA R2 issues ASSURANCE-TOKEN.

---

## Merge Gate Parity (§4.3)

| Check | Local Result |
|-------|-------------|
| YAML validation (all 5 contracts) | PASS ✅ |
| Character count ≤ 30,000 | PASS ✅ |
| Checklist compliance (applicable gates) | FAIL ❌ — CORE-012 failure on 3/5 contracts |
| Canon hash verification | PASS ✅ |
| No placeholder/stub content | PASS ✅ |
| No embedded Tier 2 content | PASS ✅ |

**Parity result**: FAIL — CORE-012 (self-modification lock missing) on integration-builder, schema-builder, ui-builder.

---

## Adoption Phase Modifier

**PHASE_B_BLOCKING**: This verdict is hard-blocking. REJECTION-PACKAGE prevents PR from being opened. No class exceptions. Stop-and-fix required.

---

## IAA Agent Identity

**Agent**: independent-assurance-agent
**Version**: 6.2.0
**Contract Version**: 2.4.0 (from session invocation)
**Independence Check**: CONFIRMED — IAA did not produce this work
**Authority**: CS2 ONLY (@APGI-cmy)
