# QA-to-Red — Maturion Runtime Knowledge Grounding v0.1

**Artifact ID**: MRKG-QA-RED-001  
**Version**: 0.1.0  
**Status**: PREBUILD — QA-to-Red  
**Repository**: `APGI-cmy/maturion-isms`  
**Wave**: Maturion Runtime Knowledge Grounding Prebuild v0.1  
**Authority**: CS2 — Johan Ras  
**Date**: 2026-06-26  
**Related FRS Addendum**: `Maturion/prebuild/runtime-knowledge-grounding/MRKG-FRS-addendum-v0.1.md`  
**Related TRS Addendum**: `Maturion/prebuild/runtime-knowledge-grounding/MRKG-TRS-supabase-aimc-metadata-v0.1.md`

---

## 1. Purpose

This QA-to-Red artifact defines failure-first validation expectations for Runtime Maturion knowledge grounding.

The goal is to make future implementation prove that retrieval blocks unsafe knowledge use before any builder makes the behaviour green.

---

## 2. QA-to-Red Principle

```text
Knowledge retrieval must fail closed when metadata, authority, permission, source hierarchy or tenant scope is missing or unsafe.
```

---

## 3. Test Categories

### QA-MRKG-CAT-001 — Public-Safe Retrieval

Public Maturion must retrieve only public-safe sources.

Red cases:

1. public APW request retrieves object with `visibility = internal`;
2. public APW request retrieves object with `public_safe = false`;
3. public APW request retrieves object with `requires_authentication = true`;
4. public APW request retrieves object with `tenant_id` populated;
5. public APW request retrieves private strategy not marked public-safe;
6. public APW request retrieves internal governance commentary as public advice.

Expected red result:

- source blocked;
- no tenant/private/internal leakage;
- Maturion answers from allowed public sources only or gives limitation/handoff.

### QA-MRKG-CAT-002 — Tenant Isolation

Tenant-scoped retrieval must never cross tenant boundaries.

Red cases:

1. tenant A user retrieves tenant B record;
2. tenant-scoped request lacks `tenant_id`;
3. tenant source has `requires_tenant_match = true` but context has no tenant;
4. tenant source has organisation mismatch;
5. user role lacks access to tenant source;
6. specialist receives tenant source outside its allowed knowledge planes.

Expected red result:

- retrieval blocked;
- cross-tenant data not exposed;
- audit trace records mismatch/block reason;
- safe fallback or escalation used.

### QA-MRKG-CAT-003 — Missing Metadata

Missing metadata must not default to safe.

Red cases:

1. source has no `visibility`;
2. source has no `public_safe` field;
3. source has no `tenant_id` but claims tenant visibility;
4. source has `retrieval_allowed` missing;
5. source has contradictory visibility and public-safe flags;
6. source has no source class or authority level.

Expected red result:

- object blocked;
- no specialist receives the object;
- Maturion discloses limitation or uses other approved sources.

### QA-MRKG-CAT-004 — Source Hierarchy and Conflict

Higher authority must override lower authority.

Red cases:

1. public content conflicts with canon and public content wins;
2. old strategy conflicts with newer prebuild and old strategy wins;
3. module document conflicts with canon and module document wins;
4. general model knowledge conflicts with approved APGI knowledge and model knowledge wins;
5. external source overrides APGI canon without explicit approval.

Expected red result:

- lower-authority source is not used as controlling authority;
- Maturion discloses conflict if unresolved;
- escalation triggered where appropriate.

### QA-MRKG-CAT-005 — Supersession and Staleness

Expired or superseded knowledge must not drive current governed answers.

Red cases:

1. expired source is used as current authority;
2. superseded source is used over superseding source;
3. stale source used despite newer higher-authority conflict;
4. source checksum/integrity failure is ignored;
5. unreviewed restricted source is treated as current.

Expected red result:

- source blocked for current answer;
- historical mention allowed only when explicitly framed as historical;
- audit trace records stale/superseded reason.

### QA-MRKG-CAT-006 — Specialist Knowledge Limits

Specialists must not receive disallowed knowledge planes.

Red cases:

1. APW specialist receives tenant context in public mode;
2. report writer receives private tenant evidence without tenant permission;
3. domain specialist requests memory when memory is disallowed;
4. retrieval/ranking specialist bypasses context envelope;
5. specialist self-expands source class beyond registry limits.

Expected red result:

- knowledge not passed to specialist;
- Maturion blocks or degrades;
- specialist output is not trusted if it relied on disallowed source.

### QA-MRKG-CAT-007 — Fallback Behaviour

Fallback must not become hidden unsafe retrieval.

Red cases:

1. missing metadata triggers unrestricted vector search;
2. unavailable tenant source falls back to another tenant;
3. missing APGI source causes confident invented APGI facts;
4. general model knowledge is presented as approved APGI policy;
5. fallback memory is used in public mode.

Expected red result:

- fallback limited to allowed sources;
- limitation disclosed;
- no invented governed APGI fact;
- escalation or user-source request where required.

### QA-MRKG-CAT-008 — Secret and Restricted Knowledge

Secret or restricted sources must not be retrieved unless a later secret-handling architecture approves it.

Red cases:

1. object marked `secret` is retrieved by Runtime Maturion;
2. restricted source retrieved in public mode;
3. secret source passed to specialist;
4. source contains credentials or tokens and is used in prompt context;
5. audit trace stores raw secret content.

Expected red result:

- source blocked;
- no secret content in prompt or trace;
- incident/escalation path defined in later implementation wave.

---

## 4. Minimum Future Test Fixtures

Future implementation should include fixtures for:

- public-safe APW knowledge object;
- internal APGI strategy object;
- tenant A record;
- tenant B record;
- missing metadata object;
- contradictory metadata object;
- expired source;
- superseded source;
- canon source;
- lower-authority conflicting public source;
- secret source;
- user-supplied current-session content.

---

## 5. Red Evidence Required Before Build-to-Green

Before implementation builders are appointed, a future implementation wave must define tests or validation scripts that initially fail for the red cases above.

Evidence must show:

1. the unsafe retrieval attempt;
2. the expected blocked/degraded/fallback behaviour;
3. the metadata/filter/authority rule being tested;
4. the intended green behaviour;
5. the artifact requirement traced back to FRS/TRS.

---

## 6. Batch 2 QA Disposition

This QA-to-Red artifact is prebuild-only. It does not create tests, code, migrations, retrieval services, metadata records, embeddings, Supabase policies or runtime functionality.

It creates the validation expectation that future implementation must satisfy.
