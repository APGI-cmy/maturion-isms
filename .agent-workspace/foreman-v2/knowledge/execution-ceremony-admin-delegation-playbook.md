# Foreman v2 — Execution Ceremony Admin Delegation Playbook

**Purpose**: Operational guide for when Foreman appoints `execution-ceremony-admin-agent` during Phase 4.

## When to appoint

Foreman appoints `execution-ceremony-admin-agent` only after:
- substantive readiness is accepted by Foreman
- the wave already has a valid IAA pre-brief
- the remaining work is administrative bundle preparation, not substantive build work

## What Foreman delegates

Foreman MAY delegate:
- PREHANDOVER proof assembly
- session memory assembly
- evidence bundle collation
- merge-gate parity preparation
- §4.3c Pre-IAA commit-state verification

Foreman MUST NOT delegate:
- substantive readiness judgment
- builder appointment
- builder remediation orders
- IAA invocation
- final merge-gate release
- final accountability for bundle completeness

## Required wave-current-tasks fields when appointed

Add or complete the following fields in `wave-current-tasks.md`:
- `ceremony_admin_appointed: YES`
- `ceremony_admin_agent: execution-ceremony-admin-agent`
- `ceremony_admin_scope: <administrative bundle preparation only>`
- `ceremony_admin_return_gate: Foreman review required before IAA invocation`

## Return bundle checklist

The ceremony-admin return bundle should include:
- PREHANDOVER proof path
- session memory path
- evidence bundle paths
- merge-gate parity result
- commit-state gate result
- residual admin notes for Foreman review

## Invariants

- Foreman remains accountable
- PREHANDOVER proof remains immutable after commit
- IAA remains independent
- ceremony-admin is not a substitute for Foreman or IAA
