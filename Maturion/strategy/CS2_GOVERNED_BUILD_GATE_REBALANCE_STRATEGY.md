# CS2 Governed Build Gate Rebalance Strategy

**Status**: Proposed strategy
**Owner / Merge Authority**: CS2
**Date**: 2026-05-31
**Applies to**: Maturion governed build system, CI gates, agent build governance, prebuild-to-handover evidence chain

---

## 1. Executive summary

This strategy records the intended role of CI gates in the Maturion build system.

The CI gates are not intended to replace human code review by checking whether implementation code is technically elegant. CS2 is not operating as a conventional developer reviewer. The gates exist to prove that the build stayed inside the governed build framework designed by CS2.

The correct function of the gates is therefore:

> Verify that the required governed process occurred, that the correct role-separated agents were invoked, that the work traces back to prebuild artifacts and QA-to-red labels, that the build-to-green proof is complete, and that ECAP / IAA / CS2 handover controls are satisfied where required.

The current gate system contains useful controls, but it has become over-broad in some areas. In particular, it can classify narrow database/security remediation PRs as full product-delivery PRs and then demand UI-style functional evidence, IAA formatting, or other ceremony artifacts that do not match the actual risk profile. This creates admin loops and gate paradoxes.

This strategy preserves the build philosophy while making the gates more streamlined, class-specific, and effective.

---

## 2. CS2 build philosophy

Maturion follows a governed build philosophy designed for a CS2 owner who does not rely on reading source code as the primary control mechanism.

The system is based on the following principles:

1. **The app description is the first CS2 control point.**
   CS2 defines the intended application and its fully functional delivery expectations in detailed app description and prebuild artifacts.

2. **Build work must trace to prebuild artifacts.**
   Agents do not invent product scope during implementation. Build work must trace back to app description, functional requirements, architecture, implementation plan, QA-to-red tests, or other accepted prebuild artifacts.

3. **QA-to-red comes before build-to-green.**
   Builders do not simply build until the app appears to work. A build component must satisfy a predeclared QA-to-red / build-to-red label that points back to prebuild artifacts.

4. **Build once, build 100%.**
   99.9% is not 100%. A PR must not claim full delivery while hiding known partials, pending work, skipped tests, test debt, placeholder behavior, or unresolved regression risk.

5. **No test dodging or test debt.**
   Green status is invalid if achieved by weakening tests, deleting assertions, adding broad skips, hiding failures, or moving work out of scope without CS2 approval.

6. **No legacy conflict drift.**
   New work must not preserve conflicting legacy paths, duplicate implementations, or shadow behavior unless a deprecation/migration rule explicitly permits it.

7. **Role separation is mandatory.**
   A builder must not quality-assure their own work. The foreman orchestrates the build and switches into QP/quality mode to verify builder output. ECAP and IAA provide separate admin and independent assurance functions.

8. **Continuous improvement is part of the control system.**
   Failures must be recorded and converted into better rules, tests, gates, or playbooks so that the same class of failure is engineered out of future builds.

---

## 3. Role model

The gate system must preserve these role boundaries.

| Role | Function | Must not do |
|---|---|---|
| CS2 | Defines intent, accepts scope, authorizes merge/waiver | Read code as the primary quality control |
| Foreman | Orchestrates build, assigns builders, controls handover | Act as the sole unchecked builder for substantive work |
| Builder | Implements assigned build-to-green target | QA own work or self-certify final assurance |
| QP / Foreman QA mode | Verifies builder output against QA-to-red target | Rewrite scope to make build appear green |
| ECAP | Verifies admin/process ceremony and evidence completeness | Certify product functionality independently of QA/IAA |
| IAA | Independently assures handover and evidence integrity | Create the implementation it is assuring |

---

## 4. Problem statement

The existing gates are powerful but can become misaligned in four ways.

### 4.1 One-size-fits-all product delivery gating

A PR that touches `supabase/migrations/**` can be treated as product-facing and required to provide the same kind of functional delivery evidence as a UI/API feature. This is too broad. A security remediation database migration needs strict proof, but not necessarily a CTA map or UI journey proof.

### 4.2 Evidence files can create new gate obligations

Adding `.agent-admin/**` or assurance evidence to satisfy one gate may trigger governance-control rules that require more ceremony, creating recursive admin loops.

### 4.3 Gate formatting is sometimes treated as substance

A PR can satisfy the actual governance intent but still fail because a field is named or formatted differently than a regex expects. Formatting should be normalized or reported clearly; it should not become an infinite loop.

### 4.4 The gate asks the wrong first question

The correct first question is not: "Does this PR touch a risky-looking path?"

The correct first question is:

> What class of PR is this, what governed process applies to that class, and what evidence proves the process was followed?

---

## 5. Target gate architecture

The gate system should be refactored into a class-routed model.

```text
PR classifier
  -> PR class
  -> required evidence profile
  -> hard gates for that class
  -> advisory checks for non-applicable concerns
  -> CS2 merge / waiver authority
```

The classifier should route PRs into one primary class, with optional secondary flags.

### 5.1 Primary PR classes

| PR class | Description |
|---|---|
| `APP_FUNCTIONAL_BUILD` | UI/API/user-facing functional delivery work |
| `DATABASE_MIGRATION` | Schema, RLS, migration, seed, database policy changes |
| `SECURITY_REMEDIATION` | Security Advisor, access-control, auth, secret, vulnerability, or hardening work |
| `GOVERNANCE_CONTROL` | Canon, gate scripts, workflows, agent contracts, governance policy |
| `AGENT_CONTRACT` | Agent instructions, role definitions, operational contracts |
| `EVIDENCE_ONLY` | Evidence/admin artifacts only, no product or gate logic change |
| `REBASE_ONLY` | No substantive product/governance delta after rebase |
| `CS2_HOTFIX` | Explicit CS2-authorized urgent change with scoped override |

### 5.2 Secondary flags

| Flag | Meaning |
|---|---|
| `requires_ecap` | ECAP/admin ceremony is required |
| `requires_iaa` | IAA independent assurance is required |
| `requires_qp` | Foreman/QP quality verification is required |
| `requires_security_advisor` | Supabase/Security Advisor or similar external security proof required |
| `requires_preview_runtime` | Preview deployment/runtime verification required |
| `cs2_override_allowed` | CS2 may authorize merge despite advisory governance friction |

---

## 6. Evidence profiles by PR class

### 6.1 APP_FUNCTIONAL_BUILD

Hard evidence:

- App description or module description reference
- Prebuild artifact reference
- QA-to-red / build-to-red label
- Builder appointment
- Build-to-green proof
- Foreman/QP QA verdict
- ECAP artifact where required
- IAA final assurance where required
- Current-head binding or approved rebase-safe binding
- No hidden partials, test debt, placeholders, or skipped assertions

Hard blockers:

- Code/build/test failure
- Stub/test-dodging detection
- Missing QA-to-red linkage
- Builder self-QA without independent QP
- Missing required ECAP/IAA
- Functional pass claim with known partials

### 6.2 DATABASE_MIGRATION

Hard evidence:

- Migration purpose and linked finding/requirement
- Migration file path(s)
- Preview migration pass or equivalent database validation
- Verification SQL/result summary
- Rollback or safety note
- Post-merge deployment checklist
- Runtime smoke-test checklist for affected flows

Hard blockers:

- Migration syntax failure
- Preview migration failure
- Missing verification query evidence
- Missing production rollout checklist

Advisory only unless runtime/UI changes are present:

- CTA map
- UI journey proof
- Full functional-delivery artifact
- PR-diff IAA artifact

### 6.3 SECURITY_REMEDIATION

Hard evidence:

- Original finding or risk source
- Exact mitigation summary
- Preview or linter/security advisor result
- Access-control impact assessment
- Service-role/client-role impact notes where applicable
- Post-merge security re-check checklist
- CS2 risk acceptance

Hard blockers:

- Security tool still reports the same SQL-addressable finding
- Preview validation fails
- Access-control impact not assessed
- Regression smoke-test checklist absent

Advisory only unless product behavior changes:

- CTA map
- full UI user journey evidence

### 6.4 GOVERNANCE_CONTROL

Hard evidence:

- Governance rule or canon being changed
- Reason for change
- Before/after effect on agents/gates
- Gate-change validation or regression tests where scripts/workflows change
- ECAP/admin ceremony
- IAA assurance where required
- Ripple/cross-agent assessment

Hard blockers:

- Gate logic changed without validation
- Agent contract changed without role/ripple assessment
- Canon inventory mismatch where required

### 6.5 AGENT_CONTRACT

Hard evidence:

- Agent contract path
- Role boundary impact
- Downstream affected agents
- ECAP/IAA review
- Conflict check against existing canon

Hard blockers:

- Builder/QA/admin/IAA role separation weakened without CS2 approval
- Contract contradicts active canon

### 6.6 EVIDENCE_ONLY

Hard evidence:

- Evidence exactness
- PR identity binding
- No product files changed
- No gate logic changed

Hard blockers:

- Evidence references wrong PR/head/scope
- Evidence claims product delivery not present in the diff

Advisory only:

- Product-delivery gates
- Builder QA gates

### 6.7 REBASE_ONLY

Hard evidence:

- No substantive product/governance diff after rebase
- Existing evidence remains applicable
- No new product file changes after IAA/QP signoff

Hard blockers:

- Substantive product or governance delta hidden inside rebase

### 6.8 CS2_HOTFIX

Hard evidence:

- Explicit CS2 authorization
- Scoped justification
- Minimal technical validation appropriate to the change
- Follow-up debt/risk record if normal ceremony is deferred

Hard blockers:

- No CS2 authorization
- Scope exceeds hotfix declaration
- Security/build failure

---

## 7. Admin-loop prevention rules

The following rules should be encoded into the gates.

1. **Evidence added to satisfy a gate must not create a larger ceremony obligation by itself.**
   Evidence-only files may be validated for exactness, but should not escalate the PR into governance-control unless they change rules, canon, workflows, scripts, or agent contracts.

2. **A gate must not demand artifacts belonging to another PR class.**
   A database migration should not require UI CTA evidence unless the PR changes UI/API runtime behavior.

3. **A gate must report class mismatch clearly.**
   If a PR is classified incorrectly, the output should say which files or body markers caused classification and how to correct it.

4. **Rebase-only movement must not force full re-assurance.**
   If no substantive product/governance content changed, prior evidence can remain valid with rebase-safe binding.

5. **CS2 override must be explicit, scoped, and auditable.**
   CS2 may authorize merge over advisory governance friction, but not over hard technical/security failures unless a hotfix rule explicitly permits it.

---

## 8. CS2 Governance Manifest

The system should use a per-PR manifest as the routing source of truth.

Recommended path:

```text
.admin/prs/pr-<number>.json
```

Recommended fields:

```json
{
  "pr": 0,
  "class": "SECURITY_REMEDIATION",
  "owner": "CS2",
  "merge_authority": "CS2",
  "risk": "medium",
  "scope": [],
  "qa_to_red_reference": "",
  "requires_builder": false,
  "requires_qp": true,
  "requires_ecap": false,
  "requires_iaa": false,
  "requires_security_advisor_evidence": false,
  "requires_preview_runtime": false,
  "hard_gates": [],
  "advisory_gates": [],
  "cs2_override_allowed": true,
  "cs2_justification": ""
}
```

The manifest should not replace automated path detection. It should provide the declared intent and allow the gates to detect mismatches.

---

## 9. Gate behavior standard

Every gate should emit:

1. Detected PR class
2. Evidence profile selected
3. Hard blockers
4. Advisory findings
5. CS2 action required, if any
6. Whether the finding is a product/security defect or governance-process defect

Example:

```text
Detected PR class: SECURITY_REMEDIATION
Hard blockers: none
Advisory findings: product-delivery CTA evidence not applicable to this class
CS2 action: may merge after preview Security Advisor clean result and production checklist acknowledgement
```

---

## 10. Implementation roadmap

This strategy should be implemented in one controlled governance PR, but the implementation must be allowed to use explicit CS2 override if the old gates conflict with the new gate model.

### Phase 1 — Strategy adoption

- Commit this strategy under `Maturion/strategy/`.
- Mark it as CS2-approved direction.
- Use it as the authority for gate rebalance work.

### Phase 2 — Classifier and manifest alignment

- Add or update PR classifier logic.
- Teach gates to read `.admin/prs/pr-<number>.json` as a routing source.
- Add `class` / `pr_class` support if missing.
- Preserve existing path-based detection as mismatch detection, not as the sole routing authority.

### Phase 3 — Product-delivery gate split

Split product-delivery behavior into profiles:

- app functional build profile
- database migration profile
- security remediation profile
- evidence-only profile
- rebase-only profile

### Phase 4 — Admin-loop prevention

- Prevent `.functional-delivery/**` and `.agent-admin/assurance/**` files from escalating PR class by themselves unless they modify governance rules.
- Convert non-applicable evidence requirements into advisory output.

### Phase 5 — Regression tests

Add regression cases for:

- Supabase security remediation migration with Security Advisor evidence
- UI app functional build requiring full evidence
- governance workflow change requiring ECAP/IAA/gate validation
- evidence-only PR not triggering product-delivery gate
- rebase-only PR not requiring fresh IAA

---

## 11. Success criteria

The rebalance is successful when:

1. Full app builds still require the full governed build chain.
2. Builders still cannot self-QA.
3. QA-to-red / build-to-green linkage remains mandatory for app builds.
4. ECAP and IAA remain mandatory where the PR class requires them.
5. Security/database remediation PRs require the right proof, not UI ceremony.
6. Evidence-only fixes do not trigger recursive admin loops.
7. CS2 can understand why a PR is blocked without reading code.
8. Gates distinguish product/security defects from governance/advisory friction.

---

## 12. Core rule

The governing rule for the rebalance is:

> A gate must test compliance with the required governed process for the PR class. A gate must not demand artifacts belonging to another PR class. A gate must not create recursive evidence obligations merely because evidence was added to satisfy a prior gate.

This preserves the Maturion build philosophy while making the system more streamlined, auditable, and effective.
