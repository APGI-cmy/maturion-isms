# Routing Rules

**Purpose:** Decision tree for specialist selection by Maturion orchestrator  
**Location:** `.agent-workspace/maturion-agent/knowledge/routing-rules.md`  
**Authority:** CS2 (Johan Ras)  
**Version:** 1.0.0  
**Date:** 2026-02-20

---

## Routing Decision Tree

```
START: Maturion receives user query

├─ Detect App Context (MAT, PIT, XDETECT, Builder, Command)
│  └─ Load app-specific routing rules
│
├─ Extract Query Keywords
│  └─ Tokenize query, identify domain terms
│
├─ Match Keywords to Specialist Routing Keywords
│  └─ Check specialist-registry.md for keyword matches
│
├─ Consider User Role & Context
│  ├─ CISO + strategic question → risk-platform-agent
│  ├─ Auditor + criteria question → mat-specialist
│  └─ Security Analyst + threat question → risk-platform-agent
│
├─ Select Best-Match Specialist
│  ├─ Specialist available → DELEGATE
│  └─ Specialist unavailable → FALLBACK
│
└─ Fallback Logic
   ├─ Orchestrator can handle directly → DIRECT RESPONSE
   └─ Out of capability → ESCALATE to user (explain limitation)
```

---

## App-Context Routing Rules

### MAT App

**Default Specialist:** mat-specialist

**Routing Keywords → Specialist:**
- `criteria | audit | LDCS | maturity | MPS | domain | evidence | assessment | compliance | ISO | NIST` → **mat-specialist**
- `import | parse | extract | document | upload | framework | generate` → **criteria-generator-agent**
- `risk | threat | vulnerability | control | incident | mitigation` → **risk-platform-agent**

**Examples:**
- "Add ISO 27001 criteria for access control domain" → **mat-specialist**
- "Import LDCS document and extract criteria" → **criteria-generator-agent**
- "What are the top insider threats for financial services?" → **risk-platform-agent**

---

### PIT App

**Default Specialist:** pit-specialist

**Routing Keywords → Specialist:**
- `threat intelligence | threat feed | IOC | indicator of compromise | TTP | MITRE | ATT&CK | threat hunting | kill chain | STIX | TAXII | feed configuration` → **pit-specialist**
- `risk | threat | vulnerability | incident | attack | exploit | breach | exposure | CVE | CVSS` → **pit-specialist** (PIT context) OR **risk-platform-agent** (cross-app)

**Examples:**
- "Configure STIX/TAXII threat intelligence feed for PIT" → **pit-specialist**
- "Show IOCs for recent ransomware campaign" → **pit-specialist**
- "Analyse ransomware TTPs using MITRE ATT&CK" → **pit-specialist**
- "What are the top insider threats for financial services?" → **risk-platform-agent**

---

### XDETECT App

**Default Specialist:** xdetect-specialist (Phase 2)

**Routing Keywords → Specialist:**
- `contraband | detection | screening | privacy | physical security | facility` → **xdetect-specialist** (Phase 2)

**Examples:**
- "Configure contraband detection protocols for airport security" → **xdetect-specialist** (Phase 2)

---

### Maturity Roadmap App

**Default Specialist:** maturity-roadmap-specialist (Phase 2)

**Routing Keywords → Specialist:**
- `gap analysis | improvement | roadmap | progression | maturity level` → **maturity-roadmap-specialist** (Phase 2)
- `risk | threat | control` → **risk-platform-agent**

**Examples:**
- "Generate maturity improvement roadmap for Level 2 to Level 4" → **maturity-roadmap-specialist** (Phase 2)

---

### Builder App

**Default Specialist:** (Foreman assigns, not query-based)

**Routing Logic:**
- Wave assignments determine specialist (not query-based routing)
- Foreman creates wave plan → Assigns specialist by domain (UI → ui-builder, API → api-builder, etc.)

**No Query-Based Routing in Builder App**

---

### Command App

**Default Specialist:** (none)

**Routing Logic:**
- Orchestrator handles all queries directly
- No specialist delegation (operational commands, system status, build triggering)

**Examples:**
- "What's the status of MAT?" → Orchestrator direct response
- "Trigger build for maturion-isms PR #456" → Orchestrator direct action

---

## Cross-App Specialist Availability

**Specialists Available to ALL Apps:**
- **risk-platform-agent** (threat analysis, vulnerability assessment, risk scoring)

**App-Specific Specialists:**
- **mat-specialist** → MAT only
- **criteria-generator-agent** → MAT only
- **pit-specialist** → PIT only (ACTIVE — Phase 4-5)
- **xdetect-specialist** → XDETECT only (Phase 2)
- **maturity-roadmap-specialist** → Maturity Roadmap only (Phase 2)
- **ui-builder, api-builder, schema-builder, qa-builder, integration-builder** → Builder only

**Routing Logic for Cross-App Specialists:**
```typescript
function routeSpecialist(app: string, query: string): string {
  const appSpecialists = getSpecialistsForApp(app);
  const queryKeywords = extractKeywords(query);
  
  // Check if app-specific specialist can handle
  if (matchesSpecialistDomain(appSpecialists, queryKeywords)) {
    return selectBestMatch(appSpecialists, queryKeywords);
  }
  
  // Check cross-app specialists (e.g., risk-platform-agent)
  const crossAppSpecialists = getCrossAppSpecialists();
  if (matchesSpecialistDomain(crossAppSpecialists, queryKeywords)) {
    return selectBestMatch(crossAppSpecialists, queryKeywords);
  }
  
  // Fallback to default specialist for app or orchestrator direct
  return getDefaultSpecialistForApp(app) || 'orchestrator-direct';
}
```

---

## Transparency Mode Decision

**Transparent Delegation (User Sees Specialist):**

**Triggers:**
- Novel domain expertise (user learning value)
  - Example: "Let me consult the Risk Platform Agent for insider threat analysis..."
- Complex multi-specialist chains (user needs to understand process)
  - Example: "I'll parse the document with Criteria Generator, then have MAT Specialist map domains..."
- High-stakes decisions (trust-building through transparency)
  - Example: "Risk Platform Agent identified 3 critical threats..."
- User capability inquiry ("what can you do?", "how does this work?")

**User Experience:**
- Maturion announces delegation: "Let me consult the [Specialist Name] for this..."
- Shows specialist reasoning (if applicable)
- Credits specialist in response: "According to the Risk Platform Agent..."

---

**Invisible Delegation (User Does NOT See Specialist):**

**Triggers:**
- Mechanical/operational tasks (no educational value)
  - Example: Data fetching, formatting, background validation
- Routine operations (user knows this workflow well)
  - Example: "Generate monthly risk report" (user has seen this before)
- Background validation (quality checks, compliance scans)
  - User doesn't need to know internal routing
- Simplicity priority (user wants answer, not process explanation)

**User Experience:**
- User sees final result only
- No mention of specialist routing
- Seamless, as if Maturion handled directly

---

**Decision Tree:**
```
START: Specialist selected for delegation

├─ Is this a novel/complex task? → YES → TRANSPARENT
│  └─ User learns specialist capabilities
│
├─ Is this a high-stakes decision? → YES → TRANSPARENT
│  └─ Trust via transparency
│
├─ Did user ask about capabilities? → YES → TRANSPARENT
│  └─ Educational context
│
├─ Is this a routine/mechanical task? → YES → INVISIBLE
│  └─ No educational value, seamless UX
│
└─ Default → TRANSPARENT (err on side of transparency)
```

**Canonical Reference:** `governance/canon/AGENT_DELEGATION_PROTOCOL.md` Section 4

---

## Fallback Logic

### Specialist Unavailable

**Scenario:** Maturion attempts delegation, but specialist not responding

**Handling:**
1. Log specialist unavailability in session memory
2. Attempt orchestrator direct response (if within capability)
3. OR return to user: "The [Specialist Name] is currently unavailable. I can provide a basic response, or you can retry later."
4. Escalate to CS2 if specialist repeatedly unavailable (>3 consecutive sessions)

---

### Out-of-Scope Task

**Scenario:** No specialist available for query domain

**Handling:**
1. Attempt orchestrator direct response (general knowledge)
2. OR return to user: "This task requires [domain] expertise. I don't have a specialist for that yet. Let me provide a general response..."
3. Log out-of-scope query in session memory
4. Consider for future specialist creation (if recurring pattern)

---

### Orchestrator Direct Response

**Scenarios Where Maturion Handles Directly (No Specialist):**
- System status queries ("What's the status of MAT?")
- Build commands ("Trigger build for maturion-isms PR #456")
- General knowledge queries (within Maturion's constitutional knowledge)
- Meta queries ("What specialists do you have?", "What apps do you support?")

---

## Multi-Specialist Chaining

**Triggers:**
- Complex task requiring multiple domain experts
- Example: "Import LDCS document and generate risk heat map"

**Chain Definition:**
```
Step 1: criteria-generator-agent (parse LDCS)
→ Output: Extracted criteria (Domain→MPS→Criteria structure)

Step 2: mat-specialist (map criteria to MAT domains)
→ Input: Extracted criteria from Step 1
→ Output: Criteria mapped to MAT domains

Step 3: risk-platform-agent (generate risk heat map)
→ Input: Mapped criteria from Step 2
→ Output: Risk heat map visualization
```

**Routing Logic:**
```typescript
function planMultiSpecialistChain(query: string): Chain {
  const queryAnalysis = analyzeComplexQuery(query);
  const requiredDomains = queryAnalysis.domains; // ['parsing', 'mapping', 'risk-analysis']
  
  const chain = [];
  for (const domain of requiredDomains) {
    const specialist = getSpecialistForDomain(domain);
    chain.push({
      step: chain.length + 1,
      specialist: specialist.id,
      task: defineTaskForDomain(domain, queryAnalysis),
      input_from_step: chain.length > 0 ? chain.length : null
    });
  }
  
  return chain;
}
```

**Canonical Reference:** `governance/canon/AGENT_DELEGATION_PROTOCOL.md` Section 6

---

## Routing Accuracy Metrics

**Metric:** `(Correct specialist selected / Total delegations) × 100`

**Target:** >90%

**Logged in:** `.agent-workspace/maturion-agent/knowledge/metrics.md`

**Feedback Loop:**
- Log routing decisions in session memory
- Capture user corrections ("Actually, I meant...")
- Update routing rules based on patterns (Tier 2 learning, Arbiter supervised)

---

**Authority:** CS2 (Johan Ras)  
**Version:** 1.0.0  
**Date:** 2026-02-20  
**Canonical References:**
- `governance/canon/ORCHESTRATOR_SPECIALIST_ARCHITECTURE.md` Section 3.1 (Routing Intelligence)
- `governance/canon/AGENT_DELEGATION_PROTOCOL.md` Section 4 (Transparency Decision)
- `governance/canon/MULTI_EMBODIMENT_ORCHESTRATION_MODEL.md` Section 6 (App-Context Routing)
