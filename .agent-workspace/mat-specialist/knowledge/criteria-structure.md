# Criteria Structure — Stub v1.0.0

**Agent:** mat-specialist  
**Tier:** 2 (Cached / File-Based)  
**Status:** STUB — Phase 3 MVP  
**Authority:** CS2 (Johan Ras)  
**Date:** 2026-02-21

> **STUB NOTICE**: This knowledge base file is a placeholder. Full content to be authored in Phase 3 implementation sprint.

---

## Purpose

Defines the Domain → MPS → Criteria hierarchical structure used within MAT, which the mat-specialist uses to navigate, interpret, and explain audit criteria to users.

---

## Scope (Planned)

### Hierarchy

```
Domain (e.g., Information Security)
  └─ MPS — Minimum Performance Standard (e.g., Access Control)
       └─ Criteria (e.g., "All privileged accounts must use MFA")
            ├─ Evidence Requirement
            ├─ Scoring Guidance (Levels 1–5)
            └─ Compliance Mapping (ISO 27001 / NIST / PCI / SOC2)
```

### Criteria Attributes
- Criteria ID (unique, immutable once published)
- Domain reference
- MPS reference
- Description (what must be demonstrated)
- Evidence type (document / observation / interview / test)
- Maturity level thresholds (Level 1 = basic, Level 5 = optimised)
- Compliance framework cross-references

### MPS Structure
- Each domain contains 1–N MPSs
- Each MPS has a clear performance objective
- MPS coverage determines domain maturity band

---

## Pointers

- **Tier 1 (live):** `apps/mat/api/criteria/**`
- **Tier 3 (Supabase):** `supabase:table=criteria` *(stub — Phase 4)*
- **Embedding source:** `supabase:table=criteria_embeddings` *(produced by criteria-generator-agent)*
- **Constitutional reference:** `Maturion/maturion-world-model.md`

---

**Authority:** CS2 | **Status:** STUB | **Phase:** 3 MVP | **Date:** 2026-02-21
