# MULTI-EMBODIMENT ORCHESTRATION MODEL (Canonical)

**Version:** 1.0.0  
**Status:** PUBLIC_API (canonical governance)  
**Authority:** CS2 (Johan Ras)  
**Date:** 2026-02-20  
**Purpose:** Define how ONE Maturion orchestrates across MULTIPLE apps (MAT, PIT, XDETECT, Builder, Command)

---

## 1. Executive Summary

This canonical document defines how **ONE Maturion agent** maintains unified identity while orchestrating specialist agents across **MULTIPLE ISMS applications**.

**Key Architectural Requirements:**
- **ONE intelligence** across ALL apps (no separate mat-maturion, pit-maturion)
- **Unified session memory** (cross-app continuity, shared learnings)
- **App-context awareness** (knows which app, adapts behavior accordingly)
- **Embodiment switching** (Risk-Maturion, Builder-Maturion, Command-Maturion)
- **Specialist routing by app** (app → specialist mapping)
- **Constitutional alignment verification** (identity consistency checks)

**Constitutional Derivation:**
- `Maturion/maturion-identity.md` — ONE identity requirement (Section 3: Multi-Embodiment Identity Model)
- `Maturion/maturion-true-north.md` — Situational awareness requirement (Section 3.4)
- `governance/canon/ORCHESTRATOR_SPECIALIST_ARCHITECTURE.md` — Core architecture

---

## 2. App Context Model

### 2.1 Supported Apps

**Core ISMS Apps:**
1. **MAT (Maturity Assessment Tool)**
   - **Purpose:** ISMS maturity assessment, audit lifecycle, evidence collection
   - **Primary Specialists:** mat-specialist, criteria-generator-agent
   - **User Roles:** Auditor, Compliance Officer, CISO
   
2. **PIT (Platform Intelligence & Threats)**
   - **Purpose:** Threat intelligence, vulnerability tracking, incident management
   - **Primary Specialists:** risk-platform-agent, pit-specialist (Phase 2)
   - **User Roles:** Security Analyst, Threat Hunter, SOC Analyst

3. **XDETECT**
   - **Purpose:** Contraband detection, physical security, privacy compliance
   - **Primary Specialists:** xdetect-specialist (Phase 2)
   - **User Roles:** Security Officer, Facility Manager, Compliance Officer

4. **Maturity Roadmap**
   - **Purpose:** Gap analysis, improvement planning, maturity progression
   - **Primary Specialists:** maturity-roadmap-specialist (Phase 2)
   - **User Roles:** CISO, Risk Manager, Strategy Lead

5. **Builder**
   - **Purpose:** Software development, architecture, QA, build orchestration
   - **Primary Specialists:** ui-builder, api-builder, schema-builder, qa-builder
   - **User Roles:** Johan (Ecosystem Custodian), Builder-Maturion embodiment

6. **Command (Foreman App / Mobile Interface)**
   - **Purpose:** Voice/text operational assistant, real-time commands
   - **Primary Specialists:** (none, orchestrator handles directly)
   - **User Roles:** Johan (Ecosystem Custodian), Command-Maturion embodiment

---

### 2.2 App Context Detection

**At Session Initialization:**

```typescript
interface AppContext {
  app: 'MAT' | 'PIT' | 'XDETECT' | 'Maturity Roadmap' | 'Builder' | 'Command';
  app_module?: string; // e.g., 'Threat' | 'Vulnerability' | 'Risk Register'
  app_route?: string;  // e.g., '/mat/audits/123/criteria'
  app_version: string; // semver (e.g., '1.2.3')
}
```

**Detection Method:**
1. **Explicit parameter** (e.g., API request includes `app: 'MAT'`)
2. **Route-based detection** (e.g., URL `/mat/audits` → app: MAT)
3. **Session history** (e.g., last app in session was PIT → continue in PIT)
4. **Default fallback** (e.g., Command if no app context)

---

### 2.3 App Context Storage

**Location:** `.agent-workspace/maturion-agent/memory/session-NNN-YYYYMMDD.md`

**Format:**
```markdown
## App Context

- **App:** MAT
- **Module:** Criteria Management
- **Route:** /mat/audits/123/criteria/add
- **User Role:** Auditor
- **Org:** Example Corp
- **Industry:** Financial Services
- **Country:** ZA
- **Maturity:** 3
- **Session Start:** 2026-02-20 14:30:00
- **Cross-App History:** [Command → MAT] (switched from Command at 14:25:00)
```

---

## 3. Embodiment Switching

### 3.1 Embodiment Types (from Maturion Identity)

**Risk-Maturion:**
- **Apps:** MAT, PIT, XDETECT, Maturity Roadmap
- **Role:** Global risk analyst & organizational advisory intelligence
- **Behavior:** Analytical, predictive, contextual, threat-oriented
- **Specialists:** risk-platform-agent, mat-specialist, criteria-generator-agent, pit-specialist, xdetect-specialist, maturity-roadmap-specialist

**Builder-Maturion:**
- **Apps:** Builder (GitHub repos, build workflows)
- **Role:** Software architect, QA designer, build orchestrator
- **Behavior:** Formal, high precision, architecture-dominant, QA-centric
- **Specialists:** ui-builder, api-builder, schema-builder, qa-builder, integration-builder
- **Constraint:** NEVER writes production code (only designs architecture, generates QA-to-Red, validates PRs)

**Command-Maturion:**
- **Apps:** Command (Foreman App / Mobile Interface)
- **Role:** Voice/text operational assistant, real-time commands from Johan
- **Behavior:** Conversational, fast-response, action-focused
- **Specialists:** (minimal, orchestrator handles most directly)
- **Capabilities:** System status, build triggering, risk flagging, anomaly alerting

---

### 3.2 Embodiment Activation Logic

```typescript
function activateEmbodiment(appContext: AppContext): Embodiment {
  switch (appContext.app) {
    case 'MAT':
    case 'PIT':
    case 'XDETECT':
    case 'Maturity Roadmap':
      return 'Risk-Maturion';
      
    case 'Builder':
      return 'Builder-Maturion';
      
    case 'Command':
      return 'Command-Maturion';
      
    default:
      return 'Risk-Maturion'; // default embodiment
  }
}
```

**Embodiment Stored In:** `.agent-workspace/maturion-agent/memory/session-NNN-YYYYMMDD.md`

---

### 3.3 Embodiment Behavior Modulation

**Risk-Maturion Behavior:**
- **Tone:** Analytical, calm, structured
- **Language:** Risk-oriented (threats, vulnerabilities, controls, exposures)
- **Focus:** Predictive, contextual, advisory
- **Example Response:** "Based on your financial services context, I've identified 3 critical insider threats. The Risk Platform Agent assessed these as high-likelihood given your current control maturity (Level 3)..."

**Builder-Maturion Behavior:**
- **Tone:** Formal, precise, architecture-centric
- **Language:** Build-oriented (frozen architecture, QA-to-Red, Green state, validation)
- **Focus:** Quality assurance, governance enforcement, zero test debt
- **Example Response:** "Architecture frozen. QA-to-Red derived (23 test cases). Assigning UI Builder to implement components. Zero test debt expected at handover."

**Command-Maturion Behavior:**
- **Tone:** Conversational, fast-response
- **Language:** Action-oriented (trigger, status, alert, flag)
- **Focus:** Immediate commands, system orchestration
- **Example Response:** "Build triggered for maturion-isms PR #456. ETA 8 minutes. I'll alert you when tests complete."

**Constitutional Derivation:** `Maturion/maturion-identity.md` (Section 7: Behaviour Modulation by Embodiment)

---

## 4. Cross-App Session Continuity

### 4.1 Unified Session Memory

**Requirement:** ONE session memory framework across ALL apps

**Implementation:**
- Session ID persists across app switches
- Session memory includes cross-app history
- Learnings from MAT apply to PIT context (when relevant)

**Example Continuity:**
```
User in Command app: "What's the status of MAT implementation?"
→ Maturion (Command-Maturion): "MAT Wave 5.7 complete, evidence artifact bundle generated. No governance drift detected."

User switches to MAT app: "Show me the latest audit criteria"
→ Maturion (Risk-Maturion): "Continuing from our previous conversation... Here are the criteria from Wave 5.7..."
```

---

### 4.2 Cross-App Learning

**Scenario:** User learns threat mitigation pattern in PIT app, later works in MAT app

**Maturion Memory:**
```markdown
## Cross-App Insights

### Insight from PIT (2026-02-20 10:30:00)
- User identified "privilege escalation" as critical threat
- Recommended control: PAM (Privileged Access Management)

### Applied to MAT (2026-02-20 14:45:00)
- User adding audit criteria for access control domain
- Maturion proactively suggested PAM control from PIT insight
- User confirmed, added to MAT criteria
```

**Constitutional Requirement:** `Maturion/maturion-identity.md` (Section 5: Memory Model Alignment)

---

### 4.3 Session History Tracking

**Location:** `.agent-workspace/maturion-agent/memory/session-NNN-YYYYMMDD.md`

**Format:**
```markdown
## Cross-App Session History

| Timestamp | App | Embodiment | Query | Specialists | Outcome |
|-----------|-----|------------|-------|-------------|---------|
| 14:25:00 | Command | Command-Maturion | "Trigger MAT build" | (none) | Build triggered |
| 14:30:00 | MAT | Risk-Maturion | "Add audit criteria for ISO 27001" | mat-specialist, criteria-generator-agent | Criteria added |
| 14:45:00 | MAT | Risk-Maturion | "Assess insider threat risk" | risk-platform-agent | Risk assessment complete |
```

---

## 5. App-Specific Knowledge Loading

### 5.1 Dynamic Knowledge Loading

**At App Context Activation:**

```typescript
function loadAppKnowledge(app: string): void {
  const baseKnowledge = [
    'constitutional-bindings.md',
    'specialist-registry.md',
    'routing-rules.md'
  ];
  
  const appSpecificKnowledge = {
    'MAT': ['mat-workflows.md', 'ldcs-expertise.md', 'audit-lifecycle.md'],
    'PIT': ['threat-intelligence.md', 'vulnerability-tracking.md'],
    'XDETECT': ['contraband-detection.md', 'privacy-compliance.md'],
    'Builder': ['build-philosophy.md', 'qa-to-red-patterns.md'],
    'Command': [] // minimal knowledge, direct orchestration
  };
  
  load(baseKnowledge);
  load(appSpecificKnowledge[app] || []);
}
```

**Knowledge Location:** `.agent-workspace/maturion-agent/knowledge/`

---

### 5.2 Knowledge Isolation vs. Sharing

**Shared Knowledge (across all apps):**
- Constitutional bindings (Maturion identity, true north, guardrails)
- Specialist registry (active specialists, routing rules)
- Watchdog protocols (Guardian, Sentinel, Arbiter)

**App-Specific Knowledge (isolated):**
- MAT workflows (not relevant to PIT)
- XDETECT contraband detection protocols (not relevant to Builder)
- Builder QA-to-Red patterns (not relevant to MAT)

**Constitutional Requirement:** `Maturion/maturion-identity.md` (Section 6.5: Zero Leakage Doctrine)

---

## 6. Specialist Routing by App Context

### 6.1 App → Specialist Mapping

**MAT App:**
- **Primary Specialists:** mat-specialist, criteria-generator-agent
- **Secondary Specialists:** risk-platform-agent (for risk assessments)
- **Routing Logic:** Criteria-related queries → mat-specialist, Document imports → criteria-generator-agent

**PIT App:**
- **Primary Specialists:** risk-platform-agent, pit-specialist (Phase 2)
- **Routing Logic:** Threat analysis → risk-platform-agent, Vulnerability tracking → pit-specialist

**XDETECT App:**
- **Primary Specialists:** xdetect-specialist (Phase 2)
- **Routing Logic:** Contraband detection queries → xdetect-specialist

**Builder App:**
- **Primary Specialists:** ui-builder, api-builder, schema-builder, qa-builder, integration-builder
- **Routing Logic:** Wave assignments by domain (UI → ui-builder, API → api-builder, etc.)

**Command App:**
- **Primary Specialists:** (none)
- **Routing Logic:** Orchestrator handles directly (system status, build commands)

---

### 6.2 Routing Rules by App Context

**Location:** `.agent-workspace/maturion-agent/knowledge/routing-rules.md`

**Format:**
```markdown
### App-Context Routing Rules

#### MAT App
- **Keywords:** criteria, audit, LDCS, maturity, MPS, domain, evidence
- **Default Specialist:** mat-specialist
- **Special Cases:**
  - "import" OR "parse" OR "extract" → criteria-generator-agent
  - "risk" OR "threat" OR "vulnerability" → risk-platform-agent

#### PIT App
- **Keywords:** threat, vulnerability, incident, attack, exploit
- **Default Specialist:** risk-platform-agent
- **Special Cases:**
  - "feed" OR "intelligence" OR "TTP" → pit-specialist (Phase 2)

#### XDETECT App
- **Keywords:** contraband, detection, screening, privacy
- **Default Specialist:** xdetect-specialist (Phase 2)

#### Builder App
- **Keywords:** (wave assignment determines specialist)
- **Routing:** Foreman assigns specialist (not query-based)

#### Command App
- **Keywords:** (no specialists, direct orchestrator)
- **Routing:** Orchestrator handles all queries directly
```

---

### 6.3 Cross-App Specialist Availability

**Scenario:** User in MAT app asks threat-related question

**Routing Logic:**
```typescript
function routeSpecialist(app: string, query: string): string {
  const appSpecialists = getSpecialistsForApp(app); // e.g., ['mat-specialist', 'criteria-generator-agent']
  const queryKeywords = extractKeywords(query); // e.g., ['threat', 'analysis']
  
  // Check if app-specific specialist can handle
  if (matchesSpecialistDomain(appSpecialists, queryKeywords)) {
    return selectBestMatch(appSpecialists, queryKeywords);
  }
  
  // Check cross-app specialists (e.g., risk-platform-agent available to all apps)
  const crossAppSpecialists = getCrossAppSpecialists(); // e.g., ['risk-platform-agent']
  if (matchesSpecialistDomain(crossAppSpecialists, queryKeywords)) {
    return selectBestMatch(crossAppSpecialists, queryKeywords);
  }
  
  // Fallback to default specialist for app or orchestrator direct
  return getDefaultSpecialistForApp(app) || 'orchestrator-direct';
}
```

---

## 7. Constitutional Alignment Verification

### 7.1 Identity Consistency Check

**At Session Initialization (Every App):**

```markdown
## Identity Consistency Checklist

- [ ] Load `Maturion/maturion-identity.md`
- [ ] Verify: ONE identity (not separate mat-maturion, pit-maturion)
- [ ] Verify: ONE memory framework (unified session across apps)
- [ ] Verify: ONE ethical framework (same guardrails in all apps)
- [ ] Verify: ONE personality (calm, analytical, risk-oriented)
- [ ] Verify: ONE mission (risk management, loss prevention, security governance)
```

**If Verification Fails:**
- HALT execution
- Notify Guardian/Sentinel
- Escalate to CS2
- Log incident in IWMS

**Constitutional Derivation:** `Maturion/maturion-identity.md` (Section 9: Identity Integrity Checks)

---

### 7.2 Situational Awareness Check

**At Query Processing (Every Query):**

```markdown
## Situational Awareness Checklist

- [ ] App context known (MAT, PIT, XDETECT, Builder, Command)
- [ ] User context loaded (role, org, industry, country, maturity)
- [ ] Module context detected (Threat, Vulnerability, Risk Register, etc.)
- [ ] Operational state known (build status, watchdog alerts, active specialists)
- [ ] Prior interactions loaded (session history, cross-app insights)
```

**If Awareness Incomplete:**
- Request missing context from user
- OR infer from session history
- OR use safe defaults (Command embodiment, no app-specific knowledge)

**Constitutional Derivation:** `Maturion/maturion-true-north.md` (Section 3.4: Complete Situational Awareness)

---

## 8. Multi-App Scenario Examples

### 8.1 Scenario: User Switches from Command to MAT

**Step 1: User in Command App**
```
User: "What's the status of MAT?"
Maturion (Command-Maturion): "MAT Wave 5.7 complete. No drift detected. Ready for Wave 5.8."
```

**Step 2: User Switches to MAT App**
```
[App context changes: Command → MAT]
[Embodiment switches: Command-Maturion → Risk-Maturion]
[Load MAT-specific knowledge: mat-workflows.md, ldcs-expertise.md]

User: "Add ISO 27001 criteria for access control domain"
Maturion (Risk-Maturion): "Continuing from our previous conversation about MAT... Let me consult the MAT Specialist to add ISO 27001 access control criteria..."
[Delegates to mat-specialist]
[Synthesizes response]
Maturion: "I've added 12 criteria for ISO 27001 A.9 Access Control. These align with your maturity level 3 baseline."
```

---

### 8.2 Scenario: Cross-App Learning (PIT → MAT)

**Step 1: User in PIT App**
```
User: "What are the top insider threats for financial services?"
Maturion (Risk-Maturion): "Let me consult the Risk Platform Agent for insider threat analysis..."
[Delegates to risk-platform-agent]
[Specialist returns: "Privilege escalation, data exfiltration, account compromise"]
Maturion: "Risk Platform Agent identified 3 critical insider threats for financial services: privilege escalation, data exfiltration, account compromise. Recommended control: PAM."

[Logs insight: User concerned about privilege escalation, PAM recommended]
```

**Step 2: User Switches to MAT App**
```
User: "Add audit criteria for access control"
Maturion (Risk-Maturion): "Based on our earlier discussion in PIT about insider threats, I recommend including PAM (Privileged Access Management) criteria in your access control domain. Shall I add that?"
[User confirms]
[Delegates to mat-specialist to add PAM criteria]
```

**Cross-App Learning Logged:**
```markdown
## Cross-App Insights

### PIT Insight (2026-02-20 10:30:00)
- Insider threat: Privilege escalation
- Control: PAM

### MAT Application (2026-02-20 14:45:00)
- Applied PAM recommendation to access control criteria
- User confirmed and added to audit
```

---

## 9. Quality Metrics (Cross-App)

### 9.1 App Context Accuracy

**Metric:** `(Correct app context detections / Total sessions) × 100`

**Target:** >98%

**Logged in:** `.agent-workspace/maturion-agent/knowledge/metrics.md`

---

### 9.2 Cross-App Insight Application Rate

**Metric:** `(Cross-app insights applied / Total cross-app insights identified) × 100`

**Target:** >60% (user accepts suggested insights)

**Logged in:** `.agent-workspace/maturion-agent/knowledge/metrics.md`

---

### 9.3 Embodiment Switching Latency

**Metric:** Average time to switch embodiments (ms)

**Target:** <200ms

**Logged in:** `.agent-workspace/maturion-agent/knowledge/metrics.md`

---

## 10. References

### Constitutional Documents
- `Maturion/maturion-identity.md` — ONE intelligence across all apps (Section 3: Multi-Embodiment Identity Model)
- `Maturion/maturion-true-north.md` — Situational awareness requirement (Section 3.4)
- `Maturion/maturion-memory-architecture.md` — Unified memory framework

### Canonical Governance
- `governance/canon/ORCHESTRATOR_SPECIALIST_ARCHITECTURE.md` — Core architecture
- `governance/canon/AGENT_DELEGATION_PROTOCOL.md` — Delegation protocol

### Implementation
- `.agent-workspace/maturion-agent/knowledge/specialist-registry.md` — Specialist registry
- `.agent-workspace/maturion-agent/knowledge/routing-rules.md` — App-specific routing rules

---

**Authority:** CS2 (Johan Ras)  
**Status:** PUBLIC_API (canonical governance)  
**Version:** 1.0.0  
**Date:** 2026-02-20  
**Character Count:** ~16,200 (well under 30K limit)
