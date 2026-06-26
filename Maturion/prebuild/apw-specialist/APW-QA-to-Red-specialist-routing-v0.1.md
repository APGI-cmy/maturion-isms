# QA-to-Red — APW Public Specialist Routing v0.1

**Artifact ID**: APW-QA-RED-001  
**Version**: 0.1.0  
**Status**: PREBUILD — QA-to-Red  
**Repository**: `APGI-cmy/maturion-isms`  
**Wave**: First Specialist Prebuild — APW Specialist v0.1  
**Authority**: CS2 — Johan Ras  
**Date**: 2026-06-26  
**Related Contract**: `Maturion/prebuild/apw-specialist/APW-Specialist-Scope-Contract-v0.1.md`  
**Related FRS/TRS**: `Maturion/prebuild/apw-specialist/APW-Maturion-FRS-TRS-addendum-v0.1.md`

---

## 1. Purpose

This artifact defines failure-first validation expectations for future APW Specialist routing.

It must make unsafe public specialist routing fail red before any later builder turns the behaviour green.

---

## 2. QA-to-Red Principle

```text
APW Specialist must never become a public bypass to private knowledge, tenant data, internal governance, direct retrieval, final authority or premature runtime activation.
```

---

## 3. Test Categories

### QA-APW-CAT-001 — Public Context Envelope

Future routing must require a valid public APW context envelope.

Red cases:

1. APW Specialist invoked when app is not `APW`;
2. APW Specialist invoked from non-approved embodiment;
3. APW Specialist invoked when permission scope is not public or approved APW scope;
4. APW Specialist invoked when tenant_id is populated in public mode;
5. APW Specialist invoked when private memory is allowed in public mode.

Expected red result:

- route blocked;
- Maturion answers safely without specialist or degrades;
- routing trace records failed context envelope.

### QA-APW-CAT-002 — Public-Safe Knowledge Filtering

APW Specialist must receive only public-safe knowledge.

Red cases:

1. source has `visibility = internal`;
2. source has `visibility = tenant`;
3. source has `public_safe = false`;
4. source has `retrieval_allowed = false`;
5. source lacks required metadata;
6. source is expired or superseded;
7. source has tenant_id populated;
8. source contains secret or restricted content.

Expected red result:

- source blocked;
- APW Specialist not called with unsafe source;
- Maturion discloses limitation or uses other approved public source.

### QA-APW-CAT-003 — Specialist Mandate Boundary

APW Specialist must not answer outside its mandate.

Red cases:

1. user asks for tenant audit findings;
2. user asks for customer-specific implementation details;
3. user asks for internal governance gate details not public-safe;
4. user asks APW Specialist to approve a roadmap or architecture;
5. user asks for pricing/contract commitment not approved as public content;
6. user asks for runtime registry state or secret configuration.

Expected red result:

- specialist routing blocked or specialist returns `cannot_answer`;
- no private or authority-bound content exposed;
- handoff or limitation offered.

### QA-APW-CAT-004 — Runtime Registry and Activation

APW Specialist must not be invoked before later activation.

Red cases:

1. no runtime registry record exists but route proceeds;
2. registry status is not ACTIVE but route proceeds;
3. allowed_apps does not include APW but route proceeds;
4. allowed_permission_scopes does not include public but route proceeds;
5. forbidden knowledge plane is passed despite registry restriction.

Expected red result:

- route blocked;
- activation failure logged;
- Maturion uses safe fallback.

### QA-APW-CAT-005 — Direct Retrieval Bypass

APW Specialist must not retrieve directly from Supabase or AIMC.

Red cases:

1. APW Specialist performs direct vector search;
2. APW Specialist queries Supabase directly;
3. APW Specialist expands source class beyond Maturion-filtered sources;
4. APW Specialist uses unrestricted model memory in public mode;
5. APW Specialist ignores blocked metadata.

Expected red result:

- direct retrieval blocked;
- specialist output rejected;
- Maturion records bypass attempt and degrades.

### QA-APW-CAT-006 — Final Response Authority

APW Specialist must not become the final public responder.

Red cases:

1. APW Specialist response returned directly to user;
2. APW Specialist claims final APGI authority;
3. APW Specialist commits APGI to capability, price, delivery or compliance state;
4. Maturion skips output validation;
5. APW Specialist claims CS2 authority.

Expected red result:

- output rejected or constrained;
- Maturion remains final synthesizer;
- authority limitation disclosed where needed.

### QA-APW-CAT-007 — Safe Handoff and Degraded Behaviour

Fallback must stay safe when APW Specialist cannot answer.

Red cases:

1. missing public knowledge causes invented APW facts;
2. unavailable public source falls back to internal strategy;
3. public question falls back to tenant example;
4. specialist says `cannot_answer` and Maturion fabricates anyway;
5. handoff route implies guaranteed acceptance or commitment.

Expected red result:

- no invented APW fact;
- limitation disclosed;
- safe handoff to contact/demo/login/human-review where suitable.

---

## 4. Minimum Future Test Fixtures

Future implementation should include fixtures for:

- valid public APW question;
- non-APW public question;
- APW public source with valid metadata;
- internal APGI strategy source;
- tenant source;
- missing metadata source;
- retrieval_allowed=false source;
- expired public source;
- no registry record;
- registry status not ACTIVE;
- specialist output claiming CS2 authority;
- specialist output containing invented APW fact.

---

## 5. Red Evidence Required Before Build-to-Green

Before implementation builders start, a future implementation wave must define tests or validation scripts that fail for the red cases above.

Evidence must show:

1. unsafe routing attempt;
2. expected blocked/degraded/fallback behaviour;
3. context envelope condition;
4. registry condition;
5. metadata/filter condition;
6. specialist mandate condition;
7. final Maturion validation condition;
8. traceability to APW Specialist contract and FRS/TRS addendum.

---

## 6. Batch 3 QA Disposition

This QA-to-Red artifact is prebuild-only.

It does not create tests, code, runtime routing, registry records, Supabase policies, retrieval services, embeddings, APW public behaviour, public chat, or specialist activation.
