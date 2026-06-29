# IAA Wave Record — APW Specialist Prebuild v0.1

**Wave ID**: APW-SPEC-PREBUILD-V01  
**Repository**: `APGI-cmy/maturion-isms`  
**Date**: 2026-06-26  
**Scope Declaration**: `.agent-admin/scope-declarations/pr-1862.md`  
**Related Artifacts**:

- `.agent-admin/scope-declarations/maturion-apw-specialist-prebuild-v01.md`
- `.agent-admin/scope-declarations/pr-1862.md`
- `Maturion/prebuild/apw-specialist/APW-Specialist-Scope-Contract-v0.1.md`
- `Maturion/prebuild/apw-specialist/APW-Maturion-FRS-TRS-addendum-v0.1.md`
- `Maturion/prebuild/apw-specialist/APW-QA-to-Red-specialist-routing-v0.1.md`
- `.agent-admin/builder-appointments/apw-specialist-implementation-wave-builder-appointment-v0.1.md`

---

## PRE-BRIEF

IAA_PREFLIGHT_BRIEF:

schema_version: 1.0.0
result: PREFLIGHT_BRIEF_COMPLETE
wave_id: APW-SPEC-PREBUILD-V01
repository: APGI-cmy/maturion-isms
PR: 1862
CURRENT_HEAD_SHA: e8dd8c9ff272496387db9d3a44a17854682b56d4
scope_summary: Batch 3 prebuild-only APW Specialist contract and public Maturion routing artifacts.
authority: CS2 — Johan Ras

EXPECTED_QA_SCOPE:

- Review APW Specialist contract, APW public Maturion FRS/TRS addendum, QA-to-Red, and future builder appointment package.
- Confirm APW Specialist is defined only as a runtime app specialist candidate behind Maturion.
- Confirm the work is prebuild-only and does not implement runtime code, public chat, APW behaviour, Supabase changes, embeddings, retrieval services, runtime registry records, specialist activation or `.github/agents` changes.
- Confirm APW Specialist cannot receive tenant, internal, secret, private memory or authority-bound knowledge.
- Confirm public APW routing requires context-envelope, registry, metadata/filter and Maturion final-synthesis preconditions.
- Confirm QA-to-Red covers unsafe public routing, tenant/private leakage, direct retrieval bypass, premature activation, and authority claims.
- Confirm builder appointment package prepares a later implementation wave but does not appoint a builder to start now.

EXPECTED_FAILURE_MODES:

- APW Specialist is treated as active or invokable from prebuild documentation alone.
- APW Specialist receives tenant, internal, secret, private memory or customer-specific knowledge.
- Public APW Maturion routes to APW Specialist without valid context envelope or future ACTIVE registry record.
- Missing or unsafe metadata defaults to public-safe specialist input.
- APW Specialist performs direct retrieval or bypasses Maturion filtering.
- APW Specialist becomes the final public responder or claims CS2/APGI binding authority.
- Future builder appointment package is misread as current implementation authorisation.

FOREMAN_INSTRUCTIONS:

- Treat this wave as prebuild-only.
- Do not appoint a builder to start implementation from this wave.
- Do not implement code, migrations, schemas, retrieval services, embeddings, metadata storage, Supabase policies, runtime routing, memory writes or specialist activation.
- Do not modify `.github/agents` files.
- Do not create a runtime registry record.
- Use IAA findings to correct prebuild artifacts before any implementation wave is created.
- Keep later implementation and activation waves separate from this prebuild.

IAA_WILL_QA:

- IAA will compare Batch 3 artifacts against Batch 1 runtime agent network and Batch 2 knowledge grounding artifacts.
- IAA will check that APW Specialist remains behind Maturion and cannot become a public standalone authority.
- IAA will check public-safe knowledge boundaries and forbidden knowledge lists.
- IAA will check context-envelope, runtime registry and metadata/filter preconditions.
- IAA will check QA-to-Red coverage for public routing, private leakage, direct retrieval bypass, premature activation, final authority and unsafe fallback.
- IAA will check that the builder appointment package is future-only and does not trigger implementation.
- IAA will not issue final assurance inside this pre-brief block.

RESULT: PREFLIGHT_BRIEF_COMPLETE

---

## NON-IMPLEMENTATION BOUNDARY

This wave does not:

- create runtime code;
- alter application behaviour;
- create or mutate Supabase tables;
- run migrations;
- create embeddings;
- create retrieval services;
- create a runtime registry record;
- activate APW Specialist;
- create APW public chat;
- alter tenant isolation;
- write or read production tenant data;
- change `.github/agents` files;
- grant Maturion or APW Specialist CS2 authority;
- appoint a builder to start implementation now.

---

## REQUESTED IAA OUTPUT

IAA should provide a later independent assurance verdict or rejection package after reviewing the prebuild artifact set.

This file records the pre-brief only. It does not contain IAA final assurance, a merge verdict, or CS2 approval.
