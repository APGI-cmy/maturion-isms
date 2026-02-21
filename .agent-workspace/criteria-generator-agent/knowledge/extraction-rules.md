# Extraction Rules — Stub v1.0.0

**Agent:** criteria-generator-agent  
**Tier:** 2 (Cached / File-Based)  
**Status:** STUB — Phase 3 MVP  
**Authority:** CS2 (Johan Ras)  
**Date:** 2026-02-21

> **STUB NOTICE**: This knowledge base file is a placeholder. Full content to be authored in Phase 3 implementation sprint.

---

## Purpose

Defines the rules used by the criteria-generator-agent to extract Domain → MPS → Criteria structures from uploaded standards documents (LDCS, ISO, NIST, PCI-DSS, SOC2, etc.).

---

## Scope (Planned)

### Extraction Pipeline
```
Input document (PDF / DOCX / Markdown)
  → document-parser-agent [raw text extraction + structural detection]
  → criteria-generator-agent [extraction rules applied below]
       ├─ Identify domain headings
       ├─ Identify MPS sections
       ├─ Extract individual criteria statements
       ├─ Assign metadata (framework, evidence type, maturity level hints)
       └─ Output structured criteria objects
  → Supabase criteria_embeddings write
```

### Extraction Rule Types (Planned)
1. **Heading-pattern rules** — Detect domain / MPS section boundaries using heading level and keywords
2. **Criteria-statement rules** — Identify actionable statements ("shall", "must", "is required to")
3. **Evidence-hint rules** — Detect evidence type cues ("document", "record", "test", "observation")
4. **Framework-mapping rules** — Map extracted criteria to known framework control IDs (ISO, NIST, PCI)
5. **Deduplication rules** — Merge near-duplicate criteria from multiple source documents

### LDCS-Specific Rules (Planned)
- LDCS format recognition (section numbering, mandatory/advisory indicators)
- Loss category → Domain mapping
- Minimum performance standard identification

---

## Pointers

- **Tier 1 (live):** `apps/mat/api/criteria/generate/**`
- **Tier 3 (Supabase):** `supabase:table=criteria_embeddings` *(write target — Phase 4)*
- **Pipeline dependency:** Receives structured input from `document-parser-agent`
- **Constitutional reference:** `Maturion/maturion-world-model.md`

---

**Authority:** CS2 | **Status:** STUB | **Phase:** 3 MVP | **Date:** 2026-02-21
