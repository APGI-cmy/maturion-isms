# LEGACY BOUNDARY — independent-assurance-agent

**Date**: 2026-03-04
**Authority**: CS2 (Johan Ras / @APGI-cmy)
**Purpose**: Marks the boundary between legacy and current-governance session memory.

---

## ===========================================================
##  LEGACY LINE — 2026-03-04
##  EVERYTHING ABOVE/BEFORE THIS DATE IS LEGACY
##  IAA: DO NOT check session files dated before 2026-03-04 for compliance
##  with current canon (A-029, §4.3b, IAA_PRE_BRIEF_PROTOCOL v1.1.0)
##  Legacy files are retained for audit trail only
## ===========================================================

## What This Means

All IAA session files dated **before 2026-03-04** are **LEGACY**.

- They pre-date AGENT_HANDOVER_AUTOMATION.md v1.1.3 §4.3b (artifact immutability)
- They pre-date IAA_PRE_BRIEF_PROTOCOL.md v1.1.0
- They pre-date FAIL-ONLY-ONCE A-029 (INC-PREHANDOVER-MUTATE-001)
- The IAA MUST NOT apply current A-029 / §4.3b checks to legacy sessions
- Legacy PREHANDOVER proofs with `iaa_audit_token: PENDING` are grandfathered — this pattern is only a violation for sessions dated 2026-03-04 and later

## Current Boundary

**First compliant session**: Next IAA session dated 2026-03-04 or later
**Last legacy session**: All IAA sessions dated 2026-03-03 and earlier (up to session-128)

---

*Authority: CS2 | AGENT_HANDOVER_AUTOMATION.md v1.1.3 | IAA_PRE_BRIEF_PROTOCOL.md v1.1.0 | Effective: 2026-03-04*