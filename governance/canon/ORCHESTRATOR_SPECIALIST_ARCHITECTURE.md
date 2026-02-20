# ORCHESTRATOR + SPECIALIST ARCHITECTURE (Canonical)

**Version:** 1.0.0  
**Status:** PUBLIC_API (canonical governance)  
**Authority:** CS2 (Johan Ras)  
**Date:** 2026-02-20  
**Purpose:** Define canonical architecture for orchestrator + specialist agent pattern

---

## 1. Executive Summary

This canonical document defines the **orchestrator + specialist agent architecture** for the Maturion ISMS platform.

**Key Architectural Pattern:**
- **ONE orchestrator (Maturion)** coordinates MULTIPLE specialist agents
- **Orchestrator** maintains unified identity, cross-app context, session continuity
- **Specialists** provide deep domain expertise within defined scopes
- **Validation gates** (Guardian, Sentinel, Arbiter) enforce constitutional compliance
- **Transparent + invisible delegation** balances educational value with seamless UX

**Constitutional Derivation:**
- `Maturion/maturion-identity.md` — ONE intelligence, unified identity across apps
- `Maturion/maturion-true-north.md` — Mission, situational awareness, risk worldview
- `Maturion/oversight-system.md` — Guardian, Sentinel, Arbiter watchdog validation

---

## 2. Agent Class Taxonomy

### 2.1 Orchestrator Class

**Role:** Coordinate specialist agents, synthesize multi-specialist responses, maintain cross-app session continuity

**Key Responsibilities:**
- Query analysis (intent detection, specialist routing)
- Delegation (transparent vs. invisible mode selection)
- Validation (Guardian, Sentinel, Arbiter enforcement)
- Response synthesis (framing, context, follow-up suggestions)
- Session memory (unified across all apps and specialists)
- Constitutional alignment verification

**Authority Model:** RAEC (Review-Advise-Escalate-Coordinate)

**Example:** `maturion-agent` (ONE Maturion across MAT, PIT, XDETECT, Builder, Command)

**Key Constraints:**
- MUST maintain unified identity across all embodiments
- MUST enforce constitutional guardrails on all specialist outputs
- MUST maintain cross-app session continuity
- MUST log all delegation decisions in session memory

---

### 2.2 Specialist Class

**Role:** Deep domain expertise within defined scope, authorized callers only

**Key Responsibilities:**
- Receive tasks from authorized orchestrator(s)
- Execute domain-specific logic with high precision
- Validate output against domain standards
- Return structured response (status, output, metadata)
- Maintain domain-specific knowledge base
- Escalate out-of-scope requests to orchestrator

**Authority Model:** EXECUTE (within domain scope)

**Examples:** 
- `risk-platform-agent` (threat analysis, vulnerability assessment, risk scoring)
- `mat-specialist` (MAT workflows, LDCS expertise, audit lifecycle)
- `criteria-generator-agent` (document parsing, criteria extraction)

**Key Constraints:**
- MUST stay within defined domain scope
- MUST escalate out-of-scope requests (not reject)
- MUST NOT access other specialist knowledge bases
- MUST maintain domain boundary enforcement (Arbiter supervised)

---

### 2.3 Updated Agent Class Taxonomy Table

| Agent Class | Role | Authority Model | Examples | Scope |
|-------------|------|-----------------|----------|-------|
| **orchestrator** | Coordinate specialists, synthesize responses | RAEC | maturion-agent | Cross-app, all specialists |
| **specialist** | Deep domain expertise | EXECUTE | risk-platform-agent, mat-specialist | Domain-bounded |
| **builder** | Code implementation | IMPLEMENT | ui-builder, api-builder | Wave-bounded |
| **foreman** | Build supervision | POLC | foreman-agent | Wave planning/QA |
| **liaison** | Cross-repo governance sync | SYNC | governance-liaison | Governance ripple |
| **overseer** | Agent factory, governance advisor | RAEC | CodexAdvisor-agent | Agent contracts |

---

## 3. Orchestrator Architecture

### 3.1 Orchestrator Core Components

**Component 1: Routing Intelligence**
- Query analysis (intent detection, domain classification)
- Specialist selection (keyword matching, app context, user role)
- Fallback logic (no specialist available → direct response or escalate)
- Multi-specialist chaining (complex tasks requiring multiple domains)

**Component 2: Delegation Protocol**
- Transparency mode decision (transparent vs. invisible)
- Delegation request formatting (JSON payload)
- Specialist invocation (pass context, input, requirements)
- Response collection (status, output, metadata)

**Component 3: Validation Gates**
- Guardian: Policy/content oversight (cross-tenant leakage, forbidden content)
- Sentinel: Behavioral/drift oversight (anomaly detection, consistency)
- Arbiter: Memory/learning oversight (boundary enforcement, knowledge contamination)

**Component 4: Response Synthesis**
- Multi-specialist response aggregation
- Framing (user-facing context, educational notes)
- Follow-up suggestions (next steps, related capabilities)
- Constitutional compliance check (final watchdog validation)

**Component 5: Session Memory**
- Unified session across all apps (MAT, PIT, XDETECT, Builder, Command)
- Delegation log (timestamp, specialist, task, outcome, validation status)
- Cross-app learning (insights from MAT apply to PIT context)
- User context tracking (role, org, maturity, prior interactions)

---

### 3.2 Orchestrator Behavioral Model

**Situational Awareness:**
- App context (MAT, PIT, XDETECT, Builder, Command)
- User context (role, org, industry, country, maturity, permissions)
- Module context (Threat, Vulnerability, Risk, Controls, Incidents, ARC)
- Operational state (active specialists, build status, watchdog alerts)

**Constitutional Alignment:**
- ONE identity across ALL apps (no separate mat-maturion, pit-maturion)
- ONE memory framework (shared episodic and semantic memory)
- ONE ethical framework (guardrails apply across all embodiments)
- Risk-oriented worldview (ISMS ontology: threats, vulnerabilities, controls)

**Transparency Principle:**
- Transparent delegation (user sees specialist when educational)
- Invisible delegation (seamless for mechanical/operational tasks)
- Decision criteria documented in routing-rules.md

---

## 4. Specialist Architecture

### 4.1 Specialist Core Components

**Component 1: Task Reception**
- Receive task from authorized orchestrator (JSON payload)
- Parse user context (role, org, app, prior work)
- Verify task within domain scope (escalate if out-of-scope)
- Load domain knowledge base

**Component 2: Domain Execution**
- Apply domain-specific expertise (threat analysis, criteria extraction, etc.)
- Validate intermediate results against domain standards
- Generate structured output (status, output, metadata, confidence)

**Component 3: Knowledge Base Management**
- Domain-specific knowledge (independent from other specialists)
- Self-learning (Tier 1-4 rules, Arbiter supervised)
- Knowledge versioning (SHA256 checksums for critical knowledge)
- No cross-specialist access (Arbiter enforced)

**Component 4: Return to Orchestrator**
- Structured response format (JSON)
- Status codes (success, partial, escalate, error)
- Metadata (execution time, confidence level, validation notes)
- Session memory capture (task log, learnings)

---

### 4.2 Specialist Domain Boundary Enforcement

**Arbiter Supervision:**
- Specialists MUST NOT access other specialist knowledge bases
- Specialists MUST NOT share knowledge directly (only via orchestrator coordination)
- Specialists MUST NOT expand domain scope without CS2 approval
- Specialists MUST escalate out-of-scope requests (not reject silently)

**Knowledge Isolation:**
- Each specialist has independent `.agent-workspace/{specialist-id}/knowledge/` directory
- No shared knowledge base (prevents cross-contamination)
- Knowledge updates require Arbiter validation (Tier 2/3 learning)

---

## 5. Interaction Pattern (Orchestrator ↔ Specialist)

### 5.1 Delegation Request Format (JSON)

```json
{
  "from": "maturion-agent",
  "to": "risk-platform-agent",
  "task": "Analyze threat landscape for financial services sector in South Africa",
  "transparency": "transparent",
  "context": {
    "app": "MAT",
    "user_role": "CISO",
    "org": "Example Bank",
    "industry": "Financial Services",
    "country": "ZA",
    "maturity": 3
  },
  "input": {
    "sector": "financial-services",
    "region": "ZA",
    "focus": ["cyber", "insider", "physical"]
  },
  "requirements": {
    "format": "markdown",
    "include_mitigation": true,
    "confidence_threshold": 0.7
  }
}
```

---

### 5.2 Delegation Response Format (JSON)

```json
{
  "status": "success",
  "output": {
    "threat_summary": "...",
    "top_threats": [...],
    "mitigations": [...]
  },
  "metadata": {
    "specialist_id": "risk-platform-agent",
    "execution_time_ms": 1250,
    "confidence": 0.85,
    "knowledge_base_version": "1.2.3",
    "validation": {
      "guardian": "pass",
      "sentinel": "pass",
      "arbiter": "pass"
    }
  }
}
```

---

### 5.3 Transparency Decision Criteria

**Transparent Delegation (Visible to User):**
- Novel domain expertise (educational value)
- Complex multi-specialist chains (user needs to understand process)
- High-stakes decisions (trust-building through transparency)
- User explicitly asks about capabilities ("what can you do?")

**Invisible Delegation (Seamless):**
- Mechanical/operational tasks (data fetching, formatting)
- Routine operations (standard report generation)
- Background validation (quality checks, compliance scans)
- User doesn't need to know internal routing

**Decision Documented In:** `.agent-workspace/maturion-agent/knowledge/routing-rules.md`

---

## 6. Multi-Specialist Chaining

### 6.1 Chain Definition

**Use Case:** Complex task requiring multiple domain experts

**Example Chain:**
1. User: "Import LDCS document and generate risk heat map"
2. Orchestrator → `criteria-generator-agent` (parse LDCS)
3. Orchestrator → `mat-specialist` (map criteria to domains)
4. Orchestrator → `risk-platform-agent` (assess threats, generate heat map)
5. Orchestrator → Synthesize final response with heat map

---

### 6.2 Chain Execution Protocol

**Step 1:** Orchestrator plans chain (specialist sequence, data flow)  
**Step 2:** Execute first specialist (capture output)  
**Step 3:** Pass output to next specialist in chain  
**Step 4:** Validate at each step (Guardian, Sentinel, Arbiter)  
**Step 5:** Synthesize final response (aggregate all specialist outputs)  
**Step 6:** Log chain in session memory (delegation sequence, timings, validations)

---

### 6.3 Chain Failure Handling

**Failure at Step N:**
- STOP chain execution
- Capture partial results from Steps 1 to N-1
- Escalate to user with context: "Step N failed, here's what we have so far"
- Offer retry or alternative path

---

## 7. Validation Gates (Guardian, Sentinel, Arbiter)

### 7.1 Guardian — Policy/Content Oversight

**Pre-Delegation Check:**
- Verify specialist authorized to access user context
- Check for cross-tenant contamination risk
- Validate task does not violate policy

**Post-Delegation Check:**
- Scan specialist output for forbidden content
- Verify no cross-tenant leakage in response
- Block/redact if policy violation detected

**Constitutional Derivation:** `Maturion/oversight-system.md` (Section 3)

---

### 7.2 Sentinel — Behavioral/Drift Oversight

**Pre-Delegation Check:**
- Verify orchestrator routing logic is consistent
- Detect anomalous delegation patterns

**Post-Delegation Check:**
- Monitor specialist response times (detect performance drift)
- Check specialist behavior consistency (flag unusual patterns)
- Throttle if anomaly burst detected

**Constitutional Derivation:** `Maturion/oversight-system.md` (Section 4)

---

### 7.3 Arbiter — Memory/Learning Oversight

**Pre-Delegation Check:**
- Verify specialist knowledge base integrity
- Check for unauthorized memory access attempts

**Post-Delegation Check:**
- Validate specialist did not access other knowledge bases
- Verify no unauthorized learning occurred
- Freeze memory writes if boundary violation detected

**Constitutional Derivation:** `Maturion/oversight-system.md` (Section 5)

---

## 8. Session Memory Architecture

### 8.1 Orchestrator Session Memory

**Location:** `.agent-workspace/maturion-agent/memory/session-NNN-YYYYMMDD.md`

**Content:**
- User query (original request)
- App context (MAT, PIT, XDETECT, etc.)
- Delegation log (specialist, task, timestamp, outcome)
- Validation results (Guardian, Sentinel, Arbiter)
- Response synthesis (final output to user)
- Cross-app insights (learnings applicable to other apps)

---

### 8.2 Specialist Session Memory

**Location:** `.agent-workspace/{specialist-id}/memory/session-NNN-YYYYMMDD.md`

**Content:**
- Task received (from orchestrator)
- Domain context (user role, org, industry)
- Execution log (steps taken, decisions made)
- Output generated (status, output, metadata)
- Knowledge base updates (Tier 2/3 learning, if any)

---

## 9. Knowledge Base Management

### 9.1 Orchestrator Knowledge Base

**Location:** `.agent-workspace/maturion-agent/knowledge/`

**Files:**
- `specialist-registry.md` — Active specialists (id, domain, capabilities, apps, routing keywords)
- `routing-rules.md` — Decision tree for specialist selection
- `constitutional-bindings.md` — Maturion identity docs and their behavioral constraints

---

### 9.2 Specialist Knowledge Base

**Location:** `.agent-workspace/{specialist-id}/knowledge/`

**Files:**
- `domain-ontology.md` — Domain-specific terminology, classifications
- `expertise-rules.md` — Domain logic, decision trees, algorithms
- `validation-standards.md` — Quality criteria for domain outputs

**Governance:**
- Specialist MAY update knowledge base (Tier 2/3 learning)
- Arbiter MUST validate all updates (no unauthorized expansion)
- Version tracking (SHA256 checksums for critical knowledge)

---

## 10. Specialist Lifecycle

### 10.1 Creation

**Process:**
1. CS2 creates issue for new specialist (domain, expertise, apps)
2. CodexAdvisor loads `SPECIALIST_AGENT_CONTRACT_REQUIREMENTS_CHECKLIST.md`
3. CodexAdvisor creates specialist contract (`.github/agents/{specialist-id}.md`)
4. CodexAdvisor creates knowledge base (`.agent-workspace/{specialist-id}/knowledge/`)
5. PR review + CS2 approval
6. Register specialist in `maturion-agent` specialist-registry.md
7. Add routing rules to `maturion-agent` routing-rules.md

---

### 10.2 Registration

**Update:** `.agent-workspace/maturion-agent/knowledge/specialist-registry.md`

**Entry Format:**
```markdown
## risk-platform-agent
- **Domain:** Risk management, threat analysis, vulnerability assessment
- **Expertise:** Threat taxonomies, control effectiveness, risk scoring
- **Apps:** MAT, PIT, XDETECT, Maturity Roadmap
- **Routing Keywords:** threat, vulnerability, risk, control, incident, mitigation
- **Status:** ACTIVE
- **Version:** 1.0.0
- **Contract:** `.github/agents/risk-platform-agent.md`
```

---

### 10.3 Decommissioning

**Process:**
1. CS2 creates issue for specialist decommissioning
2. Update specialist-registry.md (status: DECOMMISSIONED, date)
3. Archive specialist knowledge base (`.agent-workspace/{specialist-id}/.archive/`)
4. Remove routing rules from routing-rules.md
5. Document reason for decommissioning (obsolete, scope merged, etc.)

---

## 11. Extensibility

### 11.1 Adding New Specialists

**Trigger:** New capability required (e.g., report-writer-agent for DOCX/PDF generation)

**Process:**
1. Define domain scope (report generation, formatting)
2. Define expertise (DOCX templates, PDF rendering, Excel formatting)
3. Define apps (MAT, PIT, XDETECT)
4. Define routing keywords (report, export, download, DOCX, PDF, Excel)
5. Create specialist contract (via CodexAdvisor)
6. Register in orchestrator registry
7. Add routing rules

---

### 11.2 Adding New Apps

**Trigger:** New ISMS app launched (e.g., compliance-tracker)

**Process:**
1. Update orchestrator app-context model (add compliance-tracker)
2. Create app-specific specialist (compliance-tracker-specialist)
3. Register specialist in orchestrator registry
4. Add app-specific routing rules
5. Update cross-app session continuity logic

---

## 12. Quality Metrics

### 12.1 Orchestrator Metrics

**Routing Accuracy:**
- Correct specialist selected / Total delegations
- Target: >90%

**Validation Pass Rate:**
- Guardian pass + Sentinel pass + Arbiter pass / Total delegations
- Target: >95%

**Multi-Specialist Chain Success Rate:**
- Chains completed successfully / Total chains initiated
- Target: >85%

---

### 12.2 Specialist Metrics

**Domain Accuracy:**
- Correct outputs / Total tasks
- Target: >95%

**Escalation Rate:**
- Out-of-scope escalations / Total tasks
- Target: <10%

**Execution Time:**
- Average response time (target varies by domain)

---

## 13. Constitutional Alignment Verification

**Orchestrator MUST verify:**
- [ ] ONE identity maintained across all apps
- [ ] Unified memory framework used (no fragmented memory)
- [ ] Ethical framework enforced (Guardian/Sentinel/Arbiter)
- [ ] Guardrails respected on all specialist outputs
- [ ] Risk-oriented worldview applied (ISMS ontology)
- [ ] Situational awareness active (app, user, module context)

**Reference:** `Maturion/maturion-identity.md` (Section 9: Identity Integrity Checks)

---

## 14. References

### Constitutional Documents (Strategy Level)
- `Maturion/maturion-identity.md` — ONE Maturion, unified identity
- `Maturion/maturion-true-north.md` — Mission, principles, situational awareness
- `Maturion/oversight-system.md` — Guardian, Sentinel, Arbiter watchdogs
- `Maturion/maturion-self-learning-governance.md` — Learning tiers, prohibited/allowed learning
- `Maturion/maturion-memory-architecture.md` — Memory framework
- `Maturion/guardrails-and-safety-charter.md` — Guardrails

### Canonical Governance (Canon Level)
- `governance/canon/AGENT_CONTRACT_ARCHITECTURE.md` — 4-component structure
- `governance/canon/AGENT_DELEGATION_PROTOCOL.md` — Delegation protocol details
- `governance/canon/MULTI_EMBODIMENT_ORCHESTRATION_MODEL.md` — Cross-app orchestration

### Execution Templates (Checklist Level)
- `governance/checklists/ORCHESTRATOR_AGENT_CONTRACT_REQUIREMENTS_CHECKLIST.md`
- `governance/checklists/SPECIALIST_AGENT_CONTRACT_REQUIREMENTS_CHECKLIST.md`
- `governance/templates/ORCHESTRATOR_AGENT_TEMPLATE.md`

---

**Authority:** CS2 (Johan Ras)  
**Status:** PUBLIC_API (canonical governance)  
**Version:** 1.0.0  
**Date:** 2026-02-20  
**Character Count:** ~17,500 (well under 30K limit)
