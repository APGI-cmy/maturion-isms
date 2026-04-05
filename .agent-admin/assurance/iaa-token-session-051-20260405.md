# IAA ASSURANCE-TOKEN — Session 051 (R2) — 2026-04-05

**IAA Session ID**: session-govpatch-session051-20260405-R2
**Date**: 2026-04-05
**IAA Version**: independent-assurance-agent v6.2.0 (contract 2.3.0)
**Adoption Phase**: PHASE_B_BLOCKING
**R1 Reference**: IAA-govpatch-session051-20260405-REJECTION (resolved)

---

## PR Under Review

**Branch**: copilot/lock-out-foreman-self-certification
**Commit verified**: 68733cec40b59d54f9726e195f3d79c81534b3e4
**Requested by**: CodexAdvisor-agent (session-051-20260405, R2 re-verification)
**Work produced by**: CodexAdvisor-agent, class: overseer
**Artifact scope**:
- `.github/agents/foreman-v2-agent.md` — YAML trigger expansion, NO-SELFCERT-001 prohibition, iaa_oversight rationale extension, byte-count trim to 29,911 bytes
- `.agent-workspace/CodexAdvisor-agent/knowledge/FAIL-ONLY-ONCE.md` — A-036 (SELF-CERTIFICATION-BANNED) + INC-IAA-SELFCERT-001 incident record
- `.agent-workspace/CodexAdvisor-agent/memory/PREHANDOVER-session-051-20260405.md`
- `.agent-workspace/CodexAdvisor-agent/memory/session-051-20260405.md`
- `.agent-admin/assurance/iaa-rejection-session-govpatch-session051-20260405.md` (R1 artifact — committed)
- `.agent-workspace/independent-assurance-agent/memory/session-govpatch-session051-20260405.md` (R1 session memory — committed)

**PR Category**: MIXED — AGENT_CONTRACT + KNOWLEDGE_GOVERNANCE
**CS2 Authorization**: Issue opened and assigned by @APGI-cmy — CONFIRMED

---

## Verdict

```
═══════════════════════════════════════
ASSURANCE-TOKEN

PR: copilot/lock-out-foreman-self-certification
    "CodexAdvisor: Lock Out Foreman Self-Certification of IAA Tokens
     — Surgical Contract & T2 Governance Patch"

All 49 checks PASS. Merge gate parity: PASS.

R1 REJECTION-PACKAGE (IAA-govpatch-session051-20260405-REJECTION):
All 5 cited failures VERIFIED RESOLVED:
  ✅ Failure 1 (CORE-018(a)/A-033): PREHANDOVER proof committed — confirmed in 68733ce
  ✅ Failure 2 (CORE-018(b)/A-033): Session memory committed — confirmed in 68733ce
  ✅ Failure 3 (A-021/CORE-018): All governance artifacts committed — commit 68733ce,
     working tree clean (git status --porcelain returns empty)
  ✅ Failure 4 (OVL-AC-007/A-023): Ripple/cross-agent assessment added to PREHANDOVER —
     full ## Ripple / Cross-Agent Assessment section with impact table and explicit
     "NO BLOCKING DOWNSTREAM CHANGES REQUIRED" verdict
  ✅ Failure 5 (OVL-AC-ADM-004): Contract trimmed to 29,911 bytes (< 30,000 byte limit)

Substance quality: EXCELLENT. NO-SELFCERT-001 with CONSTITUTIONAL enforcement
closes the Foreman self-certification loophole at the constitutional level.
Trigger expansion eliminates planning-wave exception pathway. iaa_oversight
rationale extension is precisely targeted and correct. A-036 + INC-IAA-SELFCERT-001
in CodexAdvisor FAIL-ONLY-ONCE correctly record the incident and prevention rule.

Merge permitted (subject to CS2 approval).
Token reference: IAA-session-051-20260405-PASS
Adoption phase: PHASE_B_BLOCKING — hard gate
═══════════════════════════════════════
```

---

## Check Summary (49/49 PASS)

### FAIL-ONLY-ONCE Learning (5/5 PASS)
| Rule | Check | Result |
|------|-------|--------|
| A-001 | IAA invocation evidence present | PASS ✅ |
| A-002 | No class exemption claimed | PASS ✅ |
| A-021 | Governance artifacts committed before invocation | PASS ✅ |
| A-023 | Ripple/cross-agent assessment present in PREHANDOVER | PASS ✅ |
| A-033 | PREHANDOVER and session memory committed to git | PASS ✅ |

### Core Invariants (22 PASS + 1 N/A)
| Check | Result |
|-------|--------|
| CORE-001 YAML valid | PASS ✅ |
| CORE-002 Agent version 6.2.0 | PASS ✅ |
| CORE-003 Contract version present | PASS ✅ |
| CORE-004 Identity block complete | PASS ✅ |
| CORE-005 Governance block present | PASS ✅ |
| CORE-006 CANON_INVENTORY alignment | PASS ✅ |
| CORE-007 No placeholder content | PASS ✅ |
| CORE-008 Prohibitions + CONSTITUTIONAL | PASS ✅ |
| CORE-009 Merge gate interface BLOCKING | PASS ✅ |
| CORE-010 Tier 2 knowledge indexed | PASS ✅ |
| CORE-011 Four-phase structure present | PASS ✅ |
| CORE-012 SELF-MOD-FM-001 CONSTITUTIONAL | PASS ✅ |
| CORE-013 IAA invocation evidence | PASS ✅ |
| CORE-014 No class exemption | PASS ✅ |
| CORE-015 Session memory present | PASS ✅ |
| CORE-016 IAA verdict evidenced (§4.3b) | PASS ✅ (First Token-Creation Exception — R2 post-rejection) |
| CORE-017 No unauthorised .github/agents/ modification | PASS ✅ |
| CORE-018 Complete evidence artifact sweep | PASS ✅ |
| CORE-019 IAA token cross-verification | PASS ✅ (First Token-Creation Exception — R2 post-rejection) |
| CORE-020 Zero partial pass rule | PASS ✅ |
| CORE-021 Zero-severity-tolerance | PASS ✅ |
| CORE-022 Secret field naming compliance | PASS ✅ |
| CORE-023 Workflow integrity ripple | N/A ✅ (no workflow-adjacent changes) |

### AC Steps (6 PASS + 1 N/A)
| Step | Result |
|------|--------|
| AC-01 AGCFPP-001 authorisation | PASS ✅ |
| AC-02 Protected components sweep | PASS ✅ |
| AC-03 Pre-approval scope | N/A ✅ (CS2 surgical patch, not layer-down) |
| AC-04 Tier placement discipline | PASS ✅ |
| AC-05 Cross-agent ripple assessment | PASS ✅ |
| AC-06 Core invariants (CORE-001 to CORE-023) | PASS ✅ |
| AC-07 AGENT_CONTRACT overlay | PASS ✅ |

### AGENT_CONTRACT Overlay (11/11 PASS)
| Check | Result |
|-------|--------|
| OVL-AC-001 Strategy alignment | PASS ✅ |
| OVL-AC-002 No contradictions | PASS ✅ |
| OVL-AC-003 Authority boundaries correct | PASS ✅ |
| OVL-AC-004 Delegation safety | PASS ✅ |
| OVL-AC-005 Four-phase structure | PASS ✅ |
| OVL-AC-006 Self-modification prohibition | PASS ✅ |
| OVL-AC-007 Ripple/cross-agent impact | PASS ✅ |
| OVL-AC-ADM-001 PREHANDOVER proof exists | PASS ✅ |
| OVL-AC-ADM-002 Session memory exists | PASS ✅ |
| OVL-AC-ADM-003 Tier 2 stub present | PASS ✅ |
| OVL-AC-ADM-004 Character count ≤ 30,000 (29,911) | PASS ✅ |

### KNOWLEDGE_GOVERNANCE Overlay (4/4 PASS)
| Check | Result |
|-------|--------|
| OVL-KG-001 Rule clarity (A-036) | PASS ✅ |
| OVL-KG-002 Triggered by real incident | PASS ✅ |
| OVL-KG-003 No duplication | PASS ✅ |
| OVL-KG-004 Cross-reference consistency | PASS ✅ |

### PRE_BRIEF_ASSURANCE (1/1 PASS)
| Check | Result |
|-------|--------|
| OVL-INJ-001 Pre-Brief artifact exists | PASS ✅ |

### Merge Gate Parity (3/3 PASS)
| Check | Result |
|-------|--------|
| merge-gate/verdict | PASS ✅ |
| governance/alignment | PASS ✅ |
| stop-and-fix/enforcement | PASS ✅ |

---

## PHASE_B_BLOCKING_TOKEN

```
PHASE_B_BLOCKING_TOKEN: IAA-session-051-20260405-PASS | PHASE_B_BLOCKING | independent-assurance-agent v6.2.0 | 2026-04-05
```

> ⚠️ This field is contractually producible ONLY by independent-assurance-agent operating under PHASE_B_BLOCKING enforcement. Its presence signals that an IAA tool call was genuinely executed in this session. IAA-SELF-CERT-001 and IAA-PHASE-A-BYPASS-001 CI guards enforce this requirement mechanically.

---

## Governance Observations (non-blocking)

1. **CodexAdvisor session memory `iaa_invocation_result` inaccuracy**: The committed session-051-20260405.md initially recorded the pre-IAA invocation status; the R2-updated session memory correctly reflects the R1 REJECTION-PACKAGE and R2 ASSURANCE-TOKEN outcomes. The R1 rejection artifact independently documents the true R1 outcome.

2. **expected_artifacts trim note**: Removing INDEPENDENT_ASSURANCE_AGENT_CANON.md, FOREMAN_AUTHORITY_AND_SUPERVISION_MODEL.md, THREE_TIER_AGENT_KNOWLEDGE_ARCHITECTURE.md, and ECOSYSTEM_VOCABULARY.md from foreman-v2-agent.md expected_artifacts reduces explicit governance dependency declarations. These files remain in CANON_INVENTORY with valid hashes. The foreman's iaa_oversight block, NO-SELFCERT-001 prohibition, and four-phase IAA invocation requirements continue to enforce compliance regardless of the expected_artifacts list content. Non-blocking governance posture observation.

---

**Authority**: CS2 (Johan Ras / @APGI-cmy)
**IAA Version**: independent-assurance-agent v6.2.0
**Token reference**: IAA-session-051-20260405-PASS
**Issued**: 2026-04-05
