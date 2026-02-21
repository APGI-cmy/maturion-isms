# Domain Model — Stub v1.0.0

**Agent:** mat-specialist  
**Tier:** 2 (Cached / File-Based)  
**Status:** STUB — Phase 3 MVP  
**Authority:** CS2 (Johan Ras)  
**Date:** 2026-02-21

> **STUB NOTICE**: This knowledge base file is a placeholder. Full content to be authored in Phase 3 implementation sprint.

---

## Purpose

Documents the MAT domain model — the complete set of audit domains, their relationships, and their role within the Maturion ISMS maturity assessment framework.

---

## Scope (Planned)

### MATURION ISMS Audit Domains (Illustrative — to be finalised from LDCS)
| Domain ID | Domain Name | Description |
|-----------|-------------|-------------|
| DOM-01 | Information Security | Protection of information assets |
| DOM-02 | Access Control | Identity and access management |
| DOM-03 | Incident Management | Detection, response, and recovery |
| DOM-04 | Risk Management | Risk identification, assessment, treatment |
| DOM-05 | Compliance | Regulatory and framework adherence |
| DOM-06 | Physical Security | Physical access and environmental controls |
| DOM-07 | Business Continuity | BCP/DRP and resilience |
| DOM-08 | Supplier Management | Third-party risk and assurance |

> **Note:** Actual domain structure is derived from the LDCS document set via `criteria-generator-agent`.

### Domain Attributes
- Domain ID (stable identifier)
- Domain name and description
- Contained MPSs (references)
- Applicable compliance frameworks
- Default auditor role required

### Maturity Levels (Per Domain)
- Level 1: Initial / Ad hoc
- Level 2: Managed
- Level 3: Defined
- Level 4: Quantitatively Managed
- Level 5: Optimising

---

## Pointers

- **Tier 1 (live):** `apps/mat/api/criteria/**`
- **Tier 3 (Supabase):** `supabase:table=criteria` *(stub — Phase 4)*
- **LDCS source:** Processed via `criteria-generator-agent` pipeline
- **Constitutional reference:** `Maturion/maturion-world-model.md`

---

**Authority:** CS2 | **Status:** STUB | **Phase:** 3 MVP | **Date:** 2026-02-21
