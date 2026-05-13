# QA Builder — Tier 2 Knowledge Index

**Agent**: qa-builder
**Contract Version**: 4.0.0
**Knowledge Version**: 1.2.0
**Last Updated**: 2026-05-12
**Architecture**: `governance/canon/THREE_TIER_AGENT_KNOWLEDGE_ARCHITECTURE.md`

---

## Tier 2 Knowledge Contents

| File | Purpose | Version | Status |
|------|---------|---------|--------|
| `index.md` (this file) | Knowledge entry point, version reference, QA Risk-Radar | 1.2.0 | PRESENT |

---

## Preflight Attestation Standard

Phase 1 preflight attestation MUST be recorded as structured YAML in session memory.
Canonical format: `governance/templates/BUILDER_PREFLIGHT_YAML_STANDARD.md`

A prose narrative attestation is non-compliant from 2026-02-25 forward.

---

## Constitutional Canon References (Tier 1 — verified via CANON_INVENTORY)

- `governance/canon/LIVING_AGENT_SYSTEM.md` v6.2.0
- `governance/canon/AGENT_CONTRACT_ARCHITECTURE.md` v1.0.0
- `governance/canon/AGENT_CONTRACT_FILE_PROTECTION_POLICY.md` (AGCFPP-001)
- `BUILD_PHILOSOPHY.md`
- `governance/ROLE_APPOINTMENT_PROTOCOL.md`

---

## Operating Model Summary

QA Builder implements performance testing, security scanning, accessibility auditing,
compliance validation, and regression management. Operates under Foreman supervision.
Build Philosophy: Architecture → QA-to-Red → Build-to-Green → Validation.

---

## Phase 4 Role-Separation Discoverability

QA Builder functional-behaviour guidance for the role-separated model is maintained at:

- `governance/checklists/phase4-role-separation-operational-guidance.md` (see **§7 Builder QA Agent Tier 2 guidance**)

When producing product-facing evidence, align output with the verdict split expected by Phase 5 gates:

- `ADMIN_PASS: yes/no`
- `FUNCTIONAL_PASS: yes/no`
- `VERDICT: FULL_FUNCTIONAL_DELIVERY | PARTIAL_FUNCTIONAL_DELIVERY | ADMIN_ONLY | FAIL`

(`FULL_FUNCTIONAL_DELIVERY_VERDICT:` remains accepted as alias where legacy templates still include it.)

---

**Authority**: CS2 (Johan Ras) | **Living Agent System**: v6.2.0
**Canonical Source**: `APGI-cmy/maturion-foreman-governance`

---

## QA Risk-Radar

QA agents MUST actively identify the following risk patterns on every PR. For each pattern
identified, QA either mitigates it directly (within QA's authority) or issues explicit Foreman
instructions to mitigate before handover proceeds.

| Risk Pattern | Detection Trigger | Required Action |
|---|---|---|
| **Scope/diff mismatch** | PR diff contains changed files not listed in declared scope, or declared scope references files absent from diff | Flag mismatch; block MERGE_READY until scope or diff corrected |
| **Governing issue ambiguity** | Governing issue does not unambiguously describe what to build/change, or contains contradictory scope statements | Escalate to Foreman for CS2 clarification; do not proceed to build |
| **Historical reference mistaken for governing issue** | PR description or agent references a prior PR (e.g., "PR #NNNN exposed the gap") as if it were the governing issue | Reject; require a distinct governing issue with unambiguous acceptance criteria |
| **PR-body narrative mistaken for product-delivery claim** | Governance/admin narrative in PR body uses language that could be misread as a functional delivery claim | Ensure the PR body does not contain `USER_JOURNEY_COMPLETE:`, `FUNCTIONAL_PASS:`, `FULL_FUNCTIONAL_DELIVERY_VERDICT:` unless a real product-delivery is being claimed |
| **Gate-changing PR without current-PR gate-test evidence** | PR modifies a CI gate, workflow check, or merge gate logic without evidence that the gate was tested against the current PR's HEAD | Require gate-test evidence against current HEAD before MERGE_READY. Acceptable evidence: CI run URL showing the gate executed on this PR's branch, OR dry-run output showing correct PASS/FAIL behaviour. Evidence must cover both positive (gate passes when it should) and negative (gate blocks when it should) cases. A single green CI run that only exercises the pass path is insufficient if the blocking logic was modified. |
| **Handover claimed while checks are red** | Any `MERGE_READY`/`handover-ready`/`complete`/`FULL_FUNCTIONAL_DELIVERY_VERDICT` claim present in PR body or session memory while any required CI check is failing | Block MERGE_READY immediately; require all required checks to pass before claim is accepted |
| **Stale SHA/session evidence** | Evidence artifact (PREHANDOVER proof, IAA token, test output) references a commit SHA different from the current PR HEAD | Reject stale evidence; require evidence regenerated against current HEAD |
| **IAA token or final assurance based on stale head** | IAA ASSURANCE-TOKEN issued against a prior HEAD that has since been superseded by new commits | Invalidate token; re-invoke IAA against current HEAD before MERGE_READY |
| **Non-blocking nit left unresolved** | Any IAA or QA observation labelled "non-blocking" or "nit" remains unresolved at handover time | Per OVL-SMP-003: "non-blocking" means "not catastrophic", not "mergeable while unresolved" — resolve before MERGE_READY |
| **Product delivery evidence for governance/admin-only work** | IAA or QA requests runtime test output, user journey traces, or functional evidence for a PR that contains only governance/admin/gate changes with no product code in `apps/`/`modules/`/`packages/` | Apply gate/admin evidence model only (OVL-SAA-004); suppress product-delivery evidence requirement |
| **Governance/admin gate work not covered by regression tests** | PR modifies a gate, check, or admin control surface without both a positive regression test (gate passes when it should) and a negative regression test (gate blocks when it should) | Flag missing regression coverage; instruct Foreman to commission regression tests before MERGE_READY |
