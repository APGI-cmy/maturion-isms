# IAA Core Invariants Checklist

**Agent**: independent-assurance-agent
**Version**: 4.1.0
**Status**: ACTIVE
**Last Updated**: 2026-04-28
**Authority**: CS2 (Johan Ras / @APGI-cmy)

---

## Purpose

This checklist defines the core invariants that IAA evaluates at session time. Per the 90/10 restructuring (CS2 directive — maturion-isms#1354), mechanical checks have moved to CI. IAA retains only substance-gate invariants.

---

## IAA-Retained Core Invariants

These 4 checks are applied on every qualifying PR invocation. They are substance gates that require human-grade judgment and cannot be reduced to mechanical CI checks.

### CORE-020 — Zero Partial Pass Rule

| Field | Value |
|-------|-------|
| **Check ID** | CORE-020 |
| **Check Name** | Zero partial pass rule |
| **Description** | Any core or overlay check that cannot be verified due to missing, blank, or unverifiable evidence = REJECTION-PACKAGE for that check. No assumed passes. Absence of evidence = failing check. A PR with partial evidence must not receive ASSURANCE-TOKEN under any category or class. |
| **Applies To** | ALL |
| **Failure Action** | REJECTION-PACKAGE |

**Why this stays with IAA**: Partial-pass detection requires contextual judgment — determining whether evidence is genuinely present vs. superficially present but substantively empty. CI can check file existence but cannot evaluate evidence quality.

### CORE-021 — Zero-Severity-Tolerance

| Field | Value |
|-------|-------|
| **Check ID** | CORE-021 |
| **Check Name** | Zero-severity-tolerance |
| **Description** | Any finding identified during the assurance review — regardless of perceived severity, wording, or delivery size — MUST produce REJECTION-PACKAGE. Prohibited: using terms "minor", "trivial", "cosmetic", "small", "negligible", "low-impact", "soft-pass", or "acceptable" to characterise a finding as passable. The only valid exception is an explicit written CS2 waiver quoted verbatim in the output. See `IAA_ZERO_SEVERITY_TOLERANCE.md` for full operational guidance. |
| **Applies To** | ALL |
| **Failure Action** | REJECTION-PACKAGE |

**Why this stays with IAA**: Severity classification requires judgment. CI cannot determine whether a finding is being minimised through language. This is an IAA behavioral invariant, not a file-existence check.

### CORE-026 — Acceptance-Criteria Evidence Matrix

| Field | Value |
|-------|-------|
| **Check ID** | CORE-026 |
| **Check Name** | Acceptance-Criteria Evidence Matrix complete |
| **Description** | Before issuing any PASS token, IAA must extract every acceptance criterion from the governing issue and map each to independently verified hard evidence. The matrix must be present in the IAA verdict output (iaa-wave-record `## IAA Assurance Verdict` section). Any non-waived criterion without a hard evidence reference (CI run URL, log, diff, hash, schema query, runtime response, or health check) = REJECTED. Agent statements, PREHANDOVER claims, QP claims, builder notes, and prior IAA summaries are claims, not evidence — they may point to evidence but are not evidence themselves. ACR-22 fires if matrix is absent or incomplete. Authority: §Evidence-First Assurance Mandate Rule 1 / INDEPENDENT_ASSURANCE_AGENT_CANON.md v1.13.0. |
| **Applies To** | ALL T1 and T2 PRs |
| **Failure Action** | REJECTION-PACKAGE (ACR-22) |

**Why this stays with IAA**: Mapping issue acceptance criteria to evidence requires reading the governing issue, understanding operational intent, and independently verifying the evidence chain. This cannot be mechanically automated.

### CORE-027 — Independent Risk Challenge

| Field | Value |
|-------|-------|
| **Check ID** | CORE-027 |
| **Check Name** | Independent Risk Challenge completed |
| **Description** | Before issuing any PASS token, IAA must complete the five-question Independent Risk Challenge defined in §Evidence-First Assurance Mandate Rule 6: (1) What could still fail after merge? (2) What evidence would prove it does not fail? (3) Is that evidence present? (4) Is there any contradiction between issue intent, architecture requirements, and PR evidence? (5) Would a reasonable production owner accept this as merge-ready? All five questions must have substantive answers — not template placeholders or single-word responses. If questions 3 or 5 answer NO, IAA must issue REJECTED or BLOCKED_PENDING_RUNTIME_EVIDENCE regardless of checklist completion. ACR-26 fires if challenge is absent or incomplete. Authority: §Evidence-First Assurance Mandate Rule 6 / INDEPENDENT_ASSURANCE_AGENT_CANON.md v1.13.0. |
| **Applies To** | ALL T1 and T2 PRs |
| **Failure Action** | REJECTION-PACKAGE (ACR-26) or appropriate BLOCKED verdict |

**Why this stays with IAA**: The Independent Risk Challenge requires out-of-the-box judgment — identifying risks not named by any existing checklist item. This is the core of independent assurance and cannot be delegated to CI.

---

## Checks Moved to CI

The following checks are now enforced by CI workflows `agent-contract-format-gate.yml` and `preflight-evidence-gate.yml`. IAA does not execute them at session time.

| Check ID | Check Name | CI Workflow |
|----------|-----------|-------------|
| CORE-001 | YAML frontmatter valid | `agent-contract-format-gate.yml` |
| CORE-002 | Agent version correct | `agent-contract-format-gate.yml` |
| CORE-003 | Contract version present | `agent-contract-format-gate.yml` |
| CORE-004 | Identity block complete | `agent-contract-format-gate.yml` |
| CORE-005 | Governance block present | `agent-contract-format-gate.yml` |
| CORE-006 | CANON_INVENTORY alignment | `agent-contract-format-gate.yml` |
| CORE-007 | No placeholder content | `agent-contract-format-gate.yml` |
| CORE-008 | Prohibitions block present | `agent-contract-format-gate.yml` |
| CORE-009 | Merge gate interface present | `agent-contract-format-gate.yml` |
| CORE-010 | Tier 2 knowledge indexed | `agent-contract-format-gate.yml` |
| CORE-011 | Four-phase structure present | `agent-contract-format-gate.yml` |
| CORE-012 | Self-modification lock present | `agent-contract-format-gate.yml` |
| CORE-013 | IAA invocation evidence | `preflight-evidence-gate.yml` |
| CORE-015 | Session memory present | `preflight-evidence-gate.yml` |
| CORE-016 | IAA verdict evidenced | `preflight-evidence-gate.yml` |
| CORE-018 | Complete evidence artifact sweep | `preflight-evidence-gate.yml` |
| CORE-019 | IAA token cross-verification | `preflight-evidence-gate.yml` |
| CORE-022 | Secret field naming compliance | `agent-contract-format-gate.yml` |
| CORE-023 | Workflow integrity ripple check | `preflight-evidence-gate.yml` |
| CORE-024 | PHASE_B_BLOCKING_TOKEN field | `preflight-evidence-gate.yml` |
| CORE-025 | Pre-Brief stage-readiness | `preflight-evidence-gate.yml` |

> **Note**: CORE-014 (no class exemption claim) and CORE-017 (no unauthorized .github/agents/ modifications) remain as IAA judgment calls embedded within the FAIL-ONLY-ONCE learning check (A-002 and Step 3.1 respectively). They are not separate checklist items but are covered by the FAIL-ONLY-ONCE attestation.

---

## Applying the Checklist

For CORE-020, CORE-021, CORE-026, and CORE-027:
1. Evaluate the PR artifacts against each check description
2. Record PASS or FAIL with specific evidence
3. Any FAIL → REJECTION-PACKAGE (no partial passes per CORE-020 itself)

**AMBIGUITY RULE**: If uncertain whether a check applies → apply it. The cost of a false REJECTION-PACKAGE is a fix request. The cost of a missed REJECTION-PACKAGE is a governance breach.

---

## Version History

| Version | Date | Change |
|---------|------|--------|
| 1.0.0 | 2026-02-25 | Initial STUB |
| 2.0.0 | 2026-02-28 | Fully populated from canon; CORE-016/017 added |
| 2.1.0 | 2026-03-01 | CORE-016: copy-paste-only requirement |
| 2.2.0 | 2026-03-02 | CORE-018/019 added; CORE-016 PENDING state |
| 2.3.0 | 2026-03-02 | CORE-007 PENDING carve-out |
| 2.4.0 | 2026-03-02 | CORE-021 zero-severity-tolerance added |
| 2.5.0 | 2026-03-03 | CORE-022 secret field naming |
| 2.6.0 | 2026-03-04 | CORE-016 §4.3b architecture update |
| 2.7.0 | 2026-03-04 | CORE-016/018/019 rewritten for §4.3b |
| 2.8.0 | 2026-03-04 | Orientation Mandate 90/10 codified |
| 2.9.0 | 2026-03-13 | CORE-023 workflow integrity ripple |
| 3.0.0 | 2026-04-07 | CORE-024/025 added |
| 4.0.0 | 2026-04-13 | 90/10 restructuring: retained CORE-020/021 only; all other checks moved to CI; Orientation Mandate and A-029 Architecture Alignment Note removed (now structural); authority: CS2 — maturion-isms#1354 |
| 4.1.0 | 2026-04-28 | Added CORE-026 (Acceptance-Criteria Evidence Matrix complete — §Evidence-First Assurance Mandate Rule 1 / ACR-22) and CORE-027 (Independent Risk Challenge — §Evidence-First Assurance Mandate Rule 6 / ACR-26); updated IAA-retained invariants count from 2 to 4; authority: CS2 — maturion-isms#1492 |

---

**Authority**: CS2 (Johan Ras) | **Living Agent System**: v6.2.0
