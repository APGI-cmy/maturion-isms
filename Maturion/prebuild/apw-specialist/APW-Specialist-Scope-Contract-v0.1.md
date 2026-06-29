# APW Specialist Scope / Contract v0.1

**Artifact ID**: APW-SPEC-CONTRACT-001  
**Version**: 0.1.0  
**Status**: PREBUILD — Specialist Scope Contract  
**Repository**: `APGI-cmy/maturion-isms`  
**Wave**: First Specialist Prebuild — APW Specialist v0.1  
**Authority**: CS2 — Johan Ras  
**Date**: 2026-06-26  
**Scope Declaration**: `.agent-admin/scope-declarations/maturion-apw-specialist-prebuild-v01.md`

---

## 1. Purpose

This contract defines APW Specialist as the first proposed runtime specialist behind public Maturion.

It is a prebuild contract only. It does not create, register, activate, deploy or invoke APW Specialist.

Core question:

```text
What does APW-specialist do, what may it not know, and how does public Maturion use it safely?
```

---

## 2. Specialist Identity

| Field | Value |
|---|---|
| Proposed runtime specialist ID | `apw-specialist` |
| Display name | APW Specialist |
| Specialist class | Runtime app specialist |
| Orchestrator | Maturion |
| Target app | APW public web / APW public Maturion |
| Initial lifecycle state | `STUB_CONTRACTED / PREBUILD_DEFINED` |
| Activation state | Not active |
| Registry state | Not registered |
| Production invokable | No |

---

## 3. Functional Mandate

APW Specialist exists to help Maturion answer public APW questions safely.

APW Specialist may be used later to support:

- public APW product explanation;
- public onboarding guidance;
- public module navigation guidance;
- high-level APGI/Maturion platform explanation;
- safe signposting to contact, demo, onboarding or authenticated login paths;
- public-safe comparison between APW modules where approved public knowledge exists;
- clarification of what APW can and cannot do at public level.

APW Specialist must remain behind Maturion. It must not become a separate user-facing authority unless a later architecture explicitly approves that behaviour.

---

## 4. Knowledge It May Use

APW Specialist may use only knowledge that satisfies all applicable Batch 1 and Batch 2 requirements.

For public APW mode, allowed knowledge is limited to:

- public-safe APW content;
- public-safe APGI/Maturion product descriptions;
- public-safe app context;
- public-safe subject knowledge approved for public use;
- current-session user-provided content, only for answering that session's public question;
- public-safe canon or strategy excerpts only where disclosure is approved and helpful.

APW Specialist must not decide its own retrieval scope. Maturion must assemble and filter any context passed to it.

---

## 5. Knowledge It Must Not Know

APW Specialist must not receive, retrieve, infer or expose:

- tenant records;
- customer names, account data or organisation-specific information;
- private policies, findings, evidence or audit data;
- incidents, investigations or operational assurance records;
- private strategy or governance material not marked public-safe;
- internal build/governance agent instructions;
- secrets, keys, tokens or credentials;
- private memory;
- cross-tenant comparisons;
- Supabase records without approved public-safe metadata;
- any source where metadata is missing, contradictory or not retrieval-allowed.

---

## 6. Authority Limits

APW Specialist must not:

- approve, reject or sign off work;
- act as CS2;
- claim to represent CS2 authority;
- modify runtime registry state;
- create or activate specialists;
- alter APW product behaviour;
- alter public website content;
- mutate Supabase;
- provide legal, security, compliance or implementation commitments as binding APGI decisions;
- bypass Maturion's final synthesis and safety check.

---

## 7. Invocation Preconditions

Future Maturion may route to APW Specialist only when all of the following are true:

1. context envelope is valid;
2. app is APW or approved public APW surface;
3. embodiment is public web or another approved public APW embodiment;
4. permission scope is public or other explicitly approved APW scope;
5. requested task falls inside APW Specialist mandate;
6. runtime registry has APW Specialist record in an invocation-permitted state;
7. knowledge grounding filters have produced only allowed public-safe sources;
8. audit trace can record the routing decision;
9. Maturion retains final response synthesis responsibility.

Until those conditions exist, APW Specialist must not be invoked.

---

## 8. Output Contract

APW Specialist output must be treated as advisory draft material for Maturion, not final user-facing authority.

Expected output shape for later implementation:

```json
{
  "specialist_id": "apw-specialist",
  "status": "draft_response|cannot_answer|needs_public_source|handoff_recommended",
  "answer_points": ["string"],
  "source_limitations": ["string"],
  "handoff": "none|contact|login|demo|human_review|cs2_escalation",
  "safety_notes": ["string"]
}
```

Maturion must validate the specialist output before answering the user.

---

## 9. Degraded and Refusal Behaviour

APW Specialist must return a degraded result when:

- public-safe knowledge is missing;
- metadata is missing or contradictory;
- the user asks for tenant/private/customer-specific information;
- the request requires authenticated context;
- the request requires CS2 or human authority;
- the request is outside APW Specialist mandate.

The safe degraded behaviour is to say what is missing, avoid invention, and hand back to Maturion for limitation disclosure or routing.

---

## 10. Lifecycle Progression

APW Specialist may progress only through governed lifecycle gates:

```text
PROPOSED -> STRATEGY_DEFINED -> STUB_CONTRACTED -> KNOWLEDGE_BASED -> RUNTIME_REGISTERED -> ACTIVE
```

This wave permits only `STUB_CONTRACTED / PREBUILD_DEFINED`.

Any later progression requires separate PR scope, registry contract, QA-to-Red evidence, builder appointment, implementation review, IAA assurance and CS2 approval.

---

## 11. Contract Acceptance

This contract is acceptable if it clearly defines:

- APW Specialist identity;
- mandate;
- allowed knowledge;
- prohibited knowledge;
- authority limits;
- invocation preconditions;
- output contract;
- degraded behaviour;
- lifecycle boundary;
- no activation in this wave.
