# AGENT DELEGATION PROTOCOL (Canonical)

**Version:** 1.0.0  
**Status:** PUBLIC_API (canonical governance)  
**Authority:** CS2 (Johan Ras)  
**Date:** 2026-02-20  
**Purpose:** Define canonical protocol for orchestrator → specialist delegation

---

## 1. Executive Summary

This canonical document defines the **delegation protocol** for orchestrator agents (e.g., Maturion) to invoke specialist agents (e.g., risk-platform-agent, mat-specialist).

**Key Protocol Elements:**
- **Delegation request format** (JSON payload: from, to, task, transparency, context, input, requirements)
- **Delegation response format** (status, output, metadata, execution time, confidence)
- **Transparency decision criteria** (visible vs. invisible delegation rules)
- **Validation gates** (pre-delegation and post-delegation Guardian/Sentinel/Arbiter checks)
- **Multi-specialist chaining** (chain definition, execution, failure handling)
- **Error handling** (specialist unavailable, out-of-scope, watchdog violation)

**Constitutional Derivation:**
- `governance/canon/ORCHESTRATOR_SPECIALIST_ARCHITECTURE.md` — Core architecture
- `Maturion/oversight-system.md` — Watchdog validation rules

---

## 2. Delegation Request Format

### 2.1 JSON Schema

```json
{
  "from": "string (orchestrator-id)",
  "to": "string (specialist-id)",
  "task": "string (human-readable task description)",
  "transparency": "transparent | invisible",
  "context": {
    "app": "string (MAT | PIT | XDETECT | Builder | Command)",
    "user_role": "string (CISO | Auditor | Risk Manager | etc.)",
    "org": "string (organization name)",
    "industry": "string (Financial Services | Healthcare | etc.)",
    "country": "string (ISO 3166-1 alpha-2 code)",
    "maturity": "number (1-5 maturity level)",
    "session_id": "string (cross-app session identifier)"
  },
  "input": {
    "/* domain-specific input parameters */"
  },
  "requirements": {
    "format": "string (markdown | json | html)",
    "confidence_threshold": "number (0.0-1.0)",
    "/* other requirements */"
  }
}
```

---

### 2.2 Field Descriptions

**`from` (required):** Orchestrator agent ID (e.g., "maturion-agent")

**`to` (required):** Specialist agent ID (e.g., "risk-platform-agent")

**`task` (required):** Human-readable task description

**`transparency` (required):** Delegation visibility mode
- `"transparent"` — User sees delegation ("Let me consult the Risk Platform Agent...")
- `"invisible"` — Seamless execution (user sees final result only)

**`context` (required):** User and app context
- `app` — Which ISMS app (MAT, PIT, XDETECT, Builder, Command)
- `user_role` — User's role (CISO, Auditor, Risk Manager, etc.)
- `org` — Organization name (for tenant isolation)
- `industry` — Industry sector (for domain-specific expertise)
- `country` — Country code (for regulatory context)
- `maturity` — Organization maturity level (1-5)
- `session_id` — Cross-app session identifier (for continuity)

**`input` (optional):** Domain-specific input parameters

**`requirements` (optional):** Output requirements
- `format` — Output format (markdown, json, html)
- `confidence_threshold` — Minimum confidence level (0.0-1.0)
- Other domain-specific requirements

---

### 2.3 Example Delegation Request

```json
{
  "from": "maturion-agent",
  "to": "risk-platform-agent",
  "task": "Analyze insider threat landscape for financial services in South Africa",
  "transparency": "transparent",
  "context": {
    "app": "MAT",
    "user_role": "CISO",
    "org": "Example Bank",
    "industry": "Financial Services",
    "country": "ZA",
    "maturity": 3,
    "session_id": "session-012-20260220"
  },
  "input": {
    "threat_category": "insider",
    "region": "ZA",
    "focus": ["malicious", "negligent", "compromised"]
  },
  "requirements": {
    "format": "markdown",
    "include_mitigations": true,
    "confidence_threshold": 0.7
  }
}
```

---

## 3. Delegation Response Format

### 3.1 JSON Schema

```json
{
  "status": "success | partial | escalate | error",
  "output": {
    "/* domain-specific output */"
  },
  "metadata": {
    "specialist_id": "string",
    "execution_time_ms": "number",
    "confidence": "number (0.0-1.0)",
    "knowledge_base_version": "string (semver)",
    "validation": {
      "guardian": "pass | fail | warn",
      "sentinel": "pass | fail | warn",
      "arbiter": "pass | fail | warn"
    },
    "escalation_reason": "string (if status=escalate)",
    "error_message": "string (if status=error)"
  }
}
```

---

### 3.2 Field Descriptions

**`status` (required):** Delegation outcome
- `"success"` — Task completed successfully, output valid
- `"partial"` — Task partially completed (some requirements not met)
- `"escalate"` — Task out-of-scope, requires orchestrator intervention
- `"error"` — Execution error (technical failure, validation failure)

**`output` (required if success/partial):** Domain-specific output (varies by specialist)

**`metadata` (required):** Execution metadata
- `specialist_id` — Specialist that executed task
- `execution_time_ms` — Execution time in milliseconds
- `confidence` — Specialist's confidence in output (0.0-1.0)
- `knowledge_base_version` — Version of specialist knowledge base used
- `validation` — Watchdog validation results (Guardian, Sentinel, Arbiter)
- `escalation_reason` — If status=escalate, why task escalated
- `error_message` — If status=error, error details

---

### 3.3 Example Delegation Response

```json
{
  "status": "success",
  "output": {
    "threat_summary": "Insider threat landscape for financial services in South Africa...",
    "top_threats": [
      {
        "threat": "Privileged user abuse",
        "likelihood": "high",
        "impact": "critical",
        "mitigation": "Implement PAM, audit privileged actions"
      },
      {
        "threat": "Data exfiltration via removable media",
        "likelihood": "medium",
        "impact": "high",
        "mitigation": "DLP controls, USB port blocking"
      }
    ]
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

## 4. Transparency Decision Criteria

### 4.1 Transparent Delegation (Visible to User)

**When to use transparent delegation:**
- **Novel domain expertise** — User learning value (e.g., "Let me consult the Risk Platform Agent for threat analysis...")
- **Complex multi-specialist chains** — User needs to understand process (e.g., "I'll parse the document with Criteria Generator, then have MAT Specialist map domains...")
- **High-stakes decisions** — Trust-building through transparency (e.g., "Risk Platform Agent identified 3 critical threats...")
- **User capability inquiry** — User explicitly asks "what can you do?" or "how does this work?"
- **Educational context** — User is learning system capabilities

**User Experience:**
- Orchestrator announces delegation: "Let me consult the [Specialist Name] for this..."
- Shows specialist reasoning (if applicable)
- Credits specialist in response: "According to the Risk Platform Agent..."

---

### 4.2 Invisible Delegation (Seamless to User)

**When to use invisible delegation:**
- **Mechanical/operational tasks** — No educational value (e.g., data fetching, formatting)
- **Routine operations** — Standard workflows user knows well (e.g., "Generate monthly risk report")
- **Background validation** — Quality checks, compliance scans (user doesn't need to know)
- **Repeated tasks** — User has seen this delegation before (no novelty)
- **Simplicity priority** — User wants answer, not process explanation

**User Experience:**
- User sees final result only
- No mention of specialist routing
- Seamless, as if orchestrator handled directly

---

### 4.3 Decision Tree

```
START: Orchestrator receives query

├─ Is this a novel/complex task? → YES → TRANSPARENT
│   └─ User learns specialist capabilities
│
├─ Is this a high-stakes decision? → YES → TRANSPARENT
│   └─ Trust via transparency
│
├─ Did user ask about capabilities? → YES → TRANSPARENT
│   └─ Educational context
│
├─ Is this a routine/mechanical task? → YES → INVISIBLE
│   └─ No educational value, seamless UX
│
└─ Default → TRANSPARENT (err on side of transparency)
```

**Decision Documented In:** `.agent-workspace/maturion-agent/knowledge/routing-rules.md`

---

## 5. Validation Gates

### 5.1 Pre-Delegation Validation (Guardian)

**Guardian Checks (Before Invoking Specialist):**
- [ ] Specialist authorized to access user context
- [ ] No cross-tenant contamination risk in delegation request
- [ ] Task does not violate policy (forbidden content, dangerous operations)
- [ ] User permissions sufficient for requested operation

**If Guardian Fails:**
- BLOCK delegation
- Return error to orchestrator: `"guardian_blocked"`
- Log incident in IWMS
- Escalate to CS2 if critical violation

**Constitutional Derivation:** `Maturion/oversight-system.md` (Section 3: Guardian)

---

### 5.2 Pre-Delegation Validation (Arbiter)

**Arbiter Checks (Before Invoking Specialist):**
- [ ] Specialist knowledge base integrity verified
- [ ] No unauthorized memory access attempts detected
- [ ] Specialist within domain scope (not accessing other specialist knowledge)

**If Arbiter Fails:**
- BLOCK delegation
- Freeze specialist knowledge base writes
- Return error to orchestrator: `"arbiter_blocked"`
- Escalate to CS2

**Constitutional Derivation:** `Maturion/oversight-system.md` (Section 5: Arbiter)

---

### 5.3 Post-Delegation Validation (Guardian)

**Guardian Checks (After Specialist Returns Response):**
- [ ] Specialist output contains no forbidden content
- [ ] No cross-tenant leakage in response
- [ ] No sensitive data exposure (credentials, secrets, PII without authorization)
- [ ] No policy violations in output

**If Guardian Fails:**
- BLOCK response from reaching user
- REDACT violating content (if salvageable)
- Return error to orchestrator: `"guardian_blocked_output"`
- Log incident in IWMS

---

### 5.4 Post-Delegation Validation (Sentinel)

**Sentinel Checks (After Specialist Returns Response):**
- [ ] Specialist response time within expected range (no performance drift)
- [ ] Specialist behavior consistent with historical patterns
- [ ] No anomalous response patterns detected

**If Sentinel Fails:**
- WARN orchestrator (not blocking, advisory)
- Flag specialist for review
- Log behavioral anomaly
- Throttle if anomaly burst detected

**Constitutional Derivation:** `Maturion/oversight-system.md` (Section 4: Sentinel)

---

### 5.5 Post-Delegation Validation (Arbiter)

**Arbiter Checks (After Specialist Returns Response):**
- [ ] Specialist did not access unauthorized memory
- [ ] No unauthorized learning occurred (Tier 4 violation)
- [ ] Knowledge base boundaries respected (no cross-specialist contamination)

**If Arbiter Fails:**
- BLOCK response
- FREEZE specialist knowledge base
- Rollback to last stable knowledge base snapshot
- Return error to orchestrator: `"arbiter_blocked_learning"`
- Escalate to CS2 for ARC review

---

## 6. Multi-Specialist Chaining

### 6.1 Chain Definition

**Use Case:** Complex task requiring multiple specialists in sequence

**Chain Structure:**
```json
{
  "chain_id": "chain-uuid",
  "orchestrator": "maturion-agent",
  "steps": [
    {
      "step": 1,
      "specialist": "criteria-generator-agent",
      "task": "Parse LDCS document",
      "input": {"document": "ldcs-iso27001.pdf"},
      "output_to_step": 2
    },
    {
      "step": 2,
      "specialist": "mat-specialist",
      "task": "Map criteria to MAT domains",
      "input_from_step": 1,
      "output_to_step": 3
    },
    {
      "step": 3,
      "specialist": "risk-platform-agent",
      "task": "Generate risk heat map",
      "input_from_step": 2,
      "output_to_user": true
    }
  ]
}
```

---

### 6.2 Chain Execution Protocol

**Step 1: Plan Chain**
- Orchestrator analyzes query
- Determines specialist sequence (Step 1 → Step 2 → Step N)
- Defines data flow between steps
- Estimates total execution time

**Step 2: Execute Chain**
```
FOR each step in chain:
  1. Pre-validate (Guardian, Arbiter)
  2. Invoke specialist (delegation request)
  3. Await response
  4. Post-validate (Guardian, Sentinel, Arbiter)
  5. IF validation fails → ABORT chain, return partial results
  6. Pass output to next step
  7. Log step execution in session memory
END FOR
```

**Step 3: Synthesize Final Response**
- Aggregate all specialist outputs
- Frame response for user
- Include chain execution summary (if transparent mode)
- Log complete chain in session memory

---

### 6.3 Chain Failure Handling

**Failure at Step N:**
1. STOP chain execution immediately
2. Capture partial results from Steps 1 to N-1
3. Return to user with context:
   ```
   "I was able to complete Steps 1-2 (parsed document, mapped criteria),
   but Step 3 (risk heat map generation) failed due to [reason].
   Here's what I have so far: [partial results]
   
   Would you like me to retry Step 3, or continue with partial results?"
   ```
4. Log failure in session memory
5. Escalate to CS2 if repeated failures on same chain

---

### 6.4 Chain Validation Gates

**At Each Step:**
- Pre-delegation: Guardian + Arbiter
- Post-delegation: Guardian + Sentinel + Arbiter

**Chain-Level Validation:**
- No circular delegation (Step N cannot call Step M where M ≤ N)
- No unauthorized data flow between steps (Arbiter enforced)
- Total chain execution time < threshold (default: 30 seconds, configurable)

---

## 7. Error Handling

### 7.1 Specialist Unavailable

**Scenario:** Orchestrator attempts delegation, but specialist not responding

**Handling:**
```json
{
  "status": "error",
  "metadata": {
    "error_message": "Specialist 'risk-platform-agent' unavailable (timeout after 5000ms)",
    "fallback": "orchestrator_direct_response"
  }
}
```

**Orchestrator Action:**
- Log specialist unavailability
- Attempt direct response (if within orchestrator capability)
- OR return to user: "The Risk Platform Agent is currently unavailable. I can provide a basic response, or you can retry later."
- Escalate to CS2 if specialist repeatedly unavailable

---

### 7.2 Out-of-Scope Task

**Scenario:** Specialist receives task outside domain scope

**Specialist Response:**
```json
{
  "status": "escalate",
  "metadata": {
    "escalation_reason": "Task 'analyze cloud infrastructure security' outside domain scope. Domain: threat analysis, vulnerability assessment, risk scoring. Recommend: infrastructure-security-agent"
  }
}
```

**Orchestrator Action:**
- Re-route to suggested specialist (if available)
- OR return to user: "This task requires infrastructure security expertise. I don't have a specialist for that yet. Let me provide a general response..."
- Log escalation for future specialist creation consideration

---

### 7.3 Watchdog Violation

**Scenario:** Guardian/Sentinel/Arbiter blocks delegation or response

**Handling:**
```json
{
  "status": "error",
  "metadata": {
    "error_message": "Guardian blocked: Cross-tenant data detected in specialist output",
    "validation": {
      "guardian": "fail",
      "sentinel": "pass",
      "arbiter": "pass"
    }
  }
}
```

**Orchestrator Action:**
- DO NOT return blocked output to user
- Log watchdog violation in IWMS
- Return safe alternative response to user
- Escalate to CS2 for investigation

---

## 8. Session Memory Capture

### 8.1 Orchestrator Delegation Log

**Location:** `.agent-workspace/maturion-agent/memory/session-NNN-YYYYMMDD.md`

**Format:**
```markdown
### Delegation Log

| Timestamp | Specialist | Task | Transparency | Status | Execution Time | Validation |
|-----------|-----------|------|--------------|--------|----------------|------------|
| 2026-02-20 14:32:15 | risk-platform-agent | Analyze insider threat landscape | transparent | success | 1250ms | G:pass, S:pass, A:pass |
| 2026-02-20 14:35:42 | mat-specialist | Map criteria to domains | invisible | success | 800ms | G:pass, S:pass, A:pass |
```

---

### 8.2 Specialist Task Execution Log

**Location:** `.agent-workspace/{specialist-id}/memory/session-NNN-YYYYMMDD.md`

**Format:**
```markdown
### Task Execution

**Task:** Analyze insider threat landscape for financial services in South Africa
**From:** maturion-agent
**Timestamp:** 2026-02-20 14:32:15
**Context:** MAT app, CISO role, Example Bank, Financial Services, ZA, Maturity 3

**Execution Steps:**
1. Loaded threat taxonomy (insider threats)
2. Filtered by region (ZA) and industry (Financial Services)
3. Applied maturity level 3 controls baseline
4. Generated top threats with mitigations

**Output:** Success (confidence: 0.85)
**Validation:** Guardian: pass, Sentinel: pass, Arbiter: pass
**Execution Time:** 1250ms
```

---

## 9. Quality Metrics

### 9.1 Delegation Success Rate

**Metric:** `(Successful delegations / Total delegations) × 100`

**Target:** >95%

**Logged in:** `.agent-workspace/maturion-agent/knowledge/metrics.md`

---

### 9.2 Validation Pass Rate

**Metric:** `(Delegations with all watchdogs pass / Total delegations) × 100`

**Target:** >98%

**Logged in:** `.agent-workspace/maturion-agent/knowledge/metrics.md`

---

### 9.3 Multi-Specialist Chain Success Rate

**Metric:** `(Chains completed successfully / Total chains initiated) × 100`

**Target:** >85%

**Logged in:** `.agent-workspace/maturion-agent/knowledge/metrics.md`

---

## 10. References

### Constitutional Documents
- `Maturion/maturion-identity.md` — ONE Maturion identity
- `Maturion/oversight-system.md` — Guardian, Sentinel, Arbiter watchdogs

### Canonical Governance
- `governance/canon/ORCHESTRATOR_SPECIALIST_ARCHITECTURE.md` — Core architecture
- `governance/canon/MULTI_EMBODIMENT_ORCHESTRATION_MODEL.md` — Cross-app orchestration

### Implementation
- `.agent-workspace/maturion-agent/knowledge/routing-rules.md` — Transparency decision criteria

---

**Authority:** CS2 (Johan Ras)  
**Status:** PUBLIC_API (canonical governance)  
**Version:** 1.0.0  
**Date:** 2026-02-20  
**Character Count:** ~15,800 (well under 30K limit)
