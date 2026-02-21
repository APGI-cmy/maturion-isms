# Chunking Strategy — Stub v1.0.0

**Agent:** criteria-generator-agent  
**Tier:** 2 (Cached / File-Based)  
**Status:** STUB — Phase 3 MVP  
**Authority:** CS2 (Johan Ras)  
**Date:** 2026-02-21

> **STUB NOTICE**: This knowledge base file is a placeholder. Full content to be authored in Phase 3 implementation sprint.

---

## Purpose

Defines the text chunking strategy used by the criteria-generator-agent when preparing extracted criteria for embedding generation and Supabase write.

---

## Scope (Planned)

### Chunking Objectives
- Produce chunks that are semantically coherent and self-contained
- Optimise chunk size for embedding model context window
- Preserve Domain → MPS → Criteria traceability metadata in each chunk
- Minimise information loss at chunk boundaries

### Chunking Strategy Options (Planned)

| Strategy | Description | Use Case |
|----------|-------------|----------|
| Fixed-size | Split at N tokens regardless of structure | Baseline / fallback |
| Sentence-boundary | Split at sentence end, max N tokens | General text |
| Criteria-unit | One chunk = one criteria statement + metadata | Preferred for MAT |
| MPS-section | One chunk = one MPS with all its criteria | High-level queries |
| Sliding window | Overlapping chunks for boundary coverage | Dense documents |

### Preferred Strategy: Criteria-Unit Chunking
Each chunk contains:
```json
{
  "domain_id": "DOM-01",
  "domain_name": "Information Security",
  "mps_id": "MPS-01-03",
  "mps_name": "Access Control",
  "criteria_id": "CRIT-01-03-07",
  "criteria_text": "All privileged accounts must use multi-factor authentication.",
  "evidence_type": "test",
  "maturity_level_hint": 3,
  "framework_refs": ["ISO:A.8.2", "NIST:PR.AC-1"],
  "source_document": "LDCS-2024-v3.pdf",
  "chunk_index": 42
}
```

### Embedding Model Target (Planned)
- Model: `text-embedding-3-small` (OpenAI) or equivalent
- Dimensions: 1536
- Max input tokens: 8191

---

## Pointers

- **Tier 1 (live):** `apps/mat/api/criteria/generate/**`
- **Tier 3 (Supabase write):** `supabase:table=criteria_embeddings` *(stub — Phase 4)*
- **Embedding API:** `EMBEDDING_API_URL` environment variable *(stub)*
- **Pipeline dependency:** Receives from `extraction-rules.md` step; outputs to Supabase

---

**Authority:** CS2 | **Status:** STUB | **Phase:** 3 MVP | **Date:** 2026-02-21
