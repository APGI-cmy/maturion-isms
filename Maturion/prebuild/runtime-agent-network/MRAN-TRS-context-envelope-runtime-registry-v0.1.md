# TRS — Context Envelope + Runtime Registry Architecture v0.1

**Artifact ID**: MRAN-TRS-001  
**Version**: 0.1.0  
**Status**: PREBUILD — Technical Requirements  
**Repository**: `APGI-cmy/maturion-isms`  
**Wave**: Maturion Runtime Agent Network Architecture Prebuild v0.1  
**Authority**: CS2 — Johan Ras  
**Date**: 2026-06-25  
**Related FRS**: `Maturion/prebuild/runtime-agent-network/MRAN-FRS-v0.1.md`

---

## 1. Purpose

This Technical Requirements Specification defines the initial architecture for two foundational runtime components:

1. the Maturion runtime context envelope;
2. the runtime specialist registry.

These are preconditions for safe runtime specialist routing and knowledge-grounded Maturion behaviour.

---

## 2. Architectural Principle

```text
No context envelope, no safe routing.
No runtime registry, no active specialist.
```

A runtime request must be interpreted through context and registry before Maturion may invoke specialist capability.

---

## 3. High-Level Runtime Flow

```text
User request
  -> App supplies context envelope
    -> Maturion validates context
      -> Maturion determines permission scope
        -> Maturion checks runtime registry
          -> Maturion selects allowed knowledge planes
            -> Maturion invokes specialist only if ACTIVE and permitted
              -> Maturion validates specialist output
                -> Maturion synthesises final answer
                  -> Audit trace recorded
```

Batch 1 defines this flow only. It does not implement it.

---

## 4. Context Envelope Architecture

### 4.1 Required Envelope Fields

Every runtime Maturion request must eventually carry a context envelope with these fields. Literal strings such as `string|null` and `boolean` indicate field type expectations, not fixed runtime values.

```json
{
  "request_id": "string",
  "app": "APW|ISMS|MMM|MAT|PIT|XDETECT|AMC|OTHER",
  "embodiment": "public-web|authenticated-app|admin-console|builder-console|service",
  "environment": "local|preview|staging|production",
  "page_or_workflow": "string|null",
  "module": "string|null",
  "user": {
    "authenticated": "boolean",
    "id": "string|null",
    "role": "string|null",
    "organisation_id": "string|null",
    "tenant_id": "string|null",
    "timezone": "string|null"
  },
  "permission_scope": "public|authenticated|tenant_scoped|superuser|governance",
  "knowledge_scope": {
    "subject_allowed": "boolean",
    "app_context_allowed": "boolean",
    "framework_context_allowed": "boolean",
    "tenant_context_allowed": "boolean",
    "memory_allowed": "boolean"
  },
  "trace": {
    "session_id": "string|null",
    "source": "browser|server|worker|admin|test",
    "correlation_id": "string|null"
  }
}
```

### 4.2 Public APW Context Envelope

A public APW request must have:

```json
{
  "app": "APW",
  "embodiment": "public-web",
  "permission_scope": "public",
  "user": {
    "authenticated": false,
    "id": null,
    "organisation_id": null,
    "tenant_id": null
  },
  "knowledge_scope": {
    "subject_allowed": true,
    "app_context_allowed": true,
    "framework_context_allowed": false,
    "tenant_context_allowed": false,
    "memory_allowed": false
  }
}
```

Public APW mode must not send tenant identifiers or privileged memory access.

### 4.3 Authenticated Tenant Context Envelope

An authenticated app request may include tenant and organisation context only where the user/session is authorised.

The system must reject or degrade if:

- `permission_scope = tenant_scoped` but `tenant_id` is absent;
- `tenant_context_allowed = true` but authentication is false;
- framework context is requested without an organisation or framework boundary;
- public app context includes tenant-private fields.

### 4.4 Governance / Build Context Envelope

Build/governance orchestration must use a separate `permission_scope = governance` or equivalent. It must not be confused with runtime end-user permissions.

This is important for future App Management Centre work where Maturion may assist with build orchestration under staged authority.

---

## 5. Runtime Registry Architecture

### 5.1 Registry Purpose

The runtime registry is the authoritative runtime source for whether a specialist exists, what class it belongs to, where it may be used, and whether Maturion may invoke it.

Strategy documents, canon, `.github/agents`, and markdown contracts do not by themselves activate runtime specialists.

### 5.2 Minimum Registry Record

A runtime specialist registry record must contain:

```json
{
  "runtime_agent_id": "string",
  "display_name": "string",
  "agent_class": "app_specialist|domain_specialist|knowledge_data_specialist|output_specialist|oversight_service",
  "status": "PROPOSED|STRATEGY_DEFINED|STUB_CONTRACTED|KNOWLEDGE_BASED|RUNTIME_REGISTERED|ACTIVE|DEGRADED|DEPRECATED|RETIRED",
  "orchestrator": "maturion",
  "allowed_apps": ["APW", "ISMS"],
  "allowed_embodiments": ["public-web", "authenticated-app"],
  "allowed_permission_scopes": ["public"],
  "allowed_knowledge_planes": ["subject", "app_context"],
  "input_contract_ref": "string|null",
  "output_contract_ref": "string|null",
  "guardrail_refs": ["string"],
  "authority_limits": ["string"],
  "audit_required": true,
  "owner": "string",
  "last_reviewed": "date|null"
}
```

### 5.3 Registry Storage

Batch 1 does not choose final storage. Future implementation may use:

- Supabase table;
- versioned JSON registry;
- hybrid canon + database model;
- service-backed registry.

The chosen storage must support auditability, versioning, lifecycle state and environment separation.

### 5.4 Registry Resolution Rules

Maturion must apply these checks before specialist invocation:

1. specialist exists in runtime registry;
2. status permits invocation;
3. current app is allowed;
4. current embodiment is allowed;
5. permission scope is allowed;
6. knowledge planes required by the specialist are allowed by the context envelope;
7. authority limits do not prohibit the requested task;
8. no guardrail blocks invocation.

### 5.5 Status Behaviour

| Status | Runtime Behaviour |
|---|---|
| PROPOSED | Do not invoke. Mention only as roadmap/design if appropriate. |
| STRATEGY_DEFINED | Do not invoke. May inform planning. |
| STUB_CONTRACTED | Do not use for production answers. |
| KNOWLEDGE_BASED | Do not invoke unless separately runtime-registered. |
| RUNTIME_REGISTERED | Registered but not production-active. Use only in test/sandbox if authorised. |
| ACTIVE | May invoke within allowed scope. |
| DEGRADED | May invoke only with limitation disclosure and safe fallback. |
| DEPRECATED | Do not invoke for new flows. |
| RETIRED | Do not invoke. |

---

## 6. Knowledge Plane Interface

Batch 1 only defines the interface need. Batch 2 must define metadata and retrieval details.

The runtime architecture must distinguish:

- constitutional/canon rules;
- Subject Knowledge Domain;
- App Context Domain;
- Framework / Context Domain;
- tenant/org/user context;
- memory;
- current session input.

No specialist may receive a knowledge plane that is disallowed by the context envelope.

---

## 7. Audit Trace Architecture

Every runtime orchestration should eventually produce a minimal audit trace:

```json
{
  "request_id": "string",
  "app": "string",
  "permission_scope": "string",
  "registry_decision": "no_specialist|specialist_invoked|blocked|degraded",
  "specialist_id": "string|null",
  "knowledge_planes_used": ["subject", "app_context"],
  "degradation_reason": "string|null",
  "escalation_required": false,
  "response_class": "informational|advisory|refusal|handoff|escalation"
}
```

The audit trace must not store secrets, raw confidential documents, or unnecessary tenant data.

---

## 8. Failure Behaviour

Maturion must block, degrade, or escalate when:

- required context envelope fields are missing;
- public mode attempts tenant/private retrieval;
- registry entry is missing;
- specialist status is not invokable;
- authority limits are exceeded;
- knowledge-plane metadata is insufficient;
- output validation fails.

---

## 9. Implementation Preconditions

Before implementation begins, later prebuild artifacts must answer:

1. where the runtime registry lives;
2. how registry records are versioned;
3. how registry updates are approved;
4. how Supabase/AIMC knowledge metadata maps to knowledge planes;
5. how public/private/tenant filters are enforced;
6. how audit traces are stored and protected;
7. how specialist invocation is tested;
8. how degraded mode is exposed to users.

---

## 10. Batch 1 Technical Acceptance

Batch 1 is technically acceptable if it defines:

- context-envelope minimum fields;
- public APW envelope baseline;
- authenticated tenant envelope baseline;
- runtime registry minimum record;
- registry resolution rules;
- lifecycle state behaviour;
- no implementation before Batch 2 and Batch 3 prebuild dependencies are satisfied.
