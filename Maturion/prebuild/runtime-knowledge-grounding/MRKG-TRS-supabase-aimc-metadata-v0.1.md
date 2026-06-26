# TRS Addendum — Supabase/AIMC Metadata, Filters and Source Hierarchy v0.1

**Artifact ID**: MRKG-TRS-ADD-001  
**Version**: 0.1.0  
**Status**: PREBUILD — Technical Requirements Addendum  
**Repository**: `APGI-cmy/maturion-isms`  
**Wave**: Maturion Runtime Knowledge Grounding Prebuild v0.1  
**Authority**: CS2 — Johan Ras  
**Date**: 2026-06-26  
**Parent TRS**: `Maturion/prebuild/runtime-agent-network/MRAN-TRS-context-envelope-runtime-registry-v0.1.md`  
**Related FRS Addendum**: `Maturion/prebuild/runtime-knowledge-grounding/MRKG-FRS-addendum-v0.1.md`

---

## 1. Purpose

This addendum defines the technical prebuild requirements for safe Runtime Maturion knowledge grounding across Supabase/AIMC knowledge sources.

It specifies metadata requirements, source hierarchy, public/private/tenant filtering, missing metadata handling and audit expectations.

This is a prebuild document only. It does not create tables, migrations, functions, policies, embeddings, retrieval services or production behaviour.

---

## 2. Technical Principle

```text
Retrieval is allowed only when metadata, authority, permission scope and source class all agree.
```

If the system cannot prove that retrieval is permitted, it must block or degrade.

---

## 3. Knowledge Object Metadata Model

Every retrievable knowledge object must eventually carry metadata equivalent to the following fields:

```json
{
  "knowledge_id": "string",
  "title": "string",
  "source_class": "canon|strategy|prebuild|module_authority|approved_kb|public_content|tenant_document|tenant_record|user_session|memory|external_reference",
  "visibility": "public|authenticated|tenant|restricted|internal|secret",
  "authority_level": "constitutional|cs2_approved|module_owner_approved|tenant_owner_approved|user_supplied|unverified",
  "app_scope": ["APW", "ISMS", "MMM", "MAT", "PIT", "XDETECT", "AMC"],
  "tenant_id": "string|null",
  "organisation_id": "string|null",
  "framework_scope": ["ISO27001", "NIST_CSF", "COSO_ERM", "ISO42001"],
  "knowledge_planes": ["canon", "subject", "app_context", "framework_context", "tenant_context", "user_session", "memory"],
  "public_safe": "boolean",
  "retrieval_allowed": "boolean",
  "requires_authentication": "boolean",
  "requires_tenant_match": "boolean",
  "requires_role": ["string"],
  "effective_from": "date|null",
  "expires_at": "date|null",
  "supersedes": ["knowledge_id"],
  "source_uri": "string|null",
  "checksum": "string|null",
  "approved_by": "string|null",
  "last_reviewed": "date|null"
}
```

These fields describe required behaviour. Batch 2 does not implement storage.

---

## 4. Scope-Specific Source Hierarchy

Runtime retrieval must evaluate source hierarchy by permission scope unless a later canon overrides it.

### 4.1 Universal Authority Rule

Canon / constitutional authority remains the highest applicable source for governance boundaries, authority, agent separation, activation rules, safety rules and non-negotiable controls.

Higher-authority sources override lower-authority sources within their applicable scope. Public content must never override tenant-scoped records for tenant-specific answers.

### 4.2 Public Scope Hierarchy

For public or unauthenticated answers:

1. Canon / constitutional authority, where public-safe to disclose.
2. CS2-approved public strategy or public-safe prebuild artifacts.
3. Public module authority documents.
4. Approved public knowledge-base records.
5. Public app or public website content.
6. Current-session user-supplied content.
7. General model knowledge as fallback only.
8. External references only where explicitly allowed and cited/verified.

### 4.3 Authenticated App Scope Hierarchy

For authenticated app-context answers that are not tenant-private:

1. Canon / constitutional authority.
2. CS2-approved strategy or prebuild artifacts applicable to the app.
3. Module authority documents.
4. Approved authenticated knowledge-base records.
5. Authenticated app context and current workflow/page state.
6. Current-session user-supplied content.
7. Public app or public website content as supplementary context only.
8. General model knowledge as fallback only.
9. External references only where explicitly allowed and cited/verified.

### 4.4 Tenant Scope Hierarchy

For tenant- or organisation-scoped answers:

1. Canon / constitutional authority.
2. CS2-approved strategy or prebuild artifacts applicable to tenant handling and safety.
3. Tenant-owner approved tenant records and documents within the active scope.
4. Module authority documents applicable to the tenant workflow.
5. Approved tenant-scoped or organisation-scoped knowledge-base records.
6. Current-session user-supplied content within the same tenant/session scope.
7. Authenticated app context and current workflow/page state.
8. Public app or public website content as supplementary context only, never as controlling authority over tenant records.
9. General model knowledge as fallback only.
10. External references only where explicitly allowed and cited/verified.

### 4.5 Governance/Internal Scope Hierarchy

For governance/internal reasoning:

1. Canon / constitutional authority.
2. CS2-approved strategy or prebuild artifacts.
3. Module authority documents.
4. Governance records and approved knowledge-base records.
5. Current-session user-supplied content.
6. Public content as supplementary context only.
7. General model knowledge as fallback only.
8. External references only where explicitly allowed and cited/verified.

---

## 5. Retrieval Decision Inputs

A retrieval decision must consider:

- validated context envelope;
- runtime registry record;
- user authentication state;
- permission scope;
- tenant/organisation scope;
- requested task purpose;
- specialist authority limits;
- source metadata;
- scope-specific source hierarchy;
- expiry/supersession state;
- guardrails and safety overlays.

---

## 6. Filter Requirements

### 6.1 Public Filter

Public retrieval may include a knowledge object only if:

- `visibility = public`;
- `public_safe = true`;
- `retrieval_allowed = true`;
- `requires_authentication = false`;
- `requires_tenant_match = false`;
- `tenant_id = null`;
- `organisation_id = null`, unless deliberately marked as public organisational profile content;
- object is not expired or superseded.

### 6.2 Authenticated Filter

Authenticated retrieval may include a knowledge object only if:

- user is authenticated;
- `retrieval_allowed = true`;
- object visibility allows authenticated access;
- object app scope matches current app or is global;
- role requirements are satisfied;
- object is not expired or superseded.

Authenticated mode alone does not permit tenant-private retrieval.

### 6.3 Tenant Filter

Tenant retrieval may include a knowledge object only if:

- user is authenticated;
- `retrieval_allowed = true`;
- context envelope includes tenant/organisation scope;
- object `tenant_id` or `organisation_id` matches the active scope;
- `requires_tenant_match = true` is satisfied;
- user role/permission allows the object;
- object visibility is tenant/restricted and not secret unless specifically authorised;
- object is not expired or superseded.

### 6.4 Internal/Governance Filter

Internal/governance retrieval may include internal governance records only if:

- `retrieval_allowed = true`;
- the context envelope allows governance scope;
- the runtime authority model permits the use;
- object is not expired or superseded.

Governance retrieval does not grant action authority. It only provides information for governed reasoning.

### 6.5 Secret Filter

Objects marked `secret` must not be retrieved into Runtime Maturion unless a separate secret-handling architecture exists and has been approved.

Batch 2 does not approve secret retrieval.

---

## 7. Missing Metadata Behaviour

If any required metadata field is missing, ambiguous or contradictory:

- public retrieval must block the object;
- authenticated retrieval must block the object;
- tenant retrieval must block the object;
- governance/internal retrieval must block the object unless the missing field is proven irrelevant by a later approved contract;
- specialist retrieval must not receive the object;
- audit trace must record missing metadata;
- Maturion may answer only from other allowed sources or degrade.

Missing metadata must never default to public-safe, tenant-safe, authenticated-safe, governance-safe or retrieval-allowed.

---

## 8. Supersession and Staleness

A knowledge object must be treated as stale or blocked when:

- `expires_at` has passed;
- `supersedes` indicates another active object replaces it;
- checksum/source integrity fails;
- authority source is older than a conflicting higher-authority source;
- last review is outside the required review cycle for that source class.

The system may still mention a stale object only as historical context when explicitly appropriate.

---

## 9. Specialist Retrieval Contract

Before a specialist receives knowledge, the orchestrator must check:

1. specialist registry status permits invocation;
2. specialist allowed knowledge planes include the candidate source;
3. context envelope allows the knowledge plane;
4. source metadata has `retrieval_allowed = true`;
5. metadata filters allow the source;
6. task purpose matches specialist mandate;
7. audit trace can record the retrieval decision.

Specialists must not directly bypass the retrieval gate.

---

## 10. Audit Trace Requirements

A future retrieval audit trace should record:

```json
{
  "request_id": "string",
  "retrieval_decision": "allowed|blocked|degraded|fallback",
  "permission_scope": "public|authenticated|tenant_scoped|superuser|governance",
  "source_class": "string|null",
  "knowledge_planes_used": ["string"],
  "filter_applied": "public|authenticated|tenant|governance|secret_block",
  "blocked_reason": "string|null",
  "fallback_used": "none|public_only|user_supplied|general_model|escalation",
  "metadata_complete": "boolean",
  "retrieval_allowed": "boolean|null",
  "tenant_match": "boolean|null",
  "specialist_id": "string|null"
}
```

Audit traces must avoid storing secrets, raw confidential documents or unnecessary private tenant content.

---

## 11. Fallback Decision Matrix

| Condition | Allowed Behaviour |
|---|---|
| Public request, public-safe source available | Use public-safe source. |
| Public request, only private/tenant source available | Block private source; provide limitation or handoff. |
| Authenticated request, app context available and `retrieval_allowed = true` | Use authorised app context. |
| Authenticated request, source has `retrieval_allowed = false` | Block source; use allowed fallback only. |
| Authenticated request, tenant source requested but no tenant scope | Block tenant source; request proper context or escalate. |
| Tenant request, matching tenant source available and `retrieval_allowed = true` | Use source if role and metadata checks pass. |
| Tenant request, tenant mismatch | Block and record isolation event. |
| Missing metadata | Block source; use allowed fallback only. |
| Conflicting sources | Prefer highest authority within the active permission scope; escalate if unresolved. |
| Public content conflicts with tenant-approved record in tenant scope | Tenant-approved record controls if tenant filter passes; public content may be supplementary only. |
| Expired or superseded source | Block for current governed answer; mention as historical only if suitable. |

---

## 12. Batch 2 Technical Acceptance

Batch 2 is technically acceptable if it defines:

- minimum knowledge metadata;
- scope-specific source hierarchy;
- public, authenticated, tenant, governance and secret filters;
- retrieval-allowed kill switch across all non-secret retrieval paths;
- missing metadata behaviour;
- supersession/staleness behaviour;
- specialist retrieval contract;
- audit trace expectations;
- fallback matrix;
- no implementation before later builder waves.
