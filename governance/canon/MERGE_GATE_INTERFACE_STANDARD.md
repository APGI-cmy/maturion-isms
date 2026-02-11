# MERGE GATE INTERFACE STANDARD

## Status
**Type**: Canonical Governance Policy  
**Authority**: CS2 (Johan Ras)  
**Version**: 1.0.0  
**Effective Date**: 2026-02-10  
**Owner**: Governance Administrator  
**Precedence**: Subordinate to FM_MERGE_GATE_MANAGEMENT_PROTOCOL.md, PR_GATE_EVALUATION_AND_ROLE_PROTOCOL.md

---

## 1. Purpose

This canon defines the **standardized merge gate interface** that every governed repository must expose. It establishes fixed check contexts so branch protection can be stable and deterministic across repos.

---

## 2. Standard Workflow + Job Names

**Workflow name (exact)**: `Merge Gate Interface`

**Job names (exact)**:
- `merge-gate/verdict`
- `governance/alignment`
- `stop-and-fix/enforcement`

**Required check contexts** (branch protection must require only these):
- `Merge Gate Interface / merge-gate/verdict`
- `Merge Gate Interface / governance/alignment`
- `Merge Gate Interface / stop-and-fix/enforcement`

---

## 3. Required Triggers

- `on: pull_request` is **mandatory**
- `on: push` is optional but may not replace PR trigger

---

## 4. Deterministic PR Classification Rules

Classification MUST be deterministic and based on **changed paths, labels, and branch patterns**.

**Rule order (first match wins)**:
1. **Label override**: If label `governance-only` or `docs-only` exists → classify accordingly
2. **Governance change**: Any change under `governance/**`, `.agent`, `.agent-admin/**`
3. **Docs-only**: Only files in `docs/**` or `**/*.md` and no governance changes
4. **Code change**: All remaining cases

**Branch patterns**:
- `release/*` and `hotfix/*` are always **code change**

---

## 5. Verdict Gate Responsibility

`merge-gate/verdict` must:
- Validate required evidence artifacts exist
- Validate evidence schemas (machine-readable)
- Enforce no-minimizing-language policy
- Fail fast with short, evidence-first messages

**Prohibited**:
- ❌ Log archaeology
- ❌ Manual inspection requirements
- ❌ Narrative-only compliance claims

---

## 6. Alignment Gate Responsibility

`governance/alignment` must:
- Verify canonical governance alignment state
- Detect drift via sha256 comparison
- Fail if alignment evidence is missing or stale

---

## 7. Stop-and-Fix Enforcement

`stop-and-fix/enforcement` must:
- Fail if a stop-and-fix condition is unresolved
- Require RCA when stop-and-fix occurred
- Produce evidence-first error output

---

## 8. Branch Protection Rule

**Rule**: Branch protection must require **only** the three standard contexts listed above.

No repo-specific checks are allowed as required checks. Additional checks may run but must remain optional.
