# Domain Flag Index

**Purpose:** Machine-readable mapping of trigger words/phrases → specialist agent → knowledge base location  
**Managed by:** Maturion Orchestrator (read-only at runtime; updated via CS2-approved PR)  
**Authority:** CS2 (Johan Ras)  
**Version:** 1.0.0 (Phase 3.5 — MAT domain initial population)  
**Date:** 2026-02-21

> **Protocol:** At query time, the orchestrator tokenises the user's input, matches against `trigger_phrases`, and routes to the mapped `specialist`. If `knowledge_status` is `STUB`, the graceful degradation protocol applies (see `maturion-agent.md` Phase 3).

---

## Index Structure

Each entry follows this schema:

```
domain:         Human-readable domain name
specialist:     Agent ID to delegate to
trigger_phrases: [list of keywords / short phrases]
knowledge_base:
  tier1_live:   Path to live/runtime knowledge (DB, API)
  tier2_cached: Path to cached/file-based knowledge base
  tier3_external: Supabase table or external integration stub
knowledge_status: ACTIVE | STUB | UNAVAILABLE
apps:           [list of ISMS apps where this domain applies]
notes:          Optional context
```

---

## MAT Domain Entries

### 1. MAT Audit Lifecycle

```yaml
domain: MAT Audit Lifecycle
specialist: mat-specialist
trigger_phrases:
  - audit
  - audit lifecycle
  - audit plan
  - audit evidence
  - audit finding
  - audit closure
  - site audit
  - schedule audit
  - conduct audit
  - audit report
  - corrective action
  - CAPA
knowledge_base:
  tier1_live: apps/mat/api/audits/**
  tier2_cached: .agent-workspace/mat-specialist/knowledge/audit-lifecycle.md
  tier3_external: supabase:table=audits (stub)
knowledge_status: STUB
apps: [MAT]
```

### 2. MAT Maturity Assessment

```yaml
domain: MAT Maturity Assessment
specialist: maturity-scoring-agent
trigger_phrases:
  - maturity
  - maturity score
  - maturity level
  - maturity rating
  - maturity assessment
  - score domain
  - score MPS
  - compute maturity
  - maturity heat map
  - maturity gap
  - gap analysis
  - improvement planning
knowledge_base:
  tier1_live: apps/mat/api/assessments/**
  tier2_cached: .agent-workspace/maturity-scoring-agent/knowledge/scoring-model.md
  tier3_external: supabase:table=assessments (stub)
knowledge_status: STUB
apps: [MAT, Maturity Roadmap]
```

### 3. MAT Criteria & MPS Structure

```yaml
domain: MAT Criteria & MPS Structure
specialist: mat-specialist
trigger_phrases:
  - criteria
  - criterion
  - MPS
  - minimum performance standard
  - domain criteria
  - criteria mapping
  - criteria structure
  - criteria hierarchy
  - add criteria
  - update criteria
  - criteria coverage
  - benchmark criteria
knowledge_base:
  tier1_live: apps/mat/api/criteria/**
  tier2_cached: .agent-workspace/mat-specialist/knowledge/criteria-structure.md
  tier3_external: supabase:table=criteria (stub)
knowledge_status: STUB
apps: [MAT]
```

### 4. LDCS Document Import

```yaml
domain: LDCS Document Import
specialist: document-parser-agent
trigger_phrases:
  - LDCS
  - loss data collection standard
  - import document
  - upload document
  - parse document
  - ingest document
  - document upload
  - import LDCS
  - parse LDCS
  - document ingestion
  - upload criteria source
  - load standard
knowledge_base:
  tier1_live: apps/mat/api/ldcs/**
  tier2_cached: .agent-workspace/document-parser-agent/knowledge/ldcs-format-guide.md
  tier3_external: supabase:table=ldcs_documents (stub)
knowledge_status: STUB
apps: [MAT]
notes: "Triggers LDCS→Supabase pipeline: document-parser-agent → criteria-generator-agent → Supabase write"
```

### 5. Criteria Generation & Extraction

```yaml
domain: Criteria Generation & Extraction
specialist: criteria-generator-agent
trigger_phrases:
  - generate criteria
  - extract criteria
  - criteria generation
  - criteria extraction
  - framework mapping
  - ISO mapping
  - NIST mapping
  - PCI mapping
  - SOC2 mapping
  - auto-generate
  - criteria from document
  - parse framework
  - chunk document
  - embed criteria
knowledge_base:
  tier1_live: apps/mat/api/criteria/generate/**
  tier2_cached: .agent-workspace/criteria-generator-agent/knowledge/extraction-rules.md
  tier3_external: supabase:table=criteria_embeddings (stub)
knowledge_status: STUB
apps: [MAT]
notes: "Output feeds into Supabase criteria_embeddings table for semantic search at runtime"
```

### 6. MAT Report Generation

```yaml
domain: MAT Report Generation
specialist: report-writer-agent
trigger_phrases:
  - report
  - generate report
  - audit report
  - maturity report
  - executive summary
  - compliance report
  - export report
  - print report
  - risk report
  - findings report
  - write report
  - create report
knowledge_base:
  tier1_live: apps/mat/api/reports/**
  tier2_cached: .agent-workspace/report-writer-agent/knowledge/report-templates.md
  tier3_external: supabase:table=reports (stub)
knowledge_status: STUB
apps: [MAT]
```

### 7. Risk & Threat Analysis

```yaml
domain: Risk & Threat Analysis
specialist: risk-platform-agent
trigger_phrases:
  - risk
  - threat
  - vulnerability
  - control
  - incident
  - mitigation
  - attack
  - exploit
  - breach
  - exposure
  - risk score
  - risk rating
  - risk heat map
  - threat intelligence
  - insider threat
  - cyber threat
  - physical threat
  - risk register
  - risk appetite
  - residual risk
  - inherent risk
knowledge_base:
  tier1_live: apps/pit/api/risks/**
  tier2_cached: .agent-workspace/risk-platform-agent/knowledge/risk-model.md
  tier3_external: supabase:table=risks (stub)
knowledge_status: STUB
apps: [MAT, PIT, XDETECT, Maturity Roadmap]
```

---

## Future Domain Entries (Phase 4+)

| Domain | Specialist | Status | Apps |
|--------|-----------|--------|------|
| PIT Threat Intelligence | pit-specialist | PENDING Phase 4 | PIT |
| XDETECT Contraband Detection | xdetect-specialist | PENDING Phase 4 | XDETECT |
| Maturity Roadmap Planning | maturity-roadmap-specialist | PENDING Phase 4 | Maturity Roadmap |
| Builder Code Review | (existing builders) | ACTIVE | Builder |
| Command Voice/Text | (orchestrator direct) | ACTIVE | Command |

---

## Routing Priority Rules

When multiple entries match a query, the orchestrator applies the following precedence:

1. **App context wins**: If app = MAT and trigger matches both `mat-specialist` and `risk-platform-agent`, prefer `mat-specialist` unless the query is explicitly risk/threat-focused.
2. **Most specific trigger wins**: Longer/more specific phrase match takes precedence over shorter generic match.
3. **STUB fallback**: If matched specialist has `knowledge_status: STUB`, apply graceful degradation protocol before delegating.
4. **Multi-specialist chain**: If query spans multiple domains (e.g., "import LDCS and generate heat map"), build a chain following the LDCS→Supabase pipeline order.

---

## Update Protocol

To add or modify an entry:
1. Create CS2-approved PR
2. Update this file with new entry
3. Update `specialist-registry.md` to register specialist if not already present
4. Update `routing-rules.md` with any new routing decision tree branches
5. Commit session memory entry documenting the change

**Authority:** CS2 (Johan Ras) | **Version:** 1.0.0 | **Date:** 2026-02-21
