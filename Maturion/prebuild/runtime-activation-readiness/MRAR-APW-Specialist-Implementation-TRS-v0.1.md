# APW Specialist Implementation TRS v0.1

**Artifact ID**: MRAR-APW-TRS-001  
**Version**: 0.1.0  
**Status**: PREBUILD — Implementation Readiness TRS  
**Repository**: `APGI-cmy/maturion-isms`  
**Wave**: Batch 4 — Runtime Activation Readiness Pack v0.1  
**Authority**: CS2 — Johan Ras  
**Date**: 2026-06-26

---

## 1. Purpose

This Technical Requirements Specification defines the minimum implementation design for a later APW Specialist implementation wave.

It does not create code, schemas, migrations, registry rows, Supabase changes, retrieval services or runtime activation.

---

## 2. Technical Principle

```text
No valid context envelope, no routing.
No active registry permission, no specialist invocation.
No public-safe metadata, no public answer from that source.
No Maturion validation, no final response.
```

---

## 3. Required Implementation Components

A later implementation wave must define or build these components:

1. public APW context envelope provider;
2. route classifier;
3. runtime registry resolver;
4. public-safe knowledge filter;
5. APW Specialist invocation adapter;
6. APW Specialist output validator;
7. Maturion final synthesis layer;
8. audit trace writer;
9. degraded/handoff responder;
10. red-first test suite.

---

## 4. Context Envelope Requirements

A public APW request must satisfy the Batch 1 public APW envelope:

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

Implementation must reject or degrade if public APW mode contains tenant identifiers, private memory permission, governance scope, or secret/internal retrieval permissions.

---

## 5. Registry Resolver Requirements

A later implementation must not hard-code specialist availability. It must resolve APW Specialist through a runtime registry or registry abstraction.

Minimum required resolver checks:

1. `runtime_agent_id = apw-specialist` exists;
2. `status` permits invocation;
3. `orchestrator = maturion`;
4. `allowed_apps` contains `APW`;
5. `allowed_embodiments` contains `public-web`;
6. `allowed_permission_scopes` contains `public`;
7. required knowledge planes are allowed;
8. forbidden knowledge planes are absent;
9. authority limits do not block the task;
10. audit is enabled.

The first implementation wave may create a registry abstraction/stub for tests only. Production activation must remain blocked until a later activation wave approves the registry state.

---

## 6. Knowledge Filter Requirements

Before any APW Specialist invocation, Maturion must filter candidate sources using Batch 2 metadata requirements.

Minimum public-safe filter:

```text
visibility = public
public_safe = true
retrieval_allowed = true
requires_authentication = false
requires_tenant_match = false
tenant_id = null
not expired
not superseded
not secret/restricted/internal
```

If any required metadata is missing, the source fails closed.

---

## 7. Specialist Invocation Adapter

The invocation adapter must pass only:

- current user question;
- validated public APW context envelope;
- public-safe source snippets already filtered by Maturion;
- public page/workflow label where available;
- approved safe handoff options.

The adapter must not pass tenant records, private memory, internal governance records, secrets, raw Supabase handles, unrestricted search credentials or build/governance agent instructions.

---

## 8. Output Validation

Maturion must validate APW Specialist output before final response.

Validation must reject or degrade if the specialist output:

- claims private or tenant knowledge;
- exposes internal governance or secret material;
- invents APW product facts;
- promises delivery, pricing, legal, security or compliance commitments;
- claims CS2 or APGI binding authority;
- instructs direct access to internal systems;
- lacks limitation disclosure when source coverage is weak.

---

## 9. Audit Trace Requirements

A later implementation must produce an audit trace without storing secrets or raw confidential documents.

Minimum trace fields:

```json
{
  "request_id": "string",
  "app": "APW",
  "embodiment": "public-web",
  "permission_scope": "public",
  "route_decision": "maturion_only|apw_specialist|blocked|degraded|handoff",
  "specialist_id": "apw-specialist|null",
  "registry_decision": "allowed|blocked|missing|not_active",
  "knowledge_filter_decision": "passed|blocked|missing_metadata",
  "knowledge_planes_used": ["subject", "app_context", "user_session"],
  "final_synthesizer": "maturion",
  "degradation_reason": "string|null"
}
```

---

## 10. Storage Decisions Still Required

This readiness pack does not choose final storage for:

- runtime registry;
- audit traces;
- route decisions;
- test fixtures;
- public-safe source catalogues.

A later implementation PR must state each storage choice before build-to-green.

---

## 11. Technical Acceptance Conditions

A later implementation can proceed only when:

- context envelope validation is testable;
- registry resolution is testable;
- public-safe filtering is testable;
- APW Specialist invocation is adapter-based, not direct retrieval;
- output validation is testable;
- audit trace is produced;
- degraded mode is testable;
- activation remains separate.
