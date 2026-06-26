# IAA Wave Record — MRKG Prebuild v0.1

**Wave ID**: MRKG-PREBUILD-V01  
**Repository**: `APGI-cmy/maturion-isms`  
**Date**: 2026-06-26  
**Scope Declaration**: `.agent-admin/scope-declarations/pr-1858.md`  
**Related Artifacts**:

- `.agent-admin/scope-declarations/maturion-runtime-knowledge-grounding-prebuild-v01.md`
- `.agent-admin/scope-declarations/pr-1858.md`
- `Maturion/prebuild/runtime-knowledge-grounding/MRKG-FRS-addendum-v0.1.md`
- `Maturion/prebuild/runtime-knowledge-grounding/MRKG-TRS-supabase-aimc-metadata-v0.1.md`
- `Maturion/prebuild/runtime-knowledge-grounding/MRKG-QA-to-Red-v0.1.md`

---

## PRE-BRIEF

IAA_PREFLIGHT_BRIEF:

schema_version: 1.0.0
result: PREFLIGHT_BRIEF_COMPLETE
wave_id: MRKG-PREBUILD-V01
repository: APGI-cmy/maturion-isms
PR: 1858
CURRENT_HEAD_SHA: bad7e7ba35a44ca7a9c3d7db14afbafa070c6629
scope_summary: Batch 2 prebuild-only knowledge-grounding artifacts for Runtime Maturion and governed specialists.
authority: CS2 — Johan Ras

EXPECTED_QA_SCOPE:

- Review the FRS addendum, TRS addendum and QA-to-Red artifacts for Runtime Maturion knowledge grounding.
- Confirm the work is prebuild-only and does not implement runtime code, Supabase changes, embeddings, retrieval services, metadata records, specialist activation or `.github/agents` changes.
- Confirm knowledge planes are sufficiently separated.
- Confirm public/private/tenant filters are explicit enough to prevent unsafe retrieval.
- Confirm source hierarchy and conflict behaviour are defined.
- Confirm missing metadata fails closed and does not default to public-safe.
- Confirm fallback behaviour avoids invented APGI facts and cross-tenant leakage.
- Confirm QA-to-Red expectations are adequate for a later builder implementation wave.

EXPECTED_FAILURE_MODES:

- Public Maturion can retrieve internal, restricted or tenant knowledge.
- Tenant-scoped retrieval can cross tenant or organisation boundaries.
- Missing metadata defaults to public, tenant-safe or retrieval-allowed.
- Lower-authority or stale sources override canon or newer approved artifacts.
- Specialists receive knowledge planes beyond the context envelope or registry limits.
- Fallback behaviour silently uses another tenant, private memory, unrestricted vector search or general model knowledge as approved APGI fact.
- Secret or restricted sources enter prompt context or audit traces without approved secret-handling architecture.

FOREMAN_INSTRUCTIONS:

- Treat this wave as prebuild-only.
- Do not appoint a builder from this wave.
- Do not implement code, migrations, schemas, retrieval services, embeddings, metadata storage, Supabase policies, runtime routing, memory writes or specialist activation.
- Do not modify `.github/agents` files.
- Use IAA findings to correct prebuild artifacts before any implementation wave is created.
- Keep Batch 3 APW Specialist Prebuild as a separate future wave.

IAA_WILL_QA:

- IAA will compare the artifacts against Batch 1 runtime-agent-network prebuild artifacts and the layered-down Maturion Agent Network Organigram canon.
- IAA will check that knowledge-plane separation aligns with context-envelope and runtime-registry requirements.
- IAA will check whether public, authenticated, tenant, governance and secret filters are clear and fail closed.
- IAA will check that source hierarchy and conflict handling preserve authority order.
- IAA will check that QA-to-Red covers public-safe retrieval, tenant isolation, missing metadata, source conflict, staleness, specialist limits, fallback behaviour and secret/restricted knowledge.
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
- upload or reclassify knowledge documents;
- create or activate runtime specialists;
- create APW specialist;
- create retrieval services;
- alter tenant isolation;
- write or read production tenant data;
- change `.github/agents` files;
- grant Maturion CS2 authority.

---

## REQUESTED IAA OUTPUT

IAA should provide a later independent assurance verdict or rejection package after reviewing the prebuild artifact set.

This file records the pre-brief only. It does not contain IAA final assurance, a merge verdict, or CS2 approval.
