# CS2 Governed Build Gate Class Routing Canon

**Version**: 1.0.0
**Status**: Canon
**Authority**: CS2
**Effective date**: 2026-06-01
**Layer-down status**: PUBLIC_API

---

## 1. Purpose

This canon defines how Maturion build gates must route pull requests by class before applying evidence requirements.

The gate system exists to verify that work stayed inside the governed build framework. It must not act as a conventional source-code review substitute, and it must not require evidence belonging to the wrong work class.

This canon is created after the ISMS gate rebalance strategy and implementation work that exposed a recurring admin-loop failure mode: narrow database or security remediation PRs were being treated as full app-functional delivery PRs and forced into UI-style functional ceremony.

---

## 2. Governing rule

A gate must test compliance with the governed process required for the PR class.

A gate must not:

1. demand artifacts belonging to another PR class;
2. allow a manifest to downgrade stricter evidence requirements proven by changed files;
3. create recursive evidence obligations merely because evidence was added to satisfy a prior gate;
4. treat governance formatting friction as a product/security defect unless the applicable canon makes that formatting a hard blocker.

---

## 3. Required PR classes

Gate systems that enforce product delivery or handover readiness must recognize these classes:

| PR class | Required meaning |
|---|---|
| `APP_FUNCTIONAL_BUILD` | UI/API/user-facing functional delivery or runtime behavior work. |
| `DATABASE_MIGRATION` | Schema, RLS, migration, seed, or database policy changes without app runtime changes. |
| `SECURITY_REMEDIATION` | Security Advisor, access-control, auth, secret, vulnerability, or hardening work. |
| `GOVERNANCE_CONTROL` | Canon, gate scripts, workflows, governance policy, or governance strategy changes. |
| `AGENT_CONTRACT` | Agent instructions, role definitions, operational contracts, or role-boundary rules. |
| `EVIDENCE_ONLY` | Evidence/admin artifacts only; no product files and no gate/governance logic changes. |
| `REBASE_ONLY` | No substantive product or governance delta after rebase. |
| `CS2_HOTFIX` | Explicit CS2-authorized urgent change with scoped justification. |

---

## 4. Path detection and manifest authority

### 4.1 Path detection remains authoritative for minimum risk

Changed-file detection is mandatory. A PR manifest may clarify intent, but it must not downgrade risk.

If changed files prove app/runtime work, the PR must be treated at least as `APP_FUNCTIONAL_BUILD` unless an explicit CS2 hotfix manifest is present and accepted by the hotfix gate.

If changed files prove database migration or security hardening work, the PR must be treated at least as `DATABASE_MIGRATION` or `SECURITY_REMEDIATION`.

If changed files prove governance-control or agent-contract work, product-delivery gates may delegate the PR out of product delivery, but governance-control gates must still evaluate it.

### 4.2 Manifest mismatch handling

A PR manifest class must be validated.

- Unknown classes fail fast.
- Manifest class conflicts must be reported clearly.
- Manifest class may raise strictness.
- Manifest class may not lower strictness below what changed files prove.

---

## 5. Evidence profiles

### 5.1 APP_FUNCTIONAL_BUILD

Hard evidence must include:

- app/module description or accepted prebuild reference;
- QA-to-red / build-to-red label;
- builder appointment reference;
- build-to-green proof;
- Foreman/QP verification;
- required ECAP evidence where applicable;
- required IAA assurance where applicable;
- current-head binding or accepted rebase-safe binding;
- no hidden partials, no test debt, no placeholders, and no skipped assertions hidden behind a green claim.

### 5.2 DATABASE_MIGRATION

Hard evidence must include:

- migration purpose and linked finding/requirement;
- changed migration path(s);
- preview migration pass or equivalent database validation;
- verification SQL/result summary;
- rollback or safety note where applicable;
- post-merge deployment checklist;
- smoke-test checklist for affected runtime flows.

CTA maps and UI journey proof are advisory unless runtime UI/API files changed.

### 5.3 SECURITY_REMEDIATION

Hard evidence must include:

- original security finding or risk source;
- exact mitigation summary;
- preview/security advisor/linter result where applicable;
- access-control impact assessment;
- service-role/client-role impact notes where applicable;
- post-merge security re-check checklist;
- CS2 risk acceptance.

CTA maps and full UI journey proof are advisory unless runtime UI/API files changed.

### 5.4 GOVERNANCE_CONTROL

Hard evidence must include:

- governance rule or canon being changed;
- reason for the change;
- before/after impact on agents and gates;
- gate-change validation when scripts/workflows change;
- ECAP/admin ceremony where required;
- IAA assurance where required;
- ripple/layer-down assessment.

### 5.5 AGENT_CONTRACT

Hard evidence must include:

- affected agent contract path;
- role-boundary impact;
- downstream affected agents;
- ECAP/IAA review where required;
- conflict check against active canon.

### 5.6 EVIDENCE_ONLY

Hard evidence must include:

- evidence exactness;
- PR identity binding;
- no product files changed;
- no gate logic, canon, workflow, or agent contract changed.

Evidence-only changes must not trigger product-delivery ceremony merely because they live in evidence directories.

### 5.7 REBASE_ONLY

Hard evidence must include:

- no substantive product/governance diff after rebase;
- existing evidence remains applicable;
- no new product file changes after QP/IAA signoff.

### 5.8 CS2_HOTFIX

Hard evidence must include:

- explicit CS2 authorization;
- non-placeholder scoped justification;
- minimal technical validation appropriate to the change;
- follow-up debt/risk record if normal ceremony is deferred.

---

## 6. Admin-loop prevention

Evidence added to satisfy a gate must not itself create a larger ceremony obligation unless it changes governance rules, gate logic, workflows, canon, or agent contracts.

Gate output must distinguish:

- product/security defects;
- process-governance defects;
- advisory/non-applicable evidence friction;
- CS2 action required.

---

## 7. Role-separation preservation

This canon does not weaken the role model.

For app functional builds:

- builders still build to green;
- builders still may not QA their own work;
- Foreman/QP still verifies builder output;
- ECAP still handles admin/process ceremony where required;
- IAA still independently assures handover where required;
- CS2 remains merge authority.

The class router reduces wrong-class evidence loops. It does not permit shortcutting the governed build chain for real app builds.

---

## 8. Layer-down instruction

Consumer repositories with product-delivery, preflight, handover, ECAP, or IAA gates must layer down this canon into their local gate scripts, templates, or operating guidance.

Layer-down implementations must include regression tests for at least:

1. app functional build still requiring full evidence;
2. database migration using migration evidence profile;
3. security remediation using security evidence profile;
4. evidence-only PR not triggering product-delivery ceremony;
5. governance-control PR delegated to governance gates;
6. manifest class not allowed to downgrade changed-file risk;
7. invalid manifest class failing fast;
8. CS2 hotfix placeholder justification rejected.
