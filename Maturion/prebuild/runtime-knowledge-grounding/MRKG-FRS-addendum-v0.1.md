# FRS Addendum — Maturion Runtime Knowledge Grounding v0.1

**Artifact ID**: MRKG-FRS-ADD-001  
**Version**: 0.1.0  
**Status**: PREBUILD — Functional Requirements Addendum  
**Repository**: `APGI-cmy/maturion-isms`  
**Wave**: Maturion Runtime Knowledge Grounding Prebuild v0.1  
**Authority**: CS2 — Johan Ras  
**Date**: 2026-06-26  
**Parent FRS**: `Maturion/prebuild/runtime-agent-network/MRAN-FRS-v0.1.md`  
**Scope Declaration**: `.agent-admin/scope-declarations/maturion-runtime-knowledge-grounding-prebuild-v01.md`

---

## 1. Purpose

This addendum defines how Runtime Maturion and governed runtime specialists may use knowledge safely.

It extends the Batch 1 runtime agent-network prebuild by defining knowledge-plane behaviour, retrieval authority, source hierarchy, safety filters and fallback rules.

Core question:

```text
What knowledge can Maturion use, from where, under what authority, and with what safety filters?
```

---

## 2. Functional Principle

```text
No metadata, no unrestricted retrieval.
No authority, no private knowledge.
No tenant scope, no tenant context.
No verified source class, no confident governed answer.
```

Maturion must prefer a safe limitation over an unsafe answer.

---

## 3. Knowledge Plane Definitions

Runtime Maturion must distinguish at least these knowledge planes:

| Plane | Description | Example Use |
|---|---|---|
| Canon / Constitution | Governance canon, non-negotiable rules, authority boundaries. | Agent separation, CS2 authority limits, activation prohibitions. |
| Subject Knowledge Domain | General APGI-approved subject matter. | Risk, security, assurance, maturity model concepts. |
| App Context Domain | Public or app-specific product knowledge. | APW public pages, ISMS module descriptions, onboarding explanations. |
| Framework / Context Domain | Client framework mappings or contextual implementation guidance. | ISO/NIST/COSO mappings, maturity framework variants. |
| Tenant / Organisation Context | Customer-specific data, settings, documents, findings or evidence. | Tenant audit findings, evidence, policies, account state. |
| User / Session Context | Current authenticated user role, session, page/workflow and explicit request. | Current page help, form guidance, workflow step support. |
| Memory | Approved retained context from prior interactions. | Remembered preferences or project state, where allowed. |

---

## 4. Retrieval Authority Requirements

### FRS-MRKG-001 — Permission-Scope Driven Retrieval

Maturion must select retrieval scope from the validated context envelope.

Public requests may use only public-safe knowledge planes. Authenticated requests may use authenticated app context. Tenant-scoped requests may use tenant knowledge only when tenant identity, user identity and permission are validated.

### FRS-MRKG-002 — Metadata-First Retrieval

Every retrievable knowledge object must carry metadata sufficient to decide whether Maturion may use it.

If metadata is missing, ambiguous, stale or contradictory, the object must not be treated as public-safe, tenant-safe or authority-safe.

### FRS-MRKG-003 — Source Hierarchy

Maturion must apply a source hierarchy before answering governed questions.

Default hierarchy:

1. Canon / constitutional authority;
2. CS2-approved strategy or prebuild artifacts;
3. module authority documents;
4. approved knowledge-base records;
5. public website / public app content;
6. user-provided current-session content;
7. general model knowledge as fallback only, with limitation disclosure where appropriate.

### FRS-MRKG-004 — Public-Safe Retrieval

Public or unauthenticated Maturion may retrieve only knowledge marked public-safe or otherwise approved for public use.

Public mode must not expose:

- tenant records;
- customer names or account data;
- private strategy not marked public;
- internal governance details that are not public-facing;
- evidence, incidents, audit findings or operational data;
- private memory.

### FRS-MRKG-005 — Tenant Isolation

Tenant-scoped retrieval must be restricted to the active tenant/organisation scope.

Maturion must not blend tenant knowledge, compare tenants, leak cross-tenant context, or answer from one tenant's data for another tenant.

### FRS-MRKG-006 — Specialist Knowledge Limits

Specialists may receive only the knowledge planes allowed by:

- the context envelope;
- the runtime registry record;
- the specialist contract or prebuild scope;
- the current task purpose;
- relevant guardrails.

Specialists must not self-expand retrieval scope.

### FRS-MRKG-007 — Missing Knowledge Behaviour

When required knowledge is missing, Maturion must:

- say that the governed source is unavailable;
- avoid inventing APGI facts;
- answer from public/general knowledge only if safe;
- request source material or escalate where necessary;
- preserve user trust by clearly marking limitations.

### FRS-MRKG-008 — Conflict Resolution

If sources conflict, Maturion must prefer the highest-authority applicable source. If conflict remains unresolved, Maturion must disclose uncertainty and escalate rather than silently choosing a lower-authority source.

### FRS-MRKG-009 — Retrieval Auditability

Future implementation must record enough retrieval evidence to explain why a source was used or blocked, without storing secrets or unnecessary private data in the trace.

### FRS-MRKG-010 — No Authority by Retrieval

Retrieving a canon, policy, strategy or customer document must not grant Maturion authority to approve, waive, sign off or act as CS2. Authority remains separately governed.

---

## 5. Public Mode Behaviour

In public APW/public-web mode, Maturion may:

- explain APGI/Maturion concepts using approved public-safe material;
- answer generic subject questions from public-safe knowledge;
- guide a user toward contact/onboarding paths;
- explain limitations where private knowledge would be required.

In public APW/public-web mode, Maturion must not:

- retrieve tenant records;
- identify customer-specific implementations;
- expose internal project/gate/PR details unless deliberately public-safe;
- use private memory;
- provide private operational advice based on non-public sources.

---

## 6. Authenticated App Behaviour

In authenticated app mode, Maturion may use app context and authenticated user/session context.

Tenant or organisation knowledge may be used only when:

1. the user is authenticated;
2. tenant/organisation scope is present;
3. permission allows access;
4. source metadata matches the tenant/organisation scope;
5. audit trace can record the retrieval decision.

---

## 7. Fallback Behaviour

Fallback must be conservative.

Allowed fallback examples:

- answer from public knowledge when public/private classification is clear;
- answer from current user-provided content when the user explicitly supplied the content in the current session;
- ask the user to upload or identify the relevant document;
- route to human review or CS2 when authority is unclear;
- provide general explanation with clear limitation statement.

Disallowed fallback examples:

- treating missing metadata as public;
- assuming tenant access because a user is logged in;
- using old strategy as current canon without checking authority;
- inferring customer facts from similar tenants;
- using global memory for tenant-specific answers.

---

## 8. Acceptance Conditions

This addendum is acceptable for Batch 2 if it defines:

- knowledge planes;
- retrieval authority requirements;
- public-safe behaviour;
- tenant isolation behaviour;
- source hierarchy;
- missing knowledge fallback;
- conflict handling;
- retrieval auditability;
- no implementation in Batch 2.

---

## 9. Deferred Implementation

Implementation remains blocked until later waves define and approve:

- metadata storage model;
- retrieval enforcement service;
- registry integration;
- source ingestion process;
- audit trace storage;
- public/private/tenant test fixtures;
- builder appointment and build-to-green package.
