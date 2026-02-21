# PLATFORM AI REQUIREMENTS CHECKLIST

## Status
**Type**: Builder Validation Checklist  
**Authority**: CS2 (Johan Ras)  
**Version**: 1.0.0  
**Effective Date**: 2026-02-19  
**Applies To**: All Builders, Foreman  
**Source**: LL-031 Platform AI Requirements Omission canonical lesson

---

## Purpose

This checklist validates that all platform-wide AI requirements are implemented before application handover.

**Authority**: `governance/canon/PLATFORM_AI_REQUIREMENTS.md`

---

## Checklist Sections

### 1. AI Assistant (Embedded Chat Interface)

- [ ] Chat UI Component Implemented (accessible interface, mobile-responsive)
- [ ] Context Awareness (current page/view, user role, application state)
- [ ] User Experience (streaming responses, loading indicators, error handling)
- [ ] Security and Compliance (authentication, audit logging, rate limiting)

**Evidence Required**: Screenshot of AI assistant UI, code reference, test coverage

---

### 2. Context-Aware AI in Application UI

- [ ] AI Explanations Implemented (scoring, recommendations, risk, data quality)
- [ ] Human Override Capability (override with AI context preserved, justification)
- [ ] Transparency (AI-generated content labeled, confidence scores, model version)
- [ ] Audit Trail (AI suggestions logged, human decisions logged, divergence tracked)

**Evidence Required**: Screenshot showing AI explanation, human override screenshot

---

### 3. Agent File with AI Capabilities

- [ ] Agent File Exists (repository root, passes validator)
- [ ] AI Capabilities Section Present (primary model, task routing, embedding model, cost optimization)
- [ ] Task Routing Complete (all task types identified, each has model assignment)

**Evidence Required**: Agent file link, validation output

---

### 4. AI Task Routing Implementation

- [ ] Task Classification Logic (code identifies task type, maps to agent file)
- [ ] Model Selection Logic (agent file loaded at runtime, cost optimization)
- [ ] Performance Monitoring (latency, error rates, cost tracked per model)
- [ ] Error Handling (retry logic, fallback to alternative model)

**Evidence Required**: Code reference, example showing classification, metrics screenshot

---

### 5. Red Tests (QA-First Validation)

- [ ] AI Assistant Tests (chat UI renders, authentication required, context-aware, audit logging)
- [ ] Context-Aware AI Tests (explanations displayed, override preserves context, labels, audit trail)
- [ ] Agent File Tests (file exists, ai_capabilities valid, task routing complete, passes validator)
- [ ] AI Task Routing Tests (classification works, model selection correct, fallback works, metrics emitted)

**Evidence Required**: Red test suite link, test output

---

### 6. Documentation and Compliance

- [ ] APP_STARTUP_REQUIREMENTS.md Updated (Platform AI Features Compliance section with all items)

---

## Exemption Request (If Applicable)

- [ ] Justification Provided (security constraints, regulatory compliance, legacy system, specialized use case)
- [ ] Risk Assessment Provided
- [ ] CS2 Approval Obtained and Documented

---

## Validation Gate

**Merge Gate**: `platform-ai-features`  
**Enforcement**: BLOCKING

---

## Related Standards

- `governance/canon/PLATFORM_AI_REQUIREMENTS.md` — Full specification
- `governance/canon/MANDATORY_CROSS_APP_COMPONENTS.md`
- `governance/canon/APP_STARTUP_REQUIREMENTS_DECLARATION.md`

---

**File**: `governance/checklists/PLATFORM_AI_REQUIREMENTS_CHECKLIST.md`  
**Version**: 1.0.0  
**Approved By**: CS2 (Johan Ras)  
**Effective**: 2026-02-19
