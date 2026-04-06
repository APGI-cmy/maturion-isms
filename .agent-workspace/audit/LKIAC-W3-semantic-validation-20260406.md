# LKIAC Wave 3 — Semantic Search Validation Report

**Document ID**: CL-6-D3  
**Artifact Type**: Semantic Search Validation Report  
**Wave**: CL-6 (Re-launch — Knowledge Re-ingestion Migration)  
**Date**: 2026-04-06  
**Status**: ⚠️ PRE-MIGRATION FRAMEWORK — Results to be populated after migration run  
**Produced By**: qa-builder (governed delegation from foreman-v2-agent, Issue #1240)  
**Branch**: copilot/cl-6-relaunch-knowledge-ingestion  
**Authority Reference**: LKIAC-001 §7.4, Architecture Freeze `.agent-admin/architecture/cl6-architecture-freeze-20260406.md`  
**Compliance Gate**: CL6-FFA-012 (≥10 queries per domain, all 8 domains covered)  

---

## 1. Purpose & Approach

This document is the **authoritative semantic search validation artifact** for LKIAC Wave 3 (CL-6). It defines:

1. The complete query catalog — 10 queries per domain × 8 domains = **80 total validation queries**
2. Quality criteria for determining "relevant result"
3. A step-by-step execution checklist to be run immediately after the migration script completes
4. Pass/Fail criteria against which the migration is declared COMPLETE or FAILED
5. Pre-populated result tables ready for recording actual query outcomes
6. Sign-off section for CS2 review at Checkpoint CP-6

**Validation Principle**: Semantic search quality is validated by executing each query against the AIMC `ai_knowledge` table using the project's vector embedding endpoint, and evaluating whether the top-3 returned chunks are thematically relevant to the query intent. A domain is considered **SEARCHABLE** when ≥8 of its 10 queries each return at least 1 relevant result in the top-3 hits.

**Approach — Pre-migration vs Post-migration**:
- *Pre-migration*: This document exists as a **framework template**. Query catalog is fully defined. Result tables are blank.
- *Post-migration*: The executor populates Section 7 result tables and Section 8 pass/fail verdict and submits for CS2 sign-off.

---

## 2. Scope: 8 Approved Domains

Per Architecture Freeze and CL-2-D2 domain taxonomy (CL6-FFA-004), the following eight domain labels are approved and in scope:

| # | Domain Label (`source` field) | Description |
|---|-------------------------------|-------------|
| 1 | `iso27001` | ISO/IEC 27001 information security management standard content |
| 2 | `nist` | NIST Cybersecurity Framework, SP 800-series, and related framework content |
| 3 | `pci-dss` | Payment Card Industry Data Security Standard content |
| 4 | `soc2` | SOC 2 Trust Services Criteria content |
| 5 | `risk-management` | General risk management content not tied to a single external standard |
| 6 | `general` | Generic, uncategorised, or cross-domain knowledge content |
| 7 | `ldcs` | Maturion LDCS (Living Discipline-Calibrated Standard) proprietary content |
| 8 | `diamond-industry` | Diamond industry sector-specific compliance and governance content |

---

## 3. Quality Criteria — What Constitutes a "Relevant Result"

### 3.1 Relevance Scoring Criteria

A returned chunk is scored as **RELEVANT** when it satisfies the following criteria:

| Criterion | Weight | Pass Threshold |
|-----------|--------|----------------|
| **Topical Match** — Chunk content addresses the same subject area as the query | HIGH | Chunk must address the same concept family as query |
| **Domain Alignment** — Returned chunk's `source` matches the queried domain | HIGH | `source` field equals the expected domain label |
| **Semantic Coherence** — Chunk reads as a complete, coherent piece of knowledge (not a truncation artifact or header-only fragment) | MEDIUM | Chunk length ≥ 100 characters, coherent sentence structure |
| **Cosine Similarity Score** — Embedding distance between query and chunk | HIGH | Score ≥ 0.75 (on normalised 0–1 scale) |
| **Non-duplication** — Top-3 results are not all near-identical content | MEDIUM | At least 2 of top-3 results are substantively distinct |

### 3.2 Relevance Classifications

| Classification | Meaning |
|----------------|---------|
| ✅ RELEVANT | Chunk satisfies Topical Match + Domain Alignment + Similarity ≥ 0.75 |
| ⚠️ PARTIAL | Chunk is on-topic but wrong domain label, or similarity 0.60–0.74 |
| ❌ IRRELEVANT | Chunk is off-topic, empty, or similarity < 0.60 |

### 3.3 Domain Pass Threshold

A domain **PASSES** validation when:
- ≥8 of 10 queries return at least 1 **RELEVANT** result in top-3 hits
- 0 queries return only ❌ IRRELEVANT results in top-3 (i.e., every query finds something, even if PARTIAL)

A domain **FAILS** validation when:
- <8 of 10 queries return a RELEVANT top-3 result, OR
- Any query returns 0 results (empty set)

---

## 4. Validation Query Catalog

> **Execution Note**: Each query is run as a semantic (vector) search against `ai_knowledge` filtered by `source = '<domain>'`. Queries are natural language strings passed to the AIMC embedding endpoint. Record top-3 results per query in Section 7 result tables.

---

### 4.1 Domain: `iso27001`

**Domain Description**: ISO/IEC 27001:2022 Information Security Management System controls and clauses.

| Query # | Query String |
|---------|-------------|
| ISO-Q01 | "information security policy management and top management commitment" |
| ISO-Q02 | "risk assessment methodology for identifying information security threats" |
| ISO-Q03 | "access control policy user registration and deregistration procedures" |
| ISO-Q04 | "cryptography key management and encryption policy requirements" |
| ISO-Q05 | "incident management response and reporting procedures for security events" |
| ISO-Q06 | "supplier relationship security requirements and third-party risk controls" |
| ISO-Q07 | "business continuity planning for information security disruptions" |
| ISO-Q08 | "internal audit programme for information security management system" |
| ISO-Q09 | "asset management inventory classification and ownership responsibilities" |
| ISO-Q10 | "physical security perimeter controls and environmental protection measures" |

---

### 4.2 Domain: `nist`

**Domain Description**: NIST Cybersecurity Framework (CSF), SP 800-53, SP 800-171, and related NIST publications.

| Query # | Query String |
|---------|-------------|
| NIST-Q01 | "identify function asset management organisational understanding NIST CSF" |
| NIST-Q02 | "protect function access control awareness training NIST framework" |
| NIST-Q03 | "detect function anomalies events continuous security monitoring" |
| NIST-Q04 | "respond function incident response communications analysis mitigation" |
| NIST-Q05 | "recover function recovery planning improvements communications resilience" |
| NIST-Q06 | "NIST SP 800-53 security and privacy controls baseline selection" |
| NIST-Q07 | "supply chain risk management practices NIST cybersecurity guidance" |
| NIST-Q08 | "zero trust architecture principles NIST SP 800-207 implementation" |
| NIST-Q09 | "identity and access management NIST digital identity guidelines" |
| NIST-Q10 | "vulnerability management patch management NIST configuration baseline" |

---

### 4.3 Domain: `pci-dss`

**Domain Description**: PCI-DSS v4.0 Payment Card Industry Data Security Standard requirements and controls.

| Query # | Query String |
|---------|-------------|
| PCI-Q01 | "cardholder data environment scope network segmentation firewall rules" |
| PCI-Q02 | "strong cryptography transmission protection primary account number PAN" |
| PCI-Q03 | "vulnerability scanning penetration testing PCI ASV requirements" |
| PCI-Q04 | "access control least privilege need to know cardholder data" |
| PCI-Q05 | "security awareness training personnel payment card data handling" |
| PCI-Q06 | "audit log monitoring and review for cardholder data environment" |
| PCI-Q07 | "incident response plan payment card security breach notification" |
| PCI-Q08 | "service provider responsibility shared compliance matrix PCI-DSS" |
| PCI-Q09 | "physical security controls for point of sale terminal protection" |
| PCI-Q10 | "tokenisation and point to point encryption P2PE reducing PCI scope" |

---

### 4.4 Domain: `soc2`

**Domain Description**: SOC 2 Trust Services Criteria — Security, Availability, Processing Integrity, Confidentiality, Privacy.

| Query # | Query String |
|---------|-------------|
| SOC2-Q01 | "common criteria logical and physical access controls SOC 2 security" |
| SOC2-Q02 | "availability trust service criteria uptime recovery objectives" |
| SOC2-Q03 | "processing integrity completeness accuracy validity system processes" |
| SOC2-Q04 | "confidentiality protection of sensitive information SOC 2 criteria" |
| SOC2-Q05 | "privacy notice collection use retention disposal personal information" |
| SOC2-Q06 | "change management software development lifecycle SOC 2 controls" |
| SOC2-Q07 | "vendor management third-party oversight SOC 2 complementary controls" |
| SOC2-Q08 | "monitoring controls continuous oversight detective control activities" |
| SOC2-Q09 | "risk management risk assessment process SOC 2 trust service" |
| SOC2-Q10 | "communication and information internal control reporting SOC 2" |

---

### 4.5 Domain: `risk-management`

**Domain Description**: General risk management methodology, frameworks, and practices not tied to a specific compliance standard.

| Query # | Query String |
|---------|-------------|
| RISK-Q01 | "risk appetite statement and risk tolerance thresholds enterprise governance" |
| RISK-Q02 | "risk identification techniques workshops interviews threat analysis" |
| RISK-Q03 | "inherent risk residual risk control effectiveness assessment" |
| RISK-Q04 | "risk heat map likelihood impact matrix scoring methodology" |
| RISK-Q05 | "risk treatment options accept transfer mitigate avoid residual" |
| RISK-Q06 | "risk register maintenance ownership review cycle escalation" |
| RISK-Q07 | "operational risk key risk indicators monitoring reporting dashboard" |
| RISK-Q08 | "enterprise risk management ERM integration business strategy" |
| RISK-Q09 | "third party vendor risk due diligence assessment lifecycle" |
| RISK-Q10 | "risk communication reporting to board audit committee governance" |

---

### 4.6 Domain: `general`

**Domain Description**: Generic, uncategorised, or cross-domain knowledge — includes maturity model content, SOP templates, scoring logic, and web-crawled content not aligned to a specific standard.

| Query # | Query String |
|---------|-------------|
| GEN-Q01 | "information security best practices governance framework overview" |
| GEN-Q02 | "maturity assessment scoring criteria and evidence requirements" |
| GEN-Q03 | "standard operating procedure template security controls documentation" |
| GEN-Q04 | "organisation security posture benchmarking comparison industry peers" |
| GEN-Q05 | "cybersecurity culture awareness programme employee behaviour change" |
| GEN-Q06 | "data governance data quality management policies and procedures" |
| GEN-Q07 | "security architecture principles defence in depth layered controls" |
| GEN-Q08 | "business risk technology alignment strategic security investment" |
| GEN-Q09 | "compliance programme management regulatory landscape overview" |
| GEN-Q10 | "security metrics key performance indicators measurement dashboard" |

---

### 4.7 Domain: `ldcs`

**Domain Description**: Maturion LDCS (Living Discipline-Calibrated Standard) proprietary maturity framework content — MPS documents, scoring logic, assessment framework components.

| Query # | Query String |
|---------|-------------|
| LDCS-Q01 | "Maturion maturity practice statement MPS domain discipline assessment" |
| LDCS-Q02 | "LDCS living discipline calibrated standard maturity level scoring" |
| LDCS-Q03 | "maturity domain evidence criteria assessment weight scoring rubric" |
| LDCS-Q04 | "Maturion advisor assessment framework component criteria mapping" |
| LDCS-Q05 | "maturity roadmap progression target level capability improvement" |
| LDCS-Q06 | "LDCS criteria domain coverage gap analysis remediation actions" |
| LDCS-Q07 | "maturity scoring logic calculation weighted domain aggregate score" |
| LDCS-Q08 | "Maturion ISMS maturity audit evidence collection requirements" |
| LDCS-Q09 | "discipline calibration criteria update review lifecycle governance" |
| LDCS-Q10 | "maturity baseline current state measurement organisational capability" |

---

### 4.8 Domain: `diamond-industry`

**Domain Description**: Diamond industry sector-specific compliance, governance, and security content — Kimberley Process, chain of custody, sector regulations.

| Query # | Query String |
|---------|-------------|
| DIA-Q01 | "Kimberley Process certification scheme conflict diamond compliance" |
| DIA-Q02 | "diamond supply chain custody traceability provenance documentation" |
| DIA-Q03 | "rough diamond trade regulations export import licensing requirements" |
| DIA-Q04 | "diamond industry anti-money laundering AML due diligence controls" |
| DIA-Q05 | "responsible sourcing standards diamond sector ESG reporting" |
| DIA-Q06 | "natural diamond grading certification GIA standards documentation" |
| DIA-Q07 | "diamond industry information security physical security vault controls" |
| DIA-Q08 | "precious stones trade regulatory compliance customs valuation" |
| DIA-Q09 | "diamond sector risk management supply disruption business continuity" |
| DIA-Q10 | "World Diamond Council blockchain traceability digital provenance" |

---

## 5. Execution Checklist

> **When to execute**: Immediately after migration script (`packages/ai-centre/scripts/migrate-legacy-knowledge.ts`) has completed its run and the AIMC `ai_knowledge` table has been populated.

### 5.1 Pre-Execution Checks (Before Running Queries)

- [ ] **MCHECK-01**: Confirm migration script exited with code 0 (no fatal errors)
- [ ] **MCHECK-02**: Confirm `ai_knowledge` row count ≥ legacy `org_page_chunks` row count
- [ ] **MCHECK-03**: Confirm all 8 domain labels present in `ai_knowledge.source` column via: `SELECT source, COUNT(*) FROM ai_knowledge WHERE approval_status = 'pending' GROUP BY source;`
- [ ] **MCHECK-04**: Confirm no rows have `source IS NULL` or `source = ''`
- [ ] **MCHECK-05**: Confirm embedding dimension = 1536 via: `SELECT vector_dims(embedding) FROM ai_knowledge LIMIT 1;`
- [ ] **MCHECK-06**: Confirm `approval_status = 'pending'` on all migrated rows
- [ ] **MCHECK-07**: Confirm `content_hash` column populated (deduplication applied)
- [ ] **MCHECK-08**: Confirm AIMC embedding endpoint is reachable and returning valid vectors
- [ ] **MCHECK-09**: Note total row counts per domain in Section 6 baseline table

### 5.2 Query Execution Steps

1. For each query in Section 4 (80 queries total):
   a. Embed the query string using the AIMC embedding endpoint (OpenAI-compatible, 1536 dimensions)
   b. Execute vector similarity search against `ai_knowledge` filtered by `source = '<domain>'`
   c. Retrieve top-3 results with cosine similarity scores
   d. Record results in the corresponding domain table in Section 7
   e. Classify each result as RELEVANT / PARTIAL / IRRELEVANT per Section 3 criteria

2. After all 80 queries are run, complete Section 8 (Pass/Fail verdict per domain)

3. Calculate aggregate pass rate and determine overall migration PASS or FAIL

### 5.3 Recommended Execution Query (Supabase RPC or SQL)

```sql
-- Example: Run semantic search for a domain
-- Replace :query_embedding with the embedded vector for the query string
-- Replace :domain with the domain label (e.g., 'iso27001')

SELECT 
  id,
  content,
  source,
  standard_ref,
  1 - (embedding <=> :query_embedding) AS similarity_score
FROM ai_knowledge
WHERE 
  source = :domain
  AND approval_status = 'pending'
ORDER BY embedding <=> :query_embedding
LIMIT 3;
```

---

## 6. Pre-Migration Baseline (Populate Before Running Queries)

> Complete this table immediately after migration completes but before running validation queries.

| Domain | Legacy Row Count (expected) | AIMC Row Count (actual) | Count ≥ Legacy? | Notes |
|--------|-----------------------------|-------------------------|-----------------|-------|
| `iso27001` | [TO POPULATE] | [TO POPULATE] | ☐ | |
| `nist` | [TO POPULATE] | [TO POPULATE] | ☐ | |
| `pci-dss` | [TO POPULATE] | [TO POPULATE] | ☐ | |
| `soc2` | [TO POPULATE] | [TO POPULATE] | ☐ | |
| `risk-management` | [TO POPULATE] | [TO POPULATE] | ☐ | |
| `general` | [TO POPULATE] | [TO POPULATE] | ☐ | |
| `ldcs` | [TO POPULATE] | [TO POPULATE] | ☐ | |
| `diamond-industry` | [TO POPULATE] | [TO POPULATE] | ☐ | |
| **TOTAL** | [TO POPULATE] | [TO POPULATE] | ☐ | Must be ≥ legacy total |

---

## 7. Query Result Tables

> For each query, record: top-3 chunk IDs, similarity scores, and relevance classification.

---

### 7.1 Results: `iso27001`

| Query # | Query (abbreviated) | Top Result Score | Top Result Relevance | 2nd Result Score | 2nd Relevance | 3rd Result Score | 3rd Relevance | Domain Pass? |
|---------|---------------------|-----------------|----------------------|-----------------|---------------|-----------------|---------------|--------------|
| ISO-Q01 | "information security policy management..." | [TBP] | ☐ R ☐ P ☐ I | [TBP] | ☐ R ☐ P ☐ I | [TBP] | ☐ R ☐ P ☐ I | ☐ |
| ISO-Q02 | "risk assessment methodology..." | [TBP] | ☐ R ☐ P ☐ I | [TBP] | ☐ R ☐ P ☐ I | [TBP] | ☐ R ☐ P ☐ I | ☐ |
| ISO-Q03 | "access control policy..." | [TBP] | ☐ R ☐ P ☐ I | [TBP] | ☐ R ☐ P ☐ I | [TBP] | ☐ R ☐ P ☐ I | ☐ |
| ISO-Q04 | "cryptography key management..." | [TBP] | ☐ R ☐ P ☐ I | [TBP] | ☐ R ☐ P ☐ I | [TBP] | ☐ R ☐ P ☐ I | ☐ |
| ISO-Q05 | "incident management response..." | [TBP] | ☐ R ☐ P ☐ I | [TBP] | ☐ R ☐ P ☐ I | [TBP] | ☐ R ☐ P ☐ I | ☐ |
| ISO-Q06 | "supplier relationship security..." | [TBP] | ☐ R ☐ P ☐ I | [TBP] | ☐ R ☐ P ☐ I | [TBP] | ☐ R ☐ P ☐ I | ☐ |
| ISO-Q07 | "business continuity planning..." | [TBP] | ☐ R ☐ P ☐ I | [TBP] | ☐ R ☐ P ☐ I | [TBP] | ☐ R ☐ P ☐ I | ☐ |
| ISO-Q08 | "internal audit programme..." | [TBP] | ☐ R ☐ P ☐ I | [TBP] | ☐ R ☐ P ☐ I | [TBP] | ☐ R ☐ P ☐ I | ☐ |
| ISO-Q09 | "asset management inventory..." | [TBP] | ☐ R ☐ P ☐ I | [TBP] | ☐ R ☐ P ☐ I | [TBP] | ☐ R ☐ P ☐ I | ☐ |
| ISO-Q10 | "physical security perimeter..." | [TBP] | ☐ R ☐ P ☐ I | [TBP] | ☐ R ☐ P ☐ I | [TBP] | ☐ R ☐ P ☐ I | ☐ |
| **Domain Score** | | | | | | | | **[TBP]/10** |

---

### 7.2 Results: `nist`

| Query # | Query (abbreviated) | Top Result Score | Top Result Relevance | 2nd Result Score | 2nd Relevance | 3rd Result Score | 3rd Relevance | Domain Pass? |
|---------|---------------------|-----------------|----------------------|-----------------|---------------|-----------------|---------------|--------------|
| NIST-Q01 | "identify function asset management..." | [TBP] | ☐ R ☐ P ☐ I | [TBP] | ☐ R ☐ P ☐ I | [TBP] | ☐ R ☐ P ☐ I | ☐ |
| NIST-Q02 | "protect function access control..." | [TBP] | ☐ R ☐ P ☐ I | [TBP] | ☐ R ☐ P ☐ I | [TBP] | ☐ R ☐ P ☐ I | ☐ |
| NIST-Q03 | "detect function anomalies events..." | [TBP] | ☐ R ☐ P ☐ I | [TBP] | ☐ R ☐ P ☐ I | [TBP] | ☐ R ☐ P ☐ I | ☐ |
| NIST-Q04 | "respond function incident response..." | [TBP] | ☐ R ☐ P ☐ I | [TBP] | ☐ R ☐ P ☐ I | [TBP] | ☐ R ☐ P ☐ I | ☐ |
| NIST-Q05 | "recover function recovery planning..." | [TBP] | ☐ R ☐ P ☐ I | [TBP] | ☐ R ☐ P ☐ I | [TBP] | ☐ R ☐ P ☐ I | ☐ |
| NIST-Q06 | "NIST SP 800-53 security controls..." | [TBP] | ☐ R ☐ P ☐ I | [TBP] | ☐ R ☐ P ☐ I | [TBP] | ☐ R ☐ P ☐ I | ☐ |
| NIST-Q07 | "supply chain risk management NIST..." | [TBP] | ☐ R ☐ P ☐ I | [TBP] | ☐ R ☐ P ☐ I | [TBP] | ☐ R ☐ P ☐ I | ☐ |
| NIST-Q08 | "zero trust architecture NIST SP 800-207..." | [TBP] | ☐ R ☐ P ☐ I | [TBP] | ☐ R ☐ P ☐ I | [TBP] | ☐ R ☐ P ☐ I | ☐ |
| NIST-Q09 | "identity and access management NIST..." | [TBP] | ☐ R ☐ P ☐ I | [TBP] | ☐ R ☐ P ☐ I | [TBP] | ☐ R ☐ P ☐ I | ☐ |
| NIST-Q10 | "vulnerability management patch management..." | [TBP] | ☐ R ☐ P ☐ I | [TBP] | ☐ R ☐ P ☐ I | [TBP] | ☐ R ☐ P ☐ I | ☐ |
| **Domain Score** | | | | | | | | **[TBP]/10** |

---

### 7.3 Results: `pci-dss`

| Query # | Query (abbreviated) | Top Result Score | Top Result Relevance | 2nd Result Score | 2nd Relevance | 3rd Result Score | 3rd Relevance | Domain Pass? |
|---------|---------------------|-----------------|----------------------|-----------------|---------------|-----------------|---------------|--------------|
| PCI-Q01 | "cardholder data environment scope..." | [TBP] | ☐ R ☐ P ☐ I | [TBP] | ☐ R ☐ P ☐ I | [TBP] | ☐ R ☐ P ☐ I | ☐ |
| PCI-Q02 | "strong cryptography transmission protection..." | [TBP] | ☐ R ☐ P ☐ I | [TBP] | ☐ R ☐ P ☐ I | [TBP] | ☐ R ☐ P ☐ I | ☐ |
| PCI-Q03 | "vulnerability scanning penetration testing..." | [TBP] | ☐ R ☐ P ☐ I | [TBP] | ☐ R ☐ P ☐ I | [TBP] | ☐ R ☐ P ☐ I | ☐ |
| PCI-Q04 | "access control least privilege cardholder..." | [TBP] | ☐ R ☐ P ☐ I | [TBP] | ☐ R ☐ P ☐ I | [TBP] | ☐ R ☐ P ☐ I | ☐ |
| PCI-Q05 | "security awareness training payment card..." | [TBP] | ☐ R ☐ P ☐ I | [TBP] | ☐ R ☐ P ☐ I | [TBP] | ☐ R ☐ P ☐ I | ☐ |
| PCI-Q06 | "audit log monitoring cardholder environment..." | [TBP] | ☐ R ☐ P ☐ I | [TBP] | ☐ R ☐ P ☐ I | [TBP] | ☐ R ☐ P ☐ I | ☐ |
| PCI-Q07 | "incident response plan payment card breach..." | [TBP] | ☐ R ☐ P ☐ I | [TBP] | ☐ R ☐ P ☐ I | [TBP] | ☐ R ☐ P ☐ I | ☐ |
| PCI-Q08 | "service provider responsibility shared compliance..." | [TBP] | ☐ R ☐ P ☐ I | [TBP] | ☐ R ☐ P ☐ I | [TBP] | ☐ R ☐ P ☐ I | ☐ |
| PCI-Q09 | "physical security point of sale terminal..." | [TBP] | ☐ R ☐ P ☐ I | [TBP] | ☐ R ☐ P ☐ I | [TBP] | ☐ R ☐ P ☐ I | ☐ |
| PCI-Q10 | "tokenisation point to point encryption P2PE..." | [TBP] | ☐ R ☐ P ☐ I | [TBP] | ☐ R ☐ P ☐ I | [TBP] | ☐ R ☐ P ☐ I | ☐ |
| **Domain Score** | | | | | | | | **[TBP]/10** |

---

### 7.4 Results: `soc2`

| Query # | Query (abbreviated) | Top Result Score | Top Result Relevance | 2nd Result Score | 2nd Relevance | 3rd Result Score | 3rd Relevance | Domain Pass? |
|---------|---------------------|-----------------|----------------------|-----------------|---------------|-----------------|---------------|--------------|
| SOC2-Q01 | "common criteria logical physical access..." | [TBP] | ☐ R ☐ P ☐ I | [TBP] | ☐ R ☐ P ☐ I | [TBP] | ☐ R ☐ P ☐ I | ☐ |
| SOC2-Q02 | "availability trust service uptime recovery..." | [TBP] | ☐ R ☐ P ☐ I | [TBP] | ☐ R ☐ P ☐ I | [TBP] | ☐ R ☐ P ☐ I | ☐ |
| SOC2-Q03 | "processing integrity completeness accuracy..." | [TBP] | ☐ R ☐ P ☐ I | [TBP] | ☐ R ☐ P ☐ I | [TBP] | ☐ R ☐ P ☐ I | ☐ |
| SOC2-Q04 | "confidentiality protection sensitive information..." | [TBP] | ☐ R ☐ P ☐ I | [TBP] | ☐ R ☐ P ☐ I | [TBP] | ☐ R ☐ P ☐ I | ☐ |
| SOC2-Q05 | "privacy notice collection use retention..." | [TBP] | ☐ R ☐ P ☐ I | [TBP] | ☐ R ☐ P ☐ I | [TBP] | ☐ R ☐ P ☐ I | ☐ |
| SOC2-Q06 | "change management software development lifecycle..." | [TBP] | ☐ R ☐ P ☐ I | [TBP] | ☐ R ☐ P ☐ I | [TBP] | ☐ R ☐ P ☐ I | ☐ |
| SOC2-Q07 | "vendor management third-party oversight SOC 2..." | [TBP] | ☐ R ☐ P ☐ I | [TBP] | ☐ R ☐ P ☐ I | [TBP] | ☐ R ☐ P ☐ I | ☐ |
| SOC2-Q08 | "monitoring controls continuous oversight..." | [TBP] | ☐ R ☐ P ☐ I | [TBP] | ☐ R ☐ P ☐ I | [TBP] | ☐ R ☐ P ☐ I | ☐ |
| SOC2-Q09 | "risk management risk assessment SOC 2..." | [TBP] | ☐ R ☐ P ☐ I | [TBP] | ☐ R ☐ P ☐ I | [TBP] | ☐ R ☐ P ☐ I | ☐ |
| SOC2-Q10 | "communication information internal control..." | [TBP] | ☐ R ☐ P ☐ I | [TBP] | ☐ R ☐ P ☐ I | [TBP] | ☐ R ☐ P ☐ I | ☐ |
| **Domain Score** | | | | | | | | **[TBP]/10** |

---

### 7.5 Results: `risk-management`

| Query # | Query (abbreviated) | Top Result Score | Top Result Relevance | 2nd Result Score | 2nd Relevance | 3rd Result Score | 3rd Relevance | Domain Pass? |
|---------|---------------------|-----------------|----------------------|-----------------|---------------|-----------------|---------------|--------------|
| RISK-Q01 | "risk appetite statement tolerance thresholds..." | [TBP] | ☐ R ☐ P ☐ I | [TBP] | ☐ R ☐ P ☐ I | [TBP] | ☐ R ☐ P ☐ I | ☐ |
| RISK-Q02 | "risk identification techniques workshops..." | [TBP] | ☐ R ☐ P ☐ I | [TBP] | ☐ R ☐ P ☐ I | [TBP] | ☐ R ☐ P ☐ I | ☐ |
| RISK-Q03 | "inherent risk residual risk control effectiveness..." | [TBP] | ☐ R ☐ P ☐ I | [TBP] | ☐ R ☐ P ☐ I | [TBP] | ☐ R ☐ P ☐ I | ☐ |
| RISK-Q04 | "risk heat map likelihood impact matrix..." | [TBP] | ☐ R ☐ P ☐ I | [TBP] | ☐ R ☐ P ☐ I | [TBP] | ☐ R ☐ P ☐ I | ☐ |
| RISK-Q05 | "risk treatment options accept transfer mitigate..." | [TBP] | ☐ R ☐ P ☐ I | [TBP] | ☐ R ☐ P ☐ I | [TBP] | ☐ R ☐ P ☐ I | ☐ |
| RISK-Q06 | "risk register maintenance ownership review..." | [TBP] | ☐ R ☐ P ☐ I | [TBP] | ☐ R ☐ P ☐ I | [TBP] | ☐ R ☐ P ☐ I | ☐ |
| RISK-Q07 | "operational risk key risk indicators monitoring..." | [TBP] | ☐ R ☐ P ☐ I | [TBP] | ☐ R ☐ P ☐ I | [TBP] | ☐ R ☐ P ☐ I | ☐ |
| RISK-Q08 | "enterprise risk management ERM integration..." | [TBP] | ☐ R ☐ P ☐ I | [TBP] | ☐ R ☐ P ☐ I | [TBP] | ☐ R ☐ P ☐ I | ☐ |
| RISK-Q09 | "third party vendor risk due diligence..." | [TBP] | ☐ R ☐ P ☐ I | [TBP] | ☐ R ☐ P ☐ I | [TBP] | ☐ R ☐ P ☐ I | ☐ |
| RISK-Q10 | "risk communication reporting board audit committee..." | [TBP] | ☐ R ☐ P ☐ I | [TBP] | ☐ R ☐ P ☐ I | [TBP] | ☐ R ☐ P ☐ I | ☐ |
| **Domain Score** | | | | | | | | **[TBP]/10** |

---

### 7.6 Results: `general`

| Query # | Query (abbreviated) | Top Result Score | Top Result Relevance | 2nd Result Score | 2nd Relevance | 3rd Result Score | 3rd Relevance | Domain Pass? |
|---------|---------------------|-----------------|----------------------|-----------------|---------------|-----------------|---------------|--------------|
| GEN-Q01 | "information security best practices governance..." | [TBP] | ☐ R ☐ P ☐ I | [TBP] | ☐ R ☐ P ☐ I | [TBP] | ☐ R ☐ P ☐ I | ☐ |
| GEN-Q02 | "maturity assessment scoring criteria evidence..." | [TBP] | ☐ R ☐ P ☐ I | [TBP] | ☐ R ☐ P ☐ I | [TBP] | ☐ R ☐ P ☐ I | ☐ |
| GEN-Q03 | "standard operating procedure template security..." | [TBP] | ☐ R ☐ P ☐ I | [TBP] | ☐ R ☐ P ☐ I | [TBP] | ☐ R ☐ P ☐ I | ☐ |
| GEN-Q04 | "organisation security posture benchmarking..." | [TBP] | ☐ R ☐ P ☐ I | [TBP] | ☐ R ☐ P ☐ I | [TBP] | ☐ R ☐ P ☐ I | ☐ |
| GEN-Q05 | "cybersecurity culture awareness employee behaviour..." | [TBP] | ☐ R ☐ P ☐ I | [TBP] | ☐ R ☐ P ☐ I | [TBP] | ☐ R ☐ P ☐ I | ☐ |
| GEN-Q06 | "data governance data quality management policies..." | [TBP] | ☐ R ☐ P ☐ I | [TBP] | ☐ R ☐ P ☐ I | [TBP] | ☐ R ☐ P ☐ I | ☐ |
| GEN-Q07 | "security architecture defence in depth layered..." | [TBP] | ☐ R ☐ P ☐ I | [TBP] | ☐ R ☐ P ☐ I | [TBP] | ☐ R ☐ P ☐ I | ☐ |
| GEN-Q08 | "business risk technology alignment strategic..." | [TBP] | ☐ R ☐ P ☐ I | [TBP] | ☐ R ☐ P ☐ I | [TBP] | ☐ R ☐ P ☐ I | ☐ |
| GEN-Q09 | "compliance programme management regulatory landscape..." | [TBP] | ☐ R ☐ P ☐ I | [TBP] | ☐ R ☐ P ☐ I | [TBP] | ☐ R ☐ P ☐ I | ☐ |
| GEN-Q10 | "security metrics key performance indicators..." | [TBP] | ☐ R ☐ P ☐ I | [TBP] | ☐ R ☐ P ☐ I | [TBP] | ☐ R ☐ P ☐ I | ☐ |
| **Domain Score** | | | | | | | | **[TBP]/10** |

---

### 7.7 Results: `ldcs`

| Query # | Query (abbreviated) | Top Result Score | Top Result Relevance | 2nd Result Score | 2nd Relevance | 3rd Result Score | 3rd Relevance | Domain Pass? |
|---------|---------------------|-----------------|----------------------|-----------------|---------------|-----------------|---------------|--------------|
| LDCS-Q01 | "Maturion maturity practice statement MPS domain..." | [TBP] | ☐ R ☐ P ☐ I | [TBP] | ☐ R ☐ P ☐ I | [TBP] | ☐ R ☐ P ☐ I | ☐ |
| LDCS-Q02 | "LDCS living discipline calibrated standard maturity..." | [TBP] | ☐ R ☐ P ☐ I | [TBP] | ☐ R ☐ P ☐ I | [TBP] | ☐ R ☐ P ☐ I | ☐ |
| LDCS-Q03 | "maturity domain evidence criteria weight rubric..." | [TBP] | ☐ R ☐ P ☐ I | [TBP] | ☐ R ☐ P ☐ I | [TBP] | ☐ R ☐ P ☐ I | ☐ |
| LDCS-Q04 | "Maturion advisor assessment framework criteria..." | [TBP] | ☐ R ☐ P ☐ I | [TBP] | ☐ R ☐ P ☐ I | [TBP] | ☐ R ☐ P ☐ I | ☐ |
| LDCS-Q05 | "maturity roadmap progression target level..." | [TBP] | ☐ R ☐ P ☐ I | [TBP] | ☐ R ☐ P ☐ I | [TBP] | ☐ R ☐ P ☐ I | ☐ |
| LDCS-Q06 | "LDCS criteria domain coverage gap analysis..." | [TBP] | ☐ R ☐ P ☐ I | [TBP] | ☐ R ☐ P ☐ I | [TBP] | ☐ R ☐ P ☐ I | ☐ |
| LDCS-Q07 | "maturity scoring logic weighted aggregate score..." | [TBP] | ☐ R ☐ P ☐ I | [TBP] | ☐ R ☐ P ☐ I | [TBP] | ☐ R ☐ P ☐ I | ☐ |
| LDCS-Q08 | "Maturion ISMS maturity audit evidence collection..." | [TBP] | ☐ R ☐ P ☐ I | [TBP] | ☐ R ☐ P ☐ I | [TBP] | ☐ R ☐ P ☐ I | ☐ |
| LDCS-Q09 | "discipline calibration criteria update lifecycle..." | [TBP] | ☐ R ☐ P ☐ I | [TBP] | ☐ R ☐ P ☐ I | [TBP] | ☐ R ☐ P ☐ I | ☐ |
| LDCS-Q10 | "maturity baseline current state measurement..." | [TBP] | ☐ R ☐ P ☐ I | [TBP] | ☐ R ☐ P ☐ I | [TBP] | ☐ R ☐ P ☐ I | ☐ |
| **Domain Score** | | | | | | | | **[TBP]/10** |

---

### 7.8 Results: `diamond-industry`

| Query # | Query (abbreviated) | Top Result Score | Top Result Relevance | 2nd Result Score | 2nd Relevance | 3rd Result Score | 3rd Relevance | Domain Pass? |
|---------|---------------------|-----------------|----------------------|-----------------|---------------|-----------------|---------------|--------------|
| DIA-Q01 | "Kimberley Process certification conflict diamond..." | [TBP] | ☐ R ☐ P ☐ I | [TBP] | ☐ R ☐ P ☐ I | [TBP] | ☐ R ☐ P ☐ I | ☐ |
| DIA-Q02 | "diamond supply chain custody traceability..." | [TBP] | ☐ R ☐ P ☐ I | [TBP] | ☐ R ☐ P ☐ I | [TBP] | ☐ R ☐ P ☐ I | ☐ |
| DIA-Q03 | "rough diamond trade regulations export import..." | [TBP] | ☐ R ☐ P ☐ I | [TBP] | ☐ R ☐ P ☐ I | [TBP] | ☐ R ☐ P ☐ I | ☐ |
| DIA-Q04 | "diamond industry anti-money laundering AML..." | [TBP] | ☐ R ☐ P ☐ I | [TBP] | ☐ R ☐ P ☐ I | [TBP] | ☐ R ☐ P ☐ I | ☐ |
| DIA-Q05 | "responsible sourcing standards diamond ESG reporting..." | [TBP] | ☐ R ☐ P ☐ I | [TBP] | ☐ R ☐ P ☐ I | [TBP] | ☐ R ☐ P ☐ I | ☐ |
| DIA-Q06 | "natural diamond grading certification GIA standards..." | [TBP] | ☐ R ☐ P ☐ I | [TBP] | ☐ R ☐ P ☐ I | [TBP] | ☐ R ☐ P ☐ I | ☐ |
| DIA-Q07 | "diamond industry information security vault controls..." | [TBP] | ☐ R ☐ P ☐ I | [TBP] | ☐ R ☐ P ☐ I | [TBP] | ☐ R ☐ P ☐ I | ☐ |
| DIA-Q08 | "precious stones trade regulatory compliance customs..." | [TBP] | ☐ R ☐ P ☐ I | [TBP] | ☐ R ☐ P ☐ I | [TBP] | ☐ R ☐ P ☐ I | ☐ |
| DIA-Q09 | "diamond sector risk management supply disruption..." | [TBP] | ☐ R ☐ P ☐ I | [TBP] | ☐ R ☐ P ☐ I | [TBP] | ☐ R ☐ P ☐ I | ☐ |
| DIA-Q10 | "World Diamond Council blockchain digital provenance..." | [TBP] | ☐ R ☐ P ☐ I | [TBP] | ☐ R ☐ P ☐ I | [TBP] | ☐ R ☐ P ☐ I | ☐ |
| **Domain Score** | | | | | | | | **[TBP]/10** |

---

## 8. Pass/Fail Criteria & Overall Verdict

### 8.1 Individual Domain Pass/Fail Criteria

A domain **PASSES** when ALL of the following are true:
- [ ] Domain has ≥1 row in `ai_knowledge` post-migration
- [ ] ≥8 of 10 queries return at least 1 RELEVANT top-3 result (similarity ≥ 0.75, correct domain label)
- [ ] 0 queries return zero results (empty set)

A domain **FAILS** when ANY of the following is true:
- [ ] Domain has 0 rows in `ai_knowledge` post-migration
- [ ] <8 of 10 queries return a RELEVANT top-3 result
- [ ] Any query returns an empty result set

### 8.2 Overall Migration Pass/Fail Criteria

The **overall migration PASSES** when ALL of the following are satisfied:

| Criterion | Pass Condition | Status |
|-----------|----------------|--------|
| Row count | `ai_knowledge` total ≥ legacy total | ☐ PASS / ☐ FAIL |
| All domains searchable | All 8 domain labels present in `ai_knowledge` | ☐ PASS / ☐ FAIL |
| Per-domain query pass | All 8 domains individually PASS (≥8/10 queries RELEVANT) | ☐ PASS / ☐ FAIL |
| Embedding integrity | All rows have non-null embedding of dimension 1536 | ☐ PASS / ☐ FAIL |
| Approval status | All migrated rows have `approval_status = 'pending'` | ☐ PASS / ☐ FAIL |
| Deduplication applied | `content_hash` populated, no duplicate hashes | ☐ PASS / ☐ FAIL |
| Zero empty result queries | No domain query returns 0 results | ☐ PASS / ☐ FAIL |

**OVERALL VERDICT**: ☐ **PASS** — Migration complete, all domains validated  
**OVERALL VERDICT**: ☐ **FAIL** — Migration incomplete, remediation required

### 8.3 Domain Summary Score Table

| Domain | Queries Run | RELEVANT | PARTIAL | IRRELEVANT | Score | Pass? |
|--------|-------------|----------|---------|------------|-------|-------|
| `iso27001` | 10 | [TBP] | [TBP] | [TBP] | [TBP]/10 | ☐ |
| `nist` | 10 | [TBP] | [TBP] | [TBP] | [TBP]/10 | ☐ |
| `pci-dss` | 10 | [TBP] | [TBP] | [TBP] | [TBP]/10 | ☐ |
| `soc2` | 10 | [TBP] | [TBP] | [TBP] | [TBP]/10 | ☐ |
| `risk-management` | 10 | [TBP] | [TBP] | [TBP] | [TBP]/10 | ☐ |
| `general` | 10 | [TBP] | [TBP] | [TBP] | [TBP]/10 | ☐ |
| `ldcs` | 10 | [TBP] | [TBP] | [TBP] | [TBP]/10 | ☐ |
| `diamond-industry` | 10 | [TBP] | [TBP] | [TBP] | [TBP]/10 | ☐ |
| **TOTAL** | **80** | **[TBP]** | **[TBP]** | **[TBP]** | **[TBP]/80** | **☐** |

### 8.4 Failure Remediation Path

If any domain FAILS validation:

1. **Investigate**: Query `ai_knowledge` directly for the failing domain — confirm rows exist and have valid embeddings
2. **Check source label**: Verify the `source` column value exactly matches the expected domain label (case-sensitive)
3. **Check content quality**: Sample 5 random chunks from the domain — do they contain meaningful, non-empty content?
4. **Re-run migration for failing domains**: If content is missing or mis-labelled, re-run migration script with domain filter
5. **Re-run validation queries**: After remediation, re-execute the 10 queries for the failing domain only
6. **Escalate to CS2**: If domain continues to fail after re-run, escalate with evidence to CS2 (Johan Ras / @APGI-cmy) before CP-6

---

## 9. CL6-FFA-012 Compliance Attestation

**Compliance Check**: CL6-FFA-012 — Semantic search validation must cover ≥10 queries per domain

| Domain | Query Count | Meets ≥10 Requirement |
|--------|-------------|----------------------|
| `iso27001` | 10 (ISO-Q01 to ISO-Q10) | ✅ COMPLIANT |
| `nist` | 10 (NIST-Q01 to NIST-Q10) | ✅ COMPLIANT |
| `pci-dss` | 10 (PCI-Q01 to PCI-Q10) | ✅ COMPLIANT |
| `soc2` | 10 (SOC2-Q01 to SOC2-Q10) | ✅ COMPLIANT |
| `risk-management` | 10 (RISK-Q01 to RISK-Q10) | ✅ COMPLIANT |
| `general` | 10 (GEN-Q01 to GEN-Q10) | ✅ COMPLIANT |
| `ldcs` | 10 (LDCS-Q01 to LDCS-Q10) | ✅ COMPLIANT |
| `diamond-industry` | 10 (DIA-Q01 to DIA-Q10) | ✅ COMPLIANT |
| **Total Queries** | **80** | ✅ **CL6-FFA-012 SATISFIED** |

---

## 10. Sign-Off Section — CP-6 Review

> **Instructions**: This section is to be completed by CS2 after reviewing the populated results tables (Sections 6–8). The document transitions from PRE-MIGRATION FRAMEWORK to POST-MIGRATION VALIDATED only when CS2 provides sign-off below.

### 10.1 Executor Attestation

**Executed by**:  
**Execution date**:  
**Migration script version/commit**:  
**AIMC `ai_knowledge` row count at time of validation**:  
**Legacy row count at time of migration**:  
**Overall verdict** (from Section 8): ☐ PASS / ☐ FAIL  

**Attestation Statement**: I attest that all 80 validation queries were executed against the AIMC `ai_knowledge` table post-migration, results are recorded accurately in Section 7, and the pass/fail determinations in Section 8 reflect the actual query outcomes.

**Signature**: ___________________________  
**Date**: ___________________________

---

### 10.2 CS2 Review Sign-Off

**Reviewed by** (CS2):  
**Review date**:  
**Checkpoint**: CP-6  

**CS2 Observations**:  
_[CS2 notes any concerns, deviations, or exceptions here]_

**CS2 Verdict**:
- [ ] ✅ **APPROVED** — Semantic search validation PASSED. Migration declared complete. Wave CL-6 cleared for close-out.
- [ ] ⚠️ **CONDITIONAL APPROVAL** — Approved with conditions noted above. Conditions must be resolved within [timeframe].
- [ ] ❌ **REJECTED** — Validation FAILED. Migration requires remediation before CP-6 can be cleared. See failure notes above.

**CS2 Signature**: ___________________________  
**Date**: ___________________________  
**Issue Reference**: #1240  

---

## 11. Document History

| Version | Date | Author | Change |
|---------|------|--------|--------|
| 1.0.0 | 2026-04-06 | qa-builder (CL-6-D3) | Initial creation — PRE-MIGRATION FRAMEWORK with complete 80-query catalog |

---

*End of LKIAC Wave 3 Semantic Search Validation Report — CL-6-D3*  
*Status: PRE-MIGRATION FRAMEWORK — Awaiting migration run and results population*
