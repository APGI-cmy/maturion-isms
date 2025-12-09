# GAP PRIORITY ENGINE v1.0 — AI REASONING LAYER

**Module:** PIT (Project Implementation Tracker)  
**Version:** 1.0  
**Status:** Architecture Approved  
**Part:** 2 of 4 — AI Reasoning Layer (Interpretation & Explanation)

---

## 0. Purpose

The AI Reasoning Layer provides human-readable interpretation, explanation, and actionable recommendations on top of the numeric priority scores calculated by the Gap Priority Engine.

This layer ensures that:

- **Priority decisions are explainable** to auditors, operators, and stakeholders
- **Reasoning is factual** and derived from actual gap context data
- **Recommendations are actionable** and specific to the gap characteristics
- **AI does not override** the numeric priority model
- **Transparency is maintained** for compliance and auditability

### Context

Part 1 of the Gap Priority Engine specification defined the deterministic numeric model that calculates priority scores (0.00-4.00+) based on gap characteristics, risk factors, and business context.

Part 2 defines how AI models interpret these scores and generate human-consumable insights:

- **Priority label assignment** (low, medium, high, critical)
- **Reasoning summaries** explaining why the priority applies
- **Actionable recommendations** for closing the gap
- **Contextual notes** for dashboard display and task descriptions

### Design Principles

1. **AI Explains, Never Overrides:** AI interprets the numeric priority but cannot change it
2. **Factual Grounding:** All reasoning must be derived from provided gap context
3. **No Hallucinations:** AI must not invent controls, evidence, incidents, or regulations
4. **Actionable Outputs:** Recommendations must be specific and implementable
5. **Deterministic Labeling:** Priority labels are derived directly from numeric scores using fixed thresholds
6. **Audit Trail:** All AI interactions are logged with timestamps, model versions, and inputs/outputs

---

## 1. System Prompt for AI Engine

The following system prompt defines the AI's role, constraints, and expected behavior:

```
You are Maturion, a reasoning engine that explains and prioritizes maturity gaps for security implementation.

Your role:
- Interpret numeric priority scores calculated by the Gap Priority Engine
- Confirm the correct priority label based on the numeric score
- Explain in 1-3 sentences why this priority applies
- Provide 2-5 actionable, specific recommendations for closing the gap

You receive:
- A gap_context object containing maturity metrics, risk factors, evidence quality, regulatory requirements, and time exposure
- A priority_score (numeric value 0.00-4.00+) calculated by the numeric priority model

You must:
1. Assign the priority label using the deterministic mapping (you cannot override this):
   - 0.00 - 0.50 → "low"
   - 0.51 - 1.50 → "medium"
   - 1.51 - 2.50 → "high"
   - 2.51+ → "critical"

2. Generate a reasoning_summary that:
   - States the priority level and score
   - Explains 2-4 key factors driving the priority (e.g., criticality, risks, regulatory requirements, time exposure)
   - Is factual and derived only from the gap_context provided
   - Is 1-3 sentences, concise and clear

3. Generate 2-5 recommendations that:
   - Are specific and actionable (not generic advice)
   - Address the most significant factors in the gap
   - Reference actual context elements (domain names, MPS names, specific frameworks)
   - Include concrete next steps (e.g., "Update SOP-AC-01", not just "Update SOPs")
   - Consider evidence quality, risk severity, and regulatory requirements

You must NOT:
- Override or contradict the numeric priority score or its derived label
- Invent controls, logs, incidents, regulations, evidence, or processes not mentioned in gap_context
- Provide vague recommendations (e.g., "Improve security" or "Add more controls")
- Include recommendations unrelated to the specific gap characteristics

If information is missing from gap_context, you may state:
- "No audit evidence was provided."
- "No linked risks were identified."
- "Regulatory framework requirements were not specified."

You must produce valid JSON output only, following the specified schema.
```

---

## 2. Input Format Sent to AI

The AI receives a structured JSON object containing:

1. **gap_context:** Complete context about the maturity gap
2. **priority_score:** The calculated numeric priority (from Part 1)

### Example Input

```json
{
  "gap_context": {
    "origin_type": "criterion",
    "origin_id": "a3f7c8e1-4b5d-4e8f-9c2a-1b3d4e5f6a7b",
    "domain_name": "Access Control",
    "domain_id": "d1a2b3c4-5e6f-7a8b-9c0d-1e2f3a4b5c6d",
    "mps_name": "Identity Management",
    "mps_id": "m7e8f9a0-1b2c-3d4e-5f6a-7b8c9d0e1f2a",
    "criterion_name": "Multi-Factor Authentication Implementation",
    "current_level": 2,
    "target_level": 4,
    "gap": 2,
    "numeric_score": 0.35,
    "evidence_count": 3,
    "avg_evidence_confidence": 0.40,
    "criticality": "high",
    "linked_risks": {
      "count": 2,
      "max_severity": "high",
      "total_risk_score": 24.5
    },
    "linked_incidents": {
      "count": 1,
      "max_severity": "major",
      "recent_count": 1
    },
    "regulatory_relevance": "high",
    "compliance_frameworks": ["ISO 27001", "SOC 2 Type II"],
    "audit_flags": ["Auditor requested evidence update"],
    "time_exposed_days": 120,
    "previous_gap": 2,
    "gap_trend": "stable",
    "existing_pit_tasks": {
      "open_count": 0,
      "closed_count": 1,
      "overdue_count": 0,
      "oldest_task_age_days": null
    }
  },
  "priority_score": 0.81
}
```

### Input Schema Definition

```typescript
interface AIReasoningInput {
  gap_context: {
    // Core identification
    origin_type: 'criterion' | 'mps' | 'domain';
    origin_id: string;
    
    // Hierarchy
    domain_name: string;
    domain_id: string;
    mps_name?: string;
    mps_id?: string;
    criterion_name?: string;
    
    // Maturity metrics
    current_level: number;        // 1-5
    target_level: number;         // 1-5
    gap: number;                  // target - current
    numeric_score: number;        // 0.00-1.00
    
    // Evidence quality
    evidence_count: number;
    avg_evidence_confidence: number;  // 0.00-1.00
    
    // Risk & impact
    criticality: 'low' | 'medium' | 'high' | 'critical';
    linked_risks: {
      count: number;
      max_severity: 'low' | 'medium' | 'high' | 'critical';
      total_risk_score: number;
    };
    linked_incidents: {
      count: number;
      max_severity: string;
      recent_count: number;
    };
    
    // Regulatory
    regulatory_relevance: 'none' | 'moderate' | 'high';
    compliance_frameworks: string[];
    audit_flags: string[];
    
    // Time & history
    time_exposed_days: number;
    previous_gap: number | null;
    gap_trend: 'improving' | 'stable' | 'worsening' | 'new';
    
    // Existing work
    existing_pit_tasks: {
      open_count: number;
      closed_count: number;
      overdue_count: number;
      oldest_task_age_days: number | null;
    };
  };
  priority_score: number;  // Calculated by numeric model
}
```

---

## 3. Expected AI Output Format

The AI must return a structured JSON object with:

1. **priority:** The assigned label (derived from priority_score)
2. **reasoning_summary:** Human-readable explanation (1-3 sentences)
3. **recommendations:** Array of 2-5 actionable steps

### Example Output

```json
{
  "priority": "critical",
  "reasoning_summary": "This gap occurs in a high-criticality domain (Access Control) with recent incidents and strong regulatory relevance (ISO 27001, SOC 2). Evidence confidence is weak (0.40) and the maturity gap is significant (2 levels). The gap has persisted for 120 days without resolution.",
  "recommendations": [
    "Create a dedicated PIT project to implement Multi-Factor Authentication across all user accounts, targeting completion within 60 days.",
    "Update and enforce access control policies to require MFA for all privileged accounts immediately.",
    "Collect behavioral evidence and system logs demonstrating MFA usage for validation against ISO 27001 and SOC 2 requirements.",
    "Schedule an internal audit within 60 days to verify MFA implementation and evidence quality.",
    "Address the auditor's request for evidence update by documenting current MFA coverage and planned improvements."
  ]
}
```

### Output Schema Definition

```typescript
interface AIReasoningOutput {
  priority: 'low' | 'medium' | 'high' | 'critical';
  reasoning_summary: string;  // 1-3 sentences, max 500 characters
  recommendations: string[];  // 2-5 items, each max 200 characters
}
```

---

## 4. Priority Label Mapping Rules

The AI uses deterministic thresholds to assign priority labels. This mapping is **non-negotiable** and cannot be overridden by the AI.

### Mapping Table

| Priority Score | Priority Label | Label Assignment Rule |
|---------------|----------------|----------------------|
| 0.00 - 0.50   | **low**        | Minimal urgency, defer or batch with other low-priority items |
| 0.51 - 1.50   | **medium**     | Standard priority, create task with 60-90 day due date |
| 1.51 - 2.50   | **high**       | Urgent priority, create task with 30 day due date |
| 2.51+         | **critical**   | Immediate action required, escalate to leadership, due date ≤ 14 days |

### Additional Rules

1. **Boundary Cases:**
   - Score exactly 0.50 → "low"
   - Score exactly 1.50 → "medium"
   - Score exactly 2.50 → "high"

2. **Override Rule:**
   - If `gap_context.criticality === "critical"`, the priority label must be at least `"high"`, regardless of numeric score
   - This prevents critical business functions from being deprioritized due to other factors

3. **Validation:**
   - The AI output's priority label must match the threshold-based assignment
   - If mismatch is detected, the system rejects the AI output and uses the deterministic label

---

## 5. Reasoning Summary Generation Rules

The reasoning summary explains **why** the gap has its assigned priority. It must be factual, concise, and grounded in the gap_context.

### Structure

The reasoning summary should follow this pattern:

```
"Priority {label} ({score}): {Core gap description}. {2-4 key factors}."
```

### Key Factors to Consider (Priority Order)

1. **Gap Size & Maturity Level:**
   - "Gap of {gap} levels from level {current_level} to {target_level}"
   - "Current maturity is {maturity_label} while target is {target_label}"

2. **Criticality:**
   - If high/critical: "This {origin_type} is {criticality}-criticality for business operations"
   - "Affects {domain_name} which is critical to {business function}"

3. **Risk & Incidents:**
   - If risks exist: "Associated with {count} {severity} risks"
   - If incidents exist: "Recent incident ({severity}) occurred {days} days ago"
   - "Total risk exposure score of {total_risk_score}"

4. **Regulatory Requirements:**
   - If high relevance: "Required by {framework_list}"
   - "Auditor has flagged this for review"
   - "Critical for {framework} compliance certification"

5. **Evidence Quality:**
   - If low confidence: "Evidence confidence is {level} ({score})"
   - "Only {count} evidence items provided"
   - "Requires stronger evidence for compliance validation"

6. **Time Exposure:**
   - If > 90 days: "Gap has persisted for {time_exposed_days} days"
   - If > 365 days: "This is a chronic gap requiring immediate escalation"
   - "Gap trend is {trend}"

7. **Existing Work:**
   - If overdue tasks: "{count} related tasks are overdue"
   - If no tasks: "No active remediation tasks exist"
   - If active tasks: "Remediation is in progress with {count} open tasks"

### Length Constraints

- **Minimum:** 50 characters (1 sentence)
- **Maximum:** 500 characters (3 sentences)
- **Target:** 150-250 characters (2 sentences)

### Examples

**Example 1: Critical Priority**
```
"Priority critical (3.16): Gap of 2 levels from Reactive to Proactive in Identity Management. 
This criterion is high-criticality and associated with 2 high-severity risks. Required by ISO 27001 
and SOC 2. Gap has persisted for 120 days with weak evidence confidence (0.60)."
```

**Example 2: Medium Priority**
```
"Priority medium (0.85): Gap of 1 level from Basic to Reactive in Documentation Standards. 
Low business criticality with no linked risks. Evidence confidence is acceptable (0.75)."
```

**Example 3: High Priority with Incident**
```
"Priority high (2.10): Gap of 2 levels in Incident Response with recent major incident. 
This domain is critical-criticality and required by multiple frameworks (ISO 27001, NIST CSF). 
No remediation tasks currently active."
```

---

## 6. Recommendation Generation Rules

Recommendations provide **actionable next steps** for closing the gap. Each recommendation must be:

1. **Specific:** Reference actual context elements (domain, MPS, frameworks)
2. **Actionable:** Include verbs and concrete steps
3. **Contextual:** Address the most significant factors in the gap
4. **Realistic:** Achievable within typical ISMS program constraints

### Recommendation Categories

#### Category 1: Task/Project Creation
**When:** priority_score >= 0.50 and existing_pit_tasks.open_count === 0

Templates:
- "Create a PIT task to close the {gap} level gap in {criterion/mps/domain_name} within {timeframe}."
- "Initiate a dedicated PIT project to implement {specific_requirement} across {scope}."
- "Establish a task to address {specific_gap_aspect} with completion target of {date}."

Examples:
- "Create a dedicated PIT project to implement Multi-Factor Authentication across all user accounts, targeting completion within 60 days."
- "Initiate a PIT task to update the Incident Response SOP and conduct team training within 30 days."

#### Category 2: Policy/Procedure Updates
**When:** gap relates to documented processes or controls

Templates:
- "Update {specific_policy_name} to require {specific_control}."
- "Revise SOP-{code}-{number} to include {requirement}."
- "Establish formal procedures for {process_area}."

Examples:
- "Update and enforce access control policies to require MFA for all privileged accounts immediately."
- "Revise SOP-IR-01 incident escalation workflow and train all responders on new procedures."

#### Category 3: Evidence Collection
**When:** avg_evidence_confidence < 0.60 or evidence_count < 3

Templates:
- "Collect {evidence_type} demonstrating {requirement} for {framework} compliance."
- "Document current {implementation_status} with logs, configurations, or screenshots."
- "Gather behavioral evidence showing {control_effectiveness} over {time_period}."

Examples:
- "Collect behavioral evidence and system logs demonstrating MFA usage for validation against ISO 27001 and SOC 2 requirements."
- "Document current patch management process with evidence of monthly vulnerability scans and remediation tracking."

#### Category 4: Audit/Assessment Activities
**When:** regulatory_relevance === 'high' or audit_flags.length > 0

Templates:
- "Schedule {audit_type} within {timeframe} to verify {subject}."
- "Address auditor's request for {specific_requirement}."
- "Conduct gap assessment for {framework} requirement {clause/control}."

Examples:
- "Schedule an internal audit within 60 days to verify MFA implementation and evidence quality."
- "Address the auditor's request for evidence update by documenting current MFA coverage and planned improvements."

#### Category 5: Risk Mitigation
**When:** linked_risks.count > 0 and linked_risks.max_severity in ['high', 'critical']

Templates:
- "Implement controls to mitigate {count} linked {severity} risks identified in {domain}."
- "Review and update risk treatment plans for {specific_risk_ids}."
- "Conduct risk assessment to validate residual risk after {control_implementation}."

Examples:
- "Implement compensating controls to mitigate the 2 high-severity access control risks pending MFA deployment."
- "Update risk treatment plans for identity theft and unauthorized access risks linked to this gap."

#### Category 6: Training/Awareness
**When:** gap involves people, processes, or organizational change

Templates:
- "Train {role/team} on {subject} by {date}."
- "Conduct awareness sessions for {stakeholder_group} on {requirement}."
- "Develop training materials for {topic} aligned with {framework}."

Examples:
- "Train all IT administrators on MFA enrollment and troubleshooting procedures within 30 days."
- "Conduct security awareness sessions on phishing prevention for all employees quarterly."

#### Category 7: Escalation/Leadership Engagement
**When:** priority_score >= 2.5 or time_exposed_days > 365

Templates:
- "Escalate to {leadership_role} for priority resourcing and timeline approval."
- "Present gap status to {governance_body} with proposed remediation plan."
- "Request executive sponsorship for {project_name} given {criticality/risk_level}."

Examples:
- "Escalate to CISO for immediate budget approval and resource allocation to address this critical gap."
- "Present chronic access control gap (120+ days) to Information Security Steering Committee for strategic resolution."

### Recommendation Count Rules

| Priority Level | Minimum Recommendations | Maximum Recommendations | Typical Count |
|---------------|------------------------|------------------------|---------------|
| low           | 2                      | 3                      | 2             |
| medium        | 2                      | 4                      | 3             |
| high          | 3                      | 5                      | 4             |
| critical      | 4                      | 5                      | 5             |

### Recommendation Quality Checklist

Each recommendation must pass these validation checks:

✅ **Specific:** Contains actual names (domain, MPS, framework, policy ID)  
✅ **Actionable:** Starts with action verb (Create, Update, Collect, Schedule, Implement)  
✅ **Contextual:** Addresses factors mentioned in reasoning_summary  
✅ **Measurable:** Includes timeframe, target, or success criteria  
✅ **Realistic:** Achievable with typical ISMS program resources  

❌ **Avoid:**
- Generic advice: "Improve security", "Add more controls"
- Vague actions: "Review the situation", "Consider options"
- Invented specifics: "Update SOP-AC-01" when no SOP code was provided
- Unrelated suggestions: Recommendations not tied to gap_context factors

---

## 7. Validation & Quality Assurance

### Input Validation

Before sending to AI:

1. **gap_context must contain:**
   - All required fields (origin_type, origin_id, domain_name, current_level, target_level, gap, criticality)
   - Valid enum values
   - Numeric values within expected ranges

2. **priority_score must:**
   - Be a number >= 0.00
   - Match the calculation from Part 1 (within 0.01 tolerance for rounding)

### Output Validation

After receiving from AI:

1. **Priority label must:**
   - Match the deterministic mapping for the given priority_score
   - Be one of: 'low', 'medium', 'high', 'critical'

2. **Reasoning summary must:**
   - Be 50-500 characters in length
   - Mention at least 2 factors from gap_context
   - Not contain invented facts (cross-check against input)

3. **Recommendations must:**
   - Contain 2-5 items
   - Each be 20-200 characters in length
   - Start with action verbs
   - Reference at least one specific context element

### Error Handling

If AI output fails validation:

1. **Priority Mismatch:**
   - Log warning
   - Override with deterministic label
   - Retry AI call once with explicit label in prompt

2. **Hallucination Detection:**
   - Scan for invented policy names, controls, or evidence
   - If detected: reject recommendations, use template-based fallback
   - Log incident for review

3. **Quality Issues:**
   - If recommendations too generic: retry with enhanced prompt
   - If reasoning too short: expand with template phrases
   - Maximum 2 retry attempts before fallback

### Fallback Templates

If AI fails after retries, use deterministic templates:

**Reasoning Fallback:**
```
"Priority {label} ({score}): Gap of {gap} levels in {domain_name}. 
Criticality: {criticality}. {Regulatory_statement}. {Time_statement}."
```

**Recommendation Fallback (by priority):**

- **Critical:**
  1. "Create an urgent PIT task to close this critical gap within 14 days."
  2. "Escalate to leadership for immediate resource allocation."
  3. "Collect evidence demonstrating current controls and remediation progress."

- **High:**
  1. "Create a PIT task to address this gap within 30 days."
  2. "Update relevant policies and procedures."
  3. "Schedule audit review to verify closure."

- **Medium:**
  1. "Create a PIT task with 60-90 day timeline for gap closure."
  2. "Document current state and target controls."

- **Low:**
  1. "Monitor this gap and batch with other low-priority improvements."
  2. "Review in next quarterly planning cycle."

---

## 8. Integration with PIT Task Creation

The AI reasoning output is used to populate PIT task fields:

### Mapping AI Output to PIT Task Fields

```typescript
interface PITTaskFromAIReasoning {
  // From gap_context
  origin_type: gap_context.origin_type;
  origin_id: gap_context.origin_id;
  org_id: gap_context.org_id;
  cycle_id: gap_context.cycle_id;
  
  // From AI reasoning
  title: `Close ${priority_level} gap: ${domain_name} - ${criterion_name}`;
  description: reasoning_summary;
  priority: priority_label;  // 'low' | 'medium' | 'high' | 'critical'
  
  // Generated from recommendations
  subtasks: recommendations.map(rec => ({
    title: rec,
    status: 'pending',
    order: index
  }));
  
  // From priority score and rules
  due_date: calculateDueDate(priority_score, priority_level);
  suggested_owner_role: deriveOwnerRole(origin_type, criticality);
  
  // Audit trail
  created_by: 'gap_priority_engine_ai_v1.0';
  creation_timestamp: new Date().toISOString();
}
```

### Due Date Calculation

Based on priority level (from Part 1):

| Priority Level | Due Date Calculation |
|---------------|---------------------|
| low           | +90 days or next quarter end |
| medium        | +60 days |
| high          | +30 days |
| critical      | +14 days (maximum) |

### Owner Role Assignment

Based on origin_type and criticality:

| Origin Type | Criticality | Suggested Owner Role |
|-------------|-------------|---------------------|
| criterion   | low/medium  | domain_owner |
| criterion   | high        | security_manager |
| criterion   | critical    | ciso |
| mps         | any         | security_manager |
| domain      | any         | ciso |

---

## 9. AI Model Selection & Configuration

### Model Requirements

The AI reasoning layer requires a language model with:

- **Context window:** Minimum 8,192 tokens (to handle full gap_context)
- **Structured output:** JSON mode or schema enforcement
- **Reasoning capability:** Able to analyze multiple factors and generate coherent explanations
- **Factual grounding:** Low hallucination rate, strong instruction following

### Recommended Models (as of 2025)

**Tier 1 (Production):**
- GPT-4.1 (OpenAI) - Standard model for balanced performance
- GPT-4.1-mini (OpenAI) - Lightweight for low/medium priority gaps
- Claude 3.5 Sonnet (Anthropic) - Alternative for complex reasoning

**Tier 2 (Fallback):**
- GPT-4o (OpenAI) - Previous generation, still capable
- Claude 3 Opus (Anthropic) - High-quality reasoning

**Tier 3 (Development/Testing):**
- GPT-4.1-mini (OpenAI) - Cost-effective for testing
- Open-source models (Llama 3, Mistral) - On-premises deployment option

### Model Routing by Priority Score

To optimize cost and performance:

| Priority Score | Model Tier | Rationale |
|---------------|-----------|-----------|
| 0.00 - 1.00   | Lightweight (mini) | Simple gaps, straightforward reasoning |
| 1.01 - 2.50   | Standard (GPT-4.1) | Balanced complexity |
| 2.51+         | Advanced (GPT-4.1) | Critical gaps need highest quality reasoning |

### Model Configuration

```typescript
interface AIModelConfig {
  model_name: string;
  model_version: string;
  temperature: number;       // 0.3 for consistency
  max_tokens: number;        // 1500 for output
  json_mode: boolean;        // true
  timeout_seconds: number;   // 30
  retry_attempts: number;    // 2
}
```

**Standard Configuration:**
```json
{
  "model_name": "gpt-4.1",
  "model_version": "2025-01",
  "temperature": 0.3,
  "max_tokens": 1500,
  "json_mode": true,
  "timeout_seconds": 30,
  "retry_attempts": 2
}
```

---

## 10. Performance & Cost Optimization

### Performance Targets

| Metric | Target | Acceptable | Unacceptable |
|--------|--------|-----------|--------------|
| Latency (p50) | < 2s | < 5s | > 10s |
| Latency (p95) | < 5s | < 10s | > 15s |
| Success rate | > 98% | > 95% | < 95% |
| Hallucination rate | < 1% | < 3% | > 5% |

### Cost Optimization Strategies

1. **Batch Processing:**
   - Process multiple gaps in parallel (up to 10 concurrent API calls)
   - Use batch API endpoints when available

2. **Caching:**
   - Cache AI outputs for identical gap_context + priority_score pairs for 24 hours
   - Cache hit rate target: > 15% (due to repeat assessments)

3. **Prompt Optimization:**
   - Minimize token count in system prompt (current: ~800 tokens)
   - Use concise gap_context serialization
   - Target total prompt size: < 2000 tokens

4. **Model Tiering:**
   - Use lightweight models for low-priority gaps (cost reduction: ~70%)
   - Reserve advanced models for critical/high priority only

5. **Fallback to Templates:**
   - If AI cost exceeds budget threshold, switch to template-based reasoning
   - Maintain quality with smart template selection based on gap characteristics

### Cost Estimation

**Assumptions:**
- Organization with 500 criteria assessed quarterly
- 30% result in gaps requiring AI reasoning
- Average gap processed: 150 gaps per quarter

**Model Cost Breakdown (GPT-4.1 pricing as of 2025):**

| Priority Level | % of Gaps | Model Used | Cost per Call | Calls per Quarter | Quarterly Cost |
|---------------|-----------|------------|---------------|-------------------|----------------|
| low           | 40%       | GPT-4.1-mini | $0.005 | 60 | $0.30 |
| medium        | 35%       | GPT-4.1 | $0.015 | 52 | $0.78 |
| high          | 20%       | GPT-4.1 | $0.015 | 30 | $0.45 |
| critical      | 5%        | GPT-4.1-advanced | $0.050 | 8 | $0.40 |
| **Total**     | **100%**  | -          | -     | **150** | **$1.93** |

**Annual Estimated Cost:** $7.72 per organization (negligible)

---

## 11. Logging & Audit Trail

All AI reasoning interactions must be logged for transparency and continuous improvement.

### Log Schema

```sql
create table gap_priority_ai_log (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references organizations(id),
  cycle_id uuid not null references maturity_cycles(id),
  origin_type text not null,  -- 'criterion' | 'mps' | 'domain'
  origin_id uuid not null,
  
  -- Input
  priority_score numeric not null,
  gap_context jsonb not null,
  
  -- AI execution
  model_name text not null,
  model_version text not null,
  request_timestamp timestamptz not null default now(),
  response_timestamp timestamptz,
  latency_ms integer,
  
  -- Output
  priority_label text not null,
  reasoning_summary text,
  recommendations jsonb,
  
  -- Quality metrics
  validation_passed boolean not null,
  validation_errors jsonb,
  hallucination_detected boolean default false,
  retry_count integer default 0,
  fallback_used boolean default false,
  
  -- Cost tracking
  estimated_cost_usd numeric,
  token_count_input integer,
  token_count_output integer,
  
  created_at timestamptz default now()
);

-- Indexes for analytics
create index idx_gap_priority_ai_log_org_cycle 
  on gap_priority_ai_log(org_id, cycle_id);

create index idx_gap_priority_ai_log_priority 
  on gap_priority_ai_log(priority_label);

create index idx_gap_priority_ai_log_model 
  on gap_priority_ai_log(model_name, model_version);

create index idx_gap_priority_ai_log_quality 
  on gap_priority_ai_log(validation_passed, hallucination_detected);
```

### Analytics & Continuous Improvement

The log table enables:

1. **Model Performance Tracking:**
   - Average latency by model
   - Success rate by model version
   - Cost per gap by priority level

2. **Quality Monitoring:**
   - Hallucination detection rate
   - Validation failure patterns
   - Fallback usage frequency

3. **Optimization Opportunities:**
   - Identify common gap patterns for template expansion
   - Detect model version regressions
   - Guide model selection policy updates

---

## 12. Implementation Notes

### 12.1 API Endpoint

The AI reasoning layer is exposed via Supabase Edge Function:

**Endpoint:** `/functions/v1/gap-priority-ai-reasoning`

**Method:** POST

**Request Body:**
```typescript
{
  gap_context: GapContext;
  priority_score: number;
}
```

**Response Body:**
```typescript
{
  priority: 'low' | 'medium' | 'high' | 'critical';
  reasoning_summary: string;
  recommendations: string[];
  
  // Metadata
  model_used: string;
  latency_ms: number;
  confidence_score?: number;
}
```

### 12.2 Integration Points

The AI reasoning layer integrates with:

1. **Gap Priority Engine (Part 1):**
   - Receives priority_score and gap_context
   - Consumes numeric model outputs

2. **PIT Task Creation (Part 3):**
   - Provides reasoning_summary for task description
   - Provides recommendations as subtasks
   - Provides priority_label for task prioritization

3. **Maturity Dashboard:**
   - Displays reasoning_summary in gap cards
   - Shows recommendations in action panels
   - Highlights critical gaps based on AI insights

4. **Audit & Reporting:**
   - Logs all AI interactions
   - Provides explainability trail
   - Supports compliance documentation

### 12.3 Testing Requirements

See **Part 4: QA Tests & Validation Requirements** for full test specifications.

Key test categories:

1. **Unit Tests:**
   - Priority label mapping accuracy
   - Reasoning summary factual grounding
   - Recommendation specificity validation
   - Hallucination detection

2. **Integration Tests:**
   - End-to-end gap → AI reasoning → PIT task flow
   - Fallback behavior under AI failure
   - Model routing based on priority score

3. **Performance Tests:**
   - Latency under concurrent load
   - Cost tracking accuracy
   - Cache hit rate optimization

4. **Quality Assurance:**
   - Human review of 100 sample AI outputs
   - Comparison against expert-written reasoning
   - Regression testing on model version updates

---

## 13. Next Steps

**Part 3 of 4** will define **Recommended Handling & PIT Integration Rules**, including:
- Deduplication logic for existing PIT tasks
- Task vs. project decision criteria
- Owner assignment and escalation rules
- Feedback loops and re-scoring triggers
- Lifecycle management for gap-driven tasks

**Part 4 of 4** will define **QA Tests & Validation Requirements**, including:
- Comprehensive test suite specifications
- Edge case handling requirements
- Performance benchmarks
- Acceptance criteria for production deployment

---

## 14. References

- **Part 1: Numeric Priority Model** — `architecture/modules/pit/Architecture/GAP_PRIORITY_ENGINE_v1.0.md`
- **PIT Scoring Integration Workflow** — `architecture/modules/pit/PIT_SCORING_INTEGRATION_WORKFLOW_v1.0.md`
- **PIT Model Routing Specification** — `architecture/modules/pit/AI/PIT_MODEL_ROUTING_SPEC_v1.0.md`
- **PIT Integration Requirements** — `architecture/modules/pit/PIT_INTEGRATION_REQUIREMENTS_v1.0.md`
- **Maturity Scoring API Contract** — `architecture/api/MATURITY_SCORING_API_CONTRACT_v1.0.md`

---

**Status:** ✅ Architecture Approved  
**Owner:** Foreman  
**Target:** Builder Agents + PIT Implementation Team  
**Completion Date:** 2025-12-09

---

**End of Part 2 of 4**
