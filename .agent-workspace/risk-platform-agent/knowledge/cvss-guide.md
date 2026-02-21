# CVSS Scoring Guide — Stub v1.0.0

**Agent:** risk-platform-agent  
**Tier:** 2 (Cached / File-Based)  
**Status:** STUB — Phase 3 MVP  
**Authority:** CS2 (Johan Ras)  
**Date:** 2026-02-21

> **STUB NOTICE**: This knowledge base file is a placeholder. Full content to be authored in Phase 3 implementation sprint.

---

## Purpose

Provides CVSS (Common Vulnerability Scoring System) guidance used by the risk-platform-agent to score vulnerabilities consistently across the MATURION ISMS platform.

---

## Scope (Planned)

### CVSS v3.1 Base Score Metrics
- **Attack Vector (AV):** Network / Adjacent / Local / Physical
- **Attack Complexity (AC):** Low / High
- **Privileges Required (PR):** None / Low / High
- **User Interaction (UI):** None / Required
- **Scope (S):** Unchanged / Changed
- **Confidentiality Impact (C):** None / Low / High
- **Integrity Impact (I):** None / Low / High
- **Availability Impact (A):** None / Low / High

### Score Ranges
| Score | Rating |
|-------|--------|
| 0.0   | None   |
| 0.1–3.9 | Low  |
| 4.0–6.9 | Medium |
| 7.0–8.9 | High  |
| 9.0–10.0 | Critical |

### Temporal and Environmental Scores (Planned Phase 4)
- Exploitability (E), Remediation Level (RL), Report Confidence (RC)
- Environmental modifiers for Maturion tenant context

---

## Pointers

- **NVD CVSS Calculator:** https://nvd.nist.gov/vuln-metrics/cvss *(external — Phase 4)*
- **Tier 3 (Supabase):** `supabase:table=vulnerabilities` *(stub — Phase 4)*

---

**Authority:** CS2 | **Status:** STUB | **Phase:** 3 MVP | **Date:** 2026-02-21
