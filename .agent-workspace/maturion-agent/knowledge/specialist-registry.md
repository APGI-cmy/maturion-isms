# Specialist Registry

**Purpose:** Active specialists available to Maturion orchestrator  
**Location:** `.agent-workspace/maturion-agent/knowledge/specialist-registry.md`  
**Authority:** CS2 (Johan Ras)  
**Status:** Phase 2 (Empty - ready for Phase 3 specialist registration)

---

## Active Specialists

**Current Status:** No specialists registered yet (Phase 3 pending)

**Phase 3 MVP Specialists (To Be Registered):**

### 1. risk-platform-agent
- **Domain:** Risk management, threat analysis, vulnerability assessment, control frameworks
- **Expertise:** Threat taxonomies (insider, external, cyber, physical), control effectiveness, risk scoring, incident classification
- **Apps:** ALL (MAT, PIT, XDETECT, Maturity Roadmap, Builder, Command)
- **Routing Keywords:** threat, vulnerability, risk, control, incident, mitigation, attack, exploit, breach, exposure
- **Status:** PENDING (Phase 3)
- **Version:** TBD
- **Contract:** `.github/agents/risk-platform-agent.md` (to be created)

---

### 2. mat-specialist
- **Domain:** MAT app workflows, LDCS expertise, audit lifecycle, maturity assessment
- **Expertise:** Domain → MPS → Criteria structure, maturity scoring, evidence collection, audit planning, compliance mapping
- **Apps:** MAT
- **Routing Keywords:** MAT, LDCS, audit, criteria, MPS, domain, maturity, assessment, evidence, compliance, ISO, NIST
- **Status:** PENDING (Phase 3)
- **Version:** TBD
- **Contract:** `.github/agents/mat-specialist.md` (to be created)

---

### 3. criteria-generator-agent
- **Domain:** Document parsing, criteria extraction, framework mapping
- **Expertise:** LDCS/ISO/NIST document parsing, Domain→MPS→Criteria mapping, markdown structure analysis, automated criteria generation
- **Apps:** MAT
- **Routing Keywords:** import, parse, extract, criteria, document, upload, LDCS, ISO, NIST, framework, generate
- **Status:** PENDING (Phase 3)
- **Version:** TBD
- **Contract:** `.github/agents/criteria-generator-agent.md` (to be created)

---

## Future Specialists (Phase 4+)

### 4. pit-specialist
- **Domain:** PIT app workflows, threat intelligence feeds, vulnerability tracking
- **Status:** PLANNED (Phase 4)

### 5. xdetect-specialist
- **Domain:** XDETECT workflows, contraband detection protocols, privacy compliance
- **Status:** PLANNED (Phase 4)

### 6. maturity-roadmap-specialist
- **Domain:** Gap analysis, improvement planning, maturity progression roadmaps
- **Status:** PLANNED (Phase 4)

### 7. report-writer-agent
- **Domain:** DOCX/PDF/Excel generation, report formatting, template management
- **Status:** PLANNED (Phase 5)

### 8. security-controls-agent
- **Domain:** ISO 27001, NIST CSF, CIS Controls definitions and mappings
- **Status:** PLANNED (Phase 5)

### 9. image-generation-agent
- **Domain:** Diagrams, infographics, architecture visualizations
- **Status:** PLANNED (Phase 5)

### 10. code-interpreter-agent
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
**Status:** Phase 2 (Empty - ready for Phase 3)  
**Version:** 1.0.0  
**Date:** 2026-02-20  
**Canonical Reference:** `governance/canon/ORCHESTRATOR_SPECIALIST_ARCHITECTURE.md` Section 10 (Specialist Lifecycle)
