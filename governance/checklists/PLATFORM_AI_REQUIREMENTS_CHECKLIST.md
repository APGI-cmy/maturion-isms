# PLATFORM AI REQUIREMENTS CHECKLIST

## Status
**Type**: Builder Validation Checklist  
**Authority**: CS2 (Johan Ras)  
**Version**: 1.0.0  
**Effective Date**: 2026-02-19  
**Owner**: Governance Repository Administrator  
**Applies To**: All Builders, Foreman  
**Source**: LL-031 Platform AI Requirements Omission canonical lesson

---

## Purpose

This checklist validates that all platform-wide AI requirements are implemented before application handover. Builders MUST complete this checklist before submitting work for governance approval.

**Authority**: `governance/canon/PLATFORM_AI_REQUIREMENTS.md`

---

## Checklist Sections

### 1. AI Assistant (Embedded Chat Interface)

- [ ] **Chat UI Component Implemented**
  - [ ] Chat interface accessible in application UI
  - [ ] Sidebar, modal, or dedicated panel design
  - [ ] Mobile-responsive layout
  - [ ] Visual design consistent with application theme

- [ ] **Context Awareness**
  - [ ] Current page/view context passed to AI
  - [ ] User role and permissions included in context
  - [ ] Application state awareness (what user is doing)
  - [ ] Task-specific guidance based on context

- [ ] **User Experience**
  - [ ] Streaming responses (real-time token display)
  - [ ] Loading indicators during AI processing
  - [ ] Error handling with user-friendly messages
  - [ ] Retry logic for transient failures

- [ ] **Security and Compliance**
  - [ ] User authentication required for chat access
  - [ ] Session management (chat history tied to user session)
  - [ ] Audit logging of all AI interactions
  - [ ] Rate limiting and abuse prevention
  - [ ] PII/sensitive data handling per compliance standards

- [ ] **Message Features**
  - [ ] Markdown rendering (bold, italics, lists, code blocks)
  - [ ] File upload capability (if applicable)
  - [ ] Copy message to clipboard
  - [ ] Clear chat history option

**Evidence Required**:
- [ ] Screenshot of AI assistant in application
- [ ] Code reference: `[path/to/chat-component.tsx]`
- [ ] Test coverage: `[path/to/chat.test.ts]`

---

### 2. Context-Aware AI in Application UI

- [ ] **AI Explanations Implemented**
  - [ ] Scoring explanations (why this score?)
  - [ ] Recommendation rationale (why this suggestion?)
  - [ ] Risk assessment explanations (contributing factors)
  - [ ] Data quality explanations (what's wrong with data?)

- [ ] **Human Override Capability**
  - [ ] Users can override AI recommendations
  - [ ] AI context preserved when human overrides
  - [ ] Justification field for override (optional but recommended)
  - [ ] Override logged for audit trail

- [ ] **Transparency**
  - [ ] AI-generated content clearly labeled (badge, icon, text)
  - [ ] Confidence scores shown (when applicable)
  - [ ] Model version/type disclosed (for audit)
  - [ ] Uncertainty communicated (when AI is unsure)

- [ ] **Integration Points**
  - [ ] AI in scoring forms/UIs
  - [ ] AI in report generation interfaces
  - [ ] AI in decision workflows
  - [ ] AI in data entry/validation screens

- [ ] **Audit Trail**
  - [ ] AI suggestions logged with timestamp
  - [ ] Human decisions logged with timestamp
  - [ ] Divergence tracked (AI said X, human chose Y)
  - [ ] Audit log accessible for review

**Evidence Required**:
- [ ] Screenshot showing AI explanation in UI
- [ ] Screenshot showing human override with AI context
- [ ] Code reference: `[path/to/ai-explanation-component.tsx]`
- [ ] Audit trail sample: `[path/to/audit-log-sample.json]`

---

### 3. Agent File with AI Capabilities

- [ ] **Agent File Exists**
  - [ ] File located at repository root: `.agent`
  - [ ] File passes validation: `.github/scripts/agent-file-validator.sh`

- [ ] **AI Capabilities Section Present**
  - [ ] `ai_capabilities` section exists
  - [ ] Primary model specified
  - [ ] Task routing configured
  - [ ] Embedding model specified (if applicable)
  - [ ] Context limits defined
  - [ ] Cost optimization configured

- [ ] **Task Routing Complete**
  - [ ] All application task types identified
  - [ ] Each task type has model assignment
  - [ ] Token limits per task type defined
  - [ ] Temperature settings per task type defined

- [ ] **Example Configuration**:
  ```yaml
  ai_capabilities:
    primary_model: "claude-3-5-sonnet-20241022"
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
    embedding_model: "text-embedding-3-small"
    context_limits:
      max_context_window: 200000
      token_budget_per_interaction: 10000
    cost_optimization:
      enabled: true
      fallback_models:
        - "claude-3-haiku-20240307"
  ```

**Evidence Required**:
- [ ] Agent file link: `[repo]/.agent`
- [ ] Validation output: `[passed/failed]`

---

### 4. AI Task Routing Implementation

- [ ] **Task Classification Logic**
  - [ ] Code identifies task type (chat, explanation, report, etc.)
  - [ ] Task type maps to agent file `task_routing` configuration
  - [ ] Task-specific parameters applied (tokens, temperature)

- [ ] **Model Selection Logic**
  - [ ] Agent file `ai_capabilities` loaded at runtime
  - [ ] Model selected based on task type
  - [ ] Cost optimization applied (cheaper model when appropriate)
  - [ ] Graceful degradation (fallback to cheaper model on failure)

- [ ] **Performance Monitoring**
  - [ ] Latency tracked per model per task type
  - [ ] Error rates tracked per model
  - [ ] Cost tracked per model per task type
  - [ ] Metrics emitted for observability dashboard

- [ ] **Error Handling**
  - [ ] Retry logic with exponential backoff
  - [ ] Fallback to alternative model on persistent failure
  - [ ] User-friendly error messages
  - [ ] Errors logged for troubleshooting

**Evidence Required**:
- [ ] Code reference: `[path/to/task-routing.ts]`
- [ ] Example showing task classification and model selection
- [ ] Performance metrics screenshot or log

---

### 5. Red Tests (QA-First Validation)

- [ ] **AI Assistant Tests**
  - [ ] Test: Chat UI renders and is accessible
  - [ ] Test: User authentication required for chat
  - [ ] Test: AI responses are context-aware
  - [ ] Test: Audit logging captures AI interactions

- [ ] **Context-Aware AI Tests**
  - [ ] Test: AI explanations displayed in UI
  - [ ] Test: Human override preserves AI context
  - [ ] Test: AI-generated content is labeled
  - [ ] Test: Audit trail captures AI vs. human decisions

- [ ] **Agent File Tests**
  - [ ] Test: Agent file exists at repository root
  - [ ] Test: `ai_capabilities` section present and valid
  - [ ] Test: Task routing configured for all task types
  - [ ] Test: Agent file passes validator

- [ ] **AI Task Routing Tests**
  - [ ] Test: Task classification works correctly
  - [ ] Test: Model selection matches task type
  - [ ] Test: Fallback logic works on model failure
  - [ ] Test: Performance metrics emitted

**Evidence Required**:
- [ ] Red test suite link: `[path/to/tests]`
- [ ] Test output: `[all passing]`

---

### 6. Documentation and Compliance

- [ ] **APP_STARTUP_REQUIREMENTS.md Updated**
  - [ ] Platform AI Features Compliance section added
  - [ ] All checklist items marked as complete
  - [ ] Evidence links provided
  - [ ] CS2 exemption documented (if applicable)

- [ ] **Example Section**:
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
  - [x] Agent file exists and validated: .agent
  - [x] `ai_capabilities` section complete
  - [x] Task routing configured
  - [x] Cost optimization enabled

  ### AI Task Routing
  - [x] Task classification implemented
  - [x] Model selection logic functional
  - [x] Performance monitoring enabled
  - [x] Error handling and fallbacks configured

  ### Evidence
  - AI Assistant Screenshot: [link]
  - AI Explanation Screenshot: [link]
  - Agent File: .agent
  - Test Suite: [link]
  ```

**Evidence Required**:
- [ ] `APP_STARTUP_REQUIREMENTS.md` link with AI compliance section

---

## Exemption Request (If Applicable)

**Complete this section ONLY if requesting CS2 exemption from platform AI requirements.**

- [ ] **Justification Provided**
  - [ ] Security constraints documented
  - [ ] Regulatory compliance prohibits AI
  - [ ] Legacy system integration constraints
  - [ ] Specialized use case (no UI, no human user)

- [ ] **Risk Assessment Provided**
  - [ ] Security risks evaluated
  - [ ] Compliance risks evaluated
  - [ ] User experience impact evaluated

- [ ] **Alternative Approach Documented**
  - [ ] How app provides value without AI
  - [ ] Alternative user assistance mechanisms
  - [ ] Sunset plan (if temporary exemption)

- [ ] **CS2 Approval Obtained**
  - [ ] Request submitted to CS2
  - [ ] CS2 written approval received
  - [ ] Approval documented in `APP_STARTUP_REQUIREMENTS.md`
  - [ ] Review date scheduled

**Evidence Required**:
- [ ] Exemption request document: `[link]`
- [ ] CS2 approval email/document: `[link]`

---

## Validation Gate

**Merge Gate**: `platform-ai-features`  
**Script**: `.github/scripts/validate-platform-ai-features.sh`  
**Enforcement**: BLOCKING

**This checklist is validated by the merge gate. PR cannot merge without:**
1. All checklist items completed (or CS2 exemption)
2. Evidence links provided
3. Red tests passing
4. Agent file validated

---

## Handover Checklist

**Before submitting to Foreman/CS2 for approval:**

- [ ] All checklist sections completed
- [ ] All evidence collected and linked
- [ ] Red tests passing
- [ ] Agent file validated
- [ ] `APP_STARTUP_REQUIREMENTS.md` updated
- [ ] Merge gate validation passed
- [ ] (If exemption) CS2 approval obtained and documented

**Builder Signature**: [Name, Date]  
**Foreman Review**: [Name, Date]  
**CS2 Approval**: [Name, Date]

---

## Related Standards

- `governance/canon/PLATFORM_AI_REQUIREMENTS.md` — Full specification
- `governance/canon/MANDATORY_CROSS_APP_COMPONENTS.md` — Cross-app requirements
- `governance/canon/APP_STARTUP_REQUIREMENTS_DECLARATION.md` — Startup validation
- `.agent.schema.md` — Agent file schema
- `governance/canon/GATE_REQUIREMENTS_INDEX.json` — Merge gate definitions

---

**File**: `governance/checklists/PLATFORM_AI_REQUIREMENTS_CHECKLIST.md`  
**Version**: 1.0.0  
**Approved By**: CS2 (Johan Ras)  
**Effective**: 2026-02-19
