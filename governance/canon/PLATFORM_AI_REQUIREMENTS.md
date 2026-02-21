# PLATFORM-WIDE AI REQUIREMENTS — Canonical Specification

## Status
**Type**: Canonical Governance Standard  
**Authority**: CS2 (Johan Ras)  
**Version**: 1.0.0  
**Effective Date**: 2026-02-19  
**Layer-Down Status**: PUBLIC_API  
**Applies To**: All Maturion Applications (mandatory unless CS2-exempted)  
**Source**: LL-031 Platform AI Requirements Omission Lesson

---

## 1. Purpose

This document defines **mandatory AI features** that MUST be present in all Maturion applications unless explicitly exempted by CS2 with written justification.

**Foundational Principle**: The Maturion platform is an AI-native ecosystem. All applications are expected to provide embedded AI capabilities for user assistance, context-aware decision support, and intelligent automation.

---

## 2. Constitutional Authority

- **MANDATORY_CROSS_APP_COMPONENTS.md** — Cross-app component requirements
- **APP_STARTUP_REQUIREMENTS_DECLARATION.md** — App startup and validation requirements
- **LIVING_AGENT_SYSTEM.md** — Living Agent System framework
- **LL-031** — Platform AI Requirements Omission canonical lesson

---

## 3. Mandatory AI Features

All Maturion applications MUST implement the following four AI feature categories:

### 3.1 AI Assistant (Embedded Chat Interface)

**Requirement**: MANDATORY (all applications)

Required Components:
- Accessible chat interface (sidebar, modal, or dedicated panel)
- User authentication and session management
- Context awareness (current page/view, user role, application state)
- Streaming responses, loading indicators, error handling
- Audit logging of all AI interactions

### 3.2 Context-Aware AI in Application UI

**Requirement**: MANDATORY (all applications)

Required Components:
- AI explanations for scoring/calculations, recommendations, risk assessment
- Human override capability with AI context preserved
- Transparency: AI-generated content clearly labeled
- Audit trail: AI suggestion vs. human decision

### 3.3 Agent File with AI Capabilities

**Requirement**: MANDATORY (all applications)

```yaml
ai_capabilities:
  primary_model: "claude-3-5-sonnet-20241022"
  task_routing:
    - task_type: "chat_assistance"
      model: "claude-3-5-sonnet-20241022"
      max_tokens: 4096
      temperature: 0.7
  embedding_model: "text-embedding-3-small"
  context_limits:
    max_context_window: 200000
    token_budget_per_interaction: 10000
  cost_optimization:
    enabled: true
    fallback_models:
      - "claude-3-haiku-20240307"
```

### 3.4 AI Task Routing

**Requirement**: MANDATORY (all applications)

Required: Task classification, model selection, performance monitoring, error handling with fallbacks.

---

## 4. Exclusion Process

CS2 may grant exemption for security constraints, regulatory compliance, legacy system integration, or specialized use cases. Exemption requires:
1. Builder submits justification in `APP_STARTUP_REQUIREMENTS.md`
2. CS2 reviews and approves in writing
3. Approval documented with review date

---

## 5. Related Governance Standards

- `governance/checklists/PLATFORM_AI_REQUIREMENTS_CHECKLIST.md` — Builder validation checklist
- `governance/canon/MANDATORY_CROSS_APP_COMPONENTS.md`
- `governance/canon/APP_STARTUP_REQUIREMENTS_DECLARATION.md`
- `governance/canon/LIVING_AGENT_SYSTEM.md`

---

**Version**: 1.0.0  
**Approved By**: CS2 (Johan Ras)  
**Effective**: 2026-02-19  
**Authority**: CS2 (Johan Ras)
