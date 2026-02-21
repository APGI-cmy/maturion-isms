# Specialist Registry

**Purpose:** Active specialists available to Maturion orchestrator  
**Location:** `.agent-workspace/maturion-agent/knowledge/specialist-registry.md`  
**Authority:** CS2 (Johan Ras)  
**Status:** Phase 3.5 (6 MAT specialist stubs registered)

---

## Active Specialists

**Current Status:** 6 MAT specialist stubs registered (Phase 3.5). Full activation Phase 3 MVP.

### 1. risk-platform-agent
- **Domain:** Risk management, threat analysis, vulnerability assessment, control frameworks
- **Expertise:** Threat taxonomies (insider, external, cyber, physical), control effectiveness, risk scoring, incident classification
- **Apps:** MAT, PIT, XDETECT, Maturity Roadmap
- **Routing Keywords:** threat, vulnerability, risk, control, incident, mitigation, attack, exploit, breach, exposure
- **Status:** STUB (Phase 3.5 — full activation Phase 3 MVP)
- **Version:** 1.0.0
- **Contract:** `.github/agents/risk-platform-agent.md`
- **Domain Flag Index:** `.agent-workspace/maturion-agent/knowledge/domain-flag-index.md` → "Risk & Threat Analysis"

---

### 2. mat-specialist
- **Domain:** MAT app workflows, LDCS expertise, audit lifecycle, maturity assessment
- **Expertise:** Domain → MPS → Criteria structure, maturity scoring, evidence collection, audit planning, compliance mapping
- **Apps:** MAT
- **Routing Keywords:** MAT, LDCS, audit, criteria, MPS, domain, maturity, assessment, evidence, compliance, ISO, NIST
- **Status:** STUB (Phase 3.5 — full activation Phase 3 MVP)
- **Version:** 1.0.0
- **Contract:** `.github/agents/mat-specialist.md`
- **Domain Flag Index:** `.agent-workspace/maturion-agent/knowledge/domain-flag-index.md` → "MAT Audit Lifecycle", "MAT Criteria & MPS Structure"

---

### 3. criteria-generator-agent
- **Domain:** Criteria extraction, document parsing, framework mapping, Supabase embedding write
- **Expertise:** LDCS/ISO/NIST document parsing, Domain→MPS→Criteria mapping, text chunking, embedding generation
- **Apps:** MAT
- **Routing Keywords:** generate criteria, extract criteria, criteria generation, framework mapping, ISO mapping, NIST mapping, auto-generate, chunk document, embed criteria
- **Status:** STUB (Phase 3.5 — full activation Phase 3 MVP)
- **Version:** 1.0.0
- **Contract:** `.github/agents/criteria-generator-agent.md`
- **Pipeline Role:** LDCS→Supabase Step 3 (chunk + embed + write)
- **Domain Flag Index:** `.agent-workspace/maturion-agent/knowledge/domain-flag-index.md` → "Criteria Generation & Extraction"

---

### 4. maturity-scoring-agent
- **Domain:** Maturity score computation, gap analysis, improvement roadmaps
- **Expertise:** Domain maturity scoring (Levels 1–5), MPS coverage analysis, heat map generation, benchmarking
- **Apps:** MAT, Maturity Roadmap
- **Routing Keywords:** maturity, maturity score, maturity level, maturity assessment, score domain, compute maturity, maturity heat map, maturity gap, gap analysis
- **Status:** STUB (Phase 3.5 — full activation Phase 3 MVP)
- **Version:** 1.0.0
- **Contract:** `.github/agents/maturity-scoring-agent.md`
- **Domain Flag Index:** `.agent-workspace/maturion-agent/knowledge/domain-flag-index.md` → "MAT Maturity Assessment"

---

### 5. report-writer-agent
- **Domain:** Report generation (audit, maturity, executive, compliance)
- **Expertise:** Structured report composition, multi-format output (markdown, PDF stub), template management
- **Apps:** MAT
- **Routing Keywords:** report, generate report, audit report, maturity report, executive summary, compliance report, export report, write report
- **Status:** STUB (Phase 3.5 — full activation Phase 3 MVP)
- **Version:** 1.0.0
- **Contract:** `.github/agents/report-writer-agent.md`
- **Domain Flag Index:** `.agent-workspace/maturion-agent/knowledge/domain-flag-index.md` → "MAT Report Generation"

---

### 6. document-parser-agent
- **Domain:** Document ingestion and structural parsing
- **Expertise:** PDF/DOCX/markdown extraction, Domain→MPS→Criteria structure detection, LDCS format recognition
- **Apps:** MAT
- **Routing Keywords:** LDCS, import document, upload document, parse document, ingest document, import LDCS, parse LDCS, document ingestion
- **Status:** STUB (Phase 3.5 — full activation Phase 3 MVP)
- **Version:** 1.0.0
- **Contract:** `.github/agents/document-parser-agent.md`
- **Pipeline Role:** LDCS→Supabase Step 2 (parse raw document)
- **Domain Flag Index:** `.agent-workspace/maturion-agent/knowledge/domain-flag-index.md` → "LDCS Document Import"

---

### 7. pit-specialist
- **Domain:** PIT app workflows, threat intelligence feeds, IOC management, TTP correlation, vulnerability tracking
- **Expertise:** STIX/TAXII feed ingestion, MITRE ATT&CK TTP mapping, IOC lifecycle management, vulnerability prioritisation (CVSS), threat hunting workflows
- **Apps:** PIT
- **Routing Keywords:** threat intelligence, threat feed, IOC, indicator of compromise, TTP, MITRE, ATT&CK, threat hunting, feed configuration, vulnerability tracking, CVE, STIX, TAXII, kill chain
- **Status:** ACTIVE
- **Version:** 1.0.0
- **Contract:** `.github/agents/pit-specialist.md`
- **Domain Flag Index:** `.agent-workspace/maturion-agent/knowledge/domain-flag-index.md` → "PIT Threat Intelligence"

---

## Future Specialists (Phase 5+)


### 8. xdetect-specialist
- **Domain:** XDETECT workflows, contraband detection protocols, privacy compliance
- **Status:** PLANNED (Phase 5)

### 9. maturity-roadmap-specialist
- **Domain:** Gap analysis, improvement planning, maturity progression roadmaps
- **Status:** PLANNED (Phase 5)

### 10. security-controls-agent
- **Domain:** ISO 27001, NIST CSF, CIS Controls definitions and mappings
- **Status:** PLANNED (Phase 5)

### 11. image-generation-agent
- **Domain:** Diagrams, infographics, architecture visualizations
- **Status:** PLANNED (Phase 5)

### 12. code-interpreter-agent
- **Domain:** Statistical analysis, data visualization, computational tasks
- **Status:** PLANNED (Phase 5)

---

## Registry Management Protocol

### Adding a Specialist

**Process:**
1. CS2 creates issue for new specialist (domain, expertise, apps, routing keywords)
2. CodexAdvisor loads `governance/checklists/SPECIALIST_AGENT_CONTRACT_REQUIREMENTS_CHECKLIST.md`
3. CodexAdvisor creates specialist contract (`.github/agents/{specialist-id}.md`)
4. CodexAdvisor creates specialist knowledge base (`.agent-workspace/{specialist-id}/knowledge/`)
5. PR review + CS2 approval
6. **Register specialist in this file** (add entry above)
7. Add routing rules to `routing-rules.md`
8. Commit changes

**Entry Format:**
```markdown
## <specialist-id>
- **Domain:** <Domain expertise>
- **Expertise:** <Specific capabilities>
- **Apps:** <Supported apps>
- **Routing Keywords:** <Comma-separated keywords>
- **Status:** ACTIVE
- **Version:** <semver>
- **Contract:** `.github/agents/<specialist-id>.md`
```

---

### Updating a Specialist

**Process:**
1. CS2 creates issue for specialist update (scope expansion, knowledge base update, etc.)
2. CodexAdvisor updates specialist contract (if needed)
3. CodexAdvisor updates specialist knowledge base (if needed)
4. PR review + CS2 approval
5. **Update specialist entry in this file** (version bump, expertise update, etc.)
6. Update routing rules (if routing keywords changed)
7. Commit changes

---

### Decommissioning a Specialist

**Process:**
1. CS2 creates issue for specialist decommissioning (reason: obsolete, scope merged, replaced, etc.)
2. CodexAdvisor updates specialist status in this file: `Status: DECOMMISSIONED (YYYY-MM-DD)`
3. CodexAdvisor archives specialist knowledge base to `.agent-workspace/{specialist-id}/.archive/`
4. CodexAdvisor removes routing rules from `routing-rules.md`
5. CodexAdvisor documents decommissioning reason in entry
6. PR review + CS2 approval
7. Commit changes

**Decommissioned Entry Format:**
```markdown
## <specialist-id> (DECOMMISSIONED YYYY-MM-DD)
- **Domain:** <Domain expertise>
- **Decommissioning Reason:** <Obsolete | Scope merged into X | Replaced by Y>
- **Archived Knowledge Base:** `.agent-workspace/<specialist-id>/.archive/`
- **Original Contract:** `.github/agents/<specialist-id>.md` (archived)
```

---

## Specialist Availability Monitoring

**Health Check Protocol:**
At session initialization, Maturion pings all ACTIVE specialists:
```typescript
for (const specialist of specialistRegistry) {
  if (specialist.status === 'ACTIVE') {
    const pingResult = await pingSpecialist(specialist.id);
    if (pingResult.timeout) {
      logUnavailability(specialist.id);
      createIssue(`Specialist ${specialist.id} unavailable`, 'CS2');
    }
  }
}
```

**Unavailability Handling:**
- Log unavailability in session memory
- Escalate to CS2 if specialist repeatedly unavailable (>3 consecutive sessions)
- Fallback: Orchestrator direct response (if within capability) OR return to user: "The [Specialist Name] is currently unavailable. I can provide a basic response, or you can retry later."

---

**Authority:** CS2 (Johan Ras)  
**Status:** Phase 4-5 (7 specialists: 6 MAT stubs + 1 PIT active)  
**Version:** 2.1.0  
**Date:** 2026-02-21  
**Canonical Reference:** `governance/canon/ORCHESTRATOR_SPECIALIST_ARCHITECTURE.md` Section 10 (Specialist Lifecycle)
