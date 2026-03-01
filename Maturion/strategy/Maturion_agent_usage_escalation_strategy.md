🏛️ COMPLETE GOVERNANCE STRUCTURE FOR ORCHESTRATOR + SPECIALIST ARCHITECTURE
Overview: Three-Tier Governance Hierarchy
Code
STRATEGY LEVEL (Maturion/)
├─ Constitutional documents defining Maturion's identity, mission, guardrails
├─ Authority: CS2 (Johan Ras)
├─ Status: Immutable except through ARC approval
└─ 13 existing files

CANON LEVEL (governance/canon/)
├─ Canonical governance defining orchestrator/specialist pattern
├─ Authority: CS2 (Johan Ras)
├─ Status: PUBLIC_API (hash-tracked, ripple-enabled)
└─ 5 NEW files

EXECUTION LEVEL (governance/checklists/ + governance/templates/)
├─ Checklists and templates for creating orchestrator/specialist agents
├─ Authority: CS2 (Johan Ras) 
├─ Status: INTERNAL_CANON (ripple-enabled)
└─ 5 NEW files
STRATEGY LEVEL: Existing Constitutional Documents
Location: Maturion/

Purpose: Define Maturion's identity, mission, guardrails, and multi-embodiment model

Authority: CS2 (Johan Ras) — Immutable except through ARC approval

Existing Files (13)
File	Purpose	Status
maturion-identity.md	WHO Maturion is — ONE intelligence across ALL apps	Constitutional
maturion-true-north.md	Mission, purpose, principles, risk worldview	Constitutional
oversight-system.md	Guardian, Sentinel, Arbiter watchdog architecture	Constitutional
maturion-self-learning-governance.md	Learning rules, update tiers, prohibited/allowed learning	Constitutional
maturion-incident-taxonomy.md	Complete incident classification system	Constitutional
embodiment-calibration-engine-spec.md	Embodiment behavior baselines, drift prevention	Constitutional
platform-tree-architecture.md	Platform Tree visualization, health monitoring	Constitutional
platform-tree-metrics-engine-spec.md	Health, risk, stability metrics for Platform Tree	Constitutional
XDETECT	XDETECT app description (contraband detection)	Constitutional
XDETECT_POINTER.md	Canonical pointer to modules/xdetect/	Constitutional
Governance Role:

These documents are the constitutional foundation
All canon-level and execution-level governance DERIVES from these
Orchestrator/specialist pattern MUST align with:
Multi-embodiment identity (maturion-identity.md)
True North principles (maturion-true-north.md)
Watchdog oversight (oversight-system.md)
Self-learning governance (maturion-self-learning-governance.md)
No changes needed — These files anchor the entire governance structure

CANON LEVEL: New Governance Documents
Location: governance/canon/

Purpose: Define orchestrator/specialist architecture, delegation protocols, knowledge management

Authority: CS2 (Johan Ras)

Status: PUBLIC_API (hash-tracked in CANON_INVENTORY.json, ripple-enabled across repos)

📄 Canon File 1: ORCHESTRATOR_SPECIALIST_ARCHITECTURE.md
File Path: governance/canon/ORCHESTRATOR_SPECIALIST_ARCHITECTURE.md

Version: 1.0.0

Authority: CS2 (Johan Ras)

Status: PUBLIC_API

Purpose: Define the canonical architecture for orchestrator agents (Maturion) and specialist agents (risk-platform-agent, mat-specialist, etc.)

Derived From:

Maturion/maturion-identity.md (multi-embodiment model)
Maturion/maturion-true-north.md (mission and principles)
governance/canon/AGENT_CONTRACT_ARCHITECTURE.md (4-component structure)
Content Outline:

Markdown
# ORCHESTRATOR SPECIALIST ARCHITECTURE

**Version:** 1.0.0  
**Status:** PUBLIC_API (Canonical Governance)  
**Authority:** CS2 (Johan Ras)  
**Applies To:** All orchestrator and specialist agents in ISMS platform  
**Supersedes:** N/A  
**Last Updated:** 2026-02-20  

---

## 1. Purpose

This document defines the canonical architecture for:

1. **Orchestrator Agents** — Coordinate multiple specialist agents to fulfill user requests
2. **Specialist Agents** — Provide deep domain expertise in specific areas

**Key Principles:**
- **ONE orchestrator (Maturion)** across ALL apps (MAT, PIT, XDETECT, etc.)
- **MULTIPLE specialists** with focused domain expertise
- **Transparent delegation** when user should know which specialist is helping
- **Invisible delegation** when specialist is mechanical/operational
- **Validation gates** (Guardian, Sentinel, Arbiter) on all specialist outputs

---

## 2. Architectural Model

### 2.1 Orchestrator Role

**Definition:** An orchestrator agent is responsible for:
- Analyzing user queries and detecting intent
- Routing queries to appropriate specialist(s)
- Validating specialist responses via watchdog gates
- Synthesizing responses with context and framing
- Maintaining session continuity across specialists
- Capturing learnings from specialist interactions

**Key Characteristics:**
- **App-context aware** — Knows which app (MAT, PIT, XDETECT, etc.)
- **Multi-embodiment** — One identity, multiple operational contexts
- **Supervisory authority** — Orchestrates but does NOT implement domain logic
- **Central memory** — Shared session memory across all apps and specialists

**Constitutional Alignment:**
- Maturion is ONE intelligence (per `Maturion/maturion-identity.md`)
- Maintains unified memory framework across all apps
- Subject to Guardian, Sentinel, Arbiter oversight

**Orchestrator Example:** `maturion-agent`

---

### 2.2 Specialist Role

**Definition:** A specialist agent is responsible for:
- Receiving tasks from authorized orchestrator(s)
- Executing domain-specific logic with deep expertise
- Validating outputs against domain standards
- Returning structured responses to orchestrator
- Maintaining domain-specific knowledge base
- Escalating out-of-scope queries to orchestrator

**Key Characteristics:**
- **Domain-scoped expertise** — Focused on specific domain (risk, MAT, controls, reporting, etc.)
- **Authorized callers** — Only responds to designated orchestrator(s)
- **No cross-domain logic** — Stays within expertise boundaries
- **Independent memory** — Specialist-specific session memory and knowledge base

**Specialist Examples:**
- `risk-platform-agent` — Threats, vulnerabilities, controls, risk scoring
- `mat-specialist` — MAT workflows, LDCS expertise, criteria management
- `criteria-generator-agent` — Document parsing, criteria extraction
- `report-writer-agent` — DOCX/PDF/Excel generation
- `security-controls-agent` — Control definitions, maturity assessment

---

## 3. Orchestrator-Specialist Interaction Pattern

### 3.1 Query Flow

User Query ↓ Orchestrator (Maturion) ├─ Analyze intent ├─ Select specialist(s) ├─ Delegate task (transparent or invisible) ↓ Specialist (e.g., mat-specialist) ├─ Receive task with context ├─ Execute domain logic ├─ Validate output ↓ Return to Orchestrator ↓ Orchestrator Validates (Guardian, Sentinel, Arbiter) ├─ No cross-tenant leakage (Guardian) ├─ Behavioral consistency (Sentinel) ├─ Memory boundaries (Arbiter) ↓ Orchestrator Synthesizes Response ├─ Add context and framing ├─ Suggest follow-up actions ↓ User receives response

Code

---

### 3.2 Transparent Delegation (Visible to User)

**When to use:**
- Specialist provides **novel expertise** user should know about
- Educational value (user learns which specialist has which expertise)
- Trust-building (transparency about decision-making)

**Example:**
User: "What are the main threats to diamond mining operations?"

Orchestrator: "This requires deep threat intelligence. Let me consult the Risk Platform Agent, who specializes in threat analysis for high-value industries."

[Calls risk-platform-agent]

Risk Platform Agent: [Returns threat taxonomy]

Orchestrator: "The Risk Platform Agent identified 5 key threat categories specific to diamond mining: [synthesis]...

Would you like me to have the Security Controls Agent recommend specific mitigations for any of these?"

Code

**Benefits:**
- User learns specialist expertise mapping
- Builds trust through transparency
- Educational (user knows who to ask next time)

---

### 3.3 Invisible Delegation (Seamless to User)

**When to use:**
- Specialist is **mechanical/operational** (data fetch, formatting, calculations)
- User doesn't need to know about internal routing
- Seamless experience is more important than transparency

**Example:**
User: "Generate an Excel report of my MAT audit findings"

Orchestrator: [Internally: 1. Calls mat-specialist to fetch audit data 2. Calls report-writer-agent to generate Excel 3. Validates output with Guardian ]

Orchestrator: "Here's your MAT audit report in Excel format. It includes: [summary]..."

Code

**Benefits:**
- Fast, seamless user experience
- No explaining delegation overhead
- Orchestrator still validates behind scenes

---

## 4. Multi-Specialist Chaining

**Definition:** Orchestrator routes through MULTIPLE specialists in sequence to complete complex tasks.

**Example:**
User: "Import the LDCS document and generate a risk heat map"

Orchestrator chains:

criteria-generator-agent → Extract criteria from LDCS
mat-specialist → Map criteria to MAT structure
risk-platform-agent → Analyze risk levels
report-writer-agent → Generate heat map visualization
Orchestrator synthesizes: "I've imported 25 MPS from the LDCS, mapped them to 5 domains, analyzed risk levels, and generated this heat map: [visualization]"

Code

**Chaining Rules:**
- Orchestrator coordinates entire chain
- Each specialist validates own output
- Orchestrator validates final output (Guardian, Sentinel, Arbiter)
- Session memory captures full chain for learning

---

## 5. Validation Gates (Guardian, Sentinel, Arbiter)

**ALL specialist outputs MUST pass watchdog validation before returning to user.**

### 5.1 Guardian (Policy & Content Oversight)

**Validates:**
- No cross-tenant data leakage
- No inappropriate content
- No regulatory violations
- No forbidden topics
- No hallucinated high-risk content

**Action on violation:**
- BLOCK response
- REDACT content
- ESCALATE to CS2
- CREATE IWMS incident

---

### 5.2 Sentinel (Behavioral & Drift Oversight)

**Validates:**
- Specialist behaving consistently with role
- No persona bleeding (e.g., mat-specialist acting like risk-platform-agent)
- No behavioral drift
- No contradictions with prior responses

**Action on violation:**
- FLAG drift
- RECALIBRATE specialist
- ESCALATE to CS2 if recurring

---

### 5.3 Arbiter (Memory & Learning Oversight)

**Validates:**
- No unauthorized memory writes
- No semantic contamination
- No cross-specialist memory access
- No unsafe learning attempts

**Action on violation:**
- FREEZE memory
- ROLL BACK snapshot
- ESCALATE to CS2

---

## 6. Session Memory Architecture

### 6.1 Orchestrator Memory (Centralized)

**Location:** `.agent-workspace/maturion-agent/memory/`

**Captures:**
- User sessions across ALL apps (MAT, PIT, XDETECT, etc.)
- Specialist routing decisions
- Multi-specialist chains
- Cross-app learnings (e.g., "User struggled with MAT criteria → apply similar guidance to PIT")
- Validation gate outcomes

**Session File Format:**
.agent-workspace/maturion-agent/memory/session-NNN-YYYYMMDD-{app}-{topic}.md

Code

**Examples:**
- `session-042-20260220-mat-ldcs-import-guidance.md`
- `session-043-20260220-pit-threat-analysis.md`
- `session-044-20260220-mat-pit-cross-app-learning.md`

---

### 6.2 Specialist Memory (Domain-Specific)

**Location:** `.agent-workspace/{specialist-name}/memory/`

**Captures:**
- Specialist-specific task executions
- Domain-specific learnings
- Knowledge base updates
- Performance metrics

**Session File Format:**
.agent-workspace/{specialist-name}/memory/session-NNN-YYYYMMDD-{task}.md

Code

**Examples:**
- `.agent-workspace/risk-platform-agent/memory/session-012-20260220-threat-analysis.md`
- `.agent-workspace/mat-specialist/memory/session-008-20260220-ldcs-mps-explanation.md`

---

## 7. Knowledge Base Management

### 7.1 Orchestrator Knowledge Base

**Location:** `.agent-workspace/maturion-agent/knowledge/`

**Contains:**
- Specialist registry and expertise mapping
- Routing intelligence rules
- Cross-app patterns
- Constitutional document references

**Files:**
- `specialist-registry.md` — List of specialists, domains, capabilities
- `routing-rules.md` — Decision tree for specialist selection
- `cross-app-patterns.md` — Learnings applicable across MAT, PIT, XDETECT
- `constitutional-bindings.md` — References to Maturion/ strategy docs

---

### 7.2 Specialist Knowledge Base

**Location:** `.agent-workspace/{specialist-name}/knowledge/`

**Contains:**
- Domain-specific expertise
- Templates and patterns
- Reference materials
- Domain-specific canonical documents

**Examples:**

**risk-platform-agent:**
.agent-workspace/risk-platform-agent/knowledge/ ├─ threat-taxonomy.md ├─ vulnerability-frameworks.md ├─ control-effectiveness-models.md └─ risk-scoring-algorithms.md

Code

**mat-specialist:**
.agent-workspace/mat-specialist/knowledge/ ├─ ldcs-expertise.md (Lucara Diamond Control Standard) ├─ mat-workflows.md (audit lifecycle, criteria management) ├─ domain-mps-criteria-structure.md └─ maturity-scoring-models.md

Code

---

## 8. Agent Class Taxonomy

**Updated agent class definitions:**

| Agent Class | Role | Examples | Authority Model |
|-------------|------|----------|-----------------|
| **orchestrator** | Coordinate specialists, synthesize responses | maturion-agent | RAEC (Review-Advise-Escalate-Coordinate) |
| **specialist** | Deep domain expertise | risk-platform-agent, mat-specialist | EXECUTE (within domain scope only) |
| **builder** | Code implementation | ui-builder, api-builder | IMPLEMENT (within wave scope) |
| **foreman** | Build supervision | foreman-agent | POLC (Plan-Organize-Lead-Control) |
| **liaison** | Cross-repo governance sync | governance-liaison | SYNC (receive/validate canonical governance) |
| **overseer** | Agent factory, governance advisor | CodexAdvisor-agent | RAEC (approval-gated creation) |

---

## 9. Governance Alignment

### 9.1 Constitutional Derivation

**This architecture MUST align with:**

1. **Maturion Identity** (`Maturion/maturion-identity.md`)
   - "Maturion is a single, unified artificial intelligence..."
   - "one identity, one memory framework, one mission"
   - Orchestrator = unified mind, Specialists = embodiments

2. **True North** (`Maturion/maturion-true-north.md`)
   - "Complete Situational Awareness" — Orchestrator knows app context
   - "Risk Context as Default Lens" — risk-platform-agent provides this

3. **Oversight System** (`Maturion/oversight-system.md`)
   - Guardian, Sentinel, Arbiter validate ALL specialist outputs
   - Watchdogs prevent cross-specialist contamination

4. **Self-Learning Governance** (`Maturion/maturion-self-learning-governance.md`)
   - Orchestrator may learn routing patterns (Tier 2 Structural Learning)
   - Specialists may update domain knowledge (Tier 3 Knowledge Layer Learning)
   - Both subject to Arbiter supervision

---

### 9.2 4-Component Structure

**Both orchestrators and specialists follow 4-component architecture:**

Component 1: Preflight & Governance Alignment Component 2: Induction (Session Initialization) Component 3: During Process (Orchestration or Execution) Component 4: Closure (Quality Assurance)

Code

**Details:** See `governance/canon/AGENT_CONTRACT_ARCHITECTURE.md` (generalized from 4-phase to 4-component)

---

## 10. Specialist Lifecycle

### 10.1 Specialist Creation

**Authority:** CS2 (via CodexAdvisor)

**Process:**
1. CS2 creates issue for new specialist (e.g., "Create pit-specialist for PIT app")
2. CodexAdvisor loads `SPECIALIST_AGENT_CONTRACT_REQUIREMENTS_CHECKLIST.md`
3. CodexAdvisor creates specialist agent file following template
4. PR submitted with specialist contract
5. CS2 reviews and approves
6. Specialist registered in orchestrator's specialist-registry.md

---

### 10.2 Specialist Registration

**Orchestrator maintains:**
```markdown
# Specialist Registry

## risk-platform-agent
- **Domain:** Risk management, threat analysis, vulnerability assessment
- **Expertise:** Threat taxonomies, control frameworks, risk scoring
- **Routing Keywords:** threat, vulnerability, risk, control, incident
- **Status:** Active
- **Version:** 1.0.0

## mat-specialist
- **Domain:** MAT app workflows, LDCS expertise
- **Expertise:** Audit lifecycle, criteria management, maturity scoring
- **Routing Keywords:** MAT, LDCS, audit, criteria, MPS, domain
- **Status:** Active
- **Version:** 1.0.0

## criteria-generator-agent
- **Domain:** Document parsing, criteria extraction
- **Expertise:** LDCS/ISO/NIST document parsing, Domain→MPS→Criteria mapping
- **Routing Keywords:** import, parse, extract, criteria, document
- **Status:** Active
- **Version:** 1.0.0
10.3 Specialist Decommissioning
When specialist is retired:

Orchestrator removes from specialist-registry.md
Routing rules updated (fallback to general response or escalate)
Specialist memory archived (not deleted — audit trail)
Specialist knowledge base archived or migrated to replacement
11. Extensibility
11.1 Adding New Specialists
Easy to extend:

New app (PIT) → Create pit-specialist
New capability (image generation) → Create image-generation-agent
New domain (code analysis) → Create code-interpreter-agent
No orchestrator changes needed — Just register specialist in registry

11.2 Adding New Apps
When new app added to ISMS platform:

Create app-specific specialist (e.g., xdetect-specialist)
Load app-specific knowledge base
Register specialist with orchestrator
Orchestrator automatically routes app-context queries
Maturion maintains unified identity across ALL apps (per constitutional requirement)

12. Quality Metrics
12.1 Orchestrator Metrics
Daily dashboard:

Total sessions
Specialist calls (count per specialist)
Routing accuracy (% correct specialist on first try)
Guardian/Sentinel/Arbiter alerts
User satisfaction (inferred from session continuity)
12.2 Specialist Metrics
Per specialist:

Task count
Execution time (average, p95)
Success rate (% tasks completed without escalation)
Domain coverage (% of domain questions answered)
Out-of-scope escalations (indicates scope boundary clarity)
13. References
Constitutional Documents:

Maturion/maturion-identity.md — ONE Maturion across all apps
Maturion/maturion-true-north.md — Mission and principles
Maturion/oversight-system.md — Guardian, Sentinel, Arbiter watchdogs
Maturion/maturion-self-learning-governance.md — Learning rules
Canonical Governance:

governance/canon/AGENT_CONTRACT_ARCHITECTURE.md — 4-component structure
governance/canon/AGENT_DELEGATION_PROTOCOL.md — Delegation patterns (see Canon File 2)
governance/canon/SPECIALIST_KNOWLEDGE_MANAGEMENT.md — Knowledge base management (see Canon File 3)
Execution Templates:

governance/templates/ORCHESTRATOR_AGENT_TEMPLATE.md
governance/templates/SPECIALIST_AGENT_TEMPLATE.md
Authority: CS2 (Johan Ras)
Version: 1.0.0
Status: PUBLIC_API
Last Updated: 2026-02-20
Canonical Home: APGI-cmy/maturion-foreman-governance
SHA256: [To be calculated on creation]

Code

---

### 📄 **Canon File 2: AGENT_DELEGATION_PROTOCOL.md**

**File Path:** `governance/canon/AGENT_DELEGATION_PROTOCOL.md`

**Version:** 1.0.0

**Authority:** CS2 (Johan Ras)

**Status:** PUBLIC_API

**Purpose:** Define canonical protocol for how orchestrators delegate tasks to specialists

**Derived From:**
- `governance/canon/ORCHESTRATOR_SPECIALIST_ARCHITECTURE.md`
- `Maturion/oversight-system.md` (watchdog validation)

**Content Outline:**

```markdown
# AGENT DELEGATION PROTOCOL

**Version:** 1.0.0  
**Status:** PUBLIC_API (Canonical Governance)  
**Authority:** CS2 (Johan Ras)  
**Applies To:** All orchestrator agents delegating to specialists  
**Last Updated:** 2026-02-20  

---

## 1. Purpose

Define the canonical protocol for:
1. How orchestrators delegate tasks to specialists
2. Task payload format (request/response)
3. Validation gates (Guardian, Sentinel, Arbiter)
4. Transparent vs. invisible delegation criteria
5. Multi-specialist chaining logic

---

## 2. Delegation Request Format

### 2.1 Standard Task Payload

```json
{
  "from": "maturion-agent",
  "to": "mat-specialist",
  "task": "explain-ldcs-mps-structure",
  "transparency": "visible",
  "context": {
    "user": {
      "id": "user-123",
      "name": "Johan Ras",
      "role": "auditor",
      "org": "Lucara Botswana",
      "industry": "diamond_mining",
      "region": "southern_africa",
      "maturity_level": 3
    },
    "app": "mat",
    "module": "criteria",
    "action": "import-ldcs",
    "priorContext": "User uploaded LDCS document, imported Leadership & Governance domain",
    "sessionHistory": [
      "Session 040: Imported LDCS Leadership domain",
      "Session 041: Asked about Process Integrity"
    ]
  },
  "input": {
    "question": "Explain MPS 6 — Diamond Value Management",
    "documentRef": "modules/mat/Lucara_Diamond_Control_Standard_seed_info.md"
  },
  "requirements": {
    "responseFormat": "markdown",
    "maxLength": 2000,
    "includeReferences": true,
    "suggestNextSteps": true
  }
}
2.2 Required Fields
Field	Type	Required	Description
from	string	YES	Orchestrator agent ID
to	string	YES	Specialist agent ID
task	string	YES	Task identifier (kebab-case)
transparency	enum	YES	"visible" or "invisible"
context.user	object	YES	User context (role, org, industry, maturity)
context.app	string	YES	App context (mat, pit, xdetect)
context.module	string	NO	App module (audit, criteria, evidence)
context.action	string	NO	User's current action
context.priorContext	string	NO	Summary of prior work
input	object	YES	Task-specific input data
requirements	object	NO	Response formatting requirements
3. Delegation Response Format
3.1 Standard Response Payload
JSON
{
  "from": "mat-specialist",
  "to": "maturion-agent",
  "status": "success",
  "output": {
    "explanation": "MPS 6 — Diamond Value Management ensures...",
    "references": [
      "Lucara_Diamond_Control_Standard_seed_info.md § MPS 6 (lines 1-150)"
    ],
    "relatedCriteria": [
      "6.1 Granulometry",
      "6.13 Production reconciliation",
      "6.51 Revenue loss modeling"
    ],
    "suggestedNextSteps": [
      "Extract MPS 6 criteria using criteria-generator-agent",
      "Map criteria to audit structure",
      "Review Process Integrity domain coverage"
    ]
  },
  "metadata": {
    "executionTime": "1.2s",
    "confidenceLevel": "high",
    "sourcesUsed": ["LDCS knowledge base", "MAT workflow patterns"],
    "escalationsNeeded": []
  }
}
3.2 Required Response Fields
Field	Type	Required	Description
from	string	YES	Specialist agent ID
to	string	YES	Orchestrator agent ID
status	enum	YES	"success", "partial", "failed", "escalate"
output	object	YES (if success/partial)	Task output data
metadata.executionTime	string	YES	Task execution duration
metadata.confidenceLevel	enum	YES	"high", "medium", "low"
metadata.escalationsNeeded	array	YES	List of issues requiring orchestrator attention
4. Transparency Decision Criteria
4.1 Transparent Delegation (Visible to User)
Use when:

✅ Specialist provides novel domain expertise user should know about
✅ Educational value (user learns specialist mapping)
✅ Trust-building through transparency
✅ User explicitly asked for specialist involvement
User message template:

Code
"This requires {domain} expertise. Let me consult the {Specialist Name}, 
who specializes in {specialty}."
Examples:

"Let me consult the Risk Platform Agent, who specializes in threat analysis..."
"I'll have the Criteria Generator Agent parse the LDCS document structure..."
"The Report Writer Agent will create this Excel report for you..."
4.2 Invisible Delegation (Seamless to User)
Use when:

✅ Specialist is mechanical/operational (data fetch, calculations, formatting)
✅ User doesn't need to know internal routing
✅ Seamless experience > transparency
✅ Multiple specialists in quick sequence (chaining would confuse user)
User sees only final synthesized response (no mention of specialist)

Examples:

Fetching audit data from database → invisible (mat-specialist)
Calculating metrics → invisible (performance specialist)
Formatting Excel → invisible (report-writer-agent)
5. Validation Gates (Mandatory)
5.1 Pre-Delegation Validation (Orchestrator)
Before sending task to specialist:

TypeScript
// 1. Verify specialist is authorized and available
const specialist = registry.getSpecialist('mat-specialist');
if (!specialist || specialist.status !== 'active') {
  return orchestrator.escalate('Specialist unavailable');
}

// 2. Verify task is within specialist scope
if (!specialist.canHandle(task)) {
  return orchestrator.escalate('Task out of specialist scope');
}

// 3. Sanitize user context (remove sensitive data if needed)
const sanitizedContext = guardian.sanitizeContext(context);
5.2 Post-Delegation Validation (Orchestrator)
After receiving response from specialist:

TypeScript
// 1. Guardian check (policy & content)
const guardianCheck = await guardian.validate(specialistResponse);
if (!guardianCheck.safe) {
  // Block cross-tenant leakage, forbidden content
  return orchestrator.escalate({
    type: 'GUARDRAIL_VIOLATION',
    violations: guardianCheck.violations,
    specialist: 'mat-specialist',
    action: 'BLOCKED'
  });
}

// 2. Sentinel check (behavioral consistency)
const sentinelCheck = await sentinel.validateBehavior(specialistResponse);
if (sentinelCheck.drift) {
  // Specialist behaving inconsistently with role
  await orchestrator.recalibrate('mat-specialist');
  return orchestrator.retryOrEscalate();
}

// 3. Arbiter check (memory safety)
const arbiterCheck = await arbiter.validateMemory(specialistResponse);
if (!arbiterCheck.safe) {
  // Unauthorized learning or memory contamination
  await orchestrator.freezeMemory('mat-specialist');
  return orchestrator.escalate({
    type: 'MEMORY_SAFETY_VIOLATION',
    specialist: 'mat-specialist',
    action: 'MEMORY_FROZEN'
  });
}
6. Multi-Specialist Chaining
6.1 Chain Definition
Chain: Orchestrator routes through MULTIPLE specialists in sequence to complete complex task.

Example:

Code
User: "Import LDCS and generate risk heat map"

Chain:
  1. criteria-generator-agent → Extract criteria from LDCS
  2. mat-specialist → Map criteria to MAT structure
  3. risk-platform-agent → Analyze risk levels
  4. report-writer-agent → Generate heat map
6.2 Chain Execution Protocol
TypeScript
async function executeChain(chainSteps: ChainStep[]): Promise<Response> {
  let context = initialContext;
  let chainResults = [];

  for (const step of chainSteps) {
    // 1. Delegate to specialist
    const response = await orchestrator.delegate({
      specialist: step.specialist,
      task: step.task,
      context: context,
      input: step.input
    });

    // 2. Validate response (Guardian, Sentinel, Arbiter)
    const validation = await orchestrator.validateResponse(response);
    if (!validation.passed) {
      return orchestrator.failChain(validation.error, chainResults);
    }

    // 3. Store result and update context for next step
    chainResults.push(response);
    context = orchestrator.mergeContext(context, response.output);
  }

  // 4. Synthesize final response from all chain results
  return orchestrator.synthesizeChain(chainResults);
}
6.3 Chain Failure Handling
If any specialist in chain fails:

Orchestrator captures failure point and reason
Orchestrator synthesizes partial results (if any value)
Orchestrator escalates to user with explanation
Session memory captures failed chain for learning
Example:

Code
Chain failed at Step 3 (risk-platform-agent):
- Step 1 (criteria-generator-agent): ✅ SUCCESS (25 criteria extracted)
- Step 2 (mat-specialist): ✅ SUCCESS (Mapped to 5 domains)
- Step 3 (risk-platform-agent): ❌ FAILED (Risk scoring model unavailable)
- Step 4 (report-writer-agent): ⏸️ SKIPPED

Orchestrator to user: "I've successfully imported 25 criteria from 
the LDCS and mapped them to your MAT audit structure. However, I'm 
unable to generate the risk heat map right now because the risk 
scoring model is temporarily unavailable. Would you like me to 
generate the heat map once the service is restored, or proceed 
with a simplified risk analysis?"
7. Error Handling
7.1 Specialist Unavailable
If specialist offline/degraded:

Orchestrator checks if fallback specialist available
If no fallback → Escalate to user with explanation
Session memory captures unavailability for monitoring
7.2 Specialist Out-of-Scope
If specialist receives out-of-scope task:

Specialist returns status: "escalate" with reason
Orchestrator re-routes to correct specialist
If routing error persists → Escalate to CS2
7.3 Watchdog Violation
If Guardian/Sentinel/Arbiter blocks specialist response:

Orchestrator logs violation with full context
IWMS incident created (if severity HIGH/CRITICAL)
Orchestrator provides safe fallback response to user
CS2 alerted (if constitutional violation)
8. Session Memory Capture
8.1 Orchestrator Session Memory
After each delegation, orchestrator captures:

Markdown
## Specialist Delegation Log

### Delegation 1: mat-specialist
- **Task:** explain-ldcs-mps-structure
- **Transparency:** visible
- **Input:** "Explain MPS 6 — Diamond Value Management"
- **Status:** success
- **Execution Time:** 1.2s
- **Validation:** ✅ Guardian PASS, ✅ Sentinel PASS, ✅ Arbiter PASS
- **User Feedback:** Positive (asked follow-up question)

### Delegation 2: criteria-generator-agent
- **Task:** extract-mps-criteria
- **Transparency:** visible
- **Input:** LDCS document, MPS 6
- **Status:** success
- **Execution Time:** 2.4s
- **Validation:** ✅ Guardian PASS, ✅ Sentinel PASS, ✅ Arbiter PASS
- **User Feedback:** Positive (confirmed import)

## Learnings
- MPS-related questions reliably need mat-specialist first
- Users prefer actionable next steps (extraction offer accepted 90% of time)
- Transparent delegation for domain expertise builds trust
8.2 Specialist Session Memory
Specialist captures:

Markdown
# Session 012 — LDCS MPS 6 Explanation

**Date:** 2026-02-20
**Orchestrator:** maturion-agent
**Task:** explain-ldcs-mps-structure
**Context:** User working on Lucara Botswana audit, Process Integrity domain

## Task Execution

**Input:**
- Question: "Explain MPS 6 — Diamond Value Management"
- Document: Lucara_Diamond_Control_Standard_seed_info.md

**Execution:**
1. Loaded LDCS knowledge base
2. Extracted MPS 6 section (lines 1-150)
3. Identified 3 key criteria (6.1, 6.13, 6.51)
4. Generated explanation with context for diamond mining

**Output:**
- Explanation: [summary]
- References: LDCS § MPS 6
- Suggested next steps: Extract criteria, map to audit

**Validation:**
- Domain correctness: ✅ PASS
- Reference accuracy: ✅ PASS
- Completeness: ✅ PASS

**Execution Time:** 1.2s
**Confidence:** High

## Learnings
- Users working on LDCS audits often ask about MPS structure
- Providing related criteria (6.1, 6.13, 6.51) increased follow-up engagement
9. Quality Metrics
9.1 Delegation Metrics (Orchestrator)
Daily dashboard:

Total delegations
Delegations per specialist
Routing accuracy (% correct specialist on first try)
Validation pass rate (% passing Guardian, Sentinel, Arbiter)
Retry rate (% requiring re-routing)
User satisfaction (inferred from follow-up engagement)
9.2 Specialist Metrics
Per specialist:

Task count
Average execution time
Success rate (% tasks completed without escalation)
Confidence level distribution (high/medium/low)
Validation fail rate (% blocked by watchdogs)
10. References
Constitutional Documents:

Maturion/oversight-system.md — Guardian, Sentinel, Arbiter
Canonical Governance:

governance/canon/ORCHESTRATOR_SPECIALIST_ARCHITECTURE.md — Core architecture
governance/canon/SPECIALIST_KNOWLEDGE_MANAGEMENT.md — Knowledge base management
Execution Templates:

governance/templates/DELEGATION_PROTOCOL_IMPLEMENTATION_GUIDE.md
Authority: CS2 (Johan Ras)
Version: 1.0.0
Status: PUBLIC_API
Last Updated: 2026-02-20
SHA256: [To be calculated on creation]

Code

---

### 📄 **Canon File 3: SPECIALIST_KNOWLEDGE_MANAGEMENT.md**

**File Path:** `governance/canon/SPECIALIST_KNOWLEDGE_MANAGEMENT.md`

**Version:** 1.0.0

**Authority:** CS2 (Johan Ras)

**Status:** PUBLIC_API

**Purpose:** Define how specialists maintain and update domain-specific knowledge bases

**Content Outline:**

```markdown
# SPECIALIST KNOWLEDGE MANAGEMENT

**Version:** 1.0.0  
**Status:** PUBLIC_API  
**Authority:** CS2 (Johan Ras)  
**Applies To:** All specialist agents  
**Last Updated:** 2026-02-20  

---

## 1. Purpose

Define canonical approach for:
1. Specialist knowledge base structure
2. Knowledge update protocols (self-learning governance)
3. Knowledge versioning and audit trails
4. Cross-specialist knowledge boundaries
5. Knowledge deprecation and archival

---

## 2. Knowledge Base Structure

### 2.1 Standard Directory Layout

.agent-workspace/{specialist-name}/ ├─ knowledge/ │ ├─ {domain}-core.md (Core domain knowledge) │ ├─ {domain}-frameworks.md (Frameworks, standards, taxonomies) │ ├─ {domain}-patterns.md (Reusable patterns from experience) │ ├─ {domain}-glossary.md (Terminology and definitions) │ └─ references/ │ ├─ canonical-docs.md (Links to constitutional/canonical docs) │ └─ external-sources.md (Vetted external references) ├─ memory/ │ └─ session-{NNN}-{YYYYMMDD}-{task}.md └─ learnings/ ├─ patterns.md (Observed patterns over time) └─ improvements.md (Knowledge base improvements)

Code

---

### 2.2 Example: risk-platform-agent Knowledge Base

.agent-workspace/risk-platform-agent/knowledge/ ├─ risk-core.md │ └─ Fundamental risk concepts (threat, vulnerability, likelihood, impact) ├─ threat-taxonomy.md │ └─ Comprehensive threat classification (insider, external, cyber, physical) ├─ vulnerability-frameworks.md │ └─ Common vulnerability patterns, CWE, OWASP ├─ control-effectiveness.md │ └─ Control frameworks (ISO 27001, NIST CSF), maturity models ├─ risk-scoring-models.md │ └─ Algorithms for calculating risk scores └─ references/ ├─ canonical-docs.md → Links to Maturion/maturion-true-north.md, etc. └─ external-sources.md → ISO 27001, NIST publications, industry reports

Code

---

### 2.3 Example: mat-specialist Knowledge Base

.agent-workspace/mat-specialist/knowledge/ ├─ mat-workflows.md │ └─ Audit lifecycle, criteria management, evidence collection ├─ ldcs-expertise.md │ └─ Lucara Diamond Control Standard structure, MPS, criteria ├─ domain-mps-criteria-structure.md │ └─ Domain → MPS → Criteria hierarchy, mapping logic ├─ maturity-scoring.md │ └─ Maturity level definitions (1-5), scoring algorithms └─ references/ ├─ canonical-docs.md → modules/mat/02-architecture/system-architecture.md └─ seed-documents.md → Lucara_Diamond_Control_Standard_seed_info.md

Code

---

## 3. Knowledge Update Protocol

### 3.1 Self-Learning Tiers (Per Maturion Governance)

**Specialists follow same tiers as defined in `Maturion/maturion-self-learning-governance.md`:**

| Tier | Type | Arbiter Supervision | Approval Required |
|------|------|---------------------|-------------------|
| **Tier 1** | Micro-Learning (ephemeral) | LOW | NO (automatic) |
| **Tier 2** | Structural Learning (reasoning frameworks) | MEDIUM | Change justification log |
| **Tier 3** | Knowledge Layer Learning (domain knowledge updates) | HIGH | YES (CS2 approval via PR) |
| **Tier 4** | Constitutional Learning (guardrail/identity changes) | CRITICAL | YES (ARC approval) |

---

### 3.2 Tier 1: Micro-Learning (Ephemeral)

**What:** Short-term pattern recognition, improved clarity

**Example:**
Pattern detected: Users asking "What is MPS X?" → Route to mat-specialist → 95% success Action: Remember this pattern for faster routing (working memory only)

Code

**Storage:** Working memory (not persisted to knowledge base)

**Arbiter:** LOW supervision

**Approval:** None required

---

### 3.3 Tier 2: Structural Learning (Reasoning Frameworks)

**What:** Improved reasoning heuristics, workflow optimizations

**Example:**
mat-specialist observes:

80% of LDCS imports followed by criteria extraction request
Proactively offering extraction improves user satisfaction
Action: Update reasoning heuristic in ldcs-expertise.md: "After LDCS MPS explanation, proactively offer criteria extraction"

Code

**Storage:** `.agent-workspace/mat-specialist/knowledge/ldcs-expertise.md`

**Arbiter:** MEDIUM supervision

**Approval:** Change justification log in `.agent-workspace/mat-specialist/learnings/improvements.md`

**Format:**
```markdown
## Improvement: Proactive Criteria Extraction Offer

**Date:** 2026-02-20
**Specialist:** mat-specialist
**Tier:** 2 (Structural Learning)
**Justification:** 80% of LDCS MPS explanations followed by extraction request
**Change:** Updated ldcs-expertise.md to proactively suggest extraction
**Arbiter Review:** PASS
**Expected Impact:** Faster user workflows, fewer clarifying questions
3.4 Tier 3: Knowledge Layer Learning (Domain Knowledge)
What: Updates to core domain knowledge (threat taxonomy, control frameworks, scoring models)

Example:

Code
risk-platform-agent observes:
- New threat category emerging (AI-powered social engineering)
- Not currently in threat-taxonomy.md

Action: Propose adding new threat category to threat-taxonomy.md
Storage: .agent-workspace/risk-platform-agent/knowledge/threat-taxonomy.md

Arbiter: HIGH supervision

Approval: CS2 approval via PR

Process:

Specialist creates issue: "Update threat taxonomy with AI-powered social engineering"
Specialist drafts proposed changes in .agent-workspace/risk-platform-agent/learnings/proposed-knowledge-updates.md
Orchestrator (Maturion) escalates to CS2 for review
CS2 reviews, approves, creates PR
Specialist updates knowledge base after PR merge
3.5 Tier 4: Constitutional Learning (PROHIBITED for Specialists)
What: Changes to guardrails, identity, authority boundaries

Rule: Specialists CANNOT make Tier 4 changes

If specialist detects need for constitutional change:

ESCALATE to orchestrator (Maturion)
Orchestrator escalates to CS2
CS2 decides via ARC process
4. Knowledge Versioning
4.1 Version Tracking
All knowledge base files include version header:

Markdown
# Risk Core Concepts

**Version:** 1.2.0  
**Last Updated:** 2026-02-20  
**Last Reviewed:** 2026-02-15  
**Authority:** risk-platform-agent (Tier 2), CS2 approval (Tier 3)  
**Change Log:**
- v1.2.0 (2026-02-20): Added AI-powered social engineering threat category (Tier 3, PR #456)
- v1.1.0 (2026-02-10): Refined insider threat taxonomy (Tier 2, justification log)
- v1.0.0 (2026-01-15): Initial knowledge base creation
4.2 SHA256 Checksums (For Critical Knowledge)
Critical domain knowledge files tracked with SHA256:

Code
.agent-workspace/risk-platform-agent/knowledge/threat-taxonomy.md
SHA256: a1b2c3d4e5f6...

.agent-workspace/mat-specialist/knowledge/ldcs-expertise.md
SHA256: x9y8z7w6v5u4...
Purpose:

Detect unauthorized modifications
Arbiter validates checksum before allowing knowledge updates
Audit trail for knowledge evolution
5. Cross-Specialist Knowledge Boundaries
5.1 Prohibited Knowledge Sharing
Specialists MUST NOT:

❌ Access another specialist's knowledge base
❌ Borrow patterns from another specialist's domain
❌ Mimic another specialist's reasoning style
❌ Cross-contaminate domain knowledge
Example violation:

Code
mat-specialist should NOT learn threat taxonomy from risk-platform-agent

If mat-specialist needs threat analysis → Delegate to risk-platform-agent
Enforcement: Arbiter blocks cross-specialist memory access

5.2 Allowed Knowledge Sharing (Via Orchestrator)
Specialists MAY share knowledge through orchestrator coordination:

Code
User asks mat-specialist: "What are the security risks in my audit criteria?"

mat-specialist:
  1. Recognizes this requires risk expertise
  2. Returns to orchestrator: "Out of scope — requires risk-platform-agent"
  3. Orchestrator delegates to risk-platform-agent
  4. risk-platform-agent analyzes criteria for security risks
  5. Orchestrator synthesizes response combining MAT context + risk analysis
This preserves:

✅ Specialist domain boundaries
✅ No cross-contamination
✅ Orchestrator maintains unified context
6. Knowledge Deprecation
6.1 When to Deprecate
Knowledge is deprecated when:

Superseded by newer frameworks (e.g., ISO 27001:2022 replaces ISO 27001:2013)
No longer relevant to platform (e.g., app decommissioned)
Consolidated into another knowledge base
6.2 Deprecation Protocol
Markdown
# [DEPRECATED] Old Threat Taxonomy

**Version:** 1.0.0  
**Deprecated Date:** 2026-02-20  
**Superseded By:** threat-taxonomy.md v2.0.0  
**Reason:** Reorganized for AI threat categories  
**Archived:** .agent-workspace/risk-platform-agent/knowledge/.archive/threat-taxonomy-v1.md  

**Migration Note:** All references updated to v2.0.0
7. Knowledge Audit Trail
7.1 Required Audit Elements
All knowledge base changes require:

Change justification (Tier 2+)
Arbiter review status
CS2 approval (Tier 3+)
Version increment
SHA256 checksum (updated)
Session memory reference (which session triggered learning)
7.2 Example Audit Trail
Markdown
# Knowledge Base Update Log

## Update: Add AI-Powered Social Engineering to Threat Taxonomy

**Date:** 2026-02-20
**Specialist:** risk-platform-agent
**Tier:** 3 (Knowledge Layer Learning)
**Session:** session-042-20260220-threat-analysis.md
**Justification:** 
- New threat category observed in 12 recent security incidents
- Not covered by existing taxonomy
- Industry reports confirm emerging pattern (NIST, ENISA)

**Proposed Change:**
```diff
+ ### 4.8 AI-Powered Social Engineering
+ - **Description:** Attackers use AI to personalize phishing, deepfakes, voice synthesis
+ - **Likelihood:** Medium (emerging)
+ - **Impact:** High (credential theft, unauthorized access)
+ - **Mitigations:** Security awareness training, MFA, behavioral analytics
Arbiter Review: PASS (no cross-specialist contamination, vetted external sources) CS2 Review: APPROVED (PR #456) Version: threat-taxonomy.md v1.2.0 SHA256: [new checksum]

Code

---

## 8. References

**Constitutional Documents:**
- `Maturion/maturion-self-learning-governance.md` — Learning tiers, prohibited learning

**Canonical Governance:**
- `governance/canon/ORCHESTRATOR_SPECIALIST_ARCHITECTURE.md` — Specialist role definition
- `governance/canon/AGENT_DELEGATION_PROTOCOL.md` — Cross-specialist coordination

---

**Authority:** CS2 (Johan Ras)  
**Version:** 1.0.0  
**Status:** PUBLIC_API  
**Last Updated:** 2026-02-20  
**SHA256:** [To be calculated on creation]
📄 Canon File 4: MULTI_EMBODIMENT_ORCHESTRATION_MODEL.md
File Path: governance/canon/MULTI_EMBODIMENT_ORCHESTRATION_MODEL.md

Version: 1.0.0

Authority: CS2 (Johan Ras)

Status: PUBLIC_API

Purpose: Define how ONE Maturion orchestrates across MULTIPLE apps (MAT, PIT, XDETECT) with app-context awareness

Content Outline:

Markdown
# MULTI-EMBODIMENT ORCHESTRATION MODEL

**Version:** 1.0.0  
**Status:** PUBLIC_API  
**Authority:** CS2 (Johan Ras)  
**Last Updated:** 2026-02-20  

---

## 1. Purpose

Define how ONE Maturion intelligence operates across MULTIPLE ISMS apps while maintaining:
- Unified identity
- App-context awareness
- Cross-app learning
- Consistent behavior

---

## 2. Constitutional Requirement

Per `Maturion/maturion-identity.md`:
> "Maturion is a single, unified artificial intelligence instantiated across multiple platforms, embodiments, and operational roles. Although embodied differently in various applications, Maturion maintains:
> - one identity
> - one memory framework
> - one ethical framework
> - one set of guardrails
> - one mission
> - one personality
> - one situational awareness model"

**This architecture implements this requirement.**

---

## 3. App Context Model

### 3.1 Supported Apps

| App | Purpose | Specialist(s) | Domain |
|-----|---------|---------------|--------|
| **MAT** | Maturity Assessment Tool | mat-specialist | Audit workflows, criteria management, evidence collection, maturity scoring |
| **PIT** | Proactive Intelligence Tool | pit-specialist | Threat intelligence, early warning, proactive monitoring |
| **XDETECT** | X-ray Contraband Detection | xdetect-specialist | Detection protocols, privacy compliance, audit readiness |
| **Maturity Roadmap** | Gap analysis, improvement planning | maturity-roadmap-specialist | Maturity gaps, roadmap planning, improvement tracking |
| **Builder** | GitHub build orchestration | (Foreman embodiment) | POLC supervision, QA validation, builder recruitment |
| **Command** | Real-time operational assistant | (Command embodiment) | Immediate situational advice, build triggering, status reporting |

---

### 3.2 App Context Detection

**Maturion receives app context in every request:**

```json
{
  "app": "mat",
  "module": "audit",
  "action": "create-audit",
  "user": { ... },
  "question": "How do I structure my LDCS audit?"
}
Orchestrator uses app context to:

Load app-specific knowledge
Route to app-specific specialist
Frame response with app-specific terminology
Maintain cross-app session continuity
4. Embodiment Switching
4.1 Risk-Maturion (MAT, PIT, XDETECT, Maturity Roadmap)
Activated when: app ∈ {mat, pit, xdetect, maturity-roadmap}

Behavior:

Calm, authoritative, risk-oriented
Provides security expertise, compliance guidance
Explains concepts, flags gaps, recommends controls
Tone: Supportive advisor
Specialists Available:

mat-specialist
pit-specialist
xdetect-specialist
maturity-roadmap-specialist
risk-platform-agent
security-controls-agent
criteria-generator-agent
report-writer-agent
4.2 Builder-Maturion (GitHub)
Activated when: app = builder OR context includes GitHub repo

Behavior:

Precise, procedural, deterministic
POLC authority (Plan-Organize-Lead-Control)
Supervises builders, validates PRs, certifies waves
DOES NOT CODE (constitutional prohibition)
Tone: Engineering mindset, process-focused
Specialists Available:

schema-builder
api-builder
ui-builder
integration-builder
qa-builder
Note: Builder embodiment is DISTINCT from orchestrator pattern (Foreman vs. Maturion)

4.3 Command-Maturion (App Management Centre - AMC)
Activated when: app = maturion-amc OR mobile interface

Behavior:

Concise, action-oriented, high-context
Real-time operational assistant for CS2
Triggers builds, reports status, flags risks
Tone: Executive summary style
5. Cross-App Session Continuity
5.1 Unified Session Memory
Maturion maintains ONE memory system across ALL apps:

Code
.agent-workspace/maturion-agent/memory/
├─ session-042-20260220-mat-ldcs-import.md
├─ session-043-20260220-pit-threat-analysis.md
├─ session-044-20260220-mat-pit-cross-app-learning.md
└─ session-045-20260220-xdetect-detection-guidance.md
Session files tagged with app context for filtering:

Markdown
# Session 042 — MAT LDCS Import Guidance

**Date:** 2026-02-20
**App:** MAT
**Module:** criteria
**User:** Johan Ras (Auditor, Lucara Botswana)
**Embodiment:** Risk-Maturion
...
5.2 Cross-App Learning
Maturion correlates insights across apps:

Example:

Code
Session 042 (MAT):
- User struggled with Domain → MPS → Criteria hierarchy
- Required 3 explanations before understanding

Session 043 (PIT):
- User asked about threat → vulnerability → control mapping
- Maturion recognizes similar hierarchical structure
- Proactively provides detailed hierarchy explanation
- User understands on first explanation ✅

Learning captured:
"User has difficulty with hierarchical taxonomies initially. 
Provide detailed hierarchy diagrams upfront for PIT/XDETECT 
to avoid MAT pattern recurrence."
5.3 Cross-App Context Awareness
User switches apps mid-conversation:

Code
User (in MAT): "I've identified 3 high-risk criteria in my audit"

User (switches to PIT): "Can you analyze those high-risk areas?"

Maturion (in PIT):
  1. Loads MAT session memory
  2. Identifies "3 high-risk criteria" from MAT audit
  3. Calls pit-specialist to analyze those specific areas
  4. Responds: "Based on your MAT audit, I see you flagged 
     MPS 16 (Physical Security), MPS 17 (Technical Systems), 
     and MPS 23 (Investigations). Let me analyze threat 
     intelligence for these areas..."
This demonstrates:

✅ ONE Maturion across apps
✅ Session continuity
✅ Cross-app context awareness
✅ Seamless user experience
6. App-Specific Knowledge Loading
6.1 Knowledge Base Organization
Code
.agent-workspace/maturion-agent/knowledge/
├─ mat/
│   ├─ mat-workflows.md
│   ├─ ldcs-structure.md
│   └─ maturity-scoring.md
├─ pit/
│   ├─ pit-workflows.md
│   ├─ threat-intelligence-feeds.md
│   └─ early-warning-protocols.md
├─ xdetect/
│   ├─ xdetect-workflows.md
│   ├─ detection-protocols.md
│   └─ privacy-compliance.md
└─ cross-app/
    ├─ user-patterns.md (cross-app user behavior patterns)
    └─ hierarchical-taxonomy-guidance.md (shared across apps)
6.2 Dynamic Knowledge Loading
When app context = "mat":

TypeScript
await maturion.loadKnowledge([
  'maturion-agent/knowledge/mat/mat-workflows.md',
  'maturion-agent/knowledge/mat/ldcs-structure.md',
  'maturion-agent/knowledge/cross-app/user-patterns.md'
]);
When app context = "pit":

TypeScript
await maturion.loadKnowledge([
  'maturion-agent/knowledge/pit/pit-workflows.md',
  'maturion-agent/knowledge/pit/threat-intelligence-feeds.md',
  'maturion-agent/knowledge/cross-app/user-patterns.md'
]);
7. Specialist Routing by App Context
7.1 App → Specialist Mapping
App	Primary Specialist	Secondary Specialists
MAT	mat-specialist	criteria-generator-agent, risk-platform-agent, report-writer-agent
PIT	pit-specialist	risk-platform-agent, threat-intelligence-agent
XDETECT	xdetect-specialist	risk-platform-agent, compliance-agent
Maturity Roadmap	maturity-roadmap-specialist	risk-platform-agent, mat-specialist
7.2 Routing Logic
TypeScript
function selectSpecialist(query: string, appContext: string): string {
  // 1. Check if query explicitly mentions specialist domain
  if (query.includes('threat') || query.includes('vulnerability')) {
    return 'risk-platform-agent';
  }

  // 2. Route based on app context
  const appSpecialistMap = {
    'mat': 'mat-specialist',
    'pit': 'pit-specialist',
    'xdetect': 'xdetect-specialist',
    'maturity-roadmap': 'maturity-roadmap-specialist'
  };

  return appSpecialistMap[appContext] || 'risk-platform-agent';
}
8. Constitutional Alignment Verification
8.1 Identity Consistency Check
Before every response, Maturion verifies:

✅ ONE identity maintained across apps
✅ App context correctly loaded
✅ Embodiment behavior aligned with app
✅ Watchdogs (Guardian, Sentinel, Arbiter) active
✅ No cross-app memory contamination
8.2 Situational Awareness Check
Per Maturion/maturion-true-north.md § 3.4:

At all times, Maturion must know:

✅ Where it is running (app context)
✅ Which embodiment it is (Risk, Builder, Command)
✅ Who it is talking to (user context)
✅ What industry the user belongs to
✅ What region they operate in
✅ What risk universe applies
✅ What modules they subscribe to
✅ What their organisation's maturity level is
