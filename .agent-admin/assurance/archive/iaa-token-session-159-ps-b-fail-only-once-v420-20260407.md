# IAA Assurance Token — Session 159 — PS-B: FAIL-ONLY-ONCE v4.2.0

**Artifact Type**: ASSURANCE-TOKEN
**Session ID**: session-159
**Wave**: ps-b-fail-only-once-v420-20260407
**Branch**: copilot/ps-b-foreman-fail-only-once
**Issue**: maturion-isms#1268
**Date**: 2026-04-07
**IAA Agent**: independent-assurance-agent v6.2.0 / contract v2.4.0
**Producing Agent**: foreman-v2-agent v6.2.0 (contract 2.9.0)
**PR Category**: CANON_GOVERNANCE (KNOWLEDGE_GOVERNANCE wave — Foreman Tier 2)
**Adoption Phase**: PHASE_B_BLOCKING

---

PHASE_B_BLOCKING_TOKEN: IAA-session-159-ps-b-fail-only-once-v420-20260407-PASS

---

## Verdict

═══════════════════════════════════════
ASSURANCE-TOKEN
PR: copilot/ps-b-foreman-fail-only-once (maturion-isms#1268)
All checks PASS. Merge gate parity: PASS.
Merge permitted (subject to CS2 approval).
Token reference: IAA-session-159-ps-b-fail-only-once-v420-20260407-PASS
Adoption phase: PHASE_B_BLOCKING — hard gate ACTIVE
═══════════════════════════════════════

---

## Prior Rejection Reference

Prior rejection: `.agent-admin/assurance/iaa-rejection-session-159-ps-b-fail-only-once-v420-20260407.md`
All 8 rejection findings (F-01 through F-08) verified RESOLVED.

---

## Checks Executed

### FAIL-ONLY-ONCE Learning Checks
| Check | Result |
|-------|--------|
| A-001 invocation evidence (PREHANDOVER proof present) | ✅ PASS — committed at 2763d2f |
| A-002 no-class-exceptions | ✅ PASS — Foreman class covered |

### FFA Structural Integrity Checks (FFA-SIC)
| Check | Result |
|-------|--------|
| FFA-SIC-001: No duplicate A-rule IDs | ✅ PASS — A-001–A-019, A-027–A-038, all unique |
| FFA-SIC-002: Renumbering correct (old A-033→A-036, A-034→A-037, A-035→A-038) | ✅ PASS — verified in file |
| FFA-SIC-003: New rules at correct IDs (A-033, A-034, A-035) | ✅ PASS — confirmed |
| FFA-SIC-004: Namespace Note accurate (A-001–A-038 range) | ✅ PASS — present and accurate |
| FFA-SIC-005: A-019 present (ARTIFACT-IMMUTABILITY canonical A-19 layer-down) | ✅ PASS |
| FFA-SIC-006: Cross-references to A-036/A-037/A-038 updated throughout | ✅ PASS |

### FFA Rule Quality Checks (FFA-RQC)
| Check | Result |
|-------|--------|
| FFA-RQC-001: A-033 CEREMONY-FILES-IN-SCOPE-DECLARATION clear and actionable | ✅ PASS |
| FFA-RQC-002: A-034 CANON-INVENTORY-UPDATE-MANDATORY clear and actionable | ✅ PASS |
| FFA-RQC-003: A-035 DELEGATION-ISSUE-REQUIRED clear; S-025 REMEDIATED | ✅ PASS |
| FFA-RQC-004: No duplication between A-033/034/035 and any existing rule | ✅ PASS |
| FFA-RQC-005: A-019 does not duplicate A-028 (complementary, not duplicate) | ✅ PASS |
| FFA-RQC-006: All cited rule IDs resolve (A-036/037/038 referenced in incident log) | ✅ PASS |

### FFA Version/Index Checks (FFA-VIC)
| Check | Result |
|-------|--------|
| FFA-VIC-001: Header = 4.2.0 | ✅ PASS — `**Version**: 4.2.0` confirmed |
| FFA-VIC-002: Version history entry for 4.2.0 present | ✅ PASS |
| FFA-VIC-003: index.md updated to v2.5.0 | ✅ PASS — `**Knowledge Version**: 2.5.0` confirmed |
| FFA-VIC-004: Footer last-updated = 2026-04-07 | ✅ PASS |

### FFA Ceremony/Evidence Checks (FFA-CER)
| Check | Result |
|-------|--------|
| FFA-CER-001: PREHANDOVER proof present and committed | ✅ PASS — 2763d2f |
| FFA-CER-002: Session memory present and committed | ✅ PASS — 2763d2f |
| FFA-CER-003: IAA Pre-Brief committed BEFORE changes (2c398fe) | ✅ PASS |
| FFA-CER-004: Pre-IAA Commit Gate section present in PREHANDOVER proof | ✅ PASS |
| FFA-CER-005: SCOPE_DECLARATION.md cleared (A-029) and rewritten for PS-B wave | ✅ PASS |
| FFA-CER-006: Rejection artifact exists (F-01 through F-08 all RESOLVED) | ✅ PASS |

### Additional Checks
| Check | Result |
|-------|--------|
| PS-B-06 completion marker convention added to Section 2 header | ✅ PASS — `[ ]`/`[x]` present |
| S-025 status = REMEDIATED (codified as A-035) | ✅ PASS |
| Merge gate parity (KNOWLEDGE_GOVERNANCE — no compiled code) | ✅ PASS |
| Independence: IAA did not produce any artifact in this PR | ✅ CONFIRMED |

### Totals
- FAIL-ONLY-ONCE learning checks: 2/2 PASS
- Core invariants: 22/22 PASS
- Merge gate parity: PASS
- **Total: 24 checks, 24 PASS, 0 FAIL**

---

## Token Update Ceremony (§4.3b)

Token file written: `.agent-admin/assurance/iaa-token-session-159-ps-b-fail-only-once-v420-20260407.md`
PHASE_B_BLOCKING_TOKEN: IAA-session-159-ps-b-fail-only-once-v420-20260407-PASS
PREHANDOVER proof: unchanged (immutable post-commit — per §4.3b).
