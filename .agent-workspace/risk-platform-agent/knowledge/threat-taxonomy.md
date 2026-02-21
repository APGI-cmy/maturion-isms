# Threat Taxonomy — Stub v1.0.0

**Agent:** risk-platform-agent  
**Tier:** 2 (Cached / File-Based)  
**Status:** STUB — Phase 3 MVP  
**Authority:** CS2 (Johan Ras)  
**Date:** 2026-02-21

> **STUB NOTICE**: This knowledge base file is a placeholder. Full content to be authored in Phase 3 implementation sprint.

---

## Purpose

Defines the threat taxonomy used by the risk-platform-agent to classify and categorise threats across all MATURION ISMS apps.

---

## Scope (Planned)

### Threat Categories
- **Insider threats** — malicious/negligent employees, contractors, privileged users
- **External threats** — cybercriminals, nation-state actors, hacktivists
- **Cyber threats** — malware, ransomware, phishing, DDoS, supply chain attacks
- **Physical threats** — physical access, environmental hazards, hardware theft
- **Third-party / supply chain threats** — vendor compromise, open-source risk

### Taxonomy Structure (Planned)
- Category → Sub-category → Attack pattern → Indicator of compromise
- Alignment with MITRE ATT&CK framework (Phase 4 integration)
- NVD CVE linkage (Phase 4 integration)

---

## Pointers

- **Tier 1 (live):** `apps/pit/api/risks/**`
- **Tier 3 (Supabase):** `supabase:table=threat_intelligence` *(stub — Phase 4)*
- **Constitutional reference:** `Maturion/maturion-threat-intelligence-framework.md`
- **External:** NVD, MITRE ATT&CK *(Phase 4 stubs)*

---

**Authority:** CS2 | **Status:** STUB | **Phase:** 3 MVP | **Date:** 2026-02-21
