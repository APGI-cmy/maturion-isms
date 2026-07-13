# CodexAdvisor — Runtime-Specialist Bundle Process

**Version**: 1.0.0  
**Date**: 2026-07-12  
**Authority**: CS2 Issue #1922  
**Applies to**: Orchestrator and specialist contract bundles for other agents only

This method covers agent-file-system design only. It supplements the applicable canonical role checklist and does not implement, deploy, register, route, activate, or operate a specialist.

## 1. Authority and Scope Gate

Read the exact CS2 issue and record target, permitted files, required outcomes, exclusions, acceptance criteria, assurance requirement, and hard stops. Confirm the target is not CodexAdvisor and that no product, schema, migration, test, CI, runtime adapter, provider, Supabase, Vercel, deployment, registry activation, routing activation, or specialist activation is authorised. Stop on ambiguity.

## 2. Current-State Audit

Read the target contract and relevant Tier 2 files. Record versions, class, contract pattern, four-phase completeness, authority controls, methods, registry/routing state, AIMC dependencies, QA-to-red obligations, graceful-degradation needs, and actual status. Do not infer activation from contract existence.

## 3. Bundle Definition

Define the smallest complete governed bundle:
1. Target-agent Tier 1 contract.
2. Required Tier 2 operational files.
3. Registry/routing proposal or separately authorised update.
4. AIMC dependency map.
5. QA-to-red traceability.
6. Truthful status and graceful degradation.
7. Diff record, PREHANDOVER, session memory, and independent IAA evidence.

Every component must map to an explicit issue requirement.

## 4. Thin-Core Rules

`thin_core_living` may be used only for an orchestrator when `four_phase_canonical` remains mandatory, all four phases remain operational, Tier 1 retains identity, authority, scope, prohibitions, escalation, phase scripts, and Tier 2 pointers, and no assurance, gate, OPOJD, evidence, memory, size, or protected-path control is weakened. It is never a four-phase exemption.

## 5. Tier 2 Requirements

Tier 2 must provide role method, input/output contract, authority checks, dependency and failure handling, truthfulness, graceful degradation, evidence, escalation, and QA/assurance traceability without secrets, production data, or unauthorised implementation.

## 6. Registry, Routing, and AIMC Mapping

For each integration point record current state, proposed entry or route, owner, dependency, readiness evidence, and separately authorised implementation issue where required. A proposal is not an active route. AIMC dependencies may be mapped but not implemented.

## 7. QA-to-Red Traceability

Map each requirement to observable behaviour, negative condition, evidence source, future implementation wave where outside scope, and assurance check. Do not claim tests exist unless committed tests are present under separate authority.

## 8. Activation-Readiness Gate

Use only truthful states: `PLANNED`, `UNAVAILABLE`, `DEGRADED`, `CONTRACT_READY`, `ACTIVATION_READY`, and `ACTIVE`. Contract-ready requires complete contract, Tier 2, evidence, and assurance. Activation-ready additionally requires separately authorised runtime, registry, routing, dependency, security, deployment, and validation evidence. Active means activation actually occurred. Contract existence alone proves none of these states.

## 9. Graceful Degradation and Review

Define behaviour when a specialist is unavailable, degraded, or returns invalid output. The fallback may not fabricate results or silently bypass controls. Maturion must review and validate specialist output before responding to a user.

## 10. Protected Boundaries and Completion

CodexAdvisor may modify other agents' contracts only under exact CS2 authority and may never modify its own contract. IAA remains independent and blocking; CS2 remains sole merge authority. Before handover confirm checklist and method loading, four phases, authorised paths, size, QP, parity, OPOJD, evidence, and draft PR state pending final IAA. Completion does not authorise implementation, propagation, activation, or a successor wave.