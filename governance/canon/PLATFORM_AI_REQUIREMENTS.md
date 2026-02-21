# PLATFORM-WIDE AI REQUIREMENTS — Canonical Specification

## Status
**Type**: Canonical Governance Standard  
**Authority**: CS2 (Johan Ras)  
**Version**: 1.0.0  
**Effective Date**: 2026-02-19  
**Owner**: Governance Repository Administrator  
**Layer-Down Status**: PUBLIC_API  
**Applies To**: All Maturion Applications (mandatory unless CS2-exempted)  
**Source**: LL-031 Platform AI Requirements Omission Lesson

---

## 1. Purpose

This document defines **mandatory AI features** that MUST be present in all Maturion applications unless explicitly exempted by CS2 with written justification.

**Foundational Principle**: The Maturion platform is an AI-native ecosystem. All applications are expected to provide embedded AI capabilities for user assistance, context-aware decision support, and intelligent automation.

**Exclusion Process**: If an application has a legitimate reason to omit AI features (e.g., security constraints, regulatory compliance, legacy system integration), CS2 must approve the exemption in writing with:
- Documented justification
- Risk assessment
- Alternative compliance approach
- Approval recorded in app's `APP_STARTUP_REQUIREMENTS.md`

---

## 2. Constitutional Authority

This specification derives authority from:

- **CONSTITUTION.md** — Governance supremacy and platform standards
- **MANDATORY_CROSS_APP_COMPONENTS.md** — Cross-app component requirements
- **APP_STARTUP_REQUIREMENTS_DECLARATION.md** — App startup and validation requirements
- **LIVING_AGENT_SYSTEM.md** — Living Agent System framework
- **LL-031** — Platform AI Requirements Omission canonical lesson

---

## 3. Scope

### 3.1 In Scope

- Embedded AI assistant (chat interface) requirements
- Context-aware AI in application UI (scoring, reports, explanations)
- Agent file AI capabilities specification
- AI task routing and model selection requirements
- Evidence and validation requirements for AI features
- Exclusion process and CS2 approval requirements

### 3.2 Out of Scope

- Application-specific AI features (business logic)
- AI model training and fine-tuning (platform infrastructure)
- AI safety and guardrails (covered in separate governance)
- Cost optimization strategies (covered in operational guides)

### 3.3 Applicability

**Applies to**:
- ✅ All new applications
- ✅ All applications under governed build
- ✅ All applications requiring Maturion platform integration

**Exemptions require**:
- CS2 written approval
- Documented justification in `APP_STARTUP_REQUIREMENTS.md`
- Alternative compliance approach (if applicable)
- Periodic review for exemption necessity

---

## 4. Mandatory AI Features

All Maturion applications MUST implement the following four AI feature categories:

### 4.1 AI Assistant (Embedded Chat Interface)

**Requirement**: MANDATORY (all applications)  
**Purpose**: Provide user assistance, context-aware help, and intelligent guidance

**Required Components**:

1. **User-Facing Chat UI**
   - Accessible chat interface (sidebar, modal, or dedicated panel)
   - User authentication and session management
   - Message history and context persistence
   - Markdown rendering for rich responses
   - File upload capability (for document-based assistance)

2. **Context Awareness**
   - Current page/view context passed to AI
   - User role and permissions awareness
   - Application state awareness (what user is doing)
   - Task-specific guidance based on context

3. **Security and Compliance**
   - User authentication required
   - Audit logging of all AI interactions
   - PII/sensitive data handling per compliance standards
   - Rate limiting and abuse prevention

4. **User Experience**
   - Streaming responses (real-time)
   - Loading indicators
   - Error handling and retry logic
   - Mobile-responsive design

**Evidence Required**:
- Screenshot of AI assistant UI in application
- Code reference to chat component implementation
- Test coverage for AI assistant functionality
- Audit log sample showing AI interaction tracking

---

### 4.2 Context-Aware AI in Application UI

**Requirement**: MANDATORY (all applications)  
**Purpose**: Provide AI-powered explanations, rationale, and decision support embedded in application workflows

**Required Components**:

1. **AI Explanations**
   - Scoring/calculation explanations (why this score?)
   - Recommendation rationale (why this suggestion?)
   - Risk assessment explanations (what factors contribute?)
   - Data quality explanations (what's wrong with this data?)

2. **Human Override with AI Context**
   - Users can override AI recommendations
   - AI context preserved when human overrides
   - Audit trail: AI suggestion vs. human decision
   - Justification required for override (optional but recommended)

3. **Transparency**
   - AI-generated content clearly labeled
   - Confidence scores shown (when applicable)
   - Model version/type disclosed (for audit)
   - Uncertainty communicated (when AI is unsure)

4. **Integration Points**
   - Scoring forms/UIs
   - Report generation interfaces
   - Decision workflows
   - Data entry/validation screens

**Evidence Required**:
- Screenshot showing AI explanation in UI
- Code reference to AI explanation components
- Example of human override with AI context preservation
- Audit trail showing AI vs. human decisions

---

### 4.3 Agent File with AI Capabilities

**Requirement**: MANDATORY (all applications)  
**Purpose**: Define AI model selection, task routing, and capabilities for the application

**Required Elements**:

See `.agent.schema.md` for full schema. At minimum, agent file MUST include:

```yaml
ai_capabilities:
  # Primary model for general tasks
  primary_model: "claude-3-5-sonnet-20241022"  # or equivalent
  
  # Task-specific model routing
  task_routing:
    - task_type: "chat_assistance"
      model: "claude-3-5-sonnet-20241022"
      max_tokens: 4096
      temperature: 0.7
    
    - task_type: "scoring_explanation"
      model: "claude-3-5-sonnet-20241022"
      max_tokens: 2048
      temperature: 0.3
    
    - task_type: "report_generation"
      model: "claude-3-5-sonnet-20241022"
      max_tokens: 8192
      temperature: 0.5
  
  # Embedding model for semantic search
  embedding_model: "text-embedding-3-small"  # or equivalent
  
  # Context and cost limits
  context_limits:
    max_context_window: 200000
    token_budget_per_interaction: 10000
  
  # Cost optimization
  cost_optimization:
    enabled: true
    fallback_models:
      - "claude-3-haiku-20240307"  # cheaper fallback
```

**Validation**:
- Agent file exists at repository root (`.agent`)
- `ai_capabilities` section present and valid
- All task types have model routing defined
- Models specified are available/supported

**Evidence Required**:
- Agent file link
- Validation output from `.github/scripts/agent-file-validator.sh`

---

### 4.4 AI Task Routing

**Requirement**: MANDATORY (all applications)  
**Purpose**: Deterministic, cost-optimized routing of AI tasks to appropriate models

**Required Implementation**:

1. **Task Classification**
   - Identify task type (chat, explanation, report, etc.)
   - Map task to model via agent file `task_routing`
   - Apply task-specific parameters (tokens, temperature)

2. **Model Selection Logic**
   - Read agent file `ai_capabilities` at runtime
   - Select model based on task type
   - Apply cost optimization (use cheaper model when appropriate)
   - Graceful degradation (fallback to cheaper/smaller model on failure)

3. **Performance Monitoring**
   - Track latency per model per task type
   - Track error rates per model
   - Track cost per model per task type
   - Emit metrics for observability

4. **Error Handling**
   - Retry logic with exponential backoff
   - Fallback to alternative model on persistent failure
   - User-friendly error messages
   - Logging for troubleshooting

**Evidence Required**:
- Code reference to task routing implementation
- Example showing task classification and model selection
- Performance metrics showing latency/error/cost tracking

---

## 5. Dual Interface Pattern (Back Office vs. Front Office)

**Requirement**: MANDATORY (for applications with distinct admin/user roles)  
**Purpose**: Separate administrative AI features from end-user AI features

### 5.1 Back Office (Admin/Operator Interface)

**Purpose**: Admin console for system operators and CS2

**Required Components**:
- Two-pane layout (chat left, telemetry/monitoring right)
- Rich chat bubbles (markdown, code blocks, metadata)
- Streaming status updates with icons
- Telemetry panel (real-time metrics, logs, system state)
- Document upload capability (for task briefings, evidence)
- Mobile-responsive design

**Integration**:
- FM or admin agent interaction
- Real-time execution monitoring
- Governance evidence display
- Build/wave status tracking

**Evidence**: `evidence-new/wave-execution/WAVE_5.1_SUMMARY.md` (Foreman Office example)

---

### 5.2 Front Office (End-User Interface)

**Purpose**: End-user interface for application functionality

**Required Components**:
- User-friendly chat interface
- Context-appropriate responses
- Task-specific workflows
- Secure user authentication
- Usage tracking and compliance

**Separation**:
- Clear separation from back office (different routes/permissions)
- No admin capabilities exposed to end users
- No governance operations accessible

---

## 6. Validation and Evidence Requirements

### 6.1 Startup Requirements Declaration

All applications MUST include in `APP_STARTUP_REQUIREMENTS.md`:

```markdown
## Platform AI Features Compliance

### AI Assistant
- [x] Embedded chat UI implemented
- [x] Context-aware assistance enabled
- [x] User authentication enforced
- [x] Audit logging configured

### Context-Aware AI in UI
- [x] AI explanations implemented (scoring, reports, etc.)
- [x] Human override with AI context preservation
- [x] Transparency labels on AI-generated content
- [x] Audit trail for AI vs. human decisions

### Agent File AI Capabilities
- [x] Agent file exists and validated
- [x] `ai_capabilities` section complete
- [x] Task routing configured
- [x] Cost optimization enabled

### AI Task Routing
- [x] Task classification implemented
- [x] Model selection logic functional
- [x] Performance monitoring enabled
- [x] Error handling and fallbacks configured

### Exemptions
- [ ] CS2 exemption granted: [LINK to approval]
- [ ] Justification: [REASON]
```

---

### 6.2 Red Tests (QA-First Validation)

**Requirement**: MANDATORY before feature implementation

All applications MUST implement red tests for platform AI features:

1. **AI Assistant Tests**
   - Test: Chat UI renders and is accessible
   - Test: User authentication required for chat
   - Test: AI responses are context-aware
   - Test: Audit logging captures AI interactions

2. **Context-Aware AI Tests**
   - Test: AI explanations displayed in UI
   - Test: Human override preserves AI context
   - Test: AI-generated content is labeled
   - Test: Audit trail captures AI vs. human decisions

3. **Agent File Tests**
   - Test: Agent file exists at repository root
   - Test: `ai_capabilities` section present and valid
   - Test: Task routing configured for all task types
   - Test: Agent file passes validator

4. **AI Task Routing Tests**
   - Test: Task classification works correctly
   - Test: Model selection matches task type
   - Test: Fallback logic works on model failure
   - Test: Performance metrics emitted

**Evidence**: Link to red test suite output

---

### 6.3 Merge Gate Validation

**Gate ID**: `platform-ai-features`  
**Enforcement**: BLOCKING (PR cannot merge without passing)

**Validation Script**: `.github/scripts/validate-platform-ai-features.sh`

**Checks**:
1. Agent file exists and contains `ai_capabilities` section
2. AI assistant component exists in codebase
3. Red tests for AI features exist and pass
4. `APP_STARTUP_REQUIREMENTS.md` includes AI compliance section
5. CS2 exemption documented (if applicable)

**Failure Response**:
- PR blocked with clear error message
- Link to this specification
- Checklist of missing requirements
- Escalation to builder for remediation

---

## 7. Exclusion Process

### 7.1 When Exemption May Be Granted

CS2 may grant exemption from platform AI requirements in the following cases:

1. **Security Constraints**
   - Application handles highly sensitive data where AI interaction is prohibited
   - Regulatory compliance prohibits AI usage
   - Air-gapped deployment where AI models unavailable

2. **Legacy System Integration**
   - Application is wrapper around legacy system with no UI extensibility
   - Temporary bridge application with planned sunset
   - Read-only integration with no user interaction

3. **Specialized Use Case**
   - Application is purely automated (no human user)
   - Application is infrastructure-only (no UI)
   - Application has alternative AI integration approach

### 7.2 Exemption Approval Process

1. **Builder submits request** in `APP_STARTUP_REQUIREMENTS.md`:
   ```markdown
   ## Platform AI Features Exemption Request
   
   **Justification**: [Why AI features are not applicable]
   **Risk Assessment**: [Security, compliance, user experience risks]
   **Alternative Approach**: [How app provides value without AI, if applicable]
   **Sunset Plan**: [If temporary exemption, when will AI be added?]
   ```

2. **CS2 reviews and decides**:
   - Approve with conditions
   - Request additional information
   - Deny and require compliance

3. **Approval documented** in `APP_STARTUP_REQUIREMENTS.md`:
   ```markdown
   ## Platform AI Features Exemption
   
   **Status**: APPROVED  
   **Approved By**: CS2 (Johan Ras)  
   **Date**: YYYY-MM-DD  
   **Justification**: [As submitted]  
   **Conditions**: [Any conditions for approval]  
   **Review Date**: [When to re-evaluate exemption]
   ```

4. **Exemption tracked** in governance:
   - File link in `governance/CONSUMER_REPO_REGISTRY.json`
   - Periodic review for exemption necessity
   - Exemption may be revoked if conditions change

---

## 8. Implementation Guidance

### 8.1 For Builders

**During Architecture Phase**:
1. Include platform AI requirements in FRS/TRS
2. Reference this specification explicitly
3. Plan for AI assistant UI component
4. Plan for AI explanations in application UI
5. Design agent file `ai_capabilities` section

**During Implementation Phase**:
1. Implement red tests for AI features FIRST
2. Implement AI assistant chat UI
3. Implement context-aware AI in application workflows
4. Create/update agent file with `ai_capabilities`
5. Implement AI task routing logic
6. Validate with `.github/scripts/validate-platform-ai-features.sh`

**During QA Phase**:
1. Validate all red tests pass
2. Capture evidence (screenshots, code links, test output)
3. Document in `APP_STARTUP_REQUIREMENTS.md`
4. Submit for merge gate validation

---

### 8.2 For Foreman

**During FRS Approval**:
1. Verify platform AI requirements included
2. Check for exemption request (if AI omitted)
3. Do not approve FRS without AI requirements or CS2 exemption

**During Builder Alignment**:
1. Explicitly hand off platform AI requirements checklist
2. Reference this specification
3. Clarify expectations for AI features

**During QA Validation**:
1. Verify red tests for AI features exist and pass
2. Verify AI assistant functional
3. Verify context-aware AI in UI functional
4. Verify agent file validated
5. Verify evidence complete

---

### 8.3 For Governance Administrator

**During Ripple Propagation**:
1. Notify all consumer repos of this new requirement
2. Create issues in consumer repos for compliance
3. Track compliance status in `CONSUMER_REPO_REGISTRY.json`

**During Merge Gate Enforcement**:
1. Run `.github/scripts/validate-platform-ai-features.sh`
2. Block PRs missing AI features (unless CS2 exemption documented)
3. Provide clear error messages with links to this specification

---

## 9. Related Governance Standards

- **MANDATORY_CROSS_APP_COMPONENTS.md** — Master checklist of cross-app requirements
- **APP_STARTUP_REQUIREMENTS_DECLARATION.md** — App startup validation requirements
- **LIVING_AGENT_SYSTEM.md** — Agent lifecycle and capabilities
- **GATE_REQUIREMENTS_INDEX.json** — Merge gate definitions
- **LL-031** — Platform AI Requirements Omission canonical lesson
- **.agent.schema.md** — Agent file schema and validation

---

## 10. Version History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0.0 | 2026-02-19 | Governance Administrator | Initial specification from LL-031 lesson |

---

## 11. Approval and Authority

**Approved By**: CS2 (Johan Ras)  
**Canonized**: 2026-02-19  
**Effective**: Immediately (all new apps, existing apps compliance roadmap)  
**Review Cycle**: Quarterly or when platform AI capabilities evolve  

---

**File**: `governance/canon/PLATFORM_AI_REQUIREMENTS.md`  
**Public API Hash**: (to be computed and added to CANON_INVENTORY.json)  
**Status**: CANONICAL — This is now authoritative governance for platform AI requirements
