# Compliance Mapping — Stub v1.0.0

**Agent:** mat-specialist  
**Tier:** 2 (Cached / File-Based)  
**Status:** STUB — Phase 3 MVP  
**Authority:** CS2 (Johan Ras)  
**Date:** 2026-02-21

> **STUB NOTICE**: This knowledge base file is a placeholder. Full content to be authored in Phase 3 implementation sprint.

---

## Purpose

Provides cross-reference mappings between MAT audit criteria and major compliance frameworks, enabling the mat-specialist to answer compliance questions and guide framework-specific audits.

---

## Scope (Planned)

### Supported Frameworks
| Framework | Version | Status |
|-----------|---------|--------|
| ISO 27001 | 2022 | Planned Phase 3 |
| NIST CSF | 2.0 | Planned Phase 3 |
| PCI-DSS | v4 | Planned Phase 3 |
| SOC 2 | 2017 | Planned Phase 3 |
| LDCS | Current | Planned Phase 3 |

### Mapping Structure (Planned)
```
Criteria ID ↔ ISO 27001 Control ↔ NIST CSF Subcategory ↔ PCI Requirement ↔ SOC2 TSC
```

### Use Cases
- "Which ISO 27001 controls does this domain cover?"
- "Map our audit findings to PCI-DSS requirements"
- "Show NIST CSF gap analysis for Access Control domain"
- "Generate compliance coverage report for SOC 2 Type II"

---

## Pointers

- **Tier 1 (live):** `apps/mat/api/criteria/**`
- **Tier 3 (Supabase):** `supabase:table=criteria_embeddings` *(produced by criteria-generator-agent)*
- **Constitutional reference:** `Maturion/maturion-world-model.md`
- **Pipeline dependency:** criteria-generator-agent must process framework documents first

---

**Authority:** CS2 | **Status:** STUB | **Phase:** 3 MVP | **Date:** 2026-02-21
