# Control Library — Stub v1.0.0

**Agent:** risk-platform-agent  
**Tier:** 2 (Cached / File-Based)  
**Status:** STUB — Phase 3 MVP  
**Authority:** CS2 (Johan Ras)  
**Date:** 2026-02-21

> **STUB NOTICE**: This knowledge base file is a placeholder. Full content to be authored in Phase 3 implementation sprint.

---

## Purpose

Provides a reference library of security and compliance controls used by the risk-platform-agent when evaluating control effectiveness and mapping controls to risks.

---

## Scope (Planned)

### Control Frameworks Covered
- ISO 27001:2022 — Annex A controls
- NIST CSF 2.0 — Identify / Protect / Detect / Respond / Recover
- PCI-DSS v4 — Requirements 1–12
- SOC 2 — Trust Services Criteria (Security, Availability, Confidentiality, Processing Integrity, Privacy)
- CIS Controls v8 — Implementation Groups 1–3

### Control Attributes (Per Entry)
- Control ID and name
- Framework source (ISO / NIST / PCI / SOC2 / CIS)
- Control type (preventive / detective / corrective)
- Implementation complexity (low / medium / high)
- Effectiveness rating (when assessed)
- Mapped risks and threats

---

## Pointers

- **Tier 1 (live):** `apps/pit/api/risks/**`
- **Tier 3 (Supabase):** `supabase:table=vulnerabilities` *(stub — Phase 4)*
- **Constitutional reference:** `Maturion/maturion-world-model.md`

---

**Authority:** CS2 | **Status:** STUB | **Phase:** 3 MVP | **Date:** 2026-02-21
