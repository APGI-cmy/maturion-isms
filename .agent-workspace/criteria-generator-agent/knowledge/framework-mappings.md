# Framework Mappings — Stub v1.0.0

**Agent:** criteria-generator-agent  
**Tier:** 2 (Cached / File-Based)  
**Status:** STUB — Phase 3 MVP  
**Authority:** CS2 (Johan Ras)  
**Date:** 2026-02-21

> **STUB NOTICE**: This knowledge base file is a placeholder. Full content to be authored in Phase 3 implementation sprint.

---

## Purpose

Provides the framework mapping rules used by the criteria-generator-agent to automatically cross-reference extracted criteria against known compliance framework control identifiers.

---

## Scope (Planned)

### Supported Frameworks and Mapping Anchors

| Framework | Version | Mapping Anchor | Status |
|-----------|---------|----------------|--------|
| ISO 27001 | 2022 | Annex A control IDs (e.g., A.5.1) | Planned Phase 3 |
| NIST CSF | 2.0 | Subcategory IDs (e.g., PR.AC-1) | Planned Phase 3 |
| PCI-DSS | v4 | Requirement IDs (e.g., Req 8.2.1) | Planned Phase 3 |
| SOC 2 | 2017 | TSC reference (e.g., CC6.1) | Planned Phase 3 |
| LDCS | Current | Section and loss category identifiers | Planned Phase 3 |

### Mapping Rule Structure (Planned)
```yaml
mapping_rule:
  trigger_keywords: [keyword list from extracted criteria text]
  target_framework: ISO 27001
  target_control_id: A.8.2
  target_control_name: "Information classification"
  confidence: high | medium | low
  rationale: "Keywords match classification/labelling requirements"
```

### Auto-Mapping Logic (Planned)
1. Tokenise extracted criteria text
2. Match against framework keyword index (built from authoritative framework text)
3. Select best-match control(s) by cosine similarity
4. Apply confidence threshold (discard < low confidence)
5. Flag ambiguous matches for human review

---

## Pointers

- **Tier 1 (live):** `apps/mat/api/criteria/generate/**`
- **Tier 3 (Supabase):** `supabase:table=criteria_embeddings` *(stub — Phase 4)*
- **Used by:** `mat-specialist` (compliance-mapping.md)
- **Constitutional reference:** `Maturion/maturion-world-model.md`

---

**Authority:** CS2 | **Status:** STUB | **Phase:** 3 MVP | **Date:** 2026-02-21
