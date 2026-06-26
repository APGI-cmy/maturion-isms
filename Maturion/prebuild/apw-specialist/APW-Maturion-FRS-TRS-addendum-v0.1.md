# FRS/TRS Addendum — APW Public Maturion Behaviour v0.1

**Artifact ID**: APW-MATURION-FRS-TRS-ADD-001  
**Version**: 0.1.0  
**Status**: PREBUILD — FRS/TRS Addendum  
**Repository**: `APGI-cmy/maturion-isms`  
**Wave**: First Specialist Prebuild — APW Specialist v0.1  
**Authority**: CS2 — Johan Ras  
**Date**: 2026-06-26  
**Related Contract**: `Maturion/prebuild/apw-specialist/APW-Specialist-Scope-Contract-v0.1.md`

---

## 1. Purpose

This addendum defines how public APW Maturion may use the proposed APW Specialist safely in a later implementation wave.

It combines functional and technical requirements because this Batch 3 wave is a specialist prebuild and does not implement runtime behaviour.

---

## 2. Public APW Principle

```text
Public APW Maturion may explain public APW knowledge.
It may not expose private, tenant, internal, secret or authority-bound knowledge.
APW Specialist supports Maturion; it does not replace Maturion.
```

---

## 3. Functional Requirements

### APW-FRS-001 — Single Public Interface

Public APW users must interact with Maturion as the user-facing assistant. APW Specialist, if later activated, must operate behind Maturion.

### APW-FRS-002 — Public-Safe Answering

Public APW Maturion may answer only from public-safe sources, current-session user-provided content, or safe general explanations clearly separated from approved APW fact.

### APW-FRS-003 — Specialist Routing Only When Useful

Maturion should route to APW Specialist only when the user asks a public APW product, module, onboarding, navigation, explanation or capability question that falls inside the APW Specialist mandate.

### APW-FRS-004 — No Specialist Routing for Private Questions

Maturion must not route to APW Specialist when the request requires tenant, customer, authenticated, internal governance, secret, incident, evidence or private memory context.

### APW-FRS-005 — Maturion Final Synthesis

APW Specialist must return draft support only. Maturion must validate, constrain, synthesise and deliver the final answer.

### APW-FRS-006 — Safe Handoff

When public knowledge is insufficient, Maturion may hand off to contact/demo/login/human-review routes instead of inventing APW facts.

### APW-FRS-007 — No Authority Escalation by Specialist

APW Specialist must not approve, commit, quote pricing, bind APGI, act as CS2, change app state, or promise implementation behaviour.

---

## 4. Technical Requirements

### APW-TRS-001 — Context Envelope Preconditions

A future APW Specialist route requires a validated context envelope equivalent to the Batch 1 public APW context envelope:

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

The values above describe the public APW baseline. Other embodiments require separate approval. Secret, restricted, internal and tenant sources remain blocked by the Batch 2 metadata/filter rules rather than enabled through the public context envelope.

### APW-TRS-002 — Runtime Registry Preconditions

APW Specialist may not be invoked until a future runtime registry record exists and permits invocation.

Minimum future registry constraints must use the Batch 1 registry field names and Batch 2 knowledge-plane vocabulary:

```json
{
  "runtime_agent_id": "apw-specialist",
  "display_name": "APW Specialist",
  "agent_class": "app_specialist",
  "status": "ACTIVE",
  "orchestrator": "maturion",
  "allowed_apps": ["APW"],
  "allowed_embodiments": ["public-web"],
  "allowed_permission_scopes": ["public"],
  "allowed_knowledge_planes": ["subject", "app_context", "user_session"],
  "forbidden_knowledge_planes": ["framework_context", "tenant_context", "memory"],
  "forbidden_visibility": ["authenticated", "tenant", "restricted", "internal", "secret"],
  "input_contract_ref": "Maturion/prebuild/apw-specialist/APW-Specialist-Scope-Contract-v0.1.md",
  "output_contract_ref": "Maturion/prebuild/apw-specialist/APW-Specialist-Scope-Contract-v0.1.md#8-output-contract",
  "guardrail_refs": [
    "Maturion/prebuild/runtime-knowledge-grounding/MRKG-TRS-supabase-aimc-metadata-v0.1.md",
    "Maturion/prebuild/apw-specialist/APW-QA-to-Red-specialist-routing-v0.1.md"
  ],
  "authority_limits": [
    "no_cs2_authority",
    "no_final_response_authority",
    "no_tenant_context",
    "no_direct_retrieval",
    "no_supabase_mutation"
  ],
  "final_response_authority": false,
  "audit_required": true,
  "owner": "CS2 — Johan Ras",
  "last_reviewed": "date|null"
}
```

Batch 3 does not create this registry record. The example above is a future minimum constraint set only; later implementation must validate it against the current runtime registry schema before activation.

### APW-TRS-003 — Knowledge Filter Preconditions

Before any APW Specialist call, Maturion must filter candidate knowledge using Batch 2 public-safe rules:

- `visibility = public`;
- `public_safe = true`;
- `retrieval_allowed = true`;
- `requires_authentication = false`;
- `requires_tenant_match = false`;
- `tenant_id = null`;
- no secret/restricted/internal source;
- not expired or superseded.

### APW-TRS-004 — Routing Decision Record

Future implementation must record at least:

```json
{
  "request_id": "string",
  "route_decision": "apw_specialist|maturion_only|degraded|handoff",
  "specialist_id": "apw-specialist|null",
  "context_envelope_valid": "boolean",
  "public_filter_passed": "boolean",
  "blocked_reason": "string|null",
  "final_synthesizer": "maturion"
}
```

### APW-TRS-005 — Specialist Input Contract

Maturion may pass only:

- user question;
- public APW context;
- public-safe retrieved snippets;
- current public page/workflow label;
- safe handoff options.

Maturion must not pass raw tenant data, private memory, internal governance records or secrets.

### APW-TRS-006 — Specialist Output Validation

Maturion must validate that APW Specialist output:

- does not claim private knowledge;
- does not invent APGI facts;
- does not promise unavailable functionality;
- does not expose internal governance;
- includes source limitations when appropriate;
- returns safe handoff when knowledge is insufficient.

### APW-TRS-007 — Degraded Mode

If the context envelope, registry, public filter, specialist contract or output validation fails, Maturion must not invoke or trust APW Specialist. It may answer from allowed public sources or provide a limitation/handoff.

---

## 5. Explicit Non-Behaviour

Public APW Maturion must not:

- ask APW Specialist to retrieve data directly from Supabase;
- use APW Specialist as a public shortcut to internal knowledge;
- use APW Specialist to answer tenant/private/customer-specific questions;
- leak internal governance or agent-system details;
- use private memory in public mode;
- treat APW Specialist output as final authority;
- activate APW Specialist without a later registry and implementation wave.

---

## 6. Batch 3 Acceptance Conditions

This addendum is acceptable if it defines:

- public APW functional behaviour;
- public APW technical routing preconditions;
- context-envelope expectations;
- registry preconditions;
- knowledge filter preconditions;
- routing audit expectations;
- input/output validation;
- degraded mode;
- no implementation or activation in this wave.
