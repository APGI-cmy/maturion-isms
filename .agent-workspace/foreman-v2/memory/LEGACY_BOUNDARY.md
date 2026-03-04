# LEGACY BOUNDARY — foreman-v2

**Date**: 2026-03-04  
**Authority**: CS2 (Johan Ras / @APGI-cmy)  
**Purpose**: Marks the boundary between legacy and current-governance session memory.

---

## ═══════════════════════════════════════════════════════════
##  LEGACY LINE — 2026-03-04
##  EVERYTHING ABOVE/BEFORE THIS DATE IS LEGACY
##  IAA and agents: DO NOT check session files dated before 2026-03-04
##  Legacy files are retained for audit trail only — they are NOT governance-compliant
##  under the current canon (LIVING_AGENT_SYSTEM v6.2.0, AGENT_HANDOVER_AUTOMATION v1.1.3)
## ═══════════════════════════════════════════════════════════

## What This Means

All session memory files in `.agent-workspace/foreman-v2/memory/` with dates **before 2026-03-04** are **LEGACY**.

- They were created under prior governance versions
- They do NOT conform to current PREHANDOVER proof immutability rules (§4.3b)
- They do NOT use the current iaa_audit_token format
- The IAA MUST NOT check legacy files for compliance against current canon
- The Foreman MUST NOT reference legacy session files as evidence in current-wave PREHANDOVER proofs

## Current Boundary

**First compliant session**: `session-045-20260304.md` (CodexAdvisor) / next foreman session after 2026-03-04  
**Last legacy session**: All sessions dated 2026-03-03 and earlier

## Legacy Files (do not audit)

All files matching `.agent-workspace/foreman-v2/memory/session-0*.md` with date ≤ 2026-03-03.

---

*Authority: CS2 | LIVING_AGENT_SYSTEM.md v6.2.0 | Effective: 2026-03-04*