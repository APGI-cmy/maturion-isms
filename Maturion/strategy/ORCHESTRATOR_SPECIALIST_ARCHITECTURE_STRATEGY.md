# ORCHESTRATOR + SPECIALIST ARCHITECTURE STRATEGY

**Version:** 1.0.0  
**Status:** Strategy (Conceptual — ~70% accurate, subject to refinement)  
**Authority:** CS2 (Johan Ras)  
**Date:** 2026-02-20  
**Purpose:** Define complete governance structure for orchestrator (Maturion) + specialist agent architecture

---

## Executive Summary

This strategy defines how **ONE Maturion agent orchestrates MULTIPLE specialist agents** across ALL ISMS apps (MAT, PIT, XDETECT, etc.) while maintaining:

- **Unified identity** (one intelligence, multiple embodiments)
- **App-context awareness** (knows which app, module, user context)
- **Cross-app learning** (correlates insights across MAT, PIT, XDETECT)
- **Transparent + invisible delegation** (user sees specialist when educational, seamless when mechanical)
- **Validation gates** (Guardian, Sentinel, Arbiter watchdogs on all specialist outputs)

**Key Architectural Decision:**
- ✅ **ONE orchestrator (Maturion)** for entire ISMS platform
- ✅ **MULTIPLE specialists** with focused domain expertise (risk-platform-agent, mat-specialist, criteria-generator-agent, etc.)
- ✅ **Constitutional alignment** with Maturion identity docs (Maturion/, 13 files)

---

## Governance Hierarchy (Three Tiers)

### Tier 1: STRATEGY LEVEL (Maturion/)

**Location:** `Maturion/`

**Purpose:** Constitutional documents defining Maturion's identity, mission, guardrails

**Authority:** CS2 (Johan Ras) — Immutable except through ARC approval

**Status:** COMPLETE (13 existing files)

**Files:**
1. `maturion-identity.md` — WHO Maturion is (ONE intelligence across ALL apps)
2. `maturion-true-north.md` — Mission, purpose, principles, risk worldview
3. `oversight-system.md` — Guardian, Sentinel, Arbiter watchdog architecture
4. `maturion-self-learning-governance.md` — Learning rules (Tier 1-4), prohibited/allowed learning
5. `maturion-incident-taxonomy.md` — Complete incident classification system
6. `embodiment-calibration-engine-spec.md` — Embodiment behavior baselines, drift prevention
7. `platform-tree-architecture.md` — Platform Tree visualization, health monitoring
8. `platform-tree-metrics-engine-spec.md` — Health, risk, stability metrics
9. `XDETECT` — XDETECT app description (contraband detection)
10. `XDETECT_POINTER.md` — Canonical pointer to modules/xdetect/

**Governance Role:**
- These documents are the **constitutional foundation**
- All canon-level and execution-level governance **DERIVES from these**
- Orchestrator/specialist pattern **MUST align** with multi-embodiment identity

**No changes needed** — These files anchor the entire governance structure

---

### Tier 2: CANON LEVEL (governance/canon/)

**Location:** `governance/canon/`

**Purpose:** Canonical governance defining orchestrator/specialist pattern, delegation protocols, knowledge management

**Authority:** CS2 (Johan Ras)

**Status:** PUBLIC_API (hash-tracked in CANON_INVENTORY.json, ripple-enabled across repos)

**Required NEW Files (5):**

#### Canon File 1: `ORCHESTRATOR_SPECIALIST_ARCHITECTURE.md`

**Purpose:** Define canonical architecture for orchestrator + specialist agents

**Key Content:**
- Orchestrator role (coordinate specialists, synthesize responses, maintain session continuity)
- Specialist role (deep domain expertise, authorized callers, independent memory)
- Interaction pattern (query flow, transparent vs. invisible delegation)
- Multi-specialist chaining (complex tasks requiring multiple specialists)
- Validation gates (Guardian, Sentinel, Arbiter on all specialist outputs)
- Session memory architecture (orchestrator centralized, specialist domain-specific)
- Knowledge base management (orchestrator registry, specialist domain knowledge)
- Agent class taxonomy (orchestrator, specialist, builder, foreman, liaison, overseer)
- Governance alignment (constitutional derivation, 4-component structure)
- Specialist lifecycle (creation, registration, decommissioning)
- Extensibility (adding new specialists/apps)
- Quality metrics (orchestrator + specialist dashboards)

**Derived From:**
- `Maturion/maturion-identity.md` (multi-embodiment model)
- `Maturion/maturion-true-north.md` (mission and principles)
- `governance/canon/AGENT_CONTRACT_ARCHITECTURE.md` (4-component structure)

---

#### Canon File 2: `AGENT_DELEGATION_PROTOCOL.md`

**Purpose:** Define canonical protocol for orchestrator → specialist delegation

**Key Content:**
- Delegation request format (JSON payload: from, to, task, transparency, context, input, requirements)
- Delegation response format (status, output, metadata, execution time, confidence)
- Transparency decision criteria (visible vs. invisible delegation rules)
- Validation gates (pre-delegation: specialist availability, scope check; post-delegation: Guardian/Sentinel/Arbiter)
- Multi-specialist chaining (chain definition, execution protocol, failure handling)
- Error handling (specialist unavailable, out-of-scope, watchdog violation)
- Session memory capture (orchestrator delegation log, specialist task execution log)
- Quality metrics (delegation accuracy, validation pass rate, specialist performance)

**Derived From:**
- `governance/canon/ORCHESTRATOR_SPECIALIST_ARCHITECTURE.md`
- `Maturion/oversight-system.md` (watchdog validation)

---

#### Canon File 3: `SPECIALIST_KNOWLEDGE_MANAGEMENT.md`

**Purpose:** Define how specialists maintain and update domain knowledge bases

**Key Content:**
- Knowledge base structure (standard directory layout, domain-specific organization)
- Knowledge update protocol (self-learning tiers 1-4, approval requirements)
- Knowledge versioning (version tracking, SHA256 checksums for critical knowledge)
- Cross-specialist knowledge boundaries (prohibited sharing, allowed via orchestrator coordination)
- Knowledge deprecation (when to deprecate, protocol, archival)
- Knowledge audit trail (required elements, example audit log)

**Derived From:**
- `Maturion/maturion-self-learning-governance.md` (Tier 1-4 learning rules)
- `governance/canon/ORCHESTRATOR_SPECIALIST_ARCHITECTURE.md`

---

#### Canon File 4: `MULTI_EMBODIMENT_ORCHESTRATION_MODEL.md`

**Purpose:** Define how ONE Maturion orchestrates across MULTIPLE apps (MAT, PIT, XDETECT)

**Key Content:**
- App context model (supported apps: MAT, PIT, XDETECT, Maturity Roadmap, Builder, Command)
- Embodiment switching (Risk-Maturion, Builder-Maturion, Command-Maturion)
- Cross-app session continuity (unified session memory, cross-app learning, context awareness)
- App-specific knowledge loading (dynamic loading based on app context)
- Specialist routing by app context (app → specialist mapping, routing logic)
- Constitutional alignment verification (identity consistency check, situational awareness check)

**Derived From:**
- `Maturion/maturion-identity.md` (ONE intelligence requirement)
- `Maturion/maturion-true-north.md` (situational awareness requirement)

---

#### Canon File 5: `AGENT_CONTRACT_ARCHITECTURE.md` (UPDATE REQUIRED)

**Purpose:** Generalize 4-phase architecture → 4-component architecture

**Current:**
```
Preflight → Induction → Build → Handover
```

**Generalized (NEW):**
```
Component 1: Preflight & Governance Alignment
Component 2: Induction (Session Initialization)
Component 3: During Process (Orchestration | Execution | Build | Supervision)
Component 4: Closure (Quality Assurance)
```

**Why:**
- "Build" is too builder-specific
- "During Process" covers ALL agent types (orchestrator orchestrates, specialist executes, builder builds, foreman supervises)
- "Closure" more general than "Handover" (wrapping up, quality checks, memory capture)

**Impact:** ALL future agent contracts use 4-component structure

---

### Tier 3: EXECUTION LEVEL (governance/checklists/ + governance/templates/)

**Location:** 
- `governance/checklists/`
- `governance/templates/`

**Purpose:** Checklists and templates for creating orchestrator/specialist agents

**Authority:** CS2 (Johan Ras)

**Status:** INTERNAL_CANON (ripple-enabled)

**Required NEW Files (5):**

#### Checklist 1: `ORCHESTRATOR_AGENT_CONTRACT_REQUIREMENTS_CHECKLIST.md`

**Purpose:** 100% compliance validation for orchestrator agent contracts

**Key Requirements:**
- [ ] YAML frontmatter includes `agent.class: orchestrator`
- [ ] Specialist registry defined (list of available specialists, domains, expertise)
- [ ] Delegation protocol implemented (transparent + invisible delegation logic)
- [ ] Validation gates enforced (Guardian, Sentinel, Arbiter checks on all specialist outputs)
- [ ] Multi-specialist chaining logic documented
- [ ] Routing intelligence defined (query → specialist selection rules)
- [ ] Session memory includes specialist call logs
- [ ] Cross-app context awareness implemented
- [ ] Constitutional alignment verified (Maturion identity docs)
- [ ] Character count <30,000 (GitHub UI selectability)

---

#### Checklist 2: `SPECIALIST_AGENT_CONTRACT_REQUIREMENTS_CHECKLIST.md`

**Purpose:** 100% compliance validation for specialist agent contracts

**Key Requirements:**
- [ ] YAML frontmatter includes `agent.class: specialist`
- [ ] Domain expertise clearly scoped (e.g., "risk management, threat analysis")
- [ ] Authorized orchestrator(s) defined (e.g., "maturion-agent")
- [ ] Task reception protocol implemented (receive task, parse context)
- [ ] Domain-specific validation rules defined
- [ ] Return-to-orchestrator protocol implemented (status, output, metadata)
- [ ] Knowledge base location defined (`.agent-workspace/{specialist-name}/knowledge/`)
- [ ] Out-of-scope escalation logic (return to orchestrator with "escalate" status)
- [ ] Self-learning governance aligned (Tier 1-4 rules)
- [ ] Character count <30,000

---

#### Template 1: `ORCHESTRATOR_AGENT_TEMPLATE.md`

**Purpose:** Template for creating orchestrator agent contracts

**Structure (4 components):**

**Component 1: Preflight & Governance Alignment**
- Identity & authority
- Constitutional bindings (Maturion identity docs)
- Specialist registry
- Watchdog activation (Guardian, Sentinel, Arbiter)
- App-context detection

**Component 2: Induction (Session Initialization)**
- App context detection (MAT, PIT, XDETECT, etc.)
- User context loading (role, org, industry, maturity)
- Session memory loading (prior interactions across apps)
- Specialist availability check
- Embodiment activation (Risk, Builder, Command)

**Component 3: During Process (Orchestration)**
- Query analysis (intent detection, specialist selection)
- Delegation protocol (transparent vs. invisible)
- Validation gates (Guardian, Sentinel, Arbiter)
- Multi-specialist chaining
- Response synthesis (framing, context, follow-up suggestions)

**Component 4: Closure (Quality Assurance)**
- Response completeness check
- Governance validation (final watchdog check)
- Session memory capture (delegation log, learnings)
- Quality metrics logging (routing accuracy, validation pass rate)

---

#### Template 2: `SPECIALIST_AGENT_TEMPLATE.md`

**Purpose:** Template for creating specialist agent contracts

**Structure (4 components):**

**Component 1: Preflight & Governance Alignment**
- Identity & authority
- Domain scope definition
- Authorized orchestrator(s)
- Knowledge base location
- Watchdog constraints (Arbiter supervision for learning)

**Component 2: Induction (Task Reception)**
- Receive task from orchestrator (JSON payload)
- Parse user context (role, org, app, prior work)
- Load domain knowledge base
- Verify task within scope (escalate if out-of-scope)

**Component 3: During Process (Execution)**
- Execute domain-specific logic
- Apply domain expertise
- Validate output against domain standards
- Package response (status, output, metadata)

**Component 4: Closure (Return to Orchestrator)**
- Return structured response
- Document task execution in session memory
- Update knowledge base (if Tier 2/3 learning triggered)
- Log quality metrics (execution time, confidence level)

---

#### Template 3: `DELEGATION_PROTOCOL_IMPLEMENTATION_GUIDE.md`

**Purpose:** Step-by-step guide for implementing delegation in orchestrator contracts

**Key Sections:**
- How to format delegation request
- How to select transparency mode (visible vs. invisible)
- How to validate specialist response
- How to handle multi-specialist chains
- How to capture delegation in session memory

---

## Agent Class Taxonomy (UPDATED)

| Agent Class | Role | Examples | Authority Model | New? |
|-------------|------|----------|-----------------|------|
| **orchestrator** | Coordinate specialists, synthesize responses | maturion-agent | RAEC (Review-Advise-Escalate-Coordinate) | ✅ NEW |
| **specialist** | Deep domain expertise | risk-platform-agent, mat-specialist | EXECUTE (within domain scope) | ✅ NEW |
| **builder** | Code implementation | ui-builder, api-builder | IMPLEMENT (within wave scope) | Existing |
| **foreman** | Build supervision | foreman-agent | POLC (Plan-Organize-Lead-Control) | Existing |
| **liaison** | Cross-repo governance sync | governance-liaison | SYNC (receive/validate canonical governance) | Existing |
| **overseer** | Agent factory, governance advisor | CodexAdvisor-agent | RAEC (approval-gated creation) | Existing |

**Impact on CodexAdvisor:**
- Must support **orchestrator** and **specialist** agent classes
- Must load **orchestrator checklist** and **specialist checklist**
- Must validate agent contracts against appropriate template

---

## Initial Specialist Roster (MVP)

**Phase 1 (Immediate):**

1. **risk-platform-agent**
   - Domain: Risk management, threat analysis, vulnerability assessment, control frameworks
   - Expertise: Threat taxonomies (insider, external, cyber, physical), control effectiveness, risk scoring
   - Routing Keywords: threat, vulnerability, risk, control, incident, mitigation
   - Apps: ALL (MAT, PIT, XDETECT, Maturity Roadmap)

2. **mat-specialist**
   - Domain: MAT app workflows, LDCS expertise, audit lifecycle
   - Expertise: Domain → MPS → Criteria structure, maturity scoring, evidence collection
   - Routing Keywords: MAT, LDCS, audit, criteria, MPS, domain, maturity
   - Apps: MAT

3. **criteria-generator-agent**
   - Domain: Document parsing, criteria extraction
   - Expertise: LDCS/ISO/NIST parsing, Domain→MPS→Criteria mapping, markdown structure analysis
   - Routing Keywords: import, parse, extract, criteria, document, upload
   - Apps: MAT

**Phase 2 (Future):**

4. **report-writer-agent** (DOCX/PDF/Excel generation)
5. **security-controls-agent** (ISO 27001, NIST CSF control definitions)
6. **pit-specialist** (PIT app workflows, threat intelligence feeds)
7. **xdetect-specialist** (XDETECT workflows, detection protocols, privacy compliance)
8. **maturity-roadmap-specialist** (gap analysis, improvement planning)
9. **image-generation-agent** (diagrams, infographics, architecture visualizations)
10. **code-interpreter-agent** (statistical analysis, data visualization)

---

## Implementation Phases (Batched Approach)

### Phase 1: Foundation (Governance + CodexAdvisor Update)

**Objective:** Create canonical governance and update CodexAdvisor to support orchestrator/specialist

**Deliverables:**
1. Create 5 canon files in `governance/canon/`
2. Create 2 checklists in `governance/checklists/`
3. Create 3 templates in `governance/templates/`
4. Update `governance/canon/AGENT_CONTRACT_ARCHITECTURE.md` (4-phase → 4-component)
5. Update CodexAdvisor agent file to support orchestrator/specialist classes
6. Update CANON_INVENTORY.json with new file hashes

**Validation:**
- All canon files <30K characters
- All canon files pass governance alignment check
- CodexAdvisor can create orchestrator contracts
- CodexAdvisor can create specialist contracts

**Estimated Effort:** High (foundational work)

---

### Phase 2: Maturion Orchestrator Creation

**Objective:** Create Maturion orchestrator agent contract

**Deliverables:**
1. `.github/agents/maturion-agent.md` (orchestrator contract)
2. `.agent-workspace/maturion-agent/knowledge/specialist-registry.md`
3. `.agent-workspace/maturion-agent/knowledge/routing-rules.md`
4. `.agent-workspace/maturion-agent/knowledge/constitutional-bindings.md`

**Validation:**
- Maturion contract passes orchestrator checklist (100%)
- Character count <30,000
- Constitutional alignment verified (references all 13 Maturion/ strategy docs)
- Specialist registry initialized (empty, ready for Phase 3)

**Estimated Effort:** Medium

---

### Phase 3: Initial Specialist Creation (MVP Trio)

**Objective:** Create first 3 specialists (risk-platform-agent, mat-specialist, criteria-generator-agent)

**Deliverables:**
1. `.github/agents/risk-platform-agent.md`
2. `.github/agents/mat-specialist.md`
3. `.github/agents/criteria-generator-agent.md`
4. Knowledge bases for each specialist
5. Register specialists in Maturion's specialist-registry.md

**Validation:**
- All specialist contracts pass specialist checklist (100%)
- Character count <30,000 each
- Domain scopes clearly defined (no overlap)
- Maturion can route to all 3 specialists

**Estimated Effort:** High (3 specialist contracts)

---

### Phase 4: Integration Testing

**Objective:** Validate orchestrator + specialist pattern end-to-end

**Test Scenarios:**
1. **Transparent delegation:** User asks MAT question → Maturion calls mat-specialist (visible)
2. **Invisible delegation:** User requests report → Maturion calls mat-specialist + report-writer-agent (seamless)
3. **Multi-specialist chain:** User imports LDCS + requests risk heat map → criteria-generator-agent → mat-specialist → risk-platform-agent
4. **Cross-app context:** User works in MAT, switches to PIT → Maturion maintains session continuity
5. **Watchdog validation:** Specialist returns cross-tenant data → Guardian blocks, escalates

**Validation:**
- All test scenarios pass
- Session memory captures delegation logs
- Quality metrics logged
- No constitutional violations

**Estimated Effort:** Medium

---

### Phase 5: Future Specialists (Expandable)

**Objective:** Add specialists as needed for new apps/capabilities

**Examples:**
- pit-specialist (when PIT app ready)
- xdetect-specialist (when XDETECT app ready)
- report-writer-agent (when reporting required)
- image-generation-agent (when visualizations needed)

**Process:**
1. CS2 creates issue for new specialist
2. CodexAdvisor loads specialist checklist
3. CodexAdvisor creates specialist contract
4. PR review + approval
5. Register specialist in Maturion's registry

**Estimated Effort:** Low per specialist (template-driven)

---

## Key Architectural Decisions

### Decision 1: ONE Maturion vs. Separate Agents Per App

**Decision:** ✅ ONE Maturion orchestrator for ALL apps (MAT, PIT, XDETECT, etc.)

**Rationale:**
- Constitutional requirement (`Maturion/maturion-identity.md`: "ONE intelligence, ONE memory framework")
- Cross-app learning (insights from MAT apply to PIT)
- Unified user experience (seamless app switching)
- Operational simplicity (one orchestrator to maintain, not N)

**Alternative Rejected:** ❌ Separate mat-maturion, pit-maturion, xdetect-maturion
- Violates constitutional identity requirement
- No cross-app learning
- Fragmented user experience

---

### Decision 2: Transparent vs. Invisible Delegation Default

**Decision:** ✅ **Transparent by default** for novel domain expertise, **invisible for mechanical tasks**

**Rationale:**
- Educational value (user learns specialist mapping)
- Trust-building (transparency about decision-making)
- But invisible when user doesn't need to know (data fetching, formatting)

**Criteria:**
- Novel domain expertise → Transparent (e.g., "Let me consult the Risk Platform Agent...")
- Mechanical/operational → Invisible (e.g., fetching data, formatting Excel)

---

### Decision 3: Specialist Knowledge Base Independence

**Decision:** ✅ Specialists have **independent knowledge bases**, coordinated via orchestrator

**Rationale:**
- No cross-contamination (mat-specialist doesn't learn threat taxonomy from risk-platform-agent)
- Clear domain boundaries (Arbiter enforces)
- Scalable (add new specialist without touching existing knowledge bases)

**Alternative Rejected:** ❌ Shared knowledge base
- Risk of cross-specialist contamination
- Unclear ownership
- Arbiter can't enforce boundaries

---

### Decision 4: 4-Phase → 4-Component Generalization

**Decision:** ✅ Rename "Build" → "During Process", "Handover" → "Closure"

**Rationale:**
- "Build" is builder-specific (orchestrators don't "build")
- "During Process" covers orchestration, execution, supervision
- "Closure" more general than "Handover" (quality checks, memory capture)
- Makes architecture applicable to ALL agent types

---

## Success Criteria

### Governance Success

- ✅ All 5 canon files created and hash-tracked in CANON_INVENTORY.json
- ✅ All 2 checklists enforce 100% compliance
- ✅ All 3 templates provide complete implementation guidance
- ✅ CodexAdvisor supports orchestrator + specialist creation

### Maturion Success

- ✅ Maturion orchestrator contract passes checklist
- ✅ Maturion maintains ONE identity across ALL apps
- ✅ Maturion routes to specialists correctly (>90% accuracy)
- ✅ Session memory captures cross-app learnings

### Specialist Success

- ✅ All 3 MVP specialists pass checklist
- ✅ Specialists stay within domain boundaries (Arbiter enforces)
- ✅ Specialists update knowledge bases safely (Tier 2/3 learning)
- ✅ No cross-specialist contamination

### User Experience Success

- ✅ Transparent delegation builds trust (user sees specialist when educational)
- ✅ Invisible delegation is seamless (user doesn't see mechanical routing)
- ✅ Multi-specialist chains complete complex tasks
- ✅ Cross-app context awareness works (MAT → PIT session continuity)

---

## Risks & Mitigations

### Risk 1: Orchestrator Contract Exceeds 30K Characters

**Impact:** HIGH (GitHub UI selectability breaks)

**Likelihood:** MEDIUM

**Mitigation:**
- Use references instead of duplication
- Link to canonical docs instead of embedding
- Compact formatting
- Move large templates to `governance/templates/`

---

### Risk 2: Specialist Routing Errors (Wrong Specialist Selected)

**Impact:** MEDIUM (user confusion, incorrect responses)

**Likelihood:** MEDIUM (routing intelligence needs tuning)

**Mitigation:**
- Start with explicit routing rules (keyword-based)
- Capture routing errors in session memory
- Learn patterns over time (Tier 2 learning)
- Escalate to orchestrator if specialist out-of-scope

---

### Risk 3: Cross-Specialist Knowledge Contamination

**Impact:** HIGH (violates Arbiter boundaries)

**Likelihood:** LOW (Arbiter blocks)

**Mitigation:**
- Arbiter enforces memory boundaries
- Specialists cannot access other specialist knowledge bases
- Knowledge sharing ONLY via orchestrator coordination
- Regular Arbiter audits

---

### Risk 4: Watchdog Validation Performance Overhead

**Impact:** MEDIUM (slower response times)

**Likelihood:** MEDIUM

**Mitigation:**
- Optimize Guardian/Sentinel/Arbiter checks
- Cache validation results where safe
- Parallel validation (Guardian, Sentinel, Arbiter run concurrently)
- Monitor validation latency metrics

---

## Open Questions (To Be Resolved in Implementation)

1. **Specialist API Integration:**
   - How do frontends (MAT, PIT, XDETECT) call Maturion?
   - REST API? GraphQL? gRPC?
   - Request format (JSON payload structure)?

2. **Specialist Execution Environment:**
   - Do specialists run as separate services?
   - Or are they loaded modules within Maturion runtime?
   - Deployment architecture?

3. **Watchdog Implementation:**
   - Are Guardian, Sentinel, Arbiter separate services?
   - Or runtime modules within orchestrator?
   - Real-time validation vs. async post-validation?

4. **Knowledge Base Storage:**
   - Git-tracked markdown files (current approach)?
   - Vector database for semantic search?
   - Hybrid (markdown + vector embeddings)?

5. **Session Memory Persistence:**
   - Git-tracked markdown files (current approach)?
   - Database (PostgreSQL, MongoDB)?
   - Hybrid (recent sessions in DB, archived in git)?

---

## References

### Constitutional Documents (Strategy Level)

- `Maturion/maturion-identity.md` — ONE Maturion, unified identity
- `Maturion/maturion-true-north.md` — Mission, principles, situational awareness
- `Maturion/oversight-system.md` — Guardian, Sentinel, Arbiter watchdogs
- `Maturion/maturion-self-learning-governance.md` — Learning tiers, prohibited/allowed learning

### Canonical Governance (To Be Created)

- `governance/canon/ORCHESTRATOR_SPECIALIST_ARCHITECTURE.md` (Canon File 1)
- `governance/canon/AGENT_DELEGATION_PROTOCOL.md` (Canon File 2)
- `governance/canon/SPECIALIST_KNOWLEDGE_MANAGEMENT.md` (Canon File 3)
- `governance/canon/MULTI_EMBODIMENT_ORCHESTRATION_MODEL.md` (Canon File 4)
- `governance/canon/AGENT_CONTRACT_ARCHITECTURE.md` (UPDATE: 4-phase → 4-component)

### Execution Templates (To Be Created)

- `governance/checklists/ORCHESTRATOR_AGENT_CONTRACT_REQUIREMENTS_CHECKLIST.md`
- `governance/checklists/SPECIALIST_AGENT_CONTRACT_REQUIREMENTS_CHECKLIST.md`
- `governance/templates/ORCHESTRATOR_AGENT_TEMPLATE.md`
- `governance/templates/SPECIALIST_AGENT_TEMPLATE.md`
- `governance/templates/DELEGATION_PROTOCOL_IMPLEMENTATION_GUIDE.md`

---

**Authority:** CS2 (Johan Ras)  
**Status:** Strategy (Conceptual — ~70% accurate, subject to refinement during implementation)  
**Version:** 1.0.0  
**Date:** 2026-02-20  
**Next Steps:** 
1. Review and approve strategy
2. Create batched implementation issues (Phase 1-5)
3. Begin Phase 1 (Foundation: Governance + CodexAdvisor update)