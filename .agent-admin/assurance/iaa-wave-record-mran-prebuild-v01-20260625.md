# IAA Wave Record — MRAN Prebuild v0.1

**Wave ID**: MRAN-PREBUILD-V01  
**Repository**: `APGI-cmy/maturion-isms`  
**Date**: 2026-06-25  
**Scope Declaration**: `.agent-admin/scope-declarations/pr-1855.md`  
**Related Artifacts**:

- `.agent-admin/scope-declarations/maturion-runtime-agent-network-prebuild-v01.md`
- `.agent-admin/scope-declarations/pr-1855.md`
- `Maturion/prebuild/runtime-agent-network/MRAN-FRS-v0.1.md`
- `Maturion/prebuild/runtime-agent-network/MRAN-TRS-context-envelope-runtime-registry-v0.1.md`
- `Maturion/prebuild/runtime-agent-network/MRAN-QA-to-Red-v0.1.md`

---

## PRE-BRIEF

IAA_PREFLIGHT_BRIEF
PR: #1855
WAVE: MRAN-PREBUILD-V01
WAVE_TASKS_PATH: .agent-workspace/foreman-v2/personal/wave-current-tasks.md
CURRENT_HEAD_SHA: ACTIVE_HEAD_RESOLVED_BY_GATE

### EXPECTED_QA_SCOPE

- Review the scope declaration, FRS, TRS, and QA-to-Red artifacts for architectural completeness.
- Confirm the work is prebuild-only and does not implement runtime code, Supabase changes, registry activation, specialist activation, or `.github/agents` changes.
- Confirm the artifacts preserve the canonised separation between builder/governance agents and runtime/onboard app agents.
- Confirm Runtime Maturion remains the single user-facing interface and final synthesiser.
- Confirm context-envelope and runtime-registry requirements are sufficient to prevent unsafe specialist invocation.
- Confirm QA-to-Red expectations are adequate for a later builder implementation wave.

### EXPECTED_FAILURE_MODES

- Batch 1 artifacts accidentally create or imply runtime specialist activation.
- Strategy-named or `.github/agents` agents are treated as runtime-active without registry activation.
- Context envelope fields are insufficient to distinguish public, authenticated, tenant-scoped, superuser, and governance contexts.
- Runtime registry records do not enforce status, app, embodiment, permission-scope, knowledge-plane, authority-limit, and guardrail checks.
- Public or unauthenticated context could access tenant/customer knowledge.
- Maturion-as-CS2 authority could be inferred from architecture, runtime code, config, or app context without separate canon-backed evidence.
- QA-to-Red cases do not fail closed when context, registry, authority, or knowledge boundaries are missing.

### FOREMAN_INSTRUCTIONS

- Treat this wave as prebuild-only.
- Do not appoint a builder from this wave.
- Do not implement code, migrations, schemas, registry storage, runtime routing, retrieval, memory writes, or specialist activation.
- Do not modify `.github/agents` files.
- Use IAA findings to correct prebuild artifacts before any implementation wave is created.
- Keep Batch 2 knowledge-grounding prebuild and Batch 3 APW-specialist prebuild as separate future waves.

### IAA_WILL_QA

- IAA will compare the artifacts against `FOREMAN_OPERATING_MODEL.md`, `.github/agents/foreman-v2-agent.md`, `governance/canon/MATURION_AGENT_NETWORK_ORGANIGRAM.md`, and the Maturion Agent Network Organigram strategy.
- IAA will check whether the active PR scope declaration matches the changed-file set.
- IAA will check that the FRS contains explicit runtime behaviour, non-scope, lifecycle, and prohibited-behaviour requirements.
- IAA will check that the TRS defines a sufficient context envelope and runtime registry model.
- IAA will check that QA-to-Red includes failure cases for missing context, missing registry activation, public/tenant boundary violation, knowledge-plane leakage, build/runtime confusion, and improper Maturion-as-CS2 authority.
- IAA will not issue final assurance inside this pre-brief block.

RESULT: PREFLIGHT_BRIEF_COMPLETE

---

## NON-IMPLEMENTATION BOUNDARY

This wave does not:

- create runtime code;
- alter application behaviour;
- create or mutate Supabase tables;
- create or activate runtime specialists;
- create APW specialist;
- create ISMS specialist;
- change `.github/agents` files;
- implement gateway routing;
- implement retrieval;
- implement memory writes;
- grant Maturion CS2 authority.

---

## REQUESTED IAA OUTPUT

IAA should provide a later independent assurance verdict or rejection package after reviewing the prebuild artifact set.

This file records the pre-brief only. It does not contain IAA final assurance, a merge verdict, or CS2 approval.
